import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../store/onboardingStore';
import { LivingBackground } from '../../components/LivingBackground';
import { KineticText } from '../../components/KineticText';
import PrimaryButton from '../../components/PrimaryButton';
import { useThemeColors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const completeOnboarding = useOnboardingStore(s => s.completeOnboarding);
    const theme = useThemeColors();

    const handleSkip = () => {
        completeOnboarding();
    };

    return (
        <View style={styles.container}>
            {/* Status bar dark because background is light */}
            <StatusBar barStyle="dark-content" />

            {/* Using Light mode for uplifting/morning vibe */}
            <LivingBackground mode="light" />

            <View style={styles.content}>
                {/* Logo Area - Replaces Text */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/levels-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Main Message - Dark text for contrast */}
                <View style={styles.messageContainer}>
                    <KineticText
                        type="h2"
                        style={styles.headline}
                        delay={600}
                    >
                        You don't have to do this alone.
                    </KineticText>
                    <KineticText
                        type="h3"
                        style={[styles.subheadline]}
                        delay={1400}
                    >
                        We can walk this journey together.
                    </KineticText>
                </View>
            </View>

            <View style={styles.footer}>
                <PrimaryButton
                    label="Help me with a quick relief"
                    onPress={() => navigation.navigate('SpectrumCheck')}
                    backgroundColor="#2D3142"
                    textColor="#ffffff"
                />

                <PrimaryButton
                    label="Enter Levels"
                    onPress={handleSkip}
                    backgroundColor="#2D3142"
                    textColor="#ffffff"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6', // Light fallback
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
        height: 100, // Reserve space
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.6, // 60% of screen width
        height: 100,
    },
    messageContainer: {
        alignItems: 'center',
        gap: 24,
    },
    headline: {
        textAlign: 'center',
        fontSize: 28, // Slightly smaller to balance with visual logo
        fontWeight: '400',
        lineHeight: 40,
        color: '#1c1c1e', // Dark text
    },
    subheadline: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        color: '#48484a', // Dark Gray
    },
    footer: {
        padding: 32,
        paddingBottom: 60,
        gap: 24,
    },
    skipButton: {
        alignItems: 'center',
        padding: 12,
    },
    skipButtonText: {
        color: '#6e6e73', // Muted Gray
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
        textDecorationLine: 'underline',
    },
});

export default WelcomeScreen;
