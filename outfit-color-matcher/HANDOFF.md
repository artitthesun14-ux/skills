# Handoff: Outfit Color Matcher

> อัปเดต 2026-09-12 · เฟส 3 ปิดครบทั้ง FR-4/FR-5/FR-6 แล้ว publish เป็น V12 · ผู้ใช้สื่อสารเป็นภาษาไทย ตอบไทยเสมอ
> **ไม่มีเฟสค้าง** งานต่อไปรอผู้ใช้สั่งใหม่ (feature ใหม่/backlog ตาม spec §11)

## เอกสารและโค้ดอยู่ที่ไหน

repo `artitthesun14-ux/skills` โฟลเดอร์ `outfit-color-matcher/` บรานช์ `claude/ready-to-use-qhe3ak`
ทุก path ในเอกสารนี้อ้างจากโฟลเดอร์นั้น

ถ้าเซสชันใหม่ยังไม่มี repo ให้ดึงเข้ามาก่อน (ใน Claude Code ใช้ `add_repo` แล้ว clone)
แล้ว checkout บรานช์ที่มีของล่าสุด ถ้ายังไม่ได้ merge เข้า main

## อ่านอะไรก่อน

1. `PROJECT_STATE.md` ตัวชี้ทางที่รวมทุกการตัดสินใจที่ห้ามหลุด ข้อค้าง และลำดับเฟส
2. `docs/spec-outfit-color-matcher.md` สเปกหลัก (engine 4.1-4.7, FR-0..FR-6 + AC, §7C states)
3. `README.md` วิธี build และรันเทสต์

รายชื่อเอกสารทั้งหมดอยู่ใน `PROJECT_STATE.md` §2

## สถานะปัจจุบัน

**เฟส 1-3 จบครบทุกข้อ (FR-0..FR-6) ทดสอบผ่าน 284 ข้อในเทสต์ 7 ชุด publish เป็น Version 12 แล้ว**
artifact: `https://claude.ai/code/artifact/ee952a4d-7525-4446-a827-548546fe68b0`

### งานล่าสุด: เฟส 3 (V11-V12)

- **FR-4 วิเคราะห์ตู้ (V11):** `analyzeWardrobe()` + เซกชัน `#sec-analysis` + แท็บ "วิเคราะห์"
- **FR-5 Color-first (V12):** ล็อกสีจากแถว "วันนี้อยากใส่สีอะไร?" ทำให้สถานะ A4 No-match เกิดจริงได้เป็นครั้งแรก
  (ก่อนหน้านี้ไปไม่ถึงเพราะมีบน+ล่างก็ได้ชุดเสมอ) ปุ่ม "เอาสีที่ล็อกออก" คือ "ผ่อนเงื่อนไข" ตัวจริงที่สเปกพูดถึง
- **FR-6 Generator: ปิดโดยไม่มีโค้ดใหม่** ผู้ใช้ตัดสินใจ (2026-09-12) ว่าสองส่วนจริง (Color filter + สวิตช์
  wardrobe/idea) มีอยู่แล้ว ส่วน "Style" ไม่เคย define ในสเปกเลยตัดออกจากขอบเขต (ดู spec §5 FR-6)
- ระหว่างทำเจอบั๊กจริง 1 จุด (แก้แล้ว): `.preset` ไม่มี `flex:0 0 auto` ถูกบีบเหลือ 13x44px ในแถวเลื่อนแนวนอน
- แก้ ac-test ที่ flaky มานาน (ไม่ใช่บั๊กแอป): click แล้ว `waitForTimeout` สั้นๆ ก่อน `reload` ถ้า `persist()`
  เขียน localStorage ไม่ทัน ค่าจะหาย เพิ่ม helper `waitPersisted()` รอค่าจริงก่อน reload

- publish ทับลิงก์เดิมเสมอ (localStorage ของผู้ใช้ไม่หาย) และต้อง `action:"read"` ก่อน publish ทุกครั้ง
  (อ่านให้ครบทุกบรรทัดของไฟล์ที่ระบบเก็บไว้ ไม่ใช่แค่ head ที่โชว์มา ไม่งั้น publish จะถูกปฏิเสธ ถ้าถูกปฏิเสธซ้ำว่า
  "identical content already refused" ให้ `Artifact action:"read"` ใหม่อีกครั้งก่อน publish ซ้ำ)
