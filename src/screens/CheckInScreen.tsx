import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  AccessibilityInfo,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const emotions: { label: Emotion; emoji: string }[] = [
  { label: 'Stressed', emoji: '😰' },
  { label: 'Anxious', emoji: '😟' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Restless', emoji: '😣' },
  { label: 'Peaceful', emoji: '😌' },
];

export default function CheckInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const pulse = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription?.remove?.();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, reduceMotion]);

  const getSuggestedPractice = (emotion: Emotion) => {
    const emotionMap: Record<Emotion, string> = {
      Stressed: 'Breath Awareness',
      Anxious: 'Safe Space',
      Tired: 'Evening Wind Down',
      Sad: 'Loving Kindness',
      Restless: 'Body Scan',
      Okay: 'Morning Centering',
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
      <LinearGradient
        colors={theme.gradients.horizonDay}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Check In</Text>
        <Text style={styles.headerSubtitle}>
          How are you feeling right now?
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emotionsGrid}>
          {emotions.map((emotion) => {
            const isActive = selectedEmotion === emotion.label;
            return (
              <Animated.View
                key={emotion.label}
                style={[
                  styles.emotionWrapper,
                  !reduceMotion && { opacity: pulse },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.emotionButton,
                    isActive && styles.emotionButtonSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setSelectedEmotion(emotion.label)}
                >
                  <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                  <Text
                    style={[
                      styles.emotionLabel,
                      isActive && styles.emotionLabelSelected,
                    ]}
                  >
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {suggestedPractice && (
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionLabel}>
              Here's something that might help
            </Text>
            <Text style={styles.suggestionTitle}>
              {suggestedPractice.title}
            </Text>
            <Text style={styles.suggestionDescription}>
              {suggestedPractice.description}
            </Text>
            <PrimaryButton label="Begin when you're ready" onPress={handleContinue} />
          </View>
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Not right now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    headerTitle: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: theme.headingOnGradient,
      marginBottom: spacing.xs,
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: theme.textLight,
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    emotionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.xxl,
    },
    emotionWrapper: {
      width: '30%',
      marginBottom: spacing.md,
    },
    emotionButton: {
      aspectRatio: 1,
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    emotionButtonSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySubtle,
    },
    emotionEmoji: {
      fontSize: 32,
      marginBottom: spacing.xs,
    },
    emotionLabel: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: typography.medium,
    },
    emotionLabelSelected: {
      color: theme.textPrimary,
      fontWeight: typography.bold,
    },
    suggestionCard: {
      backgroundColor: theme.cardBackground,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.xl,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },
    suggestionLabel: {
      fontSize: typography.small,
      color: theme.accentTeal,
      fontWeight: typography.semibold,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: spacing.sm,
    },
    suggestionTitle: {
      fontSize: typography.h3,
      color: theme.textPrimary,
      fontWeight: typography.bold,
      marginBottom: spacing.xs,
    },
    suggestionDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.lg,
      fontStyle: 'italic',
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: spacing.md,
      marginBottom: spacing.xxl,
    },
    skipButtonText: {
      fontSize: typography.body,
      color: theme.textMuted,
      fontWeight: typography.regular,
    },
  });
