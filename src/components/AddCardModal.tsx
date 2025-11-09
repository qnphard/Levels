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
import { CardData } from '../context/ContentEditContext';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  screen: string;
  section: string;
  onSave: (card: CardData, position: 'before' | 'after' | 'end', targetId?: string) => void;
  targetId?: string;
  cardType: 'library' | 'level';
}

export default function AddCardModal({
  visible,
  onClose,
  screen,
  section,
  onSave,
  targetId,
  cardType,
}: AddCardModalProps) {
  const theme = useThemeColors();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState<'before' | 'after' | 'end'>('end');
  
  // For library cards
  const [icon, setIcon] = useState('sparkles');
  const [navigationTarget, setNavigationTarget] = useState('');
  
  // For level cards
  const [level, setLevel] = useState('');
  const [antithesis, setAntithesis] = useState('');
  const [color, setColor] = useState('#8B5CF6'); // Default purple

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setIcon('sparkles');
      setNavigationTarget('');
      setLevel('');
      setAntithesis('');
      setColor('#8B5CF6');
      setPosition(targetId ? 'after' : 'end');
    }
  }, [visible, targetId]);

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
    if (description.trim() === '') {
      Alert.alert('Error', 'Description cannot be empty');
      return;
    }

    const newCard: CardData = {
      id: `${screen}:${section}:card:${Date.now()}`,
      type: cardType,
      title: title.trim(),
      description: description.trim(),
      order: 0, // Will be set by addCard
      isOriginal: false,
    };

    if (cardType === 'library') {
      newCard.icon = icon;
      newCard.navigationTarget = navigationTarget.trim() || undefined;
    } else {
      newCard.level = level ? parseInt(level, 10) : undefined;
      newCard.antithesis = antithesis.trim() || undefined;
      newCard.color = color;
      // Generate default gradients based on color
      const baseColor = color;
      newCard.gradient = [baseColor, baseColor] as const;
      newCard.gradientDark = [baseColor, baseColor] as const;
      newCard.glowDark = baseColor;
    }

    onSave(newCard, position, targetId);
    onClose();
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
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.textSecondary,
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
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
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
              <Text style={styles.title}>Add New Card</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 500 }}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Card title"
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  placeholder="Card description"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              {cardType === 'library' && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Icon Name (Ionicons)</Text>
                    <TextInput
                      style={styles.input}
                      value={icon}
                      onChangeText={setIcon}
                      placeholder="sparkles"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Navigation Target (optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={navigationTarget}
                      onChangeText={setNavigationTarget}
                      placeholder="Essentials, LearnHub, etc."
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                </>
              )}

              {cardType === 'level' && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Level Number (optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={level}
                      onChangeText={setLevel}
                      keyboardType="numeric"
                      placeholder="20, 30, 50, etc."
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Antithesis (optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={antithesis}
                      onChangeText={setAntithesis}
                      placeholder="Self-Compassion, Forgiveness, etc."
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Color (hex, optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={color}
                      onChangeText={setColor}
                      placeholder="#8B5CF6"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                </>
              )}

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
                <Text style={styles.buttonText}>Add Card</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

