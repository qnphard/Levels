// Core types for the meditation app

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  audioUrl: string; // local or remote URL
  category: Category;
  isPremium: boolean;
  thumbnailUrl?: string;
  instructor?: string;

  // Internal metadata (never displayed to users)
  _level?: number; // 200-600 consciousness range
  _mechanism?: 'observe' | 'allow' | 'surrender' | 'rest';
  _safety?: string[]; // ["grounding", "opt-out", "gentle"]
  _intendedStep?: string; // e.g., "Anxiety→Peace"
  _verified?: boolean; // Passed integrity check
}

export type PracticeStage = 'Settle' | 'Notice' | 'Release' | 'Rest';

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string; // e.g., Letting Go, Healing & Recovery
  readingTime: number; // minutes
  url?: string;
  tags?: string[];
  stage: PracticeStage;
  calibration?: number; // optional calibration reference
}

// User-friendly category names (no jargon)
export type Category =
  | 'Find Peace'
  | 'Let Go'
  | 'Discover Joy'
  | 'Be Present'
  | 'Rest Deeply';

// Emotional check-in options
export type Emotion =
  | 'Anxious/Stressed'
  | 'Tired'
  | 'Depressed/Sad'
  | 'Angry'
  | 'Restless'
  | 'Neutral'
  | 'Motivated'
  | 'Happy'
  | 'Peaceful';

export interface UserProgress {
  meditationId: string;
  completedAt: Date;
  duration: number;
  reflection?: string; // Optional journal entry
}

export interface UserProfile {
  id: string;
  name?: string;
  isPremium: boolean;
  momentsOfPeace: number; // Qualitative, not streak
  totalMinutes: number;
  recentEmotion?: Emotion;
  favorites: string[]; // meditation IDs
}

// Consciousness Level - Map of Consciousness levels
export interface ConsciousnessLevel {
  id: string;
  level: number; // calibration (20, 30, 50, etc.)
  name: string; // "Shame", "Guilt", "Fear", etc.
  antithesis: string; // Healing counterpart: "Self-Compassion", "Forgiveness", etc.
  category: 'healing' | 'empowerment' | 'spiritual' | 'enlightenment';
  description: string; // What this level feels like
  characteristics: string[]; // Common experiences at this level
  physicalSigns: string[]; // Bodily sensations
  trapDescription: string; // What keeps people stuck here
  wayThrough: string; // How transformation happens
  meditations: string[]; // Meditation IDs (placeholders for now)
  estimatedTime: number; // Suggested minutes of practice
  color: string; // Visual theme color
  gradient?: readonly [string, string]; // Optional gradient pair for UI treatments
  gradientDark?: readonly [string, string];
  glowDark?: string;
  isThreshold?: boolean; // True for level 200 (Courage)
}

// User's journey through consciousness levels
export interface UserLevelProgress {
  userId: string;
  currentLevel?: string; // Suggested focus level (optional - user can change)
  exploredLevels: string[]; // Any levels the user has visited
  completedPractices: string[]; // Practice IDs completed
  journeyPath: {
    levelId: string;
    visitedAt: Date;
    practicesCompleted: number;
  }[];
  firstEngagedWithCourage?: Date; // When user first engaged with level 200
  // NO unlockedLevels - all levels accessible from start
}

// Feelings Explained - Learning chapters
export type FeelingChapterCategory = 'Coping Patterns' | 'Triggers' | 'Body' | 'Mind';

export interface FeelingChapter {
  id: string;
  title: string;
  summary: string;
  readTime: number; // reading time in minutes (3-6)
  category: FeelingChapterCategory;
  glowColor: 'rose' | 'violet' | 'amber' | 'teal' | 'sky';
  relatedChapters: string[]; // IDs of related chapters
  mdPath: string; // path to markdown file in assets
}

export interface ChapterProgress {
  chapterId: string;
  lastSection?: string; // H2/H3 anchor name
  readProgress: number; // 0-1, percentage read
  lastReadAt: Date;
}