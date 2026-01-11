# Meditation & Hypnosis App

A cross-platform meditation and hypnosis app built with React Native and Expo, similar to Headspace and Calm.

## Features

- Audio meditation/hypnosis playback
- Category-based browsing (Sleep, Anxiety, Stress, Focus, etc.)
- Search functionality
- User progress tracking
- Premium content support
- Clean, calming UI with gradients

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. Navigate to the project directory:
```bash
cd meditation-app
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the App

#### On Web (for quick testing):
```bash
npm run web
```

#### On Android:
```bash
npm run android
```
Or scan the QR code with Expo Go app

#### On iOS:
```bash
npm run ios
```
Or scan the QR code with Expo Go app

## Adding Your Meditation Content

### 1. Prepare Your Audio Files

After creating your meditation scripts and generating TTS audio:

1. Place your audio files in: `src/assets/audio/`
2. Or upload them to a CDN/cloud storage (recommended for production)

### 2. Update the Meditation Data

Edit `src/data/meditations.ts` to add your meditations:

```typescript
{
  id: 'unique-id',
  title: 'Your Meditation Title',
  description: 'Brief description of what this meditation does',
  duration: 900, // Duration in seconds (15 minutes)
  audioUrl: require('../assets/audio/your-file.mp3'), // For local files
  // OR
  audioUrl: 'https://your-cdn.com/audio/meditation.mp3', // For remote files
  category: 'Sleep', // Sleep, Anxiety, Stress, Focus, Mindfulness, Hypnosis, Motivation, Healing
  isPremium: false, // Set to true for premium content
  instructor: 'Your Name',
}
```

### 3. Local Audio Files

For local audio files, place them in `src/assets/audio/` and reference them:
```typescript
audioUrl: require('../assets/audio/deep-sleep.mp3')
```

### 4. Remote Audio Files (Recommended)

Host your audio on:
- **AWS S3**: Scalable cloud storage
- **Google Cloud Storage**: Another reliable option
- **Cloudinary**: Media optimization platform
- **Firebase Storage**: Easy integration with auth

Then use the URL:
```typescript
audioUrl: 'https://your-storage.com/meditations/deep-sleep.mp3'
```

## Project Structure

```
meditation-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── MeditationCard.tsx
│   ├── data/              # Meditation content data
│   │   └── meditations.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useAudioPlayer.ts
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── LibraryScreen.tsx
│   │   ├── PlayerScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   └── assets/            # Images, audio files
│       └── audio/
├── App.tsx                # Main app entry point
└── package.json
```

## Monetization Setup

See [MONETIZATION.md](./MONETIZATION.md) for detailed instructions on:
- Implementing subscriptions with RevenueCat
- Adding AdMob ads
- Setting up payment processing
- Managing premium content

## Customization

### Change App Colors

Edit the color scheme throughout the app by searching for:
- Primary: `#6B4CE6` (Purple)
- Secondary: `#9D7CE8` (Light Purple)
- Accent: `#FFD700` (Gold for premium badges)

### Add More Categories

Edit `src/types/index.ts` to add new categories:
```typescript
export type Category =
  | 'Sleep'
  | 'YourNewCategory';
```

Then update `src/data/meditations.ts` accordingly.

## Building for Production

### Android (APK/AAB)

```bash
eas build --platform android
```

### iOS (App Store)

```bash
eas build --platform ios
```

Note: You'll need an Expo account and appropriate developer accounts (Apple Developer, Google Play Console).

## Next Steps

1. **Add your meditation audio files**
2. **Customize the branding** (app name, colors, icon)
3. **Set up monetization** (see MONETIZATION.md)
4. **Implement user authentication** (Firebase Auth, Supabase, etc.)
5. **Add backend/database** for user progress tracking
6. **Implement push notifications** for reminders
7. **Add offline downloads** for premium users
8. **Create app icons and splash screen**

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo AV (Audio/Video)](https://docs.expo.dev/versions/latest/sdk/av/)

## License

This project is open source and available under the MIT License.
