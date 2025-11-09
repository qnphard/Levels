import { ThemeColors, spacing, typography, borderRadius } from '../theme/colors';

// Color constants for card types
export const CARD_COLORS = {
  keyInsight: '#8B5CF6', // Purple
  power: '#60A5FA', // Blue
  force: '#F87171', // Red
  practice: '#34D399', // Green
  warning: '#FB923C', // Orange
  highlight: '#FBBF24', // Yellow
};

// Helper function to create card styles based on theme
export const createCardStyles = (theme: ThemeColors) => {
  const isDark = theme.mode === 'dark';
  
  return {
    // Key Insight Card (Purple-tinted)
    keyInsightCard: {
      backgroundColor: isDark
        ? 'rgba(139, 92, 246, 0.2)'
        : 'rgba(139, 92, 246, 0.1)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(139, 92, 246, 0.4)'
        : 'rgba(139, 92, 246, 0.3)',
    },
    keyInsightHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    keyInsightTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: CARD_COLORS.keyInsight,
    },
    keyInsightText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      lineHeight: 26,
    },

    // Comparison Card (Neutral background)
    comparisonCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    comparisonTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    comparisonRow: {
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    comparisonItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
    },
    comparisonText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    comparisonNote: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontStyle: 'italic' as const,
      marginTop: spacing.xs,
    },

    // Practice Card (Green-tinted)
    practiceCard: {
      backgroundColor: isDark
        ? 'rgba(52, 211, 153, 0.15)'
        : 'rgba(52, 211, 153, 0.1)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(52, 211, 153, 0.3)'
        : 'rgba(52, 211, 153, 0.2)',
    },
    practiceHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    practiceTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    practiceText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.sm,
    },
    practiceInsight: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: isDark
        ? 'rgba(52, 211, 153, 0.2)'
        : 'rgba(52, 211, 153, 0.15)',
    },
    practiceInsightText: {
      flex: 1,
      fontSize: typography.small,
      fontStyle: 'italic' as const,
      color: theme.textSecondary,
      lineHeight: 20,
    },

    // Warning Card (Orange-tinted)
    warningCard: {
      backgroundColor: isDark
        ? 'rgba(251, 146, 60, 0.15)'
        : 'rgba(251, 146, 60, 0.1)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(251, 146, 60, 0.3)'
        : 'rgba(251, 146, 60, 0.2)',
      borderLeftWidth: 4,
      borderLeftColor: CARD_COLORS.warning,
    },
    warningHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    warningTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: CARD_COLORS.warning,
    },
    warningText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },

    // Quote Card (Subtle purple)
    quoteCard: {
      backgroundColor: isDark
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: CARD_COLORS.keyInsight,
    },
    quoteText: {
      fontSize: typography.body,
      fontStyle: 'italic' as const,
      color: theme.textPrimary,
      lineHeight: 24,
    },

    // Summary Card (Soft purple)
    summaryCard: {
      backgroundColor: isDark
        ? 'rgba(139, 92, 246, 0.12)'
        : 'rgba(139, 92, 246, 0.06)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(139, 92, 246, 0.25)'
        : 'rgba(139, 92, 246, 0.15)',
    },
    summaryText: {
      fontSize: typography.body,
      fontWeight: typography.medium,
      color: theme.textPrimary,
      lineHeight: 24,
      fontStyle: 'italic' as const,
    },

    // Common paragraph style
    paragraph: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 26,
      marginBottom: spacing.lg,
    },

    // Card icon header (reusable)
    cardIconHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
  };
};

