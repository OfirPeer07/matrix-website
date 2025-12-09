import React, { memo, useState, useCallback } from "react";
import "./ControlPanel.css";

/* ============================
   MATRIX PRESETS
============================ */
const PRESETS = {
  NeoBlue: {
    accent: "#14b8ff",
    cellColor: "#020617",
    bg: "#000000",
    text: "#ffffff",
    rainSpeed: 22,
    rainDensity: 0.58,
    rainFont: 18,
    rainGlow: 0.45,
    rainFps: 32,
    lightStyle: "backlight",
    falloff: 260,
    beamStrength: 0.9,
    beamSoft: 0.45,
    edgeBoost: 0.28,
    cell: 88,
    gap: 14,
    radius: 12,
    baseAlpha: 0.5,
  },

  Emerald: {
    accent: "#22c55e",
    cellColor: "#000000",
    bg: "#000000",
    text: "#ffffff",
    rainSpeed: 20,
    rainDensity: 0.65,
    rainFont: 18,
    rainGlow: 0.35,
    rainFps: 32,
    lightStyle: "backlight",
    falloff: 240,
    beamStrength: 0.85,
    beamSoft: 0.4,
    edgeBoost: 0.2,
    cell: 82,
    gap: 12,
    radius: 10,
    baseAlpha: 0.42,
  },

  ClassicMatrix: {
    accent: "#00ff66",
    cellColor: "#000000",
    bg: "#000000",
    text: "#ffffff",
    rainSpeed: 20,
    rainDensity: 0.75,
    rainFont: 16,
    rainGlow: 0.55,
    rainFps: 30,
    lightStyle: "beams",
    falloff: 260,
    beamStrength: 1.0,
    beamSoft: 0.5,
    edgeBoost: 0.0,
    cell: 92,
    gap: 14,
    radius: 8,
    baseAlpha: 0.6,
  },
};

/* ============================
   INPUT COMPONENTS
============================ */
const LabelRow = ({ label, value, after, children }) => (
  <div className="cp-row">
    <span className="cp-label">{label}</span>
    <div className="cp-input">{children}</div>
    {after !== undefined && <span className="cp-after">{after}</span>}
  </div>
);

const Range = ({ value, min, max, step, onChange }) => (
  <input
    type="range"
    className="cp-range"
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange(+e.target.value)}
  />
);

const ColorPicker = ({ value, onChange }) => (
  <input
    type="color"
    className="cp-color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

/* ============================
   COLLAPSIBLE GROUP SECTION
============================ */
const Group = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="cp-group">
      <button className="cp-group-head" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="cp-chevron">{open ? "▾" : "▸"}</span>
      </button>

      {open && <div className="cp-group-body">{children}</div>}
    </div>
  );
};

/* ============================
   MAIN CONTROL PANEL
============================ */
const ControlPanel = ({
  open,
  setOpen,
  settings,
  setSettings,
}) => {
  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, [setSettings]);

  const applyPreset = (name) => {
    if (PRESETS[name]) setSettings(PRESETS[name]);
  };

  return (
    <>
      {/* SCRIM */}
      <div
        className={`scrim ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* OPEN BUTTON */}
      {!open && (
        <button
          className="matrix-orb"
          onClick={() => setOpen(true)}
          aria-label="Open control panel"
        >
          <span className="orb-gear">⚙</span>
        </button>
      )}

      {/* PANEL */}
      <aside className={`matrix-panel ${open ? "open" : ""}`}>
        <header className="cp-header">
          <h2>System Configuration</h2>

          <div className="cp-header-actions">
            <select
              className="cp-preset-select"
              onChange={(e) => applyPreset(e.target.value)}
            >
              <option value="" disabled selected>
                Load Preset…
              </option>
              {Object.keys(PRESETS).map((p) => (
                <option value={p} key={p}>
                  {p}
                </option>
              ))}
            </select>

            <button className="cp-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="cp-content">

          {/* COLORS */}
          <Group title="Theme & Colors">
            <LabelRow label="Accent" after={settings.accent}>
              <ColorPicker
                value={settings.accent}
                onChange={(v) => update({ accent: v })}
              />
            </LabelRow>

            <LabelRow label="Cells" after={settings.cellColor}>
              <ColorPicker
                value={settings.cellColor}
                onChange={(v) => update({ cellColor: v })}
              />
            </LabelRow>

            <LabelRow label="Background" after={settings.bg}>
              <ColorPicker
                value={settings.bg}
                onChange={(v) => update({ bg: v })}
              />
            </LabelRow>

            <LabelRow label="Text" after={settings.text}>
              <ColorPicker
                value={settings.text}
                onChange={(v) => update({ text: v })}
              />
            </LabelRow>
          </Group>

          {/* MATRIX RAIN */}
          <Group title="Matrix Rain">
            <LabelRow label="Speed" after={settings.rainSpeed}>
              <Range
                value={settings.rainSpeed}
                min={5}
                max={60}
                step={1}
                onChange={(v) => update({ rainSpeed: v })}
              />
            </LabelRow>

            <LabelRow label="Density" after={settings.rainDensity.toFixed(2)}>
              <Range
                value={settings.rainDensity}
                min={0.1}
                max={1}
                step={0.01}
                onChange={(v) => update({ rainDensity: v })}
              />
            </LabelRow>

            <LabelRow label="Glyph size" after={settings.rainFont}>
              <Range
                value={settings.rainFont}
                min={10}
                max={32}
                step={1}
                onChange={(v) => update({ rainFont: v })}
              />
            </LabelRow>

            <LabelRow label="Glow" after={settings.rainGlow.toFixed(2)}>
              <Range
                value={settings.rainGlow}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => update({ rainGlow: v })}
              />
            </LabelRow>

            <LabelRow label="FPS" after={settings.rainFps}>
              <input
                type="number"
                className="cp-num"
                value={settings.rainFps}
                min={16}
                max={60}
                onChange={(e) => update({ rainFps: +e.target.value })}
              />
            </LabelRow>
          </Group>

          {/* BACKLIGHT */}
          <Group title="Backlight">
            <LabelRow label="Style">
              <select
                className="cp-select"
                value={settings.lightStyle}
                onChange={(e) => update({ lightStyle: e.target.value })}
              >
                <option value="backlight">Backlight</option>
                <option value="beams">Beams</option>
              </select>
            </LabelRow>

            <LabelRow label="Radius" after={settings.falloff}>
              <Range
                value={settings.falloff}
                min={120}
                max={680}
                step={5}
                onChange={(v) => update({ falloff: v })}
              />
            </LabelRow>

            <LabelRow
              label="Intensity"
              after={settings.beamStrength.toFixed(2)}
            >
              <Range
                value={settings.beamStrength}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => update({ beamStrength: v })}
              />
            </LabelRow>

            <LabelRow label="Softness" after={settings.beamSoft.toFixed(2)}>
              <Range
                value={settings.beamSoft}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => update({ beamSoft: v })}
              />
            </LabelRow>

            <LabelRow label="Edge glow" after={settings.edgeBoost.toFixed(2)}>
              <Range
                value={settings.edgeBoost}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => update({ edgeBoost: v })}
              />
            </LabelRow>
          </Group>
        </div>
      </aside>
    </>
  );
};

export default memo(ControlPanel);
