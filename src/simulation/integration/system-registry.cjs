// System Registry - Maintains catalog of all AI and Deterministic systems
// Tracks system capabilities, inputs, outputs, and health monitoring

const EventEmitter = require('events');

class SystemRegistry extends EventEmitter {
    constructor() {
        super();
        
        // System catalogs
        this.aiSystems = new Map();
        this.deterministicSystems = new Map();
        this.systemConnections = new Map();
        this.systemHealth = new Map();
        
        // System categories
        this.categories = {
            ai: {
                playerSpecific: new Set(),
                shared: new Set()
            },
            deterministic: {
                internal: new Set(),
                interCivilization: new Set(),
                galactic: new Set()
            }
        };
        
        // Integration metadata
        this.integrationRules = new Map();
        this.dataFlowRoutes = new Map();
        this.conflictResolutionRules = new Map();
        
        // Performance tracking
        this.metrics = {
            totalSystems: 0,
            activeConnections: 0,
            averageResponseTime: 0,
            errorRate: 0,
            lastHealthCheck: Date.now()
        };
        
        console.log('🏗️ System Registry initialized');
    }

    // System Registration
    registerAISystem(systemId, systemInstance, metadata = {}) {
        const registration = {
            id: systemId,
            instance: systemInstance,
            type: 'ai',
            category: metadata.category || 'playerSpecific', // playerSpecific | shared
            capabilities: metadata.capabilities || [],
            inputRequirements: metadata.inputRequirements || [],
            outputChannels: metadata.outputChannels || [],
            civilizationId: metadata.civilizationId || null,
            priority: metadata.priority || 'medium',
            costProfile: metadata.costProfile || { tokensPerCall: 1000, maxCallsPerMinute: 10 },
            registeredAt: Date.now(),
            lastActive: Date.now(),
            status: 'active'
        };
        
        this.aiSystems.set(systemId, registration);
        this.categories.ai[registration.category].add(systemId);
        this.systemHealth.set(systemId, this.createHealthRecord());
        this.metrics.totalSystems++;
        
        console.log(`🧠 AI System registered: ${systemId} (${registration.category})`);
        this.emit('systemRegistered', { type: 'ai', systemId, registration });
        
        return registration;
    }

    registerDeterministicSystem(systemId, systemInstance, metadata = {}) {
        const registration = {
            id: systemId,
            instance: systemInstance,
            type: 'deterministic',
            category: metadata.category || 'internal', // internal | interCivilization | galactic
            inputKnobs: this.extractInputKnobs(systemInstance),
            outputChannels: this.extractOutputChannels(systemInstance),
            civilizationId: metadata.civilizationId || null,
            updateFrequency: metadata.updateFrequency || 5000, // milliseconds
            dependencies: metadata.dependencies || [],
            registeredAt: Date.now(),
            lastUpdate: Date.now(),
            status: 'active'
        };
        
        this.deterministicSystems.set(systemId, registration);
        this.categories.deterministic[registration.category].add(systemId);
        this.systemHealth.set(systemId, this.createHealthRecord());
        this.metrics.totalSystems++;
        
        console.log(`⚙️ Deterministic System registered: ${systemId} (${registration.category})`);
        this.emit('systemRegistered', { type: 'deterministic', systemId, registration });
        
        return registration;
    }

    // System Discovery
    extractInputKnobs(systemInstance) {
        if (systemInstance.inputKnobs && typeof systemInstance.inputKnobs.entries === 'function') {
            const knobs = {};
            for (let [knobId, knobData] of systemInstance.inputKnobs.entries()) {
                knobs[knobId] = {
                    name: knobData.name,
                    description: knobData.description,
                    type: knobData.type,
                    defaultValue: knobData.defaultValue,
                    constraints: knobData.constraints,
                    category: knobData.category
                };
            }
            return knobs;
        }
        return {};
    }

    extractOutputChannels(systemInstance) {
        if (systemInstance.outputChannels && typeof systemInstance.outputChannels.entries === 'function') {
            const channels = {};
            for (let [channelId, channelData] of systemInstance.outputChannels.entries()) {
                channels[channelId] = {
                    name: channelData.name,
                    description: channelData.description,
                    dataType: channelData.dataType,
                    structure: channelData.structure,
                    category: channelData.category,
                    aiConsumable: channelData.aiConsumable,
                    gameConsumable: channelData.gameConsumable
                };
            }
            return channels;
        }
        return {};
    }

    // Connection Management
    registerConnection(sourceSystemId, targetSystemId, connectionType, metadata = {}) {
        const connectionId = `${sourceSystemId}->${targetSystemId}`;
        
        const connection = {
            id: connectionId,
            sourceSystem: sourceSystemId,
            targetSystem: targetSystemId,
            type: connectionType, // ai_to_deterministic | deterministic_to_ai | ai_to_ai | deterministic_to_deterministic
            dataMapping: metadata.dataMapping || {},
            transformationRules: metadata.transformationRules || [],
            priority: metadata.priority || 'medium',
            enabled: metadata.enabled !== false,
            weight: metadata.weight || 1.0,
            lastDataFlow: null,
            flowCount: 0,
            errorCount: 0,
            registeredAt: Date.now()
        };
        
        this.systemConnections.set(connectionId, connection);
        this.metrics.activeConnections++;
        
        console.log(`🔗 Connection registered: ${connectionId} (${connectionType})`);
        this.emit('connectionRegistered', { connectionId, connection });
        
        return connection;
    }

