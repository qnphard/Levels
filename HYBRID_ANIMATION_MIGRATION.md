# Hybrid Animation Migration Guide

This guide explains how to migrate existing screens to use the new hybrid animation system that supports both pre-rendered COMFYUI assets and code-based animations.

## Overview

The hybrid system allows you to:
1. **Use pre-rendered MP4 videos** (generated with COMFYUI) for complex animations
2. **Fall back to code animations** automatically if assets aren't available
3. **Switch between asset and code** easily via configuration

## Migration Steps

### Step 1: Update Screen Imports

**Before:**
```typescript
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';
```

**After:**
```typescript
import HybridAnimation from '../components/animations/HybridAnimation';
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';
```

### Step 2: Replace Animation Component

**Before:**
```typescript
<View style={styles.animationContainer}>
  <PowerVsForceAnimation autoPlay={true} />
</View>
```

**After:**
```typescript
<View style={styles.animationContainer}>
  <HybridAnimation
    animationName="power-vs-force"
    CodeAnimation={PowerVsForceAnimation}
    height={280}
    preferAsset={true}
    autoPlay={true}
  />
</View>
```

## Animation Name Mapping

Use these animation names when migrating:

| Screen | Animation Name | Code Component |
|--------|---------------|----------------|
| PowerVsForceScreen | `power-vs-force` | PowerVsForceAnimation |
| NaturalHappinessScreen | `natural-happiness` | NaturalHappinessAnimation |
| FatigueVsEnergyScreen | `energy-leak` | EnergyLeakAnimation |
| FulfillmentVsSatisfactionScreen | `desire-black-hole` | DesireBlackHoleAnimation |
| KnowledgeScreen | `knowledge-vs-practice` | KnowledgeVsPracticeAnimation |
| LevelsOfTruthScreen | `levels-of-truth` | LevelsOfTruthAnimation |
| PositiveReprogrammingScreen | `reprogramming-transition` | ReprogrammingTransitionAnimation |
| EffortScreen | `resistance-flow` | ResistanceFlowAnimation |
| IntentionScreen | `intention-ripple` | IntentionRippleAnimation |
| MusicAsToolScreen | `music-vibration` | MusicVibrationAnimation |
| CommonTrapsScreen | `spiritual-progress-spiral` | SpiritualProgressSpiralAnimation |
| AddictionScreen | `addiction-cloud` | AddictionCloudAnimation |
| NonReactivityScreen | `reaction-vs-power` | ReactionVsPowerAnimation |
| RelaxingScreen | `body-mind-spirit-layers` | BodyMindSpiritLayersAnimation |
| ShadowWorkScreen | `shadow-illumination` | ShadowIlluminationAnimation |
| LossAndAbandonmentScreen | `fear-grief-spill` | FearGriefSpillAnimation |

## Component Props

### HybridAnimation Props

- `animationName` (string, required): Name of the animation (used to locate asset)
- `CodeAnimation` (React.ComponentType, required): Fallback code-based animation component
- `height` (number, optional): Animation height (default: 200)
- `preferAsset` (boolean, optional): Whether to prefer asset over code (default: true)
- `autoPlay` (boolean, optional): Auto-play for code animation fallback (default: true)
- `onInteraction` (function, optional): Callback when animation is interacted with

## How It Works

1. **Asset Loading**: The component tries to load `assets/animations/{animationName}.mp4`
2. **Fallback**: If asset is not found or `preferAsset` is false, it uses the code animation
3. **Seamless Transition**: Users won't notice the difference - it just works!

## Example: Complete Migration

### PowerVsForceScreen.tsx

**Before:**
```typescript
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';

// In render:
<View style={styles.animationContainer}>
  <PowerVsForceAnimation autoPlay={true} />
</View>
```

**After:**
```typescript
import HybridAnimation from '../components/animations/HybridAnimation';
import PowerVsForceAnimation from '../components/animations/PowerVsForceAnimation';

// In render:
<View style={styles.animationContainer}>
  <HybridAnimation
    animationName="power-vs-force"
    CodeAnimation={PowerVsForceAnimation}
    height={280}
    preferAsset={true}
    autoPlay={true}
  />
</View>
```

## Testing

1. **Without Assets**: The component should fall back to code animations (current behavior)
2. **With Assets**: Place MP4 files in `assets/animations/` and they'll be used automatically
3. **Toggle**: Set `preferAsset={false}` to force code animations even if assets exist

## Benefits

✅ **Better Performance**: Pre-rendered videos can be more performant for complex animations  
✅ **Better Quality**: COMFYUI can generate more complex visual effects  
✅ **Backward Compatible**: Code animations remain as fallback  
✅ **Easy Testing**: Toggle between asset and code easily  
✅ **Future-Proof**: Can add more animations without code changes  

## Next Steps

1. Migrate screens one by one using this guide
2. Generate animations with COMFYUI (see `COMFYUI_GENERATION_GUIDE.md`)
3. Place MP4 files in `assets/animations/` folder
4. Test each animation with and without assets

## Troubleshooting

### Animation not showing
- Check that `animationName` matches the file name (without .mp4)
- Verify asset is in `assets/animations/` folder
- Check console for error messages

### Asset not loading
- Ensure file is named correctly: `{animation-name}.mp4`
- Check file format is MP4 (H.264)
- Verify file size is reasonable (< 5MB recommended)

### Code animation not showing as fallback
- Set `preferAsset={false}` to force code animation
- Check that `CodeAnimation` prop is correct
- Verify code animation component is imported correctly

