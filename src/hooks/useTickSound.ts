import { Audio } from 'expo-av';
import { useCallback, useRef, useEffect } from 'react';

// Very short tick sound (base64-encoded WAV)
// This is a simple 50ms click/tick sound
const TICK_SOUND_URI = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

export const useTickSound = () => {
    const soundRef = useRef<Audio.Sound | null>(null);
    const isLoadedRef = useRef(false);

    useEffect(() => {
        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: TICK_SOUND_URI },
                    { shouldPlay: false, volume: 0.3 }
                );
                soundRef.current = sound;
                isLoadedRef.current = true;
            } catch (error) {
                console.warn('Failed to load tick sound:', error);
            }
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const playTick = useCallback(async () => {
        if (soundRef.current && isLoadedRef.current) {
            try {
                await soundRef.current.setPositionAsync(0);
                await soundRef.current.playAsync();
            } catch (error) {
                // Silently fail - sound is optional
            }
        }
    }, []);

    return { playTick };
};

export default useTickSound;
