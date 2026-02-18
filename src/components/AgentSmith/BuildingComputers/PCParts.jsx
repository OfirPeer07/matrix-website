import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── SHARED MATERIAL HELPERS ────────────────────────────────────────────────

const MAT = {
    pcbGreen: { color: "#1a3a22", metalness: 0.1, roughness: 0.75 },
    pcbBlack: { color: "#0d0d10", metalness: 0.12, roughness: 0.80 },
    aluminum: { color: "#d8dce0", metalness: 0.88, roughness: 0.18 },
    aluminumDark: { color: "#1c1e22", metalness: 0.78, roughness: 0.28 },
    rogSilver: { color: "#e2e5e9", metalness: 0.92, roughness: 0.14 },
    plasticWhite: { color: "#f0f2f5", metalness: 0.08, roughness: 0.55 },
    chrome: { color: "#ffffff", metalness: 1.0, roughness: 0.02 },
    copper: { color: "#b87333", metalness: 0.92, roughness: 0.16 },
    gold: { color: "#d4a017", metalness: 0.95, roughness: 0.12 },
    rubber: { color: "#111111", metalness: 0.0, roughness: 0.95 },
};

// Emissive green LED material (Lian Li / Matrix style)
const LED_GREEN = { color: "#17ca07", emissive: "#17ca07", emissiveIntensity: 3.5, toneMapped: false };
// Neon green for high-visibility components
const NEON_GREEN = { color: "#22ff44", emissive: "#22ff44", emissiveIntensity: 4.5, toneMapped: false };
// Emissive white LED
const LED_WHITE = { color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.0, toneMapped: false };

function M(props) {
    return <meshStandardMaterial {...props} />;
}

// ─── LIAN LI INFINITY FAN ───────────────────────────────────────────────────
// Accurate to AL120 Infinity: square 120mm frame, infinity mirror ring, 7 blades

function LianLiInfinityFan({ size = 0.5, spinSpeed = 8, ledColor = "#17ca07", ledIntensity = 3.5 }) {
    const bladeRef = useRef();
    useFrame((_, delta) => {
        if (bladeRef.current) bladeRef.current.rotation.z -= delta * spinSpeed;
    });

    const S = size;
    const R = S * 0.44; // fan blade radius
    const frameThick = S * 0.08;

    return (
        <group>
            {/* ── Square Frame ── */}
            {/* Top bar */}
            <mesh position={[0, S / 2 - frameThick / 2, 0]}>
                <boxGeometry args={[S, frameThick, S * 0.22]} />
                <M {...MAT.aluminumDark} />
            </mesh>
            {/* Bottom bar */}
            <mesh position={[0, -S / 2 + frameThick / 2, 0]}>
                <boxGeometry args={[S, frameThick, S * 0.22]} />
                <M {...MAT.aluminumDark} />
            </mesh>
            {/* Left bar */}
            <mesh position={[-S / 2 + frameThick / 2, 0, 0]}>
                <boxGeometry args={[frameThick, S - frameThick * 2, S * 0.22]} />
                <M {...MAT.aluminumDark} />
            </mesh>
            {/* Right bar */}
            <mesh position={[S / 2 - frameThick / 2, 0, 0]}>
                <boxGeometry args={[frameThick, S - frameThick * 2, S * 0.22]} />
                <M {...MAT.aluminumDark} />
            </mesh>

            {/* ── Infinity Mirror Ring (outer) ── */}
            <mesh position={[0, 0, S * 0.02]}>
                <torusGeometry args={[R * 1.05, S * 0.025, 16, 64]} />
                <M color={ledColor} emissive={ledColor} emissiveIntensity={ledIntensity} toneMapped={false} />
            </mesh>
            {/* Inner ring (dimmer) */}
            <mesh position={[0, 0, S * 0.01]}>
                <torusGeometry args={[R * 0.88, S * 0.012, 16, 64]} />
                <M color={ledColor} emissive={ledColor} emissiveIntensity={ledIntensity * 0.5} toneMapped={false} />
            </mesh>
            {/* Innermost ring */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[R * 0.72, S * 0.008, 16, 64]} />
                <M color={ledColor} emissive={ledColor} emissiveIntensity={ledIntensity * 0.25} toneMapped={false} />
            </mesh>

            {/* ── Spinning Blades ── */}
            <group ref={bladeRef}>
                {/* Center hub */}
                <mesh>
                    <cylinderGeometry args={[R * 0.18, R * 0.18, S * 0.14, 16]} />
                    <M {...MAT.aluminumDark} />
                </mesh>
                {/* Hub cap */}
                <mesh position={[0, 0, S * 0.07]}>
                    <cylinderGeometry args={[R * 0.12, R * 0.12, S * 0.02, 16]} />
                    <M {...MAT.rogSilver} />
                </mesh>
                {/* 7 blades */}
                {Array.from({ length: 7 }, (_, i) => {
                    const angle = (i / 7) * Math.PI * 2;
                    const bx = Math.cos(angle) * R * 0.55;
                    const by = Math.sin(angle) * R * 0.55;
                    return (
                        <mesh key={i} position={[bx, by, 0]} rotation={[0, 0, angle + 0.4]}>
                            <boxGeometry args={[R * 0.22, R * 0.62, S * 0.04]} />
                            <M color="#c8cdd4" metalness={0.3} roughness={0.6} transparent opacity={0.88} />
                        </mesh>
                    );
                })}
            </group>

            {/* ── Daisy-chain connector nub (right side) ── */}
            <mesh position={[S / 2 + S * 0.04, -S * 0.3, 0]}>
                <boxGeometry args={[S * 0.08, S * 0.12, S * 0.1]} />
                <M {...MAT.rubber} />
            </mesh>
        </group>
    );
}

