# COMFYUI Animation Generation Guide

This guide provides detailed instructions for generating pre-rendered animation assets using COMFYUI for the Levels4 app.

## Overview

We're creating seamless loop animations (MP4 videos) that will replace or enhance code-based React Native animations. Each animation represents a spiritual concept and should be:
- **Seamless loops** (no visible start/end)
- **Smooth motion** (24 FPS minimum)
- **Spiritual/mystical aesthetic**
- **Professional cartoon style**
- **Optimized for mobile** (512x512 or 512x256/384)

## Setup

### Required COMFYUI Nodes/Extensions

1. **AnimateDiff** - For generating video animations
2. **ControlNet** - For consistent motion
3. **IP-Adapter** - For style consistency
4. **Video encoding nodes** - For MP4 output

### Base Workflow Structure

```
[Text Prompt] → [AnimateDiff] → [ControlNet] → [Video Encoder] → [MP4 Output]
```

## Animation Specifications

### File Naming Convention

All animations should be saved as:
```
assets/animations/{animation-name}.mp4
```

### Common Settings

- **Format**: MP4 (H.264)
- **FPS**: 24
- **Loop**: Seamless (first frame = last frame)
- **Quality**: High (but optimized for mobile)
- **Background**: Transparent or dark theme compatible

## Individual Animation Specs

### 1. desire-black-hole.mp4

**Dimensions**: 512x512  
**Frames**: 120 (5 seconds @ 24fps)  
**Prompt**: 
```
A mesmerizing black hole in deep space, purple and dark blue accretion disk rotating around a dark center, particles spiraling inward in a vortex, glowing energy trails, cosmic dust, ethereal purple and blue light, smooth rotation, loop animation, spiritual and mystical atmosphere, high contrast, vibrant colors
```

**Negative Prompt**:
```
static image, still frame, low quality, blurry, pixelated, distorted, choppy animation
```

**Key Visual Elements**:
- Rotating accretion disk (purple/blue)
- Particles spiraling inward
- Pulsing black hole center
- Glowing energy trails
- Cosmic atmosphere

**Color Palette**: `#8B5CF6`, `#6366F1`, `#000000`, `#1E1B4B`

---

### 2. power-vs-force.mp4

**Dimensions**: 512x256  
**Frames**: 90 (3.75 seconds @ 24fps)  
**Prompt**:
```
Two contrasting energy flows side by side: left side shows chaotic red force energy pushing against a wall, particles bouncing and scattering, exhausting movement. Right side shows smooth blue power energy flowing effortlessly like water, gentle waves, harmonious motion, peaceful and effortless, smooth transitions, loop animation
```

**Negative Prompt**:
```
static, still, low quality, blurry, choppy animation, abrupt transitions
```

**Key Visual Elements**:
- Left: Red chaotic energy, bouncing particles
- Right: Blue smooth flow, gentle waves
- Clear contrast between force and power
- Smooth transitions

**Color Palette**: `#60A5FA`, `#F87171`, `#1E293B`

---

### 3. natural-happiness.mp4

**Dimensions**: 512x384  
**Frames**: 100 (4.17 seconds @ 24fps)  
**Prompt**:
```
A beautiful sky scene with fluffy white clouds drifting slowly, bright sun shining through, warm golden light, peaceful blue sky, clouds moving gently, sun pulsing softly with warm glow, serene and calming atmosphere, smooth cloud movement, loop animation, spiritual and peaceful
```

**Negative Prompt**:
```
dark, stormy, chaotic, low quality, blurry, static, harsh lighting
```

**Key Visual Elements**:
- Drifting clouds
- Pulsing sun with glow
- Warm golden light
- Peaceful atmosphere

**Color Palette**: `#FCD34D`, `#FFFFFF`, `#60A5FA`, `#E0F2FE`

---

### 4. energy-leak.mp4

**Dimensions**: 512x512  
**Frames**: 110 (4.58 seconds @ 24fps)  
**Prompt**:
```
Energy flowing upward like a fountain, blocked by gray emotional barriers, energy leaking out in curved streams, glowing green energy particles escaping, barriers dissolving when energy flows through, smooth particle trails, loop animation, spiritual energy visualization
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, pixelated, straight lines
```

**Key Visual Elements**:
- Upward energy flow
- Gray barriers blocking
- Curved energy leaks
- Green glowing particles
- Barriers dissolving

**Color Palette**: `#34D399`, `#6EE7B7`, `#9CA3AF`, `#1F2937`

---

### 5. knowledge-vs-practice.mp4

**Dimensions**: 512x256  
**Frames**: 80 (3.33 seconds @ 24fps)  
**Prompt**:
```
Left side: static books stacked, knowledge represented as still books. Right side: dynamic circle pulsing with energy, ripples expanding outward, particles radiating, active and alive, smooth pulsing motion, loop animation, contrasting static vs dynamic
```

**Negative Prompt**:
```
static, still, low quality, blurry, choppy, synchronized movement
```

**Key Visual Elements**:
- Left: Static books
- Right: Pulsing circle with ripples
- Clear contrast
- Smooth pulsing

**Color Palette**: `#8B5CF6`, `#A78BFA`, `#1E293B`

