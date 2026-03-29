import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useThemeColors,
  spacing,
  typography,
} from '../../theme/colors';

export function FirebaseConfigScreen() {
  const theme = useThemeColors();
  const styles = getStyles(theme);

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Configuration required</Text>
        <Text style={styles.body}>
          This build needs Firebase credentials. Copy `.env.example` to `.env` and set
          `EXPO_PUBLIC_FIREBASE_*` from your Firebase project (see project README).
        </Text>
      </View>
    </LinearGradient>
  );
}

function getStyles(theme: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    inner: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: 100,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    body: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 24,
    },
  });
}
