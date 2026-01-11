import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { essentialItems, EssentialItem } from '../data/essentials';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';

interface RelatedItem {
    id: string;
    reason?: string;
}

interface RelatedNextCardProps {
    relatedIds: string[];
    currentScreenId?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Premium colors (matching app theme)
const COLORS = {
    teal: '#14b8a6',
    purple: '#a855f7',
    gold: '#fbbf24',
    textLight: '#e0f2fe',
    textMuted: '#94a3b8',
};

// Map of related items with reasons (can be extended)
const relatedReasons: Record<string, string> = {
    'feelings-explained': 'Understand what feelings actually are',
    'letting-go': 'The core practice for releasing emotions',
    'what-you-really-are': 'The foundational understanding',
    'natural-happiness': 'Your true nature beneath the blocks',
    'power-vs-force': 'Why alignment beats struggle',
    'intention': 'Why motive changes everything',
    'fatigue-vs-energy': 'How energy leaks show up as tiredness',
    'non-reactivity': 'What changes when you stop feeding reactions',
    'tension': 'Understanding the pressure beneath stress',
    'preventing-stress': 'Getting to the root of anxiety',
    'knowledge': 'Why practice matters more than theory',
    'addiction': 'Freedom through understanding happiness',
    'music-as-tool': 'How energy quality affects you',
    'shadow-work': 'Healing through self-compassion',
    'relaxing': 'Letting the body unwind naturally',
    'positive-reprogramming': 'Replacing limiting beliefs',
    'effort': 'When trying less achieves more',
    'fulfillment-vs-satisfaction': 'Why desire never satisfies',
    'levels-of-truth': 'Understanding different perspectives',
    'mantras': 'Simple phrases that calm the mind',
};

const RelatedNextCard: React.FC<RelatedNextCardProps> = ({
    relatedIds,
    currentScreenId,
}) => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();

    // Filter out current screen and get related items
    const relatedItems = relatedIds
        .filter((id) => id !== currentScreenId)
        .slice(0, 3)
        .map((id) => {
            const item = essentialItems.find((e) => e.id === id);
            return item ? { ...item, reason: relatedReasons[id] } : null;
        })
        .filter(Boolean) as (EssentialItem & { reason?: string })[];

    if (relatedItems.length === 0) return null;

    const handlePress = (item: EssentialItem) => {
        if (item.route.screen === 'Chapter' || item.route.screen === 'LearnHub') {
            navigation.navigate(item.route.screen as any, item.route.params as any);
        } else {
            navigation.navigate(item.route.screen as any);
        }
    };

    const handleBackToMandala = () => {
        navigation.navigate('Essentials' as never);
    };

    const iconColors = [COLORS.teal, COLORS.purple, COLORS.gold];

    return (
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="compass-outline" size={18} color={COLORS.teal} />
                <Text style={[styles.headerText, { color: theme.textPrimary }]}>
                    Related Next
                </Text>
            </View>

            {/* Related items */}
            <View style={styles.itemsContainer}>
                {relatedItems.map((item, index) => (
                    <Pressable
                        key={item.id}
                        style={({ pressed }) => [
                            styles.item,
                            {
                                backgroundColor: pressed
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'transparent',
                                borderColor: theme.border,
                            },
                        ]}
                        onPress={() => handlePress(item)}
                    >
                        <View style={styles.itemContent}>
                            <View style={styles.itemHeader}>
                                <Ionicons
                                    name={item.icon || 'ellipse'}
                                    size={16}
                                    color={iconColors[index % iconColors.length]}
                                />
                                <Text
                                    style={[styles.itemTitle, { color: theme.textPrimary }]}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                            </View>
                            {item.reason && (
                                <Text
                                    style={[styles.itemReason, { color: theme.textSecondary }]}
                                    numberOfLines={1}
                                >
                                    {item.reason}
                                </Text>
                            )}
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={theme.textSecondary}
                        />
                    </Pressable>
                ))}
            </View>

            {/* Back to Mandala button */}
            <TouchableOpacity
                style={[styles.backButton, { borderColor: theme.border }]}
                onPress={handleBackToMandala}
                activeOpacity={0.7}
            >
                <Ionicons name="apps-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.backButtonText}>Back to Essentials</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.xl,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerText: {
        fontSize: typography.h4,
        fontWeight: '600',
        marginLeft: spacing.sm,
    },
    itemsContainer: {
        gap: spacing.sm,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    itemContent: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: spacing.sm,
    },
    itemReason: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 24,
        fontStyle: 'italic',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    backButtonText: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginLeft: spacing.sm,
        fontWeight: '500',
    },
});

export default RelatedNextCard;
