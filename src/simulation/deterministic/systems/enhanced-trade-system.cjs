/**
 * Enhanced Trade System - Internal and Inter-Civilization Trade Management
 * 
 * This system manages both internal civilization trade and inter-civilization commerce
 * with comprehensive AI integration points and real-time processing capabilities.
 */

const DeterministicSystemInterface = require('../deterministic-system-interface.cjs');

class EnhancedTradeSystem extends DeterministicSystemInterface {
    constructor(civilizationId, gameConfig) {
        super('enhanced_trade', civilizationId);
        this.gameConfig = gameConfig;
        
        // Internal trade state
        this.internalTrade = {
            domesticRoutes: new Map(),
            localMarkets: new Map(),
            internalSupplyChains: new Map(),
            domesticPricing: new Map(),
            localDemand: new Map()
        };
        
        // Inter-civilization trade state
        this.interCivTrade = {
            tradeAgreements: new Map(),
            activeRoutes: new Map(),
            diplomaticTrade: new Map(),
            embargoList: new Set(),
            tradeWars: new Map()
        };
        
        // Trade metrics and analytics
        this.metrics = {
            totalTradeVolume: 0,
            internalTradeVolume: 0,
            interCivTradeVolume: 0,
            tradeBalance: 0,
            routeEfficiency: new Map(),
            marketStability: 0.8,
            lastUpdate: Date.now()
        };
        
        this.initializeInputKnobs();
        this.initializeOutputChannels();
        this.initializeDefaultTrade();
    }

    initializeInputKnobs() {
        // Internal Trade Control Knobs
        this.inputKnobs.set('internal_trade_promotion', {
            value: 0.5,
            range: [0, 1],
            description: 'Level of government support for internal trade development',
            impact: 'Affects domestic route efficiency and local market growth',
            aiGuidance: 'Increase during economic downturns, decrease if inflation is high'
        });

        this.inputKnobs.set('domestic_market_regulation', {
            value: 0.4,
            range: [0, 1],
            description: 'Strictness of internal market regulations and oversight',
            impact: 'Higher values reduce fraud but may slow trade velocity',
            aiGuidance: 'Balance based on corruption levels and economic stability'
        });

        this.inputKnobs.set('local_business_incentives', {
            value: 0.3,
            range: [0, 1],
            description: 'Tax breaks and subsidies for local businesses',
            impact: 'Stimulates local production but affects government revenue',
            aiGuidance: 'Increase to boost employment, decrease if budget is tight'
        });

        // Inter-Civilization Trade Control Knobs
        this.inputKnobs.set('trade_openness', {
            value: 0.6,
            range: [0, 1],
            description: 'Willingness to engage in inter-civilization trade',
            impact: 'Higher values increase trade opportunities but may affect domestic industries',
            aiGuidance: 'Adjust based on diplomatic relations and economic needs'
        });

        this.inputKnobs.set('tariff_levels', {
            value: 0.2,
            range: [0, 1],
            description: 'Import/export tariff rates on inter-civ trade',
            impact: 'Higher tariffs protect domestic industry but may trigger trade wars',
            aiGuidance: 'Use strategically to protect key industries or retaliate'
        });

        this.inputKnobs.set('trade_route_security', {
            value: 0.7,
            range: [0, 1],
            description: 'Investment in protecting trade routes from piracy/attacks',
            impact: 'Higher security increases costs but reduces losses and delays',
            aiGuidance: 'Increase during conflicts, optimize during peaceful periods'
        });

        this.inputKnobs.set('diplomatic_trade_priority', {
            value: 0.5,
            range: [0, 1],
            description: 'Priority given to trade with diplomatic allies',
            impact: 'Strengthens alliances but may miss better economic opportunities',
            aiGuidance: 'Increase during diplomatic crises, balance during normal times'
        });

        this.inputKnobs.set('resource_export_control', {
            value: 0.3,
            range: [0, 1],
            description: 'Restrictions on exporting strategic resources',
            impact: 'Preserves strategic materials but reduces trade income',
            aiGuidance: 'Increase during resource scarcity or military tensions'
        });

        this.inputKnobs.set('trade_technology_sharing', {
            value: 0.4,
            range: [0, 1],
            description: 'Willingness to share trade-related technologies',
            impact: 'Improves efficiency but may benefit competitors',
            aiGuidance: 'Share with allies, restrict with rivals'
        });

        // Economic Policy Knobs
        this.inputKnobs.set('currency_stability_support', {
            value: 0.6,
            range: [0, 1],
            description: 'Government intervention to maintain currency stability',
            impact: 'Stabilizes trade but requires significant reserves',
            aiGuidance: 'Increase during economic volatility'
        });

        this.inputKnobs.set('trade_infrastructure_investment', {
            value: 0.5,
            range: [0, 1],
            description: 'Investment in ports, logistics, and trade facilities',
            impact: 'Long-term trade capacity improvement with upfront costs',
            aiGuidance: 'Invest during growth periods, maintain during recessions'
        });

        this.inputKnobs.set('emergency_trade_protocols', {
            value: 0.2,
            range: [0, 1],
            description: 'Activation level of emergency trade measures',
            impact: 'Enables rapid response to crises but disrupts normal trade',
            aiGuidance: 'Activate only during genuine emergencies'
        });
    }

