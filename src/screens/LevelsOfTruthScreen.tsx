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
import LevelsOfTruthAnimation from '../components/animations/LevelsOfTruthAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LevelsOfTruthScreen() {
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
        <Text style={styles.headerTitle}>Levels of Truth</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="levels-of-truth"
              section="main"
              id="key-insight-title"
              originalContent="Truth is Relative to Consciousness Level"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="levels-of-truth"
            id="intro"
            section="main"
            originalContent="Truth is subjective and context-dependent. The levels of truth do not necessarily always agree with one another, and this is important to understand."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <LevelsOfTruthAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="context-dependent"
          originalContent="What is true at one level of consciousness may not be true at another. What is true in one context may not be true in another."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="context-dependent-2"
          originalContent="This doesn't mean that one is right and the other is wrong—it means that truth is relative to the level of consciousness from which it's perceived."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="different-paths-title"
            originalContent="Different Paths"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="different-paths"
            originalContent="Depending on the context, one may choose a different path, and that does not necessarily mean that path is wrong. What works for one person at their level of consciousness may not work for another at a different level."
            textStyle={cardStyles.comparisonText}
            type="paragraph"
          />
          <EditableText
            screen="levels-of-truth"
            section="main"
            id="different-paths-2"
            originalContent="This is why there are so many valid spiritual paths and teachings—they speak to different levels of understanding."
            textStyle={cardStyles.comparisonNote}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="compassion"
          originalContent="Understanding this helps us have compassion for others who may see things differently. It helps us avoid the trap of thinking our way is the only way."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="levels-of-truth"
          section="main"
          id="compassion-2"
          originalContent="Truth evolves as consciousness evolves, and what we understand as true today may deepen tomorrow."
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

