// Data Flow Orchestrator - Routes data between systems with transformation and timing control
// Handles AI-Deterministic and cross-system data flows with conflict resolution

const EventEmitter = require('events');

class DataFlowOrchestrator extends EventEmitter {
    constructor(systemRegistry) {
        super();
        
        this.systemRegistry = systemRegistry;
        
        // Data flow management
        this.activeFlows = new Map();
        this.flowQueue = [];
        this.transformationRules = new Map();
        this.routingTable = new Map();
        
        // Timing and synchronization
        this.processingIntervals = new Map();
        this.lastProcessingTimes = new Map();
        this.batchProcessor = null;
        
        // Conflict resolution
        this.conflictResolver = new ConflictResolver();
        this.priorityQueue = [];
        
        // Performance tracking
        this.metrics = {
            totalFlows: 0,
            successfulFlows: 0,
            failedFlows: 0,
            averageProcessingTime: 0,
            queueSize: 0,
            conflictsResolved: 0
        };
        
        // Data transformation cache
        this.transformationCache = new Map();
        this.cacheMaxSize = 1000;
        
        this.initializeOrchestrator();
        console.log('🔄 Data Flow Orchestrator initialized');
    }

    initializeOrchestrator() {
        // Start batch processor for non-critical flows
        this.batchProcessor = setInterval(() => {
            this.processBatchFlows();
        }, 1000); // Process batch every second
        
        // Listen to system registry events
        this.systemRegistry.on('systemRegistered', (event) => {
            this.onSystemRegistered(event);
        });
        
        this.systemRegistry.on('connectionRegistered', (event) => {
            this.onConnectionRegistered(event);
        });
    }

    // System Event Handlers
    onSystemRegistered(event) {
        const { systemId, registration } = event;
        
        // Initialize processing intervals for deterministic systems
        if (registration.type === 'deterministic') {
            this.scheduleSystemProcessing(systemId, registration.updateFrequency);
        }
        
        // Set up automatic data flow routes
        this.setupAutomaticRoutes(systemId, registration);
    }

    onConnectionRegistered(event) {
        const { connectionId, connection } = event;
        
        // Add connection to routing table
        this.routingTable.set(connectionId, {
            ...connection,
            lastUsed: Date.now(),
            flowCount: 0,
            averageLatency: 0
        });
        
        console.log(`🛤️ Route added to routing table: ${connectionId}`);
    }

    // Data Flow Initiation
    initiateFlow(sourceSystemId, targetSystemId, data, options = {}) {
        const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const flow = {
            id: flowId,
            sourceSystemId,
            targetSystemId,
            data,
            priority: options.priority || 'medium',
            type: options.type || 'standard',
            timestamp: Date.now(),
            status: 'pending',
            retryCount: 0,
            maxRetries: options.maxRetries || 3,
            timeout: options.timeout || 5000,
            transformationRequired: options.transformationRequired !== false,
            metadata: options.metadata || {}
        };
        
        this.activeFlows.set(flowId, flow);
        this.metrics.totalFlows++;
        
        // Route flow based on priority
        if (flow.priority === 'critical') {
            this.processFlowImmediate(flow);
        } else if (flow.priority === 'high') {
            this.priorityQueue.push(flow);
            this.processPriorityQueue();
        } else {
            this.flowQueue.push(flow);
        }
        
        this.emit('flowInitiated', { flowId, flow });
        return flowId;
    }

    // Flow Processing
    async processFlowImmediate(flow) {
        const startTime = Date.now();
        
        try {
            flow.status = 'processing';
            
            // Get connection info
            const connectionId = `${flow.sourceSystemId}->${flow.targetSystemId}`;
            const connection = this.routingTable.get(connectionId);
            
            if (!connection || !connection.enabled) {
                throw new Error(`No active connection found: ${connectionId}`);
            }
            
            // Transform data if required
            let transformedData = flow.data;
            if (flow.transformationRequired) {
                transformedData = await this.transformData(flow.data, connection);
            }
            
            // Get target system
            const targetSystem = this.getSystemInstance(flow.targetSystemId);
            if (!targetSystem) {
                throw new Error(`Target system not found: ${flow.targetSystemId}`);
            }
            
            // Apply data to target system
            await this.applyDataToSystem(targetSystem, transformedData, connection);
            
            // Update flow status
            flow.status = 'completed';
            flow.completedAt = Date.now();
            flow.processingTime = Date.now() - startTime;
            
            // Update metrics
            this.metrics.successfulFlows++;
            this.updateAverageProcessingTime(flow.processingTime);
            
            // Update connection metrics
            connection.flowCount++;
            connection.lastUsed = Date.now();
            connection.averageLatency = this.calculateAverageLatency(connection, flow.processingTime);
            
            this.emit('flowCompleted', { flowId: flow.id, flow });
            
        } catch (error) {
            await this.handleFlowError(flow, error);
        }
    }

