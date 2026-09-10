global.localStorage = { getItem(){return null}, setItem(){}, };
global.window = {}; global.document = { createElement(){ throw new Error('no dom') } };
const fs=require('fs'), path=require('path');
// ดึงโค้ดจาก app.html ตรงๆ เพื่อให้เทสต์วิ่งบนของจริงเสมอ ไม่มีสำเนาให้ล้าสมัย
// เอาเฉพาะ 4 บล็อกแรก (constants+utils, engine, batch/storage/seed) ที่ไม่แตะ DOM
const appHtml=fs.readFileSync(path.join(__dirname,'..','app.html'),'utf8');
const blocks=[...appHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
if(blocks.length<4) throw new Error('หาบล็อก <script> ใน app.html ไม่ครบ');
eval(blocks.slice(0,4).join('\n').replace(/^"use strict";/gm,''));

let fails=0;
const t=(name,cond,extra='')=>{ if(cond) console.log('  ok  '+name); else {fails++;console.log('  FAIL '+name+' '+extra);} };

console.log('\n== 1. คอนทราสต์ (ยืนยัน plan §0.1) ==');
const pairs=[
  ['#E23A4E','#FBFAF7','accent (ไม่ใช่ตัวอักษร) บน bg, เกณฑ์ 3:1',3],['#C62F41','#FBFAF7','eyebrow บน bg (light)',4.5],['#F1596B','#141316','eyebrow บน bg (dark)',4.5],
  ['#FFFFFF','#C62F41','accent-solid ใหม่ (light)',4.5],
  ['#FFFFFF','#A82636','accent-solid-hover (light)',4.5],
  ['#17161A','#F1596B','accent-ink บน accent (dark)',4.5],
  ['#6E6B66','#FBFAF7','ink-muted บน bg (light)',4.5],
  ['#6E6B66','#FFFFFF','ink-muted บน surface (light)',4.5],
  ['#17161A','#FFFFFF','ink บน surface (light)',4.5],
  ['#A7A29A','#1C1B1F','ink-muted บน surface (dark)',4.5],
  ['#F4F1EA','#1C1B1F','ink บน surface (dark)',4.5],
  ['#E23A4E','#FBFAF7','focus ring บน bg (ต้องการ 3:1)',3],
  ['#F1596B','#141316','focus ring บน bg (dark, 3:1)',3],
  ['#B3261E','#FFFFFF','danger บน surface (light)',4.5],
  ['#F2B8B5','#1C1B1F','danger บน surface (dark)',4.5],
];
for(const [a,b,label,min] of pairs){
  const r=contrastRatio(a,b);
  const pass=r>=min;
  console.log(`  ${pass?'ok  ':'FAIL'} ${label}: ${r.toFixed(2)}:1 (ต้องการ ${min})`);
  if(!pass) fails++;
}

console.log('\n== 2. engine: proportion ==');
for(let n=0;n<200;n++){
  const cats=['top','bottom','shoes','outer','accessory'].filter((c,i)=>i<2||Math.random()<.5);
  const entries=cats.map(c=>({hex:hslToHex(Math.random()*360,Math.random()*90,10+Math.random()*80),category:c}));
  const bd=computeProportion(entries);
  const sum=bd.reduce((s,b)=>s+b.pct,0);
  if(sum!==100){ console.log('  FAIL sum='+sum); fails++; break; }
}
t('% รวมได้ 100 พอดีทุกครั้ง (200 รอบ)', true);

console.log('\n== 3. engine: Color Role ==');
let maxAccent=0, noPrimary=0;
for(let n=0;n<400;n++){
  const cats=['top','bottom','shoes','outer','accessory'].filter((c,i)=>i<2||Math.random()<.6);
  const entries=cats.map(c=>({hex:hslToHex(Math.random()*360,Math.random()*95,8+Math.random()*84),category:c}));
  const bd=computeProportion(entries);
  const rows=assignRoles(bd,entries);
  const acc=rows.filter(r=>r.role==='accent').length;
  if(acc>maxAccent) maxAccent=acc;
  if(!rows.some(r=>r.role==='primary')) noPrimary++;
}
t('Accent ไม่เกิน 1 ต่อลุค (400 รอบ)', maxAccent<=1, 'max='+maxAccent);
t('ทุกลุคมี Primary 1 (400 รอบ)', noPrimary===0, 'ขาด '+noPrimary+' ลุค');

console.log('\n== 4. engine: harmony rule ==');
const known=['monochrome','analogous','complementary','triadic','neutral-accent','neutral'];
let bad=0;
for(let n=0;n<300;n++){
  const cols=Array.from({length:2+Math.floor(Math.random()*3)},()=>hslToHex(Math.random()*360,Math.random()*95,8+Math.random()*84));
  const h=detectHarmony(cols);
  if(!known.includes(h.rule)||!(h.clarity>=0&&h.clarity<=1)) bad++;
}
t('คืน rule ที่รู้จักเสมอ + clarity 0-1', bad===0, bad+' เคสพลาด');
t('analogous ตรวจได้', detectHarmony(['#3355CC','#3399CC']).rule==='analogous', detectHarmony(['#3355CC','#3399CC']).rule);
t('complementary ตรวจได้', detectHarmony(['#CC3333','#33CCCC']).rule==='complementary', detectHarmony(['#CC3333','#33CCCC']).rule);
t('monochrome ตรวจได้', detectHarmony(['#2B3A67','#4A5D8A']).rule==='monochrome', detectHarmony(['#2B3A67','#4A5D8A']).rule);
t('neutral ล้วนตรวจได้', detectHarmony(['#FFFFFF','#17161A','#888888']).rule==='neutral', detectHarmony(['#FFFFFF','#17161A','#888888']).rule);

console.log('\n== 5. ห้ามมีคะแนนใน outfit object (spec §4.3) ==');
const wd=seedWardrobe();
const b=generateWardrobeBatch(wd,'unspecified',{});
const json=JSON.stringify(b.outfits);
t('ไม่มีคีย์ _harmony / score ใน object ที่จะ render', !/_harmony|"score"|harmonyScore/.test(json));
t('scoreOf() ยังอ่านค่าได้จาก WeakMap (ใช้เรียงได้จริง)', scoreOf(b.outfits[0])>0, scoreOf(b.outfits[0]));

console.log('\n== 6. FR-1 acceptance ==');
t('AC1 ตู้มีบน+ล่าง -> ได้ >=1 ชุด', b.outfits.length>=1, b.outfits.length);
t('AC6 แบตช์ 3-4 ชุด', b.outfits.length>=3&&b.outfits.length<=4, b.outfits.length);
t('AC2 ทุกชุดมีบน+ล่างครบ', b.outfits.every(o=>o.items.top&&o.items.bottom));
t('AC4 ทุกชุดมีสัดส่วน + คำแนะนำ >=1', b.outfits.every(o=>o.colorBreakdown.length&&o.advice.length>=1));
t('AC3 ทุกชิ้นมาจากตู้จริง', b.outfits.every(o=>Object.values(o.items).every(it=>wd.some(g=>g.id===it.id))));
const ins=generateWardrobeBatch(wd.filter(g=>g.category!=='bottom'),'unspecified',{});
t('AC7 ตู้ขาดล่าง -> insufficient ระบุหมวด', ins.insufficient&&ins.insufficient.includes('bottom'), JSON.stringify(ins.insufficient));
const idea=generateIdeaBatch('unspecified',{});
t('AC8 โหมด idea ได้ผลแม้ตู้ว่าง', idea.outfits.length>=3, idea.outfits.length);
t('AC8 idea ทุกชุดมีบน+ล่าง', idea.outfits.every(o=>o.items.top&&o.items.bottom));

console.log('\n== 7. AC5 โอกาสเอนโทนจริงไหม ==');
function avgOf(occ){
  let s=0,l=0,n=0;
  for(let i=0;i<40;i++){ generateIdeaBatch(occ,{}).outfits.forEach(o=>o.colorBreakdown.forEach(c=>{const h=hexToHsl(c.hex);s+=h.s*c.pct;l+=h.l*c.pct;n+=c.pct;})); }
  return {s:s/n,l:l/n};
}
const work=avgOf('work'), party=avgOf('party');
console.log(`  work : S=${work.s.toFixed(1)} L=${work.l.toFixed(1)}`);
console.log(`  party: S=${party.s.toFixed(1)} L=${party.l.toFixed(1)}`);
t('party อิ่มสีสูงกว่า work (เอนโทนตามนิยาม)', party.s>work.s, `${party.s.toFixed(1)} vs ${work.s.toFixed(1)}`);
t('work สว่างน้อยกว่าหรือเท่า party (เข้ม/นิ่งกว่า)', work.l<=party.l+0.5, `${work.l.toFixed(1)} vs ${party.l.toFixed(1)}`);

console.log('\n== 8. ชื่อสีภาษาไทย ==');
[['#FFFFFF','ขาว'],['#17161A','ดำ'],['#2B3A67','กรมท่า'],['#EFE6D2','ครีม'],['#C0392B','แดง'],['#6B4A2F','น้ำตาล'],['#888888','เทา']]
 .forEach(([hex,want])=>t(`${hex} -> ${colorNameTH(hex)} (คาด "${want}")`, colorNameTH(hex).includes(want)||want.includes(colorNameTH(hex)), colorNameTH(hex)));

console.log('\n== 9. large wardrobe (spec §7C) ==');
const big=[]; for(let i=0;i<60;i++) big.push({id:'b'+i,name:'ชิ้น'+i,category:['top','bottom','shoes','outer','accessory'][i%5],color:hslToHex(i*17%360,40+i%50,30+i%50)});
const t0=Date.now(); const bb=generateWardrobeBatch(big,'party',{}); const ms=Date.now()-t0;
t(`ตู้ 60 ชิ้น สร้างแบตช์ใน ${ms}ms (< 1500ms)`, ms<1500, ms+'ms');
t('ยังได้ 3-4 ชุด', bb.outfits.length>=3&&bb.outfits.length<=4, bb.outfits.length);

console.log(fails? `\n### ${fails} ข้อไม่ผ่าน\n` : '\n### ผ่านทั้งหมด\n');
process.exit(fails?1:0);
