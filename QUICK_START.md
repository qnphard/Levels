# Quick Start Guide

Get your meditation app running in 5 minutes!

## Step 1: Test the App

```bash
cd meditation-app
npm start
```

This will open Expo Dev Tools. You can:
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone

## Step 2: Add Your First Meditation

1. Create or obtain your meditation audio file
2. Place it in `src/assets/audio/` folder
3. Edit `src/data/meditations.ts`:

```typescript
{
  id: '6',
  title: 'Your First Meditation',
  description: 'Your custom meditation description',
  duration: 600, // 10 minutes in seconds
  audioUrl: require('../assets/audio/your-file.mp3'),
  category: 'Mindfulness',
  isPremium: false,
  instructor: 'Your Name',
}
```

4. Reload the app - your meditation will appear!

## Step 3: Customize Branding

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-name"
  }
}
```

### Change Colors

Find and replace these colors throughout the codebase:
- `#6B4CE6` → Your primary color
- `#9D7CE8` → Your secondary color

### Add App Icon

1. Create a 1024x1024 PNG icon
2. Save as `assets/icon.png`
3. Update `app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

## Step 4: Add More Content

Keep adding meditations to `src/data/meditations.ts`. Organize by category:
- Sleep
- Anxiety
- Stress
- Focus
- Mindfulness
- Hypnosis
- Motivation
- Healing

## Step 5: Set Up for Production

### 1. Create Expo Account
```bash
npx expo login
```

### 2. Configure app.json

Add required fields:
```json
{
  "expo": {
    "name": "Your App",
    "slug": "your-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6B4CE6"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6B4CE6"
      }
    }
  }
}
```

### 3. Build for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for both platforms
eas build --platform all
```

## Testing Checklist

Before launching:

- [ ] All audio files play correctly
- [ ] Navigation works smoothly
- [ ] Search finds meditations
- [ ] Categories filter properly
- [ ] Audio player controls work
- [ ] App doesn't crash
- [ ] Looks good on different screen sizes
- [ ] Premium badges show for premium content
- [ ] App icon and splash screen set

## Common Issues

### Audio not playing?
- Check file format (MP3 is recommended)
- Ensure file path is correct
- Check file permissions
- Try with a smaller audio file first

### App not starting?
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### TypeScript errors?
```bash
# Check types
npx tsc --noEmit
```

## Next Steps

1. Add authentication (Firebase, Supabase)
2. Set up backend for user data
3. Implement subscriptions (see MONETIZATION.md)
4. Add push notifications
5. Implement offline downloads
6. Add user favorites/bookmarks
7. Track user progress
8. Add meditation timer
9. Include background audio support

## Support

- [Expo Forums](https://forums.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

## Tips for Success

1. **Start Simple**: Launch with 10-20 quality meditations
2. **Focus on Quality**: Better to have fewer high-quality meditations than many low-quality ones
3. **Update Regularly**: Add new content weekly to keep users engaged
4. **Listen to Users**: Implement feedback and feature requests
5. **Test Thoroughly**: Test on real devices before launching
6. **Market Early**: Build an audience before launch
7. **Measure Everything**: Use analytics to understand user behavior

Good luck with your meditation app! 🧘‍♀️
