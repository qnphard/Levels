import { create } from 'zustand';
import { Audio } from 'expo-av';
import { geminiService } from '../services/geminiService';
import * as voiceService from '../services/voiceTTSService';
import { AI_CONFIG } from '../config/aiConfig';
import { generateMeditationScript, sectionsToText, MeditationPurpose, MeditationDuration, MeditationVibe } from '../data/meditationScripts';

interface GenerationParams {
    purpose: MeditationPurpose;
    duration: MeditationDuration;
    vibe: MeditationVibe;
    usePremiumVoice: boolean;
    speed: number;
    brainwave: string;
    binauralVolume: number;
    ambient: string;
    ambientVolume: number;
}

interface MeditationGenerationState {
    isGenerating: boolean;
    progress: string; // 'brewing_script' | 'synthesizing_audio' | 'completed' | 'error' | 'idle'
    progressValue: number;
    generatedScript: string | null;
    audioUri: string | null;
    error: string | null;
    sound: Audio.Sound | null;

    // Actions
    startGeneration: (params: GenerationParams) => Promise<void>;
    reset: () => void;
    playResult: () => Promise<void>;
    stopPlayback: () => Promise<void>;
}

export const useMeditationGenerationStore = create<MeditationGenerationState>((set, get) => ({
    isGenerating: false,
    progress: 'idle',
    progressValue: 0,
    generatedScript: null,
    audioUri: null,
    error: null,
    sound: null,

    startGeneration: async (params) => {
        set({ isGenerating: true, progress: 'brewing_script', progressValue: 5, error: null, generatedScript: null, audioUri: null });

        let interval: NodeJS.Timeout | null = null;

        // Helper to simulate progress
        const animateProgress = (start: number, end: number, durationMs: number) => {
            if (interval) clearInterval(interval);
            const stepTime = 100;
            const steps = durationMs / stepTime;
            const increment = (end - start) / steps;
            let current = start;

            interval = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    if (interval) clearInterval(interval);
                }
                set({ progressValue: Math.round(current) });
            }, stepTime);
        };

        // Sim 0-15% for script
        animateProgress(5, 15, 4000);

        try {
            // 1. Generate Script
            let script = '';
            if (AI_CONFIG.GEMINI_API_KEY) {
                try {
                    script = await geminiService.generateScript({
                        purpose: params.purpose,
                        durationMinutes: params.duration,
                        vibe: params.vibe,
                    });
                } catch (err) {
                    console.warn('Gemini generation failed, falling back to templates:', err);
                    const sections = generateMeditationScript(params.purpose, params.duration);
                    script = sectionsToText(sections);
                }
            } else {
                const sections = generateMeditationScript(params.purpose, params.duration);
                script = sectionsToText(sections);
            }

            set({ generatedScript: script, progress: 'synthesizing_audio', progressValue: 15 });

            // 2. Synthesize Audio
            // XTTS-v2 speed: ~15 chars/sec on CPU (approx)
            // Estimation: 500 chars -> 35s. 
            // Clamp betwen 10s and 90s.
            const estimatedDurationMs = (script.length / 15) * 1000;
            const clampedDuration = Math.max(10000, Math.min(estimatedDurationMs, 90000));

            animateProgress(15, 95, clampedDuration);

            // 2. Synthesize Audio
            if (params.usePremiumVoice) {
                // Generate URI only
                const uri = await voiceService.synthesize({
                    text: script,
                    speed: params.speed,
                    brainwave: params.brainwave,
                    binauralVolume: params.binauralVolume,
                    ambient: params.ambient,
                    ambientVolume: params.ambientVolume,
                });

                // Store URI, mark complete.
                if (interval) clearInterval(interval);
                set({ audioUri: uri, progress: 'completed', isGenerating: false, progressValue: 100 });
            } else {
                if (interval) clearInterval(interval);
                set({ progress: 'completed', isGenerating: false, progressValue: 100 });
            }

        } catch (err: any) {
            console.error('Generation failed:', err);
            set({ error: err.message || 'Failed to generate', progress: 'error', isGenerating: false });
        }
    },

    reset: () => {
        const { sound } = get();
        if (sound) {
            sound.unloadAsync();
        }
        set({ isGenerating: false, progress: 'idle', generatedScript: null, audioUri: null, error: null, sound: null });
    },

    playResult: async () => {
        const { sound, audioUri } = get();

        if (sound) {
            await sound.playAsync();
            return;
        }

        if (audioUri) {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true }
                );
                set({ sound: newSound });
            } catch (e) {
                console.error("Failed to play audio", e);
            }
        }
    },

    stopPlayback: async () => {
        const { sound } = get();
        if (sound) {
            await sound.stopAsync();
        }
    }
}));
