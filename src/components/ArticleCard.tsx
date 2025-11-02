import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Article } from '../types';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

interface ArticleCardProps {
  article: Article;
  onPress?: (article: Article) => void;
  style?: ViewStyle;
}

export default function ArticleCard({ article, onPress, style }: ArticleCardProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const stageKey = article.stage.toLowerCase() as keyof typeof theme.experience;
  const stageToken =
    theme.experience[stageKey] ?? theme.experience.settle;

  const handlePress = () => {
    if (onPress) {
      onPress(article);
    }
  };

  const pressable = Boolean(onPress);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={pressable ? 0.85 : 1}
      onPress={pressable ? handlePress : undefined}
      disabled={!pressable}
      accessibilityRole={pressable ? 'button' : undefined}
    >
      <View
        style={[
          styles.stagePill,
          { backgroundColor: stageToken.accent ?? theme.primarySubtle },
        ]}
      >
        <Text style={styles.stageText}>{String(article.stage || '')}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {String(article.title || '')}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {String(article.summary || '')}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{String(article.source || '')}</Text>
        <View style={styles.metaDot} />
        <Text style={styles.metaText}>{String(article.readingTime || 0)} min read</Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 240,
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    stagePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.roundedChip,
      marginBottom: spacing.sm,
    },
    stageText: {
      fontSize: typography.tiny,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    summary: {
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 'auto',
    },
    metaText: {
      fontSize: typography.tiny,
      color: theme.textMuted,
    },
    metaDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.textMuted,
      marginHorizontal: spacing.xs,
    },
  });
