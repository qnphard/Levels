import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Circle,
  Rect,
  Text as SvgText
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const ANIMATION_SIZE = 160; // Size per side

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Premium Palette
const COLORS = {
  knowledge: '#8B5CF6', // Purple
  knowledgeLight: '#A78BFA',
  knowledgeDark: '#6D28D9',

  practice: '#10B981', // Emerald
  practiceLight: '#34D399',
  practiceGlow: '#6EE7B7',

  text: '#64748B',
};

export default function KnowledgeVsPracticeAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
  // --- Knowledge Values (Static/Accumulating) ---
  // A stack that grows slowly but does nothing else
  const stackHeight = useRef(new Animated.Value(0)).current;

  // --- Practice Values (Dynamic/Transforming) ---
  // A mechanism that spins and transforms energy
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const energyFlow = useRef(new Animated.Value(0)).current;
  const zeroValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Knowledge Stack Growing (Slowly adds layers)
    Animated.loop(
      Animated.sequence([
        Animated.timing(stackHeight, { toValue: 1, duration: 2000, easing: Easing.out(Easing.back(1.5)), useNativeDriver: false }),
        Animated.delay(2000),
        Animated.timing(stackHeight, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();

    // 2. Practice Mechanism (Constant Motion)
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // 3. Practice Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sideContainer}>
        <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE} viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLORS.knowledgeLight} />
              <Stop offset="1" stopColor={COLORS.knowledgeDark} />
            </LinearGradient>
          </Defs>

          {/* Title */}
          <SvgText x={100} y={180} fill={COLORS.text} fontSize="14" fontWeight="bold" textAnchor="middle">
            Accumulation (Static)
          </SvgText>

          {/* Base Group centered */}
          <G x={100} y={120}>
            {/* Dust/Cobwebs (Static vibe) */}
            <Circle cx={40} cy={40} r={2} fill={COLORS.text} opacity={0.3} />
            <Circle cx={-30} cy={30} r={1} fill={COLORS.text} opacity={0.3} />

            {/* Stack of Books */}
            {[0, 1, 2, 3].map((i) => {
              const yOffset = i * -15; // Stack upwards
              // Animate opacity/scale based on stackHeight to simulate adding
              // Threshold: i/4
              // We need a manual interpolation for staggered appearance
              const appearThreshold = i * 0.25;
              const opacity = stackHeight.interpolate({
                inputRange: [appearThreshold, appearThreshold + 0.1],
                outputRange: [0, 1],
                extrapolate: 'clamp'
              });
              const translateY = stackHeight.interpolate({
                inputRange: [appearThreshold, appearThreshold + 0.2],
                outputRange: [-20, 0],
                extrapolate: 'clamp'
              });

              return (
                <AnimatedG
                  key={i}
                  opacity={i === 0 ? 1 : opacity} // Base always there
                  y={i === 0 ? zeroValue : translateY}
                >
                  {/* Simple Isometric Book Shape */}
                  <Rect x={-30} y={yOffset} width={60} height={12} rx={2} fill="url(#bookGrad)" stroke={COLORS.knowledge} strokeWidth={1} />
                  {/* Spine Detail */}
                  <Path d={`M -25 ${yOffset + 3} L -25 ${yOffset + 9}`} stroke="white" strokeOpacity={0.5} />
                </AnimatedG>
              );
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.sideContainer}>
        <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="practiceGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={COLORS.practiceGlow} stopOpacity={0.6} />
              <Stop offset="1" stopColor={COLORS.practice} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Title */}
          <SvgText x={100} y={180} fill={COLORS.text} fontSize="14" fontWeight="bold" textAnchor="middle">
            Transformation (Dynamic)
          </SvgText>

          <G x={100} y={120}>
            {/* Outer Glow */}
            <AnimatedCircle
              r={50}
              fill="url(#practiceGlow)"
              scale={pulse}
              opacity={0.5}
            />

            {/* Spinning Gear/Chakra */}
            <AnimatedG rotation={spin.interpolate({ inputRange: [0, 1], outputRange: [0, 360] })}>
              <Circle r={35} stroke={COLORS.practice} strokeWidth={2} fill="none" strokeDasharray="10, 5" />
              <Circle r={25} stroke={COLORS.practice} strokeWidth={4} fill="none" opacity={0.7} />

              {/* Satellite Particles */}
              {[0, 90, 180, 270].map(deg => (
                <G key={deg} rotation={deg}>
                  <Circle cx={35} cy={0} r={4} fill={COLORS.practiceLight} />
                </G>
              ))}
            </AnimatedG>

            {/* Inner Core Pulse */}
            <AnimatedCircle
              r={15}
              fill={COLORS.practice}
              scale={pulse}
            />
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
  },
  sideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
