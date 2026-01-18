import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/types';
import { Practice, PRACTICES } from '../components/PracticeSelector';
import useTickSound from '../hooks/useTickSound';
import { useThemeColors } from '../theme/colors';
import { LivingBackground } from '../components/LivingBackground';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PracticePlayer'>;
type PracticePlayerRouteProp = RouteProp<RootStackParamList, 'PracticePlayer'>;

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'steady' | 'shaking';

export default function PracticePlayerScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<PracticePlayerRouteProp>();
    const theme = useThemeColors();
    const { playTick } = useTickSound();

    const practice = PRACTICES.find(p => p.id === route.params.practiceId);

    const [showingDetail, setShowingDetail] = useState(true);
    const [timeLeft, setTimeLeft] = useState(practice?.totalDuration || 60);
    const [phase, setPhase] = useState<BreathPhase>('inhale');
    const [isActive, setIsActive] = useState(false);

    const circleScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const getPhaseText = useCallback((currentPhase: BreathPhase): string => {
        if (!practice) return '';
        if (practice.type === 'technique') return practice.instruction;

        switch (currentPhase) {
            case 'inhale': return 'Breathe in...';
            case 'holdIn': return 'Hold air in...';
            case 'exhale': return 'Breathe out...';
            case 'holdOut': return 'Hold...';
            default: return '';
        }
    }, [practice]);

    // Navigation when time is up
    useEffect(() => {
        if (timeLeft === 0) {
            navigation.goBack();
        }
    }, [timeLeft, navigation]);

    // Animation and phase cycling logic
    useEffect(() => {
        if (!isActive || !practice) return;

        const countdownInterval = setInterval(() => {
            setTimeLeft((t) => {
                if (t > 0) {
                    playTick();
                    return t - 1;
                }
                return 0;
            });
        }, 1000);

        if (practice.type === 'breathing' && practice.pattern) {
            const { pattern } = practice;

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

        if (practice.type === 'technique') {
            if (practice.id === 'shaking') {
                setPhase('shaking');
                translateX.value = withRepeat(
                    withSequence(
                        withTiming(6, { duration: 50 }),
                        withTiming(-6, { duration: 50 }),
                        withTiming(4, { duration: 50 }),
                        withTiming(-4, { duration: 50 })
                    ),
                    -1, false
                );
                translateY.value = withRepeat(
                    withSequence(
                        withTiming(-4, { duration: 40 }),
                        withTiming(4, { duration: 40 }),
                        withTiming(-2, { duration: 40 }),
                        withTiming(2, { duration: 40 })
                    ),
                    -1, false
                );
                circleScale.value = withRepeat(
                    withSequence(
                        withTiming(1.1, { duration: 200 }),
                        withTiming(1.0, { duration: 200 })
                    ),
                    -1, true
                );
            } else if (practice.id === 'eyes') {
                setPhase('steady');
                circleScale.value = withRepeat(
                    withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    -1, true
                );
            } else if (practice.id === 'letting-go-basic') {
                setPhase('steady');
                circleScale.value = withRepeat(
                    withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                    -1, true
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
    }, [isActive, practice]);

    const handleStartPractice = () => {
        if (!practice) return;
        setTimeLeft(practice.totalDuration);
        setShowingDetail(false);
        setIsActive(true);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const circleStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: circleScale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ] as any,
    }));

    if (!practice) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.textPrimary }}>Practice not found</Text>
            </View>
        );
    }

    if (showingDetail) {
        return (
            <View style={[styles.detailContainer, { backgroundColor: theme.background }]}>
                <LivingBackground />
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: theme.textPrimary }]}>{practice.name}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.detailIconContainer}>
                        <Ionicons
                            name={practice.icon}
                            size={48}
                            color={practice.type === 'breathing' ? "#A78BFA" : "#F472B6"}
                        />
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.detailSectionTitle}>The Practice</Text>
                        <Text style={styles.detailText}>{practice.explanation}</Text>
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.detailSectionTitle}>Instructions</Text>
                        <Text style={styles.detailText}>{practice.instruction}</Text>
                    </View>

                    <View style={styles.detailTags}>
                        <View style={styles.detailTag}>
                            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.detailTagText}>{practice.totalDuration}s Session</Text>
                        </View>
                        <View style={styles.detailTag}>
                            <Ionicons name="sparkles-outline" size={14} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.detailTagText}>{practice.bestFor}</Text>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[
                        styles.startButton,
                        { backgroundColor: practice.type === 'breathing' ? "#7C3AED" : "#DB2777" }
                    ]}
                    onPress={handleStartPractice}
                >
                    <Text style={styles.startButtonText}>Start Practice</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isTechnique = practice.type === 'technique';
    const accentColor = isTechnique ? 'rgba(244, 114, 182, 0.3)' : 'rgba(167, 139, 250, 0.3)';
    const innerAccentColor = isTechnique ? 'rgba(244, 114, 182, 0.6)' : 'rgba(167, 139, 250, 0.6)';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LivingBackground />
            <Text style={[styles.title, { color: theme.textPrimary }]}>{practice.name}</Text>
            <Text style={[styles.instruction, { color: theme.textSecondary }]}>{getPhaseText(phase)}</Text>

            <View style={styles.circleContainer}>
                <Animated.View style={[
                    styles.circle,
                    { backgroundColor: accentColor },
                    circleStyle
                ]}>
                    <View style={[styles.innerCircle, { backgroundColor: innerAccentColor }]} />
                </Animated.View>
            </View>

            <Text style={[styles.timer, { color: theme.textMuted }]}>{timeLeft}s</Text>
            <TouchableOpacity style={styles.skipLink} onPress={handleBack}>
                <Text style={[styles.skipLinkText, { color: theme.textMuted }]}>End Practice</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        marginBottom: 8,
        textAlign: 'center',
    },
    instruction: {
        fontSize: 16,
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
        marginTop: 60,
    },
    skipLink: {
        marginTop: 40,
        padding: 10,
    },
    skipLinkText: {
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    detailContainer: {
        flex: 1,
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
