import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EssentialTier } from '../data/essentials';

const TIER_CONFIG = {
    foundation: {
        label: 'Foundation',
        colors: ['#F59E0B', '#D97706'] as const,
        textColor: '#FFFBEB',
        glowColor: '#F59E0B',
    },
    practice: {
        label: 'Practice',
        colors: ['#10B981', '#059669'] as const,
        textColor: '#ECFDF5',
        glowColor: '#10B981',
    },
    'deep-dive': {
        label: 'Deep Dive',
        colors: ['#8B5CF6', '#7C3AED'] as const,
        textColor: '#F5F3FF',
        glowColor: '#8B5CF6',
    },
};

interface TierChipProps {
    tier: EssentialTier;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export default function TierChip({ tier, size = 'small', style }: TierChipProps) {
    const config = TIER_CONFIG[tier];
    const isSmall = size === 'small';

    return (
        <View style={[styles.container, isSmall && styles.containerSmall, style]}>
            <LinearGradient
                colors={config.colors}
                style={[styles.gradient, isSmall && styles.gradientSmall]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={[styles.label, isSmall && styles.labelSmall, { color: config.textColor }]}>
                    {config.label}
                </Text>
            </LinearGradient>
        </View>
    );
}

// Helper to get tier color for external use (e.g., mandala nodes)
export function getTierColor(tier: EssentialTier): string {
    return TIER_CONFIG[tier].glowColor;
}

// Helper to get tier label
export function getTierLabel(tier: EssentialTier): string {
    return TIER_CONFIG[tier].label;
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    containerSmall: {
        borderRadius: 8,
    },
    gradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientSmall: {
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    labelSmall: {
        fontSize: 10,
        letterSpacing: 0.3,
    },
});
