// Integration Configurations - Specific rules for AI ↔ Deterministic system integration
// Defines how different systems interact and affect each other

const integrationConfigs = {
    // Psychology AI ↔ Population Demographics
    psychologyToPopulation: {
        id: 'psychology-population',
        sourceType: 'ai',
        sourceModule: 'psychology-ai',
        targetType: 'deterministic',
        targetSystems: ['population-demographics', 'migration-system'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'ai-to-deterministic',
                    mapping: {
                        'emotionalState.happiness': 'populationMetrics.satisfaction',
                        'emotionalState.stress': 'populationMetrics.unrest',
                        'culturalValues.individualism': 'migrationPatterns.mobility',
                        'socialCohesion': 'populationMetrics.stability'
                    }
                },
                {
                    type: 'scaling',
                    direction: 'ai-to-deterministic',
                    scale: {
                        'populationMetrics.satisfaction': { min: 0, max: 100, aiMin: -1, aiMax: 1 },
                        'populationMetrics.unrest': { min: 0, max: 100, aiMin: -1, aiMax: 1 },
                        'migrationPatterns.mobility': { min: 0.1, max: 2.0, aiMin: 0, aiMax: 1 }
                    }
                }
            ]
        },
        
        effects: [
            {
                trigger: 'emotionalState.happiness > 0.7',
                effect: 'populationMetrics.birthRate += 0.1',
                delay: 30 // 30 game days
            },
            {
                trigger: 'emotionalState.stress > 0.8',
                effect: 'migrationPatterns.emigrationRate += 0.2',
                delay: 7 // 7 game days
            }
        ]
    },

    // Population Demographics → Psychology AI
    populationToPsychology: {
        id: 'population-psychology',
        sourceType: 'deterministic',
        sourceSystem: 'population-demographics',
        targetType: 'ai',
        targetModules: ['psychology-ai', 'culture-ai'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'deterministic-to-ai',
                    mapping: {
                        'populationMetrics.unemployment': 'economicStress',
                        'populationMetrics.density': 'socialPressure',
                        'populationMetrics.diversity': 'culturalComplexity',
                        'populationMetrics.ageDistribution': 'generationalTension'
                    }
                },
                {
                    type: 'aggregation',
                    direction: 'deterministic-to-ai',
                    aggregation: {
                        'overallWellbeing': {
                            formula: '(satisfaction * 0.4) + (stability * 0.3) + ((100 - unrest) * 0.3)',
                            inputs: ['satisfaction', 'stability', 'unrest']
                        }
                    }
                }
            ]
        },
        
        triggers: [
            {
                condition: 'populationMetrics.unemployment > 15',
                aiPrompt: 'High unemployment is causing social unrest. Analyze psychological impact and recommend interventions.',
                priority: 'high'
            },
            {
                condition: 'populationMetrics.diversity > 0.8',
                aiPrompt: 'High cultural diversity detected. Assess integration challenges and opportunities.',
                priority: 'medium'
            }
        ]
    },

    // Financial AI ↔ Economic Systems
    financialToEconomic: {
        id: 'financial-economic',
        sourceType: 'ai',
        sourceModule: 'financial-ai',
        targetType: 'deterministic',
        targetSystems: ['trade-system', 'business-system', 'treasury-system'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'ai-to-deterministic',
                    mapping: {
                        'marketSentiment': 'tradeMetrics.confidence',
                        'riskAssessment': 'businessMetrics.investmentCaution',
                        'inflationPrediction': 'economicMetrics.expectedInflation',
                        'growthForecast': 'economicMetrics.projectedGrowth'
                    }
                },
                {
                    type: 'custom',
                    direction: 'ai-to-deterministic',
                    transform: async (data) => {
                        // Complex financial modeling
                        const adjustedData = { ...data };
                        
                        // Apply market volatility
                        if (data.marketSentiment < -0.5) {
                            adjustedData.tradeVolume = data.tradeVolume * 0.7;
                            adjustedData.businessInvestment = data.businessInvestment * 0.6;
                        }
                        
                        // Apply confidence multipliers
                        adjustedData.economicGrowth = data.economicGrowth * (1 + data.marketSentiment * 0.2);
                        
                        return adjustedData;
                    }
                }
            ]
        },
        
        policies: [
            {
                trigger: 'marketSentiment < -0.7',
                recommendation: 'emergency-stimulus',
                parameters: {
                    amount: 'calculateBasedOnGDP',
                    duration: 90, // days
                    targetSectors: ['small-business', 'infrastructure']
                }
            },
            {
                trigger: 'inflationPrediction > 0.05',
                recommendation: 'monetary-tightening',
                parameters: {
                    interestRateIncrease: 0.25,
                    reserveRequirementIncrease: 0.02
                }
            }
        ]
    },

    // Economic Systems → Financial AI
    economicToFinancial: {
        id: 'economic-financial',
        sourceType: 'deterministic',
        sourceSystem: 'economic-systems',
        targetType: 'ai',
        targetModules: ['financial-ai'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'deterministic-to-ai',
                    mapping: {
                        'economicMetrics.gdpGrowth': 'economicPerformance',
                        'economicMetrics.inflation': 'priceStability',
                        'economicMetrics.unemployment': 'laborMarketHealth',
                        'tradeMetrics.balance': 'internationalCompetitiveness'
                    }
                },
                {
                    type: 'aggregation',
                    direction: 'deterministic-to-ai',
                    aggregation: {
                        'economicHealth': {
                            formula: '(gdpGrowth * 0.3) + ((100 - unemployment) * 0.3) + ((100 - inflation * 10) * 0.2) + (tradeBalance * 0.2)',
                            inputs: ['gdpGrowth', 'unemployment', 'inflation', 'tradeBalance']
                        }
                    }
                }
            ]
        },
        
        alerts: [
            {
                condition: 'economicMetrics.gdpGrowth < -2',
                aiAnalysis: 'recession-analysis',
                urgency: 'critical'
            },
            {
                condition: 'economicMetrics.inflation > 8',
                aiAnalysis: 'inflation-crisis-analysis',
                urgency: 'high'
            }
        ]
    },

    // Culture AI ↔ Social Systems
    cultureToSocial: {
        id: 'culture-social',
        sourceType: 'ai',
        sourceModule: 'culture-ai',
        targetType: 'deterministic',
        targetSystems: ['social-system', 'education-system', 'media-system'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'ai-to-deterministic',
                    mapping: {
                        'culturalTrends.progressivism': 'socialMetrics.changeAcceptance',
                        'culturalTrends.traditionalism': 'socialMetrics.stabilityPreference',
                        'culturalValues.collectivism': 'socialMetrics.communityEngagement',
                        'culturalShifts.generational': 'socialMetrics.generationGap'
                    }
                }
            ]
        },
        
        culturalEvents: [
            {
                trigger: 'culturalShifts.progressivism > 0.8',
                event: 'progressive-movement',
                effects: {
                    'socialMetrics.reformSupport': '+20%',
                    'socialMetrics.traditionalismResistance': '+15%'
                }
            },
            {
                trigger: 'culturalValues.collectivism > 0.7',
                event: 'community-renaissance',
                effects: {
                    'socialMetrics.volunteerism': '+30%',
                    'socialMetrics.individualismDecline': '+10%'
                }
            }
        ]
    },

    // Military AI ↔ Defense Systems
    militaryToDefense: {
        id: 'military-defense',
        sourceType: 'ai',
        sourceModule: 'military-ai',
        targetType: 'deterministic',
        targetSystems: ['defense-system', 'intelligence-system'],
        
        transformation: {
            rules: [
                {
                    type: 'mapping',
                    direction: 'ai-to-deterministic',
                    mapping: {
                        'threatAssessment': 'defenseMetrics.alertLevel',
                        'strategicRecommendations': 'defenseMetrics.deploymentStrategy',
                        'resourceNeeds': 'defenseMetrics.budgetRequirements',
                        'allianceStrength': 'defenseMetrics.diplomaticSupport'
                    }
                }
            ]
        },
        
        strategies: [
            {
                trigger: 'threatAssessment.level > 0.8',
                strategy: 'defense-escalation',
                actions: [
                    'increase-border-patrols',
                    'activate-reserves',
                    'enhance-intelligence-gathering'
                ]
            },
            {
                trigger: 'allianceStrength < 0.3',
                strategy: 'diplomatic-outreach',
                actions: [
                    'initiate-alliance-talks',
                    'offer-mutual-defense-pacts',
                    'increase-foreign-aid'
                ]
            }
        ]
    },

    // Cross-System Integration Rules
    crossSystemRules: {
        // Economic stress affects psychology
        economicPsychologyLink: {
            trigger: 'economicMetrics.unemployment > 12',
            effect: 'psychology-ai.economicStress += 0.3',
            propagationDelay: 14 // days
        },
        
        // Cultural changes affect policy acceptance
        culturePolicyLink: {
            trigger: 'culturalShifts.progressivism > 0.6',
            effect: 'policy-system.reformAcceptance += 0.2',
            propagationDelay: 30 // days
        },
        
        // Military tensions affect economic confidence
        militaryEconomicLink: {
            trigger: 'defenseMetrics.alertLevel > 0.7',
            effect: 'financial-ai.marketSentiment -= 0.2',
            propagationDelay: 1 // immediate
        },
        
        // Population changes affect resource needs
        populationResourceLink: {
            trigger: 'populationMetrics.growth > 0.03',
            effect: 'resource-system.demand *= 1.1',
            propagationDelay: 90 // quarterly
        }
    },

    // Feedback Loops
    feedbackLoops: {
        economicWellbeingLoop: {
            description: 'Economic performance affects psychology, which affects productivity, which affects economy',
            chain: [
                'economic-system → psychology-ai',
                'psychology-ai → population-system',
                'population-system → economic-system'
            ],
            dampening: 0.8, // Prevent runaway feedback
            cycleTime: 120 // days for full cycle
        },
        
        culturalPolicyLoop: {
            description: 'Cultural changes drive policy changes, which shape culture',
            chain: [
                'culture-ai → policy-system',
                'policy-system → social-system',
                'social-system → culture-ai'
            ],
            dampening: 0.9,
            cycleTime: 180 // days
        },
        
        securityEconomyLoop: {
            description: 'Security threats affect economy, economic strength affects security capability',
            chain: [
                'military-ai → economic-system',
                'economic-system → defense-system',
                'defense-system → military-ai'
            ],
            dampening: 0.7,
            cycleTime: 60 // days
        }
    },

    // Integration Performance Optimization
    optimizationRules: {
        batchingRules: [
            {
                systems: ['psychology-ai', 'culture-ai'],
                batchSize: 50,
                maxLatency: 2000 // ms
            },
            {
                systems: ['financial-ai', 'economic-system'],
                batchSize: 20,
                maxLatency: 500 // ms - financial data needs faster processing
            }
        ],
        
        priorityRules: [
            {
                condition: 'crisis-level-event',
                priority: 'critical',
                maxProcessingTime: 100 // ms
            },
            {
                condition: 'economic-alert',
                priority: 'high',
                maxProcessingTime: 500 // ms
            },
            {
                condition: 'routine-update',
                priority: 'medium',
                maxProcessingTime: 2000 // ms
            }
        ],
        
        cachingRules: [
            {
                dataType: 'population-metrics',
                ttl: 3600000, // 1 hour
                invalidateOn: ['population-change', 'migration-event']
            },
            {
                dataType: 'economic-indicators',
                ttl: 1800000, // 30 minutes
                invalidateOn: ['trade-update', 'policy-change']
            }
        ]
    }
};

// Helper functions for integration configs
const integrationHelpers = {
    // Scale AI values to deterministic ranges
    scaleValue(aiValue, aiMin, aiMax, detMin, detMax) {
        const normalized = (aiValue - aiMin) / (aiMax - aiMin);
        return detMin + (normalized * (detMax - detMin));
    },
    
    // Calculate weighted average for conflict resolution
    weightedAverage(values, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const weightedSum = values.reduce((sum, value, index) => sum + (value * weights[index]), 0);
        return weightedSum / totalWeight;
    },
    
    // Evaluate complex conditions
    evaluateCondition(condition, data) {
        try {
            // Simple expression evaluator for conditions like "unemployment > 15"
            const operators = {
                '>': (a, b) => a > b,
                '<': (a, b) => a < b,
                '>=': (a, b) => a >= b,
                '<=': (a, b) => a <= b,
                '==': (a, b) => a == b,
                '!=': (a, b) => a != b
            };
            
            for (const [op, fn] of Object.entries(operators)) {
                if (condition.includes(op)) {
                    const [left, right] = condition.split(op).map(s => s.trim());
                    const leftValue = this.getNestedValue(data, left);
                    const rightValue = isNaN(right) ? right : parseFloat(right);
                    return fn(leftValue, rightValue);
                }
            }
            
            return false;
        } catch (error) {
            console.error('Condition evaluation error:', error);
            return false;
        }
    },
    
    // Get nested object values using dot notation
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    // Set nested object values using dot notation
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    },
    
    // Apply mathematical formulas
    applyFormula(formula, inputs, data) {
        try {
            // Replace input variables with actual values
            let expression = formula;
            for (const input of inputs) {
                const value = this.getNestedValue(data, input) || 0;
                expression = expression.replace(new RegExp(input, 'g'), value);
            }
            
            // Evaluate the mathematical expression (simplified)
            // In production, use a proper expression evaluator
            return Function(`"use strict"; return (${expression})`)();
        } catch (error) {
            console.error('Formula evaluation error:', error);
            return 0;
        }
    }
};

module.exports = { integrationConfigs, integrationHelpers };

