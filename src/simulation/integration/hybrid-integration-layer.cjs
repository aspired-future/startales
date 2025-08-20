// Hybrid Integration Layer - Bidirectional AI ↔ Deterministic System Integration
// Handles real-time synchronization between AI decisions and deterministic outcomes

const EventEmitter = require('events');

class HybridIntegrationLayer extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // Integration timing
            syncInterval: config.syncInterval || 1000, // 1 second sync cycles
            batchSize: config.batchSize || 100,
            maxLatency: config.maxLatency || 500, // 500ms max sync latency
            
            // Conflict resolution
            conflictResolution: config.conflictResolution || 'weighted', // 'ai-priority', 'deterministic-priority', 'weighted'
            aiWeight: config.aiWeight || 0.6, // 60% AI influence in conflicts
            deterministicWeight: config.deterministicWeight || 0.4, // 40% deterministic influence
            
            // Performance optimization
            cacheSize: config.cacheSize || 10000,
            enablePrediction: config.enablePrediction || true,
            predictionHorizon: config.predictionHorizon || 10, // 10 game days ahead
            
            ...config
        };

        // Core integration state
        this.state = {
            running: false,
            syncCycle: 0,
            lastSync: Date.now(),
            
            // Bidirectional queues
            aiToDetQueue: [], // AI decisions → Deterministic systems
            detToAiQueue: [], // Deterministic events → AI systems
            
            // Conflict tracking
            conflicts: new Map(),
            resolutions: new Map(),
            
            // Performance metrics
            syncLatency: 0,
            conflictRate: 0,
            resolutionSuccessRate: 0
        };

        // System registries
        this.aiModules = new Map(); // AI simulation modules
        this.deterministicSystems = new Map(); // Deterministic systems
        this.integrationRules = new Map(); // Integration rules and mappings
        
        // Bidirectional data flow managers
        this.dataFlowManager = new DataFlowManager(this);
        this.conflictResolver = new ConflictResolver(this.config);
        this.predictionEngine = new PredictionEngine(this.config);
        
        // Integration cache for performance
        this.integrationCache = new Map();
        
        // Sync timer
        this.syncTimer = null;
    }

    // System Registration
    registerAIModule(moduleId, module, integrationConfig) {
        this.aiModules.set(moduleId, {
            module,
            config: integrationConfig,
            lastUpdate: Date.now(),
            outputQueue: [],
            inputQueue: []
        });
        
        // Set up bidirectional event handlers
        module.on('decision', (decision) => {
            this.handleAIDecision(moduleId, decision);
        });
        
        module.on('stateChange', (change) => {
            this.handleAIStateChange(moduleId, change);
        });
        
        console.log(`AI Module registered: ${moduleId}`);
    }

    registerDeterministicSystem(systemId, system, integrationConfig) {
        this.deterministicSystems.set(systemId, {
            system,
            config: integrationConfig,
            lastUpdate: Date.now(),
            outputQueue: [],
            inputQueue: []
        });
        
        // Set up bidirectional event handlers
        system.on('stateChange', (change) => {
            this.handleDeterministicStateChange(systemId, change);
        });
        
        system.on('event', (event) => {
            this.handleDeterministicEvent(systemId, event);
        });
        
        console.log(`Deterministic System registered: ${systemId}`);
    }

    // Integration Rules Management
    addIntegrationRule(ruleId, rule) {
        this.integrationRules.set(ruleId, {
            ...rule,
            id: ruleId,
            created: Date.now(),
            usageCount: 0
        });
        
        console.log(`Integration rule added: ${ruleId}`);
    }

    // Core Integration Lifecycle
    async start() {
        if (this.state.running) return;
        
        console.log('Starting Hybrid Integration Layer...');
        this.state.running = true;
        this.state.lastSync = Date.now();
        
        // Start continuous sync cycle
        this.syncTimer = setInterval(() => {
            this.performSyncCycle();
        }, this.config.syncInterval);
        
        // Initialize prediction engine if enabled
        if (this.config.enablePrediction) {
            await this.predictionEngine.initialize();
        }
        
        this.emit('started');
        console.log('Hybrid Integration Layer started');
    }

    async stop() {
        if (!this.state.running) return;
        
        console.log('Stopping Hybrid Integration Layer...');
        this.state.running = false;
        
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        
        // Final sync
        await this.performSyncCycle();
        
        this.emit('stopped');
        console.log('Hybrid Integration Layer stopped');
    }

    // Main Sync Cycle - Bidirectional Integration
    async performSyncCycle() {
        const cycleStart = Date.now();
        this.state.syncCycle++;
        
        try {
            // Phase 1: Collect changes from all systems
            const aiChanges = await this.collectAIChanges();
            const deterministicChanges = await this.collectDeterministicChanges();
            
            // Phase 2: Detect conflicts
            const conflicts = this.detectConflicts(aiChanges, deterministicChanges);
            
            // Phase 3: Resolve conflicts
            const resolutions = await this.resolveConflicts(conflicts);
            
            // Phase 4: Apply integrated changes
            await this.applyIntegratedChanges(aiChanges, deterministicChanges, resolutions);
            
            // Phase 5: Update predictions
            if (this.config.enablePrediction) {
                await this.updatePredictions(aiChanges, deterministicChanges);
            }
            
            // Update performance metrics
            this.state.syncLatency = Date.now() - cycleStart;
            this.state.lastSync = Date.now();
            
            // Emit sync completed event
            this.emit('syncCompleted', {
                cycle: this.state.syncCycle,
                latency: this.state.syncLatency,
                aiChanges: aiChanges.length,
                deterministicChanges: deterministicChanges.length,
                conflicts: conflicts.length,
                resolutions: resolutions.length
            });
            
        } catch (error) {
            console.error('Sync cycle error:', error);
            this.emit('syncError', error);
        }
    }

    // AI → Deterministic Integration
    async handleAIDecision(moduleId, decision) {
        const integrationData = {
            source: 'ai',
            moduleId,
            type: 'decision',
            data: decision,
            timestamp: Date.now(),
            gameDay: this.getCurrentGameDay()
        };
        
        // Queue for deterministic system processing
        this.state.aiToDetQueue.push(integrationData);
        
        // Immediate processing for critical decisions
        if (decision.priority === 'critical') {
            await this.processImmediateIntegration(integrationData);
        }
        
        this.emit('aiDecision', integrationData);
    }

    async handleAIStateChange(moduleId, change) {
        const integrationData = {
            source: 'ai',
            moduleId,
            type: 'stateChange',
            data: change,
            timestamp: Date.now(),
            gameDay: this.getCurrentGameDay()
        };
        
        // Apply to relevant deterministic systems
        await this.propagateToDetSystems(integrationData);
        
        this.emit('aiStateChange', integrationData);
    }

    // Deterministic → AI Integration
    async handleDeterministicStateChange(systemId, change) {
        const integrationData = {
            source: 'deterministic',
            systemId,
            type: 'stateChange',
            data: change,
            timestamp: Date.now(),
            gameDay: this.getCurrentGameDay()
        };
        
        // Queue for AI system processing
        this.state.detToAiQueue.push(integrationData);
        
        // Apply to relevant AI modules
        await this.propagateToAIModules(integrationData);
        
        this.emit('deterministicStateChange', integrationData);
    }

    async handleDeterministicEvent(systemId, event) {
        const integrationData = {
            source: 'deterministic',
            systemId,
            type: 'event',
            data: event,
            timestamp: Date.now(),
            gameDay: this.getCurrentGameDay()
        };
        
        // Immediate AI notification for significant events
        if (event.significance === 'high') {
            await this.notifyAIModules(integrationData);
        }
        
        this.emit('deterministicEvent', integrationData);
    }

    // Bidirectional Propagation
    async propagateToDetSystems(integrationData) {
        const relevantSystems = this.findRelevantSystems('deterministic', integrationData);
        
        const propagationPromises = [];
        for (const systemId of relevantSystems) {
            const systemData = this.deterministicSystems.get(systemId);
            if (systemData) {
                propagationPromises.push(
                    this.applyToDetSystem(systemId, systemData, integrationData)
                );
            }
        }
        
        await Promise.all(propagationPromises);
    }

    async propagateToAIModules(integrationData) {
        const relevantModules = this.findRelevantSystems('ai', integrationData);
        
        const propagationPromises = [];
        for (const moduleId of relevantModules) {
            const moduleData = this.aiModules.get(moduleId);
            if (moduleData) {
                propagationPromises.push(
                    this.applyToAIModule(moduleId, moduleData, integrationData)
                );
            }
        }
        
        await Promise.all(propagationPromises);
    }

    async applyToDetSystem(systemId, systemData, integrationData) {
        try {
            // Transform AI data for deterministic system
            const transformedData = await this.transformForDetSystem(
                systemId, 
                integrationData
            );
            
            // Apply to system
            if (systemData.system.applyIntegration) {
                await systemData.system.applyIntegration(transformedData);
            }
            
            // Update system queue
            systemData.inputQueue.push({
                ...integrationData,
                transformed: transformedData,
                applied: Date.now()
            });
            
        } catch (error) {
            console.error(`Error applying to deterministic system ${systemId}:`, error);
        }
    }

    async applyToAIModule(moduleId, moduleData, integrationData) {
        try {
            // Transform deterministic data for AI module
            const transformedData = await this.transformForAIModule(
                moduleId, 
                integrationData
            );
            
            // Apply to module
            if (moduleData.module.receiveIntegration) {
                await moduleData.module.receiveIntegration(transformedData);
            }
            
            // Update module queue
            moduleData.inputQueue.push({
                ...integrationData,
                transformed: transformedData,
                applied: Date.now()
            });
            
        } catch (error) {
            console.error(`Error applying to AI module ${moduleId}:`, error);
        }
    }

    // Data Transformation
    async transformForDetSystem(systemId, integrationData) {
        const systemConfig = this.deterministicSystems.get(systemId)?.config;
        if (!systemConfig?.transformation) {
            return integrationData.data;
        }
        
        // Apply transformation rules
        return await this.applyTransformationRules(
            integrationData.data,
            systemConfig.transformation,
            'ai-to-deterministic'
        );
    }

    async transformForAIModule(moduleId, integrationData) {
        const moduleConfig = this.aiModules.get(moduleId)?.config;
        if (!moduleConfig?.transformation) {
            return integrationData.data;
        }
        
        // Apply transformation rules
        return await this.applyTransformationRules(
            integrationData.data,
            moduleConfig.transformation,
            'deterministic-to-ai'
        );
    }

    async applyTransformationRules(data, transformationConfig, direction) {
        let transformedData = { ...data };
        
        for (const rule of transformationConfig.rules || []) {
            if (rule.direction === direction || rule.direction === 'bidirectional') {
                transformedData = await this.executeTransformationRule(
                    transformedData, 
                    rule
                );
            }
        }
        
        return transformedData;
    }

    async executeTransformationRule(data, rule) {
        switch (rule.type) {
            case 'mapping':
                return this.applyFieldMapping(data, rule.mapping);
            
            case 'scaling':
                return this.applyScaling(data, rule.scale);
            
            case 'aggregation':
                return this.applyAggregation(data, rule.aggregation);
            
            case 'custom':
                return await rule.transform(data);
            
            default:
                console.warn(`Unknown transformation rule type: ${rule.type}`);
                return data;
        }
    }

    // Conflict Detection and Resolution
    detectConflicts(aiChanges, deterministicChanges) {
        const conflicts = [];
        
        // Check for overlapping changes
        for (const aiChange of aiChanges) {
            for (const detChange of deterministicChanges) {
                if (this.changesConflict(aiChange, detChange)) {
                    conflicts.push({
                        id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        aiChange,
                        detChange,
                        severity: this.calculateConflictSeverity(aiChange, detChange),
                        timestamp: Date.now()
                    });
                }
            }
        }
        
        return conflicts;
    }

    changesConflict(aiChange, detChange) {
        // Check if changes affect the same game entities or systems
        return (
            aiChange.data.entityId === detChange.data.entityId ||
            aiChange.data.systemId === detChange.data.systemId ||
            this.hasOverlappingEffects(aiChange, detChange)
        );
    }

    hasOverlappingEffects(change1, change2) {
        // Check for overlapping effects based on integration rules
        const effects1 = this.getChangeEffects(change1);
        const effects2 = this.getChangeEffects(change2);
        
        return effects1.some(effect1 => 
            effects2.some(effect2 => 
                effect1.target === effect2.target && 
                effect1.property === effect2.property
            )
        );
    }

    async resolveConflicts(conflicts) {
        const resolutions = [];
        
        for (const conflict of conflicts) {
            const resolution = await this.conflictResolver.resolve(conflict);
            resolutions.push(resolution);
            
            // Cache resolution for similar future conflicts
            this.cacheResolution(conflict, resolution);
        }
        
        return resolutions;
    }

    // System Discovery
    findRelevantSystems(systemType, integrationData) {
        const relevantSystems = [];
        
        // Use integration rules to find relevant systems
        for (const [ruleId, rule] of this.integrationRules) {
            if (this.ruleMatches(rule, integrationData)) {
                const targetSystems = systemType === 'ai' ? 
                    rule.targetAIModules : 
                    rule.targetDetSystems;
                
                relevantSystems.push(...(targetSystems || []));
                rule.usageCount++;
            }
        }
        
        return [...new Set(relevantSystems)]; // Remove duplicates
    }

    ruleMatches(rule, integrationData) {
        // Check if integration rule applies to this data
        if (rule.sourceType && rule.sourceType !== integrationData.source) {
            return false;
        }
        
        if (rule.dataType && rule.dataType !== integrationData.type) {
            return false;
        }
        
        if (rule.conditions) {
            return this.evaluateConditions(rule.conditions, integrationData);
        }
        
        return true;
    }

    evaluateConditions(conditions, integrationData) {
        // Evaluate rule conditions
        for (const condition of conditions) {
            if (!this.evaluateCondition(condition, integrationData)) {
                return false;
            }
        }
        return true;
    }

    // Utility Methods
    getCurrentGameDay() {
        // Get current game day from simulation engine
        return this.simulationEngine?.state?.currentGameDay || 0;
    }

    cacheResolution(conflict, resolution) {
        const cacheKey = this.getConflictCacheKey(conflict);
        this.integrationCache.set(cacheKey, {
            resolution,
            timestamp: Date.now(),
            usageCount: 0
        });
    }

    getConflictCacheKey(conflict) {
        return `${conflict.aiChange.type}_${conflict.detChange.type}_${conflict.severity}`;
    }

    // Public API
    getIntegrationState() {
        return {
            running: this.state.running,
            syncCycle: this.state.syncCycle,
            lastSync: this.state.lastSync,
            syncLatency: this.state.syncLatency,
            
            // System counts
            aiModules: this.aiModules.size,
            deterministicSystems: this.deterministicSystems.size,
            integrationRules: this.integrationRules.size,
            
            // Queue sizes
            aiToDetQueueSize: this.state.aiToDetQueue.length,
            detToAiQueueSize: this.state.detToAiQueue.length,
            
            // Performance metrics
            conflictRate: this.state.conflictRate,
            resolutionSuccessRate: this.state.resolutionSuccessRate
        };
    }

    async forceSync() {
        if (this.state.running) {
            await this.performSyncCycle();
        }
    }
}

// Supporting Classes

class DataFlowManager {
    constructor(integrationLayer) {
        this.integrationLayer = integrationLayer;
        this.flowPatterns = new Map();
    }
    
    trackDataFlow(source, target, data) {
        const flowKey = `${source}->${target}`;
        
        if (!this.flowPatterns.has(flowKey)) {
            this.flowPatterns.set(flowKey, {
                count: 0,
                totalLatency: 0,
                avgLatency: 0,
                lastFlow: null
            });
        }
        
        const pattern = this.flowPatterns.get(flowKey);
        pattern.count++;
        pattern.lastFlow = Date.now();
        
        // Update average latency if provided
        if (data.latency) {
            pattern.totalLatency += data.latency;
            pattern.avgLatency = pattern.totalLatency / pattern.count;
        }
    }
    
    getFlowPatterns() {
        return Object.fromEntries(this.flowPatterns);
    }
}

class ConflictResolver {
    constructor(config) {
        this.config = config;
        this.resolutionStrategies = new Map();
        
        // Initialize default resolution strategies
        this.initializeDefaultStrategies();
    }
    
    initializeDefaultStrategies() {
        this.resolutionStrategies.set('weighted', this.weightedResolution.bind(this));
        this.resolutionStrategies.set('ai-priority', this.aiPriorityResolution.bind(this));
        this.resolutionStrategies.set('deterministic-priority', this.deterministicPriorityResolution.bind(this));
        this.resolutionStrategies.set('temporal', this.temporalResolution.bind(this));
    }
    
    async resolve(conflict) {
        const strategy = this.config.conflictResolution;
        const resolver = this.resolutionStrategies.get(strategy);
        
        if (!resolver) {
            console.warn(`Unknown conflict resolution strategy: ${strategy}`);
            return this.weightedResolution(conflict);
        }
        
        return await resolver(conflict);
    }
    
    async weightedResolution(conflict) {
        const aiWeight = this.config.aiWeight;
        const detWeight = this.config.deterministicWeight;
        
        // Blend the conflicting changes based on weights
        return {
            type: 'weighted',
            aiContribution: aiWeight,
            deterministicContribution: detWeight,
            resolvedValue: this.blendValues(
                conflict.aiChange.data.value,
                conflict.detChange.data.value,
                aiWeight,
                detWeight
            ),
            confidence: Math.min(aiWeight, detWeight) * 2 // Confidence based on balance
        };
    }
    
    async aiPriorityResolution(conflict) {
        return {
            type: 'ai-priority',
            resolvedValue: conflict.aiChange.data.value,
            confidence: 0.8,
            reason: 'AI decision takes precedence'
        };
    }
    
    async deterministicPriorityResolution(conflict) {
        return {
            type: 'deterministic-priority',
            resolvedValue: conflict.detChange.data.value,
            confidence: 0.9,
            reason: 'Deterministic calculation takes precedence'
        };
    }
    
