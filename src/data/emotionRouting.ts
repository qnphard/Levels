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
  
  // Map emotion labels (including synonyms) to level IDs
  const levelIds: string[] = [];
  const chapterIds: string[] = [];
  const clusters = new Map<string, typeof emotionClusters[0]>();
  
  selectedEmotions.forEach((emotionLabel) => {
    const cluster = findClusterByEmotion(emotionLabel);
    if (cluster) {
      // Only add unique level IDs
      if (!levelIds.includes(cluster.primaryLevelId)) {
        levelIds.push(cluster.primaryLevelId);
      }
      chapterIds.push(...cluster.relatedChapterIds);
      clusters.set(cluster.primaryLevelId, cluster);
    }
  });
  
  // Apply disambiguation rules
  const { primary, secondaries } = applyDisambiguationRules(levelIds);
  
  // Collect secondary level IDs from clusters
  const secondarySet = new Set<string>();
  secondaries.forEach((levelId) => {
    secondarySet.add(levelId);
    const cluster = clusters.get(levelId);
    if (cluster) {
      cluster.secondaryLevelIds.forEach(id => secondarySet.add(id));
    }
  });
  
  // Collect related chapter IDs
  const relatedChapters = new Set<string>(chapterIds);
  const primaryCluster = clusters.get(primary);
  if (primaryCluster) {
    primaryCluster.relatedChapterIds.forEach(id => relatedChapters.add(id));
    // Add stress chapter if fear-related
    if (primary === 'fear') {
      relatedChapters.add('stress');
    }
    // Add expression chapter if anger-related
    if (primary === 'anger') {
      relatedChapters.add('expression');
    }
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

