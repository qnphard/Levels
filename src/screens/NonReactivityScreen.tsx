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
import ReactionVsPowerAnimation from '../components/animations/ReactionVsPowerAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NonReactivityScreen() {
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
        <Text style={styles.headerTitle}>Non Reactivity</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="pause-circle-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="key-insight"
            originalContent="Letting go of wanting to express anger makes us non-reactive. We act from power, not reaction."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <ReactionVsPowerAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="comparison-title"
            originalContent="Reaction vs Power"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="remove-circle-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="reaction-text"
                  originalContent="Reaction: You are the effect"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="reaction-desc"
                  originalContent="Once we react, we give our power away and are controlled by external circumstances."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="flash-outline" size={18} color={CARD_COLORS.power} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="power-text"
                  originalContent="Power: You are the source"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="non-reactivity"
                  section="main"
                  id="power-desc"
                  originalContent="We act from our center, from truth, from alignment—responding from our true nature."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="non-reactivity"
          section="main"
          id="reacting"
          originalContent="Once we react to something, we are the effect of it and we give our power away. When we react, we're being controlled by external circumstances."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="source-title"
              originalContent="We Are the Source"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="source"
            originalContent="We are the source, not the effect. When we operate from power, we act from our center, from truth, from alignment."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="non-reactivity"
            section="main"
            id="source-2"
            originalContent="We're not reacting to what happens—we're responding from our true nature. This is the difference between being reactive (effect) and being responsive (source)."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="non-reactivity"
              section="main"
              id="practice-title"
              originalContent="Practice Non-Reactivity"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="non-reactivity"
            section="main"
            id="practice"
            originalContent="Practice noticing when you're reacting. When you feel the urge to react, pause. Let go of wanting to express the reaction."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="non-reactivity"
            section="main"
            id="practice-2"
            originalContent="Instead, act from your center, from truth, from power. This doesn't mean you don't take action—it means you act from alignment rather than from reaction."
            textStyle={cardStyles.practiceText}
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

