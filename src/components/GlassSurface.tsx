import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
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
    intensity = 40,
    borderOpacity = 0.12,
    forceTheme = undefined,
}: GlassSurfaceProps & { forceTheme?: 'light' | 'dark' }) => {
    const contextTheme = useThemeColors();
    const mode = forceTheme || contextTheme.mode;

    // Light mode: elevated white cards with shadows
    // Dark mode: glassmorphism with blur and subtle borders
    const lightModeStyles: ViewStyle = mode === 'light' ? {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4, // Android shadow
    } : {};

    return (
        <View style={[styles.container, lightModeStyles, style]}>
            {/* Blur Layer - more visible in dark mode */}
            <BlurView
                intensity={mode === 'dark' ? intensity : 20}
                tint={mode === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />

            {/* Surface Tint Gradient */}
            <LinearGradient
                colors={
                    mode === 'dark'
                        ? ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']
                        : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']
                }
                style={StyleSheet.absoluteFill}
            />

            {/* Top edge highlight for depth */}
            <LinearGradient
                colors={
                    mode === 'dark'
                        ? ['rgba(255,255,255,0.12)', 'transparent']
                        : ['rgba(255,255,255,1)', 'transparent']
                }
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.08 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            {/* Content wrapper with border */}
            <View style={[
                styles.content,
                {
                    borderColor: mode === 'dark'
                        ? `rgba(255,255,255,${borderOpacity})`
                        : `rgba(0,0,0,${borderOpacity * 0.6})`,
                    borderWidth: mode === 'dark' ? 1 : 1,
                }
            ]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        borderRadius: 20,
    },
});
