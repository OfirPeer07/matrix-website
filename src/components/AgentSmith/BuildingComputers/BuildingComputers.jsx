import React, { Suspense, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, useProgress, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import "./BuildingComputers.css";

const ASSET_ROOT = process.env.PUBLIC_URL || "";

const MODEL_PATHS = {
  case: `${ASSET_ROOT}/models/pc.glb`,
  gpu: `${ASSET_ROOT}/pc_parts/gpu_large.glb`,
  psu: `${ASSET_ROOT}/pc_parts/psu_ATX.glb`,
  ssd: `${ASSET_ROOT}/pc_parts/ssd_2_5in.glb`,
  hdd: `${ASSET_ROOT}/pc_parts/hdd_3_5in.glb`,
  fan: `${ASSET_ROOT}/pc_parts/fan_120mm.glb`,
  panel: `${ASSET_ROOT}/pc_parts/side_panel_glass.glb`,
  mbATX: `${ASSET_ROOT}/pc_parts/motherboard_ATX.glb`,
  mbMATX: `${ASSET_ROOT}/pc_parts/motherboard_mATX.glb`,
  mbITX: `${ASSET_ROOT}/pc_parts/motherboard_ITX.glb`,
};

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
    slot: "motherboard",
    description: "Backbone for every connection and bus lane.",
    options: [
      { id: "mb-atx", label: "ATX", model: MODEL_PATHS.mbATX },
      { id: "mb-matx", label: "mATX", model: MODEL_PATHS.mbMATX },
      { id: "mb-itx", label: "ITX", model: MODEL_PATHS.mbITX },
    ],
    defaultOption: "mb-atx",
    fit: 0.96,
  },
  {
    id: "cpu",
    label: "CPU",
    slot: "cpu",
    description: "Compute core with high frequency control.",
    type: "custom",
  },
  {
    id: "ram",
    label: "RAM Kit",
    slot: "ram",
    description: "Low latency memory stack.",
    type: "custom",
  },
  {
    id: "psu",
    label: "Power Supply",
    slot: "psu",
    description: "Stable rails for every component.",
    model: MODEL_PATHS.psu,
    fit: 0.94,
  },
  {
    id: "storage",
    label: "Storage",
    slot: "storage",
    description: "Primary system drive bay.",
    options: [
      { id: "ssd", label: "SSD 2.5in", model: MODEL_PATHS.ssd },
      { id: "hdd", label: "HDD 3.5in", model: MODEL_PATHS.hdd },
    ],
    defaultOption: "ssd",
    fit: 0.94,
  },
  {
    id: "gpu",
    label: "Graphics Card",
    slot: "gpu",
    description: "Visual processing powerhouse.",
    model: MODEL_PATHS.gpu,
    fit: 0.92,
  },
  {
    id: "fan",
    label: "120mm Fan",
    slot: "fan",
    description: "Airflow and thermal control.",
    model: MODEL_PATHS.fan,
    fit: 0.95,
  },
  {
    id: "panel",
    label: "Glass Side Panel",
    slot: "sidePanel",
    description: "Seal and showcase the build.",
    model: MODEL_PATHS.panel,
    fit: 0.98,
  },
];

const SLOT_CONFIG = {
  motherboard: {
    position: [0.16, 0.02, -0.16],
    rotation: [0, Math.PI / 2, 0],
    size: [0.55, 0.35, 0.05],
    guide: [0.6, 0.42, 0.06],
  },
  cpu: {
    position: [0.07, 0.12, -0.05],
    rotation: [0, Math.PI / 2, 0],
    size: [0.12, 0.08, 0.08],
    guide: [0.14, 0.1, 0.1],
  },
  ram: {
    position: [0.2, 0.12, 0.02],
    rotation: [0, Math.PI / 2, 0],
    size: [0.22, 0.08, 0.08],
    guide: [0.28, 0.12, 0.1],
  },
  gpu: {
    position: [0.26, -0.02, 0.1],
    rotation: [0, Math.PI / 2, 0],
    size: [0.42, 0.13, 0.1],
    guide: [0.48, 0.16, 0.12],
  },
  psu: {
    position: [-0.22, -0.24, 0.2],
    rotation: [0, Math.PI / 2, 0],
    size: [0.25, 0.16, 0.2],
    guide: [0.3, 0.2, 0.24],
  },
  storage: {
    position: [-0.24, -0.04, -0.18],
    rotation: [0, Math.PI / 2, 0],
    size: [0.2, 0.09, 0.14],
    guide: [0.24, 0.12, 0.18],
  },
  fan: {
    position: [0.34, 0.22, 0.25],
    rotation: [Math.PI / 2, 0, 0],
    size: [0.18, 0.18, 0.06],
    guide: [0.22, 0.22, 0.08],
  },
  sidePanel: {
    position: [0.52, 0.0, 0.0],
    rotation: [0, Math.PI / 2, 0],
    size: [0.05, 0.7, 0.9],
    guide: [0.06, 0.76, 0.95],
  },
};

