// Diplomacy AI - Manages inter-civilization relationships, negotiations, and diplomatic events
// Integrates with Enhanced Knob APIs for dynamic diplomatic behavior

const EventEmitter = require('events');

class DiplomacyAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            processingInterval: config.processingInterval || 60000, // 60 seconds
            maxNegotiationsPerTick: config.maxNegotiationsPerTick || 10,
            decisionComplexity: config.decisionComplexity || 'very_high',
            
            // Diplomatic Behavior Parameters
            negotiationComplexity: config.negotiationComplexity || 0.8,
            trustBuilding: config.trustBuilding || 0.7,
            conflictResolution: config.conflictResolution || 0.8,
            
            ...config
        };
        
        this.civilizations = new Map(); // civId -> civilization data
        this.diplomaticRelations = new Map(); // relationId -> diplomatic relationship
        this.activeNegotiations = new Map(); // negotiationId -> negotiation data
        this.treaties = new Map(); // treatyId -> treaty data
        this.diplomaticEvents = new Map(); // eventId -> event data
        
        this.isProcessing = false;
        this.lastUpdate = Date.now();
        
        // Enhanced Knob Integration
        this.knobEndpoints = {
            state: '/api/state/knobs',
            intelligence: '/api/intelligence/knobs',
            military: '/api/military/knobs',
            commerce: '/api/commerce/knobs',
            governance: '/api/governance/knobs',
            characters: '/api/characters/knobs'
        };
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processDiplomaticActions(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('🤝 Processing Diplomacy AI actions...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Update diplomatic relations based on current events
            await this.updateDiplomaticRelations(gameState, knobSettings);
            
            // Process active negotiations
            const negotiationResults = await this.processActiveNegotiations(knobSettings);
            
            // Generate new diplomatic initiatives
            const newInitiatives = await this.generateDiplomaticInitiatives(gameState, knobSettings);
            
            // Handle diplomatic crises and opportunities
            const crisisResponses = await this.handleDiplomaticCrises(gameState, knobSettings);
            
            // Apply all diplomatic actions
            const effects = await this.applyDiplomaticActions([...negotiationResults, ...newInitiatives, ...crisisResponses], knobSettings);
            
            this.emit('diplomatic-actions', {
                timestamp: Date.now(),
                negotiations: negotiationResults.length,
                initiatives: newInitiatives.length,
                crises: crisisResponses.length,
                effects,
                relations: this.diplomaticRelations.size,
                treaties: this.treaties.size
            });
            
            console.log(`✅ Processed ${negotiationResults.length + newInitiatives.length + crisisResponses.length} diplomatic actions`);
            
        } catch (error) {
            console.error('❌ Diplomacy AI processing error:', error);
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
            console.error('Error fetching diplomacy knob settings:', error);
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
    
    // ===== DIPLOMATIC RELATIONS MANAGEMENT =====
    
    async updateDiplomaticRelations(gameState, knobSettings) {
        const state = knobSettings.state || {};
        const intelligence = knobSettings.intelligence || {};
        
        // Update relations based on recent events and knob settings
        for (const [relationId, relation] of this.diplomaticRelations.entries()) {
            try {
                // Analyze current diplomatic climate
                const climate = await this.analyzeDiplomaticClimate(relation, gameState, knobSettings);
                
                // Update relation strength based on climate and knob settings
                const relationshipStrength = state.diplomatic_relationship_strength || 0.5;
                const conflictResolution = state.conflict_resolution_effectiveness || 0.5;
                
                // Apply climate effects
                if (climate.tension > 0.7 && conflictResolution < 0.5) {
                    relation.trust -= 0.05;
                    relation.cooperation -= 0.03;
                } else if (climate.cooperation > 0.7 && relationshipStrength > 0.6) {
                    relation.trust += 0.03;
                    relation.cooperation += 0.02;
                }
                
                // Update relation history
                relation.history.push({
                    timestamp: Date.now(),
                    climate,
                    trust: relation.trust,
                    cooperation: relation.cooperation
                });
                
                // Keep only recent history
                if (relation.history.length > 10) {
                    relation.history = relation.history.slice(-10);
                }
                
            } catch (error) {
                console.error(`Error updating diplomatic relation ${relationId}:`, error);
            }
        }
    }
    
    async analyzeDiplomaticClimate(relation, gameState, knobSettings) {
        const intelligence = knobSettings.intelligence || {};
        const military = knobSettings.military || {};
        
        // Analyze various factors affecting diplomatic climate
        const factors = {
            // Economic factors
            tradeVolume: this.calculateTradeVolume(relation),
            economicDependency: this.calculateEconomicDependency(relation),
            
            // Military factors
            militaryBalance: this.calculateMilitaryBalance(relation),
            threatPerception: intelligence.threat_assessment_accuracy || 0.5,
            
            // Political factors
            ideologicalAlignment: this.calculateIdeologicalAlignment(relation),
            leadershipStability: this.calculateLeadershipStability(relation),
            
            // Recent events
            recentConflicts: this.getRecentConflicts(relation),
            recentCooperation: this.getRecentCooperation(relation)
        };
        
        // Calculate overall climate metrics
        const tension = Math.max(0, Math.min(1, 
            (factors.militaryBalance * 0.3) + 
            (factors.threatPerception * 0.2) + 
            (factors.recentConflicts * 0.3) + 
            ((1 - factors.ideologicalAlignment) * 0.2)
        ));
        
        const cooperation = Math.max(0, Math.min(1,
            (factors.tradeVolume * 0.3) +
            (factors.economicDependency * 0.2) +
            (factors.recentCooperation * 0.3) +
            (factors.ideologicalAlignment * 0.2)
        ));
        
        return {
            tension,
            cooperation,
            stability: 1 - Math.abs(tension - cooperation),
            factors
        };
    }
    
    // ===== NEGOTIATION PROCESSING =====
    
    async processActiveNegotiations(knobSettings) {
        const results = [];
        const state = knobSettings.state || {};
        
        for (const [negotiationId, negotiation] of this.activeNegotiations.entries()) {
            try {
                // Process negotiation based on current state
                const result = await this.processNegotiation(negotiation, knobSettings);
                
                if (result.completed) {
                    // Remove from active negotiations
                    this.activeNegotiations.delete(negotiationId);
                    
                    // Create treaty if successful
                    if (result.success) {
                        await this.createTreaty(result.treaty);
                    }
                }
                
                results.push(result);
                
            } catch (error) {
                console.error(`Error processing negotiation ${negotiationId}:`, error);
            }
        }
        
        return results;
    }
    
    async processNegotiation(negotiation, knobSettings) {
        const state = knobSettings.state || {};
        const characters = knobSettings.characters || {};
        
        // Get negotiation parameters from knobs
        const negotiationEffectiveness = state.negotiation_effectiveness || 0.5;
        const diplomaticSkill = characters.diplomatic_skill_level || 0.5;
        const culturalSensitivity = state.cultural_sensitivity || 0.5;
        
        // Calculate negotiation progress
        const progressFactor = (negotiationEffectiveness + diplomaticSkill + culturalSensitivity) / 3;
        negotiation.progress += progressFactor * 0.2;
        
        // Determine if negotiation is complete
        const completed = negotiation.progress >= 1.0 || Date.now() - negotiation.startTime > negotiation.maxDuration;
        
        let success = false;
        let treaty = null;
        
        if (completed) {
            // Determine success based on progress and relationship factors
            const relation = this.diplomaticRelations.get(negotiation.relationId);
            const successProbability = (negotiation.progress * 0.6) + (relation.trust * 0.4);
            
            success = Math.random() < successProbability;
            
            if (success) {
                treaty = await this.generateTreaty(negotiation, knobSettings);
            }
        }
        
        return {
            id: `negotiation_result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            negotiationId: negotiation.id,
            type: 'negotiation_result',
            completed,
            success,
            treaty,
            progress: negotiation.progress,
            consequences: success ? this.generateNegotiationSuccessConsequences(negotiation) : this.generateNegotiationFailureConsequences(negotiation)
        };
    }
    
    async generateTreaty(negotiation, knobSettings) {
        const treaty = {
            id: `treaty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: negotiation.type,
            parties: negotiation.parties,
            terms: await this.generateTreatyTerms(negotiation, knobSettings),
            duration: negotiation.proposedDuration || 365 * 24 * 60 * 60 * 1000, // 1 year default
            signed: Date.now(),
            status: 'active'
        };
        
        return treaty;
    }
    
    async generateTreatyTerms(negotiation, knobSettings) {
        const terms = [];
        
        switch (negotiation.type) {
            case 'trade_agreement':
                terms.push({
                    type: 'trade_tariff_reduction',
                    value: 0.5,
                    description: 'Reduce trade tariffs by 50%'
                });
                terms.push({
                    type: 'market_access',
                    value: 1.0,
                    description: 'Grant full market access'
                });
                break;
                
            case 'defense_pact':
                terms.push({
                    type: 'mutual_defense',
                    value: 1.0,
                    description: 'Mutual defense against external threats'
                });
                terms.push({
                    type: 'intelligence_sharing',
                    value: 0.7,
                    description: 'Share 70% of intelligence information'
                });
                break;
                
            case 'cultural_exchange':
                terms.push({
                    type: 'student_exchange',
                    value: 1000,
                    description: 'Exchange 1000 students annually'
                });
                terms.push({
                    type: 'cultural_programs',
                    value: 0.8,
                    description: 'Support cultural programs at 80% funding'
                });
                break;
                
            case 'peace_treaty':
                terms.push({
                    type: 'ceasefire',
                    value: 1.0,
                    description: 'Immediate and permanent ceasefire'
                });
                terms.push({
                    type: 'reparations',
                    value: negotiation.reparationAmount || 0,
                    description: 'War reparations if applicable'
                });
                break;
        }
        
        return terms;
    }
    
    // ===== DIPLOMATIC INITIATIVES =====
    
    async generateDiplomaticInitiatives(gameState, knobSettings) {
        const initiatives = [];
        const state = knobSettings.state || {};
        
        // Generate initiatives based on current diplomatic climate
        const relations = Array.from(this.diplomaticRelations.values());
        
        for (const relation of relations.slice(0, this.config.maxNegotiationsPerTick)) {
            try {
                const climate = await this.analyzeDiplomaticClimate(relation, gameState, knobSettings);
                
                // Trade initiatives
                if (climate.cooperation > 0.6 && Math.random() < 0.3) {
                    initiatives.push(await this.generateTradeInitiative(relation, knobSettings));
                }
                
                // Peace initiatives for high tension
                if (climate.tension > 0.7 && Math.random() < 0.4) {
                    initiatives.push(await this.generatePeaceInitiative(relation, knobSettings));
                }
                
                // Cultural exchange for stable relations
                if (climate.stability > 0.7 && Math.random() < 0.2) {
                    initiatives.push(await this.generateCulturalInitiative(relation, knobSettings));
                }
                
                // Defense cooperation for trusted allies
                if (relation.trust > 0.8 && climate.cooperation > 0.7 && Math.random() < 0.1) {
                    initiatives.push(await this.generateDefenseInitiative(relation, knobSettings));
                }
                
            } catch (error) {
                console.error(`Error generating initiative for relation ${relation.id}:`, error);
            }
        }
        
        return initiatives.filter(init => init !== null);
    }
    
    async generateTradeInitiative(relation, knobSettings) {
        const commerce = knobSettings.commerce || {};
        
        return {
            id: `initiative_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'trade_initiative',
            action: 'propose_trade_agreement',
            relationId: relation.id,
            parties: [relation.civilization1Id, relation.civilization2Id],
            reasoning: 'High cooperation levels favor trade expansion',
            consequences: {
                state: {
                    trade_agreement_success: '+1',
                    economic_diplomacy: 'high'
                },
                commerce: {
                    international_trade_volume: '+2',
                    trade_relationship_strength: '+1'
                }
            },
            negotiationParams: {
                type: 'trade_agreement',
                maxDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
                complexity: 'medium'
            }
        };
    }
    
    async generatePeaceInitiative(relation, knobSettings) {
        const state = knobSettings.state || {};
        
        return {
            id: `initiative_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'peace_initiative',
            action: 'propose_peace_talks',
            relationId: relation.id,
            parties: [relation.civilization1Id, relation.civilization2Id],
            reasoning: 'High tension requires diplomatic intervention',
            consequences: {
                state: {
                    conflict_resolution_effectiveness: '+2',
                    peace_negotiation_success: '+1'
                },
                military: {
                    conflict_de_escalation: 'high',
                    diplomatic_solution_preference: '+1'
                }
            },
            negotiationParams: {
                type: 'peace_treaty',
                maxDuration: 60 * 24 * 60 * 60 * 1000, // 60 days
                complexity: 'high'
            }
        };
    }
    
    async generateCulturalInitiative(relation, knobSettings) {
        const characters = knobSettings.characters || {};
        
        return {
            id: `initiative_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'cultural_initiative',
            action: 'propose_cultural_exchange',
            relationId: relation.id,
            parties: [relation.civilization1Id, relation.civilization2Id],
            reasoning: 'Stable relations enable cultural cooperation',
            consequences: {
                state: {
                    cultural_diplomacy: '+2',
                    soft_power_projection: 'high'
                },
                characters: {
                    cultural_awareness: '+1',
                    international_understanding: '+1'
                }
            },
            negotiationParams: {
                type: 'cultural_exchange',
                maxDuration: 45 * 24 * 60 * 60 * 1000, // 45 days
                complexity: 'low'
            }
        };
    }
    
    async generateDefenseInitiative(relation, knobSettings) {
        const military = knobSettings.military || {};
        
        return {
            id: `initiative_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'defense_initiative',
            action: 'propose_defense_pact',
            relationId: relation.id,
            parties: [relation.civilization1Id, relation.civilization2Id],
            reasoning: 'High trust and cooperation enable defense cooperation',
            consequences: {
                state: {
                    alliance_strength: '+2',
                    security_cooperation: 'high'
                },
                military: {
                    alliance_coordination: '+2',
                    collective_defense_capability: '+1'
                },
                intelligence: {
                    intelligence_sharing: '+1',
                    threat_assessment_accuracy: '+1'
                }
            },
            negotiationParams: {
                type: 'defense_pact',
                maxDuration: 90 * 24 * 60 * 60 * 1000, // 90 days
                complexity: 'very_high'
            }
        };
    }
    
    // ===== CRISIS MANAGEMENT =====
    
    async handleDiplomaticCrises(gameState, knobSettings) {
        const responses = [];
        const state = knobSettings.state || {};
        
        // Identify current crises
        const crises = await this.identifyDiplomaticCrises(gameState, knobSettings);
        
        for (const crisis of crises) {
            try {
                const response = await this.generateCrisisResponse(crisis, knobSettings);
                if (response) {
                    responses.push(response);
                }
            } catch (error) {
                console.error(`Error handling crisis ${crisis.id}:`, error);
            }
        }
        
        return responses;
    }
    
    async identifyDiplomaticCrises(gameState, knobSettings) {
        const crises = [];
        
        // Check for high-tension relationships
        for (const relation of this.diplomaticRelations.values()) {
            const climate = await this.analyzeDiplomaticClimate(relation, gameState, knobSettings);
            
            if (climate.tension > 0.8 && relation.trust < 0.3) {
                crises.push({
                    id: `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'diplomatic_breakdown',
                    relationId: relation.id,
                    severity: 'high',
                    factors: climate.factors
                });
            }
        }
        
        // Check for treaty violations
        for (const treaty of this.treaties.values()) {
            if (await this.checkTreatyViolation(treaty)) {
                crises.push({
                    id: `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'treaty_violation',
                    treatyId: treaty.id,
                    severity: 'medium',
                    treaty
                });
            }
        }
        
        return crises;
    }
    
    async generateCrisisResponse(crisis, knobSettings) {
        const state = knobSettings.state || {};
        
        switch (crisis.type) {
            case 'diplomatic_breakdown':
                return {
                    id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'crisis_mediation',
                    action: 'initiate_emergency_mediation',
                    crisisId: crisis.id,
                    reasoning: 'Diplomatic breakdown requires immediate mediation',
                    consequences: {
                        state: {
                            crisis_management_effectiveness: '+2',
                            diplomatic_intervention: 'high'
                        }
                    }
                };
                
            case 'treaty_violation':
                return {
                    id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'treaty_enforcement',
                    action: 'address_treaty_violation',
                    crisisId: crisis.id,
                    reasoning: 'Treaty violation requires diplomatic response',
                    consequences: {
                        state: {
                            treaty_enforcement: '+1',
                            diplomatic_credibility: '+1'
                        }
                    }
                };
                
            default:
                return null;
        }
    }
    
    // ===== ACTION APPLICATION =====
    
    async applyDiplomaticActions(actions, knobSettings) {
        const effects = {
            systemUpdates: {},
            relationshipChanges: 0,
            treatiesCreated: 0,
            negotiationsStarted: 0,
            crisesResolved: 0
        };
        
        for (const action of actions) {
            try {
                // Apply consequences to relevant systems
                for (const [system, knobUpdates] of Object.entries(action.consequences)) {
                    if (this.knobEndpoints[system]) {
                        await this.updateSystemKnobs(system, knobUpdates);
                        effects.systemUpdates[system] = knobUpdates;
                    }
                }
                
                // Handle specific action types
                if (action.type.includes('initiative')) {
                    await this.startNegotiation(action);
                    effects.negotiationsStarted++;
                } else if (action.type === 'negotiation_result' && action.success) {
                    effects.treatiesCreated++;
                } else if (action.type.includes('crisis')) {
                    effects.crisesResolved++;
                }
                
                // Update diplomatic relations
                if (action.relationId) {
                    const relation = this.diplomaticRelations.get(action.relationId);
                    if (relation) {
                        this.updateRelationFromAction(relation, action);
                        effects.relationshipChanges++;
                    }
                }
                
            } catch (error) {
                console.error(`Error applying diplomatic action ${action.id}:`, error);
            }
        }
        
        return effects;
    }
    
    async startNegotiation(initiative) {
        const negotiation = {
            id: `negotiation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: initiative.negotiationParams.type,
            relationId: initiative.relationId,
            parties: initiative.parties,
            startTime: Date.now(),
            maxDuration: initiative.negotiationParams.maxDuration,
            complexity: initiative.negotiationParams.complexity,
            progress: 0.0,
            status: 'active'
        };
        
        this.activeNegotiations.set(negotiation.id, negotiation);
        return negotiation;
    }
    
    updateRelationFromAction(relation, action) {
        // Update relation based on action success and type
        if (action.type.includes('initiative') || (action.type === 'negotiation_result' && action.success)) {
            relation.cooperation += 0.05;
            relation.trust += 0.03;
        } else if (action.type === 'negotiation_result' && !action.success) {
            relation.cooperation -= 0.02;
            relation.trust -= 0.01;
        } else if (action.type.includes('crisis')) {
            relation.trust += 0.02; // Crisis resolution builds trust
        }
        
        // Clamp values
        relation.cooperation = Math.max(0, Math.min(1, relation.cooperation));
        relation.trust = Math.max(0, Math.min(1, relation.trust));
        
        relation.lastUpdate = Date.now();
    }
    
    // ===== TREATY MANAGEMENT =====
    
    async createTreaty(treatyData) {
        this.treaties.set(treatyData.id, treatyData);
        
        // Update relations based on treaty
        const parties = treatyData.parties;
        if (parties.length === 2) {
            const relationId = this.getRelationId(parties[0], parties[1]);
            const relation = this.diplomaticRelations.get(relationId);
            
            if (relation) {
                relation.treaties.push(treatyData.id);
                relation.trust += 0.1;
                relation.cooperation += 0.1;
            }
        }
        
        return treatyData;
    }
    
    async checkTreatyViolation(treaty) {
        // Simple violation check - in real implementation, this would be more complex
        return Math.random() < 0.05; // 5% chance of violation
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    calculateTradeVolume(relation) {
        // Simplified calculation
        return Math.random() * relation.cooperation;
    }
    
    calculateEconomicDependency(relation) {
        // Simplified calculation
        return Math.random() * 0.5;
    }
    
    calculateMilitaryBalance(relation) {
        // Simplified calculation - 0.5 means balanced, >0.5 means civ1 stronger
        return 0.3 + (Math.random() * 0.4);
    }
    
    calculateIdeologicalAlignment(relation) {
        // Simplified calculation
        return 0.2 + (Math.random() * 0.6);
    }
    
    calculateLeadershipStability(relation) {
        // Simplified calculation
        return 0.4 + (Math.random() * 0.4);
    }
    
    getRecentConflicts(relation) {
        // Simplified - check recent history for conflicts
        const recentHistory = relation.history.slice(-5);
        return recentHistory.filter(h => h.climate && h.climate.tension > 0.7).length / 5;
    }
    
    getRecentCooperation(relation) {
        // Simplified - check recent history for cooperation
        const recentHistory = relation.history.slice(-5);
        return recentHistory.filter(h => h.climate && h.climate.cooperation > 0.7).length / 5;
    }
    
    getRelationId(civ1Id, civ2Id) {
        return [civ1Id, civ2Id].sort().join('_');
    }
    
    generateNegotiationSuccessConsequences(negotiation) {
        return {
            state: {
                negotiation_success_rate: '+1',
                diplomatic_effectiveness: '+1'
            }
        };
    }
    
    generateNegotiationFailureConsequences(negotiation) {
        return {
            state: {
                negotiation_failure_rate: '+1',
                diplomatic_tension: '+1'
            }
        };
    }
    
    // ===== CIVILIZATION MANAGEMENT =====
    
    addCivilization(civData) {
        const civilization = {
            id: civData.id || `civ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: civData.name || 'Civilization',
            species: civData.species || 'Unknown',
            governmentType: civData.governmentType || 'democracy',
            diplomaticStance: civData.diplomaticStance || 'neutral',
            militaryStrength: civData.militaryStrength || 0.5,
            economicStrength: civData.economicStrength || 0.5,
            culturalValues: civData.culturalValues || {},
            created: Date.now()
        };
        
        this.civilizations.set(civilization.id, civilization);
        
        // Create relations with existing civilizations
        for (const existingCiv of this.civilizations.values()) {
            if (existingCiv.id !== civilization.id) {
                this.createDiplomaticRelation(civilization.id, existingCiv.id);
            }
        }
        
        return civilization;
    }
    
    createDiplomaticRelation(civ1Id, civ2Id) {
        const relationId = this.getRelationId(civ1Id, civ2Id);
        
        if (!this.diplomaticRelations.has(relationId)) {
            const relation = {
                id: relationId,
                civilization1Id: civ1Id,
                civilization2Id: civ2Id,
                trust: 0.5,
                cooperation: 0.5,
                treaties: [],
                history: [],
                created: Date.now(),
                lastUpdate: Date.now()
            };
            
            this.diplomaticRelations.set(relationId, relation);
        }
    }
    
    // ===== ANALYTICS & REPORTING =====
    
    getDiplomaticAnalytics() {
        const relations = Array.from(this.diplomaticRelations.values());
        const treaties = Array.from(this.treaties.values());
        const negotiations = Array.from(this.activeNegotiations.values());
        
        return {
            totalCivilizations: this.civilizations.size,
            totalRelations: relations.length,
            averageTrust: relations.reduce((sum, r) => sum + r.trust, 0) / relations.length,
            averageCooperation: relations.reduce((sum, r) => sum + r.cooperation, 0) / relations.length,
            activeTreaties: treaties.filter(t => t.status === 'active').length,
            activeNegotiations: negotiations.length,
            recentDiplomaticActivity: this.getRecentDiplomaticActivity()
        };
    }
    
    getRecentDiplomaticActivity() {
        const cutoff = Date.now() - 300000; // 5 minutes ago
        const recentEvents = [];
        
        // Check recent relation updates
        for (const relation of this.diplomaticRelations.values()) {
            if (relation.lastUpdate > cutoff) {
                recentEvents.push({
                    type: 'relation_update',
                    relationId: relation.id,
                    timestamp: relation.lastUpdate
                });
            }
        }
        
        // Check recent treaties
        for (const treaty of this.treaties.values()) {
            if (treaty.signed > cutoff) {
                recentEvents.push({
                    type: 'treaty_signed',
                    treatyId: treaty.id,
                    timestamp: treaty.signed
                });
            }
        }
        
        return {
            total: recentEvents.length,
            byType: this.groupEventsByType(recentEvents)
        };
    }
    
    groupEventsByType(events) {
        const grouped = {};
        for (const event of events) {
            grouped[event.type] = (grouped[event.type] || 0) + 1;
        }
        return grouped;
    }
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    start() {
        console.log('🤝 Starting Diplomacy AI system...');
        this.emit('started');
    }
    
    stop() {
        console.log('🤝 Stopping Diplomacy AI system...');
        this.emit('stopped');
    }
    
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            lastUpdate: this.lastUpdate,
            civilizations: this.civilizations.size,
            diplomaticRelations: this.diplomaticRelations.size,
            activeNegotiations: this.activeNegotiations.size,
            treaties: this.treaties.size,
            config: this.config
        };
    }
}

module.exports = { DiplomacyAI };
