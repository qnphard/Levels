import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Platform } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G, Text as SvgText, Line, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

interface SegmentItem {
    id: string;
    title: string;
    isFoundation?: boolean;
}

interface MandalaBackgroundProps {
    width?: number;
    height?: number;
    innerRadius: number;
    outerRadius: number;
    centerLabel?: string;
    innerItems: SegmentItem[];
    outerItems: SegmentItem[];
    selectedId?: string;
    recommendedId?: string;
    completedIds?: string[];
    foundationIds?: string[];
}

// Premium mystical color palette - enriched for more vibrancy
const COLORS = {
    deepSpace: '#0a0e27',
    teal: '#2dd4bf', // Brighter teal
    purple: '#c084fc', // Brighter purple
    gold: '#fbbf24',
    goldLight: '#fef3c7',
    magenta: '#e879f9', // Brighter magenta
    rose: '#fb7185',
    textLight: '#e0f2fe',
    activeGlow: '#22d3ee',
    recommendGlow: '#fbbf24', // Pulsing gold for recommendations
    // compassLines removed
};

// Segment colors for visual variety - more saturated
const segmentColors = [
    { fill: 'rgba(45, 212, 191, 0.15)', stroke: '#2dd4bf' },
    { fill: 'rgba(192, 132, 252, 0.15)', stroke: '#c084fc' },
    { fill: 'rgba(251, 191, 36, 0.12)', stroke: '#fbbf24' },
    { fill: 'rgba(251, 113, 133, 0.12)', stroke: '#fb7185' },
    { fill: 'rgba(232, 121, 249, 0.12)', stroke: '#e879f9' },
    { fill: 'rgba(45, 212, 191, 0.12)', stroke: '#14b8a6' },
];