    // Integration Rules
    addIntegrationRule(ruleId, rule) {
        this.integrationRules.set(ruleId, {
            id: ruleId,
            ...rule,
            createdAt: Date.now()
        });
        
        console.log(`📋 Integration rule added: ${ruleId}`);
    }

    addDataFlowRoute(routeId, route) {
        this.dataFlowRoutes.set(routeId, {
            id: routeId,
            ...route,
            createdAt: Date.now()
        });
        
        console.log(`🛤️ Data flow route added: ${routeId}`);
    }

    // System Queries
    getSystemsByCategory(type, category) {
        if (type === 'ai') {
            return Array.from(this.categories.ai[category] || [])
                .map(systemId => this.aiSystems.get(systemId))
                .filter(Boolean);
        } else if (type === 'deterministic') {
            return Array.from(this.categories.deterministic[category] || [])
                .map(systemId => this.deterministicSystems.get(systemId))
                .filter(Boolean);
        }
        return [];
    }

    getSystemsByCivilization(civilizationId) {
        const systems = {
            ai: [],
            deterministic: []
        };
        
        for (let [systemId, registration] of this.aiSystems) {
            if (registration.civilizationId === civilizationId) {
                systems.ai.push(registration);
            }
        }
        
        for (let [systemId, registration] of this.deterministicSystems) {
            if (registration.civilizationId === civilizationId) {
                systems.deterministic.push(registration);
            }
        }
        
        return systems;
    }

    getSystemConnections(systemId) {
        const connections = {
            incoming: [],
            outgoing: []
        };
        
        for (let [connectionId, connection] of this.systemConnections) {
            if (connection.sourceSystem === systemId) {
                connections.outgoing.push(connection);
            }
            if (connection.targetSystem === systemId) {
                connections.incoming.push(connection);
            }
        }
        
        return connections;
    }

    // Health Monitoring
    createHealthRecord() {
        return {
            status: 'healthy',
            lastCheck: Date.now(),
            responseTime: 0,
            errorCount: 0,
            successCount: 0,
            uptime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            warnings: [],
            errors: []
        };
    }

    updateSystemHealth(systemId, healthData) {
        const health = this.systemHealth.get(systemId);
        if (health) {
            Object.assign(health, {
                ...healthData,
                lastCheck: Date.now()
            });
            
            // Determine overall health status
            if (health.errorCount > 10) {
                health.status = 'critical';
            } else if (health.errorCount > 5 || health.responseTime > 1000) {
                health.status = 'warning';
            } else {
                health.status = 'healthy';
            }
            
            this.emit('healthUpdate', { systemId, health });
        }
    }

    performHealthCheck() {
        const healthSummary = {
            healthy: 0,
            warning: 0,
            critical: 0,
            offline: 0
        };
        
        for (let [systemId, health] of this.systemHealth) {
            // Check if system is responsive
            const system = this.aiSystems.get(systemId) || this.deterministicSystems.get(systemId);
            if (system && system.instance) {
                try {
                    // Basic ping test
                    const startTime = Date.now();
                    if (typeof system.instance.ping === 'function') {
                        system.instance.ping();
                    }
                    const responseTime = Date.now() - startTime;
                    
                    this.updateSystemHealth(systemId, {
                        responseTime: responseTime,
                        successCount: health.successCount + 1
                    });
                } catch (error) {
                    this.updateSystemHealth(systemId, {
                        errorCount: health.errorCount + 1,
                        errors: [...health.errors.slice(-9), {
                            message: error.message,
                            timestamp: Date.now()
                        }]
                    });
                }
            }
            
            healthSummary[health.status]++;
        }
        
        this.metrics.lastHealthCheck = Date.now();
        this.emit('healthCheckComplete', healthSummary);
        
        return healthSummary;
    }

    // System Lifecycle
    enableSystem(systemId) {
        const aiSystem = this.aiSystems.get(systemId);
        const deterministicSystem = this.deterministicSystems.get(systemId);
        
        if (aiSystem) {
            aiSystem.status = 'active';
            console.log(`🧠 AI System enabled: ${systemId}`);
        }
        
        if (deterministicSystem) {
            deterministicSystem.status = 'active';
            console.log(`⚙️ Deterministic System enabled: ${systemId}`);
        }
        
        this.emit('systemEnabled', { systemId });
    }

