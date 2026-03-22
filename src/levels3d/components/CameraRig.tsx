/**
 * CameraRig - Smooth follow camera for orthographic view
 */
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { spiralPose, SpiralConfig, DEFAULT_SPIRAL } from '../mathSpiral';

interface CameraRigProps {
    currentStepRef: React.MutableRefObject<number>;
    spiralCfg?: SpiralConfig;
    lerpSpeed?: number;
}

export function CameraRig({
    currentStepRef,
    spiralCfg = DEFAULT_SPIRAL,
    lerpSpeed = 0.05,
}: CameraRigProps) {
    const { camera } = useThree();
    const targetX = useRef(0);
    const targetY = useRef(0);
    const targetZ = useRef(0);

    useFrame(() => {
        const step = currentStepRef.current;
        const { position } = spiralPose(step, spiralCfg);

        // Update target position
        targetX.current = position.x;
        targetY.current = position.y;
        targetZ.current = position.z;

        // Camera offset - further back for wider view
        const desiredX = targetX.current + 4.5;
        const desiredY = targetY.current + 3.5;
        const desiredZ = targetZ.current + 4.5;

        // Smooth follow
        camera.position.x += (desiredX - camera.position.x) * lerpSpeed;
        camera.position.y += (desiredY - camera.position.y) * lerpSpeed;
        camera.position.z += (desiredZ - camera.position.z) * lerpSpeed;

        // Look at target (slightly upward angle)
        camera.lookAt(
            targetX.current,
            targetY.current + 1.0,
            targetZ.current
        );
    });

    return null;
}

export default CameraRig;
