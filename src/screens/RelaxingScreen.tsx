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
import BodyMindSpiritLayersAnimation from '../components/animations/BodyMindSpiritLayersAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RelaxingScreen() {
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
        <Text style={styles.headerTitle}>Relaxing</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="bed-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="relaxing"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="key-insight"
            originalContent="The body and mind naturally relax the more you let go. Treat tension at all levels: body, mind, and spirit."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <BodyMindSpiritLayersAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="relaxing"
          section="main"
          id="all-levels"
          originalContent="Just as with illnesses, this is general health advice. The more you let go of emotional blocks, the better healing is facilitated by physical treatments."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="relaxing"
          section="main"
          id="all-levels-2"
          originalContent="There is a compound effect of letting go across all levels."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="fitness-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="relaxing"
              section="main"
              id="physical-title"
              originalContent="Body-Mind-Spirit Relaxation"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="relaxing"
            section="main"
            id="physical"
            originalContent="Stretching and massages help tremendously. They support the letting go process by releasing physical tension that holds emotional energy."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="relaxing"
            section="main"
            id="physical-2"
            originalContent="When you combine physical relaxation with emotional letting go, the effects multiply. The body relaxes, which helps the mind relax, which helps the spirit relax."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="relaxing"
              section="main"
              id="practice-insight"
              originalContent="Notice tension in your body. As you let go emotionally, notice how the body naturally relaxes. Support this process with stretching, massage, or any physical practice that helps release tension. The more you let go, the more naturally relaxed you become."
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

