import React from 'react';
import { View, Platform, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface SafeBlurViewProps {
  tint: 'light' | 'dark' | 'default';
  intensity: number;
  style?: ViewStyle;
  children?: React.ReactNode;
  backgroundColor?: string; // Custom background color override
}

/**
 * Safe wrapper for BlurView that falls back to a semi-transparent View on Android
 * to avoid "Software rendering doesn't support hardware bitmaps" errors on real devices.
 */
export default function SafeBlurView({
  tint,
  intensity,
  style,
  children,
  backgroundColor,
}: SafeBlurViewProps) {
  // On Android, especially real devices, BlurView can cause crashes
  // due to "Software rendering doesn't support hardware bitmaps".
  // We provide a fallback View with a similar semi-transparent background.
  if (Platform.OS === 'android') {
    const defaultBackgroundColor =
      tint === 'dark'
        ? `rgba(0,0,0,${intensity / 100 * 0.7})`
        : `rgba(255,255,255,${intensity / 100 * 0.7})`;
    const finalBackgroundColor = backgroundColor || defaultBackgroundColor;
    return (
      <View style={[style, { backgroundColor: finalBackgroundColor }]}>
        {children}
      </View>
    );
  }

  // On iOS, use the real BlurView
  return (
    <BlurView tint={tint} intensity={intensity} style={style}>
      {children}
    </BlurView>
  );
}