    async temporalResolution(conflict) {
        // Most recent change wins
        const aiTime = conflict.aiChange.timestamp;
        const detTime = conflict.detChange.timestamp;
        
        if (aiTime > detTime) {
            return {
                type: 'temporal-ai',
                resolvedValue: conflict.aiChange.data.value,
                confidence: 0.7,
                reason: 'AI change is more recent'
            };
        } else {
            return {
                type: 'temporal-deterministic',
                resolvedValue: conflict.detChange.data.value,
                confidence: 0.7,
                reason: 'Deterministic change is more recent'
            };
        }
    }
    
    blendValues(aiValue, detValue, aiWeight, detWeight) {
        if (typeof aiValue === 'number' && typeof detValue === 'number') {
            return (aiValue * aiWeight) + (detValue * detWeight);
        }
        
        // For non-numeric values, use weighted selection
        return Math.random() < aiWeight ? aiValue : detValue;
    }
}

class PredictionEngine {
    constructor(config) {
        this.config = config;
        this.predictions = new Map();
        this.patterns = new Map();
    }
    
    async initialize() {
        console.log('Prediction Engine initialized');
    }
    
    async updatePredictions(aiChanges, deterministicChanges) {
        // Analyze patterns and make predictions
        this.analyzePatterns(aiChanges, deterministicChanges);
        
        // Generate predictions for the configured horizon
        await this.generatePredictions();
    }
    
