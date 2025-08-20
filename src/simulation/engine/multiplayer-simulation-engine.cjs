// Startales Multiplayer Simulation Engine - Core Framework
// Hybrid AI + Deterministic Processing System with Multiplayer Support

const EventEmitter = require('events');

class MultiplayerSimulationEngine extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // Time scaling: 1 real second = 1 game day
            dayTickRate: 1000, // 1000ms = 1 game day
            quarterTickRate: 90000, // 90 seconds = 1 game quarter (90 game days)
            
            // Processing optimization
            batchSize: config.batchSize || 500, // larger batches for efficiency
            maxConcurrency: config.maxConcurrency || 4, // reduced for cost control
            aiTimeout: config.aiTimeout || 2000, // faster AI responses
            cacheSize: config.cacheSize || 50000, // larger cache for better hit rates
            maxPlayers: config.maxPlayers || 50, // current target: 50 players
            targetMaxPlayers: config.targetMaxPlayers || 10000, // future target: 10,000 players
            
            // Cost control settings
            aiCallsPerQuarter: config.aiCallsPerQuarter || 100, // limit AI calls per quarter
            backgroundProcessingRatio: config.backgroundProcessingRatio || 0.1, // 10% of time for background
            priorityProcessingRatio: config.priorityProcessingRatio || 0.7, // 70% for priority systems
            
            // Persistence settings
            autoSaveInterval: config.autoSaveInterval || 300000, // 5 minutes
            snapshotInterval: config.snapshotInterval || 900000, // 15 minutes
            
            ...config
        };

        this.state = {
            running: false,
            tick: 0,
            lastUpdate: Date.now(),
            gamePhase: 'setup', // setup, playing, paused, ended
            performance: {
                avgTickTime: 0,
                processedActions: 0,
                aiCalls: 0,
                cacheHits: 0
            }
        };

        // Multiplayer-specific state
        this.players = new Map(); // playerId -> player data
        this.civilizations = new Map(); // civId -> civilization data
        this.playerSessions = new Map(); // sessionId -> playerId
        
        // System separation
        this.sharedSystems = new Map(); // Galaxy-wide systems
        this.civilizationSystems = new Map(); // Per-civilization systems
        this.interactionSystems = new Map(); // Inter-civilization systems
        this.backgroundSystems = new Map(); // Player-agnostic systems

        // AI modules per civilization
        this.civilizationAI = new Map(); // civId -> AI modules
        
        this.cache = new Map();
        this.actionQueue = [];
        this.processingQueue = [];
        this.eventQueue = [];
    }

    // Multiplayer Management
    async addPlayer(playerData) {
        const playerId = playerData.id || this.generatePlayerId();
        
        const player = {
            id: playerId,
            name: playerData.name,
            type: playerData.type || 'human', // human, ai, hybrid, observer
            civilizationId: playerData.civilizationId,
            sessionId: playerData.sessionId,
            connected: true,
            lastActivity: Date.now(),
            permissions: playerData.permissions || this.getDefaultPermissions(playerData.type),
            aiDifficulty: playerData.aiDifficulty || 'medium', // for AI players
            aiPersonality: playerData.aiPersonality || 'balanced' // for AI players
        };

        this.players.set(playerId, player);
        
        if (playerData.sessionId) {
            this.playerSessions.set(playerData.sessionId, playerId);
        }

        // Initialize civilization if needed
        if (playerData.civilizationId && !this.civilizations.has(playerData.civilizationId)) {
            await this.initializeCivilization(playerData.civilizationId, player);
        }

        this.emit('playerAdded', player);
        console.log(`Player ${player.name} (${player.type}) added to game`);
        
        return player;
    }

    async removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player) return false;

        // Handle AI takeover for human players
        if (player.type === 'human' && player.civilizationId) {
            await this.convertToAIPlayer(player.civilizationId);
        }

        // Clean up sessions
        if (player.sessionId) {
            this.playerSessions.delete(player.sessionId);
        }

        this.players.delete(playerId);
        this.emit('playerRemoved', player);
        console.log(`Player ${player.name} removed from game`);
        
        return true;
    }

    async initializeCivilization(civilizationId, player) {
        const civilization = {
            id: civilizationId,
            name: player.civilizationName || `${player.name}'s Civilization`,
            playerId: player.id,
            species: player.species || 'human',
            homeworld: player.homeworld || this.assignHomeworld(),
            
            // Civilization-specific state
            population: 1000000,
            territory: [player.homeworld],
            resources: this.getStartingResources(),
            technology: this.getStartingTechnology(),
            policies: [],
            military: this.getStartingMilitary(),
            
            // Diplomatic relations (with other civs)
            relations: new Map(),
            treaties: [],
            tradeAgreements: [],
            
            // Cultural characteristics
            culture: {
                values: player.culturalValues || this.generateCulturalValues(),
                traits: player.culturalTraits || this.generateCulturalTraits(),
                government: player.governmentType || 'democracy'
            },

            // AI state for AI players
            aiState: player.type === 'ai' ? {
                difficulty: player.aiDifficulty,
                personality: player.aiPersonality,
                goals: this.generateAIGoals(player.aiPersonality),
                strategies: this.generateAIStrategies(player.aiPersonality)
            } : null
        };

        this.civilizations.set(civilizationId, civilization);

        // Initialize civilization-specific AI modules
        if (player.type === 'ai' || player.type === 'hybrid') {
            await this.initializeCivilizationAI(civilizationId, civilization);
        }

        // Initialize civilization-specific systems
        await this.initializeCivilizationSystems(civilizationId, civilization);

        console.log(`Civilization ${civilization.name} initialized for player ${player.name}`);
        return civilization;
    }

    async initializeCivilizationAI(civilizationId, civilization) {
        const aiModules = {
            psychology: null,
            financial: null,
            culture: null,
            political: null,
            military: null
        };

        for (const [moduleName, _] of Object.entries(aiModules)) {
            try {
                const ModuleClass = require(`../ai/${moduleName}-ai.cjs`).AIModule;
                const module = new ModuleClass({
                    ...this.config,
                    civilizationId,
                    difficulty: civilization.aiState?.difficulty,
                    personality: civilization.aiState?.personality
                });
                await module.initialize();
                aiModules[moduleName] = module;
                console.log(`AI Module '${moduleName}' initialized for civilization ${civilizationId}`);
            } catch (error) {
                console.warn(`Failed to initialize AI module '${moduleName}' for civilization ${civilizationId}:`, error.message);
            }
        }

        this.civilizationAI.set(civilizationId, aiModules);
    }

    async initializeCivilizationSystems(civilizationId, civilization) {
        const systems = {
            population: null,
            economy: null,
            military: null,
            research: null,
            diplomacy: null
        };

        for (const [systemName, _] of Object.entries(systems)) {
            try {
                const SystemClass = require(`../systems/civilization/${systemName}-system.cjs`).System;
                const system = new SystemClass({
                    ...this.config,
                    civilizationId,
                    civilization
                });
                await system.initialize();
                systems[systemName] = system;
                console.log(`System '${systemName}' initialized for civilization ${civilizationId}`);
            } catch (error) {
                console.warn(`Failed to initialize system '${systemName}' for civilization ${civilizationId}:`, error.message);
            }
        }

        this.civilizationSystems.set(civilizationId, systems);
    }

    // Core Engine Management (Updated for Multiplayer)
    async initialize() {
        console.log('Initializing Multiplayer Simulation Engine...');
        
        // Initialize shared systems (galaxy-wide)
        await this.initializeSharedSystems();
        
        // Initialize interaction systems (inter-civilization)
        await this.initializeInteractionSystems();
        
        // Initialize background systems (player-agnostic)
        await this.initializeBackgroundSystems();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Initialize shared game state
        await this.initializeSharedGameState();
        
        console.log('Multiplayer Simulation Engine initialized successfully');
        this.emit('initialized');
    }

    async initializeSharedSystems() {
        const sharedSystemTypes = [
            'galaxy-map',
            'universal-markets',
            'environmental',
            'cosmic-events'
        ];

        for (const systemType of sharedSystemTypes) {
            try {
                const SystemClass = require(`../systems/shared/${systemType}-system.cjs`).System;
                const system = new SystemClass(this.config);
                await system.initialize();
                this.sharedSystems.set(systemType, system);
                console.log(`Shared system '${systemType}' initialized`);
            } catch (error) {
                console.warn(`Failed to initialize shared system '${systemType}':`, error.message);
            }
        }
    }

    async initializeInteractionSystems() {
        const interactionSystemTypes = [
            'diplomacy',
            'trade',
            'warfare',
            'cultural-exchange'
        ];

        for (const systemType of interactionSystemTypes) {
            try {
                const SystemClass = require(`../systems/interaction/${systemType}-system.cjs`).System;
                const system = new SystemClass(this.config);
                await system.initialize();
                this.interactionSystems.set(systemType, system);
                console.log(`Interaction system '${systemType}' initialized`);
            } catch (error) {
                console.warn(`Failed to initialize interaction system '${systemType}':`, error.message);
            }
        }
    }

    async initializeBackgroundSystems() {
        const backgroundSystemTypes = [
            'minor-civilizations',
            'natural-evolution',
            'random-events'
        ];

        for (const systemType of backgroundSystemTypes) {
            try {
                const SystemClass = require(`../systems/background/${systemType}-system.cjs`).System;
                const system = new SystemClass(this.config);
                await system.initialize();
                this.backgroundSystems.set(systemType, system);
                console.log(`Background system '${systemType}' initialized`);
            } catch (error) {
                console.warn(`Failed to initialize background system '${systemType}':`, error.message);
            }
        }
    }

    // Multiplayer Simulation Loop
    async processTick() {
        // 1. Process shared systems (affects all players)
        await this.processSharedSystems();
        
        // 2. Process civilization-specific systems (parallel for each civ)
        await this.processCivilizationSystems();
        
        // 3. Process inter-civilization interactions
        await this.processInteractionSystems();
        
        // 4. Process background systems
        await this.processBackgroundSystems();
        
        // 5. Process AI player decisions
        await this.processAIPlayerDecisions();
        
        // 6. Update game state and notify players
        await this.updateGameStateAndNotifyPlayers();
        
        // 7. Handle events and notifications
        await this.processEventQueue();
    }

    async processSharedSystems() {
        const sharedPromises = [];
        
        for (const [systemName, system] of this.sharedSystems) {
            sharedPromises.push(
                system.processTick(this.state.tick, this.getSharedGameState())
                    .catch(error => console.error(`Shared system ${systemName} error:`, error))
            );
        }
        
        await Promise.all(sharedPromises);
    }

    async processCivilizationSystems() {
        const civilizationPromises = [];
        
        for (const [civId, systems] of this.civilizationSystems) {
            const civilization = this.civilizations.get(civId);
            if (!civilization) continue;
            
            // Process each civilization's systems in parallel
            const civPromise = this.processCivilizationTick(civId, civilization, systems);
            civilizationPromises.push(civPromise);
        }
        
        await Promise.all(civilizationPromises);
    }

    async processCivilizationTick(civId, civilization, systems) {
        const systemPromises = [];
        
        for (const [systemName, system] of Object.entries(systems)) {
            if (system) {
                systemPromises.push(
                    system.processTick(this.state.tick, civilization, this.getSharedGameState())
                        .catch(error => console.error(`Civilization ${civId} system ${systemName} error:`, error))
                );
            }
        }
        
        await Promise.all(systemPromises);
    }

    async processAIPlayerDecisions() {
        const aiDecisionPromises = [];
        
        for (const [playerId, player] of this.players) {
            if (player.type === 'ai' && player.civilizationId) {
                const aiPromise = this.processAIPlayerTick(player);
                aiDecisionPromises.push(aiPromise);
            }
        }
        
        await Promise.all(aiDecisionPromises);
    }

    async processAIPlayerTick(player) {
        const civilization = this.civilizations.get(player.civilizationId);
        const aiModules = this.civilizationAI.get(player.civilizationId);
        
        if (!civilization || !aiModules) return;

        try {
            // Get AI decision based on current state
            const context = await this.getAIDecisionContext(civilization);
            const decisions = await this.getAIDecisions(aiModules, context);
            
            // Queue AI decisions as actions
            for (const decision of decisions) {
                this.queueAction({
                    type: 'ai-decision',
                    playerId: player.id,
                    civilizationId: player.civilizationId,
                    decision,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error(`AI player ${player.name} decision error:`, error);
        }
    }

    async getAIDecisionContext(civilization) {
        return {
            civilization,
            sharedState: this.getSharedGameState(),
            otherCivilizations: this.getVisibleCivilizations(civilization.id),
            recentEvents: this.getRecentEvents(civilization.id),
            threats: this.getThreats(civilization.id),
            opportunities: this.getOpportunities(civilization.id)
        };
    }

    async getAIDecisions(aiModules, context) {
        const decisions = [];
        
        // Get decisions from each AI module
        for (const [moduleName, module] of Object.entries(aiModules)) {
            if (module) {
                try {
                    const moduleDecisions = await module.getDecisions(context);
                    decisions.push(...moduleDecisions);
                } catch (error) {
                    console.error(`AI module ${moduleName} decision error:`, error);
                }
            }
        }
        
        return decisions;
    }

    // Player Action Processing
    async processPlayerAction(playerId, action) {
        const player = this.players.get(playerId);
        if (!player) {
            throw new Error(`Player ${playerId} not found`);
        }

        // Validate player permissions
        if (!this.validatePlayerAction(player, action)) {
            throw new Error(`Player ${playerId} not authorized for action ${action.type}`);
        }

        // Add to action queue
        this.queueAction({
            ...action,
            playerId,
            civilizationId: player.civilizationId,
            timestamp: Date.now(),
            tick: this.state.tick
        });

        return { success: true, queued: true };
    }

    validatePlayerAction(player, action) {
        // Check if player has permission for this action type
        if (!player.permissions.includes(action.type) && !player.permissions.includes('all')) {
            return false;
        }

        // Check if player is connected (for human players)
        if (player.type === 'human' && !player.connected) {
            return false;
        }

        // Check civilization ownership
        if (action.requiresCivilization && !player.civilizationId) {
            return false;
        }

        return true;
    }

    // Game State Management
    getSharedGameState() {
        return {
            tick: this.state.tick,
            gamePhase: this.state.gamePhase,
            galaxy: this.sharedSystems.get('galaxy-map')?.getState(),
            markets: this.sharedSystems.get('universal-markets')?.getState(),
            environment: this.sharedSystems.get('environmental')?.getState(),
            events: this.getRecentSharedEvents()
        };
    }

    getCivilizationGameState(civilizationId, requestingPlayerId) {
        const civilization = this.civilizations.get(civilizationId);
        if (!civilization) return null;

        const requestingPlayer = this.players.get(requestingPlayerId);
        const isOwner = requestingPlayer?.civilizationId === civilizationId;
        const isObserver = requestingPlayer?.type === 'observer';

        // Return different levels of detail based on permissions
        if (isOwner) {
            return this.getFullCivilizationState(civilization);
        } else if (isObserver) {
            return this.getObserverCivilizationState(civilization);
        } else {
            return this.getPublicCivilizationState(civilization);
        }
    }

    getFullCivilizationState(civilization) {
        // Full state for civilization owner
        return {
            ...civilization,
            systems: this.civilizationSystems.get(civilization.id),
            privateIntelligence: this.getPrivateIntelligence(civilization.id),
            secretProjects: this.getSecretProjects(civilization.id)
        };
    }

    getPublicCivilizationState(civilization) {
        // Limited state visible to other players
        return {
            id: civilization.id,
            name: civilization.name,
            species: civilization.species,
            territory: civilization.territory,
            publicPolicies: civilization.policies.filter(p => p.public),
            diplomaticStance: civilization.relations.get('public'),
            culturalTraits: civilization.culture.traits.filter(t => t.visible)
        };
    }

    // Utility Methods
    generatePlayerId() {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getDefaultPermissions(playerType) {
        const permissions = {
            human: ['policy', 'military', 'diplomacy', 'trade', 'research'],
            ai: ['all'],
            hybrid: ['policy', 'military', 'diplomacy', 'trade', 'research', 'ai-assist'],
            observer: ['view']
        };
        
        return permissions[playerType] || permissions.human;
    }

    assignHomeworld() {
        // Logic to assign a homeworld to new civilization
        const galaxySystem = this.sharedSystems.get('galaxy-map');
        return galaxySystem?.assignHomeworld() || 'default-homeworld';
    }

    getStartingResources() {
        return {
            credits: 10000,
            minerals: 1000,
            energy: 500,
            food: 800,
            research: 100
        };
    }

    getStartingTechnology() {
        return {
            level: 1,
            researched: ['basic-agriculture', 'basic-manufacturing', 'basic-energy'],
            researching: null,
            researchPoints: 0
        };
    }

    getStartingMilitary() {
        return {
            fleets: [
                {
                    id: 'home-defense',
                    name: 'Home Defense Fleet',
                    ships: 5,
                    strength: 100,
                    location: 'homeworld'
                }
            ],
            totalStrength: 100,
            readiness: 0.8
        };
    }

    generateCulturalValues() {
        return ['progress', 'cooperation', 'knowledge', 'prosperity'];
    }

    generateCulturalTraits() {
        return [
            { name: 'industrious', value: 0.7, visible: true },
            { name: 'diplomatic', value: 0.6, visible: true },
            { name: 'scientific', value: 0.8, visible: false }
        ];
    }

    generateAIGoals(personality) {
        const goalSets = {
            aggressive: ['military_dominance', 'territorial_expansion', 'resource_control'],
            diplomatic: ['alliance_building', 'trade_networks', 'cultural_influence'],
            scientific: ['technological_advancement', 'research_leadership', 'knowledge_sharing'],
            economic: ['trade_dominance', 'resource_monopoly', 'economic_growth'],
            balanced: ['steady_growth', 'defensive_strength', 'diplomatic_relations']
        };
        
        return goalSets[personality] || goalSets.balanced;
    }

    generateAIStrategies(personality) {
        const strategySets = {
            aggressive: ['rapid_expansion', 'military_buildup', 'intimidation_diplomacy'],
            diplomatic: ['alliance_formation', 'trade_agreements', 'cultural_exchange'],
            scientific: ['research_focus', 'technology_sharing', 'peaceful_exploration'],
            economic: ['trade_route_control', 'resource_acquisition', 'market_manipulation'],
            balanced: ['gradual_expansion', 'defensive_preparation', 'opportunistic_growth']
        };
        
        return strategySets[personality] || strategySets.balanced;
    }

    async convertToAIPlayer(civilizationId) {
        const civilization = this.civilizations.get(civilizationId);
        if (!civilization) return;

        // Create AI player to replace human
        const aiPlayer = {
            id: `ai_${civilizationId}`,
            name: `AI ${civilization.name}`,
            type: 'ai',
            civilizationId,
            connected: true,
            lastActivity: Date.now(),
            permissions: this.getDefaultPermissions('ai'),
            aiDifficulty: 'medium',
            aiPersonality: 'balanced'
        };

        this.players.set(aiPlayer.id, aiPlayer);
        
        // Update civilization
        civilization.playerId = aiPlayer.id;
        civilization.aiState = {
            difficulty: aiPlayer.aiDifficulty,
            personality: aiPlayer.aiPersonality,
            goals: this.generateAIGoals(aiPlayer.aiPersonality),
            strategies: this.generateAIStrategies(aiPlayer.aiPersonality)
        };

        // Initialize AI modules
        await this.initializeCivilizationAI(civilizationId, civilization);

        console.log(`Civilization ${civilization.name} converted to AI control`);
        this.emit('civilizationConvertedToAI', { civilizationId, aiPlayer });
    }

    // Public API Methods (Updated for Multiplayer)
    queueAction(action) {
        this.actionQueue.push({
            ...action,
            timestamp: Date.now(),
            tick: this.state.tick
        });
    }

    getPlayerGameState(playerId) {
        const player = this.players.get(playerId);
        if (!player) return null;

        return {
            player,
            shared: this.getSharedGameState(),
            civilization: player.civilizationId ? 
                this.getCivilizationGameState(player.civilizationId, playerId) : null,
            otherCivilizations: this.getVisibleCivilizations(player.civilizationId, playerId),
            performance: this.getPerformanceMetrics()
        };
    }

    getVisibleCivilizations(civilizationId, requestingPlayerId) {
        const visibleCivs = [];
        
        for (const [civId, civilization] of this.civilizations) {
            if (civId !== civilizationId) {
                visibleCivs.push(this.getCivilizationGameState(civId, requestingPlayerId));
            }
        }
        
        return visibleCivs;
    }

    getGameLobbyState() {
        return {
            players: Array.from(this.players.values()).map(p => ({
                id: p.id,
                name: p.name,
                type: p.type,
                connected: p.connected,
                civilizationName: this.civilizations.get(p.civilizationId)?.name
            })),
            gamePhase: this.state.gamePhase,
            maxPlayers: this.config.maxPlayers,
            settings: {
                tickRate: this.config.tickRate,
                galaxySize: this.sharedSystems.get('galaxy-map')?.getSize()
            }
        };
    }
}

module.exports = { MultiplayerSimulationEngine };
