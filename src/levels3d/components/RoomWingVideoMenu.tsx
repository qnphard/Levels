import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Platform,
    Animated,
    Easing,
    type LayoutChangeEvent,
} from 'react-native';
import { Video, ResizeMode, type VideoReadyForDisplayEvent } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { ROOM_LOWER_LEVELS, ROOM_HIGHER_LEVELS, type RoomMenuLevel } from '../../data/roomOfLevelsMenuLevels';
import {
    HIGHER_WING_LABEL_LAYOUT,
    HIGHER_WING_PORTAL_PILL_COLORS,
    LOWER_WING_LABEL_LAYOUT,
    LOWER_WING_PORTAL_PILL_COLORS,
    type WingLabelSlot,
} from '../config/roomWingVideoLayouts';

type WingId = 'lower' | 'higher';

const VIDEO_LOWER = require('../../../assets/videos/levels-of-force-room.mp4');
const VIDEO_HIGHER = require('../../../assets/videos/power-levels-room.mp4');

/** Hides poster-frame / layout pop while the next mp4 decodes; feels intentional rather than broken. */
const WING_CURTAIN_MIN_MS = 420;
const CURTAIN_FADE_MS = 560;
const LABEL_FADE_DELAY_MS = 260;
const LABEL_FADE_MS = 480;

type Props = {
    wing: WingId;
    onSelectLevel: (levelId: string) => void;
    onSwitchWing: () => void;
    onBackToAtrium: () => void;
};

function layoutForLevel(wing: WingId, levelId: string): WingLabelSlot {
    if (wing === 'lower') {
        return LOWER_WING_LABEL_LAYOUT[levelId] ?? { topPct: 22, leftPct: 50 };
    }
    return HIGHER_WING_LABEL_LAYOUT[levelId] ?? { topPct: 22, leftPct: 50 };
}

function wingLabelColor(wing: WingId, level: RoomMenuLevel): string {
    if (wing === 'higher') {
        return HIGHER_WING_PORTAL_PILL_COLORS[level.id] ?? level.color;
    }
    return LOWER_WING_PORTAL_PILL_COLORS[level.id] ?? level.color;
}

/**
 * `ROOM_HIGHER_LEVELS` follows menu slice order (courage, neutrality, willingness, …).
 * Label % positions are keyed for portal order: top row L→R then bottom row L→R — map iteration must match.
 */
const HIGHER_WING_PORTAL_RENDER_ORDER = [
    'courage',
    'willingness',
    'reason',
    'joy',
    'neutrality',
    'acceptance',
    'love',
    'peace',
] as const;

function levelsInPortalOrder(wing: WingId, levels: RoomMenuLevel[]): RoomMenuLevel[] {
    if (wing !== 'higher') return levels;
    const byId = new Map(levels.map((l) => [l.id, l]));
    return HIGHER_WING_PORTAL_RENDER_ORDER.map((id) => byId.get(id)).filter(
        (l): l is RoomMenuLevel => l != null,
    );
}

/**
 * Thin 1px faux stroke (RN has no text stroke). Same ring for both wings; power uses a stronger fill shadow for the bright video.
 */
const WING_LABEL_OUTLINE_OFFSETS: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

function WingLevelOutlinedLabel({ label, color, wing }: { label: string; color: string; wing: WingId }) {
    return (
        <View style={styles.labelOutlineWrap}>
            {WING_LABEL_OUTLINE_OFFSETS.map(([dx, dy], i) => (
                <Text
                    key={i}
                    pointerEvents="none"
                    style={[
                        styles.levelLinkText,
                        styles.labelOutlineLayer,
                        {
                            color: 'rgba(0,0,0,0.82)',
                            transform: [{ translateX: dx }, { translateY: dy }],
                        },
                    ]}
                    numberOfLines={2}
                >
                    {label}
                </Text>
            ))}
            <Text
                style={[
                    styles.levelLinkText,
                    wing === 'higher' ? styles.powerLabelText : styles.forceLabelText,
                    { color },
                ]}
                numberOfLines={2}
            >
                {label}
            </Text>
        </View>
    );
}

export default function RoomWingVideoMenu({ wing, onSelectLevel, onSwitchWing, onBackToAtrium }: Props) {
    const levels: RoomMenuLevel[] = wing === 'lower' ? ROOM_LOWER_LEVELS : ROOM_HIGHER_LEVELS;
    const levelsToRender = levelsInPortalOrder(wing, levels);
    const source = wing === 'lower' ? VIDEO_LOWER : VIDEO_HIGHER;
    const videoRef = useRef<Video | null>(null);
    const [webFallback] = useState(() => Platform.OS === 'web');
    const [stageSize, setStageSize] = useState<{ w: number; h: number } | null>(null);
    /**
     * Android: expo-av maps STRETCH → FIT_XY, but ScaleManager.fitXY() applies setScale(1,1) (no stretch).
     * Use CONTAIN inside an aspect-correct box, then scaleX so the stage width is filled.
     */
    const [naturalVideoSize, setNaturalVideoSize] = useState<{ w: number; h: number } | null>(null);

    const loadGenerationRef = useRef(0);
    const wingSettledAtRef = useRef(0);
    const revealAnimRef = useRef<Animated.CompositeAnimation | null>(null);
    const curtainOpacity = useRef(new Animated.Value(1)).current;
    const labelsOpacity = useRef(new Animated.Value(0)).current;

    const [mediaReady, setMediaReady] = useState(false);
    const [curtainBlocksTouches, setCurtainBlocksTouches] = useState(true);
    const [labelsInteractive, setLabelsInteractive] = useState(false);

    const stopRevealAnim = useCallback(() => {
        revealAnimRef.current?.stop?.();
        revealAnimRef.current = null;
    }, []);

    const markVideoReadyForCurrentWing = useCallback(() => {
        const genWhenFired = loadGenerationRef.current;
        requestAnimationFrame(() => {
            if (genWhenFired !== loadGenerationRef.current) return;
            setMediaReady(true);
        });
    }, []);

    const onStageLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width < 3 || height < 3) return;
        setStageSize((prev) => (prev?.w === width && prev?.h === height ? prev : { w: width, h: height }));
    };

    const stageReady = stageSize != null;
    const stageW = stageSize?.w ?? 0;
    const stageH = stageSize?.h ?? 0;

    useLayoutEffect(() => {
        loadGenerationRef.current += 1;
        wingSettledAtRef.current = Date.now();
        setMediaReady(false);
        setCurtainBlocksTouches(true);
        setLabelsInteractive(false);
        stopRevealAnim();
        curtainOpacity.setValue(1);
        labelsOpacity.setValue(0);
    }, [wing, stopRevealAnim, curtainOpacity, labelsOpacity]);

    useEffect(() => {
        if (Platform.OS === 'android') setNaturalVideoSize(null);
    }, [wing, source]);

    useEffect(() => {
        if (webFallback || !stageReady) return;
        const id = requestAnimationFrame(() => {
            videoRef.current?.playAsync().catch(() => undefined);
        });
        return () => cancelAnimationFrame(id);
    }, [wing, webFallback, source, stageReady]);

    const handleReadyForDisplay = useCallback(
        (event: VideoReadyForDisplayEvent) => {
            if (Platform.OS === 'android') {
                const nw = event.naturalSize?.width ?? 0;
                const nh = event.naturalSize?.height ?? 0;
                if (nw > 0 && nh > 0) {
                    setNaturalVideoSize((prev) => (prev?.w === nw && prev?.h === nh ? prev : { w: nw, h: nh }));
                }
            }
            markVideoReadyForCurrentWing();
        },
        [markVideoReadyForCurrentWing],
    );

    /** Web has no reliable first-frame signal; brief hold still beats labels-before-video. */
    useEffect(() => {
        if (!webFallback || !stageReady) return;
        const gen = loadGenerationRef.current;
        const t = setTimeout(() => {
            if (gen === loadGenerationRef.current) setMediaReady(true);
        }, 520);
        return () => clearTimeout(t);
    }, [webFallback, stageReady, wing]);

    /** If decode never signals (rare), avoid leaving the room stuck behind the curtain. */
    useEffect(() => {
        const gen = loadGenerationRef.current;
        const t = setTimeout(() => {
            if (gen !== loadGenerationRef.current) return;
            setMediaReady((r) => (r ? r : true));
        }, 12000);
        return () => clearTimeout(t);
    }, [wing]);

    useEffect(() => {
        if (!mediaReady || !stageReady) return;

        const genAtStart = loadGenerationRef.current;
        const elapsed = Date.now() - wingSettledAtRef.current;
        const holdMs = Math.max(0, WING_CURTAIN_MIN_MS - elapsed) + 90;

        const holdTimer = setTimeout(() => {
            if (genAtStart !== loadGenerationRef.current) return;

            const anim = Animated.parallel([
                Animated.timing(curtainOpacity, {
                    toValue: 0,
                    duration: CURTAIN_FADE_MS,
                    easing: Easing.bezier(0.22, 1, 0.36, 1),
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(LABEL_FADE_DELAY_MS),
                    Animated.timing(labelsOpacity, {
                        toValue: 1,
                        duration: LABEL_FADE_MS,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
            ]);

            revealAnimRef.current = anim;
            anim.start(({ finished }) => {
                revealAnimRef.current = null;
                if (finished && genAtStart === loadGenerationRef.current) {
                    setCurtainBlocksTouches(false);
                    setLabelsInteractive(true);
                }
            });
        }, holdMs);

        return () => {
            clearTimeout(holdTimer);
            stopRevealAnim();
        };
    }, [mediaReady, stageReady, wing, curtainOpacity, labelsOpacity, stopRevealAnim]);

    const useAndroidStretchFix = Platform.OS === 'android' && stageW > 0 && stageH > 0;
    const fitW =
        useAndroidStretchFix && naturalVideoSize && naturalVideoSize.h > 0
            ? stageH * (naturalVideoSize.w / naturalVideoSize.h)
            : stageW;
    const androidScaleX = useAndroidStretchFix && fitW > 0 ? stageW / fitW : 1;
    const videoResizeMode = useAndroidStretchFix ? ResizeMode.CONTAIN : ResizeMode.STRETCH;

    const labelLayer = levelsToRender.map((level) => {
        const slot = layoutForLevel(wing, level.id);
        const labelColor = wingLabelColor(wing, level);
        return (
            <Pressable
                key={level.id}
                accessibilityLabel={level.label}
                android_ripple={Platform.OS === 'android' ? null : { color: 'rgba(255,255,255,0.12)', borderless: false }}
                onPress={() => onSelectLevel(level.id)}
                style={({ pressed }) => [
                    styles.labelHit,
                    {
                        top: `${slot.topPct}%`,
                        left: `${slot.leftPct}%`,
                        backgroundColor: 'transparent',
                        opacity: Platform.OS === 'android' && pressed ? 0.85 : 1,
                    },
                ]}
            >
                <WingLevelOutlinedLabel label={level.label} color={labelColor} wing={wing} />
            </Pressable>
        );
    });

    return (
        <View style={styles.root}>
            <View style={styles.videoStage} onLayout={onStageLayout} collapsable={false}>
                {stageReady && !webFallback ? (
                    <View
                        style={[
                            styles.videoSurfaceWrap,
                            useAndroidStretchFix && styles.videoSurfaceWrapAndroid,
                            { width: stageW, height: stageH },
                        ]}
                        collapsable={false}
                    >
                        {useAndroidStretchFix ? (
                            <View
                                style={[
                                    styles.androidVideoAspectBox,
                                    {
                                        width: fitW,
                                        height: stageH,
                                        ...(androidScaleX !== 1 && Number.isFinite(androidScaleX)
                                            ? { transform: [{ scaleX: androidScaleX }] }
                                            : {}),
                                    },
                                ]}
                                collapsable={false}
                            >
                                <Video
                                    ref={videoRef}
                                    source={source}
                                    style={styles.videoFill}
                                    resizeMode={videoResizeMode}
                                    isLooping
                                    shouldPlay
                                    isMuted
                                    useNativeControls={false}
                                    onLoad={markVideoReadyForCurrentWing}
                                    onReadyForDisplay={handleReadyForDisplay}
                                />
                            </View>
                        ) : (
                            <Video
                                ref={videoRef}
                                source={source}
                                style={styles.videoFill}
                                resizeMode={videoResizeMode}
                                isLooping
                                shouldPlay
                                isMuted
                                useNativeControls={false}
                                onLoad={markVideoReadyForCurrentWing}
                                onReadyForDisplay={handleReadyForDisplay}
                            />
                        )}
                    </View>
                ) : null}
                {webFallback ? (
                    <LinearGradient
                        colors={
                            wing === 'lower'
                                ? ['#1e1b4b', '#4c1d95', '#0f172a']
                                : ['#e0f2fe', '#fef3c7', '#ecfdf5']
                        }
                        style={StyleSheet.absoluteFill}
                    />
                ) : null}
                <Animated.View
                    pointerEvents={curtainBlocksTouches ? 'auto' : 'none'}
                    style={[styles.wingCurtain, { opacity: curtainOpacity }]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    <LinearGradient
                        colors={
                            wing === 'lower'
                                ? ['#07051a', '#1a0f2e', '#0f172a']
                                : ['#0a1628', '#122a45', '#0f172a']
                        }
                        locations={[0, 0.45, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
                <Animated.View
                    style={[styles.labelLayer, { opacity: labelsOpacity }]}
                    pointerEvents={labelsInteractive ? 'box-none' : 'none'}
                >
                    {labelLayer}
                </Animated.View>
            </View>

            <Pressable style={styles.switchWingBtn} onPress={onSwitchWing} accessibilityLabel="Other wing">
                <Text style={styles.switchWingText}>{wing === 'lower' ? 'Power levels' : 'Force levels'}</Text>
            </Pressable>

            <Pressable style={styles.atriumBtn} onPress={onBackToAtrium} accessibilityLabel="Back to doorway">
                <Text style={styles.atriumText}>{'←'} Atrium</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0f172a',
        overflow: 'hidden',
    },
    videoStage: {
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
    wingCurtain: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 6,
    },
    labelLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    labelHit: {
        position: 'absolute',
        zIndex: 10,
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        minWidth: 72,
        maxWidth: 200,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    labelOutlineWrap: {
        position: 'relative',
        alignSelf: 'center',
        paddingHorizontal: 2,
        paddingVertical: 1,
    },
    labelOutlineLayer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        textAlign: 'center',
        textShadowRadius: 0,
        textShadowOffset: { width: 0, height: 0 },
    },
    /** Stronger than force wing — bright sky/water behind power portals. */
    powerLabelText: {
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.82)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    /** Light edge on fill only; halo comes from the 8 outline copies. */
    forceLabelText: {
        textShadowColor: 'rgba(0,0,0,0.28)',
        textShadowOffset: { width: 0, height: 0.5 },
        textShadowRadius: 1.5,
    },
    levelLinkText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.15,
        textAlign: 'center',
        lineHeight: 17,
        ...Platform.select({
            android: { includeFontPadding: false },
            default: {},
        }),
    },
    switchWingBtn: {
        position: 'absolute',
        top: 48,
        right: 12,
        zIndex: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(15,23,42,0.8)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(248,250,252,0.25)',
    },
    switchWingText: { fontSize: 12, fontWeight: '700', color: '#f8fafc' },
    /** Clears `RoomOfLevels2Screen` close chip (left ~20, width 44). */
    atriumBtn: {
        position: 'absolute',
        top: 48,
        left: 78,
        zIndex: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(148,163,184,0.4)',
    },
    atriumText: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
});
