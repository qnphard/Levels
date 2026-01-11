import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
} from '../theme/colors';
import PasscodeScreen from '../components/PasscodeScreen';
import { useContentEdit } from '../context/ContentEditContext';
import PromptEditModal from '../components/PromptEditModal';
import EditModeIndicator from '../components/EditModeIndicator';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

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
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [entries, setEntries] = useState<Array<{ text: string; date: Date }>>([]);
  const [showingPastEntries, setShowingPastEntries] = useState(false);
  const [prompts, setPrompts] = useState<JournalPrompt[]>(DEFAULT_PROMPTS);
  const [editingPrompt, setEditingPrompt] = useState<JournalPrompt | undefined>(undefined);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showJournalExplanation, setShowJournalExplanation] = useState(false);
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
      const newEntry = {
        text: journalText,
        date: new Date(),
      };
      setEntries([newEntry, ...entries]);
      setJournalText('');
      setSelectedPrompt(null);
      // TODO: Save to persistent storage via context
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

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const updatedPrompts = prompts.filter(p => p.id !== promptId);
      setPrompts(updatedPrompts);
      await AsyncStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(updatedPrompts));
      setShowPromptModal(false);
      setEditingPrompt(undefined);
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const formatDate = (date: Date) => {
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Your Safe Space</Text>
              <Text style={styles.headerSubtitle}>
                Write freely. No judgment. Just you.
              </Text>
            </View>

            {/* Current Entry Section */}
            {!showingPastEntries ? (
              <>
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
                    {prompts.map((prompt) => (
                      <View key={prompt.id} style={styles.promptCardWrapper}>
                        <TouchableOpacity
                          style={[
                            styles.promptCard,
                            selectedPrompt === prompt.text && styles.promptCardSelected,
                          ]}
                          onPress={() => handlePromptSelect(prompt.text)}
                        >
                          <Ionicons
                            name={prompt.icon}
                            size={20}
                            color={
                              selectedPrompt === prompt.text
                                ? theme.primary
                                : theme.textSecondary
                            }
                          />
                          <Text
                            style={[
                              styles.promptText,
                              selectedPrompt === prompt.text && styles.promptTextSelected,
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
                    ))}
                  </ScrollView>
                </View>

                {/* Writing Area */}
                <View style={[
                  styles.writingSection,
                  glowEnabled && theme.mode === 'dark' && {
                    borderWidth: 2,
                    borderColor: toRgba(theme.primary, 0.6),
                    shadowColor: theme.primary,
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 0, // Remove elevation to prevent square shadow
                  },
                  glowEnabled && theme.mode === 'light' && {
                    borderWidth: 2,
                    borderColor: toRgba(theme.primary, 0.5),
                    shadowColor: theme.primary,
                    shadowOpacity: 0.25,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 0, // Remove elevation to prevent square shadow
                  },
                ]}>
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
                {entries.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewEntriesButton}
                    onPress={() => setShowingPastEntries(true)}
                  >
                    <Ionicons name="book-outline" size={20} color={theme.primary} />
                    <Text style={styles.viewEntriesText}>
                      View past entries ({entries.length})
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

                  {entries.map((entry, index) => (
                    <View key={index} style={styles.entryCard}>
                      <View style={styles.entryHeader}>
                        <Ionicons name="calendar-outline" size={16} color={theme.textMuted} />
                        <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                      </View>
                      <Text style={styles.entryText} numberOfLines={5}>
                        {entry.text}
                      </Text>
                    </View>
                  ))}

                  {entries.length === 0 && (
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

      <FeatureExplanationOverlay
        visible={showJournalExplanation}
        title="Your Safe Space"
        description="This journal is password-protected, so you can feel completely safe sharing your deepest feelings. Writing helps you realize that your feelings are just thoughts passing through. By laying them down here, you discharge their weight, learn to distance yourself from them, and stop identifying with the temporary waves of emotion."
        icon="journal-outline"
        onClose={() => {
          setShowJournalExplanation(false);
          markExplanationAsSeen('journal');
        }}
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
      fontWeight: typography.bold,
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
      fontWeight: typography.semibold,
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
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: 'rgba(203, 213, 225, 0.5)',
      marginRight: spacing.sm,
    },
    promptCardSelected: {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: theme.primary,
    },
    promptText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: typography.medium,
    },
    promptTextSelected: {
      color: theme.primary,
      fontWeight: typography.semibold,
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
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.7)',
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: glowEnabled ? (theme.mode === 'dark' ? 2 : 2) : (theme.mode === 'dark' ? 1 : 1),
      borderColor: glowEnabled
        ? (theme.mode === 'dark' ? toRgba(theme.primary, 0.8) : toRgba(theme.primary, 0.95))
        : (theme.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(203, 213, 225, 0.4)'),
      marginBottom: spacing.xl,
    },
    writingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    writingTitle: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
    },
    textInput: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      minHeight: 200,
      padding: 0,
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
      fontWeight: typography.medium,
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
      fontWeight: typography.semibold,
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
      fontWeight: typography.semibold,
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
      fontWeight: typography.semibold,
    },
    entriesSection: {
      marginBottom: spacing.xl,
    },
    entriesSectionTitle: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    entriesSectionSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    entryCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(203, 213, 225, 0.4)',
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
      fontWeight: typography.medium,
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
  });
