/**
 * SkiaSpiralImpl - 2.5D implementation of the spiral tower using Skia
 * "Fake 3D" using manual projection for that clean vector look
 */
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    Paint,
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
    BlendMode,
    BlurMask,
    BlurStyle,
    mix,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    useDerivedValue,
    withRepeat,
    withTiming,
    Easing,
    SharedValue,
    useAnimatedStyle,
    runOnJS
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

import { LEVELS, TOTAL_STEPS, LevelNode } from '../levelGraph';
import { SpiralConfig, DEFAULT_SPIRAL, spiralPose } from '../mathSpiral';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// 2.5D projection parameters
const FOCAL_LENGTH = 1000;
const TILT = 0.3; // Tilt down (radians)

// Shared projection logic (reused for both Canvas and UI Overlay)
const useProjection = (
    stepIndex: number,
    scrollPos: SharedValue<number>,
    spiralCfg: SpiralConfig
) => {
    return useDerivedValue(() => {
        const relativeStep = stepIndex - scrollPos.value;

        // Tighter spiral to connect steps
        const customPitch = spiralCfg.pitch * 0.4;
        const customAngle = spiralCfg.stepAngle * 0.6;

        const theta = relativeStep * customAngle;
        const yWorld = relativeStep * customPitch * 60;

        // Helix coordinates
        const r = spiralCfg.radius * 55;
        const x = r * Math.cos(theta + Math.PI / 2);
        const z = r * Math.sin(theta + Math.PI / 2);

        // Apply Tilt
        const yRel = yWorld;
        const yRot = yRel * Math.cos(TILT) - z * Math.sin(TILT);
        const zRot = yRel * Math.sin(TILT) + z * Math.cos(TILT);

        // Project
        const zDepth = zRot + 400;
        const scale = Math.max(0.1, (FOCAL_LENGTH + zRot) / FOCAL_LENGTH);

        const x2d = CENTER_X + x * scale;
        const y2d = CENTER_Y * 1.2 - yRot * scale;

        return {
            x: x2d,
            y: y2d,
            scale: scale,
            opacity: Math.max(0, Math.min(1, scale * scale)),
            zIndex: zRot
        };
    });
};

// Reusing the rich visual style from StairsAnimation (2D Skia)
const STEP_WIDTH = 70;
const STEP_HEIGHT = 28;
const STEP_DEPTH = 16;
const CORNER_RADIUS = 10;

// Pre-defined paths for the "Candy Block" look
const createBlockPaths = () => {
    const main = Skia.Path.Make();
    const top = Skia.Path.Make();
    const side = Skia.Path.Make();

    // Main face (Rounded Rect)
    const w = STEP_WIDTH, h = STEP_HEIGHT, r = CORNER_RADIUS;
    main.addRRect(Skia.RRectXY(Skia.XYWHRect(-w / 2, -h / 2, w, h), r, r));

    // Top face (Extruded back-right)
    const d = STEP_DEPTH;
    const offset = d * 0.7; // Angle offset

    // Top is tricky with rounded corners, simplified "lid"
    // Just drawing a path behind main
    top.moveTo(-w / 2 + r, -h / 2);
    top.lineTo(w / 2 - r, -h / 2);
    top.lineTo(w / 2 - r + offset, -h / 2 - offset);
    top.lineTo(-w / 2 + r + offset, -h / 2 - offset);
    top.close();

    // Right side
    side.moveTo(w / 2, -h / 2 + r);
    side.lineTo(w / 2, h / 2 - r);
    side.lineTo(w / 2 + offset, h / 2 - r - offset);
    side.lineTo(w / 2 + offset, -h / 2 + r - offset);
    side.close();

    return { main, top, side };
};

const BLOCK_PATHS = createBlockPaths();


