import React, { Suspense, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import "./BuildingComputers.css";
import {
  O11CaseModel,
  MotherboardPart,
  CpuPart,
  CpuCoolerPart,
  RamPart,
  GpuPart,
  PsuPart,
  StoragePart,
  FanPart,
} from "./PCParts";


// All models are now procedural — no GLB files needed.

const REDUCE_MOTION = false;

const CONNECTION_REQUIREMENTS = {
  motherboard: [],
  psu: ["motherboard"],
  cpu: ["motherboard"],
  ram: ["motherboard"],
  storage: ["motherboard", "psu"],
  gpu: ["motherboard", "psu"],
  fan: ["motherboard", "psu"],
  panel: ["motherboard", "psu", "cpu", "ram", "storage", "gpu", "fan"],
};

const CONNECTION_ORDER = ["motherboard", "psu", "cpu", "ram", "storage", "gpu", "fan", "panel"];

const PARTS = [
  {
    id: "motherboard",
    label: "Motherboard",
    icon: "🖥️",
    slot: "motherboard",
    description: "Backbone for every connection and bus lane.",
    options: [
      { id: "mb-atx", label: "ATX" },
      { id: "mb-matx", label: "mATX" },
      { id: "mb-itx", label: "ITX" },
    ],
    defaultOption: "mb-atx",
  },
  {
    id: "cpu",
    label: "CPU",
    icon: "⚡",
    slot: "cpu",
    description: "Compute core with high-frequency control.",
  },
  {
    id: "ram",
    label: "RAM Kit",
    icon: "💾",
    slot: "ram",
    description: "Low-latency memory stack.",
    options: [
      { id: "ddr5-32", label: "DDR5 32GB" },
      { id: "ddr5-64", label: "DDR5 64GB" },
    ],
    defaultOption: "ddr5-32",
  },
  {
    id: "psu",
    label: "Power Supply",
    icon: "🔋",
    slot: "psu",
    description: "Stable power rails for every component.",
  },
  {
    id: "storage",
    label: "Storage",
    icon: "💿",
    slot: "storage",
    description: "Primary system drive bay.",
    options: [
      { id: "ssd", label: "NVMe SSD" },
      { id: "hdd", label: "HDD 3.5in" },
    ],
    defaultOption: "ssd",
  },
  {
    id: "gpu",
    label: "Graphics Card",
    icon: "🎮",
    slot: "gpu",
    description: "Visual processing powerhouse.",
  },
  {
    id: "fan",
    label: "120mm Fan",
    icon: "🌀",
    slot: "fan",
    description: "Airflow and thermal management.",
  },
];


const SLOT_CONFIG = {
  // Case W=3.2, H=3.6, D=1.8
  // Motherboard: back wall (Z ~ -0.45)
  motherboard: {
    position: [0.0, 0.1, -0.42],
    rotation: [0, 0, 0],
    size: [0.48, 0.52, 0.04],
    guide: [0.52, 0.56, 0.05],
  },
  // CPU: upper-left of motherboard
  cpu: {
    position: [-0.08, 0.22, -0.40],
    rotation: [0, 0, 0],
    size: [0.12, 0.12, 0.06],
    guide: [0.14, 0.14, 0.08],
  },
  // RAM: right of CPU, vertical sticks
  ram: {
    position: [0.12, 0.20, -0.40],
    rotation: [0, 0, 0],
    size: [0.20, 0.12, 0.06],
    guide: [0.24, 0.14, 0.08],
  },
  // GPU: massive RTX 5090 size, sits in PCIe slot — enlarged to match real 336mm × 149mm × 75mm
  gpu: {
    position: [0.0, -0.05, -0.20],
    rotation: [0, 0, 0],
    size: [0.58, 0.20, 0.30],
    guide: [0.62, 0.22, 0.34],
  },
  // PSU: bottom compartment (below divider at Y=-0.26)
  psu: {
    position: [0.06, -0.38, -0.1],
    rotation: [0, 0, 0],
    size: [0.28, 0.14, 0.28],
    guide: [0.32, 0.17, 0.32],
  },
  // Storage: bottom area, front-left
  storage: {
    position: [-0.25, -0.32, 0.2],
    rotation: [0, 0, 0],
    size: [0.18, 0.1, 0.14],
    guide: [0.22, 0.13, 0.18],
  },
  // Fan: top of case, front area
  fan: {
    position: [0.0, 0.44, 0.0],
    rotation: [Math.PI / 2, 0, 0],
    size: [0.16, 0.16, 0.06],
    guide: [0.20, 0.20, 0.08],
  },
};



const SLOT_SCALE = 1;
const GUIDE_SCALE = 0.9;
const DRAG_SNAP_RATIO = 0.6;
const DRAG_PLANE_RATIO = 0.04;
const DRAG_ACTIVATION_DISTANCE = 0.08;
const HAS_DOCUMENT = typeof document !== "undefined";


const buildState = (value) =>
  PARTS.reduce((acc, part) => {
    acc[part.id] = value;
    return acc;
  }, {});

const defaultSelections = PARTS.reduce((acc, part) => {
  if (part.options) acc[part.id] = part.defaultOption || part.options[0]?.id;
  return acc;
}, {});

// ─── LOADER ──────────────────────────────────────────────────────────────────

function Loader() {
  return (
    <Html center className="build-loader">
      Loading…
    </Html>
  );
}


function resolveSlot(slotId, caseSize, explodeFactor = 1) {

  const config = SLOT_CONFIG[slotId];
  const position = new THREE.Vector3(
    config.position[0] * caseSize.x,
    config.position[1] * caseSize.y,
    config.position[2] * caseSize.z
  ).multiplyScalar(explodeFactor);
  const size = new THREE.Vector3(
    config.size[0] * caseSize.x,
    config.size[1] * caseSize.y,
    config.size[2] * caseSize.z
  ).multiplyScalar(SLOT_SCALE);
  const guide = new THREE.Vector3(
    config.guide[0] * caseSize.x,
    config.guide[1] * caseSize.y,
    config.guide[2] * caseSize.z
  ).multiplyScalar(GUIDE_SCALE);
  const rotation = new THREE.Euler(...config.rotation);
  return { position, size, guide, rotation };
}

function resolveStaging(index, caseSize) {
  const column = index % 2;
  const row = Math.floor(index / 2);
  const baseX = -0.72 * caseSize.x;
  const baseY = 0.36 * caseSize.y;
  const baseZ = 0.55 * caseSize.z;
  const x = baseX - column * 0.18 * caseSize.x;
  const y = baseY - row * 0.16 * caseSize.y;
  const z = baseZ - column * 0.05 * caseSize.z;
  return {
    position: new THREE.Vector3(x, y, z),
    rotation: new THREE.Euler(-0.4, Math.PI / 3, 0.2),
  };
}

function AnimatedTransform({
  installed,
  target,
  staging,
  baseScale = 1,
  floatSeed = 0,
  animate = true,
  children,
  partId,
  dragId,
  dragState,
  dragPlane,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
  xray,
}) {
  const ref = useRef();
  const snapRef = useRef(0);
  const { invalidate } = useThree();
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const tempHit = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.copy(staging.position);
    ref.current.rotation.copy(staging.rotation);
    ref.current.scale.setScalar(baseScale * 0.85);
  }, [baseScale, staging]);

  useEffect(() => {
    if (installed) snapRef.current = 1;
  }, [installed]);

  useEffect(() => {
    if (!ref.current || animate) return;
    const basePos = installed ? target.position : staging.position;
    ref.current.position.copy(basePos);
    ref.current.rotation.copy(installed ? target.rotation : staging.rotation);
    const desiredScale = installed ? baseScale : baseScale * 0.85;
    ref.current.scale.setScalar(desiredScale);
  }, [animate, installed, target, staging, baseScale]);

  useFrame((state) => {
    if (!ref.current) return;

    const isDragging = dragId && partId && dragId === partId;
    if (!animate && !isDragging) return;
    const basePos = installed ? target.position : staging.position;
    if (isDragging && dragState?.current?.position) {
      tempPos.copy(dragState.current.position);
    } else {
      tempPos.copy(basePos);
    }
    if (animate && !installed && !isDragging) {
      tempPos.y += Math.sin(state.clock.elapsedTime * 2 + floatSeed) * target.size.y * 0.05;
    }
    if (animate) {
      ref.current.position.lerp(tempPos, 0.12);
    } else {
      ref.current.position.copy(tempPos);
    }

    if (isDragging && dragState?.current?.rotation) {
      ref.current.rotation.copy(dragState.current.rotation);
    } else {
      const desiredRot = installed ? target.rotation : staging.rotation;
      if (animate) {
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, desiredRot.x, 0.12);
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, desiredRot.y, 0.12);
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, desiredRot.z, 0.12);
      } else {
        ref.current.rotation.copy(desiredRot);
      }
    }

    if (snapRef.current > 0) {
      snapRef.current = Math.max(0, snapRef.current - state.clock.getDelta() * 2.5);
    }
    const snapScale = 1 + snapRef.current * 0.05;
    const desiredScale = (installed ? baseScale : baseScale * 0.85) * snapScale;
    tempScale.setScalar(desiredScale);
    if (animate) {
      ref.current.scale.lerp(tempScale, 0.12);
    } else {
      ref.current.scale.copy(tempScale);
    }
  });

  const handlePointerOver = () => {
    if (onHoverSlot && partId) onHoverSlot(partId, true);
    if (HAS_DOCUMENT && document.body) document.body.style.cursor = "grab";
  };

  const handlePointerOut = () => {
    if (onHoverSlot && partId) onHoverSlot(partId, false);
    if (HAS_DOCUMENT && document.body) document.body.style.cursor = "default";
  };

  const handlePointerDown = (event) => {
    if (!onDragStart || !dragPlane || !ref.current || !partId) return;
    if (event.button !== 0) return;
    event.stopPropagation();
    event.target?.setPointerCapture?.(event.pointerId);
    if (!event.ray?.intersectPlane(dragPlane, tempHit)) return;
    const worldPos = new THREE.Vector3();
    ref.current.getWorldPosition(worldPos);
    if (HAS_DOCUMENT && document.body) document.body.style.cursor = "grabbing";
    onDragStart(partId, tempHit, worldPos, ref.current.rotation);
    invalidate();
  };

  const handlePointerMove = (event) => {
    if (!onDragMove || !dragPlane || !partId) return;
    if (dragState?.current?.id !== partId) return;
    if (!event.ray?.intersectPlane(dragPlane, tempHit)) return;
    onDragMove(partId, tempHit);
    invalidate();
  };

  const handlePointerUp = (event) => {
    if (!onDragEnd || !partId) return;
    event.target?.releasePointerCapture?.(event.pointerId);
    if (HAS_DOCUMENT && document.body) document.body.style.cursor = "grab";
    onDragEnd(partId);
    invalidate();
  };

  return (
    <group
      ref={ref}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </group>
  );
}

