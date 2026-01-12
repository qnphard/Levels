/**
 * Voice TTS Service - Calls self-hosted F5-TTS API on Hugging Face
 * 
 * Provides zero-shot voice cloning for meditation audio with binaural beats
 * and ambient background sounds.
 */

import { Audio } from 'expo-av';

// Hugging Face Space URL
const VOICE_API_URL = 'https://qnphard-piper-tts-meditation.hf.space';

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
 * Synthesize text to audio using F5-TTS voice cloning
 * Returns the audio URI that can be played with expo-av
 * 
 * Note: F5-TTS can take 7-10 minutes on CPU. This function polls until complete.
 */
export async function synthesize(options: SynthesizeOptions): Promise<string> {
    const {
        text,
        speed = 1.0,
        brainwave = 'theta',
        binauralVolume = 0.15,
        ambient = 'none',
        ambientVolume = 0.1,
        refAudio = null,
        refText = null
    } = options;

    if (!text.trim()) {
        throw new Error('Text is required');
    }

    // Gradio API call format (use /gradio_api/ prefix)
    const response = await fetch(`${VOICE_API_URL}/gradio_api/call/synthesize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: [text, speed, brainwave, binauralVolume, ambient, ambientVolume, refAudio, refText]
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    const eventId = result.event_id;

    if (!eventId) {
        throw new Error('No event ID returned from API');
    }

    // Poll for result with timeout (15 minutes max for CPU generation)
    const maxWaitTime = 15 * 60 * 1000; // 15 minutes
    const pollInterval = 3000; // 3 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
        try {
            const resultResponse = await fetch(`${VOICE_API_URL}/gradio_api/call/synthesize/${eventId}`);
            const resultText = await resultResponse.text();

            // Parse SSE response to get audio URL
            const lines = resultText.split('\n');
            let lastError = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Check for heartbeat (still processing)
                if (line.startsWith('event: heartbeat')) {
                    // Still processing, continue polling
                    break;
                }

                if (line.startsWith('event: error')) {
                    const nextLine = lines[i + 1];
                    if (nextLine && nextLine.startsWith('data: ')) {
                        lastError = nextLine.slice(6).trim();
                    }
                }

                if (line.startsWith('event: complete')) {
                    // Look for the data line after complete
                    const nextLine = lines[i + 1];
                    if (nextLine && nextLine.startsWith('data: ')) {
                        const dataStr = nextLine.slice(6).trim();
                        try {
                            const data = JSON.parse(dataStr);
                            if (Array.isArray(data) && data[0]) {
                                const fileData = data[0];
                                if (typeof fileData === 'string') {
                                    return fileData;
                                } else if (fileData.url) {
                                    return fileData.url;
                                } else if (fileData.path) {
                                    return `${VOICE_API_URL}/file=${fileData.path}`;
                                }
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse complete data:', dataStr);
                        }
                    }
                }

                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6).trim();
                    if (dataStr === 'null' || dataStr === '') continue;

                    try {
                        const data = JSON.parse(dataStr);

                        if (data.error) {
                            throw new Error(`Gradio error: ${data.error}`);
                        }

                        if (Array.isArray(data) && data[0]) {
                            const fileData = data[0];
                            if (typeof fileData === 'string') {
                                return fileData;
                            } else if (fileData.url) {
                                return fileData.url;
                            } else if (fileData.path) {
                                return `${VOICE_API_URL}/file=${fileData.path}`;
                            }
                        }
                    } catch (parseError: any) {
                        if (parseError.message.includes('Gradio error')) throw parseError;
                        // Not ready yet, continue polling
                    }
                }
            }

            if (lastError) {
                throw new Error(`API Error: ${lastError}`);
            }
        } catch (fetchError: any) {
            if (fetchError.message.includes('Gradio error') || fetchError.message.includes('API Error')) {
                throw fetchError;
            }
            // Network error, retry
            console.warn('Polling error, retrying:', fetchError.message);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timed out. F5-TTS on CPU can take 7-10 minutes. Please try again or upgrade to GPU.');
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

