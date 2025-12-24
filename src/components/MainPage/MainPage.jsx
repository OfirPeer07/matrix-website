import React, { useState, useCallback, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import { applyTheme } from "./Theme";
import neoClick from "./neo.png";
import agentSmithClick from "./agentSmith.png";

import MatrixRainCanvas from "./MatrixRainCanvas";
import LightRevealGrid from "./LightRevealGrid";
import ControlPanel from "./ControlPanel";
import Title from "./Title";

/* ===== defaults ===== */
const DEFAULT_SETTINGS = {
  bg: "#000000",
  text: "#ffffff",
  muted: "#dddddd",
  accent: "#22c55e",

  cellColor: "#000000",
  cell: 88,
  gap: 14,
  radius: 12,
  baseAlpha: 0.5,

  lightStyle: "lamp",
  falloff: 240,
  beams: 4,
  beamStrength: 0.85,
  beamSoft: 0.35,
  edgeBoost: 0.25,

  rainSpeed: 20,
  rainDensity: 0.65,
  rainFont: 18,
  rainGlow: 0.35,
  rainFps: 32,
};

/* Persistent settings (localStorage) */
function usePersistentSettings(key, initial) {
  const [state, setState] = useState(() => {
    try {
      return { ...initial, ...JSON.parse(localStorage.getItem(key) || "{}") };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    let t = window.requestIdleCallback
      ? requestIdleCallback(() =>
          localStorage.setItem(key, JSON.stringify(state))
        )
      : setTimeout(
          () => localStorage.setItem(key, JSON.stringify(state)),
          120
        );

    return () => {
      if (typeof t === "number") clearTimeout(t);
      else cancelIdleCallback?.(t);
    };
  }, [key, state]);

  return [state, setState];
}

const MainPage = () => {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = usePersistentSettings(
    "matrix-demo-settings",
    DEFAULT_SETTINGS
  );

  const navigate = useNavigate();
  const headingId = useId();

  /* Apply Theme */
  useEffect(() => {
    applyTheme({
      bg: settings.bg,
      text: settings.text,
      muted: "#dddddd",
      accent: settings.accent,
    });
  }, [settings.bg, settings.text, settings.accent]);

  /* Hotkeys */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Navigation */
  const activate = useCallback(
    (type) => {
      if (busy) return;
      setBusy(true);
      navigate(type === "Neo" ? "/neo" : "/agent-smith");
    },
    [busy, navigate]
  );

  const reset = () => setSettings(DEFAULT_SETTINGS);

  return (
    <div className="main-page" aria-labelledby={headingId}>
      {/* Floating open/close buttons */}
      <button
        className="fab open-drawer-btn"
        onClick={() => setOpen(true)}
        aria-label="Open customization panel (Ctrl+,)"
      >
        ⚙️
      </button>

      <button
        className={`fab close-drawer-btn ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
        aria-label="Close customization panel (Esc)"
      >
        ✕
      </button>

      {/* Backdrop */}
      <div
        className={`scrim ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Matrix Rain */}
      <MatrixRainCanvas
        color={settings.accent}
        glow={settings.rainGlow}
        fontSize={settings.rainFont}
        speed={settings.rainSpeed}
        density={settings.rainDensity}
        fps={settings.rainFps}
      />

      {/* Light Grid */}
      <LightRevealGrid
        cell={settings.cell}
        gap={settings.gap}
        radius={settings.radius}
        baseAlpha={settings.baseAlpha}
        falloff={settings.falloff}
        beams={settings.beams}
        rimColor={settings.accent}
        lightStyle={settings.lightStyle}
        beamStrength={settings.beamStrength}
        beamSoft={settings.beamSoft}
        edgeBoost={settings.edgeBoost}
        pointerLerp={0.18}
        cellColor={settings.cellColor}
      />

      <Title id={headingId} />

      {/* Character Cards */}
      <main className="cards">
        <section className="card-wrap" aria-label="Agent Smith card">
          <button
            type="button"
            className="image-button"
            onClick={() => activate("agentSmith")}
            aria-describedby="agent-smith-caption"
            disabled={busy}
          >
            <div className="media-holder">
              <img
                className="media"
                src={agentSmithClick}
                alt="Agent Smith"
                loading="lazy"
              />
            </div>
          </button>
          <div id="agent-smith-caption" className="title-box">
            <h2 className="photo-title">Agent Smith</h2>
            <p className="photo-subtitle">
              Innovate with cutting-edge agentSmith solutions.
            </p>
          </div>
        </section>

        <section className="card-wrap" aria-label="Neo card">
          <button
            type="button"
            className="image-button"
            onClick={() => activate("Neo")}
            aria-describedby="neo-caption"
            disabled={busy}
          >
            <div className="media-holder">
              <img
                className="media"
                src={neoClick}
                alt="Neo"
                loading="lazy"
              />
            </div>
          </button>
          <div id="neo-caption" className="title-box">
            <h2 className="photo-title">Neo</h2>
            <p className="photo-subtitle">
              Secure the future with advanced cybersecurity.
            </p>
          </div>
        </section>
      </main>

      {/* Control Panel — FIXED! */}
      <ControlPanel
        open={open}
        setOpen={setOpen}
        settings={settings}
        setSettings={setSettings}
        onReset={reset}
      />
    </div>
  );
};

export default MainPage;
