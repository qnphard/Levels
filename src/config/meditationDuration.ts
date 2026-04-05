/**
 * Spoken-word targets for TTS. If the model returns less, we pad with neutral
 * permissive lines so medium/long meditations are never ~1 minute by accident.
 */
export const MEDITATION_DURATION_MIN_WORDS: Record<'short' | 'medium' | 'long', number> = {
    short: 380,
    /** ~6–7+ min spoken at ~130 wpm before padding; padding tops up if the model is short. */
    medium: 850,
    long: 1800,
};
