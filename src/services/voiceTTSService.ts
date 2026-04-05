/**
 * Voice TTS Service - Calls your backend which uses Amazon Polly
 *
 * IMPORTANT:
 * - We do NOT call Amazon Polly directly from the app (no AWS keys in the client).
 * - The backend should:
 *   - chunk long text to fit Polly limits,
 *   - synthesize with Polly,
 *   - return one or more audio URLs (recommended), OR base64 audio as a fallback.
 */

import { Audio, type AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { TTS_CONFIG } from '../config/ttsConfig';

// Destructure to handle potential type/runtime differences in common environments
const { cacheDirectory, writeAsStringAsync, downloadAsync } = FileSystem;

const FALLBACK_API_URL = 'https://hc4beycor4.execute-api.eu-west-1.amazonaws.com';

/**
 * Backend base URL (API Gateway / Cloudflare Worker / etc.)
 * Must expose POST /tts/polly
 */
const getApiUrl = () => (TTS_CONFIG.API_URL || FALLBACK_API_URL).replace(/\/+$/, '');

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

/** Matches Amazon Polly `Engine` on SynthesizeSpeech (see AWS docs). */
export type PollyEngine = 'standard' | 'neural' | 'generative' | 'long-form';

export interface PollyVoicePreset {
    id: string; // Polly VoiceId
    name: string;
    locale: 'en-US' | 'en-GB';
    gender: 'Female' | 'Male';
    vibe: 'warm' | 'calm' | 'bright' | 'grounded';
    /** Hint: voice supports generative engine in many regions (AWS voicelist). */
    supportsGenerative?: boolean;
}

// Meditation-friendly Polly voices (English). Generative availability varies by region.
export const POLLY_VOICE_PRESETS: PollyVoicePreset[] = [
    // en-US
    { id: 'Joanna', name: 'Joanna', locale: 'en-US', gender: 'Female', vibe: 'calm', supportsGenerative: true },
    { id: 'Matthew', name: 'Matthew', locale: 'en-US', gender: 'Male', vibe: 'grounded', supportsGenerative: true },
    { id: 'Ruth', name: 'Ruth', locale: 'en-US', gender: 'Female', vibe: 'warm', supportsGenerative: true },
    { id: 'Danielle', name: 'Danielle', locale: 'en-US', gender: 'Female', vibe: 'bright', supportsGenerative: true },
    { id: 'Gregory', name: 'Gregory', locale: 'en-US', gender: 'Male', vibe: 'warm', supportsGenerative: true },
    { id: 'Ivy', name: 'Ivy', locale: 'en-US', gender: 'Female', vibe: 'bright', supportsGenerative: true },
    { id: 'Kendra', name: 'Kendra', locale: 'en-US', gender: 'Female', vibe: 'warm', supportsGenerative: true },
    { id: 'Kimberly', name: 'Kimberly', locale: 'en-US', gender: 'Female', vibe: 'calm', supportsGenerative: true },
    { id: 'Salli', name: 'Salli', locale: 'en-US', gender: 'Female', vibe: 'bright', supportsGenerative: true },
    { id: 'Joey', name: 'Joey', locale: 'en-US', gender: 'Male', vibe: 'bright', supportsGenerative: true },
    { id: 'Justin', name: 'Justin', locale: 'en-US', gender: 'Male', vibe: 'bright', supportsGenerative: true },
    { id: 'Kevin', name: 'Kevin', locale: 'en-US', gender: 'Male', vibe: 'calm', supportsGenerative: true },
    { id: 'Stephen', name: 'Stephen', locale: 'en-US', gender: 'Male', vibe: 'grounded', supportsGenerative: true },

    // en-GB
    { id: 'Amy', name: 'Amy', locale: 'en-GB', gender: 'Female', vibe: 'warm', supportsGenerative: true },
    { id: 'Emma', name: 'Emma', locale: 'en-GB', gender: 'Female', vibe: 'calm', supportsGenerative: true },
    { id: 'Brian', name: 'Brian', locale: 'en-GB', gender: 'Male', vibe: 'grounded', supportsGenerative: true },
    { id: 'Arthur', name: 'Arthur', locale: 'en-GB', gender: 'Male', vibe: 'warm', supportsGenerative: true },
];

export function getPollyVoiceLabel(voiceId: string) {
    const v = POLLY_VOICE_PRESETS.find((x) => x.id === voiceId);
    if (!v) return voiceId;
    return `${v.name} (${v.locale}, ${v.gender})`;
}

/** Short label for saved UI / debug */
export function getPollyEngineLabel(engine?: string) {
    if (!engine) return '';
    switch (engine) {
        case 'generative':
            return 'Generative';
        case 'neural':
            return 'Neural';
        case 'standard':
            return 'Standard';
        case 'long-form':
            return 'Long-form';
        default:
            return engine;
    }
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
    voiceId?: string;
    engine?: PollyEngine;
    brainwave?: string;
    binauralVolume?: number;
    ambient?: string;
    ambientVolume?: number;
    refAudio?: string | null;
    refText?: string | null;
}

export type SynthesizeResult = {
    audioUris: string[];
    /** Engine the backend used (may differ if generative fell back to neural). */
    engineUsed?: PollyEngine;
    engineFallback?: boolean;
};

/**
 * Check if the Voice API is available
 */
export async function checkAvailability(): Promise<boolean> {
    try {
        const apiUrl = getApiUrl();
        if (!apiUrl) return false;
        const response = await fetch(`${apiUrl}/health`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Synthesize text to audio using Amazon Polly (via backend)
 *
 * Returns one or more audio URIs that can be played with expo-av.
 * For long meditations, the backend should return multiple segments.
 */
export async function synthesize(options: SynthesizeOptions): Promise<SynthesizeResult> {
    const {
        text,
        speed = 1.0,
        voiceId = 'Joanna',
        engine = 'generative',
        // These are currently ignored by Polly backend unless you implement mixing server-side.
        // We keep them in the interface so the UI doesn't break.
        brainwave = 'theta',
        binauralVolume = 0.15,
        ambient = 'none',
        ambientVolume = 0.1,
        refAudio = null // eslint-disable-line @typescript-eslint/no-unused-vars
    } = options;

    if (!text.trim()) {
        throw new Error('Text is required');
    }

    const apiUrl = getApiUrl();
    if (!apiUrl) {
        throw new Error('TTS API URL missing. Set EXPO_PUBLIC_TTS_API_URL.');
    }

    console.log(`Synthesizing via Polly backend: ${apiUrl}`);
    console.log(`Script length: ${text.length} chars`);

    // Create AbortController for timeout (10 minutes max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

    try {
        const response = await fetch(`${apiUrl}/tts/polly`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                speed,
                // Backend can map this to Polly prosody/speaking rate.
                // Optional tuning:
                voiceId,
                engine,
                outputFormat: 'mp3',
                // Optional layers (backend may choose to bake into mp3 if supported)
                brainwave,
                binauralVolume,
                ambient,
                ambientVolume,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errBody = await response.text();
            console.error('TTS API Error Detail:', errBody);
            throw new Error(`TTS API Error (${response.status}): ${errBody.slice(0, 300)}...`);
        }

        const result: {
            audioUrls?: string[];
            audio_base64?: string;
            format?: string;
            engine?: PollyEngine;
            engineFallback?: boolean;
        } = await response.json();

        const meta: Pick<SynthesizeResult, 'engineUsed' | 'engineFallback'> = {
            engineUsed: result.engine,
            engineFallback: Boolean(result.engineFallback),
        };

        // Preferred: backend returns URLs (array)
        if (Array.isArray(result.audioUrls) && result.audioUrls.length > 0) {
            // Download to local cache so presigned URLs expiring won't break playback.
            // On web (or if cacheDirectory is unavailable), fall back to streaming URLs.
            if (!cacheDirectory || typeof downloadAsync !== 'function') {
                return { audioUris: result.audioUrls, ...meta };
            }

            const localUris: string[] = [];
            for (let i = 0; i < result.audioUrls.length; i++) {
                const url = String(result.audioUrls[i]);
                const fileUri = `${cacheDirectory}polly_${Date.now()}_${i}.mp3`;
                const dl = await downloadAsync(url, fileUri);
                localUris.push(dl.uri);
            }

            return { audioUris: localUris, ...meta };
        }

        // Fallback: base64 audio (single file)
        if (result.audio_base64) {
            const ext = result.format || 'mp3';
            const fileUri = cacheDirectory + `meditation_${Date.now()}.${ext}`;
            await writeAsStringAsync(fileUri, result.audio_base64, { encoding: 'base64' });
            return { audioUris: [fileUri], ...meta };
        }

        console.error('Response keys:', Object.keys(result));
        throw new Error('TTS response missing audioUrls/audio_base64');
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
 * Play multiple audio segments sequentially using a single Sound instance.
 * Re-registers the status callback after each load — some platforms clear listeners on unload.
 */
export async function playAudioSequence(audioUrls: string[]): Promise<Audio.Sound> {
    if (audioUrls.length === 0) {
        throw new Error('No audio URLs to play');
    }

    const sound = new Audio.Sound();
    let index = 0;
    let isAdvancing = false;

    const loadAndPlay = async (uri: string) => {
        await sound.unloadAsync().catch(() => undefined);
        // Brief gap helps Android/iOS complete unload before the next load (avoids silent playback).
        await new Promise<void>((r) => setTimeout(r, 50));
        await sound.loadAsync({ uri }, { shouldPlay: true });
    };

    const onStatus = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if ('error' in status && status.error) {
                console.warn('[playAudioSequence] playback error', status.error);
            }
            return;
        }
        if (!status.didJustFinish) return;
        if (isAdvancing) return;
        isAdvancing = true;

        void (async () => {
            try {
                index += 1;
                if (index < audioUrls.length) {
                    await loadAndPlay(audioUrls[index]);
                    sound.setOnPlaybackStatusUpdate(onStatus);
                }
            } catch (e) {
                console.error('[playAudioSequence] failed advancing to segment', index, e);
            } finally {
                isAdvancing = false;
            }
        })();
    };

    sound.setOnPlaybackStatusUpdate(onStatus);
    await loadAndPlay(audioUrls[0]);
    sound.setOnPlaybackStatusUpdate(onStatus);
    return sound;
}

/**
 * Synthesize and play meditation in one call
 */
export async function synthesizeAndPlay(options: SynthesizeOptions): Promise<Audio.Sound> {
    const { audioUris } = await synthesize(options);
    return audioUris.length === 1 ? playAudio(audioUris[0]) : playAudioSequence(audioUris);
}

