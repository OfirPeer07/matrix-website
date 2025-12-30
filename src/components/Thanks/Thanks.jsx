import React, { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Title from "./Title";
import "./Thanks.css";

/* ================= HEART POINTS ================= */
function useHeartPoints(count = 320) {
  return useMemo(() => {
    const points = [];

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;

      const x = 16 * Math.pow(Math.sin(t), 3) * 0.12;
      const y =
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        0.12;

      const z = (Math.random() - 0.5) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  }, [count]);
}

/* ================= DIAMOND ================= */
function Diamond({ position }) {
  const ref = useRef();

  const scale = useMemo(() => 0.00008 + Math.random() * 0.08, []);
  const rotation = useMemo(
    () => [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.005;
    ref.current.position.y +=
      Math.sin(t * 2 + position.x * 5) * 0.0003;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#ff0000"
        roughness={0.3}
        metalness={1}
        transmission={0.45}
        thickness={0.2}
        ior={2.5}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
        reflectivity={0.7}
        flatShading
      />
    </mesh>
  );
}

/* ================= HEART ================= */
function DiamondHeart() {
  const points = useHeartPoints(3000);

  return (
    <group position={[0, 1, 0]}>
      {points.map((p, i) => (
        <Diamond key={i} position={p} />
      ))}
    </group>
  );
}

/* ================= PEDESTAL ================= */
function Pedestal() {
  return (
    <mesh position={[0, -2.25, 0]}>
      <cylinderGeometry args={[3.2, 3.2, 0.3, 64]} />
      <meshStandardMaterial
        color="rgba(40, 40, 40, 0.4)"
        roughness={0.005}
        metalness={0.002}
      />
    </mesh>
  );
}

/* ================= SCENE ================= */
function Scene() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.25;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.25;
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <>
      <ambientLight intensity={1.0} />

      <spotLight
        position={[5, 5, 5]}
        intensity={0.5}
        angle={0.35}
        penumbra={0.4}
      />

      <pointLight
        position={[0, 1.2, -1.5]}
        intensity={2}
        color="rgba(255, 0, 0, 0.79)"
      />

      <directionalLight position={[0, 3, 3]} intensity={2.2} />

      <Title Diamond={Diamond} />
      <DiamondHeart />
      <Pedestal />

      <OrbitControls enableZoom enablePan />
    </>
  );
}

/* ================= MAIN ================= */
export default function Thanks() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="thanks-container">
      {/* 🔙 Back Button */}
      <button className="back-button" onClick={goBack}>
        ← Back
      </button>

      <Canvas camera={{ position: [3.8, 0, -8], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
