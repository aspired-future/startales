/**
 * FallbackManager - Multi-level degradation strategies for APT execution failures
 * 
 * This class provides:
 * - Four-tier fallback hierarchy (Cached → Simplified → Deterministic → Default)
 * - Quality-aware fallback selection
 * - Performance monitoring and adaptive thresholds
 * - Graceful degradation under system stress
 * - Recovery detection and automatic restoration
 */

import { EventEmitter } from 'events';
import {
  APTExecutionRequest,
  APTExecutionResult,
  APTTemplate,
  GameStateSnapshot,
  CivilizationContext
} from './types';

interface FallbackStrategy {
  level: 1 | 2 | 3 | 4;
  name: 'cached' | 'simplified' | 'deterministic' | 'default';
  description: string;
  qualityScore: number; // 0-1, expected quality of results
  executionTime: number; // Expected execution time in ms
  enabled: boolean;
}

interface FallbackResult {
  success: boolean;
  result?: APTExecutionResult;
  strategyUsed: FallbackStrategy;
  fallbackReason: string;
  qualityDegradation: number; // 0-1, how much quality was lost
}

interface DeterministicCalculator {
  aptId: string;
  calculate: (request: APTExecutionRequest, gameState: GameStateSnapshot) => any;
  description: string;
  qualityScore: number;
}

interface DefaultValue {
  aptId: string;
  value: any;
  description: string;
  qualityScore: number;
}

interface FallbackStats {
  totalFallbacks: number;
  fallbacksByLevel: Map<number, number>;
  averageQualityDegradation: number;
  recoveryRate: number;
  currentDegradationLevel: number;
}

export class FallbackManager extends EventEmitter {
  private strategies: Map<string, FallbackStrategy[]> = new Map();
  private deterministic: Map<string, DeterministicCalculator> = new Map();
  private defaults: Map<string, DefaultValue> = new Map();
  private stats: FallbackStats;
  private systemStressLevel = 0; // 0-1, current system stress
  private recoveryThreshold = 0.8; // Success rate threshold for recovery
  private degradationHistory: Array<{ timestamp: Date; level: number; reason: string }> = [];

  constructor() {
    super();
    
    this.stats = {
      totalFallbacks: 0,
      fallbacksByLevel: new Map([[1, 0], [2, 0], [3, 0], [4, 0]]),
      averageQualityDegradation: 0,
      recoveryRate: 0,
      currentDegradationLevel: 0
    };

    this.initializeStrategies();
    this.initializeDeterministicCalculators();
    this.initializeDefaultValues();
    this.startStressMonitoring();
    
    console.log('🛡️ Fallback Manager initialized with 4-tier degradation strategy');
  }

  /**
   * Execute fallback strategy for a failed APT request
   */
  async executeFallback(
    request: APTExecutionRequest,
    template: APTTemplate,
    gameState: GameStateSnapshot,
    originalError: Error,
    cache?: any
  ): Promise<FallbackResult> {
    console.log(`🛡️ Executing fallback for APT: ${request.aptId}`);
    
    const strategies = this.getStrategiesForAPT(request.aptId);
    let lastError = originalError;
    
    for (const strategy of strategies) {
      if (!strategy.enabled) continue;
      
      try {
        console.log(`🔄 Trying fallback level ${strategy.level}: ${strategy.name}`);
        
        const result = await this.executeStrategy(
          strategy,
          request,
          template,
          gameState,
          cache
        );
        
        if (result.success && result.result) {
          // Mark result as fallback
          result.result.fallbackUsed = strategy.name;
          result.result.qualityScore = Math.min(
            result.result.qualityScore || 0.5,
            strategy.qualityScore
          );
          
          this.recordFallbackSuccess(strategy, request.aptId);
          
          console.log(`✅ Fallback successful using ${strategy.name} (quality: ${strategy.qualityScore})`);
          
          return {
            success: true,
            result: result.result,
            strategyUsed: strategy,
            fallbackReason: originalError.message,
            qualityDegradation: 1 - strategy.qualityScore
          };
        }
      } catch (error) {
        console.log(`❌ Fallback level ${strategy.level} failed:`, error.message);
        lastError = error;
      }
    }
    
    // All fallbacks failed
    this.recordFallbackFailure(request.aptId, lastError);
    
    return {
      success: false,
      strategyUsed: strategies[strategies.length - 1] || this.getDefaultStrategy(),
      fallbackReason: originalError.message,
      qualityDegradation: 1
    };
  }

