/**
 * APTEngine - AI Prompt Template execution engine with caching and fallbacks
 * 
 * This class is responsible for:
 * - Managing and executing AI Prompt Templates (APTs)
 * - Template registration and discovery
 * - Variable substitution and prompt building
 * - AI model integration and response parsing
 * - Result caching and performance optimization
 */

import { EventEmitter } from 'events';
import {
  APTTemplate,
  APTExecutionRequest,
  APTExecutionResult,
  IAPTEngine,
  APIExecutionContext
} from './types';

interface AIProvider {
  name: string;
  execute(prompt: string, options: any): Promise<string>;
  isAvailable(): boolean;
}

interface TemplateCache {
  template: APTTemplate;
  lastUsed: Date;
  usageCount: number;
}

export class APTEngine extends EventEmitter implements IAPTEngine {
  private templates: Map<string, TemplateCache> = new Map();
  private aiProviders: Map<string, AIProvider> = new Map();
  private defaultProvider: string = 'claude-3-sonnet';
  private executionHistory: Map<string, APTExecutionResult[]> = new Map();

  constructor() {
    super();
    this.initializeDefaultProviders();
    this.registerDefaultTemplates();
  }

  /**
   * Execute an APT with the given variables and context
   */
  async executeAPT(request: APTExecutionRequest): Promise<APTExecutionResult> {
    const startTime = performance.now();
    const executionId = this.generateExecutionId();
    
    try {
      console.log(`🤖 Executing APT: ${request.aptId} (${executionId})`);
      
      // Get template
      const template = this.getTemplate(request.aptId);
      if (!template) {
        throw new Error(`APT template not found: ${request.aptId}`);
      }
      
      // Apply overrides if provided
      const effectiveTemplate = { ...template, ...request.overrides };
      
      // Validate required variables
      this.validateVariables(effectiveTemplate, request.variables);
      
      // Build prompt from template
      const prompt = this.buildPrompt(effectiveTemplate, request.variables);
      
      // Execute AI call
      const rawResponse = await this.executeAICall(effectiveTemplate, prompt);
      
      // Parse response
      const parsedResult = this.parseResponse(effectiveTemplate, rawResponse);
      
      const executionTime = performance.now() - startTime;
      
      const result: APTExecutionResult = {
        executionId,
        aptId: request.aptId,
        success: true,
        executionTime,
        timestamp: new Date(),
        rawResponse,
        parsedResult,
        confidence: this.calculateConfidence(parsedResult),
        cacheHit: false,
        qualityScore: this.calculateQualityScore(parsedResult, executionTime),
        retryCount: 0
      };
      
      // Record execution
      this.recordExecution(request.aptId, result);
      
      // Update template usage
      this.updateTemplateUsage(request.aptId);
      
      console.log(`✅ APT executed successfully: ${request.aptId} in ${executionTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      console.error(`❌ APT execution failed: ${request.aptId}:`, error);
      
      const errorResult: APTExecutionResult = {
        executionId,
        aptId: request.aptId,
        success: false,
        executionTime,
        timestamp: new Date(),
        rawResponse: '',
        parsedResult: null,
        cacheHit: false,
        qualityScore: 0,
        error: error.message,
        retryCount: 0
      };
      
      this.recordExecution(request.aptId, errorResult);
      
      return errorResult;
    }
  }

  /**
   * Register a new APT template
   */
  registerTemplate(template: APTTemplate): void {
    console.log(`📝 Registering APT template: ${template.id}`);
    
    // Validate template
    const validation = this.validateTemplate(template);
    if (!validation.valid) {
      throw new Error(`Invalid APT template: ${validation.errors.join(', ')}`);
    }
    
    this.templates.set(template.id, {
      template,
      lastUsed: new Date(),
      usageCount: 0
    });
    
    console.log(`✅ APT template registered: ${template.id}`);
    this.emit('templateRegistered', template);
  }

  /**
   * Get a template by ID
   */
  getTemplate(aptId: string): APTTemplate | undefined {
    const cached = this.templates.get(aptId);
    return cached?.template;
  }

  /**
   * Get all registered templates
   */
  getAllTemplates(): APTTemplate[] {
    return Array.from(this.templates.values()).map(cache => cache.template);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: 'civilization' | 'inter-civ' | 'galactic'): APTTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  /**
   * Get execution statistics for an APT
   */
  getAPTStatistics(aptId: string): {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    averageQualityScore: number;
    lastExecution: Date | null;
  } {
    const history = this.executionHistory.get(aptId) || [];
    
    if (history.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 0,
        averageExecutionTime: 0,
        averageQualityScore: 0,
        lastExecution: null
      };
    }
    
    const successful = history.filter(h => h.success);
    const totalTime = history.reduce((sum, h) => sum + h.executionTime, 0);
    const totalQuality = history.reduce((sum, h) => sum + h.qualityScore, 0);
    
    return {
      totalExecutions: history.length,
      successRate: successful.length / history.length,
      averageExecutionTime: totalTime / history.length,
      averageQualityScore: totalQuality / history.length,
      lastExecution: history[history.length - 1]?.timestamp || null
    };
  }

  /**
   * Get overall APT engine statistics
   */
  getEngineStatistics(): {
    totalTemplates: number;
    totalExecutions: number;
    overallSuccessRate: number;
    averageExecutionTime: number;
    templateUsage: Map<string, number>;
  } {
    let totalExecutions = 0;
    let totalSuccessful = 0;
    let totalTime = 0;
    const templateUsage = new Map<string, number>();
    
    for (const [aptId, history] of this.executionHistory) {
      totalExecutions += history.length;
      totalSuccessful += history.filter(h => h.success).length;
      totalTime += history.reduce((sum, h) => sum + h.executionTime, 0);
      
      const cached = this.templates.get(aptId);
      if (cached) {
        templateUsage.set(aptId, cached.usageCount);
      }
    }
    
    return {
      totalTemplates: this.templates.size,
      totalExecutions,
      overallSuccessRate: totalExecutions > 0 ? totalSuccessful / totalExecutions : 0,
      averageExecutionTime: totalExecutions > 0 ? totalTime / totalExecutions : 0,
      templateUsage
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private buildPrompt(template: APTTemplate, variables: Record<string, any>): string {
    let prompt = template.promptTemplate;
    
    // Replace all variables in the template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      prompt = prompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), stringValue);
    }
    
    // Check for unreplaced variables
    const unreplacedVars = prompt.match(/\{[^}]+\}/g);
    if (unreplacedVars) {
      console.warn(`⚠️ Unreplaced variables in APT ${template.id}:`, unreplacedVars);
    }
    
    return prompt;
  }

  private validateVariables(template: APTTemplate, variables: Record<string, any>): void {
    // Check required variables
    for (const required of template.requiredVariables) {
      if (!(required in variables)) {
        throw new Error(`Required variable '${required}' not provided for APT ${template.id}`);
      }
    }
    
    // Warn about unknown variables
    const knownVariables = [...template.requiredVariables, ...template.optionalVariables];
    for (const provided of Object.keys(variables)) {
      if (!knownVariables.includes(provided)) {
        console.warn(`⚠️ Unknown variable '${provided}' provided to APT ${template.id}`);
      }
    }
  }

  private async executeAICall(template: APTTemplate, prompt: string): Promise<string> {
    const provider = this.aiProviders.get(template.preferredModel) || 
                    this.aiProviders.get(this.defaultProvider);
    
    if (!provider) {
      throw new Error(`No AI provider available for model: ${template.preferredModel}`);
    }
    
    if (!provider.isAvailable()) {
      throw new Error(`AI provider ${provider.name} is not available`);
    }
    
    const options = {
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      timeout: template.timeoutMs
    };
    
    return provider.execute(prompt, options);
  }

  private parseResponse(template: APTTemplate, rawResponse: string): any {
    try {
      if (template.outputFormat === 'json') {
        // Try to extract JSON from the response
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, try parsing the entire response
          return JSON.parse(rawResponse);
        }
      } else if (template.outputFormat === 'structured_text') {
        // Parse structured text format
        return this.parseStructuredText(rawResponse);
      } else {
        // Return as narrative text
        return { narrative: rawResponse };
      }
    } catch (error) {
      console.warn(`⚠️ Failed to parse APT response for ${template.id}:`, error);
      return { raw: rawResponse, parseError: error.message };
    }
  }

  private parseStructuredText(text: string): any {
    const result: any = {};
    const lines = text.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('##')) {
        currentSection = trimmed.replace('##', '').trim().toLowerCase().replace(/\s+/g, '_');
        result[currentSection] = [];
      } else if (trimmed.startsWith('-') && currentSection) {
        result[currentSection].push(trimmed.substring(1).trim());
      } else if (trimmed && !currentSection) {
        if (!result.summary) result.summary = '';
        result.summary += trimmed + ' ';
      }
    }
    
    return result;
  }

  private calculateConfidence(parsedResult: any): number {
    if (!parsedResult) return 0;
    
    // Simple confidence calculation based on result completeness
    if (parsedResult.confidence !== undefined) {
      return parsedResult.confidence;
    }
    
    if (parsedResult.parseError) return 0.1;
    
    const keys = Object.keys(parsedResult);
    if (keys.length === 0) return 0.2;
    if (keys.length < 3) return 0.5;
    
    return 0.8; // Default confidence for well-structured results
  }

  private calculateQualityScore(parsedResult: any, executionTime: number): number {
    let score = 0.5; // Base score
    
    // Bonus for successful parsing
    if (parsedResult && !parsedResult.parseError) {
      score += 0.3;
    }
    
    // Bonus for structured data
    if (parsedResult && typeof parsedResult === 'object' && Object.keys(parsedResult).length > 1) {
      score += 0.2;
    }
    
    // Penalty for slow execution
    if (executionTime > 10000) {
      score -= 0.2;
    } else if (executionTime < 2000) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  private validateTemplate(template: APTTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.promptTemplate) errors.push('Prompt template is required');
    if (!template.category || !['civilization', 'inter-civ', 'galactic'].includes(template.category)) {
      errors.push('Category must be civilization, inter-civ, or galactic');
    }
    if (!template.outputFormat || !['json', 'structured_text', 'narrative'].includes(template.outputFormat)) {
      errors.push('Output format must be json, structured_text, or narrative');
    }
    if (template.temperature < 0 || template.temperature > 1) {
      errors.push('Temperature must be between 0 and 1');
    }
    
    return { valid: errors.length === 0, errors };
  }

  private recordExecution(aptId: string, result: APTExecutionResult): void {
    if (!this.executionHistory.has(aptId)) {
      this.executionHistory.set(aptId, []);
    }
    
    const history = this.executionHistory.get(aptId)!;
    history.push(result);
    
    // Keep only last 100 executions per APT
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.emit('executionRecorded', aptId, result);
  }

  private updateTemplateUsage(aptId: string): void {
    const cached = this.templates.get(aptId);
    if (cached) {
      cached.lastUsed = new Date();
      cached.usageCount++;
    }
  }

  private generateExecutionId(): string {
    return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultProviders(): void {
    // Mock AI providers for now - these would be replaced with actual implementations
    this.aiProviders.set('claude-3-sonnet', {
      name: 'Claude 3 Sonnet',
      execute: async (prompt: string, options: any) => {
        // Simulate AI execution
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        return this.generateMockResponse(prompt, options);
      },
      isAvailable: () => true
    });
    
    this.aiProviders.set('gpt-4', {
      name: 'GPT-4',
      execute: async (prompt: string, options: any) => {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
        return this.generateMockResponse(prompt, options);
      },
      isAvailable: () => true
    });
  }

  private generateMockResponse(prompt: string, options: any): string {
    // Generate a mock response based on the prompt content
    if (prompt.includes('population')) {
      return JSON.stringify({
        growthRate: 0.02 + Math.random() * 0.01,
        demographicChanges: {
          birthRate: 0.015 + Math.random() * 0.005,
          deathRate: 0.008 + Math.random() * 0.003
        },
        socialStabilityImpact: Math.random() * 0.2 - 0.1,
        confidence: 0.8 + Math.random() * 0.2
      });
    } else if (prompt.includes('economic')) {
      return JSON.stringify({
        recommendation: Math.random() > 0.5 ? 'approve' : 'modify',
        confidence: 0.7 + Math.random() * 0.3,
        expectedROI: Math.random() * 0.15,
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      });
    } else {
      return JSON.stringify({
        analysis: 'Mock analysis result',
        confidence: 0.6 + Math.random() * 0.4,
        recommendations: ['Mock recommendation 1', 'Mock recommendation 2']
      });
    }
  }

  private registerDefaultTemplates(): void {
    // Register some basic templates
    const populationGrowthTemplate: APTTemplate = {
      id: 'population-growth-analysis',
      name: 'Population Growth Analysis',
      description: 'Analyzes demographic trends and predicts population changes',
      category: 'civilization',
      promptTemplate: `
        Analyze population growth for this civilization:
        
        Current Population: {currentPopulation}
        Economic Conditions: {economicConditions}
        Healthcare Quality: {healthcareQuality}
        Education Level: {educationLevel}
        Political Stability: {politicalStability}
        
        Provide analysis of:
        1. Population growth rate for next period
        2. Demographic shifts and social implications
        3. Policy recommendations
        
        Respond in JSON format with growthRate, demographicChanges, and socialStabilityImpact.
      `,
      requiredVariables: ['currentPopulation', 'economicConditions', 'healthcareQuality', 'educationLevel', 'politicalStability'],
      optionalVariables: [],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 10000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000,
      estimatedExecutionTime: 2000,
      memoryUsage: 50 * 1024 * 1024,
      complexity: 'medium'
    };
    
    this.registerTemplate(populationGrowthTemplate);
    
    console.log('✅ Default APT templates registered');
  }
}
