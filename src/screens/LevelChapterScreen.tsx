import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
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
import { useUserStore } from '../store/userStore';
import { LivingBackground } from '../components/LivingBackground';
import { KineticText } from '../components/KineticText';
import { GlassSurface } from '../components/GlassSurface';
import { HapticOrchestrator } from '../services/HapticOrchestrator';

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
  const { levelId, initialView, sourceFeeling } = route.params;
  const setLastAccessedLevel = useUserStore((s) => s.setLastAccessedLevel);

  useEffect(() => {
    if (levelId) {
      setLastAccessedLevel(levelId);
    }
  }, [levelId, setLastAccessedLevel]);

  const level = getLevelById(levelId);
  const luminousAccent = useMemo(() => {
    if (!level) return theme.primary;
    if (theme.mode === 'dark') {
      return level.glowDark || level.gradientDark?.[0] || adjustColor(level.color, 8);
    }
    return level.gradient?.[0] ?? adjustColor(level.color, -6);
  }, [level, theme]);

  const buttonColor = useMemo(() => {
    if (!level) return theme.primary;
    const baseColor = theme.mode === 'dark'
      ? (level.glowDark || level.gradientDark?.[0] || level.color)
      : (level.gradient?.[0] || level.color);
    return theme.mode === 'dark' ? toRgba(baseColor, 0.8) : baseColor;
  }, [level, theme]);

  const styles = useMemo(
    () => getStyles(theme, luminousAccent, windowWidth, glowEnabled),
    [theme, luminousAccent, windowWidth, glowEnabled]
  );

  const [activeTab, setActiveTab] = useState<ChapterTab>(initialView ?? 'overview');

  const handleTabPress = (key: ChapterTab) => {
    HapticOrchestrator.tick();
    setActiveTab(key);
  };

  if (!level) {
    return (
      <View style={styles.fallback}>
        <LivingBackground />
        <Text style={styles.fallbackTitle}>Level not found</Text>
        <PrimaryButton label="Back to Journey" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const filteredMeditations = useMemo(
    () =>
      sampleMeditations.filter((meditation) => {
        if (meditation._level == null) return false;
        return Math.abs(meditation._level - level.level) <= 80;
      }),
    [level.level]
  );

  const filteredArticles = useMemo(
    () =>
      featuredArticles.filter((article) => {
        if (article.calibration == null) return false;
        return Math.abs(article.calibration - level.level) <= 80;
      }),
    [level.level]
  );

  const handleOpenDetail = () => {
    HapticOrchestrator.elementClick();
    navigation.navigate('LevelDetail', { levelId: level.id });
  };

  const renderOverview = (item: ConsciousnessLevel) => (
    <View style={styles.tabContentGap}>
      {sourceFeeling && (
        <GlassSurface style={styles.sourceFeelingCard} intensity={20}>
          <View style={styles.row}>
            <Ionicons name="sparkles-outline" size={20} color={luminousAccent} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.sourceFeelingTitle}>Why this shows up</Text>
              <Text style={styles.sourceFeelingText}>
                You selected "{sourceFeeling}". This level helps you understand and transcend that feeling.
              </Text>
            </View>
          </View>
        </GlassSurface>
      )}

      <GlassSurface style={styles.infoCard}>
        <Text style={styles.sectionTitle}>What this level feels like</Text>
        <Text style={[styles.sectionBody, { color: theme.textPrimary }]}>{item.description}</Text>
      </GlassSurface>

      <View style={styles.splitRow}>
        <GlassSurface style={[styles.splitCard, { flex: 1 }]}>
          <Text style={[styles.splitTitle, { color: theme.mode === 'dark' ? '#FF6B6B' : theme.textSecondary }]}>The Trap</Text>
          <Text style={[styles.splitBody, { fontStyle: 'italic', color: theme.textPrimary }]}>{item.trapDescription}</Text>
        </GlassSurface>

        <GlassSurface style={[styles.splitCard, { flex: 1, borderColor: toRgba(luminousAccent, 0.4) }]} intensity={50}>
          <Text style={[styles.splitTitle, { color: luminousAccent }]}>Way Through</Text>
          <Text style={[styles.splitBody, { color: theme.textPrimary }]}>{item.wayThrough}</Text>
        </GlassSurface>
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
    <View style={styles.tabContentGap}>
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
        <GlassSurface style={styles.emptyState}>
          <Ionicons name='hourglass-outline' size={28} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Practices in progress</Text>
          <Text style={styles.emptySubtitle}>
            We are composing meditations tuned exactly for {String(level.name || '')}. Check back soon.
          </Text>
        </GlassSurface>
      )}
    </View>
  );

  const renderArticles = () => (
    <View style={styles.tabContentGap}>
      <Text style={styles.sectionTitle}>Reading Room</Text>
      {filteredArticles.length ? (
        filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPress={() => { }}
            style={styles.articleCard}
          />
        ))
      ) : (
        <GlassSurface style={styles.emptyState}>
          <Ionicons name='book-outline' size={28} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Guides arriving soon</Text>
          <Text style={styles.emptySubtitle}>
            Essays and prompts for {String(level.name || '')} are being distilled now.
          </Text>
        </GlassSurface>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LivingBackground />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main' as never);
            }
          }}
          hitSlop={20}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.levelLabel}>LEVEL {level.level}</Text>
          <KineticText type="display" style={styles.levelTitle} delay={100}>
            {String(level.name || '')}
          </KineticText>
          <View style={styles.levelPill}>
            <Ionicons name="sparkles-outline" size={12} color={theme.textPrimary} />
            <Text style={styles.levelPillText}>Through {String(level.antithesis || '')}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tabButton,
                isActive && styles.tabButtonActive,
                isActive && { backgroundColor: toRgba(luminousAccent, 0.2), borderColor: toRgba(luminousAccent, 0.4) }
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={isActive ? theme.textPrimary : theme.textSecondary}
              />
              <Text style={[
                styles.tabLabel,
                isActive && { color: theme.textPrimary, fontWeight: '600' }
              ]}>
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
        <View style={{ height: 100 }} />
      </ScrollView>
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
  if (color.startsWith('rgba')) {
    return color; // Already rgba
  }
  const hex = color.replace('#', '');
  const expand = (v: string) => parseInt(v.length === 1 ? v + v : v, 16);
  const r = expand(hex.substring(0, hex.length >= 6 ? 2 : 1));
  const g = expand(hex.substring(hex.length >= 6 ? 2 : 1, hex.length >= 6 ? 4 : 2));
  const b = expand(hex.substring(hex.length >= 6 ? 4 : 2, hex.length >= 6 ? 6 : 3));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      borderRadius: 20,
      marginBottom: spacing.md,
    },
    headerContent: {
      gap: spacing.xs,
    },
    levelLabel: {
      fontSize: 12,
      letterSpacing: 1.5,
      color: toRgba(theme.textPrimary, 0.7),
      fontWeight: '600',
    },
    levelTitle: {
      marginBottom: spacing.xs,
      color: theme.textPrimary,
    },
    levelPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    levelPillText: {
      fontSize: 12,
      color: theme.textPrimary,
    },
    tabRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    tabButtonActive: {
      // Handled in render logic for dynamic color
    },
    tabLabel: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    contentScroll: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: 40,
    },
    tabContentGap: {
      gap: spacing.lg,
    },
    sourceFeelingCard: {
      padding: spacing.md,
      borderRadius: 16,
    },
    row: {
      flexDirection: 'row',
    },
    sourceFeelingTitle: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.textPrimary,
      fontWeight: '700',
      marginBottom: 4,
    },
    sourceFeelingText: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    infoCard: {
      padding: spacing.lg,
      gap: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.h3,
      color: theme.textPrimary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    sectionBody: {
      fontSize: 16,
      lineHeight: 26,
      color: toRgba(theme.textPrimary, 0.9),
    },
    splitRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    splitCard: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    splitTitle: {
      fontSize: 11,
      textTransform: 'uppercase',
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    splitBody: {
      fontSize: 14,
      lineHeight: 22,
      // Color is handled inline to ensure contrast
    },
    meditationCard: {
      marginBottom: spacing.md,
    },
    articleCard: {
      marginBottom: spacing.md,
    },
    emptyState: {
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.sm,
    },
    emptyTitle: {
      fontSize: typography.body,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    }
  });
