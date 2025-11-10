import { useRef, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import { getAnimationDuration, EASING } from './animationUtils';

interface UseAnimationOptions {
  duration?: number;
  easing?: (value: number) => number;
  loop?: boolean;
  autoStart?: boolean;
}

/**
 * Hook for managing animations
 */
export function useAnimation(
  initialValue: number = 0,
  options: UseAnimationOptions = {}
) {
  const {
    duration = 1000,
    easing = EASING.EASE_IN_OUT,
    loop = false,
    autoStart = false,
  } = options;

  const animValue = useRef(new Animated.Value(initialValue)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const start = useCallback(
    (toValue: number, callback?: () => void) => {
      const anim = Animated.timing(animValue, {
        toValue,
        duration: getAnimationDuration(duration),
        easing,
        useNativeDriver: true,
      });

      if (callback) {
        anim.start(callback);
      } else {
        anim.start();
      }

      return anim;
    },
    [animValue, duration, easing]
  );

  const loopAnimation = useCallback(
    (fromValue: number, toValue: number) => {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue,
            duration: getAnimationDuration(duration),
            easing,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: fromValue,
            duration: getAnimationDuration(duration),
            easing,
            useNativeDriver: true,
          }),
        ])
      );

      loopRef.current = anim;
      anim.start();
      return anim;
    },
    [animValue, duration, easing]
  );

  const stop = useCallback(() => {
    animValue.stopAnimation();
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current = null;
    }
  }, [animValue]);

  const reset = useCallback(() => {
    stop();
    animValue.setValue(initialValue);
  }, [animValue, initialValue, stop]);

  useEffect(() => {
    if (autoStart && loop) {
      loopAnimation(initialValue, 1);
    }

    return () => {
      stop();
    };
  }, []);

  return {
    value: animValue,
    start,
    loop: loopAnimation,
    stop,
    reset,
  };
}



