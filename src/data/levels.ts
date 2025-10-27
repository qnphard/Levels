import { ConsciousnessLevel } from '../types';

/**
 * The 16 Consciousness Levels based on David Hawkins' Map of Consciousness
 *
 * IMPORTANT PRINCIPLES:
 * - All levels are accessible from the start (no gatekeeping)
 * - Users are gently guided but free to explore any level
 * - Levels 200+ are all equally important
 * - Revisiting previous levels is sacred and encouraged
 * - Level 200 (Courage) is the threshold from force to power
 */

export const consciousnessLevels: ConsciousnessLevel[] = [
  // HEALING CATEGORY (Below 200 - Moving toward Courage)
  {
    id: 'shame',
    level: 20,
    name: 'Shame',
    antithesis: 'Self-Compassion',
    category: 'healing',
    description: 'A feeling of being fundamentally flawed or unworthy',
    characteristics: [
      'Feeling unworthy or defective',
      'Self-rejection and self-hatred',
      'Desire to hide or disappear',
      'Deep sense of wrongness',
    ],
    physicalSigns: [
      'Hunched posture',
      'Avoiding eye contact',
      'Tension in chest and throat',
      'Low energy and vitality',
    ],
    trapDescription: 'Believing your identity is the shame itself, that you ARE defective rather than simply feeling shame',
    wayThrough: 'Self-compassion practices that separate the feeling from your inherent worth. You are not shame - you are awareness experiencing shame.',
    meditations: [], // Will be populated with actual meditation IDs
    estimatedTime: 20,
    color: '#D6C8E1',
  },
  {
    id: 'guilt',
    level: 30,
    name: 'Guilt',
    antithesis: 'Forgiveness',
    category: 'healing',
    description: 'Regret and self-blame about past actions',
    characteristics: [
      'Ruminating on past mistakes',
      'Self-punishment and remorse',
      'Feeling you deserve suffering',
      'Chronic apologizing',
    ],
    physicalSigns: [
      'Heavy sensation in chest',
      'Tension in shoulders',
      'Tight jaw',
      'Fatigue and heaviness',
    ],
    trapDescription: 'Using guilt as a form of penance, believing that suffering somehow makes up for past actions',
    wayThrough: 'Forgiveness practices - both self-forgiveness and understanding that growth, not suffering, honors the past.',
    meditations: [],
    estimatedTime: 25,
    color: '#6C757D',
  },
  {
    id: 'apathy',
    level: 50,
    name: 'Apathy',
    antithesis: 'Willingness',
    category: 'healing',
    description: 'A sense of hopelessness and giving up',
    characteristics: [
      'Feeling helpless and powerless',
      'Loss of motivation',
      'Numbness and disconnection',
      'Everything feels pointless',
    ],
    physicalSigns: [
      'Low energy and lethargy',
      'Heavy limbs',
      'Shallow breathing',
      'Difficulty moving or starting tasks',
    ],
    trapDescription: 'Believing nothing matters, so why try? This creates a self-fulfilling prophecy of stagnation.',
    wayThrough: 'Micro-actions and willingness practices. Even 1% shift restores agency. Small steps break the paralysis.',
    meditations: [],
    estimatedTime: 15,
    color: '#748FFC',
  },
  {
    id: 'grief',
    level: 75,
    name: 'Grief',
    antithesis: 'Acceptance',
    category: 'healing',
    description: 'Sadness and loss about what was or what could have been',
    characteristics: [
      'Deep sadness and mourning',
      'Longing for what is gone',
      'Tears and emotional waves',
      'Feeling incomplete without what was lost',
    ],
    physicalSigns: [
      'Tightness in throat and chest',
      'Tears and crying',
      'Heavy heart sensation',
      'Waves of emotion',
    ],
    trapDescription: 'Holding onto attachment, believing that letting go means forgetting or dishonoring what was lost',
    wayThrough: 'Acceptance and gratitude practices. Honoring what was while releasing attachment to it. Grief transforms through allowing the waves.',
    meditations: [],
    estimatedTime: 30,
    color: '#4DABF7',
  },
  {
    id: 'fear',
    level: 100,
    name: 'Fear',
    antithesis: 'Courage',
    category: 'healing',
    description: 'Anxiety about potential threats and uncertainty',
    characteristics: [
      'Worry about the future',
      'Hypervigilance and scanning for danger',
      'Need for control and certainty',
      'Avoidance and withdrawal',
    ],
    physicalSigns: [
      'Rapid heartbeat',
      'Shallow, quick breathing',
      'Tension throughout body',
      'Cold hands and feet',
    ],
    trapDescription: 'Believing control and avoidance create safety, when they actually amplify fear',
    wayThrough: 'Courage practices that build trust and presence. Small acts of facing fear gently, orienting to actual safety in this moment.',
    meditations: [],
    estimatedTime: 25,
    color: '#FFD93D',
  },
  {
    id: 'desire',
    level: 125,
    name: 'Desire',
    antithesis: 'Gratitude',
    category: 'healing',
    description: 'Craving and wanting, never quite satisfied',
    characteristics: [
      'Constant wanting and grasping',
      'Feeling incomplete without something',
      'Comparison and envy',
      'Pursuit of external fulfillment',
    ],
    physicalSigns: [
      'Restlessness and agitation',
      'Tension in hands and jaw',
      'Difficulty relaxing',
      'Sense of emptiness',
    ],
    trapDescription: 'Believing satisfaction comes from getting what you want, creating an endless cycle of craving',
    wayThrough: 'Gratitude and sufficiency practices. Letting the urge crest and pass. Acting from integrity, not grasping.',
    meditations: [],
    estimatedTime: 20,
    color: '#FFB347',
  },
  {
    id: 'anger',
    level: 150,
    name: 'Anger',
    antithesis: 'Understanding',
    category: 'healing',
    description: 'Frustration and resentment toward perceived wrongs',
    characteristics: [
      'Irritation and frustration',
      'Blame and resentment',
      'Need to be right',
      'Sense of injustice',
    ],
    physicalSigns: [
      'Heat in face and chest',
      'Clenched jaw and fists',
      'Rapid breathing',
      'Muscle tension',
    ],
    trapDescription: 'Using anger as power, believing it protects you, when it actually keeps you reactive and controlled by others',
    wayThrough: 'Understanding and responsibility practices. Boundaries without blame. Softening the jaw, feeling the heat safely.',
    meditations: [],
    estimatedTime: 20,
    color: '#FA5252',
  },
  {
    id: 'pride',
    level: 175,
    name: 'Pride',
    antithesis: 'Humility',
    category: 'healing',
    description: 'Need to be special, better, or superior',
    characteristics: [
      'Need for recognition and status',
      'Comparing yourself to others',
      'Defensiveness when challenged',
      'Attachment to image and reputation',
    ],
    physicalSigns: [
      'Puffed chest',
      'Raised chin',
      'Tension in maintaining appearance',
      'Brittleness and fear of exposure',
    ],
    trapDescription: 'Believing your worth depends on being better than others, creating fragility and separation',
    wayThrough: 'Humility and teachability practices. Replacing "I know" with "Let me learn/serve". True strength is in ordinariness.',
    meditations: [],
    estimatedTime: 25,
    color: '#DCC5E8',
  },

  // EMPOWERMENT CATEGORY (200-399 - Power, not force)
  {
    id: 'courage',
    level: 200,
    name: 'Courage',
    antithesis: 'Integrity',
    category: 'empowerment',
    description: 'The threshold where true power begins - willingness to face life honestly',
    characteristics: [
      'Taking responsibility',
      'Facing reality as it is',
      'Willingness to grow and change',
      'Honest self-examination',
    ],
    physicalSigns: [
      'Steadier breathing',
      'Grounded posture',
      'Increased energy',
      'Sense of aliveness',
    ],
    trapDescription: 'Trying to force courage or using it for ego purposes rather than genuine growth',
    wayThrough: 'Integrity practices. Small acts of honesty and authenticity. Micro-steps in alignment with truth.',
    meditations: [],
    estimatedTime: 25,
    color: '#FD7E14',
    isThreshold: true, // CRITICAL: This is the 200 threshold
  },
  {
    id: 'neutrality',
    level: 250,
    name: 'Neutrality',
    antithesis: 'Detachment',
    category: 'empowerment',
    description: 'Non-attachment to outcomes, flexibility, and okay-ness',
    characteristics: [
      'Emotional resilience',
      'Non-attachment to outcomes',
      'Flexibility and adaptability',
      'Inner okay-ness regardless of circumstances',
    ],
    physicalSigns: [
      'Relaxed body',
      'Even breathing',
      'Softness in face',
      'Ease in movement',
    ],
    trapDescription: 'Confusing neutrality with indifference or apathy, losing warmth and engagement',
    wayThrough: 'Detachment practices. Equanimity without coldness. Holding things lightly while staying caring.',
    meditations: [],
    estimatedTime: 30,
    color: '#ADB5BD',
  },
  {
    id: 'willingness',
    level: 310,
    name: 'Willingness',
    antithesis: 'Commitment',
    category: 'empowerment',
    description: 'Openness to new possibilities and genuine helpfulness',
    characteristics: [
      'Enthusiasm for growth',
      'Optimism and positivity',
      'Genuine helpfulness',
      'Openness to learning',
    ],
    physicalSigns: [
      'Light, energized body',
      'Open posture',
      'Bright expression',
      'Ready energy',
    ],
    trapDescription: 'Being so open to everything that you lose discernment and boundaries',
    wayThrough: 'Commitment practices. Saying yes from wholeness, not from seeking approval. Enthusiasm with wisdom.',
    meditations: [],
    estimatedTime: 25,
    color: '#DA77F2',
  },
  {
    id: 'acceptance',
    level: 350,
    name: 'Acceptance',
    antithesis: 'Forgiveness',
    category: 'empowerment',
    description: 'Taking responsibility and seeing things as they are',
    characteristics: [
      'Full responsibility for your experience',
      'Forgiveness becomes natural',
      'Seeing the perfection in what is',
      'Harmony and balance',
    ],
    physicalSigns: [
      'Deep, peaceful breathing',
      'Relaxed throughout',
      'Gentle warmth',
      'Settled presence',
    ],
    trapDescription: 'Using "acceptance" to bypass genuine feelings or avoid healthy boundaries',
    wayThrough: 'Forgiveness practices. True acceptance includes all of reality, including your boundaries and needs.',
    meditations: [],
    estimatedTime: 30,
    color: '#C5DAE8',
  },
  {
    id: 'reason',
    level: 400,
    name: 'Reason',
    antithesis: 'Wisdom',
    category: 'empowerment',
    description: 'Intellectual understanding and clarity of mind',
    characteristics: [
      'Clear thinking and logic',
      'Understanding causes and effects',
      'Scientific and rational',
      'Competence and expertise',
    ],
    physicalSigns: [
      'Alert and clear',
      'Focused energy',
      'Calm mind',
      'Efficient movement',
    ],
    trapDescription: 'Getting trapped in the intellect, believing you can think your way to truth, missing the heart',
    wayThrough: 'Wisdom practices. Honoring intellect while recognizing its limits. Opening to knowing beyond thinking.',
    meditations: [],
    estimatedTime: 35,
    color: '#E2CEE8',
  },

  // SPIRITUAL CATEGORY (500-599 - Heart-centered reality)
  {
    id: 'love',
    level: 500,
    name: 'Love',
    antithesis: 'Unconditional Love',
    category: 'spiritual',
    description: 'Unconditional love as a state of being, not an emotion',
    characteristics: [
      'Goodwill toward all beings',
      'Inclusivity and compassion',
      'Devotion and service',
      'Seeing the divine in all',
    ],
    physicalSigns: [
      'Open heart sensation',
      'Warmth throughout body',
      'Soft, gentle presence',
      'Radiant energy',
    ],
    trapDescription: 'Trying to force love or using spiritual concepts to bypass shadow work',
    wayThrough: 'Unconditional love practices. Letting love arise naturally from stillness. Service without identity.',
    meditations: [],
    estimatedTime: 40,
    color: '#E6DDCE',
  },
  {
    id: 'joy',
    level: 540,
    name: 'Joy',
    antithesis: 'Bliss',
    category: 'spiritual',
    description: 'Causeless joy independent of external circumstances',
    characteristics: [
      'Inner happiness regardless of events',
      'Simplicity and innocence',
      'Gratitude as a constant',
      'Everything is perfect as it is',
    ],
    physicalSigns: [
      'Lightness of being',
      'Spontaneous smile',
      'Effortless presence',
      'Glowing vitality',
    ],
    trapDescription: 'Chasing joy states or spiritual experiences rather than resting as awareness',
    wayThrough: 'Bliss practices. Resting as the joy that is always here beneath the content of experience.',
    meditations: [],
    estimatedTime: 45,
    color: '#FFC078',
  },

  // ENLIGHTENMENT CATEGORY (600 - Non-dual awareness)
  {
    id: 'peace',
    level: 600,
    name: 'Peace',
    antithesis: 'Self-Realization',
    category: 'enlightenment',
    description: 'Profound stillness and transcendence',
    characteristics: [
      'Infinite peace and stillness',
      'Non-duality - subject/object collapse',
      'Self as awareness itself',
      'Nothing needs to change',
    ],
    physicalSigns: [
      'Profound stillness',
      'Barely perceptible breath',
      'Body feels transparent',
      'Timeless presence',
    ],
    trapDescription: 'Making peace into a goal or achievement, creating seeking and effort',
    wayThrough: 'Self-realization practices. No technique. Simply being. The recognition that you already are what you seek.',
    meditations: [],
    estimatedTime: 60,
    color: '#51CF66',
  },
];

