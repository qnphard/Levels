/**
 * Content validation utilities for Phase 4 implementation
 * Provides automated quality checks and metrics tracking
 */

import { ContentBlock, Duality, TranscendingContent } from '../data/transcendingData';
import {
    ContentValidationResult,
    ContentValidationError,
    ContentValidationWarning,
    ContentQualityMetrics,
    EnhancedTranscendingContent,
    LEVEL_CATEGORIES,
    CONTENT_APPROACHES,
    HIGHER_LEVEL_IDS,
    LevelCategory,
    ContentApproach
} from '../types/contentValidation';

/**
 * Main content validation function
 */
export function validateContent(content: TranscendingContent, levelId: string): ContentValidationResult {
    const errors: ContentValidationError[] = [];
    const warnings: ContentValidationWarning[] = [];
    
    // Validate structure
    errors.push(...validateStructure(content, levelId));
    
    // Validate content quality
    errors.push(...validateQuality(content, levelId));
    warnings.push(...generateQualityWarnings(content, levelId));
    
    // Calculate metrics
    const metrics = calculateQualityMetrics(content, levelId);
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metrics
    };
}

/**
 * Validate basic content structure
 */
function validateStructure(content: TranscendingContent, levelId: string): ContentValidationError[] {
    const errors: ContentValidationError[] = [];
    
    // Check required sections exist
    const requiredSections = ['corePattern', 'egoDynamics', 'spiritualContext', 'pathThrough', 'dualities'];
    
    for (const section of requiredSections) {
        const sectionContent = content[section as keyof TranscendingContent];
        
        if (!sectionContent) {
            errors.push({
                level: levelId,
                section: section as any,
                type: 'missing_section',
                message: `Missing required section: ${section}`
            });
            continue;
        }
        
        // Validate ContentBlock arrays (not strings)
        if (section !== 'dualities' && typeof sectionContent === 'string') {
            errors.push({
                level: levelId,
                section: section as any,
                type: 'invalid_structure',
                message: `Section ${section} must be ContentBlock array, not string`
            });
        }
        
        // Validate dualities structure
        if (section === 'dualities') {
            const dualities = sectionContent as Duality[];
            if (!Array.isArray(dualities)) {
                errors.push({
                    level: levelId,
                    section: 'dualities',
                    type: 'invalid_structure',
                    message: 'Dualities must be an array'
                });
            } else if (dualities.length !== 10) {
                errors.push({
                    level: levelId,
                    section: 'dualities',
                    type: 'content_violation',
                    message: `Dualities must contain exactly 10 pairs, found ${dualities.length}`
                });
            }
        }
    }
    
    // Validate pathThrough has exactly 8 steps
    if (Array.isArray(content.pathThrough)) {
        const stepBlocks = content.pathThrough.filter(block => block.type === 'steps');
        const totalSteps = stepBlocks.reduce((sum, block) => 
            sum + (block.type === 'steps' ? block.items.length : 0), 0);
        
        if (totalSteps !== 8) {
            errors.push({
                level: levelId,
                section: 'pathThrough',
                type: 'step_count',
                message: `Path Through must contain exactly 8 steps, found ${totalSteps}`
            });
        }
    }
    
    return errors;
}

/**
 * Validate content quality standards
 */
function validateQuality(content: TranscendingContent, levelId: string): ContentValidationError[] {
    const errors: ContentValidationError[] = [];
    
    // Check if this is a higher level that should be implemented
    if (!HIGHER_LEVEL_IDS.includes(levelId as any)) {
        return errors; // Skip validation for lower levels
    }
    
    // Validate word count (approximately 1000 words ±200)
    const wordCount = calculateWordCount(content);
    if (wordCount < 800 || wordCount > 1200) {
        errors.push({
            level: levelId,
            section: 'corePattern', // Representative section
            type: 'word_count',
            message: `Content should be ~1000 words, found ${wordCount} words`,
            details: { wordCount, target: 1000, tolerance: 200 }
        });
    }
    
    // Validate "we" language usage
    const hasYouLanguage = checkForYouLanguage(content);
    if (hasYouLanguage) {
        errors.push({
            level: levelId,
            section: 'corePattern',
            type: 'content_violation',
            message: 'Content should use "we" language instead of "you" language'
        });
    }
    
    // Check for numerical calibrations
    const hasCalibrations = checkForNumericalCalibrations(content);
    if (hasCalibrations) {
        errors.push({
            level: levelId,
            section: 'corePattern',
            type: 'content_violation',
            message: 'Content should not contain numerical calibration references'
        });
    }
    
    return errors;
}

/**
 * Generate quality warnings (non-blocking issues)
 */
function generateQualityWarnings(content: TranscendingContent, levelId: string): ContentValidationWarning[] {
    const warnings: ContentValidationWarning[] = [];
    
    // Check for example callouts
    const hasExampleCallouts = checkForExampleCallouts(content);
    if (!hasExampleCallouts) {
        warnings.push({
            level: levelId,
            section: 'corePattern',
            type: 'quality_concern',
            message: 'Consider adding example callouts for real-life relatability',
            suggestion: 'Add callout blocks with variant="example" to illustrate concepts'
        });
    }
    
    // Check for quote blocks
    const hasQuotes = checkForQuoteBlocks(content);
    if (!hasQuotes) {
        warnings.push({
            level: levelId,
            section: 'spiritualContext',
            type: 'optimization_suggestion',
            message: 'Consider adding quote blocks to anchor teachings in authoritative wisdom',
            suggestion: 'Add quote blocks with Dr. Hawkins teachings'
        });
    }
    
    // Check text block sentence count
    const longTextBlocks = findLongTextBlocks(content);
    if (longTextBlocks.length > 0) {
        warnings.push({
            level: levelId,
            section: 'corePattern',
            type: 'style_issue',
            message: `${longTextBlocks.length} text blocks exceed 3 sentences`,
            suggestion: 'Break long text blocks into shorter, more digestible chunks'
        });
    }
    
    return warnings;
}

/**
 * Calculate comprehensive quality metrics
 */
export function calculateQualityMetrics(content: TranscendingContent, levelId: string): ContentQualityMetrics {
    const allBlocks = getAllContentBlocks(content);
    
    return {
        word_count: calculateWordCount(content),
        content_blocks: allBlocks.length,
        callout_blocks: allBlocks.filter(block => block.type === 'callout').length,
        path_through_steps: calculatePathThroughSteps(content),
        duality_pairs: Array.isArray(content.dualities) ? content.dualities.length : 0,
        source_books_coverage: [], // Would need to be manually tracked during audit
        text_block_sentence_count: getTextBlockSentenceCounts(content),
        uses_we_language: !checkForYouLanguage(content),
        has_numerical_calibrations: checkForNumericalCalibrations(content),
        has_example_callouts: checkForExampleCallouts(content),
        has_quote_blocks: checkForQuoteBlocks(content)
    };
}

/**
 * Helper functions for validation
 */

function getAllContentBlocks(content: TranscendingContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    ['corePattern', 'egoDynamics', 'spiritualContext', 'pathThrough'].forEach(section => {
        const sectionContent = content[section as keyof TranscendingContent];
        if (Array.isArray(sectionContent)) {
            blocks.push(...sectionContent);
        }
    });
    
    return blocks;
}