const LandingItem = ({
    level,
    scrollPos,
    index
}: {
    level: LevelNode,
    scrollPos: SharedValue<number>,
    index: number
}) => {
    const projection = useProjection(level.stepIndex, scrollPos, DEFAULT_SPIRAL);

    // Derived values for "Focus" state
    const visualState = useDerivedValue(() => {
        const { x, y, scale, opacity } = projection.value;
        const dist = Math.abs(level.stepIndex - scrollPos.value);
        const isFocused = dist < 0.8; // Active zone

        // Focus scale boost
        const finalScale = isFocused ? scale * 1.05 : scale;

        // Micro-motion: Float
        // We need a time-based value for float, but passing 'time' prop is heavy if we map it to all?
        // Let's skip float for now to keep perf high, or use a local loop? 
        // Local loop might desync. 
        // Let's implement static focus first.

        return { x, y, scale: finalScale, opacity, isFocused };
    });

    const transform = useDerivedValue(() => [
        { translateX: visualState.value.x },
        { translateY: visualState.value.y },
        { scale: visualState.value.scale },
    ]);

    // Opacity with depth fade + focus boost
    const groupOpacity = useDerivedValue(() => {
        const { opacity, isFocused } = visualState.value;
        return isFocused ? Math.min(1, opacity * 1.5) : opacity;
    });

    // Paints
    const color = useMemo(() => Skia.Color(level.color), [level.color]);

    // 1. Shadow Card Paint
    const paintShadow = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('black'));
        p.setAlphaf(0.3);
        return p;
    }, []);

    // 2. Additive Glow Paint
    // We cannot easily cache the paint if it depends on color, but we can avoid the expensive MaskFilter.
    // Instead we render a Circle with RadialGradient.


    // 3. Crisp Outline Paint
    const paintOutline = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('white'));
        p.setStyle(PaintStyle.Stroke);
        p.setStrokeWidth(2); // Thinner, crisp
        p.setAlphaf(0.9);
        return p;
    }, []);

    const paintMain = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(color);
        return p;
    }, [color]);

    const paintSide = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('black'));
        p.setAlphaf(0.5); // Darker contrast
        return p;
    }, []);

    return (
        <Group transform={transform} opacity={groupOpacity}>
            {/* 1. Shadow Card (Offset down) */}
            <Group transform={[{ translateY: 20 }, { translateX: 10 }]}>
                <Path path={BLOCK_PATHS.main} paint={paintShadow} />
            </Group>

            {/* 2. Additive Glow (Behind) - Pre-calculated Gradient Sprite */}
            <Group blendMode="plus">
                <Circle cx={0} cy={0} r={60} opacity={0.6}>
                    <RadialGradient
                        c={vec(0, 0)}
                        r={60}
                        colors={[level.color, 'transparent']}
                    />
                </Circle>
            </Group>

            {/* 3. Block Geometry */}
            {/* Side */}
            <Path path={BLOCK_PATHS.side} paint={paintSide} />

            {/* Top (Lid) - Whiteish tint */}
            <Path path={BLOCK_PATHS.top} color={level.color} opacity={0.5} />
            <Path path={BLOCK_PATHS.top} color="white" opacity={0.2} />

            {/* Main Face */}
            <Path path={BLOCK_PATHS.main} paint={paintMain}>
                <LinearGradient
                    start={vec(-STEP_WIDTH / 2, -STEP_HEIGHT / 2)}
                    end={vec(STEP_WIDTH / 2, STEP_HEIGHT / 2)}
                    colors={['rgba(255,255,255,0.4)', 'rgba(0,0,0,0.1)']}
                />
            </Path>

            {/* 4. Crisp Outline (Top Face & Main Face edges) */}
            <Path path={BLOCK_PATHS.main} paint={paintOutline} />
            {/* Optional: Outline top for "Rim" feel */}
            <Path path={BLOCK_PATHS.top} style="stroke" strokeWidth={1} color="white" opacity={0.6} />
        </Group>
    );
};
// Add central pillar background
const PillarBackground = () => {
    // Helper for rect path
    const getRectPath = (x: number, y: number, w: number, h: number) => {
        return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    };

    return (
        <Group>
            {/* Main Pillar Cylinder */}
            <Path
                path={getRectPath(CENTER_X - 60, 0, 120, SCREEN_HEIGHT)}
            >
                <LinearGradient
                    start={vec(CENTER_X - 60, 0)}
                    end={vec(CENTER_X + 60, 0)}
                    colors={['#1a1520', '#0a0a12', '#1a1520']}
                />
            </Path>
            {/* Subtle glow lines for structure */}
            <Path
                path={getRectPath(CENTER_X - 40, 0, 2, SCREEN_HEIGHT)}
                color="rgba(255,255,255,0.05)"
            />
            <Path
                path={getRectPath(CENTER_X + 40, 0, 2, SCREEN_HEIGHT)}
                color="rgba(255,255,255,0.05)"
            />
        </Group>
    );
};

