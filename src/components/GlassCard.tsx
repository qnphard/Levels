import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SafeBlurView from './SafeBlurView';
import { spacing } from '../theme/colors';

interface GlassCardProps {
    children: ReactNode;
    style?: ViewStyle;
    intensity?: number; // 0 to 1
}

/**
 * GlassCard
 * A premium glassmorphism container for content.
 * Features translucency, blur, and subtle borders.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 0.5 }) => {
    return (
        <View style={[styles.container, style]}>
            <SafeBlurView
                intensity={Platform.OS === 'ios' ? 30 * intensity : 0}
                tint="dark"
                style={StyleSheet.flatten(styles.absoluteFillWrap)}
            />
            <LinearGradient
                colors={[
                    `rgba(255,255,255, ${0.1 * intensity})`,
                    `rgba(255,255,255, ${0.02 * intensity})`
                ]}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />
            <View style={styles.border} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: Platform.OS === 'android' ? 'rgba(20,20,30,0.8)' : 'transparent',
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    content: {
        padding: spacing.lg,
    },
    absoluteFillWrap: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default GlassCard;
