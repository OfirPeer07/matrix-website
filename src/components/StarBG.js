import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { create } from 'zustand';

// Star store for managing star instances
const useStarStore = create((set, get) => ({
  stars: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    position: [0, 0, 0],
    scale: 0,
    opacity: 0,
    life: 0,
    maxLife: 1.5,
    active: false,
  })),
  addStar: (position) => {
    const { stars } = get();
    const inactiveStar = stars.find(star => !star.active);
    if (inactiveStar) {
      inactiveStar.position = position;
      inactiveStar.scale = 0.5 + Math.random() * 0.5;
      inactiveStar.opacity = 1;
      inactiveStar.life = 0;
      inactiveStar.maxLife = 1.5;
      inactiveStar.active = true;
    }
  },
  updateStars: (deltaTime) => {
    const { stars } = get();
    stars.forEach(star => {
      if (star.active) {
        star.life += deltaTime;
        star.opacity = Math.max(0, 1 - (star.life / star.maxLife));
        star.scale *= 1.01;
        
        if (star.life >= star.maxLife) {
          star.active = false;
          star.opacity = 0;
        }
      }
    });
  },
  getActiveStars: () => {
    const { stars } = get();
    return stars.filter(star => star.active);
  },
}));

// Star sprite component
const StarSprite = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { addStar, updateStars, getActiveStars } = useStarStore();
  
  // Create star texture
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Create radial gradient for star glow
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(100, 150, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Handle pointer events
  const handlePointerMove = useCallback((event) => {
    if (event.intersections.length > 0) {
      const intersection = event.intersections[0];
      const worldPosition = intersection.point;
      
      // Spawn burst of stars
      const burstCount = 20 + Math.floor(Math.random() * 21);
      for (let i = 0; i < burstCount; i++) {
        const spreadRadius = 0.2 + Math.random() * 0.4;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spreadRadius;
        
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        addStar([
          worldPosition.x + offsetX,
          worldPosition.y + offsetY,
          worldPosition.z + (Math.random() - 0.5) * 0.1
        ]);
      }
    }
  }, [addStar]);

  // Throttled touch handler for mobile
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const handleTouchMove = useCallback((event) => {
    const now = Date.now();
    if (now - lastTouchTime < 16) return;
    setLastTouchTime(now);
    
    if (event.intersections.length > 0) {
      const intersection = event.intersections[0];
      const worldPosition = intersection.point;
      
      const burstCount = 10 + Math.floor(Math.random() * 11);
      for (let i = 0; i < burstCount; i++) {
        const spreadRadius = 0.2 + Math.random() * 0.4;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spreadRadius;
        
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        addStar([
          worldPosition.x + offsetX,
          worldPosition.y + offsetY,
          worldPosition.z + (Math.random() - 0.5) * 0.1
        ]);
      }
    }
  }, [addStar, lastTouchTime]);

  // Animation loop
  useFrame((state, delta) => {
    updateStars(delta);
    
    if (meshRef.current && materialRef.current) {
      const activeStars = getActiveStars();
      const tempObject = new THREE.Object3D();
      
      activeStars.forEach((star, index) => {
        tempObject.position.set(star.position[0], star.position[1], star.position[2]);
        tempObject.scale.setScalar(star.scale);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(index, tempObject.matrix);
      });
      
      meshRef.current.count = activeStars.length;
      meshRef.current.instanceMatrix.needsUpdate = true;
      
      if (activeStars.length > 0) {
        const avgOpacity = activeStars.reduce((sum, star) => sum + star.opacity, 0) / activeStars.length;
        materialRef.current.opacity = avgOpacity;
      }
    }
  });

  if (!starTexture) return null;

  return (
    <>
      {/* Invisible plane to capture pointer events */}
      <mesh
        position={[0, 0, -5]}
        onPointerMove={handlePointerMove}
        onPointerOver={handlePointerMove}
        onTouchMove={handleTouchMove}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Star instances */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={starTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </>
  );
};

// Main StarBG component
const StarBG = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <StarSprite />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default StarBG;
