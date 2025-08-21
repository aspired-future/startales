/**
 * Characters API - Endpoints for Character Management and Interaction
 */

const express = require('express');
const router = express.Router();

// Import character state management
const charactersState = require('../game-state/characters-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const charactersKnobsData = {
  // Character Behavior
  character_proactivity: 0.6,            // AI can control how proactive characters are (0.0-1.0)
  personality_expression: 0.7,           // AI can control personality expression strength (0.0-1.0)
  emotional_responsiveness: 0.6,         // AI can control emotional reactions (0.0-1.0)
  decision_autonomy: 0.5,                // AI can control character decision-making independence (0.0-1.0)
  
  // Relationship Dynamics
  relationship_formation_rate: 0.6,      // AI can control how quickly relationships form (0.0-1.0)
  conflict_tendency: 0.4,                // AI can control character conflict likelihood (0.0-1.0)
  loyalty_stability: 0.7,                // AI can control loyalty changes (0.0-1.0)
  trust_building_speed: 0.5,             // AI can control trust development (0.0-1.0)
  
  // Communication Patterns
  communication_frequency: 0.6,          // AI can control how often characters communicate (0.0-1.0)
  message_depth: 0.5,                    // AI can control message complexity/depth (0.0-1.0)
  diplomatic_skill: 0.7,                 // AI can control diplomatic communication ability (0.0-1.0)
  persuasion_effectiveness: 0.6,         // AI can control persuasive abilities (0.0-1.0)
  
  // Character Development
  skill_development_rate: 0.5,           // AI can control character skill growth (0.0-1.0)
  experience_learning: 0.7,              // AI can control learning from experiences (0.0-1.0)
  adaptation_flexibility: 0.6,           // AI can control adaptation to new situations (0.0-1.0)
  memory_retention: 0.8,                 // AI can control character memory strength (0.0-1.0)
  
  // Story Integration
  plot_involvement: 0.6,                 // AI can control character involvement in main plot (0.0-1.0)
  subplot_generation: 0.5,               // AI can control generation of character subplots (0.0-1.0)
  narrative_agency: 0.7,                 // AI can control character impact on story (0.0-1.0)
  dramatic_timing: 0.6,                  // AI can control timing of character actions (0.0-1.0)
  
  // AI Character Intelligence
  strategic_thinking: 0.7,               // AI can control character strategic planning (0.0-1.0)
  pattern_recognition: 0.6,              // AI can control character pattern recognition (0.0-1.0)
  predictive_behavior: 0.5,              // AI can control character prediction abilities (0.0-1.0)
  contextual_awareness: 0.8,             // AI can control situational awareness (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const charactersKnobSystem = new EnhancedKnobSystem(charactersKnobsData);

// Backward compatibility - expose knobs directly
const charactersKnobs = charactersKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateCharactersStructuredOutputs() {
  const characters = charactersState.getAllCharacters();
  const activeCharacters = characters.filter(c => c.isActive);
  
  return {
    // High-level character metrics for AI decision-making
    character_metrics: {
      total_characters: characters.length,
      active_characters: activeCharacters.length,
      character_categories: calculateCharacterCategories(),
      relationship_network_density: calculateRelationshipDensity(),
      average_loyalty: calculateAverageLoyalty(),
      communication_activity: calculateCommunicationActivity(),
      character_development_rate: calculateCharacterDevelopmentRate()
    },
    
    // Character analysis for AI strategic planning
    character_analysis: {
      personality_distribution: analyzePersonalityDistribution(),
      relationship_patterns: analyzeRelationshipPatterns(),
      communication_networks: analyzeCommunicationNetworks(),
      influence_hierarchies: analyzeInfluenceHierarchies(),
      character_motivations: analyzeCharacterMotivations()
    },
    
    // Character effectiveness for AI feedback
    effectiveness_assessment: {
      diplomatic_effectiveness: assessDiplomaticEffectiveness(),
      leadership_performance: assessLeadershipPerformance(),
      character_satisfaction: assessCharacterSatisfaction(),
      story_contribution: assessStoryContribution(),
      relationship_health: assessRelationshipHealth()
    },
    
    // Character alerts and recommendations for AI attention
    ai_alerts: generateCharactersAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      diplomatic_capacity: calculateDiplomaticCapacity(),
      leadership_availability: calculateLeadershipAvailability(),
      cultural_representation: calculateCulturalRepresentation(),
      skill_distribution: calculateSkillDistribution(),
      character_network_effects: calculateNetworkEffects(),
      story_potential: calculateStoryPotential()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...charactersKnobs }
  };
}

