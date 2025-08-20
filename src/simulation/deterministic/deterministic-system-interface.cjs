// Deterministic System Interface - Standardized inputs/outputs for AI integration
// Defines input knobs and output structures for all deterministic systems

const EventEmitter = require('events');

class DeterministicSystemInterface extends EventEmitter {
    constructor(systemId, config = {}) {
        super();
        
        this.systemId = systemId;
        this.config = config;
        
        // Input knobs - parameters that AI can adjust
        this.inputKnobs = new Map();
        
        // Output channels - structured data for AI and game consumption
        this.outputChannels = new Map();
        
        // Current state
        this.currentInputs = new Map();
        this.currentOutputs = new Map();
        this.lastUpdate = Date.now();
        
        // Change tracking
        this.inputHistory = [];
        this.outputHistory = [];
        this.changeListeners = new Map();
        
        // Validation rules
        this.validationRules = new Map();
        
        // Performance metrics
        this.metrics = {
            inputChanges: 0,
            outputUpdates: 0,
            validationErrors: 0,
            avgProcessingTime: 0
        };
    }

    // Input Knob Management
    defineInputKnob(knobId, definition) {
        this.inputKnobs.set(knobId, {
            id: knobId,
            name: definition.name,
            description: definition.description,
            type: definition.type, // 'number', 'boolean', 'string', 'enum', 'range'
            defaultValue: definition.defaultValue,
            constraints: definition.constraints || {},
            category: definition.category || 'general',
            aiAccessible: definition.aiAccessible !== false, // Default true
            gameVisible: definition.gameVisible !== false, // Default true
            updateFrequency: definition.updateFrequency || 'realtime', // 'realtime', 'daily', 'quarterly'
            impact: definition.impact || 'medium', // 'low', 'medium', 'high', 'critical'
            
            // Validation
            validator: definition.validator,
            
            // Documentation for AI
            aiDescription: definition.aiDescription,
            expectedEffects: definition.expectedEffects || [],
            
            // Metadata
            created: Date.now(),
            lastModified: Date.now(),
            changeCount: 0
        });
        
        // Set default value
        this.currentInputs.set(knobId, definition.defaultValue);
        
        console.log(`Input knob defined: ${this.systemId}.${knobId}`);
    }

    // Output Channel Management
    defineOutputChannel(channelId, definition) {
        this.outputChannels.set(channelId, {
            id: channelId,
            name: definition.name,
            description: definition.description,
            dataType: definition.dataType, // 'metric', 'event', 'state', 'prediction'
            structure: definition.structure, // Expected data structure
            category: definition.category || 'general',
            aiConsumable: definition.aiConsumable !== false, // Default true
            gameConsumable: definition.gameConsumable !== false, // Default true
            updateFrequency: definition.updateFrequency || 'realtime',
            priority: definition.priority || 'medium',
            
            // For AI consumption
            aiInterpretation: definition.aiInterpretation,
            significanceThresholds: definition.significanceThresholds || {},
            
            // For game consumption
            gameDisplayFormat: definition.gameDisplayFormat,
            uiHints: definition.uiHints || {},
            
            // Metadata
            created: Date.now(),
            lastUpdate: Date.now(),
            updateCount: 0
        });
        
        console.log(`Output channel defined: ${this.systemId}.${channelId}`);
    }

