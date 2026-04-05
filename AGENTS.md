# AGENTS.md

## Cursor Cloud specific instructions

### Product overview
"Levels" is a React Native/Expo (SDK 54) meditation app. The primary target platforms are **iOS and Android**; web support is partially configured but non-functional at runtime due to `@shopify/react-native-skia` requiring APIs (RuntimeEffect) unavailable in browsers.

### Running the dev server
```bash
npm start          # alias for: npx expo start
npm run web        # alias for: npx expo start --web
```
The Metro bundler will start and bundle ~1,800 modules. On web, the bundle loads but Skia crashes before React can mount. Use `--web --port <PORT>` to pick a specific port.

### Build / export
```bash
npx expo export --platform web   # produces dist/ with static web build
```
This succeeds even though runtime Skia init fails on web.

### TypeScript
```bash
npx tsc --noEmit
```
There are ~380 pre-existing TS errors (backend lambda deps, gbox SDK scripts, missing jest types in test files, and minor style-type mismatches in components). These are all pre-existing and do not block the Metro bundler.

### Linting
No ESLint or Prettier config is present in the repo. There is no lint npm script.

### Testing
No test runner (jest/vitest/mocha) is configured. A test file exists at `src/__tests__/phase4Infrastructure.test.ts` but cannot run without a test framework. Validation shell scripts exist under `scripts/validate-*.sh` (for GSD workflow/skill/template validation in the `get-shit-done-for-antigravity-main/` subdirectory).

### Web platform caveat
The app imports `@shopify/react-native-skia` in 14+ component files. The `skiaLoader.web.ts` file attempts to call `LoadSkiaWeb()` but the RuntimeEffect API is undefined in browsers, causing the entire React tree to fail to mount. This is a known limitation — the app is designed for native mobile platforms.

### Environment variables
See `.env.example` for available env vars:
- `EXPO_PUBLIC_TTS_API_URL` — TTS backend endpoint (has a hardcoded fallback)
- `EXPO_PUBLIC_GEMINI_API_KEY` — Google Gemini API key for AI meditation generation (optional; rest of app works without it)

### Backend
The `backend/polly-lambda/` directory contains an AWS Lambda (SAM) project for TTS via Amazon Polly. It has its own `package.json` and is deployed separately. It is not needed for local app development — the app has a hardcoded remote fallback URL.
