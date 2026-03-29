import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useLayoutEffect, useState } from 'react';

// Required so the in-app browser can hand the OAuth redirect back to the app (Google sign-in).
WebBrowser.maybeCompleteAuthSession();
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthGate } from './src/navigation/AuthGate';
import { AuthProvider } from './src/context/AuthContext';
import { UserProgressProvider } from './src/context/UserProgressContext';
import { ContentEditProvider } from './src/context/ContentEditContext';
import { ThemeProvider, useThemeColors, useThemeMode } from './src/theme/colors';
import { loadSkia } from './src/utils/skiaLoader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CelebrationProvider from './src/components/CelebrationProvider';
import { AtmosphereOverlay } from './src/components/AtmosphereOverlay';
import { VideoSplashScreen } from './src/components/VideoSplashScreen';
import { SplashFinishedProvider } from './src/context/SplashContext';

function AppContent() {
  const theme = useThemeColors();
  const mode = useThemeMode();

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

  // Dev: Fast Refresh can preserve App state so the video splash is skipped (isSplashFinished stays true).
  // Reset only when something is non-initial so cold start does not thrash; remount/HMR clears stale flags.
  useLayoutEffect(() => {
    if (!__DEV__) return;
    setIsSplashFinished((f) => (f ? false : f));
    setIsSplashReady((r) => (r ? false : r));
    setAppIsReady((a) => (a ? false : a));
  }, []);

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
        <AuthProvider>
          <ThemeProvider>
            <SplashFinishedProvider finished={isSplashFinished}>
              <View style={{ flex: 1 }}>
                {/* Auth mounts immediately so Firebase + login stack behave like before; splash is only on top. */}
                <AuthGate>
                  <UserProgressProvider>
                    <ContentEditProvider>
                      <View style={{ flex: 1 }}>
                        {appIsReady && <AppContent />}
                      </View>
                    </ContentEditProvider>
                  </UserProgressProvider>
                </AuthGate>
                {!isSplashFinished && (
                  <VideoSplashScreen
                    onReady={() => setIsSplashReady(true)}
                    onFinish={() => setIsSplashFinished(true)}
                    allowFinish={appIsReady}
                  />
                )}
              </View>
            </SplashFinishedProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
