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
import { VideoSplashScreen } from './src/components/VideoSplashScreen';

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
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  // 1. Initial Prep (Lightweight)
  useEffect(() => {
    async function prepare() {
      try {
        // Just verify basic things or minimal async here
      } catch (e) {
        console.warn(e);
      }
      // Note: We do NOT set appIsReady(true) here anymore.
      // We will wait for the video to be ready first.
    }
    prepare();
  }, []);

  // 2. Hide Native Splash & Start App Load ONCE VIDEO IS READY
  useEffect(() => {
    if (isSplashReady) {
      const startAppLoad = async () => {
        try {
          // Hide native splash immediately so video is visible
          await SplashScreen.hideAsync();

          // Wait a brief moment to let video playback stabilize on main thread
          await new Promise(resolve => setTimeout(resolve, 300));

          // NOW start heavy lifting (hydration, fonts, etc)
          await loadSkia();

          // Finally, mark app as ready to mount underneath
          setAppIsReady(true);
        } catch (e) {
          console.warn("Failed to load app:", e);
          // Fallback
          await SplashScreen.hideAsync();
          setAppIsReady(true);
        }
      };
      startAppLoad();
    }
  }, [isSplashReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProgressProvider>
            <ContentEditProvider>
              <View style={{ flex: 1 }}>
                {/* Mount App Content only when ready (underneath video) */}
                {appIsReady && (
                  <AppContent />
                )}

                {/* Keep Video Overlay until it finishes AND app is ready */}
                {!isSplashFinished && (
                  <VideoSplashScreen
                    onReady={() => setIsSplashReady(true)}
                    onFinish={() => setIsSplashFinished(true)}
                    allowFinish={appIsReady}
                  />
                )}
              </View>
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
