  import React, { useEffect, useRef, useState } from "react";

  export default function MatrixRainCanvas({
    color = "#22c55e",
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
      "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
    const pick = () => glyphs[(Math.random() * glyphs.length) | 0];

    /* ================= SIZE ================= */
    const setSize = () => {
      const c = canvasRef.current;
      if (!c) return;

      const ctx = (ctxRef.current = c.getContext("2d", {
        alpha: true,
        desynchronized: true,
      }));

      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const W = window.innerWidth;
      const H = window.innerHeight;

      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colW = Math.max(10, fontSize);
      const cols = Math.ceil(W / colW);
      colsRef.current = cols;

      dropsRef.current = Array.from({ length: cols }, () =>
        Math.random() < density ? Math.random() * -H : -1
      );

      ctx.clearRect(0, 0, W, H);
    };

    /* ================= DRAW ================= */
    const draw = (ts) => {
      if (reduced) return;

      const ctx = ctxRef.current;
      const c = canvasRef.current;
      if (!ctx || !c) return;

      const interval = 1000 / fps;
      if (lastRef.current === 0) lastRef.current = ts;
      if (ts - lastRef.current < interval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastRef.current = ts;

      const W = c.clientWidth;
      const H = c.clientHeight;
      const colW = Math.max(10, fontSize);

      // 🔴 נשאר בדיוק כמו שהיה – רק עכשיו זה לא נתקע
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";
      ctx.shadowColor = color;
      ctx.shadowBlur = glow > 0 ? fontSize * glow : 0;

      for (let i = 0; i < colsRef.current; i++) {
        let y = dropsRef.current[i];
        if (y < 0) {
          if (y === -1 && Math.random() < 0.005) dropsRef.current[i] = 0;
          continue;
        }
        const x = i * colW;
        ctx.fillStyle = color;
        ctx.fillText(pick(), x, y);
        y += speed;
        dropsRef.current[i] =
          y > H ? (Math.random() < density ? 0 : -1) : y;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    /* ================= LIFECYCLE ================= */
    useEffect(() => {
      setSize();
      lastRef.current = 0;

      const onResize = () => setSize();

      const onVisibility = () => {
        if (document.visibilityState === "visible") {
          // 🔑 זה התיקון הקריטי
          cancelAnimationFrame(rafRef.current);
          lastRef.current = 0;
          setSize();
          rafRef.current = requestAnimationFrame(draw);
        }
      };

      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);

      if (!reduced) rafRef.current = requestAnimationFrame(draw);

      return () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        cancelAnimationFrame(rafRef.current);
      };
    }, [fontSize, speed, density, fps, color, glow, reduced]);

    return (
      <canvas
        ref={canvasRef}
        className={`matrix-rain-canvas ${className}`}
        aria-hidden="true"
      />
    );
  }

  /* ================= REDUCED MOTION ================= */
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
