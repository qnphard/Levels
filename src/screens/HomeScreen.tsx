import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sampleMeditations } from '../data/meditations';
import { featuredArticles } from '../data/articles';
import { RootStackParamList } from '../navigation/types';
import MeditationCard from '../components/MeditationCard';
import ArticleCard from '../components/ArticleCard';
import PrimaryButton from '../components/PrimaryButton';
import SOSBottomSheet from '../components/SOSBottomSheet';
import { Article } from '../types';
import {
  useThemeColors,
  useThemeToggle,
  useGlowEnabled,
  useGlowToggle,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
  toRgba,
} from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { getLevelById } from '../data/levels';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSOS, setShowSOS] = useState(false);
  const theme = useThemeColors();
  const toggleTheme = useThemeToggle();
  const glowEnabled = useGlowEnabled();
  const toggleGlow = useGlowToggle();
  const styles = useMemo(() => createStyles(theme, glowEnabled), [theme, glowEnabled]);

  const lastLevelId = useUserStore((s) => s.lastAccessedLevel);
  const lastLevel = useMemo(() => (lastLevelId ? getLevelById(lastLevelId) : null), [lastLevelId]);

  const categories = ['All', 'Find Peace', 'Let Go', 'Discover Joy', 'Be Present', 'Rest Deeply'];

  const filteredMeditations =
    selectedCategory === 'All'
      ? sampleMeditations
      : sampleMeditations.filter((m) => m.category === selectedCategory);

  // Get appropriate practice based on time of day
  const getTodaysPractice = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      // Morning (5am - 12pm)
      return sampleMeditations.find((m) => m.title === 'Morning Centering');
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (12pm - 6pm)
      return sampleMeditations.find((m) => m.title === 'Breath Awareness');
    } else if (hour >= 18 && hour < 22) {
      // Evening (6pm - 10pm)
      return sampleMeditations.find((m) => m.title === 'Evening Wind Down');
    } else {
      // Night (10pm - 5am)
      return sampleMeditations.find((m) => m.title === 'Sleep Body Scan');
    }
  };

  const todaysPractice = getTodaysPractice();
  const handleArticlePress = (article: Article) => {
    if (!article.url) return;
    Linking.openURL(article.url).catch(() => { });
  };

  const resolveChipStyles = (category: string, isActive: boolean) => {
    const chip =
      theme.categoryChips[category as keyof typeof theme.categoryChips] ??
      theme.categoryChips.All;
    return {
      backgroundColor: chip.background,
      borderColor: chip.border ?? 'transparent',
      textColor: chip.text,
      opacity: isActive ? 1 : 0.8,
    };
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerOverlay}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.subtitle}>
                There's nothing wrong with this moment
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={toggleTheme}
                style={styles.profileIcon}
              >
                <Ionicons
                  name={theme.mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color={theme.mode === 'dark' ? '#F8FAFC' : '#1E293B'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleGlow}
                style={styles.profileIcon}
              >
                <Ionicons
                  name={glowEnabled ? 'sparkles' : 'sparkles-outline'}
                  size={20}
                  color={glowEnabled ? (theme.mode === 'dark' ? '#C4B5FD' : theme.primary) : (theme.mode === 'dark' ? '#F8FAFC' : '#1E293B')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileIcon}
              >
                <Ionicons name="person-outline" size={24} color={theme.mode === 'dark' ? '#F8FAFC' : '#1E293B'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Continue Journey / Start Here Module */}
        <View style={styles.journeyModule}>
          {lastLevel ? (
            <TouchableOpacity
              style={[
                styles.journeyCard,
                glowEnabled && {
                  borderWidth: 2,
                  borderColor: theme.mode === 'dark'
                    ? toRgba((lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary, 0.64)
                    : toRgba((lastLevel.gradient)?.[1] || theme.primary, 0.48),
                  shadowColor: (lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary,
                  shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 4 },
                  backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
                  ...(theme.mode !== 'dark' && { elevation: 6 }),
                  boxShadow: [
                    `0 0 30px ${theme.mode === 'dark'
                      ? toRgba((lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary, 0.42)
                      : toRgba((lastLevel.gradient)?.[1] || theme.primary, 0.32)}`,
                    `0 0 60px ${theme.mode === 'dark'
                      ? toRgba((lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary, 0.22)
                      : toRgba((lastLevel.gradient)?.[1] || theme.primary, 0.16)}`,
                    `inset 0 0 20px ${toRgba((lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary, 0.1)}`,
                  ].join(', '),
                }
              ]}
              onPress={() => navigation.navigate('LevelChapter', { levelId: lastLevel.id })}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={(theme.mode === 'dark' ? (lastLevel.gradientDark ?? lastLevel.gradient) : lastLevel.gradient) || ['#6366F1', '#8B5CF6']}
                style={styles.journeyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {glowEnabled && (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.cardGlow,
                      {
                        backgroundColor: theme.mode === 'dark'
                          ? toRgba((lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary, 0.12)
                          : toRgba((lastLevel.gradient)?.[1] || theme.primary, 0.04),
                      },
                    ]}
                  />
                )}
                <View style={styles.journeyContent}>
                  <View>
                    <Text style={styles.journeyLabel}>Continue Journey</Text>
                    <Text style={styles.journeyTitle}>{lastLevel.name}</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.journeyCard}
              onPress={() => navigation.navigate('JourneyMap')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.journeyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {glowEnabled && (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.cardGlow,
                      {
                        backgroundColor: theme.mode === 'dark'
                          ? toRgba(theme.primary, 0.12)
                          : toRgba(theme.primary, 0.04),
                      },
                    ]}
                  />
                )}
                <View style={styles.journeyContent}>
                  <View>
                    <Text style={styles.journeyLabel}>New Beginning</Text>
                    <Text style={styles.journeyTitle}>Start Your Journey</Text>
                  </View>
                  <Ionicons name="sparkles" size={32} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Room of Levels Entrance */}
        <View style={styles.roomModule}>
          <TouchableOpacity
            style={[
              styles.roomCard,
              glowEnabled && {
                borderWidth: 2,
                borderColor: theme.mode === 'dark' ? toRgba('#4F46E5', 0.64) : toRgba('#4F46E5', 0.48),
                shadowColor: '#4F46E5',
                shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 4 },
                backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
                ...(theme.mode !== 'dark' && { elevation: 6 }),
                boxShadow: [
                  `0 0 30px ${theme.mode === 'dark' ? toRgba('#4F46E5', 0.42) : toRgba('#4F46E5', 0.32)}`,
                  `0 0 60px ${theme.mode === 'dark' ? toRgba('#4F46E5', 0.22) : toRgba('#4F46E5', 0.16)}`,
                  `inset 0 0 20px ${toRgba('#4F46E5', 0.1)}`,
                ].join(', '),
              }
            ]}
            onPress={() => navigation.navigate('RoomOfLevels2')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1e1b4b', '#312e81']} // Deep indigo/stormy colors
              style={styles.roomGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {glowEnabled && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.cardGlow,
                    {
                      backgroundColor: theme.mode === 'dark'
                        ? toRgba('#4F46E5', 0.12)
                        : toRgba('#4F46E5', 0.04),
                    },
                  ]}
                />
              )}
              <View style={styles.roomContent}>
                <View style={styles.roomTextSection}>
                  <Text style={styles.roomLabel}>Portal</Text>
                  <Text style={styles.roomTitle}>The Room of Levels</Text>
                  <Text style={styles.roomSubtitle}>Transform dense emotions into clarity</Text>
                </View>
                <View style={styles.roomIconContainer}>
                  <Ionicons name="cloud-outline" size={32} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Today's Practice Card */}
        {todaysPractice && (
          <View style={styles.todaysPracticeCard}>
            <Text style={styles.todaysPracticeLabel}>Today's Practice</Text>
            <Text style={styles.todaysPracticeTitle}>{todaysPractice.title}</Text>
            <Text style={styles.todaysPracticeDescription}>
              {todaysPractice.description}
            </Text>
            <PrimaryButton
              label="Begin when you're ready"
              onPress={() =>
                navigation.navigate('Player', { meditation: todaysPractice })
              }
            />
          </View>
        )}

        {/* AI Generator Module */}
        <View style={styles.generatorModule}>
          <TouchableOpacity
            style={styles.generatorCard}
            onPress={() => navigation.navigate('MeditationGenerator')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.generatorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {glowEnabled && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.cardGlow,
                    {
                      backgroundColor: theme.mode === 'dark'
                        ? toRgba('#EC4899', 0.12)
                        : toRgba('#EC4899', 0.04),
                    },
                  ]}
                />
              )}
              <View style={styles.generatorContent}>
                <View style={styles.generatorTextSection}>
                  <Text style={styles.generatorLabel}>Custom Practice</Text>
                  <Text style={styles.generatorTitle}>Personalized Meditation</Text>
                  <Text style={styles.generatorSubtitle}>Generate unique scripts & binaural beats</Text>
                </View>
                <View style={styles.generatorIconContainer}>
                  <Ionicons name="sparkles" size={28} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContentContainer}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const chipState = resolveChipStyles(category, isActive);
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: chipState.backgroundColor,
                    borderColor: chipState.borderColor,
                    opacity: chipState.opacity,
                  },
                  isActive && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: chipState.textColor },
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Meditation List */}
        <View style={styles.meditationList}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All'
              ? 'Available Practices'
              : selectedCategory}
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
            <Text style={styles.emptyText}>No practices in this category yet</Text>
          )}
        </View>

        <View style={styles.articlesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Articles</Text>
              <Text style={styles.sectionSubtitle}>
                Field notes and insights
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlesScroll}
          >
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={article.url ? handleArticlePress : undefined}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating SOS Button */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => setShowSOS(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="medkit" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* SOS Bottom Sheet */}
      <SOSBottomSheet visible={showSOS} onClose={() => setShowSOS(false)} />
    </LinearGradient>
  );
}

