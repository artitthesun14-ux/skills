# UI Design: Outfit Color Matcher

> แปลง UX ที่ผ่านการตรวจแล้ว (View A-E, flows, micro-copy, a11y) เป็นระบบภาพที่พร้อมสร้าง
> พาเลตต์ล็อกตามสเปก 7A (off-white + ดำเกือบสนิท + แดง raspberry)
> [P1]/[P2]/[P3] = เฟส

## 0. หลักคิดเชิงภาพ (Visual rationale)

**ปัญหาเฉพาะตัวของแอปนี้:** สีคือ *ทั้ง* แบรนด์ *และ* ข้อมูล หน้าจอเต็มไปด้วยสีเสื้อผ้าของผู้ใช้ที่เราควบคุมไม่ได้ (อาจเป็นแดงเหมือน CTA, ขาวเหมือนพื้น, ดำเหมือนตัวอักษร) ระบบภาพจึงต้องตั้งอยู่บนกฎ 3 ข้อ:

1. **แยกชั้น "สีแบรนด์" กับ "สีข้อมูล" อย่างเด็ดขาด**
   - แดง `--accent` = ใช้ได้เฉพาะ *การกระทำ* (CTA, eyebrow, สถานะ active) เท่านั้น **ห้ามใช้เป็นสีของข้อมูล**
   - สีเสื้อผ้า = อยู่ใน *ภาชนะ* เสมอ (tile/swatch ที่มีขอบ + ป้ายกำกับ) ไม่เคยลอยเป็นพื้นหลังอิสระ
2. **ทุกสีข้อมูลต้องมี "วงแหวนกันกลืน" (`--data-ring`)** เพราะสีขาว/ดำของเสื้อผ้าจะจมพื้นหรือจมตัวอักษร วงแหวน 1px รอบทุก swatch ทำให้รูปทรงคงอยู่เสมอ
3. **ตัวอักษรใส่โทเคนตัวอักษรเท่านั้น ไม่เคยใส่สีของข้อมูล** ชื่อสี/เปอร์เซ็นต์ อยู่ในสี `--ink`/`--ink-muted` เสมอ ส่วนตัวสีทำหน้าที่เป็น mark ข้างๆ

4. **เสื้อผ้าแสดงเป็น "ทรง SVG ที่ย้อมสีได้" ไม่ใช่รูปถ่าย** (ดู §3.7) ผู้ใช้เลือกทรงจากคลังสำเร็จรูป ไม่มีการอัปโหลดรูป ทำให้ทรงเดียวกันถูกย้อมด้วยสีจริงหรือสีที่แนะนำก็ได้ และเก็บแค่ `shapeId` แทนไฟล์รูป

ที่เหลือคือวินัยแบบ Rand ตามสเปก: สีแบน ไม่มี gradient คอนทราสต์สูง เว้นที่ว่างเยอะ ตัวอักษรหัวข้อหนัก

---

## 1. Design tokens

### 1.1 สี (จาก 7A + โทเคนที่ระบบภาพต้องเพิ่ม)

| Token | Light | Dark | ใช้ทำอะไร |
|---|---|---|---|
| `--bg` | `#FBFAF7` | `#141316` | พื้นหน้า |
| `--surface` | `#FFFFFF` | `#1C1B1F` | การ์ด/แผง |
| `--surface-sunken` | `#F4F2EC` | `#232228` | ช่องว่าง/well, tile ว่าง, แทร็ก carousel |
| `--ink` | `#17161A` | `#F4F1EA` | ตัวอักษรหลัก |
| `--ink-muted` | `#6E6B66` | `#A7A29A` | ตัวอักษรรอง, ป้ายกำกับ |
| `--line` | `#ECE9E2` | `#2B2A2E` | เส้นคั่น, ขอบการ์ด |
| `--accent` | `#E23A4E` | `#F1596B` | CTA, eyebrow, สถานะ active |
| `--accent-ink` | `#FFFFFF` | `#17161A` | ตัวอักษรบนพื้น accent |
| `--accent-hover` | `#C62F41` | `#FF6E7E` | hover ของ accent |
| **`--data-ring`** | `rgba(0,0,0,.14)` | `rgba(255,255,255,.20)` | **วงแหวน 1px รอบทุก swatch สีข้อมูล (บังคับ)** |
| **`--data-gap`** | = `--surface` | = `--surface` | **ช่องว่าง 2px ระหว่าง segment สีที่ติดกัน** |
| **`--garment-fill`** | ค่า hex ของชิ้นนั้น | เหมือนกัน | สีตัวเสื้อผ้าใน SVG (ค่าจริง ไม่แปลงตามธีม) |
| **`--garment-line`** | **คำนวณจากความสว่างของ `--garment-fill`** (ดู §3.7) | เหมือนกัน | เส้นขอบ/ตะเข็บ/กระดุมใน SVG |
| `--focus` | `--accent` | `--accent` | วงโฟกัส 2px + offset 2px |
| `--danger` | `#B3261E` | `#F2B8B5` | ลบ/คำเตือนรุนแรง (แยกจาก accent) |

> **หมายเหตุ dark mode:** สีข้อมูล (เสื้อผ้า) **ไม่ถูกแปลง** ในโหมดมืด เพราะมันคือค่าจริงของเสื้อผ้า สิ่งที่เปลี่ยนคือพื้น/วงแหวน/ช่องว่าง เท่านั้น

### 1.2 ตัวอักษร

Stack: `Inter, "Helvetica Neue", system-ui, "Noto Sans Thai", sans-serif`

| Token | ขนาด/บรรทัด | น้ำหนัก | ใช้ |
|---|---|---|---|
| `--fs-display` | `clamp(30px, 6vw, 46px)` / 1.05 | 800, tracking -0.02em | ชื่อเว็บ (wordmark) |
| `--fs-h1` | 26px / 1.2 | 700 | หัว section |
| `--fs-h2` | 19px / 1.3 | 700 | หัวการ์ด |
| `--fs-h3` | 16px / 1.4 | 600 | หัวย่อย |
| `--fs-body` | 15px / 1.6 | 400 | เนื้อความ, คำแนะนำ |
| `--fs-sm` | 13px / 1.5 | 400-600 | ป้ายกำกับ, ชื่อสี, hex |
| `--fs-xs` | 11px / 1.4 | 700, uppercase, tracking .08em | eyebrow, badge "ตัวอย่าง" |

**กฎ:** hex แสดงด้วย `font-variant-numeric: tabular-nums` และตัวพิมพ์ใหญ่ (`#E23A4E`) เพื่อให้เรียงกันไม่กระตุก

### 1.3 ระยะ / รัศมี / เงา / การเคลื่อนไหว

- **Spacing (ฐาน 4px):** `--sp-1:4` `--sp-2:8` `--sp-3:12` `--sp-4:16` `--sp-5:24` `--sp-6:32` `--sp-7:48` `--sp-8:64`
- **Radius:** `--r-sm:8` (ปุ่มเล็ก, tile) `--r-md:12` (ปุ่ม) `--r-lg:16` (การ์ด) `--r-pill:999` (chip)
- **Elevation:** `--shadow-card: 0 1px 2px rgba(20,19,22,.06)` · `--shadow-raised: 0 8px 28px -12px rgba(20,19,22,.28)` (เฉพาะการ์ดที่โฟกัสใน carousel) · โหมดมืดลดความทึบลงครึ่ง แล้วเพิ่ม `--line` เป็นขอบแทน
- **Motion:** `--dur-fast:150ms` `--dur-pan:300ms` `--ease: cubic-bezier(.2,0,0,1)`
  - `prefers-reduced-motion: reduce` → ทุก duration = `0ms`, pan → สลับทันที
- **Breakpoints:** `sm < 640px` · `md 640-1023px` · `lg >= 1024px`
- **Container:** max-width `1040px`, ขอบข้าง `--sp-5` (มือถือ `--sp-4`)

