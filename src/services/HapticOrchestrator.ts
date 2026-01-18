import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * HapticOrchestrator - A "vocabulary" of physical touch feedback.
 * 
 * Design Philosophy:
 * - Texture: Tiny, sharp clicks for UI navigation (tick)
 * - Weight: Heavier thuds for physical boundaries or committing actions
 * - Release: Crisp release for toggle/switches
 * - Emotion: Success/Error patterns for emotional feedback
 */

const isIOS = Platform.OS === 'ios';

export const HapticOrchestrator = {
    // --- UI Navigation Textures ---

    /**
     * Subtle tick when scrolling past items on a list.
     * Like a high-quality watch bezel.
     */
    tick: async () => {
        if (isIOS) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            await Haptics.selectionAsync();
        }
    },

    /**
     * Crisp click for standard buttons.
     */
    elementClick: async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    /**
     * Heavier click for active states or turning something ON.
     */
    elementActive: async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },

    // --- Physical Interactions ---

    /**
     * Heavy thud when hitting a boundary or dropping an item.
     */
    boundaryHit: async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },

    /**
     * Sharp, solid commitment. Used for "Buy", "Delete", "Post".
     */
    commit: async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    // --- Semantic Feedback ---

    success: async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    warning: async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    },

    error: async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
};
