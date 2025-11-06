import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

const TUTORIAL_SHOWN_KEY = '@meditation_app:tutorial_shown';

interface TutorialPopupProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function TutorialPopup({ visible, onDismiss }: TutorialPopupProps) {
  const theme = useThemeColors();
  const styles = getStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={24} color={theme.primary} />
            </View>
            <Text style={styles.title}>Customize Your Experience</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name="sparkles" size={20} color={theme.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Glow On/Off Button</Text>
                <Text style={styles.featureDescription}>
                  Tap the sparkle button in the top-right corner to toggle glowing borders on cards. Turn it on for a more immersive experience, or off for a cleaner look.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name="moon" size={20} color={theme.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Dark/Light Theme Button</Text>
                <Text style={styles.featureDescription}>
                  Tap the moon/sun button next to the glow button to switch between dark and light themes. Choose what feels most comfortable for your eyes.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.dismissButton}
              onPress={onDismiss}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
            >
              <Text style={styles.dismissButtonText}>Got it!</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Hook to manage tutorial popup visibility
export function useTutorialPopup() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const shown = await AsyncStorage.getItem(TUTORIAL_SHOWN_KEY);
        if (!shown) {
          // Small delay to ensure app is fully loaded
          setTimeout(() => {
            setShowTutorial(true);
          }, 1000);
        }
      } catch (error) {
        // If there's an error, don't show the tutorial
        console.warn('Failed to check tutorial status:', error);
      }
    })();
  }, []);

  const handleDismiss = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, 'true');
      setShowTutorial(false);
    } catch (error) {
      console.warn('Failed to save tutorial status:', error);
      setShowTutorial(false);
    }
  };

  return {
    showTutorial,
    dismissTutorial: handleDismiss,
  };
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    container: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.xl,
      width: '100%',
      maxWidth: 400,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    iconContainer: {
      marginRight: spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    featureRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.2)'
        : 'rgba(139, 92, 246, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: {
      flex: 1,
      gap: spacing.xs,
    },
    featureTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    featureDescription: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    footer: {
      padding: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    dismissButton: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dismissButtonText: {
      fontSize: typography.body,
      fontWeight: typography.semibold,
      color: theme.white,
    },
  });

