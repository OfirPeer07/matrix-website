import React from 'react';
import './RedOrBluePill.css';
import '../../../styles/sections/Sections.css';


const RedOrBluePhil = () => {
  return (
    <div className="text-content">
      <div className="text-box">
        <div className="inner-box" dir="rtl">
          <h2>באיזה כדור תבחר?</h2>

          <p>
            גם בהייטק הבחירה הזו רלוונטית
            כשהסטודנט מסיים את הלימודים, הוא עומד מול אותה הבחירה:
          </p>

          <p>
            🟦 <strong>הכדור הכחול</strong> – להאמין שעם קו"ח יפים, מוטיבציה וזמן – תגיע המשרה.<br />
            לחיות באשליה חלקית: שהמערכת תראה אותך, שמספיק "לנסות חזק" כדי שזה יקרה.
          </p>

          <p>
            🟥 <strong>הכדור האדום</strong> – לראות את המציאות כמו שהיא: שרוב החברות מחפשות עובדים עם ניסיון תעסוקתי.<br />
            כך שהג'וניורים נופלים בין הכיסאות ולהבין שהמערכת לא בנויה בשבילך.
          </p>
          <h3>במה אתה בוחר?</h3>
        </div>
      </div>
    </div>
  );
};

export default RedOrBluePhil;
