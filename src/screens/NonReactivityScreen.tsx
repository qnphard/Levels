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
import ReactionVsPowerAnimation from '../components/animations/ReactionVsPowerAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NonReactivityScreen() {
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
        <Text style={styles.headerTitle}>Non Reactivity</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="pause-circle-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="key-insight-title"
              originalContent="Effect vs. Source"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="key-insight"
            originalContent="You are either the source of your experience or the effect of it. Reactivity is the state of being a 'victim' to external circumstances."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="non-reactivity"
          section="main"
          id="intro"
          originalContent="The animal brain is hardwired for reactivity—fight, flight, or freeze. In modern life, this manifests as being 'triggered' by words, emails, or traffic. When you react, you have temporarily surrendered your sovereignty to an external event."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ReactionVsPowerAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="comparison-title"
            originalContent="The Mechanism of Choice"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="remove-circle-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="reaction-header"
                  originalContent="Reactivity (Force)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="reaction-desc"
                  originalContent="Automated, ego-driven, and defensive. It strengthens the illusion of a small, threatened self."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="flash-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="power-header"
                  originalContent="Responsiveness (Power)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="power-desc"
                  originalContent="Conscious, calm, and aligned with truth. It flows from the Infinite Self that cannot be threatened."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="non-reactivity"
          section="main"
          id="biology-title"
          originalContent="The Ten-Second Gap"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="non-reactivity"
          section="main"
          id="gap-desc"
          originalContent="Between a stimulus and your response, there is a space. In that space lies your freedom. Reactivity happens when the 'gap' is bypassed. Non-reactivity is the practice of widening that gap so that Wisdom can step in before the ego speaks."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="apathy-title"
              originalContent="Mistaking Peace for Apathy"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="apathy-text"
            originalContent="Non-reactivity is not the same as 'not caring'. It is 'infinite caring' without the attachment to results. Apathy is life-denying (calibrates at 50), while non-reactive Peace is life-affirming (calibrates at 600)."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="insight-title"
              originalContent="Transcending the 'Attacker'"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="insight-text"
            originalContent="When someone 'attacks' you with words, they are actually projecting their own internal pain. If you react, you join them in their field of suffering. If you remain non-reactive, you remain in the field of Power, and their 'attack' simply passes through you like a cloud passing through the sky."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="practice-title"
              originalContent="Practice: The 90-Second Reset"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="practice-guide"
            originalContent="1. When triggered, identify the physiological surge (heat, racing heart, tightness).\n2. Don't act or speak. Simply observe the 'fire' of the emotion.\n3. It takes approximately 90 seconds for the biochemical surge of an emotion to flush through your system.\n4. Breathe through these 90 seconds without 'feeding' the emotion with stories or justifications.\n5. Once the surge has passed, re-evaluate: Do I still need to react, or can I now respond with clarity?"
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['power-vs-force', 'effort', 'intention']}
          currentScreenId="non-reactivity"
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
