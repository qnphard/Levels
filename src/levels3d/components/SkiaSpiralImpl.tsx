/**
 * SkiaSpiralImpl - 2.5D Spiral Tower with Professional Polish
 * Focus hierarchy, enhanced stickman, improved motion, premium atmosphere
 */
import React, { useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    vec,
    LinearGradient,
    Group,
    Rect,
    Circle,
    Line,
    StrokeCap,
    StrokeJoin,
    PaintStyle,
    RadialGradient,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    useDerivedValue,
    withRepeat,
    withTiming,
    withDecay,
    withSpring,
    Easing,
    SharedValue,
    useAnimatedStyle,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Animated from 'react-native-reanimated';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { LEVELS, LevelNode } from '../levelGraph';
import { SpiralConfig, DEFAULT_SPIRAL } from '../mathSpiral';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// 2.5D projection parameters
const FOCAL_LENGTH = 1000;
const TILT = 0.3;

// Enhanced projection with focus distance calculation
const useProjection = (
    stepIndex: number,
    scrollPos: SharedValue<number>,
    time: SharedValue<number>,
    spiralCfg: SpiralConfig
) => {
    return useDerivedValue(() => {
        const relativeStep = stepIndex - scrollPos.value;
        const focusDist = Math.abs(relativeStep);

        const customPitch = spiralCfg.pitch * 0.4;
        const customAngle = spiralCfg.stepAngle * 0.6;

        const theta = relativeStep * customAngle;
        const yWorld = relativeStep * customPitch * 60;

        // Micro-drift: subtle float per platform
        const microDrift = Math.sin(time.value * 0.5 + stepIndex * 0.7) * 2;

        const r = spiralCfg.radius * 55;
        const x = r * Math.cos(theta + Math.PI / 2);
        const z = r * Math.sin(theta + Math.PI / 2);

        const yRel = yWorld + microDrift;
        const yRot = yRel * Math.cos(TILT) - z * Math.sin(TILT);
        const zRot = yRel * Math.sin(TILT) + z * Math.cos(TILT);

        const scale = Math.max(0.1, (FOCAL_LENGTH + zRot) / FOCAL_LENGTH);
        const x2d = CENTER_X + x * scale;
        const y2d = CENTER_Y * 1.2 - yRot * scale;

        // Focus: 0 = perfectly focused, higher = further away
        const isFocused = focusDist < 0.6;

        return {
            x: x2d,
            y: y2d,
            scale,
            opacity: Math.max(0, Math.min(1, scale * scale)),
            zIndex: zRot,
            focusDist,
            isFocused,
        };
    });
};

// Block geometry
const STEP_WIDTH = 70;
const STEP_HEIGHT = 28;
const STEP_DEPTH = 16;
const CORNER_RADIUS = 10;

const createBlockPaths = () => {
    const main = Skia.Path.Make();
    const top = Skia.Path.Make();
    const side = Skia.Path.Make();
    const pedestal = Skia.Path.Make();

    const w = STEP_WIDTH, h = STEP_HEIGHT, r = CORNER_RADIUS;
    main.addRRect(Skia.RRectXY(Skia.XYWHRect(-w / 2, -h / 2, w, h), r, r));

    const d = STEP_DEPTH;
    const offset = d * 0.7;

    top.moveTo(-w / 2 + r, -h / 2);
    top.lineTo(w / 2 - r, -h / 2);
    top.lineTo(w / 2 - r + offset, -h / 2 - offset);
    top.lineTo(-w / 2 + r + offset, -h / 2 - offset);
    top.close();

    side.moveTo(w / 2, -h / 2 + r);
    side.lineTo(w / 2, h / 2 - r);
    side.lineTo(w / 2 + offset, h / 2 - r - offset);
    side.lineTo(w / 2 + offset, -h / 2 + r - offset);
    side.close();

    // Pedestal/under-shadow base
    pedestal.addRRect(Skia.RRectXY(Skia.XYWHRect(-w / 2 - 4, h / 2 - 2, w + 8, 8), 4, 4));

    return { main, top, side, pedestal };
};

const BLOCK_PATHS = createBlockPaths();

// --- Enhanced Landing Item with Focus Hierarchy ---
const LandingItem = ({
    level,
    scrollPos,
    time,
}: {
    level: LevelNode,
    scrollPos: SharedValue<number>,
    time: SharedValue<number>,
}) => {
    const projection = useProjection(level.stepIndex, scrollPos, time, DEFAULT_SPIRAL);

    const transform = useDerivedValue(() => {
        const { x, y, scale, isFocused, focusDist } = projection.value;
        // Focus scale boost: 1.06x when focused, with spring-like interpolation
        const focusScale = isFocused ? 1.06 : interpolate(focusDist, [0.6, 2], [1, 0.95]);
        return [
            { translateX: x },
            { translateY: y },
            { scale: scale * focusScale },
        ];
    });

    const groupOpacity = useDerivedValue(() => {
        const { opacity, isFocused } = projection.value;
        // Simple depth-based opacity, no focus fading
        return isFocused ? Math.min(1, opacity * 1.1) : opacity;
    });

    // Dynamic glow based on focus
    const glowRadius = useDerivedValue(() => {
        const { isFocused } = projection.value;
        return isFocused ? 80 : 55;
    });

    const glowOpacity = useDerivedValue(() => {
        const { isFocused } = projection.value;
        // Focused gets slightly brighter glow
        return isFocused ? 0.7 : 0.55;
    });

    // Dynamic outline opacity
    const outlineOpacity = useDerivedValue(() => {
        const { isFocused, focusDist } = projection.value;
        if (isFocused) return 0.95;
        return interpolate(focusDist, [0.6, 3], [0.6, 0.4]);
    });

    const color = useMemo(() => Skia.Color(level.color), [level.color]);

    const paintSide = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('black'));
        p.setAlphaf(0.5);
        return p;
    }, []);

    return (
        <Group transform={transform} opacity={groupOpacity}>
            {/* Pedestal/under-shadow */}
            <Group transform={[{ translateY: 4 }]}>
                <Path path={BLOCK_PATHS.pedestal} color="white" opacity={0.08} />
            </Group>

            {/* Drop shadow */}
            <Group transform={[{ translateY: 18 }, { translateX: 8 }]}>
                <Path path={BLOCK_PATHS.main} color="black" opacity={0.25} />
            </Group>

            {/* Additive Glow */}
            <Group blendMode="plus">
                <Circle cx={0} cy={0} r={glowRadius} opacity={glowOpacity}>
                    <RadialGradient c={vec(0, 0)} r={80} colors={[level.color, 'transparent']} />
                </Circle>
            </Group>

            {/* Block Geometry */}
            <Path path={BLOCK_PATHS.side} paint={paintSide} />

            {/* Top highlight */}
            <Path path={BLOCK_PATHS.top} color={level.color} opacity={0.5} />
            <Path path={BLOCK_PATHS.top} color="white" opacity={0.15} />

            {/* Main Face with gradient */}
            <Path path={BLOCK_PATHS.main} color={level.color}>
                <LinearGradient
                    start={vec(-STEP_WIDTH / 2, -STEP_HEIGHT / 2)}
                    end={vec(STEP_WIDTH / 2, STEP_HEIGHT / 2)}
                    colors={['rgba(255,255,255,0.35)', 'rgba(0,0,0,0.15)']}
                />
            </Path>

            {/* Crisp Outline with focus-based opacity */}
            <Path
                path={BLOCK_PATHS.main}
                style="stroke"
                strokeWidth={2}
                color="white"
                opacity={outlineOpacity}
            />
            <Path path={BLOCK_PATHS.top} style="stroke" strokeWidth={1} color="white" opacity={0.5} />
        </Group>
    );
};

