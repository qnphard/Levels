import { Meditation, Category } from '../types';

// Meditation library - gentle practices for inner peace
export const sampleMeditations: Meditation[] = [
  // Find Peace - Calming body & mind
  {
    id: '1',
    title: 'Breath Awareness',
    description: 'Return to the simplicity of your breath',
    duration: 480, // 8 minutes
    audioUrl: '',
    category: 'Find Peace',
    isPremium: false,
    _level: 200,
    _mechanism: 'observe',
    _safety: ['grounding', 'opt-out'],
    _intendedStep: 'Anxiety→Calm',
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'Notice and soften tension throughout your body',
    duration: 600, // 10 minutes
    audioUrl: '',
    category: 'Find Peace',
    isPremium: false,
    _level: 200,
    _mechanism: 'observe',
    _safety: ['grounding', 'gentle'],
  },
  {
    id: '3',
    title: 'Safe Space',
    description: 'Rest in a place of inner safety and calm',
    duration: 540, // 9 minutes
    audioUrl: '',
    category: 'Find Peace',
    isPremium: false,
    _level: 250,
    _mechanism: 'allow',
    _safety: ['opt-out', 'gentle'],
  },

  // Let Go - Releasing tension
  {
    id: '4',
    title: 'Releasing Tension',
    description: 'Allow tightness to dissolve naturally',
    duration: 600, // 10 minutes
    audioUrl: '',
    category: 'Let Go',
    isPremium: false,
    _level: 300,
    _mechanism: 'surrender',
    _safety: ['grounding', 'opt-out'],
    _intendedStep: 'Control→Acceptance',
  },
  {
    id: '5',
    title: 'Letting Thoughts Pass',
    description: 'Watch thoughts like clouds drifting by',
    duration: 480, // 8 minutes
    audioUrl: '',
    category: 'Let Go',
    isPremium: false,
    _level: 300,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },
  {
    id: '6',
    title: 'Softening Practice',
    description: 'Gently soften around what feels hard',
    duration: 540, // 9 minutes
    audioUrl: '',
    category: 'Let Go',
    isPremium: false,
    _level: 350,
    _mechanism: 'surrender',
    _safety: ['opt-out', 'gentle'],
  },

  // Discover Joy - Opening the heart
  {
    id: '7',
    title: 'Gratitude Meditation',
    description: 'Notice what feels good in this moment',
    duration: 480, // 8 minutes
    audioUrl: '',
    category: 'Discover Joy',
    isPremium: false,
    _level: 400,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },
  {
    id: '8',
    title: 'Loving Kindness',
    description: 'Extend warmth to yourself and others',
    duration: 600, // 10 minutes
    audioUrl: '',
    category: 'Discover Joy',
    isPremium: false,
    _level: 500,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },

  // Be Present - Awakening awareness
  {
    id: '9',
    title: 'Morning Centering',
    description: 'Begin your day grounded in presence',
    duration: 480, // 8 minutes
    audioUrl: '',
    category: 'Be Present',
    isPremium: false,
    _level: 350,
    _mechanism: 'observe',
    _safety: ['grounding'],
  },
  {
    id: '10',
    title: 'Stillness Practice',
    description: 'Rest as awareness itself',
    duration: 720, // 12 minutes
    audioUrl: '',
    category: 'Be Present',
    isPremium: true,
    _level: 500,
    _mechanism: 'rest',
    _safety: ['opt-out', 'gentle'],
  },

  // Rest Deeply - Sleep & restoration
  {
    id: '11',
    title: 'Evening Wind Down',
    description: 'Release the day and prepare for rest',
    duration: 600, // 10 minutes
    audioUrl: '',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 250,
    _mechanism: 'surrender',
    _safety: ['gentle'],
  },
  {
    id: '12',
    title: 'Sleep Body Scan',
    description: 'Let your body sink into deep rest',
    duration: 900, // 15 minutes
    audioUrl: '',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 300,
    _mechanism: 'rest',
    _safety: ['gentle'],
  },
  {
    id: '13',
    title: 'Deep Sleep Journey',
    description: 'Drift into peaceful, restorative sleep',
    duration: 1200, // 20 minutes
    audioUrl: '',
    category: 'Rest Deeply',
    isPremium: true,
    _level: 350,
    _mechanism: 'rest',
    _safety: ['gentle'],
  },
];

// User-friendly category names
export const categories: Category[] = [
  'Find Peace',
  'Let Go',
  'Discover Joy',
  'Be Present',
  'Rest Deeply',
];