---

## 2. ลำดับชั้นเลย์เอาต์ (Layout hierarchy)

```
┌ StickyNav (sticky top, 56px)  [แนะนำ] [ตู้] [บันทึก] [วิเคราะห์]
├ Hero (compact)   wordmark + eyebrow + PrimaryButton "วันนี้แต่งอะไรดี?"
├ ─────────────────────────────────────────────
├ SECTION A · แผงแนะนำ            ← น้ำหนักภาพสูงสุด
│   ModeToggle           (กลางบน)
│   [AutoSwitchNotice]   (inline ใต้ toggle เมื่อระบบสลับให้)
│   OccasionChips        (แถวเลื่อนแนวนอน)
│   Carousel  ── OutfitCard(focused) + peek ซ้าย/ขวา
│   NavRow    ── [<] [ตำแหน่ง 2/4] [>]        + PrimaryButton "เจนชุดใหม่"
├ SECTION B · ตู้เสื้อผ้า          ← น้ำหนักรอง
│   หัวข้อ + ปุ่ม "+ เพิ่มเสื้อผ้า" · GarmentGrid
├ SECTION C · บันทึกไว้ [P2]
└ SECTION D · วิเคราะห์ตู้ [P3]
```

**ลำดับความสำคัญทางสายตาในแผง A:** การ์ดที่โฟกัส (ใหญ่+เงา+ทึบ) > ปุ่มเจนใหม่ (accent) > ModeToggle > OccasionChips > การ์ดข้างเคียง (จาง 40%)

---

## 3. Component inventory

> ทุกคอมโพเนนต์ระบุ **สถานะครบ**: default / hover / active / focus-visible / disabled / loading / error (เท่าที่มีความหมาย)

### 3.1 ปุ่มและตัวควบคุม

| Component | รูปแบบ | สถานะ |
|---|---|---|
| **PrimaryButton** | พื้น `--accent`, ตัวอักษร `--accent-ink`, `--r-md`, สูง 44px, padding `12/20` | hover→`--accent-hover` · active→scale .98 · focus→ring · disabled→opacity .45 + no-pointer · loading→spinner แทน label, ความกว้างคงที่ (กันเด้ง) |
| **SecondaryButton** | โปร่ง, ขอบ 1px `--line`, ตัวอักษร `--ink` | hover→พื้น `--surface-sunken` · อื่นๆ เหมือนบน |
| **GhostButton** | ไม่มีขอบ, ตัวอักษร `--ink-muted` | hover→`--ink` |
| **IconSquareButton** (`<` `>`) | สี่เหลี่ยมจัตุรัส 44×44, `--r-sm`, ขอบ 1px `--line`, ไอคอน `--ink` | hover→พื้น `--surface-sunken` · disabled→opacity .4 (ใช้เมื่อมีชุดเดียว) · focus→ring |
| **FavoriteButton** [P2] | ไอคอนหัวใจ 44×44 | off→เส้นขอบ `--ink-muted` · **on→เติม `--accent`** · focus→ring · disabled (เต็ม 20)→opacity .45 + tooltip |
| **SwapControl** [P2] | ปุ่มเล็ก 🔄 มุม CategoryTile | disabled เมื่อหมวดนั้นมีชิ้นเดียว + hint |

### 3.2 ตัวเลือก (Selection)

**ModeToggle**: segmented 2 ตัวเลือก
- ทรง: pill (`--r-pill`), ขอบ 1px `--line`, พื้น `--surface`; ตัวที่เลือก = พื้น `--accent` + `--accent-ink`
- ป้าย: `สีที่เราแนะนำ` / `จากตู้ของฉัน`
- สถานะ: default · selected · focus (ring รอบตัวเลือก) · **auto-selected** (selected + แสดง `AutoSwitchNotice` ใต้ toggle)
- a11y: `role="radiogroup"`, ลูกเป็น `role="radio" aria-checked`

**OccasionChips**: chip เลือกได้ทีละหนึ่ง
- ทรง: pill, สูง 36px, padding `8/14`, ขอบ 1px `--line`
- selected: พื้น `--ink`, ตัวอักษร `--bg` (**ไม่ใช้ accent** เพื่อสงวนแดงให้ CTA และไม่ให้แย่งสายตากับสีเสื้อผ้า)
- แถวเลื่อนแนวนอนบนมือถือ (`overflow-x:auto`, ไม่มี scrollbar, มี fade ขอบ)

### 3.3 การ์ดชุด (หัวใจ)

**OutfitCard**
- ทรง: `--surface`, `--r-lg`, ขอบ 1px `--line`, padding `--sp-5` มุมโค้งธรรมดา
- โครงใน (บนลงล่าง):
  1. แถวหัว: `SampleBadge` (ถ้าเป็นตัวอย่าง) + ชื่อ rule เช่น "Analogous" เป็น eyebrow
  2. **CategoryTile stack** (บน → ล่าง → รองเท้า → [นอก] → [แอกเซส])
  3. `ProportionBar`
  4. `AdviceList` (1-3 บรรทัด)
  5. แถวปุ่ม: FavoriteButton [P2] · (Swap อยู่บน tile)
- **variants:** `focused` (scale 1, opacity 1, `--shadow-raised`) · `adjacent` (scale .92, opacity .4, ไม่รับ pointer, `aria-hidden`) · `idea` (tile = ทรงเริ่มต้นของหมวด ย้อมสีที่แนะนำ) · `wardrobe` (tile = ทรงจริงของชิ้น ย้อมสีจริง)

**SwapButton** (`.tile__swap`) ปุ่ม 🔄 ท้ายไทล์ เฉพาะการ์ดโฟกัส + โหมดจากตู้ของฉัน สลับชิ้นหมวดนั้นไปตัวถัดไปที่เข้ากันดี (คะแนนเงียบ) ล็อกชิ้นอื่น หมวดชิ้นเดียว disabled + hint; touch 44 (View C)

**FavoriteToggle** (`.card__fav`) หัวใจมุมขวาบนของการ์ด กด = บันทึก/เอาออก snapshot; เต็ม 20 เตือน สีขอบ/ตัวอักษร accent เมื่อ pressed แต่เป็นสถานะปุ่ม (การกระทำ) ไม่ใช่สีข้อมูล

**FavCard** (`.favcard`, View D) การ์ดชุดที่บันทึก: แถวทรงย้อมสี (snapshot) + ชื่อแก้ได้ + rule + ProportionBar จาก snapshot + เมนู ⋯ (แก้ชื่อ/ทำสำเนา/ลบ) reuse `.gchip__*`

**GarmentColorChip** (`.tile__chip`) สวอตช์สีล้วนต่อชิ้นในการ์ด: มือถืออยู่ขวาสุดของแถว เดสก์ท็อปเป็นแถบสีเต็มกว้างใต้ทรง แสดงสีจริงของชิ้น มี `--data-ring` และ `aria-hidden` (ชื่อสี+hex ข้างกันเป็นตัวสื่อ ไม่สื่อด้วยสีเดี่ยว) แดงเป็น fill ของชิ้นแดงได้ แต่ห้ามเป็นกรอบ/สถานะ

**CategoryTile**: ช่องสี่เหลี่ยมต่อหมวด
- อัตราส่วน 1:1, `--r-sm`, พื้น `--surface-sunken`, **ขอบ 1px `--data-ring` เสมอ**
- เนื้อใน: **`GarmentShape` (SVG ทรงเสื้อผ้าย้อมสี)** เต็มช่อง มี padding ในกรอบ ~10% (ดู §3.7)
  - โหมด **"จากตู้ของฉัน"**: ทรง = `shapeId` ของชิ้นจริง, สี = `color` ของชิ้นจริง
  - โหมด **"สีที่เราแนะนำ"**: ทรง = **ทรงเริ่มต้นของหมวดนั้น**, สี = สีที่แนะนำ (ทรงเดียวกัน คนละสี = เปรียบเทียบง่าย)
