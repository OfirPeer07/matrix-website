// src/components/AgentSmith/BuildingComputers/utils/cableRoutes.js
import * as THREE from "three";

/**
 * buildRoutedPath
 *
 * start: THREE.Vector3
 * end:   THREE.Vector3
 * guides: [THREE.Vector3, ...]  (optional mid points)
 * wallX / wallZ: if given, intermediate points will hug that plane.
 */
export function buildRoutedPath({
  start,
  end,
  guides = [],
  wallX = null,
  wallZ = null,
}) {
  if (!start || !end) return null;

  const pts = [start.clone(), ...guides.map((g) => g.clone()), end.clone()];

  // Snap mid points slightly to a wall plane if provided
  if (wallX !== null || wallZ !== null) {
    for (let i = 1; i < pts.length - 1; i++) {
      if (wallX !== null) {
        pts[i].x = THREE.MathUtils.lerp(pts[i].x, wallX, 0.65);
      }
      if (wallZ !== null) {
        pts[i].z = THREE.MathUtils.lerp(pts[i].z, wallZ, 0.65);
      }
    }
  }

  // Give a small vertical lift to middle points to avoid clipping
  for (let i = 1; i < pts.length - 1; i++) {
    pts[i].y += 0.02;
  }

  return pts;
}