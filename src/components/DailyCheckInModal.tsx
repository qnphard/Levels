import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolateColor } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, useThemeMode, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { Zone } from '../store/onboardingStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.55;

const ZONES = [
    { zone: Zone.Shame, label: 'Shame', color: '#4A1A4A', relatable: ['Humiliation', 'Worthlessness', 'Withdrawal'] },
    { zone: Zone.Guilt, label: 'Guilt', color: '#1E3A3A', relatable: ['Regret', 'Self-Blame', 'Remorse'] },
    { zone: Zone.Apathy, label: 'Apathy', color: '#3A3A3A', relatable: ['Numbness', 'Despair', 'Hopelessness'] },
    { zone: Zone.Grief, label: 'Grief', color: '#1E2B4E', relatable: ['Sadness', 'Loss', 'Regret'] },
    { zone: Zone.Fear, label: 'Fear', color: '#6B0000', relatable: ['Anxiety', 'Worry', 'Panic'] },
    { zone: Zone.Desire, label: 'Desire', color: '#8B4513', relatable: ['Craving', 'Lust', 'Obsession'] },
    { zone: Zone.Anger, label: 'Anger', color: '#B22222', relatable: ['Frustration', 'Resentment', 'Hate'] },
    { zone: Zone.Pride, label: 'Pride', color: '#7C3AED', relatable: ['Ego', 'Arrogance', 'Superiority'] },
];

const GRADIENT_COLORS = ZONES.map(z => z.color).reverse() as [string, string, ...string[]];
const ROW_HEIGHT = SLIDER_HEIGHT / ZONES.length;

const INTERPOLATION_BREAKPOINTS = [...ZONES].reverse().map((_, i) => i * ROW_HEIGHT + ROW_HEIGHT / 2);
const INTERPOLATION_COLORS = ZONES.map(z => z.color).reverse();

