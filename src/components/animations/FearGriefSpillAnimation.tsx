import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface FearGriefSpillAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function FearGriefSpillAnimation({
  autoPlay = true,
  onInteraction,
}: FearGriefSpillAnimationProps) {
  const colors = useThemeAnimation();
  
  // Container fill animation - accumulates over lifetime
  const containerFill = useRef(new Animated.Value(0.3)).current;
  
  // Spill animation - spills out into life experiences
  const spillHeight = useRef(new Animated.Value(0)).current;
  const spillOpacity = useRef(new Animated.Value(0)).current;
  
  // Life experience indicators
  const experience1Opacity = useRef(new Animated.Value(0)).current;
  const experience2Opacity = useRef(new Animated.Value(0)).current;
  const experience3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Separate native and non-native animations to avoid conflicts
  const nonNativeSequence = Animated.sequence([
      // Phase 1: Container fills with accumulated energy
      Animated.timing(containerFill, {
        toValue: 0.9,
        duration: ANIMATION_DURATION.SLOW * 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: false,
      }),
      // Phase 2: Energy spills out
      Animated.parallel([
        Animated.timing(spillHeight, {
          toValue: 30,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: false,
        }),
        Animated.timing(spillOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true, // Opacity can use native driver
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.NORMAL),
      // Phase 4: Reset
      Animated.parallel([
        Animated.timing(containerFill, {
          toValue: 0.3,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: false,
        }),
        Animated.timing(spillHeight, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: false,
        }),
        Animated.timing(spillOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
    ]);

  const nativeSequence = Animated.sequence([
      Animated.delay(ANIMATION_DURATION.SLOW * 2 + ANIMATION_DURATION.NORMAL),
      // Phase 3: Life experiences appear
      Animated.stagger(200, [
        Animated.timing(experience1Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(experience2Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(experience3Opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.parallel([
        Animated.timing(experience1Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(experience2Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(experience3Opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
    ]);

  const sequence = Animated.parallel([
    Animated.loop(nonNativeSequence),
    Animated.loop(nativeSequence),
  ]);

    sequence.start();
  }, [autoPlay, containerFill, spillHeight, spillOpacity, experience1Opacity, experience2Opacity, experience3Opacity]);

  const containerHeight = containerFill.interpolate({
    inputRange: [0, 1],
    outputRange: [ANIMATION_HEIGHT * 0.2, ANIMATION_HEIGHT * 0.8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Container representing accumulated fear/grief */}
        <View style={styles.containerBox}>
          <Animated.View
            style={[
              styles.fillArea,
              {
                height: containerHeight,
                backgroundColor: colors.fear,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.fear, `${colors.fear}CC`]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </Animated.View>
          <View style={styles.containerLabel}>
            <Animated.Text style={[styles.label, { opacity: containerFill }]}>
              Accumulated Energy
            </Animated.Text>
          </View>
        </View>

        {/* Spill effect */}
        <Animated.View
          style={[
            styles.spill,
            {
              height: spillHeight,
              opacity: spillOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.fear}80`, `${colors.fear}00`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Life experiences */}
        <View style={styles.experiencesContainer}>
          <Animated.View
            style={[
              styles.experience,
              {
                opacity: experience1Opacity,
                transform: [{ translateY: experience1Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                })}],
              },
            ]}
          >
            <View style={[styles.experienceDot, { backgroundColor: colors.fear }]} />
            <Animated.Text style={[styles.experienceLabel, { opacity: experience1Opacity }]}>
              Life Experience 1
            </Animated.Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.experience,
              {
                opacity: experience2Opacity,
                transform: [{ translateY: experience2Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                })}],
              },
            ]}
          >
            <View style={[styles.experienceDot, { backgroundColor: colors.fear }]} />
            <Animated.Text style={[styles.experienceLabel, { opacity: experience2Opacity }]}>
              Life Experience 2
            </Animated.Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.experience,
              {
                opacity: experience3Opacity,
                transform: [{ translateY: experience3Opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                })}],
              },
            ]}
          >
            <View style={[styles.experienceDot, { backgroundColor: colors.fear }]} />
            <Animated.Text style={[styles.experienceLabel, { opacity: experience3Opacity }]}>
              Life Experience 3
            </Animated.Text>
          </Animated.View>
        </View>
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
  },
  containerBox: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 120,
    height: ANIMATION_HEIGHT - 40,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  fillArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  containerLabel: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spill: {
    position: 'absolute',
    left: 140,
    bottom: 20,
    width: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.6)',
  },
  experiencesContainer: {
    position: 'absolute',
    right: 20,
    top: 40,
    gap: 20,
  },
  experience: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  experienceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  experienceLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

