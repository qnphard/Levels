import React, { Children, ReactElement, ReactNode, isValidElement, useEffect, useState } from 'react';
import { AccessibilityInfo, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export type FadeStaggerProps = {
  children: ReactNode;
  staggerMs?: number;
  baseDelayMs?: number;
  enabled?: boolean;
  style?: ViewStyle;
};

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduced);
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduced as (v: boolean) => void
    );
    return () => sub?.remove?.();
  }, []);
  return reduced;
}

/**
 * Staggered fade-in for lists / sections. Disabled when reduce-motion is on.
 */
export function FadeStagger({
  children,
  staggerMs = 80,
  baseDelayMs = 0,
  enabled = true,
  style,
}: FadeStaggerProps) {
  const reduced = useReducedMotion();
  const animOn = enabled && !reduced;
  const arr = Children.toArray(children).filter(Boolean);

  if (!animOn) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={style}>
      {arr.map((child, index) => {
        if (!isValidElement(child)) {
          return <React.Fragment key={index}>{child}</React.Fragment>;
        }
        const delay = baseDelayMs + index * staggerMs;
        return (
          <Animated.View
            key={child.key ?? `fade-stagger-${index}`}
            entering={FadeInDown.delay(delay).duration(320)}
          >
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
}
