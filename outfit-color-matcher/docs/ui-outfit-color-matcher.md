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
| `--accent` | `#E23A4E` | `#F1596B` | **เฉพาะที่ไม่ใช่ตัวอักษร**: ขอบ, focus ring, ขีดใต้เมนู |
| `--accent-solid` | `#C62F41` | `#F1596B` | **ทุกที่ที่มีตัวอักษรเกี่ยว**: พื้น CTA และสี eyebrow |
| `--accent-solid-hover` | `#A82636` | `#FF6E7E` | hover ของพื้น CTA |
| `--accent-ink` | `#FFFFFF` | `#17161A` | ตัวอักษรบนพื้น accent |

> **ทำไมต้องแยกสองโทเคน (ตัดสินตอนสร้าง):** วัดจริงแล้ว `#FFFFFF` บน `#E23A4E` ได้ **4.24:1**
> และ `#E23A4E` เป็นตัวอักษรบน `--bg` ได้ **4.07:1** ทั้งคู่ต่ำกว่าเกณฑ์ AA 4.5:1 ของตัวอักษรปกติ
> `#E23A4E` ผ่านเฉพาะเกณฑ์ 3:1 ขององค์ประกอบที่ไม่ใช่ตัวอักษร จึงสงวนไว้ให้ขอบและวงโฟกัสเท่านั้น
> ส่วน `#C62F41` ผ่านทั้งเป็นพื้น (5.41:1) และเป็นตัวอักษร (5.18:1 บน `--bg`)
| **`--data-ring`** | `rgba(0,0,0,.14)` | `rgba(255,255,255,.20)` | **วงแหวน 1px รอบทุก swatch สีข้อมูล (บังคับ)** |
| **`--pb-bg`** | ตั้งใน scope ของคอมโพเนนต์ (ค่าตั้งต้น = `--surface`) | เท่ากัน | **สีที่มองทะลุช่องว่าง 2px ระหว่าง segment** ผูกกับพื้นจริงที่แถบวางอยู่ ย้ายแถบไปวางบน `--surface-sunken` แล้วช่องว่างยังถูก |
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
- ทรง: `--surface`, `--r-lg`, ขอบ 1px `--line`, padding `--sp-5`
- **มุมตัด (dog-ear)** มุมขวาบน 28px ตามคลิปอ้างอิง ทำด้วย `clip-path` (ตกแต่ง, ปิดได้)
- โครงใน (บนลงล่าง):
  1. แถวหัว: `SampleBadge` (ถ้าเป็นตัวอย่าง) + ชื่อ rule เช่น "Analogous" เป็น eyebrow
  2. **CategoryTile stack** (บน → ล่าง → รองเท้า → [นอก] → [แอกเซส])
  3. `ProportionBar`
  4. `AdviceList` (1-3 บรรทัด)
  5. แถวปุ่ม: FavoriteButton [P2] · (Swap อยู่บน tile)
- **variants:** `focused` (scale 1, opacity 1, `--shadow-raised`) · `adjacent` (scale .92, opacity .4, ไม่รับ pointer, `aria-hidden`) · `idea` (tile เป็นบล็อกสี) · `wardrobe` (tile เป็นรูป/บล็อกสี)

**CategoryTile**: ช่องสี่เหลี่ยมต่อหมวด
- อัตราส่วน 1:1, `--r-sm`, **ขอบ 1px `--data-ring` เสมอ** (กันสีขาว/ดำจมพื้น)
- เนื้อใน: `<img>` cover (ถ้ามีรูป) หรือ **บล็อกสีทึบ** = ค่า hex
- ป้าย **3 บรรทัด** (ตัดสินตอนสร้าง: 2 บรรทัดบังคับให้ชื่อชิ้นกับ hex อยู่บรรทัดเดียวกัน วัดได้ 166px ในช่องกว้าง 104px จึงล้นไปทับ tile ข้างๆ):
  1. ชื่อหมวด (`--fs-xs`, `--ink-muted`, ตัดด้วย ellipsis ได้)
  2. ชื่อชิ้น (`--fs-sm`, `--ink`, ตัดด้วย ellipsis + `title` เต็ม) เฉพาะโหมด wardrobe; โหมด idea ไม่มีบรรทัดนี้
  3. ชื่อสี + hex (`--fs-xs`, `--ink-muted`) **ห้ามตัดทิ้ง** ยอมขึ้นบรรทัดใหม่ดีกว่าเสียข้อมูลที่กฎ "ไม่สื่อด้วยสีอย่างเดียว" ต้องการ
