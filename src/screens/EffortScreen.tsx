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

const colors = {
  power: '#60A5FA',
  force: '#F87171',
};
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
import ResistanceFlowAnimation from '../components/animations/ResistanceFlowAnimation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EffortScreen() {
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
        <Text style={styles.headerTitle}>Effort</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Insight Card */}
        <View style={styles.highlightCard}>
          <View style={styles.highlightHeader}>
            <Ionicons name="bulb-outline" size={20} color={theme.primary} />
            <EditableText
              screen="effort"
              section="main"
              id="key-insight-title"
              originalContent="Key Insight"
              textStyle={styles.highlightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="key-insight"
            originalContent="Human effort is necessary only to learn that human effort is useless. God's will alone is the real power."
            textStyle={styles.highlightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="effort"
          section="main"
          id="intro"
          originalContent="When you realize this truth, human effort ceases and divine will starts its work in you. Then you do all things in the freedom of the soul, liberated from care, fear and sorrow."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <ResistanceFlowAnimation autoPlay={true} />
        </View>

        {/* Power vs Force Card */}
        <View style={styles.comparisonCard}>
          <EditableText
            screen="effort"
            section="main"
            id="power-vs-force-title"
            originalContent="Power vs Force"
            textStyle={styles.comparisonTitle}
            type="title"
          />
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Ionicons name="flash-outline" size={18} color={colors.power} />
              <EditableText
                screen="effort"
                section="main"
                id="power-text"
                originalContent="Power: Flow effortlessly"
                textStyle={styles.comparisonText}
                type="paragraph"
              />
            </View>
            <View style={styles.comparisonItem}>
              <Ionicons name="remove-circle-outline" size={18} color={colors.force} />
              <EditableText
                screen="effort"
                section="main"
                id="force-text"
                originalContent="Force: Exhaust yourself"
                textStyle={styles.comparisonText}
                type="paragraph"
              />
            </View>
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="power-vs-force-recap"
            originalContent="It's very possible to have better results with less effort—working smart, not hard."
            textStyle={styles.comparisonNote}
            type="paragraph"
          />
        </View>

        {/* The Paradox Card */}
        <View style={styles.keyPointsCard}>
          <View style={styles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={theme.primary} />
            <EditableText
              screen="effort"
              section="main"
              id="paradox-title"
              originalContent="The Paradox"
              textStyle={styles.keyPointsTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="paradox"
            originalContent="We must make effort to learn that effort is not the way. Once we realize this, we can let go and allow divine will to work through us."
            textStyle={styles.keyPoint}
            type="paragraph"
          />
        </View>

        {/* Practice Card */}
        <View style={styles.practiceCard}>
          <View style={styles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={theme.primary} />
            <EditableText
              screen="effort"
              section="main"
              id="practice-title"
              originalContent="Try This"
              textStyle={styles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="effort"
            section="main"
            id="practice"
            originalContent="Notice when you're pushing, struggling, or forcing. Ask yourself: 'What would it look like to let go and allow this to unfold naturally?'"
            textStyle={styles.practiceText}
            type="paragraph"
          />
          <View style={styles.practiceInsight}>
            <Ionicons name="sparkles-outline" size={16} color={theme.primary} />
            <EditableText
              screen="effort"
              section="main"
              id="practice-insight"
              originalContent="Often, the best results come not from more effort, but from less resistance."
              textStyle={styles.practiceInsightText}
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
    paragraph: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 26,
      marginBottom: spacing.lg,
    },
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
    },
    highlightCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.2)'
        : 'rgba(139, 92, 246, 0.1)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.4)'
        : 'rgba(139, 92, 246, 0.3)',
    },
    highlightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    highlightTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.primary,
    },
    highlightText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    comparisonCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    comparisonTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    comparisonRow: {
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    comparisonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    comparisonText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    comparisonNote: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginTop: spacing.xs,
    },
    keyPointsCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    cardIconHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    keyPointsTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    keyPoint: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    practiceCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(52, 211, 153, 0.15)'
        : 'rgba(52, 211, 153, 0.1)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(52, 211, 153, 0.3)'
        : 'rgba(52, 211, 153, 0.2)',
    },
    practiceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    practiceTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    practiceText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.sm,
    },
    practiceInsight: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.mode === 'dark'
        ? 'rgba(52, 211, 153, 0.2)'
        : 'rgba(52, 211, 153, 0.15)',
    },
    practiceInsightText: {
      flex: 1,
      fontSize: typography.small,
      fontStyle: 'italic',
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });

