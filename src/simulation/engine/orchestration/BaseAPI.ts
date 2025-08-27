/**
 * BaseAPI - Abstract base class for all StarTales server system APIs
 * 
 * This class provides:
 * - Standardized interface for orchestration integration
 * - Built-in APT execution and caching support
 * - Performance monitoring and health tracking
 * - Error handling and fallback mechanisms
 * - Knob settings management and validation
 */

import { EventEmitter } from 'events';
import {
  APIExecutionContext,
  APIExecutionResult,
  SystemDefinition,
  APTTemplate,
  APTExecutionRequest,
  GameStateSnapshot,
  CivilizationContext,
  SystemKnobSettings,
  ExecutionMetrics
} from './types';

export interface APIConfig {
  systemId: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  executionGroup: 'civilization' | 'inter-civ' | 'galactic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'every_tick' | 'periodic' | 'event_driven' | 'on_demand';
  estimatedExecutionTime: number;
  timeoutMs: number;
  requiredKnobs: string[];
  optionalKnobs: string[];
  dependsOn: string[];
}

export interface KnobDefinition {
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'string' | 'enum';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  enumValues?: string[];
  required: boolean;
  category: string;
}

export interface APIHealthStatus {
  healthy: boolean;
  lastExecution: Date;
  averageExecutionTime: number;
  successRate: number;
  errorCount: number;
  lastError?: string;
  knobValidation: boolean;
}

export abstract class BaseAPI extends EventEmitter {
  protected config: APIConfig;
  protected knobDefinitions: Map<string, KnobDefinition> = new Map();
  protected aptTemplates: Map<string, APTTemplate> = new Map();
  protected executionHistory: Array<{
    timestamp: Date;
    success: boolean;
    executionTime: number;
    error?: string;
  }> = [];
  protected currentKnobs: SystemKnobSettings = {};
  protected isInitialized = false;

  constructor(config: APIConfig) {
    super();
    this.config = config;
    this.initializeKnobs();
    this.initializeAPTs();
  }

  /**
   * Get system definition for orchestration registration
   */
  getSystemDefinition(): SystemDefinition {
    return {
      id: this.config.systemId,
      name: this.config.name,
      description: this.config.description,
      tier: this.config.tier,
      executionGroup: this.config.executionGroup,
      dependsOn: this.config.dependsOn,
      maxDepth: 5,
      executionMode: this.config.tier === 1 ? 'parallel' : 'sequential',
      priority: this.config.priority,
      timeoutMs: this.config.timeoutMs,
      estimatedExecutionTime: this.config.estimatedExecutionTime,
      memoryUsage: 100 * 1024 * 1024, // 100MB default
      aptCount: this.aptTemplates.size,
      frequency: this.config.frequency,
      interval: this.config.frequency === 'periodic' ? 300000 : undefined,
      apiEndpoint: `/api/${this.config.systemId}`,
      requiredKnobs: this.config.requiredKnobs,
      optionalKnobs: this.config.optionalKnobs
    };
  }

