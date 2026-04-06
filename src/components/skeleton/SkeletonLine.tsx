import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors, borderRadius } from '../../theme/colors';

export type SkeletonLineProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

/**
 * Shimmer placeholder bar for loading states.
 */
export function SkeletonLine({
  width = '100%',
  height = 12,
  borderRadius: r = borderRadius.sm,
  style,
}: SkeletonLineProps) {
  const theme = useThemeColors();
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      style={[
        styles.track,
        {
          width: width as number,
          height,
          borderRadius: r,
          backgroundColor: theme.skeletonHighlight,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
});
