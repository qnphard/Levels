import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
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
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';
import PracticeTimerModal from '../components/PracticeTimerModal';

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
  "Walk straight ahead no matter what.",
  "I am loving awareness.",
  "Walk by faith, not by sight.",
  "May all be free of the weight of this world.",
  "Truth is Power.",
  "My life is an expression of Divine Love.",
  "I am responsible for the effort, but not the results.",
  "I allow life to move through me.",
  "All fear is illusion.",
  "The 'I' is the silent witness of the mind.",
  "God is the Context of my life.",
  "I surrender my will to the Higher Will.",
  "I am that which is aware of the thought.",
  "This too shall pass into the Silence.",
  "I rest in the Presence of the Infinite.",
];

export default function MantrasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const glowColor = theme.feelingsChapters.violet;

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
    >
      <EditModeIndicator />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mantras</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="mantras"
              section="main"
              id="key-insight-title"
              originalContent="The Power of the Word"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="mantras"
            section="main"
            id="key-insight"
            originalContent="A mantra is a pointer to Truth. Its value lies not in the words themselves, but in the level of consciousness they embody."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="mantras"
          section="main"
          id="intro"
          originalContent="The mind is like a restless monkey, jumping from thought to thought. A mantra gives the monkey a golden rope to hold on to. By focusing on a single, high-vibration statement, you interrupt the 'Linear' noise of the ego and align with the 'Nonlinear' Power of the Spirit."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="mantras"
          section="main"
          id="selection-title"
          originalContent="Sacred Pointers by State"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        {/* Categorized Mantras */}
        {[
          {
            category: "Foundational Security (Level 200+)",
            items: [
              "I am safe to feel what I feel.",
              "I allow life to move through me.",
              "I am responsible for the effort, but not the results.",
              "Truth is Power."
            ]
          },
          {
            category: "Emergency Release (When Overwhelmed)",
            items: [
              "Walk straight ahead no matter what.",
              "This too shall pass into the Silence.",
              "I am not the feeling; I am the space in which it occurs.",
              "I surrender this to God."
            ]
          },
          {
            category: "Divine Reality (Level 500+)",
            items: [
              "I am loving awareness.",
              "My life is an expression of Divine Love.",
              "The 'I' is the silent witness of the mind.",
              "I rest in the Presence of the Infinite."
            ]
          }
        ].map((group, gIndex) => (
          <View key={gIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{group.category}</Text>
            <View style={styles.mantrasList}>
              {group.items.map((mantra, index) => (
                <View
                  key={index}
                  style={[
                    styles.mantraCard,
                    glowEnabled && {
                      borderWidth: 1,
                      borderColor: toRgba(glowColor, 0.3),
                      shadowColor: glowColor,
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                    },
                  ]}
                >
                  <EditableText
                    screen="mantras"
                    section={`examples-${gIndex}`}
                    id={`mantra-${index}`}
                    originalContent={mantra}
                    textStyle={styles.mantraText}
                    type="mantra"
                  />
                  <Pressable
                    onPress={() => handleCopy(mantra, gIndex * 10 + index)}
                    style={[
                      styles.copyButton,
                      copiedIndex === (gIndex * 10 + index) && styles.copyButtonCopied,
                    ]}
                  >
                    <Ionicons
                      name={copiedIndex === (gIndex * 10 + index) ? "checkmark" : "copy-outline"}
                      size={16}
                      color={copiedIndex === (gIndex * 10 + index) ? "#FFFFFF" : glowColor}
                    />
                    <Text
                      style={[
                        styles.copyButtonText,
                        copiedIndex === (gIndex * 10 + index) && styles.copyButtonTextCopied,
                      ]}
                    >
                      {copiedIndex === (gIndex * 10 + index) ? "Copied" : "Copy"}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={cardStyles.practiceCard}>
          <View style={styles.practiceHeader}>
            <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="mantras"
              section="main"
              id="practice-title"
              originalContent="Practice: The Heart-Mantra"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
            <Pressable
              onPress={() => setShowTimer(true)}
              style={styles.timerButton}
            >
              <Ionicons name="time-outline" size={20} color={glowColor} />
              <Text style={styles.timerButtonText}>Begin Focus</Text>
            </Pressable>
          </View>
          <EditableText
            screen="mantras"
            section="main"
            id="practice-guide"
            originalContent="1. Choose a mantra above that resonates with your current situation.\n2. Inhale deeply, and as you exhale, speak the mantra internally.\n3. Feel the meaning of the words descend from your head into your heart center.\n4. If a 'No' or a doubt arises in response to the mantra, let go of the doubt as soon as it's noticed.\n5. Continue for 2 minutes until the mind feels saturated with the vibration of the phrase."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['tension', 'relaxing', 'letting-go']}
          currentScreenId="mantras"
        />

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            A mantra is a bridge from the personal to the impersonal. Use it to transcend the drama of the daily self.
          </Text>
        </View>
      </ScrollView>
      <PracticeTimerModal visible={showTimer} onClose={() => setShowTimer(false)} durationMinutes={2} />
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: 100 },
    categorySection: { marginBottom: spacing.xl },
    categoryTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textSecondary,
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    mantrasList: { gap: spacing.md },
    mantraCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    mantraText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.md,
      fontStyle: 'italic',
      fontWeight: typography.medium,
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      paddingVertical: 6,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.feelingsChapters.violet,
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
    copyButtonTextCopied: { color: '#FFFFFF' },
    disclaimer: { marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: theme.border },
    disclaimerText: { fontSize: typography.small, color: theme.textMuted, lineHeight: 20, fontStyle: 'italic', textAlign: 'center' },
    practiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    timerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.feelingsChapters.violet + '15', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
    timerButtonText: { marginLeft: spacing.xs, fontSize: typography.small, fontWeight: typography.semibold, color: theme.feelingsChapters.violet },
  });
