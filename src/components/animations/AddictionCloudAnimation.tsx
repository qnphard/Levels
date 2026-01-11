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
  ClipPath,
  Rect
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Premium Weather/Sky Palette
const COLORS = {
  sunCore: '#FFFBEB',
  sunInner: '#FCD34D',
  sunOuter: '#F59E0B',
  sunRay: '#FEJP68',

  // Fog/Cloud Layers - Dark, heavy industrial smog vs clear sky
  skyClear: '#38BDF8', // When visible
  skyDim: '#1E293B',   // When clouded

  cloudDark: '#374151',
  cloudMid: '#64748B',
  cloudLight: '#94A3B8',
};

export default function AddictionCloudAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // 0 = Full Addiction (Clouds covering sun)
  // 1 = The "Hit" (Clear sky, sun blasting)
  // Then returns to 0 (but maybe dimmer sun)
  const cycle = useRef(new Animated.Value(0)).current;
  const cloudDrift = useRef(new Animated.Value(0)).current;
  const sunPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Continuous drift of clouds (even when thick)
    Animated.loop(
      Animated.timing(cloudDrift, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 2. Sun Pulse (breathing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulse, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(sunPulse, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        })
      ])
    ).start();

    // 3. The Addiction Cycle
    // Start thick -> Sudden Clear (Hit) -> Slow, heavy return
    Animated.loop(
      Animated.sequence([
        Animated.delay(2000), // Suffering state

        // THE HIT (Rapid clearing)
        Animated.timing(cycle, {
          toValue: 1,
          duration: 1500, // Fast relief
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),

        Animated.delay(2000), // High state

        // THE CRASH (Clouds return closer/heavier)
        Animated.timing(cycle, {
          toValue: 0,
          duration: 4000, // Slow, inevitable return
          easing: Easing.inOut(Easing.quad), // Starts slow then accelerates transparency loss
          useNativeDriver: false,
        }),

        Animated.delay(1000), // Recovery before next cycle
      ])
    ).start();
  }, []);

  // --- Interpolations ---

  // Clouds pull AWAY from center during hit
  const cloudSpread = cycle.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5], // Scale up/spread out
  });

  const cloudOpacity = cycle.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.95, 0.2, 0], // Nearly invisible at peak
  });

  const sunIntensity = cycle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.2], // Dims when clouded, brightens when clear
  });

  const skyColorOpacity = cycle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.4], // Blue sky reveal
  });

  // --- Organic Fog Particles ---
  // Instead of ellipses, we use layers of soft radial gradients
  const fogLayers = useMemo(() => {
    // 3 Layers of clouds spinning at different speeds
    return [0, 1, 2].map(layerIndex => {
      const particles = [];
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const offset = 40 + Math.random() * 40;
        const size = 50 + Math.random() * 40;
        particles.push({ angle, offset, size });
      }
      return { particles, speed: 1 + layerIndex * 0.5, dir: layerIndex % 2 === 0 ? 1 : -1 };
    });
  }, []);

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          {/* Volumetric Sun Gradient */}
          <RadialGradient id="sunCoreGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.sunCore} stopOpacity="1" />
            <Stop offset="40%" stopColor={COLORS.sunInner} stopOpacity="0.8" />
            <Stop offset="80%" stopColor={COLORS.sunOuter} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={COLORS.sunOuter} stopOpacity="0" />
          </RadialGradient>

          {/* Cloud/Fog Soft Gradient */}
          <RadialGradient id="fogGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.cloudLight} stopOpacity="0.9" />
            <Stop offset="60%" stopColor={COLORS.cloudMid} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.cloudDark} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="skyGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.skyClear} stopOpacity="1" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. Sky Background (Revealed when clouds part) */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={120}
          fill="url(#skyGrad)"
          opacity={skyColorOpacity}
        />

        {/* 2. The Sun (Always there, but obscured) */}
        <AnimatedG
          scale={sunIntensity}
          originX={CENTER}
          originY={CENTER}
          opacity={sunIntensity} // Double effect: size and alpha
        >
          {/* Core */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={30}
            fill="url(#sunCoreGrad)"
          />
          {/* Pulsing Aura */}
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={sunPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 50] // 45 +/- 5
            })}
            fill="url(#sunCoreGrad)"
            opacity={sunPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6]
            })}
          />
          {/* God Rays (Spinning?) */}
        </AnimatedG>


        {/* 3. Fog/Cloud Layers */}
        {/* We scale the whole cloud group OUTWARD to simulate parting */}
        <AnimatedG
          scale={cloudSpread}
          opacity={cloudOpacity}
          originX={CENTER}
          originY={CENTER}
        >
          {fogLayers.map((layer, lIdx) => (
            <AnimatedG
              key={`layer-${lIdx}`}
              rotation={cloudDrift.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 360 * layer.dir * 0.2] // Slow Rotation
              })}
              originX={CENTER}
              originY={CENTER}
            >
              {layer.particles.map((p, pIdx) => {
                // Convert polar to cartesian
                const rad = (p.angle * Math.PI) / 180;
                const cx = CENTER + Math.cos(rad) * p.offset;
                const cy = CENTER + Math.sin(rad) * p.offset;

                return (
                  <Circle
                    key={`p-${pIdx}`}
                    cx={cx}
                    cy={cy}
                    r={p.size}
                    fill="url(#fogGrad)"
                    opacity={0.6}
                  />
                );
              })}
            </AnimatedG>
          ))}
        </AnimatedG>

        {/* 4. Vignette / Dark Outer Edges (Tunnel Vision of Addiction) */}
        {/* Obscures the edges, forces focus on center, but when clouds are thick it feels suffocating */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={140}
          stroke={COLORS.cloudDark}
          strokeWidth={40}
          opacity={cycle.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0] // Clears up when high
          })}
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
