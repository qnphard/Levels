import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProgressProvider } from './src/context/UserProgressContext';
import ThemeToggleButton from './src/components/ThemeToggleButton';
import {
  ThemeProvider,
  useThemeColors,
  useThemeMode,
} from './src/theme/colors';

function AppContent() {
  const theme = useThemeColors();
  const mode = useThemeMode();

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
