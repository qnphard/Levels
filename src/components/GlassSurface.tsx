import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
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
    borderOpacity = 0.15,
    forceTheme = undefined,
}: GlassSurfaceProps & { forceTheme?: 'light' | 'dark' }) => {
    const contextTheme = useThemeColors();
    const mode = forceTheme || contextTheme.mode;

    // Theme-specific card styles
    const cardStyles: ViewStyle = mode === 'light'
        ? {
            // Light mode: solid white cards with strong shadows
            backgroundColor: '#FFFFFF',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.05)',
        }
        : {
            // Dark mode: glass effect
            backgroundColor: 'rgba(30, 32, 44, 0.5)', // Slightly more transparent
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
        };

    return (
        <View style={[styles.container, cardStyles, style]}>
            {/* Blur with theme-aware tint */}
            <BlurView
                intensity={mode === 'dark' ? intensity : 5} // Very subtle blur for light mode
                tint={mode === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />

            {/* Content wrapper to ensure children are above blur */}
            <View style={styles.content}>
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
    },
});
