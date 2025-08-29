import React, { useEffect, useRef, useState } from "react";

export default function MatrixRainCanvas({
  color = "#000000ff",
  glow = 0.35,
  fontSize = 16,
  speed = 18,
  density = 0.6,
  fps = 32,
  className = "",
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const colsRef = useRef(0);
  const dropsRef = useRef([]);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  const glyphs =
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pick = () => glyphs[(Math.random() * glyphs.length) | 0];

  const setSize = () => {
    const c = canvasRef.current;
    const ctx = (ctxRef.current = c.getContext("2d", { alpha: true, desynchronized: true }));
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const W = Math.ceil(window.innerWidth);
    const H = Math.ceil(window.innerHeight);
    c.width = Math.ceil(W * dpr);
    c.height = Math.ceil(H * dpr);
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colW = Math.max(10, fontSize);
    const cols = Math.ceil(W / colW);
    colsRef.current = cols;

    dropsRef.current = Array.from({ length: cols }, () =>
      Math.random() < density ? (Math.random() * -H) | 0 : -1
    );

    ctx.clearRect(0, 0, W, H); // שקיפות מלאה
  };

  const draw = (ts) => {
    if (reduced) return;
    const ctx = ctxRef.current;
    const c = canvasRef.current;
    if (!ctx || !c) return;

    const interval = 1000 / fps;
    if (ts - lastRef.current < interval) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }
    lastRef.current = ts;

    const W = c.clientWidth;
    const H = c.clientHeight;
    const colW = Math.max(10, fontSize);

    // דהייה שקופה
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";
    ctx.shadowColor = color;
    ctx.shadowBlur = glow > 0 ? Math.floor(fontSize * glow) : 0;

    for (let i = 0; i < colsRef.current; i++) {
      let y = dropsRef.current[i];
      if (y < 0) { if (y === -1 && Math.random() < 0.005) dropsRef.current[i] = 0; continue; }
      const x = i * colW;
      ctx.fillStyle = color;
      ctx.fillText(pick(), x, y);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillText(pick(), x, y - fontSize);
      y += speed;
      dropsRef.current[i] = y > H + fontSize * 2 ? (Math.random() < density ? 0 : -1) : y;
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    setSize();
    const onResize = () => setSize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    if (!reduced) rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fontSize, speed, density, fps, color, glow, reduced]);

  useEffect(() => {
    if (!reduced) return;
    const ctx = ctxRef.current, c = canvasRef.current;
    if (!ctx || !c) return;
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  }, [reduced]);

  return <canvas ref={canvasRef} className={`matrix-rain-canvas ${className}`} aria-hidden="true" />;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const apply = () => setReduced(!!mq.matches);
    apply(); mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}
