# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project type: Expo + React Native (TypeScript) mobile app with a web preview.

Common commands

- Install dependencies
  ```bash
  npm install
  ```
- Start Metro/dev server (QR/Web)
  ```bash
  npm start
  ```
- Web preview (fastest feedback loop)
  ```bash
  npm run web
  ```
- Run on Android / iOS (requires device/emulator; iOS requires macOS)
  ```bash
  npm run android
  npm run ios
  ```
- Clear Metro cache if weird bundling errors occur
  ```bash
  npx expo start -c
  ```
- Type checking (strict TS enabled; no code emit)
  ```bash
  npx tsc --noEmit
  ```
- Health check for Expo project
  ```bash
  npx expo-doctor
  ```
- Production builds (requires EAS CLI and accounts)
  ```bash
  eas build --platform android
  eas build --platform ios
  ```

Notes on linting and tests

- No ESLint/Prettier config or npm scripts are present.
- No test framework is configured; there are no tests to run. If a test suite is added later, document single-test invocation here.

High-level architecture

- App entry
  - `index.ts` registers the root component for Expo.
  - `App.tsx` composes providers and global visuals:
    - `ThemeProvider` from `src/theme/colors.tsx` (light/dark themes, tokens, and hooks: `useThemeColors`, `useThemeMode`, `useThemeToggle`).
    - `UserProgressProvider` from `src/context/UserProgressContext.tsx` (persists progress in `AsyncStorage`).
    - Renders `AppNavigator` and a floating `ThemeToggleButton`.

- Navigation
  - `src/navigation/AppNavigator.tsx` defines:
    - Bottom tabs: Journey (mapped to `JourneyMapScreen`), Explore (`LibraryScreen`), Journal (`JournalScreen`), Profile (`ProfileScreen`).
    - Stack routes: `Player`, `CheckIn`, `JourneyMap`, `LevelDetail`, `LevelChapter`.

- Domain data and types
  - `src/types/index.ts` defines core app types (`Meditation`, `Article`, `ConsciousnessLevel`, user progress, categories, emotions).
  - `src/data/levels.ts` declares the Hawkins-based levels array (20→600) plus helpers (`getLevelById`, `getNextLevel`, `getSuggestedStartingLevel`, etc.). Level 200 (Courage) is the threshold and is used as the default starting focus.
  - `src/data/meditations.ts` and `src/data/articles.ts` provide sample content. Meditations/articles include calibration metadata so screens can filter by proximity to a level.

- State and persistence
  - `src/context/UserProgressContext.tsx` stores and restores user progress (`currentLevel`, `exploredLevels`, `completedPractices`, `journeyPath`, `firstEngagedWithCourage`). It exposes methods to update/mark events and saves to `AsyncStorage`.

- Theming and design system
  - `src/theme/colors.tsx` centralizes tokens (palette, gradients, spacing/typography/radii) and returns fully-resolved `ThemeColors` based on mode. Light mode uses soft sand/mist tones; dark mode uses deep night tones with bioluminescent accents. All screens/components consume tokens via hooks to ensure consistent visuals across modes.

- Key screens and flows (big picture)
  - Journey map (`src/screens/JourneyMapScreen.tsx`):
    - Groups levels by category (healing, empowerment, spiritual, enlightenment), shows responsive cards with gradients and optional glow in dark mode.
    - Integrates `UserProgressContext` to show “Explored/Current” and navigates to Chapter/Detail views.
  - Chapter view (`src/screens/LevelChapterScreen.tsx`):
    - Tabbed experience: Overview, Meditations, Articles. Filters content near the level’s calibration; links to Level Detail.
  - Level detail (`src/screens/LevelDetailScreen.tsx`):
    - Deep-dive into a level (description, signs, trap/way-through), marks exploration, can set as current focus, and highlights Courage (200).
  - Library (`src/screens/LibraryScreen.tsx`): searchable list of meditations.
  - Home (`src/screens/HomeScreen.tsx`): daily practice suggestion + category chips and featured articles.
  - Check-in (`src/screens/CheckInScreen.tsx`): emotion-based quick start that routes to a relevant level or practice.
  - Player (`src/screens/PlayerScreen.tsx`): uses `expo-av` via `src/hooks/useAudioPlayer.ts` (load/play/pause/seek/skip/stop, status updates).
  - Journal (`src/screens/JournalScreen.tsx`): local-only journal with optional passcode gate (`src/components/PasscodeScreen.tsx`), entries stored in memory (passcode state in `AsyncStorage`).
  - Profile (`src/screens/ProfileScreen.tsx`): placeholder stats and menu.

- Reusable components
  - `PrimaryButton`, `MeditationCard`, `ArticleCard`, `ThemeToggleButton`, `PasscodeScreen` use theme tokens and gradient/blur treatments for consistent UI.

Content authoring (where to add your content)

- Add audio and link meditations:
  - Place local files under `src/assets/audio/` and reference with `require(...)`, or prefer remote URLs in `src/data/meditations.ts`.
- Extend the library and articles by editing `src/data/meditations.ts` and `src/data/articles.ts`.

Operational tips

- If bundling fails after large refactors, try `npx expo start -c` and re-run the platform command.
- When adding native modules, use `npx expo prebuild` (and commit the native projects) or keep the app in the managed workflow to avoid prebuild.
