// src/components/Neo/Articles/OrbitalSphere3D.jsx
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/* ---------- Color helper: also accepts #RRGGBBAA ---------- */
function parseColor(input, defaultOpacity = 1) {
  if (input instanceof THREE.Color) return { color: input, opacity: defaultOpacity };
  if (typeof input === "string") {
    const m8 = /^#([0-9a-f]{8})$/i.exec(input);
    if (m8) {
      const v = m8[1];
      const r = parseInt(v.slice(0, 2), 16) / 255;
      const g = parseInt(v.slice(2, 4), 16) / 255;
      const b = parseInt(v.slice(4, 6), 16) / 255;
      const a = parseInt(v.slice(6, 8), 16) / 255;
      return { color: new THREE.Color(r, g, b), opacity: a };
    }
    return { color: new THREE.Color(input), opacity: defaultOpacity };
  }
  if (typeof input === "number") return { color: new THREE.Color(input), opacity: defaultOpacity };
  return { color: new THREE.Color("#ffffff"), opacity: defaultOpacity };
}

/* ------------------------ Public component ------------------------ */
export default function OrbitalSphere3D({
  width = 700,
  height = 700,

  // distribution / sizing
  pointCount = 1100,
  sphereRadius = 1.4,
  dotScale = 1.0,
  autoSize = true,

  // interaction
  kickRadius = 0.18,
  kickStrength = 1.6,
  returnSpring = 0.26,
  velDamping = 0.88,
  maxVel = 0.22,

  // sensitivity / return modifiers
  sensitivity = 1.0,
  returnBoost = 1.4,

  // base body (behind beads)
  baseColor = "#000000ff",
  baseMetalness = 0.05,
  baseRoughness = 0.45,
  baseClearcoat = 0.20,

  // beads (core)
  beadColor = "#000000ff",
  beadMetalness = 0.05,
  beadRoughness = 0.90,
  beadClearcoat = 0.05,
  beadClearcoatRoughness = 0.20,

  // neon rim (outline glow)
  rimEnabled = true,
  rimColor = "#000000ff",
  rimAlpha = 0.9,
  rimPower = 1.6,
  rimScale = 1.06,

  // performance
  fpsCap = 60,
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4.6], fov: 45, near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* simple lights */}
        <hemisphereLight args={["#00d0ffff", "#00ffffff", 0.35]} />
        <directionalLight position={[3, 2, 4]} intensity={0.6} />
        <directionalLight position={[-2, -1, -3]} intensity={0.25} />

        <Scene
          pointCount={pointCount}
          sphereRadius={sphereRadius}
          dotScale={dotScale}
          autoSize={autoSize}
          kickRadius={kickRadius}
          kickStrength={kickStrength}
          returnSpring={returnSpring}
          velDamping={velDamping}
          maxVel={maxVel}
          sensitivity={sensitivity}
          returnBoost={returnBoost}
          baseColor={baseColor}
          baseMetalness={baseMetalness}
          baseRoughness={baseRoughness}
          baseClearcoat={baseClearcoat}
          beadColor={beadColor}
          beadMetalness={beadMetalness}
          beadRoughness={beadRoughness}
          beadClearcoat={beadClearcoat}
          beadClearcoatRoughness={beadClearcoatRoughness}
          rimEnabled={rimEnabled}
          rimColor={rimColor}
          rimAlpha={rimAlpha}
          rimPower={rimPower}
          rimScale={rimScale}
          fpsCap={fpsCap}
        />
      </Canvas>
    </div>
  );
}

/* ---------------------------- Scene graph ---------------------------- */
function Scene(props) {
  const {
    pointCount, sphereRadius, dotScale, autoSize,
    kickRadius, kickStrength, returnSpring, velDamping, maxVel,
    sensitivity, returnBoost,
    baseColor, baseMetalness, baseRoughness, baseClearcoat,
    beadColor, beadMetalness, beadRoughness, beadClearcoat, beadClearcoatRoughness,
    rimEnabled, rimColor, rimAlpha, rimPower, rimScale,
    fpsCap,
  } = props;

  const baseMatDef = useMemo(() => parseColor(baseColor, 1), [baseColor]);

  return (
    <>
      {/* inner body behind beads */}
      <mesh>
        <sphereGeometry args={[sphereRadius * 0.985, 64, 64]} />
        <meshPhysicalMaterial
          color={baseMatDef.color}
          transparent={baseMatDef.opacity < 1}
          opacity={baseMatDef.opacity}
          metalness={baseMetalness}
          roughness={baseRoughness}
          clearcoat={baseClearcoat}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <BeadLayer
        count={pointCount}
        R={sphereRadius}
        dotScale={dotScale}
        autoSize={autoSize}
        kickRadius={kickRadius}
        kickStrength={kickStrength}
        returnSpring={returnSpring}
        velDamping={velDamping}
        maxVel={maxVel}
        sensitivity={sensitivity}
        returnBoost={returnBoost}
        beadColor={beadColor}
        beadMetalness={beadMetalness}
        beadRoughness={beadRoughness}
        beadClearcoat={beadClearcoat}
        beadClearcoatRoughness={beadClearcoatRoughness}
        rimEnabled={rimEnabled}
        rimColor={rimColor}
        rimAlpha={rimAlpha}
        rimPower={rimPower}
        rimScale={rimScale}
        fpsCap={fpsCap}
      />
    </>
  );
}

