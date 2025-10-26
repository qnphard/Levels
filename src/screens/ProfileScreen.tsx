import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);

  const userStats = {
    name: 'Guest',
    isPremium: false,
    meditationsCompleted: 0,
    totalMinutes: 0,
    streakDays: 0,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={theme.gradients.horizonEvening} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={theme.headingOnGradient} />
        </View>
        <Text style={styles.name}>{userStats.name}</Text>
        {!userStats.isPremium && (
          <TouchableOpacity style={styles.premiumButton}>
            <Ionicons name="star" size={16} color={theme.accentGold} />
            <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
          <Text style={styles.statNumber}>{userStats.meditationsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time" size={28} color={theme.primary} />
          <Text style={styles.statNumber}>{userStats.totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame" size={28} color={theme.states.warning} />
          <Text style={styles.statNumber}>{userStats.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {[
          { icon: 'notifications-outline', label: 'Notifications' },
          { icon: 'download-outline', label: 'Downloads' },
          { icon: 'settings-outline', label: 'Settings' },
          { icon: 'help-circle-outline', label: 'Help & Support' },
          { icon: 'information-circle-outline', label: 'About' },
        ].map((item) => (
          <TouchableOpacity style={styles.menuItem} key={item.label}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={24} color={theme.textSecondary} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xl,
    },
    avatarContainer: {
      marginBottom: spacing.sm,
    },
    name: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: theme.headingOnGradient,
      marginBottom: spacing.sm,
    },
    premiumButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.buttons.secondary.background,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      borderColor: theme.buttons.secondary.border,
    },
    premiumButtonText: {
      color: theme.buttons.secondary.text,
      fontWeight: typography.semibold,
      marginLeft: spacing.xs,
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
    featuredMenuItem: {
      backgroundColor: theme.primarySubtle,
      borderBottomWidth: 2,
      borderBottomColor: theme.accentTeal,
    },
    featuredMenuItemText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      fontWeight: typography.semibold,
      marginLeft: spacing.sm,
    },
    featuredMenuItemSubtext: {
      fontSize: typography.small,
      color: theme.textSecondary,
      marginLeft: spacing.sm,
      marginTop: 2,
    },
  });