// UI Overlay Item (Label + Hitbox)
const LevelOverlayItem = ({
    level,
    scrollPos,
    onPress
}: {
    level: LevelNode,
    scrollPos: SharedValue<number>,
    onPress: (id: string, step: number) => void
}) => {
    // Reusing the same projection logic via hook would be ideal, 
    // but we can just inline the projection usage since useProjectedPoint is locally scoped to LandingItem?
    // Let's refactor usage to use the useProjection shared hook if available, or duplicate slightly for safety.
    // Actually, I'll define useSharedProjection just above.

    // We'll duplicate the projection logic effectively by calling the same math.
    // Ideally we lift useProjectedPoint out.
    // For now, let's just assume we can use `useProjectedPoint` if I move it up?
    // useProjectedPoint is defined at the top of file (renamed to useProjection in my thought, but likely still useProjectedPoint in file?)
    // In file it's `useProjection` at line 45 (I checked the file).

    const projection = useProjection(level.stepIndex, scrollPos, DEFAULT_SPIRAL);

    const style = useAnimatedStyle(() => {
        const { x, y, scale, opacity, zIndex } = projection.value;
        const isVisible = scale > 0.4 && opacity > 0.1;

        return {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [
                { translateX: x - 40 }, // Center the 80px wide view
                { translateY: y - 50 }, // Position above the step
                { scale: scale }
            ],
            opacity: withTiming(isVisible ? opacity : 0, { duration: 100 }),
            zIndex: zIndex
        };
    });

    return (
        <Animated.View style={[style, { pointerEvents: 'box-none' }]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress(level.id, level.stepIndex)}
                style={styles.levelLabelContainer}
            >
                <Text style={[styles.levelLabel, { color: level.color }]}>{level.label}</Text>
                {/* Hitbox area extending down to the step */}
                <View style={styles.hitbox} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Optimized Stickman using Line primitives (no path parsing)
const SkiaStickman = ({ isMoving }: { isMoving: SharedValue<boolean> }) => {
    const time = useSharedValue(0);

    useDerivedValue(() => {
        if (isMoving.value) {
            time.value = withRepeat(withTiming(Math.PI * 2, { duration: 240 }), -1); // Sprint!
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

    // Compute joints in derived value to avoid recreating vector objects?
    // Skia Line props can take vectors.
    // We'll use simple transforms or just derived vectors.

    // Actually, Line takes p1={vec(x,y)} p2={vec(x,y)}.
    // We can define derived values for each point.

    const scale = 1.8;
    const center = vec(CENTER_X + 2, CENTER_Y * 1.2 - 25);

    // Helper calculation inline to avoid worklet scoping issues
    // rootY = center.y - bob + offset
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
        p.setColor(Skia.Color('black'));
        p.setStrokeWidth(5);
        p.setStrokeCap(StrokeCap.Round);
        p.setStrokeJoin(StrokeJoin.Round);
        p.setStyle(PaintStyle.Stroke);
        return p;
    }, []);

    return (
        <Group>
            {/* Torso */}
            <Line p1={pNeck} p2={pHip} paint={paint} />
            {/* Legs */}
            <Line p1={pHip} p2={pLegL} paint={paint} />
            <Line p1={pHip} p2={pLegR} paint={paint} />
            {/* Arms */}
            <Line p1={pShoulder} p2={pArmL} paint={paint} />
            <Line p1={pShoulder} p2={pArmR} paint={paint} />

            {/* Head */}
            <Group transform={headTransform}>
                <Circle cx={0} cy={0} r={11} color="black" />
            </Group>
        </Group>
    );
};

export const SkiaSpiralImpl = () => {
    const scrollPos = useSharedValue(0);
    const isMoving = useSharedValue(false);

    // Interaction Flow
    const handleLevelPress = (id: string, stepIndex: number) => {
        // Animate to the selected level
        isMoving.value = true;

        // Calculate duration based on distance
        const distance = Math.abs(stepIndex - scrollPos.value);

        // "Bigger discrepancy = bigger speed" logic:
        // Use a base time + a sub-linear distance factor.
        // Math.sqrt(distance) ensures that 16 steps don't take 16x time of 1 step.
        // Example: 1 step = 500 + 150 = 650ms
        // 16 steps = 500 + 4*150 = 1100ms (Much faster relative speed)
        const duration = 500 + Math.sqrt(distance) * 150;

        scrollPos.value = withTiming(stepIndex, {
            duration: duration,
            // Exponential easing for snappy start/stop
            easing: Easing.out(Easing.exp),
        }, (finished) => {
            if (finished) {
                isMoving.value = false;
            }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a12' }}>
            <Canvas style={{ flex: 1 }}>
                <Group>
                    {/* 0. Atmosphere Background */}
                    <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
                        <RadialGradient
                            c={vec(CENTER_X, CENTER_Y)}
                            r={SCREEN_WIDTH * 0.8}
                            colors={['#1a1520', '#000000']}
                        />
                    </Rect>

                    {/* 1. Dust Particles (Static for now, can animate if needed) */}
                    {/* Just a few soft circles to break the void */}
                    <Group opacity={0.3}>
                        <Circle cx={CENTER_X * 0.5} cy={CENTER_Y * 0.5} r={2} color="white" />
                        <Circle cx={CENTER_X * 1.5} cy={CENTER_Y * 0.2} r={3} color="white" opacity={0.5} />
                        <Circle cx={CENTER_X * 0.8} cy={CENTER_Y * 0.8} r={1} color="white" />
                        <Circle cx={CENTER_X * 1.2} cy={CENTER_Y * 0.6} r={2} color="white" />
                    </Group>

                    {/* Draw Landings */}
                    {/* We render ALL, but since they are 2D paths, order matters. */}
                    {/* We want back steps first. */}
                    {LEVELS.map((level, i) => (
                        <LandingItem
                            key={level.id}
                            level={level}
                            scrollPos={scrollPos}
                            index={i}
                        />
                    ))}

                    {/* Stickman - Scaled up and black */}
                    <Group transform={[{ scale: 1.5 }, { translateX: -CENTER_X * 0.5 }, { translateY: -CENTER_Y * 0.5 }]}>
                        {/* Scale pivot is 0,0 default, so we need to adjust or just scale path logic? 
                             Easier to scale group but center is tricky. 
                             Actually, let's just adjust the stickman logic to draw bigger. 
                         */}
                    </Group>
                    {/* Retrying approach: Update SkiaStickman component internal logic instead of group transform for cleaner position */}
                    <SkiaStickman isMoving={isMoving} />

                    {/* Vignette Overlay - top and bottom fade to black */}
                    <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.2}>
                        <LinearGradient
                            start={vec(0, 0)}
                            end={vec(0, SCREEN_HEIGHT * 0.2)}
                            colors={['rgba(0,0,0,0.5)', 'transparent']}
                        />
                    </Rect>
                    <Rect x={0} y={SCREEN_HEIGHT * 0.8} width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.2}>
                        <LinearGradient
                            start={vec(0, SCREEN_HEIGHT * 0.8)}
                            end={vec(0, SCREEN_HEIGHT)}
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                        />
                    </Rect>
                </Group>
            </Canvas>

            {/* Overlay Interactables */}
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                {LEVELS.map((level) => (
                    <LevelOverlayItem
                        key={level.id}
                        level={level}
                        scrollPos={scrollPos}
                        onPress={handleLevelPress}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    levelLabelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
    },
    levelLabel: {
        fontSize: 14,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowRadius: 4,
        marginBottom: 5,
        textAlign: 'center',
    },
    hitbox: {
        width: 60,
        height: 40,
    }
});
