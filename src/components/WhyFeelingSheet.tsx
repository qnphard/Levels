import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { feelingsChapters, getChapterById } from '../data/feelingsChapters';
import { emotionClusters, getUniversalEmotions } from '../data/emotions';
import { getPrimaryRoute, fuzzyMatchEmotion } from '../data/emotionRouting';
import { getLevelById } from '../data/levels';
import { useEmotionHistory } from '../hooks/useEmotionHistory';
import { levelExplanations, getCopingTrapText } from '../data/levelExplanations';
import { RootStackParamList } from '../navigation/AppNavigator';

interface WhyFeelingSheetProps {
  visible: boolean;
  onClose: () => void;
  prefillEmotion?: string;
}

type Step = 1 | 2 | 3;

type SituationOption =
  | 'conflict'
  | 'silence'
  | 'criticism'
  | 'body-symptoms'
  | 'overthinking'
  | 'urge-to-vent'
  | 'urge-to-escape'
  | 'social-media-spiral'
  | 'after-breakup'
  | 'body-tightness'
  | 'rumination'
  | 'overwhelming'
  // New situations
  | 'work-deadline'
  | 'financial-worry'
  | 'health-anxiety'
  | 'loneliness'
  | 'family-conflict'
  | 'existential'
  | 'creative-block'
  | 'rejection'
  | 'boredom';

const SITUATION_OPTIONS: { value: SituationOption; label: string; icon: string }[] = [
  { value: 'conflict', label: 'Conflict/Argument', icon: 'chatbubbles-outline' },
  { value: 'criticism', label: 'Criticism/Judgment', icon: 'eye-outline' },
  { value: 'silence', label: 'Silence/Uncertainty', icon: 'ellipsis-horizontal-outline' },
  { value: 'overwhelming', label: 'Too much at once', icon: 'flash-outline' },
  { value: 'body-symptoms', label: 'Tight chest, jaw, or gut', icon: 'body-outline' },
  { value: 'rumination', label: 'Overthinking/Rumination', icon: 'repeat-outline' },
  { value: 'social-media-spiral', label: 'Social media spiral', icon: 'share-social-outline' },
  { value: 'after-breakup', label: 'After breakup', icon: 'heart-dislike-outline' },
  { value: 'urge-to-escape', label: 'Urge to escape/numb', icon: 'exit-outline' },
  { value: 'urge-to-vent', label: 'Urge to vent/complain', icon: 'megaphone-outline' },
  // New common situations
  { value: 'work-deadline', label: 'Work stress / deadline', icon: 'briefcase-outline' },
  { value: 'financial-worry', label: 'Money / financial worry', icon: 'cash-outline' },
  { value: 'health-anxiety', label: 'Health anxiety', icon: 'fitness-outline' },
  { value: 'loneliness', label: 'Loneliness / isolation', icon: 'person-outline' },
  { value: 'family-conflict', label: 'Family tension', icon: 'people-outline' },
  { value: 'existential', label: 'Existential questioning', icon: 'help-circle-outline' },
  { value: 'creative-block', label: 'Creative block / stuck', icon: 'color-palette-outline' },
  { value: 'rejection', label: 'Rejection / exclusion', icon: 'close-circle-outline' },
  { value: 'boredom', label: 'Boredom / emptiness', icon: 'sad-outline' },
];

const LEVEL_INFO_MAP: Record<string, { icon: string; label: string }> = {
  shame: { icon: 'eye-off-outline', label: 'The distinction:' },
  guilt: { icon: 'hammer-outline', label: 'The purpose:' },
  apathy: { icon: 'snow-outline', label: 'What it really is:' },
  grief: { icon: 'water-outline', label: 'The meaning:' },
  fear: { icon: 'skull-outline', label: 'Stress angle:' },
  desire: { icon: 'flame-outline', label: 'What it points to:' },
  anger: { icon: 'flash-outline', label: 'What it shows:' },
  pride: { icon: 'ribbon-outline', label: 'What protects:' },
};

