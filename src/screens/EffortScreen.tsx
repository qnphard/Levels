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
import ResistanceFlowAnimation from '../components/animations/ResistanceFlowAnimation';
import RelatedNextCard from '../components/RelatedNextCard';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EffortScreen() {
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
        <Text style={styles.headerTitle}>Effort</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="flash-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="effort"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="key-insight"
            originalContent="Human effort is necessary only to learn that human effort is useless. Real power is not something you 'do', but something you allow."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="effort"
          section="main"
          id="intro"
          originalContent="When you realize this truth, the frantic pushing of the ego ceases and the Divine Will starts its work within you. You begin to move with the freedom of the soul, liberated from the heavy burden of care, fear, and sorrow."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ResistanceFlowAnimation />
        </View>

        <EditableText
          screen="effort"
          section="main"
          id="will-title"
          originalContent="The Invitation of Will"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="effort"
          section="main"
          id="will-description"
          originalContent="In spiritual work, the human 'will' is the most critical function. It is not used to 'force' change, but as an invitation. The will is the opening through which Divine intervention occurs. We don't make ourselves better; we 'will' to be open to the Grace that makes us better."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="effort"
            section="main"
            id="power-vs-force-title"
            originalContent="The Dynamics of Energy"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="water-outline" size={18} color={CARD_COLORS.power} />
              <EditableText
                screen="effort"
                section="main"
                id="power-text"
                originalContent="Power: Alignment with truth. It is effortless, like a river flowing to the sea."
                textStyle={cardStyles.comparisonText}
                type="paragraph"
              />
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="barbell-outline" size={18} color={CARD_COLORS.force} />
              <EditableText
                screen="effort"
                section="main"
                id="force-text"
                originalContent="Force: Egoic pushing. It is exhaustive, partial, and always meets resistance."
                textStyle={cardStyles.comparisonText}
                type="paragraph"
              />
            </View>
          </View>
        </View>

        <EditableText
          screen="effort"
          section="main"
          id="paradox-title"
          originalContent="The Great Paradox"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="effort"
          section="main"
          id="paradox-desc"
          originalContent="The ultimate trap of the student is to believe that they are the 'doer' of their own evolution. This belief is the final toehold of the ego. It fights for survival by convincing you that without its 'effort', nothing will happen. In reality, your only 'work' is to remove the obstacles to the awareness of the Truth that is already present."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="effort"
              section="main"
              id="insight-title"
              originalContent="Surrender of the 'Doer'"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="insight-text"
            originalContent="The 'I' that thinks it is making the effort is exactly what needs to be surrendered. When the 'doer' dissolves, the action happens of itself. This is the state of 'Wu Wei' or non-action, where everything is accomplished without trying."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="effort"
              section="main"
              id="practice-title"
              originalContent="Practice: Releasing the Grip"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="practice-guide"
            originalContent="1. Notice the 'tightness' in your mind or body that says 'I must make this happen.'\n2. Realize this tightness is resistance—it is actually blocking the very power you seek.\n3. Ask: 'Can I permit the will of God to handle this instead?'\n4. Feel the physical shift as you step back from being the 'producer' and become the 'witness' to the unfolding."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="effort"
              section="main"
              id="practice-insight"
              originalContent="Truth is self-evident once the clouds of effortful 'knowing' are removed."
              textStyle={cardStyles.practiceInsightText}
              type="paragraph"
            />
          </View>
        </View>

        <RelatedNextCard
          relatedIds={['power-vs-force', 'intention', 'non-reactivity']}
          currentScreenId="effort"
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
