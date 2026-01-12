import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { useUserStore, Milestone } from '../store/userStore';
import MoodTrends from '../components/MoodTrends';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);

  // User store data
  const completedTopics = useUserStore((s) => s.completedTopics);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const longestStreak = useUserStore((s) => s.longestStreak);
  const milestones = useUserStore((s) => s.milestones);
  const getTotalMinutes = useUserStore((s) => s.getTotalMinutes);
  const getCompletionPercentage = useUserStore((s) => s.getCompletionPercentage);

  const totalMinutes = getTotalMinutes();
  const completionPercentage = getCompletionPercentage();

  const unlockedMilestones = useMemo(() =>
    milestones.filter(m => m.unlockedAt !== null)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0)),
    [milestones]
  );

  const lockedMilestones = useMemo(() =>
    milestones.filter(m => m.unlockedAt === null),
    [milestones]
  );

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@orientation_completed');
      alert('Onboarding reset! Retrigger by visiting Essentials screen.');
    } catch (e) {
      console.error(e);
    }
  };

  const renderMilestoneBadge = (milestone: Milestone, isLocked: boolean) => (
    <View
      key={milestone.id}
      style={[
        styles.milestoneBadge,
        isLocked && styles.milestoneBadgeLocked
      ]}
    >
      <View style={[
        styles.milestoneIconContainer,
        isLocked && styles.milestoneIconLocked
      ]}>
        <Ionicons
          name={milestone.icon as any}
          size={24}
          color={isLocked ? theme.textMuted : theme.states.warning}
        />
      </View>
      <Text style={[
        styles.milestoneTitle,
        isLocked && styles.milestoneTitleLocked
      ]}>
        {milestone.title}
      </Text>
      <Text style={styles.milestoneDescription} numberOfLines={2}>
        {milestone.description}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#FFFFFF" />
          </View>
          <Text style={styles.name}>Your Journey</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{completionPercentage}% Complete</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
            <Text style={styles.statNumber}>{completedTopics.length}</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={28} color={theme.primary} />
            <Text style={styles.statNumber}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color={theme.states.warning} />
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Longest Streak */}
        {longestStreak > 0 && (
          <View style={styles.longestStreakContainer}>
            <Ionicons name="trophy-outline" size={18} color={theme.states.warning} />
            <Text style={styles.longestStreakText}>
              Longest Streak: {longestStreak} days
            </Text>
          </View>
        )}

        {/* Mood Trends */}
        <MoodTrends />

        {/* Milestones Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="ribbon-outline" size={18} color={theme.primary} /> Milestones
          </Text>

          {unlockedMilestones.length > 0 ? (
            <View style={styles.milestonesGrid}>
              {unlockedMilestones.map(m => renderMilestoneBadge(m, false))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Complete topics and check in daily to unlock milestones!</Text>
          )}

          {lockedMilestones.length > 0 && (
            <>
              <Text style={styles.lockedTitle}>Locked</Text>
              <View style={styles.milestonesGrid}>
                {lockedMilestones.slice(0, 4).map(m => renderMilestoneBadge(m, true))}
              </View>
            </>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {[
            { icon: 'notifications-outline', label: 'Notifications', onPress: undefined },
            { icon: 'download-outline', label: 'Downloads', onPress: undefined },
            {
              icon: 'settings-outline',
              label: 'Settings',
              onPress: () => navigation.navigate('Settings' as never)
            },
            { icon: 'help-circle-outline', label: 'Help & Support', onPress: undefined },
            { icon: 'information-circle-outline', label: 'About', onPress: undefined },
            {
              icon: 'refresh-circle-outline',
              label: 'Reset Onboarding',
              onPress: handleResetOnboarding
            },
          ].map((item) => (
            <TouchableOpacity
              style={styles.menuItem}
              key={item.label}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={theme.textSecondary} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xl,
      paddingTop: 60,
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: spacing.lg,
      zIndex: 10,
    },
    avatarContainer: {
      marginBottom: spacing.sm,
    },
    name: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: '#FFFFFF',
      marginBottom: spacing.md,
    },
    progressContainer: {
      width: '80%',
      alignItems: 'center',
    },
    progressBarBg: {
      width: '100%',
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    progressText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: typography.small,
      marginTop: spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: spacing.lg,
      marginTop: -spacing.lg,
      marginBottom: spacing.lg,
    },
    statCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    statNumber: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginTop: spacing.xs,
    },
    statLabel: {
      fontSize: typography.tiny,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
    longestStreakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
      gap: spacing.xs,
    },
    longestStreakText: {
      color: theme.textSecondary,
      fontSize: typography.small,
    },
    sectionContainer: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    milestonesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    milestoneBadge: {
      width: '47%',
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    milestoneBadgeLocked: {
      opacity: 0.5,
    },
    milestoneIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    milestoneIconLocked: {
      backgroundColor: theme.border,
    },
    milestoneTitle: {
      fontSize: typography.small,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    milestoneTitleLocked: {
      color: theme.textMuted,
    },
    milestoneDescription: {
      fontSize: typography.tiny,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: typography.small,
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
    lockedTitle: {
      fontSize: typography.small,
      color: theme.textMuted,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    menuContainer: {
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      marginLeft: spacing.sm,
    },
  });
