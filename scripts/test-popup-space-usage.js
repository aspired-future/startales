#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING POPUP SPACE USAGE...\n');

const mapPopupPath = 'src/ui_frontend/components/GameHUD/screens/MapPopup.tsx';

try {
  const content = fs.readFileSync(mapPopupPath, 'utf8');
  
  console.log('✅ POPUP SPACE MAXIMIZATION CHECKS:');
  
  // Check 1: Overrides popup-content padding
  const overridesPadding = content.includes(':global(.popup-content)') && content.includes('padding: 0 !important');
  console.log(`   ${overridesPadding ? '✅' : '❌'} Overrides popup padding: ${overridesPadding}`);
  
  // Check 2: Sets overflow hidden
  const setsOverflowHidden = content.includes('overflow: hidden !important');
  console.log(`   ${setsOverflowHidden ? '✅' : '❌'} Sets overflow hidden: ${setsOverflowHidden}`);
  
  // Check 3: Map content uses full dimensions
  const usesFullDimensions = content.includes('height: 100%') && content.includes('width: 100%');
  console.log(`   ${usesFullDimensions ? '✅' : '❌'} Uses full dimensions: ${usesFullDimensions}`);
  
  // Check 4: Galaxy map positioned absolutely
  const absolutePositioning = content.includes('position: absolute !important');
  console.log(`   ${absolutePositioning ? '✅' : '❌'} Uses absolute positioning: ${absolutePositioning}`);
  
  // Check 5: Galaxy map fills container
  const fillsContainer = content.includes('top: 0 !important') && content.includes('left: 0 !important');
  console.log(`   ${fillsContainer ? '✅' : '❌'} Fills container completely: ${fillsContainer}`);
  
  // Check 6: Still uses PopupBase
  const usesPopupBase = content.includes('<PopupBase');
  console.log(`   ${usesPopupBase ? '✅' : '❌'} Still uses PopupBase: ${usesPopupBase}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Map fills entire popup content area (no padding)');
  console.log('   • No wasted space around the map');
  console.log('   • Galaxy map touches all edges of content area');
  console.log('   • Still maintains popup header and close button');
  console.log('   • Consistent popup template with maximized content');
  
  const allChecks = [
    overridesPadding,
    setsOverflowHidden,
    usesFullDimensions,
    absolutePositioning,
    fillsContainer,
    usesPopupBase
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 MAP NOW USES FULL POPUP SPACE!');
  } else {
    console.log('⚠️  Some space optimization issues may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading MapPopup.tsx:', error.message);
}
