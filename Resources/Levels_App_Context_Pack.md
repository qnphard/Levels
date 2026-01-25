# Levels App — Context Pack for a Fresh LLM Conversation
_Last updated: 2026-01-10_

This document captures the **full working context** (vision, constraints, current implementation, pain points, and next steps) so we can start a new conversation without the lag of the long thread.

---

## 1) Project Summary
**App name (working):** *Levels*  
**Theme:** Meditation + letting go / consciousness education inspired by **David R. Hawkins** (with a strong emphasis on integrity, non-force, compassion, autonomy, and practicality).  
**Primary user goal:** Help users **reduce suffering and reactivity** and **return to natural peace** via short explanations + small practices (breathing, letting go, self-inquiry) + structured content.

---

## 2) Non‑Negotiables & “Integrity Protocol”
The app must be aligned with high-integrity principles (Hawkins-style framing, non-forceful delivery).  
**Language / UX must avoid coercion**. It should be:
- autonomy‑respecting (“you can explore; no rush”)
- compassionate, non‑shaming
- truth‑oriented and simple
- practical (small actions, not just concepts)
- safe (no manipulative hypnosis-like claims; no pressure tactics)

**Important UX consequence:** guidance should feel like **an invitation**, not a command.

---

## 3) Audience & Product Direction
**Target audience:** anyone (beginner → advanced).  
**Progression approach:** make topics progressive:
- advanced content requires more steps or completion milestones **or**
- optionally add a paywall for advanced students later

**Competitive inspiration:** Calm and Headspace for popularity patterns (onboarding clarity, polish), but **not their “spiritual integrity.”** Borrow what works, keep message pure.

**Feature note:** AI-generated journaling is **not desired** (journaling can exist, but not as AI-driven “therapy”).

---

## 4) Core Pain Points (Current)
### 4.1 “App feels random”
New users don’t know:
- where to start
- what is foundational vs advanced
- whether there is a recommended flow
- whether jumping around is OK
- what the app expects them to do (browse vs practice)

### 4.2 “Symbol inflation”
Overly symbolic/“cool” visuals can reduce comprehension. The exploration UI risks trying to be:
- a map
- a metaphor
- a teaching device
- art
- a navigation menu  
…all at once → cognitive overload.

### 4.3 “Sections feel isolated”
Current learning can feel: **read → exit → choose another**.  
But Hawkins-style material is recursive; concepts should link.

### 4.4 Must keep “glow”
We want premium, attention-catching visuals, but must balance with clarity.

---

## 5) Visual Direction & Navigation Metaphor
### 5.1 Tree approach (earlier)
- Initial concept: a **tree with many labeled leaves**.
- Practical issue: generating/maintaining complex SVG and hit-target interactions was hard (Gemini struggled with SVG + clickable nodes).
- Direction shifted toward a **radial mandala / compass / wheel** which maps better to interactive segments.

### 5.2 Current exploration hub: Mandala
Mandala is retained (works aesthetically and as navigation).  
We can modify **layout** and **clarity**, but not rebuild the entire concept unless explicitly requested.

**Design requirement:** keep it glowing and premium, but ensure it’s primarily an **interactive menu** and only secondarily “art.”

---

## 6) Current Implementation Snapshot (What’s Done)
Below is the user-provided changelog / implementation history.

### ✅ Complete Changelog: Full Implementation History
**Phase 1: Foundation & Theme**
- Initial project scaffolding
- Luminous dark palette and purple gradients
- Theme tokens and color system
- Tutorial popup integration

**Phase 2: Build Pipeline**
- GitHub Actions for Android APK builds
- Adaptive icon configuration
- Dark theme text visibility fixes

**Phase 3: Animation System**
- Hybrid animation system with COMFYUI integration
- Enhanced content formatting

**Phase 4: Mandala Intelligence**
- Wedge paths, horizontal text, foundation highlighting
- Topic previews and performance optimizations
- Orientation sheet, Start Here, Related Next

**Phase 5: Progress & Gamification**
- Streaks, milestones, mood trends
- Topic completion tracking

**Phase 6: Interactive Components**
- Fluid Breathing, Resistance Melter
- Reading progress, SOS self-inquiry
- Milestone celebration overlay

**Phase 7: Audio & Haptics**
- Breathing exercise audio
- Haptic feedback system
- Essentials content enrichment

---