    async processPriorityQueue() {
        while (this.priorityQueue.length > 0) {
            const flow = this.priorityQueue.shift();
            await this.processFlowImmediate(flow);
        }
    }

    async processBatchFlows() {
        const batchSize = 10;
        const batch = this.flowQueue.splice(0, batchSize);
        
        if (batch.length === 0) return;
        
        this.metrics.queueSize = this.flowQueue.length;
        
        // Process batch in parallel
        const processingPromises = batch.map(flow => this.processFlowImmediate(flow));
        
        try {
            await Promise.allSettled(processingPromises);
        } catch (error) {
            console.error('🔄 Batch processing error:', error);
        }
    }

    // Data Transformation
    async transformData(data, connection) {
        const cacheKey = `${connection.id}_${JSON.stringify(data).substring(0, 100)}`;
        
        // Check cache first
        if (this.transformationCache.has(cacheKey)) {
            return this.transformationCache.get(cacheKey);
        }
        
        let transformedData = data;
        
        // Apply transformation rules
        if (connection.transformationRules && connection.transformationRules.length > 0) {
            for (const rule of connection.transformationRules) {
                transformedData = await this.applyTransformationRule(transformedData, rule);
            }
        }
        
        // Apply data mapping
        if (connection.dataMapping && Object.keys(connection.dataMapping).length > 0) {
            transformedData = this.applyDataMapping(transformedData, connection.dataMapping);
        }
        
        // Cache result
        this.cacheTransformation(cacheKey, transformedData);
        
        return transformedData;
    }

    async applyTransformationRule(data, rule) {
        switch (rule.type) {
            case 'scale':
                return this.scaleData(data, rule.factor);
            
            case 'normalize':
                return this.normalizeData(data, rule.min, rule.max);
            
            case 'filter':
                return this.filterData(data, rule.criteria);
            
            case 'aggregate':
                return this.aggregateData(data, rule.method);
            
            case 'convert':
                return this.convertDataType(data, rule.targetType);
            
            case 'custom':
                return await this.applyCustomTransformation(data, rule.function);
            
            default:
                console.warn(`🔄 Unknown transformation rule type: ${rule.type}`);
                return data;
        }
    }

    applyDataMapping(data, mapping) {
        const mappedData = {};
        
        for (const [sourceKey, targetKey] of Object.entries(mapping)) {
            if (data.hasOwnProperty(sourceKey)) {
                mappedData[targetKey] = data[sourceKey];
            }
        }
        
        return mappedData;
    }

    // Data Application to Systems
    async applyDataToSystem(targetSystem, data, connection) {
        const systemRegistration = this.systemRegistry.aiSystems.get(targetSystem.systemId) ||
                                 this.systemRegistry.deterministicSystems.get(targetSystem.systemId);
        
        if (!systemRegistration) {
            throw new Error(`System registration not found: ${targetSystem.systemId}`);
        }
        
        if (systemRegistration.type === 'ai') {
            await this.applyDataToAISystem(targetSystem, data, connection);
        } else {
            await this.applyDataToDeterministicSystem(targetSystem, data, connection);
        }
    }

    async applyDataToAISystem(aiSystem, data, connection) {
        // AI systems receive data as context for their next processing cycle
        if (typeof aiSystem.instance.addContext === 'function') {
            await aiSystem.instance.addContext(data, {
                source: connection.sourceSystem,
                timestamp: Date.now(),
                priority: connection.priority
            });
        } else if (typeof aiSystem.instance.updateContext === 'function') {
            await aiSystem.instance.updateContext(data);
        } else {
            console.warn(`🧠 AI System ${aiSystem.systemId} does not support context updates`);
        }
    }

