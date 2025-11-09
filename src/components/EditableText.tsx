import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { useContentEdit } from '../context/ContentEditContext';
import TextEditModal from './TextEditModal';

interface EditableTextProps {
  screen: string;
  section: string;
  id: string;
  originalContent: string;
  style?: any;
  textStyle?: any;
  isOriginal?: boolean;
  onContentChange?: (content: string) => void;
  type?: 'paragraph' | 'quote' | 'mantra' | 'title' | 'description' | 'subtitle';
}

export default function EditableText({
  screen,
  section,
  id,
  originalContent,
  style,
  textStyle,
  isOriginal = true,
  onContentChange,
  type = 'paragraph',
}: EditableTextProps) {
  const theme = useThemeColors();
  const { editModeEnabled, getEditableContent } = useContentEdit();
  const [content, setContent] = useState(originalContent);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const editedContent = await getEditableContent(screen, section, id, originalContent);
        setContent(editedContent);
        if (onContentChange) {
          onContentChange(editedContent);
        }
      } catch (error) {
        console.error('Failed to load editable content:', error);
        setContent(originalContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [screen, section, id, originalContent, getEditableContent, onContentChange]);

  // Debug: Log edit mode status (must be before any conditional returns)
  useEffect(() => {
    if (!editModeEnabled) {
      console.log('EditableText: editModeEnabled is FALSE for', screen, section, id);
    }
  }, [editModeEnabled, screen, section, id]);

  const handleSave = (newContent: string) => {
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      ...style,
    },
    textContainer: {
      position: 'relative',
      paddingTop: 8,
      paddingRight: 8,
    },
    editButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.full,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      borderWidth: 2,
      borderColor: theme.white,
      ...(theme.mode === 'dark' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
      }),
      ...(theme.mode === 'light' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
      }),
    },
    editedIndicator: {
      position: 'absolute',
      top: -spacing.xs,
      left: -spacing.xs,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      zIndex: 9,
    },
    newBadge: {
      position: 'absolute',
      top: -spacing.sm,
      left: -spacing.sm,
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      zIndex: 9,
    },
    newBadgeText: {
      fontSize: 10,
      fontWeight: typography.bold,
      color: theme.white,
      textTransform: 'uppercase',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={textStyle}>{originalContent}</Text>
      </View>
    );
  }

  const isEdited = content !== originalContent;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {editModeEnabled && (
          <>
            {!isOriginal && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
            {isEdited && isOriginal && (
              <View style={styles.editedIndicator} />
            )}
            <Pressable
              style={styles.editButton}
              onPress={() => {
                console.log('Edit button pressed for', screen, section, id);
                setShowEditModal(true);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="create-outline" size={18} color={theme.white} />
            </Pressable>
          </>
        )}
        <Text style={textStyle}>{content}</Text>
      </View>

      <TextEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        screen={screen}
        section={section}
        id={id}
        originalContent={originalContent}
        editedContent={isEdited ? content : undefined}
        isOriginal={isOriginal}
        onSave={handleSave}
      />
    </View>
  );
}