## 7) Screens / Information Architecture (Current)
### 7.1 Essentials Topics (36 Screens)
#### Core Concepts
- AddictionScreen — Understanding attachment patterns  
- CommonTrapsScreen — Avoiding spiritual pitfalls  
- EffortScreen — Effortless effort principle  
- FatigueVsEnergyScreen — Energy management  
- FulfillmentVsSatisfactionScreen — Deep vs surface happiness  
- IntentionScreen — Power of focused intention  
- LevelsOfTruthScreen — Calibrated truth hierarchy  
- LossAndAbandonmentScreen — Processing grief  
- MantrasScreen — Affirmation practices  
- MusicAsToolScreen — Sound as transformation  
- NaturalHappinessScreen — Unconditional joy  
- NonReactivityScreen — Observer consciousness  
- PositiveReprogrammingScreen — Mental rewiring  
- PowerVsForceScreen — Hawkins core teaching  
- RelaxingScreen — Surrender practices  
- ShadowWorkScreen — Integrating the shadow  
- TensionScreen — Releasing physical holding  
- WhatYouReallyAreScreen — Self-realization  

#### Navigation & Utility
- EssentialsScreen — Sacred mandala hub  
- HomeScreen — Main dashboard  
- JourneyMapScreen — Consciousness map  
- JournalScreen — Private writing space  
- KnowledgeScreen — Feelings explained  
- LearnHubScreen — Learning center  
- LettingGoChapterScreen — Core practice  
- LevelChapterScreen — Level deep-dives  
- LevelDetailScreen — Level overviews  
- LibraryScreen — Content discovery  
- PlayerScreen — Audio/video player  
- ProfileScreen — User profile  
- SettingsScreen — App settings  
- ChapterScreen — Generic chapter view  

#### Onboarding
- 01_WelcomeScreen — Gentle welcome  
- 03_SpectrumCheckScreen — Zone selection  
- 04_FirstBreathScreen — Breathing + techniques  
- 05_LandingScreen — Evaluation  

### 7.2 Custom Animations (22 Components)
- AddictionCloudAnimation — Attachment visualization  
- BodyMindSpiritLayersAnimation — Triune nature  
- DesireBlackHoleAnimation — Craving mechanics  
- EmotionalStackCollapseAnimation — Releasing layers  
- EnergyLeakAnimation — Where energy goes  
- FearGriefSpillAnimation — Emotional overflow  
- HybridAnimation — COMFYUI integration  
- IntentionMagnetAnimation — Attraction principle  
- IntentionRippleAnimation — Intention effects  
- KnowledgeVsPracticeAnimation — Theory vs doing  
- LevelsOfTruthAnimation — Truth calibration  
- MusicVibrationAnimation — Sound waves  
- NaturalHappinessAnimation — Joy visualization  
- PowerVsForceAnimation — Core teaching visual  
- PowerVsForceSkiaAnimation — Skia version  
- ReactionVsPowerAnimation — Response patterns  
- ReprogrammingTransitionAnimation — Mental shift  
- ResistanceFlowAnimation — Surrender visual  
- ShadowIlluminationAnimation — Shadow integration  
- SkiaTestAnimation — Development testing  
- SpiritualProgressSpiralAnimation — Growth trajectory  
- TensionAnimation — Physical release  

### 7.3 Extended: Onboarding (recent additions)
- Welcome timing fix (~4s → ~1s)
- PracticeSelector with tabbed Breathing/Techniques
- 4 breathing exercises + 3 letting go techniques
- Practice detail screen with Glassmorphism
- Functional “Lighter / Same” response buttons
- Audio tick sound every second
- Tratak and Shaking research content

### 7.4 Bug Fixes
- Dark theme text: increased font, textPrimary
- Mandala overlap: horizontal text, no spokes
- Android performance: mandala optimizations
- Welcome slow: reduced animation delays
- Try another loop: CommonActions.reset()
- Tutorial order: reordered navigator

---

## 8) What We’re Trying to Fix Now (High Priority)
We want a plan that is **not vague**. We want **explicit actions**.

### Problems to solve (explicit)
1. First-time user doesn’t know what to do.
2. Foundational vs advanced is unclear.
3. No recommended flow is visible.
4. Sections feel isolated (no continuity).
5. Must keep glow/premium feel without clutter.

---

## 9) Concrete Direction (Keep Mandala, Improve Clarity)
We are NOT rebuilding the mandala concept. We can adjust layout + behavior.

