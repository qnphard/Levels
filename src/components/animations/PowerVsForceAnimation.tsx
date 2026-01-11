import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, G, LinearGradient, Rect, Mask } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const HEIGHT = 300; // Taller for more drama

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const COLORS = {
  forceCore: '#ff2d55',
  forceGlow: 'rgba(255, 45, 85, 0.3)',
  powerCore: '#007aff',
  powerGlow: 'rgba(0, 122, 255, 0.4)',
  particleGold: '#fcd34d',
};

export default function PowerVsForceAnimation() {
  const masterPulse = useRef(new Animated.Value(0)).current;
  const chaosAnim = useRef(new Animated.Value(0)).current;
  const flowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Core heartbeat of the scene
    Animated.loop(
      Animated.sequence([
        Animated.timing(masterPulse, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(masterPulse, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();

    // 2. High-speed chaos for 'Force'
    Animated.loop(
      Animated.timing(chaosAnim, { toValue: 1, duration: 300, easing: Easing.linear, useNativeDriver: false })
    ).start();

    // 3. Constant flow for 'Power'
    Animated.loop(
      Animated.timing(flowAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: false })
    ).start();
  }, []);

  // Force Jitter Calculations
  const forceShake = chaosAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -2, 2, -1, 0],
  });

  const flowDash = flowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  // Render optimized "Force" energy strings
  const renderForceEnergy = () => {
    const lines = [];
    for (let i = 0; i < 8; i++) { // Reduced from 15 to 8
      const y = 80 + (i * 18);
      const startX = -20;
      const endX = 140;
      const wave = Math.sin(i * 0.8) * 6;
      lines.push(
        <AnimatedPath
          key={`force-${i}`}
          d={`M ${startX} ${y + wave} L ${endX} ${y - wave}`}
          stroke={COLORS.forceCore}
          strokeWidth={1}
          strokeOpacity={0.2}
          translateX={forceShake}
          translateY={Animated.multiply(forceShake, i % 2 === 0 ? 0.5 : -0.5)}
        />
      );
    }
    return lines;
  };

  // Render optimized "Power" laminar flow
  const renderPowerFlow = () => {
    const lines = [];
    const obsX = 75;
    const obsY = 150;
    for (let i = 0; i < 10; i++) { // Reduced from 20 to 10
      const yOffset = (i - 5) * 15;
      const curveHeight = Math.abs(yOffset) < 10 ? 10 : yOffset * 1.5;
      const path = `M -20 ${obsY + yOffset} 
                        C 30 ${obsY + yOffset}, 40 ${obsY + curveHeight}, ${obsX} ${obsY + curveHeight}
                        S 120 ${obsY + yOffset}, 180 ${obsY + yOffset}`;
      lines.push(
        <AnimatedPath
          key={`power-${i}`}
          d={path}
          fill="none"
          stroke={COLORS.powerCore}
          strokeWidth={0.5 + (i % 3)}
          strokeOpacity={0.1 + (i % 2) * 0.15}
          strokeDasharray={[20, 40]}
          strokeDashoffset={Animated.add(flowDash, i * 8)}
        />
      );
    }
    return lines;
  };

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_WIDTH} height={HEIGHT} viewBox={`0 0 ${ANIMATION_WIDTH} ${HEIGHT}`}>
        <Defs>
          <RadialGradient id="forceImpact" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.forceCore} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.forceCore} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="powerGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.powerCore} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={COLORS.powerCore} stopOpacity="0" />
          </RadialGradient>

          {/* Subtle Grain/Noise Texture Mask */}
          <RadialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </RadialGradient>
        </Defs>

        {/* Background Vibe */}
        <Rect width="100%" height="100%" fill="rgba(10, 14, 39, 0.4)" rx="20" />

        {/* --- FORCE SECTION (LEFT) --- */}
        <G translate="0, 0">
          {/* The Rigid Obstacle */}
          <Rect x="145" y="60" width="4" height="180" fill="#475569" rx="2" opacity={0.6} />

          {/* Energy Strings */}
          {renderForceEnergy()}

          {/* Impact Bloom */}
          <AnimatedCircle
            cx="147" cy="150" r={40}
            fill="url(#forceImpact)"
            opacity={Animated.multiply(0.4, masterPulse)}
            scale={Animated.add(1, Animated.multiply(0.2, chaosAnim))}
          />

          {/* Impact Sparks (Static position to avoid Math.random in render) */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => (
            <AnimatedCircle
              key={i}
              cx={147 + (i % 2 === 0 ? 5 : -5)}
              cy={150 + (i - 3) * 20}
              r={2}
              fill={COLORS.forceCore}
              opacity={chaosAnim}
            />
          ))}
        </G>

        {/* Central Shadow Gap */}
        <Rect x={ANIMATION_WIDTH / 2 - 20} y="0" width="40" height="100%" fill="url(#vignette)" opacity={0.5} />

        {/* --- POWER SECTION (RIGHT) --- */}
        <G translate={ANIMATION_WIDTH / 2 + 10} y="0">
          {/* The Smooth Obstacle */}
          <Circle cx="75" cy="150" r={20} fill="#1e293b" stroke={COLORS.powerCore} strokeWidth="0.5" strokeOpacity="0.3" />
          <Circle cx="75" cy="150" r={10} fill="url(#powerGlow)" opacity={0.4} />

          {/* Laminar Flow Strings */}
          {renderPowerFlow()}

          {/* Radiant Aura (Power illuminates and flows) */}
          <AnimatedCircle
            cx="75" cy="150" r={100}
            fill="url(#powerGlow)"
            opacity={Animated.multiply(0.15, masterPulse)}
            scale={Animated.add(0.8, Animated.multiply(0.4, masterPulse))}
          />
        </G>

        {/* Global Film Grain / Noise Overlay (Optimized and stabilized) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
          <Circle
            key={`noise-${i}`}
            cx={(i * 37) % ANIMATION_WIDTH}
            cy={(i * 91) % HEIGHT}
            r="0.5"
            fill="white"
            opacity={0.05}
          />
        ))}

      </Svg>

      {/* Label Overlays */}
      <View style={styles.labelContainer}>
        <View style={styles.labelBox}>
          <Animated.Text style={[styles.labelText, { color: COLORS.forceCore, opacity: Animated.add(0.4, Animated.multiply(0.6, chaosAnim)) }]}>FORCE</Animated.Text>
          <Animated.Text style={styles.subText}>Struggle & Resistance</Animated.Text>
        </View>
        <View style={styles.labelBox}>
          <Animated.Text style={[styles.labelText, { color: COLORS.powerCore, opacity: Animated.add(0.6, Animated.multiply(0.4, masterPulse)) }]}>POWER</Animated.Text>
          <Animated.Text style={styles.subText}>Effortless Alignment</Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: HEIGHT,
    backgroundColor: '#050714',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  labelBox: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  }
});
