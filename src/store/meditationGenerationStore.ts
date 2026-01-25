import { create } from 'zustand';
import { Audio } from 'expo-av';
import { geminiService, MeditationPurpose, MeditationStyle, MeditationDuration, GeneratedScript } from '../services/geminiService';
import * as voiceService from '../services/voiceTTSService';
import { AI_CONFIG } from '../config/aiConfig';
import { generateMeditationScript, sectionsToText } from '../data/meditationScripts';
import { useSavedMeditationsStore } from './savedMeditationsStore';

interface GenerationParams {
    purpose: MeditationPurpose;
    duration: MeditationDuration;
    style: MeditationStyle;
    usePremiumVoice: boolean;
    voiceId: string;
    speed: number;
    brainwave: string;
    binauralVolume: number;
    ambient: string;
    ambientVolume: number;
    userGoal?: string;
}

interface MeditationGenerationState {
    isGenerating: boolean;
    progress: string; // 'brewing_script' | 'synthesizing_audio' | 'completed' | 'error' | 'idle'
    progressValue: number;
    generatedScript: GeneratedScript | null;
    scriptText: string | null;
    audioUris: string[] | null;
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
    scriptText: null,
    audioUris: null,
    error: null,
    sound: null,

    startGeneration: async (params) => {
        console.log('[MeditationGen] Starting generation with params:', JSON.stringify(params));
        set({ isGenerating: true, progress: 'brewing_script', progressValue: 5, error: null, generatedScript: null, scriptText: null, audioUris: null });

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
            let script: GeneratedScript | null = null;
            let scriptText = '';

            if (AI_CONFIG.GEMINI_API_KEY) {
                try {
                    script = await geminiService.generateScript({
                        purpose: params.purpose,
                        duration: params.duration,
                        style: params.style,
                        binaural: params.brainwave,
                        background: params.ambient,
                        userGoal: params.userGoal,
                    });
                    scriptText = geminiService.scriptToText(script);
                } catch (err) {
                    console.warn('Gemini generation failed, falling back to templates:', err);
                    // Fallback to old template system
                    const sections = generateMeditationScript(params.purpose as any, params.duration as any);
                    scriptText = sectionsToText(sections);
                }
            } else {
                const sections = generateMeditationScript(params.purpose as any, params.duration as any);
                scriptText = sectionsToText(sections);
            }

            console.log('[MeditationGen] Script generated, length:', scriptText.length, 'chars');
            set({ generatedScript: script, scriptText, progress: 'synthesizing_audio', progressValue: 15 });

            // 2. Synthesize Audio
            // MeloTTS speed: very fast on GPU
            // Estimation: 500 chars -> 10s. 
            // Clamp betwen 5s and 60s.
            const estimatedDurationMs = (scriptText.length / 50) * 1000;
            const clampedDuration = Math.max(5000, Math.min(estimatedDurationMs, 60000));

            animateProgress(15, 95, clampedDuration);

            // 2. Synthesize Audio
            if (params.usePremiumVoice) {
                // Generate audio URLs (one or more segments)
                const uris = await voiceService.synthesize({
                    text: scriptText,
                    speed: params.speed,
                    voiceId: params.voiceId,
                    engine: 'neural',
                    brainwave: params.brainwave,
                    binauralVolume: params.binauralVolume,
                    ambient: params.ambient,
                    ambientVolume: params.ambientVolume,
                });

                // Store URI, mark complete.
                console.log('[MeditationGen] TTS complete, got', uris.length, 'audio URIs');
                if (interval) clearInterval(interval);
                set({ audioUris: uris, progress: 'completed', isGenerating: false, progressValue: 100 });

                // Persist to "Your Meditations"
                try {
                    useSavedMeditationsStore.getState().addMeditation({
                        purpose: params.purpose,
                        duration: params.duration,
                        style: params.style,
                        voiceId: params.voiceId,
                        speed: params.speed,
                        brainwave: params.brainwave,
                        binauralVolume: params.binauralVolume,
                        ambient: params.ambient,
                        ambientVolume: params.ambientVolume,
                        userGoal: params.userGoal,
                        scriptText,
                        audioUris: uris,
                    });
                } catch (e) {
                    console.warn('[MeditationGen] Failed to save meditation:', e);
                }
            } else {
                if (interval) clearInterval(interval);
                set({ progress: 'completed', isGenerating: false, progressValue: 100 });
            }

        } catch (err: any) {
            console.error('[MeditationGen] Generation failed:', err);
            const errorMessage = err?.message || 'Failed to generate';
            console.error('[MeditationGen] Error message:', errorMessage);
            if (interval) clearInterval(interval);
            set({ error: errorMessage, progress: 'error', isGenerating: false });
        }
    },

    reset: () => {
        const { sound } = get();
        if (sound) {
            sound.unloadAsync();
        }
        set({ isGenerating: false, progress: 'idle', generatedScript: null, audioUris: null, error: null, sound: null });
    },

    playResult: async () => {
        const { sound, audioUris } = get();
        console.log('[MeditationGen] playResult called, audioUris:', audioUris?.length, 'sound exists:', !!sound);

        if (sound) {
            console.log('[MeditationGen] Resuming existing sound');
            await sound.playAsync();
            return;
        }

        if (audioUris && audioUris.length > 0) {
            try {
                console.log('[MeditationGen] Creating new sound from URIs:', audioUris[0]?.substring(0, 100));
                const newSound =
                    audioUris.length === 1
                        ? await voiceService.playAudio(audioUris[0])
                        : await voiceService.playAudioSequence(audioUris);
                console.log('[MeditationGen] Sound created successfully');
                set({ sound: newSound });
            } catch (e) {
                console.error("[MeditationGen] Failed to play audio", e);
            }
        } else {
            console.warn('[MeditationGen] playResult called but no audioUris available');
        }
    },

    stopPlayback: async () => {
        const { sound } = get();
        if (sound) {
            await sound.stopAsync();
        }
    }
}));
