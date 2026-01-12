import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import PracticeSelector, {
    Practice,
    PRACTICES
} from '../../components/PracticeSelector';
import useTickSound from '../../hooks/useTickSound';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'FirstBreath'>;

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'steady' | 'shaking';

const FirstBreathScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const isFocused = useIsFocused();
    const { playTick } = useTickSound();
    const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
    const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
    const [showingDetail, setShowingDetail] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [phase, setPhase] = useState<BreathPhase>('inhale');
    const [isActive, setIsActive] = useState(false);

    const circleScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Reset state when returning to screen after a finished exercise
    useEffect(() => {
        if (isFocused && timeLeft === 0) {
            setSelectedPractice(null);
            setShowingDetail(false);
            setIsActive(false);
            setTimeLeft(60);
        }
    }, [isFocused, timeLeft]);

    // Get phase display text
    const getPhaseText = useCallback((currentPhase: BreathPhase): string => {
        if (!selectedPractice) return '';
        if (selectedPractice.type === 'technique') return selectedPractice.instruction;

        switch (currentPhase) {
            case 'inhale': return 'Breathe in...';
            case 'holdIn': return 'Hold air in...';
            case 'exhale': return 'Breathe out...';
            case 'holdOut': return 'Hold...';
            default: return '';
        }
    }, [selectedPractice]);

    // Navigation when time is up
    useEffect(() => {
        if (timeLeft === 0) {
            navigation.navigate('Landing');
        }
    }, [timeLeft, navigation]);

    // Animation and phase cycling logic
    useEffect(() => {
        if (!isActive || !selectedPractice) return;

        // --- Countdown ---
        const countdownInterval = setInterval(() => {
            setTimeLeft((t) => {
                if (t > 0) {
                    playTick();
                    return t - 1;
                }
                return 0;
            });
        }, 1000);

        // --- Handle Breathing Exercises ---
        if (selectedPractice.type === 'breathing' && selectedPractice.pattern) {
            const { pattern } = selectedPractice;

            // Animation sequence
            const durations: number[] = [];
            const scales: number[] = [];
            durations.push(pattern.inhale * 1000); scales.push(1.6);
            if (pattern.holdIn) { durations.push(pattern.holdIn * 1000); scales.push(1.6); }
            durations.push(pattern.exhale * 1000); scales.push(1);
            if (pattern.holdOut) { durations.push(pattern.holdOut * 1000); scales.push(1); }

            const sequence = durations.map((duration, i) =>
                withTiming(scales[i], { duration, easing: Easing.inOut(Easing.ease) })
            );
            circleScale.value = withRepeat(withSequence(...sequence), -1, false);

            // Phase cycling
            const phases: BreathPhase[] = ['inhale'];
            const phaseDurations: number[] = [pattern.inhale * 1000];
            if (pattern.holdIn) { phases.push('holdIn'); phaseDurations.push(pattern.holdIn * 1000); }
            phases.push('exhale'); phaseDurations.push(pattern.exhale * 1000);
            if (pattern.holdOut) { phases.push('holdOut'); phaseDurations.push(pattern.holdOut * 1000); }

            let phaseIndex = 0;
            setPhase(phases[0]);

            let currentTimeout: NodeJS.Timeout;
            const scheduleNextPhase = (index: number) => {
                currentTimeout = setTimeout(() => {
                    const nextIndex = (index + 1) % phases.length;
                    setPhase(phases[nextIndex]);
                    scheduleNextPhase(nextIndex);
                }, phaseDurations[index]);
            };
            scheduleNextPhase(0);

            return () => {
                clearInterval(countdownInterval);
                clearTimeout(currentTimeout);
                cancelAnimation(circleScale);
                circleScale.value = 1;
            };
        }

        // --- Handle Techniques ---
        if (selectedPractice.type === 'technique') {
            if (selectedPractice.id === 'shaking') {
                setPhase('shaking');
                // Chaotic jitter animation
                translateX.value = withRepeat(
                    withSequence(
                        withTiming(6, { duration: 50 }),
                        withTiming(-6, { duration: 50 }),
                        withTiming(4, { duration: 50 }),
                        withTiming(-4, { duration: 50 })
                    ),
                    -1,
                    false
                );
                translateY.value = withRepeat(
                    withSequence(
                        withTiming(-4, { duration: 40 }),
                        withTiming(4, { duration: 40 }),
                        withTiming(-2, { duration: 40 }),
                        withTiming(2, { duration: 40 })
                    ),
                    -1,
                    false
                );
                circleScale.value = withRepeat(
                    withSequence(
                        withTiming(1.1, { duration: 200 }),
                        withTiming(1.0, { duration: 200 })
                    ),
                    -1,
                    true
                );
            } else if (selectedPractice.id === 'eyes') {
                setPhase('steady');
                // Very slow, subtle pulse for eyes focal point
                circleScale.value = withRepeat(
                    withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    -1,
                    true
                );
            } else if (selectedPractice.id === 'letting-go-basic') {
                setPhase('steady');
                // Slow, soft pulse for core letting go
                circleScale.value = withRepeat(
                    withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                    -1,
                    true
                );
            }

            return () => {
                clearInterval(countdownInterval);
                cancelAnimation(circleScale);
                cancelAnimation(translateX);
                cancelAnimation(translateY);
                circleScale.value = 1;
                translateX.value = 0;
                translateY.value = 0;
            };
        }

    }, [isActive, selectedPractice]);

    const handleSelectPractice = (practice: Practice) => {
        setSelectedPractice(practice);
        setShowingDetail(true);
    };

    const handleStartPractice = () => {
        if (!selectedPractice) return;
        setTimeLeft(selectedPractice.totalDuration);
        setShowingDetail(false);
        setIsActive(true);
    };

    const handleBackToSelector = () => {
        setSelectedPractice(null);
        setShowingDetail(false);
    };

    const handleSkip = () => {
        // Skip practice entirely - complete onboarding and go to main app
        completeOnboarding();
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        );
    };

    const circleStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: circleScale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
    }));

    if (!selectedPractice) {
        return (
            <PracticeSelector
                onSelect={handleSelectPractice}
                onSkip={handleSkip}
            />
        );
    }

    if (showingDetail) {
        return (
            <View style={styles.detailContainer}>
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={handleBackToSelector}>
                        <Ionicons name="chevron-back" size={24} color="#f0f0f5" />
                    </TouchableOpacity>
                    <Text style={styles.detailTitle}>{selectedPractice.name}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.detailIconContainer}>
                        <Ionicons
                            name={selectedPractice.icon}
                            size={48}
                            color={selectedPractice.type === 'breathing' ? "#A78BFA" : "#F472B6"}
                        />
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.detailSectionTitle}>The Practice</Text>
                        <Text style={styles.detailText}>{selectedPractice.explanation}</Text>
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.detailSectionTitle}>Instructions</Text>
                        <Text style={styles.detailText}>{selectedPractice.instruction}</Text>
                    </View>

                    <View style={styles.detailTags}>
                        <View style={styles.detailTag}>
                            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.detailTagText}>{selectedPractice.totalDuration}s Session</Text>
                        </View>
                        <View style={styles.detailTag}>
                            <Ionicons name="sparkles-outline" size={14} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.detailTagText}>{selectedPractice.bestFor}</Text>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[
                        styles.startButton,
                        { backgroundColor: selectedPractice.type === 'breathing' ? "#7C3AED" : "#DB2777" }
                    ]}
                    onPress={handleStartPractice}
                >
                    <Text style={styles.startButtonText}>Start Practice</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isTechnique = selectedPractice.type === 'technique';
    const accentColor = isTechnique ? 'rgba(244, 114, 182, 0.3)' : 'rgba(167, 139, 250, 0.3)';
    const innerAccentColor = isTechnique ? 'rgba(244, 114, 182, 0.6)' : 'rgba(167, 139, 250, 0.6)';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{selectedPractice.name}</Text>
            <Text style={styles.instruction}>{getPhaseText(phase)}</Text>

            <View style={styles.circleContainer}>
                <Animated.View style={[
                    styles.circle,
                    { backgroundColor: accentColor },
                    circleStyle
                ]}>
                    <View style={[styles.innerCircle, { backgroundColor: innerAccentColor }]} />
                </Animated.View>
            </View>

            <Text style={styles.timer}>{timeLeft}s</Text>
            <TouchableOpacity style={styles.skipLink} onPress={handleSkip}>
                <Text style={styles.skipLinkText}>Skip</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        color: '#f0f0f5',
        marginBottom: 8,
        textAlign: 'center',
    },
    instruction: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 30,
        lineHeight: 24,
    },
    circleContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    timer: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 60,
    },
    skipLink: {
        marginTop: 40,
        padding: 10,
    },
    skipLinkText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    detailContainer: {
        flex: 1,
        backgroundColor: '#0a0a0f',
        paddingTop: 60,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    detailTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#f0f0f5',
    },
    detailScroll: {
        flex: 1,
        paddingHorizontal: 24,
    },
    detailIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    detailSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    detailText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
    },
    detailTags: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    detailTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    detailTagText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    startButton: {
        marginHorizontal: 24,
        marginBottom: 40,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
});

export default FirstBreathScreen;