    initializeOutputChannels() {
        // Internal Trade Outputs
        this.outputChannels.set('internal_trade_metrics', {
            description: 'Comprehensive internal trade performance data',
            dataStructure: {
                domesticTradeVolume: 'number',
                localMarketGrowth: 'number',
                internalRouteEfficiency: 'number',
                localBusinessHealth: 'number',
                domesticSupplyChainStability: 'number'
            },
            updateFrequency: 'real-time',
            aiConsumption: 'Used by Economic AI for internal policy decisions'
        });

        this.outputChannels.set('local_market_conditions', {
            description: 'Real-time local market status and opportunities',
            dataStructure: {
                marketsByRegion: 'Map<regionId, marketData>',
                supplyDemandBalance: 'Map<resourceType, balanceData>',
                priceVolatility: 'Map<resourceType, volatilityIndex>',
                emergingOpportunities: 'Array<opportunityData>'
            },
            updateFrequency: 'every_quarter',
            aiConsumption: 'Used by Business Leader AI for investment decisions'
        });

        // Inter-Civilization Trade Outputs
        this.outputChannels.set('inter_civ_trade_status', {
            description: 'Status of all inter-civilization trade relationships',
            dataStructure: {
                activeAgreements: 'Map<civId, agreementData>',
                tradeVolumeByCiv: 'Map<civId, volumeData>',
                tradeBalance: 'Map<civId, balanceData>',
                routeStatus: 'Map<routeId, statusData>',
                diplomaticTradeImpact: 'Map<civId, impactData>'
            },
            updateFrequency: 'real-time',
            aiConsumption: 'Used by Diplomatic AI for trade negotiations'
        });

        this.outputChannels.set('trade_opportunities', {
            description: 'Identified trade opportunities and threats',
            dataStructure: {
                newMarketOpportunities: 'Array<opportunityData>',
                resourceArbitrageOpportunities: 'Array<arbitrageData>',
                competitiveThreats: 'Array<threatData>',
                partnershipOpportunities: 'Array<partnershipData>'
            },
            updateFrequency: 'every_quarter',
            aiConsumption: 'Used by Strategic AI for long-term planning'
        });

        this.outputChannels.set('trade_security_status', {
            description: 'Security status of trade routes and facilities',
            dataStructure: {
                routeSecurityLevels: 'Map<routeId, securityLevel>',
                threatAssessments: 'Map<routeId, threatData>',
                incidentReports: 'Array<incidentData>',
                securityCosts: 'Map<routeId, costData>'
            },
            updateFrequency: 'real-time',
            aiConsumption: 'Used by Military AI for security planning'
        });

        this.outputChannels.set('economic_impact_analysis', {
            description: 'Economic impact of trade policies and activities',
            dataStructure: {
                gdpImpact: 'number',
                employmentImpact: 'number',
                industryImpacts: 'Map<industryId, impactData>',
                regionalImpacts: 'Map<regionId, impactData>',
                longTermProjections: 'Array<projectionData>'
            },
            updateFrequency: 'every_quarter',
            aiConsumption: 'Used by Economic AI for policy impact assessment'
        });

        // Crisis and Emergency Outputs
        this.outputChannels.set('trade_crisis_alerts', {
            description: 'Real-time alerts for trade-related crises and disruptions',
            dataStructure: {
                activeAlerts: 'Array<alertData>',
                riskAssessments: 'Map<riskType, riskLevel>',
                contingencyRecommendations: 'Array<recommendationData>',
                emergencyProtocolStatus: 'Map<protocolId, statusData>'
            },
            updateFrequency: 'real-time',
            aiConsumption: 'Used by Crisis Management AI for emergency response'
        });

        // Performance and Analytics Outputs
        this.outputChannels.set('trade_performance_analytics', {
            description: 'Comprehensive trade performance analytics and trends',
            dataStructure: {
                performanceTrends: 'Map<metricType, trendData>',
                benchmarkComparisons: 'Map<civId, comparisonData>',
                efficiencyMetrics: 'Map<systemComponent, efficiencyData>',
                optimizationRecommendations: 'Array<recommendationData>'
            },
            updateFrequency: 'every_quarter',
            aiConsumption: 'Used by Strategic AI for system optimization'
        });
    }

    initializeDefaultTrade() {
        // Initialize internal trade routes
        this.internalTrade.domesticRoutes.set('route_001', {
            id: 'route_001',
            name: 'Capital-Industrial Corridor',
            origin: 'capital_region',
            destination: 'industrial_region',
            primaryCommodities: ['manufactured_goods', 'raw_materials'],
            volume: 1000000,
            efficiency: 0.85,
            lastUpdate: Date.now()
        });

        this.internalTrade.domesticRoutes.set('route_002', {
            id: 'route_002',
            name: 'Agricultural Supply Chain',
            origin: 'agricultural_region',
            destination: 'urban_centers',
            primaryCommodities: ['food', 'agricultural_products'],
            volume: 750000,
            efficiency: 0.78,
            lastUpdate: Date.now()
        });

        // Initialize local markets
        this.internalTrade.localMarkets.set('capital_market', {
            id: 'capital_market',
            region: 'capital_region',
            size: 'large',
            specializations: ['luxury_goods', 'services', 'technology'],
            stability: 0.9,
            growth: 0.05,
            lastUpdate: Date.now()
        });

        // Initialize inter-civ trade agreements
        this.interCivTrade.tradeAgreements.set('agreement_001', {
            id: 'agreement_001',
            partnerId: 'allied_civ_001',
            type: 'comprehensive_trade_agreement',
            status: 'active',
            tradeVolume: 2000000,
            tariffRate: 0.05,
            keyResources: ['energy', 'rare_minerals'],
            diplomaticValue: 0.8,
            lastRenewal: Date.now() - 86400000 * 30,
            nextReview: Date.now() + 86400000 * 90
        });
    }

    // Main processing function
    processSystemTick(gameState, deltaTime) {
        const tickResults = {
            internalTradeUpdates: [],
            interCivTradeUpdates: [],
            newOpportunities: [],
            alerts: [],
            performanceChanges: {}
        };

        try {
            // Process internal trade
            this.processInternalTrade(gameState, deltaTime, tickResults);
            
            // Process inter-civilization trade
            this.processInterCivTrade(gameState, deltaTime, tickResults);
            
            // Update metrics and analytics
            this.updateTradeMetrics(gameState, deltaTime, tickResults);
            
            // Generate outputs for AI consumption
            this.updateOutputChannels(tickResults);
            
            return tickResults;

        } catch (error) {
            console.error('Enhanced Trade System processing error:', error);
            return tickResults;
        }
    }