const SLOT_SCALE = 1;
const PART_FIT = 0.92;
const CUSTOM_FIT = 0.5;
const GUIDE_SCALE = 0.9;
const CASE_TARGET_SIZE = 4.8;
const CASE_FLAT_Y = 0.035;
const CASE_FLAT_XZ = 2.4;
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

function cloneScene(scene) {
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((mat) => (mat ? mat.clone() : mat));
      } else if (child.material) {
        child.material = child.material.clone();
      }
    }
  });
  return cloned;
}

function getSceneSize(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size;
}

function computeFitScale(targetSize, partSize, fit = PART_FIT) {
  const safeX = Math.max(partSize.x, 0.0001);
  const safeY = Math.max(partSize.y, 0.0001);
  const safeZ = Math.max(partSize.z, 0.0001);
  const scale = Math.min(
    targetSize.x / safeX,
    targetSize.y / safeY,
    targetSize.z / safeZ
  );
  return scale * fit;
}

function isLargeFlatMesh(child) {
  if (!child?.isMesh) return false;
  const box = new THREE.Box3().setFromObject(child);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const minDim = Math.min(size.x, size.y, size.z);
  const midDim = size.x + size.y + size.z - maxDim - minDim;
  const isVeryFlat = minDim <= CASE_FLAT_Y || (maxDim > 0 && minDim / maxDim < 0.015);
  const isLargePlane = maxDim >= CASE_FLAT_XZ && midDim >= CASE_FLAT_XZ * 0.6;
  if (child.name && /plane|ground|floor|base/i.test(child.name)) return true;
  return isVeryFlat && isLargePlane;
}

function useFittedScene(url, targetSize = 4.6, { ignoreLargeFlats = false } = {}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => cloneScene(scene), [scene]);

  const fit = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const box = new THREE.Box3();
    const tempBox = new THREE.Box3();
    const size = new THREE.Vector3();
    let hasMesh = false;

    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (ignoreLargeFlats && isLargeFlatMesh(child)) return;
      tempBox.setFromObject(child);
      tempBox.getSize(size);
      if (!hasMesh) {
        box.copy(tempBox);
        hasMesh = true;
      } else {
        box.union(tempBox);
      }
    });

    if (!hasMesh) {
      box.setFromObject(scene);
    }
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    const offset = center.multiplyScalar(-scale);
    const scaledSize = size.multiplyScalar(scale);
    return { scale, offset, size: scaledSize };
  }, [scene, targetSize, ignoreLargeFlats]);

  return { scene: cloned, ...fit };
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

