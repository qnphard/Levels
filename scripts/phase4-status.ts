#!/usr/bin/env ts-node

/**
 * Phase 4 Implementation Status CLI
 * Provides quick overview of implementation progress
 */

import { 
    getPhase4Progress, 
    generateBatchReport, 
    validateLevelReadiness,
    IMPLEMENTATION_BATCHES,
    BatchName 
} from '../src/utils/batchImplementation';

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'overview':
        case undefined:
            showOverview();
            break;
        case 'batch':
            showBatchReport(args[1] as BatchName);
            break;
        case 'level':
            showLevelStatus(args[1]);
            break;
        case 'next':
            showNextRecommendation();
            break;
        default:
            showHelp();
    }
}

function showOverview() {
    console.log('🚀 Phase 4 Implementation Status\n');
    
    const progress = getPhase4Progress();
    
    console.log(`📊 Overall Progress: ${progress.implementedLevels}/${progress.totalLevels} levels (${progress.completionPercentage}%)`);
    console.log('');
    
    // Show batch statuses
    Object.entries(progress.batchStatuses).forEach(([batchName, status]) => {
        const emoji = getStatusEmoji(status.status);
        console.log(`${emoji} ${status.batch_name}: ${status.status}`);
        console.log(`   ${status.notes}`);
    });
    
    if (progress.nextRecommendedLevel) {
        console.log(`\n🎯 Next recommended: ${progress.nextRecommendedLevel}`);
    } else {
        console.log('\n🎉 All levels implemented!');
    }
    
    console.log('\nCommands:');
    console.log('  npm run phase4:status batch <batch_name>  - Detailed batch report');
    console.log('  npm run phase4:status level <level_id>    - Level readiness check');
    console.log('  npm run phase4:status next               - Next implementation step');
}

function showBatchReport(batchName: BatchName) {
    if (!batchName || !IMPLEMENTATION_BATCHES[batchName]) {
        console.error('❌ Invalid batch name. Available batches:');
        Object.keys(IMPLEMENTATION_BATCHES).forEach(name => {
            console.log(`   - ${name}`);
        });
        return;
    }
    
    const report = generateBatchReport(batchName);
    console.log(report);
}

function showLevelStatus(levelId: string) {
    if (!levelId) {
        console.error('❌ Please specify a level ID');
        return;
    }
    
    console.log(`🔍 Level Readiness Check: ${levelId}\n`);
    
    const readiness = validateLevelReadiness(levelId);
    
    if (readiness.ready) {
        console.log('✅ Level is ready for implementation');
    } else {
        console.log('⏳ Level is not ready');
        
        if (readiness.blockers.length > 0) {
            console.log('\n🚫 Blockers:');
            readiness.blockers.forEach(blocker => {
                console.log(`   - ${blocker}`);
            });
        }
    }
    
    if (readiness.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        readiness.recommendations.forEach(rec => {
            console.log(`   - ${rec}`);
        });
    }
}

function showNextRecommendation() {
    const progress = getPhase4Progress();
    
    if (!progress.nextRecommendedLevel) {
        console.log('🎉 All levels are implemented!');
        return;
    }
    
    const levelId = progress.nextRecommendedLevel;
    console.log(`🎯 Next Recommended Level: ${levelId}\n`);
    
    // Find which batch this level belongs to
    const batch = Object.entries(IMPLEMENTATION_BATCHES).find(([_, batch]) => 
        batch.levels.includes(levelId)
    );
    
    if (batch) {
        const [batchName, batchInfo] = batch;
        console.log(`📦 Batch: ${batchInfo.name}`);
        console.log(`🎯 Focus: ${batchInfo.focus}`);
        console.log(`📝 Approach: ${batchInfo.approach}`);
    }
    
    console.log('\n📋 Next Steps:');
    console.log(`1. Create content audit: docs/level-audits/${levelId}-audit.md`);
    console.log(`2. Use template: docs/content-audit-template.md`);
    console.log(`3. Extract content from all 5 source books`);
    console.log(`4. Implement ContentBlock structure in transcendingData.ts`);
    console.log(`5. Run validation: npm run phase4:status level ${levelId}`);
    
    // Show readiness check
    const readiness = validateLevelReadiness(levelId);
    if (!readiness.ready && readiness.blockers.length > 0) {
        console.log('\n⚠️  Current blockers:');
        readiness.blockers.forEach(blocker => {
            console.log(`   - ${blocker}`);
        });
    }
}

function getStatusEmoji(status: string): string {
    switch (status) {
        case 'completed': return '✅';
        case 'in_progress': return '🔄';
        case 'testing': return '🧪';
        case 'not_started': return '⏳';
        default: return '❓';
    }
}

function showHelp() {
    console.log('Phase 4 Implementation Status CLI\n');
    console.log('Usage: npm run phase4:status [command] [args]\n');
    console.log('Commands:');
    console.log('  overview              Show overall implementation progress (default)');
    console.log('  batch <batch_name>    Show detailed batch report');
    console.log('  level <level_id>      Check level implementation readiness');
    console.log('  next                  Show next recommended implementation step');
    console.log('  help                  Show this help message\n');
    console.log('Available batches: linear_mind, spiritual_reality, enlightenment');
    console.log('Available levels: courage, neutrality, willingness, acceptance, reason, love, joy, peace, enlightenment');
}

if (require.main === module) {
    main();
}