/**
 * Characters Game State Management
 * Manages character data, relationships, actions, and simulation state
 */

class CharactersState {
    constructor() {
        this.characters = new Map();
        this.activeCharacters = new Set();
        this.characterActions = new Map();
        this.relationships = new Map();
        this.simulationMetrics = {
            totalProcessingCost: 0,
            activeSimulations: 0,
            lastOptimization: Date.now(),
            budgetUtilization: 0
        };
        
        this.initializeDefaultCharacters();
    }

    initializeDefaultCharacters() {
        const defaultCharacters = [
            // Leaders
            {
                id: 'leader_001',
                name: 'President Elena Vasquez',
                category: 'leaders',
                role: 'Galactic President',
                civilization: 'Terran Federation',
                traits: ['charismatic', 'diplomatic', 'strategic'],
                background: 'Former ambassador turned president, known for her ability to unite diverse factions.',
                motivations: ['galactic_peace', 'economic_prosperity', 'technological_advancement'],
                capabilities: ['high_level_diplomacy', 'policy_making', 'crisis_management'],
                reputation: { diplomatic: 9, economic: 7, military: 6, social: 8 },
                isActive: true,
                lastActivity: Date.now(),
                createdAt: Date.now() - 86400000 // 1 day ago
            },
            
            // Diplomats
            {
                id: 'diplomat_001',
                name: 'Ambassador Zara Al-Rashid',
                category: 'diplomats',
                role: 'Chief Diplomatic Officer',
                civilization: 'Terran Federation',
                traits: ['patient', 'multilingual', 'culturally_aware'],
                background: 'Veteran diplomat with 20 years of inter-species negotiation experience.',
                motivations: ['conflict_resolution', 'cultural_exchange', 'trade_facilitation'],
                capabilities: ['negotiation', 'cultural_mediation', 'treaty_drafting'],
                reputation: { diplomatic: 10, economic: 6, military: 4, social: 8 },
                isActive: true,
                lastActivity: Date.now() - 3600000, // 1 hour ago
                createdAt: Date.now() - 172800000 // 2 days ago
            },
            
            {
                id: 'diplomat_002',
                name: 'Mediator Keth Vorthak',
                category: 'diplomats',
                role: 'Conflict Resolution Specialist',
                civilization: 'Zephyrian Alliance',
                traits: ['analytical', 'impartial', 'persistent'],
                background: 'Renowned for resolving the Outer Rim Trade Wars through innovative mediation.',
                motivations: ['peace_building', 'fair_resolution', 'precedent_setting'],
                capabilities: ['conflict_analysis', 'mediation', 'arbitration'],
                reputation: { diplomatic: 9, economic: 7, military: 3, social: 7 },
                isActive: false,
                lastActivity: Date.now() - 7200000, // 2 hours ago
                createdAt: Date.now() - 259200000 // 3 days ago
            },
            
            // Business Leaders
            {
                id: 'business_001',
                name: 'CEO Marcus Chen',
                category: 'businessLeaders',
                role: 'Galactic Trade Consortium CEO',
                civilization: 'Terran Federation',
                traits: ['ambitious', 'innovative', 'risk_taking'],
                background: 'Built the largest inter-galactic shipping empire from a single transport vessel.',
                motivations: ['profit_maximization', 'market_expansion', 'technological_innovation'],
                capabilities: ['business_strategy', 'market_analysis', 'resource_optimization'],
                reputation: { diplomatic: 6, economic: 10, military: 5, social: 7 },
                isActive: true,
                lastActivity: Date.now() - 1800000, // 30 minutes ago
                createdAt: Date.now() - 345600000 // 4 days ago
            },
            
            {
                id: 'business_002',
                name: 'Director Lyra Moonwhisper',
                category: 'businessLeaders',
                role: 'Resource Acquisition Director',
                civilization: 'Elven Consortium',
                traits: ['shrewd', 'connected', 'opportunistic'],
                background: 'Controls the largest rare mineral extraction operations in three sectors.',
                motivations: ['resource_control', 'strategic_partnerships', 'market_dominance'],
                capabilities: ['resource_evaluation', 'supply_chain_management', 'contract_negotiation'],
                reputation: { diplomatic: 7, economic: 9, military: 4, social: 6 },
                isActive: true,
                lastActivity: Date.now() - 900000, // 15 minutes ago
                createdAt: Date.now() - 432000000 // 5 days ago
            },
            
            // Military
            {
                id: 'military_001',
                name: 'Admiral Sarah Rodriguez',
                category: 'military',
                role: 'Fleet Admiral',
                civilization: 'Terran Federation',
                traits: ['tactical', 'loyal', 'decisive'],
                background: 'Hero of the Centauri Defense, known for innovative fleet tactics.',
                motivations: ['galactic_security', 'military_excellence', 'protecting_civilians'],
                capabilities: ['fleet_command', 'tactical_planning', 'crisis_response'],
                reputation: { diplomatic: 6, economic: 5, military: 10, social: 8 },
                isActive: false,
                lastActivity: Date.now() - 10800000, // 3 hours ago
                createdAt: Date.now() - 518400000 // 6 days ago
            },
            
            // Scientists
            {
                id: 'scientist_001',
                name: 'Dr. Quantum Flux',
                category: 'scientists',
                role: 'Chief Research Officer',
                civilization: 'Terran Federation',
                traits: ['brilliant', 'eccentric', 'curious'],
                background: 'Nobel laureate in quantum mechanics, inventor of the flux drive.',
                motivations: ['scientific_discovery', 'technological_advancement', 'knowledge_sharing'],
                capabilities: ['research_leadership', 'innovation', 'problem_solving'],
                reputation: { diplomatic: 5, economic: 6, military: 7, social: 9 },
                isActive: true,
                lastActivity: Date.now() - 600000, // 10 minutes ago
                createdAt: Date.now() - 604800000 // 7 days ago
            },
            
            // Citizens
            {
                id: 'citizen_001',
                name: 'Maya Patel',
                category: 'citizens',
                role: 'Community Organizer',
                civilization: 'Terran Federation',
                traits: ['passionate', 'organized', 'empathetic'],
                background: 'Grassroots activist who organized the largest peaceful protest in galactic history.',
                motivations: ['social_justice', 'community_welfare', 'democratic_participation'],
                capabilities: ['community_organizing', 'public_speaking', 'coalition_building'],
                reputation: { diplomatic: 7, economic: 5, military: 3, social: 10 },
                isActive: false,
                lastActivity: Date.now() - 14400000, // 4 hours ago
                createdAt: Date.now() - 691200000 // 8 days ago
            },
            
            {
                id: 'citizen_002',
                name: 'Journalist Rex Sterling',
                category: 'citizens',
                role: 'Investigative Reporter',
                civilization: 'Independent',
                traits: ['inquisitive', 'persistent', 'ethical'],
                background: 'Pulitzer Prize winner known for exposing corruption in high places.',
                motivations: ['truth_seeking', 'transparency', 'public_accountability'],
                capabilities: ['investigation', 'information_gathering', 'public_communication'],
                reputation: { diplomatic: 6, economic: 6, military: 4, social: 9 },
                isActive: true,
                lastActivity: Date.now() - 300000, // 5 minutes ago
                createdAt: Date.now() - 777600000 // 9 days ago
            }
        ];
        
        // Initialize characters
        defaultCharacters.forEach(char => {
            this.characters.set(char.id, char);
            if (char.isActive) {
                this.activeCharacters.add(char.id);
            }
            this.characterActions.set(char.id, []);
        });
        
        // Initialize some sample relationships
        this.initializeRelationships();
    }

