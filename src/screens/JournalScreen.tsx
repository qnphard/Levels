import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  useGlowEnabled,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
  palette,
  toRgba,
} from '../theme/colors';
import PasscodeScreen from '../components/PasscodeScreen';
import { useContentEdit } from '../context/ContentEditContext';
import PromptEditModal from '../components/PromptEditModal';
import EditModeIndicator from '../components/EditModeIndicator';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { useUserStore, JournalEntry } from '../store/userStore';
import { consciousnessLevels } from '../data/levels';
import { emotionClusters } from '../data/emotions';
import { AestheticAlert } from '../components/AestheticAlert';

/** toRgba is now imported from ../theme/colors */

interface JournalPrompt {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  order: number;
}

const DEFAULT_PROMPTS: JournalPrompt[] = [
  { id: 'prompt-1', text: 'What am I feeling right now?', icon: 'heart-outline', order: 0 },
  { id: 'prompt-2', text: 'What do I need to let go of?', icon: 'leaf-outline', order: 1 },
  { id: 'prompt-3', text: 'What am I grateful for today?', icon: 'sunny-outline', order: 2 },
  { id: 'prompt-4', text: 'What\'s weighing on my heart?', icon: 'cloud-outline', order: 3 },
  { id: 'prompt-5', text: 'What brings me peace?', icon: 'water-outline', order: 4 },
  { id: 'prompt-6', text: 'Free writing...', icon: 'create-outline', order: 5 },
];

const PROMPT_COLORS = [
  '#C4B5FD', // Violet
  '#B8D7E4', // Mist
  '#F3D7C6', // Peach
  '#E6CFA8', // Gold
  '#A9CABB', // Sage
  '#5FB5A9', // Teal
];

const STORAGE_KEYS = {
  JOURNAL_PASSCODE: '@journal_passcode',
  JOURNAL_AUTH_SESSION: '@journal_auth_session',
};

const STORAGE_KEY_PROMPTS = '@journal_prompts';

