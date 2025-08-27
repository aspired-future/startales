/**
 * AI Learning Loop System
 * Implements feedback mechanisms for knob optimization and continuous improvement
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { SimEngineOrchestrator, KnobAdjustment } from './SimEngineOrchestrator';
import { TelemetrySystem, EffectivenessReport } from './TelemetrySystem';

export interface LearningPattern {
  id: string;
  civilizationId: string;
  patternType: 'successful_sequence' | 'failed_sequence' | 'optimal_range' | 'correlation' | 'seasonal_trend';
  apiName: string;
  knobName: string;
  pattern: any;
  confidence: number;
  successRate: number;
  sampleSize: number;
  lastUpdated: Date;
}

export interface OptimizationSuggestion {
  civilizationId: string;
  apiName: string;
  knobName: string;
  currentValue: number;
  suggestedValue: number;
  reason: string;
  expectedImprovement: number;
  confidence: number;
  basedOnPatterns: string[];
}

export interface LearningMetrics {
  totalPatterns: number;
  highConfidencePatterns: number;
  successfulOptimizations: number;
  failedOptimizations: number;
  averageImprovement: number;
  lastLearningCycle: Date;
}

export class AILearningLoop extends EventEmitter {
  private pool: Pool;
  private simEngine: SimEngineOrchestrator;
  private telemetry: TelemetrySystem;
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private optimizationHistory: Map<string, OptimizationSuggestion[]> = new Map();
  private learningInterval: NodeJS.Timeout;
  private patternAnalysisInterval: NodeJS.Timeout;

  constructor(pool: Pool, simEngine: SimEngineOrchestrator, telemetry: TelemetrySystem) {
    super();
    this.pool = pool;
    this.simEngine = simEngine;
    this.telemetry = telemetry;
    
    this.setupLearningListeners();
    this.startLearningCycle();
    this.startPatternAnalysis();
    
    console.log('🧠 AI Learning Loop initialized');
  }

  /**
   * Setup listeners for learning opportunities
   */
  private setupLearningListeners(): void {
    // Learn from knob adjustments
    this.simEngine.on('knobAdjusted', (data) => {
      this.processKnobAdjustmentForLearning(data);
    });

    // Learn from recommendations
    this.simEngine.on('recommendationsGenerated', (data) => {
      this.processRecommendationsForLearning(data);
    });
  }

  /**
   * Process knob adjustment for learning
   */
  private async processKnobAdjustmentForLearning(data: any): Promise<void> {
    try {
      const { civilizationId, adjustment } = data;
      
      // Record the adjustment for pattern analysis
      await this.recordAdjustmentPattern(civilizationId, adjustment);
      
      // Schedule effectiveness evaluation
      setTimeout(async () => {
        await this.evaluateAdjustmentEffectiveness(civilizationId, adjustment);
      }, 60000); // Evaluate after 1 minute

    } catch (error) {
      console.error('Error processing knob adjustment for learning:', error);
    }
  }

  /**
   * Process recommendations for learning
   */
  private async processRecommendationsForLearning(data: any): Promise<void> {
    try {
      const { civilizationId, recommendations } = data;
      
      // Analyze recommendation patterns
      for (const rec of recommendations) {
        await this.analyzeRecommendationPattern(civilizationId, rec);
      }

    } catch (error) {
      console.error('Error processing recommendations for learning:', error);
    }
  }

  /**
   * Record adjustment pattern for analysis
   */
  private async recordAdjustmentPattern(civilizationId: string, adjustment: KnobAdjustment): Promise<void> {
    const patternId = `${civilizationId}-${adjustment.apiName}-${adjustment.knobName}-${Date.now()}`;
    
    const pattern: LearningPattern = {
      id: patternId,
      civilizationId,
      patternType: 'successful_sequence',
      apiName: adjustment.apiName,
      knobName: adjustment.knobName,
      pattern: {
        adjustment: {
          oldValue: adjustment.oldValue,
          newValue: adjustment.newValue,
          delta: adjustment.newValue - adjustment.oldValue,
          reason: adjustment.reason,
          confidence: adjustment.confidence
        },
        context: {
          timestamp: new Date(),
          gameState: 'active' // Would get actual game state
        }
      },
      confidence: adjustment.confidence,
      successRate: 0, // Will be updated after evaluation
      sampleSize: 1,
      lastUpdated: new Date()
    };

    this.learningPatterns.set(patternId, pattern);
    console.log(`🧠 Recorded learning pattern: ${adjustment.apiName}.${adjustment.knobName}`);
  }

  /**
   * Evaluate the effectiveness of an adjustment after some time
   */
  private async evaluateAdjustmentEffectiveness(
    civilizationId: string,
    adjustment: KnobAdjustment
  ): Promise<void> {
    try {
      // Get effectiveness report
      const report = await this.telemetry.getEffectivenessReport(
        civilizationId,
        adjustment.apiName,
        adjustment.knobName,
        true // Force recalculate
      );

      // Update learning patterns based on effectiveness
      await this.updatePatternsWithEffectiveness(civilizationId, adjustment, report);
      
      // Generate optimization suggestions if needed
      if (report.averageEffectiveness < 0.6) {
        await this.generateOptimizationSuggestions(civilizationId, adjustment.apiName, adjustment.knobName);
      }

    } catch (error) {
      console.error('Error evaluating adjustment effectiveness:', error);
    }
  }

  /**
   * Update learning patterns with effectiveness data
   */
  private async updatePatternsWithEffectiveness(
    civilizationId: string,
    adjustment: KnobAdjustment,
    report: EffectivenessReport
  ): Promise<void> {
    // Find related patterns
    const relatedPatterns = Array.from(this.learningPatterns.values()).filter(
      pattern => 
        pattern.civilizationId === civilizationId &&
        pattern.apiName === adjustment.apiName &&
        pattern.knobName === adjustment.knobName
    );

    for (const pattern of relatedPatterns) {
      // Update success rate based on effectiveness
      pattern.successRate = report.averageEffectiveness;
      pattern.confidence = Math.min(pattern.confidence, report.confidenceLevel);
      pattern.sampleSize = report.adjustmentCount;
      pattern.lastUpdated = new Date();

      // Classify pattern type based on effectiveness
      if (report.averageEffectiveness > 0.8) {
        pattern.patternType = 'successful_sequence';
      } else if (report.averageEffectiveness < 0.3) {
        pattern.patternType = 'failed_sequence';
      }

      console.log(`🧠 Updated pattern effectiveness: ${pattern.id} = ${report.averageEffectiveness.toFixed(2)}`);
    }
  }

  /**
   * Analyze recommendation patterns
   */
  private async analyzeRecommendationPattern(civilizationId: string, recommendation: any): Promise<void> {
    // Look for patterns in recommendations
    const patternId = `rec-${civilizationId}-${recommendation.apiName}-${recommendation.knobName}-${Date.now()}`;
    
    const pattern: LearningPattern = {
      id: patternId,
      civilizationId,
      patternType: 'correlation',
      apiName: recommendation.apiName,
      knobName: recommendation.knobName,
      pattern: {
        recommendation: {
          suggestedValue: recommendation.newValue,
          currentValue: recommendation.oldValue,
          reason: recommendation.reason,
          confidence: recommendation.confidence
        },
        triggers: {
          // Would analyze what triggered this recommendation
          gameState: 'active',
          timestamp: new Date()
        }
      },
      confidence: recommendation.confidence,
      successRate: 0.5, // Neutral until proven
      sampleSize: 1,
      lastUpdated: new Date()
    };

    this.learningPatterns.set(patternId, pattern);
  }

  /**
   * Generate optimization suggestions based on learned patterns
   */
  async generateOptimizationSuggestions(
    civilizationId: string,
    apiName: string,
    knobName: string
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    
    try {
      // Get current knob value
      const currentValue = this.simEngine.getKnobStates(civilizationId).get(`${apiName}.${knobName}`) || 50;
      
      // Analyze successful patterns
      const successfulPatterns = this.getSuccessfulPatterns(civilizationId, apiName, knobName);
      
      if (successfulPatterns.length > 0) {
        const suggestion = await this.createOptimizationSuggestion(
          civilizationId,
          apiName,
          knobName,
          currentValue,
          successfulPatterns
        );
        
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }

      // Analyze optimal ranges
      const optimalRange = await this.findOptimalRange(civilizationId, apiName, knobName);
      if (optimalRange && !this.isValueInRange(currentValue, optimalRange)) {
        const suggestion = await this.createRangeOptimizationSuggestion(
          civilizationId,
          apiName,
          knobName,
          currentValue,
          optimalRange
        );
        
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }

      // Store suggestions
      if (suggestions.length > 0) {
        const existing = this.optimizationHistory.get(civilizationId) || [];
        this.optimizationHistory.set(civilizationId, [...existing, ...suggestions]);
        
        console.log(`🧠 Generated ${suggestions.length} optimization suggestions for ${apiName}.${knobName}`);
        
        // Emit suggestions for real-time updates
        this.emit('optimizationSuggestions', {
          civilizationId,
          suggestions,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
    }

    return suggestions;
  }

  /**
   * Get successful patterns for a specific knob
   */
  private getSuccessfulPatterns(civilizationId: string, apiName: string, knobName: string): LearningPattern[] {
    return Array.from(this.learningPatterns.values()).filter(
      pattern =>
        pattern.civilizationId === civilizationId &&
        pattern.apiName === apiName &&
        pattern.knobName === knobName &&
        pattern.successRate > 0.7 &&
        pattern.confidence > 0.6
    );
  }

  /**
   * Create optimization suggestion based on successful patterns
   */
  private async createOptimizationSuggestion(
    civilizationId: string,
    apiName: string,
    knobName: string,
    currentValue: number,
    patterns: LearningPattern[]
  ): Promise<OptimizationSuggestion | null> {
    if (patterns.length === 0) return null;

    // Calculate weighted average of successful adjustments
    let weightedSum = 0;
    let totalWeight = 0;
    const patternIds: string[] = [];

    for (const pattern of patterns) {
      const weight = pattern.confidence * pattern.successRate;
      const targetValue = pattern.pattern.adjustment?.newValue || pattern.pattern.recommendation?.suggestedValue;
      
      if (targetValue !== undefined) {
        weightedSum += targetValue * weight;
        totalWeight += weight;
        patternIds.push(pattern.id);
      }
    }

    if (totalWeight === 0) return null;

    const suggestedValue = Math.round(weightedSum / totalWeight);
    const expectedImprovement = this.calculateExpectedImprovement(patterns);
    const confidence = Math.min(totalWeight / patterns.length, 0.95);

    return {
      civilizationId,
      apiName,
      knobName,
      currentValue,
      suggestedValue,
      reason: `Based on ${patterns.length} successful patterns with average success rate of ${(patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length * 100).toFixed(1)}%`,
      expectedImprovement,
      confidence,
      basedOnPatterns: patternIds
    };
  }

  /**
   * Find optimal range for a knob based on historical data
   */
  private async findOptimalRange(
    civilizationId: string,
    apiName: string,
    knobName: string
  ): Promise<{ min: number; max: number; optimal: number } | null> {
    const patterns = Array.from(this.learningPatterns.values()).filter(
      pattern =>
        pattern.civilizationId === civilizationId &&
        pattern.apiName === apiName &&
        pattern.knobName === knobName &&
        pattern.successRate > 0.6
    );

    if (patterns.length < 3) return null;

    // Extract values and their success rates
    const values: Array<{ value: number; success: number }> = [];
    
    for (const pattern of patterns) {
      const value = pattern.pattern.adjustment?.newValue || pattern.pattern.recommendation?.suggestedValue;
      if (value !== undefined) {
        values.push({ value, success: pattern.successRate });
      }
    }

    if (values.length < 3) return null;

    // Sort by value
    values.sort((a, b) => a.value - b.value);

    // Find the range with highest average success rate
    const windowSize = Math.max(3, Math.floor(values.length / 3));
    let bestRange = { min: 0, max: 100, optimal: 50, avgSuccess: 0 };

    for (let i = 0; i <= values.length - windowSize; i++) {
      const window = values.slice(i, i + windowSize);
      const avgSuccess = window.reduce((sum, v) => sum + v.success, 0) / window.length;
      
      if (avgSuccess > bestRange.avgSuccess) {
        bestRange = {
          min: window[0].value,
          max: window[window.length - 1].value,
          optimal: Math.round(window.reduce((sum, v) => sum + v.value, 0) / window.length),
          avgSuccess
        };
      }
    }

    return bestRange.avgSuccess > 0.7 ? bestRange : null;
  }

  /**
   * Check if value is in range
   */
  private isValueInRange(value: number, range: { min: number; max: number }): boolean {
    return value >= range.min && value <= range.max;
  }

  /**
   * Create range optimization suggestion
   */
  private async createRangeOptimizationSuggestion(
    civilizationId: string,
    apiName: string,
    knobName: string,
    currentValue: number,
    range: { min: number; max: number; optimal: number }
  ): Promise<OptimizationSuggestion> {
    const suggestedValue = range.optimal;
    const expectedImprovement = Math.abs(currentValue - suggestedValue) / 100 * 0.3; // Rough estimate

    return {
      civilizationId,
      apiName,
      knobName,
      currentValue,
      suggestedValue,
      reason: `Current value (${currentValue}) is outside optimal range (${range.min}-${range.max}). Optimal value is ${range.optimal}.`,
      expectedImprovement,
      confidence: 0.75,
      basedOnPatterns: ['optimal_range_analysis']
    };
  }

  /**
   * Calculate expected improvement from patterns
   */
  private calculateExpectedImprovement(patterns: LearningPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const avgSuccessRate = patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length;
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    
    return (avgSuccessRate * avgConfidence) * 0.5; // Conservative estimate
  }

  /**
   * Start main learning cycle
   */
  private startLearningCycle(): void {
    this.learningInterval = setInterval(async () => {
      await this.runLearningCycle();
    }, 300000); // Run every 5 minutes (was 2 minutes)

    console.log('🧠 AI Learning cycle started (5min intervals)');
  }

  /**
   * Start pattern analysis cycle
   */
  private startPatternAnalysis(): void {
    this.patternAnalysisInterval = setInterval(async () => {
      await this.runPatternAnalysis();
    }, 900000); // Run every 15 minutes (was 10 minutes)

    console.log('🧠 Pattern analysis cycle started (15min intervals)');
  }

  /**
   * Run main learning cycle
   */
  private async runLearningCycle(): Promise<void> {
    try {
      console.log('🧠 Running AI learning cycle...');
      
      // Get all active civilizations
      const civilizations = new Set<string>();
      for (const pattern of this.learningPatterns.values()) {
        civilizations.add(pattern.civilizationId);
      }

      // Process each civilization
      for (const civilizationId of civilizations) {
        await this.processLearningForCivilization(civilizationId);
      }

      // Clean up old patterns
      await this.cleanupOldPatterns();

    } catch (error) {
      console.error('Error in learning cycle:', error);
    }
  }

  /**
   * Process learning for a specific civilization
   */
  private async processLearningForCivilization(civilizationId: string): Promise<void> {
    try {
      // Get all knobs for this civilization
      const knobs = new Set<string>();
      
      for (const pattern of this.learningPatterns.values()) {
        if (pattern.civilizationId === civilizationId) {
          knobs.add(`${pattern.apiName}.${pattern.knobName}`);
        }
      }

      // Generate optimization suggestions for each knob
      for (const knobKey of knobs) {
        const [apiName, knobName] = knobKey.split('.');
        await this.generateOptimizationSuggestions(civilizationId, apiName, knobName);
      }

    } catch (error) {
      console.error(`Error processing learning for civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Run pattern analysis
   */
  private async runPatternAnalysis(): Promise<void> {
    try {
      console.log('🧠 Running pattern analysis...');
      
      // Analyze correlation patterns
      await this.analyzeCorrelationPatterns();
      
      // Analyze seasonal trends
      await this.analyzeSeasonalTrends();
      
      // Update pattern confidence scores
      await this.updatePatternConfidence();

    } catch (error) {
      console.error('Error in pattern analysis:', error);
    }
  }

  /**
   * Analyze correlation patterns between different knobs
   */
  private async analyzeCorrelationPatterns(): Promise<void> {
    // Group patterns by civilization
    const civilizationPatterns = new Map<string, LearningPattern[]>();
    
    for (const pattern of this.learningPatterns.values()) {
      const existing = civilizationPatterns.get(pattern.civilizationId) || [];
      existing.push(pattern);
      civilizationPatterns.set(pattern.civilizationId, existing);
    }

    // Analyze correlations within each civilization
    for (const [civilizationId, patterns] of civilizationPatterns) {
      await this.findKnobCorrelations(civilizationId, patterns);
    }
  }

  /**
   * Find correlations between knobs
   */
  private async findKnobCorrelations(civilizationId: string, patterns: LearningPattern[]): Promise<void> {
    // Group patterns by time windows
    const timeWindows = this.groupPatternsByTimeWindows(patterns);
    
    for (const windowPatterns of timeWindows) {
      if (windowPatterns.length >= 2) {
        // Look for patterns that occurred close in time
        const correlations = this.calculateKnobCorrelations(windowPatterns);
        
        for (const correlation of correlations) {
          await this.recordCorrelationPattern(civilizationId, correlation);
        }
      }
    }
  }

  /**
   * Group patterns by time windows
   */
  private groupPatternsByTimeWindows(patterns: LearningPattern[]): LearningPattern[][] {
    const windows: LearningPattern[][] = [];
    const windowSize = 300000; // 5 minutes
    
    // Sort patterns by timestamp
    const sortedPatterns = patterns.sort((a, b) => 
      a.lastUpdated.getTime() - b.lastUpdated.getTime()
    );

    let currentWindow: LearningPattern[] = [];
    let windowStart = 0;

    for (const pattern of sortedPatterns) {
      const patternTime = pattern.lastUpdated.getTime();
      
      if (currentWindow.length === 0) {
        windowStart = patternTime;
        currentWindow.push(pattern);
      } else if (patternTime - windowStart <= windowSize) {
        currentWindow.push(pattern);
      } else {
        if (currentWindow.length > 0) {
          windows.push([...currentWindow]);
        }
        currentWindow = [pattern];
        windowStart = patternTime;
      }
    }

    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }

    return windows;
  }

  /**
   * Calculate correlations between knobs in a time window
   */
  private calculateKnobCorrelations(patterns: LearningPattern[]): any[] {
    const correlations: any[] = [];
    
    // Simple correlation analysis - in reality this would be more sophisticated
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const pattern1 = patterns[i];
        const pattern2 = patterns[j];
        
        // Check if both patterns were successful
        if (pattern1.successRate > 0.7 && pattern2.successRate > 0.7) {
          correlations.push({
            knob1: `${pattern1.apiName}.${pattern1.knobName}`,
            knob2: `${pattern2.apiName}.${pattern2.knobName}`,
            correlation: 0.8, // Mock correlation score
            confidence: Math.min(pattern1.confidence, pattern2.confidence)
          });
        }
      }
    }

    return correlations;
  }

  /**
   * Record correlation pattern
   */
  private async recordCorrelationPattern(civilizationId: string, correlation: any): Promise<void> {
    const patternId = `corr-${civilizationId}-${correlation.knob1}-${correlation.knob2}-${Date.now()}`;
    
    const pattern: LearningPattern = {
      id: patternId,
      civilizationId,
      patternType: 'correlation',
      apiName: 'correlation_analysis',
      knobName: `${correlation.knob1}_${correlation.knob2}`,
      pattern: {
        correlation: correlation.correlation,
        knobs: [correlation.knob1, correlation.knob2],
        strength: correlation.correlation > 0.8 ? 'strong' : 'moderate'
      },
      confidence: correlation.confidence,
      successRate: correlation.correlation,
      sampleSize: 2,
      lastUpdated: new Date()
    };

    this.learningPatterns.set(patternId, pattern);
    console.log(`🧠 Recorded correlation pattern: ${correlation.knob1} ↔ ${correlation.knob2}`);
  }

  /**
   * Analyze seasonal trends (placeholder for future implementation)
   */
  private async analyzeSeasonalTrends(): Promise<void> {
    // This would analyze patterns over longer time periods
    // For now, just log that we're analyzing trends
    console.log('🧠 Analyzing seasonal trends (placeholder)');
  }

  /**
   * Update pattern confidence scores based on recent performance
   */
  private async updatePatternConfidence(): Promise<void> {
    let updatedCount = 0;
    
    for (const pattern of this.learningPatterns.values()) {
      // Decay confidence over time
      const ageInHours = (Date.now() - pattern.lastUpdated.getTime()) / (1000 * 60 * 60);
      const decayFactor = Math.max(0.5, 1 - (ageInHours / 168)); // Decay over 1 week
      
      const oldConfidence = pattern.confidence;
      pattern.confidence = pattern.confidence * decayFactor;
      
      if (Math.abs(oldConfidence - pattern.confidence) > 0.01) {
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`🧠 Updated confidence for ${updatedCount} patterns`);
    }
  }

  /**
   * Clean up old patterns
   */
  private async cleanupOldPatterns(): Promise<void> {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();
    let removedCount = 0;

    for (const [id, pattern] of this.learningPatterns) {
      const age = now - pattern.lastUpdated.getTime();
      
      if (age > maxAge && pattern.confidence < 0.3) {
        this.learningPatterns.delete(id);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧠 Cleaned up ${removedCount} old patterns`);
    }
  }

  /**
   * Get learning metrics
   */
  getLearningMetrics(): LearningMetrics {
    const patterns = Array.from(this.learningPatterns.values());
    const highConfidencePatterns = patterns.filter(p => p.confidence > 0.7);
    
    // Calculate optimization success rate
    let successfulOptimizations = 0;
    let failedOptimizations = 0;
    let totalImprovement = 0;
    let improvementCount = 0;

    for (const suggestions of this.optimizationHistory.values()) {
      for (const suggestion of suggestions) {
        if (suggestion.expectedImprovement > 0.1) {
          successfulOptimizations++;
          totalImprovement += suggestion.expectedImprovement;
          improvementCount++;
        } else {
          failedOptimizations++;
        }
      }
    }

    return {
      totalPatterns: patterns.length,
      highConfidencePatterns: highConfidencePatterns.length,
      successfulOptimizations,
      failedOptimizations,
      averageImprovement: improvementCount > 0 ? totalImprovement / improvementCount : 0,
      lastLearningCycle: new Date()
    };
  }

  /**
   * Get optimization suggestions for a civilization
   */
  getOptimizationSuggestions(civilizationId: string): OptimizationSuggestion[] {
    return this.optimizationHistory.get(civilizationId) || [];
  }

  /**
   * Get learning patterns for a civilization
   */
  getLearningPatterns(civilizationId: string): LearningPattern[] {
    return Array.from(this.learningPatterns.values()).filter(
      pattern => pattern.civilizationId === civilizationId
    );
  }

  /**
   * Shutdown AI learning loop
   */
  shutdown(): void {
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
    }
    
    if (this.patternAnalysisInterval) {
      clearInterval(this.patternAnalysisInterval);
    }

    console.log('🧠 AI Learning Loop shutdown complete');
  }
}

export default AILearningLoop;
