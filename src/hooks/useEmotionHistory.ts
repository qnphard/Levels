import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EmotionHistoryItem {
  emotion: string;
  levelId: string;
  timestamp: number;
}

const STORAGE_KEY = '@emotion_history';
const MAX_HISTORY = 3;

/**
 * Hook for tracking recently felt emotions
 */
export function useEmotionHistory() {
  const [history, setHistory] = useState<EmotionHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as EmotionHistoryItem[];
        // Sort by timestamp (newest first) and limit
        const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_HISTORY);
        setHistory(sorted);
      }
    } catch (error) {
      console.error('Error loading emotion history:', error);
    }
  };

  const addToHistory = async (emotion: string, levelId: string) => {
    try {
      const newItem: EmotionHistoryItem = {
        emotion,
        levelId,
        timestamp: Date.now(),
      };
      
      // Load existing history
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let existing: EmotionHistoryItem[] = [];
      if (stored) {
        existing = JSON.parse(stored) as EmotionHistoryItem[];
      }
      
      // Remove duplicates of the same emotion/level combination
      const filtered = existing.filter(
        (item) => !(item.emotion === emotion && item.levelId === levelId)
      );
      
      // Add new item at the beginning
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error('Error saving emotion history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Error clearing emotion history:', error);
    }
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
}

