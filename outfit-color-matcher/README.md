# Outfit Color Matcher

เว็บหน้าเดียวที่เสนอชุดซึ่งสีเข้ากันให้ทันที พร้อมสัดส่วนสีและคำแนะนำอิงทฤษฎีสี **ไม่มีคะแนน ไม่ตัดสินการแต่งตัว**

## ใช้งาน

เปิด `outfit-color-matcher.html` ด้วยเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไร ไม่ต้องต่อเน็ต

## แก้โค้ด

แหล่งความจริงคือ `app.html` (รูปแบบ artifact: ไม่มี `doctype`/`head`/`body`) แก้ไฟล์นี้แล้วรัน:

```bash
./build.sh
```

จะได้ `outfit-color-matcher.html` ที่เปิดตรงๆ ได้ **อย่าแก้ไฟล์ผลลัพธ์โดยตรง เพราะจะถูกเขียนทับ**

## เทสต์

```bash
npm i playwright-core --no-save     # ครั้งแรกครั้งเดียว (browser test ต้องใช้)
./build.sh                          # เทสต์เบราว์เซอร์วิ่งบนไฟล์ที่ build แล้ว

node tests/engine-test.js       # engine + คอนทราสต์ ไม่ต้องใช้เบราว์เซอร์
node tests/shape-test.js        # ทะเบียนทรง SVG, fallback, สีเส้นตามความสว่าง, invariant ของ engine
node tests/migration-test.js    # ข้อมูลผู้ใช้เวอร์ชันเก่า, shapeId ที่ไม่รู้จัก
node tests/ac-test.js           # acceptance criteria ของ FR-0/FR-1 และสถานะใน spec §7C
node tests/a11y-test.js         # คอนทราสต์จริงในหน้า, คีย์บอร์ด, touch target, ธีม, responsive
node tests/regress.js           # ยิงซ้ำ 700 แบตช์ ทุกโหมด x ทุกโอกาส ตรวจ invariant ทุกชุด
node tests/browser-test.js      # acceptance ผ่านเบราว์เซอร์จริง + เก็บภาพหน้าจอ
```

`engine-test.js` ใช้ node ล้วน วิ่งได้ทันที (ดึงโค้ดจาก `app.html` โดยตรง จึงทดสอบของจริงเสมอ)
ที่เหลือต้องมี `playwright-core` และ Chromium (หาที่ `/opt/pw-browsers/chromium`)

รวมทั้งหมด 331 ข้อ (engine 90 · shape 17 · migration 10 · ac 120 · a11y 20 · regress 2 · browser 72)
ปัจจุบันผ่านหมด ต้องเขียวทุกชุดก่อนทุกครั้งที่จะ publish

## ขอบเขตตอนนี้

เฟส 1-4 ปิดครบหมดแล้ว: ตู้เสื้อผ้า + engine จับคู่สี + แนะนำชุดสองโหมด + สลับทีละชิ้น (มีคำแนะนำ + สีที่น่าจะเข้ากัน)
+ บันทึกชุดโปรด (สูงสุด 20) + วิเคราะห์ตู้ + เลือกสีก่อน + จัดชุดอิสระไม่บังคับบน+ล่าง + ธีมพื้นหลังไดนามิก
+ มุมมองจัดกลุ่มสีตามโทน + ดีไซน์ Collage Art Style รายละเอียดครบใน `PROJECT_STATE.md`

เอกสารทั้งหมดอยู่ใน `docs/` ถ้าเป็นเซสชันใหม่ที่มาทำงานต่อ ให้อ่าน `PROJECT_STATE.md` ก่อน
