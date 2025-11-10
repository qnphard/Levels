import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  useWindowDimensions,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  GestureResponderEvent,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SafeBlurView from '../components/SafeBlurView';
import FeelingsExplainedCard from '../components/FeelingsExplainedCard';
import WhyFeelingSheet from '../components/WhyFeelingSheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { consciousnessLevels } from '../data/levels';
import { ConsciousnessLevel } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
  useGlowEnabled,
} from '../theme/colors';
import { useUserProgress } from '../context/UserProgressContext';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CategoryKey = ConsciousnessLevel['category'];
type ChapterView = 'overview' | 'meditations' | 'articles';

const lightGlowPalette: Record<string, string> = {
  shame: '#F472B6',
  guilt: '#FBBF24',
  apathy: '#38BDF8',
  grief: '#5EEAD4',
  fear: '#FACC15',
  desire: '#FB923C',
  anger: '#F87171',
  pride: '#A78BFA',
  courage: '#34D399',
  neutrality: '#94A3B8',
  willingness: '#4ADE80',
  acceptance: '#C084FC',
  reason: '#60A5FA',
  love: '#F472B6',
  joy: '#FACC15',
  peace: '#93C5FD',
};

const { width } = Dimensions.get('window');
const canBlur = Platform.OS !== 'web';
const CARD_HEIGHT = Platform.OS === 'android' ? 320 : 300; // Increased height to accommodate more text

const categoryIcons: Record<
  CategoryKey,
  keyof typeof Ionicons.glyphMap
> = {
  healing: 'heart-outline',
  empowerment: 'flash-outline',
  spiritual: 'planet-outline',
  enlightenment: 'infinite-outline',
};

const categoryDescriptions: Record<CategoryKey, string> = {
  healing: 'Transmute dense emotions into courage and steadiness.',
  empowerment: 'Step into truthful power and aligned action. The Transitional Pathway To Love',
  spiritual: 'Live from compassion, devotion, and openhearted presence.',
  enlightenment: 'Rest in non-dual awareness and effortless being.',
};

