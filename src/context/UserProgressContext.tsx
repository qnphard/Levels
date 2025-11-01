import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLevelProgress } from '../types';
import { getSuggestedStartingLevel } from '../data/levels';

interface UserProgressContextType {
  progress: UserLevelProgress | null;
  setCurrentLevel: (levelId: string) => Promise<void>;
  markLevelExplored: (levelId: string) => Promise<void>;
  markPracticeCompleted: (practiceId: string, levelId: string) => Promise<void>;
  markCourageEngaged: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(
  undefined
);

const STORAGE_KEY = '@meditation_app:user_progress';

// Default progress for new users - suggests Courage (200) as starting point
const getDefaultProgress = (): UserLevelProgress => ({
  userId: 'default-user', // In production, this would be from auth
  currentLevel: getSuggestedStartingLevel().id,
  exploredLevels: [],
  completedPractices: [],
  journeyPath: [],
});

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const renderChildrenSafely = React.useCallback(
    (node: React.ReactNode) =>
      React.Children.map(node, (child, index) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return <Text key={`progress-child-${index}`}>{child}</Text>;
        }
        return child;
      }),
    []
  );
  const [progress, setProgress] = useState<UserLevelProgress | null>(null);

  // Load progress from storage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (parsed.journeyPath) {
          parsed.journeyPath = parsed.journeyPath.map((entry: any) => ({
            ...entry,
            visitedAt: new Date(entry.visitedAt),
          }));
        }
        if (parsed.firstEngagedWithCourage) {
          parsed.firstEngagedWithCourage = new Date(
            parsed.firstEngagedWithCourage
          );
        }
        setProgress(parsed);
      } else {
        // First time user - set default progress
        const defaultProgress = getDefaultProgress();
        setProgress(defaultProgress);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
      setProgress(getDefaultProgress());
    }
  };

  const saveProgress = async (updatedProgress: UserLevelProgress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  };

  const setCurrentLevel = async (levelId: string) => {
    if (!progress) return;
    const updatedProgress = {
      ...progress,
      currentLevel: levelId,
    };
    await saveProgress(updatedProgress);
  };

  const markLevelExplored = async (levelId: string) => {
    if (!progress) return;

    // Check if already explored
    if (progress.exploredLevels.includes(levelId)) {
      // Update the journey path with a new visit
      const existingEntryIndex = progress.journeyPath.findIndex(
        (entry) => entry.levelId === levelId
      );

      let updatedJourneyPath = [...progress.journeyPath];
      if (existingEntryIndex >= 0) {
        // Update existing entry's visited time
        updatedJourneyPath[existingEntryIndex] = {
          ...updatedJourneyPath[existingEntryIndex],
          visitedAt: new Date(),
        };
      }

      const updatedProgress = {
        ...progress,
        journeyPath: updatedJourneyPath,
      };
      await saveProgress(updatedProgress);
      return;
    }

    // First time exploring this level
    const updatedProgress = {
      ...progress,
      exploredLevels: [...progress.exploredLevels, levelId],
      journeyPath: [
        ...progress.journeyPath,
        {
          levelId,
          visitedAt: new Date(),
          practicesCompleted: 0,
        },
      ],
    };
    await saveProgress(updatedProgress);
  };

  const markPracticeCompleted = async (practiceId: string, levelId: string) => {
    if (!progress) return;

    // Add to completed practices if not already there
    const completedPractices = progress.completedPractices.includes(practiceId)
      ? progress.completedPractices
      : [...progress.completedPractices, practiceId];

    // Update the journey path for this level
    const journeyPath = progress.journeyPath.map((entry) => {
      if (entry.levelId === levelId) {
        return {
          ...entry,
          practicesCompleted: entry.practicesCompleted + 1,
        };
      }
      return entry;
    });

    const updatedProgress = {
      ...progress,
      completedPractices,
      journeyPath,
    };
    await saveProgress(updatedProgress);
  };

  const markCourageEngaged = async () => {
    if (!progress) return;
    if (progress.firstEngagedWithCourage) return; // Already marked

    const updatedProgress = {
      ...progress,
      firstEngagedWithCourage: new Date(),
    };
    await saveProgress(updatedProgress);
  };

  const resetProgress = async () => {
    const defaultProgress = getDefaultProgress();
    await saveProgress(defaultProgress);
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        setCurrentLevel,
        markLevelExplored,
        markPracticeCompleted,
        markCourageEngaged,
        resetProgress,
      }}
    >
      {renderChildrenSafely(children)}
    </UserProgressContext.Provider>
  );
};

// Custom hook to use the progress context
export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within UserProgressProvider');
  }
  return context;
};
