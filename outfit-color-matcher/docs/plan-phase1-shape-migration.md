# แผนแก้เฟส 1: เปลี่ยนจากระบบรูปถ่าย เป็นระบบทรงเสื้อผ้า SVG

> สถานะ: **ลงมือแล้ว publish เป็น Version 2 ของ artifact เดิม**
> เป้าหมาย: อัปเดตทับ artifact เดิม `ee952a4d` (ลิงก์เดิม ข้อมูลผู้ใช้ไม่หาย)

## Context

artifact `ee952a4d` (Outfit Color Matcher) มีเฟส 1 ที่ทำงานได้ครบแล้ว **1,691 บรรทัด** และตรงตาม spec/UX/UI แทบทุกข้อ **แต่ถูกสร้างก่อนที่จะตัดสินใจเรื่องทรงเสื้อผ้า** จึงยังใช้การอัปโหลดรูป + ดึงสีจากรูป ซึ่งขัดกับเอกสารปัจจุบัน (UI §3.7, spec FR-0, ux §4)

**ข้อสังเกตจากการอ่านโค้ดทั้งไฟล์:** คุณภาพดี และมีรายละเอียดที่ดีกว่าที่เอกสารเขียนไว้หลายจุด
- แยก `--accent` / `--accent-solid` เพื่อให้ตัวอักษรผ่านคอนทราสต์ 4.5:1 (เอกสารมีโทเคนเดียว)
- `computeProportion` ใช้ largest-remainder ให้ % รวมได้ 100 พอดี
- คะแนนความกลมกลืนเก็บใน `WeakMap` **นอก** object ที่ render กันหลุดเข้า DOM โดยอุบัติเหตุ
- `updateCarousel` อัปเดตในที่ ไม่ re-render เพื่อไม่ให้โฟกัสคีย์บอร์ดหลุด
- ถ่วง HSL saturation ด้วย `rgbSpread` เพราะครีม `#EFE6D2` ได้ S=47% ทั้งที่ตาอ่านเป็นสีกลาง

## สิ่งที่ไม่แตะ (ถูกต้องแล้ว)
- **Engine ทั้งหมด** (บรรทัด 524-1017): harmony detection, Color Role, สัดส่วน 60-30-10, คะแนนเงียบ, advice template, idea/wardrobe batch
- Tokens + responsive + reduced-motion (3-441)
- Carousel (`updateCarousel`/`goTo`), การนำทาง, ธีม, dialog, banners, aria-live
- Storage layer (`loadStore`/`saveStore`)

---

## 1. ลบระบบรูป

| ส่วน | บรรทัด |
|---|---|
| CSS `.drop`, `.drop.is-over`, `.drop img`, `.drop__over` | 344-352 |
| CSS `.drop{max-width:200px}` ใน breakpoint md | 423 |
| CSS `.tile__box img` | 229 |
| CSS `.gchip__box img` | 294 |
| JS `MAX_IMG` + `processImage()` | 1396-1425 |
| JS listener `change` ของ `#fFile` | 1600-1618 |
| JS drag & drop 3 ตัว (dragover/dragleave/drop) | 1643-1660 |
| JS สาขา `data-photo` ใน click delegation | 1565-1569 |
| `[data-photo]` ใน selector รวม | 1518 |

- ตัด `photo` / `autoFilled` ออกจาก `formDraft`, `openForm`, `saveGarment` และลบ `<input type="file" id="fFile">`
- `saveGarment` ตัดตรรกะ quota "เซฟชิ้นนั้นแบบไม่มีรูป" (1484-1492) เหลือแค่เตือนว่าบันทึกไม่สำเร็จ
- แก้ข้อความ banner quota (1380) ให้เลิกพูดถึงรูป

## 2. เพิ่มระบบทรง (ตาม UI §3.7)

- **`SHAPES` registry**: `{ id, name, category, deprecated? }` + `<svg hidden>` รวม `<symbol id="sh-*" viewBox="0 0 120 120">` ทุกทรง แล้วอ้างซ้ำด้วย `<use>`
  (ตาม UI §7 real-data test: ตู้ 60 ชิ้นต้องไม่ทำซ้ำ path 60 รอบ)
