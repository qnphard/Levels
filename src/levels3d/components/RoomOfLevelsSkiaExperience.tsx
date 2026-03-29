import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    PanResponder,
    type LayoutChangeEvent,
} from 'react-native';
import {
    Canvas,
    Circle,
    Group,
    Line,
    LinearGradient,
    Path,
    Oval,
    RoundedRect,
    Skia,
    vec,
} from '@shopify/react-native-skia';
import Animated, {
    Easing,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import RoomWingVideoMenu from './RoomWingVideoMenu';

type Phase = 'atrium' | 'wing';
type WingId = 'lower' | 'higher';

/** Joystick integrates into player position (px/frame at full deflect, scaled by dt). */
const MOVE_SPEED = 3.6;
const STICK_DEADZONE = 0.07;

function clampStick(v: number) {
    return Math.max(-1, Math.min(1, v));
}

function proximity01(dist: number, r0: number, r1: number) {
    if (dist <= r0) return 1;
    if (dist >= r1) return 0;
    const t = (dist - r0) / (r1 - r0);
    const s = 1 - t;
    return s * s * (3 - 2 * s);
}

function WellnessBackdrop({ w, h }: { w: number; h: number }) {
    const cx = w / 2;
    return (
        <Group>
            <RoundedRect x={0} y={0} width={w} height={h} r={0}>
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(w, h)}
                    colors={['#fefce8', '#e0f2fe', '#ecfdf5', '#f5f5f4']}
                />
            </RoundedRect>
            <Group opacity={0.5} blendMode="screen">
                <Circle cx={cx} cy={h * 0.16} r={w * 0.5}>
                    <LinearGradient
                        start={vec(cx - w * 0.2, h * 0.08)}
                        end={vec(cx + w * 0.35, h * 0.42)}
                        colors={['rgba(255,251,235,0.9)', 'rgba(254,243,199,0.35)', 'transparent']}
                    />
                </Circle>
            </Group>
            <Group opacity={0.18}>
                {Array.from({ length: 22 }).map((_, i) => (
                    <Circle
                        key={i}
                        cx={((i * 97) % w) + 10}
                        cy={((i * 53) % (h * 0.82)) + h * 0.06}
                        r={0.5 + (i % 4) * 0.35}
                        color="#a8a29e"
                        opacity={0.1 + (i % 5) * 0.025}
                    />
                ))}
            </Group>
        </Group>
    );
}

function FloorShape({ w, h }: { w: number; h: number }) {
    const floor = Skia.Path.Make();
    const y0 = h * 0.64;
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
                colors={['#e7e5e4', '#d6d3d1', '#c4bbb0']}
            />
        </Path>
    );
}

