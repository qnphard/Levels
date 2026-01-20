import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore, Intention } from '../../store/onboardingStore';
import { KineticText } from '../../components/KineticText';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Intention'>;

const INTENTIONS = [
    {
        value: Intention.EmergencyRelief,
        icon: 'flash-outline' as const,
        title: 'Emergency Relief',
        subtitle: "I'm struggling right now",
        color: '#F472B6',
    },
    {
        value: Intention.DailyPractice,
        icon: 'sunny-outline' as const,
        title: 'Daily Practice',
        subtitle: 'Building a regular habit',
        color: '#A78BFA',
    },
    {
        value: Intention.Understanding,
        icon: 'book-outline' as const,
        title: 'Understanding',
        subtitle: 'Learning about my feelings',
        color: '#60A5FA',
    },
];

const IntentionScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const setIntention = useOnboardingStore((s) => s.setIntention);

    const handleSelect = (intention: Intention) => {
        setIntention(intention);
        navigation.navigate('SpectrumCheck');
    };

    const handleSkip = () => {
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
                {INTENTIONS.map((item, index) => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.optionButton}
                        onPress={() => handleSelect(item.value)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={[styles.optionTitle, { color: item.color }]}>{item.title}</Text>
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
