import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    LayoutChangeEvent,
} from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    vec,
    LinearGradient,
    Group,
    Circle,
    Line,
    RoundedRect,
    RadialGradient,
    Rect,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    withDelay,
    Easing,
    useDerivedValue,
    runOnJS,
    SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ROOM_OF_LEVELS_MENU_LEVELS } from '../../data/roomOfLevelsMenuLevels';

type DoorLayout = {
    cx: number;
    cy: number;
    w: number;
    h: number;
    label: string;
    color: string;
    id: string;
};

function wallPoint(u: number, v: number, w: number, h: number) {
    const topY = h * 0.24;
    const botY = h * 0.68;
    const cx = w / 2;
    const topHalfW = w * 0.36;
    const botHalfW = w * 0.44;
    const topLeft = { x: cx - topHalfW, y: topY };
    const topRight = { x: cx + topHalfW, y: topY };
    const botLeft = { x: cx - botHalfW, y: botY };
    const botRight = { x: cx + botHalfW, y: botY };
    const top = {
        x: topLeft.x + (topRight.x - topLeft.x) * u,
        y: topLeft.y + (topRight.y - topLeft.y) * u,
    };
    const bot = {
        x: botLeft.x + (botRight.x - botLeft.x) * u,
        y: botLeft.y + (botRight.y - botLeft.y) * u,
    };
    return {
        x: top.x + (bot.x - top.x) * v,
        y: top.y + (bot.y - top.y) * v,
    };
}

function buildDoorLayouts(width: number, height: number): DoorLayout[] {
    const cols = 6;
    const rows = 3;
    const layouts: DoorLayout[] = [];
    const levels = ROOM_OF_LEVELS_MENU_LEVELS;
    for (let i = 0; i < levels.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const u = (col + 0.5) / cols;
        const v = 0.1 + ((row + 0.5) / rows) * 0.78;
        const p = wallPoint(u, v, width, height);
        const depthScale = 0.52 + (1 - v) * 0.48;
        const dw = ((width * 0.74) / cols) * depthScale * 0.9;
        const dh = 34 * depthScale;
        layouts.push({
            cx: p.x,
            cy: p.y,
            w: dw,
            h: dh,
            label: levels[i].label,
            color: levels[i].color,
            id: levels[i].id,
        });
    }
    return layouts;
}

const WellnessBackdrop = ({ w, h }: { w: number; h: number }) => {
    const cx = w / 2;
    const cy = h * 0.42;
    return (
        <Group>
            <Rect x={0} y={0} width={w} height={h}>
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(w, h)}
                    colors={['#fefce8', '#e0f2fe', '#ecfdf5', '#f5f5f4']}
                />
            </Rect>
            <Group opacity={0.55} blendMode="screen">
                <Circle cx={cx} cy={h * 0.18} r={w * 0.55}>
                    <RadialGradient
                        c={vec(cx, h * 0.15)}
                        r={w * 0.5}
                        colors={['rgba(255,251,235,0.95)', 'rgba(254,243,199,0.4)', 'transparent']}
                    />
                </Circle>
            </Group>
            <Group opacity={0.2}>
                {Array.from({ length: 18 }).map((_, i) => (
                    <Circle
                        key={i}
                        cx={((i * 97) % w) + 10}
                        cy={((i * 53) % (h * 0.85)) + h * 0.05}
                        r={0.6 + (i % 4) * 0.35}
                        color="#a8a29e"
                        opacity={0.12 + (i % 5) * 0.03}
                    />
                ))}
            </Group>
        </Group>
    );
};

const FloorShape = ({ w, h }: { w: number; h: number }) => {
    const floor = Skia.Path.Make();
    const y0 = h * 0.66;
    const y1 = h * 1.02;
    floor.moveTo(-w * 0.02, y1);
    floor.lineTo(w * 1.02, y1);
    floor.lineTo(w * 0.94, y0);
    floor.lineTo(w * 0.06, y0);
    floor.close();
    return (
        <Path path={floor}>
            <LinearGradient
                start={vec(w * 0.5, y0)}
                end={vec(w * 0.5, y1)}
                colors={['#e7e5e4', '#d6d3d1', '#cfc8c0']}
            />
        </Path>
    );
};

