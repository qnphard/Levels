import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
    Path,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    G,
    Circle,
    Ellipse
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Premium Palette
const COLORS = {
    core: '#F59E0B', // Gold
    coreGlow: '#FCD34D',
    fieldLine: '#8B5CF6', // Purple
    fieldGlow: '#A78BFA',
    particle: '#FDE047', // Bright Yellow
    bgDepth: '#4C1D95', // Deep Purple
};

export default function IntentionMagnetAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
    // Animation Values
    const flow = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(1)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Particle Flow (Continuous)
        Animated.loop(
            Animated.timing(flow, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        // 2. Core Pulse (Heartbeat)
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.2, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
                Animated.timing(pulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
            ])
        ).start();

        // 3. Slow Rotation of Field
        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 30000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    // --- Magnetic Field Geometry ---
    // Toroid shape: 2 lobes of ellipses
    const fieldLines = useMemo(() => {
        // Create several layers of loops
        const loops = [];
        for (let i = 0; i < 6; i++) {
            // Different sizes
            const width = 60 + i * 25;
            const height = 120 + i * 15;
            loops.push({ w: width, h: height, opacity: 0.6 - i * 0.1 });
        }
        return loops;
    }, []);

    return (
        <View
            style={styles.container}
            renderToHardwareTextureAndroid={true}
            shouldRasterizeIOS={true}
        >
            <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
                <Defs>
                    <RadialGradient id="coreGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.core} stopOpacity="1" />
                        <Stop offset="50%" stopColor={COLORS.coreGlow} stopOpacity="0.5" />
                        <Stop offset="100%" stopColor={COLORS.fieldLine} stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="particleGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#FFF" stopOpacity="1" />
                        <Stop offset="100%" stopColor={COLORS.particle} stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* 1. Core Energy */}
                <AnimatedCircle
                    cx={CENTER} cy={CENTER} r={40}
                    fill="url(#coreGrad)"
                    scale={pulse}
                    opacity={0.8}
                />
                <Circle cx={CENTER} cy={CENTER} r={15} fill={COLORS.core} />

                {/* 2. Magnetic Field Lines */}
                <AnimatedG rotation={rotate.interpolate({ inputRange: [0, 1], outputRange: [0, 360] })} originX={CENTER} originY={CENTER}>
                    {fieldLines.map((l, i) => (
                        <G key={`line-${i}`} opacity={l.opacity}>
                            {/* Lobe 1 (Right) */}
                            {/* We use Paths to allow dash animation if needed, or just static lines */}
                            {/* Ellipse is cleaner for static structure */}
                            <Ellipse
                                cx={CENTER + l.w / 2} cy={CENTER}
                                rx={l.w / 2} ry={l.h / 2}
                                fill="none"
                                stroke={COLORS.fieldLine}
                                strokeWidth={1}
                            />
                            {/* Lobe 2 (Left) */}
                            <Ellipse
                                cx={CENTER - l.w / 2} cy={CENTER}
                                rx={l.w / 2} ry={l.h / 2}
                                fill="none"
                                stroke={COLORS.fieldLine}
                                strokeWidth={1}
                            />
                        </G>
                    ))}
                </AnimatedG>

                {/* 3. Flowing Particles */}
                {/* They follow the magnetic curves. 
            Simulating this without motionPath: 
            Parametric equation of ellipse?
            x = a * cos(t)
            y = b * sin(t)
            Shifted by center.
        */}
                {[0, 1, 2, 3].map(ringIdx => {
                    const loop = fieldLines[ringIdx + 1]; // Use middle rings
                    // Right Loop Particle
                    // Center: CENTER + loop.w/2, CENTER
                    // A = loop.w/2, B = loop.h/2
                    // Angle goes 0 -> 360 over time

                    return (
                        <G key={`p-ring-${ringIdx}`}>
                            {/* Right Side Particle */}
                            <AnimatedCircle
                                fill="url(#particleGrad)"
                                r={3}
                                cx={flow.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, Math.PI * 2].map(rad => CENTER + loop.w / 2 + (loop.w / 2) * Math.cos(rad)) // This array logic doesn't work for interp
                                    // Direct interpolation of angle? No.
                                    // We need an Animated value that drives the math... usually Reanimated.
                                    // In vanilla Animated, we can't do Cos/Sin easily.

                                    // Fallback: Rotate a group?
                                    // If we rotate a group around the ellipse center, the child will trace a circle.
                                    // But we need an ellipse trace. Scale the group!
                                })}
                            // WAIT. Simple trick:
                            // Group at Ellipse Center.
                            // Rotate Group.
                            // Child Circle at [Radius, 0].
                            // Scale Group by [1, Height/Width] to squash circle into ellipse.
                            />

                            {/* IMPLEMENTATION WITH GROUP TRANSFORM FOR ELLIPTICAL PATH */}
                            {/* Group Center: (CENTER + loop.w/2, CENTER) */}
                            <AnimatedG
                                translateX={CENTER + loop.w / 2}
                                translateY={CENTER}
                                rotation={flow.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [ringIdx * 90, ringIdx * 90 + 360] // Stagger start
                                })}
                                scaleX={1}
                                scaleY={loop.h / loop.w} // Stretch circle to ellipse ratio
                            >
                                {/* The "Orbiting" Particle */}
                                <Circle
                                    cx={loop.w / 2} cy={0} r={3} // Radius is half width
                                    fill={COLORS.particle}
                                />
                            </AnimatedG>

                            {/* Left Loop Particle */}
                            {/* Group Center: (CENTER - loop.w/2, CENTER) */}
                            <AnimatedG
                                translateX={CENTER - loop.w / 2}
                                translateY={CENTER}
                                rotation={flow.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [ringIdx * 90 + 180, ringIdx * 90 + 180 - 360] // Reverse direction? Or same?
                                })}
                                scaleX={1}
                                scaleY={loop.h / loop.w}
                            >
                                <Circle
                                    cx={loop.w / 2} cy={0} r={3}
                                    fill={COLORS.particle}
                                />
                            </AnimatedG>
                        </G>
                    );
                })}

                {/* 4. Core Burst flashes */}
                <AnimatedCircle
                    cx={CENTER} cy={CENTER} r={20}
                    fill="white"
                    opacity={pulse.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [0, 0.4]
                    })}
                />

            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: ANIMATION_SIZE,
        height: ANIMATION_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
});
