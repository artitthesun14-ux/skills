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
/* เฟส 4-C: เหลือโหมดเดียว คู่ของโทเคน dark ถูกลบทิ้งไปพร้อมกับโค้ด ไม่ใช่ปล่อยไว้เขียวลอยๆ */
const pairs=[
  ['#E23A4E','#FBFAF7','accent (ไม่ใช่ตัวอักษร) บน bg, เกณฑ์ 3:1',3],
  ['#C62F41','#FBFAF7','eyebrow บน bg',4.5],
  ['#FFFFFF','#C62F41','accent-solid ใหม่',4.5],
  ['#FFFFFF','#A82636','accent-solid-hover',4.5],
  ['#6E6B66','#FBFAF7','ink-muted บน bg',4.5],
  ['#6E6B66','#FFFFFF','ink-muted บน surface',4.5],
  ['#17161A','#FFFFFF','ink บน surface',4.5],
  ['#E23A4E','#FBFAF7','focus ring บน bg (ต้องการ 3:1)',3],
  ['#B3261E','#FFFFFF','danger บน surface',4.5],
];
for(const [a,b,label,min] of pairs){
  const r=contrastRatio(a,b);
  const pass=r>=min;
  console.log(`  ${pass?'ok  ':'FAIL'} ${label}: ${r.toFixed(2)}:1 (ต้องการ ${min})`);
  if(!pass) fails++;
}

/* เฟส 4-C: พื้นหลังไดนามิกใช้ hue ของชุดที่โฟกัส แต่ S/L ตรึงที่ 6%/95% เสมอ
   กวาดทั้งวงล้อสีเพื่อยืนยันว่าคอนทราสต์ไม่ตกไม่ว่า hue ไหน (แทนเทสต์ "เช็คสองธีม" เดิม) */
