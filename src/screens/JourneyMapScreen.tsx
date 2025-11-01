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
  type StyleProp,
  type ViewStyle,
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
const isWeb = Platform.OS === 'web';
const canBlur = !isWeb;
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
    if (screenWidth >= 1024) return Math.min(screenWidth * 0.28, 340);
    if (screenWidth >= 768) return Math.min(screenWidth * 0.4, 320);
    if (screenWidth >= 480) return Math.min(screenWidth * 0.42, 280);
    if (screenWidth >= 360) return Math.min(screenWidth * 0.48, 240);
    return Math.min(screenWidth * 0.92, 240);
  }, [window.width]);
  const styles = useMemo(() => getStyles(theme, cardWidth), [theme, cardWidth]);
  const auroraAnim = useRef(new Animated.Value(0)).current;

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
    // Always use a neutral surface in light mode; keep gradients only in dark mode
    const effectiveGradient = theme.mode === 'dark'
      ? darkGradient
      : ([theme.cardBackground, theme.cardBackground] as const);
    
    // Compute glow color directly from level color to avoid dependency on gradient repaint
    const glowBase = theme.mode === 'dark'
      ? (level.glowDark || darkGradient[0])
      : level.color;
    const glowTint = theme.mode === 'dark' ? glowBase : adjustColor(glowBase, -12);
    // Removed the old float/bobbing animation to keep cards stable

    return (
      <View
        key={level.id}
        style={[
          styles.levelCardContainer,
          theme.mode === 'light' && !glowEnabled && isWeb
            ? ({ boxShadow: 'none' } as any)
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
          style={({ pressed }) => {
            const darkGlowStyle: ViewStyle = {
              borderWidth: 2,
              borderColor: toRgba(glowTint, 0.8),
              shadowColor: glowTint,
              shadowOpacity: 0.34,
              backgroundColor: 'rgba(9, 19, 28, 0.75)',
            };
            if (isWeb) {
              (darkGlowStyle as any).boxShadow = [
                `0 0 30px ${toRgba(glowTint, 0.53)}`,
                `0 0 60px ${toRgba(glowTint, 0.27)}`,
                `inset 0 0 20px ${toRgba(glowTint, 0.13)}`,
              ].join(', ');
            }

            const darkBaseStyle: ViewStyle = {
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              backgroundColor: 'rgba(9, 19, 28, 0.7)',
            };

            const lightGlowStyle: ViewStyle = {
              borderWidth: 2,
              borderColor: toRgba(glowTint, 0.95),
              shadowColor: glowTint,
              shadowOpacity: 0.55,
              shadowRadius: 36,
              shadowOffset: { width: 0, height: 16 },
              elevation: 8,
              backgroundColor: theme.cardBackground,
            };
            if (isWeb) {
              (lightGlowStyle as any).boxShadow = [
                `0 18px 50px rgba(2, 6, 23, 0.22)`,
                `0 2px 8px rgba(2, 6, 23, 0.10)`,
                `0 0 2px ${toRgba(glowTint, 0.9)}`,
                `0 0 80px ${toRgba(glowTint, 0.65)}`,
                `0 0 160px ${toRgba(glowTint, 0.4)}`,
              ].join(', ');
            }

            const lightBaseStyle: ViewStyle = {
              borderWidth: 1,
              borderColor: 'rgba(2,6,23,0.08)',
              shadowColor: 'rgba(2,6,23,0.32)',
              shadowOpacity: 1,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 12 },
              elevation: 6,
              backgroundColor: theme.cardBackground,
            };
            if (isWeb) {
              (lightBaseStyle as any).boxShadow = [
                `0 12px 24px rgba(15, 23, 42, 0.10)`,
                `0 8px 20px rgba(15, 23, 42, 0.08)`,
                `0 1px 2px rgba(2, 6, 23, 0.06)`,
              ].join(', ');
            }

            const accentStyle =
              theme.mode === 'dark'
                ? glowEnabled
                  ? darkGlowStyle
                  : darkBaseStyle
                : glowEnabled
                  ? lightGlowStyle
                  : lightBaseStyle;

            const composedStyles = [
              styles.levelCard,
              isCurrent && styles.levelCardCurrent,
              isCourage && styles.levelCardCourage,
              accentStyle,
              pressed && styles.levelCardPressed,
            ].filter(Boolean) as StyleProp<ViewStyle>;

            return composedStyles;
          }}
        >
          <LinearGradient
            key={`${theme.mode}-${glowEnabled ? 1 : 0}-${level.id}`}
            colors={effectiveGradient}
            style={[styles.levelGradient, { width: '100%', height: '100%' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {canBlur ? (
              <BlurView
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
            {glowEnabled && (
              theme.mode === 'dark' ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.levelGlow,
                    {
                      backgroundColor: toRgba(glowTint, 0.18),
                      shadowColor: toRgba(glowTint, 0.52),
                    },
                  ]}
                />
              ) : (
                <View
                  pointerEvents="none"
                  style={[
                    styles.lightHalo,
                    isWeb
                      ? {
                          // big, soft outside-only halo using screen blend
                          boxShadow: [
                            `0 0 96px ${toRgba(glowTint, 0.18)}`,
                            `0 0 128px ${toRgba(glowTint, 0.16)}`,
                          ].join(', '),
                        }
                      : null,
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
                        textShadowColor: toRgba(glowBase, 0.58),
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
                          backgroundColor: toRgba(glowBase, 0.32),
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
                        ? toRgba(glowBase, 0.8)
                        : theme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.antithesisText,
                      theme.mode === 'dark' && {
                        color: toRgba(glowBase, 0.85),
                      },
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
                    theme.mode === 'dark' && {
                      color: toRgba('#E9F1F6', 0.82),
                    },
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
                      color={
                        theme.mode === 'dark'
                          ? toRgba(glowBase, 0.92)
                          : theme.textPrimary
                      }
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
                      {
                        color:
                          theme.mode === 'dark'
                            ? toRgba(glowBase, 0.86)
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
                        ? toRgba(glowBase, 0.8)
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
                          ? toRgba(glowBase, 0.9)
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
                      color={
                        theme.mode === 'dark'
                          ? toRgba(glowBase, 0.94)
                          : theme.accentGold
                      }
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
      </View>
    );
  };

  const renderCategorySection = (
    category: CategoryKey,
    levels: ConsciousnessLevel[]
  ) => {
    const meta = categoryVisuals[category];
    const expanded = expandedSections[category];
    const heroGradient = theme.mode === 'dark'
      ? meta.gradient
      : ([theme.cardBackground, theme.cardBackground] as const);

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
            key={`hero-${category}-${theme.mode}-${glowEnabled ? 1 : 0}`}
            colors={heroGradient}
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
    <View key={`${theme.mode}-${glowEnabled ? 1 : 0}` as const} style={styles.container}>
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
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3,
    },
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
      ...(theme.mode === 'light' && {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        shadowColor: 'rgba(15, 23, 42, 0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      }),
    },
    categoryHeroPressed: {
      transform: [{ scale: 0.99 }],
      opacity: 0.95,
    },
    categoryHeroGradient: {
      borderRadius: borderRadius.xl,
      ...(theme.mode === 'light' && {
        opacity: 0.5, // Reduce gradient intensity in light mode
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
      backgroundColor: 'rgba(255,255,255,0.35)',
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
      color: theme.mode === 'dark' ? theme.textSecondary : '#475569', // slate-600 for light mode
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
      gap: theme.mode === 'light' ? spacing.lg + 4 : spacing.md, // +4px oxygen in light mode
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'flex-start',
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    levelCardContainer: {
      width: cardWidth,
      maxWidth: 360,
      height: CARD_HEIGHT,
      flexGrow: 0,
      flexShrink: 0,
      marginBottom: spacing.md,
      position: 'relative',
    },
    levelCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden', // Changed back to hidden so gradient shows
      position: 'relative',
      height: CARD_HEIGHT, // Fixed height for all cards (tallest card size)
      shadowOffset: {
        width: 0,
        height: theme.mode === 'dark' ? 0 : 10,
      },
      shadowRadius: theme.mode === 'dark' ? 24 : 24,
      elevation: theme.mode === 'dark' ? 8 : 3,
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
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.18,
      shadowRadius: 38,
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
      padding: theme.mode === 'light' ? spacing.xl : spacing.lg, // More padding in light mode
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
      ...(theme.mode === 'light' && isWeb
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
      gap: spacing.xs,
      justifyContent: 'space-between',
      height: '100%',
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    levelTitle: {
      fontSize: typography.h3,
      fontWeight: typography.semibold, // semibold for better readability
      color: theme.mode === 'dark' ? theme.textPrimary : '#0F172A', // slate-900 for light mode
      flex: 1,
      letterSpacing: -0.5, // tracking-tight
      textShadowColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : undefined,
      textShadowOffset: theme.mode === 'dark' ? { width: 0, height: 1 } : undefined,
      textShadowRadius: theme.mode === 'dark' ? 2 : undefined,
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
      color: theme.mode === 'dark' ? theme.textSecondary : '#475569', // slate-600 for light mode
      fontWeight: typography.medium,
      fontStyle: 'italic',
    },
    levelDescription: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.textSecondary : '#475569', // slate-600 for light mode
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
      borderWidth: 1,
      borderColor: theme.primary,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    reminderText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });




