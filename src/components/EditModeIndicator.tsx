import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { useContentEdit } from '../context/ContentEditContext';

export default function EditModeIndicator() {
  const theme = useThemeColors();
  const { editModeEnabled } = useContentEdit();

  if (!editModeEnabled) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      zIndex: 10000,
      borderWidth: 2,
      borderColor: theme.white,
      ...(theme.mode === 'dark' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 10,
      }),
      ...(theme.mode === 'light' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
      }),
    },
    text: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
      color: theme.white,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name="create-outline" size={18} color={theme.white} />
      <Text style={styles.text}>Edit Mode ON</Text>
    </View>
  );
}