- ป้ายใต้ tile 2 บรรทัด: บรรทัด 1 = ชื่อหมวด + **ชื่อทรง** (`--fs-xs`, `--ink-muted`) · บรรทัด 2 = ชื่อสี + hex (`--fs-sm`, `--ink`)
- สถานะ: default · hover (ring หนา 2px + ปุ่ม Swap โผล่) · focus-visible (ring accent) · **empty** (ทรงวาดด้วยเส้นประไม่มี fill + ข้อความ "+ เพิ่ม") · **locked** (ไอคอนแม่กุญแจจาง ระหว่าง Swap หมวดอื่น) · disabled-swap (opacity ปุ่ม .4)

### 3.4 คอมโพเนนต์แสดงข้อมูลสี (ใช้กฎ dataviz)

**ColorSwatch** (อะตอมพื้นฐาน ใช้ซ้ำทุกที่)
- สี่เหลี่ยม `--r-sm` ขนาด 16/24/40 (sm/md/lg) + **วงแหวน 1px `--data-ring`**
- ต้องมาคู่กับข้อความเสมอ: `ชื่อสี · #HEX · role`: **ข้อความใช้ `--ink`/`--ink-muted` ไม่ใช่สีของ swatch**

**ProportionBar** (แถบสัดส่วน 60-30-10): *stacked bar หนึ่งแถบ*
- สูง 12px, `--r-sm` เฉพาะปลายซ้าย-ขวาสุด (ปลายข้อมูลมนตามกฎ mark)
- **ช่องว่าง 2px สี `--surface` ระหว่าง segment ทุกคู่** (บังคับ เพื่อกันกรณีเสื้อ 2 ชิ้นสีใกล้กันจนอ่านเป็นก้อนเดียว)
- ทุก segment มี inset ring 1px `--data-ring`
- **Legend อยู่ใต้แถบเสมอ** (2-5 รายการ): `ColorSwatch(sm) + ชื่อสี + % + role`
- **Direct label** เฉพาะ segment ที่ >= 12% ของความกว้าง; ที่เล็กกว่านั้นอ่านจาก legend เท่านั้น (ไม่ยัดตัวเลขลงทุกช่อง)
- **ไม่มี segment ไหนถูกตัดทิ้ง** ต่อให้เล็ก: ความกว้างขั้นต่ำ 6px เพื่อยังคลิก/hover ได้
- hover/focus ต่อ segment → tooltip: `ชื่อสี · #HEX · role · %`
- a11y: `role="img"` + `aria-label` สรุปทั้งแถบ ("สัดส่วนสี: Navy 55%, Cream 30%, White 15%") + legend ที่อ่านได้จริง

**AdviceList**: ข้อความ template
- bullet 1-3 ข้อ, `--fs-body`, `--ink-muted`; คำสำคัญ (ชื่อ rule) ทำเป็น `--ink` ตัวหนา **ไม่ระบายสี**

### 3.5 ตู้เสื้อผ้า

**GarmentChip** (การ์ดชิ้นเสื้อผ้าในกริด)
- โครง: **`GarmentShape` 1:1** (ในกรอบ `--data-ring`) + ชื่อชิ้น (`--fs-sm`, ตัดที่ 2 บรรทัด) + หมวด·ชื่อทรง (`--fs-xs`, `--ink-muted`) + ชื่อสี/hex
- มุมขวาบน: ปุ่ม `⋯` เปิดเมนู แก้ไข / ลบ
- สถานะ: default · hover (ยกขอบ) · focus · **sample** (มี `SampleBadge`) · deleting (จาง + spinner)

**GarmentForm** (เพิ่ม/แก้ไข): **ไม่มีการอัปโหลดรูปแล้ว**
- ฟิลด์เรียง: **หมวด → ทรง → สี → ชื่อ (ไม่บังคับ)**
  ลำดับนี้จำเป็น เพราะหมวดเป็นตัวกรองว่าจะโชว์ทรงไหนให้เลือก
- **CategorySelect**: chip เลือกหมวด 5 ตัว (ไม่ใช้ dropdown เพราะเห็นทั้งหมดเร็วกว่า)
- **ShapePicker**: กริดทรงในหมวดที่เลือก (3-4 คอลัมน์)
  - แต่ละตัวเลือก = `GarmentShape` ย้อมสีปัจจุบันที่ผู้ใช้เลือกไว้ (พรีวิวสดว่าจะออกมาหน้าตาแบบไหน) + ชื่อทรงใต้ภาพ
  - states: default · hover (ring 2px) · **selected** (ring `--accent` 2px + เครื่องหมายถูกมุมขวาบน) · focus-visible
  - a11y: `role="radiogroup"`, ลูกเป็น `role="radio" aria-checked`
- **ColorPicker** (ทางเดียวที่ใส่สีแล้ว จึงต้องดีพอ): 3 ส่วนรวมกัน
  1. แถวสวอทช์พรีเซ็ต ~12 สี (กลาง/อุ่น/เย็น) กดเลือกเร็ว
  2. `<input type="color">` สำหรับเลือกอิสระ
  3. ช่อง hex พิมพ์เอง (`tabular-nums`, uppercase)
  - พรีวิวสด: `GarmentShape` ของทรงที่เลือกย้อมสีนั้นทันที
  - states: default · focus · invalid (ขอบ `--danger` + "ใส่รหัสสีเช่น #4A5D8A")
- ปุ่มบันทึก disabled จนกว่าจะครบ **หมวด + ทรง + สี**

### 3.6 การนำทางและการสื่อสาร

| Component | รายละเอียด | สถานะ |
|---|---|---|
| **Carousel** | แทร็ก `--surface-sunken` โปร่ง, การ์ดกลาง + peek 2 ข้าง; pan `--dur-pan`; รองรับ swipe + ปุ่ม + ลูกศรซ้าย/ขวาบนคีย์บอร์ด | idle · panning · reduced-motion (สลับทันที) |
| **PositionIndicator** | ข้อความ `ชุดที่ 2 จาก 4` (`--fs-sm`): เป็นตัวอักษร ไม่ใช่จุดสีอย่างเดียว | ไม่มี |
| **Banner** | แถบเต็มความกว้าง, `--r-md`, ไอคอน + ข้อความ + ปุ่มรอง | `info` (พื้น `--surface-sunken`) · `warning` (ขอบ accent, ไม่ถมพื้น) · `error` (ขอบ `--danger`) |
| **AutoSwitchNotice** | ข้อความ inline ใต้ ModeToggle `--fs-sm --ink-muted` + ไอคอน ⓘ | แสดงเฉพาะรอบที่ระบบสลับให้ ปิดได้ |
| **SampleBadge** | pill เล็ก `--fs-xs`, พื้น `--surface-sunken`, ขอบ `--line`, ข้อความ "ตัวอย่าง" | ไม่มี |
| **EmptyState** | ไอคอน/บล็อกสีจาง + หัวข้อ + คำอธิบาย + ปุ่มทางออก 1 ปุ่ม | ต่อ view |
| **InlineFeedback** | ข้อความสั้นใต้ปุ่ม + `aria-live="polite"` เช่น "สร้างชุดใหม่แล้ว" | auto-hide 2.5s |
| **ConfirmDialog** | โมดัลกลางจอ, ปุ่มลบใช้ `--danger` | ใช้กับลบชิ้น/ลบ favorite |

### 3.7 ระบบทรงเสื้อผ้า (Garment Shape System)

> แทนที่การอัปโหลดรูปทั้งหมด ผู้ใช้ **เลือกทรงจากคลังสำเร็จรูป** แล้วเลือกสี ระบบวาดเป็น SVG ที่ย้อมสีได้

