// Integration Example - Demonstrates bidirectional AI ↔ Deterministic integration
// Shows how AI systems adjust deterministic knobs and consume outputs

const { HybridIntegrationLayer } = require('./hybrid-integration-layer.cjs');
const { PopulationSystem } = require('../deterministic/systems/population-system.cjs');
const { EconomicSystem } = require('../deterministic/systems/economic-system.cjs');
const { PsychologyAI } = require('../ai/psychology-ai.cjs');
const { FinancialAI } = require('../ai/financial-ai.cjs');
const { integrationConfigs } = require('./integration-configs.cjs');

class IntegrationExample {
    constructor() {
        this.integrationLayer = new HybridIntegrationLayer({
            syncInterval: 1000, // 1 second sync
            conflictResolution: 'weighted',
            aiWeight: 0.6,
            deterministicWeight: 0.4
        });
        
        // Initialize systems
        this.populationSystem = new PopulationSystem();
        this.economicSystem = new EconomicSystem();
        this.psychologyAI = new PsychologyAI();
        this.financialAI = new FinancialAI();
        
        this.setupIntegration();
    }

    async setupIntegration() {
        console.log('Setting up integration example...');
        
        // Register AI modules with integration layer
        this.integrationLayer.registerAIModule('psychology-ai', this.psychologyAI, {
            transformation: {
                rules: [
                    {
                        type: 'mapping',
                        direction: 'ai-to-deterministic',
                        mapping: {
                            'emotionalState.happiness': 'satisfaction_boost',
                            'emotionalState.stress': 'stress_factor',
                            'socialCohesion': 'cohesion_modifier'
                        }
                    }
                ]
            }
        });

        this.integrationLayer.registerAIModule('financial-ai', this.financialAI, {
            transformation: {
                rules: [
                    {
                        type: 'mapping',
                        direction: 'ai-to-deterministic',
                        mapping: {
                            'marketSentiment': 'confidence_modifier',
                            'riskAssessment': 'risk_factor',
                            'policyRecommendation': 'policy_adjustment'
                        }
                    }
                ]
            }
        });

        // Register deterministic systems
        this.integrationLayer.registerDeterministicSystem('population-system', this.populationSystem, {
            transformation: {
                rules: [
                    {
                        type: 'mapping',
                        direction: 'deterministic-to-ai',
                        mapping: {
                            'populationMetrics.unemployment': 'economicStress',
                            'populationMetrics.satisfaction': 'wellbeingLevel',
                            'socialStability.unrestRisk': 'socialTension'
                        }
                    }
                ]
            }
        });

        this.integrationLayer.registerDeterministicSystem('economic-system', this.economicSystem, {
            transformation: {
                rules: [
                    {
                        type: 'mapping',
                        direction: 'deterministic-to-ai',
                        mapping: {
                            'economicIndicators.gdpGrowthRate': 'economicPerformance',
                            'economicIndicators.inflation': 'priceStability',
                            'economicIndicators.unemployment': 'laborMarketHealth'
                        }
                    }
                ]
            }
        });

        // Add integration rules
        this.addIntegrationRules();
        
        // Set up AI decision making
        this.setupAIDecisionMaking();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        console.log('Integration setup complete');
    }

    addIntegrationRules() {
        // Psychology AI affects population policies
        this.integrationLayer.addIntegrationRule('psychology-to-population', {
            sourceType: 'ai',
            sourceModule: 'psychology-ai',
            targetType: 'deterministic',
            targetDetSystems: ['population-system'],
            conditions: [
                { field: 'emotionalState.stress', operator: '>', value: 0.7 }
            ],
            effects: [
                {
                    target: 'family_support_level',
                    adjustment: '+0.1',
                    reason: 'Increase family support to reduce stress'
                },
                {
                    target: 'healthcare_investment',
                    adjustment: '+0.5',
                    reason: 'Boost healthcare to improve mental health'
                }
            ]
        });

        // Financial AI affects economic policies
        this.integrationLayer.addIntegrationRule('financial-to-economic', {
            sourceType: 'ai',
            sourceModule: 'financial-ai',
            targetType: 'deterministic',
            targetDetSystems: ['economic-system'],
            conditions: [
                { field: 'marketSentiment', operator: '<', value: -0.5 }
            ],
            effects: [
                {
                    target: 'interest_rate_target',
                    adjustment: '-0.5',
                    reason: 'Lower interest rates to stimulate economy'
                },
                {
                    target: 'government_spending_level',
                    adjustment: '+2.0',
                    reason: 'Increase spending for economic stimulus'
                }
            ]
        });

        // Economic conditions affect psychology
        this.integrationLayer.addIntegrationRule('economic-to-psychology', {
            sourceType: 'deterministic',
            sourceSystem: 'economic-system',
            targetType: 'ai',
            targetAIModules: ['psychology-ai'],
            conditions: [
                { field: 'economicIndicators.unemployment', operator: '>', value: 0.08 }
            ],
            triggers: [
                {
                    aiPrompt: 'High unemployment is causing economic anxiety. Analyze psychological impact and recommend interventions.',
                    priority: 'high',
                    context: 'unemployment_crisis'
                }
            ]
        });

        // Population changes affect financial analysis
        this.integrationLayer.addIntegrationRule('population-to-financial', {
            sourceType: 'deterministic',
            sourceSystem: 'population-system',
            targetType: 'ai',
            targetAIModules: ['financial-ai'],
            conditions: [
                { field: 'socialStability.unrestRisk', operator: '>', value: 0.6 }
            ],
            triggers: [
                {
                    aiPrompt: 'Social unrest risk is high. Assess economic implications and recommend fiscal measures.',
                    priority: 'high',
                    context: 'social_instability'
                }
            ]
        });
    }

