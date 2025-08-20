// Culture AI Module - Cultural Evolution and Cross-Cultural Analysis

class CultureAI {
    constructor(config = {}) {
        this.config = {
            modelEndpoint: config.modelEndpoint || 'http://localhost:11434/api/generate',
            model: config.model || 'llama2',
            temperature: config.temperature || 0.6,
            maxTokens: config.maxTokens || 700,
            ...config
        };

        this.culturalDimensions = {
            individualism: { min: 0, max: 100, description: 'Individual vs collective focus' },
            powerDistance: { min: 0, max: 100, description: 'Acceptance of hierarchy' },
            uncertaintyAvoidance: { min: 0, max: 100, description: 'Tolerance for ambiguity' },
            masculinity: { min: 0, max: 100, description: 'Competitive vs cooperative values' },
            longTermOrientation: { min: 0, max: 100, description: 'Future vs tradition focus' },
            indulgence: { min: 0, max: 100, description: 'Gratification vs restraint' }
        };

        this.culturalElements = [
            'language', 'religion', 'customs', 'values', 'arts', 'cuisine',
            'social_norms', 'family_structure', 'education', 'governance',
            'technology_adoption', 'economic_practices'
        ];

        this.interactionTypes = [
            'assimilation', 'integration', 'separation', 'marginalization',
            'cultural_exchange', 'cultural_conflict', 'cultural_synthesis'
        ];
    }

    async initialize() {
        console.log('Initializing Culture AI module...');
        try {
            await this.testConnection();
            console.log('Culture AI module initialized successfully');
        } catch (error) {
            console.warn('Culture AI model not available, using fallback logic');
            this.useFallback = true;
        }
    }

    async analyzeCulturalEvolution(population, timespan, influences) {
        if (this.useFallback) {
            return this.getFallbackCulturalEvolution(population, timespan, influences);
        }

        try {
            const prompt = this.buildCulturalEvolutionPrompt(population, timespan, influences);
            const response = await this.callAIModel(prompt);
            return this.parseCulturalEvolution(response);
        } catch (error) {
            console.error('Culture AI evolution analysis error:', error);
            return this.getFallbackCulturalEvolution(population, timespan, influences);
        }
    }

