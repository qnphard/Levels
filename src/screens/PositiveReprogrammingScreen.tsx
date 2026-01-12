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
import ReprogrammingTransitionAnimation from '../components/animations/ReprogrammingTransitionAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PositiveReprogrammingScreen() {
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
        <Text style={styles.headerTitle}>Positive Re-programming</Text>
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
              screen="positive-reprogramming"
              section="main"
              id="key-insight-title"
              originalContent="The Law of Replacement"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="key-insight"
            originalContent="You cannot just 'stop' a thought; you must let go of the feeling that fuels it. Once the energy of the feeling is gone, the thoughts become powerless and can be easily replaced."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="intro"
          originalContent="The mind is like a garden. Letting go is the weeding; positive reprogramming is the planting. If you plant flowers (affirmations) without pulling the weeds (negativity), the flowers will eventually be choked out."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ReprogrammingTransitionAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="foundation-title"
          originalContent="Feelings as Foundations"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="feeling-base"
          originalContent="Every thought you have is rooted in a specific feeling. A single feeling can generate thousands of thoughts over a lifetime. Releasing one core feeling is more effective than trying to change ten thousand individual thoughts."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="feeling-base-2"
          originalContent="When you surrender the underlying feeling (like fear or inadequacy), the thoughts associated with that feeling simply disappear. They no longer have any 'gas' in their tank. You don't have to fix the thoughts; you only have to let go of the energy that creates them."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="possible-title"
              originalContent="The 'Possible' Framing"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="possible-text"
            originalContent="The ego often resists direct affirmations like 'I am happy' because it knows they aren't 'true' in the moment. By using the phrase 'It is possible that...', you bypass the ego's gatekeeping. This creates a tiny opening in the field of consciousness for a new reality to enter."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.warningHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="forceful-title"
              originalContent="The Futility of Mind-Force"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="forceful"
            originalContent="Many people try to 'force' positive thinking through sheer will. This is a level 200 activity trying to fix a level 100 problem. It creates massive internal conflict because the deep feelings ('I am not enough') contradict the surface thoughts ('I am successful'). The mind senses this as a lie, creating more stress."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="recontextualization-title"
          originalContent="The Power of Re-contextualization"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="recontextualization-desc"
          originalContent="Reprogramming is also about changing the *meaning* you give to events. An event that was seen as a 'failure' from the level of Pride can be seen as a 'learning opportunity' from the level of Courage, or 'divine guidance' from the level of Acceptance."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="insight-title"
              originalContent="Choice and Intention"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="insight-text"
            originalContent="Positive reprogramming is most powerful when it is used as an *intention* rather than a *demand*. Instead of 'I must be happy', try 'I choose to see the hidden gift in this situation.' This invites Grace into the process."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="practice-title"
              originalContent="Practice: Clear and Plant"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="practice-guide"
            originalContent="1. Identify a persistent negative thought ('I'll never get this done').\n2. Find the feeling *underneath* that thought (usually Fear or Overwhelmedness).\n3. Use the 'Letting Go' technique until the pressure of that feeling subsides.\n4. In the space that opens up, plant a new possibility: 'It is possible that this will unfold with ease.'\n5. Repeat the new possibility with a sense of 'allowing' rather than 'forcing'."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['intention', 'letting-go', 'what-you-really-are']}
          currentScreenId="positive-reprogramming"
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
