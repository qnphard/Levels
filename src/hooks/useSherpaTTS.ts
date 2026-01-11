/**
 * useSherpaTTS - High-quality offline TTS using Sherpa-ONNX and Piper models
 * 
 * Provides professional-sounding voices that work 100% offline.
 * Requires a development build (native modules).
 * 
 * Uses official models from Hugging Face (csukuangfj repos).
 */

import { useState, useCallback } from 'react';
import RNFS from 'react-native-fs';
// @ts-ignore - Native module, types not available
import SherpaOnnxTts from 'react-native-sherpa-onnx-offline-tts';

// Check if native module is available
let isSherpaAvailable = false;
try {
    if (SherpaOnnxTts) {
        isSherpaAvailable = true;
    }
} catch (e) {
    console.log('Sherpa-ONNX not available (running in Expo Go?)');
}

export interface PiperVoice {
    id: string;
    name: string;
    gender: 'male' | 'female';
    quality: 'low' | 'medium' | 'high';
    // Individual file URLs from Hugging Face
    files: {
        model: string;
        modelConfig: string;
        tokens: string;
    };
}

// Hugging Face base URLs for csukuangfj's Piper models
const HF_BASE = 'https://huggingface.co/csukuangfj';

export const PROFESSIONAL_VOICES: PiperVoice[] = [
    {
        id: 'en_US-amy-medium',
        name: 'Amy',
        gender: 'female',
        quality: 'medium',
        files: {
            model: `${HF_BASE}/vits-piper-en_US-amy-medium/resolve/main/en_US-amy-medium.onnx`,
            modelConfig: `${HF_BASE}/vits-piper-en_US-amy-medium/resolve/main/en_US-amy-medium.onnx.json`,
            tokens: `${HF_BASE}/vits-piper-en_US-amy-medium/resolve/main/tokens.txt`,
        },
    },
    {
        id: 'en_US-ryan-medium',
        name: 'Ryan',
        gender: 'male',
        quality: 'medium',
        files: {
            model: `${HF_BASE}/vits-piper-en_US-ryan-medium/resolve/main/en_US-ryan-medium.onnx`,
            modelConfig: `${HF_BASE}/vits-piper-en_US-ryan-medium/resolve/main/en_US-ryan-medium.onnx.json`,
            tokens: `${HF_BASE}/vits-piper-en_US-ryan-medium/resolve/main/tokens.txt`,
        },
    },
];


export function useSherpaTTS() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<PiperVoice>(PROFESSIONAL_VOICES[0]);
    const [isAvailable] = useState(isSherpaAvailable);

    const getModelPath = (voiceId: string) => `${RNFS.DocumentDirectoryPath}/tts-models/${voiceId}`;

    // Download a single file with progress tracking
    const downloadFile = async (url: string, destPath: string, label: string): Promise<boolean> => {
        try {
            setDownloadStatus(`Downloading ${label}...`);

            const result = await RNFS.downloadFile({
                fromUrl: url,
                toFile: destPath,
                progress: (res) => {
                    const progress = res.bytesWritten / res.contentLength;
                    setDownloadProgress(progress);
                },
                progressDivider: 1,
            }).promise;

            return result.statusCode === 200;
        } catch (err) {
            console.error(`Failed to download ${label}:`, err);
            return false;
        }
    };

    const setupVoice = useCallback(async (voice: PiperVoice) => {
        if (!isAvailable) {
            setError('Sherpa-ONNX not available. Use a development build.');
            return;
        }

        const modelDir = getModelPath(voice.id);
        const modelPath = `${modelDir}/${voice.id}.onnx`;
        const tokensPath = `${modelDir}/tokens.txt`;
        const configPath = `${modelDir}/${voice.id}.onnx.json`;

        try {
            // Check if model already exists
            const modelExists = await RNFS.exists(modelPath);

            if (!modelExists) {
                setIsDownloading(true);
                setDownloadProgress(0);
                setError(null);

                // Create directory
                await RNFS.mkdir(modelDir);

                // Download model files
                const modelOk = await downloadFile(voice.files.model, modelPath, 'voice model');
                if (!modelOk) throw new Error('Failed to download voice model');

                const tokensOk = await downloadFile(voice.files.tokens, tokensPath, 'tokens');
                if (!tokensOk) throw new Error('Failed to download tokens');

                const configOk = await downloadFile(voice.files.modelConfig, configPath, 'config');
                if (!configOk) throw new Error('Failed to download config');

                setDownloadStatus('Download complete!');
                setIsDownloading(false);
            }

            // Initialize Sherpa-ONNX
            setDownloadStatus('Initializing TTS engine...');

            const config = {
                model: {
                    vits: {
                        model: modelPath,
                        tokens: tokensPath,
                        dataDir: '', // espeak-ng-data not needed for basic Piper
                        noiseScale: 0.667,
                        noiseScaleW: 0.8,
                        lengthScale: 1.2, // Slightly slower for meditation
                    },
                    numThreads: 2,
                    debug: false,
                    provider: 'cpu',
                },
                maxNumSentences: 1,
            };

            // The library uses modelId strings, not config objects
            // Initialize with the voice model ID
            await SherpaOnnxTts.initialize(voice.id);
            setIsInitialized(true);
            setDownloadStatus('');
            setSelectedVoice(voice);

        } catch (err: any) {
            console.error('Setup voice error:', err);
            setError(err.message || 'Failed to setup voice');
            setIsDownloading(false);
            setIsInitialized(false);
        }
    }, [isAvailable]);

    const speak = useCallback(async (text: string) => {
        if (!isInitialized) return;

        try {
            setIsSpeaking(true);

            // Use the library's built-in play function
            // generateAndPlay(text, speakerId, speed)
            // speed: 1.0 = normal, < 1.0 = slower (better for meditation)
            await SherpaOnnxTts.generateAndPlay(text, 0, 0.85);

            // Playback finished
            setIsSpeaking(false);

        } catch (error) {
            console.error('Sherpa-ONNX Speech Error:', error);
            setIsSpeaking(false);
        }
    }, [isInitialized]);

    const stop = useCallback(async () => {
        try {
            await SherpaOnnxTts.deinitialize();
            setIsSpeaking(false);
        } catch (e) {
            console.log('Stop error (may be expected):', e);
        }
    }, []);

    // Cleanup on unmount
    const cleanup = useCallback(async () => {
        try {
            await SherpaOnnxTts.deinitialize();
        } catch (e) {
            // Ignore
        }
    }, []);

    return {
        // State
        isAvailable,
        isDownloading,
        downloadProgress,
        downloadStatus,
        isInitialized,
        isSpeaking,
        error,
        selectedVoice,
        availableVoices: PROFESSIONAL_VOICES,

        // Actions
        setSelectedVoice,
        setupVoice,
        speak,
        stop,
        cleanup,
    };
}