const CLUSTER_INFO: Record<string, { icon: string }> = {
  shame: { icon: 'eye-off-outline' },
  guilt: { icon: 'hammer-outline' },
  apathy: { icon: 'snow-outline' },
  grief: { icon: 'water-outline' },
  fear: { icon: 'skull-outline' },
  desire: { icon: 'flame-outline' },
  anger: { icon: 'flash-outline' },
  pride: { icon: 'ribbon-outline' },
};

const FEATURED_EMOTIONS = ['Anxious', 'Worthless', 'Stuck', 'Heartbroken', 'Resentful', 'Burned out'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WhyFeelingSheet({
  visible,
  onClose,
  prefillEmotion,
}: WhyFeelingSheetProps) {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const navigation = useNavigation<NavigationProp>();
  const { addToHistory } = useEmotionHistory();
  const styles = getStyles(theme);
  const [step, setStep] = useState<Step>(1);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    prefillEmotion ? [prefillEmotion] : []
  );
  const [selectedSituations, setSelectedSituations] = useState<
    SituationOption[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setStep(1);
      setSearchQuery('');
      setShowTooltip(null);
      const prefill = prefillEmotion ? [prefillEmotion] : [];
      setSelectedEmotions(prefill);
      setSelectedSituations([]);
    }
  }, [visible, prefillEmotion]);

  const handleEmotionToggle = (emotionLabel: string) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotionLabel)) {
        return prev.filter((e) => e !== emotionLabel);
      } else if (prev.length < 3) {
        // Limit to 3 selections
        return [...prev, emotionLabel];
      }
      return prev;
    });
  };

  const handleSituationToggle = (situation: SituationOption) => {
    setSelectedSituations((prev) =>
      prev.includes(situation)
        ? prev.filter((s) => s !== situation)
        : [...prev, situation]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedEmotions.length > 0) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSkipContext = () => {
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  // Get filtered emotions based on search
  const filteredEmotions = useMemo(() => {
    if (!searchQuery.trim()) {
      return emotionClusters;
    }

    const matches = fuzzyMatchEmotion(searchQuery);
    if (matches.length === 0) {
      return []; // Will show universal fallback
    }

    // Group matches by cluster
    const clusterMap = new Map<string, typeof emotionClusters[0]>();
    matches.forEach((match) => {
      const cluster = emotionClusters.find(c => c.id === match.clusterId);
      if (cluster && !clusterMap.has(cluster.id)) {
        // Filter emotions in cluster to only show matches
        const filteredEmotions = cluster.emotions.filter(e =>
          e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (filteredEmotions.length > 0) {
          clusterMap.set(cluster.id, {
            ...cluster,
            emotions: filteredEmotions,
          });
        }
      }
    });

    return Array.from(clusterMap.values());
  }, [searchQuery]);

  // Get routing result
  const routeResult = useMemo(() => {
    if (selectedEmotions.length === 0) {
      return null;
    }
    return getPrimaryRoute(selectedEmotions);
  }, [selectedEmotions]);

  const handlePrimaryRoute = () => {
    if (!routeResult) return;

    const level = getLevelById(routeResult.primaryLevelId);
    if (!level) return;

    // Add to history
    const primaryEmotion = selectedEmotions[0] || level.name;
    addToHistory(primaryEmotion, routeResult.primaryLevelId);

    // Navigate to level chapter
    navigation.navigate('LevelChapter', {
      levelId: routeResult.primaryLevelId,
      initialView: 'overview',
      sourceFeeling: primaryEmotion,
    });
    onClose();
  };

  const handleChapterPress = (chapterId: string) => {
    navigation.navigate('Chapter', { chapterId });
    onClose();
  };

  const handleSecondaryLevelPress = (levelId: string) => {
    const level = getLevelById(levelId);
    if (!level) return;

    addToHistory(level.name, levelId);
    navigation.navigate('LevelChapter', {
      levelId,
      initialView: 'overview',
    });
    onClose();
  };

  // Helper function to get cluster color
  const getClusterColor = (colorName: string, theme: ThemeColors): string => {
    const colorMap: Record<string, string> = {
      rose: theme.feelingsChapters.rose,
      violet: theme.feelingsChapters.violet,
      amber: theme.feelingsChapters.amber,
      teal: theme.feelingsChapters.teal,
      sky: theme.feelingsChapters.sky,
      garnet: theme.feelingsChapters.rose,
      plum: theme.feelingsChapters.violet,
      indigo: theme.feelingsChapters.violet,
      slate: theme.textMuted,
    };
    return colorMap[colorName] || theme.feelingsChapters.sky;
  };

  // Helper function to get chip style
  const getChipStyle = (isSelected: boolean, chipColor: string, theme: ThemeColors, glowEnabled: boolean) => {
    const chipStyle: any = {
      backgroundColor: isSelected
        ? (theme.mode === 'dark'
          ? `${chipColor}30`
          : `${chipColor}15`)
        : (theme.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.8)'),
      borderColor: isSelected
        ? chipColor
        : (theme.mode === 'dark'
          ? theme.border
          : 'rgba(0, 0, 0, 0.2)'),
      borderWidth: isSelected ? 2 : 1,
    };

    if (isSelected && glowEnabled) {
      if (theme.mode === 'dark') {
        Object.assign(chipStyle, {
          shadowColor: chipColor,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        });
      } else {
        Object.assign(chipStyle, {
          shadowColor: chipColor,
          shadowOpacity: 0.3,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        });
      }
    }

    return chipStyle;
  };


  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={styles.fullScreenContainer}>
        <View style={styles.header} accessibilityRole="header">
          {step > 1 && (
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
            </Pressable>
          )}
          <Text style={styles.title} accessibilityRole="header">
            {step === 1 ? 'Name the wave' : step === 2 ? 'What\'s happening right now?' : 'Here\'s why this happens'}
          </Text>
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={false}
        >
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.empathyHint}>
                Every human feels these at times. You're not alone.
              </Text>

              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={theme.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search emotions..."
                  placeholderTextColor={theme.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                  </Pressable>
                )}
              </View>

              <Text style={styles.stepDescription}>
                Select all that apply (up to 3)
              </Text>

              {/* Featured Emotions */}
              {!searchQuery.trim() && (
                <View style={styles.featuredSection}>
                  <Text style={styles.clusterHeader}>Most common right now</Text>
                  <View style={styles.chipContainer}>
                    {FEATURED_EMOTIONS.map((label) => {
                      const isSelected = selectedEmotions.includes(label);
                      const chipColor = theme.feelingsChapters.sky;
                      const chipStyle = getChipStyle(isSelected, chipColor, theme, glowEnabled);

                      return (
                        <Pressable
                          key={label}
                          onPress={() => handleEmotionToggle(label)}
                          style={[styles.chip, chipStyle]}
                        >
                          <Text style={[styles.chipText, isSelected && { color: chipColor, fontWeight: typography.semibold }]}>
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Emotion Clusters or Universal Fallback */}
              {filteredEmotions.length === 0 && searchQuery.trim() ? (
                <View>
                  <Text style={styles.emptySearchText}>Try these:</Text>
                  <View style={styles.chipContainer}>
                    {getUniversalEmotions().map((emotion) => {
                      const isSelected = selectedEmotions.includes(emotion);
                      const chipColor = theme.feelingsChapters.sky;
                      const chipStyle = getChipStyle(isSelected, chipColor, theme, glowEnabled);

                      return (
                        <Pressable
                          key={emotion}
                          onPress={() => handleEmotionToggle(emotion)}
                          style={[styles.chip, chipStyle]}
                        >
                          <Text style={[styles.chipText, isSelected && { color: chipColor, fontWeight: typography.semibold }]}>
                            {emotion}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : (
                filteredEmotions.map((cluster) => (
                  <View key={cluster.id} style={styles.clusterSection}>
                    <View style={styles.clusterHeaderContainer}>
                      <Ionicons
                        name={(CLUSTER_INFO[cluster.id]?.icon || 'pulse-outline') as any}
                        size={16}
                        color={theme.textMuted}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.clusterHeader}>{cluster.label}</Text>
                    </View>
                    <View style={styles.chipContainer}>
                      {cluster.emotions.map((emotion) => {
                        const isSelected = selectedEmotions.includes(emotion.label) ||
                          emotion.synonyms.some(s => selectedEmotions.includes(s));
                        const chipColor = getClusterColor(cluster.color, theme);

                        // Show primary label and 1-2 most common synonyms
                        const visibleSynonyms = emotion.synonyms.slice(0, 2);
                        const allLabels = [emotion.label, ...visibleSynonyms];

                        return (
                          <React.Fragment key={emotion.label}>
                            {allLabels.map((label) => {
                              const isLabelSelected = selectedEmotions.includes(label);
                              const chipStyle = getChipStyle(isLabelSelected, chipColor, theme, glowEnabled);

                              return (
                                <Pressable
                                  key={label}
                                  onPress={() => {
                                    // When selecting a synonym, also select the primary emotion label
                                    const emotionToSelect = label === emotion.label ? emotion.label : label;
                                    handleEmotionToggle(emotionToSelect);
                                  }}
                                  onLongPress={() => {
                                    if (emotion.microHint) {
                                      setShowTooltip(showTooltip === emotion.label ? null : emotion.label);
                                    }
                                  }}
                                  style={[styles.chip, chipStyle]}
                                >
                                  <Text style={[styles.chipText, isLabelSelected && { color: chipColor, fontWeight: typography.semibold }]}>
                                    {label}
                                  </Text>
                                  {emotion.microHint && label === emotion.label && (
                                    <Pressable
                                      onPress={(e) => {
                                        e.stopPropagation();
                                        setShowTooltip(showTooltip === emotion.label ? null : emotion.label);
                                      }}
                                      style={styles.infoButton}
                                    >
                                      <Ionicons name="information-circle-outline" size={14} color={chipColor} />
                                    </Pressable>
                                  )}
                                </Pressable>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </View>
                    {showTooltip && cluster.emotions.find(e => e.label === showTooltip)?.microHint && (
                      <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>
                          {cluster.emotions.find(e => e.label === showTooltip)?.microHint}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}

              {selectedEmotions.length > 0 && (
                <View style={styles.selectedCount}>
                  <Text style={styles.selectedCountText}>
                    {selectedEmotions.length} selected
                  </Text>
                </View>
              )}

              <Pressable
                onPress={handleNext}
                disabled={selectedEmotions.length === 0}
                style={[
                  styles.primaryButton,
                  selectedEmotions.length === 0 ? styles.primaryButtonDisabled : null,
                ]}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepDescription}>
                What's happening right now? (select all that apply)
              </Text>
              <View style={styles.chipContainer}>
                {SITUATION_OPTIONS.map((situation, index) => {
                  const isSelected = selectedSituations.includes(situation.value);
                  // Assign different colors to situation chips for variety
                  const situationColors = [
                    theme.feelingsChapters.teal,
                    theme.feelingsChapters.amber,
                    theme.feelingsChapters.violet,
                    theme.feelingsChapters.rose,
                    theme.feelingsChapters.sky,
                    theme.feelingsChapters.teal,
                    theme.feelingsChapters.amber,
                  ];
                  const chipColor = situationColors[index % situationColors.length] || theme.feelingsChapters.teal;
                  const glowTint = chipColor || theme.feelingsChapters.teal;

                  const chipStyle = {
                    backgroundColor: isSelected
                      ? (theme.mode === 'dark'
                        ? `${chipColor}30`
                        : `${chipColor}15`)
                      : (theme.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.8)'),
                    borderColor: isSelected
                      ? glowTint
                      : (theme.mode === 'dark'
                        ? theme.border
                        : 'rgba(0, 0, 0, 0.2)'),
                    borderWidth: isSelected ? 2 : 1,
                  };

                  // Add glow effects only when selected and glow is enabled
                  if (isSelected && glowEnabled) {
                    if (theme.mode === 'dark') {
                      Object.assign(chipStyle, {
                        shadowColor: glowTint,
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 4,
                      });
                    } else {
                      Object.assign(chipStyle, {
                        shadowColor: glowTint,
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 3,
                      });
                    }
                  }

                  return (
                    <Pressable
                      key={situation.value}
                      onPress={() => handleSituationToggle(situation.value)}
                      style={[
                        styles.chip,
                        chipStyle,
                        { flexDirection: 'row', paddingHorizontal: spacing.md }
                      ]}
                    >
                      <Ionicons
                        name={situation.icon as any}
                        size={16}
                        color={isSelected ? chipColor : theme.textMuted}
                        style={({ marginRight: 8 } as any)}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected ? { color: chipColor, fontWeight: typography.semibold } : null,
                        ]}
                      >
                        {String(situation.label || '')}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.contextActions}>
                <Pressable
                  onPress={handleSkipContext}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </Pressable>
                <Pressable
                  onPress={handleNext}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>See explanation</Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 3 && routeResult && (() => {
            const explanation = levelExplanations[routeResult.primaryLevelId];
            const copingTrapText = getCopingTrapText(
              routeResult.primaryLevelId,
              selectedSituations
            );
            const levelInfo = LEVEL_INFO_MAP[routeResult.primaryLevelId] || { icon: 'bulb-outline', label: 'The angle:' };

            return (
              <View style={styles.stepContent}>
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>Deep Insight</Text>

                  {/* Reservoir Card */}
                  <View style={styles.insightCard}>
                    <View style={[styles.insightIconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)' }]}>
                      <Ionicons name="archive-outline" size={20} color={theme.textPrimary} />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Reservoir + Trigger</Text>
                      <Text style={styles.insightText}>
                        {explanation?.reservoir || 'Events pull up stored emotion. The feelings you\'re experiencing aren\'t just from what\'s happening now.'}
                      </Text>
                    </View>
                  </View>

                  {/* Coping Trap Card */}
                  <View style={styles.insightCard}>
                    <View style={[styles.insightIconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)' }]}>
                      <Ionicons name="contract-outline" size={20} color={theme.textPrimary} />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Coping Trap</Text>
                      <Text style={styles.insightText}>{copingTrapText}</Text>
                    </View>
                  </View>

                  {/* Third Angle Card */}
                  <View style={styles.insightCard}>
                    <View style={[styles.insightIconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)' }]}>
                      <Ionicons name={levelInfo.icon as any} size={20} color={theme.textPrimary} />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>{levelInfo.label}</Text>
                      <Text style={styles.insightText}>
                        {explanation?.thirdAngle || 'Understanding the deeper pattern helps you move through this experience with awareness.'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Primary Route Button */}
                {(() => {
                  const primaryLevel = getLevelById(routeResult.primaryLevelId);
                  if (!primaryLevel) return null;

                  return (
                    <Pressable
                      onPress={handlePrimaryRoute}
                      style={[
                        styles.primaryRouteButton,
                        { borderColor: primaryLevel.glowDark || primaryLevel.color },
                      ]}
                    >
                      <View>
                        <Text style={styles.transcendSubtext}>RECOMMENDED JOURNEY</Text>
                        <Text style={[
                          styles.primaryRouteText,
                          { color: primaryLevel.glowDark || primaryLevel.color },
                        ]}>
                          Transcending {primaryLevel.name}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={primaryLevel.glowDark || primaryLevel.color}
                      />
                    </Pressable>
                  );
                })()}

                {/* Related Chapters and Levels */}
                {(routeResult.relatedChapterIds.length > 0 || routeResult.secondaryLevelIds.length > 0) || true && (
                  <View style={styles.recommendedSection}>
                    <Text style={styles.recommendedTitle}>Other paths to explore:</Text>
                    <View style={styles.chipContainer}>
                      {/* Related Chapters */}
                      {routeResult.relatedChapterIds.map((chapterId) => {
                        const chapter = getChapterById(chapterId);
                        if (!chapter) return null;
                        return (
                          <Pressable
                            key={`chapter-${chapterId}`}
                            onPress={() => handleChapterPress(chapterId)}
                            style={[
                              styles.chapterChip,
                              {
                                backgroundColor: `${theme.feelingsChapters[chapter.glowColor] || theme.feelingsChapters.sky}20`,
                                borderColor: theme.feelingsChapters[chapter.glowColor] || theme.feelingsChapters.sky,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.chapterChipText,
                                { color: theme.feelingsChapters[chapter.glowColor] || theme.feelingsChapters.sky },
                              ]}
                            >
                              {String(chapter.title || '')}
                            </Text>
                          </Pressable>
                        );
                      })}

                      {/* Secondary Levels */}
                      {routeResult.secondaryLevelIds.map((levelId) => {
                        const level = getLevelById(levelId);
                        if (!level) return null;
                        return (
                          <Pressable
                            key={`secondary-${levelId}`}
                            onPress={() => handleSecondaryLevelPress(levelId)}
                            style={[
                              styles.levelChip,
                              {
                                backgroundColor: `${level.glowDark || level.color}15`,
                                borderColor: level.glowDark || level.color,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.levelChipText,
                                { color: level.glowDark || level.color },
                              ]}
                            >
                              {level.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <Pressable style={styles.secondaryButton}>
                    <Ionicons name="heart-outline" size={20} color={theme.textSecondary} />
                    <Text style={styles.secondaryButtonText}>Save for later</Text>
                  </Pressable>
                  <Pressable style={styles.secondaryButton} onPress={onClose}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={theme.textSecondary} />
                    <Text style={styles.secondaryButtonText}>Mark understood</Text>
                  </Pressable>
                </View>
              </View>
            );
          })()}
        </ScrollView>
      </View>
    </Modal>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    fullScreenContainer: {
      flex: 1,
      backgroundColor: theme.appBackgroundGradient[0],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: Platform.OS === 'ios' ? 50 : spacing.xl,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.appBackgroundGradient[0],
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    closeButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    stepContent: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    empathyHint: {
      fontSize: typography.body,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.body,
      color: theme.textPrimary,
      paddingVertical: spacing.sm,
    },
    clearButton: {
      padding: spacing.xs,
    },
    emptySearchText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
    clusterSection: {
      marginBottom: spacing.lg,
    },
    clusterHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    clusterHeader: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    featuredSection: {
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tooltip: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      marginTop: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tooltipText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
    infoButton: {
      marginLeft: spacing.xs,
      padding: 2,
    },
    selectedCount: {
      alignItems: 'center',
      marginVertical: spacing.sm,
    },
    selectedCountText: {
      fontSize: typography.small,
      color: theme.textMuted,
      fontWeight: typography.medium,
    },
    stepDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipSelected: {
      borderWidth: 2,
    },
    chipText: {
      fontSize: typography.small,
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary,
      fontWeight: typography.medium,
    },
    primaryButton: {
      backgroundColor: theme.feelingsChapters.sky,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    primaryButtonDisabled: {
      opacity: 0.5,
    },
    primaryButtonText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.white,
    },
    explanationContainer: {
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    explanationTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    bulletPoint: {
      marginBottom: spacing.md,
    },
    bulletText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    bulletBold: {
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    recommendedSection: {
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    recommendedTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    chapterChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
    },
    chapterChipText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
    },
    contextActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    skipButton: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: typography.body,
      fontWeight: typography.medium,
      color: theme.textSecondary,
    },
    primaryRouteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
    },
    primaryRouteText: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
    },
    transcendSubtext: {
      fontSize: 10,
      fontWeight: typography.bold,
      color: theme.textMuted,
      letterSpacing: 1.5,
      marginBottom: 2,
    },
    insightCard: {
      flexDirection: 'row',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.5)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    insightIconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    insightContent: {
      flex: 1,
    },
    insightLabel: {
      fontSize: 12,
      fontWeight: typography.bold,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    insightText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    levelChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
    },
    levelChipText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    secondaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
    },
    secondaryButtonText: {
      fontSize: typography.small,
      fontWeight: typography.medium,
      color: theme.textSecondary,
    },
  });

