/**
 * Health Department API - Public health, healthcare policy, and medical infrastructure
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const healthKnobsData = {
  // Healthcare Funding & Resources
  healthcare_funding_level: 0.175,                // AI can control healthcare spending as % GDP (0.0-1.0)
  healthcare_infrastructure_investment: 0.7,      // AI can control infrastructure investment (0.0-1.0)
  health_workforce_investment: 0.7,               // AI can control workforce development (0.0-1.0)
  healthcare_cost_control_emphasis: 0.6,          // AI can control cost control measures (0.0-1.0)
  healthcare_efficiency_optimization: 0.65,       // AI can control efficiency improvements (0.0-1.0)
  
  // Public Health & Prevention
  public_health_investment_priority: 0.7,         // AI can control public health programs (0.0-1.0)
  preventive_care_emphasis: 0.7,                  // AI can control preventive care focus (0.0-1.0)
  disease_prevention_programs: 0.75,              // AI can control disease prevention (0.0-1.0)
  health_education_investment: 0.6,               // AI can control health education (0.0-1.0)
  community_health_programs: 0.65,                // AI can control community health (0.0-1.0)
  
  // Healthcare Access & Equity
  healthcare_access_emphasis: 0.8,                // AI can control universal access (0.0-1.0)
  health_equity_commitment: 0.6,                  // AI can control health equity programs (0.0-1.0)
  rural_healthcare_support: 0.55,                 // AI can control rural healthcare (0.0-1.0)
  underserved_population_focus: 0.6,              // AI can control underserved care (0.0-1.0)
  healthcare_affordability_priority: 0.7,         // AI can control affordability measures (0.0-1.0)
  
  // Medical Research & Innovation
  medical_research_funding_level: 0.04,           // AI can control research funding as % health budget (0.0-1.0)
  biomedical_research_priority: 0.75,             // AI can control biomedical research (0.0-1.0)
  clinical_trials_support: 0.7,                   // AI can control clinical trials (0.0-1.0)
  pharmaceutical_innovation_incentives: 0.65,     // AI can control pharma innovation (0.0-1.0)
  medical_device_development: 0.7,                // AI can control medical device innovation (0.0-1.0)
  
  // Health Technology & Digitalization
  health_technology_adoption_pace: 0.7,           // AI can control health tech adoption (0.0-1.0)
  digital_health_infrastructure: 0.68,            // AI can control digital health systems (0.0-1.0)
  telemedicine_expansion: 0.65,                   // AI can control telemedicine programs (0.0-1.0)
  health_data_integration: 0.6,                   // AI can control health data systems (0.0-1.0)
  ai_healthcare_integration: 0.55,                // AI can control AI in healthcare (0.0-1.0)
  
  // Mental Health & Behavioral Health
  mental_health_priority: 0.6,                    // AI can control mental health services (0.0-1.0)
  behavioral_health_integration: 0.58,            // AI can control behavioral health (0.0-1.0)
  substance_abuse_treatment: 0.65,                // AI can control addiction treatment (0.0-1.0)
  mental_health_workforce_expansion: 0.6,         // AI can control mental health workforce (0.0-1.0)
  crisis_intervention_services: 0.7,              // AI can control crisis services (0.0-1.0)
  
  // Emergency Preparedness & Response
  emergency_preparedness_focus: 0.75,             // AI can control emergency preparedness (0.0-1.0)
  pandemic_response_capability: 0.8,              // AI can control pandemic readiness (0.0-1.0)
  public_health_emergency_response: 0.75,         // AI can control emergency response (0.0-1.0)
  strategic_national_stockpile: 0.7,              // AI can control medical stockpiles (0.0-1.0)
  biosecurity_investment: 0.65,                   // AI can control biosecurity measures (0.0-1.0)
  
  // Specialized Healthcare Services
  chronic_disease_management: 0.7,                // AI can control chronic disease programs (0.0-1.0)
  elderly_care_services: 0.68,                    // AI can control elderly care (0.0-1.0)
  pediatric_healthcare_priority: 0.75,            // AI can control pediatric care (0.0-1.0)
  maternal_health_programs: 0.7,                  // AI can control maternal health (0.0-1.0)
  rare_disease_research: 0.55,                    // AI can control rare disease focus (0.0-1.0)
  
  // International Health & Cooperation
  international_health_engagement: 0.7,           // AI can control international cooperation (0.0-1.0)
  global_health_security: 0.75,                   // AI can control global health security (0.0-1.0)
  health_diplomacy_priority: 0.6,                 // AI can control health diplomacy (0.0-1.0)
  international_health_aid: 0.55,                 // AI can control international aid (0.0-1.0)
  pandemic_cooperation: 0.8,                      // AI can control pandemic cooperation (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const healthKnobSystem = new EnhancedKnobSystem(healthKnobsData);

// Backward compatibility - expose knobs directly
const healthKnobs = healthKnobSystem.knobs;

// Health Department Game State
const healthGameState = {
  // Healthcare Infrastructure
  healthcareInfrastructure: {
    hospitals: 6090,
    clinics: 9000,
    emergency_rooms: 5564,
    icu_beds: 96596,
    hospital_beds_per_1000: 2.9,
    physicians_per_1000: 2.6,
    nurses_per_1000: 11.7,
    healthcare_workers: 22000000,
    rural_healthcare_facilities: 1800,
    specialty_care_centers: 2500
  },
  
  // Public Health Metrics
  publicHealthMetrics: {
    life_expectancy: 78.9,
    infant_mortality_rate: 5.8, // per 1000 births
    maternal_mortality_rate: 17.4, // per 100,000 births
    vaccination_coverage: 0.92,
    disease_surveillance_coverage: 0.85,
    preventable_disease_rate: 0.15,
    health_literacy_rate: 0.68,
    population_health_index: 0.72
  },
  
  // Healthcare Access & Coverage
  healthcareAccess: {
    insured_population_percentage: 0.91,
    uninsured_population: 28000000,
    medicaid_enrollment: 82000000,
    medicare_enrollment: 64000000,
    healthcare_affordability_index: 0.65,
    access_to_primary_care: 0.78,
    specialist_wait_times: 25, // days
    emergency_room_wait_times: 4.2 // hours
  },
  
  // Healthcare Costs & Spending
  healthcareCosts: {
    total_health_spending_gdp_percentage: 0.175, // 17.5%
    per_capita_health_spending: 11500,
    government_health_spending_percentage: 0.64,
    out_of_pocket_spending_percentage: 0.11,
    prescription_drug_spending: 370000000000, // $370B
    administrative_costs_percentage: 0.08,
    healthcare_cost_inflation_rate: 0.045, // 4.5%
    cost_effectiveness_score: 0.62
  },
  
  // Medical Research & Innovation
  medicalResearch: {
    nih_budget: 45000000000, // $45B
    private_research_investment: 125000000000, // $125B
    clinical_trials_active: 15000,
    new_drug_approvals_annual: 45,
    medical_patents_filed: 8500,
    research_publications_annual: 185000,
    translational_research_success_rate: 0.12,
    research_collaboration_index: 0.78
  },
  
  // Health Technology & Digital Health
  healthTechnology: {
    electronic_health_records_adoption: 0.89,
    telemedicine_utilization_rate: 0.38,
    health_apps_usage: 0.52,
    ai_diagnostic_tools_deployment: 0.25,
    wearable_health_devices_adoption: 0.45,
    digital_therapeutics_market_size: 8500000000, // $8.5B
    health_data_interoperability_score: 0.58,
    cybersecurity_health_score: 0.72
  },
  
  // Mental Health & Behavioral Health
  mentalHealth: {
    mental_health_providers_per_100k: 350,
    mental_health_treatment_access: 0.64,
    substance_abuse_treatment_capacity: 0.58,
    mental_health_parity_compliance: 0.75,
    suicide_prevention_programs: 450,
    mental_health_first_aid_trained: 2500000,
    behavioral_health_integration_rate: 0.42,
    mental_health_stigma_reduction_score: 0.68
  },
  
  // Emergency Preparedness
  emergencyPreparedness: {
    strategic_national_stockpile_readiness: 0.75,
    pandemic_response_capability_score: 0.8,
    public_health_emergency_workforce: 15000,
    emergency_response_time_minutes: 8.5,
    hospital_surge_capacity: 0.35,
    biosafety_labs_level_4: 15,
    disease_outbreak_detection_time: 3.2, // days
    emergency_communication_systems: 850
  },
  
  // Health Workforce
  healthWorkforce: {
    physician_shortage_areas: 7000,
    nursing_shortage_facilities: 3500,
    healthcare_worker_burnout_rate: 0.42,
    medical_school_graduates_annual: 21000,
    nursing_school_graduates_annual: 180000,
    healthcare_worker_retention_rate: 0.78,
    continuing_education_participation: 0.85,
    diversity_in_healthcare_workforce: 0.58
  },
  
  // International Health
  internationalHealth: {
    global_health_funding: 12000000000, // $12B
    international_health_partnerships: 180,
    global_disease_surveillance_participation: 0.92,
    health_aid_recipient_countries: 85,
    international_medical_missions: 450,
    global_health_research_collaborations: 1200,
    pandemic_preparedness_cooperation_score: 0.85,
    health_diplomacy_effectiveness: 0.72
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateHealthStructuredOutputs() {
  const infrastructure = healthGameState.healthcareInfrastructure;
  const publicHealth = healthGameState.publicHealthMetrics;
  const access = healthGameState.healthcareAccess;
  const costs = healthGameState.healthcareCosts;
  const research = healthGameState.medicalResearch;
  const technology = healthGameState.healthTechnology;
  const mentalHealth = healthGameState.mentalHealth;
  const emergency = healthGameState.emergencyPreparedness;
  const workforce = healthGameState.healthWorkforce;
  const international = healthGameState.internationalHealth;
  
  return {
    healthcare_infrastructure_status: {
      infrastructure_capacity: {
        hospitals: infrastructure.hospitals,
        clinics: infrastructure.clinics,
        icu_beds: infrastructure.icu_beds,
        healthcare_workers: infrastructure.healthcare_workers
      },
      workforce_metrics: {
        physicians_per_1000: infrastructure.physicians_per_1000,
        nurses_per_1000: infrastructure.nurses_per_1000,
        hospital_beds_per_1000: infrastructure.hospital_beds_per_1000,
        rural_facilities: infrastructure.rural_healthcare_facilities
      },
      infrastructure_priorities: {
        infrastructure_investment: healthKnobs.healthcare_infrastructure_investment,
        workforce_investment: healthKnobs.health_workforce_investment,
        rural_healthcare_support: healthKnobs.rural_healthcare_support,
        efficiency_optimization: healthKnobs.healthcare_efficiency_optimization
      }
    },
    
    public_health_status: {
      health_outcomes: {
        life_expectancy: publicHealth.life_expectancy,
        infant_mortality_rate: publicHealth.infant_mortality_rate,
        maternal_mortality_rate: publicHealth.maternal_mortality_rate,
        population_health_index: publicHealth.population_health_index
      },
      prevention_metrics: {
        vaccination_coverage: publicHealth.vaccination_coverage,
        disease_surveillance_coverage: publicHealth.disease_surveillance_coverage,
        preventable_disease_rate: publicHealth.preventable_disease_rate,
        health_literacy_rate: publicHealth.health_literacy_rate
      },
      public_health_priorities: {
        public_health_investment: healthKnobs.public_health_investment_priority,
        preventive_care_emphasis: healthKnobs.preventive_care_emphasis,
        disease_prevention_programs: healthKnobs.disease_prevention_programs,
        community_health_programs: healthKnobs.community_health_programs
      }
    },
    
    healthcare_access_status: {
      coverage_metrics: {
        insured_population_percentage: access.insured_population_percentage,
        uninsured_population: access.uninsured_population,
        medicaid_enrollment: access.medicaid_enrollment,
        medicare_enrollment: access.medicare_enrollment
      },
      access_quality: {
        affordability_index: access.healthcare_affordability_index,
        primary_care_access: access.access_to_primary_care,
        specialist_wait_times: access.specialist_wait_times,
        emergency_wait_times: access.emergency_room_wait_times
      },
      access_priorities: {
        access_emphasis: healthKnobs.healthcare_access_emphasis,
        equity_commitment: healthKnobs.health_equity_commitment,
        affordability_priority: healthKnobs.healthcare_affordability_priority,
        underserved_focus: healthKnobs.underserved_population_focus
      }
    },
    
    healthcare_costs_status: {
      spending_metrics: {
        total_spending_gdp: costs.total_health_spending_gdp_percentage,
        per_capita_spending: costs.per_capita_health_spending,
        government_spending_share: costs.government_health_spending_percentage,
        out_of_pocket_share: costs.out_of_pocket_spending_percentage
      },
      cost_management: {
        administrative_costs: costs.administrative_costs_percentage,
        cost_inflation_rate: costs.healthcare_cost_inflation_rate,
        cost_effectiveness_score: costs.cost_effectiveness_score,
        prescription_drug_spending: costs.prescription_drug_spending
      },
      cost_priorities: {
        funding_level: healthKnobs.healthcare_funding_level,
        cost_control_emphasis: healthKnobs.healthcare_cost_control_emphasis,
        efficiency_optimization: healthKnobs.healthcare_efficiency_optimization,
        affordability_priority: healthKnobs.healthcare_affordability_priority
      }
    },
    
    medical_research_status: {
      research_investment: {
        nih_budget: research.nih_budget,
        private_investment: research.private_research_investment,
        research_funding_level: healthKnobs.medical_research_funding_level,
        biomedical_research_priority: healthKnobs.biomedical_research_priority
      },
      research_output: {
        clinical_trials_active: research.clinical_trials_active,
        new_drug_approvals: research.new_drug_approvals_annual,
        medical_patents: research.medical_patents_filed,
        research_publications: research.research_publications_annual
      },
      research_effectiveness: {
        translational_success_rate: research.translational_research_success_rate,
        collaboration_index: research.research_collaboration_index,
        clinical_trials_support: healthKnobs.clinical_trials_support,
        pharmaceutical_innovation: healthKnobs.pharmaceutical_innovation_incentives
      }
    },
    
    health_technology_status: {
      digital_adoption: {
        ehr_adoption: technology.electronic_health_records_adoption,
        telemedicine_utilization: technology.telemedicine_utilization_rate,
        health_apps_usage: technology.health_apps_usage,
        ai_diagnostic_deployment: technology.ai_diagnostic_tools_deployment
      },
      technology_infrastructure: {
        data_interoperability: technology.health_data_interoperability_score,
        cybersecurity_score: technology.cybersecurity_health_score,
        digital_therapeutics_market: technology.digital_therapeutics_market_size,
        wearable_adoption: technology.wearable_health_devices_adoption
      },
      technology_priorities: {
        tech_adoption_pace: healthKnobs.health_technology_adoption_pace,
        digital_infrastructure: healthKnobs.digital_health_infrastructure,
        telemedicine_expansion: healthKnobs.telemedicine_expansion,
        ai_healthcare_integration: healthKnobs.ai_healthcare_integration
      }
    },
    
    mental_health_status: {
      mental_health_capacity: {
        providers_per_100k: mentalHealth.mental_health_providers_per_100k,
        treatment_access: mentalHealth.mental_health_treatment_access,
        substance_abuse_capacity: mentalHealth.substance_abuse_treatment_capacity,
        parity_compliance: mentalHealth.mental_health_parity_compliance
      },
      mental_health_programs: {
        suicide_prevention_programs: mentalHealth.suicide_prevention_programs,
        first_aid_trained: mentalHealth.mental_health_first_aid_trained,
        behavioral_integration_rate: mentalHealth.behavioral_health_integration_rate,
        stigma_reduction_score: mentalHealth.mental_health_stigma_reduction_score
      },
      mental_health_priorities: {
        mental_health_priority: healthKnobs.mental_health_priority,
        behavioral_health_integration: healthKnobs.behavioral_health_integration,
        substance_abuse_treatment: healthKnobs.substance_abuse_treatment,
        crisis_intervention_services: healthKnobs.crisis_intervention_services
      }
    },
    
    emergency_preparedness_status: {
      preparedness_capabilities: {
        stockpile_readiness: emergency.strategic_national_stockpile_readiness,
        pandemic_capability: emergency.pandemic_response_capability_score,
        emergency_workforce: emergency.public_health_emergency_workforce,
        response_time: emergency.emergency_response_time_minutes
      },
      emergency_infrastructure: {
        hospital_surge_capacity: emergency.hospital_surge_capacity,
        biosafety_labs: emergency.biosafety_labs_level_4,
        detection_time: emergency.disease_outbreak_detection_time,
        communication_systems: emergency.emergency_communication_systems
      },
      preparedness_priorities: {
        emergency_preparedness_focus: healthKnobs.emergency_preparedness_focus,
        pandemic_response_capability: healthKnobs.pandemic_response_capability,
        public_health_emergency_response: healthKnobs.public_health_emergency_response,
        biosecurity_investment: healthKnobs.biosecurity_investment
      }
    }
  };
}

// Apply knobs to game state
function applyHealthKnobsToGameState() {
  const knobs = healthKnobs;
  
  // Update healthcare infrastructure based on knobs
  healthGameState.healthcareInfrastructure.physicians_per_1000 = 
    2.0 + (knobs.health_workforce_investment * 1.0); // 2.0 to 3.0
  healthGameState.healthcareInfrastructure.nurses_per_1000 = 
    8.0 + (knobs.health_workforce_investment * 6.0); // 8.0 to 14.0
  healthGameState.healthcareInfrastructure.hospital_beds_per_1000 = 
    2.0 + (knobs.healthcare_infrastructure_investment * 1.5); // 2.0 to 3.5
  healthGameState.healthcareInfrastructure.rural_healthcare_facilities = 
    Math.round(1200 + (knobs.rural_healthcare_support * 1200));
  
  // Update public health metrics
  healthGameState.publicHealthMetrics.life_expectancy = 
    76.0 + (knobs.public_health_investment_priority * 4.0); // 76.0 to 80.0
  healthGameState.publicHealthMetrics.vaccination_coverage = 
    0.85 + (knobs.disease_prevention_programs * 0.12);
  healthGameState.publicHealthMetrics.preventable_disease_rate = 
    0.25 - (knobs.preventive_care_emphasis * 0.15); // 10% to 25%
  healthGameState.publicHealthMetrics.health_literacy_rate = 
    0.5 + (knobs.health_education_investment * 0.35);
  
  // Update healthcare access
  healthGameState.healthcareAccess.insured_population_percentage = 
    0.85 + (knobs.healthcare_access_emphasis * 0.1);
  healthGameState.healthcareAccess.uninsured_population = 
    Math.round(45000000 - (knobs.healthcare_access_emphasis * 25000000)); // 20M to 45M
  healthGameState.healthcareAccess.healthcare_affordability_index = 
    0.4 + (knobs.healthcare_affordability_priority * 0.4);
  healthGameState.healthcareAccess.access_to_primary_care = 
    0.6 + (knobs.healthcare_access_emphasis * 0.3);
  
  // Update healthcare costs
  healthGameState.healthcareCosts.total_health_spending_gdp_percentage = 
    0.12 + (knobs.healthcare_funding_level * 0.08); // 12% to 20%
  healthGameState.healthcareCosts.per_capita_health_spending = 
    Math.round(8000 + (knobs.healthcare_funding_level * 6000)); // $8K to $14K
  healthGameState.healthcareCosts.administrative_costs_percentage = 
    0.12 - (knobs.healthcare_efficiency_optimization * 0.06); // 6% to 12%
  healthGameState.healthcareCosts.cost_effectiveness_score = 
    0.4 + (knobs.healthcare_cost_control_emphasis * 0.4);
  
  // Update medical research
  healthGameState.medicalResearch.nih_budget = 
    Math.round(30000000000 + (knobs.medical_research_funding_level * 30000000000)); // $30-60B
  healthGameState.medicalResearch.clinical_trials_active = 
    Math.round(10000 + (knobs.clinical_trials_support * 10000));
  healthGameState.medicalResearch.new_drug_approvals_annual = 
    Math.round(30 + (knobs.pharmaceutical_innovation_incentives * 30));
  healthGameState.medicalResearch.translational_research_success_rate = 
    0.08 + (knobs.biomedical_research_priority * 0.08); // 8% to 16%
  
  // Update health technology
  healthGameState.healthTechnology.electronic_health_records_adoption = 
    0.75 + (knobs.health_technology_adoption_pace * 0.2);
  healthGameState.healthTechnology.telemedicine_utilization_rate = 
    0.2 + (knobs.telemedicine_expansion * 0.4);
  healthGameState.healthTechnology.ai_diagnostic_tools_deployment = 
    0.1 + (knobs.ai_healthcare_integration * 0.4);
  healthGameState.healthTechnology.health_data_interoperability_score = 
    0.4 + (knobs.health_data_integration * 0.4);
  
  // Update mental health
  healthGameState.mentalHealth.mental_health_providers_per_100k = 
    Math.round(250 + (knobs.mental_health_priority * 200));
  healthGameState.mentalHealth.mental_health_treatment_access = 
    0.45 + (knobs.mental_health_priority * 0.35);
  healthGameState.mentalHealth.substance_abuse_treatment_capacity = 
    0.4 + (knobs.substance_abuse_treatment * 0.35);
  healthGameState.mentalHealth.behavioral_health_integration_rate = 
    0.25 + (knobs.behavioral_health_integration * 0.4);
  
  // Update emergency preparedness
  healthGameState.emergencyPreparedness.strategic_national_stockpile_readiness = 
    0.5 + (knobs.strategic_national_stockpile * 0.4);
  healthGameState.emergencyPreparedness.pandemic_response_capability_score = 
    0.6 + (knobs.pandemic_response_capability * 0.3);
  healthGameState.emergencyPreparedness.hospital_surge_capacity = 
    0.2 + (knobs.emergency_preparedness_focus * 0.3);
  healthGameState.emergencyPreparedness.disease_outbreak_detection_time = 
    5.0 - (knobs.public_health_emergency_response * 2.5); // 2.5 to 5.0 days
  
  // Update health workforce
  healthGameState.healthWorkforce.physician_shortage_areas = 
    Math.round(9000 - (knobs.health_workforce_investment * 3000)); // 6K to 9K
  healthGameState.healthWorkforce.healthcare_worker_burnout_rate = 
    0.55 - (knobs.health_workforce_investment * 0.2);
  healthGameState.healthWorkforce.healthcare_worker_retention_rate = 
    0.65 + (knobs.health_workforce_investment * 0.25);
  
  // Update international health
  healthGameState.internationalHealth.global_health_funding = 
    Math.round(8000000000 + (knobs.international_health_engagement * 8000000000)); // $8-16B
  healthGameState.internationalHealth.pandemic_preparedness_cooperation_score = 
    0.7 + (knobs.pandemic_cooperation * 0.25);
  healthGameState.internationalHealth.health_diplomacy_effectiveness = 
    0.5 + (knobs.health_diplomacy_priority * 0.35);
  
  healthGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyHealthKnobsToGameState();

// ===== HEALTH DEPARTMENT API ENDPOINTS =====

// Get healthcare infrastructure status
router.get('/infrastructure', (req, res) => {
  res.json({
    healthcare_infrastructure: healthGameState.healthcareInfrastructure,
    infrastructure_priorities: {
      infrastructure_investment: healthKnobs.healthcare_infrastructure_investment,
      workforce_investment: healthKnobs.health_workforce_investment,
      rural_healthcare_support: healthKnobs.rural_healthcare_support,
      efficiency_optimization: healthKnobs.healthcare_efficiency_optimization
    },
    capacity_metrics: {
      hospital_beds_per_1000: healthGameState.healthcareInfrastructure.hospital_beds_per_1000,
      physicians_per_1000: healthGameState.healthcareInfrastructure.physicians_per_1000,
      nurses_per_1000: healthGameState.healthcareInfrastructure.nurses_per_1000,
      rural_facilities: healthGameState.healthcareInfrastructure.rural_healthcare_facilities
    }
  });
});

// Get public health status
router.get('/public-health', (req, res) => {
  res.json({
    public_health_metrics: healthGameState.publicHealthMetrics,
    public_health_priorities: {
      public_health_investment: healthKnobs.public_health_investment_priority,
      preventive_care_emphasis: healthKnobs.preventive_care_emphasis,
      disease_prevention_programs: healthKnobs.disease_prevention_programs,
      health_education_investment: healthKnobs.health_education_investment
    },
    health_outcomes: {
      life_expectancy: healthGameState.publicHealthMetrics.life_expectancy,
      vaccination_coverage: healthGameState.publicHealthMetrics.vaccination_coverage,
      preventable_disease_rate: healthGameState.publicHealthMetrics.preventable_disease_rate,
      population_health_index: healthGameState.publicHealthMetrics.population_health_index
    }
  });
});

// Get healthcare access status
router.get('/access', (req, res) => {
  res.json({
    healthcare_access: healthGameState.healthcareAccess,
    access_priorities: {
      access_emphasis: healthKnobs.healthcare_access_emphasis,
      equity_commitment: healthKnobs.health_equity_commitment,
      affordability_priority: healthKnobs.healthcare_affordability_priority,
      underserved_focus: healthKnobs.underserved_population_focus
    },
    access_metrics: {
      insured_population: healthGameState.healthcareAccess.insured_population_percentage,
      uninsured_population: healthGameState.healthcareAccess.uninsured_population,
      affordability_index: healthGameState.healthcareAccess.healthcare_affordability_index,
      primary_care_access: healthGameState.healthcareAccess.access_to_primary_care
    }
  });
});

// Get healthcare costs status
router.get('/costs', (req, res) => {
  res.json({
    healthcare_costs: healthGameState.healthcareCosts,
    cost_priorities: {
      funding_level: healthKnobs.healthcare_funding_level,
      cost_control_emphasis: healthKnobs.healthcare_cost_control_emphasis,
      efficiency_optimization: healthKnobs.healthcare_efficiency_optimization,
      affordability_priority: healthKnobs.healthcare_affordability_priority
    },
    spending_metrics: {
      total_spending_gdp: healthGameState.healthcareCosts.total_health_spending_gdp_percentage,
      per_capita_spending: healthGameState.healthcareCosts.per_capita_health_spending,
      administrative_costs: healthGameState.healthcareCosts.administrative_costs_percentage,
      cost_effectiveness: healthGameState.healthcareCosts.cost_effectiveness_score
    }
  });
});

// Get medical research status
router.get('/research', (req, res) => {
  res.json({
    medical_research: healthGameState.medicalResearch,
    research_priorities: {
      research_funding_level: healthKnobs.medical_research_funding_level,
      biomedical_research_priority: healthKnobs.biomedical_research_priority,
      clinical_trials_support: healthKnobs.clinical_trials_support,
      pharmaceutical_innovation: healthKnobs.pharmaceutical_innovation_incentives
    },
    research_output: {
      nih_budget: healthGameState.medicalResearch.nih_budget,
      clinical_trials_active: healthGameState.medicalResearch.clinical_trials_active,
      new_drug_approvals: healthGameState.medicalResearch.new_drug_approvals_annual,
      translational_success_rate: healthGameState.medicalResearch.translational_research_success_rate
    }
  });
});

// Get health technology status
router.get('/technology', (req, res) => {
  res.json({
    health_technology: healthGameState.healthTechnology,
    technology_priorities: {
      tech_adoption_pace: healthKnobs.health_technology_adoption_pace,
      digital_infrastructure: healthKnobs.digital_health_infrastructure,
      telemedicine_expansion: healthKnobs.telemedicine_expansion,
      ai_healthcare_integration: healthKnobs.ai_healthcare_integration
    },
    digital_health_metrics: {
      ehr_adoption: healthGameState.healthTechnology.electronic_health_records_adoption,
      telemedicine_utilization: healthGameState.healthTechnology.telemedicine_utilization_rate,
      ai_diagnostic_deployment: healthGameState.healthTechnology.ai_diagnostic_tools_deployment,
      data_interoperability: healthGameState.healthTechnology.health_data_interoperability_score
    }
  });
});

// Get mental health status
router.get('/mental-health', (req, res) => {
  res.json({
    mental_health: healthGameState.mentalHealth,
    mental_health_priorities: {
      mental_health_priority: healthKnobs.mental_health_priority,
      behavioral_health_integration: healthKnobs.behavioral_health_integration,
      substance_abuse_treatment: healthKnobs.substance_abuse_treatment,
      crisis_intervention_services: healthKnobs.crisis_intervention_services
    },
    mental_health_metrics: {
      providers_per_100k: healthGameState.mentalHealth.mental_health_providers_per_100k,
      treatment_access: healthGameState.mentalHealth.mental_health_treatment_access,
      substance_abuse_capacity: healthGameState.mentalHealth.substance_abuse_treatment_capacity,
      behavioral_integration: healthGameState.mentalHealth.behavioral_health_integration_rate
    }
  });
});

// Get emergency preparedness status
router.get('/emergency-preparedness', (req, res) => {
  res.json({
    emergency_preparedness: healthGameState.emergencyPreparedness,
    preparedness_priorities: {
      emergency_preparedness_focus: healthKnobs.emergency_preparedness_focus,
      pandemic_response_capability: healthKnobs.pandemic_response_capability,
      public_health_emergency_response: healthKnobs.public_health_emergency_response,
      biosecurity_investment: healthKnobs.biosecurity_investment
    },
    preparedness_metrics: {
      stockpile_readiness: healthGameState.emergencyPreparedness.strategic_national_stockpile_readiness,
      pandemic_capability: healthGameState.emergencyPreparedness.pandemic_response_capability_score,
      hospital_surge_capacity: healthGameState.emergencyPreparedness.hospital_surge_capacity,
      outbreak_detection_time: healthGameState.emergencyPreparedness.disease_outbreak_detection_time
    }
  });
});

// Simulate health policy scenario
router.post('/simulate-health-scenario', (req, res) => {
  const { scenario_type, health_impact_severity = 0.5, population_affected = 0.3, response_urgency = 0.5 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = healthKnobs;
  const infrastructure = healthGameState.healthcareInfrastructure;
  const emergency = healthGameState.emergencyPreparedness;
  
  // Simulate health system response
  const response_factors = {
    infrastructure_capacity: (infrastructure.hospital_beds_per_1000 / 3.5) * 0.25,
    emergency_preparedness: emergency.pandemic_response_capability_score * 0.2,
    public_health_investment: knobs.public_health_investment_priority * 0.15,
    healthcare_access: knobs.healthcare_access_emphasis * 0.15,
    workforce_adequacy: knobs.health_workforce_investment * 0.1,
    technology_readiness: knobs.health_technology_adoption_pace * 0.1,
    international_cooperation: knobs.international_health_engagement * 0.05
  };
  
  const system_response_capability = Object.values(response_factors).reduce((sum, factor) => sum + factor, 0);
  const health_outcome_quality = Math.min(0.95, system_response_capability - (health_impact_severity * 0.3));
  const response_time_days = Math.round(14 - (knobs.public_health_emergency_response * 10)); // 4-14 days
  
  res.json({
    scenario_analysis: {
      scenario_type,
      health_impact_severity,
      population_affected,
      response_urgency,
      estimated_cost: Math.round(100000000 + (health_impact_severity * population_affected * 5000000000))
    },
    health_system_response: {
      response_factors,
      overall_response_capability: system_response_capability,
      health_outcome_quality,
      response_time_days
    },
    health_approach: {
      preparedness_stance: knobs.emergency_preparedness_focus > 0.7 ? 'highly_prepared' : knobs.emergency_preparedness_focus < 0.3 ? 'reactive' : 'moderately_prepared',
      access_priority: knobs.healthcare_access_emphasis > 0.7 ? 'universal_access_focused' : 'targeted_access',
      prevention_emphasis: knobs.preventive_care_emphasis > 0.6 ? 'prevention_first' : 'treatment_focused',
      technology_integration: knobs.health_technology_adoption_pace > 0.6 ? 'tech_enabled' : 'traditional_care'
    },
    expected_outcomes: {
      population_health_impact: health_outcome_quality * 0.9,
      healthcare_system_resilience: system_response_capability * 0.85,
      long_term_preparedness_improvement: knobs.emergency_preparedness_focus * 0.8,
      health_equity_advancement: knobs.health_equity_commitment * 0.75
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
createEnhancedKnobEndpoints(router, 'health', healthKnobSystem, applyHealthKnobsToGameState);

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateHealthStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Health Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    health_influence: {
      population_health_contribution: healthGameState.publicHealthMetrics.population_health_index,
      healthcare_access_coverage: healthGameState.healthcareAccess.insured_population_percentage,
      emergency_preparedness_strength: healthGameState.emergencyPreparedness.pandemic_response_capability_score,
      research_innovation_capacity: healthGameState.medicalResearch.translational_research_success_rate
    },
    integration_points: {
      defense_biosecurity_coordination: healthKnobs.biosecurity_investment,
      commerce_health_technology_coordination: healthKnobs.health_technology_adoption_pace,
      treasury_healthcare_funding_coordination: healthKnobs.healthcare_funding_level,
      state_international_health_coordination: healthKnobs.international_health_engagement
    },
    system_health: {
      overall_effectiveness: (
        healthGameState.publicHealthMetrics.population_health_index +
        healthGameState.healthcareAccess.healthcare_affordability_index +
        healthGameState.emergencyPreparedness.pandemic_response_capability_score
      ) / 3,
      knobs_applied: { ...healthKnobs }
    }
  });
});

module.exports = router;
