// pcvPipeline.js
// Deterministic load pipeline: preflight, glass material, bounds, and self-tests.

import * as THREE from "three";

export const DEBUG = false;

/**
 * Smart preflight:
 * 1) Try HEAD
 * 2) If HEAD fails (500/blocked), try GET with Range bytes=0-0 (or plain GET)
 * 3) If still fails, DO NOT BLOCK: return { ok: true, softWarn }
 */
export async function preflightModel(url, { allowSoftPass = true } = {}) {
  const softPass = (msg) => {
    if (allowSoftPass) {
      console.warn("[PCV] Preflight soft-pass:", msg);
      return { ok: true, softWarn: msg };
    }
    return { ok: false, error: msg };
  };

  // 1) HEAD
  try {
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (head.ok) {
      const ct = head.headers.get("content-type") || "";
      const len = parseInt(head.headers.get("content-length") || "0", 10);
      if (!/gltf|model|octet-stream/i.test(ct)) {
        return softPass(`Unexpected Content-Type for ${url}: ${ct}`);
      }
      if (!(len > 0)) return softPass(`Empty file (content-length=0) for ${url}`);
      if (DEBUG) console.info("[PCV] Preflight HEAD OK:", { ct, len });
      return { ok: true };
    }
    // Non-OK HEAD
    console.warn("[PCV] HEAD not OK:", head.status, head.statusText);
  } catch (e) {
    console.warn("[PCV] HEAD failed:", e);
  }

  // 2) GET tiny (Range if supported)
  try {
    const get = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "no-store",
    });
    if (get.ok) {
      if (DEBUG) console.info("[PCV] Preflight GET OK");
      return { ok: true, softWarn: "HEAD blocked by server; continued with GET." };
    }
    console.warn("[PCV] GET not OK:", get.status, get.statusText);
  } catch (e) {
    console.warn("[PCV] GET failed:", e);
  }

  // 3) Soft pass (don’t block model loading)
  return softPass(`Server returned error on preflight for ${url}. Proceeding anyway.`);
}

/** Physical glass material for the side panel (real transparency; no white/opaque panel). */
export function makeGlassMaterial() {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.0,
    transparent: true,
    opacity: 0.18,
    transmission: 0.9,
    thickness: 0.004,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  mat.renderOrder = 20; // render after opaque
  return mat;
}

/** Force an existing material to behave as transparent and double-sided safely. */
export function forceTransparent(mat) {
  if (!mat) return;
  const apply = (m) => {
    m.transparent = true;
    m.opacity = Math.min(m.opacity ?? 1, 0.22);
    m.depthWrite = false;
    m.side = THREE.DoubleSide;
  };
  Array.isArray(mat) ? mat.forEach(apply) : apply(mat);
}

/** Aggregate visible bounds (world-space). */
export function computeVisibleBounds(root) {
  const box = new THREE.Box3();
  let ok = false;
  root.updateWorldMatrix(true, true);
  root.traverse((o) => {
    if (!o.visible || !o.isMesh || !o.geometry) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
    ok ? box.union(bb) : box.copy(bb);
    ok = true;
  });
  return ok ? box : null;
}

/** Post-normalization self tests with soft auto-correction. */
export function runSelfTests({ caseWrapper, camera, targetCenter }) {
  const b = computeVisibleBounds(caseWrapper);
  if (!b) throw new Error("No bounds after normalize");

  const diag = b.min.distanceTo(b.max);
  const dist = camera.position.distanceTo(targetCenter);
  const diagOk = diag > 0.1 && diag < 5.0; // normalized longest side ~= 1m
  const distOk = dist > 1.3 && dist < 1.7; // desired hero distance ~= 1.5m

  if (!diagOk || !distOk) {
    console.warn("[PCV] Self-tests out of range", { diag, dist });
    const dir = new THREE.Vector3()
      .subVectors(camera.position, targetCenter)
      .normalize();
    camera.position.copy(targetCenter.clone().addScaledVector(dir, 1.5));
    camera.lookAt(targetCenter);
    camera.updateProjectionMatrix();
  } else if (DEBUG) {
    console.info("[PCV] Self-tests OK", { diag, dist });
  }
}
