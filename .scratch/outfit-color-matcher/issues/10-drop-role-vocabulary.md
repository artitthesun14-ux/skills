# 10: เลิกพูดศัพท์ role (สีหลัก/สีรอง/สีกลาง/สีเน้น) กับผู้ใช้

**What to build:** `ROLE_TH` ยังอยู่ในโมเดลข้อมูล/engine เหมือนเดิม (Color Role คือวิธีที่ engine
เลือกและถ่วงสี) แต่เลิกแสดงคำพวกนี้ในหน้า เหลือ ชื่อสี + hex + % เท่านั้น

**Blocked by:** None

**Status:** done (เฟส 4-C)

- [x] `pbarHTML` legend ไม่มี `.pbar__role` อีกต่อไป
- [x] `title` และ `aria-label` ของ segment ไม่มีคำ role
- [x] `colorBreakdown[].role` ยังอยู่ครบในข้อมูล (engine ใช้ต่อ)
- [x] คำว่า "สีหลัก"/"สีเน้น" ใน `buildAdvice()` ยังอยู่ได้ เพราะเป็นประโยคบรรยายธรรมชาติ ไม่ใช่ป้าย taxonomy
