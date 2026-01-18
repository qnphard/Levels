---
phase: 1
plan: 1
wave: 1
---

# Phase 1: UX Clarity & Navigation

## Objective

Ensure users always know their next step and understand content hierarchy.

## Context Files

- `src/data/essentials.ts` — Topic data (needs tier field)
- `src/screens/EssentialsScreen.tsx` — Mandala display
- `src/components/RadialMenuLayout.tsx` — Mandala layout
- `src/components/RelatedNextCard.tsx` — Existing "Next" component
- `src/screens/HomeScreen.tsx` — DEV TEST card removal
- `src/screens/*.tsx` — All topic screens need RelatedNextCard integration

## Tasks

### Wave 1: Data Layer & Components

<task type="auto">
  <name>Add tier field to EssentialItem type</name>
  <files>src/data/essentials.ts</files>
  <action>
    Add `tier: 'foundation' | 'practice' | 'deep-dive'` to EssentialItem interface.
    Classify each of the 22 items:
    - foundation: what-you-really-are, feelings-explained, letting-go (already marked isFoundation)
    - practice: mantras, relaxing, breathing techniques, tension, preventing-stress
    - deep-dive: shadow-work, levels-of-truth, power-vs-force, addiction, common-traps, etc.
  </action>
  <verify>TypeScript compilation passes with new field</verify>
  <done>All 22 EssentialItem entries have tier classification</done>
</task>

<task type="auto">
  <name>Create TierChip component</name>
  <files>src/components/TierChip.tsx (new)</files>
  <action>
    Create reusable chip component:
    - Props: tier: 'foundation' | 'practice' | 'deep-dive'
    - Colors: foundation=gold/amber, practice=green, deep-dive=purple
    - Style: small pill, ~22px height, glow effect
    - Export for use in mandala and topic screens
  </action>
  <verify>Import TierChip in RadialMenuLayout, verify renders</verify>
  <done>TierChip component exists with 3 color variants</done>
</task>

### Wave 2: UI Integration

<task type="auto">
  <name>Add tier legend to EssentialsScreen</name>
  <files>src/screens/EssentialsScreen.tsx</files>
  <action>
    Below StartHereCard, add a small legend showing:
    - Three TierChip examples with labels
    - "Foundation: Start here • Practice: Apply daily • Deep Dive: Go deeper"
    - Semi-transparent, doesn't compete with mandala
  </action>
  <verify>Run app → Essentials tab → verify legend visible below Start Here</verify>
  <done>Tier legend appears on EssentialsScreen</done>
</task>

<task type="auto">
  <name>Display tier on mandala nodes</name>
  <files>src/components/RadialMenuLayout.tsx</files>
  <action>
    For each mandala node, show small tier indicator:
    - Color ring or dot matching tier color
    - Subtle, doesn't clutter the mandala
    - Use tier from essentialItems data
  </action>
  <verify>Run app → Essentials → mandala shows tier colors on nodes</verify>
  <done>Mandala nodes display tier classification visually</done>
</task>

### Wave 3: Content Flow

<task type="auto">
  <name>Wire RelatedNextCard to topic screens</name>
  <files>Multiple topic screens in src/screens/</files>
  <action>
    For each topic screen (e.g., AddictionScreen, TensionScreen, etc.):
    - Import RelatedNextCard
    - Get related IDs from essentialItems[].related
    - Add RelatedNextCard at bottom of ScrollView
    - Pass related topics for navigation
  </action>
  <verify>Complete any topic → scroll to bottom → verify "Up Next" cards appear</verify>
  <done>All topic screens show RelatedNextCard at bottom</done>
</task>

<task type="auto">
  <name>Remove DEV TEST card from HomeScreen</name>
  <files>src/screens/HomeScreen.tsx</files>
  <action>
    Remove the "DEV TEST: Stairs Animation" card (lines ~192-217).
    This is temporary test UI that should be removed after Phase 3.
  </action>
  <verify>Run app → Home → no green DEV TEST card visible</verify>
  <done>DEV TEST card removed from HomeScreen</done>
</task>

## Success Criteria

- [ ] EssentialItem has tier field with all 22 items classified
- [ ] TierChip component exists and renders correctly
- [ ] EssentialsScreen shows tier legend
- [ ] Mandala nodes display tier colors
- [ ] All topic screens show RelatedNextCard at bottom
- [ ] DEV TEST card removed from HomeScreen

## Verification Plan

1. **TypeScript Check**: `npx tsc --noEmit` passes
2. **Visual Check**: Run on Android emulator, screenshot EssentialsScreen
3. **Flow Check**: Navigate topic → scroll down → verify RelatedNextCard
4. **Cleanup Check**: HomeScreen has no DEV TEST card
