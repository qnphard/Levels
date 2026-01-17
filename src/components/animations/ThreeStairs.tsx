import React, { useMemo, useRef, Suspense } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

// Step colors (bottom to top)
const STEP_COLORS = ['#4DD0E1', '#5C6BC0', '#AB47BC', '#EC407A', '#FF7043'];

const STEP_COUNT = STEP_COLORS.length;

// --- Tuning knobs to match the reference ---
const STEP = { w: 0.92, h: 0.18, d: 0.48, r: 0.12 };
const STEP_OFFSET = { x: 0.55, y: 0.34, z: -0.26 };
const START_POS = { x: -1.18, y: -0.78, z: 0.62 };

const WALK_SPEED_STEPS_PER_SEC = 0.55; // how fast the cutscene climbs
const CHARACTER_SCALE = 1.35;          // make him bigger like the reference
const GLOBAL_GLOW = 1.0;               // overall glow strength
// -------------------------------------------

function getStepPosition(index: number): [number, number, number] {
    return [
        START_POS.x + index * STEP_OFFSET.x,
        START_POS.y + index * STEP_OFFSET.y,
        START_POS.z + index * STEP_OFFSET.z,
    ];
}

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// A tiny radial texture for glow sprites (no extra libs)
function useRadialGlowTexture(size = 128) {
    return useMemo(() => {
        const data = new Uint8Array(size * size * 4);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = (x / (size - 1)) * 2 - 1;
                const dy = (y / (size - 1)) * 2 - 1;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const a = Math.max(0, 1 - dist);
                const alpha = Math.floor(Math.pow(a, 2.4) * 255);

                const i = (y * size + x) * 4;
                data[i + 0] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = alpha;
            }
        }

        const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        tex.needsUpdate = true;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
    }, [size]);
}

