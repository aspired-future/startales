/**
 * Interior Department API - Domestic affairs, natural resources, and homeland management
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const interiorKnobsData = {
  // Natural Resources & Environment
  natural_resource_conservation_priority: 0.7,    // AI can control conservation vs extraction balance (0.0-1.0)
  environmental_protection_strictness: 0.75,      // AI can control environmental regulation strictness (0.0-1.0)
  renewable_energy_transition_pace: 0.68,         // AI can control renewable energy transition speed (0.0-1.0)
  wildlife_conservation_emphasis: 0.72,           // AI can control wildlife protection priority (0.0-1.0)
  
  // Infrastructure & Development
  infrastructure_investment_level: 0.03,          // AI can control infrastructure investment as % GDP (0.0-1.0)
  regional_development_focus: 0.65,               // AI can control regional development priority (0.0-1.0)
  rural_development_investment: 0.6,              // AI can control rural development focus (0.0-1.0)
  public_works_modernization: 0.7,                // AI can control public works modernization (0.0-1.0)
  
  // Public Lands & Recreation
  public_lands_access_balance: 0.7,               // AI can control access vs conservation balance (0.0-1.0)
  national_parks_funding_priority: 0.8,           // AI can control national parks investment (0.0-1.0)
  recreation_facility_development: 0.6,           // AI can control recreation facility development (0.0-1.0)
  wilderness_preservation_emphasis: 0.75,         // AI can control wilderness preservation (0.0-1.0)
  
  // Homeland Security & Emergency Management
  homeland_security_emphasis: 0.78,               // AI can control homeland security focus (0.0-1.0)
  disaster_preparedness_investment: 0.75,         // AI can control disaster preparedness (0.0-1.0)
  emergency_response_capability: 0.8,             // AI can control emergency response readiness (0.0-1.0)
  border_security_coordination: 0.7,              // AI can control border security cooperation (0.0-1.0)
  
  // Climate & Adaptation
  climate_adaptation_priority: 0.65,              // AI can control climate adaptation measures (0.0-1.0)
  environmental_monitoring_investment: 0.7,       // AI can control environmental monitoring (0.0-1.0)
  sustainable_development_emphasis: 0.68,         // AI can control sustainable development (0.0-1.0)
  carbon_reduction_initiatives: 0.6,              // AI can control carbon reduction programs (0.0-1.0)
  
  // Tribal Affairs & Cultural Heritage
  tribal_affairs_priority: 0.75,                  // AI can control Native American affairs priority (0.0-1.0)
  cultural_heritage_protection: 0.7,              // AI can control cultural site protection (0.0-1.0)
  indigenous_rights_support: 0.72,                // AI can control indigenous rights support (0.0-1.0)
  traditional_knowledge_integration: 0.65,        // AI can control traditional knowledge use (0.0-1.0)
  
  // Resource Management & Extraction
  mineral_extraction_regulation: 0.6,             // AI can control mineral extraction oversight (0.0-1.0)
  water_resource_management: 0.8,                 // AI can control water resource management (0.0-1.0)
  forest_management_balance: 0.7,                 // AI can control forest use vs conservation (0.0-1.0)
  energy_development_oversight: 0.65,             // AI can control energy development regulation (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const interiorKnobSystem = new EnhancedKnobSystem(interiorKnobsData);

// Backward compatibility - expose knobs directly
const interiorKnobs = interiorKnobSystem.knobs;

// Interior Department Game State
const interiorGameState = {
  // Natural Resources Management
  naturalResources: {
    oil_reserves: 35000000000, // barrels
    natural_gas_reserves: 500000000000000, // cubic feet
    coal_reserves: 250000000000, // tons
    renewable_energy_capacity: 300000, // MW
    water_resources_availability: 0.78,
    mineral_extraction_capacity: 0.72,
    forest_coverage: 0.33,
    protected_lands_percentage: 0.13,
    conservation_programs_active: 450,
    environmental_compliance_rate: 0.85
  },
  
  // Land Management
  landManagement: {
    federal_lands: 640000000, // acres
    national_parks: 84000000, // acres
    wilderness_areas: 110000000, // acres
    public_land_utilization: 0.65,
    land_conservation_programs: 450,
    recreational_visits_annual: 350000000,
    land_use_permits_issued: 25000,
    habitat_restoration_projects: 180
  },
  
  // Infrastructure & Public Works
  infrastructure: {
    roads_maintained: 165000, // miles
    bridges_managed: 8500,
    dams_operated: 480,
    water_treatment_facilities: 320,
    infrastructure_condition_index: 0.72,
    annual_infrastructure_investment: 45000000000, // $45B
    modernization_projects_active: 150,
    rural_broadband_coverage: 0.68
  },
  
  // Emergency Management & Homeland Security
  emergencyManagement: {
    disaster_response_teams: 25,
    emergency_shelters_capacity: 150000,
    disaster_preparedness_score: 0.78,
    annual_disaster_responses: 45,
    emergency_equipment_readiness: 0.82,
    interagency_coordination_effectiveness: 0.75,
    community_resilience_programs: 200,
    early_warning_systems: 85
  },
  
  // Environmental Protection
  environmentalProtection: {
    air_quality_monitoring_stations: 1200,
    water_quality_compliance_rate: 0.88,
    endangered_species_protected: 1600,
    environmental_violations_prosecuted: 450,
    cleanup_sites_remediated: 320,
    carbon_emissions_reduction: 0.15, // 15% reduction
    renewable_energy_projects: 280,
    environmental_impact_assessments: 850
  },
  
  // Tribal Affairs & Cultural Heritage
  tribalAffairs: {
    federally_recognized_tribes: 574,
    tribal_land_area: 56200000, // acres
    tribal_programs_funded: 180,
    cultural_sites_protected: 95000,
    tribal_consultation_meetings: 450,
    indigenous_language_preservation_programs: 120,
    tribal_economic_development_projects: 85,
    traditional_knowledge_partnerships: 65
  },
  
  // Regional Development
  regionalDevelopment: {
    rural_development_projects: 320,
    economic_development_zones: 45,
    community_development_grants: 280,
    regional_planning_initiatives: 150,
    small_business_support_programs: 200,
    workforce_development_programs: 180,
    infrastructure_modernization_projects: 120,
    tourism_development_initiatives: 95
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateInteriorStructuredOutputs() {
  const resources = interiorGameState.naturalResources;
  const lands = interiorGameState.landManagement;
  const infrastructure = interiorGameState.infrastructure;
  const emergency = interiorGameState.emergencyManagement;
  const environment = interiorGameState.environmentalProtection;
  const tribal = interiorGameState.tribalAffairs;
  const development = interiorGameState.regionalDevelopment;
  
  return {
    natural_resources_management: {
      resource_availability: {
        oil_reserves: resources.oil_reserves,
        natural_gas_reserves: resources.natural_gas_reserves,
        renewable_capacity: resources.renewable_energy_capacity,
        water_availability: resources.water_resources_availability
      },
      conservation_metrics: {
        protected_lands_percentage: resources.protected_lands_percentage,
        forest_coverage: resources.forest_coverage,
        conservation_programs: resources.conservation_programs_active,
        environmental_compliance: resources.environmental_compliance_rate
      },
      management_priorities: {
        conservation_priority: interiorKnobs.natural_resource_conservation_priority,
        environmental_strictness: interiorKnobs.environmental_protection_strictness,
        renewable_transition_pace: interiorKnobs.renewable_energy_transition_pace,
        wildlife_conservation: interiorKnobs.wildlife_conservation_emphasis
      }
    },
    
    land_management_status: {
      federal_land_portfolio: {
        total_federal_lands: lands.federal_lands,
        national_parks: lands.national_parks,
        wilderness_areas: lands.wilderness_areas,
        utilization_rate: lands.public_land_utilization
      },
      public_access_metrics: {
        recreational_visits: lands.recreational_visits_annual,
        land_use_permits: lands.land_use_permits_issued,
        habitat_restoration: lands.habitat_restoration_projects,
        access_balance: interiorKnobs.public_lands_access_balance
      },
      conservation_efforts: {
        conservation_programs: lands.land_conservation_programs,
        wilderness_preservation: interiorKnobs.wilderness_preservation_emphasis,
        parks_funding_priority: interiorKnobs.national_parks_funding_priority,
        recreation_development: interiorKnobs.recreation_facility_development
      }
    },
    
    infrastructure_development: {
      infrastructure_portfolio: {
        roads_maintained: infrastructure.roads_maintained,
        bridges_managed: infrastructure.bridges_managed,
        dams_operated: infrastructure.dams_operated,
        water_facilities: infrastructure.water_treatment_facilities
      },
      condition_assessment: {
        overall_condition_index: infrastructure.infrastructure_condition_index,
        modernization_projects: infrastructure.modernization_projects_active,
        annual_investment: infrastructure.annual_infrastructure_investment,
        rural_broadband_coverage: infrastructure.rural_broadband_coverage
      },
      investment_priorities: {
        infrastructure_investment_level: interiorKnobs.infrastructure_investment_level,
        regional_development_focus: interiorKnobs.regional_development_focus,
        rural_development_investment: interiorKnobs.rural_development_investment,
        public_works_modernization: interiorKnobs.public_works_modernization
      }
    },
    
    emergency_management_capabilities: {
      preparedness_metrics: {
        disaster_response_teams: emergency.disaster_response_teams,
        emergency_shelter_capacity: emergency.emergency_shelters_capacity,
        preparedness_score: emergency.disaster_preparedness_score,
        equipment_readiness: emergency.emergency_equipment_readiness
      },
      response_effectiveness: {
        annual_responses: emergency.annual_disaster_responses,
        interagency_coordination: emergency.interagency_coordination_effectiveness,
        community_resilience_programs: emergency.community_resilience_programs,
        early_warning_systems: emergency.early_warning_systems
      },
      security_priorities: {
        homeland_security_emphasis: interiorKnobs.homeland_security_emphasis,
        disaster_preparedness_investment: interiorKnobs.disaster_preparedness_investment,
        emergency_response_capability: interiorKnobs.emergency_response_capability,
        border_security_coordination: interiorKnobs.border_security_coordination
      }
    },
    
    environmental_protection_status: {
      environmental_monitoring: {
        air_quality_stations: environment.air_quality_monitoring_stations,
        water_quality_compliance: environment.water_quality_compliance_rate,
        endangered_species: environment.endangered_species_protected,
        impact_assessments: environment.environmental_impact_assessments
      },
      protection_effectiveness: {
        violations_prosecuted: environment.environmental_violations_prosecuted,
        cleanup_sites_remediated: environment.cleanup_sites_remediated,
        carbon_emissions_reduction: environment.carbon_emissions_reduction,
        renewable_projects: environment.renewable_energy_projects
      },
      environmental_priorities: {
        protection_strictness: interiorKnobs.environmental_protection_strictness,
        climate_adaptation_priority: interiorKnobs.climate_adaptation_priority,
        monitoring_investment: interiorKnobs.environmental_monitoring_investment,
        sustainable_development: interiorKnobs.sustainable_development_emphasis
      }
    },
    
    tribal_affairs_engagement: {
      tribal_relations: {
        recognized_tribes: tribal.federally_recognized_tribes,
        tribal_land_area: tribal.tribal_land_area,
        programs_funded: tribal.tribal_programs_funded,
        consultation_meetings: tribal.tribal_consultation_meetings
      },
      cultural_preservation: {
        cultural_sites_protected: tribal.cultural_sites_protected,
        language_preservation_programs: tribal.indigenous_language_preservation_programs,
        traditional_knowledge_partnerships: tribal.traditional_knowledge_partnerships,
        economic_development_projects: tribal.tribal_economic_development_projects
      },
      tribal_priorities: {
        tribal_affairs_priority: interiorKnobs.tribal_affairs_priority,
        cultural_heritage_protection: interiorKnobs.cultural_heritage_protection,
        indigenous_rights_support: interiorKnobs.indigenous_rights_support,
        traditional_knowledge_integration: interiorKnobs.traditional_knowledge_integration
      }
    },
    
    regional_development_impact: {
      development_programs: {
        rural_projects: development.rural_development_projects,
        economic_zones: development.economic_development_zones,
        community_grants: development.community_development_grants,
        planning_initiatives: development.regional_planning_initiatives
      },
      economic_support: {
        small_business_programs: development.small_business_support_programs,
        workforce_development: development.workforce_development_programs,
        infrastructure_modernization: development.infrastructure_modernization_projects,
        tourism_initiatives: development.tourism_development_initiatives
      },
      development_priorities: {
        regional_development_focus: interiorKnobs.regional_development_focus,
        rural_development_investment: interiorKnobs.rural_development_investment,
        infrastructure_investment: interiorKnobs.infrastructure_investment_level,
        sustainable_development: interiorKnobs.sustainable_development_emphasis
      }
    }
  };
}

// Apply knobs to game state
function applyInteriorKnobsToGameState() {
  const knobs = interiorKnobs;
  
  // Update natural resources based on knobs
  interiorGameState.naturalResources.protected_lands_percentage = 
    0.08 + (knobs.natural_resource_conservation_priority * 0.12); // 8% to 20%
  interiorGameState.naturalResources.renewable_energy_capacity = 
    200000 + (knobs.renewable_energy_transition_pace * 200000); // 200-400 MW
  interiorGameState.naturalResources.environmental_compliance_rate = 
    0.7 + (knobs.environmental_protection_strictness * 0.25);
  interiorGameState.naturalResources.conservation_programs_active = 
    Math.round(300 + (knobs.wildlife_conservation_emphasis * 300));
  
  // Update land management
  interiorGameState.landManagement.public_land_utilization = 
    0.4 + (knobs.public_lands_access_balance * 0.4);
  interiorGameState.landManagement.recreational_visits_annual = 
    Math.round(250000000 + (knobs.recreation_facility_development * 150000000));
  interiorGameState.landManagement.habitat_restoration_projects = 
    Math.round(120 + (knobs.wilderness_preservation_emphasis * 120));
  
  // Update infrastructure
  interiorGameState.infrastructure.annual_infrastructure_investment = 
    Math.round(25000000000 + (knobs.infrastructure_investment_level * 40000000000)); // $25-65B
  interiorGameState.infrastructure.infrastructure_condition_index = 
    0.5 + (knobs.public_works_modernization * 0.4);
  interiorGameState.infrastructure.rural_broadband_coverage = 
    0.4 + (knobs.rural_development_investment * 0.5);
  
  // Update emergency management
  interiorGameState.emergencyManagement.disaster_preparedness_score = 
    0.5 + (knobs.disaster_preparedness_investment * 0.4);
  interiorGameState.emergencyManagement.emergency_equipment_readiness = 
    0.6 + (knobs.emergency_response_capability * 0.3);
  interiorGameState.emergencyManagement.interagency_coordination_effectiveness = 
    0.5 + (knobs.border_security_coordination * 0.3) + (knobs.homeland_security_emphasis * 0.2);
  
  // Update environmental protection
  interiorGameState.environmentalProtection.water_quality_compliance_rate = 
    0.75 + (knobs.environmental_protection_strictness * 0.2);
  interiorGameState.environmentalProtection.carbon_emissions_reduction = 
    0.05 + (knobs.carbon_reduction_initiatives * 0.25); // 5% to 30% reduction
  interiorGameState.environmentalProtection.renewable_energy_projects = 
    Math.round(180 + (knobs.renewable_energy_transition_pace * 200));
  interiorGameState.environmentalProtection.environmental_violations_prosecuted = 
    Math.round(300 + (knobs.environmental_protection_strictness * 300));
  
  // Update tribal affairs
  interiorGameState.tribalAffairs.tribal_programs_funded = 
    Math.round(120 + (knobs.tribal_affairs_priority * 120));
  interiorGameState.tribalAffairs.cultural_sites_protected = 
    Math.round(70000 + (knobs.cultural_heritage_protection * 40000));
  interiorGameState.tribalAffairs.tribal_consultation_meetings = 
    Math.round(300 + (knobs.indigenous_rights_support * 300));
  interiorGameState.tribalAffairs.traditional_knowledge_partnerships = 
    Math.round(40 + (knobs.traditional_knowledge_integration * 50));
  
  // Update regional development
  interiorGameState.regionalDevelopment.rural_development_projects = 
    Math.round(200 + (knobs.rural_development_investment * 240));
  interiorGameState.regionalDevelopment.community_development_grants = 
    Math.round(180 + (knobs.regional_development_focus * 200));
  interiorGameState.regionalDevelopment.infrastructure_modernization_projects = 
    Math.round(80 + (knobs.public_works_modernization * 80));
  
  interiorGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyInteriorKnobsToGameState();

// ===== INTERIOR DEPARTMENT API ENDPOINTS =====

// Get natural resources overview
router.get('/natural-resources', (req, res) => {
  res.json({
    natural_resources: interiorGameState.naturalResources,
    resource_management: {
      conservation_priority: interiorKnobs.natural_resource_conservation_priority,
      environmental_strictness: interiorKnobs.environmental_protection_strictness,
      renewable_transition_pace: interiorKnobs.renewable_energy_transition_pace,
      wildlife_conservation: interiorKnobs.wildlife_conservation_emphasis
    },
    sustainability_metrics: {
      protected_lands_percentage: interiorGameState.naturalResources.protected_lands_percentage,
      renewable_energy_capacity: interiorGameState.naturalResources.renewable_energy_capacity,
      environmental_compliance: interiorGameState.naturalResources.environmental_compliance_rate,
      conservation_programs: interiorGameState.naturalResources.conservation_programs_active
    }
  });
});

// Get land management status
router.get('/land-management', (req, res) => {
  res.json({
    land_portfolio: interiorGameState.landManagement,
    access_policies: {
      public_access_balance: interiorKnobs.public_lands_access_balance,
      parks_funding_priority: interiorKnobs.national_parks_funding_priority,
      recreation_development: interiorKnobs.recreation_facility_development,
      wilderness_preservation: interiorKnobs.wilderness_preservation_emphasis
    },
    utilization_metrics: {
      land_utilization_rate: interiorGameState.landManagement.public_land_utilization,
      recreational_visits: interiorGameState.landManagement.recreational_visits_annual,
      permits_issued: interiorGameState.landManagement.land_use_permits_issued,
      restoration_projects: interiorGameState.landManagement.habitat_restoration_projects
    }
  });
});

// Get infrastructure status
router.get('/infrastructure', (req, res) => {
  res.json({
    infrastructure_portfolio: interiorGameState.infrastructure,
    investment_priorities: {
      infrastructure_investment_level: interiorKnobs.infrastructure_investment_level,
      public_works_modernization: interiorKnobs.public_works_modernization,
      rural_development_investment: interiorKnobs.rural_development_investment,
      regional_development_focus: interiorKnobs.regional_development_focus
    },
    condition_assessment: {
      overall_condition: interiorGameState.infrastructure.infrastructure_condition_index,
      annual_investment: interiorGameState.infrastructure.annual_infrastructure_investment,
      modernization_projects: interiorGameState.infrastructure.modernization_projects_active,
      rural_broadband_coverage: interiorGameState.infrastructure.rural_broadband_coverage
    }
  });
});

// Get emergency management capabilities
router.get('/emergency-management', (req, res) => {
  res.json({
    emergency_capabilities: interiorGameState.emergencyManagement,
    preparedness_priorities: {
      homeland_security_emphasis: interiorKnobs.homeland_security_emphasis,
      disaster_preparedness_investment: interiorKnobs.disaster_preparedness_investment,
      emergency_response_capability: interiorKnobs.emergency_response_capability,
      border_security_coordination: interiorKnobs.border_security_coordination
    },
    readiness_metrics: {
      preparedness_score: interiorGameState.emergencyManagement.disaster_preparedness_score,
      equipment_readiness: interiorGameState.emergencyManagement.emergency_equipment_readiness,
      coordination_effectiveness: interiorGameState.emergencyManagement.interagency_coordination_effectiveness,
      community_resilience: interiorGameState.emergencyManagement.community_resilience_programs
    }
  });
});

// Get environmental protection status
router.get('/environmental-protection', (req, res) => {
  res.json({
    environmental_metrics: interiorGameState.environmentalProtection,
    protection_priorities: {
      environmental_strictness: interiorKnobs.environmental_protection_strictness,
      climate_adaptation_priority: interiorKnobs.climate_adaptation_priority,
      monitoring_investment: interiorKnobs.environmental_monitoring_investment,
      carbon_reduction_initiatives: interiorKnobs.carbon_reduction_initiatives
    },
    compliance_status: {
      water_quality_compliance: interiorGameState.environmentalProtection.water_quality_compliance_rate,
      carbon_emissions_reduction: interiorGameState.environmentalProtection.carbon_emissions_reduction,
      violations_prosecuted: interiorGameState.environmentalProtection.environmental_violations_prosecuted,
      cleanup_sites_remediated: interiorGameState.environmentalProtection.cleanup_sites_remediated
    }
  });
});

// Get tribal affairs status
router.get('/tribal-affairs', (req, res) => {
  res.json({
    tribal_relations: interiorGameState.tribalAffairs,
    engagement_priorities: {
      tribal_affairs_priority: interiorKnobs.tribal_affairs_priority,
      cultural_heritage_protection: interiorKnobs.cultural_heritage_protection,
      indigenous_rights_support: interiorKnobs.indigenous_rights_support,
      traditional_knowledge_integration: interiorKnobs.traditional_knowledge_integration
    },
    cultural_preservation: {
      cultural_sites_protected: interiorGameState.tribalAffairs.cultural_sites_protected,
      language_preservation_programs: interiorGameState.tribalAffairs.indigenous_language_preservation_programs,
      consultation_meetings: interiorGameState.tribalAffairs.tribal_consultation_meetings,
      economic_development_projects: interiorGameState.tribalAffairs.tribal_economic_development_projects
    }
  });
});

// Get regional development status
router.get('/regional-development', (req, res) => {
  res.json({
    development_programs: interiorGameState.regionalDevelopment,
    development_priorities: {
      regional_development_focus: interiorKnobs.regional_development_focus,
      rural_development_investment: interiorKnobs.rural_development_investment,
      sustainable_development_emphasis: interiorKnobs.sustainable_development_emphasis,
      infrastructure_investment: interiorKnobs.infrastructure_investment_level
    },
    economic_impact: {
      rural_projects: interiorGameState.regionalDevelopment.rural_development_projects,
      economic_zones: interiorGameState.regionalDevelopment.economic_development_zones,
      community_grants: interiorGameState.regionalDevelopment.community_development_grants,
      workforce_programs: interiorGameState.regionalDevelopment.workforce_development_programs
    }
  });
});

// Simulate resource management scenario
router.post('/simulate-resource-management', (req, res) => {
  const { scenario_type, resource_type, impact_level = 0.5, duration_months = 12 } = req.body;
  
  if (!scenario_type || !resource_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type and resource_type are required'
    });
  }
  
  const knobs = interiorKnobs;
  const resources = interiorGameState.naturalResources;
  
  // Simulate resource management response
  const management_factors = {
    conservation_priority: knobs.natural_resource_conservation_priority * 0.3,
    environmental_protection: knobs.environmental_protection_strictness * 0.25,
    regulatory_oversight: knobs.mineral_extraction_regulation * 0.2,
    sustainable_development: knobs.sustainable_development_emphasis * 0.15,
    climate_adaptation: knobs.climate_adaptation_priority * 0.1
  };
  
  const management_effectiveness = Object.values(management_factors).reduce((sum, factor) => sum + factor, 0);
  const environmental_impact = Math.max(0, impact_level - (management_effectiveness * 0.8));
  const economic_benefit = impact_level * (1 - knobs.natural_resource_conservation_priority * 0.3);
  
  res.json({
    scenario_analysis: {
      scenario_type,
      resource_type,
      impact_level,
      duration_months,
      estimated_cost: Math.round(5000000 + (impact_level * 20000000))
    },
    management_assessment: {
      effectiveness_factors: management_factors,
      overall_management_effectiveness: management_effectiveness,
      environmental_impact_mitigation: 1 - environmental_impact,
      economic_benefit_realization: economic_benefit
    },
    policy_recommendations: {
      conservation_approach: knobs.natural_resource_conservation_priority > 0.7 ? 'strict_conservation' : knobs.natural_resource_conservation_priority < 0.3 ? 'development_focused' : 'balanced',
      regulatory_stance: knobs.environmental_protection_strictness > 0.7 ? 'strict_regulation' : 'moderate_oversight',
      stakeholder_engagement: knobs.tribal_affairs_priority > 0.6 ? 'extensive_consultation' : 'standard_process',
      sustainability_integration: knobs.sustainable_development_emphasis > 0.6 ? 'high_priority' : 'moderate_consideration'
    },
    expected_outcomes: {
      environmental_protection_level: 1 - environmental_impact,
      economic_development_benefit: economic_benefit,
      community_impact: knobs.regional_development_focus * 0.8,
      long_term_sustainability: management_effectiveness * 0.9
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = interiorKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'interior',
    description: 'AI-adjustable parameters for Interior Department system with enhanced input support',
    input_help: interiorKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: interiorKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = interiorKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applyInteriorKnobsToGameState();
  } catch (error) {
    console.error('Error applying Interior Department knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'interior',
    ...updateResult,
    message: 'Interior Department knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'interior',
    help: interiorKnobSystem.getKnobDescriptions(),
    current_values: interiorKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateInteriorStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Interior Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    interior_influence: {
      natural_resource_contribution: interiorGameState.naturalResources.renewable_energy_capacity / 500000,
      infrastructure_impact: interiorGameState.infrastructure.infrastructure_condition_index,
      environmental_protection_strength: interiorGameState.environmentalProtection.environmental_compliance_rate,
      emergency_preparedness_contribution: interiorGameState.emergencyManagement.disaster_preparedness_score
    },
    integration_points: {
      defense_homeland_security_coordination: interiorKnobs.homeland_security_emphasis,
      commerce_regional_development_coordination: interiorKnobs.regional_development_focus,
      health_environmental_coordination: interiorKnobs.environmental_protection_strictness,
      treasury_infrastructure_coordination: interiorKnobs.infrastructure_investment_level
    },
    system_health: {
      overall_effectiveness: (
        interiorGameState.naturalResources.environmental_compliance_rate +
        interiorGameState.infrastructure.infrastructure_condition_index +
        interiorGameState.emergencyManagement.disaster_preparedness_score
      ) / 3,
      knobs_applied: { ...interiorKnobs }
    }
  });
});

module.exports = router;