- สถานะ: default · hover (ring หนา 2px + ปุ่ม Swap โผล่) · focus-visible (ring accent) · **empty** (พื้น `--surface-sunken`, ขอบเส้นประ, ข้อความ "+ เพิ่ม") · **locked** (ไอคอนแม่กุญแจจาง ระหว่าง Swap หมวดอื่น) · disabled-swap (opacity ปุ่ม .4)

### 3.4 คอมโพเนนต์แสดงข้อมูลสี (ใช้กฎ dataviz)

**ColorSwatch** (อะตอมพื้นฐาน ใช้ซ้ำทุกที่)
- สี่เหลี่ยม `--r-sm` ขนาด 16/24/40 (sm/md/lg) + **วงแหวน 1px `--data-ring`**
- ต้องมาคู่กับข้อความเสมอ: `ชื่อสี · #HEX · role` โดย **ข้อความใช้ `--ink`/`--ink-muted` ไม่ใช่สีของ swatch**

**ProportionBar** (แถบสัดส่วน 60-30-10): *stacked bar หนึ่งแถบ*
- สูง 12px, `--r-sm` เฉพาะปลายซ้าย-ขวาสุด (ปลายข้อมูลมนตามกฎ mark)
- **ช่องว่าง 2px สี `--surface` ระหว่าง segment ทุกคู่** (บังคับ เพื่อกันกรณีเสื้อ 2 ชิ้นสีใกล้กันจนอ่านเป็นก้อนเดียว)
- ทุก segment มี inset ring 1px `--data-ring`
- **Legend อยู่ใต้แถบเสมอ** (2-5 รายการ): `ColorSwatch(sm) + ชื่อสี + % + role`
- **Direct label** เฉพาะ segment ที่ >= 12% ของความกว้าง; ที่เล็กกว่านั้นอ่านจาก legend เท่านั้น (ไม่ยัดตัวเลขลงทุกช่อง)
- **ไม่มี segment ไหนถูกตัดทิ้ง** ต่อให้เล็ก: ความกว้างขั้นต่ำ 6px เพื่อยังคลิก/hover ได้
- **legend คือทางเข้าหลักเสมอ** เพราะจอสัมผัสไม่มี hover: `md`/`lg` hover/focus ต่อ segment แล้วได้ tooltip `ชื่อสี · #HEX · role · %`; `sm` แตะ segment แล้วไฮไลต์รายการที่ตรงกันใน legend (ไม่เปิด tooltip ลอย)
- ทุก segment เป็น `<button>` จริง เพื่อให้โฟกัสด้วยคีย์บอร์ดได้ตาม §6
- a11y: `role="img"` + `aria-label` สรุปทั้งแถบ ("สัดส่วนสี: Navy 55%, Cream 30%, White 15%") + legend ที่อ่านได้จริง

**AdviceList**: ข้อความ template
- bullet 1-3 ข้อ, `--fs-body`, `--ink-muted`; คำสำคัญ (ชื่อ rule) ทำเป็น `--ink` ตัวหนา **ไม่ระบายสี**

### 3.5 ตู้เสื้อผ้า

**GarmentChip** (การ์ดชิ้นเสื้อผ้าในกริด)
- โครง: ColorSwatch(lg) หรือรูปย่อ 1:1 (ขอบ `--data-ring`) + ชื่อชิ้น (`--fs-sm`, ตัดที่ 2 บรรทัด) + หมวด (`--fs-xs`, `--ink-muted`) + ชื่อสี/hex
- มุมขวาบน: ปุ่ม `⋯` **44x44** เปิดเมนู แก้ไข / ลบ (แต่ละแถวสูง >= 44px, ปิดด้วย Escape หรือคลิกที่อื่น)
  - **ห้ามวางปุ่มไอคอนเล็กสองปุ่มติดกันแทน** (ตัดสินตอนสร้าง): ปุ่ม 32px สองปุ่มห่าง 4px เมื่อขยายพื้นที่แตะเป็น 44px จะทับกัน 8px ทำให้แตะขอบขวาของ "แก้ไข" แล้วไปโดน "ลบ" ซึ่งเป็นการกระทำที่ทำลายข้อมูล
