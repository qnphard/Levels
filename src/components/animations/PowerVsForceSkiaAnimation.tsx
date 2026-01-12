import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
    Canvas,
    Circle,
    Rect,
    LinearGradient,
    RadialGradient,
    vec,
    Blur,
    Paint,
    Group,
    RoundedRect,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    useFrameCallback,
    useDerivedValue,
    SharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const HEIGHT = 300;
const FORCE_PARTICLE_COUNT = 30;
const POWER_PARTICLE_COUNT = 40;

const COLORS = {
    forceCore: '#ff2d55',
    powerCore: '#007aff',
    bg: '#050714',
    wall: '#475569',
};

// --- Deterministic Math Utils (Worklet safe) ---
// Pseudo-random function based on index and seed
const noise = (idx: number, seed: number) => {
    'worklet';
    return Math.sin(idx * 12.9898 + seed * 78.233) * 43758.5453 - Math.floor(Math.sin(idx * 12.9898 + seed * 78.233) * 43758.5453);
};

export default function PowerVsForceSkiaAnimation() {
    const tick = useSharedValue(0);

    useFrameCallback((frameInfo) => {
        'worklet';
        tick.value = frameInfo.timeSinceFirstFrame / 1000; // Time in seconds
    });

    const forceParticles = useMemo(() => Array.from({ length: FORCE_PARTICLE_COUNT }, (_, i) => i), []);
    const powerParticles = useMemo(() => Array.from({ length: POWER_PARTICLE_COUNT }, (_, i) => i), []);

    return (
        <View style={styles.container}>
            <Canvas style={{ width: ANIMATION_WIDTH, height: HEIGHT }}>
                {/* Background */}
                <Rect x={0} y={0} width={ANIMATION_WIDTH} height={HEIGHT} color={COLORS.bg} />

                {/* Gradient Overlay */}
                <Rect x={0} y={0} width={ANIMATION_WIDTH} height={HEIGHT}>
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(ANIMATION_WIDTH, HEIGHT)}
                        colors={['#0f172a', '#050714']}
                    />
                </Rect>

                {/* --- FORCE SIDE (Chaos) --- */}
                <Group>
                    {/* Force Wall */}
                    <RoundedRect x={ANIMATION_WIDTH / 2 - 24} y={40} width={8} height={HEIGHT - 80} r={4} color={COLORS.wall} opacity={0.5} />

                    {/* Force Particles: Chaotic Bouncing */}
                    {forceParticles.map((i) => (
                        <ForceParticle
                            key={`f-${i}`}
                            index={i}
                            time={tick}
                            colorBase={COLORS.forceCore}
                        />
                    ))}
                </Group>

                {/* Separator / Vignette */}
                <Rect x={ANIMATION_WIDTH / 2 - 20} y={0} width={40} height={HEIGHT}>
                    <LinearGradient
                        start={vec(ANIMATION_WIDTH / 2 - 20, 0)}
                        end={vec(ANIMATION_WIDTH / 2 + 20, 0)}
                        colors={['transparent', 'rgba(0,0,0,0.8)', 'transparent']}
                    />
                </Rect>

                {/* --- POWER SIDE (Flow) --- */}
                <Group>
                    {/* Power Obstacle */}
                    <Circle cx={ANIMATION_WIDTH * 0.75} cy={HEIGHT / 2} r={25} color="#1e293b">
                        <Paint style="stroke" strokeWidth={2} color={COLORS.powerCore} opacity={0.3} />
                    </Circle>
                    <Circle cx={ANIMATION_WIDTH * 0.75} cy={HEIGHT / 2} r={15} color={COLORS.powerCore} opacity={0.2}>
                        <Blur blur={5} />
                    </Circle>

                    {/* Power Particles: Laminar Flow */}
                    {powerParticles.map((i) => (
                        <PowerParticle
                            key={`p-${i}`}
                            index={i}
                            time={tick}
                            colorBase={COLORS.powerCore}
                        />
                    ))}
                </Group>
            </Canvas>
        </View>
    );
}

