import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Meditation } from '../types';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface MeditationCardProps {
  meditation: Meditation;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function MeditationCard({
  meditation,
  onPress,
  style,
}: MeditationCardProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const chipColors =
    theme.categoryChips[meditation.category] ??
    theme.categoryChips.All;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.surface, theme.cardBackground]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="play" size={24} color={theme.primary} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{meditation.title}</Text>
            {meditation.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={10} color={theme.accentGold} />
              </View>
            )}
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {meditation.description}
          </Text>

          <View style={styles.footer}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: chipColors.background,
                  borderColor: chipColors.border ?? 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: chipColors.text },
                ]}
              >
                {meditation.category}
              </Text>
            </View>
            <Text style={styles.duration}>
              {formatDuration(meditation.duration)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginBottom: spacing.lg,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? theme.bioluminescence.glow + '40' : theme.border,
      shadowColor: theme.mode === 'dark' ? theme.bioluminescence.glow : theme.shadowSoft,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: theme.mode === 'dark' ? 0.6 : 0.08,
      shadowRadius: theme.mode === 'dark' ? 20 : 8,
      elevation: theme.mode === 'dark' ? 8 : 3,
      backgroundColor: theme.cardBackground,
    },
    gradientBackground: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
    },
    iconContainer: {
      marginRight: spacing.md,
    },
    iconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.primarySubtle,
      opacity: 0.35,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      flex: 1,
      marginRight: spacing.sm,
    },
    premiumBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.accentGold,
      opacity: 0.7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      fontSize: typography.small,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryBadge: {
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.roundedChip,
    },
    categoryText: {
      fontSize: typography.tiny,
      color: theme.textPrimary,
      fontWeight: typography.semibold,
    },
    duration: {
      fontSize: typography.small,
      color: theme.textSecondary,
      opacity: 0.8,
      fontWeight: typography.medium,
    },
  });