- สถานะ: default · hover (ยกขอบ) · focus · **sample** (มี `SampleBadge`) · deleting (จาง + spinner)

**GarmentForm** (เพิ่ม/แก้ไข)
- ฟิลด์เรียง: รูป → ชื่อ → หมวด → สี
- **ImageDropzone**: 1:1, เส้นประ, ข้อความ "ลากรูปมาวาง หรือเลือกไฟล์"
  - states: empty · dragover (ขอบ accent) · **loading** (spinner + "กำลังอ่านสีจากรูป…") · filled (พรีวิว + ปุ่มเปลี่ยน/ลบ) · **error** ("อ่านรูปไม่สำเร็จ ลองไฟล์อื่น" โดยฟอร์มยังใช้ต่อได้)
- **HexInput**: ช่องข้อความ + ColorSwatch(md) นำหน้า + `<input type="color">` เล็กๆ
  - ใต้ช่อง: helper `เดาสีจากรูปให้แล้ว แก้ค่าได้` (แสดงเฉพาะหลังดึงสีสำเร็จ)
  - states: default · focus · **auto-filled** (helper ข้างต้น) · invalid (ขอบ `--danger` + "ใส่รหัสสีเช่น #4A5D8A")
- **CategorySelect**: chip เลือกหมวด (ไม่ใช้ dropdown เพราะมีแค่ 5 ตัว → เห็นทั้งหมดเร็วกว่า)

### 3.6 การนำทางและการสื่อสาร

| Component | รายละเอียด | สถานะ |
|---|---|---|
| **Carousel** | แทร็ก `--surface-sunken` โปร่ง, การ์ดกลาง + peek 2 ข้าง; pan `--dur-pan`; รองรับ swipe + ปุ่ม + ลูกศรซ้าย/ขวาบนคีย์บอร์ด | idle · panning · reduced-motion (สลับทันที) |
| **PositionIndicator** | ข้อความ `ชุดที่ 2 จาก 4` (`--fs-sm`) เป็นตัวอักษร ไม่ใช่จุดสีอย่างเดียว | (ไม่มีสถานะอื่น) |
| **Banner** | แถบเต็มความกว้าง, `--r-md`, ไอคอน + ข้อความ + ปุ่มรอง | `info` (พื้น `--surface-sunken`) · `warning` (ขอบ accent, ไม่ถมพื้น) · `error` (ขอบ `--danger`) |
| **AutoSwitchNotice** | ข้อความ inline ใต้ ModeToggle `--fs-sm --ink-muted` + ไอคอน ⓘ | แสดงเฉพาะรอบที่ระบบสลับให้ ปิดได้ |
| **SampleBadge** | pill เล็ก `--fs-xs`, พื้น `--surface-sunken`, ขอบ `--line`, ข้อความ "ตัวอย่าง" | (ไม่มีสถานะอื่น) |
| **EmptyState** | ไอคอน/บล็อกสีจาง + หัวข้อ + คำอธิบาย + ปุ่มทางออก 1 ปุ่ม | ต่อ view |
| **InlineFeedback** | ข้อความสั้นใต้ปุ่ม + `aria-live="polite"` เช่น "สร้างชุดใหม่แล้ว" | auto-hide 2.5s |
| **ConfirmDialog** | โมดัลกลางจอ (`<dialog>`), ปุ่มลบใช้ `--danger` | ใช้กับลบชิ้น/ลบ favorite |
| **StickyNav** | `md`/`lg` แถบบน sticky สูง 56px พื้น `--bg` + เส้นล่าง `--line`; `sm` แท็บล่างติดจอ + `safe-area-inset` | default · active (ตัวอักษร `--ink` + ขีด `--accent` 2px) · focus-visible. ตั้ง active ด้วย `IntersectionObserver` |
| **Hero** | wordmark (`--fs-display`) + eyebrow + PrimaryButton + ปุ่มรอง | `sm` ลดระยะบน-ล่างเหลือ `--sp-6` |

---

## 4. หน้าจอทีละ view

