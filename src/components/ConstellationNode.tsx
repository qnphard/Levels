import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ConsciousnessLevel } from '../types';
import GlassCard from './GlassCard';

interface ConstellationNodeProps {
    level: ConsciousnessLevel;
    x: number;
    y: number;
    isUnlocked: boolean;
    isCompleted: boolean;
    isCurrent: boolean;
    onPress: () => void;
    accentColor?: string;
    lockReason?: string;
}

export const ConstellationNode: React.FC<ConstellationNodeProps> = ({
    level,
    x,
    y,
    isUnlocked,
    isCompleted,
    isCurrent,
    onPress,
    accentColor = '#8B5CF6',
    lockReason,
}) => {
    const pulseValue = useRef(new Animated.Value(0)).current;
    const glowValue = useRef(new Animated.Value(0)).current;

    // Breathing animation for current/unlocked nodes
    useEffect(() => {
        const animations = [];

        if (isCurrent || isUnlocked) {
            animations.push(
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(glowValue, {
                            toValue: 1,
                            duration: 3000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(glowValue, {
                            toValue: 0,
                            duration: 3000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                )
            );
        }

        if (isCurrent) {
            animations.push(
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseValue, {
                            toValue: 1,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseValue, {
                            toValue: 0,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                )
            );
        }

        animations.forEach(anim => anim.start());
        return () => animations.forEach(anim => anim.stop());
    }, [isCurrent, isUnlocked]);

    const pulseScale = pulseValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1],
    });

    const glowOpacity = glowValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const nodeSize = isCurrent ? 64 : 50;
    const iconSize = isCurrent ? 24 : 18;

    const getIcon = (): keyof typeof Ionicons.glyphMap => {
        if (!isUnlocked) return 'lock-closed';
        if (isCompleted) return 'checkmark-circle';

        switch (level.zone) {
            case 'Heavy Weather': return 'cloud-outline';
            case 'Stuckness': return 'pause-circle-outline';
            case 'Stabilization': return 'sunny-outline';
            case 'Openness': return 'infinite-outline';
            default: return 'ellipse-outline';
        }
    };

    return (
        <Pressable
            onPress={isUnlocked ? onPress : undefined}
            style={[
                styles.container,
                {
                    left: x - nodeSize / 2,
                    top: y - nodeSize / 2,
                }
            ]}
        >
            {/* Focal Glow Ring */}
            {(isCurrent || isUnlocked) && (
                <Animated.View
                    style={[
                        styles.glowRing,
                        {
                            width: nodeSize + 16,
                            height: nodeSize + 16,
                            borderRadius: (nodeSize + 16) / 2,
                            backgroundColor: accentColor,
                            opacity: glowOpacity,
                            transform: [{ scale: pulseScale }],
                        }
                    ]}
                />
            )}

            {/* Portal Body - Glass Style */}
            <Animated.View
                style={[
                    styles.node,
                    {
                        width: nodeSize,
                        height: nodeSize,
                        borderRadius: nodeSize / 3, // Slightly squarish glass portal
                        transform: [{ scale: pulseScale }],
                        borderColor: isUnlocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                    }
                ]}
            >
                <LinearGradient
                    colors={
                        isUnlocked
                            ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']
                            : ['rgba(40,40,40,0.4)', 'rgba(0,0,0,0.2)']
                    }
                    style={styles.gradient}
                >
                    <Ionicons
                        name={getIcon()}
                        size={iconSize}
                        color={isUnlocked ? 'white' : 'rgba(255,255,255,0.2)'}
                    />
                </LinearGradient>
            </Animated.View>

            {/* Content Group */}
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.label,
                        !isUnlocked && { color: 'rgba(255,255,255,0.3)' },
                        isCurrent && { color: 'white' },
                    ]}
                    numberOfLines={1}
                >
                    {level.name}
                </Text>

                {isUnlocked ? (
                    <Text style={[styles.calibration, { color: accentColor }]}>{level.level}</Text>
                ) : (
                    <Text style={styles.lockReason}>{lockReason || 'Locked Space'}</Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        zIndex: 10,
    },
    glowRing: {
        position: 'absolute',
        top: -8,
        left: -8,
        shadowColor: 'white',
        shadowRadius: 10,
        shadowOpacity: 0.5,
    },
    node: {
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginTop: 6,
        alignItems: 'center',
    },
    label: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowRadius: 6,
    },
    calibration: {
        fontSize: 11,
        fontWeight: '800',
        marginTop: 2,
        opacity: 0.9,
    },
    lockReason: {
        fontSize: 8,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
});

export default ConstellationNode;
