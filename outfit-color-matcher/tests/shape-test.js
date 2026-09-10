const { chromium } = require("playwright-core");
const path = require("path");
const bin = "/opt/pw-browsers/chromium";
const url = "file://" + path.join(__dirname, "..", "outfit-color-matcher.html");

(async () => {
  const browser = await chromium.launch({ executablePath: bin, args:["--no-sandbox"] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs=[]; page.on("pageerror",e=>errs.push(e.message));
  await page.goto(url); await page.waitForTimeout(600);

  const r = await page.evaluate(() => {
    const out = [];
    const ok=(c,m)=>out.push([!!c,m]);
    // registry <-> symbols
    ok(SHAPES.length === 21, "registry มี 21 ทรง (ได้ "+SHAPES.length+")");
    ok(SHAPES.every(s => document.getElementById("sh-"+s.id)), "ทุกทรงในทะเบียนมี <symbol> จริง");
    const syms = [...document.querySelectorAll('symbol[id^="sh-"]')].map(s=>s.id.slice(3));
    ok(syms.every(id => SHAPE_BY_ID[id]), "ไม่มี <symbol> ที่ไม่อยู่ในทะเบียน");
    ok(new Set(syms).size === syms.length, "ไม่มี id ซ้ำ");
    // ทุกหมวดมีทรงเริ่มต้นที่ถูกหมวด
    ok(Object.keys(DEFAULT_SHAPE).every(c => SHAPE_BY_ID[DEFAULT_SHAPE[c]] && SHAPE_BY_ID[DEFAULT_SHAPE[c]].category === c),
       "ทรงเริ่มต้นทุกหมวดมีจริงและอยู่ถูกหมวด");
    ok(Object.keys(DEFAULT_SHAPE).every(c => shapesFor(c).length > 0), "ทุกหมวดมีทรงให้เลือกอย่างน้อย 1");
    // fallback
    ok(resolveShape("ไม่มีจริง","top").fellBack === true && resolveShape("ไม่มีจริง","top").shape.id === "tee-crew", "shapeId มั่ว -> fallback + ธง");
    ok(resolveShape("chino","bottom").fellBack === false, "shapeId ถูก -> ไม่ fallback");
    ok(resolveShape("chino","top").fellBack === true, "ทรงผิดหมวด -> fallback");
    // เส้นตามความสว่าง
    ok(garmentLine("#FFFFFF").indexOf("rgba(0,0,0") === 0, "เสื้อขาว -> เส้นเข้ม");
    ok(garmentLine("#17161A").indexOf("rgba(255,255,255") === 0, "เสื้อดำ -> เส้นสว่าง");
    // engine invariants ผ่านชุดที่เจนจริง
    const looks = state.batch || [];
    ok(looks.length >= 3 && looks.length <= 4, "แบตช์ละ 3-4 ชุด (ได้ "+looks.length+")");
    let sumOK = true, roleOK = true, shapeOK = true;
    looks.forEach(function(lk){
      const bd = lk.colorBreakdown || [];
      const total = bd.reduce((a,b)=>a+b.pct,0);
      if(total !== 100) sumOK = false;
      const prim = bd.filter(b=>b.role==="primary").length;
      const acc  = bd.filter(b=>b.role==="accent").length;
      if(prim !== 1 || acc > 1) roleOK = false;
      Object.keys(lk.items||{}).forEach(function(cat){
        const it = lk.items[cat];
        if(!it) return;
        if(!it.shapeId || !SHAPE_BY_ID[it.shapeId]) shapeOK = false;
        if(SHAPE_BY_ID[it.shapeId] && SHAPE_BY_ID[it.shapeId].category !== cat) shapeOK = false;
      });
    });
    ok(sumOK, "สัดส่วน % รวมได้ 100 พอดีทุกชุด");
    ok(roleOK, "ทุกชุดมี Primary 1 และ Accent ไม่เกิน 1");
    ok(shapeOK, "ทุกชิ้นในชุดที่เจนมี shapeId ที่รู้จัก");
    // seed
    ok(state.wardrobe.every(g => g.shapeId && SHAPE_BY_ID[g.shapeId] && SHAPE_BY_ID[g.shapeId].category === g.category),
       "ชุดตัวอย่างในตู้มี shapeId ถูกหมวดครบ");
    ok(state.wardrobe.every(g => !("photo" in g)), "ไม่มีฟิลด์ photo หลงเหลือ");
    return out;
  });

  let fail = 0;
  r.forEach(([c,m])=>{ console.log((c?"PASS":"FAIL")+" · "+m); if(!c) fail++; });
  await browser.close();
  console.log(errs.length ? "\nJS ERRORS:\n"+errs.join("\n") : "\nไม่มี JS error");
  console.log(fail ? fail+" ข้อไม่ผ่าน" : "ผ่านทั้งหมด ("+r.length+" ข้อ)");
  process.exit(fail||errs.length ? 1 : 0);
})();
