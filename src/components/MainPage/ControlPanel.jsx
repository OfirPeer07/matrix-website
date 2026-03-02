import React, { useState, memo, useCallback, useRef } from "react";
import "./ControlPanel.css";

/* ─────────────────────────────────────────── */
/*  Built-in presets — full settings snapshots */
/* ─────────────────────────────────────────── */
const BUILT_IN_PRESETS = [
  {
    name: "Classic",
    color: "#00ff88",
    settings: {
      accent: "#22c55e",
      bg: "#000000",
      cellColor: "#000000",
      cell: 88,
      rainSpeed: 20,
      rainDensity: 0.65,
      rainGlow: 0.35,
      rainFont: 18,
      falloff: 240,
      baseAlpha: 0.5,
    },
  },
  {
    name: "Emerald",
    color: "#10d9a0",
    settings: {
      accent: "#10d9a0",
      bg: "#000000",
      cellColor: "#001208",
      cell: 80,
      rainSpeed: 24,
      rainDensity: 0.7,
      rainGlow: 0.45,
      rainFont: 16,
      falloff: 200,
      baseAlpha: 0.55,
    },
  },
  {
    name: "Blue Matrix",
    color: "#14b8ff",
    settings: {
      accent: "#14b8ff",
      bg: "#000510",
      cellColor: "#000814",
      cell: 88,
      rainSpeed: 22,
      rainDensity: 0.6,
      rainGlow: 0.4,
      rainFont: 18,
      falloff: 260,
      baseAlpha: 0.45,
    },
  },
  {
    name: "Red Pill",
    color: "#ff3855",
    settings: {
      accent: "#ff3855",
      bg: "#0a0000",
      cellColor: "#0d0000",
      cell: 96,
      rainSpeed: 28,
      rainDensity: 0.55,
      rainGlow: 0.5,
      rainFont: 20,
      falloff: 220,
      baseAlpha: 0.6,
    },
  },
  {
    name: "Cyber Purple",
    color: "#c084fc",
    settings: {
      accent: "#c084fc",
      bg: "#05000d",
      cellColor: "#09000f",
      cell: 80,
      rainSpeed: 18,
      rainDensity: 0.72,
      rainGlow: 0.55,
      rainFont: 16,
      falloff: 200,
      baseAlpha: 0.5,
    },
  },
];

/* ─────────────────────────────────────────── */
/*  Sub-components                             */
/* ─────────────────────────────────────────── */

const SliderRow = memo(({ label, value, min, max, step, display, onChange }) => (
  <div className="cp-row">
    <div className="cp-row-header">
      <span className="cp-label">{label}</span>
      <span className="cp-value">{display ?? value}</span>
    </div>
    <input
      type="range"
      className="cp-slider"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    />
  </div>
));

const ColorRow = memo(({ label, value, onChange }) => (
  <div className="cp-row cp-row--color">
    <span className="cp-label">{label}</span>
    <div className="cp-color-wrap">
      <div className="cp-color-swatch" style={{ background: value }} />
      <input type="color" className="cp-color" value={value} onChange={onChange} />
      <span className="cp-value">{value}</span>
    </div>
  </div>
));

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="cp-row cp-row--toggle">
    <div className="cp-toggle-text">
      <span className="cp-label">{label}</span>
      {description && <span className="cp-toggle-desc">{description}</span>}
    </div>
    <label className="cp-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="cp-toggle-track">
        <span className="cp-toggle-thumb" />
      </span>
    </label>
  </div>
);

/* ─────────────────────────────────────────── */
/*  Tab Contents                               */
/* ─────────────────────────────────────────── */

const VisualTab = ({ settings, update, cinematicMode, setCinematicMode }) => (
  <div className="cp-tab-content">
    <div className="cp-group">
      <div className="cp-group-label">Colors</div>
      <ColorRow
        label="Accent"
        value={settings.accent}
        onChange={e => update("accent", e.target.value)}
      />
      <ColorRow
        label="Background"
        value={settings.bg}
        onChange={e => update("bg", e.target.value)}
      />
    </div>

    <div className="cp-group">
      <div className="cp-group-label">Experience</div>
      <ToggleRow
        label="Cinematic Mode"
        description="Hides Matrix rain for a clean view"
        checked={cinematicMode}
        onChange={e => setCinematicMode(e.target.checked)}
      />
    </div>
  </div>
);

const RainTab = ({ settings, update }) => (
  <div className="cp-tab-content">
    <div className="cp-group">
      <div className="cp-group-label">Matrix Rain</div>
      <SliderRow
        label="Speed"
        value={settings.rainSpeed}
        min={5} max={60} step={1}
        onChange={e => update("rainSpeed", +e.target.value)}
      />
      <SliderRow
        label="Density"
        value={settings.rainDensity}
        min={0.1} max={1} step={0.01}
        display={settings.rainDensity.toFixed(2)}
        onChange={e => update("rainDensity", +e.target.value)}
      />
      <SliderRow
        label="Glyph Glow"
        value={settings.rainGlow}
        min={0} max={1} step={0.01}
        display={settings.rainGlow.toFixed(2)}
        onChange={e => update("rainGlow", +e.target.value)}
      />
      <SliderRow
        label="Font Size"
        value={settings.rainFont}
        min={10} max={32} step={1}
        display={`${settings.rainFont}px`}
        onChange={e => update("rainFont", +e.target.value)}
      />
    </div>
  </div>
);

