import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface ShadowIlluminationAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function ShadowIlluminationAnimation({
  autoPlay = true,
  onInteraction,
}: ShadowIlluminationAnimationProps) {
  const colors = useThemeAnimation();
  
  // Shadow (dark area)
  const shadowOpacity = useRef(new Animated.Value(1)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  
  // Light (illumination)
  const lightOpacity = useRef(new Animated.Value(0)).current;
  const lightScale = useRef(new Animated.Value(0.5)).current;
  
  // Acknowledgment indicator
  const acknowledgmentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    const sequence = Animated.sequence([
      // Phase 1: Shadow is present
      Animated.delay(ANIMATION_DURATION.NORMAL),
      // Phase 2: Acknowledgment appears
      Animated.timing(acknowledgmentOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION_DURATION.NORMAL),
      // Phase 3: Light illuminates shadow
      Animated.parallel([
        Animated.timing(lightOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(lightScale, {
          toValue: 1.5,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacity, {
          toValue: 0.3,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(shadowScale, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      // Phase 4: Reset
      Animated.parallel([
        Animated.timing(shadowOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(shadowScale, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(lightOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(lightScale, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(acknowledgmentOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(sequence).start();
  }, [autoPlay, shadowOpacity, shadowScale, lightOpacity, lightScale, acknowledgmentOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Shadow (dark area) */}
        <Animated.View
          style={[
            styles.shadow,
            {
              opacity: shadowOpacity,
              transform: [{ scale: shadowScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.shadow, `${colors.shadow}CC`, colors.shadow]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>

        {/* Light (illumination) */}
        <Animated.View
          style={[
            styles.light,
            {
              opacity: lightOpacity,
              transform: [{ scale: lightScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.light}00`, colors.light, `${colors.light}00`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>

        {/* Acknowledgment indicator */}
        <Animated.View
          style={[
            styles.acknowledgment,
            {
              opacity: acknowledgmentOpacity,
            },
          ]}
        >
          <View style={styles.acknowledgmentDot} />
          <Animated.Text style={[styles.acknowledgmentText, { opacity: acknowledgmentOpacity }]}>
            Acknowledged
          </Animated.Text>
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
  shadow: {
    width: 124,
    height: 124,
    borderRadius: 62,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  light: {
    width: 154,
    height: 154,
    borderRadius: 77,
    position: 'absolute',
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  acknowledgment: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acknowledgmentDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  acknowledgmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

