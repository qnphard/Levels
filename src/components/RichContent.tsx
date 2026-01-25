import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContentBlock } from '../data/transcendingData';
import { CalloutBox, BulletPoint, NumberedStep, QuoteBox } from './ContentFormatting';
import { typography, spacing, useThemeColors } from '../theme/colors';

interface RichContentProps {
    content: string | ContentBlock[];
    accentColor?: string;
}

/**
 * Renders content that can be either a plain string (legacy) or structured ContentBlocks
 */
export function RichContent({ content, accentColor }: RichContentProps) {
    const theme = useThemeColors();

    // Handle legacy plain string content
    if (typeof content === 'string') {
        return <Text style={[typography.styles.body, { color: theme.textPrimary }]}>{content}</Text>;
    }

    // Handle structured content blocks
    return (
        <View style={styles.container}>
            {content.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return (
                            <Text key={index} style={[typography.styles.body, styles.textBlock, { color: theme.textPrimary }]}>
                                {block.content}
                            </Text>
                        );

                    case 'callout':
                        return (
                            <CalloutBox
                                key={index}
                                variant={block.variant}
                                title={block.title}
                                content={block.content}
                                accentColor={accentColor}
                            />
                        );

                    case 'bullets':
                        return (
                            <View key={index} style={styles.bulletsContainer}>
                                {block.items.map((item, i) => (
                                    <BulletPoint key={i} content={item} accentColor={accentColor} />
                                ))}
                            </View>
                        );

                    case 'steps':
                        return (
                            <View key={index} style={styles.stepsContainer}>
                                {block.items.map((step, i) => (
                                    <NumberedStep
                                        key={i}
                                        number={i + 1}
                                        title={step.title}
                                        content={step.content}
                                        accentColor={accentColor}
                                    />
                                ))}
                            </View>
                        );

                    case 'quote':
                        return (
                            <QuoteBox
                                key={index}
                                quote={block.quote}
                                source={block.source}
                                accentColor={accentColor}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
    },
    textBlock: {
        marginBottom: spacing.sm,
    },
    bulletsContainer: {
        marginVertical: spacing.sm,
    },
    stepsContainer: {
        marginVertical: spacing.sm,
    },
});