const ForceParticle = ({ index, time, colorBase }: { index: number, time: SharedValue<number>, colorBase: string }) => {
    // Deterministic Chaos:
    // Position depends on time loops with random offsets
    const pos = useDerivedValue(() => {
        const t = time.value;
        const speed = 2 + (index % 5) * 0.5;
        const drift = t * speed;

        // Bouncing inside a box [0, ANIMATION_WIDTH/2 - 30] x [0, HEIGHT]
        // We use triangle wave for bouncing: abs((t % 2T) - T)

        const w = ANIMATION_WIDTH / 2 - 30;
        const h = HEIGHT;

        // Random start offsets
        const xOffset = (index * 73) % w;
        const yOffset = (index * 41) % h;

        const rawX = (drift * 50 + xOffset) % (2 * w);
        const x = rawX < w ? rawX : 2 * w - rawX;

        const rawY = (drift * 30 + yOffset) % (2 * h);
        const y = rawY < h ? rawY : 2 * h - rawY;

        // Jitter
        const jitterX = Math.sin(t * 10 + index) * 5;
        const jitterY = Math.cos(t * 10 + index) * 5;

        return {
            x: x + jitterX + 10,
            y: y + jitterY,
            r: 2 + (index % 3),
            opacity: 0.6 + Math.sin(t * 2 + index) * 0.3,
        };
    });

    return (
        <Circle
            cx={useDerivedValue(() => pos.value.x)}
            cy={useDerivedValue(() => pos.value.y)}
            r={useDerivedValue(() => pos.value.r)}
            color={colorBase}
            opacity={useDerivedValue(() => pos.value.opacity)}
        >
            <Blur blur={1} />
        </Circle>
    );
};

const PowerParticle = ({ index, time, colorBase }: { index: number, time: SharedValue<number>, colorBase: string }) => {
    // Deterministic Flow:
    // Moves left to right, deflects around point
    const pos = useDerivedValue(() => {
        const t = time.value;
        const speed = 60 + (index % 5) * 10;
        // Start X sweeps from left to right

        const totalW = ANIMATION_WIDTH / 2 + 50; // Width of power section approx
        const cycle = 3; // seconds to cross

        // Staggered start time
        const offsetT = t + (index / POWER_PARTICLE_COUNT) * cycle;
        const progress = (offsetT % cycle) / cycle;

        const startX = ANIMATION_WIDTH / 2 + 10;
        const startY = HEIGHT / 2 + (index % 10 - 4.5) * 15; // Streamlines

        let currX = startX + progress * 200; // Linear move
        let currY = startY;

        // Obstacle Avoidance (Math)
        const obsX = ANIMATION_WIDTH * 0.75;
        const obsY = HEIGHT / 2;
        const obsR = 35; // Interaction radius

        const dx = currX - obsX;
        const dy = currY - obsY;
        // Simple potential flow approximation or just manual deflection
        // If getting close to X center, push Y away

        // Gaussian deflection?
        const distX = Math.abs(dx);
        if (distX < obsR) {
            const push = Math.cos((distX / obsR) * (Math.PI / 2)); // 1 at center, 0 at edge
            const dir = dy > 0 ? 1 : -1;
            currY += push * 30 * dir;
        }

        return {
            x: currX,
            y: currY,
            r: 2 + (index % 2),
            opacity: Math.sin(progress * Math.PI) // Fade in/out at edges
        };
    });

    return (
        <Circle
            cx={useDerivedValue(() => pos.value.x)}
            cy={useDerivedValue(() => pos.value.y)}
            r={useDerivedValue(() => pos.value.r)}
            color={colorBase}
            opacity={useDerivedValue(() => pos.value.opacity)}
        >
            <Blur blur={2} />
        </Circle>
    );
};

const styles = StyleSheet.create({
    container: {
        width: ANIMATION_WIDTH,
        height: HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: COLORS.bg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
});
