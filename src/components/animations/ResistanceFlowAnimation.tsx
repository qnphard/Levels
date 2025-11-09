import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface ResistanceFlowAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function ResistanceFlowAnimation({
  autoPlay = true,
  onInteraction,
}: ResistanceFlowAnimationProps) {
  const colors = useThemeAnimation();
  
  // Resistance side - pushing against
  const resistancePushX = useRef(new Animated.Value(0)).current;
  const resistanceExhaustion = useRef(new Animated.Value(0)).current;
  const resistanceScaleX = useRef(new Animated.Value(1)).current; // Squash/stretch
  const resistanceScaleY = useRef(new Animated.Value(1)).current;
  
  // Flow side - flowing with
  const flowMoveX = useRef(new Animated.Value(0)).current;
  const flowEase = useRef(new Animated.Value(1)).current;
  const flowGlow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Resistance animation - pushing against, exhausting with squash/stretch
    const resistanceSequence = Animated.sequence([
      // Anticipation
      Animated.parallel([
        Animated.timing(resistancePushX, {
          toValue: -2,
          duration: ANIMATION_DURATION.NORMAL * 0.3,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceScaleX, {
          toValue: 1.1,
          duration: ANIMATION_DURATION.NORMAL * 0.3,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceScaleY, {
          toValue: 0.9,
          duration: ANIMATION_DURATION.NORMAL * 0.3,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      // Push forward with squash on impact
      Animated.parallel([
        Animated.timing(resistancePushX, {
          toValue: 20,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT_CUBIC,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceExhaustion, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(ANIMATION_DURATION.NORMAL * 0.7),
          Animated.parallel([
            Animated.timing(resistanceScaleX, {
              toValue: 0.85,
              duration: ANIMATION_DURATION.NORMAL * 0.3,
              easing: EASING.EASE_OUT_BACK,
              useNativeDriver: true,
            }),
            Animated.timing(resistanceScaleY, {
              toValue: 1.15,
              duration: ANIMATION_DURATION.NORMAL * 0.3,
              easing: EASING.EASE_OUT_BACK,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
      // Reset
      Animated.parallel([
        Animated.timing(resistancePushX, {
          toValue: 0,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_IN_CUBIC,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceExhaustion, {
          toValue: 0,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_IN,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceScaleX, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(resistanceScaleY, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.NORMAL),
    ]);

    // Flow animation - smooth, effortless movement with glow
    const flowSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(flowMoveX, {
          toValue: 20,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT_CUBIC,
          useNativeDriver: true,
        }),
        Animated.timing(flowGlow, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(flowMoveX, {
          toValue: 0,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT_CUBIC,
          useNativeDriver: true,
        }),
        Animated.timing(flowGlow, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.NORMAL),
    ]);

    Animated.loop(resistanceSequence).start();
    Animated.loop(flowSequence).start();
  }, [autoPlay, resistancePushX, resistanceExhaustion, resistanceScaleX, resistanceScaleY, flowMoveX, flowEase, flowGlow]);

  const resistanceOpacity = resistanceExhaustion.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const flowGlowOpacity = flowGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Resistance side */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={[styles.label, { opacity: resistanceOpacity }]}>
              Resistance (Force)
            </Animated.Text>
          </View>
          <View style={styles.resistanceBar}>
            <Animated.View
              style={[
                styles.resistanceBlock,
                {
                  transform: [
                    { translateX: resistancePushX },
                    { scaleX: resistanceScaleX },
                    { scaleY: resistanceScaleY },
                  ],
                  opacity: resistanceOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.force, `${colors.force}CC`, colors.force]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <View style={styles.wall} />
          </View>
          <Animated.Text style={[styles.description, { opacity: resistanceOpacity }]}>
            Pushing against • Exhausting
          </Animated.Text>
        </View>

        {/* Flow side */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={[styles.label, { opacity: flowEase }]}>
              Flow (Power)
            </Animated.Text>
          </View>
          <View style={styles.flowBar}>
            <Animated.View
              style={[
                styles.flowGlow,
                {
                  opacity: flowGlowOpacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.flowBlock,
                {
                  transform: [{ translateX: flowMoveX }],
                },
              ]}
            >
              <LinearGradient
                colors={[colors.power, `${colors.power}CC`, colors.power]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>
          <Animated.Text style={[styles.description, { opacity: flowEase }]}>
            Flowing with • Effortless
          </Animated.Text>
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
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
  },
  sideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resistanceBar: {
    width: '100%',
    height: 44,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resistanceBlock: {
    position: 'absolute',
    left: 10,
    top: 7,
    width: 32,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  wall: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    shadowColor: '#FFF',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  flowBar: {
    width: '100%',
    height: 44,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  flowGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 22,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
  },
  flowBlock: {
    position: 'absolute',
    left: 10,
    top: 7,
    width: 32,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  description: {
    marginTop: 8,
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});