### View A · แผงแนะนำ [P1]
- **A0 First-load:** Banner info บนสุด: *"นี่คือชุดตัวอย่างให้ลองเล่น เพิ่มเสื้อผ้าของคุณเพื่อดูชุดจากตู้จริง"* + GhostButton "ล้างตัวอย่าง"; ทุกการ์ดมี `SampleBadge`
- **A1 Idea mode:** CategoryTile = บล็อกสีล้วน; หัวการ์ด eyebrow = ชื่อ rule
- **A2 Wardrobe mode:** CategoryTile = รูปจริง/บล็อกสี
- **A3 Insufficient:** แทน Carousel ด้วย EmptyState: *"ยังขาด{หมวด} เพิ่มอีกนิดเพื่อจัดชุดจากตู้"* + PrimaryButton "เพิ่ม{หมวด}" + GhostButton "ดูไอเดียสีแทน" (สลับโหมด)
- **A4 No-match:** EmptyState + ปุ่ม "ผ่อนเงื่อนไข" / "สลับไปโหมดไอเดีย"
- **A5 Transition:** pan; ปุ่มเจนใหม่เข้าสถานะ loading; หลังเสร็จ InlineFeedback "สร้างชุดใหม่แล้ว"

### View B · ตู้เสื้อผ้า [P1]
- **B0 Empty:** EmptyState "ตู้ยังว่าง" + PrimaryButton "+ เพิ่มเสื้อผ้าชิ้นแรก"
- **B1 มีของ:** กริด GarmentChip · หัวข้อแสดงจำนวน "12 ชิ้น"
- **B2 Form:** เปิดเป็น inline panel (มือถือ = แผ่นเลื่อนขึ้นเต็มจอ)
- **B3/B4:** ตามสถานะ ImageDropzone/HexInput + Banner สำหรับ storage/quota
  - Storage blocked → Banner warning ค้างบนสุดของ section
  - Quota เต็ม → Banner warning "พื้นที่เต็ม บันทึกชิ้นนี้แบบไม่มีรูปให้แล้ว"

### View C · การกระทำบนการ์ด [P1-P2]
- Favorite (มุมขวาบนการ์ด), Swap (มุม tile, โผล่ตอน hover/focus)

### View D · บันทึกไว้ [P2]
- กริดการ์ดย่อ (ProportionBar + ชื่อ) · D0 EmptyState · D2 Banner "ครบ 20 ชุดแล้ว ลบชุดเก่าก่อน"

### View E · วิเคราะห์ตู้ [P3]
- **E0:** EmptyState "ข้อมูลยังน้อยเกินไปจะสรุปได้" (ไม่เดาสุ่ม)
- **E1 ColorShareBar:** แถบแนวนอนเรียงจากมากไปน้อย โดย **fill = สีจริงของเสื้อผ้า** + ring `--data-ring` + ป้าย `ชื่อสี · %` ด้านนอกแถบ (ตัวอักษรสี ink)
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

- **peek ต้องมี wrapper ครอบ carousel** (ตัดสินตอนสร้าง): `padding` ที่เป็น % อ้างอิงความกว้างของกล่องแม่ ไม่ใช่ `max-width` ของตัวเอง ถ้าใส่ `max-width` ที่ตัว carousel เอง padding จะคิดจากความกว้างเต็มแล้ว peek เพี้ยน (วัดได้ 256px ข้างหนึ่ง และติดลบ 88px อีกข้าง) โครงที่ถูกคือ `.carousel-wrap` ถือ `max-width: card-w + 2*(peek + gap)` แล้ว `.carousel` กว้าง 100% ของ wrapper
- `sm` ให้ carousel **เต็มขอบจอ** ด้วย margin ติดลบเท่าระยะขอบ container จึงได้ peek 7vw ตามที่ตั้งไว้ (86vw + 7vw สองข้าง = 100vw)
- **หน้าไม่เลื่อนแนวนอน** เด็ดขาด: แถว OccasionChips และ carousel เลื่อนภายในกล่องตัวเอง (`overflow-x:auto`)
- ตัวอักษรใช้ `clamp()` เฉพาะ display; ที่เหลือคงที่เพื่อความคาดเดาได้

---

## 6. Accessibility