- แหล่งความจริงของโค้ดคือ `app.html` แก้แล้วรัน `./build.sh` ทุกครั้ง อย่าแก้ `outfit-color-matcher.html` ตรงๆ
- watch subscription ของ artifact ลงทะเบียนไม่สำเร็จ (`mint_failed`) จึงไม่มีการปลุกเมื่อมีคนแก้จากที่อื่น ห้ามอ้างว่ากำลังเฝ้าอยู่

### งานล่าสุด: กติกาสีโหมดไอเดีย (V8 -> V9 หลัง /code-review)

`research/film-and-fashion-color-palette-principles.md` สรุปว่าทำไมพาเลตสุ่มของโหมดไอเดียไม่ดูเหมือนชุดจริง
(อิง Itten/Albers/Munsell) แปลงเป็น 3 กติกาใน spec §4.1/4.7/9 แล้ว implement ใน `generateIdeaBatch()`/`ideaColor()`
(`app.html`): Accent มีทุกลุคเสมอ (เลิกสุ่มเหรียญ), Secondary derive S/L จาก Primary ทิศทางเดียว (ไม่สุ่มอิสระ),
`neutral-accent` บังคับให้ secondary ตกเป็น neutral จริง เทสต์ใหม่ใน `tests/engine-test.js` §10 (Pearson
correlation ยืนยัน S ของ Secondary สัมพันธ์กับ Primary) และแก้ `tests/ac-test.js` B4c/B4d ที่เคยเช็ค accent
แบบเก่า (ดู `PROJECT_STATE.md` §4 delta `-5` สำหรับรายละเอียดโค้ด)

**`/code-review` (fixed point `94cf16e`) เจอบั๊กจริง 1 ข้อ แก้แล้วเป็น V9:** floor S ของ Secondary
(branch monochrome/default ใน `generateIdeaBatch()`) เคยต่ำกว่า `NEUTRAL_MAX_S=20` ทำให้ Secondary
หลุดไปเป็น role "neutral" เองโดยไม่ตั้งใจ ~64% ของทุกลุคที่ rule ไม่ใช่ neutral-accent (พิสูจน์ด้วยการรัน
generator 12,000 ครั้งเทียบก่อน/หลัง) แก้โดยยก floor S เป็น 26 และหด L clamp เป็น [26,74] เพิ่ม regression
test ใน `engine-test.js` ล็อกไว้

### `/to-tickets` + `/implement` (V10): ปิด 4 open item ที่เหลือ

แตกเป็น 4 ตั๋วที่ `.scratch/outfit-color-matcher/issues/` แล้ว implement ตามลำดับ (ยึด working-guidelines):
1. **โหมดไอเดียโชว์ rule ครบ 5 แบบ (โค้ด):** เดิมโชว์แต่ triadic/neutral-accent เพราะ (1) `detectHarmony()` ตีความ
   rule ใหม่จากสีที่รวม Accent (2) คัดเลือก top-4-by-score ทิ้ง rule คะแนนต่ำ แก้ 2 จุด: `buildOutfit(items,mode,
   occasion,forcedRule)` รับ rule ที่โหมดไอเดียเลือกไว้เป็นป้ายตรงๆ (ไม่แตะ `detectHarmony` โหมดตู้ไม่กระทบ) +
   การคัดเลือกใน `generateIdeaBatch` เปลี่ยนเป็น "rule ละหนึ่งก่อน แล้วค่อยเติม" ผลวัดจริง ~17-25%/แบบ 4 rule/แบตช์
2. **threshold (docs):** วัดจริง 3,200 ลุค ยืนยันว่า `NEUTRAL_MAX_S=20`/`VIVID_MIN_S=55` ตกในช่องว่างระหว่างกลุ่ม
   role คงค่าไว้ บันทึกตัวเลขใน spec §9
3. **dog-ear (docs):** ตัดทิ้ง ลบจาก ui/spec docs (ไม่เคยมีในโค้ด)
4. **No-match "ผ่อนเงื่อนไข" (docs):** ตัวแนะนำไม่มี hard constraint ให้ผ่อน A4 เป็น fallback ที่ทางออกจริงคือสลับโหมด
   ไอเดีย แก้ ui/ux docs ให้ตรง

**ข้อควรระวังถ้าจะแตะ `generateIdeaBatch` ต่อ:** ป้าย ruleUsed ในโหมดไอเดียมาจาก `forcedRule` (rule ที่สุ่มเลือก
สร้างสี) ไม่ใช่จาก `detectHarmony` แล้ว ดังนั้นถ้าเพิ่ม/แก้ rule ต้องแก้ทั้ง `IDEA_RULES`, สูตรสร้างสีของ rule นั้น,
และ `RULE_TH`/`buildAdvice` ให้ครบ ส่วนโหมดตู้ยังใช้ `detectHarmony` เดิม (ไม่ส่ง forcedRule) ตามเดิม

### `/code-review origin/main` (fixed point ก่อนหน้า `a56ffaa`) เจอ 4 ข้อ ตอนนี้แก้ครบแล้ว (fixed point ใหม่ = HEAD ปัจจุบันของบรานช์นี้)

1. **[แก้แล้ว] `app.html` เคยมี doctype/html/head/body wrapper ฝังอยู่ที่บรรทัดแรก** ทั้งที่สัญญาไว้ว่า
   app.html ต้องไม่มี 3 แท็กนี้ (README/PROJECT_STATE ยืนยันตรงกัน) ทำให้ `outfit-color-matcher.html`
   ที่ build และ **artifact ที่ publish ไว้ทุกเวอร์ชัน (V4-V6) ซ้อนกัน 2 ชั้น** เพราะ build.sh และ Artifact
   tool ต่างก็ห่อ skeleton ของตัวเองทับอีกที ลบบรรทัดที่ฝังอยู่ออกแล้ว, build/เทสต์/publish ใหม่เป็น V7
2. **[แก้แล้ว ด้วยการแก้สเปก ไม่ใช่แก้โค้ด]** FR-3 เคยเขียนว่าเมนู ⋯ ของ favorite ต้องมี "เปิดแก้ไข"
   แต่ของจริงมีแค่ แก้ชื่อ/ทำสำเนา/ลบ (`favFromLook()` เก็บ snapshot ล้วน ไม่มี garment id อ้างอิงกลับ)
   ผู้ใช้เลือกให้แก้สเปกให้ตรงของจริง: ตัด "เปิดแก้ไข" ออกจาก FR-3 และตัดประโยค "ถ้ากดแก้จะเตือนว่า
   ชิ้นเดิมถูกลบแล้ว" ออกจาก spec §7C (state Deleted Garment ยังอยู่ เพราะ snapshot behavior จริง
   ยังทำงานอยู่ แค่ไม่มี "เปิดแก้ไข" ให้เตือน) **ไม่ได้แก้โค้ดใดๆ ในข้อนี้**
3. **[แก้แล้ว]** `docs/spec-outfit-color-matcher.md` §9 และ `docs/ui-outfit-color-matcher.md` §3.7/§8
   เคยบอกว่ามี "~17 ทรง" ทั้งที่ของจริงมี 21 ตรงกับ `PROJECT_STATE.md` และ `SHAPES` array ใน app.html
   แก้ทั้ง 3 จุดเป็น "21 ทรง" แล้ว
4. **[แก้แล้ว]** `docs/ux-outfit-color-matcher.md` §7 เคยเขียนว่า Swap คือ "แตะช่องหมวดในการ์ด"
   ทั้งที่ของจริงเป็นปุ่มแยก `.tile__swap` (ตรงกับที่ `docs/ui-outfit-color-matcher.md` บันทึกไว้ถูกต้อง
   อยู่แล้วในรายการ SwapButton และ `PROJECT_STATE.md` §4) แก้บรรทัดนั้นให้บอกว่า Swap = กดปุ่ม 🔄 แล้ว