// --- Enhanced Stickman with Halo and Shadow ---
const SkiaStickman = ({ isMoving }: { isMoving: SharedValue<boolean> }) => {
    const time = useSharedValue(0);

    useDerivedValue(() => {
        if (isMoving.value) {
            time.value = withRepeat(withTiming(Math.PI * 2, { duration: 240 }), -1);
        } else {
            time.value = 0;
        }
    });

    const animPose = useDerivedValue(() => {
        const t = time.value;
        const legOffset = Math.sin(t) * 10;
        const armOffset = Math.sin(t + Math.PI) * 8;
        const bob = Math.abs(Math.sin(t * 2)) * 2;
        return { legOffset, armOffset, bob };
    });

    const scale = 1.8;
    const center = vec(CENTER_X + 2, CENTER_Y * 1.2 - 25);
    const baseY = center.y + (50 * (1 - scale));

    const pNeck = useDerivedValue(() => vec(center.x, baseY - animPose.value.bob));
    const pHip = useDerivedValue(() => vec(center.x, baseY - animPose.value.bob + 25 * scale));
    const pLegL = useDerivedValue(() => vec(center.x - 5 * scale + animPose.value.legOffset * scale, baseY - animPose.value.bob + 50 * scale));
    const pLegR = useDerivedValue(() => vec(center.x + 5 * scale - animPose.value.legOffset * scale, baseY - animPose.value.bob + 50 * scale));
    const pShoulder = useDerivedValue(() => vec(center.x, baseY - animPose.value.bob + 5 * scale));
    const pArmL = useDerivedValue(() => vec(center.x - 8 * scale + animPose.value.armOffset * scale, baseY - animPose.value.bob + 20 * scale));
    const pArmR = useDerivedValue(() => vec(center.x + 8 * scale - animPose.value.armOffset * scale, baseY - animPose.value.bob + 20 * scale));

    const headTransform = useDerivedValue(() => [
        { translateX: center.x },
        { translateY: baseY - animPose.value.bob - 6 * scale }
    ]);

    const paint = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('white'));
        p.setStrokeWidth(6);
        p.setStrokeCap(StrokeCap.Round);
        p.setStrokeJoin(StrokeJoin.Round);
        p.setStyle(PaintStyle.Stroke);
        return p;
    }, []);

    return (
        <Group>
            {/* Ground shadow blob */}
            <Circle
                cx={center.x}
                cy={baseY + 55 * scale}
                r={25}
                opacity={0.3}
            >
                <RadialGradient
                    c={vec(center.x, baseY + 55 * scale)}
                    r={25}
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                />
            </Circle>

            {/* Halo glow behind stickman */}
            <Group blendMode="plus">
                <Circle cx={center.x} cy={baseY + 15 * scale} r={45} opacity={0.25}>
                    <RadialGradient
                        c={vec(center.x, baseY + 15 * scale)}
                        r={45}
                        colors={['rgba(180,200,255,0.5)', 'transparent']}
                    />
                </Circle>
            </Group>

            {/* Stickman body */}
            <Line p1={pNeck} p2={pHip} paint={paint} />
            <Line p1={pHip} p2={pLegL} paint={paint} />
            <Line p1={pHip} p2={pLegR} paint={paint} />
            <Line p1={pShoulder} p2={pArmL} paint={paint} />
            <Line p1={pShoulder} p2={pArmR} paint={paint} />

            <Group transform={headTransform}>
                <Circle cx={0} cy={0} r={11} color="white" />
            </Group>
        </Group>
    );
};

