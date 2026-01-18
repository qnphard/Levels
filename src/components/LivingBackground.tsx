import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, Dimensions } from 'react-native';
import {
    Canvas,
    Shader,
    Skia,
    Fill,
    vec,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    useDerivedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// GLSL Shader for "Living Atmosphere"
// Features:
// - Slowly shifting plasma/fog effect
// - Dithering noise to prevent color banding
// - Deep, premium color palette matched to the theme
const source = Skia.RuntimeEffect.Make(`
uniform float u_time;
uniform vec2 u_resolution;

// Simple hash for noise
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec4 main(vec2 xy) {
    vec2 st = xy / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    st.x *= ratio;

    // Slow time
    float t = u_time * 0.15;

    // Base deep background color (Deepest Purple-Black #070812)
    vec3 color = vec3(0.027, 0.031, 0.071);

    // Generate two shifting "fog" layers
    vec2 pos1 = st + vec2(cos(t * 0.3), sin(t * 0.2)) * 0.2;
    vec2 pos2 = st + vec2(sin(t * 0.4), cos(t * 0.3)) * 0.3;

    float n1 = noise(pos1 * 3.0 + t);
    float n2 = noise(pos2 * 2.5 - t * 0.5);

    // Combine noise for organic movement
    float fog = mix(n1, n2, 0.5);
    
    // Soft pulses of "Bio-luminescent" Violet (#2E1F45) and Deep Teal
    vec3 pulse1 = vec3(0.18, 0.12, 0.27);
    vec3 pulse2 = vec3(0.05, 0.15, 0.20);
    
    // Breathe effect: modulate intensity
    float breathe = 0.5 + 0.5 * sin(t * 0.8);
    
    // Mix colors based on noise
    color = mix(color, pulse1, fog * 0.4 * breathe);
    color = mix(color, pulse2, (1.0 - fog) * 0.3);

    // Vignette - darker at edges
    vec2 uv = xy / u_resolution.xy;
    float dist = distance(uv, vec2(0.5));
    color *= smoothstep(1.0, 0.2, dist);

    // Add subtle grain to prevent banding (Dithering)
    float grain = random(xy + u_time) * 0.03;
    color += grain;

    return vec4(color, 1.0);
}
`)!;

interface LivingBackgroundProps {
    style?: ViewStyle;
}

export const LivingBackground: React.FC<LivingBackgroundProps> = ({ style }) => {
    const time = useSharedValue(0);

    useEffect(() => {
        time.value = withRepeat(
            withTiming(100, { duration: 100000, easing: Easing.linear }),
            -1
        );
    }, []);

    const uniforms = useDerivedValue(() => {
        return {
            u_time: time.value,
            u_resolution: vec(width, height),
        };
    });

    if (!source) {
        return null; // Fallback or Error boundary
    }

    return (
        <Canvas style={[StyleSheet.absoluteFill, style]}>
            <Fill>
                <Shader source={source} uniforms={uniforms} />
            </Fill>
        </Canvas>
    );
};
