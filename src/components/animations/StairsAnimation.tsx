import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Path,
    LinearGradient,
    vec,
    Skia,
    Circle,
    Line,
    Group,
    BlurMask,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    useDerivedValue,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    SharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH * 0.95;
const CANVAS_HEIGHT = CANVAS_SIZE * 1.2;

// Stair configuration
const STEP_COUNT = 5;
const STEP_WIDTH = 75;
const STEP_HEIGHT = 32;
const STEP_DEPTH = 18;
const CORNER_RADIUS = 10;

// Isometric offset - diagonal angle matching reference (~45 degrees)
// Steps connect via their 3D depth faces
const STEP_OFFSET_X = 42;  // Horizontal spacing for diagonal angle
const STEP_OFFSET_Y = 36;  // Vertical spacing

// Starting position
const START_X = CANVAS_SIZE * 0.15;
const START_Y = CANVAS_HEIGHT * 0.65;

// Generate step positions
const getStepPosition = (index: number) => {
    'worklet';
    return {
        x: START_X + index * STEP_OFFSET_X,
        y: START_Y - index * STEP_OFFSET_Y,
    };
};

// Step colors (bottom to top)
const STEP_COLORS = [
    { main: '#4ECEF7', light: '#7DDAF9', dark: '#3AB0D8', glow: '#4ECEF7' },
    { main: '#6A7FE8', light: '#8A9AF0', dark: '#5565C0', glow: '#6A7FE8' },
    { main: '#A855D8', light: '#C077E8', dark: '#8840B0', glow: '#A855D8' },
    { main: '#E45590', light: '#F078A8', dark: '#C04070', glow: '#E45590' },
    { main: '#F88050', light: '#FFA070', dark: '#D86838', glow: '#F88050' },
];

// Create main front face (rounded rectangle)
const createMainFacePath = (x: number, y: number) => {
    const path = Skia.Path.Make();
    const w = STEP_WIDTH;
    const h = STEP_HEIGHT;
    const r = CORNER_RADIUS;

    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadTo(x, y, x + r, y);
    path.close();
    return path;
};

// Create top face - full width parallelogram connecting to main face top edge
const createTopFacePath = (x: number, y: number) => {
    const path = Skia.Path.Make();
    const w = STEP_WIDTH;
    const d = STEP_DEPTH;
    const r = CORNER_RADIUS;

    // Start at top-left of main face, go to top-right, then extrude back
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.lineTo(x + w - r + d, y - d * 0.6);
    path.lineTo(x + r + d, y - d * 0.6);
    path.close();
    return path;
};

// Create right face - connects to main face right edge
const createRightFacePath = (x: number, y: number) => {
    const path = Skia.Path.Make();
    const w = STEP_WIDTH;
    const h = STEP_HEIGHT;
    const d = STEP_DEPTH;
    const r = CORNER_RADIUS;

    // Start at main face right edge, extrude back
    path.moveTo(x + w, y + r);
    path.lineTo(x + w + d, y + r - d * 0.6);
    path.lineTo(x + w + d, y + h - r - d * 0.6);
    path.lineTo(x + w, y + h - r);
    path.close();
    return path;
};

// Create corner piece to fill the gap between top and right faces
const createCornerPath = (x: number, y: number) => {
    const path = Skia.Path.Make();
    const w = STEP_WIDTH;
    const d = STEP_DEPTH;
    const r = CORNER_RADIUS;

    // Small triangle/quad that fills the corner
    path.moveTo(x + w - r, y);
    path.lineTo(x + w, y + r);
    path.lineTo(x + w + d, y + r - d * 0.6);
    path.lineTo(x + w - r + d, y - d * 0.6);
    path.close();
    return path;
};

