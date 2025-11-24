// src/components/AgentSmith/BuildingComputers/RoutedCable.jsx
// Safe cable: pure React + three; NO R3F hooks used.

import React from "react";
import * as THREE from "three";

function makeCurvePoints(start, end, guides, segments) {
  const nodes = [start, ...(guides || []), end].map((v) => v.clone());
  const curve = new THREE.CatmullRomCurve3(nodes, false, "catmullrom", 0.5);
  return curve.getPoints(Math.max(segments, 4));
}

export default function RoutedCable({
  start,
  end,
  guides = [],
  segments = 32,
  stroke = "#9ca3af",
  strokeWidth = 2,
  lift = 0.0,
}) {
  const points = React.useMemo(() => {
    if (!start || !end) return null;
    const mids = [...guides];
    if (lift !== 0) {
      mids.unshift(start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, lift, 0)));
    }
    return makeCurvePoints(start, end, mids, segments);
  }, [start, end, guides, segments, lift]);

  const geom = React.useMemo(() => {
    if (!points) return null;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      pos[i * 3 + 0] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.computeBoundingSphere();
    return g;
  }, [points]);

  React.useEffect(() => () => geom?.dispose(), [geom]);

  if (!geom) return null;

  return (
    <line>
      <primitive attach="geometry" object={geom} />
      <lineBasicMaterial attach="material" color={stroke} linewidth={strokeWidth} />
    </line>
  );
}
