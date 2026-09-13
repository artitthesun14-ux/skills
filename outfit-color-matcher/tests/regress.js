/* ยิงซ้ำหลายรอบทุกโหมด/ทุกโอกาส ตรวจ invariant ของ engine ทุกครั้ง */
const H = require("./helper.js");

(async () => {
  const browser = await H.launch();
  const R = H.reporter();
  const seed = [
    H.g("r1","top","tee-crew","#FFFFFF"), H.g("r2","top","polo","#2B3A67"), H.g("r3","top","hoodie","#C0392B"),
    H.g("r4","bottom","chino","#C8B79B"), H.g("r5","bottom","jeans-straight","#7A93B8"), H.g("r6","bottom","skirt","#17161A"),
    H.g("r7","outer","jacket","#4A5D8A"), H.g("r8","shoes","sneaker","#F2F0EB"), H.g("r9","shoes","boot","#6B4A2F"),
    H.g("r10","accessory","cap","#3F6B4F")
  ];
  const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
  const res = await page.evaluate(() => {
    const occs = OCCASIONS.map(o => o.id);
    const bad = [];
    let looks = 0, batches = 0;
    ["wardrobe","idea"].forEach(mode => {
      state.mode = mode;
      occs.forEach(occ => {
        state.occasion = occ;
        for(let i = 0; i < 50; i++){
          regenerate(true);
          batches++;
          if(!state.batch.length){ bad.push(mode+"/"+occ+": แบตช์ว่าง"); continue; }
          if(state.batch.length > 4) bad.push(mode+"/"+occ+": แบตช์เกิน 4 ("+state.batch.length+")");
          state.batch.forEach(o => {
            looks++;
            const bd = o.colorBreakdown;
            const sum = bd.reduce((a,b) => a + b.pct, 0);
            if(sum !== 100) bad.push(mode+"/"+occ+": % รวม "+sum);
            if(bd.filter(b => b.role === "primary").length !== 1) bad.push(mode+"/"+occ+": primary ไม่ใช่ 1");
            if(bd.filter(b => b.role === "accent").length > 1) bad.push(mode+"/"+occ+": accent เกิน 1");
            if(!o.advice.length) bad.push(mode+"/"+occ+": ไม่มีคำแนะนำ");
            if(Object.keys(o.items).length < 2) bad.push(mode+"/"+occ+": ชุดมีชิ้นเดียว");
            Object.keys(o.items).forEach(c => {
              const it = o.items[c];
              if(!it.shapeId || !SHAPE_BY_ID[it.shapeId]) bad.push(mode+"/"+occ+": shapeId ไม่รู้จัก "+it.shapeId);
              else if(SHAPE_BY_ID[it.shapeId].category !== c) bad.push(mode+"/"+occ+": ทรงผิดหมวด "+it.shapeId);
            });
          });
        }
      });
    });
    return { bad: bad.slice(0,8), n: bad.length, looks, batches };
  });
  R.ok(res.n === 0, "E1 · invariant ครบทุกชุด (% รวม 100, primary 1, accent <=1, >=2 ชิ้น, ทรงถูกหมวด)",
    res.batches + " แบตช์ / " + res.looks + " ชุด" + (res.n ? " · ตัวอย่างที่พัง: " + res.bad.join(" ; ") : ""));
  R.ok(errs.length === 0, "E2 · ไม่มี JS error สะสมหลังยิงซ้ำ " + res.batches + " แบตช์", errs.join(" | "));
  await ctx.close();
  await browser.close();
  R.finish([]);
})();
