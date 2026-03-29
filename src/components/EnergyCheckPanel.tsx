import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, useThemeMode, typography, spacing } from '../theme/colors';
import { Zone } from '../store/onboardingStore';

const ZONES = [
  { zone: Zone.Shame, label: 'Shame', color: '#4A1A4A', relatable: ['Humiliation', 'Worthlessness', 'Withdrawal'] },
  { zone: Zone.Guilt, label: 'Guilt', color: '#1E3A3A', relatable: ['Regret', 'Self-Blame', 'Remorse'] },
  { zone: Zone.Apathy, label: 'Apathy', color: '#3A3A3A', relatable: ['Numbness', 'Despair', 'Hopelessness'] },
  { zone: Zone.Grief, label: 'Grief', color: '#1E2B4E', relatable: ['Sadness', 'Loss', 'Regret'] },
  { zone: Zone.Fear, label: 'Fear', color: '#6B0000', relatable: ['Anxiety', 'Worry', 'Panic'] },
  { zone: Zone.Desire, label: 'Desire', color: '#8B4513', relatable: ['Craving', 'Lust', 'Obsession'] },
  { zone: Zone.Anger, label: 'Anger', color: '#B22222', relatable: ['Frustration', 'Resentment', 'Hate'] },
  { zone: Zone.Pride, label: 'Pride', color: '#7C3AED', relatable: ['Ego', 'Arrogance', 'Superiority'] },
];

const GRADIENT_COLORS = ZONES.map((z) => z.color).reverse() as [string, string, ...string[]];

export const ENERGY_ZONE_TO_LEVEL_ID: Record<Zone, string | null> = {
  [Zone.Shame]: 'shame',
  [Zone.Guilt]: 'guilt',
  [Zone.Apathy]: 'apathy',
  [Zone.Grief]: 'grief',
  [Zone.Fear]: 'fear',
  [Zone.Desire]: 'desire',
  [Zone.Anger]: 'anger',
  [Zone.Pride]: 'pride',
  [Zone.Pivot]: 'courage',
  [Zone.Flow]: 'love',
  [Zone.Source]: 'peace',
};

type Props = {
  /** Height as fraction of window height (default 0.5) */
  sliderHeightRatio?: number;
  onAcknowledge: (zone: Zone) => void;
  /** Shown below Acknowledge (e.g. skip pulse but keep relief intention) */
  onSkip?: () => void;
  onBack?: () => void;
};

