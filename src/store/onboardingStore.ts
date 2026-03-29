import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum Zone {
    Shame = 'Shame',
    Guilt = 'Guilt',
    Apathy = 'Apathy',
    Grief = 'Grief',
    Fear = 'Fear',
    Desire = 'Desire',
    Anger = 'Anger',
    Pride = 'Pride',
    Pivot = 'Pivot',
    Flow = 'Flow',
    Source = 'Source',
}

export enum Intention {
    EmergencyRelief = 'emergency_relief',
    DailyPractice = 'daily_practice',
    Understanding = 'understanding',
}

interface OnboardingState {
    /** Last signed-in Firebase uid this device associated onboarding completion with. */
    onboardingUserId: string | null;
    name: string;
    currentZone: Zone | null;
    intention: Intention | null;
    isComplete: boolean;
    /**
     * First-run onboarding (`OnboardingNavigator`): intention → check-in → breath. Gated by `isComplete` and
     * this flag; intended to be shown once per user (then `isComplete` stays true). Kept toggleable for testing.
     */
    showOnboarding: boolean;
    hasShownOverlay: boolean;
    /** Tutorial stack (`TutorialNavigator`) after first-run: repeatable via settings (`showTutorialAgain`). */
    hasSeenTutorial: boolean;
    showTutorialAgain: boolean;
    /**
     * Reserved for future “every app open” entry (e.g. daily tip) — separate from first-run and tutorial.
     * Do not reuse `showOnboarding` or tutorial flags for this.
     */
    showAppEntryOnboarding: boolean;
    /**
     * True after the user has completed the “What brings you here?” choice (first-run or Home modal), or
     * migrated when `intention` was already set.
     */
    hasCompletedIntentionPrompt: boolean;
    /**
     * Local calendar day (YYYY-MM-DD) when the user checked “don’t ask again today” on the Home session modal.
     * Suppress that modal until the next local midnight when this matches today.
     */
    intentionPromptSnoozeDateLocal: string | null;
    seenExplanations: string[];
    setName: (name: string) => void;
    setZone: (zone: Zone) => void;
    setIntention: (intention: Intention) => void;
    completeOnboarding: () => void;
    setShowOnboarding: (show: boolean) => void;
    setHasShownOverlay: (shown: boolean) => void;
    setHasSeenTutorial: (seen: boolean) => void;
    setShowTutorialAgain: (show: boolean) => void;
    setShowAppEntryOnboarding: (show: boolean) => void;
    setHasCompletedIntentionPrompt: (done: boolean) => void;
    setIntentionPromptSnoozeDateLocal: (day: string | null) => void;
    markExplanationAsSeen: (page: string) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            onboardingUserId: null,
            name: '',
            currentZone: null,
            intention: null,
            isComplete: false,
            showOnboarding: true, // Show onboarding by default
            hasShownOverlay: false,
            hasSeenTutorial: false,
            showTutorialAgain: false,
            showAppEntryOnboarding: false,
            hasCompletedIntentionPrompt: false,
            intentionPromptSnoozeDateLocal: null,
            seenExplanations: [],
            setName: (name) => set({ name }),
            setZone: (zone) => set({ currentZone: zone }),
            setIntention: (intention) => set({ intention }),
            completeOnboarding: () => set({ isComplete: true }),
            setShowOnboarding: (show) => set({ showOnboarding: show }),
            setHasShownOverlay: (shown) => set({ hasShownOverlay: shown }),
            setHasSeenTutorial: (seen) => set({
                hasSeenTutorial: seen,
                showTutorialAgain: seen ? false : true // Reset toggle if seen
            }),
            setShowTutorialAgain: (show) => set((state) => ({
                showTutorialAgain: show,
                seenExplanations: show ? [] : state.seenExplanations
            })),
            setShowAppEntryOnboarding: (show) => set({ showAppEntryOnboarding: show }),
            setHasCompletedIntentionPrompt: (done) => set({ hasCompletedIntentionPrompt: done }),
            setIntentionPromptSnoozeDateLocal: (day) => set({ intentionPromptSnoozeDateLocal: day }),
            markExplanationAsSeen: (page) => set((state) => ({
                seenExplanations: state.seenExplanations.includes(page)
                    ? state.seenExplanations
                    : [...state.seenExplanations, page]
            })),
            reset: () => set({
                onboardingUserId: null,
                name: '',
                currentZone: null,
                intention: null,
                isComplete: false,
                showOnboarding: true, // Reset to default
                hasShownOverlay: false,
                hasSeenTutorial: false,
                showTutorialAgain: false,
                showAppEntryOnboarding: false,
                hasCompletedIntentionPrompt: false,
                intentionPromptSnoozeDateLocal: null,
                seenExplanations: []
            }),
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                onboardingUserId: state.onboardingUserId,
                name: state.name,
                currentZone: state.currentZone,
                intention: state.intention,
                isComplete: state.isComplete,
                showOnboarding: state.showOnboarding,
                hasShownOverlay: state.hasShownOverlay,
                hasSeenTutorial: state.hasSeenTutorial,
                showTutorialAgain: state.showTutorialAgain,
                showAppEntryOnboarding: state.showAppEntryOnboarding,
                hasCompletedIntentionPrompt: state.hasCompletedIntentionPrompt,
                intentionPromptSnoozeDateLocal: state.intentionPromptSnoozeDateLocal,
                seenExplanations: state.seenExplanations,
            }),
        }
    )
);
