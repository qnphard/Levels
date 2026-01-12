import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useGlowEnabled, spacing, typography, borderRadius, ThemeColors } from '../theme/colors';
import { useContentEdit, CardData } from '../context/ContentEditContext';
import EditableText from './EditableText';
import { CardControls } from './CardBuilder';
import DraggableCard from './DraggableCard';

interface EditableLibraryCardProps {
  card: CardData;
  index: number;
  totalCards: number;
  onPress?: () => void;
  onStructureChange?: () => void;
  style?: any;
}

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function EditableLibraryCard({
  card,
  index,
  totalCards,
  onPress,
  onStructureChange,
  style,
}: EditableLibraryCardProps) {
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const { editModeEnabled, getEditableContent, saveEdit, deleteCard, reorderCard } = useContentEdit();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  useEffect(() => {
    const loadContent = async () => {
      const editedTitle = await getEditableContent('library', 'cards', `${card.id}-title`, card.title);
      const editedDesc = await getEditableContent('library', 'cards', `${card.id}-description`, card.description);
      setTitle(editedTitle);
      setDescription(editedDesc);
    };
    loadContent();
  }, [card.id, card.title, card.description, getEditableContent]);

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    await saveEdit('library', 'cards', `${card.id}-title`, newTitle);
  };

  const handleDescriptionChange = async (newDesc: string) => {
    setDescription(newDesc);
    await saveEdit('library', 'cards', `${card.id}-description`, newDesc);
  };

  const handleDelete = async () => {
    await deleteCard('library', 'cards', card.id);
    if (onStructureChange) {
      onStructureChange();
    }
  };

  const handleMoveUp = async () => {
    await reorderCard('library', 'cards', card.id, 'up');
    if (onStructureChange) {
      onStructureChange();
    }
  };

  const handleMoveDown = async () => {
    await reorderCard('library', 'cards', card.id, 'down');
    if (onStructureChange) {
      onStructureChange();
    }
  };

  const handleAddBefore = () => {
    // Will be handled by CardBuilder
  };

  const handleAddAfter = () => {
    // Will be handled by CardBuilder
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (fromIndex: number, toIndex: number) => {
    setIsDragging(false);
    if (fromIndex === toIndex) return;
    
    // Calculate how many positions to move
    const diff = toIndex - fromIndex;
    const direction = diff > 0 ? 'down' : 'up';
    const steps = Math.abs(diff);
    
    // Move step by step
    for (let i = 0; i < steps; i++) {
      await reorderCard('library', 'cards', card.id, direction);
    }
    
    if (onStructureChange) {
      onStructureChange();
    }
  };

  const handleCardPress = () => {
    // Don't navigate if we're dragging
    if (!isDragging && onPress) {
      onPress();
    }
  };

  const styles = getStyles(theme);
  const iconName = (card.icon || 'sparkles') as keyof typeof Ionicons.glyphMap;

  return (
    <DraggableCard
      index={index}
      enabled={editModeEnabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <View style={[styles.cardContainer, style]}>
        {theme.mode === 'light' && (
          <View
            pointerEvents="none"
            style={styles.lightLiftShadow}
          />
        )}
        <Pressable
        onPress={handleCardPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.card,
          theme.mode === 'dark'
            ? (glowEnabled
                ? {
                    borderWidth: 2,
                    borderColor: toRgba(theme.primary, 0.8),
                    shadowColor: theme.primary,
                    shadowOpacity: 0.34,
                    backgroundColor: 'rgba(9, 19, 28, 0.75)',
                    boxShadow: [
                      `0 0 30px ${toRgba(theme.primary, 0.53)}`,
                      `0 0 60px ${toRgba(theme.primary, 0.27)}`,
                      `inset 0 0 20px ${toRgba(theme.primary, 0.13)}`,
                    ].join(', '),
                  }
                : {
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    backgroundColor: 'rgba(9, 19, 28, 0.7)',
                  })
            : (glowEnabled
                ? {
                    borderWidth: 2,
                    borderColor: toRgba(theme.primary, 0.95),
                    shadowColor: theme.primary,
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 6,
                    backgroundColor: theme.cardBackground,
                    boxShadow: [
                      `0 18px 50px rgba(2, 6, 23, 0.22)`,
                      `0 2px 8px rgba(2, 6, 23, 0.10)`,
                      `0 0 3px ${toRgba(theme.primary, 0.8)}`,
                      `0 0 30px ${toRgba(theme.primary, 0.5)}`,
                      `0 0 60px ${toRgba(theme.primary, 0.25)}`,
                    ].join(', '),
                    transform: pressed ? [{ translateY: -3 }] : [],
                  }
                : {
                    borderWidth: 1,
                    borderColor: 'rgba(2,6,23,0.08)',
                    shadowColor: 'rgba(2,6,23,0.32)',
                    shadowOpacity: 1,
                    shadowRadius: 22,
                    shadowOffset: { width: 0, height: 12 },
                    elevation: 6,
                    backgroundColor: theme.cardBackground,
                    boxShadow: [
                      `0 12px 24px rgba(15, 23, 42, 0.10)`,
                      `0 8px 20px rgba(15, 23, 42, 0.08)`,
                      `0 1px 2px rgba(2, 6, 23, 0.06)`,
                    ].join(', '),
                    transform: pressed ? [{ translateY: -3 }] : [],
                  }),
        ]}
      >
        <LinearGradient
          colors={theme.mode === 'dark'
            ? (['rgba(9, 19, 28, 0.85)', 'rgba(9, 19, 28, 0.75)'] as const)
            : ([theme.cardBackground, theme.cardBackground] as const)}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name={iconName} size={24} color={theme.primary} />
                <EditableText
                  screen="library"
                  section="cards"
                  id={`${card.id}-title`}
                  originalContent={card.title}
                  textStyle={styles.cardTitle}
                  type="title"
                  onContentChange={handleTitleChange}
                />
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardSubtitleContainer}>
              <EditableText
                screen="library"
                section="cards"
                id={`${card.id}-description`}
                originalContent={card.description}
                textStyle={styles.cardSubtitle}
                type="description"
                onContentChange={handleDescriptionChange}
              />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
      
      {editModeEnabled && (
        <CardControls
          screen="library"
          section="cards"
          id={card.id}
          isOriginal={card.isOriginal}
          canMoveUp={index > 0}
          canMoveDown={index < totalCards - 1}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onAddBefore={handleAddBefore}
          onAddAfter={handleAddAfter}
        />
      )}
      </View>
    </DraggableCard>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    cardContainer: {
      marginBottom: spacing.md,
      position: 'relative',
    },
    lightLiftShadow: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 12,
      bottom: -12,
      borderRadius: borderRadius.lg,
      zIndex: 0,
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 30px 60px rgba(2, 6, 23, 0.25), 0 10px 24px rgba(2, 6, 23, 0.12)' } as any)
        : null),
    },
    card: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      minHeight: 100,
    },
    gradientBackground: {
      padding: spacing.lg,
    },
    content: {
      gap: spacing.sm,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    cardTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    cardSubtitleContainer: {
      marginTop: spacing.xs,
    },
    cardSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });

