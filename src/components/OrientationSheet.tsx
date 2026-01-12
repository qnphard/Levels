import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ORIENTATION_KEY = '@levels:hasSeenOrientation';

// Premium mystical colors (matching mandala)
const COLORS = {
    background: 'rgba(10, 14, 39, 0.95)',
    cardBg: 'rgba(20, 25, 50, 0.9)',
    teal: '#14b8a6',
    purple: '#a855f7',
    gold: '#fbbf24',
    textLight: '#e0f2fe',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.1)',
};

interface OrientationSheetProps {
    onComplete: () => void;
    onStartFoundations: () => void;
    visible: boolean;
}

interface StepContent {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    body: string;
    color: string;
}

const steps: StepContent[] = [
    {
        icon: 'compass-outline',
        title: 'What this app is',
        body: 'A gentle map for inner clarity.\nNo rush. No pressure. Just awareness.',
        color: COLORS.teal,
    },
    {
        icon: 'close-circle-outline',
        title: 'What it is not',
        body: 'Not a productivity tracker.\nNot a quick-fix self-help hack.\nThis is for deep, lasting change.',
        color: COLORS.purple,
    },
    {
        icon: 'leaf-outline',
        title: 'How to engage',
        body: 'Start with Foundations →\nPick one → Practice for 1–3 days →\nThen explore outward when ready.',
        color: COLORS.gold,
    },
];

const OrientationSheet: React.FC<OrientationSheetProps> = ({
    onComplete,
    onStartFoundations,
    visible,
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStartFoundations = async () => {
        await AsyncStorage.setItem(ORIENTATION_KEY, 'true');
        onStartFoundations();
    };

    const handleExploreFreely = async () => {
        await AsyncStorage.setItem(ORIENTATION_KEY, 'true');
        onComplete();
    };

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                <View style={styles.overlay}>
                    {/* Dismiss area */}
                    <Pressable style={styles.dismissArea} onPress={handleExploreFreely} />

                    {/* Main card */}
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(20, 25, 50, 0.95)', 'rgba(15, 20, 40, 0.98)']}
                            style={styles.cardGradient}
                        >
                            {/* Progress dots */}
                            <View style={styles.progressDots}>
                                {steps.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            {
                                                backgroundColor:
                                                    index === currentStep
                                                        ? step.color
                                                        : 'rgba(255, 255, 255, 0.2)',
                                            },
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Icon */}
                            <View style={[styles.iconContainer, { shadowColor: step.color }]}>
                                <Ionicons name={step.icon} size={48} color={step.color} />
                            </View>

                            {/* Title */}
                            <Text style={[styles.title, { color: step.color }]}>
                                {step.title}
                            </Text>

                            {/* Body */}
                            <Text style={styles.body}>{step.body}</Text>

                            {/* Navigation arrows */}
                            <View style={styles.navRow}>
                                <TouchableOpacity
                                    onPress={handlePrev}
                                    style={[styles.navButton, currentStep === 0 && styles.hidden]}
                                >
                                    <Ionicons
                                        name="chevron-back"
                                        size={24}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>

                                <View style={styles.navSpacer} />

                                {!isLastStep && (
                                    <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={24}
                                            color={COLORS.textMuted}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* CTA Buttons (only on last step) */}
                            {isLastStep && (
                                <View style={styles.ctaContainer}>
                                    <TouchableOpacity
                                        style={[styles.ctaButton, styles.ctaPrimary]}
                                        onPress={handleStartFoundations}
                                    >
                                        <LinearGradient
                                            colors={[COLORS.teal, '#0d9488']}
                                            style={styles.ctaGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Ionicons
                                                name="leaf-outline"
                                                size={18}
                                                color="#fff"
                                                style={styles.ctaIcon}
                                            />
                                            <Text style={styles.ctaPrimaryText}>
                                                Start with Foundations
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.ctaSecondary}
                                        onPress={handleExploreFreely}
                                    >
                                        <Text style={styles.ctaSecondaryText}>Explore freely</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </LinearGradient>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

// Hook to check if orientation has been seen
export const useOrientationStatus = () => {
    const [hasSeenOrientation, setHasSeenOrientation] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(ORIENTATION_KEY);
                setHasSeenOrientation(value === 'true');
            } catch {
                setHasSeenOrientation(false);
            }
        };
        checkStatus();
    }, []);

    const resetOrientation = async () => {
        await AsyncStorage.removeItem(ORIENTATION_KEY);
        setHasSeenOrientation(false);
    };

    return { hasSeenOrientation, resetOrientation };
};

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    card: {
        width: width * 0.88,
        maxWidth: 400,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 20,
    },
    cardGradient: {
        padding: 32,
        alignItems: 'center',
    },
    progressDots: {
        flexDirection: 'row',
        marginBottom: 28,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    iconContainer: {
        marginBottom: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    body: {
        fontSize: 16,
        lineHeight: 26,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 24,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    navButton: {
        padding: 12,
    },
    navSpacer: {
        flex: 1,
    },
    hidden: {
        opacity: 0,
    },
    ctaContainer: {
        width: '100%',
        marginTop: 8,
    },
    ctaButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    ctaPrimary: {
        shadowColor: COLORS.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    ctaIcon: {
        marginRight: 8,
    },
    ctaPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    ctaSecondary: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    ctaSecondaryText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default OrientationSheet;
