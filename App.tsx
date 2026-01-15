import 'react-native-reanimated';
import React, { useEffect, useState, useCallback } from 'react';
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
import { AtmosphereOverlay } from './src/components/AtmosphereOverlay';

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
      <AtmosphereOverlay>
        <CelebrationProvider>
          <AppNavigator />
        </CelebrationProvider>
      </AtmosphereOverlay>
      <TutorialPopup visible={showTutorial} onDismiss={dismissTutorial} />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might cause some errors here, safe to ignore */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await loadSkia();

        // Safety timeout: forced splash hide after 5 seconds no matter what
        const timeoutId = setTimeout(() => {
          setAppIsReady(true);
        }, 5000);

        // Artificially delay for a moment to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 500));

        clearTimeout(timeoutId);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // More robust splash screen hiding
  useEffect(() => {
    if (appIsReady) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn("Failed to hide splash screen:", e);
        }
      };

      // Small delay after app is ready to ensure the first mount is painted
      const timer = setTimeout(hideSplash, 100);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Return null while waiting for splash screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProgressProvider>
            <ContentEditProvider>
              <AppContent />
            </ContentEditProvider>
          </UserProgressProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
