import { Meditation, Category } from '../types';

// Meditation library - gentle practices for inner peace
export const sampleMeditations: Meditation[] = [
  // Find Peace - Calming body & mind
  {
    id: '1',
    title: 'Breath Awareness',
    description: 'A gentle practice that uses natural breathing to steady attention. When the mind wanders, you simply return to noticing the breath, again and again.',
    duration: 496, // 08:16
    audioUrl: 'breath_awareness',
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
    description: 'A guided movement of attention through the body, noticing sensations as they are. There’s no need to relax or change anything — just to notice.',
    duration: 446, // 07:26
    audioUrl: 'body_scan',
    category: 'Find Peace',
    isPremium: false,
    _level: 200,
    _mechanism: 'observe',
    _safety: ['grounding', 'gentle'],
  },
  {
    id: '3',
    title: 'Safe Space',
    description: 'A light, optional visualization that introduces a sense of steadiness and safety. The imagery is simple and flexible, with no need to picture anything clearly.',
    duration: 355, // 05:55
    audioUrl: 'safe_space',
    category: 'Find Peace',
    isPremium: false,
    _level: 250,
    _mechanism: 'allow',
    _safety: ['opt-out', 'gentle'],
  },
  {
    id: '17',
    title: 'Reset After Overwhelm',
    description: 'A short, practical reset for moments of stress, anxiety, or sensory overload. Rather than going inward, this practice re-orients you to your surroundings and body.',
    duration: 347, // 05:47
    audioUrl: 'reset_after_overwhelm',
    category: 'Find Peace',
    isPremium: false,
    _level: 200,
    _mechanism: 'observe',
    _safety: ['grounding', 'opt-out'],
  },

  // Let Go - Releasing tension
  {
    id: '4',
    title: 'Releasing Tension',
    description: 'A practice focused on noticing effort and allowing it to pause. Instead of trying to relax, you let sensations and emotions be exactly as they are.',
    duration: 504, // 08:24
    audioUrl: 'releasing_tension',
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
    description: 'A gentle way of relating to thoughts without following or stopping them. You notice thinking as something that happens, not something you need to manage.',
    duration: 370, // 06:10
    audioUrl: 'letting_thoughts_pass',
    category: 'Let Go',
    isPremium: false,
    _level: 300,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },
  {
    id: '6',
    title: 'Softening Practice',
    description: 'An exploration of resistance, tightness, or inner hardness. Rather than trying to soften, you notice where effort is being added — and allow it to stop.',
    duration: 389, // 06:29
    audioUrl: 'softening_practice',
    category: 'Let Go',
    isPremium: false,
    _level: 350,
    _mechanism: 'surrender',
    _safety: ['opt-out', 'gentle'],
  },
  {
    id: '15',
    title: 'Meeting Resistance',
    description: 'A practice for times when letting go feels difficult or impossible. Instead of pushing past resistance, you meet it directly and allow it to be present.',
    duration: 382, // 06:22
    audioUrl: 'meeting_resistance',
    category: 'Let Go',
    isPremium: false,
    _level: 250,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },
  {
    id: '20',
    title: 'Staying With Discomfort',
    description: 'A gentle practice that builds tolerance for uncomfortable sensations or emotions. Rather than focusing narrowly on discomfort, you allow it to exist within a wider field of experience.',
    duration: 400, // 06:40
    audioUrl: 'staying_with_discomfort',
    category: 'Let Go',
    isPremium: true,
    _level: 350,
    _mechanism: 'allow',
    _safety: ['opt-out'],
  },

  // Discover Joy - Opening the heart
  {
    id: '7',
    title: 'Gratitude Meditation',
    description: 'A subtle shift toward noticing what is neutral, steady, or okay in the moment. This is not about forcing positivity or feeling grateful.',
    duration: 436, // 07:16
    audioUrl: 'gratitude_meditation',
    category: 'Discover Joy',
    isPremium: false,
    _level: 400,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },
  {
    id: '8',
    title: 'Loving Kindness',
    description: 'An introduction to goodwill without emotional pressure. Rather than trying to feel love, you allow a simple orientation of non-harm and friendliness.',
    duration: 410, // 06:50
    audioUrl: 'loving_kindness',
    category: 'Discover Joy',
    isPremium: false,
    _level: 500,
    _mechanism: 'allow',
    _safety: ['gentle'],
  },

  // Be Present - Awakening awareness
  {
    id: '10',
    title: 'Stillness Practice',
    description: 'A minimal practice focused on awareness itself rather than any object. Nothing needs to be focused on, changed, or improved.',
    duration: 339, // 05:39
    audioUrl: 'stillness_practice',
    category: 'Be Present',
    isPremium: true,
    _level: 500,
    _mechanism: 'rest',
    _safety: ['opt-out', 'gentle'],
  },
  {
    id: '9',
    title: 'Morning Centering',
    description: 'A brief pause at the start of the day, before activity begins. There’s no intention-setting or motivation — just noticing that you are here.',
    duration: 304, // 05:04
    audioUrl: 'morning_centering',
    category: 'Be Present',
    isPremium: false,
    _level: 350,
    _mechanism: 'observe',
    _safety: ['grounding'],
  },
  {
    id: '14',
    title: 'Between Tasks',
    description: 'A short transition practice for moving from one activity to another. It helps clear mental residue before starting something new.',
    duration: 248, // 04:08
    audioUrl: 'between_tasks',
    category: 'Be Present',
    isPremium: false,
    _level: 300,
    _mechanism: 'observe',
    _safety: ['grounding'],
  },
  {
    id: '19',
    title: 'Returning to Daily Life',
    description: 'A gentle transition out of meditation and back into activity. Rather than “holding onto” a state, you allow movement and intention to return naturally.',
    duration: 204, // 03:24
    audioUrl: 'returning_to_daily_life',
    category: 'Be Present',
    isPremium: false,
    _level: 350,
    _mechanism: 'observe',
    _safety: ['grounding'],
  },

  // Rest Deeply - Sleep & restoration
  {
    id: '13',
    title: 'Deep Rest',
    description: 'A long, gentle practice designed to support falling asleep. It’s safe to drift, forget, or fall asleep at any point.',
    duration: 379, // 06:19
    audioUrl: 'deep_rest',
    category: 'Rest Deeply',
    isPremium: true,
    _level: 350,
    _mechanism: 'rest',
    _safety: ['gentle'],
  },
  {
    id: '11',
    title: 'Evening Wind Down',
    description: 'A practice for the end of the day that allows engagement to slowly stand down. There’s no reflection on the day and no effort to sleep.',
    duration: 344, // 05:44
    audioUrl: 'evening_wind_down',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 250,
    _mechanism: 'surrender',
    _safety: ['gentle'],
  },
  {
    id: '12',
    title: 'Sleep Body Scan',
    description: 'A slow, non-directive body scan designed for nighttime use. Attention is guided gently, without requiring completion or focus.',
    duration: 360, // 06:00
    audioUrl: 'sleep_body_scan',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 300,
    _mechanism: 'rest',
    _safety: ['gentle'],
  },
  {
    id: '16',
    title: 'Middle of the Night',
    description: 'A supportive practice for waking up during the night. There’s no pressure to fall back asleep and no focus on time.',
    duration: 263, // 04:23
    audioUrl: 'middle_of_the_night',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 200,
    _mechanism: 'surrender',
    _safety: ['grounding', 'gentle'],
  },
  {
    id: '18',
    title: 'Rest Without Sleep',
    description: 'A deep rest practice for times when sleep isn’t possible. You remain awake while allowing the body and nervous system to recover.',
    duration: 272, // 04:32
    audioUrl: 'rest_without_sleep',
    category: 'Rest Deeply',
    isPremium: false,
    _level: 300,
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
