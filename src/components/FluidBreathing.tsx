import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, typography, spacing, borderRadius } from '../theme/colors';
import { breathPulse } from '../utils/haptics';
import { playBreathCue } from '../utils/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;

interface FluidBreathingProps {
    inhaleDuration?: number;
    holdInDuration?: number;
    exhaleDuration?: number;
    holdOutDuration?: number;
    autoStart?: boolean;
    enableAudio?: boolean;
}

type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Ready';

export default function FluidBreathing({
    inhaleDuration = 4000,
    holdInDuration = 4000,
    exhaleDuration = 4000,
    holdOutDuration = 4000,
    autoStart = true,
    enableAudio = false,
}: FluidBreathingProps) {
    const theme = useThemeColors();
    const [phase, setPhase] = useState<BreathingPhase>('Ready');
    const [nextPhase, setNextPhase] = useState<BreathingPhase>('Inhale');

    const progress = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.3);

    const updatePhase = (newPhase: BreathingPhase) => {
        setPhase(newPhase);
        breathPulse(); // Haptic feedback at each transition

        // Audio cue for breathing phase
        if (enableAudio && newPhase !== 'Ready') {
            const audioCue = newPhase === 'Inhale' ? 'inhale' : newPhase === 'Exhale' ? 'exhale' : 'hold';
            playBreathCue(audioCue);
        }

        if (newPhase === 'Inhale') setNextPhase('Hold');
        else if (newPhase === 'Hold' && phase === 'Inhale') setNextPhase('Exhale');
        else if (newPhase === 'Exhale') setNextPhase('Hold');
        else if (newPhase === 'Hold' && phase === 'Exhale') setNextPhase('Inhale');
    };

    useEffect(() => {
        if (autoStart) {
            setPhase('Inhale');
            setNextPhase('Hold');

            const startCycle = () => {
                // Inhale
                scale.value = withTiming(1.6, { duration: inhaleDuration, easing: Easing.bezier(0.42, 0, 0.58, 1) }, (f) => {
                    if (f) {
                        runOnJS(updatePhase)('Hold');
                        // Hold In
                        scale.value = withTiming(1.6, { duration: holdInDuration }, (f2) => {
                            if (f2) {
                                runOnJS(updatePhase)('Exhale');
                                // Exhale
                                scale.value = withTiming(1.0, { duration: exhaleDuration, easing: Easing.bezier(0.42, 0, 0.58, 1) }, (f3) => {
                                    if (f3) {
                                        runOnJS(updatePhase)('Hold');
                                        // Hold Out
                                        scale.value = withTiming(1.0, { duration: holdOutDuration }, (f4) => {
                                            if (f4) {
                                                runOnJS(updatePhase)('Inhale');
                                                runOnJS(startCycle)();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                opacity.value = withSequence(
                    withTiming(0.9, { duration: inhaleDuration }),
                    withTiming(0.9, { duration: holdInDuration }),
                    withTiming(0.4, { duration: exhaleDuration }),
                    withTiming(0.4, { duration: holdOutDuration })
                );
            };

            startCycle();
        }
    }, [autoStart]);

    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    const ringScale1 = useSharedValue(1);
    const ringOpacity1 = useSharedValue(0);

    useEffect(() => {
        ringScale1.value = withRepeat(
            withTiming(2.5, { duration: 3000, easing: Easing.out(Easing.quad) }),
            -1,
            false
        );
        ringOpacity1.value = withRepeat(
            withSequence(
                withTiming(0.4, { duration: 500 }),
                withTiming(0, { duration: 2500 })
            ),
            -1,
            false
        );
    }, []);

    const ringStyle1 = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale1.value }],
        opacity: ringOpacity1.value,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.centerStage}>
                {/* Background Glows */}
                <Animated.View style={[styles.ring, ringStyle1, { borderColor: theme.primary }]} />

                {/* Main Breathing Circle */}
                <Animated.View style={[styles.breathingCircle, animatedCircleStyle]}>
                    <LinearGradient
                        colors={[theme.primary, theme.primarySubtle]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </Animated.View>

                {/* Text Overlay */}
                <View style={styles.textContainer}>
                    <Text style={[styles.phaseText, { color: '#FFF' }]}>{phase}</Text>
                    <Text style={[styles.instructionText, { color: 'rgba(255,255,255,0.7)' }]}>
                        {phase === 'Inhale' ? 'Expansion' :
                            phase === 'Exhale' ? 'Release' :
                                'Stillness'}
                    </Text>
                </View>
            </View>

            {/* Progress Indicators */}
            <View style={styles.footer}>
                <View style={[styles.phaseIndicator, phase === 'Inhale' && { backgroundColor: theme.primary }]} />
                <View style={[styles.phaseIndicator, phase === 'Hold' && nextPhase === 'Exhale' && { backgroundColor: theme.primary }]} />
                <View style={[styles.phaseIndicator, phase === 'Exhale' && { backgroundColor: theme.primary }]} />
                <View style={[styles.phaseIndicator, phase === 'Hold' && nextPhase === 'Inhale' && { backgroundColor: theme.primary }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        width: '100%',
    },
    centerStage: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breathingCircle: {
        width: CIRCLE_SIZE * 0.5,
        height: CIRCLE_SIZE * 0.5,
        borderRadius: (CIRCLE_SIZE * 0.5) / 2,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: 'rgba(139, 92, 246, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    ring: {
        position: 'absolute',
        width: CIRCLE_SIZE * 0.5,
        height: CIRCLE_SIZE * 0.5,
        borderRadius: (CIRCLE_SIZE * 0.5) / 2,
        borderWidth: 2,
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    phaseText: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 2,
    },
    instructionText: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 60,
        gap: spacing.md,
    },
    phaseIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});
