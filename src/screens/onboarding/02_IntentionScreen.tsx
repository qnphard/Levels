import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackTypes';
import { useOnboardingStore, Intention } from '../../store/onboardingStore';
import { KineticText } from '../../components/KineticText';
import { ONBOARDING_INTENTION_OPTIONS } from '../../data/onboardingIntentions';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Intention'>;

const IntentionScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const setIntention = useOnboardingStore((s) => s.setIntention);
    const setHasCompletedIntentionPrompt = useOnboardingStore(
        (s) => s.setHasCompletedIntentionPrompt
    );

    const handleSelect = (value: Intention) => {
        setHasCompletedIntentionPrompt(true);
        if (value === Intention.Understanding) {
            setIntention(Intention.Understanding);
            navigation.navigate('EnergyCheck');
            return;
        }
        if (value === Intention.EmergencyRelief) {
            setIntention(Intention.EmergencyRelief);
            navigation.navigate('PracticePick');
            return;
        }
        if (value === Intention.DailyPractice) {
            setIntention(Intention.DailyPractice);
            navigation.getParent()?.navigate('Main', { screen: 'Journal' });
            return;
        }
        setIntention(value);
        navigation.navigate('SpectrumCheck');
    };

    const handleSkip = () => {
        setIntention(Intention.DailyPractice);
        setHasCompletedIntentionPrompt(true);
        navigation.navigate('SpectrumCheck');
    };

    return (
        <LinearGradient
            colors={['#0a0a0f', '#1a1a2e', '#0a0a0f']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.content}>
                <KineticText
                    type="h2"
                    style={styles.title}
                    delay={200}
                >
                    What brings you here today?
                </KineticText>
                <Text style={styles.subtitle}>
                    This helps us personalize your experience
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                {ONBOARDING_INTENTION_OPTIONS.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.optionButton}
                        onPress={() => handleSelect(item.value)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.accent}20` }]}>
                            <Ionicons name={item.icon} size={24} color={item.accent} />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={[styles.optionTitle, { color: item.accent }]}>{item.title}</Text>
                            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        color: '#f0f0f5',
        textAlign: 'center',
        lineHeight: 38,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 12,
    },
    optionsContainer: {
        gap: 16,
        paddingBottom: 40,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    skipButton: {
        padding: 12,
    },
    skipText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});

export default IntentionScreen;