const createStyles = (theme: ThemeColors, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerOverlay: {
      paddingTop: 60,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    scrollView: {
      flex: 1,
    },
    welcomeSection: {
      marginBottom: spacing.lg,
    },
    welcomeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    welcomeTextContainer: {
      flex: 1,
    },
    welcomeText: {
      fontSize: typography.h1,
      fontWeight: 'bold',
      color: theme.mode === 'dark' ? '#F8FAFC' : '#1E293B',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? '#CBD5E1' : '#475569',
      fontWeight: '400',
      opacity: 0.9,
      fontStyle: 'italic',
    },
    categoryContainer: {
      marginBottom: spacing.lg,
    },
    categoryContentContainer: {
      paddingHorizontal: spacing.lg,
    },
    categoryButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.roundedChip,
      marginRight: spacing.sm,
      borderWidth: 1,
    },
    categoryButtonActive: {
      transform: [{ translateY: -2 }],
    },
    categoryText: {
      color: theme.textSecondary,
      fontWeight: '500',
      fontSize: typography.small,
    },
    categoryTextActive: {
      fontWeight: '600',
    },
    meditationList: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    articlesSection: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
      marginTop: spacing.lg,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      fontSize: typography.small,
      color: theme.textSecondary,
      marginTop: -spacing.xs,
    },
    articlesScroll: {
      paddingRight: spacing.lg,
    },
    emptyText: {
      fontSize: typography.body,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: spacing.lg,
      fontStyle: 'italic',
    },
    todaysPracticeCard: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
      marginBottom: spacing.lg,
      marginHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      ...(glowEnabled && {
        borderWidth: 2,
        borderColor: theme.mode === 'dark' ? toRgba('#F59E0B', 0.64) : toRgba('#F59E0B', 0.48),
        shadowColor: '#F59E0B',
        shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
        ...(theme.mode !== 'dark' && { elevation: 6 }),
        boxShadow: [
          `0 0 30px ${theme.mode === 'dark' ? toRgba('#F59E0B', 0.42) : toRgba('#F59E0B', 0.32)}`,
          `0 0 60px ${theme.mode === 'dark' ? toRgba('#F59E0B', 0.22) : toRgba('#F59E0B', 0.16)}`,
          `inset 0 0 20px ${toRgba('#F59E0B', 0.1)}`,
        ].join(', '),
      }),
      overflow: 'hidden',
    },
    todaysPracticeLabel: {
      fontSize: 10,
      color: '#F59E0B',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    todaysPracticeTitle: {
      fontSize: 20,
      color: theme.textPrimary,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    todaysPracticeDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    journeyModule: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    journeyCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      ...(glowEnabled && {
        borderWidth: 2,
        borderColor: theme.mode === 'dark' ? toRgba(theme.primary, 0.8) : toRgba(theme.primary, 0.6),
        shadowColor: theme.primary,
        shadowOpacity: theme.mode === 'dark' ? 0.34 : 0.25,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
        ...(theme.mode !== 'dark' && { elevation: 6 }),
      }),
      ...(!glowEnabled && {
        elevation: 8,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      }),
    },
    journeyGradient: {
      padding: spacing.lg,
    },
    journeyContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    journeyLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    journeyTitle: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    sosButton: {
      position: 'absolute',
      bottom: 100,
      right: spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    profileIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    generatorModule: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    generatorCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      ...(glowEnabled && {
        borderWidth: 2,
        borderColor: theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.64)' : 'rgba(139, 92, 246, 0.48)', // Using bioGlow/Violet to match generator
        shadowColor: '#8B5CF6',
        shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
        ...(theme.mode !== 'dark' && { elevation: 6 }),
        boxShadow: [
          `0 0 30px ${theme.mode === 'dark' ? toRgba('#8B5CF6', 0.42) : toRgba('#8B5CF6', 0.32)}`,
          `0 0 60px ${theme.mode === 'dark' ? toRgba('#8B5CF6', 0.22) : toRgba('#8B5CF6', 0.16)}`,
          `inset 0 0 20px ${toRgba('#8B5CF6', 0.1)}`,
        ].join(', '),
      }),
      ...(!glowEnabled && {
        elevation: 6,
        shadowColor: '#EC4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }),
    },
    cardGlow: {
      position: 'absolute',
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: borderRadius.lg + 8,
      opacity: 0.8,
    },
    generatorGradient: {
      padding: spacing.lg,
    },
    generatorContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    generatorTextSection: {
      flex: 1,
      marginRight: spacing.md,
    },
    generatorLabel: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 2,
    },
    generatorTitle: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: 2,
    },
    generatorSubtitle: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
    },
    generatorIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    roomModule: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    roomCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      ...(glowEnabled && {
        borderWidth: 2,
        borderColor: theme.mode === 'dark' ? toRgba('#4F46E5', 0.8) : toRgba('#4F46E5', 0.6),
        shadowColor: '#4F46E5',
        shadowOpacity: theme.mode === 'dark' ? 0.34 : 0.25,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
        ...(theme.mode !== 'dark' && { elevation: 6 }),
      }),
      ...(!glowEnabled && {
        elevation: 6,
        shadowColor: '#1e1b4b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }),
    },
    roomGradient: {
      padding: spacing.lg,
    },
    roomContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    roomTextSection: {
      flex: 1,
      marginRight: spacing.md,
    },
    roomLabel: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 2,
    },
    roomTitle: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: 2,
    },
    roomSubtitle: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
    },
    roomIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },

  });
