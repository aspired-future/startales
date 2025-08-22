// Business AI - Manages small and corporate business behavior, market dynamics, and economic decisions
// Integrates with Enhanced Knob APIs for dynamic business strategy adjustment

const EventEmitter = require('events');

class BusinessAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            processingInterval: config.processingInterval || 45000, // 45 seconds
            maxBusinessesPerTick: config.maxBusinessesPerTick || 50,
            decisionComplexity: config.decisionComplexity || 'high',
            
            // Business Behavior Parameters
            marketSensitivity: config.marketSensitivity || 0.8,
            riskTolerance: config.riskTolerance || 0.6,
            innovationDrive: config.innovationDrive || 0.7,
            
            ...config
        };
        
        this.smallBusinesses = new Map(); // businessId -> small business data
        this.corporations = new Map(); // corpId -> corporate data
        this.marketConditions = new Map(); // sector -> market data
        this.businessNetworks = new Map(); // networkId -> business relationships
        
        this.isProcessing = false;
        this.lastUpdate = Date.now();
        
        // Enhanced Knob Integration
        this.knobEndpoints = {
            businesses: '/api/businesses/knobs',
            smallBusiness: '/api/small-business/knobs',
            economicEcosystem: '/api/economic-ecosystem/knobs',
            economicTiers: '/api/economic-tiers/knobs',
            treasury: '/api/treasury/knobs'
        };
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processBusinessDecisions(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('🏢 Processing Business AI decisions...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Update market conditions
            await this.updateMarketConditions(gameState, knobSettings);
            
            // Process small business decisions
            const smallBusinessDecisions = await this.processSmallBusinesses(knobSettings);
            
            // Process corporate decisions
            const corporateDecisions = await this.processCorporations(knobSettings);
            
            // Apply all business decisions
            const effects = await this.applyBusinessDecisions([...smallBusinessDecisions, ...corporateDecisions], knobSettings);
            
            // Update business networks
            await this.updateBusinessNetworks(effects);
            
            this.emit('business-decisions', {
                timestamp: Date.now(),
                smallBusinessDecisions: smallBusinessDecisions.length,
                corporateDecisions: corporateDecisions.length,
                effects,
                totalBusinesses: this.smallBusinesses.size + this.corporations.size
            });
            
            console.log(`✅ Processed ${smallBusinessDecisions.length + corporateDecisions.length} business decisions`);
            
        } catch (error) {
            console.error('❌ Business AI processing error:', error);
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
            for (const [system, endpoint] of Object.entries(this.knobEndpoints)) {
                const response = await fetch(`http://localhost:4000${endpoint}`);
                if (response.ok) {
                    const data = await response.json();
                    settings[system] = data.knobs;
                }
            }
            
            return settings;
        } catch (error) {
            console.error('Error fetching business knob settings:', error);
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
    
    // ===== MARKET CONDITIONS =====
    
    async updateMarketConditions(gameState, knobSettings) {
        const businesses = knobSettings.businesses || {};
        const economicEcosystem = knobSettings.economicEcosystem || {};
        
        // Update market conditions based on knob settings
        const sectors = ['technology', 'manufacturing', 'services', 'retail', 'healthcare', 'finance'];
        
        for (const sector of sectors) {
            const marketCondition = {
                sector,
                competitionLevel: businesses.market_competition_level || 0.5,
                growthRate: economicEcosystem.market_growth_rate || 0.5,
                regulatoryEnvironment: businesses.regulatory_compliance_burden || 0.5,
                innovationIndex: economicEcosystem.innovation_ecosystem_strength || 0.5,
                consumerDemand: businesses.consumer_demand_strength || 0.5,
                lastUpdated: Date.now()
            };
            
            this.marketConditions.set(sector, marketCondition);
        }
    }
    
    // ===== SMALL BUSINESS PROCESSING =====
    
    async processSmallBusinesses(knobSettings) {
        const decisions = [];
        const smallBusinessList = Array.from(this.smallBusinesses.values());
        const smallBusiness = knobSettings.smallBusiness || {};
        
        for (const business of smallBusinessList.slice(0, this.config.maxBusinessesPerTick)) {
            try {
                // Growth and expansion decisions
                const growthDecision = await this.generateSmallBusinessGrowthDecision(business, smallBusiness);
                if (growthDecision) decisions.push(growthDecision);
                
                // Innovation and technology adoption
                const innovationDecision = await this.generateInnovationDecision(business, smallBusiness);
                if (innovationDecision) decisions.push(innovationDecision);
                
                // Community engagement
                const communityDecision = await this.generateCommunityEngagementDecision(business, smallBusiness);
                if (communityDecision) decisions.push(communityDecision);
                
                // Financial management
                const financialDecision = await this.generateFinancialDecision(business, smallBusiness);
                if (financialDecision) decisions.push(financialDecision);
                
            } catch (error) {
                console.error(`Error processing small business ${business.id}:`, error);
            }
        }
        
        return decisions;
    }
    
    async generateSmallBusinessGrowthDecision(business, knobSettings) {
        const businessFormationSupport = knobSettings.business_formation_support || 0.5;
        const marketAccessSupport = knobSettings.market_access_support || 0.5;
        const economicDevelopment = knobSettings.economic_development_focus || 0.5;
        
        // Growth decision based on business performance and market support
        const growthPotential = (business.revenue / business.costs) * businessFormationSupport;
        
        if (growthPotential > 1.2 && marketAccessSupport > 0.6) {
            return {
                type: 'small_business_growth',
                businessId: business.id,
                action: 'expand_operations',
                reasoning: 'Strong revenue and market support favor expansion',
                knobInfluence: { businessFormationSupport, marketAccessSupport, economicDevelopment },
                effects: {
                    smallBusiness: { business_growth_rate: '+2' },
                    economicTiers: { tier_progression_speed: '+1' },
                    businesses: { employment_creation: 'high' }
                }
            };
        }
        
        return null;
    }
    
    async generateInnovationDecision(business, knobSettings) {
        const technologyAdoption = knobSettings.technology_adoption_support || 0.5;
        const innovationIncentives = knobSettings.innovation_incentives || 0.5;
        const digitalTransformation = knobSettings.digital_transformation_support || 0.5;
        
        // Innovation investment based on technology support and business capacity
        if (business.techLevel < 0.7 && technologyAdoption > 0.6 && business.cashFlow > 0) {
            return {
                type: 'innovation',
                businessId: business.id,
                action: 'invest_in_technology',
                reasoning: 'Strong technology support and positive cash flow enable innovation',
                knobInfluence: { technologyAdoption, innovationIncentives, digitalTransformation },
                effects: {
                    smallBusiness: { technology_adoption: '+2' },
                    economicEcosystem: { innovation_ecosystem_strength: '+1' },
                    businesses: { productivity_growth: 'high' }
                }
            };
        }
        
        return null;
    }
    
    async generateCommunityEngagementDecision(business, knobSettings) {
        const communityIntegration = knobSettings.community_integration_support || 0.5;
        const localEconomicImpact = knobSettings.local_economic_impact_focus || 0.5;
        
        // Community engagement based on local support and business stability
        if (business.stability > 0.6 && communityIntegration > 0.7) {
            return {
                type: 'community_engagement',
                businessId: business.id,
                action: 'sponsor_local_events',
                reasoning: 'Stable business and strong community support encourage engagement',
                knobInfluence: { communityIntegration, localEconomicImpact },
                effects: {
                    smallBusiness: { community_engagement: '+2' },
                    businesses: { local_business_support: '+1' }
                }
            };
        }
        
        return null;
    }
    
    async generateFinancialDecision(business, knobSettings) {
        const financialSupport = knobSettings.financial_support_access || 0.5;
        const creditAccess = knobSettings.credit_access_improvement || 0.5;
        
        // Financial management decisions based on support availability
        if (business.debtRatio > 0.7 && financialSupport > 0.6) {
            return {
                type: 'financial_management',
                businessId: business.id,
                action: 'restructure_debt',
                reasoning: 'High debt ratio and available financial support enable restructuring',
                knobInfluence: { financialSupport, creditAccess },
                effects: {
                    smallBusiness: { financial_stability: '+1' },
                    treasury: { small_business_support: '+1' }
                }
            };
        }
        
        return null;
    }
    
    // ===== CORPORATE PROCESSING =====
    
    async processCorporations(knobSettings) {
        const decisions = [];
        const corporationList = Array.from(this.corporations.values());
        const economicEcosystem = knobSettings.economicEcosystem || {};
        
        for (const corp of corporationList.slice(0, Math.floor(this.config.maxBusinessesPerTick / 2))) {
            try {
                // Strategic expansion decisions
                const expansionDecision = await this.generateCorporateExpansionDecision(corp, economicEcosystem);
                if (expansionDecision) decisions.push(expansionDecision);
                
                // Merger and acquisition decisions
                const maDecision = await this.generateMergerAcquisitionDecision(corp, economicEcosystem);
                if (maDecision) decisions.push(maDecision);
                
                // R&D investment decisions
                const rdDecision = await this.generateRDInvestmentDecision(corp, economicEcosystem);
                if (rdDecision) decisions.push(rdDecision);
                
                // Market positioning decisions
                const positioningDecision = await this.generateMarketPositioningDecision(corp, economicEcosystem);
                if (positioningDecision) decisions.push(positioningDecision);
                
            } catch (error) {
                console.error(`Error processing corporation ${corp.id}:`, error);
            }
        }
        
        return decisions;
    }
    
    async generateCorporateExpansionDecision(corp, knobSettings) {
        const marketExpansion = knobSettings.market_expansion_support || 0.5;
        const internationalTrade = knobSettings.international_trade_facilitation || 0.5;
        const corporateGrowth = knobSettings.corporate_growth_incentives || 0.5;
        
        // Expansion decision based on corporate strength and market conditions
        if (corp.marketShare > 0.1 && corp.profitMargin > 0.15 && marketExpansion > 0.7) {
            return {
                type: 'corporate_expansion',
                corporationId: corp.id,
                action: 'expand_to_new_markets',
                reasoning: 'Strong market position and expansion support favor growth',
                knobInfluence: { marketExpansion, internationalTrade, corporateGrowth },
                effects: {
                    economicEcosystem: { market_expansion: '+2' },
                    economicTiers: { tier_advancement: '+1' },
                    businesses: { market_competition_level: '+1' }
                }
            };
        }
        
        return null;
    }
    
    async generateMergerAcquisitionDecision(corp, knobSettings) {
        const corporateGovernance = knobSettings.corporate_governance_standards || 0.5;
        const marketConcentration = knobSettings.market_concentration_control || 0.5;
        
        // M&A decisions based on strategic fit and regulatory environment
        if (corp.acquisitionCapacity > 0.5 && corporateGovernance > 0.6 && marketConcentration < 0.7) {
            return {
                type: 'merger_acquisition',
                corporationId: corp.id,
                action: 'acquire_competitor',
                reasoning: 'Strong acquisition capacity and favorable regulatory environment',
                knobInfluence: { corporateGovernance, marketConcentration },
                effects: {
                    economicEcosystem: { market_consolidation: '+1' },
                    businesses: { market_competition_level: '-1' }
                }
            };
        }
        
        return null;
    }
    
    async generateRDInvestmentDecision(corp, knobSettings) {
        const innovationEcosystem = knobSettings.innovation_ecosystem_strength || 0.5;
        const technologyDevelopment = knobSettings.technology_development_support || 0.5;
        
        // R&D investment based on innovation environment and corporate resources
        if (corp.rdBudget > corp.revenue * 0.05 && innovationEcosystem > 0.7) {
            return {
                type: 'rd_investment',
                corporationId: corp.id,
                action: 'increase_rd_spending',
                reasoning: 'Strong innovation ecosystem and adequate R&D budget',
                knobInfluence: { innovationEcosystem, technologyDevelopment },
                effects: {
                    economicEcosystem: { innovation_ecosystem_strength: '+2' },
                    businesses: { innovation_rate: '+1' }
                }
            };
        }
        
        return null;
    }
    
    async generateMarketPositioningDecision(corp, knobSettings) {
        const competitiveAdvantage = knobSettings.competitive_advantage_development || 0.5;
        const brandDevelopment = knobSettings.brand_development_support || 0.5;
        
        // Market positioning based on competitive environment
        if (corp.brandStrength < 0.8 && competitiveAdvantage > 0.6) {
            return {
                type: 'market_positioning',
                corporationId: corp.id,
                action: 'strengthen_brand_position',
                reasoning: 'Opportunity to improve brand strength in competitive market',
                knobInfluence: { competitiveAdvantage, brandDevelopment },
                effects: {
                    economicEcosystem: { brand_value_creation: '+1' },
                    businesses: { market_differentiation: '+1' }
                }
            };
        }
        
        return null;
    }
    
    // ===== DECISION APPLICATION =====
    
    async applyBusinessDecisions(decisions, knobSettings) {
        const effects = {
            systemUpdates: {},
            businessChanges: 0,
            marketImpacts: [],
            economicEffects: []
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
                
                // Update business state
                if (decision.type.includes('small_business')) {
                    const business = this.smallBusinesses.get(decision.businessId);
                    if (business) {
                        this.updateSmallBusinessState(business, decision);
                        effects.businessChanges++;
                    }
                } else if (decision.type.includes('corporate') || decision.type.includes('merger') || decision.type.includes('rd')) {
                    const corp = this.corporations.get(decision.corporationId);
                    if (corp) {
                        this.updateCorporateState(corp, decision);
                        effects.businessChanges++;
                    }
                }
                
                // Track market impacts
                effects.marketImpacts.push({
                    type: decision.type,
                    action: decision.action,
                    impact: decision.reasoning
                });
                
            } catch (error) {
                console.error(`Error applying business decision ${decision.type}:`, error);
            }
        }
        
        return effects;
    }
    
    updateSmallBusinessState(business, decision) {
        switch (decision.action) {
            case 'expand_operations':
                business.size *= 1.3;
                business.revenue *= 1.2;
                business.costs *= 1.15;
                break;
            case 'invest_in_technology':
                business.techLevel += 0.2;
                business.productivity += 0.15;
                business.costs *= 1.1;
                break;
            case 'sponsor_local_events':
                business.communityReputation += 0.2;
                business.localMarketShare += 0.05;
                break;
            case 'restructure_debt':
                business.debtRatio *= 0.8;
                business.stability += 0.1;
                break;
        }
        
        business.lastDecision = {
            timestamp: Date.now(),
            action: decision.action,
            reasoning: decision.reasoning
        };
    }
    
    updateCorporateState(corp, decision) {
        switch (decision.action) {
            case 'expand_to_new_markets':
                corp.marketShare += 0.05;
                corp.revenue *= 1.25;
                corp.operationalComplexity += 0.1;
                break;
            case 'acquire_competitor':
                corp.marketShare += 0.1;
                corp.assets *= 1.4;
                corp.acquisitionCapacity -= 0.2;
                break;
            case 'increase_rd_spending':
                corp.rdBudget *= 1.3;
                corp.innovationIndex += 0.15;
                corp.profitMargin -= 0.02;
                break;
            case 'strengthen_brand_position':
                corp.brandStrength += 0.2;
                corp.marketingSpend *= 1.2;
                corp.customerLoyalty += 0.1;
                break;
        }
        
        corp.lastDecision = {
            timestamp: Date.now(),
            action: decision.action,
            reasoning: decision.reasoning
        };
    }
    
    // ===== BUSINESS NETWORK MANAGEMENT =====
    
    async updateBusinessNetworks(effects) {
        // Update business relationships based on decisions
        for (const impact of effects.marketImpacts) {
            const networkId = this.generateBusinessNetworkId(impact);
            let network = this.businessNetworks.get(networkId);
            
            if (!network) {
                network = {
                    id: networkId,
                    type: impact.type,
                    participants: new Set(),
                    strength: 0.1,
                    transactions: [],
                    collaborations: []
                };
                this.businessNetworks.set(networkId, network);
            }
            
            network.strength += 0.1;
            network.transactions.push({
                timestamp: Date.now(),
                type: impact.action,
                impact: impact.impact
            });
        }
    }
    
    generateBusinessNetworkId(impact) {
        return `biz_network_${impact.type}_${Math.floor(Date.now() / 86400000)}`;
    }
    
    // ===== BUSINESS MANAGEMENT =====
    
    addSmallBusiness(businessData) {
        const business = {
            id: businessData.id || `small_biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: businessData.name || 'Small Business',
            sector: businessData.sector || 'services',
            size: businessData.size || 5,
            revenue: businessData.revenue || 100000,
            costs: businessData.costs || 80000,
            techLevel: businessData.techLevel || 0.3,
            productivity: businessData.productivity || 0.5,
            stability: businessData.stability || 0.6,
            debtRatio: businessData.debtRatio || 0.4,
            cashFlow: businessData.cashFlow || 20000,
            communityReputation: businessData.communityReputation || 0.5,
            localMarketShare: businessData.localMarketShare || 0.02,
            created: Date.now(),
            lastDecision: null
        };
        
        this.smallBusinesses.set(business.id, business);
        return business;
    }
    
    addCorporation(corpData) {
        const corp = {
            id: corpData.id || `corp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: corpData.name || 'Corporation',
            sector: corpData.sector || 'technology',
            marketShare: corpData.marketShare || 0.05,
            revenue: corpData.revenue || 10000000,
            assets: corpData.assets || 50000000,
            profitMargin: corpData.profitMargin || 0.12,
            rdBudget: corpData.rdBudget || 500000,
            acquisitionCapacity: corpData.acquisitionCapacity || 0.7,
            brandStrength: corpData.brandStrength || 0.6,
            innovationIndex: corpData.innovationIndex || 0.5,
            operationalComplexity: corpData.operationalComplexity || 0.4,
            marketingSpend: corpData.marketingSpend || 1000000,
            customerLoyalty: corpData.customerLoyalty || 0.5,
            created: Date.now(),
            lastDecision: null
        };
        
        this.corporations.set(corp.id, corp);
        return corp;
    }
    
    // ===== ANALYTICS & REPORTING =====
    
    getBusinessAnalytics() {
        const smallBusinesses = Array.from(this.smallBusinesses.values());
        const corporations = Array.from(this.corporations.values());
        
        return {
            smallBusinesses: {
                total: smallBusinesses.length,
                averageRevenue: smallBusinesses.reduce((sum, b) => sum + b.revenue, 0) / smallBusinesses.length,
                averageTechLevel: smallBusinesses.reduce((sum, b) => sum + b.techLevel, 0) / smallBusinesses.length,
                averageStability: smallBusinesses.reduce((sum, b) => sum + b.stability, 0) / smallBusinesses.length
            },
            corporations: {
                total: corporations.length,
                totalMarketShare: corporations.reduce((sum, c) => sum + c.marketShare, 0),
                averageRDSpending: corporations.reduce((sum, c) => sum + c.rdBudget, 0) / corporations.length,
                averageBrandStrength: corporations.reduce((sum, c) => sum + c.brandStrength, 0) / corporations.length
            },
            marketConditions: this.marketConditions.size,
            businessNetworks: this.businessNetworks.size
        };
    }
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    start() {
        console.log('🏢 Starting Business AI system...');
        this.emit('started');
    }
    
    stop() {
        console.log('🏢 Stopping Business AI system...');
        this.emit('stopped');
    }
    
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            lastUpdate: this.lastUpdate,
            smallBusinesses: this.smallBusinesses.size,
            corporations: this.corporations.size,
            marketConditions: this.marketConditions.size,
            businessNetworks: this.businessNetworks.size,
            config: this.config
        };
    }
}

module.exports = { BusinessAI };