export default function JournalScreen() {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const { editModeEnabled } = useContentEdit();
  const styles = getStyles(theme, glowEnabled);

  // Store integration
  const journalEntries = useUserStore((s) => s.journalEntries);
  const addJournalEntry = useUserStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useUserStore((s) => s.deleteJournalEntry);
  const currentJournalStreak = useUserStore((s) => s.currentJournalStreak);

  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<{
    levelId: string;
    name: string;
    color: string;
    emotion?: string;
  } | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodSearchQuery, setMoodSearchQuery] = useState('');
  const [showingPastEntries, setShowingPastEntries] = useState(false);
  const [prompts, setPrompts] = useState<JournalPrompt[]>(DEFAULT_PROMPTS);
  const [editingPrompt, setEditingPrompt] = useState<JournalPrompt | undefined>(undefined);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showJournalExplanation, setShowJournalExplanation] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });
  const fadeAnim = useState(new Animated.Value(0))[0];

  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);

  // Show journal overlay if not seen and tutorial was seen (or skipped)
  useEffect(() => {
    if (hasSeenTutorial && !seenExplanations.includes('journal')) {
      const timer = setTimeout(() => {
        setShowJournalExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, seenExplanations]);

  // Passcode protection
  const [storedPasscode, setStoredPasscode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load prompts from storage
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_PROMPTS);
        if (stored) {
          const parsedPrompts = JSON.parse(stored);
          if (parsedPrompts && parsedPrompts.length > 0) {
            setPrompts(parsedPrompts);
          }
        }
      } catch (error) {
        console.error('Error loading prompts:', error);
      }
    };

    loadPrompts();
  }, []);

  // Load passcode on mount
  useEffect(() => {
    const loadPasscode = async () => {
      try {
        const passcode = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_PASSCODE);
        setStoredPasscode(passcode);
      } catch (error) {
        console.error('Error loading passcode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPasscode();
  }, []);

  // Clear authentication every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset authentication when screen is focused
      setIsAuthenticated(false);

      // Clear auth session from storage
      AsyncStorage.removeItem(STORAGE_KEYS.JOURNAL_AUTH_SESSION).catch(err =>
        console.error('Error clearing auth session:', err)
      );
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveEntry = () => {
    if (journalText.trim()) {
      addJournalEntry({
        text: journalText,
        promptId: selectedPrompt || undefined,
        mood: selectedMood || undefined,
      });
      setJournalText('');
      setSelectedPrompt(null);
      setSelectedMood(null);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    if (editModeEnabled) return; // Don't select prompt in edit mode
    setSelectedPrompt(prompt);
    // Optionally pre-fill the prompt as a starting point
    if (!journalText) {
      setJournalText(prompt + '\n\n');
    }
  };

  const handleEditPrompt = (prompt: JournalPrompt) => {
    setEditingPrompt(prompt);
    setShowPromptModal(true);
  };

  const handleAddPrompt = () => {
    setEditingPrompt(undefined);
    setShowPromptModal(true);
  };

  const handleSavePrompt = async (promptData: { text: string; icon: keyof typeof Ionicons.glyphMap }) => {
    try {
      let updatedPrompts: JournalPrompt[];
      if (editingPrompt) {
        // Update existing prompt
        updatedPrompts = prompts.map(p =>
          p.id === editingPrompt.id
            ? { ...p, text: promptData.text, icon: promptData.icon }
            : p
        );
      } else {
        // Add new prompt
        const newPrompt: JournalPrompt = {
          id: `prompt-${Date.now()}`,
          text: promptData.text,
          icon: promptData.icon,
          order: prompts.length,
        };
        updatedPrompts = [...prompts, newPrompt];
      }
      setPrompts(updatedPrompts);
      await AsyncStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(updatedPrompts));
      setShowPromptModal(false);
      setEditingPrompt(undefined);
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const handleDeletePrompt = (promptId: string) => {
    setAlertConfig({
      visible: true,
      title: "Delete prompt?",
      message: "Are you sure you want to delete this prompt? This cannot be undone.",
      onConfirm: async () => {
        try {
          const updatedPrompts = prompts.filter(p => p.id !== promptId);
          setPrompts(updatedPrompts);
          await AsyncStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(updatedPrompts));
          setShowPromptModal(false);
          setEditingPrompt(undefined);
          setAlertConfig(prev => ({ ...prev, visible: false }));
        } catch (error) {
          console.error('Error deleting prompt:', error);
          setAlertConfig(prev => ({ ...prev, visible: false }));
        }
      }
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setAlertConfig({
      visible: true,
      title: "Delete journal entry?",
      message: "Are you sure you want to delete this reflection? You can never retrieve it again.",
      onConfirm: () => {
        deleteJournalEntry(entryId);
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleSetupComplete = async (passcode: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_PASSCODE, passcode);
      setStoredPasscode(passcode);
    } catch (error) {
      console.error('Error saving passcode:', error);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_AUTH_SESSION, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth session:', error);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // or a loading spinner
  }

  // Handle passcode authentication
  if (!isAuthenticated) {
    if (storedPasscode === null) {
      // First time - setup passcode
      return (
        <PasscodeScreen
          mode="setup"
          onSuccess={handleAuthSuccess}
          onSetupComplete={handleSetupComplete}
        />
      );
    } else {
      // Verify passcode
      return (
        <PasscodeScreen
          mode="verify"
          onSuccess={handleAuthSuccess}
          storedPasscode={storedPasscode}
        />
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <LinearGradient
        colors={theme.appBackgroundGradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <EditModeIndicator />
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Journal</Text>
                <Text style={styles.headerSubtitle}>Safe space for your thoughts</Text>
              </View>
              {currentJournalStreak > 0 && (
                <View style={styles.streakBadge}>
                  <Ionicons name="flame" size={20} color="#FF9800" />
                  <Text style={styles.streakCount}>{currentJournalStreak}</Text>
                </View>
              )}
            </View>

            {/* Current Entry Section */}
            {!showingPastEntries ? (
              <>
                {/* Spiritual Purpose Section */}
                <View style={styles.purposeCard}>
                  <View style={styles.purposeHeader}>
                    <Ionicons name="heart" size={20} color={theme.primary} />
                    <Text style={styles.purposeTitle}>The Purpose of Your Journal</Text>
                  </View>
                  <Text style={styles.purposeText}>
                    This is a safe space for you to express your thoughts and emotions freely.
                  </Text>
                  <Text style={styles.purposeText}>
                    As you revisit old entries, notice how they have passed. You are not your thoughts or emotions—you are the awareness that observes them.
                  </Text>
                  <Text style={styles.purposeText}>
                    Spiritual progress isn't linear. Every "bad" day is a beautiful opportunity for growth, forgiveness, and deeper understanding. Be gentle with yourself.
                  </Text>
                </View>

                {/* Gentle Prompts */}
                <View style={styles.promptsSection}>
                  <View style={styles.promptsHeader}>
                    <Text style={styles.promptsTitle}>Gentle prompts</Text>
                    {editModeEnabled && (
                      <TouchableOpacity
                        style={styles.addPromptButton}
                        onPress={handleAddPrompt}
                      >
                        <Ionicons name="add-circle" size={24} color={theme.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.promptsContainer}
                  >
                    {prompts.map((prompt, index) => {
                      const cardColor = PROMPT_COLORS[index % PROMPT_COLORS.length];
                      const isSelected = selectedPrompt === prompt.text;

                      return (
                        <View key={prompt.id} style={styles.promptCardWrapper}>
                          <TouchableOpacity
                            style={[
                              styles.promptCard,
                              isSelected && styles.promptCardSelected,
                              {
                                borderColor: glowEnabled
                                  ? (isSelected ? cardColor : toRgba(cardColor, 0.64))
                                  : (isSelected ? cardColor : toRgba(cardColor, 0.2)),
                                backgroundColor: theme.mode === 'dark'
                                  ? (isSelected ? toRgba(cardColor, 0.15) : 'rgba(255, 255, 255, 0.06)')
                                  : (isSelected ? toRgba(cardColor, 0.15) : toRgba(cardColor, 0.08)),
                                borderWidth: isSelected ? 2 : 1.5,
                              },
                              glowEnabled && isSelected && {
                                shadowColor: cardColor,
                                shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                                shadowRadius: 24,
                                shadowOffset: { width: 0, height: 4 },
                                backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
                                borderColor: toRgba(cardColor, 0.64),
                                boxShadow: [
                                  `0 0 30px ${theme.mode === 'dark' ? toRgba(cardColor, 0.42) : toRgba(cardColor, 0.32)}`,
                                  `0 0 60px ${theme.mode === 'dark' ? toRgba(cardColor, 0.22) : toRgba(cardColor, 0.16)}`,
                                  `inset 0 0 20px ${toRgba(cardColor, 0.1)}`,
                                ].join(', '),
                              }
                            ]}
                            onPress={() => handlePromptSelect(prompt.text)}
                          >
                            {glowEnabled && isSelected && (
                              <View
                                pointerEvents="none"
                                style={{
                                  position: 'absolute',
                                  top: -8,
                                  left: -8,
                                  right: -8,
                                  bottom: -8,
                                  borderRadius: borderRadius.lg + 8,
                                  opacity: 0.8,
                                  backgroundColor: toRgba(cardColor, theme.mode === 'dark' ? 0.12 : 0.04),
                                }}
                              />
                            )}
                            <Ionicons
                              name={prompt.icon}
                              size={20}
                              color={isSelected ? (theme.mode === 'dark' ? '#FFFFFF' : cardColor) : cardColor}
                            />
                            <Text
                              style={[
                                styles.promptText,
                                isSelected && { color: theme.mode === 'dark' ? '#FFFFFF' : '#1E293B', fontWeight: '800' },
                                !isSelected && { color: theme.mode === 'dark' ? toRgba(cardColor, 0.9) : '#475569', fontWeight: '500' }
                              ]}
                            >
                              {prompt.text}
                            </Text>
                          </TouchableOpacity>
                          {editModeEnabled && (
                            <TouchableOpacity
                              style={styles.editPromptButton}
                              onPress={() => handleEditPrompt(prompt)}
                            >
                              <Ionicons name="create-outline" size={16} color={theme.white} />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Writing Area */}
                <View style={[
                  styles.writingSection,
                  glowEnabled && {
                    borderColor: selectedMood ? toRgba(selectedMood.color, 0.64) : toRgba(theme.primary, 0.64),
                    shadowColor: selectedMood ? selectedMood.color : theme.primary,
                    shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                    shadowRadius: 24,
                    shadowOffset: { width: 0, height: 4 },
                    borderWidth: 2,
                    backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
                    // No elevation for dark mode
                    ...(theme.mode !== 'dark' && { elevation: 6 }),
                    boxShadow: [
                      `0 0 30px ${selectedMood
                        ? (theme.mode === 'dark' ? toRgba(selectedMood.color, 0.42) : toRgba(selectedMood.color, 0.32))
                        : (theme.mode === 'dark' ? toRgba(theme.primary, 0.42) : toRgba(theme.primary, 0.32))}`,
                      `0 0 60px ${selectedMood
                        ? (theme.mode === 'dark' ? toRgba(selectedMood.color, 0.22) : toRgba(selectedMood.color, 0.16))
                        : (theme.mode === 'dark' ? toRgba(theme.primary, 0.22) : toRgba(theme.primary, 0.16))}`,
                      `inset 0 0 20px ${selectedMood
                        ? toRgba(selectedMood.color, 0.1)
                        : toRgba(theme.primary, 0.1)}`,
                    ].join(', '),
                  },
                ]}>
                  {glowEnabled && (
                    <View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        right: -8,
                        bottom: -8,
                        borderRadius: borderRadius.lg + 8,
                        opacity: 0.8,
                        backgroundColor: selectedMood
                          ? toRgba(selectedMood.color, theme.mode === 'dark' ? 0.12 : 0.04)
                          : toRgba(theme.primary, theme.mode === 'dark' ? 0.12 : 0.04),
                      }}
                    />
                  )}
                  {/* Mood Selector integration */}
                  <View style={styles.moodSection}>
                    <Text style={styles.moodTitle}>How are you?</Text>
                    <TouchableOpacity
                      onPress={() => setShowMoodModal(true)}
                      style={[
                        styles.moodSelectorTrigger,
                        selectedMood && {
                          backgroundColor: theme.mode === 'light' ? toRgba(selectedMood.color, 0.25) : selectedMood.color + '40',
                          borderColor: theme.mode === 'light' ? toRgba(selectedMood.color, 0.5) : selectedMood.color + '60',
                          borderWidth: 1.5
                        }
                      ]}
                    >
                      <View style={styles.moodSelectorLeft}>
                        {selectedMood ? (
                          <>
                            <View style={[styles.moodDot, { backgroundColor: selectedMood.color }]} />
                            <Text style={[
                              styles.moodSelectorText,
                              {
                                color: theme.mode === 'light' ? '#1E293B' : theme.textPrimary
                              }
                            ]}>
                              {selectedMood.emotion || selectedMood.name}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Ionicons name="happy-outline" size={20} color={theme.textMuted} />
                            <Text style={styles.moodSelectorPlaceholder}>Select your current state...</Text>
                          </>
                        )}
                      </View>
                      <Ionicons
                        name={selectedMood ? "close-circle" : "chevron-down"}
                        size={20}
                        color={selectedMood ? selectedMood.color : theme.textMuted}
                        onPress={selectedMood ? (e) => {
                          e.stopPropagation();
                          setSelectedMood(null);
                        } : undefined}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.writingHeader}>
                    <Ionicons name="create-outline" size={20} color={theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary} />
                    <Text style={styles.writingTitle}>Express yourself</Text>
                  </View>

                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Whatever you're feeling... it's okay to feel it."
                    placeholderTextColor={theme.mode === 'dark' ? theme.textSecondary : theme.textMuted}
                    value={journalText}
                    onChangeText={setJournalText}
                    textAlignVertical="top"
                    autoFocus={false}
                  />

                  <View style={styles.actionButtons}>
                    {journalText.trim() !== '' && (
                      <>
                        <TouchableOpacity
                          style={styles.clearButton}
                          onPress={() => {
                            setJournalText('');
                            setSelectedPrompt(null);
                            setSelectedMood(null);
                          }}
                        >
                          <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={handleSaveEntry}
                        >
                          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                          <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <Text style={styles.privacyNote}>
                    <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
                    {' '}Private and saved only on your device
                  </Text>
                </View>

                {/* View Past Entries Link */}
                {journalEntries.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewEntriesButton}
                    onPress={() => setShowingPastEntries(true)}
                  >
                    <Ionicons name="book-outline" size={20} color={theme.primary} />
                    <Text style={styles.viewEntriesText}>
                      View past entries ({journalEntries.length})
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              /* Past Entries View */
              <>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowingPastEntries(false)}
                >
                  <Ionicons name="chevron-back" size={24} color={theme.primary} />
                  <Text style={styles.backButtonText}>Back to writing</Text>
                </TouchableOpacity>

                <View style={styles.entriesSection}>
                  <Text style={styles.entriesSectionTitle}>Your Journey</Text>
                  <Text style={styles.entriesSectionSubtitle}>
                    Reflections and moments you've captured
                  </Text>

                  {journalEntries.map((entry) => (
                    <View
                      key={entry.id}
                      style={[
                        styles.entryCard,
                        glowEnabled && entry.mood && {
                          borderColor: toRgba(entry.mood.color, 0.64),
                          shadowColor: entry.mood.color,
                          shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                          shadowRadius: 24,
                          shadowOffset: { width: 0, height: 4 },
                          borderWidth: 2,
                          backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.75)' : theme.cardBackground,
                          // No elevation for dark mode
                          ...(theme.mode !== 'dark' && { elevation: 6 }),
                          boxShadow: [
                            `0 0 30px ${theme.mode === 'dark' ? toRgba(entry.mood.color, 0.42) : toRgba(entry.mood.color, 0.32)}`,
                            `0 0 60px ${theme.mode === 'dark' ? toRgba(entry.mood.color, 0.22) : toRgba(entry.mood.color, 0.16)}`,
                            `inset 0 0 20px ${toRgba(entry.mood.color, 0.1)}`,
                          ].join(', '),
                        }
                      ]}
                    >
                      {glowEnabled && entry.mood && (
                        <View
                          pointerEvents="none"
                          style={{
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            right: -8,
                            bottom: -8,
                            borderRadius: borderRadius.lg + 8,
                            opacity: 0.8,
                            backgroundColor: toRgba(entry.mood.color, theme.mode === 'dark' ? 0.12 : 0.04),
                          }}
                        />
                      )}
                      <View style={styles.entryHeader}>
                        <View style={styles.entryHeaderMain}>
                          <Ionicons name="calendar-outline" size={16} color={theme.textMuted} />
                          <Text style={styles.entryDate}>{formatDate(entry.timestamp)}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteEntry(entry.id)}
                          style={styles.deleteButton}
                        >
                          <Ionicons name="trash-outline" size={18} color={toRgba(theme.error || '#EF4444', 0.6)} />
                        </TouchableOpacity>
                      </View>

                      {entry.mood && (
                        <View style={[
                          styles.entryMoodBadge,
                          {
                            backgroundColor: theme.mode === 'light'
                              ? toRgba(entry.mood.color, 0.25)
                              : entry.mood.color + '30',
                            borderColor: theme.mode === 'light' ? toRgba(entry.mood.color, 0.5) : 'transparent',
                            borderWidth: theme.mode === 'light' ? 1.5 : 0,
                          }
                        ]}>
                          <View style={[styles.moodDot, { backgroundColor: entry.mood.color }]} />
                          <Text style={[
                            styles.entryMoodText,
                            {
                              color: theme.mode === 'light' ? '#1E293B' : entry.mood.color
                            }
                          ]}>
                            {entry.mood.emotion || entry.mood.name}
                          </Text>
                        </View>
                      )}

                      <Text style={styles.entryText}>
                        {entry.text}
                      </Text>
                    </View>
                  ))}

                  {journalEntries.length === 0 && (
                    <View style={styles.emptyState}>
                      <Ionicons name="book-outline" size={48} color={theme.textMuted} />
                      <Text style={styles.emptyStateText}>
                        No entries yet. Start writing to save your thoughts.
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            <View style={styles.bottomSpacer} />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
      <PromptEditModal
        visible={showPromptModal}
        onClose={() => {
          setShowPromptModal(false);
          setEditingPrompt(undefined);
        }}
        prompt={editingPrompt}
        onSave={handleSavePrompt}
        onDelete={editingPrompt ? () => handleDeletePrompt(editingPrompt.id) : undefined}
      />

      <Modal
        visible={showMoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMoodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowMoodModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.mode === 'dark' ? '#1E293B' : '#FFFFFF',
                height: '80%'
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How are you feeling?</Text>
              <TouchableOpacity onPress={() => setShowMoodModal(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchContainer}>
              <Ionicons name="search" size={20} color={theme.textMuted} style={styles.modalSearchIcon} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search emotions..."
                placeholderTextColor={theme.textMuted}
                value={moodSearchQuery}
                onChangeText={setMoodSearchQuery}
              />
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={{ paddingBottom: 60 }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {emotionClusters.map((cluster) => {
                const filteredEmotions = cluster.emotions.filter(e =>
                  e.label.toLowerCase().includes(moodSearchQuery.toLowerCase()) ||
                  e.synonyms.some(s => s.toLowerCase().includes(moodSearchQuery.toLowerCase()))
                );

                if (filteredEmotions.length === 0) return null;

                const level = consciousnessLevels.find(l => l.id === cluster.primaryLevelId);
                const clusterColor = level?.color || theme.primary;

                return (
                  <View key={cluster.id} style={styles.clusterSection}>
                    <Text style={[styles.clusterLabel, { color: theme.textSecondary }]}>
                      {cluster.label}
                    </Text>
                    <View style={styles.modalChipContainer}>
                      {filteredEmotions.map((emotion) => (
                        <React.Fragment key={emotion.label}>
                          {([emotion.label, ...emotion.synonyms]).filter(l =>
                            !['Shame', 'Guilt', 'Apathy', 'Grief', 'Fear', 'Desire', 'Anger', 'Pride'].includes(l)
                          ).slice(0, 3).map((label) => (
                            <TouchableOpacity
                              key={label}
                              onPress={() => {
                                setSelectedMood({
                                  levelId: cluster.primaryLevelId,
                                  name: level?.name || cluster.primaryLevelId,
                                  color: clusterColor,
                                  emotion: label
                                });
                                setShowMoodModal(false);
                                setMoodSearchQuery('');
                              }}
                              style={[
                                styles.modalChip,
                                {
                                  backgroundColor: theme.mode === 'light' ? toRgba(clusterColor, 0.3) : clusterColor + '30',
                                  borderColor: theme.mode === 'light' ? toRgba(clusterColor, 0.6) : clusterColor + '50',
                                  borderWidth: 1.5
                                },
                                selectedMood?.emotion === label && {
                                  borderColor: clusterColor,
                                  borderWidth: 2,
                                  backgroundColor: theme.mode === 'light' ? toRgba(clusterColor, 0.5) : clusterColor + '60',
                                }
                              ]}
                            >
                              <Text style={[
                                styles.modalChipText,
                                {
                                  color: theme.mode === 'light' ? '#1E293B' : clusterColor
                                }
                              ]}>
                                {label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </React.Fragment>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FeatureExplanationOverlay
        visible={showJournalExplanation}
        title="Journaling"
        description="A sacred space to express your inner world without judgment. Link your entries to your current level or choose a mood to track your energetic journey."
        icon="journal-outline"
        onClose={() => {
          setShowJournalExplanation(false);
          markExplanationAsSeen('journal');
        }}
      />

      <AestheticAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: ThemeColors, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: 100,
    },
    header: {
      marginBottom: spacing.xl,
    },
    headerTitle: {
      fontSize: typography.h1,
      fontWeight: 'bold',
      color: theme.mode === 'dark' ? theme.textPrimary : '#1E293B',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.textSecondary : '#64748B',
      lineHeight: 22,
    },
    promptsSection: {
      marginBottom: spacing.xl,
    },
    promptsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    promptsTitle: {
      fontSize: typography.small,
      fontWeight: '600',
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    addPromptButton: {
      padding: spacing.xs,
    },
    promptsContainer: {
      paddingRight: spacing.lg,
      gap: spacing.sm,
    },
    promptCardWrapper: {
      position: 'relative',
      marginRight: spacing.sm,
    },
    promptCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(255, 255, 255, 0.6)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(203, 213, 225, 0.5)',
      marginRight: spacing.sm,
      overflow: 'hidden',
    },
    promptCardSelected: {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: theme.primary,
    },
    promptText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    promptTextSelected: {
      color: theme.primary,
      fontWeight: '600',
    },
    editPromptButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.round,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      borderWidth: 2,
      borderColor: theme.white,
      ...(theme.mode === 'dark' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
      }),
      ...(theme.mode === 'light' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }),
    },
    writingSection: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.08)' // Premium violet tint
        : 'rgba(255, 255, 255, 0.8)',
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 2,
      borderColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.3)'
        : 'rgba(139, 92, 246, 0.25)',
      marginBottom: spacing.xl,
      overflow: 'hidden',
    },
    writingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    writingTitle: {
      fontSize: typography.body,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    textInput: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      minHeight: 200,
      padding: 0,
      textAlignVertical: 'top',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    clearButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.textMuted,
    },
    clearButtonText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    saveButtonText: {
      fontSize: typography.body,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    privacyNote: {
      fontSize: typography.small,
      color: theme.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    viewEntriesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    viewEntriesText: {
      fontSize: typography.body,
      color: theme.primary,
      fontWeight: '600',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.lg,
    },
    backButtonText: {
      fontSize: typography.body,
      color: theme.primary,
      fontWeight: '600',
    },
    entriesSection: {
      marginBottom: spacing.xl,
    },
    entriesSectionTitle: {
      fontSize: typography.h2,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    entriesSectionSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    entryCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(255, 255, 255, 0.7)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(203, 213, 225, 0.4)',
      overflow: 'hidden',
    },
    entryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    entryDate: {
      fontSize: typography.small,
      color: theme.textMuted,
      fontWeight: '500',
    },
    entryText: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl * 2,
      gap: spacing.md,
    },
    emptyStateText: {
      fontSize: typography.body,
      color: theme.textMuted,
      textAlign: 'center',
      maxWidth: 250,
    },
    bottomSpacer: {
      height: 40,
    },
    moodSection: {
      marginBottom: spacing.lg,
    },
    moodTitle: {
      fontSize: typography.small,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    moodScroll: {
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },
    moodChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.roundedChip,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    moodChipText: {
      fontSize: typography.small,
      fontWeight: '600',
    },
    entryHeaderMain: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    deleteButton: {
      padding: spacing.xs,
    },
    entryMoodBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.roundedChip,
      marginBottom: spacing.sm,
      gap: 6,
    },
    moodDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    entryMoodText: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.roundedChip,
      gap: 6,
    },
    streakCount: {
      fontSize: typography.body,
      fontWeight: 'bold',
      color: '#FF9800',
    },
    // New Mood Redesign Styles
    moodSelectorTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 213, 225, 0.5)',
    },
    moodSelectorLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    moodSelectorText: {
      fontSize: typography.body,
      fontWeight: '600',
    },
    purposeCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(139, 92, 246, 0.05)', // Subtle violet tint in light mode
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      borderWidth: 2,
      borderColor: theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)',
      ...(glowEnabled && {
        shadowColor: palette.violet400,
        shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.15,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 4 },
        elevation: 0,
      }),
    },
    purposeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    purposeTitle: {
      fontSize: typography.body,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    purposeText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
    moodSelectorPlaceholder: {
      fontSize: typography.body,
      color: theme.textMuted,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: borderRadius.xxl,
      borderTopRightRadius: borderRadius.xxl,
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    modalTitle: {
      fontSize: typography.h3,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    modalSearchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    modalSearchIcon: {
      marginRight: spacing.sm,
    },
    modalSearchInput: {
      flex: 1,
      height: 44,
      color: theme.textPrimary,
      fontSize: typography.body,
    },
    modalScroll: {
      flex: 1,
      marginBottom: spacing.md,
    },
    clusterSection: {
      marginBottom: spacing.xl,
    },
    clusterLabel: {
      fontSize: typography.small,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.md,
      opacity: 0.6,
    },
    modalChipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    modalChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.roundedChip,
    },
    modalChipText: {
      fontSize: typography.small,
      fontWeight: '700',
    },
  });
