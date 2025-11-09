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
import ShadowIlluminationAnimation from '../components/animations/ShadowIlluminationAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShadowWorkScreen() {
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
        <Text style={styles.headerTitle}>Shadow Work</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="moon-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="shadow-work"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="shadow-work"
            section="main"
            id="key-insight"
            originalContent="Judging yourself for humanness reinforces guilt. Accepting your humanness allows healing through compassion."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <ShadowIlluminationAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="shadow-work"
          section="main"
          id="animal-part"
          originalContent="We have an animal part that doesn't know any better—our biological inheritance."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="shadow-work"
          section="main"
          id="animal-part-2"
          originalContent="When we judge ourselves for having these reactions, we create more guilt and suffering."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="heart-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="shadow-work"
              section="main"
              id="compassion-title"
              originalContent="Healing Through Compassion"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion"
            originalContent="Heal through compassion for the animal part that doesn't know any better. Instead of judging yourself for having human reactions, have compassion."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="shadow-work"
            section="main"
            id="compassion-2"
            originalContent="The animal part is innocent—it's just doing what it's programmed to do. When we have compassion for ourselves, the guilt dissolves and healing can occur."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="shadow-work"
              section="main"
              id="practice-insight"
              originalContent="When you notice yourself having a human reaction—anger, fear, jealousy, etc.—instead of judging it, have compassion. 'Of course I'm having this reaction—I'm human, and this is part of being human.' This doesn't mean you act on it, but you don't add guilt on top of it either."
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

