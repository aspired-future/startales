/**
 * Batch update script to add enhanced knob system to remaining APIs
 */

const fs = require('fs');
const path = require('path');

// List of APIs to update
const apisToUpdate = [
  'migration-apis.cjs',
  'policy-apis.cjs', 
  'witter-apis.cjs',
  'communication-apis.cjs',
  'galaxy-map-apis.cjs',
  'conquest-apis.cjs',
  'characters-apis.cjs',
  'game-state-apis.cjs',
  'other-apis.cjs',
  'military-apis.cjs'
];

const apiDir = path.join(__dirname, '../src/demo/apis');

function updateApiFile(filename) {
  const filePath = path.join(apiDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // 1. Add enhanced knob system import if not present
  if (!content.includes('enhanced-knob-system.cjs')) {
    const requireLines = content.match(/^const.*require.*\.cjs.*$/gm);
    if (requireLines && requireLines.length > 0) {
      const lastRequire = requireLines[requireLines.length - 1];
      const importLine = "const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');";
      content = content.replace(lastRequire, lastRequire + '\n' + importLine);
      updated = true;
    }
  }
  
  // 2. Convert knobs object to enhanced system
  const knobsRegex = /const\s+(\w+)Knobs\s*=\s*\{/;
  const knobsMatch = content.match(knobsRegex);
  
  if (knobsMatch) {
    const systemName = knobsMatch[1];
    const knobsObjectName = `${systemName}Knobs`;
    const knobsDataName = `${systemName}KnobsData`;
    
    // Replace knobs declaration
    content = content.replace(
      `const ${knobsObjectName} = {`,
      `const ${knobsDataName} = {`
    );
    
    // Find the end of the knobs object and add enhanced system
    const lastUpdatedRegex = new RegExp(`lastUpdated:\\s*Date\\.now\\(\\)\\s*\\};`, 'g');
    const lastUpdatedMatch = content.match(lastUpdatedRegex);
    
    if (lastUpdatedMatch) {
      const enhancedSystemCode = `
// Create enhanced knob system
const ${systemName}KnobSystem = new EnhancedKnobSystem(${knobsDataName});

// Backward compatibility - expose knobs directly
const ${knobsObjectName} = ${systemName}KnobSystem.knobs;`;
      
      content = content.replace(
        lastUpdatedMatch[0],
        lastUpdatedMatch[0] + enhancedSystemCode
      );
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filename}`);
    return true;
  } else {
    console.log(`⚠️  No changes needed: ${filename}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting batch update of enhanced knob systems...\n');
  
  let updatedCount = 0;
  
  for (const apiFile of apisToUpdate) {
    if (updateApiFile(apiFile)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✨ Batch update complete! Updated ${updatedCount}/${apisToUpdate.length} files.`);
  console.log('\n📝 Next steps:');
  console.log('1. Update knob endpoints in each file manually');
  console.log('2. Test the enhanced knob system');
  console.log('3. Update any special knob conversion logic');
}

if (require.main === module) {
  main();
}

module.exports = { updateApiFile };
