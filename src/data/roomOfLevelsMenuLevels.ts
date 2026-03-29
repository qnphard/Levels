/**
 * Level ids / labels / colors for Room of Levels v2 door menu.
 * Must stay in sync with LevelStairsMenu LEVELS ordering for navigation.
 */
export type RoomMenuLevel = {
    id: string;
    label: string;
    color: string;
    category: string;
};

export const ROOM_OF_LEVELS_MENU_LEVELS: RoomMenuLevel[] = [
    { id: 'shame', label: 'Shame', color: '#6B21A8', category: 'lower' },
    { id: 'guilt', label: 'Guilt', color: '#7C3AED', category: 'lower' },
    { id: 'apathy', label: 'Apathy', color: '#4B5563', category: 'lower' },
    { id: 'grief', label: 'Grief', color: '#1E40AF', category: 'lower' },
    { id: 'fear', label: 'Fear', color: '#B45309', category: 'lower' },
    { id: 'desire', label: 'Desire', color: '#DC2626', category: 'lower' },
    { id: 'anger', label: 'Anger', color: '#EF4444', category: 'lower' },
    { id: 'pride', label: 'Pride', color: '#F97316', category: 'lower' },
    { id: 'courage', label: 'Courage', color: '#3B82F6', category: 'linear' },
    { id: 'neutrality', label: 'Neutrality', color: '#6B7280', category: 'linear' },
    { id: 'willingness', label: 'Willingness', color: '#059669', category: 'linear' },
    { id: 'acceptance', label: 'Acceptance', color: '#0D9488', category: 'linear' },
    { id: 'reason', label: 'Reason', color: '#0891B2', category: 'linear' },
    { id: 'love', label: 'Love', color: '#EC4899', category: 'spiritual' },
    { id: 'joy', label: 'Joy', color: '#FBBF24', category: 'spiritual' },
    { id: 'peace', label: 'Peace', color: '#8B5CF6', category: 'spiritual' },
    { id: 'enlightenment', label: 'Light', color: '#94A3B8', category: 'enlightenment' },
];

/** Shame … Pride (8 levels, includes Grief) — “lower / heavier” wing */
export const ROOM_LOWER_LEVELS: RoomMenuLevel[] = ROOM_OF_LEVELS_MENU_LEVELS.slice(0, 8);

/** Courage … Peace (8 levels) — “higher / lighter” wing; Light/enlightenment not on this video row */
export const ROOM_HIGHER_LEVELS: RoomMenuLevel[] = ROOM_OF_LEVELS_MENU_LEVELS.slice(8, -1);