**ทำไมต้องเป็น SVG ไม่ใช่รูป**
- ย้อมสีด้วย CSS ได้ → ทรงเดียวกันแสดงได้ทั้ง "สีจริงของฉัน" และ "สีที่แนะนำ" (หัวใจของฟีเจอร์)
- เก็บแค่ `shapeId` (~ไม่กี่ไบต์) แทน data URL (~60KB) → **ปัญหา localStorage เต็มหมดไป**
- inline ในหน้า ไม่โหลดจากภายนอก → ผ่าน CSP; คมทุกความละเอียด

**คลังทรงเฟส 1 (21 ทรง ครบ 5 หมวด)**

| หมวด | ทรง |
|---|---|
| บน (top) | เสื้อยืดคอกลม · เสื้อยืดคอวี · โปโล · เชิ้ตแขนยาว · เชิ้ตแขนสั้น · ฮู้ด · เสื้อกล้าม |
| ล่าง (bottom) | ยีนส์ทรงตรง · ชิโน · ขายาวขากว้าง · จ็อกเกอร์ · ขาสั้น |
| นอก (outer) | แจ็กเก็ต · เบลเซอร์ · คาร์ดิแกน |
| รองเท้า (shoes) | สนีกเกอร์ · บูท |
| แอกเซสซอรี | หมวกแก๊ป · กระเป๋าสะพาย |

- **ทรงเริ่มต้นต่อหมวด** (ใช้ในโหมด "สีที่เราแนะนำ"): บน=เสื้อยืดคอกลม · ล่าง=ยีนส์ทรงตรง · นอก=แจ็กเก็ต · รองเท้า=สนีกเกอร์ · แอกเซส=หมวกแก๊ป
- ทุกทรงวาดสไตล์เดียวกัน (flat sketch เส้นสม่ำเสมอ) บน `viewBox="0 0 120 120"` จัดกึ่งกลาง มี margin ในกรอบ เพื่อให้ทุกทรงดูสมส่วนกันเวลาเรียงในการ์ด

**กายวิภาคของแต่ละ SVG: 2 ชั้นเท่านั้น**
1. `.shape-fill`: ตัวเสื้อผ้า: `fill: var(--garment-fill)`, `stroke: none`
2. `.shape-line`: เส้นขอบ + รายละเอียด (ตะเข็บ กระดุม กระเป๋า ปกเสื้อ ขอบยางยืด เชือก): `fill: none`, `stroke: var(--garment-line)`, `stroke-width: 2`, `stroke-linejoin: round`

**กฎสีเส้น (`--garment-line`): สำคัญที่สุด**
เส้นต้องเห็นได้ทั้งบนเสื้อสีขาวและเสื้อสีดำ จึงคำนวณจาก **ความสว่างของสีเสื้อ ไม่ใช่ธีมของหน้า**:
```
L = relative luminance ของ --garment-fill
ถ้า L >= 0.55  ->  --garment-line = rgba(0,0,0,.55)      (สีเสื้อสว่าง ใช้เส้นเข้ม)
ถ้า L <  0.55  ->  --garment-line = rgba(255,255,255,.62) (สีเสื้อเข้ม ใช้เส้นสว่าง)
```
- ใช้ threshold **ค่าเดียว ไม่มี hysteresis** เพื่อให้ผลลัพธ์คาดเดาได้ (สีเดิมได้เส้นเดิมเสมอ)
- กฎนี้ทำงานเหมือนกันทั้ง light/dark เพราะขึ้นกับสีเสื้อ ไม่ใช่พื้นหลัง

**Component: `GarmentShape`**
- อินพุต: `shapeId`, `color(hex)`, `size`
- เอาต์พุต: `<svg role="img" aria-label="{ชื่อทรง} สี {ชื่อสี} {HEX}">`
- variants: `filled` (ปกติ) · **`outline`** (ช่องว่าง: `fill:none` + เส้นประ ใช้ในสถานะ empty) · `preview` (ใน ShapePicker)
- **ไม่มีเงา ไม่มี gradient** ตามวินัย Rand; ความลึกมาจากเส้นอย่างเดียว

**a11y**
- ทรงไม่ใช่ตัวสื่อความหมายเดี่ยว: **ชื่อทรงแสดงเป็นข้อความเสมอ** ใต้/ข้างภาพ
- สีก็ไม่ใช่ตัวสื่อเดี่ยว: มีชื่อสี + hex กำกับ (กฎเดิม §0 ข้อ 3)
- SVG ตกแต่งล้วนใน ShapePicker ที่มีข้อความชื่อทรงอยู่แล้ว ใช้ `aria-hidden="true"` ได้ ป้องกันการอ่านซ้ำ

**การเพิ่มทรงในอนาคต (extensibility): ออกแบบให้ขยายได้ตั้งแต่วันแรก**

คลังทรงเป็น **ข้อมูล (registry)** ไม่ใช่โค้ดที่ฝังอยู่ในคอมโพเนนต์ → เพิ่มทรงใหม่ = เติม 1 รายการ `{ id, name, category, deprecated?, svg }` ไม่ต้องแก้ `ShapePicker` / `CategoryTile` / `GarmentChip` เลย เพราะทุกตัวอ่านจาก registry เดียวกัน

**สัญญาที่ห้ามผิด (ไม่งั้นตู้ของผู้ใช้พัง):**
1. **`shapeId` เป็นสัญญาถาวร** เมื่อปล่อยเวอร์ชันไปแล้ว **ห้ามเปลี่ยนชื่อ id และห้ามลบ** เพราะ garment ในเครื่องผู้ใช้อ้างอิงอยู่
2. **วาดใหม่ให้สวยขึ้นได้ แต่ต้องคง id เดิม** → ผู้ใช้ทุกคนได้ภาพที่ดีขึ้นทันทีที่ publish โดยไม่ต้องทำอะไร
3. **เลิกใช้ทรงไหน ให้ติด `deprecated: true` แทนการลบ** → ซ่อนจาก ShapePicker สำหรับการเพิ่มชิ้นใหม่ แต่ยังเรนเดอร์ให้คนที่มีชิ้นนั้นอยู่แล้ว

**Fallback (บังคับ):** ถ้าเจอ `shapeId` ที่ไม่มีใน registry (เปิดลิงก์เวอร์ชันเก่า/ข้อมูลเพี้ยน) ให้วาด **ทรงเริ่มต้นของหมวดนั้น** แทน พร้อมหมายเหตุเล็ก "ทรงเดิมไม่พร้อมใช้งาน" และ**ห้ามปล่อยช่องว่างหรือทำให้หน้าพัง**

**ต้นทุนการขยาย:** SVG flat ราว 1-3KB/ทรง เพิ่มอีก 20 ทรง ≈ +30-60KB บนเพดานหน้า 16MB ไม่ใช่ข้อจำกัด
**เกณฑ์ที่ต้องเพิ่ม UI:** เมื่อคลังเกิน ~30 ทรง `ShapePicker` ต้องมีช่องค้นหา/กรองเพิ่ม ไม่งั้นเลื่อนหายาก

---

## 4. หน้าจอทีละ view

