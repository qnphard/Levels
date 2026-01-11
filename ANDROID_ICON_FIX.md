# Fixing Android Adaptive Icon Safe Zone Issue

## The Problem

Android adaptive icons require a **safe zone** - important content must be within the **center 66%** of a 1024x1024 image. The outer 33% can be cropped by different launchers, which is why your icon appears broken or cropped.

## Solution: Create Properly Formatted Adaptive Icon

### Option 1: Use Android Studio Asset Studio (Recommended)

1. Open Android Studio
2. Go to **File** > **New** > **Image Asset**
3. Select **Launcher Icons (Adaptive and Legacy)**
4. Upload your `levels-thumbnail.png` as the foreground
5. Set background color to `#FFFFFF` (white)
6. The tool will automatically add proper safe zone padding
7. Export the generated `ic_launcher_foreground.png`
8. Save it as `assets/adaptive-icon.png` in your project

### Option 2: Manual Fix with Image Editor

1. Open `assets/images/levels-thumbnail.png` in an image editor (Photoshop, GIMP, Figma, etc.)
2. Create a new 1024x1024 canvas with transparent background
3. **Center your staircase illustration** in the middle 66% of the canvas:
   - Safe zone: 338px from each edge (1024 * 0.33 = 337.92)
   - Center area: 338px to 686px (both horizontally and vertically)
4. Ensure the illustration fits within this center area
5. Add transparent padding around the edges
6. Save as `assets/adaptive-icon.png`

### Option 3: Use Online Tool

1. Use [Adaptive Icon Generator](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. Upload your `levels-thumbnail.png`
3. Set background color to white
4. Download the generated foreground image
5. Save as `assets/adaptive-icon.png`

## After Creating the Fixed Icon

1. Update `app.json`:
```json
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#ffffff"
  }
}
```

2. Rebuild the APK:
```bash
npx eas-cli build --platform android --profile preview
```

3. Install and test on the emulator

## Safe Zone Guidelines

- **Total size**: 1024x1024 pixels
- **Safe zone**: Center 66% (338px margin on all sides)
- **Important content**: Must fit within center 688x688 area
- **Background**: Can extend to edges (will be cropped by launcher masks)

## Current Configuration

The app is currently using `./assets/icon.png` for the adaptive icon foreground. If this doesn't work, you'll need to create a properly formatted `adaptive-icon.png` following the steps above.