// ─── GPU FAN component ──────────────────────────────────────────────────────
function GpuFan({ radius, thickness }) {
    const bladeRef = useRef();
    useFrame((state) => {
        if (bladeRef.current) {
            // High-speed smooth spin
            bladeRef.current.rotation.z = -state.clock.elapsedTime * 18;
        }
    });

    return (
        <group ref={bladeRef}>
            {/* Fan hub — correctly oriented along Z axis */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius * 0.28, radius * 0.28, thickness * 1.5, 16]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Center LED glow disk */}
            <mesh position={[0, 0, thickness * 0.76]}>
                <circleGeometry args={[radius * 0.22, 16]} />
                <meshStandardMaterial {...NEON_GREEN} emissiveIntensity={3} />
            </mesh>
            {/* 7 blades, specifically requested */}
            {Array.from({ length: 7 }, (_, i) => {
                const angle = (i / 7) * Math.PI * 2;
                // Positioned on the hub rim, oriented radially
                const bx = Math.cos(angle) * radius * 0.5;
                const by = Math.sin(angle) * radius * 0.5;
                return (
                    <group key={i} position={[bx, by, 0]} rotation={[0, 0, angle]}>
                        {/* Blade body — tilted for aerodynamic look */}
                        <mesh rotation={[0.4, 0, 0]}>
                            <boxGeometry args={[radius * 0.35, radius * 0.8, thickness * 0.1]} />
                            <meshStandardMaterial color="#051505" metalness={0.5} roughness={0.4} transparent opacity={0.9} />
                        </mesh>
                        {/* Blade green accent light */}
                        <mesh position={[0, 0, thickness * 0.06]} rotation={[0.4, 0, 0]}>
                            <boxGeometry args={[radius * 0.25, 0.005, 0.005]} />
                            <meshStandardMaterial {...NEON_GREEN} emissiveIntensity={4} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

// ─── O11 DYNAMIC SLIM CASE ──────────────────────────────────────────────────
// Real O11 Dynamic: 285mm W × 459mm H × 459mm D
// Our scale: W=3.2, H=3.6, D=1.8 (slim artistic version)
// Motherboard mounts on LEFT wall (X=-W/2), facing +X (toward glass right side)
// GPU mounted vertically, fans facing +Z (toward glass front)
// 3x Lian Li fans on BOTTOM intake, 3x on side next to motherboard

export function O11CaseModel({ onReady, xray }) {
    const groupRef = useRef();

    const W = 3.2;
    const H = 3.6;
    const D = 1.8;
    const T = 0.07;

    const size = useMemo(() => new THREE.Vector3(W, H, D), []);
    useEffect(() => { if (onReady) onReady(size); }, [onReady, size]);

    const glassMat = (
        <meshStandardMaterial
            color="#c8e8ff" metalness={0.05} roughness={0.02}
            transparent opacity={xray ? 0.04 : 0.13} side={THREE.DoubleSide}
        />
    );
    const frameMat = (
        <meshStandardMaterial
            color="#e8eaed" metalness={0.90} roughness={0.18}
            transparent={xray} opacity={xray ? 0.1 : 1}
        />
    );
    const darkMat = (
        <meshStandardMaterial
            color="#1c1e22" metalness={0.75} roughness={0.30}
            transparent={xray} opacity={xray ? 0.08 : 1}
        />
    );

    // Fan size for bottom/side: 3 fans across width
    const fanSize = W / 3.5;

    return (
        <group ref={groupRef}>
            {/* ── FRAME ── */}
            <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[W, T, D]} />{frameMat}
            </mesh>
            <mesh position={[0, -H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[W, T, D]} />{frameMat}
            </mesh>
            <mesh position={[0, 0, -D / 2]} castShadow receiveShadow>
                <boxGeometry args={[W, H, T]} />{darkMat}
            </mesh>
            {/* Left wall (opaque aluminum) */}
            <mesh position={[-W / 2, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[T, H, D]} />{frameMat}
            </mesh>
            {/* Right side top/bottom frame strips (open for glass) */}
            <mesh position={[W / 2, H / 2 - T / 2, 0]}>
                <boxGeometry args={[T, T, D]} />{frameMat}
            </mesh>
            <mesh position={[W / 2, -H / 2 + T / 2, 0]}>
                <boxGeometry args={[T, T, D]} />{frameMat}
            </mesh>
            {/* Right side back vertical strip */}
            <mesh position={[W / 2, 0, -D / 2 + T / 2]}>
                <boxGeometry args={[T, H, T]} />{frameMat}
            </mesh>

            {/* ── GLASS FRONT PANEL (full height) ── */}
            <mesh position={[0, 0, D / 2]}>
                <boxGeometry args={[W - T * 2, H - T * 2, T * 0.35]} />
                {glassMat}
            </mesh>
            {/* Front top/bottom accent strips */}
            <mesh position={[0, H / 2, D / 2]}>
                <boxGeometry args={[W, T * 1.3, T * 1.3]} />
                <meshStandardMaterial color="#ffffff" metalness={0.92} roughness={0.08} />
            </mesh>
            <mesh position={[0, -H / 2, D / 2]}>
                <boxGeometry args={[W, T * 1.3, T * 1.3]} />
                <meshStandardMaterial color="#ffffff" metalness={0.92} roughness={0.08} />
            </mesh>

            {/* ── PSU SHROUD (slim bottom strip only) ── */}
            <mesh position={[0, -H / 2 + 0.15, 0]} castShadow>
                <boxGeometry args={[W - T * 2, 0.30, D - T * 2]} />
                {darkMat}
            </mesh>
            {/* Shroud top divider plate */}
            <mesh position={[0, -H / 2 + 0.31, 0]}>
                <boxGeometry args={[W - T * 2, T, D - T * 2]} />
                {frameMat}
            </mesh>
            {/* Shroud LED strip (front edge) */}
            <mesh position={[0, -H / 2 + 0.31, D / 2 - 0.12]}>
                <boxGeometry args={[W * 0.85, 0.012, 0.012]} />
                <M {...LED_GREEN} />
            </mesh>

            {/* ── BOTTOM INTAKE FANS (3x Lian Li Infinity) ── */}
            {/* Mounted on bottom, blowing up into case */}
            {[-W / 3 + 0.05, 0, W / 3 - 0.05].map((x, i) => (
                <group key={`bot-fan-${i}`} position={[x, -H / 2 + T + fanSize / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <LianLiInfinityFan size={fanSize} spinSpeed={7 + i} ledColor="#17ca07" ledIntensity={3.5} />
                </group>
            ))}

            {/* ── SIDE FANS (3x Lian Li Infinity, next to motherboard on left wall) ── */}
            {/* Mounted on left wall, blowing toward motherboard */}
            {[H / 4, 0, -H / 4].map((y, i) => (
                <group key={`side-fan-${i}`} position={[-W / 2 + T + fanSize / 2, y + 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <LianLiInfinityFan size={fanSize} spinSpeed={6 + i * 0.8} ledColor="#17ca07" ledIntensity={3.0} />
                </group>
            ))}

            {/* ── FRONT I/O ── */}
            <mesh position={[W * 0.3, -H / 2 + 0.15, D / 2 + 0.04]}>
                <boxGeometry args={[0.55, 0.14, 0.04]} />
                <M {...MAT.aluminumDark} />
            </mesh>
            {/* Power button */}
            <mesh position={[W * 0.3 + 0.22, -H / 2 + 0.15, D / 2 + 0.06]}>
                <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
                <M {...LED_GREEN} />
            </mesh>
            {/* USB-C port */}
            <mesh position={[W * 0.3 - 0.1, -H / 2 + 0.15, D / 2 + 0.06]}>
                <boxGeometry args={[0.06, 0.04, 0.03]} />
                <M color="#111" metalness={0.3} roughness={0.8} />
            </mesh>

            {/* ── RUBBER FEET ── */}
            {[[-W / 2 + 0.2, -D / 2 + 0.2], [W / 2 - 0.2, -D / 2 + 0.2], [-W / 2 + 0.2, D / 2 - 0.2], [W / 2 - 0.2, D / 2 - 0.2]].map(([x, z], i) => (
                <mesh key={i} position={[x, -H / 2 - 0.07, z]}>
                    <cylinderGeometry args={[0.07, 0.09, 0.14, 16]} />
                    <M {...MAT.rubber} />
                </mesh>
            ))}

            {/* ── PCIe SLOT BRACKETS (back panel, right side) ── */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <mesh key={i} position={[W / 2 - T * 2, 0.05 - i * 0.18, -D / 2 + T * 2]}>
                    <boxGeometry args={[T * 3, 0.14, 0.06]} />
                    <M {...MAT.rogSilver} />
                </mesh>
            ))}

            {/* ── INTERNAL LED STRIPS (thin edge strips only, no floor) ── */}
            {/* Front bottom edge strip */}
            <mesh position={[0, -H / 2 + 0.34, D / 2 - T * 3]}>
                <boxGeometry args={[W * 0.7, 0.01, 0.01]} />
                <M {...LED_GREEN} />
            </mesh>
            {/* Back bottom edge strip */}
            <mesh position={[0, -H / 2 + 0.34, -D / 2 + T * 3]}>
                <boxGeometry args={[W * 0.7, 0.01, 0.01]} />
                <M {...LED_GREEN} />
            </mesh>
        </group>
    );
}

// ─── MOTHERBOARD MATRIX TRACES ──────────────────────────────────────────────
function MatrixTraces({ W, H, color }) {
    const traces = useMemo(() => {
        return Array.from({ length: 15 }, () => ({
            x: (Math.random() - 0.5) * W,
            y: (Math.random() - 0.5) * H,
            len: 0.15 + Math.random() * 0.35,
            dir: Math.random() > 0.5 ? 'h' : 'v',
            thickness: 0.004 + Math.random() * 0.008,
            speed: 0.5 + Math.random() * 1.5,
            offset: Math.random() * Math.PI * 2
        }));
    }, [W, H]);

    return (
        <group position={[0, 0, 0.015]}>
            {traces.map((t, i) => (
                <TraceLine key={i} {...t} color={color} />
            ))}
        </group>
    );
}

function TraceLine({ x, y, len, dir, thickness, speed, offset, color }) {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            const glow = 0.5 + Math.sin(state.clock.elapsedTime * speed + offset) * 0.5;
            meshRef.current.material.emissiveIntensity = 4.0 * glow;
            meshRef.current.material.opacity = 0.2 + glow * 0.6;
        }
    });

    const isH = dir === 'h';
    return (
        <mesh ref={meshRef} position={[x, y, 0]}>
            <boxGeometry args={[isH ? len : thickness, isH ? thickness : len, 0.001]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} toneMapped={false} />
        </mesh>
    );
}

// ─── MOTHERBOARD (ASUS ROG MAXIMUS STYLE) ───────────────────────────────────
// ATX: 305mm × 244mm. Mounts on left wall, facing right (+X direction)
// In our scene: board lies in XY plane, thickness along Z

export function MotherboardPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const W = target.size.x * 0.94;
    const H = target.size.y * 0.94;
    // PCB — Ultra-vibrant Matrix Green for maximum visibility
    const PCB_COLOR = "#002a0a";
    const PCB_NEON = "#33ff55"; // Brightened for visibility

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {/* PCB — base layer with maximum neon visibility boost */}
                <mesh>
                    <boxGeometry args={[W, H, 0.022]} />
                    <meshStandardMaterial color={PCB_COLOR} emissive={PCB_NEON} emissiveIntensity={2.5} metalness={0.4} roughness={0.6} />
                </mesh>

                {/* Glowing Matrix Trace Layer — High impact */}
                <MatrixTraces W={W} H={H} color={PCB_NEON} />

                {/* PCB surface highlight - translucent neon overlay */}
                <mesh position={[0, 0, 0.013]}>
                    <boxGeometry args={[W * 0.98, H * 0.98, 0.001]} />
                    <meshStandardMaterial color={PCB_NEON} emissive={PCB_NEON} emissiveIntensity={0.45} transparent opacity={0.4} />
                </mesh>

                {/* ── VRM / I/O Heatsink (top-left block) ── */}
                <group position={[-W * 0.36, H * 0.28, 0.07]}>
                    {/* Main block */}
                    <mesh>
                        <boxGeometry args={[W * 0.22, H * 0.38, 0.13]} />
                        <M {...MAT.rogSilver} />
                    </mesh>
                    {/* Fin array */}
                    {Array.from({ length: 8 }, (_, i) => (
                        <mesh key={i} position={[0, 0, 0.07 + i * 0.012]}>
                            <boxGeometry args={[W * 0.20, H * 0.36, 0.006]} />
                            <M {...MAT.aluminum} />
                        </mesh>
                    ))}
                    {/* ROG logo glow */}
                    <mesh position={[0, 0.02, 0.075]}>
                        <boxGeometry args={[0.12, 0.12, 0.005]} />
                        <M {...LED_GREEN} />
                    </mesh>
                </group>

                {/* ── Chipset Heatsink (center-right) ── */}
                <group position={[W * 0.22, -H * 0.22, 0.055]}>
                    <mesh>
                        <boxGeometry args={[W * 0.30, H * 0.22, 0.09]} />
                        <M {...MAT.rogSilver} />
                    </mesh>
                    {/* Diagonal slash design */}
                    <mesh position={[0.02, 0, 0.046]} rotation={[0, 0, 0.4]}>
                        <boxGeometry args={[W * 0.08, H * 0.18, 0.005]} />
                        <M color="#111" />
                    </mesh>
                </group>

                {/* ── M.2 Heatsink covers (2x) ── */}
                <mesh position={[0, -H * 0.05, 0.04]}>
                    <boxGeometry args={[W * 0.42, H * 0.08, 0.04]} />
                    <M {...MAT.rogSilver} />
                </mesh>
                <mesh position={[0, -H * 0.18, 0.04]}>
                    <boxGeometry args={[W * 0.42, H * 0.08, 0.04]} />
                    <M {...MAT.rogSilver} />
                </mesh>

                {/* ── CPU Socket (LGA1851 style) ── */}
                <mesh position={[-W * 0.08, H * 0.12, 0.018]}>
                    <boxGeometry args={[0.22, 0.22, 0.018]} />
                    <M color="#0a0a0a" metalness={0.2} roughness={0.7} />
                </mesh>
                {/* Socket frame */}
                <mesh position={[-W * 0.08, H * 0.12, 0.026]}>
                    <boxGeometry args={[0.24, 0.24, 0.006]} />
                    <M {...MAT.rogSilver} />
                </mesh>

                {/* ── DDR5 RAM Slots (4x) ── */}
                {[0, 1, 2, 3].map(i => (
                    <mesh key={i} position={[W * 0.22 + i * 0.045, H * 0.12, 0.028]}>
                        <boxGeometry args={[0.028, H * 0.52, 0.04]} />
                        <M color="#1a1a22" metalness={0.3} roughness={0.6} />
                    </mesh>
                ))}

                {/* ── PCIe x16 Slots (reinforced, 2x) ── */}
                <mesh position={[-W * 0.05, -H * 0.12, 0.026]}>
                    <boxGeometry args={[W * 0.65, 0.032, 0.04]} />
                    <M color="#888" metalness={0.85} roughness={0.2} />
                </mesh>
                <mesh position={[-W * 0.05, -H * 0.30, 0.026]}>
                    <boxGeometry args={[W * 0.65, 0.028, 0.036]} />
                    <M color="#333" metalness={0.5} roughness={0.5} />
                </mesh>

                {/* ── Copper trace lines ── */}
                {[-0.25, -0.05, 0.15, 0.35].map((xOff, i) => (
                    <mesh key={i} position={[W * xOff, 0, 0.012]}>
                        <boxGeometry args={[W * 0.015, H * 0.75, 0.002]} />
                        <M {...MAT.copper} />
                    </mesh>
                ))}

                {/* ── RGB header strip (bottom edge) ── */}
                <mesh position={[0, -H * 0.48, 0.018]}>
                    <boxGeometry args={[W * 0.6, 0.018, 0.018]} />
                    <M {...LED_GREEN} />
                </mesh>
            </group>
        </AnimatedTransform>
    );
}

// ─── GPU (RTX 5090 WHITE — VERTICAL MOUNT, FANS FACE FORWARD) ───────────────
// RTX 5090: ~340mm L × 137mm H × 67mm thick (3-slot)
// Mounted vertically: card stands upright, fans face +Z (toward glass front)
// In our scene: W=card length (X), H=card height (Y), D=card thickness (Z toward viewer)

export function GpuPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    // RTX 5090 FE: 336mm L × 149mm H × 75mm thick (3.5-slot) — black shroud with silver/chrome accents
    const W = target.size.x * 0.98;  // card length — nearly full slot width
    const H = target.size.y * 0.96;  // card height — nearly full slot height
    const D = target.size.z * 0.96;  // card thickness (fans face +Z)

    // RTX 5090 FE colors: matte black body, brushed silver accents, green LED
    const SHROUD_BLACK = { color: "#111214", metalness: 0.55, roughness: 0.35 };
    const SHROUD_SILVER = { color: "#c8cdd4", metalness: 0.88, roughness: 0.18 };
    const BACKPLATE_COLOR = { color: "#1a1c20", metalness: 0.72, roughness: 0.22 };

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {/* ── PCB ── */}
                <mesh position={[0, 0, -D * 0.35]}>
                    <boxGeometry args={[W, H * 0.55, 0.018]} />
                    <M {...MAT.pcbBlack} />
                </mesh>

                {/* ── MAIN SHROUD BODY (matte black, RTX 5090 FE style) ── */}
                <mesh>
                    <boxGeometry args={[W, H, D * 0.52]} />
                    <M {...SHROUD_BLACK} />
                </mesh>

                {/* ── Silver accent strip along the top ── */}
                <mesh position={[0, H * 0.48, D * 0.1]}>
                    <boxGeometry args={[W * 0.96, H * 0.06, D * 0.08]} />
                    <M {...SHROUD_SILVER} />
                </mesh>

                {/* ── Silver accent strip along the bottom ── */}
                <mesh position={[0, -H * 0.48, D * 0.1]}>
                    <boxGeometry args={[W * 0.96, H * 0.06, D * 0.08]} />
                    <M {...SHROUD_SILVER} />
                </mesh>

                {/* ── Diagonal design slash (RTX 5090 FE signature) ── */}
                <mesh position={[-W * 0.28, 0, D * 0.27]} rotation={[0, 0, 0.18]}>
                    <boxGeometry args={[W * 0.06, H * 0.88, D * 0.01]} />
                    <M color="#2a2c30" metalness={0.6} roughness={0.3} />
                </mesh>
                <mesh position={[-W * 0.18, 0, D * 0.27]} rotation={[0, 0, 0.18]}>
                    <boxGeometry args={[W * 0.03, H * 0.88, D * 0.01]} />
                    <M color="#2a2c30" metalness={0.6} roughness={0.3} />
                </mesh>

                {/* ── 3x FANS (facing +Z, toward glass front) ── */}
                {[-W * 0.3, 0, W * 0.3].map((xOff, i) => {
                    const fanR = D * 0.38;
                    return (
                        <group key={i} position={[xOff, H * 0.03, D * 0.27]}>
                            {/* Fan shroud cutout ring — silver */}
                            <mesh>
                                <torusGeometry args={[fanR * 1.05, D * 0.022, 16, 48]} />
                                <M {...SHROUD_SILVER} />
                            </mesh>
                            {/* Animated Fan Component — rotated 90 deg to lie flat on card face */}
                            <group rotation={[Math.PI / 2, 0, 0]}>
                                <GpuFan radius={fanR} thickness={D * 0.04} />
                            </group>
                        </group>
                    );
                })}

                {/* ── BACKPLATE (RTX 5090 FE style — dark with cutouts) ── */}
                <mesh position={[0, 0, -D * 0.28]}>
                    <boxGeometry args={[W, H, D * 0.04]} />
                    <M {...BACKPLATE_COLOR} />
                </mesh>
                {/* Flow-through vent cutout */}
                <mesh position={[W * 0.15, 0, -D * 0.26]}>
                    <boxGeometry args={[W * 0.40, H * 0.55, D * 0.02]} />
                    <M color="#050507" />
                </mesh>
                {/* Backplate silver accent lines */}
                <mesh position={[-W * 0.3, 0, -D * 0.26]}>
                    <boxGeometry args={[W * 0.28, H * 0.92, D * 0.005]} />
                    <M color="#888" metalness={0.85} roughness={0.2} />
                </mesh>

                {/* ── GEFORCE RTX Logo bar (large, prominent) ── */}
                <mesh position={[-W * 0.12, -H * 0.28, D * 0.27]}>
                    <boxGeometry args={[W * 0.55, H * 0.09, 0.006]} />
                    <M color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} toneMapped={false} />
                </mesh>

                {/* ── RGB Accent bar (top edge, green LED) ── */}
                <mesh position={[0, H * 0.5, D * 0.08]}>
                    <boxGeometry args={[W * 0.92, 0.016, 0.016]} />
                    <M {...LED_GREEN} />
                </mesh>
                {/* Side LED strip */}
                <mesh position={[W * 0.49, 0, D * 0.08]}>
                    <boxGeometry args={[0.012, H * 0.85, 0.012]} />
                    <M {...LED_GREEN} />
                </mesh>

                {/* ── PCIe 16-pin power connector (top, RTX 5090 style) ── */}
                <mesh position={[W * 0.38, H * 0.44, -D * 0.08]}>
                    <boxGeometry args={[0.14, 0.06, 0.06]} />
                    <M color="#111" metalness={0.2} roughness={0.8} />
                </mesh>
                {/* Connector pins detail */}
                {[-0.04, 0, 0.04].map((xo, i) => (
                    <mesh key={i} position={[W * 0.38 + xo, H * 0.47, -D * 0.08]}>
                        <boxGeometry args={[0.025, 0.04, 0.04]} />
                        <M color="#222" metalness={0.3} roughness={0.7} />
                    </mesh>
                ))}

                {/* ── PCIe bracket (back edge) ── */}
                <mesh position={[-W * 0.49, 0, -D * 0.1]}>
                    <boxGeometry args={[0.018, H * 0.9, D * 0.55]} />
                    <M color="#888" metalness={0.85} roughness={0.2} />
                </mesh>
            </group>
        </AnimatedTransform>
    );
}