    async applyDataToDeterministicSystem(deterministicSystem, data, connection) {
        // Deterministic systems receive data as input knob adjustments
        if (typeof deterministicSystem.instance.setInput === 'function') {
            for (const [knobId, value] of Object.entries(data)) {
                try {
                    deterministicSystem.instance.setInput(knobId, value, connection.sourceSystem);
                } catch (error) {
                    console.warn(`⚙️ Failed to set input ${knobId} on ${deterministicSystem.systemId}:`, error.message);
                }
            }
        } else {
            console.warn(`⚙️ Deterministic System ${deterministicSystem.systemId} does not support input setting`);
        }
    }

    // System Processing Scheduling
    scheduleSystemProcessing(systemId, frequency) {
        if (this.processingIntervals.has(systemId)) {
            clearInterval(this.processingIntervals.get(systemId));
        }
        
        const interval = setInterval(() => {
            this.triggerSystemProcessing(systemId);
        }, frequency);
        
        this.processingIntervals.set(systemId, interval);
        this.lastProcessingTimes.set(systemId, Date.now());
        
        console.log(`⏰ Scheduled processing for ${systemId} every ${frequency}ms`);
    }

    async triggerSystemProcessing(systemId) {
        const systemInstance = this.getSystemInstance(systemId);
        if (!systemInstance) return;
        
        try {
            // Trigger system processing
            if (typeof systemInstance.processTick === 'function') {
                await systemInstance.processTick();
            } else if (typeof systemInstance.update === 'function') {
                await systemInstance.update();
            }
            
            // Collect outputs and distribute to connected systems
            await this.collectAndDistributeOutputs(systemId);
            
            this.lastProcessingTimes.set(systemId, Date.now());
            
        } catch (error) {
            console.error(`⚙️ Processing error for ${systemId}:`, error);
        }
    }

    async collectAndDistributeOutputs(systemId) {
        const systemInstance = this.getSystemInstance(systemId);
        if (!systemInstance) return;
        
        // Get system outputs
        let outputs = {};
        if (typeof systemInstance.getCurrentOutputs === 'function') {
            outputs = systemInstance.getCurrentOutputs();
        }
        
        // Find connected systems
        const connections = this.systemRegistry.getSystemConnections(systemId);
        
        // Distribute outputs to connected systems
        for (const connection of connections.outgoing) {
            if (connection.enabled) {
                // Filter outputs based on connection mapping
                const relevantOutputs = this.filterOutputsForConnection(outputs, connection);
                
                if (Object.keys(relevantOutputs).length > 0) {
                    this.initiateFlow(systemId, connection.targetSystem, relevantOutputs, {
                        priority: connection.priority,
                        type: 'automatic',
                        metadata: { connectionId: connection.id }
                    });
                }
            }
        }
    }

    filterOutputsForConnection(outputs, connection) {
        const filtered = {};
        
        // If no specific mapping, send all outputs
        if (!connection.dataMapping || Object.keys(connection.dataMapping).length === 0) {
            return outputs;
        }
        
        // Apply connection-specific filtering
        for (const [outputKey, mappedKey] of Object.entries(connection.dataMapping)) {
            if (outputs.hasOwnProperty(outputKey)) {
                filtered[mappedKey] = outputs[outputKey];
            }
        }
        
        return filtered;
    }

    // Automatic Route Setup
    setupAutomaticRoutes(systemId, registration) {
        // Set up standard AI-Deterministic connections
        if (registration.type === 'ai') {
            this.setupAIToDeterministicRoutes(systemId, registration);
        } else {
            this.setupDeterministicToAIRoutes(systemId, registration);
        }
    }

