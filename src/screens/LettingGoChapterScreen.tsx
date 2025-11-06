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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chapter'>;
type ChapterRouteProp = RouteProp<RootStackParamList, 'Chapter'>;

type TabKey = 'what-this-really-is' | 'when-to-use-it' | 'how-to-practice' | 'what-starts-to-change' | 'when-you-feel-stuck' | 'related';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'what-this-really-is', label: 'What This Really Is' },
  { key: 'when-to-use-it', label: 'When To Use It' },
  { key: 'how-to-practice', label: 'How To Practice' },
  { key: 'what-starts-to-change', label: 'What Starts To Change' },
  { key: 'when-you-feel-stuck', label: 'When You Feel Stuck' },
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
  const [showTimer, setShowTimer] = useState(false);
  const TAB_STORAGE_KEY = '@letting_go:last_tab';
  
  // Get initial tab from deep link, stored preference, or default
  const [activeTab, setActiveTab] = useState<TabKey>('what-this-really-is');
  const [isTabLoaded, setIsTabLoaded] = useState(false);

  // Load last active tab from storage or route params
  useEffect(() => {
    let isMounted = true;
    
    const loadTab = async () => {
      // Check if route params include a tab (deep link takes priority)
      const params = route.params;
      if (params?.tab) {
        const tabParam = params.tab as string;
        // Map old tab names to new ones for backward compatibility
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
      
      // Otherwise, load from storage
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
    
    return () => {
      isMounted = false;
    };
  }, [route.params?.tab]);

  // Save active tab when it changes
  useEffect(() => {
    if (isTabLoaded) {
      AsyncStorage.setItem(TAB_STORAGE_KEY, activeTab).catch((error) => {
        console.error('Failed to save last tab:', error);
      });
    }
  }, [activeTab, isTabLoaded]);

  // Get related chapters
  const relatedChapters = chapter
    ? chapter.relatedChapters
        .map((id) => getChapterById(id))
        .filter((c) => c !== undefined)
    : [];

  const handleTabPress = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    // Scroll to section
    if (sectionRefs.current[tab] !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: sectionRefs.current[tab],
        animated: true,
      });
    }
  }, []);

  const handleRelatedChapterPress = useCallback((chapterId: string) => {
    // Use requestAnimationFrame to ensure navigation happens after current render cycle
    requestAnimationFrame(() => {
      navigation.navigate('Chapter', { chapterId });
    });
  }, [navigation]);

  const handleCouragePress = useCallback(() => {
    navigation.navigate('LevelDetail', { levelId: 'courage' });
  }, [navigation]);

  const renderSection = (tab: TabKey) => {
    switch (tab) {
      case 'what-this-really-is':
        return (
          <View style={styles.section}>
            {/* Key Takeaways Card */}
            <View style={styles.keyTakeawaysCard}>
              <Ionicons name="bulb-outline" size={24} color={glowColor} />
              <View style={styles.keyTakeawaysContent}>
                <Text style={styles.keyTakeawaysTitle}>Key idea</Text>
                <Text style={styles.keyTakeawaysText}>
                  If you're tired of trying to "think positive," trying to control every thought, trying coping skill after coping skill… and your feelings still come back?
                </Text>
                <Text style={styles.keyTakeawaysText}>
                  Letting go is a different move.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionBody}>
              It's not "pretend it's fine," and it's not "explode and call it healing."
            </Text>

            <Text style={styles.sectionTitle}>Letting go means:</Text>
            <Text style={styles.sectionBody}>
              You let a feeling be here, without:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• pushing it down,</Text>
              <Text style={styles.bulletItem}>• judging yourself,</Text>
              <Text style={styles.bulletItem}>• spinning in stories,</Text>
              <Text style={styles.bulletItem}>• or acting it out.</Text>
            </View>

            <Text style={styles.sectionBody}>
              You give the emotion permission to rise, move, and pass.
            </Text>

            <Text style={styles.sectionBody}>
              Most people never learned this. We were taught to hide feelings, fix them, or fear them. No one said, "Hey, you can let this move through you."
            </Text>

            <Text style={styles.sectionBody}>
              This is that missing instruction.
            </Text>
          </View>
        );

      case 'when-to-use-it':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              Use this when you notice even a tiny bit of:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• "Something's wrong with me."</Text>
              <Text style={styles.bulletItem}>• Hopelessness, heaviness, numbness.</Text>
              <Text style={styles.bulletItem}>• Anxiety in your chest, stomach knots.</Text>
              <Text style={styles.bulletItem}>• Shame after you "overreact."</Text>
              <Text style={styles.bulletItem}>• That same old trigger coming back again.</Text>
              <Text style={styles.bulletItem}>• Overthinking that just makes it worse.</Text>
            </View>

            <Text style={styles.sectionBody}>
              You don't have to wait for a meltdown.
            </Text>

            <Text style={styles.sectionBody}>
              If there's a lump in your throat, a tight jaw, a drop in your stomach, or a wave of sadness—that's already enough.
            </Text>

            <Text style={styles.sectionTitle}>Letting go is something you can do:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• in bed at 3am,</Text>
              <Text style={styles.bulletItem}>• in the bathroom at work,</Text>
              <Text style={styles.bulletItem}>• on a bus,</Text>
              <Text style={styles.bulletItem}>• while messaging someone,</Text>
              <Text style={styles.bulletItem}>• right after you scroll something that hurt.</Text>
            </View>

            <Text style={styles.sectionBody}>
              No ritual. No perfect posture. Just you and what you're feeling.
            </Text>
          </View>
        );

      case 'how-to-practice':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              This is for you if you're tired, foggy, or scared you'll do it "wrong."
            </Text>
            <Text style={styles.sectionBody}>
              You can't fail this.
            </Text>
            
            <View style={styles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <Text style={styles.practiceCardTitle}>Quick Practice</Text>
                <Pressable
                  onPress={() => setShowTimer(true)}
                  style={styles.timerButton}
                  accessibilityLabel="Start 2 minute practice timer"
                >
                  <Ionicons name="time-outline" size={20} color={glowColor} />
                  <Text style={styles.timerButtonText}>Use this for 2 minutes</Text>
                </Pressable>
              </View>
              
              <Text style={styles.practiceStep}>Step 1 – Notice it</Text>
              <Text style={styles.practiceStepBody}>
                Quietly say: "Okay. There's sadness here." or "There's panic here." or just: "There's a lot here."
              </Text>
              <Text style={styles.practiceStepBody}>
                You're not blaming, not analyzing—just noticing.
              </Text>

              <Text style={styles.practiceStep}>Step 2 – Let it be here</Text>
              <Text style={styles.practiceStepBody}>
                For a few breaths, let the feeling sit in your body.
              </Text>
              <Text style={styles.practiceStepBody}>
                Where is it? Chest, throat, stomach, face?
              </Text>
              <Text style={styles.practiceStepBody}>
                Let it be as big, heavy, annoying, or sharp as it is.
              </Text>
              <Text style={styles.practiceStepBody}>
                You're not trying to "calm down." You're saying: "You're allowed to be here for a moment."
              </Text>

              <Text style={styles.practiceStep}>Step 3 – Drop the fight</Text>
              <Text style={styles.practiceStepBody}>
                For a few seconds, see if you can stop doing anything to it.
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• No fixing.</Text>
                <Text style={styles.bulletItem}>• No telling yourself a story.</Text>
                <Text style={styles.bulletItem}>• No arguing with it.</Text>
                <Text style={styles.bulletItem}>• No acting on it.</Text>
              </View>
              <Text style={styles.practiceStepBody}>
                If you notice yourself fighting it—nice catch. Just gently let go of the fight.
              </Text>

              <Text style={styles.practiceStep}>Step 4 – Stay until it shifts (a little)</Text>
              <Text style={styles.practiceStepBody}>
                Stay with the raw feeling for a short while.
              </Text>
              <Text style={styles.practiceStepBody}>
                You might notice:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• a softening,</Text>
                <Text style={styles.bulletItem}>• a sigh,</Text>
                <Text style={styles.bulletItem}>• a tiny bit more space,</Text>
                <Text style={styles.bulletItem}>• or tears,</Text>
                <Text style={styles.bulletItem}>• or nothing… and then later, it feels a bit lighter.</Text>
              </View>
              <Text style={styles.practiceStepBody}>
                That shift—even 2%—means something released.
              </Text>

              <Text style={styles.practiceStep}>Step 5 – Repeat, without drama</Text>
              <Text style={styles.practiceStepBody}>
                If it comes back, it doesn't mean you failed. It usually just means there is more of that feeling in the system.
              </Text>
              <Text style={styles.practiceStepBody}>
                Each round is like letting a little air out of a too-full balloon.
              </Text>

              <View style={styles.practiceTip}>
                <Ionicons name="bulb-outline" size={16} color={glowColor} />
                <Text style={styles.practiceTipText}>
                  Tiny win: If all you can do today is pause and say "I'm not going to attack myself for feeling this," that is letting go.
                </Text>
              </View>
            </View>
          </View>
        );

      case 'what-starts-to-change':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              Not magic. Not overnight. But as you keep letting feelings move instead of trapping them:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• The same triggers feel a bit less sharp.</Text>
              <Text style={styles.bulletItem}>• Some worries don't bite as hard.</Text>
              <Text style={styles.bulletItem}>• You have more energy because you're not wrestling your inner world all day.</Text>
              <Text style={styles.bulletItem}>• You react less, regret less.</Text>
              <Text style={styles.bulletItem}>• You feel small pockets of peace in places you never had any.</Text>
              <Text style={styles.bulletItem}>• You start to sense: "Maybe I'm not broken. Maybe this feeling is just energy passing through."</Text>
            </View>

            <Text style={styles.sectionBody}>
              For some people this sits alongside therapy, meds, or other support. Letting go doesn't fight those; it supports them.
            </Text>
          </View>
        );

      case 'when-you-feel-stuck':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common things that block letting go (and what to do):</Text>

            <View style={styles.stuckCard}>
              <Text style={styles.stuckQuestion}>"I don't feel anything."</Text>
              <Text style={styles.stuckAnswer}>
                Numb is a feeling. Start there. "Okay, numbness is here." Sit with that. No pressure.
              </Text>
            </View>

            <View style={styles.stuckCard}>
              <Text style={styles.stuckQuestion}>"If I let this in, it'll destroy me."</Text>
              <Text style={styles.stuckAnswer}>
                Right now it's already hurting you from underground. Try 10 seconds. You're not diving into trauma alone; you're just letting a wave crest and fall. If it's too intense, pause and get support.
              </Text>
            </View>

            <View style={styles.stuckCard}>
              <Text style={styles.stuckQuestion}>"I've tried everything. Nothing works."</Text>
              <Text style={styles.stuckAnswer}>
                Totally fair. Letting go is not another performance test. Think of it as dropping effort for a moment, not adding more.
              </Text>
            </View>

            <View style={styles.stuckCard}>
              <Text style={styles.stuckQuestion}>"I need professional help."</Text>
              <Text style={styles.stuckAnswer}>
                If your mind is going to self-harm, "I don't want to be here," or you can't function:
              </Text>
              <Text style={styles.stuckAnswer}>
                Letting go is not meant to replace real-world help. Reach out to a therapist, doctor, trusted person, or crisis service in your country. You deserve support with this.
              </Text>
            </View>

            <View style={styles.safetyCard}>
              <Ionicons name="heart-outline" size={20} color={glowColor} />
              <Text style={styles.safetyText}>
                If you're thinking about hurting yourself or can't cope, please reach out to a professional or crisis service. This is emotional support, not medical care. You can use it alongside therapy or medication.
              </Text>
            </View>
          </View>
        );

      case 'related':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related</Text>
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
              {/* Courage Level Link */}
              <Pressable
                onPress={handleCouragePress}
                style={[
                  styles.relatedChip,
                  {
                    backgroundColor: theme.feelingsChapters.violet + '20',
                    borderColor: theme.feelingsChapters.violet,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.relatedChipText,
                    { color: theme.feelingsChapters.violet },
                  ]}
                >
                  Courage
                </Text>
              </Pressable>
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
          Letting Go
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          A kinder way to be with your feelings, instead of fighting them.
        </Text>
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

      {/* Timer Modal */}
      <PracticeTimerModal
        visible={showTimer}
        onClose={() => setShowTimer(false)}
        durationMinutes={2}
      />
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
    keyTakeawaysCard: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.feelingsChapters.violet,
      gap: spacing.md,
    },
    keyTakeawaysContent: {
      flex: 1,
    },
    keyTakeawaysTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    keyTakeawaysText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xs,
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
    bulletList: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
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
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    practiceCardTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    timerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.feelingsChapters.violet,
      backgroundColor: theme.feelingsChapters.violet + '10',
    },
    timerButtonText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.feelingsChapters.violet,
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
    stuckCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    stuckQuestion: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
      fontStyle: 'italic',
    },
    stuckAnswer: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xs,
    },
    safetyCard: {
      flexDirection: 'row',
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.lg,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.feelingsChapters.violet + '30',
    },
    safetyText: {
      flex: 1,
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 20,
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
