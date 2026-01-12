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
import IntentionRippleAnimation from '../components/animations/IntentionRippleAnimation';
import RelatedNextCard from '../components/RelatedNextCard';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function IntentionScreen() {
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
        <Text style={styles.headerTitle}>Intention</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="radio-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="intention"
              section="main"
              id="key-insight-title"
              originalContent="The Seed of Outcome"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="intention"
            section="main"
            id="key-insight"
            originalContent="The 'what' you do is secondary; the 'why' you do it determines everything. Intention is the spiritual engine that drives the karmic results of your life."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="intention"
          section="main"
          id="intro"
          originalContent="In the field of consciousness, intention acts as a compass. It is not something you 'do' with effort, but a choice of alignment. By intending to be for the highest good, you automatically step out of the lower fields of self-interest and into the field of Power."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <IntentionRippleAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="intention"
          section="main"
          id="karma-title"
          originalContent="Intention as Karma"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="intention"
          section="main"
          id="karma-desc"
          originalContent="Karma is not a system of external punishment, but the energetic consequence of intention. Two people can perform the exact same action—like giving money to a beggar—but if one does it out of Love and the other out of Pride, the energetic results for their souls will be vastly different. The 'What' is the physical act; the 'Why' is the spiritual truth."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="intention"
              section="main"
              id="needle-title"
              originalContent="Setting the Needle"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="intention"
            section="main"
            id="needle-desc"
            originalContent="Setting an intention is like setting the needle on a record. Once the needle is placed, the whole song (the sequence of events) follows naturally. If you set the needle on the 'Love' track, your day will unfold with the 'flavor' of Love, even if difficult things happen."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="intention"
            section="main"
            id="comparison-title"
            originalContent="The Fork in the Road"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="contract-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="intention"
                  section="main"
                  id="ego-intention-title"
                  originalContent="Egoic Intention (Force)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="intention"
                  section="main"
                  id="ego-intention"
                  originalContent="Motivated by gain, recognition, control, or fear. It is linear, limited, and creates future resistance."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="expand-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="intention"
                  section="main"
                  id="divine-intention-title"
                  originalContent="Higher Intention (Power)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="intention"
                  section="main"
                  id="divine-intention"
                  originalContent="Motivated by service, truth, and the evolution of life. It is nonlinear, infinite, and invites Grace."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="intention"
          section="main"
          id="radiance-title"
          originalContent="The Radiance of Truth"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="intention"
          section="main"
          id="radiance-desc"
          originalContent="Everything is known in the field of consciousness. You can hide your intention from others, and even from yourself, but you cannot hide it from the field. Others sense the 'flavor' of your intention intuitively. This is why a simple 'thank you' can feel like a blessing from one person and an insult from another."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="intention"
              section="main"
              id="insight-title"
              originalContent="The Power of 'Thy Will Be Done'"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="intention"
            section="main"
            id="insight-text"
            originalContent="The most powerful intention a human can hold is the surrender of personal will to the Divine Will. In this intention, the small self (ego) steps aside, and the Infinite Power of the universe begins to act through the individual. This is the secret of the saints and the sages."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.quoteCard}>
          <EditableText
            screen="intention"
            section="main"
            id="quote"
            originalContent="'What you are seeking is not different from your very own Self.' - Dr. David R. Hawkins"
            textStyle={cardStyles.quoteText}
            type="quote"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="compass-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="intention"
              section="main"
              id="practice-title"
              originalContent="Practice: The Morning Alignment"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="intention"
            section="main"
            id="practice-guide"
            originalContent="Before beginning your day, take 30 seconds to set your field:\n1. Close your eyes and breathe into your heart center.\n2. State clearly: 'It is my intention to be for the highest good of all in everything I do today.'\n3. Feel the shift in your energy as you move from 'getting' to 'being'.\n4. Throughout the day, when you feel stress, return to this primary intention."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['effort', 'power-vs-force', 'non-reactivity']}
          currentScreenId="intention"
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