function DoorGraphic({
    layout,
    index,
    openingIndex,
    doorOpen,
    entrance,
}: {
    layout: DoorLayout;
    index: number;
    openingIndex: SharedValue<number>;
    doorOpen: SharedValue<number>;
    entrance: SharedValue<number>;
}) {
    const { cx, cy, w, h, color } = layout;
    const r = 8;

    const openAmt = useDerivedValue(() => {
        if (openingIndex.value !== index) return 0;
        return doorOpen.value;
    });

    const hingeX = cx - w / 2 + r * 0.5;
    const transform = useDerivedValue(() => {
        const o = openAmt.value;
        const ang = o * 0.5;
        return [{ translateX: hingeX }, { rotate: ang }, { translateX: -hingeX }];
    });

    const panelOpacity = useDerivedValue(() => entrance.value);

    const archTop = cy - h / 2 - 6;
    const archW = w + 10;
    const archH = h + 18;

    return (
        <Group opacity={panelOpacity}>
            <RoundedRect
                x={cx - archW / 2}
                y={archTop}
                width={archW}
                height={archH}
                r={r + 4}
                color="rgba(255,255,255,0.35)"
            />
            <Group blendMode="multiply" opacity={0.15}>
                <RoundedRect x={cx - w / 2 - 4} y={cy - h / 2 - 4} width={w + 8} height={h + 8} r={r + 2}>
                    <LinearGradient
                        start={vec(cx - w, cy)}
                        end={vec(cx + w, cy)}
                        colors={[`${color}44`, `${color}22`]}
                    />
                </RoundedRect>
            </Group>
            <Group transform={transform}>
                <RoundedRect x={cx - w / 2} y={cy - h / 2} width={w} height={h} r={r} color="#fffef9" />
                <RoundedRect x={cx - w / 2} y={cy - h / 2} width={w} height={h} r={r} style="stroke" strokeWidth={2} color={`${color}99`} />
            </Group>
        </Group>
    );
}

function RoomStickman({
    walkT,
    fromX,
    fromY,
    toX,
    toY,
    isWalking,
    entrance,
}: {
    walkT: SharedValue<number>;
    fromX: SharedValue<number>;
    fromY: SharedValue<number>;
    toX: SharedValue<number>;
    toY: SharedValue<number>;
    isWalking: SharedValue<number>;
    entrance: SharedValue<number>;
}) {
    const HEAD_RADIUS = 9;
    const BODY_LENGTH = 28;
    const LIMB_LENGTH = 20;
    const color = '#1e293b';

    const pose = useDerivedValue(() => {
        const e = entrance.value;
        const w = isWalking.value;
        const t = walkT.value;
        const x = fromX.value + (toX.value - fromX.value) * t;
        const y = fromY.value + (toY.value - fromY.value) * t;
        const bob = w > 0.5 ? Math.sin(t * Math.PI * 10) * 4 : Math.sin(e * Math.PI) * 1.5;
        const walkCycle = t * Math.PI * 12;
        const leg1 = w > 0.5 ? Math.sin(walkCycle) * 0.5 : 0.06;
        const leg2 = w > 0.5 ? Math.sin(walkCycle + Math.PI) * 0.5 : -0.06;
        const arm1 = w > 0.5 ? Math.sin(walkCycle + Math.PI) * 0.32 : 0.04;
        const arm2 = w > 0.5 ? Math.sin(walkCycle) * 0.32 : -0.04;
        return { x, y: y - bob, leg1, leg2, arm1, arm2, opacity: e };
    });

    const headCx = useDerivedValue(() => pose.value.x);
    const headCy = useDerivedValue(() => pose.value.y - BODY_LENGTH - HEAD_RADIUS);
    const bodyStart = useDerivedValue(() => vec(pose.value.x, pose.value.y - BODY_LENGTH));
    const bodyEnd = useDerivedValue(() => vec(pose.value.x, pose.value.y));
    const hip = useDerivedValue(() => vec(pose.value.x, pose.value.y));
    const shoulder = useDerivedValue(() => vec(pose.value.x, pose.value.y - BODY_LENGTH + 5));

    const leg1End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.leg1;
        return vec(pose.value.x + Math.cos(a) * LIMB_LENGTH, pose.value.y + Math.sin(a) * LIMB_LENGTH);
    });
    const leg2End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.leg2;
        return vec(pose.value.x + Math.cos(a) * LIMB_LENGTH, pose.value.y + Math.sin(a) * LIMB_LENGTH);
    });
    const arm1End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.arm1;
        return vec(
            pose.value.x + Math.cos(a) * LIMB_LENGTH * 0.72,
            pose.value.y - BODY_LENGTH + 5 + Math.sin(a) * LIMB_LENGTH * 0.72
        );
    });
    const arm2End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.arm2;
        return vec(
            pose.value.x + Math.cos(a) * LIMB_LENGTH * 0.72,
            pose.value.y - BODY_LENGTH + 5 + Math.sin(a) * LIMB_LENGTH * 0.72
        );
    });

    const gOpacity = useDerivedValue(() => pose.value.opacity);

    return (
        <Group opacity={gOpacity}>
            <Circle cx={headCx} cy={headCy} r={HEAD_RADIUS} color={color} />
            <Line p1={bodyStart} p2={bodyEnd} color={color} strokeWidth={4} />
            <Line p1={hip} p2={leg1End} color={color} strokeWidth={4} />
            <Line p1={hip} p2={leg2End} color={color} strokeWidth={4} />
            <Line p1={shoulder} p2={arm1End} color={color} strokeWidth={4} />
            <Line p1={shoulder} p2={arm2End} color={color} strokeWidth={4} />
        </Group>
    );
}

