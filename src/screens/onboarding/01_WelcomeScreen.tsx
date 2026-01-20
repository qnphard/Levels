import React, { useState } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../store/onboardingStore';
import { LivingBackground } from '../../components/LivingBackground';
import { KineticText } from '../../components/KineticText';
import PrimaryButton from '../../components/PrimaryButton';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { setName, completeOnboarding } = useOnboardingStore();
    const [inputName, setInputName] = useState('');

    const handleContinue = () => {
        if (inputName.trim()) {
            setName(inputName.trim());
        }
        navigation.navigate('Intention');
    };

    const handleSkip = () => {
        if (inputName.trim()) {
            setName(inputName.trim());
        }
        completeOnboarding();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" />
            <LivingBackground mode="light" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/levels-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

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
                        style={styles.subheadline}
                        delay={1400}
                    >
                        We can walk this journey together.
                    </KineticText>
                </View>

                {/* Name Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="What should we call you?"
                        placeholderTextColor="#8e8e93"
                        value={inputName}
                        onChangeText={setInputName}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <PrimaryButton
                    label="Continue"
                    onPress={handleContinue}
                    backgroundColor="#2D3142"
                    textColor="#ffffff"
                />

                <PrimaryButton
                    label="Skip to Levels"
                    onPress={handleSkip}
                    backgroundColor="transparent"
                    textColor="#6e6e73"
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
        height: 100,
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.6,
        height: 100,
    },
    messageContainer: {
        alignItems: 'center',
        gap: 24,
    },
    headline: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        lineHeight: 40,
        color: '#1c1c1e',
    },
    subheadline: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        color: '#48484a',
    },
    inputContainer: {
        marginTop: 40,
        paddingHorizontal: 16,
    },
    nameInput: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 17,
        color: '#1c1c1e',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    footer: {
        padding: 32,
        paddingBottom: 60,
        gap: 16,
    },
});

export default WelcomeScreen;
