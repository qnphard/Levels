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
import KnowledgeVsPracticeAnimation from '../components/animations/KnowledgeVsPracticeAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function KnowledgeScreen() {
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
        <Text style={styles.headerTitle}>Knowledge</Text>
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
              screen="knowledge"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="intro"
            originalContent="Knowledge is only good if you apply it. It's important to accumulate knowledge over a long period of time and familiarize yourself with concepts, but it comes a time when practice makes the difference."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <KnowledgeVsPracticeAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="knowledge"
          section="main"
          id="accumulation"
          originalContent="There's value in learning, reading, and understanding concepts. Knowledge gives us a map, a framework for understanding."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="knowledge"
          section="main"
          id="accumulation-2"
          originalContent="But knowledge alone is not enough. You can know everything about swimming, but until you get in the water, you haven't really learned to swim."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="knowledge"
            section="main"
            id="comparison-title"
            originalContent="Knowledge vs Wisdom"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="book-outline" size={18} color={CARD_COLORS.keyInsight} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="knowledge-title"
                  originalContent="Knowledge"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="knowledge-desc"
                  originalContent="Accumulates over time. Gives us a map and framework. But knowledge alone is not enough."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="sparkles-outline" size={18} color={CARD_COLORS.practice} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="wisdom-title"
                  originalContent="Wisdom"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="knowledge"
                  section="main"
                  id="wisdom-desc"
                  originalContent="Comes through practice. Transforms knowledge into understanding. Bridges the gap between knowing and realizing."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="knowledge"
              section="main"
              id="practice-title"
              originalContent="Practice Makes the Difference"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="knowledge"
            section="main"
            id="practice"
            originalContent="At some point, you must move from knowing to doing. Practice is what transforms knowledge into wisdom."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="knowledge"
            section="main"
            id="practice-2"
            originalContent="Reading about letting go is different from actually letting go. Understanding concepts is different from experiencing them. Practice bridges the gap between knowledge and realization."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="knowledge"
          section="main"
          id="balance"
          originalContent="Balance learning with practice. Read, study, understand—but then apply what you've learned. Let knowledge inform your practice, and let practice deepen your understanding. This is how knowledge becomes wisdom."
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

