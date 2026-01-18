import React, { useMemo, useEffect } from 'react';
import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
    Canvas,
    Path,
    Skia,
    vec,
    LinearGradient,
    Group,
    Circle,
    Line,
    StrokeCap,
    StrokeJoin,
    PaintStyle,
    RadialGradient,
    Rect,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    withDelay,
    withRepeat,
    Easing,
    SharedValue,
    useAnimatedStyle,
    runOnJS,
    useDerivedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// --- Projection Logic ---
const FOCAL_LENGTH = 1000;
const TILT = 0.35;

const useStepProjection = (index: number, scrollPos: SharedValue<number>) => {
    return useDerivedValue(() => {
        const relativeStep = index - scrollPos.value;

        // Wide angle (1.4 rad ~ 80 deg) to distribute steps around stickman
        const pitch = 75;
        const angle = 1.4;

        const theta = relativeStep * angle;
        const yWorld = relativeStep * pitch;

        // Helix coordinates (wider radius to clear stickman)
        const r = 160;
        const x = r * Math.cos(theta + Math.PI / 1.6);
        const z = r * Math.sin(theta + Math.PI / 1.6);

        // Apply Pivot and Tilt
        const yRel = yWorld;
        const yRot = yRel * Math.cos(TILT) - z * Math.sin(TILT);
        const zRot = yRel * Math.sin(TILT) + z * Math.cos(TILT);

        const scale = Math.max(0.1, (FOCAL_LENGTH + zRot) / FOCAL_LENGTH);
        const x2d = CENTER_X + x * scale;
        const y2d = (CENTER_Y * 1.2) - yRot * scale;

        // Calculate "focus" - how close to center (0 = focused, 1+ = distant)
        const focus = Math.abs(relativeStep);

        return {
            x: x2d,
            y: y2d,
            scale,
            opacity: Math.max(0.1, Math.min(1, scale * scale)),
            z: zRot,
            focus,
        };
    });
};

// --- Geometry ---
const STEP_WIDTH = 80;
const STEP_HEIGHT = 30;
const STEP_DEPTH = 16;
const CORNER_RADIUS = 8;

const BLOCK_PATHS = (() => {
    const main = Skia.Path.Make();
    const top = Skia.Path.Make();
    const side = Skia.Path.Make();
    const w = STEP_WIDTH, h = STEP_HEIGHT, r = CORNER_RADIUS;
    main.addRRect(Skia.RRectXY(Skia.XYWHRect(-w / 2, -h / 2, w, h), r, r));
    const d = STEP_DEPTH, offset = d * 0.7;
    top.moveTo(-w / 2 + r, -h / 2);
    top.lineTo(w / 2 - r, -h / 2);
    top.lineTo(w / 2 - r + d, -h / 2 - offset);
    top.lineTo(-w / 2 + r + d, -h / 2 - offset);
    top.close();
    side.moveTo(w / 2, -h / 2 + r);
    side.lineTo(w / 2 + d, -h / 2 + r - offset);
    side.lineTo(w / 2 + d, h / 2 - r - offset);
    side.lineTo(w / 2, h / 2 - r);
    side.close();
    return { main, top, side };
})();