### View A · แผงแนะนำ [P1]
- **A0 First-load:** Banner info บนสุด: *"นี่คือชุดตัวอย่างให้ลองเล่น เพิ่มเสื้อผ้าของคุณเพื่อดูชุดจากตู้จริง"* + GhostButton "ล้างตัวอย่าง"; ทุกการ์ดมี `SampleBadge`
- **A1 Idea mode:** CategoryTile = **ทรงเริ่มต้นของหมวด ย้อมสีที่แนะนำ**; หัวการ์ด eyebrow = ชื่อ rule
- **A2 Wardrobe mode:** CategoryTile = **ทรงจริงของชิ้นนั้น ย้อมสีจริงของชิ้นนั้น**
- *(ทั้งสองโหมดใช้ภาษาภาพเดียวกัน ต่างแค่ที่มาของทรง/สี ทำให้เทียบกันได้ตรงๆ)*
- **A3 Insufficient:** แทน Carousel ด้วย EmptyState: *"ยังขาด{หมวด} เพิ่มอีกนิดเพื่อจัดชุดจากตู้"* + PrimaryButton "เพิ่ม{หมวด}" + GhostButton "ดูไอเดียสีแทน" (สลับโหมด)
- **A4 No-match:** EmptyState + ปุ่ม "สลับไปโหมดไอเดีย" (fallback เชิงป้องกัน: ตัวแนะนำไม่มีเงื่อนไขตายตัวให้ผ่อน มีบน+ล่างเมื่อไรก็ได้ชุดที่คิดคะแนนออกมาเสมอ ทางออกจริงคือสลับไปโหมดไอเดีย)
- **A5 Transition:** pan; ปุ่มเจนใหม่เข้าสถานะ loading; หลังเสร็จ InlineFeedback "สร้างชุดใหม่แล้ว"

### View B · ตู้เสื้อผ้า [P1]
- **B0 Empty:** EmptyState "ตู้ยังว่าง" + PrimaryButton "+ เพิ่มเสื้อผ้าชิ้นแรก"
- **B1 มีของ:** กริด GarmentChip · หัวข้อแสดงจำนวน "12 ชิ้น"
- **B2 Form:** เปิดเป็น inline panel (มือถือ = แผ่นเลื่อนขึ้นเต็มจอ) ลำดับ หมวด → ทรง → สี → ชื่อ
- **B3 Storage blocked** → Banner warning ค้างบนสุดของ section ("ใช้งานได้ แต่จะไม่บันทึกถาวรในเครื่องนี้")
- *(ไม่มีสถานะ loading ดึงสีจากรูป / image error / quota เต็ม อีกแล้ว เพราะตัดการอัปโหลดรูปออก ข้อมูลต่อชิ้นเหลือแค่ข้อความไม่กี่ไบต์)*

### View C · การกระทำบนการ์ด [P1-P2]
- Favorite (มุมขวาบนการ์ด), Swap (มุม tile, โผล่ตอน hover/focus)

### View D · บันทึกไว้ [P2]
- กริดการ์ดย่อ (ProportionBar + ชื่อ) · D0 EmptyState · D2 Banner "ครบ 20 ชุดแล้ว ลบชุดเก่าก่อน"

### View E · วิเคราะห์ตู้ [P3]
- **E0:** EmptyState "ข้อมูลยังน้อยเกินไปจะสรุปได้" (ไม่เดาสุ่ม)
- **E1 ColorShareBar:** แถบแนวนอนเรียงจากมากไปน้อย โดย**fill = สีจริงของเสื้อผ้า** + ring `--data-ring` + ป้าย `ชื่อสี · hex · %` ด้านนอกแถบ (ตัวอักษรสี ink)
  - **ต้องมี hex ในป้ายด้วย ไม่ใช่แค่ `ชื่อสี · %`:** สองสีที่ต่างกันได้ชื่อไทยเดียวกันบ่อย (`#FFFFFF` กับ `#F2F0EB` ต่างก็ "ขาว") ถ้าเหลือแค่ชื่อ สองแถวจะอ่านเหมือนกันเป๊ะและแยกได้ด้วยสีอย่างเดียว ผิดกฎ ux §9
- **E1 DiversityBar:** 4 กลุ่ม (Neutral/Cool/Warm/Accent) งานของมันคือ *เทียบขนาด ไม่ใช่บอกตัวตน* จึงใช้ **สีเดียว** (`--ink` ที่ opacity .85) ทุกแถบ + ชื่อกลุ่มเป็น direct label **ไม่ประดิษฐ์พาเลตต์ 4 สีขึ้นมาใหม่** (กันชนกับสีข้อมูลจริงและกันปัญหาตาบอดสี)
- Insight 1-3 ข้อเป็น Banner info

---

## 5. Responsive

| | `sm < 640` | `md 640-1023` | `lg >= 1024` |
|---|---|---|---|
| นำทาง | แท็บล่างติดจอ 4 ปุ่ม | StickyNav บน | StickyNav บน |
| การ์ดชุด | กว้าง 86vw, peek ~7vw ต่อข้าง | 440px, peek 40px | 480px, peek 72px |
| CategoryTile | เรียงตั้ง 1 คอลัมน์ (tile 72px + ป้ายข้าง) | tile 96px | tile 104px |
| ตู้เสื้อผ้า | กริด 2 คอลัมน์ | 3 คอลัมน์ | 4 คอลัมน์ |
| ปุ่มเจนใหม่ | เต็มความกว้างใต้ NavRow | inline ขวาของ NavRow | inline ขวา |
| ฟอร์ม | แผ่นเลื่อนเต็มจอ | inline panel | inline panel 2 คอลัมน์ |

- **หน้าไม่เลื่อนแนวนอน** เด็ดขาด: แถว OccasionChips และ carousel เลื่อนภายในกล่องตัวเอง (`overflow-x:auto`)
- ตัวอักษรใช้ `clamp()` เฉพาะ display; ที่เหลือคงที่เพื่อความคาดเดาได้

---

## 6. Accessibility

- **โฟกัส:** `outline: 2px solid --focus; outline-offset: 2px` เห็นได้ทั้งสองธีม ทุก control ที่กดได้
- **Touch target >= 44×44** (IconSquareButton, Favorite, Swap, chips สูง 36 แต่มี padding แตะ 44)
- **ไม่สื่อด้วยสีอย่างเดียว:** ทุก swatch/tile/segment มี ชื่อสี + hex + role เป็นข้อความ; ModeToggle ที่เลือกมีทั้งพื้นสีและ `aria-checked`
- **Carousel:** `role="group" aria-roledescription="carousel"`; การ์ดที่ไม่โฟกัส `aria-hidden="true"` + `inert`; ปุ่มมี `aria-label` ("ชุดก่อนหน้า"/"ชุดถัดไป"); ลูกศรซ้าย-ขวาใช้ได้เมื่อโฟกัสอยู่ในแทร็ก
- **aria-live:** ผลลัพธ์ที่เปลี่ยน (แบตช์ใหม่, auto-switch, บันทึกแล้ว) ประกาศผ่าน `aria-live="polite"` หนึ่งจุดต่อ section
- **คอนทราสต์ (วัดจริงจากค่า computed ในหน้า ไม่ใช่ค่าประมาณ):**

  | จุด | Light | Dark |
  |---|---|---|
  | `--ink` บนพื้น | 17.25:1 | 16.41:1 |
  | `--ink-muted` บนพื้น | 5.08:1 | 7.30:1 |
  | `--ink-muted` บน `--surface` (การ์ด) | 5.31:1 | 6.75:1 |
  | eyebrow `--accent-solid` บนพื้น | 5.18:1 | 5.62:1 |
  | `--accent-ink` บนปุ่มหลัก | 5.41:1 | 5.47:1 |
  | `.badge` บน `--surface-sunken` | 4.74:1 | 6.22:1 |
  | chip/ModeToggle ที่เลือก | 17.25:1 | 16.41:1 |

  ทุกจุดผ่าน 4.5:1 จุดต่ำสุดคือ `.badge` ที่ 4.74:1 (light) เหลือระยะห่างจากเกณฑ์ไม่มาก
  ถ้าจะแก้สีพื้น `--surface-sunken` หรือ `--ink-muted` ต้องวัดซ้ำ
- **สีข้อมูลไม่ถูกบังคับให้ผ่านคอนทราสต์** (มันคือค่าจริงของเสื้อผ้า) จึงชดเชยด้วย ring + ป้ายข้อความเสมอ
- **reduced-motion:** ตัด pan/scale/fade ทั้งหมด

---

## 7. ทดสอบกับข้อมูลจริง (ไม่ใช่ placeholder สวยๆ)

