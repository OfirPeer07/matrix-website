import React from "react";
import { useLocaleContext } from "../../../context/LocaleContext";
import "./Videos.css";

const translations = {
  en: {
    alert: "SYSTEM ALERT: DEMO MODE",
    preview: "This construct is a limited preview.",
    fullAccess: "For full access, visit:",
    status: "DEMO"
  },
  he: {
    alert: "התרעת מערכת: מצב דמו",
    preview: "מבנה זה הוא תצוגה מקדימה מוגבלת.",
    fullAccess: "לגישה מלאה, בקר ב:",
    status: "דמו"
  }
};

const Videos = () => {
  const { locale } = useLocaleContext();
  const t = translations[locale];

  return (
    <div className="matrix-video-container">
      <div className="matrix-frame">
        <div className="matrix-screen">
          <div className="matrix-text">
            {t.alert}<br />
            {t.preview}
            <br />
            {t.fullAccess}<br />
            <a href="https://iez-computers.com/" target="_blank" rel="noopener noreferrer">
              iez-computers.com
            </a>
          </div>
        </div>
        <div className="matrix-controls">
          <span className="matrix-button">&#9658;</span>
          <div className="matrix-bar">
            <div className="matrix-fill"></div>
          </div>
          <span className="matrix-status">{t.status}</span>
        </div>
      </div>
    </div>
  );
};

export default Videos;
