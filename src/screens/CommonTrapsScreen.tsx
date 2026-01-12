import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import SpiritualProgressSpiralAnimation from '../components/animations/SpiritualProgressSpiralAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TrapSubsection = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const trapSubsections: TrapSubsection[] = [
  {
    id: 'why-trap',
    title: "The 'Why?' Analyzer",
    description: "Analyzing feelings instead of letting them move.",
    icon: 'help-circle-outline',
  },
  {
    id: 'spiritual-pride',
    title: 'Spiritual Pride',
    description: "Looking down on the 'ego' or others from a height.",
    icon: 'trending-up-outline',
  },
  {
    id: 'gaining-trap',
    title: "The 'Gaining' Fallacy",
    description: "Believing enlightenment is something to be 'added' to you.",
    icon: 'add-circle-outline',
  },
  {
    id: 'guilt-trap',
    title: 'The Guilt Loop',
    description: "Attacking yourself for having a 'low' vibration.",
    icon: 'refresh-outline',
  },
  {
    id: 'happiness-lookup',
    title: 'Looking in the Wrong Place',
    description: "Searching for God or Happiness 'at the bottom of the box'.",
    icon: 'search-outline',
  },
  {
    id: 'non-linear-progress',
    title: 'Non-Linear Progress',
    description: "Judging yourself for the natural 'ups and downs' of growth.",
    icon: 'infinite-outline',
  },
];

