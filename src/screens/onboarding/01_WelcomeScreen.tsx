import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const completeOnboarding = useOnboardingStore(s => s.completeOnboarding);
    const line1Opacity = useSharedValue(0);
    const line2Opacity = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        // Faster timing: message visible within ~1 second instead of ~2+ seconds
        line1Opacity.value = withDelay(100, withTiming(1, { duration: 800, easing: Easing.ease }));
        line2Opacity.value = withDelay(1000, withTiming(1, { duration: 800, easing: Easing.ease }));
        buttonOpacity.value = withDelay(2000, withTiming(1, { duration: 600, easing: Easing.ease }));
    }, []);

    const line1Style = useAnimatedStyle(() => ({ opacity: line1Opacity.value }));
    const line2Style = useAnimatedStyle(() => ({ opacity: line2Opacity.value }));
    const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.Text style={[styles.headline, line1Style]}>
                    You don't need to add anything
                </Animated.Text>
                <Animated.Text style={[styles.headline, line2Style]}>
                    to be whole.
                </Animated.Text>
            </View>

            <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SpectrumCheck')}
                >
                    <Text style={styles.buttonText}>Begin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => completeOnboarding()}
                >
                    <Text style={styles.skipButtonText}>I don't feel bad</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headline: {
        fontSize: 32,
        fontWeight: '300',
        color: '#f0f0f5',
        textAlign: 'center',
        lineHeight: 44,
    },
    buttonContainer: {
        paddingBottom: 60,
        width: '100%',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
    },
    buttonText: {
        color: '#f0f0f5',
        fontSize: 18,
        fontWeight: '500',
    },
    skipButton: {
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    skipButtonText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 16,
        fontWeight: '400',
    },
});

export default WelcomeScreen;
