import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProgressProvider } from './src/context/UserProgressContext';
import { ContentEditProvider } from './src/context/ContentEditContext';
import TutorialPopup, { useTutorialPopup } from './src/components/TutorialPopup';
import { ThemeProvider, useThemeColors, useThemeMode } from './src/theme/colors';
import { loadSkia } from './src/utils/skiaLoader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CelebrationProvider from './src/components/CelebrationProvider';

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
        pointerEvents="none"
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: theme.canvasOverlay },
        ]}
      />
      <CelebrationProvider>
        <AppNavigator />
      </CelebrationProvider>
      <TutorialPopup visible={showTutorial} onDismiss={dismissTutorial} />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [skiaLoaded, setSkiaLoaded] = useState(Platform.OS !== 'web');

  useEffect(() => {
    loadSkia().finally(() => {
      setSkiaLoaded(true);
    });
  }, []);

  if (!skiaLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserProgressProvider>
          <ContentEditProvider>
            <AppContent />
          </ContentEditProvider>
        </UserProgressProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
