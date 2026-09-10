const {chromium}=require('playwright-core');
const path=require('path');
const FILE='file://'+path.join(__dirname,'..','outfit-color-matcher.html');
const DIR=__dirname;
let fails=0; const t=(n,c,x='')=>{ if(c) console.log('  ok  '+n); else {fails++;console.log('  FAIL '+n+(x?' -> '+x:''));} };
(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

console.log('\n== ดึงสีจากรูป (FR-0 AC2) ==');
let ctx=await browser.newContext({viewport:{width:1280,height:900}});
let page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
await page.goto(FILE); await page.waitForTimeout(400);
await page.locator('#addBtn').click(); await page.waitForTimeout(150);
await page.setInputFiles('#fFile', DIR+'/olive.png'); await page.waitForTimeout(700);
const hex=await page.inputValue('#fHex');
t('ช่อง hex ถูกเติมอัตโนมัติจากรูป', /^#[0-9A-F]{6}$/.test(hex), hex);
const want=[107,124,58];
const got=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const near=got.every((v,i)=>Math.abs(v-want[i])<=6);
t('สีที่ดึงได้ใกล้เคียงสีจริงของรูป (#6B7C3A)', near, hex);
t('มีข้อความบอกว่าเป็นค่าที่ระบบเดาให้ แก้ได้',
  (await page.locator('#fImgHelp').textContent()).includes('เดาสีจากรูปให้แล้ว'));
t('มีพรีวิวรูป', await page.locator('.drop img').isVisible());

await page.fill('#fHex','#4C6EA8'); await page.waitForTimeout(150);
await page.locator('[data-cat="top"]').click();
await page.fill('#fName','เสื้อทดสอบ');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(400);
const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('outfit-color-matcher.v1')).wardrobe.slice(-1)[0]);
t('ค่าที่ผู้ใช้แก้เองคือค่าที่ถูกเก็บ ไม่ใช่ค่าที่ระบบเดา', saved.color==='#4C6EA8', saved.color);
t('รูปถูกเก็บเป็น data URL (ไม่มี external fetch)', /^data:image\/jpeg/.test(saved.photo||''), (saved.photo||'').slice(0,24));

console.log('\n== AC4 แก้ไขโดยไม่เลือกรูปใหม่ -> รูปเดิมคงอยู่ ==');
const before=saved.photo;
await page.locator('.gchip').last().locator('[data-more]').click(); await page.waitForTimeout(120);
await page.locator('.gchip').last().locator('[data-edit]').click(); await page.waitForTimeout(200);
await page.fill('#fName','เสื้อทดสอบ (แก้ชื่อ)');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(300);
const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('outfit-color-matcher.v1')).wardrobe.slice(-1)[0]);
t('AC4 รูปเดิมยังอยู่ครบ', after.photo===before);
t('ชื่อถูกแก้จริง', after.name.includes('แก้ชื่อ'));

console.log('\n== ไฟล์ที่ไม่ใช่รูป -> ข้อความบอก ฟอร์มยังใช้ต่อได้ ==');
await page.locator('#addBtn').click(); await page.waitForTimeout(200);
await page.setInputFiles('#fFile', {name:'a.txt', mimeType:'text/plain', buffer:Buffer.from('not an image')});
await page.waitForTimeout(400);
t('มีข้อความ "อ่านรูปไม่สำเร็จ"', (await page.locator('#fImgHelp').textContent()).includes('อ่านรูปไม่สำเร็จ'));
t('ยังกรอก hex เองต่อได้', await page.locator('#fHex').isEnabled());
await page.fill('#fHex','#AA3355'); await page.fill('#fName','กรอกมือ');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(300);
t('บันทึกด้วย hex ที่กรอกเองได้', (await page.locator('.gchip').last().textContent()).includes('#AA3355'));
t('ไม่มี page error ตลอดเส้นทางรูปภาพ', errs.length===0, errs.join('|'));

console.log('\n== hex ไม่ถูกต้อง ==');
await page.locator('#addBtn').click(); await page.waitForTimeout(200);
await page.fill('#fHex','ไม่ใช่สี'); await page.fill('#fName','ผิด');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(250);
t('ไม่บันทึก + บอกรูปแบบที่ถูก', (await page.locator('#fHexHelp').textContent()).includes('#4A5D8A'));
t('ช่องถูกทำเครื่องหมายว่าไม่ถูกต้อง', (await page.getAttribute('#fHex','class')).includes('input--invalid'));
await page.locator('[data-cancel="1"]').click(); await page.waitForTimeout(150);
await ctx.close();

console.log('\n== localStorage เต็ม (quota) -> เซฟแบบไม่มีรูป (spec §7C) ==');
ctx=await browser.newContext({viewport:{width:1280,height:900}});
await ctx.addInitScript(()=>{
  const real=localStorage.setItem.bind(localStorage);
  localStorage.setItem=function(k,v){
    if(String(v).includes('data:image')) { const e=new DOMException('quota','QuotaExceededError'); throw e; }
    return real(k,v);
  };
});
page=await ctx.newPage(); const e2=[]; page.on('pageerror',e=>e2.push(String(e)));
await page.goto(FILE); await page.waitForTimeout(400);
await page.locator('#addBtn').click(); await page.waitForTimeout(150);
await page.setInputFiles('#fFile', DIR+'/olive.png'); await page.waitForTimeout(700);
await page.fill('#fName','ชิ้นที่พื้นที่เต็ม');
await page.locator('#gForm button[type=submit]').click(); await page.waitForTimeout(400);
t('ไม่ crash', e2.length===0, e2.join('|'));
t('ชิ้นนั้นยังถูกเพิ่มเข้าตู้', (await page.locator('.gchip').count())===11);
const q=await page.evaluate(()=>JSON.parse(localStorage.getItem('outfit-color-matcher.v1')).wardrobe.slice(-1)[0]);
t('เก็บสี+หมวดไว้ครบ', q.color && q.category==='top', JSON.stringify({c:q.color,cat:q.category}));
t('รูปถูกตัดออกเพื่อให้เซฟผ่าน', !q.photo);
t('มีแบนเนอร์เตือนว่าพื้นที่เต็มและเซฟแบบไม่มีรูปให้แล้ว',
  (await page.locator('#storageBannerSlot').textContent()).includes('บันทึกชิ้นนี้แบบไม่มีรูป'));
await page.reload(); await page.waitForTimeout(400);
t('ข้อมูลอยู่รอดหลังรีเฟรช', (await page.locator('.gchip').count())===11);
await ctx.close();

await browser.close();
console.log(fails?`\n### ${fails} ข้อไม่ผ่าน\n`:'\n### ผ่านทั้งหมด\n');
process.exit(fails?1:0);
})().catch(e=>{console.error('CRASH',e);process.exit(2)});
