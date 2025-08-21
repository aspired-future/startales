// State Department System - Foreign policy, diplomatic relations, and international affairs
// Provides comprehensive diplomatic capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class StateSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('state-system', config);
        
        // System state
        this.state = {
            // Foreign Policy Framework
            foreignPolicy: {
                diplomatic_strategy: 'multilateral_engagement',
                international_standing: 0.7,
                soft_power_index: 0.65,
                foreign_aid_commitment: 0.007, // 0.7% of GDP
                trade_openness_level: 0.8,
                human_rights_emphasis: 0.6
            },
            
            // Diplomatic Relations
            diplomaticRelations: {
                embassies: 120,
                consulates: 200,
                diplomatic_staff: 8000,
                foreign_service_officers: 3000,
                cultural_centers: 45,
                trade_missions: 85
            },
            
            // Bilateral Relationships
            bilateralRelations: new Map([
                ['allied_nation_1', { relationship_strength: 0.9, cooperation_level: 0.85, trade_volume: 50000000000 }],
                ['allied_nation_2', { relationship_strength: 0.85, cooperation_level: 0.8, trade_volume: 35000000000 }],
                ['neutral_nation_1', { relationship_strength: 0.6, cooperation_level: 0.5, trade_volume: 15000000000 }],
                ['rival_nation_1', { relationship_strength: 0.3, cooperation_level: 0.2, trade_volume: 5000000000 }],
                ['emerging_partner', { relationship_strength: 0.7, cooperation_level: 0.6, trade_volume: 20000000000 }]
            ]),
            
            // Multilateral Engagement
            multilateralEngagement: {
                international_organizations: {
                    un_security_council: { membership: true, influence_level: 0.8, voting_alignment: 0.7 },
                    trade_organizations: { membership: true, influence_level: 0.75, voting_alignment: 0.8 },
                    regional_blocs: { membership: true, influence_level: 0.6, voting_alignment: 0.75 },
                    climate_agreements: { membership: true, influence_level: 0.5, voting_alignment: 0.6 },
                    human_rights_bodies: { membership: true, influence_level: 0.4, voting_alignment: 0.5 }
                },
                treaty_commitments: 45,
                international_agreements: 120,
                peacekeeping_contributions: 2
            },
            
            // Economic Diplomacy
            economicDiplomacy: {
                trade_agreements: 25,
                investment_treaties: 40,
                economic_partnerships: 15,
                sanctions_regimes: 8,
                development_aid_programs: 35,
                export_promotion_initiatives: 20
            },
            
            // Cultural Diplomacy
            culturalDiplomacy: {
                cultural_exchange_programs: 50,
                educational_partnerships: 80,
                language_programs: 25,
                sister_city_relationships: 150,
                cultural_festivals_abroad: 30,
                academic_exchanges: 2000
            },
            
            // Crisis Management
            crisisManagement: {
                diplomatic_crises: [],
                evacuation_capabilities: 0.8,
                hostage_negotiation_capacity: 0.7,
                humanitarian_response_readiness: 0.75,
                conflict_mediation_experience: 0.6
            },
            
            // Intelligence Coordination
            intelligenceCoordination: {
                intelligence_sharing_agreements: 12,
                diplomatic_intelligence_capacity: 0.6,
                counterintelligence_awareness: 0.7,
                information_security_level: 0.8
            },
            
            // Public Diplomacy
            publicDiplomacy: {
                international_media_presence: 0.7,
                social_media_engagement: 0.6,
                public_opinion_monitoring: 0.65,
                narrative_influence_capacity: 0.6,
                diaspora_engagement: 0.5
            },
            
            // Consular Services
            consularServices: {
                citizen_services_quality: 0.8,
                visa_processing_efficiency: 0.75,
                emergency_assistance_capacity: 0.85,
                passport_services_speed: 0.8,
                business_facilitation_services: 0.7
            },
            
            // Performance Metrics
            performanceMetrics: {
                diplomatic_effectiveness: 0.7,
                crisis_response_speed: 0.75,
                international_reputation: 0.65,
                treaty_compliance_rate: 0.9,
                citizen_satisfaction: 0.8
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('diplomatic_engagement_level', 'float', 0.7, 
            'Overall level of international diplomatic engagement', 0.0, 1.0);
        
        this.addInputKnob('foreign_policy_approach', 'string', 'multilateral_engagement', 
            'Primary foreign policy approach: isolationist, bilateral_focus, multilateral_engagement, global_leadership');
        
        this.addInputKnob('soft_power_investment', 'float', 0.6, 
            'Investment in cultural diplomacy and soft power projection', 0.0, 1.0);
        
        this.addInputKnob('economic_diplomacy_priority', 'float', 0.7, 
            'Priority given to trade and economic diplomatic initiatives', 0.0, 1.0);
        
        this.addInputKnob('human_rights_advocacy_level', 'float', 0.6, 
            'Level of human rights advocacy in foreign policy', 0.0, 1.0);
        
        this.addInputKnob('crisis_response_aggressiveness', 'float', 0.5, 
            'Aggressiveness of diplomatic crisis response', 0.0, 1.0);
        
        this.addInputKnob('international_aid_generosity', 'float', 0.007, 
            'Foreign aid as percentage of GDP', 0.001, 0.02);
        
        this.addInputKnob('trade_liberalization_stance', 'float', 0.8, 
            'Stance on trade liberalization and openness', 0.0, 1.0);
        
        this.addInputKnob('alliance_commitment_strength', 'float', 0.8, 
            'Strength of commitment to existing alliances', 0.0, 1.0);
        
        this.addInputKnob('diplomatic_transparency_level', 'float', 0.5, 
            'Level of transparency in diplomatic communications', 0.0, 1.0);
        
        this.addInputKnob('cultural_exchange_emphasis', 'float', 0.6, 
            'Emphasis on cultural and educational exchange programs', 0.0, 1.0);
        
        this.addInputKnob('sanctions_policy_willingness', 'float', 0.4, 
            'Willingness to use economic sanctions as policy tool', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('foreign_policy_status', 'object', 
            'Current foreign policy framework and strategic direction');
        
        this.addOutputChannel('diplomatic_relations_summary', 'object', 
            'Overview of diplomatic infrastructure and relationships');
        
        this.addOutputChannel('bilateral_relationship_analysis', 'object', 
            'Analysis of key bilateral relationships and their status');
        
        this.addOutputChannel('multilateral_engagement_status', 'object', 
            'Status of multilateral organizations and treaty commitments');
        
        this.addOutputChannel('economic_diplomacy_metrics', 'object', 
            'Economic diplomacy activities and trade relationship status');
        
        this.addOutputChannel('cultural_diplomacy_impact', 'object', 
            'Cultural diplomacy programs and soft power projection');
        
        this.addOutputChannel('crisis_management_capabilities', 'object', 
            'Diplomatic crisis management and emergency response capabilities');
        
        this.addOutputChannel('diplomatic_performance_analysis', 'object', 
            'Overall diplomatic performance and effectiveness metrics');
        
        console.log('🏛️ State Department System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update foreign policy framework
            this.updateForeignPolicy(aiInputs);
            
            // Process diplomatic relations
            this.processDiplomaticRelations(aiInputs);
            
            // Update bilateral relationships
            this.updateBilateralRelations(gameState, aiInputs);
            
            // Process multilateral engagement
            this.processMultilateralEngagement(aiInputs);
            
            // Update economic diplomacy
            this.updateEconomicDiplomacy(gameState, aiInputs);
            
            // Process cultural diplomacy
            this.processCulturalDiplomacy(aiInputs);
            
            // Handle crisis management
            this.handleCrisisManagement(gameState, aiInputs);
            
            // Update intelligence coordination
            this.updateIntelligenceCoordination(aiInputs);
            
            // Process public diplomacy
            this.processPublicDiplomacy(aiInputs);
            
            // Update consular services
            this.updateConsularServices(aiInputs);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🏛️ State Department System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateForeignPolicy(aiInputs) {
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        const policyApproach = aiInputs.foreign_policy_approach || 'multilateral_engagement';
        const softPowerInvestment = aiInputs.soft_power_investment || 0.6;
        const humanRightsLevel = aiInputs.human_rights_advocacy_level || 0.6;
        const aidGenerosity = aiInputs.international_aid_generosity || 0.007;
        const tradeStance = aiInputs.trade_liberalization_stance || 0.8;
        
        // Update foreign policy framework
        this.state.foreignPolicy.diplomatic_strategy = policyApproach;
        this.state.foreignPolicy.soft_power_index = Math.min(1.0, 
            0.4 + softPowerInvestment * 0.5);
        this.state.foreignPolicy.human_rights_emphasis = humanRightsLevel;
        this.state.foreignPolicy.foreign_aid_commitment = aidGenerosity;
        this.state.foreignPolicy.trade_openness_level = tradeStance;
        
        // Update international standing based on policy approach
        this.updateInternationalStanding(policyApproach, engagementLevel);
    }

    updateInternationalStanding(approach, engagement) {
        let standingModifier = 0;
        
        switch (approach) {
            case 'global_leadership':
                standingModifier = engagement * 0.3;
                break;
            case 'multilateral_engagement':
                standingModifier = engagement * 0.2;
                break;
            case 'bilateral_focus':
                standingModifier = engagement * 0.1;
                break;
            case 'isolationist':
                standingModifier = -0.2;
                break;
        }
        
        this.state.foreignPolicy.international_standing = Math.max(0.1, Math.min(1.0, 
            this.state.foreignPolicy.international_standing + standingModifier * 0.1));
    }

    processDiplomaticRelations(aiInputs) {
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        const transparencyLevel = aiInputs.diplomatic_transparency_level || 0.5;
        
        const relations = this.state.diplomaticRelations;
        
        // Update diplomatic infrastructure based on engagement level
        relations.embassies = Math.floor(100 + engagementLevel * 50);
        relations.consulates = Math.floor(150 + engagementLevel * 100);
        relations.diplomatic_staff = Math.floor(6000 + engagementLevel * 4000);
        relations.foreign_service_officers = Math.floor(2500 + engagementLevel * 1000);
        relations.cultural_centers = Math.floor(30 + engagementLevel * 30);
        relations.trade_missions = Math.floor(60 + engagementLevel * 50);
        
        // Transparency affects diplomatic effectiveness
        if (transparencyLevel > 0.7) {
            this.state.performanceMetrics.diplomatic_effectiveness = Math.min(1.0, 
                this.state.performanceMetrics.diplomatic_effectiveness + 0.05);
        }
    }

    updateBilateralRelations(gameState, aiInputs) {
        const allianceCommitment = aiInputs.alliance_commitment_strength || 0.8;
        const economicPriority = aiInputs.economic_diplomacy_priority || 0.7;
        const humanRightsLevel = aiInputs.human_rights_advocacy_level || 0.6;
        
        // Update existing bilateral relationships
        for (const [country, relationship] of this.state.bilateralRelations) {
            // Alliance relationships benefit from strong commitment
            if (country.includes('allied') && allianceCommitment > 0.7) {
                relationship.relationship_strength = Math.min(1.0, 
                    relationship.relationship_strength + 0.02);
                relationship.cooperation_level = Math.min(1.0, 
                    relationship.cooperation_level + 0.02);
            }
            
            // Economic relationships benefit from economic diplomacy priority
            if (economicPriority > 0.7) {
                relationship.trade_volume *= (1 + economicPriority * 0.05);
            }
            
            // Human rights emphasis can strain relationships with authoritarian countries
            if (country.includes('rival') && humanRightsLevel > 0.7) {
                relationship.relationship_strength = Math.max(0.1, 
                    relationship.relationship_strength - 0.01);
            }
        }
        
        // Process diplomatic tensions from game state
        if (gameState.diplomaticTensions) {
            this.processDiplomaticTensions(gameState.diplomaticTensions);
        }
        
        // Process trade relationships from game state
        if (gameState.tradeRelationships) {
            this.processTradeRelationships(gameState.tradeRelationships, economicPriority);
        }
    }

    processDiplomaticTensions(tensions) {
        Object.entries(tensions).forEach(([country, tensionLevel]) => {
            if (this.state.bilateralRelations.has(country)) {
                const relationship = this.state.bilateralRelations.get(country);
                
                // High tensions reduce relationship strength
                if (tensionLevel > 0.7) {
                    relationship.relationship_strength = Math.max(0.1, 
                        relationship.relationship_strength - tensionLevel * 0.1);
                    relationship.cooperation_level = Math.max(0.1, 
                        relationship.cooperation_level - tensionLevel * 0.15);
                }
            } else {
                // Add new relationship for countries with tensions
                this.state.bilateralRelations.set(country, {
                    relationship_strength: Math.max(0.1, 0.5 - tensionLevel * 0.4),
                    cooperation_level: Math.max(0.1, 0.4 - tensionLevel * 0.3),
                    trade_volume: 1000000000 * (1 - tensionLevel)
                });
            }
        });
    }

    processTradeRelationships(tradeData, economicPriority) {
        Object.entries(tradeData).forEach(([country, tradeInfo]) => {
            if (this.state.bilateralRelations.has(country)) {
                const relationship = this.state.bilateralRelations.get(country);
                
                // Update trade volume
                relationship.trade_volume = tradeInfo.volume || relationship.trade_volume;
                
                // Strong trade relationships improve overall relationship
                if (tradeInfo.volume > 10000000000 && economicPriority > 0.6) {
                    relationship.relationship_strength = Math.min(1.0, 
                        relationship.relationship_strength + 0.01);
                }
            }
        });
    }

    processMultilateralEngagement(aiInputs) {
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        const policyApproach = aiInputs.foreign_policy_approach || 'multilateral_engagement';
        const humanRightsLevel = aiInputs.human_rights_advocacy_level || 0.6;
        
        const multilateral = this.state.multilateralEngagement;
        const organizations = multilateral.international_organizations;
        
        // Update influence levels based on engagement and approach
        if (policyApproach === 'multilateral_engagement' || policyApproach === 'global_leadership') {
            Object.values(organizations).forEach(org => {
                org.influence_level = Math.min(1.0, org.influence_level + engagementLevel * 0.05);
            });
        }
        
        // Human rights emphasis affects voting alignment in human rights bodies
        if (humanRightsLevel > 0.7) {
            organizations.human_rights_bodies.voting_alignment = Math.min(1.0, 
                organizations.human_rights_bodies.voting_alignment + 0.1);
            organizations.human_rights_bodies.influence_level = Math.min(1.0, 
                organizations.human_rights_bodies.influence_level + 0.05);
        }
        
        // Update treaty commitments and agreements
        if (engagementLevel > 0.8) {
            multilateral.treaty_commitments = Math.min(60, multilateral.treaty_commitments + 1);
            multilateral.international_agreements = Math.min(150, multilateral.international_agreements + 2);
        } else if (engagementLevel < 0.4) {
            multilateral.treaty_commitments = Math.max(20, multilateral.treaty_commitments - 1);
        }
        
        // Update peacekeeping contributions
        const peacekeepingCommitment = aiInputs.international_aid_generosity || 0.007;
        multilateral.peacekeeping_contributions = Math.floor(peacekeepingCommitment * 500);
    }

    updateEconomicDiplomacy(gameState, aiInputs) {
        const economicPriority = aiInputs.economic_diplomacy_priority || 0.7;
        const tradeStance = aiInputs.trade_liberalization_stance || 0.8;
        const sanctionsWillingness = aiInputs.sanctions_policy_willingness || 0.4;
        
        const economic = this.state.economicDiplomacy;
        
        // Update trade agreements based on trade stance
        if (tradeStance > 0.8) {
            economic.trade_agreements = Math.min(35, economic.trade_agreements + 1);
        } else if (tradeStance < 0.5) {
            economic.trade_agreements = Math.max(15, economic.trade_agreements - 1);
        }
        
        // Update investment treaties based on economic priority
        economic.investment_treaties = Math.floor(30 + economicPriority * 20);
        
        // Update economic partnerships
        economic.economic_partnerships = Math.floor(10 + economicPriority * 10);
        
        // Update sanctions regimes based on willingness
        economic.sanctions_regimes = Math.floor(5 + sanctionsWillingness * 8);
        
        // Update development aid programs
        const aidCommitment = aiInputs.international_aid_generosity || 0.007;
        economic.development_aid_programs = Math.floor(20 + aidCommitment * 2000);
        
        // Update export promotion
        economic.export_promotion_initiatives = Math.floor(15 + economicPriority * 10);
        
        // Process economic sanctions from game state
        if (gameState.economicSanctions) {
            this.processEconomicSanctions(gameState.economicSanctions, sanctionsWillingness);
        }
    }

    processEconomicSanctions(sanctions, willingness) {
        sanctions.forEach(sanction => {
            if (willingness > 0.6) {
                // High willingness to use sanctions
                const targetCountry = sanction.target;
                
                if (this.state.bilateralRelations.has(targetCountry)) {
                    const relationship = this.state.bilateralRelations.get(targetCountry);
                    relationship.trade_volume *= 0.7; // Reduce trade volume
                    relationship.cooperation_level = Math.max(0.1, 
                        relationship.cooperation_level - 0.2);
                }
                
                console.log(`🏛️ State Department implementing sanctions against ${targetCountry}`);
            }
        });
    }

    processCulturalDiplomacy(aiInputs) {
        const softPowerInvestment = aiInputs.soft_power_investment || 0.6;
        const culturalEmphasis = aiInputs.cultural_exchange_emphasis || 0.6;
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        
        const cultural = this.state.culturalDiplomacy;
        
        // Update cultural programs based on investment and emphasis
        cultural.cultural_exchange_programs = Math.floor(30 + softPowerInvestment * 40);
        cultural.educational_partnerships = Math.floor(50 + culturalEmphasis * 60);
        cultural.language_programs = Math.floor(15 + softPowerInvestment * 20);
        cultural.sister_city_relationships = Math.floor(100 + engagementLevel * 100);
        cultural.cultural_festivals_abroad = Math.floor(20 + softPowerInvestment * 20);
        cultural.academic_exchanges = Math.floor(1500 + culturalEmphasis * 1000);
        
        // Update soft power index based on cultural diplomacy activities
        const culturalImpact = (cultural.cultural_exchange_programs + 
                              cultural.educational_partnerships + 
                              cultural.language_programs) / 150;
        
        this.state.foreignPolicy.soft_power_index = Math.min(1.0, 
            this.state.foreignPolicy.soft_power_index + culturalImpact * 0.02);
    }

    handleCrisisManagement(gameState, aiInputs) {
        const crisisAggressiveness = aiInputs.crisis_response_aggressiveness || 0.5;
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        
        const crisis = this.state.crisisManagement;
        
        // Update crisis management capabilities
        crisis.evacuation_capabilities = Math.min(1.0, 
            0.6 + engagementLevel * 0.3);
        crisis.hostage_negotiation_capacity = Math.min(1.0, 
            0.5 + crisisAggressiveness * 0.4);
        crisis.humanitarian_response_readiness = Math.min(1.0, 
            0.6 + this.state.foreignPolicy.foreign_aid_commitment * 50);
        crisis.conflict_mediation_experience = Math.min(1.0, 
            0.4 + engagementLevel * 0.4);
        
        // Process active diplomatic crises from game state
        if (gameState.diplomaticCrises) {
            this.processDiplomaticCrises(gameState.diplomaticCrises, crisisAggressiveness);
        }
        
        // Update crisis response speed based on capabilities
        this.state.performanceMetrics.crisis_response_speed = Math.min(1.0, 
            (crisis.evacuation_capabilities + crisis.hostage_negotiation_capacity + 
             crisis.humanitarian_response_readiness) / 3);
    }

    processDiplomaticCrises(crises, aggressiveness) {
        this.state.crisisManagement.diplomatic_crises = [];
        
        crises.forEach(crisis => {
            const crisisResponse = {
                id: crisis.id,
                type: crisis.type,
                severity: crisis.severity,
                response_approach: this.determineCrisisResponse(crisis, aggressiveness),
                resources_allocated: this.calculateCrisisResources(crisis),
                timeline: this.estimateCrisisTimeline(crisis)
            };
            
            this.state.crisisManagement.diplomatic_crises.push(crisisResponse);
            
            // Apply crisis effects to relationships
            this.applyCrisisEffects(crisis, crisisResponse);
        });
    }

    determineCrisisResponse(crisis, aggressiveness) {
        if (aggressiveness > 0.8) return 'aggressive_intervention';
        if (aggressiveness > 0.6) return 'active_mediation';
        if (aggressiveness > 0.4) return 'diplomatic_engagement';
        return 'monitoring_and_consultation';
    }

    calculateCrisisResources(crisis) {
        const baseResources = crisis.severity * 1000000; // Base funding
        const diplomaticStaff = Math.floor(crisis.severity * 50);
        
        return {
            funding: baseResources,
            diplomatic_personnel: diplomaticStaff,
            emergency_response_teams: Math.floor(crisis.severity * 5)
        };
    }

    estimateCrisisTimeline(crisis) {
        const complexityFactor = crisis.severity * crisis.scope || 1;
        const baseDays = 30;
        
        return {
            initial_response: '24 hours',
            active_phase: `${Math.floor(baseDays * complexityFactor)} days`,
            resolution_target: `${Math.floor(baseDays * complexityFactor * 2)} days`
        };
    }

    applyCrisisEffects(crisis, response) {
        // Crisis affects relationships with involved countries
        if (crisis.countries_involved) {
            crisis.countries_involved.forEach(country => {
                if (this.state.bilateralRelations.has(country)) {
                    const relationship = this.state.bilateralRelations.get(country);
                    
                    // Effective crisis response improves relationships
                    if (response.response_approach === 'active_mediation') {
                        relationship.relationship_strength = Math.min(1.0, 
                            relationship.relationship_strength + 0.05);
                    }
                }
            });
        }
    }

    updateIntelligenceCoordination(aiInputs) {
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        const allianceCommitment = aiInputs.alliance_commitment_strength || 0.8;
        
        const intelligence = this.state.intelligenceCoordination;
        
        // Update intelligence sharing based on alliance commitment
        intelligence.intelligence_sharing_agreements = Math.floor(8 + allianceCommitment * 8);
        
        // Update diplomatic intelligence capacity
        intelligence.diplomatic_intelligence_capacity = Math.min(1.0, 
            0.4 + engagementLevel * 0.4);
        
        // Update counterintelligence awareness
        intelligence.counterintelligence_awareness = Math.min(1.0, 
            0.5 + this.state.diplomaticRelations.foreign_service_officers / 5000);
        
        // Update information security
        intelligence.information_security_level = Math.min(1.0, 
            0.6 + this.state.performanceMetrics.diplomatic_effectiveness * 0.3);
    }

    processPublicDiplomacy(aiInputs) {
        const softPowerInvestment = aiInputs.soft_power_investment || 0.6;
        const transparencyLevel = aiInputs.diplomatic_transparency_level || 0.5;
        
        const publicDip = this.state.publicDiplomacy;
        
        // Update media presence based on soft power investment
        publicDip.international_media_presence = Math.min(1.0, 
            0.5 + softPowerInvestment * 0.4);
        
        // Update social media engagement
        publicDip.social_media_engagement = Math.min(1.0, 
            0.4 + softPowerInvestment * 0.5);
        
        // Update public opinion monitoring
        publicDip.public_opinion_monitoring = Math.min(1.0, 
            0.5 + transparencyLevel * 0.3);
        
        // Update narrative influence capacity
        publicDip.narrative_influence_capacity = Math.min(1.0, 
            0.4 + this.state.foreignPolicy.soft_power_index * 0.4);
        
        // Update diaspora engagement
        publicDip.diaspora_engagement = Math.min(1.0, 
            0.3 + this.state.culturalDiplomacy.cultural_exchange_programs / 100);
    }

    updateConsularServices(aiInputs) {
        const engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        const economicPriority = aiInputs.economic_diplomacy_priority || 0.7;
        
        const consular = this.state.consularServices;
        
        // Update service quality based on engagement and resources
        consular.citizen_services_quality = Math.min(1.0, 
            0.6 + engagementLevel * 0.3);
        
        // Update visa processing efficiency
        consular.visa_processing_efficiency = Math.min(1.0, 
            0.6 + economicPriority * 0.3);
        
        // Update emergency assistance capacity
        consular.emergency_assistance_capacity = Math.min(1.0, 
            0.7 + this.state.crisisManagement.evacuation_capabilities * 0.2);
        
        // Update passport services speed
        consular.passport_services_speed = Math.min(1.0, 
            0.6 + this.state.diplomaticRelations.consulates / 300);
        
        // Update business facilitation
        consular.business_facilitation_services = Math.min(1.0, 
            0.5 + economicPriority * 0.4);
    }

    calculatePerformanceMetrics(gameState) {
        const metrics = this.state.performanceMetrics;
        
        // Calculate diplomatic effectiveness
        const relationshipStrengths = Array.from(this.state.bilateralRelations.values())
            .map(rel => rel.relationship_strength);
        const avgRelationshipStrength = relationshipStrengths.length > 0 ? 
            relationshipStrengths.reduce((sum, strength) => sum + strength, 0) / relationshipStrengths.length : 0.5;
        
        metrics.diplomatic_effectiveness = (avgRelationshipStrength + 
                                          this.state.foreignPolicy.international_standing + 
                                          this.state.foreignPolicy.soft_power_index) / 3;
        
        // Crisis response speed already updated in handleCrisisManagement
        
        // Calculate international reputation
        const multilateralInfluence = Object.values(this.state.multilateralEngagement.international_organizations)
            .reduce((sum, org) => sum + org.influence_level, 0) / 5;
        
        metrics.international_reputation = (this.state.foreignPolicy.international_standing + 
                                          multilateralInfluence + 
                                          this.state.foreignPolicy.soft_power_index) / 3;
        
        // Treaty compliance rate (simplified - would be based on actual compliance data)
        metrics.treaty_compliance_rate = Math.min(1.0, 
            0.8 + this.state.foreignPolicy.international_standing * 0.2);
        
        // Citizen satisfaction (based on consular services quality)
        metrics.citizen_satisfaction = this.state.consularServices.citizen_services_quality;
    }

    generateOutputs() {
        return {
            foreign_policy_status: {
                diplomatic_strategy: this.state.foreignPolicy.diplomatic_strategy,
                international_standing: this.state.foreignPolicy.international_standing,
                soft_power_index: this.state.foreignPolicy.soft_power_index,
                foreign_aid_commitment: this.state.foreignPolicy.foreign_aid_commitment,
                trade_openness_level: this.state.foreignPolicy.trade_openness_level,
                human_rights_emphasis: this.state.foreignPolicy.human_rights_emphasis,
                policy_coherence: this.assessPolicyCoherence(),
                strategic_priorities: this.identifyStrategicPriorities()
            },
            
            diplomatic_relations_summary: {
                infrastructure: this.state.diplomaticRelations,
                global_presence: this.assessGlobalPresence(),
                diplomatic_capacity: this.calculateDiplomaticCapacity(),
                resource_allocation: this.analyzeDiplomaticResources()
            },
            
            bilateral_relationship_analysis: {
                key_relationships: this.summarizeKeyRelationships(),
                relationship_trends: this.analyzeBilateralTrends(),
                cooperation_levels: this.assessCooperationLevels(),
                trade_integration: this.analyzeTradeIntegration(),
                diplomatic_challenges: this.identifyDiplomaticChallenges()
            },
            
            multilateral_engagement_status: {
                organization_participation: this.state.multilateralEngagement.international_organizations,
                treaty_commitments: this.state.multilateralEngagement.treaty_commitments,
                international_agreements: this.state.multilateralEngagement.international_agreements,
                peacekeeping_contributions: this.state.multilateralEngagement.peacekeeping_contributions,
                multilateral_influence: this.calculateMultilateralInfluence(),
                engagement_effectiveness: this.assessMultilateralEffectiveness()
            },
            
            economic_diplomacy_metrics: {
                trade_diplomacy: this.state.economicDiplomacy,
                economic_integration_level: this.calculateEconomicIntegration(),
                sanctions_effectiveness: this.assessSanctionsEffectiveness(),
                development_cooperation: this.analyzeDevelopmentCooperation(),
                investment_promotion: this.assessInvestmentPromotion()
            },
            
            cultural_diplomacy_impact: {
                cultural_programs: this.state.culturalDiplomacy,
                soft_power_projection: this.assessSoftPowerProjection(),
                cultural_influence: this.calculateCulturalInfluence(),
                educational_impact: this.assessEducationalImpact(),
                public_perception: this.analyzePublicPerception()
            },
            
            crisis_management_capabilities: {
                crisis_response_capacity: this.state.crisisManagement,
                active_crises: this.state.crisisManagement.diplomatic_crises,
                response_effectiveness: this.assessCrisisResponseEffectiveness(),
                emergency_preparedness: this.assessEmergencyPreparedness(),
                conflict_resolution_capacity: this.assessConflictResolutionCapacity()
            },
            
            diplomatic_performance_analysis: {
                performance_metrics: this.state.performanceMetrics,
                effectiveness_assessment: this.assessOverallEffectiveness(),
                strategic_success_indicators: this.identifySuccessIndicators(),
                improvement_areas: this.identifyImprovementAreas(),
                diplomatic_roi: this.calculateDiplomaticROI()
            }
        };
    }

    assessPolicyCoherence() {
        const strategy = this.state.foreignPolicy.diplomatic_strategy;
        const standing = this.state.foreignPolicy.international_standing;
        const softPower = this.state.foreignPolicy.soft_power_index;
        const aidCommitment = this.state.foreignPolicy.foreign_aid_commitment;
        
        let coherence = 0.7; // Base coherence
        
        // Check strategy-standing alignment
        if (strategy === 'global_leadership' && standing > 0.8) coherence += 0.1;
        if (strategy === 'multilateral_engagement' && standing > 0.6) coherence += 0.1;
        
        // Check soft power-aid alignment
        if (softPower > 0.7 && aidCommitment > 0.01) coherence += 0.1;
        
        return Math.min(1.0, coherence);
    }

    identifyStrategicPriorities() {
        const priorities = [];
        
        if (this.state.foreignPolicy.trade_openness_level > 0.8) {
            priorities.push('economic_integration');
        }
        
        if (this.state.foreignPolicy.human_rights_emphasis > 0.7) {
            priorities.push('human_rights_promotion');
        }
        
        if (this.state.foreignPolicy.soft_power_index > 0.7) {
            priorities.push('cultural_influence');
        }
        
        const avgRelationshipStrength = this.calculateAverageRelationshipStrength();
        if (avgRelationshipStrength > 0.8) {
            priorities.push('alliance_strengthening');
        }
        
        return priorities;
    }

    calculateAverageRelationshipStrength() {
        const strengths = Array.from(this.state.bilateralRelations.values())
            .map(rel => rel.relationship_strength);
        
        return strengths.length > 0 ? 
            strengths.reduce((sum, strength) => sum + strength, 0) / strengths.length : 0.5;
    }

    assessGlobalPresence() {
        const relations = this.state.diplomaticRelations;
        
        return {
            embassy_coverage: relations.embassies,
            consular_network: relations.consulates,
            cultural_footprint: relations.cultural_centers,
            trade_representation: relations.trade_missions,
            global_reach_index: this.calculateGlobalReachIndex()
        };
    }

    calculateGlobalReachIndex() {
        const relations = this.state.diplomaticRelations;
        
        // Normalize to 0-1 scale
        const embassyScore = Math.min(1.0, relations.embassies / 150);
        const consulateScore = Math.min(1.0, relations.consulates / 250);
        const culturalScore = Math.min(1.0, relations.cultural_centers / 60);
        
        return (embassyScore + consulateScore + culturalScore) / 3;
    }

    calculateDiplomaticCapacity() {
        const relations = this.state.diplomaticRelations;
        
        return {
            total_diplomatic_staff: relations.diplomatic_staff,
            foreign_service_officers: relations.foreign_service_officers,
            staff_per_embassy: relations.diplomatic_staff / relations.embassies,
            capacity_utilization: this.calculateCapacityUtilization(),
            professional_development_index: this.assessProfessionalDevelopment()
        };
    }

    calculateCapacityUtilization() {
        const relations = this.state.diplomaticRelations;
        const totalPosts = relations.embassies + relations.consulates;
        const staffPerPost = relations.diplomatic_staff / totalPosts;
        
        // Optimal staffing is around 25 people per post
        return Math.min(1.0, staffPerPost / 25);
    }

    assessProfessionalDevelopment() {
        // Based on foreign service officer ratio and training programs
        const relations = this.state.diplomaticRelations;
        const officerRatio = relations.foreign_service_officers / relations.diplomatic_staff;
        
        return Math.min(1.0, officerRatio * 2); // Normalize assuming 50% optimal ratio
    }

    analyzeDiplomaticResources() {
        const relations = this.state.diplomaticRelations;
        
        return {
            resource_distribution: {
                embassies: relations.embassies,
                consulates: relations.consulates,
                cultural_centers: relations.cultural_centers,
                trade_missions: relations.trade_missions
            },
            efficiency_metrics: {
                posts_per_staff_member: (relations.embassies + relations.consulates) / relations.diplomatic_staff,
                cultural_reach_efficiency: relations.cultural_centers / relations.embassies,
                trade_support_coverage: relations.trade_missions / relations.embassies
            },
            resource_optimization: this.assessResourceOptimization()
        };
    }

    assessResourceOptimization() {
        const relations = this.state.diplomaticRelations;
        const culturalRatio = relations.cultural_centers / relations.embassies;
        const tradeRatio = relations.trade_missions / relations.embassies;
        
        let optimization = 0.7; // Base optimization
        
        // Optimal ratios: 0.3-0.5 for cultural, 0.6-0.8 for trade
        if (culturalRatio >= 0.3 && culturalRatio <= 0.5) optimization += 0.1;
        if (tradeRatio >= 0.6 && tradeRatio <= 0.8) optimization += 0.1;
        
        return Math.min(1.0, optimization);
    }

    summarizeKeyRelationships() {
        const relationships = [];
        
        for (const [country, relationship] of this.state.bilateralRelations) {
            relationships.push({
                country,
                relationship_strength: relationship.relationship_strength,
                cooperation_level: relationship.cooperation_level,
                trade_volume: relationship.trade_volume,
                relationship_category: this.categorizeRelationship(relationship.relationship_strength),
                strategic_importance: this.assessStrategicImportance(country, relationship)
            });
        }
        
        return relationships.sort((a, b) => b.strategic_importance - a.strategic_importance);
    }

    categorizeRelationship(strength) {
        if (strength > 0.8) return 'strategic_alliance';
        if (strength > 0.6) return 'strong_partnership';
        if (strength > 0.4) return 'cooperative_relationship';
        if (strength > 0.2) return 'limited_engagement';
        return 'strained_relations';
    }

    assessStrategicImportance(country, relationship) {
        let importance = relationship.relationship_strength * 0.4;
        importance += relationship.cooperation_level * 0.3;
        importance += Math.min(1.0, relationship.trade_volume / 50000000000) * 0.3;
        
        // Bonus for allied nations
        if (country.includes('allied')) importance += 0.2;
        
        return Math.min(1.0, importance);
    }

    analyzeBilateralTrends() {
        // Simplified trend analysis - would use historical data in full implementation
        const relationships = Array.from(this.state.bilateralRelations.values());
        const avgStrength = relationships.reduce((sum, rel) => sum + rel.relationship_strength, 0) / relationships.length;
        const avgCooperation = relationships.reduce((sum, rel) => sum + rel.cooperation_level, 0) / relationships.length;
        
        return {
            overall_trend: avgStrength > 0.6 ? 'improving' : avgStrength > 0.4 ? 'stable' : 'declining',
            cooperation_trend: avgCooperation > 0.6 ? 'increasing' : avgCooperation > 0.4 ? 'stable' : 'decreasing',
            strongest_relationships: this.identifyStrongestRelationships(),
            relationships_at_risk: this.identifyRelationshipsAtRisk()
        };
    }

    identifyStrongestRelationships() {
        return Array.from(this.state.bilateralRelations.entries())
            .filter(([, rel]) => rel.relationship_strength > 0.8)
            .map(([country]) => country);
    }

    identifyRelationshipsAtRisk() {
        return Array.from(this.state.bilateralRelations.entries())
            .filter(([, rel]) => rel.relationship_strength < 0.3)
            .map(([country, rel]) => ({ country, risk_level: 1 - rel.relationship_strength }));
    }

    assessCooperationLevels() {
        const relationships = Array.from(this.state.bilateralRelations.values());
        const cooperationLevels = relationships.map(rel => rel.cooperation_level);
        
        return {
            average_cooperation: cooperationLevels.reduce((sum, level) => sum + level, 0) / cooperationLevels.length,
            high_cooperation_partners: cooperationLevels.filter(level => level > 0.8).length,
            limited_cooperation_partners: cooperationLevels.filter(level => level < 0.4).length,
            cooperation_distribution: this.analyzeCooperationDistribution(cooperationLevels)
        };
    }

    analyzeCooperationDistribution(levels) {
        const distribution = {
            high: levels.filter(l => l > 0.8).length,
            medium: levels.filter(l => l >= 0.4 && l <= 0.8).length,
            low: levels.filter(l => l < 0.4).length
        };
        
        const total = levels.length;
        return {
            high_percentage: (distribution.high / total * 100).toFixed(1),
            medium_percentage: (distribution.medium / total * 100).toFixed(1),
            low_percentage: (distribution.low / total * 100).toFixed(1)
        };
    }

    analyzeTradeIntegration() {
        const relationships = Array.from(this.state.bilateralRelations.values());
        const totalTradeVolume = relationships.reduce((sum, rel) => sum + rel.trade_volume, 0);
        
        return {
            total_bilateral_trade: totalTradeVolume,
            average_trade_per_partner: totalTradeVolume / relationships.length,
            major_trade_partners: this.identifyMajorTradePartners(),
            trade_diversification_index: this.calculateTradeDiversificationIndex(),
            economic_integration_level: this.calculateEconomicIntegrationLevel()
        };
    }

    identifyMajorTradePartners() {
        return Array.from(this.state.bilateralRelations.entries())
            .filter(([, rel]) => rel.trade_volume > 10000000000)
            .sort(([, a], [, b]) => b.trade_volume - a.trade_volume)
            .map(([country, rel]) => ({ country, trade_volume: rel.trade_volume }));
    }

    calculateTradeDiversificationIndex() {
        const relationships = Array.from(this.state.bilateralRelations.values());
        const totalTrade = relationships.reduce((sum, rel) => sum + rel.trade_volume, 0);
        
        // Calculate Herfindahl-Hirschman Index for trade concentration
        const shares = relationships.map(rel => rel.trade_volume / totalTrade);
        const hhi = shares.reduce((sum, share) => sum + share * share, 0);
        
        // Convert to diversification index (1 - HHI)
        return 1 - hhi;
    }

    calculateEconomicIntegrationLevel() {
        const economic = this.state.economicDiplomacy;
        
        const integrationFactors = [
            Math.min(1.0, economic.trade_agreements / 30),
            Math.min(1.0, economic.investment_treaties / 50),
            Math.min(1.0, economic.economic_partnerships / 20),
            this.state.foreignPolicy.trade_openness_level
        ];
        
        return integrationFactors.reduce((sum, factor) => sum + factor, 0) / integrationFactors.length;
    }

    identifyDiplomaticChallenges() {
        const challenges = [];
        
        // Relationship challenges
        const weakRelationships = this.identifyRelationshipsAtRisk();
        if (weakRelationships.length > 0) {
            challenges.push({
                type: 'strained_bilateral_relations',
                severity: 'medium',
                affected_countries: weakRelationships.map(r => r.country)
            });
        }
        
        // Capacity challenges
        const capacityUtilization = this.calculateCapacityUtilization();
        if (capacityUtilization < 0.7) {
            challenges.push({
                type: 'diplomatic_capacity_constraints',
                severity: 'medium',
                description: 'Insufficient diplomatic staffing'
            });
        }
        
        // Crisis management challenges
        if (this.state.crisisManagement.diplomatic_crises.length > 3) {
            challenges.push({
                type: 'multiple_active_crises',
                severity: 'high',
                crisis_count: this.state.crisisManagement.diplomatic_crises.length
            });
        }
        
        return challenges;
    }

    calculateMultilateralInfluence() {
        const organizations = this.state.multilateralEngagement.international_organizations;
        const influences = Object.values(organizations).map(org => org.influence_level);
        
        return {
            average_influence: influences.reduce((sum, inf) => sum + inf, 0) / influences.length,
            high_influence_organizations: Object.entries(organizations)
                .filter(([, org]) => org.influence_level > 0.8)
                .map(([name]) => name),
            influence_distribution: this.analyzeInfluenceDistribution(organizations)
        };
    }

    analyzeInfluenceDistribution(organizations) {
        const distribution = {};
        
        Object.entries(organizations).forEach(([name, org]) => {
            distribution[name] = {
                influence_level: org.influence_level,
                voting_alignment: org.voting_alignment,
                effectiveness_score: (org.influence_level + org.voting_alignment) / 2
            };
        });
        
        return distribution;
    }

    assessMultilateralEffectiveness() {
        const multilateral = this.state.multilateralEngagement;
        const organizations = multilateral.international_organizations;
        
        const avgInfluence = Object.values(organizations)
            .reduce((sum, org) => sum + org.influence_level, 0) / Object.keys(organizations).length;
        
        const avgAlignment = Object.values(organizations)
            .reduce((sum, org) => sum + org.voting_alignment, 0) / Object.keys(organizations).length;
        
        return {
            overall_effectiveness: (avgInfluence + avgAlignment) / 2,
            treaty_engagement_level: Math.min(1.0, multilateral.treaty_commitments / 50),
            international_agreement_activity: Math.min(1.0, multilateral.international_agreements / 150),
            peacekeeping_contribution_level: multilateral.peacekeeping_contributions
        };
    }

    assessSanctionsEffectiveness() {
        const economic = this.state.economicDiplomacy;
        
        return {
            active_sanctions_regimes: economic.sanctions_regimes,
            sanctions_utilization: economic.sanctions_regimes > 5 ? 'high' : 
                                  economic.sanctions_regimes > 2 ? 'moderate' : 'limited',
            estimated_effectiveness: this.calculateSanctionsEffectiveness(),
            multilateral_coordination: this.assessSanctionsCoordination()
        };
    }

    calculateSanctionsEffectiveness() {
        // Simplified calculation based on multilateral support and economic integration
        const multilateralSupport = this.calculateMultilateralInfluence().average_influence;
        const economicIntegration = this.calculateEconomicIntegrationLevel();
        
        return (multilateralSupport + economicIntegration) / 2;
    }

    assessSanctionsCoordination() {
        const multilateralInfluence = this.calculateMultilateralInfluence().average_influence;
        
        if (multilateralInfluence > 0.8) return 'strong_multilateral_coordination';
        if (multilateralInfluence > 0.6) return 'moderate_coordination';
        return 'limited_coordination';
    }

    analyzeDevelopmentCooperation() {
        const economic = this.state.economicDiplomacy;
        const aidCommitment = this.state.foreignPolicy.foreign_aid_commitment;
        
        return {
            development_aid_programs: economic.development_aid_programs,
            aid_commitment_percentage: aidCommitment,
            aid_effectiveness: this.calculateAidEffectiveness(),
            development_partnership_strength: this.assessDevelopmentPartnerships()
        };
    }

    calculateAidEffectiveness() {
        const aidCommitment = this.state.foreignPolicy.foreign_aid_commitment;
        const softPower = this.state.foreignPolicy.soft_power_index;
        
        // Aid effectiveness correlates with soft power and international standing
        return (aidCommitment * 100 + softPower + this.state.foreignPolicy.international_standing) / 3;
    }

    assessDevelopmentPartnerships() {
        const multilateralEngagement = this.assessMultilateralEffectiveness().overall_effectiveness;
        const bilateralCooperation = this.assessCooperationLevels().average_cooperation;
        
        return (multilateralEngagement + bilateralCooperation) / 2;
    }

    assessInvestmentPromotion() {
        const economic = this.state.economicDiplomacy;
        
        return {
            investment_treaties: economic.investment_treaties,
            export_promotion_initiatives: economic.export_promotion_initiatives,
            investment_climate_support: this.calculateInvestmentClimateSupport(),
            trade_facilitation_effectiveness: this.assessTradeFacilitation()
        };
    }

    calculateInvestmentClimateSupport() {
        const economic = this.state.economicDiplomacy;
        const tradeOpenness = this.state.foreignPolicy.trade_openness_level;
        
        const treatyScore = Math.min(1.0, economic.investment_treaties / 50);
        const promotionScore = Math.min(1.0, economic.export_promotion_initiatives / 25);
        
        return (treatyScore + promotionScore + tradeOpenness) / 3;
    }

    assessTradeFacilitation() {
        const economic = this.state.economicDiplomacy;
        const consular = this.state.consularServices;
        
        return {
            trade_agreement_coverage: Math.min(1.0, economic.trade_agreements / 30),
            business_facilitation_quality: consular.business_facilitation_services,
            trade_mission_effectiveness: Math.min(1.0, this.state.diplomaticRelations.trade_missions / 100)
        };
    }

    assessSoftPowerProjection() {
        const cultural = this.state.culturalDiplomacy;
        const softPowerIndex = this.state.foreignPolicy.soft_power_index;
        
        return {
            soft_power_index: softPowerIndex,
            cultural_program_reach: this.calculateCulturalReach(),
            international_perception: this.assessInternationalPerception(),
            influence_mechanisms: this.identifyInfluenceMechanisms()
        };
    }

    calculateCulturalReach() {
        const cultural = this.state.culturalDiplomacy;
        
        const programReach = (cultural.cultural_exchange_programs + 
                            cultural.educational_partnerships + 
                            cultural.language_programs) / 150;
        
        return Math.min(1.0, programReach);
    }

    assessInternationalPerception() {
        const publicDip = this.state.publicDiplomacy;
        
        return {
            media_presence: publicDip.international_media_presence,
            social_media_engagement: publicDip.social_media_engagement,
            narrative_influence: publicDip.narrative_influence_capacity,
            overall_perception: (publicDip.international_media_presence + 
                               publicDip.social_media_engagement + 
                               publicDip.narrative_influence_capacity) / 3
        };
    }

    identifyInfluenceMechanisms() {
        return [
            'cultural_exchange_programs',
            'educational_partnerships',
            'language_promotion',
            'international_media',
            'academic_exchanges',
            'sister_city_relationships'
        ];
    }

    calculateCulturalInfluence() {
        const cultural = this.state.culturalDiplomacy;
        const softPower = this.state.foreignPolicy.soft_power_index;
        
        const culturalScore = (cultural.cultural_exchange_programs / 50 + 
                             cultural.educational_partnerships / 80 + 
                             cultural.academic_exchanges / 2000) / 3;
        
        return Math.min(1.0, (culturalScore + softPower) / 2);
    }

    assessEducationalImpact() {
        const cultural = this.state.culturalDiplomacy;
        
        return {
            educational_partnerships: cultural.educational_partnerships,
            academic_exchanges: cultural.academic_exchanges,
            language_programs: cultural.language_programs,
            educational_influence_index: this.calculateEducationalInfluenceIndex()
        };
    }

    calculateEducationalInfluenceIndex() {
        const cultural = this.state.culturalDiplomacy;
        
        const factors = [
            Math.min(1.0, cultural.educational_partnerships / 100),
            Math.min(1.0, cultural.academic_exchanges / 3000),
            Math.min(1.0, cultural.language_programs / 30)
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    analyzePublicPerception() {
        const publicDip = this.state.publicDiplomacy;
        
        return {
            international_media_coverage: publicDip.international_media_presence,
            social_media_influence: publicDip.social_media_engagement,
            public_opinion_trends: publicDip.public_opinion_monitoring,
            diaspora_connection: publicDip.diaspora_engagement,
            perception_management_effectiveness: this.calculatePerceptionManagementEffectiveness()
        };
    }

    calculatePerceptionManagementEffectiveness() {
        const publicDip = this.state.publicDiplomacy;
        
        return (publicDip.international_media_presence + 
                publicDip.social_media_engagement + 
                publicDip.narrative_influence_capacity + 
                publicDip.public_opinion_monitoring) / 4;
    }

    assessCrisisResponseEffectiveness() {
        const crisis = this.state.crisisManagement;
        
        return {
            response_capabilities: {
                evacuation: crisis.evacuation_capabilities,
                hostage_negotiation: crisis.hostage_negotiation_capacity,
                humanitarian_response: crisis.humanitarian_response_readiness,
                conflict_mediation: crisis.conflict_mediation_experience
            },
            overall_effectiveness: (crisis.evacuation_capabilities + 
                                  crisis.hostage_negotiation_capacity + 
                                  crisis.humanitarian_response_readiness + 
                                  crisis.conflict_mediation_experience) / 4,
            crisis_management_rating: this.calculateCrisisManagementRating()
        };
    }

    calculateCrisisManagementRating() {
        const effectiveness = this.assessCrisisResponseEffectiveness().overall_effectiveness;
        
        if (effectiveness > 0.8) return 'excellent';
        if (effectiveness > 0.6) return 'good';
        if (effectiveness > 0.4) return 'adequate';
        return 'needs_improvement';
    }

    assessEmergencyPreparedness() {
        const crisis = this.state.crisisManagement;
        const consular = this.state.consularServices;
        
        return {
            evacuation_readiness: crisis.evacuation_capabilities,
            emergency_assistance_capacity: consular.emergency_assistance_capacity,
            crisis_communication_systems: this.assessCrisisCommunicationSystems(),
            preparedness_level: this.calculateEmergencyPreparednessLevel()
        };
    }

    assessCrisisCommunicationSystems() {
        const publicDip = this.state.publicDiplomacy;
        const intelligence = this.state.intelligenceCoordination;
        
        return (publicDip.international_media_presence + 
                intelligence.information_security_level) / 2;
    }

    calculateEmergencyPreparednessLevel() {
        const crisis = this.state.crisisManagement;
        const consular = this.state.consularServices;
        
        return (crisis.evacuation_capabilities + 
                consular.emergency_assistance_capacity + 
                this.assessCrisisCommunicationSystems()) / 3;
    }

    assessConflictResolutionCapacity() {
        const crisis = this.state.crisisManagement;
        const multilateral = this.calculateMultilateralInfluence();
        
        return {
            mediation_experience: crisis.conflict_mediation_experience,
            multilateral_support: multilateral.average_influence,
            diplomatic_leverage: this.calculateDiplomaticLeverage(),
            resolution_success_rate: this.estimateResolutionSuccessRate()
        };
    }

    calculateDiplomaticLeverage() {
        const standing = this.state.foreignPolicy.international_standing;
        const softPower = this.state.foreignPolicy.soft_power_index;
        const economicIntegration = this.calculateEconomicIntegrationLevel();
        
        return (standing + softPower + economicIntegration) / 3;
    }

    estimateResolutionSuccessRate() {
        const mediationExp = this.state.crisisManagement.conflict_mediation_experience;
        const leverage = this.calculateDiplomaticLeverage();
        const multilateralSupport = this.calculateMultilateralInfluence().average_influence;
        
        return (mediationExp + leverage + multilateralSupport) / 3;
    }

    assessOverallEffectiveness() {
        const metrics = this.state.performanceMetrics;
        
        return {
            diplomatic_effectiveness: metrics.diplomatic_effectiveness,
            crisis_response_speed: metrics.crisis_response_speed,
            international_reputation: metrics.international_reputation,
            treaty_compliance: metrics.treaty_compliance_rate,
            citizen_satisfaction: metrics.citizen_satisfaction,
            overall_performance_score: (metrics.diplomatic_effectiveness + 
                                      metrics.crisis_response_speed + 
                                      metrics.international_reputation + 
                                      metrics.treaty_compliance_rate + 
                                      metrics.citizen_satisfaction) / 5
        };
    }

    identifySuccessIndicators() {
        const indicators = [];
        
        if (this.state.foreignPolicy.international_standing > 0.8) {
            indicators.push('strong_international_standing');
        }
        
        if (this.state.foreignPolicy.soft_power_index > 0.7) {
            indicators.push('effective_soft_power_projection');
        }
        
        const avgRelationshipStrength = this.calculateAverageRelationshipStrength();
        if (avgRelationshipStrength > 0.7) {
            indicators.push('strong_bilateral_relationships');
        }
        
        const multilateralInfluence = this.calculateMultilateralInfluence().average_influence;
        if (multilateralInfluence > 0.7) {
            indicators.push('significant_multilateral_influence');
        }
        
        return indicators;
    }

    identifyImprovementAreas() {
        const areas = [];
        
        if (this.state.foreignPolicy.international_standing < 0.6) {
            areas.push({
                area: 'international_standing',
                current_level: this.state.foreignPolicy.international_standing,
                target_level: 0.7,
                priority: 'high'
            });
        }
        
        if (this.state.foreignPolicy.soft_power_index < 0.6) {
            areas.push({
                area: 'soft_power_projection',
                current_level: this.state.foreignPolicy.soft_power_index,
                target_level: 0.7,
                priority: 'medium'
            });
        }
        
        const capacityUtilization = this.calculateCapacityUtilization();
        if (capacityUtilization < 0.7) {
            areas.push({
                area: 'diplomatic_capacity',
                current_level: capacityUtilization,
                target_level: 0.8,
                priority: 'medium'
            });
        }
        
        return areas;
    }

    calculateDiplomaticROI() {
        const investmentProxy = this.state.diplomaticRelations.diplomatic_staff * 100000; // Rough cost estimate
        const benefits = this.calculateDiplomaticBenefits();
        
        return {
            estimated_investment: investmentProxy,
            diplomatic_benefits: benefits,
            roi_ratio: benefits / investmentProxy,
            roi_assessment: this.assessROI(benefits / investmentProxy)
        };
    }

    calculateDiplomaticBenefits() {
        // Quantify diplomatic benefits (simplified)
        const tradeVolume = Array.from(this.state.bilateralRelations.values())
            .reduce((sum, rel) => sum + rel.trade_volume, 0);
        
        const softPowerValue = this.state.foreignPolicy.soft_power_index * 10000000000; // $10B max value
        const crisisPreventionValue = this.state.crisisManagement.conflict_mediation_experience * 5000000000; // $5B max value
        
        return tradeVolume * 0.01 + softPowerValue + crisisPreventionValue; // 1% of trade volume as diplomatic benefit
    }

    assessROI(ratio) {
        if (ratio > 5) return 'excellent';
        if (ratio > 3) return 'good';
        if (ratio > 1) return 'positive';
        return 'needs_improvement';
    }

    generateFallbackOutputs() {
        return {
            foreign_policy_status: {
                diplomatic_strategy: 'multilateral_engagement',
                international_standing: 0.7,
                soft_power_index: 0.65,
                policy_coherence: 0.7
            },
            diplomatic_relations_summary: {
                global_presence: { global_reach_index: 0.7 },
                diplomatic_capacity: { capacity_utilization: 0.7 }
            },
            bilateral_relationship_analysis: {
                relationship_trends: { overall_trend: 'stable' },
                cooperation_levels: { average_cooperation: 0.6 }
            },
            multilateral_engagement_status: {
                multilateral_influence: { average_influence: 0.6 },
                engagement_effectiveness: { overall_effectiveness: 0.6 }
            },
            economic_diplomacy_metrics: {
                economic_integration_level: 0.6,
                sanctions_effectiveness: { sanctions_utilization: 'moderate' }
            },
            cultural_diplomacy_impact: {
                soft_power_projection: { soft_power_index: 0.65 },
                cultural_influence: 0.6
            },
            crisis_management_capabilities: {
                response_effectiveness: { overall_effectiveness: 0.7 },
                emergency_preparedness: { preparedness_level: 0.7 }
            },
            diplomatic_performance_analysis: {
                effectiveness_assessment: { overall_performance_score: 0.7 },
                improvement_areas: []
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            diplomaticStrategy: this.state.foreignPolicy.diplomatic_strategy,
            internationalStanding: this.state.foreignPolicy.international_standing,
            softPowerIndex: this.state.foreignPolicy.soft_power_index,
            activeCrises: this.state.crisisManagement.diplomatic_crises.length,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.foreignPolicy.diplomatic_strategy = 'multilateral_engagement';
        this.state.foreignPolicy.international_standing = 0.7;
        this.state.crisisManagement.diplomatic_crises = [];
        console.log('🏛️ State Department System reset');
    }
}

module.exports = { StateSystem };
