/**
 * LandingNode - Interactive platform at each consciousness level
 * Premium glowing design with connecting line to next level
 */
import React, { useMemo } from 'react';
import { spiralPose, SpiralConfig, DEFAULT_SPIRAL } from '../mathSpiral';
import { LevelNode, LEVELS } from '../levelGraph';
import { PortalHitbox } from './PortalHitbox';

interface LandingNodeProps {
    level: LevelNode;
    spiralCfg?: SpiralConfig;
    onSelect: (levelId: string) => void;
}

export function LandingNode({
    level,
    spiralCfg = DEFAULT_SPIRAL,
    onSelect,
}: LandingNodeProps) {
    // Current level pose
    const pose = useMemo(() => spiralPose(level.stepIndex, spiralCfg), [level.stepIndex, spiralCfg]);

    // Find next level for connecting line
    const levelIndex = LEVELS.findIndex(l => l.id === level.id);
    const nextLevel = levelIndex < LEVELS.length - 1 ? LEVELS[levelIndex + 1] : null;
    const nextPose = nextLevel ? spiralPose(nextLevel.stepIndex, spiralCfg) : null;

    // Extract position as array for JSX
    const posArray: [number, number, number] = [pose.position.x, pose.position.y, pose.position.z];
    const rotArray: [number, number, number] = [0, pose.yaw, 0];

    return (
        <group position={posArray} rotation={rotArray}>
            {/* Outer glow - largest */}
            <mesh scale={[1.4, 1.6, 1.4]} position={[0, -0.02, 0]}>
                <boxGeometry args={[0.9, 0.18, 0.45]} />
                <meshBasicMaterial color={level.color} transparent opacity={0.12} />
            </mesh>

            {/* Middle glow */}
            <mesh scale={[1.2, 1.3, 1.2]} position={[0, -0.01, 0]}>
                <boxGeometry args={[0.9, 0.18, 0.45]} />
                <meshBasicMaterial color={level.color} transparent opacity={0.2} />
            </mesh>

            {/* Main platform */}
            <mesh castShadow={false}>
                <boxGeometry args={[0.9, 0.18, 0.45]} />
                <meshStandardMaterial
                    color={level.color}
                    emissive={level.color}
                    emissiveIntensity={0.45}
                    roughness={0.2}
                    metalness={0.08}
                />
            </mesh>

            {/* White edge highlight */}
            <mesh position={[0, 0.095, 0]}>
                <boxGeometry args={[0.88, 0.012, 0.43]} />
                <meshBasicMaterial color="white" transparent opacity={0.75} />
            </mesh>

            {/* Invisible hitbox for taps */}
            <PortalHitbox onSelect={() => onSelect(level.id)} size={1.2} />
        </group>
    );
}

export default LandingNode;
