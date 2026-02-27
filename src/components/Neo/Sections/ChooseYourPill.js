import React from "react";
import "./ChooseYourPill.css";
import pillImage from "./ChooseYourPill.png";

export default function ChooseYourPill({ selected, onSelect }) {
  return (
    <div className="choose-your-pill-container">

      {/* Image with clickable halves */}
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

      {/* Expanding text below the image */}
      {selected && (
        <div className={`pill-info ${selected}`} dir="ltr">
          {selected === "red" ? (
            <>
              <h2>🟥 The Red Pill – The Right Choice</h2>
              <p>
                This is the choice for those ready to look reality in the eye.
                Understanding that a degree alone isn't enough, that the system isn't built for juniors,
                and if you don't create your own experience – no one will do it for you.
              </p>
              <p>
                The Red Pill is an active choice:
                Taking control, building real value,
                and stopping waiting for someone to "discover you".
              </p>
            </>
          ) : (
            <>
              <h2>🟦 The Blue Pill – The Comfortable Choice</h2>
              <p>
                This is the choice that feels safe,
                but keeps you dependent on the system.
                Continuing to send resumes, believing that enough time and motivation will suffice –
                and hoping someone will give you a chance.
              </p>
              <p>
                The Blue Pill is calming,
                but it doesn't move you forward.
                It keeps you in the comfort zone – even if it costs years of waiting.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
