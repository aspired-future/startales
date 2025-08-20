// Psychology AI Module - Character Personality and Decision Making

class PsychologyAI {
    constructor(config = {}) {
        this.config = {
            modelEndpoint: config.modelEndpoint || 'http://localhost:11434/api/generate',
            model: config.model || 'llama2',
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 500,
            ...config
        };

        this.personalityTraits = {
            openness: { min: 0, max: 100, description: 'Openness to experience' },
            conscientiousness: { min: 0, max: 100, description: 'Conscientiousness and organization' },
            extraversion: { min: 0, max: 100, description: 'Extraversion and social energy' },
            agreeableness: { min: 0, max: 100, description: 'Agreeableness and cooperation' },
            neuroticism: { min: 0, max: 100, description: 'Emotional stability (reverse scored)' }
        };

        this.emotionalStates = [
            'content', 'excited', 'anxious', 'angry', 'sad', 'hopeful', 
            'frustrated', 'proud', 'envious', 'grateful', 'fearful', 'determined'
        ];

        this.decisionFactors = [
            'personality', 'emotional_state', 'relationships', 'resources', 
            'goals', 'values', 'past_experiences', 'social_pressure', 'risk_tolerance'
        ];
    }

    async initialize() {
        console.log('Initializing Psychology AI module...');
        // Test connection to AI model
        try {
            await this.testConnection();
            console.log('Psychology AI module initialized successfully');
        } catch (error) {
            console.warn('Psychology AI model not available, using fallback logic');
            this.useFallback = true;
        }
    }

    async processDecision(input) {
        const { character, context, type } = input;

        if (this.useFallback) {
            return this.getFallbackDecision(character, context, type);
        }

        try {
            const prompt = this.buildDecisionPrompt(character, context, type);
            const response = await this.callAIModel(prompt);
            return this.parseDecisionResponse(response, character, context);
        } catch (error) {
            console.error('Psychology AI decision error:', error);
            return this.getFallbackDecision(character, context, type);
        }
    }

