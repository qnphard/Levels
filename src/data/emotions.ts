/**
 * Emotion vocabulary and clusters for the emotion picker
 * Maps real-life emotion synonyms to consciousness levels
 */

export interface EmotionItem {
  label: string;
  synonyms: string[];
  microHint?: string;
}

export interface EmotionCluster {
  id: string;
  label: string;
  primaryLevelId: string;
  secondaryLevelIds: string[];
  relatedChapterIds: string[];
  emotions: EmotionItem[];
  color: 'rose' | 'violet' | 'amber' | 'teal' | 'sky' | 'garnet' | 'plum' | 'indigo' | 'slate';
}

export const emotionClusters: EmotionCluster[] = [
  // Most Common cluster - primary emotions people identify with
  {
    id: 'most-common',
    label: 'Most common',
    primaryLevelId: 'shame',
    secondaryLevelIds: ['guilt'],
    relatedChapterIds: [],
    emotions: [
      {
        label: 'Shame',
        synonyms: ['ashamed', 'embarrassed', 'humiliated', 'mortified', 'worthless', 'not good enough', 'inadequate', 'unlovable', 'disgusting', 'exposed', 'defective', 'flawed'],
        microHint: 'Shame = bad about me. Guilt = bad about what I did.',
      },
      {
        label: 'Guilt',
        synonyms: ['guilty', 'remorse', 'regret', 'ashamed of what I did', 'beat myself up', "I shouldn't have…", 'my fault', 'over-apologizing', 'atone'],
        microHint: 'Shame = bad about me. Guilt = bad about what I did.',
      },
      {
        label: 'Fear',
        synonyms: ['anxious', 'worried', 'stressed', 'overwhelmed', 'dread', 'panic', 'nervous', 'jittery', 'on edge', 'tense', 'scared', 'catastrophizing', "can't relax", 'imposter syndrome', 'fear of failure', 'fear of rejection', 'fear of uncertainty'],
        microHint: 'Stress is fear of the future—workable.',
      },
      {
        label: 'Anger',
        synonyms: ['pissed', 'mad', 'annoyed', 'irritated', 'frustrated', 'fed up', 'offended', 'disrespected', 'resentful', 'bitter', 'outraged', 'livid', 'snappy', 'triggered', 'vengeful', 'road-rage'],
        microHint: '',
      },
      {
        label: 'Desire',
        synonyms: ['crave', 'lust', 'tempted', 'urge', "can't stop thinking", 'need it', 'FOMO', 'obsessed', 'fixated', 'jealous', 'envy', 'possessive', 'needy', 'clingy', 'attention-seeking', 'binge', 'impulse buying', 'sugar hit', 'caffeine fix', 'nicotine hit', 'thirsty'],
        microHint: '',
      },
      {
        label: 'Grief',
        synonyms: ['heartbroken', 'devastated', 'heavy-hearted', 'missing you', 'lonely', 'homesick', 'bereft', 'sorrow', 'blue', 'tearful', 'disappointed', 'let down'],
        microHint: '',
      },
      {
        label: 'Apathy',
        synonyms: ['numb', 'blah', 'meh', 'checked out', 'drained', 'exhausted', 'burned out', 'over it', 'dead inside', 'flat', 'stuck', 'unmotivated', 'hopeless', 'why bother'],
        microHint: 'Numb isn\'t failure; it\'s a tired nervous system.',
      },
      {
        label: 'Pride',
        synonyms: ['defensive', 'superior', 'smug', 'righteous', 'stubborn', "I'm right", "can't admit fault", 'holier-than-thou', 'judgmental'],
        microHint: '',
      },
    ],
    color: 'sky',
  },
  // Cravings cluster - all Desire-related
  {
    id: 'cravings',
    label: 'Cravings',
    primaryLevelId: 'desire',
    secondaryLevelIds: ['anger', 'fear'],
    relatedChapterIds: [],
    emotions: [
      {
        label: 'Lust',
        synonyms: ['crave', 'tempted', 'urge', 'obsessed', 'fixated'],
      },
      {
        label: 'Jealous',
        synonyms: ['envy', 'possessive', 'needy', 'clingy', 'FOMO'],
      },
      {
        label: 'Impulsive',
        synonyms: ['binge', 'impulse buying', 'sugar hit', 'caffeine fix', 'nicotine hit'],
      },
      {
        label: 'Clingy',
        synonyms: ['needy', 'attention-seeking', 'thirsty', "can't stop thinking", 'need it'],
      },
    ],
    color: 'amber',
  },
  // Anxious/Stress cluster - all Fear-related
  {
    id: 'anxious-stress',
    label: 'Anxious/Stress',
    primaryLevelId: 'fear',
    secondaryLevelIds: [],
    relatedChapterIds: ['stress'],
    emotions: [
      {
        label: 'Anxious',
        synonyms: ['worried', 'nervous', 'jittery', 'on edge', 'tense', 'scared'],
      },
      {
        label: 'Stressed',
        synonyms: ['overwhelmed', 'panic', 'catastrophizing', "can't relax", 'imposter syndrome'],
      },
      {
        label: 'Dread',
        synonyms: ['fear of failure', 'fear of rejection', 'fear of uncertainty'],
      },
    ],
    color: 'sky',
  },
  // Anger/Frustration cluster
  {
    id: 'anger-frustration',
    label: 'Anger/Frustration',
    primaryLevelId: 'anger',
    secondaryLevelIds: ['desire'],
    relatedChapterIds: ['expression'],
    emotions: [
      {
        label: 'Frustrated',
        synonyms: ['pissed', 'mad', 'annoyed', 'irritated', 'fed up', 'snappy'],
      },
      {
        label: 'Resentful',
        synonyms: ['offended', 'disrespected', 'bitter', 'outraged', 'livid', 'triggered'],
      },
      {
        label: 'Vengeful',
        synonyms: ['vengeful', 'road-rage'],
      },
    ],
    color: 'rose',
  },
  // Low/Numb cluster - all Apathy-related
  {
    id: 'low-numb',
    label: 'Low/Numb',
    primaryLevelId: 'apathy',
    secondaryLevelIds: ['fear'],
    relatedChapterIds: [],
    emotions: [
      {
        label: 'Numb',
        synonyms: ['blah', 'meh', 'checked out', 'flat', 'dead inside'],
      },
      {
        label: 'Burned out',
        synonyms: ['drained', 'exhausted', 'over it', 'stuck', 'unmotivated', 'hopeless', 'why bother'],
      },
    ],
    color: 'slate',
  },
  // Sadness/Loss cluster - all Grief-related
  {
    id: 'sadness-loss',
    label: 'Sadness/Loss',
    primaryLevelId: 'grief',
    secondaryLevelIds: [],
    relatedChapterIds: [],
    emotions: [
      {
        label: 'Heartbroken',
        synonyms: ['devastated', 'heavy-hearted', 'bereft', 'sorrow', 'blue', 'tearful'],
      },
      {
        label: 'Lonely',
        synonyms: ['missing you', 'homesick', 'disappointed', 'let down'],
      },
    ],
    color: 'indigo',
  },
  // Self-blame cluster - Shame + Guilt
  {
    id: 'self-blame',
    label: 'Self-blame',
    primaryLevelId: 'guilt',
    secondaryLevelIds: ['shame'],
    relatedChapterIds: [],
    emotions: [
      {
        label: 'Ashamed',
        synonyms: ['embarrassed', 'humiliated', 'mortified', 'worthless', 'not good enough'],
      },
      {
        label: 'Guilty',
        synonyms: ['remorse', 'regret', 'beat myself up', 'my fault', 'over-apologizing'],
      },
    ],
    color: 'garnet',
  },
];

