import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * LightRevealGrid
 * Transparent canvas that draws:
 *  - dark rounded cells (semi-opaque) on a transparent background
 *  - interactive lighting:
 *      lightStyle="lamp"  -> radial backlight behind pointer (no beams)
 *      lightStyle="beams" -> crossing beams as before
 */
const LightRevealGrid = forwardRef(function LightRevealGrid(
  {
    cell = 88,
    gap = 14,
    radius = 12,
    baseAlpha = 0.5,
    falloff = 240,
    beams = 4,
    rimColor = "#22c55e",
    beamStrength = 0.85,
    beamSoft = 0.35,
    edgeBoost = 0.25,
    pointerLerp = 0.18,
    lightStyle = "lamp",      // "lamp" | "beams"
    cellColor = "#000000",
    className = "",
  },
  apiRef
) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const offscreenRef = useRef(null);
  const offCtxRef = useRef(null);

  const gridRef = useRef({ startX: 0, startY: 0, step: 0, cols: 0, rows: 0 });

  const rafRef = useRef(0);
  const playingRef = useRef(true);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999 });

  const reduced = usePrefersReducedMotion();
  const dpr = useDevicePixelRatio();

  const rgb = parseColor(rimColor);

  const setSize = (canvas, w, h, scale, alpha = true) => {
    canvas.width  = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d", { alpha, desynchronized: true });
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    return ctx;
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    const rr = Math.min(r, w * 0.5, h * 0.5) || 0;
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

  const renderStaticGrid = (W, H) => {
    const octx = offCtxRef.current;
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

  const drawLighting = (ctx, W, H) => {
    mouse.current.x += (mouse.current.tx - mouse.current.x) * pointerLerp;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * pointerLerp;

    const mx = mouse.current.x, my = mouse.current.y;
    const { startX, startY, step } = gridRef.current;

    const idxCol = Math.round((mx - startX) / step);
    const idxRow = Math.round((my - startY) / step);
    const gaussian = (d, s) => Math.exp(-(d * d) / (2 * s * s));

    if (lightStyle === "lamp") {
      // Soft radial backlight (“lamp”) with edge glow near pointer
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, falloff);
      halo.addColorStop(0, `rgba(${rgb.str},${0.22 * beamStrength})`);
      halo.addColorStop(1, `rgba(${rgb.str},0)`);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      if (edgeBoost > 0) {
        const radiusStroke = Math.max(2, radius - 2);
        const band = falloff * (0.85 + beamSoft * 0.3);
        const band2 = band * band;
        const edgeWidth = Math.max(1, Math.floor(step * 0.07));
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgba(${rgb.str},1)`;
        ctx.lineJoin = "round";
        ctx.lineWidth = edgeWidth;
        const minX = mx - band - step, maxX = mx + band + step;
        const minY = my - band - step, maxY = my + band + step;
        for (let y = startY; y <= maxY; y += step) {
          if (y + cell < minY) continue;
          for (let x = startX; x <= maxX; x += step) {
            if (x + cell < minX) continue;
            const cx = x + cell / 2, cy = y + cell / 2;
            const dd = (cx - mx) ** 2 + (cy - my) ** 2;
            const t = Math.max(0, 1 - dd / band2);
            if (t <= 0.002) continue;
            ctx.globalAlpha = edgeBoost * t;
            roundRect(ctx, x + 1, y + 1, cell - 2, cell - 2, radiusStroke);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
      return;
    }

    // Classic beams mode
    const beamBlur = Math.max(10, Math.floor(step * 0.45));

    // faint ambient halo too
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, falloff);
    halo.addColorStop(0, `rgba(${rgb.str},${0.12 * beamStrength})`);
    halo.addColorStop(1, `rgba(${rgb.str},0)`);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = `rgba(${rgb.str},1)`;
    ctx.shadowBlur = beamBlur;

    const drawV = (xLine, weight) => {
      if (weight <= 0.001) return;
      const half = Math.max(1, (gap * (0.75 + beamSoft)) | 0);
      ctx.fillStyle = `rgba(${rgb.str},${beamStrength * weight})`;
      ctx.fillRect(xLine - half, 0, half * 2, H);
    };
    const drawH = (yLine, weight) => {
      if (weight <= 0.001) return;
      const half = Math.max(1, (gap * (0.75 + beamSoft)) | 0);
      ctx.fillStyle = `rgba(${rgb.str},${beamStrength * weight})`;
      ctx.fillRect(0, yLine - half, W, half * 2);
    };

    for (let k = -beams; k <= beams; k++) {
      const x = startX + (idxCol + k) * step + cell;
      const y = startY + (idxRow + k) * step + cell;
      drawV(x, gaussian(Math.abs(mx - x), falloff * 0.45));
      drawH(y, gaussian(Math.abs(my - y), falloff * 0.45));
    }
    ctx.restore();
  };

  const draw = () => {
    rafRef.current = 0;
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    const W = c.clientWidth, H = c.clientHeight;
    blitGrid(ctx, W, H);
    drawLighting(ctx, W, H);
  };

  const requestDraw = () => {
    if (rafRef.current || !playingRef.current || reduced) return;
    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    offscreenRef.current = document.createElement("canvas");

    const resizeToViewport = () => {
      const W = Math.max(1, Math.floor(window.innerWidth));
      const H = Math.max(1, Math.floor(window.innerHeight));
      ctxRef.current = setSize(canvas, W, H, clampDpr(dpr), true);
      offCtxRef.current = setSize(offscreenRef.current, W, H, clampDpr(dpr), true);
      computeGrid(W, H);
      renderStaticGrid(W, H);
      blitGrid(ctxRef.current, W, H);
    };

    resizeToViewport();
    const onResize = () => resizeToViewport();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [cell, gap, radius, baseAlpha, falloff, beams, rimColor, beamStrength, beamSoft, edgeBoost, cellColor, dpr, lightStyle]);

  useEffect(() => {
    const onMove = (e) => {
      if (!playingRef.current) return;
      const ce = e.getCoalescedEvents?.() ?? [e];
      const ev = ce[ce.length - 1];
      const p = "touches" in ev ? ev.touches[0] : ev;
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
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [reduced]);

  useEffect(() => {
    if (!reduced) return;
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (c && ctx) blitGrid(ctx, c.clientWidth, c.clientHeight);
  }, [reduced]);

  useImperativeHandle(apiRef, () => ({
    pause() {
      playingRef.current = false;
      const c = canvasRef.current;
      const ctx = ctxRef.current;
      if (c && ctx) blitGrid(ctx, c.clientWidth, c.clientHeight);
    },
    resume() { playingRef.current = true; },
  }));

  return (
    <canvas
      ref={canvasRef}
      className={`light-grid-canvas ${className}`}
      aria-hidden="true"
    />
  );
});

/* ------------ hooks & utils ------------ */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}
function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(() =>
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  );
  useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);
    const id = setInterval(update, 400);
    return () => clearInterval(id);
  }, []);
  return dpr;
}
function clampDpr(v) { return Math.max(1, Math.min(2, v || 1)); }

function parseColor(input) {
  if (typeof input === "string" && input.startsWith("#")) {
    const h = input.length === 4 ? input.replace(/#(.)(.)(.)/, "#$1$1$2$2$3$3") : input;
    const n = parseInt(h.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return { r, g, b, str: `${r},${g},${b}` };
  }
  const m = String(input).match(/(\d+)[ ,]+(\d+)[ ,]+(\d+)/);
  if (m) { const [, r, g, b] = m; return { r:+r, g:+g, b:+b, str:`${+r},${+g},${+b}` }; }
  return { r:34, g:197, b:94, str:"34,197,94" }; // fallback emerald
}

export default LightRevealGrid;
