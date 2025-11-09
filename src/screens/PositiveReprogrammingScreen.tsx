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
import ReprogrammingTransitionAnimation from '../components/animations/ReprogrammingTransitionAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PositiveReprogrammingScreen() {
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
        <Text style={styles.headerTitle}>Positive Re-programming</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="intro"
          originalContent="Letting go of old beliefs is necessary, but it can also be useful to simultaneously replace them with better ones."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="affirmations-intro"
          originalContent="This is where affirmations come into play. Letting go of falsehood, force-based beliefs will make affirmations much more useful and productive."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="positive-reprogramming"
          section="main"
          id="affirmations"
          originalContent="When you've released the old programming, there's space for new, positive programming. Affirmations can then take root and flourish."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ReprogrammingTransitionAnimation autoPlay={true} />
        </View>
        
        <View style={cardStyles.warningCard}>
          <View style={cardStyles.warningHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="forceful-title"
              originalContent="When Affirmations Feel Forceful"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="forceful"
            originalContent="Affirmations can feel forceful if one is too deep into negative beliefs. If you're still holding onto the old programming, trying to force positive thoughts on top of it creates resistance."
          textStyle={cardStyles.warningText}
            type="paragraph"
          />
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="forceful-2"
            originalContent="The old beliefs fight against the new ones, and the affirmations feel like a lie."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="practice-title"
              originalContent="The Key: Let Go, Then Reprogram"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="positive-reprogramming"
            section="main"
            id="practice"
            originalContent="The key is to first let go of the old beliefs, then introduce the new ones. Let go, then reprogram."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="positive-reprogramming"
              section="main"
              id="practice-insight"
              originalContent="This creates a natural flow rather than a forced replacement. When the old is released, the new can settle in effortlessly."
              textStyle={cardStyles.practiceInsightText}
              type="paragraph"
            />
          </View>
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

