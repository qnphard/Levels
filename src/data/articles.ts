import { Article } from '../types';

export const featuredArticles: Article[] = [
  {
    id: 'article-1',
    title: 'Observe Without Fixing',
    summary:
      'Awareness dissolves resistance. This short primer guides you through the Observe step of the Letting-Go mechanism.',
    source: 'Letting Go · Chapter 2',
    readingTime: 4,
    stage: 'Notice',
    calibration: 310,
    tags: ['Letting Go', 'Observe'],
  },
  {
    id: 'article-2',
    title: 'Crossing the Courage Threshold',
    summary:
      'A practical look at why level 200 is the inflection point between force and power, with simple practices for staying above the line.',
    source: 'Healing & Recovery · Lecture 1',
    readingTime: 6,
    stage: 'Release',
    calibration: 200,
    tags: ['Map of Consciousness', 'Field Notes'],
  },
  {
    id: 'article-3',
    title: 'Rest Without Earning It',
    summary:
      'Inspired by Transcending the Levels of Consciousness, this reflection normalizes rest and silence as natural states rather than goals to achieve.',
    source: 'Transcending Levels · Section Four',
    readingTime: 5,
    stage: 'Rest',
    calibration: 520,
    tags: ['Rest', 'Stillness'],
  },
  {
    id: 'preventing-stress',
    title: 'Preventing Stress at the Source',
    summary:
      'Why fixing symptoms isn\'t enough—and how to reduce stress reactivity from within. Fear is limited in quantity and spills out into life experiences.',
    source: 'Essentials · Stress/Fear/Anxiety',
    readingTime: 7,
    stage: 'Release',
    calibration: 100, // Fear level
    tags: ['Stress', 'Fear', 'Anxiety'],
    url: 'chapter://stress', // Special URL format for chapter navigation
  },
  {
    id: 'loss-and-abandonment',
    title: 'Loss and Abandonment',
    summary:
      'Grief focuses on the past, fear on the future. All suffering is due to resistance. Grief is limited in quantity—letting go reduces spillout.',
    source: 'Essentials · Grief/Loss',
    readingTime: 6,
    stage: 'Release',
    calibration: 75, // Grief level
    tags: ['Grief', 'Loss', 'Abandonment'],
    url: 'screen://LossAndAbandonment', // Special URL format for screen navigation
  },
];
