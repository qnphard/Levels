import React, { useEffect, useMemo, useRef, useState } from 'react';
import TutorialPopup, { useTutorialPopup } from '../components/TutorialPopup';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  AppState,
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
import IntentionSessionModal from '../components/IntentionSessionModal';
import { CardSurface } from '../components/CardSurface';
import { SkiaHeroBackdrop } from '../components/SkiaHeroBackdrop';
import { FadeStagger } from '../components/motion/FadeStagger';
import { SkeletonCard } from '../components/skeleton/SkeletonCard';
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
} from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { getLevelById } from '../data/levels';
import { getLocalCalendarDateString } from '../utils/localCalendarDate';
import { useSplashFinished } from '../context/SplashContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isOnboardingComplete = useOnboardingStore((s) => s.isComplete);
  const intention = useOnboardingStore((s) => s.intention);
  const hasCompletedIntentionPrompt = useOnboardingStore(
    (s) => s.hasCompletedIntentionPrompt
  );
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);
  const intentionPromptSnoozeDateLocal = useOnboardingStore(
    (s) => s.intentionPromptSnoozeDateLocal
  );
  const setIntentionPromptSnoozeDateLocal = useOnboardingStore(
    (s) => s.setIntentionPromptSnoozeDateLocal
  );
  const setHasCompletedIntentionPrompt = useOnboardingStore(
    (s) => s.setHasCompletedIntentionPrompt
  );
  /** Glow/theme popup runs only after intention is answered — avoids blocking or skipping the session “What brings you here?” on auto-login. */
  const { showTutorial, dismissTutorial } = useTutorialPopup(
    isOnboardingComplete && hasSeenTutorial && hasCompletedIntentionPrompt
  );
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const sessionIntentionShownRef = useRef(false);
  /** Re-run “snoozed for today?” when app foregrounds or the local calendar day may have changed. */
  const [foregroundTick, setForegroundTick] = useState(0);
  const [minuteTick, setMinuteTick] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSOS, setShowSOS] = useState(false);
  const splashFinished = useSplashFinished();
  const theme = useThemeColors();
  const toggleTheme = useThemeToggle();
  const glowEnabled = useGlowEnabled();
  const toggleGlow = useGlowToggle();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const lastLevelId = useUserStore((s) => s.lastAccessedLevel);
  const lastLevel = useMemo(() => (lastLevelId ? getLevelById(lastLevelId) : null), [lastLevelId]);

  const categories = ['All', 'Find Peace', 'Let Go', 'Discover Joy', 'Be Present', 'Rest Deeply'];

  const filteredMeditations =
    selectedCategory === 'All'
      ? sampleMeditations
      : sampleMeditations.filter((m) => m.category === selectedCategory);

  /** If intention was set in first-run onboarding, mark prompt complete (migration for existing installs). */
  useEffect(() => {
    if (intention != null && !hasCompletedIntentionPrompt) {
      setHasCompletedIntentionPrompt(true);
    }
  }, [intention, hasCompletedIntentionPrompt, setHasCompletedIntentionPrompt]);

  const snoozedForToday = useMemo(() => {
    const today = getLocalCalendarDateString();
    return intentionPromptSnoozeDateLocal === today;
  }, [intentionPromptSnoozeDateLocal, foregroundTick, minuteTick]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sessionIntentionShownRef.current = false;
        setForegroundTick((n) => n + 1);
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setMinuteTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  /**
   * “What brings you here?” on Home — every time you enter the app (foreground), unless snoozed for today.
   * First-run onboarding + tutorial stack must be done first. Glow tutorial still waits on hasCompletedIntentionPrompt.
   * Waits for the intro video splash to finish so Modal doesn’t stack above it.
   */
  useEffect(() => {
    if (!isOnboardingComplete) return;
    if (!hasSeenTutorial) return;
    if (!splashFinished) return;
    if (snoozedForToday) return;
    if (sessionIntentionShownRef.current) return;

    const t = setTimeout(() => {
      sessionIntentionShownRef.current = true;
      setShowIntentionModal(true);
    }, 600);
    return () => clearTimeout(t);
  }, [isOnboardingComplete, hasSeenTutorial, snoozedForToday, foregroundTick, splashFinished]);

  const handleIntentionModalFinished = (opts?: { snoozeToday?: boolean }) => {
    setShowIntentionModal(false);
    if (opts?.snoozeToday) {
      setIntentionPromptSnoozeDateLocal(getLocalCalendarDateString());
    }
  };

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
        <FadeStagger staggerMs={55} baseDelayMs={0}>
          {/* Continue Journey / Start Here Module */}
          <View style={styles.journeyModule}>
            {lastLevel ? (
              <CardSurface
                variant="elevated"
                pressable
                glowColor={(lastLevel.gradientDark ?? lastLevel.gradient)?.[1] || theme.primary}
                onPress={() => navigation.navigate('LevelChapter', { levelId: lastLevel.id })}
                style={{ backgroundColor: 'transparent' }}
              >
                <LinearGradient
                  colors={(theme.mode === 'dark' ? (lastLevel.gradientDark ?? lastLevel.gradient) : lastLevel.gradient) || ['#6366F1', '#8B5CF6']}
                  style={styles.journeyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.journeyContent}>
                    <View>
                      <Text style={styles.journeyLabel}>Continue Journey</Text>
                      <Text style={styles.journeyTitle}>{lastLevel.name}</Text>
                    </View>
                    <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </CardSurface>
            ) : (
              <CardSurface
                variant="elevated"
                pressable
                glowColor={theme.primary}
                onPress={() => navigation.navigate('JourneyMap')}
                style={{ backgroundColor: 'transparent' }}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.journeyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.journeyContent}>
                    <View>
                      <Text style={styles.journeyLabel}>New Beginning</Text>
                      <Text style={styles.journeyTitle}>Start Your Journey</Text>
                    </View>
                    <Ionicons name="sparkles" size={32} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </CardSurface>
            )}
          </View>

          {/* Room of Levels Entrance */}
          <View style={styles.roomModule}>
            <CardSurface
              variant="hero"
              pressable
              glowColor="#4F46E5"
              onPress={() => navigation.navigate('RoomOfLevels2')}
              style={{ backgroundColor: 'transparent', minHeight: 120 }}
            >
              <View style={styles.roomHeroInner}>
                <SkiaHeroBackdrop colors={['#1e1b4b', '#312e81']} />
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
              </View>
            </CardSurface>
          </View>

          {/* Today's Practice Card */}
          {todaysPractice && (
            <View style={styles.todaysPracticeWrap}>
              <CardSurface variant="elevated" glowColor="#F59E0B" style={styles.todaysPracticeInner}>
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
              </CardSurface>
            </View>
          )}

          {/* AI Generator Module */}
          <View style={styles.generatorModule}>
            <CardSurface
              variant="elevated"
              pressable
              glowColor="#8B5CF6"
              onPress={() => navigation.navigate('MeditationGenerator')}
              style={{ backgroundColor: 'transparent' }}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.generatorGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
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
            </CardSurface>
          </View>
        </FadeStagger>

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
          {!splashFinished ? (
            <SkeletonCard layout="meditation" count={3} />
          ) : filteredMeditations.length > 0 ? (
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
        <Ionicons name="medkit" size={24} color={theme.accentDanger} />
      </TouchableOpacity>

      {/* SOS Bottom Sheet */}
      <SOSBottomSheet visible={showSOS} onClose={() => setShowSOS(false)} />
      <TutorialPopup visible={showTutorial} onDismiss={dismissTutorial} />
      <IntentionSessionModal
        visible={showIntentionModal}
        onFinished={handleIntentionModalFinished}
      />
    </LinearGradient>
  );
}

const createStyles = (theme: ThemeColors) =>
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
      color: theme.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      fontWeight: '400',
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
    todaysPracticeWrap: {
      marginBottom: spacing.lg,
      marginHorizontal: spacing.lg,
    },
    todaysPracticeInner: {
      padding: spacing.lg,
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
      backgroundColor: theme.accentDangerSoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.accentDanger,
      shadowColor: theme.accentDanger,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
      elevation: 6,
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
    roomHeroInner: {
      minHeight: 120,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: borderRadius.lg,
    },
    roomContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      zIndex: 1,
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
