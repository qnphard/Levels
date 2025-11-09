import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface IntentionRippleAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function IntentionRippleAnimation({
  autoPlay = true,
  onInteraction,
}: IntentionRippleAnimationProps) {
  const colors = useThemeAnimation();
  
  // Center intention point
  const centerPulse = useRef(new Animated.Value(0.8)).current;
  
  // Ripple waves
  const ripple1Scale = useRef(new Animated.Value(0)).current;
  const ripple1Opacity = useRef(new Animated.Value(1)).current;
  
  const ripple2Scale = useRef(new Animated.Value(0)).current;
  const ripple2Opacity = useRef(new Animated.Value(1)).current;
  
  const ripple3Scale = useRef(new Animated.Value(0)).current;
  const ripple3Opacity = useRef(new Animated.Value(1)).current;
  
  // Awareness indicators (people unconsciously aware)
  const awareness1Opacity = useRef(new Animated.Value(0)).current;
  const awareness2Opacity = useRef(new Animated.Value(0)).current;
  const awareness3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Center pulse with spring animation
    Animated.loop(
      Animated.sequence([
        createSpringAnimation(centerPulse, 1, 'GENTLE'),
        createSpringAnimation(centerPulse, 0.8, 'GENTLE'),
      ])
    ).start();

    // Ripple sequence
    const createRipple = (
      scale: Animated.Value,
      opacity: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 3,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW * 1.5,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    createRipple(ripple1Scale, ripple1Opacity, 0).start();
    createRipple(ripple2Scale, ripple2Opacity, ANIMATION_DURATION.NORMAL).start();
    createRipple(ripple3Scale, ripple3Opacity, ANIMATION_DURATION.NORMAL * 2).start();

    // Awareness indicators
    const awarenessSequence = Animated.sequence([
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.stagger(200, [
        Animated.timing(awareness1Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(awareness2Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(awareness3Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.parallel([
        Animated.timing(awareness1Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(awareness2Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(awareness3Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(awarenessSequence).start();
  }, [autoPlay, centerPulse, ripple1Scale, ripple1Opacity, ripple2Scale, ripple2Opacity, ripple3Scale, ripple3Opacity, awareness1Opacity, awareness2Opacity, awareness3Opacity]);

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Center intention */}
        <Animated.View
          style={[
            styles.center,
            {
              transform: [{ scale: centerPulse }],
            },
          ]}
        >
          {/* Glow effect */}
          <View style={styles.centerGlow} />
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`, colors.primary]}
            style={styles.centerDot}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Ripple waves */}
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: ripple1Scale }],
              opacity: ripple1Opacity,
            },
          ]}
        >
          <View style={[styles.rippleCircle, { borderColor: colors.primary }]} />
          <View style={[styles.rippleGlow, { borderColor: colors.primary }]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: ripple2Scale }],
              opacity: ripple2Opacity,
            },
          ]}
        >
          <View style={[styles.rippleCircle, { borderColor: colors.primary }]} />
          <View style={[styles.rippleGlow, { borderColor: colors.primary }]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: ripple3Scale }],
              opacity: ripple3Opacity,
            },
          ]}
        >
          <View style={[styles.rippleCircle, { borderColor: colors.primary }]} />
          <View style={[styles.rippleGlow, { borderColor: colors.primary }]} />
        </Animated.View>

        {/* Awareness indicators */}
        <Animated.View
          style={[
            styles.awareness,
            styles.awareness1,
            {
              opacity: awareness1Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`]}
            style={styles.awarenessDot}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.awareness,
            styles.awareness2,
            {
              opacity: awareness2Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`]}
            style={styles.awarenessDot}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.awareness,
            styles.awareness3,
            {
              opacity: awareness3Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`]}
            style={styles.awarenessDot}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  centerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  ripple: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  rippleGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  awareness: {
    position: 'absolute',
    width: 16,
    height: 16,
  },
  awareness1: {
    top: 30,
    left: 50,
  },
  awareness2: {
    top: 80,
    right: 60,
  },
  awareness3: {
    bottom: 40,
    left: 80,
  },
  awarenessDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});