// Glow path
const createGlowPath = (x: number, y: number, expand: number = 12) => {
    const path = Skia.Path.Make();
    const w = STEP_WIDTH + expand * 2;
    const h = STEP_HEIGHT + expand * 2;
    const r = CORNER_RADIUS + expand;
    const ox = x - expand;
    const oy = y - expand;

    path.moveTo(ox + r, oy);
    path.lineTo(ox + w - r, oy);
    path.quadTo(ox + w, oy, ox + w, oy + r);
    path.lineTo(ox + w, oy + h - r);
    path.quadTo(ox + w, oy + h, ox + w - r, oy + h);
    path.lineTo(ox + r, oy + h);
    path.quadTo(ox, oy + h, ox, oy + h - r);
    path.lineTo(ox, oy + r);
    path.quadTo(ox, oy, ox + r, oy);
    path.close();
    return path;
};

interface StickmanProps {
    progress: SharedValue<number>;
    visible?: boolean;
}

const Stickman = ({ progress, visible = true }: StickmanProps) => {
    if (!visible) return null;

    // BIGGER stickman
    const HEAD_RADIUS = 10;
    const BODY_LENGTH = 32;
    const LIMB_LENGTH = 22;

    const stickmanData = useDerivedValue(() => {
        const p = progress.value;
        const currentStep = Math.floor(p);
        const stepProgress = p - currentStep;

        const currentPos = getStepPosition(Math.min(currentStep, STEP_COUNT - 1));
        const nextPos = getStepPosition(Math.min(currentStep + 1, STEP_COUNT - 1));

        const x = interpolate(stepProgress, [0, 1], [currentPos.x, nextPos.x]) + STEP_WIDTH * 0.5;
        const y = interpolate(stepProgress, [0, 1], [currentPos.y, nextPos.y]) - 8;

        const bounce = Math.sin(stepProgress * Math.PI) * 12;
        const finalY = y - bounce;

        const walkCycle = stepProgress * Math.PI * 2;
        const legAngle1 = Math.sin(walkCycle) * 0.5;
        const legAngle2 = Math.sin(walkCycle + Math.PI) * 0.5;
        const armAngle1 = Math.sin(walkCycle + Math.PI) * 0.4;
        const armAngle2 = Math.sin(walkCycle) * 0.4;

        return { x, y: finalY, legAngle1, legAngle2, armAngle1, armAngle2 };
    });

    const headCx = useDerivedValue(() => stickmanData.value.x);
    const headCy = useDerivedValue(() => stickmanData.value.y - BODY_LENGTH - HEAD_RADIUS);
    const bodyStart = useDerivedValue(() => vec(stickmanData.value.x, stickmanData.value.y - BODY_LENGTH));
    const bodyEnd = useDerivedValue(() => vec(stickmanData.value.x, stickmanData.value.y));
    const hipPos = useDerivedValue(() => vec(stickmanData.value.x, stickmanData.value.y));

    const leg1End = useDerivedValue(() => {
        const angle = Math.PI / 2 + stickmanData.value.legAngle1;
        return vec(
            stickmanData.value.x + Math.cos(angle) * LIMB_LENGTH,
            stickmanData.value.y + Math.sin(angle) * LIMB_LENGTH
        );
    });

    const leg2End = useDerivedValue(() => {
        const angle = Math.PI / 2 + stickmanData.value.legAngle2;
        return vec(
            stickmanData.value.x + Math.cos(angle) * LIMB_LENGTH,
            stickmanData.value.y + Math.sin(angle) * LIMB_LENGTH
        );
    });

    const shoulderPos = useDerivedValue(() =>
        vec(stickmanData.value.x, stickmanData.value.y - BODY_LENGTH + 6)
    );

    const arm1End = useDerivedValue(() => {
        const angle = Math.PI / 2 + stickmanData.value.armAngle1;
        return vec(
            stickmanData.value.x + Math.cos(angle) * LIMB_LENGTH * 0.7,
            stickmanData.value.y - BODY_LENGTH + 6 + Math.sin(angle) * LIMB_LENGTH * 0.7
        );
    });

    const arm2End = useDerivedValue(() => {
        const angle = Math.PI / 2 + stickmanData.value.armAngle2;
        return vec(
            stickmanData.value.x + Math.cos(angle) * LIMB_LENGTH * 0.7,
            stickmanData.value.y - BODY_LENGTH + 6 + Math.sin(angle) * LIMB_LENGTH * 0.7
        );
    });

    const stickmanColor = "#1a1a2e";

    return (
        <Group>
            <Circle cx={headCx} cy={headCy} r={HEAD_RADIUS} color={stickmanColor} />
            <Line p1={bodyStart} p2={bodyEnd} color={stickmanColor} strokeWidth={4} />
            <Line p1={hipPos} p2={leg1End} color={stickmanColor} strokeWidth={4} />
            <Line p1={hipPos} p2={leg2End} color={stickmanColor} strokeWidth={4} />
            <Line p1={shoulderPos} p2={arm1End} color={stickmanColor} strokeWidth={4} />
            <Line p1={shoulderPos} p2={arm2End} color={stickmanColor} strokeWidth={4} />
        </Group>
    );
};

