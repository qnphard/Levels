# Levels App — Context Pack (for continuing elsewhere)

> **Purpose of this file**: preserve the working context, decisions, constraints, and next steps for the “Levels” meditation/hypnosis-style app so the conversation can continue in a different place without losing momentum.

---

## 1) Project snapshot

- You’re building a **meditation + guided inner-work app** structured around **David R. Hawkins’ “Levels of Consciousness”** style framing.
- The app must align with an **Integrity Protocol**: non-forceful, truth-oriented, autonomy-respecting, compassionate, safe.
- Core product direction: create **immersive “Level Spaces”** (rooms/realms) per level (e.g., Shame, Guilt, Apathy…) that teach:
  - what the level is,
  - its purpose/function,
  - felt sense (somatic experience),
  - traps (ego patterns),
  - exits (how to transcend),
  - practices (meditations),
  - supporting articles.

---

## 2) Content + audio generation pipeline (current approach)

### 2.1 On-demand scripts
- You currently use **Gemini** to generate scripts dynamically (and narrate via TTS).
- You want the app to customize scripts for the user **on demand**, not just a small fixed library.

### 2.2 Binaural beats + background ambience
- You experimented with different binaural generation tools.
- Current cheap tool used: **BinauralPure** (web-based), where you set:
  - **Binaural Beat (Hz)**
  - **Carrier (Hz)**
  - **Tone volume**
  - **Background type** (Wind / Pink Noise / Brown Noise / Rain / etc.)
  - **Background volume**

- You also noted a **Hemi-Sync-like idea**: slight differences in perceived loudness / channel balancing between L/R to deepen immersion (separate from the binaural frequency difference itself).

### 2.3 Background sounds you chose to standardize around
- **Wind**
- **Pink noise**
- **Brown noise**
- **Rain**

(Additional common options we discussed generally: ocean waves, river/stream, forest/ambient birds, fire/crackle, white noise, etc.)

### 2.4 Mixing intent (high-level)
- Voice should usually be the **anchor**.
- Binaural tones should be **felt not heard** (subtle).
- Background should be **supportive**, never masking voice.

*(Exact % values were discussed as a system you want Gemini to output per track; you prefer no missing details.)*

---

## 3) Meditation library you’re building (20 tracks)

### FIND PEACE (grounding / re-orientation)
1. Breath Awareness  
2. Body Scan  
3. Safe Space  
4. Reset After Overwhelm  

### LET GO (reduce struggle)
5. Releasing Tension  
6. Letting Thoughts Pass  
7. Softening Practice  
8. Meeting Resistance  
9. Staying With Discomfort  

### DISCOVER JOY (goodwill / okay-ness)
10. Gratitude Meditation  
11. Loving Kindness  

### BE PRESENT (integration / transitions)
12. Stillness Practice  
13. Morning Centering  
14. Between Tasks  
15. Returning to Daily Life  

### REST DEEPLY (down-regulation)
16. Deep Sleep Journey  
17. Evening Wind Down  
18. Sleep Body Scan  
19. Middle of the Night  
20. Rest Without Sleep  

---

## 4) TTS inside the app (key requirement)

- You want **local or low-cost TTS** for production use, not only ElevenLabs.
- Goal: app can generate script text + **synthesize voice** reliably (no 503-type failures).
- You asked specifically: “Any free TTS app that I can just make it local in my app?”

*(Pending: pick a specific stack based on platform constraints, quality, licensing, offline requirements.)*

---

## 5) Prompting strategy for scripts (high-level constraints)

You shared a “SOP / Vibe Blueprints” prompt approach:
- Dynamic blueprint per style (mindfulness / ericksonian / performance etc.)
- Hard constraints:
  - **~130 WPM** reading speed (word-count matched to duration)
  - Calm, premium, expert, compassionate tone
  - No stage directions; output only spoken text
  - Sleep content should **not include wake-up**
  - Positive suggestions only

Later decision:
- **Remove “clinical hypnosis” category for now** (to avoid losing purpose/ethical issues), and focus on non-hypnotic categories.

---

## 6) Levels “Room / Realm” UX direction

### 6.1 Your core vision
For each level (e.g., “Shame”), user enters a **space** that feels like:
- a themed environment (e.g., cave-like, heavy atmosphere),
- with **rooms inside rooms** (deeper layers),
- containing **full articles** for each aspect (Felt Sense, Purpose, Traps, Exits),
- and each trap has its **own deep article**.