function ModelPart({
  url,
  target,
  staging,
  installed,
  floatSeed = 0,
  glass = false,
  fit = PART_FIT,
  partId,
  dragId,
  dragState,
  dragPlane,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
  xray,
  animate,
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => cloneScene(scene), [scene]);

  const baseScale = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const size = getSceneSize(scene);
    return computeFitScale(target.size, size, fit);
  }, [scene, target.size.x, target.size.y, target.size.z, fit]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (!child.isMesh) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!mat) return;
        mat.transparent = true;
        const baseOpacity = installed ? 1 : 0.35;
        const panelXray = xray && partId === "panel";
        const panelOpacity = panelXray ? 0.06 : baseOpacity;
        mat.opacity = glass ? (installed ? 0.55 : 0.18) : panelOpacity;
        if (panelXray) {
          mat.opacity = 0.06;
        }
        if ("emissive" in mat) {
          mat.emissive = new THREE.Color(installed ? "#0d2236" : "#7cc4ff");
          mat.emissiveIntensity = installed ? 0.28 : 0.6;
        }
        if (glass && mat.isMeshStandardMaterial) {
          mat.metalness = 0.1;
          mat.roughness = 0.1;
        }
      });
    });
  }, [cloned, installed, glass, xray, partId]);

  return (
    <AnimatedTransform
      partId={partId}
      dragId={dragId}
      dragState={dragState}
      dragPlane={dragPlane}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onHoverSlot={onHoverSlot}
      installed={installed}
      target={target}
      staging={staging}
      baseScale={baseScale}
      floatSeed={floatSeed}
      animate={animate}
    >
      <primitive object={cloned} />
    </AnimatedTransform>
  );
}

function SimplePart({
  target,
  staging,
  installed,
  floatSeed = 0,
  partId,
  dragId,
  dragState,
  dragPlane,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
  animate,
  tint = "#36485b",
}) {
  const width = Math.max(0.02, target.size.x * 0.9);
  const height = Math.max(0.02, target.size.y * 0.9);
  const depth = Math.max(0.02, target.size.z * 0.9);

  return (
    <AnimatedTransform
      partId={partId}
      dragId={dragId}
      dragState={dragState}
      dragPlane={dragPlane}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onHoverSlot={onHoverSlot}
      installed={installed}
      target={target}
      staging={staging}
      floatSeed={floatSeed}
      animate={animate}
    >
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={tint} metalness={0.35} roughness={0.55} />
      </mesh>
    </AnimatedTransform>
  );
}

function CpuPart({
  target,
  staging,
  installed,
  floatSeed = 0,
  partId,
  dragId,
  dragState,
  dragPlane,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
  xray,
  explodeFactor,
  insideView,
  animate,
}) {
  const width = Math.max(0.02, target.size.x * 0.6) * CUSTOM_FIT;
  const height = Math.max(0.02, target.size.y * 0.35) * CUSTOM_FIT;
  const depth = Math.max(0.02, target.size.z * 0.6) * CUSTOM_FIT;

  return (
    <AnimatedTransform
      partId={partId}
      dragId={dragId}
      dragState={dragState}
      dragPlane={dragPlane}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onHoverSlot={onHoverSlot}
      installed={installed}
      target={target}
      staging={staging}
      floatSeed={floatSeed}
      animate={animate}
    >
      <group>
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color="#2e3b4c" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, height * 0.45, 0]}>
          <boxGeometry args={[width * 0.82, height * 0.35, depth * 0.82]} />
          <meshStandardMaterial color="#f9c74f" metalness={0.4} roughness={0.25} emissive="#7d4f0f" emissiveIntensity={0.35} />
        </mesh>
      </group>
    </AnimatedTransform>
  );
}

