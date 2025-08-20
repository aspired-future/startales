// Scalable Simulation Engine - Optimized for 50-10,000+ Players
// Real-time continuous simulation with cost optimization

const EventEmitter = require('events');
const cluster = require('cluster');
const os = require('os');

class ScalableSimulationEngine extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // Time scaling: 1 real second = 1 game day, 90 seconds = 1 quarter
            dayTickRate: 1000, // 1000ms = 1 game day
            quarterTickRate: 90000, // 90 seconds = 1 game quarter
            
            // Scalability settings
            maxPlayers: config.maxPlayers || 50,
            targetMaxPlayers: config.targetMaxPlayers || 10000,
            playersPerShard: config.playersPerShard || 2500,
            
            // Performance optimization
            batchSize: config.batchSize || 1000, // Large batches for efficiency
            maxConcurrency: config.maxConcurrency || Math.min(8, os.cpus().length),
            processingTimeSlice: config.processingTimeSlice || 50, // ms per processing slice
            
            // Cost control
            aiProcessingBudget: {
                tier1CallsPerQuarter: 20,    // Premium AI for active human players
                tier2CallsPerQuarter: 100,   // Standard AI for important civs
                tier3CallsPerQuarter: 500,   // Basic AI for background civs
                ruleBasedUnlimited: true     // Unlimited rule-based decisions
            },
            
            // Caching and persistence
            cacheSize: config.cacheSize || 100000,
            cacheHitRateTarget: 0.85, // 85% cache hit rate target
            autoSaveInterval: 300000, // 5 minutes
            snapshotInterval: 900000, // 15 minutes
            
            // Processing priorities
            processingPriorities: {
                critical: { maxLatency: 100, weight: 1.0 },    // Player actions
                high: { maxLatency: 1000, weight: 0.8 },       // Economic updates
                medium: { maxLatency: 10000, weight: 0.6 },    // AI decisions
                low: { maxLatency: 60000, weight: 0.4 },       // Background sim
                batch: { maxLatency: 90000, weight: 0.2 }      // Quarterly updates
            },
            
            ...config
        };

        // Core state
        this.state = {
            running: false,
            currentTick: 0,
            currentGameDay: 0,
            currentQuarter: 0,
            lastDayTick: Date.now(),
            lastQuarterTick: Date.now(),
            gameStartTime: Date.now(),
            
            // Performance tracking
            performance: {
                avgTickTime: 0,
                processedActionsPerSecond: 0,
                aiCallsThisQuarter: { tier1: 0, tier2: 0, tier3: 0 },
                cacheHitRate: 0,
                activePlayerCount: 0,
                totalPlayerCount: 0
            }
        };

        // Scalable data structures
        this.players = new Map(); // playerId -> player data
        this.civilizations = new Map(); // civId -> civilization data
        this.galaxyRegions = new Map(); // regionId -> region data
        
        // Processing queues with priorities
        this.actionQueues = {
            critical: [],
            high: [],
            medium: [],
            low: [],
            batch: []
        };
        
        // Intelligent batching system
        this.batcher = new IntelligentBatcher(this.config);
        
        // Adaptive AI processor
        this.aiProcessor = new AdaptiveAIProcessor(this.config);
        
        // Predictive cache
        this.cache = new PredictiveCache(this.config.cacheSize);
        
        // Performance monitor
        this.performanceMonitor = new PerformanceMonitor(this);
        
        // Timers
        this.dayTimer = null;
        this.quarterTimer = null;
        this.autoSaveTimer = null;
    }

    // Core Engine Lifecycle
    async initialize() {
        console.log('Initializing Scalable Simulation Engine...');
        console.log(`Target: ${this.config.maxPlayers} players (scaling to ${this.config.targetMaxPlayers})`);
        
        // Initialize galaxy regions for sharding
        await this.initializeGalaxyRegions();
        
        // Initialize shared systems
        await this.initializeSharedSystems();
        
        // Initialize AI processor
        await this.aiProcessor.initialize();
        
        // Set up performance monitoring
        this.performanceMonitor.start();
        
        console.log('Scalable Simulation Engine initialized');
        this.emit('initialized');
    }

    async start() {
        if (this.state.running) return;
        
        console.log('Starting continuous simulation...');
        this.state.running = true;
        this.state.gameStartTime = Date.now();
        this.state.lastDayTick = Date.now();
        this.state.lastQuarterTick = Date.now();
        
        // Start continuous day ticks (1 second = 1 game day)
        this.dayTimer = setInterval(() => {
            this.processDayTick();
        }, this.config.dayTickRate);
        
        // Start quarterly major ticks (90 seconds = 1 quarter)
        this.quarterTimer = setInterval(() => {
            this.processQuarterTick();
        }, this.config.quarterTickRate);
        
        // Start auto-save
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.config.autoSaveInterval);
        
        // Start main processing loop
        this.startProcessingLoop();
        
        this.emit('started');
        console.log('Continuous simulation started');
    }

    async stop() {
        if (!this.state.running) return;
        
        console.log('Stopping simulation...');
        this.state.running = false;
        
        // Clear timers
        if (this.dayTimer) clearInterval(this.dayTimer);
        if (this.quarterTimer) clearInterval(this.quarterTimer);
        if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
        
        // Final save
        await this.autoSave();
        
        this.emit('stopped');
        console.log('Simulation stopped');
    }

    // Main Processing Loop - Continuous background processing
    async startProcessingLoop() {
        while (this.state.running) {
            const loopStart = Date.now();
            
            try {
                // Process actions by priority
                await this.processActionQueues();
                
                // Update performance metrics
                this.updatePerformanceMetrics(Date.now() - loopStart);
                
                // Adaptive sleep based on load
                const sleepTime = this.calculateAdaptiveSleep();
                if (sleepTime > 0) {
                    await this.sleep(sleepTime);
                }
                
            } catch (error) {
                console.error('Processing loop error:', error);
                this.emit('error', error);
                
                // Brief pause on error to prevent tight error loops
                await this.sleep(1000);
            }
        }
    }

    // Day Tick Processing (Every 1 second = 1 game day)
    async processDayTick() {
        this.state.currentGameDay++;
        this.state.currentTick++;
        this.state.lastDayTick = Date.now();
        
        // Queue daily processing tasks
        this.queueAction({
            type: 'daily-update',
            priority: 'high',
            data: { gameDay: this.state.currentGameDay }
        });
        
        // Emit day tick event
        this.emit('dayTick', {
            gameDay: this.state.currentGameDay,
            realTime: Date.now(),
            activePlayers: this.getActivePlayerCount()
        });
    }

    // Quarter Tick Processing (Every 90 seconds = 1 quarter)
    async processQuarterTick() {
        this.state.currentQuarter++;
        this.state.lastQuarterTick = Date.now();
        
        // Reset AI processing budgets
        this.aiProcessor.resetQuarterlyBudgets();
        
        // Queue quarterly processing tasks
        this.queueAction({
            type: 'quarterly-update',
            priority: 'batch',
            data: { quarter: this.state.currentQuarter }
        });
        
        // Emit quarter tick event
        this.emit('quarterTick', {
            quarter: this.state.currentQuarter,
            gameDay: this.state.currentGameDay,
            realTime: Date.now(),
            performance: this.state.performance
        });
        
        console.log(`Quarter ${this.state.currentQuarter} - Day ${this.state.currentGameDay} - ${this.state.performance.activePlayerCount} active players`);
    }

    // Action Queue Processing with Priority
    async processActionQueues() {
        const startTime = Date.now();
        const timeSlice = this.config.processingTimeSlice;
        
        // Process queues by priority until time slice is exhausted
        for (const priority of ['critical', 'high', 'medium', 'low', 'batch']) {
            const queue = this.actionQueues[priority];
            const priorityConfig = this.config.processingPriorities[priority];
            
            while (queue.length > 0 && (Date.now() - startTime) < timeSlice) {
                const actions = queue.splice(0, this.config.batchSize);
                await this.processBatchedActions(actions, priority);
                
                // Check if we've exceeded the time slice
                if ((Date.now() - startTime) >= timeSlice * priorityConfig.weight) {
                    break;
                }
            }
        }
    }

    async processBatchedActions(actions, priority) {
        if (actions.length === 0) return;
        
        // Group actions by type for efficient batch processing
        const actionGroups = this.groupActionsByType(actions);
        
        // Process each group
        const processingPromises = [];
        for (const [actionType, actionList] of actionGroups) {
            processingPromises.push(
                this.processActionGroup(actionType, actionList, priority)
                    .catch(error => console.error(`Action group ${actionType} error:`, error))
            );
        }
        
        await Promise.all(processingPromises);
    }

    async processActionGroup(actionType, actions, priority) {
        switch (actionType) {
            case 'player-action':
                return this.processPlayerActions(actions);
            case 'ai-decision':
                return this.processAIDecisions(actions);
            case 'economic-update':
                return this.processEconomicUpdates(actions);
            case 'daily-update':
                return this.processDailyUpdates(actions);
            case 'quarterly-update':
                return this.processQuarterlyUpdates(actions);
            default:
                console.warn(`Unknown action type: ${actionType}`);
        }
    }

    // Player Management (Optimized for Scale)
    async addPlayer(playerData) {
        const playerId = playerData.id || this.generatePlayerId();
        
        // Determine optimal galaxy region (shard) for player
        const regionId = await this.assignOptimalRegion(playerData);
        
        const player = {
            id: playerId,
            name: playerData.name,
            type: playerData.type || 'human',
            regionId,
            civilizationId: playerData.civilizationId,
            sessionId: playerData.sessionId,
            connected: true,
            lastActivity: Date.now(),
            aiTier: this.determineAITier(playerData),
            
            // Performance tracking
            actionCount: 0,
            lastActionTime: Date.now(),
            averageActionInterval: 0
        };

        this.players.set(playerId, player);
        
        // Initialize civilization if needed
        if (playerData.civilizationId) {
            await this.initializePlayerCivilization(player, playerData);
        }
        
        // Update performance metrics
        this.state.performance.totalPlayerCount = this.players.size;
        this.updateActivePlayerCount();
        
        this.emit('playerAdded', player);
        console.log(`Player ${player.name} added to region ${regionId} (${this.players.size}/${this.config.maxPlayers})`);
        
        return player;
    }

    async assignOptimalRegion(playerData) {
        // Find region with lowest load
        let optimalRegion = 'core-worlds';
        let minLoad = Infinity;
        
        for (const [regionId, region] of this.galaxyRegions) {
            const load = this.calculateRegionLoad(region);
            if (load < minLoad) {
                minLoad = load;
                optimalRegion = regionId;
            }
        }
        
        return optimalRegion;
    }

    calculateRegionLoad(region) {
        const playerCount = Array.from(this.players.values())
            .filter(p => p.regionId === region.id).length;
        
        const civilizationCount = Array.from(this.civilizations.values())
            .filter(c => c.regionId === region.id).length;
        
        // Load = players + (civilizations * 0.5) + (AI processing weight)
        return playerCount + (civilizationCount * 0.5) + (region.aiProcessingLoad || 0);
    }

    determineAITier(playerData) {
        if (playerData.type === 'human') {
            return 'tier1'; // Best AI support for human players
        } else if (playerData.type === 'ai' && playerData.importance === 'high') {
            return 'tier2'; // Good AI for important AI players
        } else {
            return 'tier3'; // Basic AI for background players
        }
    }

    // Action Processing Methods
    async processPlayerActions(actions) {
        // Group by player for efficient processing
        const playerGroups = new Map();
        
        for (const action of actions) {
            if (!playerGroups.has(action.playerId)) {
                playerGroups.set(action.playerId, []);
            }
            playerGroups.get(action.playerId).push(action);
        }
        
        // Process each player's actions
        const promises = [];
        for (const [playerId, playerActions] of playerGroups) {
            promises.push(this.processPlayerActionGroup(playerId, playerActions));
        }
        
        await Promise.all(promises);
    }

    async processPlayerActionGroup(playerId, actions) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        // Update player activity
        player.lastActivity = Date.now();
        player.actionCount += actions.length;
        
        // Process actions
        for (const action of actions) {
            try {
                await this.processIndividualPlayerAction(player, action);
            } catch (error) {
                console.error(`Player action error for ${playerId}:`, error);
            }
        }
    }

    async processAIDecisions(actions) {
        // Group by AI tier for budget management
        const tierGroups = { tier1: [], tier2: [], tier3: [] };
        
        for (const action of actions) {
            const player = this.players.get(action.playerId);
            if (player) {
                tierGroups[player.aiTier].push(action);
            }
        }
        
        // Process each tier with budget constraints
        for (const [tier, tierActions] of Object.entries(tierGroups)) {
            if (tierActions.length > 0) {
                await this.processAITierDecisions(tier, tierActions);
            }
        }
    }

    async processAITierDecisions(tier, actions) {
        const budget = this.aiProcessor.getRemainingBudget(tier);
        const actionsToProcess = Math.min(actions.length, budget);
        
        // Process within budget
        const promises = [];
        for (let i = 0; i < actionsToProcess; i++) {
            promises.push(this.aiProcessor.processDecision(actions[i], tier));
        }
        
        // Fallback to rule-based for remaining actions
        for (let i = actionsToProcess; i < actions.length; i++) {
            promises.push(this.aiProcessor.processRuleBasedDecision(actions[i]));
        }
        
        await Promise.all(promises);
    }

    // Utility Methods
    queueAction(action) {
        const priority = action.priority || 'medium';
        const queue = this.actionQueues[priority];
        
        if (queue) {
            queue.push({
                ...action,
                timestamp: Date.now(),
                gameDay: this.state.currentGameDay
            });
        } else {
            console.warn(`Unknown priority: ${priority}`);
        }
    }

    groupActionsByType(actions) {
        const groups = new Map();
        
        for (const action of actions) {
            if (!groups.has(action.type)) {
                groups.set(action.type, []);
            }
            groups.get(action.type).push(action);
        }
        
        return groups;
    }

    getActivePlayerCount() {
        const now = Date.now();
        const activeThreshold = 300000; // 5 minutes
        
        return Array.from(this.players.values())
            .filter(p => (now - p.lastActivity) < activeThreshold).length;
    }

    updateActivePlayerCount() {
        this.state.performance.activePlayerCount = this.getActivePlayerCount();
    }

    calculateAdaptiveSleep() {
        const totalQueueSize = Object.values(this.actionQueues)
            .reduce((sum, queue) => sum + queue.length, 0);
        
        // Sleep less when queues are full, more when empty
        if (totalQueueSize > 1000) {
            return 1; // Minimal sleep when busy
        } else if (totalQueueSize > 100) {
            return 10; // Short sleep when moderately busy
        } else {
            return 50; // Longer sleep when idle
        }
    }

    updatePerformanceMetrics(processingTime) {
        const perf = this.state.performance;
        
        // Update average processing time
        perf.avgTickTime = (perf.avgTickTime * 0.9) + (processingTime * 0.1);
        
        // Update cache hit rate
        perf.cacheHitRate = this.cache.getHitRate();
        
        // Update active player count periodically
        if (this.state.currentTick % 60 === 0) { // Every minute
            this.updateActivePlayerCount();
        }
    }

    async autoSave() {
        try {
            console.log('Auto-saving game state...');
            
            // Save critical state
            await this.saveGameState();
            
            // Create snapshot if needed
            if (this.state.currentTick % (this.config.snapshotInterval / this.config.dayTickRate) === 0) {
                await this.createSnapshot();
            }
            
            console.log('Auto-save completed');
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }

    async initializeGalaxyRegions() {
        // Create galaxy regions for sharding
        const regions = [
            { id: 'core-worlds', name: 'Core Worlds', capacity: 2500 },
            { id: 'mid-rim', name: 'Mid Rim', capacity: 2500 },
            { id: 'outer-rim', name: 'Outer Rim', capacity: 2500 },
            { id: 'unknown-regions', name: 'Unknown Regions', capacity: 2500 }
        ];
        
        for (const region of regions) {
            this.galaxyRegions.set(region.id, {
                ...region,
                playerCount: 0,
                civilizationCount: 0,
                aiProcessingLoad: 0
            });
        }
        
        console.log(`Initialized ${regions.length} galaxy regions`);
    }

    generatePlayerId() {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    getGameState() {
        return {
            currentGameDay: this.state.currentGameDay,
            currentQuarter: this.state.currentQuarter,
            totalPlayers: this.players.size,
            activePlayers: this.state.performance.activePlayerCount,
            performance: this.state.performance,
            uptime: Date.now() - this.state.gameStartTime
        };
    }

    getPlayerGameState(playerId) {
        const player = this.players.get(playerId);
        if (!player) return null;
        
        return {
            player,
            gameState: this.getGameState(),
            regionState: this.galaxyRegions.get(player.regionId)
        };
    }
}

// Supporting Classes

class IntelligentBatcher {
    constructor(config) {
        this.config = config;
        this.batches = new Map();
    }
    
    addAction(action) {
        const batchKey = this.getBatchKey(action);
        
        if (!this.batches.has(batchKey)) {
            this.batches.set(batchKey, {
                actions: [],
                deadline: Date.now() + this.getDeadline(action.priority)
            });
        }
        
        this.batches.get(batchKey).actions.push(action);
    }
    
    getBatchKey(action) {
        return `${action.type}_${action.priority}_${action.regionId || 'global'}`;
    }
    
    getDeadline(priority) {
        const deadlines = {
            critical: 100,
            high: 1000,
            medium: 10000,
            low: 60000,
            batch: 90000
        };
        return deadlines[priority] || deadlines.medium;
    }
}

class AdaptiveAIProcessor {
    constructor(config) {
        this.config = config;
        this.budgets = {
            tier1: config.aiProcessingBudget.tier1CallsPerQuarter,
            tier2: config.aiProcessingBudget.tier2CallsPerQuarter,
            tier3: config.aiProcessingBudget.tier3CallsPerQuarter
        };
        this.remainingBudgets = { ...this.budgets };
    }
    
    async initialize() {
        console.log('AI Processor initialized with budgets:', this.budgets);
    }
    
    getRemainingBudget(tier) {
        return this.remainingBudgets[tier] || 0;
    }
    
    resetQuarterlyBudgets() {
        this.remainingBudgets = { ...this.budgets };
        console.log('AI processing budgets reset for new quarter');
    }
    
    async processDecision(action, tier) {
        if (this.remainingBudgets[tier] > 0) {
            this.remainingBudgets[tier]--;
            // Process with AI
            return this.processAIDecision(action, tier);
        } else {
            // Fallback to rule-based
            return this.processRuleBasedDecision(action);
        }
    }
    
    async processAIDecision(action, tier) {
        // Simulate AI processing with different complexities
        const complexity = { tier1: 0.9, tier2: 0.6, tier3: 0.3 }[tier];
        
        // Simulate processing time based on complexity
        await new Promise(resolve => setTimeout(resolve, complexity * 100));
        
        return {
            decision: `AI decision (${tier})`,
            confidence: complexity,
            method: 'ai'
        };
    }
    
    async processRuleBasedDecision(action) {
        // Fast rule-based processing
        return {
            decision: 'Rule-based decision',
            confidence: 0.5,
            method: 'rules'
        };
    }
}

class PredictiveCache {
    constructor(maxSize) {
        this.cache = new Map();
        this.accessCounts = new Map();
        this.maxSize = maxSize;
        this.hits = 0;
        this.misses = 0;
    }
    
    get(key) {
        if (this.cache.has(key)) {
            this.hits++;
            this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1);
            return this.cache.get(key);
        } else {
            this.misses++;
            return null;
        }
    }
    
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            this.evictLeastUsed();
        }
        
        this.cache.set(key, value);
        this.accessCounts.set(key, 1);
    }
    
    evictLeastUsed() {
        let leastUsedKey = null;
        let minCount = Infinity;
        
        for (const [key, count] of this.accessCounts) {
            if (count < minCount) {
                minCount = count;
                leastUsedKey = key;
            }
        }
        
        if (leastUsedKey) {
            this.cache.delete(leastUsedKey);
            this.accessCounts.delete(leastUsedKey);
        }
    }
    
    getHitRate() {
        const total = this.hits + this.misses;
        return total > 0 ? this.hits / total : 0;
    }
}

class PerformanceMonitor {
    constructor(engine) {
        this.engine = engine;
        this.metrics = new Map();
    }
    
    start() {
        setInterval(() => {
            this.collectMetrics();
        }, 60000); // Every minute
    }
    
    collectMetrics() {
        const state = this.engine.state;
        const performance = state.performance;
        
        console.log(`Performance: ${performance.avgTickTime.toFixed(2)}ms avg tick, ${performance.activePlayerCount} active players, ${(performance.cacheHitRate * 100).toFixed(1)}% cache hit rate`);
        
        // Emit performance metrics
        this.engine.emit('performanceMetrics', performance);
    }
}

module.exports = { ScalableSimulationEngine };