/**
 * Get all emotion labels and synonyms for search
 */
export function getAllEmotionTerms(): Array<{ label: string; clusterId: string; levelId: string }> {
  const terms: Array<{ label: string; clusterId: string; levelId: string }> = [];
  
  emotionClusters.forEach((cluster) => {
    cluster.emotions.forEach((emotion) => {
      // Add primary label
      terms.push({
        label: emotion.label,
        clusterId: cluster.id,
        levelId: cluster.primaryLevelId,
      });
      // Add all synonyms
      emotion.synonyms.forEach((synonym) => {
        terms.push({
          label: synonym,
          clusterId: cluster.id,
          levelId: cluster.primaryLevelId,
        });
      });
    });
  });
  
  return terms;
}

/**
 * Find emotion cluster by emotion label or synonym
 */
export function findClusterByEmotion(emotionLabel: string): EmotionCluster | undefined {
  const normalized = emotionLabel.toLowerCase().trim();
  
  for (const cluster of emotionClusters) {
    for (const emotion of cluster.emotions) {
      if (emotion.label.toLowerCase() === normalized) {
        return cluster;
      }
      if (emotion.synonyms.some(s => s.toLowerCase() === normalized)) {
        return cluster;
      }
    }
  }
  
  return undefined;
}

/**
 * Get emotion item by label
 */
export function getEmotionByLabel(label: string): { emotion: EmotionItem; cluster: EmotionCluster } | undefined {
  for (const cluster of emotionClusters) {
    const emotion = cluster.emotions.find(e => e.label === label);
    if (emotion) {
      return { emotion, cluster };
    }
  }
  return undefined;
}

/**
 * Get universal fallback emotions (for empty search state)
 */
export function getUniversalEmotions(): string[] {
  return ['stressed', 'anxious', 'frustrated', 'sad', 'numb', 'ashamed'];
}

