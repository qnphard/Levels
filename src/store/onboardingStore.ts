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

interface OnboardingState {
    name: string;
    currentZone: Zone | null;
    intention: string;
    isComplete: boolean;
    showOnboarding: boolean; // Toggle to show/hide onboarding each launch (default: true)
    hasShownOverlay: boolean;
    hasSeenTutorial: boolean;
    showTutorialAgain: boolean;
    seenExplanations: string[];
    setName: (name: string) => void;
    setZone: (zone: Zone) => void;
    setIntention: (intention: string) => void;
    completeOnboarding: () => void;
    setShowOnboarding: (show: boolean) => void;
    setHasShownOverlay: (shown: boolean) => void;
    setHasSeenTutorial: (seen: boolean) => void;
    setShowTutorialAgain: (show: boolean) => void;
    markExplanationAsSeen: (page: string) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            name: '',
            currentZone: null,
            intention: '',
            isComplete: false,
            showOnboarding: true, // Show onboarding by default
            hasShownOverlay: false,
            hasSeenTutorial: false,
            showTutorialAgain: false,
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
            markExplanationAsSeen: (page) => set((state) => ({
                seenExplanations: state.seenExplanations.includes(page)
                    ? state.seenExplanations
                    : [...state.seenExplanations, page]
            })),
            reset: () => set({
                name: '',
                currentZone: null,
                intention: '',
                isComplete: false,
                showOnboarding: true, // Reset to default
                hasShownOverlay: false,
                hasSeenTutorial: false,
                showTutorialAgain: false,
                seenExplanations: []
            }),
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                name: state.name,
                currentZone: state.currentZone,
                intention: state.intention,
                showOnboarding: state.showOnboarding,
                hasShownOverlay: state.hasShownOverlay,
                hasSeenTutorial: state.hasSeenTutorial,
                showTutorialAgain: state.showTutorialAgain,
                seenExplanations: state.seenExplanations,
            }),
            // Custom merge: Always reset isComplete to false on app launch
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...(persistedState as Partial<OnboardingState>),
                isComplete: false, // Always start fresh - onboarding shows each launch
            }),
        }
    )
);
