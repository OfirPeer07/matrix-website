// src/components/AgentSmith/BuildingComputers/BuildingComputers.jsx
import React from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  ContactShadows,
  useProgress,
} from "@react-three/drei";
import "./BuildingComputers.css";
import RoutedCable from "./RoutedCable";
import { buildPortsFromBounds } from "./utils/ports";
import { buildRoutedPath } from "./utils/cableRoutes";

/* ─────────────────────────────────────────
   Scene constants
────────────────────────────────────────── */
const BG = "#0b1320";
const FLOOR = "#151b2a";
const TARGET_LONGEST_M = 1.0;
const SIDE_REGEX = /(side|panel|glass|door)/i;

/* ─────────────────────────────────────────
   Parts under /public/pc_parts/
────────────────────────────────────────── */
const PARTS = {
  mb_ATX: "/pc_parts/motherboard_ATX.glb",
  mb_mATX: "/pc_parts/motherboard_mATX.glb",
  mb_ITX: "/pc_parts/motherboard_ITX.glb",
  psu_ATX: "/pc_parts/psu_ATX.glb",
  gpu_large: "/pc_parts/gpu_large.glb",
  fan120: "/pc_parts/fan_120mm.glb",
  ssd25: "/pc_parts/ssd_2_5in.glb",
  hdd35: "/pc_parts/hdd_3_5in.glb",
};
Object.values(PARTS).forEach((u) => useGLTF.preload?.(u));

/* ─────────────────────────────────────────
   Helpers
────────────────────────────────────────── */
function computeVisibleBounds(root) {
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

const dominantAxisOf = (v3) => {
  const ax = Math.abs(v3.x);
  const ay = Math.abs(v3.y);
  const az = Math.abs(v3.z);
  if (ax >= ay && ax >= az) return "x";
  if (az >= ax && az >= ay) return "z";
  return "y";
};

/* Motherboard sizing */
const MB_SPECS = {
  ATX: { w: 0.305, h: 0.244, t: 0.002 },
  mATX: { w: 0.244, h: 0.244, t: 0.002 },
  ITX: { w: 0.17, h: 0.17, t: 0.002 },
};

function computeMotherboardPose({
  caseGroup,
  panelSlideDir,
  form = "ATX",
  spacer = 0.007,
}) {
  const specs = MB_SPECS[form] || MB_SPECS.ATX;
  const bounds = computeVisibleBounds(caseGroup);
  if (!bounds)
    return { size: [specs.w, specs.t, specs.h], pos: [0, specs.h * 0.5, 0] };

  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());

  // wall opposite the glass
  const dir = (panelSlideDir ? panelSlideDir.clone() : new THREE.Vector3(1, 0, 0))
    .normalize()
    .multiplyScalar(-1);
  const ax = dominantAxisOf(dir);

  let x = center.x;
  let z = center.z;
  const margin = spacer;

  if (ax === "x") {
    const isMax = dir.x > 0;
    const wall = isMax ? bounds.max.x : bounds.min.x;
    x = wall + (isMax ? -margin : +margin);
  } else {
    const isMax = dir.z > 0;
    const wall = isMax ? bounds.max.z : bounds.min.z;
    z = wall + (isMax ? -margin : +margin);
  }

  const y = bounds.min.y + Math.min(size.y * 0.55, specs.h * 0.6);
  return { size: [specs.w, specs.t, specs.h], pos: [x, y, z] };
}

/* ─────────────────────────────────────────
   Controls – hero view *constant*
────────────────────────────────────────── */
function SceneControls({ reframeKey, heroDirRef, controlsRef, enabled }) {
  const { camera } = useThree();
  const localRef = React.useRef();

  // expose controls to parent (optional)
  React.useEffect(() => {
    if (!controlsRef) return;
    controlsRef.current = localRef.current || null;
  }, [controlsRef]);

  // hero frame – always same distance & center (deterministic)
  React.useEffect(() => {
    const center = new THREE.Vector3(0.55, 0.55, 0);
    const dist = 1.5;

    const dir = heroDirRef.current.clone().normalize();
    const pos = center.clone().addScaledVector(dir, dist);

    camera.position.copy(pos);
    camera.near = 0.01;
    camera.far = 50;
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    if (localRef.current) {
      localRef.current.target.copy(center);
      localRef.current.update();
    }
  }, [camera, reframeKey, heroDirRef]);

  return (
    <OrbitControls
      ref={localRef}
      makeDefault
      enabled={!!enabled}
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.02}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}

