import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedProps,
    withSpring,
    withTiming,
    Easing,
    runOnJS,
    interpolateColor,
} from 'react-native-reanimated';
import Svg, { Path, G, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIZE = SCREEN_WIDTH * 0.8;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ResistanceMelter() {
    const theme = useThemeColors();
    const [isMelted, setIsMelted] = useState(false);
    const progress = useSharedValue(0); // 0 to 1
    const scale = useSharedValue(1);

    const longPressGesture = Gesture.LongPress()
        .minDuration(50)
        .onStart(() => {
            scale.value = withSpring(0.95);
            progress.value = withTiming(1, {
                duration: 4000,
                easing: Easing.bezier(0.4, 0, 0.2, 1)
            }, (finished) => {
                if (finished) {
                    runOnJS(setIsMelted)(true);
                }
            });
        })
        .onEnd(() => {
            scale.value = withSpring(1);
            if (progress.value < 1) {
                progress.value = withTiming(0, { duration: 1000 });
            }
        });

    const knotProps = useAnimatedProps(() => ({
        opacity: 1 - progress.value * 0.8,
        rotation: progress.value * 45,
        originX: SIZE / 2,
        originY: SIZE / 2,
    }));

    const glowProps = useAnimatedProps(() => ({
        opacity: progress.value,
        scale: progress.value * 1.5 + 0.5,
        originX: SIZE / 2,
        originY: SIZE / 2,
    }));

    const successProps = useAnimatedProps(() => ({
        opacity: progress.value >= 1 ? 1 : 0,
        translateY: progress.value >= 1 ? 0 : 20,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: 0.8 - progress.value * 0.5,
    }));

    return (
        <View style={styles.container}>
            <GestureDetector gesture={longPressGesture}>
                <Animated.View style={[styles.touchZone, { transform: [{ scale: scale.value }] }]}>
                    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <Defs>
                            <RadialGradient id="meltGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                                <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.8" />
                                <Stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>

                        {/* Background Aura */}
                        <AnimatedCircle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={SIZE / 3}
                            fill="url(#meltGlow)"
                            animatedProps={glowProps}
                        />

                        {/* The "Knot" (Simplified with overlapping distorted paths) */}
                        <AnimatedG animatedProps={knotProps}>
                            <Path
                                d={`M ${SIZE / 2 - 40} ${SIZE / 2} Q ${SIZE / 2} ${SIZE / 2 - 80} ${SIZE / 2 + 40} ${SIZE / 2} T ${SIZE / 2 - 40} ${SIZE / 2}`}
                                stroke={theme.textSecondary}
                                strokeWidth={4}
                                fill="none"
                            />
                            <Path
                                d={`M ${SIZE / 2} ${SIZE / 2 - 40} Q ${SIZE / 2 + 80} ${SIZE / 2} ${SIZE / 2} ${SIZE / 2 + 40} T ${SIZE / 2} ${SIZE / 2 - 40}`}
                                stroke={theme.textSecondary}
                                strokeWidth={3}
                                opacity={0.6}
                                fill="none"
                            />
                            <Path
                                d={`M ${SIZE / 2 - 30} ${SIZE / 2 - 30} L ${SIZE / 2 + 30} ${SIZE / 2 + 30} M ${SIZE / 2 + 30} ${SIZE / 2 - 30} L ${SIZE / 2 - 30} ${SIZE / 2 + 30}`}
                                stroke={theme.textSecondary}
                                strokeWidth={2}
                                opacity={0.4}
                            />
                        </AnimatedG>

                        {/* Success Symbol */}
                        <AnimatedG animatedProps={successProps}>
                            <Circle cx={SIZE / 2} cy={SIZE / 2} r={30} fill={theme.primary} />
                            <Path
                                d={`M ${SIZE / 2 - 10} ${SIZE / 2} L ${SIZE / 2 - 3} ${SIZE / 2 + 7} L ${SIZE / 2 + 10} ${SIZE / 2 - 7}`}
                                stroke="#FFF"
                                strokeWidth={4}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </AnimatedG>
                    </Svg>

                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <View style={styles.contentContainer}>
                            {!isMelted ? (
                                <Animated.View style={[styles.labelBox, textStyle]}>
                                    <Text style={[styles.label, { color: theme.textPrimary }]}>Press & Hold</Text>
                                    <Text style={[styles.subLabel, { color: theme.textSecondary }]}>to melt resistance</Text>
                                </Animated.View>
                            ) : (
                                <Animated.View style={styles.labelBox}>
                                    <Text style={[styles.label, { color: theme.primary, fontWeight: '700' }]}>Released</Text>
                                    <TouchableOpacity onPress={() => { setIsMelted(false); progress.value = withTiming(0); }}>
                                        <Text style={[styles.resetText, { color: theme.textSecondary }]}>Reset</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.lg,
    },
    touchZone: {
        width: SIZE,
        height: SIZE,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelBox: {
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
    },
    subLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    resetText: {
        fontSize: 12,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});
