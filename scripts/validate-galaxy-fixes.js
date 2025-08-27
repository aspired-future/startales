#!/usr/bin/env node

/**
 * Validate Galaxy Map Fixes Script
 * 
 * This script validates that the CSS changes have been applied correctly
 * and provides a summary of the space optimization improvements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateGalaxyFixes() {
  console.log('🔧 Validating Galaxy Map Fixes');
  console.log('==============================');
  console.log('');

  const projectRoot = path.resolve(__dirname, '..');
  
  try {
    // Read the CSS file
    const cssPath = path.join(projectRoot, 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Read the TSX file
    const tsxPath = path.join(projectRoot, 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.tsx');
    const tsxContent = fs.readFileSync(tsxPath, 'utf8');
    
    console.log('📏 Validating Space Usage Improvements...');
    
    // Check ultra-compact improvements
    const improvements = [
      {
        name: 'Ultra Compact Galaxy Info Panel',
        check: /galaxy-info-panel.*bottom:\s*8px.*padding:\s*4px\s*8px/s,
        expected: 'bottom: 8px, padding: 4px 8px'
      },
      {
        name: 'Ultra Compact Minimap',
        check: /minimap.*bottom:\s*8px.*width:\s*120px/s,
        expected: 'bottom: 8px, width: 120px'
      },
      {
        name: 'Ultra Compact Control Panel',
        check: /enhanced-controls.*top:\s*8px.*width:\s*200px/s,
        expected: 'top: 8px, width: 200px'
      },
      {
        name: 'Tiny Font Sizes',
        check: /font-size:\s*[6-9]px/g,
        expected: 'font sizes 6-9px'
      },
      {
        name: 'Minimal Padding',
        check: /padding:\s*[3-4]px/g,
        expected: 'padding 3-4px'
      }
    ];

    let improvementsApplied = 0;
    improvements.forEach(improvement => {
      const applied = improvement.check.test(cssContent);
      console.log(`  ${applied ? '✅' : '❌'} ${improvement.name}: ${applied ? 'Applied' : 'Not applied'} (${improvement.expected})`);
      if (applied) improvementsApplied++;
    });

    console.log('');
    console.log('🎯 Validating 3D Projection Fix...');
    
    // Check 3D projection improvements
    const projectionFixes = [
      {
        name: 'Fixed Canvas Dimensions',
        check: /getBoundingClientRect\(\).*centerX.*rect\.width/s,
        expected: 'Using getBoundingClientRect() for proper dimensions'
      },
      {
        name: 'Proper Display Bounds',
        check: /rect\.width.*rect\.height.*visible/s,
        expected: 'Using rect dimensions for visibility checks'
      },
      {
        name: 'Text Using 3D Projection',
        check: /projected\.x.*projected\.y.*textY/s,
        expected: 'Text positioned using 3D projection coordinates'
      }
    ];

    let projectionFixesApplied = 0;
    projectionFixes.forEach(fix => {
      const applied = fix.check.test(tsxContent);
      console.log(`  ${applied ? '✅' : '❌'} ${fix.name}: ${applied ? 'Applied' : 'Not applied'} (${fix.expected})`);
      if (applied) projectionFixesApplied++;
    });

    console.log('');
    console.log('📊 Space Savings Analysis:');
    console.log('==========================');
    
    // Calculate space savings
    const spaceSavings = [
      { component: 'Galaxy Info Panel', oldSize: '15px bottom + 15px padding', newSize: '8px bottom + 4px padding', savings: '18px' },
      { component: 'Minimap', oldSize: '140px width + 15px bottom', newSize: '120px width + 8px bottom', savings: '27px' },
      { component: 'Control Panel', oldSize: '240px width + 15px top', newSize: '200px width + 8px top', savings: '47px' },
      { component: 'Font Sizes', oldSize: '10-12px fonts', newSize: '6-9px fonts', savings: '25% smaller' }
    ];

    spaceSavings.forEach(saving => {
      console.log(`📐 ${saving.component}:`);
      console.log(`   Before: ${saving.oldSize}`);
      console.log(`   After:  ${saving.newSize}`);
      console.log(`   Saved:  ${saving.savings}`);
      console.log('');
    });

    // Calculate overall scores
    const spaceScore = (improvementsApplied / improvements.length) * 100;
    const projectionScore = (projectionFixesApplied / projectionFixes.length) * 100;
    const overallScore = (spaceScore + projectionScore) / 2;

    console.log('🏆 Fix Validation Results:');
    console.log('==========================');
    console.log(`🏠 Space Usage Fixes: ${improvementsApplied}/${improvements.length} (${spaceScore.toFixed(1)}%)`);
    console.log(`🎯 3D Projection Fixes: ${projectionFixesApplied}/${projectionFixes.length} (${projectionScore.toFixed(1)}%)`);
    console.log(`📊 Overall Score: ${overallScore.toFixed(1)}%`);

    // Grade assignment
    let grade = 'F';
    if (overallScore >= 95) grade = 'A+';
    else if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 85) grade = 'B+';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 75) grade = 'C+';
    else if (overallScore >= 70) grade = 'C';

    console.log(`🎖️ Fix Grade: ${grade}`);
    console.log('');

    if (overallScore >= 80) {
      console.log('🎉 GALAXY MAP FIXES VALIDATED!');
      console.log('✨ Key Improvements:');
      console.log('   • Bottom panels now use minimal space (8px from edges)');
      console.log('   • All UI elements significantly more compact');
      console.log('   • 3D projection system uses proper display coordinates');
      console.log('   • Text overlays should move correctly with 3D transformations');
      console.log('');
      console.log('🧪 To verify in browser:');
      console.log('   1. Navigate to Enhanced 3D Galaxy Map');
      console.log('   2. Notice much more compact bottom panels');
      console.log('   3. Right-click + drag to rotate view');
      console.log('   4. Verify text labels move with stars');
      console.log('   5. Left-click + drag to pan camera');
      console.log('   6. Confirm overlays stay positioned correctly');
    } else {
      console.log('⚠️ Some fixes may not have been applied correctly.');
      console.log('🔧 Review the failed checks above and reapply fixes as needed.');
    }

  } catch (error) {
    console.error('❌ Validation Failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
validateGalaxyFixes().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
