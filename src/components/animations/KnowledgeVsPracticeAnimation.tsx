import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 250;

interface KnowledgeVsPracticeAnimationProps {
  autoPlay?: boolean;
}

export default function KnowledgeVsPracticeAnimation({
  autoPlay = true,
}: KnowledgeVsPracticeAnimationProps) {
  const colors = useThemeAnimation();

  // Knowledge side - static, accumulating
  const knowledgeScale = useRef(new Animated.Value(1)).current;
  const knowledgeOpacity = useRef(new Animated.Value(0.6)).current;

  // Practice side - dynamic, transforming
  const practicePulse = useRef(new Animated.Value(0)).current;
  const practiceRipple = useRef(new Animated.Value(0)).current;
  const practiceGlow = useRef(new Animated.Value(0.5)).current;
  const practiceParticles = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      // Knowledge: accumulates but stays static
      Animated.loop(
        Animated.sequence([
          Animated.timing(knowledgeScale, {
            toValue: 1.1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(knowledgeScale, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Practice: dynamic transformation with spring bounce
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            createSpringAnimation(practicePulse, 1, 'BOUNCY'),
            createSpringAnimation(practicePulse, 0, 'BOUNCY'),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(practiceRipple, {
                toValue: 1,
                duration: ANIMATION_DURATION.SLOW * 1.5,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
              Animated.timing(practiceRipple, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.sequence([
            Animated.timing(practiceGlow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(practiceGlow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(practiceParticles, {
                toValue: 1,
                duration: ANIMATION_DURATION.SLOW * 2,
                easing: EASING.EASE_OUT,
                useNativeDriver: true,
              }),
              Animated.timing(practiceParticles, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ])
          ),
        ])
      ).start();
    }
  }, [autoPlay]);

  const practiceScale = practicePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  const practiceGlowOpacity = practiceGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const particleScale = practiceParticles.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  const particleOpacity = practiceParticles.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.6, 0],
  });

  const rippleScale = practiceRipple.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  const rippleOpacity = practiceRipple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Knowledge Side */}
        <View style={styles.side}>
          <View style={styles.labelContainer}>
            <Ionicons name="book-outline" size={18} color="#8B5CF6" />
            <Text style={[styles.label, { color: '#8B5CF6' }]}>Knowledge</Text>
          </View>
          <View style={styles.animationBox}>
            <Animated.View
              style={[
                styles.knowledgeStack,
                {
                  transform: [{ scale: knowledgeScale }],
                  opacity: knowledgeOpacity,
                },
              ]}
            >
              <View style={styles.book} />
              <View style={[styles.book, { top: 5, left: 2 }]} />
              <View style={[styles.book, { top: 10, left: 4 }]} />
            </Animated.View>
          </View>
          <Text style={styles.description}>Accumulates • Static</Text>
        </View>

        {/* Practice Side */}
        <View style={styles.side}>
          <View style={styles.labelContainer}>
            <Ionicons name="hand-right-outline" size={18} color="#34D399" />
            <Text style={[styles.label, { color: '#34D399' }]}>Practice</Text>
          </View>
          <View style={styles.animationBox}>
            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleScale }],
                  opacity: rippleOpacity,
                },
              ]}
            />
            {/* Particle effects */}
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
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.practiceGlow,
                {
                  opacity: practiceGlowOpacity,
                  transform: [{ scale: practiceScale }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(52, 211, 153, 0.3)', 'rgba(52, 211, 153, 0)']}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.practiceCircle,
                {
                  transform: [{ scale: practiceScale }],
                },
              ]}
            >
              <LinearGradient
                colors={['#34D399', '#10B981', '#34D399']}
                style={styles.practiceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.description}>Transforms • Dynamic</Text>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  animationBox: {
    width: 120,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  knowledgeStack: {
    width: 50,
    height: 60,
    position: 'relative',
  },
  book: {
    position: 'absolute',
    width: 42,
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    opacity: 0.7,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  practiceCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  particle1: {
    top: 10,
    left: 20,
  },
  particle2: {
    top: 30,
    right: 15,
  },
  particle3: {
    bottom: 15,
    left: 25,
  },
  practiceGradient: {
    width: '100%',
    height: '100%',
  },
  ripple: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#34D399',
  },
  description: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
});

