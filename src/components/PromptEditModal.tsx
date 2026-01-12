import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';

interface JournalPrompt {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface PromptEditModalProps {
  visible: boolean;
  onClose: () => void;
  prompt?: JournalPrompt;
  onSave: (prompt: JournalPrompt) => void;
  onDelete?: () => void;
}

const commonIcons: Array<keyof typeof Ionicons.glyphMap> = [
  'heart-outline',
  'leaf-outline',
  'sunny-outline',
  'cloud-outline',
  'water-outline',
  'create-outline',
  'star-outline',
  'moon-outline',
  'flower-outline',
  'sparkles-outline',
  'musical-notes-outline',
  'book-outline',
];

export default function PromptEditModal({
  visible,
  onClose,
  prompt,
  onSave,
  onDelete,
}: PromptEditModalProps) {
  const theme = useThemeColors();
  const [text, setText] = useState(prompt?.text || '');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof Ionicons.glyphMap>(
    prompt?.icon || 'heart-outline'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setText(prompt?.text || '');
      setSelectedIcon(prompt?.icon || 'heart-outline');
    }
  }, [visible, prompt]);

  const handleSave = () => {
    if (text.trim() === '') {
      Alert.alert('Error', 'Prompt text cannot be empty');
      return;
    }

    setIsSaving(true);
    onSave({ text: text.trim(), icon: selectedIcon });
    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        'Delete Prompt',
        'This will permanently delete this prompt. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              onDelete();
              onClose();
            },
          },
        ]
      );
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '90%',
      maxWidth: 500,
      maxHeight: '80%',
      backgroundColor: theme.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...(theme.mode === 'dark' && {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      color: theme.textPrimary,
      fontSize: typography.body,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    iconSection: {
      marginBottom: spacing.md,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    iconButtonSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySubtle,
    },
    iconButtonUnselected: {
      borderColor: theme.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    cancelButton: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    deleteButton: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 50, 50, 0.3)' : 'rgba(255, 50, 50, 0.2)',
    },
    buttonText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.white,
    },
    cancelButtonText: {
      color: theme.textPrimary,
    },
    deleteButtonText: {
      color: theme.white,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>{prompt ? 'Edit Prompt' : 'Add Prompt'}</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Prompt Text</Text>
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="What am I feeling right now?"
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                />
              </View>

              <View style={styles.iconSection}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {commonIcons.map((icon) => (
                    <Pressable
                      key={icon}
                      style={[
                        styles.iconButton,
                        selectedIcon === icon
                          ? styles.iconButtonSelected
                          : styles.iconButtonUnselected,
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Ionicons
                        name={icon}
                        size={24}
                        color={selectedIcon === icon ? theme.white : theme.textSecondary}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonRow}>
              {prompt && onDelete && (
                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

