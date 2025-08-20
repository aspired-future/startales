// Startales Simulation Engine - Core Framework
// Hybrid AI + Deterministic Processing System

const EventEmitter = require('events');

class SimulationEngine extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            tickRate: config.tickRate || 1000, // ms between simulation ticks
            batchSize: config.batchSize || 100, // characters processed per batch
            maxConcurrency: config.maxConcurrency || 10, // parallel processing limit
            aiTimeout: config.aiTimeout || 5000, // AI response timeout
            cacheSize: config.cacheSize || 10000, // result cache size
            ...config
        };

        this.state = {
            running: false,
            tick: 0,
            lastUpdate: Date.now(),
            performance: {
                avgTickTime: 0,
                processedActions: 0,
                aiCalls: 0,
                cacheHits: 0
            }
        };

        this.systems = new Map();
        this.aiModules = new Map();
        this.deterministic = new Map();
        this.cache = new Map();
        this.actionQueue = [];
        this.processingQueue = [];
    }

    // Core Engine Management
    async initialize() {
        console.log('Initializing Simulation Engine...');
        
        // Initialize AI modules
        await this.initializeAIModules();
        
        // Initialize deterministic systems
        await this.initializeDeterministicSystems();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Initialize game state
        await this.initializeGameState();
        
        console.log('Simulation Engine initialized successfully');
        this.emit('initialized');
    }

    async start() {
        if (this.state.running) return;
        
        console.log('Starting Simulation Engine...');
        this.state.running = true;
        this.state.lastUpdate = Date.now();
        
        // Start main simulation loop
        this.simulationLoop();
        
        this.emit('started');
        console.log('Simulation Engine started');
    }

    async stop() {
        if (!this.state.running) return;
        
        console.log('Stopping Simulation Engine...');
        this.state.running = false;
        
        // Wait for current processing to complete
        await this.waitForProcessingComplete();
        
        this.emit('stopped');
        console.log('Simulation Engine stopped');
    }

    // Main Simulation Loop
    async simulationLoop() {
        while (this.state.running) {
            const tickStart = Date.now();
            
            try {
                await this.processTick();
                this.state.tick++;
                
                // Update performance metrics
                const tickTime = Date.now() - tickStart;
                this.updatePerformanceMetrics(tickTime);
                
                // Emit tick event
                this.emit('tick', {
                    tick: this.state.tick,
                    tickTime,
                    performance: this.state.performance
                });
                
                // Wait for next tick
                const sleepTime = Math.max(0, this.config.tickRate - tickTime);
                if (sleepTime > 0) {
                    await this.sleep(sleepTime);
                }
                
            } catch (error) {
                console.error('Simulation tick error:', error);
                this.emit('error', error);
                
                // Continue running unless critical error
                if (error.critical) {
                    await this.stop();
                }
            }
        }
    }

    async processTick() {
        // 1. Collect pending actions
        const actions = this.collectPendingActions();
        
        // 2. Process character decisions in parallel
        const characterDecisions = await this.processCharacterDecisions(actions.character);
        
        // 3. Process economic calculations
        const economicUpdates = await this.processEconomicCalculations(actions.economic);
        
        // 4. Process political and social changes
        const socialUpdates = await this.processSocialChanges(actions.social);
        
        // 5. Update game state
        await this.updateGameState({
            character: characterDecisions,
            economic: economicUpdates,
            social: socialUpdates
        });
        
        // 6. Generate events and notifications
        await this.generateEvents();
    }

    // AI Module Management
    async initializeAIModules() {
        const aiModules = [
            'psychology',
            'financial',
            'culture',
            'political',
            'military'
        ];

        for (const moduleName of aiModules) {
            try {
                const module = require(`../ai/${moduleName}-ai.cjs`);
                this.aiModules.set(moduleName, new module.AIModule(this.config));
                await this.aiModules.get(moduleName).initialize();
                console.log(`AI Module '${moduleName}' initialized`);
            } catch (error) {
                console.warn(`Failed to initialize AI module '${moduleName}':`, error.message);
            }
        }
    }

    async initializeDeterministicSystems() {
        const systems = [
            'character-management',
            'economic-tiers',
            'city-infrastructure',
            'resource-management',
            'population-dynamics'
        ];

        for (const systemName of systems) {
            try {
                const system = require(`../deterministic/${systemName}.cjs`);
                this.deterministic.set(systemName, new system.System(this.config));
                await this.deterministic.get(systemName).initialize();
                console.log(`Deterministic system '${systemName}' initialized`);
            } catch (error) {
                console.warn(`Failed to initialize system '${systemName}':`, error.message);
            }
        }
    }

    // Character Decision Processing
    async processCharacterDecisions(characterActions) {
        if (!characterActions || characterActions.length === 0) return [];

        const batches = this.createBatches(characterActions, this.config.batchSize);
        const results = [];

        // Process batches in parallel
        const batchPromises = batches.map(batch => this.processCharacterBatch(batch));
        const batchResults = await Promise.all(batchPromises);

        return batchResults.flat();
    }

    async processCharacterBatch(characters) {
        const decisions = [];

        for (const character of characters) {
            try {
                const decision = await this.processCharacterDecision(character);
                decisions.push(decision);
            } catch (error) {
                console.error(`Error processing character ${character.id}:`, error);
                // Continue with other characters
            }
        }

        return decisions;
    }

    async processCharacterDecision(character) {
        // 1. Gather context
        const context = await this.gatherCharacterContext(character);
        
        // 2. Check cache for similar decisions
        const cacheKey = this.generateCacheKey('character-decision', context);
        if (this.cache.has(cacheKey)) {
            this.state.performance.cacheHits++;
            return this.cache.get(cacheKey);
        }

        // 3. Generate AI decision
        const aiDecision = await this.getAIDecision('psychology', {
            character,
            context,
            type: 'character-decision'
        });

        // 4. Validate with deterministic systems
        const validatedDecision = await this.validateDecision(aiDecision, context);

        // 5. Cache result
        this.cache.set(cacheKey, validatedDecision);
        if (this.cache.size > this.config.cacheSize) {
            this.pruneCache();
        }

        return validatedDecision;
    }

    // Economic Processing
    async processEconomicCalculations(economicActions) {
        if (!economicActions || economicActions.length === 0) return [];

        const results = [];

        // Process different economic tiers in parallel
        const tierPromises = [
            this.processIndividualEconomics(economicActions.individual || []),
            this.processBusinessEconomics(economicActions.business || []),
            this.processCityEconomics(economicActions.city || []),
            this.processGalacticEconomics(economicActions.galactic || [])
        ];

        const tierResults = await Promise.all(tierPromises);
        return tierResults.flat();
    }

    async processIndividualEconomics(actions) {
        const economicSystem = this.deterministic.get('economic-tiers');
        const financialAI = this.aiModules.get('financial');

        const results = [];

        for (const action of actions) {
            try {
                // Get AI analysis of economic decision
                const aiAnalysis = await financialAI.analyzeDecision(action);
                
                // Apply deterministic calculations
                const result = await economicSystem.processIndividualAction(action, aiAnalysis);
                
                results.push(result);
            } catch (error) {
                console.error('Individual economics error:', error);
            }
        }

        return results;
    }

    // Social and Cultural Processing
    async processSocialChanges(socialActions) {
        if (!socialActions || socialActions.length === 0) return [];

        const cultureAI = this.aiModules.get('culture');
        const politicalAI = this.aiModules.get('political');

        const results = [];

        // Process cultural evolution
        if (socialActions.cultural) {
            const culturalResults = await this.processCulturalEvolution(socialActions.cultural, cultureAI);
            results.push(...culturalResults);
        }

        // Process political changes
        if (socialActions.political) {
            const politicalResults = await this.processPoliticalChanges(socialActions.political, politicalAI);
            results.push(...politicalResults);
        }

        return results;
    }

    // AI Integration Methods
    async getAIDecision(moduleName, input) {
        const module = this.aiModules.get(moduleName);
        if (!module) {
            throw new Error(`AI module '${moduleName}' not found`);
        }

        this.state.performance.aiCalls++;

        try {
            const result = await Promise.race([
                module.processDecision(input),
                this.timeout(this.config.aiTimeout)
            ]);

            return result;
        } catch (error) {
            console.error(`AI module '${moduleName}' error:`, error);
            // Return fallback decision
            return this.getFallbackDecision(input);
        }
    }

    async validateDecision(decision, context) {
        // Validate decision against game rules and constraints
        const validation = {
            valid: true,
            issues: [],
            adjustments: {}
        };

        // Check resource constraints
        if (decision.resourceCost) {
            const resourceSystem = this.deterministic.get('resource-management');
            const available = await resourceSystem.getAvailableResources(context.character.id);
            
            if (!resourceSystem.canAfford(available, decision.resourceCost)) {
                validation.valid = false;
                validation.issues.push('Insufficient resources');
                validation.adjustments.resourceCost = available;
            }
        }

        // Check social constraints
        if (decision.socialImpact) {
            const socialSystem = this.deterministic.get('population-dynamics');
            const socialValidation = await socialSystem.validateSocialAction(decision.socialImpact);
            
            if (!socialValidation.valid) {
                validation.issues.push(...socialValidation.issues);
                validation.adjustments.socialImpact = socialValidation.adjustments;
            }
        }

        // Apply adjustments if needed
        if (validation.adjustments && Object.keys(validation.adjustments).length > 0) {
            decision = { ...decision, ...validation.adjustments };
        }

        decision.validation = validation;
        return decision;
    }

    // Utility Methods
    collectPendingActions() {
        const actions = {
            character: [],
            economic: { individual: [], business: [], city: [], galactic: [] },
            social: { cultural: [], political: [] }
        };

        // Collect from action queue
        while (this.actionQueue.length > 0) {
            const action = this.actionQueue.shift();
            
            switch (action.type) {
                case 'character':
                    actions.character.push(action);
                    break;
                case 'economic':
                    actions.economic[action.tier].push(action);
                    break;
                case 'social':
                    actions.social[action.category].push(action);
                    break;
            }
        }

        return actions;
    }

    createBatches(items, batchSize) {
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        return batches;
    }

    generateCacheKey(type, context) {
        // Generate a hash-like key from context
        const contextStr = JSON.stringify(context);
        return `${type}:${this.simpleHash(contextStr)}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    pruneCache() {
        // Remove oldest entries
        const entries = Array.from(this.cache.entries());
        const toRemove = entries.slice(0, Math.floor(this.config.cacheSize * 0.1));
        
        for (const [key] of toRemove) {
            this.cache.delete(key);
        }
    }

    updatePerformanceMetrics(tickTime) {
        const perf = this.state.performance;
        perf.avgTickTime = (perf.avgTickTime * 0.9) + (tickTime * 0.1);
        perf.processedActions++;
    }

    async gatherCharacterContext(character) {
        // Gather relevant context for character decision-making
        const characterSystem = this.deterministic.get('character-management');
        
        return {
            character: await characterSystem.getCharacterDetails(character.id),
            location: await characterSystem.getLocation(character.id),
            relationships: await characterSystem.getRelationships(character.id),
            resources: await characterSystem.getResources(character.id),
            recentActions: await characterSystem.getRecentActions(character.id),
            environment: await this.getEnvironmentalContext(character.location)
        };
    }

    getFallbackDecision(input) {
        // Simple fallback decision when AI fails
        return {
            action: 'wait',
            confidence: 0.1,
            reasoning: 'Fallback decision due to AI processing error',
            fallback: true
        };
    }

    async timeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), ms);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async waitForProcessingComplete() {
        while (this.processingQueue.length > 0) {
            await this.sleep(100);
        }
    }

    setupEventHandlers() {
        this.on('error', (error) => {
            console.error('Simulation Engine Error:', error);
        });

        this.on('tick', (data) => {
            if (data.tick % 100 === 0) {
                console.log(`Simulation tick ${data.tick}, avg time: ${data.performance.avgTickTime.toFixed(2)}ms`);
            }
        });
    }

    async initializeGameState() {
        // Initialize basic game state
        this.gameState = {
            characters: new Map(),
            cities: new Map(),
            businesses: new Map(),
            resources: new Map(),
            events: [],
            time: {
                tick: 0,
                gameDate: new Date('2387-01-01'),
                timeScale: 1 // 1 tick = 1 game hour
            }
        };
    }

    async updateGameState(updates) {
        // Apply updates to game state
        if (updates.character) {
            for (const update of updates.character) {
                if (update.characterId) {
                    // Update character state
                    const character = this.gameState.characters.get(update.characterId);
                    if (character) {
                        Object.assign(character, update.changes);
                    }
                }
            }
        }

        // Emit state change event
        this.emit('stateChanged', updates);
    }

    async generateEvents() {
        // Generate events based on current state
        // This would analyze the game state and create interesting events
        // for the UI to display
    }

    // Public API Methods
    queueAction(action) {
        this.actionQueue.push({
            ...action,
            timestamp: Date.now(),
            tick: this.state.tick
        });
    }

    getPerformanceMetrics() {
        return {
            ...this.state.performance,
            tick: this.state.tick,
            running: this.state.running,
            cacheSize: this.cache.size,
            queueSize: this.actionQueue.length
        };
    }

    getGameState() {
        return {
            time: this.gameState.time,
            statistics: {
                characters: this.gameState.characters.size,
                cities: this.gameState.cities.size,
                businesses: this.gameState.businesses.size
            }
        };
    }
}

module.exports = { SimulationEngine };