function calculateWordCount(content: TranscendingContent): number {
    const allBlocks = getAllContentBlocks(content);
    
    return allBlocks.reduce((count, block) => {
        switch (block.type) {
            case 'text':
            case 'callout':
                return count + countWords(block.content);
            case 'quote':
                return count + countWords(block.quote);
            case 'bullets':
                return count + block.items.reduce((sum, item) => sum + countWords(item), 0);
            case 'steps':
                return count + block.items.reduce((sum, step) => 
                    sum + countWords(step.title) + countWords(step.content), 0);
            default:
                return count;
        }
    }, 0);
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function calculatePathThroughSteps(content: TranscendingContent): number {
    if (!Array.isArray(content.pathThrough)) return 0;
    
    const stepBlocks = content.pathThrough.filter(block => block.type === 'steps');
    return stepBlocks.reduce((sum, block) => 
        sum + (block.type === 'steps' ? block.items.length : 0), 0);
}

function checkForYouLanguage(content: TranscendingContent): boolean {
    const allText = extractAllText(content);
    // Simple check for "you" pronouns (could be more sophisticated)
    return /\b(you|your|you're|you'll|you've)\b/i.test(allText);
}

function checkForNumericalCalibrations(content: TranscendingContent): boolean {
    const allText = extractAllText(content);
    // Check for patterns like "calibrates at 200" or "level 500"
    return /\b(calibrat|level|scale)\s*\d+\b/i.test(allText);
}

function checkForExampleCallouts(content: TranscendingContent): boolean {
    const allBlocks = getAllContentBlocks(content);
    return allBlocks.some(block => 
        block.type === 'callout' && block.variant === 'example'
    );
}

function checkForQuoteBlocks(content: TranscendingContent): boolean {
    const allBlocks = getAllContentBlocks(content);
    return allBlocks.some(block => block.type === 'quote');
}

function findLongTextBlocks(content: TranscendingContent): ContentBlock[] {
    const allBlocks = getAllContentBlocks(content);
    return allBlocks.filter(block => {
        if (block.type === 'text') {
            const sentences = block.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            return sentences.length > 3;
        }
        return false;
    });
}

function getTextBlockSentenceCounts(content: TranscendingContent): number[] {
    const allBlocks = getAllContentBlocks(content);
    return allBlocks
        .filter(block => block.type === 'text')
        .map(block => {
            const sentences = block.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            return sentences.length;
        });
}

function extractAllText(content: TranscendingContent): string {
    const allBlocks = getAllContentBlocks(content);
    const textParts: string[] = [];
    
    allBlocks.forEach(block => {
        switch (block.type) {
            case 'text':
            case 'callout':
                textParts.push(block.content);
                break;
            case 'quote':
                textParts.push(block.quote);
                break;
            case 'bullets':
                textParts.push(...block.items);
                break;
            case 'steps':
                block.items.forEach(step => {
                    textParts.push(step.title, step.content);
                });
                break;
        }
    });
    
    return textParts.join(' ');
}

/**
 * Validate level-appropriate content approach
 */
export function validateContentApproach(content: TranscendingContent, levelId: string): ContentValidationError[] {
    const errors: ContentValidationError[] = [];
    
    const levelCategory = LEVEL_CATEGORIES[levelId];
    if (!levelCategory) return errors;
    
    const expectedApproach = CONTENT_APPROACHES[levelCategory];
    const allText = extractAllText(content).toLowerCase();
    
    // Define approach-specific keywords
    const approachKeywords = {
        remove_blocks: ['remove', 'block', 'obstacle', 'barrier', 'limitation', 'mental', 'emotional'],
        stabilize_states: ['stabilize', 'maintain', 'sustain', 'spiritual', 'devotion', 'surrender'],
        transcend_positions: ['transcend', 'beyond', 'non-dual', 'position', 'ultimate', 'absolute']
    };
    
    const expectedKeywords = approachKeywords[expectedApproach];
    const keywordMatches = expectedKeywords.filter(keyword => allText.includes(keyword));
    
    if (keywordMatches.length < 2) {
        errors.push({
            level: levelId,
            section: 'corePattern',
            type: 'content_violation',
            message: `Content approach should focus on "${expectedApproach}" for ${levelCategory} levels`,
            details: { expectedApproach, levelCategory, keywordMatches }
        });
    }
    
    return errors;
}

/**
 * Check RichContent rendering compatibility
 */
export function validateRenderingCompatibility(content: TranscendingContent): ContentValidationError[] {
    const errors: ContentValidationError[] = [];
    const allBlocks = getAllContentBlocks(content);
    
    // Check for valid ContentBlock types
    const validTypes = ['text', 'callout', 'bullets', 'steps', 'quote'];
    const invalidBlocks = allBlocks.filter(block => !validTypes.includes(block.type));
    
    if (invalidBlocks.length > 0) {
        errors.push({
            level: 'unknown',
            section: 'corePattern',
            type: 'invalid_structure',
            message: `Invalid ContentBlock types found: ${invalidBlocks.map(b => b.type).join(', ')}`
        });
    }
    
    // Check callout variants
    const calloutBlocks = allBlocks.filter(block => block.type === 'callout');
    const validVariants = ['insight', 'example', 'warning', 'tip'];
    const invalidCallouts = calloutBlocks.filter(block => 
        block.type === 'callout' && !validVariants.includes(block.variant)
    );
    
    if (invalidCallouts.length > 0) {
        errors.push({
            level: 'unknown',
            section: 'corePattern',
            type: 'invalid_structure',
            message: `Invalid callout variants found. Valid variants: ${validVariants.join(', ')}`
        });
    }
    
    return errors;
}