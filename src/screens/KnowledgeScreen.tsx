import React, { useState, useEffect } from 'react';
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
import KnowledgeVsPracticeAnimation from '../components/animations/KnowledgeVsPracticeAnimation';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function KnowledgeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);
  const [showKnowledgeExplanation, setShowKnowledgeExplanation] = useState(false);

  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);

  // Show knowledge overlay if not seen and tutorial was seen (or skipped)
  useEffect(() => {
    if (hasSeenTutorial && !seenExplanations.includes('knowledge')) {
      const timer = setTimeout(() => {
        setShowKnowledgeExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, seenExplanations]);

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
        <Text style={styles.headerTitle}>Knowledge</Text>
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
              screen="knowledge"
              section="main"
              id="key-insight-title"
              originalContent="Map vs. Territory"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="key-insight"
            originalContent="Knowledge is the map; realization is the territory. Reading about the sun is not the same as standing in its warmth."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="knowledge"
          section="main"
          id="intro"
          originalContent="The linear mind collects facts, data, and 'information about' things. This is a level 400 activity (Reason). While useful for mapping out the spiritual path, it can eventually become a primary obstacle. The mind thinks that because it 'understands' a concept, it has 'achieved' it."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <KnowledgeVsPracticeAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="knowledge"
          section="main"
          id="realization-title"
          originalContent="The Leap into Realization"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="knowledge"
          section="main"
          id="realization-desc"
          originalContent="Realization (level 600 and above) is not an 'addition' to what the mind knows, but a total shift in context. It is the move from the linear ('I know this') to the nonlinear ('This is'). Knowledge is a possession of the ego; Realization is the dissolution of the ego into the Truth. In Silence, the Truth reveals itself."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="construct-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="knowledge"
              section="main"
              id="ceiling-title"
              originalContent="The Glass Ceiling of Reason"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="ceiling-text"
            originalContent="The level of Reason (400) is the highest level of the linear mind. It is brilliant but limited by its own logic. To reach the level of Love (500) and Peace (600), one must be willing to let go of the need for 'explanations' and step into the radical simplicity of direct experience."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="knowledge"
            section="main"
            id="comparison-title"
            originalContent="Linear vs. Nonlinear"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="book-outline" size={18} color={CARD_COLORS.keyInsight} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="knowledge-title"
                  originalContent="Linear Knowledge"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="knowledge-desc"
                  originalContent="Intellectual, analytical, and descriptive. 'I know about God.' It divides the world into subjects and objects."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="sparkles-outline" size={18} color={CARD_COLORS.practice} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="wisdom-title"
                  originalContent="Nonlinear Wisdom"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="wisdom-desc"
                  originalContent="Experiential, intuitive, and holistic. 'I am the Presence.' It recognizes the underlying Oneness of all life."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="knowledge"
              section="main"
              id="trap-title"
              originalContent="The Intellectual Trap"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="trap-text"
            originalContent="It is possible to spend decades reading spiritual books and still be stuck in a lower level of consciousness. The ego loves to 'collect' high-level concepts and use them to feed its Pride. Knowledge without practice is just sophisticated entertainment for the mind."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="knowledge"
              section="main"
              id="insight-title"
              originalContent="Silence is Knowledge"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="insight-text"
            originalContent="The ultimate knowledge is found in the silence between thoughts. When the mind stops its constant labeling and trying to 'know', the Self reveals itself. The Truth is not a destination at the end of a long search; it is the ground on which the searcher stands."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="knowledge"
              section="main"
              id="practice-title"
              originalContent="Practice: Beyond the Definition"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="practice-guide"
            originalContent="1. Pick an object near you (like a flower or a stone).\n2. Notice how the mind immediately tries to label it ('This is a rock').\n3. Set aside the label and the knowledge *about* the object.\n4. Simply 'be with' the object's existence. Look at its beingness without the interference of thoughts.\n5. Feel the difference between the mental concept and the actual vibrant reality of its presence."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['levels-of-truth', 'what-you-really-are', 'positive-reprogramming']}
          currentScreenId="knowledge"
        />
      </ScrollView>

      <FeatureExplanationOverlay
        visible={showKnowledgeExplanation}
        title="Feelings Explained"
        description="Deepen your understanding of how emotions work. Knowledge provides the map, but practice is the territory."
        icon="book-outline"
        onClose={() => {
          setShowKnowledgeExplanation(false);
          markExplanationAsSeen('knowledge');
        }}
      />
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
