import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getLevelById } from '../data/levels';
import {
  useThemeColors,
  useGlowEnabled,
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
  const glowEnabled = useGlowEnabled();
  const { width: windowWidth } = useWindowDimensions();
  const { levelId, initialView, sourceFeeling, levelTheme: routeLevelTheme } = route.params;
  const level = getLevelById(levelId);

  const levelTheme = useMemo(() => {
    if (routeLevelTheme) {
      return routeLevelTheme;
    }
    if (level) {
      const baseGradient =
        level.gradient ??
        ([adjustColor(level.color, 18), adjustColor(level.color, -10)] as const);
      const darkGradient = level.gradientDark ?? baseGradient;
      return {
        gradient: baseGradient,
        gradientDark: darkGradient,
        color: level.color,
        glowDark: level.glowDark,
      };
    }
    return null;
  }, [routeLevelTheme, level]);

  const luminousAccent = useMemo(() => {
    if (!levelTheme) return theme.primary;
    if (theme.mode === 'dark') {
      return (
        levelTheme.glowDark ||
        levelTheme.gradientDark[0] ||
        adjustColor(levelTheme.color, 8)
      );
    }
    return levelTheme.gradient[0] ?? adjustColor(levelTheme.color, -6);
  }, [levelTheme, theme]);

  // Get level-specific button color (toned down by 20% in dark theme)
  const buttonColor = useMemo(() => {
    if (!levelTheme) return theme.primary;
    const baseColor =
      theme.mode === 'dark'
        ? levelTheme.glowDark || levelTheme.gradientDark[0] || levelTheme.color
        : levelTheme.gradient[0] || levelTheme.color;
    // Tone down by 20% in dark theme (80% opacity)
    return theme.mode === 'dark' ? toRgba(baseColor, 0.8) : baseColor;
  }, [levelTheme, theme]);

  const styles = useMemo(
    () => getStyles(theme, luminousAccent, windowWidth, glowEnabled),
    [theme, luminousAccent, windowWidth, glowEnabled]
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
    if (!levelTheme) return [theme.primary, theme.primary, theme.primary];
    const pair = theme.mode === 'dark' ? levelTheme.gradientDark : levelTheme.gradient;
    const [start, end] = pair;
    const tail = adjustColor(end, theme.mode === 'dark' ? -8 : -24);
    return [start, end, tail] as const;
  }, [levelTheme, theme.mode]);

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
    navigation.navigate('LevelDetail', { levelId: level.id, levelTheme });
  };

  const renderOverview = (item: ConsciousnessLevel) => (
    <View style={styles.sectionStack}>
      {sourceFeeling && (
        <View style={styles.sourceFeelingCard}>
          <Ionicons name="sparkles-outline" size={20} color={luminousAccent} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.sourceFeelingTitle}>Why this shows up</Text>
            <Text style={styles.sourceFeelingText}>
              You selected "{sourceFeeling}". This level helps you understand and transcend that feeling.
            </Text>
          </View>
        </View>
      )}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>What this level feels like</Text>
        <Text style={styles.sectionBody}>{item.description}</Text>
      </View>

      <View style={styles.splitRow}>
        <View style={styles.splitCard}>
          <Text style={styles.splitTitle}>The Trap</Text>
          <Text 
            style={styles.splitBody}
            textBreakStrategy="highQuality"
            allowFontScaling={true}
          >
            {item.trapDescription}
          </Text>
        </View>
        <View style={[styles.splitCard, styles.splitCardAccent]}>
          <Text style={styles.splitTitle}>Way Through</Text>
          <Text 
            style={styles.splitBody}
            textBreakStrategy="highQuality"
            allowFontScaling={true}
          >
            {item.wayThrough}
          </Text>
        </View>
      </View>

      <PrimaryButton 
        label="Deep dive insights" 
        onPress={handleOpenDetail}
        backgroundColor={buttonColor}
        textColor={theme.white}
      />
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
            We are composing meditations tuned exactly for {String(level.name || '')}. Check back soon.
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
            Essays and prompts for {String(level.name || '')} are being distilled now.
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
          <Ionicons name="chevron-back" size={22} color={theme.mode === 'dark' ? '#FFFFFF' : '#1E293B'} />
          <Text style={styles.backLabel}>Journey</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.levelLabel}>
            Level {level.level}
          </Text>
          <Text style={styles.levelTitle}>
            {level.level < 200 ? `Transcending ${String(level.name || '')}` : String(level.name || '')}
          </Text>
          <View style={styles.levelPill}>
            <Ionicons 
              name="sparkles-outline" 
              size={16} 
              color={theme.mode === 'dark' ? theme.white : '#041017'} 
            />
            <Text style={styles.levelPillText}>
              Through {String(level.antithesis || '')}
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
                  color={isActive 
                    ? (theme.mode === 'dark' ? theme.white : '#061016')
                    : (theme.mode === 'dark' ? theme.textSecondary : '#475569')}
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