function RamPart({
  target,
  staging,
  installed,
  floatSeed = 0,
  partId,
  dragId,
  dragState,
  dragPlane,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverSlot,
  xray,
  explodeFactor,
  insideView,
  animate,
}) {
  const stickWidth = Math.max(0.02, target.size.x * 0.42) * CUSTOM_FIT;
  const stickHeight = Math.max(0.02, target.size.y * 0.45) * CUSTOM_FIT;
  const stickDepth = Math.max(0.02, target.size.z * 0.35) * CUSTOM_FIT;
  const gap = target.size.x * 0.15;

  const chipWidth = stickWidth * 0.2;
  const chipHeight = stickHeight * 0.3;
  const chipDepth = stickDepth * 0.6;

  return (
    <AnimatedTransform
      partId={partId}
      dragId={dragId}
      dragState={dragState}
      dragPlane={dragPlane}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onHoverSlot={onHoverSlot}
      installed={installed}
      target={target}
      staging={staging}
      floatSeed={floatSeed}
      animate={animate}
    >
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (stickWidth * 0.5 + gap * 0.5), 0, 0]}>
            <mesh>
              <boxGeometry args={[stickWidth, stickHeight, stickDepth]} />
              <meshStandardMaterial color="#1a9cff" metalness={0.4} roughness={0.35} emissive="#083b6b" emissiveIntensity={0.45} />
            </mesh>
            {[-0.25, 0.0, 0.25].map((offset, idx) => (
              <mesh key={idx} position={[offset * stickWidth * 0.9, 0, stickDepth * 0.35]}>
                <boxGeometry args={[chipWidth, chipHeight, chipDepth]} />
                <meshStandardMaterial color="#0c1c26" metalness={0.2} roughness={0.4} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </AnimatedTransform>
  );
}

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
  const { scene, scale, offset, size } = useFittedScene(
    MODEL_PATHS.case,
    CASE_TARGET_SIZE,
    { ignoreLargeFlats: true }
  );

  useEffect(() => {
    scene.updateWorldMatrix(true, true);
    const sceneBox = new THREE.Box3().setFromObject(scene);
    const sceneSize = new THREE.Vector3();
    sceneBox.getSize(sceneSize);

    scene.traverse((child) => {
      if (!child.isMesh) return;
      const box = new THREE.Box3().setFromObject(child);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const minDim = Math.min(size.x, size.y, size.z);
      const midDim = size.x + size.y + size.z - maxDim - minDim;
      const isFlat = minDim <= CASE_FLAT_Y || (maxDim > 0 && minDim / maxDim < 0.02);
      const isHorizontalPlane =
        size.y <= sceneSize.y * 0.08 &&
        size.x >= sceneSize.x * 0.6 &&
        size.z >= sceneSize.z * 0.6;
      const isFloorLike =
        isFlat &&
        maxDim >= Math.max(sceneSize.x, sceneSize.z) * 0.8 &&
        center.y <= sceneBox.min.y + sceneSize.y * 0.2;

      if (
        isLargeFlatMesh(child) ||
        isFloorLike ||
        isHorizontalPlane ||
        (isFlat && midDim >= Math.max(sceneSize.x, sceneSize.z) * 0.6) ||
        (child.name && /floor|base|ground|plate|plane|panel_base/i.test(child.name))
      ) {
        child.visible = false;
      }
    });
  }, [scene]);

  useEffect(() => {
    const sceneBox = new THREE.Box3().setFromObject(scene);
    const sceneSize = new THREE.Vector3();
    sceneBox.getSize(sceneSize);
    const lines = [];
    scene.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;
      const box = new THREE.Box3().setFromObject(child);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim < Math.max(sceneSize.x, sceneSize.z) * 0.18) return;
      // Lightweight edge accents to improve silhouette readability.
      const edges = new THREE.EdgesGeometry(child.geometry, 25);
      const material = new THREE.LineBasicMaterial({
        color: "#5fb5ff",
        transparent: true,
        opacity: 0.22,
      });
      material.depthTest = false;
      material.depthWrite = false;
      const line = new THREE.LineSegments(edges, material);
      line.renderOrder = 3;
      line.userData.__edge = true;
      child.add(line);
      lines.push(line);
    });

    return () => {
      lines.forEach((line) => {
        line.geometry?.dispose?.();
        line.material?.dispose?.();
        line.removeFromParent();
      });
    };
  }, [scene]);

  const isCasePanel = useCallback((child) => {
    if (!child?.name) return false;
    return /panel|glass|side/i.test(child.name);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!mat) return;
        if (mat.userData.__origOpacity === undefined) {
          mat.userData.__origOpacity = mat.opacity ?? 1;
          mat.userData.__origTransparent = mat.transparent ?? false;
          mat.userData.__origEmissive = mat.emissive ? mat.emissive.clone() : null;
          mat.userData.__origEmissiveIntensity = mat.emissiveIntensity ?? 0;
        }
        if (xray) {
          mat.transparent = true;
          mat.opacity = isCasePanel(child) ? 0.02 : 0.08;
          if ("emissive" in mat) {
            mat.emissive = new THREE.Color("#7cc4ff");
            mat.emissiveIntensity = 0.25;
          }
        } else {
          mat.transparent = mat.userData.__origTransparent;
          mat.opacity = mat.userData.__origOpacity;
          if ("emissive" in mat && mat.userData.__origEmissive) {
            mat.emissive = mat.userData.__origEmissive.clone();
            mat.emissiveIntensity = mat.userData.__origEmissiveIntensity;
          }
        }
      });
      if (xray && isCasePanel(child)) {
        child.visible = false;
      } else if (isCasePanel(child)) {
        child.visible = true;
      }
    });
  }, [scene, xray]);

  useEffect(() => {
    if (!onReady) return;
    onReady(size);
  }, [onReady, size]);

  return (
    <group scale={scale} position={offset}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center className="build-loader">
      Loading {Math.round(progress)}%
    </Html>
  );
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
      const option = part.options?.find((opt) => opt.id === selections[part.id]);
      const modelUrl = option?.model || part.model;
      return { part, slot, staging, installedState, modelUrl, index };
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

      {/* Key + rim + fill lighting for clear silhouettes and depth */}
      {qualityMode ? (
        <>
          <hemisphereLight args={["#d7e8ff", "#0a0f15", 0.28]} />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[6, 7, 5]}
            intensity={1.55}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.00015}
          />
          <directionalLight position={[-6, 3, -4]} intensity={0.95} color="#7fc3ff" />
          <directionalLight position={[0, 2, -6]} intensity={0.45} color="#dbe7ff" />
          <spotLight
            position={[0, 5, 3]}
            intensity={0.65}
            angle={0.4}
            penumbra={0.9}
            color="#b5d7ff"
          />
          <pointLight position={[0, 2, 4]} intensity={0.5} color="#86c9ff" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 4, 4]} intensity={1.1} />
          <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#7fc3ff" />
          <pointLight position={[0, 1.8, 3.5]} intensity={0.45} color="#bfe1ff" />
        </>
      )}

      <Suspense fallback={<Loader />}>
        <AutoFrameCamera caseSize={sizeVec} controlsRef={controlsRef} enabled={!insideView} />
        <CaseModel onReady={onCaseReady} xray={xray} />
        {partInstances.map(({ part, slot, staging, installedState, modelUrl, index }) => {
          const floatSeed = index * 0.7;
          const shouldShow = installedState || dragId === part.id || activePartId === part.id;
          if (!shouldShow) return null;
          if (part.type === "custom") {
            if (part.id === "cpu") {
              return (
                <CpuPart
                  key={part.id}
                  partId={part.id}
                  dragId={dragId}
                  dragState={dragState}
                  dragPlane={dragPlane}
                  onDragStart={onDragStart}
                  onDragMove={onDragMove}
                  onDragEnd={onDragEnd}
                  onHoverSlot={onHoverSlot}
                  target={slot}
                  staging={staging}
                  installed={installedState}
                  floatSeed={floatSeed}
                  animate={motionEnabled}
                />
              );
            }
            if (part.id === "ram") {
              return (
                <RamPart
                  key={part.id}
                  partId={part.id}
                  dragId={dragId}
                  dragState={dragState}
                  dragPlane={dragPlane}
                  onDragStart={onDragStart}
                  onDragMove={onDragMove}
                  onDragEnd={onDragEnd}
                  onHoverSlot={onHoverSlot}
                  target={slot}
                  staging={staging}
                  installed={installedState}
                  floatSeed={floatSeed}
                  animate={motionEnabled}
                />
              );
            }
          }
          if (!modelUrl) return null;
          const shouldUseSimple = liteParts && !installedState;
          if (shouldUseSimple) {
            return (
              <SimplePart
                key={part.id}
                partId={part.id}
                dragId={dragId}
                dragState={dragState}
                dragPlane={dragPlane}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onHoverSlot={onHoverSlot}
                target={slot}
                staging={staging}
                installed={installedState}
                floatSeed={floatSeed}
                animate={motionEnabled}
              />
            );
          }
          return (
            <ModelPart
              key={part.id}
              partId={part.id}
              dragId={dragId}
              dragState={dragState}
              dragPlane={dragPlane}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              onHoverSlot={onHoverSlot}
              xray={xray}
              url={modelUrl}
              target={slot}
              staging={staging}
              installed={installedState}
              floatSeed={floatSeed}
              glass={part.id === "panel"}
              fit={part.fit}
              animate={motionEnabled}
            />
          );
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
  const [caseSize, setCaseSize] = useState({ x: 4, y: 5.2, z: 2.6 });
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
      <header className="build-topbar">
        <div className="build-brand">PC Assembly Simulator</div>
        <div className="build-tagline">Select a part, then drag it into the highlighted slot.</div>
      </header>

      <div className="build-grid">
        <section className="build-stage">
          <div className="stage-toolbar">
            <div className="stage-title">
              <h2>Assembly Bay</h2>
              <span>Select a part, then drag into the highlighted slot</span>
            </div>
            <div className="stage-controls">
              <div className="mode-selector" role="tablist" aria-label="Build mode">
                {[
                  { id: "assembly", label: "Assembly" },
                  { id: "inspection", label: "Inspection" },
                  { id: "cable", label: "Cable Mgmt" },
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
              <div className="mode-actions">
                {buildMode === "assembly" && (
                  <>
                    <button
                      className="build-btn ghost"
                      onClick={() => setPanelOpen((prev) => !prev)}
                      data-active={panelOpen}
                      aria-pressed={panelOpen}
                    >
                      {panelOpen ? "Close Side Panel" : "Open Side Panel"}
                    </button>
                    <button
                      className="build-btn ghost"
                      onClick={() => setShowTray((prev) => !prev)}
                      data-active={showTray}
                      aria-pressed={showTray}
                    >
                      {showTray ? "Hide Parts" : "Parts Tray"}
                    </button>
                  </>
                )}
                {buildMode === "inspection" && (
                  <button className="build-btn ghost" onClick={resetView}>
                    Reset View
                  </button>
                )}
                {buildMode === "cable" && (
                  <>
                    <button
                      className="build-btn ghost"
                      onClick={() => setCableExplode((prev) => !prev)}
                      data-active={cableExplode}
                      aria-pressed={cableExplode}
                    >
                      {cableExplode ? "Collapse View" : "Exploded View"}
                    </button>
                  </>
                )}
              </div>
              <button className="build-btn ghost" onClick={toggleFullscreen} title="Full screen (F)">
                {isFullscreen ? "Exit Full Screen" : "Full Screen"}
              </button>
            </div>
          </div>

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
              <span>Assembly: select a part, then drag into the highlighted slot.</span>
              <span>Scroll to zoom / Drag to rotate</span>
            </div>
          </div>
          {showTray && (
            <aside className="parts-tray">
              <div className="tray-header">
                <div>
                  <h2>Parts Tray</h2>
                  <p>Pick a part, drag into the highlighted slot. Auto-wiring on snap.</p>
                </div>
                <div className="tray-actions">
                  <button className="build-btn ghost" onClick={() => setShowTray(false)} title="Close tray">
                    Close
                  </button>
                </div>
              </div>

              <div className="tray-progress">
                <div className="tray-progress-track">
                  <div className="tray-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="tray-progress-meta">
                  <span>{connectedCount} / {PARTS.length} connected</span>
                  <strong>{progress}% integrity</strong>
                </div>
              </div>

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
                    className={`part-item ${isInstalled ? "is-installed" : ""} ${isDragging ? "is-dragging" : ""} ${isActive ? "is-active" : ""} ${isNext ? "is-next" : ""} ${isBlocked ? "is-blocked" : ""}`}
                    style={{ "--i": index }}
                    onMouseEnter={() => {
                      if (!draggingId) setFocusedSlot(part.slot);
                    }}
                    onMouseLeave={() => {
                      if (!draggingId) setFocusedSlot(null);
                    }}
                  >
                    <button
                      className="part-button"
                      onClick={() => togglePart(part)}
                      disabled={isBlocked}
                    >
                      <span className="part-label">{part.label}</span>
                      <span className={`part-state ${isInstalled ? "on" : "off"}`}>
                        {isInstalled ? "Installed" : isBlocked ? "Locked" : "Pick up"}
                      </span>
                    </button>
                    {isNext && !isInstalled && (
                      <span className="part-next">Next step</span>
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
                        <span className="part-blocked">Install {missingDeps.map((id) => partLookup[id]?.label || id).join(", ")} first</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </section>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_PATHS.case);
