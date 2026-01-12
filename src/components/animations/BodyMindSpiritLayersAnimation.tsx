import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeAnimation } from './utils/useThemeAnimation';
import { EASING, ANIMATION_DURATION, createSpringAnimation } from './utils';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);
const ANIMATION_HEIGHT = 200;

interface BodyMindSpiritLayersAnimationProps {
  autoPlay?: boolean;
  onInteraction?: () => void;
}

export default function BodyMindSpiritLayersAnimation({
  autoPlay = true,
  onInteraction,
}: BodyMindSpiritLayersAnimationProps) {
  const colors = useThemeAnimation();
  
  // Body layer
  const bodyTension = useRef(new Animated.Value(1)).current;
  const bodyRelax = useRef(new Animated.Value(0)).current;
  
  // Mind layer
  const mindTension = useRef(new Animated.Value(1)).current;
  const mindRelax = useRef(new Animated.Value(0)).current;
  
  // Spirit layer
  const spiritTension = useRef(new Animated.Value(1)).current;
  const spiritRelax = useRef(new Animated.Value(0)).current;
  
  // Letting go indicator
  const lettingGoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    const sequence = Animated.sequence([
      // Phase 1: Tension at all levels
      Animated.delay(ANIMATION_DURATION.NORMAL),
      // Phase 2: Letting go begins
      Animated.timing(lettingGoOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        easing: EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      // Phase 3: Relaxation flows through all levels
      Animated.stagger(200, [
        Animated.parallel([
          Animated.timing(bodyTension, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(bodyRelax, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(mindTension, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(mindRelax, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(spiritTension, {
            toValue: 0,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(spiritRelax, {
            toValue: 1,
            duration: ANIMATION_DURATION.SLOW,
            easing: EASING.EASE_OUT,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(ANIMATION_DURATION.SLOW),
      // Phase 4: Reset
      Animated.parallel([
        Animated.timing(bodyTension, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(bodyRelax, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(mindTension, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(mindRelax, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(spiritTension, {
          toValue: 1,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(spiritRelax, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(lettingGoOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(sequence).start();
  }, [autoPlay, bodyTension, bodyRelax, mindTension, mindRelax, spiritTension, spiritRelax, lettingGoOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        {/* Letting go indicator */}
        <Animated.View
          style={[
            styles.lettingGoIndicator,
            {
              opacity: lettingGoOpacity,
            },
          ]}
        >
          <Animated.Text style={[styles.lettingGoText, { opacity: lettingGoOpacity }]}>
            Letting Go
          </Animated.Text>
        </Animated.View>

        {/* Body layer */}
        <Animated.View
          style={[
            styles.layer,
            styles.bodyLayer,
            {
              opacity: bodyTension,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.force, `${colors.force}CC`, colors.force]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: bodyTension }]}>
            Body - Tension
          </Animated.Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.bodyLayer,
            {
              opacity: bodyRelax,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.energy, `${colors.energy}CC`, colors.energy]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: bodyRelax }]}>
            Body - Relaxed
          </Animated.Text>
        </Animated.View>

        {/* Mind layer */}
        <Animated.View
          style={[
            styles.layer,
            styles.mindLayer,
            {
              opacity: mindTension,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.force, `${colors.force}CC`, colors.force]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: mindTension }]}>
            Mind - Tension
          </Animated.Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.mindLayer,
            {
              opacity: mindRelax,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.energy, `${colors.energy}CC`, colors.energy]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: mindRelax }]}>
            Mind - Relaxed
          </Animated.Text>
        </Animated.View>

        {/* Spirit layer */}
        <Animated.View
          style={[
            styles.layer,
            styles.spiritLayer,
            {
              opacity: spiritTension,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.force, `${colors.force}CC`, colors.force]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: spiritTension }]}>
            Spirit - Tension
          </Animated.Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.layer,
            styles.spiritLayer,
            {
              opacity: spiritRelax,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.energy, `${colors.energy}CC`, colors.energy]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.Text style={[styles.layerLabel, { opacity: spiritRelax }]}>
            Spirit - Relaxed
          </Animated.Text>
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
  lettingGoIndicator: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  lettingGoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  layer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  bodyLayer: {
    top: 50,
  },
  mindLayer: {
    top: 110,
  },
  spiritLayer: {
    top: 170,
  },
  layerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

