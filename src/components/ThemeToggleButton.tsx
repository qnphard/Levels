import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  useThemeMode,
  useThemeToggle,
  useGlowEnabled,
  useGlowToggle,
  spacing,
  borderRadius,
} from '../theme/colors';

export default function ThemeToggleButton() {
  const theme = useThemeColors();
  const mode = useThemeMode();
  const toggleTheme = useThemeToggle();
  const glowEnabled = useGlowEnabled();
  const toggleGlow = useGlowToggle();

  const isDark = mode === 'dark';

  return (
    <View style={styles.row}>
      {/* Glow toggle */}
      <Pressable
        style={[
          styles.button,
          styles.buttonLarge,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.14)'
              : 'rgba(0,0,0,0.08)',
            borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.05)',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle card glow"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
        onPress={toggleGlow}
      >
        <Ionicons
          name={glowEnabled ? 'sparkles' : 'sparkles-outline'}
          size={22}
          color={isDark ? theme.white : theme.textPrimary}
        />
      </Pressable>

      {/* Theme toggle */}
      <Pressable
        style={[
          styles.button,
          styles.buttonLarge,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.14)'
              : 'rgba(0,0,0,0.1)',
            borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.05)',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle theme"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
        onPress={toggleTheme}
      >
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon'}
          size={22}
          color={isDark ? theme.white : theme.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    zIndex: 10,
  },
  button: {
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonLarge: {
    minWidth: 48,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
