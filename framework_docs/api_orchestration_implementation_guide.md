# 🛠️ StarTales: API Orchestration Implementation Guide

## Table of Contents
1. [Implementation Roadmap](#implementation-roadmap)
2. [Core Infrastructure Setup](#core-infrastructure-setup)
3. [API Integration Patterns](#api-integration-patterns)
4. [APT Implementation Templates](#apt-implementation-templates)
5. [Testing & Validation Framework](#testing--validation-framework)

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-2)
```typescript
// 1. Game State Manager
class GameStateManager {
  async getCurrentState(): Promise<GameStateSnapshot> {
    // Aggregate state from all systems
    const [
      civilizations,
      galacticState,
      economicState,
      politicalState,
      militaryState
    ] = await Promise.all([
      this.getCivilizationStates(),
      this.getGalacticState(),
      this.getEconomicState(),
      this.getPoliticalState(),
      this.getMilitaryState()
    ]);
    
    return {
      currentTurn: this.currentTick,
      gamePhase: this.determineGamePhase(),
      civilizations,
      galacticState,
      economicSituation: economicState,
      politicalSituation: politicalState,
      militarySituation: militaryState,
      timestamp: new Date()
    };
  }
}

// 2. API Registry
class APIRegistry {
  private apis: Map<string, APIDefinition> = new Map();
  
  registerAPI(definition: APIDefinition): void {
    this.apis.set(definition.id, definition);
  }
  
  getAPI(id: string): APIDefinition | undefined {
    return this.apis.get(id);
  }
  
  getAllAPIs(): APIDefinition[] {
    return Array.from(this.apis.values());
  }
}

// 3. Execution Engine
class ExecutionEngine {
  async executeAPI(
    apiId: string, 
    context: APIExecutionContext
  ): Promise<APIExecutionResult> {
    const api = this.registry.getAPI(apiId);
    if (!api) throw new Error(`API not found: ${apiId}`);
    
    // Pre-execution validation
    await this.validateContext(context, api.requirements);
    
    // Execute with monitoring
    const result = await this.monitoredExecution(api, context);
    
    // Post-execution processing
    return this.processResult(result, context);
  }
}
```

### Phase 2: APT System Implementation (Weeks 3-4)
```typescript
// APT Template Engine
class APTEngine {
  private templates: Map<string, APTTemplate> = new Map();
  
  async executeAPT(
    templateId: string,
    variables: Record<string, any>,
    context: ExecutionContext
  ): Promise<APTResult> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`APT not found: ${templateId}`);
    
    // Build prompt from template
    const prompt = this.buildPrompt(template, variables);
    
    // Execute AI analysis
    const aiResult = await this.aiEngine.analyze({
      prompt,
      context: context.gameState,
      model: template.preferredModel,
      temperature: template.temperature
    });
    
    // Parse and validate result
    return this.parseAPTResult(aiResult, template.outputSchema);
  }
  
  private buildPrompt(template: APTTemplate, variables: Record<string, any>): string {
    let prompt = template.promptTemplate;
    
    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return prompt;
  }
}
```

### Phase 3: Orchestration Layer (Weeks 5-6)
```typescript
// Master Orchestrator Implementation
class SimulationOrchestrator {
  private tickInterval = 120000; // 2 minutes
  private isRunning = false;
  
  async start(): Promise<void> {
    this.isRunning = true;
    this.scheduleNextTick();
  }
  
  private async scheduleNextTick(): Promise<void> {
    if (!this.isRunning) return;
    
    setTimeout(async () => {
      try {
        await this.executeTick();
      } catch (error) {
        console.error('Tick execution failed:', error);
      } finally {
        this.scheduleNextTick();
      }
    }, this.tickInterval);
  }
  
  private async executeTick(): Promise<void> {
    const tickId = this.generateTickId();
    console.log(`Starting tick ${tickId}`);
    
    // Phase 1: Prepare context
    const context = await this.prepareExecutionContext();
    
    // Phase 2: Execute systems
    const results = await this.executeAllSystems(context);
    
    // Phase 3: Process results
    await this.processTickResults(results, tickId);
    
    console.log(`Completed tick ${tickId}`);
  }
}
```

---

## Core Infrastructure Setup

### Database Schema for Game State
```sql
-- Core game state table
CREATE TABLE game_state (
  id SERIAL PRIMARY KEY,
  tick_number INTEGER NOT NULL,
  game_phase VARCHAR(50) NOT NULL,
  state_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Civilization state table
CREATE TABLE civilization_state (
  id SERIAL PRIMARY KEY,
  civilization_id VARCHAR(100) NOT NULL,
  tick_number INTEGER NOT NULL,
  state_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tick_number) REFERENCES game_state(tick_number)
);

-- API execution log
CREATE TABLE api_executions (
  id SERIAL PRIMARY KEY,
  api_id VARCHAR(100) NOT NULL,
  tick_number INTEGER NOT NULL,
  execution_context JSONB NOT NULL,
  execution_result JSONB NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- APT execution log
CREATE TABLE apt_executions (
  id SERIAL PRIMARY KEY,
  apt_id VARCHAR(100) NOT NULL,
  tick_number INTEGER NOT NULL,
  prompt_variables JSONB NOT NULL,
  ai_response JSONB NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Configuration Management
```typescript
interface OrchestrationConfig {
  tickInterval: number;
  maxConcurrentExecutions: number;
  timeoutMs: number;
  retryAttempts: number;
  
  // Performance thresholds
  maxExecutionTime: number;
  maxMemoryUsage: number;
  
  // AI configuration
  aiModels: {
    primary: string;
    fallback: string;
    research: string;
  };
  
  // System priorities
  systemPriorities: Record<string, 'critical' | 'high' | 'medium' | 'low'>;
}

const defaultConfig: OrchestrationConfig = {
  tickInterval: 120000,
  maxConcurrentExecutions: 10,
  timeoutMs: 30000,
  retryAttempts: 3,
  maxExecutionTime: 5000,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  aiModels: {
    primary: 'claude-3-sonnet',
    fallback: 'gpt-4',
    research: 'perplexity-sonar'
  },
  systemPriorities: {
    'population': 'high',
    'economics': 'high',
    'military': 'critical',
    'entertainment': 'low'
  }
};
```

---

## API Integration Patterns

### Standard API Wrapper
```typescript
// Base API class that all systems extend
abstract class BaseAPI {
  protected pool: Pool;
  protected config: SystemConfig;
  protected aptEngine: APTEngine;
  
  constructor(pool: Pool, config: SystemConfig, aptEngine: APTEngine) {
    this.pool = pool;
    this.config = config;
    this.aptEngine = aptEngine;
  }
  
  abstract async execute(context: APIExecutionContext): Promise<APIExecutionResult>;
  
  protected async executeWithAPT(
    aptId: string,
    variables: Record<string, any>,
    context: APIExecutionContext
  ): Promise<any> {
    return this.aptEngine.executeAPT(aptId, variables, context);
  }
  
  protected async updateGameState(
    updates: Partial<GameStateSnapshot>
  ): Promise<void> {
    // Standard game state update logic
    await this.pool.query(
      'UPDATE game_state SET state_data = state_data || $1 WHERE tick_number = $2',
      [JSON.stringify(updates), context.currentTick]
    );
  }
}

// Example: Population API Implementation
class PopulationAPI extends BaseAPI {
  async execute(context: APIExecutionContext): Promise<APIExecutionResult> {
    const civilizationId = context.civilizationContext.id;
    
    // Get current population data
    const currentPopulation = await this.getCurrentPopulation(civilizationId);
    
    // Execute Population Growth Analysis APT
    const growthAnalysis = await this.executeWithAPT('population-growth-analysis', {
      currentPopulation: JSON.stringify(currentPopulation),
      economicConditions: JSON.stringify(context.gameState.economicSituation),
      healthcareQuality: context.civilizationContext.healthcareIndex,
      educationLevel: context.civilizationContext.educationIndex,
      politicalStability: context.gameState.politicalSituation.stability
    }, context);
    
    // Apply growth calculations
    const populationUpdates = await this.calculatePopulationChanges(
      currentPopulation,
      growthAnalysis
    );
    
    // Execute Migration Impact Assessment APT if needed
    let migrationEffects = null;
    if (context.gameState.activeMigrationEvents.length > 0) {
      migrationEffects = await this.executeWithAPT('migration-impact-assessment', {
        currentDemographics: JSON.stringify(currentPopulation.demographics),
        migrationEvents: JSON.stringify(context.gameState.activeMigrationEvents),
        economicCapacity: context.civilizationContext.economicCapacity
      }, context);
    }
    
    // Consolidate results
    const finalPopulationState = this.consolidatePopulationUpdates(
      populationUpdates,
      migrationEffects
    );
    
    return {
      gameStateUpdates: {
        civilizations: {
          [civilizationId]: {
            population: finalPopulationState
          }
        }
      },
      systemOutputs: {
        populationGrowthRate: growthAnalysis.growthRate,
        demographicChanges: finalPopulationState.demographicChanges,
        migrationImpact: migrationEffects?.impact || null
      },
      aiInsights: [growthAnalysis, migrationEffects].filter(Boolean),
      eventsGenerated: this.generatePopulationEvents(finalPopulationState),
      executionMetrics: {
        executionTime: Date.now() - context.startTime,
        memoryUsage: process.memoryUsage().heapUsed
      }
    };
  }
}
```

### Inter-System Communication
```typescript
// Event-driven communication between systems
class SystemEventBus {
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  
  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }
  
  async publish(event: SystemEvent): Promise<void> {
    const handlers = this.eventHandlers.get(event.type) || [];
    
    // Execute handlers in parallel
    await Promise.all(
      handlers.map(handler => 
        this.executeHandler(handler, event).catch(error => 
          console.error(`Handler failed for event ${event.type}:`, error)
        )
      )
    );
  }
  
  private async executeHandler(handler: EventHandler, event: SystemEvent): Promise<void> {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Handler timeout')), 5000)
    );
    
    await Promise.race([
      handler.handle(event),
      timeout
    ]);
  }
}

// Example: Economic system listening to population changes
class EconomicsAPI extends BaseAPI {
  constructor(pool: Pool, config: SystemConfig, aptEngine: APTEngine, eventBus: SystemEventBus) {
    super(pool, config, aptEngine);
    
    // Subscribe to population events
    eventBus.subscribe('population-changed', {
      handle: async (event: SystemEvent) => {
        await this.handlePopulationChange(event.data);
      }
    });
  }
  
  private async handlePopulationChange(populationData: any): Promise<void> {
    // Recalculate labor market based on population changes
    const laborMarketAnalysis = await this.executeWithAPT('labor-market-analysis', {
      populationChange: JSON.stringify(populationData),
      currentEconomicState: JSON.stringify(await this.getCurrentEconomicState())
    }, this.getCurrentContext());
    
    // Update economic indicators
    await this.updateLaborMarket(laborMarketAnalysis);
  }
}
```

---

## APT Implementation Templates

### APT Definition Structure
```typescript
interface APTTemplate {
  id: string;
  name: string;
  description: string;
  category: 'civilization' | 'inter-civ' | 'galactic';
  
  // Prompt configuration
  promptTemplate: string;
  requiredVariables: string[];
  optionalVariables: string[];
  
  // AI configuration
  preferredModel: string;
  temperature: number;
  maxTokens: number;
  
  // Output configuration
  outputSchema: JSONSchema;
  outputFormat: 'json' | 'structured_text' | 'narrative';
  
  // Execution configuration
  timeoutMs: number;
  retryAttempts: number;
  cacheable: boolean;
}

// Example APT: Population Growth Analysis
const populationGrowthAnalysisAPT: APTTemplate = {
  id: 'population-growth-analysis',
  name: 'Population Growth Analysis',
  description: 'Analyzes demographic trends and predicts population changes',
  category: 'civilization',
  
  promptTemplate: `
    Analyze population growth for this civilization:
    
    Current Population Data:
    {currentPopulation}
    
    Economic Conditions:
    - GDP Growth: {gdpGrowth}%
    - Unemployment: {unemployment}%
    - Income Inequality: {incomeInequality}
    
    Social Conditions:
    - Healthcare Quality Index: {healthcareQuality}/100
    - Education Level Index: {educationLevel}/100
    - Political Stability: {politicalStability}/100
    
    Environmental Factors:
    - Climate Conditions: {climateConditions}
    - Resource Availability: {resourceAvailability}
    - Urban Development: {urbanDevelopment}
    
    Analyze and predict:
    1. Population growth rate for next period
    2. Demographic shifts (age distribution, birth/death rates)
    3. Migration pressures (internal and external)
    4. Social stability implications
    5. Economic impact of population changes
    6. Policy recommendations for population management
    
    Provide specific numerical predictions and actionable insights.
  `,
  
  requiredVariables: [
    'currentPopulation', 'gdpGrowth', 'unemployment', 'healthcareQuality', 
    'educationLevel', 'politicalStability'
  ],
  optionalVariables: [
    'incomeInequality', 'climateConditions', 'resourceAvailability', 'urbanDevelopment'
  ],
  
  preferredModel: 'claude-3-sonnet',
  temperature: 0.3,
  maxTokens: 2000,
  
  outputSchema: {
    type: 'object',
    properties: {
      growthRate: { type: 'number', minimum: -0.1, maximum: 0.1 },
      demographicChanges: {
        type: 'object',
        properties: {
          birthRate: { type: 'number' },
          deathRate: { type: 'number' },
          ageDistributionShift: { type: 'object' }
        }
      },
      migrationPressures: {
        type: 'object',
        properties: {
          internal: { type: 'number' },
          external: { type: 'number' },
          factors: { type: 'array', items: { type: 'string' } }
        }
      },
      socialStabilityImpact: { type: 'number', minimum: -1, maximum: 1 },
      economicImpact: {
        type: 'object',
        properties: {
          laborForceChange: { type: 'number' },
          consumerDemandChange: { type: 'number' },
          socialServicesStrain: { type: 'number' }
        }
      },
      policyRecommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            policy: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            expectedImpact: { type: 'string' }
          }
        }
      }
    },
    required: ['growthRate', 'demographicChanges', 'socialStabilityImpact']
  },
  
  outputFormat: 'json',
  timeoutMs: 30000,
  retryAttempts: 2,
  cacheable: true
};
```

### APT Execution Engine
```typescript
class APTExecutionEngine {
  private aiProviders: Map<string, AIProvider> = new Map();
  private cache: Map<string, CachedResult> = new Map();
  
