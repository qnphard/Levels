import React, { ReactNode, useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale multiplier when pressed (default 0.97) */
  scaleDown?: number;
  /** Disable press animation */
  disabled?: boolean;
};

/**
 * Card-friendly press feedback: subtle spring scale on press in/out.
 */
export function PressableScale({
  children,
  style,
  scaleDown = 0.97,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      if (!disabled) {
        scale.value = withSpring(scaleDown, { damping: 18, stiffness: 320 });
      }
      onPressIn?.(e);
    },
    [disabled, onPressIn, scale, scaleDown]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withSpring(1, { damping: 18, stiffness: 320 });
      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Pressable
        {...rest}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
