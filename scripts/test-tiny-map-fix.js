#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING TINY MAP FIXES...\n');

const enhanced3DMapCssPath = 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.css';
const enhanced3DMapTsxPath = 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.tsx';

try {
  // Test 1: CSS height fix
  const cssContent = fs.readFileSync(enhanced3DMapCssPath, 'utf8');
  
  console.log('✅ CSS DIMENSION FIXES:');
  
  // Check 1: Height changed from 100vh to 100%
  const hasCorrectHeight = cssContent.includes('height: 100%; /* Fill container height */');
  const hasNoVhInMainClass = !cssContent.match(/\.enhanced-galaxy-map\s*\{[^}]*height:\s*100vh/s);
  console.log(`   ${hasCorrectHeight ? '✅' : '❌'} Container height fix (100% instead of 100vh): ${hasCorrectHeight}`);
  
  // Check 2: Canvas minimum dimensions
  const hasMinDimensions = cssContent.includes('min-width: 400px') && cssContent.includes('min-height: 300px');
  console.log(`   ${hasMinDimensions ? '✅' : '❌'} Canvas minimum dimensions: ${hasMinDimensions}`);
  
  // Test 2: TypeScript dimension handling
  const tsxContent = fs.readFileSync(enhanced3DMapTsxPath, 'utf8');
  
  console.log('\n✅ CANVAS DIMENSION HANDLING:');
  
  // Check 3: Small dimension detection
  const hasSmallDimensionCheck = tsxContent.includes('rect.width < 100 || rect.height < 100');
  console.log(`   ${hasSmallDimensionCheck ? '✅' : '❌'} Small dimension detection: ${hasSmallDimensionCheck}`);
  
  // Check 4: Minimum dimension enforcement
  const hasMinDimensionEnforcement = tsxContent.includes('Math.max(rect.width, 400)') && 
                                    tsxContent.includes('Math.max(rect.height, 300)');
  console.log(`   ${hasMinDimensionEnforcement ? '✅' : '❌'} Minimum dimension enforcement: ${hasMinDimensionEnforcement}`);
  
  // Check 5: Debug logging
  const hasDebugLogging = tsxContent.includes('console.warn') && tsxContent.includes('Canvas dimensions too small');
  console.log(`   ${hasDebugLogging ? '✅' : '❌'} Debug logging for small dimensions: ${hasDebugLogging}`);
  
  // Check 6: Actual dimensions usage
  const hasActualDimensionsUsage = tsxContent.includes('actualWidth') && tsxContent.includes('actualHeight');
  console.log(`   ${hasActualDimensionsUsage ? '✅' : '❌'} Actual dimensions usage in rendering: ${hasActualDimensionsUsage}`);
  
  // Check 7: Gradient calculation fix
  const hasGradientFix = tsxContent.includes('actualWidth / 2, actualHeight / 2');
  console.log(`   ${hasGradientFix ? '✅' : '❌'} Gradient calculation using actual dimensions: ${hasGradientFix}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Galaxy map fills the entire popup content area');
  console.log('   • Canvas has minimum 400x300 dimensions even if container is smaller');
  console.log('   • Debug warnings appear if canvas gets very small dimensions');
  console.log('   • Map renders properly with correct scaling and positioning');
  console.log('   • No tiny map in corner - full popup usage');
  
  const allChecks = [
    hasCorrectHeight && hasNoVhInMainClass,
    hasMinDimensions,
    hasSmallDimensionCheck,
    hasMinDimensionEnforcement,
    hasDebugLogging,
    hasActualDimensionsUsage,
    hasGradientFix
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL TINY MAP FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('🚀 Ready to test: Galaxy map should now fill the popup properly');
  } else {
    console.log('⚠️  Some tiny map fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
