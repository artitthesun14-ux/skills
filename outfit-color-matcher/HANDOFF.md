# Handoff: Outfit Color Matcher

> อัปเดต 2026-09-10 · เฟส 1 เสร็จและทดสอบผ่านแล้ว รอผู้ใช้ตัดสินใจ 2 ข้อก่อนเดินต่อ
> ผู้ใช้สื่อสารเป็นภาษาไทย ตอบไทยเสมอ

## เอกสารและโค้ดอยู่ที่ไหน

repo `artitthesun14-ux/skills` โฟลเดอร์ `outfit-color-matcher/`
ทุก path ในเอกสารนี้อ้างจากโฟลเดอร์นั้น

ถ้าเซสชันใหม่ยังไม่มี repo ให้ดึงเข้ามาก่อน (ใน Claude Code ใช้ `add_repo` แล้ว clone)
แล้ว checkout บรานช์ที่มีของล่าสุด ถ้ายังไม่ได้ merge เข้า main

## อ่านอะไรก่อน

1. `PROJECT_STATE.md` ตัวชี้ทางที่รวมทุกการตัดสินใจที่ห้ามหลุด ข้อค้าง และลำดับเฟส
2. `docs/spec-outfit-color-matcher.md` สเปกหลัก (engine 4.1-4.7, FR-0..FR-6 + AC, §7C states)
3. `README.md` วิธี build และรันเทสต์

รายชื่อเอกสารทั้งหมดอยู่ใน `PROJECT_STATE.md` §2

## สถานะปัจจุบัน

**เฟส 2 เสร็จ (Swap + Favorites, V6) ทดสอบผ่าน 238 ข้อในเทสต์ 7 ชุด**
artifact: `https://claude.ai/code/artifact/ee952a4d-7525-4446-a827-548546fe68b0`

- publish ทับลิงก์เดิมเสมอ (localStorage ของผู้ใช้ไม่หาย) และต้อง `action:"read"` ก่อน publish ทุกครั้ง
- artifact นี้ไม่ได้สร้างในเซสชันแรกของโปรเจกต์ เคยแจ้งผู้ใช้ไว้แล้ว
- แหล่งความจริงของโค้ดคือ `app.html` แก้แล้วรัน `./build.sh` ทุกครั้ง อย่าแก้ `outfit-color-matcher.html` ตรงๆ
- watch subscription ของ artifact ลงทะเบียนไม่สำเร็จ (`mint_failed`) จึงไม่มีการปลุกเมื่อมีคนแก้จากที่อื่น ห้ามอ้างว่ากำลังเฝ้าอยู่

## รอผู้ใช้ตัดสินใจ

1. **เริ่มเฟส 3 เมื่อไหร่** FR-4 วิเคราะห์ตู้ + FR-5 เลือกสีก่อน + FR-6 Outfit Generator
2. **เปิด PR ใหม่ไหม** บรานช์ `claude/ready-to-use-qhe3ak` push ต่อเนื่อง ยังไม่ได้เปิด PR ของงานหลัง merge #2

## กฎการทำงานที่ผู้ใช้ยึด (เขาแก้มาแล้วทั้ง 3 ข้อ ระวังให้มาก)

- **ห้ามพูดเกินจริง** ห้ามใช้คำว่า "การันตีว่ากลมกลืนเสมอ" ให้ใช้ "เพิ่มโอกาสให้ชุดที่สุ่มออกมากลมกลืน
  ภายใต้กฎที่กำหนด" เพราะมุม hue ไม่ได้แปลว่าเสื้อผ้าสองสีจะดูดีเสมอ ขึ้นกับ saturation, lightness และบริบท
- **ห้ามใช้คำว่า "ลูกค้า"** target คือใครก็ได้ที่ใช้แต่งตัวให้ตัวเอง ใช้บุรุษที่ 1 "ของฉัน"
  ชื่อโหมดคือ `สีที่เราแนะนำ` กับ `จากตู้ของฉัน`
