import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { essentialItems } from '../data/essentials';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EssentialsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);

  const handleEssentialPress = (item: typeof essentialItems[0]) => {
    if (item.route.screen === 'Chapter') {
      navigation.navigate('Chapter', item.route.params as any);
    } else if (item.route.screen === 'LearnHub') {
      navigation.navigate('LearnHub');
    } else if (item.route.screen === 'WhatYouReallyAre') {
      navigation.navigate('WhatYouReallyAre');
    }
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Essentials
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          The core things to know about you, your mind, and your feelings.
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Explore the Essentials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore the Essentials</Text>
          <View style={styles.essentialsGrid}>
            {essentialItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleEssentialPress(item)}
                style={({ pressed }) => [
                  styles.essentialCard,
                  pressed && styles.essentialCardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title} (Essentials)`}
              >
                {item.icon && (
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={theme.primary}
                    style={styles.essentialIcon}
                  />
                )}
                <Text style={styles.essentialTitle}>{item.title}</Text>
                <Text style={styles.essentialDescription}>{item.description}</Text>
                <View style={styles.essentialArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.primary}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    subtitleContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.lg,
    },
    sectionBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    conceptCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    conceptTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    conceptBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xs,
    },
    summaryCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: theme.primary + '30',
    },
    summaryText: {
      fontSize: typography.body,
      fontWeight: typography.medium,
      color: theme.textPrimary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    bulletList: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
    },
    bulletItem: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xs,
      paddingLeft: spacing.xs,
    },
    essentialsGrid: {
      gap: spacing.md,
    },
    essentialCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      minHeight: 44, // Accessibility: minimum hit target
    },
    essentialCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    essentialIcon: {
      marginBottom: spacing.sm,
    },
    essentialTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    essentialDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
    essentialArrow: {
      alignSelf: 'flex-end',
      marginTop: spacing.xs,
    },
  });

