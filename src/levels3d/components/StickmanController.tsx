/**
 * StickmanController - Animated character that walks the spiral
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import { spiralPose, lerpAngle, SpiralConfig, DEFAULT_SPIRAL } from '../mathSpiral';

interface StickmanControllerProps {
    currentStepRef: React.MutableRefObject<number>;
    isMovingRef: React.MutableRefObject<boolean>;
    spiralCfg?: SpiralConfig;
}

export function StickmanController({
    currentStepRef,
    isMovingRef,
    spiralCfg = DEFAULT_SPIRAL,
}: StickmanControllerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const walkPhaseRef = useRef(0);

    const bodyColor = '#121214';

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const step = currentStepRef.current;
        const base = Math.floor(step);
        const t = step - base;

        // Get poses
        const poseA = spiralPose(base, spiralCfg);
        const poseB = spiralPose(base + 1, spiralCfg);

        // Lerp position manually (don't create new Vector3)
        const x = poseA.position.x + (poseB.position.x - poseA.position.x) * t;
        const y = poseA.position.y + (poseB.position.y - poseA.position.y) * t;
        const z = poseA.position.z + (poseB.position.z - poseA.position.z) * t;
        const yaw = lerpAngle(poseA.yaw, poseB.yaw, t);

        // Position above the step
        groupRef.current.position.x = x;
        groupRef.current.position.y = y + 0.35;
        groupRef.current.position.z = z;

        // Walking animation only when moving
        if (isMovingRef.current) {
            walkPhaseRef.current += delta * 10;

            // Bob up and down
            groupRef.current.position.y += Math.sin(walkPhaseRef.current * 2) * 0.015;

            // Rotation with sway
            groupRef.current.rotation.x = -0.12;
            groupRef.current.rotation.y = yaw;
            groupRef.current.rotation.z = Math.sin(walkPhaseRef.current) * 0.05;
        } else {
            groupRef.current.rotation.set(-0.08, yaw, 0);
        }

        // Animate limbs
        if (groupRef.current.children.length >= 6) {
            const leftLeg = groupRef.current.children[2] as THREE.Mesh;
            const rightLeg = groupRef.current.children[3] as THREE.Mesh;
            const leftArm = groupRef.current.children[4] as THREE.Mesh;
            const rightArm = groupRef.current.children[5] as THREE.Mesh;

            const swing = isMovingRef.current ? Math.sin(walkPhaseRef.current) * 0.5 : 0;

            if (leftLeg) leftLeg.rotation.x = swing;
            if (rightLeg) rightLeg.rotation.x = -swing;
            if (leftArm) leftArm.rotation.x = -swing * 0.7;
            if (rightArm) rightArm.rotation.x = swing * 0.7;
        }
    });

    return (
        <group ref={groupRef} scale={1.2}>
            {/* Head */}
            <mesh position={[0, 0.32, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>

            {/* Torso */}
            <mesh position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.028, 0.032, 0.24, 10]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>

            {/* Left leg */}
            <mesh position={[-0.05, -0.02, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.05, -0.02, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>

            {/* Left arm */}
            <mesh position={[-0.08, 0.18, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.016, 0.016, 0.14, 8]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.08, 0.18, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.016, 0.016, 0.14, 8]} />
                <meshStandardMaterial color={bodyColor} roughness={0.6} />
            </mesh>
        </group>
    );
}

export default StickmanController;
