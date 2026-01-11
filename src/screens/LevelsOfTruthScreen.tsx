import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import LevelsOfTruthAnimation from '../components/animations/LevelsOfTruthAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LevelsOfTruthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <EditModeIndicator />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Levels of Truth</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="levels-of-truth"
              section="main"
              id="key-insight-title"
              originalContent="Context is Everything"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="levels-of-truth"
            id="key-insight"
            section="main"
            originalContent="The human mind is incapable of discerning truth from falsehood. Truth is not a 'fact' but a quality of energy that depends entirely on its context."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="intro"
          originalContent="Everything in the universe, including even a passing thought, is recorded forever in the timeless field of consciousness. This field is the Absolute by which all expressions of life can be compared."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <LevelsOfTruthAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="context-vs-content-title"
          originalContent="Context vs. Content"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="context-dependent"
          originalContent="The mind usually focuses on 'content'—the specific details, words, or actions. But the truth of those details is determined by 'context'—the overall field, intention, and level of consciousness behind them."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="context-dependent-2"
          originalContent="What is appropriate and 'true' for a person at one stage of evolution may be an obstacle for someone at another. There is no 'wrong' level, only the appropriate level for one's current state of growth."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="different-paths-title"
            originalContent="The Evolution of Perception"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="eye-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="levels-of-truth"
                  section="main"
                  id="linear-truth-title"
                  originalContent="Relative Truth"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="levels-of-truth"
                  section="main"
                  id="linear-truth"
                  originalContent="Subjective, linear, and limited by the ego's positionalities and beliefs."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="sunny-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="levels-of-truth"
                  section="main"
                  id="absolute-truth-title"
                  originalContent="Absolute Truth"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="levels-of-truth"
                  section="main"
                  id="absolute-truth"
                  originalContent="Nonlinear, infinite, and only accessible once the linear mind is transcended."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="filter-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="levels-of-truth"
              section="main"
              id="facts-title"
              originalContent="Truth vs. Facts"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="facts-text"
            originalContent="Facts are linear and can be used to prove almost anything depending on how they are framed. Truth is nonlinear and is a quality of being. A 'fact' stated with pride (175) has a different energetic truth than the same fact stated with love (500)."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="levels-of-truth"
              section="main"
              id="integrity-title"
              originalContent="The Power of Integrity"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="integrity-text"
            originalContent="Integrity is the degree of alignment with Truth. As you become more integrous, you automatically become more powerful in the spiritual sense. Truth does not need to be defended; its power lies in its mere existence. Falsehood, however, requires constant 'force' to be maintained."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="search-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="levels-of-truth"
              section="main"
              id="practice-title"
              originalContent="Practice: Questioning Context"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="practice-guide"
            originalContent="When you feel stuck or judgmental, ask yourself:\n1. 'What is the context of this situation?'\n2. 'Am I judging the content while ignoring the evolution behind it?'\n3. 'What level of truth am I standing on right now?'"
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['power-vs-force', 'intention', 'what-you-really-are']}
          currentScreenId="levels-of-truth"
        />
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
    },
  });
