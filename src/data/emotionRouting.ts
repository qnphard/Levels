/**
 * Emotion routing and disambiguation logic
 * Maps selected emotions to primary levels, secondary levels, and related chapters
 */

import { emotionClusters, findClusterByEmotion, getEmotionByLabel } from './emotions';

export interface EmotionRoute {
  primaryLevelId: string;
  secondaryLevelIds: string[];
  relatedChapterIds: string[];
}

/**
 * Tie-breaker priority order for disambiguation
 * Higher index = higher priority
 */
const PRIORITY_ORDER: string[] = [
  'pride',   // Lowest priority
  'apathy',
  'shame',
  'guilt',
  'grief',
  'desire',
  'anger',
  'fear',    // Highest priority (includes stress/overwhelmed)
];

/**
 * Get priority score for a level ID
 */
function getPriority(levelId: string): number {
  const index = PRIORITY_ORDER.indexOf(levelId);
  return index >= 0 ? index : -1;
}

/**
 * Disambiguation rules
 */
function applyDisambiguationRules(selectedLevels: string[]): { primary: string; secondaries: string[] } {
  const uniqueLevels = [...new Set(selectedLevels)];
  
  if (uniqueLevels.length === 0) {
    return { primary: 'fear', secondaries: [] }; // Default fallback
  }
  
  if (uniqueLevels.length === 1) {
    return { primary: uniqueLevels[0], secondaries: [] };
  }
  
  // Rule 1: Shame + Guilt → Primary: Guilt, Secondary: Shame (action > identity)
  if (uniqueLevels.includes('shame') && uniqueLevels.includes('guilt')) {
    const others = uniqueLevels.filter(id => id !== 'shame' && id !== 'guilt');
    return {
      primary: 'guilt',
      secondaries: ['shame', ...others],
    };
  }
  
  // Rule 2: Overwhelmed/Stress + Numb/Burned out → Primary: Apathy, Secondary: Fear
  // (Check if we have fear-related and apathy-related emotions)
  const hasFear = uniqueLevels.includes('fear');
  const hasApathy = uniqueLevels.includes('apathy');
  if (hasFear && hasApathy) {
    const others = uniqueLevels.filter(id => id !== 'fear' && id !== 'apathy');
    return {
      primary: 'apathy',
      secondaries: ['fear', ...others],
    };
  }
  
  // Rule 3: Jealous → Primary: Desire, Secondary: Fear (fear of loss)
  // This is handled by the emotion data itself (jealous maps to desire)
  
  // Default: Use priority order
  const sorted = uniqueLevels.sort((a, b) => getPriority(b) - getPriority(a)); // Higher priority first
  return {
    primary: sorted[0],
    secondaries: sorted.slice(1),
  };
}

/**
 * Get level ID directly from emotion label (handles synonyms)
 * This ensures each emotion maps to the correct level regardless of cluster
 */