  /**
   * Main execution entry point called by orchestration system
   */
  async execute(context: APIExecutionContext): Promise<APIExecutionResult> {
    const startTime = performance.now();
    const executionId = context.executionId;
    
    try {
      console.log(`🔄 Executing ${this.config.systemId} (${executionId})`);
      
      // Validate execution context
      this.validateExecutionContext(context);
      
      // Update knob settings
      this.updateKnobSettings(context.knobSettings);
      
      // Execute the system-specific logic
      const systemResult = await this.executeSystem(context);
      
      // Process any APT executions
      const aptResults = await this.processAPTExecutions(context);
      
      // Combine results
      const result = this.combineResults(systemResult, aptResults, context, startTime);
      
      // Record successful execution
      this.recordExecution(true, result.executionTime);
      
      console.log(`✅ ${this.config.systemId} completed in ${result.executionTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      console.error(`❌ ${this.config.systemId} failed:`, error);
      
      // Record failed execution
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.recordExecution(false, executionTime, errorMessage);
      
      // Return error result
      const errorObj = error instanceof Error ? error : new Error(String(error));
      return this.createErrorResult(context, errorObj, executionTime);
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): APIHealthStatus {
    const recentExecutions = this.executionHistory.slice(-20); // Last 20 executions
    const successfulExecutions = recentExecutions.filter(e => e.success);
    
    return {
      healthy: recentExecutions.length === 0 || successfulExecutions.length / recentExecutions.length >= 0.8,
      lastExecution: recentExecutions.length > 0 ? recentExecutions[recentExecutions.length - 1].timestamp : new Date(0),
      averageExecutionTime: recentExecutions.length > 0 ? 
        recentExecutions.reduce((sum, e) => sum + e.executionTime, 0) / recentExecutions.length : 0,
      successRate: recentExecutions.length > 0 ? successfulExecutions.length / recentExecutions.length : 1,
      errorCount: recentExecutions.filter(e => !e.success).length,
      lastError: recentExecutions.reverse().find(e => !e.success)?.error,
      knobValidation: this.validateCurrentKnobs().valid
    };
  }

  /**
   * Get all knob definitions
   */
  getKnobDefinitions(): KnobDefinition[] {
    return Array.from(this.knobDefinitions.values());
  }

  /**
   * Get current knob settings
   */
  getCurrentKnobs(): SystemKnobSettings {
    return { ...this.currentKnobs };
  }

  /**
   * Update knob settings with validation
   */
  updateKnobSettings(newKnobs: SystemKnobSettings): void {
    // Validate new knobs
    const validation = this.validateKnobs(newKnobs);
    if (!validation.valid) {
      throw new Error(`Invalid knob settings: ${validation.errors.join(', ')}`);
    }
    
    // Apply updates
    Object.assign(this.currentKnobs, newKnobs);
    
    // Emit knob update event
    this.emit('knobsUpdated', this.currentKnobs);
  }

  /**
   * Register an APT template for this system
   */
  protected registerAPT(template: APTTemplate): void {
    this.aptTemplates.set(template.id, template);
    console.log(`📝 Registered APT: ${template.id} for system ${this.config.systemId}`);
  }

  /**
   * Register a knob definition
   */
  protected registerKnob(knob: KnobDefinition): void {
    this.knobDefinitions.set(knob.name, knob);
    
    // Set default value if not already set
    if (!(knob.name in this.currentKnobs)) {
      this.currentKnobs[knob.name] = knob.defaultValue;
    }
    
    console.log(`⚙️ Registered knob: ${knob.name} for system ${this.config.systemId}`);
  }

  /**
   * Execute an APT with system context
   */
  protected async executeAPT(
    aptId: string,
    variables: Record<string, any>,
    context: APIExecutionContext,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<any> {
    const template = this.aptTemplates.get(aptId);
    if (!template) {
      throw new Error(`APT template not found: ${aptId}`);
    }
    
    const request: APTExecutionRequest = {
      aptId,
      variables: {
        ...variables,
        systemId: this.config.systemId,
        knobSettings: this.currentKnobs
      },
      context,
      priority
    };
    
    // This would integrate with the APT system
    // For now, return a mock result
    return {
      success: true,
      result: { mock: true, aptId, variables },
      executionTime: 1000 + Math.random() * 2000
    };
  }

  /**
   * Get knob value with type safety
   */
  protected getKnob<T = any>(name: string): T {
    if (!(name in this.currentKnobs)) {
      const definition = this.knobDefinitions.get(name);
      if (definition && definition.required) {
        throw new Error(`Required knob '${name}' not set`);
      }
      return definition?.defaultValue;
    }
    
    return this.currentKnobs[name] as T;
  }

  /**
   * Check if system should execute based on frequency and conditions
   */
  shouldExecute(context: APIExecutionContext): boolean {
    switch (this.config.frequency) {
      case 'every_tick':
        return true;
      
      case 'periodic':
        // Check if enough time has passed since last execution
        const lastExecution = this.executionHistory[this.executionHistory.length - 1];
        if (!lastExecution) return true;
        
        const timeSinceLastExecution = Date.now() - lastExecution.timestamp.getTime();
        const interval = this.getSystemDefinition().interval || 300000; // 5 minutes default
        return timeSinceLastExecution >= interval;
      
      case 'event_driven':
        // Check for relevant events in context
        return context.gameState.activeEvents.some(event => 
          this.isRelevantEvent(event, context)
        );
      
      case 'on_demand':
        // Only execute when explicitly requested
        return context.triggerType === 'player_action' || context.triggerType === 'ai_triggered';
      
      default:
        return true;
    }
  }

  // ============================================================================
  // ABSTRACT METHODS (Must be implemented by subclasses)
  // ============================================================================

  /**
   * Initialize system-specific knobs
   */
  protected abstract initializeKnobs(): void;

  /**
   * Initialize system-specific APT templates
   */
  protected abstract initializeAPTs(): void;

  /**
   * Execute the core system logic
   */
  protected abstract executeSystem(context: APIExecutionContext): Promise<{
    gameStateUpdates: any;
    systemOutputs: any;
    eventsGenerated: any[];
    scheduledActions: any[];
  }>;

  /**
   * Check if an event is relevant to this system
   */
  protected abstract isRelevantEvent(event: any, context: APIExecutionContext): boolean;

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private validateExecutionContext(context: APIExecutionContext): void {
    if (!context.gameState) {
      throw new Error('Game state is required in execution context');
    }
    
    if (this.config.tier === 1 && !context.civilizationContext) {
      throw new Error('Civilization context is required for tier 1 systems');
    }
    
    // Validate required knobs are present
    for (const requiredKnob of this.config.requiredKnobs) {
      if (!(requiredKnob in context.knobSettings) && !(requiredKnob in this.currentKnobs)) {
        throw new Error(`Required knob '${requiredKnob}' not provided`);
      }
    }
  }

  private async processAPTExecutions(context: APIExecutionContext): Promise<Map<string, any>> {
    const aptResults = new Map<string, any>();
    
    // This would process any queued APT executions for this system
    // For now, return empty results
    
    return aptResults;
  }

  private combineResults(
    systemResult: any,
    aptResults: Map<string, any>,
    context: APIExecutionContext,
    startTime: number
  ): APIExecutionResult {
    const executionTime = performance.now() - startTime;
    
    return {
      executionId: context.executionId,
      systemId: this.config.systemId,
      success: true,
      executionTime,
      timestamp: new Date(),
      gameStateUpdates: systemResult.gameStateUpdates || {},
      civilizationUpdates: new Map(),
      systemOutputs: systemResult.systemOutputs || {},
      aiInsights: [],
      recommendations: [],
      eventsGenerated: systemResult.eventsGenerated || [],
      scheduledActions: systemResult.scheduledActions || [],
      executionMetrics: {
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed,
        cpuTime: executionTime, // Simplified
        cacheHits: 0,
        cacheMisses: 0,
        retryCount: 0,
        fallbacksUsed: 0
      }
    };
  }

  private createErrorResult(
    context: APIExecutionContext,
    error: Error,
    executionTime: number
  ): APIExecutionResult {
    return {
      executionId: context.executionId,
      systemId: this.config.systemId,
      success: false,
      executionTime,
      timestamp: new Date(),
      gameStateUpdates: {},
      civilizationUpdates: new Map(),
      systemOutputs: null,
      eventsGenerated: [],
      scheduledActions: [],
      executionMetrics: {
        executionTime,
        memoryUsage: 0,
        cpuTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        retryCount: 0,
        fallbacksUsed: 1
      },
      error: error.message
    };
  }

  private recordExecution(success: boolean, executionTime: number, error?: string): void {
    this.executionHistory.push({
      timestamp: new Date(),
      success,
      executionTime,
      error
    });
    
    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }
    
    // Emit execution event
    this.emit('executionCompleted', {
      systemId: this.config.systemId,
      success,
      executionTime,
      error
    });
  }

  private validateKnobs(knobs: SystemKnobSettings): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const [name, value] of Object.entries(knobs)) {
      const definition = this.knobDefinitions.get(name);
      
      if (!definition) {
        errors.push(`Unknown knob: ${name}`);
        continue;
      }
      
      // Type validation
      if (definition.type === 'number' && typeof value !== 'number') {
        errors.push(`Knob ${name} must be a number`);
        continue;
      }
      
      if (definition.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Knob ${name} must be a boolean`);
        continue;
      }
      
      if (definition.type === 'string' && typeof value !== 'string') {
        errors.push(`Knob ${name} must be a string`);
        continue;
      }
      
      // Range validation for numbers
      if (definition.type === 'number') {
        if (definition.minValue !== undefined && value < definition.minValue) {
          errors.push(`Knob ${name} must be >= ${definition.minValue}`);
        }
        if (definition.maxValue !== undefined && value > definition.maxValue) {
          errors.push(`Knob ${name} must be <= ${definition.maxValue}`);
        }
      }
      
      // Enum validation
      if (definition.type === 'enum' && definition.enumValues) {
        if (!definition.enumValues.includes(String(value))) {
          errors.push(`Knob ${name} must be one of: ${definition.enumValues.join(', ')}`);
        }
      }
    }
    
