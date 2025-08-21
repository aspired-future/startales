// Governance AI - Policy recommendations, administrative efficiency, and strategic governance
// Provides intelligent governance decisions and administrative optimization

const EventEmitter = require('events');

class GovernanceAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'governance-ai';
        this.civilizationId = config.civilizationId;
        
        // Governance analysis state
        this.governanceState = {
            // Administrative Efficiency
            administrativeEfficiency: 0.7,
            bureaucracyLevel: 0.5, // 0=minimal, 1=extensive
            decisionMakingSpeed: 0.6,
            
            // Policy Framework
            activePolicies: new Map(),
            policyEffectiveness: new Map(),
            policyPriorities: ['economic_growth', 'social_welfare', 'security'],
            
            // Governance Style
            governanceStyle: 'balanced', // authoritarian, balanced, democratic
            transparencyLevel: 0.7,
            citizenEngagement: 0.6,
            
            // Resource Management
            budgetAllocation: {
                infrastructure: 0.25,
                education: 0.20,
                healthcare: 0.18,
                defense: 0.15,
                social_services: 0.12,
                administration: 0.10
            },
            
            // Performance Metrics
            governmentApproval: 0.65,
            policyImplementationRate: 0.75,
            administrativeCosts: 0.08, // % of GDP
            
            // Strategic Planning
            longTermGoals: [],
            strategicInitiatives: [],
            reformAgenda: [],
            
            lastUpdate: Date.now()
        };
        
        // Decision-making context
        this.context = {
            economicConditions: {},
            socialConditions: {},
            politicalEnvironment: {},
            externalPressures: {},
            citizenNeeds: {},
            institutionalCapacity: {}
        };
        
        // AI processing parameters
        this.processingConfig = {
            governancePhilosophy: config.governancePhilosophy || 'pragmatic', // idealistic, pragmatic, opportunistic
            riskTolerance: config.riskTolerance || 0.4,
            reformAggression: config.reformAggression || 'moderate', // conservative, moderate, aggressive
            stakeholderBalance: config.stakeholderBalance || 'balanced' // citizen_focused, business_focused, balanced
        };
        
        console.log(`🏛️ Governance AI initialized for ${this.civilizationId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update context from game analysis
            this.updateContext(gameAnalysis);
            
            // Analyze governance performance
            const performanceAnalysis = await this.analyzeGovernancePerformance(gameAnalysis);
            
            // Assess policy effectiveness
            const policyAssessment = await this.assessPolicyEffectiveness(gameAnalysis);
            
            // Generate governance recommendations
            const governanceDecisions = await this.generateGovernanceDecisions(performanceAnalysis, policyAssessment);
            
            // Update governance state
            this.updateGovernanceState(performanceAnalysis, policyAssessment, governanceDecisions);
            
            // Generate outputs for deterministic systems
            const decisions = this.generateSystemInputs(governanceDecisions);
            
            const processingTime = Date.now() - startTime;
            console.log(`🏛️ Governance AI processed in ${processingTime}ms for ${this.civilizationId}`);
            
            this.emit('processingComplete', {
                civilizationId: this.civilizationId,
                decisions,
                governmentApproval: this.governanceState.governmentApproval,
                processingTime
            });
            
            return decisions;
            
        } catch (error) {
            console.error(`🏛️ Governance AI processing error for ${this.civilizationId}:`, error);
            this.emit('processingError', { civilizationId: this.civilizationId, error });
            return this.generateFallbackDecisions();
        }
    }

    updateContext(gameAnalysis) {
        if (gameAnalysis.systemData) {
            // Economic conditions
            if (gameAnalysis.systemData['economic-system']) {
                this.context.economicConditions = gameAnalysis.systemData['economic-system'];
            }
            
            // Social conditions
            if (gameAnalysis.systemData['population-system']) {
                this.context.socialConditions = gameAnalysis.systemData['population-system'];
            }
            
            // Political environment
            if (gameAnalysis.systemData['policy-system']) {
                this.context.politicalEnvironment = gameAnalysis.systemData['policy-system'];
            }
            
            // External pressures
            if (gameAnalysis.systemData['diplomacy-system']) {
                this.context.externalPressures = gameAnalysis.systemData['diplomacy-system'];
            }
            
            // News and public opinion
            if (gameAnalysis.systemData['news-generation-system']) {
                this.context.citizenNeeds = gameAnalysis.systemData['news-generation-system'];
            }
        }
    }

    async analyzeGovernancePerformance(gameAnalysis) {
        const performance = {
            efficiency: this.assessAdministrativeEfficiency(),
            effectiveness: this.assessPolicyEffectiveness(),
            responsiveness: this.assessGovernmentResponsiveness(),
            transparency: this.assessTransparencyLevel(),
            stability: this.assessPoliticalStability(),
            overallScore: 0
        };
        
        // Calculate overall performance score
        performance.overallScore = (
            performance.efficiency * 0.25 +
            performance.effectiveness * 0.25 +
            performance.responsiveness * 0.20 +
            performance.transparency * 0.15 +
            performance.stability * 0.15
        );
        
        return performance;
    }

    assessAdministrativeEfficiency() {
        const economic = this.context.economicConditions;
        const adminCosts = this.governanceState.administrativeCosts;
        
        // Lower administrative costs with maintained service quality = higher efficiency
        const costEfficiency = Math.max(0, 1 - (adminCosts / 0.15)); // Benchmark at 15% of GDP
        
        // Implementation rate affects efficiency
        const implementationEfficiency = this.governanceState.policyImplementationRate;
        
        // Economic performance reflects governance efficiency
        const economicEfficiency = economic.economic_indicators?.gdp_growth > 0 ? 0.8 : 0.4;
        
        return (costEfficiency * 0.4 + implementationEfficiency * 0.4 + economicEfficiency * 0.2);
    }

    assessPolicyEffectiveness() {
        let totalEffectiveness = 0;
        let policyCount = 0;
        
        for (const [policyId, effectiveness] of this.governanceState.policyEffectiveness) {
            totalEffectiveness += effectiveness;
            policyCount++;
        }
        
        return policyCount > 0 ? totalEffectiveness / policyCount : 0.5;
    }

    assessGovernmentResponsiveness() {
        const social = this.context.socialConditions;
        const approval = this.governanceState.governmentApproval;
        
        // High approval suggests responsive governance
        const approvalScore = approval;
        
        // Social stability indicates responsiveness to citizen needs
        const stabilityScore = social.social_stability || 0.7;
        
        // Decision-making speed affects responsiveness
        const speedScore = this.governanceState.decisionMakingSpeed;
        
        return (approvalScore * 0.5 + stabilityScore * 0.3 + speedScore * 0.2);
    }

    assessTransparencyLevel() {
        // Base transparency level
        let transparency = this.governanceState.transparencyLevel;
        
        // Adjust based on governance style
        switch (this.governanceState.governanceStyle) {
            case 'democratic':
                transparency += 0.1;
                break;
            case 'authoritarian':
                transparency -= 0.2;
                break;
        }
        
        // News freedom affects transparency perception
        const news = this.context.citizenNeeds;
        if (news.media_credibility?.overallCredibility > 0.7) {
            transparency += 0.05;
        }
        
        return Math.max(0, Math.min(1, transparency));
    }

    assessPoliticalStability() {
        const social = this.context.socialConditions;
        const economic = this.context.economicConditions;
        const external = this.context.externalPressures;
        
        // Social stability is key component
        const socialStability = social.social_stability || 0.7;
        
        // Economic performance affects stability
        const economicStability = economic.economic_indicators?.unemployment < 0.1 ? 0.8 : 0.5;
        
        // External threats can destabilize
        const externalStability = external.crisis_management_capacity > 0.6 ? 0.8 : 0.6;
        
        // Government approval affects stability
        const approvalStability = this.governanceState.governmentApproval;
        
        return (socialStability * 0.3 + economicStability * 0.3 + 
                externalStability * 0.2 + approvalStability * 0.2);
    }

    async assessPolicyEffectiveness(gameAnalysis) {
        const assessment = {
            economicPolicies: this.assessEconomicPolicyEffectiveness(),
            socialPolicies: this.assessSocialPolicyEffectiveness(),
            securityPolicies: this.assessSecurityPolicyEffectiveness(),
            environmentalPolicies: this.assessEnvironmentalPolicyEffectiveness(),
            overallEffectiveness: 0,
            recommendedAdjustments: []
        };
        
        // Calculate overall effectiveness
        assessment.overallEffectiveness = (
            assessment.economicPolicies.effectiveness * 0.3 +
            assessment.socialPolicies.effectiveness * 0.3 +
            assessment.securityPolicies.effectiveness * 0.25 +
            assessment.environmentalPolicies.effectiveness * 0.15
        );
        
        // Collect recommendations
        assessment.recommendedAdjustments = [
            ...assessment.economicPolicies.recommendations,
            ...assessment.socialPolicies.recommendations,
            ...assessment.securityPolicies.recommendations,
            ...assessment.environmentalPolicies.recommendations
        ];
        
        return assessment;
    }

    assessEconomicPolicyEffectiveness() {
        const economic = this.context.economicConditions;
        const indicators = economic.economic_indicators || {};
        
        let effectiveness = 0.5; // Base effectiveness
        const recommendations = [];
        
        // GDP growth indicates effective economic policy
        if (indicators.gdp_growth > 0.03) {
            effectiveness += 0.2;
        } else if (indicators.gdp_growth < 0) {
            effectiveness -= 0.2;
            recommendations.push('stimulate_economic_growth');
        }
        
        // Unemployment levels
        if (indicators.unemployment < 0.05) {
            effectiveness += 0.15;
        } else if (indicators.unemployment > 0.1) {
            effectiveness -= 0.15;
            recommendations.push('job_creation_programs');
        }
        
        // Inflation control
        if (indicators.inflation > 0.05) {
            effectiveness -= 0.1;
            recommendations.push('inflation_control_measures');
        }
        
        return {
            effectiveness: Math.max(0, Math.min(1, effectiveness)),
            recommendations
        };
    }

    assessSocialPolicyEffectiveness() {
        const social = this.context.socialConditions;
        const metrics = social.population_metrics || {};
        
        let effectiveness = 0.5;
        const recommendations = [];
        
        // Social stability
        if (social.social_stability > 0.8) {
            effectiveness += 0.2;
        } else if (social.social_stability < 0.5) {
            effectiveness -= 0.2;
            recommendations.push('social_cohesion_programs');
        }
        
        // Health and education indicators
        if (metrics.health_index > 0.8) {
            effectiveness += 0.1;
        } else if (metrics.health_index < 0.6) {
            recommendations.push('healthcare_improvement');
        }
        
        if (metrics.education_index > 0.8) {
            effectiveness += 0.1;
        } else if (metrics.education_index < 0.6) {
            recommendations.push('education_reform');
        }
        
        return {
            effectiveness: Math.max(0, Math.min(1, effectiveness)),
            recommendations
        };
    }

    assessSecurityPolicyEffectiveness() {
        const external = this.context.externalPressures;
        const social = this.context.socialConditions;
        
        let effectiveness = 0.6; // Base security effectiveness
        const recommendations = [];
        
        // Crisis management capacity
        if (external.crisis_management_capacity > 0.8) {
            effectiveness += 0.2;
        } else if (external.crisis_management_capacity < 0.5) {
            effectiveness -= 0.2;
            recommendations.push('strengthen_crisis_response');
        }
        
        // Social stability as security indicator
        if (social.social_stability < 0.6) {
            effectiveness -= 0.1;
            recommendations.push('internal_security_measures');
        }
        
        return {
            effectiveness: Math.max(0, Math.min(1, effectiveness)),
            recommendations
        };
    }

    assessEnvironmentalPolicyEffectiveness() {
        // Placeholder for environmental policy assessment
        // Would integrate with environmental systems when available
        
        return {
            effectiveness: 0.6,
            recommendations: ['environmental_monitoring', 'sustainability_initiatives']
        };
    }

    async generateGovernanceDecisions(performanceAnalysis, policyAssessment) {
        const decisions = {
            budgetReallocation: this.optimizeBudgetAllocation(performanceAnalysis, policyAssessment),
            policyAdjustments: this.recommendPolicyAdjustments(policyAssessment),
            administrativeReforms: this.recommendAdministrativeReforms(performanceAnalysis),
            governanceStyle: this.evaluateGovernanceStyle(performanceAnalysis),
            strategicInitiatives: this.developStrategicInitiatives(performanceAnalysis, policyAssessment),
            transparencyMeasures: this.recommendTransparencyMeasures(performanceAnalysis)
        };
        
        return decisions;
    }

    optimizeBudgetAllocation(performanceAnalysis, policyAssessment) {
        const allocation = { ...this.governanceState.budgetAllocation };
        
        // Adjust based on policy effectiveness
        if (policyAssessment.economicPolicies.effectiveness < 0.5) {
            allocation.infrastructure += 0.05;
            allocation.administration -= 0.05;
        }
        
        if (policyAssessment.socialPolicies.effectiveness < 0.5) {
            allocation.education += 0.03;
            allocation.healthcare += 0.03;
            allocation.defense -= 0.06;
        }
        
        // Adjust based on performance gaps
        if (performanceAnalysis.efficiency < 0.6) {
            allocation.administration += 0.02; // Invest in better administration
            allocation.social_services -= 0.02;
        }
        
        // Normalize to ensure sum equals 1
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        Object.keys(allocation).forEach(key => {
            allocation[key] = allocation[key] / total;
        });
        
        return allocation;
    }

    recommendPolicyAdjustments(policyAssessment) {
        const adjustments = [];
        
        // Economic policy adjustments
        policyAssessment.economicPolicies.recommendations.forEach(rec => {
            adjustments.push({
                area: 'economic',
                action: rec,
                priority: 'high',
                expectedImpact: 0.15
            });
        });
        
        // Social policy adjustments
        policyAssessment.socialPolicies.recommendations.forEach(rec => {
            adjustments.push({
                area: 'social',
                action: rec,
                priority: 'medium',
                expectedImpact: 0.1
            });
        });
        
        // Security policy adjustments
        policyAssessment.securityPolicies.recommendations.forEach(rec => {
            adjustments.push({
                area: 'security',
                action: rec,
                priority: 'high',
                expectedImpact: 0.12
            });
        });
        
        return adjustments;
    }

    recommendAdministrativeReforms(performanceAnalysis) {
        const reforms = [];
        
        if (performanceAnalysis.efficiency < 0.6) {
            reforms.push({
                type: 'efficiency_improvement',
                description: 'Streamline administrative processes',
                expectedBenefit: 0.15,
                implementationCost: 0.05,
                timeline: 'medium_term'
            });
        }
        
        if (performanceAnalysis.responsiveness < 0.6) {
            reforms.push({
                type: 'responsiveness_enhancement',
                description: 'Improve citizen service delivery',
                expectedBenefit: 0.12,
                implementationCost: 0.08,
                timeline: 'short_term'
            });
        }
        
        if (performanceAnalysis.transparency < 0.7) {
            reforms.push({
                type: 'transparency_initiative',
                description: 'Increase government transparency',
                expectedBenefit: 0.1,
                implementationCost: 0.03,
                timeline: 'short_term'
            });
        }
        
        return reforms;
    }

    evaluateGovernanceStyle(performanceAnalysis) {
        const current = this.governanceState.governanceStyle;
        const approval = this.governanceState.governmentApproval;
        const stability = performanceAnalysis.stability;
        
        // Consider style change if performance is poor
        if (approval < 0.5 || stability < 0.5) {
            if (current === 'authoritarian') {
                return {
                    recommended: 'balanced',
                    reason: 'Low approval suggests need for more inclusive governance',
                    transitionPlan: 'gradual_democratization'
                };
            } else if (current === 'democratic' && stability < 0.4) {
                return {
                    recommended: 'balanced',
                    reason: 'Instability suggests need for stronger executive authority',
                    transitionPlan: 'strengthen_institutions'
                };
            }
        }
        
        return {
            recommended: current,
            reason: 'Current governance style is performing adequately',
            transitionPlan: 'maintain_current_approach'
        };
    }

    developStrategicInitiatives(performanceAnalysis, policyAssessment) {
        const initiatives = [];
        
        // Economic development initiatives
        if (policyAssessment.economicPolicies.effectiveness < 0.6) {
            initiatives.push({
                name: 'Economic Revitalization Program',
                objectives: ['boost_gdp_growth', 'reduce_unemployment', 'attract_investment'],
                timeline: '2_years',
                budget: 0.1, // 10% of budget
                expectedOutcomes: ['gdp_growth_increase', 'job_creation', 'business_confidence']
            });
        }
        
        // Social development initiatives
        if (policyAssessment.socialPolicies.effectiveness < 0.6) {
            initiatives.push({
                name: 'Social Cohesion Enhancement',
                objectives: ['improve_social_services', 'reduce_inequality', 'strengthen_communities'],
                timeline: '18_months',
                budget: 0.08,
                expectedOutcomes: ['social_stability_increase', 'citizen_satisfaction', 'reduced_social_tensions']
            });
        }
        
        // Governance modernization
        if (performanceAnalysis.efficiency < 0.6) {
            initiatives.push({
                name: 'Digital Governance Transformation',
                objectives: ['digitize_services', 'improve_efficiency', 'enhance_transparency'],
                timeline: '3_years',
                budget: 0.05,
                expectedOutcomes: ['administrative_efficiency', 'citizen_convenience', 'cost_reduction']
            });
        }
        
        return initiatives;
    }

    recommendTransparencyMeasures(performanceAnalysis) {
        const measures = [];
        
        if (performanceAnalysis.transparency < 0.7) {
            measures.push({
                measure: 'open_data_initiative',
                description: 'Publish government data and statistics publicly',
                impact: 0.1,
                cost: 0.02
            });
            
            measures.push({
                measure: 'public_consultation_expansion',
                description: 'Increase citizen participation in policy-making',
                impact: 0.08,
                cost: 0.03
            });
            
            measures.push({
                measure: 'government_performance_reporting',
                description: 'Regular public reporting on government performance',
                impact: 0.06,
                cost: 0.01
            });
        }
        
        return measures;
    }

    generateSystemInputs(governanceDecisions) {
        return {
            // Policy System Inputs
            policy_implementation_speed: this.calculatePolicyImplementationSpeed(governanceDecisions),
            policy_budget_allocation: this.calculatePolicyBudgetAllocation(governanceDecisions),
            public_consultation_level: this.calculatePublicConsultationLevel(governanceDecisions),
            
            // Economic System Inputs
            government_spending_level: this.calculateGovernmentSpendingLevel(governanceDecisions),
            administrative_efficiency: this.calculateAdministrativeEfficiency(governanceDecisions),
            
            // Population System Inputs
            governance_quality: this.calculateGovernanceQuality(governanceDecisions),
            citizen_engagement_level: this.calculateCitizenEngagementLevel(governanceDecisions),
            
            // News System Inputs
            transparency_policy: this.calculateTransparencyPolicy(governanceDecisions),
            government_media_influence: this.calculateMediaInfluence(governanceDecisions),
            
            // General Governance Metrics
            government_approval_rating: this.governanceState.governmentApproval,
            administrative_cost_ratio: this.governanceState.administrativeCosts,
            decision_making_efficiency: this.governanceState.decisionMakingSpeed
        };
    }

    // Helper methods for system input calculation
    calculatePolicyImplementationSpeed(decisions) {
        let speed = this.governanceState.decisionMakingSpeed;
        
        // Administrative reforms affect implementation speed
        decisions.administrativeReforms.forEach(reform => {
            if (reform.type === 'efficiency_improvement') {
                speed += reform.expectedBenefit * 0.5;
            }
        });
        
        return Math.min(1.0, speed);
    }

    calculatePolicyBudgetAllocation(decisions) {
        return decisions.budgetReallocation.administration + 
               decisions.budgetReallocation.infrastructure * 0.3;
    }

    calculatePublicConsultationLevel(decisions) {
        let consultationLevel = this.governanceState.citizenEngagement;
        
        // Transparency measures affect consultation
        decisions.transparencyMeasures.forEach(measure => {
            if (measure.measure === 'public_consultation_expansion') {
                consultationLevel += measure.impact;
            }
        });
        
        return Math.min(1.0, consultationLevel);
    }

    calculateGovernmentSpendingLevel(decisions) {
        const totalSpending = Object.values(decisions.budgetReallocation)
            .reduce((sum, val) => sum + val, 0);
        
        // Strategic initiatives add to spending
        const initiativeSpending = decisions.strategicInitiatives
            .reduce((sum, initiative) => sum + initiative.budget, 0);
        
        return Math.min(1.0, totalSpending + initiativeSpending);
    }

    calculateAdministrativeEfficiency(decisions) {
        let efficiency = this.governanceState.administrativeEfficiency;
        
        // Administrative reforms improve efficiency
        decisions.administrativeReforms.forEach(reform => {
            if (reform.type === 'efficiency_improvement') {
                efficiency += reform.expectedBenefit;
            }
        });
        
        return Math.min(1.0, efficiency);
    }

    calculateGovernanceQuality(decisions) {
        const baseQuality = (this.governanceState.administrativeEfficiency + 
                           this.governanceState.transparencyLevel + 
                           this.governanceState.governmentApproval) / 3;
        
        // Strategic initiatives improve governance quality
        const initiativeBonus = decisions.strategicInitiatives.length * 0.05;
        
        return Math.min(1.0, baseQuality + initiativeBonus);
    }

    calculateCitizenEngagementLevel(decisions) {
        let engagement = this.governanceState.citizenEngagement;
        
        // Transparency measures increase engagement
        decisions.transparencyMeasures.forEach(measure => {
            engagement += measure.impact * 0.5;
        });
        
        return Math.min(1.0, engagement);
    }

    calculateTransparencyPolicy(decisions) {
        let transparency = this.governanceState.transparencyLevel;
        
        // Transparency measures directly affect policy
        decisions.transparencyMeasures.forEach(measure => {
            transparency += measure.impact;
        });
        
        return Math.min(1.0, transparency);
    }

    calculateMediaInfluence(decisions) {
        // Based on governance style and transparency
        switch (this.governanceState.governanceStyle) {
            case 'authoritarian':
                return 0.7; // High media influence
            case 'democratic':
                return 0.2; // Low media influence
            case 'balanced':
            default:
                return 0.4; // Moderate media influence
        }
    }

    updateGovernanceState(performanceAnalysis, policyAssessment, governanceDecisions) {
        // Update efficiency metrics
        this.governanceState.administrativeEfficiency = performanceAnalysis.efficiency;
        this.governanceState.policyImplementationRate = policyAssessment.overallEffectiveness;
        this.governanceState.governmentApproval = this.calculateNewApprovalRating(performanceAnalysis);
        
        // Update budget allocation
        this.governanceState.budgetAllocation = governanceDecisions.budgetReallocation;
        
        // Update governance style if recommended
        if (governanceDecisions.governanceStyle.recommended !== this.governanceState.governanceStyle) {
            this.governanceState.governanceStyle = governanceDecisions.governanceStyle.recommended;
        }
        
        // Update strategic initiatives
        this.governanceState.strategicInitiatives = governanceDecisions.strategicInitiatives;
        
        // Update transparency level
        const transparencyBonus = governanceDecisions.transparencyMeasures
            .reduce((sum, measure) => sum + measure.impact, 0);
        this.governanceState.transparencyLevel = Math.min(1.0, 
            this.governanceState.transparencyLevel + transparencyBonus);
        
        this.governanceState.lastUpdate = Date.now();
    }

    calculateNewApprovalRating(performanceAnalysis) {
        // Base approval on overall performance
        let newApproval = performanceAnalysis.overallScore;
        
        // Adjust based on economic conditions
        const economic = this.context.economicConditions;
        if (economic.economic_indicators?.gdp_growth > 0.03) {
            newApproval += 0.1;
        } else if (economic.economic_indicators?.gdp_growth < 0) {
            newApproval -= 0.15;
        }
        
        // Adjust based on social conditions
        const social = this.context.socialConditions;
        if (social.social_stability > 0.8) {
            newApproval += 0.05;
        } else if (social.social_stability < 0.5) {
            newApproval -= 0.1;
        }
        
        // Smooth transition from current approval
        const currentApproval = this.governanceState.governmentApproval;
        return currentApproval * 0.7 + newApproval * 0.3;
    }

    generateFallbackDecisions() {
        return {
            policy_implementation_speed: 0.6,
            policy_budget_allocation: 0.7,
            public_consultation_level: 0.5,
            government_spending_level: 0.4,
            administrative_efficiency: 0.7,
            governance_quality: 0.6,
            citizen_engagement_level: 0.6,
            transparency_policy: 0.7,
            government_media_influence: 0.2,
            government_approval_rating: 0.65,
            administrative_cost_ratio: 0.08,
            decision_making_efficiency: 0.6
        };
    }

    // Context management
    addContext(contextData, metadata = {}) {
        if (contextData.economic_indicators) {
            this.context.economicConditions = contextData.economic_indicators;
        }
        
        if (contextData.population_metrics) {
            this.context.socialConditions = contextData.population_metrics;
        }
        
        if (contextData.policy_effectiveness) {
            this.context.politicalEnvironment = contextData.policy_effectiveness;
        }
        
        if (contextData.diplomatic_status) {
            this.context.externalPressures = contextData.diplomatic_status;
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
            governmentApproval: this.governanceState.governmentApproval,
            administrativeEfficiency: this.governanceState.administrativeEfficiency,
            governanceStyle: this.governanceState.governanceStyle,
            transparencyLevel: this.governanceState.transparencyLevel,
            activePolicies: this.governanceState.activePolicies.size,
            strategicInitiatives: this.governanceState.strategicInitiatives.length,
            lastUpdate: this.governanceState.lastUpdate
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
        this.governanceState.activePolicies.clear();
        this.governanceState.policyEffectiveness.clear();
        this.governanceState.strategicInitiatives = [];
        this.governanceState.reformAgenda = [];
        
        console.log(`🏛️ Governance AI destroyed for ${this.civilizationId}`);
    }
}

module.exports = { GovernanceAI };
