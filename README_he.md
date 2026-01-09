# 🟩 קצת על האתר

אפליקציית ווב מבוססת React בהשראת *Matrix* המשלבת **ממשק משתמש אינטראקטיבי**, **ויזואליות תלת־ממדית**, ו־**יצירת מסמכים דינמית**.  
הפרויקט נבנה כפרויקט Frontend מעשי לצורך חקירה ולמידה של דפוסי React מודרניים, אנימציות וממשקי משתמש יצירתיים.

---

## 🚀 סקירת הפרויקט

<div dir="rtl">

<span dir="ltr">Matrix Website</span> היא אפליקציית <span dir="ltr">React</span> ממוקדת <span dir="ltr">Frontend</span> עם זהות ויזואלית חזקה בהשראת <span dir="ltr">The Matrix</span>.  
הפרויקט מדגיש **ארכיטקטורה מבוססת קומפוננטות**, **תנועה ואפקטים**, ו־**פיצ’רים מוכווני משתמש** כגון תצוגת תוכן וייצוא לקובץ <span dir="ltr">PDF</span>.

הוא פותח כפרויקט אישי עם דגש על למידה, ניסוי וטעייה, והרכבת ממשק משתמש נקי וברור.

</div>

---

## ✨ תכונות עיקריות

- 🎬 ויזואליות ונכסים בהשראת Matrix
- 🧩 מבנה קומפוננטות מודולרי ב־React
- 🎥 אנימציות באמצעות **Framer Motion**
- 🌐 אלמנטים תלת־ממדיים מבוססי **Three.js** (`@react-three/fiber`, `@react-three/drei`)
- 📄 עיצוב תצוגת קורות חיים / מסמכים (מסך והדפסה)
- 🖨️ ייצוא תוכן ל־PDF באמצעות **html2canvas** ו־**jsPDF**
- 📱 עיצוב רספונסיבי ומבנה סגנונות מסודר

---
<div dir="rtl">

## 🛠️ טכנולוגיות בשימוש

- **<span dir="ltr">React</span>** (<span dir="ltr">Create React App</span>)
- **<span dir="ltr">Framer Motion</span>** – אנימציות ומעברים
- **<span dir="ltr">Three.js</span>** באמצעות `<span dir="ltr">@react-three/fiber</span>` ו־`<span dir="ltr">@react-three/drei</span>`
- **אפקטי <span dir="ltr">Postprocessing</span>** לשיפור הוויזואליות
- **<span dir="ltr">HTML2Canvas</span> & <span dir="ltr">jsPDF</span>** – יצירת <span dir="ltr">PDF</span> בצד הלקוח
- **<span dir="ltr">CSS Modules</span> וסגנונות מאורגנים**
- **<span dir="ltr">GitHub Pages</span>** לפריסה

</div>

---

## 📁 מבנה הפרויקט

```text
matrix-website/
├── public/
│   └── נכסים סטטיים ותוצרי build
├── src/
│   ├── assets/        # תמונות, אייקונים, מדיה
│   ├── components/    # קומפוננטות UI ופיצ’רים לשימוש חוזר
│   ├── styles/        # קבצי CSS מאורגנים לפי פיצ’ר
│   ├── index.js       # נקודת הכניסה של האפליקציה
│   └── index.css      # סגנונות גלובליים
├── package.json
└── README.md
```

## ▶️ התחלה

### דרישות מוקדמות
- Node.js (מומלץ גרסה 16 ומעלה)
- npm

### התקנה
```bash
npm install
```
### הרצה מקומית
```bash
npm start
```
האפליקציה תהיה זמינה בכתובת: 
http://localhost:3000

---

## 🌍 דמו חי

הפרויקט פרוס באמצעות GitHub Pages:
👉 https://ofirpeer07.github.io/matrix-website

---

## 🎯 מטרה ומוטיבציה

הפרויקט נבנה על מנת:

- לתרגל טכניקות Frontend מתקדמות ב־React
- להתנסות באנימציות וויזואליות תלת־ממדית
- לחקור רעיונות UI יצירתיים מעבר לפריסות סטנדרטיות
- לחזק עבודת Frontend ברמת פורטפוליו

---

## 🔮 שיפורים עתידיים אפשריים

- שיפור נגישות (ARIA, ניווט מקלדת)
- הוספת סצנות תלת־ממדיות אינטראקטיביות נוספות
- אופטימיזציית ביצועים למכשירים חלשים
- מעבר ל־CSS-in-JS או Tailwind
- הוספת בדיקות לקומפוננטות מרכזיות

---

## 👤 Author

**Ofir Peer | אופיר פאר**  
Frontend Developer | Frontend מפתח 

GitHub: https://github.com/OfirPeer07
