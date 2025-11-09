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
import ContentBuilder from '../components/ContentBuilder';
import { useContentStructure } from '../hooks/useContentStructure';

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
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  
  // Load content structure for current tab
  const { structure, refreshStructure } = useContentStructure('letting-go', activeTab);
  
  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

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
          <View style={styles.section} key={structureRefreshKey}>
            {/* Key Takeaways Card */}
            <View style={styles.keyTakeawaysCard}>
              <Ionicons name="bulb-outline" size={24} color={glowColor} />
              <View style={styles.keyTakeawaysContent}>
                <EditableText
                  screen="letting-go"
                  section="what-this-really-is"
                  id="key-idea-title"
                  originalContent="Key idea"
                  textStyle={styles.keyTakeawaysTitle}
                  type="title"
                />
                <EditableText
                  screen="letting-go"
                  section="what-this-really-is"
                  id="key-idea-text-1"
                  originalContent={'If you\'re tired of trying to "think positive," trying to control every thought, trying coping skill after coping skill… and your feelings still come back?'}
                  textStyle={styles.keyTakeawaysText}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="what-this-really-is"
                  id="key-idea-text-2"
                  originalContent="Letting go is a different move."
                  textStyle={styles.keyTakeawaysText}
                  type="paragraph"
                />
              </View>
            </View>

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-1"
              originalContent={'It\'s not "pretend it\'s fine," and it\'s not "explode and call it healing."'}
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="title-1"
              originalContent="Letting go means:"
              textStyle={styles.sectionTitle}
              type="title"
            />
            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-2"
              originalContent="You let a feeling be here, without:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            <View style={styles.bulletList}>
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="bullet-1"
                originalContent="• pushing it down,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="bullet-2"
                originalContent="• judging yourself,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="bullet-3"
                originalContent="• spinning in stories,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-this-really-is"
                id="bullet-4"
                originalContent="• or acting it out."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-3"
              originalContent="You give the emotion permission to rise, move, and pass."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-4"
              originalContent={'Most people never learned this. We were taught to hide feelings, fix them, or fear them. No one said, "Hey, you can let this move through you."'}
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="what-this-really-is"
              id="para-5"
              originalContent="This is that missing instruction."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="letting-go"
              section="what-this-really-is"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'when-to-use-it':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="para-1"
              originalContent="Use this when you notice even a tiny bit of:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            <View style={styles.bulletList}>
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-1"
                originalContent={'• "Something\'s wrong with me."'}
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-2"
                originalContent="• Hopelessness, heaviness, numbness."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-3"
                originalContent="• Anxiety in your chest, stomach knots."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-4"
                originalContent={'• Shame after you "overreact."'}
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-5"
                originalContent="• That same old trigger coming back again."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-6"
                originalContent="• Overthinking that just makes it worse."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="para-2"
              originalContent="You don't have to wait for a meltdown."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="para-3"
              originalContent="If there's a lump in your throat, a tight jaw, a drop in your stomach, or a wave of sadness—that's already enough."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="title-1"
              originalContent="Letting go is something you can do:"
              textStyle={styles.sectionTitle}
              type="title"
            />
            <View style={styles.bulletList}>
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-7"
                originalContent="• in bed at 3am,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-8"
                originalContent="• in the bathroom at work,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-9"
                originalContent="• on a bus,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-10"
                originalContent="• while messaging someone,"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-to-use-it"
                id="bullet-11"
                originalContent="• right after you scroll something that hurt."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="letting-go"
              section="when-to-use-it"
              id="para-4"
              originalContent="No ritual. No perfect posture. Just you and what you're feeling."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="letting-go"
              section="when-to-use-it"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'how-to-practice':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="how-to-practice"
              id="intro-1"
              originalContent={'This is for you if you\'re tired, foggy, or scared you\'ll do it "wrong."'}
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            <EditableText
              screen="letting-go"
              section="how-to-practice"
              id="intro-2"
              originalContent="You can't fail this."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <View style={styles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="practice-title"
                  originalContent="Quick Practice"
                  textStyle={styles.practiceCardTitle}
                  type="title"
                />
                <Pressable
                  onPress={() => setShowTimer(true)}
                  style={styles.timerButton}
                  accessibilityLabel="Start 2 minute practice timer"
                >
                  <Ionicons name="time-outline" size={20} color={glowColor} />
                  <Text style={styles.timerButtonText}>Use this for 2 minutes</Text>
                </Pressable>
              </View>
              
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-1-title"
                originalContent="Step 1 – Notice it"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-1-body-1"
                originalContent={'Quietly say: "Okay. There\'s sadness here." or "There\'s panic here." or just: "There\'s a lot here."'}
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-1-body-2"
                originalContent="You're not blaming, not analyzing—just noticing."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2-title"
                originalContent="Step 2 – Let it be here"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2-body-1"
                originalContent="For a few breaths, let the feeling sit in your body."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2-body-2"
                originalContent="Where is it? Chest, throat, stomach, face?"
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2-body-3"
                originalContent="Let it be as big, heavy, annoying, or sharp as it is."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-2-body-4"
                originalContent={'You\'re not trying to "calm down." You\'re saying: "You\'re allowed to be here for a moment."'}
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-3-title"
                originalContent="Step 3 – Drop the fight"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-3-body-1"
                originalContent="For a few seconds, see if you can stop doing anything to it."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <View style={styles.bulletList}>
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-3-bullet-1"
                  originalContent="• No fixing."
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-3-bullet-2"
                  originalContent="• No telling yourself a story."
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-3-bullet-3"
                  originalContent="• No arguing with it."
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-3-bullet-4"
                  originalContent="• No acting on it."
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-3-body-2"
                originalContent="If you notice yourself fighting it—nice catch. Just gently let go of the fight."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-4-title"
                originalContent="Step 4 – Stay until it shifts (a little)"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-4-body-1"
                originalContent="Stay with the raw feeling for a short while."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-4-body-2"
                originalContent="You might notice:"
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <View style={styles.bulletList}>
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-4-bullet-1"
                  originalContent="• a softening,"
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-4-bullet-2"
                  originalContent="• a sigh,"
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-4-bullet-3"
                  originalContent="• a tiny bit more space,"
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-4-bullet-4"
                  originalContent="• or tears,"
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="step-4-bullet-5"
                  originalContent="• or nothing… and then later, it feels a bit lighter."
                  textStyle={styles.bulletItem}
                  type="paragraph"
                />
              </View>
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-4-body-3"
                originalContent="That shift—even 2%—means something released."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-5-title"
                originalContent="Step 5 – Repeat, without drama"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-5-body-1"
                originalContent="If it comes back, it doesn't mean you failed. It usually just means there is more of that feeling in the system."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="how-to-practice"
                id="step-5-body-2"
                originalContent="Each round is like letting a little air out of a too-full balloon."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <View style={styles.practiceTip}>
                <Ionicons name="bulb-outline" size={16} color={glowColor} />
                <EditableText
                  screen="letting-go"
                  section="how-to-practice"
                  id="tip-1"
                  originalContent={'Tiny win: If all you can do today is pause and say "I\'m not going to attack myself for feeling this," that is letting go.'}
                  textStyle={styles.practiceTipText}
                  type="paragraph"
                />
              </View>
            </View>
            
            <ContentBuilder
              screen="letting-go"
              section="how-to-practice"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'what-starts-to-change':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="what-starts-to-change"
              id="intro-1"
              originalContent="Not magic. Not overnight. But as you keep letting feelings move instead of trapping them:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            <View style={styles.bulletList}>
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-1"
                originalContent="• The same triggers feel a bit less sharp."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-2"
                originalContent="• Some worries don't bite as hard."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-3"
                originalContent="• You have more energy because you're not wrestling your inner world all day."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-4"
                originalContent="• You react less, regret less."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-5"
                originalContent="• You feel small pockets of peace in places you never had any."
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="what-starts-to-change"
                id="bullet-6"
                originalContent={'• You start to sense: "Maybe I\'m not broken. Maybe this feeling is just energy passing through."'}
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="letting-go"
              section="what-starts-to-change"
              id="para-1"
              originalContent="For some people this sits alongside therapy, meds, or other support. Letting go doesn't fight those; it supports them."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="letting-go"
              section="what-starts-to-change"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'when-you-feel-stuck':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="when-you-feel-stuck"
              id="title-1"
              originalContent="Common things that block letting go (and what to do):"
              textStyle={styles.sectionTitle}
              type="title"
            />

            <View style={styles.stuckCard}>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-1-question"
                originalContent={'"I don\'t feel anything."'}
                textStyle={styles.stuckQuestion}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-1-answer"
                originalContent={'Numb is a feeling. Start there. "Okay, numbness is here." Sit with that. No pressure.'}
                textStyle={styles.stuckAnswer}
                type="paragraph"
              />
            </View>

            <View style={styles.stuckCard}>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-2-question"
                originalContent={'"If I let this in, it\'ll destroy me."'}
                textStyle={styles.stuckQuestion}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-2-answer"
                originalContent={"Right now it's already hurting you from underground. Try 10 seconds. You're not diving into trauma alone; you're just letting a wave crest and fall. If it's too intense, pause and get support."}
                textStyle={styles.stuckAnswer}
                type="paragraph"
              />
            </View>

            <View style={styles.stuckCard}>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-3-question"
                originalContent={'"I\'ve tried everything. Nothing works."'}
                textStyle={styles.stuckQuestion}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-3-answer"
                originalContent="Totally fair. Letting go is not another performance test. Think of it as dropping effort for a moment, not adding more."
                textStyle={styles.stuckAnswer}
                type="paragraph"
              />
            </View>

            <View style={styles.stuckCard}>
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-4-question"
                originalContent={'"I need professional help."'}
                textStyle={styles.stuckQuestion}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-4-answer-1"
                originalContent={'If your mind is going to self-harm, "I don\'t want to be here," or you can\'t function:'}
                textStyle={styles.stuckAnswer}
                type="paragraph"
              />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="stuck-4-answer-2"
                originalContent="Letting go is not meant to replace real-world help. Reach out to a therapist, doctor, trusted person, or crisis service in your country. You deserve support with this."
                textStyle={styles.stuckAnswer}
                type="paragraph"
              />
            </View>

            <View style={styles.safetyCard}>
              <Ionicons name="heart-outline" size={20} color={glowColor} />
              <EditableText
                screen="letting-go"
                section="when-you-feel-stuck"
                id="safety-text"
                originalContent={"If you're thinking about hurting yourself or can't cope, please reach out to a professional or crisis service. This is emotional support, not medical care. You can use it alongside therapy or medication."}
                textStyle={styles.safetyText}
                type="paragraph"
              />
            </View>
            
            <ContentBuilder
              screen="letting-go"
              section="when-you-feel-stuck"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'related':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="letting-go"
              section="related"
              id="title"
              originalContent="Related"
              textStyle={styles.sectionTitle}
              type="title"
            />
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
            
            <ContentBuilder
              screen="letting-go"
              section="related"
              onStructureChange={handleStructureChange}
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
