import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface EmotionalStackCollapseAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function EmotionalStackCollapseAnimation({
  autoPlay = true,
  onInteraction,
}: EmotionalStackCollapseAnimationProps) {
  const colors = useThemeAnimation();
  
  // Stack layers - multiple emotional layers
  const layer1Y = useRef(new Animated.Value(0)).current;
  const layer2Y = useRef(new Animated.Value(40)).current;
  const layer3Y = useRef(new Animated.Value(80)).current;
  const layer4Y = useRef(new Animated.Value(120)).current;
  
  // Opacity for layers
  const layer1Opacity = useRef(new Animated.Value(1)).current;
  const layer2Opacity = useRef(new Animated.Value(1)).current;
  const layer3Opacity = useRef(new Animated.Value(1)).current;
  const layer4Opacity = useRef(new Animated.Value(1)).current;
  
  // Energy release from bottom
  const energyRelease = useRef(new Animated.Value(0)).current;
  const energyOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    // Separate native and non-native animations to avoid conflicts
    const nonNativeSequence = Animated.sequence([
      // Phase 1: Energy release from bottom (letting go of fear energy)
      Animated.timing(energyRelease, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        easing: EASING.EASE_OUT,
        useNativeDriver: false,
      }),
      Animated.delay(ANIMATION_DURATION.SLOW * 2),
      Animated.timing(energyRelease, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }),
    ]);

    const nativeSequence = Animated.sequence([
      // Phase 1: Energy opacity
      Animated.timing(energyOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      // Phase 2: Stack collapses from bottom up
      Animated.delay(ANIMATION_DURATION.NORMAL),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(layer1Y, {
            toValue: ANIMATION_HEIGHT - 40,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(layer1Opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(layer2Y, {
            toValue: ANIMATION_HEIGHT - 40,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(layer2Opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(layer3Y, {
            toValue: ANIMATION_HEIGHT - 40,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(layer3Opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(layer4Y, {
            toValue: ANIMATION_HEIGHT - 40,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(layer4Opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION.NORMAL,
            easing: EASING.EASE_IN,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Phase 3: Reset
      Animated.delay(ANIMATION_DURATION.SLOW),
      Animated.parallel([
        Animated.timing(layer1Y, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer2Y, {
          toValue: 40,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer3Y, {
          toValue: 80,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer4Y, {
          toValue: 120,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer1Opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer2Opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer3Opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(layer4Opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(energyOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const collapseSequence = Animated.parallel([
      Animated.loop(nonNativeSequence),
      Animated.loop(nativeSequence),
    ]);

    collapseSequence.start();
  }, [autoPlay, layer1Y, layer2Y, layer3Y, layer4Y, layer1Opacity, layer2Opacity, layer3Opacity, layer4Opacity, energyRelease, energyOpacity]);

  const energyHeight = energyRelease.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Energy release from bottom */}
        <Animated.View
          style={[
            styles.energyRelease,
            {
              height: energyHeight,
              opacity: energyOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.energy, `${colors.energy}00`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        </Animated.View>

        {/* Stack layers */}
        <Animated.View
          style={[
            styles.layer,
            styles.layer1,
            {
              transform: [{ translateY: layer1Y }],
              opacity: layer1Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.fear, `${colors.fear}CC`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.layerLabel}>
            <Animated.Text style={[styles.layerText, { opacity: layer1Opacity }]}>
              Fear Layer 1
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.layer2,
            {
              transform: [{ translateY: layer2Y }],
              opacity: layer2Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.fear}CC`, `${colors.fear}99`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.layerLabel}>
            <Animated.Text style={[styles.layerText, { opacity: layer2Opacity }]}>
              Fear Layer 2
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.layer3,
            {
              transform: [{ translateY: layer3Y }],
              opacity: layer3Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.fear}99`, `${colors.fear}66`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.layerLabel}>
            <Animated.Text style={[styles.layerText, { opacity: layer3Opacity }]}>
              Fear Layer 3
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.layer4,
            {
              transform: [{ translateY: layer4Y }],
              opacity: layer4Opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[`${colors.fear}66`, `${colors.fear}33`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.layerLabel}>
            <Animated.Text style={[styles.layerText, { opacity: layer4Opacity }]}>
              Fear Layer 4
            </Animated.Text>
          </View>
        </Animated.View>
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
  energyRelease: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(52, 211, 153, 0.6)',
  },
  layer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 35,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  layer1: {
    top: 0,
  },
  layer2: {
    top: 40,
  },
  layer3: {
    top: 80,
  },
  layer4: {
    top: 120,
  },
  layerLabel: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  layerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

