import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic feedback utilities for the app.
 * Provides consistent haptic feedback patterns across the application.
 */

/**
 * Light tap feedback - for button presses, selections
 */
export const lightTap = () => {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
};

/**
 * Medium tap feedback - for confirmations, important actions
 */
export const mediumTap = () => {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
};

/**
 * Heavy tap feedback - for significant events, milestones
 */
export const heavyTap = () => {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
};

/**
 * Success notification - for completed actions, achievements
 */
export const successNotification = () => {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
};

/**
 * Warning notification - for alerts, important notices
 */
export const warningNotification = () => {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
};

/**
 * Error notification - for failures, errors
 */
export const errorNotification = () => {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
};

/**
 * Selection change - for small UI changes, toggles
 */
export const selectionChange = () => {
    if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
    }
};

/**
 * Breathing rhythm haptic - pulses at breath turnaround points
 */
export const breathPulse = () => {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
};

/**
 * Celebration haptic pattern - for milestones, achievements
 */
export const celebrationPattern = async () => {
    if (Platform.OS === 'web') return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
