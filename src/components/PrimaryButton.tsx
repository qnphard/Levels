import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  useThemeColors,
  spacing,
  borderRadius,
  typography,
  ThemeColors,
} from '../theme/colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
}

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
  backgroundColor,
  textColor,
}: PrimaryButtonProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme, backgroundColor, textColor);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
      android_ripple={{ color: backgroundColor || theme.buttons.primary.focus, borderless: false }}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const getStyles = (theme: ThemeColors, backgroundColor?: string, textColor?: string) =>
  StyleSheet.create({
    button: {
      backgroundColor: backgroundColor || theme.buttons.primary.background,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
      shadowColor: backgroundColor || theme.buttons.primary.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: backgroundColor ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.08)',
    },
    buttonPressed: {
      transform: [{ translateY: 1 }],
      opacity: 0.95,
    },
    buttonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0,
    },
    label: {
      color: textColor || theme.buttons.primary.text,
      fontSize: typography.body,
      fontWeight: typography.semibold,
      letterSpacing: 0.5,
    },
  });