// ─── RAM (DDR5 — G.Skill Trident Z5 Royal style) ────────────────────────────
// 4 sticks, standing vertically, heatspreaders + RGB top bar

export function RamPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const stickW = target.size.x * 0.18;
    const stickH = target.size.y * 0.92;
    const stickD = 0.028;
    const gap = stickW * 1.35;
    const totalW = gap * 3;

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {[0, 1, 2, 3].map(i => {
                    const x = -totalW / 2 + i * gap;
                    return (
                        <group key={i} position={[x, 0, 0]}>
                            {/* Heatspreader body */}
                            <mesh>
                                <boxGeometry args={[stickW, stickH * 0.85, stickD]} />
                                <M color="#1a1a1f" metalness={0.82} roughness={0.18} />
                            </mesh>
                            {/* Crown / top fin */}
                            <mesh position={[0, stickH * 0.46, 0]}>
                                <boxGeometry args={[stickW, stickH * 0.14, stickD * 0.7]} />
                                <M color="#222228" metalness={0.88} roughness={0.14} />
                            </mesh>
                            {/* RGB diffuser bar (top) */}
                            <mesh position={[0, stickH * 0.47, stickD * 0.5]}>
                                <boxGeometry args={[stickW * 0.85, stickH * 0.06, 0.008]} />
                                <M {...LED_GREEN} />
                            </mesh>
                            {/* Brushed metal detail lines */}
                            {[-0.3, 0, 0.3].map((yOff, j) => (
                                <mesh key={j} position={[0, stickH * yOff * 0.5, stickD * 0.52]}>
                                    <boxGeometry args={[stickW * 0.7, 0.006, 0.003]} />
                                    <M {...MAT.rogSilver} />
                                </mesh>
                            ))}
                            {/* PCB gold contacts (bottom) */}
                            <mesh position={[0, -stickH * 0.46, 0]}>
                                <boxGeometry args={[stickW * 0.85, stickH * 0.08, stickD * 0.4]} />
                                <M {...MAT.gold} />
                            </mesh>
                        </group>
                    );
                })}
            </group>
        </AnimatedTransform>
    );
}

