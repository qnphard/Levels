/**
 * Spiral Math - Single source of truth for helix positioning
 * All 3D objects derive their position from this function
 */
import * as THREE from 'three';

export type SpiralConfig = {
    radius: number;    // spiral radius
    pitch: number;     // vertical rise per radian
    stepAngle: number; // radians per step (~20° = 0.35)
};

// TUNED for better visual appearance
export const DEFAULT_SPIRAL: SpiralConfig = {
    radius: 2.0,       // Wider spiral (was 1.25)
    pitch: 0.12,       // More vertical spacing (was 0.09)
    stepAngle: 0.25,   // Smaller angle = more steps per revolution, smoother curve
};

export type SpiralPose = {
    position: THREE.Vector3;
    yaw: number;
    theta: number;
};

/**
 * Calculate position and orientation for a step on the spiral
 * Used by: SpiralStairs, LandingNode, StickmanController, CameraRig
 */
export function spiralPose(step: number, cfg: SpiralConfig = DEFAULT_SPIRAL): SpiralPose {
    const theta = step * cfg.stepAngle;

    const x = cfg.radius * Math.cos(theta);
    const z = cfg.radius * Math.sin(theta);
    const y = cfg.pitch * theta;

    // Tangent direction for facing (perpendicular to radius)
    const tx = -Math.sin(theta);
    const tz = Math.cos(theta);
    const yaw = Math.atan2(tx, tz);

    return {
        position: new THREE.Vector3(x, y, z),
        yaw,
        theta,
    };
}

/**
 * Lerp between two angles, handling wraparound
 */
export function lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;

    // Normalize to [-PI, PI]
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    return a + diff * t;
}

/**
 * Lerp between two Vector3s
 */
export function lerp3(
    a: THREE.Vector3,
    b: THREE.Vector3,
    t: number
): THREE.Vector3 {
    return new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
    );
}
