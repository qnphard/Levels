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

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CategoryKey = ConsciousnessLevel['category'];
type ChapterView = 'overview' | 'meditations' | 'articles';

const { width } = Dimensions.get('window');
const canBlur = Platform.OS !== 'web';
const CARD_HEIGHT = 280;

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
  empowerment: 'Step into truthful power and aligned action.',
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
    // In dark mode, always use the night gradient to ensure a truly dark canvas
    if (theme.mode === 'dark') {
      return pick(theme.gradients.horizonNight);
    }
    // Light mode: vary by time of day
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
        title: 'Empowerment - Power, Not Force',
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

  const levelsByCategory: Record<CategoryKey, ConsciousnessLevel[]> = {
    healing: [],
    empowerment: [],
    spiritual: [],
    enlightenment: [],
  };

  consciousnessLevels.forEach((level) => {
    levelsByCategory[level.category].push(level);
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
    const glowTint =
      theme.mode === 'dark' ? glowBase : adjustColor(gradientColors[0], -12);
    // Removed the old float/bobbing animation to keep cards stable

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
            // Apply "current" and "courage" base tweaks first
            isCurrent && styles.levelCardCurrent,
            isCourage && styles.levelCardCourage,
            // Then apply theme + glow so it wins for shadow/border
            theme.mode === 'dark'
              ? (glowEnabled
                  ? {
                      borderWidth: 2,
                      borderColor: toRgba(glowTint, 0.8),
                      backgroundColor: 'rgba(9, 19, 28, 0.75)',
                      // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
                      shadowColor: glowTint,
                      shadowOpacity: 0.34,
                      shadowRadius: 25,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0, // Override base elevation for glow
                      boxShadow: [
                        `0 0 30px ${toRgba(glowTint, 0.53)}`,
                        `0 0 60px ${toRgba(glowTint, 0.27)}`,
                        `inset 0 0 20px ${toRgba(glowTint, 0.13)}`,
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
                      borderColor: toRgba(glowTint, 0.6),
                      backgroundColor: theme.cardBackground,
                      transform: pressed ? [{ translateY: -2 }] : [],
                      // Apply glow shadow directly to Pressable (like FeelingsExplainedCard)
                      shadowColor: glowTint,
                      shadowOpacity: 0.25,
                      shadowRadius: 20,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 0, // Override base elevation for glow
                      boxShadow: [
                        `0 0 25px ${toRgba(glowTint, 0.4)}`,
                        `0 0 50px ${toRgba(glowTint, 0.2)}`,
                        `inset 0 0 15px ${toRgba(glowTint, 0.1)}`,
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
                  <View style={styles.levelTitleContainer}>
                    <Text
                      style={[
                        styles.levelTitle,
                        theme.mode === 'dark' && {
                          textShadowColor: toRgba(glowTint, 0.5),
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 8,
                        },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {level.level < 200
                        ? `Transcending ${String(level.name || '')}`
                        : String(level.name || '')}
                    </Text>
                  </View>
                  {isCurrent && (
                    <View
                      style={[
                        styles.currentBadge,
                        theme.mode === 'dark' && {
                          backgroundColor: toRgba(glowTint, 0.3),
                        },
                        theme.mode === 'light' && {
                          backgroundColor: toRgba(glowTint, 0.2),
                        },
                      ]}
                    >
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </View>

                <View style={styles.antithesisContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={
                      theme.mode === 'dark'
                        ? toRgba(glowTint, 0.68) // Further reduced opacity (0.85 * 0.8 = 0.68)
                        : theme.primary
                    }
                  />
                  <Text
                    style={[
                      styles.antithesisText,
                      {
                        color: theme.mode === 'dark' 
                          ? toRgba(glowTint, 0.85)
                          : theme.primary,
                      },
                    ]}
                  >
                    {level.level < 200
                      ? `Through ${String(level.antithesis || '')}`
                      : String(level.antithesis || '')}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.levelDescription,
                    theme.mode === 'dark' && {
                      color: toRgba('#E9F1F6', 0.82),
                    },
                  ]}
                  numberOfLines={Platform.OS === 'android' ? 4 : 2}
                >
                  {String(level.description || '')}
                </Text>

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
                      color={
                        theme.mode === 'dark'
                          ? toRgba(glowBase, 0.92)
                          : gradientColors[0]
                      }
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
                      {
                        color:
                          theme.mode === 'dark'
                            ? toRgba(glowBase, 0.69) // Further reduced opacity (0.86 * 0.8 = 0.69)
                            : theme.accentTeal,
                      },
                    ]}
                  >
                    Chapter overview
                  </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={
                        theme.mode === 'dark'
                        ? toRgba(glowBase, 0.64) // Further reduced opacity (0.8 * 0.8 = 0.64)
                        : theme.textSecondary
                      }
                    />
                </Pressable>

                {isExplored && (
                  <View style={styles.exploredIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={
                        theme.mode === 'dark'
                          ? toRgba(glowBase, 0.72) // Further reduced opacity (0.9 * 0.8 = 0.72)
                          : theme.accentTeal
                      }
                    />
                    <Text
                      style={[
                        styles.exploredText,
                        theme.mode === 'dark' && {
                          color: toRgba('#E8F4F4', 0.82),
                        },
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
                      color={
                        theme.mode === 'dark'
                          ? toRgba(glowBase, 0.75) // Further reduced opacity (0.94 * 0.8 = 0.75)
                          : theme.accentGold
                      }
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
                <Text style={styles.categoryTitle}>{String(meta?.title || '')}</Text>
                <Text style={styles.categoryDescription}>
                  {String(categoryDescriptions[category] || '')}
                </Text>
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
        colors={theme.appBackgroundGradient}
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
        colors={theme.appBackgroundGradient}
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
                <Text style={styles.disclaimerTitle}>Courage is opening</Text>
                <Text style={styles.disclaimerText}>
                  Crossing into level 200 shifts you from force to power.
                  Expect old patterns to soften - move gently.
                </Text>
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
      overflow: 'hidden', // Changed back to hidden so gradient shows
      position: 'relative',
      height: CARD_HEIGHT, // Fixed height for all cards (tallest card size)
      // Shadow properties removed from base style - they're now applied inline based on glowEnabled
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(6, 14, 22, 0.7)'
          : 'transparent', // Let gradient show through in light mode
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
      gap: Platform.OS === 'android' ? 2 : spacing.xs, // Tighter spacing on Android
      justifyContent: 'space-between',
      height: '100%',
      minWidth: 0, // Allow flexbox to properly shrink children
      overflow: 'hidden', // Prevent content from overflowing
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
      alignItems: 'center',
      gap: spacing.xs,
    },
    antithesisText: {
      fontSize: Platform.OS === 'android' ? typography.small : typography.body, // Smaller on Android
      color: theme.mode === 'dark' ? theme.textPrimary : '#475569', // slate-600 for light mode
      fontWeight: typography.medium,
      fontStyle: 'italic',
      lineHeight: Platform.OS === 'android' ? 18 : 20,
    },
    levelDescription: {
      fontSize: Platform.OS === 'android' ? typography.small : typography.body, // Smaller on Android
      color: theme.mode === 'dark' ? theme.textPrimary : '#475569', // slate-600 for light mode
      lineHeight: Platform.OS === 'android' ? 18 : 20,
      letterSpacing: 0.1,
      flexShrink: 1,
    },
    levelActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Platform.OS === 'android' ? spacing.xs : spacing.sm, // Tighter gap on Android
      marginTop: Platform.OS === 'android' ? spacing.xs : spacing.sm,
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
      borderWidth: 1,
      borderColor: theme.mode === 'dark' 
        ? 'rgba(139, 92, 246, 0.5)' // Opaque border, less bright
        : theme.primary,
      // Removed shadow properties that were causing the square border effect
      elevation: 0,
    },
    reminderText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });




