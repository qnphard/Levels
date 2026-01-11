import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Rect,
  ClipPath,
  Circle
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER_X = ANIMATION_SIZE / 2;
const CENTER_Y = ANIMATION_SIZE / 2;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Premium Sci-Fi / Bio-Energy Palette
const COLORS = {
  // Healthy Energy (Plasma)
  energyCore: '#6EE7B7', // Bright Mint
  energyGlow: '#34D399', // Emerald
  energyDark: '#047857', // Deep Green

  // Leaking Energy (Waste)
  leakCore: '#F87171',   // Red
  leakGlow: '#EF4444',   // Deep Red

  // Container (Glass Tube)
  glassBorder: '#9CA3AF',
  glassSurface: '#1F2937',
};

export default function EnergyLeakAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Animation Values
  // Main flow dash offset (infinite upward)
  const flowOffset = useRef(new Animated.Value(0)).current;
  // Leak pressure (pulsing 0 -> 1)
  const pressure = useRef(new Animated.Value(0)).current;
  // Particle Spray (bursting)
  const spray = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Main Plasma Flow (Fast upward movement)
    Animated.loop(
      Animated.timing(flowOffset, {
        toValue: 1,
        duration: 1500, // Fast flow
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 2. Pressure Pulse (Cracks opening)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pressure, {
          toValue: 1, // Max pressure, cracks open
          duration: 2000,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(pressure, {
          toValue: 0.2, // Release slightly but never fully close
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      ])
    ).start();

    // 3. Spray Burst (Synced with pressure)
    Animated.loop(
      Animated.sequence([
        Animated.delay(1800), // Wait for pressure build
        Animated.timing(spray, {
          toValue: 1, // Shoot out
          duration: 500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
        Animated.timing(spray, {
          toValue: 0, // Reset
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.delay(700),
      ])
    ).start();
  }, []);

  // --- Interpolations ---

  // Crack width/opacity
  const crackOp = pressure.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1]
  });

  const crackWidth = pressure.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5]
  });

  // Main flow opacity decreases when leaks are active (losing pressure)
  const flowDim = pressure.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.7, 0.5] // Dims as pressure peaks (leaking)
  });

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#374151" stopOpacity="0.4" />
            <Stop offset="20%" stopColor="#9CA3AF" stopOpacity="0.1" /> /* Highlight */
            <Stop offset="50%" stopColor="#374151" stopOpacity="0.05" />
            <Stop offset="80%" stopColor="#9CA3AF" stopOpacity="0.1" /> /* Highlight */
            <Stop offset="100%" stopColor="#374151" stopOpacity="0.4" />
          </LinearGradient>

          <LinearGradient id="plasmaGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.energyDark} stopOpacity="0.8" />
            <Stop offset="50%" stopColor={COLORS.energyGlow} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.energyCore} stopOpacity="1" />
          </LinearGradient>

          <RadialGradient id="leakBurst" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.leakCore} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.leakGlow} stopOpacity="0" />
          </RadialGradient>

          <ClipPath id="tubeClip">
            <Rect x={CENTER_X - 15} y={20} width={30} height={260} rx={15} />
          </ClipPath>
        </Defs>

        {/* 1. Glass Tube Container */}
        <Rect
          x={CENTER_X - 15}
          y={20}
          width={30}
          height={260}
          rx={15}
          fill="url(#glassGrad)"
          stroke={COLORS.glassBorder}
          strokeWidth={1}
        />

        {/* 2. Main Plasma Flow (Clipped inside tube) */}
        <G clipPath="url(#tubeClip)">
          {/* Base Glow */}
          <AnimatedRect
            x={CENTER_X - 12}
            y={20}
            width={24}
            height={260}
            fill="url(#plasmaGrad)"
            opacity={flowDim}
          />

          {/* Moving Bubbles/Striations */}
          {/* We use a dashed line moving upward */}
          <AnimatedPath
            d={`M ${CENTER_X} 20 L ${CENTER_X} 280`}
            stroke="white"
            strokeWidth={10}
            strokeDasharray={[20, 30, 40, 20]} // Irregular pattern
            strokeOpacity={0.3}
            strokeDashoffset={flowOffset.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -110] // Move upward
            })}
          />
        </G>

        {/* 3. The Cracks (Leak Points) */}
        {/* Positioned at y=100 and y=180 */}
        <G>
          {/* Leak 1 (Left) */}
          <AnimatedPath
            d={`M ${CENTER_X - 15} 120 L ${CENTER_X - 25} 125 L ${CENTER_X - 35} 118`}
            stroke={COLORS.leakGlow}
            strokeWidth={crackWidth}
            strokeOpacity={crackOp}
            fill="none"
          />
          {/* Leak 2 (Right) */}
          <AnimatedPath
            d={`M ${CENTER_X + 15} 180 L ${CENTER_X + 28} 175 L ${CENTER_X + 38} 185`}
            stroke={COLORS.leakGlow}
            strokeWidth={crackWidth}
            strokeOpacity={crackOp}
            fill="none"
          />
        </G>

        {/* 4. Particle Sprays (Triggered by Spray value) */}
        {/* Left Spray */}
        <AnimatedG
          opacity={spray.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [1, 0.8, 0] // Fade out as they travel
          })}
        >
          {/* Particles shooting left */}
          {[0, 1, 2].map(i => (
            <AnimatedCircle
              key={`L-${i}`}
              cx={spray.interpolate({
                inputRange: [0, 1],
                outputRange: [CENTER_X - 15, CENTER_X - 60 - i * 10]
              })}
              cy={spray.interpolate({
                inputRange: [0, 1],
                outputRange: [120, 120 + (i - 1) * 20] // Fan out
              })}
              r={3}
              fill={COLORS.leakCore}
            />
          ))}
        </AnimatedG>

        {/* Right Spray */}
        <AnimatedG
          opacity={spray.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [1, 0.8, 0]
          })}
        >
          {/* Particles shooting right */}
          {[0, 1, 2].map(i => (
            <AnimatedCircle
              key={`R-${i}`}
              cx={spray.interpolate({
                inputRange: [0, 1],
                outputRange: [CENTER_X + 15, CENTER_X + 60 + i * 10]
              })}
              cy={spray.interpolate({
                inputRange: [0, 1],
                outputRange: [180, 180 + (i - 1) * 20]
              })}
              r={3}
              fill={COLORS.leakCore}
            />
          ))}
        </AnimatedG>

        {/* Leak Burst Glows (At source) */}
        <AnimatedCircle
          cx={CENTER_X - 15}
          cy={120}
          r={20}
          fill="url(#leakBurst)"
          opacity={spray} // Flash with spray
        />
        <AnimatedCircle
          cx={CENTER_X + 15}
          cy={180}
          r={20}
          fill="url(#leakBurst)"
          opacity={spray}
        />

      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_SIZE,
    height: ANIMATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