    buildDecisionPrompt(character, context, type) {
        const personalityDesc = this.describePersonality(character.personality);
        const emotionalDesc = this.describeEmotionalState(character.emotionalState);
        const contextDesc = this.describeContext(context);

        return {
            model: this.config.model,
            prompt: `You are a psychology AI analyzing character behavior in a galactic civilization simulation.

CHARACTER PROFILE:
Name: ${character.name}
Species: ${character.species}
Age: ${character.age}
Profession: ${character.profession}

PERSONALITY TRAITS:
${personalityDesc}

CURRENT EMOTIONAL STATE:
${emotionalDesc}

CURRENT SITUATION:
${contextDesc}

DECISION TYPE: ${type}

Based on this character's personality, emotional state, and current situation, what decision would they most likely make? Consider:

1. How their personality traits influence their decision-making
2. Their current emotional state and how it affects judgment
3. Their relationships and social connections
4. Their available resources and constraints
5. Their personal goals and values
6. Past experiences that might influence this decision

Provide your analysis in the following JSON format:
{
  "decision": {
    "action": "specific action they would take",
    "reasoning": "psychological reasoning behind the decision",
    "confidence": 0.85,
    "alternatives": ["alternative action 1", "alternative action 2"],
    "emotional_impact": "how this decision affects their emotional state",
    "social_impact": "how this affects their relationships",
    "long_term_consequences": "potential long-term effects"
  },
  "personality_factors": {
    "primary_trait": "most influential personality trait",
    "trait_influence": "how this trait specifically influenced the decision"
  },
  "emotional_factors": {
    "current_emotion": "dominant emotion affecting decision",
    "emotion_influence": "how emotion specifically influenced the decision"
  },
  "risk_assessment": {
    "risk_level": "low|medium|high",
    "risk_tolerance": "character's comfort with this risk level",
    "mitigation_strategies": ["strategy 1", "strategy 2"]
  }
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async callAIModel(prompt) {
        const response = await fetch(this.config.modelEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prompt)
        });

        if (!response.ok) {
            throw new Error(`AI model request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response || data.text || data.content;
    }

    parseDecisionResponse(response, character, context) {
        try {
            // Try to parse JSON response
            const parsed = JSON.parse(response);
            
            // Validate and enhance the response
            return {
                ...parsed,
                character_id: character.id,
                timestamp: Date.now(),
                context_hash: this.hashContext(context),
                processing_method: 'ai_analysis'
            };
        } catch (error) {
            // If JSON parsing fails, extract key information from text
            return this.extractDecisionFromText(response, character, context);
        }
    }

    extractDecisionFromText(text, character, context) {
        // Simple text extraction as fallback
        const lines = text.split('\n');
        let action = 'continue_current_activity';
        let reasoning = 'Based on character analysis';
        let confidence = 0.6;

        // Look for action indicators
        for (const line of lines) {
            if (line.toLowerCase().includes('decision:') || line.toLowerCase().includes('action:')) {
                action = line.split(':')[1]?.trim() || action;
            }
            if (line.toLowerCase().includes('reasoning:') || line.toLowerCase().includes('because:')) {
                reasoning = line.split(':')[1]?.trim() || reasoning;
            }
        }

        return {
            decision: {
                action,
                reasoning,
                confidence,
                alternatives: ['wait', 'seek_advice'],
                emotional_impact: 'neutral',
                social_impact: 'minimal',
                long_term_consequences: 'unknown'
            },
            personality_factors: {
                primary_trait: this.getPrimaryTrait(character.personality),
                trait_influence: 'moderate'
            },
            emotional_factors: {
                current_emotion: character.emotionalState || 'content',
                emotion_influence: 'moderate'
            },
            risk_assessment: {
                risk_level: 'medium',
                risk_tolerance: 'moderate',
                mitigation_strategies: ['gather_information', 'consult_others']
            },
            character_id: character.id,
            timestamp: Date.now(),
            processing_method: 'text_extraction'
        };
    }

    getFallbackDecision(character, context, type) {
        // Rule-based fallback when AI is not available
        const personality = character.personality || {};
        const resources = context.resources || {};
        
        let action = 'continue_current_activity';
        let reasoning = 'Maintaining current routine';
        let confidence = 0.4;

        // Simple personality-based decision logic
        if (personality.extraversion > 70 && context.relationships?.nearby?.length > 0) {
            action = 'socialize';
            reasoning = 'High extraversion drives social interaction';
            confidence = 0.7;
        } else if (personality.conscientiousness > 80 && context.character.profession) {
            action = 'work_diligently';
            reasoning = 'High conscientiousness promotes work focus';
            confidence = 0.8;
        } else if (personality.openness > 75 && context.environment?.opportunities?.length > 0) {
            action = 'explore_opportunity';
            reasoning = 'High openness encourages exploration';
            confidence = 0.6;
        } else if (resources.credits < 100) {
            action = 'seek_employment';
            reasoning = 'Low resources necessitate income generation';
            confidence = 0.9;
        }

        return {
            decision: {
                action,
                reasoning,
                confidence,
                alternatives: ['wait', 'rest', 'socialize'],
                emotional_impact: 'neutral',
                social_impact: 'minimal',
                long_term_consequences: 'maintaining status quo'
            },
            personality_factors: {
                primary_trait: this.getPrimaryTrait(personality),
                trait_influence: 'rule_based_logic'
            },
            emotional_factors: {
                current_emotion: character.emotionalState || 'content',
                emotion_influence: 'not_analyzed'
            },
            risk_assessment: {
                risk_level: 'low',
                risk_tolerance: 'conservative',
                mitigation_strategies: ['maintain_routine']
            },
            character_id: character.id,
            timestamp: Date.now(),
            processing_method: 'fallback_rules'
        };
    }

    // Utility Methods
    describePersonality(personality) {
        if (!personality) return 'Personality traits not defined';

        const traits = [];
        Object.entries(personality).forEach(([trait, value]) => {
            const level = this.getTraitLevel(value);
            traits.push(`${trait}: ${value}/100 (${level})`);
        });

        return traits.join('\n');
    }

    describeEmotionalState(emotionalState) {
        if (!emotionalState) return 'Emotional state: Content (default)';
        
        return `Current emotion: ${emotionalState.primary || 'content'}
Intensity: ${emotionalState.intensity || 50}/100
Duration: ${emotionalState.duration || 'recent'}
Triggers: ${emotionalState.triggers?.join(', ') || 'none identified'}`;
    }

    describeContext(context) {
        const descriptions = [];

        if (context.location) {
            descriptions.push(`Location: ${context.location.name} (${context.location.type})`);
        }

        if (context.resources) {
            descriptions.push(`Resources: ${context.resources.credits || 0} credits, ${Object.keys(context.resources).length} resource types`);
        }

        if (context.relationships?.nearby) {
            descriptions.push(`Nearby people: ${context.relationships.nearby.length} individuals`);
        }

        if (context.recentActions?.length > 0) {
            descriptions.push(`Recent actions: ${context.recentActions.slice(0, 3).map(a => a.action).join(', ')}`);
        }

        if (context.environment?.opportunities) {
            descriptions.push(`Available opportunities: ${context.environment.opportunities.length}`);
        }

        return descriptions.join('\n');
    }

    getTraitLevel(value) {
        if (value >= 80) return 'very high';
        if (value >= 60) return 'high';
        if (value >= 40) return 'moderate';
        if (value >= 20) return 'low';
        return 'very low';
    }

    getPrimaryTrait(personality) {
        if (!personality) return 'unknown';
        
        let maxTrait = 'conscientiousness';
        let maxValue = 0;

        Object.entries(personality).forEach(([trait, value]) => {
            if (value > maxValue) {
                maxValue = value;
                maxTrait = trait;
            }
        });

        return maxTrait;
    }

    hashContext(context) {
        // Simple hash for context comparison
        const contextStr = JSON.stringify(context);
        let hash = 0;
        for (let i = 0; i < contextStr.length; i++) {
            const char = contextStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    async testConnection() {
        const testPrompt = {
            model: this.config.model,
            prompt: 'Test connection. Respond with "OK".',
            options: {
                temperature: 0.1,
                max_tokens: 10
            }
        };

        const response = await this.callAIModel(testPrompt);
        if (!response || !response.toLowerCase().includes('ok')) {
            throw new Error('AI model test failed');
        }
    }

    // Character Analysis Methods
    async analyzePersonalityDevelopment(character, experiences) {
        // Analyze how experiences might change personality over time
        if (this.useFallback) {
            return this.getFallbackPersonalityAnalysis(character, experiences);
        }

        const prompt = this.buildPersonalityAnalysisPrompt(character, experiences);
        const response = await this.callAIModel(prompt);
        return this.parsePersonalityAnalysis(response);
    }

    async predictBehaviorPattern(character, situation) {
        // Predict likely behavior patterns in specific situations
        if (this.useFallback) {
            return this.getFallbackBehaviorPrediction(character, situation);
        }

        const prompt = this.buildBehaviorPredictionPrompt(character, situation);
        const response = await this.callAIModel(prompt);
        return this.parseBehaviorPrediction(response);
    }

    async analyzeRelationshipDynamics(character1, character2, context) {
        // Analyze relationship dynamics between characters
        if (this.useFallback) {
            return this.getFallbackRelationshipAnalysis(character1, character2, context);
        }

        const prompt = this.buildRelationshipAnalysisPrompt(character1, character2, context);
        const response = await this.callAIModel(prompt);
        return this.parseRelationshipAnalysis(response);
    }

    // Fallback methods for when AI is not available
    getFallbackPersonalityAnalysis(character, experiences) {
        return {
            personality_changes: {},
            confidence: 0.3,
            reasoning: 'Fallback analysis - AI not available',
            method: 'rule_based'
        };
    }

    getFallbackBehaviorPrediction(character, situation) {
        return {
            predicted_actions: ['continue_routine'],
            probability: 0.5,
            reasoning: 'Fallback prediction - AI not available',
            method: 'rule_based'
        };
    }

    getFallbackRelationshipAnalysis(character1, character2, context) {
        return {
            compatibility: 0.5,
            interaction_type: 'neutral',
            reasoning: 'Fallback analysis - AI not available',
            method: 'rule_based'
        };
    }
}

module.exports = { AIModule: PsychologyAI };