// ModelPart, SimplePart, CpuPart, RamPart replaced by procedural components in PCParts.jsx

function SlotGuide({ transform, active, pulse, tone = "idle" }) {
  const ref = useRef();
  const baseOpacity =
    tone === "blocked" ? 0.22 : tone === "valid" ? 0.18 : tone === "focus" ? 0.14 : 0.1;
  const color =
    tone === "blocked"
      ? "#ff6b6b"
      : tone === "valid"
        ? "#7ef4c1"
        : "#7cc4ff";

  useFrame((state) => {
    if (!ref.current) return;
    if (pulse) {
      const glow = baseOpacity + Math.sin(state.clock.elapsedTime * 4) * 0.06;
      ref.current.material.opacity = glow;
    } else {
      ref.current.material.opacity = baseOpacity;
    }
  });

  if (!active) return null;

  return (
    <mesh ref={ref} position={transform.position} rotation={transform.rotation}>
      <boxGeometry args={[transform.guide.x, transform.guide.y, transform.guide.z]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={tone === "blocked" ? 0.6 : 0.45}
        transparent
        opacity={baseOpacity}
        wireframe
      />
    </mesh>
  );
}

function ConnectionLine({ dragState, target }) {
  const lineRef = useRef();
  const points = useMemo(() => [new THREE.Vector3(), new THREE.Vector3()], []);

  useFrame(() => {
    if (!lineRef.current || !dragState?.current?.position || !target) return;
    points[0].copy(dragState.current.position);
    points[1].copy(target.position);
    lineRef.current.geometry.setFromPoints(points);
  });

  if (!dragState?.current?.position || !target) return null;

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#7cc4ff" linewidth={1} transparent opacity={0.8} />
    </line>
  );
}

