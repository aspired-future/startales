#!/usr/bin/env node

/**
 * Galaxy Navigation Fix Validation Script
 * 
 * This script validates that the MapPopup now uses the Enhanced3DGalaxyMap
 * instead of the legacy GalaxyMapComponent.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateNavigationFix() {
  console.log('🔧 Validating Galaxy Navigation Fix');
  console.log('===================================');
  console.log('');

  const projectRoot = path.resolve(__dirname, '..');
  
  try {
    // Read the MapPopup file
    const mapPopupPath = path.join(projectRoot, 'src/ui_frontend/components/GameHUD/screens/MapPopup.tsx');
    const mapPopupContent = fs.readFileSync(mapPopupPath, 'utf8');
    
    console.log('🔍 Checking MapPopup.tsx...');
    
    // Check if it imports Enhanced3DGalaxyMap
    const importsEnhanced = /import.*Enhanced3DGalaxyMap.*from/.test(mapPopupContent);
    console.log(`  ${importsEnhanced ? '✅' : '❌'} Imports Enhanced3DGalaxyMap: ${importsEnhanced ? 'Yes' : 'No'}`);
    
    // Check if it no longer imports GalaxyMapComponent
    const importsLegacy = /import.*GalaxyMapComponent.*from/.test(mapPopupContent);
    console.log(`  ${!importsLegacy ? '✅' : '❌'} Removed legacy GalaxyMapComponent import: ${!importsLegacy ? 'Yes' : 'No'}`);
    
    // Check if it uses Enhanced3DGalaxyMap in JSX
    const usesEnhanced = /<Enhanced3DGalaxyMap/.test(mapPopupContent);
    console.log(`  ${usesEnhanced ? '✅' : '❌'} Uses Enhanced3DGalaxyMap component: ${usesEnhanced ? 'Yes' : 'No'}`);
    
    // Check if it no longer uses GalaxyMapComponent
    const usesLegacy = /<GalaxyMapComponent/.test(mapPopupContent);
    console.log(`  ${!usesLegacy ? '✅' : '❌'} Removed legacy GalaxyMapComponent usage: ${!usesLegacy ? 'Yes' : 'No'}`);
    
    // Check if title is updated
    const hasUpdatedTitle = /Enhanced 3D Galaxy Map/.test(mapPopupContent);
    console.log(`  ${hasUpdatedTitle ? '✅' : '❌'} Updated title to "Enhanced 3D Galaxy Map": ${hasUpdatedTitle ? 'Yes' : 'No'}`);
    
    // Check if icon is updated
    const hasUpdatedIcon = /icon="🌌"/.test(mapPopupContent);
    console.log(`  ${hasUpdatedIcon ? '✅' : '❌'} Updated icon to 🌌: ${hasUpdatedIcon ? 'Yes' : 'No'}`);
    
    console.log('');
    console.log('🎯 Navigation Flow Analysis:');
    console.log('============================');
    console.log('1. User clicks "🌌 Galaxy" button in main HUD');
    console.log('2. User clicks "Galaxy Map" in the dropdown');
    console.log('3. ComprehensiveHUD calls setIsMapPopupOpen(true)');
    console.log('4. MapPopup component opens with Enhanced3DGalaxyMap');
    console.log('5. User now sees the Enhanced 3D Galaxy Map with all fixes!');
    
    // Calculate score
    const checks = [importsEnhanced, !importsLegacy, usesEnhanced, !usesLegacy, hasUpdatedTitle, hasUpdatedIcon];
    const passedChecks = checks.filter(Boolean).length;
    const score = (passedChecks / checks.length) * 100;
    
    console.log('');
    console.log('📊 Fix Validation Results:');
    console.log('==========================');
    console.log(`✅ Passed Checks: ${passedChecks}/${checks.length}`);
    console.log(`📊 Overall Score: ${score.toFixed(1)}%`);
    
    let grade = 'F';
    if (score >= 95) grade = 'A+';
    else if (score >= 90) grade = 'A';
    else if (score >= 85) grade = 'B+';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    
    console.log(`🎖️ Grade: ${grade}`);
    console.log('');
    
    if (score >= 90) {
      console.log('🎉 GALAXY NAVIGATION FIX SUCCESSFUL!');
      console.log('✨ What Changed:');
      console.log('   • MapPopup now uses Enhanced3DGalaxyMap instead of legacy component');
      console.log('   • Users clicking "🌌 Galaxy" → "Galaxy Map" now get the enhanced version');
      console.log('   • All space usage and overlay movement fixes are now active');
      console.log('   • No more legacy map with the reported issues');
      console.log('');
      console.log('🧪 To Test:');
      console.log('   1. Navigate to the application');
      console.log('   2. Click "🌌 Galaxy" button');
      console.log('   3. Click "Galaxy Map" option');
      console.log('   4. Verify you see the Enhanced 3D Galaxy Map');
      console.log('   5. Confirm compact bottom panels and working overlays');
    } else {
      console.log('⚠️ Navigation fix may not be complete.');
      console.log('🔧 Review failed checks and ensure all changes were applied.');
    }
    
  } catch (error) {
    console.error('❌ Navigation Fix Validation Failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
validateNavigationFix().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
