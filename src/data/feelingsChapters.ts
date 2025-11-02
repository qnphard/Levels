import { FeelingChapter } from '../types';

export const feelingsChapters: FeelingChapter[] = [
  {
    id: 'suppression',
    title: 'Suppression',
    summary: 'The deliberate, conscious pushing aside of uncomfortable feelings. Learn how suppression affects behavior and health.',
    readTime: 4,
    category: 'Coping Patterns',
    glowColor: 'rose',
    relatedChapters: ['repression', 'expression', 'escape'],
    mdPath: 'suppression', // Reference to markdownContentMap key
  },
  {
    id: 'repression',
    title: 'Repression',
    summary: 'The unconscious blocking or "burying" of painful memories or feelings. Discover how repressed emotions influence us in hidden ways.',
    readTime: 4,
    category: 'Coping Patterns',
    glowColor: 'violet',
    relatedChapters: ['suppression', 'expression', 'escape'],
    mdPath: 'repression',
  },
  {
    id: 'expression',
    title: 'Expression',
    summary: 'When feelings are allowed to come out through words, body language, or action. Understand why expression alone doesn\'t fully eliminate emotional energy.',
    readTime: 5,
    category: 'Coping Patterns',
    glowColor: 'amber',
    relatedChapters: ['suppression', 'repression', 'escape'],
    mdPath: 'expression',
  },
  {
    id: 'escape',
    title: 'Escape',
    summary: 'Distracting ourselves to dodge feelings altogether. Learn how chronic escape takes a toll on your well-being.',
    readTime: 3,
    category: 'Coping Patterns',
    glowColor: 'teal',
    relatedChapters: ['suppression', 'repression', 'stress'],
    mdPath: 'escape',
  },
  {
    id: 'stress',
    title: 'Stress',
    summary: 'Stress is not caused by life itself, but by fear of the future. Discover how inner pressure and stored emotions create stress.',
    readTime: 6,
    category: 'Triggers',
    glowColor: 'sky',
    relatedChapters: ['suppression', 'repression', 'expression', 'escape'],
    mdPath: 'stress',
  },
];

export const getChapterById = (id: string): FeelingChapter | undefined => {
  return feelingsChapters.find((chapter) => chapter.id === id);
};

export const getChaptersByCategory = (
  category: FeelingChapter['category'] | 'All'
): FeelingChapter[] => {
  if (category === 'All') {
    return feelingsChapters;
  }
  return feelingsChapters.filter((chapter) => chapter.category === category);
};

