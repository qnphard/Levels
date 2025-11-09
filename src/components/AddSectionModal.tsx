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
import { ContentSectionType } from '../context/ContentEditContext';

interface AddSectionModalProps {
  visible: boolean;
  onClose: () => void;
  screen: string;
  section: string;
  onSave: (type: ContentSectionType, content: string, position: 'before' | 'after' | 'end', targetId?: string) => void;
  targetId?: string;
  availableTypes?: ContentSectionType[];
}

const defaultTypes: ContentSectionType[] = ['paragraph', 'quote', 'mantra', 'title', 'description', 'subtitle'];

export default function AddSectionModal({
  visible,
  onClose,
  screen,
  section,
  onSave,
  targetId,
  availableTypes = defaultTypes,
}: AddSectionModalProps) {
  const theme = useThemeColors();
  const [selectedType, setSelectedType] = useState<ContentSectionType>('paragraph');
  const [content, setContent] = useState('');
  const [position, setPosition] = useState<'before' | 'after' | 'end'>('end');

  useEffect(() => {
    if (visible) {
      setContent('');
      setSelectedType('paragraph');
      setPosition(targetId ? 'after' : 'end');
    }
  }, [visible, targetId]);

  const handleSave = () => {
    if (content.trim() === '') {
      Alert.alert('Error', 'Content cannot be empty');
      return;
    }

    onSave(selectedType, content, position, targetId);
    onClose();
  };

  const typeLabels: Record<ContentSectionType, string> = {
    paragraph: 'Paragraph',
    quote: 'Quote',
    mantra: 'Mantra',
    title: 'Title',
    description: 'Description',
    subtitle: 'Subtitle',
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
    typeSelector: {
      marginBottom: spacing.md,
    },
    typeLabel: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    typeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    typeButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    },
    typeButtonSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    typeButtonText: {
      fontSize: typography.small,
      color: theme.textPrimary,
    },
    typeButtonTextSelected: {
      color: theme.white,
      fontWeight: typography.semibold,
    },
    positionSelector: {
      marginBottom: spacing.md,
    },
    positionLabel: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    positionRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    positionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      alignItems: 'center',
    },
    positionButtonSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    positionButtonText: {
      fontSize: typography.small,
      color: theme.textPrimary,
    },
    positionButtonTextSelected: {
      color: theme.white,
      fontWeight: typography.semibold,
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    input: {
      minHeight: 120,
      maxHeight: 300,
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
    buttonText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.white,
    },
    cancelButtonText: {
      color: theme.textPrimary,
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
              <Text style={styles.title}>Add New Section</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 500 }}>
              <View style={styles.typeSelector}>
                <Text style={styles.typeLabel}>Type</Text>
                <View style={styles.typeRow}>
                  {availableTypes.map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeButton,
                        selectedType === type && styles.typeButtonSelected,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          selectedType === type && styles.typeButtonTextSelected,
                        ]}
                      >
                        {typeLabels[type]}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {targetId && (
                <View style={styles.positionSelector}>
                  <Text style={styles.positionLabel}>Position</Text>
                  <View style={styles.positionRow}>
                    <Pressable
                      style={[
                        styles.positionButton,
                        position === 'before' && styles.positionButtonSelected,
                      ]}
                      onPress={() => setPosition('before')}
                    >
                      <Text
                        style={[
                          styles.positionButtonText,
                          position === 'before' && styles.positionButtonTextSelected,
                        ]}
                      >
                        Before
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.positionButton,
                        position === 'after' && styles.positionButtonSelected,
                      ]}
                      onPress={() => setPosition('after')}
                    >
                      <Text
                        style={[
                          styles.positionButtonText,
                          position === 'after' && styles.positionButtonTextSelected,
                        ]}
                      >
                        After
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.positionButton,
                        position === 'end' && styles.positionButtonSelected,
                      ]}
                      onPress={() => setPosition('end')}
                    >
                      <Text
                        style={[
                          styles.positionButtonText,
                          position === 'end' && styles.positionButtonTextSelected,
                        ]}
                      >
                        End
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

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
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Add Section</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

