/* คอนทราสต์จริง + คีย์บอร์ด/ทัช + reduced-motion + ธีม + responsive */
const H = require("./helper.js");

const CONTRAST_PROBES = [
  ["body",                      "ตัวอักษรหลัก (--ink บนพื้น)",            4.5],
  [".hero__lede",               "ข้อความรอง (--ink-muted)",               4.5],
  [".eyebrow",                  "eyebrow สีแบรนด์บนพื้น",                 4.5],
  [".btn--primary",             "ตัวอักษรบนปุ่มหลัก",                     4.5],
  [".section__count",           "ตัวนับในหัวข้อ",                         4.5],
  [".card__rule",               "ชื่อ rule บนการ์ด",                      4.5],
  [".advice li",                "คำแนะนำในการ์ด",                         4.5],
  [".pbar__item",               "legend ของสัดส่วนสี",                    4.5],
  [".clegend__cat",                "ป้ายหมวดใต้ทรง",                         4.5],
  [".clegend__color",              "ชื่อสี + hex",                           4.5],
  [".badge",                    "ป้าย 'ตัวอย่าง'",                        4.5],
  [".navrow__pos",              "ตัวบอกตำแหน่งชุด",                       4.5],
  [".modetoggle__opt[aria-checked='true']", "ตัวสลับโหมดที่เลือก",        4.5],
  [".chip[aria-checked='true']","chip โอกาสที่เลือก",                     4.5],
  [".banner__body",             "ข้อความในแบนเนอร์",                      4.5]
];

