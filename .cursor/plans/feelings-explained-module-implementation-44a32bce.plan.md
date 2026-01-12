<!-- 44a32bce-eb9d-44a2-bd90-e6a681ec07df bac0064f-1285-4a50-919d-bf8f3d8207ff -->
# Letting Go Chapter Implementation

## Overview

Replace the existing LettingGoChapterScreen with new content that matches the provided copy, includes a 2-minute practice timer modal, and updates navigation/related links.

## Implementation Steps

### 1. Create Practice Timer Modal Component

**File**: `src/components/PracticeTimerModal.tsx` (new)

- Create a modal component with a 2-minute circular progress timer
- Include start/pause/cancel controls
- Show encouraging toast messages on start/completion
- Use theme colors and match app styling patterns
- Modal backdrop with close button

### 2. Update LettingGoChapterScreen Content

**File**: `src/screens/LettingGoChapterScreen.tsx`

- Replace all tab content with the new provided copy:
- Tab 1: "What This Really Is" (replaces "Key Takeaways")
- Tab 2: "When To Use It" (replaces "When to Use")
- Tab 3: "How To Practice" (replaces "Practice")
- Tab 4: "What Starts To Change" (replaces "Benefits")
- Tab 5: "When You Feel Stuck" (replaces "Common Blocks")
- Tab 6: "Related" (keep existing)
- Update tab labels array to match new names
- Integrate PracticeTimerModal in the "How To Practice" tab
- Replace practice steps with the new 5-step simple version
- Add safety messaging in "When You Feel Stuck" tab
- Update screen title to "Letting Go" (remove "Releasing Emotions" from title)
- Update subtitle to "A kinder way to be with your feelings, instead of fighting them"

### 3. Update Related Chapters Links

**File**: `src/screens/LettingGoChapterScreen.tsx`

- Update related chapters to: Suppression, Expression, Escape, Stress
- Add Courage as a special link (navigate to LevelDetail with levelId: 'courage' instead of Chapter)
- Update relatedChapters data in feelingsChapters.ts if needed

### 4. Update Library Screen Card

**File**: `src/screens/LibraryScreen.tsx`

- Update lettingGoCardSubtitle to: "A kinder way to be with your feelings, instead of fighting them"

### 5. Deep Linking Support

**File**: `src/screens/LettingGoChapterScreen.tsx`

- Update tab key mapping to support deep links:
- `what-this-really-is` (was `key-takeaways`)
- `when-to-use-it` (was `when-to-use`)
- `how-to-practice` (was `practice`)
- `what-starts-to-change` (was `benefits`)
- `when-you-feel-stuck` (was `common-blocks`)
- `related` (unchanged)
- Ensure route.params.tab parsing works with new tab keys

### 6. Update Chapter Data

**File**: `src/data/feelingsChapters.ts`

- Update letting-go chapter summary to match new subtitle if needed
- Ensure relatedChapters array includes: 'suppression', 'expression', 'escape', 'stress'

## Key Requirements

- Use exact copy provided by user (warm, non-clinical tone)
- Timer modal: 2 minutes, circular progress, cancel option, encouraging messages
- Safety messaging: Include clear guidance about seeking professional help
- Accessibility: Maintain keyboard navigation, screen reader support, proper contrast
- Theming: Match purple accent glow, support dark/light modes
- Navigation: Remember last active tab, support deep links with new tab names

### To-dos

- [ ] Install react-native-markdown-display package
- [ ] Move markdown files from Feelings/ to src/assets/feelings/ and rename Stress_updated.md to Stress.md
- [ ] Add FeelingChapter and ChapterProgress interfaces to src/types/index.ts
- [ ] Create src/data/feelingsChapters.ts with chapter metadata and cross-links
- [ ] Create useMarkdownChapter hook to load and parse markdown files
- [ ] Create useChapterProgress hook for tracking reading progress with AsyncStorage
- [ ] Create FeelingsExplainedCard component with two CTAs matching app styling
- [ ] Create ChapterCard component with glow effects and progress ring
- [ ] Create WhyFeelingSheet bottom sheet modal with 3-step flow
- [ ] Create LearnHubScreen with search, filters, and chapter grid
- [ ] Create ChapterScreen with markdown renderer, sticky tabs, and scroll-spy
- [ ] Add LearnHub and Chapter routes to AppNavigator
- [ ] Add Feelings Explained section to JourneyMapScreen
- [ ] Add FeelingsExplainedCard to LibraryScreen
- [ ] Add info icon to LevelDetailScreen that opens WhyFeelingSheet with prefill
- [ ] Add glow and card color tokens to theme for each chapter topic
- [ ] Create custom markdown styles matching app theme (light/dark)
- [ ] Add VoiceOver landmarks, accessibility labels, and dynamic type support
- [ ] Create PracticeTimerModal component with 2-minute circular timer, start/pause/cancel controls, and toast messages
- [ ] Replace LettingGoChapterScreen content with new tabs and copy: What This Really Is, When To Use It, How To Practice, What Starts To Change, When You Feel Stuck, Related
- [ ] Update related chapters to include Suppression, Expression, Escape, Stress, and add Courage level link
- [ ] Update LibraryScreen card subtitle to 'A kinder way to be with your feelings, instead of fighting them'
- [ ] Update tab key mapping for deep linking support with new tab names