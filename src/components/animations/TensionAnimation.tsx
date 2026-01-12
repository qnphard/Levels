import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
    Path,
    Defs,
    RadialGradient,
    Stop,
    G,
    Circle,
    Rect
} from 'react-native-svg';

const ANIMATION_SIZE = 300;
const CENTER = ANIMATION_SIZE / 2;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const COLORS = {
    tensionCore: '#BE123C',
    tensionInteract: '#F43F5E',
    tensionOuter: '#FDA4AF',
    releaseCore: '#6366F1',
    releaseFlow: '#A5B4FC',
    releaseGlow: '#E0E7FF',
};

export default function TensionAnimation({ autoPlay = true }: { autoPlay?: boolean }) {
    const tensionLevel = useRef(new Animated.Value(0)).current;
    const vibration = useRef(new Animated.Value(0)).current;
    const rotateKnots = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!autoPlay) return;

        Animated.loop(
            Animated.timing(rotateKnots, {
                toValue: 1,
                duration: 12000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                // TIGHTEN
                Animated.parallel([
                    Animated.timing(tensionLevel, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(vibration, { toValue: 5, duration: 50, useNativeDriver: false }),
                            Animated.timing(vibration, { toValue: -5, duration: 50, useNativeDriver: false }),
                        ]),
                        { iterations: 20 }
                    )
                ]),
                Animated.delay(1000),
                // RELEASE
                Animated.timing(tensionLevel, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.out(Easing.bounce),
                    useNativeDriver: false,
                }),
                Animated.delay(1000),
            ])
        ).start();
    }, [autoPlay]);

    const knotStrands = useMemo(() => {
        return [0, 1, 2, 3, 4, 5].map(i => ({
            angleOffset: i * 60,
        }));
    }, []);

    const coreColor = tensionLevel.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.releaseCore, COLORS.tensionCore]
    });

    const outerColor = tensionLevel.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.releaseFlow, COLORS.tensionInteract]
    });

    return (
        <View
            style={styles.container}
            renderToHardwareTextureAndroid={true}
            shouldRasterizeIOS={true}
        >
            <Svg width={ANIMATION_SIZE} height={ANIMATION_SIZE}>
                <Defs>
                    <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.releaseGlow} stopOpacity="0.5" />
                        <Stop offset="100%" stopColor={COLORS.releaseCore} stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="tensionGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.tensionOuter} stopOpacity="0.6" />
                        <Stop offset="100%" stopColor={COLORS.tensionCore} stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* 1. Background Glows */}
                <AnimatedCircle
                    cx={CENTER} cy={CENTER} r={90}
                    fill="url(#coreGlow)"
                    opacity={Animated.multiply(0.4, tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }))}
                    scale={tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [1.2, 0.8] })}
                />
                <AnimatedCircle
                    cx={CENTER} cy={CENTER} r={90}
                    fill="url(#tensionGlow)"
                    opacity={Animated.multiply(0.4, tensionLevel)}
                    scale={tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [1.2, 0.8] })}
                />

                {/* 2. The Energy Knot */}
                <AnimatedG
                    translateX={CENTER}
                    translateY={CENTER}
                    rotation={rotateKnots.interpolate({ inputRange: [0, 1], outputRange: [0, 360] })}
                >
                    {knotStrands.map((k, i) => (
                        <AnimatedG
                            key={`strand-${i}`}
                            rotation={k.angleOffset}
                            translateX={Animated.multiply(tensionLevel, vibration)}
                            translateY={Animated.multiply(tensionLevel, vibration)}
                        >
                            {/* Connection Line (using Rect for robustness) */}
                            {/* Connects center (0,0) to start of strand */}
                            <AnimatedRect
                                x="0"
                                y="-1.5"
                                width={tensionLevel.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [40, 10]
                                })}
                                height="3"
                                fill={outerColor}
                                opacity={0.6}
                                rx="1.5"
                            />

                            {/* Strand Shape */}
                            <AnimatedG
                                translateX={tensionLevel.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [40, 10]
                                })}
                            >
                                {/* The Tip */}
                                <AnimatedCircle
                                    r={tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [8, 4] })}
                                    fill={outerColor}
                                />
                                {/* The S-Curve */}
                                <AnimatedPath
                                    d="M 0 0 C 20 -20, 40 20, 60 0" // Fixed path string
                                    stroke={outerColor}
                                    strokeWidth={3}
                                    fill="none"
                                    scale={tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] })}
                                    opacity={0.8}
                                />
                            </AnimatedG>
                        </AnimatedG>
                    ))}
                </AnimatedG>

                {/* 3. Central Core Node */}
                <AnimatedCircle
                    cx={CENTER}
                    cy={CENTER}
                    r={tensionLevel.interpolate({ inputRange: [0, 1], outputRange: [15, 25] })}
                    fill={coreColor}
                    translateX={Animated.multiply(tensionLevel, vibration)}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: ANIMATION_SIZE,
        height: ANIMATION_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
});
