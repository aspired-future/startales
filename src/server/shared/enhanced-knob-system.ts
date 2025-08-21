/**
 * Enhanced AI Knob System - Shared utility for all APIs
 * Supports multiple input formats for maximum AI flexibility
 */

import { Router, Request, Response } from 'express';

interface KnobData {
  [key: string]: number;
  lastUpdated: number;
}

export class EnhancedKnobSystem {
  public knobs: KnobData;
  public lastUpdated: number;

  constructor(knobs: Partial<KnobData> = {}) {
    this.knobs = { ...knobs, lastUpdated: Date.now() } as KnobData;
    this.lastUpdated = Date.now();
  }

  /**
   * Process AI input in multiple formats:
   * - Direct: 0.0-1.0 (e.g., 0.7)
   * - Relative: -3 to +3 (e.g., +2, -1)
   * - Semantic: "low", "medium", "high", "strict", "lenient", etc.
   * - Percentage: "75%" 
   * - Action words: "increase", "decrease", "boost", "reduce", etc.
   */
  processKnobInput(key: string, value: any, currentValue: number = 0.5): number {
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

  processStringInput(value: string, currentValue: number): number {
    const cleanValue = value.toLowerCase().trim();
    
    // Semantic mappings
    const semanticMap = {
      // Absolute levels
      'off': 0.0, 'minimum': 0.0, 'none': 0.0, 'disable': 0.0, 'disabled': 0.0,
      'very_low': 0.1, 'low': 0.2, 'below_average': 0.3, 'weak': 0.2,
      'moderate': 0.5, 'medium': 0.5, 'balanced': 0.5, 'average': 0.5, 'normal': 0.5,
      'above_average': 0.7, 'high': 0.8, 'very_high': 0.9, 'strong': 0.8,
      'maximum': 1.0, 'full': 1.0, 'complete': 1.0, 'max': 1.0, 'enable': 1.0, 'enabled': 1.0,
      
      // Policy-specific terms
      'strict': 0.8, 'lenient': 0.2, 'aggressive': 0.9, 'conservative': 0.3,
      'efficient': 0.8, 'inefficient': 0.2, 'optimal': 0.9, 'poor': 0.1,
      'tight': 0.8, 'loose': 0.2, 'rigid': 0.9, 'flexible': 0.3,
      'intensive': 0.8, 'minimal': 0.2, 'comprehensive': 0.9, 'basic': 0.3,
      
      // Economic terms
      'bullish': 0.8, 'bearish': 0.2, 'stable': 0.5, 'volatile': 0.7,
      'growth': 0.7, 'recession': 0.2, 'expansion': 0.8, 'contraction': 0.3,
      
      // Military/Security terms
      'defensive': 0.3, 'offensive': 0.8, 'neutral': 0.5, 'alert': 0.8,
      'peacetime': 0.3, 'wartime': 0.9, 'secure': 0.8, 'vulnerable': 0.2,
      
      // Social terms
      'open': 0.7, 'closed': 0.2, 'inclusive': 0.8, 'exclusive': 0.3,
      'progressive': 0.7, 'traditional': 0.4, 'liberal': 0.7, 'authoritarian': 0.8
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
      'increase': +1, 'boost': +1.5, 'maximize': +3, 'enhance': +1,
      'decrease': -1, 'reduce': -1.5, 'minimize': -3, 'lower': -1,
      'slightly_increase': +0.5, 'slightly_decrease': -0.5,
      'significantly_increase': +2, 'significantly_decrease': -2,
      'drastically_increase': +3, 'drastically_decrease': -3,
      'double': +2, 'halve': -2, 'triple': +3
    };
    
    if (incrementMap[cleanValue]) {
      const adjustment = incrementMap[cleanValue] / 6;
      return Math.max(0, Math.min(1, currentValue + adjustment));
    }
    
    return currentValue;
  }

  isDirectValue(value: number): boolean {
    // Heuristic: if it's a clean decimal between 0-1, treat as direct
    return value >= 0 && value <= 1 && (value % 0.1 === 0 || value.toString().includes('.'));
  }

  /**
   * Update knobs with AI input - Enhanced version
   */
  updateKnobs(updates: Record<string, any>, source: string = 'ai'): any {
    const results = {
      updated: {},
      errors: [],
      unchanged: {},
      conversions: {}
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'lastUpdated') return;
      
      if (key in this.knobs) {
        const currentValue = this.knobs[key];
        const newValue = this.processKnobInput(key, value, currentValue);
        
        if (Math.abs(newValue - currentValue) > 0.001) { // Account for floating point precision
          this.knobs[key] = newValue;
          results.updated[key] = {
            old_value: currentValue,
            new_value: newValue,
            input: value,
            change: newValue - currentValue,
            change_percentage: ((newValue - currentValue) / Math.max(currentValue, 0.001)) * 100
          };
          
          // Track conversion type for AI feedback
          if (typeof value === 'string') {
            if (value.includes('%')) {
              results.conversions[key] = 'percentage';
            } else if (value.startsWith('+') || value.startsWith('-')) {
              results.conversions[key] = 'relative';
            } else {
              results.conversions[key] = 'semantic';
            }
          } else if (typeof value === 'number' && (value < 0 || value > 1)) {
            results.conversions[key] = 'relative';
          } else {
            results.conversions[key] = 'direct';
          }
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
      timestamp: this.lastUpdated,
      summary: {
        updated_count: Object.keys(results.updated).length,
        unchanged_count: Object.keys(results.unchanged).length,
        error_count: results.errors.length
      }
    };
  }

  /**
   * Get knob descriptions for AI understanding
   */
  getKnobDescriptions(): any {
    return {
      input_formats: {
        direct: "0.0 to 1.0 (e.g., 0.7 = 70%)",
        relative: "-3 to +3 (e.g., +2 = significant increase, -1 = slight decrease)",
        semantic: "low, medium, high, strict, lenient, aggressive, conservative, etc.",
        percentage: "1% to 100% (e.g., '75%')",
        actions: "increase, decrease, boost, reduce, maximize, minimize, etc."
      },
      semantic_levels: {
        "0.0": ["off", "minimum", "none", "disable"],
        "0.1": ["very_low"],
        "0.2": ["low", "weak", "lenient"],
        "0.3": ["below_average", "conservative", "defensive"],
        "0.5": ["moderate", "medium", "balanced", "average", "normal"],
        "0.7": ["above_average", "growth", "progressive"],
        "0.8": ["high", "strong", "strict", "efficient", "aggressive"],
        "0.9": ["very_high", "optimal", "comprehensive"],
        "1.0": ["maximum", "full", "complete", "enable"]
      },
      relative_scale: {
        "-3": "Minimize/Drastically reduce (-50%)",
        "-2": "Significantly reduce (-33%)", 
        "-1": "Slightly reduce (-17%)",
        "0": "No change",
        "+1": "Slightly increase (+17%)",
        "+2": "Significantly increase (+33%)",
        "+3": "Maximize/Drastically increase (+50%)"
      },
      examples: {
        direct: "{ budget_efficiency: 0.85 }",
        relative: "{ tax_collection: '+2', spending: '-1' }",
        semantic: "{ discipline: 'strict', policy: 'aggressive' }",
        percentage: "{ allocation: '75%', growth: '120%' }",
        mixed: "{ efficiency: 0.9, oversight: 'high', funding: '+1' }"
      }
    };
  }

  /**
   * Get current knob values with metadata
   */
  getKnobsWithMetadata(): any {
    return {
      knobs: { ...this.knobs },
      metadata: {
        total_knobs: Object.keys(this.knobs).filter(k => k !== 'lastUpdated').length,
        last_updated: this.lastUpdated,
        average_value: this.calculateAverageValue(),
        value_distribution: this.calculateValueDistribution()
      }
    };
  }

  calculateAverageValue(): number {
    const values = Object.entries(this.knobs)
      .filter(([key]) => key !== 'lastUpdated')
      .map(([, value]) => value);
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  calculateValueDistribution(): any {
    const values = Object.entries(this.knobs)
      .filter(([key]) => key !== 'lastUpdated')
      .map(([, value]) => value);
    
    const distribution = { low: 0, medium: 0, high: 0 };
    values.forEach(val => {
      if (val < 0.4) distribution.low++;
      else if (val < 0.7) distribution.medium++;
      else distribution.high++;
    });
    
    return distribution;
  }
}

/**
 * Create enhanced knob endpoints for any API
 */
export function createEnhancedKnobEndpoints(
  router: Router, 
  systemName: string, 
  knobSystem: EnhancedKnobSystem, 
  applyKnobsFunction?: () => void
): void {
  // Get AI-adjustable knobs with enhanced descriptions
  router.get('/knobs', (req, res) => {
    const knobData = knobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: systemName,
      description: `AI-adjustable parameters for ${systemName} with enhanced input support`,
      input_help: knobSystem.getKnobDescriptions()
    });
  });

  // Update AI knobs with enhanced processing
  router.post('/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: knobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = knobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state if function provided
    if (applyKnobsFunction && typeof applyKnobsFunction === 'function') {
      try {
        applyKnobsFunction();
      } catch (error) {
        console.error(`Error applying ${systemName} knobs to game state:`, error);
      }
    }
    
    res.json({
      success: updateResult.success,
      system: systemName,
      ...updateResult,
      message: `${systemName} knobs updated successfully using enhanced input processing`
    });
  });

  // Get knob help/documentation
  router.get('/knobs/help', (req, res) => {
    res.json({
      system: systemName,
      help: knobSystem.getKnobDescriptions(),
      current_values: knobSystem.getKnobsWithMetadata()
    });
  });
}

// TypeScript exports are handled by the export statements above
