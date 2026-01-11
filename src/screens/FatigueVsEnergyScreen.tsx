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
import EnergyLeakAnimation from '../components/animations/EnergyLeakAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FatigueVsEnergyScreen() {
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
        <Text style={styles.headerTitle}>Fatigue vs Energy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="battery-dead-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="key-insight-title"
              originalContent="Fatigue is a Leak, Not a Lack"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="key-insight"
            originalContent="You don't lack energy; you are leaking it. Fatigue is the physical result of holding onto emotional resistance and negativity."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="intro"
          originalContent="The energy of life is infinite and always available. In your natural state, you are vibrant, vital, and tireless. Chronic fatigue is often simply the bypass or suppression of powerful emotional 'packets' that are draining your life force."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <EnergyLeakAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="physiology-title"
          originalContent="The Heavy Burden of the Unseen"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="weight-of-emotions"
          originalContent="Every suppressed emotion operates like a running program in the background of a computer, consuming processing power and battery life. We carry a 'heavy backpack' of unresolved fear, anger, and guilt that we've accumulated over a lifetime."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="weight-of-emotions-2"
          originalContent="It takes an enormous amount of metabolic energy to keep these emotions pushed down. This is why you can wake up tired after 8 hours of sleep—your mind was busy 'holding' all night."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="stress-title"
              originalContent="Stress Reactivity"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="stress-text"
            originalContent="Chronic stress is the result of the body being constantly triggered by the lower energy fields (below 200). Force-based living keeps the nervous system in a state of 'high alert', eventually leading to burnout and illness."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="vitality-title"
          originalContent="Restoring Natural Vitality"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="vitality-desc"
          originalContent="When a major emotional block is surrendered, people often report an immediate and massive surge of physical energy. The body, freed from the 'work' of suppression, returns to its natural state of health and vigor. It's like a dam breaking, allowing the river of life to flow freely again."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="leaf-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="metabolic-title"
              originalContent="Metabolic Efficiency"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="metabolic-text"
            originalContent="Suppressed emotions don't just sit there; they vibrate at a low frequency that the body must constantly counteract with its own metabolic resources. By letting go, you aren't 'getting' energy from the outside; you are simply stopping the internal drain. Your body's natural healing systems then have the resources they need to function optimally."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="flash-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="insight-title"
              originalContent="Power vs. Force Energy"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="insight"
            originalContent="Force-based activity (Pride, Anger, Desire) is exhausting and requires constant 'refueling' from external sources. Power-based activity (Love, Joy, Peace) is self-sustaining and actually gives you more energy the more you use it."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="battery-charging-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="practice-title"
              originalContent="Practice: Plugging the Leaks"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="practice-guide"
            originalContent="1. Throughout the day, ask: 'Is there a tightness I'm holding right now?' (Check shoulders, jaw, stomach).\n2. Realize that this tightness is a literal waste of energy.\n3. Consciously permit that specific area to drop and relax. 'I don't need to hold this.'\n4. As you let go of the physical holding, look for the emotional 'packet' behind it and surrender that too."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="practice-insight"
              originalContent="The body follows the mind. A light mind results in a light, energetic body."
              textStyle={cardStyles.practiceInsightText}
              type="paragraph"
            />
          </View>
        </View>

        <RelatedNextCard
          relatedIds={['tension', 'relaxing', 'preventing-stress']}
          currentScreenId="fatigue-vs-energy"
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
