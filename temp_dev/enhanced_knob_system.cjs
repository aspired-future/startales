/**
 * Enhanced AI Knob System - Supports multiple input formats for maximum AI flexibility
 */

class EnhancedKnobSystem {
  constructor(knobs = {}) {
    this.knobs = { ...knobs };
    this.lastUpdated = Date.now();
  }

  /**
   * Process AI input in multiple formats:
   * - Direct: 0.0-1.0 (e.g., 0.7)
   * - Relative: -3 to +3 (e.g., +2, -1)
   * - Semantic: "low", "medium", "high", etc.
   * - Percentage: "75%" 
   */
  processKnobInput(key, value, currentValue = 0.5) {
    if (typeof value === 'number') {
      // Handle numeric inputs
      if (value >= -3 && value <= 3 && !this.isDirectValue(value)) {
        // Relative adjustment: -3 to +3 → -0.5 to +0.5
        const adjustment = value / 6;
        return Math.max(0, Math.min(1, currentValue + adjustment));
      } else if (value >= 0 && value <= 1) {
        // Direct value: 0.0-1.0
        return value;
      } else if (value > 1 && value <= 100) {
        // Percentage: 1-100 → 0.01-1.0
        return value / 100;
      }
    } else if (typeof value === 'string') {
      // Handle string inputs
      return this.processStringInput(value, currentValue);
    }
    
    return currentValue; // No change if invalid
  }

  processStringInput(value, currentValue) {
    const cleanValue = value.toLowerCase().trim();
    
    // Semantic mappings
    const semanticMap = {
      // Absolute levels
      'off': 0.0, 'minimum': 0.0, 'none': 0.0,
      'very_low': 0.1, 'low': 0.2, 'below_average': 0.3,
      'moderate': 0.5, 'medium': 0.5, 'balanced': 0.5, 'average': 0.5,
      'above_average': 0.7, 'high': 0.8, 'very_high': 0.9,
      'maximum': 1.0, 'full': 1.0, 'complete': 1.0,
      
      // Policy-specific terms
      'strict': 0.8, 'lenient': 0.2, 'aggressive': 0.9, 'conservative': 0.3,
      'efficient': 0.8, 'inefficient': 0.2, 'optimal': 0.9, 'poor': 0.1
    };
    
    if (semanticMap[cleanValue]) {
      return semanticMap[cleanValue];
    }
    
    // Handle percentage strings
    if (cleanValue.endsWith('%')) {
      const percent = parseFloat(cleanValue.slice(0, -1));
      if (!isNaN(percent) && percent >= 0 && percent <= 100) {
        return percent / 100;
      }
    }
    
    // Handle relative adjustments
    if (cleanValue.startsWith('+') || cleanValue.startsWith('-')) {
      const adjustment = parseFloat(cleanValue);
      if (!isNaN(adjustment) && adjustment >= -3 && adjustment <= 3) {
        return Math.max(0, Math.min(1, currentValue + (adjustment / 6)));
      }
    }
    
    // Handle increment/decrement words
    const incrementMap = {
      'increase': +1, 'boost': +1.5, 'maximize': +3,
      'decrease': -1, 'reduce': -1.5, 'minimize': -3,
      'slightly_increase': +0.5, 'slightly_decrease': -0.5
    };
    
    if (incrementMap[cleanValue]) {
      const adjustment = incrementMap[cleanValue] / 6;
      return Math.max(0, Math.min(1, currentValue + adjustment));
    }
    
    return currentValue;
  }

  isDirectValue(value) {
    // Heuristic: if it's a clean decimal between 0-1, treat as direct
    return value >= 0 && value <= 1 && (value % 0.1 === 0 || value.toString().includes('.'));
  }

  /**
   * Update knobs with AI input
   */
  updateKnobs(updates, source = 'ai') {
    const results = {
      updated: {},
      errors: [],
      unchanged: {}
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'lastUpdated') return;
      
      if (key in this.knobs) {
        const currentValue = this.knobs[key];
        const newValue = this.processKnobInput(key, value, currentValue);
        
        if (newValue !== currentValue) {
          this.knobs[key] = newValue;
          results.updated[key] = {
            old_value: currentValue,
            new_value: newValue,
            input: value
          };
        } else {
          results.unchanged[key] = currentValue;
        }
      } else {
        results.errors.push(`Unknown knob: ${key}`);
      }
    });

    this.lastUpdated = Date.now();
    
    return {
      success: Object.keys(results.updated).length > 0 || results.errors.length === 0,
      results,
      source,
      timestamp: this.lastUpdated
    };
  }

  /**
   * Get knob descriptions for AI understanding
   */
  getKnobDescriptions() {
    return {
      input_formats: {
        direct: "0.0 to 1.0 (e.g., 0.7 = 70%)",
        relative: "-3 to +3 (e.g., +2 = increase significantly)",
        semantic: "low, medium, high, strict, lenient, etc.",
        percentage: "1% to 100% (e.g., '75%')"
      },
      semantic_levels: {
        "0.0": ["off", "minimum", "none"],
        "0.2": ["low", "very_low"],
        "0.3": ["below_average"],
        "0.5": ["moderate", "medium", "balanced", "average"],
        "0.7": ["above_average"],
        "0.8": ["high", "strict", "efficient"],
        "1.0": ["maximum", "full", "complete"]
      },
      relative_scale: {
        "-3": "Minimize/Drastically reduce",
        "-2": "Significantly reduce", 
        "-1": "Slightly reduce",
        "0": "No change",
        "+1": "Slightly increase",
        "+2": "Significantly increase",
        "+3": "Maximize/Drastically increase"
      }
    };
  }
}

// Example usage
const exampleKnobs = {
  budget_allocation_efficiency: 0.7,
  fiscal_discipline_level: 0.6,
  tax_collection_efficiency: 0.75
};

const knobSystem = new EnhancedKnobSystem(exampleKnobs);

// Test different input formats
console.log("=== Enhanced Knob System Demo ===");

// Test 1: Direct values
console.log("\n1. Direct values (0.0-1.0):");
console.log(knobSystem.updateKnobs({
  budget_allocation_efficiency: 0.9,
  fiscal_discipline_level: 0.3
}));

// Test 2: Relative adjustments
console.log("\n2. Relative adjustments (-3 to +3):");
console.log(knobSystem.updateKnobs({
  tax_collection_efficiency: "+2",
  fiscal_discipline_level: -1
}));

// Test 3: Semantic inputs
console.log("\n3. Semantic inputs:");
console.log(knobSystem.updateKnobs({
  budget_allocation_efficiency: "high",
  fiscal_discipline_level: "strict",
  tax_collection_efficiency: "maximum"
}));

// Test 4: Mixed inputs
console.log("\n4. Mixed inputs:");
console.log(knobSystem.updateKnobs({
  budget_allocation_efficiency: 0.85,     // Direct
  fiscal_discipline_level: "+1",         // Relative
  tax_collection_efficiency: "efficient" // Semantic
}));

// Test 5: Percentage inputs
console.log("\n5. Percentage inputs:");
console.log(knobSystem.updateKnobs({
  budget_allocation_efficiency: "90%",
  fiscal_discipline_level: "45%"
}));

console.log("\n=== Final Knob Values ===");
console.log(knobSystem.knobs);

console.log("\n=== AI Help Documentation ===");
console.log(JSON.stringify(knobSystem.getKnobDescriptions(), null, 2));

module.exports = { EnhancedKnobSystem };