- **21 ทรง** (ตัวเลขสรุปเดิมเขียนว่า 18 พิมพ์ผิด ตารางข้างล่างบวกกันได้ 21 มาตลอด):

| หมวด | ทรง |
|---|---|
| top (7) | tee-crew · tee-v · polo · shirt-long · shirt-short · hoodie · tank |
| bottom (6) | jeans-straight · chino · wide · jogger · shorts · **skirt** |
| outer (3) | jacket · blazer · cardigan |
| shoes (2) | sneaker · boot |
| accessory (3) | cap · bag · **belt** |

- **`DEFAULT_SHAPE`** = `{top:"tee-crew", bottom:"jeans-straight", outer:"jacket", shoes:"sneaker", accessory:"cap"}`
- **`garmentLine(hex)`**: ใช้ `relLum()` **ที่มีอยู่แล้วในไฟล์ (บรรทัด 610)** ไม่ต้องเขียนใหม่
  `L >= 0.55 ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.62)"`: threshold ค่าเดียว ไม่มี hysteresis
- **`shapeSVG(shapeId, hex, category, opts)`** คืน `<svg role="img" aria-label="{ชื่อทรง} สี {ชื่อสี} {HEX}">` ตั้ง `--garment-fill` / `--garment-line` แบบ inline
- CSS ใหม่:
  - `.shape-fill{fill:var(--garment-fill)}`
  - `.shape-line{fill:none;stroke:var(--garment-line);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}`
  - variant `outline` (เส้นประ ไม่มี fill) สำหรับ tile ว่าง
- **`resolveShape(g)`**: ถ้า `shapeId` ไม่มีใน registry → คืนทรงเริ่มต้นของหมวด + ธง `fellBack` เพื่อโชว์หมายเหตุ (spec FR-0 AC5, ux §7B)

## 3. แก้จุดที่เรนเดอร์เสื้อผ้า (4 จุด)

| ฟังก์ชัน | บรรทัด | แก้อะไร |
|---|---|---|
| `tileHTML()` | 1169-1185 | แทน `<img>`/บล็อกสี ด้วย `shapeSVG`; เพิ่ม **ชื่อทรง** ในป้าย |
| `renderWardrobe()` gchip box | 1281-1283 | แทนด้วย `shapeSVG`; เพิ่มชื่อทรงใน `gchip__meta` |
| `generateIdeaBatch()` items | 993-998 | ใส่ `shapeId: DEFAULT_SHAPE[cat]` ให้ทุกชิ้น |
| `seedWardrobe()` | 1047-1060 | ใส่ `shapeId` ครบ 10 ชิ้น (กระโปรงดำ → `skirt`, เข็มขัดหนังแดง → `belt`) |

## 4. ฟอร์ม: ShapePicker + ColorPicker

- ลำดับใหม่: **หมวด → ทรง → สี → ชื่อ (ไม่บังคับ)**
- **`ShapePicker`**: กริดทรงในหมวดที่เลือก, `role="radiogroup"` ลูก `role="radio" aria-checked`
  แต่ละตัวเลือกเป็น `shapeSVG` **ย้อมสีปัจจุบัน** (พรีวิวสด) + ชื่อทรงใต้ภาพ
- **`ColorPicker`**: เพิ่มแถวสวอทช์พรีเซ็ต ~12 สี ก่อน color input + hex เดิม
  (จำเป็น เพราะไม่มีการดึงสีจากรูปแล้ว ช่องสีต้องดีพอด้วยตัวเอง)
- ปุ่มบันทึก disabled จนกว่าจะครบ หมวด + ทรง + สี
- เพิ่ม handler `data-shape`

## 5. Migration ของผู้ใช้เดิม

ผู้ใช้ที่เคยใช้เวอร์ชันปัจจุบันมี garment ที่ **ไม่มี `shapeId`** และอาจมี `photo` ค้างใน localStorage
- ตอน `init()`: garment ใดไม่มี `shapeId` → เติม `DEFAULT_SHAPE[category]`, ลบฟิลด์ `photo`, แล้ว persist หนึ่งครั้ง
- ไม่ต้องเป็น modal แต่ขึ้น banner ครั้งเดียวว่าเปลี่ยนมาใช้ทรงสำเร็จรูปแล้ว (กฎ no silent state change)