| เคสจริง | สิ่งที่ระบบภาพต้องรอด |
|---|---|
| เสื้อสีขาว `#FFFFFF` บนการ์ดขาว | เส้น SVG เป็น `rgba(0,0,0,.55)` อัตโนมัติ + `--data-ring` รอบ tile → ยังเห็นทรงชัด |
| เสื้อสีดำ `#111` ในโหมดมืด | เส้น SVG พลิกเป็น `rgba(255,255,255,.62)` อัตโนมัติ + ring สว่างขึ้น |
| สีเทากลางคาบเส้น `L ≈ 0.55` | ใช้ threshold ค่าเดียว ไม่มี hysteresis → สีเดิมได้เส้นเดิมเสมอ ไม่กะพริบ |
| ทรงต่างกันแต่สีเดียวกัน (เสื้อยืด/โปโล ขาวทั้งคู่) | ชื่อทรงเป็นข้อความใต้ tile แยกให้เห็น ไม่พึ่งรูปทรงอย่างเดียว |
| เสื้อสีแดงใกล้ `--accent` | swatch อยู่ใน tile มีขอบ + ป้าย; CTA เป็นปุ่มทรงต่างกันชัด ไม่สับสน |
| กางเกง+เสื้อสีใกล้กันมาก | ช่องว่าง 2px ใน ProportionBar แยกให้เห็นสองก้อน |
| ชื่อชิ้น "เสื้อเชิ้ตลินินแขนยาวสีครีมตัวโปรด" | ตัด 2 บรรทัดด้วย `-webkit-line-clamp` + `title` เต็ม |
| ชุดมี 5 ชิ้น → 5 สี | segment เล็กสุดกว้างอย่างน้อย 6px, label ไปอยู่ legend |
| ตู้มี 60 ชิ้น | SVG inline เบามาก แต่ให้ใช้ `<symbol>` + `<use>` นิยามทรงครั้งเดียวแล้วอ้างซ้ำ (ไม่ทำซ้ำ path 60 รอบ) |
| ข้อความไทยยาวกว่าอังกฤษ | ปุ่มไม่ fix width, ใช้ padding + `white-space: nowrap` เฉพาะ chip |

---

## 8. ส่งต่อการสร้าง (เฟส 1)

**ต้องมีในเฟส 1:** tokens ทั้งชุด · **คลังทรง SVG 21 ทรง (§3.7)** · **GarmentShape** · PrimaryButton/SecondaryButton/GhostButton/IconSquareButton · ModeToggle + AutoSwitchNotice · OccasionChips · Carousel + PositionIndicator · OutfitCard + CategoryTile · ColorSwatch · ProportionBar (+legend, tooltip) · AdviceList · GarmentChip/GarmentGrid · GarmentForm (**CategorySelect, ShapePicker, ColorPicker**) · Banner · SampleBadge · EmptyState · InlineFeedback · ConfirmDialog

**ตัดออกแล้ว (จากการเลิกใช้รูปถ่าย):** ImageDropzone · การดึงสีจากรูปด้วย canvas · สถานะ image-error / quota-exceeded / loading ดึงสี

**เลื่อนไปเฟสหลัง:** FavoriteButton/SwapControl [P2] · ColorShareBar/DiversityBar [P3]

---

## 9. เฟส 4: System Overhaul [P4-A..D, ยังไม่ implement]

> ต่อยอดจาก `docs/ux-outfit-color-matcher.md` §1-11 (แท็ก [P4-A..D]) และ `.scratch/outfit-color-matcher/spec.md`
> §1-8 ข้างบนคือระบบภาพที่ **shipped จริงตอนนี้** (เฟส 1-3) ส่วนนี้คือของใหม่ที่ **ยังไม่ implement**

### 9.0 ภาพรวม: อะไรถูกแทนที่ อะไรยังอยู่

**ถูกแทนที่ (superseded):**
- §7A สเปกหลัก + §0/§1.1/§3.3 ของเอกสารนี้ (สไตล์ Rand แบน+คอนทราสต์จัด) → **Collage Art Style**
- โทเคนสี dark mode ทั้งชุดใน §1.1 (คอลัมน์ Dark) → ลบทิ้ง เหลือโหมดเดียว + พื้นหลังไดนามิก
- Legend ของ `ProportionBar` (§3.4) ที่โชว์คำว่า role (สีหลัก/สีรอง/สีกลาง/สีเน้น) → เหลือแค่ชื่อสี+hex+%

**ยังอยู่ ไม่แตะ (เพราะเป็นกฎ engine/a11y ที่ spec.md ยืนยันว่าไม่เปลี่ยน):**
- กายวิภาค SVG 2 ชั้น, กฎสีเส้นจาก luminance, `shapeId` permanence, registry (§3.7 ทั้งหมด)
- กฎ "ไม่สื่อด้วยสีอย่างเดียว" และ `--data-ring` เป็นแนวคิดตั้งต้น (ขยายบทบาทเพิ่ม ดู 9.3)
- Color Role ภายใน engine (แค่เลิกโชว์เป็นคำในหน้า ไม่ใช่เลิกใช้จริง)

### 9.1 Design tokens ใหม่ [P4-C]

**สีพื้นฐาน (single-mode, ไม่มีคอลัมน์ dark อีกต่อไป):**

| Token | ค่า | เปลี่ยนจากเดิมยังไง |
|---|---|---|
| `--bg` | `#FBFAF7` | เดิมมี dark variant `#141316` → ลบทิ้ง ใช้ light เดียว |
| `--surface` | `#FFFFFF` | เหมือนเดิม (light) |
| `--ink` / `--ink-muted` / `--line` | เหมือนเดิม (light) | เหมือนเดิม (light) |
| `--accent` / `--accent-ink` / `--accent-hover` | เหมือนเดิม (light) | เหมือนเดิม (light) |
| `--data-ring`, `--data-gap`, `--garment-fill`, `--garment-line`, `--focus`, `--danger` | เหมือนเดิม (light) | เหมือนเดิม, ไม่มี dark variant แล้ว |

**โทเคนใหม่สำหรับธีมไดนามิก:**

| Token | ค่า | ใช้ทำอะไร |
|---|---|---|
| `--theme-tint-h` | คำนวณสด จาก hue ของ Primary role ของการ์ดโฟกัส | hue ของพื้นหลังตอนนี้ |
| `--theme-tint-s` | **6%** (ค่าคงที่ ไม่ขยับตาม hue) | ความอิ่มสีของพื้นหลัง คงที่ต่ำมากเพื่อไม่แย่งสายตาจากสีเสื้อผ้า |
| `--theme-tint-l` | **95%** (ค่าคงที่) | ความสว่างพื้นหลัง คงที่สูงมากเพื่อคุมคอนทราสต์กับ `--ink` ให้นิ่งไม่ว่า hue จะเป็นอะไร |
| `--bg` (เมื่อไม่ได้ล็อกธีม) | `hsl(var(--theme-tint-h) var(--theme-tint-s) var(--theme-tint-l))` | แทนที่ `--bg` คงที่เดิม เฉพาะตอนมีชุดที่โฟกัสอยู่แล้ว (ก่อนนั้นใช้ `#FBFAF7` เดิมเป๊ะ) |
| `--theme-lock-icon` | ใช้ `--ink` เป็นเส้น, พื้นหลังปุ่มโปร่ง | ปุ่มล็อกธีม (2 สถานะ: กุญแจเปิด/ปิด) |

**โทเคนใหม่สำหรับ Collage Art Style:**