    setupAIToDeterministicRoutes(aiSystemId, aiRegistration) {
        // Find compatible deterministic systems
        const deterministicSystems = this.systemRegistry.getSystemsByCategory('deterministic', 'internal');
        
        for (const deterministicSystem of deterministicSystems) {
            // Check civilization compatibility
            if (aiRegistration.civilizationId && deterministicSystem.civilizationId &&
                aiRegistration.civilizationId !== deterministicSystem.civilizationId) {
                continue;
            }
            
            // Create automatic connection based on AI capabilities and deterministic inputs
            const compatibility = this.assessAIToDeterministicCompatibility(aiRegistration, deterministicSystem);
            
            if (compatibility.compatible) {
                this.systemRegistry.registerConnection(
                    aiSystemId,
                    deterministicSystem.id,
                    'ai_to_deterministic',
                    {
                        dataMapping: compatibility.dataMapping,
                        priority: 'medium',
                        weight: compatibility.weight,
                        enabled: true
                    }
                );
            }
        }
    }

    setupDeterministicToAIRoutes(deterministicSystemId, deterministicRegistration) {
        // Find compatible AI systems
        const aiSystems = this.systemRegistry.getSystemsByCategory('ai', 'playerSpecific');
        
        for (const aiSystem of aiSystems) {
            // Check civilization compatibility
            if (deterministicRegistration.civilizationId && aiSystem.civilizationId &&
                deterministicRegistration.civilizationId !== aiSystem.civilizationId) {
                continue;
            }
            
            // Create automatic connection based on deterministic outputs and AI input requirements
            const compatibility = this.assessDeterministicToAICompatibility(deterministicRegistration, aiSystem);
            
            if (compatibility.compatible) {
                this.systemRegistry.registerConnection(
                    deterministicSystemId,
                    aiSystem.id,
                    'deterministic_to_ai',
                    {
                        dataMapping: compatibility.dataMapping,
                        priority: 'medium',
                        weight: compatibility.weight,
                        enabled: true
                    }
                );
            }
        }
    }

    // Compatibility Assessment
    assessAIToDeterministicCompatibility(aiRegistration, deterministicRegistration) {
        const compatibility = {
            compatible: false,
            dataMapping: {},
            weight: 0.5,
            reasons: []
        };
        
        // Check for matching capabilities and input knobs
        const aiCapabilities = aiRegistration.capabilities || [];
        const deterministicInputs = Object.keys(deterministicRegistration.inputKnobs || {});
        
        // Simple heuristic matching
        const matches = [];
        for (const capability of aiCapabilities) {
            for (const inputKnob of deterministicInputs) {
                if (this.isSemanticMatch(capability, inputKnob)) {
                    matches.push({ capability, inputKnob });
                    compatibility.dataMapping[capability] = inputKnob;
                }
            }
        }
        
        if (matches.length > 0) {
            compatibility.compatible = true;
            compatibility.weight = Math.min(1.0, matches.length * 0.2);
            compatibility.reasons.push(`Found ${matches.length} capability-input matches`);
        }
        
        return compatibility;
    }

    assessDeterministicToAICompatibility(deterministicRegistration, aiRegistration) {
        const compatibility = {
            compatible: false,
            dataMapping: {},
            weight: 0.5,
            reasons: []
        };
        
        // Check for matching output channels and AI input requirements
        const deterministicOutputs = Object.keys(deterministicRegistration.outputChannels || {});
        const aiInputRequirements = aiRegistration.inputRequirements || [];
        
        // Simple heuristic matching
        const matches = [];
        for (const output of deterministicOutputs) {
            for (const requirement of aiInputRequirements) {
                if (this.isSemanticMatch(output, requirement)) {
                    matches.push({ output, requirement });
                    compatibility.dataMapping[output] = requirement;
                }
            }
        }
        
        if (matches.length > 0) {
            compatibility.compatible = true;
            compatibility.weight = Math.min(1.0, matches.length * 0.2);
            compatibility.reasons.push(`Found ${matches.length} output-requirement matches`);
        }
        
        return compatibility;
    }

