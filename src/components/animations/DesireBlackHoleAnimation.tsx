import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
  Ellipse
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// Premium cosmic palette - deep space tones
const COLORS = {
  // The absolute void
  void: '#000000',
  voidEdge: '#0C0A1D',
  // Event horizon glow layers
  horizonDeep: '#1E1B4B',
  horizonMid: '#3730A3',
  horizonOuter: '#5B21B6',
  // Accretion disk - hot plasma colors
  diskHot: '#F472B6',
  diskWarm: '#A855F7',
  diskCool: '#6366F1',
  // Gravitational lensing effect
  lensing: '#818CF8',
  // Distant star particles
  stars: '#E0E7FF',
};

export default function DesireBlackHoleAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Animation values
  const diskRotation = useRef(new Animated.Value(0)).current;
  const voidPulse = useRef(new Animated.Value(1)).current;
  const lensingWarp = useRef(new Animated.Value(0)).current;
  const particleDrift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Hypnotic disk rotation
    Animated.loop(
      Animated.timing(diskRotation, {
        toValue: 360,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Breathing void pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(voidPulse, {
          toValue: 1.08,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(voidPulse, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Gravitational lensing shimmer
    Animated.loop(
      Animated.sequence([
        Animated.timing(lensingWarp, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(lensingWarp, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Particle drift (slow, toward center)
    Animated.loop(
      Animated.timing(particleDrift, {
        toValue: 360,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Memoized accretion disk - using ellipses for 3D perspective
  const accretionDisk = useMemo(() => {
    const rings = [];
    const ringCount = 8;
    for (let i = 0; i < ringCount; i++) {
      const rx = 55 + i * 12;
      const ry = (55 + i * 12) * 0.3; // Flattened for perspective
      const opacity = 0.7 - i * 0.08;

      // Color gradient from hot (inner) to cool (outer)
      const t = i / (ringCount - 1);
      const color = i < 3 ? COLORS.diskHot : (i < 5 ? COLORS.diskWarm : COLORS.diskCool);

      rings.push(
        <Ellipse
          key={`disk-${i}`}
          cx={CENTER}
          cy={CENTER}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={2 - i * 0.15}
          strokeOpacity={opacity}
          strokeDasharray={i % 2 === 0 ? [8, 4] : [12, 6]}
        />
      );
    }
    return rings;
  }, []);

  // Memoized spiral arms in the disk
  const spiralArms = useMemo(() => {
    const arms = [];
    for (let arm = 0; arm < 3; arm++) {
      const armAngle = (arm / 3) * Math.PI * 2;
      let d = '';

      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const spiralAngle = armAngle + t * Math.PI * 2;
        const radius = 30 + t * 90;
        const x = CENTER + radius * Math.cos(spiralAngle);
        const y = CENTER + radius * 0.3 * Math.sin(spiralAngle); // Flattened

        if (i === 0) {
          d = `M ${x} ${y}`;
        } else {
          d += ` L ${x} ${y}`;
        }
      }

      arms.push(
        <Path
          key={`arm-${arm}`}
          d={d}
          stroke={COLORS.diskWarm}
          strokeWidth={1.5}
          strokeOpacity={0.4}
          fill="none"
        />
      );
    }
    return arms;
  }, []);

  // Memoized falling particles (being consumed)
  const fallingParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 40 + (i % 8) * 12;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * 0.3 * Math.sin(angle);
      const size = 1 + (24 - i) * 0.08;

      particles.push(
        <Circle
          key={`particle-${i}`}
          cx={x}
          cy={y}
          r={size}
          fill={COLORS.stars}
          fillOpacity={0.4 + (24 - i) * 0.02}
        />
      );
    }
    return particles;
  }, []);

  // Gravitational lensing ring (stretched light)
  const lensingOpacity = lensingWarp.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  const horizonScale = voidPulse.interpolate({
    inputRange: [1, 1.08],
    outputRange: [1, 1.1],
  });

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          {/* Event Horizon - Deep void gradient */}
          <RadialGradient id="voidGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.void} stopOpacity="1" />
            <Stop offset="40%" stopColor={COLORS.voidEdge} stopOpacity="0.95" />
            <Stop offset="70%" stopColor={COLORS.horizonDeep} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.horizonMid} stopOpacity="0" />
          </RadialGradient>

          {/* Outer glow atmosphere */}
          <RadialGradient id="atmosphereGrad" cx="50%" cy="50%" rx="55%" ry="55%">
            <Stop offset="0%" stopColor={COLORS.horizonMid} stopOpacity="0.4" />
            <Stop offset="50%" stopColor={COLORS.horizonOuter} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={COLORS.horizonOuter} stopOpacity="0" />
          </RadialGradient>

          {/* Lensing ring glow */}
          <RadialGradient id="lensingGrad" cx="50%" cy="50%" rx="45%" ry="45%">
            <Stop offset="0%" stopColor={COLORS.lensing} stopOpacity="0" />
            <Stop offset="75%" stopColor={COLORS.lensing} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={COLORS.lensing} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Layer 1: Far outer atmosphere */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={140}
          fill="url(#atmosphereGrad)"
        />

        {/* Layer 2: Rotating Accretion Disk */}
        <AnimatedG
          originX={CENTER}
          originY={CENTER}
          rotation={diskRotation}
        >
          {accretionDisk}
          {spiralArms}
        </AnimatedG>

        {/* Layer 3: Drifting particles being consumed */}
        <AnimatedG
          originX={CENTER}
          originY={CENTER}
          rotation={Animated.multiply(particleDrift, -1)}
        >
          {fallingParticles}
        </AnimatedG>

        {/* Layer 4: Gravitational lensing ring */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={45}
          fill="url(#lensingGrad)"
          opacity={lensingOpacity}
        />

        {/* Layer 5: Event Horizon Glow */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={40}
          fill="url(#voidGrad)"
          scale={horizonScale}
        />

        {/* Layer 6: The Void - Absolute Black Center */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={18}
          fill={COLORS.void}
        />

        {/* Layer 7: Photon sphere (thin bright ring at horizon) */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={20}
          fill="none"
          stroke={COLORS.diskHot}
          strokeWidth={0.8}
          strokeOpacity={voidPulse.interpolate({
            inputRange: [1, 1.08],
            outputRange: [0.4, 0.7],
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