| Token | ค่า | ใช้ทำอะไร |
|---|---|---|
| `--collage-overlap-max` | `20%` ของความกว้าง tile | เพดานพื้นที่ที่ทรงหนึ่งบังทรงถัดไปได้ กันไม่ให้บังจนดูรก/สับสนว่าทรงไหนเป็นของหมวดไหน |
| `--collage-rotate-1..5` | `-6deg, 4deg, -3deg, 5deg, -4deg` (ไล่ตามลำดับ บน→ล่าง→นอก→รองเท้า→แอกเซส) | มุมเอียงคงที่ต่อ "ตำแหน่งในสแตก" ไม่ใช่สุ่ม เพื่อให้ผลลัพธ์คาดเดาได้/ทดสอบซ้ำได้ (หลักการเดียวกับ threshold สีเส้นใน §3.7 ที่ยึด "ค่าเดียวไม่มีการสุ่ม") |
| `--cutout-shadow` | `2px 3px 0 rgba(20,19,22,.18)` (เงาทึบ ไม่เบลอ) | ให้ทรงดูเหมือนถูก "ตัดแปะวาง" ไม่ใช่ไอคอนแบน |
| `--cutout-edge` | ขอบ 1.5px สี `--surface` รอบทุกทรง (มาก่อน `--data-ring`) | เส้นขอบกระดาษที่ตัดสองทรงที่ซ้อนทับออกจากกัน แม้สีจะใกล้เคียงกันมาก (ขยายบทบาทเดิมของ `--data-ring` ที่กันสีจมพื้น ให้กันสีจมกันเองด้วย) |