// ─── CPU (Intel Core Ultra 2 — with Matrix LED Screen on IHS) ───────────────
// LGA1851: 45mm × 45mm. IHS has a curved OLED-style matrix display.

function MatrixScreen({ S }) {
    const screenRef = useRef();
    const scanRef = useRef(0);
    // Animate a scrolling green scanline
    useFrame((_, delta) => {
        scanRef.current = (scanRef.current + delta * 0.8) % 1;
        if (screenRef.current) {
            screenRef.current.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.003) * 0.5;
        }
    });
    return (
        <group>
            {/* Screen base (dark) */}
            <mesh>
                <boxGeometry args={[S * 0.72, S * 0.72, 0.006]} />
                <M color="#000a02" metalness={0.0} roughness={1.0} />
            </mesh>
            {/* Matrix green glow layer */}
            <mesh ref={screenRef} position={[0, 0, 0.004]}>
                <boxGeometry args={[S * 0.68, S * 0.68, 0.002]} />
                <M color="#17ca07" emissive="#17ca07" emissiveIntensity={1.5} toneMapped={false} transparent opacity={0.85} />
            </mesh>
            {/* Scanline grid (horizontal lines) */}
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[0, (i / 7 - 0.5) * S * 0.62, 0.006]}>
                    <boxGeometry args={[S * 0.66, 0.006, 0.001]} />
                    <M color="#000" transparent opacity={0.5} />
                </mesh>
            ))}
            {/* Screen bezel */}
            <mesh position={[0, 0, 0.002]}>
                <boxGeometry args={[S * 0.74, S * 0.74, 0.003]} />
                <M color="#111" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Corner screws */}
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
                <mesh key={i} position={[sx * S * 0.32, sy * S * 0.32, 0.005]}>
                    <cylinderGeometry args={[0.012, 0.012, 0.006, 8]} />
                    <M {...MAT.rogSilver} />
                </mesh>
            ))}
        </group>
    );
}

