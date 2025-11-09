import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 280;

interface EnergyLeakAnimationProps {
  autoPlay?: boolean;
}

export default function EnergyLeakAnimation({
  autoPlay = true,
}: EnergyLeakAnimationProps) {
  const colors = useThemeAnimation();

  // Energy flowing in
  const energyIn = useRef(new Animated.Value(0)).current;
  const energyGlow = useRef(new Animated.Value(0.5)).current;
  
  // Energy leaking out through blocks (with curved paths)
  const leak1 = useRef(new Animated.Value(0)).current;
  const leak2 = useRef(new Animated.Value(0)).current;
  const leak3 = useRef(new Animated.Value(0)).current;
  const leak1Curve = useRef(new Animated.Value(0)).current; // For curved path
  const leak2Curve = useRef(new Animated.Value(0)).current;
  const leak3Curve = useRef(new Animated.Value(0)).current;

  // Block opacity (dissolving) with spring bounce
  const block1Opacity = useRef(new Animated.Value(1)).current;
  const block2Opacity = useRef(new Animated.Value(1)).current;
  const block3Opacity = useRef(new Animated.Value(1)).current;
  const block1Bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      // Energy flowing in continuously with glow
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(energyIn, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
            Animated.timing(energyIn, {
              toValue: 0,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT_CUBIC,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(energyGlow, {
              toValue: 1,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(energyGlow, {
              toValue: 0.5,
              duration: ANIMATION_DURATION.SLOW,
              easing: EASING.EASE_IN_OUT,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();

      // Leaks happening through blocks with curved paths
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL),
            Animated.parallel([
              Animated.timing(leak1, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
              Animated.timing(leak1Curve, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN_OUT,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(leak1, {
                toValue: 0,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN,
                useNativeDriver: true,
              }),
              Animated.timing(leak1Curve, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 1.5),
            Animated.parallel([
              Animated.timing(leak2, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
              Animated.timing(leak2Curve, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN_OUT,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(leak2, {
                toValue: 0,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN,
                useNativeDriver: true,
              }),
              Animated.timing(leak2Curve, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.sequence([
            Animated.delay(ANIMATION_DURATION.NORMAL * 2),
            Animated.parallel([
              Animated.timing(leak3, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_OUT_CUBIC,
                useNativeDriver: true,
              }),
              Animated.timing(leak3Curve, {
                toValue: 1,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN_OUT,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(leak3, {
                toValue: 0,
                duration: ANIMATION_DURATION.NORMAL,
                easing: EASING.EASE_IN,
                useNativeDriver: true,
              }),
              Animated.timing(leak3Curve, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      ).start();

      // Gradually dissolve blocks with spring bounce on impact
      setTimeout(() => {
        Animated.parallel([
          Animated.sequence([
            createSpringAnimation(block1Bounce, 1, 'BOUNCY'),
            Animated.timing(block1Opacity, {
              toValue: 0.3,
              duration: ANIMATION_DURATION.VERY_SLOW * 2,
              easing: EASING.EASE_OUT,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(block2Opacity, {
            toValue: 0.3,
            duration: ANIMATION_DURATION.VERY_SLOW * 2,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(block3Opacity, {
            toValue: 0.3,
            duration: ANIMATION_DURATION.VERY_SLOW * 2,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
        ]).start();
      }, ANIMATION_DURATION.SLOW * 3);
    }
  }, [autoPlay]);

  const energyY = energyIn.interpolate({
    inputRange: [0, 1],
    outputRange: [ANIMATION_HEIGHT, 0],
  });

  const energyGlowOpacity = energyGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  // Curved paths for leaks
  const leak1Y = leak1.interpolate({
    inputRange: [0, 1],
    outputRange: [60, ANIMATION_HEIGHT],
  });
  const leak1X = leak1Curve.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 15, 0],
  });

  const leak2Y = leak2.interpolate({
    inputRange: [0, 1],
    outputRange: [120, ANIMATION_HEIGHT],
  });
  const leak2X = leak2Curve.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -12, 0],
  });

  const leak3Y = leak3.interpolate({
    inputRange: [0, 1],
    outputRange: [180, ANIMATION_HEIGHT],
  });
  const leak3X = leak3Curve.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  const block1BounceScale = block1Bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      {/* Energy source at top with glow */}
      <Animated.View
        style={[
          styles.energySource,
          {
            opacity: energyGlowOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.energy, colors.energyLeak, colors.energy]}
          style={styles.sourceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Energy flowing in */}
      <Animated.View
        style={[
          styles.energyFlow,
          {
            transform: [{ translateY: energyY }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.energy, 'transparent']}
          style={styles.flowGradient}
        />
      </Animated.View>

      {/* Emotional blocks */}
      <Animated.View
        style={[
          styles.block,
          styles.block1,
          {
            opacity: block1Opacity,
            transform: [{ scale: block1BounceScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(150, 150, 150, 0.6)', 'rgba(200, 200, 200, 0.3)', 'rgba(150, 150, 150, 0.6)']}
          style={styles.blockInner}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.block,
          styles.block2,
          {
            opacity: block2Opacity,
          },
        ]}
      >
        <View style={styles.blockInner} />
      </Animated.View>

      <Animated.View
        style={[
          styles.block,
          styles.block3,
          {
            opacity: block3Opacity,
          },
        ]}
      >
        <View style={styles.blockInner} />
      </Animated.View>

      {/* Energy leaking out with curved paths and trails */}
      <Animated.View
        style={[
          styles.leak,
          styles.leak1,
          {
            transform: [
              { translateX: leak1X },
              { translateY: leak1Y },
            ],
            opacity: leak1,
          },
        ]}
      >
        {/* Particle trail */}
        <Animated.View
          style={[
            styles.leakTrail,
            {
              opacity: leak1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        />
        <LinearGradient
          colors={[colors.energyLeak, `${colors.energyLeak}80`, 'transparent']}
          style={styles.leakGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.leak,
          styles.leak2,
          {
            transform: [
              { translateX: leak2X },
              { translateY: leak2Y },
            ],
            opacity: leak2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.leakTrail,
            {
              opacity: leak2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        />
        <LinearGradient
          colors={[colors.energyLeak, `${colors.energyLeak}80`, 'transparent']}
          style={styles.leakGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.leak,
          styles.leak3,
          {
            transform: [
              { translateX: leak3X },
              { translateY: leak3Y },
            ],
            opacity: leak3,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.leakTrail,
            {
              opacity: leak3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        />
        <LinearGradient
          colors={[colors.energyLeak, `${colors.energyLeak}80`, 'transparent']}
          style={styles.leakGradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    height: ANIMATION_HEIGHT,
    alignSelf: 'center',
    position: 'relative',
  },
  energySource: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  sourceGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  energyFlow: {
    position: 'absolute',
    top: 40,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: ANIMATION_HEIGHT - 40,
  },
  flowGradient: {
    width: '100%',
    height: '100%',
  },
  block: {
    position: 'absolute',
    width: 85,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(150, 150, 150, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(100, 100, 100, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  blockInner: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  block1: {
    top: 50,
    left: '50%',
    marginLeft: -40,
  },
  block2: {
    top: 110,
    left: '50%',
    marginLeft: -40,
  },
  block3: {
    top: 170,
    left: '50%',
    marginLeft: -40,
  },
  leak: {
    position: 'absolute',
    width: 24,
    height: ANIMATION_HEIGHT,
  },
  leakTrail: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
    top: -15,
    left: -3,
  },
  leak1: {
    left: '30%',
  },
  leak2: {
    left: '50%',
  },
  leak3: {
    left: '70%',
  },
  leakGradient: {
    width: '100%',
    height: '100%',
  },
});

