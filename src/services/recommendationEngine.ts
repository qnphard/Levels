import { Zone } from '../store/onboardingStore';

/**
 * Maps user state (intention, zone) to recommended Mandala IDs.
 */
export const getRecommendedMandalaId = (intention: string, currentZone: Zone | null): string => {
    const goal = intention.toLowerCase();

    // Primary Goal Mapping
    if (goal.includes('anxiety') || goal.includes('stress') || goal.includes('overwhelm')) {
        return 'preventing-stress';
    }
    if (goal.includes('peace') || goal.includes('calm') || goal.includes('balance')) {
        return 'feelings-explained';
    }
    if (goal.includes('let go') || goal.includes('release') || goal.includes('attachment')) {
        return 'letting-go';
    }
    if (goal.includes('meaning') || goal.includes('purpose') || goal.includes('who am i')) {
        return 'what-you-really-are';
    }
    if (goal.includes('happiness') || goal.includes('joy') || goal.includes('depression')) {
        return 'natural-happiness';
    }
    if (goal.includes('energy') || goal.includes('burnout')) {
        return 'fatigue-vs-energy';
    }

    // Fallback to Zone mapping
    if (currentZone) {
        const stressfulZones = [Zone.Fear, Zone.Anger, Zone.Guilt, Zone.Shame];
        if (stressfulZones.includes(currentZone)) {
            return 'letting-go';
        }
    }

    // Default recommendation
    return 'what-you-really-are';
};
