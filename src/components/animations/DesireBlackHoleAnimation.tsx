import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation, SPRING_PRESETS } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 250;

interface DesireBlackHoleAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function DesireBlackHoleAnimation({
  autoPlay = true,
  onInteraction,
}: DesireBlackHoleAnimationProps) {
  const colors = useThemeAnimation();
  
  // Black hole rotation and pulse
  const rotation = useRef(new Animated.Value(0)).current;
  const blackHolePulse = useRef(new Animated.Value(1)).current;
  
  // Satisfaction particles being consumed (with spiral paths)
  const particle1Opacity = useRef(new Animated.Value(1)).current;
  const particle1Scale = useRef(new Animated.Value(1)).current;
  const particle1Rotation = useRef(new Animated.Value(0)).current;
  const particle1Angle = useRef(new Animated.Value(0)).current;
  const particle1Radius = useRef(new Animated.Value(80)).current;
  
  const particle2Opacity = useRef(new Animated.Value(1)).current;
  const particle2Scale = useRef(new Animated.Value(1)).current;
  const particle2Rotation = useRef(new Animated.Value(0)).current;
  const particle2Angle = useRef(new Animated.Value(0)).current;
  const particle2Radius = useRef(new Animated.Value(90)).current;
  
  const particle3Opacity = useRef(new Animated.Value(1)).current;
  const particle3Scale = useRef(new Animated.Value(1)).current;
  const particle3Rotation = useRef(new Animated.Value(0)).current;
  const particle3Angle = useRef(new Animated.Value(0)).current;
  const particle3Radius = useRef(new Animated.Value(85)).current;
  
  // Accretion disk
  const diskRotation = useRef(new Animated.Value(0)).current;
  const diskOpacity = useRef(new Animated.Value(0.8)).current;
  const diskGlow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Black hole pulse (organic breathing effect)
    Animated.loop(
      Animated.sequence([
        createSpringAnimation(blackHolePulse, 1.1, 'GENTLE'),
        createSpringAnimation(blackHolePulse, 1, 'GENTLE'),
      ])
    ).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: ANIMATION_DURATION.VERY_SLOW * 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      })
    ).start();

    // Accretion disk rotation and glow pulse
    Animated.loop(
      Animated.timing(diskRotation, {
        toValue: 1,
        duration: ANIMATION_DURATION.VERY_SLOW,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(diskGlow, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW * 1.5,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(diskGlow, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.SLOW * 1.5,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle consumption with spiral paths
    const consumeParticleSpiral = (
      opacity: Animated.Value,
      scale: Animated.Value,
      rotation: Animated.Value,
      angle: Animated.Value,
      radius: Animated.Value,
      delay: number
    ) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // Spiral inward (angle increases, radius decreases)
          Animated.timing(angle, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW * 2,
            easing: EASING.EASE_IN_CUBIC,
            useNativeDriver: true,
          }),
          Animated.timing(radius, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW * 2,
            easing: EASING.EASE_IN_CUBIC,
            useNativeDriver: true,
          }),
          // Rotate particle as it spirals
          Animated.timing(rotation, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW * 2,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
          // Scale down and fade out
          createSpringAnimation(scale, 0, 'BOUNCY'),
          Animated.timing(opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW * 1.5,
            easing: EASING.EASE_IN_CUBIC,
            useNativeDriver: true,
          }),
        ]),
        // Reset
        Animated.parallel([
          Animated.timing(angle, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(radius, {
            toValue: 80 + Math.random() * 20,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    const sequence = Animated.parallel([
      Animated.loop(
        consumeParticleSpiral(particle1Opacity, particle1Scale, particle1Rotation, particle1Angle, particle1Radius, 0)
      ),
      Animated.loop(
        consumeParticleSpiral(particle2Opacity, particle2Scale, particle2Rotation, particle2Angle, particle2Radius, ANIMATION_DURATION.SLOW)
      ),
      Animated.loop(
        consumeParticleSpiral(particle3Opacity, particle3Scale, particle3Rotation, particle3Angle, particle3Radius, ANIMATION_DURATION.SLOW * 2)
      ),
    ]);

    sequence.start();
  }, [autoPlay]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const diskRotateInterpolate = diskRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const diskGlowOpacity = diskGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  // Spiral path calculations for particles
  // Use interpolate to create curved paths that approximate spirals
  // Combine angle progress with radius to create inward spiral motion
  const particle1TranslateX = Animated.multiply(
    particle1Radius,
    particle1Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [1, 0.5, -0.5, -1, -0.5],
    })
  );
  const particle1TranslateY = Animated.multiply(
    particle1Radius,
    particle1Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, 0.5, 1, 0.5, 0],
    })
  );

  const particle2TranslateX = Animated.multiply(
    particle2Radius,
    particle2Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [-0.5, -1, -0.5, 0.5, 1],
    })
  );
  const particle2TranslateY = Animated.multiply(
    particle2Radius,
    particle2Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [1, 0.5, 0, -0.5, -1],
    })
  );

  const particle3TranslateX = Animated.multiply(
    particle3Radius,
    particle3Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0.5, 1, 0.5, -0.5, -1],
    })
  );
  const particle3TranslateY = Animated.multiply(
    particle3Radius,
    particle3Angle.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [-1, -0.5, 0, 0.5, 1],
    })
  );

  const particle1Rotate = particle1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const particle2Rotate = particle2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const particle3Rotate = particle3Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const blackHoleScale = blackHolePulse.interpolate({
    inputRange: [0.9, 1.1],
    outputRange: [0.95, 1.05],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Black hole center with glow */}
        <View style={styles.blackHoleContainer}>
          {/* Outer glow */}
          <Animated.View
            style={[
              styles.blackHoleGlow,
              {
                transform: [{ scale: blackHoleScale }],
                opacity: diskGlowOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={[`${colors.primary}20`, `${colors.primary}00`]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles.blackHole,
              {
                transform: [{ rotate: rotateInterpolate }, { scale: blackHoleScale }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.blackHole, colors.blackHoleAccretion, colors.blackHole]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </Animated.View>
          
          {/* Accretion disk with enhanced glow */}
          <Animated.View
            style={[
              styles.accretionDisk,
              {
                transform: [{ rotate: diskRotateInterpolate }],
                opacity: diskGlowOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={[`${colors.primary}60`, `${colors.primary}AA`, `${colors.primary}60`, `${colors.primary}40`]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
        </View>

        {/* Satisfaction particles being consumed with spiral paths */}
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            {
              opacity: particle1Opacity,
              transform: [
                { translateX: particle1TranslateX },
                { translateY: particle1TranslateY },
                { rotate: particle1Rotate },
                { scale: particle1Scale },
              ],
            },
          ]}
        >
          {/* Particle trail effect */}
          <Animated.View
            style={[
              styles.particleTrail,
              {
                opacity: particle1Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [{ scale: particle1Scale }],
              },
            ]}
          />
          <LinearGradient
            colors={[colors.primary, `${colors.primary}80`]}
            style={styles.particleCore}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            {
              opacity: particle2Opacity,
              transform: [
                { translateX: particle2TranslateX },
                { translateY: particle2TranslateY },
                { rotate: particle2Rotate },
                { scale: particle2Scale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.particleTrail,
              {
                opacity: particle2Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [{ scale: particle2Scale }],
              },
            ]}
          />
          <LinearGradient
            colors={[colors.primary, `${colors.primary}80`]}
            style={styles.particleCore}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            {
              opacity: particle3Opacity,
              transform: [
                { translateX: particle3TranslateX },
                { translateY: particle3TranslateY },
                { rotate: particle3Rotate },
                { scale: particle3Scale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.particleTrail,
              {
                opacity: particle3Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [{ scale: particle3Scale }],
              },
            ]}
          />
          <LinearGradient
            colors={[colors.primary, `${colors.primary}80`]}
            style={styles.particleCore}
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
  blackHoleContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  blackHoleGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
  },
  blackHole: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  accretionDisk: {
    width: 120,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  particle: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  particle1: {
    // Positioned via translateX/Y
  },
  particle2: {
    // Positioned via translateX/Y
  },
  particle3: {
    // Positioned via translateX/Y
  },
  particleTrail: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  particleCore: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});