  /**
   * Check if system should use fallbacks proactively
   */
  shouldUseFallback(request: APTExecutionRequest): {
    shouldFallback: boolean;
    recommendedLevel: number;
    reason: string;
  } {
    // Check system stress level
    if (this.systemStressLevel > 0.8) {
      return {
        shouldFallback: true,
        recommendedLevel: 3, // Skip to deterministic
        reason: 'High system stress detected'
      };
    }
    
    if (this.systemStressLevel > 0.6) {
      return {
        shouldFallback: true,
        recommendedLevel: 2, // Use simplified prompts
        reason: 'Moderate system stress detected'
      };
    }
    
    // Check request priority vs current load
    if (request.priority === 'low' && this.stats.currentDegradationLevel > 0) {
      return {
        shouldFallback: true,
        recommendedLevel: Math.min(this.stats.currentDegradationLevel + 1, 4),
        reason: 'Low priority request during degraded performance'
      };
    }
    
    return {
      shouldFallback: false,
      recommendedLevel: 0,
      reason: 'Normal operation'
    };
  }

  /**
   * Register a custom deterministic calculator
   */
  registerDeterministicCalculator(calculator: DeterministicCalculator): void {
    this.deterministic.set(calculator.aptId, calculator);
    console.log(`📊 Registered deterministic calculator for ${calculator.aptId}`);
    this.emit('calculatorRegistered', calculator.aptId);
  }

  /**
   * Register a custom default value
   */
  registerDefaultValue(defaultValue: DefaultValue): void {
    this.defaults.set(defaultValue.aptId, defaultValue);
    console.log(`📋 Registered default value for ${defaultValue.aptId}`);
    this.emit('defaultRegistered', defaultValue.aptId);
  }

  /**
   * Update system stress level
   */
  updateSystemStress(stressLevel: number, reason: string): void {
    const oldLevel = this.systemStressLevel;
    this.systemStressLevel = Math.max(0, Math.min(1, stressLevel));
    
    if (Math.abs(oldLevel - this.systemStressLevel) > 0.1) {
      console.log(`📊 System stress updated: ${(this.systemStressLevel * 100).toFixed(1)}% (${reason})`);
      this.emit('stressLevelChanged', this.systemStressLevel, reason);
      
      // Update degradation level based on stress
      this.updateDegradationLevel();
    }
  }

  /**
   * Get current fallback statistics
   */
  getStats(): FallbackStats {
    return { ...this.stats };
  }

