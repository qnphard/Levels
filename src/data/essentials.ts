export interface EssentialItem {
  id: string;
  title: string;
  description: string;
  route: {
    screen: 'Chapter' | 'LearnHub' | 'WhatYouReallyAre';
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
];

