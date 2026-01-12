import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, borderRadius } from '../theme/colors';
import { useContentEdit, CardData } from '../context/ContentEditContext';
import AddCardModal from './AddCardModal';

interface CardBuilderProps {
  screen: string;
  section: string;
  cardType: 'library' | 'level';
  onStructureChange?: () => void;
}

export default function CardBuilder({
  screen,
  section,
  cardType,
  onStructureChange,
}: CardBuilderProps) {
  const theme = useThemeColors();
  const { editModeEnabled, addCard } = useContentEdit();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!editModeEnabled) {
    return null;
  }

  const handleAddCard = async (
    newCard: CardData,
    position: 'before' | 'after' | 'end',
    targetId?: string
  ) => {
    try {
      await addCard(screen, section, newCard, position, targetId);
      if (onStructureChange) {
        onStructureChange();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
      paddingVertical: spacing.xs,
    },
    button: {
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 32,
      height: 32,
    },
    addButton: {
      backgroundColor: theme.primary,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={18} color={theme.white} />
        </Pressable>
      </View>

      <AddCardModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        screen={screen}
        section={section}
        onSave={handleAddCard}
        cardType={cardType}
      />
    </>
  );
}

export interface CardControlsProps {
  screen: string;
  section: string;
  id: string;
  isOriginal: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBefore: () => void;
  onAddAfter: () => void;
}

export function CardControls({
  screen,
  section,
  id,
  isOriginal,
  canMoveUp,
  canMoveDown,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBefore,
  onAddAfter,
}: CardControlsProps) {
  const theme = useThemeColors();
  const { editModeEnabled, addCard } = useContentEdit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPosition, setAddPosition] = useState<'before' | 'after'>('after');
  const [cardType, setCardType] = useState<'library' | 'level'>('library');

  // Determine card type from screen/section
  useEffect(() => {
    if (screen === 'library') {
      setCardType('library');
    } else if (screen === 'journey') {
      setCardType('level');
    }
  }, [screen]);

  if (!editModeEnabled) {
    return null;
  }

  const handleAddClick = (position: 'before' | 'after') => {
    setAddPosition(position);
    setShowAddModal(true);
  };

  const handleAddCard = async (
    newCard: CardData,
    position: 'before' | 'after' | 'end',
    targetId?: string
  ) => {
    try {
      await addCard(screen, section, newCard, position, targetId || id);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingVertical: spacing.xs,
    },
    button: {
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 28,
      height: 28,
    },
    deleteButton: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 50, 50, 0.3)' : 'rgba(255, 50, 50, 0.2)',
    },
    disabledButton: {
      opacity: 0.3,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={[styles.button, !canMoveUp && styles.disabledButton]}
          onPress={onMoveUp}
          disabled={!canMoveUp}
        >
          <Ionicons name="chevron-up" size={16} color={theme.textPrimary} />
        </Pressable>
        <Pressable
          style={[styles.button, !canMoveDown && styles.disabledButton]}
          onPress={onMoveDown}
          disabled={!canMoveDown}
        >
          <Ionicons name="chevron-down" size={16} color={theme.textPrimary} />
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleAddClick('before')}>
          <Ionicons name="add-circle-outline" size={16} color={theme.textPrimary} />
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleAddClick('after')}>
          <Ionicons name="add-circle-outline" size={16} color={theme.textPrimary} />
        </Pressable>
        {!isOriginal && (
          <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color={theme.white} />
          </Pressable>
        )}
      </View>

      <AddCardModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        screen={screen}
        section={section}
        onSave={handleAddCard}
        targetId={id}
        cardType={cardType}
      />
    </>
  );
}

