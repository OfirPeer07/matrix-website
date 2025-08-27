import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";

/* ===== Presets (softer greens by default) ===== */
const PRESETS = {
  Emerald: { accent:"#22c55e", cellColor:"#000000", lightStyle:"lamp",
    falloff:240, beamStrength:0.85, beamSoft:0.35, edgeBoost:0.25,
    rainSpeed:20, rainDensity:0.62, rainFont:18, rainGlow:0.35 },
  NeoBlue: { accent:"#14b8ff", cellColor:"#020617", lightStyle:"lamp",
    falloff:260, beamStrength:0.9, beamSoft:0.45, edgeBoost:0.28,
    rainSpeed:22, rainDensity:0.58, rainFont:18, rainGlow:0.45 },
  ClassicBeams: { accent:"#00ff66", cellColor:"#000000", lightStyle:"beams",
    falloff:240, beamStrength:0.9, beamSoft:0.4, edgeBoost:0.0,
    rainSpeed:20, rainDensity:0.65, rainFont:18, rainGlow:0.4 },
};

/* ===== Perf: rAF-batched updates while dragging ===== */
function useRafMerge(setSettings) {
  const rafRef = useRef(0);
  const queueRef = useRef(null);
  const merge = useCallback((patch) => {
    queueRef.current = { ...(queueRef.current || {}), ...patch };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setSettings(s => ({ ...s, ...queueRef.current }));
      queueRef.current = null;
      rafRef.current = 0;
    });
  }, [setSettings]);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  return merge;
}

/* ===== Small UI atoms ===== */
const Color = memo(({ value, onInput }) =>
  <input className="cp-color" type="color" value={value} onInput={onInput} aria-label="color picker" />
);
const Range = memo(({ min, max, step, value, onInput }) =>
  <input className="cp-range" type="range" min={min} max={max} step={step} value={value} onInput={onInput} />
);
const NumberInput = memo(({ value, onChange, min, max, step }) =>
  <input className="cp-number" type="number" value={value} onChange={onChange} min={min} max={max} step={step} />
);

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`cp-group ${open ? "open" : ""}`}>
      <button className="cp-group-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{title}</span><span className="cp-chevron">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="cp-group-body">{children}</div>}
    </section>
  );
}

function Row({ label, after, children }) {
  return (
    <label className="cp-row">
      <span className="cp-label">{label}</span>
      <div className="cp-input">{children}</div>
      {after != null && <em className="cp-after">{after}</em>}
    </label>
  );
}

const ControlPanel = memo(function ControlPanel({ open, settings, setSettings, onClose, onReset }) {
  const S = useMemo(() => settings, [settings]);
  const merge = useRafMerge(setSettings);

  const onNum = useCallback((k) => (e) => merge({ [k]: +e.target.value }), [merge]);
  const onCol = useCallback((k) => (e) => merge({ [k]: e.target.value }), [merge]);

  const applyPreset = useCallback((name) => {
    const p = PRESETS[name]; if (!p) return;
    merge({ ...p });
  }, [merge]);

  return (
    <aside className={`right-drawer cp ${open ? "open" : ""}`} aria-label="Customization panel">
      <header className="cp-head">
        <h3>Customize</h3>
        <div className="cp-actions">
          <select className="cp-select" onChange={(e) => applyPreset(e.target.value)} defaultValue="">
            <option value="" disabled>Presets…</option>
            {Object.keys(PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="cp-btn ghost" onClick={onReset} title="Reset to defaults">Reset</button>
          <button className="cp-btn" onClick={onClose} aria-label="Close panel">Done</button>
        </div>
      </header>

      <Section title="Theme & Colors" defaultOpen>
        <Row label="Accent (glow / rain)" after={S.accent}>
          <Color value={S.accent} onInput={onCol("accent")} />
        </Row>
        <Row label="Cells color" after={S.cellColor}>
          <Color value={S.cellColor} onInput={onCol("cellColor")} />
        </Row>
        <Row label="Background" after={S.bg}>
          <Color value={S.bg} onInput={onCol("bg")} />
        </Row>
        <Row label="Text" after={S.text}>
          <Color value={S.text} onInput={onCol("text")} />
        </Row>
      </Section>

      <Section title="Matrix Rain">
        <Row label="Speed" after={S.rainSpeed}>
          <Range min="5" max="60" step="1" value={S.rainSpeed} onInput={onNum("rainSpeed")} />
        </Row>
        <Row label="Density" after={S.rainDensity.toFixed(2)}>
          <Range min="0.1" max="1" step="0.01" value={S.rainDensity} onInput={onNum("rainDensity")} />
        </Row>
        <Row label="Glyph size (px)" after={S.rainFont}>
          <Range min="10" max="32" step="1" value={S.rainFont} onInput={onNum("rainFont")} />
        </Row>
        <Row label="Glow" after={S.rainGlow.toFixed(2)}>
          <Range min="0" max="1" step="0.01" value={S.rainGlow} onInput={onNum("rainGlow")} />
        </Row>
        <Row label="FPS" after={S.rainFps}>
          <NumberInput min={16} max={60} step={1} value={S.rainFps} onChange={onNum("rainFps")} />
        </Row>
      </Section>

      <Section title="Backlight">
        <Row label="Light style">
          <select className="cp-select" value={S.lightStyle} onChange={(e) => merge({ lightStyle: e.target.value })}>
            <option value="lamp">Backlight (lamp)</option>
            <option value="beams">Beams (classic)</option>
          </select>
        </Row>
        <Row label="Radius (px)" after={S.falloff}>
          <Range min="120" max="680" step="5" value={S.falloff} onInput={onNum("falloff")} />
        </Row>
        <Row label="Intensity" after={S.beamStrength.toFixed(2)}>
          <Range min="0" max="1" step="0.01" value={S.beamStrength} onInput={onNum("beamStrength")} />
        </Row>
        <Row label="Softness" after={S.beamSoft.toFixed(2)}>
          <Range min="0" max="1" step="0.01" value={S.beamSoft} onInput={onNum("beamSoft")} />
        </Row>
        <Row label="Edge glow" after={S.edgeBoost.toFixed(2)}>
          <Range min="0" max="1" step="0.01" value={S.edgeBoost} onInput={onNum("edgeBoost")} />
        </Row>
      </Section>

      <Section title="Squares (Grid)">
        <Row label="Cell size (px)" after={S.cell}>
          <Range min="40" max="140" step="2" value={S.cell} onInput={onNum("cell")} />
        </Row>
        <Row label="Gap (px)" after={S.gap}>
          <Range min="6" max="28" step="1" value={S.gap} onInput={onNum("gap")} />
        </Row>
        <Row label="Corner radius (px)" after={S.radius}>
          <Range min="0" max="28" step="1" value={S.radius} onInput={onNum("radius")} />
        </Row>
        <Row label="Base opacity" after={S.baseAlpha.toFixed(2)}>
          <Range min="0" max="1" step="0.01" value={S.baseAlpha} onInput={onNum("baseAlpha")} />
        </Row>
      </Section>

      <footer className="cp-foot">
        <span>Changes are saved automatically.</span>
      </footer>
    </aside>
  );
});

export default ControlPanel;
