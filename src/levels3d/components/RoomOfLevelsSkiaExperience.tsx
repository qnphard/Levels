import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Platform,
    Animated,
    Easing as RNEasing,
    type LayoutChangeEvent,
} from 'react-native';
import { Canvas, Circle, Group, Line, Oval, vec } from '@shopify/react-native-skia';
import { Video, ResizeMode, type VideoReadyForDisplayEvent } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Easing, SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import RoomWingVideoMenu from './RoomWingVideoMenu';

type Phase = 'atrium' | 'wing';
type WingId = 'lower' | 'higher';

/** Atrium-only background (distinct from wing MP4s in `RoomWingVideoMenu`). */
const VIDEO_ATRIUM = require('../../../assets/videos/power-vs-force-atrium.mp4');

/** Match `RoomWingVideoMenu` so wing ↔ atrium feels consistent. */
const ATRIUM_CURTAIN_MIN_MS = 420;
const ATRIUM_CURTAIN_FADE_MS = 560;
const ATRIUM_LABEL_FADE_DELAY_MS = 260;
const ATRIUM_LABEL_FADE_MS = 480;

/** Vertical position of stickman feet (fraction of stage height). */
const STICKMAN_Y_FRAC = 0.78;

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
    entrance,
    idlePhase,
}: {
    playerX: SharedValue<number>;
    playerY: SharedValue<number>;
    walkT: SharedValue<number>;
    isWalking: SharedValue<number>;
    entrance: SharedValue<number>;
    idlePhase: SharedValue<number>;
}) {
    const HEAD_RADIUS = 11;
    const BODY_LENGTH = 34;
    const LIMB_LENGTH = 24;
    const STROKE = 5;
    const color = '#1e293b';

    const pose = useDerivedValue(() => {
        const e = entrance.value;
        const portalStride = isWalking.value > 0.5;
        const moving = portalStride;
        const t = portalStride ? walkT.value : idlePhase.value;
        const x = playerX.value;
        const y = playerY.value;
        const idleBob = Math.sin(idlePhase.value * Math.PI * 2) * 1.4;
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
    const shoulder = useDerivedValue(() => vec(pose.value.x, pose.value.y - BODY_LENGTH + 6));
    const shadowCy = useDerivedValue(() => pose.value.y + 4);
    const shadowRx = useDerivedValue(() => {
        const portalStride = isWalking.value > 0.5;
        const t = portalStride ? walkT.value : idlePhase.value;
        const pulse = portalStride ? Math.sin(t * Math.PI * 10) * 2 : 0;
        return 18 + pulse;
    });
    const shadowX = useDerivedValue(() => headCx.value - shadowRx.value);
    const shadowY = useDerivedValue(() => shadowCy.value - 5);
    const shadowW = useDerivedValue(() => shadowRx.value * 2);
    const shadowH = useDerivedValue(() => 12);

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
            pose.value.y - BODY_LENGTH + 6 + Math.sin(a) * LIMB_LENGTH * 0.72,
        );
    });
    const arm2End = useDerivedValue(() => {
        const a = Math.PI / 2 + pose.value.arm2;
        return vec(
            pose.value.x + Math.cos(a) * LIMB_LENGTH * 0.72,
            pose.value.y - BODY_LENGTH + 6 + Math.sin(a) * LIMB_LENGTH * 0.72,
        );
    });

    const gOpacity = useDerivedValue(() => pose.value.opacity);

    return (
        <Group opacity={gOpacity}>
            <Oval x={shadowX} y={shadowY} width={shadowW} height={shadowH} color="rgba(30,41,59,0.18)" />
            <Circle cx={headCx} cy={headCy} r={HEAD_RADIUS} color={color} />
            <Line p1={bodyStart} p2={bodyEnd} color={color} strokeWidth={STROKE} />
            <Line p1={hip} p2={leg1End} color={color} strokeWidth={STROKE} />
            <Line p1={hip} p2={leg2End} color={color} strokeWidth={STROKE} />
            <Line p1={shoulder} p2={arm1End} color={color} strokeWidth={STROKE} />
            <Line p1={shoulder} p2={arm2End} color={color} strokeWidth={STROKE} />
        </Group>
    );
}

