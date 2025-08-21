// Environmental AI - Ecological management, sustainability decisions, and climate adaptation
// Provides intelligent environmental strategy and ecological optimization

const EventEmitter = require('events');

class EnvironmentalAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'environmental-ai';
        this.civilizationId = config.civilizationId;
        
        // Environmental analysis state
        this.environmentalState = {
            // Ecological Health
            ecosystemHealth: 0.7,
            biodiversityIndex: 0.6,
            climateStability: 0.65,
            
            // Resource Management
            resourceSustainability: new Map(),
            renewableEnergyRatio: 0.3,
            wasteManagementEfficiency: 0.6,
            
            // Environmental Policies
            activePolicies: new Map(),
            conservationPriorities: ['forest_preservation', 'ocean_protection', 'air_quality'],
            sustainabilityGoals: new Map(),
            
            // Climate Adaptation
            climateRisks: [],
            adaptationStrategies: [],
            resilienceLevel: 0.6,
            
            // Pollution Management
            pollutionLevels: {
                air: 0.3,
                water: 0.25,
                soil: 0.2,
                noise: 0.15
            },
            
            // Green Technology
            greenTechAdoption: 0.4,
            carbonFootprint: 0.6, // Lower is better
            circularEconomyIndex: 0.35,
            
            // Environmental Monitoring
            monitoringCapacity: 0.7,
            earlyWarningSystem: 0.6,
            
            lastUpdate: Date.now()
        };
        
        // Decision-making context
        this.context = {
            economicConstraints: {},
            populationNeeds: {},
            industrialActivity: {},
            urbanDevelopment: {},
            globalClimate: {},
            resourceAvailability: {}
        };
        
        // AI processing parameters
        this.processingConfig = {
            environmentalPhilosophy: config.environmentalPhilosophy || 'balanced', // conservation_focused, development_focused, balanced
            riskTolerance: config.riskTolerance || 0.3,
            sustainabilityAggression: config.sustainabilityAggression || 'moderate', // conservative, moderate, aggressive
            globalCooperationLevel: config.globalCooperationLevel || 0.6
        };
        
        // Environmental domains and their relationships
        this.environmentalDomains = {
            'climate_regulation': {
                indicators: ['temperature_stability', 'precipitation_patterns', 'extreme_weather_frequency'],
                impact: 0.9,
                urgency: 0.8
            },
            'biodiversity_conservation': {
                indicators: ['species_diversity', 'habitat_preservation', 'ecosystem_connectivity'],
                impact: 0.8,
                urgency: 0.7
            },
            'resource_management': {
                indicators: ['resource_depletion_rate', 'recycling_efficiency', 'sustainable_extraction'],
                impact: 0.85,
                urgency: 0.75
            },
            'pollution_control': {
                indicators: ['air_quality', 'water_purity', 'soil_health', 'waste_reduction'],
                impact: 0.8,
                urgency: 0.9
            },
            'renewable_energy': {
                indicators: ['clean_energy_ratio', 'energy_efficiency', 'grid_sustainability'],
                impact: 0.75,
                urgency: 0.6
            },
            'urban_ecology': {
                indicators: ['green_spaces', 'sustainable_transport', 'eco_buildings'],
                impact: 0.7,
                urgency: 0.5
            }
        };
        
        console.log(`🌍 Environmental AI initialized for ${this.civilizationId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update context from game analysis
            this.updateContext(gameAnalysis);
            
            // Assess environmental health
            const healthAssessment = await this.assessEnvironmentalHealth(gameAnalysis);
            
            // Analyze sustainability challenges
            const sustainabilityAnalysis = await this.analyzeSustainabilityChallenges(gameAnalysis);
            
            // Generate environmental strategy
            const environmentalStrategy = await this.generateEnvironmentalStrategy(healthAssessment, sustainabilityAnalysis);
            
            // Update environmental state
            this.updateEnvironmentalState(healthAssessment, sustainabilityAnalysis, environmentalStrategy);
            
            // Generate outputs for deterministic systems
            const decisions = this.generateEnvironmentalDecisions(environmentalStrategy);
            
            const processingTime = Date.now() - startTime;
            console.log(`🌍 Environmental AI processed in ${processingTime}ms for ${this.civilizationId}`);
            
            this.emit('processingComplete', {
                civilizationId: this.civilizationId,
                decisions,
                ecosystemHealth: this.environmentalState.ecosystemHealth,
                processingTime
            });
            
            return decisions;
            
        } catch (error) {
            console.error(`🌍 Environmental AI processing error for ${this.civilizationId}:`, error);
            this.emit('processingError', { civilizationId: this.civilizationId, error });
            return this.generateFallbackDecisions();
        }
    }

    updateContext(gameAnalysis) {
        if (gameAnalysis.systemData) {
            // Economic constraints
            if (gameAnalysis.systemData['economic-system']) {
                this.context.economicConstraints = gameAnalysis.systemData['economic-system'];
            }
            
            // Population needs
            if (gameAnalysis.systemData['population-system']) {
                this.context.populationNeeds = gameAnalysis.systemData['population-system'];
            }
            
            // Industrial activity
            if (gameAnalysis.systemData['enhanced-trade-system']) {
                this.context.industrialActivity = gameAnalysis.systemData['enhanced-trade-system'];
            }
            
            // Urban development
            if (gameAnalysis.systemData['urban-system']) {
                this.context.urbanDevelopment = gameAnalysis.systemData['urban-system'];
            }
        }
        
        // Global climate from inter-civilization data
        if (gameAnalysis.globalEnvironment) {
            this.context.globalClimate = gameAnalysis.globalEnvironment;
        }
    }

    async assessEnvironmentalHealth(gameAnalysis) {
        const assessment = {
            overallHealth: 0,
            domainScores: new Map(),
            criticalIssues: [],
            improvementOpportunities: [],
            riskFactors: []
        };
        
        // Assess each environmental domain
        for (const [domain, config] of Object.entries(this.environmentalDomains)) {
            const domainScore = this.assessDomainHealth(domain, config);
            assessment.domainScores.set(domain, domainScore);
            
            if (domainScore.score < 0.4) {
                assessment.criticalIssues.push({
                    domain,
                    score: domainScore.score,
                    issues: domainScore.issues,
                    urgency: config.urgency
                });
            } else if (domainScore.score > 0.8) {
                assessment.improvementOpportunities.push({
                    domain,
                    score: domainScore.score,
                    opportunities: domainScore.opportunities
                });
            }
        }
        
        // Calculate overall health
        let totalScore = 0;
        let totalWeight = 0;
        
        for (const [domain, score] of assessment.domainScores) {
            const weight = this.environmentalDomains[domain].impact;
            totalScore += score.score * weight;
            totalWeight += weight;
        }
        
        assessment.overallHealth = totalWeight > 0 ? totalScore / totalWeight : 0.5;
        
        // Identify risk factors
        assessment.riskFactors = this.identifyEnvironmentalRisks(assessment);
        
        return assessment;
    }

    assessDomainHealth(domain, config) {
        const score = {
            score: 0.6, // Base score
            issues: [],
            opportunities: [],
            trends: []
        };
        
        switch (domain) {
            case 'climate_regulation':
                score.score = this.environmentalState.climateStability;
                if (score.score < 0.5) {
                    score.issues.push('climate_instability', 'extreme_weather_increase');
                }
                break;
                
            case 'biodiversity_conservation':
                score.score = this.environmentalState.biodiversityIndex;
                if (score.score < 0.5) {
                    score.issues.push('habitat_loss', 'species_decline');
                }
                break;
                
            case 'resource_management':
                const sustainability = this.calculateResourceSustainability();
                score.score = sustainability;
                if (sustainability < 0.5) {
                    score.issues.push('resource_depletion', 'unsustainable_extraction');
                }
                break;
                
            case 'pollution_control':
                const pollutionScore = this.calculatePollutionScore();
                score.score = 1 - pollutionScore; // Invert pollution to health score
                if (pollutionScore > 0.5) {
                    score.issues.push('air_pollution', 'water_contamination');
                }
                break;
                
            case 'renewable_energy':
                score.score = this.environmentalState.renewableEnergyRatio;
                if (score.score < 0.4) {
                    score.issues.push('fossil_fuel_dependence', 'energy_inefficiency');
                }
                break;
                
            case 'urban_ecology':
                score.score = this.assessUrbanEcology();
                if (score.score < 0.5) {
                    score.issues.push('urban_sprawl', 'insufficient_green_spaces');
                }
                break;
        }
        
        return score;
    }

    calculateResourceSustainability() {
        let totalSustainability = 0;
        let resourceCount = 0;
        
        for (const [resource, sustainability] of this.environmentalState.resourceSustainability) {
            totalSustainability += sustainability;
            resourceCount++;
        }
        
        return resourceCount > 0 ? totalSustainability / resourceCount : 0.6;
    }

    calculatePollutionScore() {
        const pollution = this.environmentalState.pollutionLevels;
        return (pollution.air + pollution.water + pollution.soil + pollution.noise) / 4;
    }

    assessUrbanEcology() {
        // Simplified urban ecology assessment
        const greenTech = this.environmentalState.greenTechAdoption;
        const wasteManagement = this.environmentalState.wasteManagementEfficiency;
        
        return (greenTech + wasteManagement) / 2;
    }

    identifyEnvironmentalRisks(assessment) {
        const risks = [];
        
        // Climate risks
        if (this.environmentalState.climateStability < 0.5) {
            risks.push({
                type: 'climate_crisis',
                severity: 0.5 - this.environmentalState.climateStability,
                timeframe: 'immediate',
                impact: 'civilization_wide'
            });
        }
        
        // Resource depletion risks
        const resourceSustainability = this.calculateResourceSustainability();
        if (resourceSustainability < 0.4) {
            risks.push({
                type: 'resource_depletion',
                severity: 0.4 - resourceSustainability,
                timeframe: 'short_term',
                impact: 'economic_collapse'
            });
        }
        
        // Pollution health risks
        const pollutionScore = this.calculatePollutionScore();
        if (pollutionScore > 0.6) {
            risks.push({
                type: 'pollution_crisis',
                severity: pollutionScore - 0.6,
                timeframe: 'immediate',
                impact: 'public_health'
            });
        }
        
        // Biodiversity collapse risk
        if (this.environmentalState.biodiversityIndex < 0.3) {
            risks.push({
                type: 'biodiversity_collapse',
                severity: 0.3 - this.environmentalState.biodiversityIndex,
                timeframe: 'medium_term',
                impact: 'ecosystem_failure'
            });
        }
        
        return risks;
    }

    async analyzeSustainabilityChallenges(gameAnalysis) {
        const analysis = {
            urgentChallenges: [],
            strategicChallenges: [],
            opportunityAreas: [],
            resourceConstraints: [],
            technologyGaps: []
        };
        
        // Identify urgent challenges
        analysis.urgentChallenges = this.identifyUrgentChallenges();
        
        // Identify strategic long-term challenges
        analysis.strategicChallenges = this.identifyStrategicChallenges();
        
        // Find opportunity areas
        analysis.opportunityAreas = this.identifyOpportunityAreas();
        
        // Assess resource constraints
        analysis.resourceConstraints = this.assessResourceConstraints();
        
        // Identify technology gaps
        analysis.technologyGaps = this.identifyTechnologyGaps();
        
        return analysis;
    }

    identifyUrgentChallenges() {
        const challenges = [];
        
        // Pollution crisis
        const pollutionScore = this.calculatePollutionScore();
        if (pollutionScore > 0.7) {
            challenges.push({
                type: 'pollution_emergency',
                severity: pollutionScore,
                actions: ['immediate_emission_reduction', 'pollution_cleanup', 'health_protection'],
                timeline: 'immediate'
            });
        }
        
        // Climate emergency
        if (this.environmentalState.climateStability < 0.4) {
            challenges.push({
                type: 'climate_emergency',
                severity: 0.4 - this.environmentalState.climateStability,
                actions: ['carbon_reduction', 'adaptation_measures', 'international_cooperation'],
                timeline: 'immediate'
            });
        }
        
        // Resource crisis
        const resourceSustainability = this.calculateResourceSustainability();
        if (resourceSustainability < 0.3) {
            challenges.push({
                type: 'resource_crisis',
                severity: 0.3 - resourceSustainability,
                actions: ['conservation_measures', 'alternative_resources', 'efficiency_improvements'],
                timeline: 'short_term'
            });
        }
        
        return challenges;
    }

    identifyStrategicChallenges() {
        const challenges = [];
        
        // Energy transition
        if (this.environmentalState.renewableEnergyRatio < 0.6) {
            challenges.push({
                type: 'energy_transition',
                priority: 0.8,
                actions: ['renewable_expansion', 'grid_modernization', 'energy_storage'],
                timeline: 'medium_term',
                expectedImpact: 0.7
            });
        }
        
        // Circular economy development
        if (this.environmentalState.circularEconomyIndex < 0.5) {
            challenges.push({
                type: 'circular_economy',
                priority: 0.7,
                actions: ['waste_reduction', 'recycling_expansion', 'product_lifecycle_extension'],
                timeline: 'long_term',
                expectedImpact: 0.6
            });
        }
        
        // Ecosystem restoration
        if (this.environmentalState.biodiversityIndex < 0.6) {
            challenges.push({
                type: 'ecosystem_restoration',
                priority: 0.75,
                actions: ['habitat_restoration', 'species_protection', 'corridor_creation'],
                timeline: 'long_term',
                expectedImpact: 0.8
            });
        }
        
        return challenges;
    }

    identifyOpportunityAreas() {
        const opportunities = [];
        
        // Green technology leadership
        if (this.environmentalState.greenTechAdoption > 0.6) {
            opportunities.push({
                type: 'green_tech_leadership',
                potential: 0.8,
                benefits: ['economic_growth', 'export_opportunities', 'innovation_hub'],
                requirements: ['research_investment', 'policy_support']
            });
        }
        
        // Carbon market participation
        if (this.environmentalState.carbonFootprint < 0.4) {
            opportunities.push({
                type: 'carbon_market_benefits',
                potential: 0.6,
                benefits: ['carbon_credits', 'international_recognition', 'funding_access'],
                requirements: ['monitoring_systems', 'verification_protocols']
            });
        }
        
        // Eco-tourism development
        if (this.environmentalState.biodiversityIndex > 0.7) {
            opportunities.push({
                type: 'eco_tourism',
                potential: 0.5,
                benefits: ['economic_diversification', 'conservation_funding', 'cultural_exchange'],
                requirements: ['infrastructure_development', 'conservation_balance']
            });
        }
        
        return opportunities;
    }

    assessResourceConstraints() {
        const constraints = [];
        
        // Economic constraints
        const economic = this.context.economicConstraints;
        if (economic.fiscal_status?.budget_surplus < 0.02) {
            constraints.push({
                type: 'funding_limitation',
                severity: 0.7,
                impact: 'limits_environmental_investment',
                mitigation: ['green_bonds', 'international_funding', 'private_partnerships']
            });
        }
        
        // Technology constraints
        if (this.environmentalState.greenTechAdoption < 0.4) {
            constraints.push({
                type: 'technology_gap',
                severity: 0.6,
                impact: 'limits_sustainable_solutions',
                mitigation: ['technology_transfer', 'research_partnerships', 'innovation_incentives']
            });
        }
        
        // Capacity constraints
        if (this.environmentalState.monitoringCapacity < 0.5) {
            constraints.push({
                type: 'monitoring_capacity',
                severity: 0.5,
                impact: 'limits_environmental_oversight',
                mitigation: ['capacity_building', 'technology_deployment', 'training_programs']
            });
        }
        
        return constraints;
    }

    identifyTechnologyGaps() {
        const gaps = [];
        
        // Clean energy technology
        if (this.environmentalState.renewableEnergyRatio < 0.5) {
            gaps.push({
                technology: 'clean_energy_systems',
                priority: 0.9,
                applications: ['solar_power', 'wind_energy', 'energy_storage'],
                development_time: 'medium_term'
            });
        }
        
        // Pollution control technology
        const pollutionScore = this.calculatePollutionScore();
        if (pollutionScore > 0.4) {
            gaps.push({
                technology: 'pollution_control',
                priority: 0.85,
                applications: ['air_filtration', 'water_treatment', 'waste_processing'],
                development_time: 'short_term'
            });
        }
        
        // Environmental monitoring
        if (this.environmentalState.monitoringCapacity < 0.6) {
            gaps.push({
                technology: 'environmental_monitoring',
                priority: 0.7,
                applications: ['sensor_networks', 'satellite_monitoring', 'data_analytics'],
                development_time: 'short_term'
            });
        }
        
        return gaps;
    }

    async generateEnvironmentalStrategy(healthAssessment, sustainabilityAnalysis) {
        const strategy = {
            priorityActions: this.determinePriorityActions(healthAssessment, sustainabilityAnalysis),
            resourceAllocation: this.optimizeResourceAllocation(sustainabilityAnalysis),
            policyRecommendations: this.generatePolicyRecommendations(healthAssessment),
            technologyInvestments: this.recommendTechnologyInvestments(sustainabilityAnalysis),
            cooperationStrategy: this.developCooperationStrategy(sustainabilityAnalysis),
            performanceTargets: this.setEnvironmentalTargets(healthAssessment)
        };
        
        return strategy;
    }

    determinePriorityActions(healthAssessment, sustainabilityAnalysis) {
        const actions = [];
        
        // Address critical issues first
        healthAssessment.criticalIssues.forEach(issue => {
            actions.push({
                action: `address_${issue.domain}`,
                priority: issue.urgency,
                timeline: 'immediate',
                expectedImpact: this.environmentalDomains[issue.domain].impact,
                resources: this.estimateResourceRequirement(issue)
            });
        });
        
        // Address urgent challenges
        sustainabilityAnalysis.urgentChallenges.forEach(challenge => {
            challenge.actions.forEach(action => {
                if (!actions.some(a => a.action === action)) {
                    actions.push({
                        action,
                        priority: challenge.severity,
                        timeline: challenge.timeline,
                        expectedImpact: 0.8,
                        resources: this.estimateResourceRequirement(challenge)
                    });
                }
            });
        });
        
        // Sort by priority and return top actions
        return actions.sort((a, b) => b.priority - a.priority).slice(0, 8);
    }

    optimizeResourceAllocation(sustainabilityAnalysis) {
        const allocation = {
            pollution_control: 0.3,
            renewable_energy: 0.25,
            conservation: 0.2,
            monitoring: 0.15,
            research: 0.1
        };
        
        // Adjust based on urgent challenges
        sustainabilityAnalysis.urgentChallenges.forEach(challenge => {
            switch (challenge.type) {
                case 'pollution_emergency':
                    allocation.pollution_control += 0.1;
                    allocation.research -= 0.05;
                    allocation.conservation -= 0.05;
                    break;
                case 'climate_emergency':
                    allocation.renewable_energy += 0.1;
                    allocation.research += 0.05;
                    allocation.monitoring -= 0.15;
                    break;
                case 'resource_crisis':
                    allocation.conservation += 0.15;
                    allocation.pollution_control -= 0.1;
                    allocation.monitoring -= 0.05;
                    break;
            }
        });
        
        // Normalize allocation
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        Object.keys(allocation).forEach(key => {
            allocation[key] = Math.max(0.05, allocation[key] / total);
        });
        
        return allocation;
    }

    generatePolicyRecommendations(healthAssessment) {
        const recommendations = [];
        
        // Pollution control policies
        const pollutionScore = this.calculatePollutionScore();
        if (pollutionScore > 0.5) {
            recommendations.push({
                policy: 'emission_standards',
                type: 'regulatory',
                urgency: 'high',
                expectedImpact: 0.7,
                implementation_cost: 0.05
            });
        }
        
        // Climate policies
        if (this.environmentalState.climateStability < 0.6) {
            recommendations.push({
                policy: 'carbon_pricing',
                type: 'economic',
                urgency: 'high',
                expectedImpact: 0.6,
                implementation_cost: 0.03
            });
        }
        
        // Conservation policies
        if (this.environmentalState.biodiversityIndex < 0.6) {
            recommendations.push({
                policy: 'protected_areas_expansion',
                type: 'conservation',
                urgency: 'medium',
                expectedImpact: 0.5,
                implementation_cost: 0.08
            });
        }
        
        // Green technology incentives
        if (this.environmentalState.greenTechAdoption < 0.5) {
            recommendations.push({
                policy: 'green_technology_incentives',
                type: 'economic',
                urgency: 'medium',
                expectedImpact: 0.4,
                implementation_cost: 0.04
            });
        }
        
        return recommendations;
    }

    recommendTechnologyInvestments(sustainabilityAnalysis) {
        const investments = [];
        
        sustainabilityAnalysis.technologyGaps.forEach(gap => {
            investments.push({
                technology: gap.technology,
                priority: gap.priority,
                applications: gap.applications,
                development_time: gap.development_time,
                investment_level: this.calculateInvestmentLevel(gap),
                expected_roi: this.estimateEnvironmentalROI(gap)
            });
        });
        
        return investments.sort((a, b) => b.priority - a.priority);
    }

    calculateInvestmentLevel(technologyGap) {
        const baseInvestment = 0.02; // 2% of environmental budget
        const priorityMultiplier = technologyGap.priority;
        
        return baseInvestment * priorityMultiplier * 2; // Up to 4% for highest priority
    }

    estimateEnvironmentalROI(technologyGap) {
        const roiMap = {
            'clean_energy_systems': 0.8,
            'pollution_control': 0.9,
            'environmental_monitoring': 0.6
        };
        
        return roiMap[technologyGap.technology] || 0.5;
    }

    developCooperationStrategy(sustainabilityAnalysis) {
        const strategy = {
            international_agreements: [],
            technology_sharing: [],
            joint_research: [],
            funding_partnerships: []
        };
        
        // Climate cooperation
        if (this.environmentalState.climateStability < 0.6) {
            strategy.international_agreements.push({
                type: 'climate_accord',
                scope: 'global',
                benefits: ['emission_reduction', 'technology_transfer', 'funding_access'],
                commitments: ['emission_targets', 'reporting_requirements']
            });
        }
        
        // Technology sharing
        sustainabilityAnalysis.technologyGaps.forEach(gap => {
            if (gap.priority > 0.7) {
                strategy.technology_sharing.push({
                    technology: gap.technology,
                    partnership_type: 'bilateral',
                    benefits: ['accelerated_development', 'cost_sharing'],
                    requirements: ['ip_agreements', 'capacity_building']
                });
            }
        });
        
        return strategy;
    }

    setEnvironmentalTargets(healthAssessment) {
        const currentHealth = healthAssessment.overallHealth;
        
        return {
            ecosystem_health: Math.min(1.0, currentHealth + 0.15),
            pollution_reduction: Math.max(0.1, this.calculatePollutionScore() - 0.2),
            renewable_energy_ratio: Math.min(1.0, this.environmentalState.renewableEnergyRatio + 0.2),
            biodiversity_index: Math.min(1.0, this.environmentalState.biodiversityIndex + 0.1),
            carbon_footprint: Math.max(0.1, this.environmentalState.carbonFootprint - 0.15),
            circular_economy_index: Math.min(1.0, this.environmentalState.circularEconomyIndex + 0.2)
        };
    }

    generateEnvironmentalDecisions(environmentalStrategy) {
        return {
            // Economic System Inputs
            environmental_spending_level: this.calculateEnvironmentalSpending(environmentalStrategy),
            green_technology_investment: this.calculateGreenTechInvestment(environmentalStrategy),
            carbon_pricing_level: this.calculateCarbonPricing(environmentalStrategy),
            
            // Policy System Inputs
            environmental_policy_priority: this.calculateEnvironmentalPolicyPriority(environmentalStrategy),
            conservation_policy_strength: this.calculateConservationPolicyStrength(environmentalStrategy),
            pollution_control_strictness: this.calculatePollutionControlStrictness(environmentalStrategy),
            
            // Population System Inputs
            environmental_health_impact: this.calculateEnvironmentalHealthImpact(environmentalStrategy),
            sustainability_education_level: this.calculateSustainabilityEducation(environmentalStrategy),
            
            // Research System Inputs
            environmental_research_priority: this.calculateEnvironmentalResearchPriority(environmentalStrategy),
            green_innovation_focus: this.calculateGreenInnovationFocus(environmentalStrategy),
            
            // Trade System Inputs
            sustainable_trade_preference: this.calculateSustainableTradePreference(environmentalStrategy),
            environmental_trade_standards: this.calculateEnvironmentalTradeStandards(environmentalStrategy),
            
            // General Environmental Metrics
            overall_ecosystem_health: this.environmentalState.ecosystemHealth,
            climate_stability_index: this.environmentalState.climateStability,
            sustainability_index: this.calculateOverallSustainabilityIndex()
        };
    }

    // Helper methods for decision calculation
    calculateEnvironmentalSpending(strategy) {
        const baseSpending = 0.08; // 8% of budget
        const urgentActions = strategy.priorityActions.filter(a => a.timeline === 'immediate').length;
        
        return Math.min(0.2, baseSpending + urgentActions * 0.02);
    }

    calculateGreenTechInvestment(strategy) {
        const totalInvestment = strategy.technologyInvestments
            .reduce((sum, inv) => sum + inv.investment_level, 0);
        
        return Math.min(0.15, totalInvestment);
    }

    calculateCarbonPricing(strategy) {
        const hasClimatePolicy = strategy.policyRecommendations
            .some(p => p.policy === 'carbon_pricing');
        
        return hasClimatePolicy ? 0.8 : 0.3;
    }

    calculateEnvironmentalPolicyPriority(strategy) {
        const urgentActions = strategy.priorityActions.filter(a => a.priority > 0.8).length;
        return Math.min(1.0, 0.5 + urgentActions * 0.1);
    }

    calculateConservationPolicyStrength(strategy) {
        return strategy.resourceAllocation.conservation * 2; // Scale to 0-1 range
    }

    calculatePollutionControlStrictness(strategy) {
        return strategy.resourceAllocation.pollution_control * 2;
    }

    calculateEnvironmentalHealthImpact(strategy) {
        const pollutionScore = this.calculatePollutionScore();
        return Math.max(0.1, 1 - pollutionScore);
    }

    calculateSustainabilityEducation(strategy) {
        return this.environmentalState.greenTechAdoption;
    }

    calculateEnvironmentalResearchPriority(strategy) {
        return strategy.resourceAllocation.research * 5; // Scale to research priority
    }

    calculateGreenInnovationFocus(strategy) {
        const techInvestments = strategy.technologyInvestments.length;
        return Math.min(1.0, techInvestments * 0.2);
    }

    calculateSustainableTradePreference(strategy) {
        return this.environmentalState.circularEconomyIndex + 0.3;
    }

    calculateEnvironmentalTradeStandards(strategy) {
        const hasEmissionStandards = strategy.policyRecommendations
            .some(p => p.policy === 'emission_standards');
        
        return hasEmissionStandards ? 0.8 : 0.5;
    }

    calculateOverallSustainabilityIndex() {
        return (
            this.environmentalState.ecosystemHealth * 0.3 +
            this.environmentalState.renewableEnergyRatio * 0.25 +
            (1 - this.calculatePollutionScore()) * 0.25 +
            this.environmentalState.circularEconomyIndex * 0.2
        );
    }

    estimateResourceRequirement(issue) {
        return {
            budget: issue.severity * 0.1, // Up to 10% of environmental budget
            personnel: Math.ceil(issue.severity * 1000),
            timeline: issue.timeline || 'medium_term'
        };
    }

    updateEnvironmentalState(healthAssessment, sustainabilityAnalysis, environmentalStrategy) {
        // Update health metrics
        this.environmentalState.ecosystemHealth = healthAssessment.overallHealth;
        
        // Update based on strategy implementation
        if (environmentalStrategy.priorityActions.length > 0) {
            this.environmentalState.monitoringCapacity = Math.min(1.0,
                this.environmentalState.monitoringCapacity + 0.02);
        }
        
        // Update technology adoption
        const techInvestments = environmentalStrategy.technologyInvestments.length;
        if (techInvestments > 0) {
            this.environmentalState.greenTechAdoption = Math.min(1.0,
                this.environmentalState.greenTechAdoption + techInvestments * 0.01);
        }
        
        // Update resource allocation effects
        const allocation = environmentalStrategy.resourceAllocation;
        if (allocation.renewable_energy > 0.3) {
            this.environmentalState.renewableEnergyRatio = Math.min(1.0,
                this.environmentalState.renewableEnergyRatio + 0.02);
        }
        
        if (allocation.pollution_control > 0.3) {
            Object.keys(this.environmentalState.pollutionLevels).forEach(pollutant => {
                this.environmentalState.pollutionLevels[pollutant] = Math.max(0.05,
                    this.environmentalState.pollutionLevels[pollutant] - 0.01);
            });
        }
        
        this.environmentalState.lastUpdate = Date.now();
    }

    generateFallbackDecisions() {
        return {
            environmental_spending_level: 0.08,
            green_technology_investment: 0.05,
            carbon_pricing_level: 0.3,
            environmental_policy_priority: 0.5,
            conservation_policy_strength: 0.4,
            pollution_control_strictness: 0.6,
            environmental_health_impact: 0.7,
            sustainability_education_level: 0.4,
            environmental_research_priority: 0.2,
            green_innovation_focus: 0.3,
            sustainable_trade_preference: 0.5,
            environmental_trade_standards: 0.5,
            overall_ecosystem_health: 0.7,
            climate_stability_index: 0.65,
            sustainability_index: 0.6
        };
    }

    // Context management
    addContext(contextData, metadata = {}) {
        if (contextData.economic_indicators) {
            this.context.economicConstraints = contextData.economic_indicators;
        }
        
        if (contextData.population_metrics) {
            this.context.populationNeeds = contextData.population_metrics;
        }
        
        if (contextData.industrial_data) {
            this.context.industrialActivity = contextData.industrial_data;
        }
        
        if (contextData.urban_development) {
            this.context.urbanDevelopment = contextData.urban_development;
        }
    }

    updateContext(contextData) {
        this.addContext(contextData);
    }

    // Status and monitoring
    getSystemStatus() {
        return {
            systemId: this.systemId,
            civilizationId: this.civilizationId,
            ecosystemHealth: this.environmentalState.ecosystemHealth,
            climateStability: this.environmentalState.climateStability,
            renewableEnergyRatio: this.environmentalState.renewableEnergyRatio,
            pollutionLevel: this.calculatePollutionScore(),
            sustainabilityIndex: this.calculateOverallSustainabilityIndex(),
            lastUpdate: this.environmentalState.lastUpdate
        };
    }

    ping() {
        return {
            status: 'operational',
            timestamp: Date.now(),
            systemId: this.systemId
        };
    }

    // Cleanup
    destroy() {
        this.removeAllListeners();
        this.environmentalState.resourceSustainability.clear();
        this.environmentalState.activePolicies.clear();
        this.environmentalState.sustainabilityGoals.clear();
        this.environmentalState.climateRisks = [];
        this.environmentalState.adaptationStrategies = [];
        
        console.log(`🌍 Environmental AI destroyed for ${this.civilizationId}`);
    }
}

module.exports = { EnvironmentalAI };