// --- Atmosphere Background (Enhanced for Immersive Experience) ---
const AtmosphereBackground = () => {
    // Generate varied dust particles for depth
    const particles = useMemo(() => {
        const result = [];
        for (let i = 0; i < 30; i++) {
            result.push({
                x: Math.random() * SCREEN_WIDTH,
                y: Math.random() * SCREEN_HEIGHT,
                r: 0.5 + Math.random() * 2,
                opacity: 0.1 + Math.random() * 0.3,
            });
        }
        return result;
    }, []);

    return (
        <Group>
            {/* Deep space background with rich purple/blue tones */}
            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
                <RadialGradient
                    c={vec(CENTER_X, CENTER_Y * 0.8)}
                    r={SCREEN_WIDTH * 1.2}
                    colors={['#1a1028', '#100818', '#08050f', '#000000']}
                    positions={[0, 0.3, 0.6, 1]}
                />
            </Rect>

            {/* Subtle ambient glow in center */}
            <Group blendMode="plus">
                <Circle cx={CENTER_X} cy={CENTER_Y * 0.9} r={200} opacity={0.15}>
                    <RadialGradient
                        c={vec(CENTER_X, CENTER_Y * 0.9)}
                        r={200}
                        colors={['#6366f1', '#4f46e5', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Secondary warm glow - creates depth */}
            <Group blendMode="plus">
                <Circle cx={CENTER_X * 0.7} cy={CENTER_Y * 1.3} r={150} opacity={0.08}>
                    <RadialGradient
                        c={vec(CENTER_X * 0.7, CENTER_Y * 1.3)}
                        r={150}
                        colors={['#ec4899', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Dust particles with varying sizes and opacity */}
            <Group opacity={0.4}>
                {particles.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r={p.r} color="white" opacity={p.opacity} />
                ))}
            </Group>

            {/* Dark vignette around edges for cinematic focus */}
            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
                <RadialGradient
                    c={vec(CENTER_X, CENTER_Y * 0.9)}
                    r={SCREEN_WIDTH * 0.7}
                    colors={['transparent', 'transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                    positions={[0, 0.4, 0.75, 1]}
                />
            </Rect>
        </Group>
    );
};

// --- Enhanced Stickman with Glow and Breathing Animation ---
const SkiaStickman = () => {
    const scale = 2.4;
    const center = vec(CENTER_X, (CENTER_Y * 1.2) - 40);

    // Breathing animation - slow 4 second cycle
    const breathingProgress = useSharedValue(0);

    useEffect(() => {
        breathingProgress.value = withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    // Derived values for breathing effect
    const breathOffset = useDerivedValue(() => {
        return Math.sin(breathingProgress.value * Math.PI) * 3;
    });

    const glowOpacity = useDerivedValue(() => {
        return 0.4 + Math.sin(breathingProgress.value * Math.PI) * 0.2;
    });

    // Main body paint - slightly softer stroke
    const paint = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('#ffffff'));
        p.setStrokeWidth(6);
        p.setStrokeCap(StrokeCap.Round);
        p.setStrokeJoin(StrokeJoin.Round);
        p.setStyle(PaintStyle.Stroke);
        return p;
    }, []);

    // Glow paint for outer glow effect
    const glowPaint = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('#a5b4fc'));
        p.setStrokeWidth(14);
        p.setStrokeCap(StrokeCap.Round);
        p.setStrokeJoin(StrokeJoin.Round);
        p.setStyle(PaintStyle.Stroke);
        p.setMaskFilter(Skia.MaskFilter.MakeBlur(1, 8, true));
        return p;
    }, []);

    const baseY = center.y + (50 * (1 - scale));

    // Compute breathing offset position
    const animatedBaseY = useDerivedValue(() => baseY - breathOffset.value);

    return (
        <Group>
            {/* Outer ethereal glow - creates soft halo effect */}
            <Group opacity={glowOpacity} blendMode="plus">
                <Circle cx={center.x} cy={baseY + 20 * scale} r={60} opacity={0.3}>
                    <RadialGradient
                        c={vec(center.x, baseY + 20 * scale)}
                        r={60}
                        colors={['#a5b4fc', '#6366f1', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Glow layer - blurred larger strokes */}
            <Group opacity={0.3}>
                <Line p1={vec(center.x, animatedBaseY.value)} p2={vec(center.x, animatedBaseY.value + 25 * scale)} paint={glowPaint} />
                <Line p1={vec(center.x, animatedBaseY.value + 25 * scale)} p2={vec(center.x - 8 * scale, animatedBaseY.value + 48 * scale)} paint={glowPaint} />
                <Line p1={vec(center.x, animatedBaseY.value + 25 * scale)} p2={vec(center.x + 8 * scale, animatedBaseY.value + 48 * scale)} paint={glowPaint} />
                <Line p1={vec(center.x, animatedBaseY.value + 6 * scale)} p2={vec(center.x - 11 * scale, animatedBaseY.value + 21 * scale)} paint={glowPaint} />
                <Line p1={vec(center.x, animatedBaseY.value + 6 * scale)} p2={vec(center.x + 11 * scale, animatedBaseY.value + 21 * scale)} paint={glowPaint} />
                <Circle cx={center.x} cy={animatedBaseY.value - 7 * scale} r={18} color="#a5b4fc" />
            </Group>

            {/* Main body - crisp white strokes */}
            <Group>
                <Line p1={vec(center.x, animatedBaseY.value)} p2={vec(center.x, animatedBaseY.value + 25 * scale)} paint={paint} />
                <Line p1={vec(center.x, animatedBaseY.value + 25 * scale)} p2={vec(center.x - 8 * scale, animatedBaseY.value + 48 * scale)} paint={paint} />
                <Line p1={vec(center.x, animatedBaseY.value + 25 * scale)} p2={vec(center.x + 8 * scale, animatedBaseY.value + 48 * scale)} paint={paint} />
                <Line p1={vec(center.x, animatedBaseY.value + 6 * scale)} p2={vec(center.x - 11 * scale, animatedBaseY.value + 21 * scale)} paint={paint} />
                <Line p1={vec(center.x, animatedBaseY.value + 6 * scale)} p2={vec(center.x + 11 * scale, animatedBaseY.value + 21 * scale)} paint={paint} />
                {/* Head with subtle gradient for depth */}
                <Circle cx={center.x} cy={animatedBaseY.value - 7 * scale} r={13}>
                    <RadialGradient
                        c={vec(center.x - 3, animatedBaseY.value - 7 * scale - 3)}
                        r={13}
                        colors={['#ffffff', '#e0e7ff']}
                    />
                </Circle>
            </Group>
        </Group>
    );
};