    initializeRelationships() {
        const relationships = [
            {
                characterId: 'leader_001',
                targetCharacterId: 'diplomat_001',
                relationshipType: 'professional',
                strength: 8,
                notes: 'Close working relationship, high trust'
            },
            {
                characterId: 'business_001',
                targetCharacterId: 'business_002',
                relationshipType: 'rival',
                strength: 6,
                notes: 'Competitive but respectful business relationship'
            },
            {
                characterId: 'diplomat_001',
                targetCharacterId: 'diplomat_002',
                relationshipType: 'colleague',
                strength: 7,
                notes: 'Professional respect, different approaches'
            },
            {
                characterId: 'citizen_001',
                targetCharacterId: 'leader_001',
                relationshipType: 'political',
                strength: 5,
                notes: 'Cautious support, watches policy decisions closely'
            }
        ];
        
        relationships.forEach(rel => {
            const key = `${rel.characterId}_${rel.targetCharacterId}`;
            this.relationships.set(key, {
                ...rel,
                lastUpdated: Date.now(),
                createdAt: Date.now()
            });
        });
    }

    // Character management methods
    getAllCharacters() {
        return Array.from(this.characters.values());
    }

    getCharacterById(id) {
        return this.characters.get(id);
    }

    createCharacter(characterData) {
        const id = characterData.id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const character = {
            id,
            name: characterData.name || 'Unknown Character',
            category: characterData.category || 'citizens',
            role: characterData.role || 'Citizen',
            civilization: characterData.civilization || 'Independent',
            traits: characterData.traits || [],
            background: characterData.background || 'No background information available.',
            motivations: characterData.motivations || [],
            capabilities: characterData.capabilities || [],
            reputation: characterData.reputation || { diplomatic: 5, economic: 5, military: 5, social: 5 },
            isActive: characterData.isActive || false,
            lastActivity: Date.now(),
            createdAt: Date.now(),
            ...characterData
        };
        
        this.characters.set(id, character);
        this.characterActions.set(id, []);
        
        if (character.isActive) {
            this.activeCharacters.add(id);
        }
        
        return character;
    }

