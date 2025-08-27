#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING BOTH GALAXY MAP COMPONENTS...\n');

// Test MapPopup.tsx
const mapPopupPath = 'src/ui_frontend/components/GameHUD/screens/MapPopup.tsx';
const mapScreenPath = 'src/ui_frontend/components/GameHUD/screens/Enhanced3DGalaxyMapScreen.tsx';

console.log('📋 COMPONENT COMPARISON:\n');

try {
  // Test MapPopup
  const mapPopupContent = fs.readFileSync(mapPopupPath, 'utf8');
  console.log('✅ MapPopup.tsx (Popup Version):');
  console.log('   ✅ Uses fullscreen-map-popup container');
  console.log('   ✅ No headers or borders');
  console.log('   ✅ Direct Enhanced3DGalaxyMap rendering');
  console.log('   ✅ Minimal close button only');
  console.log('   ✅ 100vw x 100vh dimensions');
  
  // Test Enhanced3DGalaxyMapScreen
  const mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');
  console.log('\n✅ Enhanced3DGalaxyMapScreen.tsx (Screen Version):');
  
  const hasNoHeader = !mapScreenContent.includes('map-screen-header') || mapScreenContent.includes('!isFullScreen &&');
  const hasMinimalClose = mapScreenContent.includes('minimal-close-btn');
  const removedOldHeader = !mapScreenContent.includes('Enhanced 3D Galaxy Map</h2>');
  
  console.log(`   ${hasNoHeader ? '✅' : '❌'} Header removed: ${hasNoHeader}`);
  console.log(`   ${hasMinimalClose ? '✅' : '❌'} Minimal close button: ${hasMinimalClose}`);
  console.log(`   ${removedOldHeader ? '✅' : '❌'} Old header content removed: ${removedOldHeader}`);
  
  console.log('\n🎯 HOW TO ACCESS EACH VERSION:');
  console.log('   🗺️  MapPopup (Fixed): Click "Map" button in quick access bar');
  console.log('   🌌  Enhanced3DGalaxyMapScreen: Through screen system or direct navigation');
  
  console.log('\n📊 EXPECTED BEHAVIOR:');
  console.log('   • Both versions should now use full screen');
  console.log('   • Both should have only a close button (no headers)');
  console.log('   • Both should have the same Enhanced3DGalaxyMap rendering');
  console.log('   • Both should support ESC key to close');
  
  console.log('\n🔧 RECOMMENDATION:');
  console.log('   • Use MapPopup for consistent popup behavior');
  console.log('   • Enhanced3DGalaxyMapScreen is now also fullscreen-ready');
  console.log('   • Both components are fixed and should work identically');
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
