import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, typography, spacing, borderRadius } from '../theme/colors';
import { GlassSurface } from './GlassSurface';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CalloutBoxProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title?: string;
    content: string;
    variant?: 'insight' | 'example' | 'warning' | 'tip';
    accentColor?: string;
}

/**
 * Callout Box - A visually distinct container for highlighting important content
 */
export function CalloutBox({ icon, title, content, variant = 'insight', accentColor }: CalloutBoxProps) {
    const theme = useThemeColors();

    const variantConfig = {
        insight: { icon: 'bulb-outline' as const, color: accentColor || '#FFD700', label: 'Key Insight' },
        example: { icon: 'person-outline' as const, color: accentColor || '#7B68EE', label: 'Real Life Example' },
        warning: { icon: 'alert-circle-outline' as const, color: '#FF6B6B', label: 'Watch Out' },
        tip: { icon: 'checkmark-circle-outline' as const, color: '#4ECDC4', label: 'Try This' },
    };

    const config = variantConfig[variant];

    return (
        <View style={[styles.calloutContainer, { borderLeftColor: config.color }]}>
            <View style={styles.calloutHeader}>
                <Ionicons name={icon || config.icon} size={18} color={config.color} />
                <Text style={[styles.calloutLabel, { color: config.color }]}>
                    {title || config.label}
                </Text>
            </View>
            <Text style={[styles.calloutContent, { color: theme.textPrimary }]}>
                {content}
            </Text>
        </View>
    );
}

interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
    icon?: keyof typeof Ionicons.glyphMap;
    defaultExpanded?: boolean;
    accentColor?: string;
}

/**
 * Expandable Section - Collapsible content area to reduce overwhelm
 */
export function ExpandableSection({
    title,
    children,
    icon = 'chevron-down-outline',
    defaultExpanded = false,
    accentColor,
}: ExpandableSectionProps) {
    const theme = useThemeColors();
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.expandableContainer}>
            <TouchableOpacity
                style={styles.expandableHeader}
                onPress={toggle}
                activeOpacity={0.7}
            >
                <Text style={[styles.expandableTitle, { color: accentColor || theme.textPrimary }]}>
                    {title}
                </Text>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={accentColor || theme.textSecondary}
                />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.expandableContent}>
                    {children}
                </View>
            )}
        </View>
    );
}

interface NumberedStepProps {
    number: number;
    title: string;
    content: string;
    accentColor?: string;
}

/**
 * Numbered Step - Visual step indicator for path-through content
 */
export function NumberedStep({ number, title, content, accentColor }: NumberedStepProps) {
    const theme = useThemeColors();
    const color = accentColor || theme.primary;

    return (
        <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: color }]}>
                <Text style={styles.stepNumberText}>{number}</Text>
            </View>
            <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>{title}</Text>
                <Text style={[styles.stepBody, { color: theme.textSecondary }]}>{content}</Text>
            </View>
        </View>
    );
}

interface BulletPointProps {
    content: string;
    icon?: keyof typeof Ionicons.glyphMap;
    accentColor?: string;
}

/**
 * Styled Bullet Point - More visual than plain text bullets
 */
export function BulletPoint({ content, icon = 'ellipse', accentColor }: BulletPointProps) {
    const theme = useThemeColors();

    return (
        <View style={styles.bulletContainer}>
            <Ionicons
                name={icon}
                size={icon === 'ellipse' ? 8 : 16}
                color={accentColor || theme.primary}
                style={styles.bulletIcon}
            />
            <Text style={[styles.bulletText, { color: theme.textPrimary }]}>{content}</Text>
        </View>
    );
}

interface QuoteBoxProps {
    quote: string;
    source?: string;
    accentColor?: string;
}

/**
 * Quote Box - For impactful quotes or key messages
 */
export function QuoteBox({ quote, source, accentColor }: QuoteBoxProps) {
    const theme = useThemeColors();
    const color = accentColor || theme.primary;

    return (
        <View style={[styles.quoteContainer, { borderLeftColor: color }]}>
            <Ionicons name="chatbubble-outline" size={20} color={color} style={styles.quoteIcon} />
            <Text style={[styles.quoteText, { color: theme.textPrimary }]}>"{quote}"</Text>
            {source && (
                <Text style={[styles.quoteSource, { color: theme.textSecondary }]}>— {source}</Text>
            )}
        </View>
    );
}

interface TransformationCardProps {
    from: string;
    to: string;
    accentColor?: string;
}

/**
 * Transformation Card - Visual representation of a single duality transformation
 */
export function TransformationCard({ from, to, accentColor }: TransformationCardProps) {
    const theme = useThemeColors();
    const color = accentColor || theme.primary;

    return (
        <GlassSurface style={styles.transformCard}>
            <Text style={[styles.transformFrom, { color: theme.textSecondary }]}>{from}</Text>
            <View style={styles.transformArrowContainer}>
                <LinearGradient
                    colors={[`${color}00`, color, `${color}00`]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.transformArrowLine}
                />
                <Ionicons name="arrow-forward-circle" size={24} color={color} />
            </View>
            <Text style={[styles.transformTo, { color: theme.textPrimary }]}>{to}</Text>
        </GlassSurface>
    );
}

const styles = StyleSheet.create({
    // Callout Box
    calloutContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderLeftWidth: 4,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginVertical: spacing.sm,
    },
    calloutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    calloutLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    calloutContent: {
        fontSize: 15,
        lineHeight: 22,
    },

    // Expandable Section
    expandableContainer: {
        marginVertical: spacing.sm,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    expandableTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    expandableContent: {
        paddingTop: spacing.md,
    },

    // Numbered Step
    stepContainer: {
        flexDirection: 'row',
        marginVertical: spacing.md,
        gap: spacing.md,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    stepBody: {
        fontSize: 15,
        lineHeight: 22,
    },

    // Bullet Point
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: spacing.xs,
        paddingRight: spacing.md,
    },
    bulletIcon: {
        marginTop: 6,
        marginRight: spacing.sm,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },

    // Quote Box
    quoteContainer: {
        borderLeftWidth: 3,
        paddingLeft: spacing.md,
        paddingVertical: spacing.sm,
        marginVertical: spacing.md,
    },
    quoteIcon: {
        marginBottom: spacing.xs,
        opacity: 0.6,
    },
    quoteText: {
        fontSize: 17,
        fontStyle: 'italic',
        lineHeight: 26,
    },
    quoteSource: {
        fontSize: 13,
        marginTop: spacing.sm,
    },

    // Transformation Card
    transformCard: {
        padding: spacing.md,
        marginVertical: spacing.xs,
        alignItems: 'center',
    },
    transformFrom: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    transformArrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xs,
    },
    transformArrowLine: {
        height: 2,
        width: 60,
        marginRight: -12,
    },
    transformTo: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