    analyzePatterns(aiChanges, deterministicChanges) {
        // Track patterns in AI and deterministic changes
        for (const change of [...aiChanges, ...deterministicChanges]) {
            const patternKey = this.getPatternKey(change);
            
            if (!this.patterns.has(patternKey)) {
                this.patterns.set(patternKey, {
                    occurrences: [],
                    frequency: 0,
                    avgInterval: 0
                });
            }
            
            const pattern = this.patterns.get(patternKey);
            pattern.occurrences.push(Date.now());
            pattern.frequency++;
            
            // Calculate average interval
            if (pattern.occurrences.length > 1) {
                const intervals = [];
                for (let i = 1; i < pattern.occurrences.length; i++) {
                    intervals.push(pattern.occurrences[i] - pattern.occurrences[i-1]);
                }
                pattern.avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            }
        }
    }
    
    async generatePredictions() {
        const predictions = [];
        const currentTime = Date.now();
        const horizonMs = this.config.predictionHorizon * 24 * 60 * 60 * 1000; // Convert days to ms
        
        for (const [patternKey, pattern] of this.patterns) {
            if (pattern.avgInterval > 0 && pattern.frequency > 2) {
                const lastOccurrence = pattern.occurrences[pattern.occurrences.length - 1];
                const nextPredicted = lastOccurrence + pattern.avgInterval;
                
                if (nextPredicted <= currentTime + horizonMs) {
                    predictions.push({
                        pattern: patternKey,
                        predictedTime: nextPredicted,
                        confidence: this.calculatePredictionConfidence(pattern),
                        type: 'pattern-based'
                    });
                }
            }
        }
        
        this.predictions.set(currentTime, predictions);
    }
    
    getPatternKey(change) {
        return `${change.source}_${change.type}_${change.data.entityType || 'unknown'}`;
    }
    
    calculatePredictionConfidence(pattern) {
        // Higher frequency and more consistent intervals = higher confidence
        const frequencyScore = Math.min(pattern.frequency / 10, 1);
        const consistencyScore = pattern.avgInterval > 0 ? 0.5 : 0;
        
        return (frequencyScore + consistencyScore) / 2;
    }
    
    getPredictions(timeRange) {
        const predictions = [];
        const now = Date.now();
        
        for (const [timestamp, predictionSet] of this.predictions) {
            if (timestamp >= now - timeRange && timestamp <= now + timeRange) {
                predictions.push(...predictionSet);
            }
        }
        
        return predictions.sort((a, b) => a.predictedTime - b.predictedTime);
    }
}

module.exports = { HybridIntegrationLayer };