    updateCharacter(id, updates) {
        const character = this.characters.get(id);
        if (!character) return null;
        
        const updatedCharacter = {
            ...character,
            ...updates,
            lastActivity: Date.now()
        };
        
        this.characters.set(id, updatedCharacter);
        
        // Update active status
        if (updates.isActive !== undefined) {
            if (updates.isActive) {
                this.activeCharacters.add(id);
            } else {
                this.activeCharacters.delete(id);
            }
        }
        
        return updatedCharacter;
    }

    removeCharacter(id) {
        const success = this.characters.delete(id);
        if (success) {
            this.activeCharacters.delete(id);
            this.characterActions.delete(id);
            
            // Remove relationships involving this character
            for (const [key, relationship] of this.relationships) {
                if (relationship.characterId === id || relationship.targetCharacterId === id) {
                    this.relationships.delete(key);
                }
            }
        }
        return success;
    }

    activateCharacter(id) {
        const character = this.characters.get(id);
        if (!character) return null;
        
        character.isActive = true;
        character.lastActivity = Date.now();
        this.activeCharacters.add(id);
        this.characters.set(id, character);
        
        return character;
    }

    deactivateCharacter(id) {
        const character = this.characters.get(id);
        if (!character) return null;
        
        character.isActive = false;
        character.lastActivity = Date.now();
        this.activeCharacters.delete(id);
        this.characters.set(id, character);
        
        return character;
    }

    // Character action methods
    executeCharacterAction(characterId, actionData) {
        const character = this.characters.get(characterId);
        if (!character) {
            return { success: false, error: 'Character not found' };
        }
        
        const action = {
            id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            characterId,
            actionType: actionData.actionType,
            target: actionData.target,
            parameters: actionData.parameters || {},
            timestamp: actionData.timestamp || Date.now(),
            result: this.simulateActionResult(character, actionData),
            consequences: []
        };
        
        // Add action to character's history
        const actions = this.characterActions.get(characterId) || [];
        actions.unshift(action); // Add to beginning
        
        // Keep only last 100 actions per character
        if (actions.length > 100) {
            actions.splice(100);
        }
        
        this.characterActions.set(characterId, actions);
        
        // Update character's last activity
        character.lastActivity = Date.now();
        this.characters.set(characterId, character);
        
        // Calculate consequences
        action.consequences = this.calculateActionConsequences(character, action);
        
        return { success: true, action };
    }

    simulateActionResult(character, actionData) {
        // Simple action result simulation
        const baseSuccessRate = 0.7;
        const reputationBonus = (character.reputation[actionData.actionType] || 5) / 10 * 0.2;
        const traitBonus = this.calculateTraitBonus(character.traits, actionData.actionType);
        
        const successRate = Math.min(baseSuccessRate + reputationBonus + traitBonus, 0.95);
        const success = Math.random() < successRate;
        
        return {
            success,
            effectiveness: success ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
            impact: this.calculateActionImpact(character, actionData, success),
            description: this.generateActionDescription(character, actionData, success)
        };
    }