/**
 * GET /api/characters - Get all characters with filtering options
 */
router.get('/', (req, res) => {
    try {
        const { category, active, civilization, search } = req.query;
        let characters = charactersState.getAllCharacters();
        
        // Apply filters
        if (category) {
            characters = characters.filter(char => char.category === category);
        }
        
        if (active !== undefined) {
            const isActive = active === 'true';
            characters = characters.filter(char => char.isActive === isActive);
        }
        
        if (civilization) {
            characters = characters.filter(char => char.civilization === civilization);
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            characters = characters.filter(char => 
                char.name.toLowerCase().includes(searchLower) ||
                char.role.toLowerCase().includes(searchLower) ||
                char.background.toLowerCase().includes(searchLower)
            );
        }
        
        res.json({
            success: true,
            characters: characters,
            total: characters.length,
            filters: { category, active, civilization, search }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch characters',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/categories - Get character categories with counts
 */
router.get('/categories', (req, res) => {
    try {
        const categories = charactersState.getCharacterCategories();
        res.json({
            success: true,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch character categories',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/:id - Get specific character details
 */
router.get('/:id', (req, res) => {
    try {
        const character = charactersState.getCharacterById(req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            character: character
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch character',
            details: error.message
        });
    }
});

/**
 * POST /api/characters - Create new character
 */
router.post('/', (req, res) => {
    try {
        const characterData = req.body;
        const newCharacter = charactersState.createCharacter(characterData);
        
        res.status(201).json({
            success: true,
            character: newCharacter,
            message: 'Character created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create character',
            details: error.message
        });
    }
});

/**
 * PUT /api/characters/:id - Update character
 */
router.put('/:id', (req, res) => {
    try {
        const updatedCharacter = charactersState.updateCharacter(req.params.id, req.body);
        
        if (!updatedCharacter) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            character: updatedCharacter,
            message: 'Character updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update character',
            details: error.message
        });
    }
});

/**
 * DELETE /api/characters/:id - Remove character
 */
router.delete('/:id', (req, res) => {
    try {
        const success = charactersState.removeCharacter(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Character removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to remove character',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/:id/activate - Activate character for simulation
 */
router.post('/:id/activate', (req, res) => {
    try {
        const character = charactersState.activateCharacter(req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            character: character,
            message: 'Character activated for simulation'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to activate character',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/:id/deactivate - Deactivate character from simulation
 */
router.post('/:id/deactivate', (req, res) => {
    try {
        const character = charactersState.deactivateCharacter(req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            character: character,
            message: 'Character deactivated from simulation'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to deactivate character',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/:id/action - Execute character action
 */
router.post('/:id/action', (req, res) => {
    try {
        const { actionType, target, parameters } = req.body;
        const result = charactersState.executeCharacterAction(req.params.id, {
            actionType,
            target,
            parameters,
            timestamp: Date.now()
        });
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error || 'Action execution failed'
            });
        }
        
        res.json({
            success: true,
            result: result,
            message: 'Character action executed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to execute character action',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/:id/actions - Get character action history
 */
router.get('/:id/actions', (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const actions = charactersState.getCharacterActions(req.params.id, {
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        res.json({
            success: true,
            actions: actions,
            total: actions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch character actions',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/:id/relationships - Get character relationships
 */
router.get('/:id/relationships', (req, res) => {
    try {
        const relationships = charactersState.getCharacterRelationships(req.params.id);
        
        res.json({
            success: true,
            relationships: relationships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch character relationships',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/:id/relationships - Create or update relationship
 */
router.post('/:id/relationships', (req, res) => {
    try {
        const { targetCharacterId, relationshipType, strength, notes } = req.body;
        const relationship = charactersState.updateCharacterRelationship(req.params.id, {
            targetCharacterId,
            relationshipType,
            strength,
            notes,
            lastUpdated: Date.now()
        });
        
        res.json({
            success: true,
            relationship: relationship,
            message: 'Character relationship updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update character relationship',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/active/summary - Get summary of active characters
 */
router.get('/active/summary', (req, res) => {
    try {
        const summary = charactersState.getActiveCharactersSummary();
        
        res.json({
            success: true,
            summary: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch active characters summary',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/inject - Inject new character based on game conditions
 */
router.post('/inject', (req, res) => {
    try {
        const { gameConditions, urgency, specialization } = req.body;
        const character = charactersState.injectCharacter({
            gameConditions,
            urgency,
            specialization,
            timestamp: Date.now()
        });
        
        res.status(201).json({
            success: true,
            character: character,
            message: 'Character injected successfully based on game conditions'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to inject character',
            details: error.message
        });
    }
});

/**
 * GET /api/characters/simulation/status - Get character simulation status
 */
router.get('/simulation/status', (req, res) => {
    try {
        const status = charactersState.getSimulationStatus();
        
        res.json({
            success: true,
            status: status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch simulation status',
            details: error.message
        });
    }
});

/**
 * POST /api/characters/simulation/optimize - Optimize character simulation for cost
 */
router.post('/simulation/optimize', (req, res) => {
    try {
        const { budget, priorities } = req.body;
        const optimization = charactersState.optimizeSimulation({
            budget,
            priorities,
            timestamp: Date.now()
        });
        
        res.json({
            success: true,
            optimization: optimization,
            message: 'Character simulation optimized successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to optimize character simulation',
            details: error.message
        });
    }
});

// Helper functions for characters structured outputs (streamlined)
function calculateCharacterCategories() {
    const characters = charactersState.getAllCharacters();
    const categories = {};
    characters.forEach(char => {
        const category = char.category || 'unknown';
        categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
}

function calculateRelationshipDensity() {
    const characters = charactersState.getAllCharacters();
    const totalPossibleRelationships = (characters.length * (characters.length - 1)) / 2;
    const actualRelationships = characters.reduce((sum, char) => sum + (char.relationships?.length || 0), 0) / 2;
    return totalPossibleRelationships > 0 ? actualRelationships / totalPossibleRelationships : 0;
}

function calculateAverageLoyalty() {
    const characters = charactersState.getAllCharacters();
    const loyaltySum = characters.reduce((sum, char) => sum + (char.loyalty || 0.5), 0);
    return characters.length > 0 ? loyaltySum / characters.length : 0.5;
}

function calculateCommunicationActivity() {
    const communicationFreq = charactersKnobs.communication_frequency;
    const messageDepth = charactersKnobs.message_depth;
    const diplomaticSkill = charactersKnobs.diplomatic_skill;
    return (communicationFreq + messageDepth + diplomaticSkill) / 3;
}

function calculateCharacterDevelopmentRate() {
    const skillDev = charactersKnobs.skill_development_rate;
    const experienceLearning = charactersKnobs.experience_learning;
    const adaptationFlex = charactersKnobs.adaptation_flexibility;
    return (skillDev + experienceLearning + adaptationFlex) / 3;
}

function analyzePersonalityDistribution() {
    const characters = charactersState.getAllCharacters();
    const personalities = {};
    characters.forEach(char => {
        const personality = char.personality?.primary || 'balanced';
        personalities[personality] = (personalities[personality] || 0) + 1;
    });
    return personalities;
}

function analyzeRelationshipPatterns() {
    const characters = charactersState.getAllCharacters();
    const relationshipTypes = { positive: 0, neutral: 0, negative: 0, complex: 0 };
    characters.forEach(char => {
        if (char.relationships) {
            char.relationships.forEach(rel => {
                const type = rel.type || 'neutral';
                relationshipTypes[type] = (relationshipTypes[type] || 0) + 1;
            });
        }
    });
    return relationshipTypes;
}

function analyzeCommunicationNetworks() {
    const characters = charactersState.getAllCharacters();
    const activeCharacters = characters.filter(c => c.isActive);
    const communicationFreq = charactersKnobs.communication_frequency;
    const networkStrength = activeCharacters.length * communicationFreq;
    return { active_communicators: activeCharacters.length, network_strength: networkStrength };
}

function analyzeInfluenceHierarchies() {
    const characters = charactersState.getAllCharacters();
    const influentialCharacters = characters.filter(c => c.influence > 0.6).length;
    const leadershipCharacters = characters.filter(c => c.role?.includes('leader') || c.role?.includes('minister')).length;
    return { influential_characters: influentialCharacters, leadership_positions: leadershipCharacters };
}

function analyzeCharacterMotivations() {
    const characters = charactersState.getAllCharacters();
    const motivations = { power: 0, knowledge: 0, wealth: 0, service: 0, survival: 0, other: 0 };
    characters.forEach(char => {
        const motivation = char.motivation || 'other';
        motivations[motivation] = (motivations[motivation] || 0) + 1;
    });
    return motivations;
}

function assessDiplomaticEffectiveness() {
    const diplomaticSkill = charactersKnobs.diplomatic_skill;
    const persuasionEff = charactersKnobs.persuasion_effectiveness;
    const contextualAwareness = charactersKnobs.contextual_awareness;
    const effectiveness = (diplomaticSkill + persuasionEff + contextualAwareness) / 3;
    return { effectiveness_score: effectiveness, diplomatic_skill: diplomaticSkill };
}

function assessLeadershipPerformance() {
    const characters = charactersState.getAllCharacters();
    const leaders = characters.filter(c => c.role?.includes('leader') || c.role?.includes('minister'));
    const avgLoyalty = leaders.length > 0 ? leaders.reduce((sum, l) => sum + (l.loyalty || 0.5), 0) / leaders.length : 0.5;
    const strategicThinking = charactersKnobs.strategic_thinking;
    return { leader_count: leaders.length, average_loyalty: avgLoyalty, strategic_capability: strategicThinking };
}

function assessCharacterSatisfaction() {
    const characters = charactersState.getAllCharacters();
    const satisfiedCharacters = characters.filter(c => (c.satisfaction || 0.5) > 0.6).length;
    const satisfactionRate = characters.length > 0 ? satisfiedCharacters / characters.length : 0.5;
    const emotionalResp = charactersKnobs.emotional_responsiveness;
    return { satisfaction_rate: satisfactionRate, satisfied_count: satisfiedCharacters, emotional_health: emotionalResp };
}

function assessStoryContribution() {
    const plotInvolvement = charactersKnobs.plot_involvement;
    const narrativeAgency = charactersKnobs.narrative_agency;
    const subplotGeneration = charactersKnobs.subplot_generation;
    const storyContribution = (plotInvolvement + narrativeAgency + subplotGeneration) / 3;
    return { story_contribution: storyContribution, plot_involvement: plotInvolvement, narrative_impact: narrativeAgency };
}

function assessRelationshipHealth() {
    const relationshipFormation = charactersKnobs.relationship_formation_rate;
    const conflictTendency = charactersKnobs.conflict_tendency;
    const loyaltyStability = charactersKnobs.loyalty_stability;
    const trustBuilding = charactersKnobs.trust_building_speed;
    const healthScore = (relationshipFormation + loyaltyStability + trustBuilding + (1 - conflictTendency)) / 4;
    return { health_score: healthScore, conflict_level: conflictTendency, trust_development: trustBuilding };
}

function generateCharactersAIAlerts() {
    const alerts = [];
    
    // Low loyalty alert
    const avgLoyalty = calculateAverageLoyalty();
    if (avgLoyalty < 0.4) {
        alerts.push({ type: 'low_loyalty', severity: 'high', message: 'Character loyalty levels are critically low' });
    }
    
    // High conflict alert
    const conflictTendency = charactersKnobs.conflict_tendency;
    if (conflictTendency > 0.7) {
        alerts.push({ type: 'high_conflict', severity: 'medium', message: 'High conflict tendency may destabilize relationships' });
    }
    
    // Communication breakdown alert
    const commActivity = calculateCommunicationActivity();
    if (commActivity < 0.3) {
        alerts.push({ type: 'communication_breakdown', severity: 'medium', message: 'Low communication activity detected' });
    }
    
    // Character development stagnation alert
    const devRate = calculateCharacterDevelopmentRate();
    if (devRate < 0.3) {
        alerts.push({ type: 'development_stagnation', severity: 'low', message: 'Character development rates are low' });
    }
    
    return alerts;
}

function calculateDiplomaticCapacity() {
    const characters = charactersState.getAllCharacters();
    const diplomats = characters.filter(c => c.role?.includes('diplomat') || c.category === 'diplomatic');
    const diplomaticSkill = charactersKnobs.diplomatic_skill;
    const capacity = diplomats.length * diplomaticSkill;
    return { diplomatic_characters: diplomats.length, skill_level: diplomaticSkill, total_capacity: capacity };
}

function calculateLeadershipAvailability() {
    const characters = charactersState.getAllCharacters();
    const leaders = characters.filter(c => c.role?.includes('leader') || c.role?.includes('minister'));
    const availableLeaders = leaders.filter(c => c.isActive && (c.availability || 1.0) > 0.5).length;
    const strategicThinking = charactersKnobs.strategic_thinking;
    return { total_leaders: leaders.length, available_leaders: availableLeaders, strategic_capability: strategicThinking };
}

function calculateCulturalRepresentation() {
    const characters = charactersState.getAllCharacters();
    const cultures = {};
    characters.forEach(char => {
        const culture = char.culture || char.civilization || 'unknown';
        cultures[culture] = (cultures[culture] || 0) + 1;
    });
    const diversityIndex = Object.keys(cultures).length / Math.max(1, characters.length);
    return { cultural_groups: Object.keys(cultures).length, diversity_index: diversityIndex, representation: cultures };
}

function calculateSkillDistribution() {
    const characters = charactersState.getAllCharacters();
    const skills = { military: 0, diplomatic: 0, economic: 0, scientific: 0, cultural: 0, administrative: 0 };
    characters.forEach(char => {
        if (char.skills) {
            Object.keys(char.skills).forEach(skill => {
                if (skills.hasOwnProperty(skill)) {
                    skills[skill] += char.skills[skill] || 0;
                }
            });
        }
    });
    return skills;
}

function calculateNetworkEffects() {
    const relationshipDensity = calculateRelationshipDensity();
    const communicationActivity = calculateCommunicationActivity();
    const influenceHierarchy = analyzeInfluenceHierarchies();
    const networkStrength = (relationshipDensity + communicationActivity) / 2;
    return { 
        network_strength: networkStrength, 
        relationship_density: relationshipDensity,
        influential_nodes: influenceHierarchy.influential_characters
    };
}

function calculateStoryPotential() {
    const plotInvolvement = charactersKnobs.plot_involvement;
    const narrativeAgency = charactersKnobs.narrative_agency;
    const subplotGeneration = charactersKnobs.subplot_generation;
    const dramaticTiming = charactersKnobs.dramatic_timing;
    const storyPotential = (plotInvolvement + narrativeAgency + subplotGeneration + dramaticTiming) / 4;
    return { story_potential: storyPotential, subplot_capacity: subplotGeneration, dramatic_readiness: dramaticTiming };
}

// Apply AI knobs to actual characters game state
function applyCharactersKnobsToGameState() {
    const characters = charactersState.getAllCharacters();
    
    // Apply character proactivity to message generation
    const proactivity = charactersKnobs.character_proactivity;
    characters.forEach(char => {
        if (char.isActive && proactivity > 0.6) {
            char.messageGenerationRate = (char.baseMessageRate || 1.0) * (1 + proactivity * 0.5);
            char.initiativeLevel = proactivity;
        }
    });
    
    // Apply personality expression to character interactions
    const personalityExpression = charactersKnobs.personality_expression;
    characters.forEach(char => {
        char.personalityStrength = personalityExpression;
        if (personalityExpression > 0.7) {
            char.communicationStyle = 'expressive';
            char.decisionMakingStyle = 'personality-driven';
        } else if (personalityExpression < 0.3) {
            char.communicationStyle = 'reserved';
            char.decisionMakingStyle = 'analytical';
        }
    });
    
    // Apply relationship formation rate to relationship dynamics
    const relationshipFormation = charactersKnobs.relationship_formation_rate;
    characters.forEach(char => {
        if (char.relationships) {
            char.relationships.forEach(rel => {
                rel.developmentRate = relationshipFormation;
                if (relationshipFormation > 0.7) {
                    rel.strengthGrowthRate = 0.1; // Faster relationship development
                } else if (relationshipFormation < 0.3) {
                    rel.strengthGrowthRate = 0.02; // Slower relationship development
                }
            });
        }
    });
    
    // Apply loyalty stability to character loyalty changes
    const loyaltyStability = charactersKnobs.loyalty_stability;
    characters.forEach(char => {
        char.loyaltyStability = loyaltyStability;
        if (loyaltyStability > 0.7) {
            char.loyaltyChangeRate = 0.01; // Very stable loyalty
        } else if (loyaltyStability < 0.3) {
            char.loyaltyChangeRate = 0.1; // Volatile loyalty
        } else {
            char.loyaltyChangeRate = 0.05; // Moderate loyalty changes
        }
    });
    
    // Apply communication frequency to character messaging
    const communicationFreq = charactersKnobs.communication_frequency;
    characters.forEach(char => {
        char.communicationFrequency = communicationFreq;
        if (communicationFreq > 0.7) {
            char.messageInterval = 300000; // 5 minutes
        } else if (communicationFreq < 0.3) {
            char.messageInterval = 1800000; // 30 minutes
        } else {
            char.messageInterval = 900000; // 15 minutes
        }
    });
    
    // Apply strategic thinking to character decision-making
    const strategicThinking = charactersKnobs.strategic_thinking;
    characters.forEach(char => {
        if (char.role?.includes('leader') || char.role?.includes('minister')) {
            char.strategicCapability = strategicThinking;
            char.planningHorizon = strategicThinking * 30; // Days ahead they plan
            if (strategicThinking > 0.8) {
                char.decisionQuality = 'excellent';
            } else if (strategicThinking > 0.6) {
                char.decisionQuality = 'good';
            } else {
                char.decisionQuality = 'average';
            }
        }
    });
    
    // Apply memory retention to character learning
    const memoryRetention = charactersKnobs.memory_retention;
    characters.forEach(char => {
        char.memoryStrength = memoryRetention;
        char.experienceRetentionRate = memoryRetention;
        if (memoryRetention > 0.8) {
            char.learningEfficiency = 1.5; // Fast learner
        } else if (memoryRetention < 0.4) {
            char.learningEfficiency = 0.7; // Slow learner
        } else {
            char.learningEfficiency = 1.0; // Normal learning
        }
    });
    
    console.log('🎛️ Characters knobs applied to game state:', {
        character_proactivity: charactersKnobs.character_proactivity,
        personality_expression: charactersKnobs.personality_expression,
        relationship_formation: charactersKnobs.relationship_formation_rate,
        loyalty_stability: charactersKnobs.loyalty_stability,
        communication_frequency: charactersKnobs.communication_frequency,
        strategic_thinking: charactersKnobs.strategic_thinking
    });
}

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
    const knobData = charactersKnobSystem.getKnobsWithMetadata();
    res.json({
        ...knobData,
        system: 'characters',
        description: 'AI-adjustable parameters for character system with enhanced input support',
        input_help: charactersKnobSystem.getKnobDescriptions()
    });
});

router.post('/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
        return res.status(400).json({
            success: false,
            error: 'Invalid knobs data. Expected object with knob values.',
            help: charactersKnobSystem.getKnobDescriptions().examples
        });
    }
    
    // Update knobs using enhanced system
    const updateResult = charactersKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
        applyCharactersKnobsToGameState();
    } catch (error) {
        console.error('Error applying characters knobs to game state:', error);
    }
    
    res.json({
        success: updateResult.success,
        system: 'characters',
        ...updateResult,
        message: 'Characters knobs updated successfully using enhanced input processing'
    });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
    res.json({
        system: 'characters',
        help: charactersKnobSystem.getKnobDescriptions(),
        current_values: charactersKnobSystem.getKnobsWithMetadata()
    });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
    const structuredData = generateCharactersStructuredOutputs();
    res.json({
        ...structuredData,
        description: 'Structured character data for AI analysis and decision-making'
    });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
    const outputs = generateCharactersStructuredOutputs();
    res.json({
        diplomatic_data: outputs.cross_system_data.diplomatic_capacity,
        leadership_data: outputs.cross_system_data.leadership_availability,
        cultural_data: outputs.cross_system_data.cultural_representation,
        skill_data: outputs.cross_system_data.skill_distribution,
        network_data: outputs.cross_system_data.character_network_effects,
        story_data: outputs.cross_system_data.story_potential,
        character_summary: outputs.character_metrics,
        timestamp: outputs.timestamp
    });
});

module.exports = router;
