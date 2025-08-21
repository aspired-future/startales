// Technology System - Research and development, innovation management, and technological advancement
// Provides comprehensive technology capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class TechnologySystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('technology-system', config);
        
        // System state
        this.state = {
            // Overall Technology Metrics
            overallTechLevel: 0.6, // 0-1 scale
            innovationRate: 0.4,
            researchCapacity: 0.5,
            technologyTransferRate: 0.3,
            
            // Research & Development
            rdBudget: 5000000000, // $5B
            rdPersonnel: 50000,
            researchInstitutions: 25,
            
            // Technology Domains
            technologyDomains: {
                artificial_intelligence: {
                    level: 0.7,
                    investment: 0.2,
                    breakthrough_potential: 0.8,
                    applications: ['automation', 'decision_support', 'optimization'],
                    maturity: 'emerging'
                },
                biotechnology: {
                    level: 0.6,
                    investment: 0.15,
                    breakthrough_potential: 0.7,
                    applications: ['medicine', 'agriculture', 'materials'],
                    maturity: 'developing'
                },
                space_technology: {
                    level: 0.5,
                    investment: 0.1,
                    breakthrough_potential: 0.6,
                    applications: ['exploration', 'communication', 'resources'],
                    maturity: 'developing'
                },
                quantum_computing: {
                    level: 0.3,
                    investment: 0.08,
                    breakthrough_potential: 0.9,
                    applications: ['cryptography', 'simulation', 'optimization'],
                    maturity: 'experimental'
                },
                nanotechnology: {
                    level: 0.4,
                    investment: 0.1,
                    breakthrough_potential: 0.75,
                    applications: ['manufacturing', 'medicine', 'electronics'],
                    maturity: 'emerging'
                },
                renewable_energy: {
                    level: 0.7,
                    investment: 0.12,
                    breakthrough_potential: 0.6,
                    applications: ['power_generation', 'storage', 'efficiency'],
                    maturity: 'mature'
                },
                cybersecurity: {
                    level: 0.8,
                    investment: 0.15,
                    breakthrough_potential: 0.7,
                    applications: ['defense', 'privacy', 'infrastructure'],
                    maturity: 'mature'
                },
                advanced_materials: {
                    level: 0.55,
                    investment: 0.1,
                    breakthrough_potential: 0.65,
                    applications: ['construction', 'aerospace', 'electronics'],
                    maturity: 'developing'
                }
            },
            
            // Research Projects
            activeProjects: new Map(),
            completedProjects: [],
            
            // Innovation Ecosystem
            startupEcosystem: {
                active_startups: 500,
                funding_available: 2000000000,
                success_rate: 0.15,
                innovation_index: 0.6
            },
            
            // Technology Transfer
            technologyTransfer: {
                university_partnerships: 15,
                industry_collaborations: 30,
                international_agreements: 8,
                patent_applications: 1200,
                patent_grants: 800
            },
            
            // Infrastructure
            researchInfrastructure: {
                laboratories: 150,
                supercomputers: 5,
                research_facilities: 75,
                testing_centers: 40,
                data_centers: 20
            },
            
            // Human Capital
            humanCapital: {
                researchers: 50000,
                engineers: 80000,
                technicians: 120000,
                phd_graduates_per_year: 2000,
                stem_education_index: 0.7
            },
            
            // International Cooperation
            internationalCooperation: {
                research_partnerships: 25,
                joint_projects: 12,
                researcher_exchanges: 500,
                technology_sharing_agreements: 8
            },
            
            // Technology Assessment
            emergingTechnologies: [],
            technologyRisks: [],
            ethicalConsiderations: new Map(),
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('research_investment_level', 'float', 0.6, 
            'Overall research and development investment level', 0.0, 1.0);
        
        this.addInputKnob('innovation_focus_areas', 'object', {
            artificial_intelligence: 0.2, biotechnology: 0.15, space_technology: 0.1,
            quantum_computing: 0.08, nanotechnology: 0.1, renewable_energy: 0.12,
            cybersecurity: 0.15, advanced_materials: 0.1
        }, 'Investment allocation across technology domains');
        
        this.addInputKnob('technology_transfer_rate', 'float', 0.6, 
            'Rate of technology transfer from research to application', 0.0, 1.0);
        
        this.addInputKnob('research_spending_ratio', 'float', 0.03, 
            'Research spending as percentage of GDP', 0.01, 0.1);
        
        this.addInputKnob('innovation_productivity_bonus', 'float', 0.2, 
            'Innovation contribution to economic productivity', 0.0, 0.5);
        
        this.addInputKnob('international_research_cooperation', 'float', 0.4, 
            'Level of international research collaboration', 0.0, 1.0);
        
        this.addInputKnob('education_technology_integration', 'float', 0.5, 
            'Integration of technology in education systems', 0.0, 1.0);
        
        this.addInputKnob('startup_ecosystem_support', 'float', 0.6, 
            'Government support for technology startups', 0.0, 1.0);
        
        this.addInputKnob('technology_ethics_oversight', 'float', 0.5, 
            'Level of ethical oversight for emerging technologies', 0.0, 1.0);
        
        this.addInputKnob('open_science_policy', 'float', 0.4, 
            'Commitment to open science and data sharing', 0.0, 1.0);
        
        this.addInputKnob('technology_security_measures', 'float', 0.7, 
            'Security measures for protecting critical technologies', 0.0, 1.0);
        
        this.addInputKnob('green_technology_priority', 'float', 0.6, 
            'Priority given to environmentally sustainable technologies', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('technology_metrics', 'object', 
            'Current technology level and innovation indicators');
        
        this.addOutputChannel('research_development', 'object', 
            'Research and development activities and outcomes');
        
        this.addOutputChannel('innovation_ecosystem', 'object', 
            'Innovation ecosystem health and startup activity');
        
        this.addOutputChannel('technology_domains', 'object', 
            'Status and progress of different technology domains');
        
        this.addOutputChannel('technology_transfer', 'object', 
            'Technology commercialization and transfer activities');
        
        this.addOutputChannel('research_infrastructure', 'object', 
            'Research infrastructure capacity and utilization');
        
        this.addOutputChannel('human_capital', 'object', 
            'Science and technology human resources');
        
        this.addOutputChannel('technology_forecast', 'object', 
            'Technology trends and future projections');
        
        console.log('🔬 Technology System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update research investment and allocation
            this.updateResearchInvestment(aiInputs);
            
            // Process technology domain development
            this.processTechnologyDomains(aiInputs);
            
            // Update innovation ecosystem
            this.updateInnovationEcosystem(aiInputs);
            
            // Process research projects
            this.processResearchProjects(aiInputs);
            
            // Update technology transfer
            this.updateTechnologyTransfer(aiInputs);
            
            // Process international cooperation
            this.processInternationalCooperation(aiInputs);
            
            // Update human capital development
            this.updateHumanCapital(aiInputs);
            
            // Assess emerging technologies and risks
            this.assessEmergingTechnologies(gameState, aiInputs);
            
            // Calculate overall technology metrics
            this.calculateTechnologyMetrics();
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🔬 Technology System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateResearchInvestment(aiInputs) {
        const investmentLevel = aiInputs.research_investment_level || 0.6;
        const spendingRatio = aiInputs.research_spending_ratio || 0.03;
        
        // Update R&D budget based on investment level and GDP
        const baseGDP = 1000000000000; // $1T baseline
        this.state.rdBudget = baseGDP * spendingRatio * investmentLevel;
        
        // Update research capacity based on investment
        this.state.researchCapacity = Math.min(1.0, 
            0.3 + investmentLevel * 0.6);
        
        // Allocate budget across domains
        this.allocateDomainInvestment(aiInputs);
    }

    allocateDomainInvestment(aiInputs) {
        const focusAreas = aiInputs.innovation_focus_areas || {};
        
        Object.keys(this.state.technologyDomains).forEach(domain => {
            if (focusAreas[domain] !== undefined) {
                this.state.technologyDomains[domain].investment = focusAreas[domain];
            }
        });
        
        // Normalize investments to sum to 1
        const totalInvestment = Object.values(this.state.technologyDomains)
            .reduce((sum, domain) => sum + domain.investment, 0);
        
        if (totalInvestment > 0) {
            Object.keys(this.state.technologyDomains).forEach(domain => {
                this.state.technologyDomains[domain].investment /= totalInvestment;
            });
        }
    }

    processTechnologyDomains(aiInputs) {
        const greenTechPriority = aiInputs.green_technology_priority || 0.6;
        
        Object.entries(this.state.technologyDomains).forEach(([domainName, domain]) => {
            // Calculate development rate based on investment and breakthrough potential
            const developmentRate = domain.investment * domain.breakthrough_potential * 0.1;
            
            // Apply green technology bonus
            if (this.isGreenTechnology(domainName)) {
                const greenBonus = greenTechPriority * 0.05;
                domain.level = Math.min(1.0, domain.level + developmentRate + greenBonus);
            } else {
                domain.level = Math.min(1.0, domain.level + developmentRate);
            }
            
            // Update maturity based on level
            domain.maturity = this.calculateMaturity(domain.level);
            
            // Generate breakthroughs
            this.processBreakthroughs(domainName, domain);
        });
    }

    isGreenTechnology(domainName) {
        const greenTechs = ['renewable_energy', 'nanotechnology', 'advanced_materials'];
        return greenTechs.includes(domainName);
    }

    calculateMaturity(level) {
        if (level > 0.8) return 'mature';
        if (level > 0.6) return 'developing';
        if (level > 0.4) return 'emerging';
        return 'experimental';
    }

    processBreakthroughs(domainName, domain) {
        // Calculate breakthrough probability
        const breakthroughProb = domain.investment * domain.breakthrough_potential * 0.02;
        
        if (Math.random() < breakthroughProb) {
            const breakthrough = this.generateBreakthrough(domainName, domain);
            
            // Apply breakthrough effects
            domain.level = Math.min(1.0, domain.level + breakthrough.impact);
            
            // Add to completed projects
            this.state.completedProjects.push({
                name: breakthrough.name,
                domain: domainName,
                impact: breakthrough.impact,
                applications: breakthrough.applications,
                completionDate: Date.now()
            });
            
            console.log(`🔬 Breakthrough in ${domainName}: ${breakthrough.name}`);
        }
    }

    generateBreakthrough(domainName, domain) {
        const breakthroughs = {
            artificial_intelligence: [
                { name: 'Advanced Neural Architecture', impact: 0.15, applications: ['automation', 'prediction'] },
                { name: 'Quantum-AI Hybrid System', impact: 0.2, applications: ['optimization', 'simulation'] },
                { name: 'Autonomous Learning Algorithm', impact: 0.12, applications: ['adaptation', 'self_improvement'] }
            ],
            biotechnology: [
                { name: 'Gene Therapy Breakthrough', impact: 0.18, applications: ['medicine', 'longevity'] },
                { name: 'Synthetic Biology Platform', impact: 0.15, applications: ['manufacturing', 'environment'] },
                { name: 'Personalized Medicine System', impact: 0.12, applications: ['healthcare', 'diagnostics'] }
            ],
            quantum_computing: [
                { name: 'Fault-Tolerant Quantum Processor', impact: 0.25, applications: ['cryptography', 'simulation'] },
                { name: 'Quantum Internet Protocol', impact: 0.2, applications: ['communication', 'security'] },
                { name: 'Quantum Error Correction', impact: 0.15, applications: ['reliability', 'scaling'] }
            ],
            space_technology: [
                { name: 'Fusion Propulsion System', impact: 0.3, applications: ['exploration', 'transportation'] },
                { name: 'Space Manufacturing Platform', impact: 0.2, applications: ['production', 'materials'] },
                { name: 'Asteroid Mining Technology', impact: 0.25, applications: ['resources', 'economy'] }
            ],
            renewable_energy: [
                { name: 'Ultra-Efficient Solar Cells', impact: 0.15, applications: ['power_generation', 'efficiency'] },
                { name: 'Advanced Energy Storage', impact: 0.18, applications: ['grid_stability', 'storage'] },
                { name: 'Fusion Power Breakthrough', impact: 0.4, applications: ['clean_energy', 'abundance'] }
            ]
        };
        
        const domainBreakthroughs = breakthroughs[domainName] || [
            { name: 'Generic Technology Advance', impact: 0.1, applications: ['general'] }
        ];
        
        return domainBreakthroughs[Math.floor(Math.random() * domainBreakthroughs.length)];
    }

    updateInnovationEcosystem(aiInputs) {
        const startupSupport = aiInputs.startup_ecosystem_support || 0.6;
        const openSciencePolicy = aiInputs.open_science_policy || 0.4;
        
        // Update startup ecosystem
        const ecosystem = this.state.startupEcosystem;
        
        // Startup growth based on support level
        const growthRate = startupSupport * 0.1;
        ecosystem.active_startups = Math.floor(ecosystem.active_startups * (1 + growthRate));
        
        // Funding availability
        ecosystem.funding_available = ecosystem.funding_available * (1 + startupSupport * 0.05);
        
        // Success rate improvement
        ecosystem.success_rate = Math.min(0.3, 
            ecosystem.success_rate + startupSupport * 0.02);
        
        // Innovation index
        ecosystem.innovation_index = Math.min(1.0, 
            0.4 + startupSupport * 0.3 + openSciencePolicy * 0.2);
        
        // Update innovation rate
        this.state.innovationRate = Math.min(1.0, 
            0.2 + ecosystem.innovation_index * 0.5 + this.state.researchCapacity * 0.3);
    }

    processResearchProjects(aiInputs) {
        const transferRate = aiInputs.technology_transfer_rate || 0.6;
        
        // Generate new research projects based on investment
        this.generateNewProjects();
        
        // Update existing projects
        this.updateExistingProjects(transferRate);
        
        // Complete projects and transfer technology
        this.completeProjects(transferRate);
    }

    generateNewProjects() {
        const projectsToGenerate = Math.floor(this.state.researchCapacity * 10);
        
        for (let i = 0; i < projectsToGenerate; i++) {
            if (this.state.activeProjects.size < 50) { // Limit active projects
                const project = this.createResearchProject();
                this.state.activeProjects.set(project.id, project);
            }
        }
    }

    createResearchProject() {
        const domains = Object.keys(this.state.technologyDomains);
        const selectedDomain = domains[Math.floor(Math.random() * domains.length)];
        const domainData = this.state.technologyDomains[selectedDomain];
        
        return {
            id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: this.generateProjectName(selectedDomain),
            domain: selectedDomain,
            progress: 0.0,
            duration: Math.floor(12 + Math.random() * 36), // 1-4 years
            budget: Math.floor(1000000 + Math.random() * 10000000), // $1M-$10M
            team_size: Math.floor(5 + Math.random() * 20),
            risk_level: Math.random(),
            expected_impact: domainData.breakthrough_potential * (0.5 + Math.random() * 0.5),
            start_date: Date.now()
        };
    }

    generateProjectName(domain) {
        const projectNames = {
            artificial_intelligence: ['Neural Network Optimization', 'AI Ethics Framework', 'Autonomous Decision Systems'],
            biotechnology: ['Gene Editing Platform', 'Biomarker Discovery', 'Synthetic Biology Tools'],
            quantum_computing: ['Quantum Algorithm Development', 'Qubit Stabilization', 'Quantum Cryptography'],
            space_technology: ['Propulsion System Design', 'Life Support Innovation', 'Space Habitat Technology'],
            renewable_energy: ['Solar Efficiency Enhancement', 'Battery Technology Advancement', 'Grid Integration Systems'],
            cybersecurity: ['Threat Detection AI', 'Encryption Algorithms', 'Security Protocol Development'],
            nanotechnology: ['Molecular Assembly', 'Nanoparticle Applications', 'Smart Materials Development'],
            advanced_materials: ['Composite Engineering', 'Metamaterial Design', 'Self-Healing Materials']
        };
        
        const names = projectNames[domain] || ['Generic Research Project'];
        return names[Math.floor(Math.random() * names.length)];
    }

    updateExistingProjects(transferRate) {
        for (const [projectId, project] of this.state.activeProjects) {
            // Update project progress
            const progressRate = (1 / project.duration) * (1 + transferRate * 0.5);
            project.progress = Math.min(1.0, project.progress + progressRate);
            
            // Apply risk factors
            if (Math.random() < project.risk_level * 0.02) {
                project.progress = Math.max(0, project.progress - 0.05); // Setback
            }
        }
    }

    completeProjects(transferRate) {
        const completedProjects = [];
        
        for (const [projectId, project] of this.state.activeProjects) {
            if (project.progress >= 1.0) {
                completedProjects.push(projectId);
                
                // Apply project benefits
                this.applyProjectBenefits(project, transferRate);
                
                // Move to completed projects
                this.state.completedProjects.push({
                    ...project,
                    completion_date: Date.now(),
                    success_level: this.calculateProjectSuccess(project)
                });
            }
        }
        
        // Remove completed projects from active list
        completedProjects.forEach(projectId => {
            this.state.activeProjects.delete(projectId);
        });
    }

    applyProjectBenefits(project, transferRate) {
        const domain = this.state.technologyDomains[project.domain];
        if (domain) {
            // Increase domain level
            const levelIncrease = project.expected_impact * transferRate * 0.1;
            domain.level = Math.min(1.0, domain.level + levelIncrease);
            
            // Increase overall tech level
            this.state.overallTechLevel = Math.min(1.0, 
                this.state.overallTechLevel + levelIncrease * 0.1);
        }
    }

    calculateProjectSuccess(project) {
        let success = 0.5; // Base success
        
        // Higher budget increases success probability
        success += Math.min(0.2, project.budget / 50000000); // Up to $50M for max bonus
        
        // Larger teams can be more successful
        success += Math.min(0.15, project.team_size / 100);
        
        // Lower risk increases success
        success += (1 - project.risk_level) * 0.2;
        
        // Research capacity affects success
        success += this.state.researchCapacity * 0.15;
        
        return Math.min(1.0, success);
    }

    updateTechnologyTransfer(aiInputs) {
        const transferRate = aiInputs.technology_transfer_rate || 0.6;
        const openScience = aiInputs.open_science_policy || 0.4;
        
        const transfer = this.state.technologyTransfer;
        
        // Update transfer metrics
        this.state.technologyTransferRate = transferRate;
        
        // University partnerships
        transfer.university_partnerships = Math.floor(10 + transferRate * 20);
        
        // Industry collaborations
        transfer.industry_collaborations = Math.floor(15 + transferRate * 30);
        
        // Patent activity
        const patentActivity = transferRate * this.state.innovationRate;
        transfer.patent_applications = Math.floor(800 + patentActivity * 1000);
        transfer.patent_grants = Math.floor(transfer.patent_applications * 0.7);
        
        // International agreements
        const cooperation = aiInputs.international_research_cooperation || 0.4;
        transfer.international_agreements = Math.floor(5 + cooperation * 10);
    }

    processInternationalCooperation(aiInputs) {
        const cooperationLevel = aiInputs.international_research_cooperation || 0.4;
        
        const cooperation = this.state.internationalCooperation;
        
        // Update cooperation metrics
        cooperation.research_partnerships = Math.floor(15 + cooperationLevel * 20);
        cooperation.joint_projects = Math.floor(5 + cooperationLevel * 15);
        cooperation.researcher_exchanges = Math.floor(200 + cooperationLevel * 600);
        cooperation.technology_sharing_agreements = Math.floor(3 + cooperationLevel * 10);
        
        // Benefits of cooperation
        if (cooperationLevel > 0.6) {
            // Boost innovation rate
            this.state.innovationRate = Math.min(1.0, 
                this.state.innovationRate + 0.05);
            
            // Accelerate technology development
            Object.values(this.state.technologyDomains).forEach(domain => {
                domain.level = Math.min(1.0, domain.level + 0.01);
            });
        }
    }

    updateHumanCapital(aiInputs) {
        const educationIntegration = aiInputs.education_technology_integration || 0.5;
        const investmentLevel = aiInputs.research_investment_level || 0.6;
        
        const humanCapital = this.state.humanCapital;
        
        // Update STEM education index
        humanCapital.stem_education_index = Math.min(1.0, 
            0.5 + educationIntegration * 0.3 + investmentLevel * 0.2);
        
        // Update workforce numbers
        const growthRate = investmentLevel * 0.05;
        humanCapital.researchers = Math.floor(humanCapital.researchers * (1 + growthRate));
        humanCapital.engineers = Math.floor(humanCapital.engineers * (1 + growthRate));
        humanCapital.technicians = Math.floor(humanCapital.technicians * (1 + growthRate));
        
        // PhD graduates
        humanCapital.phd_graduates_per_year = Math.floor(1500 + 
            humanCapital.stem_education_index * 1000);
        
        // Update research personnel
        this.state.rdPersonnel = humanCapital.researchers;
    }

    assessEmergingTechnologies(gameState, aiInputs) {
        const ethicsOversight = aiInputs.technology_ethics_oversight || 0.5;
        const securityMeasures = aiInputs.technology_security_measures || 0.7;
        
        // Identify emerging technologies
        this.identifyEmergingTechnologies();
        
        // Assess technology risks
        this.assessTechnologyRisks(securityMeasures);
        
        // Update ethical considerations
        this.updateEthicalConsiderations(ethicsOversight);
    }

    identifyEmergingTechnologies() {
        this.state.emergingTechnologies = [];
        
        Object.entries(this.state.technologyDomains).forEach(([domain, data]) => {
            if (data.level > 0.7 && data.maturity === 'emerging') {
                this.state.emergingTechnologies.push({
                    domain,
                    level: data.level,
                    potential_impact: data.breakthrough_potential,
                    applications: data.applications,
                    readiness: this.calculateTechnologyReadiness(data)
                });
            }
        });
    }

    calculateTechnologyReadiness(domainData) {
        // Technology Readiness Level (TRL) 1-9 scale
        const trl = Math.floor(1 + domainData.level * 8);
        
        const readinessLevels = {
            1: 'Basic principles observed',
            2: 'Technology concept formulated',
            3: 'Experimental proof of concept',
            4: 'Technology validated in lab',
            5: 'Technology validated in relevant environment',
            6: 'Technology demonstrated in relevant environment',
            7: 'System prototype demonstration',
            8: 'System complete and qualified',
            9: 'Actual system proven in operational environment'
        };
        
        return {
            level: trl,
            description: readinessLevels[trl]
        };
    }

    assessTechnologyRisks(securityMeasures) {
        this.state.technologyRisks = [];
        
        // AI risks
        if (this.state.technologyDomains.artificial_intelligence.level > 0.7) {
            this.state.technologyRisks.push({
                technology: 'artificial_intelligence',
                risk_type: 'autonomous_systems',
                severity: 0.7,
                mitigation: securityMeasures > 0.6 ? 'adequate' : 'insufficient'
            });
        }
        
        // Quantum computing risks
        if (this.state.technologyDomains.quantum_computing.level > 0.5) {
            this.state.technologyRisks.push({
                technology: 'quantum_computing',
                risk_type: 'cryptographic_vulnerability',
                severity: 0.8,
                mitigation: securityMeasures > 0.7 ? 'adequate' : 'insufficient'
            });
        }
        
        // Biotechnology risks
        if (this.state.technologyDomains.biotechnology.level > 0.6) {
            this.state.technologyRisks.push({
                technology: 'biotechnology',
                risk_type: 'biosafety_concerns',
                severity: 0.6,
                mitigation: securityMeasures > 0.5 ? 'adequate' : 'insufficient'
            });
        }
    }

    updateEthicalConsiderations(ethicsOversight) {
        this.state.ethicalConsiderations.clear();
        
        // AI ethics
        if (this.state.technologyDomains.artificial_intelligence.level > 0.6) {
            this.state.ethicalConsiderations.set('ai_ethics', {
                concerns: ['bias', 'privacy', 'autonomy', 'accountability'],
                oversight_level: ethicsOversight,
                frameworks_in_place: ethicsOversight > 0.6,
                public_engagement: ethicsOversight > 0.7
            });
        }
        
        // Biotechnology ethics
        if (this.state.technologyDomains.biotechnology.level > 0.5) {
            this.state.ethicalConsiderations.set('bioethics', {
                concerns: ['genetic_modification', 'human_enhancement', 'consent'],
                oversight_level: ethicsOversight,
                frameworks_in_place: ethicsOversight > 0.5,
                public_engagement: ethicsOversight > 0.6
            });
        }
    }

    calculateTechnologyMetrics() {
        // Calculate overall technology level
        const domainLevels = Object.values(this.state.technologyDomains)
            .map(domain => domain.level);
        
        this.state.overallTechLevel = domainLevels.reduce((sum, level) => sum + level, 0) / domainLevels.length;
        
        // Update research institutions based on capacity
        this.state.researchInstitutions = Math.floor(15 + this.state.researchCapacity * 20);
        
        // Update infrastructure based on investment
        this.updateResearchInfrastructure();
    }

    updateResearchInfrastructure() {
        const infrastructure = this.state.researchInfrastructure;
        const capacity = this.state.researchCapacity;
        
        infrastructure.laboratories = Math.floor(100 + capacity * 100);
        infrastructure.supercomputers = Math.floor(3 + capacity * 5);
        infrastructure.research_facilities = Math.floor(50 + capacity * 50);
        infrastructure.testing_centers = Math.floor(25 + capacity * 30);
        infrastructure.data_centers = Math.floor(10 + capacity * 20);
    }

    generateOutputs() {
        return {
            technology_metrics: {
                overall_tech_level: this.state.overallTechLevel,
                innovation_rate: this.state.innovationRate,
                research_capacity: this.state.researchCapacity,
                technology_transfer_rate: this.state.technologyTransferRate,
                tech_level_category: this.categorizeTechLevel(this.state.overallTechLevel),
                innovation_index: this.state.startupEcosystem.innovation_index
            },
            
            research_development: {
                rd_budget: this.state.rdBudget,
                rd_personnel: this.state.rdPersonnel,
                research_institutions: this.state.researchInstitutions,
                active_projects: this.state.activeProjects.size,
                completed_projects: this.state.completedProjects.length,
                project_success_rate: this.calculateProjectSuccessRate(),
                research_productivity: this.calculateResearchProductivity()
            },
            
            innovation_ecosystem: {
                ...this.state.startupEcosystem,
                ecosystem_health: this.assessEcosystemHealth(),
                innovation_hubs: this.identifyInnovationHubs(),
                funding_efficiency: this.calculateFundingEfficiency()
            },
            
            technology_domains: {
                domain_status: this.getDomainStatus(),
                leading_domains: this.identifyLeadingDomains(),
                emerging_opportunities: this.identifyEmergingOpportunities(),
                investment_efficiency: this.calculateInvestmentEfficiency()
            },
            
            technology_transfer: {
                ...this.state.technologyTransfer,
                transfer_effectiveness: this.calculateTransferEffectiveness(),
                commercialization_rate: this.calculateCommercializationRate(),
                industry_partnerships: this.assessIndustryPartnerships()
            },
            
            research_infrastructure: {
                ...this.state.researchInfrastructure,
                infrastructure_utilization: this.calculateInfrastructureUtilization(),
                capacity_constraints: this.identifyCapacityConstraints(),
                modernization_needs: this.assessModernizationNeeds()
            },
            
            human_capital: {
                ...this.state.humanCapital,
                talent_pipeline: this.assessTalentPipeline(),
                skill_gaps: this.identifySkillGaps(),
                retention_rate: this.calculateRetentionRate()
            },
            
            technology_forecast: {
                emerging_technologies: this.state.emergingTechnologies,
                technology_risks: this.state.technologyRisks,
                ethical_considerations: Array.from(this.state.ethicalConsiderations.entries()),
                future_projections: this.generateFutureProjections(),
                strategic_recommendations: this.generateStrategicRecommendations()
            }
        };
    }

    categorizeTechLevel(level) {
        if (level > 0.8) return 'advanced';
        if (level > 0.6) return 'developed';
        if (level > 0.4) return 'developing';
        return 'emerging';
    }

    calculateProjectSuccessRate() {
        if (this.state.completedProjects.length === 0) return 0.7;
        
        const successfulProjects = this.state.completedProjects
            .filter(project => project.success_level > 0.6).length;
        
        return successfulProjects / this.state.completedProjects.length;
    }

    calculateResearchProductivity() {
        const outputPerResearcher = this.state.completedProjects.length / 
            Math.max(1, this.state.rdPersonnel / 1000);
        
        return Math.min(1.0, outputPerResearcher / 10); // Normalize
    }

    assessEcosystemHealth() {
        const ecosystem = this.state.startupEcosystem;
        
        return (ecosystem.innovation_index * 0.4 + 
                ecosystem.success_rate * 2 * 0.3 + // Scale success rate
                Math.min(1.0, ecosystem.active_startups / 1000) * 0.3);
    }

    identifyInnovationHubs() {
        return [
            { name: 'Tech Valley', focus: 'artificial_intelligence', strength: 0.8 },
            { name: 'Bio District', focus: 'biotechnology', strength: 0.7 },
            { name: 'Quantum Campus', focus: 'quantum_computing', strength: 0.6 }
        ];
    }

    calculateFundingEfficiency() {
        const ecosystem = this.state.startupEcosystem;
        const successfulFunding = ecosystem.funding_available * ecosystem.success_rate;
        
        return Math.min(1.0, successfulFunding / 1000000000); // Normalize to billions
    }

    getDomainStatus() {
        const status = {};
        
        Object.entries(this.state.technologyDomains).forEach(([domain, data]) => {
            status[domain] = {
                level: data.level,
                investment: data.investment,
                maturity: data.maturity,
                breakthrough_potential: data.breakthrough_potential,
                readiness: this.calculateTechnologyReadiness(data)
            };
        });
        
        return status;
    }

    identifyLeadingDomains() {
        return Object.entries(this.state.technologyDomains)
            .filter(([, data]) => data.level > 0.7)
            .sort(([, a], [, b]) => b.level - a.level)
            .slice(0, 3)
            .map(([domain, data]) => ({ domain, level: data.level }));
    }

    identifyEmergingOpportunities() {
        return Object.entries(this.state.technologyDomains)
            .filter(([, data]) => data.breakthrough_potential > 0.7 && data.level < 0.6)
            .map(([domain, data]) => ({
                domain,
                potential: data.breakthrough_potential,
                current_level: data.level,
                opportunity_score: data.breakthrough_potential - data.level
            }))
            .sort((a, b) => b.opportunity_score - a.opportunity_score);
    }

    calculateInvestmentEfficiency() {
        let totalInvestment = 0;
        let totalProgress = 0;
        
        Object.values(this.state.technologyDomains).forEach(domain => {
            totalInvestment += domain.investment;
            totalProgress += domain.level * domain.investment;
        });
        
        return totalInvestment > 0 ? totalProgress / totalInvestment : 0;
    }

    calculateTransferEffectiveness() {
        const transfer = this.state.technologyTransfer;
        
        // Patents per partnership
        const patentEfficiency = transfer.patent_grants / 
            Math.max(1, transfer.university_partnerships + transfer.industry_collaborations);
        
        return Math.min(1.0, patentEfficiency / 50); // Normalize
    }

    calculateCommercializationRate() {
        const completedProjects = this.state.completedProjects.length;
        const patents = this.state.technologyTransfer.patent_grants;
        
        return completedProjects > 0 ? Math.min(1.0, patents / completedProjects) : 0.3;
    }

    assessIndustryPartnerships() {
        const transfer = this.state.technologyTransfer;
        
        return {
            partnership_count: transfer.industry_collaborations,
            partnership_strength: Math.min(1.0, transfer.industry_collaborations / 50),
            collaboration_effectiveness: this.calculateTransferEffectiveness()
        };
    }

    calculateInfrastructureUtilization() {
        const infrastructure = this.state.researchInfrastructure;
        const personnel = this.state.rdPersonnel;
        
        // Researchers per facility
        const utilizationRate = personnel / 
            (infrastructure.laboratories + infrastructure.research_facilities);
        
        return Math.min(1.0, utilizationRate / 500); // Normalize
    }

    identifyCapacityConstraints() {
        const constraints = [];
        const infrastructure = this.state.researchInfrastructure;
        
        if (infrastructure.laboratories < this.state.rdPersonnel / 300) {
            constraints.push('insufficient_laboratory_space');
        }
        
        if (infrastructure.supercomputers < 3) {
            constraints.push('limited_computational_resources');
        }
        
        if (infrastructure.data_centers < 15) {
            constraints.push('inadequate_data_infrastructure');
        }
        
        return constraints;
    }

    assessModernizationNeeds() {
        return {
            equipment_age: 'moderate', // Would be calculated from actual data
            technology_gaps: this.identifyCapacityConstraints(),
            upgrade_priority: 'high',
            estimated_cost: this.state.rdBudget * 0.2 // 20% of budget for modernization
        };
    }

    assessTalentPipeline() {
        const humanCapital = this.state.humanCapital;
        
        return {
            phd_production_rate: humanCapital.phd_graduates_per_year,
            stem_education_quality: humanCapital.stem_education_index,
            talent_supply_adequacy: this.calculateTalentSupplyAdequacy(),
            international_talent_attraction: this.calculateInternationalTalentAttraction()
        };
    }

    calculateTalentSupplyAdequacy() {
        const humanCapital = this.state.humanCapital;
        const demandGrowth = this.state.innovationRate * 0.1; // 10% growth at max innovation
        const supplyGrowth = humanCapital.phd_graduates_per_year / humanCapital.researchers;
        
        return Math.min(1.0, supplyGrowth / Math.max(0.01, demandGrowth));
    }

    calculateInternationalTalentAttraction() {
        const cooperation = this.state.internationalCooperation;
        return Math.min(1.0, cooperation.researcher_exchanges / 1000);
    }

    identifySkillGaps() {
        const gaps = [];
        
        // AI skills gap
        if (this.state.technologyDomains.artificial_intelligence.level > 0.7) {
            gaps.push({
                area: 'artificial_intelligence',
                severity: 'medium',
                demand_growth: 'high'
            });
        }
        
        // Quantum computing skills gap
        if (this.state.technologyDomains.quantum_computing.level > 0.4) {
            gaps.push({
                area: 'quantum_computing',
                severity: 'high',
                demand_growth: 'very_high'
            });
        }
        
        return gaps;
    }

    calculateRetentionRate() {
        // Simplified calculation based on research environment quality
        const baseRetention = 0.85;
        const environmentBonus = this.state.researchCapacity * 0.1;
        const fundingBonus = Math.min(0.05, this.state.rdBudget / 100000000000); // Per $100B
        
        return Math.min(0.95, baseRetention + environmentBonus + fundingBonus);
    }

    generateFutureProjections() {
        return {
            five_year_tech_level: Math.min(1.0, this.state.overallTechLevel + 0.2),
            breakthrough_probability: this.calculateBreakthroughProbability(),
            emerging_tech_timeline: this.projectEmergingTechTimeline(),
            investment_needs: this.projectInvestmentNeeds()
        };
    }

    calculateBreakthroughProbability() {
        const avgBreakthroughPotential = Object.values(this.state.technologyDomains)
            .reduce((sum, domain) => sum + domain.breakthrough_potential, 0) / 
            Object.keys(this.state.technologyDomains).length;
        
        return avgBreakthroughPotential * this.state.innovationRate;
    }

    projectEmergingTechTimeline() {
        const timeline = {};
        
        Object.entries(this.state.technologyDomains).forEach(([domain, data]) => {
            if (data.level < 0.8) {
                const yearsToMaturity = (0.8 - data.level) / (data.investment * 0.1) * 5;
                timeline[domain] = Math.ceil(yearsToMaturity);
            }
        });
        
        return timeline;
    }

    projectInvestmentNeeds() {
        const currentBudget = this.state.rdBudget;
        const growthRate = this.state.innovationRate * 0.1;
        
        return {
            current_annual: currentBudget,
            projected_five_year: currentBudget * Math.pow(1 + growthRate, 5),
            infrastructure_needs: currentBudget * 0.3,
            human_capital_needs: currentBudget * 0.4
        };
    }

    generateStrategicRecommendations() {
        const recommendations = [];
        
        // Investment recommendations
        const leadingDomains = this.identifyLeadingDomains();
        if (leadingDomains.length > 0) {
            recommendations.push(`Maintain leadership in ${leadingDomains[0].domain}`);
        }
        
        // Emerging opportunities
        const opportunities = this.identifyEmergingOpportunities();
        if (opportunities.length > 0) {
            recommendations.push(`Increase investment in ${opportunities[0].domain}`);
        }
        
        // Infrastructure needs
        const constraints = this.identifyCapacityConstraints();
        if (constraints.length > 0) {
            recommendations.push('Address infrastructure capacity constraints');
        }
        
        // Talent development
        const skillGaps = this.identifySkillGaps();
        if (skillGaps.length > 0) {
            recommendations.push(`Develop talent pipeline for ${skillGaps[0].area}`);
        }
        
        return recommendations;
    }

    generateFallbackOutputs() {
        return {
            technology_metrics: {
                overall_tech_level: 0.6,
                innovation_rate: 0.4,
                research_capacity: 0.5,
                technology_transfer_rate: 0.3,
                tech_level_category: 'developed'
            },
            research_development: {
                rd_budget: 5000000000,
                rd_personnel: 50000,
                active_projects: 25,
                project_success_rate: 0.7
            },
            innovation_ecosystem: {
                active_startups: 500,
                innovation_index: 0.6,
                ecosystem_health: 0.6
            },
            technology_domains: {
                leading_domains: [],
                emerging_opportunities: []
            },
            technology_transfer: {
                transfer_effectiveness: 0.5,
                commercialization_rate: 0.4
            },
            research_infrastructure: {
                infrastructure_utilization: 0.7,
                capacity_constraints: []
            },
            human_capital: {
                talent_pipeline: { phd_production_rate: 2000 },
                skill_gaps: []
            },
            technology_forecast: {
                emerging_technologies: [],
                technology_risks: [],
                strategic_recommendations: []
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallTechLevel: this.state.overallTechLevel,
            innovationRate: this.state.innovationRate,
            researchCapacity: this.state.researchCapacity,
            activeProjects: this.state.activeProjects.size,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.overallTechLevel = 0.6;
        this.state.innovationRate = 0.4;
        this.state.researchCapacity = 0.5;
        this.state.activeProjects.clear();
        this.state.completedProjects = [];
        console.log('🔬 Technology System reset');
    }
}

module.exports = { TechnologySystem };
