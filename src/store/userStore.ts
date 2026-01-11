import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zone } from './onboardingStore';

export interface CheckInEntry {
    timestamp: number;
    zone: Zone;
    note?: string;
}

export interface SessionEntry {
    timestamp: number;
    topicId: string;
    durationSeconds: number;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    unlockedAt: number | null;
    icon: string;
}

export interface ReadingProgress {
    screenId: string;
    scrollPosition: number;
    tabId?: string;
    timestamp: number;
}

const MILESTONES: Milestone[] = [
    { id: 'first-topic', title: 'First Steps', description: 'Completed your first topic', unlockedAt: null, icon: 'footsteps-outline' },
    { id: 'foundations-complete', title: 'Foundation Builder', description: 'Completed all 3 foundation topics', unlockedAt: null, icon: 'ribbon-outline' },
    { id: 'five-topics', title: 'Curious Mind', description: 'Completed 5 topics', unlockedAt: null, icon: 'bulb-outline' },
    { id: 'ten-topics', title: 'Dedicated Learner', description: 'Completed 10 topics', unlockedAt: null, icon: 'school-outline' },
    { id: 'all-topics', title: 'Mandala Master', description: 'Completed all topics', unlockedAt: null, icon: 'trophy-outline' },
    { id: 'streak-3', title: 'Consistency', description: '3-day check-in streak', unlockedAt: null, icon: 'flame-outline' },
    { id: 'streak-7', title: 'Weekly Warrior', description: '7-day check-in streak', unlockedAt: null, icon: 'flame' },
    { id: 'streak-30', title: 'Monthly Master', description: '30-day check-in streak', unlockedAt: null, icon: 'medal-outline' },
];

const FOUNDATION_IDS = ['what-you-really-are', 'feelings-explained', 'letting-go'];
const TOTAL_TOPICS = 20; // Total number of Essentials topics

interface UserState {
    lastCheckIn: number | null;
    checkInHistory: CheckInEntry[];
    lastAccessedLevel: string | null;
    completedTopics: string[];
    sessionHistory: SessionEntry[];
    milestones: Milestone[];
    currentStreak: number;
    longestStreak: number;
    lastStreakDate: string | null; // ISO date string YYYY-MM-DD
    pendingCelebration: Milestone | null; // Milestone to celebrate
    lastReadPosition: ReadingProgress | null; // Last reading position

    // Actions
    addCheckIn: (zone: Zone, note?: string) => void;
    canCheckIn: () => boolean;
    setLastAccessedLevel: (levelId: string) => void;
    markTopicComplete: (topicId: string) => void;
    unmarkTopicComplete: (topicId: string) => void;
    addSession: (topicId: string, durationSeconds: number) => void;
    dismissCelebration: () => void;
    saveReadingProgress: (screenId: string, scrollPosition: number, tabId?: string) => void;
    clearReadingProgress: () => void;

    // Computed getters
    getTotalMinutes: () => number;
    getCompletionPercentage: () => number;
    getFoundationsComplete: () => boolean;
    getRecentMilestones: () => Milestone[];
}

