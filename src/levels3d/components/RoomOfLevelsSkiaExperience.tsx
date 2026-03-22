import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    PanResponder,
    Platform,
    type LayoutChangeEvent,
} from 'react-native';
import { Canvas, Circle, Group, Line, Oval, vec } from '@shopify/react-native-skia';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
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

const VIDEO_ATRIUM = require('../../../assets/videos/power-vs-force-atrium.mp4');

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
    const atriumVideoRef = useRef<Video | null>(null);
    const [webAtriumFallback] = useState(() => Platform.OS === 'web');
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
        if (webAtriumFallback) return;
        atriumVideoRef.current?.playAsync().catch(() => undefined);
    }, [webAtriumFallback]);

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

    const leftCx = w * 0.23;
    const leftCy = h * 0.47;
    const rightCx = w * 0.77;
    const rightCy = h * 0.47;

    const atriumGlow = useMemo(() => {
        const { px, py } = playerGlowRef.current;
        const r0 = Math.min(w, h) * 0.22;
        const r1 = Math.min(w, h) * 0.42;
        const dL = Math.hypot(px - leftCx, py - leftCy);
        const dR = Math.hypot(px - rightCx, py - rightCy);
        return {
            left: proximity01(dL, r0, r1),
            right: proximity01(dR, r0, r1),
        };
    }, [glowTick, w, h, leftCx, leftCy, rightCx, rightCy]);

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
            {!webAtriumFallback ? (
                <Video
                    ref={atriumVideoRef}
                    source={VIDEO_ATRIUM}
                    style={styles.atriumVideo}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    isMuted
                />
            ) : (
                <LinearGradient
                    colors={['#fefce8', '#e0f2fe', '#ecfdf5', '#f5f5f4']}
                    style={styles.atriumVideo}
                />
            )}
            <Canvas style={styles.atriumCanvas} pointerEvents="none" key={`${w}x${h}`}>
                <Group>
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
                            <Text style={[styles.doorLabelSub, styles.doorSubHeavier]}>
                                Joystick to move — doors glow when close, or tap to enter
                            </Text>
                        </View>
                        <View style={[styles.doorLabel, styles.doorLabelRight, styles.doorCardLighter]}>
                            <Text style={[styles.doorLabelTitle, styles.doorTitleLighter]}>Lighter ground</Text>
                            <Text style={[styles.doorLabelSub, styles.doorSubLighter]}>
                                Joystick to move — doors glow when close, or tap to enter
                            </Text>
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
        backgroundColor: '#0f172a',
        overflow: 'hidden',
    },
    atriumVideo: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    atriumCanvas: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        backgroundColor: 'transparent',
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
});
