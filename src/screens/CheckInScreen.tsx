import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  AccessibilityInfo,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Emotion } from '../types';
import { sampleMeditations } from '../data/meditations';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const emotions: {
  label: Emotion;
  emoji: string;
  gradient: string[];
  description: string;
  levelId: string;
}[] = [
  {
    label: 'Anxious/Stressed',
    emoji: '😰',
    gradient: ['#FFD93D', '#FFC107'],
    description: 'Worried, overwhelmed, or tense',
    levelId: 'fear'
  },
  {
    label: 'Tired',
    emoji: '😴',
    gradient: ['#748FFC', '#5C7CFA'],
    description: 'Low energy or exhausted',
    levelId: 'apathy'
  },
  {
    label: 'Depressed/Sad',
    emoji: '😢',
    gradient: ['#4DABF7', '#1C7ED6'],
    description: 'Feeling down, heavy, or empty',
    levelId: 'grief'
  },
  {
    label: 'Angry',
    emoji: '😠',
    gradient: ['#FA5252', '#E03131'],
    description: 'Frustrated or irritated',
    levelId: 'anger'
  },
  {
    label: 'Restless',
    emoji: '😣',
    gradient: ['#FFB347', '#FF922B'],
    description: 'Unable to settle or focus',
    levelId: 'desire'
  },
  {
    label: 'Neutral',
    emoji: '😐',
    gradient: ['#ADB5BD', '#868E96'],
    description: 'Emotionally balanced, neither up nor down',
    levelId: 'neutrality'
  },
  {
    label: 'Motivated',
    emoji: '🔥',
    gradient: ['#FD7E14', '#E8590C'],
    description: 'Ready to take action',
    levelId: 'courage'
  },
  {
    label: 'Happy',
    emoji: '😊',
    gradient: ['#FFC078', '#FFB84D'],
    description: 'Feeling joy and contentment',
    levelId: 'joy'
  },
  {
    label: 'Peaceful',
    emoji: '😌',
    gradient: ['#51CF66', '#37B24D'],
    description: 'Calm and centered',
    levelId: 'peace'
  },
];

export default function CheckInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const theme = useThemeColors();
  const styles = getStyles(theme);

  // Animation values for each emotion card
  const scaleAnims = useRef(
    emotions.map(() => new Animated.Value(1))
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription?.remove?.();
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [reduceMotion]);

  const handleEmotionPress = (index: number, emotionData: typeof emotions[0]) => {
    setSelectedEmotion(emotionData.label);

    if (!reduceMotion) {
      // Animate the pressed card
      Animated.sequence([
        Animated.spring(scaleAnims[index], {
          toValue: 0.92,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[index], {
          toValue: 1.05,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Navigate to LevelDetail with the emotion's level
    navigation.navigate('LevelDetail', { levelId: emotionData.levelId });
  };

  const getSuggestedPractice = (emotion: Emotion) => {
    const emotionMap: Record<Emotion, string> = {
      'Anxious/Stressed': 'Breath Awareness',
      Tired: 'Evening Wind Down',
      'Depressed/Sad': 'Loving Kindness',
      Angry: 'Releasing Tension',
      Restless: 'Body Scan',
      Neutral: 'Morning Centering',
      Motivated: 'Morning Centering',
      Happy: 'Gratitude Practice',
      Peaceful: 'Stillness Practice',
    };
    const practiceTitle = emotionMap[emotion];
    return sampleMeditations.find((m) => m.title === practiceTitle);
  };

  const handleContinue = () => {
    if (!selectedEmotion) return;
    const practice = getSuggestedPractice(selectedEmotion);
    if (practice) {
      navigation.navigate('Player', { meditation: practice });
    }
  };

  const suggestedPractice = selectedEmotion
    ? getSuggestedPractice(selectedEmotion)
    : null;

  return (
    <View style={styles.container}>
      {/* Calm blue gradient background */}
      <LinearGradient
        colors={['#E0F2FE', '#DBEAFE', '#F0F9FF']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#5B21B6" />
          </TouchableOpacity>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={styles.headerTitle}>How are you feeling?</Text>
            <Text style={styles.headerSubtitle}>
              Choose what resonates with you right now
            </Text>
          </Animated.View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Emotion Cards */}
        <Animated.View
          style={[
            styles.emotionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {emotions.map((emotion, index) => {
            const isActive = selectedEmotion === emotion.label;
            return (
              <Animated.View
                key={emotion.label}
                style={[
                  styles.emotionWrapper,
                  {
                    transform: [
                      { scale: isActive ? 1.05 : scaleAnims[index] },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleEmotionPress(index, emotion)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <LinearGradient
                    colors={[emotion.gradient[0], emotion.gradient[1]]}
                    style={[
                      styles.emotionCard,
                      isActive && styles.emotionCardActive,
                      isActive && { borderColor: emotion.gradient[0] },
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.emotionOverlay}>
                      <View style={styles.emotionContent}>
                        <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                        <Text style={styles.emotionLabel}>
                          {emotion.label}
                        </Text>
                        <Text style={styles.emotionDescription}>
                          {emotion.description}
                        </Text>
                      </View>

                      {isActive && (
                        <View style={styles.checkmarkContainer}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Recommendation Card */}
        {suggestedPractice && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={theme.accentTeal}
                />
                <Text style={styles.suggestionLabel}>
                  Recommended for you
                </Text>
              </View>

              <Text style={styles.suggestionTitle}>
                {suggestedPractice.title}
              </Text>
              <Text style={styles.suggestionDescription}>
                {suggestedPractice.description}
              </Text>

              <View style={styles.suggestionMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                  <Text style={styles.metaText}>
                    {Math.floor(suggestedPractice.duration / 60)} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="heart-outline" size={16} color={theme.textSecondary} />
                  <Text style={styles.metaText}>{suggestedPractice.category}</Text>
                </View>
              </View>

              <PrimaryButton
                label="Begin Practice"
                onPress={handleContinue}
              />
            </View>
          </Animated.View>
        )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F5F6',
    },
    gradientBackground: {
      flex: 1,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: 44,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    headerTitle: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: '#1E293B',
      marginBottom: spacing.xs,
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: '#475569',
      fontWeight: typography.medium,
      lineHeight: 22,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: 120,
    },
    emotionsContainer: {
      marginTop: spacing.md,
    },
    emotionWrapper: {
      marginBottom: spacing.md,
    },
    emotionCard: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    emotionCardActive: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    emotionOverlay: {
      padding: spacing.lg,
      minHeight: 120,
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    emotionContent: {
      flex: 1,
    },
    emotionEmoji: {
      fontSize: 40,
      marginBottom: spacing.sm,
    },
    emotionLabel: {
      fontSize: typography.h3,
      color: '#FFFFFF',
      fontWeight: typography.bold,
      marginBottom: spacing.xs,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    emotionDescription: {
      fontSize: typography.body,
      color: '#FFFFFF',
      lineHeight: 20,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    checkmarkContainer: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
    },
    suggestionCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.2)',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    suggestionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    suggestionLabel: {
      fontSize: typography.small,
      color: theme.accentTeal,
      fontWeight: typography.semibold,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    suggestionTitle: {
      fontSize: typography.h3,
      color: theme.textPrimary,
      fontWeight: typography.bold,
      marginBottom: spacing.sm,
      letterSpacing: -0.3,
    },
    suggestionDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
      fontStyle: 'italic',
    },
    suggestionMeta: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: typography.medium,
    },
    bottomSpacer: {
      height: 40,
    },
  });