**ข้อควรระวังจากข้อ 1:** เวลาอ่าน artifact ที่เคย publish ไว้เพื่อเช็ค drift ก่อนแก้โค้ด ให้เทียบ
บรรทัดแรกของ artifact กับบรรทัดแรกของ `app.html` ในเครื่องเสมอ ถ้า artifact มี `<!doctype html><html>...`
ขึ้นต้นแปลว่ามี wrapper แฝงอยู่ ให้สงสัยว่า sync ครั้งก่อนอาจคัดลอกมาจากไฟล์ cache ที่ผ่านการอ่าน
artifact (ซึ่งมี skeleton ห่ออยู่) แทนไฟล์ต้นฉบับที่ไม่มี wrapper

## รอผู้ใช้ตัดสินใจ

1. **เปิด PR ใหม่ไหม** บรานช์ `claude/ready-to-use-qhe3ak` push ต่อเนื่อง ยังไม่ได้เปิด PR ของงานหลัง merge #2
2. **feature ใหม่หลังเฟส 3** เฟส 1-3 จบครบแล้ว (FR-0..FR-6) ยังไม่มีลำดับงานถัดไปที่ตกลงไว้ ดู spec §11 backlog เป็นไอเดีย

## กฎการทำงานที่ผู้ใช้ยึด (เขาแก้มาแล้วหลายรอบ ระวังให้มาก)

- **ห้ามพูดเกินจริง** ห้ามใช้คำว่า "การันตีว่ากลมกลืนเสมอ" ให้ใช้ "เพิ่มโอกาสให้ชุดที่สุ่มออกมากลมกลืน
  ภายใต้กฎที่กำหนด" เพราะมุม hue ไม่ได้แปลว่าเสื้อผ้าสองสีจะดูดีเสมอ ขึ้นกับ saturation, lightness และบริบท
- **ห้ามใช้คำว่า "ลูกค้า"** target คือใครก็ได้ที่ใช้แต่งตัวให้ตัวเอง ใช้บุรุษที่ 1 "ของฉัน"
  ชื่อโหมดคือ `สีที่เราแนะนำ` กับ `จากตู้ของฉัน`
- **no silent state change** ทุกอย่างที่ระบบเปลี่ยนเองต้องมีข้อความกำกับ (ux §7B)
- ยึด `docs/working-guidelines.md`: คิดก่อนเขียน, เรียบง่ายก่อน, แก้แบบ surgical, ทำตามเป้าหมาย
- **ห้ามใส่ em-dash ในงานเขียนทั้งหมดของ repo นี้** รวมถึงคอมเมนต์ในโค้ด (กฎใน `CLAUDE.md` ที่ root)
- **ก่อนแก้อะไรที่กระทบ publish ต้อง `Artifact action:"read"` เช็ค drift ก่อนเสมอ**

## กับดักที่เจอมาแล้ว อย่าเสียเวลาซ้ำ

- **CSS class ไม่ทะลุ shadow tree ของ `<use>`** ทรง SVG ต้องมี `style="fill:var(--garment-fill)"`
  เขียน inline อยู่ใน `<symbol>` ส่วน custom property ตั้งที่ `<svg>` ชั้นนอก (มันสืบทอดเข้าไปได้)
- **migration ห้ามเขียนทับ `shapeId` ที่มีอยู่แล้ว** เติมได้เฉพาะกรณีไม่มีฟิลด์
  ไม่งั้น fallback กับป้าย "ทรงเริ่มต้น" กลายเป็นโค้ดตาย และทรงที่ผู้ใช้เลือกหายถาวร
- **`closeForm()` ล้าง `state.editingId`** ถ้าอ่านค่านั้นหลังปิดฟอร์มจะได้ค่าผิด
  (เคยทำให้ข้อความบอกว่า "เพิ่มเข้าตู้" ทั้งที่ผู้ใช้กดแก้ไข)
- **โหมดแก้ชื่อ favorite (`favEditId`) และเมนู ⋯ ต้องมีทางออกโดยไม่บันทึกเสมอ** (คลิกนอกฟอร์ม + Escape)
  ไม่งั้นผู้ใช้ติดอยู่ในฟอร์มจนกว่าจะ submit
- **Escape handler ต้อง branch ตาม prefix `fav-` เหมือน click-outside handler** ถ้า `state.openMenuId`
  เป็นเมนูของ favorite ต้องเรียก `renderFavorites()` ไม่ใช่ `renderWardrobe()` (คนละเซกชัน คนละ DOM)