---

### 6. levels-of-truth.mp4

**Dimensions**: 512x512  
**Frames**: 100 (4.17 seconds @ 24fps)  
**Prompt**:
```
Four independent glowing circles arranged in space, each pulsing at different rhythms, connected by subtle energy lines, purple and blue glowing orbs, each representing a different level of truth, smooth pulsing animations, independent but connected, loop animation, spiritual and mystical
```

**Negative Prompt**:
```
static, synchronized, low quality, blurry, uniform pulsing
```

**Key Visual Elements**:
- Four independent circles
- Different pulsing rhythms
- Subtle connecting lines
- Purple/blue glow

**Color Palette**: `#8B5CF6`, `#6366F1`, `#4F46E5`, `#3730A3`

---

### 7. reprogramming-transition.mp4

**Dimensions**: 512x256  
**Frames**: 90 (3.75 seconds @ 24fps)  
**Prompt**:
```
Old programming represented as fading gray box shrinking, new programming as glowing purple box growing and expanding, particles transitioning between them, smooth morphing transition, transformation animation, loop animation, spiritual reprogramming visualization
```

**Negative Prompt**:
```
static, abrupt transition, low quality, blurry, choppy morphing
```

**Key Visual Elements**:
- Gray box shrinking/fading
- Purple box growing
- Transition particles
- Smooth morphing

**Color Palette**: `#8B5CF6`, `#A78BFA`, `#9CA3AF`, `#1F2937`

---

### 8. resistance-flow.mp4

**Dimensions**: 512x256  
**Frames**: 85 (3.54 seconds @ 24fps)  
**Prompt**:
```
Two energy bars side by side: left shows red resistance block pushing against wall with squash and stretch, exhausting movement. Right shows blue flow block moving smoothly, glowing with energy, effortless motion, smooth transitions, loop animation, contrasting resistance vs flow
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, rigid movement
```

**Key Visual Elements**:
- Left: Red block with squash/stretch
- Right: Blue smooth flow
- Glowing effects
- Smooth motion

**Color Palette**: `#60A5FA`, `#F87171`, `#1E293B`

---

### 9. intention-ripple.mp4

**Dimensions**: 512x512  
**Frames**: 95 (3.96 seconds @ 24fps)  
**Prompt**:
```
Center point pulsing with purple glow, expanding ripple waves radiating outward, awareness indicators appearing around the ripples, smooth expanding circles, glowing particles, spiritual intention visualization, loop animation, peaceful and focused
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, chaotic ripples
```

**Key Visual Elements**:
- Pulsing center point
- Expanding ripples
- Awareness indicators
- Glowing particles

**Color Palette**: `#8B5CF6`, `#A78BFA`, `#C4B5FD`, `#1E293B`

---

### 10. music-vibration.mp4

**Dimensions**: 512x256  
**Frames**: 100 (4.17 seconds @ 24fps)  
**Prompt**:
```
Two sets of audio waves: left side shows chaotic red high-frequency waves, irregular and jarring. Right side shows smooth blue harmonious waves, flowing and peaceful, contrasting anger-based vs classical music, smooth wave animations, loop animation
```

**Negative Prompt**:
```
static, still, low quality, blurry, synchronized waves
```

**Key Visual Elements**:
- Left: Chaotic red waves
- Right: Smooth blue waves
- Clear contrast
- Smooth animation

**Color Palette**: `#F87171`, `#60A5FA`, `#1E293B`

---

### 11. spiritual-progress-spiral.mp4

**Dimensions**: 512x512  
**Frames**: 120 (5 seconds @ 24fps)  
**Prompt**:
```
Spiral path traced through space, glowing dot moving along the spiral with vertical oscillation showing ups and downs, purple energy trail, non-linear spiritual progress visualization, smooth spiral motion, loop animation, mystical and spiritual
```

**Negative Prompt**:
```
linear, straight, static, low quality, blurry, uniform motion
```

**Key Visual Elements**:
- Spiral path
- Glowing dot moving
- Vertical oscillation
- Purple energy trail

**Color Palette**: `#8B5CF6`, `#6366F1`, `#1E293B`

---

### 12. addiction-cloud.mp4

**Dimensions**: 512x384  
**Frames**: 110 (4.58 seconds @ 24fps)  
**Prompt**:
```
Sky scene with sun always shining, clouds appearing and disappearing, drug effect temporarily clears clouds, withdrawal brings thicker clouds back, sun pulsing gently, smooth cloud transitions, loop animation, spiritual metaphor for addiction
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, harsh transitions
```

**Key Visual Elements**:
- Sun always visible
- Clouds appearing/disappearing
- Smooth transitions
- Pulsing sun

**Color Palette**: `#FCD34D`, `#FFFFFF`, `#9CA3AF`, `#60A5FA`

---

### 13. reaction-vs-power.mp4

**Dimensions**: 512x256  
**Frames**: 90 (3.75 seconds @ 24fps)  
**Prompt**:
```
Two circles: left shows red reaction circle bouncing when triggered, losing power and fading. Right shows blue power circle stable and radiating energy outward, maintaining power, smooth animations, loop animation, contrasting reaction vs power
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, synchronized movement
```

