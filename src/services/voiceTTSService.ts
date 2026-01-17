/**
 * Voice TTS Service - Calls self-hosted OpenVoice V2 API on Hugging Face
 * 
 * Provides fast, zero-shot voice cloning for meditation audio with binaural beats.
 * OpenVoice V2 is significantly faster than XTTS-v2 or F5-TTS on CPU.
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Hugging Face Space URL
// Modal API URL (Replace with your actual deployed URL)
const VOICE_API_URL = 'https://REPLACE_WITH_YOUR_MODAL_URL';

export interface BrainwavePreset {
    id: string;
    name: string;
    hz: number;
    description: string;
}

// Brainwave presets for binaural beats
export const BRAINWAVE_PRESETS: BrainwavePreset[] = [
    { id: 'none', name: 'None', hz: 0, description: 'No binaural beats' },
    { id: 'delta', name: 'Delta', hz: 2, description: 'Deep sleep & healing' },
    { id: 'theta', name: 'Theta', hz: 6, description: 'Meditation & creativity' },
    { id: 'alpha', name: 'Alpha', hz: 10, description: 'Relaxation & calm' },
    { id: 'beta', name: 'Beta', hz: 18, description: 'Focus & concentration' },
];

export interface AmbientPreset {
    id: string;
    name: string;
    icon: string;
    description: string;
}

// Ambient background sound presets
export const AMBIENT_PRESETS: AmbientPreset[] = [
    { id: 'none', name: 'None', icon: 'volume-mute-outline', description: 'No background sound' },
    { id: 'rain', name: 'Rain', icon: 'rainy', description: 'Gentle rainfall' },
    { id: 'ocean', name: 'Ocean', icon: 'water', description: 'Calm ocean waves' },
    { id: 'forest', name: 'Forest', icon: 'leaf', description: 'Forest ambience with birds' },
    { id: 'wind', name: 'Wind', icon: 'cloudy', description: 'Soft wind sounds' },
];

export interface SynthesizeOptions {
    text: string;
    speed?: number;
    brainwave?: string;
    binauralVolume?: number;
    ambient?: string;
    ambientVolume?: number;
    refAudio?: string | null;
    refText?: string | null;
}

/**
 * Check if the Voice API is available
 */
export async function checkAvailability(): Promise<boolean> {
    try {
        const response = await fetch(VOICE_API_URL, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Synthesize text to audio using OpenVoice V2 voice cloning
 * Returns the audio URI that can be played with expo-av
 * 
 * Note: OpenVoice V2 is optimized for speed (~20s for 1m on CPU).
 */
export async function synthesize(options: SynthesizeOptions): Promise<string> {
    const {
        text,
        speed = 1.0,
        brainwave = 'theta',
        binauralVolume = 0.15,
        refAudio = null
    } = options;

    if (!text.trim()) {
        throw new Error('Text is required');
    }

    console.log(`Synthesizing via Modal: ${VOICE_API_URL}`);

    // Modal returns a WAV file binary
    const response = await fetch(VOICE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
            speed,
            brainwave,
            binaural_volume: binauralVolume,
            // Future: ref_audio_base64
        }),
    });

    if (!response.ok) {
        throw new Error(`Modal API Error: ${response.status} - Check if URL is correct`);
    }

    // Convert Blob to Base64 and Save
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            try {
                const base64data = (reader.result as string).split(',')[1];
                const fileUri = FileSystem.cacheDirectory + `meditation_${Date.now()}.wav`;

                await FileSystem.writeAsStringAsync(fileUri, base64data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                resolve(fileUri);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = reject;
    });
}

/**
 * Play audio from a URL using expo-av
 */
export async function playAudio(audioUrl: string): Promise<Audio.Sound> {
    const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
    );
    return sound;
}

/**
 * Synthesize and play meditation in one call
 */
export async function synthesizeAndPlay(options: SynthesizeOptions): Promise<Audio.Sound> {
    const audioUrl = await synthesize(options);
    return playAudio(audioUrl);
}