function StaticWire({ points, active, useTube = false }) {
  const geometry = useMemo(() => {
    if (!useTube) {
      return new THREE.BufferGeometry().setFromPoints(points);
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 20, 0.012, 6, false);
  }, [points, useTube]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  if (!active) return null;

  if (useTube) {
    return (
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#2d3b4a" roughness={0.6} metalness={0.1} />
      </mesh>
    );
  }

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6a7f96" transparent opacity={0.35} />
    </line>
  );
}


function RendererSettings({ qualityMode }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = qualityMode ? 1.15 : 1.0;
    gl.shadowMap.enabled = qualityMode;
    gl.shadowMap.type = qualityMode ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    gl.physicallyCorrectLights = true;
  }, [gl, qualityMode]);

  return null;
}

function AutoFrameCamera({ caseSize, controlsRef, enabled = true }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!caseSize || !enabled) return;
    const maxDim = Math.max(caseSize.x, caseSize.y, caseSize.z) || 1;
    const distance = maxDim * 1.25;
    camera.position.set(distance, maxDim * 0.45, distance);
    camera.near = Math.max(0.05, maxDim * 0.02);
    camera.far = Math.max(60, maxDim * 12);
    camera.updateProjectionMatrix();
    if (controlsRef?.current) {
      controlsRef.current.target.set(0, caseSize.y * 0.05, 0);
      controlsRef.current.update();
    }
  }, [caseSize, camera, controlsRef, enabled]);

  return null;
}

function CaseModel({ onReady, xray }) {
  // Delegate to the procedural O11 Vision case from PCParts.jsx
  return <O11CaseModel onReady={onReady} xray={xray} />;
}