    isSemanticMatch(term1, term2) {
        // Simple semantic matching - can be enhanced with NLP
        const normalize = (term) => term.toLowerCase().replace(/[_-]/g, ' ');
        const normalized1 = normalize(term1);
        const normalized2 = normalize(term2);
        
        // Exact match
        if (normalized1 === normalized2) return true;
        
        // Substring match
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
        
        // Common semantic mappings
        const semanticMappings = {
            'economic': ['economy', 'financial', 'fiscal', 'monetary'],
            'population': ['demographic', 'citizen', 'people'],
            'military': ['defense', 'security', 'armed'],
            'trade': ['commerce', 'business', 'market'],
            'policy': ['governance', 'government', 'political']
        };
        
        for (const [key, synonyms] of Object.entries(semanticMappings)) {
            if ((normalized1.includes(key) && synonyms.some(syn => normalized2.includes(syn))) ||
                (normalized2.includes(key) && synonyms.some(syn => normalized1.includes(syn)))) {
                return true;
            }
        }
        
        return false;
    }

    // Error Handling
    async handleFlowError(flow, error) {
        flow.status = 'error';
        flow.error = error.message;
        flow.retryCount++;
        
        this.metrics.failedFlows++;
        
        console.error(`🔄 Flow error (${flow.id}):`, error.message);
        
        // Retry logic
        if (flow.retryCount < flow.maxRetries) {
            flow.status = 'retrying';
            
            // Exponential backoff
            const delay = Math.pow(2, flow.retryCount) * 1000;
            
            setTimeout(() => {
                this.processFlowImmediate(flow);
            }, delay);
            
            console.log(`🔄 Retrying flow ${flow.id} in ${delay}ms (attempt ${flow.retryCount}/${flow.maxRetries})`);
        } else {
            flow.status = 'failed';
            flow.failedAt = Date.now();
            
            this.emit('flowFailed', { flowId: flow.id, flow, error });
        }
    }

    // Utility Methods
    getSystemInstance(systemId) {
        const aiSystem = this.systemRegistry.aiSystems.get(systemId);
        if (aiSystem) return aiSystem.instance;
        
        const deterministicSystem = this.systemRegistry.deterministicSystems.get(systemId);
        if (deterministicSystem) return deterministicSystem.instance;
        
        return null;
    }

    updateAverageProcessingTime(processingTime) {
        const currentAvg = this.metrics.averageProcessingTime;
        const totalFlows = this.metrics.successfulFlows;
        
        this.metrics.averageProcessingTime = 
            ((currentAvg * (totalFlows - 1)) + processingTime) / totalFlows;
    }

    calculateAverageLatency(connection, latency) {
        const currentAvg = connection.averageLatency || 0;
        const flowCount = connection.flowCount;
        
        return ((currentAvg * (flowCount - 1)) + latency) / flowCount;
    }