export function CpuPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const S = Math.min(target.size.x, target.size.y) * 0.82;

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {/* PCB substrate */}
                <mesh>
                    <boxGeometry args={[S, S, 0.022]} />
                    <M {...MAT.pcbGreen} />
                </mesh>
                {/* IHS (Integrated Heat Spreader) — chrome base */}
                <mesh position={[0, 0, 0.018]}>
                    <boxGeometry args={[S * 0.90, S * 0.90, 0.018]} />
                    <M {...MAT.chrome} />
                </mesh>
                {/* IHS edge chamfer */}
                <mesh position={[0, 0, 0.028]}>
                    <boxGeometry args={[S * 0.86, S * 0.86, 0.006]} />
                    <M color="#e0e0e0" metalness={0.95} roughness={0.08} />
                </mesh>
                {/* ── MATRIX LED SCREEN on IHS ── */}
                <group position={[0, 0, 0.032]}>
                    <MatrixScreen S={S} />
                </group>
                {/* LGA pads (bottom) */}
                <mesh position={[0, 0, -0.012]}>
                    <boxGeometry args={[S * 0.82, S * 0.82, 0.004]} />
                    <M {...MAT.gold} />
                </mesh>
                {/* Alignment notch */}
                <mesh position={[-S * 0.44, -S * 0.44, 0.022]}>
                    <boxGeometry args={[0.022, 0.022, 0.01]} />
                    <M color="#ffcc00" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        </AnimatedTransform>
    );
}


