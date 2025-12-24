import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/**
 * LightRevealGrid
 * Transparent overlay canvas with interactive lighting.
 * SAFE for multi-canvas layering (Matrix Rain, etc).
 */
const LightRevealGrid = forwardRef(function LightRevealGrid(
  {
    cell = 88,
    gap = 14,
    radius = 12,
    baseAlpha = 0.5,
    falloff = 240,
    beams = 4,
    rimColor = "#000000ff",
    beamStrength = 0.85,
    beamSoft = 0.35,
    edgeBoost = 0.25,
    pointerLerp = 0.18,
    lightStyle = "lamp", // "lamp" | "beams"
    cellColor = "#000000",
    className = "",
  },
  apiRef
) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const offscreenRef = useRef(null);
  const offCtxRef = useRef(null);

  const gridRef = useRef({
    startX: 0,
    startY: 0,
    step: 0,
    cols: 0,
    rows: 0,
  });

  const rafRef = useRef(0);
  const playingRef = useRef(true);

  const mouse = useRef({
    x: -9999,
    y: -9999,
    tx: -9999,
    ty: -9999,
  });

  const reduced = usePrefersReducedMotion();
  const dpr = useDevicePixelRatio();
  const rgb = parseColor(rimColor);

  /* ---------- utils ---------- */

  const setSize = (canvas, w, h, scale) => {
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    return ctx;
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  };

  const computeGrid = (W, H) => {
    const step = cell + gap;
    const startX = -((W % step) + step);
    const startY = -((H % step) + step);
    const cols = Math.ceil((W - startX) / step) + 2;
    const rows = Math.ceil((H - startY) / step) + 2;
    gridRef.current = { startX, startY, step, cols, rows };
  };

  /* ---------- static grid ---------- */

  const renderStaticGrid = (W, H) => {
    const octx = offCtxRef.current;
    if (!octx) return;

    octx.clearRect(0, 0, W, H);
    const { startX, startY, step, cols, rows } = gridRef.current;

    // base cells
    octx.save();
    octx.fillStyle = cellColor;
    octx.globalAlpha = baseAlpha;

    for (let r = 0, y = startY; r < rows; r++, y += step) {
      for (let c = 0, x = startX; c < cols; c++, x += step) {
        roundRect(octx, x, y, cell, cell, radius);
        octx.fill();
      }
    }
    octx.restore();

    // subtle outlines
    octx.save();
    octx.globalAlpha = 0.08;
    octx.strokeStyle = `rgba(${rgb.str},1)`;
    octx.lineJoin = "round";
    octx.lineWidth = Math.max(1, Math.floor(cell * 0.06));

    for (let r = 0, y = startY; r < rows; r++, y += step) {
      for (let c = 0, x = startX; c < cols; c++, x += step) {
        roundRect(octx, x + 0.5, y + 0.5, cell - 1, cell - 1, radius);
        octx.stroke();
      }
    }
    octx.restore();
  };

  const blitGrid = (ctx, W, H) => {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(offscreenRef.current, 0, 0, W, H);
  };

  /* ---------- lighting ---------- */

  const drawLighting = (ctx, W, H) => {
    mouse.current.x += (mouse.current.tx - mouse.current.x) * pointerLerp;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * pointerLerp;

    const mx = mouse.current.x;
    const my = mouse.current.y;
    const { startX, startY, step } = gridRef.current;

    if (lightStyle === "lamp") {
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, falloff);
      halo.addColorStop(0, `rgba(${rgb.str},${0.22 * beamStrength})`);
      halo.addColorStop(1, `rgba(${rgb.str},0)`);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      return;
    }

    // beams mode
    const gaussian = (d, s) => Math.exp(-(d * d) / (2 * s * s));
    const idxCol = Math.round((mx - startX) / step);
    const idxRow = Math.round((my - startY) / step);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let k = -beams; k <= beams; k++) {
      const x = startX + (idxCol + k) * step + cell;
      const y = startY + (idxRow + k) * step + cell;

      const wx = gaussian(Math.abs(mx - x), falloff * 0.45);
      const wy = gaussian(Math.abs(my - y), falloff * 0.45);

      if (wx > 0.01) {
        ctx.fillStyle = `rgba(${rgb.str},${beamStrength * wx})`;
        ctx.fillRect(x - gap, 0, gap * 2, H);
      }
      if (wy > 0.01) {
        ctx.fillStyle = `rgba(${rgb.str},${beamStrength * wy})`;
        ctx.fillRect(0, y - gap, W, gap * 2);
      }
    }
    ctx.restore();
  };

  /* ---------- draw (SAFE) ---------- */

  const draw = () => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // 🔥 CRITICAL FIX:
    // Reset compositing so we NEVER affect other canvases
    ctx.globalCompositeOperation = "source-over";

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    blitGrid(ctx, W, H);
    drawLighting(ctx, W, H);
  };

  const requestDraw = () => {
    if (rafRef.current || !playingRef.current || reduced) return;
    rafRef.current = requestAnimationFrame(draw);
  };

  /* ---------- lifecycle ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    offscreenRef.current = document.createElement("canvas");

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctxRef.current = setSize(canvas, W, H, clampDpr(dpr));
      offCtxRef.current = setSize(offscreenRef.current, W, H, clampDpr(dpr));
      computeGrid(W, H);
      renderStaticGrid(W, H);
      blitGrid(ctxRef.current, W, H);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [
    cell,
    gap,
    radius,
    baseAlpha,
    falloff,
    beams,
    rimColor,
    beamStrength,
    beamSoft,
    edgeBoost,
    cellColor,
    dpr,
    lightStyle,
  ]);

  useEffect(() => {
    const onMove = (e) => {
      if (!playingRef.current) return;
      const p = e.touches?.[0] ?? e;
      mouse.current.tx = p.clientX;
      mouse.current.ty = p.clientY;
      requestDraw();
    };
    const onLeave = () => {
      mouse.current.tx = -9999;
      mouse.current.ty = -9999;
      requestDraw();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  useImperativeHandle(apiRef, () => ({
    pause() {
      playingRef.current = false;
      draw();
    },
    resume() {
      playingRef.current = true;
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className={`light-grid-canvas ${className}`}
      aria-hidden="true"
    />
  );
});

/* ---------- hooks ---------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(window.devicePixelRatio || 1);
  useEffect(() => {
    const id = setInterval(() => setDpr(window.devicePixelRatio || 1), 400);
    return () => clearInterval(id);
  }, []);
  return dpr;
}

function clampDpr(v) {
  return Math.max(1, Math.min(2, v || 1));
}

function parseColor(input) {
  if (typeof input === "string" && input.startsWith("#")) {
    const n = parseInt(input.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return { r, g, b, str: `${r},${g},${b}` };
  }
  return { r: 34, g: 197, b: 94, str: "34,197,94" };
}

export default LightRevealGrid;
