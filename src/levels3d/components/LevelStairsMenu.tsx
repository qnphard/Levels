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

        // Wide angle (1.4 rad ~ 80 deg) to distribute steps around orb
        const pitch = 75;
        const angle = 1.4;

        const theta = relativeStep * angle;
        const yWorld = relativeStep * pitch;

        // Helix coordinates (wider radius to clear orb)
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

// --- Glowing Orb of Consciousness ---
const ConsciousnessOrb = () => {
    const center = vec(CENTER_X, (CENTER_Y * 1.2) - 40);

    // Breathing animation - slow 4 second cycle (same as stickman)
    const breathingProgress = useSharedValue(0);

    useEffect(() => {
        breathingProgress.value = withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    // Derived values for breathing effect (same pattern as stickman)
    const breathOffset = useDerivedValue(() => {
        return Math.sin(breathingProgress.value * Math.PI) * 3;
    });

    const glowOpacity = useDerivedValue(() => {
        return 0.4 + Math.sin(breathingProgress.value * Math.PI) * 0.2;
    });

    // Add pulsing scale animation (faster than breathing)
    const pulseScale = useDerivedValue(() => {
        return 1 + Math.sin(breathingProgress.value * Math.PI * 2) * 0.1;
    });

    // Inner core pulse (even faster for energy effect)
    const innerPulse = useDerivedValue(() => {
        return 0.8 + Math.sin(breathingProgress.value * Math.PI * 3) * 0.2;
    });

    // Compute breathing offset position (same as stickman)
    const animatedCenterY = useDerivedValue(() => center.y - breathOffset.value);

    return (
        <Group>
            {/* Outer ethereal glow - creates soft halo effect */}
            <Group opacity={glowOpacity} blendMode="plus">
                <Circle cx={center.x} cy={animatedCenterY.value} r={80} opacity={0.3}>
                    <RadialGradient
                        c={vec(center.x, animatedCenterY.value)}
                        r={80}
                        colors={['#a5b4fc', '#6366f1', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Middle glow layer */}
            <Group opacity={0.6} blendMode="plus">
                <Circle cx={center.x} cy={animatedCenterY.value} r={50} opacity={0.4}>
                    <RadialGradient
                        c={vec(center.x, animatedCenterY.value)}
                        r={50}
                        colors={['#ffffff', '#e0e7ff', '#a5b4fc', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Main orb body with pulsing scale */}
            <Group transform={[{ scale: pulseScale.value }]}>
                <Circle cx={center.x} cy={animatedCenterY.value} r={25}>
                    <RadialGradient
                        c={vec(center.x - 5, animatedCenterY.value - 5)}
                        r={25}
                        colors={['#ffffff', '#f0f0ff', '#d1d5db']}
                    />
                </Circle>
            </Group>

            {/* Inner bright core with faster pulse */}
            <Group transform={[{ scale: pulseScale.value }]} opacity={innerPulse.value}>
                <Circle cx={center.x} cy={animatedCenterY.value} r={15}>
                    <RadialGradient
                        c={vec(center.x - 3, animatedCenterY.value - 3)}
                        r={15}
                        colors={['#ffffff', '#f8fafc']}
                    />
                </Circle>
            </Group>

            {/* Subtle energy rings */}
            <Group opacity={0.4}>
                <Circle 
                    cx={center.x} 
                    cy={animatedCenterY.value} 
                    r={35} 
                    style="stroke" 
                    strokeWidth={1} 
                    color="#a5b4fc" 
                />
                <Circle 
                    cx={center.x} 
                    cy={animatedCenterY.value} 
                    r={55} 
                    style="stroke" 
                    strokeWidth={0.5} 
                    color="#6366f1" 
                    opacity={0.6}
                />
            </Group>
        </Group>
    );
};

// --- Landing Item with Enhanced Glass/Crystal Effect ---
const LandingItem = ({
    index,
    color,
    category,
    scrollPos,
    entranceProgress
}: {
    index: number,
    color: string,
    category: string,
    scrollPos: SharedValue<number>,
    entranceProgress: SharedValue<number>
}) => {
    const projection = useStepProjection(index, scrollPos);

    // Category-based effects
    const getCategoryEffects = (cat: string) => {
        switch (cat) {
            case 'lower':
                return {
                    glowIntensity: 0.3,
                    materialOpacity: 0.7,
                    shadowIntensity: 0.8,
                    edgeGlow: 0.4
                };
            case 'linear':
                return {
                    glowIntensity: 0.6,
                    materialOpacity: 0.8,
                    shadowIntensity: 0.4,
                    edgeGlow: 0.6
                };
            case 'spiritual':
                return {
                    glowIntensity: 0.9,
                    materialOpacity: 0.9,
                    shadowIntensity: 0.1,
                    edgeGlow: 0.8
                };
            case 'enlightenment':
                return {
                    glowIntensity: 1.2,
                    materialOpacity: 0.95,
                    shadowIntensity: 0,
                    edgeGlow: 1.0
                };
            default:
                return {
                    glowIntensity: 0.6,
                    materialOpacity: 0.8,
                    shadowIntensity: 0.4,
                    edgeGlow: 0.6
                };
        }
    };

    const effects = getCategoryEffects(category);

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
        return focus < 0.5 ? 110 * effects.glowIntensity : 70 * effects.glowIntensity;
    });

    const glowOpacity = useDerivedValue(() => {
        const { focus } = projection.value;
        return (focus < 0.5 ? 0.7 : 0.35) * effects.glowIntensity;
    });

    // Focus ring opacity
    const focusRingOpacity = useDerivedValue(() => projection.value.focus < 0.5 ? 0.5 : 0);

    // Inner glow intensity
    const innerGlowOpacity = useDerivedValue(() => {
        const { focus } = projection.value;
        return (focus < 0.5 ? 0.6 : 0.3) * effects.edgeGlow;
    });

    return (
        <Group transform={transform} opacity={opacity}>
            {/* Floating shadow beneath stair - varies by category */}
            {effects.shadowIntensity > 0 && (
                <Group opacity={0.4 * effects.shadowIntensity}>
                    <Circle cx={0} cy={25} r={45}>
                        <RadialGradient c={vec(0, 25)} r={45} colors={['rgba(0,0,0,0.5)', 'transparent']} />
                    </Circle>
                </Group>
            )}

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
            <Path path={BLOCK_PATHS.side} color="black" opacity={0.3 * effects.shadowIntensity} />
            <Path path={BLOCK_PATHS.top} opacity={0.25 * effects.materialOpacity}>
                <LinearGradient
                    start={vec(-40, -20)} end={vec(40, 0)}
                    colors={[`${color}aa`, `${color}55`]}
                />
            </Path>

            {/* Main glass/crystal body with transparency */}
            <Path path={BLOCK_PATHS.main} opacity={0.85 * effects.materialOpacity}>
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
            <Path path={BLOCK_PATHS.main} style="stroke" strokeWidth={1.5} opacity={0.8 * effects.edgeGlow}>
                <LinearGradient
                    start={vec(-40, 0)} end={vec(40, 0)}
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)']}
                />
            </Path>

            {/* Special effects for enlightenment level */}
            {category === 'enlightenment' && (
                <Group blendMode="plus">
                    <Circle cx={0} cy={0} r={80} opacity={0.3}>
                        <RadialGradient
                            c={vec(0, 0)}
                            r={80}
                            colors={['#ffffff', '#f0f0ff', 'transparent']}
                        />
                    </Circle>
                </Group>
            )}
        </Group>
    );
};

// All Consciousness Levels - Complete staircase from lower to enlightenment
const LEVELS = [
    // Lower Levels (Underground) - Dark, heavy colors
    { id: 'shame', label: 'Shame', color: '#6B21A8', category: 'lower' },      // Deep purple
    { id: 'guilt', label: 'Guilt', color: '#7C3AED', category: 'lower' },      // Purple
    { id: 'apathy', label: 'Apathy', color: '#4B5563', category: 'lower' },    // Dark gray
    { id: 'grief', label: 'Grief', color: '#1E40AF', category: 'lower' },      // Dark blue
    { id: 'fear', label: 'Fear', color: '#B45309', category: 'lower' },        // Dark orange
    { id: 'desire', label: 'Desire', color: '#DC2626', category: 'lower' },    // Red
    { id: 'anger', label: 'Anger', color: '#EF4444', category: 'lower' },      // Bright red
    { id: 'pride', label: 'Pride', color: '#F97316', category: 'lower' },      // Orange
    
    // Linear Mind Levels (Ground Floor) - Clearer, more balanced colors
    { id: 'courage', label: 'Courage', color: '#3B82F6', category: 'linear' },     // Blue
    { id: 'neutrality', label: 'Neutrality', color: '#6B7280', category: 'linear' }, // Gray
    { id: 'willingness', label: 'Willingness', color: '#059669', category: 'linear' }, // Emerald green
    { id: 'acceptance', label: 'Acceptance', color: '#0D9488', category: 'linear' },   // Teal
    { id: 'reason', label: 'Reason', color: '#0891B2', category: 'linear' },          // Cyan
    
    // Spiritual Reality Levels (Upper Chambers) - Warm, radiant colors
    { id: 'love', label: 'Love', color: '#EC4899', category: 'spiritual' },     // Pink
    { id: 'joy', label: 'Joy', color: '#FBBF24', category: 'spiritual' },       // Golden yellow
    { id: 'peace', label: 'Peace', color: '#8B5CF6', category: 'spiritual' },   // Violet
    
    // Enlightenment Levels (Sky Temple) - Pure light
    { id: 'enlightenment', label: 'Enlightenment', color: '#FFFFFF', category: 'enlightenment' },
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
                            category={s.category}
                            scrollPos={scrollPos}
                            entranceProgress={entranceProgress}
                        />
                    ))}
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