- **การ์ดข้างถูก `scale(.92)`** เวลาวัดความสูงต้องใช้ `offsetHeight` ไม่ใช่ `getBoundingClientRect()`
- **`getComputedStyle(el, ":focus-visible")` ใช้ไม่ได้** (รับเฉพาะ pseudo-element) ต้องกด Tab จริงแล้วอ่าน outline
- **`.pbar__seg` ต้องไม่เป็น control ที่โฟกัสได้** เพราะอยู่ใน `role="img"` มีเทสต์ล็อกไว้แล้ว
- **`app.html` ต้องไม่มี doctype/html/head/body ของตัวเอง** (รูปแบบ artifact ล้วน เริ่มที่ `<title>`)
  `build.sh` เป็นตัวเดียวที่ห่อ 3 แท็กนี้ ถ้าฝ่าฝืนจะซ้อนกัน 2 ชั้นทั้งในไฟล์ build และใน artifact ที่ publish
  (ดูรายละเอียดในหัวข้อ "สถานะปัจจุบัน" ข้อ 1 ด้านบน)
- artifact CSP: ไม่มี external fetch, รูป, หรือสคริปต์ ทุกอย่าง inline
- เซสชันนี้ไม่มี `gh` CLI ใช้ GitHub MCP tools (`mcp__github__*`) แทน

## Suggested skills (เรียกผ่าน Skill tool)

| เมื่อไหร่ | Skill |
|---|---|
| ก่อนแตะโค้ด artifact ทุกครั้ง | `artifact-design` |
| หลังสร้างฟีเจอร์เฟส 2/3 เสร็จ ก่อนส่งรีวิว | `test` (ต่อยอดที่ `tests/ac-test.js` อย่าเขียนชุดใหม่) |
| ถ้าผู้ใช้ขอปรับ flow หรือสถานะใหม่ | `ux-design` แล้วค่อย `ui-design` |
| ถ้าทำ FR-4 วิเคราะห์ตู้ (มีกราฟ) | `dataviz` ก่อนเขียนโค้ดกราฟบรรทัดแรก |
| ถ้าผู้ใช้อยากถูกซักก่อนตัดสินใจ | `grilling` (เคยใช้แล้วรอบหนึ่ง เขาชอบ) |
| ถ้าเจอบั๊กยาก | `diagnosing-bugs` |
| ถ้าจะตรวจซ้ำอีกรอบ | `code-review` (fixed point ใหม่ = HEAD ปัจจุบันของบรานช์นี้) |

## เฟส 1-3 จบครบแล้ว (FR-0..FR-6) แพทเทิร์นสำหรับ feature ถัดไป

ถ้าผู้ใช้สั่ง feature ใหม่ (นอกเหนือจากที่ตกลงไว้เดิม) ให้ทำตามแพทเทิร์นเดียวกับที่ผ่านมา:
1. เขียนเทสต์ก่อน (`tests/engine-test.js` สำหรับ logic ล้วน, `tests/ac-test.js` สำหรับพฤติกรรมในเบราว์เซอร์)
2. ดูตัวอย่างแพทเทิร์นที่มีอยู่แล้ว: Swap ใน `swapItem()` (ring บน `o._swap`), Favorites ใน
   `toggleFav/favFromLook/renderFavorites` (snapshot ใน `state.favorites`), วิเคราะห์ตู้ใน `analyzeWardrobe()`
   (อ่านอย่างเดียว ไม่ยุ่งกับ engine จัดชุด), ล็อกสีใน `state.lockedColor` (ส่งเข้า generator ทั้งสอง)
3. ถ้ามีกราฟ = โหลด skill `dataviz` ก่อนเขียนโค้ดกราฟ (FR-4 วิเคราะห์ตู้ไม่ต้องใช้ เพราะใช้แค่แถบ CSS ธรรมดา)
4. รันครบ 7 ชุดให้เขียว แล้ว `./build.sh` + publish ทับลิงก์เดิม
5. อัปเดต `PROJECT_STATE.md` §4 §6 ให้ตรงกับของจริง
