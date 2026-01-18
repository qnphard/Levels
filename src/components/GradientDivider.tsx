import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../theme/colors';

interface GradientDividerProps {
    style?: ViewStyle;
    opacity?: number;
}

export const GradientDivider: React.FC<GradientDividerProps> = ({
    style,
    opacity = 0.5
}) => {
    const theme = useThemeColors();

    return (
        <LinearGradient
            colors={[
                'transparent',
                theme.primary, // Violet/Accent
                'transparent'
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.container, { opacity }, style]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        height: 1,
        width: '100%',
        marginVertical: 24,
    },
});