export const LevelRoomDoorsMenu: React.FC<{ onSelectSection: (id: string) => void }> = ({
    onSelectSection,
}) => {
    const [layoutSize, setLayoutSize] = useState({ w: 400, h: 800 });
    const [busy, setBusy] = useState(false);

    const onCanvasLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
            setLayoutSize({ w: width, h: height });
        }
    }, []);

    const doorLayouts = useMemo(
        () => buildDoorLayouts(layoutSize.w, layoutSize.h),
        [layoutSize.w, layoutSize.h]
    );

    const entrance = useSharedValue(0);
    const walkT = useSharedValue(0);
    const isWalking = useSharedValue(0);
    const doorOpen = useSharedValue(0);
    const openingIndex = useSharedValue(-1);

    const fromX = useSharedValue(layoutSize.w / 2);
    const fromY = useSharedValue(layoutSize.h * 0.84);
    const toX = useSharedValue(layoutSize.w / 2);
    const toY = useSharedValue(layoutSize.h * 0.84);

    useEffect(() => {
        const cx = layoutSize.w / 2;
        const sy = layoutSize.h * 0.84;
        fromX.value = cx;
        fromY.value = sy;
        toX.value = cx;
        toY.value = sy;
    }, [layoutSize.w, layoutSize.h, fromX, fromY, toX, toY]);

    useEffect(() => {
        entrance.value = withDelay(
            80,
            withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })
        );
    }, [entrance]);

    const finishNavigation = useCallback(
        (levelId: string) => {
            setBusy(false);
            walkT.value = 0;
            isWalking.value = 0;
            doorOpen.value = 0;
            openingIndex.value = -1;
            const cx = layoutSize.w / 2;
            const sy = layoutSize.h * 0.84;
            fromX.value = cx;
            fromY.value = sy;
            toX.value = cx;
            toY.value = sy;
            onSelectSection(levelId);
        },
        [
            onSelectSection,
            walkT,
            isWalking,
            doorOpen,
            openingIndex,
            fromX,
            fromY,
            toX,
            toY,
            layoutSize.w,
            layoutSize.h,
        ]
    );

    const playDoorOpenThenLeave = useCallback(
        (levelId: string) => {
            doorOpen.value = 0;
            doorOpen.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }, (done) => {
                if (done) {
                    runOnJS(finishNavigation)(levelId);
                }
            });
        },
        [doorOpen, finishNavigation]
    );

    const runWalk = useCallback(
        (idx: number) => {
            const layout = doorLayouts[idx];
            if (!layout || busy) return;

            const spawnX = layoutSize.w / 2;
            const spawnY = layoutSize.h * 0.84;
            const endX = layout.cx;
            const endY = layout.cy + layout.h * 0.4;

            fromX.value = spawnX;
            fromY.value = spawnY;
            toX.value = endX;
            toY.value = endY;

            openingIndex.value = idx;
            walkT.value = 0;
            isWalking.value = 1;
            doorOpen.value = 0;

            walkT.value = withTiming(
                1,
                { duration: 1400, easing: Easing.inOut(Easing.cubic) },
                (finished) => {
                    if (finished) {
                        isWalking.value = 0;
                        const id = ROOM_OF_LEVELS_MENU_LEVELS[idx].id;
                        runOnJS(playDoorOpenThenLeave)(id);
                    }
                }
            );
        },
        [busy, doorLayouts, layoutSize.w, layoutSize.h, walkT, isWalking, doorOpen, openingIndex, fromX, fromY, toX, toY, playDoorOpenThenLeave]
    );

    const handlePress = (idx: number) => {
        if (busy) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setBusy(true);
        runWalk(idx);
    };

    const { w: lw, h: lh } = layoutSize;

    return (
        <View style={styles.container}>
            <View style={styles.canvasWrap} onLayout={onCanvasLayout}>
                <Canvas style={styles.canvas}>
                    <WellnessBackdrop w={lw} h={lh} />
                    <FloorShape w={lw} h={lh} />
                    {doorLayouts.map((d, i) => (
                        <DoorGraphic
                            key={d.id}
                            layout={d}
                            index={i}
                            openingIndex={openingIndex}
                            doorOpen={doorOpen}
                            entrance={entrance}
                        />
                    ))}
                    <RoomStickman
                        walkT={walkT}
                        fromX={fromX}
                        fromY={fromY}
                        toX={toX}
                        toY={toY}
                        isWalking={isWalking}
                        entrance={entrance}
                    />
                </Canvas>

                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    {doorLayouts.map((d, i) => (
                        <TouchableOpacity
                            key={d.id}
                            disabled={busy}
                            onPress={() => handlePress(i)}
                            style={[
                                styles.doorHit,
                                {
                                    left: d.cx - Math.max(d.w, 52) / 2,
                                    top: d.cy - 48,
                                    width: Math.max(d.w, 52),
                                    height: 76,
                                },
                            ]}
                            activeOpacity={0.88}
                        >
                            <Text
                                style={[styles.doorLbl, { color: d.id === 'enlightenment' ? '#475569' : d.color }]}
                                numberOfLines={1}
                            >
                                {d.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f1eb' },
    canvasWrap: { flex: 1 },
    canvas: { flex: 1 },
    doorHit: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 4,
    },
    doorLbl: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.2,
        textShadowColor: 'rgba(255,255,255,0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default LevelRoomDoorsMenu;
