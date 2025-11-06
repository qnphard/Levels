import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

interface PracticeTimerModalProps {
  visible: boolean;
  onClose: () => void;
  durationMinutes?: number;
}

export default function PracticeTimerModal({
  visible,
  onClose,
  durationMinutes = 2,
}: PracticeTimerModalProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const glowColor = theme.feelingsChapters.violet;

  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60); // in seconds
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Reset when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setIsRunning(false);
      setTimeRemaining(durationMinutes * 60);
      setHasStarted(false);
      setHasCompleted(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [visible, durationMinutes]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasCompleted(true);
            Alert.alert(
              'You showed up for yourself.',
              'That matters.',
              [{ text: 'OK', onPress: onClose }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onClose]);

  // Pulse animation for running timer
  useEffect(() => {
    if (isRunning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRunning, scaleAnim]);

  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
    Alert.alert('You showed up for yourself.', 'That matters.');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleCancel = () => {
    if (isRunning) {
      Alert.alert(
        'Cancel timer?',
        'Your progress will be lost.',
        [
          { text: 'Continue', style: 'cancel' },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: () => {
              setIsRunning(false);
              setTimeRemaining(durationMinutes * 60);
              setHasStarted(false);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeRemaining / (durationMinutes * 60);
  const circumference = 2 * Math.PI * 80; // radius = 80
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <LinearGradient
            colors={theme.appBackgroundGradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={handleCancel}
              accessibilityLabel="Close timer"
            >
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </Pressable>

            {/* Timer Circle */}
            <View style={styles.timerContainer}>
              <Animated.View
                style={[
                  styles.circleContainer,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                {/* Background circle */}
                <View style={styles.circleBackground} />
                
                {/* Progress circle - simplified version using View with border */}
                <View
                  style={[
                    styles.progressCircle,
                    {
                      borderColor: glowColor,
                      borderWidth: hasStarted ? 4 : 0,
                      opacity: hasStarted ? progress : 0,
                    },
                  ]}
                />

                {/* Time Display */}
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>
                    {formatTime(timeRemaining)}
                  </Text>
                  {!hasStarted && (
                    <Text style={styles.timeLabel}>Ready to begin</Text>
                  )}
                  {hasStarted && !isRunning && !hasCompleted && (
                    <Text style={styles.timeLabel}>Paused</Text>
                  )}
                  {hasCompleted && (
                    <Text style={styles.timeLabel}>Complete</Text>
                  )}
                </View>
              </Animated.View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                {!hasStarted
                  ? 'Take a moment to be with what you\'re feeling.'
                  : isRunning
                  ? 'Stay with the feeling. Let it move through you.'
                  : hasCompleted
                  ? 'You did it. Notice how you feel now.'
                  : 'Paused. Take your time.'}
              </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              {!hasStarted ? (
                <Pressable
                  style={[styles.controlButton, styles.startButton]}
                  onPress={handleStart}
                >
                  <Ionicons name="play" size={20} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start</Text>
                </Pressable>
              ) : (
                <>
                  {isRunning ? (
                    <Pressable
                      style={[styles.controlButton, styles.pauseButton]}
                      onPress={handlePause}
                    >
                      <Ionicons name="pause" size={20} color={glowColor} />
                      <Text style={styles.pauseButtonText}>Pause</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.controlButton, styles.resumeButton]}
                      onPress={handleResume}
                    >
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                      <Text style={styles.resumeButtonText}>Resume</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={[styles.controlButton, styles.cancelButton]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxWidth: 400,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    gradient: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.xl,
    },
    circleContainer: {
      width: 200,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleBackground: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 4,
      borderColor: theme.border,
      opacity: 0.3,
    },
    progressCircle: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    timeDisplay: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeText: {
      fontSize: 48,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    timeLabel: {
      fontSize: typography.small,
      color: theme.textSecondary,
      fontWeight: typography.medium,
    },
    instructions: {
      marginVertical: spacing.lg,
      paddingHorizontal: spacing.md,
    },
    instructionText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    controls: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      minHeight: 44,
      gap: spacing.xs,
    },
    startButton: {
      backgroundColor: theme.feelingsChapters.violet,
      minWidth: 120,
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },
    pauseButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.feelingsChapters.violet,
      minWidth: 100,
    },
    pauseButtonText: {
      color: theme.feelingsChapters.violet,
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },
    resumeButton: {
      backgroundColor: theme.feelingsChapters.violet,
      minWidth: 100,
    },
    resumeButtonText: {
      color: '#FFFFFF',
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      minWidth: 80,
    },
    cancelButtonText: {
      color: theme.textSecondary,
      fontSize: typography.body,
      fontWeight: typography.medium,
    },
  });

