import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Meditation } from '../types';
import {
  useThemeColors,
  useGlowEnabled,
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

// Helper to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const toRgba = (color: string, alpha = 1): string => {
  const sanitized = color.replace('#', '');
  const expand = (value: string) =>
    parseInt(value.length === 1 ? value + value : value, 16);
  const r = expand(sanitized.substring(0, sanitized.length >= 6 ? 2 : 1));
  const g = expand(
    sanitized.substring(
      sanitized.length >= 6 ? 2 : 1,
      sanitized.length >= 6 ? 4 : 2
    )
  );
  const b = expand(
    sanitized.substring(
      sanitized.length >= 6 ? 4 : 2,
      sanitized.length >= 6 ? 6 : 3
    )
  );
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

// Vibrant glow colors (separate from card colors) - diverse colors like journey cards
const glowColors: Record<string, string> = {
  'Find Peace': '#8B5CF6', // vibrant violet (replacing sage green)
  'Let Go': '#5FB5A9', // vibrant cyan/teal (like Apathy journey card)
  'Discover Joy': '#FBBF24', // vibrant gold/yellow (like Guilt/Desire journey cards)
  'Be Present': '#FB923C', // vibrant peach/orange (like Grief journey card)
  'Rest Deeply': '#60A5FA', // vibrant blue (like Anger journey card)
};

// Color mapping for meditation categories
const getCategoryColor = (category: string, theme: ThemeColors): string => {
  // Light mode colors (bright, visible on light background)
  const lightColors: Record<string, string> = {
    'Find Peace': '#C4B5FD', // violet300
    'Let Go': '#B8D7E4', // mist400
    'Discover Joy': '#E6CFA8', // gold300
    'Be Present': '#E8E2D8', // sand200
    'Rest Deeply': '#3E7C75', // teal700
  };
  
  // Dark mode colors - keep cards muted, but use vibrant colors for glows
  const darkColors: Record<string, string> = {
    'Find Peace': '#2E4A3F', // dark sage - muted card color
    'Let Go': '#2E4A52', // dark mist/teal - muted card color
    'Discover Joy': '#4A3D2E', // dark gold/brown - muted card color
    'Be Present': '#3A3732', // dark sand - muted card color
    'Rest Deeply': '#1C3A35', // darker teal - muted card color
  };
  
  return theme.mode === 'dark' 
    ? (darkColors[category] || '#5FB5A9')
    : (lightColors[category] || theme.accentTeal);
};

export default function MeditationCard({
  meditation,
  onPress,
  style,
}: MeditationCardProps) {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${String(mins)} min`;
  };

  const chipColors =
    theme.categoryChips[meditation.category] ??
    theme.categoryChips.All;

  // Get category color for card background (muted in dark mode)
  const categoryColor = getCategoryColor(meditation.category, theme);
  
  // Get vibrant glow color (separate from card color) - diverse colors like journey cards
  const getGlowColor = (category: string, theme: ThemeColors): string => {
    // Use the vibrant glow colors that match journey card diversity
    return theme.mode === 'dark' 
      ? (glowColors[category] || '#5FB5A9')
      : categoryColor;
  };
  
  const glowColor = getGlowColor(meditation.category, theme);
  
  // For dark mode, keep card background muted/dark
  // For light mode, use neutral card background
  const darkBaseHex = '#091C1C'; // Dark background color
  const baseGradient = theme.mode === 'dark'
    ? ([
        darkBaseHex, // Start with dark base
        adjustColor(categoryColor, -20), // Muted category tint
      ] as const)
    : ([theme.cardBackground, theme.cardBackground] as const);
  
  // Glow color: use vibrant glow color, make it even brighter for maximum impact
  const glowBase = theme.mode === 'dark'
    ? adjustColor(glowColor, 20) // Make glow color even brighter
    : categoryColor;
  const glowTint = theme.mode === 'dark' 
    ? glowBase // Use bright glow color directly
    : adjustColor(glowBase, -12);
  
  // Determine if text should be light (for dark cards in dark mode)
  const useLightText = theme.mode === 'dark';

  return (
    <View
      style={[
        styles.cardContainer,
        theme.mode === 'light' && !glowEnabled
          ? ({ boxShadow: 'none', filter: 'none' } as any)
          : null,
      ]}
    >
      {theme.mode === 'light' && (
        <View
          pointerEvents="none"
          style={styles.lightLiftShadow}
        />
      )}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          style,
          theme.mode === 'dark'
            ? (glowEnabled
                ? {
                    borderWidth: 2,
                    borderColor: toRgba(glowTint, 0.8), // Focused border glow (like journey cards)
                    shadowColor: glowTint,
                    shadowOpacity: 0.34, // Match journey cards
                    backgroundColor: 'rgba(9, 19, 28, 0.75)', // Match journey cards
                    boxShadow: [
                      `0 0 30px ${toRgba(glowTint, 0.53)}`, // Tighter glow (like journey cards)
                      `0 0 60px ${toRgba(glowTint, 0.27)}`, // Outer glow
                      `inset 0 0 20px ${toRgba(glowTint, 0.13)}`, // Subtle inset glow
                    ].join(', '),
                  }
                : {
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    backgroundColor: 'rgba(9, 19, 28, 0.7)', // More transparent to show gradient
                  })
            : (glowEnabled
                ? {
                    borderWidth: 2,
                    borderColor: toRgba(glowTint, 0.95), // Focused border glow
                    shadowColor: glowTint,
                    shadowOpacity: 0.4, // Reduced for tighter glow
                    shadowRadius: 24, // Smaller radius for focused glow
                    shadowOffset: { width: 0, height: 10 }, // Less offset
                    elevation: 6, // Reduced elevation
                    backgroundColor: theme.cardBackground,
                    boxShadow: [
                      `0 18px 50px rgba(2, 6, 23, 0.22)`,
                      `0 2px 8px rgba(2, 6, 23, 0.10)`,
                      `0 0 3px ${toRgba(glowTint, 0.8)}`, // Tighter edge glow
                      `0 0 30px ${toRgba(glowTint, 0.5)}`, // Focused glow
                      `0 0 60px ${toRgba(glowTint, 0.25)}`, // Subtle outer glow
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
          key={`${theme.mode}-${glowEnabled ? 1 : 0}-${meditation.id}`}
          colors={baseGradient}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {glowEnabled && (
            theme.mode === 'dark' ? (
              <View
                pointerEvents="none"
                style={[
                  styles.cardGlow,
                  {
                    backgroundColor: toRgba(glowTint, 0.15), // Reduced opacity for tighter glow
                    shadowColor: toRgba(glowTint, 0.6), // Reduced shadow brightness
                    boxShadow: [
                      `0 0 25px ${toRgba(glowTint, 0.4)}`, // Tighter glow layer
                      `0 0 50px ${toRgba(glowTint, 0.2)}`, // Subtle outer glow
                    ].join(', '),
                  },
                ]}
              />
            ) : (
              <View
                pointerEvents="none"
                style={[
                  styles.lightHalo,
                  {
                    boxShadow: [
                      `0 0 40px ${toRgba(glowTint, 0.3)}`, // Tighter glow
                      `0 0 80px ${toRgba(glowTint, 0.15)}`, // Subtle outer glow
                    ].join(', '),
                  },
                ]}
              />
            )
          )}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              useLightText && {
                backgroundColor: toRgba(glowBase, 0.25),
                opacity: 0.6,
              },
            ]}
          >
            <Ionicons
              name="play"
              size={24}
              color={
                useLightText
                  ? (glowEnabled
                      ? toRgba(glowBase, 0.95)
                      : theme.textLight || '#E8F1F2')
                  : theme.primary
              }
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                useLightText && { color: theme.textLight || '#E8F1F2' },
              ]}
              numberOfLines={1}
            >
              {meditation.title}
            </Text>
            {meditation.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={10} color={theme.accentGold} />
              </View>
            )}
          </View>

          <Text
            style={[
              styles.description,
              useLightText && { color: theme.textLight || '#C7D2D4' },
            ]}
            numberOfLines={2}
          >
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
            <Text
              style={[
                styles.duration,
                useLightText && { color: theme.textLight || '#B7C7C9' },
              ]}
            >
              {formatDuration(meditation.duration)}
            </Text>
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
      marginBottom: spacing.lg,
      position: 'relative',
    },
    lightLiftShadow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: borderRadius.lg,
      backgroundColor: 'transparent',
      shadowColor: 'rgba(2, 6, 23, 0.12)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 0,
    },
    card: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    cardGlow: {
      position: 'absolute',
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: borderRadius.lg + 8,
      opacity: 0.8, // Increased opacity
    },
    lightHalo: {
      position: 'absolute',
      top: -60,
      left: -60,
      right: -60,
      bottom: -60,
      borderRadius: borderRadius.lg + 60,
      backgroundColor: 'transparent',
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