    processInternalTrade(gameState, deltaTime, tickResults) {
        const tradePromotion = this.getKnobValue('internal_trade_promotion');
        const marketRegulation = this.getKnobValue('domestic_market_regulation');
        const businessIncentives = this.getKnobValue('local_business_incentives');

        // Update domestic routes
        for (const [routeId, route] of this.internalTrade.domesticRoutes) {
            const oldEfficiency = route.efficiency;
            
            // Calculate efficiency changes based on knob settings
            let efficiencyChange = 0;
            efficiencyChange += tradePromotion * 0.02; // Trade promotion improves efficiency
            efficiencyChange -= marketRegulation * 0.01; // Regulation may slow things down
            efficiencyChange += businessIncentives * 0.015; // Incentives help efficiency
            
            // Apply random market fluctuations
            efficiencyChange += (Math.random() - 0.5) * 0.01;
            
            route.efficiency = Math.max(0.1, Math.min(1.0, route.efficiency + efficiencyChange));
            route.volume *= (1 + efficiencyChange * 0.5); // Volume responds to efficiency
            route.lastUpdate = Date.now();
            
            if (Math.abs(route.efficiency - oldEfficiency) > 0.05) {
                tickResults.internalTradeUpdates.push({
                    type: 'route_efficiency_change',
                    routeId: routeId,
                    oldEfficiency: oldEfficiency,
                    newEfficiency: route.efficiency,
                    impact: efficiencyChange > 0 ? 'positive' : 'negative'
                });
            }
        }

        // Update local markets
        for (const [marketId, market] of this.internalTrade.localMarkets) {
            const oldGrowth = market.growth;
            
            // Calculate market growth based on policies
            let growthChange = 0;
            growthChange += tradePromotion * 0.01;
            growthChange += businessIncentives * 0.015;
            growthChange -= marketRegulation * 0.005; // Some regulation helps stability
            
            market.growth = Math.max(-0.1, Math.min(0.2, market.growth + growthChange));
            market.stability = Math.max(0.1, Math.min(1.0, market.stability + marketRegulation * 0.01));
            market.lastUpdate = Date.now();
            
            if (Math.abs(market.growth - oldGrowth) > 0.01) {
                tickResults.internalTradeUpdates.push({
                    type: 'market_growth_change',
                    marketId: marketId,
                    oldGrowth: oldGrowth,
                    newGrowth: market.growth,
                    stability: market.stability
                });
            }
        }
    }

    processInterCivTrade(gameState, deltaTime, tickResults) {
        const tradeOpenness = this.getKnobValue('trade_openness');
        const tariffLevels = this.getKnobValue('tariff_levels');
        const routeSecurity = this.getKnobValue('trade_route_security');
        const diplomaticPriority = this.getKnobValue('diplomatic_trade_priority');

        // Process existing trade agreements
        for (const [agreementId, agreement] of this.interCivTrade.tradeAgreements) {
            const oldVolume = agreement.tradeVolume;
            
            // Calculate trade volume changes
            let volumeMultiplier = 1.0;
            volumeMultiplier += tradeOpenness * 0.1; // More openness = more trade
            volumeMultiplier -= tariffLevels * 0.15; // Higher tariffs reduce trade
            volumeMultiplier += routeSecurity * 0.05; // Security encourages trade
            
            // Diplomatic factors
            const diplomaticRelation = gameState.diplomaticRelations?.get(agreement.partnerId) || 0.5;
            volumeMultiplier += diplomaticRelation * diplomaticPriority * 0.1;
            
            // Apply market volatility
            volumeMultiplier += (Math.random() - 0.5) * 0.05;
            
            agreement.tradeVolume *= volumeMultiplier;
            agreement.lastUpdate = Date.now();
            
            if (Math.abs(volumeMultiplier - 1.0) > 0.02) {
                tickResults.interCivTradeUpdates.push({
                    type: 'trade_volume_change',
                    agreementId: agreementId,
                    partnerId: agreement.partnerId,
                    oldVolume: oldVolume,
                    newVolume: agreement.tradeVolume,
                    change: volumeMultiplier - 1.0
                });
            }
        }

        // Check for new trade opportunities
        if (tradeOpenness > 0.6 && Math.random() < 0.1) {
            const opportunity = this.generateTradeOpportunity(gameState);
            if (opportunity) {
                tickResults.newOpportunities.push(opportunity);
            }
        }

        // Monitor for trade disruptions
        this.monitorTradeDisruptions(gameState, tickResults);
    }

