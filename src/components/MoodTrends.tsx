import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius, ThemeColors } from '../theme/colors';
import { useUserStore, CheckInEntry } from '../store/userStore';
import { Zone } from '../store/onboardingStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 4;
const CHART_HEIGHT = 120;

// Map zones to positions (lower = more stress, higher = more peace)
const ZONE_VALUES: Record<Zone, number> = {
    [Zone.Shame]: 1,
    [Zone.Guilt]: 2,
    [Zone.Apathy]: 3,
    [Zone.Grief]: 4,
    [Zone.Fear]: 5,
    [Zone.Desire]: 6,
    [Zone.Anger]: 7,
    [Zone.Pride]: 8,
    [Zone.Pivot]: 9,
    [Zone.Flow]: 10,
    [Zone.Source]: 11,
};

const ZONE_COLORS: Record<Zone, string> = {
    [Zone.Shame]: '#4A1A4A',
    [Zone.Guilt]: '#1E3A3A',
    [Zone.Apathy]: '#3A3A3A',
    [Zone.Grief]: '#1E2B4E',
    [Zone.Fear]: '#6B0000',
    [Zone.Desire]: '#8B4513',
    [Zone.Anger]: '#B22222',
    [Zone.Pride]: '#7C3AED',
    [Zone.Pivot]: '#22C55E',
    [Zone.Flow]: '#3B82F6',
    [Zone.Source]: '#F59E0B',
};

interface MoodTrendsProps {
    maxEntries?: number;
}

export default function MoodTrends({ maxEntries = 7 }: MoodTrendsProps) {
    const theme = useThemeColors();
    const styles = getStyles(theme);
    const checkInHistory = useUserStore((s) => s.checkInHistory);

    const recentEntries = useMemo(() => {
        return checkInHistory.slice(0, maxEntries).reverse();
    }, [checkInHistory, maxEntries]);

    if (recentEntries.length < 2) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    <Ionicons name="analytics-outline" size={18} color={theme.primary} /> Mood Trends
                </Text>
                <Text style={styles.emptyText}>
                    Check in at least twice to see your mood trends!
                </Text>
            </View>
        );
    }

    const minValue = Math.min(...recentEntries.map(e => ZONE_VALUES[e.zone]));
    const maxValue = Math.max(...recentEntries.map(e => ZONE_VALUES[e.zone]));
    const range = Math.max(maxValue - minValue, 2);

    const points = recentEntries.map((entry, i) => {
        const x = (i / (recentEntries.length - 1)) * CHART_WIDTH;
        const normalized = (ZONE_VALUES[entry.zone] - minValue) / range;
        const y = CHART_HEIGHT - (normalized * (CHART_HEIGHT - 20) + 10);
        return { x, y, entry };
    });

    // Calculate trend
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    const firstAvg = firstHalf.reduce((sum, e) => sum + ZONE_VALUES[e.zone], 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + ZONE_VALUES[e.zone], 0) / secondHalf.length;
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';

    const trendIcon = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove-outline';
    const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : theme.textSecondary;
    const trendLabel = trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable';

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>
                    <Ionicons name="analytics-outline" size={18} color={theme.primary} /> Mood Trends
                </Text>
                <View style={styles.trendBadge}>
                    <Ionicons name={trendIcon} size={16} color={trendColor} />
                    <Text style={[styles.trendText, { color: trendColor }]}>{trendLabel}</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                {/* Draw lines between points */}
                <View style={styles.chart}>
                    {points.map((point, i) => {
                        if (i === 0) return null;
                        const prev = points[i - 1];
                        const dx = point.x - prev.x;
                        const dy = point.y - prev.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                        return (
                            <View
                                key={`line-${i}`}
                                style={[
                                    styles.line,
                                    {
                                        width: length,
                                        left: prev.x,
                                        top: prev.y,
                                        transform: [{ rotate: `${angle}deg` }],
                                        backgroundColor: theme.primary,
                                    },
                                ]}
                            />
                        );
                    })}

                    {/* Draw dots */}
                    {points.map((point, i) => (
                        <View
                            key={`dot-${i}`}
                            style={[
                                styles.dot,
                                {
                                    left: point.x - 6,
                                    top: point.y - 6,
                                    backgroundColor: ZONE_COLORS[point.entry.zone],
                                    borderColor: theme.cardBackground,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Labels */}
                <View style={styles.labelsRow}>
                    {recentEntries.map((entry, i) => (
                        <Text key={i} style={styles.dateLabel}>
                            {new Date(entry.timestamp).toLocaleDateString('en', { weekday: 'short' })}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
}

const getStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.cardBackground,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: theme.border,
            marginHorizontal: spacing.md,
            marginBottom: spacing.lg,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        title: {
            fontSize: typography.h4,
            fontWeight: typography.bold,
            color: theme.textPrimary,
        },
        trendBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        trendText: {
            fontSize: typography.small,
            fontWeight: typography.semibold,
        },
        emptyText: {
            color: theme.textSecondary,
            fontSize: typography.small,
            textAlign: 'center',
            paddingVertical: spacing.lg,
        },
        chartContainer: {
            height: CHART_HEIGHT + 30,
        },
        chart: {
            height: CHART_HEIGHT,
            position: 'relative',
        },
        line: {
            position: 'absolute',
            height: 2,
            transformOrigin: 'left center',
            borderRadius: 1,
        },
        dot: {
            position: 'absolute',
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
        },
        labelsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.sm,
            paddingHorizontal: spacing.xs,
        },
        dateLabel: {
            fontSize: typography.tiny,
            color: theme.textMuted,
            textAlign: 'center',
        },
    });
