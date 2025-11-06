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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sampleMeditations } from '../data/meditations';
import { featuredArticles } from '../data/articles';
import { RootStackParamList } from '../navigation/AppNavigator';
import MeditationCard from '../components/MeditationCard';
import ArticleCard from '../components/ArticleCard';
import PrimaryButton from '../components/PrimaryButton';
import { Article } from '../types';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const theme = useThemeColors();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const categories = ['All', 'Find Peace', 'Let Go', 'Discover Joy', 'Be Present', 'Rest Deeply'];

  const filteredMeditations =
    selectedCategory === 'All'
      ? sampleMeditations
      : sampleMeditations.filter((m) => m.category === selectedCategory);

  // Get appropriate practice based on time of day
  const getTodaysPractice = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return sampleMeditations.find((m) => m.title === 'Morning Centering');
    } else if (hour >= 18) {
      return sampleMeditations.find((m) => m.title === 'Evening Wind Down');
    }
    return sampleMeditations.find((m) => m.title === 'Breath Awareness');
  };

  const todaysPractice = getTodaysPractice();
  const handleArticlePress = (article: Article) => {
    if (!article.url) return;
    Linking.openURL(article.url).catch(() => {});
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
      locations={[0, 0.45, 1]}
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
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
      paddingBottom: spacing.xl,
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
      color: '#1E293B',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: typography.body,
      color: '#475569',
      fontWeight: typography.regular,
      opacity: 0.9,
      fontStyle: 'italic',
    },
    todaysPracticeCard: {
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.lg,
      marginTop: -spacing.xl,
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
  });
