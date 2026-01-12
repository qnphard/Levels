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
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import BodyMindSpiritLayersAnimation from '../components/animations/BodyMindSpiritLayersAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';
import FluidBreathing from '../components/FluidBreathing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RelaxingScreen() {
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
        <Text style={styles.headerTitle}>Relaxing</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bed-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="relaxing"
              section="main"
              id="key-insight-title"
              originalContent="Total Relaxation"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="key-insight"
            originalContent="Relaxation is not just a vacation for the body, but a state of non-intentionality for the mind. It is the suspension of all efforts to change or control the world."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="relaxing"
          section="main"
          id="intro"
          originalContent="True relaxation is a quality of the level of Neutrality (250) and above. Below this level, even when the body is still, the mind is often racing with 'Force-based' desires. To truly relax, we must address the Body, the Mind, and the Spirit simultaneously."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <BodyMindSpiritLayersAnimation autoPlay={true} />
        </View>

        <View style={styles.breathingContainer}>
          <Text style={styles.breathingTitle}>Active Practice: Fluid Breathing</Text>
          <Text style={styles.breathingSubtitle}>Sync your breath with the expanding light</Text>
          <FluidBreathing />
        </View>

        <EditableText
          screen="relaxing"
          section="main"
          id="body-level-title"
          originalContent="The Physical Level"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="relaxing"
          section="main"
          id="body-desc"
          originalContent="While stretching and massage are beneficial, physical relaxation is mostly a byproduct of letting go of inner pressure. When the emotional fuel (Fear, Anger) is removed, the muscles no longer have a reason to stay tight. The body is the faithful mirror of your inner state."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="relaxing"
              section="main"
              id="mental-trap-title"
              originalContent="The Trap of 'Trying' to Relax"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="mental-trap-text"
            originalContent="Most people 'try' to relax, which is a contradiction. The ego uses Force even in its spiritual practices. If you are 'working hard' to be calm, you are actually creating more tension. Relaxation is a 'letting' rather than a 'doing'."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="relaxing"
          section="main"
          id="spirit-level-title"
          originalContent="The Spiritual Level"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="relaxing"
          section="main"
          id="spirit-desc"
          originalContent="Spiritual relaxation is the realization that 'I am not the doer'. It is the surrender of the personal will to the Divine Will. When you trust the evolution of life, the need to manage every detail disappear. You rest in the Presence of God."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="relaxing"
              section="main"
              id="insight-title"
              originalContent="Silence is the Goal"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="insight-text"
            originalContent="The deepest relaxation is found in the silence of the Self. When the mind stops its constant theater of 'what if', you discover a peace that 'surpasseth all understanding'. This peace is your natural state; you only need to stop obstructing it with your noise."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="relaxing"
              section="main"
              id="practice-title"
              originalContent="Practice: Suspending Intention"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="practice-guide"
            originalContent="1. Lay down comfortably and close your eyes.\n2. Notice any part of you that is 'trying'—trying to relax, trying to be a good person, trying to figure something out.\n3. Decide: 'For the next five minutes, I have zero intentions. I want nothing to happen.'\n4. If a thought arises, simply let it pass by without picking it up. Don't even try to 'stop' the thoughts.\n5. Feel the weight of your body as a gift to the Earth. Become the silent observer of the rising and falling of your breath."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['tension', 'mantras', 'fatigue-vs-energy']}
          currentScreenId="relaxing"
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
    breathingContainer: {
      backgroundColor: 'rgba(139, 92, 246, 0.05)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      marginVertical: spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.1)',
    },
    breathingTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.primary,
      marginBottom: spacing.xs,
    },
    breathingSubtitle: {
      fontSize: typography.small,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
  });
