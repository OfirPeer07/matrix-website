import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, Environment, Stars, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Matrix Rain Effect Component
function MatrixRain() {
  const meshRef = useRef();
  const [characters] = useState(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    return chars.split('');
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.5;
      if (meshRef.current.position.y < -10) {
        meshRef.current.position.y = 10;
        meshRef.current.position.x = Math.random() * 20 - 10;
      }
    }
  });

  return (
    <Text
      ref={meshRef}
      position={[Math.random() * 20 - 10, 10, 0]}
      fontSize={0.5}
      color="#00ff41"
      anchorX="center"
      anchorY="middle"
    >
      {characters[Math.floor(Math.random() * characters.length)]}
    </Text>
  );
}

// Rotating Matrix Cube
function MatrixCube() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#00ff41"
        wireframe
        transparent
        opacity={0.8}
        emissive="#00ff41"
        emissiveIntensity={0.2}
      />
    </Box>
  );
}

// Floating Spheres
function FloatingSpheres() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.1, 16, 16]}
          position={[
            Math.cos(i * Math.PI / 4) * 3,
            0,
            Math.sin(i * Math.PI / 4) * 3
          ]}
        >
          <meshStandardMaterial
            color="#ff4081"
            emissive="#ff4081"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Matrix Torus
function MatrixTorus() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Torus
      ref={meshRef}
      args={[2, 0.5, 16, 100]}
      position={[0, -3, 0]}
    >
      <meshStandardMaterial
        color="#0066ff"
        wireframe
        transparent
        opacity={0.6}
        emissive="#0066ff"
        emissiveIntensity={0.3}
      />
    </Torus>
  );
}

// Main Scene Component
function Scene() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 5, 10);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff41" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4081" />
      
      <MatrixCube />
      <FloatingSpheres />
      <MatrixTorus />
      
      {/* Matrix Rain Effect */}
      {Array.from({ length: 20 }, (_, i) => (
        <MatrixRain key={i} />
      ))}
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Environment preset="night" />
    </>
  );
}

// Main Demo Component
export default function ThreeJSDemo() {
  const [activeTab, setActiveTab] = useState('3d-scene');
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="min-h-screen matrix-bg">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="matrix-title text-5xl mb-4 animate-glow">
          Three.js + WebGL + Matrix
        </h1>
        <p className="matrix-subtitle text-xl">
          Interactive 3D Graphics with Matrix Aesthetics
        </p>
      </div>

      {/* Navigation */}
      <div className="matrix-nav rounded-lg mx-6 mb-8">
        <div className="flex space-x-1 p-2">
          {[
            { id: '3d-scene', label: '3D Scene' },
            { id: 'controls', label: 'Controls' },
            { id: 'performance', label: 'Performance' },
            { id: 'examples', label: 'Examples' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`matrix-nav-link ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        {activeTab === '3d-scene' && (
          <div className="space-y-6">
            <div className="matrix-card">
              <h3 className="matrix-title text-2xl mb-4">Interactive 3D Scene</h3>
              <p className="matrix-text mb-4">
                This 3D scene features Matrix-themed elements with WebGL rendering:
              </p>
              <ul className="matrix-text space-y-2 list-disc list-inside">
                <li>Rotating Matrix Cube with wireframe effect</li>
                <li>Floating spheres with pink glow</li>
                <li>Matrix rain effect with Japanese characters</li>
                <li>Animated torus with blue wireframe</li>
                <li>Dynamic lighting and starfield background</li>
              </ul>
            </div>
            
            <div className="matrix-card h-96 perspective-1000">
              <Canvas
                camera={{ position: [0, 5, 10], fov: 75 }}
                className="w-full h-full"
                gl={{ 
                  antialias: true, 
                  alpha: true,
                  powerPreference: "high-performance"
                }}
              >
                <Scene />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={false}
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="matrix-grid-2 gap-6">
            <div className="matrix-card">
              <h3 className="matrix-title text-xl mb-3">Mouse Controls</h3>
              <ul className="matrix-text space-y-2">
                <li><strong>Left Click + Drag:</strong> Rotate camera</li>
                <li><strong>Right Click + Drag:</strong> Pan camera</li>
                <li><strong>Scroll:</strong> Zoom in/out</li>
                <li><strong>Double Click:</strong> Reset view</li>
              </ul>
            </div>
            
            <div className="matrix-card">
              <h3 className="matrix-title text-xl mb-3">Performance Tips</h3>
              <ul className="matrix-text space-y-2">
                <li>Use wireframe materials for complex scenes</li>
                <li>Limit the number of light sources</li>
                <li>Optimize geometry with LOD (Level of Detail)</li>
                <li>Enable frustum culling for large scenes</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="matrix-card">
              <h3 className="matrix-title text-xl mb-3">WebGL Capabilities</h3>
              <div className="matrix-grid-2 gap-4">
                <div>
                  <h4 className="matrix-subtitle mb-2">Hardware Acceleration</h4>
                  <p className="matrix-text text-sm">GPU-accelerated rendering for smooth 60fps performance</p>
                </div>
                <div>
                  <h4 className="matrix-subtitle mb-2">Real-time Shadows</h4>
                  <p className="matrix-text text-sm">Dynamic shadow mapping and soft shadows</p>
                </div>
                <div>
                  <h4 className="matrix-subtitle mb-2">Post-processing</h4>
                  <p className="matrix-text text-sm">Bloom, depth of field, and motion blur effects</p>
                </div>
                <div>
                  <h4 className="matrix-subtitle mb-2">Particle Systems</h4>
                  <p className="matrix-text text-sm">Efficient particle rendering for effects</p>
                </div>
              </div>
            </div>
            
            <div className="matrix-card">
              <h3 className="matrix-title text-xl mb-3">Three.js Features</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Geometry', 'Materials', 'Textures', 'Lighting',
                  'Shaders', 'Animations', 'Physics', 'Audio',
                  'VR/AR', 'Post-processing', 'Optimization'
                ].map(feature => (
                  <span key={feature} className="matrix-status matrix-status-online">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="matrix-card">
              <h3 className="matrix-title text-xl mb-3">Code Examples</h3>
              <div className="bg-matrix-darker p-4 rounded font-matrix text-sm overflow-x-auto">
                <pre className="text-matrix-green">
{`// Basic Three.js Scene
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ff41" />
      </mesh>
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}`}
                </pre>
              </div>
            </div>
            
            <div className="matrix-grid-2 gap-6">
              <div className="matrix-card">
                <h4 className="matrix-title text-lg mb-2">Custom Hooks</h4>
                <p className="matrix-text text-sm">
                  Create reusable hooks for common 3D operations like animations, 
                  interactions, and performance monitoring.
                </p>
              </div>
              
              <div className="matrix-card">
                <h4 className="matrix-title text-lg mb-2">Component Library</h4>
                <p className="matrix-text text-sm">
                  Build a library of Matrix-themed 3D components that can be 
                  easily reused across your application.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-matrix-green/20">
        <p className="matrix-text opacity-70">
          Built with Three.js, React Three Fiber, and Tailwind CSS
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
