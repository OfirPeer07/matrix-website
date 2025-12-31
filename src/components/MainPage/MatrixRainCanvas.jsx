import React, { useEffect, useRef } from "react";

/* ===== Calm preset (polished) ===== */
const PRESET = {
  fallSpeed: 55,
  speedVariance: 6,
  trailMin: 18,
  trailMax: 28,
  charInterval: 0.16,
  gamma: 1.6,
  activationChance: 0.003,
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export default function MatrixRainCanvas({
  color = "#22c55e",
  fontSize = 16,
  fps = 30,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const streamsRef = useRef([]);
  const lastTimeRef = useRef(0);
  const frameInterval = 1000 / fps;

  const rgb = hexToRgb(color);

  const chars =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
    "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "0123456789";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w;
      canvas.height = h;

      const cols = Math.floor(w / fontSize);

      streamsRef.current = Array.from({ length: cols }, () => {
        const pool = chars.split("");
        return {
          active: Math.random() < 0.7,
          y: Math.random() * -h,
          speed:
            PRESET.fallSpeed +
            Math.random() * PRESET.speedVariance,
          trail:
            PRESET.trailMin +
            Math.random() *
              (PRESET.trailMax - PRESET.trailMin),
          chars: Array.from({ length: 48 }, () =>
            pool[(Math.random() * pool.length) | 0]
          ),
          charPool: pool,
          charTimer: Math.random() * PRESET.charInterval,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now) => {
      if (now - lastTimeRef.current < frameInterval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const w = canvas.width;
      const h = canvas.height;

      // 🔑 slightly adaptive background clearing
      ctx.fillStyle = `rgba(0, 0, 0, ${0.45 + dt * 0.4})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;

      streamsRef.current.forEach((s, col) => {
        if (!s.active) {
          if (Math.random() < PRESET.activationChance) {
            s.active = true;
            s.y = -Math.random() * h;
          }
          return;
        }

        s.y += s.speed * dt;
        s.charTimer += dt;

        if (s.charTimer >= PRESET.charInterval) {
          s.charTimer = 0;
          s.chars.pop();
          s.chars.unshift(
            s.charPool[
              (Math.random() * s.charPool.length) | 0
            ]
          );
        }

        for (let i = 0; i < s.trail; i++) {
          const y = s.y - i * fontSize;
          if (y < 0 || y > h) continue;

          const x = col * fontSize;
          const char = s.chars[i];

          const alpha = Math.pow(
            1 - i / s.trail,
            PRESET.gamma
          );

          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx.fillText(char, x, y);

          // subtle fake glow
          if (i === 0) {
            ctx.globalAlpha = alpha * 0.18;
            ctx.fillText(char, x + 1, y);
            ctx.fillText(char, x - 1, y);
            ctx.fillText(char, x, y + 1);
            ctx.fillText(char, x, y - 1);
            ctx.globalAlpha = 1;
          }
        }

        if (s.y - s.trail * fontSize > h) {
          s.active = false;
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [fontSize, fps, color]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      aria-hidden="true"
    />
  );
}
