/**
 * SpiralPath - Continuous ribbon connecting the landings
 * Visualizes the path as a subtle rail
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SpiralConfig, DEFAULT_SPIRAL, spiralPose } from '../mathSpiral';
import { TOTAL_STEPS } from '../levelGraph';

interface SpiralPathProps {
    totalSteps: number;
    spiralCfg?: SpiralConfig;
}

export function SpiralPath({
    totalSteps,
    spiralCfg = DEFAULT_SPIRAL
}: SpiralPathProps) {

    const curve = useMemo(() => {
        const points: THREE.Vector3[] = [];
        // Sample points along the spiral
        const segments = totalSteps * 2;

        for (let i = 0; i <= segments; i++) {
            const stepT = (i / segments) * totalSteps;
            const { position } = spiralPose(stepT, spiralCfg);
            points.push(position);
        }
        return new THREE.CatmullRomCurve3(points);
    }, [totalSteps, spiralCfg]);

    // Geometry for the path 
    const geometry = useMemo(() => {
        // Much thinner tube (0.05 radius) for a neon rail look
        return new THREE.TubeGeometry(curve, totalSteps * 2, 0.05, 8, false);
    }, [curve, totalSteps]);

    return (
        <mesh position={[0, 0, 0]}>
            <primitive object={geometry} />
            <meshStandardMaterial
                color="#A78BFA"
                emissive="#7C4DFF"
                emissiveIntensity={0.3}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
    );
}

export default SpiralPath;
