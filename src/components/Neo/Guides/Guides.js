// === File: Guides.jsx ===
import React from "react";
import "./Guides.css";
import GuidesCube from "./GuidesCube";

export default function Guides() {
  return (
    <div className="guides-page">
      <header className="guides-header">
        <h1 className="guides-title">Interactive Rubik’s Cube</h1>
        <p className="guides-subtitle">
          Drag background to orbit • Click a cubie then drag to rotate its layer • Three buttons below.
        </p>
      </header>

      <main className="guides-stage" role="main" aria-label="Rubik's cube stage">
        <GuidesCube width={1180} height={620} scramble />
      </main>

      <footer className="guides-footer">
        <div className="legend">
          <span className="legend-text">
            Tip: Wheel to zoom • Keyboard U D L R F B (+Shift for prime, Alt/⌘ for double) • Right click or hold Space = orbit.
          </span>
        </div>
      </footer>
    </div>
  );
}
