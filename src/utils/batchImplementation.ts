/**
 * Batch implementation utilities for Phase 4 workflow
 * Manages systematic implementation of higher consciousness levels
 */

import { 
    BatchImplementationStatus, 
    ContentAuditStatus, 
    HIGHER_LEVEL_IDS,
    LEVEL_CATEGORIES,
    LevelCategory 
} from '../types/contentValidation';
import { validateContent, calculateQualityMetrics } from './contentValidation';
import { getTranscendingContent } from '../data/transcendingData';

// Batch definitions for systematic implementation
export const IMPLEMENTATION_BATCHES = {
    linear_mind: {
        name: 'Linear Mind Levels (200-499)',
        levels: ['courage', 'neutrality', 'willingness', 'acceptance', 'reason'],
        focus: 'Removing mental and emotional blocks',
        approach: 'remove_blocks'
    },
    spiritual_reality: {
        name: 'Spiritual Reality Levels (500-600)',
        levels: ['love', 'joy', 'peace'],
        focus: 'Stabilizing spiritual states',
        approach: 'stabilize_states'
    },
    enlightenment: {
        name: 'Enlightenment Level (700+)',
        levels: ['enlightenment'],
        focus: 'Transcending all positions',
        approach: 'transcend_positions'
    }
} as const;

export type BatchName = keyof typeof IMPLEMENTATION_BATCHES;

/**
 * Get implementation status for a specific batch
 */
export function getBatchStatus(batchName: BatchName): BatchImplementationStatus {
    const batch = IMPLEMENTATION_BATCHES[batchName];
    const levelStatuses = batch.levels.map(levelId => getLevelImplementationStatus(levelId));
    
    const completedLevels = levelStatuses.filter(status => status.implementation_ready).length;
    const totalLevels = batch.levels.length;
    
    let status: BatchImplementationStatus['status'] = 'not_started';
    if (completedLevels === totalLevels) {
        status = 'completed';
    } else if (completedLevels > 0) {
        status = 'in_progress';
    }
    
    return {
        batch_name: batch.name,
        levels: batch.levels,
        status,
        tests_passing: checkBatchTestsStatus(batch.levels),
        notes: `${completedLevels}/${totalLevels} levels implemented`
    };
}

/**
 * Get implementation status for a specific level
 */
export function getLevelImplementationStatus(levelId: string): ContentAuditStatus {
    const content = getTranscendingContent(levelId);
    
    if (!content) {
        return {
            level_id: levelId,
            audit_completed: false,
            source_books_reviewed: [],
            implementation_ready: false,
            notes: 'Content not found'
        };
    }
    
    // Check if content is implemented (not empty strings)
    const isImplemented = typeof content.corePattern !== 'string' || 
                         content.corePattern.length > 0;
    
    if (!isImplemented) {
        return {
            level_id: levelId,
            audit_completed: false,
            source_books_reviewed: [],
            implementation_ready: false,
            notes: 'Content structure is empty strings - needs implementation'
        };
    }
    
    // Validate implemented content
    const validationResult = validateContent(content, levelId);
    const qualityScore = calculateQualityScore(validationResult.metrics);
    
    return {
        level_id: levelId,
        audit_completed: true,
        source_books_reviewed: [], // Would need to be tracked during audit
        quality_score: qualityScore,
        implementation_ready: validationResult.isValid && qualityScore >= 80,
        notes: validationResult.isValid ? 
            `Quality score: ${qualityScore}%` : 
            `${validationResult.errors.length} validation errors`
    };
}

/**
 * Calculate quality score from metrics (0-100)
 */
function calculateQualityScore(metrics: any): number {
    let score = 0;
    let maxScore = 0;
    
    // Word count (20 points) - target 800-1200 words
    maxScore += 20;
    if (metrics.word_count >= 800 && metrics.word_count <= 1200) {
        score += 20;
    } else if (metrics.word_count >= 600 && metrics.word_count <= 1400) {
        score += 10;
    }
    
    // Path through steps (20 points) - exactly 8 steps
    maxScore += 20;
    if (metrics.path_through_steps === 8) {
        score += 20;
    }
    
    // Duality pairs (15 points) - exactly 10 pairs
    maxScore += 15;
    if (metrics.duality_pairs === 10) {
        score += 15;
    }
    
    // Language usage (15 points)
    maxScore += 15;
    if (metrics.uses_we_language && !metrics.has_numerical_calibrations) {
        score += 15;
    } else if (metrics.uses_we_language || !metrics.has_numerical_calibrations) {
        score += 7;
    }
    
    // Content variety (15 points)
    maxScore += 15;
    if (metrics.callout_blocks >= 2 && metrics.has_example_callouts) {
        score += 15;
    } else if (metrics.callout_blocks >= 1) {
        score += 7;
    }
    
    // Content blocks count (15 points) - target 8-12 blocks
    maxScore += 15;
    if (metrics.content_blocks >= 8 && metrics.content_blocks <= 12) {
        score += 15;
    } else if (metrics.content_blocks >= 6 && metrics.content_blocks <= 15) {
        score += 10;
    }
    
    return Math.round((score / maxScore) * 100);
}

