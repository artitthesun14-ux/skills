const { chromium } = require("playwright-core");
const path = require("path");
const BIN = "/opt/pw-browsers/chromium";
/* ทดสอบไฟล์ที่ build แล้ว ไม่ใช่ app.html: ผู้ใช้เปิดไฟล์นี้จริง */
const URL = "file://" + path.join(__dirname, "..", "outfit-color-matcher.html");
const KEY = "outfit-color-matcher.v1";

async function launch(){ return chromium.launch({ executablePath: BIN, args:["--no-sandbox"] }); }

/* เปิดหน้าใหม่แบบสะอาด: seed = object ที่จะยัดลง localStorage ก่อนโหลด (null = ว่าง)
   block = "all" (localStorage ใช้ไม่ได้เลย) | "quota" (setItem โยน QuotaExceededError) */
async function open(browser, seed, opts){
  opts = opts || {};
  const ctx = await browser.newContext(opts.context || {});
  const page = await ctx.newPage();
  const errs = [], reqs = [];
  page.on("pageerror", e => errs.push(e.message));
  page.on("request", r => { if(!r.url().startsWith("file://")) reqs.push(r.url()); });
  if(seed){
    /* seed แค่ครั้งแรก: reload ต้องเห็นสิ่งที่แอปเขียนเอง ไม่ใช่ค่า seed ทับซ้ำ */
    await page.addInitScript(([k,v]) => {
      try{ if(localStorage.getItem(k) === null) localStorage.setItem(k, v); }catch(e){}
    }, [KEY, JSON.stringify(seed)]);
  }
  if(opts.block === "all"){
    await page.addInitScript(() => {
      const boom = () => { throw new DOMException("blocked","SecurityError"); };
      Storage.prototype.getItem = boom; Storage.prototype.setItem = boom;
      Storage.prototype.removeItem = boom;
    });
  }
  if(opts.block === "quota"){
    await page.addInitScript(() => {
      Storage.prototype.setItem = function(){ throw new DOMException("full","QuotaExceededError"); };
    });
  }
  await page.goto(URL);
  await page.waitForTimeout(opts.wait || 450);
  return { ctx, page, errs, reqs };
}

function store(wardrobe, settings){
  return { wardrobe: wardrobe, favorites: [],
           settings: Object.assign({ mode:"wardrobe", occasion:"unspecified" }, settings||{}) };
}
function g(id, cat, shapeId, color, name){
  return { id:id, name:name || (id+" "+cat), category:cat, shapeId:shapeId, color:color };
}

function reporter(){
  const rows = [];
  return {
    ok(cond, msg, detail){ rows.push({ pass: !!cond, msg: msg, detail: detail || "" }); },
    rows,
    finish(errs){
      rows.forEach(r => console.log((r.pass?"PASS":"FAIL") + " · " + r.msg + (r.detail ? "  [" + r.detail + "]" : "")));
      const bad = rows.filter(r => !r.pass).length;
      if(errs && errs.length) console.log("\nJS ERRORS:\n" + errs.join("\n"));
      console.log("\n" + (bad ? bad + " ข้อไม่ผ่าน จาก " + rows.length : "ผ่านทั้งหมด " + rows.length + " ข้อ"));
      process.exit(bad || (errs && errs.length) ? 1 : 0);
    }
  };
}
module.exports = { launch, open, store, g, reporter, KEY, URL };
