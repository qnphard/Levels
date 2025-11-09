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
import PracticeTimerModal from '../components/PracticeTimerModal';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import ContentBuilder from '../components/ContentBuilder';
import { useContentStructure } from '../hooks/useContentStructure';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabKey = 'what-it-is' | 'how-it-builds' | 'why-quick-fixes-dont-work' | 'recognizing' | 'releasing' | 'contemplation' | 'what-changes' | 'related';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'what-it-is', label: 'What It Is' },
  { key: 'how-it-builds', label: 'How It Builds' },
  { key: 'why-quick-fixes-dont-work', label: 'Why Quick Fixes Don\'t Work' },
  { key: 'recognizing', label: 'Recognizing' },
  { key: 'releasing', label: 'Releasing' },
  { key: 'contemplation', label: 'Contemplation' },
  { key: 'what-changes', label: 'What Changes' },
  { key: 'related', label: 'Related' },
];

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function TensionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: number }>({});
  
  const glowColor = theme.feelingsChapters.violet;
  const [showTimer, setShowTimer] = useState(false);
  const TAB_STORAGE_KEY = '@tension:last_tab';
  
  const [activeTab, setActiveTab] = useState<TabKey>('what-it-is');
  const [isTabLoaded, setIsTabLoaded] = useState(false);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  
  // Load content structure for current tab
  const { structure, refreshStructure } = useContentStructure('tension', activeTab);
  
  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

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
    
    return () => {
      isMounted = false;
    };
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
    if (sectionRefs.current[tab] !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: sectionRefs.current[tab],
        animated: true,
      });
    }
  }, []);

  const handleRelatedPress = useCallback((id: string) => {
    requestAnimationFrame(() => {
      if (id === 'learn-hub') {
        navigation.navigate('LearnHub');
      } else if (id === 'mantras') {
        navigation.navigate('Mantras');
      } else if (id === 'what-you-really-are') {
        navigation.navigate('WhatYouReallyAre');
      } else {
        // Assume it's a chapter ID
        navigation.navigate('Chapter', { chapterId: id });
      }
    });
  }, [navigation]);

  const renderSection = (tab: TabKey) => {
    switch (tab) {
      case 'what-it-is':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <View style={styles.quoteCard}>
              <Ionicons name="bulb-outline" size={24} color={glowColor} />
              <View style={styles.quoteContent}>
                <EditableText
                  screen="tension"
                  section="what-it-is"
                  id="quote-1"
                  originalContent="Tension isn't just tight muscles — it's the body holding on to emotions we haven't fully allowed."
                  textStyle={styles.quoteText}
                  type="quote"
                />
              </View>
            </View>

            <EditableText
              screen="tension"
              section="what-it-is"
              id="para-1"
              originalContent="The body itself doesn't feel; it's experienced through the mind, and the whole experience appears in consciousness, which is seen through awareness."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="what-it-is"
              id="para-2"
              originalContent="When feelings like fear, anger, or guilt are resisted, their energy gets stored as pressure."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="what-it-is"
              id="para-3"
              originalContent="That pressure becomes the heaviness in your chest, the tight jaw, the anxious pulse."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="what-it-is"
              id="para-4"
              originalContent="Tension is the body's side of emotional resistance. When resistance drops, the body unwinds on its own."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="tension"
              section="what-it-is"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'how-it-builds':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="tension"
              section="how-it-builds"
              id="intro-1"
              originalContent="Tension builds through layers of resistance:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <View style={styles.conceptCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-resistance-title"
                originalContent="Resistance"
                textStyle={styles.conceptTitle}
                type="title"
              />
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-resistance-body"
                originalContent="I don't want to feel this."
                textStyle={styles.conceptBody}
                type="paragraph"
              />
            </View>

            <View style={styles.conceptCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-suppression-title"
                originalContent="Suppression"
                textStyle={styles.conceptTitle}
                type="title"
              />
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-suppression-body"
                originalContent={'"I\'m fine."'}
                textStyle={styles.conceptBody}
                type="paragraph"
              />
            </View>

            <View style={styles.conceptCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-worry-title"
                originalContent="Worry & Guilt"
                textStyle={styles.conceptTitle}
                type="title"
              />
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-worry-body"
                originalContent="The mind replays what it can't fix."
                textStyle={styles.conceptBody}
                type="paragraph"
              />
            </View>

            <View style={styles.conceptCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-wantingness-title"
                originalContent="Wantingness"
                textStyle={styles.conceptTitle}
                type="title"
              />
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-wantingness-body"
                originalContent={'"I\'ll relax when I get what I want."'}
                textStyle={styles.conceptBody}
                type="paragraph"
              />
            </View>

            <View style={styles.conceptCard}>
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-control-title"
                originalContent="Constant Control"
                textStyle={styles.conceptTitle}
                type="title"
              />
              <EditableText
                screen="tension"
                section="how-it-builds"
                id="concept-control-body"
                originalContent="The ego's habit of managing every detail."
                textStyle={styles.conceptBody}
                type="paragraph"
              />
            </View>

            <EditableText
              screen="tension"
              section="how-it-builds"
              id="conclusion-1"
              originalContent="Each act of pushing away an emotion adds another layer of tightness."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="tension"
              section="how-it-builds"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'why-quick-fixes-dont-work':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <View style={styles.quoteCard}>
              <Ionicons name="alert-circle-outline" size={24} color={glowColor} />
              <View style={styles.quoteContent}>
                <EditableText
                  screen="tension"
                  section="why-quick-fixes-dont-work"
                  id="quote-1"
                  originalContent="Many stress-reduction programs merely relieve the after-effects — like muscle tension, shallow breathing, or fatigue — without addressing the cause."
                  textStyle={styles.quoteText}
                  type="quote"
                />
              </View>
            </View>

            <EditableText
              screen="tension"
              section="why-quick-fixes-dont-work"
              id="para-1"
              originalContent="They massage the symptoms, not the root."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="why-quick-fixes-dont-work"
              id="para-2"
              originalContent="The real source of tension isn't the world; it's the pressure of repressed feelings inside."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="why-quick-fixes-dont-work"
              id="para-3"
              originalContent="Until that energy is released, the body re-tightens again and again."
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="tension"
              section="why-quick-fixes-dont-work"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'recognizing':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="tension"
              section="recognizing"
              id="intro-1"
              originalContent="You might notice:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <View style={styles.bulletList}>
              <EditableText
                screen="tension"
                section="recognizing"
                id="bullet-1"
                originalContent="• A knot in your stomach"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="recognizing"
                id="bullet-2"
                originalContent="• Tight shoulders or jaw"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="recognizing"
                id="bullet-3"
                originalContent="• Headaches after arguments"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="recognizing"
                id="bullet-4"
                originalContent="• Restlessness, irritability, fatigue"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="recognizing"
                id="bullet-5"
                originalContent='• Feeling "on edge" with no clear reason'
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <View style={styles.quoteCard}>
              <Ionicons name="heart-outline" size={24} color={glowColor} />
              <View style={styles.quoteContent}>
                <EditableText
                  screen="tension"
                  section="recognizing"
                  id="quote-1"
                  originalContent="These are not enemies. They're signals pointing to what needs releasing, not fixing."
                  textStyle={styles.quoteText}
                  type="quote"
                />
              </View>
            </View>
            
            <ContentBuilder
              screen="tension"
              section="recognizing"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'releasing':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="tension"
              section="releasing"
              id="intro-1"
              originalContent="A simple letting-go practice:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <View style={styles.practiceCard}>
              <View style={styles.practiceCardHeader}>
                <EditableText
                  screen="tension"
                  section="releasing"
                  id="practice-title"
                  originalContent="Quick Practice"
                  textStyle={styles.practiceCardTitle}
                  type="title"
                />
                <Pressable
                  onPress={() => setShowTimer(true)}
                  style={styles.timerButton}
                  accessibilityLabel="Start 2 minute release practice timer"
                >
                  <Ionicons name="time-outline" size={20} color={glowColor} />
                  <Text style={styles.timerButtonText}>Try a 2-Minute Release</Text>
                </Pressable>
              </View>
              
              <EditableText
                screen="tension"
                section="releasing"
                id="step-1-title"
                originalContent="1. Pause and notice"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-1-body"
                originalContent="Notice where the tightness lives."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="tension"
                section="releasing"
                id="step-2-title"
                originalContent="2. Allow it"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-2-body"
                originalContent="Let the sensation be exactly as it is."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="tension"
                section="releasing"
                id="step-3-title"
                originalContent="3. Drop resistance"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-3-body"
                originalContent={'Instead of "I hate this," try "It\'s okay for this to be here right now."'}
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="tension"
                section="releasing"
                id="step-4-title"
                originalContent="4. Breathe and wait"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-4-body"
                originalContent="A small sigh, warmth, or softening means energy is moving."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <EditableText
                screen="tension"
                section="releasing"
                id="step-5-title"
                originalContent="5. Repeat gently"
                textStyle={styles.practiceStep}
                type="title"
              />
              <EditableText
                screen="tension"
                section="releasing"
                id="step-5-body"
                originalContent="When it reappears — the charge lessens each time."
                textStyle={styles.practiceStepBody}
                type="paragraph"
              />

              <View style={styles.practiceTip}>
                <Ionicons name="bulb-outline" size={16} color={glowColor} />
                <EditableText
                  screen="tension"
                  section="releasing"
                  id="tip-1"
                  originalContent="Tension dissolves when you stop trying to control it. Freedom begins with allowing."
                  textStyle={styles.practiceTipText}
                  type="paragraph"
                />
              </View>
            </View>
            
            <ContentBuilder
              screen="tension"
              section="releasing"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'contemplation':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="tension"
              section="contemplation"
              id="para-1"
              originalContent="When the mind won't stop looping, gently repeating a truthful mantra can help shift awareness away from the story and back into calm presence."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <EditableText
              screen="tension"
              section="contemplation"
              id="para-2"
              originalContent="Mantras focus attention, slow the nervous system, and remind the mind that peace is already here."
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <View style={styles.quoteCard}>
              <Ionicons name="quote-outline" size={24} color={glowColor} />
              <View style={styles.quoteContent}>
                <EditableText
                  screen="tension"
                  section="contemplation"
                  id="mantra-1"
                  originalContent='"I am safe to feel what I feel."'
                  textStyle={styles.quoteText}
                  type="mantra"
                />
                <EditableText
                  screen="tension"
                  section="contemplation"
                  id="mantra-2"
                  originalContent='"This moment is allowed."'
                  textStyle={styles.quoteText}
                  type="mantra"
                />
                <EditableText
                  screen="tension"
                  section="contemplation"
                  id="mantra-3"
                  originalContent='"Let it be as it is."'
                  textStyle={styles.quoteText}
                  type="mantra"
                />
              </View>
            </View>

            <EditableText
              screen="tension"
              section="contemplation"
              id="para-3"
              originalContent="(See the Mantras section in Essentials for more guidance and suggested phrases.)"
              textStyle={styles.sectionBody}
              type="paragraph"
            />
            
            <ContentBuilder
              screen="tension"
              section="contemplation"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'what-changes':
        return (
          <View style={styles.section} key={structureRefreshKey}>
            <EditableText
              screen="tension"
              section="what-changes"
              id="intro-1"
              originalContent="As you keep letting go, stress stops forming instead of needing to be treated:"
              textStyle={styles.sectionBody}
              type="paragraph"
            />

            <View style={styles.bulletList}>
              <EditableText
                screen="tension"
                section="what-changes"
                id="bullet-1"
                originalContent="• Muscles and breathing relax naturally"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="what-changes"
                id="bullet-2"
                originalContent="• The mind becomes quieter without forcing it"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="what-changes"
                id="bullet-3"
                originalContent="• Energy returns for creativity and joy"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="what-changes"
                id="bullet-4"
                originalContent="• Old stress patterns lose their grip"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
              <EditableText
                screen="tension"
                section="what-changes"
                id="bullet-5"
                originalContent="• Peace feels more like the default, not the goal"
                textStyle={styles.bulletItem}
                type="paragraph"
              />
            </View>

            <View style={styles.quoteCard}>
              <Ionicons name="sparkles-outline" size={24} color={glowColor} />
              <View style={styles.quoteContent}>
                <EditableText
                  screen="tension"
                  section="what-changes"
                  id="quote-1"
                  originalContent="As you keep letting go, stress stops forming instead of needing to be treated."
                  textStyle={styles.quoteText}
                  type="quote"
                />
              </View>
            </View>
            
            <ContentBuilder
              screen="tension"
              section="what-changes"
              onStructureChange={handleStructureChange}
            />
          </View>
        );

      case 'related':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related</Text>
            <View style={styles.relatedChips}>
              <Pressable
                onPress={() => handleRelatedPress('learn-hub')}
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
                  Feelings Explained
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRelatedPress('letting-go')}
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
                  Letting Go
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRelatedPress('stress')}
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
                  Preventing Stress at the Source
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRelatedPress('mantras')}
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
                  Mantras
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleRelatedPress('what-you-really-are')}
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
                  Awareness
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
          Tension
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          Understanding the pressure beneath stress, pain, and restlessness
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
                    // Add glow shadow effects when glow is enabled
                    ...(glowEnabled && theme.mode === 'dark'
                      ? {
                          shadowColor: glowColor,
                          shadowOpacity: 0.5,
                          shadowRadius: 12,
                          shadowOffset: { width: 0, height: 2 },
                          elevation: 0,
                        }
                      : glowEnabled && theme.mode === 'light'
                      ? {
                          shadowColor: glowColor,
                          shadowOpacity: 0.4,
                          shadowRadius: 10,
                          shadowOffset: { width: 0, height: 2 },
                          elevation: 0,
                        }
                      : {}),
                  },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && { color: glowColor },
                    // Add text shadow glow for active tabs when glow is enabled
                    isActive && glowEnabled && {
                      textShadowColor: toRgba(glowColor, 0.6),
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    },
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
      minHeight: 44,
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
    quoteCard: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
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
      marginBottom: spacing.xs,
      fontStyle: 'italic',
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
    conceptCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    conceptTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    conceptBody: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xs,
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
      minHeight: 44,
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

