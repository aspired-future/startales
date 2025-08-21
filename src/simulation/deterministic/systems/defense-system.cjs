// Defense System - Defense policy, strategic planning, and national security coordination
// Provides comprehensive defense policy capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class DefenseSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('defense-system', config);
        
        // System state
        this.state = {
            // Defense Policy Framework
            defensePolicy: {
                strategic_doctrine: 'defensive_deterrence',
                threat_assessment_level: 0.4,
                defense_spending_ratio: 0.025, // 2.5% of GDP
                international_engagement_level: 0.6,
                technology_modernization_priority: 0.7
            },
            
            // Strategic Planning
            strategicPlanning: {
                defense_strategy_review_cycle: 4, // years
                force_structure_planning: {
                    active_force_target: 50000,
                    reserve_force_target: 25000,
                    civilian_support_target: 15000
                },
                capability_development_priorities: {
                    air_superiority: 0.8,
                    naval_defense: 0.7,
                    ground_forces: 0.75,
                    cyber_warfare: 0.9,
                    space_operations: 0.6,
                    special_operations: 0.8
                }
            },
            
            // Threat Assessment
            threatAssessment: {
                primary_threats: new Map(),
                threat_matrix: {
                    conventional_military: 0.3,
                    cyber_attacks: 0.7,
                    terrorism: 0.4,
                    economic_warfare: 0.5,
                    space_threats: 0.3,
                    hybrid_warfare: 0.6
                },
                intelligence_confidence_levels: {
                    strategic: 0.8,
                    operational: 0.7,
                    tactical: 0.6
                }
            },
            
            // Defense Capabilities
            defenseCapabilities: {
                deterrence_effectiveness: 0.7,
                response_readiness: 0.75,
                alliance_interoperability: 0.6,
                technological_superiority: 0.65,
                strategic_mobility: 0.6,
                force_protection: 0.8
            },
            
            // International Defense Relations
            internationalRelations: {
                defense_partnerships: 12,
                mutual_defense_treaties: 3,
                joint_training_programs: 8,
                intelligence_sharing_agreements: 6,
                arms_trade_relationships: 15,
                peacekeeping_commitments: 2
            },
            
            // Defense Industrial Base
            defenseIndustrial: {
                domestic_production_capacity: 0.7,
                supply_chain_resilience: 0.6,
                research_development_investment: 0.12, // 12% of defense budget
                critical_technology_dependencies: {
                    semiconductors: 0.4, // 40% foreign dependence
                    rare_earth_materials: 0.6,
                    advanced_manufacturing: 0.3,
                    software_systems: 0.2
                }
            },
            
            // Crisis Management
            crisisManagement: {
                response_protocols: {
                    natural_disasters: 'active',
                    terrorist_incidents: 'active',
                    cyber_attacks: 'active',
                    foreign_aggression: 'active',
                    humanitarian_crises: 'limited'
                },
                escalation_procedures: {
                    alert_levels: ['green', 'yellow', 'orange', 'red'],
                    current_alert_level: 'green',
                    decision_making_speed: 0.8
                },
                civil_military_coordination: 0.7
            },
            
            // Defense Innovation
            defenseInnovation: {
                emerging_technology_adoption: 0.6,
                innovation_partnerships: 25,
                technology_transfer_programs: 8,
                startup_engagement: 0.5,
                academic_collaborations: 15
            },
            
            // Resource Management
            resourceManagement: {
                budget_allocation: {
                    personnel: 0.4,
                    operations_maintenance: 0.25,
                    procurement: 0.2,
                    research_development: 0.12,
                    infrastructure: 0.03
                },
                resource_efficiency: 0.75,
                cost_effectiveness_index: 0.7
            },
            
            // Performance Metrics
            performanceMetrics: {
                strategic_objective_achievement: 0.75,
                operational_readiness: 0.8,
                alliance_satisfaction: 0.7,
                public_confidence: 0.65,
                parliamentary_support: 0.7
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('defense_spending_level', 'float', 0.025, 
            'Defense spending as percentage of GDP', 0.015, 0.05);
        
        this.addInputKnob('strategic_posture', 'string', 'defensive_deterrence', 
            'Overall strategic defense posture: defensive_deterrence, forward_defense, power_projection');
        
        this.addInputKnob('threat_response_aggressiveness', 'float', 0.6, 
            'Aggressiveness of threat response and military posture', 0.0, 1.0);
        
        this.addInputKnob('international_cooperation_emphasis', 'float', 0.6, 
            'Emphasis on international defense cooperation and alliances', 0.0, 1.0);
        
        this.addInputKnob('technology_investment_priority', 'float', 0.7, 
            'Priority given to defense technology and modernization', 0.0, 1.0);
        
        this.addInputKnob('domestic_industry_preference', 'float', 0.7, 
            'Preference for domestic defense industrial base', 0.0, 1.0);
        
        this.addInputKnob('force_structure_emphasis', 'object', {
            conventional_forces: 0.4, special_operations: 0.2, cyber_capabilities: 0.2, 
            space_operations: 0.1, intelligence: 0.1
        }, 'Emphasis allocation across different force structures');
        
        this.addInputKnob('crisis_response_readiness', 'float', 0.8, 
            'Level of crisis response readiness and preparedness', 0.0, 1.0);
        
        this.addInputKnob('defense_transparency_level', 'float', 0.4, 
            'Level of defense policy transparency and public disclosure', 0.0, 1.0);
        
        this.addInputKnob('innovation_openness', 'float', 0.6, 
            'Openness to defense innovation and emerging technologies', 0.0, 1.0);
        
        this.addInputKnob('civil_military_integration', 'float', 0.7, 
            'Level of civil-military coordination and integration', 0.0, 1.0);
        
        this.addInputKnob('peacekeeping_commitment_level', 'float', 0.3, 
            'Level of commitment to international peacekeeping operations', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('defense_policy_status', 'object', 
            'Current defense policy framework and strategic direction');
        
        this.addOutputChannel('strategic_assessment', 'object', 
            'Strategic threat assessment and capability analysis');
        
        this.addOutputChannel('force_readiness', 'object', 
            'Military force readiness and capability status');
        
        this.addOutputChannel('international_defense_relations', 'object', 
            'Defense partnerships and international cooperation status');
        
        this.addOutputChannel('defense_industrial_status', 'object', 
            'Defense industrial base health and capabilities');
        
        this.addOutputChannel('crisis_preparedness', 'object', 
            'Crisis management capabilities and response readiness');
        
        this.addOutputChannel('defense_innovation_metrics', 'object', 
            'Defense innovation and technology development status');
        
        this.addOutputChannel('defense_resource_analysis', 'object', 
            'Defense resource allocation and efficiency metrics');
        
        console.log('🛡️ Defense System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update defense policy based on AI inputs
            this.updateDefensePolicy(aiInputs);
            
            // Process strategic planning
            this.processStrategicPlanning(aiInputs);
            
            // Update threat assessment
            this.updateThreatAssessment(gameState, aiInputs);
            
            // Update defense capabilities
            this.updateDefenseCapabilities(gameState, aiInputs);
            
            // Process international relations
            this.processInternationalRelations(aiInputs);
            
            // Update defense industrial base
            this.updateDefenseIndustrial(aiInputs);
            
            // Process crisis management
            this.processCrisisManagement(gameState, aiInputs);
            
            // Update defense innovation
            this.updateDefenseInnovation(aiInputs);
            
            // Manage resources
            this.manageResources(aiInputs);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🛡️ Defense System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateDefensePolicy(aiInputs) {
        const spendingLevel = aiInputs.defense_spending_level || 0.025;
        const strategicPosture = aiInputs.strategic_posture || 'defensive_deterrence';
        const threatAggressiveness = aiInputs.threat_response_aggressiveness || 0.6;
        const techPriority = aiInputs.technology_investment_priority || 0.7;
        
        // Update defense policy framework
        this.state.defensePolicy.defense_spending_ratio = spendingLevel;
        this.state.defensePolicy.strategic_doctrine = strategicPosture;
        this.state.defensePolicy.threat_assessment_level = threatAggressiveness;
        this.state.defensePolicy.technology_modernization_priority = techPriority;
        
        // Adjust international engagement based on posture
        switch (strategicPosture) {
            case 'power_projection':
                this.state.defensePolicy.international_engagement_level = Math.min(1.0, 
                    this.state.defensePolicy.international_engagement_level + 0.1);
                break;
            case 'forward_defense':
                this.state.defensePolicy.international_engagement_level = 0.7;
                break;
            case 'defensive_deterrence':
            default:
                this.state.defensePolicy.international_engagement_level = 0.6;
                break;
        }
    }

    processStrategicPlanning(aiInputs) {
        const forceEmphasis = aiInputs.force_structure_emphasis || {};
        const cooperationEmphasis = aiInputs.international_cooperation_emphasis || 0.6;
        
        // Update capability development priorities
        const capabilities = this.state.strategicPlanning.capability_development_priorities;
        
        if (forceEmphasis.cyber_capabilities > 0.3) {
            capabilities.cyber_warfare = Math.min(1.0, capabilities.cyber_warfare + 0.1);
        }
        
        if (forceEmphasis.space_operations > 0.15) {
            capabilities.space_operations = Math.min(1.0, capabilities.space_operations + 0.1);
        }
        
        if (forceEmphasis.special_operations > 0.25) {
            capabilities.special_operations = Math.min(1.0, capabilities.special_operations + 0.05);
        }
        
        // Update force structure targets based on strategic posture
        const planning = this.state.strategicPlanning.force_structure_planning;
        const posture = this.state.defensePolicy.strategic_doctrine;
        
        switch (posture) {
            case 'power_projection':
                planning.active_force_target = 60000;
                planning.reserve_force_target = 20000;
                break;
            case 'forward_defense':
                planning.active_force_target = 55000;
                planning.reserve_force_target = 25000;
                break;
            case 'defensive_deterrence':
            default:
                planning.active_force_target = 50000;
                planning.reserve_force_target = 30000;
                break;
        }
        
        // Update alliance interoperability based on cooperation emphasis
        this.state.defenseCapabilities.alliance_interoperability = Math.min(1.0, 
            0.4 + cooperationEmphasis * 0.5);
    }

    updateThreatAssessment(gameState, aiInputs) {
        const threatAggressiveness = aiInputs.threat_response_aggressiveness || 0.6;
        
        // Update threat matrix based on game state
        if (gameState.diplomaticTensions) {
            Object.entries(gameState.diplomaticTensions).forEach(([country, tension]) => {
                if (tension > 0.7) {
                    this.state.threatAssessment.threat_matrix.conventional_military = Math.min(1.0, 
                        this.state.threatAssessment.threat_matrix.conventional_military + 0.1);
                }
            });
        }
        
        // Update cyber threat level based on technology advancement
        if (gameState.technologyMetrics) {
            const cyberTechLevel = gameState.technologyMetrics.cybersecurity_level || 0.5;
            this.state.threatAssessment.threat_matrix.cyber_attacks = Math.min(1.0, 
                0.5 + (1 - cyberTechLevel) * 0.4);
        }
        
        // Process primary threats
        this.updatePrimaryThreats(gameState, threatAggressiveness);
        
        // Update intelligence confidence based on capabilities
        this.updateIntelligenceConfidence(gameState);
    }

    updatePrimaryThreats(gameState, aggressiveness) {
        this.state.threatAssessment.primary_threats.clear();
        
        // Conventional military threats
        if (gameState.militaryThreats) {
            gameState.militaryThreats.forEach(threat => {
                this.state.threatAssessment.primary_threats.set(threat.id, {
                    type: 'conventional_military',
                    severity: threat.severity,
                    probability: threat.probability,
                    response_posture: aggressiveness > 0.7 ? 'aggressive' : 'defensive',
                    countermeasures: this.generateCountermeasures(threat, aggressiveness)
                });
            });
        }
        
        // Cyber threats
        this.state.threatAssessment.primary_threats.set('cyber_general', {
            type: 'cyber_attacks',
            severity: this.state.threatAssessment.threat_matrix.cyber_attacks,
            probability: 0.8,
            response_posture: 'active_defense',
            countermeasures: ['cyber_defense_enhancement', 'attribution_capabilities', 'response_protocols']
        });
        
        // Terrorism threats
        if (gameState.securityThreats) {
            const terrorismLevel = gameState.securityThreats.terrorism_level || 0.3;
            this.state.threatAssessment.primary_threats.set('terrorism_general', {
                type: 'terrorism',
                severity: terrorismLevel,
                probability: 0.6,
                response_posture: 'preventive',
                countermeasures: ['intelligence_gathering', 'border_security', 'counter_terrorism_ops']
            });
        }
    }

    generateCountermeasures(threat, aggressiveness) {
        const countermeasures = [];
        
        // Base countermeasures
        countermeasures.push('intelligence_monitoring', 'diplomatic_engagement');
        
        // Aggressive posture countermeasures
        if (aggressiveness > 0.7) {
            countermeasures.push('forward_deployment', 'preemptive_capabilities', 'deterrent_demonstration');
        } else if (aggressiveness > 0.4) {
            countermeasures.push('defensive_positioning', 'alliance_coordination');
        } else {
            countermeasures.push('diplomatic_resolution', 'multilateral_engagement');
        }
        
        // Threat-specific countermeasures
        switch (threat.type) {
            case 'naval_threat':
                countermeasures.push('naval_patrols', 'maritime_surveillance');
                break;
            case 'air_threat':
                countermeasures.push('air_defense_systems', 'fighter_readiness');
                break;
            case 'ground_threat':
                countermeasures.push('border_reinforcement', 'rapid_response_forces');
                break;
        }
        
        return countermeasures;
    }

    updateIntelligenceConfidence(gameState) {
        const confidence = this.state.threatAssessment.intelligence_confidence_levels;
        
        // Base confidence on intelligence capabilities
        if (gameState.intelligenceCapabilities) {
            const intelCap = gameState.intelligenceCapabilities;
            
            confidence.strategic = Math.min(1.0, 0.6 + intelCap.strategic_intelligence * 0.3);
            confidence.operational = Math.min(1.0, 0.5 + intelCap.operational_intelligence * 0.4);
            confidence.tactical = Math.min(1.0, 0.4 + intelCap.tactical_intelligence * 0.5);
        }
        
        // International cooperation boosts confidence
        const cooperation = this.state.defensePolicy.international_engagement_level;
        if (cooperation > 0.7) {
            Object.keys(confidence).forEach(level => {
                confidence[level] = Math.min(1.0, confidence[level] + 0.1);
            });
        }
    }

    updateDefenseCapabilities(gameState, aiInputs) {
        const techPriority = aiInputs.technology_investment_priority || 0.7;
        const crisisReadiness = aiInputs.crisis_response_readiness || 0.8;
        const cooperationEmphasis = aiInputs.international_cooperation_emphasis || 0.6;
        
        const capabilities = this.state.defenseCapabilities;
        
        // Update technological superiority
        capabilities.technological_superiority = Math.min(1.0, 
            0.4 + techPriority * 0.5);
        
        // Update response readiness
        capabilities.response_readiness = Math.min(1.0, 
            0.5 + crisisReadiness * 0.4);
        
        // Update alliance interoperability
        capabilities.alliance_interoperability = Math.min(1.0, 
            0.3 + cooperationEmphasis * 0.6);
        
        // Update deterrence effectiveness based on multiple factors
        const deterrenceFactors = [
            capabilities.technological_superiority,
            capabilities.alliance_interoperability,
            capabilities.response_readiness
        ];
        
        capabilities.deterrence_effectiveness = deterrenceFactors.reduce((sum, factor) => 
            sum + factor, 0) / deterrenceFactors.length;
        
        // Update strategic mobility based on force structure
        const forceEmphasis = aiInputs.force_structure_emphasis || {};
        if (forceEmphasis.special_operations > 0.2) {
            capabilities.strategic_mobility = Math.min(1.0, capabilities.strategic_mobility + 0.1);
        }
        
        // Update force protection based on threat level
        const threatLevel = this.state.defensePolicy.threat_assessment_level;
        capabilities.force_protection = Math.min(1.0, 0.6 + threatLevel * 0.3);
    }

    processInternationalRelations(aiInputs) {
        const cooperationEmphasis = aiInputs.international_cooperation_emphasis || 0.6;
        const peacekeepingCommitment = aiInputs.peacekeeping_commitment_level || 0.3;
        
        const relations = this.state.internationalRelations;
        
        // Update defense partnerships
        relations.defense_partnerships = Math.floor(8 + cooperationEmphasis * 12);
        
        // Update mutual defense treaties
        if (cooperationEmphasis > 0.8) {
            relations.mutual_defense_treaties = Math.min(5, relations.mutual_defense_treaties + 1);
        } else if (cooperationEmphasis < 0.4) {
            relations.mutual_defense_treaties = Math.max(1, relations.mutual_defense_treaties - 1);
        }
        
        // Update joint training programs
        relations.joint_training_programs = Math.floor(4 + cooperationEmphasis * 8);
        
        // Update intelligence sharing agreements
        relations.intelligence_sharing_agreements = Math.floor(3 + cooperationEmphasis * 6);
        
        // Update peacekeeping commitments
        relations.peacekeeping_commitments = Math.floor(peacekeepingCommitment * 5);
        
        // Update arms trade relationships
        relations.arms_trade_relationships = Math.floor(10 + cooperationEmphasis * 10);
    }

    updateDefenseIndustrial(aiInputs) {
        const domesticPreference = aiInputs.domestic_industry_preference || 0.7;
        const techPriority = aiInputs.technology_investment_priority || 0.7;
        const innovationOpenness = aiInputs.innovation_openness || 0.6;
        
        const industrial = this.state.defenseIndustrial;
        
        // Update domestic production capacity
        industrial.domestic_production_capacity = Math.min(1.0, 
            0.5 + domesticPreference * 0.4);
        
        // Update supply chain resilience
        industrial.supply_chain_resilience = Math.min(1.0, 
            0.4 + domesticPreference * 0.3 + innovationOpenness * 0.2);
        
        // Update R&D investment
        industrial.research_development_investment = Math.min(0.2, 
            0.08 + techPriority * 0.1);
        
        // Update critical technology dependencies
        const dependencies = industrial.critical_technology_dependencies;
        
        if (domesticPreference > 0.8) {
            // Reduce dependencies with high domestic preference
            Object.keys(dependencies).forEach(tech => {
                dependencies[tech] = Math.max(0.1, dependencies[tech] - 0.05);
            });
        }
        
        if (innovationOpenness > 0.7) {
            // Improve advanced manufacturing and software with innovation
            dependencies.advanced_manufacturing = Math.max(0.1, 
                dependencies.advanced_manufacturing - 0.1);
            dependencies.software_systems = Math.max(0.1, 
                dependencies.software_systems - 0.1);
        }
    }

    processCrisisManagement(gameState, aiInputs) {
        const crisisReadiness = aiInputs.crisis_response_readiness || 0.8;
        const civilMilitaryIntegration = aiInputs.civil_military_integration || 0.7;
        
        const crisis = this.state.crisisManagement;
        
        // Update decision making speed
        crisis.escalation_procedures.decision_making_speed = Math.min(1.0, 
            0.5 + crisisReadiness * 0.4);
        
        // Update civil-military coordination
        crisis.civil_military_coordination = civilMilitaryIntegration;
        
        // Update alert level based on threat assessment
        const threatLevel = this.calculateOverallThreatLevel();
        
        if (threatLevel > 0.8) {
            crisis.escalation_procedures.current_alert_level = 'red';
        } else if (threatLevel > 0.6) {
            crisis.escalation_procedures.current_alert_level = 'orange';
        } else if (threatLevel > 0.4) {
            crisis.escalation_procedures.current_alert_level = 'yellow';
        } else {
            crisis.escalation_procedures.current_alert_level = 'green';
        }
        
        // Process active crises from game state
        if (gameState.activeCrises) {
            this.processActiveCrises(gameState.activeCrises, crisisReadiness);
        }
    }

    calculateOverallThreatLevel() {
        const threats = Object.values(this.state.threatAssessment.threat_matrix);
        return threats.reduce((sum, threat) => sum + threat, 0) / threats.length;
    }

    processActiveCrises(crises, readiness) {
        crises.forEach(crisis => {
            const responseProtocol = this.state.crisisManagement.response_protocols[crisis.type];
            
            if (responseProtocol === 'active') {
                // High readiness improves crisis response
                const responseEffectiveness = 0.5 + readiness * 0.4;
                
                // Log crisis response (would trigger actual response in full system)
                console.log(`🛡️ Defense System responding to ${crisis.type} with ${responseEffectiveness.toFixed(2)} effectiveness`);
            }
        });
    }

    updateDefenseInnovation(aiInputs) {
        const innovationOpenness = aiInputs.innovation_openness || 0.6;
        const techPriority = aiInputs.technology_investment_priority || 0.7;
        const cooperationEmphasis = aiInputs.international_cooperation_emphasis || 0.6;
        
        const innovation = this.state.defenseInnovation;
        
        // Update emerging technology adoption
        innovation.emerging_technology_adoption = Math.min(1.0, 
            0.3 + innovationOpenness * 0.5 + techPriority * 0.2);
        
        // Update innovation partnerships
        innovation.innovation_partnerships = Math.floor(15 + innovationOpenness * 20);
        
        // Update technology transfer programs
        innovation.technology_transfer_programs = Math.floor(4 + cooperationEmphasis * 8);
        
        // Update startup engagement
        innovation.startup_engagement = Math.min(1.0, 
            0.2 + innovationOpenness * 0.6);
        
        // Update academic collaborations
        innovation.academic_collaborations = Math.floor(8 + innovationOpenness * 15);
    }

    manageResources(aiInputs) {
        const spendingLevel = aiInputs.defense_spending_level || 0.025;
        const forceEmphasis = aiInputs.force_structure_emphasis || {};
        
        const resources = this.state.resourceManagement;
        
        // Update budget allocation based on force emphasis
        if (Object.keys(forceEmphasis).length > 0) {
            // Adjust procurement based on technology emphasis
            if (forceEmphasis.cyber_capabilities > 0.25) {
                resources.budget_allocation.procurement += 0.02;
                resources.budget_allocation.research_development += 0.01;
            }
            
            // Adjust personnel costs based on special operations emphasis
            if (forceEmphasis.special_operations > 0.2) {
                resources.budget_allocation.personnel += 0.02;
            }
        }
        
        // Normalize budget allocation
        const totalAllocation = Object.values(resources.budget_allocation)
            .reduce((sum, val) => sum + val, 0);
        
        if (totalAllocation > 1.0) {
            Object.keys(resources.budget_allocation).forEach(category => {
                resources.budget_allocation[category] /= totalAllocation;
            });
        }
        
        // Update resource efficiency based on spending level
        resources.resource_efficiency = Math.min(1.0, 
            0.6 + (spendingLevel - 0.02) * 10); // Efficiency improves with adequate spending
        
        // Update cost effectiveness
        resources.cost_effectiveness_index = Math.min(1.0, 
            resources.resource_efficiency * 0.8 + 
            this.state.defenseIndustrial.domestic_production_capacity * 0.2);
    }

    calculatePerformanceMetrics(gameState) {
        const metrics = this.state.performanceMetrics;
        
        // Strategic objective achievement
        const capabilityAverage = Object.values(this.state.defenseCapabilities)
            .reduce((sum, cap) => sum + cap, 0) / 
            Object.keys(this.state.defenseCapabilities).length;
        
        metrics.strategic_objective_achievement = capabilityAverage;
        
        // Operational readiness
        metrics.operational_readiness = this.state.defenseCapabilities.response_readiness;
        
        // Alliance satisfaction
        metrics.alliance_satisfaction = this.state.defenseCapabilities.alliance_interoperability;
        
        // Public confidence (would be influenced by approval ratings in full system)
        if (gameState.approvalRatings) {
            metrics.public_confidence = gameState.approvalRatings.defense_approval || 0.65;
        }
        
        // Parliamentary support (simplified calculation)
        const transparencyLevel = aiInputs.defense_transparency_level || 0.4;
        metrics.parliamentary_support = Math.min(1.0, 
            0.5 + transparencyLevel * 0.3 + metrics.strategic_objective_achievement * 0.2);
    }

    generateOutputs() {
        return {
            defense_policy_status: {
                strategic_doctrine: this.state.defensePolicy.strategic_doctrine,
                defense_spending_ratio: this.state.defensePolicy.defense_spending_ratio,
                threat_assessment_level: this.state.defensePolicy.threat_assessment_level,
                international_engagement_level: this.state.defensePolicy.international_engagement_level,
                technology_modernization_priority: this.state.defensePolicy.technology_modernization_priority,
                policy_coherence: this.assessPolicyCoherence(),
                strategic_direction: this.assessStrategicDirection()
            },
            
            strategic_assessment: {
                threat_matrix: this.state.threatAssessment.threat_matrix,
                primary_threats: Array.from(this.state.threatAssessment.primary_threats.entries()),
                intelligence_confidence: this.state.threatAssessment.intelligence_confidence_levels,
                overall_threat_level: this.calculateOverallThreatLevel(),
                threat_trends: this.analyzeThreatTrends(),
                strategic_challenges: this.identifyStrategicChallenges()
            },
            
            force_readiness: {
                capability_development_priorities: this.state.strategicPlanning.capability_development_priorities,
                force_structure_targets: this.state.strategicPlanning.force_structure_planning,
                defense_capabilities: this.state.defenseCapabilities,
                readiness_assessment: this.assessOverallReadiness(),
                capability_gaps: this.identifyCapabilityGaps(),
                modernization_needs: this.assessModernizationNeeds()
            },
            
            international_defense_relations: {
                partnership_metrics: this.state.internationalRelations,
                cooperation_effectiveness: this.assessCooperationEffectiveness(),
                alliance_strength: this.calculateAllianceStrength(),
                diplomatic_defense_status: this.assessDiplomaticDefenseStatus(),
                international_commitments: this.summarizeInternationalCommitments()
            },
            
            defense_industrial_status: {
                industrial_base_metrics: this.state.defenseIndustrial,
                supply_chain_assessment: this.assessSupplyChainHealth(),
                technology_dependencies: this.analyzeTechnologyDependencies(),
                industrial_capacity_utilization: this.calculateIndustrialUtilization(),
                strategic_autonomy_index: this.calculateStrategicAutonomyIndex()
            },
            
            crisis_preparedness: {
                crisis_management_capabilities: this.state.crisisManagement,
                response_readiness_level: this.assessResponseReadiness(),
                escalation_management: this.assessEscalationManagement(),
                civil_military_coordination_status: this.assessCivilMilitaryCoordination(),
                emergency_response_protocols: this.summarizeEmergencyProtocols()
            },
            
            defense_innovation_metrics: {
                innovation_status: this.state.defenseInnovation,
                technology_adoption_rate: this.calculateTechnologyAdoptionRate(),
                innovation_ecosystem_health: this.assessInnovationEcosystemHealth(),
                research_collaboration_effectiveness: this.assessResearchCollaboration(),
                emerging_technology_readiness: this.assessEmergingTechReadiness()
            },
            
            defense_resource_analysis: {
                resource_management: this.state.resourceManagement,
                budget_efficiency: this.calculateBudgetEfficiency(),
                resource_allocation_optimization: this.assessResourceAllocation(),
                cost_benefit_analysis: this.performCostBenefitAnalysis(),
                investment_priorities: this.identifyInvestmentPriorities()
            }
        };
    }

    assessPolicyCoherence() {
        // Assess how well different policy elements align
        const doctrine = this.state.defensePolicy.strategic_doctrine;
        const engagement = this.state.defensePolicy.international_engagement_level;
        const spending = this.state.defensePolicy.defense_spending_ratio;
        
        let coherence = 0.7; // Base coherence
        
        // Check doctrine-engagement alignment
        if (doctrine === 'power_projection' && engagement > 0.7) coherence += 0.1;
        if (doctrine === 'defensive_deterrence' && engagement < 0.7) coherence += 0.1;
        
        // Check spending-doctrine alignment
        if (doctrine === 'power_projection' && spending > 0.03) coherence += 0.1;
        if (doctrine === 'defensive_deterrence' && spending < 0.035) coherence += 0.1;
        
        return Math.min(1.0, coherence);
    }

    assessStrategicDirection() {
        const doctrine = this.state.defensePolicy.strategic_doctrine;
        const threatLevel = this.calculateOverallThreatLevel();
        const capabilities = this.state.defenseCapabilities.deterrence_effectiveness;
        
        if (threatLevel > 0.7 && capabilities > 0.7) return 'strong_deterrence';
        if (doctrine === 'power_projection') return 'global_engagement';
        if (doctrine === 'forward_defense') return 'regional_security';
        return 'homeland_defense';
    }

    analyzeThreatTrends() {
        // Simplified trend analysis
        const threats = this.state.threatAssessment.threat_matrix;
        
        return {
            increasing_threats: Object.entries(threats)
                .filter(([, level]) => level > 0.6)
                .map(([threat]) => threat),
            emerging_concerns: ['hybrid_warfare', 'cyber_attacks', 'space_threats'],
            declining_threats: Object.entries(threats)
                .filter(([, level]) => level < 0.3)
                .map(([threat]) => threat)
        };
    }

    identifyStrategicChallenges() {
        const challenges = [];
        
        if (this.calculateOverallThreatLevel() > 0.6) {
            challenges.push('elevated_threat_environment');
        }
        
        if (this.state.defenseCapabilities.technological_superiority < 0.6) {
            challenges.push('technology_gap');
        }
        
        if (this.state.defenseIndustrial.supply_chain_resilience < 0.6) {
            challenges.push('supply_chain_vulnerabilities');
        }
        
        if (this.state.defenseCapabilities.alliance_interoperability < 0.6) {
            challenges.push('alliance_coordination_issues');
        }
        
        return challenges;
    }

    assessOverallReadiness() {
        const capabilities = Object.values(this.state.defenseCapabilities);
        const avgCapability = capabilities.reduce((sum, cap) => sum + cap, 0) / capabilities.length;
        
        if (avgCapability > 0.8) return 'high';
        if (avgCapability > 0.6) return 'moderate';
        if (avgCapability > 0.4) return 'limited';
        return 'low';
    }

    identifyCapabilityGaps() {
        const gaps = [];
        const capabilities = this.state.defenseCapabilities;
        
        Object.entries(capabilities).forEach(([capability, level]) => {
            if (level < 0.6) {
                gaps.push({
                    capability,
                    current_level: level,
                    gap_severity: 0.6 - level,
                    priority: level < 0.4 ? 'high' : 'medium'
                });
            }
        });
        
        return gaps.sort((a, b) => b.gap_severity - a.gap_severity);
    }

    assessModernizationNeeds() {
        const techSup = this.state.defenseCapabilities.technological_superiority;
        const modernizationPriority = this.state.defensePolicy.technology_modernization_priority;
        
        return {
            urgency: techSup < 0.5 ? 'high' : techSup < 0.7 ? 'medium' : 'low',
            investment_needed: modernizationPriority,
            key_areas: this.identifyModernizationAreas(),
            timeline: this.estimateModernizationTimeline()
        };
    }

    identifyModernizationAreas() {
        const areas = [];
        const priorities = this.state.strategicPlanning.capability_development_priorities;
        
        Object.entries(priorities).forEach(([area, priority]) => {
            if (priority > 0.7) {
                areas.push(area);
            }
        });
        
        return areas;
    }

    estimateModernizationTimeline() {
        const techSup = this.state.defenseCapabilities.technological_superiority;
        const rdInvestment = this.state.defenseIndustrial.research_development_investment;
        
        // Simple calculation: lower tech superiority and higher R&D = faster modernization
        const yearsNeeded = Math.max(3, 10 - (rdInvestment * 50) - ((1 - techSup) * 5));
        
        return `${Math.round(yearsNeeded)} years`;
    }

    assessCooperationEffectiveness() {
        const relations = this.state.internationalRelations;
        const interoperability = this.state.defenseCapabilities.alliance_interoperability;
        
        const partnershipScore = Math.min(1.0, relations.defense_partnerships / 20);
        const treatyScore = Math.min(1.0, relations.mutual_defense_treaties / 5);
        
        return (partnershipScore + treatyScore + interoperability) / 3;
    }

    calculateAllianceStrength() {
        const relations = this.state.internationalRelations;
        
        const strengthFactors = [
            Math.min(1.0, relations.mutual_defense_treaties / 3),
            Math.min(1.0, relations.joint_training_programs / 10),
            Math.min(1.0, relations.intelligence_sharing_agreements / 8),
            this.state.defenseCapabilities.alliance_interoperability
        ];
        
        return strengthFactors.reduce((sum, factor) => sum + factor, 0) / strengthFactors.length;
    }

    assessDiplomaticDefenseStatus() {
        const engagement = this.state.defensePolicy.international_engagement_level;
        const cooperation = this.assessCooperationEffectiveness();
        
        if (engagement > 0.8 && cooperation > 0.7) return 'strong_multilateral_engagement';
        if (engagement > 0.6 && cooperation > 0.5) return 'active_cooperation';
        if (engagement > 0.4) return 'selective_engagement';
        return 'limited_engagement';
    }

    summarizeInternationalCommitments() {
        const relations = this.state.internationalRelations;
        
        return {
            defense_treaties: relations.mutual_defense_treaties,
            peacekeeping_operations: relations.peacekeeping_commitments,
            training_partnerships: relations.joint_training_programs,
            intelligence_cooperation: relations.intelligence_sharing_agreements,
            commitment_level: this.assessCommitmentLevel()
        };
    }

    assessCommitmentLevel() {
        const relations = this.state.internationalRelations;
        const totalCommitments = relations.mutual_defense_treaties + 
                               relations.peacekeeping_commitments + 
                               relations.joint_training_programs;
        
        if (totalCommitments > 15) return 'high';
        if (totalCommitments > 8) return 'moderate';
        return 'limited';
    }

    assessSupplyChainHealth() {
        const industrial = this.state.defenseIndustrial;
        
        return {
            resilience_level: industrial.supply_chain_resilience,
            domestic_capacity: industrial.domestic_production_capacity,
            vulnerability_assessment: this.assessSupplyChainVulnerabilities(),
            diversification_status: this.assessSupplyChainDiversification()
        };
    }

    assessSupplyChainVulnerabilities() {
        const dependencies = this.state.defenseIndustrial.critical_technology_dependencies;
        const vulnerabilities = [];
        
        Object.entries(dependencies).forEach(([tech, dependence]) => {
            if (dependence > 0.5) {
                vulnerabilities.push({
                    technology: tech,
                    dependence_level: dependence,
                    risk_level: dependence > 0.7 ? 'high' : 'medium'
                });
            }
        });
        
        return vulnerabilities;
    }

    assessSupplyChainDiversification() {
        const dependencies = Object.values(this.state.defenseIndustrial.critical_technology_dependencies);
        const avgDependence = dependencies.reduce((sum, dep) => sum + dep, 0) / dependencies.length;
        
        if (avgDependence < 0.3) return 'well_diversified';
        if (avgDependence < 0.5) return 'moderately_diversified';
        return 'concentrated_risk';
    }

    analyzeTechnologyDependencies() {
        const dependencies = this.state.defenseIndustrial.critical_technology_dependencies;
        
        return {
            critical_dependencies: Object.entries(dependencies)
                .filter(([, level]) => level > 0.6)
                .map(([tech, level]) => ({ technology: tech, dependence: level })),
            strategic_vulnerabilities: this.identifyStrategicVulnerabilities(),
            mitigation_strategies: this.generateMitigationStrategies()
        };
    }

    identifyStrategicVulnerabilities() {
        const dependencies = this.state.defenseIndustrial.critical_technology_dependencies;
        const vulnerabilities = [];
        
        if (dependencies.semiconductors > 0.5) {
            vulnerabilities.push('semiconductor_supply_disruption');
        }
        
        if (dependencies.rare_earth_materials > 0.6) {
            vulnerabilities.push('rare_earth_material_shortage');
        }
        
        if (dependencies.software_systems > 0.4) {
            vulnerabilities.push('software_security_risks');
        }
        
        return vulnerabilities;
    }

    generateMitigationStrategies() {
        const strategies = [];
        const dependencies = this.state.defenseIndustrial.critical_technology_dependencies;
        
        if (dependencies.semiconductors > 0.4) {
            strategies.push('develop_domestic_semiconductor_capacity');
        }
        
        if (dependencies.rare_earth_materials > 0.5) {
            strategies.push('diversify_rare_earth_suppliers');
        }
        
        if (this.state.defenseIndustrial.domestic_production_capacity < 0.7) {
            strategies.push('strengthen_domestic_industrial_base');
        }
        
        return strategies;
    }

    calculateIndustrialUtilization() {
        const capacity = this.state.defenseIndustrial.domestic_production_capacity;
        const spending = this.state.defensePolicy.defense_spending_ratio;
        
        // Higher spending with higher capacity = better utilization
        return Math.min(1.0, capacity * (spending / 0.025) * 0.8);
    }

    calculateStrategicAutonomyIndex() {
        const domesticCapacity = this.state.defenseIndustrial.domestic_production_capacity;
        const supplyChainResilience = this.state.defenseIndustrial.supply_chain_resilience;
        const avgDependence = Object.values(this.state.defenseIndustrial.critical_technology_dependencies)
            .reduce((sum, dep) => sum + dep, 0) / 4;
        
        return (domesticCapacity + supplyChainResilience + (1 - avgDependence)) / 3;
    }

    assessResponseReadiness() {
        const crisis = this.state.crisisManagement;
        
        return {
            decision_speed: crisis.escalation_procedures.decision_making_speed,
            protocol_coverage: Object.keys(crisis.response_protocols).length,
            coordination_level: crisis.civil_military_coordination,
            current_alert_status: crisis.escalation_procedures.current_alert_level,
            overall_readiness: this.calculateCrisisReadiness()
        };
    }

    calculateCrisisReadiness() {
        const crisis = this.state.crisisManagement;
        
        const factors = [
            crisis.escalation_procedures.decision_making_speed,
            crisis.civil_military_coordination,
            this.state.defenseCapabilities.response_readiness
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    assessEscalationManagement() {
        const procedures = this.state.crisisManagement.escalation_procedures;
        
        return {
            alert_system_effectiveness: procedures.decision_making_speed,
            current_posture: procedures.current_alert_level,
            escalation_control: this.assessEscalationControl(),
            de_escalation_capabilities: this.assessDeEscalationCapabilities()
        };
    }

    assessEscalationControl() {
        const decisionSpeed = this.state.crisisManagement.escalation_procedures.decision_making_speed;
        const civilMilCoord = this.state.crisisManagement.civil_military_coordination;
        
        return (decisionSpeed + civilMilCoord) / 2;
    }

    assessDeEscalationCapabilities() {
        const diplomaticEngagement = this.state.defensePolicy.international_engagement_level;
        const allianceInterop = this.state.defenseCapabilities.alliance_interoperability;
        
        return (diplomaticEngagement + allianceInterop) / 2;
    }

    assessCivilMilitaryCoordination() {
        const coordination = this.state.crisisManagement.civil_military_coordination;
        
        return {
            coordination_level: coordination,
            effectiveness: coordination > 0.8 ? 'high' : coordination > 0.6 ? 'moderate' : 'limited',
            integration_areas: this.identifyIntegrationAreas(),
            improvement_needs: coordination < 0.7 ? this.identifyCoordinationImprovements() : []
        };
    }

    identifyIntegrationAreas() {
        return [
            'emergency_response',
            'disaster_relief',
            'border_security',
            'cyber_defense',
            'intelligence_sharing'
        ];
    }

    identifyCoordinationImprovements() {
        return [
            'establish_joint_command_structures',
            'improve_communication_protocols',
            'conduct_regular_coordination_exercises',
            'clarify_roles_and_responsibilities'
        ];
    }

    summarizeEmergencyProtocols() {
        const protocols = this.state.crisisManagement.response_protocols;
        
        return {
            active_protocols: Object.entries(protocols)
                .filter(([, status]) => status === 'active')
                .map(([protocol]) => protocol),
            protocol_coverage: Object.keys(protocols).length,
            activation_readiness: this.calculateProtocolReadiness()
        };
    }

    calculateProtocolReadiness() {
        const activeProtocols = Object.values(this.state.crisisManagement.response_protocols)
            .filter(status => status === 'active').length;
        
        const totalProtocols = Object.keys(this.state.crisisManagement.response_protocols).length;
        
        return activeProtocols / totalProtocols;
    }

    calculateTechnologyAdoptionRate() {
        const adoption = this.state.defenseInnovation.emerging_technology_adoption;
        const partnerships = this.state.defenseInnovation.innovation_partnerships;
        
        return Math.min(1.0, adoption + (partnerships / 50));
    }

    assessInnovationEcosystemHealth() {
        const innovation = this.state.defenseInnovation;
        
        const healthFactors = [
            Math.min(1.0, innovation.innovation_partnerships / 30),
            innovation.startup_engagement,
            Math.min(1.0, innovation.academic_collaborations / 20),
            innovation.emerging_technology_adoption
        ];
        
        return healthFactors.reduce((sum, factor) => sum + factor, 0) / healthFactors.length;
    }

    assessResearchCollaboration() {
        const innovation = this.state.defenseInnovation;
        
        return {
            academic_partnerships: innovation.academic_collaborations,
            technology_transfer_programs: innovation.technology_transfer_programs,
            collaboration_effectiveness: this.calculateCollaborationEffectiveness(),
            research_output_quality: this.assessResearchOutputQuality()
        };
    }

    calculateCollaborationEffectiveness() {
        const innovation = this.state.defenseInnovation;
        
        const factors = [
            Math.min(1.0, innovation.academic_collaborations / 15),
            Math.min(1.0, innovation.technology_transfer_programs / 10),
            innovation.startup_engagement
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    assessResearchOutputQuality() {
        const rdInvestment = this.state.defenseIndustrial.research_development_investment;
        const techAdoption = this.state.defenseInnovation.emerging_technology_adoption;
        
        return (rdInvestment * 5 + techAdoption) / 2; // Normalize R&D investment
    }

    assessEmergingTechReadiness() {
        const adoption = this.state.defenseInnovation.emerging_technology_adoption;
        const techSup = this.state.defenseCapabilities.technological_superiority;
        
        return {
            adoption_rate: adoption,
            technology_maturity: techSup,
            readiness_level: adoption > 0.7 ? 'high' : adoption > 0.5 ? 'moderate' : 'low',
            key_technologies: this.identifyKeyEmergingTechnologies()
        };
    }

    identifyKeyEmergingTechnologies() {
        return [
            'artificial_intelligence',
            'autonomous_systems',
            'quantum_computing',
            'hypersonic_weapons',
            'directed_energy_weapons',
            'advanced_materials'
        ];
    }

    calculateBudgetEfficiency() {
        const resources = this.state.resourceManagement;
        
        return {
            resource_efficiency: resources.resource_efficiency,
            cost_effectiveness: resources.cost_effectiveness_index,
            allocation_optimization: this.assessAllocationOptimization(),
            efficiency_rating: resources.resource_efficiency > 0.8 ? 'high' : 
                             resources.resource_efficiency > 0.6 ? 'moderate' : 'low'
        };
    }

    assessResourceAllocation() {
        const allocation = this.state.resourceManagement.budget_allocation;
        
        return {
            current_allocation: allocation,
            allocation_balance: this.assessAllocationBalance(),
            optimization_opportunities: this.identifyOptimizationOpportunities()
        };
    }

    assessAllocationBalance() {
        const allocation = this.state.resourceManagement.budget_allocation;
        
        // Check if allocation is reasonably balanced
        const values = Object.values(allocation);
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        return {
            balance_ratio: min / max,
            is_balanced: (min / max) > 0.1, // No category should be less than 10% of the largest
            dominant_category: Object.entries(allocation)
                .reduce((max, [cat, val]) => val > max.val ? {cat, val} : max, {cat: '', val: 0}).cat
        };
    }

    assessAllocationOptimization() {
        const efficiency = this.state.resourceManagement.resource_efficiency;
        const costEffectiveness = this.state.resourceManagement.cost_effectiveness_index;
        
        return (efficiency + costEffectiveness) / 2;
    }

    identifyOptimizationOpportunities() {
        const opportunities = [];
        const allocation = this.state.resourceManagement.budget_allocation;
        
        if (allocation.research_development < 0.1) {
            opportunities.push('increase_rd_investment');
        }
        
        if (allocation.personnel > 0.5) {
            opportunities.push('optimize_personnel_costs');
        }
        
        if (this.state.resourceManagement.resource_efficiency < 0.7) {
            opportunities.push('improve_operational_efficiency');
        }
        
        return opportunities;
    }

    performCostBenefitAnalysis() {
        const spending = this.state.defensePolicy.defense_spending_ratio;
        const capabilities = Object.values(this.state.defenseCapabilities)
            .reduce((sum, cap) => sum + cap, 0) / 6;
        
        return {
            spending_level: spending,
            capability_output: capabilities,
            cost_benefit_ratio: capabilities / (spending * 40), // Normalize spending
            investment_efficiency: this.calculateInvestmentEfficiency(),
            value_assessment: this.assessDefenseValue()
        };
    }

    calculateInvestmentEfficiency() {
        const rdInvestment = this.state.defenseIndustrial.research_development_investment;
        const techSup = this.state.defenseCapabilities.technological_superiority;
        
        return techSup / (rdInvestment * 10); // Normalize R&D investment
    }

    assessDefenseValue() {
        const deterrence = this.state.defenseCapabilities.deterrence_effectiveness;
        const readiness = this.state.defenseCapabilities.response_readiness;
        const spending = this.state.defensePolicy.defense_spending_ratio;
        
        const valueScore = (deterrence + readiness) / (spending * 40);
        
        if (valueScore > 1.5) return 'excellent_value';
        if (valueScore > 1.0) return 'good_value';
        if (valueScore > 0.7) return 'adequate_value';
        return 'poor_value';
    }

    identifyInvestmentPriorities() {
        const priorities = [];
        
        // Capability gaps
        const gaps = this.identifyCapabilityGaps();
        gaps.slice(0, 3).forEach(gap => {
            priorities.push({
                area: gap.capability,
                priority: gap.priority,
                investment_type: 'capability_improvement',
                rationale: `Address ${gap.capability} gap`
            });
        });
        
        // Technology modernization
        if (this.state.defenseCapabilities.technological_superiority < 0.6) {
            priorities.push({
                area: 'technology_modernization',
                priority: 'high',
                investment_type: 'modernization',
                rationale: 'Maintain technological edge'
            });
        }
        
        // Industrial base strengthening
        if (this.state.defenseIndustrial.domestic_production_capacity < 0.7) {
            priorities.push({
                area: 'industrial_base',
                priority: 'medium',
                investment_type: 'infrastructure',
                rationale: 'Enhance strategic autonomy'
            });
        }
        
        return priorities;
    }

    generateFallbackOutputs() {
        return {
            defense_policy_status: {
                strategic_doctrine: 'defensive_deterrence',
                defense_spending_ratio: 0.025,
                threat_assessment_level: 0.4,
                policy_coherence: 0.7
            },
            strategic_assessment: {
                overall_threat_level: 0.4,
                threat_trends: { increasing_threats: [], emerging_concerns: [] }
            },
            force_readiness: {
                readiness_assessment: 'moderate',
                capability_gaps: []
            },
            international_defense_relations: {
                cooperation_effectiveness: 0.6,
                alliance_strength: 0.6
            },
            defense_industrial_status: {
                strategic_autonomy_index: 0.6,
                supply_chain_assessment: { resilience_level: 0.6 }
            },
            crisis_preparedness: {
                response_readiness_level: { overall_readiness: 0.7 }
            },
            defense_innovation_metrics: {
                innovation_ecosystem_health: 0.6,
                technology_adoption_rate: 0.6
            },
            defense_resource_analysis: {
                budget_efficiency: { efficiency_rating: 'moderate' },
                investment_priorities: []
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            strategicDoctrine: this.state.defensePolicy.strategic_doctrine,
            overallThreatLevel: this.calculateOverallThreatLevel(),
            defenseReadiness: this.assessOverallReadiness(),
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.defensePolicy.strategic_doctrine = 'defensive_deterrence';
        this.state.defensePolicy.threat_assessment_level = 0.4;
        this.state.crisisManagement.escalation_procedures.current_alert_level = 'green';
        console.log('🛡️ Defense System reset');
    }
}

module.exports = { DefenseSystem };
