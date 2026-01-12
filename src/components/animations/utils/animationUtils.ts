import { Easing, Animated } from 'react-native';

/**
 * Animation timing constants
 */
export const ANIMATION_DURATION = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 1000,
  VERY_SLOW: 2000,
};

/**
 * Enhanced easing functions with cubic bezier curves for natural motion
 */
export const EASING = {
  // Standard easings
  EASE_OUT: Easing.out(Easing.ease),
  EASE_IN: Easing.in(Easing.ease),
  EASE_IN_OUT: Easing.inOut(Easing.ease),
  BOUNCE: Easing.bounce,
  ELASTIC: Easing.elastic(2),
  
  // Enhanced cubic bezier easings for organic motion
  // Fast start, slow end (natural deceleration)
  EASE_OUT_CUBIC: Easing.bezier(0.33, 1, 0.68, 1),
  // Slow start, fast end (natural acceleration)
  EASE_IN_CUBIC: Easing.bezier(0.32, 0, 0.67, 0),
  // Smooth S-curve
  EASE_IN_OUT_CUBIC: Easing.bezier(0.65, 0, 0.35, 1),
  // Slight overshoot (cartoon bounce)
  EASE_OUT_BACK: Easing.bezier(0.34, 1.56, 0.64, 1),
  // Elastic bounce effect
  EASE_OUT_ELASTIC: Easing.elastic(2),
};

/**
 * Spring animation presets for organic, cartoon-style motion
 */
export const SPRING_PRESETS = {
  // Bouncy spring - for playful, energetic elements
  BOUNCY: {
    tension: 100,
    friction: 8,
  },
  // Gentle spring - for smooth, natural transitions
  GENTLE: {
    tension: 50,
    friction: 15,
  },
  // Snappy spring - for quick, responsive interactions
  SNAPPY: {
    tension: 200,
    friction: 12,
  },
  // Default spring - balanced
  DEFAULT: {
    tension: 100,
    friction: 10,
  },
};

/**
 * Create a spring animation with preset configuration
 */
export const createSpringAnimation = (
  value: Animated.Value,
  toValue: number,
  preset: keyof typeof SPRING_PRESETS = 'DEFAULT',
  config?: Partial<{ tension: number; friction: number; speed: number; bounciness: number }>
): Animated.CompositeAnimation => {
  const presetConfig = SPRING_PRESETS[preset];
  return Animated.spring(value, {
    toValue,
    ...presetConfig,
    ...config,
    useNativeDriver: true,
  });
};

/**
 * Create a staggered animation sequence
 * Useful for animating multiple elements with slight delays
 */
export const createStaggeredAnimation = (
  animations: Animated.CompositeAnimation[],
  staggerDelay: number = 100
): Animated.CompositeAnimation => {
  return Animated.stagger(
    staggerDelay,
    animations
  );
};

/**
 * Check if reduced motion is preferred
 */
export const shouldReduceMotion = (): boolean => {
  // In a real implementation, you'd check AccessibilityInfo
  // For now, return false
  return false;
};

/**
 * Get animation duration based on reduced motion preference
 */
export const getAnimationDuration = (duration: number): number => {
  return shouldReduceMotion() ? 0 : duration;
};

