/* ไล่ acceptance criteria ของ FR-0 / FR-1 และสถานะใน spec §7C */
const H = require("./helper.js");

/* reload แล้วค่าหาย = เขียน localStorage ยังไม่ทันตอนสั่ง reload ไม่ใช่บั๊กของแอป
   รอให้ค่าที่คาดว่าจะถูกบันทึกโผล่ใน localStorage จริงก่อน แล้วค่อย reload */
const waitPersisted = (page, check) => page.waitForFunction(check, null, { timeout: 4000 });

(async () => {
  const browser = await H.launch();
  const R = H.reporter();
  const allErrs = [];
  const snap = p => p.evaluate(() => JSON.parse(JSON.stringify({
    wardrobe: state.wardrobe, mode: state.mode, index: state.index,
    keys: state.batch.map(outfitKey), n: state.batch.length,
    result: state.result ? Object.keys(state.result) : null
  })));

  async function addItem(page, cat, shape, preset, name){
    await page.click("#addBtn");
    await page.click('[data-cat="'+cat+'"]');
    await page.click('[data-shape="'+shape+'"]');
    await page.click('[data-preset="'+preset+'"]');
    if(name) await page.fill("#fName", name);
    await page.click("#gForm button[type=submit]");
    await page.waitForTimeout(120);
  }

  /* ============ A. FR-0 ตู้เสื้อผ้า ============ */
  {   /* A1 + A2 */
    const { ctx, page, errs } = await H.open(browser, H.store([]));
    await page.click("#addBtn");
    await page.click('[data-cat="top"]');
    await page.click('[data-shape="polo"]');
    await page.click('[data-preset="#3F6B4F"]');
    const prev = await page.evaluate(() => {
      const sv = document.querySelector("#fPreview svg.shape");
      return { fill: sv.style.getPropertyValue("--garment-fill").trim(),
               use: sv.querySelector("use").getAttribute("href"),
               name: document.querySelector("#fPrevName").textContent };
    });
    R.ok(prev.fill.toUpperCase() === "#3F6B4F" && prev.use === "#sh-polo",
      "A2 · FR-0 AC2: พรีวิวอัปเดตสดตามทรงและสีก่อนบันทึก", prev.use + " " + prev.fill);
    await page.fill("#fName", "โปโลเขียว");
    await page.click("#gForm button[type=submit]");
    await page.waitForTimeout(150);
    const before = await snap(page);
    R.ok(before.wardrobe.length === 1 && before.wardrobe[0].shapeId === "polo" && before.wardrobe[0].color === "#3F6B4F",
      "A1a · FR-0 AC1: ชิ้นใหม่เข้าตู้พร้อมทรงและสีที่เลือก");
    const shownBefore = await page.locator('#wardrobeSlot use[href="#sh-polo"]').count();
    await waitPersisted(page, () => {
      try { return (JSON.parse(localStorage.getItem("outfit-color-matcher.v1")||"{}").wardrobe||[]).length === 1; }
      catch(e){ return false; }
    });
    await page.reload(); await page.waitForTimeout(450);
    const after = await snap(page);
    const shownAfter = await page.locator('#wardrobeSlot use[href="#sh-polo"]').count();
    R.ok(shownBefore === 1 && shownAfter === 1 && after.wardrobe.length === 1 && after.wardrobe[0].name === "โปโลเขียว",
      "A1b · FR-0 AC1: ยังอยู่ครบหลังรีเฟรช (localStorage)");
    const keys = Object.keys(after.wardrobe[0]).sort().join(",");
    R.ok(keys === "category,color,id,name,shapeId",
      "A2b · FR-0 AC2: เก็บแค่ shapeId + color ไม่มีฟิลด์ไฟล์ภาพ", keys);
    allErrs.push(...errs); await ctx.close();
  }
  {   /* A3: localStorage ถูกบล็อก */
    const { ctx, page, errs } = await H.open(browser, null, { block:"all" });
    const banner = await page.locator("#storageBannerSlot", { hasText:"บันทึกข้อมูลถาวรไม่ได้" }).count();
    R.ok(banner > 0, "A3a · FR-0 AC3: localStorage ถูกบล็อก -> มีแบนเนอร์บอกว่าไม่บันทึกถาวร");
    await addItem(page, "top", "hoodie", "#2B3A67", "ฮู้ดกรม");
    const s = await snap(page);
    R.ok(s.wardrobe.some(x => x.name === "ฮู้ดกรม"), "A3b · FR-0 AC3: ยังเพิ่ม/ใช้งานในเซสชันได้ทั้งที่บันทึกไม่ได้");
    R.ok(errs.length === 0, "A3c · FR-0 AC3: ไม่มี JS error ตอน storage ถูกบล็อก", errs.join(" | "));
    await ctx.close();
  }
  {   /* A4: แก้ทรงกับสีแยกกัน */
    const seed = [H.g("e1","top","polo","#2B3A67","เสื้อโปโลกรม"), H.g("e2","bottom","chino","#C8B79B","ชิโนเบจ")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed));
    await page.click('[data-more="e1"]'); await page.click('[data-edit="e1"]');
    await page.waitForTimeout(80);
    await page.click('[data-preset="#C0392B"]');
    await page.click("#gForm button[type=submit]"); await page.waitForTimeout(120);
    const fb = await page.locator("#wardFeedback").textContent();
    let s = await snap(page);
    const it = s.wardrobe.find(x => x.id === "e1");
    R.ok(it.color === "#C0392B" && it.shapeId === "polo" && it.name === "เสื้อโปโลกรม" && it.category === "top",
      "A4a · FR-0 AC4: แก้เฉพาะสี ฟิลด์อื่นคงเดิม", JSON.stringify(it));
    R.ok(/แก้ไข/.test(fb), "A4b · ux §7B: ข้อความหลังแก้ไขต้องบอกว่าแก้ไข ไม่ใช่ 'เพิ่มเข้าตู้'", "ได้: " + fb);
    await page.click('[data-more="e1"]'); await page.click('[data-edit="e1"]');
    await page.waitForTimeout(80);
    await page.click('[data-shape="tank"]');
    await page.click("#gForm button[type=submit]"); await page.waitForTimeout(120);
    s = await snap(page);
    const it2 = s.wardrobe.find(x => x.id === "e1");
    R.ok(it2.shapeId === "tank" && it2.color === "#C0392B" && it2.name === "เสื้อโปโลกรม",
      "A4c · FR-0 AC4: แก้เฉพาะทรง สีและชื่อคงเดิม", JSON.stringify(it2));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* A6: ลบต้องมี confirm */
    const seed = [H.g("d1","top","tee-crew","#FFFFFF"), H.g("d2","bottom","jeans-straight","#7A93B8")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed));
    await page.click('[data-more="d1"]'); await page.click('[data-del="d1"]');
    await page.waitForTimeout(100);
    const open1 = await page.evaluate(() => document.querySelector("#confirmDlg").open);
    await page.click('#confirmDlg button[value="cancel"]'); await page.waitForTimeout(120);
    let s = await snap(page);
    R.ok(open1 === true && s.wardrobe.length === 2, "A6a · ux §7: ลบมี dialog ยืนยัน กดยกเลิกแล้วชิ้นยังอยู่");
    await page.click('[data-more="d1"]'); await page.click('[data-del="d1"]');
    await page.waitForTimeout(100);
    await page.click("#dlgOk"); await page.waitForTimeout(150);
    s = await snap(page);
    R.ok(s.wardrobe.length === 1 && !s.wardrobe.some(x => x.id === "d1"), "A6b · ux §7: ยืนยันแล้วลบจริง");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* A7: micro-copy "บันทึกไว้ในเครื่องนี้เท่านั้น" ครั้งเดียว */
    const { ctx, page, errs } = await H.open(browser, H.store([]));
    await addItem(page, "top", "tee-v", "#4A5D8A", "ยืดคอวี");
    const n1 = await page.locator("#storageBannerSlot", { hasText:"บันทึกไว้ในเครื่องนี้เท่านั้น" }).count();
    R.ok(n1 > 0, "A7a · ux §7B: เพิ่มชิ้นแรกแล้วบอกว่าบันทึกในเครื่องนี้เท่านั้น");
    await page.click("[data-notedone]"); await page.waitForTimeout(100);
    await page.reload(); await page.waitForTimeout(450);
    const n2 = await page.locator("#storageBannerSlot", { hasText:"บันทึกไว้ในเครื่องนี้เท่านั้น" }).count();
    R.ok(n2 === 0, "A7b · ux §7B: กด 'เข้าใจแล้ว' แล้วไม่ขึ้นซ้ำหลังรีเฟรช");
    allErrs.push(...errs); await ctx.close();
  }

  /* ============ B. FR-1 Today Outfit ============ */
  {   /* B1 B2 B3 B5 */
    const seed = [H.g("t1","top","tee-crew","#FFFFFF"), H.g("b1","bottom","jeans-straight","#2B3A67")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed));
    const looks = await page.evaluate(() => state.batch.map(o => ({
      cats: Object.keys(o.items), ids: Object.keys(o.items).map(c => o.items[c].id),
      pcts: o.colorBreakdown.map(b => b.pct), roles: o.colorBreakdown.map(b => b.role),
      advice: o.advice.length
    })));
    R.ok(looks.length >= 1, "B1a · FR-1 AC1: ตู้มี 1 บน + 1 ล่าง ได้ชุดอย่างน้อย 1", "ได้ " + looks.length);
    R.ok(looks.every(l => l.cats.includes("top") && l.cats.includes("bottom")),
      "B1b · FR-1 AC2: ทุกชุดมีบน+ล่างครบ");
    const ids = seed.map(x => x.id);
    R.ok(looks.every(l => l.ids.every(i => ids.includes(i))), "B2 · FR-1 AC3: ทุกชิ้นเป็น garment จริงจากตู้");
    const dom = await page.evaluate(() => {
      const card = document.querySelector(".card--focused");
      return { segs: card.querySelectorAll(".pbar__seg").length,
               legend: card.querySelector(".pbar__legend") ? card.querySelector(".pbar__legend").textContent : "",
               advice: card.querySelectorAll(".advice li").length,
               html: document.querySelector("#resultsSlot").innerHTML };
    });
    R.ok(dom.segs >= 1 && dom.advice >= 1 && /%/.test(dom.legend) && /(สีหลัก|สีรอง|สีกลาง|สีเน้น)/.test(dom.legend),
      "B3a · FR-1 AC4: การ์ดมีสัดส่วนสี + role + % + คำแนะนำอย่างน้อย 1 ข้อ");
    R.ok(!/score|คะแนน|data-score/i.test(dom.html), "B3b · FR-1 AC4: ไม่มีคะแนนโผล่ในผลลัพธ์");
    const only = await snap(page);
    R.ok(only.n === 1 && await page.locator('[data-nav="1"]:disabled').count() === 1,
      "B1c · ตู้มีคู่เดียว: ได้ 1 ชุดและปุ่มเลื่อนถูก disable ไม่ใช่ปุ่มตายที่กดแล้วเงียบ");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* B5: carousel วนลูปในแบตช์ (ต้องมีคู่มากพอให้ได้ 3-4 ชุด) */
    const many = [H.g("m1","top","tee-crew","#FFFFFF"), H.g("m2","top","polo","#2B3A67"), H.g("m3","top","hoodie","#C0392B"),
                  H.g("m4","bottom","chino","#C8B79B"), H.g("m5","bottom","jeans-straight","#7A93B8"), H.g("m6","bottom","skirt","#17161A"),
                  H.g("m7","shoes","sneaker","#F2F0EB"), H.g("m8","shoes","boot","#6B4A2F")];
    const { ctx, page, errs } = await H.open(browser, H.store(many, { mode:"wardrobe" }));
    const s0 = await snap(page);
    for(let i = 0; i <= s0.n; i++){ await page.click('[data-nav="1"]'); await page.waitForTimeout(60); }
    const s1 = await snap(page);
    R.ok(s1.index === 1 % s0.n && s1.keys.join("|") === s0.keys.join("|"),
      "B5a · FR-1 AC6: กด > เกินจำนวนแล้ววนลูปในแบตช์เดิม ไม่สร้างชุดใหม่",
      "index " + s0.index + "->" + s1.index + " n=" + s0.n);
    R.ok(s0.n >= 3 && s0.n <= 4, "B5b · FR-1 AC6: แบตช์ละ 3-4 ชุด", "ได้ " + s0.n);
    await page.click('[data-gen="1"]'); await page.waitForTimeout(150);
    const s2 = await snap(page);
    const live = await page.locator("#liveFeedback").textContent();
    R.ok(s2.keys.join("|") !== s1.keys.join("|"), "B5c · FR-1 AC6: 'เจนชุดใหม่' เปลี่ยนแบตช์จริง");
    R.ok(/สร้างชุดใหม่/.test(live), "B5d · ux §7B: ประกาศผ่าน aria-live ว่าสร้างชุดใหม่แล้ว", "ได้: " + live);
    allErrs.push(...errs); await ctx.close();
  }
  {   /* B4: โอกาสเอนโทนสี */
    const { ctx, page, errs } = await H.open(browser, H.store([]));
    const m = await page.evaluate(() => {
      function measure(occ){
        let s = 0, l = 0, accS = 0, accN = 0, looks = 0;
        for(let i = 0; i < 40; i++){
          const b = generateIdeaBatch(occ, {}).outfits;
          b.forEach(o => {
            looks++;
            o.colorBreakdown.forEach(x => {
              const c = hexToHsl(x.hex); s += c.s * x.pct; l += c.l * x.pct;
              if(x.role === "accent"){ accS += c.s; accN++; }
            });
          });
        }
        return { s: s/(looks*100), l: l/(looks*100), accent: accN/looks, accentS: accN ? accS/accN : 0 };
      }
      return { work: measure("work"), party: measure("party") };
    });
    R.ok(m.work.s < m.party.s, "B4a · FR-1 AC5: Work อิ่มสีต่ำกว่า Party",
      "S work " + m.work.s.toFixed(1) + " vs party " + m.party.s.toFixed(1));
    R.ok(m.work.l < m.party.l, "B4b · FR-1 AC5: Work เอนเข้มกว่า Party",
      "L work " + m.work.l.toFixed(1) + " vs party " + m.party.l.toFixed(1));
    /* spec §4.7 (แก้ตามงานวิจัย): Accent ต้องมีแทบทุกครั้งไม่ว่าโอกาสไหน โอกาสปรับแค่ "ความสด"
       ของ accent ไม่ใช่ว่าจะมีหรือไม่มี จึงเช็คว่ามีครบทุกลุค + accent สดกว่าใน party มากกว่า work */
    R.ok(m.work.accent === 1 && m.party.accent === 1,
      "B4c · spec §4.7: Accent มีทุกลุคไม่ว่าโอกาสไหน (ไม่ใช่เหรียญโยน)",
      "accent/ชุด work " + m.work.accent.toFixed(2) + " vs party " + m.party.accent.toFixed(2));
    R.ok(m.work.accentS < m.party.accentS, "B4d · spec §4.7: โอกาสปรับความสดของ Accent (work สุขุมกว่า party)",
      "accent S work " + m.work.accentS.toFixed(1) + " vs party " + m.party.accentS.toFixed(1));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* B6: ตู้ไม่พอ (AC7) */
    const { ctx, page, errs } = await H.open(browser, H.store([H.g("o1","top","polo","#2B3A67")], { mode:"wardrobe" }));
    const txt = await page.locator("#resultsSlot").textContent();
    R.ok(/ยังขาด/.test(txt) && /กางเกง/.test(txt), "B6a · FR-1 AC7: ตู้ขาดหมวด -> บอกว่าขาดอะไร แทนการแนะนำมั่ว");
    R.ok(await page.locator('#resultsSlot [data-jump="sec-wardrobe"]').count() > 0 &&
         await page.locator('#resultsSlot [data-setmode="idea"]').count() > 0,
      "B6b · FR-1 AC7: มีทางออกทั้งเพิ่มของและสลับไปโหมดไอเดีย");
    await page.click('#resultsSlot [data-setmode="idea"]'); await page.waitForTimeout(150);
    const s = await snap(page);
    R.ok(s.mode === "idea" && s.n >= 3, "B6c · FR-1 AC7: สลับไปโหมดไอเดียแล้วดูชุดได้", "ได้ " + s.n + " ชุด");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* B7: ตู้ว่าง + จำโหมด (AC8): ยังไม่เคยเลือกโหมด ระบบต้องเลือกตามความพร้อมตู้ */
    const { ctx, page, errs } = await H.open(browser, H.store([], { mode:null }));
    let s = await snap(page);
    R.ok(s.mode === "idea" && s.n >= 3, "B7a · FR-1 AC8: ตู้ว่างแต่โหมดไอเดียยังโชว์ชุดได้ + ค่าเริ่มต้นเลือกให้เอง");
    const checked = await page.getAttribute('[data-mode="idea"]', "aria-checked");
    R.ok(checked === "true", "B7b · ux §7B: ตัวสลับแสดงสถานะโหมดที่ใช้อยู่ชัด");
    await page.click('[data-mode="wardrobe"]');
    await waitPersisted(page, () => {
      try { return (JSON.parse(localStorage.getItem("outfit-color-matcher.v1")||"{}").settings||{}).mode === "wardrobe"; }
      catch(e){ return false; }
    });
    await page.reload(); await page.waitForTimeout(450);
    s = await snap(page);
    R.ok(s.mode === "wardrobe", "B7c · ux §7: โหมดที่เลือกถูกจำหลังรีเฟรช", "ได้ " + s.mode);
    allErrs.push(...errs); await ctx.close();
  }
  {   /* B8: auto mode switch ต้องไม่เงียบ */
    const seed = [H.g("x1","top","polo","#2B3A67"), H.g("x2","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.click('[data-more="x2"]'); await page.click('[data-del="x2"]');
    await page.waitForTimeout(100); await page.click("#dlgOk"); await page.waitForTimeout(200);
    const s = await snap(page);
    const notice = await page.locator("#autoNoticeSlot").textContent();
    R.ok(s.mode === "idea", "B8a · ux §7B: ตู้ไม่พอแล้วระบบสลับโหมดให้เอง");
    R.ok(notice.trim().length > 0, "B8b · ux §7B: การสลับอัตโนมัติมีข้อความอธิบาย ไม่เงียบ", "ได้: " + notice.trim());
    allErrs.push(...errs); await ctx.close();
  }

  /* ============ C. สถานะและขอบ (spec §7C) ============ */
  {   /* C1 C2 */
    const { ctx, page, errs, reqs } = await H.open(browser, null);
    const badges = await page.locator("#wardrobeSlot .badge", { hasText:"ตัวอย่าง" }).count();
    const banner = await page.locator("#sampleBannerSlot", { hasText:"ชุดตัวอย่าง" }).count();
    const s0 = await snap(page);
    R.ok(badges === 10 && banner > 0 && s0.n >= 3,
      "C1 · §7C First load: มีชุดตัวอย่าง + ป้าย 'ตัวอย่าง' ทุกชิ้น + แบนเนอร์", "badge " + badges);
    await page.click("[data-clearsample]"); await page.waitForTimeout(200);
    const wardTxt = await page.locator("#wardrobeSlot").textContent();
    const s1 = await snap(page);
    R.ok(s1.wardrobe.length === 0 && wardTxt.trim().length > 0,
      "C2a · §7C Empty: ล้างตัวอย่างแล้วตู้ว่างพร้อมข้อความ ไม่ใช่จอว่าง");
    R.ok(s1.mode === "idea" && s1.n >= 3, "C2b · §7C Empty: โหมดไอเดียยังใช้ได้หลังตู้ว่าง");
    R.ok(reqs.length === 0, "C9 · CSP: ไม่มี request ออกนอกไฟล์เลย", reqs.join(","));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* C3 C4: ตู้ใหญ่ */
    const big = [];
    for(let i = 0; i < 20; i++) big.push(H.g("bt"+i, "top", "tee-crew", "#" + (0x224466 + i*0x050505).toString(16).padStart(6,"0")));
    for(let i = 0; i < 20; i++) big.push(H.g("bb"+i, "bottom", "chino", "#" + (0x336655 + i*0x040404).toString(16).padStart(6,"0")));
    for(let i = 0; i < 10; i++) big.push(H.g("bs"+i, "shoes", "sneaker", "#" + (0x111111 + i*0x101010).toString(16).padStart(6,"0")));
    for(let i = 0; i < 10; i++) big.push(H.g("ba"+i, "accessory", "cap", "#" + (0x992222 + i*0x020202).toString(16).padStart(6,"0")));
    const { ctx, page, errs } = await H.open(browser, H.store(big, { mode:"wardrobe" }), { wait: 900 });
    const ms = await page.evaluate(() => {
      const t = performance.now(); regenerate(true); return performance.now() - t;
    });
    const s = await snap(page);
    R.ok(s.n >= 3 && s.n <= 4 && ms < 1000,
      "C4 · §7C Large wardrobe: ตู้ 60 ชิ้น ได้ 3-4 ชุด ไม่ค้าง", "regenerate " + ms.toFixed(0) + "ms");
    R.ok(ms < 100, "C3 · §7C Loading: เร็วพอจนไม่ต้องมี skeleton", "regenerate " + ms.toFixed(0) + "ms");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* C5: ตู้สีกลางล้วน */
    const neu = [H.g("n1","top","tee-crew","#FFFFFF"), H.g("n2","top","polo","#8A8A8A"),
                 H.g("n3","bottom","chino","#4A4A4A"), H.g("n4","bottom","jeans-straight","#17161A"),
                 H.g("n5","shoes","sneaker","#F2F0EB")];
    const { ctx, page, errs } = await H.open(browser, H.store(neu, { mode:"wardrobe" }));
    const r = await page.evaluate(() => state.batch.map(o => ({
      rule: o.ruleUsed, accent: o.colorBreakdown.filter(b => b.role === "accent").length })));
    R.ok(r.length >= 1 && r.every(x => x.accent === 0),
      "C5 · §7C All-neutral: ยังจัดชุดได้และไม่แสร้งว่ามีสีเน้น",
      r.map(x => x.rule).join(","));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* C6: quota เต็ม */
    const { ctx, page, errs } = await H.open(browser, H.store([H.g("q1","top","polo","#2B3A67")]), { block:"quota" });
    await addItem(page, "bottom", "chino", "#C8B79B", "ชิโน");
    const warn = await page.locator("#storageBannerSlot", { hasText:"บันทึกไม่สำเร็จ" }).count();
    const s = await snap(page);
    R.ok(warn > 0, "C6a · §7C Quota: บันทึกไม่ได้แล้วเตือน ไม่เงียบ");
    R.ok(s.wardrobe.length === 2 && errs.length === 0, "C6b · §7C Quota: ยังใช้งานต่อได้ ไม่พัง", errs.join(" | "));
    await ctx.close();
  }
  {   /* C7: เครื่องใหม่ */
    const { ctx, page, errs } = await H.open(browser, null);
    const s = await snap(page);
    R.ok(s.wardrobe.length === 10 && s.wardrobe.every(g => g.isExample),
      "C7 · §7C Shared/เครื่องใหม่: กลับไปสถานะตัวอย่าง ไม่เห็นข้อมูลเครื่องอื่น");
    allErrs.push(...errs); await ctx.close();
  }


  /* ============ SW. FR-2 Swap One Item ============ */
  {
    const seed = [
      H.g("t1","top","tee-crew","#2B3A67"), H.g("t2","top","polo","#3F6B4F"), H.g("t3","top","hoodie","#C0392B"),
      H.g("b1","bottom","chino","#C8B79B"), H.g("b2","bottom","jeans-straight","#7A93B8"),
      H.g("s1","shoes","sneaker","#F2F0EB")
    ];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const look = () => page.evaluate(() => {
      const o = state.batch[state.index];
      return { top:o.items.top&&o.items.top.id, bottom:o.items.bottom&&o.items.bottom.id,
               shoes:o.items.shoes&&o.items.shoes.id, sig: JSON.stringify(o.colorBreakdown) };
    });
    const a = await look();
    await page.click('.card--focused [data-swap$=":top"]'); await page.waitForTimeout(120);
    const b = await look();
    R.ok(b.top !== a.top, "SW1 · FR-2 AC1: กดสลับเสื้อแล้วเสื้อเปลี่ยน", a.top+" -> "+b.top);
    R.ok(b.bottom === a.bottom && b.shoes === a.shoes, "SW2 · FR-2 AC1: ชิ้นหมวดอื่นไม่เปลี่ยน");
    R.ok(b.sig !== a.sig, "SW3 · FR-2 AC3: สัดส่วนสี/คำแนะนำอัปเดตตามชุดใหม่");
    await page.click('.card--focused [data-swap$=":top"]'); await page.waitForTimeout(120);
    const c = await look();
    R.ok(c.top !== b.top, "SW4 · FR-2 AC2: กดซ้ำวนไปตัวถัดไป", b.top+" -> "+c.top);
    R.ok(await page.locator('.card--focused [data-swap$=":shoes"]:disabled').count() === 1,
      "SW5 · spec §7C: หมวดที่มีชิ้นเดียว ปุ่มสลับ disabled");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* โหมดไอเดียไม่มีปุ่มสลับ (ไม่มีตู้ให้เลือกตัวถัดไป) */
    const { ctx, page, errs } = await H.open(browser, H.store([], { mode:"idea" }));
    R.ok(await page.locator('.card--focused .tile__swap').count() === 0,
      "SW6 · โหมดไอเดียไม่โชว์ปุ่มสลับ");
    allErrs.push(...errs); await ctx.close();
  }

  /* ============ FV. FR-3 Favorites ============ */
  {
    const seed = [H.g("f1","top","polo","#2B3A67"), H.g("f2","bottom","chino","#C8B79B"), H.g("f3","shoes","sneaker","#F2F0EB")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const favN = () => page.evaluate(() => state.favorites.length);
    await page.click('.card--focused .card__fav'); await page.waitForTimeout(120);
    R.ok(await favN() === 1 && await page.getAttribute('.card--focused .card__fav','aria-pressed') === "true",
      "FV1 · กดหัวใจ = บันทึก + ปุ่มเป็น pressed");
    await page.click('.card--focused .card__fav'); await page.waitForTimeout(120);
    R.ok(await favN() === 0, "FV2 · ux §7: กดหัวใจซ้ำ = เอาออก (toggle)");
    await page.click('.card--focused .card__fav');
    await waitPersisted(page, () => {
      try { return (JSON.parse(localStorage.getItem("outfit-color-matcher.v1")||"{}").favorites||[]).length === 1; }
      catch(e){ return false; }
    });
    await page.reload(); await page.waitForTimeout(450);
    R.ok(await favN() === 1, "FV3 · FR-3 AC1: ชุดที่บันทึกอยู่รอดหลังรีเฟรช");
    R.ok(await page.locator('#sec-favorites .favcard').count() === 1, "FV4 · เซกชัน 'บันทึกไว้' โชว์ 1 ชุด");
    /* duplicate */
    const fid = await page.evaluate(() => state.favorites[0].id);
    await page.click('[data-favmore="'+fid+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favdup="'+fid+'"]'); await page.waitForTimeout(120);
    R.ok(await favN() === 2 && await page.locator('#sec-favorites .favcard').count() === 2,
      "FV5 · FR-3 AC2: ทำสำเนาได้ชุดแยก");
    /* delete หนึ่งชุด */
    const del = await page.evaluate(() => state.favorites[0].id);
    await page.click('[data-favmore="'+del+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favdel="'+del+'"]'); await page.waitForTimeout(100);
    await page.click("#dlgOk"); await page.waitForTimeout(150);
    R.ok(await favN() === 1 && !(await page.evaluate((id)=>state.favorites.some(f=>f.id===id), del)),
      "FV6 · FR-3 AC3: ลบเฉพาะชุดนั้น");
    /* ลบ garment ต้นทาง แล้ว favorite ยังเรนเดอร์สีได้ (snapshot) */
    const shapes = await page.evaluate(() => {
      state.wardrobe = []; persist(); renderWardrobe(); renderFavorites();
      return document.querySelectorAll('#sec-favorites .favcard__shape svg.shape').length;
    });
    R.ok(shapes >= 2, "FV7 · snapshot: ลบเสื้อผ้าต้นทางแล้ว favorite ยังโชว์ทรง+สีได้", "shapes "+shapes);
    allErrs.push(...errs); await ctx.close();
  }
  {   /* เต็ม 20 เตือน ไม่เพิ่มเงียบ */
    const seed = [H.g("g1","top","polo","#2B3A67"), H.g("g2","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.evaluate(() => {
      state.favorites = [];
      for(let i=0;i<20;i++) state.favorites.push({ id:"x"+i, name:"ชุด"+i, key:"k"+i, rule:"neutral",
        items:[{cat:"top",name:"a",shapeId:"polo",color:"#2B3A67"}], breakdown:[{hex:"#2B3A67",pct:100,role:"primary",name:"กรมท่า"}] });
      persist(); renderFavorites();
    });
    await page.click('.card--focused .card__fav'); await page.waitForTimeout(120);
    R.ok(await page.evaluate(() => state.favorites.length) === 20, "FV8 · เต็ม 20 แล้วกดหัวใจ ไม่เพิ่มเกิน");
    R.ok(/20/.test(await page.locator("#liveFeedback").textContent()), "FV9 · เต็ม 20 มีข้อความเตือน ไม่เงียบ");
    allErrs.push(...errs); await ctx.close();
  }


  /* ============ SW+FV. เคสขอบเพิ่มเติม (/test เฟส2) ============ */
  {   /* สลับวนครบทุกตัวเลือกแล้วย้อนกลับมาที่เดิม ไม่ใช่แค่สลับไป-มา 2 ตัว */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("t2","top","polo","#3F6B4F"),
      H.g("t3","top","hoodie","#C0392B"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const ids = [];
    for(let i = 0; i < 4; i++){
      ids.push(await page.evaluate(() => state.batch[state.index].items.top.id));
      await page.click('.card--focused [data-swap$=":top"]'); await page.waitForTimeout(100);
    }
    R.ok(new Set(ids).size === 3, "SW7 · วนสลับครบทั้ง 3 ตัวเลือกในหมวด ไม่ค้างที่ 2 ตัว", JSON.stringify(ids));
    R.ok(ids[0] === ids[3], "SW8 · วนครบรอบแล้วย้อนกลับมาที่ชิ้นเดิม", JSON.stringify(ids));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* คีย์บอร์ด: ปุ่มสลับและหัวใจกด Enter ได้ */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("t2","top","polo","#3F6B4F"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const before = await page.evaluate(() => state.batch[state.index].items.top.id);
    await page.locator('.card--focused [data-swap$=":top"]').focus();
    await page.keyboard.press("Enter"); await page.waitForTimeout(100);
    const after = await page.evaluate(() => state.batch[state.index].items.top.id);
    R.ok(after !== before, "SW9 · ปุ่มสลับกด Enter จากคีย์บอร์ดได้", before+" -> "+after);
    await page.locator(".card--focused .card__fav").focus();
    await page.keyboard.press("Enter"); await page.waitForTimeout(100);
    R.ok(await page.evaluate(() => state.favorites.length) === 1, "FV10 · ปุ่มหัวใจกด Enter จากคีย์บอร์ดได้");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* สลับแล้วชุดไม่ตรงกับ favorite เดิมอีกต่อไป หัวใจต้องคลายสถานะ (ไม่ค้างว่า "บันทึกแล้ว" ทั้งที่ชุดเปลี่ยน) */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("t2","top","polo","#3F6B4F"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.click(".card--focused .card__fav"); await page.waitForTimeout(120);
    const pressedBefore = await page.getAttribute(".card--focused .card__fav", "aria-pressed");
    await page.click('.card--focused [data-swap$=":top"]'); await page.waitForTimeout(120);
    const pressedAfter = await page.getAttribute(".card--focused .card__fav", "aria-pressed");
    R.ok(pressedBefore === "true" && pressedAfter === "false",
      "FV11 · สลับชิ้นแล้วหัวใจคลายสถานะ ไม่ค้างว่าบันทึกแล้วทั้งที่ชุดเปลี่ยนไปแล้ว");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* ทำสำเนาแล้วแก้ชื่อสำเนาต้องไม่กระทบต้นฉบับ */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.click(".card--focused .card__fav"); await page.waitForTimeout(120);
    const fid = await page.evaluate(() => state.favorites[0].id);
    await page.click('[data-favmore="'+fid+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favdup="'+fid+'"]'); await page.waitForTimeout(120);
    const dupId = await page.evaluate(() => state.favorites[1].id);
    await page.click('[data-favmore="'+dupId+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favedit="'+dupId+'"]'); await page.waitForTimeout(80);
    await page.fill("#favNameInput", "ชื่อใหม่เฉพาะสำเนา");
    await page.click('[data-favrename="'+dupId+'"] button[type=submit]'); await page.waitForTimeout(120);
    const names = await page.evaluate(() => state.favorites.map(f => f.name));
    R.ok(names[1] === "ชื่อใหม่เฉพาะสำเนา" && names[0] !== "ชื่อใหม่เฉพาะสำเนา",
      "FV12 · แก้ชื่อสำเนาแล้วไม่กระทบชื่อต้นฉบับ", JSON.stringify(names));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* กันติด: คลิกนอกฟอร์มแก้ชื่อ หรือกด Escape ต้องออกจากโหมดแก้ชื่อได้โดยไม่บันทึก (bug ที่เจอจาก /test) */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.click(".card--focused .card__fav"); await page.waitForTimeout(120);
    const fid = await page.evaluate(() => state.favorites[0].id);
    await page.click('[data-favmore="'+fid+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favedit="'+fid+'"]'); await page.waitForTimeout(80);
    R.ok(await page.locator('[data-favrename]').count() === 1, "FV13a · เปิดโหมดแก้ชื่อได้");
    await page.click("#favTitle"); await page.waitForTimeout(100);
    R.ok(await page.locator('[data-favrename]').count() === 0,
      "FV13b · คลิกนอกฟอร์มแก้ชื่อ = ออกจากโหมดแก้ชื่อโดยไม่บันทึก (ไม่ติดอยู่ในฟอร์ม)");
    await page.click('[data-favmore="'+fid+'"]'); await page.waitForTimeout(80);
    await page.click('[data-favedit="'+fid+'"]'); await page.waitForTimeout(80);
    await page.keyboard.press("Escape"); await page.waitForTimeout(100);
    R.ok(await page.locator('[data-favrename]').count() === 0,
      "FV13c · กด Escape ในโหมดแก้ชื่อ = ออกจากโหมดแก้ชื่อได้เช่นกัน");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* กันติด: Escape ตอนเมนู ⋯ ของ favorite เปิดอยู่ ต้องปิดเมนูจริง (ไม่ใช่แค่เคลียร์ state แต่ DOM ยังค้าง) */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    await page.click(".card--focused .card__fav"); await page.waitForTimeout(120);
    const fid = await page.evaluate(() => state.favorites[0].id);
    await page.click('[data-favmore="'+fid+'"]'); await page.waitForTimeout(80);
    R.ok(await page.locator("#sec-favorites .gchip__pop").count() === 1, "FV14a · เมนู ⋯ ของ favorite เปิดได้");
    await page.keyboard.press("Escape"); await page.waitForTimeout(100);
    R.ok(await page.locator("#sec-favorites .gchip__pop").count() === 0,
      "FV14b · กด Escape ปิดเมนู ⋯ ของ favorite จริง (ไม่ค้างเพราะ render ผิดเซกชัน)");
    allErrs.push(...errs); await ctx.close();
  }

  /* ============ AN. FR-4 วิเคราะห์ตู้ (เฟส 3, View E) ============ */
  {   /* AC5 ข้อมูลน้อยเกินไป -> E0 บอกตรงๆ ไม่โชว์กราฟมั่ว */
    const seed = [H.g("t1","top","tee-crew","#2B3A67"), H.g("b1","bottom","chino","#C8B79B")];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    R.ok(await page.locator('.nav__btn[data-jump="sec-analysis"]').count() === 1,
      "AN1 · มีแท็บ 'วิเคราะห์' ในเนวิเกชัน");
    R.ok(await page.locator("#analysisSlot .empty").count() === 1 &&
         await page.locator("#analysisSlot .abar").count() === 0,
      "AN2 · FR-4 AC5: ตู้ 2 ชิ้น -> E0 ไม่วิเคราะห์มั่ว");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* AC1/AC2/AC3: ตู้พอวิเคราะห์ได้ -> แถบสัดส่วน + 4 กลุ่ม + insight */
    const seed = [
      H.g("t1","top","tee-crew","#FFFFFF"), H.g("t2","top","polo","#FFFFFF"),
      H.g("b1","bottom","chino","#2B3A67"), H.g("s1","shoes","sneaker","#C0392B")
    ];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const bars = await page.locator("#analysisSlot .abar").count();
    const plain = await page.locator("#analysisSlot .abar__fill--plain").count();
    R.ok(bars === 3 + 4 && plain === 4,
      "AN3 · FR-4 AC1/AC2: แถบรายสี 3 + กลุ่ม 4 แถบ (DiversityBar สีเดียว)", "bars="+bars+" plain="+plain);
    R.ok(await page.locator("#analysisSlot .banner").count() >= 1,
      "AN4 · FR-4 AC3: มี insight อย่างน้อย 1 ข้อ");
    const labs = await page.locator("#analysisSlot .abar__lab").allTextContents();
    R.ok(labs.slice(0,3).every(s => /#[0-9A-F]{6}/.test(s)),
      "AN5 · ux §9: ป้ายรายสีมี hex กำกับ ไม่แยกแถวด้วยสีอย่างเดียว", labs[0]);
    /* AC1: ขาว 2 ชิ้นจาก 4 = 50% ต้องโผล่ในป้าย */
    R.ok(labs.some(s => /50%/.test(s)), "AN6 · FR-4 AC1: % คิดจาก garment จริง (ขาว 2/4 = 50%)", labs.join(" | "));
    allErrs.push(...errs); await ctx.close();
  }
  {   /* วิเคราะห์ต้องอัปเดตตามตู้ ไม่ค้างค่าเก่า หลังลบชิ้น */
    const seed = [
      H.g("t1","top","tee-crew","#FFFFFF"), H.g("t2","top","polo","#2B3A67"),
      H.g("b1","bottom","chino","#C8B79B"), H.g("s1","shoes","sneaker","#C0392B")
    ];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    const before = await page.locator("#analysisSlot .abar").count();
    await page.click('[data-more="s1"]'); await page.waitForTimeout(80);
    await page.click('[data-del="s1"]'); await page.waitForTimeout(100);
    await page.click("#dlgOk"); await page.waitForTimeout(200);
    const after = await page.locator("#analysisSlot .abar").count();
    R.ok(after === before - 1, "AN7 · ลบเสื้อผ้าแล้วผลวิเคราะห์อัปเดตทันที ไม่ค้างค่าเก่า", before+" -> "+after);
    allErrs.push(...errs); await ctx.close();
  }

  /* ============ CF. FR-5 Color-first (เฟส 3) ============ */
  {
    const seed = [
      H.g("t1","top","tee-crew","#2B3A67"), H.g("t2","top","polo","#FFFFFF"),
      H.g("b1","bottom","chino","#C8B79B"), H.g("a1","accessory","belt","#C0392B")
    ];
    const { ctx, page, errs } = await H.open(browser, H.store(seed, { mode:"wardrobe" }));
    R.ok(await page.locator("#colorLockChips [data-lock]").count() > 1,
      "CF1 · มีตัวเลือก 'วันนี้อยากใส่สีอะไร' พร้อมสวอตช์");
    R.ok(await page.locator('#colorLockChips [data-lock="#2B3A67"]').getAttribute("aria-label") !== null,
      "CF2 · ux §9: สวอตช์สีมี aria-label ชื่อสี+hex ไม่สื่อด้วยสีอย่างเดียว");

    await page.click('#colorLockChips [data-lock="#2B3A67"]'); await page.waitForTimeout(300);
    const locked = await page.evaluate(() => ({
      lock: state.lockedColor, n: state.batch.length,
      all: state.batch.every(o => ["top","bottom"].some(c => o.items[c] && o.items[c].color.toUpperCase() === "#2B3A67"))
    }));
    R.ok(locked.lock === "#2B3A67" && locked.n > 0 && locked.all,
      "CF3 · FR-5 AC1: ล็อกสีแล้วทุกชุดมีสีนั้นเป็นชิ้นหลัก", JSON.stringify(locked));
    R.ok((await page.locator("#liveFeedback").textContent()).trim().length > 0,
      "CF4 · ux §7B: ล็อกสีแล้วมีข้อความกำกับ ไม่เงียบ");
    R.ok(await page.locator("#resultsSlot .pbar").count() > 0 && await page.locator("#resultsSlot .advice li").count() > 0,
      "CF5 · FR-5 AC2: ยังโชว์สัดส่วนสี + คำแนะนำ");

    /* ล็อกสีที่มีแค่ในแอกเซสซอรี -> A4 No-match จริง + ทางออกคือเอาสีที่ล็อกออก */
    await page.click('#colorLockChips [data-lock="#C0392B"]'); await page.waitForTimeout(300);
    R.ok(await page.locator("#resultsSlot .empty").count() === 1 &&
         await page.locator('#resultsSlot [data-lock=""]').count() === 1,
      "CF6 · FR-5 + §7C: ไม่มีชิ้นหลักสีนั้น -> A4 No-match พร้อมปุ่มเอาสีที่ล็อกออก");
    await page.click('#resultsSlot [data-lock=""]'); await page.waitForTimeout(300);
    R.ok(await page.evaluate(() => state.lockedColor === null && state.batch.length > 0),
      "CF7 · กดเอาสีที่ล็อกออกแล้วกลับมาแนะนำได้ตามปกติ");

    /* ล็อกสีต้องอยู่รอดหลังรีเฟรช (เก็บใน settings เหมือน occasion) */
    await page.click('#colorLockChips [data-lock="#2B3A67"]'); await page.waitForTimeout(250);
    await page.reload(); await page.waitForTimeout(450);
    R.ok(await page.evaluate(() => state.lockedColor) === "#2B3A67",
      "CF8 · สีที่ล็อกถูกจำหลังรีเฟรช");
    allErrs.push(...errs); await ctx.close();
  }
  {   /* โหมดไอเดียล็อกสีได้โดยไม่ต้องมีของจริงในตู้ */
    const { ctx, page, errs } = await H.open(browser, H.store([], { mode:"idea" }));
    await page.click('#colorLockChips [data-lock="#3F6B4F"]'); await page.waitForTimeout(300);
    R.ok(await page.evaluate(() =>
      state.batch.length > 0 && state.batch.every(o =>
        ["top","bottom"].some(c => o.items[c] && o.items[c].color.toUpperCase() === "#3F6B4F"))),
      "CF9 · FR-5 AC1: โหมดไอเดียล็อกสีได้ ทุกชุดมีสีนั้นเป็นชิ้นหลัก");
    allErrs.push(...errs); await ctx.close();
  }

  await browser.close();
  R.finish(allErrs);
})();
