import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  useThemeColors,
  useThemeMode,
  useThemeToggle,
  useGlowEnabled,
  useGlowToggle,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { useContentEdit } from '../context/ContentEditContext';

import { useOnboardingStore } from '../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const mode = useThemeMode();
  const toggleTheme = useThemeToggle();
  const glowEnabled = useGlowEnabled();
  const toggleGlow = useGlowToggle();
  const { editModeEnabled, toggleEditMode } = useContentEdit();

  const showTutorialAgain = useOnboardingStore((s) => s.showTutorialAgain);
  const setShowTutorialAgain = useOnboardingStore((s) => s.setShowTutorialAgain);
  const showOnboarding = useOnboardingStore((s) => s.showOnboarding);
  const setShowOnboarding = useOnboardingStore((s) => s.setShowOnboarding);

  const styles = getStyles(theme);

  const isDark = mode === 'dark';

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          {/* Theme Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={24}
                color={theme.textSecondary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>
                  {isDark ? 'Dark mode' : 'Light mode'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          {/* Glow Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={glowEnabled ? 'sparkles' : 'sparkles-outline'}
                size={24}
                color={theme.textSecondary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Card Glow</Text>
                <Text style={styles.settingDescription}>
                  {glowEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={glowEnabled}
              onValueChange={toggleGlow}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        {/* Tutorial Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tutorial & Guidance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={theme.textSecondary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Show Tutorial Again</Text>
                <Text style={styles.settingDescription}>
                  Show the full app tutorial on next start
                </Text>
              </View>
            </View>
            <Switch
              value={showTutorialAgain}
              onValueChange={setShowTutorialAgain}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          {/* Show Daily Practices Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="flower-outline"
                size={24}
                color={theme.textSecondary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Show Daily Practices</Text>
                <Text style={styles.settingDescription}>
                  Show breathing and letting go practices on each app launch
                </Text>
              </View>
            </View>
            <Switch
              value={showOnboarding}
              onValueChange={setShowOnboarding}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        {/* Edit Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Editing</Text>

          {/* Edit Mode Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={editModeEnabled ? 'create' : 'create-outline'}
                size={24}
                color={theme.textSecondary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Edit Mode</Text>
                <Text style={styles.settingDescription}>
                  {editModeEnabled
                    ? 'Enable editing of app content'
                    : 'Disable editing of app content'}
                </Text>
              </View>
            </View>
            <Switch
              value={editModeEnabled}
              onValueChange={toggleEditMode}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    backButton: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? theme.textPrimary : '#1E293B',
      letterSpacing: -0.5,
    },
    placeholder: {
      width: 40,
    },
    section: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary,
      marginBottom: spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardBackground,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: spacing.md,
    },
    settingTextContainer: {
      marginLeft: spacing.md,
      flex: 1,
    },
    settingLabel: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs / 2,
    },
    settingDescription: {
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    onboardingResetButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    onboardingResetText: {
      fontSize: typography.small,
      fontWeight: typography.bold,
      color: '#EF4444',
    },
    bottomSpacer: {
      height: 40,
    },
  });



