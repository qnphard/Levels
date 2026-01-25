/**
 * TTS Configuration
 *
 * IMPORTANT:
 * - Do NOT put AWS access keys in the mobile app.
 * - Point the app at your backend (API Gateway/Lambda/etc.) that calls Amazon Polly.
 *
 * Expo public env vars:
 * - EXPO_PUBLIC_TTS_API_URL (e.g. https://xxxx.execute-api.us-east-1.amazonaws.com)
 */
const FALLBACK_API_URL = 'https://hc4beycor4.execute-api.eu-west-1.amazonaws.com';

export const TTS_CONFIG = {
  API_URL: (process.env.EXPO_PUBLIC_TTS_API_URL || FALLBACK_API_URL).replace(/\/+$/, ''),
};