    // Input Operations
    setInput(knobId, value, source = 'unknown') {
        const knob = this.inputKnobs.get(knobId);
        if (!knob) {
            throw new Error(`Unknown input knob: ${knobId}`);
        }
        
        // Validate input
        const validationResult = this.validateInput(knobId, value);
        if (!validationResult.valid) {
            this.metrics.validationErrors++;
            throw new Error(`Invalid input for ${knobId}: ${validationResult.error}`);
        }
        
        // Store previous value
        const previousValue = this.currentInputs.get(knobId);
        
        // Set new value
        this.currentInputs.set(knobId, value);
        
        // Track change
        this.inputHistory.push({
            knobId,
            previousValue,
            newValue: value,
            source,
            timestamp: Date.now(),
            gameDay: this.getCurrentGameDay()
        });
        
        // Update metrics
        this.metrics.inputChanges++;
        knob.changeCount++;
        knob.lastModified = Date.now();
        
        // Emit change event
        this.emit('inputChanged', {
            systemId: this.systemId,
            knobId,
            previousValue,
            newValue: value,
            source,
            knob
        });
        
        // Notify specific listeners
        const listeners = this.changeListeners.get(knobId) || [];
        for (const listener of listeners) {
            try {
                listener(value, previousValue, source);
            } catch (error) {
                console.error(`Input change listener error for ${knobId}:`, error);
            }
        }
        
        console.log(`Input changed: ${this.systemId}.${knobId} = ${value} (from ${source})`);
    }

    getInput(knobId) {
        return this.currentInputs.get(knobId);
    }

    getAllInputs() {
        return Object.fromEntries(this.currentInputs);
    }

    // Output Operations
    setOutput(channelId, data, metadata = {}) {
        const channel = this.outputChannels.get(channelId);
        if (!channel) {
            throw new Error(`Unknown output channel: ${channelId}`);
        }
        
        // Validate output structure
        const validationResult = this.validateOutput(channelId, data);
        if (!validationResult.valid) {
            console.warn(`Output validation warning for ${channelId}: ${validationResult.warning}`);
        }
        
        // Prepare output data
        const outputData = {
            channelId,
            systemId: this.systemId,
            data,
            metadata: {
                ...metadata,
                timestamp: Date.now(),
                gameDay: this.getCurrentGameDay(),
                updateSequence: channel.updateCount
            },
            channel
        };
        
        // Store output
        this.currentOutputs.set(channelId, outputData);
        
        // Track change
        this.outputHistory.push({
            channelId,
            data,
            metadata: outputData.metadata,
            timestamp: Date.now()
        });
        
        // Update metrics
        this.metrics.outputUpdates++;
        channel.updateCount++;
        channel.lastUpdate = Date.now();
        
        // Emit output event
        this.emit('outputUpdated', outputData);
        
        // Check significance thresholds for AI notification
        if (this.isSignificantChange(channelId, data)) {
            this.emit('significantOutput', {
                ...outputData,
                significance: 'high'
            });
        }
        
        console.log(`Output updated: ${this.systemId}.${channelId}`);
    }

    getOutput(channelId) {
        return this.currentOutputs.get(channelId);
    }

    getAllOutputs() {
        const outputs = {};
        for (const [channelId, outputData] of this.currentOutputs) {
            outputs[channelId] = outputData;
        }
        return outputs;
    }

    // Validation
    validateInput(knobId, value) {
        const knob = this.inputKnobs.get(knobId);
        if (!knob) {
            return { valid: false, error: 'Unknown knob' };
        }
        
        // Type validation
        if (!this.validateType(value, knob.type)) {
            return { valid: false, error: `Invalid type, expected ${knob.type}` };
        }
        
        // Constraint validation
        if (knob.constraints) {
            const constraintResult = this.validateConstraints(value, knob.constraints);
            if (!constraintResult.valid) {
                return constraintResult;
            }
        }
        
        // Custom validator
        if (knob.validator) {
            try {
                const customResult = knob.validator(value);
                if (!customResult.valid) {
                    return customResult;
                }
            } catch (error) {
                return { valid: false, error: `Validator error: ${error.message}` };
            }
        }
        
        return { valid: true };
    }

    validateType(value, expectedType) {
        switch (expectedType) {
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'string':
                return typeof value === 'string';
            case 'enum':
                return true; // Enum validation handled in constraints
            case 'range':
                return typeof value === 'object' && 
                       typeof value.min === 'number' && 
                       typeof value.max === 'number';
            default:
                return true;
        }
    }

