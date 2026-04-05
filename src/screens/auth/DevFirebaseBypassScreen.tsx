import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
} from '../../theme/colors';

type Props = {
  onContinue: () => void;
};

export function DevFirebaseBypassScreen({ onContinue }: Props) {
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
        <Text style={styles.title}>Firebase not configured</Text>
        <Text style={styles.body}>
          Add `EXPO_PUBLIC_FIREBASE_*` to `.env` for sign-in. This button only appears in
          development builds.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={onContinue}>
          <Text style={styles.btnText}>Continue without account (dev)</Text>
        </TouchableOpacity>
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
      marginBottom: spacing.xl,
    },
    btn: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
    },
    btnText: {
      color: theme.white,
      fontWeight: typography.semibold,
      fontSize: typography.body,
    },
  });
}
