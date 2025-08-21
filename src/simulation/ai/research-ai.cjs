// Research AI - Technology priorities, innovation strategies, and scientific advancement
// Provides intelligent research direction and technology development decisions

const EventEmitter = require('events');

class ResearchAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.systemId = config.systemId || 'research-ai';
        this.civilizationId = config.civilizationId;
        
        // Research analysis state
        this.researchState = {
            // Technology Portfolio
            activeTechnologies: new Map(),
            researchPriorities: ['artificial_intelligence', 'space_exploration', 'biotechnology'],
            technologyReadinessLevels: new Map(),
            
            // Research Capacity
            researchCapacity: 0.6,
            researchEfficiency: 0.7,
            innovationRate: 0.4,
            
            // Resource Allocation
            budgetAllocation: {
                basic_research: 0.25,
                applied_research: 0.35,
                development: 0.25,
                infrastructure: 0.15
            },
            
            // Research Focus Areas
            focusAreas: {
                military: 0.2,
                economic: 0.3,
                social: 0.2,
                environmental: 0.15,
                space: 0.15
            },
            
            // Innovation Metrics
            breakthroughPotential: new Map(),
            collaborationIndex: 0.5,
            technologyTransferRate: 0.6,
            
            // Strategic Research
            longTermProjects: [],
            emergencyResearch: [],
            collaborativeProjects: [],
            
            lastUpdate: Date.now()
        };
        
        // Decision-making context
        this.context = {
            economicConstraints: {},
            militaryNeeds: {},
            socialChallenges: {},
            environmentalPressures: {},
            competitivePosition: {},
            globalTrends: {}
        };
        
        // AI processing parameters
        this.processingConfig = {
            researchPhilosophy: config.researchPhilosophy || 'balanced', // basic_focused, applied_focused, balanced
            riskTolerance: config.riskTolerance || 0.5,
            innovationAggression: config.innovationAggression || 'moderate', // conservative, moderate, aggressive
            collaborationOpenness: config.collaborationOpenness || 0.6
        };
        
        // Technology domains and their relationships
        this.technologyDomains = {
            'artificial_intelligence': {
                prerequisites: ['computer_science', 'mathematics'],
                applications: ['automation', 'decision_support', 'optimization'],
                difficulty: 0.8,
                impact: 0.9
            },
            'biotechnology': {
                prerequisites: ['biology', 'chemistry'],
                applications: ['medicine', 'agriculture', 'materials'],
                difficulty: 0.7,
                impact: 0.8
            },
            'space_exploration': {
                prerequisites: ['physics', 'engineering'],
                applications: ['transportation', 'resources', 'colonization'],
                difficulty: 0.9,
                impact: 0.7
            },
            'quantum_computing': {
                prerequisites: ['quantum_physics', 'computer_science'],
                applications: ['cryptography', 'simulation', 'optimization'],
                difficulty: 0.95,
                impact: 0.85
            },
            'nanotechnology': {
                prerequisites: ['materials_science', 'chemistry'],
                applications: ['manufacturing', 'medicine', 'electronics'],
                difficulty: 0.8,
                impact: 0.8
            },
            'renewable_energy': {
                prerequisites: ['physics', 'engineering'],
                applications: ['power_generation', 'storage', 'efficiency'],
                difficulty: 0.6,
                impact: 0.7
            }
        };
        
        console.log(`🔬 Research AI initialized for ${this.civilizationId}`);
    }

    async processTick(gameAnalysis) {
        const startTime = Date.now();
        
        try {
            // Update context from game analysis
            this.updateContext(gameAnalysis);
            
            // Analyze research needs
            const needsAnalysis = await this.analyzeResearchNeeds(gameAnalysis);
            
            // Assess current research portfolio
            const portfolioAssessment = await this.assessResearchPortfolio(gameAnalysis);
            
            // Generate research strategy
            const researchStrategy = await this.generateResearchStrategy(needsAnalysis, portfolioAssessment);
            
            // Update research state
            this.updateResearchState(needsAnalysis, portfolioAssessment, researchStrategy);
            
            // Generate outputs for deterministic systems
            const decisions = this.generateResearchDecisions(researchStrategy);
            
            const processingTime = Date.now() - startTime;
            console.log(`🔬 Research AI processed in ${processingTime}ms for ${this.civilizationId}`);
            
            this.emit('processingComplete', {
                civilizationId: this.civilizationId,
                decisions,
                innovationRate: this.researchState.innovationRate,
                processingTime
            });
            
            return decisions;
            
        } catch (error) {
            console.error(`🔬 Research AI processing error for ${this.civilizationId}:`, error);
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
            
            // Military needs
            if (gameAnalysis.systemData['military-system']) {
                this.context.militaryNeeds = gameAnalysis.systemData['military-system'];
            }
            
            // Social challenges
            if (gameAnalysis.systemData['population-system']) {
                this.context.socialChallenges = gameAnalysis.systemData['population-system'];
            }
            
            // Environmental pressures
            if (gameAnalysis.systemData['environmental-system']) {
                this.context.environmentalPressures = gameAnalysis.systemData['environmental-system'];
            }
        }
        
        // Global trends from inter-civilization data
        if (gameAnalysis.globalEvents) {
            this.context.globalTrends = gameAnalysis.globalEvents;
        }
    }

    async analyzeResearchNeeds(gameAnalysis) {
        const needs = {
            urgent: [],
            strategic: [],
            opportunistic: [],
            collaborative: []
        };
        
        // Analyze urgent needs based on current challenges
        needs.urgent = this.identifyUrgentResearchNeeds();
        
        // Identify strategic long-term needs
        needs.strategic = this.identifyStrategicResearchNeeds();
        
        // Find opportunistic research areas
        needs.opportunistic = this.identifyOpportunisticResearch();
        
        // Assess collaboration opportunities
        needs.collaborative = this.identifyCollaborationOpportunities();
        
        return needs;
    }

    identifyUrgentResearchNeeds() {
        const urgentNeeds = [];
        
        // Economic challenges
        const economic = this.context.economicConstraints;
        if (economic.economic_indicators?.gdp_growth < 0.02) {
            urgentNeeds.push({
                area: 'economic_technology',
                priority: 0.9,
                reason: 'Low economic growth requires technological innovation',
                technologies: ['automation', 'artificial_intelligence', 'biotechnology'],
                timeline: 'short_term'
            });
        }
        
        // Military threats
        const military = this.context.militaryNeeds;
        if (military.threat_assessment_level > 0.7) {
            urgentNeeds.push({
                area: 'defense_technology',
                priority: 0.95,
                reason: 'High threat level requires advanced defense capabilities',
                technologies: ['artificial_intelligence', 'quantum_computing', 'space_exploration'],
                timeline: 'immediate'
            });
        }
        
        // Social challenges
        const social = this.context.socialChallenges;
        if (social.social_stability < 0.6) {
            urgentNeeds.push({
                area: 'social_technology',
                priority: 0.8,
                reason: 'Social instability requires technological solutions',
                technologies: ['biotechnology', 'artificial_intelligence'],
                timeline: 'short_term'
            });
        }
        
        // Environmental pressures
        const environmental = this.context.environmentalPressures;
        if (environmental.sustainability_index < 0.5) {
            urgentNeeds.push({
                area: 'environmental_technology',
                priority: 0.85,
                reason: 'Environmental challenges require sustainable technologies',
                technologies: ['renewable_energy', 'nanotechnology'],
                timeline: 'medium_term'
            });
        }
        
        return urgentNeeds;
    }

    identifyStrategicResearchNeeds() {
        const strategicNeeds = [];
        
        // Future competitiveness
        strategicNeeds.push({
            area: 'next_generation_computing',
            priority: 0.7,
            reason: 'Quantum computing will revolutionize multiple sectors',
            technologies: ['quantum_computing'],
            timeline: 'long_term',
            expectedImpact: 0.9
        });
        
        // Space expansion
        strategicNeeds.push({
            area: 'space_capabilities',
            priority: 0.6,
            reason: 'Space exploration opens new frontiers and resources',
            technologies: ['space_exploration'],
            timeline: 'long_term',
            expectedImpact: 0.8
        });
        
        // Advanced materials
        strategicNeeds.push({
            area: 'advanced_materials',
            priority: 0.65,
            reason: 'Nanotechnology enables breakthrough applications',
            technologies: ['nanotechnology'],
            timeline: 'medium_term',
            expectedImpact: 0.75
        });
        
        return strategicNeeds;
    }

    identifyOpportunisticResearch() {
        const opportunities = [];
        
        // Economic opportunities
        const economic = this.context.economicConstraints;
        if (economic.economic_indicators?.innovation_index > 0.7) {
            opportunities.push({
                area: 'innovation_acceleration',
                priority: 0.6,
                reason: 'High innovation capacity enables rapid development',
                technologies: ['artificial_intelligence', 'biotechnology'],
                expectedROI: 0.8
            });
        }
        
        // Resource abundance
        if (economic.fiscal_status?.budget_surplus > 0.05) {
            opportunities.push({
                area: 'moonshot_projects',
                priority: 0.5,
                reason: 'Budget surplus allows high-risk, high-reward research',
                technologies: ['quantum_computing', 'space_exploration'],
                expectedROI: 0.6
            });
        }
        
        return opportunities;
    }

    identifyCollaborationOpportunities() {
        const collaborations = [];
        
        // International cooperation
        if (this.processingConfig.collaborationOpenness > 0.6) {
            collaborations.push({
                type: 'international_research',
                areas: ['space_exploration', 'renewable_energy'],
                benefits: ['cost_sharing', 'knowledge_exchange', 'risk_distribution'],
                requirements: ['diplomatic_agreements', 'technology_sharing_protocols']
            });
        }
        
        // Academic partnerships
        collaborations.push({
            type: 'academic_collaboration',
            areas: ['artificial_intelligence', 'biotechnology'],
            benefits: ['talent_development', 'basic_research_advancement'],
            requirements: ['education_investment', 'research_infrastructure']
        });
        
        return collaborations;
    }

    async assessResearchPortfolio(gameAnalysis) {
        const assessment = {
            currentProjects: this.evaluateCurrentProjects(),
            resourceUtilization: this.assessResourceUtilization(),
            portfolioBalance: this.analyzePortfolioBalance(),
            performanceMetrics: this.calculatePerformanceMetrics(),
            gapAnalysis: this.performGapAnalysis(),
            riskAssessment: this.assessPortfolioRisk()
        };
        
        return assessment;
    }

    evaluateCurrentProjects() {
        const projects = [];
        
        for (const [techId, project] of this.researchState.activeTechnologies) {
            const domain = this.technologyDomains[techId];
            if (domain) {
                projects.push({
                    technology: techId,
                    progress: project.progress || 0.3,
                    efficiency: project.efficiency || 0.7,
                    expectedCompletion: project.expectedCompletion || Date.now() + 365 * 24 * 60 * 60 * 1000,
                    resourceConsumption: project.resourceConsumption || 0.1,
                    breakthroughPotential: domain.impact * domain.difficulty
                });
            }
        }
        
        return projects;
    }

    assessResourceUtilization() {
        const totalBudget = Object.values(this.researchState.budgetAllocation)
            .reduce((sum, val) => sum + val, 0);
        
        return {
            budgetUtilization: totalBudget,
            capacityUtilization: this.researchState.researchCapacity,
            efficiency: this.researchState.researchEfficiency,
            bottlenecks: this.identifyResourceBottlenecks()
        };
    }

    identifyResourceBottlenecks() {
        const bottlenecks = [];
        
        if (this.researchState.researchCapacity < 0.5) {
            bottlenecks.push('insufficient_research_capacity');
        }
        
        if (this.researchState.budgetAllocation.infrastructure < 0.1) {
            bottlenecks.push('inadequate_infrastructure');
        }
        
        if (this.researchState.collaborationIndex < 0.4) {
            bottlenecks.push('limited_collaboration');
        }
        
        return bottlenecks;
    }

    analyzePortfolioBalance() {
        const balance = {
            riskDistribution: this.calculateRiskDistribution(),
            timeHorizonBalance: this.calculateTimeHorizonBalance(),
            applicationBalance: this.calculateApplicationBalance(),
            recommendedAdjustments: []
        };
        
        // Analyze balance and recommend adjustments
        if (balance.riskDistribution.high > 0.6) {
            balance.recommendedAdjustments.push('reduce_high_risk_projects');
        }
        
        if (balance.timeHorizonBalance.short_term < 0.3) {
            balance.recommendedAdjustments.push('increase_short_term_projects');
        }
        
        return balance;
    }

    calculateRiskDistribution() {
        const projects = this.evaluateCurrentProjects();
        const riskLevels = { low: 0, medium: 0, high: 0 };
        
        projects.forEach(project => {
            const domain = this.technologyDomains[project.technology];
            if (domain) {
                if (domain.difficulty > 0.8) riskLevels.high++;
                else if (domain.difficulty > 0.6) riskLevels.medium++;
                else riskLevels.low++;
            }
        });
        
        const total = projects.length || 1;
        return {
            low: riskLevels.low / total,
            medium: riskLevels.medium / total,
            high: riskLevels.high / total
        };
    }

    calculateTimeHorizonBalance() {
        return {
            short_term: 0.4,  // Projects completing within 1 year
            medium_term: 0.4, // Projects completing within 2-3 years
            long_term: 0.2    // Projects completing beyond 3 years
        };
    }

    calculateApplicationBalance() {
        return {
            military: this.researchState.focusAreas.military,
            economic: this.researchState.focusAreas.economic,
            social: this.researchState.focusAreas.social,
            environmental: this.researchState.focusAreas.environmental,
            space: this.researchState.focusAreas.space
        };
    }

    calculatePerformanceMetrics() {
        return {
            innovationRate: this.researchState.innovationRate,
            researchEfficiency: this.researchState.researchEfficiency,
            technologyTransferRate: this.researchState.technologyTransferRate,
            breakthroughsPerYear: this.estimateBreakthroughsPerYear(),
            returnOnInvestment: this.calculateResearchROI()
        };
    }

    estimateBreakthroughsPerYear() {
        let totalBreakthroughPotential = 0;
        
        for (const [techId, potential] of this.researchState.breakthroughPotential) {
            totalBreakthroughPotential += potential;
        }
        
        return totalBreakthroughPotential * this.researchState.innovationRate;
    }

    calculateResearchROI() {
        // Simplified ROI calculation based on economic impact
        const economic = this.context.economicConstraints;
        const gdpGrowth = economic.economic_indicators?.gdp_growth || 0.02;
        const researchSpending = this.researchState.budgetAllocation.basic_research + 
                                this.researchState.budgetAllocation.applied_research;
        
        return gdpGrowth / Math.max(0.01, researchSpending);
    }

    performGapAnalysis() {
        const gaps = [];
        
        // Technology gaps compared to needs
        const urgentNeeds = this.identifyUrgentResearchNeeds();
        
        urgentNeeds.forEach(need => {
            need.technologies.forEach(tech => {
                if (!this.researchState.activeTechnologies.has(tech)) {
                    gaps.push({
                        technology: tech,
                        urgency: need.priority,
                        reason: need.reason,
                        recommendedAction: 'initiate_research_program'
                    });
                }
            });
        });
        
        return gaps;
    }

    assessPortfolioRisk() {
        const risks = [];
        
        // Concentration risk
        const focusAreas = Object.values(this.researchState.focusAreas);
        const maxFocus = Math.max(...focusAreas);
        
        if (maxFocus > 0.5) {
            risks.push({
                type: 'concentration_risk',
                severity: maxFocus - 0.5,
                description: 'Over-concentration in single research area',
                mitigation: 'diversify_research_portfolio'
            });
        }
        
        // Resource risk
        if (this.researchState.researchCapacity < 0.4) {
            risks.push({
                type: 'capacity_risk',
                severity: 0.4 - this.researchState.researchCapacity,
                description: 'Insufficient research capacity',
                mitigation: 'increase_research_infrastructure'
            });
        }
        
        // Collaboration risk
        if (this.researchState.collaborationIndex < 0.3) {
            risks.push({
                type: 'isolation_risk',
                severity: 0.3 - this.researchState.collaborationIndex,
                description: 'Limited international collaboration',
                mitigation: 'enhance_research_partnerships'
            });
        }
        
        return risks;
    }

    async generateResearchStrategy(needsAnalysis, portfolioAssessment) {
        const strategy = {
            priorityAdjustments: this.adjustResearchPriorities(needsAnalysis),
            budgetReallocation: this.optimizeBudgetAllocation(needsAnalysis, portfolioAssessment),
            newProjects: this.recommendNewProjects(needsAnalysis, portfolioAssessment),
            collaborationStrategy: this.developCollaborationStrategy(needsAnalysis),
            riskMitigation: this.developRiskMitigation(portfolioAssessment),
            performanceTargets: this.setPerformanceTargets(portfolioAssessment)
        };
        
        return strategy;
    }

    adjustResearchPriorities(needsAnalysis) {
        const newPriorities = [...this.researchState.researchPriorities];
        
        // Elevate urgent technologies
        needsAnalysis.urgent.forEach(need => {
            need.technologies.forEach(tech => {
                if (!newPriorities.includes(tech)) {
                    newPriorities.unshift(tech); // Add to front
                }
            });
        });
        
        // Add strategic technologies
        needsAnalysis.strategic.forEach(need => {
            need.technologies.forEach(tech => {
                if (!newPriorities.includes(tech)) {
                    newPriorities.push(tech);
                }
            });
        });
        
        return newPriorities.slice(0, 8); // Keep top 8 priorities
    }

    optimizeBudgetAllocation(needsAnalysis, portfolioAssessment) {
        const allocation = { ...this.researchState.budgetAllocation };
        
        // Increase applied research if urgent needs exist
        if (needsAnalysis.urgent.length > 0) {
            allocation.applied_research += 0.1;
            allocation.basic_research -= 0.05;
            allocation.development += 0.05;
            allocation.infrastructure -= 0.1;
        }
        
        // Increase infrastructure if capacity is low
        if (portfolioAssessment.resourceUtilization.capacityUtilization < 0.5) {
            allocation.infrastructure += 0.1;
            allocation.basic_research -= 0.05;
            allocation.applied_research -= 0.05;
        }
        
        // Normalize to ensure sum equals 1
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        Object.keys(allocation).forEach(key => {
            allocation[key] = Math.max(0.05, allocation[key] / total); // Minimum 5% per category
        });
        
        return allocation;
    }

    recommendNewProjects(needsAnalysis, portfolioAssessment) {
        const newProjects = [];
        
        // Projects for urgent needs
        needsAnalysis.urgent.forEach(need => {
            need.technologies.forEach(tech => {
                if (!this.researchState.activeTechnologies.has(tech)) {
                    const domain = this.technologyDomains[tech];
                    if (domain) {
                        newProjects.push({
                            technology: tech,
                            priority: need.priority,
                            timeline: need.timeline,
                            expectedDuration: this.estimateProjectDuration(domain),
                            resourceRequirement: this.estimateResourceRequirement(domain),
                            expectedImpact: domain.impact,
                            riskLevel: domain.difficulty
                        });
                    }
                }
            });
        });
        
        // Fill gaps identified in portfolio assessment
        portfolioAssessment.gapAnalysis.forEach(gap => {
            if (!newProjects.some(p => p.technology === gap.technology)) {
                const domain = this.technologyDomains[gap.technology];
                if (domain) {
                    newProjects.push({
                        technology: gap.technology,
                        priority: gap.urgency,
                        timeline: 'medium_term',
                        expectedDuration: this.estimateProjectDuration(domain),
                        resourceRequirement: this.estimateResourceRequirement(domain),
                        expectedImpact: domain.impact,
                        riskLevel: domain.difficulty
                    });
                }
            }
        });
        
        return newProjects.slice(0, 5); // Limit to 5 new projects
    }

    estimateProjectDuration(domain) {
        // Duration in months based on difficulty
        return Math.ceil(domain.difficulty * 36 + 12); // 12-48 months
    }

    estimateResourceRequirement(domain) {
        // Resource requirement as fraction of total research budget
        return domain.difficulty * 0.3 + 0.1; // 10-40% of budget
    }

    developCollaborationStrategy(needsAnalysis) {
        const strategy = {
            internationalPartnerships: [],
            academicCollaborations: [],
            industryPartnerships: [],
            resourceSharing: []
        };
        
        // International partnerships for expensive projects
        needsAnalysis.collaborative.forEach(collab => {
            if (collab.type === 'international_research') {
                strategy.internationalPartnerships.push({
                    areas: collab.areas,
                    benefits: collab.benefits,
                    requirements: collab.requirements,
                    priority: 0.7
                });
            }
        });
        
        // Academic collaborations for basic research
        strategy.academicCollaborations.push({
            focus: 'basic_research_advancement',
            areas: ['artificial_intelligence', 'quantum_computing'],
            benefits: ['talent_pipeline', 'knowledge_exchange'],
            investment: 0.05 // 5% of research budget
        });
        
        return strategy;
    }

    developRiskMitigation(portfolioAssessment) {
        const mitigation = [];
        
        portfolioAssessment.riskAssessment.forEach(risk => {
            mitigation.push({
                riskType: risk.type,
                severity: risk.severity,
                mitigationStrategy: risk.mitigation,
                implementationCost: this.estimateMitigationCost(risk),
                timeline: this.estimateMitigationTimeline(risk)
            });
        });
        
        return mitigation;
    }

    estimateMitigationCost(risk) {
        const costMap = {
            'concentration_risk': 0.02,
            'capacity_risk': 0.1,
            'isolation_risk': 0.05
        };
        
        return costMap[risk.type] || 0.03;
    }

    estimateMitigationTimeline(risk) {
        const timelineMap = {
            'concentration_risk': 'short_term',
            'capacity_risk': 'medium_term',
            'isolation_risk': 'short_term'
        };
        
        return timelineMap[risk.type] || 'medium_term';
    }

    setPerformanceTargets(portfolioAssessment) {
        const current = portfolioAssessment.performanceMetrics;
        
        return {
            innovationRate: Math.min(1.0, current.innovationRate + 0.1),
            researchEfficiency: Math.min(1.0, current.researchEfficiency + 0.05),
            technologyTransferRate: Math.min(1.0, current.technologyTransferRate + 0.08),
            breakthroughsPerYear: current.breakthroughsPerYear + 0.5,
            returnOnInvestment: current.returnOnInvestment + 0.2
        };
    }

    generateResearchDecisions(researchStrategy) {
        return {
            // Technology System Inputs
            research_investment_level: this.calculateResearchInvestmentLevel(researchStrategy),
            innovation_focus_areas: this.calculateInnovationFocusAreas(researchStrategy),
            technology_transfer_rate: this.calculateTechnologyTransferRate(researchStrategy),
            
            // Economic System Inputs
            research_spending_ratio: this.calculateResearchSpendingRatio(researchStrategy),
            innovation_productivity_bonus: this.calculateInnovationProductivityBonus(researchStrategy),
            
            // Military System Inputs
            defense_technology_priority: this.calculateDefenseTechnologyPriority(researchStrategy),
            military_research_allocation: this.calculateMilitaryResearchAllocation(researchStrategy),
            
            // Policy System Inputs
            science_policy_priority: this.calculateSciencePolicyPriority(researchStrategy),
            international_research_cooperation: this.calculateInternationalCooperation(researchStrategy),
            
            // Population System Inputs
            education_technology_integration: this.calculateEducationTechIntegration(researchStrategy),
            
            // General Research Metrics
            overall_innovation_rate: this.researchState.innovationRate,
            research_efficiency: this.researchState.researchEfficiency,
            breakthrough_potential: this.calculateOverallBreakthroughPotential()
        };
    }

    // Helper methods for decision calculation
    calculateResearchInvestmentLevel(strategy) {
        const totalBudget = Object.values(strategy.budgetReallocation)
            .reduce((sum, val) => sum + val, 0);
        
        return Math.min(1.0, totalBudget + 0.1); // Slight increase from current
    }

    calculateInnovationFocusAreas(strategy) {
        return {
            artificial_intelligence: strategy.priorityAdjustments.includes('artificial_intelligence') ? 0.3 : 0.2,
            biotechnology: strategy.priorityAdjustments.includes('biotechnology') ? 0.25 : 0.15,
            space_exploration: strategy.priorityAdjustments.includes('space_exploration') ? 0.2 : 0.1,
            quantum_computing: strategy.priorityAdjustments.includes('quantum_computing') ? 0.15 : 0.05,
            renewable_energy: strategy.priorityAdjustments.includes('renewable_energy') ? 0.1 : 0.05
        };
    }

    calculateTechnologyTransferRate(strategy) {
        let transferRate = this.researchState.technologyTransferRate;
        
        // Collaboration increases transfer rate
        if (strategy.collaborationStrategy.internationalPartnerships.length > 0) {
            transferRate += 0.1;
        }
        
        if (strategy.collaborationStrategy.industryPartnerships.length > 0) {
            transferRate += 0.05;
        }
        
        return Math.min(1.0, transferRate);
    }

    calculateResearchSpendingRatio(strategy) {
        return strategy.budgetReallocation.basic_research + 
               strategy.budgetReallocation.applied_research;
    }

    calculateInnovationProductivityBonus(strategy) {
        return this.researchState.innovationRate * 0.5; // Innovation contributes to productivity
    }

    calculateDefenseTechnologyPriority(strategy) {
        return this.researchState.focusAreas.military;
    }

    calculateMilitaryResearchAllocation(strategy) {
        return this.researchState.focusAreas.military * 
               (strategy.budgetReallocation.applied_research + strategy.budgetReallocation.development);
    }

    calculateSciencePolicyPriority(strategy) {
        const urgentNeeds = strategy.newProjects.filter(p => p.priority > 0.8).length;
        return Math.min(1.0, 0.5 + urgentNeeds * 0.1);
    }

    calculateInternationalCooperation(strategy) {
        return strategy.collaborationStrategy.internationalPartnerships.length > 0 ? 0.8 : 0.4;
    }

    calculateEducationTechIntegration(strategy) {
        return strategy.priorityAdjustments.includes('artificial_intelligence') ? 0.7 : 0.5;
    }

    calculateOverallBreakthroughPotential() {
        let totalPotential = 0;
        let count = 0;
        
        for (const [techId, potential] of this.researchState.breakthroughPotential) {
            totalPotential += potential;
            count++;
        }
        
        return count > 0 ? totalPotential / count : 0.5;
    }

    updateResearchState(needsAnalysis, portfolioAssessment, researchStrategy) {
        // Update priorities
        this.researchState.researchPriorities = researchStrategy.priorityAdjustments;
        
        // Update budget allocation
        this.researchState.budgetAllocation = researchStrategy.budgetReallocation;
        
        // Update performance metrics based on strategy
        this.researchState.innovationRate = Math.min(1.0, 
            this.researchState.innovationRate + 0.02);
        
        this.researchState.researchEfficiency = Math.min(1.0,
            this.researchState.researchEfficiency + 0.01);
        
        // Update collaboration index
        if (researchStrategy.collaborationStrategy.internationalPartnerships.length > 0) {
            this.researchState.collaborationIndex = Math.min(1.0,
                this.researchState.collaborationIndex + 0.05);
        }
        
        // Add new projects to active technologies
        researchStrategy.newProjects.forEach(project => {
            this.researchState.activeTechnologies.set(project.technology, {
                progress: 0.1,
                priority: project.priority,
                startDate: Date.now(),
                expectedCompletion: Date.now() + project.expectedDuration * 30 * 24 * 60 * 60 * 1000
            });
            
            // Set breakthrough potential
            const domain = this.technologyDomains[project.technology];
            if (domain) {
                this.researchState.breakthroughPotential.set(project.technology, 
                    domain.impact * domain.difficulty);
            }
        });
        
        this.researchState.lastUpdate = Date.now();
    }

    generateFallbackDecisions() {
        return {
            research_investment_level: 0.6,
            innovation_focus_areas: {
                artificial_intelligence: 0.2,
                biotechnology: 0.15,
                space_exploration: 0.1,
                quantum_computing: 0.05,
                renewable_energy: 0.05
            },
            technology_transfer_rate: 0.6,
            research_spending_ratio: 0.6,
            innovation_productivity_bonus: 0.2,
            defense_technology_priority: 0.2,
            military_research_allocation: 0.12,
            science_policy_priority: 0.5,
            international_research_cooperation: 0.4,
            education_technology_integration: 0.5,
            overall_innovation_rate: 0.4,
            research_efficiency: 0.7,
            breakthrough_potential: 0.5
        };
    }

    // Context management
    addContext(contextData, metadata = {}) {
        if (contextData.economic_indicators) {
            this.context.economicConstraints = contextData.economic_indicators;
        }
        
        if (contextData.military_needs) {
            this.context.militaryNeeds = contextData.military_needs;
        }
        
        if (contextData.social_challenges) {
            this.context.socialChallenges = contextData.social_challenges;
        }
        
        if (contextData.environmental_data) {
            this.context.environmentalPressures = contextData.environmental_data;
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
            innovationRate: this.researchState.innovationRate,
            researchEfficiency: this.researchState.researchEfficiency,
            activeProjects: this.researchState.activeTechnologies.size,
            researchPriorities: this.researchState.researchPriorities,
            collaborationIndex: this.researchState.collaborationIndex,
            lastUpdate: this.researchState.lastUpdate
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
        this.researchState.activeTechnologies.clear();
        this.researchState.technologyReadinessLevels.clear();
        this.researchState.breakthroughPotential.clear();
        this.researchState.longTermProjects = [];
        this.researchState.emergencyResearch = [];
        this.researchState.collaborativeProjects = [];
        
        console.log(`🔬 Research AI destroyed for ${this.civilizationId}`);
    }
}

module.exports = { ResearchAI };