  /**
   * Get system health assessment
   */
  getHealthAssessment(): {
    overallHealth: number; // 0-1
    stressLevel: number;
    degradationLevel: number;
    recommendations: string[];
    recentDegradations: Array<{ timestamp: Date; level: number; reason: string }>;
  } {
    const recommendations: string[] = [];
    
    if (this.systemStressLevel > 0.7) {
      recommendations.push('Consider scaling up AI resources or reducing concurrent executions');
    }
    
    if (this.stats.averageQualityDegradation > 0.3) {
      recommendations.push('High quality degradation detected - investigate root causes');
    }
    
    if (this.stats.recoveryRate < 0.5) {
      recommendations.push('Low recovery rate - check AI provider availability');
    }
    
    const overallHealth = Math.max(0, 1 - this.systemStressLevel - (this.stats.averageQualityDegradation * 0.5));
    
    return {
      overallHealth,
      stressLevel: this.systemStressLevel,
      degradationLevel: this.stats.currentDegradationLevel,
      recommendations,
      recentDegradations: this.degradationHistory.slice(-10)
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async executeStrategy(
    strategy: FallbackStrategy,
    request: APTExecutionRequest,
    template: APTTemplate,
    gameState: GameStateSnapshot,
    cache?: any
  ): Promise<{ success: boolean; result?: APTExecutionResult }> {
    const startTime = performance.now();
    
    switch (strategy.name) {
      case 'cached':
        return this.executeCachedFallback(request, gameState, cache);
      
      case 'simplified':
        return this.executeSimplifiedFallback(request, template, gameState);
      
      case 'deterministic':
        return this.executeDeterministicFallback(request, gameState);
      
      case 'default':
        return this.executeDefaultFallback(request, gameState);
      
      default:
        throw new Error(`Unknown fallback strategy: ${strategy.name}`);
    }
  }

  private async executeCachedFallback(
    request: APTExecutionRequest,
    gameState: GameStateSnapshot,
    cache?: any
  ): Promise<{ success: boolean; result?: APTExecutionResult }> {
    if (!cache) {
      throw new Error('No cache available for cached fallback');
    }
    
    // Try to find a similar cached result
    const similarResult = await this.findSimilarCachedResult(request, gameState, cache);
    
    if (similarResult) {
      // Adapt the cached result to current context
      const adaptedResult = this.adaptCachedResult(similarResult, request, gameState);
      
      return {
        success: true,
        result: {
          ...adaptedResult,
          executionId: this.generateExecutionId(),
          timestamp: new Date(),
          cacheHit: true,
          qualityScore: 0.9 // High quality for recent cache hits
        }
      };
    }
    
    throw new Error('No suitable cached result found');
  }

  private async executeSimplifiedFallback(
    request: APTExecutionRequest,
    template: APTTemplate,
    gameState: GameStateSnapshot
  ): Promise<{ success: boolean; result?: APTExecutionResult }> {
    // Create a simplified version of the prompt
    const simplifiedPrompt = this.createSimplifiedPrompt(template, request.variables);
    
    // Use faster, simpler AI model or reduced complexity
    const result = await this.executeSimplifiedAI(simplifiedPrompt, template);
    
    return {
      success: true,
      result: {
        executionId: this.generateExecutionId(),
        aptId: request.aptId,
        success: true,
        executionTime: result.executionTime,
        timestamp: new Date(),
        rawResponse: result.response,
        parsedResult: result.parsed,
        cacheHit: false,
        qualityScore: 0.7, // Moderate quality for simplified prompts
        fallbackUsed: 'simplified'
      }
    };
  }

  private async executeDeterministicFallback(
    request: APTExecutionRequest,
    gameState: GameStateSnapshot
  ): Promise<{ success: boolean; result?: APTExecutionResult }> {
    const calculator = this.deterministic.get(request.aptId);
    
    if (!calculator) {
      throw new Error(`No deterministic calculator available for ${request.aptId}`);
    }
    
    const startTime = performance.now();
    const calculatedResult = calculator.calculate(request, gameState);
    const executionTime = performance.now() - startTime;
    
    return {
      success: true,
      result: {
        executionId: this.generateExecutionId(),
        aptId: request.aptId,
        success: true,
        executionTime,
        timestamp: new Date(),
        rawResponse: JSON.stringify(calculatedResult),
        parsedResult: calculatedResult,
        cacheHit: false,
        qualityScore: calculator.qualityScore,
        fallbackUsed: 'deterministic'
      }
    };
  }

  private async executeDefaultFallback(
    request: APTExecutionRequest,
    gameState: GameStateSnapshot
  ): Promise<{ success: boolean; result?: APTExecutionResult }> {
    const defaultValue = this.defaults.get(request.aptId);
    
    if (!defaultValue) {
      throw new Error(`No default value available for ${request.aptId}`);
    }
    
    return {
      success: true,
      result: {
        executionId: this.generateExecutionId(),
        aptId: request.aptId,
        success: true,
        executionTime: 1,
        timestamp: new Date(),
        rawResponse: JSON.stringify(defaultValue.value),
        parsedResult: defaultValue.value,
        cacheHit: false,
        qualityScore: defaultValue.qualityScore,
        fallbackUsed: 'default'
      }
    };
  }

  private getStrategiesForAPT(aptId: string): FallbackStrategy[] {
    // Get strategies for this specific APT, or use default strategies
    return this.strategies.get(aptId) || this.strategies.get('default') || [];
  }

  private getDefaultStrategy(): FallbackStrategy {
    return {
      level: 4,
      name: 'default',
      description: 'Use default values',
      qualityScore: 0.3,
      executionTime: 1,
      enabled: true
    };
  }

  private async findSimilarCachedResult(
    request: APTExecutionRequest,
    gameState: GameStateSnapshot,
    cache: any
  ): Promise<APTExecutionResult | null> {
    // This would integrate with the actual cache system
    // For now, simulate finding a similar result
    if (Math.random() > 0.7) { // 30% chance of finding similar result
      return {
        executionId: 'cached_result',
        aptId: request.aptId,
        success: true,
        executionTime: 100,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        rawResponse: 'Cached response',
        parsedResult: { cached: true, similarity: 0.8 },
        cacheHit: true,
        qualityScore: 0.85
      };
    }
    
    return null;
  }

  private adaptCachedResult(
    cachedResult: APTExecutionResult,
    request: APTExecutionRequest,
    gameState: GameStateSnapshot
  ): APTExecutionResult {
    // Adapt cached result to current context
    const adapted = { ...cachedResult };
    
    // Apply simple adaptations based on context changes
    if (adapted.parsedResult && typeof adapted.parsedResult === 'object') {
      adapted.parsedResult = {
        ...adapted.parsedResult,
        adapted: true,
        adaptationTime: new Date(),
        contextTick: gameState.currentTick
      };
    }
    
    return adapted;
  }

  private createSimplifiedPrompt(template: APTTemplate, variables: Record<string, any>): string {
    // Create a shorter, simpler version of the prompt
    const lines = template.promptTemplate.split('\n');
    const simplifiedLines = lines.slice(0, Math.ceil(lines.length / 2)); // Use first half
    
    let simplified = simplifiedLines.join('\n');
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      simplified = simplified.replace(new RegExp(placeholder, 'g'), stringValue);
    }
    
    return simplified + '\n\nProvide a brief analysis in JSON format.';
  }

  private async executeSimplifiedAI(prompt: string, template: APTTemplate): Promise<{
    response: string;
    parsed: any;
    executionTime: number;
  }> {
    const startTime = performance.now();
    
    // Simulate simplified AI execution (faster, lower quality)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const executionTime = performance.now() - startTime;
    
    // Generate simplified response
    const response = JSON.stringify({
      analysis: 'Simplified analysis result',
      confidence: 0.6 + Math.random() * 0.2,
      recommendation: 'Basic recommendation based on simplified processing'
    });
    
    return {
      response,
      parsed: JSON.parse(response),
      executionTime
    };
  }

  private recordFallbackSuccess(strategy: FallbackStrategy, aptId: string): void {
    this.stats.totalFallbacks++;
    const currentCount = this.stats.fallbacksByLevel.get(strategy.level) || 0;
    this.stats.fallbacksByLevel.set(strategy.level, currentCount + 1);
    
    // Update quality degradation
    const qualityLoss = 1 - strategy.qualityScore;
    const totalDegradation = this.stats.averageQualityDegradation * (this.stats.totalFallbacks - 1) + qualityLoss;
    this.stats.averageQualityDegradation = totalDegradation / this.stats.totalFallbacks;
    
    this.emit('fallbackSuccess', aptId, strategy.name, strategy.level);
  }

  private recordFallbackFailure(aptId: string, error: Error): void {
    this.stats.totalFallbacks++;
    
    // Record maximum quality degradation for complete failures
    const totalDegradation = this.stats.averageQualityDegradation * (this.stats.totalFallbacks - 1) + 1;
    this.stats.averageQualityDegradation = totalDegradation / this.stats.totalFallbacks;
    
    this.emit('fallbackFailure', aptId, error.message);
  }

  private updateDegradationLevel(): void {
    let newLevel = 0;
    
    if (this.systemStressLevel > 0.8) {
      newLevel = 3; // Use deterministic fallbacks
    } else if (this.systemStressLevel > 0.6) {
      newLevel = 2; // Use simplified prompts
    } else if (this.systemStressLevel > 0.4) {
      newLevel = 1; // Prefer cached results
    }
    
    if (newLevel !== this.stats.currentDegradationLevel) {
      const oldLevel = this.stats.currentDegradationLevel;
      this.stats.currentDegradationLevel = newLevel;
      
      this.degradationHistory.push({
        timestamp: new Date(),
        level: newLevel,
        reason: `Stress level: ${(this.systemStressLevel * 100).toFixed(1)}%`
      });
      
      // Keep only last 100 degradation events
      if (this.degradationHistory.length > 100) {
        this.degradationHistory.shift();
      }
      
      console.log(`📊 Degradation level changed: ${oldLevel} → ${newLevel}`);
      this.emit('degradationLevelChanged', newLevel, oldLevel);
    }
  }

  private generateExecutionId(): string {
    return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeStrategies(): void {
    const defaultStrategies: FallbackStrategy[] = [
      {
        level: 1,
        name: 'cached',
        description: 'Use similar cached results with adaptation',
        qualityScore: 0.9,
        executionTime: 50,
        enabled: true
      },
      {
        level: 2,
        name: 'simplified',
        description: 'Use simplified prompts with faster models',
        qualityScore: 0.7,
        executionTime: 1000,
        enabled: true
      },
      {
        level: 3,
        name: 'deterministic',
        description: 'Use rule-based calculations',
        qualityScore: 0.5,
        executionTime: 100,
        enabled: true
      },
      {
        level: 4,
        name: 'default',
        description: 'Use predefined default values',
        qualityScore: 0.3,
        executionTime: 1,
        enabled: true
      }
    ];
    
    this.strategies.set('default', defaultStrategies);
  }

  private initializeDeterministicCalculators(): void {
    // Population growth calculator
    this.registerDeterministicCalculator({
      aptId: 'population-growth-analysis',
      calculate: (request, gameState) => {
        const civ = request.context.civilizationContext;
        if (!civ) return { growthRate: 0.02, confidence: 0.5 };
        
        // Simple deterministic calculation
        const baseGrowth = 0.02;
        const economicFactor = Math.min(civ.economic_power / 1000000, 2);
        const populationPressure = Math.max(0.5, 1 - (civ.total_population / 10000000));
        
        return {
          growthRate: baseGrowth * economicFactor * populationPressure,
          demographicChanges: {
            birthRate: 0.015,
            deathRate: 0.008
          },
          socialStabilityImpact: 0,
          confidence: 0.6
        };
      },
      description: 'Deterministic population growth calculation',
      qualityScore: 0.5
    });
    
    // Economic analysis calculator
    this.registerDeterministicCalculator({
      aptId: 'economic-analysis',
      calculate: (request, gameState) => {
        const civ = request.context.civilizationContext;
        if (!civ) return { recommendation: 'maintain', confidence: 0.5 };
        
        const economicHealth = civ.economic_power / civ.total_population;
        
        return {
          recommendation: economicHealth > 50000 ? 'expand' : 'consolidate',
          confidence: 0.6,
          expectedROI: Math.max(0.02, economicHealth / 1000000),
          riskLevel: economicHealth > 75000 ? 'low' : 'medium'
        };
      },
      description: 'Deterministic economic analysis',
      qualityScore: 0.5
    });
  }

  private initializeDefaultValues(): void {
    // Population defaults
    this.registerDefaultValue({
      aptId: 'population-growth-analysis',
      value: {
        growthRate: 0.02,
        demographicChanges: {
          birthRate: 0.015,
          deathRate: 0.008
        },
        socialStabilityImpact: 0,
        confidence: 0.3
      },
      description: 'Default population growth values',
      qualityScore: 0.3
    });
    
    // Economic defaults
    this.registerDefaultValue({
      aptId: 'economic-analysis',
      value: {
        recommendation: 'maintain',
        confidence: 0.3,
        expectedROI: 0.05,
        riskLevel: 'medium'
      },
      description: 'Default economic analysis values',
      qualityScore: 0.3
    });
    
    // Military defaults
    this.registerDefaultValue({
      aptId: 'military-analysis',
      value: {
        readinessLevel: 0.7,
        threatAssessment: 'moderate',
        recommendedAction: 'maintain',
        confidence: 0.3
      },
      description: 'Default military analysis values',
      qualityScore: 0.3
    });
  }

  private startStressMonitoring(): void {
    // Monitor system stress every 30 seconds
    setInterval(() => {
      // This would integrate with actual system monitoring
      // For now, simulate stress based on random factors
      const randomStress = Math.random() * 0.3;
      this.updateSystemStress(randomStress, 'Periodic monitoring');
    }, 30000);
  }
}
