const { chromium } = require("playwright-core");
const path = require("path");
const bin = "/opt/pw-browsers/chromium";
const url = "file://" + path.join(__dirname, "..", "outfit-color-matcher.html");

(async () => {
  const browser = await chromium.launch({ executablePath: bin, args:["--no-sandbox"] });
  let fail = 0; const ok=(c,m)=>{console.log((c?"PASS":"FAIL")+" · "+m); if(!c)fail++;};

  // === เคส A: ผู้ใช้เวอร์ชันเดิม (ไม่มี shapeId + มี photo ค้าง) ===
  let ctx = await browser.newContext();
  let page = await ctx.newPage();
  const errs=[]; page.on("pageerror",e=>errs.push(e.message));
  await page.goto(url);
  await page.evaluate(() => {
    localStorage.setItem("outfit-color-matcher.v1", JSON.stringify({
      wardrobe:[
        { id:"old1", name:"เสื้อเก่า",  category:"top",    color:"#2B3A67", photo:"data:image/jpeg;base64,AAAA" },
        { id:"old2", name:"กางเกงเก่า", category:"bottom", color:"#C8B79B" }
      ],
      favorites:[], settings:{ mode:"wardrobe", occasion:"work", theme:"system" }
    }));
  });
  await page.reload(); await page.waitForTimeout(600);
  const migBanner = await page.locator("text=เลือกทรงเสื้อผ้าจากคลังแทนการอัปโหลดรูป").count();
  ok(migBanner > 0, "ผู้ใช้เดิม: ขึ้น banner แจ้งว่าเปลี่ยนมาใช้ทรง (ไม่เปลี่ยนเงียบ)");
  const stored = await page.evaluate(()=>JSON.parse(localStorage.getItem("outfit-color-matcher.v1")).wardrobe);
  ok(stored.every(g=>g.shapeId && !("photo" in g)), "ผู้ใช้เดิม: เติม shapeId + ลบ photo แล้วเขียนกลับลงเครื่อง");
  ok(stored[0].shapeId==="tee-crew" && stored[1].shapeId==="jeans-straight", "ผู้ใช้เดิม: ได้ทรงเริ่มต้นของหมวดที่ถูก");
  const svgCount = await page.locator("#wardrobeSlot svg.shape").count();
  ok(svgCount === 2, "ผู้ใช้เดิม: เรนเดอร์เป็นทรง SVG ครบ "+svgCount+" ชิ้น ไม่มีช่องว่าง");
  await ctx.close();

  // === เคส B: shapeId มั่ว -> fallback + ป้าย "ทรงเริ่มต้น" ===
  ctx = await browser.newContext(); page = await ctx.newPage();
  page.on("pageerror",e=>errs.push(e.message));
  await page.goto(url);
  await page.evaluate(() => {
    localStorage.setItem("outfit-color-matcher.v1", JSON.stringify({
      wardrobe:[
        { id:"b1", name:"ของพัง", category:"top",    shapeId:"ไม่มีทรงนี้", color:"#3F6B4F" },
        { id:"b2", name:"ปกติ",   category:"bottom", shapeId:"chino",       color:"#C8B79B" }
      ],
      favorites:[], settings:{ mode:"wardrobe", occasion:"unspecified", theme:"system" }
    }));
  });
  await page.reload(); await page.waitForTimeout(600);
  ok(await page.locator("#wardrobeSlot svg.shape").count() === 2, "shapeId มั่ว: ยังเรนเดอร์ครบ ไม่พัง ไม่ว่าง");
  const useHref = await page.locator("#wardrobeSlot svg.shape use").first().getAttribute("href");
  ok(useHref === "#sh-tee-crew", "shapeId มั่ว: ตกไปทรงเริ่มต้นของหมวด (ได้ "+useHref+")");
  ok(await page.locator("#sec-wardrobe .badge", { hasText:"ทรงเริ่มต้น" }).count() > 0, "shapeId มั่ว: มีป้ายบอกว่าใช้ทรงเริ่มต้น (ไม่เงียบ)");
  const keptB = await page.evaluate(()=>JSON.parse(localStorage.getItem("outfit-color-matcher.v1")).wardrobe);
  ok(keptB[0].shapeId === "ไม่มีทรงนี้" && keptB[1].shapeId === "chino", "shapeId มั่ว: ไม่เขียนทับค่าเดิมในเครื่อง (สัญญา shapeId ถาวร)");
  await ctx.close();

  // === เคส C: เสื้อขาวจัด/ดำสนิท เส้นสลับความเข้มจริงในหน้า ===
  ctx = await browser.newContext(); page = await ctx.newPage();
  await page.goto(url); await page.waitForTimeout(500);
  const lines = await page.evaluate(() => {
    const out = {};
    document.querySelectorAll("#wardrobeSlot .gchip").forEach(el => {
      const nm = el.querySelector(".gchip__name").textContent;
      const sv = el.querySelector("svg.shape");
      out[nm] = sv.style.getPropertyValue("--garment-line").trim();
    });
    return out;
  });
  ok(/^rgba\(0,0,0/.test(lines["เสื้อเชิ้ตขาว"]||""), "เสื้อขาว #FFFFFF ในหน้าจริง -> เส้นเข้ม");
  ok(/^rgba\(255,255,255/.test(lines["กระโปรงดำ"]||""), "กระโปรงดำ #17161A ในหน้าจริง -> เส้นสว่าง");
  await ctx.close();

  await browser.close();
  console.log(errs.length ? "\nJS ERRORS:\n"+errs.join("\n") : "\nไม่มี JS error");
  console.log(fail ? fail+" ข้อไม่ผ่าน" : "ผ่านทั้งหมด");
  process.exit(fail||errs.length ? 1 : 0);
})();
