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
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

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
        <EditableText
          screen="natural-happiness"
          section="main"
          id="intro"
          originalContent="We are naturally happy and free. This is our true nature, our birthright."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="natural-happiness"
          section="main"
          id="intro-2"
          originalContent="The levels of consciousness below 200 (falsehood) are not who we are—they are spiritual and emotional blocks that keep us from experiencing our natural state."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <NaturalHappinessAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="sunny-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="sky-metaphor-title"
              originalContent="The Sky and Clouds Metaphor"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="sky-metaphor"
            originalContent="Think of it this way: We are the sky—vast, open, and always present. The sun always shines—happiness is our natural state."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="natural-happiness"
            section="main"
            id="sky-metaphor-2"
            originalContent="The clouds are the emotional blocks (fear, anger, grief, etc.) that temporarily block the sun. But just as clouds pass, these emotional states are temporary. The sky remains, and the sun continues to shine."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="natural-happiness"
          section="main"
          id="blocks-explanation"
          originalContent="All the levels below 200 represent falsehood—they are the spiritual and emotional blocks that actually keep us on a leash."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="natural-happiness"
          section="main"
          id="blocks-explanation-2"
          originalContent="They make us believe we need something external to be happy, that we are incomplete, that we must struggle. But this is not true. We are complete, whole, and naturally happy."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bulb-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="natural-happiness"
              section="main"
              id="realization-title"
              originalContent="The Realization"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="realization"
            originalContent="When we understand that we are naturally happy, we stop looking for happiness in external things. We stop believing that we need to achieve something, acquire something, or become something to be happy."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="natural-happiness"
            section="main"
            id="realization-2"
            originalContent="Happiness is not something we get—it's something we already are, once we remove the blocks."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.quoteCard}>
          <EditableText
            screen="natural-happiness"
            section="main"
            id="quote"
            originalContent="'The kingdom of heaven is within you.' - Jesus Christ. Happiness is not something to be found—it's something to be uncovered by removing the clouds of emotional blocks."
            textStyle={cardStyles.quoteText}
            type="quote"
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

