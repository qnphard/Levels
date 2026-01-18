---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Tier Tags and Content Skeleton

## Objective

Add visible tier tags (Foundation / Practice / Deep Dive) to content and enforce a consistent topic content skeleton template.

## Context

- .gsd/SPEC.md
- .gsd/ROADMAP.md (Phase 1 deliverables)
- src/data/essentials.ts (if exists) or topic data files
- src/screens/ (topic screens like AddictionScreen, etc.)
- C:\Users\Admin\Desktop\Resources\Levels_App_Context_Pack.md (content skeleton spec)

## Tasks

<task type="auto">
  <name>Add tier metadata to topic data</name>
  <files>src/data/essentials.ts, src/data/topics.ts (or equivalent)</files>
  <action>
    Add a `tier` field to each topic in the data layer:
    - `tier: 'foundation' | 'practice' | 'deep-dive'`
    - Classify existing topics appropriately
    - Foundation: core concepts (Letting Go, Power vs Force, What You Really Are)
    - Practice: exercises (Breathing, Mantras, Relaxing)
    - Deep Dive: advanced (Shadow Work, Levels of Truth)
  </action>
  <verify>Import topic data and log to console, verify tier field exists</verify>
  <done>All topics have tier classification in data layer</done>
</task>

<task type="auto">
  <name>Create TierChip component</name>
  <files>src/components/TierChip.tsx (new file)</files>
  <action>
    Create a reusable TierChip component that:
    - Accepts `tier: 'foundation' | 'practice' | 'deep-dive'`
    - Displays appropriate label and color:
      - Foundation: gold/amber glow
      - Practice: green glow
      - Deep Dive: purple glow
    - Small pill/chip style (height ~24px)
  </action>
  <verify>Import TierChip in a test screen, verify renders correctly</verify>
  <done>TierChip component exists and displays tier with appropriate styling</done>
</task>

<task type="auto">
  <name>Add tier legend to EssentialsScreen</name>
  <files>src/screens/EssentialsScreen.tsx</files>
  <action>
    Add a small legend near the top of EssentialsScreen showing:
    - Three TierChips with labels explaining the tiers
    - Positioned below the "Start Here" CTA
    - Semi-transparent background to not compete with mandala
  </action>
  <verify>Run app, navigate to Essentials, verify tier legend is visible</verify>
  <done>EssentialsScreen shows tier legend explaining Foundation/Practice/Deep Dive</done>
</task>

## Success Criteria

- [ ] Topics have tier field in data layer
- [ ] TierChip component exists with 3 color variants
- [ ] EssentialsScreen shows tier legend
