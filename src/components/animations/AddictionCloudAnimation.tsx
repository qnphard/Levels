import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface AddictionCloudAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function AddictionCloudAnimation({
  autoPlay = true,
  onInteraction,
}: AddictionCloudAnimationProps) {
  const colors = useThemeAnimation();
  
  // Sun - always shining
  const sunPulse = useRef(new Animated.Value(0.9)).current;
  
  // Clouds - force-based levels
  const cloud1Opacity = useRef(new Animated.Value(1)).current;
  const cloud2Opacity = useRef(new Animated.Value(1)).current;
  const cloud3Opacity = useRef(new Animated.Value(1)).current;
  
  // Drug effect - temporarily removes clouds
  const drugEffectOpacity = useRef(new Animated.Value(0)).current;
  
  // Withdrawal - clouds return thicker
  const withdrawalCloud1Opacity = useRef(new Animated.Value(0)).current;
  const withdrawalCloud2Opacity = useRef(new Animated.Value(0)).current;
  const withdrawalCloud3Opacity = useRef(new Animated.Value(0)).current;
  const withdrawalCloudScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Sun always pulses with spring
    Animated.loop(
      Animated.sequence([
        createSpringAnimation(sunPulse, 1.05, 'GENTLE'),
        createSpringAnimation(sunPulse, 0.9, 'GENTLE'),
      ])
    ).start();

    // Addiction cycle
    const cycle = Animated.sequence([
      // Phase 1: Clouds present (normal state)
      Animated.delay(ANIMATION_DURATION.SLOW),
      // Phase 2: Drug removes clouds temporarily
      Animated.parallel([
        Animated.timing(drugEffectOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cloud1Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cloud2Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cloud3Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.NORMAL),
      // Phase 3: Withdrawal - clouds return thicker
      Animated.parallel([
        Animated.timing(drugEffectOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloudScale, {
          toValue: 1.3,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud1Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud2Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud3Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      // Phase 4: Reset to normal clouds
      Animated.parallel([
        Animated.timing(cloud1Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(cloud2Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(cloud3Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud1Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud2Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloud3Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(withdrawalCloudScale, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(cycle).start();
  }, [autoPlay, sunPulse, cloud1Opacity, cloud2Opacity, cloud3Opacity, drugEffectOpacity, withdrawalCloud1Opacity, withdrawalCloud2Opacity, withdrawalCloud3Opacity, withdrawalCloudScale]);

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Sky background */}
        <View style={styles.sky} />

        {/* Sun - always shining */}
        <Animated.View
          style={[
            styles.sun,
            {
              transform: [{ scale: sunPulse }],
            },
          ]}
        >
          {/* Sun glow */}
          <View style={styles.sunGlow} />
          <LinearGradient
            colors={[colors.sun, '#FBBF24', colors.sun]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Normal clouds */}
        <Animated.View
          style={[
            styles.cloud,
            styles.cloud1,
            {
              opacity: cloud1Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud2,
            {
              opacity: cloud2Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud3,
            {
              opacity: cloud3Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Drug effect indicator */}
        <Animated.View
          style={[
            styles.drugEffect,
            {
              opacity: drugEffectOpacity,
            },
          ]}
        >
          <Animated.Text style={[styles.drugEffectText, { opacity: drugEffectOpacity }]}>
            Temporary Relief
          </Animated.Text>
        </Animated.View>

        {/* Withdrawal clouds - thicker */}
        <Animated.View
          style={[
            styles.cloud,
            styles.cloud1,
            {
              opacity: withdrawalCloud1Opacity,
              transform: [{ scale: withdrawalCloudScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud2,
            {
              opacity: withdrawalCloud2Opacity,
              transform: [{ scale: withdrawalCloudScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud3,
            {
              opacity: withdrawalCloud3Opacity,
              transform: [{ scale: withdrawalCloudScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.cloudDark, colors.cloud]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
    overflow: 'hidden',
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  sunGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252, 211, 77, 0.3)',
    top: -10,
    left: -10,
  },
  sun: {
    position: 'absolute',
    top: 20,
    left: ANIMATION_WIDTH / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  cloud: {
    position: 'absolute',
    width: 85,
    height: 42,
    borderRadius: 21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cloud1: {
    top: 40,
    left: 20,
  },
  cloud2: {
    top: 60,
    right: 30,
  },
  cloud3: {
    top: 100,
    left: 50,
  },
  drugEffect: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  drugEffectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

