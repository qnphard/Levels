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
  Circle,
  ClipPath
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER_X = ANIMATION_SIZE / 2;
const CENTER_Y = ANIMATION_SIZE / 2;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Premium Palette
const COLORS = {
  // Container
  glassBorder: '#9CA3AF',
  glassSurface: '#E5E7EB',

  // The Fluid (Fear/Grief - Dark, Viscous)
  liquidDeep: '#450A0A', // Deep blood/dark red
  liquidSurface: '#7F1D1D', // Lighter red top
  liquidSpill: '#450A0A', // Dark stain

  // Life Icons (neutral -> contaminated)
  lifeNeutral: '#94A3B8',
  lifeContaminated: '#7F1D1D',
};

export default function FearGriefSpillAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // 0 -> 1 Cycle
  const cycle = useRef(new Animated.Value(0)).current;
  const liquidLevel = useRef(new Animated.Value(0)).current;
  const spillAmount = useRef(new Animated.Value(0)).current;
  const wavePhase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Continuous liquid wave motion
    Animated.loop(
      Animated.timing(wavePhase, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 2. Main Cycle: Fill -> Overflow -> Drain/Reset
    Animated.loop(
      Animated.sequence([
        // Fill Up (0% -> 100%)
        Animated.timing(liquidLevel, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        // Spill / Overflow (Hold level, increase spill)
        Animated.parallel([
          Animated.timing(spillAmount, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
          }),
          // Slight liquid level drop as it spills? No, keeps overflowing
        ]),
        Animated.delay(1000),
        // Drain / Reset
        Animated.parallel([
          Animated.timing(liquidLevel, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(spillAmount, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false, // Fades away
          })
        ]),
        Animated.delay(500),
      ])
    ).start();
  }, []);

  // --- Interpolations ---

  // Dynamic Liquid Height
  // Container bottom is at Y=220, Top is Y=100. Height = 120.
  // Level 0 => Y=220, Level 1 => Y=100
  const liquidY = liquidLevel.interpolate({
    inputRange: [0, 1],
    outputRange: [220, 100],
  });

  // Spill Paths
  // It flows down the right side and pools at bottom
  const dropY = spillAmount.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [100, 280, 280] // Falls down to floor
  });

  const poolRadius = spillAmount.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0, 80] // Expands on floor
  });

  const poolOpacity = spillAmount.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.9]
  });

  // Life Icons Contamination
  // They turn red as the pool touches them
  const icon1State = spillAmount.interpolate({
    inputRange: [0.6, 1],
    outputRange: [0, 1] // 0=Neutral, 1=Red
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
            <Stop offset="0%" stopColor="#FFF" stopOpacity="0.1" />
            <Stop offset="50%" stopColor="#FFF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#FFF" stopOpacity="0.2" />
          </LinearGradient>

          <LinearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.liquidSurface} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.liquidDeep} stopOpacity="1" />
          </LinearGradient>

          <RadialGradient id="spillGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.liquidDeep} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.liquidDeep} stopOpacity="0" />
          </RadialGradient>

          <ClipPath id="cupClip">
            <Path d={`M ${CENTER_X - 40} 100 L ${CENTER_X - 35} 220 Q ${CENTER_X} 230 ${CENTER_X + 35} 220 L ${CENTER_X + 40} 100 Z`} />
          </ClipPath>
        </Defs>

        {/* 1. Life Experience Icons (Background) */}
        {/* Placed around the bottom where spill happens */}
        <AnimatedG opacity={0.6}>
          {[-1, 0, 1].map((offset, i) => (
            <G key={`life-${i}`} transform={`translate(${CENTER_X + offset * 60}, 260)`}>
              <Circle r={12} fill={COLORS.lifeNeutral} opacity={0.5} />
              {/* Contamination Overlay */}
              <AnimatedCircle
                r={12}
                fill={COLORS.lifeContaminated}
                opacity={icon1State} // All turn red for simplicity of demo
              />
            </G>
          ))}
        </AnimatedG>

        {/* 2. The Spill Pool (Floor) */}
        <AnimatedCircle
          cx={CENTER_X + 40} // Spills to the right side
          cy={270}
          rx={poolRadius}
          ry={Animated.multiply(poolRadius, 0.3)} // Flattened perspective
          fill="url(#spillGrad)"
          opacity={poolOpacity}
        />

        {/* 3. Falling Stream (The Spill) */}
        <AnimatedPath
          d={`M ${CENTER_X + 40} 100 L ${CENTER_X + 45} 270 L ${CENTER_X + 35} 270 L ${CENTER_X + 40} 100 Z`}
          fill={COLORS.liquidDeep}
          opacity={spillAmount.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 1, 0] // Stream disappears after pooling
          })}
        />

        {/* 4. Glass Container (Back) */}
        <Path
          d={`M ${CENTER_X - 40} 100 L ${CENTER_X - 35} 220 Q ${CENTER_X} 230 ${CENTER_X + 35} 220 L ${CENTER_X + 40} 100`}
          fill="url(#glassGrad)"
          stroke={COLORS.glassBorder}
          strokeWidth={1}
        />

        {/* 5. Liquid inside Cup */}
        <G clipPath="url(#cupClip)">
          <AnimatedRect
            x={CENTER_X - 50}
            y={liquidY}
            width={100}
            height={150} // enough to cover bottom
            fill="url(#liquidGrad)"
          />
          {/* Surface Line (Meniscus) */}
          <AnimatedRect
            x={CENTER_X - 50}
            y={liquidY}
            width={100}
            height={3}
            fill={COLORS.liquidSurface}
            opacity={0.8}
          />
        </G>

        {/* 6. Glass Container (Front Highlights) */}
        <Path
          d={`M ${CENTER_X - 40} 100 L ${CENTER_X - 40} 220`} // Highlight line
          stroke="white"
          strokeWidth={2}
          strokeOpacity={0.2}
          fill="none"
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
