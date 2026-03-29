import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackTypes';
import WelcomeToLevelsIntro from '../../components/WelcomeToLevelsIntro';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

/**
 * First screen of first-run onboarding — before “What brings you here today?”
 * (the same welcome copy as the tutorial’s welcome, which now starts at Journey Map).
 */
export default function OnboardingWelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return <WelcomeToLevelsIntro onContinue={() => navigation.navigate('Intention')} />;
}
