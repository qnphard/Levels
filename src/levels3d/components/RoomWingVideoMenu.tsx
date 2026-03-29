import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Platform, type LayoutChangeEvent } from 'react-native';
import { useVideoPlayer, VideoView } from '../../shims/expoVideo';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ROOM_HIGHER_LEVELS,
    ROOM_LOWER_LEVELS,
    type RoomMenuLevel,
} from '../../data/roomOfLevelsMenuLevels';
import {
    HIGHER_WING_LABEL_LAYOUT,
    LOWER_WING_LABEL_LAYOUT,
    type WingLabelSlot,
} from '../config/roomWingVideoLayouts';

type WingId = 'lower' | 'higher';

const VIDEO_LOWER = require('../../../assets/videos/levels-of-force-room.mp4');
const VIDEO_HIGHER = require('../../../assets/videos/power-levels-room.mp4');

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

type WingVideoProps = {
    source: number;
    stageSize: { w: number; h: number };
    onMarkPainted: () => void;
};

/** Separate component so `useVideoPlayer` remounts when `wing` / source changes (key on parent). */
function WingLoopVideo({ source, stageSize, onMarkPainted }: WingVideoProps) {
    const player = useVideoPlayer(source, (p) => {
        p.loop = true;
        p.muted = true;
        p.play();
    });

    return (
        <View
            style={[
                styles.videoSurfaceWrap,
                {
                    width: stageSize.w,
                    height: stageSize.h,
                },
            ]}
            collapsable={false}
        >
            <VideoView
                player={player}
                style={styles.videoFill}
                contentFit="fill"
                nativeControls={false}
                onFirstFrameRender={onMarkPainted}
            />
        </View>
    );
}

export default function RoomWingVideoMenu({ wing, onSelectLevel, onSwitchWing, onBackToAtrium }: Props) {
    const levels: RoomMenuLevel[] = wing === 'lower' ? ROOM_LOWER_LEVELS : ROOM_HIGHER_LEVELS;
    const source = wing === 'lower' ? VIDEO_LOWER : VIDEO_HIGHER;
    const [webFallback] = useState(() => Platform.OS === 'web');
    const [stageSize, setStageSize] = useState<{ w: number; h: number } | null>(null);
    /** Hide native surface until first frame / load — stops squashed-then-snap on Android. */
    const [videoPainted, setVideoPainted] = useState(false);
    const paintFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onStageLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width < 3 || height < 3) return;
        setStageSize((prev) => (prev?.w === width && prev?.h === height ? prev : { w: width, h: height }));
    };

    const stageReady = stageSize != null;

    const clearPaintFallback = () => {
        if (paintFallbackTimerRef.current != null) {
            clearTimeout(paintFallbackTimerRef.current);
            paintFallbackTimerRef.current = null;
        }
    };

    const markVideoPainted = useCallback(() => {
        clearPaintFallback();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setVideoPainted(true));
        });
    }, []);

    useEffect(() => {
        if (webFallback) return;
        setVideoPainted(false);
        clearPaintFallback();
        paintFallbackTimerRef.current = setTimeout(() => {
            paintFallbackTimerRef.current = null;
            setVideoPainted(true);
        }, 450);
        return clearPaintFallback;
    }, [wing, source, webFallback]);

    return (
        <View style={styles.root}>
            <View style={styles.videoStage} onLayout={onStageLayout} collapsable={false}>
                {stageReady && !webFallback ? (
                    <>
                        <WingLoopVideo key={wing} source={source} stageSize={stageSize} onMarkPainted={markVideoPainted} />
                        {!videoPainted ? (
                            <View
                                pointerEvents="none"
                                style={[
                                    styles.videoCover,
                                    {
                                        width: stageSize.w,
                                        height: stageSize.h,
                                    },
                                ]}
                            />
                        ) : null}
                    </>
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

                {levels.map((level) => {
                    const { topPct, leftPct } = layoutForLevel(wing, level.id);
                    return (
                        <Pressable
                            key={level.id}
                            accessibilityLabel={level.label}
                            onPress={() => onSelectLevel(level.id)}
                            style={[
                                styles.labelHit,
                                {
                                    top: `${topPct}%`,
                                    left: `${leftPct}%`,
                                },
                            ]}
                        >
                            <View style={[styles.labelPill, { borderColor: `${level.color}99` }]}>
                                <Text style={styles.labelText} numberOfLines={2}>
                                    {level.label}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
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
        width: '100%',
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    videoSurfaceWrap: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden',
    },
    videoFill: {
        width: '100%',
        height: '100%',
    },
    /** Same color as root — masks decoder until onFirstFrameRender / timeout. */
    videoCover: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 4,
        backgroundColor: '#0f172a',
    },
    labelHit: {
        position: 'absolute',
        zIndex: 10,
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        minWidth: 88,
        maxWidth: 120,
        alignItems: 'center',
    },
    labelPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(15,23,42,0.88)',
        borderWidth: 1,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#f8fafc',
        textAlign: 'center',
        lineHeight: 15,
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
    atriumBtn: {
        position: 'absolute',
        top: 48,
        left: 12,
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
