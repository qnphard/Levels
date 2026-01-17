/**
 * Atmosphere - Tower environment (walls, fog, lighting)
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getZoneForStep, AtmosphereZone } from '../levelGraph';

interface AtmosphereProps {
    currentStep: number;
}

// Zone-based atmosphere configs
const ZONE_CONFIG: Record<AtmosphereZone, {
    fogColor: string;
    fogNear: number;
    fogFar: number;
    ambientIntensity: number;
    wallColor: string;
    wallOpacity: number;
}> = {
    heavyWeather: {
        fogColor: '#0b0b12',
        fogNear: 2,
        fogFar: 12,
        ambientIntensity: 0.6,
        wallColor: '#0a0a12',
        wallOpacity: 0.95,
    },
    power: {
        fogColor: '#1a1520',
        fogNear: 4,
        fogFar: 18,
        ambientIntensity: 0.75,
        wallColor: '#151218',
        wallOpacity: 0.7,
    },
    transcendence: {
        fogColor: '#f0f0f5',
        fogNear: 5,
        fogFar: 25,
        ambientIntensity: 1.0,
        wallColor: '#e8e8f0',
        wallOpacity: 0.4,
    },
};

export function Atmosphere({ currentStep }: AtmosphereProps) {
    const zone = useMemo(() => getZoneForStep(currentStep), [currentStep]);
    const config = ZONE_CONFIG[zone];

    // Memoize geometries
    const cylinderArgs = useMemo(
        () => [4, 4, 60, 32, 1, true] as [number, number, number, number, number, boolean],
        []
    );

    // Calculate point light Y position based on current step
    const pointLightY = useMemo(() => currentStep * 0.09 * 0.35 + 2, [currentStep]);

    return (
        <>
            {/* Fog */}
            <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />

            {/* Tower wall cylinder */}
            <mesh position={[0, 15, 0]}>
                <cylinderGeometry args={cylinderArgs} />
                <meshBasicMaterial
                    color={config.wallColor}
                    side={THREE.BackSide}
                    transparent
                    opacity={config.wallOpacity}
                />
            </mesh>

            {/* Lighting */}
            <ambientLight intensity={config.ambientIntensity} />
            <hemisphereLight
                intensity={0.5}
                color="#ffffff"
                groundColor="#f2f4ff"
            />
            <directionalLight
                position={[5, 10, 5]}
                intensity={0.9}
                castShadow={false}
            />
            <pointLight
                position={[-2, pointLightY, 2]}
                intensity={0.4}
                color="#ffffff"
            />
        </>
    );
}

export default Atmosphere;