    calculateTraitBonus(traits, actionType) {
        const traitBonuses = {
            diplomatic: { charismatic: 0.1, patient: 0.1, culturally_aware: 0.1 },
            economic: { ambitious: 0.1, innovative: 0.1, shrewd: 0.1 },
            military: { tactical: 0.1, decisive: 0.1, loyal: 0.1 },
            social: { empathetic: 0.1, organized: 0.1, passionate: 0.1 }
        };
        
        const relevantBonuses = traitBonuses[actionType] || {};
        return traits.reduce((bonus, trait) => bonus + (relevantBonuses[trait] || 0), 0);
    }

    calculateActionImpact(character, actionData, success) {
        const baseImpact = success ? 0.5 : 0.2;
        const characterInfluence = (character.reputation.diplomatic + character.reputation.social) / 20;
        
        return {
            diplomatic: baseImpact * characterInfluence * (actionData.actionType === 'diplomatic' ? 2 : 1),
            economic: baseImpact * characterInfluence * (actionData.actionType === 'economic' ? 2 : 1),
            military: baseImpact * characterInfluence * (actionData.actionType === 'military' ? 2 : 1),
            social: baseImpact * characterInfluence * (actionData.actionType === 'social' ? 2 : 1)
        };
    }

    generateActionDescription(character, actionData, success) {
        const actionDescriptions = {
            diplomatic: success ? 
                `${character.name} successfully negotiated with ${actionData.target}` :
                `${character.name}'s diplomatic attempt with ${actionData.target} faced challenges`,
            economic: success ?
                `${character.name} completed a profitable business deal with ${actionData.target}` :
                `${character.name}'s business proposal to ${actionData.target} was declined`,
            military: success ?
                `${character.name} successfully coordinated military operations with ${actionData.target}` :
                `${character.name}'s military coordination with ${actionData.target} encountered difficulties`,
            social: success ?
                `${character.name} organized a successful community event with ${actionData.target}` :
                `${character.name}'s community initiative with ${actionData.target} had limited impact`
        };
        
        return actionDescriptions[actionData.actionType] || 
               (success ? `${character.name} successfully completed an action` : 
                         `${character.name}'s action had mixed results`);
    }

    calculateActionConsequences(character, action) {
        const consequences = [];
        
        // Reputation changes
        if (action.result.success) {
            consequences.push({
                type: 'reputation_gain',
                category: action.actionType,
                value: Math.floor(action.result.effectiveness * 2),
                description: `Gained reputation in ${action.actionType}`
            });
        } else {
            consequences.push({
                type: 'reputation_loss',
                category: action.actionType,
                value: -1,
                description: `Lost reputation in ${action.actionType}`
            });
        }
        
        // Relationship changes
        if (action.target && action.target !== 'public') {
            const relationshipChange = action.result.success ? 1 : -1;
            consequences.push({
                type: 'relationship_change',
                target: action.target,
                value: relationshipChange,
                description: `Relationship with ${action.target} ${action.result.success ? 'improved' : 'strained'}`
            });
        }
        
        return consequences;
    }

    getCharacterActions(characterId, options = {}) {
        const actions = this.characterActions.get(characterId) || [];
        const { limit = 50, offset = 0 } = options;
        
        return actions.slice(offset, offset + limit);
    }

    // Relationship methods
    getCharacterRelationships(characterId) {
        const relationships = [];
        
        for (const [key, relationship] of this.relationships) {
            if (relationship.characterId === characterId || relationship.targetCharacterId === characterId) {
                relationships.push(relationship);
            }
        }
        
        return relationships;
    }

    updateCharacterRelationship(characterId, relationshipData) {
        const key = `${characterId}_${relationshipData.targetCharacterId}`;
        const relationship = {
            characterId,
            targetCharacterId: relationshipData.targetCharacterId,
            relationshipType: relationshipData.relationshipType,
            strength: relationshipData.strength,
            notes: relationshipData.notes,
            lastUpdated: Date.now(),
            createdAt: this.relationships.get(key)?.createdAt || Date.now()
        };
        
        this.relationships.set(key, relationship);
        return relationship;
    }

