import React, { useEffect, useRef, memo } from "react";

// Baseline values for scaling
const BASE_SPEED = 50;
const BASE_ACTIVATION = 0.003;
const BASE_GLOW = 0.18;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

const MatrixRainCanvas = memo(function MatrixRainCanvas({
  color = "#22c55e",
  fontSize = 16,
  fps = 30,
  speed = 20,
  density = 0.65,
  glow = 0.35,
  bg = "#000000",
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const streamsRef = useRef([]);
  const lastTimeRef = useRef(0);
  const layoutRef = useRef({ cols: 0, h: 0 }); // 🔑 Track columns and height
  const frameInterval = 1000 / fps;

  const rgb = hexToRgb(color);

  // 🔑 Reactive props Ref to avoid effect restarts and stale closures
  // Task: [x] Ensure Matrix Rain sliders (speed, density, glow) provide instant feedback
  const propsRef = useRef({ color, speed, density, glow, rgb });
  useEffect(() => {
    propsRef.current = { color, speed, density, glow, rgb: hexToRgb(color) };
  }, [color, speed, density, glow]);

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
      const cols = Math.floor(w / fontSize);

      // 🔑 Threshold check: only reset if the number of columns changes
      if (layoutRef.current.cols === cols && Math.abs(layoutRef.current.h - h) < fontSize) {
        return;
      }

      layoutRef.current = { cols, h };
      canvas.width = w;
      canvas.height = h;

      streamsRef.current = Array.from({ length: cols }, () => {
        const pool = chars.split("");
        return {
          active: Math.random() < propsRef.current.density,
          y: Math.random() * -h,
          // Store only variance here, base speed comes from props in draw loop
          speedVar: Math.random() * 8,
          trail:
            18 + Math.random() * 10,
          chars: Array.from({ length: 48 }, () =>
            pool[(Math.random() * pool.length) | 0]
          ),
          charPool: pool,
          charTimer: Math.random() * 0.16,
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

      // 🔑 Slightly adaptive background clearing
      ctx.fillStyle = `rgba(0, 0, 0, ${0.45 + dt * 0.4})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;

      streamsRef.current.forEach((s, col) => {
        const { density: d, speed: sp, glow: g, rgb: c } = propsRef.current;

        if (!s.active) {
          const chance = BASE_ACTIVATION * (d / 0.65);
          if (Math.random() < chance) {
            s.active = true;
            s.y = -fontSize * 2; // Start just above view
          }
          return;
        }

        const currentSpeed = (BASE_SPEED * (sp / 20)) + s.speedVar;
        s.y += currentSpeed * dt;
        s.charTimer += dt;

        if (s.charTimer >= 0.16) {
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

          const alpha = Math.pow(1 - i / s.trail, 1.6);
          const x = col * fontSize;
          const char = s.chars[i];

          // 🌟 DYNAMIC BLOOM (The "Glow" slider impact)
          if (i === 0 && g > 0) {
            ctx.save();
            // Head is always white for contrast
            ctx.fillStyle = "#fff";

            // Apply a powerful shadow blur that scales with g
            // g=0.01 -> blur=0.1, g=1.0 -> blur=fontSize*2
            ctx.shadowBlur = g * fontSize * 1.2;
            ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.8 + g * 0.2})`;

            ctx.fillText(char, x, y);

            // Optional: for very high glow, add a secondary additive pass
            if (g > 0.7) {
              ctx.globalCompositeOperation = "lighter";
              ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${(g - 0.7) * 2})`;
              ctx.fillText(char, x, y);
            }
            ctx.restore();
          } else {
            // Rest of the trail
            ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
            ctx.fillText(char, x, y);

            // Subtle trail glow for high settings
            if (i < 3 && g > 0.8) {
              ctx.save();
              ctx.globalAlpha = (3 - i) / 3 * (g - 0.8);
              ctx.shadowBlur = g * 5;
              ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, 1)`;
              ctx.fillText(char, x, y);
              ctx.restore();
            }
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
  }, [fontSize, fps]); // 🔥 Decoupled: only restart if grid dimensions change

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain-canvas"
      aria-hidden="true"
    />
  );
});

export default MatrixRainCanvas;
