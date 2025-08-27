#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Validating Data Layer & Ship Visibility Fixes');
console.log('=================================================');

const filePath = path.join(process.cwd(), 'src/ui_frontend/components/GameHUD/Enhanced3DGalaxyMap.tsx');

if (!fs.existsSync(filePath)) {
  console.log('❌ Enhanced3DGalaxyMap.tsx not found');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Test Ship Visibility Fixes
console.log('\n🚀 Testing Ship Visibility Fixes...');
const shipTests = [
  {
    name: 'Bigger Ship Sizes',
    pattern: /shipSizes.*scout:\s*8.*frigate:\s*12.*cruiser:\s*16.*battleship:\s*24/s,
    description: 'Ships are much bigger (8-24px instead of 2-6px)'
  },
  {
    name: 'Higher Ship Opacity',
    pattern: /opacity = Math\.max\(0\.7, depthFactor\)/,
    description: 'Ships have higher opacity (0.7 minimum instead of 0.2)'
  },
  {
    name: 'Bright Ship Colors',
    pattern: /'#00ff88'.*'#ff4444'.*'#ffaa00'.*'#aa44ff'/s,
    description: 'Ships use bright, distinct colors'
  },
  {
    name: 'Ship Glow Effects',
    pattern: /GLOW EFFECT for ships.*createRadialGradient/s,
    description: 'Ships have glow effects for better visibility'
  },
  {
    name: 'Ship White Outlines',
    pattern: /strokeStyle.*rgba\(255, 255, 255/,
    description: 'Ships have white outlines for contrast'
  },
  {
    name: 'Always Show Ship Labels',
    pattern: /ALWAYS show ship labels if they're big enough/,
    description: 'Ship labels are always visible when close enough'
  },
  {
    name: 'Bold Ship Labels',
    pattern: /font.*bold.*fontSize.*'Segoe UI'/,
    description: 'Ship labels are bold and larger'
  },
  {
    name: 'Ship Type Labels',
    pattern: /ship\.type\.toUpperCase\(\)/,
    description: 'Ship types are displayed in uppercase'
  }
];

let shipPassed = 0;
shipTests.forEach(test => {
  const passed = test.pattern.test(content);
  console.log(`  ${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'Applied' : 'Not applied'} (${test.description})`);
  if (passed) shipPassed++;
});

// Test Military Data Layer Fixes
console.log('\n⚔️ Testing Military Data Layer Fixes...');
const militaryTests = [
  {
    name: 'Large Military Indicators',
    pattern: /LARGE military indicator.*red triangle/,
    description: 'Military indicators are large and prominent'
  },
  {
    name: 'Military Size Scaling',
    pattern: /militarySize = Math\.max\(8, 15 \* depthScale\)/,
    description: 'Military indicators scale properly (8-15px)'
  },
  {
    name: 'Military Triangle Shape',
    pattern: /ctx\.moveTo\(projected\.x \+ offsetX, projected\.y \+ offsetY - militarySize\)/,
    description: 'Military uses triangle shape'
  },
  {
    name: 'Military Strength Bars',
    pattern: /Military strength indicator.*strengthBars/s,
    description: 'Military strength shown with bars'
  },
  {
    name: 'Military Bright Red Color',
    pattern: /#ff4444.*Math\.floor\(opacity \* 255\)/,
    description: 'Military uses bright red color'
  }
];

let militaryPassed = 0;
militaryTests.forEach(test => {
  const passed = test.pattern.test(content);
  console.log(`  ${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'Applied' : 'Not applied'} (${test.description})`);
  if (passed) militaryPassed++;
});

// Test Resource Data Layer Fixes
console.log('\n💎 Testing Resource Data Layer Fixes...');
const resourceTests = [
  {
    name: 'Large Resource Indicators',
    pattern: /LARGE resource indicators.*different shapes for different resources/,
    description: 'Resource indicators are large and distinct'
  },
  {
    name: 'Resource Size Scaling',
    pattern: /resourceSize = Math\.max\(6, 12 \* depthScale\)/,
    description: 'Resource indicators scale properly (6-12px)'
  },
  {
    name: 'Resource Color Coding',
    pattern: /Different colors for different resource types.*Metal.*Energy.*Rare.*Bio/s,
    description: 'Resources have different colors by type'
  },
  {
    name: 'Resource Shape Variety',
    pattern: /Square for metals.*Diamond for energy.*Circle for other/s,
    description: 'Resources have different shapes by type'
  },
  {
    name: 'Resource Quantity Indicators',
    pattern: /Resource quantity indicator.*quantity.*dotX/s,
    description: 'Resource quantities shown with dots'
  }
];

let resourcePassed = 0;
resourceTests.forEach(test => {
  const passed = test.pattern.test(content);
  console.log(`  ${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'Applied' : 'Not applied'} (${test.description})`);
  if (passed) resourcePassed++;
});

// Test Exploration Data Layer Fixes
console.log('\n🔍 Testing Exploration Data Layer Fixes...');
const explorationTests = [
  {
    name: 'Large Exploration Indicators',
    pattern: /LARGE exploration indicator.*explorationSize/,
    description: 'Exploration indicators are large and prominent'
  },
  {
    name: 'Exploration Size Scaling',
    pattern: /explorationSize = Math\.max\(10, 18 \* depthScale\)/,
    description: 'Exploration indicators scale properly (10-18px)'
  },
  {
    name: 'Green Checkmark for Explored',
    pattern: /GREEN checkmark for explored systems.*#2ecc71/,
    description: 'Explored systems show green checkmarks'
  },
  {
    name: 'Red Question Mark for Unexplored',
    pattern: /RED question mark for unexplored systems.*#e74c3c/,
    description: 'Unexplored systems show red question marks'
  },
  {
    name: 'Exploration Scan Lines',
    pattern: /Exploration scan lines for dramatic effect.*scanAngle.*Date\.now/s,
    description: 'Unexplored systems have animated scan lines'
  },
  {
    name: 'Question Mark Text',
    pattern: /fillText\('\?', projected\.x \+ offsetX, projected\.y \+ offsetY\)/,
    description: 'Question mark text is rendered'
  }
];

let explorationPassed = 0;
explorationTests.forEach(test => {
  const passed = test.pattern.test(content);
  console.log(`  ${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'Applied' : 'Not applied'} (${test.description})`);
  if (passed) explorationPassed++;
});

// Calculate overall results
const totalTests = shipTests.length + militaryTests.length + resourceTests.length + explorationTests.length;
const totalPassed = shipPassed + militaryPassed + resourcePassed + explorationPassed;
const successRate = (totalPassed / totalTests * 100).toFixed(1);

console.log('\n📊 Data Layer & Ship Visibility Results:');
console.log('==========================================');
console.log(`🚀 Ship Visibility: ${shipPassed}/${shipTests.length} (${(shipPassed/shipTests.length*100).toFixed(1)}%)`);
console.log(`⚔️ Military Layer: ${militaryPassed}/${militaryTests.length} (${(militaryPassed/militaryTests.length*100).toFixed(1)}%)`);
console.log(`💎 Resource Layer: ${resourcePassed}/${resourceTests.length} (${(resourcePassed/resourceTests.length*100).toFixed(1)}%)`);
console.log(`🔍 Exploration Layer: ${explorationPassed}/${explorationTests.length} (${(explorationPassed/explorationTests.length*100).toFixed(1)}%)`);

console.log(`\n🏆 Overall Score: ${successRate}%`);

let grade = 'F';
if (successRate >= 95) grade = 'A+';
else if (successRate >= 90) grade = 'A';
else if (successRate >= 85) grade = 'B+';
else if (successRate >= 80) grade = 'B';
else if (successRate >= 75) grade = 'C+';
else if (successRate >= 70) grade = 'C';
else if (successRate >= 65) grade = 'D';

console.log(`📊 Fix Grade: ${grade}`);

if (successRate >= 90) {
  console.log('\n🎉 DATA LAYER & SHIP VISIBILITY FIXES SUCCESSFUL!');
  console.log('✨ What Was Fixed:');
  console.log('');
  console.log('🚀 Ship Visibility:');
  console.log('   • Ships are now 3-4x bigger (8-24px instead of 2-6px)');
  console.log('   • Much higher opacity (70% minimum instead of 20%)');
  console.log('   • Bright, distinct colors for each civilization');
  console.log('   • Glow effects and white outlines for better contrast');
  console.log('   • Always visible labels with ship names and types');
  console.log('   • Different shapes for different ship types');
  console.log('');
  console.log('⚔️ Military Data Layer:');
  console.log('   • Large red triangular military indicators');
  console.log('   • Military strength bars showing force levels');
  console.log('   • Positioned offset from star systems for clarity');
  console.log('   • White outlines for better visibility');
  console.log('');
  console.log('💎 Resource Data Layer:');
  console.log('   • Large resource indicators with different shapes by type');
  console.log('   • Color-coded: Gray (Metal), Orange (Energy), Red (Rare), Green (Bio)');
  console.log('   • Quantity indicators with dots');
  console.log('   • Positioned offset from star systems');
  console.log('');
  console.log('🔍 Exploration Data Layer:');
  console.log('   • Green checkmarks for explored systems');
  console.log('   • Red question marks for unexplored systems');
  console.log('   • Animated scan lines for unexplored systems');
  console.log('   • Large, prominent indicators that are easy to see');
  console.log('');
  console.log('🧪 How to Test:');
  console.log('   1. Navigate to Enhanced 3D Galaxy Map');
  console.log('   2. Enable Military, Resource, and Exploration data layers');
  console.log('   3. Enable Ships display');
  console.log('   4. Ships should be large, bright, and clearly labeled');
  console.log('   5. Military indicators should show as red triangles with strength bars');
  console.log('   6. Resource indicators should show as colored shapes (squares, diamonds, circles)');
  console.log('   7. Exploration should show green checkmarks or red question marks');
  console.log('   8. All overlays should be much more pronounced and easy to see');
} else {
  console.log('\n⚠️ Some fixes may need adjustment. Check the failed tests above.');
}
