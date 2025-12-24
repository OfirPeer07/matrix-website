import React, { useState, memo, useCallback } from "react";
import "./ControlPanel.css";

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="neo-section">
      <button
        className="neo-section-toggle"
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        <span className={`neo-chevron ${open ? "open" : ""}`}>▸</span>
      </button>

      {open && <div className="neo-section-body">{children}</div>}
    </div>
  );
};

const Row = ({ label, after, children }) => (
  <div className="neo-row">
    <span className="neo-label">{label}</span>
    <div className="neo-input">{children}</div>
    {after !== undefined && <span className="neo-after">{after}</span>}
  </div>
);

const ColorInput = memo(({ value, onChange }) => (
  <input type="color" className="neo-color" value={value} onChange={onChange} />
));

const Range = memo(({ value, min, max, step, onChange }) => (
  <input
    type="range"
    className="neo-range"
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={onChange}
  />
));

const ControlPanel = ({ open, setOpen, settings, setSettings, onReset }) => {
  const update = useCallback((k, v) => {
    setSettings(s => ({ ...s, [k]: v }));
  }, [setSettings]);

  return (
    <aside className={`neo-panel ${open ? "open" : ""}`}>
      {/* Header */}
      <header className="neo-panel-header">
        <div className="neo-title">
          <span className="neo-bolt">⚡</span> MATRIX CONTROL PANEL
        </div>

        {/* FIXED BUTTON — now works */}
        <button
          className="neo-close-btn"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </header>

      {/* Content */}
      <div className="neo-panel-content">

        {/* PRESETS */}
        <Section title="Presets">
          <div className="neo-preset-buttons">
            {["Classic", "Emerald", "BlueMatrix"].map(name => (
              <button
                key={name}
                className="neo-preset"
                onClick={() => {
                  if (name === "Classic")
                    onReset();
                  else if (name === "Emerald")
                    update("accent", "#22c55e");
                  else if (name === "BlueMatrix")
                    update("accent", "#14b8ff");
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </Section>

        {/* ACCENT COLORS */}
        <Section title="Accent Colors">
          <Row label="Highlight" after={settings.accent}>
            <ColorInput
              value={settings.accent}
              onChange={e => update("accent", e.target.value)}
            />
          </Row>
        </Section>

        {/* MATRIX RAIN */}
        <Section title="Matrix Rain">
          <Row label="Speed" after={settings.rainSpeed}>
            <Range
              value={settings.rainSpeed}
              min={5}
              max={60}
              step={1}
              onChange={e => update("rainSpeed", +e.target.value)}
            />
          </Row>

          <Row label="Density" after={settings.rainDensity.toFixed(2)}>
            <Range
              value={settings.rainDensity}
              min={0.1}
              max={1}
              step={0.01}
              onChange={e => update("rainDensity", +e.target.value)}
            />
          </Row>

          <Row label="Glyph Glow" after={settings.rainGlow.toFixed(2)}>
            <Range
              value={settings.rainGlow}
              min={0}
              max={1}
              step={0.01}
              onChange={e => update("rainGlow", +e.target.value)}
            />
          </Row>
        </Section>

        {/* LIGHT GRID */}
        <Section title="Light Grid">
          <Row label="Cell Color" after={settings.cellColor}>
            <ColorInput
              value={settings.cellColor}
              onChange={e => update("cellColor", e.target.value)}
            />
          </Row>

          <Row label="Cell Size" after={settings.cell}>
            <Range
              value={settings.cell}
              min={40}
              max={140}
              step={2}
              onChange={e => update("cell", +e.target.value)}
            />
          </Row>
        </Section>

        {/* RESET BUTTON */}
        <button className="neo-reset-btn" onClick={onReset}>
          RESET TO DEFAULT
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