function NetherPortalSkia({
    cx,
    cy,
    width,
    height,
    cornerR,
    warm,
    accentHex,
    voidPhase,
    rimExtra,
    variant = 'atrium',
}: {
    cx: number;
    cy: number;
    width: number;
    height: number;
    cornerR: number;
    warm: boolean;
    accentHex: string;
    voidPhase: SharedValue<number>;
    rimExtra: number;
    variant?: 'atrium' | 'wing';
}) {
    const x0 = cx - width / 2;
    const y0 = cy - height / 2;
    const inset = Math.max(10, cornerR * 0.85);
    const ix = x0 + inset;
    const iy = y0 + inset;
    const iw = width - inset * 2;
    const ih = height - inset * 2;
    const ir = Math.max(6, cornerR - inset * 0.35);

    const warmColors = ['#3a0d28', '#6b1a5c', '#c2417c', '#fda4af'];
    const coolColors = ['#0c1e2e', '#0e4a5c', '#0d9488', '#7dd3fc'];

    const amp = variant === 'wing' ? 14 : 10;
    const voidTransform = useDerivedValue(() => {
        const t = voidPhase.value;
        const ox = Math.sin(t * Math.PI * 2) * amp;
        const oy = Math.cos(t * Math.PI * 2) * (amp * 0.8);
        return [{ translateX: ox }, { translateY: oy }];
    });

    const voidTransform2 = useDerivedValue(() => {
        const t = voidPhase.value;
        const ox = -Math.sin(t * Math.PI * 2 + 1.1) * (amp * 0.55);
        const oy = Math.sin(t * Math.PI * 2) * (amp * 0.5);
        return [{ translateX: ox }, { translateY: oy }];
    });

    const gradStart = useDerivedValue(() => {
        const t = voidPhase.value;
        return vec(ix + t * 22, iy + (1 - t) * 18);
    });
    const gradEnd = useDerivedValue(() => {
        const t = voidPhase.value;
        return vec(ix + iw - t * 14, iy + ih - (1 - t) * 20);
    });

    const gradStart2 = useDerivedValue(() => {
        const t = voidPhase.value;
        return vec(ix + iw * 0.2 - t * 18, iy + ih * 0.75);
    });
    const gradEnd2 = useDerivedValue(() => {
        const t = voidPhase.value;
        return vec(ix + iw * 0.85, iy + ih * 0.15 + t * 20);
    });

    const sparkOpac = useDerivedValue(() => {
        const t = voidPhase.value;
        return 0.35 + Math.sin(t * Math.PI * 2) * 0.35;
    });

    const baseColors = warm ? warmColors : coolColors;
    const accentTint =
        accentHex.length === 7 ? `${accentHex}99` : accentHex.length === 9 ? accentHex : `${accentHex.slice(0, 7)}99`;
    const c0 = accentTint;
    const c1 = baseColors[1];
    const c2 = baseColors[2];
    const c3 = baseColors[3];

    const rimW = 1.25 + rimExtra * 1.1;

    return (
        <Group>
            <RoundedRect x={x0 - 3} y={y0 - 3} width={width + 6} height={height + 6} r={cornerR + 2} color="rgba(15,10,24,0.45)" />
            <RoundedRect x={x0} y={y0} width={width} height={height} r={cornerR} color="#14101f">
                <LinearGradient
                    start={vec(x0, y0)}
                    end={vec(x0 + width, y0 + height)}
                    colors={['#1a1428', '#0f0a18', '#1a1428']}
                />
            </RoundedRect>
            <Group transform={voidTransform}>
                <RoundedRect x={ix} y={iy} width={iw} height={ih} r={ir}>
                    <LinearGradient start={gradStart} end={gradEnd} colors={[c0, c1, c2, c3]} />
                </RoundedRect>
            </Group>
            {variant === 'wing' && (
                <Group opacity={0.58}>
                    <Group transform={voidTransform2}>
                        <RoundedRect x={ix} y={iy} width={iw} height={ih} r={ir}>
                            <LinearGradient start={gradStart2} end={gradEnd2} colors={[c2, c3, c0]} />
                        </RoundedRect>
                    </Group>
                </Group>
            )}
            {variant === 'wing' && (
                <Group opacity={sparkOpac}>
                    <Circle cx={x0 + cornerR * 0.35} cy={y0 + cornerR * 0.35} r={1.6} color={warm ? '#f9a8d4' : '#7dd3fc'} />
                    <Circle cx={x0 + width - cornerR * 0.35} cy={y0 + cornerR * 0.42} r={1.3} color={warm ? '#e879f9' : '#38bdf8'} />
                    <Circle cx={x0 + width * 0.55} cy={y0 + height - cornerR * 0.28} r={1.5} color={warm ? '#fda4af' : '#5eead4'} />
                    <Circle cx={x0 + width * 0.22} cy={y0 + height - cornerR * 0.32} r={1.2} color={warm ? '#fbcfe8' : '#a5f3fc'} />
                </Group>
            )}
            <RoundedRect
                x={ix + 2}
                y={iy + 2}
                width={iw - 4}
                height={ih - 4}
                r={ir - 1}
                style="stroke"
                strokeWidth={rimW}
                color={warm ? 'rgba(251,113,133,0.55)' : 'rgba(125,211,252,0.5)'}
            />
            <RoundedRect
                x={x0}
                y={y0}
                width={width}
                height={height}
                r={cornerR}
                style="stroke"
                strokeWidth={3 + rimExtra * 0.4}
                color="rgba(30,27,45,0.95)"
            />
        </Group>
    );
}

