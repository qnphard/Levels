import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialCheckIn = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const setHasSeenTutorial = useOnboardingStore((s) => s.setHasSeenTutorial);

    const handleSkip = () => {
        setHasSeenTutorial(true);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={[styles.skipText, { color: theme.textMuted }]}>Skip tutorial</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                    <Ionicons name="pulse-outline" size={60} color={theme.primary} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    Daily Check-In
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    We'll occasionally ask how you're feeling. This helps us personalize your experience.
                </Text>

                <View style={[styles.mockSlider, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={[styles.sliderTrack, { backgroundColor: theme.primary }]} />
                    <View style={[styles.sliderKnob, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.mockLabel, { color: theme.textMuted }]}>Slide to match your inner weather</Text>
                </View>

                <Text style={[styles.hint, { color: theme.textMuted }]}>
                    Your selection helps us recommend the most relevant content for where you are right now.
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialJournal')}
                >
                    <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>Next</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.primaryContrast} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    skipText: {
        fontSize: 16,
        fontWeight: typography.regular,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontWeight: typography.regular,
    },
    mockSlider: {
        width: '100%',
        height: 80,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    sliderTrack: {
        width: 4,
        height: 50,
        borderRadius: 2,
        position: 'absolute',
        left: '50%',
        marginLeft: -2,
    },
    sliderKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        left: '50%',
        marginLeft: -10,
    },
    mockLabel: {
        fontSize: 12,
        marginTop: 60,
        fontWeight: typography.regular,
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: typography.regular,
    },
    footer: {
        paddingBottom: 40,
        gap: 20,
    },
    progress: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        height: 8,
        borderRadius: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: typography.semibold,
    },
});

export default TutorialCheckIn;
