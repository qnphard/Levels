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
import DesireBlackHoleAnimation from '../components/animations/DesireBlackHoleAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FulfillmentVsSatisfactionScreen() {
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
        <Text style={styles.headerTitle}>Fulfillment vs Satisfaction</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="fulfillment-vs-satisfaction"
              section="main"
              id="intro-title"
              originalContent="The Trap of Desire"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="key-insight"
            originalContent="The seeking of happiness in the world is like a man running after a mirage: he runs and runs, but the destination always remains just out of reach."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="intro"
          originalContent="Desire is a black hole of the ego. Since desire is force-based (calibrating at 125, below the critical level of 200), it can only consume; it can never fill. The more you feed it, the more voracious it becomes."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <DesireBlackHoleAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="nature-of-satisfaction-title"
          originalContent="The Nature of Satisfaction"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="satisfaction-desc"
          originalContent="Satisfaction is a 'gain-seeking' transaction. It is temporary, external, and precarious. When you get what you want, you experience a momentary 'high'—not because the object is inherently happy, but because the pressure of desire for that object has temporarily stopped."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="satisfaction-desc-2"
          originalContent="But within moments, the 'desire-machine' resets, and a new 'want' takes its place. This is the wheel of Samsara—the endless cycle of wanting, getting, and wanting more. The ego needs the chase more than the prize."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="fulfillment-vs-satisfaction"
              section="main"
              id="unlimited-title"
              originalContent="Fulfillment is Nonlinear"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="unlimited-text"
            originalContent="Fulfillment (associated with levels 540+) does not increase by 'getting' more; it increases by 'removing' more. It is the experience of the Self as being inherently complete. In this state, external things are enjoyed, but they are no longer required."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="comparison-title"
            originalContent="The Fundamental Shift"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="cart-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="satisfaction-header"
                  originalContent="Satisfaction (Getting)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="satisfaction-point"
                  originalContent="Dependent on external results. Fragile and easily lost. Always creates the fear of loss."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="sunny-outline" size={18} color={CARD_COLORS.practice} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="fulfillment-header"
                  originalContent="Fulfillment (Being)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="fulfillment-point"
                  originalContent="Internal and autonomous. It is the natural state of consciousness when blocks are removed."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="natural-state-title"
          originalContent="Happiness is Your Natural State"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="blocks-desc"
          originalContent="Fulfillment isn't something you achieve; it's what's left when you let go of the pressure of 'wanting'. We are already naturally full and happy. The constant search for satisfaction is the very thing that clouds our natural fulfillment."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="diamond-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="fulfillment-vs-satisfaction"
              section="main"
              id="insight-title"
              originalContent="The Precious Diamond"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="insight-text"
            originalContent="Imagine fulfillment as a diamond that has been covered in mud (emotional blocks). You don't need to 'buy' a diamond; you just need to wash away the mud. As you let go of desire, the natural radiance of Joy (level 540) begins to shine through of itself."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="fulfillment-vs-satisfaction"
              section="main"
              id="practice-title"
              originalContent="Practice: Desiring Less, Being More"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="practice-guide"
            originalContent="1. When a strong desire arises, look at the *pressure* of the wanting itself, rather than the object of desire.\n2. Ask: 'Can I permit myself to be fulfilled *without* this thing?'\n3. Realize that the happiness you're seeking in the object is actually the happiness of the *absence* of the desire for it.\n4. Surrender the wanting. Find the peace that is already here in the present moment."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['natural-happiness', 'addiction', 'letting-go']}
          currentScreenId="fulfillment-vs-satisfaction"
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