**Key Visual Elements**:
- Left: Bouncing red circle
- Right: Stable blue circle radiating
- Power loss vs power maintenance
- Smooth animations

**Color Palette**: `#60A5FA`, `#F87171`, `#1E293B`

---

### 14. body-mind-spirit-layers.mp4

**Dimensions**: 512x384  
**Frames**: 100 (4.17 seconds @ 24fps)  
**Prompt**:
```
Three horizontal layers stacked: body layer (red tension transitioning to green relaxation), mind layer (red tension to green relaxation), spirit layer (red tension to green relaxation), letting go indicator appearing, smooth layer-by-layer relaxation, loop animation, spiritual healing visualization
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, abrupt transitions
```

**Key Visual Elements**:
- Three horizontal layers
- Red → Green transition
- Layer-by-layer relaxation
- Letting go indicator

**Color Palette**: `#F87171`, `#34D399`, `#1E293B`

---

### 15. shadow-illumination.mp4

**Dimensions**: 512x512  
**Frames**: 95 (3.96 seconds @ 24fps)  
**Prompt**:
```
Dark shadow circle in center, acknowledgment indicator appears, then golden light expands and illuminates the shadow, shadow shrinks and fades as light grows, smooth illumination transition, loop animation, spiritual shadow work visualization
```

**Negative Prompt**:
```
static, abrupt, low quality, blurry, harsh lighting
```

**Key Visual Elements**:
- Dark shadow circle
- Acknowledgment indicator
- Golden light expanding
- Shadow fading
- Smooth transition

**Color Palette**: `#000000`, `#FCD34D`, `#FEF3C7`, `#1E293B`

---

### 16. fear-grief-spill.mp4

**Dimensions**: 512x384  
**Frames**: 105 (4.38 seconds @ 24fps)  
**Prompt**:
```
Container filling with accumulated fear/grief energy (red/orange), energy spilling out into life experiences, spill effect flowing, life experience indicators appearing, smooth filling and spilling animation, loop animation, spiritual emotional processing
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, abrupt flow
```

**Key Visual Elements**:
- Container filling
- Energy spilling
- Life experience indicators
- Smooth flow

**Color Palette**: `#F87171`, `#F59E0B`, `#1E293B`

---

### 17. emotional-stack-collapse.mp4

**Dimensions**: 512x384  
**Frames**: 100 (4.17 seconds @ 24fps)  
**Prompt**:
```
Stack of emotional layers collapsing from bottom up, energy release from bottom, layers dissolving as they collapse, smooth collapse animation, loop animation, spiritual emotional release visualization
```

**Negative Prompt**:
```
static, choppy, low quality, blurry, abrupt collapse
```

**Key Visual Elements**:
- Stack of layers
- Bottom-up collapse
- Energy release
- Layers dissolving

**Color Palette**: `#F87171`, `#34D399`, `#1E293B`

---

## COMFYUI Workflow Tips

### 1. Seamless Loops

To create seamless loops:
- Use **ControlNet** with the first frame as reference
- Set **motion strength** to create smooth transitions
- Use **frame interpolation** to ensure smooth motion
- Test the loop by playing it back-to-back

### 2. Consistent Style

- Use **IP-Adapter** with a reference image for style consistency
- Create a **style reference** image with the desired aesthetic
- Use **LoRA** models for spiritual/mystical style if available

### 3. Smooth Motion

- Use **AnimateDiff** with appropriate motion models
- Set **motion scale** to 1.0-1.5 for smooth motion
- Use **frame interpolation** for smoother transitions
- Avoid rapid movements that cause blur

### 4. Color Consistency

- Use **Color Transfer** nodes to match color palettes
- Create **color reference** images for each animation
- Use **Color Grading** nodes for final adjustments

### 5. Optimization

- **Compress** videos for mobile (H.264, medium quality)
- **Trim** unnecessary frames
- **Test** on actual devices for performance
- Keep file sizes under **5MB** per animation

## Post-Processing

After generating animations:

1. **Verify seamless loops** - Play back-to-back multiple times
2. **Check frame rate** - Ensure smooth 24fps playback
3. **Optimize file size** - Compress if needed
4. **Test on device** - Verify performance and appearance
5. **Add to assets folder** - Place in `assets/animations/`

## Integration

Once animations are generated:

1. Place MP4 files in `assets/animations/` folder
2. Update `animationConfig.ts` if needed
3. The `HybridAnimation` component will automatically use them
4. Code animations remain as fallback

## Troubleshooting

### Animation too choppy
- Increase frame count
- Use frame interpolation
- Check motion scale settings

### Loop not seamless
- Use ControlNet with first frame reference
- Adjust motion strength
- Use frame blending at loop point

### File size too large
- Reduce resolution slightly
- Use better compression settings
- Trim unnecessary frames

### Colors don't match
- Use color transfer nodes
- Create color reference images
- Adjust in post-processing

## Next Steps

1. Generate animations using these specs
2. Test each animation for seamless loops
3. Optimize file sizes
4. Add to assets folder
5. Test in app with HybridAnimation component