function RoomStickmanRoam({
    playerX,
    playerY,
    walkT,
    isWalking,
    locomotionPhase,
    isJoystickMoving,
    entrance,
    idlePhase,
}: {
    playerX: SharedValue<number>;
    playerY: SharedValue<number>;
    walkT: SharedValue<number>;
    isWalking: SharedValue<number>;
    locomotionPhase: SharedValue<number>;
    isJoystickMoving: SharedValue<number>;
    entrance: SharedValue<number>;
    idlePhase: SharedValue<number>;
}) {
    const HEAD_RADIUS = 9;
    const BODY_LENGTH = 28;
    const LIMB_LENGTH = 20;
    const color = '#1e293b';

    const pose = useDerivedValue(() => {
        const e = entrance.value;
        const portalStride = isWalking.value > 0.5;
        const joyStride = isJoystickMoving.value > 0.5;
        const moving = portalStride || joyStride;
        const t = portalStride ? walkT.value : locomotionPhase.value;
        const x = playerX.value;
        const y = playerY.value;
        const idleBob = Math.sin(idlePhase.value * Math.PI * 2) * 1.2;
        const bob = moving ? Math.sin(t * Math.PI * 10) * 4 : Math.sin(e * Math.PI) * 1.5 + idleBob;
        const walkCycle = t * Math.PI * 12;
        const leg1 = moving ? Math.sin(walkCycle) * 0.5 : 0.06;
        const leg2 = moving ? Math.sin(walkCycle + Math.PI) * 0.5 : -0.06;
        const arm1 = moving ? Math.sin(walkCycle + Math.PI) * 0.32 : 0.04;
        const arm2 = moving ? Math.sin(walkCycle) * 0.32 : -0.04;
        return { x, y: y - bob, leg1, leg2, arm1, arm2, opacity: e };
    });

    const headCx = useDerivedValue(() => pose.value.x);
    const headCy = useDerivedValue(() => pose.value.y - BODY_LENGTH - HEAD_RADIUS);
    const bodyStart = useDerivedValue(() => vec(pose.value.x, pose.value.y - BODY_LENGTH));
    const bodyEnd = useDerivedValue(() => vec(pose.value.x, pose.value.y));
    const hip = useDerivedValue(() => vec(pose.value.x, pose.value.y));
    const shoulder = useDerivedValue(() => vec(pose.value.x, pose.value.y - BODY_LENGTH + 5));
    const shadowCy = useDerivedValue(() => pose.value.y + 4);
    const shadowRx = useDerivedValue(() => {
        const portalStride = isWalking.value > 0.5;
        const joyStride = isJoystickMoving.value > 0.5;
        const t = portalStride ? walkT.value : locomotionPhase.value;
        const pulse = portalStride || joyStride ? Math.sin(t * Math.PI * 10) * 2 : 0;
        return 15 + pulse;
    });
    const shadowX = useDerivedValue(() => headCx.value - shadowRx.value);
    const shadowY = useDerivedValue(() => shadowCy.value - 5);
    const shadowW = useDerivedValue(() => shadowRx.value * 2);
    const shadowH = useDerivedValue(() => 10);

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
            pose.value.y - BODY_LENGTH + 5 + Math.sin(a) * LIMB_LENGTH * 0.72,
        );
    });
    const arm2End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.arm2;
        return vec(
            pose.value.x + Math.cos(a) * LIMB_LENGTH * 0.72,
            pose.value.y - BODY_LENGTH + 5 + Math.sin(a) * LIMB_LENGTH * 0.72,
        );
    });

    const gOpacity = useDerivedValue(() => pose.value.opacity);

    return (
        <Group opacity={gOpacity}>
            <Oval x={shadowX} y={shadowY} width={shadowW} height={shadowH} color="rgba(30,41,59,0.18)" />
            <Circle cx={headCx} cy={headCy} r={HEAD_RADIUS} color={color} />
            <Line p1={bodyStart} p2={bodyEnd} color={color} strokeWidth={4} />
            <Line p1={hip} p2={leg1End} color={color} strokeWidth={4} />
            <Line p1={hip} p2={leg2End} color={color} strokeWidth={4} />
            <Line p1={shoulder} p2={arm1End} color={color} strokeWidth={4} />
            <Line p1={shoulder} p2={arm2End} color={color} strokeWidth={4} />
        </Group>
    );
}

