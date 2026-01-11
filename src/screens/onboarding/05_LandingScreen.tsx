import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useOnboardingStore, Zone } from '../../store/onboardingStore';
import { useUserStore } from '../../store/userStore';

// Map Zone enum to level IDs from levels.ts
const ZONE_TO_LEVEL_ID: Record<Zone, string> = {
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

type FeedbackState = 'asking' | 'lighter' | 'same';

const LandingScreen = () => {
    const navigation = useNavigation<any>();
    const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
    const currentZone = useOnboardingStore((s) => s.currentZone);
    const addCheckIn = useUserStore((s) => s.addCheckIn);
    const [feedbackState, setFeedbackState] = useState<FeedbackState>('asking');

    const handleEnter = () => {
        // Persist the onboarding zone selection to userStore so JourneyMap can read it
        if (currentZone) {
            addCheckIn(currentZone);
        }
        completeOnboarding();

        // Navigate directly to the matching level chapter
        const levelId = currentZone ? ZONE_TO_LEVEL_ID[currentZone] : null;

        if (levelId) {
            // Reset to Main first, then navigate to the level chapter
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Main' },
                        { name: 'LevelChapter', params: { levelId, initialView: 'overview' } },
                    ],
                })
            );
        } else {
            // Fallback: just go to Main if no zone selected
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                })
            );
        }
    };

    const handleTryAnother = () => {
        // Reset to FirstBreath instead of goBack to ensure fresh state
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Onboarding', state: { routes: [{ name: 'FirstBreath' }] } }
                ],
            })
        );
    };

    const handleLighter = () => {
        setFeedbackState('lighter');
    };

    const handleSame = () => {
        setFeedbackState('same');
    };

    // Response after selecting "Lighter"
    if (feedbackState === 'lighter') {
        return (
            <Animated.View
                entering={FadeIn.duration(400)}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Ionicons name="sparkles" size={48} color="#A78BFA" style={styles.icon} />
                    <Text style={styles.title}>That's wonderful.</Text>
                    <Text style={styles.subtitle}>
                        Even small shifts are powerful.{'\n'}Every moment of presence adds up.
                    </Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleTryAnother}>
                        <Ionicons name="refresh-outline" size={20} color="#A78BFA" />
                        <Text style={styles.optionText}>Try another exercise</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleEnter}>
                        <Text style={styles.primaryButtonText}>Enter the App</Text>
                        <Ionicons name="arrow-forward" size={18} color="#f0f0f5" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }

    // Response after selecting "Same"
    if (feedbackState === 'same') {
        return (
            <Animated.View
                entering={FadeIn.duration(400)}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Ionicons name="heart-outline" size={48} color="#F472B6" style={styles.icon} />
                    <Text style={styles.title}>That's okay.</Text>
                    <Text style={styles.subtitle}>
                        Presence is the practice, not the outcome.{'\n'}Just showing up is progress.
                    </Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleTryAnother}>
                        <Ionicons name="sync-outline" size={20} color="#F472B6" />
                        <Text style={[styles.optionText, { color: '#F472B6' }]}>
                            Try a different technique
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleEnter}>
                        <Text style={styles.primaryButtonText}>Enter the App</Text>
                        <Ionicons name="arrow-forward" size={18} color="#f0f0f5" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }

    // Initial state - asking for feedback
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>A shift in state.</Text>
                <Text style={styles.subtitle}>How do you feel now compared to when you began?</Text>
            </View>

            <View style={styles.feedback}>
                <TouchableOpacity style={styles.feedbackButton} onPress={handleLighter}>
                    <Ionicons name="sparkles-outline" size={20} color="#A78BFA" />
                    <Text style={styles.feedbackText}>Lighter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackButton} onPress={handleSame}>
                    <Text style={styles.feedbackText}>Same</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.skipFooter} onPress={handleEnter}>
                    <Text style={styles.skipFooterText}>Skip and enter app</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
        padding: 24,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#f0f0f5',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 24,
    },
    feedback: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 60,
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 20,
    },
    feedbackText: {
        color: '#f0f0f5',
        fontSize: 16,
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    skipFooter: {
        paddingVertical: 12,
    },
    skipFooterText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
    },
    optionsContainer: {
        gap: 16,
        paddingBottom: 60,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        color: '#A78BFA',
        fontSize: 16,
        fontWeight: '500',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(147, 112, 219, 0.4)',
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(147, 112, 219, 0.6)',
    },
    primaryButtonText: {
        color: '#f0f0f5',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default LandingScreen;
