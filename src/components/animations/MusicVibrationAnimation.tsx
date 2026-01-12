import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Premium Palette
const COLORS = {
  anger: '#EF4444', // Red
  angerDark: '#7F1D1D',
  classical: '#3B82F6', // Blue
  classicalLight: '#60A5FA',
};

export default function MusicVibrationAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  const time = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;
    Animated.loop(
      Animated.timing(time, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true, // Use native driver for transform/opacity, but we might need state for path d if not using reanimated
      })
    ).start();
  }, [autoPlay]);

  // We can't easily animate 'd' prop with Animated API in native driver without reanimated.
  // BUT we can use a trick: Translating a long waveform pattern.
  // Create a pattern that repeats.

  // 1. Anger Pattern: Jagged, spiky
  // 2. Classical Pattern: Smooth sine wave

  const translateX = time.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100] // Slide left
  });

  return (
    <View style={styles.container}>
      <Svg width={ANIMATION_WIDTH} height={ANIMATION_HEIGHT} viewBox="0 0 300 150">
        <Defs>
          <LinearGradient id="angerGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.anger} stopOpacity={0.8} />
            <Stop offset="1" stopColor={COLORS.angerDark} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="classicalGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.classicalLight} stopOpacity={0.8} />
            <Stop offset="1" stopColor={COLORS.classical} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* --- Anger Section --- */}
        <G y={30}>
          <SvgText x={150} y={-10} fill={COLORS.anger} fontSize="12" fontWeight="bold" textAnchor="middle">
            Low Vibration (Chaos)
          </SvgText>
          {/* Moving Jagged Wave */}
          <G clipPath="url(#clip)">
            <AnimatedPath
              transform={[{ translateX }]}
              d="M 0 20 L 10 0 L 20 40 L 30 10 L 40 50 L 50 10 L 60 40 L 70 0 L 80 20 L 90 50 L 100 0 L 110 30 L 120 10 L 130 50 L 140 0 L 150 40 L 160 10 L 170 50 L 180 0 L 190 30 L 200 10 L 210 50 L 220 0 L 230 40 L 240 10 L 250 50 L 260 0 L 270 30 L 280 10 L 290 50 L 300 0 L 310 40 L 320 10 L 330 50 L 340 0 L 350 30 L 360 10 L 370 50 L 380 0 L 390 40 L 400 20 L 400 60 L 0 60 Z"
              fill="url(#angerGrad)"
              opacity={0.8}
            />
          </G>
        </G>

        {/* --- Classical Section --- */}
        <G y={110}>
          <SvgText x={150} y={-15} fill={COLORS.classical} fontSize="12" fontWeight="bold" textAnchor="middle">
            High Vibration (Harmony)
          </SvgText>
          {/* Moving Smooth Wave (Sine) */}
          <G clipPath="url(#clip)">
            <AnimatedPath
              transform={[{ translateX }]}
              // A smooth sine wave approximation manually drawn or generated
              d="M 0 20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V 60 H 0 Z"
              fill="url(#classicalGrad)"
              opacity={0.8}
            />
            {/* Add a second harmonic layer for beauty */}
            <AnimatedPath
              transform={[{ translateX: translateX.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }]}
              d="M 0 20 Q 25 10 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V 60 H 0 Z"
              fill="none"
              stroke={COLORS.classicalLight}
              strokeWidth={2}
              opacity={0.5}
            />
          </G>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
