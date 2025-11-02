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

interface FeelingsExplainedCardProps {
  onOpenChapters: () => void;
  onOpenQuickHelp: () => void;
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

export default function FeelingsExplainedCard({
  onOpenChapters,
  onOpenQuickHelp,
  style,
}: FeelingsExplainedCardProps) {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);

  // Mint/sky glow color for the card
  const glowColor = theme.mode === 'dark' 
    ? theme.feelingsChapters.teal 
    : theme.feelingsChapters.sky;
  const glowTint = theme.mode === 'dark' 
    ? glowColor 
    : theme.feelingsChapters.sky;

  // Gradient background
  const baseGradient = theme.mode === 'dark'
    ? (['rgba(9, 19, 28, 0.85)', 'rgba(9, 19, 28, 0.75)'] as const)
    : ([theme.cardBackground, theme.cardBackground] as const);

  return (
    <View style={[styles.cardContainer, style]}>
      {theme.mode === 'light' && (
        <View
          pointerEvents="none"
          style={styles.lightLiftShadow}
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Feelings Explained - Open chapters or get quick help"
        style={({ pressed }) => [
          styles.card,
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
            <Text style={styles.title}>Feelings Explained</Text>
            <Text style={styles.subtitle}>
              Understand how emotions work and why they return.
            </Text>

            <View style={styles.ctaContainer}>
              <Pressable
                onPress={onOpenChapters}
                accessibilityRole="button"
                accessibilityLabel="Open Chapters"
                style={({ pressed }) => [
                  styles.ctaButton,
                  styles.ctaPrimary,
                  pressed && styles.ctaPressed,
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={theme.mode === 'dark' ? theme.textPrimary : theme.white}
                />
                <Text style={styles.ctaPrimaryText}>Open Chapters</Text>
              </Pressable>

              <Pressable
                onPress={onOpenQuickHelp}
                accessibilityRole="button"
                accessibilityLabel="Why am I feeling like this?"
                style={({ pressed }) => [
                  styles.ctaButton,
                  styles.ctaSecondary,
                  pressed && styles.ctaPressed,
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={theme.mode === 'dark' ? theme.feelingsChapters.sky : theme.textPrimary}
                />
                <Text style={styles.ctaSecondaryText}>
                  Why am I feeling like this?
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    cardContainer: {
      marginBottom: spacing.md,
    },
    lightLiftShadow: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 12,
      bottom: -12,
      borderRadius: borderRadius.lg,
      zIndex: 0,
      ...(require('react-native').Platform.OS === 'web'
        ? ({ boxShadow: '0 30px 60px rgba(2, 6, 23, 0.25), 0 10px 24px rgba(2, 6, 23, 0.12)' } as any)
        : null),
    },
    card: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      minHeight: 180,
    },
    gradientBackground: {
      padding: spacing.lg,
      minHeight: 180,
    },
    content: {
      gap: spacing.md,
    },
    title: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.textSecondary : theme.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
    ctaContainer: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    ctaPrimary: {
      backgroundColor: theme.mode === 'dark' 
        ? theme.feelingsChapters.teal 
        : theme.feelingsChapters.sky,
    },
    ctaSecondary: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)',
    },
    ctaPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    ctaPrimaryText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.mode === 'dark' ? theme.textPrimary : theme.white,
    },
    ctaSecondaryText: {
      fontSize: typography.body,
      fontWeight: typography.medium,
      color: theme.mode === 'dark' ? theme.feelingsChapters.sky : theme.textPrimary,
    },
  });