    setupAIDecisionMaking() {
        // Psychology AI makes decisions based on population data
        this.psychologyAI.on('analysisComplete', (analysis) => {
            if (analysis.recommendations) {
                for (const recommendation of analysis.recommendations) {
                    this.applyPsychologyRecommendation(recommendation);
                }
            }
        });

        // Financial AI makes decisions based on economic data
        this.financialAI.on('analysisComplete', (analysis) => {
            if (analysis.policyRecommendations) {
                for (const recommendation of analysis.policyRecommendations) {
                    this.applyFinancialRecommendation(recommendation);
                }
            }
        });

        // Set up periodic AI analysis
        setInterval(() => {
            this.triggerAIAnalysis();
        }, 10000); // Every 10 seconds
    }

    setupEventHandlers() {
        // Handle significant population events
        this.populationSystem.on('outputUpdated', (output) => {
            if (output.channelId === 'population_events') {
                this.handlePopulationEvents(output.data);
            }
        });

        // Handle economic events
        this.economicSystem.on('outputUpdated', (output) => {
            if (output.channelId === 'economic_events') {
                this.handleEconomicEvents(output.data);
            }
        });

        // Handle integration conflicts
        this.integrationLayer.on('syncCompleted', (syncData) => {
            if (syncData.conflicts > 0) {
                console.log(`Integration sync: ${syncData.conflicts} conflicts resolved`);
            }
        });
    }

    async triggerAIAnalysis() {
        // Get current system outputs for AI analysis
        const populationData = this.populationSystem.getAIConsumableOutputs();
        const economicData = this.economicSystem.getAIConsumableOutputs();

        // Trigger psychology analysis
        if (populationData.social_stability) {
            const socialData = populationData.social_stability.data;
            if (socialData.satisfactionIndex < 0.5 || socialData.unrestRisk > 0.6) {
                await this.psychologyAI.analyzePopulationWellbeing({
                    satisfactionIndex: socialData.satisfactionIndex,
                    unrestRisk: socialData.unrestRisk,
                    socialCohesion: socialData.socialCohesion
                });
            }
        }

        // Trigger financial analysis
        if (economicData.economic_indicators) {
            const econData = economicData.economic_indicators.data;
            if (econData.gdpGrowthRate < 0 || econData.inflation > 0.05) {
                await this.financialAI.analyzeEconomicConditions({
                    gdpGrowthRate: econData.gdpGrowthRate,
                    inflation: econData.inflation,
                    unemployment: econData.unemployment
                });
            }
        }
    }

    applyPsychologyRecommendation(recommendation) {
        console.log(`Applying psychology recommendation: ${recommendation.action}`);
        
        switch (recommendation.action) {
            case 'increase_family_support':
                this.adjustPopulationKnob('family_support_level', recommendation.adjustment);
                break;
            case 'boost_healthcare':
                this.adjustPopulationKnob('healthcare_investment', recommendation.adjustment);
                break;
            case 'improve_housing':
                this.adjustPopulationKnob('affordable_housing_investment', recommendation.adjustment);
                break;
            case 'enhance_education':
                this.adjustPopulationKnob('education_investment', recommendation.adjustment);
                break;
        }
    }

