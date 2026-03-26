/**
 * AI Configuration
 *
 * Set `EXPO_PUBLIC_GEMINI_API_KEY` in `.env` (never commit keys — Google disables leaked keys).
 * https://aistudio.google.com/apikey
 */

const geminiKey =
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GEMINI_API_KEY) || '';

export const AI_CONFIG = {
    GEMINI_API_KEY: geminiKey,
    OPENAI_API_KEY: '', // Add your OpenAI API key here
    /**
     * Gemini 3 Flash (Google AI / Vertex model id). Override with EXPO_PUBLIC_GEMINI_MODEL if your project lists a different name.
     * @see https://ai.google.dev/gemini-api/docs/models
     */
    MODEL_NAME:
        (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GEMINI_MODEL) || 'gemini-3-flash-preview',
    TTS_PROVIDER: 'openai', // 'openai' or 'xtts-v2' (fallback)
};