    disableSystem(systemId) {
        const aiSystem = this.aiSystems.get(systemId);
        const deterministicSystem = this.deterministicSystems.get(systemId);
        
        if (aiSystem) {
            aiSystem.status = 'disabled';
            console.log(`🧠 AI System disabled: ${systemId}`);
        }
        
        if (deterministicSystem) {
            deterministicSystem.status = 'disabled';
            console.log(`⚙️ Deterministic System disabled: ${systemId}`);
        }
        
        this.emit('systemDisabled', { systemId });
    }

    unregisterSystem(systemId) {
        // Remove from AI systems
        if (this.aiSystems.has(systemId)) {
            const registration = this.aiSystems.get(systemId);
            this.aiSystems.delete(systemId);
            this.categories.ai[registration.category].delete(systemId);
        }
        
        // Remove from deterministic systems
        if (this.deterministicSystems.has(systemId)) {
            const registration = this.deterministicSystems.get(systemId);
            this.deterministicSystems.delete(systemId);
            this.categories.deterministic[registration.category].delete(systemId);
        }
        
        // Remove health record
        this.systemHealth.delete(systemId);
        
        // Remove connections
        const connectionsToRemove = [];
        for (let [connectionId, connection] of this.systemConnections) {
            if (connection.sourceSystem === systemId || connection.targetSystem === systemId) {
                connectionsToRemove.push(connectionId);
            }
        }
        
        connectionsToRemove.forEach(connectionId => {
            this.systemConnections.delete(connectionId);
            this.metrics.activeConnections--;
        });
        
        this.metrics.totalSystems--;
        
        console.log(`🗑️ System unregistered: ${systemId}`);
        this.emit('systemUnregistered', { systemId });
    }

    // Reporting
    getRegistryStatus() {
        return {
            metrics: this.metrics,
            systemCounts: {
                ai: {
                    playerSpecific: this.categories.ai.playerSpecific.size,
                    shared: this.categories.ai.shared.size,
                    total: this.aiSystems.size
                },
                deterministic: {
                    internal: this.categories.deterministic.internal.size,
                    interCivilization: this.categories.deterministic.interCivilization.size,
                    galactic: this.categories.deterministic.galactic.size,
                    total: this.deterministicSystems.size
                }
            },
            healthSummary: this.getHealthSummary(),
            connectionSummary: this.getConnectionSummary()
        };
    }

    getHealthSummary() {
        const summary = { healthy: 0, warning: 0, critical: 0, offline: 0 };
        
        for (let [systemId, health] of this.systemHealth) {
            summary[health.status]++;
        }
        
        return summary;
    }

    getConnectionSummary() {
        const summary = {
            ai_to_deterministic: 0,
            deterministic_to_ai: 0,
            ai_to_ai: 0,
            deterministic_to_deterministic: 0,
            total: this.systemConnections.size
        };
        
        for (let [connectionId, connection] of this.systemConnections) {
            if (summary[connection.type] !== undefined) {
                summary[connection.type]++;
            }
        }
        
        return summary;
    }

    // Utility Methods
    findSystemsByCapability(capability) {
        const systems = [];
        
        for (let [systemId, registration] of this.aiSystems) {
            if (registration.capabilities.includes(capability)) {
                systems.push(registration);
            }
        }
        
        return systems;
    }

    findSystemsByOutputChannel(channelType) {
        const systems = [];
        
        for (let [systemId, registration] of this.deterministicSystems) {
            if (registration.outputChannels[channelType]) {
                systems.push(registration);
            }
        }
        
        return systems;
    }

    validateSystemCompatibility(sourceSystemId, targetSystemId) {
        const sourceSystem = this.aiSystems.get(sourceSystemId) || this.deterministicSystems.get(sourceSystemId);
        const targetSystem = this.aiSystems.get(targetSystemId) || this.deterministicSystems.get(targetSystemId);
        
        if (!sourceSystem || !targetSystem) {
            return { compatible: false, reason: 'System not found' };
        }
        
        // Check civilization compatibility
        if (sourceSystem.civilizationId && targetSystem.civilizationId && 
            sourceSystem.civilizationId !== targetSystem.civilizationId) {
            return { compatible: false, reason: 'Civilization mismatch' };
        }
        
        // Check category compatibility
        const validConnections = {
            'ai-deterministic': true,
            'deterministic-ai': true,
            'ai-ai': true,
            'deterministic-deterministic': true
        };
        
        const connectionType = `${sourceSystem.type}-${targetSystem.type}`;
        if (!validConnections[connectionType]) {
            return { compatible: false, reason: 'Invalid connection type' };
        }
        
        return { compatible: true, connectionType };
    }

    // Cleanup
    destroy() {
        // Clear all intervals and listeners
        this.removeAllListeners();
        
        // Clear data structures
        this.aiSystems.clear();
        this.deterministicSystems.clear();
        this.systemConnections.clear();
        this.systemHealth.clear();
        this.integrationRules.clear();
        this.dataFlowRoutes.clear();
        
        console.log('🏗️ System Registry destroyed');
    }
}

module.exports = { SystemRegistry };