function getLevelIdFromEmotion(emotionLabel: string): string | undefined {
  const normalized = emotionLabel.toLowerCase().trim();
  
  // Direct mapping of emotion labels and synonyms to level IDs
  const emotionToLevelMap: Record<string, string> = {
    // Shame
    'shame': 'shame',
    'ashamed': 'shame',
    'embarrassed': 'shame',
    'humiliated': 'shame',
    'mortified': 'shame',
    'worthless': 'shame',
    'not good enough': 'shame',
    'inadequate': 'shame',
    'unlovable': 'shame',
    'disgusting': 'shame',
    'exposed': 'shame',
    'defective': 'shame',
    'flawed': 'shame',
    
    // Guilt
    'guilt': 'guilt',
    'guilty': 'guilt',
    'remorse': 'guilt',
    'regret': 'guilt',
    'ashamed of what i did': 'guilt',
    'beat myself up': 'guilt',
    "i shouldn't have…": 'guilt',
    'my fault': 'guilt',
    'over-apologizing': 'guilt',
    'atone': 'guilt',
    
    // Fear
    'fear': 'fear',
    'anxious': 'fear',
    'worried': 'fear',
    'stressed': 'fear',
    'overwhelmed': 'fear',
    'dread': 'fear',
    'panic': 'fear',
    'nervous': 'fear',
    'jittery': 'fear',
    'on edge': 'fear',
    'tense': 'fear',
    'scared': 'fear',
    'catastrophizing': 'fear',
    "can't relax": 'fear',
    'imposter syndrome': 'fear',
    'fear of failure': 'fear',
    'fear of rejection': 'fear',
    'fear of uncertainty': 'fear',
    
    // Anger
    'anger': 'anger',
    'pissed': 'anger',
    'mad': 'anger',
    'annoyed': 'anger',
    'irritated': 'anger',
    'frustrated': 'anger',
    'fed up': 'anger',
    'offended': 'anger',
    'disrespected': 'anger',
    'resentful': 'anger',
    'bitter': 'anger',
    'outraged': 'anger',
    'livid': 'anger',
    'snappy': 'anger',
    'triggered': 'anger',
    'vengeful': 'anger',
    'road-rage': 'anger',
    
    // Desire
    'desire': 'desire',
    'crave': 'desire',
    'lust': 'desire',
    'tempted': 'desire',
    'urge': 'desire',
    "can't stop thinking": 'desire',
    'need it': 'desire',
    'fomo': 'desire',
    'obsessed': 'desire',
    'fixated': 'desire',
    'jealous': 'desire',
    'envy': 'desire',
    'possessive': 'desire',
    'needy': 'desire',
    'clingy': 'desire',
    'attention-seeking': 'desire',
    'binge': 'desire',
    'impulse buying': 'desire',
    'sugar hit': 'desire',
    'caffeine fix': 'desire',
    'nicotine hit': 'desire',
    'thirsty': 'desire',
    'impulsive': 'desire',
    
    // Grief
    'grief': 'grief',
    'heartbroken': 'grief',
    'devastated': 'grief',
    'heavy-hearted': 'grief',
    'missing you': 'grief',
    'lonely': 'grief',
    'homesick': 'grief',
    'bereft': 'grief',
    'sorrow': 'grief',
    'blue': 'grief',
    'tearful': 'grief',
    'disappointed': 'grief',
    'let down': 'grief',
    'sad': 'grief',
    
    // Apathy
    'apathy': 'apathy',
    'numb': 'apathy',
    'blah': 'apathy',
    'meh': 'apathy',
    'checked out': 'apathy',
    'drained': 'apathy',
    'exhausted': 'apathy',
    'burned out': 'apathy',
    'burn out': 'apathy',
    'over it': 'apathy',
    'dead inside': 'apathy',
    'flat': 'apathy',
    'stuck': 'apathy',
    'unmotivated': 'apathy',
    'hopeless': 'apathy',
    'why bother': 'apathy',
    
    // Pride
    'pride': 'pride',
    'defensive': 'pride',
    'superior': 'pride',
    'smug': 'pride',
    'righteous': 'pride',
    'stubborn': 'pride',
    "i'm right": 'pride',
    "can't admit fault": 'pride',
    'holier-than-thou': 'pride',
    'judgmental': 'pride',
  };
  
  return emotionToLevelMap[normalized];
}

/**
 * Get primary route based on selected emotions
 */