const getStyles = (theme: ThemeColors, accent: string, windowWidth: number, glowEnabled: boolean) =>
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
      color: theme.mode === 'dark' ? '#FFFFFF' : '#1E293B',
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
          : '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    levelTitle: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.mode === 'dark' ? '#F8FAFC' : '#FFFFFF',
      letterSpacing: -0.5,
      textShadowColor:
        theme.mode === 'dark' ? toRgba(accent, 0.4) : 'rgba(0,0,0,0.2)',
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
      color: theme.mode === 'dark' ? '#FFFFFF' : '#041017',
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
        theme.mode === 'dark' ? toRgba(accent, 0.56) : toRgba(accent, 0.3), // Toned down by 20% in dark (0.7 * 0.8 = 0.56)
      borderColor:
        theme.mode === 'dark' ? toRgba(accent, 0.68) : toRgba(accent, 0.5), // Toned down by 20% in dark (0.85 * 0.8 = 0.68)
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        shadowColor: accent,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    tabLabel: {
      fontSize: typography.small,
      color:
        theme.mode === 'dark'
          ? toRgba('#E9F2F4', 0.72)
          : '#1E293B', // Dark text for light theme
      fontWeight: typography.medium,
      letterSpacing: 0.4,
    },
    tabLabelActive: {
      color: theme.mode === 'dark' ? theme.white : '#061016',
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
      borderWidth: glowEnabled ? 2 : 1,
      borderColor:
        glowEnabled
          ? (theme.mode === 'dark'
              ? toRgba(accent, 0.5)
              : toRgba(accent, 0.3))
          : (theme.mode === 'dark'
              ? toRgba(accent, 0.24)
              : theme.border),
      shadowColor:
        glowEnabled
          ? accent
          : (theme.mode === 'dark' ? 'rgba(0,0,0,0.55)' : theme.shadowSoft),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: glowEnabled
        ? (theme.mode === 'dark' ? 0.3 : 0.25)
        : (theme.mode === 'dark' ? 0.32 : 0.1),
      shadowRadius: glowEnabled
        ? (theme.mode === 'dark' ? 16 : 14)
        : (theme.mode === 'dark' ? 24 : 12),
      elevation: 0, // Remove elevation to prevent artifacts
    },
    sourceFeelingCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.15)
          : toRgba(accent, 0.08),
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.3)
          : toRgba(accent, 0.2),
      marginBottom: spacing.sm,
    },
    sourceFeelingTitle: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sourceFeelingText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 20,
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
          ? toRgba('#E8F4F4', 0.85) // Slightly brighter for better contrast
          : theme.textPrimary, // Changed from textSecondary to textPrimary for better contrast
    },
    splitRow: {
      flexDirection: windowWidth < 400 ? 'column' : 'row',
      gap: spacing.md,
      width: '100%',
    },
    splitCard: {
      flex: windowWidth < 400 ? 0 : 1,
      width: windowWidth < 400 ? '100%' : undefined,
      minWidth: 0, // Allow flexbox to properly shrink
      maxWidth: windowWidth < 400 ? '100%' : undefined,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(5, 16, 26, 0.85)'
          : theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: glowEnabled ? 2 : 1,
      borderColor:
        glowEnabled
          ? (theme.mode === 'dark'
              ? toRgba(accent, 0.5)
              : toRgba(accent, 0.3))
          : (theme.mode === 'dark'
              ? toRgba(accent, 0.22)
              : theme.border),
      gap: spacing.xs,
      overflow: 'hidden', // Prevent content overflow
      ...(glowEnabled && theme.mode === 'dark' && {
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        shadowColor: accent,
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
    },
    splitCardAccent: {
      backgroundColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.2)
          : toRgba(accent, 0.15),
      borderColor:
        theme.mode === 'dark'
          ? toRgba(accent, 0.42)
          : toRgba(accent, 0.4),
      ...(glowEnabled && theme.mode === 'dark' && {
        borderWidth: 2,
        shadowColor: accent,
        shadowOpacity: 0.3,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
      ...(glowEnabled && theme.mode === 'light' && {
        borderWidth: 2,
        shadowColor: accent,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }),
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
          : theme.textPrimary, // Changed from textSecondary to textPrimary for better contrast
      lineHeight: 22,
      flexShrink: 1,
      flexWrap: 'wrap', // Allow text to wrap
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