    buildCulturalEvolutionPrompt(population, timespan, influences) {
        const populationDesc = this.describePopulation(population);
        const influencesDesc = this.describeInfluences(influences);

        return {
            model: this.config.model,
            prompt: `You are a cultural anthropologist AI analyzing cultural evolution in a galactic civilization.

POPULATION PROFILE:
${populationDesc}

TIMESPAN: ${timespan} years

EXTERNAL INFLUENCES:
${influencesDesc}

Analyze how this population's culture would evolve over the given timespan considering:

1. Internal cultural dynamics and generational changes
2. External influences from other cultures and civilizations
3. Technological advancement impacts on cultural practices
4. Economic changes affecting social structures
5. Environmental factors influencing cultural adaptation
6. Migration patterns and demographic shifts
7. Educational and media influences
8. Political and governance changes

Provide your analysis in JSON format:
{
  "cultural_evolution": {
    "overall_direction": "progressive|conservative|mixed",
    "rate_of_change": "rapid|moderate|slow",
    "stability_factors": ["factor1", "factor2"],
    "change_drivers": ["driver1", "driver2"]
  },
  "dimension_changes": {
    "individualism": {"from": 65, "to": 70, "trend": "increasing"},
    "powerDistance": {"from": 45, "to": 40, "trend": "decreasing"},
    "uncertaintyAvoidance": {"from": 55, "to": 50, "trend": "decreasing"}
  },
  "cultural_elements": {
    "language": {
      "changes": ["new vocabulary", "simplified grammar"],
      "external_influence": 0.3,
      "preservation_level": 0.8
    },
    "religion": {
      "changes": ["modernized practices", "new interpretations"],
      "external_influence": 0.2,
      "preservation_level": 0.9
    },
    "social_norms": {
      "changes": ["relaxed hierarchies", "new communication patterns"],
      "external_influence": 0.4,
      "preservation_level": 0.6
    }
  },
  "generational_differences": {
    "older_generation": {
      "adaptation_rate": 0.3,
      "resistance_areas": ["traditional values", "religious practices"],
      "acceptance_areas": ["technology", "economic practices"]
    },
    "younger_generation": {
      "adoption_rate": 0.8,
      "innovation_areas": ["social norms", "communication"],
      "preservation_areas": ["core identity", "family values"]
    }
  },
  "cultural_products": {
    "new_traditions": ["tradition1", "tradition2"],
    "modified_practices": ["practice1", "practice2"],
    "lost_elements": ["element1", "element2"],
    "hybrid_forms": ["hybrid1", "hybrid2"]
  },
  "integration_patterns": {
    "successful_integrations": ["area1", "area2"],
    "conflict_areas": ["area1", "area2"],
    "synthesis_opportunities": ["opportunity1", "opportunity2"]
  }
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async analyzeCrossCulturalInteraction(culture1, culture2, interactionContext) {
        if (this.useFallback) {
            return this.getFallbackCrossCulturalAnalysis(culture1, culture2, interactionContext);
        }

        const prompt = this.buildCrossCulturalPrompt(culture1, culture2, interactionContext);
        const response = await this.callAIModel(prompt);
        return this.parseCrossCulturalAnalysis(response);
    }

    buildCrossCulturalPrompt(culture1, culture2, context) {
        return {
            model: this.config.model,
            prompt: `You are a cultural interaction specialist AI analyzing contact between two civilizations.

CULTURE 1:
Name: ${culture1.name}
Core Values: ${culture1.values?.join(', ') || 'Unknown'}
Social Structure: ${culture1.socialStructure || 'Unknown'}
Technology Level: ${culture1.technologyLevel || 'Unknown'}
Population: ${culture1.population || 'Unknown'}

CULTURE 2:
Name: ${culture2.name}
Core Values: ${culture2.values?.join(', ') || 'Unknown'}
Social Structure: ${culture2.socialStructure || 'Unknown'}
Technology Level: ${culture2.technologyLevel || 'Unknown'}
Population: ${culture2.population || 'Unknown'}

INTERACTION CONTEXT:
Type: ${context.type || 'Unknown'}
Duration: ${context.duration || 'Unknown'}
Setting: ${context.setting || 'Unknown'}
Power Balance: ${context.powerBalance || 'Equal'}

Analyze the cross-cultural interaction and predict outcomes:

{
  "compatibility_analysis": {
    "overall_compatibility": 0.75,
    "compatible_areas": ["shared values", "similar practices"],
    "conflict_areas": ["different hierarchies", "opposing beliefs"],
    "neutral_areas": ["technology", "economics"]
  },
  "interaction_prediction": {
    "most_likely_outcome": "integration|conflict|coexistence|dominance",
    "confidence": 0.8,
    "timeline": "short|medium|long term",
    "key_factors": ["factor1", "factor2", "factor3"]
  },
  "cultural_exchange": {
    "culture1_adopts": ["practice1", "technology1"],
    "culture2_adopts": ["practice2", "value2"],
    "mutual_innovations": ["innovation1", "innovation2"],
    "resistance_points": ["area1", "area2"]
  },
  "potential_conflicts": [
    {
      "area": "religious practices",
      "severity": "high|medium|low",
      "probability": 0.6,
      "mitigation": "suggested approach"
    }
  ],
  "integration_opportunities": [
    {
      "area": "trade practices",
      "potential": "high|medium|low",
      "benefits": ["benefit1", "benefit2"],
      "requirements": ["requirement1", "requirement2"]
    }
  ],
  "long_term_outcomes": {
    "cultural_synthesis": 0.4,
    "peaceful_coexistence": 0.6,
    "cultural_dominance": 0.2,
    "ongoing_conflict": 0.1
  }
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async predictCulturalTrends(culture, externalFactors, timeHorizon) {
        if (this.useFallback) {
            return this.getFallbackTrendPrediction(culture, externalFactors, timeHorizon);
        }

        const prompt = this.buildTrendPredictionPrompt(culture, externalFactors, timeHorizon);
        const response = await this.callAIModel(prompt);
        return this.parseTrendPrediction(response);
    }

    async analyzeArtisticExpression(culture, timeContext, influences) {
        if (this.useFallback) {
            return this.getFallbackArtisticAnalysis(culture, timeContext, influences);
        }

        const prompt = this.buildArtisticAnalysisPrompt(culture, timeContext, influences);
        const response = await this.callAIModel(prompt);
        return this.parseArtisticAnalysis(response);
    }

    // Utility Methods
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

    parseCulturalEvolution(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                ...parsed,
                timestamp: Date.now(),
                processing_method: 'ai_analysis'
            };
        } catch (error) {
            return this.extractCulturalDataFromText(response);
        }
    }

    extractCulturalDataFromText(text) {
        // Simple text extraction as fallback
        const lines = text.split('\n');
        let direction = 'mixed';
        let changeRate = 'moderate';

        for (const line of lines) {
            if (line.toLowerCase().includes('progressive') || line.toLowerCase().includes('advancing')) {
                direction = 'progressive';
            }
            if (line.toLowerCase().includes('conservative') || line.toLowerCase().includes('traditional')) {
                direction = 'conservative';
            }
            if (line.toLowerCase().includes('rapid') || line.toLowerCase().includes('fast')) {
                changeRate = 'rapid';
            }
            if (line.toLowerCase().includes('slow') || line.toLowerCase().includes('gradual')) {
                changeRate = 'slow';
            }
        }

        return {
            cultural_evolution: {
                overall_direction: direction,
                rate_of_change: changeRate,
                stability_factors: ['tradition', 'social_structure'],
                change_drivers: ['technology', 'external_contact']
            },
            timestamp: Date.now(),
            processing_method: 'text_extraction'
        };
    }

    describePopulation(population) {
        if (!population) return 'Population data not available';

        return `Population Size: ${population.size || 'Unknown'}
Species Composition: ${population.species?.join(', ') || 'Unknown'}
Age Distribution: ${population.ageDistribution || 'Unknown'}
Education Level: ${population.educationLevel || 'Unknown'}
Urban/Rural Split: ${population.urbanRural || 'Unknown'}
Cultural Background: ${population.culturalBackground || 'Unknown'}
Languages: ${population.languages?.join(', ') || 'Unknown'}
Religious Affiliations: ${population.religions?.join(', ') || 'Unknown'}`;
    }

    describeInfluences(influences) {
        if (!influences || influences.length === 0) return 'No external influences identified';

        return influences.map(influence => 
            `${influence.type}: ${influence.description} (Strength: ${influence.strength || 'Unknown'})`
        ).join('\n');
    }

    // Fallback Methods
    getFallbackCulturalEvolution(population, timespan, influences) {
        const changeRate = timespan > 50 ? 'moderate' : timespan > 20 ? 'slow' : 'minimal';
        const direction = influences?.length > 2 ? 'progressive' : 'conservative';

        return {
            cultural_evolution: {
                overall_direction: direction,
                rate_of_change: changeRate,
                stability_factors: ['tradition', 'social_inertia'],
                change_drivers: ['technology', 'generational_change']
            },
            dimension_changes: {
                individualism: { from: 50, to: 52, trend: 'slight_increase' },
                powerDistance: { from: 50, to: 49, trend: 'slight_decrease' }
            },
            processing_method: 'fallback_rules'
        };
    }

    getFallbackCrossCulturalAnalysis(culture1, culture2, context) {
        // Simple compatibility based on available data
        let compatibility = 0.5;
        
        if (culture1.technologyLevel === culture2.technologyLevel) {
            compatibility += 0.2;
        }
        
        if (culture1.values && culture2.values) {
            const sharedValues = culture1.values.filter(v => culture2.values.includes(v));
            compatibility += (sharedValues.length / Math.max(culture1.values.length, culture2.values.length)) * 0.3;
        }

        return {
            compatibility_analysis: {
                overall_compatibility: compatibility,
                compatible_areas: ['trade', 'technology'],
                conflict_areas: ['governance', 'social_norms'],
                neutral_areas: ['arts', 'cuisine']
            },
            interaction_prediction: {
                most_likely_outcome: compatibility > 0.7 ? 'integration' : compatibility > 0.4 ? 'coexistence' : 'conflict',
                confidence: 0.5,
                timeline: 'medium term',
                key_factors: ['cultural_flexibility', 'leadership_attitudes']
            },
            processing_method: 'fallback_rules'
        };
    }

    getFallbackTrendPrediction(culture, externalFactors, timeHorizon) {
        return {
            trends: {
                technology_adoption: 'increasing',
                social_mobility: 'stable',
                cultural_preservation: 'decreasing',
                international_integration: 'increasing'
            },
            confidence: 0.4,
            processing_method: 'fallback_rules'
        };
    }

    getFallbackArtisticAnalysis(culture, timeContext, influences) {
        return {
            artistic_trends: {
                dominant_themes: ['identity', 'change', 'tradition'],
                new_forms: ['digital_art', 'fusion_styles'],
                declining_forms: ['traditional_crafts'],
                innovation_level: 'moderate'
            },
            processing_method: 'fallback_rules'
        };
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

    // Additional analysis methods
    async analyzeLanguageEvolution(language, speakers, timespan, influences) {
        // Analyze how languages change over time
        if (this.useFallback) {
            return {
                vocabulary_changes: ['new_technical_terms', 'borrowed_words'],
                grammar_changes: ['simplified_structures'],
                pronunciation_changes: ['accent_shifts'],
                processing_method: 'fallback_rules'
            };
        }
        // AI implementation would go here
    }

    async predictSocialMovements(culture, tensions, catalysts) {
        // Predict emergence of social movements
        if (this.useFallback) {
            return {
                movement_probability: 0.3,
                likely_causes: ['economic_inequality', 'cultural_change'],
                potential_outcomes: ['policy_change', 'social_reform'],
                processing_method: 'fallback_rules'
            };
        }
        // AI implementation would go here
    }

    async analyzeReligiousEvolution(religion, population, influences) {
        // Analyze religious and philosophical changes
        if (this.useFallback) {
            return {
                doctrinal_changes: ['modernized_interpretations'],
                practice_changes: ['digital_services', 'simplified_rituals'],
                membership_trends: 'stable',
                processing_method: 'fallback_rules'
            };
        }
        // AI implementation would go here
    }
}

module.exports = { AIModule: CultureAI };

