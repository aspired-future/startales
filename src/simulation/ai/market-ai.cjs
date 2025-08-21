// Market AI - Inter-civ trade dynamics, price discovery, and market sentiment
// Provides shared market intelligence for cross-civilization economic interactions

const EventEmitter = require('events');

class MarketAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'market-ai';
        this.gameId = config.gameId || 'default_game';
        
        // Market state tracking all civilizations
        this.marketState = {
            // Market Structure
            activeMarkets: new Map(),
            tradingPairs: new Map(),
            marketMakers: new Map(),
            
            // Price Discovery
            priceHistory: new Map(),
            volatilityIndex: new Map(),
            marketSentiment: new Map(),
            
            // Trading Activity
            tradeVolumes: new Map(),
            liquidityLevels: new Map(),
            orderBooks: new Map(),
            
            // Market Participants
            civilizationProfiles: new Map(),
            tradingBehavior: new Map(),
            marketShare: new Map(),
            
            // Economic Indicators
            marketIndices: new Map(),
            sectorPerformance: new Map(),
            commodityPrices: new Map(),
            
            // Market Dynamics
            supplyDemandBalance: new Map(),
            arbitrageOpportunities: [],
            marketInefficiencies: [],
            
            // Risk Assessment
            marketRisks: new Map(),
            correlationMatrix: new Map(),
            systemicRisks: [],
            
            // Regulatory Environment
            tradingRules: new Map(),
            marketRegulation: new Map(),
            complianceStatus: new Map(),
            
            lastUpdate: Date.now()
        };
        
        // Market analysis parameters
        this.analysisConfig = {
            priceUpdateFrequency: config.priceUpdateFrequency || 0.8,
            volatilityThreshold: config.volatilityThreshold || 0.3,
            liquidityThreshold: config.liquidityThreshold || 0.4,
            arbitrageThreshold: config.arbitrageThreshold || 0.05
        };
        
        // Market sectors and their characteristics
        this.marketSectors = {
            'raw_materials': {
                volatility: 0.4,
                liquidity: 0.7,
                strategic_importance: 0.8,
                substitutability: 0.3
            },
            'manufactured_goods': {
                volatility: 0.3,
                liquidity: 0.8,
                strategic_importance: 0.6,
                substitutability: 0.6
            },
            'technology': {
                volatility: 0.6,
                liquidity: 0.5,
                strategic_importance: 0.9,
                substitutability: 0.2
            },
            'energy': {
                volatility: 0.5,
                liquidity: 0.6,
                strategic_importance: 0.95,
                substitutability: 0.4
            },
            'luxury_goods': {
                volatility: 0.7,
                liquidity: 0.4,
                strategic_importance: 0.3,
                substitutability: 0.8
            },
            'services': {
                volatility: 0.2,
                liquidity: 0.9,
                strategic_importance: 0.5,
                substitutability: 0.7
            }
        };
        
        console.log(`🏪 Market AI initialized for game ${this.gameId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update market state from all civilizations
            this.updateMarketState(gameAnalysis);
            
            // Analyze market conditions
            const marketAnalysis = await this.analyzeMarketConditions(gameAnalysis);
            
            // Perform price discovery
            const priceUpdates = await this.performPriceDiscovery(marketAnalysis);
            
            // Assess market sentiment
            const sentimentAnalysis = await this.assessMarketSentiment(marketAnalysis);
            
            // Identify trading opportunities
            const tradingOpportunities = await this.identifyTradingOpportunities(marketAnalysis, priceUpdates);
            
            // Generate market decisions
            const marketDecisions = await this.generateMarketDecisions(marketAnalysis, sentimentAnalysis, tradingOpportunities);
            
            // Update market state from decisions
            this.updateMarketStateFromDecisions(marketDecisions, priceUpdates);
            
            const processingTime = Date.now() - startTime;
            console.log(`🏪 Market AI processed in ${processingTime}ms for ${this.gameId}`);
            
            this.emit('processingComplete', {
                gameId: this.gameId,
                decisions: marketDecisions,
                priceUpdates,
                marketSentiment: sentimentAnalysis,
                processingTime
            });
            
            return {
                decisions: marketDecisions,
                priceUpdates,
                sentiment: sentimentAnalysis,
                opportunities: tradingOpportunities
            };
            
        } catch (error) {
            console.error(`🏪 Market AI processing error for ${this.gameId}:`, error);
            this.emit('processingError', { gameId: this.gameId, error });
            return this.generateFallbackResponse();
        }
    }

    updateMarketState(gameAnalysis) {
        // Update civilization economic profiles
        if (gameAnalysis.civilizations) {
            Object.entries(gameAnalysis.civilizations).forEach(([civId, civData]) => {
                this.marketState.civilizationProfiles.set(civId, {
                    id: civId,
                    economicStrength: civData.economicStrength || 0.6,
                    tradingCapacity: civData.tradingCapacity || 0.5,
                    marketParticipation: civData.marketParticipation || 0.4,
                    riskTolerance: civData.riskTolerance || 0.5,
                    tradingPreferences: civData.tradingPreferences || {},
                    creditRating: civData.creditRating || 0.7,
                    lastUpdate: Date.now()
                });
            });
        }
        
        // Update trade flows
        if (gameAnalysis.tradeFlows) {
            Object.entries(gameAnalysis.tradeFlows).forEach(([flowId, flowData]) => {
                this.marketState.tradeVolumes.set(flowId, {
                    volume: flowData.volume || 0,
                    value: flowData.value || 0,
                    participants: flowData.participants || [],
                    commodities: flowData.commodities || [],
                    timestamp: Date.now()
                });
            });
        }
        
        // Update market conditions
        if (gameAnalysis.marketConditions) {
            Object.entries(gameAnalysis.marketConditions).forEach(([marketId, conditions]) => {
                this.marketState.activeMarkets.set(marketId, {
                    ...conditions,
                    lastUpdate: Date.now()
                });
            });
        }
    }

    async analyzeMarketConditions(gameAnalysis) {
        const analysis = {
            overallMarketHealth: 0,
            sectorAnalysis: new Map(),
            liquidityAnalysis: this.analyzeLiquidity(),
            volatilityAnalysis: this.analyzeVolatility(),
            participationAnalysis: this.analyzeParticipation(),
            competitionAnalysis: this.analyzeCompetition(),
            riskAssessment: this.assessMarketRisks()
        };
        
        // Analyze each market sector
        for (const [sector, config] of Object.entries(this.marketSectors)) {
            analysis.sectorAnalysis.set(sector, this.analyzeSector(sector, config));
        }
        
        // Calculate overall market health
        analysis.overallMarketHealth = this.calculateOverallMarketHealth(analysis);
        
        return analysis;
    }

    analyzeLiquidity() {
        const liquidityAnalysis = {
            overallLiquidity: 0,
            sectorLiquidity: new Map(),
            liquidityProviders: [],
            liquidityGaps: []
        };
        
        // Analyze liquidity by sector
        for (const sector of Object.keys(this.marketSectors)) {
            const sectorLiquidity = this.calculateSectorLiquidity(sector);
            liquidityAnalysis.sectorLiquidity.set(sector, sectorLiquidity);
            
            if (sectorLiquidity < this.analysisConfig.liquidityThreshold) {
                liquidityAnalysis.liquidityGaps.push({
                    sector,
                    liquidity: sectorLiquidity,
                    severity: this.analysisConfig.liquidityThreshold - sectorLiquidity
                });
            }
        }
        
        // Calculate overall liquidity
        const sectorLiquidities = Array.from(liquidityAnalysis.sectorLiquidity.values());
        liquidityAnalysis.overallLiquidity = sectorLiquidities.length > 0 ? 
            sectorLiquidities.reduce((sum, l) => sum + l, 0) / sectorLiquidities.length : 0.5;
        
        return liquidityAnalysis;
    }

    calculateSectorLiquidity(sector) {
        // Simplified liquidity calculation based on trading volume and participants
        let totalVolume = 0;
        let participantCount = 0;
        
        for (const [flowId, flow] of this.marketState.tradeVolumes) {
            if (flow.commodities.some(commodity => this.getCommoditySector(commodity) === sector)) {
                totalVolume += flow.volume;
                participantCount += flow.participants.length;
            }
        }
        
        // Normalize liquidity score
        const volumeScore = Math.min(1.0, totalVolume / 1000); // Normalize to 0-1
        const participationScore = Math.min(1.0, participantCount / 10); // Normalize to 0-1
        
        return (volumeScore * 0.7 + participationScore * 0.3);
    }

    getCommoditySector(commodity) {
        const sectorMapping = {
            'minerals': 'raw_materials',
            'metals': 'raw_materials',
            'electronics': 'technology',
            'machinery': 'manufactured_goods',
            'energy_cells': 'energy',
            'luxury_items': 'luxury_goods',
            'consulting': 'services'
        };
        
        return sectorMapping[commodity] || 'manufactured_goods';
    }

    analyzeVolatility() {
        const volatilityAnalysis = {
            overallVolatility: 0,
            sectorVolatility: new Map(),
            volatilityTrends: new Map(),
            highVolatilityAssets: []
        };
        
        // Analyze volatility by sector
        for (const sector of Object.keys(this.marketSectors)) {
            const sectorVolatility = this.calculateSectorVolatility(sector);
            volatilityAnalysis.sectorVolatility.set(sector, sectorVolatility);
            
            if (sectorVolatility > this.analysisConfig.volatilityThreshold) {
                volatilityAnalysis.highVolatilityAssets.push({
                    sector,
                    volatility: sectorVolatility,
                    risk_level: this.categorizeVolatilityRisk(sectorVolatility)
                });
            }
        }
        
        // Calculate overall volatility
        const sectorVolatilities = Array.from(volatilityAnalysis.sectorVolatility.values());
        volatilityAnalysis.overallVolatility = sectorVolatilities.length > 0 ? 
            sectorVolatilities.reduce((sum, v) => sum + v, 0) / sectorVolatilities.length : 0.3;
        
        return volatilityAnalysis;
    }

    calculateSectorVolatility(sector) {
        // Use sector base volatility with market condition modifiers
        const baseVolatility = this.marketSectors[sector].volatility;
        
        // Add market condition modifiers
        let volatilityModifier = 1.0;
        
        // Economic instability increases volatility
        const avgEconomicStrength = this.calculateAverageEconomicStrength();
        if (avgEconomicStrength < 0.5) {
            volatilityModifier += (0.5 - avgEconomicStrength);
        }
        
        // High trading activity can increase volatility
        const sectorTradingActivity = this.calculateSectorTradingActivity(sector);
        if (sectorTradingActivity > 0.8) {
            volatilityModifier += 0.2;
        }
        
        return Math.min(1.0, baseVolatility * volatilityModifier);
    }

    calculateAverageEconomicStrength() {
        const profiles = Array.from(this.marketState.civilizationProfiles.values());
        if (profiles.length === 0) return 0.6;
        
        return profiles.reduce((sum, profile) => sum + profile.economicStrength, 0) / profiles.length;
    }

    calculateSectorTradingActivity(sector) {
        let sectorVolume = 0;
        let totalVolume = 0;
        
        for (const flow of this.marketState.tradeVolumes.values()) {
            totalVolume += flow.volume;
            
            if (flow.commodities.some(commodity => this.getCommoditySector(commodity) === sector)) {
                sectorVolume += flow.volume;
            }
        }
        
        return totalVolume > 0 ? sectorVolume / totalVolume : 0;
    }

    categorizeVolatilityRisk(volatility) {
        if (volatility > 0.7) return 'high';
        if (volatility > 0.5) return 'medium';
        return 'low';
    }

    analyzeParticipation() {
        const participationAnalysis = {
            totalParticipants: this.marketState.civilizationProfiles.size,
            activeParticipants: 0,
            participationRate: 0,
            marketConcentration: 0,
            dominantPlayers: []
        };
        
        // Count active participants
        for (const profile of this.marketState.civilizationProfiles.values()) {
            if (profile.marketParticipation > 0.3) {
                participationAnalysis.activeParticipants++;
            }
        }
        
        // Calculate participation rate
        participationAnalysis.participationRate = participationAnalysis.totalParticipants > 0 ? 
            participationAnalysis.activeParticipants / participationAnalysis.totalParticipants : 0;
        
        // Analyze market concentration
        participationAnalysis.marketConcentration = this.calculateMarketConcentration();
        
        // Identify dominant players
        participationAnalysis.dominantPlayers = this.identifyDominantPlayers();
        
        return participationAnalysis;
    }

    calculateMarketConcentration() {
        const marketShares = Array.from(this.marketState.marketShare.values());
        if (marketShares.length === 0) return 0;
        
        // Calculate Herfindahl-Hirschman Index (HHI)
        const hhi = marketShares.reduce((sum, share) => sum + (share * share), 0);
        
        // Normalize HHI to 0-1 scale (1 = monopoly, 0 = perfect competition)
        return Math.min(1.0, hhi);
    }

    identifyDominantPlayers() {
        const players = [];
        
        for (const [civId, share] of this.marketState.marketShare) {
            if (share > 0.2) { // 20% market share threshold
                const profile = this.marketState.civilizationProfiles.get(civId);
                players.push({
                    civilizationId: civId,
                    marketShare: share,
                    economicStrength: profile?.economicStrength || 0.5,
                    influence: share * (profile?.economicStrength || 0.5)
                });
            }
        }
        
        return players.sort((a, b) => b.influence - a.influence);
    }

    analyzeCompetition() {
        const competitionAnalysis = {
            competitionLevel: 0,
            competitiveAdvantages: new Map(),
            marketBarriers: [],
            newEntrantPotential: 0
        };
        
        // Calculate competition level based on market concentration
        const concentration = this.calculateMarketConcentration();
        competitionAnalysis.competitionLevel = Math.max(0, 1 - concentration);
        
        // Analyze competitive advantages
        for (const [civId, profile] of this.marketState.civilizationProfiles) {
            const advantages = this.identifyCompetitiveAdvantages(civId, profile);
            if (advantages.length > 0) {
                competitionAnalysis.competitiveAdvantages.set(civId, advantages);
            }
        }
        
        // Identify market barriers
        competitionAnalysis.marketBarriers = this.identifyMarketBarriers();
        
        // Assess new entrant potential
        competitionAnalysis.newEntrantPotential = this.assessNewEntrantPotential();
        
        return competitionAnalysis;
    }

    identifyCompetitiveAdvantages(civId, profile) {
        const advantages = [];
        
        if (profile.economicStrength > 0.8) {
            advantages.push('economic_dominance');
        }
        
        if (profile.tradingCapacity > 0.7) {
            advantages.push('trading_infrastructure');
        }
        
        if (profile.riskTolerance > 0.7) {
            advantages.push('risk_appetite');
        }
        
        if (profile.creditRating > 0.8) {
            advantages.push('financial_stability');
        }
        
        return advantages;
    }

    identifyMarketBarriers() {
        const barriers = [];
        
        // High market concentration creates barriers
        if (this.calculateMarketConcentration() > 0.6) {
            barriers.push({
                type: 'market_concentration',
                severity: 0.7,
                description: 'High market concentration limits new competition'
            });
        }
        
        // Low liquidity creates barriers
        const overallLiquidity = this.analyzeLiquidity().overallLiquidity;
        if (overallLiquidity < 0.4) {
            barriers.push({
                type: 'liquidity_constraints',
                severity: 0.4 - overallLiquidity,
                description: 'Low market liquidity limits participation'
            });
        }
        
        // High volatility creates barriers
        const overallVolatility = this.analyzeVolatility().overallVolatility;
        if (overallVolatility > 0.6) {
            barriers.push({
                type: 'high_volatility',
                severity: overallVolatility - 0.6,
                description: 'High market volatility deters participation'
            });
        }
        
        return barriers;
    }

    assessNewEntrantPotential() {
        const barriers = this.identifyMarketBarriers();
        const barrierScore = barriers.reduce((sum, barrier) => sum + barrier.severity, 0);
        
        // Lower barriers = higher new entrant potential
        return Math.max(0.1, 1 - (barrierScore / barriers.length || 0));
    }

    assessMarketRisks() {
        const riskAssessment = {
            overallRisk: 0,
            systemicRisks: [],
            sectorRisks: new Map(),
            concentrationRisks: [],
            liquidityRisks: []
        };
        
        // Assess systemic risks
        riskAssessment.systemicRisks = this.identifySystemicRisks();
        
        // Assess sector-specific risks
        for (const sector of Object.keys(this.marketSectors)) {
            riskAssessment.sectorRisks.set(sector, this.assessSectorRisk(sector));
        }
        
        // Assess concentration risks
        riskAssessment.concentrationRisks = this.assessConcentrationRisks();
        
        // Assess liquidity risks
        riskAssessment.liquidityRisks = this.assessLiquidityRisks();
        
        // Calculate overall risk
        riskAssessment.overallRisk = this.calculateOverallRisk(riskAssessment);
        
        return riskAssessment;
    }

    identifySystemicRisks() {
        const risks = [];
        
        // Market concentration risk
        const concentration = this.calculateMarketConcentration();
        if (concentration > 0.7) {
            risks.push({
                type: 'market_concentration',
                severity: concentration - 0.7,
                impact: 'market_manipulation_potential',
                mitigation: 'antitrust_regulation'
            });
        }
        
        // Liquidity crisis risk
        const overallLiquidity = this.analyzeLiquidity().overallLiquidity;
        if (overallLiquidity < 0.3) {
            risks.push({
                type: 'liquidity_crisis',
                severity: 0.3 - overallLiquidity,
                impact: 'market_freeze_potential',
                mitigation: 'liquidity_provision_mechanisms'
            });
        }
        
        // Volatility cascade risk
        const overallVolatility = this.analyzeVolatility().overallVolatility;
        if (overallVolatility > 0.8) {
            risks.push({
                type: 'volatility_cascade',
                severity: overallVolatility - 0.8,
                impact: 'market_instability',
                mitigation: 'volatility_controls'
            });
        }
        
        return risks;
    }

    assessSectorRisk(sector) {
        const sectorConfig = this.marketSectors[sector];
        const sectorLiquidity = this.calculateSectorLiquidity(sector);
        const sectorVolatility = this.calculateSectorVolatility(sector);
        
        // Risk is combination of volatility, liquidity constraints, and strategic importance
        const volatilityRisk = sectorVolatility;
        const liquidityRisk = Math.max(0, 0.5 - sectorLiquidity);
        const strategicRisk = sectorConfig.strategic_importance * 0.3; // Strategic sectors have inherent risk
        
        return {
            overallRisk: (volatilityRisk * 0.4 + liquidityRisk * 0.4 + strategicRisk * 0.2),
            volatilityRisk,
            liquidityRisk,
            strategicRisk,
            riskFactors: this.identifySectorRiskFactors(sector, sectorConfig)
        };
    }

    identifySectorRiskFactors(sector, config) {
        const factors = [];
        
        if (config.strategic_importance > 0.8) {
            factors.push('strategic_dependency');
        }
        
        if (config.substitutability < 0.3) {
            factors.push('limited_alternatives');
        }
        
        if (config.volatility > 0.6) {
            factors.push('price_instability');
        }
        
        return factors;
    }

    assessConcentrationRisks() {
        const risks = [];
        const dominantPlayers = this.identifyDominantPlayers();
        
        dominantPlayers.forEach(player => {
            if (player.marketShare > 0.4) {
                risks.push({
                    type: 'single_player_dominance',
                    player: player.civilizationId,
                    marketShare: player.marketShare,
                    severity: player.marketShare - 0.4,
                    impact: 'market_manipulation_risk'
                });
            }
        });
        
        return risks;
    }

    assessLiquidityRisks() {
        const risks = [];
        const liquidityAnalysis = this.analyzeLiquidity();
        
        liquidityAnalysis.liquidityGaps.forEach(gap => {
            if (gap.severity > 0.2) {
                risks.push({
                    type: 'sector_liquidity_gap',
                    sector: gap.sector,
                    severity: gap.severity,
                    impact: 'trading_difficulties'
                });
            }
        });
        
        return risks;
    }

    calculateOverallRisk(riskAssessment) {
        let totalRisk = 0;
        let riskCount = 0;
        
        // Systemic risks have higher weight
        riskAssessment.systemicRisks.forEach(risk => {
            totalRisk += risk.severity * 2; // Double weight for systemic risks
            riskCount += 2;
        });
        
        // Sector risks
        for (const sectorRisk of riskAssessment.sectorRisks.values()) {
            totalRisk += sectorRisk.overallRisk;
            riskCount++;
        }
        
        // Concentration risks
        riskAssessment.concentrationRisks.forEach(risk => {
            totalRisk += risk.severity * 1.5; // Higher weight for concentration risks
            riskCount += 1.5;
        });
        
        return riskCount > 0 ? Math.min(1.0, totalRisk / riskCount) : 0.3;
    }

    analyzeSector(sector, config) {
        return {
            sector,
            liquidity: this.calculateSectorLiquidity(sector),
            volatility: this.calculateSectorVolatility(sector),
            tradingActivity: this.calculateSectorTradingActivity(sector),
            marketShare: this.calculateSectorMarketShare(sector),
            growth: this.calculateSectorGrowth(sector),
            outlook: this.assessSectorOutlook(sector, config)
        };
    }

    calculateSectorMarketShare(sector) {
        let sectorValue = 0;
        let totalValue = 0;
        
        for (const flow of this.marketState.tradeVolumes.values()) {
            totalValue += flow.value;
            
            if (flow.commodities.some(commodity => this.getCommoditySector(commodity) === sector)) {
                sectorValue += flow.value;
            }
        }
        
        return totalValue > 0 ? sectorValue / totalValue : 0;
    }

    calculateSectorGrowth(sector) {
        // Simplified growth calculation - would use historical data in real implementation
        const baseGrowth = 0.05; // 5% base growth
        const volatility = this.calculateSectorVolatility(sector);
        
        // Higher volatility can mean higher growth potential but also higher risk
        return baseGrowth + (volatility * 0.1) - 0.02; // Adjust for risk
    }

    assessSectorOutlook(sector, config) {
        const liquidity = this.calculateSectorLiquidity(sector);
        const volatility = this.calculateSectorVolatility(sector);
        const activity = this.calculateSectorTradingActivity(sector);
        
        // Positive factors
        let outlook = 0.5; // Neutral baseline
        
        if (liquidity > 0.7) outlook += 0.2;
        if (activity > 0.6) outlook += 0.15;
        if (config.strategic_importance > 0.8) outlook += 0.1;
        
        // Negative factors
        if (volatility > 0.7) outlook -= 0.2;
        if (liquidity < 0.3) outlook -= 0.15;
        
        return Math.max(0.1, Math.min(1.0, outlook));
    }

    calculateOverallMarketHealth(analysis) {
        const liquidity = analysis.liquidityAnalysis.overallLiquidity;
        const participation = analysis.participationAnalysis.participationRate;
        const competition = analysis.competitionAnalysis.competitionLevel;
        const riskLevel = 1 - analysis.riskAssessment.overallRisk;
        
        return (liquidity * 0.3 + participation * 0.25 + competition * 0.25 + riskLevel * 0.2);
    }

    async performPriceDiscovery(marketAnalysis) {
        const priceUpdates = new Map();
        
        // Update prices for each sector based on supply/demand and market conditions
        for (const [sector, sectorAnalysis] of marketAnalysis.sectorAnalysis) {
            const priceChange = this.calculatePriceChange(sector, sectorAnalysis, marketAnalysis);
            const currentPrice = this.getCurrentPrice(sector);
            const newPrice = currentPrice * (1 + priceChange);
            
            priceUpdates.set(sector, {
                sector,
                previousPrice: currentPrice,
                newPrice,
                priceChange,
                volatility: sectorAnalysis.volatility,
                volume: this.getSectorVolume(sector),
                timestamp: Date.now()
            });
        }
        
        return priceUpdates;
    }

    calculatePriceChange(sector, sectorAnalysis, marketAnalysis) {
        let priceChange = 0;
        
        // Supply/demand factors
        const supplyDemandBalance = this.getSupplyDemandBalance(sector);
        priceChange += (supplyDemandBalance - 0.5) * 0.1; // -5% to +5% based on supply/demand
        
        // Liquidity factors
        if (sectorAnalysis.liquidity < 0.4) {
            priceChange += 0.02; // Low liquidity increases prices
        }
        
        // Market sentiment factors
        const marketSentiment = this.getMarketSentiment(sector);
        priceChange += (marketSentiment - 0.5) * 0.05; // -2.5% to +2.5% based on sentiment
        
        // Volatility adjustment
        const volatilityAdjustment = (Math.random() - 0.5) * sectorAnalysis.volatility * 0.1;
        priceChange += volatilityAdjustment;
        
        // Overall market health factor
        const marketHealthFactor = (marketAnalysis.overallMarketHealth - 0.5) * 0.02;
        priceChange += marketHealthFactor;
        
        // Cap price changes to reasonable limits
        return Math.max(-0.15, Math.min(0.15, priceChange)); // -15% to +15% max change
    }

    getCurrentPrice(sector) {
        // Get current price from price history or use default
        const priceHistory = this.marketState.priceHistory.get(sector);
        return priceHistory?.currentPrice || 100; // Default price of 100 units
    }

    getSupplyDemandBalance(sector) {
        const balance = this.marketState.supplyDemandBalance.get(sector);
        return balance || 0.5; // Default to balanced (0.5)
    }

    getMarketSentiment(sector) {
        const sentiment = this.marketState.marketSentiment.get(sector);
        return sentiment || 0.5; // Default to neutral sentiment
    }

    getSectorVolume(sector) {
        let volume = 0;
        
        for (const flow of this.marketState.tradeVolumes.values()) {
            if (flow.commodities.some(commodity => this.getCommoditySector(commodity) === sector)) {
                volume += flow.volume;
            }
        }
        
        return volume;
    }

    async assessMarketSentiment(marketAnalysis) {
        const sentimentAnalysis = {
            overallSentiment: 0,
            sectorSentiment: new Map(),
            sentimentDrivers: [],
            confidenceLevel: 0
        };
        
        // Assess sentiment for each sector
        for (const [sector, sectorAnalysis] of marketAnalysis.sectorAnalysis) {
            const sectorSentiment = this.calculateSectorSentiment(sector, sectorAnalysis, marketAnalysis);
            sentimentAnalysis.sectorSentiment.set(sector, sectorSentiment);
        }
        
        // Calculate overall sentiment
        const sectorSentiments = Array.from(sentimentAnalysis.sectorSentiment.values());
        sentimentAnalysis.overallSentiment = sectorSentiments.length > 0 ? 
            sectorSentiments.reduce((sum, s) => sum + s.sentiment, 0) / sectorSentiments.length : 0.5;
        
        // Identify sentiment drivers
        sentimentAnalysis.sentimentDrivers = this.identifySentimentDrivers(marketAnalysis);
        
        // Calculate confidence level
        sentimentAnalysis.confidenceLevel = this.calculateSentimentConfidence(marketAnalysis);
        
        return sentimentAnalysis;
    }

    calculateSectorSentiment(sector, sectorAnalysis, marketAnalysis) {
        let sentiment = 0.5; // Neutral baseline
        
        // Positive sentiment factors
        if (sectorAnalysis.growth > 0.03) sentiment += 0.2;
        if (sectorAnalysis.liquidity > 0.7) sentiment += 0.1;
        if (sectorAnalysis.outlook > 0.7) sentiment += 0.15;
        
        // Negative sentiment factors
        if (sectorAnalysis.volatility > 0.6) sentiment -= 0.15;
        if (marketAnalysis.riskAssessment.sectorRisks.get(sector)?.overallRisk > 0.6) sentiment -= 0.2;
        
        // Market health influence
        const marketHealthInfluence = (marketAnalysis.overallMarketHealth - 0.5) * 0.1;
        sentiment += marketHealthInfluence;
        
        return {
            sentiment: Math.max(0.1, Math.min(0.9, sentiment)),
            confidence: this.calculateSectorSentimentConfidence(sectorAnalysis),
            factors: this.identifySectorSentimentFactors(sector, sectorAnalysis)
        };
    }

    calculateSectorSentimentConfidence(sectorAnalysis) {
        // Higher liquidity and trading activity = higher confidence in sentiment
        return (sectorAnalysis.liquidity * 0.6 + sectorAnalysis.tradingActivity * 0.4);
    }

    identifySectorSentimentFactors(sector, sectorAnalysis) {
        const factors = [];
        
        if (sectorAnalysis.growth > 0.05) factors.push('strong_growth');
        if (sectorAnalysis.liquidity > 0.8) factors.push('high_liquidity');
        if (sectorAnalysis.volatility > 0.7) factors.push('high_volatility');
        if (sectorAnalysis.tradingActivity > 0.6) factors.push('active_trading');
        
        return factors;
    }

    identifySentimentDrivers(marketAnalysis) {
        const drivers = [];
        
        // Market health driver
        if (marketAnalysis.overallMarketHealth > 0.7) {
            drivers.push({
                type: 'market_health',
                impact: 'positive',
                strength: marketAnalysis.overallMarketHealth - 0.7
            });
        } else if (marketAnalysis.overallMarketHealth < 0.4) {
            drivers.push({
                type: 'market_health',
                impact: 'negative',
                strength: 0.4 - marketAnalysis.overallMarketHealth
            });
        }
        
        // Liquidity driver
        if (marketAnalysis.liquidityAnalysis.overallLiquidity < 0.3) {
            drivers.push({
                type: 'liquidity_concerns',
                impact: 'negative',
                strength: 0.3 - marketAnalysis.liquidityAnalysis.overallLiquidity
            });
        }
        
        // Risk driver
        if (marketAnalysis.riskAssessment.overallRisk > 0.6) {
            drivers.push({
                type: 'risk_concerns',
                impact: 'negative',
                strength: marketAnalysis.riskAssessment.overallRisk - 0.6
            });
        }
        
        return drivers;
    }

    calculateSentimentConfidence(marketAnalysis) {
        const participation = marketAnalysis.participationAnalysis.participationRate;
        const liquidity = marketAnalysis.liquidityAnalysis.overallLiquidity;
        const marketHealth = marketAnalysis.overallMarketHealth;
        
        return (participation * 0.4 + liquidity * 0.3 + marketHealth * 0.3);
    }

    async identifyTradingOpportunities(marketAnalysis, priceUpdates) {
        const opportunities = {
            arbitrageOpportunities: [],
            trendOpportunities: [],
            valuationOpportunities: [],
            riskArbitrageOpportunities: []
        };
        
        // Identify arbitrage opportunities
        opportunities.arbitrageOpportunities = this.identifyArbitrageOpportunities(priceUpdates);
        
        // Identify trend opportunities
        opportunities.trendOpportunities = this.identifyTrendOpportunities(marketAnalysis, priceUpdates);
        
        // Identify valuation opportunities
        opportunities.valuationOpportunities = this.identifyValuationOpportunities(marketAnalysis);
        
        // Identify risk arbitrage opportunities
        opportunities.riskArbitrageOpportunities = this.identifyRiskArbitrageOpportunities(marketAnalysis);
        
        return opportunities;
    }

    identifyArbitrageOpportunities(priceUpdates) {
        const opportunities = [];
        
        // Look for price discrepancies between related sectors or markets
        const priceArray = Array.from(priceUpdates.values());
        
        for (let i = 0; i < priceArray.length; i++) {
            for (let j = i + 1; j < priceArray.length; j++) {
                const price1 = priceArray[i];
                const price2 = priceArray[j];
                
                // Check if sectors are related (simplified)
                if (this.areSectorsRelated(price1.sector, price2.sector)) {
                    const priceDifference = Math.abs(price1.priceChange - price2.priceChange);
                    
                    if (priceDifference > this.analysisConfig.arbitrageThreshold) {
                        opportunities.push({
                            type: 'price_arbitrage',
                            sectors: [price1.sector, price2.sector],
                            priceDifference,
                            potential: priceDifference * 0.5, // Assume 50% capture
                            risk: 'low'
                        });
                    }
                }
            }
        }
        
        return opportunities;
    }

    areSectorsRelated(sector1, sector2) {
        const relatedSectors = {
            'raw_materials': ['manufactured_goods'],
            'manufactured_goods': ['raw_materials', 'technology'],
            'technology': ['manufactured_goods', 'services'],
            'energy': ['raw_materials', 'manufactured_goods']
        };
        
        return relatedSectors[sector1]?.includes(sector2) || 
               relatedSectors[sector2]?.includes(sector1);
    }

    identifyTrendOpportunities(marketAnalysis, priceUpdates) {
        const opportunities = [];
        
        for (const [sector, priceUpdate] of priceUpdates) {
            const sectorAnalysis = marketAnalysis.sectorAnalysis.get(sector);
            
            // Strong upward trend with good fundamentals
            if (priceUpdate.priceChange > 0.05 && sectorAnalysis.outlook > 0.7) {
                opportunities.push({
                    type: 'momentum_long',
                    sector,
                    priceChange: priceUpdate.priceChange,
                    outlook: sectorAnalysis.outlook,
                    potential: sectorAnalysis.outlook * priceUpdate.priceChange,
                    risk: sectorAnalysis.volatility > 0.6 ? 'high' : 'medium'
                });
            }
            
            // Strong downward trend with poor fundamentals (short opportunity)
            if (priceUpdate.priceChange < -0.05 && sectorAnalysis.outlook < 0.4) {
                opportunities.push({
                    type: 'momentum_short',
                    sector,
                    priceChange: priceUpdate.priceChange,
                    outlook: sectorAnalysis.outlook,
                    potential: (1 - sectorAnalysis.outlook) * Math.abs(priceUpdate.priceChange),
                    risk: sectorAnalysis.volatility > 0.6 ? 'high' : 'medium'
                });
            }
        }
        
        return opportunities;
    }

    identifyValuationOpportunities(marketAnalysis) {
        const opportunities = [];
        
        for (const [sector, sectorAnalysis] of marketAnalysis.sectorAnalysis) {
            // Undervalued: good outlook but low current performance
            if (sectorAnalysis.outlook > 0.7 && sectorAnalysis.tradingActivity < 0.4) {
                opportunities.push({
                    type: 'undervalued_long',
                    sector,
                    outlook: sectorAnalysis.outlook,
                    currentActivity: sectorAnalysis.tradingActivity,
                    potential: sectorAnalysis.outlook - sectorAnalysis.tradingActivity,
                    risk: 'medium'
                });
            }
            
            // Overvalued: poor outlook but high current performance
            if (sectorAnalysis.outlook < 0.4 && sectorAnalysis.tradingActivity > 0.7) {
                opportunities.push({
                    type: 'overvalued_short',
                    sector,
                    outlook: sectorAnalysis.outlook,
                    currentActivity: sectorAnalysis.tradingActivity,
                    potential: sectorAnalysis.tradingActivity - sectorAnalysis.outlook,
                    risk: 'medium'
                });
            }
        }
        
        return opportunities;
    }

    identifyRiskArbitrageOpportunities(marketAnalysis) {
        const opportunities = [];
        
        // Look for sectors with mismatched risk/return profiles
        for (const [sector, sectorAnalysis] of marketAnalysis.sectorAnalysis) {
            const sectorRisk = marketAnalysis.riskAssessment.sectorRisks.get(sector);
            
            if (sectorRisk) {
                // High return, low risk opportunity
                if (sectorAnalysis.growth > 0.05 && sectorRisk.overallRisk < 0.4) {
                    opportunities.push({
                        type: 'low_risk_high_return',
                        sector,
                        expectedReturn: sectorAnalysis.growth,
                        risk: sectorRisk.overallRisk,
                        potential: sectorAnalysis.growth / (sectorRisk.overallRisk + 0.1),
                        risk_category: 'low'
                    });
                }
            }
        }
        
        return opportunities;
    }

    async generateMarketDecisions(marketAnalysis, sentimentAnalysis, tradingOpportunities) {
        const decisions = {
            // Financial Markets System Inputs
            market_liquidity_level: marketAnalysis.liquidityAnalysis.overallLiquidity,
            market_volatility_index: marketAnalysis.volatilityAnalysis.overallVolatility,
            trading_volume_modifier: this.calculateTradingVolumeModifier(marketAnalysis),
            
            // Currency Exchange System Inputs
            exchange_market_sentiment: sentimentAnalysis.overallSentiment,
            currency_trading_activity: this.calculateCurrencyTradingActivity(marketAnalysis),
            cross_civ_exchange_rate_stability: this.calculateExchangeRateStability(marketAnalysis),
            
            // Enhanced Trade System Inputs
            inter_civ_trade_efficiency: this.calculateTradeEfficiency(marketAnalysis),
            market_price_discovery_rate: this.calculatePriceDiscoveryRate(marketAnalysis),
            trade_route_profitability: this.calculateTradeRouteProfitability(tradingOpportunities),
            
            // Economic System Inputs (for all civilizations)
            market_confidence_indicator: this.calculateMarketConfidence(marketAnalysis, sentimentAnalysis),
            economic_integration_level: this.calculateEconomicIntegration(marketAnalysis),
            
            // News System Inputs
            market_news_priority: this.calculateMarketNewsPriority(marketAnalysis, tradingOpportunities),
            financial_news_sentiment: sentimentAnalysis.overallSentiment,
            
            // Sector-specific decisions
            sector_performance_indicators: this.generateSectorPerformanceIndicators(marketAnalysis),
            
            // Trading opportunity signals
            arbitrage_opportunity_index: this.calculateArbitrageOpportunityIndex(tradingOpportunities),
            market_timing_signals: this.generateMarketTimingSignals(sentimentAnalysis, tradingOpportunities),
            
            // Risk management inputs
            market_risk_level: marketAnalysis.riskAssessment.overallRisk,
            systemic_risk_indicators: this.generateSystemicRiskIndicators(marketAnalysis.riskAssessment)
        };
        
        return decisions;
    }

    calculateTradingVolumeModifier(marketAnalysis) {
        const participation = marketAnalysis.participationAnalysis.participationRate;
        const liquidity = marketAnalysis.liquidityAnalysis.overallLiquidity;
        const marketHealth = marketAnalysis.overallMarketHealth;
        
        return (participation * 0.4 + liquidity * 0.4 + marketHealth * 0.2);
    }

    calculateCurrencyTradingActivity(marketAnalysis) {
        return marketAnalysis.participationAnalysis.participationRate * 
               marketAnalysis.liquidityAnalysis.overallLiquidity;
    }

    calculateExchangeRateStability(marketAnalysis) {
        return Math.max(0.1, 1 - marketAnalysis.volatilityAnalysis.overallVolatility);
    }

    calculateTradeEfficiency(marketAnalysis) {
        const liquidity = marketAnalysis.liquidityAnalysis.overallLiquidity;
        const competition = marketAnalysis.competitionAnalysis.competitionLevel;
        const riskLevel = 1 - marketAnalysis.riskAssessment.overallRisk;
        
        return (liquidity * 0.4 + competition * 0.3 + riskLevel * 0.3);
    }

    calculatePriceDiscoveryRate(marketAnalysis) {
        return marketAnalysis.participationAnalysis.participationRate * 
               marketAnalysis.liquidityAnalysis.overallLiquidity;
    }

    calculateTradeRouteProfitability(tradingOpportunities) {
        const allOpportunities = [
            ...tradingOpportunities.arbitrageOpportunities,
            ...tradingOpportunities.trendOpportunities,
            ...tradingOpportunities.valuationOpportunities
        ];
        
        if (allOpportunities.length === 0) return 0.5;
        
        const avgPotential = allOpportunities.reduce((sum, opp) => sum + opp.potential, 0) / allOpportunities.length;
        return Math.min(1.0, avgPotential);
    }

    calculateMarketConfidence(marketAnalysis, sentimentAnalysis) {
        return (marketAnalysis.overallMarketHealth * 0.6 + 
                sentimentAnalysis.overallSentiment * 0.4);
    }

    calculateEconomicIntegration(marketAnalysis) {
        return marketAnalysis.participationAnalysis.participationRate;
    }

    calculateMarketNewsPriority(marketAnalysis, tradingOpportunities) {
        const volatility = marketAnalysis.volatilityAnalysis.overallVolatility;
        const opportunityCount = Object.values(tradingOpportunities)
            .reduce((sum, opps) => sum + opps.length, 0);
        
        return Math.min(1.0, volatility + (opportunityCount * 0.1));
    }

    generateSectorPerformanceIndicators(marketAnalysis) {
        const indicators = {};
        
        for (const [sector, sectorAnalysis] of marketAnalysis.sectorAnalysis) {
            indicators[sector] = {
                performance: sectorAnalysis.growth,
                liquidity: sectorAnalysis.liquidity,
                volatility: sectorAnalysis.volatility,
                outlook: sectorAnalysis.outlook,
                marketShare: sectorAnalysis.marketShare
            };
        }
        
        return indicators;
    }

    calculateArbitrageOpportunityIndex(tradingOpportunities) {
        const arbitrageOpps = tradingOpportunities.arbitrageOpportunities;
        
        if (arbitrageOpps.length === 0) return 0.1;
        
        const avgPotential = arbitrageOpps.reduce((sum, opp) => sum + opp.potential, 0) / arbitrageOpps.length;
        return Math.min(1.0, avgPotential * arbitrageOpps.length * 0.2);
    }

    generateMarketTimingSignals(sentimentAnalysis, tradingOpportunities) {
        return {
            overall_sentiment: sentimentAnalysis.overallSentiment,
            confidence_level: sentimentAnalysis.confidenceLevel,
            trend_strength: this.calculateTrendStrength(tradingOpportunities),
            momentum_indicator: this.calculateMomentumIndicator(tradingOpportunities)
        };
    }

    calculateTrendStrength(tradingOpportunities) {
        const trendOpps = tradingOpportunities.trendOpportunities;
        
        if (trendOpps.length === 0) return 0.5;
        
        const strongTrends = trendOpps.filter(opp => opp.potential > 0.1).length;
        return Math.min(1.0, strongTrends / trendOpps.length);
    }

    calculateMomentumIndicator(tradingOpportunities) {
        const momentumOpps = tradingOpportunities.trendOpportunities
            .filter(opp => opp.type.includes('momentum'));
        
        if (momentumOpps.length === 0) return 0.5;
        
        const avgMomentum = momentumOpps.reduce((sum, opp) => sum + Math.abs(opp.priceChange), 0) / momentumOpps.length;
        return Math.min(1.0, avgMomentum * 10); // Scale to 0-1
    }

    generateSystemicRiskIndicators(riskAssessment) {
        return {
            concentration_risk: riskAssessment.concentrationRisks.length > 0 ? 0.8 : 0.2,
            liquidity_risk: riskAssessment.liquidityRisks.length > 0 ? 0.7 : 0.3,
            systemic_risk_count: riskAssessment.systemicRisks.length,
            overall_risk_level: riskAssessment.overallRisk
        };
    }

    updateMarketStateFromDecisions(marketDecisions, priceUpdates) {
        // Update price history
        for (const [sector, priceUpdate] of priceUpdates) {
            this.marketState.priceHistory.set(sector, {
                currentPrice: priceUpdate.newPrice,
                previousPrice: priceUpdate.previousPrice,
                priceChange: priceUpdate.priceChange,
                timestamp: priceUpdate.timestamp
            });
            
            // Update volatility index
            this.marketState.volatilityIndex.set(sector, priceUpdate.volatility);
        }
        
        // Update market sentiment
        if (marketDecisions.financial_news_sentiment) {
            for (const sector of Object.keys(this.marketSectors)) {
                this.marketState.marketSentiment.set(sector, marketDecisions.financial_news_sentiment);
            }
        }
        
        this.marketState.lastUpdate = Date.now();
    }

    generateFallbackResponse() {
        return {
            decisions: {
                market_liquidity_level: 0.6,
                market_volatility_index: 0.4,
                trading_volume_modifier: 0.5,
                exchange_market_sentiment: 0.5,
                currency_trading_activity: 0.4,
                cross_civ_exchange_rate_stability: 0.6,
                inter_civ_trade_efficiency: 0.5,
                market_price_discovery_rate: 0.5,
                trade_route_profitability: 0.5,
                market_confidence_indicator: 0.6,
                economic_integration_level: 0.4,
                market_news_priority: 0.3,
                financial_news_sentiment: 0.5,
                sector_performance_indicators: {},
                arbitrage_opportunity_index: 0.2,
                market_timing_signals: {
                    overall_sentiment: 0.5,
                    confidence_level: 0.5,
                    trend_strength: 0.5,
                    momentum_indicator: 0.5
                },
                market_risk_level: 0.4,
                systemic_risk_indicators: {
                    concentration_risk: 0.3,
                    liquidity_risk: 0.3,
                    systemic_risk_count: 0,
                    overall_risk_level: 0.4
                }
            },
            priceUpdates: new Map(),
            sentiment: {
                overallSentiment: 0.5,
                sectorSentiment: new Map(),
                sentimentDrivers: [],
                confidenceLevel: 0.5
            },
            opportunities: {
                arbitrageOpportunities: [],
                trendOpportunities: [],
                valuationOpportunities: [],
                riskArbitrageOpportunities: []
            }
        };
    }

    // Status and monitoring
    getSystemStatus() {
        return {
            systemId: this.systemId,
            gameId: this.gameId,
            activeMarkets: this.marketState.activeMarkets.size,
            tradingPairs: this.marketState.tradingPairs.size,
            marketParticipants: this.marketState.civilizationProfiles.size,
            overallLiquidity: this.analyzeLiquidity().overallLiquidity,
            overallVolatility: this.analyzeVolatility().overallVolatility,
            lastUpdate: this.marketState.lastUpdate
        };
    }

    ping() {
        return {
            status: 'operational',
            timestamp: Date.now(),
            systemId: this.systemId
        };
    }

    // Cleanup
    destroy() {
        this.removeAllListeners();
        this.marketState.activeMarkets.clear();
        this.marketState.tradingPairs.clear();
        this.marketState.marketMakers.clear();
        this.marketState.priceHistory.clear();
        this.marketState.volatilityIndex.clear();
        this.marketState.marketSentiment.clear();
        this.marketState.tradeVolumes.clear();
        this.marketState.liquidityLevels.clear();
        this.marketState.orderBooks.clear();
        this.marketState.civilizationProfiles.clear();
        this.marketState.tradingBehavior.clear();
        this.marketState.marketShare.clear();
        this.marketState.marketIndices.clear();
        this.marketState.sectorPerformance.clear();
        this.marketState.commodityPrices.clear();
        this.marketState.supplyDemandBalance.clear();
        this.marketState.marketRisks.clear();
        this.marketState.correlationMatrix.clear();
        this.marketState.tradingRules.clear();
        this.marketState.marketRegulation.clear();
        this.marketState.complianceStatus.clear();
        this.marketState.arbitrageOpportunities = [];
        this.marketState.marketInefficiencies = [];
        this.marketState.systemicRisks = [];
        
        console.log(`🏪 Market AI destroyed for ${this.gameId}`);
    }
}

module.exports = { MarketAI };