// Helper to get level by ID
export const getLevelById = (id: string): ConsciousnessLevel | undefined => {
  return consciousnessLevels.find((level) => level.id === id);
};

// Helper to get level by calibration number
export const getLevelByCalibration = (
  calibration: number
): ConsciousnessLevel | undefined => {
  return consciousnessLevels.find((level) => level.level === calibration);
};

// Helper to get next level in progression
export const getNextLevel = (
  currentId: string
): ConsciousnessLevel | undefined => {
  const currentIndex = consciousnessLevels.findIndex((l) => l.id === currentId);
  if (currentIndex === -1 || currentIndex === consciousnessLevels.length - 1) {
    return undefined;
  }
  return consciousnessLevels[currentIndex + 1];
};

// Helper to get previous level
export const getPreviousLevel = (
  currentId: string
): ConsciousnessLevel | undefined => {
  const currentIndex = consciousnessLevels.findIndex((l) => l.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return consciousnessLevels[currentIndex - 1];
};

// Helper to get suggested starting level (default is Courage - the threshold)
export const getSuggestedStartingLevel = (): ConsciousnessLevel => {
  return consciousnessLevels.find((l) => l.isThreshold) || consciousnessLevels[0];
};

// Categories for grouping
export const levelCategories = [
  'healing',
  'empowerment',
  'spiritual',
  'enlightenment',
] as const;
