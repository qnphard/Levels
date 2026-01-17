/**
 * Level Graph - Data model for consciousness levels
 * Maps spiritual levels to 3D spiral positions
 */

export type LevelNode = {
    id: string;
    label: string;
    stepIndex: number;
    color: string;
};

// Levels ordered from lowest to highest consciousness
// Reduced spacing for tighter visual grouping
export const LEVELS: LevelNode[] = [
    // Heavy Weather (0-80) - closer together
    { id: 'shame', label: 'Shame', stepIndex: 0, color: '#4DD0E1' },
    { id: 'guilt', label: 'Guilt', stepIndex: 12, color: '#5C6BC0' },
    { id: 'apathy', label: 'Apathy', stepIndex: 24, color: '#7E57C2' },
    { id: 'grief', label: 'Grief', stepIndex: 36, color: '#AB47BC' },
    { id: 'fear', label: 'Fear', stepIndex: 48, color: '#EC407A' },
    { id: 'desire', label: 'Desire', stepIndex: 60, color: '#F06292' },
    { id: 'anger', label: 'Anger', stepIndex: 72, color: '#EF5350' },
    { id: 'pride', label: 'Pride', stepIndex: 84, color: '#FF7043' },

    // Power Levels (96+)
    { id: 'courage', label: 'Courage', stepIndex: 96, color: '#FFA726' },
    { id: 'neutrality', label: 'Neutrality', stepIndex: 108, color: '#FFCA28' },
    { id: 'willingness', label: 'Willingness', stepIndex: 120, color: '#FFEE58' },
    { id: 'acceptance', label: 'Acceptance', stepIndex: 132, color: '#D4E157' },
    { id: 'reason', label: 'Reason', stepIndex: 144, color: '#9CCC65' },
    { id: 'love', label: 'Love', stepIndex: 156, color: '#66BB6A' },
    { id: 'joy', label: 'Joy', stepIndex: 168, color: '#26A69A' },
    { id: 'peace', label: 'Peace', stepIndex: 180, color: '#26C6DA' },
    { id: 'enlightenment', label: 'Enlightenment', stepIndex: 192, color: '#FFFFFF' },
];

// Quick lookup by ID
export const LEVELS_BY_ID = Object.fromEntries(
    LEVELS.map((l) => [l.id, l])
) as Record<string, LevelNode>;

// Total steps needed (last level + padding)
export const TOTAL_STEPS = LEVELS[LEVELS.length - 1].stepIndex + 20;

// Zone definitions for atmosphere
export type AtmosphereZone = 'heavyWeather' | 'power' | 'transcendence';

export function getZoneForStep(step: number): AtmosphereZone {
    if (step < 96) return 'heavyWeather';
    if (step < 180) return 'power';
    return 'transcendence';
}
