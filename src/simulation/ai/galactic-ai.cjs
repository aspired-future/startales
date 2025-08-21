// Galactic AI - Inter-civilization dynamics, cosmic events, and galactic phenomena
// Provides shared galactic intelligence for all civilizations

const EventEmitter = require('events');

class GalacticAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'galactic-ai';
        this.gameId = config.gameId || 'default_game';
        
        // Galactic state tracking all civilizations
        this.galacticState = {
            // Civilization Tracking
            activeCivilizations: new Map(),
            civilizationRelations: new Map(),
            powerBalance: new Map(),
            
            // Cosmic Events
            activeEvents: [],
            eventHistory: [],
            cosmicCycles: new Map(),
            
            // Galactic Phenomena
            spatialAnomalies: [],
            resourceDistribution: new Map(),
            tradeRoutes: new Map(),
            
            // Inter-Civilization Dynamics
            allianceNetworks: new Map(),
            conflictZones: [],
            diplomaticTensions: new Map(),
            
            // Galactic Economy
            galacticMarkets: new Map(),
            currencyExchangeRates: new Map(),
            tradeFlows: new Map(),
            
            // Cosmic Threats
            galacticThreats: [],
            emergingCrises: [],
            
            // Environmental Factors
            galacticClimate: {
                stability: 0.7,
                radiationLevels: 0.3,
                cosmicWeather: 'stable'
            },
            
            lastUpdate: Date.now()
        };
        
        // Event generation parameters
        this.eventConfig = {
            eventFrequency: config.eventFrequency || 0.3, // Events per processing cycle
            crisisThreshold: config.crisisThreshold || 0.7,
            cooperationBonus: config.cooperationBonus || 0.2,
            conflictPenalty: config.conflictPenalty || 0.3
        };
        
        // Cosmic event types and their characteristics
        this.cosmicEventTypes = {
            'stellar_phenomena': {
                frequency: 0.4,
                impact: 0.6,
                duration: 'medium',
                scope: 'regional'
            },
            'resource_discovery': {
                frequency: 0.3,
                impact: 0.7,
                duration: 'permanent',
                scope: 'local'
            },
            'galactic_crisis': {
                frequency: 0.1,
                impact: 0.9,
                duration: 'long',
                scope: 'galactic'
            },
            'diplomatic_opportunity': {
                frequency: 0.5,
                impact: 0.5,
                duration: 'short',
                scope: 'bilateral'
            },
            'technological_breakthrough': {
                frequency: 0.2,
                impact: 0.8,
                duration: 'permanent',
                scope: 'civilization'
            },
            'environmental_shift': {
                frequency: 0.25,
                impact: 0.6,
                duration: 'long',
                scope: 'regional'
            }
        };
        
        console.log(`🌌 Galactic AI initialized for game ${this.gameId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update galactic state from all civilizations
            this.updateGalacticState(gameAnalysis);
            
            // Analyze inter-civilization dynamics
            const dynamicsAnalysis = await this.analyzeInterCivDynamics(gameAnalysis);
            
            // Generate cosmic events
            const cosmicEvents = await this.generateCosmicEvents(gameAnalysis, dynamicsAnalysis);
            
            // Assess galactic stability
            const stabilityAssessment = await this.assessGalacticStability(dynamicsAnalysis);
            
            // Generate galactic decisions
            const galacticDecisions = await this.generateGalacticDecisions(dynamicsAnalysis, cosmicEvents, stabilityAssessment);
            
            // Update galactic state
            this.updateGalacticStateFromDecisions(galacticDecisions, cosmicEvents);
            
            const processingTime = Date.now() - startTime;
            console.log(`🌌 Galactic AI processed in ${processingTime}ms for ${this.gameId}`);
            
            this.emit('processingComplete', {
                gameId: this.gameId,
                decisions: galacticDecisions,
                cosmicEvents,
                galacticStability: stabilityAssessment.overallStability,
                processingTime
            });
            
            return {
                decisions: galacticDecisions,
                events: cosmicEvents,
                stability: stabilityAssessment
            };
            
        } catch (error) {
            console.error(`🌌 Galactic AI processing error for ${this.gameId}:`, error);
            this.emit('processingError', { gameId: this.gameId, error });
            return this.generateFallbackResponse();
        }
    }

    updateGalacticState(gameAnalysis) {
        // Update civilization data
        if (gameAnalysis.civilizations) {
            Object.entries(gameAnalysis.civilizations).forEach(([civId, civData]) => {
                this.galacticState.activeCivilizations.set(civId, {
                    id: civId,
                    power: this.calculateCivilizationPower(civData),
                    stability: civData.stability || 0.7,
                    economicStrength: civData.economicStrength || 0.6,
                    militaryStrength: civData.militaryStrength || 0.5,
                    diplomaticInfluence: civData.diplomaticInfluence || 0.5,
                    technologicalLevel: civData.technologicalLevel || 0.5,
                    lastUpdate: Date.now()
                });
            });
        }
        
        // Update inter-civilization relations
        if (gameAnalysis.interCivRelations) {
            Object.entries(gameAnalysis.interCivRelations).forEach(([relationKey, relationData]) => {
                this.galacticState.civilizationRelations.set(relationKey, relationData);
            });
        }
        
        // Update galactic markets
        if (gameAnalysis.galacticMarkets) {
            Object.entries(gameAnalysis.galacticMarkets).forEach(([marketId, marketData]) => {
                this.galacticState.galacticMarkets.set(marketId, marketData);
            });
        }
    }

    calculateCivilizationPower(civData) {
        // Composite power calculation
        const economic = civData.economicStrength || 0.5;
        const military = civData.militaryStrength || 0.5;
        const diplomatic = civData.diplomaticInfluence || 0.5;
        const technological = civData.technologicalLevel || 0.5;
        const population = civData.populationSize || 0.5;
        
        return (economic * 0.25 + military * 0.2 + diplomatic * 0.2 + 
                technological * 0.2 + population * 0.15);
    }

    async analyzeInterCivDynamics(gameAnalysis) {
        const analysis = {
            powerBalance: this.analyzePowerBalance(),
            allianceStructure: this.analyzeAllianceStructure(),
            conflictPotential: this.analyzeConflictPotential(),
            cooperationOpportunities: this.identifyCooperationOpportunities(),
            tradeNetworks: this.analyzeTradeNetworks(),
            diplomaticTrends: this.analyzeDiplomaticTrends()
        };
        
        return analysis;
    }

    analyzePowerBalance() {
        const civilizations = Array.from(this.galacticState.activeCivilizations.values());
        
        if (civilizations.length === 0) {
            return { balance: 'stable', dominantCiv: null, powerGap: 0 };
        }
        
        // Sort by power
        civilizations.sort((a, b) => b.power - a.power);
        
        const topPower = civilizations[0].power;
        const secondPower = civilizations[1]?.power || 0;
        const powerGap = topPower - secondPower;
        
        let balance = 'stable';
        if (powerGap > 0.3) {
            balance = 'hegemonic';
        } else if (powerGap > 0.15) {
            balance = 'dominant';
        } else if (civilizations.length > 2 && topPower - civilizations[2].power < 0.1) {
            balance = 'multipolar';
        }
        
        return {
            balance,
            dominantCiv: civilizations[0].id,
            powerGap,
            powerDistribution: civilizations.map(civ => ({
                id: civ.id,
                power: civ.power,
                rank: civilizations.indexOf(civ) + 1
            }))
        };
    }

    analyzeAllianceStructure() {
        const alliances = [];
        const isolatedCivs = [];
        
        // Analyze existing alliance networks
        for (const [allianceId, alliance] of this.galacticState.allianceNetworks) {
            const members = alliance.members || [];
            const strength = this.calculateAllianceStrength(members);
            
            alliances.push({
                id: allianceId,
                members,
                strength,
                cohesion: alliance.cohesion || 0.6,
                purpose: alliance.purpose || 'mutual_defense'
            });
        }
        
        // Identify isolated civilizations
        const alliedCivs = new Set();
        alliances.forEach(alliance => {
            alliance.members.forEach(member => alliedCivs.add(member));
        });
        
        for (const civId of this.galacticState.activeCivilizations.keys()) {
            if (!alliedCivs.has(civId)) {
                isolatedCivs.push(civId);
            }
        }
        
        return {
            alliances,
            isolatedCivs,
            allianceCount: alliances.length,
            averageAllianceSize: alliances.length > 0 ? 
                alliances.reduce((sum, a) => sum + a.members.length, 0) / alliances.length : 0
        };
    }

    calculateAllianceStrength(members) {
        let totalStrength = 0;
        
        members.forEach(memberId => {
            const civ = this.galacticState.activeCivilizations.get(memberId);
            if (civ) {
                totalStrength += civ.power;
            }
        });
        
        return totalStrength;
    }

    analyzeConflictPotential() {
        const conflicts = [];
        const tensions = [];
        
        // Analyze diplomatic tensions
        for (const [relationKey, relation] of this.galacticState.civilizationRelations) {
            if (relation.tension_level > 0.7) {
                const [civ1, civ2] = relationKey.split('-');
                conflicts.push({
                    participants: [civ1, civ2],
                    tensionLevel: relation.tension_level,
                    conflictType: this.determineConflictType(relation),
                    escalationRisk: this.calculateEscalationRisk(relation)
                });
            } else if (relation.tension_level > 0.5) {
                const [civ1, civ2] = relationKey.split('-');
                tensions.push({
                    participants: [civ1, civ2],
                    tensionLevel: relation.tension_level,
                    sources: relation.tension_sources || ['territorial_disputes']
                });
            }
        }
        
        return {
            activeConflicts: conflicts,
            diplomaticTensions: tensions,
            overallConflictLevel: this.calculateOverallConflictLevel(conflicts, tensions),
            conflictHotspots: this.identifyConflictHotspots(conflicts)
        };
    }

    determineConflictType(relation) {
        const sources = relation.tension_sources || [];
        
        if (sources.includes('territorial_disputes')) return 'territorial';
        if (sources.includes('resource_competition')) return 'economic';
        if (sources.includes('ideological_differences')) return 'ideological';
        if (sources.includes('trade_disputes')) return 'commercial';
        
        return 'general';
    }

    calculateEscalationRisk(relation) {
        let risk = relation.tension_level * 0.5;
        
        // Factors that increase escalation risk
        if (relation.military_buildup > 0.7) risk += 0.2;
        if (relation.diplomatic_communication < 0.3) risk += 0.15;
        if (relation.economic_interdependence < 0.2) risk += 0.1;
        
        return Math.min(1.0, risk);
    }

    calculateOverallConflictLevel(conflicts, tensions) {
        const conflictWeight = 0.8;
        const tensionWeight = 0.4;
        
        const conflictScore = conflicts.reduce((sum, c) => sum + c.tensionLevel, 0) * conflictWeight;
        const tensionScore = tensions.reduce((sum, t) => sum + t.tensionLevel, 0) * tensionWeight;
        
        const totalCivs = this.galacticState.activeCivilizations.size;
        const maxPossibleScore = totalCivs * (totalCivs - 1) / 2; // All possible pairs
        
        return maxPossibleScore > 0 ? (conflictScore + tensionScore) / maxPossibleScore : 0;
    }

    identifyConflictHotspots(conflicts) {
        const hotspots = new Map();
        
        conflicts.forEach(conflict => {
            conflict.participants.forEach(civId => {
                const current = hotspots.get(civId) || 0;
                hotspots.set(civId, current + conflict.tensionLevel);
            });
        });
        
        return Array.from(hotspots.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([civId, tensionSum]) => ({ civId, tensionSum }));
    }

    identifyCooperationOpportunities() {
        const opportunities = [];
        
        // Trade opportunities
        opportunities.push(...this.identifyTradeOpportunities());
        
        // Research collaboration opportunities
        opportunities.push(...this.identifyResearchOpportunities());
        
        // Diplomatic opportunities
        opportunities.push(...this.identifyDiplomaticOpportunities());
        
        // Crisis response opportunities
        opportunities.push(...this.identifyCrisisResponseOpportunities());
        
        return opportunities;
    }

    identifyTradeOpportunities() {
        const opportunities = [];
        
        // Identify complementary economies
        const civilizations = Array.from(this.galacticState.activeCivilizations.values());
        
        for (let i = 0; i < civilizations.length; i++) {
            for (let j = i + 1; j < civilizations.length; j++) {
                const civ1 = civilizations[i];
                const civ2 = civilizations[j];
                
                const relationKey = `${civ1.id}-${civ2.id}`;
                const relation = this.galacticState.civilizationRelations.get(relationKey);
                
                if (relation && relation.tension_level < 0.5) {
                    const tradeCompatibility = this.calculateTradeCompatibility(civ1, civ2);
                    
                    if (tradeCompatibility > 0.6) {
                        opportunities.push({
                            type: 'trade_expansion',
                            participants: [civ1.id, civ2.id],
                            potential: tradeCompatibility,
                            benefits: ['economic_growth', 'diplomatic_improvement'],
                            requirements: ['trade_agreements', 'infrastructure_development']
                        });
                    }
                }
            }
        }
        
        return opportunities;
    }

    calculateTradeCompatibility(civ1, civ2) {
        // Simplified trade compatibility calculation
        const economicDifference = Math.abs(civ1.economicStrength - civ2.economicStrength);
        const techDifference = Math.abs(civ1.technologicalLevel - civ2.technologicalLevel);
        
        // Complementary economies (different strengths) are good for trade
        const complementarity = (economicDifference + techDifference) / 2;
        
        // But not too different (need minimum development)
        const minDevelopment = Math.min(civ1.economicStrength, civ2.economicStrength);
        
        return Math.min(complementarity, minDevelopment);
    }

    identifyResearchOpportunities() {
        const opportunities = [];
        
        // Multi-civilization research projects
        const advancedCivs = Array.from(this.galacticState.activeCivilizations.values())
            .filter(civ => civ.technologicalLevel > 0.6);
        
        if (advancedCivs.length >= 2) {
            opportunities.push({
                type: 'joint_research',
                participants: advancedCivs.map(civ => civ.id),
                potential: 0.8,
                benefits: ['technological_advancement', 'cost_sharing', 'knowledge_exchange'],
                requirements: ['research_agreements', 'intellectual_property_frameworks']
            });
        }
        
        return opportunities;
    }

    identifyDiplomaticOpportunities() {
        const opportunities = [];
        
        // Mediation opportunities
        const conflicts = this.analyzeConflictPotential().activeConflicts;
        
        conflicts.forEach(conflict => {
            const neutralCivs = Array.from(this.galacticState.activeCivilizations.keys())
                .filter(civId => !conflict.participants.includes(civId));
            
            const potentialMediators = neutralCivs.filter(civId => {
                const civ = this.galacticState.activeCivilizations.get(civId);
                return civ && civ.diplomaticInfluence > 0.6;
            });
            
            if (potentialMediators.length > 0) {
                opportunities.push({
                    type: 'conflict_mediation',
                    participants: [...conflict.participants, ...potentialMediators],
                    potential: 0.7,
                    benefits: ['conflict_resolution', 'diplomatic_prestige', 'stability_improvement'],
                    requirements: ['neutral_mediator', 'diplomatic_protocols']
                });
            }
        });
        
        return opportunities;
    }

    identifyCrisisResponseOpportunities() {
        const opportunities = [];
        
        // Galactic crisis response
        if (this.galacticState.galacticThreats.length > 0) {
            const allCivs = Array.from(this.galacticState.activeCivilizations.keys());
            
            opportunities.push({
                type: 'crisis_response_coalition',
                participants: allCivs,
                potential: 0.9,
                benefits: ['threat_mitigation', 'galactic_unity', 'shared_resources'],
                requirements: ['emergency_protocols', 'resource_coordination']
            });
        }
        
        return opportunities;
    }

    analyzeTradeNetworks() {
        const networks = {
            majorRoutes: [],
            tradeVolume: new Map(),
            economicIntegration: 0,
            tradeBlocs: []
        };
        
        // Analyze trade routes
        for (const [routeId, route] of this.galacticState.tradeRoutes) {
            if (route.volume > 0.5) {
                networks.majorRoutes.push({
                    id: routeId,
                    participants: route.participants,
                    volume: route.volume,
                    commodities: route.commodities || ['general_goods']
                });
            }
        }
        
        // Calculate economic integration
        const totalPossibleRoutes = this.galacticState.activeCivilizations.size * 
                                   (this.galacticState.activeCivilizations.size - 1) / 2;
        
        networks.economicIntegration = totalPossibleRoutes > 0 ? 
            networks.majorRoutes.length / totalPossibleRoutes : 0;
        
        return networks;
    }

    analyzeDiplomaticTrends() {
        const trends = {
            cooperationTrend: 0,
            conflictTrend: 0,
            isolationTrend: 0,
            allianceFormationRate: 0
        };
        
        // Analyze recent diplomatic changes
        // This would compare current state with historical data
        // Simplified implementation for now
        
        const totalRelations = this.galacticState.civilizationRelations.size;
        let cooperativeRelations = 0;
        let conflictualRelations = 0;
        
        for (const relation of this.galacticState.civilizationRelations.values()) {
            if (relation.trust_level > 0.6) cooperativeRelations++;
            if (relation.tension_level > 0.6) conflictualRelations++;
        }
        
        trends.cooperationTrend = totalRelations > 0 ? cooperativeRelations / totalRelations : 0;
        trends.conflictTrend = totalRelations > 0 ? conflictualRelations / totalRelations : 0;
        
        return trends;
    }

    async generateCosmicEvents(gameAnalysis, dynamicsAnalysis) {
        const events = [];
        
        // Determine number of events to generate
        const eventCount = Math.floor(Math.random() * 3) + 1; // 1-3 events
        
        for (let i = 0; i < eventCount; i++) {
            const eventType = this.selectEventType(dynamicsAnalysis);
            const event = await this.generateSpecificEvent(eventType, dynamicsAnalysis);
            
            if (event) {
                events.push(event);
            }
        }
        
        return events;
    }

    selectEventType(dynamicsAnalysis) {
        const weights = { ...this.cosmicEventTypes };
        
        // Adjust weights based on galactic conditions
        if (dynamicsAnalysis.conflictPotential.overallConflictLevel > 0.7) {
            weights['galactic_crisis'].frequency *= 2;
            weights['diplomatic_opportunity'].frequency *= 1.5;
        }
        
        if (dynamicsAnalysis.powerBalance.balance === 'stable') {
            weights['resource_discovery'].frequency *= 1.3;
            weights['technological_breakthrough'].frequency *= 1.2;
        }
        
        // Weighted random selection
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w.frequency, 0);
        let random = Math.random() * totalWeight;
        
        for (const [eventType, config] of Object.entries(weights)) {
            random -= config.frequency;
            if (random <= 0) {
                return eventType;
            }
        }
        
        return 'stellar_phenomena'; // Fallback
    }

    async generateSpecificEvent(eventType, dynamicsAnalysis) {
        const baseEvent = {
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: eventType,
            timestamp: Date.now(),
            config: this.cosmicEventTypes[eventType]
        };
        
        switch (eventType) {
            case 'stellar_phenomena':
                return this.generateStellarEvent(baseEvent, dynamicsAnalysis);
            
            case 'resource_discovery':
                return this.generateResourceEvent(baseEvent, dynamicsAnalysis);
            
            case 'galactic_crisis':
                return this.generateCrisisEvent(baseEvent, dynamicsAnalysis);
            
            case 'diplomatic_opportunity':
                return this.generateDiplomaticEvent(baseEvent, dynamicsAnalysis);
            
            case 'technological_breakthrough':
                return this.generateTechEvent(baseEvent, dynamicsAnalysis);
            
            case 'environmental_shift':
                return this.generateEnvironmentalEvent(baseEvent, dynamicsAnalysis);
            
            default:
                return null;
        }
    }

    generateStellarEvent(baseEvent, dynamicsAnalysis) {
        const stellarEvents = [
            'supernova_observation',
            'solar_flare_activity',
            'neutron_star_discovery',
            'black_hole_formation',
            'stellar_alignment'
        ];
        
        const specificEvent = stellarEvents[Math.floor(Math.random() * stellarEvents.length)];
        
        return {
            ...baseEvent,
            title: this.generateEventTitle(specificEvent),
            description: this.generateEventDescription(specificEvent),
            effects: this.generateStellarEffects(specificEvent),
            affectedCivilizations: this.selectAffectedCivilizations('regional'),
            duration: this.calculateEventDuration(baseEvent.config.duration),
            severity: Math.random() * 0.5 + 0.3 // 0.3-0.8
        };
    }

    generateResourceEvent(baseEvent, dynamicsAnalysis) {
        const resources = ['rare_minerals', 'energy_crystals', 'exotic_matter', 'ancient_artifacts'];
        const resource = resources[Math.floor(Math.random() * resources.length)];
        
        return {
            ...baseEvent,
            title: `Discovery of ${resource.replace('_', ' ')}`,
            description: `A significant deposit of ${resource.replace('_', ' ')} has been discovered in a previously unexplored system.`,
            effects: {
                economic_boost: 0.3,
                research_opportunity: 0.4,
                diplomatic_tension: 0.2 // Competition for resources
            },
            affectedCivilizations: this.selectAffectedCivilizations('local'),
            resource: resource,
            location: this.generateLocation(),
            duration: 'permanent',
            severity: 0.7
        };
    }

    generateCrisisEvent(baseEvent, dynamicsAnalysis) {
        const crises = [
            'galactic_plague',
            'cosmic_storm',
            'alien_invasion',
            'dimensional_rift',
            'galactic_war'
        ];
        
        const crisis = crises[Math.floor(Math.random() * crises.length)];
        
        return {
            ...baseEvent,
            title: this.generateEventTitle(crisis),
            description: this.generateEventDescription(crisis),
            effects: this.generateCrisisEffects(crisis),
            affectedCivilizations: this.selectAffectedCivilizations('galactic'),
            duration: this.calculateEventDuration('long'),
            severity: Math.random() * 0.3 + 0.7, // 0.7-1.0
            responseRequired: true,
            cooperationBonus: 0.3 // Bonus for civilizations that cooperate
        };
    }

    generateDiplomaticEvent(baseEvent, dynamicsAnalysis) {
        const opportunities = dynamicsAnalysis.cooperationOpportunities;
        
        if (opportunities.length === 0) {
            return null; // No diplomatic opportunities available
        }
        
        const opportunity = opportunities[Math.floor(Math.random() * opportunities.length)];
        
        return {
            ...baseEvent,
            title: `Diplomatic Opportunity: ${opportunity.type.replace('_', ' ')}`,
            description: `An opportunity has arisen for ${opportunity.participants.join(' and ')} to ${opportunity.type.replace('_', ' ')}.`,
            effects: {
                diplomatic_improvement: 0.4,
                cooperation_bonus: 0.3,
                stability_increase: 0.2
            },
            affectedCivilizations: opportunity.participants,
            duration: this.calculateEventDuration('short'),
            severity: 0.5,
            opportunity: opportunity
        };
    }

    generateTechEvent(baseEvent, dynamicsAnalysis) {
        const technologies = [
            'faster_than_light_communication',
            'quantum_computing_breakthrough',
            'artificial_consciousness',
            'matter_teleportation',
            'time_dilation_technology'
        ];
        
        const tech = technologies[Math.floor(Math.random() * technologies.length)];
        const discoverer = this.selectRandomCivilization();
        
        return {
            ...baseEvent,
            title: `Technological Breakthrough: ${tech.replace(/_/g, ' ')}`,
            description: `${discoverer} has achieved a major breakthrough in ${tech.replace(/_/g, ' ')} technology.`,
            effects: {
                technology_advancement: 0.6,
                economic_advantage: 0.4,
                diplomatic_influence: 0.3
            },
            affectedCivilizations: [discoverer],
            technology: tech,
            duration: 'permanent',
            severity: 0.8,
            sharingOpportunity: true // Can be shared with allies
        };
    }

    generateEnvironmentalEvent(baseEvent, dynamicsAnalysis) {
        const environmentalEvents = [
            'cosmic_radiation_increase',
            'galactic_climate_shift',
            'asteroid_field_formation',
            'nebula_expansion',
            'gravitational_anomaly'
        ];
        
        const envEvent = environmentalEvents[Math.floor(Math.random() * environmentalEvents.length)];
        
        return {
            ...baseEvent,
            title: this.generateEventTitle(envEvent),
            description: this.generateEventDescription(envEvent),
            effects: this.generateEnvironmentalEffects(envEvent),
            affectedCivilizations: this.selectAffectedCivilizations('regional'),
            duration: this.calculateEventDuration('long'),
            severity: Math.random() * 0.4 + 0.4, // 0.4-0.8
            adaptationRequired: true
        };
    }

    generateEventTitle(eventType) {
        const titles = {
            'supernova_observation': 'Spectacular Supernova Illuminates Galaxy',
            'galactic_plague': 'Mysterious Plague Spreads Across Star Systems',
            'cosmic_radiation_increase': 'Cosmic Radiation Levels Rising',
            'faster_than_light_communication': 'FTL Communication Breakthrough'
        };
        
        return titles[eventType] || `Galactic Event: ${eventType.replace(/_/g, ' ')}`;
    }

    generateEventDescription(eventType) {
        const descriptions = {
            'supernova_observation': 'A massive star has exploded in a brilliant supernova, visible across multiple star systems and affecting local space-time.',
            'galactic_plague': 'An unknown pathogen is spreading rapidly between civilizations, threatening galactic stability.',
            'cosmic_radiation_increase': 'Cosmic radiation levels are increasing due to unknown galactic phenomena, affecting all space-faring activities.'
        };
        
        return descriptions[eventType] || `A significant galactic event of type ${eventType} has occurred.`;
    }

    generateStellarEffects(eventType) {
        const effects = {
            'supernova_observation': {
                research_opportunity: 0.5,
                navigation_disruption: 0.3,
                energy_boost: 0.2
            },
            'solar_flare_activity': {
                communication_disruption: 0.4,
                energy_surge: 0.3,
                technology_damage: 0.2
            }
        };
        
        return effects[eventType] || { general_impact: 0.3 };
    }

    generateCrisisEffects(crisisType) {
        const effects = {
            'galactic_plague': {
                population_impact: -0.4,
                economic_disruption: -0.3,
                research_focus_shift: 0.5
            },
            'cosmic_storm': {
                infrastructure_damage: -0.3,
                communication_disruption: -0.4,
                energy_fluctuation: -0.2
            },
            'alien_invasion': {
                military_mobilization: 0.8,
                economic_disruption: -0.5,
                unity_bonus: 0.4
            }
        };
        
        return effects[crisisType] || { general_crisis_impact: -0.4 };
    }

    generateEnvironmentalEffects(eventType) {
        const effects = {
            'cosmic_radiation_increase': {
                health_impact: -0.3,
                technology_adaptation_needed: 0.4,
                space_travel_difficulty: 0.3
            },
            'galactic_climate_shift': {
                environmental_adaptation: 0.5,
                resource_availability_change: 0.3,
                migration_pressure: 0.2
            }
        };
        
        return effects[eventType] || { environmental_impact: 0.3 };
    }

    selectAffectedCivilizations(scope) {
        const allCivs = Array.from(this.galacticState.activeCivilizations.keys());
        
        switch (scope) {
            case 'local':
                return [allCivs[Math.floor(Math.random() * allCivs.length)]];
            
            case 'regional':
                const regionSize = Math.min(3, Math.ceil(allCivs.length / 2));
                return this.shuffleArray(allCivs).slice(0, regionSize);
            
            case 'galactic':
                return allCivs;
            
            case 'bilateral':
                return this.shuffleArray(allCivs).slice(0, 2);
            
            default:
                return allCivs;
        }
    }

    selectRandomCivilization() {
        const civs = Array.from(this.galacticState.activeCivilizations.keys());
        return civs[Math.floor(Math.random() * civs.length)];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateLocation() {
        const sectors = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const system = Math.floor(Math.random() * 100) + 1;
        
        return `${sector} Sector, System ${system}`;
    }

    calculateEventDuration(durationType) {
        const durations = {
            'short': Math.floor(Math.random() * 30) + 15, // 15-45 days
            'medium': Math.floor(Math.random() * 60) + 30, // 30-90 days
            'long': Math.floor(Math.random() * 180) + 90, // 90-270 days
            'permanent': -1 // Permanent effect
        };
        
        return durations[durationType] || durations['medium'];
    }

    async assessGalacticStability(dynamicsAnalysis) {
        const assessment = {
            overallStability: 0,
            stabilityFactors: {
                powerBalance: 0,
                diplomaticStability: 0,
                economicStability: 0,
                environmentalStability: 0
            },
            riskFactors: [],
            stabilizingFactors: []
        };
        
        // Assess power balance stability
        assessment.stabilityFactors.powerBalance = this.assessPowerBalanceStability(dynamicsAnalysis.powerBalance);
        
        // Assess diplomatic stability
        assessment.stabilityFactors.diplomaticStability = this.assessDiplomaticStability(dynamicsAnalysis.conflictPotential);
        
        // Assess economic stability
        assessment.stabilityFactors.economicStability = this.assessEconomicStability(dynamicsAnalysis.tradeNetworks);
        
        // Assess environmental stability
        assessment.stabilityFactors.environmentalStability = this.galacticState.galacticClimate.stability;
        
        // Calculate overall stability
        assessment.overallStability = (
            assessment.stabilityFactors.powerBalance * 0.3 +
            assessment.stabilityFactors.diplomaticStability * 0.3 +
            assessment.stabilityFactors.economicStability * 0.2 +
            assessment.stabilityFactors.environmentalStability * 0.2
        );
        
        // Identify risk and stabilizing factors
        assessment.riskFactors = this.identifyRiskFactors(assessment.stabilityFactors);
        assessment.stabilizingFactors = this.identifyStabilizingFactors(assessment.stabilityFactors);
        
        return assessment;
    }

    assessPowerBalanceStability(powerBalance) {
        switch (powerBalance.balance) {
            case 'stable': return 0.8;
            case 'multipolar': return 0.7;
            case 'dominant': return 0.6;
            case 'hegemonic': return 0.4;
            default: return 0.5;
        }
    }

    assessDiplomaticStability(conflictPotential) {
        return Math.max(0.1, 1 - conflictPotential.overallConflictLevel);
    }

    assessEconomicStability(tradeNetworks) {
        return tradeNetworks.economicIntegration;
    }

    identifyRiskFactors(stabilityFactors) {
        const risks = [];
        
        if (stabilityFactors.powerBalance < 0.5) {
            risks.push({
                type: 'power_imbalance',
                severity: 0.5 - stabilityFactors.powerBalance,
                description: 'Significant power imbalance threatens galactic stability'
            });
        }
        
        if (stabilityFactors.diplomaticStability < 0.4) {
            risks.push({
                type: 'diplomatic_crisis',
                severity: 0.4 - stabilityFactors.diplomaticStability,
                description: 'High levels of inter-civilization conflict'
            });
        }
        
        if (stabilityFactors.economicStability < 0.3) {
            risks.push({
                type: 'economic_fragmentation',
                severity: 0.3 - stabilityFactors.economicStability,
                description: 'Low economic integration increases instability'
            });
        }
        
        return risks;
    }

    identifyStabilizingFactors(stabilityFactors) {
        const factors = [];
        
        if (stabilityFactors.powerBalance > 0.7) {
            factors.push({
                type: 'balanced_power',
                strength: stabilityFactors.powerBalance - 0.7,
                description: 'Well-balanced power distribution promotes stability'
            });
        }
        
        if (stabilityFactors.diplomaticStability > 0.7) {
            factors.push({
                type: 'diplomatic_cooperation',
                strength: stabilityFactors.diplomaticStability - 0.7,
                description: 'Strong diplomatic relations enhance stability'
            });
        }
        
        if (stabilityFactors.economicStability > 0.6) {
            factors.push({
                type: 'economic_integration',
                strength: stabilityFactors.economicStability - 0.6,
                description: 'High economic integration creates stability'
            });
        }
        
        return factors;
    }

    async generateGalacticDecisions(dynamicsAnalysis, cosmicEvents, stabilityAssessment) {
        const decisions = {
            // Inter-civilization system inputs
            galactic_stability_modifier: stabilityAssessment.overallStability,
            inter_civ_cooperation_bonus: this.calculateCooperationBonus(dynamicsAnalysis),
            conflict_escalation_risk: dynamicsAnalysis.conflictPotential.overallConflictLevel,
            
            // Trade system inputs
            galactic_trade_volume_modifier: this.calculateTradeVolumeModifier(dynamicsAnalysis),
            trade_route_stability: this.calculateTradeRouteStability(stabilityAssessment),
            
            // Currency exchange inputs
            exchange_rate_volatility: this.calculateExchangeRateVolatility(stabilityAssessment),
            currency_confidence_modifier: this.calculateCurrencyConfidenceModifier(dynamicsAnalysis),
            
            // Diplomacy system inputs
            diplomatic_climate: this.calculateDiplomaticClimate(dynamicsAnalysis),
            alliance_formation_tendency: this.calculateAllianceFormationTendency(dynamicsAnalysis),
            
            // Migration system inputs
            galactic_migration_pressure: this.calculateMigrationPressure(cosmicEvents),
            inter_civ_migration_openness: this.calculateMigrationOpenness(dynamicsAnalysis),
            
            // News system inputs
            galactic_news_priority: this.calculateGalacticNewsPriority(cosmicEvents),
            inter_civ_information_flow: this.calculateInformationFlow(dynamicsAnalysis),
            
            // Event-specific modifiers
            cosmic_event_impacts: this.generateEventImpacts(cosmicEvents),
            
            // Environmental factors
            galactic_environmental_pressure: this.calculateEnvironmentalPressure(cosmicEvents)
        };
        
        return decisions;
    }

    calculateCooperationBonus(dynamicsAnalysis) {
        const cooperationOpportunities = dynamicsAnalysis.cooperationOpportunities.length;
        const allianceStrength = dynamicsAnalysis.allianceStructure.alliances
            .reduce((sum, alliance) => sum + alliance.strength, 0);
        
        return Math.min(1.0, (cooperationOpportunities * 0.1) + (allianceStrength * 0.2));
    }

    calculateTradeVolumeModifier(dynamicsAnalysis) {
        const economicIntegration = dynamicsAnalysis.tradeNetworks.economicIntegration;
        const conflictLevel = dynamicsAnalysis.conflictPotential.overallConflictLevel;
        
        return Math.max(0.1, economicIntegration - (conflictLevel * 0.5));
    }

    calculateTradeRouteStability(stabilityAssessment) {
        return stabilityAssessment.overallStability;
    }

    calculateExchangeRateVolatility(stabilityAssessment) {
        return Math.max(0.1, 1 - stabilityAssessment.overallStability);
    }

    calculateCurrencyConfidenceModifier(dynamicsAnalysis) {
        const powerBalance = dynamicsAnalysis.powerBalance;
        
        // More stable power balance = higher currency confidence
        switch (powerBalance.balance) {
            case 'stable': return 0.9;
            case 'multipolar': return 0.8;
            case 'dominant': return 0.7;
            case 'hegemonic': return 0.6;
            default: return 0.5;
        }
    }

    calculateDiplomaticClimate(dynamicsAnalysis) {
        const cooperationTrend = dynamicsAnalysis.diplomaticTrends.cooperationTrend;
        const conflictTrend = dynamicsAnalysis.diplomaticTrends.conflictTrend;
        
        return Math.max(0.1, cooperationTrend - conflictTrend + 0.5);
    }

    calculateAllianceFormationTendency(dynamicsAnalysis) {
        const conflictLevel = dynamicsAnalysis.conflictPotential.overallConflictLevel;
        const isolatedCivs = dynamicsAnalysis.allianceStructure.isolatedCivs.length;
        
        // Higher conflict and more isolated civs = higher alliance formation tendency
        return Math.min(1.0, conflictLevel + (isolatedCivs * 0.1));
    }

    calculateMigrationPressure(cosmicEvents) {
        let pressure = 0.3; // Base migration pressure
        
        cosmicEvents.forEach(event => {
            if (event.effects?.population_impact < 0) {
                pressure += Math.abs(event.effects.population_impact) * 0.5;
            }
            
            if (event.effects?.environmental_impact) {
                pressure += event.effects.environmental_impact * 0.3;
            }
        });
        
        return Math.min(1.0, pressure);
    }

    calculateMigrationOpenness(dynamicsAnalysis) {
        const cooperationLevel = dynamicsAnalysis.diplomaticTrends.cooperationTrend;
        const conflictLevel = dynamicsAnalysis.conflictPotential.overallConflictLevel;
        
        return Math.max(0.1, cooperationLevel - (conflictLevel * 0.5));
    }

    calculateGalacticNewsPriority(cosmicEvents) {
        const significantEvents = cosmicEvents.filter(event => event.severity > 0.6).length;
        return Math.min(1.0, 0.3 + (significantEvents * 0.2));
    }

    calculateInformationFlow(dynamicsAnalysis) {
        return dynamicsAnalysis.tradeNetworks.economicIntegration;
    }

    generateEventImpacts(cosmicEvents) {
        const impacts = {};
        
        cosmicEvents.forEach(event => {
            impacts[event.id] = {
                type: event.type,
                severity: event.severity,
                effects: event.effects,
                affectedCivilizations: event.affectedCivilizations,
                duration: event.duration
            };
        });
        
        return impacts;
    }

    calculateEnvironmentalPressure(cosmicEvents) {
        let pressure = this.galacticState.galacticClimate.radiationLevels;
        
        cosmicEvents.forEach(event => {
            if (event.type === 'environmental_shift' || event.type === 'stellar_phenomena') {
                pressure += event.severity * 0.2;
            }
        });
        
        return Math.min(1.0, pressure);
    }

    updateGalacticStateFromDecisions(galacticDecisions, cosmicEvents) {
        // Update galactic climate
        this.galacticState.galacticClimate.stability = galacticDecisions.galactic_stability_modifier;
        
        // Add new events to active events
        cosmicEvents.forEach(event => {
            this.galacticState.activeEvents.push(event);
            this.galacticState.eventHistory.push({
                ...event,
                processedAt: Date.now()
            });
        });
        
        // Clean up expired events
        this.cleanupExpiredEvents();
        
        this.galacticState.lastUpdate = Date.now();
    }

    cleanupExpiredEvents() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        
        this.galacticState.activeEvents = this.galacticState.activeEvents.filter(event => {
            if (event.duration === 'permanent' || event.duration === -1) {
                return true; // Keep permanent events
            }
            
            const eventAge = (now - event.timestamp) / dayInMs;
            return eventAge < event.duration;
        });
    }

    generateFallbackResponse() {
        return {
            decisions: {
                galactic_stability_modifier: 0.7,
                inter_civ_cooperation_bonus: 0.5,
                conflict_escalation_risk: 0.3,
                galactic_trade_volume_modifier: 0.6,
                trade_route_stability: 0.7,
                exchange_rate_volatility: 0.3,
                currency_confidence_modifier: 0.6,
                diplomatic_climate: 0.6,
                alliance_formation_tendency: 0.4,
                galactic_migration_pressure: 0.3,
                inter_civ_migration_openness: 0.5,
                galactic_news_priority: 0.4,
                inter_civ_information_flow: 0.6,
                cosmic_event_impacts: {},
                galactic_environmental_pressure: 0.4
            },
            events: [],
            stability: {
                overallStability: 0.7,
                stabilityFactors: {
                    powerBalance: 0.7,
                    diplomaticStability: 0.6,
                    economicStability: 0.6,
                    environmentalStability: 0.7
                },
                riskFactors: [],
                stabilizingFactors: []
            }
        };
    }

    // Status and monitoring
    getSystemStatus() {
        return {
            systemId: this.systemId,
            gameId: this.gameId,
            activeCivilizations: this.galacticState.activeCivilizations.size,
            activeEvents: this.galacticState.activeEvents.length,
            galacticStability: this.galacticState.galacticClimate.stability,
            overallConflictLevel: this.calculateCurrentConflictLevel(),
            lastUpdate: this.galacticState.lastUpdate
        };
    }

    calculateCurrentConflictLevel() {
        let totalTension = 0;
        let relationCount = 0;
        
        for (const relation of this.galacticState.civilizationRelations.values()) {
            totalTension += relation.tension_level || 0;
            relationCount++;
        }
        
        return relationCount > 0 ? totalTension / relationCount : 0;
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
        this.galacticState.activeCivilizations.clear();
        this.galacticState.civilizationRelations.clear();
        this.galacticState.powerBalance.clear();
        this.galacticState.allianceNetworks.clear();
        this.galacticState.galacticMarkets.clear();
        this.galacticState.currencyExchangeRates.clear();
        this.galacticState.tradeRoutes.clear();
        this.galacticState.resourceDistribution.clear();
        this.galacticState.diplomaticTensions.clear();
        this.galacticState.activeEvents = [];
        this.galacticState.eventHistory = [];
        this.galacticState.spatialAnomalies = [];
        this.galacticState.conflictZones = [];
        this.galacticState.galacticThreats = [];
        this.galacticState.emergingCrises = [];
        
        console.log(`🌌 Galactic AI destroyed for ${this.gameId}`);
    }
}

module.exports = { GalacticAI };
