import React, { useEffect, useRef, useMemo, useState } from 'react';
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
  Polygon
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Premium Palette
const COLORS = {
  // Power State (Centered)
  powerCore: '#F59E0B', // Gold
  powerGlow: '#FCD34D',
  powerOuter: '#FEF3C7',

  // Reaction State (Triggered)
  reactCore: '#EF4444', // Red
  reactGlow: '#F87171',

  // Triggers (External Events)
  trigger: '#6B7280', // Neural grey spikes
  triggerHot: '#EF4444', // When they hurt you
  triggerAbsorbed: '#F59E0B', // When you alchemize them
};

export default function ReactionVsPowerAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // We cycle between 2 states: 
  // 1. REACTION (Getting hit and shrinking)
  // 2. POWER (Absorbing and growing)

  const mode = useRef(new Animated.Value(0)).current; // 0 = Reaction, 1 = Power

  const orbScale = useRef(new Animated.Value(1)).current;
  const orbShake = useRef(new Animated.Value(0)).current;
  const orbColor = useRef(new Animated.Value(0)).current; // 0 = Red/Weak, 1 = Gold/Strong

  // Triggers (projectiles)
  const trigger1 = useRef(new Animated.Value(0)).current;
  const trigger2 = useRef(new Animated.Value(0)).current;
  const trigger3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Master Cycle
    Animated.loop(
      Animated.sequence([
        // === MODE 1: REACTION (Weakness) ===
        // Reset to neutral
        Animated.parallel([
          Animated.timing(mode, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(orbScale, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(orbColor, { toValue: 0, duration: 500, useNativeDriver: false })
        ]),

        // Trigger 1 hits
        Animated.timing(trigger1, { toValue: 1, duration: 800, easing: Easing.in(Easing.quad), useNativeDriver: false }),

        // Impact! (Shrink + Shake + Red Flash)
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 0.8, duration: 100, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(orbShake, { toValue: 5, duration: 50, useNativeDriver: false }),
            Animated.timing(orbShake, { toValue: -5, duration: 50, useNativeDriver: false }),
            Animated.timing(orbShake, { toValue: 0, duration: 50, useNativeDriver: false }),
          ])
        ]),
        Animated.delay(200),

        // Trigger 2 hits
        Animated.timing(trigger2, { toValue: 1, duration: 800, easing: Easing.in(Easing.quad), useNativeDriver: false }),

        // Impact! (Shrink more)
        Animated.parallel([
          Animated.timing(orbScale, { toValue: 0.6, duration: 100, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(orbShake, { toValue: 5, duration: 50, useNativeDriver: false }),
            Animated.timing(orbShake, { toValue: -5, duration: 50, useNativeDriver: false }),
            Animated.timing(orbShake, { toValue: 0, duration: 50, useNativeDriver: false }),
          ])
        ]),
        Animated.delay(1000),

        // Reset triggers invisibly
        Animated.parallel([
          Animated.timing(trigger1, { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.timing(trigger2, { toValue: 0, duration: 0, useNativeDriver: false }),
        ]),


        // === MODE 2: POWER (Sovereignty) ===
        // Transition to Power State
        Animated.parallel([
          Animated.timing(mode, { toValue: 1, duration: 1000, useNativeDriver: false }),
          Animated.timing(orbScale, { toValue: 1.2, duration: 1000, easing: Easing.elastic(1), useNativeDriver: false }),
          Animated.timing(orbColor, { toValue: 1, duration: 1000, useNativeDriver: false }) // Gold
        ]),

        Animated.delay(500),

        // Trigger 3 hits (but gets absorbed)
        Animated.timing(trigger3, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),

        // Absorption! (Grow instead of shrink)
        Animated.timing(orbScale, { toValue: 1.4, duration: 500, easing: Easing.out(Easing.back(1)), useNativeDriver: false }),
        Animated.delay(200),
        Animated.timing(orbScale, { toValue: 1.2, duration: 1000, useNativeDriver: false }), // Return to stable huge size

        Animated.delay(1500),

        // Reset Trigger 3
        Animated.timing(trigger3, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // --- Helpers ---
  // Interpolating colors manually since Animated doesn't support it fully in all versions without helper? 
  // Actually RN Animated supports color interpolation perfectly.

  const currentCoreColor = orbColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.reactCore, COLORS.powerCore]
  });

  const currentGlowColor = orbColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.reactGlow, COLORS.powerGlow]
  });

  // Trigger positions
  // 1: Top Left
  // 2: Bottom Right
  // 3: Top Right
  const getTriggerPath = (tVal: any, angle: number) => {
    // Start far, end at center (touching orb radius)
    const rad = (angle * Math.PI) / 180;
    const distStart = 160;
    const distEnd = 40;

    const dist = tVal.interpolate({
      inputRange: [0, 1],
      outputRange: [distStart, distEnd]
    });

    const x = Animated.multiply(dist, Math.cos(rad));
    const y = Animated.multiply(dist, Math.sin(rad));

    // Fade out when absorbed (if mode is power)
    // Or flash when hitting (if mode is reaction)
    // We'll handle this in the render opacity.

    return { x, y };
  };

  const t1Pos = getTriggerPath(trigger1, 220);
  const t2Pos = getTriggerPath(trigger2, 40);
  const t3Pos = getTriggerPath(trigger3, 130);

  return (
    <View
      style={styles.container}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
        <Defs>
          <RadialGradient id="powerHalo" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.powerGlow} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.powerCore} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="reactHalo" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.reactGlow} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={COLORS.reactCore} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. The Orb (Center) */}
        {/* Halo changes based on state */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={60}
          fill={orbColor.interpolate({ inputRange: [0, 1], outputRange: ['url(#reactHalo)', 'url(#powerHalo)'] })}
          opacity={0.5}
          scale={orbScale}
        />

        {/* Core */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={30}
          fill={currentCoreColor}
          scale={orbScale}
          translateX={orbShake}
        />

        {/* 2. Triggers (Projectiles) */}
        {/* Function to render trigger */}
        {[
          { val: trigger1, pos: t1Pos, type: 'pain' },
          { val: trigger2, pos: t2Pos, type: 'pain' },
          { val: trigger3, pos: t3Pos, type: 'growth' } // In power mode
        ].map((t, i) => (
          <AnimatedG
            key={`trig-${i}`}
            translateX={Animated.add(CENTER, t.pos.x)}
            translateY={Animated.add(CENTER, t.pos.y)}
            scale={t.val.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] })}
            opacity={t.val.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
            rotation={i === 0 ? 310 : i === 1 ? 130 : 220} // Approximating angles (220+90, 40+90, 130+90)
            originX={0}
            originY={0}
          >
            {/* Spike Shape */}
            <Path d="M 0 0 L -8 -20 L 8 -20 Z" fill={COLORS.trigger} />

            {/* Glow (turns green when absorbed in power mode) */}
            <Circle cy={-10} r={5} fill={COLORS.trigger} opacity={0.6} />
          </AnimatedG>
        ))}

        {/* 3. Status Ring */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={90}
          fill="none"
          stroke={currentGlowColor}
          strokeWidth={1}
          strokeDasharray="4,4"
          opacity={0.3}
          rotation={orbScale.interpolate({ inputRange: [0.6, 1.4], outputRange: [0, 90] })}
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
