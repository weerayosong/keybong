# ⌨️ Keybong - Minimalist Typing Practice for ~~Slow Typer~~ Me 🥹

[Live Preview](https://keybong.vercel.app/)

แอปพลิเคชันฝึกพิมพ์ที่ออกแบบและพัฒนาขึ้นมาเพื่อ **Software Developers** โดยเฉพาะ สร้างขึ้นเพื่อแก้ปัญหาการฝึกพิมพ์ด้วยคำศัพท์ทั่วไปที่ไม่ตอบโจทย์การเขียนโค้ด และลบความน่าหงุดหงิดของระบบอัลกอริทึมที่เข้มงวดเกินไปในแอปฝึกพิมพ์แบบดั้งเดิม

![pandy](https://github.com/weerayosong/weerayosong.github.io/blob/main/images/mini11.png?raw=true)

โปรเจกต์นี้เน้นความเรียบง่าย (Minimalist) ทำงานบนเบราว์เซอร์ 100% โดยไม่ต้องพึ่งพา Build Tools หรือ Framework ที่ซับซ้อน

## ✨ Features (ฟีเจอร์เด่น)

- 🎯 **Customizable Progression:** ไม่ต้องรอระบบปลดล็อคให้อีกต่อไป คุณสามารถตั้งค่าเป้าหมายความแม่นยำ (Target Accuracy) และจำนวนรอบที่ต้องผ่าน (Target Streak) ได้เอง หรือจะคลิกขวาเพื่อเปิด-ปิดตัวอักษรแบบแมนนวลก็ได้
- 💻 **Programmer's Dictionary:** ฐานข้อมูลคำศัพท์ที่ออกแบบมาเพื่อคนเขียนโค้ด หมดปัญหาการฝึกพิมพ์ตัวอักษร `Q`, `J`, `Z`, `X` แบบไร้ความหมาย คลังคำศัพท์จะเน้นไปที่ Syntax และ Keyword สำคัญๆ เช่น `query`, `json`, `flex`, `ajax`, `async`
- 🎧 **Zen Mode & Mechanical Sounds (Web Audio API):**
    - **Mechanical Thock:** จำลองเสียงสวิตช์คีย์บอร์ดที่นุ่มและแน่น ช่วยให้จังหวะการพิมพ์ (Rhythm) แม่นยำขึ้น
    - **Binaural Beats (432Hz):** ปล่อยคลื่นความถี่แยกซ้าย-ขวาเพื่อสร้างคลื่น Theta ในสมอง ช่วยดึงคุณเข้าสู่สภาวะ Deep Work และมีสมาธิยาวนานขึ้น
- 👁️ **Eye-Level UI:** ออกแบบ UI ให้พื้นที่ฝึกพิมพ์ลอยอยู่ในระดับสายตา และซ่อนองค์ประกอบที่ไม่จำเป็น เพื่อลดอาการล้าจากการเพ่งสายตา
- 🚫 **Strict Accuracy Tracking:** ระบบคำนวณความแม่นยำแบบไร้การฟื้นฟู (No-recovery accuracy) พิมพ์ผิด 1 ครั้งหักคะแนนทันที เพื่อสร้างความคุ้นเคยกับความกดดันในการเขียนโค้ดจริง

## 🛠️ Tech Stack

- **HTML5** (Structure)
- **Tailwind CSS v4** via Browser CDN (Styling)
- **Vanilla JavaScript** (Logic & Web Audio API)

## 🚀 Getting Started (วิธีใช้งาน)

เนื่องจากโปรเจกต์นี้เขียนด้วย Vanilla JS และทำงานฝั่ง Client-Side 100% จึงไม่ต้องใช้การติดตั้งใดๆ

1. Clone Repository นี้
2. เปิดไฟล์ `index.html` ผ่านเว็บบราวเซอร์ของคุณ (แนะนำให้เปิดผ่าน Live Server ใน VS Code เพื่อประสบการณ์ที่ดีที่สุด)
3. ปรับแต่งเป้าหมายความแม่นยำ เลือกตัวอักษรที่ต้องการโฟกัส และเริ่มฝึกพิมพ์ได้ทันที!

## 📂 File Structure

- `index.html` - โครงสร้างหน้าเว็บ UI และการดึง Tailwind CSS
- `data.js` - คลังคำศัพท์ภาษาอังกฤษและคีย์เวิร์ดสำหรับการเขียนโปรแกรม
- `script.js` - ระบบตรรกะทั้งหมด ตั้งแต่การสุ่มคำ, การคำนวณสถิติ, Auto-focus, และระบบเสียงสังเคราะห์

## 📝 How to add/custom your own words (วิธีเพิ่มคำศัพท์)

คุณสามารถเพิ่มคำศัพท์เฉพาะทางที่คุณใช้บ่อย (เช่น ชื่อตัวแปร, Framework keywords) เข้าไปในไฟล์ `data.js` ได้โดยตรง ระบบจะทำการฟิลเตอร์คำเหล่านั้นมาให้ฝึกอัตโนมัติตามตัวอักษรที่คุณเปิดใช้งานอยู่

---

_May the typing speed be with you._
