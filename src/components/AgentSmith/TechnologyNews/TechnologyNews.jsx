import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import * as THREE from "three";
import "./TechnologyNews.css";

const translations = {
  en: {
    dir: "ltr",
    header: "Technology News",
    subHeader: "Latest developments in the digital frontier",
    readMore: "Read More",
    toggleLabel: "HE", // התווית שתוצג כשאנחנו באנגלית
    topics: [
      { title: "AI Revolution", subtitle: "Artificial Intelligence", content: "Breakthrough developments in machine learning, neural networks, and autonomous systems." },
      { title: "Quantum Breakthrough", subtitle: "Quantum Computing", content: "Advancements in quantum algorithms and qubit technology." },
      { title: "Web3 Expansion", subtitle: "Blockchain & Web3", content: "The evolution of decentralized applications and digital ownership." },
      { title: "5G Networks", subtitle: "Telecommunication", content: "Next-generation connectivity infrastructure and IoT integration." },
      { title: "Space Tech", subtitle: "Aerospace & Satellites", content: "Innovations in space exploration and commercial spaceflight." },
    ],
  },
  he: {
    dir: "rtl",
    header: "חדשות טכנולוגיה",
    subHeader: "ההתפתחויות האחרונות בחזית הדיגיטלית",
    readMore: "קרא עוד",
    toggleLabel: "EN", // התווית שתוצג כשאנחנו בעברית
    topics: [
      { title: "מהפכת הבינה המלאכותית", subtitle: "בינה מלאכותית", content: "פריצות דרך בלמידת מכונה, רשתות נוירונים ומערכות אוטונומיות." },
      { title: "פריצת דרך קוונטית", subtitle: "מחשוב קוונטי", content: "התקדמות באלגוריתמים קוונטיים וטכנולוגיית קיוביטים." },
      { title: "התרחבות Web3", subtitle: "בלוקצ'יין ו-Web3", content: "התפתחות יישומים מבוזרים ומערכות בעלות דיגיטליות." },
      { title: "רשתות 5G", subtitle: "תקשורת", content: "תשתיות קישוריות מתקדמות ושילוב IoT." },
      { title: "טכנולוגיות חלל", subtitle: "תעופה ולוויינים", content: "חדשנות בחקר החלל וטיסות חלל מסחריות." },
    ],
  },
};

// ... פונקציית seededRandom ומרכיב BackgroundParticles נשארים ללא שינוי ...
function seededRandom(seed) {
  let x = Math.sin(seed) * 250;
  return x - Math.floor(x);
}

const BackgroundParticles = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 150);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const PARTICLE_COUNT = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.set([(seededRandom(i * 0.1) - 0.5) * 60, (seededRandom(i * 0.2) - 0.5) * 40, (seededRandom(i * 0.3) - 0.5) * 30], i * 3);
      seeds[i] = seededRandom(i * 0.4);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    const vertexShader = `
      uniform vec3 uMouse;
      uniform float uTime;
      attribute float seed;
      varying float vDist;
      varying float vSeed;
      void main() {
        vec3 pos = position;
        float dist = distance(pos, uMouse);
        vDist = dist;
        vSeed = seed;
        pos.x += sin(uTime + seed * 10.0) * 0.2;
        pos.y += cos(uTime + seed * 15.0) * 0.2;
        if (dist < 5.0) {
          float force = (1.0 - dist / 5.0) * 0.5;
          pos += normalize(pos - uMouse) * force;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 2.0 + (1.0 - clamp(dist / 5.0, 0.0, 1.0)) * 4.0;
      }
    `;
    const fragmentShader = `
      varying float vDist;
      varying float vSeed;
      void main() {
        if (length(gl_PointCoord - 0.5) > 0.5) discard;
        vec3 color = mix(vec3(0.0, 1.0, 0.2), vec3(0.5, 1.0, 0.7), vSeed);
        gl_FragColor = vec4(color, 1.0 - clamp(vDist/10.0, 0.0, 1.0));
      }
    `;

    const uniforms = { uMouse: { value: new THREE.Vector3(100, 100, 0) }, uTime: { value: 0 } };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, blending: THREE.AdditiveBlending, depthTest: false });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      uniforms.uMouse.value.copy(camera.position).add(dir.multiplyScalar(30));
    };

    window.addEventListener("pointermove", handleMouseMove);
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="background-particles" />;
};

const TechnologyCard = ({ title, subtitle, content, color, readMore }) => {
  return (
    <motion.div className="modern-card">
      <div className="card-background" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
        <p className="card-description">{content}</p>
        <motion.button className="card-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span>{readMore}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function TechnologyNews() {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="modern-news-container" ref={containerRef} dir={t.dir}>
      <BackgroundParticles />

      {/* 🔁 כפתור החלפת שפה ממוקם בפינה הימנית */}
      <button
        className="btn-locale-fixed"
        onClick={() => setLocale(locale === "en" ? "he" : "en")}
      >
        {t.toggleLabel}
      </button>

      <motion.div className="modern-news-header" style={{ y: headerY }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {t.header}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {t.subHeader}
        </motion.p>
      </motion.div>

      <div className="modern-news-grid">
        {t.topics.map((topic, idx) => (
          <TechnologyCard key={idx} {...topic} color="#26ff00ff" readMore={t.readMore} />
        ))}
      </div>
    </div>
  );
}