**เหตุผลของค่า S6/L95 (แทนที่ "ยังไม่ fix" ใน spec.md Decision #3):** ที่ S ต่ำและ L สูงขนาดนี้ ความสว่างสัมพัทธ์ (relative luminance) ของพื้นหลังแทบไม่ขยับเลยไม่ว่า hue จะเป็นอะไร (ต่างกันเฉลี่ย < 0.01 ตลอดวงล้อสี) จึงคอนทราสต์ `--ink` กับพื้นหลังยังอยู่แถว 16-17:1 เหมือน `--bg` เดิมทุกกรณี (เทียบได้กับตาราง §6 ที่วัดไว้แล้ว) นี่คือที่มาของกฎ "ไม่ควรลดคอนทราสต์ไม่ว่า hue ไหน" ที่ spec.md วางไว้เป็นข้อบังคับ

### 9.2 Layout hierarchy ที่เปลี่ยน [P4-C/P4-D]

```
┌ Header  wordmark + eyebrow + PrimaryButton "วันนี้แต่งอะไรดี?" + ThemeLockButton (ใหม่, ขวาสุด)
├ StickyNav (เหมือนเดิม)
├ SECTION A · แผงแนะนำ
│   ModeToggle → OccasionChips → **ColorOfTheDayChips + ปุ่ม "ดูสีเพิ่มเติม"** (ใหม่)
│   Carousel ── OutfitCard(focused, **collage variant**) + peek
│   NavRow
├ SECTION B · ตู้เสื้อผ้า (GarmentChip ใช้ collage variant เดียวกัน)
├ SECTION C · บันทึกไว้ (ไม่เปลี่ยน)
└ SECTION D · วิเคราะห์ตู้ (ไม่เปลี่ยน)

[Overlay] ColorToneModal ── เปิดจาก ColorOfTheDayChips หรือ ColorPicker ในฟอร์ม
```

**ตำแหน่ง ThemeLockButton:** ปลายขวาของ Header เสมอ ห่างจาก ColorOfTheDayChips อย่างน้อย `--sp-6` และใช้ไอคอนกุญแจ (ไม่ใช่หัวใจ/วงกลมเหมือนสวอตช์ล็อกสี) ตามกฎแยกตำแหน่ง/ไอคอนใน UX doc §7

### 9.3 Component inventory: ใหม่/เปลี่ยน

> ระบุสถานะครบเหมือนเดิม (default/hover/active/focus-visible/disabled/loading/error เท่าที่มีความหมาย)

**OutfitCard (collage variant)** [แทนที่ §3.3 บางส่วน]
- CategoryTile stack เปลี่ยนจากเรียงตั้งเป็น**ซ้อนทับแบบตัดแปะ**: แต่ละ tile หมุน `--collage-rotate-N` ตามตำแหน่ง, ขยับ offset แนวตั้งให้บังกันไม่เกิน `--collage-overlap-max`, ใส่ `--cutout-shadow` + `--cutout-edge`
- **ป้าย (ชื่อหมวด/ทรง/สี/hex) ย้ายออกจากตัวทรงทั้งหมด** ไปอยู่ใน `CollageLegend` แถบเดียวใต้กลุ่มทรง (reuse โครงเดียวกับ `ProportionBar` legend ที่มีอยู่แล้ว) แก้ปัญหา "ป้ายอ่านไม่ออกเพราะถูกทรงอื่นทับ" ที่ UX doc ตั้งไว้เป็นข้อจำกัด โดยไม่ต้องคิดกลไกใหม่ (ใช้ pattern legend เดิม)
- **CollapsibleCategorySlot:** หมวดที่ไม่มีของไม่สร้าง tile และไม่มีตำแหน่งในสแตกเลย ระบบคำนวณ `--collage-rotate-N`/offset ใหม่ตามจำนวนทรงที่มีจริง (เช่นมี 2 ทรง ก็ใช้แค่ 2 ค่าแรกของชุดมุม ไม่เว้นช่องของหมวดที่หายไป)
- states เดิมคงอยู่ (`focused`/`adjacent`/`idea`/`wardrobe`) + เพิ่ม **`collage-2` .. `collage-5`** (จำนวนทรงในสแตก มีผลกับ offset ที่คำนวณ)

**CategoryTile (collage variant)**
- ทรงยังคง `GarmentShape` เดิมทุกประการ (ไม่แตะ §3.7) เปลี่ยนแค่การจัดวาง/เงา/ขอบตามข้างบน
- **ไม่มีป้ายใต้ tile อีกต่อไป** (ย้ายไป `CollageLegend`) → tile เหลือแค่ทรง+เงา+ขอบ ลด visual noise ตอนซ้อนทับ

**CollageLegend** (ใหม่) แถบใต้กลุ่มทรง
- โครงเดียวกับ `ProportionBar` legend: ต่อชิ้น = `ColorSwatch(sm)` + ชื่อหมวด + ชื่อทรง + ชื่อสี + hex, เรียงตามลำดับที่ปรากฏในสแตก (บน→ล่าง→นอก→รองเท้า→แอกเซส เท่าที่มี)
- **ไม่มีคำว่า role อีกแล้ว** (ตัด "สีหลัก/สีรอง/สีกลาง/สีเน้น" ออกจากทุกที่ที่เคยโชว์ ทั้งตรงนี้และใน `ProportionBar`)

**ThemeLockButton** (ใหม่, Header)
- ทรง: reuse `IconSquareButton` (44×44) ไอคอนกุญแจ
- states: `unlocked` (กุญแจเปิด, `--ink`) · `locked` (กุญแจปิด + พื้น `--surface-sunken` ค้าง, ไม่ใช้สีอย่างเดียวบอกสถานะ) · hover/focus เหมือน IconSquareButton เดิม
- a11y: `aria-pressed` ตามสถานะ + `aria-label` เปลี่ยนตามสถานะ ("ล็อกธีมพื้นหลัง" / "ปลดล็อกธีมพื้นหลัง")

**RecommendedBadge** (ใหม่, บน SwapControl)
- ทรง: pill เล็ก `--fs-xs` reuse โครง `SampleBadge` แต่ใช้ไอคอนถูก/ดาวแทนคำว่า "ตัวอย่าง" + ข้อความ "แนะนำ"
- ปรากฏเฉพาะตอนตัวที่กำลังแสดงในวง swap ตรงกับ index อันดับ 1 เท่านั้น (ไม่ใช่ element ถาวร)
- a11y: มี `aria-label` เพิ่มบน SwapControl เอง ("แนะนำ เข้ากับชุดนี้ดีที่สุด") ไม่ใช่พึ่ง badge ที่เห็นด้วยตาอย่างเดียว

**SwapLockGuard** (ใหม่, บน SwapControl)
- ไอคอนกุญแจเล็กมุมของ `.tile__swap` **แสดงตลอดเวลา** ที่หมวดนั้นเป็นหมวดเดียวที่ถือสีล็อกอยู่ (ไม่รอกดแล้วค่อยโผล่)
- เมื่อกรองจนตัวเลือกเหลือ 0 → ปุ่มเข้า `disabled` + hint "ต้องคงสีที่ล็อกไว้ในชุดนี้" (ข้อความต่างจาก hint เดิม "มีชิ้นเดียวในหมวดนี้")
- a11y: `aria-label` อธิบายเหตุผลเสมอ ไม่ใช่แค่ไอคอน

**SwapSuggestedColorChip** (ใหม่)
- `ColorSwatch(sm)` แต่ใช้**ขอบเส้นประแทน `--data-ring` ทึบ** (ยืมภาษาเดียวกับ `GarmentShape` variant `outline` ใน §3.7 ที่ใช้เส้นประสื่อว่า "ยังไม่ใช่ของจริง") + ป้าย "สีที่น่าจะเข้ากันเพิ่ม (ยังไม่มีในตู้)"
- แตะไม่ได้เป็นปุ่ม action (ไม่เปลี่ยนชุด) เป็นข้อมูลอย่างเดียว จึงไม่มี state hover/active แบบปุ่ม

**ColorToneModal** (ใหม่)
- โครง: scrim ทึบ 40% + panel กลางจอ (มือถือ = แผ่นเลื่อนขึ้นเต็มจอ เหมือน `GarmentForm`) `--r-lg`, มี subtitle บอกแหล่งข้อมูล ("จากตู้ของคุณ" หรือ "สีทั้งหมดที่เลือกได้") ใต้หัวข้อทันที
- **ToneGroupList** (มุมมองแรก): กริด chip ชื่อกลุ่มโทน (น้ำตาล/เทา/แดง ฯลฯ) กลุ่มที่ไม่มีเฉดในแหล่งข้อมูลนั้นไม่แสดง
- **ToneGroupDetail** (แตะกลุ่มแล้ว): กริด `ColorSwatch(md)` ของทุกเฉดในกลุ่มนั้น + ปุ่มย้อนกลับไป ToneGroupList
- ปิด modal: ปุ่ม X มุมขวาบน + Escape + แตะ scrim; เลือกเฉด = ปิด modal ทันที + ใช้ค่าที่จุดเดิม + `InlineFeedback` ยืนยัน
- a11y: `role="dialog" aria-modal="true"`, trap focus ในแผง, คืน focus ไปปุ่ม "ดูสีเพิ่มเติม" ที่เปิดมันตอนปิด (มาตรฐาน modal, ระบบนี้ยังไม่เคยมี modal มาก่อนจึงกำหนดไว้ชัดตรงนี้)

**ColorOfTheDayChips** (ใหม่, ต่อยอด `OccasionChips`)
- ทรง/สถานะเดียวกับ `OccasionChips` ทุกประการ (reuse ไม่ประดิษฐ์ใหม่) ต่างแค่แหล่งข้อมูล (สีจริงในตู้ก่อน + พรีเซ็ต) และมี `IconSquareButton` เล็กท้ายแถวเปิด `ColorToneModal`
- selected = สวอตช์มีขอบ `--accent` 2px (ไม่ใช้พื้น `--accent` เต็มเหมือน chip อื่น เพราะตัวมันเองมีสีอยู่แล้ว การถมพื้นแดงทับจะขัดกฎ "สีข้อมูลอยู่ในภาชนะ ไม่ใช่ปนกับสีการกระทำ")

### 9.4 Responsive [เพิ่มจากตาราง §5]

| | `sm < 640` | `md 640-1023` | `lg >= 1024` |
|---|---|---|---|
| ColorToneModal | เต็มจอ (แผ่นเลื่อนขึ้น) | กล่องกลางจอ 480px | กล่องกลางจอ 560px |
| CollageLegend | 1 คอลัมน์ (ตามลำดับสแตก) | 2 คอลัมน์ | 2 คอลัมน์ |
| ThemeLockButton | ย้ายเข้า Header เป็นไอคอนล้วน (ไม่มี label ข้อความ) | เหมือน sm | เหมือน sm |
| Collage overlap | ลด `--collage-overlap-max` เหลือ 14% (จอแคบ ต้องแยกทรงง่ายขึ้น) | 20% (ค่าปกติ) | 20% |

### 9.5 Component states สรุปใหม่ (เฉพาะที่เพิ่มจากเฟส 4)

| Component | สถานะใหม่ |
|---|---|
| SwapControl | + `disabled-lock-guard` (ต่างจาก `disabled-single-item` เดิม ใช้ hint ต่างกัน) |
| SwapControl | + `showing-recommended` (index ตรงกับอันดับ 1 พอดี → มี RecommendedBadge) |
| OutfitCard | + `collage-2`..`collage-5` (จำนวนทรงจริงในสแตก) |
| ThemeLockButton | `unlocked` / `locked` |
| ColorToneModal | `list` (ToneGroupList) / `detail` (ToneGroupDetail) / `closing` |
| Header (พื้นหลังหน้า) | `tint-active` (ตามชุดล่าสุด) / `tint-locked` |

### 9.6 Accessibility เพิ่มเติม (สอดคล้อง UX doc §9 ใหม่)

- ธีมไดนามิกเปลี่ยนด้วย crossfade `--dur-pan`; `prefers-reduced-motion` → สลับทันทีไม่มีไล่สี (ใช้กลไก `--ease`/`--dur-*` เดิม ไม่สร้างระบบแอนิเมชั่นใหม่)
- ทุกไอคอนใหม่ (กุญแจล็อกธีม, กุญแจ swap guard, RecommendedBadge) มี `aria-label` ข้อความเสมอ ไม่ใช่พึ่งไอคอน/สีอย่างเดียว
- `ColorToneModal` เป็น modal ตัวแรกในระบบ ต้อง trap focus + คืน focus ตอนปิด ตามมาตรฐาน (ดู 9.3)
- Collage overlap เพดาน 20% (14% บนจอแคบ) เป็นค่าที่เลือกเพื่อให้ยังแยกแต่ละทรงด้วยตาได้ ไม่ใช่แค่ความสวยงาม; ป้ายทั้งหมดอยู่นอกโซนซ้อนทับเสมอ (ดู `CollageLegend`)

### 9.7 ส่งต่อการสร้าง (ตามลำดับเฟส A→D ใน spec.md)

- **เฟส A/B (engine + swap):** ยังไม่ต้องแตะ token/component ภาพใหม่เลย ใช้ระบบภาพปัจจุบัน (§1-8) ได้ทันที ยกเว้น `RecommendedBadge`/`SwapLockGuard`/`SwapSuggestedColorChip` (ทำได้แยกจาก Collage Art Style เพราะเป็น component เล็กที่ยืมภาษาเดิม)
- **เฟส C (visual/theme):** ต้องมีก่อนเริ่ม: โทเคนใน 9.1 ทั้งหมด, `ThemeLockButton`, การลบคอลัมน์ dark, legend ที่ตัดคำ role ออก
- **เฟส D (color UI + garment redesign):** ต้องมี: `ColorToneModal` (+list/detail), `ColorOfTheDayChips`, OutfitCard/CategoryTile collage variant + `CollageLegend` + `CollapsibleCategorySlot` ใช้กับทั้งการ์ดแนะนำและ `GarmentChip` ในตู้

---
*ทุกค่าที่ระบุมีเหตุผลกำกับ ไม่มีการตั้งค่าตามอำเภอใจ ถ้าจะเปลี่ยนค่าไหน ให้เปลี่ยนที่ token แล้วมันจะไหลทั้งระบบ*
