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
    id: 'happiness-source',
    title: 'Where do I look for Happiness?',
    description: 'Understanding religious fear, guilt, and where true happiness comes from.',
    icon: 'search-outline',
  },
  {
    id: 'spiritual-progress',
    title: 'Spiritual Progress',
    description: 'Why spiritual progress is not linear and how to navigate the ups and downs.',
    icon: 'trending-up-outline',
  },
];

export default function CommonTrapsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);
  const [selectedTrap, setSelectedTrap] = useState<string | null>(null);

  const handleTrapPress = (trapId: string) => {
    if (selectedTrap === trapId) {
      setSelectedTrap(null);
    } else {
      setSelectedTrap(trapId);
    }
  };

  const renderTrapContent = (trapId: string) => {
    if (trapId === 'happiness-source') {
      return (
        <View style={styles.contentSection}>
          <View style={cardStyles.warningCard}>
            <View style={cardStyles.warningHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
              <EditableText
                screen="common-traps"
                section="happiness-source"
                id="warning-title"
                originalContent="The Trap: Looking in the Wrong Places"
                textStyle={cardStyles.warningTitle}
                type="title"
              />
            </View>
            <EditableText
              screen="common-traps"
              section="happiness-source"
              id="intro"
              originalContent="Many of us have been taught to look for God and happiness in the wrong places. We've been conditioned by religious fear, living in a constant state of guilt, believing that we should be punished for our 'sins.'"
              textStyle={cardStyles.warningText}
              type="paragraph"
            />
          </View>
          
          <EditableText
            screen="common-traps"
            section="happiness-source"
            id="truth"
            originalContent="The truth is that God exists in the higher power-based levels of consciousness (above 200). God and the Universe are all-loving and they don't want you to suffer for them."
            textStyle={cardStyles.paragraph}
            type="paragraph"
          />

          <EditableText
            screen="common-traps"
            section="happiness-source"
            id="truth-2"
            originalContent="The idea that we must suffer to be worthy is a falsehood that keeps us trapped in lower levels."
            textStyle={cardStyles.paragraph}
            type="paragraph"
          />

          <View style={cardStyles.keyInsightCard}>
            <View style={cardStyles.keyInsightHeader}>
              <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.keyInsight} />
              <EditableText
                screen="common-traps"
                section="happiness-source"
                id="realization-title"
                originalContent="The Realization"
                textStyle={cardStyles.keyInsightTitle}
                type="title"
              />
            </View>
            <EditableText
              screen="common-traps"
              section="happiness-source"
              id="realization"
              originalContent="When we realize that we are naturally happy and free—that we are the sky, and the clouds (emotional blocks) are temporary—we can stop looking for happiness at the bottom of the box."
            textStyle={cardStyles.keyInsightText}
              type="paragraph"
            />
            <EditableText
              screen="common-traps"
              section="happiness-source"
              id="realization-2"
              originalContent="True happiness comes from within, by releasing the blocks that keep us from our natural state."
              textStyle={cardStyles.keyInsightText}
              type="paragraph"
            />
          </View>

          <View style={cardStyles.quoteCard}>
            <EditableText
              screen="common-traps"
              section="happiness-source"
              id="quote"
              originalContent="'The kingdom of heaven is within you.' - Jesus Christ"
              textStyle={cardStyles.quoteText}
              type="quote"
            />
          </View>
        </View>
      );
    }

    if (trapId === 'spiritual-progress') {
      return (
        <View style={styles.contentSection}>
          <View style={cardStyles.warningCard}>
            <View style={cardStyles.warningHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
              <EditableText
                screen="common-traps"
                section="spiritual-progress"
                id="warning-title"
                originalContent="The Trap: Expecting Linear Progress"
                textStyle={cardStyles.warningTitle}
                type="title"
              />
            </View>
            <EditableText
              screen="common-traps"
              section="spiritual-progress"
              id="intro"
              originalContent="One of the most common mistakes on the spiritual path is expecting progress to be linear—a straight line upward. But consciousness itself is not linear, and neither is our journey."
              textStyle={cardStyles.warningText}
              type="paragraph"
            />
          </View>

          <View style={styles.animationContainer}>
            <SpiritualProgressSpiralAnimation autoPlay={true} />
          </View>

          <EditableText
            screen="common-traps"
            section="spiritual-progress"
            id="ups-downs"
            originalContent="We all have our ups and downs. This is normal and natural. Just as the weather changes, our inner state fluctuates."
            textStyle={cardStyles.paragraph}
            type="paragraph"
          />

          <EditableText
            screen="common-traps"
            section="spiritual-progress"
            id="ups-downs-2"
            originalContent="The mistake is judging ourselves for not being happy all the time, or for not having reached our goals yet."
            textStyle={cardStyles.paragraph}
            type="paragraph"
          />

          <View style={cardStyles.warningCard}>
            <View style={cardStyles.warningHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
              <EditableText
                screen="common-traps"
                section="spiritual-progress"
                id="spiritual-pride-title"
                originalContent="Spiritual Pride & Guilt"
                textStyle={cardStyles.warningTitle}
                type="title"
              />
            </View>
            <EditableText
              screen="common-traps"
              section="spiritual-progress"
              id="spiritual-pride"
              originalContent="A particularly insidious trap is spiritual pride combined with guilt. When we think we 'should' be further along, or when we compare ourselves to others, we create a cycle of judgment that actually impedes progress."
            textStyle={cardStyles.warningText}
              type="paragraph"
            />
            <EditableText
              screen="common-traps"
              section="spiritual-progress"
              id="spiritual-pride-2"
              originalContent="The path is not about perfection—it's about awareness and letting go."
              textStyle={cardStyles.warningText}
              type="paragraph"
            />
          </View>

          <View style={cardStyles.practiceCard}>
            <View style={cardStyles.practiceHeader}>
              <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
              <EditableText
                screen="common-traps"
                section="spiritual-progress"
                id="compassion-title"
                originalContent="The Key: Self-Compassion"
                textStyle={cardStyles.practiceTitle}
                type="title"
              />
            </View>
            <EditableText
              screen="common-traps"
              section="spiritual-progress"
              id="compassion"
              originalContent="The key is to have compassion for yourself. When you notice you're in a lower state, don't add guilt on top of it."
            textStyle={cardStyles.practiceText}
              type="paragraph"
            />
            <EditableText
              screen="common-traps"
              section="spiritual-progress"
              id="compassion-2"
              originalContent="Simply acknowledge where you are, and gently let go. Progress happens in spirals, not straight lines."
              textStyle={cardStyles.practiceText}
              type="paragraph"
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <EditModeIndicator />
      
      {/* Header */}
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

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <EditableText
          screen="common-traps"
          section="main"
          id="subtitle"
          originalContent="Common mistakes and misconceptions on the spiritual path."
          textStyle={styles.subtitle}
          type="subtitle"
        />
      </View>

      {/* Content */}
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
                  <EditableText
                    screen="common-traps"
                    section="cards"
                    id={`${trap.id}-title`}
                    originalContent={trap.title}
                    textStyle={styles.trapTitle}
                    type="title"
                  />
                  <EditableText
                    screen="common-traps"
                    section="cards"
                    id={`${trap.id}-description`}
                    originalContent={trap.description}
                    textStyle={styles.trapDescription}
                    type="description"
                  />
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
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    subtitleContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    trapCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    trapHeader: {
      padding: spacing.lg,
    },
    trapHeaderPressed: {
      opacity: 0.8,
    },
    trapHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trapIcon: {
      marginRight: spacing.md,
    },
    trapTextContainer: {
      flex: 1,
    },
    trapTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    trapDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    trapContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: spacing.sm,
      paddingTop: spacing.lg,
    },
    contentSection: {
      gap: spacing.md,
    },
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
    },
  });