// Map Zone enum to level IDs from levels.ts
const ZONE_TO_LEVEL_ID: Record<Zone, string | null> = {
    [Zone.Shame]: 'shame',
    [Zone.Guilt]: 'guilt',
    [Zone.Apathy]: 'apathy',
    [Zone.Grief]: 'grief',
    [Zone.Fear]: 'fear',
    [Zone.Desire]: 'desire',
    [Zone.Anger]: 'anger',
    [Zone.Pride]: 'pride',
    [Zone.Pivot]: 'courage',
    [Zone.Flow]: 'love',
    [Zone.Source]: 'peace',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DailyCheckInModalProps {
    visible: boolean;
    onClose: () => void;
}

const DailyCheckInModal = ({ visible, onClose }: DailyCheckInModalProps) => {
    const theme = useThemeColors();
    const mode = useThemeMode();
    const navigation = useNavigation<NavigationProp>();
    const addCheckIn = useUserStore((s) => s.addCheckIn);
    const [selectedIndex, setSelectedIndex] = useState(ZONES.length - 1);

    const sliderY = useSharedValue((ZONES.length - 1) * ROW_HEIGHT + ROW_HEIGHT / 2);

    const updateIndex = (y: number) => {
        const idx = Math.floor(y / ROW_HEIGHT);
        const clampedIdx = Math.max(0, Math.min(ZONES.length - 1, idx));
        setSelectedIndex(clampedIdx);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            'worklet';
            const newY = Math.max(0, Math.min(SLIDER_HEIGHT, e.y));
            sliderY.value = newY;
            runOnJS(updateIndex)(newY);
        })
        .onEnd(() => {
            'worklet';
            const idx = Math.floor(sliderY.value / ROW_HEIGHT);
            const clampedIdx = Math.max(0, Math.min(ZONES.length - 1, idx));
            sliderY.value = withSpring(clampedIdx * ROW_HEIGHT + ROW_HEIGHT / 2);
        });

    const indicatorStyle = useAnimatedStyle(() => ({
        top: sliderY.value - 12,
    }));

    const bgGlowStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            sliderY.value,
            INTERPOLATION_BREAKPOINTS,
            INTERPOLATION_COLORS
        );
        return {
            backgroundColor: color,
            opacity: mode === 'dark' ? 0.55 : 0.35,
        };
    });

    const handleConfirm = () => {
        const reversedZones = [...ZONES].reverse();
        const selectedZone = reversedZones[selectedIndex].zone;
        addCheckIn(selectedZone);
        onClose();

        // Navigate to the matching level chapter
        const levelId = ZONE_TO_LEVEL_ID[selectedZone];
        if (levelId) {
            navigation.navigate('LevelChapter', { levelId, initialView: 'overview' });
        }
    };

    if (!visible) return null;

    const displayZones = [...ZONES].reverse();
    const currentZone = displayZones[selectedIndex];

    return (
        <View style={StyleSheet.absoluteFill}>
            <BlurView intensity={mode === 'dark' ? 50 : 80} tint={mode} style={StyleSheet.absoluteFill}>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <Animated.View style={[StyleSheet.absoluteFill, bgGlowStyle]} />
                    <TouchableOpacity activeOpacity={1} style={styles.header}>
                        <Text style={[styles.title, { color: theme.textPrimary }]}>Where is your energy landing?</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>A momentary pulse check</Text>
                    </TouchableOpacity>

                    <View style={styles.sliderRow}>
                        <View style={styles.labelColumn}>
                            {displayZones.map((z, i) => (
                                <View key={z.zone} style={styles.labelCell}>
                                    <Text style={[
                                        styles.labelHawkins,
                                        { color: theme.textSecondary, opacity: 0.8 },
                                        selectedIndex === i ? { color: theme.textPrimary, fontWeight: typography.bold, opacity: 1 } : null
                                    ]}>
                                        {z.label.toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <GestureDetector gesture={panGesture}>
                            <View style={styles.trackWrapper}>
                                <LinearGradient
                                    colors={GRADIENT_COLORS}
                                    style={styles.track}
                                />
                                <Animated.View style={[
                                    styles.indicator,
                                    indicatorStyle,
                                    {
                                        backgroundColor: theme.surface,
                                        borderColor: theme.border,
                                        shadowColor: currentZone.color,
                                    }
                                ]}>
                                    <View style={[styles.indicatorInner, { backgroundColor: currentZone.color, width: 10, height: 10, borderRadius: 5 }]} />
                                </Animated.View>
                            </View>
                        </GestureDetector>

                        <View style={styles.relatableColumn}>
                            {displayZones.map((z, i) => (
                                <View key={z.zone} style={styles.labelCell}>
                                    <Text
                                        style={[
                                            styles.labelRelatable,
                                            { color: theme.textSecondary, opacity: 0.8 },
                                            selectedIndex === i ? { color: theme.textPrimary, fontWeight: typography.semibold, opacity: 1 } : null
                                        ]}
                                    >
                                        {z.relatable.join(' · ')}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
                            onPress={handleConfirm}
                        >
                            <Text style={[styles.confirmText, { color: theme.primaryContrast }]}>Acknowledge</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                            <Text style={[styles.skipText, { color: theme.textSecondary, opacity: 0.8 }]}>Just Browsing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: typography.bold,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: typography.regular,
        textAlign: 'center',
        marginTop: 10,
    },
    sliderRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    labelColumn: {
        flex: 1,
        height: SLIDER_HEIGHT,
    },
    labelCell: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
    },
    labelHawkins: {
        fontSize: 16,
        fontWeight: typography.medium,
        textAlign: 'right',
        paddingRight: 12,
    },
    trackWrapper: {
        width: 50,
        height: SLIDER_HEIGHT,
        alignItems: 'center',
    },
    track: {
        width: 6,
        height: SLIDER_HEIGHT,
        borderRadius: 3,
        shadowColor: '#ffffff',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    indicator: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ffffff', // Will override inline for better color
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 12,
    },
    indicatorInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    relatableColumn: {
        flex: 2,
        height: SLIDER_HEIGHT,
        paddingLeft: 12,
    },
    labelRelatable: {
        fontSize: 14,
        fontWeight: typography.regular,
        lineHeight: 18,
    },
    footer: {
        width: '100%',
        paddingBottom: 85, // Account for absolute tab bar (70px)
        gap: 16,
    },
    confirmButton: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 1,
    },
    confirmText: {
        fontSize: 18,
        fontWeight: typography.semibold,
    },
    skipButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    skipText: {
        fontSize: 16,
        fontWeight: typography.regular,
    },
});

export default DailyCheckInModal;