// --- Landing Item with Enhanced Glass/Crystal Effect ---
const LandingItem = ({
    index,
    color,
    scrollPos,
    entranceProgress
}: {
    index: number,
    color: string,
    scrollPos: SharedValue<number>,
    entranceProgress: SharedValue<number>
}) => {
    const projection = useStepProjection(index, scrollPos);

    const transform = useDerivedValue(() => {
        const { x, y, scale, focus } = projection.value;
        // Scale up slightly when focused (within 0.5 of center)
        const focusScale = focus < 0.5 ? 1.15 : 1;
        return [
            { translateX: x },
            { translateY: y },
            { scale: scale * focusScale * entranceProgress.value },
        ];
    });

    const opacity = useDerivedValue(() => projection.value.opacity * entranceProgress.value);

    // Enhanced glow for focused step
    const glowRadius = useDerivedValue(() => {
        const { focus } = projection.value;
        return focus < 0.5 ? 110 : 70;
    });

    const glowOpacity = useDerivedValue(() => {
        const { focus } = projection.value;
        return focus < 0.5 ? 0.7 : 0.35;
    });

    // Focus ring opacity
    const focusRingOpacity = useDerivedValue(() => projection.value.focus < 0.5 ? 0.5 : 0);

    // Inner glow intensity
    const innerGlowOpacity = useDerivedValue(() => {
        const { focus } = projection.value;
        return focus < 0.5 ? 0.6 : 0.3;
    });

    return (
        <Group transform={transform} opacity={opacity}>
            {/* Floating shadow beneath stair */}
            <Group opacity={0.4}>
                <Circle cx={0} cy={25} r={45}>
                    <RadialGradient c={vec(0, 25)} r={45} colors={['rgba(0,0,0,0.5)', 'transparent']} />
                </Circle>
            </Group>

            {/* Outer glow - enhanced for focused step */}
            <Group blendMode="plus">
                <Circle cx={0} cy={0} r={glowRadius} opacity={glowOpacity}>
                    <RadialGradient c={vec(0, 0)} r={110} colors={[color, `${color}66`, 'transparent']} />
                </Circle>
            </Group>

            {/* Focus ring - pulsing effect for active step */}
            <Circle
                cx={0}
                cy={0}
                r={55}
                style="stroke"
                strokeWidth={1.5}
                color="white"
                opacity={focusRingOpacity}
            />

            {/* Glass effect base layer */}
            <Path path={BLOCK_PATHS.side} color="black" opacity={0.3} />
            <Path path={BLOCK_PATHS.top} opacity={0.25}>
                <LinearGradient
                    start={vec(-40, -20)} end={vec(40, 0)}
                    colors={[`${color}aa`, `${color}55`]}
                />
            </Path>

            {/* Main glass/crystal body with transparency */}
            <Path path={BLOCK_PATHS.main} opacity={0.85}>
                <LinearGradient
                    start={vec(-40, -15)} end={vec(40, 15)}
                    colors={[`${color}cc`, color, `${color}88`]}
                />
            </Path>

            {/* Glass highlight - creates crystal shimmer effect */}
            <Path path={BLOCK_PATHS.main} opacity={innerGlowOpacity}>
                <LinearGradient
                    start={vec(-40, -15)} end={vec(40, 15)}
                    colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.1)', 'transparent']}
                />
            </Path>

            {/* Edge glow - soft lit edges */}
            <Path path={BLOCK_PATHS.main} style="stroke" strokeWidth={1.5} opacity={0.8}>
                <LinearGradient
                    start={vec(-40, 0)} end={vec(40, 0)}
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)']}
                />
            </Path>
        </Group>
    );
};

