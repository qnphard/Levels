import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlayerScreen from '../screens/PlayerScreen';
import CheckInScreen from '../screens/CheckInScreen';
import JourneyMapScreen from '../screens/JourneyMapScreen';
import LevelDetailScreen from '../screens/LevelDetailScreen';
import { Meditation } from '../types';
import { useThemeColors } from '../theme/colors';

export type RootStackParamList = {
  Main: undefined;
  Player: { meditation: Meditation };
  CheckIn: undefined;
  JourneyMap: undefined;
  LevelDetail: { levelId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Profile: undefined;
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
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          paddingTop: 6,
          height: 70,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint={theme.mode === 'dark' ? 'dark' : 'light'}
            intensity={45}
            style={StyleSheet.absoluteFill}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={JourneyMapScreen}
        options={{ title: 'Journey' }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: 'Explore' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
          name="CheckIn"
          component={CheckInScreen}
          options={{ headerShown: false, presentation: 'modal' }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
