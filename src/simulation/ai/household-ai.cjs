// Household AI - Manages individual family units, consumer behavior, and local community dynamics
// Integrates with Enhanced Knob APIs for dynamic behavior adjustment

const EventEmitter = require('events');

class HouseholdAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            processingInterval: config.processingInterval || 30000, // 30 seconds
            maxHouseholdsPerTick: config.maxHouseholdsPerTick || 100,
            decisionComplexity: config.decisionComplexity || 'medium',
            
            // Household Behavior Parameters
            economicSensitivity: config.economicSensitivity || 0.7,
            socialInfluence: config.socialInfluence || 0.6,
            educationPriority: config.educationPriority || 0.8,
            
            ...config
        };
        
        this.households = new Map(); // householdId -> household data
        this.communityNetworks = new Map(); // networkId -> community connections
        this.marketBehavior = new Map(); // householdId -> consumption patterns
        
        this.isProcessing = false;
        this.lastUpdate = Date.now();
        
        // Enhanced Knob Integration
        this.knobEndpoints = {
            demographics: '/api/demographics/knobs',
            education: '/api/education/knobs',
            businesses: '/api/businesses/knobs',
            health: '/api/health/knobs'
        };
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processHouseholds(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('🏠 Processing Household AI decisions...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Process household decisions
            const decisions = await this.generateHouseholdDecisions(gameState, knobSettings);
            
            // Apply decisions to game state
            const effects = await this.applyHouseholdDecisions(decisions, knobSettings);
            
            // Update community networks
            await this.updateCommunityNetworks(effects);
            
            this.emit('household-decisions', {
                timestamp: Date.now(),
                decisions: decisions.length,
                effects,
                households: this.households.size
            });
            
            console.log(`✅ Processed ${decisions.length} household decisions`);
            
        } catch (error) {
            console.error('❌ Household AI processing error:', error);
            this.emit('error', error);
        } finally {
            this.isProcessing = false;
            this.lastUpdate = Date.now();
        }
    }
    
    // ===== ENHANCED KNOB INTEGRATION =====
    
    async getEnhancedKnobSettings() {
        const settings = {};
        
        try {
            // Fetch knob settings from all relevant APIs
            for (const [system, endpoint] of Object.entries(this.knobEndpoints)) {
                const response = await fetch(`http://localhost:4000${endpoint}`);
                if (response.ok) {
                    const data = await response.json();
                    settings[system] = data.knobs;
                }
            }
            
            return settings;
        } catch (error) {
            console.error('Error fetching knob settings:', error);
            return {};
        }
    }
    
    async updateSystemKnobs(system, knobUpdates) {
        try {
            const endpoint = this.knobEndpoints[system];
            if (!endpoint) return false;
            
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ knobs: knobUpdates })
            });
            
            return response.ok;
        } catch (error) {
            console.error(`Error updating ${system} knobs:`, error);
            return false;
        }
    }
    
    // ===== HOUSEHOLD DECISION GENERATION =====
    
    async generateHouseholdDecisions(gameState, knobSettings) {
        const decisions = [];
        const householdList = Array.from(this.households.values());
        
        for (const household of householdList.slice(0, this.config.maxHouseholdsPerTick)) {
            try {
                // Housing Decisions
                const housingDecision = await this.generateHousingDecision(household, knobSettings);
                if (housingDecision) decisions.push(housingDecision);
                
                // Education Decisions
                const educationDecision = await this.generateEducationDecision(household, knobSettings);
                if (educationDecision) decisions.push(educationDecision);
                
                // Consumer Behavior
                const consumerDecision = await this.generateConsumerDecision(household, knobSettings);
                if (consumerDecision) decisions.push(consumerDecision);
                
                // Community Participation
                const communityDecision = await this.generateCommunityDecision(household, knobSettings);
                if (communityDecision) decisions.push(communityDecision);
                
            } catch (error) {
                console.error(`Error generating decisions for household ${household.id}:`, error);
            }
        }
        
        return decisions;
    }
    
    async generateHousingDecision(household, knobSettings) {
        const demographics = knobSettings.demographics || {};
        
        // Use Enhanced Knob values to influence housing decisions
        const housingAffordability = demographics.housing_affordability || 0.5;
        const urbanizationTrend = demographics.urbanization_trend || 0.5;
        const populationGrowth = demographics.population_growth_rate || 0.5;
        
        // AI decision logic with knob influence
        if (household.income > household.housingCost * 3 && urbanizationTrend > 0.7) {
            return {
                type: 'housing',
                householdId: household.id,
                action: 'upgrade_housing',
                reasoning: 'High income and urbanization trend favor housing upgrade',
                knobInfluence: { housingAffordability, urbanizationTrend },
                effects: {
                    demographics: { housing_quality: '+1' },
                    businesses: { construction_demand: 'high' }
                }
            };
        }
        
        return null;
    }
    
    async generateEducationDecision(household, knobSettings) {
        const education = knobSettings.education || {};
        
        const educationQuality = education.education_system_quality || 0.5;
        const accessibilityLevel = education.accessibility_level || 0.5;
        const technologyIntegration = education.technology_integration || 0.5;
        
        // Education investment decisions based on knobs
        if (household.children > 0 && educationQuality > 0.6) {
            return {
                type: 'education',
                householdId: household.id,
                action: 'invest_in_education',
                reasoning: 'High education quality encourages investment',
                knobInfluence: { educationQuality, accessibilityLevel, technologyIntegration },
                effects: {
                    education: { enrollment_rate: '+1' },
                    demographics: { education_level: 'increase' }
                }
            };
        }
        
        return null;
    }
    
    async generateConsumerDecision(household, knobSettings) {
        const businesses = knobSettings.businesses || {};
        
        const marketCompetition = businesses.market_competition_level || 0.5;
        const consumerProtection = businesses.consumer_protection_strength || 0.5;
        const localBusinessSupport = businesses.local_business_support || 0.5;
        
        // Consumer spending patterns influenced by business environment
        const spendingPower = household.income * (1 + (marketCompetition - 0.5));
        
        if (spendingPower > household.baseSpending && localBusinessSupport > 0.6) {
            return {
                type: 'consumer',
                householdId: household.id,
                action: 'increase_local_spending',
                reasoning: 'Strong local business environment encourages spending',
                knobInfluence: { marketCompetition, consumerProtection, localBusinessSupport },
                effects: {
                    businesses: { local_revenue: '+2' },
                    demographics: { consumer_confidence: 'high' }
                }
            };
        }
        
        return null;
    }
    
    async generateCommunityDecision(household, knobSettings) {
        const health = knobSettings.health || {};
        
        const communityHealthPrograms = health.community_health_programs || 0.5;
        const publicHealthInfrastructure = health.public_health_infrastructure || 0.5;
        
        // Community participation based on health and social factors
        if (communityHealthPrograms > 0.7 && household.socialEngagement > 0.5) {
            return {
                type: 'community',
                householdId: household.id,
                action: 'join_health_initiative',
                reasoning: 'Strong community health programs encourage participation',
                knobInfluence: { communityHealthPrograms, publicHealthInfrastructure },
                effects: {
                    health: { community_engagement: '+1' },
                    demographics: { social_cohesion: 'increase' }
                }
            };
        }
        
        return null;
    }
    
    // ===== DECISION APPLICATION =====
    
    async applyHouseholdDecisions(decisions, knobSettings) {
        const effects = {
            systemUpdates: {},
            householdChanges: 0,
            communityImpacts: []
        };
        
        for (const decision of decisions) {
            try {
                // Apply effects to relevant systems via Enhanced Knobs
                for (const [system, knobUpdates] of Object.entries(decision.effects)) {
                    if (this.knobEndpoints[system]) {
                        await this.updateSystemKnobs(system, knobUpdates);
                        effects.systemUpdates[system] = knobUpdates;
                    }
                }
                
                // Update household state
                const household = this.households.get(decision.householdId);
                if (household) {
                    this.updateHouseholdState(household, decision);
                    effects.householdChanges++;
                }
                
                // Track community impacts
                if (decision.type === 'community') {
                    effects.communityImpacts.push({
                        action: decision.action,
                        impact: decision.reasoning
                    });
                }
                
            } catch (error) {
                console.error(`Error applying decision ${decision.type}:`, error);
            }
        }
        
        return effects;
    }
    
    updateHouseholdState(household, decision) {
        switch (decision.action) {
            case 'upgrade_housing':
                household.housingQuality += 0.1;
                household.housingCost *= 1.2;
                break;
            case 'invest_in_education':
                household.educationSpending += household.income * 0.05;
                break;
            case 'increase_local_spending':
                household.localSpending += household.income * 0.1;
                break;
            case 'join_health_initiative':
                household.socialEngagement += 0.1;
                household.healthAwareness += 0.1;
                break;
        }
        
        household.lastDecision = {
            timestamp: Date.now(),
            action: decision.action,
            reasoning: decision.reasoning
        };
    }
    
    // ===== COMMUNITY NETWORK MANAGEMENT =====
    
    async updateCommunityNetworks(effects) {
        // Update social networks based on household decisions
        for (const impact of effects.communityImpacts) {
            const networkId = this.generateNetworkId(impact);
            let network = this.communityNetworks.get(networkId);
            
            if (!network) {
                network = {
                    id: networkId,
                    type: impact.action,
                    members: new Set(),
                    strength: 0.1,
                    activities: []
                };
                this.communityNetworks.set(networkId, network);
            }
            
            network.strength += 0.05;
            network.activities.push({
                timestamp: Date.now(),
                impact: impact.impact
            });
        }
    }
    
    generateNetworkId(impact) {
        return `network_${impact.action}_${Math.floor(Date.now() / 86400000)}`;
    }
    
    // ===== HOUSEHOLD MANAGEMENT =====
    
    addHousehold(householdData) {
        const household = {
            id: householdData.id || `household_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            size: householdData.size || 2,
            income: householdData.income || 50000,
            children: householdData.children || 0,
            adults: householdData.adults || 2,
            housingCost: householdData.housingCost || 15000,
            housingQuality: householdData.housingQuality || 0.5,
            educationSpending: householdData.educationSpending || 5000,
            localSpending: householdData.localSpending || 20000,
            socialEngagement: householdData.socialEngagement || 0.5,
            healthAwareness: householdData.healthAwareness || 0.5,
            baseSpending: householdData.baseSpending || 30000,
            location: householdData.location || 'urban',
            created: Date.now(),
            lastDecision: null
        };
        
        this.households.set(household.id, household);
        return household;
    }
    
    removeHousehold(householdId) {
        return this.households.delete(householdId);
    }
    
    getHousehold(householdId) {
        return this.households.get(householdId);
    }
    
    // ===== ANALYTICS & REPORTING =====
    
    getHouseholdAnalytics() {
        const households = Array.from(this.households.values());
        
        return {
            totalHouseholds: households.length,
            averageIncome: households.reduce((sum, h) => sum + h.income, 0) / households.length,
            averageHousingQuality: households.reduce((sum, h) => sum + h.housingQuality, 0) / households.length,
            averageSocialEngagement: households.reduce((sum, h) => sum + h.socialEngagement, 0) / households.length,
            communityNetworks: this.communityNetworks.size,
            recentDecisions: households.filter(h => h.lastDecision && Date.now() - h.lastDecision.timestamp < 300000).length
        };
    }
    
    getCommunityNetworkAnalytics() {
        const networks = Array.from(this.communityNetworks.values());
        
        return {
            totalNetworks: networks.length,
            networkTypes: [...new Set(networks.map(n => n.type))],
            averageNetworkStrength: networks.reduce((sum, n) => sum + n.strength, 0) / networks.length,
            totalActivities: networks.reduce((sum, n) => sum + n.activities.length, 0),
            strongestNetworks: networks.sort((a, b) => b.strength - a.strength).slice(0, 5)
        };
    }
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    start() {
        console.log('🏠 Starting Household AI system...');
        this.emit('started');
    }
    
    stop() {
        console.log('🏠 Stopping Household AI system...');
        this.emit('stopped');
    }
    
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            lastUpdate: this.lastUpdate,
            households: this.households.size,
            communityNetworks: this.communityNetworks.size,
            config: this.config
        };
    }
}

module.exports = { HouseholdAI };
