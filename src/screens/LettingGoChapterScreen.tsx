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
import { getChapterById } from '../data/feelingsChapters';
import { RootStackParamList } from '../navigation/AppNavigator';
import PracticeTimerModal from '../components/PracticeTimerModal';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { useContentStructure } from '../hooks/useContentStructure';
import RelatedNextCard from '../components/RelatedNextCard';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chapter'>;
type ChapterRouteProp = RouteProp<RootStackParamList, 'Chapter'>;

type TabKey = 'what-this-really-is' | 'when-to-use-it' | 'how-to-practice' | 'what-starts-to-change' | 'when-you-feel-stuck' | 'related';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'what-this-really-is', label: 'Overview' },
  { key: 'when-to-use-it', label: 'Triggers' },
  { key: 'how-to-practice', label: 'Practice' },
  { key: 'what-starts-to-change', label: 'Benefits' },
  { key: 'when-you-feel-stuck', label: 'Traps' },
  { key: 'related', label: 'Related' },
];

export default function LettingGoChapterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChapterRouteProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
  const styles = getStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: number }>({});

  const chapter = getChapterById('letting-go');
  const glowColor = theme.feelingsChapters.violet;
  const [showTimer, setShowTimer] = useState(false);
  const TAB_STORAGE_KEY = '@letting_go:last_tab';

  const [activeTab, setActiveTab] = useState<TabKey>('what-this-really-is');
  const [isTabLoaded, setIsTabLoaded] = useState(false);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  const [showLettingGoExplanation, setShowLettingGoExplanation] = useState(false);

  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);

  useEffect(() => {
    if (hasSeenTutorial && !seenExplanations.includes('letting-go')) {
      const timer = setTimeout(() => {
        setShowLettingGoExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, seenExplanations]);

  const { structure, refreshStructure } = useContentStructure('letting-go', activeTab);

  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    const loadTab = async () => {
      const params = route.params;
      if (params?.tab) {
        const tabParam = params.tab as string;
        const tabMap: { [key: string]: TabKey } = {
          'key-takeaways': 'what-this-really-is',
          'when-to-use': 'when-to-use-it',
          'practice': 'how-to-practice',
          'benefits': 'what-starts-to-change',
          'common-blocks': 'when-you-feel-stuck',
          'how-to-practice': 'how-to-practice',
          'what-this-really-is': 'what-this-really-is',
          'when-to-use-it': 'when-to-use-it',
          'what-starts-to-change': 'what-starts-to-change',
          'when-you-feel-stuck': 'when-you-feel-stuck',
          'related': 'related',
        };
        const mappedKey = tabMap[tabParam] || tabParam as TabKey;
        if (isMounted && tabs.find(t => t.key === mappedKey)) {
          setActiveTab(mappedKey);
          setIsTabLoaded(true);
          return;
        }
      }
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
  }, [route.params?.tab]);

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
      case 'what-this-really-is':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <View style={cardStyles.keyInsightCard}>
              <View style={cardStyles.keyInsightHeader}>
                <Ionicons name="leaf-outline" size={20} color={CARD_COLORS.keyInsight} />
                <EditableText
                  screen="letting-go"
                  section="what-this-really-is"
                  id="key-insight-title"
                  originalContent="The Mechanism of Surrender"
                  textStyle={cardStyles.keyInsightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="key-insight"
                originalContent="Letting go is the simple process of surrendering resistance to a feeling, allowing the energy to run out of the underlying emotion so that it disappears."
                textStyle={cardStyles.keyInsightText}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-1"
              originalContent="Most of our lives are spent in a state of 'resistance'. We fight our feelings, we try to think them away, or we distract ourselves to avoid them. This resistance is like adding fuel to a fire—it keeps the emotional charge alive in our nervous system for decades."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="title-1"
              originalContent="The Dog and the Tail"
              textStyle={cardStyles.sectionTitle}
              type="title"
            />
            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-2"
              originalContent="Think of a feeling as a dog and thoughts as its tail. The mind tries to 'fix' the thoughts (the tail), but the thoughts are only moving because the feeling (the dog) is wagging them. If you let go of the feeling, the thousands of thoughts it generated will simply stop."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="letting-go"
                  section="what-this-really-is"
                  id="insight-title"
                  originalContent="Discharging the Pressure"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="insight-text"
                originalContent="Emotions are packets of energy stored in the body. When you let go, you are opening a pressure valve. You allow the energy to move through and out, rather than pushing it back down (Suppression) or burying it (Repression)."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'when-to-use-it':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="intro"
              originalContent="Surrender can be used at any time, in any situation. You don't need a quiet room or a special meditation posture. In fact, it is most powerful when used in the heat of a triggered moment."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.warningCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="flash-outline" size={20} color={CARD_COLORS.warning} />
                <EditableText
                  screen="letting-go"
                  section="when-to-use-it"
                  id="trigger-title"
                  originalContent="The Trigger is the Doorway"
                  textStyle={cardStyles.warningTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="trigger-text"
                originalContent="Whenever you feel a 'contraction' in your body or mind—a tight chest, a racing thought, a flash of annoyance—you have found a piece of suppressed energy ready to be released. This is your cue to practice."
                textStyle={cardStyles.warningText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.comparisonCard}>
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="comparison-title"
                originalContent="Reactive vs. Proactive"
                textStyle={cardStyles.comparisonTitle}
                type="title"
              />
              <View style={cardStyles.comparisonRow}>
                <View style={cardStyles.comparisonItem}>
                  <Ionicons name="thunderstorm-outline" size={18} color={CARD_COLORS.force} />
                  <View style={{ flex: 1 }}>
                    <EditableText
                      screen="letting-go"
                      section="when-to-use-it"
                      id="reactive-title"
                      originalContent="Reactive"
                      textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                      type="paragraph"
                    />
                    <EditableText
                      screen="letting-go"
                      section="when-to-use-it"
                      id="reactive-desc"
                      originalContent="Used in a crisis. Stops the fire from spreading but doesn't remove the fuel."
                      textStyle={cardStyles.comparisonText}
                      type="paragraph"
                    />
                  </View>
                </View>
                <View style={cardStyles.comparisonItem}>
                  <Ionicons name="sunny-outline" size={18} color={CARD_COLORS.power} />
                  <View style={{ flex: 1 }}>
                    <EditableText
                      screen="letting-go"
                      section="when-to-use-it"
                      id="proactive-title"
                      originalContent="Proactive"
                      textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                      type="paragraph"
                    />
                    <EditableText
                      screen="letting-go"
                      section="when-to-use-it"
                      id="proactive-desc"
                      originalContent="Daily practice of surrendering small annoyances. Clears the engine so the car runs better."
                      textStyle={cardStyles.comparisonText}
                      type="paragraph"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 'how-to-practice':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <View style={cardStyles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="practice-title"
                  originalContent="The Core Technique"
                  textStyle={styles.practiceCardTitle}
                  type="title"
                />
                <Pressable
                  onPress={() => setShowTimer(true)}
                  style={styles.timerButton}
                >
                  <Ionicons name="time-outline" size={20} color={glowColor} />
                  <Text style={styles.timerButtonText}>Start 2 Min Timer</Text>
                </Pressable>
              </View>

              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-1"
                originalContent="1. BE AWARE of a feeling. Where is it in the body? Feel its texture, weight, and temperature."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2"
                originalContent="2. LET THE FEELING BE THERE. Stop trying to change it, resist it, or explain it. Give it total permission to exist."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-3"
                originalContent="3. IGNORE THE THOUGHTS. Thoughts are endless and misleading. Focus only on the *physical sensation* of the feeling."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-4"
                originalContent="4. SURRENDER THE RESISTANCE. The pain is not in the feeling; the pain is in the *fight against* the feeling. Let go of the desire to make it go away."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-5"
                originalContent="5. WAIT. Stay with the sensation until it begins to shift or soften. Even a 2% shift is a success."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="tip-title"
                  originalContent="Don't Ask 'Why'?"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="tip-text"
                originalContent="The mind loves to ask 'Why am I feeling this?' This is a trap. The 'Why' keeps you in the head and feeds more thoughts. The 'How much' (intensity of sensation) is the only thing that matters for release."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'what-starts-to-change':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="what-starts-to-change"
              id="intro"
              originalContent="As you consistently surrender the negative pressure, your base level of consciousness begins to rise. You move from the heavy fields (Apathy, Grief, Fear) into the lighter ones (Courage, Neutrality, Willingness)."
              textStyle={cardStyles.paragraph}
              type="paragraph"
            />

            <View style={cardStyles.keyInsightCard}>
              <View style={cardStyles.keyInsightHeader}>
                <Ionicons name="battery-charging-outline" size={20} color={CARD_COLORS.keyInsight} />
                <EditableText
                  screen="letting-go"
                  section="what-starts-to-change"
                  id="energy-reclaim-title"
                  originalContent="Energy Reclamation"
                  textStyle={cardStyles.keyInsightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="energy-reclaim"
                originalContent="It takes immense energy to keep feelings suppressed. When you let them go, that energy is released back to you. You'll find you need less sleep, have more creativity, and feel more vibrant."
                textStyle={cardStyles.keyInsightText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.practiceCard}>
              <View style={styles.practiceHeader}>
                <Ionicons name="checkmark-circle-outline" size={20} color={CARD_COLORS.practice} />
                <EditableText
                  screen="letting-go"
                  section="what-starts-to-change"
                  id="signs-title"
                  originalContent="Signs of Success"
                  textStyle={cardStyles.practiceTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="signs-text"
                originalContent="• Spontaneous sighs or deep breaths.\n• A feeling of physical lightness.\n• Clarity of mind regarding a previously 'stuck' problem.\n• A sudden sense of compassion for yourself or others.\n• The 'trigger' no longer produces a reaction."
                textStyle={cardStyles.practiceText}
                type="paragraph"
              />
            </View>
          </View>
        );

      case 'when-you-feel-stuck':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <View style={cardStyles.warningCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="warning-outline" size={20} color={CARD_COLORS.warning} />
                <EditableText
                  screen="letting-go"
                  section="when-you-feel-stuck"
                  id="resistance-title"
                  originalContent="Resisting the Release"
                  textStyle={cardStyles.warningTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="resistance-text"
                originalContent="Sometimes we feel stuck because we are secretly enjoying the 'payoff' of the negative feeling. We might like feeling 'right' in our anger, or 'helpless' in our grief. You must want to be free more than you want to be right."
                textStyle={cardStyles.warningText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.insightCard}>
              <View style={cardStyles.cardIconHeader}>
                <Ionicons name="help-circle-outline" size={20} color={CARD_COLORS.insight} />
                <EditableText
                  screen="letting-go"
                  section="when-you-feel-stuck"
                  id="layers-title"
                  originalContent="Layers of the Onion"
                  textStyle={cardStyles.insightTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="layers-text"
                originalContent="If a feeling won't budge, it's often because there is another feeling *about* the first one. You might be 'guilty' that you are 'angry'. Let go of the guilt first, and the anger will become easier to release."
                textStyle={cardStyles.insightText}
                type="paragraph"
              />
            </View>

            <View style={cardStyles.practiceCard}>
              <View style={cardStyles.practiceHeader}>
                <Ionicons name="hand-right-outline" size={20} color={CARD_COLORS.practice} />
                <EditableText
                  screen="letting-go"
                  section="when-you-feel-stuck"
                  id="stuck-practice-title"
                  originalContent="Practice for Stuckness"
                  textStyle={cardStyles.practiceTitle}
                  type="title"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-practice"
                originalContent="1. Feel the stuckness as a physical pressure.\n2. Ask: 'Am I willing to let go of this resistance to letting go?'\n3. Even if the answer is 'No', simply *look* at the 'No'.\n4. Surrender the expectation that it *should* be moving faster.\n5. Rest in the neutrality of just witnessing the stuckness."
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
              relatedIds={['feelings-explained', 'relaxing', 'non-reactivity', 'tension']}
              currentScreenId="letting-go"
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
        <Text style={styles.headerTitle}>Letting Go</Text>
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

      <PracticeTimerModal visible={showTimer} onClose={() => setShowTimer(false)} initialMinutes={2} glowColor={glowColor} />

      <FeatureExplanationOverlay
        visible={showLettingGoExplanation}
        title="Mechanism of Letting Go"
        description="Learn the specific process of surrendering resistance to internal energy fields. This is the core practice of the app."
        icon="leaf-outline"
        onClose={() => { setShowLettingGoExplanation(false); markExplanationAsSeen('letting-go'); }}
      />
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
    sectionTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: theme.textPrimary, marginBottom: spacing.lg, marginTop: spacing.md },
    sectionBody: { fontSize: typography.body, color: theme.textSecondary, lineHeight: 24, marginBottom: spacing.md },
    bulletList: { marginBottom: spacing.md, marginLeft: spacing.xs },
    bulletItem: { fontSize: typography.body, color: theme.textSecondary, lineHeight: 24, marginBottom: spacing.xs },
    practiceCard: { backgroundColor: theme.cardBackground, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: theme.border },
    practiceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    practiceCardTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: theme.textPrimary },
    timerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.feelingsChapters.violet + '15', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
    timerButtonText: { marginLeft: spacing.xs, fontSize: typography.small, fontWeight: typography.semibold, color: theme.feelingsChapters.violet },
    practiceStepTitle: { fontSize: typography.body, fontWeight: typography.bold, color: theme.textPrimary, marginBottom: spacing.xs },
    practiceStepBody: { fontSize: typography.body, color: theme.textSecondary, lineHeight: 22, marginBottom: spacing.md },
    practiceTip: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: theme.feelingsChapters.violet + '10', padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.sm },
    practiceTipText: { flex: 1, marginLeft: spacing.sm, fontSize: typography.small, color: theme.textSecondary, fontStyle: 'italic' },
    practiceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  });
