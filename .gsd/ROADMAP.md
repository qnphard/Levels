# Development Roadmap

> **Project**: Levels — Consciousness Development App
> **Spec Version**: 1.0 (FINALIZED)
> **Last Updated**: 2026-01-18

---

## Overview

This roadmap addresses the core problems identified in the SPEC, based on deep codebase analysis of the existing app.

### What Already Exists ✓
- "Continue Journey" / "Start Your Journey" CTA on HomeScreen
- "Start Here" card with 3 foundation items on EssentialsScreen
- RadialMenuLayout (Mandala) with 22 topics
- TopicPreviewSheet with takeaways
- RelatedNextCard component (8KB)
- WhyFeelingSheet with emotion→insight mapping (41KB)
- 16 consciousness levels with full metadata
- Onboarding flow with spectrum check + breathing techniques
- PIN-protected Journal with gentle prompts

### What Needs Work
- Tier classification for topics (Foundation/Practice/Deep-Dive)
- Mandala topic arrangement feels random
- RelatedNextCard not wired to all topic screens
- WhyFeelingSheet content inaccurate/incomplete per Hawkins
- Room of Levels visual (stickman) too cartoonish
- TTS too slow (Modal.com/Hugging Face)
- Journal could be enhanced

---

## Phase 1: UX Clarity & Navigation
**Status**: Planned
**Priority**: High

### Objective
Ensure users always know their next step and understand content hierarchy.

### Deliverables
1. **Tier Tags** — Add `tier: 'foundation' | 'practice' | 'deep-dive'` to `EssentialItem` data
2. **TierChip Component** — Visual badge with gold/green/purple colors
3. **Tier Legend** — Show tier explanation on EssentialsScreen
4. **Mandala Reorganization** — Arrange topics by tier/related (not random)
5. **RelatedNextCard Integration** — Wire existing component to all topic screens
6. **Cleanup** — Remove DEV TEST card from HomeScreen

### Verification
- Run app, verify tier tags appear on mandala nodes
- Complete a topic, verify RelatedNextCard shows at bottom
- Check EssentialsScreen for tier legend visibility

---

## Phase 2: Content Accuracy & Deep Insight
**Status**: Planned
**Priority**: High

### Objective
Improve the "Why am I feeling like this?" flow with Hawkins-accurate content.

### Deliverables
1. **Audit Existing Content** — Review WhyFeelingSheet.tsx mappings against Hawkins books
2. **Expand Situation List** — Add missing situations in "What's happening right now?"
3. **Rewrite Deep Insight** — Accurate RESERVOIR+TRIGGER, COPING TRAP, PURPOSE per Hawkins
4. **Verify Emotion Mappings** — Ensure emotion→level→insight chains are correct
5. **Add Missing Emotions** — Cover all 16 levels appropriately

### Verification
- Compare app output to source books for each emotion
- User test: select Shame → verify insight matches Hawkins' description
- Check all 16 levels have accurate deep insight content

---

## Phase 3: Level Room Visual Redesign
**Status**: Planned
**Priority**: Medium

### Objective
Replace the cartoonish stickman/stairs with a more immersive, premium visual experience.

### Deliverables
1. **Replace RoomOfLevelsScreen** — Integrate LevelStairsMenu (Skia) as the main Room of Levels
2. **Enhance Stickman Visual** — Add glow, atmospheric effects, less "stick figure"
3. **Premium Background** — Dark atmospheric with parallax, particles, depth fog
4. **Improve Stairs** — Gradient glowing steps, soft shadows, 3D depth
5. **Remove DEV TEST Card** — After integration is complete
6. **Add Level Transition Animations** — Smooth entry into Level content

### Verification
- Screenshot comparison: before vs after
- User test: navigate Room of Levels → feels immersive, not cartoonish
- Verify DEV TEST card removed from HomeScreen

---

## Phase 4: TTS Solution Research & Implementation
**Status**: Planned
**Priority**: Medium

### Objective
Replace slow Modal.com TTS with fast, high-quality voice generation.

### Requirements
- Generation speed: < 5 seconds (ideal: < 2s)
- Cost: Free or very cheap (no per-generation fees)
- Voice quality: Low, calm, slow, persuasive OR voice cloning from samples

### Research Candidates
- F5-TTS (zero-shot voice cloning)
- XTTS-v2 (Coqui, voice cloning)
- Chatterbox (fast, expressive)
- Orpheus (local inference)
- CAMB.AI (API, voice cloning)

### Deliverables
1. Research and benchmark candidates
2. Implement chosen solution
3. Update voiceTTSService.ts
4. Test with meditation scripts

---

## Phase 5: Journal Enhancements
**Status**: Future
**Priority**: Low

### Objective
Enhance the Journal experience beyond simple text entry.

### Potential Deliverables
- Entry history / past journals view
- Mood tagging after writing (link to levels)
- Writing streaks / consistency tracking
- Tie entries to specific emotions or practices

---

## Phase 6: Performance & Launch Prep
**Status**: Future
**Priority**: Low

### Objective
Optimize app performance, fix remaining bugs, prepare for production release.

### Deliverables
- Bundle size optimization
- Asset lazy loading
- Performance profiling
- Bug fixes from testing
- App store preparation

---

## Phase Order Rationale

1. **Phase 1** first — Users need clarity before anything else
2. **Phase 2** second — Content accuracy is core to value proposition
3. **Phase 3** third — Visual polish enhances immersion
4. **Phase 4** anytime — Independent of UX work, can parallel
5. **Phase 5-6** later — Polish after core experience is solid
