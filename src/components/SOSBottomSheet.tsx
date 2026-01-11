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
import { RootStackParamList } from '../navigation/AppNavigator';
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

        // Always offer quick breathing
        if (intensity && intensity >= 3) {
            recommendations.push({
                title: '90 Second Reset',
                description: 'Quick breathing to calm your nervous system immediately.',
                icon: 'pulse-outline',
                color: '#60A5FA',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('Tension', { initialTab: 'releasing' }), 300);
                },
            });
        }

        // Based on feeling
        if (feeling === 'anxious' || feeling === 'overwhelmed') {
            recommendations.push({
                title: 'Grounding Exercise',
                description: '5-4-3-2-1 senses to anchor you in the present moment.',
                icon: 'leaf-outline',
                color: '#34D399',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('Mantras'), 300);
                },
            });
        }

        if (feeling === 'angry') {
            recommendations.push({
                title: 'Release Anger',
                description: 'Learn to let go of anger through the Letting Go technique.',
                icon: 'flame-outline',
                color: '#F87171',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('Chapter', { chapterId: 'letting-go' }), 300);
                },
            });
        }

        if (feeling === 'sad' || feeling === 'hopeless') {
            recommendations.push({
                title: 'Natural Happiness',
                description: 'Remember: happiness is your natural state, not something to achieve.',
                icon: 'sunny-outline',
                color: '#FBBF24',
                action: () => {
                    closeSheet();
                    setTimeout(() => navigation.navigate('NaturalHappiness'), 300);
                },
            });
        }

        // Always offer tension release
        recommendations.push({
            title: 'Release Tension',
            description: 'Let go of physical and emotional tension held in your body.',
            icon: 'water-outline',
            color: '#A78BFA',
            action: () => {
                closeSheet();
                setTimeout(() => navigation.navigate('Tension'), 300);
            },
        });

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
                    setStep('recommendation');
                    setIntensity(2);
                    setFeeling('anxious');
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