  async executeAPT(
    template: APTTemplate,
    variables: Record<string, any>,
    context: ExecutionContext
  ): Promise<APTResult> {
    // Validate required variables
    this.validateVariables(template, variables);
    
    // Check cache if enabled
    if (template.cacheable) {
      const cached = this.checkCache(template.id, variables);
      if (cached && !this.isCacheExpired(cached)) {
        return cached.result;
      }
    }
    
    // Build prompt
    const prompt = this.buildPrompt(template.promptTemplate, variables);
    
    // Execute AI call with retry logic
    const aiResult = await this.executeWithRetry(
      () => this.callAI(template, prompt, context),
      template.retryAttempts
    );
    
    // Parse and validate result
    const parsedResult = this.parseResult(aiResult, template.outputSchema);
    
    // Cache result if enabled
    if (template.cacheable) {
      this.cacheResult(template.id, variables, parsedResult);
    }
    
    return parsedResult;
  }
  
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxAttempts) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }
    
    throw lastError!;
  }
}
```

---

## Testing & Validation Framework

### Integration Testing
```typescript
// Test framework for API orchestration
class OrchestrationTestFramework {
  private testDatabase: Pool;
  private mockAIProvider: MockAIProvider;
  
  async runIntegrationTest(testScenario: TestScenario): Promise<TestResult> {
    // Setup test environment
    await this.setupTestEnvironment(testScenario);
    
    // Execute test scenario
    const startTime = Date.now();
    
    try {
      const result = await this.executeTestScenario(testScenario);
      
      // Validate results
      const validationResults = await this.validateResults(result, testScenario.expectedOutcomes);
      
      return {
        success: validationResults.allPassed,
        executionTime: Date.now() - startTime,
        validationResults,
        actualResults: result
      };
      
    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        error: error.message
      };
    } finally {
      await this.cleanupTestEnvironment();
    }
  }
  
  // Test scenario: Population growth with economic crisis
  async testPopulationDuringEconomicCrisis(): Promise<TestResult> {
    const scenario: TestScenario = {
      name: 'Population Growth During Economic Crisis',
      initialGameState: {
        currentTurn: 50,
        gamePhase: 'mid_game',
        economicSituation: {
          gdp: -5.2, // Economic recession
          unemployment: 15.8,
          inflation: 8.3
        },
        politicalSituation: {
          stability: 0.3 // Low stability
        }
      },
      expectedOutcomes: {
        populationGrowthRate: { min: -0.02, max: 0.01 }, // Negative or very low growth
        migrationPressures: { external: { min: 0.3, max: 0.8 } }, // High emigration pressure
        socialStabilityImpact: { min: -0.8, max: -0.3 } // Negative social impact
      }
    };
    
    return this.runIntegrationTest(scenario);
  }
}