function PCScene({
  installed,
  selections,
  focusedSlot,
  showGuides,
  caseSize,
  onCaseReady,
  controlsRef,
  lockCamera,
  xray,
  explodeFactor,
  insideView,
  qualityMode,
  liteParts,
  activePartId,
  activeSlotId,
  activeBlocked,
  recentlyInstalled,
  dragId,
  dragState,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
}) {
  const { invalidate } = useThree();
  const sizeVec = useMemo(
    () => new THREE.Vector3(caseSize.x, caseSize.y, caseSize.z),
    [caseSize.x, caseSize.y, caseSize.z]
  );
  const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -(sizeVec.y * DRAG_PLANE_RATIO)),
    [sizeVec.y]
  );

  const partInstances = useMemo(() => {
    return PARTS.map((part, index) => {
      const slot = resolveSlot(part.slot, sizeVec, explodeFactor);
      const staging = resolveStaging(index, sizeVec);
      const installedState = installed[part.id];
      return { part, slot, staging, installedState, index };
    });
  }, [installed, selections, sizeVec, explodeFactor]);

  const motionEnabled = qualityMode && !REDUCE_MOTION;

  const slotStatus = useMemo(() => {
    return PARTS.reduce((acc, part) => {
      acc[part.slot] = installed[part.id];
      return acc;
    }, {});
  }, [installed]);

  const slotToPart = useMemo(() => {
    return PARTS.reduce((acc, part) => {
      acc[part.slot] = part.id;
      return acc;
    }, {});
  }, []);

  const activePart = useMemo(() => {
    if (!dragId) return null;
    return partInstances.find((entry) => entry.part.id === dragId) || null;
  }, [dragId, partInstances]);

  const wirePairs = useMemo(
    () => [
      { id: "wire-psu", from: "psu", to: "motherboard", active: installed.psu },
      { id: "wire-gpu", from: "gpu", to: "motherboard", active: installed.gpu },
      { id: "wire-storage", from: "storage", to: "motherboard", active: installed.storage },
      { id: "wire-fan", from: "fan", to: "motherboard", active: installed.fan },
    ],
    [installed]
  );

  return (
    <>
      <color attach="background" args={["#0b0f15"]} />

      {/* ── CINEMATIC LIGHTING RIG ── */}
      {/* Soft ambient base — keeps shadows from going pitch black */}
      <ambientLight intensity={0.12} color="#c8d8f0" />

      {/* KEY LIGHT — warm white, front-right above (main illumination) */}
      <spotLight
        position={[maxDim * 1.4, maxDim * 2.2, maxDim * 1.6]}
        target-position={[0, 0, 0]}
        angle={0.28}
        penumbra={0.75}
        intensity={qualityMode ? 3.8 : 2.5}
        color="#fff5e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00012}
      />

      {/* RIM LIGHT — cool blue, back-left above (separates model from bg) */}
      <spotLight
        position={[-maxDim * 1.6, maxDim * 1.8, -maxDim * 1.4]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.9}
        intensity={qualityMode ? 2.2 : 1.4}
        color="#4a90d9"
      />

      {/* FILL LIGHT — soft neutral, front-left (reduces harsh shadows) */}
      <directionalLight
        position={[-maxDim * 1.2, maxDim * 0.8, maxDim * 1.0]}
        intensity={qualityMode ? 0.65 : 0.4}
        color="#ddeeff"
      />

      {/* TOP OVERHEAD — straight down, cinematic "studio" feel */}
      <spotLight
        position={[0, maxDim * 2.8, 0]}
        target-position={[0, 0, 0]}
        angle={0.22}
        penumbra={0.6}
        intensity={qualityMode ? 1.8 : 1.0}
        color="#ffffff"
        castShadow={false}
      />

      {/* BACK ACCENT — behind the case, adds depth halo */}
      <pointLight
        position={[0, maxDim * 0.5, -maxDim * 1.8]}
        intensity={qualityMode ? 1.2 : 0.7}
        color="#2a5fa8"
        distance={maxDim * 5}
        decay={2}
      />

      {/* GREEN LED BOUNCE — simulates internal Lian Li fan glow */}
      <pointLight
        position={[0, -maxDim * 0.3, 0]}
        intensity={qualityMode ? 0.9 : 0.5}
        color="#17ca07"
        distance={maxDim * 3}
        decay={2}
      />


      <Suspense fallback={<Loader />}>
        <AutoFrameCamera caseSize={sizeVec} controlsRef={controlsRef} enabled={!insideView} />
        <CaseModel onReady={onCaseReady} xray={xray} />
        {partInstances.map(({ part, slot, staging, installedState, index }) => {
          const floatSeed = index * 0.7;
          const shouldShow = installedState || dragId === part.id || activePartId === part.id;
          if (!shouldShow) return null;

          const commonProps = {
            key: part.id,
            partId: part.id,
            dragId,
            dragState,
            dragPlane,
            onDragStart,
            onDragMove,
            onDragEnd,
            onHoverSlot,
            target: slot,
            staging,
            installed: installedState,
            floatSeed,
            animate: motionEnabled,
            xray,
            AnimatedTransform,
          };

          if (part.id === "motherboard") return <MotherboardPart {...commonProps} />;
          if (part.id === "cpu") return (
            <group key={part.id}>
              <CpuPart {...commonProps} />
              {/* CPU Cooler sits above the CPU — rendered together with CPU */}
              <CpuCoolerPart
                {...commonProps}
                key={part.id + "-cooler"}
                partId={part.id + "-cooler"}
                target={{
                  ...slot,
                  position: slot.position.clone().add(new THREE.Vector3(0, slot.size.y * 1.1, 0)),
                  size: slot.size.clone(),
                }}
              />
            </group>
          );
          if (part.id === "ram") return <RamPart {...commonProps} />;
          if (part.id === "gpu") return <GpuPart {...commonProps} />;
          if (part.id === "psu") return <PsuPart {...commonProps} />;
          if (part.id === "storage") return <StoragePart {...commonProps} isSSD={(selections[part.id] || "ssd") === "ssd"} />;

          if (part.id === "fan") return <FanPart {...commonProps} />;

          return null;

        })}

        {dragId && activePart && <ConnectionLine dragState={dragState} target={activePart.slot} />}
        {insideView && wirePairs.map((wire) => {
          const startSlot = resolveSlot(wire.from, sizeVec, explodeFactor);
          const endSlot = resolveSlot(wire.to, sizeVec, explodeFactor);
          const backplane = endSlot.position.clone().add(new THREE.Vector3(-sizeVec.x * 0.18, sizeVec.y * 0.12, sizeVec.z * 0.32));
          const trunk = endSlot.position.clone().add(new THREE.Vector3(-sizeVec.x * 0.06, sizeVec.y * 0.06, sizeVec.z * 0.08));
          const elbowA = new THREE.Vector3(startSlot.position.x, backplane.y, backplane.z);
          const elbowB = new THREE.Vector3(trunk.x, backplane.y, backplane.z);
          const points = [startSlot.position, elbowA, elbowB, trunk, endSlot.position];
          return (
            <StaticWire
              key={wire.id}
              points={points}
              active={wire.active}
              useTube={qualityMode}
            />
          );
        })}
        {Object.keys(SLOT_CONFIG).map((slotId) => {
          const transform = resolveSlot(slotId, sizeVec, explodeFactor);
          const isInstalled = slotStatus[slotId];
          const isFocused = focusedSlot === slotId;
          const isTarget = activeSlotId === slotId;
          const active = isTarget || isFocused || (showGuides && !isInstalled);
          const tone = isTarget ? (activeBlocked ? "blocked" : "valid") : isFocused ? "focus" : "idle";
          const isRecentlyInstalled = recentlyInstalled && slotToPart[slotId] === recentlyInstalled;
          return (
            <SlotGuide
              key={slotId}
              transform={transform}
              active={active}
              pulse={qualityMode && (isFocused || isRecentlyInstalled)}
              tone={tone}
            />
          );
        })}
      </Suspense>


      {qualityMode && (
        <ContactShadows
          position={[0, -sizeVec.y * 0.56 + 0.01, 0]}
          opacity={0.45}
          blur={1.6}
          far={sizeVec.y * 2}
          resolution={1024}
          color="#0a1018"
          frames={24}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enabled={!lockCamera}
        enablePan={false}
        enableDamping={qualityMode}
        dampingFactor={0.08}
        onChange={invalidate}
        minDistance={insideView ? Math.max(0.6, maxDim * 0.15) : Math.max(1.1, maxDim * 0.4)}
        maxDistance={insideView ? Math.max(5, maxDim * 2.2) : Math.max(7, maxDim * 2.8)}
        target={[0, sizeVec.y * 0.05, 0]}
      />
    </>
  );
}

export default function BuildingComputers() {
  const [installed, setInstalled] = useState(() => buildState(false));
  const [selections, setSelections] = useState(() => ({ ...defaultSelections }));
  const [focusedSlot, setFocusedSlot] = useState(null);
  const [buildMode, setBuildMode] = useState("assembly");
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTray, setShowTray] = useState(true);
  const [cableExplode, setCableExplode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePartId, setActivePartId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [caseSize, setCaseSize] = useState({ x: 3.2, y: 3.6, z: 1.8 }); // New slim depth D=1.8

  const [, setLog] = useState([]);
  const [recentlyInstalled, setRecentlyInstalled] = useState(null);

  const isInspection = buildMode === "inspection";
  const isCable = buildMode === "cable";
  const insideView = isInspection || isCable;
  const explodeFactor = isCable && cableExplode ? 1.22 : 1;
  const xray = panelOpen || isInspection || isCable;
  const showGuides = buildMode !== "inspection";
  const qualityMode = true;
  const liteParts = false;

  const controlsRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const dragStateRef = useRef({
    id: null,
    position: new THREE.Vector3(),
    offset: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    startPosition: new THREE.Vector3(),
    moved: false,
    wasInstalled: false,
    detached: false,
  });
  const installedRef = useRef(installed);

  useEffect(() => {
    installedRef.current = installed;
  }, [installed]);

  useEffect(() => {
    if (!recentlyInstalled) return undefined;
    const timer = setTimeout(() => setRecentlyInstalled(null), 800);
    return () => clearTimeout(timer);
  }, [recentlyInstalled]);

  const partLookup = useMemo(() => {
    return PARTS.reduce((acc, part) => {
      acc[part.id] = part;
      return acc;
    }, {});
  }, []);

  const getMissingDeps = useCallback(
    (partId, state) => {
      const required = CONNECTION_REQUIREMENTS[partId] || [];
      return required.filter((reqId) => !state[reqId]);
    },
    []
  );

  const slotLookup = useMemo(() => {
    const sizeVec = new THREE.Vector3(caseSize.x, caseSize.y, caseSize.z);
    return PARTS.reduce((acc, part) => {
      acc[part.id] = resolveSlot(part.slot, sizeVec, explodeFactor);
      return acc;
    }, {});
  }, [caseSize.x, caseSize.y, caseSize.z, explodeFactor]);

  const connectedCount = useMemo(() => {
    return PARTS.reduce((sum, part) => sum + (installed[part.id] ? 1 : 0), 0);
  }, [installed]);

  const progress = Math.round((connectedCount / PARTS.length) * 100);

  const nextPart = PARTS.find((part) => !installed[part.id]);
  const activePart = draggingId || activePartId;
  const activeSlotId = useMemo(() => {
    if (!activePart) return null;
    return PARTS.find((part) => part.id === activePart)?.slot || null;
  }, [activePart]);
  const activeMissing = useMemo(() => {
    if (!activePart) return [];
    return getMissingDeps(activePart, installed);
  }, [activePart, getMissingDeps, installed]);
  const activeBlocked = activeMissing.length > 0;

  const pushLog = useCallback((message) => {
    const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLog((prev) => [{ stamp, message }, ...prev].slice(0, 6));
  }, []);

  const handleDragStart = useCallback(
    (partId, hitPoint, worldPos, worldRot) => {
      const part = partLookup[partId];
      if (!part) return;
      dragStateRef.current.id = partId;
      dragStateRef.current.offset.copy(worldPos).sub(hitPoint);
      dragStateRef.current.position.copy(worldPos);
      dragStateRef.current.rotation.copy(worldRot);
      dragStateRef.current.startPosition.copy(worldPos);
      dragStateRef.current.moved = false;
      dragStateRef.current.wasInstalled = installedRef.current[partId];
      dragStateRef.current.detached = false;
      setDraggingId(partId);
      setFocusedSlot(part.slot);
    },
    [partLookup, pushLog]
  );

  const handleDragMove = useCallback(
    (partId, hitPoint) => {
      if (dragStateRef.current.id !== partId) return;
      dragStateRef.current.position.copy(hitPoint).add(dragStateRef.current.offset);
      const distance = dragStateRef.current.position.distanceTo(dragStateRef.current.startPosition);
      if (!dragStateRef.current.moved && distance > DRAG_ACTIVATION_DISTANCE) {
        dragStateRef.current.moved = true;
        if (dragStateRef.current.wasInstalled && !dragStateRef.current.detached) {
          const part = partLookup[partId];
          dragStateRef.current.detached = true;
          setInstalled((prev) => ({ ...prev, [partId]: false }));
          if (part) pushLog(`${part.label} detached`);
        }
      }
    },
    [partLookup, pushLog]
  );

  const handleDragEnd = useCallback(
    (partId) => {
      if (dragStateRef.current.id !== partId) return;
      const part = partLookup[partId];
      const slot = slotLookup[partId];
      const moved = dragStateRef.current.moved;
      if (!moved) {
        dragStateRef.current.id = null;
        setDraggingId(null);
        return;
      }
      if (part && slot) {
        const snapDistance = slot.size.length() * DRAG_SNAP_RATIO;
        const dist = dragStateRef.current.position.distanceTo(slot.position);
        if (dist <= snapDistance) {
          const missing = getMissingDeps(partId, installedRef.current);
          if (missing.length > 0) {
            const missingLabels = missing.map((id) => partLookup[id]?.label || id).join(", ");
            pushLog(`Blocked: install ${missingLabels} first`);
          } else {
            setInstalled((prev) => ({ ...prev, [partId]: true }));
            pushLog(`${part.label} connected`);
            setRecentlyInstalled(part.id);
            setActivePartId(null);
          }
        }
      }
      dragStateRef.current.id = null;
      setDraggingId(null);
      setFocusedSlot(null);
    },
    [partLookup, slotLookup, pushLog, getMissingDeps]
  );

  const handleHoverSlot = useCallback(
    (partId, active) => {
      const part = partLookup[partId];
      if (!part) return;
      if (dragStateRef.current.id && !active) return;
      setFocusedSlot(active ? part.slot : null);
    },
    [partLookup]
  );

  const togglePart = useCallback(
    (part) => {
      const nextValue = !installedRef.current[part.id];
      if (nextValue) {
        const missing = getMissingDeps(part.id, installedRef.current);
        if (missing.length > 0) {
          const missingLabels = missing.map((id) => partLookup[id]?.label || id).join(", ");
          pushLog(`Blocked: install ${missingLabels} first`);
          return;
        }
        setActivePartId(part.id);
        setFocusedSlot(part.slot);
        pushLog(`${part.label} ready to connect`);
        return;
      }
      setInstalled((prev) => ({ ...prev, [part.id]: false }));
      setActivePartId(part.id);
      setFocusedSlot(part.slot);
      pushLog(`${part.label} disconnected`);
    },
    [pushLog, getMissingDeps, partLookup]
  );

  const updateSelection = (partId, optionId) => {
    setSelections((prev) => ({ ...prev, [partId]: optionId }));
    const part = PARTS.find((entry) => entry.id === partId);
    const label = part?.options?.find((opt) => opt.id === optionId)?.label;
    if (part && label) pushLog(`${part.label} set to ${label}`);
  };

  const installAll = useCallback(() => {
    const ordered = CONNECTION_ORDER.reduce((acc, partId) => {
      acc[partId] = true;
      return acc;
    }, buildState(false));
    setInstalled(ordered);
    setDraggingId(null);
    dragStateRef.current.id = null;
    pushLog("Auto-connect initiated (ordered)");
  }, [pushLog]);

  const resetAll = useCallback(() => {
    setInstalled(buildState(false));
    setDraggingId(null);
    dragStateRef.current.id = null;
    setFocusedSlot(null);
    pushLog("Assembly reset");
  }, [pushLog]);

  const handleCaseReady = useCallback((sizeVec) => {
    setCaseSize((prev) => {
      const next = { x: sizeVec.x, y: sizeVec.y, z: sizeVec.z };
      if (prev.x === next.x && prev.y === next.y && prev.z === next.z) return prev;
      return next;
    });
  }, []);

  const resetView = useCallback(() => {
    if (controlsRef.current) controlsRef.current.reset();
  }, []);

  const focusInside = useCallback(() => {
    if (!controlsRef.current) return;
    const maxDim = Math.max(caseSize.x, caseSize.y, caseSize.z) || 1;
    const cam = controlsRef.current.object;
    cam.position.set(maxDim * 0.2, maxDim * 0.18, maxDim * 0.2);
    controlsRef.current.target.set(0, caseSize.y * 0.12, 0);
    controlsRef.current.update();
  }, [caseSize.x, caseSize.y, caseSize.z]);

  useEffect(() => {
    if (insideView) {
      focusInside();
    } else {
      resetView();
    }
  }, [insideView, focusInside, resetView]);

  const toggleFullscreen = useCallback(() => {
    const el = canvasWrapRef.current;
    if (!el || !HAS_DOCUMENT) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      return;
    }
    if (el.requestFullscreen) {
      el.requestFullscreen();
      return;
    }
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
      return;
    }
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!HAS_DOCUMENT) return undefined;
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    if (!HAS_DOCUMENT || !document.body) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (!HAS_DOCUMENT || !document.body) return;
      document.body.style.overflow = previous;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!HAS_DOCUMENT) return undefined;
    const root = document.documentElement;
    const body = document.body;
    root?.classList.add("build-no-scrollbar");
    body?.classList.add("build-no-scrollbar");
    return () => {
      root?.classList.remove("build-no-scrollbar");
      body?.classList.remove("build-no-scrollbar");
    };
  }, []);

  useEffect(() => {
    if (buildMode !== "assembly") {
      setShowTray(false);
      setPanelOpen(false);
    }
  }, [buildMode]);

  useEffect(() => {
    const handleKey = (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;

      switch (event.key.toLowerCase()) {
        case "1":
          setBuildMode("assembly");
          break;
        case "2":
          setBuildMode("inspection");
          break;
        case "3":
          setBuildMode("cable");
          break;
        case "p":
          setShowTray((prev) => !prev);
          break;
        case "o":
          if (buildMode === "assembly") setPanelOpen((prev) => !prev);
          break;
        case "e":
          if (buildMode === "cable") setCableExplode((prev) => !prev);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "r":
          resetView();
          break;
        case "a":
          installAll();
          break;
        case "x":
          resetAll();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [buildMode, installAll, resetAll, resetView, toggleFullscreen]);

  return (
    <div className={`build-page ${showTray ? "" : "is-focus"}`}>
      {/* ── TOPBAR ── */}
      <header className="build-topbar">
        <div className="build-brand">⬡ PC Build Sim</div>

        <div className="build-tagline">
          Select a part → drag into the glowing slot
        </div>

        <div className="topbar-actions">
          <span className="topbar-progress">
            {connectedCount}/{PARTS.length} parts
          </span>
          <button
            className="build-btn primary"
            onClick={installAll}
            title="Install all parts (A)"
          >
            ⚡ Install All
          </button>
          <button
            className="build-btn danger"
            onClick={resetAll}
            title="Reset build (X)"
          >
            ↺ Reset
          </button>
          <button
            className="build-btn ghost"
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
          >
            {isFullscreen ? "⊠ Exit" : "⊡ Fullscreen"}
          </button>
        </div>
      </header>

      <div className="build-grid">
        <section className="build-stage">

          {/* ── STAGE TOOLBAR ── */}
          <div className="stage-toolbar">
            <div className="stage-title">
              <h2>Assembly Bay</h2>
              <span>Drag parts into highlighted slots · snap to install</span>
            </div>

            <div className="stage-controls">
              {/* Mode tabs */}
              <div className="mode-selector" role="tablist" aria-label="Build mode">
                {[
                  { id: "assembly", label: "🔧 Assembly" },
                  { id: "inspection", label: "🔍 Inspect" },
                  { id: "cable", label: "🔌 Cables" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    className={`mode-btn ${buildMode === mode.id ? "is-active" : ""}`}
                    onClick={() => setBuildMode(mode.id)}
                    aria-pressed={buildMode === mode.id}
                    role="tab"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Mode-specific actions */}
              <div className="mode-actions">
                {buildMode === "assembly" && (
                  <>
                    <button
                      className="build-btn ghost"
                      onClick={() => setPanelOpen((prev) => !prev)}
                      data-active={panelOpen}
                      aria-pressed={panelOpen}
                      title="Toggle side panel (O)"
                    >
                      {panelOpen ? "🪟 Close Panel" : "🪟 Side Panel"}
                    </button>
                    <button
                      className="build-btn ghost"
                      onClick={() => setShowTray((prev) => !prev)}
                      data-active={showTray}
                      aria-pressed={showTray}
                      title="Toggle parts tray (P)"
                    >
                      {showTray ? "📦 Hide Tray" : "📦 Parts Tray"}
                    </button>
                  </>
                )}
                {buildMode === "inspection" && (
                  <button className="build-btn ghost" onClick={resetView} title="Reset camera (R)">
                    🎯 Reset View
                  </button>
                )}
                {buildMode === "cable" && (
                  <button
                    className="build-btn ghost"
                    onClick={() => setCableExplode((prev) => !prev)}
                    data-active={cableExplode}
                    aria-pressed={cableExplode}
                    title="Toggle exploded view (E)"
                  >
                    {cableExplode ? "🗜 Collapse" : "💥 Explode"}
                  </button>
                )}
              </div>

              {/* Keyboard legend */}
              <span className="kbd-legend">
                <span className="kbd">1-3</span> mode ·
                <span className="kbd">P</span> tray ·
                <span className="kbd">R</span> reset view ·
                <span className="kbd">F</span> fullscreen
              </span>
            </div>
          </div>

          {/* ── 3D CANVAS ── */}
          <div
            className={`build-canvas ${isFullscreen ? "is-fullscreen" : ""}`}
            ref={canvasWrapRef}
          >
            <Canvas
              frameloop={qualityMode ? "always" : "demand"}
              shadows={qualityMode}
              dpr={qualityMode ? [1.5, 2] : [0.75, 1]}
              gl={{
                antialias: qualityMode,
                alpha: false,
                powerPreference: qualityMode ? "high-performance" : "low-power",
              }}
              camera={{ position: [5.2, 2.4, 6.4], fov: 42, near: 0.1, far: 60 }}
            >
              <RendererSettings qualityMode={qualityMode} />
              <PCScene
                installed={installed}
                selections={selections}
                focusedSlot={focusedSlot}
                showGuides={showGuides}
                caseSize={caseSize}
                onCaseReady={handleCaseReady}
                controlsRef={controlsRef}
                lockCamera={Boolean(draggingId)}
                xray={xray}
                explodeFactor={explodeFactor}
                insideView={insideView}
                qualityMode={qualityMode}
                liteParts={liteParts}
                activePartId={activePartId}
                activeSlotId={activeSlotId}
                activeBlocked={activeBlocked}
                recentlyInstalled={recentlyInstalled}
                dragId={draggingId}
                dragState={dragStateRef}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onHoverSlot={handleHoverSlot}
              />
            </Canvas>

            <div className="stage-hint">
              <span>🖱 Drag part → glowing slot to install · click part to highlight</span>
              <span>Scroll to zoom · drag to orbit</span>
            </div>
          </div>

          {/* ── PARTS TRAY ── */}
          {showTray && (
            <aside className="parts-tray">
              <div className="tray-header">
                <div>
                  <h2>Parts Tray</h2>
                  <p>Drag into the glowing slot · snap to connect</p>
                </div>
                <div className="tray-actions">
                  <button
                    className="build-btn ghost"
                    onClick={() => setShowTray(false)}
                    title="Close tray (P)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="tray-progress">
                <div className="tray-progress-track">
                  <div className="tray-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="tray-progress-meta">
                  <span>{connectedCount} / {PARTS.length} connected</span>
                  <strong>{progress}% integrity</strong>
                </div>
              </div>

              {/* Part list */}
              <div className="parts-scroll">
                {PARTS.map((part, index) => {
                  const isInstalled = installed[part.id];
                  const isDragging = draggingId === part.id;
                  const missingDeps = getMissingDeps(part.id, installed);
                  const isBlocked = !isInstalled && missingDeps.length > 0;
                  const isActive = activePartId === part.id;
                  const isNext = nextPart?.id === part.id;
                  return (
                    <div
                      key={part.id}
                      className={[
                        "part-item",
                        isInstalled ? "is-installed" : "",
                        isDragging ? "is-dragging" : "",
                        isActive ? "is-active" : "",
                        isNext ? "is-next" : "",
                        isBlocked ? "is-blocked" : "",
                      ].join(" ")}
                      style={{ "--i": index }}
                      onMouseEnter={() => { if (!draggingId) setFocusedSlot(part.slot); }}
                      onMouseLeave={() => { if (!draggingId) setFocusedSlot(null); }}
                    >
                      <button
                        className="part-button"
                        onClick={() => togglePart(part)}
                        disabled={isBlocked}
                      >
                        <span className="part-icon">{part.icon}</span>
                        <span className="part-info">
                          <span className="part-label">{part.label}</span>
                          <span className="part-desc">{part.description}</span>
                        </span>
                        <span className={`part-state ${isInstalled ? "on" : "off"}`}>
                          {isInstalled ? "✓ ON" : isBlocked ? "🔒" : "PICK"}
                        </span>
                      </button>

                      {isNext && !isInstalled && (
                        <span className="part-next">▶ Next step</span>
                      )}

                      {part.options && (
                        <div className="part-options">
                          {part.options.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={`option-btn ${selections[part.id] === option.id ? "active" : ""}`}
                              onClick={() => updateSelection(part.id, option.id)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {isBlocked && (
                        <span className="part-blocked">
                          🔒 Requires: {missingDeps.map((id) => partLookup[id]?.label || id).join(", ")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tray bottom actions */}
              <div className="tray-bottom-actions">
                <button className="build-btn primary full" onClick={installAll} title="Install all (A)">
                  ⚡ Install All
                </button>
                <button className="build-btn danger full" onClick={resetAll} title="Reset (X)">
                  ↺ Reset
                </button>
              </div>
            </aside>
          )}
        </section>
      </div>
    </div>
  );
}