    validateConstraints(value, constraints) {
        if (constraints.min !== undefined && value < constraints.min) {
            return { valid: false, error: `Value ${value} below minimum ${constraints.min}` };
        }
        
        if (constraints.max !== undefined && value > constraints.max) {
            return { valid: false, error: `Value ${value} above maximum ${constraints.max}` };
        }
        
        if (constraints.enum && !constraints.enum.includes(value)) {
            return { valid: false, error: `Value ${value} not in allowed values: ${constraints.enum.join(', ')}` };
        }
        
        if (constraints.pattern && !new RegExp(constraints.pattern).test(value)) {
            return { valid: false, error: `Value ${value} does not match pattern ${constraints.pattern}` };
        }
        
        return { valid: true };
    }

    validateOutput(channelId, data) {
        const channel = this.outputChannels.get(channelId);
        if (!channel || !channel.structure) {
            return { valid: true };
        }
        
        // Basic structure validation
        try {
            this.validateStructure(data, channel.structure);
            return { valid: true };
        } catch (error) {
            return { valid: false, warning: error.message };
        }
    }

    validateStructure(data, structure) {
        if (structure.required) {
            for (const field of structure.required) {
                if (!(field in data)) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
        }
        
        if (structure.fields) {
            for (const [field, fieldDef] of Object.entries(structure.fields)) {
                if (field in data) {
                    if (fieldDef.type && !this.validateType(data[field], fieldDef.type)) {
                        throw new Error(`Invalid type for field ${field}, expected ${fieldDef.type}`);
                    }
                }
            }
        }
    }

    // Significance Detection
    isSignificantChange(channelId, data) {
        const channel = this.outputChannels.get(channelId);
        if (!channel.significanceThresholds) {
            return false;
        }
        
        const thresholds = channel.significanceThresholds;
        
        // Check various significance criteria
        for (const [metric, threshold] of Object.entries(thresholds)) {
            const value = this.getNestedValue(data, metric);
            if (value !== undefined) {
                if (typeof threshold === 'number' && Math.abs(value) > threshold) {
                    return true;
                }
                if (typeof threshold === 'object') {
                    if (threshold.above && value > threshold.above) return true;
                    if (threshold.below && value < threshold.below) return true;
                    if (threshold.change) {
                        const previous = this.getPreviousValue(channelId, metric);
                        if (previous !== undefined && Math.abs(value - previous) > threshold.change) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }

    // Change Listeners
    onInputChange(knobId, listener) {
        if (!this.changeListeners.has(knobId)) {
            this.changeListeners.set(knobId, []);
        }
        this.changeListeners.get(knobId).push(listener);
    }

    // Batch Operations
    setBatchInputs(inputs, source = 'batch') {
        const changes = [];
        
        for (const [knobId, value] of Object.entries(inputs)) {
            try {
                const previousValue = this.currentInputs.get(knobId);
                this.setInput(knobId, value, source);
                changes.push({ knobId, previousValue, newValue: value });
            } catch (error) {
                console.error(`Batch input error for ${knobId}:`, error);
            }
        }
        
        if (changes.length > 0) {
            this.emit('batchInputChanged', {
                systemId: this.systemId,
                changes,
                source
            });
        }
        
        return changes;
    }

    setBatchOutputs(outputs, metadata = {}) {
        const updates = [];
        
        for (const [channelId, data] of Object.entries(outputs)) {
            try {
                this.setOutput(channelId, data, metadata);
                updates.push({ channelId, data });
            } catch (error) {
                console.error(`Batch output error for ${channelId}:`, error);
            }
        }
        
        if (updates.length > 0) {
            this.emit('batchOutputUpdated', {
                systemId: this.systemId,
                updates,
                metadata
            });
        }
        
        return updates;
    }

    // AI Integration Helpers
    getAIAccessibleInputs() {
        const aiInputs = {};
        
        for (const [knobId, knob] of this.inputKnobs) {
            if (knob.aiAccessible) {
                aiInputs[knobId] = {
                    id: knobId,
                    name: knob.name,
                    description: knob.aiDescription || knob.description,
                    currentValue: this.currentInputs.get(knobId),
                    type: knob.type,
                    constraints: knob.constraints,
                    impact: knob.impact,
                    expectedEffects: knob.expectedEffects,
                    category: knob.category
                };
            }
        }
        
        return aiInputs;
    }

    getAIConsumableOutputs() {
        const aiOutputs = {};
        
        for (const [channelId, channel] of this.outputChannels) {
            if (channel.aiConsumable) {
                const outputData = this.currentOutputs.get(channelId);
                aiOutputs[channelId] = {
                    id: channelId,
                    name: channel.name,
                    description: channel.description,
                    interpretation: channel.aiInterpretation,
                    data: outputData?.data,
                    metadata: outputData?.metadata,
                    dataType: channel.dataType,
                    priority: channel.priority,
                    category: channel.category
                };
            }
        }
        
        return aiOutputs;
    }

    // Game Integration Helpers
    getGameVisibleInputs() {
        const gameInputs = {};
        
        for (const [knobId, knob] of this.inputKnobs) {
            if (knob.gameVisible) {
                gameInputs[knobId] = {
                    id: knobId,
                    name: knob.name,
                    description: knob.description,
                    currentValue: this.currentInputs.get(knobId),
                    type: knob.type,
                    constraints: knob.constraints,
                    category: knob.category,
                    impact: knob.impact
                };
            }
        }
        
        return gameInputs;
    }

    getGameConsumableOutputs() {
        const gameOutputs = {};
        
        for (const [channelId, channel] of this.outputChannels) {
            if (channel.gameConsumable) {
                const outputData = this.currentOutputs.get(channelId);
                gameOutputs[channelId] = {
                    id: channelId,
                    name: channel.name,
                    description: channel.description,
                    data: outputData?.data,
                    metadata: outputData?.metadata,
                    displayFormat: channel.gameDisplayFormat,
                    uiHints: channel.uiHints,
                    dataType: channel.dataType,
                    category: channel.category
                };
            }
        }
        
        return gameOutputs;
    }

    // Utility Methods
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    getPreviousValue(channelId, metric) {
        const history = this.outputHistory
            .filter(h => h.channelId === channelId)
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (history.length > 1) {
            return this.getNestedValue(history[1].data, metric);
        }
        
        return undefined;
    }

    getCurrentGameDay() {
        // Get from simulation engine or return 0
        return this.simulationEngine?.state?.currentGameDay || 0;
    }

    // System State
    getSystemState() {
        return {
            systemId: this.systemId,
            inputKnobs: this.inputKnobs.size,
            outputChannels: this.outputChannels.size,
            currentInputs: Object.fromEntries(this.currentInputs),
            lastUpdate: this.lastUpdate,
            metrics: this.metrics
        };
    }

    // Performance and Debugging
    getMetrics() {
        return {
            ...this.metrics,
            inputKnobCount: this.inputKnobs.size,
            outputChannelCount: this.outputChannels.size,
            inputHistorySize: this.inputHistory.length,
            outputHistorySize: this.outputHistory.length,
            changeListenerCount: Array.from(this.changeListeners.values())
                .reduce((sum, listeners) => sum + listeners.length, 0)
        };
    }

    getInputHistory(knobId, limit = 10) {
        return this.inputHistory
            .filter(h => !knobId || h.knobId === knobId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    getOutputHistory(channelId, limit = 10) {
        return this.outputHistory
            .filter(h => !channelId || h.channelId === channelId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    // Cleanup
    cleanup() {
        this.inputHistory = this.inputHistory.slice(-1000); // Keep last 1000 entries
        this.outputHistory = this.outputHistory.slice(-1000);
        
        // Clean up old cached data
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        this.inputHistory = this.inputHistory.filter(h => h.timestamp > cutoff);
        this.outputHistory = this.outputHistory.filter(h => h.timestamp > cutoff);
    }
}

module.exports = { DeterministicSystemInterface };

