// Centralized theme + CSS vars
const DEFAULT_THEME = {
  bg: "#000000",
  text: "#ffffff",
  muted: "#dddddd",
  accent: "#00ff66",
};

function hexToRgbString(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(v, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `${r},${g},${b}`;
}

export function applyTheme(theme = {}) {
  const t = { ...DEFAULT_THEME, ...theme };
  const root = document.documentElement;
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--text", t.text);
  root.style.setProperty("--muted", t.muted);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-rgb", hexToRgbString(t.accent));
}

export const THEME = DEFAULT_THEME;
