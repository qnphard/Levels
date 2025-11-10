import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useThemeColors } from '../theme/colors';

interface BioluminescentRippleProps {
  /** X coordinate of the touch point (relative to card) */
  x: number;
  /** Y coordinate of the touch point (relative to card) */
  y: number;
  /** Callback when animation completes */
  onComplete: () => void;
  /** Style override */
  style?: ViewStyle;
}

/**
 * Bioluminescent ripple effect that emanates from touch point
 * Creates a glowing, jellyfish-like pulse that expands outward
 * representing awareness expanding from the moment of contact
 */
export default function BioluminescentRipple({
  x,
  y,
  onComplete,
  style,
}: BioluminescentRippleProps) {
  const theme = useThemeColors();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const innerGlow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Multi-phase animation for organic bioluminescent effect
    Animated.parallel([
      // Main ripple expansion
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade out as it expands (like bioluminescence dissipating)
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Inner glow pulse (creates depth)
      Animated.sequence([
        Animated.timing(innerGlow, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(innerGlow, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, [scale, opacity, innerGlow, onComplete]);

  // Bioluminescent color scheme - cyan/teal glow
  const glowColor = theme.mode === 'dark' ? 'rgba(95, 181, 169, 0.4)' : 'rgba(111, 164, 145, 0.3)';
  const coreColor = theme.mode === 'dark' ? 'rgba(139, 233, 253, 0.6)' : 'rgba(169, 202, 187, 0.5)';

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {/* Outer ripple - main expansion wave */}
      <Animated.View
        style={[
          styles.ripple,
          {
            left: x,
            top: y,
            backgroundColor: glowColor,
            opacity: opacity,
            transform: [{ scale }],
          },
        ]}
      />

      {/* Inner glow - intense center flash */}
      <Animated.View
        style={[
          styles.innerGlow,
          {
            left: x,
            top: y,
            backgroundColor: coreColor,
            opacity: innerGlow,
            transform: [
              { scale: Animated.multiply(scale, 0.3) },
            ],
          },
        ]}
      />

      {/* Halo effect - subtle outer ring */}
      <Animated.View
        style={[
          styles.halo,
          {
            left: x,
            top: y,
            borderColor: glowColor,
            opacity: Animated.multiply(opacity, 0.6),
            transform: [{ scale: Animated.multiply(scale, 1.1) }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    marginLeft: -150,
    marginTop: -150,
    shadowColor: '#5FB5A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  innerGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginLeft: -60,
    marginTop: -60,
    shadowColor: '#8BE9FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
  halo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    marginLeft: -150,
    marginTop: -150,
    borderWidth: 2,
    shadowColor: '#5FB5A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
});