interface StairsAnimationProps {
    showStickman?: boolean;
}

export const StairsAnimation: React.FC<StairsAnimationProps> = ({ showStickman = true }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(STEP_COUNT, {
                duration: 4000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    // Pre-generate step data
    const steps = Array.from({ length: STEP_COUNT }, (_, i) => {
        const pos = getStepPosition(i);
        return {
            index: i,
            mainPath: createMainFacePath(pos.x, pos.y),
            topPath: createTopFacePath(pos.x, pos.y),
            rightPath: createRightFacePath(pos.x, pos.y),
            cornerPath: createCornerPath(pos.x, pos.y),
            glowPath: createGlowPath(pos.x, pos.y, 18),
            pos,
            colors: STEP_COLORS[i],
        };
    });

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                {/* Glow layers (rendered first, back to front) */}
                {steps.slice().reverse().map((step) => (
                    <Group key={`glow-${step.index}`}>
                        <Path path={step.glowPath} color={step.colors.glow + '50'}>
                            <BlurMask blur={25} style="normal" />
                        </Path>
                    </Group>
                ))}

                {/* Stairs (back to front for proper overlap) */}
                {steps.slice().reverse().map((step) => {
                    const { colors, pos } = step;

                    return (
                        <Group key={step.index}>
                            {/* Top 3D face */}
                            <Path path={step.topPath}>
                                <LinearGradient
                                    start={vec(pos.x, pos.y - STEP_DEPTH)}
                                    end={vec(pos.x + STEP_WIDTH, pos.y)}
                                    colors={[colors.light, colors.main]}
                                />
                            </Path>

                            {/* Right 3D face */}
                            <Path path={step.rightPath}>
                                <LinearGradient
                                    start={vec(pos.x + STEP_WIDTH, pos.y)}
                                    end={vec(pos.x + STEP_WIDTH + STEP_DEPTH, pos.y + STEP_HEIGHT)}
                                    colors={[colors.main, colors.dark]}
                                />
                            </Path>

                            {/* Corner piece to fill gap */}
                            <Path path={step.cornerPath} color={colors.main} />

                            {/* Main front face */}
                            <Path path={step.mainPath}>
                                <LinearGradient
                                    start={vec(pos.x, pos.y)}
                                    end={vec(pos.x + STEP_WIDTH, pos.y + STEP_HEIGHT)}
                                    colors={[colors.light, colors.main]}
                                />
                            </Path>

                            {/* White outline */}
                            <Path
                                path={step.mainPath}
                                color="rgba(255,255,255,0.9)"
                                style="stroke"
                                strokeWidth={2.5}
                            />
                        </Group>
                    );
                })}

                {/* Stickman */}
                <Stickman progress={progress} visible={showStickman} />
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    canvas: {
        width: CANVAS_SIZE,
        height: CANVAS_HEIGHT,
    },
});

export default StairsAnimation;
