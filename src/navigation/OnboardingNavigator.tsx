import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingWelcomeScreen from '../screens/onboarding/01_OnboardingWelcome';
import IntentionScreen from '../screens/onboarding/02_IntentionScreen';
import OnboardingEnergyCheckScreen from '../screens/onboarding/06_OnboardingEnergyCheck';
import OnboardingPracticePickScreen from '../screens/onboarding/07_OnboardingPracticePick';
import SpectrumCheckScreen from '../screens/onboarding/03_SpectrumCheckScreen';
import FirstBreathScreen from '../screens/onboarding/04_FirstBreathScreen';
import LandingScreen from '../screens/onboarding/05_LandingScreen';
import type { OnboardingStackParamList } from './OnboardingStackTypes';

export type { OnboardingStackParamList } from './OnboardingStackTypes';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="Intention" component={IntentionScreen} />
      <Stack.Screen name="EnergyCheck" component={OnboardingEnergyCheckScreen} />
      <Stack.Screen name="PracticePick" component={OnboardingPracticePickScreen} />
      <Stack.Screen name="SpectrumCheck" component={SpectrumCheckScreen} />
      <Stack.Screen name="FirstBreath" component={FirstBreathScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
    </Stack.Navigator>
  );
};
