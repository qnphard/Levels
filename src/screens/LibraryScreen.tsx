// LibraryScreen - Browse all meditations with lavender gradient
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sampleMeditations } from '../data/meditations';
import { RootStackParamList } from '../navigation/AppNavigator';
import MeditationCard from '../components/MeditationCard';
import FeelingsExplainedCard from '../components/FeelingsExplainedCard';
import WhyFeelingSheet from '../components/WhyFeelingSheet';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function LibraryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhyFeelingSheet, setShowWhyFeelingSheet] = useState(false);
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);

  const filteredMeditations = sampleMeditations.filter(
    (meditation) =>
      meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meditation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meditation.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meditations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {!searchQuery && (
            <>
              {/* Essentials Card */}
              <View style={styles.essentialsCardContainer}>
                {theme.mode === 'light' && (
                  <View
                    pointerEvents="none"
                    style={styles.lightLiftShadow}
                  />
                )}
                <Pressable
                  onPress={() => navigation.navigate('Essentials')}
                  accessibilityRole="button"
                  accessibilityLabel="Essentials - Core things to know"
                  style={({ pressed }) => [
                    styles.essentialsCard,
                    theme.mode === 'dark'
                      ? (glowEnabled
                          ? {
                              borderWidth: 2,
                              borderColor: toRgba(theme.primary, 0.8),
                              shadowColor: theme.primary,
                              shadowOpacity: 0.34,
                              backgroundColor: 'rgba(9, 19, 28, 0.75)',
                              boxShadow: [
                                `0 0 30px ${toRgba(theme.primary, 0.53)}`,
                                `0 0 60px ${toRgba(theme.primary, 0.27)}`,
                                `inset 0 0 20px ${toRgba(theme.primary, 0.13)}`,
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
                              borderColor: toRgba(theme.primary, 0.95),
                              shadowColor: theme.primary,
                              shadowOpacity: 0.4,
                              shadowRadius: 24,
                              shadowOffset: { width: 0, height: 10 },
                              elevation: 6,
                              backgroundColor: theme.cardBackground,
                              boxShadow: [
                                `0 18px 50px rgba(2, 6, 23, 0.22)`,
                                `0 2px 8px rgba(2, 6, 23, 0.10)`,
                                `0 0 3px ${toRgba(theme.primary, 0.8)}`,
                                `0 0 30px ${toRgba(theme.primary, 0.5)}`,
                                `0 0 60px ${toRgba(theme.primary, 0.25)}`,
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
                  <View style={styles.essentialsCardContent}>
                    <View style={styles.essentialsCardHeader}>
                      <View style={styles.essentialsCardTitleRow}>
                        <Ionicons name="sparkles" size={24} color={theme.primary} />
                        <Text style={styles.essentialsCardTitle}>
                          Essentials
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.essentialsCardSubtitleContainer}>
                      <Text style={styles.essentialsCardSubtitle}>
                        The core things to know about you, your mind, and your feelings.
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>

              <FeelingsExplainedCard
                onOpenChapters={() => navigation.navigate('LearnHub')}
                onOpenQuickHelp={() => setShowWhyFeelingSheet(true)}
                style={styles.feelingsCard}
              />

              {/* Letting Go Chapter Card */}
              <View style={styles.lettingGoCardContainer}>
                {theme.mode === 'light' && (
                  <View
                    pointerEvents="none"
                    style={styles.lightLiftShadow}
                  />
                )}
                <Pressable
                  onPress={() => navigation.navigate('Chapter', { chapterId: 'letting-go' })}
                  accessibilityRole="button"
                  accessibilityLabel="Letting Go - Releasing Emotions"
                  style={({ pressed }) => [
                    styles.lettingGoCard,
                    theme.mode === 'dark'
                      ? (glowEnabled
                          ? {
                              borderWidth: 2,
                              borderColor: toRgba(theme.primary, 0.8),
                              shadowColor: theme.primary,
                              shadowOpacity: 0.34,
                              backgroundColor: 'rgba(9, 19, 28, 0.75)',
                              boxShadow: [
                                `0 0 30px ${toRgba(theme.primary, 0.53)}`,
                                `0 0 60px ${toRgba(theme.primary, 0.27)}`,
                                `inset 0 0 20px ${toRgba(theme.primary, 0.13)}`,
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
                              borderColor: toRgba(theme.primary, 0.95),
                              shadowColor: theme.primary,
                              shadowOpacity: 0.4,
                              shadowRadius: 24,
                              shadowOffset: { width: 0, height: 10 },
                              elevation: 6,
                              backgroundColor: theme.cardBackground,
                              boxShadow: [
                                `0 18px 50px rgba(2, 6, 23, 0.22)`,
                                `0 2px 8px rgba(2, 6, 23, 0.10)`,
                                `0 0 3px ${toRgba(theme.primary, 0.8)}`,
                                `0 0 30px ${toRgba(theme.primary, 0.5)}`,
                                `0 0 60px ${toRgba(theme.primary, 0.25)}`,
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
                  <View style={styles.lettingGoCardContent}>
                    <View style={styles.lettingGoCardHeader}>
                      <Text style={styles.lettingGoCardTitle}>
                        Letting Go (Releasing Emotions)
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.lettingGoCardSubtitleContainer}>
                      <Text style={styles.lettingGoCardSubtitle}>
                        A kinder way to be with your feelings, instead of fighting them.
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </>
          )}
          
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Found ${filteredMeditations.length} meditations`
              : 'All Meditations'}
          </Text>

          {filteredMeditations.length > 0 ? (
            filteredMeditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                meditation={meditation}
                onPress={() => navigation.navigate('Player', { meditation })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={theme.highlightMist} />
              <Text style={styles.emptyText}>No meditations found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <WhyFeelingSheet
        visible={showWhyFeelingSheet}
        onClose={() => setShowWhyFeelingSheet(false)}
      />
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.md,
      marginTop: 60,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.sm + 4,
      fontSize: typography.body,
      color: theme.textPrimary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing.md,
    },
    essentialsCardContainer: {
      marginBottom: spacing.lg,
      position: 'relative',
    },
    essentialsCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      minHeight: 100,
    },
    essentialsCardContent: {
      padding: spacing.lg,
    },
    essentialsCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    essentialsCardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    essentialsCardTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    essentialsCardSubtitleContainer: {
      marginTop: spacing.xs,
    },
    essentialsCardSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    feelingsCard: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textSecondary,
      marginTop: spacing.md,
    },
    emptySubtext: {
      fontSize: typography.small,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
    lettingGoCardContainer: {
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
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 30px 60px rgba(2, 6, 23, 0.25), 0 10px 24px rgba(2, 6, 23, 0.12)' } as any)
        : null),
    },
    lettingGoCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      padding: spacing.lg,
    },
    lettingGoCardContent: {
      gap: spacing.sm,
    },
    lettingGoCardSubtitleContainer: {
      marginTop: spacing.sm,
    },
    lettingGoCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lettingGoCardTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      flex: 1,
    },
    lettingGoCardSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });
