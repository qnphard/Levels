import { create } from 'zustand';
import { Audio } from 'expo-av';
import { geminiService, MeditationPurpose, MeditationStyle, MeditationDuration, GeneratedScript } from '../services/geminiService';
import * as voiceService from '../services/voiceTTSService';
import type { PollyEngine } from '../services/voiceTTSService';
import { AI_CONFIG } from '../config/aiConfig';
import {
    generateMeditationScript,
    sectionsToText,
    purposeForTemplate,
    durationMinutesForTemplate,
} from '../data/meditationScripts';
import { useSavedMeditationsStore } from './savedMeditationsStore';
import { padScriptTextToMinimumWords } from '../data/meditationPadding';

interface GenerationParams {
    purpose: MeditationPurpose;
    duration: MeditationDuration;
    style: MeditationStyle;
    usePremiumVoice: boolean;
    voiceId: string;
    /** Amazon Polly engine; default generative in UI. */
    pollyEngine?: PollyEngine;
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
                    const sections = generateMeditationScript(
                        purposeForTemplate(params.purpose),
                        durationMinutesForTemplate(params.duration),
                    );
                    scriptText = sectionsToText(sections);
                }
            } else {
                const sections = generateMeditationScript(
                    purposeForTemplate(params.purpose),
                    durationMinutesForTemplate(params.duration),
                );
                scriptText = sectionsToText(sections);
            }

            scriptText = String(scriptText ?? '').trim();
            if (!scriptText.length) {
                const sections = generateMeditationScript(
                    purposeForTemplate(params.purpose),
                    durationMinutesForTemplate(params.duration),
                );
                scriptText = sectionsToText(sections).trim();
            }
            if (!scriptText.length) {
                throw new Error('Could not build a meditation script. Check Gemini response or templates.');
            }

            const padded = padScriptTextToMinimumWords(scriptText, params.duration);
            scriptText = padded.text;
            if (padded.padded) {
                console.warn(
                    '[MeditationGen] Script was below duration target; appended neutral padding:',
                    padded.wordsBefore,
                    '→',
                    padded.wordsAfter,
                    'words'
                );
            }

            const approxWords = scriptText.split(/\s+/).filter(Boolean).length;
            console.log('[MeditationGen] Script ready for TTS, length:', scriptText.length, 'chars, ~words:', approxWords);
            set({ generatedScript: script, scriptText, progress: 'synthesizing_audio', progressValue: 15 });

            // 2. Synthesize Audio
            // MeloTTS speed: very fast on GPU
            // Rough UI pacing for the progress bar (~50 chars/s for synthesis wait). Cap at 15 min so long scripts don't imply "done in 1 minute".
            const estimatedDurationMs = (scriptText.length / 50) * 1000;
            const clampedDuration = Math.max(5000, Math.min(estimatedDurationMs, 15 * 60 * 1000));

            animateProgress(15, 95, clampedDuration);

            // 2. Synthesize Audio
            if (params.usePremiumVoice) {
                const engine = params.pollyEngine ?? 'generative';
                const synth = await voiceService.synthesize({
                    text: scriptText,
                    speed: params.speed,
                    voiceId: params.voiceId,
                    engine,
                    brainwave: params.brainwave,
                    binauralVolume: params.binauralVolume,
                    ambient: params.ambient,
                    ambientVolume: params.ambientVolume,
                });
                const uris = synth.audioUris.filter((u) => typeof u === 'string' && u.length > 0);
                if (uris.length === 0) {
                    throw new Error('Voice synthesis returned no audio. Check your TTS backend and EXPO_PUBLIC_TTS_API_URL.');
                }

                const engineUsed = synth.engineUsed ?? engine;

                // Store URI, mark complete.
                console.log('[MeditationGen] TTS complete, got', uris.length, 'audio URIs', { engineUsed });
                if (interval) clearInterval(interval);
                set({ audioUris: uris, progress: 'completed', isGenerating: false, progressValue: 100 });

                // Persist to "Your Meditations"
                try {
                    useSavedMeditationsStore.getState().addMeditation({
                        purpose: params.purpose,
                        duration: params.duration,
                        style: params.style,
                        voiceId: params.voiceId,
                        pollyEngine: engineUsed,
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
            const errorMessage =
                typeof err?.message === 'string' && err.message
                    ? err.message
                    : typeof err === 'string'
                      ? err
                      : 'Failed to generate';
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
