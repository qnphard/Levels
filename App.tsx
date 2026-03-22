import 'react-native-reanimated';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text, InteractionManager } from 'react-native';
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

  // Defer until after first paint. In __DEV__, skip hiding the nav bar: Metro / dev overlays
  // cause rapid onWindowFocusChanged(false) and ReactHost logs ReactNoCrashSoftException — that
  // line is usually noise, not the hang; skipping nav-bar API calls here avoids extra churn.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (__DEV__) return;
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        NavigationBar.setVisibilityAsync('hidden').catch(() => undefined);
        NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => undefined);
      });
    });
    return () => task.cancel();
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
  /** Dev client shows "Bundling 100%…" until React mounts; delaying AppContent for the video splash races ReactHost and can leave that overlay stuck (see RN SoftException on onWindowFocusChange). */
  const devSkipVideoSplash = __DEV__;
  const [appIsReady, setAppIsReady] = useState(devSkipVideoSplash);
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(devSkipVideoSplash);

  useEffect(() => {
    if (!devSkipVideoSplash) return;
    SplashScreen.hideAsync().catch(() => undefined);
    loadSkia().catch((e) => console.warn(e));
  }, [devSkipVideoSplash]);

  // Production: hide native splash only after video is ready, then hydrate.
  useEffect(() => {
    if (devSkipVideoSplash) return;
    if (isSplashReady) {
      const startAppLoad = async () => {
        try {
          await SplashScreen.hideAsync();
          await new Promise((resolve) => setTimeout(resolve, 300));
          await loadSkia();
          setAppIsReady(true);
        } catch (e) {
          console.warn('Failed to load app:', e);
          await SplashScreen.hideAsync();
          setAppIsReady(true);
        }
      };
      startAppLoad();
    }
  }, [isSplashReady, devSkipVideoSplash]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProgressProvider>
            <ContentEditProvider>
              <View style={{ flex: 1 }}>
                {appIsReady && <AppContent />}

                {!devSkipVideoSplash && !isSplashFinished && (
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
