// cyberChatTerminalStyle.js
const cyberChatTerminalCSS = `
:root {
  --bg-dark: #0a0b1f;
  --overlay-gradient: radial-gradient(circle at 30% 30%, rgba(22,25,60,0.6), rgba(10,11,31,0.9) 80%);
  --neon-cyan: #00ffe0;
  --neon-purple: #2adef2;
  --neon-magenta: #2adef2;
  --accent-user: #2adef2;
  --text-primary: #d3dbff;
  --text-muted: rgba(211, 219, 255, 0.6);
  --radius: 14px;
  --font-stack: "Orbitron", "Share Tech Mono", "Courier Prime", "Fira Code", Consolas, monospace;
  --shadow-deep: 0 40px 80px -10px rgba(61, 0, 255, 0.35), inset 0 0 50px rgba(0, 255, 224, 0.08);
  --focus-ring: 0 0 0 4px rgba(157, 0, 255, 0.5);
  --transition: 0.24s cubic-bezier(.3,.1,.25,1);
  --glitch-offset: 2px;

  /* צ'אט ספציפיים */
  --bubble-other-bg: rgba(15,17,56,0.9);
  --bubble-mine-gradient: linear-gradient(135deg, #6f5aff, #9b59ff);
  --date-sep-bg: rgba(20,24,70,0.8);
  --input-bg: rgba(15,17,45,0.9);
  --input-border: rgba(255,255,255,0.08);
  --bubble-radius: 16px;
  --meta-color: rgba(211,219,255,0.75);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg-dark);
  height: 100%;
  width: 100%;
  font-family: var(--font-stack);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* בסיס הטרמינל (popup) */
#terminal-window {
  position: relative;
  width: 100vw;
  max-width: 1300px;
  height: 100vh;
  max-height: 820px;
  padding: 28px 32px;
  border-radius: var(--radius);
  background: var(--overlay-gradient);
  border: 2px solid var(--neon-cyan);
  box-shadow: var(--shadow-deep);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  backdrop-filter: contrast(1.05) brightness(1.05);
  transition: var(--transition);
}

#terminal-window::before,
#terminal-window::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  border-radius: inherit;
}

#terminal-window::before {
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px);
  opacity: 0.25;
}

#terminal-window::after {
  background:
    radial-gradient(circle at 20% 40%, rgba(157,0,255,0.06), transparent 60%),
    radial-gradient(circle at 80% 25%, rgba(0,255,224,0.04), transparent 70%);
  filter: blur(2px);
  animation: slowDrift 30s linear infinite;
}

@keyframes slowDrift {
  from { transform: translate(0,0); }
  to { transform: translate(12px, 12px); }
}

/* כותרת טרמינל (אופציונלי) */
#terminal-header {
  font-size: 0.65rem;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 6px 16px;
  background: rgba(15, 16, 48, 0.85);
  border-radius: 8px;
  display: inline-block;
  border: 1px solid var(--neon-magenta);
  position: relative;
  z-index: 2;
  color: var(--text-primary);
}

/* תצוגת צ'אט */
#terminal-display {
  flex: 1;
  position: relative;
  overflow-y: auto;
  padding: 16px 18px;
  border-radius: 12px;
  background: rgba(5, 6, 25, 0.88);
  border: 1px solid rgba(157, 0, 255, 0.35);
  box-shadow: inset 0 0 60px rgba(0, 255, 224, 0.1);
  font-size: 0.95rem;
  line-height: 1.45;
  margin-bottom: 8px;
  scroll-behavior: smooth;
  z-index: 1;
  backdrop-filter: blur(2px);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Scrollbar */
#terminal-display::-webkit-scrollbar {
  width: 12px;
}
#terminal-display::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
}
#terminal-display::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--neon-magenta), var(--neon-cyan));
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
#terminal-display {
  scrollbar-width: thin;
  scrollbar-color: rgba(157,0,255,0.65) rgba(0,0,0,0.2);
}

/* מפריד תאריכים */
.date-separator {
  display: flex;
  justify-content: center;
  margin: 10px 0 4px;
  font-size: 0.65rem;
  color: var(--text-muted);
}
.date-separator span {
  background: var(--date-sep-bg);
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  font-weight: 500;
}

/* בועות הודעה */
.line {
  display: flex;
  width: 100%;
}
.line.user {
  justify-content: flex-end;
}
.line.ofair {
  justify-content: flex-start;
}

.bubble-content {
  position: relative;
  max-width: 75%;
  padding: 12px 16px;
  border-radius: var(--bubble-radius);
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  line-height: 1.3;
  box-shadow: 0 30px 60px -10px rgba(157, 0, 255, 0.15);
  color: white;
  background: var(--bubble-other-bg);
  border: 1px solid rgba(255,255,255,0.04);
  transition: var(--transition);
}

/* הודעות משתמש */
.line.user .bubble-content {
  background: var(--bubble-mine-gradient);
  color: #fff;
}

/* זנב */
.line.ofair .bubble-content::after {
  content: "";
  position: absolute;
  left: -6px;
  bottom: 8px;
  width: 12px;
  height: 12px;
  background: var(--bubble-other-bg);
  clip-path: polygon(0 100%, 100% 0, 0 0);
}
.line.user .bubble-content::after {
  content: "";
  position: absolute;
  right: -6px;
  bottom: 8px;
  width: 12px;
  height: 12px;
  background: var(--bubble-mine-gradient);
  clip-path: polygon(100% 100%, 0 0, 100% 0);
}

/* מטא אינפורמציה */
.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
  font-size: 0.55rem;
  margin-top: 4px;
}
.time {
  color: var(--meta-color);
}
.status {
  display: flex;
  align-items: center;
}
.status svg {
  width: 14px;
  height: 14px;
  color: #fff;
}
.pending-dot {
  width: 8px;
  height: 8px;
  background: #ffd966;
  border-radius: 50%;
  animation: pulse 1.6s infinite ease-in-out;
}
@keyframes pulse {
  0%,100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

/* input area */
.input-wrapper {
  padding: 10px 14px;
  background: rgba(15,17,45,0.9);
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
}
#terminal-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
  transition: var(--transition);
}
#terminal-input::placeholder {
  color: rgba(211,219,255,0.5);
}
#terminal-input:focus {
  box-shadow: 0 0 0 3px rgba(157,0,255,0.5);
  border-color: rgba(157,0,255,0.8);
}

/* glitch + flicker */
@keyframes glitch {
  0% {
    clip-path: inset(0 0 0 0);
    transform: translate(0) skew(0);
    opacity: 1;
  }
  20% {
    clip-path: inset(2px 0 2px 0);
    transform: translate(var(--glitch-offset), calc(-1 * var(--glitch-offset))) skew(-0.5deg);
  }
  40% {
    clip-path: inset(1px 0 3px 0);
    transform: translate(calc(-1 * var(--glitch-offset)), var(--glitch-offset)) skew(0.5deg);
  }
  60% {
    clip-path: inset(0 1px 1px 0);
    transform: translate(var(--glitch-offset), var(--glitch-offset)) skew(-0.3deg);
  }
  80% {
    clip-path: inset(2px 0 1px 0);
    transform: translate(calc(-1 * var(--glitch-offset)), calc(-1 * var(--glitch-offset))) skew(0.2deg);
  }
  100% {
    clip-path: inset(0 0 0 0);
    transform: translate(0) skew(0);
    opacity: 1;
  }
}
.line.glitch .bubble-content {
  animation: glitch 0.6s ease-in-out both;
}

@keyframes flicker {
  0%,100% { opacity:1; }
  50% { opacity:0.92; }
}
.line.ofair .bubble-content {
  animation: flicker 5s ease-in-out infinite;
}

/* responsive */
@media (max-width: 1080px) {
  #terminal-window {
    padding: 20px 22px;
    height: 82vh;
  }
  #terminal-display {
    font-size: 0.9rem;
  }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
`;

export default cyberChatTerminalCSS;
