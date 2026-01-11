import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';

let backgroundSound: Audio.Sound | null = null;
let isInitialized = false;

/**
 * Initialize audio session for background playback
 */
export const initializeAudio = async () => {
    if (isInitialized) return;

    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        isInitialized = true;
    } catch (error) {
        console.warn('Failed to initialize audio:', error);
    }
};

/**
 * Available ambient sounds
 */
export type AmbientSoundType = 'ocean' | 'rain' | 'forest' | 'wind' | 'silence';

/**
 * Sound asset URLs (using public domain/royalty-free sounds)
 * In production, these would be bundled assets
 */
const SOUND_ASSETS: Record<AmbientSoundType, string | null> = {
    ocean: null, // Would be require('./assets/sounds/ocean.mp3')
    rain: null,
    forest: null,
    wind: null,
    silence: null,
};

/**
 * Preload a sound for faster playback
 */
export const preloadSound = async (soundType: AmbientSoundType): Promise<void> => {
    if (Platform.OS === 'web' || SOUND_ASSETS[soundType] === null) return;

    await initializeAudio();

    try {
        // In production, this would load from bundled assets
        // const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[soundType]);
        // backgroundSound = sound;
    } catch (error) {
        console.warn('Failed to preload sound:', error);
    }
};

/**
 * Play ambient background sound
 */
export const playAmbientSound = async (
    soundType: AmbientSoundType,
    volume: number = 0.3,
    loop: boolean = true
): Promise<void> => {
    if (Platform.OS === 'web' || soundType === 'silence') return;

    await initializeAudio();

    // Stop any existing sound
    await stopAmbientSound();

    try {
        // In production implementation with bundled assets:
        // const asset = SOUND_ASSETS[soundType];
        // if (!asset) return;
        // 
        // const { sound } = await Audio.Sound.createAsync(
        //     asset,
        //     { 
        //         shouldPlay: true, 
        //         isLooping: loop,
        //         volume: volume,
        //     }
        // );
        // backgroundSound = sound;

        console.log(`Would play ${soundType} at volume ${volume}`);
    } catch (error) {
        console.warn('Failed to play ambient sound:', error);
    }
};

/**
 * Stop ambient sound
 */
export const stopAmbientSound = async (): Promise<void> => {
    if (backgroundSound) {
        try {
            await backgroundSound.stopAsync();
            await backgroundSound.unloadAsync();
        } catch (error) {
            console.warn('Failed to stop sound:', error);
        }
        backgroundSound = null;
    }
};

/**
 * Fade out and stop ambient sound
 */
export const fadeOutAmbientSound = async (durationMs: number = 1000): Promise<void> => {
    if (!backgroundSound) return;

    try {
        const status = await backgroundSound.getStatusAsync();
        if (!status.isLoaded) return;

        const startVolume = status.volume || 0.3;
        const steps = 10;
        const stepDuration = durationMs / steps;

        for (let i = steps; i >= 0; i--) {
            await new Promise(resolve => setTimeout(resolve, stepDuration));
            await backgroundSound?.setVolumeAsync((startVolume * i) / steps);
        }

        await stopAmbientSound();
    } catch (error) {
        await stopAmbientSound();
    }
};

/**
 * Set volume of currently playing sound
 */
export const setAmbientVolume = async (volume: number): Promise<void> => {
    if (!backgroundSound) return;

    try {
        await backgroundSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
        console.warn('Failed to set volume:', error);
    }
};

/**
 * Play a short notification or UI sound
 */
export const playUISound = async (type: 'success' | 'tap' | 'complete'): Promise<void> => {
    if (Platform.OS === 'web') return;

    await initializeAudio();

    // In production, these would be short bundled sound effects
    // const sounds = {
    //     success: require('./assets/sounds/success.mp3'),
    //     tap: require('./assets/sounds/tap.mp3'),
    //     complete: require('./assets/sounds/complete.mp3'),
    // };
    // 
    // try {
    //     const { sound } = await Audio.Sound.createAsync(sounds[type], { shouldPlay: true });
    //     // Unload after playing
    //     sound.setOnPlaybackStatusUpdate((status) => {
    //         if (status.didJustFinish) {
    //             sound.unloadAsync();
    //         }
    //     });
    // } catch (error) {
    //     console.warn('Failed to play UI sound:', error);
    // }

    console.log(`Would play UI sound: ${type}`);
};

/**
 * Breathing rhythm audio cue
 * Plays a subtle tone at breath transitions
 */
export const playBreathCue = async (phase: 'inhale' | 'hold' | 'exhale'): Promise<void> => {
    if (Platform.OS === 'web') return;

    // In production, this would play different tones for each phase:
    // - Inhale: Rising tone
    // - Hold: Sustained soft tone
    // - Exhale: Falling tone

    console.log(`Would play breath cue: ${phase}`);
};
