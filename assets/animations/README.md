# Animation Assets Folder

This folder contains pre-rendered MP4 video animations generated with COMFYUI.

## File Naming Convention

All animation files should follow this naming pattern:
```
{animation-name}.mp4
```

## Current Animations

The following animations can be placed here (see `COMFYUI_GENERATION_GUIDE.md` for generation specs):

- `desire-black-hole.mp4`
- `power-vs-force.mp4`
- `natural-happiness.mp4`
- `energy-leak.mp4`
- `knowledge-vs-practice.mp4`
- `levels-of-truth.mp4`
- `reprogramming-transition.mp4`
- `resistance-flow.mp4`
- `intention-ripple.mp4`
- `music-vibration.mp4`
- `spiritual-progress-spiral.mp4`
- `addiction-cloud.mp4`
- `reaction-vs-power.mp4`
- `body-mind-spirit-layers.mp4`
- `shadow-illumination.mp4`
- `fear-grief-spill.mp4`
- `emotional-stack-collapse.mp4`

## Requirements

- **Format**: MP4 (H.264)
- **FPS**: 24
- **Loop**: Seamless (first frame = last frame)
- **Quality**: High but optimized for mobile
- **File Size**: Under 5MB per animation (recommended)

## Usage

Animations are automatically loaded by the `HybridAnimation` component. If an asset is not found, the component falls back to the code-based animation.

## Adding New Animations

1. Generate animation using COMFYUI (see `COMFYUI_GENERATION_GUIDE.md`)
2. Place MP4 file in this folder with the correct name
3. The `HybridAnimation` component will automatically detect and use it
4. Code animation remains as fallback if asset is not available

