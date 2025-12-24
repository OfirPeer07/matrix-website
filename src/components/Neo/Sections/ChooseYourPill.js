import React from "react";
import "../../../styles/Sections.css";
import pillImage from "./ChooseYourPill.png";

export default function ChooseYourPill({ selected, onSelect }) {
  return (
    <div>

      {/* HOT ZONES OVER IMAGE */}
      <div className="pill-image-wrapper">
        <div className="half left" onClick={() => onSelect("red")} />
        <div className="half right" onClick={() => onSelect("blue")} />

        <img src={pillImage} className="full-image" alt="Choose your pill" />
      </div>

      {/* RESULT MESSAGE */}
      {selected && (
        <div className={`pill-info ${selected}`} dir="rtl">
          <h2>{selected === "red" ? "הכדור האדום" : "הכדור הכחול"}</h2>
          <p>
            {selected === "red"
              ? "אתה בוחר לדעת את האמת, גם אם היא כואבת. המסע מתחיל עכשיו."
              : "אתה בוחר להישאר במערכת, במקום בטוח. הכול יישאר כמות שהוא."}
          </p>
        </div>
      )}
    </div>
  );
}
