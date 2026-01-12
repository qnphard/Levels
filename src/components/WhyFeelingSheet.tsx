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
  | 'rumination';

const SITUATION_OPTIONS: { value: SituationOption; label: string }[] = [
  { value: 'conflict', label: 'Conflict' },
  { value: 'silence', label: 'Silence/Uncertainty' },
  { value: 'criticism', label: 'Criticism' },
  { value: 'body-symptoms', label: 'Body symptoms (tight chest, jaw, gut)' },
  { value: 'overthinking', label: 'Overthinking/Rumination' },
  { value: 'urge-to-vent', label: 'Urge to vent' },
  { value: 'urge-to-escape', label: 'Urge to escape' },
  { value: 'social-media-spiral', label: 'Social media spiral' },
  { value: 'after-breakup', label: 'After breakup' },
  { value: 'body-tightness', label: 'Body tightness' },
  { value: 'rumination', label: 'Rumination' },
];

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
                        <Text style={styles.clusterHeader}>{cluster.label}</Text>
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
                          ]}
                        >
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
                
                return (
                  <View style={styles.stepContent}>
                    <View style={styles.explanationContainer}>
                      <Text style={styles.explanationTitle}>Why this happens:</Text>
                      
                      <View style={styles.bulletPoint}>
                        <Text style={styles.bulletText}>
                          <Text style={styles.bulletBold}>Reservoir + trigger:</Text>{' '}
                          {explanation?.reservoir || 'Events pull up stored emotion. The feelings you\'re experiencing aren\'t just from what\'s happening now—they\'re connected to past experiences that haven\'t been fully processed.'}
                        </Text>
                      </View>

                      <View style={styles.bulletPoint}>
                        <Text style={styles.bulletText}>
                          <Text style={styles.bulletBold}>Coping traps:</Text>{' '}
                          {copingTrapText}
                        </Text>
                      </View>

                      <View style={styles.bulletPoint}>
                        <Text style={styles.bulletText}>
                          <Text style={styles.bulletBold}>
                            {routeResult.primaryLevelId === 'fear' ? 'Stress angle:' : 
                             routeResult.primaryLevelId === 'shame' ? 'The distinction:' :
                             routeResult.primaryLevelId === 'guilt' ? 'The purpose:' :
                             routeResult.primaryLevelId === 'anger' ? 'What it shows you:' :
                             routeResult.primaryLevelId === 'desire' ? 'What it points to:' :
                             routeResult.primaryLevelId === 'grief' ? 'The meaning:' :
                             routeResult.primaryLevelId === 'apathy' ? 'What it really is:' :
                             routeResult.primaryLevelId === 'pride' ? 'What protects:' :
                             'The angle:'}
                          </Text>{' '}
                          {explanation?.thirdAngle || 'Understanding the deeper pattern helps you move through this experience with more awareness.'}
                        </Text>
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
                        <Text style={[
                          styles.primaryRouteText,
                          { color: primaryLevel.glowDark || primaryLevel.color },
                        ]}>
                          Transcending {primaryLevel.name}
                        </Text>
                        <Ionicons 
                          name="chevron-forward" 
                          size={20} 
                          color={primaryLevel.glowDark || primaryLevel.color} 
                        />
                      </Pressable>
                    );
                  })()}

                  {/* Related Chapters and Levels */}
                  {(routeResult.relatedChapterIds.length > 0 || routeResult.secondaryLevelIds.length > 0) && (
                    <View style={styles.recommendedSection}>
                      <Text style={styles.recommendedTitle}>Related:</Text>
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
                              key={`level-${levelId}`}
                              onPress={() => handleSecondaryLevelPress(levelId)}
                              style={[
                                styles.chapterChip,
                                {
                                  backgroundColor: `${level.glowDark || level.color}20`,
                                  borderColor: level.glowDark || level.color,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chapterChipText,
                                  { color: level.glowDark || level.color },
                                ]}
                              >
                                Transcending {level.name}
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
    clusterHeader: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
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
      fontSize: typography.h4,
      fontWeight: typography.bold,
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

