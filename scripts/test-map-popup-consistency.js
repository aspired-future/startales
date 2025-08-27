#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING MAP POPUP CONSISTENCY...\n');

const mapPopupPath = 'src/ui_frontend/components/GameHUD/screens/MapPopup.tsx';

try {
  const content = fs.readFileSync(mapPopupPath, 'utf8');
  
  console.log('✅ POPUP CONSISTENCY CHECKS:');
  
  // Check 1: Uses PopupBase
  const usesPopupBase = content.includes('import { PopupBase') && content.includes('<PopupBase');
  console.log(`   ${usesPopupBase ? '✅' : '❌'} Uses PopupBase template: ${usesPopupBase}`);
  
  // Check 2: Has standard popup props
  const hasStandardProps = content.includes('title="Galaxy Map"') && content.includes('icon="🌌"');
  console.log(`   ${hasStandardProps ? '✅' : '❌'} Has standard popup props: ${hasStandardProps}`);
  
  // Check 3: Uses fullscreen size
  const usesFullscreenSize = content.includes('size="fullscreen"');
  console.log(`   ${usesFullscreenSize ? '✅' : '❌'} Uses fullscreen size: ${usesFullscreenSize}`);
  
  // Check 4: No custom fullscreen implementation
  const noCustomFullscreen = !content.includes('position: fixed') && !content.includes('100vw') && !content.includes('100vh');
  console.log(`   ${noCustomFullscreen ? '✅' : '❌'} No custom fullscreen code: ${noCustomFullscreen}`);
  
  // Check 5: Contains Enhanced3DGalaxyMap
  const hasGalaxyMap = content.includes('<Enhanced3DGalaxyMap');
  console.log(`   ${hasGalaxyMap ? '✅' : '❌'} Contains Enhanced3DGalaxyMap: ${hasGalaxyMap}`);
  
  // Check 6: Has proper content wrapper
  const hasContentWrapper = content.includes('map-popup-content');
  console.log(`   ${hasContentWrapper ? '✅' : '❌'} Has content wrapper: ${hasContentWrapper}`);
  
  // Check 7: No custom close button
  const noCustomCloseBtn = !content.includes('fullscreen-close-btn');
  console.log(`   ${noCustomCloseBtn ? '✅' : '❌'} Uses standard close button: ${noCustomCloseBtn}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Map opens in PopupBase template (95vw x 95vh)');
  console.log('   • Has standard popup header with title and close button');
  console.log('   • Uses same styling as other screens');
  console.log('   • Enhanced3DGalaxyMap fills available content area');
  console.log('   • Consistent with overall UI design');
  
  const allChecks = [
    usesPopupBase,
    hasStandardProps,
    usesFullscreenSize,
    noCustomFullscreen,
    hasGalaxyMap,
    hasContentWrapper,
    noCustomCloseBtn
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 MAP POPUP NOW CONSISTENT WITH OTHER SCREENS!');
  } else {
    console.log('⚠️  Some consistency issues may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading MapPopup.tsx:', error.message);
}
