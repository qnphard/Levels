import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChapterProgress } from '../types';

const PROGRESS_STORAGE_KEY = '@feelings_chapters_progress';

interface ProgressMap {
  [chapterId: string]: ChapterProgress;
}

export function useChapterProgress() {
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from storage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert lastReadAt strings back to Date objects
          const converted: ProgressMap = {};
          Object.keys(parsed).forEach((key) => {
            converted[key] = {
              ...parsed[key],
              lastReadAt: parsed[key].lastReadAt
                ? new Date(parsed[key].lastReadAt)
                : new Date(),
            };
          });
          setProgressMap(converted);
        }
      } catch (error) {
        console.error('Error loading chapter progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Update progress for a chapter
  const updateProgress = useCallback(
    async (
      chapterId: string,
      updates: {
        readProgress?: number;
        lastSection?: string;
      }
    ) => {
      const existing = progressMap[chapterId] || {
        chapterId,
        readProgress: 0,
        lastReadAt: new Date(),
      };

      const updated: ChapterProgress = {
        ...existing,
        ...updates,
        lastReadAt: new Date(),
      };

      const newMap = { ...progressMap, [chapterId]: updated };
      setProgressMap(newMap);

      try {
        await AsyncStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(newMap)
        );
      } catch (error) {
        console.error('Error saving chapter progress:', error);
      }
    },
    [progressMap]
  );

  // Get progress for a specific chapter
  const getProgress = useCallback(
    (chapterId: string): ChapterProgress | undefined => {
      return progressMap[chapterId];
    },
    [progressMap]
  );

  // Reset progress for a chapter (optional utility)
  const resetProgress = useCallback(
    async (chapterId: string) => {
      const newMap = { ...progressMap };
      delete newMap[chapterId];
      setProgressMap(newMap);

      try {
        await AsyncStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(newMap)
        );
      } catch (error) {
        console.error('Error resetting chapter progress:', error);
      }
    },
    [progressMap]
  );

  return {
    progressMap,
    isLoading,
    updateProgress,
    getProgress,
    resetProgress,
  };
}





