// Enhanced Character AI - Characters take real actions with real consequences in the game
// Integrates with Enhanced Knob APIs for dynamic character behavior and game impact

const EventEmitter = require('events');

class EnhancedCharacterAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            processingInterval: config.processingInterval || 20000, // 20 seconds
            maxCharactersPerTick: config.maxCharactersPerTick || 30,
            decisionComplexity: config.decisionComplexity || 'high',
            
            // Character Behavior Parameters
            autonomyLevel: config.autonomyLevel || 0.8,
            consequenceWeight: config.consequenceWeight || 0.9,
            relationshipInfluence: config.relationshipInfluence || 0.7,
            
            ...config
        };
        
        this.characters = new Map(); // characterId -> character data
        this.relationships = new Map(); // relationshipId -> relationship data
        this.actionHistory = new Map(); // characterId -> action history
        this.consequences = new Map(); // actionId -> consequence data
        
        this.isProcessing = false;
        this.lastUpdate = Date.now();
        
        // Enhanced Knob Integration
        this.knobEndpoints = {
            characters: '/api/characters/knobs',
            professions: '/api/professions/knobs',
            state: '/api/state/knobs',
            intelligence: '/api/intelligence/knobs',
            military: '/api/military/knobs',
            governance: '/api/governance/knobs',
            commerce: '/api/commerce/knobs',
            health: '/api/health/knobs'
        };
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processCharacterActions(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('👤 Processing Enhanced Character AI actions...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Generate character actions with real consequences
            const actions = await this.generateCharacterActions(gameState, knobSettings);
            
            // Apply actions and their consequences to the game world
            const consequences = await this.applyActionsWithConsequences(actions, knobSettings);
            
            // Update character relationships based on actions
            await this.updateCharacterRelationships(actions, consequences);
            
            // Track action history for learning
            await this.updateActionHistory(actions, consequences);
            
            this.emit('character-actions', {
                timestamp: Date.now(),
                actions: actions.length,
                consequences: consequences.length,
                characters: this.characters.size,
                relationships: this.relationships.size
            });
            
            console.log(`✅ Processed ${actions.length} character actions with ${consequences.length} consequences`);
            
        } catch (error) {
            console.error('❌ Enhanced Character AI processing error:', error);
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
            console.error('Error fetching character knob settings:', error);
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
    
    // ===== CHARACTER ACTION GENERATION =====
    
    async generateCharacterActions(gameState, knobSettings) {
        const actions = [];
        const characterList = Array.from(this.characters.values());
        
        for (const character of characterList.slice(0, this.config.maxCharactersPerTick)) {
            try {
                // Determine character's current context and motivations
                const context = await this.analyzeCharacterContext(character, gameState, knobSettings);
                
                // Generate actions based on character type and role
                const characterActions = await this.generateActionsForCharacter(character, context, knobSettings);
                
                actions.push(...characterActions);
                
            } catch (error) {
                console.error(`Error generating actions for character ${character.id}:`, error);
            }
        }
        
        return actions;
    }
    
    async analyzeCharacterContext(character, gameState, knobSettings) {
        const characters = knobSettings.characters || {};
        
        return {
            // Character state
            personality: character.personality,
            currentRole: character.currentRole,
            relationships: this.getCharacterRelationships(character.id),
            recentActions: this.getRecentActions(character.id),
            
            // Game context
            gamePhase: gameState.phase || 'mid_game',
            civilizationStatus: gameState.civilizationStatus || {},
            currentEvents: gameState.currentEvents || [],
            
            // Knob influences
            decisionAutonomy: characters.decision_autonomy || 0.5,
            personalityExpression: characters.personality_expression || 0.5,
            socialInteraction: characters.social_interaction_frequency || 0.5,
            proactiveBehavior: characters.proactive_behavior_level || 0.5
        };
    }
    
    async generateActionsForCharacter(character, context, knobSettings) {
        const actions = [];
        
        // Generate different types of actions based on character role
        switch (character.type) {
            case 'leader':
                actions.push(...await this.generateLeaderActions(character, context, knobSettings));
                break;
            case 'diplomat':
                actions.push(...await this.generateDiplomatActions(character, context, knobSettings));
                break;
            case 'military_officer':
                actions.push(...await this.generateMilitaryActions(character, context, knobSettings));
                break;
            case 'scientist':
                actions.push(...await this.generateScientistActions(character, context, knobSettings));
                break;
            case 'business_leader':
                actions.push(...await this.generateBusinessActions(character, context, knobSettings));
                break;
            case 'citizen':
                actions.push(...await this.generateCitizenActions(character, context, knobSettings));
                break;
            default:
                actions.push(...await this.generateGenericActions(character, context, knobSettings));
        }
        
        return actions;
    }
    
    async generateLeaderActions(character, context, knobSettings) {
        const actions = [];
        const governance = knobSettings.governance || {};
        
        // Policy decisions with real consequences
        if (context.proactiveBehavior > 0.6 && Math.random() < 0.3) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'policy_decision',
                action: 'propose_economic_reform',
                reasoning: 'Economic indicators suggest need for reform',
                targetSystems: ['governance', 'commerce'],
                consequences: {
                    governance: { 
                        policy_effectiveness: context.decisionAutonomy > 0.7 ? '+2' : '+1',
                        public_approval: character.charisma > 0.7 ? 'high' : 'medium'
                    },
                    commerce: {
                        business_confidence: '+1',
                        market_stability: character.experience > 0.8 ? 'high' : 'medium'
                    }
                },
                riskLevel: 'medium',
                expectedImpact: 'high'
            });
        }
        
        // Diplomatic initiatives
        if (context.socialInteraction > 0.7 && character.diplomacy > 0.6) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'diplomatic_initiative',
                action: 'propose_trade_agreement',
                reasoning: 'Strong diplomatic skills and social context favor trade initiatives',
                targetSystems: ['state', 'commerce'],
                consequences: {
                    state: {
                        diplomatic_relations: '+2',
                        international_cooperation: 'high'
                    },
                    commerce: {
                        trade_volume: '+1',
                        export_opportunities: 'increase'
                    }
                },
                riskLevel: 'low',
                expectedImpact: 'medium'
            });
        }
        
        return actions;
    }
    
    async generateDiplomatActions(character, context, knobSettings) {
        const actions = [];
        const state = knobSettings.state || {};
        
        // Diplomatic negotiations
        if (character.negotiation > 0.7 && context.personalityExpression > 0.6) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'diplomatic_negotiation',
                action: 'negotiate_cultural_exchange',
                reasoning: 'High negotiation skills and personality expression enable cultural diplomacy',
                targetSystems: ['state', 'characters'],
                consequences: {
                    state: {
                        cultural_diplomacy: '+2',
                        soft_power_projection: 'high'
                    },
                    characters: {
                        cultural_awareness: '+1',
                        international_relationships: 'improve'
                    }
                },
                riskLevel: 'low',
                expectedImpact: 'medium'
            });
        }
        
        return actions;
    }
    
    async generateMilitaryActions(character, context, knobSettings) {
        const actions = [];
        const military = knobSettings.military || {};
        
        // Military strategic decisions
        if (character.strategy > 0.8 && context.decisionAutonomy > 0.7) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'military_strategy',
                action: 'propose_defense_upgrade',
                reasoning: 'High strategic capability and autonomy enable defense planning',
                targetSystems: ['military', 'intelligence'],
                consequences: {
                    military: {
                        defense_readiness: '+2',
                        strategic_planning: 'high'
                    },
                    intelligence: {
                        threat_assessment: '+1',
                        security_analysis: 'improve'
                    }
                },
                riskLevel: 'medium',
                expectedImpact: 'high'
            });
        }
        
        return actions;
    }
    
    async generateScientistActions(character, context, knobSettings) {
        const actions = [];
        const professions = knobSettings.professions || {};
        
        // Research initiatives
        if (character.intelligence > 0.8 && context.proactiveBehavior > 0.6) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'research_initiative',
                action: 'propose_breakthrough_research',
                reasoning: 'High intelligence and proactive behavior drive research innovation',
                targetSystems: ['professions', 'health'],
                consequences: {
                    professions: {
                        research_productivity: '+2',
                        innovation_rate: 'high'
                    },
                    health: {
                        medical_research: '+1',
                        healthcare_innovation: 'advance'
                    }
                },
                riskLevel: 'low',
                expectedImpact: 'high'
            });
        }
        
        return actions;
    }
    
    async generateBusinessActions(character, context, knobSettings) {
        const actions = [];
        const commerce = knobSettings.commerce || {};
        
        // Business expansion decisions
        if (character.business_acumen > 0.7 && context.decisionAutonomy > 0.6) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'business_expansion',
                action: 'launch_innovation_initiative',
                reasoning: 'Strong business acumen and autonomy enable innovation leadership',
                targetSystems: ['commerce', 'professions'],
                consequences: {
                    commerce: {
                        business_innovation: '+2',
                        market_dynamism: 'high'
                    },
                    professions: {
                        entrepreneurship: '+1',
                        skill_development: 'advance'
                    }
                },
                riskLevel: 'medium',
                expectedImpact: 'medium'
            });
        }
        
        return actions;
    }
    
    async generateCitizenActions(character, context, knobSettings) {
        const actions = [];
        const characters = knobSettings.characters || {};
        
        // Community engagement
        if (context.socialInteraction > 0.6 && character.civic_engagement > 0.5) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'community_engagement',
                action: 'organize_community_event',
                reasoning: 'High social interaction and civic engagement drive community action',
                targetSystems: ['characters', 'health'],
                consequences: {
                    characters: {
                        community_cohesion: '+1',
                        social_participation: 'increase'
                    },
                    health: {
                        community_wellness: '+1',
                        social_health: 'improve'
                    }
                },
                riskLevel: 'low',
                expectedImpact: 'low'
            });
        }
        
        return actions;
    }
    
    async generateGenericActions(character, context, knobSettings) {
        const actions = [];
        
        // Generic character development actions
        if (context.personalityExpression > 0.5) {
            actions.push({
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                characterId: character.id,
                type: 'personal_development',
                action: 'pursue_skill_improvement',
                reasoning: 'Personality expression drives personal growth',
                targetSystems: ['characters', 'professions'],
                consequences: {
                    characters: {
                        character_development: '+1',
                        skill_progression: 'advance'
                    },
                    professions: {
                        workforce_quality: '+1'
                    }
                },
                riskLevel: 'low',
                expectedImpact: 'low'
            });
        }
        
        return actions;
    }
    
    // ===== CONSEQUENCE APPLICATION =====
    
    async applyActionsWithConsequences(actions, knobSettings) {
        const consequences = [];
        
        for (const action of actions) {
            try {
                // Apply action consequences to game systems
                const actionConsequences = await this.applyActionConsequences(action, knobSettings);
                
                // Update character state based on action
                await this.updateCharacterFromAction(action);
                
                // Track consequences for learning
                consequences.push(...actionConsequences);
                
            } catch (error) {
                console.error(`Error applying action ${action.id}:`, error);
            }
        }
        
        return consequences;
    }
    
    async applyActionConsequences(action, knobSettings) {
        const consequences = [];
        
        // Apply consequences to each target system
        for (const [system, knobUpdates] of Object.entries(action.consequences)) {
            try {
                const success = await this.updateSystemKnobs(system, knobUpdates);
                
                const consequence = {
                    id: `consequence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    actionId: action.id,
                    characterId: action.characterId,
                    system,
                    knobUpdates,
                    success,
                    timestamp: Date.now(),
                    impact: action.expectedImpact,
                    riskLevel: action.riskLevel
                };
                
                consequences.push(consequence);
                this.consequences.set(consequence.id, consequence);
                
            } catch (error) {
                console.error(`Error applying consequence to ${system}:`, error);
            }
        }
        
        return consequences;
    }
    
    async updateCharacterFromAction(action) {
        const character = this.characters.get(action.characterId);
        if (!character) return;
        
        // Update character based on action type and success
        switch (action.type) {
            case 'policy_decision':
                character.experience += 0.05;
                character.leadership += 0.03;
                break;
            case 'diplomatic_initiative':
                character.diplomacy += 0.04;
                character.charisma += 0.02;
                break;
            case 'military_strategy':
                character.strategy += 0.05;
                character.leadership += 0.02;
                break;
            case 'research_initiative':
                character.intelligence += 0.03;
                character.expertise += 0.04;
                break;
            case 'business_expansion':
                character.business_acumen += 0.04;
                character.risk_tolerance += 0.02;
                break;
            case 'community_engagement':
                character.civic_engagement += 0.03;
                character.social_skills += 0.02;
                break;
        }
        
        // Track action in character history
        if (!character.actionHistory) character.actionHistory = [];
        character.actionHistory.push({
            timestamp: Date.now(),
            action: action.action,
            type: action.type,
            reasoning: action.reasoning,
            impact: action.expectedImpact
        });
        
        // Keep only recent history
        if (character.actionHistory.length > 10) {
            character.actionHistory = character.actionHistory.slice(-10);
        }
    }
    
    // ===== RELATIONSHIP MANAGEMENT =====
    
    async updateCharacterRelationships(actions, consequences) {
        for (const action of actions) {
            // Update relationships based on action type and consequences
            await this.updateRelationshipsFromAction(action, consequences);
        }
    }
    
    async updateRelationshipsFromAction(action, consequences) {
        const character = this.characters.get(action.characterId);
        if (!character) return;
        
        // Find related characters based on action type
        const relatedCharacters = this.findRelatedCharacters(action);
        
        for (const relatedCharacter of relatedCharacters) {
            const relationshipId = this.getRelationshipId(character.id, relatedCharacter.id);
            let relationship = this.relationships.get(relationshipId);
            
            if (!relationship) {
                relationship = {
                    id: relationshipId,
                    character1Id: character.id,
                    character2Id: relatedCharacter.id,
                    type: 'professional',
                    strength: 0.1,
                    trust: 0.5,
                    cooperation: 0.5,
                    history: []
                };
                this.relationships.set(relationshipId, relationship);
            }
            
            // Update relationship based on action success and type
            const actionSuccess = consequences.some(c => c.actionId === action.id && c.success);
            
            if (actionSuccess) {
                relationship.trust += 0.05;
                relationship.cooperation += 0.03;
                relationship.strength += 0.02;
            } else {
                relationship.trust -= 0.02;
                relationship.cooperation -= 0.01;
            }
            
            // Add to relationship history
            relationship.history.push({
                timestamp: Date.now(),
                action: action.action,
                impact: actionSuccess ? 'positive' : 'negative'
            });
            
            // Keep only recent history
            if (relationship.history.length > 5) {
                relationship.history = relationship.history.slice(-5);
            }
        }
    }
    
    findRelatedCharacters(action) {
        const related = [];
        const allCharacters = Array.from(this.characters.values());
        
        // Find characters in the same systems affected by the action
        for (const character of allCharacters) {
            if (character.id === action.characterId) continue;
            
            // Check if character works in affected systems
            const characterSystems = character.workingSystems || [];
            const actionSystems = action.targetSystems || [];
            
            if (characterSystems.some(sys => actionSystems.includes(sys))) {
                related.push(character);
            }
        }
        
        return related.slice(0, 3); // Limit to 3 related characters
    }
    
    getRelationshipId(char1Id, char2Id) {
        return [char1Id, char2Id].sort().join('_');
    }
    
    getCharacterRelationships(characterId) {
        const relationships = [];
        
        for (const relationship of this.relationships.values()) {
            if (relationship.character1Id === characterId || relationship.character2Id === characterId) {
                relationships.push(relationship);
            }
        }
        
        return relationships;
    }
    
    // ===== ACTION HISTORY MANAGEMENT =====
    
    async updateActionHistory(actions, consequences) {
        for (const action of actions) {
            let history = this.actionHistory.get(action.characterId);
            
            if (!history) {
                history = [];
                this.actionHistory.set(action.characterId, history);
            }
            
            const actionRecord = {
                timestamp: Date.now(),
                action: action.action,
                type: action.type,
                reasoning: action.reasoning,
                consequences: consequences.filter(c => c.actionId === action.id),
                success: consequences.some(c => c.actionId === action.id && c.success)
            };
            
            history.push(actionRecord);
            
            // Keep only recent history
            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }
        }
    }
    
    getRecentActions(characterId, limit = 5) {
        const history = this.actionHistory.get(characterId) || [];
        return history.slice(-limit);
    }
    
    // ===== CHARACTER MANAGEMENT =====
    
    addCharacter(characterData) {
        const character = {
            id: characterData.id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: characterData.name || 'Character',
            type: characterData.type || 'citizen',
            currentRole: characterData.currentRole || 'general',
            
            // Personality traits
            personality: characterData.personality || {
                openness: Math.random(),
                conscientiousness: Math.random(),
                extraversion: Math.random(),
                agreeableness: Math.random(),
                neuroticism: Math.random()
            },
            
            // Skills and attributes
            intelligence: characterData.intelligence || Math.random(),
            charisma: characterData.charisma || Math.random(),
            leadership: characterData.leadership || Math.random(),
            diplomacy: characterData.diplomacy || Math.random(),
            strategy: characterData.strategy || Math.random(),
            negotiation: characterData.negotiation || Math.random(),
            business_acumen: characterData.business_acumen || Math.random(),
            civic_engagement: characterData.civic_engagement || Math.random(),
            social_skills: characterData.social_skills || Math.random(),
            experience: characterData.experience || 0.1,
            expertise: characterData.expertise || Math.random(),
            risk_tolerance: characterData.risk_tolerance || Math.random(),
            
            // Working context
            workingSystems: characterData.workingSystems || [],
            
            // State tracking
            actionHistory: [],
            created: Date.now(),
            lastAction: null
        };
        
        this.characters.set(character.id, character);
        return character;
    }
    
    removeCharacter(characterId) {
        // Remove character and all related relationships
        const relationships = this.getCharacterRelationships(characterId);
        for (const relationship of relationships) {
            this.relationships.delete(relationship.id);
        }
        
        // Remove action history
        this.actionHistory.delete(characterId);
        
        return this.characters.delete(characterId);
    }
    
    getCharacter(characterId) {
        return this.characters.get(characterId);
    }
    
    // ===== ANALYTICS & REPORTING =====
    
    getCharacterAnalytics() {
        const characters = Array.from(this.characters.values());
        const relationships = Array.from(this.relationships.values());
        const consequences = Array.from(this.consequences.values());
        
        return {
            totalCharacters: characters.length,
            characterTypes: this.getCharacterTypeDistribution(characters),
            averageExperience: characters.reduce((sum, c) => sum + c.experience, 0) / characters.length,
            totalRelationships: relationships.length,
            averageRelationshipStrength: relationships.reduce((sum, r) => sum + r.strength, 0) / relationships.length,
            totalConsequences: consequences.length,
            successfulActions: consequences.filter(c => c.success).length,
            recentActions: this.getRecentActionsSummary()
        };
    }
    
    getCharacterTypeDistribution(characters) {
        const distribution = {};
        for (const character of characters) {
            distribution[character.type] = (distribution[character.type] || 0) + 1;
        }
        return distribution;
    }
    
    getRecentActionsSummary() {
        const recentActions = [];
        const cutoff = Date.now() - 300000; // 5 minutes ago
        
        for (const [characterId, history] of this.actionHistory.entries()) {
            const recent = history.filter(action => action.timestamp > cutoff);
            recentActions.push(...recent);
        }
        
        return {
            total: recentActions.length,
            successful: recentActions.filter(a => a.success).length,
            byType: this.groupActionsByType(recentActions)
        };
    }
    
    groupActionsByType(actions) {
        const grouped = {};
        for (const action of actions) {
            grouped[action.type] = (grouped[action.type] || 0) + 1;
        }
        return grouped;
    }
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    start() {
        console.log('👤 Starting Enhanced Character AI system...');
        this.emit('started');
    }
    
    stop() {
        console.log('👤 Stopping Enhanced Character AI system...');
        this.emit('stopped');
    }
    
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            lastUpdate: this.lastUpdate,
            characters: this.characters.size,
            relationships: this.relationships.size,
            actionHistory: this.actionHistory.size,
            consequences: this.consequences.size,
            config: this.config
        };
    }
}

module.exports = { EnhancedCharacterAI };
