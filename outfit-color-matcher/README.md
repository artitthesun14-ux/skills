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
node tests/engine-test.js     # engine + คอนทราสต์ ไม่ต้องใช้เบราว์เซอร์
node tests/browser-test.js    # acceptance criteria ผ่านเบราว์เซอร์จริง + เก็บภาพหน้าจอ
node tests/image-test.js      # ดึงสีจากรูป, แก้ไขโดยไม่แตะรูป, localStorage เต็ม
```

`engine-test.js` ใช้ node ล้วน วิ่งได้ทันที (มันดึงโค้ดจาก `app.html` โดยตรง จึงทดสอบของจริงเสมอ)

อีกสองตัวต้องมี `playwright-core` และ Chromium:

```bash
npm i playwright-core --no-save
node tests/browser-test.js     # จะหา Chromium ที่ /opt/pw-browsers/chromium
```

## ขอบเขตตอนนี้

เฟส 1: ตู้เสื้อผ้า + engine จับคู่สี + หน้าแนะนำชุดสองโหมด (`สีที่เราแนะนำ` / `จากตู้ของฉัน`)
เฟส 2-3 (สลับทีละชิ้น, ชุดโปรด, วิเคราะห์ตู้) ดูแผนใน `PROJECT_STATE.md`

เอกสารทั้งหมดอยู่ใน `docs/`
