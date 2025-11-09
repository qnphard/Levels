import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface ReactionVsPowerAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function ReactionVsPowerAnimation({
  autoPlay = true,
  onInteraction,
}: ReactionVsPowerAnimationProps) {
  const colors = useThemeAnimation();
  
  // Reaction side - being the effect
  const reactionBounce = useRef(new Animated.Value(0)).current;
  const reactionPowerLoss = useRef(new Animated.Value(1)).current;
  
  // Power side - being the source
  const powerStable = useRef(new Animated.Value(1)).current;
  const powerRadiate = useRef(new Animated.Value(0)).current;
  
  // External trigger
  const triggerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Trigger appears
    const triggerSequence = Animated.sequence([
      Animated.timing(triggerOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.FAST,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION_DURATION.NORMAL),
      Animated.timing(triggerOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.FAST,
        easing: EASING.EASE_IN,
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION_DURATION.SLOW),
    ]);

    // Reaction - bounces, loses power
    const reactionSequence = Animated.sequence([
      Animated.delay(ANIMATION_DURATION.FAST),
      Animated.parallel([
        Animated.sequence([
          createSpringAnimation(reactionBounce, 1, 'BOUNCY'),
          createSpringAnimation(reactionBounce, 0, 'BOUNCY'),
        ]),
        Animated.timing(reactionPowerLoss, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.NORMAL,
          easing: EASING.EASE_IN,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.timing(reactionPowerLoss, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
    ]);

    // Power - stable, radiates
    const powerSequence = Animated.sequence([
      Animated.delay(ANIMATION_DURATION.FAST),
      Animated.parallel([
        Animated.timing(powerRadiate, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.timing(powerRadiate, {
        toValue: 0,
        duration: ANIMATION_DURATION.FAST,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(triggerSequence).start();
    Animated.loop(reactionSequence).start();
    Animated.loop(powerSequence).start();
  }, [autoPlay, triggerOpacity, reactionBounce, reactionPowerLoss, powerStable, powerRadiate]);

  const reactionTranslateY = reactionBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const powerScale = powerRadiate.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* External trigger */}
        <Animated.View
          style={[
            styles.trigger,
            {
              opacity: triggerOpacity,
            },
          ]}
        >
          <View style={[styles.triggerDot, { backgroundColor: colors.force }]} />
        </Animated.View>

        {/* Reaction side - being the effect */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={[styles.label, { opacity: reactionPowerLoss }]}>
              Reaction (Effect)
            </Animated.Text>
          </View>
          <Animated.View
            style={[
              styles.reactionCircle,
              {
                transform: [{ translateY: reactionTranslateY }],
                opacity: reactionPowerLoss,
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
          <Animated.Text style={[styles.description, { opacity: reactionPowerLoss }]}>
            Power given away
          </Animated.Text>
        </View>

        {/* Power side - being the source */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={[styles.label, { opacity: powerStable }]}>
              Power (Source)
            </Animated.Text>
          </View>
          {/* Power glow */}
          <Animated.View
            style={[
              styles.powerGlow,
              {
                opacity: powerRadiate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                transform: [{ scale: powerScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.powerCircle,
              {
                transform: [{ scale: powerScale }],
                opacity: powerStable,
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
          <Animated.Text style={[styles.description, { opacity: powerStable }]}>
            Power maintained
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  trigger: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -10,
  },
  triggerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
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
  reactionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  powerGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
  },
  powerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  description: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});