/* ------------------------------ Beads -------------------------------- */
function BeadLayer({
  count, R, dotScale, autoSize,
  kickRadius, kickStrength, returnSpring, velDamping, maxVel,
  sensitivity = 1.0, returnBoost = 1.4,
  beadColor, beadMetalness, beadRoughness, beadClearcoat, beadClearcoatRoughness,
  rimEnabled, rimColor, rimAlpha, rimPower, rimScale,
  fpsCap,
}) {
  const instRef = useRef();
  const rimRef  = useRef();
  const colliderRef = useRef();
  const { camera, raycaster, mouse, gl } = useThree();

  // Only enable interaction after pointer *actually* enters canvas
  const pointerActive = useRef(false);
  useEffect(() => {
    const el = gl.domElement;
    const onEnter = () => { pointerActive.current = true; };
    const onLeave = () => { pointerActive.current = false; };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  const effKickRadius = Math.max(0.01, Math.min(0.49, kickRadius * (0.85 + 0.30 * sensitivity)));
  const effKickStrength = kickStrength * (0.90 + 0.40 * sensitivity);
  const cosKick = useMemo(() => Math.cos(Math.PI * effKickRadius), [effKickRadius]);

  const base = useMemo(() => fibonacciSphere(count), [count]);
  const pos  = useMemo(() => base.slice(), [base]);
  const vel  = useMemo(() => new Float32Array(count * 3), [count]);

  const sizeMul = useMemo(() => {
    const a = new Float32Array(count);
    for (let i = 0; i < count; i++) a[i] = 0.96 + hash11(i * 0.123) * 0.10;
    return a;
  }, [count]);

  const baseBeadSize = useMemo(() => {
    if (!autoSize) return dotScale;
    const spacingUnit = Math.sqrt((4 * Math.PI) / count);
    return spacingUnit * R * 0.42;
  }, [autoSize, count, R, dotScale]);

  const beadMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: parseColor(beadColor).color,
        metalness: beadMetalness,
        roughness: beadRoughness,
        clearcoat: beadClearcoat,
        clearcoatRoughness: beadClearcoatRoughness,
      }),
    [beadColor, beadMetalness, beadRoughness, beadClearcoat, beadClearcoatRoughness]
  );

  const rimMat = useMemo(() => {
    const m = new THREE.MeshPhongMaterial({
      color: parseColor(rimColor).color,
      emissive: 0x000000,
      specular: 0x000000,
      shininess: 0,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uRimAlpha = { value: rimAlpha };
      shader.uniforms.uRimPower = { value: rimPower };
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <alphatest_fragment>",
        `
          #include <alphatest_fragment>
          float fres = pow( clamp(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 0.0, 1.0), uRimPower );
          diffuseColor.a = fres * uRimAlpha;
        `
      );
    };
    return m;
  }, [rimColor, rimAlpha, rimPower]);

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 2), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouseDir = useRef(new THREE.Vector3(0, 0, 1));
  const inside = useRef(false);

  // -------- Initial draw: perfect sphere before first frame --------
  useEffect(() => {
    if (!instRef.current) return;
    for (let i = 0; i < count; i++) {
      const ib = i * 3;
      const x = base[ib + 0], y = base[ib + 1], z = base[ib + 2];
      const s = baseBeadSize * dotScale * sizeMul[i];

      dummy.position.set(x * R, y * R, z * R);
      dummy.scale.setScalar(s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);

      if (rimEnabled && rimRef.current) {
        dummy.scale.setScalar(s * rimScale);
        dummy.updateMatrix();
        rimRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (rimEnabled && rimRef.current) rimRef.current.instanceMatrix.needsUpdate = true;
  }, [count, R, base, baseBeadSize, dotScale, sizeMul, rimEnabled, rimScale]);

  // -------- Frame loop --------
  const frameInterval = 1 / Math.max(1, Math.min(120, fpsCap));
  const accRef = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);

    // Only raycast when pointer is actually over the canvas
    if (pointerActive.current) {
      raycaster.setFromCamera(mouse, camera);
      const hit = colliderRef.current ? raycaster.intersectObject(colliderRef.current, false) : [];
      inside.current = hit.length > 0;
      if (inside.current) mouseDir.current.copy(hit[0].point).normalize();
    } else {
      inside.current = false;
    }

    // FPS cap
    accRef.current += dt;
    if (accRef.current < frameInterval) return;
    const step = accRef.current; accRef.current = 0;

    const springNow = inside.current ? returnSpring : returnSpring * returnBoost;

    for (let i = 0; i < count; i++) {
      const ib = i * 3;
      let x = pos[ib+0], y = pos[ib+1], z = pos[ib+2];
      let vx = vel[ib+0], vy = vel[ib+1], vz = vel[ib+2];

      if (inside.current) {
        const md = mouseDir.current;
        const dot = x*md.x + y*md.y + z*md.z;
        if (dot >= cosKick) {
          const infl = smoothstep(cosKick, 1.0, dot);
          let tx = x - md.x*dot, ty = y - md.y*dot, tz = z - md.z*dot;
          const inv = 1 / Math.max(1e-6, Math.hypot(tx,ty,tz));
          tx*=inv; ty*=inv; tz*=inv;
          const k = effKickStrength * infl;
          vx += tx*k; vy += ty*k; vz += tz*k;
        }
      }

      // dynamics
      vx *= velDamping; vy *= velDamping; vz *= velDamping;
      const vmag = Math.hypot(vx,vy,vz);
      if (vmag > maxVel) { const s = maxVel/vmag; vx*=s; vy*=s; vz*=s; }

      x += vx*step; y += vy*step; z += vz*step;

      // spring back to base (+boost when pointer not inside)
      const bx = base[ib+0], by = base[ib+1], bz = base[ib+2];
      x = x + (bx - x)*springNow;
      y = y + (by - y)*springNow;
      z = z + (bz - z)*springNow;
      const inv = 1 / Math.max(1e-6, Math.hypot(x,y,z));
      x*=inv; y*=inv; z*=inv;

      // remove velocity along normal for nicer sticking to surface
      const vdotn = vx*x + vy*y + vz*z;
      vx -= vdotn*x; vy -= vdotn*y; vz -= vdotn*z;

      pos[ib+0]=x; pos[ib+1]=y; pos[ib+2]=z;
      vel[ib+0]=vx; vel[ib+1]=vy; vel[ib+2]=vz;

      const s = baseBeadSize * dotScale * sizeMul[i];
      dummy.position.set(x*R, y*R, z*R);
      dummy.scale.setScalar(s);
      dummy.rotation.set(0,0,0);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);

      if (rimEnabled && rimRef.current) {
        dummy.scale.setScalar(s * rimScale);
        dummy.updateMatrix();
        rimRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (rimEnabled && rimRef.current) rimRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* invisible collider for pointer hits */}
      <mesh ref={colliderRef} visible={false}>
        <sphereGeometry args={[R, 32, 32]} />
        <meshBasicMaterial />
      </mesh>

      {/* bead cores */}
      <instancedMesh ref={instRef} args={[geo, beadMat, count]} />

      {/* neon rims */}
      {rimEnabled && <instancedMesh ref={rimRef} args={[geo, rimMat, count]} />}
    </>
  );
}

/* ------------------------------- Utils -------------------------------- */
function fibonacciSphere(n) {
  const out = new Float32Array(n * 3);
  const g = (1 + Math.sqrt(5)) / 2;
  for (let i=0;i<n;i++){
    const t = (i + 0.5) / n;
    const th = (2 * Math.PI * i) / g;
    const ph = Math.acos(1 - 2 * t);
    out[i*3+0] = Math.sin(ph) * Math.cos(th);
    out[i*3+1] = Math.sin(ph) * Math.sin(th);
    out[i*3+2] = Math.cos(ph);
  }
  return out;
}
function smoothstep(a,b,x){ x=(x-a)/(b-a); return x<0?0:x>1?1:x*x*(3-2*x); }
function fract(x){ return x - Math.floor(x); }
function hash11(x){ return fract(Math.sin(x*12.9898)*43758.5453123); }
