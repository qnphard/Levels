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
import { RootStackParamList } from '../navigation/AppNavigator';
import MeditationCard from '../components/MeditationCard';
import ArticleCard from '../components/ArticleCard';
import PrimaryButton from '../components/PrimaryButton';
import SOSBottomSheet from '../components/SOSBottomSheet';
import { Article } from '../types';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { getLevelById } from '../data/levels';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSOS, setShowSOS] = useState(false);
  const theme = useThemeColors();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileIcon}
            >
              <Ionicons name="person-outline" size={24} color={theme.mode === 'dark' ? '#F8FAFC' : '#1E293B'} />
            </TouchableOpacity>
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
              style={styles.journeyCard}
              onPress={() => navigation.navigate('LevelChapter', { levelId: lastLevel.id })}
              activeOpacity={0.9}
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
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? '#F8FAFC' : '#1E293B',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? '#CBD5E1' : '#475569',
      fontWeight: typography.regular,
      opacity: 0.9,
      fontStyle: 'italic',
    },
    todaysPracticeCard: {
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },
    todaysPracticeLabel: {
      fontSize: typography.small,
      color: theme.accentGold,
      fontWeight: typography.semibold,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: spacing.sm,
    },
    todaysPracticeTitle: {
      fontSize: typography.h3,
      color: theme.textPrimary,
      fontWeight: typography.bold,
      marginBottom: spacing.xs,
    },
    todaysPracticeDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.lg,
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
      fontWeight: typography.medium,
      fontSize: typography.small,
    },
    categoryTextActive: {
      fontWeight: typography.semibold,
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
      fontWeight: typography.bold,
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
    journeyModule: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    journeyCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
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
      fontWeight: typography.bold,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    journeyTitle: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: typography.bold,
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
  });