export function getPrimaryRoute(selectedEmotions: string[]): EmotionRoute {
  if (selectedEmotions.length === 0) {
    return {
      primaryLevelId: 'fear',
      secondaryLevelIds: [],
      relatedChapterIds: ['stress'],
    };
  }
  
  // Map emotion labels (including synonyms) to level IDs directly
  const levelIds: string[] = [];
  const chapterIds: string[] = [];
  const clusters = new Map<string, typeof emotionClusters[0]>();
  
  selectedEmotions.forEach((emotionLabel) => {
    // First try direct mapping
    let levelId = getLevelIdFromEmotion(emotionLabel);
    
    // Fallback to cluster lookup if direct mapping doesn't work
    if (!levelId) {
      const cluster = findClusterByEmotion(emotionLabel);
      if (cluster) {
        levelId = cluster.primaryLevelId;
        chapterIds.push(...cluster.relatedChapterIds);
        clusters.set(cluster.primaryLevelId, cluster);
      }
    } else {
      // Find cluster for secondary/chapter info
      const cluster = findClusterByEmotion(emotionLabel);
      if (cluster) {
        chapterIds.push(...cluster.relatedChapterIds);
        clusters.set(levelId, cluster);
      }
    }
    
    if (levelId && !levelIds.includes(levelId)) {
      levelIds.push(levelId);
    }
  });
  
  // Apply disambiguation rules
  const { primary, secondaries } = applyDisambiguationRules(levelIds);
  
  // Collect secondary level IDs from clusters and default mappings
  const secondarySet = new Set<string>();
  secondaries.forEach((levelId) => {
    secondarySet.add(levelId);
    const cluster = clusters.get(levelId);
    if (cluster) {
      cluster.secondaryLevelIds.forEach(id => secondarySet.add(id));
    }
  });
  
  // Add default secondary mappings based on primary level
  const defaultSecondaries: Record<string, string[]> = {
    'shame': ['guilt'],
    'guilt': ['shame'],
    'fear': [],
    'anger': ['desire'],
    'desire': ['anger', 'fear'],
    'grief': [],
    'apathy': ['fear'],
    'pride': [],
  };
  
  const defaultSecondary = defaultSecondaries[primary] || [];
  defaultSecondary.forEach(id => secondarySet.add(id));
  
  // Collect related chapter IDs
  const relatedChapters = new Set<string>(chapterIds);
  
  // Add default chapters based on primary level
  if (primary === 'fear') {
    relatedChapters.add('stress');
  }
  if (primary === 'anger') {
    relatedChapters.add('expression');
  }
  
  // Also collect from clusters
  const primaryCluster = clusters.get(primary);
  if (primaryCluster) {
    primaryCluster.relatedChapterIds.forEach(id => relatedChapters.add(id));
  }
  
  // Remove duplicates and filter out the primary from secondaries
  const secondaryLevelIds = Array.from(secondarySet).filter(id => id !== primary);
  
  return {
    primaryLevelId: primary,
    secondaryLevelIds: secondaryLevelIds,
    relatedChapterIds: Array.from(relatedChapters),
  };
}

/**
 * Fuzzy match emotions for search
 */
export function fuzzyMatchEmotion(query: string): Array<{ label: string; levelId: string; clusterId: string; score: number }> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }
  
  const matches: Array<{ label: string; levelId: string; clusterId: string; score: number }> = [];
  
  emotionClusters.forEach((cluster) => {
    cluster.emotions.forEach((emotion) => {
      const labelLower = emotion.label.toLowerCase();
      
      // Exact match gets highest score
      if (labelLower === normalizedQuery) {
        matches.push({
          label: emotion.label,
          levelId: cluster.primaryLevelId,
          clusterId: cluster.id,
          score: 100,
        });
      }
      // Starts with gets high score
      else if (labelLower.startsWith(normalizedQuery)) {
        matches.push({
          label: emotion.label,
          levelId: cluster.primaryLevelId,
          clusterId: cluster.id,
          score: 80,
        });
      }
      // Contains gets medium score
      else if (labelLower.includes(normalizedQuery)) {
        matches.push({
          label: emotion.label,
          levelId: cluster.primaryLevelId,
          clusterId: cluster.id,
          score: 60,
        });
      }
      
      // Check synonyms
      emotion.synonyms.forEach((synonym) => {
        const synonymLower = synonym.toLowerCase();
        
        if (synonymLower === normalizedQuery) {
          matches.push({
            label: emotion.label,
            levelId: cluster.primaryLevelId,
            clusterId: cluster.id,
            score: 90, // Synonym exact match slightly lower than label exact match
          });
        } else if (synonymLower.startsWith(normalizedQuery)) {
          matches.push({
            label: emotion.label,
            levelId: cluster.primaryLevelId,
            clusterId: cluster.id,
            score: 70,
          });
        } else if (synonymLower.includes(normalizedQuery)) {
          matches.push({
            label: emotion.label,
            levelId: cluster.primaryLevelId,
            clusterId: cluster.id,
            score: 50,
          });
        }
      });
    });
  });
  
  // Sort by score (highest first) and remove duplicates
  const uniqueMatches = new Map<string, { label: string; levelId: string; clusterId: string; score: number }>();
  
  matches.forEach((match) => {
    const key = `${match.label}-${match.levelId}`;
    const existing = uniqueMatches.get(key);
    if (!existing || match.score > existing.score) {
      uniqueMatches.set(key, match);
    }
  });
  
  return Array.from(uniqueMatches.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Limit to top 20 matches
}

