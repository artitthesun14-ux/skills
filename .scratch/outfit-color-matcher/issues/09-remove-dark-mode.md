# 09: เอา Dark Mode ออกทั้งระบบ

**What to build:** แอปเหลือโหมดเดียว ลบ `data-theme` toggle, บล็อก `prefers-color-scheme: dark`,
ชุดโทเคน dark ทั้งหมด และปุ่มวนธีมในแถบนำทาง ค่า `state.theme` ที่เคยบันทึกไว้ใน localStorage
ของผู้ใช้เดิมกลายเป็น key ตายไปเฉยๆ ไม่ migrate ไม่เตือน

**Blocked by:** None (เริ่มได้ทันที เป็นงานแรกของเฟส C)

**Status:** done (เฟส 4-C)

- [x] ลบ `@media (prefers-color-scheme:dark)` และ `:root[data-theme="dark"]` ออกจาก CSS
- [x] ลบปุ่ม `#themeBtn` / `applyTheme()` / การอ่านเขียน `state.theme`
- [x] `PROJECT_STATE.md` §3 เอาบรรทัด light/dark ออกจากรายการ "ห้ามหลุด" (ไม่งั้นเอกสารขัดกันเอง)
- [x] `a11y-test.js` ลบ D7a (สลับธีม) และลูป `["light","dark"]` ของตาราง D1 ทิ้งจริง ไม่ใช่ปล่อยเขียวโดยบังเอิญ
- [x] `browser-test.js` ลบ viewport `desktop-dark` / `mobile-dark`
- [x] `engine-test.js` §1 ลบคู่คอนทราสต์ของโทเคน dark
