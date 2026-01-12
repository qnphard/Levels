import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolateColor } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, useThemeMode, typography } from '../../theme/colors';
import { useOnboardingStore, Zone } from '../../store/onboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SpectrumCheck'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDER_HEIGHT = SCREEN_HEIGHT * 0.5;

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

// Precompute interpolation arrays for performance
const INTERPOLATION_BREAKPOINTS = [...ZONES].reverse().map((_, i) => i * ROW_HEIGHT + ROW_HEIGHT / 2);
const INTERPOLATION_COLORS = [...ZONES].reverse().map(z => z.color);
const LIGHT_INTERPOLATION_COLORS = [...ZONES].reverse().map(z => z.color.replace(')', ', 0.08)').replace('rgb', 'rgba').replace('#', 'rgba(')); // This is naive, let's just use the hex and add opacity in style

const SpectrumCheckScreen = () => {
    const theme = useThemeColors();
    const mode = useThemeMode();
    const navigation = useNavigation<NavigationProp>();
    const setZone = useOnboardingStore((state) => state.setZone);
    const [selectedIndex, setSelectedIndex] = useState(ZONES.length - 1); // Start at Shame (bottom)

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
            opacity: mode === 'dark' ? 0.60 : 0.40,
        };
    });

    const handleContinue = () => {
        // Reversed order: index 0 is Pride (top), index 7 is Shame (bottom)
        const reversedZones = [...ZONES].reverse();
        setZone(reversedZones[selectedIndex].zone);
        navigation.navigate('FirstBreath');
    };

    // Display zones from Pride (top) to Shame (bottom)
    const displayZones = [...ZONES].reverse();
    const currentZone = displayZones[selectedIndex];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View style={[StyleSheet.absoluteFill, bgGlowStyle]} />
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Where is your energy landing today?</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Slide to match your inner weather</Text>
            </View>

            <View style={styles.sliderContainer}>
                {/* Left labels - Hawkins levels */}
                <View style={styles.labelColumn}>
                    {displayZones.map((z, i) => (
                        <View key={z.zone} style={styles.labelRow}>
                            <Text style={[
                                styles.labelText,
                                { color: theme.textSecondary, opacity: 0.7 },
                                selectedIndex === i ? { color: theme.textPrimary, fontWeight: '700', opacity: 1 } : null
                            ]}>
                                {z.label.toUpperCase()}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Slider track */}
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

                {/* Right labels - Relatable emotions */}
                <View style={styles.relatableColumn}>
                    {displayZones.map((z, i) => (
                        <View key={z.zone} style={styles.labelRow}>
                            <Text style={[
                                styles.relatableText,
                                { color: theme.textSecondary, opacity: 0.7 },
                                selectedIndex === i ? { color: theme.textPrimary, fontWeight: '600', opacity: 1 } : null
                            ]}>
                                {z.relatable.join(' · ')}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleContinue}
                >
                    <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 24,
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
    sliderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelColumn: {
        flex: 1,
        height: SLIDER_HEIGHT,
    },
    labelRow: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
    },
    labelText: {
        fontSize: 16,
        fontWeight: typography.medium,
        textAlign: 'right',
        paddingRight: 10,
    },
    labelActive: {
        // Handled inline via theme
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
        shadowColor: '#ffffff',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    indicatorInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    relatableColumn: {
        flex: 2,
        height: SLIDER_HEIGHT,
        paddingLeft: 10,
    },
    relatableText: {
        fontSize: 14,
        fontWeight: typography.regular,
        lineHeight: 18,
    },
    footer: {
        paddingBottom: 60,
    },
    button: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '300',
    },
});

export default SpectrumCheckScreen;