/**
 * Check if all tests are passing for a batch of levels
 */
function checkBatchTestsStatus(levelIds: string[]): boolean {
    // This would integrate with the actual test runner
    // For now, return true if all levels are implemented
    return levelIds.every(levelId => {
        const content = getTranscendingContent(levelId);
        return content && typeof content.corePattern !== 'string';
    });
}

/**
 * Get overall Phase 4 implementation progress
 */
export function getPhase4Progress(): {
    totalLevels: number;
    implementedLevels: number;
    completionPercentage: number;
    batchStatuses: Record<BatchName, BatchImplementationStatus>;
    nextRecommendedLevel?: string;
} {
    const batchStatuses: Record<BatchName, BatchImplementationStatus> = {
        linear_mind: getBatchStatus('linear_mind'),
        spiritual_reality: getBatchStatus('spiritual_reality'),
        enlightenment: getBatchStatus('enlightenment')
    };
    
    const totalLevels = HIGHER_LEVEL_IDS.length;
    const implementedLevels = HIGHER_LEVEL_IDS.filter(levelId => {
        const status = getLevelImplementationStatus(levelId);
        return status.implementation_ready;
    }).length;
    
    const completionPercentage = Math.round((implementedLevels / totalLevels) * 100);
    
    // Find next recommended level to implement
    const nextRecommendedLevel = findNextRecommendedLevel();
    
    return {
        totalLevels,
        implementedLevels,
        completionPercentage,
        batchStatuses,
        nextRecommendedLevel
    };
}

/**
 * Find the next level that should be implemented based on batch order
 */
function findNextRecommendedLevel(): string | undefined {
    // Check batches in order
    const batchOrder: BatchName[] = ['linear_mind', 'spiritual_reality', 'enlightenment'];
    
    for (const batchName of batchOrder) {
        const batch = IMPLEMENTATION_BATCHES[batchName];
        
        for (const levelId of batch.levels) {
            const status = getLevelImplementationStatus(levelId);
            if (!status.implementation_ready) {
                return levelId;
            }
        }
    }
    
    return undefined; // All levels implemented
}

/**
 * Generate implementation report for a specific batch
 */
export function generateBatchReport(batchName: BatchName): string {
    const batch = IMPLEMENTATION_BATCHES[batchName];
    const batchStatus = getBatchStatus(batchName);
    
    let report = `# ${batch.name} Implementation Report\n\n`;
    report += `**Focus**: ${batch.focus}\n`;
    report += `**Status**: ${batchStatus.status}\n`;
    report += `**Progress**: ${batchStatus.notes}\n\n`;
    
    report += `## Level Details\n\n`;
    
    for (const levelId of batch.levels) {
        const levelStatus = getLevelImplementationStatus(levelId);
        const content = getTranscendingContent(levelId);
        
        report += `### ${levelId.charAt(0).toUpperCase() + levelId.slice(1)}\n`;
        report += `- **Status**: ${levelStatus.implementation_ready ? '✅ Ready' : '⏳ Pending'}\n`;
        
        if (levelStatus.quality_score) {
            report += `- **Quality Score**: ${levelStatus.quality_score}%\n`;
        }
        
        if (content && typeof content.corePattern !== 'string') {
            const metrics = calculateQualityMetrics(content, levelId);
            report += `- **Word Count**: ${metrics.word_count}\n`;
            report += `- **Content Blocks**: ${metrics.content_blocks}\n`;
            report += `- **Path Steps**: ${metrics.path_through_steps}/8\n`;
            report += `- **Dualities**: ${metrics.duality_pairs}/10\n`;
        }
        
        if (levelStatus.notes) {
            report += `- **Notes**: ${levelStatus.notes}\n`;
        }
        
        report += '\n';
    }
    
    return report;
}

/**
 * Validate that a level is ready for the next implementation phase
 */
export function validateLevelReadiness(levelId: string): {
    ready: boolean;
    blockers: string[];
    recommendations: string[];
} {
    const status = getLevelImplementationStatus(levelId);
    const content = getTranscendingContent(levelId);
    
    const blockers: string[] = [];
    const recommendations: string[] = [];
    
    if (!content) {
        blockers.push('Content not found in transcendingData.ts');
        return { ready: false, blockers, recommendations };
    }
    
    if (typeof content.corePattern === 'string') {
        blockers.push('Content still uses string format instead of ContentBlock arrays');
        recommendations.push('Complete content audit and implement ContentBlock structure');
        return { ready: false, blockers, recommendations };
    }
    
    const validationResult = validateContent(content, levelId);
    
    if (!validationResult.isValid) {
        blockers.push(...validationResult.errors.map(error => error.message));
    }
    
    if (validationResult.warnings.length > 0) {
        recommendations.push(...validationResult.warnings.map(warning => warning.message));
    }
    
    if (!status.quality_score || status.quality_score < 80) {
        recommendations.push('Improve content quality to achieve 80%+ quality score');
    }
    
    return {
        ready: status.implementation_ready,
        blockers,
        recommendations
    };
}