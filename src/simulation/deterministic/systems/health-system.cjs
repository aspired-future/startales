// Health System - Public health, healthcare policy, and medical infrastructure
// Provides comprehensive health and medical capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class HealthSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('health-system', config);
        
        // System state
        this.state = {
            // Healthcare Infrastructure
            healthcareInfrastructure: {
                hospitals: 6090,
                clinics: 9000,
                emergency_rooms: 5564,
                icu_beds: 96596,
                hospital_beds_per_1000: 2.9,
                physicians_per_1000: 2.6,
                nurses_per_1000: 11.7,
                healthcare_workers: 22000000
            },
            
            // Public Health Metrics
            publicHealthMetrics: {
                life_expectancy: 78.9,
                infant_mortality_rate: 5.8, // per 1000 births
                maternal_mortality_rate: 17.4, // per 100,000 births
                vaccination_coverage: 0.92,
                disease_surveillance_coverage: 0.85,
                health_emergency_preparedness: 0.75
            },
            
            // Healthcare Access & Quality
            healthcareAccess: {
                health_insurance_coverage: 0.91,
                uninsured_population: 0.09,
                healthcare_affordability_index: 0.65,
                rural_healthcare_access: 0.6,
                specialist_wait_times: 28, // days
                primary_care_availability: 0.8
            },
            
            // Disease Prevention & Control
            diseaseControl: {
                chronic_disease_prevalence: 0.45,
                infectious_disease_control: 0.88,
                mental_health_support_coverage: 0.7,
                substance_abuse_treatment_capacity: 0.6,
                preventive_care_utilization: 0.72,
                health_screening_participation: 0.68
            },
            
            // Healthcare Financing
            healthcareFinancing: {
                healthcare_spending_gdp_percentage: 0.175, // 17.5% of GDP
                public_health_spending_share: 0.64,
                private_health_spending_share: 0.36,
                per_capita_health_expenditure: 11582, // USD
                healthcare_cost_inflation: 0.035, // 3.5% annually
                cost_effectiveness_index: 0.68
            },
            
            // Medical Research & Innovation
            medicalResearch: {
                research_funding_percentage: 0.04, // 4% of health budget
                clinical_trials_active: 3500,
                medical_patents_annual: 8500,
                pharmaceutical_innovation_index: 0.82,
                medical_device_innovation: 0.78,
                research_institutions: 450
            },
            
            // Health Technology
            healthTechnology: {
                electronic_health_records_adoption: 0.86,
                telemedicine_utilization: 0.38,
                ai_diagnostic_tools_deployment: 0.25,
                health_data_interoperability: 0.62,
                digital_health_investment: 15000000000, // $15B
                cybersecurity_compliance: 0.74
            },
            
            // Workforce Development
            workforceDevelopment: {
                medical_school_capacity: 180000, // annual graduates
                nursing_school_capacity: 250000,
                continuing_education_participation: 0.78,
                healthcare_worker_satisfaction: 0.65,
                physician_burnout_rate: 0.42,
                workforce_diversity_index: 0.68
            },
            
            // Emergency Preparedness
            emergencyPreparedness: {
                pandemic_response_capability: 0.72,
                disaster_medical_response: 0.8,
                strategic_medical_reserves: 0.75,
                emergency_communication_systems: 0.85,
                hospital_surge_capacity: 0.65,
                public_health_emergency_coordination: 0.78
            },
            
            // Health Equity & Social Determinants
            healthEquity: {
                health_disparities_index: 0.35, // Lower is better
                social_determinants_address_level: 0.6,
                community_health_programs: 2500,
                health_literacy_rate: 0.76,
                environmental_health_protection: 0.72,
                food_security_programs_coverage: 0.68
            },
            
            // International Health Cooperation
            internationalHealth: {
                global_health_initiatives: 25,
                health_diplomacy_engagement: 0.7,
                medical_aid_contributions: 8500000000, // $8.5B
                health_research_collaborations: 180,
                disease_surveillance_cooperation: 0.82,
                health_security_partnerships: 15
            },
            
            // Performance Metrics
            performanceMetrics: {
                overall_health_system_performance: 0.74,
                population_health_outcomes: 0.76,
                healthcare_quality_index: 0.78,
                health_system_efficiency: 0.65,
                health_security_preparedness: 0.75,
                health_innovation_capacity: 0.72
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('healthcare_funding_level', 'float', 0.175, 
            'Healthcare spending as percentage of GDP', 0.08, 0.25);
        
        this.addInputKnob('public_health_investment_priority', 'float', 0.7, 
            'Priority given to public health and prevention programs', 0.0, 1.0);
        
        this.addInputKnob('healthcare_access_emphasis', 'float', 0.8, 
            'Emphasis on universal healthcare access and coverage', 0.0, 1.0);
        
        this.addInputKnob('medical_research_funding_level', 'float', 0.04, 
            'Medical research funding as percentage of health budget', 0.01, 0.1);
        
        this.addInputKnob('health_technology_adoption_pace', 'float', 0.7, 
            'Pace of health technology adoption and digitalization', 0.0, 1.0);
        
        this.addInputKnob('preventive_care_emphasis', 'float', 0.7, 
            'Emphasis on preventive care and early intervention', 0.0, 1.0);
        
        this.addInputKnob('mental_health_priority', 'float', 0.6, 
            'Priority given to mental health services and support', 0.0, 1.0);
        
        this.addInputKnob('health_workforce_investment', 'float', 0.7, 
            'Investment in healthcare workforce development and retention', 0.0, 1.0);
        
        this.addInputKnob('emergency_preparedness_focus', 'float', 0.75, 
            'Focus on emergency preparedness and pandemic response', 0.0, 1.0);
        
        this.addInputKnob('health_equity_commitment', 'float', 0.6, 
            'Commitment to addressing health disparities and equity', 0.0, 1.0);
        
        this.addInputKnob('international_health_engagement', 'float', 0.7, 
            'Level of international health cooperation and aid', 0.0, 1.0);
        
        this.addInputKnob('healthcare_cost_control_emphasis', 'float', 0.6, 
            'Emphasis on controlling healthcare costs and improving efficiency', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('healthcare_infrastructure_status', 'object', 
            'Healthcare infrastructure capacity and resource availability');
        
        this.addOutputChannel('public_health_performance', 'object', 
            'Public health metrics and population health outcomes');
        
        this.addOutputChannel('healthcare_access_analysis', 'object', 
            'Healthcare access, coverage, and affordability metrics');
        
        this.addOutputChannel('disease_prevention_effectiveness', 'object', 
            'Disease prevention and control program effectiveness');
        
        this.addOutputChannel('healthcare_financing_analysis', 'object', 
            'Healthcare financing sustainability and cost analysis');
        
        this.addOutputChannel('medical_innovation_status', 'object', 
            'Medical research and innovation capacity and outcomes');
        
        this.addOutputChannel('health_technology_progress', 'object', 
            'Health technology adoption and digital health advancement');
        
        this.addOutputChannel('health_system_resilience', 'object', 
            'Emergency preparedness and health system resilience metrics');
        
        console.log('🏥 Health System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update healthcare infrastructure
            this.updateHealthcareInfrastructure(aiInputs);
            
            // Process public health metrics
            this.processPublicHealthMetrics(gameState, aiInputs);
            
            // Update healthcare access
            this.updateHealthcareAccess(aiInputs);
            
            // Process disease control
            this.processDiseaseControl(gameState, aiInputs);
            
            // Update healthcare financing
            this.updateHealthcareFinancing(aiInputs);
            
            // Process medical research
            this.processMedicalResearch(aiInputs);
            
            // Update health technology
            this.updateHealthTechnology(aiInputs);
            
            // Process workforce development
            this.processWorkforceDevelopment(aiInputs);
            
            // Update emergency preparedness
            this.updateEmergencyPreparedness(gameState, aiInputs);
            
            // Process health equity
            this.processHealthEquity(aiInputs);
            
            // Update international health cooperation
            this.updateInternationalHealth(aiInputs);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🏥 Health System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateHealthcareInfrastructure(aiInputs) {
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        const workforceInvestment = aiInputs.health_workforce_investment || 0.7;
        
        const infrastructure = this.state.healthcareInfrastructure;
        
        // Update healthcare capacity based on funding
        const fundingMultiplier = fundingLevel / 0.175; // Relative to baseline
        
        // Update hospital beds per 1000 people
        infrastructure.hospital_beds_per_1000 = Math.min(4.0, 
            2.5 + fundingMultiplier * 0.5);
        
        // Update healthcare workers based on workforce investment
        infrastructure.healthcare_workers = Math.floor(20000000 + 
            workforceInvestment * 5000000);
        
        // Update physicians per 1000
        infrastructure.physicians_per_1000 = Math.min(3.5, 
            2.2 + workforceInvestment * 1.0);
        
        // Update nurses per 1000
        infrastructure.nurses_per_1000 = Math.min(15.0, 
            10.0 + workforceInvestment * 4.0);
        
        // Update infrastructure based on funding growth
        if (fundingMultiplier > 1.1) {
            infrastructure.hospitals = Math.min(7000, infrastructure.hospitals + 50);
            infrastructure.clinics = Math.min(10000, infrastructure.clinics + 100);
            infrastructure.icu_beds = Math.min(120000, infrastructure.icu_beds + 2000);
        }
    }

    processPublicHealthMetrics(gameState, aiInputs) {
        const publicHealthPriority = aiInputs.public_health_investment_priority || 0.7;
        const preventiveCareEmphasis = aiInputs.preventive_care_emphasis || 0.7;
        const emergencyPreparedness = aiInputs.emergency_preparedness_focus || 0.75;
        
        const publicHealth = this.state.publicHealthMetrics;
        
        // Update life expectancy based on healthcare quality and access
        const healthcareQuality = this.calculateHealthcareQuality();
        publicHealth.life_expectancy = Math.min(85.0, 
            76.0 + healthcareQuality * 8.0);
        
        // Update infant mortality rate (lower is better)
        publicHealth.infant_mortality_rate = Math.max(2.0, 
            8.0 - publicHealthPriority * 3.0);
        
        // Update maternal mortality rate (lower is better)
        publicHealth.maternal_mortality_rate = Math.max(5.0, 
            25.0 - publicHealthPriority * 10.0);
        
        // Update vaccination coverage
        publicHealth.vaccination_coverage = Math.min(0.98, 
            0.85 + publicHealthPriority * 0.12);
        
        // Update disease surveillance coverage
        publicHealth.disease_surveillance_coverage = Math.min(0.95, 
            0.75 + publicHealthPriority * 0.18);
        
        // Update health emergency preparedness
        publicHealth.health_emergency_preparedness = emergencyPreparedness;
        
        // Process health emergencies from game state
        if (gameState.healthEmergencies) {
            this.processHealthEmergencies(gameState.healthEmergencies, emergencyPreparedness);
        }
        
        // Process disease outbreaks from game state
        if (gameState.diseaseOutbreaks) {
            this.processDiseaseOutbreaks(gameState.diseaseOutbreaks, publicHealthPriority);
        }
    }

    processHealthEmergencies(emergencies, preparedness) {
        emergencies.forEach(emergency => {
            const responseEffectiveness = preparedness * 0.8;
            
            console.log(`🏥 Health System: Responding to ${emergency.type} with ${responseEffectiveness.toFixed(2)} effectiveness`);
            
            // Emergency affects public health metrics temporarily
            if (emergency.severity > 0.7) {
                this.state.publicHealthMetrics.health_emergency_preparedness = Math.max(0.5, 
                    this.state.publicHealthMetrics.health_emergency_preparedness - emergency.severity * 0.1);
            }
        });
    }

    processDiseaseOutbreaks(outbreaks, publicHealthPriority) {
        outbreaks.forEach(outbreak => {
            const containmentCapability = publicHealthPriority * 
                this.state.publicHealthMetrics.disease_surveillance_coverage;
            
            console.log(`🏥 Health System: Managing ${outbreak.disease} outbreak with ${containmentCapability.toFixed(2)} containment capability`);
            
            // Outbreak affects disease control metrics
            if (outbreak.severity > containmentCapability) {
                this.state.diseaseControl.infectious_disease_control = Math.max(0.6, 
                    this.state.diseaseControl.infectious_disease_control - 0.05);
            }
        });
    }

    updateHealthcareAccess(aiInputs) {
        const accessEmphasis = aiInputs.healthcare_access_emphasis || 0.8;
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        const equityCommitment = aiInputs.health_equity_commitment || 0.6;
        
        const access = this.state.healthcareAccess;
        
        // Update health insurance coverage
        access.health_insurance_coverage = Math.min(0.98, 
            0.85 + accessEmphasis * 0.12);
        
        // Update uninsured population (inverse of coverage)
        access.uninsured_population = 1 - access.health_insurance_coverage;
        
        // Update healthcare affordability
        const fundingAdequacy = Math.min(1.0, fundingLevel / 0.15);
        access.healthcare_affordability_index = Math.min(0.9, 
            0.5 + fundingAdequacy * 0.3 + accessEmphasis * 0.1);
        
        // Update rural healthcare access
        access.rural_healthcare_access = Math.min(0.85, 
            0.45 + equityCommitment * 0.35);
        
        // Update specialist wait times (lower is better)
        access.specialist_wait_times = Math.max(14, 
            40 - accessEmphasis * 15);
        
        // Update primary care availability
        access.primary_care_availability = Math.min(0.95, 
            0.65 + accessEmphasis * 0.25);
    }

    processDiseaseControl(gameState, aiInputs) {
        const preventiveCareEmphasis = aiInputs.preventive_care_emphasis || 0.7;
        const mentalHealthPriority = aiInputs.mental_health_priority || 0.6;
        const publicHealthPriority = aiInputs.public_health_investment_priority || 0.7;
        
        const disease = this.state.diseaseControl;
        
        // Update chronic disease prevalence (lower is better)
        disease.chronic_disease_prevalence = Math.max(0.35, 
            0.55 - preventiveCareEmphasis * 0.15);
        
        // Update infectious disease control
        disease.infectious_disease_control = Math.min(0.95, 
            0.8 + publicHealthPriority * 0.13);
        
        // Update mental health support coverage
        disease.mental_health_support_coverage = Math.min(0.9, 
            0.5 + mentalHealthPriority * 0.35);
        
        // Update substance abuse treatment capacity
        disease.substance_abuse_treatment_capacity = Math.min(0.85, 
            0.4 + mentalHealthPriority * 0.4);
        
        // Update preventive care utilization
        disease.preventive_care_utilization = Math.min(0.9, 
            0.6 + preventiveCareEmphasis * 0.25);
        
        // Update health screening participation
        disease.health_screening_participation = Math.min(0.85, 
            0.55 + preventiveCareEmphasis * 0.25);
        
        // Process chronic disease data from game state
        if (gameState.chronicDiseaseData) {
            this.processChronicDiseaseData(gameState.chronicDiseaseData, preventiveCareEmphasis);
        }
    }

    processChronicDiseaseData(diseaseData, preventiveEmphasis) {
        const disease = this.state.diseaseControl;
        
        // Update chronic disease prevalence based on game data
        if (diseaseData.overall_prevalence) {
            disease.chronic_disease_prevalence = diseaseData.overall_prevalence;
        }
        
        // Preventive care emphasis helps reduce chronic disease burden
        if (preventiveEmphasis > 0.8) {
            disease.chronic_disease_prevalence = Math.max(0.3, 
                disease.chronic_disease_prevalence * 0.98);
        }
    }

    updateHealthcareFinancing(aiInputs) {
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        const costControlEmphasis = aiInputs.healthcare_cost_control_emphasis || 0.6;
        const accessEmphasis = aiInputs.healthcare_access_emphasis || 0.8;
        
        const financing = this.state.healthcareFinancing;
        
        // Update healthcare spending as percentage of GDP
        financing.healthcare_spending_gdp_percentage = fundingLevel;
        
        // Update public vs private spending share based on access emphasis
        financing.public_health_spending_share = Math.min(0.8, 
            0.5 + accessEmphasis * 0.25);
        financing.private_health_spending_share = 1 - financing.public_health_spending_share;
        
        // Update per capita health expenditure
        const baseExpenditure = 10000;
        financing.per_capita_health_expenditure = Math.floor(
            baseExpenditure * (fundingLevel / 0.15));
        
        // Update healthcare cost inflation (cost control helps)
        financing.healthcare_cost_inflation = Math.max(0.02, 
            0.05 - costControlEmphasis * 0.02);
        
        // Update cost effectiveness index
        financing.cost_effectiveness_index = Math.min(0.85, 
            0.5 + costControlEmphasis * 0.25 + this.calculateHealthcareQuality() * 0.1);
    }

    processMedicalResearch(aiInputs) {
        const researchFunding = aiInputs.medical_research_funding_level || 0.04;
        const innovationPriority = aiInputs.health_technology_adoption_pace || 0.7;
        
        const research = this.state.medicalResearch;
        
        // Update research funding percentage
        research.research_funding_percentage = researchFunding;
        
        // Update clinical trials based on funding
        research.clinical_trials_active = Math.floor(2500 + 
            researchFunding * 25000);
        
        // Update medical patents
        research.medical_patents_annual = Math.floor(6000 + 
            researchFunding * 62500);
        
        // Update pharmaceutical innovation index
        research.pharmaceutical_innovation_index = Math.min(0.95, 
            0.7 + researchFunding * 5.0);
        
        // Update medical device innovation
        research.medical_device_innovation = Math.min(0.9, 
            0.6 + innovationPriority * 0.25);
        
        // Update research institutions
        research.research_institutions = Math.floor(350 + 
            researchFunding * 2500);
    }

    updateHealthTechnology(aiInputs) {
        const techAdoptionPace = aiInputs.health_technology_adoption_pace || 0.7;
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        
        const technology = this.state.healthTechnology;
        
        // Update electronic health records adoption
        technology.electronic_health_records_adoption = Math.min(0.95, 
            0.75 + techAdoptionPace * 0.18);
        
        // Update telemedicine utilization
        technology.telemedicine_utilization = Math.min(0.7, 
            0.25 + techAdoptionPace * 0.4);
        
        // Update AI diagnostic tools deployment
        technology.ai_diagnostic_tools_deployment = Math.min(0.6, 
            0.1 + techAdoptionPace * 0.45);
        
        // Update health data interoperability
        technology.health_data_interoperability = Math.min(0.85, 
            0.45 + techAdoptionPace * 0.35);
        
        // Update digital health investment
        const fundingMultiplier = fundingLevel / 0.175;
        technology.digital_health_investment = Math.floor(12000000000 * 
            (1 + techAdoptionPace * 0.5) * fundingMultiplier);
        
        // Update cybersecurity compliance
        technology.cybersecurity_compliance = Math.min(0.9, 
            0.6 + techAdoptionPace * 0.25);
    }

    processWorkforceDevelopment(aiInputs) {
        const workforceInvestment = aiInputs.health_workforce_investment || 0.7;
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        
        const workforce = this.state.workforceDevelopment;
        
        // Update medical school capacity
        workforce.medical_school_capacity = Math.floor(150000 + 
            workforceInvestment * 60000);
        
        // Update nursing school capacity
        workforce.nursing_school_capacity = Math.floor(200000 + 
            workforceInvestment * 100000);
        
        // Update continuing education participation
        workforce.continuing_education_participation = Math.min(0.9, 
            0.65 + workforceInvestment * 0.2);
        
        // Update healthcare worker satisfaction
        workforce.healthcare_worker_satisfaction = Math.min(0.85, 
            0.5 + workforceInvestment * 0.3 + (fundingLevel / 0.175 - 1) * 0.1);
        
        // Update physician burnout rate (lower is better)
        workforce.physician_burnout_rate = Math.max(0.25, 
            0.5 - workforceInvestment * 0.2);
        
        // Update workforce diversity index
        workforce.workforce_diversity_index = Math.min(0.8, 
            0.6 + workforceInvestment * 0.15);
    }

    updateEmergencyPreparedness(gameState, aiInputs) {
        const emergencyFocus = aiInputs.emergency_preparedness_focus || 0.75;
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        
        const emergency = this.state.emergencyPreparedness;
        
        // Update pandemic response capability
        emergency.pandemic_response_capability = Math.min(0.9, 
            0.6 + emergencyFocus * 0.25);
        
        // Update disaster medical response
        emergency.disaster_medical_response = Math.min(0.95, 
            0.7 + emergencyFocus * 0.2);
        
        // Update strategic medical reserves
        emergency.strategic_medical_reserves = Math.min(0.9, 
            0.6 + emergencyFocus * 0.25);
        
        // Update emergency communication systems
        emergency.emergency_communication_systems = Math.min(0.95, 
            0.75 + emergencyFocus * 0.18);
        
        // Update hospital surge capacity
        const fundingMultiplier = fundingLevel / 0.175;
        emergency.hospital_surge_capacity = Math.min(0.85, 
            0.5 + emergencyFocus * 0.25 + (fundingMultiplier - 1) * 0.1);
        
        // Update public health emergency coordination
        emergency.public_health_emergency_coordination = Math.min(0.9, 
            0.65 + emergencyFocus * 0.2);
        
        // Process emergency scenarios from game state
        if (gameState.emergencyScenarios) {
            this.processEmergencyScenarios(gameState.emergencyScenarios, emergencyFocus);
        }
    }

    processEmergencyScenarios(scenarios, preparedness) {
        scenarios.forEach(scenario => {
            const responseCapability = preparedness * 0.9;
            
            if (scenario.type === 'pandemic') {
                // Pandemic affects multiple preparedness metrics
                this.state.emergencyPreparedness.pandemic_response_capability = Math.min(1.0, 
                    this.state.emergencyPreparedness.pandemic_response_capability + 
                    (responseCapability - scenario.severity) * 0.1);
            } else if (scenario.type === 'natural_disaster') {
                // Natural disaster affects medical response
                this.state.emergencyPreparedness.disaster_medical_response = Math.min(1.0, 
                    this.state.emergencyPreparedness.disaster_medical_response + 
                    (responseCapability - scenario.severity) * 0.1);
            }
        });
    }

    processHealthEquity(aiInputs) {
        const equityCommitment = aiInputs.health_equity_commitment || 0.6;
        const accessEmphasis = aiInputs.healthcare_access_emphasis || 0.8;
        const publicHealthPriority = aiInputs.public_health_investment_priority || 0.7;
        
        const equity = this.state.healthEquity;
        
        // Update health disparities index (lower is better)
        equity.health_disparities_index = Math.max(0.2, 
            0.45 - equityCommitment * 0.2);
        
        // Update social determinants address level
        equity.social_determinants_address_level = Math.min(0.85, 
            0.4 + equityCommitment * 0.4);
        
        // Update community health programs
        equity.community_health_programs = Math.floor(2000 + 
            equityCommitment * 1000);
        
        // Update health literacy rate
        equity.health_literacy_rate = Math.min(0.9, 
            0.65 + publicHealthPriority * 0.2);
        
        // Update environmental health protection
        equity.environmental_health_protection = Math.min(0.85, 
            0.6 + equityCommitment * 0.2);
        
        // Update food security programs coverage
        equity.food_security_programs_coverage = Math.min(0.8, 
            0.55 + equityCommitment * 0.2);
    }

    updateInternationalHealth(aiInputs) {
        const internationalEngagement = aiInputs.international_health_engagement || 0.7;
        const fundingLevel = aiInputs.healthcare_funding_level || 0.175;
        
        const international = this.state.internationalHealth;
        
        // Update global health initiatives
        international.global_health_initiatives = Math.floor(20 + 
            internationalEngagement * 15);
        
        // Update health diplomacy engagement
        international.health_diplomacy_engagement = internationalEngagement;
        
        // Update medical aid contributions
        const fundingMultiplier = fundingLevel / 0.175;
        international.medical_aid_contributions = Math.floor(7000000000 * 
            internationalEngagement * fundingMultiplier);
        
        // Update health research collaborations
        international.health_research_collaborations = Math.floor(150 + 
            internationalEngagement * 60);
        
        // Update disease surveillance cooperation
        international.disease_surveillance_cooperation = Math.min(0.95, 
            0.7 + internationalEngagement * 0.2);
        
        // Update health security partnerships
        international.health_security_partnerships = Math.floor(12 + 
            internationalEngagement * 8);
    }

    calculatePerformanceMetrics(gameState) {
        const metrics = this.state.performanceMetrics;
        
        // Calculate overall health system performance
        const infrastructureScore = this.calculateInfrastructureScore();
        const accessScore = this.calculateAccessScore();
        const qualityScore = this.calculateHealthcareQuality();
        
        metrics.overall_health_system_performance = (infrastructureScore + accessScore + qualityScore) / 3;
        
        // Calculate population health outcomes
        const lifeExpectancyScore = Math.min(1.0, this.state.publicHealthMetrics.life_expectancy / 85);
        const mortalityScore = 1 - (this.state.publicHealthMetrics.infant_mortality_rate / 20);
        const diseaseControlScore = this.state.diseaseControl.infectious_disease_control;
        
        metrics.population_health_outcomes = (lifeExpectancyScore + mortalityScore + diseaseControlScore) / 3;
        
        // Calculate healthcare quality index
        metrics.healthcare_quality_index = this.calculateHealthcareQuality();
        
        // Calculate health system efficiency
        const costEffectiveness = this.state.healthcareFinancing.cost_effectiveness_index;
        const technologyEfficiency = this.calculateTechnologyEfficiency();
        
        metrics.health_system_efficiency = (costEffectiveness + technologyEfficiency) / 2;
        
        // Calculate health security preparedness
        const emergencyPreparedness = this.calculateEmergencyPreparednessScore();
        const diseaseControl = this.state.diseaseControl.infectious_disease_control;
        
        metrics.health_security_preparedness = (emergencyPreparedness + diseaseControl) / 2;
        
        // Calculate health innovation capacity
        const researchCapacity = this.calculateResearchCapacity();
        const technologyAdoption = this.calculateTechnologyAdoption();
        
        metrics.health_innovation_capacity = (researchCapacity + technologyAdoption) / 2;
    }

    calculateInfrastructureScore() {
        const infrastructure = this.state.healthcareInfrastructure;
        
        const bedsScore = Math.min(1.0, infrastructure.hospital_beds_per_1000 / 4.0);
        const physiciansScore = Math.min(1.0, infrastructure.physicians_per_1000 / 3.5);
        const nursesScore = Math.min(1.0, infrastructure.nurses_per_1000 / 15.0);
        
        return (bedsScore + physiciansScore + nursesScore) / 3;
    }

    calculateAccessScore() {
        const access = this.state.healthcareAccess;
        
        const coverageScore = access.health_insurance_coverage;
        const affordabilityScore = access.healthcare_affordability_index;
        const availabilityScore = access.primary_care_availability;
        
        return (coverageScore + affordabilityScore + availabilityScore) / 3;
    }

    calculateHealthcareQuality() {
        const publicHealth = this.state.publicHealthMetrics;
        const access = this.state.healthcareAccess;
        
        const lifeExpectancyScore = Math.min(1.0, publicHealth.life_expectancy / 85);
        const mortalityScore = 1 - (publicHealth.infant_mortality_rate / 20);
        const accessScore = this.calculateAccessScore();
        
        return (lifeExpectancyScore + mortalityScore + accessScore) / 3;
    }

    calculateTechnologyEfficiency() {
        const technology = this.state.healthTechnology;
        
        const ehrScore = technology.electronic_health_records_adoption;
        const telemedicineScore = technology.telemedicine_utilization;
        const interoperabilityScore = technology.health_data_interoperability;
        
        return (ehrScore + telemedicineScore + interoperabilityScore) / 3;
    }

    calculateEmergencyPreparednessScore() {
        const emergency = this.state.emergencyPreparedness;
        
        const preparednessFactors = [
            emergency.pandemic_response_capability,
            emergency.disaster_medical_response,
            emergency.strategic_medical_reserves,
            emergency.hospital_surge_capacity,
            emergency.public_health_emergency_coordination
        ];
        
        return preparednessFactors.reduce((sum, factor) => sum + factor, 0) / preparednessFactors.length;
    }

    calculateResearchCapacity() {
        const research = this.state.medicalResearch;
        
        const fundingScore = Math.min(1.0, research.research_funding_percentage / 0.08);
        const innovationScore = research.pharmaceutical_innovation_index;
        const institutionsScore = Math.min(1.0, research.research_institutions / 500);
        
        return (fundingScore + innovationScore + institutionsScore) / 3;
    }

    calculateTechnologyAdoption() {
        const technology = this.state.healthTechnology;
        
        const adoptionFactors = [
            technology.electronic_health_records_adoption,
            technology.telemedicine_utilization,
            technology.ai_diagnostic_tools_deployment,
            technology.health_data_interoperability
        ];
        
        return adoptionFactors.reduce((sum, factor) => sum + factor, 0) / adoptionFactors.length;
    }

    generateOutputs() {
        return {
            healthcare_infrastructure_status: {
                capacity_metrics: {
                    hospitals: this.state.healthcareInfrastructure.hospitals,
                    clinics: this.state.healthcareInfrastructure.clinics,
                    hospital_beds_per_1000: this.state.healthcareInfrastructure.hospital_beds_per_1000,
                    icu_beds: this.state.healthcareInfrastructure.icu_beds
                },
                workforce_metrics: {
                    physicians_per_1000: this.state.healthcareInfrastructure.physicians_per_1000,
                    nurses_per_1000: this.state.healthcareInfrastructure.nurses_per_1000,
                    total_healthcare_workers: this.state.healthcareInfrastructure.healthcare_workers
                },
                infrastructure_adequacy: this.assessInfrastructureAdequacy(),
                capacity_utilization: this.calculateCapacityUtilization(),
                infrastructure_gaps: this.identifyInfrastructureGaps()
            },
            
            public_health_performance: {
                health_outcomes: {
                    life_expectancy: this.state.publicHealthMetrics.life_expectancy,
                    infant_mortality_rate: this.state.publicHealthMetrics.infant_mortality_rate,
                    maternal_mortality_rate: this.state.publicHealthMetrics.maternal_mortality_rate
                },
                prevention_metrics: {
                    vaccination_coverage: this.state.publicHealthMetrics.vaccination_coverage,
                    disease_surveillance_coverage: this.state.publicHealthMetrics.disease_surveillance_coverage,
                    preventive_care_utilization: this.state.diseaseControl.preventive_care_utilization
                },
                population_health_trends: this.analyzePopulationHealthTrends(),
                public_health_program_effectiveness: this.assessPublicHealthProgramEffectiveness(),
                health_promotion_impact: this.calculateHealthPromotionImpact()
            },
            
            healthcare_access_analysis: {
                coverage_metrics: {
                    insurance_coverage: this.state.healthcareAccess.health_insurance_coverage,
                    uninsured_population: this.state.healthcareAccess.uninsured_population,
                    affordability_index: this.state.healthcareAccess.healthcare_affordability_index
                },
                access_barriers: {
                    rural_access: this.state.healthcareAccess.rural_healthcare_access,
                    specialist_wait_times: this.state.healthcareAccess.specialist_wait_times,
                    primary_care_availability: this.state.healthcareAccess.primary_care_availability
                },
                access_equity_analysis: this.analyzeAccessEquity(),
                coverage_gaps: this.identifyCoverageGaps(),
                access_improvement_opportunities: this.identifyAccessImprovementOpportunities()
            },
            
            disease_prevention_effectiveness: {
                chronic_disease_management: {
                    prevalence: this.state.diseaseControl.chronic_disease_prevalence,
                    prevention_effectiveness: 1 - this.state.diseaseControl.chronic_disease_prevalence,
                    screening_participation: this.state.diseaseControl.health_screening_participation
                },
                infectious_disease_control: {
                    control_effectiveness: this.state.diseaseControl.infectious_disease_control,
                    surveillance_coverage: this.state.publicHealthMetrics.disease_surveillance_coverage,
                    outbreak_response_capability: this.assessOutbreakResponseCapability()
                },
                mental_health_services: {
                    support_coverage: this.state.diseaseControl.mental_health_support_coverage,
                    substance_abuse_treatment: this.state.diseaseControl.substance_abuse_treatment_capacity,
                    mental_health_outcomes: this.assessMentalHealthOutcomes()
                },
                prevention_program_roi: this.calculatePreventionProgramROI()
            },
            
            healthcare_financing_analysis: {
                spending_metrics: {
                    gdp_percentage: this.state.healthcareFinancing.healthcare_spending_gdp_percentage,
                    per_capita_expenditure: this.state.healthcareFinancing.per_capita_health_expenditure,
                    public_private_split: {
                        public_share: this.state.healthcareFinancing.public_health_spending_share,
                        private_share: this.state.healthcareFinancing.private_health_spending_share
                    }
                },
                cost_analysis: {
                    cost_inflation: this.state.healthcareFinancing.healthcare_cost_inflation,
                    cost_effectiveness: this.state.healthcareFinancing.cost_effectiveness_index,
                    cost_drivers: this.identifyCostDrivers()
                },
                financial_sustainability: this.assessFinancialSustainability(),
                value_for_money_analysis: this.calculateValueForMoney(),
                financing_reform_opportunities: this.identifyFinancingReformOpportunities()
            },
            
            medical_innovation_status: {
                research_capacity: {
                    funding_level: this.state.medicalResearch.research_funding_percentage,
                    active_trials: this.state.medicalResearch.clinical_trials_active,
                    research_institutions: this.state.medicalResearch.research_institutions
                },
                innovation_outcomes: {
                    medical_patents: this.state.medicalResearch.medical_patents_annual,
                    pharmaceutical_innovation: this.state.medicalResearch.pharmaceutical_innovation_index,
                    device_innovation: this.state.medicalResearch.medical_device_innovation
                },
                research_ecosystem_health: this.assessResearchEcosystemHealth(),
                innovation_translation: this.assessInnovationTranslation(),
                research_priorities: this.identifyResearchPriorities()
            },
            
            health_technology_progress: {
                digital_adoption: {
                    ehr_adoption: this.state.healthTechnology.electronic_health_records_adoption,
                    telemedicine_utilization: this.state.healthTechnology.telemedicine_utilization,
                    ai_tools_deployment: this.state.healthTechnology.ai_diagnostic_tools_deployment
                },
                technology_infrastructure: {
                    data_interoperability: this.state.healthTechnology.health_data_interoperability,
                    cybersecurity_compliance: this.state.healthTechnology.cybersecurity_compliance,
                    digital_investment: this.state.healthTechnology.digital_health_investment
                },
                technology_impact_assessment: this.assessTechnologyImpact(),
                digital_divide_analysis: this.analyzeDigitalDivide(),
                technology_roadmap: this.developTechnologyRoadmap()
            },
            
            health_system_resilience: {
                emergency_preparedness: this.state.emergencyPreparedness,
                resilience_assessment: this.assessSystemResilience(),
                vulnerability_analysis: this.analyzeSystemVulnerabilities(),
                adaptive_capacity: this.assessAdaptiveCapacity(),
                resilience_building_priorities: this.identifyResilienceBuildingPriorities()
            }
        };
    }

    assessInfrastructureAdequacy() {
        const infrastructure = this.state.healthcareInfrastructure;
        
        return {
            hospital_bed_adequacy: infrastructure.hospital_beds_per_1000 > 3.0 ? 'adequate' : 
                                  infrastructure.hospital_beds_per_1000 > 2.5 ? 'moderate' : 'inadequate',
            physician_adequacy: infrastructure.physicians_per_1000 > 2.8 ? 'adequate' : 
                               infrastructure.physicians_per_1000 > 2.2 ? 'moderate' : 'inadequate',
            nurse_adequacy: infrastructure.nurses_per_1000 > 12.0 ? 'adequate' : 
                           infrastructure.nurses_per_1000 > 10.0 ? 'moderate' : 'inadequate',
            overall_adequacy: this.calculateInfrastructureScore() > 0.8 ? 'adequate' : 
                             this.calculateInfrastructureScore() > 0.6 ? 'moderate' : 'inadequate'
        };
    }

    calculateCapacityUtilization() {
        const infrastructure = this.state.healthcareInfrastructure;
        
        // Simplified capacity utilization calculation
        const bedUtilization = Math.min(1.0, 0.85); // Assume 85% utilization
        const physicianUtilization = Math.min(1.0, 0.9); // Assume 90% utilization
        
        return {
            hospital_bed_utilization: bedUtilization,
            physician_utilization: physicianUtilization,
            overall_utilization: (bedUtilization + physicianUtilization) / 2,
            capacity_strain: bedUtilization > 0.9 ? 'high' : bedUtilization > 0.8 ? 'moderate' : 'low'
        };
    }

    identifyInfrastructureGaps() {
        const gaps = [];
        const infrastructure = this.state.healthcareInfrastructure;
        
        if (infrastructure.hospital_beds_per_1000 < 3.0) {
            gaps.push({
                type: 'hospital_bed_shortage',
                severity: 3.0 - infrastructure.hospital_beds_per_1000,
                priority: 'high'
            });
        }
        
        if (infrastructure.physicians_per_1000 < 2.8) {
            gaps.push({
                type: 'physician_shortage',
                severity: 2.8 - infrastructure.physicians_per_1000,
                priority: 'high'
            });
        }
        
        if (infrastructure.nurses_per_1000 < 12.0) {
            gaps.push({
                type: 'nursing_shortage',
                severity: 12.0 - infrastructure.nurses_per_1000,
                priority: 'medium'
            });
        }
        
        return gaps;
    }

    analyzePopulationHealthTrends() {
        const publicHealth = this.state.publicHealthMetrics;
        const disease = this.state.diseaseControl;
        
        return {
            life_expectancy_trend: publicHealth.life_expectancy > 79 ? 'improving' : 
                                  publicHealth.life_expectancy > 77 ? 'stable' : 'declining',
            chronic_disease_trend: disease.chronic_disease_prevalence < 0.4 ? 'improving' : 
                                  disease.chronic_disease_prevalence < 0.5 ? 'stable' : 'worsening',
            prevention_effectiveness_trend: disease.preventive_care_utilization > 0.75 ? 'improving' : 
                                          disease.preventive_care_utilization > 0.65 ? 'stable' : 'declining',
            overall_population_health_direction: this.calculatePopulationHealthDirection()
        };
    }

    calculatePopulationHealthDirection() {
        const publicHealth = this.state.publicHealthMetrics;
        const disease = this.state.diseaseControl;
        
        const positiveFactors = [
            publicHealth.life_expectancy > 79,
            publicHealth.infant_mortality_rate < 5.0,
            disease.chronic_disease_prevalence < 0.4,
            disease.preventive_care_utilization > 0.75
        ].filter(Boolean).length;
        
        if (positiveFactors >= 3) return 'strongly_improving';
        if (positiveFactors >= 2) return 'improving';
        if (positiveFactors >= 1) return 'mixed';
        return 'concerning';
    }

    assessPublicHealthProgramEffectiveness() {
        const publicHealth = this.state.publicHealthMetrics;
        const disease = this.state.diseaseControl;
        
        return {
            vaccination_program_effectiveness: publicHealth.vaccination_coverage,
            disease_surveillance_effectiveness: publicHealth.disease_surveillance_coverage,
            prevention_program_effectiveness: disease.preventive_care_utilization,
            health_promotion_effectiveness: disease.health_screening_participation,
            overall_program_effectiveness: (publicHealth.vaccination_coverage + 
                                          publicHealth.disease_surveillance_coverage + 
                                          disease.preventive_care_utilization + 
                                          disease.health_screening_participation) / 4
        };
    }

    calculateHealthPromotionImpact() {
        const disease = this.state.diseaseControl;
        const equity = this.state.healthEquity;
        
        return {
            chronic_disease_prevention_impact: 1 - disease.chronic_disease_prevalence,
            health_literacy_impact: equity.health_literacy_rate,
            community_engagement_impact: Math.min(1.0, equity.community_health_programs / 3000),
            behavioral_change_impact: disease.preventive_care_utilization,
            overall_promotion_impact: ((1 - disease.chronic_disease_prevalence) + 
                                     equity.health_literacy_rate + 
                                     disease.preventive_care_utilization) / 3
        };
    }

    analyzeAccessEquity() {
        const access = this.state.healthcareAccess;
        const equity = this.state.healthEquity;
        
        return {
            coverage_equity: 1 - equity.health_disparities_index,
            geographic_equity: access.rural_healthcare_access,
            socioeconomic_equity: access.healthcare_affordability_index,
            overall_equity_score: ((1 - equity.health_disparities_index) + 
                                 access.rural_healthcare_access + 
                                 access.healthcare_affordability_index) / 3,
            equity_challenges: this.identifyEquityChallenges()
        };
    }

    identifyEquityChallenges() {
        const challenges = [];
        const access = this.state.healthcareAccess;
        const equity = this.state.healthEquity;
        
        if (equity.health_disparities_index > 0.3) {
            challenges.push('significant_health_disparities');
        }
        
        if (access.rural_healthcare_access < 0.7) {
            challenges.push('rural_access_barriers');
        }
        
        if (access.healthcare_affordability_index < 0.7) {
            challenges.push('affordability_concerns');
        }
        
        if (access.uninsured_population > 0.1) {
            challenges.push('coverage_gaps');
        }
        
        return challenges;
    }

    identifyCoverageGaps() {
        const gaps = [];
        const access = this.state.healthcareAccess;
        const disease = this.state.diseaseControl;
        
        if (access.uninsured_population > 0.05) {
            gaps.push({
                type: 'insurance_coverage_gap',
                affected_population: access.uninsured_population,
                priority: 'high'
            });
        }
        
        if (disease.mental_health_support_coverage < 0.8) {
            gaps.push({
                type: 'mental_health_coverage_gap',
                coverage_deficit: 0.8 - disease.mental_health_support_coverage,
                priority: 'medium'
            });
        }
        
        if (access.rural_healthcare_access < 0.7) {
            gaps.push({
                type: 'rural_access_gap',
                access_deficit: 0.7 - access.rural_healthcare_access,
                priority: 'medium'
            });
        }
        
        return gaps;
    }

    identifyAccessImprovementOpportunities() {
        const opportunities = [];
        const access = this.state.healthcareAccess;
        const technology = this.state.healthTechnology;
        
        if (technology.telemedicine_utilization < 0.6 && access.rural_healthcare_access < 0.7) {
            opportunities.push({
                area: 'telemedicine_expansion',
                potential_impact: 'high',
                target_population: 'rural_communities'
            });
        }
        
        if (access.healthcare_affordability_index < 0.7) {
            opportunities.push({
                area: 'affordability_programs',
                potential_impact: 'high',
                target_population: 'low_income_families'
            });
        }
        
        if (access.specialist_wait_times > 21) {
            opportunities.push({
                area: 'specialist_capacity_expansion',
                potential_impact: 'medium',
                target_population: 'patients_needing_specialty_care'
            });
        }
        
        return opportunities;
    }

    assessOutbreakResponseCapability() {
        const publicHealth = this.state.publicHealthMetrics;
        const emergency = this.state.emergencyPreparedness;
        
        return {
            surveillance_capability: publicHealth.disease_surveillance_coverage,
            response_coordination: emergency.public_health_emergency_coordination,
            containment_capacity: this.state.diseaseControl.infectious_disease_control,
            communication_systems: emergency.emergency_communication_systems,
            overall_response_capability: (publicHealth.disease_surveillance_coverage + 
                                        emergency.public_health_emergency_coordination + 
                                        this.state.diseaseControl.infectious_disease_control + 
                                        emergency.emergency_communication_systems) / 4
        };
    }

    assessMentalHealthOutcomes() {
        const disease = this.state.diseaseControl;
        
        return {
            service_coverage: disease.mental_health_support_coverage,
            treatment_capacity: disease.substance_abuse_treatment_capacity,
            access_adequacy: disease.mental_health_support_coverage > 0.8 ? 'adequate' : 
                           disease.mental_health_support_coverage > 0.6 ? 'moderate' : 'inadequate',
            treatment_effectiveness: (disease.mental_health_support_coverage + 
                                    disease.substance_abuse_treatment_capacity) / 2,
            improvement_needs: this.identifyMentalHealthImprovementNeeds()
        };
    }

    identifyMentalHealthImprovementNeeds() {
        const needs = [];
        const disease = this.state.diseaseControl;
        
        if (disease.mental_health_support_coverage < 0.8) {
            needs.push('expand_mental_health_services');
        }
        
        if (disease.substance_abuse_treatment_capacity < 0.7) {
            needs.push('increase_substance_abuse_treatment');
        }
        
        return needs;
    }

    calculatePreventionProgramROI() {
        const disease = this.state.diseaseControl;
        const publicHealth = this.state.publicHealthMetrics;
        
        // Simplified ROI calculation based on prevention effectiveness
        const preventionInvestment = this.state.healthcareFinancing.healthcare_spending_gdp_percentage * 0.1; // Assume 10% goes to prevention
        const preventionBenefits = (disease.preventive_care_utilization + 
                                  publicHealth.vaccination_coverage + 
                                  disease.health_screening_participation) / 3;
        
        return {
            investment_level: preventionInvestment,
            prevention_effectiveness: preventionBenefits,
            estimated_roi: preventionBenefits / preventionInvestment,
            cost_savings_estimate: this.estimatePreventionCostSavings(),
            roi_assessment: preventionBenefits / preventionInvestment > 3 ? 'excellent' : 
                           preventionBenefits / preventionInvestment > 2 ? 'good' : 'moderate'
        };
    }

    estimatePreventionCostSavings() {
        const disease = this.state.diseaseControl;
        
        // Estimate cost savings from chronic disease prevention
        const chronicDiseaseCostSavings = (0.5 - disease.chronic_disease_prevalence) * 500000000000; // $500B potential savings
        
        return Math.max(0, chronicDiseaseCostSavings);
    }

    identifyCostDrivers() {
        const drivers = [];
        const financing = this.state.healthcareFinancing;
        const disease = this.state.diseaseControl;
        
        if (disease.chronic_disease_prevalence > 0.4) {
            drivers.push({
                driver: 'chronic_disease_burden',
                impact: 'high',
                cost_contribution: disease.chronic_disease_prevalence * 0.6
            });
        }
        
        if (financing.healthcare_cost_inflation > 0.04) {
            drivers.push({
                driver: 'medical_cost_inflation',
                impact: 'medium',
                cost_contribution: financing.healthcare_cost_inflation - 0.02
            });
        }
        
        if (this.state.healthcareInfrastructure.physicians_per_1000 < 2.5) {
            drivers.push({
                driver: 'provider_shortage',
                impact: 'medium',
                cost_contribution: 0.1
            });
        }
        
        return drivers;
    }

    assessFinancialSustainability() {
        const financing = this.state.healthcareFinancing;
        
        return {
            spending_sustainability: financing.healthcare_spending_gdp_percentage < 0.2 ? 'sustainable' : 
                                   financing.healthcare_spending_gdp_percentage < 0.22 ? 'concerning' : 'unsustainable',
            cost_growth_sustainability: financing.healthcare_cost_inflation < 0.04 ? 'sustainable' : 
                                      financing.healthcare_cost_inflation < 0.06 ? 'concerning' : 'unsustainable',
            efficiency_level: financing.cost_effectiveness_index,
            sustainability_score: this.calculateSustainabilityScore(),
            sustainability_risks: this.identifySustainabilityRisks()
        };
    }

    calculateSustainabilityScore() {
        const financing = this.state.healthcareFinancing;
        
        const spendingScore = Math.max(0, 1 - (financing.healthcare_spending_gdp_percentage - 0.15) / 0.1);
        const inflationScore = Math.max(0, 1 - (financing.healthcare_cost_inflation - 0.02) / 0.04);
        const efficiencyScore = financing.cost_effectiveness_index;
        
        return (spendingScore + inflationScore + efficiencyScore) / 3;
    }

    identifySustainabilityRisks() {
        const risks = [];
        const financing = this.state.healthcareFinancing;
        const disease = this.state.diseaseControl;
        
        if (financing.healthcare_spending_gdp_percentage > 0.18) {
            risks.push('high_healthcare_spending');
        }
        
        if (financing.healthcare_cost_inflation > 0.04) {
            risks.push('unsustainable_cost_growth');
        }
        
        if (disease.chronic_disease_prevalence > 0.45) {
            risks.push('growing_chronic_disease_burden');
        }
        
        return risks;
    }

    calculateValueForMoney() {
        const financing = this.state.healthcareFinancing;
        const outcomes = this.state.performanceMetrics.population_health_outcomes;
        
        return {
            health_outcomes_per_dollar: outcomes / financing.per_capita_health_expenditure * 10000,
            cost_effectiveness_ratio: financing.cost_effectiveness_index,
            international_comparison: this.compareValueInternationally(),
            value_assessment: outcomes / (financing.healthcare_spending_gdp_percentage * 10) > 4 ? 'excellent' : 
                             outcomes / (financing.healthcare_spending_gdp_percentage * 10) > 3 ? 'good' : 'poor'
        };
    }

    compareValueInternationally() {
        const financing = this.state.healthcareFinancing;
        const outcomes = this.state.performanceMetrics.population_health_outcomes;
        
        // Simplified international comparison
        const valueRatio = outcomes / financing.healthcare_spending_gdp_percentage;
        
        if (valueRatio > 4.5) return 'top_quartile';
        if (valueRatio > 4.0) return 'above_average';
        if (valueRatio > 3.5) return 'average';
        return 'below_average';
    }

    identifyFinancingReformOpportunities() {
        const opportunities = [];
        const financing = this.state.healthcareFinancing;
        
        if (financing.cost_effectiveness_index < 0.7) {
            opportunities.push({
                area: 'efficiency_improvements',
                potential_savings: 'high',
                implementation_difficulty: 'medium'
            });
        }
        
        if (financing.healthcare_cost_inflation > 0.04) {
            opportunities.push({
                area: 'cost_control_measures',
                potential_savings: 'high',
                implementation_difficulty: 'high'
            });
        }
        
        if (this.state.diseaseControl.preventive_care_utilization < 0.8) {
            opportunities.push({
                area: 'prevention_investment',
                potential_savings: 'medium',
                implementation_difficulty: 'low'
            });
        }
        
        return opportunities;
    }

    assessResearchEcosystemHealth() {
        const research = this.state.medicalResearch;
        
        return {
            funding_adequacy: research.research_funding_percentage > 0.05 ? 'adequate' : 
                             research.research_funding_percentage > 0.03 ? 'moderate' : 'inadequate',
            research_capacity: Math.min(1.0, research.research_institutions / 500),
            innovation_output: (research.pharmaceutical_innovation_index + 
                              research.medical_device_innovation) / 2,
            clinical_trial_activity: Math.min(1.0, research.clinical_trials_active / 4000),
            ecosystem_maturity: this.calculateResearchEcosystemMaturity(),
            collaboration_strength: this.assessResearchCollaboration()
        };
    }

    calculateResearchEcosystemMaturity() {
        const research = this.state.medicalResearch;
        
        const fundingScore = Math.min(1.0, research.research_funding_percentage / 0.06);
        const institutionScore = Math.min(1.0, research.research_institutions / 500);
        const outputScore = Math.min(1.0, research.medical_patents_annual / 10000);
        
        return (fundingScore + institutionScore + outputScore) / 3;
    }

    assessResearchCollaboration() {
        const international = this.state.internationalHealth;
        const research = this.state.medicalResearch;
        
        return {
            international_collaborations: international.health_research_collaborations,
            collaboration_intensity: Math.min(1.0, international.health_research_collaborations / 200),
            research_network_strength: international.health_diplomacy_engagement,
            collaborative_output_quality: (research.pharmaceutical_innovation_index + 
                                         international.health_diplomacy_engagement) / 2
        };
    }

    assessInnovationTranslation() {
        const research = this.state.medicalResearch;
        const technology = this.state.healthTechnology;
        
        return {
            research_to_practice_pipeline: (research.pharmaceutical_innovation_index + 
                                          technology.ai_diagnostic_tools_deployment) / 2,
            technology_adoption_speed: this.calculateTechnologyAdoption(),
            innovation_implementation_barriers: this.identifyImplementationBarriers(),
            translation_effectiveness: this.calculateTranslationEffectiveness()
        };
    }

    identifyImplementationBarriers() {
        const barriers = [];
        const technology = this.state.healthTechnology;
        const financing = this.state.healthcareFinancing;
        
        if (technology.health_data_interoperability < 0.7) {
            barriers.push('data_interoperability_challenges');
        }
        
        if (financing.cost_effectiveness_index < 0.7) {
            barriers.push('cost_implementation_constraints');
        }
        
        if (this.state.workforceDevelopment.continuing_education_participation < 0.8) {
            barriers.push('workforce_training_gaps');
        }
        
        return barriers;
    }

    calculateTranslationEffectiveness() {
        const research = this.state.medicalResearch;
        const technology = this.state.healthTechnology;
        const workforce = this.state.workforceDevelopment;
        
        return (research.pharmaceutical_innovation_index + 
                technology.ai_diagnostic_tools_deployment + 
                workforce.continuing_education_participation) / 3;
    }

    identifyResearchPriorities() {
        const priorities = [];
        const disease = this.state.diseaseControl;
        const publicHealth = this.state.publicHealthMetrics;
        
        if (disease.chronic_disease_prevalence > 0.4) {
            priorities.push({
                area: 'chronic_disease_prevention',
                priority: 'high',
                rationale: 'High chronic disease burden'
            });
        }
        
        if (publicHealth.life_expectancy < 80) {
            priorities.push({
                area: 'longevity_research',
                priority: 'medium',
                rationale: 'Opportunity to improve life expectancy'
            });
        }
        
        if (disease.mental_health_support_coverage < 0.8) {
            priorities.push({
                area: 'mental_health_research',
                priority: 'medium',
                rationale: 'Mental health service gaps'
            });
        }
        
        return priorities;
    }

    assessTechnologyImpact() {
        const technology = this.state.healthTechnology;
        const access = this.state.healthcareAccess;
        
        return {
            efficiency_impact: technology.electronic_health_records_adoption,
            access_impact: technology.telemedicine_utilization,
            quality_impact: technology.ai_diagnostic_tools_deployment,
            cost_impact: this.calculateTechnologyCostImpact(),
            overall_technology_benefit: this.calculateOverallTechnologyBenefit(),
            technology_roi: this.calculateTechnologyROI()
        };
    }

    calculateTechnologyCostImpact() {
        const technology = this.state.healthTechnology;
        
        // Technology can reduce costs through efficiency
        const efficiencyGains = (technology.electronic_health_records_adoption + 
                               technology.telemedicine_utilization + 
                               technology.health_data_interoperability) / 3;
        
        return efficiencyGains * 0.1; // Up to 10% cost reduction
    }

    calculateOverallTechnologyBenefit() {
        const technology = this.state.healthTechnology;
        
        const benefitFactors = [
            technology.electronic_health_records_adoption,
            technology.telemedicine_utilization,
            technology.ai_diagnostic_tools_deployment,
            technology.health_data_interoperability
        ];
        
        return benefitFactors.reduce((sum, factor) => sum + factor, 0) / benefitFactors.length;
    }

    calculateTechnologyROI() {
        const technology = this.state.healthTechnology;
        const benefits = this.calculateOverallTechnologyBenefit();
        const investment = technology.digital_health_investment / 20000000000; // Normalize to 0-1
        
        return {
            investment_level: investment,
            benefit_level: benefits,
            roi_ratio: benefits / Math.max(0.1, investment),
            roi_assessment: benefits / Math.max(0.1, investment) > 2 ? 'excellent' : 
                           benefits / Math.max(0.1, investment) > 1.5 ? 'good' : 'moderate'
        };
    }

    analyzeDigitalDivide() {
        const technology = this.state.healthTechnology;
        const access = this.state.healthcareAccess;
        const equity = this.state.healthEquity;
        
        return {
            technology_access_gap: this.calculateTechnologyAccessGap(),
            rural_digital_divide: 1 - access.rural_healthcare_access,
            socioeconomic_digital_divide: equity.health_disparities_index,
            age_related_divide: this.estimateAgeRelatedDivide(),
            mitigation_strategies: this.identifyDigitalDivideMitigation()
        };
    }

    calculateTechnologyAccessGap() {
        const technology = this.state.healthTechnology;
        const access = this.state.healthcareAccess;
        
        // Gap between technology availability and access
        const techAvailability = this.calculateTechnologyAdoption();
        const accessLevel = access.primary_care_availability;
        
        return Math.max(0, techAvailability - accessLevel);
    }

    estimateAgeRelatedDivide() {
        const technology = this.state.healthTechnology;
        
        // Simplified estimation - older populations may have lower tech adoption
        return 1 - (technology.telemedicine_utilization * 0.8);
    }

    identifyDigitalDivideMitigation() {
        const strategies = [];
        const technology = this.state.healthTechnology;
        const access = this.state.healthcareAccess;
        
        if (technology.telemedicine_utilization < 0.6) {
            strategies.push('expand_telemedicine_infrastructure');
        }
        
        if (access.rural_healthcare_access < 0.7) {
            strategies.push('rural_digital_health_programs');
        }
        
        if (this.state.healthEquity.health_literacy_rate < 0.8) {
            strategies.push('digital_health_literacy_programs');
        }
        
        return strategies;
    }

    developTechnologyRoadmap() {
        const technology = this.state.healthTechnology;
        
        return {
            short_term_priorities: this.identifyShortTermTechPriorities(),
            medium_term_goals: this.identifyMediumTermTechGoals(),
            long_term_vision: this.identifyLongTermTechVision(),
            implementation_timeline: this.createTechImplementationTimeline(),
            investment_requirements: this.estimateTechInvestmentNeeds()
        };
    }

    identifyShortTermTechPriorities() {
        const priorities = [];
        const technology = this.state.healthTechnology;
        
        if (technology.health_data_interoperability < 0.8) {
            priorities.push('improve_data_interoperability');
        }
        
        if (technology.cybersecurity_compliance < 0.8) {
            priorities.push('strengthen_cybersecurity');
        }
        
        if (technology.telemedicine_utilization < 0.5) {
            priorities.push('expand_telemedicine_access');
        }
        
        return priorities;
    }

    identifyMediumTermTechGoals() {
        return [
            'ai_diagnostic_tools_mainstream_adoption',
            'comprehensive_ehr_interoperability',
            'advanced_telemedicine_capabilities',
            'predictive_health_analytics'
        ];
    }

    identifyLongTermTechVision() {
        return [
            'personalized_precision_medicine',
            'ai_powered_health_ecosystem',
            'seamless_health_data_integration',
            'autonomous_health_monitoring'
        ];
    }

    createTechImplementationTimeline() {
        return {
            '1_year': ['cybersecurity_improvements', 'telemedicine_expansion'],
            '3_years': ['ai_diagnostic_deployment', 'data_interoperability'],
            '5_years': ['comprehensive_digital_health_ecosystem'],
            '10_years': ['precision_medicine_implementation']
        };
    }

    estimateTechInvestmentNeeds() {
        const technology = this.state.healthTechnology;
        const currentInvestment = technology.digital_health_investment;
        
        return {
            current_investment: currentInvestment,
            short_term_needs: currentInvestment * 1.2,
            medium_term_needs: currentInvestment * 1.5,
            long_term_needs: currentInvestment * 2.0,
            roi_projection: 'positive'
        };
    }

    assessSystemResilience() {
        const emergency = this.state.emergencyPreparedness;
        const infrastructure = this.state.healthcareInfrastructure;
        
        return {
            emergency_response_resilience: this.calculateEmergencyPreparednessScore(),
            infrastructure_resilience: this.calculateInfrastructureResilience(),
            workforce_resilience: this.calculateWorkforceResilience(),
            financial_resilience: this.calculateFinancialResilience(),
            overall_resilience: this.calculateOverallResilience(),
            resilience_rating: this.rateSystemResilience()
        };
    }

    calculateInfrastructureResilience() {
        const infrastructure = this.state.healthcareInfrastructure;
        const emergency = this.state.emergencyPreparedness;
        
        return (this.calculateInfrastructureScore() + 
                emergency.hospital_surge_capacity) / 2;
    }

    calculateWorkforceResilience() {
        const workforce = this.state.workforceDevelopment;
        
        return (workforce.healthcare_worker_satisfaction + 
                (1 - workforce.physician_burnout_rate) + 
                workforce.continuing_education_participation) / 3;
    }

    calculateFinancialResilience() {
        const financing = this.state.healthcareFinancing;
        
        return (financing.cost_effectiveness_index + 
                this.calculateSustainabilityScore()) / 2;
    }

    calculateOverallResilience() {
        return (this.calculateEmergencyPreparednessScore() + 
                this.calculateInfrastructureResilience() + 
                this.calculateWorkforceResilience() + 
                this.calculateFinancialResilience()) / 4;
    }

    rateSystemResilience() {
        const resilience = this.calculateOverallResilience();
        
        if (resilience > 0.8) return 'highly_resilient';
        if (resilience > 0.7) return 'resilient';
        if (resilience > 0.6) return 'moderately_resilient';
        return 'vulnerable';
    }

    analyzeSystemVulnerabilities() {
        const vulnerabilities = [];
        const emergency = this.state.emergencyPreparedness;
        const workforce = this.state.workforceDevelopment;
        const financing = this.state.healthcareFinancing;
        
        if (emergency.pandemic_response_capability < 0.8) {
            vulnerabilities.push({
                type: 'pandemic_preparedness_gap',
                severity: 'high',
                impact: 'system_wide'
            });
        }
        
        if (workforce.physician_burnout_rate > 0.4) {
            vulnerabilities.push({
                type: 'workforce_burnout',
                severity: 'medium',
                impact: 'service_delivery'
            });
        }
        
        if (financing.healthcare_cost_inflation > 0.04) {
            vulnerabilities.push({
                type: 'unsustainable_cost_growth',
                severity: 'high',
                impact: 'financial_sustainability'
            });
        }
        
        return vulnerabilities;
    }

    assessAdaptiveCapacity() {
        const technology = this.state.healthTechnology;
        const workforce = this.state.workforceDevelopment;
        const research = this.state.medicalResearch;
        
        return {
            technological_adaptability: this.calculateTechnologyAdoption(),
            workforce_adaptability: workforce.continuing_education_participation,
            innovation_capacity: this.calculateResearchCapacity(),
            organizational_learning: this.assessOrganizationalLearning(),
            overall_adaptive_capacity: (this.calculateTechnologyAdoption() + 
                                      workforce.continuing_education_participation + 
                                      this.calculateResearchCapacity()) / 3
        };
    }

    assessOrganizationalLearning() {
        const workforce = this.state.workforceDevelopment;
        const technology = this.state.healthTechnology;
        
        return (workforce.continuing_education_participation + 
                technology.ai_diagnostic_tools_deployment) / 2;
    }

    identifyResilienceBuildingPriorities() {
        const priorities = [];
        const emergency = this.state.emergencyPreparedness;
        const workforce = this.state.workforceDevelopment;
        
        if (emergency.pandemic_response_capability < 0.8) {
            priorities.push({
                area: 'pandemic_preparedness',
                priority: 'high',
                actions: ['expand_surge_capacity', 'improve_coordination', 'strengthen_reserves']
            });
        }
        
        if (workforce.physician_burnout_rate > 0.4) {
            priorities.push({
                area: 'workforce_wellbeing',
                priority: 'medium',
                actions: ['improve_work_conditions', 'expand_support_programs', 'reduce_administrative_burden']
            });
        }
        
        if (this.calculateFinancialResilience() < 0.7) {
            priorities.push({
                area: 'financial_sustainability',
                priority: 'high',
                actions: ['cost_control_measures', 'efficiency_improvements', 'diversify_funding']
            });
        }
        
        return priorities;
    }

    generateFallbackOutputs() {
        return {
            healthcare_infrastructure_status: {
                capacity_metrics: {
                    hospital_beds_per_1000: 2.9,
                    physicians_per_1000: 2.6,
                    nurses_per_1000: 11.7
                },
                infrastructure_adequacy: { overall_adequacy: 'moderate' }
            },
            public_health_performance: {
                health_outcomes: {
                    life_expectancy: 78.9,
                    infant_mortality_rate: 5.8
                },
                population_health_trends: { overall_population_health_direction: 'improving' }
            },
            healthcare_access_analysis: {
                coverage_metrics: {
                    insurance_coverage: 0.91,
                    affordability_index: 0.65
                },
                access_equity_analysis: { overall_equity_score: 0.7 }
            },
            disease_prevention_effectiveness: {
                chronic_disease_management: { prevention_effectiveness: 0.55 },
                infectious_disease_control: { control_effectiveness: 0.88 }
            },
            healthcare_financing_analysis: {
                spending_metrics: { gdp_percentage: 0.175 },
                financial_sustainability: { sustainability_score: 0.7 }
            },
            medical_innovation_status: {
                research_capacity: { funding_level: 0.04 },
                research_ecosystem_health: { ecosystem_maturity: 0.7 }
            },
            health_technology_progress: {
                digital_adoption: { ehr_adoption: 0.86 },
                technology_impact_assessment: { overall_technology_benefit: 0.6 }
            },
            health_system_resilience: {
                resilience_assessment: { overall_resilience: 0.75 },
                adaptive_capacity: { overall_adaptive_capacity: 0.7 }
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallPerformance: this.state.performanceMetrics.overall_health_system_performance,
            lifeExpectancy: this.state.publicHealthMetrics.life_expectancy,
            healthcareAccess: this.state.healthcareAccess.health_insurance_coverage,
            emergencyPreparedness: this.state.emergencyPreparedness.pandemic_response_capability,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.publicHealthMetrics.life_expectancy = 78.9;
        this.state.healthcareAccess.health_insurance_coverage = 0.91;
        this.state.performanceMetrics.overall_health_system_performance = 0.74;
        console.log('🏥 Health System reset');
    }
}

module.exports = { HealthSystem };
