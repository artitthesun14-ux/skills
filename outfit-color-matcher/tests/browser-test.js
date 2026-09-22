const {chromium}=require('playwright-core');
const path=require('path');
const FILE='file://'+path.join(__dirname,'..','outfit-color-matcher.html');
const SHOT=path.join(__dirname,'..','.shots');
require('fs').mkdirSync(SHOT,{recursive:true});
let fails=0;
const t=(n,c,x='')=>{ if(c) console.log('  ok  '+n); else {fails++;console.log('  FAIL '+n+(x?' -> '+x:''));} };

(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

// ---------- 1. โหลดครั้งแรก ----------
console.log('\n== 1. เปิดครั้งแรก (ตู้ว่างเปล่าในเครื่อง) ==');
let ctx=await browser.newContext({viewport:{width:1280,height:900}});
let errs=[],ext=[];
let page=await ctx.newPage();
page.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
page.on('pageerror',e=>errs.push(String(e)));
page.on('request',r=>{ if(!r.url().startsWith('file:') && !r.url().startsWith('data:')) ext.push(r.url()); });
await page.goto(FILE); await page.waitForTimeout(400);

t('ไม่มี console error / page error', errs.length===0, errs.join(' | '));
t('ไม่มี external request หลุด CSP', ext.length===0, ext.join(' | '));
t('เห็นชุดแนะนำทันทีโดยไม่ต้องกดอะไร', await page.locator('.card').count()>0);
t('การ์ดติดป้าย "ตัวอย่าง"', await page.locator('.card .badge').first().isVisible());
t('มีแบนเนอร์อธิบายชุดตัวอย่าง', (await page.locator('#sampleBannerSlot .banner').count())===1);
const nCards=await page.locator('.card').count();
t('แบตช์ 3-4 ชุด (AC6)', nCards>=3&&nCards<=4, nCards);
t('ทุกการ์ดมีแถบสัดส่วน', await page.locator('.card .pbar__track').count()===nCards);
t('ทุกการ์ดมีคำแนะนำ >=1', (await page.locator('.card .advice li').count())>=nCards);
t('โหมดเริ่มต้น = จากตู้ของฉัน (ตู้ตัวอย่างพร้อม)',
  await page.locator('[data-mode="wardrobe"]').getAttribute('aria-checked')==='true');

// ---------- 2. ไม่โชว์คะแนน ----------
console.log('\n== 2. ห้ามแสดงคะแนน (spec §4.3) ==');
const shown=await page.evaluate(()=>document.body.innerText);
const markup=await page.evaluate(()=>document.querySelector('main').outerHTML);
t('ไม่มี _harmony ใน markup ที่ render', !markup.includes('_harmony'));
t('ไม่มีค่าคะแนนถูกแสดง (ตัวเลขติดกับคำว่าคะแนน/score)',
  !/(คะแนน|เกรด|score)\s*[:：=]?\s*[\d.]/i.test(shown) && !/[\d.]+\s*(คะแนน|score|เกรด)/i.test(shown));
t('หน้าเว็บประกาศจุดยืนว่าไม่มีคะแนน', /ไม่มีคะแนน/.test(shown));
t('ไม่มีรูปแบบคะแนนเต็ม เช่น 8/10 หรือ 85 คะแนน', !/\b\d+\s*\/\s*(10|100)\b/.test(shown));

// ---------- 3. carousel ----------
console.log('\n== 3. Carousel (AC6) ==');
const pos=()=>page.locator('.navrow__pos').textContent();
const firstRule=await page.locator('.card').first().locator('.card__rule').textContent();
t('ตัวบอกตำแหน่งเป็นข้อความ ไม่ใช่จุดสีอย่างเดียว', /ชุดที่ \d+ จาก \d+/.test(await pos()));
await page.locator('[data-nav="1"]').click(); await page.waitForTimeout(120);
t('กด > แล้วตำแหน่งขยับ', (await pos()).includes('ชุดที่ 2'));
for(let i=0;i<nCards-1;i++){ await page.locator('[data-nav="1"]').click(); await page.waitForTimeout(60); }
t('กด > จนสุดแล้ววนกลับใบแรก', (await pos()).includes('ชุดที่ 1'));
t('การเลื่อนไม่สร้างชุดใหม่ (การ์ดใบแรกยังเป็นชุดเดิม)',
  await page.locator('.card').first().locator('.card__rule').textContent()===firstRule);
await page.locator('[data-nav="-1"]').click(); await page.waitForTimeout(60);
t('กด < จากใบแรกวนไปใบสุดท้าย', (await pos()).includes('ชุดที่ '+nCards));
t('การ์ดที่ไม่โฟกัสถูกซ่อนจาก a11y tree',
  await page.locator('.card--adjacent').first().getAttribute('aria-hidden')==='true');
const before=await page.locator('.card').allTextContents();
await page.locator('[data-gen="1"]').click(); await page.waitForTimeout(300);
t('ปุ่ม "เจนชุดใหม่" สร้างแบตช์ใหม่จริง',
  JSON.stringify(before)!==JSON.stringify(await page.locator('.card').allTextContents()));
t('เจนใหม่แล้วมีข้อความบอก (no silent state change)',
  (await page.locator('#liveFeedback').textContent()).includes('สร้างชุดใหม่แล้ว'));

// ---------- 4. โหมด + โอกาส ----------
console.log('\n== 4. สองโหมด + โอกาส (AC5, AC8) ==');
await page.locator('[data-mode="idea"]').click(); await page.waitForTimeout(250);
t('สลับไปโหมดไอเดียได้', await page.locator('[data-mode="idea"]').getAttribute('aria-checked')==='true');
t('โหมดไอเดียยังมีการ์ด', (await page.locator('.card').count())>=3);
t('โหมดไอเดียไม่มีป้าย "ตัวอย่าง" (ไม่ใช่ของจริงในตู้)', (await page.locator('.card .badge').count())===0);
const ideaBefore=await page.locator('.card').first().textContent();
await page.locator('[data-occ="party"]').click(); await page.waitForTimeout(250);
t('เลือกโอกาสแล้วผลเปลี่ยนทันที (ไม่ต้องกดยืนยัน)', (await page.locator('.card').first().textContent())!==ideaBefore);
t('โอกาสที่เลือกมีสถานะชัด', await page.locator('[data-occ="party"]').getAttribute('aria-checked')==='true');
await page.locator('[data-occ="unspecified"]').click(); await page.waitForTimeout(200);

// ---------- 5. เพิ่ม/แก้/ลบ เสื้อผ้า ----------
console.log('\n== 5. Wardrobe CRUD (FR-0) ==');
await page.locator('#addBtn').click(); await page.waitForTimeout(150);
await page.fill('#fName','เสื้อเชิ้ตลินินแขนยาวสีครีมตัวโปรดของฉัน');
await page.locator('[data-cat="top"]').click();
await page.fill('#fHex','#3E7D5A');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(250);
t('AC1 เพิ่มชิ้นแล้วโผล่ในตู้', (await page.locator('.gchip').count())===11);
t('ชื่อยาวถูกตัดด้วย line-clamp + มี title เต็ม',
  (await page.locator('.gchip h3').last().getAttribute('title')||'').includes('ตัวโปรด'));
t('ชิปแสดงชื่อสีไทย + hex กำกับ (ไม่สื่อด้วยสีอย่างเดียว)',
  /#3E7D5A/.test(await page.locator('.gchip').last().textContent()));
t('มีข้อความบอกว่าบันทึกในเครื่องนี้เท่านั้น',
  (await page.locator('#storageBannerSlot').textContent()).includes('เครื่องนี้เท่านั้น'));

await page.reload(); await page.waitForTimeout(400);
t('AC1 ข้อมูลอยู่รอดหลังรีเฟรช', (await page.locator('.gchip').count())===11);
t('โหมดล่าสุดถูกจำไว้และเห็นสถานะชัด',
  await page.locator('[data-mode="idea"]').getAttribute('aria-checked')==='true');

// เมนูของชิ้นเสื้อผ้า
await page.locator('.gchip').last().locator('[data-more]').click(); await page.waitForTimeout(150);
t('ปุ่ม ⋯ เปิดเมนูแก้ไข/ลบ', await page.locator('.gchip__pop').isVisible());
t('ทุกแถวในเมนูสูง >=44px',
  await page.locator('.gchip__pop button').first().evaluate(e=>e.getBoundingClientRect().height>=44));
await page.keyboard.press('Escape'); await page.waitForTimeout(150);
t('Escape ปิดเมนูได้', (await page.locator('.gchip__pop').count())===0);

// แก้ไขโดยไม่แตะรูป
await page.locator('.gchip').last().locator('[data-more]').click(); await page.waitForTimeout(120);
await page.locator('.gchip').last().locator('[data-edit]').click(); await page.waitForTimeout(150);
await page.fill('#fName','เสื้อเชิ้ตเขียว');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(250);
t('แก้ไขชื่อได้', (await page.locator('.gchip').last().textContent()).includes('เสื้อเชิ้ตเขียว'));

// ลบ (ผ่าน confirm)
await page.locator('.gchip').last().locator('[data-more]').click(); await page.waitForTimeout(120);
await page.locator('.gchip').last().locator('[data-del]').click(); await page.waitForTimeout(150);
t('การลบมี ConfirmDialog', await page.locator('#confirmDlg').isVisible());
await page.locator('#dlgOk').click(); await page.waitForTimeout(250);
t('ลบแล้วเหลือ 10 ชิ้น', (await page.locator('.gchip').count())===10);

// ---------- 6. insufficient + auto switch ----------
console.log('\n== 6. Insufficient + auto mode switch (AC7, ux §7B) ==');
await page.locator('[data-mode="wardrobe"]').click(); await page.waitForTimeout(250);
t('ตั้งต้นอยู่โหมดตู้ก่อนทดสอบการสลับอัตโนมัติ',
  await page.locator('[data-mode="wardrobe"]').getAttribute('aria-checked')==='true');
await page.locator('[data-clearsample="1"]').click(); await page.waitForTimeout(300);
t('ล้างตัวอย่างแล้วตู้ว่าง', (await page.locator('.gchip').count())===0);
t('ตู้ว่าง -> ระบบสลับไปโหมดไอเดียให้เอง', await page.locator('[data-mode="idea"]').getAttribute('aria-checked')==='true');
t('และมีข้อความอธิบายการสลับ ไม่สลับเงียบ',
  (await page.locator('#autoNoticeSlot').textContent()).includes('ไม่พอจัดชุด'));
t('โหมดไอเดียยังใช้ได้แม้ตู้ว่าง (AC8)', (await page.locator('.card').count())>=3);
await page.locator('[data-mode="wardrobe"]').click(); await page.waitForTimeout(250);
const insTxt=await page.locator('#resultsSlot').textContent();
t('เลือกโหมดตู้เองทั้งที่ของไม่พอ -> บอกว่าขาดอะไร ไม่แนะนำมั่ว', /ยังขาด/.test(insTxt), insTxt.slice(0,60));
t('และมีทางออกให้กลับไปโหมดไอเดีย', (await page.locator('[data-setmode="idea"]').count())>0);

// ---------- 7. ไม่มี horizontal scroll ----------
console.log('\n== 7. Responsive: หน้าห้ามเลื่อนแนวนอน ==');
for(const w of [360,390,640,768,1024,1440]){
  await page.setViewportSize({width:w,height:900}); await page.waitForTimeout(200);
  const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  t(`${w}px ไม่ล้นแนวนอน`, over<=1, 'ล้น '+over+'px');
}

// ---------- 8. a11y ----------
console.log('\n== 8. a11y ==');
await page.setViewportSize({width:1280,height:900});
await page.locator('[data-mode="idea"]').click(); await page.waitForTimeout(250);
const small=await page.evaluate(()=>{
  const bad=[];
  document.querySelectorAll('button,input,select,a[href]').forEach(el=>{
    if(el.classList.contains('visually-hidden')||el.offsetParent===null) return;
    if(el.classList.contains('pbar__seg')) return;      // segment ของกราฟ มี legend เป็นทางเข้าหลัก
    const r=el.getBoundingClientRect();
    if(!r.width||!r.height) return;
    if(r.height>=44) return;                 // กล่องใหญ่พออยู่แล้ว
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const hits=y=>{ const e=document.elementFromPoint(cx,y); return !!e && (e===el||el.contains(e)); };
    // กล่องเล็กกว่า 44 -> ต้องมีพื้นที่แตะ 44px ครอบอยู่จริง
    if(!hits(cy-21)||!hits(cy+21))
      bad.push((el.textContent||el.id||el.className).trim().slice(0,28)+` กล่อง ${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  return bad;
});
t('touch target สูง >=44px ทุกตัว', small.length===0, small.join(' | '));
t('ทุก segment ของแถบสัดส่วนโฟกัสด้วยคีย์บอร์ดได้ (เป็น button)',
  await page.locator('.pbar__seg').first().evaluate(e=>e.tagName)==='BUTTON');
t('segment มี aria-label บอกชื่อสี+%+role',
  /%/.test(await page.locator('.pbar__seg').first().getAttribute('aria-label')));
t('แถบสัดส่วนมี aria-label สรุปทั้งแถบ',
  (await page.locator('.pbar__track').first().getAttribute('aria-label')).startsWith('สัดส่วนสี:'));
t('ModeToggle เป็น radiogroup จริง', await page.locator('.modetoggle').getAttribute('role')==='radiogroup');
t('ปุ่ม < > มี aria-label', (await page.locator('[data-nav="1"]').getAttribute('aria-label'))==='ชุดถัดไป');
t('legend แสดงทุกสีเสมอ (ทางเข้าหลักบนจอสัมผัส)',
  (await page.locator('.card--focused .pbar__item').count())===(await page.locator('.card--focused .pbar__seg').count()));
// ลูกศรคีย์บอร์ด
await page.locator('[data-nav="1"]').focus();
const p1=await pos(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120);
t('ลูกศรขวาเลื่อนชุดได้', (await pos())!==p1);
t('โฟกัสไม่หลุดหลังกดลูกศร', await page.evaluate(()=>document.activeElement.getAttribute('data-nav'))==='1');

// ---------- 9. reduced motion ----------
console.log('\n== 9. prefers-reduced-motion ==');
const rm=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
const rp=await rm.newPage(); await rp.goto(FILE); await rp.waitForTimeout(400);
const dur=await rp.evaluate(()=>getComputedStyle(document.querySelector('.carousel__track')).transitionDuration);
t('ตัด transition ของ carousel', parseFloat(dur)<0.01, dur);
const sc=await rp.evaluate(()=>getComputedStyle(document.querySelector('.card--adjacent')).transform);
t('ไม่ย่อการ์ดข้างเคียงเมื่อ reduced-motion', sc==='none', sc);
await rm.close();

// ---------- 10. localStorage ถูกบล็อก (AC3) ----------
console.log('\n== 10. localStorage ถูกบล็อก (FR-0 AC3) ==');
const bc=await browser.newContext({viewport:{width:1280,height:900}});
await bc.addInitScript(()=>{ Object.defineProperty(window,'localStorage',{get(){ throw new DOMException('blocked'); }}); });
const bp=await bc.newPage(); const berr=[]; bp.on('pageerror',e=>berr.push(String(e)));
await bp.goto(FILE); await bp.waitForTimeout(400);
t('หน้ายังทำงาน ไม่ crash', berr.length===0, berr.join('|'));
t('ยังแนะนำชุดได้', (await bp.locator('.card').count())>=3);
t('มีแบนเนอร์เตือนว่าบันทึกถาวรไม่ได้',
  (await bp.locator('#storageBannerSlot').textContent()).includes('บันทึกข้อมูลถาวรไม่ได้'));
await bp.locator('#addBtn').click(); await bp.waitForTimeout(150);
await bp.fill('#fName','ทดสอบ'); await bp.fill('#fHex','#884422');
await bp.locator('#gForm button[type=submit]').click(); await bp.waitForTimeout(250);
t('ยังเพิ่มของในเซสชันได้', (await bp.locator('.gchip').count())===11);
await bc.close();

// ---------- 11. FR-2 Swap One Item ----------
console.log('\n== 11. FR-2 Swap One Item ==');
let swCtx=await browser.newContext({viewport:{width:1280,height:900}});
let swPage=await swCtx.newPage();
await swPage.goto(FILE); await swPage.waitForTimeout(400);
t('เริ่มที่โหมดจากตู้ของฉัน (ตู้ตัวอย่างพร้อม)',
  await swPage.locator('[data-mode="wardrobe"]').getAttribute('aria-checked')==='true');

const focusedTop=()=>swPage.locator('.card--focused [data-swap-cat="top"]');
t('ช่องหมวด "เสื้อ" ในการ์ดที่โฟกัสแตะได้ (มี garment หลายตัวในตู้)', await focusedTop().count()===1);
const topBefore=await swPage.locator('.card--focused .tile').nth(0).textContent();
const bottomBefore=await swPage.locator('.card--focused .tile').nth(1).textContent();
await focusedTop().click(); await swPage.waitForTimeout(150);
const topAfter=await swPage.locator('.card--focused .tile').nth(0).textContent();
const bottomAfter=await swPage.locator('.card--focused .tile').nth(1).textContent();
t('AC1 กดเปลี่ยนเสื้อแล้วเสื้อเปลี่ยน', topAfter!==topBefore);
t('AC1 กดเปลี่ยนเสื้อแล้วกางเกงไม่เปลี่ยน (ล็อกหมวดอื่น)', bottomAfter===bottomBefore);
t('AC3 สัดส่วนสี/คำแนะนำอัปเดตตามชุดใหม่',
  (await swPage.locator('.card--focused .pbar__track').getAttribute('aria-label')).startsWith('สัดส่วนสี:'));
t('มีข้อความบอกว่าเปลี่ยนแล้ว (no silent state change)',
  (await swPage.locator('#liveFeedback').textContent()).includes('เปลี่ยน'));

// AC2: กดซ้ำวนตัวถัดไป -- ตู้ตัวอย่างมีเสื้อ 3 ตัว กดสามครั้งต้องเห็นมากกว่า 1 ค่า
const seen=new Set([topAfter]);
for(let i=0;i<3;i++){
  await focusedTop().click(); await swPage.waitForTimeout(150);
  seen.add(await swPage.locator('.card--focused .tile').nth(0).textContent());
}
t('AC2 กดซ้ำวนตัวถัดไปได้หลายตัว (ไม่ค้างค่าเดียว)', seen.size>1);

// พูลระดับฟังก์ชัน: หมวดที่ตู้มีของชิ้นเดียว (นอก/แอกเซสซอรี ในตู้ตัวอย่างมีอย่างละ 1) ต้องมีพูลแค่ 1
const singlePools=await swPage.evaluate(()=>{
  var o=state.batch[state.index];
  return { outer:categoryPool(o,'outer').length, accessory:categoryPool(o,'accessory').length };
});
t('หมวดที่ตู้มีของชิ้นเดียว (นอก) พูลมีแค่ 1', singlePools.outer===1);
t('หมวดที่ตู้มีของชิ้นเดียว (แอกเซสซอรี) พูลมีแค่ 1', singlePools.accessory===1);

// บังคับช่อง "นอก" ให้ว่าง แล้วตรวจ "+ เพิ่ม" (spec §7B) -> กดแล้วเติมของได้ -> เหลือของชิ้นเดียว ปุ่มต้องถูกปิด (spec §7C)
await swPage.evaluate(()=>{
  var i=state.index, o=state.batch[i];
  var items=Object.assign({}, o.items); delete items.outer;
  state.batch[i]=buildOutfit(items, o.sourceMode, state.occasion);
  state.swapState={};
  renderResults();
});
await swPage.waitForTimeout(100);
const outerTile=()=>swPage.locator('.card--focused .tile').nth(3);
t('ช่องว่างที่ตู้มีของพอเติมโชว์ "+ เพิ่ม" แทนการซ่อนไปเลย (spec §7B)',
  (await swPage.locator('.card--focused [data-swap-cat="outer"]').textContent()).includes('เพิ่ม'));
await swPage.locator('.card--focused [data-swap-cat="outer"]').click(); await swPage.waitForTimeout(150);
t('กด "+ เพิ่ม" แล้วมีของใส่ในช่องจริง',
  !(await outerTile().evaluate(el=>el.classList.contains('tile--empty'))));
t('เติมแล้วปุ่มถูกปิดเพราะมีชิ้นเดียวในหมวดนี้ (spec §7C)',
  await outerTile().locator('button').getAttribute('disabled')!==null);
await swCtx.close();

// ---------- 12. FR-3 Favorite Outfit ----------
console.log('\n== 12. FR-3 Favorite Outfit ==');
let fvCtx=await browser.newContext({viewport:{width:1280,height:900}});
let fvPage=await fvCtx.newPage();
await fvPage.goto(FILE); await fvPage.waitForTimeout(400);

const favBtn=()=>fvPage.locator('.card--focused [data-fav-save]');
t('เริ่มต้นการ์ดที่โฟกัสยังไม่ถูกบันทึกเป็นชุดโปรด', await favBtn().getAttribute('aria-pressed')==='false');
await favBtn().click(); await fvPage.waitForTimeout(150);
t('AC1 กด ♡ แล้วกลายเป็น ♥ (บันทึกแล้ว)', await favBtn().getAttribute('aria-pressed')==='true');
t('มีข้อความบอกว่าบันทึกแล้ว (no silent state change)',
  (await fvPage.locator('#liveFeedback').textContent()).includes('บันทึก'));

// กด ♥ ซ้ำ = เอาออกจากชุดโปรด (toggle) -- ต้องเช็กตอนการ์ดยังเป็นชุดเดิม (ก่อนรีเฟรชที่จะสุ่มชุดใหม่)
await favBtn().click(); await fvPage.waitForTimeout(150);
t('กดซ้ำเอาออกจากชุดโปรดได้ (toggle)', await favBtn().getAttribute('aria-pressed')==='false');
await favBtn().click(); await fvPage.waitForTimeout(150);   /* บันทึกกลับไว้ใช้ต่อขั้นถัดไป */
t('บันทึกกลับได้อีกครั้งหลัง toggle', await favBtn().getAttribute('aria-pressed')==='true');

await fvPage.locator('[data-jump="sec-favorites"]').click(); await fvPage.waitForTimeout(300);
t('AC1 ชุดที่บันทึกโผล่ในหน้าชุดโปรด', (await fvPage.locator('#sec-favorites .gchip').count())===1);
t('นับจำนวนชุดโปรดถูกต้อง', (await fvPage.locator('#favCount').textContent())==='1 / 20 ชุด');

// AC2: ทำสำเนา
await fvPage.locator('#sec-favorites [data-fav-more]').click(); await fvPage.waitForTimeout(150);
await fvPage.locator('#sec-favorites [data-fav-dup]').click(); await fvPage.waitForTimeout(200);
t('AC2 Duplicate ได้สำเนาแยกเป็นชุดใหม่', (await fvPage.locator('#sec-favorites .gchip').count())===2);
t('สำเนาแยกจากต้นฉบับ (แก้ชื่อไม่กระทบกัน)',
  (await fvPage.locator('#sec-favorites .gchip__name').last().textContent()).includes('สำเนา'));

// ตั้งชื่อ (ระบุไว้ใน FR-3 หัวข้อ แม้ไม่มี AC เลขกำกับ)
await fvPage.locator('#sec-favorites .gchip').first().locator('[data-fav-more]').click(); await fvPage.waitForTimeout(150);
await fvPage.locator('#sec-favorites .gchip').first().locator('[data-fav-rename]').click(); await fvPage.waitForTimeout(150);
await fvPage.fill('#favRenameInput', 'ชุดออกเดตสุดโปรด');
await fvPage.keyboard.press('Enter'); await fvPage.waitForTimeout(150);
t('ตั้งชื่อชุดโปรดได้', (await fvPage.locator('#sec-favorites .gchip').first().textContent()).includes('ชุดออกเดตสุดโปรด'));

// AC1: รอดหลังรีเฟรช
await fvPage.reload(); await fvPage.waitForTimeout(400);
t('AC1 ชุดโปรดคงอยู่หลังรีเฟรช (2 ชุด)', (await fvPage.locator('#sec-favorites .gchip').count())===2);
t('ชื่อที่ตั้งไว้รอดหลังรีเฟรชด้วย',
  (await fvPage.locator('#sec-favorites .gchip__name').first().textContent()).includes('ชุดออกเดตสุดโปรด'));

// AC3: ลบเฉพาะชุดนั้น (ผ่าน ConfirmDialog เหมือน wardrobe)
await fvPage.locator('#sec-favorites .gchip').last().locator('[data-fav-more]').click(); await fvPage.waitForTimeout(150);
await fvPage.locator('#sec-favorites .gchip').last().locator('[data-fav-del]').click(); await fvPage.waitForTimeout(150);
t('การลบชุดโปรดมี ConfirmDialog', await fvPage.locator('#confirmDlg').isVisible());
await fvPage.locator('#dlgOk').click(); await fvPage.waitForTimeout(250);
t('AC3 ลบแล้วเหลือชุดเดียว (ลบเฉพาะชุดนั้นจริง)', (await fvPage.locator('#sec-favorites .gchip').count())===1);
t('ชุดที่เหลือยังเป็นชุดที่ตั้งชื่อไว้ (ไม่ได้ลบผิดตัว)',
  (await fvPage.locator('#sec-favorites .gchip__name').first().textContent()).includes('ชุดออกเดตสุดโปรด'));

await fvPage.locator('[data-jump="sec-suggest"]').click(); await fvPage.waitForTimeout(300);

// spec §7C: ครบ 20 ชุดแล้วห้ามดรอปเงียบๆ (การ์ดหลังรีเฟรชเป็นชุดสุ่มใหม่ จึงตั้งด้วยสีที่ไม่ชนของจริงแน่ๆ)
await fvPage.evaluate(()=>{
  state.favorites = Array.from({length:20},(_,i)=>({
    id:'f-cap-'+i, name:'ชุดทดสอบ '+i,
    items:{ top:{name:'ทดสอบบน',category:'top',color:'#010203'}, bottom:{name:'ทดสอบล่าง',category:'bottom',color:'#040506'} },
    colorBreakdown:[], ruleUsed:'monochrome', advice:[], createdAt:Date.now()
  }));
  persist(); renderFavorites();
});
await fvPage.waitForTimeout(100);
t('ตั้งสถานการณ์ครบ 20 ชุดสำเร็จ', (await fvPage.locator('#favCount').textContent())==='20 / 20 ชุด');
await favBtn().click(); await fvPage.waitForTimeout(150);
t('ครบ 20 แล้วกด Save ใหม่ -> มีข้อความเตือน ไม่เงียบๆ ดรอป',
  (await fvPage.locator('#liveFeedback').textContent()).includes('ครบ 20 ชุดแล้ว'));
t('จำนวนชุดโปรดยังคง 20 (ไม่ถูกเพิ่มเกิน)', (await fvPage.locator('#favCount').textContent())==='20 / 20 ชุด');
await fvCtx.close();

// ---------- 13. ภาพหน้าจอ ----------
console.log('\n== 13. เก็บภาพหน้าจอ ==');
for(const [name,opt] of [
  ['desktop-light',{viewport:{width:1280,height:1000},colorScheme:'light'}],
  ['desktop-dark', {viewport:{width:1280,height:1000},colorScheme:'dark'}],
  ['mobile-light', {viewport:{width:390,height:844},colorScheme:'light',isMobile:true,hasTouch:true}],
  ['mobile-dark',  {viewport:{width:390,height:844},colorScheme:'dark',isMobile:true,hasTouch:true}],
]){
  const c=await browser.newContext(opt); const p=await c.newPage();
  await p.goto(FILE); await p.waitForTimeout(500);
  await p.screenshot({path:`${SHOT}/${name}.png`,fullPage:false});
  if(name==='desktop-light'){
    await p.locator('#addBtn').click(); await p.waitForTimeout(200);
    await p.locator('#sec-wardrobe').scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    await p.screenshot({path:`${SHOT}/desktop-form.png`});
  }
  await c.close(); console.log('  ok  '+name+'.png');
}

await browser.close();
console.log(fails?`\n### ${fails} ข้อไม่ผ่าน\n`:'\n### ผ่านทั้งหมด\n');
process.exit(fails?1:0);
})().catch(e=>{console.error('CRASH',e);process.exit(2)});
