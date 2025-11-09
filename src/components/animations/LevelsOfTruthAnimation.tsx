import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 220;

interface LevelsOfTruthAnimationProps {
  autoPlay?: boolean;
}

export default function LevelsOfTruthAnimation({
  autoPlay = true,
}: LevelsOfTruthAnimationProps) {
  const colors = useThemeAnimation();

  // Multiple truth levels pulsing at different rates with spring
  const level1Pulse = useRef(new Animated.Value(0)).current;
  const level2Pulse = useRef(new Animated.Value(0)).current;
  const level3Pulse = useRef(new Animated.Value(0)).current;
  const level4Pulse = useRef(new Animated.Value(0)).current;
  const level1Glow = useRef(new Animated.Value(0.5)).current;
  const level2Glow = useRef(new Animated.Value(0.5)).current;
  const level3Glow = useRef(new Animated.Value(0.5)).current;
  const level4Glow = useRef(new Animated.Value(0.5)).current;
  const level1Rotate = useRef(new Animated.Value(0)).current;
  const level2Rotate = useRef(new Animated.Value(0)).current;
  const level3Rotate = useRef(new Animated.Value(0)).current;
  const level4Rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      // Different levels pulse at different rates with spring animation
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            createSpringAnimation(level1Pulse, 1, 'GENTLE'),
            createSpringAnimation(level1Pulse, 0, 'GENTLE'),
          ]),
          Animated.timing(level1Glow, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW * 1.2,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(level1Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 4,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
        ])
      ).start();

      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL),
            createSpringAnimation(level2Pulse, 1, 'GENTLE'),
            createSpringAnimation(level2Pulse, 0, 'GENTLE'),
          ]),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL),
            Animated.timing(level2Glow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(level2Glow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(level2Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
        ])
      ).start();

      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 1.5),
            createSpringAnimation(level3Pulse, 1, 'GENTLE'),
            createSpringAnimation(level3Pulse, 0, 'GENTLE'),
          ]),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 1.5),
            Animated.timing(level3Glow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 1.8,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(level3Glow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW * 1.8,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(level3Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 6,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
        ])
      ).start();

      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 2),
            createSpringAnimation(level4Pulse, 1, 'GENTLE'),
            createSpringAnimation(level4Pulse, 0, 'GENTLE'),
          ]),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 2),
            Animated.timing(level4Glow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 2,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(level4Glow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW * 2,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(level4Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 7,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
        ])
      ).start();
    }
  }, [autoPlay]);

  const level1Scale = level1Pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });

  const level2Scale = level2Pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  const level3Scale = level3Pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const level4Scale = level4Pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1.25],
  });

  const level1GlowOpacity = level1Glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const level2GlowOpacity = level2Glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const level3GlowOpacity = level3Glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const level4GlowOpacity = level4Glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const level1RotateDeg = level1Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const level2RotateDeg = level2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const level3RotateDeg = level3Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const level4RotateDeg = level4Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.sky, colors.skyBright]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Multiple truth levels - each independent with glow and rotation */}
        <Animated.View
          style={[
            styles.truthLevel,
            styles.level1,
            {
              transform: [{ scale: level1Scale }, { rotate: level1RotateDeg }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.truthGlow,
              {
                opacity: level1GlowOpacity,
              },
            ]}
          />
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.8)']}
            style={styles.truthCircle}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.truthLevel,
            styles.level2,
            {
              transform: [{ scale: level2Scale }, { rotate: level2RotateDeg }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.truthGlow,
              {
                opacity: level2GlowOpacity,
              },
            ]}
          />
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.8)']}
            style={styles.truthCircle}
          />
        </Animated.View>

        {/* Connecting lines */}
        <View style={styles.connectingLine1} />
        <View style={styles.connectingLine2} />
        <View style={styles.connectingLine3} />

        <Animated.View
          style={[
            styles.truthLevel,
            styles.level3,
            {
              transform: [{ scale: level3Scale }, { rotate: level3RotateDeg }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.truthGlow,
              {
                opacity: level3GlowOpacity,
              },
            ]}
          />
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.8)']}
            style={styles.truthCircle}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.truthLevel,
            styles.level4,
            {
              transform: [{ scale: level4Scale }, { rotate: level4RotateDeg }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.truthGlow,
              {
                opacity: level4GlowOpacity,
              },
            ]}
          />
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.4)', 'rgba(139, 92, 246, 0.8)']}
            style={styles.truthCircle}
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  truthLevel: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  level1: {
    top: 30,
    left: 40,
  },
  level2: {
    top: 50,
    right: 50,
  },
  level3: {
    bottom: 50,
    left: 50,
  },
  level4: {
    bottom: 30,
    right: 40,
  },
  truthGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  truthCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  connectingLine1: {
    position: 'absolute',
    top: 50,
    left: 90,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    transform: [{ rotate: '15deg' }],
  },
  connectingLine2: {
    position: 'absolute',
    bottom: 70,
    left: 90,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    transform: [{ rotate: '-15deg' }],
  },
  connectingLine3: {
    position: 'absolute',
    bottom: 50,
    right: 90,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    transform: [{ rotate: '15deg' }],
  },
});

