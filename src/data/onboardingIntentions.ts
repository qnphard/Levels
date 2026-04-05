import { Intention } from '../store/onboardingStore';

/** Shared with first-run Intention screen and the Home session modal. */
export const ONBOARDING_INTENTION_OPTIONS = [
  {
    value: Intention.EmergencyRelief,
    icon: 'flash-outline' as const,
    title: 'Emergency Relief',
    subtitle: "I'm struggling right now",
    accent: '#F472B6',
  },
  {
    value: Intention.DailyPractice,
    icon: 'sunny-outline' as const,
    title: 'Daily Practice',
    subtitle: 'Building a regular habit',
    accent: '#A78BFA',
  },
  {
    value: Intention.Understanding,
    icon: 'book-outline' as const,
    title: 'Understanding',
    subtitle: 'Learning about my feelings',
    accent: '#60A5FA',
  },
] as const;
