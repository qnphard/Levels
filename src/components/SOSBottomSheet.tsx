import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
    SlideInRight,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors, spacing, typography, borderRadius, ThemeColors } from '../theme/colors';
import { mediumTap, selectionChange } from '../utils/haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type InquiryStep = 'initial' | 'intensity' | 'feeling' | 'recommendation';

interface FeelingOption {
    id: string;
    label: string;
    emoji: string;
    color: string;
}

const INTENSITY_OPTIONS = [
    { id: 'mild', label: 'Mild discomfort', value: 1 },
    { id: 'moderate', label: 'Moderate distress', value: 2 },
    { id: 'intense', label: 'Very intense', value: 3 },
    { id: 'overwhelming', label: 'Overwhelming', value: 4 },
];

const FEELING_OPTIONS: FeelingOption[] = [
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#60A5FA' },
    { id: 'angry', label: 'Angry', emoji: '😠', color: '#F87171' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: '#818CF8' },
    { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', color: '#FBBF24' },
    { id: 'hopeless', label: 'Hopeless', emoji: '😔', color: '#94A3B8' },
    { id: 'restless', label: 'Restless', emoji: '😤', color: '#34D399' },
];

interface Recommendation {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    action: () => void;
}

interface SOSBottomSheetProps {
    visible: boolean;
    onClose: () => void;
}

const SOSBottomSheet: React.FC<SOSBottomSheetProps> = ({ visible, onClose }) => {
    const theme = useThemeColors();
    const navigation = useNavigation<NavigationProp>();
    const styles = getStyles(theme);

    const [step, setStep] = useState<InquiryStep>('initial');
    const [intensity, setIntensity] = useState<number | null>(null);
    const [feeling, setFeeling] = useState<string | null>(null);

    const translateY = useSharedValue(SHEET_HEIGHT);
    const backdropOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
            backdropOpacity.value = withTiming(1, { duration: 200 });
            setStep('initial');
            setIntensity(null);
            setFeeling(null);
        } else {
            translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 150 });
            backdropOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const closeSheet = useCallback(() => {
        translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 150 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
        setTimeout(onClose, 200);
    }, [onClose]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            'worklet';
            if (e.translationY > 0) {
                translateY.value = e.translationY;
            }
        })
        .onEnd((e) => {
            'worklet';
            if (e.translationY > SHEET_HEIGHT * 0.3 || e.velocityY > 500) {
                translateY.value = withSpring(SHEET_HEIGHT, { damping: 20, stiffness: 150 });
                backdropOpacity.value = withTiming(0, { duration: 200 });
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const handleIntensitySelect = (value: number) => {
        selectionChange();
        setIntensity(value);
        setTimeout(() => setStep('feeling'), 300);
    };

    const handleFeelingSelect = (id: string) => {
        mediumTap();
        setFeeling(id);
        setTimeout(() => setStep('recommendation'), 300);
    };

    const getRecommendations = (): Recommendation[] => {
        const recommendations: Recommendation[] = [];
        const isHighIntensity = intensity && intensity >= 3;

        // ANXIOUS - fear-based, racing thoughts
        if (feeling === 'anxious') {
            if (isHighIntensity) {
                recommendations.push({
                    title: 'Physiological Sigh',
                    description: 'Double inhale + long exhale to calm panic in seconds.',
                    icon: 'flash-outline',
                    color: '#F472B6',
                    action: () => {
                        closeSheet();
                        setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'sigh' }), 300);
                    },
                });
            }
            recommendations.push({
                title: '4-7-8 Breathing',
                description: 'Long exhale activates your calm nervous system.',
                icon: 'moon-outline',
                color: '#60A5FA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: '478' }), 300);
                },
            });
            recommendations.push({
                title: 'Shaking Release',
                description: 'Release pent-up fear energy through movement.',
                icon: 'body-outline',
                color: '#34D399',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'shaking' }), 300);
                },
            });
        }

        // ANGRY - hot, explosive energy
        if (feeling === 'angry') {
            recommendations.push({
                title: 'Physiological Sigh',
                description: 'Rapid calm-down for acute anger in seconds.',
                icon: 'flash-outline',
                color: '#F87171',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'sigh' }), 300);
                },
            });
            recommendations.push({
                title: 'Core Letting Go',
                description: 'Surrender resistance to the feeling and let it dissolve.',
                icon: 'heart-outline',
                color: '#A78BFA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'letting-go-basic' }), 300);
                },
            });
            recommendations.push({
                title: 'Shaking Release',
                description: 'Move the anger energy out of your body.',
                icon: 'body-outline',
                color: '#FBBF24',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'shaking' }), 300);
                },
            });
        }

        // SAD - heavy, low energy
        if (feeling === 'sad') {
            recommendations.push({
                title: 'Core Letting Go',
                description: 'Be with the sadness fully until it transforms.',
                icon: 'heart-outline',
                color: '#818CF8',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'letting-go-basic' }), 300);
                },
            });
            recommendations.push({
                title: 'Through the Eyes',
                description: 'Clear grief through focused, unwavering gaze.',
                icon: 'eye-outline',
                color: '#60A5FA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'eyes' }), 300);
                },
            });
            recommendations.push({
                title: 'Simple Belly Breath',
                description: 'Gentle breathing to soothe and ground yourself.',
                icon: 'leaf-outline',
                color: '#34D399',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'belly' }), 300);
                },
            });
        }

        // OVERWHELMED - too much at once
        if (feeling === 'overwhelmed') {
            recommendations.push({
                title: 'Box Breathing',
                description: 'Equal counts to reset your nervous system.',
                icon: 'cube-outline',
                color: '#60A5FA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'box' }), 300);
                },
            });
            recommendations.push({
                title: 'Physiological Sigh',
                description: 'Quick reset when everything feels like too much.',
                icon: 'flash-outline',
                color: '#F472B6',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'sigh' }), 300);
                },
            });
            recommendations.push({
                title: 'Core Letting Go',
                description: 'Stop fighting the overload and let it pass.',
                icon: 'heart-outline',
                color: '#A78BFA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'letting-go-basic' }), 300);
                },
            });
        }

        // HOPELESS - apathy, lack of energy
        if (feeling === 'hopeless') {
            recommendations.push({
                title: 'Core Letting Go',
                description: 'Surrender to the feeling fully - it is temporary.',
                icon: 'heart-outline',
                color: '#94A3B8',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'letting-go-basic' }), 300);
                },
            });
            recommendations.push({
                title: 'Simple Belly Breath',
                description: 'Gentle, nurturing breaths to restore energy.',
                icon: 'leaf-outline',
                color: '#34D399',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'belly' }), 300);
                },
            });
            recommendations.push({
                title: 'Natural Happiness',
                description: 'Remember: peace is your natural state.',
                icon: 'sunny-outline',
                color: '#FBBF24',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('NaturalHappiness'), 300);
                },
            });
        }

        // RESTLESS - agitated, can't settle
        if (feeling === 'restless') {
            recommendations.push({
                title: 'Shaking Release',
                description: 'Channel restless energy into movement.',
                icon: 'body-outline',
                color: '#34D399',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'shaking' }), 300);
                },
            });
            recommendations.push({
                title: '4-7-8 Breathing',
                description: 'Long exhale to slow down your system.',
                icon: 'moon-outline',
                color: '#60A5FA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: '478' }), 300);
                },
            });
            recommendations.push({
                title: 'Box Breathing',
                description: 'Structured rhythm to bring order to chaos.',
                icon: 'cube-outline',
                color: '#A78BFA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'box' }), 300);
                },
            });
        }

        // Fallback if no feeling selected (shouldn't happen in normal flow)
        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Core Letting Go',
                description: 'The fundamental practice of surrendering resistance.',
                icon: 'heart-outline',
                color: '#A78BFA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('PracticePlayer', { practiceId: 'letting-go-basic' }), 300);
                },
            });
        }

        return recommendations.slice(0, 3);
    };

    const renderInitialStep = () => (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContainer}>
            <Text style={styles.inquiryQuestion}>How are you feeling right now?</Text>
            <Text style={styles.inquirySubtext}>Let's find the right support for you.</Text>

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                    mediumTap();
                    setStep('intensity');
                }}
            >
                <Ionicons name="heart-outline" size={24} color="#FFF" />
                <Text style={styles.startButtonText}>Start Self-Inquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.skipLink}
                onPress={() => {
                    mediumTap();
                    closeSheet();
                    // Navigate directly to Practices tab for quick relief
                    setTimeout(() => (navigation as any).navigate('Main', { screen: 'Practices' }), 300);
                }}
            >
                <Text style={styles.skipText}>Just give me quick relief</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderIntensityStep = () => (
        <Animated.View entering={SlideInRight.duration(300)} style={styles.stepContainer}>
            <Text style={styles.inquiryQuestion}>How intense is this feeling?</Text>
            <View style={styles.optionsGrid}>
                {INTENSITY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        style={[
                            styles.intensityOption,
                            intensity === opt.value && styles.intensityOptionSelected,
                        ]}
                        onPress={() => handleIntensitySelect(opt.value)}
                    >
                        <View style={[styles.intensityDots, { width: opt.value * 16 }]}>
                            {Array.from({ length: opt.value }).map((_, i) => (
                                <View key={i} style={[styles.dot, { backgroundColor: intensity === opt.value ? '#FFF' : '#60A5FA' }]} />
                            ))}
                        </View>
                        <Text style={[styles.intensityText, intensity === opt.value && styles.intensityTextSelected]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    const renderFeelingStep = () => (
        <Animated.View entering={SlideInRight.duration(300)} style={styles.stepContainer}>
            <Text style={styles.inquiryQuestion}>What's the main feeling?</Text>
            <View style={styles.feelingsGrid}>
                {FEELING_OPTIONS.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        style={[
                            styles.feelingOption,
                            feeling === opt.id && { borderColor: opt.color, backgroundColor: opt.color + '20' },
                        ]}
                        onPress={() => handleFeelingSelect(opt.id)}
                    >
                        <Text style={styles.feelingEmoji}>{opt.emoji}</Text>
                        <Text style={[styles.feelingLabel, { color: feeling === opt.id ? opt.color : '#E2E8F0' }]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    const renderRecommendationStep = () => {
        const recommendations = getRecommendations();

        return (
            <Animated.View entering={SlideInRight.duration(300)} style={styles.stepContainer}>
                <Text style={styles.inquiryQuestion}>Here's what might help</Text>
                <Text style={styles.inquirySubtext}>Based on what you're experiencing</Text>

                <ScrollView style={styles.recommendationsScroll} showsVerticalScrollIndicator={false}>
                    {recommendations.map((rec, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.recommendationCard}
                            onPress={rec.action}
                        >
                            <View style={[styles.recIconContainer, { backgroundColor: rec.color + '20' }]}>
                                <Ionicons name={rec.icon} size={24} color={rec.color} />
                            </View>
                            <View style={styles.recContent}>
                                <Text style={styles.recTitle}>{rec.title}</Text>
                                <Text style={styles.recDescription}>{rec.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setStep('initial');
                        setIntensity(null);
                        setFeeling(null);
                    }}
                >
                    <Ionicons name="arrow-back" size={16} color="#94A3B8" />
                    <Text style={styles.backText}>Start over</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSheet} activeOpacity={1} />
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.sheetContainer, sheetStyle]}>
                    <BlurView intensity={90} tint="dark" style={styles.blurView}>
                        {/* Handle */}
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <Ionicons name="medkit-outline" size={28} color="#F87171" />
                            <Text style={styles.headerTitle}>
                                {step === 'recommendation' ? 'Your Path Forward' : 'Emergency Relief'}
                            </Text>
                        </View>

                        {/* Steps */}
                        {step === 'initial' && renderInitialStep()}
                        {step === 'intensity' && renderIntensityStep()}
                        {step === 'feeling' && renderFeelingStep()}
                        {step === 'recommendation' && renderRecommendationStep()}
                    </BlurView>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const getStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        sheetContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: SHEET_HEIGHT,
            borderTopLeftRadius: borderRadius.xxl,
            borderTopRightRadius: borderRadius.xxl,
            overflow: 'hidden',
        },
        blurView: {
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingBottom: 90, // Account for absolute tab bar (70px)
        },
        handleContainer: {
            alignItems: 'center',
            paddingVertical: spacing.md,
        },
        handle: {
            width: 40,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 2,
        },
        header: {
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        headerTitle: {
            fontSize: typography.h2,
            fontWeight: typography.bold,
            color: '#FFFFFF',
            marginTop: spacing.sm,
        },
        stepContainer: {
            flex: 1,
            paddingTop: spacing.md,
        },
        inquiryQuestion: {
            fontSize: typography.h3,
            fontWeight: typography.bold,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: spacing.xs,
        },
        inquirySubtext: {
            fontSize: typography.body,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginBottom: spacing.xl,
        },
        startButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.xl,
            borderRadius: borderRadius.round,
            gap: spacing.sm,
            alignSelf: 'center',
        },
        startButtonText: {
            fontSize: typography.body,
            fontWeight: typography.bold,
            color: '#FFFFFF',
        },
        skipLink: {
            alignSelf: 'center',
            marginTop: spacing.xl,
        },
        skipText: {
            fontSize: typography.small,
            color: 'rgba(255, 255, 255, 0.5)',
            textDecorationLine: 'underline',
        },
        optionsGrid: {
            gap: spacing.md,
        },
        intensityOption: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            gap: spacing.md,
        },
        intensityOptionSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        intensityDots: {
            flexDirection: 'row',
            gap: 4,
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        intensityText: {
            fontSize: typography.body,
            color: '#E2E8F0',
        },
        intensityTextSelected: {
            color: '#FFFFFF',
            fontWeight: typography.semibold,
        },
        feelingsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            justifyContent: 'center',
        },
        feelingOption: {
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            width: '30%',
            minWidth: 90,
        },
        feelingEmoji: {
            fontSize: 32,
            marginBottom: spacing.xs,
        },
        feelingLabel: {
            fontSize: typography.small,
            fontWeight: typography.medium,
        },
        recommendationsScroll: {
            flex: 1,
        },
        recommendationCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        recIconContainer: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
        },
        recContent: {
            flex: 1,
        },
        recTitle: {
            fontSize: typography.body,
            fontWeight: typography.semibold,
            color: '#FFFFFF',
            marginBottom: 2,
        },
        recDescription: {
            fontSize: typography.small,
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: 18,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            paddingVertical: spacing.md,
        },
        backText: {
            fontSize: typography.small,
            color: '#94A3B8',
        },
    });

export default SOSBottomSheet;
