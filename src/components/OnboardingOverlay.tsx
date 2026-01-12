import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, borderRadius, typography } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TooltipStep {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const STEPS: TooltipStep[] = [
    {
        title: 'The Journey Map',
        description: 'This is your roadmap to higher states. Tap on any level to explore meditations and articles.',
        icon: 'map-outline',
    },
    {
        title: 'Transcending Blocks',
        description: 'The bottom levels focus on removing what holds you back. Move from "Force" to "Power".',
        icon: 'flash-outline',
    },
    {
        title: 'Your Pulse',
        description: 'Check in daily to see how your energy shifts over time. Your current level will be highlighted.',
        icon: 'pulse-outline',
    },
];

interface OnboardingOverlayProps {
    visible: boolean;
    onClose: () => void;
}

const OnboardingOverlay = ({ visible, onClose }: OnboardingOverlayProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const theme = useThemeColors();
    const opacity = useState(new Animated.Value(0))[0];

    React.useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    const step = STEPS[currentStep];

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    return (
        <Animated.View style={[styles.overlay, { opacity }]}>
            <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <View style={styles.header}>
                    <View style={[styles.iconWrap, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name={step.icon} size={28} color={theme.primary} />
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>{step.title}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>{step.description}</Text>

                <View style={styles.footer}>
                    <View style={styles.dots}>
                        {STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: i === currentStep ? theme.primary : theme.textSecondary + '30' }
                                ]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.nextBtn, { backgroundColor: theme.primary }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextText}>{currentStep === STEPS.length - 1 ? 'Start Journey' : 'Next'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 1000,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 32,
        borderWidth: 1,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    iconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    nextBtn: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    nextText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingOverlay;
