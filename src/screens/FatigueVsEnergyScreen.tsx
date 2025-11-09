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
import EnergyLeakAnimation from '../components/animations/EnergyLeakAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FatigueVsEnergyScreen() {
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
        <Text style={styles.headerTitle}>Fatigue vs Energy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="intro"
          originalContent="We are naturally very energetic and happy. This is our true nature."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="intro-2"
          originalContent="Yet many of us experience fatigue, tiredness, and low energy. Why is this?"
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="battery-dead-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="energy-leak-title"
              originalContent="We Leak Energy Through Blocks"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="energy-leak"
            originalContent="We leak energy throughout the day because of all the emotional and spiritual blocks we carry. These blocks are defined by the force-based levels of falsehood (below consciousness level 200)."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="energy-leak-2"
            originalContent="Every suppressed emotion, every repressed feeling, every unresolved conflict drains our energy."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <EnergyLeakAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="weight-of-emotions"
          originalContent="We carry the weight of all the emotions we've repressed and suppressed during our lifetime. This weight doesn't just disappear—it sits in our energy system, blocking the natural flow of energy."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="fatigue-vs-energy"
          section="main"
          id="weight-of-emotions-2"
          originalContent="It's like carrying a heavy backpack everywhere you go. No wonder we feel tired!"
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="battery-charging-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="solution-title"
              originalContent="The Solution: Reclaim Your Energy"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="solution"
            originalContent="Releasing and letting go of these emotional blocks makes us more energetic and joyful. As we let go of suppressed emotions, the energy that was tied up in them becomes available to us."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="fatigue-vs-energy"
            section="main"
            id="solution-2"
            originalContent="We feel lighter, more alive, and more capable. The fatigue lifts, and our natural energy returns."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="fatigue-vs-energy"
              section="main"
              id="practice-insight"
              originalContent="Practices like letting go, meditation, and emotional release are powerful because they're about reclaiming your natural energy and vitality. When you let go of the blocks, you let go of the fatigue."
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

