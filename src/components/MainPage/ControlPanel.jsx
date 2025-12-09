import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import "./ControlPanel.css";

/* ============================================
   PRESETS — Matrix Console Themes
============================================ */
const PRESETS = {
  NeoGreen: {
    accent: "#00ff66",
    cellColor: "#000000",
    bg: "#000000",
    text: "#ffffff",
    falloff: 240,
    beamStrength: 0.85,
    beamSoft: 0.35,
    edgeBoost: 0.25,
    rainSpeed: 20,
    rainDensity: 0.62,
    rainFont: 18,
    rainGlow: 0.45,
    rainFps: 32,
    cell: 88,
    gap: 14,
    radius: 12,
    baseAlpha: 0.5,
    lightStyle: "beams",
  },
  EmeraldSoft: {
    accent: "#22c55e",
    cellColor: "#000000",
    bg: "#010b05",
    text: "#d4ffe0",
    falloff: 300,
    beamStrength: 0.75,
    beamSoft: 0.45,
    edgeBoost: 0.22,
    rainSpeed: 16,
    rainDensity: 0.55,
    rainFont: 20,
    rainGlow: 0.35,
    rainFps: 30,
    cell: 78,
    gap: 12,
    radius: 10,
    baseAlpha: 0.45,
    lightStyle: "lamp",
  },
};

/* ============================================
   RAF MERGE — smooth updates
============================================ */
function useRafMerge(setSettings) {
  const raf = useRef(0);
  const queue = useRef(null);

  const merge = useCallback(
    (patch) => {
      queue.current = { ...(queue.current || {}), ...patch };
      if (raf.current) return;

      raf.current = requestAnimationFrame(() => {
        setSettings((s) => ({ ...s, ...queue.current }));
        queue.current = null;
        raf.current = 0;
      });
    },
    [setSettings]
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return merge;
}

/* ============================================
   SMALL INPUT ELEMENTS
============================================ */
const ColorInput = memo(({ value, onInput }) => (
  <input type="color" className="cp-color" value={value} onInput={onInput} />
));

const RangeInput = memo(({ min, max, step, value, onInput }) => (
  <input type="range" className="cp-slider" min={min} max={max} step={step} value={value} onInput={onInput} />
));

const NumberInput = memo(({ value, onChange, min, max, step }) => (
  <input type="number" className="cp-number" value={value} onChange={onChange} min={min} max={max} step={step} />
));

/* ============================================
   GROUP TITLE (Matrix Command Style)
============================================ */
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`cp-section ${open ? "open" : ""}`}>
      <button className="cp-section-head" onClick={() => setOpen((o) => !o)}>
        <span className="cp-bullet">▸</span> <span className="cp-title">{title}</span>
        <span className="cp-chevron">{open ? "▼" : "▲"}</span>
      </button>

      {open && <div className="cp-section-body">{children}</div>}
    </section>
  );
}

/* ============================================
   ROW ELEMENT
============================================ */
function Row({ label, children, after }) {
  return (
    <label className="cp-row">
      <span className="cp-label">{label}</span>
      <div className="cp-field">{children}</div>
      {after && <span className="cp-after">{after}</span>}
    </label>
  );
}

