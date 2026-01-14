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
  BackHandler,
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
import { Zone } from '../store/onboardingStore';
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
import OnboardingOverlay from '../components/OnboardingOverlay';
import DailyCheckInModal from '../components/DailyCheckInModal';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { useUserStore } from '../store/userStore';

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
const CARD_HEIGHT = Platform.OS === 'android' ? 320 : 300; // Increased height to accommodate more text

const zoneIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Heavy Weather': 'cloud-outline',
  'Stuckness': 'thunderstorm-outline',
  'Stabilization': 'sunny-outline',
  'Openness': 'infinite-outline',
};

const zoneDescriptions: Record<string, string> = {
  'Heavy Weather': 'Transmute dense emotions into courage and steadiness.',
  'Stuckness': 'Break through the energy blocks keeping you in stagnation.',
  'Stabilization': 'Build a solid foundation of power and resilience.',
  'Openness': 'Rest in expansion, love, and non-dual awareness.',
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
    Record<string, boolean>
  >({
    'Heavy Weather': true,
    'Stuckness': true,
    'Stabilization': true,
    'Openness': true,
  });

  const [transcendingExpanded, setTranscendingExpanded] = useState(false);

  const hasShownOverlay = useOnboardingStore((state) => state.hasShownOverlay);
  const setHasShownOverlay = useOnboardingStore((state) => state.setHasShownOverlay);

  const lastCheckIn = useUserStore((state) => state.lastCheckIn);
  const checkInHistory = useUserStore((state) => state.checkInHistory);

  // Force canCheckIn to true for development so it opens every time
  const canCheckIn = true;
  const lastCheckInZone = checkInHistory.length > 0 ? checkInHistory[0].zone : null;

  const [showOnboardingOverlay, setShowOnboardingOverlay] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showJourneyExplanation, setShowJourneyExplanation] = useState(false);

  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);

  const sortedZones = useMemo(() => {
    return ['Heavy Weather', 'Stuckness', 'Stabilization', 'Openness'];
  }, []);

  useEffect(() => {
    if (!hasShownOverlay) {
      const timer = setTimeout(() => {
        setShowOnboardingOverlay(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // Logic for first-time page explanations or check-in
      const hasSeenJourneyExplanation = seenExplanations.includes('journey');

      if (!hasSeenJourneyExplanation) {
        setShowJourneyExplanation(true);
      } else if (canCheckIn) {
        const timer = setTimeout(() => {
          setShowCheckInModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasShownOverlay, canCheckIn, seenExplanations]);

  useEffect(() => {
    const backAction = () => {
      if (showCheckInModal) {
        setShowCheckInModal(false);
        return true;
      }
      if (showOnboardingOverlay) {
        handleCloseOverlay();
        return true;
      }
      // At root of navigation - exit the app
      if (!navigation.canGoBack()) {
        BackHandler.exitApp();
        return true;
      }
      // Let navigation handle it if we can go back
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [showCheckInModal, showOnboardingOverlay, navigation]);

  const handleCloseOverlay = () => {
    setShowOnboardingOverlay(false);
    setHasShownOverlay(true);
  };

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

  const zoneVisuals = useMemo(() => {
    return {
      'Heavy Weather': {
        title: 'Heavy Weather',
        gradient: theme.mode === 'dark'
          ? ['#4B1D3F', '#8B5CF6'] as const
          : ['#E9D5FF', '#F3E8FF'] as const,
      },
      'Stuckness': {
        title: 'Stuckness',
        gradient: theme.mode === 'dark'
          ? ['#7C3AED', '#A78BFA'] as const
          : ['#DDD6FE', '#F3E8FF'] as const,
      },
      'Stabilization': {
        title: 'Stabilization',
        gradient: theme.mode === 'dark'
          ? ['#059669', '#34D399'] as const
          : ['#D1FAE5', '#F0FDF4'] as const,
      },
      'Openness': {
        title: 'Openness',
        gradient: theme.mode === 'dark'
          ? ['#2563EB', '#60A5FA'] as const
          : ['#E0F2FE', '#F0F9FF'] as const,
      },
    } as Record<
      string,
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

  const levelsByZone: Record<string, ConsciousnessLevel[]> = {
    'Heavy Weather': [],
    'Stuckness': [],
    'Stabilization': [],
    'Openness': [],
  };

  consciousnessLevels.forEach((level) => {
    levelsByZone[level.zone].push(level);
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

  const toggleSection = (zone: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [zone]: !prev[zone],
    }));
  };

  const handleDismissDisclaimer = () => setShowDisclaimer(false);

  const renderLevelCard = (level: ConsciousnessLevel, index: number) => {
    const isCurrent = progress?.currentLevel === level.id;
    const isCourage = level.isThreshold;

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
    const glowTint =
      theme.mode === 'dark' ? glowBase : adjustColor(gradientColors[0], -12);

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
        <Pressable
          onPress={() => navigation.navigate('LevelRoom', { levelId: level.id })}
          style={({ pressed }) => [
            styles.levelCard,
            isCurrent && styles.levelCardCurrent,
            isCourage && styles.levelCardCourage,
            theme.mode === 'dark'
              ? (glowEnabled
                ? {
                  borderWidth: 2,
                  borderColor: toRgba(glowTint, 0.8),
                  backgroundColor: 'rgba(9, 19, 28, 0.75)',
                  shadowColor: glowTint,
                  shadowOpacity: 0.34,
                  shadowRadius: 25,
                  shadowOffset: { width: 0, height: 0 },
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
                  shadowColor: glowTint,
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 0 },
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
                }),
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.portalContent}>
            <View style={styles.portalIconContainer}>
              <Ionicons
                name={zoneIcons[level.zone]}
                size={24}
                color={theme.mode === 'dark' ? glowTint : gradientColors[0]}
              />
            </View>

            <View style={styles.portalTextContainer}>
              <Text style={[styles.portalTitle, { color: theme.textPrimary }]}>
                {level.name}
              </Text>
              <Text style={[styles.portalFeltSense, { color: theme.textSecondary }]}>
                {level.feltSense}
              </Text>
            </View>

            <View style={styles.portalActions}>
              <Pressable
                style={[styles.portalPrimaryBtn, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('LevelRoom', { levelId: level.id })}
              >
                <Text style={styles.portalPrimaryBtnText}>Enter Space</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.white} />
              </Pressable>

              <Pressable
                style={styles.portalSecondaryBtn}
                onPress={() => openChapter(level, 'meditations')}
              >
                <Ionicons name="headset-outline" size={16} color={theme.primary} />
                <Text style={[styles.portalSecondaryBtnText, { color: theme.primary }]}>Practices</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  const renderZoneSection = (
    zone: string,
    levels: ConsciousnessLevel[]
  ) => {
    const meta = zoneVisuals[zone];
    if (!meta) return null;
    const expanded = expandedSections[zone];
    const heroGradient = meta.gradient;

    return (
      <View key={zone} style={styles.categorySection}>
        <Pressable
          onPress={() => toggleSection(zone)}
          style={({ pressed }) => [
            styles.categoryHero,
            pressed && styles.categoryHeroPressed,
            glowEnabled && theme.mode === 'dark' && {
              shadowColor: theme.primary,
              shadowOpacity: 0.34,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 0 },
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
              boxShadow: [
                `0 0 25px ${toRgba(theme.primary, 0.4)}`,
                `0 0 50px ${toRgba(theme.primary, 0.2)}`,
                `inset 0 0 15px ${toRgba(theme.primary, 0.1)}`,
              ].join(', '),
            },
          ]}
        >
          <LinearGradient
            key={`hero-${zone}-${theme.mode}-${glowEnabled ? 1 : 0}`}
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
                  name={zoneIcons[zone]}
                  size={22}
                  color={theme.textPrimary}
                />
              </View>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>{meta.title}</Text>
                <Text style={styles.categoryDescription}>{zoneDescriptions[zone]}</Text>
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
          {/* Climate Zones Section */}

          {sortedZones.map((zone) => {
            const levels = levelsByZone[zone];
            return levels.length
              ? renderZoneSection(zone, levels)
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
      <OnboardingOverlay
        visible={showOnboardingOverlay}
        onClose={handleCloseOverlay}
      />
      <DailyCheckInModal
        visible={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />
      <FeatureExplanationOverlay
        visible={showJourneyExplanation}
        title="Your journey awaits"
        description="This map shows the levels of consciousness. Your goal is to transcend lower states and move toward enlightened awareness."
        icon="map-outline"
        onClose={() => {
          setShowJourneyExplanation(false);
          markExplanationAsSeen('journey');
        }}
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
    portalContent: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'space-between',
    },
    portalIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    portalTextContainer: {
      flex: 1,
      marginBottom: spacing.md,
    },
    portalTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      marginBottom: spacing.xs,
    },
    portalFeltSense: {
      fontSize: typography.body,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    portalActions: {
      gap: spacing.sm,
    },
    portalPrimaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    portalPrimaryBtnText: {
      color: 'white',
      fontWeight: typography.bold,
      fontSize: typography.small,
    },
    portalSecondaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    portalSecondaryBtnText: {
      fontSize: typography.tiny,
      fontWeight: typography.semibold,
      textTransform: 'uppercase',
      letterSpacing: 1,
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
        ? 'rgba(139, 92, 246, 0.25)'
        : theme.primarySubtle,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.5)'
        : theme.primary,
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




