import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { getChapterById, feelingsChapters } from '../data/feelingsChapters';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chapter'>;
type ChapterRouteProp = RouteProp<RootStackParamList, 'Chapter'>;

type TabKey = 'key-takeaways' | 'how-it-works' | 'when-to-use' | 'practice' | 'benefits' | 'common-blocks' | 'related';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'key-takeaways', label: 'Key Takeaways' },
  { key: 'how-it-works', label: 'How It Works' },
  { key: 'when-to-use', label: 'When to Use' },
  { key: 'practice', label: 'Practice' },
  { key: 'benefits', label: 'Benefits' },
  { key: 'common-blocks', label: 'Common Blocks' },
  { key: 'related', label: 'Related' },
];

export default function LettingGoChapterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChapterRouteProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: number }>({});
  
  const chapter = getChapterById('letting-go');
  const glowColor = theme.feelingsChapters.violet;
  
  // Get initial tab from deep link or URL hash
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    // Check if route params include a tab
    const params = route.params as any;
    if (params?.tab) {
      const tabParam = params.tab as string;
      const tabKey = tabs.find(t => t.key === tabParam)?.key;
      if (tabKey) return tabKey;
    }
    return 'key-takeaways';
  });

  // Get related chapters
  const relatedChapters = chapter
    ? chapter.relatedChapters
        .map((id) => getChapterById(id))
        .filter((c) => c !== undefined)
    : [];

  // Practice steps for copy-to-clipboard
  const practiceSteps = `1. Name it: "There's tightness / fear / anger here."
2. Allow it: Let the sensation be exactly as it is. Do nothing to change it.
3. Drop all fixing: Release judgment, story, and any urge to analyze or act.
4. Surrender resistance: If you notice resisting, let go of the resistance first.
5. Wait & feel: Stay with the raw energy until it softens or passes. If it returns, repeat—there's just more energy to release.

Tip: If you feel "stuck," let go of the feeling of being stuck, even in bits and pieces.`;

  const handleCopyPractice = async () => {
    try {
      await Clipboard.setStringAsync(practiceSteps);
      Alert.alert('Copied!', 'Practice steps copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleTabPress = (tab: TabKey) => {
    setActiveTab(tab);
    // Scroll to section
    if (sectionRefs.current[tab] !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: sectionRefs.current[tab],
        animated: true,
      });
    }
  };

  const handleRelatedChapterPress = (chapterId: string) => {
    navigation.navigate('Chapter', { chapterId });
  };

  const renderSection = (tab: TabKey) => {
    switch (tab) {
      case 'key-takeaways':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What it is</Text>
            <Text style={styles.sectionBody}>
              A simple mechanism to release an emotion by allowing it fully without resistance until its energy runs out. No analyzing, no fixing, no venting—just letting the feeling be and dissolve.
            </Text>

            <Text style={styles.sectionTitle}>Core move</Text>
            <Text style={styles.sectionBody}>
              Notice → Allow → Surrender resistance → Let the energy pass.
            </Text>

            <Text style={styles.sectionTitle}>Why it works</Text>
            <Text style={styles.sectionBody}>
              Resistance sustains emotions; dropping resistance lets the feeling resolve on its own. Thoughts are just after-the-fact explanations—ignore them during release.
            </Text>

            <Text style={styles.sectionTitle}>Result</Text>
            <Text style={styles.sectionBody}>
              Relief, lightness, more freedom and ease—often immediately.
            </Text>
          </View>
        );

      case 'how-it-works':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Definition</Text>
            <Text style={styles.sectionBody}>
              Letting go means being aware of a feeling, letting it come up, staying with it without trying to change it, and letting the energy behind it discharge.
            </Text>

            <Text style={styles.sectionTitle}>Mechanism</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Allow the feeling completely—no resisting, fixing, moralizing, or acting it out. See it as just a feeling.
              </Text>
              <Text style={styles.bulletItem}>
                • Drop judgment & effort to modify it; resistance is what keeps it going.
              </Text>
              <Text style={styles.bulletItem}>
                • Ignore thoughts about it while releasing; thoughts are rationalizations that recycle the feeling.
              </Text>
              <Text style={styles.bulletItem}>
                • As resistance drops, the feeling shifts and lightens; if it returns, there's simply more to release.
              </Text>
              <Text style={styles.bulletItem}>
                • With practice you recognize you are the witness, not the feelings.
              </Text>
            </View>

            <View style={styles.citation}>
              <Pressable
                onPress={() => Alert.alert(
                  'Source',
                  'David R. Hawkins, Letting Go. See Chapter 2; Chapters 14–16.'
                )}
                style={styles.citationButton}
              >
                <Ionicons name="information-circle-outline" size={16} color={glowColor} />
              </Pressable>
              <Text style={styles.citationText}>Based on Hawkins' research</Text>
            </View>
          </View>
        );

      case 'when-to-use':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              Use letting go anytime, anywhere—during triggers, decisions, or subtle unease:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • In the middle of an argument or spike of anger/anxiety.
              </Text>
              <Text style={styles.bulletItem}>
                • On the spot when other tools aren't practical (e.g., public speaking).
              </Text>
              <Text style={styles.bulletItem}>
                • When stress flares from internal reactivity, not "external causes."
              </Text>
              <Text style={styles.bulletItem}>
                • During good states too—ride the momentum and clear deeper layers.
              </Text>
            </View>
          </View>
        );

      case 'practice':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2-minute quick release</Text>
            
            <View style={styles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <Text style={styles.practiceCardTitle}>Quick Practice</Text>
                <Pressable
                  onPress={handleCopyPractice}
                  style={styles.copyButton}
                  accessibilityLabel="Copy practice steps"
                >
                  <Ionicons name="copy-outline" size={20} color={glowColor} />
                </Pressable>
              </View>
              
              <Text style={styles.practiceStep}>1. Name it</Text>
              <Text style={styles.practiceStepBody}>
                "There's tightness / fear / anger here."
              </Text>

              <Text style={styles.practiceStep}>2. Allow it</Text>
              <Text style={styles.practiceStepBody}>
                Let the sensation be exactly as it is. Do nothing to change it.
              </Text>

              <Text style={styles.practiceStep}>3. Drop all fixing</Text>
              <Text style={styles.practiceStepBody}>
                Release judgment, story, and any urge to analyze or act.
              </Text>

              <Text style={styles.practiceStep}>4. Surrender resistance</Text>
              <Text style={styles.practiceStepBody}>
                If you notice resisting, let go of the resistance first.
              </Text>

              <Text style={styles.practiceStep}>5. Wait & feel</Text>
              <Text style={styles.practiceStepBody}>
                Stay with the raw energy until it softens or passes. If it returns, repeat—there's just more energy to release.
              </Text>

              <View style={styles.practiceTip}>
                <Ionicons name="bulb-outline" size={16} color={glowColor} />
                <Text style={styles.practiceTipText}>
                  Tip: If you feel "stuck," let go of the feeling of being stuck, even in bits and pieces.
                </Text>
              </View>
            </View>
          </View>
        );

      case 'benefits':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stress & body</Text>
            <Text style={styles.sectionBody}>
              Less reactivity; improvements in pulse, BP, muscle tension, vision, and overall physiology; immediate increase in muscle power after release.
            </Text>

            <Text style={styles.sectionTitle}>Mindset</Text>
            <Text style={styles.sectionBody}>
              Limiting beliefs ("I can't") dissolve as their emotional fuel is released; action becomes effortless.
            </Text>

            <Text style={styles.sectionTitle}>Performance & relationships</Text>
            <Text style={styles.sectionBody}>
              More creativity, clarity, problem-solving (let go of the feeling behind the question → solutions surface).
            </Text>

            <Text style={styles.sectionTitle}>Spiritual growth</Text>
            <Text style={styles.sectionBody}>
              Less attachment; more stability in the witness state.
            </Text>

            <View style={styles.citation}>
              <Pressable
                onPress={() => Alert.alert(
                  'Source',
                  'David R. Hawkins, Letting Go. See Chapter 2; Chapters 14–16.'
                )}
                style={styles.citationButton}
              >
                <Ionicons name="information-circle-outline" size={16} color={glowColor} />
              </Pressable>
              <Text style={styles.citationText}>Based on Hawkins' research</Text>
            </View>
          </View>
        );

      case 'common-blocks':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              <Text style={styles.boldText}>Fear/guilt about feelings:</Text> Release those first, then the target emotion.
            </Text>

            <Text style={styles.sectionBody}>
              <Text style={styles.boldText}>Beliefs that delay release:</Text> "It must be hard," "suffering is required," "if I let go of desire I won't get it." Question and let these go.
            </Text>

            <Text style={styles.sectionBody}>
              <Text style={styles.boldText}>Stopping when you feel better:</Text> Keep going; leverage the high state to clear deeper material.
            </Text>
          </View>
        );

      case 'related':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Chapters</Text>
            <View style={styles.relatedChips}>
              {relatedChapters.map((relatedChapter) => (
                <Pressable
                  key={relatedChapter.id}
                  onPress={() => handleRelatedChapterPress(relatedChapter.id)}
                  style={[
                    styles.relatedChip,
                    {
                      backgroundColor:
                        theme.feelingsChapters[relatedChapter.glowColor] + '20',
                      borderColor: theme.feelingsChapters[relatedChapter.glowColor],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.relatedChipText,
                      { color: theme.feelingsChapters[relatedChapter.glowColor] },
                    ]}
                  >
                    {String(relatedChapter.title || '')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Letting Go (Releasing Emotions)
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={[
                  styles.tab,
                  isActive && styles.tabActive,
                  isActive && {
                    borderBottomColor: glowColor,
                  },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && { color: glowColor },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(activeTab)}

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
    tabsContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.cardBackground,
    },
    tabsContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    tab: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
      minHeight: 44, // Accessibility: minimum hit target
    },
    tabActive: {
      borderBottomWidth: 2,
    },
    tabText: {
      fontSize: typography.small,
      fontWeight: typography.medium,
      color: theme.textSecondary,
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
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    sectionBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    boldText: {
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    bulletList: {
      marginBottom: spacing.md,
    },
    bulletItem: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.sm,
      paddingLeft: spacing.xs,
    },
    practiceCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    practiceCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    practiceCardTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    copyButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    practiceStep: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    practiceStepBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.sm,
    },
    practiceTip: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    practiceTipText: {
      flex: 1,
      fontSize: typography.small,
      color: theme.textSecondary,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    citation: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      gap: spacing.xs,
    },
    citationButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    citationText: {
      fontSize: typography.small,
      color: theme.textMuted,
      fontStyle: 'italic',
    },
    relatedChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    relatedChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      minHeight: 44, // Accessibility: minimum hit target
    },
    relatedChipText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
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