- **โฟกัส:** `outline: 2px solid --focus; outline-offset: 2px` เห็นได้ทั้งสองธีม ทุก control ที่กดได้
- **Touch target >= 44x44** (IconSquareButton, Favorite, Swap) · chip และ ModeToggle สูง 36-38 แต่ขยายพื้นที่แตะเป็น 44 ด้วย `::after` ที่ขยาย**แนวตั้งเท่านั้น** (ขยายแนวนอนด้วยจะทำให้พื้นที่แตะของปุ่มข้างกันทับกัน)
- **ไม่สื่อด้วยสีอย่างเดียว:** ทุก swatch/tile/segment มี ชื่อสี + hex + role เป็นข้อความ; ModeToggle ที่เลือกมีทั้งพื้นสีและ `aria-checked`
- **Carousel:** `role="group" aria-roledescription="carousel"`; การ์ดที่ไม่โฟกัส `aria-hidden="true"` + `inert`; ปุ่มมี `aria-label` ("ชุดก่อนหน้า"/"ชุดถัดไป"); ลูกศรซ้าย-ขวาใช้ได้เมื่อโฟกัสอยู่ในแทร็ก
- **aria-live:** ผลลัพธ์ที่เปลี่ยน (แบตช์ใหม่, auto-switch, บันทึกแล้ว) ประกาศผ่าน `aria-live="polite"` หนึ่งจุดต่อ section
- **คอนทราสต์ (วัดจริงแล้ว ไม่ใช่ค่าประมาณ):**

  | คู่สี | ค่าจริง (light / dark) | เกณฑ์ | ผล |
  |---|---|---|---|
  | `--ink` บน `--surface` | 18.01 / 15.19 | 4.5 | ผ่าน |
  | `--ink-muted` บน `--surface` | 5.31 / 6.75 | 4.5 | ผ่าน |
  | `--ink-muted` บน `--bg` (light) | 5.08 | 4.5 | ผ่าน |
  | `--accent-ink` บน `--accent-solid` | 5.41 / 5.47 | 4.5 | ผ่าน |
  | eyebrow `--accent-solid` บน `--bg` | 5.18 / 5.62 | 4.5 | ผ่าน |
  | `--danger` บน `--surface` | 6.54 / 10.03 | 4.5 | ผ่าน |
  | focus ring `--accent` บน `--bg` | 4.07 / 5.62 | 3.0 | ผ่าน |

  คำนวณด้วยสูตร WCAG relative luminance ที่อยู่ในตัวแอปเอง (`contrastRatio()`) และมีเทสต์กำกับที่ `tests/engine-test.js`
- **สีข้อมูลไม่ถูกบังคับให้ผ่านคอนทราสต์** (มันคือค่าจริงของเสื้อผ้า) จึงชดเชยด้วย ring + ป้ายข้อความเสมอ
- **reduced-motion:** ตัด pan/scale/fade ทั้งหมด

---

## 7. ทดสอบกับข้อมูลจริง (ไม่ใช่ placeholder สวยๆ)

| เคสจริง | สิ่งที่ระบบภาพต้องรอด |
|---|---|
| เสื้อสีขาว `#FFFFFF` บนการ์ดขาว | `--data-ring` ทำให้ยังเห็นรูปทรง |
| เสื้อสีดำ `#111` ในโหมดมืด | ring สว่างขึ้น `rgba(255,255,255,.20)` |
| เสื้อสีแดงใกล้ `--accent` | swatch อยู่ใน tile มีขอบ + ป้าย; CTA เป็นปุ่มทรงต่างกันชัด ไม่สับสน |
| กางเกง+เสื้อสีใกล้กันมาก | ช่องว่าง 2px ใน ProportionBar แยกให้เห็นสองก้อน |
| ชื่อชิ้น "เสื้อเชิ้ตลินินแขนยาวสีครีมตัวโปรด" | ตัด 2 บรรทัดด้วย `-webkit-line-clamp` + `title` เต็ม |
| ชุดมี 5 ชิ้น → 5 สี | segment เล็กสุดกว้างอย่างน้อย 6px, label ไปอยู่ legend |
| ตู้มี 60 ชิ้น | กริด virtual ไม่จำเป็น แต่รูปใช้ `loading="lazy"` |
| ข้อความไทยยาวกว่าอังกฤษ | ปุ่มไม่ fix width, ใช้ padding + `white-space: nowrap` เฉพาะ chip |

---

## 8. ส่งต่อการสร้าง (เฟส 1)

**ต้องมีในเฟส 1:** tokens ทั้งชุด · PrimaryButton/SecondaryButton/GhostButton/IconSquareButton · ModeToggle + AutoSwitchNotice · OccasionChips · Carousel + PositionIndicator · OutfitCard + CategoryTile · ColorSwatch · ProportionBar (+legend, tooltip) · AdviceList · GarmentChip/GarmentGrid · GarmentForm (ImageDropzone, HexInput, CategorySelect) · Banner · SampleBadge · EmptyState · InlineFeedback · ConfirmDialog

**เลื่อนไปเฟสหลัง:** FavoriteButton/SwapControl [P2] · ColorShareBar/DiversityBar [P3]

---
*ทุกค่าที่ระบุมีเหตุผลกำกับ ไม่มีการตั้งค่าตามอำเภอใจ ถ้าจะเปลี่ยนค่าไหน ให้เปลี่ยนที่ token แล้วมันจะไหลทั้งระบบ*


---

## 9. สิ่งที่เปลี่ยนตอนสร้างจริง (เฟส 1)

เอกสารฉบับนี้ถูกอัปเดตหลังเขียนโค้ดจริง ทุกข้อด้านล่างมาจากการวัด/รันจริง ไม่ใช่การทบทวนบนกระดาษ

| # | เดิม | หลังสร้าง | ทำไม |
|---|---|---|---|
| 1 | `--accent` ใช้ได้ทั้งพื้นปุ่มและ eyebrow | แยก `--accent-solid` ออกมา | วัดแล้ว `#E23A4E` ให้ 4.24:1 (พื้น) และ 4.07:1 (ตัวอักษร) ไม่ผ่าน AA |
| 2 | `--data-gap` = `--surface` | เปลี่ยนเป็น `--pb-bg` ที่ตั้งใน scope คอมโพเนนต์ | ให้แถบย้ายไปวางบนพื้นสีอื่นได้โดยช่องว่างไม่เพี้ยน |
| 3 | ป้ายใต้ tile 2 บรรทัด | 3 บรรทัด และ hex ห้ามถูกตัด | 2 บรรทัดทำให้ข้อความ 166px ล้นช่อง 104px ไปทับ tile ข้างๆ |
| 4 | ปุ่มแก้ไข/ลบ 2 ปุ่มเล็กที่มุมการ์ด | ปุ่ม `⋯` เดียว 44x44 เปิดเมนู (กลับไปตามที่ §3.5 เขียนไว้แต่แรก) | พื้นที่แตะ 44px ของสองปุ่มทับกัน เสี่ยงกด "ลบ" แทน "แก้ไข" |
| 5 | tooltip อย่างเดียวบน ProportionBar | legend เป็นทางเข้าหลัก + tooltip เฉพาะ pointer ที่ hover ได้ | จอสัมผัสไม่มี hover |
| 6 | ไม่มี StickyNav/Hero ใน inventory | เพิ่มเข้า §3.6 พร้อมสถานะ | ทั้งคู่อยู่ใน §2 และ §5 แต่ตกจากรายการคอมโพเนนต์ |
| 7 | `max-width` ที่ตัว carousel | ใส่ `.carousel-wrap` ครอบ | padding แบบ % อ้างอิงกล่องแม่ ทำให้ peek เพี้ยนไปข้างเดียว |
| 8 | ค่าคอนทราสต์เป็นค่าประมาณ | ตารางค่าจริงใน §6 | ตามที่เอกสารเดิมสั่งไว้ว่า "ตรวจจริงตอนสร้าง" |

**ที่ยังไม่ปิด:** dog-ear มุมการ์ดยังไม่ได้ใส่ (ตัดสินว่าเพิ่มความซับซ้อนของ `clip-path` โดยไม่ได้เพิ่มความเข้าใจให้ผู้ใช้ ถ้าอยากได้ค่อยเปิดทีหลัง) · "ผ่อนเงื่อนไข" ใน No-match (A4) ยังเป็นแค่ปุ่มสลับโหมด เพราะ No-match เกิดจริงตอนมี FR-5 ในเฟส 3
