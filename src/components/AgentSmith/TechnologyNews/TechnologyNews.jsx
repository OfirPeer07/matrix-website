import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import * as THREE from "three";
import "./TechnologyNews.css";

const topics = [
  {
    title: "AI Revolution",
    subtitle: "Artificial Intelligence",
    content:
      "Breakthrough developments in machine learning, neural networks, and autonomous systems that are reshaping industries worldwide.",
    icon: "🤖",
    color: "#00eaff",
  },
  {
    title: "Quantum Breakthrough",
    subtitle: "Quantum Computing",
    content:
      "Advancements in quantum algorithms, qubit technology, and quantum supremacy achievements that promise exponential computational power.",
    icon: "⚛️",
    color: "#ff6b6b",
  },
  {
    title: "Web3 Expansion",
    subtitle: "Blockchain & Web3",
    content:
      "The evolution of decentralized applications, DeFi protocols, and digital ownership systems transforming the internet landscape.",
    icon: "🔗",
    color: "#4ecdc4",
  },
  {
    title: "5G Networks",
    subtitle: "Telecommunication",
    content:
      "Next-generation connectivity infrastructure, IoT integration, and ultra-low latency networks enabling smart city development.",
    icon: "📡",
    color: "#45b7d1",
  },
  {
    title: "Space Tech",
    subtitle: "Aerospace & Satellites",
    content:
      "Innovations in space exploration, satellite technology, and commercial spaceflight opening new frontiers for humanity.",
    icon: "🚀",
    color: "#96ceb4",
  },
];

// reproducible randomness
function seededRandom(seed) {
  let x = Math.sin(seed) * 250;
  return x - Math.floor(x);
}

// 🌌 Background Particles (ShaderMaterial + noise + unproject + performance)
const BackgroundParticles = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const DPR_CAP = 1.25; // cap DPR כדי לשמור FPS
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ==== Params (performance) ====
    const PARTICLE_COUNT = 25000; // 20–25K נראה טוב ומהיר
    const RADIUS = 2;
    const STRENGTH = 70.0;

    // === Geometry ===
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (seededRandom(i * 0.1) - 0.5) * 40;
      const y = (seededRandom(i * 0.2) - 0.5) * 30;
      const z = (seededRandom(i * 0.3) - 0.5) * 25;
      positions.set([x, y, z], i * 3);
      seeds[i] = seededRandom(i * 0.4);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    // === Shaders ===
    const vertexShader = `
      uniform vec3 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      uniform float uTime;

      attribute float seed;

      varying float vDist;
      varying float vSeed;

      void main() {
        vec3 pos = position;

        float dx = pos.x - uMouse.x;
        float dy = pos.y - uMouse.y;
        float dz = pos.z - uMouse.z;
        float dist = sqrt(dx*dx + dy*dy + dz*dz);

        vDist = dist;
        vSeed = seed;

        // noise-based movement (תנועה תמידית עדינה)
        pos.x += sin(uTime + seed * 10.0) * 0.3;
        pos.y += cos(uTime + seed * 15.0) * 0.3;
        pos.z += sin(uTime + seed * 20.0) * 0.3;

        // repulsion from mouse
        if (dist < uRadius) {
          float force = (1.0 - dist / uRadius) * uStrength * 0.01;
          pos.x += normalize(dx) * force;
          pos.y += normalize(dy) * force;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        // point size dynamic by distance
        gl_PointSize = 2.0 + (1.0 - clamp(dist / uRadius, 0.0, 1.0)) * 6.0;
      }
    `;

    const fragmentShader = `
      varying float vDist;
      varying float vSeed;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard; // נקודה עגולה

        float intensity = 1.0 - clamp(vDist / 5.0, 0.0, 1.0);

        // צבעים משתנים לפי seed
        vec3 baseColor = mix(vec3(0.4, 0.8, 1.0), vec3(1.0, 0.5, 0.7), vSeed);

        gl_FragColor = vec4(baseColor * intensity, intensity);
      }
    `;

    const uniforms = {
      uMouse: { value: new THREE.Vector3(1000, 1000, 0) },
      uRadius: { value: RADIUS },
      uStrength: { value: STRENGTH },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();

    // unproject mouse -> world z=0
    const mouseWorld = new THREE.Vector3();
    function updateMouse(e) {
      const rect = mount.getBoundingClientRect();
      const mouseNDC = new THREE.Vector3(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
        0
      );
      mouseNDC.unproject(camera);
      const dir = mouseNDC.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z; // חיתוך עם z=0
      mouseWorld.copy(camera.position).add(dir.multiplyScalar(distance));
      uniforms.uMouse.value.copy(mouseWorld);
    }

    window.addEventListener("pointermove", updateMouse, { passive: true });
    window.addEventListener("mouseout", () =>
      uniforms.uMouse.value.set(1000, 1000, 0)
    );

    // ריסייז
    const handleResize = () => {
      const rect = mount.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    };
    window.addEventListener("resize", handleResize);

    // רינדור רק כשגלוי (IntersectionObserver)
    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { root: null, threshold: 0 }
    );
    io.observe(mount);

    // עצירה כשעוברים טאב
    document.addEventListener("visibilitychange", () => {
      isVisible = document.visibilityState === "visible";
    });

    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      io.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", updateMouse);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="background-particles"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

// ===== Card =====
const TechnologyCard = ({ title, subtitle, content, icon, color, index }) => {
  const cardRef = useRef(null);
  // מתחילים להופיע מעט מוקדם יותר כדי למנוע "חיתוך" ותחושה איטית
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <motion.div
      ref={cardRef}
      className="modern-card"
      initial={false}        // ⬅️ בלי מצב התחלתי
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} // ⬅️ קבוע
      style={{ "--card-color": color }}
    >
      <div className="card-background" />
      <motion.div className="card-icon" style={{ background: color }}>
        <span className="icon-emoji">{icon}</span>
      </motion.div>

      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
        <p className="card-description">{content}</p>

        <motion.button
          className="card-action"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: color }}
        >
          <span>Read More</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function TechnologyNews() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="modern-news-container" ref={containerRef}>
      <BackgroundParticles />

      <motion.div className="modern-news-header" style={{ y: headerY }}>
        <motion.h1 initial={{ y: 60 }} animate={{ y: 0 }}>
          Technology News
        </motion.h1>
        <motion.p initial={{ y: 24 }} animate={{ y: 0 }}>
          Latest developments in the digital frontier
        </motion.p>
      </motion.div>

      <div className="modern-news-grid">
        {topics.map((topic, idx) => (
          <TechnologyCard key={idx} {...topic} index={idx} />
        ))}
      </div>
    </div>
  );
}