export default function JourneyMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const window = useWindowDimensions();
  const cardWidth = useMemo(() => {
    const screenWidth = window.width || width;
    const horizontalPadding = spacing.lg * 2; // padding on both sides (24px * 2 = 48px)
    const gap = Platform.OS === 'android' 
      ? (theme.mode === 'light' ? spacing.md : spacing.sm)
      : spacing.lg; // gap between cards
    const availableWidth = screenWidth - horizontalPadding - gap; // subtract gap for 2 cards
    const cardWidthForTwo = Math.floor(availableWidth / 2);
    
    // Always show 2 cards per row regardless of screen size
    // Ensure minimum width but maintain 2 cards per row
    return Math.max(cardWidthForTwo, 140);
  }, [window.width, theme.mode]);
  const styles = useMemo(() => getStyles(theme, cardWidth, glowEnabled), [theme, cardWidth, glowEnabled]);
  const auroraAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const auroraLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(auroraAnim, {
          toValue: 1,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auroraAnim, {
          toValue: 0,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    auroraLoop.start();
    return () => auroraLoop.stop();
  }, [auroraAnim]);

  const auroraTranslate = useMemo(
    () =>
      auroraAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-65, 65],
      }),
    [auroraAnim]
  );
  const auroraOpacity = useMemo(
    () =>
      auroraAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.28, 0.5, 0.28],
      }),
    [auroraAnim]
  );
  const { progress } = useUserProgress();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showWhyFeelingSheet, setShowWhyFeelingSheet] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<CategoryKey, boolean>
  >({
    healing: true,
    empowerment: true,
    spiritual: true,
    enlightenment: true,
  });
  
  const [transcendingExpanded, setTranscendingExpanded] = useState(false);

  const categoryOrder: CategoryKey[] = [
    'healing',
    'empowerment',
    'spiritual',
    'enlightenment',
  ];

  useEffect(() => {
    if (
      progress?.firstEngagedWithCourage &&
      !progress.exploredLevels.includes('courage')
    ) {
      setShowDisclaimer(true);
    }
  }, [progress]);

  const horizonGradient = useMemo<readonly [string, string, string]>(() => {
    const pick = (colors: readonly string[]) =>
      [colors[0], colors[1], colors[2]] as const;

    if (theme.mode === 'dark') {
      return ['#03070F', '#0B1626', '#102436'] as const;
    }

    const hour = new Date().getHours();
    if (hour >= 20 || hour < 5) {
      return pick(theme.gradients.horizonNight);
    }
    if (hour >= 17) {
      return pick(theme.gradients.horizonEvening);
    }
    return pick(theme.gradients.horizonDay);
  }, [theme]);

  const categoryVisuals = useMemo(() => {
    const isDark = theme.mode === 'dark';
    const blend = (
      base: string,
      accent: string
    ): readonly [string, string] => {
      const baseShift = isDark ? -24 : 28;
      const accentShift = isDark ? -16 : 10;
      return [
        adjustColor(base, baseShift),
        adjustColor(accent, accentShift),
      ] as const;
    };

    return {
      healing: {
        title: 'Healing - Moving Toward Courage',
        gradient: theme.mode === 'dark'
          ? ['#8B5CF6', '#A78BFA'] as const // Deep violet to bright violet
          : ['#C4B5FD', '#E9D5FF'] as const, // Light lavender to very light lavender
      },
      empowerment: {
        title: 'Transcending The Lower Power-Based Levels',
        gradient: theme.mode === 'dark'
          ? ['#7C3AED', '#8B5CF6'] as const // Deep purple to violet
          : ['#DDD6FE', '#F3E8FF'] as const, // Light purple to very light purple
      },
      spiritual: {
        title: 'Spiritual - Heart-Centered Reality',
        gradient: theme.mode === 'dark'
          ? ['#A78BFA', '#C4B5FD'] as const // Bright violet to lavender
          : ['#EDE9FE', '#F5F3FF'] as const, // Very light purple to near white purple
      },
      enlightenment: {
        title: 'Enlightenment - Non-Dual Awareness',
        gradient: theme.mode === 'dark'
          ? ['#C4B5FD', '#DDD6FE'] as const // Lavender to light purple
          : ['#F5F3FF', '#FAF5FF'] as const, // Near white purple to almost white
      },
    } as Record<
      CategoryKey,
      { title: string; gradient: readonly [string, string] }
    >;
  }, [theme]);

  // Visuals for Transcending Levels section
  const transcendingVisuals = useMemo(() => ({
    title: 'Transcending The Force-Based Levels',
    description: '→ Overcome the negative emotional and spiritual blocks which hold you back from being your natural best self',
    gradient: theme.mode === 'dark'
      ? ['#6B21A8', '#7C3AED'] as const // Deep purple to violet
      : ['#E9D5FF', '#F3E8FF'] as const, // Light purple to very light purple
  }), [theme]);

  const levelsByCategory: Record<CategoryKey, ConsciousnessLevel[]> = {
    healing: [],
    empowerment: [],
    spiritual: [],
    enlightenment: [],
  };

  // Separate transcending levels (below 200) from healing category
  const transcendingLevels: ConsciousnessLevel[] = [];
  
  consciousnessLevels.forEach((level) => {
    if (level.level < 200) {
      // Levels below 200 go to "Transcending Levels" section
      transcendingLevels.push(level);
    } else {
      // Levels 200+ go to their original categories
      levelsByCategory[level.category].push(level);
    }
  });

  const openChapter = (level: ConsciousnessLevel, view: ChapterView) => {
    navigation.navigate('LevelChapter', {
      levelId: level.id,
      initialView: view,
    });
  };

  const handleLevelPress = (level: ConsciousnessLevel) => {
    openChapter(level, 'overview');
  };

  const toggleSection = (category: CategoryKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDismissDisclaimer = () => setShowDisclaimer(false);

  const renderLevelCard = (level: ConsciousnessLevel, index: number) => {
    const isExplored = progress?.exploredLevels.includes(level.id) ?? false;
    const isCurrent = progress?.currentLevel === level.id;
    const isCourage = level.isThreshold;

    const journeyEntry = progress?.journeyPath.find(
      (entry) => entry.levelId === level.id
    );
    const completedCount = journeyEntry?.practicesCompleted ?? 0;
    
    // Use level-specific colors for gradients
    const baseGradient = level.gradient
      ? level.gradient
      : ([
          adjustColor(level.color, 18),
          adjustColor(level.color, -10),
        ] as const);
    const darkGradient = level.gradientDark ? level.gradientDark : baseGradient;
    const gradientColors =
      theme.mode === 'dark' ? darkGradient : baseGradient;
    
    // Use level-specific colors for glow effects
    const glowBase = level.glowDark ?? gradientColors[0];
    const glowLight =
      lightGlowPalette[level.id] ?? adjustColor(gradientColors[0], -12);

    const levelGlowColor = theme.mode === 'dark' ? glowBase : glowLight;
    const levelGlowStyle: Record<string, unknown> = {
      borderColor:
        theme.mode === 'dark'
          ? toRgba(levelGlowColor, isCurrent ? 0.6 : 0.45)
          : toRgba(levelGlowColor, 0.22),
      shadowColor: levelGlowColor,
      shadowOpacity: theme.mode === 'dark' ? 0.6 : 0.24,
      shadowRadius: theme.mode === 'dark' ? 30 : 18,
      shadowOffset: { width: 0, height: theme.mode === 'dark' ? 0 : 10 },
      elevation: theme.mode === 'dark' ? 8 : 4,
    };

    if (Platform.OS === 'web') {
      levelGlowStyle.boxShadow =
        theme.mode === 'dark'
          ? `0 0 44px ${toRgba(levelGlowColor, 0.55)}, 0 0 120px ${toRgba(levelGlowColor, 0.32)}, inset 0 0 28px ${toRgba(levelGlowColor, 0.22)}`
          : `0 10px 32px rgba(15, 23, 42, 0.12), 0 0 60px ${toRgba(levelGlowColor, 0.24)}, 0 0 110px ${toRgba(levelGlowColor, 0.16)}`;
    }

    const antithesisColor =
      theme.mode === 'dark' ? toRgba(glowBase, 0.85) : theme.textSecondary;
    const descriptionColor =
      theme.mode === 'dark' ? toRgba('#E9F1F6', 0.82) : theme.textSecondary;
    const chapterLinkColor =
      theme.mode === 'dark' ? toRgba(glowBase, 0.86) : theme.accentTeal;
    const secondaryIconColor =
      theme.mode === 'dark' ? toRgba(glowBase, 0.92) : theme.textPrimary;
    const exploredTextColor =
      theme.mode === 'dark' ? toRgba('#E8F4F4', 0.82) : theme.textPrimary;
    const exploredIconColor =
      theme.mode === 'dark' ? toRgba(glowBase, 0.9) : theme.accentTeal;
    const thresholdIconColor =
      theme.mode === 'dark' ? toRgba(glowBase, 0.94) : theme.accentGold;

    return (
      <View
        key={level.id}
        style={[
          styles.levelCardContainer,
          theme.mode === 'light' && !glowEnabled
            ? ({ boxShadow: 'none', filter: 'none' } as any)
            : null,
        ]}
      >
        {theme.mode === 'light' && (
          <View
            pointerEvents="none"
            style={styles.lightLiftShadow}
          />
        )}
        <Pressable
          onPress={() => handleLevelPress(level)}
          style={({ pressed }) => [
            styles.levelCard,
            levelGlowStyle,
            theme.mode === 'dark' && {
              backgroundColor: 'rgba(10, 24, 30, 0.82)',
            },
            isCurrent && styles.levelCardCurrent,
            isCourage && styles.levelCardCourage,
            // Then apply theme + glow so it wins for shadow/border
            theme.mode === 'dark'
              ? (glowEnabled
                  ? {
                      borderWidth: 2,
                      borderColor: toRgba(levelGlowColor, 0.8),
                      backgroundColor: 'rgba(9, 19, 28, 0.75)',
                      // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
                      shadowColor: levelGlowColor,
                      shadowOpacity: 0.34,
                      shadowRadius: 25,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0, // Override base elevation for glow
                      boxShadow: [
                        `0 0 30px ${toRgba(levelGlowColor, 0.53)}`,
                        `0 0 60px ${toRgba(levelGlowColor, 0.27)}`,
                        `inset 0 0 20px ${toRgba(levelGlowColor, 0.13)}`,
                      ].join(', '),
                    }
                  : {
                      borderWidth: 1,
                      borderColor: toRgba(gradientColors[0], 0.3),
                      backgroundColor: 'rgba(9, 19, 28, 0.7)',
                    })
              : (glowEnabled
                  ? {
                      borderWidth: 2,
                      borderColor: toRgba(levelGlowColor, 0.6),
                      backgroundColor: theme.cardBackground,
                      transform: pressed ? [{ translateY: -2 }] : [],
                      // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
                      shadowColor: levelGlowColor,
                      shadowOpacity: 0.25,
                      shadowRadius: 20,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0, // Override base elevation for glow
                      boxShadow: [
                        `0 0 25px ${toRgba(levelGlowColor, 0.4)}`,
                        `0 0 50px ${toRgba(levelGlowColor, 0.2)}`,
                        `inset 0 0 15px ${toRgba(levelGlowColor, 0.1)}`,
                      ].join(', '),
                    }
                  : {
                      borderWidth: 1,
                      borderColor: toRgba(gradientColors[0], 0.25),
                      backgroundColor: theme.cardBackground,
                      transform: pressed ? [{ translateY: -2 }] : [],
                    }),
          ]}
        >
          <LinearGradient
            key={`${theme.mode}-${glowEnabled ? 1 : 0}-${level.id}`}
            colors={gradientColors}
            style={[styles.levelGradient, { width: '100%', height: '100%' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View
              pointerEvents="none"
              style={[
                styles.levelGlow,
                {
                  backgroundColor: toRgba(
                    levelGlowColor,
                    theme.mode === 'dark' ? 0.22 : 0.14
                  ),
                  shadowColor: toRgba(
                    levelGlowColor,
                    theme.mode === 'dark' ? 0.55 : 0.34
                  ),
                },
              ]}
            />
            {canBlur ? (
              <SafeBlurView
                intensity={theme.mode === 'dark' ? 45 : 20} // Less blur in light mode
                tint={theme.mode === 'dark' ? 'dark' : 'light'}
                style={styles.levelBlur}
              />
            ) : (
              <View
                style={[
                  styles.levelBlurFallback,
                  {
                    backgroundColor:
                      theme.mode === 'dark'
                        ? 'rgba(8, 18, 26, 0.78)'
                        : 'transparent', // Fully transparent in light mode to show gradient
                  },
                ]}
              />
            )}
            {/* Inner glow layer for additional depth (optional - main glow is on container) */}
            {glowEnabled && Platform.OS === 'web' && (
              theme.mode === 'dark' ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.levelGlow,
                    {
                      backgroundColor: toRgba(glowTint, 0.1),
                      shadowColor: glowTint,
                      shadowOpacity: 0.3,
                      shadowRadius: 30,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0,
                    },
                  ]}
                />
              ) : (
                <View
                  pointerEvents="none"
                  style={[
                    styles.lightHalo,
                    {
                      backgroundColor: toRgba(glowTint, 0.08),
                      shadowColor: glowTint,
                      shadowOpacity: 0.25,
                      shadowRadius: 25,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0,
                    },
                  ]}
                />
              )
            )}
            <View style={styles.textOverlay}>
              <View style={styles.levelContent}>
                <View style={styles.levelHeader}>
                  <Text
                    style={[
                      styles.levelTitle,
                      theme.mode === 'dark' && {
                        textShadowColor: toRgba(levelGlowColor, 0.38),
                        textShadowRadius: 6,
                      },
                    ]}
                  >
                    {level.level < 200
                      ? `Transcending ${level.name}`
                      : level.name}
                  </Text>
                  {isCurrent && (
                    <View
                      style={[
                        styles.currentBadge,
                        theme.mode === 'dark' && {
                          backgroundColor: toRgba(levelGlowColor, 0.32),
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.antithesisContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={antithesisColor}
                  />
                  <EditableText
                    screen="journey"
                    section={level.id}
                    id="antithesis"
                    originalContent={level.level < 200
                      ? `Through ${String(level.antithesis || '')}`
                      : String(level.antithesis || '')}
                    textStyle={[
                      styles.antithesisText,
                      { color: antithesisColor },
                    ]}
                    type="subtitle"
                  />
                </View>

                <EditableText
                  screen="journey"
                  section={level.id}
                  id="description"
                  originalContent={String(level.description || '')}
                  textStyle={[
                    styles.levelDescription,
                    { color: descriptionColor },
                  ]}
                  type="description"
                />

                <View style={styles.levelActions}>
                  <Pressable
                    style={[
                      styles.primaryAction,
                      {
                        backgroundColor: theme.mode === 'dark'
                          ? toRgba(glowBase, 0.64) // Further reduced opacity (0.8 * 0.8 = 0.64)
                          : gradientColors[0],
                        borderColor: theme.mode === 'dark'
                          ? toRgba(glowBase, 0.38) // Further reduced opacity (0.48 * 0.8 = 0.38)
                          : toRgba(gradientColors[0], 0.4),
                      },
                    ]}
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation?.();
                      openChapter(level, 'meditations');
                    }}
                  >
                    <Ionicons
                      name="headset-outline"
                      size={16}
                      color={theme.white}
                    />
                    <Text style={[styles.primaryActionText, { color: theme.white }]}>Meditations</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.secondaryAction,
                      theme.mode === 'dark' && {
                        backgroundColor: toRgba(glowBase, 0.144), // Further reduced opacity (0.18 * 0.8 = 0.144)
                        borderColor: toRgba(glowBase, 0.336), // Further reduced opacity (0.42 * 0.8 = 0.336)
                      },
                      theme.mode === 'light' && {
                        backgroundColor: toRgba(gradientColors[0], 0.15),
                        borderColor: toRgba(gradientColors[0], 0.4),
                      },
                    ]}
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation?.();
                      openChapter(level, 'articles');
                    }}
                  >
                    <Ionicons
                      name="book-outline"
                      size={16}
                      color={secondaryIconColor}
                    />
                    <Text
                      style={[
                        styles.secondaryActionText,
                        theme.mode === 'dark' && {
                          color: toRgba('#F8FAFC', 0.88),
                        },
                        theme.mode === 'light' && {
                          color: gradientColors[0],
                        },
                      ]}
                    >
                      Articles
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.chapterLink}
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation?.();
                    openChapter(level, 'overview');
                  }}
                >
                  <Text
                    style={[
                      styles.chapterLinkText,
                      { color: chapterLinkColor },
                    ]}
                  >
                    Chapter overview
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={
                      theme.mode === 'dark'
                        ? toRgba(levelGlowColor, 0.8)
                        : theme.textSecondary
                    }
                  />
                </Pressable>

                {isExplored && (
                  <View style={styles.exploredIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={exploredIconColor}
                    />
                    <Text
                      style={[
                        styles.exploredText,
                        { color: exploredTextColor },
                      ]}
                    >
                      Explored - {String(completedCount)} practice
                      {completedCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}

                {isCourage && (
                  <View style={styles.thresholdBadge}>
                    <Ionicons
                      name="star"
                      size={14}
                      color={thresholdIconColor}
                    />
                    <Text 
                      style={styles.thresholdText}
                      textBreakStrategy="highQuality"
                      numberOfLines={2}
                    >
                      Threshold - Where Power Begins
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    );
  };
  const renderCategorySection = (
    category: CategoryKey,
    levels: ConsciousnessLevel[]
  ) => {
    const meta = categoryVisuals[category];
    if (!meta) return null; // Safety check for undefined meta
    const expanded = expandedSections[category];
    const heroGradient = meta.gradient;

    return (
      <View key={category} style={styles.categorySection}>
        <Pressable
          onPress={() => toggleSection(category)}
          style={({ pressed }) => [
            styles.categoryHero,
            pressed && styles.categoryHeroPressed,
            // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
            glowEnabled && theme.mode === 'dark' && {
              shadowColor: theme.primary,
              shadowOpacity: 0.34,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 0 },
              elevation: 0, // Override base elevation for glow
              boxShadow: [
                `0 0 30px ${toRgba(theme.primary, 0.53)}`,
                `0 0 60px ${toRgba(theme.primary, 0.27)}`,
                `inset 0 0 20px ${toRgba(theme.primary, 0.13)}`,
              ].join(', '),
            },
            glowEnabled && theme.mode === 'light' && {
              shadowColor: theme.primary,
              shadowOpacity: 0.25,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 0 },
              elevation: 0, // Override base elevation for glow
              boxShadow: [
                `0 0 25px ${toRgba(theme.primary, 0.4)}`,
                `0 0 50px ${toRgba(theme.primary, 0.2)}`,
                `inset 0 0 15px ${toRgba(theme.primary, 0.1)}`,
              ].join(', '),
            },
          ]}
        >
          <LinearGradient
            key={`hero-${category}-${theme.mode}-${glowEnabled ? 1 : 0}`}
            colors={heroGradient}
            style={styles.categoryHeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SafeBlurView
              intensity={50}
              tint={theme.mode === 'dark' ? 'dark' : 'light'}
              style={styles.categoryHeroBlur}
            />
            <View style={styles.categoryHeroContent}>
              <View style={styles.categoryIconWrap}>
                <Ionicons
                  name={categoryIcons[category]}
                  size={22}
                  color={theme.textPrimary}
                />
              </View>
              <View style={styles.categoryTextWrap}>
                <EditableText
                  screen="journey-map"
                  section="categories"
                  id={`${category}-title`}
                  originalContent={String(meta?.title || '')}
                  textStyle={styles.categoryTitle}
                  type="title"
                />
                <EditableText
                  screen="journey-map"
                  section="categories"
                  id={`${category}-description`}
                  originalContent={categoryDescriptions[category] || ''}
                  textStyle={styles.categoryDescription}
                  type="description"
                />
              </View>
              <View style={styles.categoryToggle}>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.textPrimary}
                />
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {expanded && (
          <View style={styles.levelsGrid}>
            {levels.map((level, index) =>
              renderLevelCard(level, index)
            )}
          </View>
        )}
      </View>
    );
  };

  // Preserve scroll position when theme/glow changes
  useEffect(() => {
    // Restore scroll position after theme/glow change
    if (scrollViewRef.current && scrollY.current > 0) {
      // Use a small delay to ensure layout has completed
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: scrollY.current,
          animated: false,
        });
      }, 100);
    }
  }, [theme.mode, glowEnabled]);

  return (
    <View style={styles.container}>
      <EditModeIndicator />
      {theme.mode === 'dark' && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.auroraLayer,
            {
              opacity: auroraOpacity,
              transform: auroraTranslate != null ? [{ translateX: auroraTranslate }] : [],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(46, 93, 106, 0.45)',
              'rgba(108, 62, 115, 0.35)',
              'rgba(37, 92, 124, 0.4)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
      {theme.mode === 'light' && (
        <View pointerEvents="none" style={styles.vignetteLayer}>
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(2, 6, 23, 0.035)', // subtle edge vignette (~3.5%)
            ]}
            locations={[0, 0.7, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      <LinearGradient
        colors={
          theme.mode === 'dark'
            ? horizonGradient
            : theme.appBackgroundGradient
        }
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={require('../../assets/images/levels-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerSubtitle}>
          Explore any level - the path is yours
        </Text>
      </LinearGradient>

      <LinearGradient
        colors={
          theme.mode === 'dark'
            ? horizonGradient
            : theme.appBackgroundGradient
        }
        style={styles.bodyGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            scrollY.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          <View style={(styles as any).stageSurface}>
          <Pressable
            style={styles.guidanceCard}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Ionicons name="heart-outline" size={24} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guidanceText}>
                Not sure where to start?{' '}
                <Text style={styles.guidanceEmphasis}>
                  Check in with yourself
                </Text>{' '}
                and we'll suggest a level.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
          </Pressable>

          {showDisclaimer && (
            <Pressable
              style={styles.disclaimerCard}
              onPress={handleDismissDisclaimer}
            >
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={theme.accentGold}
              />
              <View style={styles.disclaimerContent}>
                <EditableText
                  screen="journey"
                  section="courage-disclaimer"
                  id="title"
                  originalContent="Courage is opening"
                  textStyle={styles.disclaimerTitle}
                  type="title"
                />
                <EditableText
                  screen="journey"
                  section="courage-disclaimer"
                  id="text"
                  originalContent="Crossing into level 200 shifts you from force to power. Expect old patterns to soften - move gently."
                  textStyle={styles.disclaimerText}
                  type="description"
                />
              </View>
              <Ionicons name="close" size={18} color={theme.textSecondary} />
            </Pressable>
          )}

          {/* Feelings Explained Section */}
          <View style={styles.feelingsSection}>
            <FeelingsExplainedCard
              onOpenChapters={() => navigation.navigate('LearnHub')}
              onOpenQuickHelp={() => setShowWhyFeelingSheet(true)}
            />
          </View>

          {/* Transcending Levels Section */}
          {transcendingLevels.length > 0 && (
            <View style={styles.categorySection}>
              <Pressable
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setTranscendingExpanded(!transcendingExpanded);
                }}
                style={({ pressed }) => [
                  styles.categoryHero,
                  pressed && styles.categoryHeroPressed,
                  // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
                  glowEnabled && theme.mode === 'dark' && {
                    shadowColor: theme.primary,
                    shadowOpacity: 0.34,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 0, // Override base elevation for glow
                    boxShadow: [
                      `0 0 30px ${toRgba(theme.primary, 0.53)}`,
                      `0 0 60px ${toRgba(theme.primary, 0.27)}`,
                      `inset 0 0 20px ${toRgba(theme.primary, 0.13)}`,
                    ].join(', '),
                  },
                  glowEnabled && theme.mode === 'light' && {
                    shadowColor: theme.primary,
                    shadowOpacity: 0.25,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 0, // Override base elevation for glow
                    boxShadow: [
                      `0 0 25px ${toRgba(theme.primary, 0.4)}`,
                      `0 0 50px ${toRgba(theme.primary, 0.2)}`,
                      `inset 0 0 15px ${toRgba(theme.primary, 0.1)}`,
                    ].join(', '),
                  },
                ]}
              >
                <LinearGradient
                  key={`hero-transcending-${theme.mode}-${glowEnabled ? 1 : 0}`}
                  colors={transcendingVisuals.gradient}
                  style={styles.categoryHeroGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <SafeBlurView
                    intensity={50}
                    tint={theme.mode === 'dark' ? 'dark' : 'light'}
                    style={styles.categoryHeroBlur}
                  />
                  <View style={styles.categoryHeroContent}>
                    <View style={styles.categoryIconWrap}>
                      <Ionicons
                        name="arrow-up-circle-outline"
                        size={22}
                        color={theme.textPrimary}
                      />
                    </View>
                    <View style={styles.categoryTextWrap}>
                      <EditableText
                        screen="journey-map"
                        section="transcending-levels"
                        id="title"
                        originalContent={transcendingVisuals.title}
                        textStyle={styles.categoryTitle}
                        type="title"
                      />
                      <EditableText
                        screen="journey-map"
                        section="transcending-levels"
                        id="description"
                        originalContent={transcendingVisuals.description}
                        textStyle={styles.categoryDescription}
                        type="description"
                      />
                    </View>
                    <View style={styles.categoryToggle}>
                      <Ionicons
                        name={transcendingExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme.textPrimary}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>

              {transcendingExpanded && (
                <View style={styles.levelsGrid}>
                  {transcendingLevels.map((level, index) =>
                    renderLevelCard(level, index)
                  )}
                </View>
              )}
            </View>
          )}

          {categoryOrder.map((category) => {
            const levels = levelsByCategory[category];
            return levels.length
              ? renderCategorySection(category, levels)
              : null;
          })}

          <View style={styles.reminderCard}>
            <Ionicons
              name="refresh-circle-outline"
              size={24}
              color={theme.mode === 'dark' ? toRgba(theme.primary, 0.65) : theme.primary}
            />
            <Text style={styles.reminderText}>
              Transcending a level once does not mean you are done. Life brings
              new layers. Revisiting is sacred.
            </Text>
          </View>
          </View>
        </ScrollView>
      </LinearGradient>
      
      <WhyFeelingSheet
        visible={showWhyFeelingSheet}
        onClose={() => setShowWhyFeelingSheet(false)}
      />
    </View>
  );
}

// Helper to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const toRgba = (color: string, alpha = 1): string => {
  const sanitized = color.replace('#', '');
  const expand = (value: string) =>
    parseInt(value.length === 1 ? value + value : value, 16);
  const r = expand(sanitized.substring(0, sanitized.length >= 6 ? 2 : 1));
  const g = expand(
    sanitized.substring(
      sanitized.length >= 6 ? 2 : 1,
      sanitized.length >= 6 ? 4 : 2
    )
  );
  const b = expand(
    sanitized.substring(
      sanitized.length >= 6 ? 4 : 2,
      sanitized.length >= 6 ? 6 : 3
    )
  );
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

const getStyles = (theme: ThemeColors, cardWidth: number, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mode === 'dark' ? theme.background : 'transparent',
      position: 'relative',
      overflow: 'hidden',
    },
    auroraLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    vignetteLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    header: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.sm,
    },
    backButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: 'rgba(0,0,0,0.18)',
    },
    backButtonText: {
      fontSize: typography.small,
      color: theme.white,
      fontWeight: typography.medium,
      letterSpacing: 0.6,
    },
    logo: {
      width: 280,
      height: 90,
      alignSelf: 'center',
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.headingOnGradient : theme.textPrimary,
      fontWeight: typography.medium,
      textAlign: 'center',
    },
    bodyGradient: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
      gap: spacing.xl,
    },
    guidanceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: theme.mode === 'dark' ? 2 : 1,
      borderColor: theme.mode === 'dark' ? theme.bioluminescence.glow : theme.border,
      shadowColor: theme.mode === 'dark' ? theme.bioluminescence.glow : theme.shadowSoft,
      shadowOffset: { width: 0, height: theme.mode === 'dark' ? 0 : 4 },
      shadowOpacity: theme.mode === 'dark' ? 0.5 : 0.12,
      shadowRadius: theme.mode === 'dark' ? 18 : 12,
      elevation: theme.mode === 'dark' ? 6 : 3,
      // Web-specific glow
      ...(theme.mode === 'dark' && {
        boxShadow: `0 0 25px ${theme.bioluminescence.glow}66, 0 0 50px ${theme.bioluminescence.glow}33`,
      }),
    } as any,
    guidanceText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    guidanceEmphasis: {
      fontWeight: typography.semibold,
      color: theme.textPrimary,
    },
    disclaimerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.elevatedCard,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    disclaimerContent: {
      flex: 1,
      gap: spacing.xs,
    },
    disclaimerTitle: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    disclaimerText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    categorySection: {
      gap: spacing.md,
    },
    categoryHero: {
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      // Base border - always present, glow only affects shadow effects
      borderWidth: theme.mode === 'dark' ? 2 : (glowEnabled ? 2 : 1),
      borderColor: theme.mode === 'dark' 
        ? toRgba(theme.primary, glowEnabled ? 0.8 : 0.5) // Slightly less opaque when glow off, but still visible
        : (glowEnabled ? toRgba(theme.primary, 0.6) : 'rgba(255, 255, 255, 0.7)'),
      // Base styling for light mode when glow is off
      ...(!glowEnabled && theme.mode === 'light' && {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        shadowColor: 'rgba(15, 23, 42, 0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      }),
      // Base shadow for dark mode when glow is off (so card doesn't disappear)
      ...(!glowEnabled && theme.mode === 'dark' && {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
      }),
    },
    categoryHeroPressed: {
      transform: [{ scale: 0.99 }],
      opacity: 0.95,
    },
    categoryHeroGradient: {
      borderRadius: borderRadius.xl,
      ...(theme.mode === 'light' && {
        opacity: 0.85, // Slightly reduce opacity in light mode for subtlety
      }),
    },
    categoryHeroBlur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.xl,
    },
    categoryHeroContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: theme.mode === 'light' ? spacing.md : spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    categoryIconWrap: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(167, 139, 250, 0.25)' // Violet-tinted for dark mode
        : 'rgba(139, 92, 246, 0.15)', // Violet-tinted for light mode
    },
    categoryTextWrap: {
      flex: 1,
      gap: spacing.xs,
    },
    categoryTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.mode === 'dark' ? theme.textPrimary : '#334155', // slate-700 for light mode
    },
    categoryDescription: {
      fontSize: typography.small,
      color: theme.mode === 'dark' ? theme.textPrimary : '#475569', // slate-600 for light mode
      lineHeight: 20,
    },
    categoryToggle: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(167, 139, 250, 0.25)' // Violet-tinted for dark mode
        : 'rgba(139, 92, 246, 0.15)', // Violet-tinted for light mode
    },
    levelsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Platform.OS === 'android' 
        ? (theme.mode === 'light' ? spacing.md : spacing.sm)
        : (theme.mode === 'light' ? spacing.lg + 4 : spacing.md),
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'flex-start',
      paddingTop: spacing.md,
      paddingBottom: Platform.OS === 'android' ? spacing.lg : spacing.xl,
      width: '100%',
    },
    levelCardContainer: {
      width: cardWidth,
      maxWidth: Platform.OS === 'android' ? 340 : 360,
      minWidth: Platform.OS === 'android' ? 150 : 160,
      height: CARD_HEIGHT,
      flexGrow: 0,
      flexShrink: 1,
      marginBottom: Platform.OS === 'android' ? spacing.sm : spacing.md,
      position: 'relative',
    },
    levelCard: {
      borderRadius: borderRadius.lg,
      position: 'relative',
      overflow: 'visible',
      minHeight: 220,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(6, 14, 22, 0.7)'
          : 'rgba(255,255,255,0.72)',
      borderWidth: theme.mode === 'dark' ? 2 : 1,
      borderColor:
        theme.mode === 'dark'
          ? theme.bioluminescence.glow
          : 'rgba(15, 23, 42, 0.08)',
      shadowColor:
        theme.mode === 'dark'
          ? theme.bioluminescence.glow
          : 'rgba(15, 23, 42, 0.12)',
      shadowOffset: {
        width: 0,
        height: theme.mode === 'dark' ? 0 : 12,
      },
      shadowOpacity: theme.mode === 'dark' ? 0.7 : 0.18,
      shadowRadius: theme.mode === 'dark' ? 24 : 18,
      elevation: theme.mode === 'dark' ? 8 : 4,
      ...(theme.mode === 'dark'
        ? {
            boxShadow: `0 0 38px ${theme.bioluminescence.glow}88, 0 0 80px ${theme.bioluminescence.glow}44, inset 0 0 24px ${theme.bioluminescence.glow}22`,
          }
        : {
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          }),
    } as any,
    levelCardPressed: {
      transform: [{ translateY: 2 }],
      shadowOpacity: 0.05,
    },
    levelCardCurrent: {
      shadowOpacity: 0.18,
      elevation: 6,
    },
    levelCardCourage: {
      borderWidth: 2,
      borderColor: theme.accentGold,
    },
    levelGradient: {
      flex: 1,
      borderRadius: borderRadius.lg,
      minHeight: CARD_HEIGHT,
    },
    levelGlow: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
      opacity: 1,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 40,
      zIndex: 2,
    },
    lightHalo: {
      ...StyleSheet.absoluteFillObject,
      left: -24,
      right: -24,
      top: -24,
      bottom: -24,
      borderRadius: borderRadius.lg + 24,
      zIndex: 1,
      ...(Platform.OS === 'web'
        ? ({ mixBlendMode: 'screen' } as any)
        : null),
    },
    lightLiftShadow: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 12,
      bottom: -12,
      borderRadius: borderRadius.lg,
      zIndex: 0,
      // Big, soft floor shadow under the card (web only)
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 30px 60px rgba(2, 6, 23, 0.25), 0 10px 24px rgba(2, 6, 23, 0.12)' } as any)
        : null),
    },
    levelBlur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
      zIndex: 1,
    },
    levelBlurFallback: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
      zIndex: 1,
    },
    textOverlay: {
      flex: 1, // Fill entire card height
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      gap: spacing.md,
      padding: Platform.OS === 'android' 
        ? (theme.mode === 'light' ? spacing.md : spacing.sm)
        : (theme.mode === 'light' ? spacing.xl : spacing.lg), // Less padding on Android for 2-card layout
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(5, 14, 20, 0.7)'
          : '#FFFFFF', // pristine white face
      borderRadius: borderRadius.lg,
      borderWidth: theme.mode === 'dark' ? 0 : 1,
      borderColor:
        theme.mode === 'dark'
          ? 'transparent'
          : '#E5E7EB', // mid-gray border for definition
      ...(theme.mode === 'light'
        ? ({
            backdropFilter: 'saturate(120%) blur(6px)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.7)', // tiny inner white stroke
          } as any)
        : null),
      zIndex: 3,
    },
    levelContent: {
      flex: 1,
      gap: Platform.OS === 'android' ? spacing.xs : spacing.sm, // Consistent spacing
      justifyContent: 'flex-start', // Changed to allow content to flow naturally
      minWidth: 0, // Allow flexbox to properly shrink children
      paddingBottom: spacing.xs, // Add bottom padding for breathing room
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    levelTitleContainer: {
      flex: 1,
      minWidth: 0, // Allows text to wrap properly
    },
    levelTitle: {
      fontSize: Platform.OS === 'android' ? typography.h4 : typography.h3, // Smaller on Android for 2-card layout
      fontWeight: typography.semibold, // semibold for better readability
      color: theme.mode === 'dark' ? theme.textPrimary : '#0F172A', // slate-900 for light mode
      letterSpacing: Platform.OS === 'android' ? -0.2 : -0.5,
      lineHeight: Platform.OS === 'android' ? 22 : 26,
      textShadowColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : undefined,
      textShadowOffset: theme.mode === 'dark' ? { width: 0, height: 1 } : undefined,
      textShadowRadius: theme.mode === 'dark' ? 2 : undefined,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    currentBadge: {
      backgroundColor: theme.accentTeal,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      flexShrink: 0, // Prevent badge from shrinking
      marginTop: 2, // Slight alignment adjustment
    },
    currentBadgeText: {
      fontSize: typography.tiny,
      fontWeight: typography.semibold,
      color: theme.white,
      textTransform: 'uppercase',
    },
    antithesisContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      flexWrap: 'wrap',
    },
    antithesisIcon: {
      marginTop: 2, // Align icon with first line of text
      flexShrink: 0,
    },
    antithesisText: {
      fontSize: Platform.OS === 'android' ? typography.small : typography.body, // Smaller on Android
      color: theme.mode === 'dark' ? theme.textPrimary : '#475569', // slate-600 for light mode
      fontWeight: typography.medium,
      fontStyle: 'italic',
      lineHeight: Platform.OS === 'android' ? 18 : 20,
      flex: 1,
      flexShrink: 1,
      minWidth: 0, // Allow text to wrap
    },
    levelDescription: {
      fontSize: Platform.OS === 'android' ? typography.small : typography.body, // Smaller on Android
      color: theme.mode === 'dark' ? theme.textPrimary : '#475569', // slate-600 for light mode
      lineHeight: Platform.OS === 'android' ? 18 : 20,
      letterSpacing: 0.1,
      flexShrink: 1,
      marginTop: spacing.xs,
      marginBottom: spacing.sm, // Increased bottom margin for better spacing
      flex: 1, // Allow description to take available space
      minHeight: Platform.OS === 'android' ? 90 : 60, // Ensure minimum height for text
    },
    levelActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Platform.OS === 'android' ? spacing.xs : spacing.sm, // Tighter gap on Android
      marginTop: 'auto', // Push actions to bottom
      paddingTop: spacing.xs, // Add padding above actions
    },
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: Platform.OS === 'android' ? spacing.sm : spacing.md,
      paddingVertical: Platform.OS === 'android' ? spacing.xs : spacing.sm,
      borderRadius: borderRadius.roundedChip,
      backgroundColor: theme.buttons.primary.background,
      shadowColor: theme.buttons.primary.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 2,
    },
    primaryActionText: {
      color: theme.buttons.primary.text,
      fontSize: Platform.OS === 'android' ? typography.tiny : typography.small, // Smaller on Android
      fontWeight: typography.semibold,
      letterSpacing: Platform.OS === 'android' ? 0.1 : 0.2,
    },
    secondaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: Platform.OS === 'android' ? spacing.sm : spacing.md,
      paddingVertical: Platform.OS === 'android' ? spacing.xs : spacing.sm,
      borderRadius: borderRadius.roundedChip,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : theme.cardBackground,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.18)'
          : theme.border,
    },
    secondaryActionText: {
      color: theme.textPrimary,
      fontSize: Platform.OS === 'android' ? typography.tiny : typography.small, // Smaller on Android
      fontWeight: typography.medium,
    },
    chapterLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    chapterLinkText: {
      fontSize: Platform.OS === 'android' ? typography.tiny : typography.small, // Smaller on Android
      color: theme.mode === 'dark' ? theme.white : theme.accentTeal,
      fontWeight: typography.semibold,
      letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    },
    exploredIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    exploredText: {
      fontSize: typography.tiny,
      color: theme.textPrimary,
      fontWeight: typography.medium,
    },
    thresholdBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: 'rgba(230, 207, 168, 0.28)',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginTop: spacing.xs,
      flexShrink: 1,
      minWidth: 0, // Allow flexbox to shrink below content size
      maxWidth: '100%', // Ensure it doesn't exceed container
    },
    thresholdText: {
      fontSize: typography.tiny,
      color: theme.accentGold,
      fontWeight: typography.semibold,
      flexShrink: 1,
      flex: 1,
    },
    feelingsSection: {
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    reminderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.mode === 'dark' 
        ? 'rgba(139, 92, 246, 0.25)' // Opaque purple, less bright than before
        : theme.primarySubtle,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: theme.mode === 'dark' ? 2 : 1,
      borderColor: theme.mode === 'dark' ? theme.bioluminescence.glow : theme.primary,
      shadowColor: theme.mode === 'dark' ? theme.bioluminescence.glow : theme.shadowSoft,
      shadowOffset: { width: 0, height: theme.mode === 'dark' ? 0 : 2 },
      shadowOpacity: theme.mode === 'dark' ? 0.5 : 0.08,
      shadowRadius: theme.mode === 'dark' ? 18 : 8,
      elevation: theme.mode === 'dark' ? 6 : 2,
      // Web-specific glow
      ...(theme.mode === 'dark' && {
        boxShadow: `0 0 25px ${theme.bioluminescence.glow}66, 0 0 50px ${theme.bioluminescence.glow}33`,
      }),
    } as any,
    reminderText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });









