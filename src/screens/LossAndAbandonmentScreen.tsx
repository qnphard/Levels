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
import FearGriefSpillAnimation from '../components/animations/FearGriefSpillAnimation';
import ResistanceFlowAnimation from '../components/animations/ResistanceFlowAnimation';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LossAndAbandonmentScreen() {
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
        <Text style={styles.headerTitle}>Loss and Abandonment</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="heart-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="key-insight-title"
              originalContent="Grief is Love with Nowhere to Go"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="key-insight"
            originalContent="Grief focuses on the past. Fear focuses on the future. All suffering is due to resistance."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <View style={styles.animationContainer}>
          <FearGriefSpillAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="water-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="limited-quantity-title"
              originalContent="Grief is Limited in Quantity"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="limited-quantity"
            originalContent="The energy of grief has been accumulated for a lifetime, and it spills out in life experiences."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="limited-quantity-2"
            originalContent="As you let go of the energy of grief, the less it will spill out. The more you release it, the less it colors your present experience."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="loss-and-abandonment"
          section="main"
          id="resistance"
          originalContent="When we lose someone or something, the suffering comes not from the loss itself, but from our resistance to it."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="loss-and-abandonment"
          section="main"
          id="resistance-2"
          originalContent="We want things to be different than they are, and this resistance creates suffering."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ResistanceFlowAnimation autoPlay={true} />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="letting-go-title"
              originalContent="Allowing Grief to Move"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="letting-go"
            originalContent="Letting go doesn't mean you didn't love what you lost. It means you're releasing the emotional energy that's keeping you stuck in the past."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <EditableText
            screen="loss-and-abandonment"
            section="main"
            id="letting-go-2"
            originalContent="You can honor the love and the loss while also allowing yourself to move forward. The grief is not who you are—it's an energy that can be released."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
          <View style={cardStyles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={CARD_COLORS.practice} />
            <EditableText
              screen="loss-and-abandonment"
              section="main"
              id="practice-insight"
              originalContent="When grief arises, allow it. Don't resist it, don't suppress it. Feel it fully, and then let it go. As you do this, you'll notice that the grief becomes less overwhelming, less all-consuming. You'll find that you can honor the loss while also living fully in the present."
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

