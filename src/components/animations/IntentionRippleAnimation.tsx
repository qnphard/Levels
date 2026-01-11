import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 280;
const CENTER_X = ANIMATION_WIDTH / 2;
const CENTER_Y = ANIMATION_HEIGHT / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

// Premium Palette
const COLORS = {
  core: '#fff',
  rippleStart: 'rgba(139, 92, 246, 0.6)', // Violet/Purple
  rippleEnd: 'rgba(139, 92, 246, 0)',
  impact: '#FCD34D', // Gold
};

export default function IntentionRippleAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // Waves
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const impact = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    const createRipple = (wave: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(wave, {
            toValue: 1,
            duration: 4000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false, // SVG props often need JS thread or Reanimated
          }),
          Animated.timing(wave, { toValue: 0, duration: 0, useNativeDriver: false })
        ])
      );
    };

    Animated.parallel([
      createRipple(wave1, 0),
      createRipple(wave2, 1300),
      createRipple(wave3, 2600),
      // Impact flash
      Animated.loop(
        Animated.sequence([
          Animated.timing(impact, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(impact, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.delay(3000), // Wait for ripples to spread
        ])
      )
    ]).start();

  }, [autoPlay]);

  return (
    <View style={styles.container}>
      <Svg width={ANIMATION_WIDTH} height={ANIMATION_HEIGHT}>
        <Defs>
          <RadialGradient id="rippleGrad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.rippleStart} />
            <Stop offset="100%" stopColor={COLORS.rippleEnd} />
          </RadialGradient>
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={COLORS.core} stopOpacity={1} />
            <Stop offset="100%" stopColor={COLORS.rippleStart} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* --- Ripples --- */}
        {[wave3, wave2, wave1].map((w, i) => (
          <AnimatedCircle
            key={i}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={w.interpolate({ inputRange: [0, 1], outputRange: [10, 140] })}
            fill="none"
            stroke="url(#rippleGrad)"
            strokeWidth={w.interpolate({ inputRange: [0, 1], outputRange: [2, 0] })}
            fillOpacity={w.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.1, 0] })}
            fill="url(#rippleGrad)" // Subtle fill
          />
        ))}

        {/* --- Central Drop / Person --- */}
        <AnimatedCircle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={impact.interpolate({ inputRange: [0, 1], outputRange: [6, 8] })}
          fill={COLORS.core}
          opacity={0.9}
        />
        <AnimatedCircle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={20}
          fill="url(#coreGlow)"
          opacity={impact}
        />

        {/* --- Impact Text Hint (Optional, visualizing the reach) --- */}
        {/* We can show 'High' vibration spreading */}
        <SvgText x={CENTER_X} y={ANIMATION_HEIGHT - 20} fill="#a78bfa" fontSize="12" textAnchor="middle" opacity={0.6}>
          One aligned mind...
        </SvgText>

      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
