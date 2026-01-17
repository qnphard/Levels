import React, { useMemo, useEffect } from 'react';
import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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

// --- Atmosphere Background ---
const AtmosphereBackground = () => (
    <Group>
        {/* Radial gradient background */}
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
            <RadialGradient
                c={vec(CENTER_X, CENTER_Y)}
                r={SCREEN_WIDTH * 0.9}
                colors={['#1a1520', '#0a0a12', '#000000']}
            />
        </Rect>

        {/* Dust particles */}
        <Group opacity={0.25}>
            <Circle cx={CENTER_X * 0.3} cy={CENTER_Y * 0.4} r={1.5} color="white" />
            <Circle cx={CENTER_X * 1.7} cy={CENTER_Y * 0.3} r={2} color="white" opacity={0.6} />
            <Circle cx={CENTER_X * 0.6} cy={CENTER_Y * 1.5} r={1} color="white" />
            <Circle cx={CENTER_X * 1.4} cy={CENTER_Y * 0.8} r={1.5} color="white" opacity={0.5} />
            <Circle cx={CENTER_X * 0.2} cy={CENTER_Y * 1.2} r={2} color="white" opacity={0.4} />
        </Group>
    </Group>
);

// --- Static Stickman ---
const SkiaStickman = () => {
    const scale = 2.4;
    const center = vec(CENTER_X, (CENTER_Y * 1.2) - 40);

    const paint = useMemo(() => {
        const p = Skia.Paint();
        p.setColor(Skia.Color('white'));
        p.setStrokeWidth(7);
        p.setStrokeCap(StrokeCap.Round);
        p.setStyle(PaintStyle.Stroke);
        return p;
    }, []);

    const baseY = center.y + (50 * (1 - scale));
    return (
        <Group>
            <Line p1={vec(center.x, baseY)} p2={vec(center.x, baseY + 25 * scale)} paint={paint} />
            <Line p1={vec(center.x, baseY + 25 * scale)} p2={vec(center.x - 8 * scale, baseY + 48 * scale)} paint={paint} />
            <Line p1={vec(center.x, baseY + 25 * scale)} p2={vec(center.x + 8 * scale, baseY + 48 * scale)} paint={paint} />
            <Line p1={vec(center.x, baseY + 6 * scale)} p2={vec(center.x - 11 * scale, baseY + 21 * scale)} paint={paint} />
            <Line p1={vec(center.x, baseY + 6 * scale)} p2={vec(center.x + 11 * scale, baseY + 21 * scale)} paint={paint} />
            <Circle cx={center.x} cy={baseY - 7 * scale} r={13} color="white" />
        </Group>
    );
};

// --- Landing Item with Focus Highlight ---
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
        const focusScale = focus < 0.5 ? 1.1 : 1;
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
        return focus < 0.5 ? 95 : 75;
    });

    const glowOpacity = useDerivedValue(() => {
        const { focus } = projection.value;
        return focus < 0.5 ? 0.8 : 0.5;
    });

    return (
        <Group transform={transform} opacity={opacity}>
            {/* Enhanced glow for focused step */}
            <Group blendMode="plus">
                <Circle cx={0} cy={0} r={glowRadius} opacity={glowOpacity}>
                    <RadialGradient c={vec(0, 0)} r={95} colors={[color, 'transparent']} />
                </Circle>
            </Group>

            {/* Focus ring for active step */}
            <Circle
                cx={0}
                cy={0}
                r={50}
                style="stroke"
                strokeWidth={2}
                color="white"
                opacity={useDerivedValue(() => projection.value.focus < 0.5 ? 0.3 : 0)}
            />

            <Path path={BLOCK_PATHS.side} color="black" opacity={0.5} />
            <Path path={BLOCK_PATHS.top} color={color} opacity={0.4} />
            <Path path={BLOCK_PATHS.main} color={color}>
                <LinearGradient
                    start={vec(-40, -15)} end={vec(40, 15)}
                    colors={['rgba(255,255,255,0.4)', 'rgba(0,0,0,0.1)']}
                />
            </Path>
            <Path path={BLOCK_PATHS.main} style="stroke" strokeWidth={2} color="white" opacity={0.7} />
        </Group>
    );
};

const SECTIONS = [
    { id: 'feltSense', label: 'Felt Sense', color: '#F43F5E' },
    { id: 'purpose', label: 'Purpose', color: '#10B981' },
    { id: 'traps', label: 'Traps', color: '#F59E0B' },
    { id: 'exits', label: 'Exits', color: '#3B82F6' },
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

    const handlePress = (idx: number) => {
        // Haptic feedback on selection
        triggerHaptic();

        scrollPos.value = withTiming(idx, { duration: 750, easing: Easing.out(Easing.exp) }, (done) => {
            if (done) runOnJS(onSelectSection)(SECTIONS[idx].id);
        });
    };

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {/* Atmosphere */}
                <AtmosphereBackground />

                {/* Steps with entrance animation */}
                {SECTIONS.map((s, i) => (
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
                {SECTIONS.map((s, i) => (
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
