/**
 * Enhanced TypeScript interfaces for Phase 4 content validation
 * Provides type safety and validation for higher consciousness levels
 */

import { ContentBlock, Duality } from '../data/transcendingData';

// Level categories for content approach validation
export type LevelCategory = 'lower_levels' | 'linear_mind' | 'spiritual_reality' | 'enlightenment';

// Content approach mapping for each category
export type ContentApproach = 'escape_suffering' | 'remove_blocks' | 'stabilize_states' | 'transcend_positions';

// Enhanced TranscendingContent interface with metadata
export interface EnhancedTranscendingContent {
    /** The essential nature and manifestation of this level */
    corePattern: ContentBlock[];
    
    /** How the ego operates and manifests at this level */
    egoDynamics: ContentBlock[];
    
    /** Karmic factors, spiritual meaning, deeper context */
    spiritualContext: ContentBlock[];
    
    /** The actual path through and beyond this level - exactly 8 steps */
    pathThrough: ContentBlock[];
    
    /** Transformation pairs: from negative to positive - exactly 10 pairs */
    dualities: Duality[];
    
    // Metadata for content management and validation
    level_category?: LevelCategory;
    content_approach?: ContentApproach;
    source_books_referenced?: string[];
    audit_date?: string;
    implementation_date?: string;
    word_count?: number;
    content_blocks_count?: number;
}

// Level category mapping
export const LEVEL_CATEGORIES: Record<string, LevelCategory> = {
    // Lower levels (already implemented)
    shame: 'lower_levels',
    guilt: 'lower_levels', 
    apathy: 'lower_levels',
    grief: 'lower_levels',
    fear: 'lower_levels',
    desire: 'lower_levels',
    anger: 'lower_levels',
    pride: 'lower_levels',
    
    // Linear Mind levels (Phase 4 focus)
    courage: 'linear_mind',
    neutrality: 'linear_mind',
    willingness: 'linear_mind',
    acceptance: 'linear_mind',
    reason: 'linear_mind',
    
    // Spiritual Reality levels (Phase 4 focus)
    love: 'spiritual_reality',
    joy: 'spiritual_reality', 
    peace: 'spiritual_reality',
    
    // Enlightenment (Phase 4 focus)
    enlightenment: 'enlightenment'
} as const;

// Content approach mapping
export const CONTENT_APPROACHES: Record<LevelCategory, ContentApproach> = {
    lower_levels: 'escape_suffering',
    linear_mind: 'remove_blocks',
    spiritual_reality: 'stabilize_states',
    enlightenment: 'transcend_positions'
} as const;

// Higher level IDs for Phase 4 implementation
export const HIGHER_LEVEL_IDS = [
    'courage', 'neutrality', 'willingness', 'acceptance', 'reason',
    'love', 'joy', 'peace', 'enlightenment'
] as const;

// Content quality metrics interface
export interface ContentQualityMetrics {
    word_count: number;                    // Target: ~1000 words structured content
    content_blocks: number;                // Target: 8-12 blocks for optimal pacing
    callout_blocks: number;                // Target: 2+ per level for relatability
    path_through_steps: number;            // Required: exactly 8 steps
    duality_pairs: number;                 // Required: exactly 10 pairs
    source_books_coverage: string[];       // Required: all 5 books referenced
    text_block_sentence_count: number[];   // Max: 2-3 sentences per text block
    uses_we_language: boolean;             // Required: shared experience language
    has_numerical_calibrations: boolean;   // Forbidden: no calibrations in user content
    has_example_callouts: boolean;         // Required: real-life examples
    has_quote_blocks: boolean;             // Recommended: authoritative wisdom
}

// Validation result interfaces
export interface ContentValidationResult {
    isValid: boolean;
    errors: ContentValidationError[];
    warnings: ContentValidationWarning[];
    metrics: ContentQualityMetrics;
}

export interface ContentValidationError {
    level: string;
    section: 'corePattern' | 'egoDynamics' | 'spiritualContext' | 'pathThrough' | 'dualities';
    type: 'missing_section' | 'invalid_structure' | 'content_violation' | 'word_count' | 'step_count';
    message: string;
    details?: any;
}

export interface ContentValidationWarning {
    level: string;
    section: 'corePattern' | 'egoDynamics' | 'spiritualContext' | 'pathThrough' | 'dualities';
    type: 'quality_concern' | 'style_issue' | 'optimization_suggestion';
    message: string;
    suggestion?: string;
}

// Content loading states for error handling
export type ContentLoadingState = 
    | 'loading'
    | 'loaded'
    | 'error'
    | 'fallback';

// Validation functions type definitions
export type ContentValidator = (content: EnhancedTranscendingContent, levelId: string) => ContentValidationResult;
export type SectionValidator = (blocks: ContentBlock[], levelId: string, section: string) => ContentValidationError[];
export type QualityAnalyzer = (content: EnhancedTranscendingContent, levelId: string) => ContentQualityMetrics;

// Source book references for audit tracking
export const SOURCE_BOOKS = [
    'Transcending the Levels of Consciousness',
    'Power vs Force',
    'Letting Go',
    'Healing & Recovery',
    'Truth vs Falsehood'
] as const;

export type SourceBook = typeof SOURCE_BOOKS[number];

// Content audit status tracking
export interface ContentAuditStatus {
    level_id: string;
    audit_completed: boolean;
    audit_date?: string;
    auditor?: string;
    source_books_reviewed: SourceBook[];
    quality_score?: number;
    implementation_ready: boolean;
    notes?: string;
}

// Batch implementation tracking
export interface BatchImplementationStatus {
    batch_name: string;
    levels: string[];
    status: 'not_started' | 'in_progress' | 'completed' | 'testing';
    start_date?: string;
    completion_date?: string;
    tests_passing: boolean;
    notes?: string;
}