// Diplomacy System - Manages inter-civilization diplomatic relations
// Input knobs for AI control, structured outputs for AI and game consumption

const DeterministicSystemInterface = require('../deterministic-system-interface.cjs');

class DiplomacySystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('DiplomacySystem');
        
        // Core diplomacy state
        this.diplomacyState = {
            // Bilateral relationships
            bilateralRelations: new Map(),
            
            // Multilateral agreements and organizations
            multilateralAgreements: new Map(),
            galacticOrganizations: new Map(),
            
            // Diplomatic activities
            activeDiplomacy: {
                negotiations: new Map(),
                summits: new Map(),
                crises: new Map(),
                mediations: new Map()
            },
            
            // Diplomatic resources
            diplomaticCorps: {
                ambassadors: new Map(),
                negotiators: 50,
                intelligence: 0.7,
                culturalExperts: 25
            },
            
            // Reputation and influence
            reputation: {
                trustworthiness: 0.75,
                reliability: 0.8,
                influence: 0.6,
                softPower: 0.65
            },
            
            // Diplomatic tools and capabilities
            tools: {
                economicLeverage: 0.6,
                militaryDeterrent: 0.5,
                culturalInfluence: 0.4,
                technologicalAdvantage: 0.3
            },
            
            lastUpdate: Date.now()
        };

        // Initialize known civilizations
        this.initializeCivilizations(config.knownCivilizations || [
            'terran_federation', 'centauri_republic', 'vegan_collective', 
            'kepler_technocracy', 'sirius_consortium'
        ]);

        // Define AI-adjustable input knobs
        this.addInputKnob('diplomatic_engagement_level', 'float', 0.7, 'Overall level of diplomatic engagement (0-1)', 0, 1);
        this.addInputKnob('alliance_building_priority', 'float', 0.6, 'Priority given to building alliances (0-1)', 0, 1);
        this.addInputKnob('trade_diplomacy_emphasis', 'float', 0.8, 'Emphasis on trade-based diplomacy (0-1)', 0, 1);
        this.addInputKnob('military_diplomacy_stance', 'float', 0.4, 'Use of military posturing in diplomacy (0-1)', 0, 1);
        this.addInputKnob('cultural_exchange_investment', 'float', 0.5, 'Investment in cultural exchange programs (0-1)', 0, 1);
        this.addInputKnob('multilateral_participation', 'float', 0.7, 'Participation in multilateral organizations (0-1)', 0, 1);
        this.addInputKnob('crisis_response_speed', 'float', 0.6, 'Speed of response to diplomatic crises (0-1)', 0, 1);
        this.addInputKnob('negotiation_flexibility', 'float', 0.5, 'Flexibility in negotiations (0-1)', 0, 1);
        this.addInputKnob('intelligence_sharing_openness', 'float', 0.3, 'Openness to intelligence sharing (0-1)', 0, 1);
        this.addInputKnob('diplomatic_transparency', 'float', 0.6, 'Level of diplomatic transparency (0-1)', 0, 1);
        this.addInputKnob('conflict_mediation_willingness', 'float', 0.7, 'Willingness to mediate conflicts (0-1)', 0, 1);
        this.addInputKnob('economic_sanctions_readiness', 'float', 0.4, 'Readiness to use economic sanctions (0-1)', 0, 1);

        // Define structured output channels
        this.addOutputChannel('diplomatic_relationship_status', 'map', 'Current status of relationships with all civilizations');
        this.addOutputChannel('active_negotiations_count', 'int', 'Number of ongoing diplomatic negotiations');
        this.addOutputChannel('alliance_network_strength', 'float', 'Strength of current alliance network (0-1)');
        this.addOutputChannel('diplomatic_influence_score', 'float', 'Overall diplomatic influence in the galaxy (0-1)');
        this.addOutputChannel('crisis_management_capacity', 'float', 'Capacity to handle diplomatic crises (0-1)');
        this.addOutputChannel('multilateral_engagement_level', 'float', 'Level of engagement in multilateral organizations (0-1)');
        this.addOutputChannel('diplomatic_opportunities', 'array', 'Identified diplomatic opportunities');
        this.addOutputChannel('relationship_stability_index', 'float', 'Stability of diplomatic relationships (0-1)');
        this.addOutputChannel('soft_power_projection', 'float', 'Effectiveness of soft power projection (0-1)');
        this.addOutputChannel('diplomatic_crisis_indicators', 'array', 'Early warning indicators of potential crises');
        this.addOutputChannel('negotiation_success_rate', 'float', 'Success rate of diplomatic negotiations (0-1)');
        this.addOutputChannel('galactic_reputation_score', 'float', 'Overall reputation in galactic community (0-1)');

        console.log('🤝 Diplomacy System initialized for inter-civilization relations');
    }

    initializeCivilizations(civilizations) {
        for (const civ of civilizations) {
            this.diplomacyState.bilateralRelations.set(civ, {
                relationshipLevel: 0.5, // Neutral starting point
                trustLevel: 0.5,
                tradeVolume: 0,
                militaryCooperation: 0,
                culturalExchange: 0,
                diplomaticHistory: [],
                activeAgreements: [],
                disputes: [],
                lastInteraction: Date.now(),
                relationshipTrend: 'stable'
            });

            // Initialize ambassador for each civilization
            this.diplomacyState.diplomaticCorps.ambassadors.set(civ, {
                experience: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
                culturalKnowledge: Math.random() * 0.4 + 0.4, // 0.4 to 0.8
                negotiationSkill: Math.random() * 0.3 + 0.5, // 0.5 to 0.8
                personalRelationships: Math.random() * 0.6 + 0.2 // 0.2 to 0.8
            });
        }
    }

    async processTick(gameState, aiInputs) {
        try {
            // Apply AI inputs to system parameters
            this.applyAIInputs(aiInputs);
            
            // Process bilateral relationships
            this.processBilateralRelations(gameState);
            
            // Process multilateral diplomacy
            this.processMultilateralDiplomacy(gameState);
            
            // Handle active negotiations
            this.processActiveNegotiations(gameState);
            
            // Manage diplomatic crises
            this.manageDiplomaticCrises(gameState);
            
            // Update reputation and influence
            this.updateReputationAndInfluence(gameState);
            
            // Process cultural exchanges
            this.processCulturalExchanges(gameState);
            
            // Generate diplomatic opportunities
            this.identifyDiplomaticOpportunities(gameState);
            
            // Generate structured outputs
            const outputs = this.generateOutputs();
            
            this.diplomacyState.lastUpdate = Date.now();
            
            return {
                success: true,
                outputs: outputs,
                systemState: this.getSystemSnapshot(),
                recommendations: this.generateDiplomaticRecommendations(gameState, aiInputs)
            };
            
        } catch (error) {
            console.error('🤝 Diplomacy System processing error:', error);
            return {
                success: false,
                error: error.message,
                outputs: this.generateOutputs()
            };
        }
    }

    applyAIInputs(aiInputs) {
        // Apply diplomatic stance parameters
        this.engagementLevel = aiInputs.diplomatic_engagement_level || 0.7;
        this.alliancePriority = aiInputs.alliance_building_priority || 0.6;
        this.tradeDiplomacyEmphasis = aiInputs.trade_diplomacy_emphasis || 0.8;
        this.militaryStance = aiInputs.military_diplomacy_stance || 0.4;
        
        // Apply program and policy parameters
        this.culturalExchangeInvestment = aiInputs.cultural_exchange_investment || 0.5;
        this.multilateralParticipation = aiInputs.multilateral_participation || 0.7;
        this.crisisResponseSpeed = aiInputs.crisis_response_speed || 0.6;
        this.negotiationFlexibility = aiInputs.negotiation_flexibility || 0.5;
        
        // Apply transparency and cooperation parameters
        this.intelligenceSharingOpenness = aiInputs.intelligence_sharing_openness || 0.3;
        this.diplomaticTransparency = aiInputs.diplomatic_transparency || 0.6;
        this.mediationWillingness = aiInputs.conflict_mediation_willingness || 0.7;
        this.sanctionsReadiness = aiInputs.economic_sanctions_readiness || 0.4;
    }

    processBilateralRelations(gameState) {
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            // Update relationship based on various factors
            this.updateBilateralRelationship(civId, relationship, gameState);
            
            // Process trade diplomacy effects
            this.processTradeRelationshipEffects(civId, relationship, gameState);
            
            // Handle military cooperation
            this.processMilitaryCooperation(civId, relationship, gameState);
            
            // Update cultural exchange
            this.updateCulturalExchange(civId, relationship, gameState);
            
            // Assess relationship stability
            this.assessRelationshipStability(civId, relationship);
        }
    }

    updateBilateralRelationship(civId, relationship, gameState) {
        let relationshipChange = 0;
        
        // Base diplomatic engagement effect
        relationshipChange += (this.engagementLevel - 0.5) * 0.02;
        
        // Trade volume effects (positive)
        const tradeEffect = Math.min(relationship.tradeVolume / 1000000, 0.5) * 0.03;
        relationshipChange += tradeEffect * this.tradeDiplomacyEmphasis;
        
        // Cultural exchange effects (positive)
        relationshipChange += relationship.culturalExchange * 0.02;
        
        // Military cooperation effects (can be positive or negative)
        const militaryEffect = relationship.militaryCooperation * 0.015;
        relationshipChange += militaryEffect;
        
        // Dispute effects (negative)
        const disputeEffect = -relationship.disputes.length * 0.01;
        relationshipChange += disputeEffect;
        
        // Random diplomatic events
        const randomEvent = (Math.random() - 0.5) * 0.01;
        relationshipChange += randomEvent;
        
        // Apply transparency bonus
        relationshipChange *= (1 + this.diplomaticTransparency * 0.1);
        
        // Update relationship level
        relationship.relationshipLevel = Math.max(-1, Math.min(1, 
            relationship.relationshipLevel + relationshipChange
        ));
        
        // Update trust level (slower to change)
        const trustChange = relationshipChange * 0.5;
        relationship.trustLevel = Math.max(0, Math.min(1, 
            relationship.trustLevel + trustChange
        ));
        
        // Determine relationship trend
        if (relationshipChange > 0.005) {
            relationship.relationshipTrend = 'improving';
        } else if (relationshipChange < -0.005) {
            relationship.relationshipTrend = 'deteriorating';
        } else {
            relationship.relationshipTrend = 'stable';
        }
        
        relationship.lastInteraction = Date.now();
    }

    processTradeRelationshipEffects(civId, relationship, gameState) {
        // Trade volume affects diplomatic relations
        const baseTradeVolume = this.getTradeVolumeWithCiv(civId, gameState);
        relationship.tradeVolume = baseTradeVolume;
        
        // Trade disputes can arise
        if (Math.random() < 0.02 && baseTradeVolume > 500000) { // 2% chance if significant trade
            this.createTradeDispute(civId, relationship);
        }
        
        // Resolve existing trade disputes
        this.resolveTradeDisputes(civId, relationship);
    }

    processMilitaryCooperation(civId, relationship, gameState) {
        // Military cooperation based on relationship level and military stance
        const targetCooperation = Math.max(0, relationship.relationshipLevel * this.militaryStance);
        
        // Gradual change towards target
        const changeRate = 0.05;
        const difference = targetCooperation - relationship.militaryCooperation;
        relationship.militaryCooperation += difference * changeRate;
        
        // Military cooperation affects relationship (can create tension or trust)
        if (relationship.militaryCooperation > 0.7) {
            // High military cooperation can create strong bonds or suspicion
            const effect = Math.random() > 0.7 ? 0.01 : -0.005;
            relationship.relationshipLevel += effect;
        }
    }

    updateCulturalExchange(civId, relationship, gameState) {
        // Cultural exchange based on investment and relationship level
        const targetExchange = Math.max(0, 
            this.culturalExchangeInvestment * (0.5 + relationship.relationshipLevel * 0.5)
        );
        
        // Gradual change towards target
        const changeRate = 0.08;
        const difference = targetExchange - relationship.culturalExchange;
        relationship.culturalExchange += difference * changeRate;
        
        // Cultural exchange improves soft power and relationships
        if (relationship.culturalExchange > 0.5) {
            this.diplomacyState.reputation.softPower += 0.001;
            this.diplomacyState.reputation.softPower = Math.min(1, this.diplomacyState.reputation.softPower);
        }
    }

    assessRelationshipStability(civId, relationship) {
        // Calculate stability based on various factors
        let stability = 0.5; // Base stability
        
        // Trust level affects stability
        stability += (relationship.trustLevel - 0.5) * 0.4;
        
        // Number of agreements affects stability (positive)
        stability += Math.min(relationship.activeAgreements.length / 10, 0.2);
        
        // Number of disputes affects stability (negative)
        stability -= Math.min(relationship.disputes.length / 5, 0.3);
        
        // Trade volume affects stability (positive)
        stability += Math.min(relationship.tradeVolume / 2000000, 0.2);
        
        // Cultural exchange affects stability (positive)
        stability += relationship.culturalExchange * 0.1;
        
        relationship.stability = Math.max(0, Math.min(1, stability));
    }

    processMultilateralDiplomacy(gameState) {
        // Process galactic organizations
        this.processGalacticOrganizations(gameState);
        
        // Handle multilateral agreements
        this.processMultilateralAgreements(gameState);
        
        // Participate in galactic governance
        this.participateInGalacticGovernance(gameState);
    }

    processGalacticOrganizations(gameState) {
        const organizations = ['galactic_trade_council', 'interstellar_security_alliance', 'cultural_exchange_union'];
        
        for (const org of organizations) {
            let orgData = this.diplomacyState.galacticOrganizations.get(org);
            
            if (!orgData) {
                orgData = {
                    membershipLevel: 0,
                    influence: 0,
                    contributions: 0,
                    benefits: 0,
                    lastActivity: Date.now()
                };
                this.diplomacyState.galacticOrganizations.set(org, orgData);
            }
            
            // Update membership level based on multilateral participation
            const targetMembership = this.multilateralParticipation;
            const membershipChange = (targetMembership - orgData.membershipLevel) * 0.1;
            orgData.membershipLevel += membershipChange;
            orgData.membershipLevel = Math.max(0, Math.min(1, orgData.membershipLevel));
            
            // Calculate influence within organization
            orgData.influence = orgData.membershipLevel * this.diplomacyState.reputation.influence;
            
            // Calculate contributions and benefits
            orgData.contributions = orgData.membershipLevel * 100000; // Simplified
            orgData.benefits = orgData.influence * 150000; // Benefits scale with influence
            
            orgData.lastActivity = Date.now();
        }
    }

    processMultilateralAgreements(gameState) {
        // Process existing multilateral agreements
        for (const [agreementId, agreement] of this.diplomacyState.multilateralAgreements) {
            this.updateMultilateralAgreement(agreementId, agreement, gameState);
        }
        
        // Consider new multilateral agreements
        if (Math.random() < 0.05 * this.multilateralParticipation) { // 5% base chance
            this.considerNewMultilateralAgreement(gameState);
        }
    }

    participateInGalacticGovernance(gameState) {
        // Participation in galactic governance affects reputation and influence
        const governanceParticipation = this.multilateralParticipation * this.engagementLevel;
        
        // Governance participation improves reputation
        this.diplomacyState.reputation.reliability += governanceParticipation * 0.001;
        this.diplomacyState.reputation.reliability = Math.min(1, this.diplomacyState.reputation.reliability);
        
        // Active participation increases influence
        this.diplomacyState.reputation.influence += governanceParticipation * 0.0005;
        this.diplomacyState.reputation.influence = Math.min(1, this.diplomacyState.reputation.influence);
    }

    processActiveNegotiations(gameState) {
        const negotiations = this.diplomacyState.activeDiplomacy.negotiations;
        
        for (const [negotiationId, negotiation] of negotiations) {
            // Update negotiation progress
            this.updateNegotiationProgress(negotiationId, negotiation, gameState);
            
            // Check for negotiation completion
            if (negotiation.progress >= 1.0) {
                this.completeNegotiation(negotiationId, negotiation);
            }
            
            // Check for negotiation failure
            if (negotiation.progress < 0) {
                this.failNegotiation(negotiationId, negotiation);
            }
        }
        
        // Initiate new negotiations based on opportunities
        this.initiateNewNegotiations(gameState);
    }

    updateNegotiationProgress(negotiationId, negotiation, gameState) {
        let progressChange = 0.05; // Base progress
        
        // Negotiation flexibility affects progress
        progressChange *= (0.5 + this.negotiationFlexibility * 0.5);
        
        // Ambassador skill affects progress
        const ambassador = this.diplomacyState.diplomaticCorps.ambassadors.get(negotiation.counterpart);
        if (ambassador) {
            progressChange *= (0.7 + ambassador.negotiationSkill * 0.3);
        }
        
        // Relationship level affects progress
        const relationship = this.diplomacyState.bilateralRelations.get(negotiation.counterpart);
        if (relationship) {
            progressChange *= (0.5 + relationship.relationshipLevel * 0.5 + 0.5);
        }
        
        // Random factors
        progressChange += (Math.random() - 0.5) * 0.02;
        
        negotiation.progress += progressChange;
        negotiation.lastUpdate = Date.now();
    }

    completeNegotiation(negotiationId, negotiation) {
        // Successful negotiation improves relationships and reputation
        const relationship = this.diplomacyState.bilateralRelations.get(negotiation.counterpart);
        if (relationship) {
            relationship.relationshipLevel += 0.05;
            relationship.trustLevel += 0.03;
            relationship.activeAgreements.push({
                type: negotiation.type,
                signedAt: Date.now(),
                terms: negotiation.terms
            });
        }
        
        // Improve negotiation success rate reputation
        this.diplomacyState.reputation.trustworthiness += 0.01;
        this.diplomacyState.reputation.trustworthiness = Math.min(1, this.diplomacyState.reputation.trustworthiness);
        
        // Remove completed negotiation
        this.diplomacyState.activeDiplomacy.negotiations.delete(negotiationId);
        
        console.log(`🤝 Negotiation ${negotiationId} completed successfully`);
    }

    failNegotiation(negotiationId, negotiation) {
        // Failed negotiation can strain relationships
        const relationship = this.diplomacyState.bilateralRelations.get(negotiation.counterpart);
        if (relationship) {
            relationship.relationshipLevel -= 0.02;
            relationship.trustLevel -= 0.01;
        }
        
        // Remove failed negotiation
        this.diplomacyState.activeDiplomacy.negotiations.delete(negotiationId);
        
        console.log(`🤝 Negotiation ${negotiationId} failed`);
    }

    initiateNewNegotiations(gameState) {
        // Look for negotiation opportunities
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (this.shouldInitiateNegotiation(civId, relationship, gameState)) {
                this.startNegotiation(civId, relationship, gameState);
            }
        }
    }

    shouldInitiateNegotiation(civId, relationship, gameState) {
        // Don't start too many negotiations at once
        if (this.diplomacyState.activeDiplomacy.negotiations.size > 5) {
            return false;
        }
        
        // Higher engagement level increases negotiation likelihood
        const baseChance = this.engagementLevel * 0.02; // 2% max chance per tick
        
        // Better relationships increase negotiation likelihood
        const relationshipBonus = Math.max(0, relationship.relationshipLevel) * 0.01;
        
        // Trade volume increases negotiation likelihood
        const tradeBonus = Math.min(relationship.tradeVolume / 1000000, 0.01);
        
        const totalChance = baseChance + relationshipBonus + tradeBonus;
        
        return Math.random() < totalChance;
    }

    startNegotiation(civId, relationship, gameState) {
        const negotiationTypes = ['trade_agreement', 'cultural_exchange', 'security_cooperation', 'technology_sharing'];
        const negotiationType = negotiationTypes[Math.floor(Math.random() * negotiationTypes.length)];
        
        const negotiationId = `negotiation_${Date.now()}_${civId}`;
        
        this.diplomacyState.activeDiplomacy.negotiations.set(negotiationId, {
            type: negotiationType,
            counterpart: civId,
            progress: 0,
            terms: this.generateNegotiationTerms(negotiationType, civId, relationship),
            startedAt: Date.now(),
            lastUpdate: Date.now()
        });
        
        console.log(`🤝 Started ${negotiationType} negotiation with ${civId}`);
    }

    manageDiplomaticCrises(gameState) {
        // Process existing crises
        for (const [crisisId, crisis] of this.diplomacyState.activeDiplomacy.crises) {
            this.processDiplomaticCrisis(crisisId, crisis, gameState);
        }
        
        // Check for new crises
        this.checkForNewCrises(gameState);
    }

    processDiplomaticCrisis(crisisId, crisis, gameState) {
        // Crisis resolution based on response speed and mediation willingness
        let resolutionProgress = this.crisisResponseSpeed * 0.1;
        
        // Mediation willingness helps resolve crises
        if (this.mediationWillingness > 0.5) {
            resolutionProgress *= 1.5;
        }
        
        // Ambassador experience helps
        const ambassador = this.diplomacyState.diplomaticCorps.ambassadors.get(crisis.involvedCiv);
        if (ambassador) {
            resolutionProgress *= (0.8 + ambassador.experience * 0.2);
        }
        
        crisis.resolutionProgress += resolutionProgress;
        
        // Check for crisis resolution
        if (crisis.resolutionProgress >= 1.0) {
            this.resolveCrisis(crisisId, crisis);
        }
        
        // Crisis escalation check
        if (Math.random() < 0.05 && crisis.resolutionProgress < 0.3) {
            this.escalateCrisis(crisisId, crisis);
        }
    }

    checkForNewCrises(gameState) {
        // Random diplomatic crises can emerge
        if (Math.random() < 0.01) { // 1% chance per tick
            this.createDiplomaticCrisis(gameState);
        }
    }

    createDiplomaticCrisis(gameState) {
        const civilizations = Array.from(this.diplomacyState.bilateralRelations.keys());
        const involvedCiv = civilizations[Math.floor(Math.random() * civilizations.length)];
        
        const crisisTypes = ['trade_dispute', 'border_incident', 'espionage_accusation', 'cultural_misunderstanding'];
        const crisisType = crisisTypes[Math.floor(Math.random() * crisisTypes.length)];
        
        const crisisId = `crisis_${Date.now()}_${involvedCiv}`;
        
        this.diplomacyState.activeDiplomacy.crises.set(crisisId, {
            type: crisisType,
            involvedCiv: involvedCiv,
            severity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
            resolutionProgress: 0,
            startedAt: Date.now(),
            lastUpdate: Date.now()
        });
        
        // Crisis affects relationship
        const relationship = this.diplomacyState.bilateralRelations.get(involvedCiv);
        if (relationship) {
            relationship.relationshipLevel -= 0.1;
            relationship.disputes.push({
                type: crisisType,
                startedAt: Date.now(),
                status: 'active'
            });
        }
        
        console.log(`🚨 Diplomatic crisis (${crisisType}) with ${involvedCiv}`);
    }

    resolveCrisis(crisisId, crisis) {
        // Crisis resolution improves reputation
        this.diplomacyState.reputation.reliability += 0.02;
        this.diplomacyState.reputation.reliability = Math.min(1, this.diplomacyState.reputation.reliability);
        
        // Improve relationship with involved civilization
        const relationship = this.diplomacyState.bilateralRelations.get(crisis.involvedCiv);
        if (relationship) {
            relationship.relationshipLevel += 0.05;
            
            // Mark dispute as resolved
            const dispute = relationship.disputes.find(d => d.type === crisis.type && d.status === 'active');
            if (dispute) {
                dispute.status = 'resolved';
                dispute.resolvedAt = Date.now();
            }
        }
        
        // Remove resolved crisis
        this.diplomacyState.activeDiplomacy.crises.delete(crisisId);
        
        console.log(`✅ Diplomatic crisis ${crisisId} resolved`);
    }

    escalateCrisis(crisisId, crisis) {
        crisis.severity = Math.min(1, crisis.severity + 0.2);
        
        // Escalation further damages relationship
        const relationship = this.diplomacyState.bilateralRelations.get(crisis.involvedCiv);
        if (relationship) {
            relationship.relationshipLevel -= 0.05;
            relationship.trustLevel -= 0.03;
        }
        
        console.log(`⚠️ Diplomatic crisis ${crisisId} escalated`);
    }

    updateReputationAndInfluence(gameState) {
        const reputation = this.diplomacyState.reputation;
        
        // Trustworthiness based on agreement compliance and transparency
        let trustworthinessChange = this.diplomaticTransparency * 0.001;
        trustworthinessChange -= this.getAgreementViolations() * 0.005;
        reputation.trustworthiness += trustworthinessChange;
        reputation.trustworthiness = Math.max(0, Math.min(1, reputation.trustworthiness));
        
        // Reliability based on crisis management and consistency
        let reliabilityChange = this.crisisResponseSpeed * 0.0005;
        reliabilityChange -= this.getInconsistentActions() * 0.002;
        reputation.reliability += reliabilityChange;
        reputation.reliability = Math.max(0, Math.min(1, reputation.reliability));
        
        // Influence based on successful negotiations and multilateral participation
        let influenceChange = this.getNegotiationSuccesses() * 0.001;
        influenceChange += this.multilateralParticipation * 0.0005;
        reputation.influence += influenceChange;
        reputation.influence = Math.max(0, Math.min(1, reputation.influence));
        
        // Soft power based on cultural exchange and positive relationships
        let softPowerChange = this.culturalExchangeInvestment * 0.0008;
        softPowerChange += this.getPositiveRelationships() * 0.0003;
        reputation.softPower += softPowerChange;
        reputation.softPower = Math.max(0, Math.min(1, reputation.softPower));
    }

    processCulturalExchanges(gameState) {
        // Cultural exchanges improve relationships and soft power
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.culturalExchange > 0.3) {
                // Positive cultural exchange effects
                relationship.relationshipLevel += 0.001;
                this.diplomacyState.reputation.softPower += 0.0002;
            }
        }
    }

    identifyDiplomaticOpportunities(gameState) {
        this.diplomaticOpportunities = [];
        
        // Alliance opportunities
        this.identifyAllianceOpportunities();
        
        // Trade agreement opportunities
        this.identifyTradeOpportunities();
        
        // Mediation opportunities
        this.identifyMediationOpportunities();
        
        // Cultural exchange opportunities
        this.identifyCulturalOpportunities();
    }

    identifyAllianceOpportunities() {
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.relationshipLevel > 0.6 && 
                relationship.trustLevel > 0.7 && 
                relationship.activeAgreements.length > 2) {
                
                this.diplomaticOpportunities.push({
                    type: 'alliance_opportunity',
                    civilization: civId,
                    potential: 'high',
                    requirements: ['formal_alliance_proposal', 'security_cooperation_agreement'],
                    benefits: ['mutual_defense', 'enhanced_trade', 'technology_sharing']
                });
            }
        }
    }

    identifyTradeOpportunities() {
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.tradeVolume > 0 && 
                relationship.relationshipLevel > 0.3 && 
                relationship.disputes.length === 0) {
                
                this.diplomaticOpportunities.push({
                    type: 'trade_expansion',
                    civilization: civId,
                    potential: 'medium',
                    currentVolume: relationship.tradeVolume,
                    projectedIncrease: '25-40%'
                });
            }
        }
    }

    identifyMediationOpportunities() {
        // Look for conflicts between other civilizations where we could mediate
        if (this.mediationWillingness > 0.6 && this.diplomacyState.reputation.trustworthiness > 0.7) {
            this.diplomaticOpportunities.push({
                type: 'mediation_opportunity',
                description: 'Opportunity to mediate inter-civilization conflict',
                potential: 'medium',
                benefits: ['reputation_boost', 'influence_increase', 'relationship_improvement']
            });
        }
    }

    identifyCulturalOpportunities() {
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.culturalExchange < 0.3 && relationship.relationshipLevel > 0.2) {
                this.diplomaticOpportunities.push({
                    type: 'cultural_exchange_expansion',
                    civilization: civId,
                    potential: 'low',
                    currentLevel: relationship.culturalExchange,
                    benefits: ['soft_power_increase', 'relationship_improvement']
                });
            }
        }
    }

    generateOutputs() {
        // Calculate relationship status
        const relationshipStatus = new Map();
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            relationshipStatus.set(civId, {
                level: relationship.relationshipLevel,
                trust: relationship.trustLevel,
                trend: relationship.relationshipTrend,
                stability: relationship.stability || 0.5
            });
        }
        
        // Calculate alliance network strength
        const allianceStrength = this.calculateAllianceNetworkStrength();
        
        // Calculate crisis management capacity
        const crisisCapacity = this.calculateCrisisManagementCapacity();
        
        // Calculate relationship stability index
        const stabilityIndex = this.calculateRelationshipStabilityIndex();
        
        // Calculate negotiation success rate
        const negotiationSuccessRate = this.calculateNegotiationSuccessRate();
        
        // Get crisis indicators
        const crisisIndicators = this.getDiplomaticCrisisIndicators();
        
        return {
            diplomatic_relationship_status: relationshipStatus,
            active_negotiations_count: this.diplomacyState.activeDiplomacy.negotiations.size,
            alliance_network_strength: allianceStrength,
            diplomatic_influence_score: this.diplomacyState.reputation.influence,
            crisis_management_capacity: crisisCapacity,
            multilateral_engagement_level: this.multilateralParticipation,
            diplomatic_opportunities: this.diplomaticOpportunities || [],
            relationship_stability_index: stabilityIndex,
            soft_power_projection: this.diplomacyState.reputation.softPower,
            diplomatic_crisis_indicators: crisisIndicators,
            negotiation_success_rate: negotiationSuccessRate,
            galactic_reputation_score: this.calculateOverallReputation()
        };
    }

    generateDiplomaticRecommendations(gameState, aiInputs) {
        const recommendations = [];
        
        // Relationship management recommendations
        const deterioratingRelationships = this.getDeterioratingRelationships();
        if (deterioratingRelationships.length > 0) {
            recommendations.push({
                type: 'relationship_management',
                priority: 'high',
                message: `${deterioratingRelationships.length} relationships are deteriorating. Consider increasing diplomatic engagement.`,
                suggestedAction: 'increase_diplomatic_engagement_level'
            });
        }
        
        // Crisis management recommendations
        if (this.diplomacyState.activeDiplomacy.crises.size > 3) {
            recommendations.push({
                type: 'crisis_management',
                priority: 'high',
                message: 'Multiple diplomatic crises active. Consider improving crisis response speed.',
                suggestedAction: 'increase_crisis_response_speed'
            });
        }
        
        // Alliance building recommendations
        const allianceStrength = this.calculateAllianceNetworkStrength();
        if (allianceStrength < 0.4 && this.alliancePriority > 0.6) {
            recommendations.push({
                type: 'alliance_building',
                priority: 'medium',
                message: 'Alliance network is weak despite high priority. Consider targeted relationship building.',
                suggestedAction: 'increase_alliance_building_priority'
            });
        }
        
        // Multilateral engagement recommendations
        const avgOrgMembership = this.getAverageOrganizationMembership();
        if (avgOrgMembership < 0.5 && this.multilateralParticipation > 0.6) {
            recommendations.push({
                type: 'multilateral_engagement',
                priority: 'medium',
                message: 'Low organization membership despite high participation setting. Review multilateral strategy.',
                suggestedAction: 'increase_multilateral_participation'
            });
        }
        
        return recommendations;
    }

    // Helper calculation methods
    calculateAllianceNetworkStrength() {
        let totalStrength = 0;
        let allianceCount = 0;
        
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            const hasAlliance = relationship.activeAgreements.some(agreement => 
                agreement.type === 'alliance' || agreement.type === 'mutual_defense'
            );
            
            if (hasAlliance) {
                totalStrength += relationship.relationshipLevel * relationship.trustLevel;
                allianceCount++;
            }
        }
        
        return allianceCount > 0 ? totalStrength / allianceCount : 0;
    }

    calculateCrisisManagementCapacity() {
        const baseCap = this.crisisResponseSpeed * 0.6;
        const experienceBonus = this.getAverageAmbassadorExperience() * 0.2;
        const reputationBonus = this.diplomacyState.reputation.reliability * 0.2;
        
        return Math.min(1, baseCap + experienceBonus + reputationBonus);
    }

    calculateRelationshipStabilityIndex() {
        let totalStability = 0;
        let count = 0;
        
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            totalStability += relationship.stability || 0.5;
            count++;
        }
        
        return count > 0 ? totalStability / count : 0.5;
    }

    calculateNegotiationSuccessRate() {
        // Simplified calculation based on reputation and flexibility
        const baseRate = 0.6;
        const reputationBonus = this.diplomacyState.reputation.trustworthiness * 0.2;
        const flexibilityBonus = this.negotiationFlexibility * 0.15;
        const experienceBonus = this.getAverageAmbassadorExperience() * 0.05;
        
        return Math.min(1, baseRate + reputationBonus + flexibilityBonus + experienceBonus);
    }

    calculateOverallReputation() {
        const reputation = this.diplomacyState.reputation;
        return (reputation.trustworthiness + reputation.reliability + 
                reputation.influence + reputation.softPower) / 4;
    }

    getDiplomaticCrisisIndicators() {
        const indicators = [];
        
        // Relationship deterioration indicators
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.relationshipTrend === 'deteriorating' && relationship.relationshipLevel < 0.3) {
                indicators.push({
                    type: 'relationship_crisis_risk',
                    civilization: civId,
                    severity: 'medium',
                    factors: ['deteriorating_relationship', 'low_trust_level']
                });
            }
        }
        
        // Trade dispute indicators
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.disputes.length > 2) {
                indicators.push({
                    type: 'escalation_risk',
                    civilization: civId,
                    severity: 'high',
                    factors: ['multiple_disputes', 'unresolved_conflicts']
                });
            }
        }
        
        return indicators;
    }

    getDeterioratingRelationships() {
        const deteriorating = [];
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            if (relationship.relationshipTrend === 'deteriorating') {
                deteriorating.push(civId);
            }
        }
        return deteriorating;
    }

    getAverageOrganizationMembership() {
        let totalMembership = 0;
        let count = 0;
        
        for (const [orgId, orgData] of this.diplomacyState.galacticOrganizations) {
            totalMembership += orgData.membershipLevel;
            count++;
        }
        
        return count > 0 ? totalMembership / count : 0;
    }

    getAverageAmbassadorExperience() {
        let totalExperience = 0;
        let count = 0;
        
        for (const [civId, ambassador] of this.diplomacyState.diplomaticCorps.ambassadors) {
            totalExperience += ambassador.experience;
            count++;
        }
        
        return count > 0 ? totalExperience / count : 0.5;
    }

    // Simplified helper methods for game state analysis
    getTradeVolumeWithCiv(civId, gameState) {
        // Simplified - would integrate with trade system
        return Math.random() * 1000000 + 100000;
    }

    getAgreementViolations() { return Math.random() * 0.1; }
    getInconsistentActions() { return Math.random() * 0.05; }
    getNegotiationSuccesses() { return Math.random() * 0.3; }
    getPositiveRelationships() { return Math.random() * 0.5; }

    createTradeDispute(civId, relationship) {
        relationship.disputes.push({
            type: 'trade_dispute',
            startedAt: Date.now(),
            status: 'active',
            severity: Math.random() * 0.5 + 0.2
        });
    }

    resolveTradeDisputes(civId, relationship) {
        // Simple dispute resolution
        relationship.disputes = relationship.disputes.filter(dispute => {
            if (dispute.status === 'active' && Math.random() < 0.1) {
                dispute.status = 'resolved';
                dispute.resolvedAt = Date.now();
                return false; // Remove resolved disputes
            }
            return true;
        });
    }

    updateMultilateralAgreement(agreementId, agreement, gameState) {
        // Simplified multilateral agreement processing
        agreement.effectiveness = Math.min(1, agreement.effectiveness + 0.01);
        agreement.lastUpdate = Date.now();
    }

    considerNewMultilateralAgreement(gameState) {
        const agreementTypes = ['environmental_protection', 'technology_sharing', 'security_cooperation'];
        const agreementType = agreementTypes[Math.floor(Math.random() * agreementTypes.length)];
        
        const agreementId = `multilateral_${Date.now()}_${agreementType}`;
        
        this.diplomacyState.multilateralAgreements.set(agreementId, {
            type: agreementType,
            participants: Math.floor(Math.random() * 4) + 2, // 2-5 participants
            effectiveness: 0.3,
            createdAt: Date.now(),
            lastUpdate: Date.now()
        });
    }

    generateNegotiationTerms(negotiationType, civId, relationship) {
        // Simplified term generation
        const baseTerms = {
            duration: Math.floor(Math.random() * 5) + 1, // 1-5 years
            scope: Math.random() > 0.5 ? 'bilateral' : 'limited',
            renewalOption: Math.random() > 0.3
        };
        
        switch (negotiationType) {
            case 'trade_agreement':
                return {
                    ...baseTerms,
                    tariffReduction: Math.random() * 0.5,
                    tradeVolumeTarget: relationship.tradeVolume * (1 + Math.random() * 0.5)
                };
            case 'cultural_exchange':
                return {
                    ...baseTerms,
                    exchangePrograms: Math.floor(Math.random() * 10) + 5,
                    fundingCommitment: Math.random() * 1000000
                };
            case 'security_cooperation':
                return {
                    ...baseTerms,
                    intelligenceSharing: Math.random() > 0.6,
                    jointExercises: Math.floor(Math.random() * 4) + 1
                };
            default:
                return baseTerms;
        }
    }

    getSystemSnapshot() {
        return {
            totalRelationships: this.diplomacyState.bilateralRelations.size,
            averageRelationshipLevel: this.calculateAverageRelationshipLevel(),
            activeNegotiations: this.diplomacyState.activeDiplomacy.negotiations.size,
            activeCrises: this.diplomacyState.activeDiplomacy.crises.size,
            overallReputation: this.calculateOverallReputation(),
            allianceNetworkStrength: this.calculateAllianceNetworkStrength(),
            multilateralMemberships: this.diplomacyState.galacticOrganizations.size,
            lastUpdate: this.diplomacyState.lastUpdate
        };
    }

    calculateAverageRelationshipLevel() {
        let total = 0;
        let count = 0;
        
        for (const [civId, relationship] of this.diplomacyState.bilateralRelations) {
            total += relationship.relationshipLevel;
            count++;
        }
        
        return count > 0 ? total / count : 0;
    }

    // Public API methods for integration with existing diplomacy APIs
    getRelationshipStatus(civilizationId) {
        return this.diplomacyState.bilateralRelations.get(civilizationId);
    }

    getAllRelationships() {
        return this.diplomacyState.bilateralRelations;
    }

    startDiplomaticAction(actionType, targetCivilization, parameters) {
        switch (actionType) {
            case 'negotiate':
                return this.startNegotiation(targetCivilization, 
                    this.diplomacyState.bilateralRelations.get(targetCivilization), {});
            case 'mediate':
                return this.offerMediation(targetCivilization, parameters);
            case 'sanction':
                return this.imposeSanctions(targetCivilization, parameters);
            default:
                return { success: false, message: 'Unknown diplomatic action' };
        }
    }

    offerMediation(targetCivilization, parameters) {
        // Simplified mediation offer
        return {
            success: true,
            message: `Mediation offered to ${targetCivilization}`,
            mediationId: `mediation_${Date.now()}_${targetCivilization}`
        };
    }

    imposeSanctions(targetCivilization, parameters) {
        // Simplified sanctions implementation
        const relationship = this.diplomacyState.bilateralRelations.get(targetCivilization);
        if (relationship) {
            relationship.relationshipLevel -= 0.2;
            relationship.trustLevel -= 0.15;
        }
        
        return {
            success: true,
            message: `Sanctions imposed on ${targetCivilization}`,
            impact: 'relationship_deterioration'
        };
    }
}

module.exports = DiplomacySystem;