// ─── CPU COOLER (Premium AIO Liquid Cooler with Square LCD Screen) ───────────
// Featuring a sleek block, high-res Matrix LCD, and liquid tubes

function MatrixLCD({ size }) {
    const screenRef = useRef();
    const rows = 16;
    const cols = 16;
    const charData = useMemo(() =>
        Array.from({ length: rows * cols }, () => ({
            brightness: Math.random(),
            speed: 0.2 + Math.random() * 0.8
        }))
        , []);

    useFrame((state) => {
        if (screenRef.current) {
            screenRef.current.material.emissiveIntensity = 2.0 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
        }
    });

    return (
        <group>
            {/* Screen base */}
            <mesh>
                <boxGeometry args={[size, size, 0.004]} />
                <M color="#000" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Matrix Characters Grid */}
            <group position={[0, 0, 0.003]}>
                {charData.map((d, i) => {
                    const r = Math.floor(i / cols);
                    const c = i % cols;
                    const x = (c / (cols - 1) - 0.5) * size * 0.85;
                    const y = (r / (rows - 1) - 0.5) * size * 0.85;
                    return (
                        <MatrixPixel key={i} x={x} y={y} size={size * 0.04} seed={i} />
                    );
                })}
            </group>
            {/* Glossy overlay */}
            <mesh position={[0, 0, 0.005]}>
                <boxGeometry args={[size * 0.98, size * 0.98, 0.001]} />
                <meshStandardMaterial color="#fff" transparent opacity={0.15} metalness={1} roughness={0} />
            </mesh>
        </group>
    );
}