// Heavy Weather Levels - The 8 lower consciousness states
const LEVELS = [
    { id: 'shame', label: 'Shame', color: '#6B21A8' },
    { id: 'guilt', label: 'Guilt', color: '#7C3AED' },
    { id: 'apathy', label: 'Apathy', color: '#4B5563' },
    { id: 'grief', label: 'Grief', color: '#1E40AF' },
    { id: 'fear', label: 'Fear', color: '#F59E0B' },
    { id: 'desire', label: 'Desire', color: '#DC2626' },
    { id: 'anger', label: 'Anger', color: '#EF4444' },
    { id: 'pride', label: 'Pride', color: '#10B981' },
];

// --- Label with Enhanced Typography ---
const LabelOverlayItem = ({
    index, label, color, scrollPos, onPress, entranceProgress
}: {
    index: number,
    label: string,
    color: string,
    scrollPos: SharedValue<number>,
    onPress: (idx: number) => void,
    entranceProgress: SharedValue<number>
}) => {
    const projection = useStepProjection(index, scrollPos);

    const style = useAnimatedStyle(() => {
        const { x, y, scale, opacity, z, focus } = projection.value;
        const isVisible = scale > 0.35 && opacity > 0.1;
        // Slightly larger when focused
        const focusScale = focus < 0.5 ? 1.15 : 1;

        return {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [
                { translateX: x - 50 },
                { translateY: y - 55 },
                { scale: scale * focusScale * entranceProgress.value }
            ],
            opacity: withTiming(isVisible ? entranceProgress.value : 0, { duration: 250 }),
            zIndex: Math.floor(z + 1000)
        };
    });

    return (
        <Animated.View style={[style, { pointerEvents: 'box-none' }]}>
            <TouchableOpacity
                onPress={() => onPress(index)}
                activeOpacity={0.7}
                style={styles.lblBox}
            >
                <Text style={[styles.lblText, { color }]}>{label}</Text>
                <View style={styles.hitbox} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const LevelStairsMenu: React.FC<{ onSelectSection: (id: string) => void }> = ({ onSelectSection }) => {
    const scrollPos = useSharedValue(0);
    const entranceProgress = useSharedValue(0);
    const startScrollPos = useSharedValue(0);

    // Entrance animation on mount
    useEffect(() => {
        entranceProgress.value = withDelay(
            100,
            withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) })
        );
    }, []);

    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // Pan gesture for scrolling through levels
    const panGesture = Gesture.Pan()
        .onStart(() => {
            startScrollPos.value = scrollPos.value;
        })
        .onUpdate((event) => {
            // Convert vertical drag to scroll position
            // Negative because dragging up should increase scroll (go to higher levels)
            const newPos = startScrollPos.value - event.translationY / 100;
            // Clamp between 0 and last level index
            scrollPos.value = Math.max(0, Math.min(LEVELS.length - 1, newPos));
        })
        .onEnd((event) => {
            // Snap to nearest level
            const nearestLevel = Math.round(scrollPos.value);
            const clampedLevel = Math.max(0, Math.min(LEVELS.length - 1, nearestLevel));

            // Haptic feedback on snap
            runOnJS(triggerHaptic)();

            scrollPos.value = withTiming(clampedLevel, {
                duration: 300,
                easing: Easing.out(Easing.cubic)
            });
        });

    const handlePress = (idx: number) => {
        // Haptic feedback on selection
        triggerHaptic();

        scrollPos.value = withTiming(idx, { duration: 750, easing: Easing.out(Easing.exp) }, (done) => {
            if (done) runOnJS(onSelectSection)(LEVELS[idx].id);
        });
    };

    return (
        <GestureDetector gesture={panGesture}>
            <View style={styles.container}>
                <Canvas style={styles.canvas}>
                    {/* Atmosphere */}
                    <AtmosphereBackground />

                    {/* Steps with entrance animation */}
                    {LEVELS.map((s, i) => (
                        <LandingItem
                            key={s.id}
                            index={i}
                            color={s.color}
                            scrollPos={scrollPos}
                            entranceProgress={entranceProgress}
                        />
                    ))}

                    {/* Static Stickman */}
                    <SkiaStickman />
                </Canvas>

                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    {LEVELS.map((s, i) => (
                        <LabelOverlayItem
                            key={s.id}
                            index={i}
                            label={s.label}
                            color={s.color}
                            scrollPos={scrollPos}
                            onPress={handlePress}
                            entranceProgress={entranceProgress}
                        />
                    ))}
                </View>
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a12' },
    canvas: { flex: 1 },
    lblBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    lblText: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
        textAlign: 'center',
    },
    hitbox: { width: 80, height: 50 }
});

export default LevelStairsMenu;
