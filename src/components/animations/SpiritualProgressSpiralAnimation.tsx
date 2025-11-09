import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface SpiritualProgressSpiralAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function SpiritualProgressSpiralAnimation({
  autoPlay = true,
  onInteraction,
}: SpiritualProgressSpiralAnimationProps) {
  const colors = useThemeAnimation();
  
  // Spiral path progress
  const progress = useRef(new Animated.Value(0)).current;
  
  // Current position on spiral
  const currentX = useRef(new Animated.Value(0)).current;
  const currentY = useRef(new Animated.Value(0)).current;
  
  // Ups and downs (vertical oscillation)
  const verticalOscillation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Calculate spiral path
    const spiralSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: ANIMATION_DURATION.VERY_SLOW * 2,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );

    // Vertical oscillation for ups and downs
    const oscillationSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(verticalOscillation, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(verticalOscillation, {
          toValue: -1,
          duration: ANIMATION_DURATION.SLOW,
          easing: EASING.EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ])
    );

    spiralSequence.start();
    oscillationSequence.start();

    // Update position based on progress
    const updatePosition = () => {
      progress.addListener(({ value }) => {
        // Spiral: r = a * θ
        const angle = value * Math.PI * 4; // 2 full rotations
        const radius = 30 + value * 40;
        const x = ANIMATION_WIDTH / 2 + radius * Math.cos(angle) - 20;
        const y = ANIMATION_HEIGHT / 2 + radius * Math.sin(angle) - 20;
        
        currentX.setValue(x);
        currentY.setValue(y);
      });
    };

    updatePosition();
  }, [autoPlay, progress, currentX, currentY, verticalOscillation]);

  const verticalOffset = verticalOscillation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-15, 15],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Spiral path visualization */}
        <View style={styles.spiralContainer}>
          {/* Draw spiral path using multiple arcs */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 4;
            const radius = 30 + (i / 8) * 40;
            const x = ANIMATION_WIDTH / 2 + radius * Math.cos(angle);
            const y = ANIMATION_HEIGHT / 2 + radius * Math.sin(angle);
            
            return (
              <View
                key={i}
                style={[
                  styles.pathDot,
                  {
                    left: x - 2,
                    top: y - 2,
                    backgroundColor: `${colors.primary}40`,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Current position indicator */}
        <Animated.View
          style={[
            styles.currentPosition,
            {
              left: currentX,
              top: currentY,
              transform: [{ translateY: verticalOffset }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`, colors.primary]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Start point */}
        <View style={styles.startPoint}>
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Labels */}
        <View style={styles.labelContainer}>
          <View style={styles.label}>
            <View style={[styles.labelDot, { backgroundColor: colors.primary }]} />
            <Animated.Text style={styles.labelText}>Non-linear Path</Animated.Text>
          </View>
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
  spiralContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  pathDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  currentPosition: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 7,
  },
  startPoint: {
    position: 'absolute',
    left: ANIMATION_WIDTH / 2 - 9,
    top: ANIMATION_HEIGHT / 2 - 9,
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

