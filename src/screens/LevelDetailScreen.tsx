import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { getLevelById } from '../data/levels';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
  useGlowEnabled,
} from '../theme/colors';
import { useUserProgress } from '../context/UserProgressContext';
import PrimaryButton from '../components/PrimaryButton';
import WhyFeelingSheet from '../components/WhyFeelingSheet';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelDetailRouteProp = RouteProp<RootStackParamList, 'LevelDetail'>;

export default function LevelDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelDetailRouteProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const { levelId } = route.params;
  const level = getLevelById(levelId);
  
  // Use level-specific colors like LevelChapterScreen
  const luminousAccent = useMemo(() => {
    if (!level) {
      return theme.primary;
    }
    if (theme.mode === 'dark') {
      return (
        level.glowDark ||
        level.gradientDark?.[0] ||
        adjustColor(level.color, 8)
      );
    }
    return level.gradient?.[0] ?? adjustColor(level.color, -6);
  }, [level, theme]);
  
  // Get level-specific button color (toned down by 20% in dark theme)
  const buttonColor = useMemo(() => {
    if (!level) return theme.primary;
    const baseColor = theme.mode === 'dark'
      ? (level.glowDark || level.gradientDark?.[0] || level.color)
      : (level.gradient?.[0] || level.color);
    // Tone down by 20% in dark theme (80% opacity)
    return theme.mode === 'dark' ? toRgba(baseColor, 0.8) : baseColor;
  }, [level, theme]);
  
  const styles = useMemo(
    () => getStyles(theme, luminousAccent, glowEnabled),
    [theme, luminousAccent, glowEnabled]
  );
  const { progress, markLevelExplored, setCurrentLevel, markCourageEngaged } =
    useUserProgress();
  const [showWhyFeelingSheet, setShowWhyFeelingSheet] = useState(false);

  useEffect(() => {
    // Mark this level as explored when viewing
    if (level) {
      markLevelExplored(level.id);

      // If this is Courage (200), mark special engagement
      if (level.isThreshold) {
        markCourageEngaged();
      }
    }
  }, [level]);

  if (!level) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Level not found</Text>
      </View>
    );
  }

  const isCurrentLevel = progress?.currentLevel === level.id;

  // Use level-specific gradients like LevelChapterScreen
  const backgroundGradient = useMemo(() => {
    const base =
      level.gradient ??
      ([
        adjustColor(level.color, 12),
        adjustColor(level.color, -16),
      ] as const);
    const dark = level.gradientDark ?? base;
    const pair = theme.mode === 'dark' ? dark : base;
    const [start, end] = pair;
    const tail = adjustColor(
      end,
      theme.mode === 'dark' ? -8 : -24
    );
    return [start, end, tail] as const;
  }, [level.gradient, level.gradientDark, level.color, theme.mode]);
  
  // Use level-specific accent color
  const accentColor = luminousAccent;

  const handleSetAsCurrent = async () => {
    await setCurrentLevel(level.id);
  };

  const handleBeginPractice = () => {
    // For now, show a placeholder - will integrate with meditation player later
    // In production, this would navigate to the first meditation for this level
    alert(
      `Practice sessions for ${String(level.name || '')} will be available soon. The meditation scripts are being crafted with care.`
    );
  };

  return (
    <LinearGradient
      colors={backgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Header with gradient */}
      <LinearGradient
        colors={theme.mode === 'dark'
          ? (level.gradientDark ?? [
              adjustColor(level.color, 8),
              adjustColor(level.color, -12),
            ] as const)
          : (level.gradient ?? [
              adjustColor(level.color, 12),
              adjustColor(level.color, -16),
            ] as const)}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
          <Text style={styles.levelTitle}>
              {level.level < 200 ? `Transcending ${String(level.name || '')}` : String(level.name || '')}
          </Text>
            <TouchableOpacity
              onPress={() => setShowWhyFeelingSheet(true)}
              style={styles.infoButton}
            >
              <Ionicons name="information-circle-outline" size={24} color={theme.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.antithesisContainer}>
            <Ionicons name="arrow-forward" size={18} color={theme.white} />
            <Text style={styles.antithesisText}>
              {level.level < 200 ? `Through ${String(level.antithesis || '')}` : String(level.antithesis || '')}
            </Text>
          </View>

          {level.isThreshold && (
            <View style={styles.thresholdBadge}>
              <Ionicons name="star" size={16} color={theme.gold} />
              <Text style={styles.thresholdText}>
                The Threshold - Where Power Begins
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Understanding {String(level.name || '')}</Text>
          <Text style={styles.descriptionText}>{String(level.description || '')}</Text>
        </View>

        {/* Characteristics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Might Notice</Text>
          {level.characteristics.map((char, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{char}</Text>
            </View>
          ))}
        </View>

        {/* Physical Signs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Your Body</Text>
          {level.physicalSigns.map((sign, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons
                name="body-outline"
                size={16}
                color={accentColor}
              />
              <Text style={styles.listText}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* The Trap */}
        <View style={[styles.section, styles.trapSection]}>
          <View style={styles.trapHeader}>
            <Ionicons name="alert-circle" size={20} color={accentColor} />
            <Text style={styles.sectionTitle}>The Trap</Text>
          </View>
          <Text style={styles.trapText}>{String(level.trapDescription || '')}</Text>
        </View>

        {/* The Way Through */}
        <View style={[
          styles.section,
          styles.wayThroughSection,
          glowEnabled && theme.mode === 'dark' && {
            borderWidth: 2,
            borderColor: toRgba(accentColor, 0.6),
            shadowColor: accentColor,
            shadowOpacity: 0.3,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 2 },
            elevation: 0,
          },
          glowEnabled && theme.mode === 'light' && {
            borderWidth: 2,
            borderColor: toRgba(accentColor, 0.4),
            shadowColor: accentColor,
            shadowOpacity: 0.25,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 2 },
            elevation: 0,
          },
        ]}>
          <View style={styles.wayThroughHeader}>
            <Ionicons name="compass" size={20} color={accentColor} />
            <Text style={styles.sectionTitle}>The Way Through</Text>
          </View>
          <Text style={styles.wayThroughText}>{level.wayThrough}</Text>
        </View>

        {/* Practices Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practices</Text>
          <View style={styles.practicesPlaceholder}>
            <Ionicons name="time-outline" size={32} color={theme.textMuted} />
            <Text style={styles.placeholderText}>
              {level.estimatedTime} minutes of guided practice
            </Text>
            <Text style={styles.placeholderSubtext}>
              Meditation scripts are being crafted with care and integrity
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isCurrentLevel && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSetAsCurrent}
            >
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={accentColor}
              />
              <Text style={styles.secondaryButtonText}>
                Set as My Current Focus
              </Text>
            </TouchableOpacity>
          )}

          {isCurrentLevel && (
            <View style={[styles.currentFocusBadge, {
              backgroundColor: `${accentColor}20`,
              borderColor: accentColor,
            }]}>
              <Ionicons name="bookmark" size={20} color={accentColor} />
              <Text style={[styles.currentFocusText, { color: accentColor }]}>Your Current Focus</Text>
            </View>
          )}

          <PrimaryButton
            label="Begin Practice (Coming Soon)"
            onPress={handleBeginPractice}
            backgroundColor={buttonColor}
            textColor={theme.white}
          />
        </View>
      </ScrollView>
      
      <WhyFeelingSheet
        visible={showWhyFeelingSheet}
        onClose={() => setShowWhyFeelingSheet(false)}
        prefillEmotion={level.name}
      />
    </LinearGradient>
  );
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
  const hex = color.replace('#', '');
  const expand = (value: string) =>
    parseInt(value.length === 1 ? value + value : value, 16);
  const r = expand(hex.substring(0, hex.length >= 6 ? 2 : 1));
  const g = expand(
    hex.substring(
      hex.length >= 6 ? 2 : 1,
      hex.length >= 6 ? 4 : 2
    )
  );
  const b = expand(
    hex.substring(
      hex.length >= 6 ? 4 : 2,
      hex.length >= 6 ? 6 : 3
    )
  );
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

const getStyles = (theme: ThemeColors, accent: string, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: spacing.xxl,
      paddingHorizontal: spacing.lg,
      position: 'relative',
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    headerContent: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingTop: spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      width: '100%',
    },
    infoButton: {
      padding: spacing.xs,
    },
    levelTitle: {
      flex: 1,
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? '#F9FAFB' : theme.white,
      textAlign: 'center',
      textShadowColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.5)
          : 'rgba(167, 139, 250, 0.4)',
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 14,
    },
    antithesisContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    antithesisText: {
      fontSize: typography.h3,
      color:
        theme.mode === 'dark'
          ? toRgba(accent, 0.9)
          : theme.white,
      fontWeight: typography.medium,
    },
    thresholdBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.22)
          : 'rgba(167, 139, 250, 0.15)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      marginTop: spacing.sm,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.45)
          : toRgba(accent, 0.6),
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.5),
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.35),
        shadowColor: accent,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    thresholdText: {
      fontSize: typography.small,
      color:
        theme.mode === 'dark'
          ? toRgba(accent, 0.95)
          : accent,
      fontWeight: typography.semibold,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    descriptionText: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba('#E8F4F4', 0.82)
          : theme.textSecondary,
      lineHeight: 24,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: accent,
      marginTop: 8,
    },
    listText: {
      flex: 1,
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba('#E8F4F4', 0.78)
          : theme.textSecondary,
      lineHeight: 22,
    },
    trapSection: {
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.14)
          : 'rgba(139, 92, 246, 0.08)',
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.34)
          : 'rgba(139, 92, 246, 0.2)',
    },
    trapHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    trapText: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba('#F8FAFC', 0.9)
          : theme.textPrimary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    wayThroughSection: {
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.18)
          : 'rgba(167, 139, 250, 0.15)',
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.4)
          : 'rgba(139, 92, 246, 0.3)',
    },
    wayThroughHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    wayThroughText: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba('#F8FAFC', 0.88)
          : theme.textPrimary,
      lineHeight: 24,
      fontWeight: typography.medium,
    },
    practicesPlaceholder: {
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(4, 14, 22, 0.8)'
          : theme.cardBackground,
      padding: spacing.xxl,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      gap: spacing.sm,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.28)
          : 'rgba(139, 92, 246, 0.15)',
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.5),
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.3),
        shadowColor: accent,
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    placeholderText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    placeholderSubtext: {
      fontSize: typography.small,
      color: theme.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    actionsContainer: {
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.18)
          : 'rgba(167, 139, 250, 0.12)',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.38)
          : toRgba(accent, 0.5),
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.5),
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.35),
        shadowColor: accent,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    secondaryButtonText: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba(accent, 0.92)
          : theme.primary,
      fontWeight: typography.semibold,
    },
    currentFocusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.24)
          : 'rgba(167, 139, 250, 0.15)',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.52)
          : toRgba(accent, 0.6),
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.6),
        shadowColor: accent,
        shadowOpacity: 0.3,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        borderColor: toRgba(accent, 0.4),
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    currentFocusText: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba(accent, 0.92)
          : theme.primary,
      fontWeight: typography.semibold,
    },
    errorText: {
      fontSize: typography.body,
      color: theme.error,
      textAlign: 'center',
      marginTop: spacing.xxl,
    },
  });

