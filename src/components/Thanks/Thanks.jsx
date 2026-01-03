import React, { useMemo, useRef, Suspense, useState, useEffect } from "react";
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
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.12;
      const z = (Math.random() - 0.5) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [count]);
}

/* ================= DIAMOND ================= */
function Diamond({ position, heartColor }) {
  const ref = useRef();
  const scale = useMemo(() => 0.00008 + Math.random() * 0.08, []);
  const rotation = useMemo(() => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;
      ref.current.position.y += Math.sin(t * 2 + position.x * 5) * 0.0003;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={heartColor}
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
function DiamondHeart({ heartColor }) {
  const points = useHeartPoints(3000);
  return (
    <group position={[0, 1, 0]}>
      {points.map((p, i) => (
        <Diamond key={i} position={p} heartColor={heartColor} />
      ))}
    </group>
  );
}

/* ================= PEDESTAL ================= */
function Pedestal() {
  return (
    <mesh position={[0, -2.25, 0]}>
      <cylinderGeometry args={[3.2, 3.2, 0.3, 64]} />
      <meshStandardMaterial color="rgba(40, 40, 40, 0.4)" roughness={0.005} metalness={0.002} />
    </mesh>
  );
}

/* ================= FLASHLIGHT ================= */
function Flashlight() {
  const lightRef = useRef();
  const isLocked = useRef(false);
  const { viewport, mouse, gl } = useThree();

  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
      isLocked.current = !isLocked.current;
    };
    const canvas = gl.domElement;
    canvas.addEventListener("contextmenu", handleRightClick);
    return () => canvas.removeEventListener("contextmenu", handleRightClick);
  }, [gl]);

  useFrame(() => {
    if (lightRef.current && !isLocked.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 2);
    }
  });

  return <pointLight ref={lightRef} intensity={15} distance={15} decay={2} color="#ffffff" />;
}

/* ================= SCENE ================= */
function Scene({ freeCamera, heartColor, currentText }) {
  const { camera, mouse } = useThree();

  useFrame(() => {
    if (!freeCamera) {
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.25;
      camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.25;
      camera.lookAt(0, 0.5, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} /> 
      <Flashlight />
      <spotLight position={[5, 5, 5]} intensity={0.5} angle={0.35} penumbra={0.4} />
      <pointLight position={[0, 1.2, -1.5]} intensity={2} color={heartColor} />
      <directionalLight position={[0, 3, 3]} intensity={2.2} />
      <Title Diamond={Diamond} text={currentText} />
      <DiamondHeart heartColor={heartColor} />
      <Pedestal />
      <OrbitControls enabled={freeCamera} enableZoom={freeCamera} enablePan={freeCamera} />
    </>
  );
}

/* ================= MAIN ================= */
export default function Thanks() {
  const [freeCamera, setFreeCamera] = useState(false);
  const [heartColor, setHeartColor] = useState("#ff0000");
  const [showHint, setShowHint] = useState(false);
  const colorInputRef = useRef();
  const timeoutRef = useRef(null);

  const messages = ["THANK YOU", "COME BACK SOON", "THANKS FOR VISITING", "GLAD YOU'RE HERE", "SEE YOU AGAIN"];
  const [msgIndex, setMsgIndex] = useState(0);

  // ניהול זיהוי תזוזת עכבר להודעת ההנחיה
  useEffect(() => {
    const handleMouseMove = () => {
      setShowHint(true);
      
      // איפוס הטיימר בכל תזוזה
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // אם אין תזוזה במשך 2 שניות, נעל את ההודעה (Fade Out)
      timeoutRef.current = setTimeout(() => {
        setShowHint(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const goBack = () => window.history.back();
  const nextMessage = () => setMsgIndex((prev) => (prev + 1) % messages.length);

  return (
    <div className="thanks-container">
      <button className="back-button" onClick={goBack}>Back_</button>
      <button className={`free-camera-btn ${freeCamera ? 'active' : ''}`} onClick={() => setFreeCamera(!freeCamera)}>
        {freeCamera ? "Locked_" : "Camera_"}
      </button>
      <button className="color-btn" onClick={() => colorInputRef.current.click()}>Color_</button>
      <button className="text-btn" onClick={nextMessage}>Text_</button>

      {/* הודעת הנחיה דינמית */}
      <div className={`flashlight-hint ${showHint ? 'visible' : ''}`}>
        Right-click to lock flashlight
      </div>

      <input
        type="color"
        ref={colorInputRef}
        value={heartColor}
        onChange={(e) => setHeartColor(e.target.value)}
        style={{ display: "none" }}
      />

      <Canvas camera={{ position: [3.8, 0, -8], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene freeCamera={freeCamera} heartColor={heartColor} currentText={messages[msgIndex]} />
        </Suspense>
      </Canvas>
    </div>
  );
}