export default function EnergyCheckPanel({
  sliderHeightRatio = 0.5,
  onAcknowledge,
  onSkip,
  onBack,
}: Props) {
  const theme = useThemeColors();
  const mode = useThemeMode();
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const SLIDER_HEIGHT = SCREEN_HEIGHT * sliderHeightRatio;
  const ROW_HEIGHT = SLIDER_HEIGHT / ZONES.length;

  const INTERPOLATION_BREAKPOINTS = [...ZONES]
    .reverse()
    .map((_, i) => i * ROW_HEIGHT + ROW_HEIGHT / 2);
  const INTERPOLATION_COLORS = ZONES.map((z) => z.color).reverse();

  const [selectedIndex, setSelectedIndex] = useState(ZONES.length - 1);
  const sliderY = useSharedValue((ZONES.length - 1) * ROW_HEIGHT + ROW_HEIGHT / 2);

  useEffect(() => {
    setSelectedIndex(ZONES.length - 1);
    sliderY.value = (ZONES.length - 1) * ROW_HEIGHT + ROW_HEIGHT / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderHeightRatio]);

  const updateIndex = (y: number) => {
    const idx = Math.floor(y / ROW_HEIGHT);
    const clampedIdx = Math.max(0, Math.min(ZONES.length - 1, idx));
    setSelectedIndex(clampedIdx);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      const newY = Math.max(0, Math.min(SLIDER_HEIGHT, e.y));
      sliderY.value = newY;
      runOnJS(updateIndex)(newY);
    })
    .onEnd(() => {
      'worklet';
      const idx = Math.floor(sliderY.value / ROW_HEIGHT);
      const clampedIdx = Math.max(0, Math.min(ZONES.length - 1, idx));
      sliderY.value = withSpring(clampedIdx * ROW_HEIGHT + ROW_HEIGHT / 2);
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    top: sliderY.value - 12,
  }));

  const bgGlowStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      sliderY.value,
      INTERPOLATION_BREAKPOINTS,
      INTERPOLATION_COLORS
    );
    return {
      backgroundColor: color,
      opacity: mode === 'dark' ? 0.55 : 0.35,
    };
  });

  const confirm = () => {
    const reversedZones = [...ZONES].reverse();
    const selectedZone = reversedZones[selectedIndex].zone;
    onAcknowledge(selectedZone);
  };

  const displayZones = [...ZONES].reverse();
  const currentZone = displayZones[selectedIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[StyleSheet.absoluteFill, bgGlowStyle]} />
      {onBack ? (
        <TouchableOpacity
          style={styles.backToPrompt}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.backToPromptText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity activeOpacity={1} style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Where is your energy landing?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>A momentary pulse check</Text>
      </TouchableOpacity>

      <View style={styles.sliderRow}>
        <View style={[styles.labelColumn, { height: SLIDER_HEIGHT }]}>
          {displayZones.map((z, i) => (
            <View key={z.zone} style={[styles.labelCell, { height: ROW_HEIGHT }]}>
              <Text
                style={[
                  styles.labelHawkins,
                  { color: theme.textSecondary, opacity: 0.8 },
                  selectedIndex === i
                    ? { color: theme.textPrimary, fontWeight: typography.bold, opacity: 1 }
                    : null,
                ]}
              >
                {z.label.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <GestureDetector gesture={panGesture}>
          <View style={[styles.trackWrapper, { height: SLIDER_HEIGHT }]}>
            <LinearGradient colors={GRADIENT_COLORS} style={[styles.track, { height: SLIDER_HEIGHT }]} />
            <Animated.View
              style={[
                styles.indicator,
                indicatorStyle,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  shadowColor: currentZone.color,
                },
              ]}
            >
              <View
                style={[
                  styles.indicatorInner,
                  { backgroundColor: currentZone.color, width: 10, height: 10, borderRadius: 5 },
                ]}
              />
            </Animated.View>
          </View>
        </GestureDetector>

        <View style={[styles.relatableColumn, { height: SLIDER_HEIGHT }]}>
          {displayZones.map((z, i) => (
            <View key={z.zone} style={[styles.labelCell, { height: ROW_HEIGHT }]}>
              <Text
                style={[
                  styles.labelRelatable,
                  { color: theme.textSecondary, opacity: 0.8 },
                  selectedIndex === i
                    ? { color: theme.textPrimary, fontWeight: typography.semibold, opacity: 1 }
                    : null,
                ]}
              >
                {z.relatable.join(' · ')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: theme.primary }]}
          onPress={confirm}
        >
          <Text style={[styles.confirmText, { color: theme.primaryContrast }]}>Acknowledge</Text>
        </TouchableOpacity>
        {onSkip ? (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={[styles.skipText, { color: theme.textSecondary, opacity: 0.8 }]}>
              Just browsing
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  backToPrompt: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  backToPromptText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: typography.regular,
    textAlign: 'center',
    marginTop: 8,
  },
  sliderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    minHeight: 200,
  },
  labelColumn: {
    flex: 1,
  },
  labelCell: {
    justifyContent: 'center',
  },
  labelHawkins: {
    fontSize: 15,
    fontWeight: typography.medium,
    textAlign: 'right',
    paddingRight: 10,
  },
  trackWrapper: {
    width: 48,
    alignItems: 'center',
  },
  track: {
    width: 6,
    borderRadius: 3,
    shadowColor: '#ffffff',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  indicator: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  indicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  relatableColumn: {
    flex: 2,
    paddingLeft: 10,
  },
  labelRelatable: {
    fontSize: 13,
    fontWeight: typography.regular,
    lineHeight: 17,
  },
  footer: {
    width: '100%',
    paddingBottom: 24,
    gap: 12,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: typography.semibold,
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 15,
    fontWeight: typography.regular,
  },
});
