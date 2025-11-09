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
import DesireBlackHoleAnimation from '../components/animations/DesireBlackHoleAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

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
              originalContent="Desire is a Black Hole"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="intro"
            originalContent="Desire can never be satisfied—it's like a black hole. Since desire is force-based (operating below consciousness level 200), it consumes but never fills."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="intro-2"
            originalContent="The more you feed it, the more it wants."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <DesireBlackHoleAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="fulfillment-vs-satisfaction"
            section="main"
            id="comparison-title"
            originalContent="Satisfaction vs Fulfillment"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="time-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="satisfaction-title"
                  originalContent="Satisfaction"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="satisfaction"
                  originalContent="Temporary. When we get what we want, we feel satisfied for a moment, but soon another desire arises. Satisfaction is always followed by wanting more."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="infinite-outline" size={18} color={CARD_COLORS.practice} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="fulfillment-title"
                  originalContent="Fulfillment"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="fulfillment-vs-satisfaction"
                  section="main"
                  id="fulfillment"
                  originalContent="Forever. Happiness comes from within by releasing emotional and spiritual blocks. Fulfillment doesn't come from getting—it comes from being."
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
          id="practice"
          originalContent="The path to fulfillment is not about acquiring more—it's about letting go of the blocks that prevent us from experiencing what we already are."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="fulfillment-vs-satisfaction"
          section="main"
          id="practice-2"
          originalContent="When we release the emotional blocks, fulfillment naturally arises. It's not something we get—it's something we uncover."
          textStyle={cardStyles.paragraph}
          type="paragraph"
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

