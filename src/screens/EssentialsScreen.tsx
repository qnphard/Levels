import React, { useState } from 'react';
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
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { essentialItems } from '../data/essentials';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import { useContentStructure } from '../hooks/useContentStructure';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function EssentialsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  
  // Load content structure
  const { structure, refreshStructure } = useContentStructure('essentials', 'main');
  
  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

  const handleEssentialPress = (item: typeof essentialItems[0]) => {
    if (item.route.screen === 'Chapter') {
      navigation.navigate('Chapter', item.route.params as any);
    } else if (item.route.screen === 'LearnHub') {
      navigation.navigate('LearnHub');
    } else if (item.route.screen === 'WhatYouReallyAre') {
      navigation.navigate('WhatYouReallyAre');
    } else if (item.route.screen === 'Tension') {
      navigation.navigate('Tension');
    } else if (item.route.screen === 'Mantras') {
      navigation.navigate('Mantras');
    } else if (item.route.screen === 'NaturalHappiness') {
      navigation.navigate('NaturalHappiness' as never);
    } else if (item.route.screen === 'PowerVsForce') {
      navigation.navigate('PowerVsForce' as never);
    } else if (item.route.screen === 'LevelsOfTruth') {
      navigation.navigate('LevelsOfTruth' as never);
    } else if (item.route.screen === 'Intention') {
      navigation.navigate('Intention' as never);
    } else if (item.route.screen === 'MusicAsTool') {
      navigation.navigate('MusicAsTool' as never);
    } else if (item.route.screen === 'FatigueVsEnergy') {
      navigation.navigate('FatigueVsEnergy' as never);
    } else if (item.route.screen === 'FulfillmentVsSatisfaction') {
      navigation.navigate('FulfillmentVsSatisfaction' as never);
    } else if (item.route.screen === 'PositiveReprogramming') {
      navigation.navigate('PositiveReprogramming' as never);
    } else if (item.route.screen === 'Effort') {
      navigation.navigate('Effort' as never);
    } else if (item.route.screen === 'ShadowWork') {
      navigation.navigate('ShadowWork' as never);
    } else if (item.route.screen === 'NonReactivity') {
      navigation.navigate('NonReactivity' as never);
    } else if (item.route.screen === 'Relaxing') {
      navigation.navigate('Relaxing' as never);
    } else if (item.route.screen === 'Knowledge') {
      navigation.navigate('Knowledge' as never);
    } else if (item.route.screen === 'Addiction') {
      navigation.navigate('Addiction' as never);
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
      <EditModeIndicator />
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
        <EditableText
          screen="essentials"
          section="main"
          id="subtitle"
          originalContent="The core things to know about you, your mind, and your feelings."
          textStyle={styles.subtitle}
          type="subtitle"
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Explore the Essentials Section */}
        <View style={styles.section} key={structureRefreshKey}>
          <EditableText
            screen="essentials"
            section="main"
            id="section-title"
            originalContent="Explore the Essentials"
            textStyle={styles.sectionTitle}
            type="title"
          />
          <View style={styles.essentialsGrid}>
            {essentialItems.map((item) => {
              const glowTint = theme.primary;
              return (
              <Pressable
                key={item.id}
                onPress={() => handleEssentialPress(item)}
                style={({ pressed }) => [
                  styles.essentialCard,
                  pressed && styles.essentialCardPressed,
                  // Apply glow effects to all cards when glow is enabled
                  glowEnabled && theme.mode === 'dark'
                    ? {
                        borderWidth: 2,
                        borderColor: toRgba(glowTint, 0.8),
                        shadowColor: glowTint,
                        shadowOpacity: 0.34,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 0,
                        boxShadow: [
                          `0 0 30px ${toRgba(glowTint, 0.53)}`,
                          `0 0 60px ${toRgba(glowTint, 0.27)}`,
                          `inset 0 0 20px ${toRgba(glowTint, 0.13)}`,
                        ].join(', '),
                      }
                    : glowEnabled && theme.mode === 'light'
                    ? {
                        borderWidth: 2,
                        borderColor: toRgba(glowTint, 0.6),
                        shadowColor: glowTint,
                        shadowOpacity: 0.4,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 0,
                        boxShadow: [
                          `0 0 25px ${toRgba(glowTint, 0.4)}`,
                          `0 0 50px ${toRgba(glowTint, 0.2)}`,
                          `inset 0 0 15px ${toRgba(glowTint, 0.1)}`,
                        ].join(', '),
                      }
                    : {},
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
                <EditableText
                  screen="essentials"
                  section="cards"
                  id={`${item.id}-title`}
                  originalContent={item.title}
                  textStyle={styles.essentialTitle}
                  type="title"
                />
                <EditableText
                  screen="essentials"
                  section="cards"
                  id={`${item.id}-description`}
                  originalContent={item.description}
                  textStyle={styles.essentialDescription}
                  type="description"
                />
                <View style={styles.essentialArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.primary}
                  />
                </View>
              </Pressable>
              );
            })}
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

