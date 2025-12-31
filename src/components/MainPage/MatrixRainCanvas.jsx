import React, { useEffect, useRef } from "react";

export default function MatrixRainCanvas({
  color = "#22c55e",
  glow = 0.35,
  fontSize = 16,
  speed = 20,
  density = 0.6,
  fps = 30,
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(0);

  const dropsRef = useRef([]);
  const colsRef = useRef(0);

  const lastFrameRef = useRef(0);
  const frameInterval = 1000 / fps;

  const chars = 
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
  "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w;
      canvas.height = h;

      const cols = Math.floor(w / fontSize);
      colsRef.current = cols;

      dropsRef.current = Array.from({ length: cols }, () =>
        Math.random() < density ? Math.random() * -h : Infinity
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now) => {
      if (now - lastFrameRef.current < frameInterval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = now;

      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = fontSize * glow;

      dropsRef.current.forEach((y, i) => {
        if (y === Infinity) return;

        const x = i * fontSize;
        const char = chars[(Math.random() * chars.length) | 0];
        ctx.fillText(char, x, y);

        dropsRef.current[i] =
          y > canvas.height ? Math.random() * -canvas.height : y + speed;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, glow, fontSize, speed, density, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      aria-hidden="true"
    />
  );
}
