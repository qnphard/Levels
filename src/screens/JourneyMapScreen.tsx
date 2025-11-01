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
import { BlurView } from 'expo-blur';
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
  const window = useWindowDimensions();
  const cardWidth = useMemo(() => {
    const screenWidth = window.width || width;
    if (screenWidth >= 1024) return Math.min(screenWidth * 0.28, 340);
    if (screenWidth >= 768) return Math.min(screenWidth * 0.4, 320);
    if (screenWidth >= 480) return Math.min(screenWidth * 0.42, 280);
    if (screenWidth >= 360) return Math.min(screenWidth * 0.48, 240);
    return Math.min(screenWidth * 0.92, 240);
  }, [window.width]);
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth]);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const auroraAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim]);

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

  const floatTranslate = useMemo(
    () =>
      floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -2.5],
      }),
    [floatAnim]
  );
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
        gradient: blend(theme.experience.settle.accent, theme.accentPeach),
      },
      empowerment: {
        title: 'Empowerment - Power, Not Force',
        gradient: blend(theme.primary, theme.accentTeal),
      },
      spiritual: {
        title: 'Spiritual - Heart-Centered Reality',
        gradient: blend(theme.highlightMist, theme.accentGold),
      },
      enlightenment: {
        title: 'Enlightenment - Non-Dual Awareness',
        gradient: blend(theme.accentGold, theme.white),
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
    const baseGradient = level.gradient
      ? level.gradient
      : ([
          adjustColor(level.color, 18),
          adjustColor(level.color, -10),
        ] as const);
    const darkGradient = level.gradientDark ? level.gradientDark : baseGradient;
    const gradientColors =
      theme.mode === 'dark' ? darkGradient : baseGradient;
    const glowBase = level.glowDark ?? gradientColors[0];
    const glowLight =
      lightGlowPalette[level.id] ?? adjustColor(gradientColors[0], -12);
    const floatScalar =
      (index % 2 === 0 ? 1 : -1) * (1 + (index % 3) * 0.28);
    const floatTranslateNode = Animated.multiply(floatTranslate, floatScalar);

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
      <Animated.View
        key={level.id}
        style={[
          styles.levelCardContainer,
          { transform: [{ translateY: floatTranslateNode }] },
        ]}
      >
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
            pressed && styles.levelCardPressed,
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.levelGradient}
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
              <BlurView
                intensity={45}
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
                        : 'rgba(255, 255, 255, 0.68)',
                  },
                ]}
              />
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
                    >
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </View>

                <View style={styles.antithesisContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={antithesisColor}
                  />
                  <Text
                    style={[
                      styles.antithesisText,
                      { color: antithesisColor },
                    ]}
                  >
                    {level.level < 200
                      ? `Through ${level.antithesis}`
                      : level.antithesis}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.levelDescription,
                    { color: descriptionColor },
                  ]}
                  numberOfLines={2}
                >
                  {level.description}
                </Text>

                <View style={styles.levelActions}>
                  <Pressable
                    style={styles.primaryAction}
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation?.();
                      openChapter(level, 'meditations');
                    }}
                  >
                    <Ionicons
                      name="headset-outline"
                      size={16}
                      color={theme.buttons.primary.text}
                    />
                    <Text style={styles.primaryActionText}>Meditations</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.secondaryAction,
                      theme.mode === 'dark' && {
                        backgroundColor: toRgba(glowBase, 0.18),
                        borderColor: toRgba(glowBase, 0.42),
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
                      Explored - {completedCount} practice
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
                    <Text style={styles.thresholdText}>
                      Threshold - Where Power Begins
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };
  const renderCategorySection = (
    category: CategoryKey,
    levels: ConsciousnessLevel[]
  ) => {
    const meta = categoryVisuals[category];
    const expanded = expandedSections[category];

    return (
      <View key={category} style={styles.categorySection}>
        <Pressable
          onPress={() => toggleSection(category)}
          style={({ pressed }) => [
            styles.categoryHero,
            pressed && styles.categoryHeroPressed,
          ]}
        >
          <LinearGradient
            colors={meta.gradient}
            style={styles.categoryHeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <BlurView
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
                <Text style={styles.categoryTitle}>{meta.title}</Text>
                <Text style={styles.categoryDescription}>
                  {categoryDescriptions[category]}
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

  return (
    <View style={styles.container}>
      {theme.mode === 'dark' && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.auroraLayer,
            {
              opacity: auroraOpacity,
              transform: [{ translateX: auroraTranslate }],
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
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={theme.white} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
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
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                <Text style={styles.disclaimerTitle}>Courage is opening</Text>
                <Text style={styles.disclaimerText}>
                  Crossing into level 200 shifts you from force to power.
                  Expect old patterns to soften - move gently.
                </Text>
              </View>
              <Ionicons name="close" size={18} color={theme.textSecondary} />
            </Pressable>
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
              color={theme.primary}
            />
            <Text style={styles.reminderText}>
              Transcending a level once does not mean you are done. Life brings
              new layers. Revisiting is sacred.
            </Text>
          </View>
          </View>
        </ScrollView>
      </LinearGradient>
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

const getStyles = (theme: ThemeColors, cardWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      position: 'relative',
      overflow: 'hidden',
    },
    auroraLayer: {
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
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: theme.headingOnGradient,
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
    },
    categoryHeroPressed: {
      transform: [{ scale: 0.99 }],
      opacity: 0.95,
    },
    categoryHeroGradient: {
      borderRadius: borderRadius.xl,
    },
    categoryHeroBlur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.xl,
    },
    categoryHeroContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    categoryIconWrap: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    categoryTextWrap: {
      flex: 1,
      gap: spacing.xs,
    },
    categoryTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
    },
    categoryDescription: {
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    categoryToggle: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
    levelsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      justifyContent: 'flex-start',
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    levelCardContainer: {
      width: cardWidth,
      maxWidth: 360,
      flexGrow: 1,
      marginBottom: spacing.md,
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
      borderRadius: borderRadius.lg,
    },
    levelGlow: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
      opacity: 1,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.18,
      shadowRadius: 38,
    },
    levelBlur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
    },
    levelBlurFallback: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
    },
    textOverlay: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      padding: spacing.lg,
      backgroundColor:
        theme.mode === 'dark'
          ? 'rgba(5, 14, 20, 0.7)'
          : 'rgba(255, 255, 255, 0.58)',
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor:
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(15, 28, 31, 0.08)',
    },
    levelContent: {
      flex: 1,
      gap: spacing.xs,
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    levelTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      flex: 1,
      textShadowColor: 'rgba(255, 255, 255, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    currentBadge: {
      backgroundColor: theme.accentTeal,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
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
      fontSize: typography.body,
      color: theme.textSecondary,
      fontWeight: typography.medium,
      fontStyle: 'italic',
    },
    levelDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    levelActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
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
      fontSize: typography.small,
      fontWeight: typography.semibold,
      letterSpacing: 0.2,
    },
    secondaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
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
      fontSize: typography.small,
      fontWeight: typography.medium,
    },
    chapterLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    chapterLinkText: {
      fontSize: typography.small,
      color: theme.mode === 'dark' ? theme.white : theme.accentTeal,
      fontWeight: typography.semibold,
      letterSpacing: 0.3,
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
    },
    thresholdText: {
      fontSize: typography.tiny,
      color: theme.accentGold,
      fontWeight: typography.semibold,
    },
    reminderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.primarySubtle,
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









