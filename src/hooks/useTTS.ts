/**
 * useTTS - Custom hook for Text-to-Speech functionality
 * Uses expo-speech for on-device TTS
 */

import * as Speech from 'expo-speech';
import { useState, useEffect, useCallback } from 'react';

export interface Voice {
    identifier: string;
    name: string;
    quality: string;
    language: string;
}

export interface TTSOptions {
    voice?: string;
    pitch?: number;  // 0.5 to 2.0, default 1.0
    rate?: number;   // 0.1 to 2.0, default 1.0 (slower = better for meditation)
    onDone?: () => void;
    onStart?: () => void;
    onError?: (error: any) => void;
}

export function useTTS() {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState<string | undefined>();

    // Load available voices
    useEffect(() => {
        const loadVoices = async () => {
            const availableVoices = await Speech.getAvailableVoicesAsync();

            // Filter to English voices and sort by quality
            const englishVoices = availableVoices
                .filter(v => v.language.startsWith('en'))
                .map(v => ({
                    identifier: v.identifier,
                    name: v.name,
                    quality: v.quality || 'Default',
                    language: v.language,
                }))
                .sort((a, b) => {
                    // Prefer "Enhanced" or high quality voices
                    if (a.quality.includes('Enhanced') && !b.quality.includes('Enhanced')) return -1;
                    if (!a.quality.includes('Enhanced') && b.quality.includes('Enhanced')) return 1;
                    return a.name.localeCompare(b.name);
                });

            setVoices(englishVoices);

            // Auto-select first high-quality voice if available
            const enhanced = englishVoices.find(v => v.quality.includes('Enhanced'));
            if (enhanced) {
                setSelectedVoice(enhanced.identifier);
            } else if (englishVoices.length > 0) {
                setSelectedVoice(englishVoices[0].identifier);
            }
        };

        loadVoices();
    }, []);

    // Speak text
    const speak = useCallback(async (text: string, options?: TTSOptions) => {
        try {
            // Stop any ongoing speech
            await Speech.stop();

            setIsSpeaking(true);

            await Speech.speak(text, {
                voice: options?.voice || selectedVoice,
                pitch: options?.pitch || 1.0,
                rate: options?.rate || 0.85, // Slightly slower for meditation
                onDone: () => {
                    setIsSpeaking(false);
                    options?.onDone?.();
                },
                onStart: () => {
                    options?.onStart?.();
                },
                onError: (error) => {
                    setIsSpeaking(false);
                    options?.onError?.(error);
                },
            });
        } catch (error) {
            setIsSpeaking(false);
            console.error('TTS Error:', error);
            options?.onError?.(error);
        }
    }, [selectedVoice]);

    // Stop speaking
    const stop = useCallback(async () => {
        await Speech.stop();
        setIsSpeaking(false);
    }, []);

    // Check if currently speaking
    const checkSpeaking = useCallback(async () => {
        const speaking = await Speech.isSpeakingAsync();
        setIsSpeaking(speaking);
        return speaking;
    }, []);

    return {
        voices,
        isSpeaking,
        selectedVoice,
        setSelectedVoice,
        speak,
        stop,
        checkSpeaking,
    };
}
