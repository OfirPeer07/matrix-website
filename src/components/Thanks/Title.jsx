import { useMemo } from "react";
import * as THREE from "three";

/* ================= TEXT POINTS ================= */
function useTitlePoints(text) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2800;
    canvas.height = 260;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 140px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];

    for (let y = 0; y < canvas.height; y += 6) {
      for (let x = 0; x < canvas.width; x += 6) {
        const i = (y * canvas.width + x) * 4;
        if (img.data[i] > 200) {
          points.push(
            new THREE.Vector3(
              (x - canvas.width / 2) * 0.01,
              (y - canvas.height / 2) * 0.01,
              (Math.random() - 0.5) * 0.6
            )
          );
        }
      }
    }

    return points;
  }, [text]);
}

/* ================= TITLE ================= */
export default function Title({ Diamond, text }) {
  const points = useTitlePoints(text);

  return (
    <group position={[0, -1.75, 0]} scale={-0.6}>
      {points.map((p, i) => (
        /* הזרקת צבע אדום קבוע ליהלומי הטקסט כדי שלא ישתנו עם הלב */
        <Diamond key={i} position={p} heartColor="#ff0000" />
      ))}
    </group>
  );
}