// --- Label Overlay with Focus-based Sizing ---
const LevelOverlayItem = ({
    level,
    scrollPos,
    time,
    onPress
}: {
    level: LevelNode,
    scrollPos: SharedValue<number>,
    time: SharedValue<number>,
    onPress: (id: string, step: number) => void
}) => {
    const projection = useProjection(level.stepIndex, scrollPos, time, DEFAULT_SPIRAL);

    const style = useAnimatedStyle(() => {
        const { x, y, scale, opacity, zIndex, isFocused, focusDist } = projection.value;
        const isVisible = scale > 0.3;

        // Simple opacity - no focus-based fading
        const labelOpacity = isFocused ? Math.min(1, opacity * 1.1) : opacity;

        return {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [
                { translateX: x - 45 },
                { translateY: y - 50 },
                { scale: scale }
            ],
            opacity: withTiming(isVisible ? labelOpacity : 0, { duration: 150 }),
            zIndex: Math.floor(zIndex + 1000)
        };
    });

    // Determine if focused for styling
    const isFocusedStyle = useDerivedValue(() => projection.value.isFocused);

    return (
        <Animated.View style={[style, { pointerEvents: 'box-none' }]}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPress(level.id, level.stepIndex)}
                style={styles.levelLabelContainer}
            >
                <Text style={[
                    styles.levelLabel,
                    { color: level.color }
                ]}>
                    {level.label}
                </Text>
                <View style={styles.hitbox} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- Vignette Overlay ---
const VignetteOverlay = () => (
    <Group>
        {/* Top vignette */}
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.25}>
            <LinearGradient
                start={vec(0, 0)}
                end={vec(0, SCREEN_HEIGHT * 0.25)}
                colors={['rgba(0,0,0,0.6)', 'transparent']}
            />
        </Rect>
        {/* Bottom vignette */}
        <Rect x={0} y={SCREEN_HEIGHT * 0.75} width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.25}>
            <LinearGradient
                start={vec(0, SCREEN_HEIGHT * 0.75)}
                end={vec(0, SCREEN_HEIGHT)}
                colors={['transparent', 'rgba(0,0,0,0.7)']}
            />
        </Rect>
    </Group>
);