export default function RoomOfLevelsSkiaExperience({ onSelectLevel }: { onSelectLevel: (levelId: string) => void }) {
    const layoutRef = useRef({ w: 390, h: 844 });
    const [layoutTick, setLayoutTick] = useState(0);
    const w = layoutRef.current.w;
    const h = layoutRef.current.h;

    const onRootLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 1 && height > 1) {
            layoutRef.current = { w: width, h: height };
            setLayoutTick((k) => k + 1);
        }
    }, []);

    const [phase, setPhase] = useState<Phase>('atrium');
    const [wing, setWing] = useState<WingId | null>(null);
    const phaseRef = useRef(phase);
    phaseRef.current = phase;
    const joyPad = useRef({ w: 112, h: 112 });

    const stickRef = useRef({ x: 0, y: 0 });
    const stickUX = useSharedValue(0);
    const stickUY = useSharedValue(0);
    const playerGlowRef = useRef({ px: w / 2, py: h * 0.72 });
    const frameCountRef = useRef(0);
    const locomotionPhase = useSharedValue(0);
    const isJoystickMoving = useSharedValue(0);
    const [glowTick, setGlowTick] = useState(0);

    const voidPhase = useSharedValue(0);
    const playerX = useSharedValue(w / 2);
    const playerY = useSharedValue(h * 0.72);
    const walkT = useSharedValue(0);
    const isWalking = useSharedValue(0);
    const entrance = useSharedValue(0);
    const idlePhase = useSharedValue(0);

    useEffect(() => {
        const { w: lw, h: lh } = layoutRef.current;
        playerX.value = lw / 2;
        playerY.value = lh * 0.72;
        playerGlowRef.current = { px: lw / 2, py: lh * 0.72 };
        setGlowTick((t) => t + 1);
    }, [layoutTick, playerX, playerY]);

    useEffect(() => {
        voidPhase.value = withRepeat(
            withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
    }, [voidPhase]);

    useEffect(() => {
        idlePhase.value = withRepeat(
            withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
    }, [idlePhase]);

    useEffect(() => {
        entrance.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    }, [entrance]);

    useEffect(() => {
        let alive = true;
        let raf = 0;
        const loop = () => {
            if (!alive) return;
            if (phaseRef.current === 'wing') {
                frameCountRef.current += 1;
                if (frameCountRef.current % 5 === 0) {
                    playerGlowRef.current = { px: playerX.value, py: playerY.value };
                    setGlowTick((t) => t + 1);
                }
                raf = requestAnimationFrame(loop);
                return;
            }
            const s = stickRef.current;
            const mag = Math.hypot(s.x, s.y);
            const { w: lw, h: lh } = layoutRef.current;
            if (mag > STICK_DEADZONE) {
                const scale = Math.min(1, (mag - STICK_DEADZONE) / (1 - STICK_DEADZONE));
                const step = MOVE_SPEED * scale;
                let nx = playerX.value + s.x * step;
                let ny = playerY.value + s.y * step;
                nx = Math.max(24, Math.min(lw - 24, nx));
                ny = Math.max(lh * 0.48, Math.min(lh * 0.88, ny));
                playerX.value = nx;
                playerY.value = ny;
                isJoystickMoving.value = 1;
                locomotionPhase.value = (locomotionPhase.value + 0.11 * scale) % 1;
            } else {
                isJoystickMoving.value = 0;
            }

            frameCountRef.current += 1;
            if (frameCountRef.current % 5 === 0) {
                playerGlowRef.current = { px: playerX.value, py: playerY.value };
                setGlowTick((t) => t + 1);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            alive = false;
            cancelAnimationFrame(raf);
        };
    }, [playerX, playerY, locomotionPhase, isJoystickMoving]);


    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderTerminationRequest: () => false,
                onPanResponderGrant: (e) => {
                    const { locationX, locationY } = e.nativeEvent;
                    const cx = joyPad.current.w / 2;
                    const cy = joyPad.current.h / 2;
                    const d = Math.max(joyPad.current.w, joyPad.current.h) * 0.38 || 40;
                    const next = {
                        x: clampStick((locationX - cx) / d),
                        y: clampStick((locationY - cy) / d),
                    };
                    stickRef.current = next;
                    stickUX.value = next.x;
                    stickUY.value = next.y;
                },
                onPanResponderMove: (e) => {
                    const { locationX, locationY } = e.nativeEvent;
                    const cx = joyPad.current.w / 2;
                    const cy = joyPad.current.h / 2;
                    const d = Math.max(joyPad.current.w, joyPad.current.h) * 0.38 || 40;
                    const next = {
                        x: clampStick((locationX - cx) / d),
                        y: clampStick((locationY - cy) / d),
                    };
                    stickRef.current = next;
                    stickUX.value = next.x;
                    stickUY.value = next.y;
                },
                onPanResponderRelease: () => {
                    stickRef.current = { x: 0, y: 0 };
                    stickUX.value = 0;
                    stickUY.value = 0;
                },
                onPanResponderTerminate: () => {
                    stickRef.current = { x: 0, y: 0 };
                    stickUX.value = 0;
                    stickUY.value = 0;
                },
            }),
        [stickUX, stickUY],
    );

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: stickUX.value * 34 }, { translateY: stickUY.value * 34 }],
    }));

    const atriumW = w * 0.42;
    const atriumH = h * 0.42;
    const atriumR = Math.min(28, w * 0.06);
    const leftCx = w * 0.23;
    const leftCy = h * 0.47;
    const rightCx = w * 0.77;
    const rightCy = h * 0.47;

    if (phase === 'wing' && wing) {
        return (
            <View style={styles.root} onLayout={onRootLayout}>
                <RoomWingVideoMenu
                    wing={wing}
                    onSelectLevel={onSelectLevel}
                    onSwitchWing={() => setWing((prev) => (prev === 'lower' ? 'higher' : 'lower'))}
                    onBackToAtrium={() => {
                        setPhase('atrium');
                        setWing(null);
                    }}
                />
            </View>
        );
    }

    return (
        <View style={styles.root} onLayout={onRootLayout}>
            <Canvas style={StyleSheet.absoluteFill} key={`${w}x${h}`}>
                <Group>
                    <WellnessBackdrop w={w} h={h} />
                    <FloorShape w={w} h={h} />
                    {phase === 'atrium' && (
                        <>
                            <NetherPortalSkia
                                cx={leftCx}
                                cy={leftCy}
                                width={atriumW}
                                height={atriumH}
                                cornerR={atriumR}
                                warm
                                accentHex="#be185d"
                                voidPhase={voidPhase}
                                rimExtra={atriumGlow.left * 0.45}
                            />
                            <NetherPortalSkia
                                cx={rightCx}
                                cy={rightCy}
                                width={atriumW}
                                height={atriumH}
                                cornerR={atriumR}
                                warm={false}
                                accentHex="#0e7490"
                                voidPhase={voidPhase}
                                rimExtra={atriumGlow.right * 0.45}
                            />
                        </>
                    )}
                    <RoomStickmanRoam
                        playerX={playerX}
                        playerY={playerY}
                        walkT={walkT}
                        isWalking={isWalking}
                        locomotionPhase={locomotionPhase}
                        isJoystickMoving={isJoystickMoving}
                        entrance={entrance}
                        idlePhase={idlePhase}
                    />
                </Group>
            </Canvas>

            {phase === 'atrium' && (
                <>
                    <Pressable
                        style={[
                            styles.atriumHitLeft,
                            {
                                opacity: 0.04 + 0.96 * (0.68 + 0.32 * atriumGlow.left),
                                transform: [{ scale: 1 + 0.04 * atriumGlow.left }],
                            },
                        ]}
                        onPress={() => {
                            setWing('lower');
                            setPhase('wing');
                        }}
                        accessibilityLabel="Heavier feelings wing"
                    />
                    <Pressable
                        style={[
                            styles.atriumHitRight,
                            {
                                opacity: 0.04 + 0.96 * (0.68 + 0.32 * atriumGlow.right),
                                transform: [{ scale: 1 + 0.04 * atriumGlow.right }],
                            },
                        ]}
                        onPress={() => {
                            setWing('higher');
                            setPhase('wing');
                        }}
                        accessibilityLabel="Lighter ground wing"
                    />
                    <View style={styles.atriumLabels} pointerEvents="box-none">
                        <View style={[styles.doorLabel, styles.doorLabelLeft, styles.doorCardHeavier]}>
                            <Text style={[styles.doorLabelTitle, styles.doorTitleHeavier]}>Heavier feelings</Text>
                            <Text style={[styles.doorLabelSub, styles.doorSubHeavier]}>Joystick to move, or tap a door</Text>
                        </View>
                        <View style={[styles.doorLabel, styles.doorLabelRight, styles.doorCardLighter]}>
                            <Text style={[styles.doorLabelTitle, styles.doorTitleLighter]}>Lighter ground</Text>
                            <Text style={[styles.doorLabelSub, styles.doorSubLighter]}>Joystick to move, or tap a door</Text>
                        </View>
                    </View>
                </>
            )}

            {phase === 'atrium' && (
            <View
                style={styles.joystickWrap}
                pointerEvents="auto"
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    joyPad.current = { w: width, h: height };
                }}
                {...panResponder.panHandlers}
                accessibilityLabel="Virtual joystick"
                accessibilityHint="Drag to move your figure; nearby doors and portals glow"
            >
                <View style={styles.joystickTrack} />
                <Animated.View style={[styles.joystickKnob, knobStyle]} />
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f4f1eb',
        overflow: 'hidden',
    },
    atriumHitLeft: {
        position: 'absolute',
        left: '2%',
        top: '26%',
        width: '42%',
        height: '42%',
        zIndex: 5,
        backgroundColor: 'transparent',
    },
    atriumHitRight: {
        position: 'absolute',
        right: '2%',
        top: '26%',
        width: '42%',
        height: '42%',
        zIndex: 5,
        backgroundColor: 'transparent',
    },
    atriumLabels: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 6,
        pointerEvents: 'box-none',
    },
    doorLabel: {
        position: 'absolute',
        maxWidth: 168,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    doorLabelLeft: { top: '11%', left: '5%' },
    doorLabelRight: { top: '11%', right: '5%', alignItems: 'flex-end' },
    doorCardHeavier: { borderColor: 'rgba(220,38,38,0.45)' },
    doorCardLighter: { borderColor: 'rgba(125,211,252,0.65)' },
    doorLabelTitle: { fontSize: 14, fontWeight: '700' },
    doorLabelSub: { fontSize: 11, marginTop: 3 },
    doorTitleHeavier: { color: '#b91c1c' },
    doorSubHeavier: { color: '#991b1b' },
    doorTitleLighter: { color: '#0ea5e9' },
    doorSubLighter: { color: '#38bdf8' },
    portalHit: {
        position: 'absolute',
        width: 124,
        minHeight: 132,
        alignItems: 'center',
        zIndex: 8,
    },
    portalRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        opacity: 0.35,
    },
    portalDot: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 0,
        borderColor: 'transparent',
        opacity: 0.12,
    },
    portalLabelPill: {
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(15,23,42,0.82)',
        maxWidth: 112,
    },
    portalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#f8fafc',
        textAlign: 'center',
        letterSpacing: 0.12,
        lineHeight: 15,
    },
    joystickWrap: {
        position: 'absolute',
        left: 14,
        bottom: 28,
        width: 112,
        height: 112,
        zIndex: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    joystickTrack: {
        position: 'absolute',
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: 'rgba(15,23,42,0.55)',
        borderWidth: 1,
        borderColor: 'rgba(248,250,252,0.22)',
    },
    joystickKnob: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(248,250,252,0.92)',
        borderWidth: 1,
        borderColor: 'rgba(148,163,184,0.45)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    backWing: {
        position: 'absolute',
        top: 48,
        right: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(15,23,42,0.75)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(248,250,252,0.25)',
        zIndex: 20,
    },
    backWingText: { fontSize: 13, fontWeight: '600', color: '#f8fafc' },
    wingHint: {
        position: 'absolute',
        bottom: 118,
        left: 16,
        right: 16,
        alignItems: 'center',
        zIndex: 20,
    },
    wingHintText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 18,
    },
});
