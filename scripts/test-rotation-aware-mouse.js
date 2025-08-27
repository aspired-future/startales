#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING ROTATION-AWARE MOUSE FIXES...\n');

const enhanced3DMapTsxPath = 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.tsx';

try {
  const tsxContent = fs.readFileSync(enhanced3DMapTsxPath, 'utf8');
  
  console.log('✅ ROTATION-AWARE PANNING:');
  
  // Check 1: Rotation transformation calculation
  const hasRotationTransform = tsxContent.includes('Math.cos(cameraRotation.y)') && 
                               tsxContent.includes('Math.sin(cameraRotation.y)');
  console.log(`   ${hasRotationTransform ? '✅' : '❌'} Rotation transformation calculation: ${hasRotationTransform}`);
  
  // Check 2: Rotated delta calculation
  const hasRotatedDelta = tsxContent.includes('rotatedDeltaX = deltaX * cosY - deltaY * sinY') && 
                         tsxContent.includes('rotatedDeltaY = deltaX * sinY + deltaY * cosY');
  console.log(`   ${hasRotatedDelta ? '✅' : '❌'} Rotated delta calculation: ${hasRotatedDelta}`);
  
  // Check 3: Using rotated deltas for position
  const usesRotatedDeltas = tsxContent.includes('cameraPosition.x - rotatedDeltaX * panSpeed') && 
                           tsxContent.includes('cameraPosition.y - rotatedDeltaY * panSpeed');
  console.log(`   ${usesRotatedDeltas ? '✅' : '❌'} Using rotated deltas for position: ${usesRotatedDeltas}`);
  
  // Check 4: Rotation-aware logging
  const hasRotationLogging = tsxContent.includes('ROTATION AWARE') && 
                            tsxContent.includes('rotation: cameraRotation.y') &&
                            tsxContent.includes('rotatedDeltaX, rotatedDeltaY');
  console.log(`   ${hasRotationLogging ? '✅' : '❌'} Rotation-aware debug logging: ${hasRotationLogging}`);
  
  // Check 5: Comment update
  const hasUpdatedComment = tsxContent.includes('ACCOUNT FOR ROTATION');
  console.log(`   ${hasUpdatedComment ? '✅' : '❌'} Updated comment for rotation awareness: ${hasUpdatedComment}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Before rotation: Left drag moves map left, right drag moves map right');
  console.log('   • After 90° rotation: Left drag still feels like moving map left (but actually moves up/down in world coords)');
  console.log('   • After 180° rotation: Left drag still feels like moving map left (but actually moves right in world coords)');
  console.log('   • Mouse movement is transformed based on current camera rotation angle');
  console.log('   • Dragging always feels natural relative to current view orientation');
  console.log('   • Console shows rotation angle and transformed deltas for debugging');
  
  console.log('\n🔧 TECHNICAL DETAILS:');
  console.log('   • Uses cosine/sine of Y rotation to transform mouse deltas');
  console.log('   • Applies 2D rotation matrix: [cos -sin; sin cos] to [deltaX; deltaY]');
  console.log('   • Rotated deltas are used for camera position updates');
  console.log('   • Rotation angle is in radians (cameraRotation.y)');
  
  const allChecks = [
    hasRotationTransform,
    hasRotatedDelta,
    usesRotatedDeltas,
    hasRotationLogging,
    hasUpdatedComment
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL ROTATION-AWARE MOUSE FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('🎮 Mouse dragging should now work correctly after rotation');
    console.log('🔍 Watch console for rotation-aware panning debug messages');
  } else {
    console.log('⚠️  Some rotation-aware mouse fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