### 9.1 UX Guarantees (Targets)
**Guarantee A — “Primary Next Action” on every major hub**
- One obvious “Continue / Start Here / Recommended Next” CTA.

**Guarantee B — Visible tiering**
- “Foundation → Practice → Deep Dives” signposting throughout.

**Guarantee C — “Recommended path” without force**
- “Start Here” (3 foundations) always visible.
- Every topic ends with “Next Suggested” + “Related” + “Try Now.”

### 9.2 Progressive Unlocking
- Use gentle friction-based unlock first; paywall is optional later.
- Locked content: dim glow + lock icon + gentle sheet:
  - “Unlock by completing Foundations” OR “Unlock with Premium” OR “Not now”.

### 9.3 Glow Budget (to prevent symbol inflation)
- One glow hero per screen.
- Glow communicates state (completed / next / locked), not decoration.

### 9.4 Content Skeleton (to remove “randomness”)
Enforce a consistent structure per topic:
1) One-sentence definition  
2) Why it matters (2 bullets)  
3) Common trap / misunderstanding  
4) Tiny exercise (1–3 min)  
5) Key takeaway (boxed)  
6) Next Suggested + Related + Try Now  

---

## 10) Mandala-Specific Notes (What’s “working” vs “broken”)
### Working
- Wedge paths
- Horizontal text
- Foundation highlighting
- Topic previews
- Performance optimizations
- Orientation sheet / Start Here / Related Next concept exists

### Still needs improvement (behavior & clarity)
- Make “Start Here” unmissable (always visible, not buried).
- Make “Recommended Next” persistent after completing a topic (no dead ends).
- Make ring meaning obvious (Core / Foundations / Practices / Deep Dives).
- Ensure hit targets feel deliberate and consistent.
- Reduce extra visual elements that don’t encode state.

---

## 11) Content Example: “Music as a Tool”
We have content for “Music as a Tool” emphasizing:
- music influences consciousness/energy quality
- anger-based music can provide temporary lift but drains long term
- words + music shape mind and mood
- conscious selection of music as practice tool

We also want to add relevant Hawkins-aligned framing:
- intention matters (why you listen)
- avoid forcing mood shifts; choose supportive uplift
- use music as bridge to higher states, not escapism

(Whiteboard video scripts and voiceovers are part of later content pipeline.)

---

## 12) What to Ask the Next LLM / Gemini Antigravity to Do
### Immediate tasks (Phase 8)
1) Add **Primary CTA** across hubs:
   - Home: “Continue”
   - Essentials: “Start Here”
   - Learn/Library: “Recommended Today”
2) Make “Start Here” always visible on EssentialsScreen.
3) Add “Next Suggested / Related / Try Now” row to every topic.
4) Add tier tags in data (foundation/practice/deep) + UI chips legend.
5) Implement gentle progressive unlock flow (milestone/premium optional).
6) Enforce topic content skeleton template across Essentials topics.
7) Apply Glow Budget (remove non-state decorative glow noise).

### Longer-term research (later)
- Features that add value without compromising integrity (NO AI journaling “therapy”).
- Best-practice onboarding patterns from Calm/Headspace adapted to integrity.

---

## 13) Style & Tone Requirements (UI + Copy)
- Calm, friendly, simple wording.
- No “hustle” or pressure.
- “No rush” framing.
- Clarity over symbolism.
- Keep the premium glow, but use it to guide attention.

---

## 14) Known Constraints / Lessons Learned
- Complex SVG generation + click mapping was hard for Gemini → avoid over-reliance on generating perfect SVGs for interactivity.
- Prefer geometry-driven UI components (wedge hitboxes, segment lists) rather than manually authored, brittle SVG paths.
- Use visuals as **navigation**, not the teaching device itself (teaching happens in the content layer).

---

## 15) Quick “Starter Prompt” for a New LLM Session
Use this block to start a fresh chat:

> You are reviewing and improving the *Levels* meditation/letting-go app inspired by David R. Hawkins. Keep the mandala navigation. The app is premium/glowy but currently unclear: new users don’t know what to do, what’s foundational vs advanced, or whether there’s a recommended flow. Your job: propose specific UI/UX and IA changes (no vagueness) that increase clarity while preserving glow. Do not suggest AI journaling therapy. Provide step-by-step implementation tasks for Gemini Antigravity (React Native style), including acceptance criteria.

---

_End of context pack._