// --- Main Component ---
export const SkiaSpiralImpl = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const scrollPos = useSharedValue(0);
    const isMoving = useSharedValue(false);
    const scrollStart = useSharedValue(0);
    const time = useSharedValue(0);

    // Continuous time for micro-drift animation
    useEffect(() => {
        time.value = withRepeat(
            withTiming(Math.PI * 20, { duration: 30000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    // Pan gesture for scrolling
    const panGesture = Gesture.Pan()
        .onStart(() => {
            scrollStart.value = scrollPos.value;
        })
        .onUpdate((e) => {
            const sensitivity = 0.008;
            scrollPos.value = scrollStart.value - e.translationY * sensitivity;
            scrollPos.value = Math.max(0, Math.min(LEVELS.length - 1, scrollPos.value));
        })
        .onEnd((e) => {
            const velocity = -e.velocityY * 0.008;
            scrollPos.value = withDecay({
                velocity: velocity,
                clamp: [0, LEVELS.length - 1],
                deceleration: 0.995,
            });
        });

    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleLevelPress = (id: string, stepIndex: number) => {
        triggerHaptic();
        isMoving.value = true;

        const distance = Math.abs(stepIndex - scrollPos.value);
        const duration = 400 + Math.sqrt(distance) * 120;

        // Use spring for "pop" effect on arrival
        scrollPos.value = withTiming(stepIndex, {
            duration: duration,
            easing: Easing.out(Easing.exp),
        }, (finished) => {
            if (finished) {
                isMoving.value = false;
                runOnJS(navigateToMenu)(id);
            }
        });
    };

    const navigateToMenu = (id: string) => {
        navigation.navigate('LevelContentMenu', { levelId: id });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#070812' }}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={{ flex: 1 }}>
                    <Canvas style={{ flex: 1 }}>
                        <Group>
                            {/* Premium Background */}
                            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
                                <RadialGradient
                                    c={vec(CENTER_X, CENTER_Y)}
                                    r={SCREEN_WIDTH * 0.9}
                                    colors={['#151020', '#0a0810', '#050508']}
                                />
                            </Rect>

                            {/* Dust Particles */}
                            <Group opacity={0.2}>
                                <Circle cx={CENTER_X * 0.4} cy={CENTER_Y * 0.3} r={1.5} color="white" />
                                <Circle cx={CENTER_X * 1.6} cy={CENTER_Y * 0.25} r={2} color="white" opacity={0.6} />
                                <Circle cx={CENTER_X * 0.7} cy={CENTER_Y * 0.9} r={1} color="white" />
                                <Circle cx={CENTER_X * 1.3} cy={CENTER_Y * 0.55} r={1.5} color="white" opacity={0.5} />
                                <Circle cx={CENTER_X * 0.25} cy={CENTER_Y * 1.4} r={2} color="white" opacity={0.4} />
                                <Circle cx={CENTER_X * 1.7} cy={CENTER_Y * 1.3} r={1} color="white" opacity={0.3} />
                            </Group>

                            {/* Platforms */}
                            {LEVELS.map((level) => (
                                <LandingItem
                                    key={level.id}
                                    level={level}
                                    scrollPos={scrollPos}
                                    time={time}
                                />
                            ))}

                            {/* Stickman */}
                            <SkiaStickman isMoving={isMoving} />

                            {/* Vignette */}
                            <VignetteOverlay />
                        </Group>
                    </Canvas>

                    {/* Label Overlay */}
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        {LEVELS.map((level) => (
                            <LevelOverlayItem
                                key={level.id}
                                level={level}
                                scrollPos={scrollPos}
                                time={time}
                                onPress={handleLevelPress}
                            />
                        ))}
                    </View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    levelLabelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
    },
    levelLabel: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.95)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
        marginBottom: 5,
        textAlign: 'center',
    },
    hitbox: {
        width: 70,
        height: 45,
    }
});
