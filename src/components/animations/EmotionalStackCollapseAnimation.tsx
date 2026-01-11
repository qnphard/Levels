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
  Circle
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER_X = ANIMATION_SIZE / 2;
const CENTER_Y = ANIMATION_SIZE / 2;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Isometric Cube Constants
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 40; // Visual height of the front face
const ISO_ANGLE = Math.PI / 6; // 30 degrees

// Premium Palette
const COLORS = {
  // Use a spectrum: Dense/Red (Bottom) -> Light/Yellow (Top)
  layers: [
    { main: '#EF4444', side: '#B91C1C', top: '#FCA5A5' }, // Red (Fear)
    { main: '#F59E0B', side: '#D97706', top: '#FCD34D' }, // Orange (Desire)
    { main: '#10B981', side: '#059669', top: '#6EE7B7' }, // Green (Courage)
    { main: '#3B82F6', side: '#2563EB', top: '#93C5FD' }, // Blue (Peace)
  ],
  particle: '#FFFFFF',
};

export default function EmotionalStackCollapseAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Animation Values
  // We simulate 3 drops. 
  // 0 -> 1 phase1 (Bottom dissolves, others fall)
  // 1 -> 2 phase2 (Next dissolves, others fall)
  // 2 -> 3 phase3 (Next dissolves)
  // 3 -> 4 Reset
  const progress = useRef(new Animated.Value(0)).current;

  // Particle explosion burst (0 -> 1)
  const particles = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Determine sequential timing
    const cycleDuration = 3000;

    // Main loop
    Animated.loop(
      Animated.sequence([
        // Step 1: Layer 0 Dissolves
        Animated.parallel([
          Animated.timing(progress, { toValue: 1, duration: 1500, easing: Easing.bounce, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(particles, { toValue: 1, duration: 500, useNativeDriver: false }), // Burst
            Animated.timing(particles, { toValue: 0, duration: 0, useNativeDriver: false })
          ])
        ]),
        Animated.delay(500),

        // Step 2: Layer 1 Dissolves
        Animated.parallel([
          Animated.timing(progress, { toValue: 2, duration: 1500, easing: Easing.bounce, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(particles, { toValue: 1, duration: 500, useNativeDriver: false }),
            Animated.timing(particles, { toValue: 0, duration: 0, useNativeDriver: false })
          ])
        ]),
        Animated.delay(500),

        // Step 3: Layer 2 Dissolves
        Animated.parallel([
          Animated.timing(progress, { toValue: 3, duration: 1500, easing: Easing.bounce, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(particles, { toValue: 1, duration: 500, useNativeDriver: false }),
            Animated.timing(particles, { toValue: 0, duration: 0, useNativeDriver: false })
          ])
        ]),
        Animated.delay(1000),

        // Reset
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.delay(500),
      ])
    ).start();

  }, []);

  // --- Helpers for Isometric Drawing ---
  const drawCube = (x: number, y: number, colorSet: any, opacity: any, scale: any) => {
    // Isometric projection
    const w = BLOCK_WIDTH;
    const h = BLOCK_HEIGHT;
    const d = 40; // Depth (top face height)

    // Points
    // Center Bottom = x, y
    // Front Face
    const p1 = `${x},${y}`; // Bottom Center
    const p2 = `${x - w / 2},${y - h / 4}`; // Bottom Left
    const p3 = `${x - w / 2},${y - h / 4 - h}`; // Top Left
    const p4 = `${x},${y - h}`; // Top Center
    const p5 = `${x + w / 2},${y - h / 4 - h}`; // Top Right
    const p6 = `${x + w / 2},${y - h / 4}`; // Bottom Right

    // Top Face
    const p7 = `${x},${y - h - d}`; // Back Top Center

    return (
      <AnimatedG
        opacity={opacity}
        key={colorSet.main}
        scale={scale}
        originX={x}
        originY={y - h / 2}
      >
        {/* Top Face */}
        <Path
          d={`M ${p4} L ${p5} L ${p7} L ${p3} Z`}
          fill={colorSet.top}
        />
        {/* Right Face */}
        <Path
          d={`M ${p6} L ${p5} L ${p4} L ${p1} Z`}
          fill={colorSet.side}
        />
        {/* Left Face */}
        <Path
          d={`M ${p1} L ${p4} L ${p3} L ${p2} Z`}
          fill={colorSet.main}
        />
      </AnimatedG>
    );
  };

  // --- Particles Generation ---
  const particleArray = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({
      angle: i * 45,
      dist: 20 + Math.random() * 40,
      size: 2 + Math.random() * 3
    }));
  }, []);

  // --- Block Positions Logic ---
  // Initial Stack Positions (Bottom Up):
  // Layer 0: Y=240
  // Layer 1: Y=190
  // Layer 2: Y=140
  // Layer 3: Y=90

  // When Progress = 1:
  // Layer 0: Gone
  // Layer 1: Falls to 240
  // Layer 2: Falls to 190
  // Layer 3: Falls to 140

  const getInterpolatedY = (layerIndex: number) => {
    // Target Y for each position in stack
    const POS_0 = 240;
    const POS_1 = 190;
    const POS_2 = 140;
    const POS_3 = 90;
    const OFF_SCREEN = 300;

    return progress.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [
        // Map based on layer index and current step
        // If layerIndex < progress, it's gone (or just dissolved).
        // If layerIndex > progress, it falls down.

        // At 0: 0->Pos0, 1->Pos1, 2->Pos2, 3->Pos3
        layerIndex === 0 ? POS_0 : layerIndex === 1 ? POS_1 : layerIndex === 2 ? POS_2 : POS_3,

        // At 1: 0->Gone, 1->Pos0, 2->Pos1, 3->Pos2
        layerIndex === 0 ? POS_0 : layerIndex === 1 ? POS_0 : layerIndex === 2 ? POS_1 : POS_2,

        // At 2: 0->Gone, 1->Gone, 2->Pos0, 3->Pos1
        layerIndex <= 1 ? POS_0 : layerIndex === 2 ? POS_0 : POS_1,

        // At 3: 0->Gone, ... 3->Pos0
        POS_0
      ]
    });
  };

  const getOpacity = (layerIndex: number) => {
    return progress.interpolate({
      inputRange: [layerIndex, layerIndex + 0.2], // Dissolve quickly
      outputRange: [1, 0],
      // But wait, if we are looping, reset? using extrapolate clamp usually.
      // Since we reset progress to 0 at end, it fades back in instantly (or needs fade in).
      // Actually 0 duration reset handles it.
    });
  };

  // Particles X/Y (Follow the dissolving block)
  // Which block is dissolving? 
  // 0->1: Block 0 (Pos0)
  // 1->2: Block 1 (which fell to Pos0)
  // So particles always explode at POS_0!
  const PARTICLE_ORIGIN_Y = 200; // Roughly center of bottom block

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          {/* Shadows/Glows */}
          <RadialGradient id="particleGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="white" stopOpacity="1" />
            <Stop offset="100%" stopColor="white" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. The Stack (Rendered Top to Bottom of array? No, Bottom to Top visually for z-index) */}
        {/* Actually in isometric, top blocks overlay bottom blocks? No, top is higher Y (lower value).
            Painter's algorithm: Draw Back/Top stuff first? 
            Back blocks are blocked by Front blocks. 
            Here it's a vertical stack. Top blocks partially cover Top Face of bottom blocks?
            Yes. So draw Bottom layer first. */}

        {COLORS.layers.map((colorSet, i) => {
          // Wait, opacity needs to handle "Gone".
          // If Opacity is 0, we don't see it.
          // But we can check opacity logic.
          // If progress > i, opacity is 0. 
          // We'll use getOpacity(i).

          // Wait, logic: At progress 1, layer 0 fades out.
          // At progress 2, layer 1 (now at bottom) fades out.

          // To ensure they disappear:
          // Layer 0 fades at 0->0.2
          // Layer 1 fades at 1->1.2
          // Layer 2 fades at 2->2.2
          // Layer 3 fades at 3->3.2

          const yVal = getInterpolatedY(i); // This is an Animated Node

          // We need to pass the Animated Value to the helper function. 
          // Helper function returns JSX. We can put Animated.View style transform inside?
          // No, using SVG AnimatedG transform.

          // Since drawCube returns an AnimatedG, we can manipulate props there.
          // But y is hardcoded in path strings.
          // SVG Path strings cannot be animated easily without d-interpolation (heavy).
          // BETTER: Draw cube at 0,0 and translate it using AnimatedG.

          return (
            <AnimatedG
              key={`layer-${i}`}
              translateY={yVal}
              translateX={CENTER_X}
              opacity={progress.interpolate({
                inputRange: [i, i + 0.2],
                outputRange: [1, 0],
                extrapolate: 'clamp'
              })}
            >
              {/* Draw cube relative to 0,0 */}
              {/* Let 0,0 be the bottom center of the cube? */}
              {/* Adjust paths so 0,0 matches anchor */}
              <Path
                d={`M 0 0 L -40 -10 L -40 -50 L 0 -40 L 40 -50 L 40 -10 Z`} // Left/Right Faces outer bound?
                fill="none" // Just placeholder
              />
              {/* Top Face */}
              <Path d={`M 0 -40 L 40 -50 L 0 -90 L -40 -50 Z`} fill={colorSet.top} />
              {/* Right Face */}
              <Path d={`M 40 -10 L 40 -50 L 0 -40 L 0 0 Z`} fill={colorSet.side} />
              {/* Left Face */}
              <Path d={`M 0 0 L 0 -40 L -40 -50 L -40 -10 Z`} fill={colorSet.main} />
            </AnimatedG>
          );
        })}

        {/* 2. Particles (Explosion at bottom) */}
        {/* They explode whenever 'particles' value goes 0->1 */}
        {/* Always centered at bottom block position */}
        <AnimatedG
          translateX={CENTER_X}
          translateY={PARTICLE_ORIGIN_Y}
          opacity={particles}
        >
          {particleArray.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            return (
              <AnimatedCircle
                key={`p-${i}`}
                cx={particles.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.cos(rad) * 60]
                })}
                cy={particles.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.sin(rad) * 60]
                })}
                r={particles.interpolate({
                  inputRange: [0, 1],
                  outputRange: [p.size, 0] // Shrink as they fly
                })}
                fill="white"
              />
            );
          })}
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
