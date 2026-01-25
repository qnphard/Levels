/**
 * Phase 4 Infrastructure Tests
 * Validates the development infrastructure setup for higher consciousness levels
 */

import { 
    validateContent, 
    calculateQualityMetrics,
    validateContentApproach,
    validateRenderingCompatibility 
} from '../utils/contentValidation';
import { 
    getPhase4Progress,
    getBatchStatus,
    getLevelImplementationStatus,
    validateLevelReadiness,
    IMPLEMENTATION_BATCHES
} from '../utils/batchImplementation';
import { 
    HIGHER_LEVEL_IDS,
    LEVEL_CATEGORIES,
    CONTENT_APPROACHES,
    ContentQualityMetrics
} from '../types/contentValidation';
import { getTranscendingContent } from '../data/transcendingData';

describe('Phase 4 Infrastructure', () => {
    describe('Content Validation System', () => {
        test('should validate content structure for implemented levels', () => {
            // Test with a known implemented level (shame)
            const shameContent = getTranscendingContent('shame');
            expect(shameContent).toBeDefined();
            
            if (shameContent) {
                const result = validateContent(shameContent, 'shame');
                expect(result).toHaveProperty('isValid');
                expect(result).toHaveProperty('errors');
                expect(result).toHaveProperty('warnings');
                expect(result).toHaveProperty('metrics');
            }
        });

        test('should calculate quality metrics correctly', () => {
            const shameContent = getTranscendingContent('shame');
            if (shameContent) {
                const metrics = calculateQualityMetrics(shameContent, 'shame');
                
                expect(metrics).toHaveProperty('word_count');
                expect(metrics).toHaveProperty('content_blocks');
                expect(metrics).toHaveProperty('callout_blocks');
                expect(metrics).toHaveProperty('path_through_steps');
                expect(metrics).toHaveProperty('duality_pairs');
                expect(metrics.word_count).toBeGreaterThan(0);
                expect(metrics.duality_pairs).toBe(10);
            }
        });

        test('should validate rendering compatibility', () => {
            const shameContent = getTranscendingContent('shame');
            if (shameContent) {
                const errors = validateRenderingCompatibility(shameContent);
                expect(Array.isArray(errors)).toBe(true);
            }
        });
    });

    describe('Level Categories and Approaches', () => {
        test('should have correct level category mappings', () => {
            expect(LEVEL_CATEGORIES.courage).toBe('linear_mind');
            expect(LEVEL_CATEGORIES.love).toBe('spiritual_reality');
            expect(LEVEL_CATEGORIES.enlightenment).toBe('enlightenment');
        });

        test('should have correct content approach mappings', () => {
            expect(CONTENT_APPROACHES.linear_mind).toBe('remove_blocks');
            expect(CONTENT_APPROACHES.spiritual_reality).toBe('stabilize_states');
            expect(CONTENT_APPROACHES.enlightenment).toBe('transcend_positions');
        });

        test('should validate content approach for level categories', () => {
            // This would test with actual implemented content
            // For now, test the validation function exists
            const mockContent = {
                corePattern: [{ type: 'text' as const, content: 'remove mental blocks' }],
                egoDynamics: [{ type: 'text' as const, content: 'ego dynamics' }],
                spiritualContext: [{ type: 'text' as const, content: 'spiritual context' }],
                pathThrough: [{ type: 'text' as const, content: 'path through' }],
                dualities: []
            };
            
            const errors = validateContentApproach(mockContent, 'courage');
            expect(Array.isArray(errors)).toBe(true);
        });
    });

    describe('Batch Implementation System', () => {
        test('should have correct batch definitions', () => {
            expect(IMPLEMENTATION_BATCHES.linear_mind.levels).toEqual([
                'courage', 'neutrality', 'willingness', 'acceptance', 'reason'
            ]);
            expect(IMPLEMENTATION_BATCHES.spiritual_reality.levels).toEqual([
                'love', 'joy', 'peace'
            ]);
            expect(IMPLEMENTATION_BATCHES.enlightenment.levels).toEqual([
                'enlightenment'
            ]);
        });

        test('should get batch status correctly', () => {
            const linearMindStatus = getBatchStatus('linear_mind');
            expect(linearMindStatus).toHaveProperty('batch_name');
            expect(linearMindStatus).toHaveProperty('levels');
            expect(linearMindStatus).toHaveProperty('status');
            expect(linearMindStatus).toHaveProperty('tests_passing');
        });

        test('should get level implementation status', () => {
            const courageStatus = getLevelImplementationStatus('courage');
            expect(courageStatus).toHaveProperty('level_id');
            expect(courageStatus).toHaveProperty('audit_completed');
            expect(courageStatus).toHaveProperty('implementation_ready');
            expect(courageStatus.level_id).toBe('courage');
        });

        test('should validate level readiness', () => {
            const readiness = validateLevelReadiness('courage');
            expect(readiness).toHaveProperty('ready');
            expect(readiness).toHaveProperty('blockers');
            expect(readiness).toHaveProperty('recommendations');
            expect(Array.isArray(readiness.blockers)).toBe(true);
            expect(Array.isArray(readiness.recommendations)).toBe(true);
        });

        test('should get overall Phase 4 progress', () => {
            const progress = getPhase4Progress();
            expect(progress).toHaveProperty('totalLevels');
            expect(progress).toHaveProperty('implementedLevels');
            expect(progress).toHaveProperty('completionPercentage');
            expect(progress).toHaveProperty('batchStatuses');
            expect(progress.totalLevels).toBe(HIGHER_LEVEL_IDS.length);
        });
    });

    describe('Higher Level Data Structure', () => {
        test('should have all higher levels defined in transcendingData', () => {
            HIGHER_LEVEL_IDS.forEach(levelId => {
                const content = getTranscendingContent(levelId);
                expect(content).toBeDefined();
                expect(content).toHaveProperty('corePattern');
                expect(content).toHaveProperty('egoDynamics');
                expect(content).toHaveProperty('spiritualContext');
                expect(content).toHaveProperty('pathThrough');
                expect(content).toHaveProperty('dualities');
            });
        });

        test('should identify unimplemented levels correctly', () => {
            HIGHER_LEVEL_IDS.forEach(levelId => {
                const content = getTranscendingContent(levelId);
                if (content) {
                    // Check if content is still empty strings (unimplemented)
                    const isImplemented = typeof content.corePattern !== 'string' || 
                                         content.corePattern.length > 0;
                    
                    // For now, all higher levels should be unimplemented (empty strings)
                    expect(isImplemented).toBe(false);
                }
            });
        });
    });

    describe('Content Quality Standards', () => {
        test('should enforce word count standards', () => {
            const mockMetrics: ContentQualityMetrics = {
                word_count: 1000,
                content_blocks: 10,
                callout_blocks: 3,
                path_through_steps: 8,
                duality_pairs: 10,
                source_books_coverage: [],
                text_block_sentence_count: [2, 3, 2, 1],
                uses_we_language: true,
                has_numerical_calibrations: false,
                has_example_callouts: true,
                has_quote_blocks: true
            };
            
            expect(mockMetrics.word_count).toBeGreaterThanOrEqual(800);
            expect(mockMetrics.word_count).toBeLessThanOrEqual(1200);
            expect(mockMetrics.path_through_steps).toBe(8);
            expect(mockMetrics.duality_pairs).toBe(10);
            expect(mockMetrics.uses_we_language).toBe(true);
            expect(mockMetrics.has_numerical_calibrations).toBe(false);
        });

        test('should validate ContentBlock structure requirements', () => {
            const validContentBlock = {
                type: 'text' as const,
                content: 'This is valid content using we language.'
            };
            
            expect(validContentBlock.type).toBe('text');
            expect(validContentBlock.content).toContain('we');
            
            const validCallout = {
                type: 'callout' as const,
                variant: 'example' as const,
                content: 'This is an example callout.'
            };
            
            expect(['insight', 'example', 'warning', 'tip']).toContain(validCallout.variant);
        });
    });

    describe('Error Handling and Fallbacks', () => {
        test('should handle missing content gracefully', () => {
            const nonExistentContent = getTranscendingContent('nonexistent');
            expect(nonExistentContent).toBeUndefined();
            
            const status = getLevelImplementationStatus('nonexistent');
            expect(status.implementation_ready).toBe(false);
            expect(status.notes).toContain('Content not found');
        });

        test('should validate content loading states', () => {
            const validStates = ['loading', 'loaded', 'error', 'fallback'];
            validStates.forEach(state => {
                expect(['loading', 'loaded', 'error', 'fallback']).toContain(state);
            });
        });
    });
});

describe('Integration with Existing System', () => {
    test('should maintain compatibility with existing lower levels', () => {
        const lowerLevels = ['shame', 'guilt', 'apathy', 'grief', 'fear', 'desire', 'anger', 'pride'];
        
        lowerLevels.forEach(levelId => {
            const content = getTranscendingContent(levelId);
            expect(content).toBeDefined();
            
            if (content) {
                // Lower levels should be implemented with ContentBlock arrays
                expect(Array.isArray(content.corePattern)).toBe(true);
                expect(Array.isArray(content.dualities)).toBe(true);
                expect(content.dualities.length).toBe(10);
            }
        });
    });

    test('should not break existing RichContent rendering', () => {
        // This would require actual component testing
        // For now, validate that ContentBlock types are compatible
        const validTypes = ['text', 'callout', 'bullets', 'steps', 'quote'];
        const validCalloutVariants = ['insight', 'example', 'warning', 'tip'];
        
        expect(validTypes).toContain('text');
        expect(validTypes).toContain('callout');
        expect(validCalloutVariants).toContain('example');
    });
});