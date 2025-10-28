import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function JourneyMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const { progress } = useUserProgress();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Check if user just engaged with Courage (200) for the first time
  useEffect(() => {
    if (
      progress?.firstEngagedWithCourage &&
      !progress.exploredLevels.includes('courage')
    ) {
      setShowDisclaimer(true);
    }
  }, [progress]);

  const handleLevelPress = (level: ConsciousnessLevel) => {
    navigation.navigate('LevelDetail', { levelId: level.id });
  };

  const renderLevelCard = (level: ConsciousnessLevel, index: number) => {
    const isExplored = progress?.exploredLevels.includes(level.id) || false;
    const isCurrent = progress?.currentLevel === level.id;
    const isCourage = level.isThreshold;

    // Get completed practices count for this level
    const journeyEntry = progress?.journeyPath.find(
      (entry) => entry.levelId === level.id
    );
    const completedCount = journeyEntry?.practicesCompleted || 0;

    return (
      <View key={level.id} style={styles.levelContainer}>
        <TouchableOpacity
          style={[
            styles.levelCard,
            isCurrent && styles.levelCardCurrent,
            isCourage && styles.levelCardCourage,
          ]}
          onPress={() => handleLevelPress(level)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[level.color, adjustColor(level.color, -10)]}
            style={styles.levelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.textOverlay}>
              {/* Main content */}
              <View style={styles.levelContent}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelTitle}>
                    {level.level < 200 ? `Transcending ${level.name}` : level.name}
                  </Text>
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </View>

                <View style={styles.antithesisContainer}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#475569"
                  />
                  <Text style={styles.antithesisText}>
                    {level.level < 200 ? `Through ${level.antithesis}` : level.antithesis}
                  </Text>
                </View>

                <Text style={styles.levelDescription} numberOfLines={2}>
                  {level.description}
                </Text>

                {/* Progress indicator */}
                {isExplored && (
                  <View style={styles.exploredIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={theme.accentTeal}
                    />
                    <Text style={styles.exploredText}>
                      Explored · {completedCount} practice
                      {completedCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}

                {/* Courage threshold badge */}
                {isCourage && (
                  <View style={styles.thresholdBadge}>
                    <Ionicons name="star" size={14} color={theme.gold} />
                    <Text style={styles.thresholdText}>
                      Threshold - Where Power Begins
                    </Text>
                  </View>
                )}
              </View>

              {/* Arrow indicator */}
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#64748B"
                style={{ marginLeft: 'auto' }}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategoryHeader = (category: string) => {
    const categoryLabels: Record<string, string> = {
      healing: 'Healing - Moving Toward Courage',
      empowerment: 'Empowerment - Power, Not Force',
      spiritual: 'Spiritual - Heart-Centered Reality',
      enlightenment: 'Enlightenment - Non-Dual Awareness',
    };

    return (
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{categoryLabels[category]}</Text>
      </View>
    );
  };

  // Group levels by category
  const levelsByCategory = consciousnessLevels.reduce(
    (acc, level) => {
      if (!acc[level.category]) {
        acc[level.category] = [];
      }
      acc[level.category].push(level);
      return acc;
    },
    {} as Record<string, ConsciousnessLevel[]>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F3E5F5', '#E1BEE7', '#CE93D8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo-no-bg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.headerSubtitle}>
          Explore any level - the path is yours
        </Text>
      </LinearGradient>

      <LinearGradient
        colors={['#F3E5F5', '#E1BEE7', '#CE93D8']}
        style={styles.scrollView}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          style={styles.scrollViewInner}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gentle guidance message */}
          <TouchableOpacity
            style={styles.guidanceCard}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Ionicons name="heart-outline" size={24} color={theme.accentTeal} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guidanceText}>
                Not sure where to start?{' '}
                <Text style={styles.guidanceEmphasis}>Check in with yourself</Text> and we'll guide you to the right level.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.accentTeal} />
          </TouchableOpacity>

        {/* Render levels by category */}
        {Object.entries(levelsByCategory).map(([category, levels]) => (
          <View key={category}>
            {renderCategoryHeader(category)}
            {levels.map((level, index) => renderLevelCard(level, index))}
          </View>
        ))}

        {/* Revisiting reminder */}
        <View style={styles.reminderCard}>
          <Ionicons
            name="refresh-circle-outline"
            size={24}
            color={theme.primary}
          />
          <Text style={styles.reminderText}>
            Transcending a level once doesn't mean you're done. Life brings new
            layers. Revisiting is sacred and encouraged.
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

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F5F6', // Neutral grounding tone as fallback
    },
    header: {
      paddingTop: 12,
      paddingBottom: 6,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 2,
    },
    logo: {
      width: 340,
      height: 111,
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: '#475569',
      fontWeight: typography.medium,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewInner: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    guidanceCard: {
      backgroundColor: theme.cardBackground,
      padding: spacing.lg,
      borderRadius: 16,
      marginBottom: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    guidanceText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    guidanceEmphasis: {
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    categoryHeader: {
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    categoryTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    levelContainer: {
      position: 'relative',
      marginBottom: spacing.lg,
    },
    connectionLine: {
      position: 'absolute',
      left: width * 0.08,
      top: '50%',
      bottom: '-50%',
      width: 2,
      backgroundColor: theme.border,
      zIndex: -1,
    },
    levelCard: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    levelCardCurrent: {
      shadowOpacity: 0.08,
      elevation: 4,
    },
    levelCardCourage: {
      borderWidth: 2,
      borderColor: theme.gold,
    },
    levelGradient: {
      position: 'relative',
    },
    blurOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: borderRadius.lg,
    },
    textOverlay: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      gap: spacing.md,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
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
      color: '#1E293B',
      flex: 1,
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
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
      color: '#475569',
      fontWeight: typography.medium,
      fontStyle: 'italic',
      textShadowColor: 'rgba(255, 255, 255, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    levelDescription: {
      fontSize: typography.body,
      color: '#475569',
      lineHeight: 20,
      letterSpacing: 0.1,
      textShadowColor: 'rgba(255, 255, 255, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    exploredIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    exploredText: {
      fontSize: typography.tiny,
      color: '#1E293B',
      fontWeight: typography.medium,
    },
    thresholdBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginTop: spacing.xs,
    },
    thresholdText: {
      fontSize: typography.tiny,
      color: theme.gold,
      fontWeight: typography.semibold,
    },
    reminderCard: {
      backgroundColor: theme.primarySubtle,
      padding: spacing.lg,
      borderRadius: 16,
      marginTop: spacing.xxl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: theme.primary,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    reminderText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });
