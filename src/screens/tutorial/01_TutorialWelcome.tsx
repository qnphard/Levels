import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import WelcomeToLevelsIntro from '../../components/WelcomeToLevelsIntro';

type TutorialStackParamList = {
  TutorialWelcome: undefined;
  TutorialJourneyMap: undefined;
  TutorialLevelChapter: undefined;
  TutorialCheckIn: undefined;
  TutorialJournal: undefined;
  TutorialSettings: undefined;
  TutorialComplete: undefined;
};

type NavigationProp = NativeStackNavigationProp<TutorialStackParamList, 'TutorialWelcome'>;

/** Kept for “replay tutorial” / deep links; first-time users see this copy in onboarding before Intention. */
const TutorialWelcome = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <WelcomeToLevelsIntro onContinue={() => navigation.navigate('TutorialJourneyMap')} />
  );
};

export default TutorialWelcome;
