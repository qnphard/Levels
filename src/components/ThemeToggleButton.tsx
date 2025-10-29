import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  useThemeMode,
  useThemeToggle,
  spacing,
  borderRadius,
} from '../theme/colors';

export default function ThemeToggleButton() {
  const theme = useThemeColors();
  const mode = useThemeMode();
  const toggleTheme = useThemeToggle();

  const isDark = mode === 'dark';

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.14)'
            : 'rgba(0,0,0,0.1)',
          borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.05)',
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={toggleTheme}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon'}
        size={18}
        color={isDark ? theme.white : theme.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
});
