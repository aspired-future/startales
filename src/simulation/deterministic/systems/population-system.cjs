// Population System - Deterministic population dynamics with AI-adjustable parameters
// Input knobs for AI control, structured outputs for AI and game consumption

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class PopulationSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('population-system', config);
        
        // Core population state
        this.populationState = {
            totalPopulation: config.initialPopulation || 1000000,
            demographics: {
                ageGroups: {
                    children: 0.18,    // 0-17
                    adults: 0.65,      // 18-64
                    elderly: 0.17      // 65+
                },
                education: {
                    basic: 0.3,
                    secondary: 0.45,
                    tertiary: 0.25
                },
                employment: {
                    employed: 0.85,
                    unemployed: 0.08,
                    inactive: 0.07
                }
            },
            
            // Dynamic rates
            birthRate: 0.012,      // Annual births per capita
            deathRate: 0.008,      // Annual deaths per capita
            migrationRate: 0.002,  // Net annual migration per capita
            
            // Quality metrics
            healthIndex: 0.75,     // 0-1 scale
            educationIndex: 0.68,  // 0-1 scale
            satisfactionIndex: 0.72, // 0-1 scale
            
            // Spatial distribution
            urbanRatio: 0.68,      // Urban vs rural
            density: 150,          // People per km²
            
            // Economic factors
            averageIncome: 45000,
            incomeInequality: 0.35, // Gini coefficient
            
            lastUpdate: Date.now()
        };
        
        this.initializeInputKnobs();
        this.initializeOutputChannels();
        
        // Start simulation loop
        this.startSimulation();
    }

    initializeInputKnobs() {
        // Healthcare Investment
        this.defineInputKnob('healthcare_investment', {
            name: 'Healthcare Investment Level',
            description: 'Government investment in healthcare as % of GDP',
            aiDescription: 'Adjust healthcare spending to improve population health and reduce mortality',
            type: 'number',
            defaultValue: 8.5,
            constraints: { min: 2.0, max: 20.0 },
            category: 'healthcare',
            impact: 'high',
            expectedEffects: [
                'Higher values reduce death rate and improve health index',
                'Affects birth rate positively (better maternal care)',
                'Increases government spending'
            ],
            updateFrequency: 'quarterly'
        });

        // Education Investment
        this.defineInputKnob('education_investment', {
            name: 'Education Investment Level',
            description: 'Government investment in education as % of GDP',
            aiDescription: 'Adjust education spending to improve population skills and economic productivity',
            type: 'number',
            defaultValue: 6.2,
            constraints: { min: 1.0, max: 15.0 },
            category: 'education',
            impact: 'high',
            expectedEffects: [
                'Improves education index over time',
                'Increases economic productivity',
                'Affects migration patterns (brain drain/gain)'
            ],
            updateFrequency: 'quarterly'
        });

        // Immigration Policy
        this.defineInputKnob('immigration_openness', {
            name: 'Immigration Policy Openness',
            description: 'How open immigration policies are (0=closed, 1=very open)',
            aiDescription: 'Control immigration flow to manage population growth and skill mix',
            type: 'number',
            defaultValue: 0.5,
            constraints: { min: 0.0, max: 1.0 },
            category: 'policy',
            impact: 'medium',
            expectedEffects: [
                'Higher values increase immigration rate',
                'Affects age distribution (immigrants tend to be younger)',
                'Can improve or worsen employment depending on economic conditions'
            ],
            updateFrequency: 'quarterly'
        });

        // Family Support Policies
        this.defineInputKnob('family_support_level', {
            name: 'Family Support Policy Level',
            description: 'Level of government support for families (childcare, parental leave, etc.)',
            aiDescription: 'Adjust family support to influence birth rates and population growth',
            type: 'number',
            defaultValue: 0.6,
            constraints: { min: 0.0, max: 1.0 },
            category: 'social',
            impact: 'medium',
            expectedEffects: [
                'Higher values increase birth rate',
                'Improves satisfaction index',
                'Affects workforce participation (especially women)'
            ],
            updateFrequency: 'quarterly'
        });

        // Urban Development Policy
        this.defineInputKnob('urban_development_focus', {
            name: 'Urban Development Focus',
            description: 'Focus on urban vs rural development (0=rural focus, 1=urban focus)',
            aiDescription: 'Balance urban and rural development to manage population distribution',
            type: 'number',
            defaultValue: 0.7,
            constraints: { min: 0.0, max: 1.0 },
            category: 'development',
            impact: 'medium',
            expectedEffects: [
                'Affects urbanization rate',
                'Influences internal migration patterns',
                'Impacts economic development patterns'
            ],
            updateFrequency: 'quarterly'
        });

        // Employment Programs
        this.defineInputKnob('employment_program_intensity', {
            name: 'Employment Program Intensity',
            description: 'Intensity of government employment and training programs',
            aiDescription: 'Adjust job training and employment programs to reduce unemployment',
            type: 'number',
            defaultValue: 0.5,
            constraints: { min: 0.0, max: 1.0 },
            category: 'economic',
            impact: 'high',
            expectedEffects: [
                'Reduces unemployment rate',
                'Improves skill levels over time',
                'Increases government spending'
            ],
            updateFrequency: 'quarterly'
        });

        // Retirement Age Policy
        this.defineInputKnob('retirement_age', {
            name: 'Official Retirement Age',
            description: 'Official retirement age for pension eligibility',
            aiDescription: 'Adjust retirement age to manage aging population and workforce size',
            type: 'number',
            defaultValue: 65,
            constraints: { min: 55, max: 75 },
            category: 'policy',
            impact: 'medium',
            expectedEffects: [
                'Higher values increase workforce participation',
                'Affects age distribution in workforce',
                'Impacts pension system sustainability'
            ],
            updateFrequency: 'yearly'
        });

        // Housing Policy
        this.defineInputKnob('affordable_housing_investment', {
            name: 'Affordable Housing Investment',
            description: 'Government investment in affordable housing as % of GDP',
            aiDescription: 'Invest in housing to improve living conditions and population satisfaction',
            type: 'number',
            defaultValue: 2.5,
            constraints: { min: 0.5, max: 8.0 },
            category: 'housing',
            impact: 'medium',
            expectedEffects: [
                'Improves satisfaction index',
                'Affects migration patterns',
                'Influences urbanization rate'
            ],
            updateFrequency: 'quarterly'
        });
    }

    initializeOutputChannels() {
        // Core Population Metrics
        this.defineOutputChannel('population_metrics', {
            name: 'Core Population Metrics',
            description: 'Key population statistics and trends',
            aiInterpretation: 'Monitor population health, growth, and demographic balance',
            dataType: 'metric',
            category: 'demographics',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['totalPopulation', 'growthRate', 'demographics'],
                fields: {
                    totalPopulation: { type: 'number' },
                    growthRate: { type: 'number' },
                    demographics: { type: 'object' }
                }
            },
            significanceThresholds: {
                'growthRate': { change: 0.001 }, // 0.1% change is significant
                'demographics.employment.unemployed': { above: 0.12 }, // 12% unemployment
                'healthIndex': { change: 0.05 } // 5% change in health
            },
            gameDisplayFormat: {
                totalPopulation: 'number_abbreviated',
                growthRate: 'percentage_2dp',
                unemploymentRate: 'percentage_1dp'
            }
        });

        // Economic Impact Metrics
        this.defineOutputChannel('economic_impact', {
            name: 'Population Economic Impact',
            description: 'How population affects economic systems',
            aiInterpretation: 'Use to understand population impact on economy and plan accordingly',
            dataType: 'metric',
            category: 'economic',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['workforceSize', 'productivityIndex', 'consumerDemand'],
                fields: {
                    workforceSize: { type: 'number' },
                    productivityIndex: { type: 'number' },
                    consumerDemand: { type: 'number' }
                }
            },
            significanceThresholds: {
                'productivityIndex': { change: 0.03 },
                'consumerDemand': { change: 0.05 }
            }
        });

        // Social Stability Indicators
        this.defineOutputChannel('social_stability', {
            name: 'Social Stability Indicators',
            description: 'Metrics indicating social cohesion and stability',
            aiInterpretation: 'Monitor for social unrest risk and policy effectiveness',
            dataType: 'metric',
            category: 'social',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['satisfactionIndex', 'inequalityIndex', 'socialCohesion'],
                fields: {
                    satisfactionIndex: { type: 'number' },
                    inequalityIndex: { type: 'number' },
                    socialCohesion: { type: 'number' }
                }
            },
            significanceThresholds: {
                'satisfactionIndex': { below: 0.4 }, // Low satisfaction warning
                'inequalityIndex': { above: 0.6 }, // High inequality warning
                'socialCohesion': { below: 0.5 } // Low cohesion warning
            }
        });

        // Migration Patterns
        this.defineOutputChannel('migration_data', {
            name: 'Migration Patterns',
            description: 'Immigration, emigration, and internal migration data',
            aiInterpretation: 'Track population movement for policy planning',
            dataType: 'metric',
            category: 'migration',
            priority: 'medium',
            updateFrequency: 'daily',
            structure: {
                required: ['netMigration', 'immigrationRate', 'emigrationRate'],
                fields: {
                    netMigration: { type: 'number' },
                    immigrationRate: { type: 'number' },
                    emigrationRate: { type: 'number' }
                }
            }
        });

        // Population Events
        this.defineOutputChannel('population_events', {
            name: 'Significant Population Events',
            description: 'Notable demographic events and milestones',
            aiInterpretation: 'React to significant population changes and trends',
            dataType: 'event',
            category: 'events',
            priority: 'medium',
            updateFrequency: 'realtime',
            structure: {
                required: ['eventType', 'description', 'impact'],
                fields: {
                    eventType: { type: 'string' },
                    description: { type: 'string' },
                    impact: { type: 'string' }
                }
            }
        });

        // Future Projections
        this.defineOutputChannel('population_projections', {
            name: 'Population Projections',
            description: 'Short and medium-term population forecasts',
            aiInterpretation: 'Plan future policies based on demographic projections',
            dataType: 'prediction',
            category: 'forecasting',
            priority: 'medium',
            updateFrequency: 'weekly',
            structure: {
                required: ['shortTerm', 'mediumTerm'],
                fields: {
                    shortTerm: { type: 'object' }, // 1-2 years
                    mediumTerm: { type: 'object' }  // 5-10 years
                }
            }
        });
    }

    // Core Simulation Logic
    startSimulation() {
        // Daily population updates
        setInterval(() => {
            this.updatePopulation();
        }, 1000); // Every second = 1 game day
        
        // Weekly detailed analysis
        setInterval(() => {
            this.performDetailedAnalysis();
        }, 7000); // Every 7 seconds = 1 game week
        
        console.log('Population system simulation started');
    }

    updatePopulation() {
        const inputs = this.getAllInputs();
        const state = this.populationState;
        
        // Calculate daily changes based on input knobs
        const dailyBirthRate = this.calculateBirthRate(inputs) / 365;
        const dailyDeathRate = this.calculateDeathRate(inputs) / 365;
        const dailyMigrationRate = this.calculateMigrationRate(inputs) / 365;
        
        // Apply population changes
        const births = state.totalPopulation * dailyBirthRate;
        const deaths = state.totalPopulation * dailyDeathRate;
        const netMigration = state.totalPopulation * dailyMigrationRate;
        
        const previousPopulation = state.totalPopulation;
        state.totalPopulation += births - deaths + netMigration;
        
        // Update demographics
        this.updateDemographics(inputs, births, deaths, netMigration);
        
        // Update quality indices
        this.updateQualityIndices(inputs);
        
        // Calculate growth rate
        const growthRate = (state.totalPopulation - previousPopulation) / previousPopulation;
        
        // Output core metrics
        this.setOutput('population_metrics', {
            totalPopulation: Math.round(state.totalPopulation),
            growthRate: growthRate,
            birthRate: dailyBirthRate * 365,
            deathRate: dailyDeathRate * 365,
            migrationRate: dailyMigrationRate * 365,
            demographics: state.demographics,
            healthIndex: state.healthIndex,
            educationIndex: state.educationIndex,
            satisfactionIndex: state.satisfactionIndex,
            urbanRatio: state.urbanRatio,
            density: state.density
        });
        
        // Output economic impact
        this.setOutput('economic_impact', {
            workforceSize: Math.round(state.totalPopulation * state.demographics.employment.employed),
            productivityIndex: this.calculateProductivityIndex(inputs),
            consumerDemand: this.calculateConsumerDemand(),
            taxBase: this.calculateTaxBase(),
            dependencyRatio: this.calculateDependencyRatio()
        });
        
        // Output social stability
        this.setOutput('social_stability', {
            satisfactionIndex: state.satisfactionIndex,
            inequalityIndex: state.incomeInequality,
            socialCohesion: this.calculateSocialCohesion(inputs),
            unrestRisk: this.calculateUnrestRisk(),
            politicalStability: this.calculatePoliticalStability()
        });
        
        // Output migration data
        this.setOutput('migration_data', {
            netMigration: Math.round(netMigration),
            immigrationRate: Math.max(0, dailyMigrationRate * 365),
            emigrationRate: Math.max(0, -dailyMigrationRate * 365),
            internalMigration: this.calculateInternalMigration(inputs),
            brainDrain: this.calculateBrainDrain(inputs)
        });
        
        state.lastUpdate = Date.now();
    }

    calculateBirthRate(inputs) {
        let baseBirthRate = 0.012; // 1.2% annually
        
        // Family support increases birth rate
        baseBirthRate *= (1 + inputs.family_support_level * 0.3);
        
        // Healthcare investment affects maternal care
        baseBirthRate *= (1 + (inputs.healthcare_investment - 8.5) * 0.02);
        
        // Economic factors
        const unemploymentEffect = Math.max(0.7, 1 - this.populationState.demographics.employment.unemployed * 2);
        baseBirthRate *= unemploymentEffect;
        
        // Satisfaction effect
        baseBirthRate *= (0.8 + this.populationState.satisfactionIndex * 0.4);
        
        return Math.max(0.005, Math.min(0.025, baseBirthRate));
    }

    calculateDeathRate(inputs) {
        let baseDeathRate = 0.008; // 0.8% annually
        
        // Healthcare investment reduces death rate
        const healthcareEffect = Math.max(0.5, 1 - (inputs.healthcare_investment - 8.5) * 0.05);
        baseDeathRate *= healthcareEffect;
        
        // Health index effect
        baseDeathRate *= (1.5 - this.populationState.healthIndex);
        
        // Age distribution effect (more elderly = higher death rate)
        const elderlyRatio = this.populationState.demographics.ageGroups.elderly;
        baseDeathRate *= (1 + elderlyRatio * 0.5);
        
        return Math.max(0.003, Math.min(0.020, baseDeathRate));
    }

    calculateMigrationRate(inputs) {
        let baseMigrationRate = 0.002; // 0.2% annually
        
        // Immigration policy effect
        baseMigrationRate *= inputs.immigration_openness * 2;
        
        // Economic attractiveness
        const economicFactor = this.populationState.satisfactionIndex * 
                              (1 - this.populationState.demographics.employment.unemployed);
        baseMigrationRate *= economicFactor;
        
        // Education and healthcare quality attract immigrants
        const qualityFactor = (this.populationState.healthIndex + this.populationState.educationIndex) / 2;
        baseMigrationRate *= (0.5 + qualityFactor);
        
        return Math.max(-0.010, Math.min(0.015, baseMigrationRate));
    }

    updateDemographics(inputs, births, deaths, netMigration) {
        const state = this.populationState;
        
        // Age distribution changes
        const ageGroups = state.demographics.ageGroups;
        
        // Births add to children
        const birthsRatio = births / state.totalPopulation;
        ageGroups.children += birthsRatio;
        
        // Deaths affect all age groups proportionally, but more elderly
        const deathsRatio = deaths / state.totalPopulation;
        ageGroups.children -= deathsRatio * 0.1;
        ageGroups.adults -= deathsRatio * 0.3;
        ageGroups.elderly -= deathsRatio * 0.6;
        
        // Aging process (daily)
        const agingRate = 1 / (365 * 18); // 18 years to age from child to adult
        const retirementRate = 1 / (365 * 47); // 47 years to age from adult to elderly
        
        const childrenAging = ageGroups.children * agingRate;
        const adultsAging = ageGroups.adults * retirementRate;
        
        ageGroups.children -= childrenAging;
        ageGroups.adults += childrenAging - adultsAging;
        ageGroups.elderly += adultsAging;
        
        // Normalize to ensure they sum to 1
        const total = ageGroups.children + ageGroups.adults + ageGroups.elderly;
        ageGroups.children /= total;
        ageGroups.adults /= total;
        ageGroups.elderly /= total;
        
        // Employment changes
        const employment = state.demographics.employment;
        const targetUnemployment = Math.max(0.02, 0.12 - inputs.employment_program_intensity * 0.08);
        const unemploymentChange = (targetUnemployment - employment.unemployed) * 0.01; // 1% daily adjustment
        
        employment.unemployed += unemploymentChange;
        employment.employed -= unemploymentChange;
        
        // Normalize employment
        const empTotal = employment.employed + employment.unemployed + employment.inactive;
        employment.employed /= empTotal;
        employment.unemployed /= empTotal;
        employment.inactive /= empTotal;
        
        // Education improvements (slower)
        const education = state.demographics.education;
        const educationImprovement = inputs.education_investment * 0.0001; // Very gradual
        
        education.tertiary += educationImprovement;
        education.secondary += educationImprovement * 0.5;
        education.basic -= educationImprovement * 1.5;
        
        // Normalize education
        const eduTotal = education.basic + education.secondary + education.tertiary;
        education.basic /= eduTotal;
        education.secondary /= eduTotal;
        education.tertiary /= eduTotal;
    }

    updateQualityIndices(inputs) {
        const state = this.populationState;
        
        // Health index improvement from healthcare investment
        const targetHealth = Math.min(0.95, 0.5 + inputs.healthcare_investment * 0.04);
        state.healthIndex += (targetHealth - state.healthIndex) * 0.001; // Gradual improvement
        
        // Education index improvement from education investment
        const targetEducation = Math.min(0.95, 0.4 + inputs.education_investment * 0.06);
        state.educationIndex += (targetEducation - state.educationIndex) * 0.0005; // Very gradual
        
        // Satisfaction index from multiple factors
        let targetSatisfaction = 0.5;
        targetSatisfaction += inputs.family_support_level * 0.1;
        targetSatisfaction += inputs.affordable_housing_investment * 0.05;
        targetSatisfaction += (1 - state.demographics.employment.unemployed) * 0.3;
        targetSatisfaction += state.healthIndex * 0.2;
        targetSatisfaction -= state.incomeInequality * 0.3;
        
        targetSatisfaction = Math.max(0.1, Math.min(0.95, targetSatisfaction));
        state.satisfactionIndex += (targetSatisfaction - state.satisfactionIndex) * 0.002;
        
        // Urban ratio changes based on development focus
        const targetUrbanRatio = 0.5 + inputs.urban_development_focus * 0.3;
        state.urbanRatio += (targetUrbanRatio - state.urbanRatio) * 0.0001; // Very gradual urbanization
    }

    calculateProductivityIndex(inputs) {
        const state = this.populationState;
        
        let productivity = 0.5;
        productivity += state.educationIndex * 0.3;
        productivity += state.healthIndex * 0.2;
        productivity += inputs.employment_program_intensity * 0.1;
        productivity -= state.demographics.employment.unemployed * 0.5;
        
        return Math.max(0.1, Math.min(1.0, productivity));
    }

    calculateConsumerDemand() {
        const state = this.populationState;
        
        let demand = state.totalPopulation * state.averageIncome / 1000000; // Normalized
        demand *= state.satisfactionIndex;
        demand *= (1 - state.demographics.employment.unemployed * 0.5);
        
        return Math.max(0, demand);
    }

    calculateTaxBase() {
        const state = this.populationState;
        return state.totalPopulation * state.demographics.employment.employed * state.averageIncome;
    }

    calculateDependencyRatio() {
        const ageGroups = this.populationState.demographics.ageGroups;
        return (ageGroups.children + ageGroups.elderly) / ageGroups.adults;
    }

    calculateSocialCohesion(inputs) {
        const state = this.populationState;
        
        let cohesion = 0.5;
        cohesion += state.satisfactionIndex * 0.3;
        cohesion -= state.incomeInequality * 0.4;
        cohesion += inputs.family_support_level * 0.1;
        cohesion += state.educationIndex * 0.2;
        
        return Math.max(0.1, Math.min(1.0, cohesion));
    }

    calculateUnrestRisk() {
        const state = this.populationState;
        
        let risk = 0;
        risk += state.demographics.employment.unemployed * 2;
        risk += state.incomeInequality * 1.5;
        risk += (1 - state.satisfactionIndex) * 1.2;
        risk += Math.max(0, state.demographics.ageGroups.adults - 0.6) * 0.5; // Youth bulge effect
        
        return Math.max(0, Math.min(1.0, risk));
    }

    calculatePoliticalStability() {
        const unrestRisk = this.calculateUnrestRisk();
        const socialCohesion = this.calculateSocialCohesion(this.getAllInputs());
        
        return Math.max(0.1, 1 - (unrestRisk * 0.6) + (socialCohesion * 0.4));
    }

    calculateInternalMigration(inputs) {
        // Urban development focus affects internal migration
        return inputs.urban_development_focus * this.populationState.totalPopulation * 0.001;
    }

    calculateBrainDrain(inputs) {
        const state = this.populationState;
        
        // Brain drain based on economic conditions and opportunities
        let brainDrain = 0;
        brainDrain += state.demographics.employment.unemployed * 0.5;
        brainDrain += (1 - state.satisfactionIndex) * 0.3;
        brainDrain -= inputs.education_investment * 0.05; // Better education = more opportunities
        brainDrain -= inputs.healthcare_investment * 0.02;
        
        return Math.max(0, brainDrain * state.demographics.education.tertiary * state.totalPopulation);
    }

    performDetailedAnalysis() {
        // Generate population events
        this.checkForSignificantEvents();
        
        // Update projections
        this.updateProjections();
        
        // Cleanup old data
        this.cleanup();
    }

    checkForSignificantEvents() {
        const state = this.populationState;
        const events = [];
        
        // Population milestones
        if (state.totalPopulation % 100000 < 100) {
            events.push({
                eventType: 'population_milestone',
                description: `Population reached ${Math.round(state.totalPopulation / 100000) * 100000}`,
                impact: 'medium',
                timestamp: Date.now()
            });
        }
        
        // High unemployment
        if (state.demographics.employment.unemployed > 0.15) {
            events.push({
                eventType: 'unemployment_crisis',
                description: `Unemployment rate reached ${(state.demographics.employment.unemployed * 100).toFixed(1)}%`,
                impact: 'high',
                timestamp: Date.now()
            });
        }
        
        // Aging population
        if (state.demographics.ageGroups.elderly > 0.25) {
            events.push({
                eventType: 'aging_population',
                description: 'Population aging accelerating - elderly now 25%+ of population',
                impact: 'high',
                timestamp: Date.now()
            });
        }
        
        // Low birth rate
        if (this.calculateBirthRate(this.getAllInputs()) < 0.008) {
            events.push({
                eventType: 'demographic_decline',
                description: 'Birth rate below replacement level - population decline risk',
                impact: 'high',
                timestamp: Date.now()
            });
        }
        
        if (events.length > 0) {
            this.setOutput('population_events', events);
        }
    }

    updateProjections() {
        const currentState = this.populationState;
        const inputs = this.getAllInputs();
        
        // Simple projection model
        const shortTermProjection = this.projectPopulation(currentState, inputs, 730); // 2 years
        const mediumTermProjection = this.projectPopulation(currentState, inputs, 3650); // 10 years
        
        this.setOutput('population_projections', {
            shortTerm: shortTermProjection,
            mediumTerm: mediumTermProjection,
            assumptions: {
                currentPolicies: 'maintained',
                economicGrowth: 'moderate',
                externalFactors: 'stable'
            },
            confidence: {
                shortTerm: 0.85,
                mediumTerm: 0.65
            }
        });
    }

    projectPopulation(currentState, inputs, days) {
        // Simplified projection - in reality this would be much more complex
        const annualGrowthRate = (this.calculateBirthRate(inputs) - this.calculateDeathRate(inputs) + this.calculateMigrationRate(inputs));
        const years = days / 365;
        
        const projectedPopulation = currentState.totalPopulation * Math.pow(1 + annualGrowthRate, years);
        
        return {
            totalPopulation: Math.round(projectedPopulation),
            growthRate: annualGrowthRate,
            timeHorizon: `${years} years`,
            keyFactors: [
                'Current policy settings',
                'Demographic momentum',
                'Economic conditions'
            ]
        };
    }

    // Public API for external systems
    getPopulationSummary() {
        return {
            total: this.populationState.totalPopulation,
            demographics: this.populationState.demographics,
            indices: {
                health: this.populationState.healthIndex,
                education: this.populationState.educationIndex,
                satisfaction: this.populationState.satisfactionIndex
            },
            lastUpdate: this.populationState.lastUpdate
        };
    }
}

module.exports = { PopulationSystem };

