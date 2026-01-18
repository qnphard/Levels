import React from 'react';
import { View, StyleSheet, TextProps, StyleProp, TextStyle } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { typography } from '../theme/typography';
import { useThemeColors } from '../theme/colors';

interface KineticTextProps extends TextProps {
    children: string; // Enforce string for splitting
    type?: keyof typeof typography.styles;
    delay?: number;
    stagger?: number;
    style?: StyleProp<TextStyle>;
}

export const KineticText: React.FC<KineticTextProps> = ({
    children,
    type = 'body',
    delay = 0,
    stagger = 30, // ms per char
    style,
    ...props
}) => {
    const theme = useThemeColors();
    const textStyle = typography.styles[type];

    // Extract color from passed style, falling back to theme
    const flatStyle = StyleSheet.flatten(style);
    const color = flatStyle?.color || theme.textPrimary;

    // Split into words to respect wrapping
    const words = children.split(' ');

    let charIndex = 0;

    return (
        <View style={[styles.container, style]}>
            {words.map((word, wIndex) => {
                // Add space back to word unless it's the last one
                const wordWithSpace = wIndex === words.length - 1 ? word : word + ' ';

                return (
                    <View key={`word-${wIndex}`} style={styles.wordContainer}>
                        {wordWithSpace.split('').map((char, cIndex) => {
                            const currentDelay = delay + (charIndex * stagger);
                            charIndex++;

                            return (
                                <Animated.Text
                                    key={`char-${wIndex}-${cIndex}`}
                                    entering={FadeInUp.delay(currentDelay).springify().damping(12).mass(0.5)}
                                    layout={Layout.springify()}
                                    style={[
                                        textStyle,
                                        { color }, // Use extracted color
                                        // Fix for spaces sometimes collapsing in Flex
                                        char === ' ' ? { width: 4 } : undefined,
                                    ]}
                                    {...props}
                                >
                                    {char}
                                </Animated.Text>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    wordContainer: {
        flexDirection: 'row',
        // Ensure words stay together but wrap if needed (handled by container flexWrap)
    },
});