    // Data Transformation Utilities
    scaleData(data, factor) {
        if (typeof data === 'number') {
            return data * factor;
        } else if (typeof data === 'object') {
            const scaled = {};
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'number') {
                    scaled[key] = value * factor;
                } else {
                    scaled[key] = value;
                }
            }
            return scaled;
        }
        return data;
    }

    normalizeData(data, min, max) {
        if (typeof data === 'number') {
            return Math.max(min, Math.min(max, data));
        } else if (typeof data === 'object') {
            const normalized = {};
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'number') {
                    normalized[key] = Math.max(min, Math.min(max, value));
                } else {
                    normalized[key] = value;
                }
            }
            return normalized;
        }
        return data;
    }

    filterData(data, criteria) {
        if (Array.isArray(data)) {
            return data.filter(item => this.matchesCriteria(item, criteria));
        } else if (typeof data === 'object') {
            const filtered = {};
            for (const [key, value] of Object.entries(data)) {
                if (this.matchesCriteria({ key, value }, criteria)) {
                    filtered[key] = value;
                }
            }
            return filtered;
        }
        return data;
    }

    matchesCriteria(item, criteria) {
        // Simple criteria matching - can be enhanced
        for (const [key, expectedValue] of Object.entries(criteria)) {
            if (item[key] !== expectedValue) {
                return false;
            }
        }
        return true;
    }

    aggregateData(data, method) {
        if (Array.isArray(data)) {
            switch (method) {
                case 'sum':
                    return data.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
                case 'average':
                    const numbers = data.filter(val => typeof val === 'number');
                    return numbers.length > 0 ? numbers.reduce((sum, val) => sum + val, 0) / numbers.length : 0;
                case 'max':
                    return Math.max(...data.filter(val => typeof val === 'number'));
                case 'min':
                    return Math.min(...data.filter(val => typeof val === 'number'));
                default:
                    return data;
            }
        }
        return data;
    }

    convertDataType(data, targetType) {
        switch (targetType) {
            case 'number':
                return typeof data === 'string' ? parseFloat(data) : Number(data);
            case 'string':
                return String(data);
            case 'boolean':
                return Boolean(data);
            default:
                return data;
        }
    }

    async applyCustomTransformation(data, transformFunction) {
        if (typeof transformFunction === 'function') {
            return await transformFunction(data);
        }
        return data;
    }

    cacheTransformation(key, result) {
        if (this.transformationCache.size >= this.cacheMaxSize) {
            // Remove oldest entry
            const firstKey = this.transformationCache.keys().next().value;
            this.transformationCache.delete(firstKey);
        }
        
        this.transformationCache.set(key, result);
    }

    // Status and Metrics
    getOrchestratorStatus() {
        return {
            metrics: this.metrics,
            activeFlows: this.activeFlows.size,
            queueSize: this.flowQueue.length,
            priorityQueueSize: this.priorityQueue.length,
            routingTableSize: this.routingTable.size,
            cacheSize: this.transformationCache.size,
            processingIntervals: this.processingIntervals.size
        };
    }

    // Cleanup
    destroy() {
        // Clear all intervals
        for (const interval of this.processingIntervals.values()) {
            clearInterval(interval);
        }
        
        if (this.batchProcessor) {
            clearInterval(this.batchProcessor);
        }
        
        // Clear all data structures
        this.activeFlows.clear();
        this.flowQueue.length = 0;
        this.transformationRules.clear();
        this.routingTable.clear();
        this.processingIntervals.clear();
        this.lastProcessingTimes.clear();
        this.transformationCache.clear();
        this.priorityQueue.length = 0;
        
        // Remove all listeners
        this.removeAllListeners();
        
        console.log('🔄 Data Flow Orchestrator destroyed');
    }
}

// Conflict Resolution Helper Class
class ConflictResolver {
    constructor() {
        this.resolutionStrategies = new Map();
        this.setupDefaultStrategies();
    }

    setupDefaultStrategies() {
        // Priority-based resolution
        this.resolutionStrategies.set('priority', (conflicts) => {
            return conflicts.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority))[0];
        });
        
        // Weight-based resolution
        this.resolutionStrategies.set('weight', (conflicts) => {
            return conflicts.sort((a, b) => (b.weight || 0.5) - (a.weight || 0.5))[0];
        });
        
        // Timestamp-based resolution (latest wins)
        this.resolutionStrategies.set('latest', (conflicts) => {
            return conflicts.sort((a, b) => b.timestamp - a.timestamp)[0];
        });
        
        // Average resolution
        this.resolutionStrategies.set('average', (conflicts) => {
            if (conflicts.length === 0) return null;
            
            const avgData = {};
            const numericKeys = new Set();
            
            // Identify numeric keys
            conflicts.forEach(conflict => {
                Object.keys(conflict.data).forEach(key => {
                    if (typeof conflict.data[key] === 'number') {
                        numericKeys.add(key);
                    }
                });
            });
            
            // Calculate averages for numeric keys
            numericKeys.forEach(key => {
                const values = conflicts
                    .map(conflict => conflict.data[key])
                    .filter(val => typeof val === 'number');
                
                if (values.length > 0) {
                    avgData[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
                }
            });
            
            return {
                ...conflicts[0],
                data: { ...conflicts[0].data, ...avgData },
                resolution: 'averaged'
            };
        });
    }

    getPriorityValue(priority) {
        const values = { critical: 4, high: 3, medium: 2, low: 1 };
        return values[priority] || 2;
    }

    resolveConflicts(conflicts, strategy = 'priority') {
        if (conflicts.length <= 1) return conflicts[0] || null;
        
        const resolver = this.resolutionStrategies.get(strategy);
        if (!resolver) {
            console.warn(`Unknown conflict resolution strategy: ${strategy}, using priority`);
            return this.resolveConflicts(conflicts, 'priority');
        }
        
        return resolver(conflicts);
    }
}

module.exports = { DataFlowOrchestrator, ConflictResolver };
