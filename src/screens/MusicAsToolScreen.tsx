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
import MusicVibrationAnimation from '../components/animations/MusicVibrationAnimation';
import RelatedNextCard from '../components/RelatedNextCard';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MusicAsToolScreen() {
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
        <Text style={styles.headerTitle}>Music as a Tool</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="musical-notes-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="music-as-tool"
              section="main"
              id="key-insight-title"
              originalContent="Vibrational Resonance"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="key-insight"
            originalContent="Music is a direct expression of the field of consciousness from which it was created. It bypasses the logical mind and acts directly upon the emotional body."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="music-as-tool"
          section="main"
          id="intro"
          originalContent="Everything in the universe has a frequency, and music is one of the most powerful ways to shift your own frequency. The intention of the composer, the performers, and the lyrical content all combine to create a field that you 'step into' whenever you listen."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <MusicVibrationAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="music-as-tool"
          section="main"
          id="selection-title"
          originalContent="The Law of Attraction"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="music-as-tool"
          section="main"
          id="attraction-desc"
          originalContent="We typically listen to music that resonates with our current emotional state. If we are angry, we seek angry music; if we are sad, we seek melancholic music. This provides 'validation' for the ego, but it also traps us in that specific energy field."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="music-as-tool"
              section="main"
              id="sedative-music-title"
              originalContent="Force-Based Music"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="sedative-music"
            originalContent="Music that focuses on victimhood, resentment, or aggression calibrates below 200. While it may feel 'empowering' (moving from Grief to Anger), it is ultimately a drain on your life force. It is the energetic equivalent of a 'cheap thrill' that leaves you depleted afterward."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="music-as-tool"
          section="main"
          id="elevating-title"
          originalContent="Elevating with the Classics"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="music-as-tool"
          section="main"
          id="classics-desc"
          originalContent="The works of composers like Bach, Mozart, Beethoven, and Brahms calibrate exceptionally high (often 400s and 500s). This music was often written as an act of devotion or a direct channeling of the Divine. Listening to it literally 'tows' your consciousness into a higher state of alignment and peace."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="flash-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="music-as-tool"
              section="main"
              id="solfeggio-title"
              originalContent="Solfeggio and 432Hz"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="solfeggio-desc"
            originalContent="While modern music often uses the standardized 440Hz tuning, ancient scales and frequencies like 432Hz are said to be in mathematical resonance with the universe. 528Hz is known as the 'Love frequency'. These tones bypass the ego and act directly on the nervous system to promote healing and coherence."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="comparison-title"
            originalContent="Choosing Your Field"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="trending-down-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="music-as-tool"
                  section="main"
                  id="lower-vibe-title"
                  originalContent="Entrainment with Lower States"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="music-as-tool"
                  section="main"
                  id="lower-vibe"
                  originalContent="Lyrics about pain, betrayal, and struggle. Dissonant or repetitive, jarring rhythms. Reinforces the ego's story."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="trending-up-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="music-as-tool"
                  section="main"
                  id="higher-vibe-title"
                  originalContent="Entrainment with Higher States"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="music-as-tool"
                  section="main"
                  id="higher-vibe"
                  originalContent="Harmonious complex structures. Inspiring or meditative themes. Uplifts the spirit without effort."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="headset-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="music-as-tool"
              section="main"
              id="insight-title"
              originalContent="Music as Medicine"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="insight-text"
            originalContent="You can use music as a 'conscious prescription'. When feeling anxious, choose the 432Hz Solfeggio frequencies or Mozart. When feeling low energy, choose Vivaldi or Bach's Brandenburg Concertos. Let the music do the work for you."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="radio-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="music-as-tool"
              section="main"
              id="practice-title"
              originalContent="Practice: The Five-Minute Lift"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="practice-guide"
            originalContent="1. Pick a piece of music known to calibrate high (e.g., Mozart's Piano Concerto No. 21).\n2. Sit or lie down in a quiet space.\n3. Don't listen with your 'ears' only; listen with your whole body.\n4. Close your eyes and notice where in your body the music is 'hitting'.\n5. Simply permit the music's frequency to wash over your field, intending to align with its beauty."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['intention', 'relaxing', 'fatigue-vs-energy']}
          currentScreenId="music-as-tool"
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
