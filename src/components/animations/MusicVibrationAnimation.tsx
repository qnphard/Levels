import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface MusicVibrationAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function MusicVibrationAnimation({
  autoPlay = true,
  onInteraction,
}: MusicVibrationAnimationProps) {
  const colors = useThemeAnimation();
  
  // Anger-based music - chaotic, high frequency
  const angerWave1 = useRef(new Animated.Value(0)).current;
  const angerWave2 = useRef(new Animated.Value(0)).current;
  const angerWave3 = useRef(new Animated.Value(0)).current;
  
  // Classical music - smooth, harmonious
  const classicalWave1 = useRef(new Animated.Value(0)).current;
  const classicalWave2 = useRef(new Animated.Value(0)).current;
  const classicalWave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Anger waves - chaotic, irregular
    const createAngerWave = (wave: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(wave, {
            toValue: 1,
            duration: ANIMATION_DURATION.FAST,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(wave, {
            toValue: 0,
            duration: ANIMATION_DURATION.FAST,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Classical waves - smooth, harmonious
    const createClassicalWave = (wave: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(wave, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(wave, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_IN_OUT,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAngerWave(angerWave1, 0).start();
    createAngerWave(angerWave2, 100).start();
    createAngerWave(angerWave3, 200).start();

    createClassicalWave(classicalWave1, 0).start();
    createClassicalWave(classicalWave2, ANIMATION_DURATION.NORMAL).start();
    createClassicalWave(classicalWave3, ANIMATION_DURATION.NORMAL * 2).start();
  }, [autoPlay, angerWave1, angerWave2, angerWave3, classicalWave1, classicalWave2, classicalWave3]);

  const angerAmplitude1 = angerWave1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const angerAmplitude2 = angerWave2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const angerAmplitude3 = angerWave3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 35],
  });

  const classicalAmplitude1 = classicalWave1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const classicalAmplitude2 = classicalWave2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });

  const classicalAmplitude3 = classicalWave3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Anger-based music */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={styles.label}>Anger-based Music</Animated.Text>
            <Animated.Text style={styles.subLabel}>High frequency • Chaotic</Animated.Text>
          </View>
          <View style={styles.waveContainer}>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(angerAmplitude1, 20) }],
                  backgroundColor: colors.force,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.force, `${colors.force}CC`, colors.force]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(angerAmplitude2, 20) }],
                  backgroundColor: colors.force,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.force, `${colors.force}CC`, colors.force]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(angerAmplitude3, 20) }],
                  backgroundColor: colors.force,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.force, `${colors.force}CC`, colors.force]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Classical music */}
        <View style={styles.sideContainer}>
          <View style={styles.labelContainer}>
            <Animated.Text style={styles.label}>Classical Music</Animated.Text>
            <Animated.Text style={styles.subLabel}>Harmonious • Love level</Animated.Text>
          </View>
          <View style={styles.waveContainer}>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(classicalAmplitude1, 20) }],
                  backgroundColor: colors.love,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.love, `${colors.love}CC`, colors.love]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(classicalAmplitude2, 20) }],
                  backgroundColor: colors.love,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.love, `${colors.love}CC`, colors.love]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: Animated.divide(classicalAmplitude3, 20) }],
                  backgroundColor: colors.love,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.love, `${colors.love}CC`, colors.love]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
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
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
  },
  sideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    height: 80,
  },
  wave: {
    width: 20,
    borderRadius: 4,
    minHeight: 4,
  },
});

