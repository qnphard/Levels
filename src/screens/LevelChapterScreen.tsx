import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getLevelById } from '../data/levels';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  typography,
  borderRadius,
} from '../theme/colors';
import { ConsciousnessLevel } from '../types';
import { sampleMeditations } from '../data/meditations';
import { featuredArticles } from '../data/articles';
import MeditationCard from '../components/MeditationCard';
import ArticleCard from '../components/ArticleCard';
import PrimaryButton from '../components/PrimaryButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelChapterRouteProp = RouteProp<RootStackParamList, 'LevelChapter'>;

type ChapterTab = 'overview' | 'meditations' | 'articles';

const tabs: { key: ChapterTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'book-outline' },
  { key: 'meditations', label: 'Meditations', icon: 'headset-outline' },
  { key: 'articles', label: 'Articles', icon: 'newspaper-outline' },
];

export default function LevelChapterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelChapterRouteProp>();
  const theme = useThemeColors();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { levelId, initialView } = route.params;
  const level = getLevelById(levelId);

  if (!level) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Level not found</Text>
        <PrimaryButton label="Back to Journey" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const [activeTab, setActiveTab] = useState<ChapterTab>(initialView ?? 'overview');

  const chapterGradient = useMemo(() => {
    const base =
      level.gradient ??
      ([
        adjustColor(level.color, 12),
        adjustColor(level.color, -16),
      ] as const);
    const dark = level.gradientDark ?? base;
    const pair = theme.mode === 'dark' ? dark : base;
    const [start, end] = pair;
    const tail = adjustColor(
      end,
      theme.mode === 'dark' ? -8 : -24
    );
    return [start, end, tail] as const;
  }, [level.gradient, level.gradientDark, level.color, theme.mode]);

  const filteredMeditations = useMemo(
    () =>
      sampleMeditations.filter((meditation) => {
        if (meditation._level == null) {
          return false;
        }
        return Math.abs(meditation._level - level.level) <= 80;
      }),
    [level.level]
  );

  const filteredArticles = useMemo(
    () =>
      featuredArticles.filter((article) => {
        if (article.calibration == null) {
          return false;
        }
        return Math.abs(article.calibration - level.level) <= 80;
      }),
    [level.level]
  );

  const handleOpenDetail = () => {
    navigation.navigate('LevelDetail', { levelId: level.id });
  };

  const renderOverview = (item: ConsciousnessLevel) => (
    <View style={styles.sectionStack}>
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>What this level feels like</Text>
        <Text style={styles.sectionBody}>{item.description}</Text>
      </View>

      <View style={styles.splitRow}>
        <View style={styles.splitCard}>
          <Text style={styles.splitTitle}>The Trap</Text>
          <Text style={styles.splitBody}>{item.trapDescription}</Text>
        </View>
        <View style={[styles.splitCard, styles.splitCardAccent]}>
          <Text style={styles.splitTitle}>Way Through</Text>
          <Text style={styles.splitBody}>{item.wayThrough}</Text>
        </View>
      </View>

      <PrimaryButton label="Deep dive insights" onPress={handleOpenDetail} />
    </View>
  );

  const renderMeditations = () => (
    <View style={styles.sectionStack}>
      <Text style={styles.sectionTitle}>Guided Practices</Text>
      {filteredMeditations.length ? (
        filteredMeditations.map((meditation) => (
          <MeditationCard
            key={meditation.id}
            meditation={meditation}
            onPress={() => navigation.navigate('Player', { meditation })}
            style={styles.meditationCard}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name='hourglass-outline' size={28} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Practices in progress</Text>
          <Text style={styles.emptySubtitle}>
            We are composing meditations tuned exactly for {level.name}. Check back soon.
          </Text>
        </View>
      )}
    </View>
  );

  const renderArticles = () => (
    <View style={styles.sectionStack}>
      <Text style={styles.sectionTitle}>Reading Room</Text>
      {filteredArticles.length ? (
        filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPress={() => {
              if (article.url) {
                // ArticleCard already handles linking internally
                return;
              }
            }}
            style={styles.articleCard}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name='book-outline' size={28} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Guides arriving soon</Text>
          <Text style={styles.emptySubtitle}>
            Essays and prompts for {level.name} are being distilled now.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={chapterGradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          <Text style={styles.backLabel}>Journey</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.levelLabel}>
            Level {level.level}
          </Text>
          <Text style={styles.levelTitle}>
            {level.level < 200 ? `Transcending ${level.name}` : level.name}
          </Text>
          <View style={styles.levelPill}>
            <Ionicons name="sparkles-outline" size={16} color={theme.white} />
            <Text style={styles.levelPillText}>
              Through {level.antithesis}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={chapterGradient}
        style={styles.bodyGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? theme.white : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'overview' && renderOverview(level)}
          {activeTab === 'meditations' && renderMeditations()}
          {activeTab === 'articles' && renderArticles()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    fallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    fallbackTitle: {
      fontSize: typography.h3,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    header: {
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.18)',
      borderRadius: borderRadius.sm,
    },
    backLabel: {
      fontSize: typography.small,
      color: '#FFFFFF',
      fontWeight: typography.medium,
      letterSpacing: 0.6,
    },
    headerContent: {
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    levelLabel: {
      fontSize: typography.small,
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    levelTitle: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    levelPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: borderRadius.roundedChip,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    levelPillText: {
      color: '#FFFFFF',
      fontSize: typography.small,
      fontWeight: typography.medium,
    },
    bodyGradient: {
      flex: 1,
    },
    tabRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    tabButton: {
      flex: 1,
      borderRadius: borderRadius.roundedChip,
      paddingVertical: spacing.sm,
      backgroundColor: 'rgba(255,255,255,0.18)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    tabButtonActive: {
      backgroundColor: theme.accentTeal,
    },
    tabLabel: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: typography.medium,
    },
    tabLabelActive: {
      color: theme.white,
    },
    contentScroll: {
      flex: 1,
      marginTop: spacing.md,
    },
    contentContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    sectionStack: {
      gap: spacing.lg,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(12, 28, 36, 0.72)'
          : theme.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
    infoCard: {
      gap: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
    },
    sectionBody: {
      fontSize: typography.body,
      lineHeight: 22,
      color: theme.textSecondary,
    },
    splitRow: {
      flexDirection: 'row',
      gap: spacing.md,
      flexWrap: 'wrap',
    },
    splitCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(10, 24, 32, 0.85)'
          : theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : theme.border,
      gap: spacing.xs,
    },
    splitCardAccent: {\n      backgroundColor:\n        theme.mode === 'dark'\n          ? 'rgba(94, 234, 212, 0.08)'\n          : theme.primarySubtle,\n      borderColor:\n        theme.mode === 'dark'\n          ? 'rgba(94, 234, 212, 0.3)'\n          : theme.primary,\n    },
    splitTitle: {
      fontSize: typography.small,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.textPrimary,
      fontWeight: typography.semibold,
    },
    splitBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    meditationCard: {
      marginBottom: spacing.md,
    },
    articleCard: {
      marginBottom: spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(10, 24, 32, 0.85)'
          : theme.cardBackground,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : theme.border,
    },
    emptyTitle: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
    },
    emptySubtitle: {
      fontSize: typography.small,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });



