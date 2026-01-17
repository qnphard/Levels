/**
 * SpiralStairs - Efficient InstancedMesh rendering of spiral steps
 */
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { spiralPose, SpiralConfig, DEFAULT_SPIRAL } from '../mathSpiral';

// Step colors palette (repeating)
const STEP_PALETTE = [
    '#4DD0E1', '#5C6BC0', '#7E57C2', '#AB47BC',
    '#EC407A', '#EF5350', '#FF7043', '#FFA726',
];

interface SpiralStairsProps {
    totalSteps: number;
    spiralCfg?: SpiralConfig;
}

export function SpiralStairs({
    totalSteps,
    spiralCfg = DEFAULT_SPIRAL
}: SpiralStairsProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Memoize reusable objects
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);

    // Memoize geometry and material
    const geometry = useMemo(
        () => new THREE.BoxGeometry(0.9, 0.18, 0.45),
        []
    );

    const material = useMemo(
        () => new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.3,
            metalness: 0.1,
        }),
        []
    );

    useEffect(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < totalSteps; i++) {
            const { position, yaw } = spiralPose(i, spiralCfg);

            // Position and rotate each step
            tempObject.position.set(position.x, position.y, position.z);
            tempObject.rotation.set(-0.08, yaw, 0); // Slight forward tilt
            tempObject.updateMatrix();

            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // Color from repeating palette
            const color = STEP_PALETTE[i % STEP_PALETTE.length];
            tempColor.set(color);
            meshRef.current.setColorAt(i, tempColor);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [totalSteps, spiralCfg, tempObject, tempColor]);

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, totalSteps]}
            castShadow={false}
            receiveShadow={false}
        />
    );
}

export default SpiralStairs;
