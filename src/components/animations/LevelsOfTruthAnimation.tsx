import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Polygon,
  Circle,
  Mask,
  Rect
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Premium Prism Palette
const COLORS = {
  // Light Beam
  beamStrong: '#FFFFFF',
  beamGlow: '#E0E7FF',
  beamFade: '#818CF8', // slight blue tint at edges

  // Glassy Prism
  glassSurface: '#1E1B4B',
  glassEdge: '#C7D2FE',
  glassHighlight: '#FFFFFF',
  glassRefraction: '#4F46E5',

  // Premium Spectrum (Neon/Ethereal)
  spectrum: [
    { core: '#F472B6', glow: '#DB2777' }, // Pink
    { core: '#FBBF24', glow: '#D97706' }, // Amber
    { core: '#34D399', glow: '#059669' }, // Emerald
    { core: '#60A5FA', glow: '#2563EB' }, // Blue
    { core: '#A78BFA', glow: '#7C3AED' }, // Violet
  ]
};

export default function LevelsOfTruthAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Master Pulse Cycle (0 -> 1)
  // 0.0-0.3: Incoming Beam Pulse
  // 0.2-0.5: Internal Prism Refraction
  // 0.4-1.0: Spectrum Ray Surge
  const pulseCycle = useRef(new Animated.Value(0)).current;
  const beamFlow = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Master Energy Pulse Loop
    Animated.loop(
      Animated.timing(pulseCycle, {
        toValue: 1,
        duration: 2500, // 2.5s full cycle
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 2. Beam Flow Texture (Continuous)
    Animated.loop(
      Animated.timing(beamFlow, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 3. Diamond Shimmer (Independent)
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.delay(3000),
      ])
    ).start();
  }, []);

  // --- Interpolations for "Forward Propagation" ---

  // 1. Incoming Beam: Surges heavily at start of cycle
  const beamScale = pulseCycle.interpolate({
    inputRange: [0, 0.15, 0.3, 1],
    outputRange: [1, 1, 1, 1], // Removed vertical scale pulse at user request
  });

  const beamOpacity = pulseCycle.interpolate({
    inputRange: [0, 0.15, 0.3, 1],
    outputRange: [0.6, 1, 0.6, 0.6],
  });

  // 2. Internal Beams: Pulse cleanly after incoming beam
  const internalBeamOpacity = pulseCycle.interpolate({
    inputRange: [0, 0.2, 0.35, 0.6, 1],
    outputRange: [0.4, 0.4, 1, 0.4, 0.4],
  });

  const internalBeamWidth = pulseCycle.interpolate({
    inputRange: [0, 0.2, 0.35, 0.6, 1],
    outputRange: [1, 1, 2.5, 1, 1],
  });

  // Prism Glow (Reacts to internal beam)
  const prismGlowOpacity = pulseCycle.interpolate({
    inputRange: [0, 0.3, 0.45, 0.7, 1],
    outputRange: [0, 0, 0.5, 0, 0],
  });

  // 3. Outgoing Spectrum: "Light Packet" travels down the ray
  // effectively animating a "dash" of light moving from start to end
  const rayPulsePos = pulseCycle.interpolate({
    inputRange: [0, 0.4, 0.9, 1],
    outputRange: [0, 0, 1, 1], // Travel from 0% to 100% distance
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 40],
  });

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0.8, 0.8, 0],
  });

  // Volumetric Spectrum Rays + Moving Pulse Overlay
  const spectrumRays = useMemo(() => {
    return COLORS.spectrum.map((color, i) => {
      const angle = (i - 2) * 12; // -24, -12, 0, 12, 24
      const length = 160;
      const rad = (angle * Math.PI) / 180;

      const xStart = CENTER + 8;
      const yStart = CENTER;
      const xEnd = xStart + length * Math.cos(rad);
      const yEnd = yStart + length * Math.sin(rad);

      // Wedge body
      const widthAtEnd = 12 + Math.abs(angle) * 0.2;
      const p1 = `${xStart},${yStart}`;
      const p2 = `${xEnd},${yEnd - widthAtEnd / 2}`;
      const p3 = `${xEnd},${yEnd + widthAtEnd / 2}`;

      return (
        <G key={`spectrum-${i}`}>
          <Defs>
            <LinearGradient id={`rayGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={color.core} stopOpacity="0.7" />
              <Stop offset="100%" stopColor={color.glow} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* 1. Base Ray (Static-ish) */}
          <Path
            d={`M ${p1} L ${p2} L ${p3} Z`}
            fill={`url(#rayGrad-${i})`}
            opacity={0.6}
          />

          {/* 2. Traveling Light Bullet (The Pulse Forward) 
              We use a line that interpolates between start and end */}
          <AnimatedPath
            d={rayPulsePos.interpolate({
              inputRange: [0, 1],
              // Create a short segment that moves
              outputRange: [
                `M ${xStart} ${yStart} L ${xStart} ${yStart}`,
                `M ${xEnd} ${yEnd} L ${xEnd} ${yEnd}`
              ]
            }) as any} // Cast because interpolating path strings works in RN-SVG Animated but TS complains
            stroke={color.core}
            strokeWidth={3}
            strokeOpacity={pulseCycle.interpolate({
              inputRange: [0.4, 0.5, 0.8, 0.9],
              outputRange: [0, 1, 1, 0] // Fade in -> endure -> fade out
            })}
            strokeLinecap="round"
          />

          {/* 3. Traveling Glow Ball (Head of the pulse) */}
          <AnimatedCircle
            cx={rayPulsePos.interpolate({
              inputRange: [0, 1],
              outputRange: [xStart, xEnd]
            })}
            cy={rayPulsePos.interpolate({
              inputRange: [0, 1],
              outputRange: [yStart, yEnd]
            })}
            r={pulseCycle.interpolate({
              inputRange: [0.4, 0.5, 0.9],
              outputRange: [1, 4, 0] // Swell then vanish
            })}
            fill="white"
            opacity={0.9}
          />
        </G>
      );
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
          <LinearGradient id="whiteBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.beamStrong} stopOpacity="0" />
            <Stop offset="30%" stopColor={COLORS.beamGlow} stopOpacity="0.2" />
            <Stop offset="80%" stopColor={COLORS.beamStrong} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.beamStrong} stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="glassBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor="#3730A3" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#312E81" stopOpacity="0.9" />
          </LinearGradient>

          <LinearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="white" stopOpacity="0" />
            <Stop offset="50%" stopColor="white" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="white" stopOpacity="0" />
          </LinearGradient>

          <RadialGradient id="prismCoreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="white" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. Outgoing Spectrum Rays */}
        {spectrumRays}

        {/* 2. Incoming White Beam (Left) */}
        <AnimatedG
          translateX={beamFlow.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0]
          })}
          scaleY={beamScale}
          originY={CENTER}
          opacity={beamOpacity}
        >
          {/* Main Glow */}
          <Path
            d={`M 0 ${CENTER - 8} L ${CENTER - 15} ${CENTER - 2} L ${CENTER - 15} ${CENTER + 2} L 0 ${CENTER + 8} Z`}
            fill="url(#whiteBeamGrad)"
            opacity={0.6}
          />
          {/* Intense Core */}
          <Path
            d={`M 0 ${CENTER} L ${CENTER - 10} ${CENTER}`}
            stroke={COLORS.beamStrong}
            strokeWidth={2.5}
            strokeOpacity={0.9}
          />
        </AnimatedG>

        {/* 3. The Prism Body */}
        <AnimatedG originX={CENTER} originY={CENTER}>

          {/* Internal Glow (Pulse Effect) */}
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={20}
            fill="url(#prismCoreGlow)"
            opacity={prismGlowOpacity}
          />

          {/* Body */}
          <Path
            d={`M ${CENTER - 25} ${CENTER + 35} L ${CENTER + 25} ${CENTER + 35} L ${CENTER} ${CENTER - 35} Z`}
            fill="url(#glassBodyGrad)"
            stroke={COLORS.glassEdge}
            strokeWidth={1}
          />

          {/* Internal Refraction Beams (Animated) */}
          <G>
            {/* Main white entry path */}
            <AnimatedPath
              d={`M ${CENTER - 12} ${CENTER} L ${CENTER + 5} ${CENTER}`}
              stroke="white"
              strokeWidth={internalBeamWidth}
              strokeOpacity={internalBeamOpacity}
            />
            {/* Fanning paths */}
            {COLORS.spectrum.map((color, i) => {
              const yOffset = (i - 2) * 2;
              return (
                <AnimatedPath
                  key={`internal-${i}`}
                  d={`M ${CENTER - 5} ${CENTER} L ${CENTER + 8} ${CENTER + yOffset}`}
                  stroke={color.core}
                  strokeWidth={internalBeamWidth}
                  strokeOpacity={internalBeamOpacity}
                />
              );
            })}
          </G>

          {/* Facets & Highlights */}
          <Path
            d={`M ${CENTER - 12} ${CENTER + 25} L ${CENTER + 12} ${CENTER + 25} L ${CENTER} ${CENTER - 15} Z`}
            fill="none"
            stroke={COLORS.glassRefraction}
            strokeWidth={0.5}
            opacity={0.6}
          />
          <Path
            d={`M ${CENTER} ${CENTER - 35} L ${CENTER - 25} ${CENTER + 35}`}
            stroke="url(#shimmerGrad)"
            strokeWidth={1.5}
            opacity={0.7}
          />

          {/* Shimmer Overlay */}
          <AnimatedG
            translateX={shimmerTranslate}
            opacity={shimmerOpacity}
          >
            <Rect
              x={CENTER - 10}
              y={CENTER - 20}
              width={20}
              height={50}
              fill="url(#shimmerGrad)"
              transform={`rotate(30, ${CENTER}, ${CENTER})`}
            />
          </AnimatedG>
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
