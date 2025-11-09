import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 280;

interface PowerVsForceAnimationProps {
  autoPlay?: boolean;
}

export default function PowerVsForceAnimation({
  autoPlay = true,
}: PowerVsForceAnimationProps) {
  const colors = useThemeAnimation();

  // Force side - pushing against resistance
  const forcePush = useRef(new Animated.Value(0)).current;
  const forceExhaustion = useRef(new Animated.Value(1)).current;
  const forceScaleX = useRef(new Animated.Value(1)).current; // Squash/stretch
  const forceScaleY = useRef(new Animated.Value(1)).current;
  const forceBounce = useRef(new Animated.Value(0)).current;

  // Power side - flowing with
  const powerFlow = useRef(new Animated.Value(0)).current;
  const powerEase = useRef(new Animated.Value(1)).current;
  const powerWave = useRef(new Animated.Value(0)).current; // Wave motion
  const powerGlow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (autoPlay) {
      // Force: pushing against resistance (exhausting) with squash/stretch
      Animated.loop(
        Animated.sequence([
          // Anticipation - slight backward movement
          Animated.parallel([
            Animated.timing(forcePush, {
              toValue: -0.1,
              duration: ANIMATION_DURATION.NORMAL * 0.3,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleX, {
              toValue: 1.1,
              duration: ANIMATION_DURATION.NORMAL * 0.3,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleY, {
              toValue: 0.9,
              duration: ANIMATION_DURATION.NORMAL * 0.3,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
          ]),
          // Push forward with squash on impact
          Animated.parallel([
            Animated.timing(forcePush, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(forceExhaustion, {
              toValue: 0.7,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleX, {
              toValue: 0.85, // Squash on impact
              duration: ANIMATION_DURATION.SLOW * 0.3,
              easing: EASING.EASE_OUT_BACK,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleY, {
              toValue: 1.15,
              duration: ANIMATION_DURATION.SLOW * 0.3,
              easing: EASING.EASE_OUT_BACK,
              useNativeDriver: true,
            }),
            // Bounce back
            Animated.sequence([
              Animated.delay(ANIMATION_DURATION.SLOW * 0.3),
              createSpringAnimation(forceBounce, 1, 'BOUNCY'),
            ]),
          ]),
          // Reset
          Animated.parallel([
            Animated.timing(forcePush, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(forceExhaustion, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleX, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(forceScaleY, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(forceBounce, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(ANIMATION_DURATION.NORMAL),
        ])
      ).start();

      // Power: flowing with (effortless) - smooth wave motion
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(powerFlow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(powerWave, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(powerGlow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(powerFlow, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(powerWave, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(powerGlow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [autoPlay]);

  const forceTranslateX = forcePush.interpolate({
    inputRange: [-0.1, 0, 1],
    outputRange: [-4, 0, 40],
  });

  const powerTranslateX = powerFlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  // Wave motion for power (sinusoidal path)
  const powerWaveY = powerWave.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 8, 0, -8, 0],
  });

  const powerGlowOpacity = powerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const forceBounceOffset = forceBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Force Side */}
        <View style={styles.side}>
          <Text style={[styles.label, { color: colors.force }]}>Force</Text>
          <View style={styles.animationBox}>
            <View style={styles.resistanceBar} />
            <Animated.View
              style={[
                styles.forceBox,
                {
                  backgroundColor: colors.force,
                  opacity: forceExhaustion,
                  transform: [
                    { translateX: forceTranslateX },
                    { translateY: forceBounceOffset },
                    { scaleX: forceScaleX },
                    { scaleY: forceScaleY },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[colors.force, `${colors.force}CC`]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.description}>Pushing • Exhausting • Temporary</Text>
        </View>

        {/* Power Side */}
        <View style={styles.side}>
          <Text style={[styles.label, { color: colors.power }]}>Power</Text>
          <View style={styles.animationBox}>
            <Animated.View
              style={[
                styles.flowGradient,
                {
                  opacity: powerGlowOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.power, colors.powerLight, colors.power]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.powerWave,
                {
                  transform: [
                    { translateX: powerTranslateX },
                    { translateY: powerWaveY },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.description}>Flowing • Effortless • Lasting</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '100%',
  },
  side: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  animationBox: {
    width: 130,
    height: 140,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 12,
  },
  resistanceBar: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 80,
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  forceBox: {
    width: 44,
    height: 44,
    borderRadius: 22, // Pill-shaped
    overflow: 'hidden',
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  flowGradient: {
    width: '100%',
    height: 80,
    borderRadius: 40, // More rounded
    overflow: 'hidden',
    shadowColor: '#60A5FA', // Power blue color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  powerWave: {
    position: 'absolute',
    width: 44,
    height: 80,
    borderRadius: 22,
    overflow: 'hidden',
  },
  description: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
});

