import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
} from '../../theme/colors';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const theme = useThemeColors();
  const { signInEmail, signInWithGoogle, googleSignInAvailable, firebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staySignedIn, setStaySignedIn] = useState(true);

  const styles = getStyles(theme);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter email and password.');
      return;
    }
    setBusy(true);
    try {
      await signInEmail(email, password, { staySignedIn });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle({ staySignedIn });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Google sign-in failed.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Continue to Levels</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.staySignedRow}
          onPress={() => setStaySignedIn((v) => !v)}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: staySignedIn }}
        >
          <Ionicons
            name={staySignedIn ? 'checkbox' : 'square-outline'}
            size={22}
            color={staySignedIn ? theme.primary : theme.textSecondary}
          />
          <Text style={styles.staySignedLabel}>Stay signed in?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, busy && styles.btnDisabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={theme.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Sign in</Text>
          )}
        </TouchableOpacity>

        {googleSignInAvailable ? (
          <TouchableOpacity
            style={[styles.secondaryBtn, busy && styles.btnDisabled]}
            onPress={onGoogle}
            disabled={busy}
          >
            <Text style={styles.secondaryBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        ) : __DEV__ && firebaseConfigured ? (
          <Text style={styles.devHint}>
            Google sign-in: set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (…apps.googleusercontent.com). If you see
            invalid_client, add redirect URIs in Google Cloud → Credentials → your Web client: https://auth.expo.io/@qnphard/meditation-app and com.anonymous.levels:/oauthredirect
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Create an account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function getStyles(theme: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    inner: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: 80,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: theme.textPrimary,
      marginBottom: spacing.md,
      backgroundColor: theme.cardBackground,
    },
    error: {
      color: '#EF4444',
      marginBottom: spacing.md,
      fontSize: typography.small,
    },
    staySignedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    staySignedLabel: {
      fontSize: typography.body,
      color: theme.textPrimary,
      marginLeft: spacing.sm,
    },
    primaryBtn: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    primaryBtnText: {
      color: theme.white,
      fontWeight: typography.semibold,
      fontSize: typography.body,
    },
    secondaryBtn: {
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    secondaryBtnText: {
      color: theme.textPrimary,
      fontWeight: typography.semibold,
    },
    btnDisabled: { opacity: 0.6 },
    link: { alignItems: 'center' },
    linkText: {
      color: theme.primary,
      fontSize: typography.body,
    },
    devHint: {
      fontSize: typography.small,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 20,
    },
  });
}
