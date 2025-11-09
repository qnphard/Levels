import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import ContentBuilder from '../components/ContentBuilder';
import { useContentStructure } from '../hooks/useContentStructure';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

const mantras = [
  "I am safe to feel what I feel.",
  "Walk straight ahead no matter what",
  "I am loving Awareness",
  "Walk by faith, not by sight",
  "May all be free of the weight of this world. May all be free of the root of suffering",
  "Truth is power",
  "My life has been a success",
  "One is responsible for the effort, but not for the results",
  "I allow life to move through me.",
  "All fear is illusion",
  "You are exactly where you need to be, having the exact experience you are supposed to be having",
  "Keep it simple",
  "My life is ruled by order and harmony",
  "Happiness is a choice",
  "The one thing that feels really, really hard for you is most often the key to your liberation and to your upleveling.",
  "I can do this",
  "One can only go as high as they've been low",
  "Straight and narrow is the path; waste no time",
];

export default function MantrasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const glowColor = theme.feelingsChapters.violet;
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  
  // Load content structure
  const { structure, refreshStructure } = useContentStructure('mantras', 'main');
  
  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

  const handleCopy = async (mantra: string, index: number) => {
    await Clipboard.setStringAsync(mantra);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <EditModeIndicator />
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Mantras
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <EditableText
          screen="mantras"
          section="main"
          id="subtitle"
          originalContent="Simple phrases that calm the mind and open the heart"
          textStyle={styles.subtitle}
          type="subtitle"
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* What a Mantra Is */}
        <View style={styles.section} key={`what-is-${structureRefreshKey}`}>
          <EditableText
            screen="mantras"
            section="what-is"
            id="title"
            originalContent="What a Mantra Is"
            textStyle={styles.sectionTitle}
            type="title"
          />
          <EditableText
            screen="mantras"
            section="what-is"
            id="para-1"
            originalContent="A mantra is a short, truthful phrase repeated with gentle awareness."
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <EditableText
            screen="mantras"
            section="what-is"
            id="para-2"
            originalContent="It's not about forcing belief — it's about inviting stillness by giving the mind a single, peaceful focus."
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <EditableText
            screen="mantras"
            section="what-is"
            id="para-3"
            originalContent="Used consciously, a mantra can interrupt cycles of tension, fear, or overthinking."
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <ContentBuilder
            screen="mantras"
            section="what-is"
            onStructureChange={handleStructureChange}
          />
        </View>

        {/* Purpose */}
        <View style={styles.section} key={`purpose-${structureRefreshKey}`}>
          <EditableText
            screen="mantras"
            section="purpose"
            id="title"
            originalContent="What's the Purpose?"
            textStyle={styles.sectionTitle}
            type="title"
          />
          <View style={styles.quoteCard}>
            <Ionicons name="bulb-outline" size={24} color={glowColor} />
            <View style={styles.quoteContent}>
              <EditableText
                screen="mantras"
                section="purpose"
                id="quote-1"
                originalContent="Mantras and affirmations keep the ego busy so the Higher Self can shine through. They are a way to lessen resistance by getting the ego aligned with the goals of the Higher Self."
                textStyle={styles.quoteText}
                type="quote"
              />
            </View>
          </View>
          <ContentBuilder
            screen="mantras"
            section="purpose"
            onStructureChange={handleStructureChange}
          />
        </View>

        {/* Examples */}
        <View style={styles.section} key={`examples-${structureRefreshKey}`}>
          <EditableText
            screen="mantras"
            section="examples"
            id="title"
            originalContent="Examples"
            textStyle={styles.sectionTitle}
            type="title"
          />

          <View style={styles.mantrasList}>
            {mantras.map((mantra, index) => (
              <View 
                key={index} 
                style={[
                  styles.mantraCard,
                  // Apply glow effects when glow is enabled
                  glowEnabled && theme.mode === 'dark'
                    ? {
                        borderWidth: 2,
                        borderColor: toRgba(glowColor, 0.6),
                        shadowColor: glowColor,
                        shadowOpacity: 0.3,
                        shadowRadius: 16,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 0,
                        boxShadow: [
                          `0 0 20px ${toRgba(glowColor, 0.4)}`,
                          `0 0 40px ${toRgba(glowColor, 0.2)}`,
                        ].join(', '),
                      }
                    : glowEnabled && theme.mode === 'light'
                    ? {
                        borderWidth: 2,
                        borderColor: toRgba(glowColor, 0.5),
                        shadowColor: glowColor,
                        shadowOpacity: 0.35,
                        shadowRadius: 18,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 0,
                        boxShadow: [
                          `0 0 18px ${toRgba(glowColor, 0.35)}`,
                          `0 0 35px ${toRgba(glowColor, 0.18)}`,
                        ].join(', '),
                      }
                    : {},
                ]}
              >
                <EditableText
                  screen="mantras"
                  section="examples"
                  id={`mantra-${index}`}
                  originalContent={mantra}
                  textStyle={styles.mantraText}
                  type="mantra"
                />
                <Pressable
                  onPress={() => handleCopy(mantra, index)}
                  style={[
                    styles.copyButton,
                    copiedIndex === index && styles.copyButtonCopied,
                  ]}
                  accessibilityLabel={`Copy mantra: ${mantra}`}
                >
                  <Ionicons
                    name={copiedIndex === index ? "checkmark" : "copy-outline"}
                    size={18}
                    color={copiedIndex === index ? "#FFFFFF" : glowColor}
                  />
                  <Text
                    style={[
                      styles.copyButtonText,
                      copiedIndex === index && styles.copyButtonTextCopied,
                    ]}
                  >
                    {copiedIndex === index ? "Copied" : "Copy"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
          <ContentBuilder
            screen="mantras"
            section="examples"
            onStructureChange={handleStructureChange}
          />
        </View>

        {/* Usage Tip */}
        <View style={styles.section} key={`usage-tip-${structureRefreshKey}`}>
          <View style={styles.tipCard}>
            <Ionicons name="heart-outline" size={20} color={glowColor} />
            <EditableText
              screen="mantras"
              section="usage-tip"
              id="tip-1"
              originalContent="When the mind won't stop looping, gently repeating a truthful mantra can help shift awareness away from the story and back into calm presence."
              textStyle={styles.tipText}
              type="paragraph"
            />
          </View>
          <ContentBuilder
            screen="mantras"
            section="usage-tip"
            onStructureChange={handleStructureChange}
          />
        </View>

        {/* Disclaimer Footer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This content does not replace medical care. If you're experiencing severe distress, please consult a healthcare professional.
          </Text>
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
      paddingBottom: spacing.sm,
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
    subtitleContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.lg,
    },
    sectionBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    quoteCard: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.feelingsChapters.violet,
      gap: spacing.md,
    },
    quoteContent: {
      flex: 1,
    },
    quoteText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    mantrasList: {
      gap: spacing.md,
      marginTop: spacing.md,
    },
    mantraCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    mantraText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.md,
      fontStyle: 'italic',
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.feelingsChapters.violet,
      backgroundColor: 'transparent',
      minHeight: 44,
    },
    copyButtonCopied: {
      backgroundColor: theme.feelingsChapters.violet,
      borderColor: theme.feelingsChapters.violet,
    },
    copyButtonText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.feelingsChapters.violet,
    },
    copyButtonTextCopied: {
      color: '#FFFFFF',
    },
    tipCard: {
      flexDirection: 'row',
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.feelingsChapters.violet + '30',
    },
    tipText: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    disclaimer: {
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    disclaimerText: {
      fontSize: typography.small,
      color: theme.textMuted,
      lineHeight: 20,
      fontStyle: 'italic',
    },
  });

