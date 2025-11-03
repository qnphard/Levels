import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProgressProvider } from './src/context/UserProgressContext';
import ThemeToggleButton from './src/components/ThemeToggleButton';
import TutorialPopup, { useTutorialPopup } from './src/components/TutorialPopup';
import {
  ThemeProvider,
  useThemeColors,
  useThemeMode,
} from './src/theme/colors';

function AppContent() {
  const theme = useThemeColors();
  const mode = useThemeMode();
  const { showTutorial, dismissTutorial } = useTutorialPopup();

  // Hide Android navigation bar (immersive mode)
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.appBackgroundGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.45, 1]}
        pointerEvents="none"
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: theme.canvasOverlay },
        ]}
      />
      <AppNavigator />
      <ThemeToggleButton />
      <TutorialPopup visible={showTutorial} onDismiss={dismissTutorial} />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <AppContent />
      </UserProgressProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
