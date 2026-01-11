import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 220;

interface ReprogrammingTransitionAnimationProps {
  autoPlay?: boolean;
}

export default function ReprogrammingTransitionAnimation({
  autoPlay = true,
}: ReprogrammingTransitionAnimationProps) {
  const colors = useThemeAnimation();

  // Old programming fading out
  const oldOpacity = useRef(new Animated.Value(1)).current;
  const oldScale = useRef(new Animated.Value(1)).current;

  // New programming fading in
  const newOpacity = useRef(new Animated.Value(0)).current;
  const newScale = useRef(new Animated.Value(0.8)).current;
  const newGlow = useRef(new Animated.Value(0)).current;
  const particles = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      Animated.loop(
        Animated.sequence([
          // Old programming visible
          Animated.parallel([
            Animated.timing(oldOpacity, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(newOpacity, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(ANIMATION_DURATION.NORMAL),
          // Transition: old fades out, new fades in with spring and particles
          Animated.parallel([
            Animated.sequence([
              Animated.timing(oldOpacity, {
                toValue: 0,
                duration: ANIMATION_DURATION.SLOW,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
              Animated.timing(oldScale, {
                toValue: 0.6,
                duration: ANIMATION_DURATION.SLOW,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.delay(ANIMATION_DURATION.NORMAL * 0.3),
              Animated.parallel([
                createSpringAnimation(newOpacity, 1, 'BOUNCY'),
                createSpringAnimation(newScale, 1, 'BOUNCY'),
                Animated.timing(newGlow, {
                  toValue: 1,
                  duration: ANIMATION_DURATION.SLOW,
                  easing: EASING.EASE_OUT,
                  useNativeDriver: true,
                }),
                Animated.timing(particles, {
                  toValue: 1,
                  duration: ANIMATION_DURATION.SLOW,
                  easing: EASING.EASE_OUT,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ]),
          Animated.delay(ANIMATION_DURATION.NORMAL * 2),
          // Reset
          Animated.parallel([
            Animated.timing(oldOpacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(oldScale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(newOpacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(newScale, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(newGlow, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(particles, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [autoPlay]);

  const newGlowOpacity = newGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const particleScale = particles.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const particleOpacity = particles.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.6, 0],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.sky, colors.skyBright]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Old Programming */}
        <Animated.View
          style={[
            styles.programmingBox,
            styles.oldProgramming,
            {
              opacity: oldOpacity,
              transform: [{ scale: oldScale }],
            },
          ]}
        >
          <View style={styles.codeLine} />
          <View style={[styles.codeLine, { width: '70%' }]} />
          <View style={[styles.codeLine, { width: '60%' }]} />
        </Animated.View>

        {/* Particle effects during transition */}
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            {
              transform: [{ scale: particleScale }],
              opacity: particleOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            {
              transform: [{ scale: particleScale }],
              opacity: particleOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            {
              transform: [{ scale: particleScale }],
              opacity: particleOpacity,
            },
          ]}
        />

        {/* New Programming with glow */}
        <Animated.View
          style={[
            styles.programmingBox,
            styles.newProgramming,
            {
              opacity: newOpacity,
              transform: [{ scale: newScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.newGlow,
              {
                opacity: newGlowOpacity,
              },
            ]}
          />
          <View style={styles.codeLineNew} />
          <View style={[styles.codeLineNew, { width: '80%' }]} />
          <View style={[styles.codeLineNew, { width: '75%' }]} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  programmingBox: {
    position: 'absolute',
    width: 210,
    padding: 18,
    borderRadius: 16,
    overflow: 'hidden',
  },
  oldProgramming: {
    backgroundColor: 'rgba(248, 113, 113, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(248, 113, 113, 0.6)',
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  newProgramming: {
    backgroundColor: 'rgba(52, 211, 153, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(52, 211, 153, 0.6)',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  newGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    top: '-10%',
    left: '-10%',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34D399',
  },
  particle1: {
    top: '30%',
    left: '20%',
  },
  particle2: {
    top: '50%',
    right: '25%',
  },
  particle3: {
    bottom: '30%',
    left: '30%',
  },
  codeLine: {
    height: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.8)',
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
  codeLineNew: {
    height: 8,
    backgroundColor: 'rgba(52, 211, 153, 0.8)',
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
});

