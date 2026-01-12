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
import ShadowIlluminationAnimation from '../components/animations/ShadowIlluminationAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShadowWorkScreen() {
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
        <Text style={styles.headerTitle}>Shadow Work</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="moon-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="shadow-work"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="shadow-work"
            section="main"
            id="key-insight"
            originalContent="The ego is not an enemy to be conquered—it is your biological inheritance. Without it, you would not be alive. Understanding its origin brings compassion rather than condemnation."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <ShadowIlluminationAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="shadow-work"
          section="main"
          id="origin-title"
          originalContent="The Animal Within"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="animal-part"
          originalContent="Evolution placed within us an ancient survival mechanism—the ego. In its earliest forms, life had no inner source of energy. Survival depended on acquiring energy externally, establishing the core pattern of self-interest, acquisition, and rivalry that still runs in us today."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="animal-part-2"
          originalContent="This 'animal part' is characterized by curiosity, searching, and learning—but also by seeing others as potential competitors. The prefrontal cortex, seat of human intelligence, initially developed to serve these primitive survival instincts."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="animal-part-3"
          originalContent="When we judge ourselves harshly for having these inherited reactions—anger, fear, jealousy, greed—we add guilt on top of the original feeling. This creates a downward spiral that makes transcendence more difficult, not less."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
          <EditableText
            screen="shadow-work"
            section="main"
            id="warning"
            originalContent="The persistence of the primitive ego in humans is often called the 'narcissistic core.' At lower levels of consciousness, this manifests as self-interest, disregard for others' rights, and seeing others as enemies rather than allies. Recognizing this tendency in yourself is the first step toward transcending it."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="shadow-work"
          section="main"
          id="evolution-title"
          originalContent="The Evolution of Caringness"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="evolution"
          originalContent="As consciousness evolves above level 200, something remarkable happens: life becomes more harmonious. Maternal caring appears, along with concern for others, group loyalty, and cooperation. The shift from predatory to benign marks a fundamental change in how we relate to the world."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="evolution-2"
          originalContent="This is why shadow work is so important: by having compassion for our animal nature rather than condemning it, we create the conditions for evolution. Fighting the ego strengthens it. Accepting it with understanding allows it to be transcended."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="shadow-work"
              section="main"
              id="compassion-title"
              originalContent="The Practice of Self-Compassion"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion-step1"
            originalContent="1. Notice the reaction without acting on it. When anger, fear, jealousy, or greed arises, simply observe: 'This is happening.'"
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion-step2"
            originalContent="2. Recognize its origin. This is your biological inheritance, millions of years of survival programming. The animal part doesn't know any better—it's doing exactly what evolution designed it to do."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion-step3"
            originalContent="3. Offer compassion instead of judgment. 'Of course this reaction is here—I'm human. This is part of being human.' You don't act on it, but you don't add guilt either."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion-step4"
            originalContent="4. Allow the energy to pass. Without the resistance of self-judgment, the feeling naturally moves through you. What you resist persists; what you accept transforms."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.insight} />
          <EditableText
            screen="shadow-work"
            section="main"
            id="insight"
            originalContent="The ego's basic illusion is that it is the source of life itself—that without it, death will occur. But the ego is not the source. When we understand this, we can let go of its demands without fear. The 'dark night of the soul' is actually the dark night of the ego, not the soul."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="shadow-work"
          section="main"
          id="karma-title"
          originalContent="Karma and Self-Forgiveness"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="karma"
          originalContent="Karma is not punishment—it is simply accountability. Positive actions (good will, forgiveness, compassion) can compensate for past negative patterns. Spiritual progress ensues automatically from choosing lovingness as a way of being, rather than viewing it as a transaction."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="karma-2"
          originalContent="Shadow work includes not only this lifetime but forgotten evolutionary aspects as well. Due to human development, even a mature adult still has repressed infantile and childish drives operating out of awareness. The most common is the split between the 'good me' and the 'bad me.'"
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.practiceInsight}>
          <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
          <EditableText
            screen="shadow-work"
            section="main"
            id="practice-insight"
            originalContent="When shame or guilt arises, remember: error is for correction and learning, not condemnation. Self-hatred, when turned outward, becomes aggression toward others. When turned inward, it becomes depression. Compassion for the self naturally extends to compassion for others—they too are struggling with the same inherited programming."
            textStyle={cardStyles.practiceInsightText}
            type="paragraph"
          />
        </View>
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