/* ─────────────────────────────────────────
   Loaders
────────────────────────────────────────── */
function LoaderHUD() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <Html center wrapperClass="pcv-loader">
      <div className="pcv-loader-card">
        <div className="pcv-spinner" />
        <div className="pcv-loader-text">Loading… {progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

function DomLoader({ show }) {
  if (!show) return null;
  return (
    <div
      className="pcv-loader"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        zIndex: 5,
      }}
    >
      <div className="pcv-loader-card">
        <div className="pcv-spinner" />
        <div className="pcv-loader-text">Loading…</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Case GLB + panel detection
   FIX: Clones the scene so navigation doesn't get dirty cache
────────────────────────────────────────── */
function CaseGLB({ url, onReady, onPanel }) {
  const { scene: masterScene } = useGLTF(url, true, true);

  // CLONE the scene. This ensures we have a fresh copy every time we visit.
  const scene = React.useMemo(() => {
    return masterScene ? masterScene.clone() : null;
  }, [masterScene]);

  React.useEffect(() => {
    if (!scene) return;

    scene.traverse((n) => {
      if (!n.isMesh) return;
      n.castShadow = n.receiveShadow = true;
      if (n.material) n.material.side = THREE.DoubleSide;
    });

    let candidate = null;
    scene.traverse((n) => {
      if (!n.isMesh) return;
      if (SIDE_REGEX.test(n.name || "")) candidate = n;
    });

    if (!candidate) {
      let best = null,
        bestScore = -Infinity;
      const whole = computeVisibleBounds(scene);
      scene.traverse((n) => {
        if (!n.isMesh || !n.geometry) return;
        if (!n.geometry.boundingBox) n.geometry.computeBoundingBox();
        const bb = n.geometry.boundingBox.clone().applyMatrix4(n.matrixWorld);
        const s = bb.getSize(new THREE.Vector3());
        const slab =
          Math.min(s.x, s.y, s.z) / Math.max(s.x, s.y, s.z) < 0.06;
        if (!slab) return;
        const area = s.x * s.y + s.x * s.z + s.y * s.z;
        const nearSide = Math.min(
          Math.abs(bb.min.x - whole.min.x),
          Math.abs(bb.max.x - whole.max.x),
          Math.abs(bb.min.z - whole.min.z),
          Math.abs(bb.max.z - whole.max.z)
        );
        const score = area - nearSide * 10;
        if (score > bestScore) {
          bestScore = score;
          best = n;
        }
      });
      candidate = best;
    }

    onPanel?.(candidate || null);
    onReady?.(scene);
  }, [scene, onReady, onPanel]);

  return scene ? <primitive object={scene} /> : null;
}

/* ─────────────────────────────────────────
   Panel animation ticker
────────────────────────────────────────── */
function SceneTicker({ panelRef, panelAnim }) {
  useFrame((_, dt) => {
    const p = panelRef.current;
    const a = panelAnim.current;
    if (!p || !a.active) return;
    a.t += dt / a.dur;
    const k = a.t >= 1 ? 1 : 1 - Math.pow(1 - a.t, 3);
    p.position.lerpVectors(a.from, a.to, k);
    if (p.material)
      p.material.opacity = THREE.MathUtils.lerp(a.fadeFrom, a.fadeTo, k);
    if (a.t >= 1) a.active = false;
  });
  return null;
}

/* ─────────────────────────────────────────
   GLB Part wrapper
   FIX: Clones scene so parts don't drift on re-entry
────────────────────────────────────────── */
function Part({ url, refOut, onLoaded, ...rest }) {
  const { scene: masterScene } = useGLTF(url);
  
  // Clone to prevent shared state issues between mounts
  const scene = React.useMemo(() => {
    return masterScene ? masterScene.clone() : null;
  }, [masterScene]);

  const localRef = React.useRef();

  React.useEffect(() => {
    if (!scene) return;
    const group = new THREE.Group();
    group.add(scene);
    localRef.current = group;
    onLoaded?.(group);
    if (typeof refOut === "function") refOut(group);
    else if (refOut && "current" in refOut) refOut.current = group;
    return () => {
      // Clean up: remove from parent if needed, though React handles unmount
      if (group.parent) group.parent.remove(group);
    };
  }, [scene, onLoaded, refOut]);

  return localRef.current ? (
    <primitive object={localRef.current} {...rest} />
  ) : null;
}

/* ─────────────────────────────────────────
   Bridge camera + canvas for overlay
────────────────────────────────────────── */
function Bridge({ setCamera, setDom }) {
  const { camera, gl } = useThree();
  React.useEffect(() => {
    setCamera?.(camera);
    setDom?.(gl.domElement);
  }, [camera, gl, setCamera, setDom]);
  return null;
}

/* ─────────────────────────────────────────
   Main component
────────────────────────────────────────── */
export default function BuildingComputers({
  glbUrl = "/models/pc.glb",
  motherboardForm = "ATX",
}) {
  // We no longer need sessionStorage logic because we are CLONING the GLTF.
  // Every time this component mounts, it gets a fresh scene instance.
  
  const caseWrapper = React.useRef(new THREE.Group());
  const panelLayer = React.useRef(new THREE.Group());
  const panelRef = React.useRef(null);

  const mbRef = React.useRef(null);
  const psuRef = React.useRef(null);
  const gpuRef = React.useRef(null);

  const [reframeKey, setReframeKey] = React.useState(0);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [err, setErr] = React.useState("");

  const [camera, setCamera] = React.useState(null);
  const [domEl, setDomEl] = React.useState(null);
  const controlsRef = React.useRef(null);

  // Keep your original deterministic hero direction
  const heroDirRef = React.useRef(new THREE.Vector3(-0.6, 0.35, 0.72));

  const [caseReady, setCaseReady] = React.useState(false);
  const [panelKnown, setPanelKnown] = React.useState(false);

  // Controls are locked after ready to prevent orbit drift on re-entry
  const [controlsEnabled, setControlsEnabled] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const panelAnim = React.useRef({
    active: false,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    t: 0,
    dur: 0.35,
    fadeFrom: 1,
    fadeTo: 0.2,
  });

  const doHeroFrame = React.useCallback(() => {
    setReframeKey((k) => k + 1);
  }, []);

  /* Normalize the case */
  const normalize = React.useCallback((scene) => {
    const before = computeVisibleBounds(scene);
    if (!before) throw new Error("Empty bounds");

    // center around origin
    const c0 = before.getCenter(new THREE.Vector3());
    scene.position.sub(c0);

    // scale to 1m longest side
    const size = before.getSize(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1e-3;
    caseWrapper.current.scale.setScalar(TARGET_LONGEST_M / longest);

    // drop so that bottom touches y=0
    const after = computeVisibleBounds(caseWrapper.current);
    if (after) caseWrapper.current.position.y -= after.min.y;

    setCaseReady(true);
  }, []);

  /* Reparent panel; set hero direction AWAY from glass */
  const adoptPanel = React.useCallback((mesh) => {
    if (!mesh) return;
    
    // Ensure the mesh is actually part of the scene before moving it
    // This prevents errors if re-calculating on an already moved mesh
    mesh.updateWorldMatrix(true, true);
    const wm = mesh.matrixWorld.clone();
    
    panelLayer.current.add(mesh);
    
    const inv = panelLayer.current.matrixWorld.clone().invert();
    mesh.applyMatrix4(inv.multiply(wm));

    // Force glass look
    if (mesh.material) {
      mesh.material.transparent = true;
      mesh.material.depthWrite = false;
      mesh.material.opacity = 0.25;
      mesh.material.side = THREE.DoubleSide;
      mesh.material.color = new THREE.Color(0xffffff); // keep neutral; lit by env
      mesh.material.visible = false; // enabled once known
    }
    panelRef.current = mesh;

    if (!mesh.userData.home) {
      mesh.userData.home = mesh.position.clone();

      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const bb = mesh.geometry.boundingBox;
      const s = bb.getSize(new THREE.Vector3());
      const nLocal =
        s.x < s.y && s.x < s.z
          ? new THREE.Vector3(1, 0, 0)
          : s.y < s.x && s.y < s.z
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);

      const nWorld = nLocal
        .clone()
        .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()));
      const nLayer = nWorld
        .applyMatrix3(
          new THREE.Matrix3().setFromMatrix4(
            panelLayer.current.matrixWorld.clone().invert()
          )
        )
        .normalize();

      mesh.userData.slideDir = nLayer;
      mesh.userData.slideDist = 0.35;

      // Keep your original hero dir logic (away from panel)
      const away = nLayer.clone().negate();
      away.y = 0;
      if (away.lengthSq() < 1e-6) away.set(1, 0, 0);
      away.normalize();
      away.set(away.x, 0.35, away.z).normalize();
      heroDirRef.current.copy(away);
    }
    setPanelKnown(true);
  }, []);

  const onModelReady = React.useCallback(
    (scene) => {
      try {
        normalize(scene);
      } catch (e) {
        setErr(String(e?.message || e));
      }
    },
    [normalize]
  );

  const onPanelFound = React.useCallback((mesh) => mesh && adoptPanel(mesh), [adoptPanel]);

  /* VISIBILITY + HERO FRAME + CONTROL LOCK */
  React.useEffect(() => {
    if (!caseReady) return;
    doHeroFrame();
    setVisible(true);
  }, [caseReady, doHeroFrame]);

  React.useEffect(() => {
    if (!caseReady || !panelKnown) return;
    // Show panel and set consistent opacity
    const p = panelRef.current;
    if (p?.material) {
      p.material.visible = true;
      p.material.opacity = 0.25;
    }

    // Reframe and briefly lock controls to avoid drift/race
    doHeroFrame();
    setControlsEnabled(false);
    const t = setTimeout(() => setControlsEnabled(true), 1200);
    return () => clearTimeout(t);
  }, [caseReady, panelKnown, doHeroFrame]);

  /* Toggle panel */
  const togglePanel = React.useCallback(() => {
    const p = panelRef.current;
    if (!p) return;
    const home = p.userData.home?.clone() || p.position.clone();
    const dir = p.userData.slideDir || new THREE.Vector3(0, 0, 1);
    const dist = p.userData.slideDist ?? 0.35;
    const open = home.clone().add(dir.clone().multiplyScalar(dist));

    const toOpen = !panelOpen;
    panelAnim.current = {
      active: true,
      from: p.position.clone(),
      to: toOpen ? open : home,
      fadeFrom: p.material?.opacity ?? 0.25,
      fadeTo: toOpen ? 0.15 : 0.25,
      t: 0,
      dur: 0.35,
    };
    setPanelOpen(toOpen);
  }, [panelOpen]);

  /* Steps UI */
  const STEPS = React.useMemo(
    () => ["Motherboard", "CPU", "Cooler", "RAM", "GPU", "Storage", "PSU", "Cables"],
    []
  );
  const [step, setStep] = React.useState(0);
  const [installed, setInstalled] = React.useState([]);

  const installCurrent = React.useCallback(() => {
    setInstalled((prev) => {
      const key = STEPS[step];
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, STEPS]);

  /* Quick placements */
  const computeGPUPosition = React.useCallback(() => {
    const b = computeVisibleBounds(caseWrapper.current);
    if (!b) return [0, 0.2, 0.1];
    const size = b.getSize(new THREE.Vector3());
    const y = b.min.y + size.y * 0.45;
    const z = b.min.z + size.z * 0.15;
    const slideDir =
      panelRef.current?.userData?.slideDir || new THREE.Vector3(1, 0, 0);
    const dir = slideDir.clone().multiplyScalar(-1);
    const ax = dominantAxisOf(dir);
    let x = (b.min.x + b.max.x) / 2;
    const margin = 0.03;
    if (ax === "x") {
      const isMax = dir.x > 0;
      const wall = isMax ? b.max.x : b.min.x;
      x = wall + (isMax ? -margin : +margin);
    }
    return [x, y, z];
  }, []);

  const computePSUPosition = React.useCallback(() => {
    const b = computeVisibleBounds(caseWrapper.current);
    if (!b) return [0, 0.05, -0.3];
    const y = b.min.y + 0.06;
    const z = b.max.z - 0.09;
    const x = (b.min.x + b.max.x) / 2;
    return [x, y, z];
  }, []);

  /* Ports from bounds */
  const [ports, setPorts] = React.useState({});
  const refreshPorts = React.useCallback(() => {
    const byPart = {};
    if (mbRef.current) byPart.motherboard = computeVisibleBounds(mbRef.current);
    if (gpuRef.current) byPart.gpu = computeVisibleBounds(gpuRef.current);
    if (psuRef.current) byPart.psu = computeVisibleBounds(psuRef.current);
    setPorts(buildPortsFromBounds(byPart));
  }, []);

  React.useEffect(() => {
    refreshPorts();
  }, [installed, refreshPorts]);

  /* Cable overlay: PSU → GPU/MB */
  const [cableStart, cableEnd] = React.useMemo(() => {
    if (!psuRef.current || !camera || !domEl) return [null, null];
    const hasGpu = installed.includes("GPU");
    const hasMb = installed.includes("Motherboard");

    const hasGpuPorts = ports.psu_pcie && ports.gpu_pcie8_1;
    const hasMbPorts = ports.psu_atx24 && ports.atx24;

    if (hasGpu && hasGpuPorts)
      return [ports.psu_pcie.clone(), ports.gpu_pcie8_1.clone()];
    if (hasMb && hasMbPorts)
      return [ports.psu_atx24.clone(), ports.atx24.clone()];
    return [null, null];
  }, [installed, ports, camera, domEl]);

  const route3D = React.useMemo(() => {
    if (!cableStart || !cableEnd) return null;
    const b = computeVisibleBounds(caseWrapper.current);
    if (!b) return null;
    const mid = cableStart
      .clone()
      .lerp(cableEnd, 0.5)
      .add(new THREE.Vector3(0, 0.05, 0));
    const size = b.getSize(new THREE.Vector3());
    const wallX =
      size.x >= size.z
        ? cableStart.x < cableEnd.x
          ? b.min.x + 0.02
          : b.max.x - 0.02
        : null;
    const wallZ =
      size.z > size.x
        ? cableStart.z < cableEnd.z
          ? b.min.z + 0.02
          : b.max.z - 0.02
        : null;
    return buildRoutedPath({
      start: cableStart,
      end: cableEnd,
      guides: [mid],
      wallX,
      wallZ,
    });
  }, [cableStart, cableEnd]);

  const stepHelp = {
    Motherboard:
      "Mount the motherboard on standoffs; don’t overtighten screws.",
    CPU: "Open the socket lever, align the triangle, place CPU gently, lock.",
    Cooler: "Apply a pea-sized thermal paste; mount cooler firmly.",
    RAM: "Use matched slots per the manual; press until latches click.",
    GPU: "Insert into the top PCIe x16; secure with screws.",
    Storage:
      "NVMe: use standoff; SATA: secure into cage and wire to SATA port.",
    PSU: "Fan intake direction depends on case; mount with 4 screws.",
    Cables: "24-pin ATX, 8-pin EPS, PCIe 6/8-pin(s), SATA power; route cleanly.",
  };

  return (
    <div className="pcv-root">
      <div className="pcv-toolbar">
        <button className="pcv-btn" onClick={togglePanel}>
          {panelOpen ? "Attach Side Panel" : "Remove Side Panel"}
        </button>
        <button className="pcv-btn pcv-primary" onClick={installCurrent}>
          Install {STEPS[step]}
        </button>
        <button
          className="pcv-btn"
          onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
        >
          Skip
        </button>
        <button className="pcv-btn" onClick={doHeroFrame}>
          Reset View
        </button>
        <div style={{ flex: 1 }} />
        <div className="pcv-step">
          Step {step + 1}/{STEPS.length}: <strong>{STEPS[step]}</strong> – {stepHelp[STEPS[step]]}
        </div>
        <div className="pcv-installed">
          Installed: {installed.join(", ") || "—"}
        </div>
      </div>

      <div className="pcv-canvas" style={{ position: "relative" }}>
        <DomLoader show={!visible} />

        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity .18s ease",
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas
            // Key is no longer needed for cache busting, but good for react-reset
            key="pc-builder-canvas"
            style={{ background: BG }}
            shadows
            dpr={[1, 2]}
            camera={{ fov: 40, near: 0.05, far: 500, position: [1.6, 0.8, 1.8] }}
            gl={{ powerPreference: "high-performance", antialias: true }}
            onCreated={({ gl, camera }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.0;
              camera.lookAt(0, 0.4, 0);
            }}
          >
            <Bridge setCamera={setCamera} setDom={setDomEl} />

            {route3D && (
              <RoutedCable
                start={route3D[0]}
                end={route3D[route3D.length - 1]}
                guides={route3D.slice(1, -1)}
                segments={32}
                lift={0.06}
                stroke="#9ca3af"
                strokeWidth={2}
              />
            )}

            <color attach="background" args={[BG]} />
            <hemisphereLight args={[0xffffff, 0x1a2230, 0.85]} />
            <directionalLight
              position={[6, 8, 8]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-8, 6, -6]} intensity={0.35} />

            {/* Ground */}
            <gridHelper args={[8, 32, "#41506d", "#1d2738"]} position={[0, 0.001, 0]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
              <planeGeometry args={[8, 8]} />
              <meshStandardMaterial color={FLOOR} roughness={0.92} metalness={0.08} />
            </mesh>
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.35}
              scale={6}
              blur={2.2}
              far={2.2}
              resolution={1024}
              frames={1}
            />

            {/* Normalized case + parts */}
            <group ref={caseWrapper}>
              <primitive object={panelLayer.current} />

              <React.Suspense fallback={<LoaderHUD />}>
                <CaseGLB url={glbUrl} onReady={onModelReady} onPanel={onPanelFound} />
              </React.Suspense>

              {installed.includes("Motherboard") &&
                (() => {
                  const slideDir =
                    panelRef.current?.userData?.slideDir || new THREE.Vector3(1, 0, 0);
                  const { pos } = computeMotherboardPose({
                    caseGroup: caseWrapper.current,
                    panelSlideDir: slideDir,
                    form: motherboardForm,
                    spacer: 0.007,
                  });
                  const url =
                    motherboardForm === "ITX"
                      ? PARTS.mb_ITX
                      : motherboardForm === "mATX"
                      ? PARTS.mb_mATX
                      : PARTS.mb_ATX;
                  return (
                    <group position={pos}>
                      <Part url={url} refOut={mbRef} onLoaded={refreshPorts} castShadow receiveShadow />
                    </group>
                  );
                })()}

              {installed.includes("GPU") &&
                (() => {
                  const p = computeGPUPosition();
                  return (
                    <Part
                      url={PARTS.gpu_large}
                      refOut={gpuRef}
                      onLoaded={refreshPorts}
                      position={p}
                      castShadow
                      receiveShadow
                    />
                  );
                })()}

              {installed.includes("PSU") &&
                (() => {
                  const p = computePSUPosition();
                  return (
                    <Part
                      url={PARTS.psu_ATX}
                      refOut={psuRef}
                      onLoaded={refreshPorts}
                      position={p}
                      castShadow
                      receiveShadow
                    />
                  );
                })()}

              {installed.includes("Storage") && <Part url={PARTS.ssd25} position={[0, 0.12, -0.28]} />}

              {installed.includes("Cooler") && <Part url={PARTS.fan120} position={[0.22, 0.3, 0]} />}
            </group>

            <SceneTicker panelRef={panelRef} panelAnim={panelAnim} />

            <SceneControls
              reframeKey={reframeKey}
              heroDirRef={heroDirRef}
              controlsRef={controlsRef}
              enabled={controlsEnabled}
            />

            <Environment preset="city" />
          </Canvas>
        </div>

        {err && (
          <div className="pcv-error" role="alert">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}