/**
 * Native-stack screen options presets for consistent navigation feel.
 * Use with Stack.Screen options or group screenOptions.
 */
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const screenTransitions = {
  default: {
    animation: 'slide_from_right' as const,
    animationDuration: 250,
  } satisfies NativeStackNavigationOptions,

  modal: {
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
  } satisfies NativeStackNavigationOptions,

  fade: {
    animation: 'fade' as const,
    animationDuration: 200,
  } satisfies NativeStackNavigationOptions,

  content: {
    animation: 'slide_from_right' as const,
    animationDuration: 250,
  } satisfies NativeStackNavigationOptions,
};
