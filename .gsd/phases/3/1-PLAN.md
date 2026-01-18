---
phase: 3
plan: 1
wave: 1
---

# Phase 3: Level Room Visual Redesign

## Objective

Replace the cartoonish stickman/stairs with a more immersive, premium visual experience for the Room of Levels.

## Context Files

- `src/screens/RoomOfLevelsScreen.tsx` — Current cloud-based implementation (to be replaced)
- `src/screens/AnimationShowcaseScreen.tsx` — DEV TEST screen using LevelStairsMenu
- `src/levels3d/components/LevelStairsMenu.tsx` — Skia 2D stickman + stairs
- `src/levels3d/components/StickmanController.tsx` — Three.js 3D stickman (alternative)
- `src/levels3d/components/SkiaSpiralImpl.tsx` (23KB) — Spiral stair implementation
- `src/components/RoomBackground.tsx` — Parallax background component
- `src/context/AtmosphereContext.tsx` — Atmosphere effects (zoom, vignette, lighting)

## Current State

The current LevelStairsMenu (Skia) has:
- White stick figure (basic lines + circle head)
- Pill-shaped colored stairs in helix arrangement
- Dark radial gradient background with dust particles
- Labels for "Felt Sense", "Purpose", "Traps", "Exits"

**Problems:**
- Stickman looks like a basic SVG stick figure
- Stairs are simple colored rectangles
- Overall feels like a game/cartoon, not a meditative space

## Design Direction

Transform to a more **atmospheric, abstract, premium** aesthetic:
- **Stickman**: Softer glow outline, ethereal presence, pulsing subtly
- **Stairs**: Floating light platforms, soft glow edges, glass/crystal effect
- **Background**: Deeper space, particle nebula, slow-moving ambient elements
- **Overall**: Dark meditation room feel, not "game UI"

## Tasks

### Wave 1: Background Atmosphere

<task type="auto">
  <name>Enhance AtmosphereBackground</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    Improve the background:
    - Deeper, richer colors (near-black with subtle purple/blue tones)
    - More dust particles at varying sizes and opacity
    - Slow drifting animation on particles
    - Subtle pulsing ambient glow in center
  </action>
  <verify>Run AnimationShowcase → background feels deeper and more alive</verify>
  <done>Background has rich atmospheric depth</done>
</task>

<task type="auto">
  <name>Add vignette and lighting effects</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    Add post-processing effects:
    - Dark vignette around edges (focus on center)
    - Subtle light bloom on bright elements
    - Depth fog that makes distant steps hazier
  </action>
  <verify>Visual comparison shows improved depth and focus</verify>
  <done>Vignette and lighting create cinematic depth</done>
</task>

### Wave 2: Stickman Enhancement

<task type="auto">
  <name>Add glow effect to SkiaStickman</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    Transform SkiaStickman component:
    - Add outer glow (white with blur)
    - Add subtle pulsing animation (opacity + scale)
    - Soften the harsh line strokes
    - Consider gradient stroke instead of solid white
  </action>
  <verify>Stickman appears ethereal, not like a basic SVG</verify>
  <done>Stickman has glowing, ethereal presence</done>
</task>

<task type="auto">
  <name>Add subtle breathing animation</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    Add slow, calming animation to stickman:
    - Gentle up/down bob (breathing rhythm ~4 seconds)
    - Slight glow intensity pulse
    - Creates meditative, alive feeling
  </action>
  <verify>Stickman appears to breathe slowly</verify>
  <done>Stickman animates with calming breathing motion</done>
</task>

### Wave 3: Stairs Enhancement

<task type="auto">
  <name>Upgrade stair visuals</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    Transform BLOCK_PATHS styling:
    - Glass/crystal effect with transparency
    - Soft glow edges matching level color
    - Subtle gradient from center to edge
    - Floating shadow beneath each stair
  </action>
  <verify>Stairs look like glowing floating platforms</verify>
  <done>Stairs have premium glass-like appearance</done>
</task>

<task type="auto">
  <name>Add stair glow on focus</name>
  <files>src/levels3d/components/LevelStairsMenu.tsx</files>
  <action>
    When a stair is focused (center position):
    - Increase glow radius and intensity
    - Add subtle particle emission around it
    - Smooth transition animation
  </action>
  <verify>Focused stair clearly highlighted with enhanced glow</verify>
  <done>Focused stairs have enhanced visual feedback</done>
</task>

### Wave 4: Integration

<task type="auto">
  <name>Replace RoomOfLevelsScreen content</name>
  <files>src/screens/RoomOfLevelsScreen.tsx</files>
  <action>
    Replace current cloud-based scroll UI with enhanced LevelStairsMenu:
    - Import and render LevelStairsMenu
    - Adapt navigation to work with 8 heavy weather levels
    - Maintain AtmosphereProvider wrapper
    - Update onSelectSection to navigate to LevelRoom
  </action>
  <verify>Room of Levels card → opens stickman/stairs UI</verify>
  <done>RoomOfLevelsScreen uses enhanced LevelStairsMenu</done>
</task>

<task type="auto">
  <name>Remove DEV TEST card from HomeScreen</name>
  <files>src/screens/HomeScreen.tsx</files>
  <action>
    Remove the green "DEV TEST: Stairs Animation" card.
    (May already be done in Phase 1, verify and skip if so)
  </action>
  <verify>HomeScreen has no DEV TEST card</verify>
  <done>DEV TEST card removed</done>
</task>

## Success Criteria

- [ ] Background feels deep and atmospheric (not flat)
- [ ] Stickman has glow effect and breathing animation
- [ ] Stairs have glass/crystal appearance with glow
- [ ] Focused elements have clear visual feedback
- [ ] RoomOfLevelsScreen uses enhanced LevelStairsMenu
- [ ] DEV TEST card removed from HomeScreen
- [ ] Overall feels meditative, not cartoonish

## Verification Plan

1. **Before/After Screenshots**: Capture AnimationShowcase before and after changes
2. **User Test**: Navigate to Room of Levels → subjective feel: "premium and immersive"
3. **Animation Check**: Stickman breathing visible, stair focus transitions smooth
4. **Integration Check**: All 8 heavy weather levels accessible via enhanced UI
