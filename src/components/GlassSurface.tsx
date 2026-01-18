import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../theme/colors';

interface GlassSurfaceProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    borderOpacity?: number;
    forceTheme?: 'light' | 'dark';
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
    children,
    style,
    intensity = 40, // Medium blur
    borderOpacity = 0.08,
    forceTheme = undefined, // 'light' | 'dark'
}: GlassSurfaceProps & { forceTheme?: 'light' | 'dark' }) => {
    const contextTheme = useThemeColors();
    const mode = forceTheme || contextTheme.mode;

    return (
        <View style={[styles.container, style]}>
            {/* 1. Blur Layer */}
            <BlurView
                intensity={intensity}
                tint={mode === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />

            {/* 2. Surface Tint Gradient (Subtle vertical fade) */}
            <LinearGradient
                colors={[
                    mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)',
                    mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.1)',
                ]}
                style={StyleSheet.absoluteFill}
            />

            {/* 3. Specular Highlight (Top edge sheen) */}
            <LinearGradient
                colors={[
                    'rgba(255,255,255,0.15)',
                    'transparent'
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.15 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            {/* 4. Content */}
            <View style={[styles.content, { borderColor: `rgba(255,255,255,${borderOpacity})` }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 24, // Premium rounded corners
    },
    content: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 24,
        borderColor: 'rgba(255,255,255,0.08)', // Fallback
    },
});
