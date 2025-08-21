// Military AI - Defense strategy, tactical decisions, and threat assessment
// Provides strategic military intelligence and decision-making for civilization defense

const EventEmitter = require('events');

class MilitaryAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'military-ai';
        this.civilizationId = config.civilizationId;
        
        // Military analysis state
        this.militaryState = {
            // Threat Assessment
            threatLevel: 0.2, // 0-1 scale
            identifiedThreats: [],
            threatSources: new Map(),
            
            // Defense Posture
            defenseReadiness: 0.6,
            militaryDoctrine: 'defensive', // defensive, balanced, aggressive
            strategicPriorities: ['border_security', 'trade_route_protection'],
            
            // Resource Allocation
            budgetAllocation: {
                personnel: 0.4,
                equipment: 0.3,
                research: 0.15,
                intelligence: 0.15
            },
            
            // Intelligence
            intelligenceReports: [],
            reconnaissanceData: new Map(),
            
            // Strategic Planning
            activeStrategies: [],
            contingencyPlans: [],
            
            lastUpdate: Date.now()
        };
        
        // Decision-making context
        this.context = {
            economicConstraints: {},
            diplomaticSituation: {},
            populationMorale: 0.7,
            technologicalCapabilities: {},
            geopoliticalEnvironment: {},
            historicalConflicts: []
        };
        
        // AI processing parameters
        this.processingConfig = {
            analysisDepth: config.analysisDepth || 'medium',
            riskTolerance: config.riskTolerance || 0.3,
            strategicHorizon: config.strategicHorizon || 'medium_term', // short_term, medium_term, long_term
            decisionSpeed: config.decisionSpeed || 'deliberate' // rapid, deliberate, cautious
        };
        
        console.log(`🎖️ Military AI initialized for ${this.civilizationId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update context from game analysis
            this.updateContext(gameAnalysis);
            
            // Perform threat assessment
            const threatAssessment = await this.assessThreats(gameAnalysis);
            
            // Analyze military capabilities
            const capabilityAnalysis = await this.analyzeMilitaryCapabilities(gameAnalysis);
            
            // Generate strategic recommendations
            const strategicDecisions = await this.generateStrategicDecisions(threatAssessment, capabilityAnalysis);
            
            // Update military state
            this.updateMilitaryState(threatAssessment, capabilityAnalysis, strategicDecisions);
            
            // Generate outputs for deterministic systems
            const decisions = this.generateMilitaryDecisions(strategicDecisions);
            
            const processingTime = Date.now() - startTime;
            console.log(`🎖️ Military AI processed in ${processingTime}ms for ${this.civilizationId}`);
            
            this.emit('processingComplete', {
                civilizationId: this.civilizationId,
                decisions,
                threatLevel: this.militaryState.threatLevel,
                processingTime
            });
            
            return decisions;
            
        } catch (error) {
            console.error(`🎖️ Military AI processing error for ${this.civilizationId}:`, error);
            this.emit('processingError', { civilizationId: this.civilizationId, error });
            return this.generateFallbackDecisions();
        }
    }

    updateContext(gameAnalysis) {
        if (gameAnalysis.systemData) {
            // Economic constraints
            if (gameAnalysis.systemData['economic-system']) {
                this.context.economicConstraints = gameAnalysis.systemData['economic-system'];
            }
            
            // Diplomatic situation
            if (gameAnalysis.systemData['diplomacy-system']) {
                this.context.diplomaticSituation = gameAnalysis.systemData['diplomacy-system'];
            }
            
            // Population morale
            if (gameAnalysis.systemData['population-system']) {
                const popData = gameAnalysis.systemData['population-system'];
                this.context.populationMorale = popData.social_stability || 0.7;
            }
            
            // Technology capabilities
            if (gameAnalysis.systemData['technology-system']) {
                this.context.technologicalCapabilities = gameAnalysis.systemData['technology-system'];
            }
        }
        
        // Inter-civilization relations
        if (gameAnalysis.interCivRelations) {
            this.context.geopoliticalEnvironment = gameAnalysis.interCivRelations;
        }
    }

    async assessThreats(gameAnalysis) {
        const threats = {
            external: [],
            internal: [],
            emerging: [],
            overallThreatLevel: 0
        };
        
        try {
            // Analyze diplomatic tensions
            const diplomaticThreats = this.analyzeDiplomaticThreats();
            threats.external.push(...diplomaticThreats);
            
            // Assess economic vulnerabilities
            const economicThreats = this.analyzeEconomicThreats();
            threats.internal.push(...economicThreats);
            
            // Identify emerging threats
            const emergingThreats = this.identifyEmergingThreats(gameAnalysis);
            threats.emerging.push(...emergingThreats);
            
            // Calculate overall threat level
            threats.overallThreatLevel = this.calculateOverallThreatLevel(threats);
            
            // Update threat tracking
            this.updateThreatTracking(threats);
            
        } catch (error) {
            console.error('🎖️ Threat assessment error:', error);
            threats.overallThreatLevel = this.militaryState.threatLevel; // Fallback to current level
        }
        
        return threats;
    }

    analyzeDiplomaticThreats() {
        const threats = [];
        const diplomatic = this.context.diplomaticSituation;
        
        if (diplomatic.diplomatic_relationship_status) {
            Object.entries(diplomatic.diplomatic_relationship_status).forEach(([civId, relationship]) => {
                if (relationship.trust_level < 0.3 || relationship.tension_level > 0.7) {
                    threats.push({
                        type: 'diplomatic_tension',
                        source: civId,
                        severity: Math.max(0.7 - relationship.trust_level, relationship.tension_level - 0.3),
                        description: `Deteriorating relations with ${civId}`,
                        recommendations: ['increase_diplomatic_engagement', 'defensive_preparations']
                    });
                }
            });
        }
        
        return threats;
    }

    analyzeEconomicThreats() {
        const threats = [];
        const economic = this.context.economicConstraints;
        
        // Economic instability as security threat
        if (economic.economic_indicators) {
            const indicators = economic.economic_indicators;
            
            if (indicators.unemployment > 0.15) {
                threats.push({
                    type: 'social_unrest_risk',
                    severity: (indicators.unemployment - 0.15) * 2,
                    description: 'High unemployment may lead to social instability',
                    recommendations: ['increase_internal_security', 'economic_stimulus_support']
                });
            }
            
            if (indicators.inflation > 0.08) {
                threats.push({
                    type: 'economic_instability',
                    severity: (indicators.inflation - 0.08) * 1.5,
                    description: 'High inflation threatens economic security',
                    recommendations: ['economic_policy_coordination', 'strategic_resource_reserves']
                });
            }
        }
        
        return threats;
    }

    identifyEmergingThreats(gameAnalysis) {
        const threats = [];
        
        // Technology gaps
        if (this.context.technologicalCapabilities) {
            const techLevel = this.context.technologicalCapabilities.overall_tech_level || 0.5;
            if (techLevel < 0.4) {
                threats.push({
                    type: 'technology_gap',
                    severity: 0.4 - techLevel,
                    description: 'Technological disadvantage in military capabilities',
                    recommendations: ['increase_research_funding', 'technology_acquisition']
                });
            }
        }
        
        // Resource scarcity
        if (gameAnalysis.globalEvents) {
            gameAnalysis.globalEvents.forEach(event => {
                if (event.type === 'resource_shortage' || event.type === 'supply_disruption') {
                    threats.push({
                        type: 'resource_security',
                        severity: event.impact || 0.3,
                        description: `Resource security threat: ${event.description}`,
                        recommendations: ['secure_supply_lines', 'strategic_stockpiling']
                    });
                }
            });
        }
        
        return threats;
    }

    calculateOverallThreatLevel(threats) {
        let totalThreat = 0;
        let threatCount = 0;
        
        [...threats.external, ...threats.internal, ...threats.emerging].forEach(threat => {
            totalThreat += threat.severity;
            threatCount++;
        });
        
        const averageThreat = threatCount > 0 ? totalThreat / threatCount : 0;
        
        // Apply threat multipliers based on context
        let multiplier = 1.0;
        
        if (this.context.populationMorale < 0.5) multiplier += 0.2;
        if (this.context.economicConstraints.fiscal_balance < -0.05) multiplier += 0.15;
        
        return Math.min(1.0, averageThreat * multiplier);
    }

    updateThreatTracking(threats) {
        this.militaryState.threatLevel = threats.overallThreatLevel;
        this.militaryState.identifiedThreats = [...threats.external, ...threats.internal, ...threats.emerging];
        
        // Update threat sources map
        this.militaryState.identifiedThreats.forEach(threat => {
            if (threat.source) {
                this.militaryState.threatSources.set(threat.source, {
                    severity: threat.severity,
                    type: threat.type,
                    lastUpdated: Date.now()
                });
            }
        });
    }

    async analyzeMilitaryCapabilities(gameAnalysis) {
        const capabilities = {
            personnel: this.assessPersonnelCapabilities(),
            equipment: this.assessEquipmentCapabilities(),
            technology: this.assessTechnologyCapabilities(),
            logistics: this.assessLogisticsCapabilities(),
            intelligence: this.assessIntelligenceCapabilities(),
            overallReadiness: 0
        };
        
        // Calculate overall readiness
        capabilities.overallReadiness = (
            capabilities.personnel.readiness * 0.3 +
            capabilities.equipment.readiness * 0.25 +
            capabilities.technology.readiness * 0.2 +
            capabilities.logistics.readiness * 0.15 +
            capabilities.intelligence.readiness * 0.1
        );
        
        return capabilities;
    }

    assessPersonnelCapabilities() {
        const populationData = this.context.economicConstraints.population_metrics || {};
        const totalPop = populationData.total_population || 1000000;
        
        return {
            readiness: 0.6 + Math.random() * 0.3, // Simplified assessment
            availablePersonnel: Math.floor(totalPop * 0.02), // 2% military service rate
            trainingLevel: 0.7,
            morale: this.context.populationMorale,
            recommendations: this.generatePersonnelRecommendations()
        };
    }

    assessEquipmentCapabilities() {
        const economicData = this.context.economicConstraints;
        const militaryBudget = economicData.government_spending?.defense || 0.05;
        
        return {
            readiness: Math.min(1.0, militaryBudget * 10), // Budget-based assessment
            modernizationLevel: 0.6,
            maintenanceStatus: 0.8,
            procurementNeeds: this.identifyProcurementNeeds(),
            recommendations: this.generateEquipmentRecommendations()
        };
    }

    assessTechnologyCapabilities() {
        const techCapabilities = this.context.technologicalCapabilities;
        const techLevel = techCapabilities.overall_tech_level || 0.5;
        
        return {
            readiness: techLevel,
            researchCapacity: techCapabilities.research_capacity || 0.4,
            innovationRate: techCapabilities.innovation_rate || 0.3,
            technologyGaps: this.identifyTechnologyGaps(),
            recommendations: this.generateTechnologyRecommendations()
        };
    }

    assessLogisticsCapabilities() {
        return {
            readiness: 0.7,
            supplyChainResilience: 0.6,
            mobilityCapacity: 0.8,
            strategicReserves: 0.5,
            recommendations: this.generateLogisticsRecommendations()
        };
    }

    assessIntelligenceCapabilities() {
        return {
            readiness: 0.6,
            collectionCapacity: 0.7,
            analysisCapacity: 0.6,
            counterIntelligence: 0.5,
            recommendations: this.generateIntelligenceRecommendations()
        };
    }

    async generateStrategicDecisions(threatAssessment, capabilityAnalysis) {
        const decisions = {
            defensePosture: this.determineDefensePosture(threatAssessment),
            resourceAllocation: this.optimizeResourceAllocation(threatAssessment, capabilityAnalysis),
            strategicPriorities: this.updateStrategicPriorities(threatAssessment),
            militaryDoctrine: this.evaluateMilitaryDoctrine(threatAssessment, capabilityAnalysis),
            contingencyPlanning: this.developContingencyPlans(threatAssessment),
            cooperationOpportunities: this.identifyCooperationOpportunities()
        };
        
        return decisions;
    }

    determineDefensePosture(threatAssessment) {
        const threatLevel = threatAssessment.overallThreatLevel;
        
        if (threatLevel > 0.8) {
            return {
                posture: 'high_alert',
                readinessLevel: 0.9,
                mobilizationStatus: 'partial',
                recommendations: ['increase_patrols', 'activate_reserves', 'enhance_intelligence']
            };
        } else if (threatLevel > 0.5) {
            return {
                posture: 'elevated',
                readinessLevel: 0.7,
                mobilizationStatus: 'normal',
                recommendations: ['increase_training', 'update_contingency_plans', 'diplomatic_engagement']
            };
        } else {
            return {
                posture: 'normal',
                readinessLevel: 0.6,
                mobilizationStatus: 'peacetime',
                recommendations: ['maintain_training', 'equipment_maintenance', 'international_cooperation']
            };
        }
    }

    optimizeResourceAllocation(threatAssessment, capabilityAnalysis) {
        const allocation = { ...this.militaryState.budgetAllocation };
        const threatLevel = threatAssessment.overallThreatLevel;
        
        // Adjust allocation based on threat level and capability gaps
        if (threatLevel > 0.7) {
            allocation.personnel += 0.1;
            allocation.intelligence += 0.05;
            allocation.equipment += 0.05;
            allocation.research -= 0.2;
        }
        
        // Address capability gaps
        if (capabilityAnalysis.technology.readiness < 0.5) {
            allocation.research += 0.1;
            allocation.equipment -= 0.1;
        }
        
        if (capabilityAnalysis.intelligence.readiness < 0.6) {
            allocation.intelligence += 0.05;
            allocation.personnel -= 0.05;
        }
        
        // Normalize to ensure sum equals 1
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        Object.keys(allocation).forEach(key => {
            allocation[key] = allocation[key] / total;
        });
        
        return allocation;
    }

    updateStrategicPriorities(threatAssessment) {
        const priorities = [];
        
        // Base priorities
        priorities.push('homeland_defense');
        
        // Threat-based priorities
        const externalThreats = threatAssessment.external.length;
        const internalThreats = threatAssessment.internal.length;
        
        if (externalThreats > internalThreats) {
            priorities.push('border_security', 'alliance_building', 'deterrence');
        } else {
            priorities.push('internal_security', 'stability_operations', 'civil_support');
        }
        
        // Economic considerations
        if (this.context.economicConstraints.trade_balance > 0) {
            priorities.push('trade_route_protection');
        }
        
        // Technology gaps
        if (this.context.technologicalCapabilities.overall_tech_level < 0.5) {
            priorities.push('technology_acquisition', 'research_development');
        }
        
        return priorities.slice(0, 5); // Top 5 priorities
    }

    evaluateMilitaryDoctrine(threatAssessment, capabilityAnalysis) {
        const threatLevel = threatAssessment.overallThreatLevel;
        const overallReadiness = capabilityAnalysis.overallReadiness;
        
        if (threatLevel > 0.7 && overallReadiness > 0.7) {
            return {
                doctrine: 'aggressive',
                description: 'High threat, high capability - proactive defense',
                implications: ['forward_deployment', 'preemptive_capabilities', 'power_projection']
            };
        } else if (threatLevel > 0.5) {
            return {
                doctrine: 'balanced',
                description: 'Moderate threat - flexible response capability',
                implications: ['adaptive_defense', 'coalition_building', 'deterrent_posture']
            };
        } else {
            return {
                doctrine: 'defensive',
                description: 'Low threat - focus on homeland defense',
                implications: ['territorial_defense', 'peacekeeping', 'humanitarian_support']
            };
        }
    }

    developContingencyPlans(threatAssessment) {
        const plans = [];
        
        // Develop plans based on identified threats
        threatAssessment.external.forEach(threat => {
            if (threat.severity > 0.5) {
                plans.push({
                    scenario: `External threat from ${threat.source || 'unknown'}`,
                    triggerConditions: [`${threat.type} escalation`, 'diplomatic breakdown'],
                    responseOptions: threat.recommendations || ['defensive_measures'],
                    resourceRequirements: this.estimateResourceRequirements(threat),
                    timeline: 'immediate'
                });
            }
        });
        
        threatAssessment.internal.forEach(threat => {
            if (threat.severity > 0.4) {
                plans.push({
                    scenario: `Internal security threat: ${threat.type}`,
                    triggerConditions: ['civil_unrest', 'economic_collapse'],
                    responseOptions: ['stability_operations', 'emergency_support'],
                    resourceRequirements: this.estimateResourceRequirements(threat),
                    timeline: 'rapid_response'
                });
            }
        });
        
        return plans;
    }

    identifyCooperationOpportunities() {
        const opportunities = [];
        
        // Diplomatic cooperation
        if (this.context.diplomaticSituation.alliance_network_strength > 0.6) {
            opportunities.push({
                type: 'joint_exercises',
                partners: 'allied_civilizations',
                benefits: ['capability_enhancement', 'interoperability', 'cost_sharing'],
                requirements: ['diplomatic_coordination', 'resource_commitment']
            });
        }
        
        // Technology sharing
        if (this.context.technologicalCapabilities.overall_tech_level < 0.6) {
            opportunities.push({
                type: 'technology_cooperation',
                partners: 'advanced_civilizations',
                benefits: ['capability_gap_closure', 'innovation_acceleration'],
                requirements: ['technology_transfer_agreements', 'research_partnerships']
            });
        }
        
        return opportunities;
    }

    generateMilitaryDecisions(strategicDecisions) {
        return {
            // Defense System Inputs
            defense_readiness_level: strategicDecisions.defensePosture.readinessLevel,
            military_budget_allocation: this.convertBudgetAllocation(strategicDecisions.resourceAllocation),
            threat_assessment_level: this.militaryState.threatLevel,
            
            // Security System Inputs
            internal_security_focus: this.calculateInternalSecurityFocus(strategicDecisions),
            border_security_emphasis: this.calculateBorderSecurityEmphasis(strategicDecisions),
            
            // Policy System Inputs
            defense_policy_priority: this.calculateDefensePolicyPriority(strategicDecisions),
            military_cooperation_level: this.calculateCooperationLevel(strategicDecisions),
            
            // Economic System Inputs
            defense_spending_recommendation: this.calculateDefenseSpendingRecommendation(strategicDecisions),
            
            // Diplomatic System Inputs
            military_diplomacy_stance: this.calculateMilitaryDiplomacyStance(strategicDecisions),
            alliance_building_priority: this.calculateAllianceBuildingPriority(strategicDecisions)
        };
    }

    // Helper methods for decision generation
    convertBudgetAllocation(allocation) {
        return {
            personnel: allocation.personnel,
            equipment: allocation.equipment,
            research: allocation.research,
            intelligence: allocation.intelligence
        };
    }

    calculateInternalSecurityFocus(decisions) {
        return decisions.strategicPriorities.includes('internal_security') ? 0.8 : 0.4;
    }

    calculateBorderSecurityEmphasis(decisions) {
        return decisions.strategicPriorities.includes('border_security') ? 0.9 : 0.5;
    }

    calculateDefensePolicyPriority(decisions) {
        const threatLevel = this.militaryState.threatLevel;
        return Math.min(1.0, 0.3 + threatLevel * 0.7);
    }

    calculateCooperationLevel(decisions) {
        return decisions.cooperationOpportunities.length > 0 ? 0.7 : 0.3;
    }

    calculateDefenseSpendingRecommendation(decisions) {
        const baseBudget = 0.05; // 5% of GDP baseline
        const threatMultiplier = 1 + this.militaryState.threatLevel * 0.5;
        return Math.min(0.15, baseBudget * threatMultiplier); // Cap at 15% of GDP
    }

    calculateMilitaryDiplomacyStance(decisions) {
        switch (decisions.militaryDoctrine.doctrine) {
            case 'aggressive': return 0.8;
            case 'balanced': return 0.6;
            case 'defensive': return 0.4;
            default: return 0.5;
        }
    }

    calculateAllianceBuildingPriority(decisions) {
        return decisions.strategicPriorities.includes('alliance_building') ? 0.8 : 0.4;
    }

    // Utility methods for capability assessment
    generatePersonnelRecommendations() {
        return ['enhance_training_programs', 'improve_recruitment', 'boost_morale_initiatives'];
    }

    generateEquipmentRecommendations() {
        return ['modernize_equipment', 'improve_maintenance', 'strategic_procurement'];
    }

    generateTechnologyRecommendations() {
        return ['increase_rd_investment', 'technology_partnerships', 'innovation_programs'];
    }

    generateLogisticsRecommendations() {
        return ['strengthen_supply_chains', 'improve_mobility', 'build_strategic_reserves'];
    }

    generateIntelligenceRecommendations() {
        return ['enhance_collection', 'improve_analysis', 'strengthen_counterintelligence'];
    }

    identifyProcurementNeeds() {
        return ['advanced_defense_systems', 'communication_equipment', 'logistics_vehicles'];
    }

    identifyTechnologyGaps() {
        return ['cyber_defense', 'advanced_sensors', 'autonomous_systems'];
    }

    estimateResourceRequirements(threat) {
        return {
            personnel: Math.ceil(threat.severity * 10000),
            budget: threat.severity * 1000000000,
            timeline: threat.severity > 0.7 ? 'immediate' : 'short_term'
        };
    }

    updateMilitaryState(threatAssessment, capabilityAnalysis, strategicDecisions) {
        this.militaryState.threatLevel = threatAssessment.overallThreatLevel;
        this.militaryState.defenseReadiness = capabilityAnalysis.overallReadiness;
        this.militaryState.militaryDoctrine = strategicDecisions.militaryDoctrine.doctrine;
        this.militaryState.strategicPriorities = strategicDecisions.strategicPriorities;
        this.militaryState.budgetAllocation = strategicDecisions.resourceAllocation;
        this.militaryState.activeStrategies = strategicDecisions.contingencyPlanning;
        this.militaryState.lastUpdate = Date.now();
    }

    generateFallbackDecisions() {
        return {
            defense_readiness_level: 0.6,
            military_budget_allocation: this.militaryState.budgetAllocation,
            threat_assessment_level: this.militaryState.threatLevel,
            internal_security_focus: 0.5,
            border_security_emphasis: 0.5,
            defense_policy_priority: 0.5,
            military_cooperation_level: 0.5,
            defense_spending_recommendation: 0.05,
            military_diplomacy_stance: 0.5,
            alliance_building_priority: 0.5
        };
    }

    // Context management
    addContext(contextData, metadata = {}) {
        if (contextData.economic_indicators) {
            this.context.economicConstraints = contextData.economic_indicators;
        }
        
        if (contextData.diplomatic_status) {
            this.context.diplomaticSituation = contextData.diplomatic_status;
        }
        
        if (contextData.population_morale) {
            this.context.populationMorale = contextData.population_morale;
        }
        
        if (contextData.technology_capabilities) {
            this.context.technologicalCapabilities = contextData.technology_capabilities;
        }
    }

    updateContext(contextData) {
        this.addContext(contextData);
    }

    // Status and monitoring
    getSystemStatus() {
        return {
            systemId: this.systemId,
            civilizationId: this.civilizationId,
            threatLevel: this.militaryState.threatLevel,
            defenseReadiness: this.militaryState.defenseReadiness,
            militaryDoctrine: this.militaryState.militaryDoctrine,
            strategicPriorities: this.militaryState.strategicPriorities,
            lastUpdate: this.militaryState.lastUpdate,
            activeThreats: this.militaryState.identifiedThreats.length,
            contingencyPlans: this.militaryState.activeStrategies.length
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
        this.militaryState.identifiedThreats = [];
        this.militaryState.threatSources.clear();
        this.militaryState.activeStrategies = [];
        this.militaryState.contingencyPlans = [];
        
        console.log(`🎖️ Military AI destroyed for ${this.civilizationId}`);
    }
}

module.exports = { MilitaryAI };
