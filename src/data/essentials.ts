export interface EssentialItem {
  id: string;
  title: string;
  description: string;
  route: {
    screen: 'Chapter' | 'LearnHub' | 'WhatYouReallyAre' | 'Tension' | 'Mantras' | 'NaturalHappiness' | 'PowerVsForce' | 'LevelsOfTruth' | 'Intention' | 'MusicAsTool' | 'FatigueVsEnergy' | 'FulfillmentVsSatisfaction' | 'PositiveReprogramming' | 'Effort' | 'ShadowWork' | 'NonReactivity' | 'Relaxing' | 'Knowledge' | 'Addiction';
    params?: { chapterId?: string; tab?: string };
  };
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

export const essentialItems: EssentialItem[] = [
  {
    id: 'what-you-really-are',
    title: 'What You Really Are',
    description: 'A simple explanation of body, mind, consciousness, and awareness.',
    route: {
      screen: 'WhatYouReallyAre',
    },
    icon: 'person-outline',
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
  },
  {
    id: 'natural-happiness',
    title: 'Natural Happiness',
    description: 'We are naturally happy and free. The emotional blocks are temporary clouds.',
    route: {
      screen: 'NaturalHappiness',
    },
    icon: 'sunny-outline',
  },
  {
    id: 'power-vs-force',
    title: 'Power vs Force',
    description: 'Understanding the difference between pushing against resistance and flowing with life.',
    route: {
      screen: 'PowerVsForce',
    },
    icon: 'flash-outline',
  },
  {
    id: 'levels-of-truth',
    title: 'Levels of Truth',
    description: 'Truth is subjective and context-dependent. Different paths aren\'t necessarily wrong.',
    route: {
      screen: 'LevelsOfTruth',
    },
    icon: 'document-text-outline',
  },
  {
    id: 'intention',
    title: 'Intention',
    description: 'Intention is karma. Why we do things matters more than the action itself.',
    route: {
      screen: 'Intention',
    },
    icon: 'compass-outline',
  },
  {
    id: 'music-as-tool',
    title: 'Music as a Tool',
    description: 'Music can be measured by consciousness level. Energy quality affects us deeply.',
    route: {
      screen: 'MusicAsTool',
    },
    icon: 'musical-notes-outline',
  },
  {
    id: 'fatigue-vs-energy',
    title: 'Fatigue vs Energy',
    description: 'We leak energy through emotional blocks. Releasing them restores natural vitality.',
    route: {
      screen: 'FatigueVsEnergy',
    },
    icon: 'battery-charging-outline',
  },
  {
    id: 'fulfillment-vs-satisfaction',
    title: 'Fulfillment vs Satisfaction',
    description: 'Desire never satisfied (black hole). Happiness comes from within by releasing blocks.',
    route: {
      screen: 'FulfillmentVsSatisfaction',
    },
    icon: 'happy-outline',
  },
  {
    id: 'positive-reprogramming',
    title: 'Positive Re-programming',
    description: 'Letting go of old beliefs and replacing them with better ones through affirmations.',
    route: {
      screen: 'PositiveReprogramming',
    },
    icon: 'refresh-outline',
  },
  {
    id: 'effort',
    title: 'Effort',
    description: 'Human effort is necessary only to learn it\'s useless. God\'s will alone is real power.',
    route: {
      screen: 'Effort',
    },
    icon: 'hand-right-outline',
  },
  {
    id: 'shadow-work',
    title: 'Shadow Work',
    description: 'Accepting your humanness and healing through compassion for the animal part.',
    route: {
      screen: 'ShadowWork',
    },
    icon: 'moon-outline',
  },
  {
    id: 'non-reactivity',
    title: 'Non Reactivity',
    description: 'Letting go of wanting to express anger makes us non-reactive, acting from power.',
    route: {
      screen: 'NonReactivity',
    },
    icon: 'pause-circle-outline',
  },
  {
    id: 'relaxing',
    title: 'Relaxing',
    description: 'Body and mind naturally relax as you let go. Treat tension at all levels.',
    route: {
      screen: 'Relaxing',
    },
    icon: 'bed-outline',
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Knowledge is only good if you apply it. Practice makes the difference.',
    route: {
      screen: 'Knowledge',
    },
    icon: 'book-outline',
  },
  {
    id: 'addiction',
    title: 'Addiction',
    description: 'Understanding natural happiness allows freedom without drugs, gambling, or escaping.',
    route: {
      screen: 'Addiction',
    },
    icon: 'warning-outline',
  },
  {
    id: 'tension',
    title: 'Tension',
    description: 'Understanding the pressure beneath stress, pain, and restlessness.',
    route: {
      screen: 'Tension',
    },
    icon: 'fitness-outline',
  },
  {
    id: 'mantras',
    title: 'Mantras',
    description: 'Simple phrases that calm the mind and open the heart.',
    route: {
      screen: 'Mantras',
    },
    icon: 'chatbubbles-outline',
  },
];

