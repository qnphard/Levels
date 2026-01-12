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
import NaturalHappinessAnimation from '../components/animations/NaturalHappinessAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NaturalHappinessScreen() {
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
        <Text style={styles.headerTitle}>Natural Happiness</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="sunny-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="key-insight-title"
              originalContent="Happiness is Not a Goal"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="key-insight"
            originalContent="You don't 'achieve' happiness; you uncover it. It is the natural, underlying state of consciousness that is revealed whenever negativity is surrendered."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="natural-happiness"
          section="main"
          id="intro"
          originalContent="We spend our lives chasing happiness as if it were a rare trophy located somewhere in the future. But happiness is not a quality of objects or achievements. It is a quality of the Self. It is already here, now, waiting to be noticed."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <NaturalHappinessAnimation />
        </View>

        <EditableText
          screen="natural-happiness"
          section="main"
          id="sun-title"
          originalContent="The Sky and the Sun"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="natural-happiness"
          section="main"
          id="sky-metaphor"
          originalContent="Think of your True Self as the vast, blue sky. The sun, which represents Joy and Peace, is always shining in that sky. The different levels of consciousness (Feelings) are like clouds. Dark clouds of Grief, Fear, or Anger can block your view of the sun, but they can never 'extinguish' it."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="natural-happiness"
          section="main"
          id="sky-metaphor-2"
          originalContent="When you let go of a feeling, a cloud dissipates. Suddenly, the sun's light is felt again. You didn't 'create' the light; you simply removed what was blocking it. This is why spiritual growth feels like 'coming home'."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="false-search-title"
              originalContent="The False Search"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="false-search-text"
            originalContent="The ego believes that happiness is 'out there' in a better job, a perfect partner, or more money. This belief keeps you on a leash, eternally searching and eternally disappointed. Even when the ego 'gets' what it wants, the happiness is fragile because it's dependent on the external staying the same."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="natural-happiness"
          section="main"
          id="joy-title"
          originalContent="Joy: The Level of 540"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="natural-happiness"
          section="main"
          id="joy-desc"
          originalContent="As you consistently let go of the lower energy fields, you eventually reach the level of Joy (540). Here, happiness becomes internal and autonomous. It no longer needs a 'reason' to exist. You are happy because your connection to the Source of life is finally unobstructed."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="sparkles-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="insight-title"
              originalContent="Joy (540) vs Pleasure"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="insight-text"
            originalContent="Pleasure is linear; it has a beginning and an end, and it always requires a 'trigger' (like eating or winning). Joy is nonlinear; it is an internal radiating frequency that needs no reason. When you let go of the ego's need to 'get', the self-born Joy of the Spirit shines through."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="search-title"
            originalContent="The Search for the Searcher"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <EditableText
            screen="natural-happiness"
            section="main"
            id="search-desc"
            originalContent="The reason you haven't 'found' happiness is that you are trying to find it with the very part of you that is blocking it—the ego. Stop fixing the person, and start being the Presence. The Presence is already happy."
            textStyle={cardStyles.paragraph}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="practice-title"
              originalContent="Practice: Finding the Sun"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="practice-guide"
            originalContent="1. When you feel unhappy, stop trying to change the situation or your thoughts.\n2. Close your eyes and look *behind* the unhappy feeling. Ask: 'Where is the Presence that is aware of this unhappiness?'\n3. Notice that the Presence itself is not unhappy. It is calm, silent, and steady.\n4. Shift your focus from the 'cloud' (the feeling) to the 'sky' (the Presence).\n5. Permit the feeling to be there without resisting it, while simultaneously resting in the steady peace of your own being."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['what-you-really-are', 'fulfillment-vs-satisfaction', 'addiction']}
          currentScreenId="natural-happiness"
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