export default function RoomOfLevelsSkiaExperience({ onSelectLevel }: { onSelectLevel: (levelId: string) => void }) {
    const layoutRef = useRef({ w: 390, h: 844 });
    const atriumVideoRef = useRef<Video | null>(null);
    const [webAtriumFallback] = useState(() => Platform.OS === 'web');
    const [layoutTick, setLayoutTick] = useState(0);
    const [atriumStageSize, setAtriumStageSize] = useState<{ w: number; h: number } | null>(null);
    const [atriumNaturalSize, setAtriumNaturalSize] = useState<{ w: number; h: number } | null>(null);

    const onAtriumStageLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width < 3 || height < 3) return;
        layoutRef.current = { w: width, h: height };
        setAtriumStageSize((prev) => (prev?.w === width && prev?.h === height ? prev : { w: width, h: height }));
        setLayoutTick((k) => k + 1);
    }, []);

    const [phase, setPhase] = useState<Phase>('atrium');
    const [wing, setWing] = useState<WingId | null>(null);
    const phaseRef = useRef(phase);
    phaseRef.current = phase;

    const playerGlowRef = useRef({
        px: layoutRef.current.w / 2,
        py: layoutRef.current.h * STICKMAN_Y_FRAC,
    });
    const [glowTick, setGlowTick] = useState(0);

    const playerX = useSharedValue(layoutRef.current.w / 2);
    const playerY = useSharedValue(layoutRef.current.h * STICKMAN_Y_FRAC);
    const walkT = useSharedValue(0);
    const isWalking = useSharedValue(0);
    const entrance = useSharedValue(0);
    const idlePhase = useSharedValue(0);

    useEffect(() => {
        const { w: lw, h: lh } = layoutRef.current;
        const py = lh * STICKMAN_Y_FRAC;
        playerX.value = lw / 2;
        playerY.value = py;
        playerGlowRef.current = { px: lw / 2, py };
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

    const atriumStageReady = atriumStageSize != null;
    const stageW = atriumStageSize?.w ?? 0;
    const stageH = atriumStageSize?.h ?? 0;

    const atriumLoadGenRef = useRef(0);
    const atriumSettledAtRef = useRef(0);
    const atriumRevealAnimRef = useRef<Animated.CompositeAnimation | null>(null);
    const atriumCurtainOpacity = useRef(new Animated.Value(1)).current;
    const atriumLabelsOpacity = useRef(new Animated.Value(0)).current;

    const [atriumMediaReady, setAtriumMediaReady] = useState(false);
    const [atriumCurtainBlocks, setAtriumCurtainBlocks] = useState(true);
    const [atriumLabelsInteractive, setAtriumLabelsInteractive] = useState(false);

    const stopAtriumRevealAnim = useCallback(() => {
        atriumRevealAnimRef.current?.stop?.();
        atriumRevealAnimRef.current = null;
    }, []);

    const markAtriumVideoReady = useCallback(() => {
        const genWhenFired = atriumLoadGenRef.current;
        requestAnimationFrame(() => {
            if (genWhenFired !== atriumLoadGenRef.current) return;
            setAtriumMediaReady(true);
        });
    }, []);

    useLayoutEffect(() => {
        if (phase !== 'atrium') return;
        atriumLoadGenRef.current += 1;
        atriumSettledAtRef.current = Date.now();
        setAtriumMediaReady(false);
        setAtriumCurtainBlocks(true);
        setAtriumLabelsInteractive(false);
        stopAtriumRevealAnim();
        atriumCurtainOpacity.setValue(1);
        atriumLabelsOpacity.setValue(0);
    }, [phase, stopAtriumRevealAnim, atriumCurtainOpacity, atriumLabelsOpacity]);

    const handleAtriumReadyForDisplay = useCallback(
        (event: VideoReadyForDisplayEvent) => {
            if (Platform.OS === 'android') {
                const nw = event.naturalSize?.width ?? 0;
                const nh = event.naturalSize?.height ?? 0;
                if (nw > 0 && nh > 0) {
                    setAtriumNaturalSize((prev) => (prev?.w === nw && prev?.h === nh ? prev : { w: nw, h: nh }));
                }
            }
            markAtriumVideoReady();
        },
        [markAtriumVideoReady],
    );

    useEffect(() => {
        if (phase !== 'atrium' || !webAtriumFallback || !atriumStageReady) return;
        const gen = atriumLoadGenRef.current;
        const t = setTimeout(() => {
            if (gen === atriumLoadGenRef.current) setAtriumMediaReady(true);
        }, 520);
        return () => clearTimeout(t);
    }, [phase, webAtriumFallback, atriumStageReady]);

    useEffect(() => {
        if (phase !== 'atrium') return;
        const gen = atriumLoadGenRef.current;
        const t = setTimeout(() => {
            if (gen !== atriumLoadGenRef.current) return;
            setAtriumMediaReady((r) => (r ? r : true));
        }, 12000);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'atrium' || !atriumMediaReady || !atriumStageReady) return;

        const genAtStart = atriumLoadGenRef.current;
        const elapsed = Date.now() - atriumSettledAtRef.current;
        const holdMs = Math.max(0, ATRIUM_CURTAIN_MIN_MS - elapsed) + 90;

        const holdTimer = setTimeout(() => {
            if (genAtStart !== atriumLoadGenRef.current) return;

            const anim = Animated.parallel([
                Animated.timing(atriumCurtainOpacity, {
                    toValue: 0,
                    duration: ATRIUM_CURTAIN_FADE_MS,
                    easing: RNEasing.bezier(0.22, 1, 0.36, 1),
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(ATRIUM_LABEL_FADE_DELAY_MS),
                    Animated.timing(atriumLabelsOpacity, {
                        toValue: 1,
                        duration: ATRIUM_LABEL_FADE_MS,
                        easing: RNEasing.out(RNEasing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
            ]);

            atriumRevealAnimRef.current = anim;
            anim.start(({ finished }) => {
                atriumRevealAnimRef.current = null;
                if (finished && genAtStart === atriumLoadGenRef.current) {
                    setAtriumCurtainBlocks(false);
                    setAtriumLabelsInteractive(true);
                }
            });
        }, holdMs);

        return () => {
            clearTimeout(holdTimer);
            stopAtriumRevealAnim();
        };
    }, [phase, atriumMediaReady, atriumStageReady, atriumCurtainOpacity, atriumLabelsOpacity, stopAtriumRevealAnim]);

    const useAndroidAtriumStretchFix = Platform.OS === 'android' && stageW > 0 && stageH > 0;
    const atriumFitW =
        useAndroidAtriumStretchFix && atriumNaturalSize && atriumNaturalSize.h > 0
            ? stageH * (atriumNaturalSize.w / atriumNaturalSize.h)
            : stageW;
    const atriumAndroidScaleX =
        useAndroidAtriumStretchFix && atriumFitW > 0 ? stageW / atriumFitW : 1;
    const atriumVideoResizeMode = useAndroidAtriumStretchFix ? ResizeMode.CONTAIN : ResizeMode.STRETCH;

    useEffect(() => {
        if (Platform.OS === 'android') setAtriumNaturalSize(null);
    }, [webAtriumFallback]);

    useEffect(() => {
        if (webAtriumFallback || !atriumStageReady) return;
        const id = requestAnimationFrame(() => {
            atriumVideoRef.current?.playAsync().catch(() => undefined);
        });
        return () => cancelAnimationFrame(id);
    }, [webAtriumFallback, atriumStageReady]);

    const w = layoutRef.current.w;
    const h = layoutRef.current.h;

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
            <View style={styles.root}>
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
        <View style={styles.root}>
            <View style={styles.atriumStage} onLayout={onAtriumStageLayout} collapsable={false}>
                {atriumStageReady && !webAtriumFallback ? (
                    <View
                        style={[
                            styles.videoSurfaceWrap,
                            useAndroidAtriumStretchFix && styles.videoSurfaceWrapAndroid,
                            { width: stageW, height: stageH },
                        ]}
                        collapsable={false}
                    >
                        {useAndroidAtriumStretchFix ? (
                            <View
                                style={[
                                    styles.androidVideoAspectBox,
                                    {
                                        width: atriumFitW,
                                        height: stageH,
                                        ...(atriumAndroidScaleX !== 1 && Number.isFinite(atriumAndroidScaleX)
                                            ? { transform: [{ scaleX: atriumAndroidScaleX }] }
                                            : {}),
                                    },
                                ]}
                                collapsable={false}
                            >
                                <Video
                                    ref={atriumVideoRef}
                                    source={VIDEO_ATRIUM}
                                    style={styles.videoFill}
                                    resizeMode={atriumVideoResizeMode}
                                    isLooping
                                    shouldPlay
                                    isMuted
                                    useNativeControls={false}
                                    onLoad={markAtriumVideoReady}
                                    onReadyForDisplay={handleAtriumReadyForDisplay}
                                />
                            </View>
                        ) : (
                            <Video
                                ref={atriumVideoRef}
                                source={VIDEO_ATRIUM}
                                style={styles.videoFill}
                                resizeMode={atriumVideoResizeMode}
                                isLooping
                                shouldPlay
                                isMuted
                                useNativeControls={false}
                                onLoad={markAtriumVideoReady}
                                onReadyForDisplay={handleAtriumReadyForDisplay}
                            />
                        )}
                    </View>
                ) : null}
                {webAtriumFallback ? (
                    <LinearGradient
                        colors={['#fefce8', '#e0f2fe', '#ecfdf5', '#f5f5f4']}
                        style={StyleSheet.absoluteFill}
                    />
                ) : null}
                <Animated.View
                    pointerEvents={atriumCurtainBlocks ? 'auto' : 'none'}
                    style={[styles.atriumCurtain, { opacity: atriumCurtainOpacity }]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    <LinearGradient
                        colors={['#0f172a', '#1e293b', '#0c1222']}
                        locations={[0, 0.5, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
                <Animated.View
                    style={[styles.atriumRevealContent, { opacity: atriumLabelsOpacity }]}
                    pointerEvents="none"
                >
                    <Canvas style={styles.atriumCanvas} pointerEvents="none" key={`${w}x${h}`}>
                        <Group>
                            <RoomStickmanRoam
                                playerX={playerX}
                                playerY={playerY}
                                walkT={walkT}
                                isWalking={isWalking}
                                entrance={entrance}
                                idlePhase={idlePhase}
                            />
                        </Group>
                    </Canvas>
                </Animated.View>

                {phase === 'atrium' && (
                    <Animated.View
                        style={[styles.atriumInteractiveLayer, { opacity: atriumLabelsOpacity }]}
                        pointerEvents={atriumLabelsInteractive ? 'box-none' : 'none'}
                    >
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
                                    Tap to enter this wing
                                </Text>
                            </View>
                            <View style={[styles.doorLabel, styles.doorLabelRight, styles.doorCardLighter]}>
                                <Text style={[styles.doorLabelTitle, styles.doorTitleLighter]}>Lighter ground</Text>
                                <Text style={[styles.doorLabelSub, styles.doorSubLighter]}>
                                    Tap to enter this wing
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0f172a',
        overflow: 'hidden',
    },
    atriumStage: {
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    videoSurfaceWrap: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden',
        zIndex: 0,
    },
    videoSurfaceWrapAndroid: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    androidVideoAspectBox: {
        overflow: 'hidden',
    },
    videoFill: {
        width: '100%',
        height: '100%',
    },
    atriumCurtain: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 6,
    },
    atriumRevealContent: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 4,
    },
    atriumInteractiveLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    atriumCanvas: {
        ...StyleSheet.absoluteFillObject,
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
    doorLabelLeft: { top: '19%', left: '11%' },
    doorLabelRight: { top: '19%', right: '11%', alignItems: 'flex-end' },
    doorCardHeavier: { borderColor: 'rgba(220,38,38,0.45)' },
    doorCardLighter: { borderColor: 'rgba(125,211,252,0.65)' },
    doorLabelTitle: { fontSize: 14, fontWeight: '700' },
    doorLabelSub: { fontSize: 11, marginTop: 3 },
    doorTitleHeavier: { color: '#b91c1c' },
    doorSubHeavier: { color: '#991b1b' },
    doorTitleLighter: { color: '#0ea5e9' },
    doorSubLighter: { color: '#38bdf8' },
});