You explicitly said:
- **No character limit**.
- If important detail is missing, it’s a fail.
- Mobile constraints should be solved by **structure**, not truncation.

### 6.2 What you tried and why it felt “lame”
- First pass: a simple hub with icons (Purpose / Felt Sense / Practices / Traps / Exits).
- Issue: it felt like icons floating in space, not a **place**.
- Then: page-to-page jumps to simulate going deeper.
- Issue: content pages looked like **plain articles**, breaking immersion.

### 6.3 “What went wrong” after improvements (key diagnosis)
You successfully added more detail, but immersion broke because:
1. **Atmosphere resets** when entering content pages (room → white/article page).
2. UI reads like a knowledge base (accordion lists and boxes) instead of a world.
3. No spatial continuity cues (no depth indicator, breadcrumbs, portal transitions).
4. The “map” lacks doors/paths/affordances (structure doesn’t feel physical).
5. Mobile reading needs segmentation + rest points, not shorter text.

---

## 7) The recommended fix: keep full detail AND increase immersion

### 7.1 Keep the environment persistent
- Keep the level background/texture present on all subpages.
- Put text on “glass / parchment” overlays (blur/translucency).
- As depth increases, gradually shift lighting/vignette/particles.

### 7.2 Replace giant accordion-first layouts with “Chamber” progression
Instead of one huge page with collapsible sections:
- Each concept becomes a **chamber** (still long-form allowed):
  - Felt Sense Hall → Thoughts Chamber → Real-life patterns → Body map → Micro-practice → Exit Door
- Each chamber can include **cards** that open into deeper sub-articles.

### 7.3 Add depth feedback
Pick 2–3:
- Portal/zoom transition into nodes
- Breadcrumbs: `Shame Space › Felt Sense › Thoughts`
- “Depth 2 of 6” / descent indicator
- Ambient shift (particles slow, vignette increases)

### 7.4 Redesign the map as doors + paths
- Nodes become “doors.”
- Visible paths show progression.
- Locked doors show “why” and how to unlock (e.g., “Read Felt Sense first”).

---

## 8) Your current UI direction (observed from screenshots)
- You experimented with:
  - “Room of Levels” (multiple level nodes in one room)
  - “Shame Space” hub with nodes
  - A white article layout for Felt Sense content
- You want a more stylish, cool layout system suitable for Android (but not generic Material screens).

---

## 9) Implementation / technical notes (observed errors)
- You hit a React Native bundler error: **Unable to resolve module** for images:
  - Example: `../assets/images/levels/shame/bg_far.png`
- This suggests file path / naming mismatch or asset not included in bundle.

---

## 10) Open decisions / next steps

### A) Decide the “world navigation model”
Options to evaluate:
1. **Room hub → Doors → Chambers** (best for “depth” feeling)
2. **Scrollable “walkthrough” with embedded portals** (feels like descent)
3. **2.5D parallax scene with hotspots** (strong immersion; heavier build)

### B) Define a standard “chamber template”
For each chamber:
- Title + short orientation (2–4 lines)
- 3–6 “deep cards”
- Continue button to next chamber
- Breadcrumb + depth indicator
- Persistent background atmosphere

### C) Update Gemini prompt for content generation
You asked: “I want to give him this prompt—what would you add?”
Recommended additions:
- enforce chamber structure,
- enforce persistent atmosphere cues,
- require “end each article with a door to the next chamber,”
- forbid “wiki tone,”
- add breadcrumb metadata output (optional),
- require “mobile scanability without truncation” (short paragraphs, headers, but unlimited length).

### D) Pick a TTS stack (local/cheap)
Define:
- platform target (Android/iOS),
- offline requirement,
- voice quality threshold,
- licensing constraints.

### E) Audio spec for each meditation track
You asked for prompts per track containing:
- binaural settings (beat Hz, carrier Hz, ramping if any),
- background choice among (wind/pink/brown/rain),
- volume percentages (voice vs binaural vs background),
- optional L/R balance suggestions.

---

## 11) Key principles you want to preserve
- No coercion, no manipulation.
- No shallow summaries when depth is needed.
- Mobile UX must be solved with structure and pacing, not limits.
- “Going deeper” should feel like entering inner chambers (not tapping a menu).

---

### Appendix: Terms used
- **Room / Space / Realm**: the immersive environment for a level.
- **Chamber**: a sub-room focused on one concept (Felt Sense, Purpose, etc.).
- **Door**: navigation element into a chamber or deeper article.
- **Depth**: an explicit progression cue showing descent into the level’s mechanics.

---

**End of context pack**
