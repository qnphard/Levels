import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 240;

interface NaturalHappinessAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function NaturalHappinessAnimation({
  autoPlay = true,
  onInteraction,
}: NaturalHappinessAnimationProps) {
  const colors = useThemeAnimation();
  
  // Sun animation - always shining, gentle pulse with spring
  const sunPulse = useRef(new Animated.Value(0.95)).current;
  const sunGlow = useRef(new Animated.Value(0.5)).current;
  const sunRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sun pulse with spring animation
    Animated.loop(
      Animated.sequence([
        createSpringAnimation(sunPulse, 1.05, 'GENTLE'),
        createSpringAnimation(sunPulse, 0.95, 'GENTLE'),
      ])
    ).start();

    // Sun glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunGlow, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW * 2,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(sunGlow, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.SLOW * 2,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sun rotation
    Animated.loop(
      Animated.timing(sunRotation, {
        toValue: 1,
        duration: ANIMATION_DURATION.VERY_SLOW * 3,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      })
    ).start();
  }, [sunPulse]);

  // Cloud animations - multiple clouds that can fade with rotation
  const cloud1Opacity = useRef(new Animated.Value(1)).current;
  const cloud2Opacity = useRef(new Animated.Value(1)).current;
  const cloud3Opacity = useRef(new Animated.Value(1)).current;
  const cloud1TranslateX = useRef(new Animated.Value(0)).current;
  const cloud2TranslateX = useRef(new Animated.Value(0)).current;
  const cloud3TranslateX = useRef(new Animated.Value(0)).current;
  const cloud1Rotate = useRef(new Animated.Value(0)).current;
  const cloud2Rotate = useRef(new Animated.Value(0)).current;
  const cloud3Rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      // Animate clouds drifting with rotation
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(cloud1TranslateX, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 3,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(cloud1TranslateX, {
              toValue: 0,
              duration: ANIMATION_DURATION.VERY_SLOW * 3,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(cloud1Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 4,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.SLOW),
            Animated.timing(cloud2TranslateX, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 2.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(cloud2TranslateX, {
              toValue: 0,
              duration: ANIMATION_DURATION.VERY_SLOW * 2.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(cloud2Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 3.5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.SLOW * 2),
            Animated.timing(cloud3TranslateX, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 3.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(cloud3TranslateX, {
              toValue: 0,
              duration: ANIMATION_DURATION.VERY_SLOW * 3.5,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.timing(cloud3Rotate, {
              toValue: 1,
              duration: ANIMATION_DURATION.VERY_SLOW * 5,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            })
          ),
        ])
      ).start();
    }
  }, [autoPlay]);

  const handlePress = () => {
    if (onInteraction) {
      onInteraction();
    }
    
    // Fade out clouds when interacted with (representing letting go)
    Animated.parallel([
      Animated.timing(cloud1Opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.SLOW,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(cloud2Opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.SLOW,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(cloud3Opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.SLOW,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset after a delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cloud1Opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(cloud2Opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(cloud3Opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2000);
    });
  };

  const sunScale = sunPulse.interpolate({
    inputRange: [0.9, 1.05],
    outputRange: [0.95, 1.08],
  });

  const sunGlowOpacity = sunGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const sunRotateDeg = sunRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cloud1RotateDeg = cloud1Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const cloud2RotateDeg = cloud2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const cloud3RotateDeg = cloud3Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-4deg', '4deg'],
  });

  const cloud1X = cloud1TranslateX.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const cloud2X = cloud2TranslateX.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 25],
  });

  const cloud3X = cloud3TranslateX.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 15],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.skyBright, colors.sky]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Sun - always shining with glow */}
        <Animated.View
          style={[
            styles.sunGlow,
            {
              opacity: sunGlowOpacity,
              transform: [{ scale: sunScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.sun}60`, `${colors.sun}00`]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sun,
            {
              transform: [{ scale: sunScale }, { rotate: sunRotateDeg }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.sun, '#FBBF24', colors.sun]}
            style={styles.sunGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Clouds - emotional blocks with organic shapes and rotation */}
        <Animated.View
          style={[
            styles.cloud,
            styles.cloud1,
            {
              opacity: cloud1Opacity,
              transform: [{ translateX: cloud1X }, { rotate: cloud1RotateDeg }],
            },
          ]}
        >
          <View style={[styles.cloudPart, styles.cloudPart1]} />
          <View style={[styles.cloudPart, styles.cloudPart2]} />
          <View style={[styles.cloudPart, styles.cloudPart3]} />
          <View style={[styles.cloudPart, styles.cloudPart4]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud2,
            {
              opacity: cloud2Opacity,
              transform: [{ translateX: cloud2X }, { rotate: cloud2RotateDeg }],
            },
          ]}
        >
          <View style={[styles.cloudPart, styles.cloudPart1]} />
          <View style={[styles.cloudPart, styles.cloudPart2]} />
          <View style={[styles.cloudPart, styles.cloudPart3]} />
          <View style={[styles.cloudPart, styles.cloudPart5]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud3,
            {
              opacity: cloud3Opacity,
              transform: [{ translateX: cloud3X }, { rotate: cloud3RotateDeg }],
            },
          ]}
        >
          <View style={[styles.cloudPart, styles.cloudPart1]} />
          <View style={[styles.cloudPart, styles.cloudPart2]} />
          <View style={[styles.cloudPart, styles.cloudPart3]} />
          <View style={[styles.cloudPart, styles.cloudPart6]} />
        </Animated.View>

        {/* Touchable overlay */}
        <Animated.View
          style={StyleSheet.absoluteFill}
          onTouchEnd={handlePress}
        />
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
  sunGlow: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sun: {
    position: 'absolute',
    top: 30,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  sunGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cloud: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cloud1: {
    top: 50,
    left: 30,
  },
  cloud2: {
    top: 80,
    left: 80,
  },
  cloud3: {
    top: 120,
    left: 20,
  },
  cloudPart: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  cloudPart1: {
    width: 30,
    height: 30,
    marginRight: -10,
  },
  cloudPart2: {
    width: 40,
    height: 40,
    marginRight: -10,
  },
  cloudPart3: {
    width: 30,
    height: 30,
  },
  cloudPart4: {
    width: 20,
    height: 20,
    marginLeft: -8,
    marginTop: 5,
  },
  cloudPart5: {
    width: 18,
    height: 18,
    marginLeft: 5,
    marginTop: -5,
  },
  cloudPart6: {
    width: 22,
    height: 22,
    marginLeft: -5,
    marginTop: 8,
  },
});