/* ============================================
   CONTROL PANEL (MAIN COMPONENT)
============================================ */
const ControlPanel = memo(function ControlPanel({ open, settings, setSettings, onClose, onReset }) {
  const merge = useRafMerge(setSettings);
  const S = useMemo(() => settings, [settings]);

  const onNum = (k) => (e) => merge({ [k]: +e.target.value });
  const onCol = (k) => (e) => merge({ [k]: e.target.value });

  const applyPreset = (name) => {
    if (!PRESETS[name]) return;
    merge({ ...PRESETS[name] });
  };

  return (
    <aside className={`cp-wrapper ${open ? "open" : ""}`}>
      <header className="cp-header">
        <h2 className="cp-header-title">Customize Console</h2>

        <div className="cp-header-controls">
          <select className="cp-select" onChange={(e) => applyPreset(e.target.value)} defaultValue="">
            <option value="" disabled>
              Load Preset…
            </option>
            {Object.keys(PRESETS).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <button className="cp-btn ghost" onClick={onReset}>
            RESET
          </button>

          <button className="cp-btn close" onClick={onClose}>
            ✕
          </button>
        </div>
      </header>

      {/* ==================================
          COLORS
      ================================== */}
      <Section title="Theme & Colors">
        <Row label="Accent" after={S.accent}>
          <ColorInput value={S.accent} onInput={onCol("accent")} />
        </Row>

        <Row label="Cells" after={S.cellColor}>
          <ColorInput value={S.cellColor} onInput={onCol("cellColor")} />
        </Row>

        <Row label="Background" after={S.bg}>
          <ColorInput value={S.bg} onInput={onCol("bg")} />
        </Row>

        <Row label="Text" after={S.text}>
          <ColorInput value={S.text} onInput={onCol("text")} />
        </Row>
      </Section>

      {/* ==================================
          MATRIX RAIN
      ================================== */}
      <Section title="Matrix Rain">
        <Row label="Speed" after={S.rainSpeed}>
          <RangeInput min="5" max="60" value={S.rainSpeed} onInput={onNum("rainSpeed")} />
        </Row>

        <Row label="Density" after={S.rainDensity.toFixed(2)}>
          <RangeInput min="0.1" max="1" step="0.01" value={S.rainDensity} onInput={onNum("rainDensity")} />
        </Row>

        <Row label="Glyph Size" after={S.rainFont}>
          <RangeInput min="10" max="32" value={S.rainFont} onInput={onNum("rainFont")} />
        </Row>

        <Row label="Glow" after={S.rainGlow.toFixed(2)}>
          <RangeInput min="0" max="1" step="0.01" value={S.rainGlow} onInput={onNum("rainGlow")} />
        </Row>

        <Row label="FPS" after={S.rainFps}>
          <NumberInput value={S.rainFps} onChange={onNum("rainFps")} min="16" max="60" />
        </Row>
      </Section>

      {/* ==================================
          BACKLIGHT
      ================================== */}
      <Section title="Backlight">
        <Row label="Style">
          <select className="cp-select" value={S.lightStyle} onChange={(e) => merge({ lightStyle: e.target.value })}>
            <option value="lamp">Lamp Glow</option>
            <option value="beams">Energy Beams</option>
          </select>
        </Row>

        <Row label="Radius" after={S.falloff}>
          <RangeInput min="120" max="680" step="5" value={S.falloff} onInput={onNum("falloff")} />
        </Row>

        <Row label="Intensity" after={S.beamStrength.toFixed(2)}>
          <RangeInput min="0" max="1" step="0.01" value={S.beamStrength} onInput={onNum("beamStrength")} />
        </Row>

        <Row label="Softness" after={S.beamSoft.toFixed(2)}>
          <RangeInput min="0" max="1" step="0.01" value={S.beamSoft} onInput={onNum("beamSoft")} />
        </Row>

        <Row label="Edge Glow" after={S.edgeBoost.toFixed(2)}>
          <RangeInput min="0" max="1" step="0.01" value={S.edgeBoost} onInput={onNum("edgeBoost")} />
        </Row>
      </Section>

      {/* ==================================
          GRID SETTINGS
      ================================== */}
      <Section title="Grid System">
        <Row label="Cell Size" after={S.cell}>
          <RangeInput min="40" max="140" step="2" value={S.cell} onInput={onNum("cell")} />
        </Row>

        <Row label="Gap" after={S.gap}>
          <RangeInput min="6" max="28" value={S.gap} onInput={onNum("gap")} />
        </Row>

        <Row label="Radius" after={S.radius}>
          <RangeInput min="0" max="28" value={S.radius} onInput={onNum("radius")} />
        </Row>

        <Row label="Opacity" after={S.baseAlpha.toFixed(2)}>
          <RangeInput min="0" max="1" step="0.01" value={S.baseAlpha} onInput={onNum("baseAlpha")} />
        </Row>
      </Section>

      <footer className="cp-footer">System changes apply automatically.</footer>
    </aside>
  );
});

export default ControlPanel;
