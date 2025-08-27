#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING UI FIXES...\n');

const scorePath = 'src/ui_frontend/components/GameHUD/ScoreDisplay.tsx';
const hudPath = 'src/ui_frontend/components/GameHUD/ComprehensiveHUD.tsx';

try {
  // Test Score Display fixes
  const scoreContent = fs.readFileSync(scorePath, 'utf8');
  
  console.log('✅ SCORE DISPLAY LAYOUT FIXES:');
  
  // Check 1: Reduced padding
  const hasReducedPadding = scoreContent.includes('padding: 4px 12px');
  console.log(`   ${hasReducedPadding ? '✅' : '❌'} Reduced padding: ${hasReducedPadding}`);
  
  // Check 2: Max height constraint
  const hasMaxHeight = scoreContent.includes('max-height: 50px');
  console.log(`   ${hasMaxHeight ? '✅' : '❌'} Max height constraint: ${hasMaxHeight}`);
  
  // Check 3: Flex shrink
  const hasFlexShrink = scoreContent.includes('flex-shrink: 0');
  console.log(`   ${hasFlexShrink ? '✅' : '❌'} Flex shrink prevention: ${hasFlexShrink}`);
  
  // Check 4: Smaller font sizes
  const hasSmallerFonts = scoreContent.includes('font-size: 16px') && scoreContent.includes('font-size: 14px');
  console.log(`   ${hasSmallerFonts ? '✅' : '❌'} Reduced font sizes: ${hasSmallerFonts}`);
  
  // Check 5: Smaller experience bar
  const hasSmallerBar = scoreContent.includes('height: 4px');
  console.log(`   ${hasSmallerBar ? '✅' : '❌'} Smaller experience bar: ${hasSmallerBar}`);
  
  // Test Campaign Wizard integration fixes
  const hudContent = fs.readFileSync(hudPath, 'utf8');
  
  console.log('\n✅ CAMPAIGN WIZARD INTEGRATION FIXES:');
  
  // Check 6: Correct onCancel prop
  const hasOnCancel = hudContent.includes('onCancel={() => setIsCampaignWizardOpen(false)}');
  console.log(`   ${hasOnCancel ? '✅' : '❌'} Correct onCancel prop: ${hasOnCancel}`);
  
  // Check 7: Correct onComplete prop
  const hasOnComplete = hudContent.includes('onComplete={(config) => {');
  console.log(`   ${hasOnComplete ? '✅' : '❌'} Correct onComplete prop: ${hasOnComplete}`);
  
  // Check 8: Campaign wizard overlay
  const hasOverlay = hudContent.includes('campaign-wizard-overlay');
  console.log(`   ${hasOverlay ? '✅' : '❌'} Campaign wizard overlay: ${hasOverlay}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Score display fits within header without breaking layout');
  console.log('   • Score display is more compact with smaller fonts');
  console.log('   • New Game button opens Campaign Wizard properly');
  console.log('   • Campaign Wizard has proper close/complete handlers');
  console.log('   • Campaign Wizard appears in full-screen overlay');
  
  const allChecks = [
    hasReducedPadding,
    hasMaxHeight,
    hasFlexShrink,
    hasSmallerFonts,
    hasSmallerBar,
    hasOnCancel,
    hasOnComplete,
    hasOverlay
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL UI FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('🚀 Ready to test: Compact score display and working Campaign Wizard');
  } else {
    console.log('⚠️  Some UI fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
