import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useThemeColors, useThemeMode } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface BioluminescentCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'subtle' | 'medium' | 'strong';
}

/**
 * Wrapper component that adds a constant bioluminescent glow effect
 * Creates an ambient, pulsing luminescence perfect for dark themes
 */
export default function BioluminescentCard({
  children,
  style,
  intensity = 'medium',
}: BioluminescentCardProps) {
  const theme = useThemeColors();
  const mode = useThemeMode();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle breathing pulse animation - like bioluminescent organisms
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  // Only apply glow effect in dark mode
  if (mode !== 'dark') {
    return <View style={style}>{children}</View>;
  }

  // Intensity levels for different card types
  const intensityMap = {
    subtle: { opacity: 0.15, glowRadius: 12, innerGlow: 0.08 },
    medium: { opacity: 0.25, glowRadius: 20, innerGlow: 0.12 },
    strong: { opacity: 0.35, glowRadius: 30, innerGlow: 0.18 },
  };

  const config = intensityMap[intensity];

  // Interpolate opacity for breathing effect
  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [config.opacity * 0.7, config.opacity],
  });

  const innerGlowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [config.innerGlow * 0.6, config.innerGlow],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Outer glow - cyan/teal aura */}
      <Animated.View
        style={[
          styles.outerGlow,
          {
            opacity: glowOpacity,
            shadowColor: theme.bioluminescence.glow,
            shadowRadius: config.glowRadius,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />

      {/* Inner glow gradient - adds depth */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: innerGlowOpacity }]}>
        <LinearGradient
          colors={[
            `${theme.bioluminescence.core}15`,
            `${theme.bioluminescence.glow}08`,
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Edge highlight - subtle rim light */}
      <View
        style={[
          styles.edgeHighlight,
          {
            borderColor: `${theme.bioluminescence.core}30`,
          },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  outerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  edgeHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