// Performance testing
class PerformanceTestSuite {
  async testTickPerformance(civilizationCount: number): Promise<PerformanceReport> {
    const orchestrator = new SimulationOrchestrator();
    
    // Setup test civilizations
    await this.setupTestCivilizations(civilizationCount);
    
    // Measure tick execution time
    const tickTimes: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      await orchestrator.executeTick();
      const endTime = performance.now();
      
      tickTimes.push(endTime - startTime);
    }
    
    return {
      civilizationCount,
      averageTickTime: tickTimes.reduce((a, b) => a + b) / tickTimes.length,
      maxTickTime: Math.max(...tickTimes),
      minTickTime: Math.min(...tickTimes),
      tickTimes
    };
  }
}
```

### Validation Rules
```typescript
interface ValidationRule {
  name: string;
  validate: (result: any, context: ValidationContext) => ValidationResult;
}

const validationRules: ValidationRule[] = [
  {
    name: 'Population Growth Rate Bounds',
    validate: (result, context) => {
      const growthRate = result.populationGrowthRate;
      const isValid = growthRate >= -0.1 && growthRate <= 0.1;
      
      return {
        passed: isValid,
        message: isValid 
          ? 'Population growth rate within valid bounds'
          : `Invalid growth rate: ${growthRate}. Must be between -0.1 and 0.1`
      };
    }
  },
  
  {
    name: 'Economic Indicators Consistency',
    validate: (result, context) => {
      const { gdp, unemployment, inflation } = result.economicIndicators;
      
      // High unemployment should correlate with low GDP growth
      if (unemployment > 10 && gdp > 3) {
        return {
          passed: false,
          message: `Inconsistent economic indicators: High unemployment (${unemployment}%) with high GDP growth (${gdp}%)`
        };
      }
      
      return {
        passed: true,
        message: 'Economic indicators are consistent'
      };
    }
  }
];
```

This implementation guide provides a concrete roadmap for building the comprehensive API orchestration system, complete with code examples, testing frameworks, and validation rules. The modular design allows for incremental implementation while maintaining system integrity and performance.
