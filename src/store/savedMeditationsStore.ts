import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MeditationPurpose, MeditationStyle, MeditationDuration } from '../services/geminiService';

export type SavedMeditation = {
  id: string;
  createdAt: number;
  // generation params
  purpose: MeditationPurpose;
  duration: MeditationDuration;
  style: MeditationStyle;
  voiceId: string;
  speed: number;
  brainwave: string;
  binauralVolume: number;
  ambient: string;
  ambientVolume: number;
  userGoal?: string;
  // content
  scriptText: string;
  audioUris: string[]; // local cached URIs from voiceTTSService
};

type AddMeditationInput = Omit<SavedMeditation, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: number;
};

type SavedMeditationsState = {
  meditations: SavedMeditation[];
  addMeditation: (m: AddMeditationInput) => SavedMeditation;
  removeMeditation: (id: string) => void;
  clearAll: () => void;
};

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export const useSavedMeditationsStore = create<SavedMeditationsState>()(
  persist(
    (set, get) => ({
      meditations: [],
      addMeditation: (m) => {
        const saved: SavedMeditation = {
          id: m.id ?? makeId(),
          createdAt: m.createdAt ?? Date.now(),
          purpose: m.purpose,
          duration: m.duration,
          style: m.style,
          voiceId: (m as any).voiceId ?? 'Joanna',
          speed: m.speed,
          brainwave: m.brainwave,
          binauralVolume: m.binauralVolume,
          ambient: m.ambient,
          ambientVolume: m.ambientVolume,
          userGoal: m.userGoal,
          scriptText: m.scriptText,
          audioUris: m.audioUris,
        };

        // newest first
        set({ meditations: [saved, ...get().meditations] });
        return saved;
      },
      removeMeditation: (id) => set({ meditations: get().meditations.filter((m) => m.id !== id) }),
      clearAll: () => set({ meditations: [] }),
    }),
    {
      name: 'levels.savedMeditations.v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

