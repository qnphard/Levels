/**
 * PortalHitbox - Invisible tap target for mobile
 */
import React from 'react';

interface PortalHitboxProps {
    onSelect: () => void;
    size?: number;
}

export function PortalHitbox({ onSelect, size = 0.8 }: PortalHitboxProps) {
    return (
        <mesh
            position={[0, 0.25, 0]}
            onPointerDown={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            <boxGeometry args={[size, size, size]} />
            <meshBasicMaterial transparent opacity={0.001} />
        </mesh>
    );
}

export default PortalHitbox;
