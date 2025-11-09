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
import IntentionRippleAnimation from '../components/animations/IntentionRippleAnimation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function IntentionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
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
        <Text style={styles.headerTitle}>Intention</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="intention"
          section="main"
          id="intro"
          originalContent="Intention is actually karma. The reason why we do things matters more than the action itself. This is a profound truth that can transform how we understand our actions and their consequences."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <IntentionRippleAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="intention"
          section="main"
          id="example"
          originalContent="Consider this example: One person donates to charity out of genuine goodwill and pure intentions, wanting to help others. Another person donates to charity to be well-liked, to get recognition, or to gain some benefit. The action is the same—donating to charity—but the intention is completely different. The karmic result will be different too."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.keyPointsCard}>
          <EditableText
            screen="intention"
            section="main"
            id="unconscious-awareness-title"
            originalContent="Unconscious Awareness"
            textStyle={styles.keyPointsTitle}
            type="title"
          />
          <EditableText
            screen="intention"
            section="main"
            id="unconscious-awareness"
            originalContent="People are unconsciously aware at all times of our intentions. We are just too busy, unaware, or ignorant to notice it consciously. But on an energetic level, intention radiates outward like ripples in a pond. Others sense it, even if they can't articulate it. This is why we can feel when someone is being genuine versus when they have ulterior motives."
            textStyle={styles.keyPoint}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="intention"
          section="main"
          id="practice"
          originalContent="This understanding invites us to examine our intentions behind our actions. Why are we really doing what we're doing? Are we acting from love, from truth, from genuine care? Or are we acting from fear, from wanting approval, from trying to control outcomes? The intention determines the karmic result."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.quoteCard}>
          <EditableText
            screen="intention"
            section="main"
            id="quote"
            originalContent="'What you are seeking is not different from your very own Self.' - Dr. David R. Hawkins. When our intentions align with truth and love, we align with our true nature."
            textStyle={styles.quote}
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
    paragraph: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    keyPointsCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    keyPointsTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    keyPoint: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    quoteCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    quote: {
      fontSize: typography.body,
      fontStyle: 'italic',
      color: theme.textPrimary,
      lineHeight: 22,
    },
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
    },
  });

