import React, { useEffect } from 'react';
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
} from '../theme/colors';
import { useUserProgress } from '../context/UserProgressContext';
import PrimaryButton from '../components/PrimaryButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelDetailRouteProp = RouteProp<RootStackParamList, 'LevelDetail'>;

export default function LevelDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelDetailRouteProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const { progress, markLevelExplored, setCurrentLevel, markCourageEngaged } =
    useUserProgress();

  const { levelId } = route.params;
  const level = getLevelById(levelId);

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

  const handleSetAsCurrent = async () => {
    await setCurrentLevel(level.id);
  };

  const handleBeginPractice = () => {
    // For now, show a placeholder - will integrate with meditation player later
    // In production, this would navigate to the first meditation for this level
    alert(
      `Practice sessions for ${level.name} will be available soon. The meditation scripts are being crafted with care.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={[level.color, adjustColor(level.color, -20)]}
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
          <Text style={styles.levelTitle}>
            {level.level < 200 ? `Transcending ${level.name}` : level.name}
          </Text>

          <View style={styles.antithesisContainer}>
            <Ionicons name="arrow-forward" size={18} color={theme.white} />
            <Text style={styles.antithesisText}>
              {level.level < 200 ? `Through ${level.antithesis}` : level.antithesis}
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
          <Text style={styles.sectionTitle}>Understanding {level.name}</Text>
          <Text style={styles.descriptionText}>{level.description}</Text>
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
                color={theme.accentTeal}
              />
              <Text style={styles.listText}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* The Trap */}
        <View style={[styles.section, styles.trapSection]}>
          <View style={styles.trapHeader}>
            <Ionicons name="alert-circle" size={20} color={theme.warning} />
            <Text style={styles.sectionTitle}>The Trap</Text>
          </View>
          <Text style={styles.trapText}>{level.trapDescription}</Text>
        </View>

        {/* The Way Through */}
        <View style={[styles.section, styles.wayThroughSection]}>
          <View style={styles.wayThroughHeader}>
            <Ionicons name="compass" size={20} color={theme.accentTeal} />
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
                color={theme.primary}
              />
              <Text style={styles.secondaryButtonText}>
                Set as My Current Focus
              </Text>
            </TouchableOpacity>
          )}

          {isCurrentLevel && (
            <View style={styles.currentFocusBadge}>
              <Ionicons name="bookmark" size={20} color={theme.accentTeal} />
              <Text style={styles.currentFocusText}>Your Current Focus</Text>
            </View>
          )}

          <PrimaryButton
            label="Begin Practice (Coming Soon)"
            onPress={handleBeginPractice}
          />
        </View>
      </ScrollView>
    </View>
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

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: spacing.xxl,
      paddingHorizontal: spacing.lg,
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
    levelTitle: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.white,
      textAlign: 'center',
    },
    antithesisContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    antithesisText: {
      fontSize: typography.h3,
      color: theme.white,
      fontWeight: typography.medium,
    },
    thresholdBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: 'rgba(212, 175, 55, 0.3)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      marginTop: spacing.sm,
    },
    thresholdText: {
      fontSize: typography.small,
      color: theme.gold,
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
      color: theme.textSecondary,
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
      backgroundColor: theme.primary,
      marginTop: 8,
    },
    listText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    trapSection: {
      backgroundColor: theme.warningSubtle,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.warning,
    },
    trapHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    trapText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    wayThroughSection: {
      backgroundColor: theme.primarySubtle,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.accentTeal,
    },
    wayThroughHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    wayThroughText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      fontWeight: typography.medium,
    },
    practicesPlaceholder: {
      backgroundColor: theme.cardBackground,
      padding: spacing.xxl,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
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
      backgroundColor: theme.cardBackground,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    secondaryButtonText: {
      fontSize: typography.body,
      color: theme.primary,
      fontWeight: typography.semibold,
    },
    currentFocusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: theme.primarySubtle,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.accentTeal,
    },
    currentFocusText: {
      fontSize: typography.body,
      color: theme.accentTeal,
      fontWeight: typography.semibold,
    },
    errorText: {
      fontSize: typography.body,
      color: theme.error,
      textAlign: 'center',
      marginTop: spacing.xxl,
    },
  });
