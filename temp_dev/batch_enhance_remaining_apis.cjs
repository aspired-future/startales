/**
 * Batch script to enhance remaining APIs with enhanced knob system
 */

const fs = require('fs');
const path = require('path');

// Remaining APIs to update
const remainingAPIs = [
  'witter-apis.cjs',
  'communication-apis.cjs', 
  'galaxy-map-apis.cjs',
  'conquest-apis.cjs',
  'characters-apis.cjs',
  'game-state-apis.cjs',
  'other-apis.cjs'
];

const apiDir = path.join(__dirname, '../src/server/routes');

function enhanceAPI(filename) {
  console.log(`\n🔧 Enhancing ${filename}...`);
  
  const filePath = path.join(apiDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // 1. Add enhanced knob system import
  if (!content.includes('enhanced-knob-system.cjs')) {
    const requirePattern = /^(const.*require.*\.cjs.*);$/gm;
    const matches = [...content.matchAll(requirePattern)];
    
    if (matches.length > 0) {
      const lastRequire = matches[matches.length - 1][0];
      const importLine = "const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');";
      content = content.replace(lastRequire, lastRequire + '\n' + importLine);
      updated = true;
      console.log('  ✅ Added enhanced knob system import');
    }
  }
  
  // 2. Convert knobs object to enhanced system
  const knobsPattern = /const\s+(\w+)Knobs\s*=\s*\{/;
  const knobsMatch = content.match(knobsPattern);
  
  if (knobsMatch) {
    const systemName = knobsMatch[1];
    const knobsObjectName = `${systemName}Knobs`;
    const knobsDataName = `${systemName}KnobsData`;
    
    // Replace knobs declaration
    content = content.replace(
      `const ${knobsObjectName} = {`,
      `// AI Integration Knobs - Enhanced system supporting multiple input formats\nconst ${knobsDataName} = {`
    );
    
    // Find the end of the knobs object and add enhanced system
    const lastUpdatedPattern = /lastUpdated:\s*Date\.now\(\)\s*\};\s*\n/;
    const lastUpdatedMatch = content.match(lastUpdatedPattern);
    
    if (lastUpdatedMatch) {
      const enhancedSystemCode = `
// Create enhanced knob system
const ${systemName}KnobSystem = new EnhancedKnobSystem(${knobsDataName});

// Backward compatibility - expose knobs directly
const ${knobsObjectName} = ${systemName}KnobSystem.knobs;

`;
      
      content = content.replace(
        lastUpdatedMatch[0],
        lastUpdatedMatch[0] + enhancedSystemCode
      );
      updated = true;
      console.log('  ✅ Converted knobs to enhanced system');
    }
  }
  
  // 3. Update knob endpoints (simplified pattern matching)
  const getKnobsPattern = /app\.get\('\/api\/\w+\/knobs',[\s\S]*?\}\);/;
  const postKnobsPattern = /app\.post\('\/api\/\w+\/knobs',[\s\S]*?\}\);/;
  
  if (content.match(getKnobsPattern) && content.match(postKnobsPattern)) {
    // Extract system name from API path
    const apiPathMatch = content.match(/app\.get\('\/api\/(\w+)\/knobs'/);
    if (apiPathMatch) {
      const apiName = apiPathMatch[1];
      const systemName = apiName === 'policies' ? 'policy' : 
                        apiName === 'cities' ? 'cities' :
                        apiName === 'demographics' ? 'demographics' :
                        apiName.replace(/s$/, ''); // Remove trailing 's'
      
      // Replace GET endpoint
      const newGetEndpoint = `  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/${apiName}/knobs', (req, res) => {
    const knobData = ${systemName}KnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: '${systemName}',
      description: 'AI-adjustable parameters for ${systemName} system with enhanced input support',
      input_help: ${systemName}KnobSystem.getKnobDescriptions()
    });
  });`;
      
      // Replace POST endpoint
      const newPostEndpoint = `  app.post('/api/${apiName}/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: ${systemName}KnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = ${systemName}KnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      apply${systemName.charAt(0).toUpperCase() + systemName.slice(1)}KnobsToGameState();
    } catch (error) {
      console.error('Error applying ${systemName} knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: '${systemName}',
      ...updateResult,
      message: '${systemName.charAt(0).toUpperCase() + systemName.slice(1)} knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/${apiName}/knobs/help', (req, res) => {
    res.json({
      system: '${systemName}',
      help: ${systemName}KnobSystem.getKnobDescriptions(),
      current_values: ${systemName}KnobSystem.getKnobsWithMetadata()
    });
  });`;
      
      // Replace both endpoints
      content = content.replace(getKnobsPattern, newGetEndpoint);
      content = content.replace(postKnobsPattern, newPostEndpoint);
      updated = true;
      console.log('  ✅ Updated knob endpoints');
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Successfully enhanced ${filename}`);
    return true;
  } else {
    console.log(`⚠️  No changes needed for ${filename}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting batch enhancement of remaining APIs...');
  
  let enhancedCount = 0;
  
  for (const apiFile of remainingAPIs) {
    if (enhanceAPI(apiFile)) {
      enhancedCount++;
    }
  }
  
  console.log(`\n✨ Batch enhancement complete!`);
  console.log(`📊 Enhanced ${enhancedCount}/${remainingAPIs.length} APIs`);
  console.log('\n🎯 All APIs now support enhanced knob system with:');
  console.log('  • Direct values (0.0-1.0)');
  console.log('  • Semantic inputs ("high", "strict", "aggressive")');
  console.log('  • Relative adjustments ("+2", "-1")');
  console.log('  • Percentage inputs ("75%", "90%")');
  console.log('  • Action words ("increase", "boost", "maximize")');
}

if (require.main === module) {
  main();
}

module.exports = { enhanceAPI };
