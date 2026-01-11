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
import AddictionCloudAnimation from '../components/animations/AddictionCloudAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddictionScreen() {
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
        <Text style={styles.headerTitle}>Addiction</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="wine-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="addiction"
              section="main"
              id="key-insight-title"
              originalContent="Seeking the Infinite in the Finite"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="key-insight"
            originalContent="Addiction is not a 'moral failing' but a misguided spiritual search. The addict is seeking the experience of the True Self, but expects a substance or behavior to provide it."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="addiction"
          section="main"
          id="intro"
          originalContent="Imagine that your true nature is the sun, but it is covered by thick, dark clouds of guilt, fear, and hopelessness. You find that a substance or an activity (drugs, alcohol, gambling, overeating) can temporarily blow the clouds away. For a moment, you see the sun. This is the 'high'."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <AddictionCloudAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="addiction"
          section="main"
          id="cheating-title"
          originalContent="Karmic Cheating"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="addiction"
          section="main"
          id="drugs-explanation"
          originalContent="Substances remove the clouds artificially. From a karmic perspective, this is 'cheating'. You are experiencing a high level of consciousness without having done the internal work to reach it. Consequently, the clouds return even thicker than before, leading to the agony of withdrawal and deeper depression. You are borrowing from your future life force."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="flash-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="addiction"
              section="main"
              id="power-shift-title"
              originalContent="Field Recovery"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="power-shift-text"
            originalContent="Recovery is not just about stopping a behavior; it is about shifting the entire field of consciousness. When an addict moves from Level 125 (Desire) to Level 200 (Courage) and eventually Level 500 (Love), the craving simply ceases to exist. The energy of the new field is stronger than the memory of the old 'high'."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="addiction"
              section="main"
              id="mechanism-title"
              originalContent="The Craving Loop"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="mechanism-text"
            originalContent="Addiction is fueled by the level of Desire (125). The focus becomes the *craving* itself. The mind becomes convinced that it *must* have the object of desire to survive. This is the ego's ultimate trap, as the object can never provide the permanent peace that is being sought."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="addiction"
          section="main"
          id="recovery-title"
          originalContent="The Path of Recovery"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="addiction"
          section="main"
          id="recovery-desc"
          originalContent="True freedom comes from realizing that the 'sun' (happiness/peace) is already your natural state. You don't need a substance to find it; you only need to let go of the clouds that are blocking it. Recovery is the process of learning to deal with life's 'clouds' without trying to escape them."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="addiction"
            section="main"
            id="comparison-title"
            originalContent="Escaping vs. Surrendering"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="exit-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="addiction"
                  section="main"
                  id="escaping-title"
                  originalContent="Escaping (Addiction)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="addiction"
                  section="main"
                  id="escaping-desc"
                  originalContent="Running away from pain. Temporary relief followed by intensified suffering. Drains power."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="key-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="addiction"
                  section="main"
                  id="surrender-title"
                  originalContent="Surrendering (Freedom)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="addiction"
                  section="main"
                  id="surrender-desc"
                  originalContent="Going through the pain and letting it go. Permanent transformation. Restores power."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="addiction"
              section="main"
              id="insight-title"
              originalContent="AA and the Power of 500"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="insight-text"
            originalContent="The 12-Step programs (like AA) are effective because they move the individual from the level of Desire (125) and Hopelessness (50) to the level of Love and Service (500+). By surrendering to a 'Higher Power', the addict connects to a field of energy that is stronger than their egoic craving."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="addiction"
              section="main"
              id="practice-title"
              originalContent="Practice: Witnessing the Craving"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="practice-guide"
            originalContent="1. When a craving (for food, substances, or even a mental habit) arises, don't resist it.\n2. Observe it as a 'packet' of energy moving through your body. Where do you feel it?\n3. Realize: 'I am the one witnessing this craving; I am not the craving itself.'\n4. Instead of wanting to satisfy the craving, want to *be free* of the craving. Surrender the 'wanting' itself.\n5. Wait. Every craving eventually reaches its peak and subsides. Let it pass through you without acting on it."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['loss-and-abandonment', 'letting-go', 'what-you-really-are']}
          currentScreenId="addiction"
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
