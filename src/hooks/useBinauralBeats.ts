/**
 * useBinauralBeats - Real-time binaural beat generation
 * Uses react-native-audio-api (Web Audio API compatible)
 * 
 * NOTE: This requires a development build (not Expo Go).
 * When running in Expo Go, this hook will gracefully disable itself.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// Brainwave frequency ranges
export type BrainwaveType = 'delta' | 'theta' | 'alpha' | 'beta';

export const BRAINWAVE_PRESETS: Record<BrainwaveType, { hz: number; label: string; description: string }> = {
    delta: { hz: 2, label: 'Delta (2 Hz)', description: 'Deep sleep, healing' },
    theta: { hz: 6, label: 'Theta (6 Hz)', description: 'Meditation, creativity' },
    alpha: { hz: 10, label: 'Alpha (10 Hz)', description: 'Relaxation, calm' },
    beta: { hz: 20, label: 'Beta (20 Hz)', description: 'Focus, alertness' },
};

// Carrier frequency presets (base tone)
export const CARRIER_PRESETS = {
    low: 100,
    medium: 200,
    high: 300,
};

interface BinauralState {
    isPlaying: boolean;
    carrierHz: number;
    beatHz: number;
    volume: number;
    isAvailable: boolean; // Whether the native module is available
}

// Try to import the audio API - it may not be available in Expo Go
let AudioContextClass: any = null;
let isAudioAPIAvailable = false;

try {
    // Dynamic import to prevent crash if module is not available
    const audioAPI = require('react-native-audio-api');
    AudioContextClass = audioAPI.AudioContext;
    isAudioAPIAvailable = true;
} catch (e) {
    console.log('react-native-audio-api not available (running in Expo Go?)');
    isAudioAPIAvailable = false;
}

export function useBinauralBeats() {
    const audioContextRef = useRef<any>(null);
    const leftOscRef = useRef<any>(null);
    const rightOscRef = useRef<any>(null);
    const leftGainRef = useRef<any>(null);
    const rightGainRef = useRef<any>(null);

    const [state, setState] = useState<BinauralState>({
        isPlaying: false,
        carrierHz: CARRIER_PRESETS.medium,
        beatHz: BRAINWAVE_PRESETS.theta.hz,
        volume: 0.3,
        isAvailable: isAudioAPIAvailable,
    });

    // Initialize AudioContext on first use
    const initAudioContext = useCallback(() => {
        if (!isAudioAPIAvailable || !AudioContextClass) {
            return null;
        }
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new AudioContextClass();
            } catch (e) {
                console.error('Failed to create AudioContext:', e);
                return null;
            }
        }
        return audioContextRef.current;
    }, []);

    // Start binaural beats
    const start = useCallback((carrierHz?: number, beatHz?: number) => {
        if (!isAudioAPIAvailable) {
            console.log('Binaural beats not available in Expo Go');
            return;
        }

        const ctx = initAudioContext();
        if (!ctx) return;

        // Use provided values or current state
        const carrier = carrierHz ?? state.carrierHz;
        const beat = beatHz ?? state.beatHz;

        // Stop any existing oscillators
        if (leftOscRef.current) {
            try { leftOscRef.current.stop(); } catch (e) { }
        }
        if (rightOscRef.current) {
            try { rightOscRef.current.stop(); } catch (e) { }
        }

        try {
            // Create left channel (carrier frequency)
            const leftOsc = ctx.createOscillator();
            leftOsc.type = 'sine';
            leftOsc.frequency.value = carrier;

            const leftPan = ctx.createStereoPanner();
            leftPan.pan.value = -1; // Full left

            const leftGain = ctx.createGain();
            leftGain.gain.value = state.volume;

            leftOsc.connect(leftGain);
            leftGain.connect(leftPan);
            leftPan.connect(ctx.destination);

            // Create right channel (carrier + beat frequency)
            const rightOsc = ctx.createOscillator();
            rightOsc.type = 'sine';
            rightOsc.frequency.value = carrier + beat;

            const rightPan = ctx.createStereoPanner();
            rightPan.pan.value = 1; // Full right

            const rightGain = ctx.createGain();
            rightGain.gain.value = state.volume;

            rightOsc.connect(rightGain);
            rightGain.connect(rightPan);
            rightPan.connect(ctx.destination);

            // Start oscillators
            const now = ctx.currentTime;
            leftOsc.start(now);
            rightOsc.start(now);

            // Store refs
            leftOscRef.current = leftOsc;
            rightOscRef.current = rightOsc;
            leftGainRef.current = leftGain;
            rightGainRef.current = rightGain;

            setState(prev => ({
                ...prev,
                isPlaying: true,
                carrierHz: carrier,
                beatHz: beat,
            }));
        } catch (e) {
            console.error('Failed to start binaural beats:', e);
        }
    }, [initAudioContext, state.carrierHz, state.beatHz, state.volume]);

    // Stop binaural beats
    const stop = useCallback(() => {
        if (leftOscRef.current) {
            try {
                leftOscRef.current.stop();
                leftOscRef.current.disconnect();
            } catch (e) { }
            leftOscRef.current = null;
        }
        if (rightOscRef.current) {
            try {
                rightOscRef.current.stop();
                rightOscRef.current.disconnect();
            } catch (e) { }
            rightOscRef.current = null;
        }

        setState(prev => ({ ...prev, isPlaying: false }));
    }, []);

    // Set volume (0-1)
    const setVolume = useCallback((volume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));

        if (leftGainRef.current) {
            leftGainRef.current.gain.value = clampedVolume;
        }
        if (rightGainRef.current) {
            rightGainRef.current.gain.value = clampedVolume;
        }

        setState(prev => ({ ...prev, volume: clampedVolume }));
    }, []);

    // Change beat frequency in real-time
    const setBeatFrequency = useCallback((beatHz: number) => {
        if (rightOscRef.current) {
            rightOscRef.current.frequency.value = state.carrierHz + beatHz;
        }
        setState(prev => ({ ...prev, beatHz }));
    }, [state.carrierHz]);

    // Change carrier frequency (requires restart for smooth transition)
    const setCarrierFrequency = useCallback((carrierHz: number) => {
        if (state.isPlaying) {
            // Restart with new carrier
            start(carrierHz, state.beatHz);
        } else {
            setState(prev => ({ ...prev, carrierHz }));
        }
    }, [state.isPlaying, state.beatHz, start]);

    // Set brainwave preset
    const setBrainwave = useCallback((type: BrainwaveType) => {
        const preset = BRAINWAVE_PRESETS[type];
        setBeatFrequency(preset.hz);
    }, [setBeatFrequency]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stop();
            if (audioContextRef.current) {
                try {
                    audioContextRef.current.close();
                } catch (e) { }
                audioContextRef.current = null;
            }
        };
    }, [stop]);

    return {
        ...state,
        start,
        stop,
        setVolume,
        setBeatFrequency,
        setCarrierFrequency,
        setBrainwave,
        presets: BRAINWAVE_PRESETS,
    };
}
