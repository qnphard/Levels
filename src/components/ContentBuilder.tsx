import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { useContentEdit, ContentSection } from '../context/ContentEditContext';
import AddSectionModal from './AddSectionModal';

interface ContentBuilderProps {
  screen: string;
  section: string;
  onStructureChange?: () => void;
}

export default function ContentBuilder({
  screen,
  section,
  onStructureChange,
}: ContentBuilderProps) {
  const theme = useThemeColors();
  const { editModeEnabled, addSection, deleteSection, reorderSection } = useContentEdit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetId, setTargetId] = useState<string | undefined>();

  if (!editModeEnabled) {
    return null;
  }

  const handleAddSection = async (
    type: 'paragraph' | 'quote' | 'mantra' | 'title' | 'description' | 'subtitle',
    content: string,
    position: 'before' | 'after' | 'end',
    targetId?: string
  ) => {
    try {
      const newId = `${screen}:${section}:new:${Date.now()}`;
      const newSection: ContentSection = {
        id: newId,
        type,
        content,
        order: 0, // Will be set by addSection
        isOriginal: false,
      };

      await addSection(screen, section, newSection, position, targetId);
      if (onStructureChange) {
        onStructureChange();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    Alert.alert(
      'Delete Section',
      'This will permanently delete this section. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSection(screen, section, id);
              if (onStructureChange) {
                onStructureChange();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete section');
            }
          },
        },
      ]
    );
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      await reorderSection(screen, section, id, direction);
      if (onStructureChange) {
        onStructureChange();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reorder section');
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
    deleteButton: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 50, 50, 0.3)' : 'rgba(255, 50, 50, 0.2)',
    },
    buttonText: {
      fontSize: typography.small,
      color: theme.textPrimary,
    },
    addButtonText: {
      color: theme.white,
      fontWeight: typography.semibold,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => {
            setTargetId(undefined);
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={18} color={theme.white} />
        </Pressable>
      </View>

      <AddSectionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        screen={screen}
        section={section}
        onSave={handleAddSection}
        targetId={targetId}
      />
    </>
  );
}

export interface SectionControlsProps {
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

export function SectionControls({
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
}: SectionControlsProps) {
  const theme = useThemeColors();
  const { editModeEnabled, addSection } = useContentEdit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPosition, setAddPosition] = useState<'before' | 'after'>('after');

  if (!editModeEnabled) {
    return null;
  }

  const handleAddClick = (position: 'before' | 'after') => {
    setAddPosition(position);
    setShowAddModal(true);
  };

  const handleAddSection = async (
    type: 'paragraph' | 'quote' | 'mantra' | 'title' | 'description' | 'subtitle',
    content: string,
    position: 'before' | 'after' | 'end',
    targetId?: string
  ) => {
    try {
      const newId = `${screen}:${section}:new:${Date.now()}`;
      const newSection: ContentSection = {
        id: newId,
        type,
        content,
        order: 0,
        isOriginal: false,
      };

      await addSection(screen, section, newSection, position, targetId || id);
    } catch (error) {
      Alert.alert('Error', 'Failed to add section');
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
          <Text style={{ fontSize: 8, color: theme.textSecondary, marginTop: -2 }}>Before</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleAddClick('after')}>
          <Ionicons name="add-circle-outline" size={16} color={theme.textPrimary} />
          <Text style={{ fontSize: 8, color: theme.textSecondary, marginTop: -2 }}>After</Text>
        </Pressable>
        {!isOriginal && (
          <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color={theme.white} />
          </Pressable>
        )}
      </View>

      <AddSectionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        screen={screen}
        section={section}
        onSave={handleAddSection}
        targetId={id}
      />
    </>
  );
}

// Helper function for use in components
export async function handleAddSection(
  screen: string,
  section: string,
  type: 'paragraph' | 'quote' | 'mantra' | 'title' | 'description' | 'subtitle',
  content: string,
  position: 'before' | 'after' | 'end',
  targetId: string | undefined,
  addSectionFn: (screen: string, section: string, newSection: ContentSection, position?: 'before' | 'after' | 'end', targetId?: string) => Promise<void>
) {
  const newId = `${screen}:${section}:new:${Date.now()}`;
  const newSection: ContentSection = {
    id: newId,
    type,
    content,
    order: 0,
    isOriginal: false,
  };

  await addSectionFn(screen, section, newSection, position, targetId);
}