---

## จุดที่ต้องระวังเป็นพิเศษ (เจอตอนอ่านโค้ด)

1. **`data-cat` handler (บรรทัด 1558-1564) แค่สลับ `aria-pressed` ไม่ re-render ฟอร์ม**
   พอเพิ่ม ShapePicker ต้องเปลี่ยนเป็น re-render ไม่งั้นเปลี่ยนหมวดแล้วรายการทรงไม่เปลี่ยนตาม
   และถ้าทรงที่เลือกอยู่ไม่อยู่ในหมวดใหม่ ต้องรีเซ็ตเป็นทรงเริ่มต้นของหมวดนั้น
2. **`tileHTML` ซ่อนชื่อชิ้นในโหมด idea** (`item.isIdea ? '' : ...` บรรทัด 1182)
   ต้องเปลี่ยนเป็นแสดง **ชื่อทรง** แทน ไม่งั้นโหมดไอเดียไม่มีข้อความกำกับ = ผิดกฎ a11y "ไม่สื่อด้วยรูปทรง/สีอย่างเดียว"

## ไฟล์ที่แก้
- ไฟล์เดียว: source ที่บันทึกไว้ `artifact-ee952a4d-1789018155-808c.html`
- เขียนเวอร์ชันใหม่ลง scratchpad แล้ว publish ทับ `https://claude.ai/code/artifact/ee952a4d-7525-4446-a827-548546fe68b0` (ลิงก์เดิม)
- ขนาดจริงหลังแก้: 86KB → **104KB** (SVG 21 ทรง) ไม่ใช่ข้อจำกัด

## การตรวจสอบ (verification)
1. เปิดครั้งแรก (ไม่มีข้อมูล) เห็นชุดตัวอย่างเป็น **ทรงเสื้อผ้าย้อมสี** ทั้ง 2 โหมด
2. โหมด "สีที่เราแนะนำ" ใช้ทรงเริ่มต้นต่อหมวด · โหมด "จากตู้ของฉัน" ใช้ทรงจริง
3. เพิ่มชิ้นใหม่: เลือกหมวด → **รายการทรงเปลี่ยนตามหมวด** → เลือกทรง → เลือกสี → พรีวิวย้อมสีสด → บันทึกแล้วขึ้นในตู้
4. **ทดสอบเสื้อขาว `#FFFFFF` และดำ `#17161A`**: เส้นใน SVG สลับความเข้มอัตโนมัติ เห็นทรงชัดทั้ง light/dark
5. ผู้ใช้เดิม (garment ไม่มี `shapeId` ใน localStorage) เปิดมาแล้วไม่พัง ได้ทรงเริ่มต้นของหมวด
6. ตั้ง `shapeId` มั่วในข้อมูล → ได้ทรงเริ่มต้น + หมายเหตุ ไม่ใช่ช่องว่าง
7. คีย์บอร์ด / aria / reduced-motion ยังทำงานเหมือนเดิม; ไม่มี external request

## ขอบเขตที่ไม่ทำในรอบนี้
Favorites + Swap One Item (เฟส 2) และ Analysis / Color-first / Generator (เฟส 3) ยังไม่แตะ

---

## ผลหลังลงมือ (บันทึกไว้)
- **แก้เพิ่มจากแผน 1 จุด:** migration ตอน `init()` เดิมเขียนทับ `shapeId` ที่ไม่รู้จักทิ้ง ทำให้ `resolveShape().fellBack` ไม่มีวันเป็นจริง (ป้าย "ทรงเริ่มต้น" ไม่เคยขึ้น) และขัดสัญญา `shapeId` ถาวร แก้เป็นเติมเฉพาะกรณี **ไม่มีฟิลด์** เท่านั้น
- **ผลตรวจ:** syntax 6/6 · logic 17/17 (`logic.js`) · browser 10/10 (`test2.js`) · ไม่มี JS error · ไม่มี external request · ไม่มีเศษโค้ดรูปเหลือ
- **ยังไม่แก้ (นอกขอบเขต):** เดสก์ท็อป การ์ดชุดที่โฟกัสมีพื้นที่ว่างด้านล่าง แก้ได้ด้วย `align-items:flex-start` บรรทัดเดียว
