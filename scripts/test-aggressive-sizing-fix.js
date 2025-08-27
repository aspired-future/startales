#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING AGGRESSIVE SIZING FIXES...\n');

const enhanced3DMapCssPath = 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.css';
const enhanced3DMapTsxPath = 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.tsx';

try {
  // Test CSS aggressive fixes
  const cssContent = fs.readFileSync(enhanced3DMapCssPath, 'utf8');
  
  console.log('✅ CSS AGGRESSIVE SIZING:');
  
  // Check 1: Important flags on container
  const hasImportantContainer = cssContent.includes('width: 100% !important') && 
                               cssContent.includes('height: 100% !important');
  console.log(`   ${hasImportantContainer ? '✅' : '❌'} Container !important flags: ${hasImportantContainer}`);
  
  // Check 2: Large minimum dimensions on container
  const hasLargeMinContainer = cssContent.includes('min-width: 800px !important') && 
                              cssContent.includes('min-height: 600px !important');
  console.log(`   ${hasLargeMinContainer ? '✅' : '❌'} Large container minimums (800x600): ${hasLargeMinContainer}`);
  
  // Check 3: Important flags on canvas
  const hasImportantCanvas = cssContent.includes('position: absolute !important') && 
                            cssContent.includes('display: block !important');
  console.log(`   ${hasImportantCanvas ? '✅' : '❌'} Canvas !important flags: ${hasImportantCanvas}`);
  
  // Check 4: Large minimum dimensions on canvas
  const hasLargeMinCanvas = cssContent.match(/\.enhanced-galaxy-canvas[\s\S]*?min-width: 800px !important/);
  console.log(`   ${hasLargeMinCanvas ? '✅' : '❌'} Large canvas minimums (800x600): ${!!hasLargeMinCanvas}`);
  
  // Test TypeScript aggressive fixes
  const tsxContent = fs.readFileSync(enhanced3DMapTsxPath, 'utf8');
  
  console.log('\n✅ TYPESCRIPT AGGRESSIVE SIZING:');
  
  // Check 5: Large minimum dimensions in code
  const hasLargeMinDimensions = tsxContent.includes('Math.max(rect.width, 800)') && 
                               tsxContent.includes('Math.max(rect.height, 600)');
  console.log(`   ${hasLargeMinDimensions ? '✅' : '❌'} Large minimum dimensions in code: ${hasLargeMinDimensions}`);
  
  // Check 6: Force canvas size function
  const hasForceCanvasSize = tsxContent.includes('forceCanvasSize') && 
                            tsxContent.includes('const minWidth = 800') &&
                            tsxContent.includes('const minHeight = 600');
  console.log(`   ${hasForceCanvasSize ? '✅' : '❌'} Force canvas size function: ${hasForceCanvasSize}`);
  
  // Check 7: Immediate forced sizing
  const hasImmediateForcing = tsxContent.includes('Force size immediately') && 
                             tsxContent.includes('forceCanvasSize();');
  console.log(`   ${hasImmediateForcing ? '✅' : '❌'} Immediate forced sizing: ${hasImmediateForcing}`);
  
  // Check 8: Forced sizing on visibility
  const hasForcedOnVisibility = tsxContent.includes('forceCanvasSize(); // Force size again');
  console.log(`   ${hasForcedOnVisibility ? '✅' : '❌'} Forced sizing on visibility: ${hasForcedOnVisibility}`);
  
  // Check 9: Forced sizing logging
  const hasForcedLogging = tsxContent.includes('FORCED canvas to minimum size');
  console.log(`   ${hasForcedLogging ? '✅' : '❌'} Forced sizing logging: ${hasForcedLogging}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Canvas is FORCED to 800x600 minimum immediately on mount');
  console.log('   • CSS !important flags override any conflicting styles');
  console.log('   • Large minimum dimensions prevent tiny map appearance');
  console.log('   • Forced sizing happens both on mount and visibility changes');
  console.log('   • Console shows "FORCED canvas to minimum size" messages');
  console.log('   • Map should appear large regardless of container issues');
  
  const allChecks = [
    hasImportantContainer,
    hasLargeMinContainer,
    hasImportantCanvas,
    !!hasLargeMinCanvas,
    hasLargeMinDimensions,
    hasForceCanvasSize,
    hasImmediateForcing,
    hasForcedOnVisibility,
    hasForcedLogging
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL AGGRESSIVE SIZING FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('💪 Map should now be FORCED to large size regardless of container issues');
    console.log('🔍 Watch console for "FORCED canvas to minimum size" messages');
  } else {
    console.log('⚠️  Some aggressive sizing fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
