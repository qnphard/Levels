import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  typography,
  spacing,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

interface PasscodeScreenProps {
  mode: 'setup' | 'verify';
  onSuccess: () => void;
  onSetupComplete?: (passcode: string) => void;
  storedPasscode?: string;
}

export default function PasscodeScreen({
  mode,
  onSuccess,
  onSetupComplete,
  storedPasscode,
}: PasscodeScreenProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const shakeAnim = useState(new Animated.Value(0))[0];

  const handleNumberPress = (num: number) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      setError('');

      // Auto-verify when 4 digits entered
      if (newPasscode.length === 4) {
        setTimeout(() => checkPasscode(newPasscode), 100);
      }
    }
  };

  const checkPasscode = (code: string) => {
    if (mode === 'setup') {
      if (step === 'enter') {
        // Move to confirm step
        setStep('confirm');
        setConfirmPasscode(code);
        setPasscode('');
      } else {
        // Verify confirmation matches
        if (code === confirmPasscode) {
          onSetupComplete?.(code);
          onSuccess();
        } else {
          setError('Passcodes don\'t match. Try again.');
          Vibration.vibrate(500);
          shake();
          setTimeout(() => {
            setStep('enter');
            setPasscode('');
            setConfirmPasscode('');
            setError('');
          }, 1500);
        }
      }
    } else {
      // Verify mode
      if (code === storedPasscode) {
        onSuccess();
      } else {
        setError('Incorrect passcode');
        Vibration.vibrate(500);
        shake();
        setTimeout(() => {
          setPasscode('');
          setError('');
        }, 1000);
      }
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleBackspace = () => {
    setPasscode(passcode.slice(0, -1));
    setError('');
  };

  const getTitle = () => {
    if (mode === 'setup') {
      return step === 'enter' ? 'Set Your Passcode' : 'Confirm Passcode';
    }
    return 'Enter Passcode';
  };

  const getSubtitle = () => {
    if (mode === 'setup') {
      return step === 'enter'
        ? 'Create a 4-digit code to protect your journal'
        : 'Enter your passcode again to confirm';
    }
    return 'Your private space is protected';
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={48} color={theme.primary} />
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <Animated.View
          style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}
        >
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < passcode.length && styles.dotFilled,
              ]}
            />
          ))}
        </Animated.View>

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={theme.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.key}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.key} />
          <TouchableOpacity
            style={styles.key}
            onPress={() => handleNumberPress(0)}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.key}
            onPress={handleBackspace}
          >
            <Ionicons name="backspace-outline" size={28} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: 100,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xxl * 2,
    },
    title: {
      fontSize: typography.h1,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    dotsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xxl,
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    dotFilled: {
      backgroundColor: theme.primary,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.lg,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    errorText: {
      fontSize: typography.body,
      color: theme.error,
      fontWeight: typography.medium,
    },
    keypad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 300,
      justifyContent: 'center',
      gap: spacing.md,
    },
    key: {
      width: 80,
      height: 80,
      backgroundColor: theme.mode === 'dark' 
        ? 'rgba(167, 139, 250, 0.15)' 
        : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.mode === 'dark' 
        ? 'rgba(167, 139, 250, 0.3)' 
        : 'rgba(139, 92, 246, 0.25)',
    },
    keyText: {
      fontSize: 32,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
  });
