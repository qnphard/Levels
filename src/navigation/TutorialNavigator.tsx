import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TutorialWelcome from '../screens/tutorial/01_TutorialWelcome';
import TutorialJourneyMap from '../screens/tutorial/02_TutorialJourneyMap';
import TutorialLevelChapter from '../screens/tutorial/03_TutorialLevelChapter';
import TutorialCheckIn from '../screens/tutorial/04_TutorialCheckIn';
import TutorialJournal from '../screens/tutorial/05_TutorialJournal';
import TutorialSettings from '../screens/tutorial/06_TutorialSettings';
import TutorialComplete from '../screens/tutorial/07_TutorialComplete';

export type TutorialStackParamList = {
    TutorialWelcome: undefined;
    TutorialJourneyMap: undefined;
    TutorialLevelChapter: undefined;
    TutorialCheckIn: undefined;
    TutorialJournal: undefined;
    TutorialSettings: undefined;
    TutorialComplete: undefined;
};

const Stack = createNativeStackNavigator<TutorialStackParamList>();

const TutorialNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Stack.Screen name="TutorialWelcome" component={TutorialWelcome} />
            <Stack.Screen name="TutorialJourneyMap" component={TutorialJourneyMap} />
            <Stack.Screen name="TutorialLevelChapter" component={TutorialLevelChapter} />
            <Stack.Screen name="TutorialCheckIn" component={TutorialCheckIn} />
            <Stack.Screen name="TutorialJournal" component={TutorialJournal} />
            <Stack.Screen name="TutorialSettings" component={TutorialSettings} />
            <Stack.Screen name="TutorialComplete" component={TutorialComplete} />
        </Stack.Navigator>
    );
};

export default TutorialNavigator;
