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
  const { levelId, initialView } = route.params;
  const level = getLevelById(levelId);
  const luminousAccent = useMemo(() => {
    if (!level) {
      return theme.primary;
    }
    if (theme.mode === 'dark') {
      return (
        level.glowDark ||
        level.gradientDark?.[0] ||
        adjustColor(level.color, 8)
      );
    }
    return level.gradient?.[0] ?? adjustColor(level.color, -6);
  }, [level, theme]);
  const styles = useMemo(
    () => getStyles(theme, luminousAccent),
    [theme, luminousAccent]
  );

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

const toRgba = (color: string, alpha = 1): string => {
  const hex = color.replace('#', '');
  const expand = (v: string) =>
    parseInt(v.length === 1 ? v + v : v, 16);
  const r = expand(hex.substring(0, hex.length >= 6 ? 2 : 1));
  const g = expand(
    hex.substring(
      hex.length >= 6 ? 2 : 1,
      hex.length >= 6 ? 4 : 2
    )
  );
  const b = expand(
    hex.substring(
      hex.length >= 6 ? 4 : 2,
      hex.length >= 6 ? 6 : 3
    )
  );
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

const getStyles = (theme: ThemeColors, accent: string) =>
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
      color:
        theme.mode === 'dark'
          ? toRgba(accent, 0.85)
          : 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    levelTitle: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? '#F8FAFC' : '#FFFFFF',
      letterSpacing: -0.5,
      textShadowColor:
        theme.mode === 'dark' ? toRgba(accent, 0.4) : 'rgba(255,255,255,0.4)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 12,
    },
    levelPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.28)
          : 'rgba(255,255,255,0.18)',
      borderRadius: borderRadius.roundedChip,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    levelPillText: {
      color: theme.mode === 'dark' ? '#041017' : '#FFFFFF',
      fontSize: typography.small,
      fontWeight: typography.medium,
      letterSpacing: 0.5,
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
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.18)
          : 'rgba(255,255,255,0.18)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderWidth: theme.mode === 'dark' ? 1 : 0,
      borderColor:
        theme.mode === 'dark' ? toRgba(accent, 0.28) : 'transparent',
    },
    tabButtonActive: {
      backgroundColor:
        theme.mode === 'dark' ? toRgba(accent, 0.7) : theme.accentTeal,
      borderColor:
        theme.mode === 'dark' ? toRgba(accent, 0.85) : theme.accentTeal,
    },
    tabLabel: {
      fontSize: typography.small,
      color:
        theme.mode === 'dark'
          ? toRgba('#E9F2F4', 0.72)
          : theme.textSecondary,
      fontWeight: typography.medium,
      letterSpacing: 0.4,
    },
    tabLabelActive: {
      color: theme.mode === 'dark' ? '#061016' : theme.white,
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
          ? 'rgba(7, 18, 28, 0.82)'
          : theme.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.24)
          : theme.border,
      shadowColor:
        theme.mode === 'dark' ? 'rgba(0,0,0,0.55)' : theme.shadowSoft,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.mode === 'dark' ? 0.32 : 0.1,
      shadowRadius: theme.mode === 'dark' ? 24 : 12,
      elevation: theme.mode === 'dark' ? 6 : 3,
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
      color:
        theme.mode === 'dark'
          ? toRgba('#E8F4F4', 0.78)
          : theme.textSecondary,
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
          ? 'rgba(5, 16, 26, 0.85)'
          : theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.22)
          : theme.border,
      gap: spacing.xs,
    },
    splitCardAccent: {
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.2)
          : theme.primarySubtle,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.42)
          : theme.primary,
    },
    splitTitle: {
      fontSize: typography.small,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.textPrimary,
      fontWeight: typography.semibold,
    },
    splitBody: {
      fontSize: typography.body,
      color:
        theme.mode === 'dark'
          ? toRgba('#E8F4F4', 0.78)
          : theme.textSecondary,
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
          ? 'rgba(5, 15, 24, 0.78)'
          : theme.cardBackground,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.22)
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



