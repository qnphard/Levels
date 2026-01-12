import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
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
import { feelingsChapters, getChaptersByCategory } from '../data/feelingsChapters';
import { FeelingChapterCategory } from '../types';
import ChapterCard from '../components/ChapterCard';
import { useChapterProgress } from '../hooks/useChapterProgress';
import { RootStackParamList } from '../navigation/AppNavigator';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LearnHub'>;

export default function LearnHubScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const window = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    FeelingChapterCategory | 'All'
  >('All');
  const { getProgress } = useChapterProgress();

  // Filter chapters based on search and category
  const filteredChapters = useMemo(() => {
    let chapters = getChaptersByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      chapters = chapters.filter(
        (chapter) =>
          chapter.title.toLowerCase().includes(query) ||
          chapter.summary.toLowerCase().includes(query) ||
          chapter.category.toLowerCase().includes(query)
      );
    }

    return chapters;
  }, [searchQuery, selectedCategory]);

  const categories: (FeelingChapterCategory | 'All')[] = [
    'All',
    'Coping Patterns',
    'Triggers',
    'Body',
    'Mind',
  ];

  const handleChapterPress = (chapterId: string) => {
    navigation.navigate('Chapter', { chapterId });
  };

  // Calculate card width for grid (always 2 per row regardless of screen size)
  const cardWidth = useMemo(() => {
    const screenWidth = window.width;
    const horizontalPadding = spacing.lg * 2; // padding on both sides
    const gap = spacing.md; // gap between cards
    const availableWidth = screenWidth - horizontalPadding - gap; // subtract one gap for 2 cards
    const cardWidthForTwo = Math.floor(availableWidth / 2);
    // Ensure minimum width but always show 2 cards per row
    return Math.max(cardWidthForTwo, 140);
  }, [window.width]);

  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feelings Explained</Text>
        <View style={styles.backButton} />
      </View>

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
          placeholder="Search chapters..."
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

      {/* Filter Chips */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                  isSelected && {
                    backgroundColor: theme.feelingsChapters.sky + '20',
                    borderColor: theme.feelingsChapters.sky,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && { color: theme.feelingsChapters.sky },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Chapters Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredChapters.length > 0 ? (
          <View style={styles.grid}>
            {filteredChapters.map((chapter) => {
              const progress = getProgress(chapter.id);
              return (
                <View key={chapter.id} style={[styles.cardWrapper, { width: cardWidth }]}>
                  <ChapterCard
                    chapter={chapter}
                    progress={progress}
                    onPress={() => handleChapterPress(chapter.id)}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={theme.textMuted} />
            <Text style={styles.emptyText}>No chapters found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}

        <RelatedNextCard
          relatedIds={['tension', 'letting-go', 'what-you-really-are']}
          currentScreenId="feelings-explained"
        />
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
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.lg,
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
    filterWrapper: {
      marginBottom: spacing.md,
    },
    filterContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    filterChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
      marginRight: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterChipSelected: {
      borderWidth: 2,
    },
    filterChipText: {
      fontSize: typography.small,
      fontWeight: typography.medium,
      color: theme.textPrimary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      alignItems: 'flex-start',
    },
    cardWrapper: {
      alignItems: 'stretch',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
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
  });