export default function CommonTrapsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);
  const [selectedTrap, setSelectedTrap] = useState<string | null>(null);

  const handleTrapPress = (trapId: string) => {
    setSelectedTrap(selectedTrap === trapId ? null : trapId);
  };

  const renderTrapContent = (trapId: string) => {
    switch (trapId) {
      case 'why-trap':
        return (
          <View style={styles.contentSection}>
            <View style={cardStyles.warningCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="warning-outline" size={20} color={CARD_COLORS.warning} />
                <EditableText
                  screen="common-traps"
                  section="why-trap"
                  id="warning-title"
                  originalContent="Analysis Paralysis"
                  textStyle={cardStyles.warningTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="why-trap"
                id="intro"
                originalContent="The mind's greatest defense against letting go is asking 'Why?'. It wants to know the history, the cause, and the logic. As long as you are analyzing the feeling, you are not FEELING the feeling. The 'Why' is the ego's way of staying in control."
                textStyle={cardStyles.warningText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="common-traps"
                  section="why-trap"
                  id="remedy-title"
                  originalContent="The Remedy"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="why-trap"
                id="remedy"
                originalContent="Stop the detective work. It doesn't matter if the feeling comes from childhood, yesterday, or a past life. Only the RAW ENERGY matters. Drop the story, feel the vibration, and the energy will run out."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'spiritual-pride':
        return (
          <View style={styles.contentSection}>
            <View style={cardStyles.comparisonCard}>
              <EditableText
                screen="common-traps"
                section="spiritual-pride"
                id="comparison-title"
                originalContent="Ego vs. Essence"
                textStyle={cardStyles.comparisonTitle}
                type="title"
              />
              <EditableText
                screen="common-traps"
                section="spiritual-pride"
                id="desc"
                originalContent="When you start 'making progress', the ego often hitches a ride. It says: 'Look at me, I'm so conscious!' or 'Other people are so low-vibration.' This is just the ego in a new set of clothes. True power is humble."
                textStyle={cardStyles.paragraph}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.keyInsightCard}>
              <View style={cardStyles.keyInsightHeader}>
                <Ionicons name="heart-outline" size={20} color={CARD_COLORS.keyInsight} />
                <EditableText
                  screen="common-traps"
                  section="spiritual-pride"
                  id="insight-title"
                  originalContent="Compassion is the Test"
                  textStyle={cardStyles.keyInsightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="spiritual-pride"
                id="insight-text"
                originalContent="If your spiritual growth makes you less compassionate toward 'unconscious' people, it is not growth—it is an inflation of the ego. Real realization sees that everyone is doing their best from their current level of awareness."
                textStyle={cardStyles.keyInsightText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'gaining-trap':
        return (
          <View style={styles.contentSection}>
            <View style={styles.animationContainer}>
              <SpiritualProgressSpiralAnimation />
            </View>
            <EditableText
              screen="common-traps"
              section="gaining-trap"
              id="desc"
              originalContent="We are conditioned to think we have to 'get' things. But spiritual work is a subtractive process. You are already the sun; you are simply removing the clouds. You don't 'gain' peace; you let go of the noise that hides the peace which is already there."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />
          </View>
        );

      case 'guilt-trap':
        return (
          <View style={styles.contentSection}>
            <View style={cardStyles.practiceCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="refresh-outline" size={20} color={CARD_COLORS.practice} />
                <EditableText
                  screen="common-traps"
                  section="guilt-trap"
                  id="title"
                  originalContent="The Meta-Feeling"
                  textStyle={cardStyles.practiceTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="guilt-trap"
                id="desc"
                originalContent="You feel angry, and then you feel 'guilty' that you are angry. Now you have TWO feelings to let go of. The guilt is actually more destructive than the original anger. Accept that it's okay to be imperfect. Let go of the guilt first, then the anger will move easily."
                textStyle={cardStyles.practiceText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'happiness-lookup':
        return (
          <View style={styles.contentSection}>
            <View style={cardStyles.keyInsightCard}>
              <View style={cardStyles.keyInsightHeader}>
                <Ionicons name="sunny-outline" size={20} color={CARD_COLORS.keyInsight} />
                <EditableText
                  screen="common-traps"
                  section="happiness-lookup"
                  id="title"
                  originalContent="Looking at the Sky"
                  textStyle={cardStyles.keyInsightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="happiness-lookup"
                id="desc"
                originalContent="A common mistake is looking for Happiness or God in the 'bottom of the box'—in sacrifice, suffering, religious fear, or guilt. The truth is that Higher Power is found in Joy and Love. God doesn't want you to suffer; the Universe is all-loving."
                textStyle={cardStyles.keyInsightText}
                type="paragraph"
              />
            </View>
            <View style={cardStyles.warningCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
                <EditableText
                  screen="common-traps"
                  section="happiness-lookup"
                  id="trap-title"
                  originalContent="The Sin/Punishment Trap"
                  textStyle={cardStyles.warningTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="happiness-lookup"
                id="trap-desc"
                originalContent="Many are driven by religious fear, living in constant guilt. This vibration is below level 200 and blocks the very connection it seeks. Realize that the sun is always shining; you don't have to 'earn' its warmth through pain."
                textStyle={cardStyles.warningText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'non-linear-progress':
        return (
          <View style={styles.contentSection}>
            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="common-traps"
                  section="non-linear-progress"
                  id="title"
                  originalContent="The Spiral Path"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="non-linear-progress"
                id="desc"
                originalContent="Consciousness is not linear, and neither is progress. Some days you will feel like a master of peace, and the next you might fall back into old patterns of anger or fear. This is natural. The ego uses 'setbacks' to attack you with guilt, which only slows you down more."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>
            <View style={cardStyles.practiceCard}>
              <View style={cardStyles.practiceHeader}>
                <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
                <EditableText
                  screen="common-traps"
                  section="non-linear-progress"
                  id="remedy-title"
                  originalContent="The Test of Gentleness"
                  textStyle={cardStyles.practiceTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="common-traps"
                section="non-linear-progress"
                id="remedy-desc"
                originalContent="When you 'fall' from a higher state, do not judge yourself. Judging yourself for not being happy is a spiritual pride trap. Instead, be gentle. Every 'down' is an opportunity to practice deeper surrender. You are already exactly where you need to be."
                textStyle={cardStyles.practiceText}
                type="paragraph"
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <EditModeIndicator />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Common Traps</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.subtitleContainer}>
        <EditableText
          screen="common-traps"
          section="main"
          id="subtitle"
          originalContent="Navigating the ego's subtle diversions on the path to Truth."
          textStyle={styles.subtitle}
          type="subtitle"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {trapSubsections.map((trap) => (
          <View key={trap.id} style={styles.trapCard}>
            <Pressable
              onPress={() => handleTrapPress(trap.id)}
              style={({ pressed }) => [
                styles.trapHeader,
                pressed && styles.trapHeaderPressed,
              ]}
            >
              <View style={styles.trapHeaderContent}>
                <Ionicons
                  name={trap.icon}
                  size={24}
                  color={theme.primary}
                  style={styles.trapIcon}
                />
                <View style={styles.trapTextContainer}>
                  <Text style={styles.trapTitle}>{trap.title}</Text>
                  <Text style={styles.trapDescription}>{trap.description}</Text>
                </View>
                <Ionicons
                  name={selectedTrap === trap.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
            </Pressable>

            {selectedTrap === trap.id && (
              <View style={styles.trapContent}>
                {renderTrapContent(trap.id)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    subtitleContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: 100 },
    trapCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    trapHeader: { padding: spacing.lg },
    trapHeaderPressed: { opacity: 0.8 },
    trapHeaderContent: { flexDirection: 'row', alignItems: 'center' },
    trapIcon: { marginRight: spacing.md },
    trapTextContainer: { flex: 1 },
    trapTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: theme.textPrimary, marginBottom: spacing.xs },
    trapDescription: { fontSize: typography.body, color: theme.textSecondary, lineHeight: 20 },
    trapContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: spacing.sm,
      paddingTop: spacing.lg,
    },
    contentSection: { gap: spacing.md },
    animationContainer: { marginVertical: spacing.lg, alignItems: 'center' },
  });
