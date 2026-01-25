import React, { useMemo, useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Canvas, Group, Circle, Rect, RadialGradient, LinearGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue, SharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RoomEnvironmentConfig {
  levelId: string;
  category: 'lower' | 'linear' | 'spiritual' | 'enlightenment';
  atmosphere: {
    baseColor: string;
    fogDensity: number;
    lightIntensity: number;
    particleCount: number;
    particleType: 'dust' | 'energy' | 'light' | 'void';
  };
  lighting: {
    primary: { color: string; intensity: number; position: [number, number] };
    ambient: { color: string; intensity: number };
    shadows: boolean;
  };
  effects: {
    breathing: boolean;
    floating: boolean;
    pulsing: boolean;
    flowing: boolean;
  };
}

// Level-specific room configurations
const ROOM_CONFIGS: Record<string, RoomEnvironmentConfig> = {
  shame: {
    levelId: 'shame',
    category: 'lower',
    atmosphere: {
      baseColor: '#1a0d1a',
      fogDensity: 0.8,
      lightIntensity: 0.2,
      particleCount: 15,
      particleType: 'dust'
    },
    lighting: {
      primary: { color: '#4a1a4a', intensity: 0.3, position: [0.5, 0.2] },
      ambient: { color: '#2a0a2a', intensity: 0.1 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: false,
      pulsing: true,
      flowing: false
    }
  },
  guilt: {
    levelId: 'guilt',
    category: 'lower',
    atmosphere: {
      baseColor: '#2a1a3a',
      fogDensity: 0.7,
      lightIntensity: 0.25,
      particleCount: 18,
      particleType: 'dust'
    },
    lighting: {
      primary: { color: '#5a2a5a', intensity: 0.35, position: [0.3, 0.3] },
      ambient: { color: '#3a1a3a', intensity: 0.15 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: true,
      pulsing: false,
      flowing: false
    }
  },
  apathy: {
    levelId: 'apathy',
    category: 'lower',
    atmosphere: {
      baseColor: '#1a1a2a',
      fogDensity: 0.9,
      lightIntensity: 0.15,
      particleCount: 12,
      particleType: 'dust'
    },
    lighting: {
      primary: { color: '#3a3a5a', intensity: 0.25, position: [0.7, 0.8] },
      ambient: { color: '#2a2a4a', intensity: 0.1 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: false,
      pulsing: false,
      flowing: false
    }
  },
  grief: {
    levelId: 'grief',
    category: 'lower',
    atmosphere: {
      baseColor: '#1a2a4a',
      fogDensity: 0.8,
      lightIntensity: 0.2,
      particleCount: 20,
      particleType: 'dust'
    },
    lighting: {
      primary: { color: '#2a4a7a', intensity: 0.3, position: [0.2, 0.6] },
      ambient: { color: '#1a3a6a', intensity: 0.12 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: true,
      pulsing: true,
      flowing: false
    }
  },
  fear: {
    levelId: 'fear',
    category: 'lower',
    atmosphere: {
      baseColor: '#4a3a1a',
      fogDensity: 0.6,
      lightIntensity: 0.3,
      particleCount: 25,
      particleType: 'dust'
    },
    lighting: {
      primary: { color: '#aa7a2a', intensity: 0.4, position: [0.8, 0.2] },
      ambient: { color: '#7a5a1a', intensity: 0.2 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: true,
      pulsing: true,
      flowing: false
    }
  },
  desire: {
    levelId: 'desire',
    category: 'lower',
    atmosphere: {
      baseColor: '#4a1a1a',
      fogDensity: 0.5,
      lightIntensity: 0.4,
      particleCount: 30,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#cc4444', intensity: 0.5, position: [0.6, 0.4] },
      ambient: { color: '#aa2a2a', intensity: 0.25 },
      shadows: true
    },
    effects: {
      breathing: false,
      floating: true,
      pulsing: true,
      flowing: true
    }
  },
  anger: {
    levelId: 'anger',
    category: 'lower',
    atmosphere: {
      baseColor: '#4a2a1a',
      fogDensity: 0.4,
      lightIntensity: 0.5,
      particleCount: 35,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#ff6666', intensity: 0.6, position: [0.5, 0.3] },
      ambient: { color: '#cc3333', intensity: 0.3 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: true,
      flowing: true
    }
  },
  pride: {
    levelId: 'pride',
    category: 'lower',
    atmosphere: {
      baseColor: '#2a4a2a',
      fogDensity: 0.3,
      lightIntensity: 0.6,
      particleCount: 30,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#44cc88', intensity: 0.65, position: [0.4, 0.5] },
      ambient: { color: '#2a9a5a', intensity: 0.35 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  courage: {
    levelId: 'courage',
    category: 'linear',
    atmosphere: {
      baseColor: '#1a2a4a',
      fogDensity: 0.4,
      lightIntensity: 0.6,
      particleCount: 25,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#4a6aaa', intensity: 0.6, position: [0.4, 0.4] },
      ambient: { color: '#2a4a6a', intensity: 0.3 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  neutrality: {
    levelId: 'neutrality',
    category: 'linear',
    atmosphere: {
      baseColor: '#2a2a2a',
      fogDensity: 0.3,
      lightIntensity: 0.5,
      particleCount: 20,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#888888', intensity: 0.5, position: [0.5, 0.5] },
      ambient: { color: '#666666', intensity: 0.3 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: false,
      pulsing: false,
      flowing: false
    }
  },
  willingness: {
    levelId: 'willingness',
    category: 'linear',
    atmosphere: {
      baseColor: '#1a3a2a',
      fogDensity: 0.25,
      lightIntensity: 0.7,
      particleCount: 30,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#44cc88', intensity: 0.65, position: [0.3, 0.4] },
      ambient: { color: '#2a9a5a', intensity: 0.35 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  acceptance: {
    levelId: 'acceptance',
    category: 'linear',
    atmosphere: {
      baseColor: '#1a4a3a',
      fogDensity: 0.2,
      lightIntensity: 0.75,
      particleCount: 35,
      particleType: 'energy'
    },
    lighting: {
      primary: { color: '#22aa66', intensity: 0.7, position: [0.6, 0.3] },
      ambient: { color: '#1a8a4a', intensity: 0.4 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  reason: {
    levelId: 'reason',
    category: 'linear',
    atmosphere: {
      baseColor: '#1a3a4a',
      fogDensity: 0.15,
      lightIntensity: 0.8,
      particleCount: 40,
      particleType: 'light'
    },
    lighting: {
      primary: { color: '#2299cc', intensity: 0.75, position: [0.7, 0.2] },
      ambient: { color: '#1a7a9a', intensity: 0.45 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  love: {
    levelId: 'love',
    category: 'spiritual',
    atmosphere: {
      baseColor: '#4a2a2a',
      fogDensity: 0.3,
      lightIntensity: 0.8,
      particleCount: 40,
      particleType: 'light'
    },
    lighting: {
      primary: { color: '#ffd700', intensity: 0.7, position: [0.3, 0.3] },
      ambient: { color: '#ffe4b5', intensity: 0.4 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: true
    }
  },
  joy: {
    levelId: 'joy',
    category: 'spiritual',
    atmosphere: {
      baseColor: '#4a4a1a',
      fogDensity: 0.2,
      lightIntensity: 0.9,
      particleCount: 50,
      particleType: 'light'
    },
    lighting: {
      primary: { color: '#ffeb3b', intensity: 0.8, position: [0.5, 0.2] },
      ambient: { color: '#fff9c4', intensity: 0.5 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: true,
      flowing: true
    }
  },
  peace: {
    levelId: 'peace',
    category: 'enlightenment',
    atmosphere: {
      baseColor: '#2a2a4a',
      fogDensity: 0.1,
      lightIntensity: 1.0,
      particleCount: 30,
      particleType: 'light'
    },
    lighting: {
      primary: { color: '#ffffff', intensity: 0.9, position: [0.5, 0.5] },
      ambient: { color: '#f0f0ff', intensity: 0.6 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: false,
      flowing: false
    }
  },
  enlightenment: {
    levelId: 'enlightenment',
    category: 'enlightenment',
    atmosphere: {
      baseColor: '#4a4a5a',
      fogDensity: 0.05,
      lightIntensity: 1.2,
      particleCount: 25,
      particleType: 'light'
    },
    lighting: {
      primary: { color: '#ffffff', intensity: 1.0, position: [0.5, 0.5] },
      ambient: { color: '#ffffff', intensity: 0.8 },
      shadows: false
    },
    effects: {
      breathing: true,
      floating: true,
      pulsing: true,
      flowing: false
    }
  }
};

interface ParticleSystemProps {
  config: RoomEnvironmentConfig;
  breathingProgress: SharedValue<number>;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ config, breathingProgress }) => {
  const particles = useMemo(() => {
    const result = [];
    for (let i = 0; i < config.atmosphere.particleCount; i++) {
      result.push({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * SCREEN_HEIGHT,
        r: config.atmosphere.particleType === 'dust' ? 0.5 + Math.random() * 1.5 : 1 + Math.random() * 3,
        opacity: config.atmosphere.particleType === 'light' ? 0.3 + Math.random() * 0.7 : 0.1 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return result;
  }, [config.atmosphere.particleCount, config.atmosphere.particleType]);

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'dust': return '#666666';
      case 'energy': return config.lighting.primary.color;
      case 'light': return '#ffffff';
      case 'void': return '#000000';
      default: return '#ffffff';
    }
  };

  const animatedOpacity = useDerivedValue(() => {
    if (!config.effects.breathing) return 1;
    return 0.7 + Math.sin(breathingProgress.value * Math.PI) * 0.3;
  });

  return (
    <Group opacity={animatedOpacity.value}>
      {particles.map((particle) => {
        const animatedY = useDerivedValue(() => {
          if (!config.effects.floating) return particle.y;
          const time = breathingProgress.value * 2 + particle.phase;
          return particle.y + Math.sin(time) * 10;
        });

        const animatedOpacity = useDerivedValue(() => {
          if (!config.effects.pulsing) return particle.opacity;
          const time = breathingProgress.value * 3 + particle.phase;
          return particle.opacity * (0.5 + Math.sin(time) * 0.5);
        });

        return (
          <Circle
            key={particle.id}
            cx={particle.x}
            cy={animatedY.value}
            r={particle.r}
            color={getParticleColor(config.atmosphere.particleType)}
            opacity={animatedOpacity.value}
          />
        );
      })}
    </Group>
  );
};

interface LightingEngineProps {
  config: RoomEnvironmentConfig;
  breathingProgress: SharedValue<number>;
}

const LightingEngine: React.FC<LightingEngineProps> = ({ config, breathingProgress }) => {
  const primaryLightX = config.lighting.primary.position[0] * SCREEN_WIDTH;
  const primaryLightY = config.lighting.primary.position[1] * SCREEN_HEIGHT;

  const animatedIntensity = useDerivedValue(() => {
    if (!config.effects.breathing) return config.lighting.primary.intensity;
    return config.lighting.primary.intensity * (0.8 + Math.sin(breathingProgress.value * Math.PI) * 0.2);
  });

  const animatedRadius = useDerivedValue(() => {
    const baseRadius = SCREEN_WIDTH * 0.8;
    if (!config.effects.pulsing) return baseRadius;
    return baseRadius * (0.9 + Math.sin(breathingProgress.value * Math.PI * 2) * 0.1);
  });

  return (
    <Group>
      {/* Primary Light Source */}
      <Circle cx={primaryLightX} cy={primaryLightY} r={animatedRadius.value} opacity={animatedIntensity.value}>
        <RadialGradient
          c={vec(primaryLightX, primaryLightY)}
          r={SCREEN_WIDTH * 0.8}
          colors={[
            `${config.lighting.primary.color}88`,
            `${config.lighting.primary.color}44`,
            'transparent'
          ]}
        />
      </Circle>

      {/* Ambient Light */}
      <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} opacity={config.lighting.ambient.intensity}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(SCREEN_WIDTH, SCREEN_HEIGHT)}
          colors={[
            `${config.lighting.ambient.color}22`,
            `${config.lighting.ambient.color}11`,
            'transparent'
          ]}
        />
      </Rect>

      {/* Shadows (for lower levels) */}
      {config.lighting.shadows && (
        <Group>
          <Circle cx={SCREEN_WIDTH * 0.2} cy={SCREEN_HEIGHT * 0.8} r={100} opacity={0.3}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.2, SCREEN_HEIGHT * 0.8)}
              r={100}
              colors={['rgba(0,0,0,0.6)', 'transparent']}
            />
          </Circle>
          <Circle cx={SCREEN_WIDTH * 0.8} cy={SCREEN_HEIGHT * 0.6} r={80} opacity={0.2}>
            <RadialGradient
              c={vec(SCREEN_WIDTH * 0.8, SCREEN_HEIGHT * 0.6)}
              r={80}
              colors={['rgba(0,0,0,0.4)', 'transparent']}
            />
          </Circle>
        </Group>
      )}
    </Group>
  );
};

interface AtmosphereRendererProps {
  config: RoomEnvironmentConfig;
  breathingProgress: SharedValue<number>;
}

const AtmosphereRenderer: React.FC<AtmosphereRendererProps> = ({ config, breathingProgress }) => {
  const animatedFogOpacity = useDerivedValue(() => {
    if (!config.effects.breathing) return config.atmosphere.fogDensity;
    return config.atmosphere.fogDensity * (0.8 + Math.sin(breathingProgress.value * Math.PI) * 0.2);
  });

  return (
    <Group>
      {/* Base Atmosphere */}
      <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
        <RadialGradient
          c={vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
          r={SCREEN_WIDTH}
          colors={[
            config.atmosphere.baseColor,
            `${config.atmosphere.baseColor}aa`,
            `${config.atmosphere.baseColor}44`,
            '#000000'
          ]}
        />
      </Rect>

      {/* Fog Layer */}
      <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} opacity={animatedFogOpacity.value}>
        <LinearGradient
          start={vec(0, SCREEN_HEIGHT * 0.6)}
          end={vec(0, SCREEN_HEIGHT)}
          colors={[
            'transparent',
            `${config.atmosphere.baseColor}66`,
            `${config.atmosphere.baseColor}aa`
          ]}
        />
      </Rect>

      {/* Category-specific atmospheric effects */}
      {config.category === 'enlightenment' && (
        <Group blendMode="plus">
          <Circle cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT / 2} r={SCREEN_WIDTH * 0.6} opacity={0.1}>
            <RadialGradient
              c={vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
              r={SCREEN_WIDTH * 0.6}
              colors={['#ffffff', '#f0f0ff', 'transparent']}
            />
          </Circle>
        </Group>
      )}
    </Group>
  );
};

interface EnhancedRoomBackgroundProps {
  levelId: string;
  zoomLevel?: SharedValue<number>;
  cameraShift?: { x: SharedValue<number>; y: SharedValue<number> };
  scrollOffset?: SharedValue<number>;
}

export const EnhancedRoomBackground: React.FC<EnhancedRoomBackgroundProps> = ({
  levelId,
  zoomLevel,
  cameraShift,
  scrollOffset
}) => {
  const config = ROOM_CONFIGS[levelId] || ROOM_CONFIGS.courage; // Default fallback
  
  // Breathing animation - varies by level category
  const breathingProgress = useSharedValue(0);
  
  useEffect(() => {
    if (config.effects.breathing) {
      const duration = config.category === 'enlightenment' ? 8000 : 4000;
      breathingProgress.value = withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    }
  }, [config.effects.breathing, config.category]);

  // Room breathing effect
  const roomScale = useDerivedValue(() => {
    if (!config.effects.breathing) return 1;
    return 1 + Math.sin(breathingProgress.value * Math.PI) * 0.01;
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group transform={[{ scale: roomScale.value }]}>
          {/* Base Atmosphere */}
          <AtmosphereRenderer config={config} breathingProgress={breathingProgress} />
          
          {/* Lighting Engine */}
          <LightingEngine config={config} breathingProgress={breathingProgress} />
          
          {/* Particle System */}
          <ParticleSystem config={config} breathingProgress={breathingProgress} />
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  canvas: {
    flex: 1,
  }
});

export default EnhancedRoomBackground;