    // Category and summary methods
    getCharacterCategories() {
        const categories = {};
        
        for (const character of this.characters.values()) {
            if (!categories[character.category]) {
                categories[character.category] = {
                    name: character.category,
                    total: 0,
                    active: 0,
                    characters: []
                };
            }
            
            categories[character.category].total++;
            if (character.isActive) {
                categories[character.category].active++;
            }
            categories[character.category].characters.push({
                id: character.id,
                name: character.name,
                role: character.role,
                isActive: character.isActive
            });
        }
        
        return Object.values(categories);
    }

    getActiveCharactersSummary() {
        const activeChars = Array.from(this.activeCharacters)
            .map(id => this.characters.get(id))
            .filter(char => char);
        
        const summary = {
            totalActive: activeChars.length,
            byCategory: {},
            recentActions: 0,
            averageReputation: { diplomatic: 0, economic: 0, military: 0, social: 0 },
            lastActivity: Math.max(...activeChars.map(char => char.lastActivity))
        };
        
        // Calculate category breakdown
        activeChars.forEach(char => {
            if (!summary.byCategory[char.category]) {
                summary.byCategory[char.category] = 0;
            }
            summary.byCategory[char.category]++;
        });
        
        // Calculate average reputation
        if (activeChars.length > 0) {
            const totalRep = activeChars.reduce((acc, char) => ({
                diplomatic: acc.diplomatic + char.reputation.diplomatic,
                economic: acc.economic + char.reputation.economic,
                military: acc.military + char.reputation.military,
                social: acc.social + char.reputation.social
            }), { diplomatic: 0, economic: 0, military: 0, social: 0 });
            
            summary.averageReputation = {
                diplomatic: Math.round(totalRep.diplomatic / activeChars.length),
                economic: Math.round(totalRep.economic / activeChars.length),
                military: Math.round(totalRep.military / activeChars.length),
                social: Math.round(totalRep.social / activeChars.length)
            };
        }
        
        // Count recent actions (last hour)
        const oneHourAgo = Date.now() - 3600000;
        for (const actions of this.characterActions.values()) {
            summary.recentActions += actions.filter(action => action.timestamp > oneHourAgo).length;
        }
        
        return summary;
    }

    // Character injection and simulation methods
    injectCharacter(injectionData) {
        const { gameConditions, urgency, specialization } = injectionData;
        
        // Determine character category based on game conditions
        const category = this.determineNeededCategory(gameConditions);
        
        // Generate character based on needs
        const character = this.generateCharacterForConditions(category, specialization, urgency);
        
        // Add to system
        this.characters.set(character.id, character);
        this.characterActions.set(character.id, []);
        
        if (urgency > 0.7) {
            character.isActive = true;
            this.activeCharacters.add(character.id);
        }
        
        return character;
    }

    determineNeededCategory(gameConditions) {
        if (gameConditions.conflicts && gameConditions.conflicts.length > 0) {
            return 'diplomats';
        }
        if (gameConditions.economicOpportunities && gameConditions.economicOpportunities.length > 0) {
            return 'businessLeaders';
        }
        if (gameConditions.securityThreats && gameConditions.securityThreats.length > 0) {
            return 'military';
        }
        if (gameConditions.socialUnrest && gameConditions.socialUnrest > 0.6) {
            return 'citizens';
        }
        
        return 'minorCharacters';
    }

