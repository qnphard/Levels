import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, LinearGradient, Stop, G, Ellipse } from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Premium cosmic palette
const COLORS = {
  // Core light source
  coreWhite: '#FFFEF5',
  coreGold: '#FDE68A',
  coreAmber: '#F59E0B',
  // Outer glow layers
  glowOuter: '#78350F',
  // Nebula clouds (dark cosmic tones)
  nebulaDeep: '#1E1B4B',
  nebulaMid: '#312E81',
  nebulaLight: '#4338CA',
  // Ethereal mist
  mist: '#6366F1',
};

export default function NaturalHappinessAnimation() {
  // Animation Values
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const glowPulseAnim = useRef(new Animated.Value(0.5)).current;
  const driftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Breathing clouds (open/close)
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Subtle glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 0.5,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Very slow drift for organic feel
    Animated.loop(
      Animated.timing(driftAnim, {
        toValue: 360,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolations
  const nebulaOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 0.15],
  });

  const coreScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.3],
  });

  const coreOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  // Memoized organic cloud paths (bezier curves for soft edges)
  const nebulaPaths = useMemo(() => {
    const paths = [];
    const layers = 4;
    for (let layer = 0; layer < layers; layer++) {
      const radius = 45 + layer * 18;
      const segments = 8;
      const opacity = 0.7 - layer * 0.12;

      // Create organic blob path using bezier curves
      let d = '';
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const wobble = 1 + Math.sin(angle * 3 + layer) * 0.2;
        const r = radius * wobble;
        const x = CENTER + r * Math.cos(angle);
        const y = CENTER + r * Math.sin(angle);

        if (i === 0) {
          d = `M ${x} ${y}`;
        } else {
          const prevAngle = ((i - 1) / segments) * Math.PI * 2 - Math.PI / 2;
          const prevWobble = 1 + Math.sin(prevAngle * 3 + layer) * 0.2;
          const prevR = radius * prevWobble;
          const prevX = CENTER + prevR * Math.cos(prevAngle);
          const prevY = CENTER + prevR * Math.sin(prevAngle);

          // Control points for smooth curve
          const cp1x = prevX + (radius * 0.4) * Math.cos(prevAngle + Math.PI / 2);
          const cp1y = prevY + (radius * 0.4) * Math.sin(prevAngle + Math.PI / 2);
          const cp2x = x - (radius * 0.4) * Math.cos(angle + Math.PI / 2);
          const cp2y = y - (radius * 0.4) * Math.sin(angle + Math.PI / 2);

          d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }
      }
      d += ' Z';

      const color = layer < 2 ? COLORS.nebulaDeep : (layer === 2 ? COLORS.nebulaMid : COLORS.nebulaLight);
      paths.push(
        <Path
          key={`nebula-${layer}`}
          d={d}
          fill={color}
          fillOpacity={opacity}
        />
      );
    }
    return paths;
  }, []);

  // Ethereal mist particles
  const mistParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 80 + (i % 3) * 25;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      const size = 3 + (i % 3) * 2;
      particles.push(
        <Circle
          key={`mist-${i}`}
          cx={x}
          cy={y}
          r={size}
          fill={COLORS.mist}
          fillOpacity={0.15 + (i % 3) * 0.08}
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
          {/* Multi-layer radial gradient for the core light source */}
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.coreWhite} stopOpacity="1" />
            <Stop offset="25%" stopColor={COLORS.coreGold} stopOpacity="0.9" />
            <Stop offset="50%" stopColor={COLORS.coreAmber} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={COLORS.glowOuter} stopOpacity="0" />
          </RadialGradient>

          {/* Outer atmosphere glow */}
          <RadialGradient id="atmosphereGlow" cx="50%" cy="50%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor={COLORS.coreGold} stopOpacity="0.3" />
            <Stop offset="60%" stopColor={COLORS.coreAmber} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={COLORS.glowOuter} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Layer 1: Outer atmosphere glow (always visible) */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={120}
          fill="url(#atmosphereGlow)"
          opacity={0.6}
        />

        {/* Layer 2: The Inner Light Source */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={50}
          fill="url(#coreGlow)"
          opacity={coreOpacity}
          scale={coreScale}
        />

        {/* Layer 3: Ethereal mist particles in background */}
        <AnimatedG
          originX={CENTER}
          originY={CENTER}
          rotation={driftAnim}
          opacity={glowPulseAnim}
        >
          {mistParticles}
        </AnimatedG>

        {/* Layer 4: Nebula clouds (organic shapes that breathe) */}
        <AnimatedG
          originX={CENTER}
          originY={CENTER}
          opacity={nebulaOpacity}
        >
          {nebulaPaths}
        </AnimatedG>

        {/* Layer 5: Bright inner halo (visible when clouds part) */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={30}
          fill={COLORS.coreWhite}
          opacity={breatheAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.8],
          })}
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
