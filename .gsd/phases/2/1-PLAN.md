---
phase: 2
plan: 1
wave: 1
---

# Phase 2: Content Accuracy & Deep Insight

## Objective

Improve the "Why am I feeling like this?" flow with Hawkins-accurate content from source books.

## Context Files

- `src/components/WhyFeelingSheet.tsx` (41KB) — Main component with emotion→insight mappings
- `src/data/emotions.ts` — Emotion data (if exists)
- `src/data/emotionRouting.ts` — Emotion→level routing
- `C:\Users\Admin\Desktop\Resources\` — Hawkins source books

## Research Phase

Before implementation, study these Hawkins resources:
- `01_Context_and_Framework.md` — Core framework
- `02_Nonlinearity_and_Consciousness.md` — Consciousness shifts
- `03_Letting_Go_and_Addiction.md` — Resistance and release
- `04_Pain_Fatigue_and_Healing.md` — Physical manifestations
- Other `.md` files in Resources folder

## Tasks

### Wave 1: Content Audit

<task type="manual">
  <name>Audit WhyFeelingSheet content</name>
  <files>src/components/WhyFeelingSheet.tsx</files>
  <action>
    Review existing content for each emotion:
    - Extract current RESERVOIR+TRIGGER text
    - Extract current COPING TRAP text
    - Extract current PURPOSE text
    - Compare to Hawkins source material
    - Note inaccuracies and gaps
  </action>
  <verify>Create audit document listing discrepancies</verify>
  <done>Audit complete with list of content to fix</done>
</task>

### Wave 2: Situation Expansion

<task type="auto">
  <name>Expand situation list</name>
  <files>src/components/WhyFeelingSheet.tsx</files>
  <action>
    Current situations are limited. Add missing common situations:
    - Work stress / deadline pressure
    - Financial worry
    - Health anxiety
    - Loneliness / isolation
    - Family conflict
    - Existential questioning
    - Creative block
    - Comparison to others (social media)
    - Rejection / exclusion
    - Boredom / emptiness
  </action>
  <verify>Run app → "Why am I feeling like this?" → verify new situations appear</verify>
  <done>Situation list expanded with 10+ new options</done>
</task>

### Wave 3: Content Rewrite

<task type="auto">
  <name>Rewrite Shame deep insight</name>
  <files>src/components/WhyFeelingSheet.tsx</files>
  <action>
    Update RESERVOIR+TRIGGER, COPING TRAP, PURPOSE for Shame based on Hawkins:
    - Shame = fundamental unworthiness, desire to disappear
    - Trap = believing you ARE the shame vs experiencing it
    - Way through = self-compassion, separating feeling from identity
  </action>
  <verify>Select Shame → verify new accurate content appears</verify>
  <done>Shame content accurate per Hawkins</done>
</task>

<task type="auto">
  <name>Rewrite Guilt deep insight</name>
  <files>src/components/WhyFeelingSheet.tsx</files>
  <action>
    Update for Guilt based on Hawkins:
    - Guilt = past-focused remorse, self-punishment
    - Trap = using guilt as penance, believing suffering atones
    - Way through = forgiveness, growth honors the past better than suffering
  </action>
  <verify>Select Guilt → verify accurate content</verify>
  <done>Guilt content accurate per Hawkins</done>
</task>

<task type="auto">
  <name>Rewrite remaining emotions</name>
  <files>src/components/WhyFeelingSheet.tsx</files>
  <action>
    Update deep insight content for all 16 levels:
    - Apathy, Grief, Fear, Desire, Anger, Pride (below 200)
    - Courage, Neutrality, Willingness, Acceptance, Reason (empowerment)
    - Love, Joy, Peace (spiritual)
    Use existing levels.ts data as reference for consistency
  </action>
  <verify>Spot check 3 random levels for accuracy</verify>
  <done>All 16 level insights rewritten from Hawkins sources</done>
</task>

### Wave 4: Routing Verification

<task type="auto">
  <name>Verify emotion→level mappings</name>
  <files>src/data/emotionRouting.ts</files>
  <action>
    Review and fix mappings:
    - "anxious" → Fear (100)
    - "worthless" → Shame (20)
    - "resentful" → Anger (150)
    - "numb" → Apathy (50)
    - etc.
    Ensure all emotion words map to correct consciousness level
  </action>
  <verify>Select "anxious" → verify routes to Fear content</verify>
  <done>All emotion→level mappings verified correct</done>
</task>

## Success Criteria

- [ ] Situation list has 15+ options covering common struggles
- [ ] All 16 levels have accurate RESERVOIR+TRIGGER content
- [ ] All 16 levels have accurate COPING TRAP content
- [ ] All 16 levels have accurate PURPOSE content
- [ ] Emotion→level mappings verified correct
- [ ] Content aligns with Hawkins source material

## Verification Plan

1. **Content Review**: Compare app output to source books for Shame, Guilt, Fear
2. **User Flow**: Run full "Why am I feeling like this?" flow on emulator
3. **Routing Check**: Verify least 5 emotion words route to correct levels
