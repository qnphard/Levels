import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import { FirebaseConfigScreen } from '../screens/auth/FirebaseConfigScreen';
import { DevFirebaseBypassScreen } from '../screens/auth/DevFirebaseBypassScreen';

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const {
    user,
    loading,
    firebaseConfigured,
    devBypass,
    setDevBypass,
    loginDevBypass,
  } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!firebaseConfigured) {
    if (!__DEV__) {
      return <FirebaseConfigScreen />;
    }
    if (!devBypass) {
      return <DevFirebaseBypassScreen onContinue={() => setDevBypass(true)} />;
    }
    return <>{children}</>;
  }

  if (!user) {
    if (__DEV__ && firebaseConfigured && loginDevBypass) {
      return <>{children}</>;
    }
    return <AuthNavigator />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