    applyFinancialRecommendation(recommendation) {
        console.log(`Applying financial recommendation: ${recommendation.action}`);
        
        switch (recommendation.action) {
            case 'lower_interest_rates':
                this.adjustEconomicKnob('interest_rate_target', -recommendation.magnitude);
                break;
            case 'increase_spending':
                this.adjustEconomicKnob('government_spending_level', recommendation.magnitude);
                break;
            case 'adjust_taxes':
                if (recommendation.taxType === 'corporate') {
                    this.adjustEconomicKnob('tax_rate', recommendation.magnitude);
                } else {
                    this.adjustEconomicKnob('income_tax_rate', recommendation.magnitude);
                }
                break;
            case 'stimulus_package':
                this.implementStimulusPackage(recommendation);
                break;
        }
    }

    adjustPopulationKnob(knobId, adjustment) {
        try {
            const currentValue = this.populationSystem.getInput(knobId);
            const newValue = currentValue + adjustment;
            
            this.populationSystem.setInput(knobId, newValue, 'psychology-ai');
            console.log(`Population knob ${knobId}: ${currentValue} → ${newValue}`);
        } catch (error) {
            console.error(`Error adjusting population knob ${knobId}:`, error);
        }
    }

    adjustEconomicKnob(knobId, adjustment) {
        try {
            const currentValue = this.economicSystem.getInput(knobId);
            const newValue = currentValue + adjustment;
            
            this.economicSystem.setInput(knobId, newValue, 'financial-ai');
            console.log(`Economic knob ${knobId}: ${currentValue} → ${newValue}`);
        } catch (error) {
            console.error(`Error adjusting economic knob ${knobId}:`, error);
        }
    }

    implementStimulusPackage(recommendation) {
        console.log('Implementing AI-recommended stimulus package');
        
        // Coordinated policy adjustments
        const adjustments = {
            // Economic knobs
            'government_spending_level': recommendation.spendingIncrease || 3.0,
            'interest_rate_target': -(recommendation.rateReduction || 0.5),
            'infrastructure_investment': recommendation.infrastructureBoost || 1.0,
            
            // Population knobs (indirect effects)
            'employment_program_intensity': recommendation.jobProgramBoost || 0.2
        };

        // Apply economic adjustments
        for (const [knobId, adjustment] of Object.entries(adjustments)) {
            if (['government_spending_level', 'interest_rate_target', 'infrastructure_investment'].includes(knobId)) {
                this.adjustEconomicKnob(knobId, adjustment);
            } else {
                this.adjustPopulationKnob(knobId, adjustment);
            }
        }
    }

    handlePopulationEvents(events) {
        for (const event of events) {
            console.log(`Population event: ${event.eventType} - ${event.description}`);
            
            // Notify AI systems of significant events
            if (event.impact === 'high') {
                this.psychologyAI.receiveEvent({
                    type: 'population_event',
                    data: event,
                    timestamp: Date.now()
                });
                
                // Economic implications
                if (event.eventType === 'unemployment_crisis') {
                    this.financialAI.receiveEvent({
                        type: 'labor_market_crisis',
                        data: event,
                        timestamp: Date.now()
                    });
                }
            }
        }
    }

    handleEconomicEvents(events) {
        for (const event of events) {
            console.log(`Economic event: ${event.eventType} - ${event.description}`);
            
            // Notify AI systems of significant events
            if (event.severity === 'high') {
                this.financialAI.receiveEvent({
                    type: 'economic_event',
                    data: event,
                    timestamp: Date.now()
                });
                
                // Psychological implications
                if (event.eventType === 'recession_warning' || event.eventType === 'market_crash') {
                    this.psychologyAI.receiveEvent({
                        type: 'economic_crisis',
                        data: event,
                        timestamp: Date.now()
                    });
                }
            }
        }
    }

    // Demonstration methods
    async runDemonstration() {
        console.log('\n=== Starting Integration Demonstration ===\n');
        
        // Start all systems
        await this.integrationLayer.start();
        
        // Demonstrate AI-driven policy adjustments
        await this.demonstrateAIPolicyAdjustments();
        
        // Demonstrate crisis response
        await this.demonstrateCrisisResponse();
        
        // Demonstrate feedback loops
        await this.demonstrateFeedbackLoops();
        
        console.log('\n=== Integration Demonstration Complete ===\n');
    }

