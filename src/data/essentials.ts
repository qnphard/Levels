export interface EssentialItem {
  id: string;
  title: string;
  description: string;
  route: {
    screen: 'Chapter' | 'LearnHub' | 'WhatYouReallyAre' | 'Tension' | 'Mantras' | 'NaturalHappiness' | 'PowerVsForce' | 'LevelsOfTruth' | 'Intention' | 'MusicAsTool' | 'FatigueVsEnergy' | 'FulfillmentVsSatisfaction' | 'PositiveReprogramming' | 'Effort' | 'ShadowWork' | 'NonReactivity' | 'Relaxing' | 'Knowledge' | 'Addiction' | 'CommonTraps' | 'LossAndAbandonment';
    params?: { chapterId?: string; tab?: string };
  };
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  /** Marks the 3 foundational items that new users should start with */
  isFoundation?: boolean;
  /** IDs of related sections for "Related Next" navigation */
  related?: string[];
  /** Summary bullet points for the preview sheet */
  takeaways?: string[];
}

// Helper to get foundation items
export const getFoundationItems = () => essentialItems.filter(item => item.isFoundation);

// Helper to get an item by ID
export const getEssentialById = (id: string) => essentialItems.find(item => item.id === id);

export const essentialItems: EssentialItem[] = [
  {
    id: 'what-you-really-are',
    title: 'What You Really Are',
    description: 'A simple explanation of body, mind, consciousness, and awareness.',
    route: {
      screen: 'WhatYouReallyAre',
    },
    icon: 'person-outline',
    isFoundation: true,
    related: ['natural-happiness', 'feelings-explained', 'letting-go'],
    takeaways: [
      'The difference between your Body, Mind, and Awareness',
      'Why you are not your thoughts or feelings',
      'How to rest in the "Space" behind the experience',
    ],
  },
  {
    id: 'feelings-explained',
    title: 'Feelings Explained',
    description: 'Understand what a feeling actually is and how to work with it.',
    route: {
      screen: 'LearnHub',
      params: {},
    },
    icon: 'heart-outline',
    isFoundation: true,
    related: ['letting-go', 'tension', 'preventing-stress'],
    takeaways: [
      'Why emotions feel "heavy" or "stuck"',
      'The relationship between resistance and pain',
      'The 3-layer model of an emotional wave',
    ],
  },
  {
    id: 'letting-go',
    title: 'Letting Go Basics',
    description: 'A simple way to let emotions move instead of getting stuck.',
    route: {
      screen: 'Chapter',
      params: { chapterId: 'letting-go' },
    },
    icon: 'leaf-outline',
    isFoundation: true,
    related: ['feelings-explained', 'relaxing', 'non-reactivity'],
    takeaways: [
      'The core technique of surrender',
      'How to stop fighting your own energy',
      'Signs that an emotion is beginning to shift',
    ],
  },
  {
    id: 'preventing-stress',
    title: 'Preventing Stress at the Source',
    description: 'Why fixing symptoms isn\'t enough—and how to reduce stress reactivity from within.',
    route: {
      screen: 'Chapter',
      params: { chapterId: 'stress' },
    },
    icon: 'shield-outline',
    related: ['tension', 'letting-go', 'fatigue-vs-energy'],
  },
  {
    id: 'natural-happiness',
    title: 'Natural Happiness',
    description: 'We are naturally happy and free. The emotional blocks are temporary clouds.',
    route: {
      screen: 'NaturalHappiness',
    },
    icon: 'sunny-outline',
    related: ['what-you-really-are', 'fulfillment-vs-satisfaction', 'addiction'],
  },
  {
    id: 'power-vs-force',
    title: 'Power vs Force',
    description: 'Understanding the difference between pushing against resistance and flowing with life.',
    route: {
      screen: 'PowerVsForce',
    },
    icon: 'flash-outline',
    related: ['effort', 'non-reactivity', 'intention'],
  },
  {
    id: 'levels-of-truth',
    title: 'Levels of Truth',
    description: 'Truth is subjective and context-dependent. Different paths aren\'t necessarily wrong.',
    route: {
      screen: 'LevelsOfTruth',
    },
    icon: 'document-text-outline',
    related: ['intention', 'knowledge', 'what-you-really-are'],
  },
  {
    id: 'intention',
    title: 'Intention',
    description: 'Intention is karma. Why we do things matters more than the action itself.',
    route: {
      screen: 'Intention',
    },
    icon: 'compass-outline',
    related: ['music-as-tool', 'power-vs-force', 'effort'],
  },
  {
    id: 'music-as-tool',
    title: 'Music as a Tool',
    description: 'Music can be measured by consciousness level. Energy quality affects us deeply.',
    route: {
      screen: 'MusicAsTool',
    },
    icon: 'musical-notes-outline',
    related: ['intention', 'relaxing', 'fatigue-vs-energy'],
  },
  {
    id: 'fatigue-vs-energy',
    title: 'Fatigue vs Energy',
    description: 'We leak energy through emotional blocks. Releasing them restores natural vitality.',
    route: {
      screen: 'FatigueVsEnergy',
    },
    icon: 'battery-charging-outline',
    related: ['tension', 'relaxing', 'preventing-stress'],
  },
  {
    id: 'fulfillment-vs-satisfaction',
    title: 'Fulfillment vs Satisfaction',
    description: 'Desire never satisfied (black hole). Happiness comes from within by releasing blocks.',
    route: {
      screen: 'FulfillmentVsSatisfaction',
    },
    icon: 'happy-outline',
    related: ['natural-happiness', 'addiction', 'letting-go'],
  },
  {
    id: 'positive-reprogramming',
    title: 'Positive Re-programming',
    description: 'Letting go of old beliefs and replacing them with better ones through affirmations.',
    route: {
      screen: 'PositiveReprogramming',
    },
    icon: 'refresh-outline',
    related: ['mantras', 'shadow-work', 'letting-go'],
  },
  {
    id: 'effort',
    title: 'Effort',
    description: 'Human effort is necessary only to learn it\'s useless. God\'s will alone is real power.',
    route: {
      screen: 'Effort',
    },
    icon: 'hand-right-outline',
    related: ['power-vs-force', 'letting-go', 'intention'],
  },
  {
    id: 'shadow-work',
    title: 'Shadow Work',
    description: 'Accepting your humanness and healing through compassion for the animal part.',
    route: {
      screen: 'ShadowWork',
    },
    icon: 'moon-outline',
    related: ['feelings-explained', 'letting-go', 'positive-reprogramming'],
  },
  {
    id: 'non-reactivity',
    title: 'Non Reactivity',
    description: 'Letting go of wanting to express anger makes us non-reactive, acting from power.',
    route: {
      screen: 'NonReactivity',
    },
    icon: 'pause-circle-outline',
    related: ['letting-go', 'power-vs-force', 'relaxing'],
  },
  {
    id: 'relaxing',
    title: 'Relaxing',
    description: 'Body and mind naturally relax as you let go. Treat tension at all levels.',
    route: {
      screen: 'Relaxing',
    },
    icon: 'bed-outline',
    related: ['tension', 'letting-go', 'fatigue-vs-energy'],
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Knowledge is only good if you apply it. Practice makes the difference.',
    route: {
      screen: 'Knowledge',
    },
    icon: 'book-outline',
    related: ['letting-go', 'levels-of-truth', 'effort'],
  },
  {
    id: 'addiction',
    title: 'Addiction',
    description: 'Understanding natural happiness allows freedom without drugs, gambling, or escaping.',
    route: {
      screen: 'Addiction',
    },
    icon: 'warning-outline',
    related: ['natural-happiness', 'fulfillment-vs-satisfaction', 'letting-go'],
  },
  {
    id: 'tension',
    title: 'Tension',
    description: 'Understanding the pressure beneath stress, pain, and restlessness.',
    route: {
      screen: 'Tension',
    },
    icon: 'fitness-outline',
    related: ['relaxing', 'preventing-stress', 'feelings-explained'],
  },
  {
    id: 'mantras',
    title: 'Mantras',
    description: 'Simple phrases that calm the mind and open the heart.',
    route: {
      screen: 'Mantras',
    },
    icon: 'chatbubbles-outline',
    related: ['positive-reprogramming', 'relaxing', 'letting-go'],
  },
  {
    id: 'common-traps',
    title: 'Common Traps',
    description: 'Subtle diversions and pitfalls on the path of awareness.',
    route: {
      screen: 'CommonTraps',
    },
    icon: 'sync-outline',
    related: ['knowledge', 'letting-go', 'shadow-work'],
  },
  {
    id: 'loss-and-abandonment',
    title: 'Loss & Abandonment',
    description: 'Understanding the finite nature of grief and the source of happiness.',
    route: {
      screen: 'LossAndAbandonment',
    },
    icon: 'heart-dislike-outline',
    related: ['feelings-explained', 'letting-go', 'natural-happiness'],
  },
];