- **no silent state change** ทุกอย่างที่ระบบเปลี่ยนเองต้องมีข้อความกำกับ (ux §7B)
- ยึด `docs/working-guidelines.md`: คิดก่อนเขียน, เรียบง่ายก่อน, แก้แบบ surgical, ทำตามเป้าหมาย
- **ห้ามใส่ em-dash ในงานเขียนทั้งหมดของ repo นี้** รวมถึงคอมเมนต์ในโค้ด (กฎใน `CLAUDE.md` ที่ root)

## กับดักที่เจอมาแล้ว อย่าเสียเวลาซ้ำ

- **CSS class ไม่ทะลุ shadow tree ของ `<use>`** ทรง SVG ต้องมี `style="fill:var(--garment-fill)"`
  เขียน inline อยู่ใน `<symbol>` ส่วน custom property ตั้งที่ `<svg>` ชั้นนอก (มันสืบทอดเข้าไปได้)
- **migration ห้ามเขียนทับ `shapeId` ที่มีอยู่แล้ว** เติมได้เฉพาะกรณีไม่มีฟิลด์
  ไม่งั้น fallback กับป้าย "ทรงเริ่มต้น" กลายเป็นโค้ดตาย และทรงที่ผู้ใช้เลือกหายถาวร
- **`closeForm()` ล้าง `state.editingId`** ถ้าอ่านค่านั้นหลังปิดฟอร์มจะได้ค่าผิด
  (เคยทำให้ข้อความบอกว่า "เพิ่มเข้าตู้" ทั้งที่ผู้ใช้กดแก้ไข)
- **โหมดแก้ชื่อ favorite (`favEditId`) ต้องมีทางออกโดยไม่บันทึกเสมอ** (คลิกนอกฟอร์ม + Escape)
  ไม่งั้นผู้ใช้ติดอยู่ในฟอร์มจนกว่าจะ submit
- **Escape handler ต้อง branch ตาม prefix `fav-` เหมือน click-outside handler** ถ้า `state.openMenuId`
  เป็นเมนูของ favorite ต้องเรียก `renderFavorites()` ไม่ใช่ `renderWardrobe()` (คนละเซกชัน คนละ DOM)
- **การ์ดข้างถูก `scale(.92)`** เวลาวัดความสูงต้องใช้ `offsetHeight` ไม่ใช่ `getBoundingClientRect()`
- **`getComputedStyle(el, ":focus-visible")` ใช้ไม่ได้** (รับเฉพาะ pseudo-element) ต้องกด Tab จริงแล้วอ่าน outline
- **`.pbar__seg` ต้องไม่เป็น control ที่โฟกัสได้** เพราะอยู่ใน `role="img"` มีเทสต์ล็อกไว้แล้ว
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

## ถ้าผู้ใช้สั่งให้เริ่มเฟส 3 (FR-4/5/6)

1. อ่าน FR-4/5/6 พร้อม AC ในสเปก; FR-4 มีกราฟ = โหลด skill `dataviz` ก่อนเขียนโค้ดกราฟ
2. เฟส 2 ทำเสร็จแล้วเป็นตัวอย่างแพทเทิร์น: Swap ใน `swapItem()` (ring บน `o._swap`), Favorites
   ใน `toggleFav/favFromLook/renderFavorites` (snapshot ใน `state.favorites`), เซกชันใหม่แบบ `#sec-favorites`
3. FR-4 วิเคราะห์ตู้: สัดส่วนสีจาก garment จริง + กลุ่ม Neutral/Cool/Warm/Accent + insight template; ข้อมูลน้อย = บอกตรงๆ
4. เพิ่มเคสลง `tests/ac-test.js` รันครบ 7 ชุดให้เขียว แล้ว `./build.sh` + publish ทับลิงก์เดิม
5. อัปเดต `PROJECT_STATE.md` §4 §6 ให้ตรงกับของจริง
