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
  Line
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const HALF_WIDTH = ANIMATION_SIZE / 2;
const CENTER_Y = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Premium Contrasting Palette
const COLORS = {
  // FORCE (Aggressive, rigid)
  forceCore: '#DC2626', // Red
  forceLight: '#FCA5A5',
  forceDark: '#991B1B',
  forceGlow: '#EF4444',

  // FLOW (Fluid, adaptive)
  flowCore: '#3B82F6', // Blue
  flowLight: '#93C5FD',
  flowDark: '#1E40AF',
  flowGlow: '#60A5FA',

  // Environment
  obstacle: '#4B5563',
  divider: '#334155',
};

export default function ResistanceFlowAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Force Animation Values
  const forcePos = useRef(new Animated.Value(0)).current;
  const forceSquash = useRef(new Animated.Value(1)).current;
  const impactShake = useRef(new Animated.Value(0)).current;

  // Flow Animation Values
  const flowProgress = useRef(new Animated.Value(0)).current;
  const flowDrift = useRef(new Animated.Value(0)).current; // Y-axis drift like water

  useEffect(() => {
    // === LEFT: FORCE (Cyclic slamming) ===
    Animated.loop(
      Animated.sequence([
        // Charge forward
        Animated.timing(forcePos, {
          toValue: 1, // Hit wall
          duration: 600,
          easing: Easing.poly(2), // Accelerate hard
          useNativeDriver: false,
        }),
        // IMPACT!
        Animated.parallel([
          // Squash
          Animated.timing(forceSquash, { toValue: 0.5, duration: 80, useNativeDriver: false }),
          // Shake
          Animated.sequence([
            Animated.timing(impactShake, { toValue: 10, duration: 40, useNativeDriver: false }),
            Animated.timing(impactShake, { toValue: -8, duration: 40, useNativeDriver: false }),
            Animated.timing(impactShake, { toValue: 5, duration: 40, useNativeDriver: false }),
            Animated.timing(impactShake, { toValue: 0, duration: 40, useNativeDriver: false }),
          ])
        ]),
        // Recoil / Bounce back
        Animated.parallel([
          Animated.timing(forceSquash, { toValue: 1, duration: 300, easing: Easing.elastic(1.5), useNativeDriver: false }),
          Animated.timing(forcePos, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        ]),
        Animated.delay(500), // Pause to recover
      ])
    ).start();

    // === RIGHT: FLOW (Continuous smooth loop) ===
    Animated.loop(
      Animated.timing(flowProgress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();

    // Water drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(flowDrift, { toValue: 5, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(flowDrift, { toValue: -5, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // --- Force Logic ---
  const forceX = forcePos.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 110], // Wall is at 135. Block is 40 wide. 110 + 40 = 150? No.
    // Left side: 0 to 150. Wall at 120. 
    // Start X: 20. End X: 75?
    // Let's refine based on SVG coordinates.
    // LEFT PANEL WIDTH: 150
    // Wall X: 110. Width 15.
    // Block X start: 20. Width 40.
    // Collision X: 110 - 40 = 70.
  });

  // Particles fly on impact
  // They explode when forcePos is near 1
  const debrisOpacity = forcePos.interpolate({
    inputRange: [0.9, 1],
    outputRange: [0, 1],
  });

  const debrisSpread = forcePos.interpolate({
    inputRange: [0.9, 1],
    outputRange: [0, 25], // Fly outward
  });

  // --- Flow Logic ---
  // Bezier Path coordinates for Right Side
  // Offset everything by 150 (HALF_WIDTH)
  // Start: 150+75 (center) bottom (300) to top (0)
  // Wall at: 150+75-10 = 215? No obstacle relative positions.

  // Right Obstacle X: 150 + 75 - 7.5 = 217.5
  const flowPathString = `M 225 280 C 225 220 280 200 280 150 C 280 100 225 80 225 20`;

  // We need to animate along it. RN SVG cannot animate along path easily without workarounds.
  // Workaround: Interpolate X/Y manually for a simpler S-curve.
  // t: 0->1 (Bottom to Top)
  const flowY = flowProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [280, 20]
  });

  const flowX = flowProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [225, 225, 270, 180, 225] // S-Curve around imaginary obstacles
  });

  // Rotation aligns with movement somewhat?
  const flowRot = flowProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 45, 0]
  });

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          <LinearGradient id="forceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.forceCore} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.forceDark} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id="impactFlare" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor={COLORS.forceGlow} stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.flowLight} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.flowCore} stopOpacity="0.8" />
          </LinearGradient>

          <RadialGradient id="flowGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.flowGlow} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.flowCore} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Divider */}
        <Line
          x1={HALF_WIDTH} y1={20} x2={HALF_WIDTH} y2={280}
          stroke={COLORS.divider}
          strokeDasharray="5,5"
          strokeWidth={2}
        />

        {/* === LEFT: FORCE === */}
        {/* Wall */}
        <Rect x={110} y={CENTER_Y - 50} width={10} height={100} fill={COLORS.obstacle} rx={2} />

        {/* Block */}
        <AnimatedG
          translateX={forcePos.interpolate({ inputRange: [0, 1], outputRange: [20, 70] })}
          translateY={impactShake} // Vertical shake
          scaleX={forceSquash} // Horizontal squash
          originX={70 + 20}
          originY={CENTER_Y}
        >
          <Rect
            x={0} y={CENTER_Y - 20}
            width={40} height={40}
            fill="url(#forceGrad)"
            stroke={COLORS.forceLight}
            strokeWidth={2}
            rx={4}
          />
          {/* Speed trails */}
          <Path d="M -10 135 L -30 135" stroke={COLORS.forceCore} strokeWidth={2} opacity={0.6} />
          <Path d="M -10 165 L -30 165" stroke={COLORS.forceCore} strokeWidth={2} opacity={0.6} />
        </AnimatedG>

        {/* Impact Debris */}
        <AnimatedG
          translateX={110}
          translateY={CENTER_Y}
          opacity={debrisOpacity}
        >
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i - 2) * 30; // Fan out
            const rad = (angle * Math.PI) / 180;
            return (
              <AnimatedCircle
                key={`d-${i}`}
                cx={debrisSpread.interpolate({ inputRange: [0, 25], outputRange: [0, Math.cos(rad) * -30] })}
                cy={debrisSpread.interpolate({ inputRange: [0, 25], outputRange: [0, Math.sin(rad) * 30] })}
                r={3}
                fill={COLORS.forceLight}
              />
            );
          })}
          {/* Flare */}
          <AnimatedCircle cx={0} cy={0} r={25} fill="url(#impactFlare)" opacity={forceSquash.interpolate({ inputRange: [0.5, 1], outputRange: [1, 0] })} />
        </AnimatedG>


        {/* === RIGHT: FLOW === */}
        {/* Obstacles (Rounder, smaller) */}
        <Circle cx={225} cy={100} r={15} fill={COLORS.obstacle} />
        <Circle cx={225} cy={200} r={15} fill={COLORS.obstacle} />

        {/* The Flow Drop */}
        <AnimatedG
          translateX={flowX}
          translateY={flowY}
          rotation={flowRot}
          originX={0}
          originY={0}
        >
          {/* Glow */}
          <Circle r={20} fill="url(#flowGlow)" />

          {/* Teardrop Shape */}
          <Path
            d="M 0 -15 C 8 -15 15 -8 15 5 C 15 15 8 20 0 20 C -8 20 -15 15 -15 5 C -15 -8 -8 -15 0 -15 Z"
            fill="url(#flowGrad)"
          />
          {/* Highlight */}
          <Circle cx={-5} cy={-5} r={3} fill="white" opacity={0.4} />

          {/* Wake Trail used separately or attached? Attached: */}
          <Path d="M 0 20 L 0 30" stroke={COLORS.flowLight} strokeWidth={2} opacity={0.5} />
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
