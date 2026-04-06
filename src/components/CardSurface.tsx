import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import {
  useThemeColors,
  useGlowEnabled,
  ThemeColors,
  toRgba,
  borderRadius,
} from '../theme/colors';
import { PressableScale } from './motion/PressableScale';

export type CardSurfaceVariant = 'default' | 'elevated' | 'hero';

export type CardSurfaceProps = {
  children: ReactNode;
  variant?: CardSurfaceVariant;
  /** Accent for glow ring (hex), e.g. theme.primary or #4F46E5 */
  glowColor?: string;
  /** Force glow on/off (defaults to global glow setting) */
  glow?: boolean;
  /** Extra inner glow wash (off for dense lists to avoid double-layer look) */
  glowWash?: boolean;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

function buildGlowStyles(
  theme: ThemeColors,
  glowEnabled: boolean,
  glowColor: string | undefined,
  variant: CardSurfaceVariant
): ViewStyle {
  if (!glowEnabled) {
    return {
      elevation: variant === 'hero' ? 8 : 4,
      shadowColor: theme.shadowMedium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.12,
      shadowRadius: variant === 'hero' ? 14 : 10,
    };
  }

  const accent = glowColor ?? theme.glowPrimary;
  const borderCol =
    theme.mode === 'dark' ? toRgba(accent, 0.64) : toRgba(accent, 0.48);

  return {
    borderWidth: 2,
    borderColor: borderCol,
    shadowColor: accent,
    shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    ...(theme.mode !== 'dark' && Platform.OS !== 'web' ? { elevation: 6 } : {}),
    ...(Platform.OS === 'web'
      ? {
          boxShadow: [
            `0 0 30px ${theme.mode === 'dark' ? toRgba(accent, 0.42) : toRgba(accent, 0.32)}`,
            `0 0 60px ${theme.mode === 'dark' ? toRgba(accent, 0.22) : toRgba(accent, 0.16)}`,
            `inset 0 0 20px ${toRgba(accent, 0.1)}`,
          ].join(', '),
        }
      : {}),
  };
}

function surfaceBackground(theme: ThemeColors, variant: CardSurfaceVariant): string {
  if (variant === 'elevated' || variant === 'hero') {
    return theme.surfaceCardElevated;
  }
  return theme.surfaceCard;
}

/**
 * Unified card container: one border + shadow/glow recipe (no stacked competing effects).
 */
export function CardSurface({
  children,
  variant = 'default',
  glowColor,
  glow: glowProp,
  glowWash: glowWashProp = true,
  style,
  pressable,
  onPress,
  onLongPress,
  disabled,
  testID,
}: CardSurfaceProps) {
  const theme = useThemeColors();
  const globalGlow = useGlowEnabled();
  const glowEnabled = glowProp ?? globalGlow;

  const bg = surfaceBackground(theme, variant);
  const glowStyles = buildGlowStyles(theme, glowEnabled, glowColor, variant);

  const base: ViewStyle = {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor:
      theme.mode === 'dark' && glowEnabled
        ? 'rgba(9, 19, 28, 0.75)'
        : bg,
    ...(glowEnabled
      ? glowStyles
      : {
          borderWidth: 1,
          borderColor: theme.borderCard,
          shadowColor: theme.shadowSoft,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.08,
          shadowRadius: 8,
        }),
  };

  const accent = glowColor ?? theme.glowPrimary;
  const showGlowLayer = glowWashProp && glowEnabled && !!accent;

  const content = (
    <>
      {showGlowLayer && (
        <View
          pointerEvents="none"
          style={[
            styles.glowWash,
            {
              backgroundColor:
                theme.mode === 'dark'
                  ? toRgba(accent, 0.12)
                  : toRgba(accent, 0.04),
            },
          ]}
        />
      )}
      {children}
    </>
  );

  if (pressable && onPress) {
    return (
      <PressableScale
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={[base, style]}
      >
        <View style={styles.fill} testID={testID}>
          {content}
        </View>
      </PressableScale>
    );
  }

  return (
    <View style={[base, style]} testID={testID}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  glowWash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.lg + 8,
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    opacity: 0.85,
  },
});