(async () => {
  const browser = await H.launch();
  const R = H.reporter();
  const allErrs = [];

  async function contrastTable(page){
    return page.evaluate((probes) => {
      function rgb(s){ const m = s.match(/[\d.]+/g); return m ? m.slice(0,3).map(Number) : null; }
      function lum(c){ const a = c.map(v => { v/=255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); });
        return .2126*a[0] + .7152*a[1] + .0722*a[2]; }
      function ratio(f,b){ const A = lum(f), B = lum(b); const hi = Math.max(A,B), lo = Math.min(A,B);
        return (hi+.05)/(lo+.05); }
      function bgOf(el){
        let n = el;
        while(n && n !== document.documentElement){
          const c = getComputedStyle(n).backgroundColor;
          const p = rgb(c);
          const alpha = c.match(/rgba?\([^)]*?,\s*([\d.]+)\)/);
          if(p && (!alpha || Number(alpha[1]) > 0)) return p;
          n = n.parentElement;
        }
        return rgb(getComputedStyle(document.body).backgroundColor) || [255,255,255];
      }
      return probes.map(([sel,label,min]) => {
        const el = document.querySelector(sel);
        if(!el) return { label, missing:true };
        const fg = rgb(getComputedStyle(el).color);
        const bg = bgOf(el);
        return { label, min, ratio: Number(ratio(fg,bg).toFixed(2)),
                 fg: "rgb("+fg.join(",")+")", bg: "rgb("+bg.join(",")+")" };
      });
    }, probes_arg());
    function probes_arg(){ return CONTRAST_PROBES; }
  }

  /* ---- D1 คอนทราสต์จริง (เฟส 4-C: เหลือโหมดเดียว วนสองธีมไม่มีความหมายอีกต่อไป) ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null);
    const rows = await contrastTable(page);
    console.log("\n--- คอนทราสต์จริง ---");
    rows.forEach(r => {
      if(r.missing){ console.log("  (ไม่พบ) " + r.label); return; }
      console.log("  " + (r.ratio >= r.min ? "ok  " : "ต่ำ ") + String(r.ratio).padStart(6) + ":1  " + r.label + "  " + r.fg + " บน " + r.bg);
    });
    const missing = rows.filter(r => r.missing).map(r => r.label);
    const bad = rows.filter(r => !r.missing && r.ratio < r.min);
    R.ok(missing.length === 0, "D1a · วัดคอนทราสต์ได้ครบทุกจุดที่ระบุ", missing.join(", "));
    R.ok(bad.length === 0, "D1b · ตัวอักษรทุกจุดผ่าน 4.5:1 จริง",
      bad.map(b => b.label + " " + b.ratio + ":1").join(" | "));
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D2 ไม่สื่อด้วยสีอย่างเดียว ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null);
    const t = await page.evaluate(() => {
      const tiles = [...document.querySelectorAll(".card--focused .clegend__row")];
      return tiles.map(x => ({ txt: x.textContent.replace(/\s+/g," ").trim(),
                               hex: /#[0-9A-F]{6}/i.test(x.textContent) }));
    });
    R.ok(t.length > 0 && t.every(x => x.hex && x.txt.length > 6),
      "D2 · ux §9: ทุกช่องในการ์ดมีชื่อสี + hex เป็นข้อความ ไม่สื่อด้วยสีอย่างเดียว",
      t.map(x => x.txt).join(" / "));
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D3 คีย์บอร์ด + inert ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null);
    const i0 = await page.evaluate(() => state.index);
    await page.focus('[data-nav="1"]');
    await page.keyboard.press("ArrowRight"); await page.waitForTimeout(120);
    const i1 = await page.evaluate(() => state.index);
    await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(120);
    const i2 = await page.evaluate(() => state.index);
    R.ok(i1 !== i0 && i2 === i0, "D3a · ui §6: ลูกศรซ้าย-ขวาเลื่อนการ์ดได้เมื่อโฟกัสในแผงแนะนำ",
      "index " + i0 + "->" + i1 + "->" + i2);
    const inert = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".card")];
      return cards.map(c => ({ focused: c.classList.contains("card--focused"),
                               hidden: c.getAttribute("aria-hidden") === "true", inert: c.hasAttribute("inert") }));
    });
    R.ok(inert.every(c => c.focused ? (!c.hidden && !c.inert) : (c.hidden && c.inert)),
      "D3b · ui §6: การ์ดที่ไม่โฟกัสถูก aria-hidden + inert จริง", JSON.stringify(inert));
    await page.evaluate(() => document.body.focus());
    let ring = null, ringOn = "";
    for(let i = 0; i < 40 && !ring; i++){
      await page.keyboard.press("Tab");
      const r = await page.evaluate(() => {
        const a = document.activeElement;
        if(!a || a === document.body) return null;
        const st = getComputedStyle(a);
        return { w: parseFloat(st.outlineWidth), style: st.outlineStyle,
                 who: a.className || a.id || a.tagName };
      });
      if(r && r.w >= 2 && r.style !== "none"){ ring = r.w; ringOn = r.who; }
    }
    R.ok(ring !== null, "D3c · ui §6: โฟกัสด้วยคีย์บอร์ดเห็นเส้นขอบอย่างน้อย 2px",
      ring ? ring + "px ที่ " + ringOn : "ไม่พบ outline บน control ใดเลยหลังกด Tab 40 ครั้ง");
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D4 touch target >= 44px ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null, { context:{ viewport:{ width:375, height:780 } } });
    await page.click("#addBtn"); await page.waitForTimeout(150);
    const small = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("button, input[type=color], a[href]").forEach(el => {
        if(el.offsetParent === null && el.getClientRects().length === 0) return;
        const r = el.getBoundingClientRect();
        if(r.width === 0 && r.height === 0) return;
        let h = r.height;
        const after = getComputedStyle(el, "::after");
        if(after && after.content !== "none" && parseFloat(after.height) > h) h = parseFloat(after.height);
        if(h < 43.5 || r.width < 24){
          out.push((el.className || el.id || el.tagName) + " " + Math.round(r.width) + "x" + Math.round(h));
        }
      });
      return out;
    });
    R.ok(small.length === 0, "D4 · ux §9: ทุกปุ่มที่มองเห็นสูงอย่างน้อย 44px", small.join(" | "));
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D5 swipe ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null, { context:{ hasTouch:true, viewport:{ width:375, height:780 } } });
    const before = await page.evaluate(() => state.index);
    await page.evaluate(() => {
      const c = document.querySelector("#carousel");
      const r = c.getBoundingClientRect();
      const mk = (type, x) => {
        const t = new Touch({ identifier:1, target:c, clientX:x, clientY:r.top + r.height/2 });
        return new TouchEvent(type, { touches: type === "touchend" ? [] : [t], changedTouches:[t], bubbles:true });
      };
      c.dispatchEvent(mk("touchstart", r.left + r.width - 20));
      c.dispatchEvent(mk("touchend",   r.left + 20));
    });
    await page.waitForTimeout(150);
    const after = await page.evaluate(() => state.index);
    R.ok(after !== before, "D5 · ux §9: ปัดนิ้วเปลี่ยนการ์ดได้ (ไม่บังคับให้ใช้ปุ่มอย่างเดียว)",
      "index " + before + "->" + after);
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D6 reduced motion ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null, { context:{ reducedMotion:"reduce" } });
    const d = await page.evaluate(() => {
      const tr = getComputedStyle(document.querySelector("#track")).transitionDuration;
      const adj = document.querySelector(".card--adjacent");
      return { track: tr, adjTransform: adj ? getComputedStyle(adj).transform : "none" };
    });
    R.ok(parseFloat(d.track) < 0.01, "D6a · ui §6: reduced-motion ตัด pan ของ carousel", d.track);
    R.ok(d.adjTransform === "none", "D6b · ui §6: reduced-motion ไม่ย่อการ์ดข้าง", d.adjTransform);
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D7 ธีมพื้นหลังไดนามิก (เฟส 4-C แทนที่เทสต์สลับ light/dark เดิม) ---- */
  {
    /* ตู้ตัวอย่างเป็นโทนเบจ/ครีมล้วน hue ของ Primary จึงแทบไม่ขยับ
       เทสต์นี้ต้องการพิสูจน์ "กลไก" จึง seed ตู้ที่สีห่างกันคนละซีกวงล้อสีจริงๆ */
    const wide = H.store([
      H.g("t1","top","tee-crew","#C0392B","เสื้อแดง"),
      H.g("t2","top","polo","#2E86C1","เสื้อฟ้า"),
      H.g("t3","top","hoodie","#27AE60","เสื้อเขียว"),
      H.g("b1","bottom","chino","#F4F1E8","กางเกงครีม"),
      H.g("b2","bottom","jeans-straight","#2C2C2C","ยีนส์ดำ"),
      H.g("s1","shoes","sneaker","#FFFFFF","รองเท้าขาว")
    ]);
    const { ctx, page, errs } = await H.open(browser, wide);
    const bgOfPage = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const hues = new Set();
    for(let i=0;i<10;i++){
      await page.click("#heroGen"); await page.waitForTimeout(120);
      hues.add(await page.evaluate(() => document.documentElement.style.getPropertyValue("--theme-tint-h")));
    }
    R.ok(hues.size >= 2, "D7a · ธีมไดนามิก: พื้นหลังเปลี่ยน hue ตามชุดใหม่จริง", [...hues].join(","));

    await page.click("#themeLockBtn"); await page.waitForTimeout(80);
    const locked = await bgOfPage();
    const pressed = await page.getAttribute("#themeLockBtn", "aria-pressed");
    for(let i=0;i<6;i++){ await page.click("#heroGen"); await page.waitForTimeout(90); }
    const afterLock = await bgOfPage();
    R.ok(pressed === "true" && locked === afterLock,
      "D7b · ล็อกธีม: เจนใหม่ 6 ครั้งแล้วพื้นหลังไม่ขยับ", pressed + " " + locked + " -> " + afterLock);

    const lockLabel = await page.getAttribute("#themeLockBtn", "aria-label");
    await page.click("#themeLockBtn"); await page.waitForTimeout(80);
    const unlockLabel = await page.getAttribute("#themeLockBtn", "aria-label");
    /* ต้องมีคำว่า "ธีม" เสมอ: ux §7 ห้ามให้ปุ่มนี้ฟังดูเหมือน "ล็อกสี" ของ FR-5 ที่คุมชุด ไม่ใช่พื้นหลัง */
    R.ok(!!lockLabel && !!unlockLabel && lockLabel !== unlockLabel
         && /ธีม/.test(lockLabel) && /ธีม/.test(unlockLabel),
      "D7c · ปุ่มล็อกธีมบอกสถานะด้วยข้อความ และแยกจาก \"ล็อกสี\" ชัดเจน", lockLabel + " / " + unlockLabel);
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D7d เส้นทรงเสื้อผ้ายังคำนวณจากสีชิ้นนั้น ไม่ใช่จากพื้นหลังหน้า (ตู้ตัวอย่างเดิม) ---- */
  {
    const { ctx, page, errs } = await H.open(browser, null);
    const lines = await page.evaluate(() => {
      const out = {};
      document.querySelectorAll("#wardrobeSlot .gchip").forEach(el => {
        out[el.querySelector(".gchip__name").textContent] =
          el.querySelector("svg.shape").style.getPropertyValue("--garment-line").trim();
      });
      return out;
    });
    R.ok(/^rgba\(0,0,0/.test(lines["เสื้อเชิ้ตขาว"]) && /^rgba\(255,255,255/.test(lines["กระโปรงดำ"]),
      "D7d · ui §7: เส้นของเสื้อขาว/ดำ คำนวณจากสีเสื้อ ไม่ใช่จากพื้นหลังของหน้า");
    allErrs.push(...errs); await ctx.close();
  }

  /* ---- D8 responsive ---- */
  {
    for(const w of [375, 768, 1280]){
      const { ctx, page, errs } = await H.open(browser, null, { context:{ viewport:{ width:w, height:900 } } });
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const cards = [...document.querySelectorAll(".card")];
        const rows = cards.map(c => {
          const st = getComputedStyle(c);
          /* ใช้ offsetHeight ไม่ใช่ rect: การ์ดข้างถูก scale(.92) rect จึงเล็กกว่าความสูงจริง */
          const contentH = [...c.children].reduce((m, el) => Math.max(m, el.offsetTop + el.offsetHeight), 0);
          return { h: c.offsetHeight,
                   extra: Math.round(c.clientHeight - contentH - parseFloat(st.paddingBottom)),
                   clipped: c.scrollHeight > c.clientHeight + 1 };
        });
        return { overflow: doc.scrollWidth - doc.clientWidth, rows: rows,
                 sameHeight: new Set(rows.map(r => r.h)).size === 1 };
      });
      R.ok(m.overflow <= 1, "D8-" + w + "a · responsive: ไม่มี horizontal scroll ที่ " + w + "px",
        "เกิน " + m.overflow + "px");
      const worst = Math.max(...m.rows.map(r => r.extra));
      console.log("    [" + w + "px] การ์ดสูง " + m.rows.map(r => r.h).join("/") +
        "px · ที่ว่างส่วนเกินท้ายการ์ด " + m.rows.map(r => r.extra).join("/") + "px");
      R.ok(m.rows.every(r => !r.clipped), "D8-" + w + "b · responsive: เนื้อหาในการ์ดไม่ถูกตัดที่ " + w + "px");
      if(w === 1280){
        console.log("    [ข้อสังเกต] การ์ดทุกใบสูงเท่ากัน = " + m.sameHeight +
          " · ส่วนเกินมากสุด " + worst + "px (เกิดจาก flex stretch ตามการ์ดที่สูงที่สุด)");
      }
      allErrs.push(...errs); await ctx.close();
    }
  }

  await browser.close();
  R.finish(allErrs);
})();
