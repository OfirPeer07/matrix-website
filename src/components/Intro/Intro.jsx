import { useEffect, useRef } from "react";
import "./Intro.css";

/* ================= CONFIG ================= */
const DPR = window.devicePixelRatio || 1;
const FONT_SIZE = 16;
const TEXT_FONT_SIZE = 140;
const TEXT = "WELCOME TO \n THE MATRIX WORLD";

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
  "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789";

/* -------- MOVIE PRESET (1999) -------- */
const PRESET = {
  fallSpeed: 75,
  speedVariance: 14,
  trailMin: 16,
  trailMax: 26,
  charInterval: 0.12,
  glowStrength: 0.35,
  gamma: 1.6,
  activationChance: 0.002,
};

/* -------- COLORS -------- */
const COLOR_HEAD = "#e0ffe0";
const COLOR_BUILD = "#88ffcc";
const COLOR_LOCKED = "#ffffff";

/* -------- STATES -------- */
const STATE = { RAIN: 0, BUILD: 1, LOOP: 2 };
const RAIN_TIME = 1.5;
const BUILD_INTERVAL = 0.025;

/* -------- SIMULATION -------- */
const FIXED_STEP = 1 / 120;

export default function Intro({ onFinish }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mounted = useRef(true);

  const lastTime = useRef(0);
  const accumulator = useRef(0);

  const finishTimer = useRef(null);
  const finishedOnce = useRef(false);

  const state = useRef(STATE.RAIN);
  const time = useRef(0);

  const data = useRef({
    w: 0,
    h: 0,
    cols: 0,
    streams: [],
    locked: new Map(),
    targets: [],
    mask: null,
    buildIndex: 0,
    buildTimer: 0,
  });

  /* ================= HELPERS ================= */
  const cellKey = (c, r) => `${c},${r}`;

  const inText = (x, y) => {
    const { w, mask } = data.current;
    return mask && mask[((x | 0) + (y | 0) * w) * 4] > 0;
  };

  const randomChar = pool =>
    pool[(Math.random() * pool.length) | 0];

  /* ================= SKIP INTRO ================= */
  const skipIntro = () => {
    if (state.current === STATE.LOOP) return;

    const d = data.current;

    for (let i = d.buildIndex; i < d.targets.length; i++) {
      const key = d.targets[i];
      if (!d.locked.has(key)) {
        d.locked.set(key, randomChar(MATRIX_CHARS));
      }
    }

    d.buildIndex = d.targets.length;
    state.current = STATE.LOOP;

    if (!finishedOnce.current) {
      finishedOnce.current = true;
      clearTimeout(finishTimer.current);
      finishTimer.current = setTimeout(() => {
        onFinish?.();
      }, 300);
    }
  };

  /* ================= KEYBOARD SKIP ================= */
  const handleKeyDown = (e) => {
    if (
      e.key === "Escape" ||
      e.key === " " ||
      e.key === "Enter"
    ) {
      e.preventDefault();
      skipIntro();
    }
  };

  /* ================= SIMULATION ================= */
  const simulate = (dt) => {
    const d = data.current;
    time.current += dt;

    if (time.current > RAIN_TIME) state.current = STATE.BUILD;

    if (state.current === STATE.BUILD) {
      d.buildTimer += dt;

      if (
        d.buildTimer >= BUILD_INTERVAL &&
        d.buildIndex < d.targets.length
      ) {
        d.buildTimer = 0;
        const key = d.targets[d.buildIndex++];
        d.locked.set(key, randomChar(MATRIX_CHARS));
      }

      if (d.buildIndex >= d.targets.length) {
        state.current = STATE.LOOP;
      }
    }

    if (state.current === STATE.LOOP && !finishedOnce.current) {
      finishedOnce.current = true;
      finishTimer.current = setTimeout(() => {
        onFinish?.();
      }, 3000);
    }

    d.streams.forEach(s => {
      if (!s.active) {
        if (Math.random() < PRESET.activationChance) {
          s.active = true;
          s.y = Math.random() * -d.h;
        }
        return;
      }

      s.y += s.speed * dt;

      s.charTimer += dt;
      if (s.charTimer >= PRESET.charInterval) {
        s.charTimer = 0;
        s.chars.pop();
        s.chars.unshift(randomChar(s.charPool));
      }

      if (s.y - s.trail * FONT_SIZE > d.h) {
        s.active = false;
      }
    });
  };

  /* ================= DRAW ================= */
  const render = (ctx) => {
    const d = data.current;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, d.w, d.h);
    ctx.font = `${FONT_SIZE}px monospace`;

    d.streams.forEach((s, col) => {
      if (!s.active) return;

      for (let i = 0; i < s.trail; i++) {
        const y = s.y - i * FONT_SIZE + s.subPixel;
        if (y < 0 || y > d.h) continue;

        const row = Math.floor(y / FONT_SIZE);
        const key = cellKey(col, row);
        if (d.locked.has(key)) continue;

        const x = col * FONT_SIZE;
        const char = s.chars[i];

        if (i === 0) {
          ctx.fillStyle = `rgba(0,180,90,${PRESET.glowStrength})`;
          ctx.fillText(char, x - 1, y);
          ctx.fillText(char, x + 1, y);
          ctx.fillText(char, x, y - 1);
          ctx.fillText(char, x, y + 1);
          ctx.fillStyle = COLOR_HEAD;
        } else {
          const alpha = Math.pow(1 - i / s.trail, PRESET.gamma);
          ctx.fillStyle = `rgba(0,170,85,${alpha})`;
        }

        if (inText(x, y)) ctx.fillStyle = COLOR_BUILD;
        ctx.fillText(char, x, y);
      }
    });

    d.locked.forEach((char, key) => {
      const [c, r] = key.split(",").map(Number);
      ctx.fillStyle = COLOR_LOCKED;
      ctx.fillText(char, c * FONT_SIZE, r * FONT_SIZE);
    });
  };

  /* ================= LOOP ================= */
  const loop = (now) => {
    if (!mounted.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dt = Math.min((now - lastTime.current) / 1000, 0.05);
    lastTime.current = now;
    accumulator.current += dt;

    while (accumulator.current >= FIXED_STEP) {
      simulate(FIXED_STEP);
      accumulator.current -= FIXED_STEP;
    }

    render(ctx);
    rafRef.current = requestAnimationFrame(loop);
  };

  /* ================= RESIZE ================= */
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cols = Math.floor(w / FONT_SIZE);

    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const streams = Array.from({ length: cols }, () => {
      const pool = MATRIX_CHARS.split("").slice(0, 14);
      return {
        y: Math.random() * -h,
        speed: PRESET.fallSpeed + Math.random() * PRESET.speedVariance,
        trail: PRESET.trailMin +
          Math.random() * (PRESET.trailMax - PRESET.trailMin),
        chars: Array.from({ length: 50 }, () => randomChar(pool)),
        charPool: pool,
        charTimer: Math.random() * PRESET.charInterval,
        subPixel: Math.random() * 0.6,
        active: Math.random() < 0.4,
      };
    });

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mctx = maskCanvas.getContext("2d");

    mctx.fillStyle = "#000";
    mctx.fillRect(0, 0, w, h);
    mctx.fillStyle = "#fff";
    mctx.font = `bold ${TEXT_FONT_SIZE}px sans-serif`;
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";

    const lines = TEXT.split("\n");
    const lh = TEXT_FONT_SIZE * 1.1;
    const startY = h / 2 - ((lines.length - 1) * lh) / 2;

    lines.forEach((line, i) =>
      mctx.fillText(line, w / 2, startY + i * lh)
    );

    const mask = mctx.getImageData(0, 0, w, h).data;

    const targets = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < h / FONT_SIZE; r++) {
        if (mask[((c * FONT_SIZE) + (r * FONT_SIZE) * w) * 4] > 0) {
          targets.push(cellKey(c, r));
        }
      }
    }

    data.current = {
      w,
      h,
      cols,
      streams,
      locked: new Map(),
      targets,
      mask,
      buildIndex: 0,
      buildTimer: 0,
    };

    time.current = 0;
    state.current = STATE.RAIN;
    accumulator.current = 0;
    finishedOnce.current = false;
    clearTimeout(finishTimer.current);
    lastTime.current = performance.now();
  };

  /* ================= LIFECYCLE ================= */
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mounted.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(finishTimer.current);
    };
  }, []);

  return (
    <>
      <button
        className="intro-skip"
        onClick={skipIntro}
        aria-label="Skip intro"
      >
        SKIP
      </button>

      <canvas ref={canvasRef} className="intro-canvas" />
    </>
  );
}
