/**
 * Voice TTS Service - Calls self-hosted OpenVoice V2 API on Hugging Face
 * 
 * Provides fast, zero-shot voice cloning for meditation audio with binaural beats.
 * OpenVoice V2 is significantly faster than XTTS-v2 or F5-TTS on CPU.
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

// Destructure to handle potential type/runtime differences in common environments
const { cacheDirectory, writeAsStringAsync } = FileSystem;

// Hugging Face Space URL
// Modal API URL (Replace with your actual deployed URL)
const VOICE_API_URL = 'https://qnphard--meditation-tts-fast-model-synthesize.modal.run';

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
    console.log(`Script length: ${text.length} chars`);

    // Create AbortController for timeout (5 minutes max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    try {
        // Modal returns JSON with base64-encoded audio
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
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errBody = await response.text();
            console.error('Modal API Error Detail:', errBody);
            throw new Error(`Modal API Error (${response.status}): ${errBody.slice(0, 300)}...`);
        }

        console.log('Response received, parsing JSON...');
        const result = await response.json();

        if (!result.audio_base64) {
            console.error('Response keys:', Object.keys(result));
            throw new Error('No audio_base64 in response');
        }

        console.log(`Audio received: ${(result.audio_base64.length / 1024).toFixed(1)} KB base64`);

        // Write base64 audio directly to file
        const ext = result.format || 'mp3';
        const fileUri = cacheDirectory + `meditation_${Date.now()}.${ext}`;
        await writeAsStringAsync(fileUri, result.audio_base64, {
            encoding: 'base64',
        });

        console.log('Audio saved to:', fileUri);
        return fileUri;
    } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Synthesis timed out after 5 minutes. The script may be too long.');
        }
        throw err;
    }
}

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    try {
        // In React Native / Expo, btoa is usually available or shimmed
        return btoa(binary);
    } catch (e) {
        // Fallback for environments where btoa might be missing
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let base64 = '';
        for (let i = 0; i < bytes.length; i += 3) {
            const chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            base64 += chars[(chunk >> 18) & 63] + chars[(chunk >> 12) & 63] + chars[(chunk >> 6) & 63] + chars[chunk & 63];
        }
        return base64;
    }
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

