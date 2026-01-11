import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Darker, more ethereal palette
const COLORS = {
  // Deep shadow tones
  voidCore: '#030712',
  shadowDeep: '#111827',
  shadowMid: '#1F2937',
  shadowOuter: '#374151',
  // Golden illumination
  lightCore: '#FEFCE8',
  lightWarm: '#FDE047',
  lightGold: '#EAB308',
  lightAmber: '#CA8A04',
  // Ethereal particles
  sparkle: '#FEF9C3',
};

export default function ShadowIlluminationAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Animation values
  const illuminationPhase = useRef(new Animated.Value(0)).current;
  const lightPulse = useRef(new Animated.Value(0.8)).current;
  const shadowWobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main illumination cycle (shadow -> light -> shadow)
    Animated.loop(
      Animated.sequence([
        // Phase 1: Darkness
        Animated.delay(1500),
        // Phase 2: Illumination
        Animated.timing(illuminationPhase, {
          toValue: 1,
          duration: 4000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Phase 3: Hold
        Animated.delay(2000),
        // Phase 4: Return to shadow
        Animated.timing(illuminationPhase, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Constant light pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(lightPulse, {
          toValue: 1.15,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(lightPulse, {
          toValue: 0.8,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shadow organic movement
    Animated.loop(
      Animated.timing(shadowWobble, {
        toValue: 360,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolations
  const lightScale = illuminationPhase.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 1.4],
  });

  const lightOpacity = illuminationPhase.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.2, 0.6, 1],
  });

  const shadowScale = illuminationPhase.interpolate({
    inputRange: [0, 1],
    outputRange: [1.2, 0.25],
  });

  const shadowOpacity = illuminationPhase.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 0.15],
  });

  // Organic shadow blob paths (multiple layers for depth)
  const shadowLayers = useMemo(() => {
    const layers = [];
    for (let layer = 0; layer < 4; layer++) {
      const baseSize = 75 - layer * 12;
      const segments = 8;
      let d = '';

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const wobble = 1 + Math.sin(angle * 3 + layer * 0.8) * 0.25;
        const r = baseSize * wobble;
        const x = CENTER + r * Math.cos(angle);
        const y = CENTER + r * Math.sin(angle);

        if (i === 0) {
          d = `M ${x} ${y}`;
        } else {
          const prevAngle = ((i - 1) / segments) * Math.PI * 2 - Math.PI / 2;
          const cp1x = CENTER + baseSize * 1.1 * Math.cos(prevAngle + Math.PI / segments);
          const cp1y = CENTER + baseSize * 1.1 * Math.sin(prevAngle + Math.PI / segments);
          d += ` Q ${cp1x} ${cp1y} ${x} ${y}`;
        }
      }
      d += ' Z';

      const color = layer === 0 ? COLORS.shadowOuter :
        layer === 1 ? COLORS.shadowMid :
          layer === 2 ? COLORS.shadowDeep : COLORS.voidCore;
      const opacity = 0.5 + layer * 0.12;

      layers.push(
        <Path
          key={`shadow-layer-${layer}`}
          d={d}
          fill={color}
          fillOpacity={opacity}
        />
      );
    }
    return layers;
  }, []);

  // Multiple light ray layers with varying thickness
  const lightRays = useMemo(() => {
    const rays = [];
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 100 + (i % 3) * 25;
      const width = i % 2 === 0 ? 2.5 : 1.5;
      const opacity = 0.25 + (i % 3) * 0.1;

      const x1 = CENTER;
      const y1 = CENTER;
      const x2 = CENTER + length * Math.cos(angle - Math.PI / 2);
      const y2 = CENTER + length * Math.sin(angle - Math.PI / 2);

      rays.push(
        <Path
          key={`ray-${i}`}
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          stroke={COLORS.lightGold}
          strokeWidth={width}
          strokeOpacity={opacity}
          strokeLinecap="round"
        />
      );
    }
    return rays;
  }, []);

  // Ethereal sparkle particles
  const sparkles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 45 + (i % 4) * 18;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      const size = 1.5 + (i % 3) * 0.8;

      particles.push(
        <Circle
          key={`sparkle-${i}`}
          cx={x}
          cy={y}
          r={size}
          fill={COLORS.sparkle}
          fillOpacity={0.6 + (i % 3) * 0.15}
        />
      );
    }
    return particles;
  }, []);

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          {/* Central light gradient */}
          <RadialGradient id="lightCoreGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.lightCore} stopOpacity="1" />
            <Stop offset="30%" stopColor={COLORS.lightWarm} stopOpacity="0.9" />
            <Stop offset="60%" stopColor={COLORS.lightGold} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={COLORS.lightAmber} stopOpacity="0" />
          </RadialGradient>

          {/* Outer atmosphere */}
          <RadialGradient id="atmosphereGrad" cx="50%" cy="50%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor={COLORS.lightGold} stopOpacity="0.3" />
            <Stop offset="70%" stopColor={COLORS.lightAmber} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={COLORS.lightAmber} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Layer 1: Light rays (behind everything) */}
        <AnimatedG
          opacity={illuminationPhase}
          scale={lightPulse}
          originX={CENTER}
          originY={CENTER}
        >
          {lightRays}
        </AnimatedG>

        {/* Layer 2: Outer atmosphere glow */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={120}
          fill="url(#atmosphereGrad)"
          opacity={illuminationPhase}
        />

        {/* Layer 3: Main light source */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={55}
          fill="url(#lightCoreGrad)"
          opacity={lightOpacity}
          scale={lightScale}
        />

        {/* Layer 4: Bright inner core */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={18}
          fill={COLORS.lightCore}
          opacity={lightOpacity}
          scale={lightScale}
        />

        {/* Layer 5: Shadow blob (organic, breathing) */}
        <AnimatedG
          scale={shadowScale}
          originX={CENTER}
          originY={CENTER}
          opacity={shadowOpacity}
          rotation={shadowWobble}
        >
          {shadowLayers}
        </AnimatedG>

        {/* Layer 6: Sparkle particles (fade in with light) */}
        <AnimatedG
          opacity={illuminationPhase}
          rotation={illuminationPhase.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 25],
          })}
          originX={CENTER}
          originY={CENTER}
        >
          {sparkles}
        </AnimatedG>
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
