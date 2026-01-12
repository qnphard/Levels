import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    withSequence,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { Milestone } from '../store/userStore';
import { celebrationPattern } from '../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MilestoneUnlockedOverlayProps {
    milestone: Milestone;
    onDismiss: () => void;
}

export default function MilestoneUnlockedOverlay({ milestone, onDismiss }: MilestoneUnlockedOverlayProps) {
    const theme = useThemeColors();

    const backdropOpacity = useSharedValue(0);
    const cardScale = useSharedValue(0.5);
    const cardOpacity = useSharedValue(0);
    const iconScale = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);
    const titleOpacity = useSharedValue(0);
    const descTranslateY = useSharedValue(20);
    const descOpacity = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    // Particle positions
    const particles = Array.from({ length: 12 }, (_, i) => ({
        x: useSharedValue(0),
        y: useSharedValue(0),
        scale: useSharedValue(0),
        opacity: useSharedValue(0),
        angle: (i / 12) * 360,
    }));

    useEffect(() => {
        // Trigger celebration haptic
        celebrationPattern();

        // Animate in sequence
        backdropOpacity.value = withTiming(1, { duration: 300 });

        cardScale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 200 }));
        cardOpacity.value = withDelay(100, withTiming(1, { duration: 200 }));

        iconScale.value = withDelay(300, withSequence(
            withSpring(1.3, { damping: 8 }),
            withSpring(1, { damping: 10 })
        ));

        titleTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
        titleOpacity.value = withDelay(400, withTiming(1, { duration: 200 }));

        descTranslateY.value = withDelay(500, withSpring(0, { damping: 15 }));
        descOpacity.value = withDelay(500, withTiming(1, { duration: 200 }));

        buttonOpacity.value = withDelay(700, withTiming(1, { duration: 300 }));

        // Particles burst
        particles.forEach((p, i) => {
            const radians = (p.angle * Math.PI) / 180;
            const distance = 80 + Math.random() * 40;

            p.scale.value = withDelay(300 + i * 30, withSequence(
                withSpring(1, { damping: 8 }),
                withDelay(500, withTiming(0, { duration: 300 }))
            ));
            p.opacity.value = withDelay(300 + i * 30, withSequence(
                withTiming(1, { duration: 100 }),
                withDelay(500, withTiming(0, { duration: 300 }))
            ));
            p.x.value = withDelay(300 + i * 30, withSpring(Math.cos(radians) * distance, { damping: 15 }));
            p.y.value = withDelay(300 + i * 30, withSpring(Math.sin(radians) * distance, { damping: 15 }));
        });
    }, []);

    const handleDismiss = () => {
        backdropOpacity.value = withTiming(0, { duration: 200 });
        cardScale.value = withTiming(0.8, { duration: 200 });
        cardOpacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(onDismiss)();
        });
    };

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }],
        opacity: cardOpacity.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const titleStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: titleTranslateY.value }],
        opacity: titleOpacity.value,
    }));

    const descStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: descTranslateY.value }],
        opacity: descOpacity.value,
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    return (
        <Animated.View style={[styles.overlay, backdropStyle]}>
            <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />

            <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />

            <Animated.View style={[styles.card, cardStyle]}>
                <LinearGradient
                    colors={['rgba(139, 92, 246, 0.15)', 'rgba(59, 130, 246, 0.1)', 'rgba(0,0,0,0)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />

                {/* Particles */}
                <View style={styles.particleContainer}>
                    {particles.map((p, i) => {
                        const particleStyle = useAnimatedStyle(() => ({
                            transform: [
                                { translateX: p.x.value },
                                { translateY: p.y.value },
                                { scale: p.scale.value },
                            ],
                            opacity: p.opacity.value,
                        }));
                        return (
                            <Animated.View
                                key={i}
                                style={[styles.particle, particleStyle, { backgroundColor: i % 2 === 0 ? theme.primary : '#FCD34D' }]}
                            />
                        );
                    })}
                </View>

                {/* Icon */}
                <Animated.View style={[styles.iconContainer, iconStyle]}>
                    <LinearGradient
                        colors={[theme.primary, '#3B82F6']}
                        style={styles.iconGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.iconEmoji}>{milestone.icon}</Text>
                    </LinearGradient>
                </Animated.View>

                {/* Title */}
                <Animated.Text style={[styles.unlockedLabel, { color: theme.primary }, titleStyle]}>
                    MILESTONE UNLOCKED
                </Animated.Text>

                <Animated.Text style={[styles.title, { color: theme.textPrimary }, titleStyle]}>
                    {milestone.title}
                </Animated.Text>

                {/* Description */}
                <Animated.Text style={[styles.description, { color: theme.textSecondary }, descStyle]}>
                    {milestone.description}
                </Animated.Text>

                {/* Button */}
                <Animated.View style={buttonStyle}>
                    <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleDismiss}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        width: SCREEN_WIDTH * 0.85,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        overflow: 'hidden',
    },
    particleContainer: {
        position: 'absolute',
        top: 80,
        left: '50%',
        width: 0,
        height: 0,
    },
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconEmoji: {
        fontSize: 40,
    },
    unlockedLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: typography.h3,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: typography.body,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    button: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.round,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
});
