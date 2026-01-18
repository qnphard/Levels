import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { getLevelById } from '../data/levels';
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
import PrimaryButton from '../components/PrimaryButton';
import WhyFeelingSheet from '../components/WhyFeelingSheet';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import ContentBuilder from '../components/ContentBuilder';
import { LivingBackground } from '../components/LivingBackground';
import { KineticText } from '../components/KineticText';
import { GlassSurface } from '../components/GlassSurface';
import { GradientDivider } from '../components/GradientDivider';
import { HapticOrchestrator } from '../services/HapticOrchestrator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelDetailRouteProp = RouteProp<RootStackParamList, 'LevelDetail'>;

const { width } = Dimensions.get('window');

export default function LevelDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelDetailRouteProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const { levelId } = route.params;
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
    () => getStyles(theme, luminousAccent, glowEnabled),
    [theme, luminousAccent, glowEnabled]
  );

  const { progress, markLevelExplored, setCurrentLevel, markCourageEngaged } =
    useUserProgress();
  const [showWhyFeelingSheet, setShowWhyFeelingSheet] = useState(false);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);

  const handleStructureChange = () => {
    setStructureRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (level) {
      markLevelExplored(level.id);
      if (level.isThreshold) {
        markCourageEngaged();
      }
      // Haptic feedback on entry
      HapticOrchestrator.elementClick();
    }
  }, [level]);

  if (!level) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Level not found</Text>
      </View>
    );
  }

  const isCurrentLevel = progress?.currentLevel === level.id;
  const accentColor = luminousAccent;

  const handleSetAsCurrent = async () => {
    HapticOrchestrator.commit();
    await setCurrentLevel(level.id);
  };

  const handleBeginPractice = () => {
    HapticOrchestrator.elementActive();
    alert(`Practice sessions for ${String(level.name || '')} will be available soon.`);
  };

  const handleGoBack = () => {
    HapticOrchestrator.elementClick();
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* 1. Alive Foundation */}
      <LivingBackground />

      <EditModeIndicator />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.eyebrowContainer}>
              <Text style={typography.styles.eyebrow}>CONSCIOUSNESS LEVEL {level.level}</Text>
            </View>

            <KineticText
              type="display"
              style={[styles.levelTitle, { color: theme.textPrimary }]}
              delay={100}
            >
              {String(level.name || 'Unknown')}
            </KineticText>

            <View style={styles.antithesisContainer}>
              <Text style={[typography.styles.h3, { color: toRgba(theme.textSecondary, 0.7) }]}>Transmuting</Text>
              <Text style={[typography.styles.h3, { color: accentColor, fontWeight: '600' }]}>
                {String(level.antithesis || '')}
              </Text>
            </View>

            {level.isThreshold && (
              <View style={styles.thresholdBadge}>
                <Ionicons name="star" size={14} color={theme.gold} />
                <Text style={styles.thresholdText}>THE THRESHOLD OF POWER</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Section: Description */}
        <View style={styles.editorialSection} key={structureRefreshKey}>
          <EditableText
            screen="level-detail"
            section={levelId}
            id="description"
            originalContent={String(level.description || '')}
            textStyle={typography.styles.body}
            type="paragraph"
          />
          <ContentBuilder
            screen="level-detail"
            section={levelId}
            onStructureChange={handleStructureChange}
          />
        </View>

        <GradientDivider opacity={0.3} />

        {/* Characteristics - in GlassSurface */}
        <GlassSurface style={styles.glassSection}>
          <View style={styles.sectionHeader}>
            <Text style={typography.styles.h2}>You Might Notice</Text>
          </View>
          {level.characteristics.map((char, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.bullet, { backgroundColor: accentColor }]} />
              <EditableText
                screen="level-detail"
                section={levelId}
                id={`characteristic-${index}`}
                originalContent={char}
                textStyle={styles.listText}
                type="paragraph"
              />
            </View>
          ))}
        </GlassSurface>

        {/* Physical Signs - in GlassSurface */}
        <GlassSurface style={styles.glassSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="body-outline" size={22} color={accentColor} />
            <Text style={typography.styles.h2}>In Your Body</Text>
          </View>
          {level.physicalSigns.map((sign, index) => (
            <View key={index} style={styles.listItem}>
              <EditableText
                screen="level-detail"
                section={levelId}
                id={`physical-sign-${index}`}
                originalContent={sign}
                textStyle={styles.listText}
                type="paragraph"
              />
            </View>
          ))}
        </GlassSurface>

        {/* The Trap */}
        <GlassSurface
          style={[styles.glassSection, { borderColor: toRgba(accentColor, 0.3) }]}
          intensity={20}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle-outline" size={22} color={accentColor} />
            <Text style={[typography.styles.h2, { color: accentColor }]}>The Trap</Text>
          </View>
          <Text style={[typography.styles.body, { fontStyle: 'italic', opacity: 0.9 }]}>
            {String(level.trapDescription || '')}
          </Text>
        </GlassSurface>

        {/* The Way Through */}
        <GlassSurface
          style={[styles.glassSection, { borderColor: toRgba(accentColor, 0.5) }]}
          intensity={60}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="compass-outline" size={22} color={accentColor} />
            <Text style={[typography.styles.h2, { color: accentColor }]}>The Way Through</Text>
          </View>
          <Text style={typography.styles.body}>
            {level.wayThrough}
          </Text>
        </GlassSurface>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            label="Begin Practice"
            onPress={handleBeginPractice}
            backgroundColor={buttonColor}
            textColor={theme.white}
          />
          {!isCurrentLevel && (
            <TouchableOpacity onPress={handleSetAsCurrent} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Set as Current Focus</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <WhyFeelingSheet
        visible={showWhyFeelingSheet}
        onClose={() => setShowWhyFeelingSheet(false)}
        prefillEmotion={level.name}
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
  const hex = color.replace('#', '');
  const expand = (value: string) =>
    parseInt(value.length === 1 ? value + value : value, 16);
  const r = expand(hex.substring(0, hex.length >= 6 ? 2 : 1));
  const g = expand(hex.substring(hex.length >= 6 ? 2 : 1, hex.length >= 6 ? 4 : 2));
  const b = expand(hex.substring(hex.length >= 6 ? 4 : 2, hex.length >= 6 ? 6 : 3));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getStyles = (theme: ThemeColors, accent: string, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Skia covers this, but good fallback
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    backButton: {
      marginBottom: spacing.lg,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      alignItems: 'flex-start', // Left aligned editorial look
    },
    eyebrowContainer: {
      marginBottom: spacing.xs,
      opacity: 0.7,
    },
    levelTitle: {
      marginBottom: spacing.sm,
      // KineticText styles handle font
    },
    antithesisContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
      alignItems: 'baseline'
    },
    thresholdBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    thresholdText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.gold,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    editorialSection: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    glassSection: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
      padding: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    listItem: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 10,
    },
    listText: {
      flex: 1,
      ...typography.styles.body,
      fontSize: 16,
    },
    actionsContainer: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
      gap: spacing.lg,
    },
    secondaryAction: {
      alignItems: 'center',
      padding: spacing.md,
    },
    secondaryActionText: {
      color: toRgba(theme.textPrimary, 0.6),
      fontSize: 14,
      letterSpacing: 0.5,
    },
    errorText: {
      color: theme.error,
      textAlign: 'center',
      marginTop: 100,
    }
  });
