import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { AVPlaybackStatus } from 'expo-av';
import type { Video } from 'expo-av';

/**
 * expo-av does not support negative playback rates, so "reverse" uses periodic seeks.
 * Forward plays normally; near the end we pause and step backward; at the start we play forward again.
 */
const END_EPS_MS = 160;
const START_EPS_MS = 50;
const REVERSE_STEP_MS = 48;
const REVERSE_TICK_MS = 34;

type Params = {
    videoRef: RefObject<Video | null>;
    enabled: boolean;
    /** Change when the clip changes (e.g. wing id) to reset state. */
    resetKey?: string | number;
};

export function usePingPongVideoLoop({ videoRef, enabled, resetKey = 0 }: Params) {
    const directionRef = useRef<'forward' | 'reverse'>('forward');
    const reverseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const endHandledRef = useRef(false);
    const reverseBusyRef = useRef(false);

    const clearReverseTimer = useCallback(() => {
        if (reverseTimerRef.current != null) {
            clearInterval(reverseTimerRef.current);
            reverseTimerRef.current = null;
        }
    }, []);

    const startReverse = useCallback(() => {
        if (reverseTimerRef.current != null) return;
        reverseTimerRef.current = setInterval(() => {
            if (reverseBusyRef.current) return;
            const v = videoRef.current;
            if (!v) {
                clearReverseTimer();
                return;
            }
            reverseBusyRef.current = true;
            void (async () => {
                try {
                    const s = await v.getStatusAsync();
                    if (!s.isLoaded) return;
                    const next = s.positionMillis - REVERSE_STEP_MS;
                    if (next <= START_EPS_MS) {
                        clearReverseTimer();
                        directionRef.current = 'forward';
                        endHandledRef.current = false;
                        await v.setStatusAsync({ positionMillis: 0, shouldPlay: true, rate: 1 });
                    } else {
                        await v.setStatusAsync({
                            positionMillis: Math.max(0, next),
                            shouldPlay: false,
                        });
                    }
                } catch {
                    clearReverseTimer();
                    directionRef.current = 'forward';
                    endHandledRef.current = false;
                } finally {
                    reverseBusyRef.current = false;
                }
            })();
        }, REVERSE_TICK_MS);
    }, [clearReverseTimer, videoRef]);

    const onPlaybackStatusUpdate = useCallback(
        (status: AVPlaybackStatus) => {
            if (!enabled) return;
            if (!status.isLoaded) return;
            if (directionRef.current !== 'forward') return;
            if (endHandledRef.current) return;

            const d = status.durationMillis;
            if (d == null || d <= 0) return;

            const nearEnd = status.isPlaying && status.positionMillis >= d - END_EPS_MS;
            const finished = status.didJustFinish === true;

            if (nearEnd || finished) {
                endHandledRef.current = true;
                directionRef.current = 'reverse';
                void videoRef.current
                    ?.setStatusAsync({ shouldPlay: false })
                    .then(() => startReverse())
                    .catch(() => {
                        endHandledRef.current = false;
                        directionRef.current = 'forward';
                    });
            }
        },
        [enabled, startReverse, videoRef],
    );

    useEffect(() => {
        directionRef.current = 'forward';
        endHandledRef.current = false;
        reverseBusyRef.current = false;
        clearReverseTimer();
    }, [resetKey, clearReverseTimer]);

    useEffect(() => () => clearReverseTimer(), [clearReverseTimer]);

    return { onPlaybackStatusUpdate };
}