    generateCharacterForConditions(category, specialization, urgency) {
        const names = {
            diplomats: ['Ambassador Chen', 'Mediator Vex', 'Envoy Martinez', 'Negotiator Kala'],
            businessLeaders: ['CEO Thompson', 'Director Zara', 'Mogul Reeves', 'Entrepreneur Yuki'],
            military: ['General Hayes', 'Admiral Voss', 'Commander Steele', 'Colonel Park'],
            citizens: ['Activist Rivera', 'Organizer Kim', 'Journalist Webb', 'Leader Santos'],
            minorCharacters: ['Citizen Alpha', 'Worker Beta', 'Resident Gamma', 'Individual Delta']
        };
        
        const categoryNames = names[category] || names.minorCharacters;
        const name = categoryNames[Math.floor(Math.random() * categoryNames.length)];
        
        return {
            id: `injected_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            category,
            role: `${specialization} Specialist`,
            civilization: 'Dynamic',
            traits: this.generateTraitsForSpecialization(specialization),
            background: `Emerged due to current game conditions requiring ${specialization} expertise.`,
            motivations: this.generateMotivationsForCategory(category),
            capabilities: [specialization, 'adaptability', 'quick_response'],
            reputation: this.generateInitialReputation(category),
            isActive: urgency > 0.5,
            lastActivity: Date.now(),
            createdAt: Date.now(),
            injectionReason: `Game conditions required ${specialization} in ${category}`
        };
    }

    generateTraitsForSpecialization(specialization) {
        const traitMap = {
            conflict_resolution: ['patient', 'analytical', 'diplomatic'],
            opportunity_exploitation: ['ambitious', 'quick_thinking', 'networked'],
            threat_assessment: ['vigilant', 'strategic', 'decisive'],
            community_organizing: ['empathetic', 'persuasive', 'organized']
        };
        
        return traitMap[specialization] || ['adaptable', 'competent', 'motivated'];
    }

    generateMotivationsForCategory(category) {
        const motivationMap = {
            diplomats: ['peace_building', 'conflict_resolution', 'cultural_understanding'],
            businessLeaders: ['profit_maximization', 'market_expansion', 'innovation'],
            military: ['security', 'defense', 'strategic_advantage'],
            citizens: ['community_welfare', 'social_justice', 'democratic_participation'],
            minorCharacters: ['personal_advancement', 'stability', 'belonging']
        };
        
        return motivationMap[category] || ['survival', 'improvement'];
    }

    generateInitialReputation(category) {
        const baseRep = {
            diplomats: { diplomatic: 7, economic: 5, military: 4, social: 6 },
            businessLeaders: { diplomatic: 5, economic: 8, military: 4, social: 5 },
            military: { diplomatic: 4, economic: 4, military: 8, social: 6 },
            citizens: { diplomatic: 6, economic: 4, military: 3, social: 8 },
            minorCharacters: { diplomatic: 4, economic: 4, military: 4, social: 5 }
        };
        
        return baseRep[category] || { diplomatic: 5, economic: 5, military: 5, social: 5 };
    }

    getSimulationStatus() {
        return {
            totalCharacters: this.characters.size,
            activeCharacters: this.activeCharacters.size,
            processingCost: this.simulationMetrics.totalProcessingCost,
            budgetUtilization: this.simulationMetrics.budgetUtilization,
            lastOptimization: this.simulationMetrics.lastOptimization,
            activeSimulations: this.simulationMetrics.activeSimulations,
            charactersByCategory: this.getCharacterCountsByCategory()
        };
    }

    getCharacterCountsByCategory() {
        const counts = {};
        for (const character of this.characters.values()) {
            counts[character.category] = (counts[character.category] || 0) + 1;
        }
        return counts;
    }

    optimizeSimulation(optimizationData) {
        const { budget, priorities } = optimizationData;
        
        // Deactivate low-priority characters if over budget
        const activeChars = Array.from(this.activeCharacters)
            .map(id => this.characters.get(id))
            .filter(char => char);
        
        // Sort by priority and recent activity
        activeChars.sort((a, b) => {
            const aPriority = priorities[a.category] || 0.5;
            const bPriority = priorities[b.category] || 0.5;
            const aActivity = Date.now() - a.lastActivity;
            const bActivity = Date.now() - b.lastActivity;
            
            return (bPriority - aPriority) || (aActivity - bActivity);
        });
        
        // Keep only top characters within budget
        const targetActiveCount = Math.floor(budget / 10); // Assume 10 cost units per active character
        
        for (let i = targetActiveCount; i < activeChars.length; i++) {
            this.deactivateCharacter(activeChars[i].id);
        }
        
        this.simulationMetrics.lastOptimization = Date.now();
        this.simulationMetrics.budgetUtilization = Math.min(this.activeCharacters.size * 10 / budget, 1.0);
        
        return {
            deactivatedCharacters: Math.max(0, activeChars.length - targetActiveCount),
            activeCharacters: this.activeCharacters.size,
            budgetUtilization: this.simulationMetrics.budgetUtilization,
            estimatedCost: this.activeCharacters.size * 10
        };
    }
}

// Create and export singleton instance
const charactersState = new CharactersState();
module.exports = charactersState;
