import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Canvas,
  LinearGradient as SkiaLinearGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';

export type SkiaHeroBackdropProps = {
  colors: string[];
  style?: ViewStyle;
  /** Use Skia Canvas (true) or Expo LinearGradient only. */
  useSkia?: boolean;
};

/**
 * Premium hero background: Skia linear gradient filling the layout bounds, with Expo fallback.
 */
export function SkiaHeroBackdrop({
  colors,
  style,
  useSkia = true,
}: SkiaHeroBackdropProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const c = colors as [string, string, ...string[]];

  if (size.w < 8 || size.h < 8) {
    return (
      <View style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
        <LinearGradient colors={c} style={StyleSheet.absoluteFill} />
      </View>
    );
  }

  if (!useSkia) {
    return (
      <View style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
        <LinearGradient colors={c} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
      <Canvas style={{ width: size.w, height: size.h }}>
        <Rect x={0} y={0} width={size.w} height={size.h}>
          <SkiaLinearGradient start={vec(0, 0)} end={vec(size.w, size.h)} colors={colors} />
        </Rect>
      </Canvas>
    </View>
  );
}
