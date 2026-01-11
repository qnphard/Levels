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
import HybridAnimation from '../components/animations/HybridAnimation';
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';
import RelatedNextCard from '../components/RelatedNextCard';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PowerVsForceScreen() {
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
        <Text style={styles.headerTitle}>Power vs Force</Text>
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
              screen="power-vs-force"
              section="main"
              id="key-insight-title"
              originalContent="Total Context"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="key-insight"
            originalContent="Force is a movement of the ego; Power is a quality of the Spirit. Force always creates a counter-force, leading to exhaustion. Power creates alignment, leading to peace."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="power-vs-force"
          section="main"
          id="intro"
          originalContent="The world operates mostly on force—the level of 'against'. We fight for peace, we war against drugs, we push our bodies to the limit. Dr. David R. Hawkins observed that force always requires a 'payoff' and eventually 'runs out'. Power, however, is the very energy of life itself."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <HybridAnimation
            animationName="power-vs-force"
            CodeAnimation={PowerVsForceAnimation}
            height={280}
            preferAsset={true}
            autoPlay={true}
          />
        </View>

        <EditableText
          screen="power-vs-force"
          section="main"
          id="force-title"
          originalContent="The Mechanism of Force"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="power-vs-force"
          section="main"
          id="force-desc"
          originalContent="Force is linear. It moves from point A to point B to 'get' something. It is manipulative, demanding, and argumentative. Because force is an attack, it automatically invites defense. This is why when you try to 'force' someone to change, they usually resist you harder."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="comparison-title"
            originalContent="Distinguishing Qualities"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="close-circle-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="power-vs-force"
                  section="main"
                  id="force-qual-title"
                  originalContent="Force (Linear)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="power-vs-force"
                  section="main"
                  id="force-qual"
                  originalContent="Partial, judgmental, arrogant, consumes energy, creates tension, relies on effort."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="heart-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="power-vs-force"
                  section="main"
                  id="power-qual-title"
                  originalContent="Power (Nonlinear)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="power-vs-force"
                  section="main"
                  id="power-qual"
                  originalContent="Whole, compassionate, humble, supplies energy, creates peace, is effortless."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="power-vs-force"
          section="main"
          id="power-title"
          originalContent="The Nature of Power"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="power-vs-force"
          section="main"
          id="power-desc"
          originalContent="Power doesn't do anything; it *is*. It is like the gravity that holds the planets or the sunlight that grows the trees. In human life, power is manifest through Truth. You don't have to defend a true statement—it stands on its own. When you align with Truth, you share in its Power."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="power-vs-force"
              section="main"
              id="trap-title"
              originalContent="The Exhaustion of Force"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="trap-text"
            originalContent="If you feel chronically tired, frustrated, or 'stuck', you are likely using force in some area of your life. You are trying to 'make' things happen rather than 'letting' them happen through alignment with the Higher Will. Force is expensive; Power is free."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="power-vs-force"
              section="main"
              id="insight-title"
              originalContent="The Power of Presence"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="insight-text"
            originalContent="A person who is aligned with the Power of unconditional love (500) has more influence on the collective consciousness than millions of people operating in the force of anger (150). Your inner state is your greatest contribution to the world."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="compass-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="power-vs-force"
              section="main"
              id="practice-title"
              originalContent="Practice: Invoking Power"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="practice-guide"
            originalContent="1. Think of a current problem where you feel you must 'fight' or 'force' a solution.\n2. Notice the tension in your body. This is the physiological signature of Force.\n3. Decide: 'I am willing to let go of the need to control this through force.'\n4. Ask for the context of Power to reveal itself. Ask: 'What is the Truth of this situation?'\n5. Wait for the tension to subside. When it does, you will notice a higher-level solution that requires zero effort."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['effort', 'non-reactivity', 'intention']}
          currentScreenId="power-vs-force"
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