const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Create donut-wedge path
const createWedgePath = (cx: number, cy: number, r0: number, r1: number, a0Deg: number, a1Deg: number): string => {
    const a0 = degToRad(a0Deg);
    const a1 = degToRad(a1Deg);

    const outerStart = { x: cx + r1 * Math.cos(a0), y: cy + r1 * Math.sin(a0) };
    const outerEnd = { x: cx + r1 * Math.cos(a1), y: cy + r1 * Math.sin(a1) };
    const innerStart = { x: cx + r0 * Math.cos(a0), y: cy + r0 * Math.sin(a0) };
    const innerEnd = { x: cx + r0 * Math.cos(a1), y: cy + r0 * Math.sin(a1) };

    const largeArc = Math.abs(a1Deg - a0Deg) > 180 ? 1 : 0;

    return `M ${outerStart.x} ${outerStart.y} A ${r1} ${r1} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${r0} ${r0} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
};

// Smart text formatting
const formatTitle = (title: string): string[] => {
    const abbrevs: Record<string, string[]> = {
        'Preventing Stress at the Source': ['Preventing', 'Stress'],
        'Positive Re-programming': ['Positive', 'Reprogram'],
        'Fulfillment vs Satisfaction': ['Fulfillment', 'vs Satisf.'],
        'Fatigue vs Energy': ['Fatigue vs', 'Energy'],
        'Music as a Tool': ['Music as', 'a Tool'],
        'Feelings Explained': ['Feelings', 'Explained'],
        'Letting Go Basics': ['Letting Go', 'Basics'],
        'Natural Happiness': ['Natural', 'Happiness'],
        'Power vs Force': ['Power vs', 'Force'],
        'Non Reactivity': ['Non', 'Reactivity'],
        'Shadow Work': ['Shadow', 'Work'],
        'Levels of Truth': ['Levels of', 'Truth'],
    };

    if (abbrevs[title]) return abbrevs[title];
    if (!title) return [''];

    const words = title.split(' ');
    if (words.length === 1 || title.length < 10) return [title];

    const mid = Math.ceil(words.length / 2);
    if (words.includes('vs')) {
        const vsIdx = words.indexOf('vs');
        return [words.slice(0, vsIdx).join(' '), words.slice(vsIdx).join(' ')];
    }

    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

const MandalaBackground: React.FC<MandalaBackgroundProps> = ({
    width = Dimensions.get('window').width,
    height = Dimensions.get('window').height,
    innerRadius,
    outerRadius,
    centerLabel = 'What You Really Are',
    innerItems,
    outerItems,
    selectedId,
    recommendedId,
    completedIds = [],
    foundationIds = [],
}) => {
    const cx = width / 2;
    const cy = height / 2;

    const pulseAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const auraRotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (Platform.OS === 'android') return; // Disable complex ambient animations on Android for performance

        // Breathing pulse for glows
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2500, // Faster pulse
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Slow ambient rotation for aura
        Animated.loop(
            Animated.timing(auraRotateAnim, {
                toValue: 1,
                duration: 40000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // Visual Scales
    const centerRadius = width * 0.12;
    const innerGap = width * 0.025;
    const innerR0 = centerRadius + innerGap;
    const innerR1 = innerRadius - (width * 0.02);
    const outerR0 = innerRadius + (width * 0.012);
    const outerR1 = outerRadius;

    const innerTextRadius = (innerR0 + innerR1) / 2;
    const outerTextRadius = (outerR0 + outerR1) / 2;

    const startAngle = -90;

    const innerSegments = useMemo(() => {
        const step = 360 / innerItems.length;
        return innerItems.map((item, i) => {
            const a0 = startAngle + i * step;
            const a1 = a0 + step - 2.5;
            const midAngle = a0 + step / 2;
            const rad = degToRad(midAngle);
            const isSelected = selectedId === item.id;
            const isFoundation = foundationIds.includes(item.id);
            const isRecommended = recommendedId === item.id;
            const isCompleted = completedIds.includes(item.id);

            return {
                ...item,
                path: createWedgePath(cx, cy, innerR0, innerR1, a0, a1),
                color: segmentColors[(i + 1) % segmentColors.length],
                isSelected,
                isRecommended,
                isCompleted,
                isFoundation,
                textX: cx + innerTextRadius * Math.cos(rad),
                textY: cy + innerTextRadius * Math.sin(rad),
                lines: formatTitle(item.title),
            };
        });
    }, [innerItems, innerR0, innerR1, cx, cy, selectedId, foundationIds, innerTextRadius, recommendedId, completedIds]);

    const outerSegments = useMemo(() => {
        const step = 360 / outerItems.length;
        return outerItems.map((item, i) => {
            const a0 = startAngle + i * step;
            const a1 = a0 + step - 1.5;
            const midAngle = a0 + step / 2;
            const rad = degToRad(midAngle);
            const isSelected = selectedId === item.id;
            const isFoundation = foundationIds.includes(item.id);
            const isRecommended = recommendedId === item.id;
            const isCompleted = completedIds.includes(item.id);

            return {
                ...item,
                path: createWedgePath(cx, cy, outerR0, outerR1, a0, a1),
                color: segmentColors[i % segmentColors.length],
                isSelected,
                isRecommended,
                isCompleted,
                isFoundation,
                textX: cx + outerTextRadius * Math.cos(rad),
                textY: cy + outerTextRadius * Math.sin(rad),
                lines: formatTitle(item.title),
            };
        });
    }, [outerItems, outerR0, outerR1, cx, cy, selectedId, foundationIds, outerTextRadius, recommendedId, completedIds]);

    const auraSpin = auraRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            <Svg width={width} height={height}>
                <Defs>
                    <RadialGradient id="auraGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.2" />
                        <Stop offset="70%" stopColor={COLORS.teal} stopOpacity="0.1" />
                        <Stop offset="100%" stopColor={COLORS.deepSpace} stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="foundationGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.3" />
                        <Stop offset="100%" stopColor={COLORS.gold} stopOpacity="0.1" />
                    </RadialGradient>
                    <RadialGradient id="selectionGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.activeGlow} stopOpacity="0.7" />
                        <Stop offset="100%" stopColor={COLORS.activeGlow} stopOpacity="0.2" />
                    </RadialGradient>
                    <RadialGradient id="recommendPulseGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={COLORS.recommendGlow} stopOpacity="0.5" />
                        <Stop offset="100%" stopColor={COLORS.recommendGlow} stopOpacity="0" />
                    </RadialGradient>
                    {Platform.OS === 'ios' && (
                        <Filter id="glow">
                            <FeGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <FeMerge>
                                <FeMergeNode in="coloredBlur" />
                                <FeMergeNode in="SourceGraphic" />
                            </FeMerge>
                        </Filter>
                    )}
                </Defs>

                {/* Background Aura */}
                <AnimatedG
                    rotation={auraRotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 360],
                    })}
                    originX={cx}
                    originY={cy}
                >
                    <Circle cx={cx} cy={cy} r={outerR1 * 1.5} fill="url(#auraGlow)" />
                    {/* Decorative stars */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                        const rad = degToRad(angle);
                        const r = outerR1 * 1.2;
                        return (
                            <Circle
                                key={angle}
                                cx={cx + r * Math.cos(rad)}
                                cy={cy + r * Math.sin(rad)}
                                r={1.5}
                                fill={COLORS.gold}
                                opacity={0.4}
                            />
                        );
                    })}
                </AnimatedG>

                {/* OUTER RING */}
                {outerSegments.map((seg, i) => {
                    const strokeColor = seg.isSelected ? COLORS.activeGlow : seg.isFoundation ? COLORS.gold : seg.color.stroke;
                    const strokeWidth = seg.isSelected ? 3.5 : seg.isFoundation ? 2 : 1;

                    return (
                        <G key={`outer-${i}`}>
                            {seg.isSelected && Platform.OS === 'ios' && (
                                <AnimatedG
                                    opacity={pulseAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.4, 0.8],
                                    })}
                                >
                                    <Path
                                        d={seg.path}
                                        fill="none"
                                        stroke={COLORS.activeGlow}
                                        strokeWidth={10}
                                        strokeOpacity={0.2}
                                        filter="url(#glow)"
                                    />
                                </AnimatedG>
                            )}
                            {seg.isSelected && Platform.OS === 'android' && (
                                <Path
                                    d={seg.path}
                                    fill="none"
                                    stroke={COLORS.activeGlow}
                                    strokeWidth={4}
                                    strokeOpacity={0.3}
                                />
                            )}
                            <Path
                                d={seg.path}
                                fill={seg.isSelected ? 'url(#selectionGlow)' : seg.isFoundation ? 'url(#foundationGlow)' : seg.color.fill}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeOpacity={seg.isSelected ? 1 : seg.isFoundation ? 0.6 : 0.3}
                            />

                            {seg.isRecommended && (
                                <AnimatedG
                                    opacity={pulseAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.2, 0.7],
                                    })}
                                >
                                    <Path
                                        d={seg.path}
                                        fill="url(#recommendPulseGlow)"
                                        stroke={COLORS.gold}
                                        strokeWidth={2}
                                    />
                                </AnimatedG>
                            )}

                            {seg.lines.map((line, li) => (
                                <SvgText
                                    key={`ot-${i}-${li}`}
                                    x={seg.textX}
                                    y={seg.textY + (li - (seg.lines.length - 1) / 2) * 12}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill={seg.isFoundation ? COLORS.goldLight : COLORS.textLight}
                                    fontSize={9.5}
                                    fontWeight={seg.isFoundation || seg.isSelected ? "700" : "500"}
                                    opacity={seg.isSelected ? 1 : 0.85}
                                >
                                    {line}
                                </SvgText>
                            ))}
                        </G>
                    );
                })}

                {/* INNER RING */}
                {innerSegments.map((seg, i) => {
                    const strokeColor = seg.isSelected ? COLORS.activeGlow : seg.isFoundation ? COLORS.gold : seg.color.stroke;
                    const strokeWidth = seg.isSelected ? 3.5 : seg.isFoundation ? 2 : 1;

                    return (
                        <G key={`inner-${i}`}>
                            {seg.isSelected && Platform.OS === 'ios' && (
                                <AnimatedG
                                    opacity={pulseAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.4, 0.8],
                                    })}
                                >
                                    <Path
                                        d={seg.path}
                                        fill="none"
                                        stroke={COLORS.activeGlow}
                                        strokeWidth={10}
                                        strokeOpacity={0.2}
                                        filter="url(#glow)"
                                    />
                                </AnimatedG>
                            )}
                            {seg.isSelected && Platform.OS === 'android' && (
                                <Path
                                    d={seg.path}
                                    fill="none"
                                    stroke={COLORS.activeGlow}
                                    strokeWidth={4}
                                    strokeOpacity={0.3}
                                />
                            )}
                            <Path
                                d={seg.path}
                                fill={seg.isSelected ? 'url(#selectionGlow)' : seg.isFoundation ? 'url(#foundationGlow)' : seg.color.fill}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeOpacity={seg.isSelected ? 1 : seg.isFoundation ? 0.6 : 0.3}
                            />

                            {seg.isRecommended && (
                                <AnimatedG
                                    opacity={pulseAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.2, 0.7],
                                    })}
                                >
                                    <Path
                                        d={seg.path}
                                        fill="url(#recommendPulseGlow)"
                                        stroke={COLORS.gold}
                                        strokeWidth={2}
                                    />
                                </AnimatedG>
                            )}

                            {seg.lines.map((line, li) => (
                                <SvgText
                                    key={`it-${i}-${li}`}
                                    x={seg.textX}
                                    y={seg.textY + (li - (seg.lines.length - 1) / 2) * 11}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill={seg.isFoundation ? COLORS.goldLight : COLORS.textLight}
                                    fontSize={9}
                                    fontWeight={seg.isFoundation || seg.isSelected ? "700" : "500"}
                                    opacity={seg.isSelected ? 1 : 0.85}
                                >
                                    {line}
                                </SvgText>
                            ))}
                        </G>
                    );
                })}

                {/* CENTER NODE */}
                <G>
                    {/* Pulsing center glow */}
                    <AnimatedG
                        opacity={pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 0.6],
                        })}
                    >
                        <Circle cx={cx} cy={cy} r={centerRadius + 5} fill="url(#foundationGlow)" />
                    </AnimatedG>

                    <Circle
                        cx={cx} cy={cy} r={centerRadius}
                        fill="url(#foundationGlow)"
                        stroke={COLORS.gold}
                        strokeWidth={2}
                        strokeOpacity={0.4}
                    />

                    {formatTitle(centerLabel).map((line, i, arr) => (
                        <SvgText
                            key={`center-${i}`}
                            x={cx}
                            y={cy + (i - (arr.length - 1) / 2) * 13}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill={COLORS.goldLight}
                            fontSize={10.5}
                            fontWeight="700"
                            letterSpacing={0.5}
                        >
                            {line}
                        </SvgText>
                    ))}
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default React.memo(MandalaBackground);