function MatrixPixel({ x, y, size, seed }) {
    const ref = useRef();
    const speed = 0.5 + Math.random() * 2;
    useFrame((state) => {
        if (ref.current) {
            const val = Math.sin(state.clock.elapsedTime * speed + seed) * 0.5 + 0.5;
            ref.current.material.emissiveIntensity = val * 5;
            ref.current.material.opacity = 0.2 + val * 0.8;
        }
    });

    return (
        <mesh ref={ref} position={[x, y, 0]}>
            <planeGeometry args={[size, size]} />
            <meshStandardMaterial color="#22ff44" emissive="#22ff44" transparent toneMapped={false} />
        </mesh>
    );
}

export function CpuCoolerPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const CW = target.size.x * 1.1; // cooler width
    const CH = target.size.y * 1.1; // cooler height
    const CD = target.size.z * 0.6; // cooler thickness

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {/* ── Main AIO Block Body ── */}
                <mesh castShadow>
                    <boxGeometry args={[CW, CH, CD]} />
                    <M color="#15171a" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Brushed metal ring */}
                <mesh position={[0, 0, CD * 0.4]}>
                    <torusGeometry args={[CW * 0.42, 0.015, 16, 64]} />
                    <M color="#c8cdd4" metalness={1} roughness={0.1} />
                </mesh>

                {/* ── High-Res Square LCD ── */}
                <group position={[0, 0, CD * 0.51]}>
                    <MatrixLCD size={CW * 0.75} />
                </group>

                {/* ── AIO Tubes ── */}
                {[0.2, -0.2].map((y, i) => (
                    <group key={i} position={[CW * 0.5, y * CH, 0]} rotation={[0, Math.PI / 2, 0]}>
                        {/* Fitting */}
                        <mesh>
                            <cylinderGeometry args={[0.035, 0.045, 0.08, 16]} />
                            <M color="#222" metalness={0.7} roughness={0.3} />
                        </mesh>
                        {/* Tube segment start */}
                        <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.4]}>
                            <cylinderGeometry args={[0.028, 0.028, 0.4, 16]} />
                            <M color="#0a0a0d" metalness={0.2} roughness={0.8} />
                        </mesh>
                    </group>
                ))}

                {/* ── ROG / Brand Logo (bottom corner of block) ── */}
                <mesh position={[CW * 0.3, -CH * 0.38, CD * 0.51]}>
                    <planeGeometry args={[CW * 0.25, CH * 0.1]} />
                    <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} transparent opacity={0.8} />
                </mesh>
            </group>
        </AnimatedTransform>
    );
}