const GridTab = ({ settings, update }) => (
  <div className="cp-tab-content">
    <div className="cp-group">
      <div className="cp-group-label">Light Grid</div>
      <ColorRow
        label="Cell Color"
        value={settings.cellColor}
        onChange={e => update("cellColor", e.target.value)}
      />
      <SliderRow
        label="Cell Size"
        value={settings.cell}
        min={40} max={140} step={2}
        display={`${settings.cell}px`}
        onChange={e => update("cell", +e.target.value)}
      />
      <SliderRow
        label="Falloff"
        value={settings.falloff}
        min={80} max={400} step={10}
        onChange={e => update("falloff", +e.target.value)}
      />
      <SliderRow
        label="Base Alpha"
        value={settings.baseAlpha}
        min={0} max={1} step={0.01}
        display={settings.baseAlpha.toFixed(2)}
        onChange={e => update("baseAlpha", +e.target.value)}
      />
    </div>
  </div>
);

const PresetsTab = ({ settings, setSettings, onReset }) => {
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("matrix-custom-presets") || "[]");
    } catch {
      return [];
    }
  });
  const [newName, setNewName] = useState("");
  const inputRef = useRef(null);

  const savePreset = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    const preset = { name, settings: { ...settings } };
    const updated = [...customPresets.filter(p => p.name !== name), preset];
    setCustomPresets(updated);
    localStorage.setItem("matrix-custom-presets", JSON.stringify(updated));
    setNewName("");
    inputRef.current?.blur();
  }, [newName, settings, customPresets]);

  const deletePreset = useCallback((name) => {
    const updated = customPresets.filter(p => p.name !== name);
    setCustomPresets(updated);
    localStorage.setItem("matrix-custom-presets", JSON.stringify(updated));
  }, [customPresets]);

  const applyPreset = useCallback((presetSettings) => {
    setSettings(s => ({ ...s, ...presetSettings }));
  }, [setSettings]);

  return (
    <div className="cp-tab-content">
      {/* Built-in presets */}
      <div className="cp-group">
        <div className="cp-group-label">Built-in</div>
        <div className="cp-preset-grid">
          {BUILT_IN_PRESETS.map(p => (
            <button
              key={p.name}
              className="cp-preset-btn"
              style={{ "--preset-color": p.color }}
              onClick={() => applyPreset(p.settings)}
            >
              <span className="cp-preset-dot" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Save new preset */}
      <div className="cp-group">
        <div className="cp-group-label">Save Current</div>
        <div className="cp-save-row">
          <input
            ref={inputRef}
            className="cp-name-input"
            type="text"
            placeholder="Preset name…"
            value={newName}
            maxLength={24}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && savePreset()}
          />
          <button
            className="cp-save-btn"
            onClick={savePreset}
            disabled={!newName.trim()}
          >
            Save
          </button>
        </div>
      </div>

      {/* Custom presets */}
      {customPresets.length > 0 && (
        <div className="cp-group">
          <div className="cp-group-label">Custom</div>
          <div className="cp-custom-list">
            {customPresets.map(p => (
              <div key={p.name} className="cp-custom-pill">
                <button
                  className="cp-custom-name"
                  onClick={() => applyPreset(p.settings)}
                >
                  {p.name}
                </button>
                <button
                  className="cp-custom-delete"
                  onClick={() => deletePreset(p.name)}
                  aria-label={`Delete preset ${p.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="cp-reset-btn" onClick={onReset}>
        ↺ Reset to Default
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────── */
/*  Main ControlPanel                          */
/* ─────────────────────────────────────────── */

const TABS = ["Visual", "Rain", "Grid", "Presets"];

const ControlPanel = ({
  open,
  setOpen,
  settings,
  setSettings,
  onReset,
  cinematicMode,
  setCinematicMode,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const update = useCallback((k, v) => {
    setSettings(s => ({ ...s, [k]: v }));
  }, [setSettings]);

  return (
    <aside className={`cp-panel ${open ? "cp-panel--open" : ""}`} aria-label="Control Panel">
      {/* ── Header ── */}
      <header className="cp-header">
        <div className="cp-header-scanlines" aria-hidden="true" />
        <div className="cp-header-inner">
          <div className="cp-header-title">
            <span className="cp-header-icon">⬡</span>
            MATRIX<span className="cp-header-dim"> CONTROL</span>
          </div>
          <button className="cp-close-btn" onClick={() => setOpen(false)} aria-label="Close panel">
            <span>✕</span>
          </button>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <nav className="cp-tabs" role="tablist">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === i}
            className={`cp-tab ${activeTab === i ? "cp-tab--active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ── Tab Panels ── */}
      <div className="cp-body">
        {activeTab === 0 && (
          <VisualTab
            settings={settings}
            update={update}
            cinematicMode={cinematicMode}
            setCinematicMode={setCinematicMode}
          />
        )}
        {activeTab === 1 && <RainTab settings={settings} update={update} />}
        {activeTab === 2 && <GridTab settings={settings} update={update} />}
        {activeTab === 3 && (
          <PresetsTab
            settings={settings}
            setSettings={setSettings}
            onReset={onReset}
          />
        )}
      </div>
    </aside>
  );
};

export default ControlPanel;
