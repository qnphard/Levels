import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import PracticeTimerModal from '../components/PracticeTimerModal';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import TensionAnimation from '../components/animations/TensionAnimation';
import RelatedNextCard from '../components/RelatedNextCard';
import FluidBreathing from '../components/FluidBreathing';
import ResistanceMelter from '../components/ResistanceMelter';
import { useUserStore } from '../store/userStore';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TensionRouteProp = RouteProp<RootStackParamList, 'Tension'>;

type TabKey = 'what-it-is' | 'how-it-builds' | 'releasing' | 'what-changes' | 'related';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'what-it-is', label: 'Overview' },
  { key: 'how-it-builds', label: 'Mechanism' },
  { key: 'releasing', label: 'Practice' },
  { key: 'what-changes', label: 'Benefits' },
  { key: 'related', label: 'Related' },
];

export default function TensionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TensionRouteProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);

  const glowColor = theme.feelingsChapters.violet;
  const [showTimer, setShowTimer] = useState(false);
  const TAB_STORAGE_KEY = '@tension:last_tab';

  const [activeTab, setActiveTab] = useState<TabKey>(
    (route.params?.initialTab as TabKey) || 'what-it-is'
  );
  const [isTabLoaded, setIsTabLoaded] = useState(false);

  const saveReadingProgress = useUserStore((s) => s.saveReadingProgress);

  useEffect(() => {
    if (isTabLoaded) {
      saveReadingProgress('tension', 0, activeTab);
    }
  }, [activeTab, isTabLoaded]);

  useEffect(() => {
    let isMounted = true;
    const loadTab = async () => {
      try {
        const storedTab = await AsyncStorage.getItem(TAB_STORAGE_KEY);
        if (isMounted && storedTab && tabs.find(t => t.key === storedTab)) {
          setActiveTab(storedTab as TabKey);
        }
      } catch (error) {
        console.error('Failed to load last tab:', error);
      } finally {
        if (isMounted) {
          setIsTabLoaded(true);
        }
      }
    };
    loadTab();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isTabLoaded) {
      AsyncStorage.setItem(TAB_STORAGE_KEY, activeTab).catch((error) => {
        console.error('Failed to save last tab:', error);
      });
    }
  }, [activeTab, isTabLoaded]);

  const handleTabPress = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const renderSection = (tab: TabKey) => {
    switch (tab) {
      case 'what-it-is':
        return (
          <View style={styles.section}>
            <View style={cardStyles.keyInsightCard}>
              <View style={cardStyles.keyInsightHeader}>
                <Ionicons name="fitness-outline" size={20} color={CARD_COLORS.keyInsight} />
                <EditableText
                  screen="tension"
                  section="what-it-is"
                  id="key-insight-title"
                  originalContent="Tension is a physicalized 'No'"
                  textStyle={cardStyles.keyInsightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="tension"
                section="what-it-is"
                id="key-insight"
                originalContent="The body is the recorder of the psyche's status. Tension is the physiological signature of a mind that is resisting life. It is the ego's attempt to 'hold its ground' against the flow of existence."
                textStyle={cardStyles.keyInsightText}
                type="paragraph"
              />
            </View>

            <View style={{ alignItems: 'center', marginVertical: 32 }}>
              <TensionAnimation />
            </View>

            <EditableText
              screen="tension"
              section="what-it-is"
              id="para-1"
              originalContent="We often treat tension as an intruder—something that 'comes over us' like a cold. But tension is an active process. It is a continuous expenditure of metabolic energy used to keep a feeling suppressed or a thought at bay. To be tense is to be in a state of 'Muscular Armoring'."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="body-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="tension"
                  section="what-it-is"
                  id="body-insight-title"
                  originalContent="The Body's Compass"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="tension"
                section="what-it-is"
                id="body-insight-text"
                originalContent="Your shoulders, jaw, and solar plexus are your sensitivity meters. They tell you exactly where you are out of alignment with Truth. Chronic tension is simply a persistent 'No' that has become an unconscious habit of the nervous system."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'how-it-builds':
        return (
          <View style={styles.section}>
            <EditableText
              screen="tension"
              section="how-it-builds"
              id="intro"
              originalContent="Tension builds like pressure in a pressure cooker. Each time we suppress a feeling to 'get through the day', we add more charge to the internal system. Life then provides triggers that poke at this stored pressure."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.warningCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="battery-dead-outline" size={20} color={CARD_COLORS.warning} />
                <EditableText
                  screen="tension"
                  section="how-it-builds"
                  id="pressure-title"
                  originalContent="The Cost of Desire"
                  textStyle={cardStyles.warningTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="pressure-text"
                originalContent="Desire (Level 125) is the primary engine of tension. The constant sequence of 'I need this' creates a state of inner yearning. This translates into a literal tightening of the muscle fibers as the body prepares to 'grab' its target. You can't be both deeply desiring and deeply relaxed."
                textStyle={cardStyles.warningText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.comparisonCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="comparison-title"
                originalContent="Contraction vs. Expansion"
                textStyle={cardStyles.comparisonTitle}
                type="title"
              />
              <View style={cardStyles.comparisonRow}>
                <View style={cardStyles.comparisonItem}>
                  <Ionicons name="lock-closed-outline" size={18} color={CARD_COLORS.force} />
                  <View style={{ flex: 1 }}>
                    <EditableText
                      screen="tension"
                      section="how-it-builds"
                      id="locked-title"
                      originalContent="The 'No' (Force)"
                      textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                      type="paragraph"
                    />
                    <EditableText
                      screen="tension"
                      section="how-it-builds"
                      id="locked-desc"
                      originalContent="Pushing away what is happening. Tightens the jaw and shallowly freezes the breath."
                      textStyle={cardStyles.comparisonText}
                      type="paragraph"
                    />
                  </View>
                </View>
                <View style={cardStyles.comparisonItem}>
                  <Ionicons name="key-outline" size={18} color={CARD_COLORS.power} />
                  <View style={{ flex: 1 }}>
                    <EditableText
                      screen="tension"
                      section="how-it-builds"
                      id="open-title"
                      originalContent="The 'Yes' (Power)"
                      textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                      type="paragraph"
                    />
                    <EditableText
                      screen="tension"
                      section="how-it-builds"
                      id="open-desc"
                      originalContent="Agreeing with Reality. Allows the ribcage to expand and the energy to distribute."
                      textStyle={cardStyles.comparisonText}
                      type="paragraph"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 'releasing':
        return (
          <View style={styles.section}>
            <View style={cardStyles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <EditableText
                  screen="tension"
                  section="releasing"
                  id="practice-title"
                  originalContent="De-Armoring Practice"
                  textStyle={styles.practiceCardTitle}
                  type="title"
                />
                <Pressable
                  onPress={() => setShowTimer(true)}
                  style={styles.timerButton}
                >
                  <Ionicons name="time-outline" size={20} color={glowColor} />
                  <Text style={styles.timerButtonText}>2 Min Timer</Text>
                </Pressable>
              </View>

              <EditableText
                screen="tension"
                section="releasing"
                id="step-1"
                originalContent="1. Locate the physical core of the holding. Is it in the throat? The chest? The gut?"
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-2"
                originalContent="2. Stop trying to 'fix' it. Fixation is just another form of mental tension."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-3"
                originalContent="3. Surrender the 'No'. Inwardly say: 'It's okay for this tightness to be here.'"
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-4"
                originalContent="4. Imagine your awareness is a warm light shining *into* the density. The tightness will naturally soften as its reason for being (resistance) is removed."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
            </View>

            <View style={styles.interactiveBreathing}>
              <Text style={styles.interactiveTitle}>Fluid Breathing</Text>
              <FluidBreathing />
            </View>

            <View style={styles.melterContainer}>
              <Text style={styles.interactiveTitle}>Resistance Melter</Text>
              <ResistanceMelter />
            </View>
          </View>
        );

      case 'what-changes':
        return (
          <View style={styles.section}>
            <EditableText
              screen="tension"
              section="what-changes"
              id="intro"
              originalContent="When you release tension, you stop being a victim of your own biological 'freeze' response. You move from the level of Reaction to the level of Response."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="flash-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="tension"
                  section="what-changes"
                  id="fragility-title"
                  originalContent="The Strength of Water"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="tension"
                section="what-changes"
                id="fragility-text"
                originalContent="A tense person is fragile; they 'snap' under pressure. A released person is like water—they can absorb the shocks of life without becoming rigid. True Power is found in this holy lack of resistance."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.practiceCard}>
              <View style={styles.practiceHeader}>
                <Ionicons name="checkmark-circle-outline" size={20} color={CARD_COLORS.practice} />
                <EditableText
                  screen="tension"
                  section="what-changes"
                  id="results-title"
                  originalContent="Signs of Releasing"
                  textStyle={cardStyles.practiceTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="tension"
                section="what-changes"
                id="results-text"
                originalContent="• Spontaneous deep sighs (the body's reset).\n• Improved metabolic efficiency and higher energy levels.\n• A reduction in repetitive, circular thought-patterns.\n• Faster decision-making because you aren't 'fighting' the data.\n• A feeling of spaciousness behind the eyes."
                textStyle={cardStyles.practiceText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'related':
        return (
          <View style={styles.section}>
            <RelatedNextCard
              relatedIds={['relaxing', 'letting-go', 'preventing-stress', 'feelings-explained']}
              currentScreenId="tension"
            />
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
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <EditModeIndicator />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tension</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => handleTabPress(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.key && { color: glowColor, fontWeight: '700' }]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(activeTab)}
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
      paddingBottom: spacing.md,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    tabsContainer: { backgroundColor: theme.cardBackground, borderBottomWidth: 1, borderBottomColor: theme.border },
    tabsContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginRight: spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: theme.feelingsChapters.violet },
    tabText: { fontSize: typography.small, fontWeight: typography.medium, color: theme.textSecondary },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: 100 },
    section: { marginBottom: spacing.xl },
    practiceCard: { backgroundColor: theme.cardBackground, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.border },
    practiceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    practiceCardTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: theme.textPrimary },
    timerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.feelingsChapters.violet + '15', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
    timerButtonText: { marginLeft: spacing.xs, fontSize: typography.small, fontWeight: typography.semibold, color: theme.feelingsChapters.violet },
    practiceStepBody: { fontSize: typography.body, color: theme.textSecondary, lineHeight: 22, marginBottom: spacing.md },
    interactiveBreathing: { marginVertical: spacing.xl, alignItems: 'center' },
    interactiveTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: theme.textPrimary, marginBottom: spacing.lg, textAlign: 'center' },
    melterContainer: { marginTop: spacing.xl, alignItems: 'center' },
    practiceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  });
