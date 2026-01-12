import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { FeelingChapter, ChapterProgress } from '../types';

interface ChapterCardProps {
  chapter: FeelingChapter;
  progress?: ChapterProgress;
  onPress: () => void;
  style?: ViewStyle;
}

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function ChapterCard({
  chapter,
  progress,
  onPress,
  style,
}: ChapterCardProps) {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);

  // Get glow color based on chapter
  const glowColor = theme.feelingsChapters[chapter.glowColor];
  const glowTint = theme.mode === 'dark' ? glowColor : glowColor;

  // Calculate progress percentage
  const progressPercent = progress?.readProgress || 0;

  // Gradient background
  const baseGradient = theme.mode === 'dark'
    ? (['rgba(9, 19, 28, 0.85)', 'rgba(9, 19, 28, 0.75)'] as const)
    : ([theme.cardBackground, theme.cardBackground] as const);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${chapter.title} chapter, ${String(chapter.readTime)} minutes`}
      accessibilityHint="Tap to read this chapter"
      style={({ pressed }) => [
        styles.cardContainer,
        style,
        theme.mode === 'dark'
          ? (glowEnabled
              ? {
                  borderWidth: 2,
                  borderColor: toRgba(glowTint, 0.8),
                  shadowColor: glowTint,
                  shadowOpacity: 0.34,
                  backgroundColor: 'rgba(9, 19, 28, 0.75)',
                  boxShadow: [
                    `0 0 30px ${toRgba(glowTint, 0.53)}`,
                    `0 0 60px ${toRgba(glowTint, 0.27)}`,
                    `inset 0 0 20px ${toRgba(glowTint, 0.13)}`,
                  ].join(', '),
                }
              : {
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  backgroundColor: 'rgba(9, 19, 28, 0.7)',
                })
          : (glowEnabled
              ? {
                  borderWidth: 2,
                  borderColor: toRgba(glowTint, 0.95),
                  shadowColor: glowTint,
                  shadowOpacity: 0.4,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 6,
                  backgroundColor: theme.cardBackground,
                  boxShadow: [
                    `0 18px 50px rgba(2, 6, 23, 0.22)`,
                    `0 2px 8px rgba(2, 6, 23, 0.10)`,
                    `0 0 3px ${toRgba(glowTint, 0.8)}`,
                    `0 0 30px ${toRgba(glowTint, 0.5)}`,
                    `0 0 60px ${toRgba(glowTint, 0.25)}`,
                  ].join(', '),
                  transform: pressed ? [{ translateY: -3 }] : [],
                }
              : {
                  borderWidth: 1,
                  borderColor: 'rgba(2,6,23,0.08)',
                  shadowColor: 'rgba(2,6,23,0.32)',
                  shadowOpacity: 1,
                  shadowRadius: 22,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 6,
                  backgroundColor: theme.cardBackground,
                  boxShadow: [
                    `0 12px 24px rgba(15, 23, 42, 0.10)`,
                    `0 8px 20px rgba(15, 23, 42, 0.08)`,
                    `0 1px 2px rgba(2, 6, 23, 0.06)`,
                  ].join(', '),
                  transform: pressed ? [{ translateY: -3 }] : [],
                }),
      ]}
    >
      <LinearGradient
        colors={baseGradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {String(chapter.title || '')}
            </Text>
            {progressPercent > 0 && (
              <View style={styles.progressRing}>
                <View
                  style={[
                    styles.progressRingFill,
                    {
                      width: `${progressPercent * 100}%`,
                      backgroundColor: glowColor,
                    },
                  ]}
                />
              </View>
            )}
          </View>

          <Text style={styles.summary} numberOfLines={2}>
            {String(chapter.summary || '')}
          </Text>

          <View style={styles.footer}>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>
                {String(chapter.readTime)}–{String(chapter.readTime + 2)} min
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.textMuted}
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      minHeight: 140,
      marginBottom: spacing.md,
    },
    gradientBackground: {
      padding: spacing.md,
      minHeight: 140,
    },
    content: {
      flex: 1,
      gap: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary,
      lineHeight: 22,
    },
    progressRing: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressRingFill: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      opacity: 0.6,
    },
    summary: {
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 18,
      marginTop: spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    timePill: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
    },
    timeText: {
      fontSize: typography.tiny,
      fontWeight: typography.medium,
      color: theme.textMuted,
    },
  });