// ─── FAN (Lian Li Infinity — standalone installable) ─────────────────────────

export function FanPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const S = Math.min(target.size.x, target.size.y) * 0.92;

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <LianLiInfinityFan size={S} spinSpeed={9} ledColor="#17ca07" ledIntensity={4.0} />
        </AnimatedTransform>
    );
}

// ─── PSU (Lian Li SP850 style — SFX-L) ──────────────────────────────────────

export function PsuPart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform }) {
    const W = target.size.x * 0.92;
    const H = target.size.y * 0.88;
    const D = target.size.z * 0.88;

    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                {/* Main body */}
                <mesh castShadow>
                    <boxGeometry args={[W, H, D]} />
                    <M color="#111" metalness={0.6} roughness={0.4} />
                </mesh>
                {/* Fan grill face */}
                <mesh position={[0, 0, D / 2 + 0.005]}>
                    <circleGeometry args={[H * 0.38, 32]} />
                    <M color="#222" metalness={0.3} roughness={0.7} wireframe />
                </mesh>
                {/* Fan hub */}
                <mesh position={[0, 0, D / 2 + 0.01]}>
                    <cylinderGeometry args={[H * 0.08, H * 0.08, 0.02, 16]} />
                    <M {...MAT.aluminumDark} />
                </mesh>
                {/* Side label */}
                <mesh position={[W / 2 + 0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry args={[D * 0.75, H * 0.55]} />
                    <M {...LED_GREEN} emissiveIntensity={0.6} />
                </mesh>
                {/* Modular connectors (back) */}
                {[-0.12, 0, 0.12].map((y, i) => (
                    <mesh key={i} position={[-W / 2 - 0.005, y, 0]} rotation={[0, -Math.PI / 2, 0]}>
                        <boxGeometry args={[0.06, 0.04, 0.02]} />
                        <M color="#111" />
                    </mesh>
                ))}
            </group>
        </AnimatedTransform>
    );
}

// ─── STORAGE (NVMe M.2 / SATA SSD) ──────────────────────────────────────────

export function StoragePart({ target, staging, installed, floatSeed, partId, dragId, dragState, dragPlane, onDragStart, onDragMove, onDragEnd, onHoverSlot, animate, AnimatedTransform, isSSD }) {
    const W = target.size.x * 0.88;
    const H = target.size.y * 0.88;

    if (isSSD) {
        // M.2 NVMe: 80mm × 22mm card
        return (
            <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
                onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
                installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
                <group>
                    {/* PCB */}
                    <mesh>
                        <boxGeometry args={[W, H * 0.28, 0.016]} />
                        <M {...MAT.pcbBlack} />
                    </mesh>
                    {/* NAND chips */}
                    {[-W * 0.25, 0, W * 0.25].map((x, i) => (
                        <mesh key={i} position={[x, 0, 0.014]}>
                            <boxGeometry args={[W * 0.22, H * 0.2, 0.01]} />
                            <M color="#0a0a0a" metalness={0.2} roughness={0.8} />
                        </mesh>
                    ))}
                    {/* Controller chip */}
                    <mesh position={[-W * 0.38, 0, 0.014]}>
                        <boxGeometry args={[W * 0.14, H * 0.18, 0.01]} />
                        <M color="#111" metalness={0.3} roughness={0.7} />
                    </mesh>
                    {/* Gold M.2 connector */}
                    <mesh position={[W * 0.46, 0, 0]}>
                        <boxGeometry args={[W * 0.08, H * 0.24, 0.01]} />
                        <M {...MAT.gold} />
                    </mesh>
                    {/* Label */}
                    <mesh position={[0, 0, 0.022]}>
                        <planeGeometry args={[W * 0.7, H * 0.18]} />
                        <M {...LED_GREEN} emissiveIntensity={0.4} />
                    </mesh>
                </group>
            </AnimatedTransform>
        );
    }

    // 3.5" HDD
    return (
        <AnimatedTransform partId={partId} dragId={dragId} dragState={dragState} dragPlane={dragPlane}
            onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onHoverSlot={onHoverSlot}
            installed={installed} target={target} staging={staging} baseScale={1} floatSeed={floatSeed} animate={animate}>
            <group>
                <mesh castShadow>
                    <boxGeometry args={[W, H, target.size.z * 0.85]} />
                    <M color="#2a2a2a" metalness={0.65} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0, target.size.z * 0.43]}>
                    <planeGeometry args={[W * 0.8, H * 0.7]} />
                    <M color="#ddd" metalness={0.5} roughness={0.3} />
                </mesh>
            </group>
        </AnimatedTransform>
    );
}
