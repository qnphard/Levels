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
import NaturalHappinessAnimation from '../components/animations/NaturalHappinessAnimation';
import AddictionCloudAnimation from '../components/animations/AddictionCloudAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddictionScreen() {
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
        <Text style={styles.headerTitle}>Addiction</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="addiction"
          section="main"
          id="intro"
          originalContent="We are the sky, the clouds are the force-based levels of falsehood, and the sun always shines."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="addiction"
          section="main"
          id="intro-2"
          originalContent="Understanding this metaphor helps us understand addiction."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="warning-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="addiction"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="key-insight"
            originalContent="We are the sky, clouds are force-based levels, sun always shines. Drugs temporarily remove clouds but cheat karmically."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <AddictionCloudAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.warningHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="addiction"
              section="main"
              id="problem-title"
              originalContent="Escaping vs Healing"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="drugs-explanation"
            originalContent="Drugs temporarily remove the 'clouds' (the lower force-based levels). They give us a glimpse of freedom, but this is cheating from a karmical point of view—you didn't take the actual spiritual path of truth."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.warningHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="addiction"
              section="main"
              id="withdrawal-title"
              originalContent="Withdrawal"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="withdrawal"
            originalContent="Withdrawal brings you even lower than before. The clouds return, and they're thicker. The temporary relief is followed by deeper suffering."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="sunny-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="addiction"
              section="main"
              id="freedom-title"
              originalContent="True Freedom"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="addiction"
            section="main"
            id="freedom"
            originalContent="Understanding that we are naturally happy and free allows us to experience that freedom without taking drugs, gambling, escaping, etc."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="addiction"
            section="main"
            id="freedom-2"
            originalContent="When we realize that happiness is our natural state, we don't need to escape from our feelings—we can let them go and return to our natural state."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="addiction"
          section="main"
          id="practice"
          originalContent="The path to freedom from addiction is the same as the path to freedom from any emotional block: understanding your natural state, and letting go of what blocks it."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="addiction"
          section="main"
          id="practice-2"
          originalContent="This is the true path—not escaping, but returning to who you really are."
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

