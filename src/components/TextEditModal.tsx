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
import { useContentEdit } from '../context/ContentEditContext';

interface TextEditModalProps {
  visible: boolean;
  onClose: () => void;
  screen: string;
  section: string;
  id: string;
  originalContent: string;
  editedContent?: string;
  isOriginal: boolean;
  onSave: (content: string) => void;
  onDelete?: () => void;
}

export default function TextEditModal({
  visible,
  onClose,
  screen,
  section,
  id,
  originalContent,
  editedContent,
  isOriginal,
  onSave,
  onDelete,
}: TextEditModalProps) {
  const theme = useThemeColors();
  const { saveEdit, resetEdit } = useContentEdit();
  const [content, setContent] = useState(editedContent || originalContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setContent(editedContent || originalContent);
    }
  }, [visible, editedContent, originalContent]);

  const handleSave = async () => {
    if (content.trim() === '') {
      Alert.alert('Error', 'Content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await saveEdit(screen, section, id, content);
      onSave(content);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset Content',
      'This will restore the original content. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetEdit(screen, section, id);
              setContent(originalContent);
              onSave(originalContent);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to reset content');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        'Delete Section',
        'This will permanently delete this section. Continue?',
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
    input: {
      minHeight: 150,
      maxHeight: 400,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      color: theme.textPrimary,
      fontSize: typography.body,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    characterCount: {
      fontSize: typography.small,
      color: theme.textSecondary,
      textAlign: 'right',
      marginTop: spacing.xs,
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
    resetButton: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 100, 100, 0.1)',
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
    resetButtonText: {
      color: theme.mode === 'dark' ? '#FF6464' : '#CC0000',
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
              <Text style={styles.title}>Edit Content</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  placeholder="Enter content..."
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                />
                <Text style={styles.characterCount}>
                  {content.length} characters
                </Text>
              </View>
            </ScrollView>

            <View style={styles.buttonRow}>
              {!isOriginal && onDelete && (
                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
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



