/**
 * Demo of the Enhanced Knob System with real examples
 */

const { EnhancedKnobSystem } = require('../src/server/routes/enhanced-knob-system.cjs');

// Create a sample knob system like our APIs use
const sampleKnobs = {
  // Demographics-style knobs
  birth_rate_modifier: 0.5,
  education_investment: 0.7,
  healthcare_investment: 0.6,
  
  // Trade-style knobs  
  market_regulation_level: 0.5,
  trade_tariff_rate: 0.2,
  export_incentives: 0.3,
  
  // Policy-style knobs
  fiscal_discipline: 0.6,
  social_spending: 0.4,
  environmental_priority: 0.8,
  
  lastUpdated: Date.now()
};

const knobSystem = new EnhancedKnobSystem(sampleKnobs);

console.log('🎛️ ENHANCED KNOB SYSTEM DEMO');
console.log('=' .repeat(50));

console.log('\n📊 Initial Values:');
console.log(JSON.stringify(knobSystem.knobs, null, 2));

console.log('\n🤖 AI Input Examples:');

// Example 1: Direct values
console.log('\n1️⃣ DIRECT VALUES (0.0-1.0):');
console.log('AI Input: { birth_rate_modifier: 0.8, education_investment: 0.9 }');
let result = knobSystem.updateKnobs({
  birth_rate_modifier: 0.8,
  education_investment: 0.9
});
console.log('✅ Result:', result.summary);

// Example 2: Semantic inputs
console.log('\n2️⃣ SEMANTIC INPUTS:');
console.log('AI Input: { market_regulation_level: "strict", fiscal_discipline: "high", social_spending: "low" }');
result = knobSystem.updateKnobs({
  market_regulation_level: "strict",
  fiscal_discipline: "high", 
  social_spending: "low"
});
console.log('✅ Result:', result.summary);

// Example 3: Relative adjustments
console.log('\n3️⃣ RELATIVE ADJUSTMENTS (-3 to +3):');
console.log('AI Input: { trade_tariff_rate: "+2", export_incentives: "-1", environmental_priority: "+1" }');
result = knobSystem.updateKnobs({
  trade_tariff_rate: "+2",
  export_incentives: "-1", 
  environmental_priority: "+1"
});
console.log('✅ Result:', result.summary);

// Example 4: Percentage inputs
console.log('\n4️⃣ PERCENTAGE INPUTS:');
console.log('AI Input: { healthcare_investment: "85%", birth_rate_modifier: "60%" }');
result = knobSystem.updateKnobs({
  healthcare_investment: "85%",
  birth_rate_modifier: "60%"
});
console.log('✅ Result:', result.summary);

// Example 5: Mixed realistic AI input
console.log('\n5️⃣ MIXED REALISTIC AI INPUT:');
console.log('AI Input: { fiscal_discipline: "increase", social_spending: 0.75, market_regulation_level: "+1", environmental_priority: "maximum" }');
result = knobSystem.updateKnobs({
  fiscal_discipline: "increase",
  social_spending: 0.75,
  market_regulation_level: "+1",
  environmental_priority: "maximum"
});
console.log('✅ Result:', result.summary);

console.log('\n📈 FINAL VALUES:');
Object.entries(knobSystem.knobs).forEach(([key, value]) => {
  if (key !== 'lastUpdated') {
    const percentage = Math.round(value * 100);
    console.log(`  ${key}: ${value.toFixed(3)} (${percentage}%)`);
  }
});

console.log('\n🎯 AI USAGE EXAMPLES:');
console.log(`
The AI can now use natural language like:

🗣️ "Set economic policies to strict and increase social spending"
   → { fiscal_discipline: "strict", social_spending: "increase" }

🗣️ "I want 85% healthcare investment and maximum environmental priority"  
   → { healthcare_investment: "85%", environmental_priority: "maximum" }

🗣️ "Boost trade incentives by 2 levels and reduce tariffs slightly"
   → { export_incentives: "+2", trade_tariff_rate: "-1" }

🗣️ "Set birth rate to normal and education to high priority"
   → { birth_rate_modifier: "normal", education_investment: "high" }
`);

console.log('\n✨ The enhanced knob system automatically converts all these inputs!');
console.log('🎛️ All APIs now support this flexible input system!');