    async demonstrateAIPolicyAdjustments() {
        console.log('--- Demonstrating AI Policy Adjustments ---');
        
        // Simulate high unemployment scenario
        this.economicSystem.setInput('government_spending_level', 25.0, 'scenario'); // Reduce spending
        
        // Wait for AI to analyze and respond
        await this.sleep(5000);
        
        // Show AI responses
        const economicOutputs = this.economicSystem.getAIConsumableOutputs();
        const populationOutputs = this.populationSystem.getAIConsumableOutputs();
        
        console.log('Economic indicators after AI intervention:');
        console.log(`- GDP Growth: ${(economicOutputs.economic_indicators.data.gdpGrowthRate * 100).toFixed(2)}%`);
        console.log(`- Unemployment: ${(economicOutputs.economic_indicators.data.unemployment * 100).toFixed(1)}%`);
        console.log(`- Government Spending: ${this.economicSystem.getInput('government_spending_level').toFixed(1)}% of GDP`);
        
        console.log('Population indicators:');
        console.log(`- Satisfaction: ${(populationOutputs.social_stability.data.satisfactionIndex * 100).toFixed(1)}%`);
        console.log(`- Unrest Risk: ${(populationOutputs.social_stability.data.unrestRisk * 100).toFixed(1)}%`);
    }

    async demonstrateCrisisResponse() {
        console.log('\n--- Demonstrating Crisis Response ---');
        
        // Simulate financial crisis
        this.economicSystem.setInput('interest_rate_target', 8.0, 'crisis'); // High interest rates
        this.economicSystem.setInput('tax_rate', 40.0, 'crisis'); // High taxes
        
        // Wait for AI crisis response
        await this.sleep(8000);
        
        console.log('Crisis response measures implemented:');
        console.log(`- Interest Rate: ${this.economicSystem.getInput('interest_rate_target').toFixed(2)}%`);
        console.log(`- Corporate Tax: ${this.economicSystem.getInput('tax_rate').toFixed(1)}%`);
        console.log(`- Infrastructure Investment: ${this.economicSystem.getInput('infrastructure_investment').toFixed(1)}% of GDP`);
        console.log(`- Family Support: ${this.populationSystem.getInput('family_support_level').toFixed(2)}`);
    }

    async demonstrateFeedbackLoops() {
        console.log('\n--- Demonstrating Feedback Loops ---');
        
        // Show how changes propagate through the system
        const initialEconData = this.economicSystem.getAIConsumableOutputs();
        const initialPopData = this.populationSystem.getAIConsumableOutputs();
        
        console.log('Initial state:');
        console.log(`- Economic Growth: ${(initialEconData.economic_indicators.data.gdpGrowthRate * 100).toFixed(2)}%`);
        console.log(`- Population Satisfaction: ${(initialPopData.social_stability.data.satisfactionIndex * 100).toFixed(1)}%`);
        
        // Make a significant policy change
        this.economicSystem.setInput('rd_investment_incentives', 4.0, 'demonstration'); // Major R&D boost
        
        // Track changes over time
        for (let i = 0; i < 3; i++) {
            await this.sleep(10000);
            
            const econData = this.economicSystem.getAIConsumableOutputs();
            const popData = this.populationSystem.getAIConsumableOutputs();
            
            console.log(`\nAfter ${(i + 1) * 10} seconds:`);
            console.log(`- Economic Growth: ${(econData.economic_indicators.data.gdpGrowthRate * 100).toFixed(2)}%`);
            console.log(`- Population Satisfaction: ${(popData.social_stability.data.satisfactionIndex * 100).toFixed(1)}%`);
            console.log(`- Technology Sector Growth: ${(econData.sectoral_performance.data.sectors.technology.growth * 100).toFixed(2)}%`);
        }
    }

    // Utility methods
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getSystemStatus() {
        return {
            integration: this.integrationLayer.getIntegrationState(),
            population: this.populationSystem.getSystemState(),
            economic: this.economicSystem.getSystemState(),
            aiModules: {
                psychology: this.psychologyAI.getStatus(),
                financial: this.financialAI.getStatus()
            }
        };
    }

    async shutdown() {
        console.log('Shutting down integration example...');
        await this.integrationLayer.stop();
        console.log('Integration example shutdown complete');
    }
}

// Example usage and testing
async function runIntegrationExample() {
    const example = new IntegrationExample();
    
    try {
        await example.runDemonstration();
        
        // Keep running for observation
        console.log('Integration example running... Press Ctrl+C to stop');
        
        // Periodic status reports
        setInterval(() => {
            const status = example.getSystemStatus();
            console.log('\n--- System Status ---');
            console.log(`Integration sync cycle: ${status.integration.syncCycle}`);
            console.log(`Population total: ${status.population.currentInputs.totalPopulation || 'N/A'}`);
            console.log(`Economic GDP: $${(status.economic.currentInputs.gdp || 0) / 1e12}T`);
            console.log('--- End Status ---\n');
        }, 30000); // Every 30 seconds
        
    } catch (error) {
        console.error('Integration example error:', error);
        await example.shutdown();
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});

module.exports = { IntegrationExample, runIntegrationExample };

