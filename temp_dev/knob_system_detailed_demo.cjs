/**
 * Detailed demo showing exactly how the enhanced knob system processes different inputs
 */

const { EnhancedKnobSystem } = require('./enhanced_knob_system.cjs');

const knobSystem = new EnhancedKnobSystem({
  budget_allocation_efficiency: 0.5,  // Start at 50%
  fiscal_discipline_level: 0.6,       // Start at 60%
  tax_collection_efficiency: 0.7      // Start at 70%
});

console.log("=== DETAILED KNOB PROCESSING DEMO ===");
console.log("Starting values:", knobSystem.knobs);

// Test 1: Show detailed results for different input types
console.log("\n1. DIRECT VALUES (0.0-1.0):");
let result = knobSystem.updateKnobs({
  budget_allocation_efficiency: 0.85,
  fiscal_discipline_level: 0.3
});
console.log("Input: { budget_allocation_efficiency: 0.85, fiscal_discipline_level: 0.3 }");
console.log("Results:", JSON.stringify(result.results.updated, null, 2));

console.log("\n2. RELATIVE ADJUSTMENTS (-3 to +3):");
result = knobSystem.updateKnobs({
  tax_collection_efficiency: "+2",    // Should increase significantly
  fiscal_discipline_level: "-1"       // Should decrease slightly
});
console.log("Input: { tax_collection_efficiency: '+2', fiscal_discipline_level: '-1' }");
console.log("Results:", JSON.stringify(result.results.updated, null, 2));

console.log("\n3. SEMANTIC INPUTS:");
result = knobSystem.updateKnobs({
  budget_allocation_efficiency: "high",     // Should be ~0.8
  fiscal_discipline_level: "strict",        // Should be ~0.8
  tax_collection_efficiency: "maximum"      // Should be 1.0
});
console.log("Input: { budget_allocation_efficiency: 'high', fiscal_discipline_level: 'strict', tax_collection_efficiency: 'maximum' }");
console.log("Results:", JSON.stringify(result.results.updated, null, 2));

console.log("\n4. PERCENTAGE INPUTS:");
result = knobSystem.updateKnobs({
  budget_allocation_efficiency: "75%",
  fiscal_discipline_level: "90%"
});
console.log("Input: { budget_allocation_efficiency: '75%', fiscal_discipline_level: '90%' }");
console.log("Results:", JSON.stringify(result.results.updated, null, 2));

console.log("\n5. MIXED REALISTIC AI INPUT:");
result = knobSystem.updateKnobs({
  budget_allocation_efficiency: 0.92,        // AI wants 92% efficiency
  fiscal_discipline_level: "increase",       // AI wants to increase discipline
  tax_collection_efficiency: "+1"            // AI wants slight improvement
});
console.log("Input: { budget_allocation_efficiency: 0.92, fiscal_discipline_level: 'increase', tax_collection_efficiency: '+1' }");
console.log("Results:", JSON.stringify(result.results.updated, null, 2));

console.log("\n=== FINAL STATE ===");
console.log("Final knob values:", knobSystem.knobs);

console.log("\n=== AI PROMPT EXAMPLES ===");
console.log(`
EXAMPLE AI PROMPTS THAT WOULD WORK:

1. "Set budget efficiency to high and increase tax collection by 2 levels"
   → { budget_allocation_efficiency: "high", tax_collection_efficiency: "+2" }

2. "I want maximum fiscal discipline and 85% budget efficiency"  
   → { fiscal_discipline_level: "maximum", budget_allocation_efficiency: 0.85 }

3. "Reduce spending oversight slightly and boost revenue optimization"
   → { spending_oversight_strictness: "-1", revenue_optimization_focus: "boost" }

4. "Set all economic policies to strict"
   → { fiscal_discipline_level: "strict", tax_collection_efficiency: "strict", budget_allocation_efficiency: "strict" }

5. "Increase defense spending priority by 20% and reduce social programs to moderate"
   → { defense_budget_allocation: "+1.2", social_program_funding: "moderate" }
`);

console.log("\n=== CONVERSION EXAMPLES ===");
console.log("Semantic → Numeric conversions:");
console.log("- 'low' → 0.2 (20%)");
console.log("- 'medium' → 0.5 (50%)"); 
console.log("- 'high' → 0.8 (80%)");
console.log("- 'maximum' → 1.0 (100%)");
console.log("- 'strict' → 0.8 (80%)");
console.log("- 'lenient' → 0.2 (20%)");

console.log("\nRelative → Numeric conversions (from 0.5 baseline):");
console.log("- '+3' → 1.0 (maximize)");
console.log("- '+2' → 0.83 (significant increase)");
console.log("- '+1' → 0.67 (slight increase)");
console.log("- '-1' → 0.33 (slight decrease)");
console.log("- '-2' → 0.17 (significant decrease)");
console.log("- '-3' → 0.0 (minimize)");
