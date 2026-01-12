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
import FearGriefSpillAnimation from '../components/animations/FearGriefSpillAnimation';
import ResistanceFlowAnimation from '../components/animations/ResistanceFlowAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LossAndAbandonmentScreen() {
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
    >
      <EditModeIndicator />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loss & Abandonment</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="heart-dislike-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="key-insight-title"
              originalContent="The Finite Nature of Grief"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="key-insight"
            originalContent="Grief is not a bottomless pit. It is a specific amount of energy stored in the system. When you stop resisting it, the reservoir eventually runs dry."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="loss-and-abandonment"
          section="main"
          id="intro"
          originalContent="Loss is the experience of the ego when it loses something it has 'appropriated' as part of its identity. We feel we ARE our relationships, our jobs, or our possessions. When they leave, it feels like a piece of US is dying. This is the root of abandonment."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <FearGriefSpillAnimation />
        </View>

        <EditableText
          screen="loss-and-abandonment"
          section="main"
          id="source-title"
          originalContent="The Source of Happiness"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="loss-and-abandonment"
          section="main"
          id="source-desc"
          originalContent="Suffering in loss comes from the belief that the external object was the SOURCE of our happiness. In reality, the object was only the TRIGGER (Level 125) that allowed the happiness already inside us (Level 540) to shine through. The happiness is still there; only the trigger is gone."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="link-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="appropriation-title"
              originalContent="The Ego's Appropriation"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="appropriation-text"
            originalContent="The ego survives by labeling things as 'mine'. 'My' partner, 'my' job, 'my' house. When these labels are threatened, we feel like 'I' am being threatened. Surrender is the process of loosening these labels, realizing that everything in the linear world is on loan from the universe."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="trap-title"
              originalContent="The Trap of Resistance"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="trap-text"
            originalContent="Grief only becomes chronic when we resist it. We try to 'not feel' the pain, or we stay stuck in 'if only' stories. This resistance acts like a lid on a boiling pot, keeping the energy trapped. When you take the lid off, the steam escapes and the pressure drops."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <ResistanceFlowAnimation />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="insight-title"
              originalContent="Love Never Dies"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="insight-text"
            originalContent="The vibration of love (500) is independent of time and space. While the person or situation may leave the 'Linear' world, the 'Nonlinear' bond remains. You can let go of the pain of the loss while keeping the power of the love."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="water-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="practice-title"
              originalContent="Practice: Emptying the Reservoir"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="practice-guide"
            originalContent="1. Sit with the feeling of heaviness or 'emptiness' in the center of your chest.\n2. Stop tellling the story of WHO was lost or WHAT was lost. Just feel the pure energy of the grief.\n3. Decide: 'I am willing to let this energy move through me. I will not stop the tears.'\n4. Imagine the grief as a dark liquid flowing out of your heart and into the Earth.\n5. Wait. Stay with it until the heavy pressure shifts, even slightly. Recognize that you are the ONE AWARE of the grief, not the grief itself."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['letting-go', 'shadow-work', 'natural-happiness']}
          currentScreenId="loss-and-abandonment"
        />
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
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: 100 },
    animationContainer: { marginVertical: spacing.lg, alignItems: 'center' },
  });