    generateTradeOpportunity(gameState) {
        const opportunityTypes = [
            'new_market_access',
            'resource_arbitrage',
            'technology_exchange',
            'joint_venture',
            'supply_chain_optimization'
        ];
        
        const type = opportunityTypes[Math.floor(Math.random() * opportunityTypes.length)];
        
        return {
            id: `opportunity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: type,
            description: this.generateOpportunityDescription(type),
            potentialValue: Math.floor(Math.random() * 1000000) + 100000,
            riskLevel: Math.random(),
            timeWindow: Math.floor(Math.random() * 30) + 7, // 7-37 days
            requirements: this.generateOpportunityRequirements(type),
            createdAt: Date.now()
        };
    }

    generateOpportunityDescription(type) {
        const descriptions = {
            new_market_access: 'Opportunity to establish trade relations with emerging civilization',
            resource_arbitrage: 'Price differential detected for strategic resources between markets',
            technology_exchange: 'Potential for mutually beneficial technology sharing agreement',
            joint_venture: 'Partnership opportunity for large-scale infrastructure project',
            supply_chain_optimization: 'Opportunity to streamline multi-civilization supply chain'
        };
        
        return descriptions[type] || 'New trade opportunity identified';
    }

    generateOpportunityRequirements(type) {
        const requirements = {
            new_market_access: ['diplomatic_contact', 'trade_delegation', 'market_analysis'],
            resource_arbitrage: ['transport_capacity', 'market_intelligence', 'risk_capital'],
            technology_exchange: ['technology_assessment', 'ip_protection', 'joint_research_facility'],
            joint_venture: ['capital_investment', 'project_management', 'legal_framework'],
            supply_chain_optimization: ['logistics_analysis', 'partner_coordination', 'infrastructure_upgrade']
        };
        
        return requirements[type] || ['general_preparation'];
    }

    monitorTradeDisruptions(gameState, tickResults) {
        // Check for various disruption scenarios
        const routeSecurity = this.getKnobValue('trade_route_security');
        
        // Piracy/security threats
        if (routeSecurity < 0.5 && Math.random() < 0.05) {
            tickResults.alerts.push({
                type: 'security_threat',
                severity: 'medium',
                description: 'Increased piracy activity detected on trade routes',
                impact: 'Trade volume may decrease by 5-15%',
                recommendations: ['increase_route_security', 'consider_alternative_routes']
            });
        }
        
        // Political disruptions
        if (gameState.politicalStability < 0.6 && Math.random() < 0.03) {
            tickResults.alerts.push({
                type: 'political_disruption',
                severity: 'high',
                description: 'Political instability affecting trade partnerships',
                impact: 'Some trade agreements may be suspended',
                recommendations: ['diplomatic_engagement', 'diversify_trade_partners']
            });
        }
        
        // Economic disruptions
        if (gameState.economicStability < 0.5 && Math.random() < 0.04) {
            tickResults.alerts.push({
                type: 'economic_disruption',
                severity: 'high',
                description: 'Economic crisis affecting trade capacity',
                impact: 'Trade volumes may drop significantly',
                recommendations: ['emergency_trade_protocols', 'economic_stabilization_measures']
            });
        }
    }

    updateTradeMetrics(gameState, deltaTime, tickResults) {
        // Calculate total trade volumes
        let internalVolume = 0;
        for (const route of this.internalTrade.domesticRoutes.values()) {
            internalVolume += route.volume;
        }
        
        let interCivVolume = 0;
        for (const agreement of this.interCivTrade.tradeAgreements.values()) {
            interCivVolume += agreement.tradeVolume;
        }
        
        this.metrics.internalTradeVolume = internalVolume;
        this.metrics.interCivTradeVolume = interCivVolume;
        this.metrics.totalTradeVolume = internalVolume + interCivVolume;
        
        // Calculate trade balance
        let exports = 0;
        let imports = 0;
        for (const agreement of this.interCivTrade.tradeAgreements.values()) {
            // Simplified calculation - in reality would need detailed trade flow data
            exports += agreement.tradeVolume * 0.6;
            imports += agreement.tradeVolume * 0.4;
        }
        this.metrics.tradeBalance = exports - imports;
        
        // Update market stability
        let totalStability = 0;
        let marketCount = 0;
        for (const market of this.internalTrade.localMarkets.values()) {
            totalStability += market.stability;
            marketCount++;
        }
        this.metrics.marketStability = marketCount > 0 ? totalStability / marketCount : 0.5;
        
        this.metrics.lastUpdate = Date.now();
    }

    updateOutputChannels(tickResults) {
        // Update internal trade metrics
        this.outputChannels.get('internal_trade_metrics').currentData = {
            domesticTradeVolume: this.metrics.internalTradeVolume,
            localMarketGrowth: this.calculateAverageMarketGrowth(),
            internalRouteEfficiency: this.calculateAverageRouteEfficiency(),
            localBusinessHealth: this.calculateBusinessHealth(),
            domesticSupplyChainStability: this.calculateSupplyChainStability()
        };

        // Update local market conditions
        this.outputChannels.get('local_market_conditions').currentData = {
            marketsByRegion: this.getMarketsByRegion(),
            supplyDemandBalance: this.calculateSupplyDemandBalance(),
            priceVolatility: this.calculatePriceVolatility(),
            emergingOpportunities: tickResults.newOpportunities.filter(op => op.type.includes('local'))
        };

        // Update inter-civ trade status
        this.outputChannels.get('inter_civ_trade_status').currentData = {
            activeAgreements: this.interCivTrade.tradeAgreements,
            tradeVolumeByCiv: this.calculateTradeVolumeByCiv(),
            tradeBalance: this.calculateTradeBalanceByCiv(),
            routeStatus: this.calculateRouteStatus(),
            diplomaticTradeImpact: this.calculateDiplomaticTradeImpact()
        };

        // Update trade opportunities
        this.outputChannels.get('trade_opportunities').currentData = {
            newMarketOpportunities: tickResults.newOpportunities.filter(op => op.type === 'new_market_access'),
            resourceArbitrageOpportunities: tickResults.newOpportunities.filter(op => op.type === 'resource_arbitrage'),
            competitiveThreats: this.identifyCompetitiveThreats(),
            partnershipOpportunities: tickResults.newOpportunities.filter(op => op.type === 'joint_venture')
        };

        // Update trade security status
        this.outputChannels.get('trade_security_status').currentData = {
            routeSecurityLevels: this.calculateRouteSecurityLevels(),
            threatAssessments: this.generateThreatAssessments(),
            incidentReports: this.getRecentIncidents(),
            securityCosts: this.calculateSecurityCosts()
        };

        // Update economic impact analysis
        this.outputChannels.get('economic_impact_analysis').currentData = {
            gdpImpact: this.calculateGDPImpact(),
            employmentImpact: this.calculateEmploymentImpact(),
            industryImpacts: this.calculateIndustryImpacts(),
            regionalImpacts: this.calculateRegionalImpacts(),
            longTermProjections: this.generateLongTermProjections()
        };

        // Update crisis alerts
        this.outputChannels.get('trade_crisis_alerts').currentData = {
            activeAlerts: tickResults.alerts,
            riskAssessments: this.assessTradeRisks(),
            contingencyRecommendations: this.generateContingencyRecommendations(),
            emergencyProtocolStatus: this.getEmergencyProtocolStatus()
        };

        // Update performance analytics
        this.outputChannels.get('trade_performance_analytics').currentData = {
            performanceTrends: this.calculatePerformanceTrends(),
            benchmarkComparisons: this.generateBenchmarkComparisons(),
            efficiencyMetrics: this.calculateEfficiencyMetrics(),
            optimizationRecommendations: this.generateOptimizationRecommendations()
        };
    }

    // Helper methods for calculations
    calculateAverageMarketGrowth() {
        let totalGrowth = 0;
        let count = 0;
        for (const market of this.internalTrade.localMarkets.values()) {
            totalGrowth += market.growth;
            count++;
        }
        return count > 0 ? totalGrowth / count : 0;
    }

    calculateAverageRouteEfficiency() {
        let totalEfficiency = 0;
        let count = 0;
        for (const route of this.internalTrade.domesticRoutes.values()) {
            totalEfficiency += route.efficiency;
            count++;
        }
        return count > 0 ? totalEfficiency / count : 0;
    }

    calculateBusinessHealth() {
        const businessIncentives = this.getKnobValue('local_business_incentives');
        const marketRegulation = this.getKnobValue('domestic_market_regulation');
        const tradePromotion = this.getKnobValue('internal_trade_promotion');
        
        return (businessIncentives * 0.4 + tradePromotion * 0.4 + (1 - marketRegulation) * 0.2);
    }

    calculateSupplyChainStability() {
        let totalStability = 0;
        let count = 0;
        
        for (const route of this.internalTrade.domesticRoutes.values()) {
            totalStability += route.efficiency;
            count++;
        }
        
        const routeStability = count > 0 ? totalStability / count : 0.5;
        const securityFactor = this.getKnobValue('trade_route_security');
        
        return (routeStability * 0.7 + securityFactor * 0.3);
    }

    // Additional helper methods would be implemented here...
    // (Truncated for brevity, but would include all the calculation methods referenced above)

    // Public API methods
    getTradeMetrics() {
        return { ...this.metrics };
    }

    getInternalTradeStatus() {
        return {
            routes: Array.from(this.internalTrade.domesticRoutes.values()),
            markets: Array.from(this.internalTrade.localMarkets.values()),
            totalVolume: this.metrics.internalTradeVolume
        };
    }

    getInterCivTradeStatus() {
        return {
            agreements: Array.from(this.interCivTrade.tradeAgreements.values()),
            totalVolume: this.metrics.interCivTradeVolume,
            tradeBalance: this.metrics.tradeBalance
        };
    }

    // Emergency response methods
    activateEmergencyProtocols(protocolType) {
        this.setKnobValue('emergency_trade_protocols', 1.0);
        
        return {
            activated: true,
            protocolType: protocolType,
            expectedImpact: 'Trade routes will be secured, non-essential trade suspended',
            duration: 'Until manually deactivated',
            timestamp: Date.now()
        };
    }

    // Integration methods for AI systems
    getAIRecommendations(aiType, currentGameState) {
        const recommendations = [];
        
        switch (aiType) {
            case 'economic':
                recommendations.push(...this.generateEconomicAIRecommendations(currentGameState));
                break;
            case 'diplomatic':
                recommendations.push(...this.generateDiplomaticAIRecommendations(currentGameState));
                break;
            case 'strategic':
                recommendations.push(...this.generateStrategicAIRecommendations(currentGameState));
                break;
        }
        
        return recommendations;
    }

    generateEconomicAIRecommendations(gameState) {
        const recommendations = [];
        
        if (this.metrics.tradeBalance < -1000000) {
            recommendations.push({
                type: 'policy_adjustment',
                knob: 'tariff_levels',
                suggestedValue: Math.min(this.getKnobValue('tariff_levels') + 0.1, 0.8),
                reasoning: 'Negative trade balance suggests need for import restrictions'
            });
        }
        
        if (this.metrics.marketStability < 0.6) {
            recommendations.push({
                type: 'policy_adjustment',
                knob: 'domestic_market_regulation',
                suggestedValue: Math.min(this.getKnobValue('domestic_market_regulation') + 0.1, 0.8),
                reasoning: 'Low market stability requires increased regulation'
            });
        }
        
        return recommendations;
    }

    generateDiplomaticAIRecommendations(gameState) {
        const recommendations = [];
        
        // Check for underutilized diplomatic trade opportunities
        const diplomaticPriority = this.getKnobValue('diplomatic_trade_priority');
        if (diplomaticPriority < 0.7 && gameState.diplomaticCrises > 0) {
            recommendations.push({
                type: 'policy_adjustment',
                knob: 'diplomatic_trade_priority',
                suggestedValue: 0.8,
                reasoning: 'Diplomatic crises require increased trade cooperation with allies'
            });
        }
        
        return recommendations;
    }

    generateStrategicAIRecommendations(gameState) {
        const recommendations = [];
        
        // Long-term infrastructure recommendations
        if (this.calculateAverageRouteEfficiency() < 0.7) {
            recommendations.push({
                type: 'policy_adjustment',
                knob: 'trade_infrastructure_investment',
                suggestedValue: 0.8,
                reasoning: 'Low route efficiency indicates need for infrastructure investment'
            });
        }
        
        return recommendations;
    }
}

module.exports = EnhancedTradeSystem;
