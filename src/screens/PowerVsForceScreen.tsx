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
import HybridAnimation from '../components/animations/HybridAnimation';
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PowerVsForceScreen() {
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
        <Text style={styles.headerTitle}>Power vs Force</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="power-vs-force"
          section="main"
          id="intro"
          originalContent="Understanding the difference between power and force is fundamental to spiritual growth. According to Dr. David R. Hawkins, these represent two entirely different ways of operating in the world."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <HybridAnimation
            animationName="power-vs-force"
            CodeAnimation={PowerVsForceAnimation}
            height={280}
            preferAsset={true}
            autoPlay={true}
          />
        </View>

        <EditableText
          screen="power-vs-force"
          section="main"
          id="force-description"
          originalContent="Force is what we use when we push against resistance. It requires effort, creates exhaustion, and is temporary. Force operates below consciousness level 200, where we rely on emotional, physical, or social coercion. When we use force, we're fighting against the current of life, and this creates struggle, conflict, and eventual burnout."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="power-vs-force"
          section="main"
          id="power-description"
          originalContent="Power, on the other hand, flows with life. It operates above consciousness level 200, where we align with truth and reality. Power is effortless, lasting, and comes from alignment rather than opposition. When we operate from power, we're like a river flowing naturally—we don't fight the current, we become one with it."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.keyPointsCard}>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="key-points-title"
            originalContent="Why People Choose Force"
            textStyle={styles.keyPointsTitle}
            type="title"
          />
          <EditableText
            screen="power-vs-force"
            section="main"
            id="why-force"
            originalContent="Most people choose force because it's what they've been taught. We're conditioned to believe that we must struggle, fight, and push to get what we want. Force feels familiar and gives us a sense of control, even though it's ultimately exhausting and ineffective."
            textStyle={styles.keyPoint}
            type="paragraph"
          />
        </View>

        <View style={styles.keyPointsCard}>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="how-power-title"
            originalContent="How to Choose Power"
            textStyle={styles.keyPointsTitle}
            type="title"
          />
          <EditableText
            screen="power-vs-force"
            section="main"
            id="how-power"
            originalContent="To choose power, we must first recognize when we're using force. Notice when you're pushing, struggling, or fighting. Then, instead of pushing harder, ask: 'What would it look like to flow with this instead?' Power comes from letting go of resistance, aligning with truth, and trusting the natural flow of life."
            textStyle={styles.keyPoint}
            type="paragraph"
          />
        </View>

        <View style={styles.quoteCard}>
          <EditableText
            screen="power-vs-force"
            section="main"
            id="quote"
            originalContent="'The pen (ideology) is mightier than the sword (force).' - Power operates through truth, while force operates through coercion."
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
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
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
  });

