// Science System - Research coordination, scientific policy, and innovation management
// Provides comprehensive science and research capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class ScienceSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('science-system', config);
        
        // System state
        this.state = {
            // Research Funding & Investment
            researchFunding: {
                total_rd_spending: 650000000000, // $650B annually
                federal_rd_budget: 200000000000, // $200B
                private_rd_investment: 450000000000, // $450B
                rd_spending_gdp_percentage: 0.032, // 3.2% of GDP
                basic_research_funding: 95000000000, // $95B
                applied_research_funding: 155000000000, // $155B
                development_funding: 400000000000, // $400B
                international_collaboration_funding: 25000000000 // $25B
            },
            
            // Scientific Infrastructure
            scientificInfrastructure: {
                national_laboratories: 17,
                research_universities: 4500,
                major_research_facilities: 350,
                supercomputing_centers: 45,
                scientific_instruments_value: 180000000000, // $180B
                research_infrastructure_quality: 0.85,
                facility_utilization_rate: 0.78,
                infrastructure_modernization_rate: 0.65
            },
            
            // Research Workforce
            researchWorkforce: {
                total_researchers: 1400000,
                phd_scientists: 850000,
                postdoctoral_researchers: 65000,
                research_technicians: 485000,
                stem_graduates_annual: 450000,
                international_researchers: 280000,
                workforce_diversity_index: 0.68,
                researcher_retention_rate: 0.82
            },
            
            // Scientific Output & Innovation
            scientificOutput: {
                peer_reviewed_publications: 425000, // annually
                patents_filed: 285000, // annually
                citation_impact_index: 1.45,
                international_collaboration_rate: 0.58,
                technology_transfer_rate: 0.35,
                startup_formation_rate: 0.12,
                innovation_commercialization_rate: 0.28,
                scientific_breakthroughs: 125 // annually
            },
            
            // Research Priority Areas
            researchPriorities: {
                health_medical_research: {
                    funding_allocation: 0.28,
                    research_quality: 0.88,
                    breakthrough_potential: 0.82,
                    clinical_translation_rate: 0.45
                },
                climate_environmental_science: {
                    funding_allocation: 0.15,
                    research_quality: 0.85,
                    breakthrough_potential: 0.78,
                    policy_impact: 0.72
                },
                artificial_intelligence: {
                    funding_allocation: 0.12,
                    research_quality: 0.92,
                    breakthrough_potential: 0.95,
                    industry_adoption_rate: 0.68
                },
                quantum_computing: {
                    funding_allocation: 0.08,
                    research_quality: 0.90,
                    breakthrough_potential: 0.88,
                    technological_readiness: 0.35
                },
                biotechnology: {
                    funding_allocation: 0.18,
                    research_quality: 0.87,
                    breakthrough_potential: 0.85,
                    commercialization_rate: 0.52
                },
                energy_research: {
                    funding_allocation: 0.10,
                    research_quality: 0.83,
                    breakthrough_potential: 0.80,
                    deployment_rate: 0.48
                },
                space_science: {
                    funding_allocation: 0.09,
                    research_quality: 0.89,
                    breakthrough_potential: 0.75,
                    mission_success_rate: 0.85
                }
            },
            
            // International Collaboration
            internationalCollaboration: {
                bilateral_agreements: 85,
                multilateral_programs: 35,
                researcher_exchange_programs: 125,
                joint_research_projects: 2500,
                international_funding_share: 0.15,
                collaboration_effectiveness: 0.78,
                knowledge_sharing_index: 0.82,
                diplomatic_science_initiatives: 45
            },
            
            // Science Policy & Governance
            sciencePolicy: {
                research_ethics_compliance: 0.92,
                open_science_adoption: 0.68,
                data_sharing_policies: 0.75,
                research_integrity_enforcement: 0.88,
                science_policy_coordination: 0.72,
                regulatory_science_integration: 0.65,
                evidence_based_policymaking: 0.78,
                public_engagement_level: 0.62
            },
            
            // Technology Transfer & Commercialization
            technologyTransfer: {
                university_industry_partnerships: 3500,
                licensing_agreements: 8500,
                spin_off_companies: 1200, // annually
                venture_capital_investment: 85000000000, // $85B
                technology_maturation_programs: 450,
                commercialization_success_rate: 0.32,
                intellectual_property_portfolio: 125000,
                industry_collaboration_index: 0.74
            },
            
            // STEM Education & Outreach
            stemEducation: {
                stem_education_funding: 18000000000, // $18B
                k12_stem_programs: 15000,
                undergraduate_research_opportunities: 85000,
                graduate_fellowships: 45000,
                public_science_literacy: 0.68,
                science_museum_visitors: 85000000, // annually
                citizen_science_participation: 2500000,
                science_communication_effectiveness: 0.72
            },
            
            // Emerging Technologies
            emergingTechnologies: {
                nanotechnology_investment: 2500000000, // $2.5B
                synthetic_biology_investment: 1800000000, // $1.8B
                advanced_materials_investment: 3200000000, // $3.2B
                robotics_automation_investment: 4500000000, // $4.5B
                emerging_tech_readiness: 0.65,
                technology_convergence_index: 0.72,
                disruptive_innovation_rate: 0.28,
                technology_risk_assessment: 0.78
            },
            
            // Scientific Computing & Data
            scientificComputing: {
                high_performance_computing_capacity: 1500, // petaflops
                research_data_storage: 850, // petabytes
                data_analytics_capabilities: 0.82,
                computational_modeling_quality: 0.88,
                data_infrastructure_investment: 12000000000, // $12B
                cloud_computing_adoption: 0.75,
                ai_research_tools_deployment: 0.68,
                data_security_compliance: 0.85
            },
            
            // Performance Metrics
            performanceMetrics: {
                overall_science_system_performance: 0.82,
                research_productivity_index: 0.85,
                innovation_capacity: 0.88,
                international_competitiveness: 0.89,
                knowledge_translation_effectiveness: 0.72,
                scientific_leadership_index: 0.91
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('research_funding_priority', 'float', 0.8, 
            'Priority given to research and development funding', 0.0, 1.0);
        
        this.addInputKnob('basic_research_emphasis', 'float', 0.7, 
            'Emphasis on basic vs applied research funding', 0.0, 1.0);
        
        this.addInputKnob('international_collaboration_openness', 'float', 0.75, 
            'Openness to international scientific collaboration', 0.0, 1.0);
        
        this.addInputKnob('emerging_technology_investment', 'float', 0.7, 
            'Investment level in emerging and disruptive technologies', 0.0, 1.0);
        
        this.addInputKnob('technology_transfer_emphasis', 'float', 0.65, 
            'Emphasis on technology transfer and commercialization', 0.0, 1.0);
        
        this.addInputKnob('stem_education_priority', 'float', 0.7, 
            'Priority given to STEM education and workforce development', 0.0, 1.0);
        
        this.addInputKnob('open_science_commitment', 'float', 0.68, 
            'Commitment to open science and data sharing', 0.0, 1.0);
        
        this.addInputKnob('research_infrastructure_modernization', 'float', 0.65, 
            'Investment in research infrastructure modernization', 0.0, 1.0);
        
        this.addInputKnob('interdisciplinary_research_support', 'float', 0.72, 
            'Support for interdisciplinary and convergent research', 0.0, 1.0);
        
        this.addInputKnob('science_policy_integration', 'float', 0.72, 
            'Integration of science into policy decision-making', 0.0, 1.0);
        
        this.addInputKnob('public_science_engagement', 'float', 0.62, 
            'Emphasis on public engagement and science communication', 0.0, 1.0);
        
        this.addInputKnob('research_ethics_standards', 'float', 0.92, 
            'Standards for research ethics and integrity', 0.5, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('research_capacity_assessment', 'object', 
            'Research funding, infrastructure, and workforce capacity metrics');
        
        this.addOutputChannel('scientific_output_analysis', 'object', 
            'Scientific publications, patents, and innovation output metrics');
        
        this.addOutputChannel('research_priority_performance', 'object', 
            'Performance metrics for key research priority areas');
        
        this.addOutputChannel('international_collaboration_status', 'object', 
            'International scientific collaboration and partnership metrics');
        
        this.addOutputChannel('technology_transfer_effectiveness', 'object', 
            'Technology transfer, commercialization, and industry partnership metrics');
        
        this.addOutputChannel('stem_education_impact', 'object', 
            'STEM education, workforce development, and public engagement metrics');
        
        this.addOutputChannel('emerging_technology_readiness', 'object', 
            'Emerging technology investment and readiness assessment');
        
        this.addOutputChannel('science_policy_integration', 'object', 
            'Science policy coordination and evidence-based decision making');
        
        console.log('🔬 Science System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update research funding
            this.updateResearchFunding(aiInputs);
            
            // Process scientific infrastructure
            this.processScientificInfrastructure(aiInputs);
            
            // Update research workforce
            this.updateResearchWorkforce(gameState, aiInputs);
            
            // Process scientific output
            this.processScientificOutput(gameState, aiInputs);
            
            // Update research priorities
            this.updateResearchPriorities(aiInputs);
            
            // Process international collaboration
            this.processInternationalCollaboration(aiInputs);
            
            // Update science policy
            this.updateSciencePolicy(aiInputs);
            
            // Process technology transfer
            this.processTechnologyTransfer(aiInputs);
            
            // Update STEM education
            this.updateSTEMEducation(aiInputs);
            
            // Process emerging technologies
            this.processEmergingTechnologies(aiInputs);
            
            // Update scientific computing
            this.updateScientificComputing(aiInputs);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🔬 Science System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateResearchFunding(aiInputs) {
        const fundingPriority = aiInputs.research_funding_priority || 0.8;
        const basicResearchEmphasis = aiInputs.basic_research_emphasis || 0.7;
        
        const funding = this.state.researchFunding;
        
        // Update total R&D spending based on priority
        const fundingMultiplier = 1 + (fundingPriority - 0.8) * 0.5;
        funding.total_rd_spending = Math.floor(600000000000 * fundingMultiplier);
        
        // Update federal R&D budget
        funding.federal_rd_budget = Math.floor(funding.total_rd_spending * 0.31);
        
        // Update private R&D investment
        funding.private_rd_investment = funding.total_rd_spending - funding.federal_rd_budget;
        
        // Update R&D spending as percentage of GDP
        funding.rd_spending_gdp_percentage = Math.min(0.045, 
            0.025 + fundingPriority * 0.015);
        
        // Update basic vs applied research allocation
        const totalResearchFunding = funding.basic_research_funding + funding.applied_research_funding;
        funding.basic_research_funding = Math.floor(totalResearchFunding * 
            (0.3 + basicResearchEmphasis * 0.2));
        funding.applied_research_funding = totalResearchFunding - funding.basic_research_funding;
        
        // Update development funding
        funding.development_funding = funding.total_rd_spending - totalResearchFunding;
        
        // Update international collaboration funding
        const internationalOpenness = aiInputs.international_collaboration_openness || 0.75;
        funding.international_collaboration_funding = Math.floor(20000000000 + 
            internationalOpenness * 15000000000);
    }

    processScientificInfrastructure(aiInputs) {
        const modernizationRate = aiInputs.research_infrastructure_modernization || 0.65;
        const fundingPriority = aiInputs.research_funding_priority || 0.8;
        
        const infrastructure = this.state.scientificInfrastructure;
        
        // Update research infrastructure quality
        infrastructure.research_infrastructure_quality = Math.min(0.95, 
            0.75 + modernizationRate * 0.15);
        
        // Update facility utilization rate
        infrastructure.facility_utilization_rate = Math.min(0.9, 
            0.7 + fundingPriority * 0.15);
        
        // Update infrastructure modernization rate
        infrastructure.infrastructure_modernization_rate = modernizationRate;
        
        // Update major research facilities based on funding
        if (fundingPriority > 0.85) {
            infrastructure.major_research_facilities = Math.min(400, 
                infrastructure.major_research_facilities + 5);
        }
        
        // Update supercomputing centers
        infrastructure.supercomputing_centers = Math.floor(40 + 
            modernizationRate * 15);
        
        // Update scientific instruments value
        infrastructure.scientific_instruments_value = Math.floor(160000000000 + 
            fundingPriority * 50000000000);
    }

    updateResearchWorkforce(gameState, aiInputs) {
        const stemEducationPriority = aiInputs.stem_education_priority || 0.7;
        const internationalOpenness = aiInputs.international_collaboration_openness || 0.75;
        
        const workforce = this.state.researchWorkforce;
        
        // Update STEM graduates annually
        workforce.stem_graduates_annual = Math.floor(400000 + 
            stemEducationPriority * 100000);
        
        // Update international researchers
        workforce.international_researchers = Math.floor(250000 + 
            internationalOpenness * 80000);
        
        // Update workforce diversity index
        workforce.workforce_diversity_index = Math.min(0.8, 
            0.6 + stemEducationPriority * 0.15);
        
        // Update researcher retention rate
        workforce.researcher_retention_rate = Math.min(0.9, 
            0.75 + this.state.researchFunding.rd_spending_gdp_percentage * 4);
        
        // Update total researchers based on funding and education
        const growthRate = 1 + (stemEducationPriority - 0.5) * 0.05;
        workforce.total_researchers = Math.floor(workforce.total_researchers * growthRate);
        
        // Update PhD scientists and postdocs proportionally
        workforce.phd_scientists = Math.floor(workforce.total_researchers * 0.61);
        workforce.postdoctoral_researchers = Math.floor(workforce.total_researchers * 0.046);
        workforce.research_technicians = workforce.total_researchers - 
            workforce.phd_scientists - workforce.postdoctoral_researchers;
        
        // Process workforce data from game state
        if (gameState.workforceData) {
            this.processWorkforceData(gameState.workforceData, stemEducationPriority);
        }
    }

    processWorkforceData(workforceData, educationPriority) {
        const workforce = this.state.researchWorkforce;
        
        // Update workforce metrics based on game data
        if (workforceData.stem_education_quality) {
            workforce.stem_graduates_annual = Math.floor(workforce.stem_graduates_annual * 
                (1 + workforceData.stem_education_quality * 0.1));
        }
        
        if (workforceData.brain_drain_rate) {
            workforce.researcher_retention_rate = Math.max(0.7, 
                workforce.researcher_retention_rate - workforceData.brain_drain_rate * 0.2);
        }
    }

    processScientificOutput(gameState, aiInputs) {
        const fundingPriority = aiInputs.research_funding_priority || 0.8;
        const internationalOpenness = aiInputs.international_collaboration_openness || 0.75;
        const technologyTransferEmphasis = aiInputs.technology_transfer_emphasis || 0.65;
        
        const output = this.state.scientificOutput;
        
        // Update peer-reviewed publications
        const publicationMultiplier = 1 + (fundingPriority - 0.8) * 0.3;
        output.peer_reviewed_publications = Math.floor(400000 * publicationMultiplier);
        
        // Update patents filed
        output.patents_filed = Math.floor(250000 + 
            technologyTransferEmphasis * 70000);
        
        // Update citation impact index
        output.citation_impact_index = Math.min(1.8, 
            1.3 + fundingPriority * 0.4);
        
        // Update international collaboration rate
        output.international_collaboration_rate = Math.min(0.75, 
            0.45 + internationalOpenness * 0.25);
        
        // Update technology transfer rate
        output.technology_transfer_rate = Math.min(0.5, 
            0.25 + technologyTransferEmphasis * 0.2);
        
        // Update startup formation rate
        output.startup_formation_rate = Math.min(0.18, 
            0.08 + technologyTransferEmphasis * 0.08);
        
        // Update innovation commercialization rate
        output.innovation_commercialization_rate = Math.min(0.4, 
            0.2 + technologyTransferEmphasis * 0.15);
        
        // Update scientific breakthroughs
        output.scientific_breakthroughs = Math.floor(100 + 
            fundingPriority * 50);
        
        // Process research breakthroughs from game state
        if (gameState.researchBreakthroughs) {
            this.processResearchBreakthroughs(gameState.researchBreakthroughs);
        }
    }

    processResearchBreakthroughs(breakthroughs) {
        breakthroughs.forEach(breakthrough => {
            console.log(`🔬 Science System: Processing breakthrough in ${breakthrough.field}`);
            
            // Breakthroughs boost relevant research priority areas
            if (this.state.researchPriorities[breakthrough.field]) {
                this.state.researchPriorities[breakthrough.field].breakthrough_potential = Math.min(1.0, 
                    this.state.researchPriorities[breakthrough.field].breakthrough_potential + 0.05);
            }
            
            // Major breakthroughs increase overall scientific output
            if (breakthrough.impact > 0.8) {
                this.state.scientificOutput.citation_impact_index = Math.min(2.0, 
                    this.state.scientificOutput.citation_impact_index + 0.02);
            }
        });
    }

    updateResearchPriorities(aiInputs) {
        const emergingTechInvestment = aiInputs.emerging_technology_investment || 0.7;
        const interdisciplinarySupport = aiInputs.interdisciplinary_research_support || 0.72;
        
        const priorities = this.state.researchPriorities;
        
        // Update AI research based on emerging tech investment
        priorities.artificial_intelligence.funding_allocation = Math.min(0.18, 
            0.1 + emergingTechInvestment * 0.06);
        priorities.artificial_intelligence.industry_adoption_rate = Math.min(0.8, 
            0.6 + emergingTechInvestment * 0.15);
        
        // Update quantum computing
        priorities.quantum_computing.funding_allocation = Math.min(0.12, 
            0.06 + emergingTechInvestment * 0.04);
        priorities.quantum_computing.technological_readiness = Math.min(0.6, 
            0.25 + emergingTechInvestment * 0.25);
        
        // Update biotechnology
        priorities.biotechnology.commercialization_rate = Math.min(0.7, 
            0.45 + interdisciplinarySupport * 0.2);
        
        // Update climate/environmental science
        priorities.climate_environmental_science.policy_impact = Math.min(0.85, 
            0.65 + this.state.sciencePolicy.evidence_based_policymaking * 0.15);
        
        // Update energy research
        priorities.energy_research.deployment_rate = Math.min(0.65, 
            0.4 + emergingTechInvestment * 0.2);
        
        // Update health/medical research
        priorities.health_medical_research.clinical_translation_rate = Math.min(0.6, 
            0.35 + interdisciplinarySupport * 0.2);
        
        // Update space science
        priorities.space_science.mission_success_rate = Math.min(0.95, 
            0.8 + this.state.researchFunding.rd_spending_gdp_percentage * 3);
    }

    processInternationalCollaboration(aiInputs) {
        const internationalOpenness = aiInputs.international_collaboration_openness || 0.75;
        const scienceDiplomacy = aiInputs.science_policy_integration || 0.72;
        
        const collaboration = this.state.internationalCollaboration;
        
        // Update bilateral agreements
        collaboration.bilateral_agreements = Math.floor(75 + 
            internationalOpenness * 25);
        
        // Update multilateral programs
        collaboration.multilateral_programs = Math.floor(30 + 
            internationalOpenness * 15);
        
        // Update researcher exchange programs
        collaboration.researcher_exchange_programs = Math.floor(100 + 
            internationalOpenness * 50);
        
        // Update joint research projects
        collaboration.joint_research_projects = Math.floor(2000 + 
            internationalOpenness * 1000);
        
        // Update international funding share
        collaboration.international_funding_share = Math.min(0.25, 
            0.1 + internationalOpenness * 0.12);
        
        // Update collaboration effectiveness
        collaboration.collaboration_effectiveness = Math.min(0.9, 
            0.65 + internationalOpenness * 0.2);
        
        // Update knowledge sharing index
        collaboration.knowledge_sharing_index = Math.min(0.95, 
            0.7 + this.state.sciencePolicy.open_science_adoption * 0.2);
        
        // Update diplomatic science initiatives
        collaboration.diplomatic_science_initiatives = Math.floor(35 + 
            scienceDiplomacy * 25);
    }

    updateSciencePolicy(aiInputs) {
        const policyIntegration = aiInputs.science_policy_integration || 0.72;
        const openScienceCommitment = aiInputs.open_science_commitment || 0.68;
        const ethicsStandards = aiInputs.research_ethics_standards || 0.92;
        const publicEngagement = aiInputs.public_science_engagement || 0.62;
        
        const policy = this.state.sciencePolicy;
        
        // Update research ethics compliance
        policy.research_ethics_compliance = ethicsStandards;
        
        // Update open science adoption
        policy.open_science_adoption = openScienceCommitment;
        
        // Update data sharing policies
        policy.data_sharing_policies = Math.min(0.9, 
            0.6 + openScienceCommitment * 0.25);
        
        // Update research integrity enforcement
        policy.research_integrity_enforcement = Math.min(0.95, 
            0.8 + ethicsStandards * 0.12);
        
        // Update science policy coordination
        policy.science_policy_coordination = policyIntegration;
        
        // Update regulatory science integration
        policy.regulatory_science_integration = Math.min(0.8, 
            0.5 + policyIntegration * 0.25);
        
        // Update evidence-based policymaking
        policy.evidence_based_policymaking = Math.min(0.9, 
            0.65 + policyIntegration * 0.2);
        
        // Update public engagement level
        policy.public_engagement_level = publicEngagement;
    }

    processTechnologyTransfer(aiInputs) {
        const transferEmphasis = aiInputs.technology_transfer_emphasis || 0.65;
        const emergingTechInvestment = aiInputs.emerging_technology_investment || 0.7;
        
        const transfer = this.state.technologyTransfer;
        
        // Update university-industry partnerships
        transfer.university_industry_partnerships = Math.floor(3000 + 
            transferEmphasis * 1000);
        
        // Update licensing agreements
        transfer.licensing_agreements = Math.floor(7500 + 
            transferEmphasis * 2000);
        
        // Update spin-off companies
        transfer.spin_off_companies = Math.floor(1000 + 
            transferEmphasis * 400);
        
        // Update venture capital investment
        transfer.venture_capital_investment = Math.floor(75000000000 + 
            emergingTechInvestment * 25000000000);
        
        // Update technology maturation programs
        transfer.technology_maturation_programs = Math.floor(400 + 
            transferEmphasis * 150);
        
        // Update commercialization success rate
        transfer.commercialization_success_rate = Math.min(0.45, 
            0.25 + transferEmphasis * 0.15);
        
        // Update intellectual property portfolio
        transfer.intellectual_property_portfolio = Math.floor(115000 + 
            transferEmphasis * 25000);
        
        // Update industry collaboration index
        transfer.industry_collaboration_index = Math.min(0.85, 
            0.65 + transferEmphasis * 0.15);
    }

    updateSTEMEducation(aiInputs) {
        const stemPriority = aiInputs.stem_education_priority || 0.7;
        const publicEngagement = aiInputs.public_science_engagement || 0.62;
        
        const education = this.state.stemEducation;
        
        // Update STEM education funding
        education.stem_education_funding = Math.floor(15000000000 + 
            stemPriority * 8000000000);
        
        // Update K-12 STEM programs
        education.k12_stem_programs = Math.floor(12000 + 
            stemPriority * 6000);
        
        // Update undergraduate research opportunities
        education.undergraduate_research_opportunities = Math.floor(75000 + 
            stemPriority * 25000);
        
        // Update graduate fellowships
        education.graduate_fellowships = Math.floor(40000 + 
            stemPriority * 15000);
        
        // Update public science literacy
        education.public_science_literacy = Math.min(0.8, 
            0.6 + publicEngagement * 0.15);
        
        // Update science museum visitors
        education.science_museum_visitors = Math.floor(75000000 + 
            publicEngagement * 25000000);
        
        // Update citizen science participation
        education.citizen_science_participation = Math.floor(2000000 + 
            publicEngagement * 1000000);
        
        // Update science communication effectiveness
        education.science_communication_effectiveness = Math.min(0.85, 
            0.6 + publicEngagement * 0.2);
    }

    processEmergingTechnologies(aiInputs) {
        const emergingTechInvestment = aiInputs.emerging_technology_investment || 0.7;
        const interdisciplinarySupport = aiInputs.interdisciplinary_research_support || 0.72;
        
        const emerging = this.state.emergingTechnologies;
        
        // Update investment levels based on priority
        const investmentMultiplier = 1 + (emergingTechInvestment - 0.7) * 0.5;
        
        emerging.nanotechnology_investment = Math.floor(2200000000 * investmentMultiplier);
        emerging.synthetic_biology_investment = Math.floor(1600000000 * investmentMultiplier);
        emerging.advanced_materials_investment = Math.floor(2800000000 * investmentMultiplier);
        emerging.robotics_automation_investment = Math.floor(4000000000 * investmentMultiplier);
        
        // Update emerging tech readiness
        emerging.emerging_tech_readiness = Math.min(0.8, 
            0.55 + emergingTechInvestment * 0.2);
        
        // Update technology convergence index
        emerging.technology_convergence_index = Math.min(0.85, 
            0.6 + interdisciplinarySupport * 0.2);
        
        // Update disruptive innovation rate
        emerging.disruptive_innovation_rate = Math.min(0.4, 
            0.2 + emergingTechInvestment * 0.15);
        
        // Update technology risk assessment
        emerging.technology_risk_assessment = Math.min(0.9, 
            0.7 + this.state.sciencePolicy.research_ethics_compliance * 0.15);
    }

    updateScientificComputing(aiInputs) {
        const modernizationRate = aiInputs.research_infrastructure_modernization || 0.65;
        const fundingPriority = aiInputs.research_funding_priority || 0.8;
        
        const computing = this.state.scientificComputing;
        
        // Update high-performance computing capacity
        computing.high_performance_computing_capacity = Math.floor(1400 + 
            modernizationRate * 300);
        
        // Update research data storage
        computing.research_data_storage = Math.floor(800 + 
            fundingPriority * 150);
        
        // Update data analytics capabilities
        computing.data_analytics_capabilities = Math.min(0.95, 
            0.75 + modernizationRate * 0.15);
        
        // Update computational modeling quality
        computing.computational_modeling_quality = Math.min(0.95, 
            0.8 + modernizationRate * 0.12);
        
        // Update data infrastructure investment
        computing.data_infrastructure_investment = Math.floor(10000000000 + 
            fundingPriority * 5000000000);
        
        // Update cloud computing adoption
        computing.cloud_computing_adoption = Math.min(0.9, 
            0.65 + modernizationRate * 0.2);
        
        // Update AI research tools deployment
        computing.ai_research_tools_deployment = Math.min(0.85, 
            0.55 + this.state.researchPriorities.artificial_intelligence.funding_allocation * 2);
        
        // Update data security compliance
        computing.data_security_compliance = Math.min(0.95, 
            0.8 + this.state.sciencePolicy.research_ethics_compliance * 0.12);
    }

    calculatePerformanceMetrics(gameState) {
        const metrics = this.state.performanceMetrics;
        
        // Calculate overall science system performance
        const fundingScore = this.calculateFundingScore();
        const outputScore = this.calculateOutputScore();
        const infrastructureScore = this.calculateInfrastructureScore();
        const collaborationScore = this.calculateCollaborationScore();
        
        metrics.overall_science_system_performance = 
            (fundingScore + outputScore + infrastructureScore + collaborationScore) / 4;
        
        // Calculate research productivity index
        metrics.research_productivity_index = this.calculateResearchProductivity();
        
        // Calculate innovation capacity
        metrics.innovation_capacity = this.calculateInnovationCapacity();
        
        // Calculate international competitiveness
        metrics.international_competitiveness = this.calculateInternationalCompetitiveness();
        
        // Calculate knowledge translation effectiveness
        metrics.knowledge_translation_effectiveness = this.calculateKnowledgeTranslation();
        
        // Calculate scientific leadership index
        metrics.scientific_leadership_index = this.calculateScientificLeadership();
    }

    calculateFundingScore() {
        const funding = this.state.researchFunding;
        
        // Score based on R&D spending as percentage of GDP
        const gdpScore = Math.min(1.0, funding.rd_spending_gdp_percentage / 0.04);
        
        // Score based on funding balance
        const totalResearch = funding.basic_research_funding + funding.applied_research_funding;
        const balanceScore = 1 - Math.abs((funding.basic_research_funding / totalResearch) - 0.4);
        
        return (gdpScore + balanceScore) / 2;
    }

    calculateOutputScore() {
        const output = this.state.scientificOutput;
        
        // Score based on publications and citations
        const publicationScore = Math.min(1.0, output.peer_reviewed_publications / 500000);
        const citationScore = Math.min(1.0, output.citation_impact_index / 1.8);
        const patentScore = Math.min(1.0, output.patents_filed / 350000);
        
        return (publicationScore + citationScore + patentScore) / 3;
    }

    calculateInfrastructureScore() {
        const infrastructure = this.state.scientificInfrastructure;
        
        return (infrastructure.research_infrastructure_quality + 
                infrastructure.facility_utilization_rate + 
                infrastructure.infrastructure_modernization_rate) / 3;
    }

    calculateCollaborationScore() {
        const collaboration = this.state.internationalCollaboration;
        const output = this.state.scientificOutput;
        
        return (collaboration.collaboration_effectiveness + 
                collaboration.knowledge_sharing_index + 
                output.international_collaboration_rate) / 3;
    }

    calculateResearchProductivity() {
        const output = this.state.scientificOutput;
        const workforce = this.state.researchWorkforce;
        
        // Productivity based on output per researcher
        const publicationsPerResearcher = output.peer_reviewed_publications / workforce.total_researchers;
        const patentsPerResearcher = output.patents_filed / workforce.total_researchers;
        
        const productivityScore = Math.min(1.0, 
            (publicationsPerResearcher * 3000 + patentsPerResearcher * 5000) / 2);
        
        return (productivityScore + output.citation_impact_index / 2) / 2;
    }

    calculateInnovationCapacity() {
        const output = this.state.scientificOutput;
        const transfer = this.state.technologyTransfer;
        const emerging = this.state.emergingTechnologies;
        
        return (output.innovation_commercialization_rate + 
                transfer.commercialization_success_rate + 
                emerging.disruptive_innovation_rate + 
                output.startup_formation_rate * 2) / 4;
    }

    calculateInternationalCompetitiveness() {
        const output = this.state.scientificOutput;
        const collaboration = this.state.internationalCollaboration;
        const funding = this.state.researchFunding;
        
        const citationCompetitiveness = Math.min(1.0, output.citation_impact_index / 1.5);
        const collaborationCompetitiveness = collaboration.collaboration_effectiveness;
        const fundingCompetitiveness = Math.min(1.0, funding.rd_spending_gdp_percentage / 0.035);
        
        return (citationCompetitiveness + collaborationCompetitiveness + fundingCompetitiveness) / 3;
    }

    calculateKnowledgeTranslation() {
        const output = this.state.scientificOutput;
        const transfer = this.state.technologyTransfer;
        const policy = this.state.sciencePolicy;
        
        return (output.technology_transfer_rate + 
                transfer.commercialization_success_rate + 
                policy.evidence_based_policymaking) / 3;
    }

    calculateScientificLeadership() {
        const output = this.state.scientificOutput;
        const priorities = this.state.researchPriorities;
        const collaboration = this.state.internationalCollaboration;
        
        // Leadership based on breakthrough potential and international influence
        const breakthroughScore = output.scientific_breakthroughs / 150;
        const aiLeadershipScore = priorities.artificial_intelligence.research_quality;
        const internationalInfluence = collaboration.diplomatic_science_initiatives / 50;
        
        return (breakthroughScore + aiLeadershipScore + internationalInfluence) / 3;
    }

    generateOutputs() {
        return {
            research_capacity_assessment: {
                funding_metrics: {
                    total_rd_spending: this.state.researchFunding.total_rd_spending,
                    gdp_percentage: this.state.researchFunding.rd_spending_gdp_percentage,
                    federal_budget: this.state.researchFunding.federal_rd_budget,
                    private_investment: this.state.researchFunding.private_rd_investment
                },
                infrastructure_capacity: {
                    research_facilities: this.state.scientificInfrastructure.major_research_facilities,
                    infrastructure_quality: this.state.scientificInfrastructure.research_infrastructure_quality,
                    utilization_rate: this.state.scientificInfrastructure.facility_utilization_rate,
                    modernization_progress: this.state.scientificInfrastructure.infrastructure_modernization_rate
                },
                workforce_capacity: {
                    total_researchers: this.state.researchWorkforce.total_researchers,
                    phd_scientists: this.state.researchWorkforce.phd_scientists,
                    stem_graduates: this.state.researchWorkforce.stem_graduates_annual,
                    retention_rate: this.state.researchWorkforce.researcher_retention_rate
                },
                capacity_assessment: this.assessResearchCapacity(),
                funding_adequacy: this.assessFundingAdequacy(),
                infrastructure_gaps: this.identifyInfrastructureGaps()
            },
            
            scientific_output_analysis: {
                publication_metrics: {
                    peer_reviewed_publications: this.state.scientificOutput.peer_reviewed_publications,
                    citation_impact: this.state.scientificOutput.citation_impact_index,
                    international_collaboration: this.state.scientificOutput.international_collaboration_rate
                },
                innovation_metrics: {
                    patents_filed: this.state.scientificOutput.patents_filed,
                    technology_transfer_rate: this.state.scientificOutput.technology_transfer_rate,
                    startup_formation: this.state.scientificOutput.startup_formation_rate,
                    commercialization_rate: this.state.scientificOutput.innovation_commercialization_rate
                },
                breakthrough_analysis: {
                    scientific_breakthroughs: this.state.scientificOutput.scientific_breakthroughs,
                    breakthrough_impact: this.assessBreakthroughImpact(),
                    emerging_discoveries: this.identifyEmergingDiscoveries()
                },
                output_trends: this.analyzeOutputTrends(),
                productivity_analysis: this.analyzeResearchProductivity()
            },
            
            research_priority_performance: {
                priority_areas: this.state.researchPriorities,
                performance_ranking: this.rankResearchPriorities(),
                investment_effectiveness: this.assessPriorityInvestmentEffectiveness(),
                breakthrough_potential: this.assessPriorityBreakthroughPotential(),
                strategic_recommendations: this.generatePriorityRecommendations()
            },
            
            international_collaboration_status: {
                collaboration_metrics: {
                    bilateral_agreements: this.state.internationalCollaboration.bilateral_agreements,
                    joint_projects: this.state.internationalCollaboration.joint_research_projects,
                    researcher_exchanges: this.state.internationalCollaboration.researcher_exchange_programs,
                    collaboration_effectiveness: this.state.internationalCollaboration.collaboration_effectiveness
                },
                knowledge_sharing: {
                    sharing_index: this.state.internationalCollaboration.knowledge_sharing_index,
                    open_science_adoption: this.state.sciencePolicy.open_science_adoption,
                    data_sharing_policies: this.state.sciencePolicy.data_sharing_policies
                },
                diplomatic_science: {
                    science_diplomacy_initiatives: this.state.internationalCollaboration.diplomatic_science_initiatives,
                    international_influence: this.assessInternationalScientificInfluence(),
                    partnership_effectiveness: this.assessPartnershipEffectiveness()
                },
                collaboration_opportunities: this.identifyCollaborationOpportunities(),
                competitive_positioning: this.assessGlobalCompetitivePosition()
            },
            
            technology_transfer_effectiveness: {
                transfer_metrics: {
                    university_industry_partnerships: this.state.technologyTransfer.university_industry_partnerships,
                    licensing_agreements: this.state.technologyTransfer.licensing_agreements,
                    spin_off_companies: this.state.technologyTransfer.spin_off_companies,
                    commercialization_success: this.state.technologyTransfer.commercialization_success_rate
                },
                investment_analysis: {
                    venture_capital: this.state.technologyTransfer.venture_capital_investment,
                    technology_maturation: this.state.technologyTransfer.technology_maturation_programs,
                    industry_collaboration: this.state.technologyTransfer.industry_collaboration_index
                },
                ip_portfolio: {
                    intellectual_property: this.state.technologyTransfer.intellectual_property_portfolio,
                    patent_commercialization: this.assessPatentCommercialization(),
                    licensing_revenue: this.estimateLicensingRevenue()
                },
                transfer_barriers: this.identifyTechnologyTransferBarriers(),
                improvement_opportunities: this.identifyTransferImprovementOpportunities()
            },
            
            stem_education_impact: {
                education_metrics: {
                    stem_funding: this.state.stemEducation.stem_education_funding,
                    k12_programs: this.state.stemEducation.k12_stem_programs,
                    undergraduate_research: this.state.stemEducation.undergraduate_research_opportunities,
                    graduate_fellowships: this.state.stemEducation.graduate_fellowships
                },
                public_engagement: {
                    science_literacy: this.state.stemEducation.public_science_literacy,
                    museum_visitors: this.state.stemEducation.science_museum_visitors,
                    citizen_science: this.state.stemEducation.citizen_science_participation,
                    communication_effectiveness: this.state.stemEducation.science_communication_effectiveness
                },
                workforce_development: {
                    stem_graduates: this.state.researchWorkforce.stem_graduates_annual,
                    diversity_index: this.state.researchWorkforce.workforce_diversity_index,
                    pipeline_strength: this.assessSTEMPipelineStrength()
                },
                education_impact_assessment: this.assessSTEMEducationImpact(),
                engagement_opportunities: this.identifyPublicEngagementOpportunities()
            },
            
            emerging_technology_readiness: {
                investment_portfolio: {
                    nanotechnology: this.state.emergingTechnologies.nanotechnology_investment,
                    synthetic_biology: this.state.emergingTechnologies.synthetic_biology_investment,
                    advanced_materials: this.state.emergingTechnologies.advanced_materials_investment,
                    robotics_automation: this.state.emergingTechnologies.robotics_automation_investment
                },
                readiness_assessment: {
                    technology_readiness: this.state.emergingTechnologies.emerging_tech_readiness,
                    convergence_index: this.state.emergingTechnologies.technology_convergence_index,
                    innovation_rate: this.state.emergingTechnologies.disruptive_innovation_rate,
                    risk_assessment: this.state.emergingTechnologies.technology_risk_assessment
                },
                strategic_priorities: this.identifyEmergingTechPriorities(),
                technology_roadmap: this.developEmergingTechRoadmap(),
                investment_recommendations: this.generateEmergingTechInvestmentRecommendations()
            },
            
            science_policy_integration: {
                policy_coordination: {
                    coordination_effectiveness: this.state.sciencePolicy.science_policy_coordination,
                    regulatory_integration: this.state.sciencePolicy.regulatory_science_integration,
                    evidence_based_policy: this.state.sciencePolicy.evidence_based_policymaking
                },
                research_governance: {
                    ethics_compliance: this.state.sciencePolicy.research_ethics_compliance,
                    integrity_enforcement: this.state.sciencePolicy.research_integrity_enforcement,
                    open_science: this.state.sciencePolicy.open_science_adoption
                },
                public_engagement: {
                    engagement_level: this.state.sciencePolicy.public_engagement_level,
                    science_communication: this.state.stemEducation.science_communication_effectiveness,
                    public_trust: this.assessPublicTrustInScience()
                },
                policy_effectiveness: this.assessSciencePolicyEffectiveness(),
                governance_recommendations: this.generateGovernanceRecommendations()
            }
        };
    }

    assessResearchCapacity() {
        const funding = this.state.researchFunding;
        const infrastructure = this.state.scientificInfrastructure;
        const workforce = this.state.researchWorkforce;
        
        return {
            funding_capacity: Math.min(1.0, funding.rd_spending_gdp_percentage / 0.04),
            infrastructure_capacity: infrastructure.research_infrastructure_quality,
            workforce_capacity: Math.min(1.0, workforce.total_researchers / 1500000),
            overall_capacity: this.calculateFundingScore(),
            capacity_rating: this.calculateFundingScore() > 0.8 ? 'excellent' : 
                           this.calculateFundingScore() > 0.7 ? 'good' : 'adequate'
        };
    }

    assessFundingAdequacy() {
        const funding = this.state.researchFunding;
        
        return {
            gdp_percentage_adequacy: funding.rd_spending_gdp_percentage > 0.035 ? 'adequate' : 'insufficient',
            basic_research_balance: this.assessBasicResearchBalance(),
            international_competitiveness: funding.rd_spending_gdp_percentage > 0.03 ? 'competitive' : 'lagging',
            funding_sustainability: this.assessFundingSustainability(),
            investment_gaps: this.identifyFundingGaps()
        };
    }

    assessBasicResearchBalance() {
        const funding = this.state.researchFunding;
        const totalResearch = funding.basic_research_funding + funding.applied_research_funding;
        const basicShare = funding.basic_research_funding / totalResearch;
        
        if (basicShare > 0.45) return 'well_balanced';
        if (basicShare > 0.35) return 'adequate';
        return 'insufficient_basic_research';
    }

    assessFundingSustainability() {
        const funding = this.state.researchFunding;
        
        // Sustainability based on growth trends and diversification
        const publicPrivateBalance = funding.federal_rd_budget / funding.total_rd_spending;
        
        return {
            public_private_balance: publicPrivateBalance > 0.25 && publicPrivateBalance < 0.4 ? 'balanced' : 'imbalanced',
            growth_sustainability: 'stable', // Simplified
            diversification_level: publicPrivateBalance > 0.2 && publicPrivateBalance < 0.5 ? 'good' : 'poor'
        };
    }

    identifyFundingGaps() {
        const gaps = [];
        const funding = this.state.researchFunding;
        
        if (funding.rd_spending_gdp_percentage < 0.035) {
            gaps.push({
                area: 'overall_rd_investment',
                gap_size: 0.035 - funding.rd_spending_gdp_percentage,
                priority: 'high'
            });
        }
        
        const totalResearch = funding.basic_research_funding + funding.applied_research_funding;
        const basicShare = funding.basic_research_funding / totalResearch;
        if (basicShare < 0.4) {
            gaps.push({
                area: 'basic_research_funding',
                gap_size: 0.4 - basicShare,
                priority: 'medium'
            });
        }
        
        return gaps;
    }

    identifyInfrastructureGaps() {
        const gaps = [];
        const infrastructure = this.state.scientificInfrastructure;
        
        if (infrastructure.research_infrastructure_quality < 0.9) {
            gaps.push({
                type: 'infrastructure_modernization',
                gap_size: 0.9 - infrastructure.research_infrastructure_quality,
                priority: 'high'
            });
        }
        
        if (infrastructure.facility_utilization_rate > 0.85) {
            gaps.push({
                type: 'capacity_expansion',
                gap_size: infrastructure.facility_utilization_rate - 0.8,
                priority: 'medium'
            });
        }
        
        return gaps;
    }

    assessBreakthroughImpact() {
        const output = this.state.scientificOutput;
        
        return {
            breakthrough_rate: output.scientific_breakthroughs / 150,
            citation_impact: output.citation_impact_index,
            commercialization_potential: output.innovation_commercialization_rate,
            societal_impact: this.estimateBreakthroughSocietalImpact(),
            impact_assessment: output.scientific_breakthroughs > 130 ? 'high_impact' : 
                             output.scientific_breakthroughs > 110 ? 'moderate_impact' : 'standard_impact'
        };
    }

    estimateBreakthroughSocietalImpact() {
        const priorities = this.state.researchPriorities;
        
        // Impact based on research in high-impact areas
        const healthImpact = priorities.health_medical_research.breakthrough_potential * 0.3;
        const climateImpact = priorities.climate_environmental_science.breakthrough_potential * 0.25;
        const aiImpact = priorities.artificial_intelligence.breakthrough_potential * 0.2;
        
        return healthImpact + climateImpact + aiImpact;
    }

    identifyEmergingDiscoveries() {
        const discoveries = [];
        const priorities = this.state.researchPriorities;
        
        Object.entries(priorities).forEach(([field, data]) => {
            if (data.breakthrough_potential > 0.85) {
                discoveries.push({
                    field: field,
                    potential: data.breakthrough_potential,
                    readiness: data.technological_readiness || data.clinical_translation_rate || 0.5
                });
            }
        });
        
        return discoveries.sort((a, b) => b.potential - a.potential);
    }

    analyzeOutputTrends() {
        const output = this.state.scientificOutput;
        
        return {
            publication_trend: output.peer_reviewed_publications > 450000 ? 'increasing' : 
                              output.peer_reviewed_publications > 400000 ? 'stable' : 'declining',
            patent_trend: output.patents_filed > 300000 ? 'increasing' : 
                         output.patents_filed > 250000 ? 'stable' : 'declining',
            citation_trend: output.citation_impact_index > 1.5 ? 'improving' : 
                           output.citation_impact_index > 1.3 ? 'stable' : 'declining',
            innovation_trend: output.innovation_commercialization_rate > 0.3 ? 'improving' : 
                             output.innovation_commercialization_rate > 0.25 ? 'stable' : 'declining',
            overall_trend: this.calculateOverallOutputTrend()
        };
    }

    calculateOverallOutputTrend() {
        const output = this.state.scientificOutput;
        
        const positiveFactors = [
            output.peer_reviewed_publications > 450000,
            output.citation_impact_index > 1.5,
            output.patents_filed > 300000,
            output.innovation_commercialization_rate > 0.3
        ].filter(Boolean).length;
        
        if (positiveFactors >= 3) return 'strongly_positive';
        if (positiveFactors >= 2) return 'positive';
        if (positiveFactors >= 1) return 'mixed';
        return 'concerning';
    }

    analyzeResearchProductivity() {
        const output = this.state.scientificOutput;
        const workforce = this.state.researchWorkforce;
        
        const publicationsPerResearcher = output.peer_reviewed_publications / workforce.total_researchers;
        const patentsPerResearcher = output.patents_filed / workforce.total_researchers;
        
        return {
            publications_per_researcher: publicationsPerResearcher,
            patents_per_researcher: patentsPerResearcher,
            productivity_index: this.calculateResearchProductivity(),
            efficiency_assessment: this.calculateResearchProductivity() > 0.8 ? 'highly_efficient' : 
                                  this.calculateResearchProductivity() > 0.7 ? 'efficient' : 'needs_improvement',
            productivity_factors: this.identifyProductivityFactors()
        };
    }

    identifyProductivityFactors() {
        const factors = [];
        const infrastructure = this.state.scientificInfrastructure;
        const funding = this.state.researchFunding;
        
        if (infrastructure.research_infrastructure_quality > 0.85) {
            factors.push('excellent_infrastructure');
        }
        
        if (funding.rd_spending_gdp_percentage > 0.035) {
            factors.push('adequate_funding');
        }
        
        if (this.state.internationalCollaboration.collaboration_effectiveness > 0.8) {
            factors.push('strong_international_collaboration');
        }
        
        return factors;
    }

    rankResearchPriorities() {
        const priorities = this.state.researchPriorities;
        
        return Object.entries(priorities)
            .map(([field, data]) => ({
                field: field,
                research_quality: data.research_quality,
                breakthrough_potential: data.breakthrough_potential,
                funding_allocation: data.funding_allocation,
                overall_score: (data.research_quality + data.breakthrough_potential) / 2
            }))
            .sort((a, b) => b.overall_score - a.overall_score);
    }

    assessPriorityInvestmentEffectiveness() {
        const priorities = this.state.researchPriorities;
        const effectiveness = {};
        
        Object.entries(priorities).forEach(([field, data]) => {
            effectiveness[field] = {
                investment_level: data.funding_allocation,
                research_quality: data.research_quality,
                breakthrough_potential: data.breakthrough_potential,
                roi_estimate: this.calculatePriorityROI(field, data),
                effectiveness_rating: this.ratePriorityEffectiveness(data)
            };
        });
        
        return effectiveness;
    }

    calculatePriorityROI(field, data) {
        // ROI based on quality and breakthrough potential relative to funding
        const qualityScore = data.research_quality;
        const potentialScore = data.breakthrough_potential;
        const fundingLevel = data.funding_allocation;
        
        return (qualityScore + potentialScore) / (2 * Math.max(0.05, fundingLevel));
    }

    ratePriorityEffectiveness(data) {
        const effectivenessScore = (data.research_quality + data.breakthrough_potential) / 2;
        
        if (effectivenessScore > 0.9) return 'excellent';
        if (effectivenessScore > 0.8) return 'good';
        if (effectivenessScore > 0.7) return 'adequate';
        return 'needs_improvement';
    }

    assessPriorityBreakthroughPotential() {
        const priorities = this.state.researchPriorities;
        
        const highPotential = Object.entries(priorities)
            .filter(([, data]) => data.breakthrough_potential > 0.85)
            .map(([field]) => field);
        
        const emergingOpportunities = Object.entries(priorities)
            .filter(([, data]) => data.breakthrough_potential > 0.8 && data.research_quality > 0.85)
            .map(([field]) => field);
        
        return {
            high_potential_areas: highPotential,
            emerging_opportunities: emergingOpportunities,
            breakthrough_timeline: this.estimateBreakthroughTimeline(),
            investment_priorities: this.identifyBreakthroughInvestmentPriorities()
        };
    }

    estimateBreakthroughTimeline() {
        const priorities = this.state.researchPriorities;
        
        return {
            near_term: Object.keys(priorities).filter(field => 
                priorities[field].breakthrough_potential > 0.9),
            medium_term: Object.keys(priorities).filter(field => 
                priorities[field].breakthrough_potential > 0.8 && priorities[field].breakthrough_potential <= 0.9),
            long_term: Object.keys(priorities).filter(field => 
                priorities[field].breakthrough_potential <= 0.8)
        };
    }

    identifyBreakthroughInvestmentPriorities() {
        const priorities = this.state.researchPriorities;
        const investmentPriorities = [];
        
        Object.entries(priorities).forEach(([field, data]) => {
            if (data.breakthrough_potential > 0.85 && data.funding_allocation < 0.15) {
                investmentPriorities.push({
                    field: field,
                    current_funding: data.funding_allocation,
                    breakthrough_potential: data.breakthrough_potential,
                    investment_recommendation: 'increase_funding'
                });
            }
        });
        
        return investmentPriorities;
    }

    generatePriorityRecommendations() {
        const recommendations = [];
        const priorities = this.state.researchPriorities;
        
        // AI research recommendation
        if (priorities.artificial_intelligence.breakthrough_potential > 0.9) {
            recommendations.push({
                area: 'artificial_intelligence',
                recommendation: 'accelerate_investment',
                rationale: 'Exceptional breakthrough potential and research quality'
            });
        }
        
        // Quantum computing recommendation
        if (priorities.quantum_computing.technological_readiness < 0.5) {
            recommendations.push({
                area: 'quantum_computing',
                recommendation: 'increase_basic_research',
                rationale: 'High potential but low technological readiness'
            });
        }
        
        // Climate science recommendation
        if (priorities.climate_environmental_science.policy_impact < 0.8) {
            recommendations.push({
                area: 'climate_environmental_science',
                recommendation: 'enhance_policy_translation',
                rationale: 'Strong research but limited policy impact'
            });
        }
        
        return recommendations;
    }

    assessInternationalScientificInfluence() {
        const collaboration = this.state.internationalCollaboration;
        const output = this.state.scientificOutput;
        
        return {
            diplomatic_influence: Math.min(1.0, collaboration.diplomatic_science_initiatives / 50),
            research_influence: output.citation_impact_index / 2,
            collaboration_leadership: collaboration.collaboration_effectiveness,
            knowledge_sharing_leadership: collaboration.knowledge_sharing_index,
            overall_influence: (collaboration.collaboration_effectiveness + 
                              collaboration.knowledge_sharing_index + 
                              output.citation_impact_index / 2) / 3,
            influence_rating: this.rateInternationalInfluence()
        };
    }

    rateInternationalInfluence() {
        const influence = (this.state.internationalCollaboration.collaboration_effectiveness + 
                         this.state.internationalCollaboration.knowledge_sharing_index + 
                         this.state.scientificOutput.citation_impact_index / 2) / 3;
        
        if (influence > 0.85) return 'global_leader';
        if (influence > 0.75) return 'major_influence';
        if (influence > 0.65) return 'significant_influence';
        return 'moderate_influence';
    }

    assessPartnershipEffectiveness() {
        const collaboration = this.state.internationalCollaboration;
        
        return {
            bilateral_effectiveness: Math.min(1.0, collaboration.bilateral_agreements / 100),
            multilateral_effectiveness: Math.min(1.0, collaboration.multilateral_programs / 40),
            project_success_rate: collaboration.collaboration_effectiveness,
            researcher_mobility: Math.min(1.0, collaboration.researcher_exchange_programs / 150),
            partnership_sustainability: this.assessPartnershipSustainability()
        };
    }

    assessPartnershipSustainability() {
        const collaboration = this.state.internationalCollaboration;
        
        // Sustainability based on funding and institutional support
        const fundingSupport = collaboration.international_funding_share;
        const institutionalSupport = collaboration.collaboration_effectiveness;
        
        return (fundingSupport * 2 + institutionalSupport) / 3;
    }

    identifyCollaborationOpportunities() {
        const opportunities = [];
        const collaboration = this.state.internationalCollaboration;
        
        if (collaboration.bilateral_agreements < 90) {
            opportunities.push({
                area: 'bilateral_partnership_expansion',
                potential: 'high',
                target_regions: 'emerging_research_economies'
            });
        }
        
        if (collaboration.knowledge_sharing_index < 0.9) {
            opportunities.push({
                area: 'open_science_initiatives',
                potential: 'medium',
                target_areas: 'data_sharing_platforms'
            });
        }
        
        if (collaboration.diplomatic_science_initiatives < 50) {
            opportunities.push({
                area: 'science_diplomacy_expansion',
                potential: 'medium',
                target_areas: 'global_challenges'
            });
        }
        
        return opportunities;
    }

    assessGlobalCompetitivePosition() {
        const metrics = this.state.performanceMetrics;
        const output = this.state.scientificOutput;
        const funding = this.state.researchFunding;
        
        return {
            overall_competitiveness: metrics.international_competitiveness,
            research_output_position: output.citation_impact_index > 1.5 ? 'leading' : 
                                    output.citation_impact_index > 1.3 ? 'competitive' : 'lagging',
            funding_position: funding.rd_spending_gdp_percentage > 0.035 ? 'leading' : 
                            funding.rd_spending_gdp_percentage > 0.03 ? 'competitive' : 'lagging',
            innovation_position: output.innovation_commercialization_rate > 0.3 ? 'leading' : 
                               output.innovation_commercialization_rate > 0.25 ? 'competitive' : 'lagging',
            competitive_advantages: this.identifyCompetitiveAdvantages(),
            competitive_challenges: this.identifyCompetitiveChallenges()
        };
    }

    identifyCompetitiveAdvantages() {
        const advantages = [];
        const output = this.state.scientificOutput;
        const priorities = this.state.researchPriorities;
        
        if (output.citation_impact_index > 1.5) {
            advantages.push('high_research_quality');
        }
        
        if (priorities.artificial_intelligence.research_quality > 0.9) {
            advantages.push('ai_research_leadership');
        }
        
        if (this.state.technologyTransfer.commercialization_success_rate > 0.35) {
            advantages.push('strong_technology_transfer');
        }
        
        return advantages;
    }

    identifyCompetitiveChallenges() {
        const challenges = [];
        const funding = this.state.researchFunding;
        const workforce = this.state.researchWorkforce;
        
        if (funding.rd_spending_gdp_percentage < 0.035) {
            challenges.push('insufficient_rd_investment');
        }
        
        if (workforce.researcher_retention_rate < 0.85) {
            challenges.push('talent_retention');
        }
        
        if (this.state.stemEducation.public_science_literacy < 0.7) {
            challenges.push('public_science_literacy');
        }
        
        return challenges;
    }

    assessPatentCommercialization() {
        const transfer = this.state.technologyTransfer;
        const output = this.state.scientificOutput;
        
        return {
            patent_to_license_ratio: transfer.licensing_agreements / output.patents_filed,
            commercialization_success: transfer.commercialization_success_rate,
            patent_quality_index: this.calculatePatentQualityIndex(),
            licensing_effectiveness: transfer.licensing_agreements / transfer.intellectual_property_portfolio,
            commercialization_timeline: this.estimateCommercializationTimeline()
        };
    }

    calculatePatentQualityIndex() {
        const transfer = this.state.technologyTransfer;
        const output = this.state.scientificOutput;
        
        // Quality based on licensing rate and commercialization success
        const licensingRate = transfer.licensing_agreements / output.patents_filed;
        const commercializationRate = transfer.commercialization_success_rate;
        
        return (licensingRate * 10 + commercializationRate) / 2;
    }

    estimateCommercializationTimeline() {
        const transfer = this.state.technologyTransfer;
        
        return {
            average_time_to_market: '3-5 years', // Simplified
            success_rate: transfer.commercialization_success_rate,
            acceleration_factors: this.identifyCommercializationAccelerators()
        };
    }

    identifyCommercializationAccelerators() {
        const accelerators = [];
        const transfer = this.state.technologyTransfer;
        
        if (transfer.industry_collaboration_index > 0.8) {
            accelerators.push('strong_industry_partnerships');
        }
        
        if (transfer.technology_maturation_programs > 500) {
            accelerators.push('robust_maturation_programs');
        }
        
        if (transfer.venture_capital_investment > 90000000000) {
            accelerators.push('abundant_venture_capital');
        }
        
        return accelerators;
    }

    estimateLicensingRevenue() {
        const transfer = this.state.technologyTransfer;
        
        // Simplified revenue estimation
        const averageRevenuePerLicense = 500000; // $500K average
        const totalRevenue = transfer.licensing_agreements * averageRevenuePerLicense;
        
        return {
            estimated_annual_revenue: totalRevenue,
            revenue_per_license: averageRevenuePerLicense,
            revenue_growth_potential: this.assessLicensingGrowthPotential(),
            high_value_licenses: Math.floor(transfer.licensing_agreements * 0.15)
        };
    }

    assessLicensingGrowthPotential() {
        const transfer = this.state.technologyTransfer;
        const output = this.state.scientificOutput;
        
        const patentGrowth = output.patents_filed > 300000 ? 'high' : 'moderate';
        const commercializationGrowth = transfer.commercialization_success_rate > 0.35 ? 'high' : 'moderate';
        
        return patentGrowth === 'high' && commercializationGrowth === 'high' ? 'high' : 'moderate';
    }

    identifyTechnologyTransferBarriers() {
        const barriers = [];
        const transfer = this.state.technologyTransfer;
        const policy = this.state.sciencePolicy;
        
        if (transfer.commercialization_success_rate < 0.35) {
            barriers.push({
                barrier: 'low_commercialization_success',
                impact: 'high',
                solutions: ['improve_market_analysis', 'enhance_business_development']
            });
        }
        
        if (policy.regulatory_science_integration < 0.7) {
            barriers.push({
                barrier: 'regulatory_complexity',
                impact: 'medium',
                solutions: ['streamline_approval_processes', 'improve_regulatory_guidance']
            });
        }
        
        if (transfer.industry_collaboration_index < 0.8) {
            barriers.push({
                barrier: 'limited_industry_engagement',
                impact: 'medium',
                solutions: ['expand_partnership_programs', 'improve_communication']
            });
        }
        
        return barriers;
    }

    identifyTransferImprovementOpportunities() {
        const opportunities = [];
        const transfer = this.state.technologyTransfer;
        
        if (transfer.university_industry_partnerships < 4000) {
            opportunities.push({
                area: 'partnership_expansion',
                potential_impact: 'high',
                investment_needed: 500000000
            });
        }
        
        if (transfer.technology_maturation_programs < 500) {
            opportunities.push({
                area: 'maturation_program_expansion',
                potential_impact: 'medium',
                investment_needed: 200000000
            });
        }
        
        if (transfer.spin_off_companies < 1500) {
            opportunities.push({
                area: 'entrepreneurship_support',
                potential_impact: 'high',
                investment_needed: 300000000
            });
        }
        
        return opportunities;
    }

    assessSTEMPipelineStrength() {
        const education = this.state.stemEducation;
        const workforce = this.state.researchWorkforce;
        
        return {
            k12_foundation: Math.min(1.0, education.k12_stem_programs / 18000),
            undergraduate_engagement: Math.min(1.0, education.undergraduate_research_opportunities / 100000),
            graduate_support: Math.min(1.0, education.graduate_fellowships / 50000),
            workforce_diversity: workforce.workforce_diversity_index,
            pipeline_strength: this.calculatePipelineStrength(),
            bottlenecks: this.identifyPipelineBottlenecks()
        };
    }

    calculatePipelineStrength() {
        const education = this.state.stemEducation;
        const workforce = this.state.researchWorkforce;
        
        const k12Score = Math.min(1.0, education.k12_stem_programs / 18000);
        const undergraduateScore = Math.min(1.0, education.undergraduate_research_opportunities / 100000);
        const graduateScore = Math.min(1.0, education.graduate_fellowships / 50000);
        const diversityScore = workforce.workforce_diversity_index;
        
        return (k12Score + undergraduateScore + graduateScore + diversityScore) / 4;
    }

    identifyPipelineBottlenecks() {
        const bottlenecks = [];
        const education = this.state.stemEducation;
        const workforce = this.state.researchWorkforce;
        
        if (education.k12_stem_programs < 15000) {
            bottlenecks.push('insufficient_k12_programs');
        }
        
        if (workforce.workforce_diversity_index < 0.7) {
            bottlenecks.push('diversity_challenges');
        }
        
        if (education.graduate_fellowships < 45000) {
            bottlenecks.push('limited_graduate_support');
        }
        
        return bottlenecks;
    }

    assessSTEMEducationImpact() {
        const education = this.state.stemEducation;
        const workforce = this.state.researchWorkforce;
        
        return {
            workforce_development_impact: workforce.stem_graduates_annual / 500000,
            public_literacy_impact: education.public_science_literacy,
            engagement_impact: Math.min(1.0, education.citizen_science_participation / 3000000),
            communication_impact: education.science_communication_effectiveness,
            overall_impact: this.calculateSTEMEducationOverallImpact(),
            impact_assessment: this.rateSTEMEducationImpact()
        };
    }

    calculateSTEMEducationOverallImpact() {
        const education = this.state.stemEducation;
        const workforce = this.state.researchWorkforce;
        
        return (workforce.stem_graduates_annual / 500000 + 
                education.public_science_literacy + 
                education.science_communication_effectiveness + 
                Math.min(1.0, education.citizen_science_participation / 3000000)) / 4;
    }

    rateSTEMEducationImpact() {
        const impact = this.calculateSTEMEducationOverallImpact();
        
        if (impact > 0.8) return 'transformational';
        if (impact > 0.7) return 'significant';
        if (impact > 0.6) return 'moderate';
        return 'limited';
    }

    identifyPublicEngagementOpportunities() {
        const opportunities = [];
        const education = this.state.stemEducation;
        
        if (education.public_science_literacy < 0.75) {
            opportunities.push({
                area: 'science_literacy_programs',
                target_audience: 'general_public',
                potential_impact: 'high'
            });
        }
        
        if (education.citizen_science_participation < 3000000) {
            opportunities.push({
                area: 'citizen_science_expansion',
                target_audience: 'engaged_citizens',
                potential_impact: 'medium'
            });
        }
        
        if (education.science_communication_effectiveness < 0.8) {
            opportunities.push({
                area: 'communication_training',
                target_audience: 'researchers',
                potential_impact: 'medium'
            });
        }
        
        return opportunities;
    }

    identifyEmergingTechPriorities() {
        const emerging = this.state.emergingTechnologies;
        const priorities = [];
        
        if (emerging.emerging_tech_readiness < 0.8) {
            priorities.push({
                technology: 'quantum_computing',
                priority: 'high',
                rationale: 'High breakthrough potential, needs readiness improvement'
            });
        }
        
        if (emerging.technology_convergence_index > 0.75) {
            priorities.push({
                technology: 'convergent_technologies',
                priority: 'medium',
                rationale: 'Strong convergence potential for breakthrough innovation'
            });
        }
        
        if (emerging.disruptive_innovation_rate < 0.35) {
            priorities.push({
                technology: 'disruptive_innovation_acceleration',
                priority: 'medium',
                rationale: 'Need to increase disruptive innovation rate'
            });
        }
        
        return priorities;
    }

    developEmergingTechRoadmap() {
        return {
            short_term: ['ai_integration', 'quantum_algorithms', 'synthetic_biology_applications'],
            medium_term: ['quantum_advantage', 'advanced_materials_deployment', 'robotics_automation'],
            long_term: ['quantum_supremacy', 'synthetic_biology_manufacturing', 'general_ai'],
            investment_timeline: this.createEmergingTechInvestmentTimeline(),
            milestone_tracking: this.defineEmergingTechMilestones()
        };
    }

    createEmergingTechInvestmentTimeline() {
        return {
            '1_year': ['quantum_research_expansion', 'ai_ethics_framework'],
            '3_years': ['quantum_computing_infrastructure', 'synthetic_biology_facilities'],
            '5_years': ['advanced_materials_manufacturing', 'robotics_integration'],
            '10_years': ['quantum_internet', 'synthetic_biology_ecosystem']
        };
    }

    defineEmergingTechMilestones() {
        return {
            quantum_computing: ['50_qubit_systems', '100_qubit_systems', 'quantum_advantage'],
            synthetic_biology: ['standardized_parts', 'automated_design', 'manufacturing_scale'],
            advanced_materials: ['lab_demonstration', 'pilot_production', 'commercial_deployment'],
            robotics: ['specialized_applications', 'general_purpose_robots', 'autonomous_systems']
        };
    }

    generateEmergingTechInvestmentRecommendations() {
        const recommendations = [];
        const emerging = this.state.emergingTechnologies;
        
        if (emerging.nanotechnology_investment < 3000000000) {
            recommendations.push({
                technology: 'nanotechnology',
                recommendation: 'increase_investment',
                target_investment: 3500000000,
                expected_roi: 'high'
            });
        }
        
        if (emerging.synthetic_biology_investment < 2500000000) {
            recommendations.push({
                technology: 'synthetic_biology',
                recommendation: 'accelerate_investment',
                target_investment: 3000000000,
                expected_roi: 'very_high'
            });
        }
        
        if (emerging.robotics_automation_investment < 5000000000) {
            recommendations.push({
                technology: 'robotics_automation',
                recommendation: 'maintain_investment',
                target_investment: 5500000000,
                expected_roi: 'medium'
            });
        }
        
        return recommendations;
    }

    assessPublicTrustInScience() {
        const policy = this.state.sciencePolicy;
        const education = this.state.stemEducation;
        
        return {
            trust_indicators: {
                research_integrity: policy.research_integrity_enforcement,
                transparency: policy.open_science_adoption,
                public_engagement: policy.public_engagement_level,
                science_literacy: education.public_science_literacy
            },
            trust_level: this.calculatePublicTrustLevel(),
            trust_factors: this.identifyTrustFactors(),
            trust_building_opportunities: this.identifyTrustBuildingOpportunities()
        };
    }

    calculatePublicTrustLevel() {
        const policy = this.state.sciencePolicy;
        const education = this.state.stemEducation;
        
        return (policy.research_integrity_enforcement + 
                policy.open_science_adoption + 
                policy.public_engagement_level + 
                education.public_science_literacy) / 4;
    }

    identifyTrustFactors() {
        const factors = [];
        const policy = this.state.sciencePolicy;
        const education = this.state.stemEducation;
        
        if (policy.research_integrity_enforcement > 0.9) {
            factors.push('strong_research_integrity');
        }
        
        if (education.science_communication_effectiveness > 0.75) {
            factors.push('effective_science_communication');
        }
        
        if (policy.public_engagement_level > 0.7) {
            factors.push('active_public_engagement');
        }
        
        return factors;
    }

    identifyTrustBuildingOpportunities() {
        const opportunities = [];
        const policy = this.state.sciencePolicy;
        const education = this.state.stemEducation;
        
        if (policy.public_engagement_level < 0.7) {
            opportunities.push({
                area: 'increase_public_engagement',
                potential_impact: 'high',
                strategies: ['town_halls', 'social_media', 'community_programs']
            });
        }
        
        if (education.science_communication_effectiveness < 0.8) {
            opportunities.push({
                area: 'improve_science_communication',
                potential_impact: 'medium',
                strategies: ['training_programs', 'media_partnerships', 'storytelling']
            });
        }
        
        return opportunities;
    }

    assessSciencePolicyEffectiveness() {
        const policy = this.state.sciencePolicy;
        
        return {
            coordination_effectiveness: policy.science_policy_coordination,
            evidence_integration: policy.evidence_based_policymaking,
            regulatory_integration: policy.regulatory_science_integration,
            governance_quality: this.calculateGovernanceQuality(),
            policy_impact: this.assessPolicyImpact(),
            improvement_areas: this.identifyPolicyImprovementAreas()
        };
    }

    calculateGovernanceQuality() {
        const policy = this.state.sciencePolicy;
        
        return (policy.research_ethics_compliance + 
                policy.research_integrity_enforcement + 
                policy.science_policy_coordination) / 3;
    }

    assessPolicyImpact() {
        const policy = this.state.sciencePolicy;
        const priorities = this.state.researchPriorities;
        
        return {
            research_direction_influence: policy.science_policy_coordination,
            regulatory_efficiency: policy.regulatory_science_integration,
            climate_policy_impact: priorities.climate_environmental_science.policy_impact,
            health_policy_impact: priorities.health_medical_research.clinical_translation_rate,
            overall_policy_impact: (policy.evidence_based_policymaking + 
                                  policy.regulatory_science_integration) / 2
        };
    }

    identifyPolicyImprovementAreas() {
        const areas = [];
        const policy = this.state.sciencePolicy;
        
        if (policy.science_policy_coordination < 0.8) {
            areas.push({
                area: 'policy_coordination',
                priority: 'high',
                recommendations: ['interagency_coordination', 'unified_strategy']
            });
        }
        
        if (policy.regulatory_science_integration < 0.75) {
            areas.push({
                area: 'regulatory_integration',
                priority: 'medium',
                recommendations: ['regulatory_science_programs', 'agency_collaboration']
            });
        }
        
        if (policy.public_engagement_level < 0.7) {
            areas.push({
                area: 'public_engagement',
                priority: 'medium',
                recommendations: ['citizen_participation', 'transparent_communication']
            });
        }
        
        return areas;
    }

    generateGovernanceRecommendations() {
        const recommendations = [];
        const policy = this.state.sciencePolicy;
        
        if (policy.science_policy_coordination < 0.8) {
            recommendations.push({
                area: 'coordination_improvement',
                priority: 'high',
                actions: ['establish_coordination_office', 'regular_interagency_meetings', 'unified_research_strategy']
            });
        }
        
        if (policy.open_science_adoption < 0.8) {
            recommendations.push({
                area: 'open_science_acceleration',
                priority: 'medium',
                actions: ['mandate_data_sharing', 'support_open_access', 'develop_platforms']
            });
        }
        
        if (policy.public_engagement_level < 0.7) {
            recommendations.push({
                area: 'public_engagement_enhancement',
                priority: 'medium',
                actions: ['citizen_advisory_panels', 'public_consultation', 'science_cafes']
            });
        }
        
        return recommendations;
    }

    generateFallbackOutputs() {
        return {
            research_capacity_assessment: {
                funding_metrics: {
                    total_rd_spending: 650000000000,
                    gdp_percentage: 0.032
                },
                capacity_assessment: { capacity_rating: 'good' }
            },
            scientific_output_analysis: {
                publication_metrics: {
                    peer_reviewed_publications: 425000,
                    citation_impact: 1.45
                },
                productivity_analysis: { efficiency_assessment: 'efficient' }
            },
            research_priority_performance: {
                performance_ranking: [
                    { field: 'artificial_intelligence', overall_score: 0.935 },
                    { field: 'health_medical_research', overall_score: 0.85 }
                ]
            },
            international_collaboration_status: {
                collaboration_metrics: { collaboration_effectiveness: 0.78 },
                competitive_positioning: { influence_rating: 'major_influence' }
            },
            technology_transfer_effectiveness: {
                transfer_metrics: { commercialization_success: 0.32 },
                ip_portfolio: { intellectual_property: 125000 }
            },
            stem_education_impact: {
                education_metrics: { stem_funding: 18000000000 },
                education_impact_assessment: { impact_assessment: 'significant' }
            },
            emerging_technology_readiness: {
                readiness_assessment: { technology_readiness: 0.65 },
                strategic_priorities: [{ technology: 'quantum_computing', priority: 'high' }]
            },
            science_policy_integration: {
                policy_coordination: { coordination_effectiveness: 0.72 },
                policy_effectiveness: { overall_policy_impact: 0.7 }
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallPerformance: this.state.performanceMetrics.overall_science_system_performance,
            researchProductivity: this.state.performanceMetrics.research_productivity_index,
            innovationCapacity: this.state.performanceMetrics.innovation_capacity,
            internationalCompetitiveness: this.state.performanceMetrics.international_competitiveness,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.researchFunding.rd_spending_gdp_percentage = 0.032;
        this.state.scientificOutput.citation_impact_index = 1.45;
        this.state.performanceMetrics.overall_science_system_performance = 0.82;
        console.log('🔬 Science System reset');
    }
}

module.exports = { ScienceSystem };