const TINT_S=6, TINT_L=95;
{
  let worstInk=99, bestInk=0, worstMuted=99, worstHue=-1;
  for(let h=0;h<360;h+=5){
    const bg=hslToHex(h,TINT_S,TINT_L);
    const ri=contrastRatio('#17161A',bg), rm=contrastRatio('#6E6B66',bg);
    if(ri<worstInk){ worstInk=ri; worstHue=h; }
    if(ri>bestInk) bestInk=ri;
    if(rm<worstMuted) worstMuted=rm;
  }
  t('ธีมไดนามิก: --ink บนพื้นหลังทุก hue ผ่าน 4.5:1 (แย่สุด '+worstInk.toFixed(2)+':1 ที่ hue '+worstHue+')', worstInk>=4.5);
  t('ธีมไดนามิก: --ink-muted บนพื้นหลังทุก hue ผ่าน 4.5:1 (แย่สุด '+worstMuted.toFixed(2)+':1)', worstMuted>=4.5);
  /* เหตุผลที่เลือก S6/L95: ความสว่างสัมพัทธ์แทบไม่ขยับตาม hue คอนทราสต์จึงนิ่ง ไม่ใช่แค่ "ผ่านพอดี"
     ถ้าค่านี้เกิน 1:1 เมื่อไหร่ แปลว่าพื้นหลังเริ่มสว่าง/มืดไม่เท่ากันตาม hue จนตาจับได้ */
  t('ธีมไดนามิก: คอนทราสต์ --ink ต่างกันทั้งวงล้อสีไม่เกิน 1:1 (ช่วง '+worstInk.toFixed(2)+'-'+bestInk.toFixed(2)+')',
    bestInk - worstInk <= 1);
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
t('AC2 ทุกชุดมีอย่างน้อย 2 ชิ้นจากหมวดต่างกัน', b.outfits.every(o=>Object.keys(o.items).length>=2));
t('AC4 ทุกชุดมีสัดส่วน + คำแนะนำ >=1', b.outfits.every(o=>o.colorBreakdown.length&&o.advice.length>=1));
t('AC3 ทุกชิ้นมาจากตู้จริง', b.outfits.every(o=>Object.values(o.items).every(it=>wd.some(g=>g.id===it.id))));
const ins=generateWardrobeBatch(wd.filter(g=>g.category!=='bottom'),'unspecified',{});
t('AC7 ตู้ขาดล่างแต่มีหมวดอื่นพอ -> ยังจัดชุดได้ (ไม่ใช่ insufficient อีกแล้ว)',
  !ins.insufficient && ins.outfits && ins.outfits.length>=1, JSON.stringify(ins.insufficient||('ได้ '+(ins.outfits||[]).length+' ชุด')));
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


console.log('\n== 10. §4.7 กฎสีโหมด "สีที่เราแนะนำ" (film/fashion palette research) ==');
{
  let noAccent=0, accentNotVivid=0, baseTooVivid=0, total=0;
  for(let n=0;n<300;n++){
    const idea=generateIdeaBatch('unspecified',{});
    idea.outfits.forEach(o=>{
      total++;
      const accentRow=o.colorBreakdown.find(r=>r.role==='accent');
      if(!accentRow) noAccent++;
      else if(hexToHsl(accentRow.hex).s < VIVID_MIN_S) accentNotVivid++;
      o.colorBreakdown.forEach(r=>{
        if(r.role!=='accent' && hexToHsl(r.hex).s >= VIVID_MIN_S) baseTooVivid++;
      });
    });
  }
  t('Accent มีทุกลุค ไม่ใช่เหรียญโยน (300 แบตช์)', noAccent===0, 'ขาด '+noAccent+' จาก '+total+' ลุค');
  t('Accent ที่มี อิ่มสีถึงระดับ vivid จริง', accentNotVivid===0, accentNotVivid+' ครั้งที่ accent ไม่ถึงเกณฑ์');
  t('Primary/Secondary/Neutral ไม่ล้ำเข้าเขต vivid ของ Accent', baseTooVivid===0, baseTooVivid+' ครั้งที่ role ฐานอิ่มสีเกิน VIVID_MIN_S');
}
{
  // regression: floor ของ S/L ที่ Secondary ชิฟต์จาก Primary เคยต่ำกว่า NEUTRAL_MAX_S=20 ทำให้
  // Secondary หลุดไปเป็น role "neutral" แทน (พบจาก /code-review: เกิด ~64% ของทุกลุคที่ rule
  // ไม่ใช่ neutral-accent) rule "neutral-accent" เท่านั้นที่ไม่มี secondary โดยออกแบบ (§4.7)
  let missingSecondary=0, notNeutralAccent=0, total=0;
  for(let n=0;n<300;n++){
    const idea=generateIdeaBatch('unspecified',{});
    idea.outfits.forEach(o=>{
      total++;
      if(o.ruleUsed==='neutral-accent') return;
      notNeutralAccent++;
      if(!o.colorBreakdown.some(r=>r.role==='secondary')) missingSecondary++;
    });
  }
  t('Secondary ไม่หลุดไปเป็น neutral เมื่อ rule ไม่ใช่ neutral-accent',
    missingSecondary===0, missingSecondary+'/'+notNeutralAccent+' ลุค (จาก '+total+' รวม)');
}
{
  // Secondary ต้องเป็น "เฉดเดียวกับ Primary" (Itten tint/shade): S ของ Secondary ต้องแปรผัน
  // ไปกับ S ของ Primary ที่สุ่มได้แล้ว (correlation เป็นบวกชัดเจน) ไม่ใช่สุ่มอิสระจากกัน
  const pairs=[];
  for(let n=0;n<300;n++){
    const idea=generateIdeaBatch('unspecified',{});
    idea.outfits.forEach(o=>{
      const primary=o.colorBreakdown.find(r=>r.role==='primary');
      const secondary=o.colorBreakdown.find(r=>r.role==='secondary');
      if(primary&&secondary) pairs.push([hexToHsl(primary.hex).s, hexToHsl(secondary.hex).s]);
    });
  }
  const n=pairs.length;
  const mx=pairs.reduce((s,p)=>s+p[0],0)/n, my=pairs.reduce((s,p)=>s+p[1],0)/n;
  let num=0,dx2=0,dy2=0;
  pairs.forEach(([x,y])=>{ num+=(x-mx)*(y-my); dx2+=(x-mx)**2; dy2+=(y-my)**2; });
  const corr=num/Math.sqrt(dx2*dy2);
  t('S ของ Secondary สัมพันธ์เชิงบวกกับ S ของ Primary (r='+corr.toFixed(2)+', ไม่ใช่สุ่มอิสระ)', corr>0.3, 'n='+n);
}
{
  // rule ที่โชว์ในโหมดไอเดียต้องกระจายครบทั้ง 5 แบบ ไม่กระจุกอยู่แค่ 2 แบบ
  // (เดิม detectHarmony ตีความ rule ใหม่จากสีที่มี Accent ปนอยู่ด้วย จึงเห็นแต่ triadic/neutral-accent
  //  แก้โดยให้ generateIdeaBatch ส่ง rule ที่ตัวเองเลือกไว้แล้วไปเป็น ruleUsed ตรงๆ)
  const seen={}, all=['monochrome','analogous','complementary','triadic','neutral-accent'];
  let total=0, distinctPerBatch=0, batches=0;
  for(let n=0;n<300;n++){
    const b=generateIdeaBatch('unspecified',{}).outfits;
    const inBatch={};
    b.forEach(o=>{ seen[o.ruleUsed]=(seen[o.ruleUsed]||0)+1; total++; inBatch[o.ruleUsed]=1; });
    distinctPerBatch+=Object.keys(inBatch).length; batches++;
  }
  const minShare=Math.min(...all.map(r=>(seen[r]||0)/total));
  const maxShare=Math.max(...all.map(r=>(seen[r]||0)/total));
  const avgDistinct=distinctPerBatch/batches;
  t('rule ทุกแบบมีสัดส่วนจริง (ต่ำสุด >= 8%) ไม่ใช่โผล่ประปราย', minShare>=0.08, 'ต่ำสุด '+(minShare*100).toFixed(0)+'%');
  t('ไม่มี rule ไหนกินสัดส่วนเกิน 40% ของแบตช์', maxShare<=0.40, 'สูงสุด '+(maxShare*100).toFixed(0)+'%');
  t('แต่ละแบตช์เห็น rule หลากหลาย (เฉลี่ย >= 3.5 แบบ)', avgDistinct>=3.5, 'เฉลี่ย '+avgDistinct.toFixed(2)+' แบบ/แบตช์');
}

console.log('\n== 11. FR-4 วิเคราะห์ตู้ (analyzeWardrobe) ==');
{
  const g=(id,cat,color)=>({id,name:'ชิ้น'+id,category:cat,shapeId:null,color});
  // AC5: ข้อมูลน้อยเกินไป -> บอกตรงๆ ไม่วิเคราะห์มั่ว
  t('AC5 ตู้ว่าง -> enough=false', analyzeWardrobe([]).enough===false);
  t('AC5 ตู้ 2 ชิ้น (น้อยกว่าเกณฑ์) -> enough=false',
    analyzeWardrobe([g('a','top','#FFFFFF'),g('b','bottom','#17161A')]).enough===false);

  // AC1: สัดส่วน % คิดจาก garment จริงในตู้
  const ward=[g('1','top','#FFFFFF'),g('2','top','#FFFFFF'),g('3','bottom','#2B3A67'),g('4','shoes','#C0392B')];
  const a=analyzeWardrobe(ward);
  t('AC1 ตู้ 4 ชิ้น -> enough=true + total ถูก', a.enough===true && a.total===4, 'total='+a.total);
  const white=a.colors.find(c=>c.hex==='#FFFFFF');
  t('AC1 สีที่ซ้ำถูกรวมเป็นก้อนเดียว + % ถูก (ขาว 2/4 = 50%)', white && white.count===2 && white.pct===50,
    white?('count='+white.count+' pct='+white.pct):'ไม่เจอขาว');
  t('AC1 % ของทุกสีรวมได้ 100 พอดี', a.colors.reduce((s,c)=>s+c.pct,0)===100,
    'รวม '+a.colors.reduce((s,c)=>s+c.pct,0));
  t('AC1 เรียงจากมากไปน้อย', a.colors.every((c,i)=>i===0||a.colors[i-1].pct>=c.pct));

  // AC2: แยกกลุ่ม Neutral/Cool/Warm/Accent ตามนิยาม 4.1 และต้องไม่ทับกัน
  const byKey={}; a.groups.forEach(x=>byKey[x.key]=x);
  t('AC2 มีครบ 4 กลุ่ม Neutral/Cool/Warm/Accent',
    ['neutral','cool','warm','accent'].every(k=>byKey[k]), Object.keys(byKey).join(','));
  t('AC2 จำนวนรวมทุกกลุ่ม = จำนวนชิ้นในตู้ (กลุ่มไม่ทับกัน)',
    a.groups.reduce((s,x)=>s+x.count,0)===4, 'รวม '+a.groups.reduce((s,x)=>s+x.count,0));
  t('AC2 ขาว+กรมท่าเข้ากลุ่มถูก (ขาว=neutral)', byKey.neutral.count>=2, 'neutral='+byKey.neutral.count);

  // AC3: insight 1-3 ข้อ และตู้ neutral จัด ต้องชวนเพิ่ม accent
  t('AC3 insight มี 1-3 ข้อเสมอ', a.insights.length>=1 && a.insights.length<=3, 'ได้ '+a.insights.length);
  const allNeutral=analyzeWardrobe([g('1','top','#FFFFFF'),g('2','top','#F2F0EB'),g('3','bottom','#17161A'),g('4','bottom','#8A8A8A')]);
  t('AC3 ตู้สีกลางล้วน -> มี insight ชวนเพิ่มสีเน้น',
    allNeutral.insights.some(s=>/สีเน้น|accent/i.test(s)), JSON.stringify(allNeutral.insights));

  // AC4: สีที่แนะนำต้องยังไม่มีในตู้ และเขียนเชิงเพิ่มตัวเลือกการจับคู่ ไม่ใช่สั่งให้ซื้อ
  const haveHues=ward.map(x=>hexToHsl(x.color).h);
  t('AC4 สีที่แนะนำไม่ซ้ำสีที่มีอยู่แล้วในตู้',
    a.suggestions.every(s=>!ward.some(w=>normHex(w.color)===normHex(s.hex))),
    JSON.stringify(a.suggestions.map(s=>s.hex)));
  t('AC4 สีที่แนะนำมีชื่อไทยกำกับ (ไม่สื่อด้วยสีอย่างเดียว)',
    a.suggestions.length>0 && a.suggestions.every(s=>typeof s.name==='string' && s.name.length>0));
  t('AC4 ไม่มีคำสั่งให้ซื้อในข้อความ',
    a.suggestions.concat(a.insights.map(x=>({reason:x}))).every(s=>!/ซื้อ|ลูกค้า/.test(s.reason||'')));
}

console.log('\n== 12. FR-5 Color-first (ล็อกสีแล้วจัดชุดรอบสีนั้น) ==');
{
  const g=(id,cat,color)=>({id,name:'ชิ้น'+id,category:cat,shapeId:null,color});
  const LOCK='#2B3A67';
  // โหมดไอเดีย: สีที่ล็อกต้องเป็นองค์ประกอบหลักของทุกชุด (AC1)
  const idea=generateIdeaBatch('unspecified',{},LOCK);
  t('AC1 idea: ทุกชุดมีสีที่ล็อกอยู่จริง',
    idea.outfits.length>0 && idea.outfits.every(o=>CATEGORY_ORDER.some(c=>o.items[c]&&normHex(o.items[c].color)===LOCK)),
    'ได้ '+idea.outfits.length+' ชุด');
  t('AC1 idea: สีที่ล็อกอยู่บนชิ้นหลัก (บนหรือล่าง)',
    idea.outfits.every(o=>(o.items.top&&normHex(o.items.top.color)===LOCK)||(o.items.bottom&&normHex(o.items.bottom.color)===LOCK)));
  t('AC2 idea: ยังมีสัดส่วนสี + คำแนะนำครบทุกชุด',
    idea.outfits.every(o=>o.colorBreakdown.length>0 && o.advice.length>0));

  // โหมดตู้: ต้องมีชิ้นสีนั้นจริงอย่างน้อยหนึ่งชิ้น หมวดไหนก็ได้ (AC1 ฉบับขยายในเฟส 4)
  const ward=[g('1','top',LOCK),g('2','top','#FFFFFF'),g('3','bottom','#C8B79B'),g('4','shoes','#F2F0EB')];
  const wb=generateWardrobeBatch(ward,'unspecified',{},LOCK);
  t('AC1 wardrobe: ทุกชุดมีชิ้นสีที่ล็อก (หมวดไหนก็ได้)',
    wb.outfits && wb.outfits.length>0 &&
    wb.outfits.every(o=>CATEGORY_ORDER.some(c=>o.items[c]&&normHex(o.items[c].color)===LOCK)),
    JSON.stringify(wb.insufficient||wb.noMatch||('ได้ '+(wb.outfits||[]).length+' ชุด')));

  // ตู้ไม่มีชิ้นสีนั้นเลยสักหมวด -> No-match จริง (spec §7C, เกณฑ์ใหม่เฟส 4)
  const noLock=generateWardrobeBatch(
    [g('1','top','#FFFFFF'),g('2','bottom','#C8B79B'),g('3','accessory','#3F6B4F')],'unspecified',{},LOCK);
  t('A4 No-match เกิดจริงเมื่อตู้ไม่มีชิ้นสีที่ล็อกเลย', noLock.noMatch===true, JSON.stringify(Object.keys(noLock)));

  // ไม่ล็อกสี = พฤติกรรมเดิมทุกอย่าง (regression)
  const plain=generateWardrobeBatch(ward,'unspecified',{});
  t('ไม่ล็อกสี: โหมดตู้ยังทำงานเหมือนเดิม', plain.outfits && plain.outfits.length>=1, JSON.stringify(Object.keys(plain)));
  t('ไม่ล็อกสี: โหมดไอเดียยังทำงานเหมือนเดิม', generateIdeaBatch('unspecified',{}).outfits.length>=BATCH_MIN);
}

console.log('\n== 13. เฟส 4-A: Flexible Outfit Generation (เลิกบังคับบน+ล่าง) ==');
{
  const g=(id,cat,color)=>({id,name:'ชิ้น'+id,category:cat,shapeId:null,color});
  const nItems=o=>Object.keys(o.items).length;

  // แกนหลัก: ตู้ที่ไม่มีทั้งบนและล่างเลย ก็ยังต้องจัดชุดได้
  const odd=generateWardrobeBatch([g('1','outer','#4A5D8A'),g('2','shoes','#F2F0EB')],'unspecified',{});
  t('ตู้ที่มีแค่เสื้อนอก+รองเท้า -> ยังได้ชุดแนะนำ',
    odd.outfits && odd.outfits.length>=1, JSON.stringify(odd.insufficient||odd.noMatch||('ได้ '+(odd.outfits||[]).length+' ชุด')));
  t('ชุดจากตู้แบบนั้นมีครบ 2 ชิ้นจริง', odd.outfits && odd.outfits.every(o=>nItems(o)===2));
  t('ชุดที่ไม่มีบน/ล่างยังมีสัดส่วนสีรวม 100 + คำแนะนำ',
    odd.outfits && odd.outfits.every(o=>o.colorBreakdown.reduce((a,b)=>a+b.pct,0)===100 && o.advice.length>=1));

  // เกณฑ์ขั้นต่ำ: อย่างน้อย 2 ชิ้น จาก 2 หมวดต่างกัน
  const one=generateWardrobeBatch([g('1','top','#FFFFFF')],'unspecified',{});
  t('ตู้มีชิ้นเดียว -> insufficient (ไม่เสกชุดขึ้นมา)', !!one.insufficient, JSON.stringify(Object.keys(one)));
  const sameCat=generateWardrobeBatch([g('1','top','#FFFFFF'),g('2','top','#2B3A67'),g('3','top','#C0392B')],'unspecified',{});
  t('ตู้มีหลายชิ้นแต่หมวดเดียว -> insufficient (ชุดต้องมี 2 หมวดต่างกัน)',
    !!sameCat.insufficient, JSON.stringify(Object.keys(sameCat)));
  t('ตู้ว่าง -> insufficient', !!generateWardrobeBatch([],'unspecified',{}).insufficient);

  // ทุกชุดยังมีได้ไม่เกิน 1 ชิ้นต่อหมวด (data model ไม่เปลี่ยน)
  const mixed=[g('1','top','#FFFFFF'),g('2','bottom','#C8B79B'),g('3','outer','#4A5D8A'),
               g('4','shoes','#F2F0EB'),g('5','accessory','#3F6B4F')];
  const mb=generateWardrobeBatch(mixed,'unspecified',{});
  t('1 ชิ้นต่อ 1 หมวดเสมอ (ไม่แตะ data model)',
    mb.outfits.every(o=>Object.keys(o.items).every(c=>!Array.isArray(o.items[c]))));
  t('ตู้ครบหมวด -> ยังได้แบตช์ 3-4 ชุดเหมือนเดิม', mb.outfits.length>=3&&mb.outfits.length<=4, mb.outfits.length);
  t('ตู้ครบหมวด -> ส่วนใหญ่ยังได้บน+ล่างเป็นแกน (ไม่ใช่สุ่มทิ้งหมวดหลัก)',
    mb.outfits.filter(o=>o.items.top&&o.items.bottom).length >= Math.ceil(mb.outfits.length/2),
    mb.outfits.filter(o=>o.items.top&&o.items.bottom).length+'/'+mb.outfits.length);

  // ล็อกสีบนหมวดที่ไม่ใช่บน/ล่าง ต้องใช้ได้แล้ว (เคยเป็น No-match)
  const LOCK='#3F6B4F';
  const accLock=generateWardrobeBatch(
    [g('1','top','#FFFFFF'),g('2','bottom','#C8B79B'),g('3','accessory',LOCK)],'unspecified',{},LOCK);
  t('ล็อกสีที่มีแค่ในแอกเซสซอรี -> ได้ชุดที่มีสีนั้น (เดิมเป็น No-match)',
    accLock.outfits && accLock.outfits.length>=1 &&
    accLock.outfits.every(o=>CATEGORY_ORDER.some(c=>o.items[c]&&normHex(o.items[c].color)===LOCK)),
    JSON.stringify(accLock.noMatch?'noMatch':('ได้ '+(accLock.outfits||[]).length+' ชุด')));
}

console.log('\n== 14. เฟส 4-D: จัดกลุ่มสีตามโทน ==');
{
  const G = toneGroups(PRESET_COLORS);
  t('กลุ่มที่คืนมามีเฉดจริงทุกกลุ่ม (ไม่มีกลุ่มว่าง)', G.length>0 && G.every(x=>x.shades.length>0));
  t('ทุกเฉดใน PRESET_COLORS ถูกจัดเข้ากลุ่มครบ ไม่มีสีตกหล่น',
    G.reduce((n,x)=>n+x.shades.length,0) === new Set(PRESET_COLORS.map(normHex)).size);
  t('ลำดับกลุ่มคงที่ เรียกซ้ำได้ผลเดิม',
    JSON.stringify(toneGroups(PRESET_COLORS)) === JSON.stringify(toneGroups(PRESET_COLORS.slice().reverse())));
  t('สีซ้ำถูกยุบเหลือเฉดเดียว',
    toneGroups(['#FFFFFF','#ffffff','#FFF']).reduce((n,x)=>n+x.shades.length,0) === 1);
  /* ชื่อกลุ่มต้องมาจากคลังคำเดิม ไม่ใช่ taxonomy ใหม่: ทุกกลุ่มต้องอยู่ใน TONE_ORDER */
  t('ชื่อกลุ่มทุกชื่อมาจากลำดับที่ประกาศไว้ ไม่มีคำแปลกโผล่',
    G.every(x=>TONE_ORDER.indexOf(x.group)>=0), G.map(x=>x.group).join(','));
  /* สองทางเข้าใช้แหล่งข้อมูลต่างกันจริง (spec Decision #4) */
  const owned=['#C0392B','#C0392B','#17161A'];
  const A=toneGroups(owned), B=toneGroups(PRESET_COLORS);
  t('ทางเข้า (a) เห็นเฉพาะสีที่มีจริง ไม่ลากพรีเซ็ตที่ยังไม่มีเข้ามา',
    A.reduce((n,x)=>n+x.shades.length,0) === 2 && B.length > A.length);
  t('ตู้ว่าง -> ไม่มีกลุ่มให้โชว์ (หน้าจอต้องขึ้นข้อความแทน ไม่ใช่กริดว่าง)', toneGroups([]).length === 0);
  /* กลุ่มแม่ยุบชื่อเฉพาะเข้าด้วยกันจริง ไม่ใช่แค่ตัดคำขยาย */
  t('กรมท่าถูกจัดอยู่กลุ่มน้ำเงิน', toneGroupOf('#2B3A67') === 'น้ำเงิน', toneGroupOf('#2B3A67'));
  t('ครีม/เบจ/น้ำตาล อยู่กลุ่มเดียวกัน',
    toneGroupOf('#EFE6D2') === toneGroupOf('#C8B79B') && toneGroupOf('#C8B79B') === toneGroupOf('#6B4A2F'));
  t('เฉดอ่อน/เข้มของสีเดียวกันอยู่กลุ่มเดียวกัน',
    toneGroupOf(hslToHex(210,60,30)) === toneGroupOf(hslToHex(210,60,70)),
    toneGroupOf(hslToHex(210,60,30))+' / '+toneGroupOf(hslToHex(210,60,70)));
}

console.log(fails? `\n### ${fails} ข้อไม่ผ่าน\n` : '\n### ผ่านทั้งหมด\n');
process.exit(fails?1:0);
