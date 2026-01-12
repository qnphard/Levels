import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/01_WelcomeScreen';
import SpectrumCheckScreen from '../screens/onboarding/03_SpectrumCheckScreen';
import FirstBreathScreen from '../screens/onboarding/04_FirstBreathScreen';
import LandingScreen from '../screens/onboarding/05_LandingScreen';

export type OnboardingStackParamList = {
    Welcome: undefined;
    SpectrumCheck: undefined;
    FirstBreath: undefined;
    Landing: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false, // Force flow completion
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SpectrumCheck" component={SpectrumCheckScreen} />
            <Stack.Screen name="FirstBreath" component={FirstBreathScreen} />
            <Stack.Screen name="Landing" component={LandingScreen} />
        </Stack.Navigator>
    );
};
