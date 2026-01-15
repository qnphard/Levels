import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Defs, RadialGradient, Stop, Circle as SvgCircle } from 'react-native-svg';
import { ConsciousnessLevel } from '../types';
import { ConstellationNode } from './ConstellationNode';
import { useThemeColors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Node positions mapped by level (lower = bottom, higher = top)
const getNodePosition = (level: number, index: number, total: number): { x: number; y: number } => {
    // Normalize level (20-700) to y position (bottom to top)
    const minLevel = 20;
    const maxLevel = 700;
    const normalizedY = 1 - (level - minLevel) / (maxLevel - minLevel);

    // Vertical layout with alternating horizontal offset for clarity
    const baseX = width / 2;
    // Alternate left/right with some sine variation for organic feel
    const xOffset = (index % 2 === 0 ? -1 : 1) * 70 + Math.sin(index * 0.7) * 40;

    return {
        x: baseX + xOffset,
        y: 80 + normalizedY * (height - 200), // Maximize vertical span
    };
};

// Zone colors for accent
const ZONE_COLORS: Record<string, string> = {
    'Heavy Weather': '#6B21A8',
    'Stuckness': '#7C3AED',
    'Stabilization': '#059669',
    'Openness': '#2563EB',
};

interface ConstellationMapViewProps {
    levels: ConsciousnessLevel[];
    unlockedLevels: string[];
    completedLevels: string[];
    currentLevel?: string;
    onPressLevel: (level: ConsciousnessLevel) => void;
}

export const ConstellationMapView: React.FC<ConstellationMapViewProps> = ({
    levels,
    unlockedLevels,
    completedLevels,
    currentLevel,
    onPressLevel,
}) => {
    const theme = useThemeColors();
    const starFieldAnim = useRef(new Animated.Value(0)).current;
    const orbitAnim = useRef(new Animated.Value(0)).current;

    // Ambient animations
    useEffect(() => {
        // Star field subtle movement
        Animated.loop(
            Animated.timing(starFieldAnim, {
                toValue: 1,
                duration: 60000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Slow rotation for the whole map
        Animated.loop(
            Animated.timing(orbitAnim, {
                toValue: 1,
                duration: 120000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const starScale = starFieldAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.1, 1],
    });

    // Calculate node positions
    const nodePositions = useMemo(() => {
        return levels.map((lvl: ConsciousnessLevel, index: number) => ({
            level: lvl,
            ...getNodePosition(lvl.level, index, levels.length),
        }));
    }, [levels]);

    // Generate random stars for background
    const stars = useMemo(() => {
        const starArray = [];
        for (let i = 0; i < 60; i++) {
            starArray.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
            });
        }
        return starArray;
    }, []);

    return (
        <View style={styles.container}>
            {/* Deep space gradient background */}
            <LinearGradient
                colors={['#050510', '#0a0a1a', '#050510']}
                style={StyleSheet.absoluteFill}
            />

            {/* Ambient Center Glow */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width={width} height={height}>
                    <Defs>
                        <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="rgba(139,92,246,0.15)" />
                            <Stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </RadialGradient>
                    </Defs>
                    <SvgCircle cx={width / 2} cy={height / 2} r={width / 2} fill="url(#bgGlow)" />
                </Svg>
            </View>

            {/* Star field layer */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { transform: [{ scale: starScale }] }
                ]}
            >
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                    {stars.map((star, i) => (
                        <SvgCircle
                            key={i}
                            cx={star.x}
                            cy={star.y}
                            r={star.size}
                            fill={`rgba(255, 255, 255, ${star.opacity})`}
                        />
                    ))}
                </Svg>
            </Animated.View>

            {/* Central Prism & Paths Layer */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                    <Defs>
                        <RadialGradient id="prismGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="rgba(139,92,246,0.4)" />
                            <Stop offset="70%" stopColor="rgba(139,92,246,0.1)" />
                            <Stop offset="100%" stopColor="rgba(139,92,246,0)" />
                        </RadialGradient>
                    </Defs>
                    {/* Path lines connecting adjacent levels */}
                    {nodePositions.map((pos: { level: ConsciousnessLevel; x: number; y: number }, i: number) => {
                        if (i === 0) return null;
                        const prev = nodePositions[i - 1];
                        const bothUnlocked = unlockedLevels.includes(pos.level.id) && unlockedLevels.includes(prev.level.id);

                        return (
                            <Line
                                key={`link-${i}`}
                                x1={prev.x}
                                y1={prev.y}
                                x2={pos.x}
                                y2={pos.y}
                                stroke={bothUnlocked ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)"}
                                strokeWidth={bothUnlocked ? 1.5 : 0.5}
                                strokeDasharray={bothUnlocked ? "0" : "4,6"}
                            />
                        );
                    })}
                </Svg>
            </View>

            {/* Constellation Nodes */}
            {nodePositions.map(({ level, x, y }: { level: ConsciousnessLevel; x: number; y: number }) => (
                <ConstellationNode
                    key={level.id}
                    level={level}
                    x={x}
                    y={y}
                    isUnlocked={unlockedLevels.includes(level.id)}
                    isCompleted={completedLevels.includes(level.id)}
                    isCurrent={currentLevel === level.id}
                    onPress={() => onPressLevel(level)}
                    accentColor={ZONE_COLORS[level.zone] || '#8B5CF6'}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050510',
    },
});

export default ConstellationMapView;