    // Check required knobs
    for (const definition of this.knobDefinitions.values()) {
      if (definition.required && !(definition.name in knobs) && !(definition.name in this.currentKnobs)) {
        errors.push(`Required knob ${definition.name} is missing`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  private validateCurrentKnobs(): { valid: boolean; errors: string[] } {
    return this.validateKnobs(this.currentKnobs);
  }
}

/**
 * Utility function to create a basic API configuration
 */
export function createAPIConfig(
  systemId: string,
  overrides: Partial<APIConfig> = {}
): APIConfig {
  return {
    systemId,
    name: overrides.name || systemId,
    description: overrides.description || `${systemId} system`,
    tier: overrides.tier || 1,
    executionGroup: overrides.executionGroup || 'civilization',
    priority: overrides.priority || 'medium',
    frequency: overrides.frequency || 'every_tick',
    estimatedExecutionTime: overrides.estimatedExecutionTime || 2000,
    timeoutMs: overrides.timeoutMs || 30000,
    requiredKnobs: overrides.requiredKnobs || [],
    optionalKnobs: overrides.optionalKnobs || [],
    dependsOn: overrides.dependsOn || [],
    ...overrides
  };
}

/**
 * Utility function to create a knob definition
 */
export function createKnobDefinition(
  name: string,
  type: 'number' | 'boolean' | 'string' | 'enum',
  defaultValue: any,
  overrides: Partial<KnobDefinition> = {}
): KnobDefinition {
  return {
    name,
    type,
    defaultValue,
    description: overrides.description || `${name} setting`,
    required: overrides.required || false,
    category: overrides.category || 'general',
    ...overrides
  };
}
