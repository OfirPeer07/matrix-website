import React from "react";
import "./ChooseYourPill.css";
import pillImage from "./ChooseYourPill.png";

export default function ChooseYourPill({ selected, onSelect }) {
  return (
    <div className="choose-your-pill-container">

      {/* תמונה עם חצאי לחיצה */}
      <div className="pill-image-wrapper">

        <div
          className={`half left ${selected === "red" ? "selected-red" : ""}`}
          onClick={() => onSelect("red")}
        />

        <div
          className={`half right ${selected === "blue" ? "selected-blue" : ""}`}
          onClick={() => onSelect("blue")}
        />

        <img
          src={pillImage}
          alt="Choose your pill"
          className="full-image"
        />
      </div>

      {/* טקסט נפתח מתחת לתמונה */}
      {selected && (
        <div className={`pill-info ${selected}`} dir="rtl">
          {selected === "red" ? (
            <>
              <h2>🟥 הכדור האדום – הבחירה הנכונה</h2>
              <p>
                זו הבחירה של מי שמוכן להסתכל למציאות בעיניים.
                להבין שהתואר לבדו לא מספיק, שהמערכת לא בנויה לג׳וניורים,
                ושאם לא תיצור לעצמך ניסיון – אף אחד לא יעשה את זה בשבילך.
              </p>
              <p>
                הכדור האדום הוא בחירה אקטיבית:
                לקחת שליטה, לבנות ערך אמיתי,
                ולהפסיק לחכות שמישהו “יגלה אותך”.
              </p>
            </>
          ) : (
            <>
              <h2>🟦 הכדור הכחול – הבחירה הנוחה</h2>
              <p>
                זו הבחירה שמרגישה בטוחה,
                אבל משאירה אותך תלוי במערכת.
                להמשיך לשלוח קו״ח, להאמין שמספיק זמן ומוטיבציה –
                ולקוות שמישהו ייתן לך צ׳אנס.
              </p>
              <p>
                הכדור הכחול מרגיע,
                אבל לא מקדם.
                הוא שומר אותך באזור הנוחות – גם אם זה עולה בשנים של המתנה.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