const CHECK_IN_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const isConsecutiveDay = (d1: Date, d2: Date) => {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    const hoursDiff = diff / (1000 * 60 * 60);
    return hoursDiff >= 12 && hoursDiff <= 36;
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            lastCheckIn: null,
            checkInHistory: [],
            lastAccessedLevel: null,
            completedTopics: [],
            sessionHistory: [],
            milestones: [...MILESTONES],
            currentStreak: 0,
            longestStreak: 0,
            lastStreakDate: null,
            pendingCelebration: null,
            lastReadPosition: null,

            addCheckIn: (zone, note) => {
                const now = Date.now();
                const today = new Date().toISOString().split('T')[0];
                const entry: CheckInEntry = { timestamp: now, zone, note };

                set((state) => {
                    let newStreak = state.currentStreak;

                    if (state.lastStreakDate) {
                        const lastDate = new Date(state.lastStreakDate);
                        const todayDate = new Date(today);

                        if (isSameDay(lastDate, todayDate)) {
                            // Already checked in today, don't change streak
                        } else if (isConsecutiveDay(lastDate, todayDate)) {
                            newStreak = state.currentStreak + 1;
                        } else {
                            // Streak broken
                            newStreak = 1;
                        }
                    } else {
                        newStreak = 1;
                    }

                    // Check for streak milestones
                    const updatedMilestones = [...state.milestones];
                    let newlyUnlocked: Milestone | null = null;

                    if (newStreak >= 3) {
                        const m = updatedMilestones.find(m => m.id === 'streak-3');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }
                    if (newStreak >= 7) {
                        const m = updatedMilestones.find(m => m.id === 'streak-7');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }
                    if (newStreak >= 30) {
                        const m = updatedMilestones.find(m => m.id === 'streak-30');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    return {
                        lastCheckIn: now,
                        checkInHistory: [entry, ...state.checkInHistory],
                        currentStreak: newStreak,
                        longestStreak: Math.max(state.longestStreak, newStreak),
                        lastStreakDate: today,
                        milestones: updatedMilestones,
                        pendingCelebration: newlyUnlocked,
                    };
                });
            },

            canCheckIn: () => {
                const last = get().lastCheckIn;
                if (!last) return true;
                return Date.now() - last > CHECK_IN_COOLDOWN;
            },

            setLastAccessedLevel: (levelId) => {
                set({ lastAccessedLevel: levelId });
            },

            markTopicComplete: (topicId) => {
                const now = Date.now();
                set((state) => {
                    if (state.completedTopics.includes(topicId)) {
                        return state;
                    }

                    const newCompleted = [...state.completedTopics, topicId];
                    const updatedMilestones = [...state.milestones];
                    let newlyUnlocked: Milestone | null = null;

                    // Check milestone: First topic
                    if (newCompleted.length === 1) {
                        const m = updatedMilestones.find(m => m.id === 'first-topic');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    // Check milestone: Foundations complete
                    const foundationsComplete = FOUNDATION_IDS.every(id => newCompleted.includes(id));
                    if (foundationsComplete) {
                        const m = updatedMilestones.find(m => m.id === 'foundations-complete');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    // Check milestone: 5 topics
                    if (newCompleted.length >= 5) {
                        const m = updatedMilestones.find(m => m.id === 'five-topics');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    // Check milestone: 10 topics
                    if (newCompleted.length >= 10) {
                        const m = updatedMilestones.find(m => m.id === 'ten-topics');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    // Check milestone: All topics
                    if (newCompleted.length >= TOTAL_TOPICS) {
                        const m = updatedMilestones.find(m => m.id === 'all-topics');
                        if (m && !m.unlockedAt) {
                            m.unlockedAt = now;
                            newlyUnlocked = m;
                        }
                    }

                    return {
                        completedTopics: newCompleted,
                        milestones: updatedMilestones,
                        pendingCelebration: newlyUnlocked,
                    };
                });
            },

            unmarkTopicComplete: (topicId) => {
                set((state) => ({
                    completedTopics: state.completedTopics.filter(id => id !== topicId),
                }));
            },

            addSession: (topicId, durationSeconds) => {
                const entry: SessionEntry = { timestamp: Date.now(), topicId, durationSeconds };
                set((state) => ({
                    sessionHistory: [entry, ...state.sessionHistory],
                }));
            },

            dismissCelebration: () => {
                set({ pendingCelebration: null });
            },

            saveReadingProgress: (screenId, scrollPosition, tabId) => {
                set({
                    lastReadPosition: {
                        screenId,
                        scrollPosition,
                        tabId,
                        timestamp: Date.now(),
                    },
                });
            },

            clearReadingProgress: () => {
                set({ lastReadPosition: null });
            },

            getTotalMinutes: () => {
                const sessions = get().sessionHistory;
                const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
                return Math.floor(totalSeconds / 60);
            },

            getCompletionPercentage: () => {
                const completed = get().completedTopics.length;
                return Math.round((completed / TOTAL_TOPICS) * 100);
            },

            getFoundationsComplete: () => {
                const completed = get().completedTopics;
                return FOUNDATION_IDS.every(id => completed.includes(id));
            },

            getRecentMilestones: () => {
                return get().milestones
                    .filter(m => m.unlockedAt !== null)
                    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
                    .slice(0, 3);
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
