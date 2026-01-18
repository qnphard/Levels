# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 — Clarity & Immersion

## Must-Haves (from SPEC)

- [ ] First-time user knows where to start within 10 seconds
- [ ] Level Rooms feel immersive (atmosphere persists, depth indicators)
- [ ] Every topic ends with "Next Suggested" action
- [ ] TTS meditation works reliably (<10s latency)
- [ ] 60fps performance on mid-range Android

---

## Phases

### Phase 1: UX Clarity & Navigation
**Status**: ⬜ Not Started
**Objective**: Fix the "app feels random" problem — make onboarding and navigation crystal clear.
**Deliverables**:
- Primary CTA on every hub (Home: "Continue", Essentials: "Start Here", Library: "Recommended Today")
- "Start Here" always visible on EssentialsScreen
- Tier tags (Foundation / Practice / Deep Dive) with visible legend
- Topic content skeleton template enforced

---

### Phase 2: Content Continuity
**Status**: ⬜ Not Started
**Objective**: Eliminate dead ends — every topic flows into the next.
**Deliverables**:
- "Next Suggested / Related / Try Now" row on every topic screen
- Progressive unlock flow (gentle friction-based, not hard paywall)
- Linking between related concepts

---

### Phase 3: Level Room Visual Redesign
**Status**: ⬜ Not Started
**Objective**: Replace the cartoonish stickman/stairs UI with a premium, immersive aesthetic.
**Problem**: Current "Room of Levels" uses a flat stickman figure and simple pill-shaped stairs. It feels too cartoonish and breaks immersion.
**Deliverables**:
- Research visual alternatives (parallax scene, 3D environment, abstract energy representation)
- Remove stickman avatar or replace with abstract/silhouette representation
- Upgrade level "stairs" to feel like portals/doors with atmospheric glow
- Persistent atmosphere (background/vignette remains on subpages)
- Depth indicator / breadcrumbs for navigation

---

### Phase 4: TTS Solution Research & Implementation
**Status**: ⬜ Not Started
**Objective**: Find and implement a fast, cheap TTS solution with voice cloning OR premium meditation voices.
**Problem**: Modal/Hugging Face implementations are too slow. Need <5s latency.
**Requirements**:
- Voice cloning capability (provide sample) OR built-in calm/slow/persuasive voice
- Fast inference (<5s, ideally <2s)
- Free or very cheap (open-source preferred)
**Research Candidates**:
- **F5-TTS**: Open-source, RTF 0.15, 10-15s sample for cloning, emotion synthesis
- **XTTS-v2 (Coqui)**: Open-source, <150ms streaming, 6s sample for cloning
- **Chatterbox (Resemble AI)**: Open-source, <200ms, emotion control
- **Orpheus**: Open-weights, ~200ms, tag-based emotion control
- **CAMB.AI**: Free tier, 2-3s sample cloning, pitch/speed/emotion adjustment
**Deliverables**:
- Evaluate top 3 candidates with voice sample
- Implement chosen solution
- 20-track meditation library scripts finalized
- Binaural + background mixing spec implemented

---

### Phase 5: Performance & Launch Prep
**Status**: ⬜ Not Started
**Objective**: Ensure smooth performance and prepare for release.
**Deliverables**:
- 60fps on mid-range Android verified
- Glow Budget audit (remove decorative glow noise)
- Final QA pass
- App store metadata prepared

