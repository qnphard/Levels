import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeBlurView from '../components/SafeBlurView';
import { OnboardingNavigator } from './OnboardingNavigator';
import TutorialNavigator from './TutorialNavigator';
import { useOnboardingStore } from '../store/onboardingStore';


import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlayerScreen from '../screens/PlayerScreen';
import JourneyMapScreen from '../screens/JourneyMapScreen';
import LevelDetailScreen from '../screens/LevelDetailScreen';
import LevelChapterScreen from '../screens/LevelChapterScreen';
import JournalScreen from '../screens/JournalScreen';
import LearnHubScreen from '../screens/LearnHubScreen';
import ChapterScreen from '../screens/ChapterScreen';
import EssentialsScreen from '../screens/EssentialsScreen';
import WhatYouReallyAreScreen from '../screens/WhatYouReallyAreScreen';
import TensionScreen from '../screens/TensionScreen';
import MantrasScreen from '../screens/MantrasScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CommonTrapsScreen from '../screens/CommonTrapsScreen';
import NaturalHappinessScreen from '../screens/NaturalHappinessScreen';
import PowerVsForceScreen from '../screens/PowerVsForceScreen';
import LevelsOfTruthScreen from '../screens/LevelsOfTruthScreen';
import IntentionScreen from '../screens/IntentionScreen';
import MusicAsToolScreen from '../screens/MusicAsToolScreen';
import FatigueVsEnergyScreen from '../screens/FatigueVsEnergyScreen';
import FulfillmentVsSatisfactionScreen from '../screens/FulfillmentVsSatisfactionScreen';
import PositiveReprogrammingScreen from '../screens/PositiveReprogrammingScreen';
import EffortScreen from '../screens/EffortScreen';
import ShadowWorkScreen from '../screens/ShadowWorkScreen';
import NonReactivityScreen from '../screens/NonReactivityScreen';
import RelaxingScreen from '../screens/RelaxingScreen';
import KnowledgeScreen from '../screens/KnowledgeScreen';
import AddictionScreen from '../screens/AddictionScreen';
import LossAndAbandonmentScreen from '../screens/LossAndAbandonmentScreen';
import { Meditation } from '../types';
import { useThemeColors } from '../theme/colors';

export type RootStackParamList = {
  Tutorial: undefined;
  Onboarding: undefined;
  Main: undefined;
  Player: { meditation: Meditation };
  JourneyMap: undefined;
  LevelDetail: { levelId: string };
  LevelChapter: { levelId: string; initialView?: 'overview' | 'meditations' | 'articles'; sourceFeeling?: string };
  LearnHub: undefined;
  Chapter: { chapterId: string; tab?: string; initialTab?: string };
  Essentials: undefined;
  WhatYouReallyAre: undefined;
  Tension: { initialTab?: string } | undefined;
  Mantras: undefined;
  Settings: undefined;
  CommonTraps: undefined;
  NaturalHappiness: undefined;
  PowerVsForce: undefined;
  LevelsOfTruth: undefined;
  Intention: undefined;
  MusicAsTool: undefined;
  FatigueVsEnergy: undefined;
  FulfillmentVsSatisfaction: undefined;
  PositiveReprogramming: undefined;
  Effort: undefined;
  ShadowWork: undefined;
  NonReactivity: undefined;
  Relaxing: undefined;
  Knowledge: undefined;
  Addiction: undefined;
  LossAndAbandonment: { initialTab?: string } | undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Journey: undefined;
  Explore: undefined;
  Journal: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const theme = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Journey') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Journal') {
            iconName = focused ? 'journal' : 'journal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.mode === 'dark'
          ? 'rgba(139, 92, 246, 0.75)' // Reduced opacity for dark theme
          : theme.primary,
        tabBarInactiveTintColor: theme.mode === 'dark'
          ? 'rgba(167, 139, 250, 0.5)' // Muted violet for dark mode
          : 'rgba(139, 92, 246, 0.5)', // Muted violet for light mode
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          paddingTop: 6,
          height: 70,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => (
          <SafeBlurView
            tint={theme.mode === 'dark' ? 'dark' : 'light'}
            intensity={45}
            backgroundColor={theme.mode === 'dark'
              ? 'rgba(15, 28, 34, 0.85)' // Dark violet-tinted background
              : 'rgba(247, 245, 250, 0.9)'} // Light violet-tinted background
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Journey"
        component={JourneyMapScreen}
        options={{ title: 'Journey' }}
      />
      <Tab.Screen
        name="Explore"
        component={EssentialsScreen}
        options={{ title: 'Explore' }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ title: 'Journal' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isOnboardingComplete = useOnboardingStore((s) => s.isComplete);
  const showOnboarding = useOnboardingStore((s) => s.showOnboarding);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);
  const showTutorialAgain = useOnboardingStore((s) => s.showTutorialAgain);

  // Show onboarding if:
  // 1. showOnboarding toggle is enabled (default)
  // 2. AND user hasn't completed this session's onboarding yet
  const shouldShowOnboarding = showOnboarding && !isOnboardingComplete;
  const shouldShowTutorial = isOnboardingComplete && (!hasSeenTutorial || showTutorialAgain);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {shouldShowOnboarding && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingNavigator}
            options={{ headerShown: false }}
          />
        )}
        {shouldShowTutorial && (
          <Stack.Screen
            name="Tutorial"
            component={TutorialNavigator}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JourneyMap"
          component={JourneyMapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LevelDetail"
          component={LevelDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LevelChapter"
          component={LevelChapterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LearnHub"
          component={LearnHubScreen}
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="Chapter"
          component={ChapterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Essentials"
          component={EssentialsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WhatYouReallyAre"
          component={WhatYouReallyAreScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tension"
          component={TensionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Mantras"
          component={MantrasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="CommonTraps"
          component={CommonTrapsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NaturalHappiness"
          component={NaturalHappinessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PowerVsForce"
          component={PowerVsForceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LevelsOfTruth"
          component={LevelsOfTruthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Intention"
          component={IntentionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MusicAsTool"
          component={MusicAsToolScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FatigueVsEnergy"
          component={FatigueVsEnergyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FulfillmentVsSatisfaction"
          component={FulfillmentVsSatisfactionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PositiveReprogramming"
          component={PositiveReprogrammingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Effort"
          component={EffortScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShadowWork"
          component={ShadowWorkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NonReactivity"
          component={NonReactivityScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Relaxing"
          component={RelaxingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Knowledge"
          component={KnowledgeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Addiction"
          component={AddictionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LossAndAbandonment"
          component={LossAndAbandonmentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