// Rounded box geometry via extruded rounded-rect
function useRoundedBoxGeometry(width: number, height: number, depth: number, radius: number) {
    return useMemo(() => {
        const shape = new THREE.Shape();
        const w = width / 2;
        const d = depth / 2;
        const r = Math.min(radius, w, d);

        shape.moveTo(-w + r, -d);
        shape.lineTo(w - r, -d);
        shape.quadraticCurveTo(w, -d, w, -d + r);
        shape.lineTo(w, d - r);
        shape.quadraticCurveTo(w, d, w - r, d);
        shape.lineTo(-w + r, d);
        shape.quadraticCurveTo(-w, d, -w, d - r);
        shape.lineTo(-w, -d + r);
        shape.quadraticCurveTo(-w, -d, -w + r, -d);

        const extrudeSettings = {
            steps: 1,
            depth: height,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.03,
            bevelSegments: 4,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.rotateX(-Math.PI / 2);
        geometry.translate(0, height / 2, 0);
        return geometry;
    }, [width, height, depth, radius]);
}

// Top face (flat) used for clean outline
function useRoundedTopFace(width: number, depth: number, radius: number) {
    return useMemo(() => {
        const shape = new THREE.Shape();
        const w = width / 2;
        const d = depth / 2;
        const r = Math.min(radius, w, d);

        shape.moveTo(-w + r, -d);
        shape.lineTo(w - r, -d);
        shape.quadraticCurveTo(w, -d, w, -d + r);
        shape.lineTo(w, d - r);
        shape.quadraticCurveTo(w, d, w - r, d);
        shape.lineTo(-w + r, d);
        shape.quadraticCurveTo(-w, d, -w, d - r);
        shape.lineTo(-w, -d + r);
        shape.quadraticCurveTo(-w, -d, -w + r, -d);

        const geo = new THREE.ShapeGeometry(shape);
        geo.rotateX(-Math.PI / 2);
        return geo;
    }, [width, depth, radius]);
}

function Step({ position, color }: { position: [number, number, number]; color: string }) {
    const roundedGeometry = useRoundedBoxGeometry(STEP.w, STEP.h, STEP.d, STEP.r);
    const topFace = useRoundedTopFace(STEP.w * 0.985, STEP.d * 0.985, STEP.r * 0.9);
    const topEdges = useMemo(() => new THREE.EdgesGeometry(topFace, 25), [topFace]);

    const glowTex = useRadialGlowTexture(128);

    return (
        <group position={position}>
            {/* “shadow block” under each step (like your reference) */}
            <mesh position={[0.08, -0.09, 0.14]} scale={[1.02, 1.0, 1.02]}>
                <boxGeometry args={[STEP.w, STEP.h * 0.9, STEP.d]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
            </mesh>

            {/* Big additive bloom sprite (does most of the “premium glow” work) */}
            <sprite position={[0, STEP.h * 0.55, 0]}>
                <spriteMaterial
                    map={glowTex}
                    color={color}
                    transparent
                    opacity={0.40 * GLOBAL_GLOW}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </sprite>

            {/* Smaller tighter glow */}
            <sprite position={[0, STEP.h * 0.58, 0]}>
                <spriteMaterial
                    map={glowTex}
                    color={color}
                    transparent
                    opacity={0.28 * GLOBAL_GLOW}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </sprite>

            {/* Main step body */}
            <mesh geometry={roundedGeometry} castShadow receiveShadow>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.55 * GLOBAL_GLOW}
                    roughness={0.18}
                    metalness={0.06}
                />
            </mesh>

            {/* Soft top highlight (gives that “lit top plane” look) */}
            <mesh geometry={topFace} position={[0, STEP.h + 0.002, 0]}>
                <meshBasicMaterial color="white" transparent opacity={0.12} />
            </mesh>

            {/* Clean white outline around the top */}
            <lineSegments geometry={topEdges} position={[0, STEP.h + 0.004, 0]}>
                <lineBasicMaterial color="white" transparent opacity={0.85} />
            </lineSegments>
        </group>
    );
}

// Foot contact flashes (spark/glow under feet like the reference)
function FootFlashes({ flashesRef }: { flashesRef: React.MutableRefObject<number[]> }) {
    const glowTex = useRadialGlowTexture(128);
    const sprites = useRef<(THREE.Sprite | null)[]>([]);

    useFrame((_, delta) => {
        for (let i = 0; i < STEP_COUNT; i++) {
            // Handle potentially uninitialized sprite references
            if (!sprites.current[i]) continue;
            const s = sprites.current[i];
            if (!s) continue; // Double check for TS

            const v = flashesRef.current[i] || 0;

            const mat = s.material as THREE.SpriteMaterial;
            mat.opacity = Math.min(1, v) * 0.85 * GLOBAL_GLOW;

            const scale = 0.28 + v * 0.22;
            s.scale.set(scale, scale, scale);
            // decay
            flashesRef.current[i] = Math.max(0, v - delta * 2.8);
        }
    });

    return (
        <>
            {STEP_COLORS.map((c, i) => {
                const p = getStepPosition(i);
                return (
                    <sprite
                        key={i}
                        ref={(el) => (sprites.current[i] = el)}
                        position={[p[0] - 0.02, p[1] + STEP.h + 0.01, p[2] + 0.01]}
                    >
                        <spriteMaterial
                            map={glowTex}
                            color={c}
                            transparent
                            opacity={0}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </sprite>
                );
            })}
        </>
    );
}

// A simple 2-segment limb (thigh+shin or upperarm+forearm)
function TwoBoneLimb({
    upperLen,
    lowerLen,
    upperRad,
    lowerRad,
    color,
    phase,
    isArm,
}: {
    upperLen: number;
    lowerLen: number;
    upperRad: number;
    lowerRad: number;
    color: string;
    phase: number;
    isArm: boolean;
}) {
    // Swing: arms smaller, legs bigger
    const upperSwing = (isArm ? 0.65 : 0.85) * Math.sin(phase);
    const kneeBend = isArm ? 0.35 * Math.max(0, -Math.sin(phase)) : 0.95 * Math.max(0, -Math.sin(phase));

    return (
        <group rotation={[upperSwing - (isArm ? 0.1 : 0.25), 0, 0]}>
            <mesh position={[0, -upperLen / 2, 0]} castShadow>
                <cylinderGeometry args={[upperRad, upperRad, upperLen, 10]} />
                <meshStandardMaterial color={color} roughness={0.65} metalness={0.0} />
            </mesh>

            <group position={[0, -upperLen, 0]} rotation={[kneeBend, 0, 0]}>
                <mesh position={[0, -lowerLen / 2, 0]} castShadow>
                    <cylinderGeometry args={[lowerRad, lowerRad, lowerLen, 10]} />
                    <meshStandardMaterial color={color} roughness={0.65} metalness={0.0} />
                </mesh>
            </group>
        </group>
    );
}

function Stickman({
    progressRef,
}: {
    progressRef: React.MutableRefObject<number>;
}) {
    const groupRef = useRef<THREE.Group>(null);

    const bodyColor = '#121214';

    useFrame((state) => {
        if (!groupRef.current) return;

        const p = progressRef.current;
        const i = Math.floor(p);
        const u = p - i;

        const a = getStepPosition(i);
        const b = getStepPosition(Math.min(i + 1, STEP_COUNT - 1));
        const pos = lerp3(a, b, u);

        // Face direction of travel
        const dirX = b[0] - a[0];
        const dirZ = b[2] - a[2];
        const yaw = Math.atan2(dirX, dirZ);

        const t = state.clock.elapsedTime;

        groupRef.current.position.set(
            pos[0],
            pos[1] + STEP.h + 0.23 + Math.sin(t * 8) * 0.01,
            pos[2]
        );

        groupRef.current.rotation.set(-0.18, yaw, 0); // forward lean + face path
    });

    return (
        <group ref={groupRef} scale={CHARACTER_SCALE}>
            {/* Head */}
            <mesh position={[0, 0.33, 0]} castShadow>
                <sphereGeometry args={[0.075, 18, 18]} />
                <meshStandardMaterial color={bodyColor} roughness={0.55} metalness={0.0} />
            </mesh>

            {/* Torso */}
            <mesh position={[0, 0.14, 0]} castShadow>
                <cylinderGeometry args={[0.026, 0.030, 0.26, 12]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.0} />
            </mesh>

            {/* Hips anchor */}
            <group position={[0, 0.02, 0]}>
                {/* Legs */}
                <group position={[-0.05, 0.0, 0]}>
                    <TwoBoneLimb
                        upperLen={0.16}
                        lowerLen={0.15}
                        upperRad={0.020}
                        lowerRad={0.018}
                        color={bodyColor}
                        phase={0} // placeholder, driven below
                        isArm={false}
                    />
                </group>

                <group position={[0.05, 0.0, 0]}>
                    <TwoBoneLimb
                        upperLen={0.16}
                        lowerLen={0.15}
                        upperRad={0.020}
                        lowerRad={0.018}
                        color={bodyColor}
                        phase={Math.PI}
                        isArm={false}
                    />
                </group>
            </group>

            {/* Shoulders anchor */}
            <group position={[0, 0.22, 0]}>
                {/* Arms */}
                <group position={[-0.085, 0.0, 0]}>
                    <TwoBoneLimb
                        upperLen={0.12}
                        lowerLen={0.11}
                        upperRad={0.014}
                        lowerRad={0.013}
                        color={bodyColor}
                        phase={Math.PI} // opposite of leg
                        isArm
                    />
                </group>

                <group position={[0.085, 0.0, 0]}>
                    <TwoBoneLimb
                        upperLen={0.12}
                        lowerLen={0.11}
                        upperRad={0.014}
                        lowerRad={0.013}
                        color={bodyColor}
                        phase={0}
                        isArm
                    />
                </group>
            </group>

            {/* Drive limb phases without re-rendering */}
            <LimbDriver />
        </group>
    );

    function LimbDriver() {
        const limbRefs = useRef<THREE.Group[]>([]);
        // we’ll grab the limb groups in traversal order once
        useFrame((state) => {
            if (!groupRef.current) return;

            // 1 cycle per step feels “walk-y”
            const p = progressRef.current;
            const walk = p * Math.PI * 2;

            // Instead of traversal, directly poke the limb anchor groups by index:
            // child indices: [head, torso, hipsGroup, shouldersGroup, LimbDriver]
            const hipsGroup = groupRef.current.children[2] as THREE.Group;
            const shouldersGroup = groupRef.current.children[3] as THREE.Group;

            const leftLeg = (hipsGroup.children[0] as THREE.Group);
            const rightLeg = (hipsGroup.children[1] as THREE.Group);
            const leftArm = (shouldersGroup.children[0] as THREE.Group);
            const rightArm = (shouldersGroup.children[1] as THREE.Group);

            // Swing anchors (the TwoBoneLimb already has internal motion; this adds overall feel)
            leftLeg.rotation.x = 0.15 * Math.sin(walk);
            rightLeg.rotation.x = 0.15 * Math.sin(walk + Math.PI);

            leftArm.rotation.x = 0.10 * Math.sin(walk + Math.PI);
            rightArm.rotation.x = 0.10 * Math.sin(walk);

            // slight side-to-side hip sway
            groupRef.current.rotation.z = Math.sin(walk) * 0.06;
        });

        return null;
    }
}

// Main scene
function Scene({ showStickman }: { showStickman: boolean }) {
    const progressRef = useRef(0);
    const flashesRef = useRef<number[]>(new Array(STEP_COUNT).fill(0));
    const lastStepRef = useRef(0);

    useFrame((_, delta) => {
        // progress from step 0 to step 4, loop
        const maxP = STEP_COUNT - 1;
        progressRef.current += delta * WALK_SPEED_STEPS_PER_SEC;
        if (progressRef.current > maxP) {
            progressRef.current = 0;
            lastStepRef.current = 0;
            flashesRef.current.fill(0);
        }

        const stepNow = Math.floor(progressRef.current + 1e-6);
        if (stepNow !== lastStepRef.current) {
            flashesRef.current[stepNow] = 1.2; // spark on landing
            // also spark the previous step a bit for trail
            if (stepNow - 1 >= 0) flashesRef.current[stepNow - 1] = Math.max(flashesRef.current[stepNow - 1], 0.35);
            lastStepRef.current = stepNow;
        }
    });

    return (
        <>
            {/* Background + a little atmospheric softness */}
            <color attach="background" args={['#ffffff']} />
            <fog attach="fog" args={['#ffffff', 6, 18]} />

            {/* Lighting tuned for “clean + glowy” */}
            <ambientLight intensity={0.8} />
            <hemisphereLight intensity={0.55} color="#ffffff" groundColor="#f2f4ff" />
            <directionalLight
                position={[6, 9, 6]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <pointLight position={[-3, 3, 3]} intensity={0.45} color="#ffffff" />

            {/* Steps */}
            {STEP_COLORS.map((color, i) => (
                <Step key={i} position={getStepPosition(i)} color={color} />
            ))}

            {/* Foot sparks */}
            <FootFlashes flashesRef={flashesRef} />

            {/* Stickman */}
            {showStickman && <Stickman progressRef={progressRef} />}
        </>
    );
}

function LoadingFallback() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#7C4DFF" />
            <Text style={styles.loadingText}>Loading 3D...</Text>
        </View>
    );
}

interface ThreeStairsProps {
    showStickman?: boolean;
}

export const ThreeStairs: React.FC<ThreeStairsProps> = ({ showStickman = true }) => {
    return (
        <View style={styles.container}>
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    style={styles.canvas}
                    shadows
                    orthographic
                    camera={{
                        zoom: 170,
                        position: [5.6, 5.2, 5.6],
                        near: -100,
                        far: 100,
                    }}
                    gl={{ antialias: true }}
                    onCreated={({ gl, camera }) => {
                        gl.setPixelRatio?.(2);
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = 1.15;
                        camera.lookAt(0, 0.4, 0);
                    }}
                >
                    <Scene showStickman={showStickman} />
                </Canvas>
            </Suspense>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    canvas: { flex: 1 },
    loading: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',
    },
    loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
});

export default ThreeStairs;
