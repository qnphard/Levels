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
  Mask,
  Rect
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Premium Spiritual Palette
const COLORS = {
  orbCore: '#FFFBEB',    // Almost white gold
  orbInner: '#FCD34D',   // Rich gold
  orbOuter: '#F59E0B',   // Deep amber
  orbHalo: '#7C3AED',    // Spiritual purple halo

  trailHigh: '#8B5CF6',  // Purple (High frequency/spiritual)
  trailMid: '#EC4899',   // Pink (Heart/Integration)
  trailLow: '#EF4444',   // Red (Root/Grounding)

  bgDepth: '#1E1B4B',    // Deep space blue/purple
};

export default function SpiritualProgressSpiralAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Animation values
  const progress = useRef(new Animated.Value(0)).current;
  const loopCycle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous forward progress along the spiral
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 12000, // Slow, meditative journey
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Secondary loop for "breathing" / pulsing effects
    Animated.loop(
      Animated.sequence([
        Animated.timing(loopCycle, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(loopCycle, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        })
      ])
    ).start();
  }, []);

  // --- 3D Spiral Generation ---
  // We simulate a 3D Helix and project it to 2D
  const spiralParams = useMemo(() => {
    const points = [];
    const trailResolution = 150; // High res for smooth curves
    const turns = 3.5;

    // Create points for the entire path
    for (let i = 0; i <= trailResolution; i++) {
      const t = i / trailResolution; // 0 to 1

      // Spiral Math
      // Angle increases with t
      const angle = t * Math.PI * 2 * turns;

      // Radius expands (Conical helix)
      // Starts small (center) -> expands outward
      const baseRadius = 10 + t * 90;

      // Height (Z-axis) oscillates to show "ups and downs" of progress
      // But generally we are looking "down" into the funnel or "up" at it
      // Let's make it a flat spiral but tilted in 3D perspective

      // 3D coordinates
      const x3d = baseRadius * Math.cos(angle);
      const y3d = baseRadius * Math.sin(angle);
      const z3d = -t * 50; // Spirals "down" or "away" slightly

      // Apply 3D Perspective Projection
      // We tilt the spiral to see it as a helix
      const tiltAngle = Math.PI / 6; // 30 degrees tilt

      // Rotate around X axis
      const yRotated = y3d * Math.cos(tiltAngle) - z3d * Math.sin(tiltAngle);
      const zRotated = y3d * Math.sin(tiltAngle) + z3d * Math.cos(tiltAngle);

      // Project to 2D (perspective scale)
      const perspectiveStringency = 300;
      const scale = perspectiveStringency / (perspectiveStringency - zRotated);

      const x2d = CENTER + x3d * scale;
      const y2d = CENTER + yRotated * scale;

      // Store point with "depth" (scale) info for opacity/size
      points.push({ x: x2d, y: y2d, scale, t, angle });
    }
    return points;
  }, []);

  // --- Dynamic Orb Position ---
  // We need to calculate the CURRENT orb position based on 'progress' animated value.
  // Since we can't easily execute complex math in the render based on Animated.Value without Reanimated,
  // We will pre-calculate the text/path strings or use simple interpolation if possible.
  // A cleaner React Native approach with Animated is to interpolate over the full range of steps.

  // We'll create interpolations for X, Y, and Scale (Depth)
  const orbX = progress.interpolate({
    inputRange: spiralParams.map(p => p.t), // [0, ..., 1]
    outputRange: spiralParams.map(p => p.x),
  });

  const orbY = progress.interpolate({
    inputRange: spiralParams.map(p => p.t),
    outputRange: spiralParams.map(p => p.y),
  });

  const orbScale = progress.interpolate({
    inputRange: spiralParams.map(p => p.t),
    outputRange: spiralParams.map(p => p.scale),
  });

  const orbZIndex = progress.interpolate({
    inputRange: spiralParams.map(p => p.t),
    outputRange: spiralParams.map(p => p.scale), // Logic: larger scale = closer = higher z-index visually (drawn last?)
    // In SVG we can't change draw order dynamically easily. 
    // However, for a spiral, if we just draw the trail first, the orb is always on top.
  });


  // --- Trail Visualization ---
  // The trail needs to be a "tail" behind the current progress.
  // Rendering the WHOLE path is static. We want a trail that FOLLOWS.
  // But calculating a dynamic sub-path in Animated is hard.
  // HACK: Render the WHOLE path with a Gradient Stroke, 
  // and use a Mask or DashOffset to reveal it up to the current progress.

  // Calculate total path length for strokeDasharray
  const totalPathLength = useMemo(() => {
    let len = 0;
    for (let i = 1; i < spiralParams.length; i++) {
      const p1 = spiralParams[i - 1];
      const p2 = spiralParams[i];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  }, [spiralParams]);

  // SVG Path String
  const mainPathD = useMemo(() => {
    return `M ${spiralParams[0].x} ${spiralParams[0].y} ` +
      spiralParams.map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [spiralParams]);

  // We actually want the trail to be visible BEHIND the orb, fading out.
  // And maybe part of the path AHEAD is visible faintly.

  // Animated props for Trail
  // dashoffset = length * (1 - progress) -> Reveals from start to end
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [totalPathLength, 0]
  });

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          {/* Glowing Orb Gradient */}
          <RadialGradient id="orbGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.orbCore} stopOpacity="1" />
            <Stop offset="40%" stopColor={COLORS.orbInner} stopOpacity="0.9" />
            <Stop offset="70%" stopColor={COLORS.orbOuter} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.orbHalo} stopOpacity="0" />
          </RadialGradient>

          {/* Trail Gradient - Changes along the path? 
              Hard to do curved gradient in SVG easily in one pass. 
              We'll use a LinearGradient for the whole bounding box as a rough approximation 
              or multiple segments. For "Premium" feel, let's use a Mask to reveal a colored path. */}
          <LinearGradient id="trailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.trailHigh} stopOpacity="0.8" />
            <Stop offset="50%" stopColor={COLORS.trailMid} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={COLORS.trailLow} stopOpacity="0.8" />
          </LinearGradient>

          <Mask id="trailMask">
            {/* The mask reveals the path up to current progress */}
            <AnimatedPath
              d={mainPathD}
              stroke="white"
              strokeWidth={5} // Mask width
              strokeDasharray={totalPathLength}
              strokeDashoffset={strokeDashoffset}
              fill="none"
              strokeLinecap="round"
            />
          </Mask>
        </Defs>

        {/* 1. Faint Background Path (The whole journey map) */}
        <Path
          d={mainPathD}
          stroke={COLORS.bgDepth}
          strokeWidth={1}
          opacity={0.3}
          fill="none"
        />

        {/* 2. The Active Trail (Revealed by Mask) */}
        {/* We draw the path with the nice gradient, masked by progress */}
        <G mask="url(#trailMask)">
          <Path
            d={mainPathD}
            stroke="url(#trailGrad)"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* 3. The Orb (Floating in 3D) */}
        <AnimatedG
          translateX={orbX}
          translateY={orbY}
          scale={orbScale}
          opacity={orbScale.interpolate({
            inputRange: [0.5, 1.5],
            outputRange: [0.6, 1]
          })}
        >
          {/* Glow Aura */}
          <Circle
            cx={0}
            cy={0}
            r={12}
            fill="url(#orbGrad)"
          />
          {/* Core */}
          <Circle
            cx={0}
            cy={0}
            r={4}
            fill="white"
          />
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
