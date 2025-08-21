/**
 * Defense Department API - Defense policy, strategic planning, and national security coordination
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const defenseKnobsData = {
  // Defense Spending & Resources
  defense_spending_level: 0.025,                  // AI can control defense spending as % of GDP (0.0-1.0)
  resource_allocation_efficiency: 0.8,            // AI can control resource allocation optimization (0.0-1.0)
  domestic_industry_preference: 0.7,              // AI can control domestic defense industry preference (0.0-1.0)
  technology_investment_priority: 0.7,            // AI can control defense technology investment (0.0-1.0)
  
  // Strategic Posture & Policy
  threat_response_aggressiveness: 0.6,            // AI can control threat response aggressiveness (0.0-1.0)
  strategic_posture_assertiveness: 0.5,           // AI can control overall strategic posture (0.0-1.0)
  crisis_response_readiness: 0.8,                 // AI can control crisis response preparedness (0.0-1.0)
  deterrence_emphasis: 0.7,                       // AI can control deterrence strategy focus (0.0-1.0)
  
  // International Relations & Cooperation
  international_cooperation_emphasis: 0.6,        // AI can control international defense cooperation (0.0-1.0)
  alliance_commitment_level: 0.75,                // AI can control alliance participation (0.0-1.0)
  peacekeeping_commitment_level: 0.3,             // AI can control peacekeeping operations (0.0-1.0)
  diplomatic_engagement_priority: 0.6,            // AI can control diplomatic engagement (0.0-1.0)
  
  // Force Structure & Capabilities
  conventional_forces_emphasis: 0.4,              // AI can control conventional military focus (0.0-1.0)
  special_operations_emphasis: 0.2,               // AI can control special operations focus (0.0-1.0)
  cyber_capabilities_emphasis: 0.2,               // AI can control cyber warfare capabilities (0.0-1.0)
  space_operations_emphasis: 0.15,                // AI can control space defense capabilities (0.0-1.0)
  
  // Innovation & Modernization
  innovation_openness: 0.6,                       // AI can control defense innovation adoption (0.0-1.0)
  modernization_pace: 0.7,                        // AI can control military modernization speed (0.0-1.0)
  emerging_tech_investment: 0.65,                 // AI can control emerging technology investment (0.0-1.0)
  research_development_focus: 0.8,                // AI can control R&D investment priority (0.0-1.0)
  
  // Transparency & Oversight
  defense_transparency_level: 0.4,                // AI can control defense policy transparency (0.0-1.0)
  public_accountability_emphasis: 0.6,            // AI can control public accountability (0.0-1.0)
  congressional_cooperation: 0.7,                 // AI can control legislative cooperation (0.0-1.0)
  civil_military_integration: 0.7,                // AI can control civil-military coordination (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const defenseKnobSystem = new EnhancedKnobSystem(defenseKnobsData);

// Backward compatibility - expose knobs directly
const defenseKnobs = defenseKnobSystem.knobs;

// Defense Game State
const defenseGameState = {
  // Defense Policy Framework
  defensePolicy: {
    strategic_doctrine: 'defensive_deterrence',
    threat_assessment_level: 0.4,
    defense_spending_ratio: 0.025, // 2.5% of GDP
    international_engagement_level: 0.6,
    technology_modernization_priority: 0.7,
    force_readiness_level: 0.75,
    strategic_reserve_capacity: 0.6
  },
  
  // Strategic Planning
  strategicPlanning: {
    defense_strategy_review_cycle: 4, // years
    force_structure_planning: {
      active_force_target: 50000,
      reserve_force_target: 25000,
      civilian_support_target: 15000,
      current_active_strength: 48500,
      current_reserve_strength: 23800,
      recruitment_rate: 0.85
    },
    capability_development_priorities: {
      air_superiority: 0.8,
      naval_defense: 0.7,
      ground_forces: 0.75,
      cyber_warfare: 0.9,
      space_operations: 0.6,
      special_operations: 0.8
    }
  },
  
  // Threat Assessment
  threatAssessment: {
    threat_matrix: {
      conventional_military: 0.3,
      cyber_attacks: 0.7,
      terrorism: 0.4,
      economic_warfare: 0.5,
      space_threats: 0.3,
      hybrid_warfare: 0.6
    },
    intelligence_confidence_levels: {
      strategic_threats: 0.8,
      tactical_threats: 0.7,
      emerging_threats: 0.5,
      regional_stability: 0.75
    },
    threat_response_capabilities: {
      rapid_response: 0.8,
      sustained_operations: 0.7,
      multi_domain_operations: 0.65,
      coalition_interoperability: 0.7
    }
  },
  
  // Defense Capabilities
  defenseCapabilities: {
    air_defense: {
      coverage_percentage: 0.85,
      system_readiness: 0.9,
      modernization_level: 0.7,
      integration_effectiveness: 0.8
    },
    naval_capabilities: {
      fleet_readiness: 0.8,
      coastal_defense_coverage: 0.9,
      power_projection_capacity: 0.6,
      maritime_domain_awareness: 0.75
    },
    ground_forces: {
      unit_readiness: 0.85,
      equipment_modernization: 0.7,
      training_effectiveness: 0.8,
      rapid_deployment_capability: 0.75
    },
    cyber_defense: {
      network_security_level: 0.8,
      threat_detection_capability: 0.85,
      response_time_efficiency: 0.9,
      resilience_rating: 0.75
    }
  },
  
  // International Cooperation
  internationalCooperation: {
    alliance_participation: {
      nato_engagement: 0.8,
      bilateral_agreements: 0.7,
      multilateral_exercises: 0.6,
      intelligence_sharing: 0.75
    },
    peacekeeping_operations: {
      current_deployments: 3,
      personnel_committed: 1200,
      mission_effectiveness: 0.7,
      international_reputation: 0.8
    },
    defense_diplomacy: {
      military_exchanges: 0.6,
      training_partnerships: 0.7,
      technology_cooperation: 0.5,
      conflict_prevention: 0.65
    }
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateDefenseStructuredOutputs() {
  const policy = defenseGameState.defensePolicy;
  const planning = defenseGameState.strategicPlanning;
  const threats = defenseGameState.threatAssessment;
  const capabilities = defenseGameState.defenseCapabilities;
  const cooperation = defenseGameState.internationalCooperation;
  
  return {
    defense_policy_analysis: {
      strategic_posture: {
        doctrine: policy.strategic_doctrine,
        threat_assessment: policy.threat_assessment_level,
        readiness_level: policy.force_readiness_level,
        modernization_priority: policy.technology_modernization_priority
      },
      resource_allocation: {
        spending_ratio: policy.defense_spending_ratio,
        efficiency_index: defenseKnobs.resource_allocation_efficiency,
        domestic_preference: defenseKnobs.domestic_industry_preference,
        technology_investment: defenseKnobs.technology_investment_priority
      },
      strategic_priorities: {
        deterrence_focus: defenseKnobs.deterrence_emphasis,
        crisis_readiness: defenseKnobs.crisis_response_readiness,
        international_engagement: defenseKnobs.international_cooperation_emphasis,
        innovation_adoption: defenseKnobs.innovation_openness
      }
    },
    
    force_structure_status: {
      personnel_strength: {
        active_forces: planning.force_structure_planning.current_active_strength,
        reserve_forces: planning.force_structure_planning.current_reserve_strength,
        recruitment_effectiveness: planning.force_structure_planning.recruitment_rate,
        target_achievement: planning.force_structure_planning.current_active_strength / planning.force_structure_planning.active_force_target
      },
      capability_priorities: planning.capability_development_priorities,
      force_emphasis: {
        conventional_focus: defenseKnobs.conventional_forces_emphasis,
        special_operations_focus: defenseKnobs.special_operations_emphasis,
        cyber_focus: defenseKnobs.cyber_capabilities_emphasis,
        space_focus: defenseKnobs.space_operations_emphasis
      }
    },
    
    threat_assessment_report: {
      threat_landscape: threats.threat_matrix,
      intelligence_confidence: threats.intelligence_confidence_levels,
      response_capabilities: threats.threat_response_capabilities,
      strategic_assessment: {
        overall_threat_level: Object.values(threats.threat_matrix).reduce((sum, val) => sum + val, 0) / Object.keys(threats.threat_matrix).length,
        response_readiness: defenseKnobs.threat_response_aggressiveness,
        deterrence_effectiveness: defenseKnobs.deterrence_emphasis
      }
    },
    
    defense_capabilities_assessment: {
      domain_capabilities: capabilities,
      overall_readiness: {
        air_defense_readiness: capabilities.air_defense.system_readiness,
        naval_readiness: capabilities.naval_capabilities.fleet_readiness,
        ground_readiness: capabilities.ground_forces.unit_readiness,
        cyber_readiness: capabilities.cyber_defense.network_security_level
      },
      modernization_status: {
        air_modernization: capabilities.air_defense.modernization_level,
        naval_modernization: capabilities.naval_capabilities.power_projection_capacity,
        ground_modernization: capabilities.ground_forces.equipment_modernization,
        cyber_modernization: capabilities.cyber_defense.resilience_rating
      }
    },
    
    international_cooperation_status: {
      alliance_engagement: cooperation.alliance_participation,
      peacekeeping_commitment: cooperation.peacekeeping_operations,
      defense_diplomacy: cooperation.defense_diplomacy,
      cooperation_effectiveness: {
        alliance_strength: defenseKnobs.alliance_commitment_level,
        peacekeeping_involvement: defenseKnobs.peacekeeping_commitment_level,
        diplomatic_engagement: defenseKnobs.diplomatic_engagement_priority,
        international_reputation: cooperation.peacekeeping_operations.international_reputation
      }
    }
  };
}

// Apply knobs to game state
function applyDefenseKnobsToGameState() {
  const knobs = defenseKnobs;
  
  // Update defense policy based on knobs
  defenseGameState.defensePolicy.defense_spending_ratio = 
    0.015 + (knobs.defense_spending_level * 0.035); // 1.5% to 5% of GDP
  defenseGameState.defensePolicy.threat_assessment_level = 
    knobs.threat_response_aggressiveness;
  defenseGameState.defensePolicy.international_engagement_level = 
    knobs.international_cooperation_emphasis;
  defenseGameState.defensePolicy.technology_modernization_priority = 
    knobs.technology_investment_priority;
  defenseGameState.defensePolicy.force_readiness_level = 
    0.5 + (knobs.crisis_response_readiness * 0.4);
  
  // Update strategic planning
  defenseGameState.strategicPlanning.capability_development_priorities.cyber_warfare = 
    0.5 + (knobs.cyber_capabilities_emphasis * 0.5);
  defenseGameState.strategicPlanning.capability_development_priorities.special_operations = 
    0.3 + (knobs.special_operations_emphasis * 0.5);
  defenseGameState.strategicPlanning.capability_development_priorities.space_operations = 
    0.2 + (knobs.space_operations_emphasis * 0.6);
  
  // Update threat response capabilities
  defenseGameState.threatAssessment.threat_response_capabilities.rapid_response = 
    0.5 + (knobs.crisis_response_readiness * 0.4);
  defenseGameState.threatAssessment.threat_response_capabilities.coalition_interoperability = 
    0.4 + (knobs.international_cooperation_emphasis * 0.4);
  
  // Update defense capabilities based on investment priorities
  defenseGameState.defenseCapabilities.cyber_defense.network_security_level = 
    0.6 + (knobs.cyber_capabilities_emphasis * 0.3);
  defenseGameState.defenseCapabilities.air_defense.modernization_level = 
    0.5 + (knobs.modernization_pace * 0.4);
  defenseGameState.defenseCapabilities.naval_capabilities.power_projection_capacity = 
    0.4 + (knobs.strategic_posture_assertiveness * 0.4);
  
  // Update international cooperation
  defenseGameState.internationalCooperation.alliance_participation.nato_engagement = 
    0.5 + (knobs.alliance_commitment_level * 0.4);
  defenseGameState.internationalCooperation.peacekeeping_operations.personnel_committed = 
    Math.round(500 + (knobs.peacekeeping_commitment_level * 1500));
  defenseGameState.internationalCooperation.defense_diplomacy.military_exchanges = 
    0.3 + (knobs.diplomatic_engagement_priority * 0.5);
  
  defenseGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyDefenseKnobsToGameState();

// ===== DEFENSE API ENDPOINTS =====

// Get defense policy overview
router.get('/policy', (req, res) => {
  res.json({
    defense_policy: defenseGameState.defensePolicy,
    strategic_priorities: {
      spending_efficiency: defenseKnobs.resource_allocation_efficiency,
      threat_responsiveness: defenseKnobs.threat_response_aggressiveness,
      international_cooperation: defenseKnobs.international_cooperation_emphasis,
      modernization_focus: defenseKnobs.technology_investment_priority
    },
    policy_metrics: {
      spending_as_gdp_percent: (defenseGameState.defensePolicy.defense_spending_ratio * 100).toFixed(2) + '%',
      readiness_level: defenseGameState.defensePolicy.force_readiness_level,
      modernization_priority: defenseGameState.defensePolicy.technology_modernization_priority
    }
  });
});

// Get force structure and personnel
router.get('/forces', (req, res) => {
  const forces = defenseGameState.strategicPlanning.force_structure_planning;
  res.json({
    force_structure: forces,
    capability_priorities: defenseGameState.strategicPlanning.capability_development_priorities,
    force_emphasis: {
      conventional_forces: defenseKnobs.conventional_forces_emphasis,
      special_operations: defenseKnobs.special_operations_emphasis,
      cyber_capabilities: defenseKnobs.cyber_capabilities_emphasis,
      space_operations: defenseKnobs.space_operations_emphasis
    },
    readiness_metrics: {
      personnel_fill_rate: forces.current_active_strength / forces.active_force_target,
      reserve_fill_rate: forces.current_reserve_strength / forces.reserve_force_target,
      recruitment_effectiveness: forces.recruitment_rate,
      overall_strength: (forces.current_active_strength + forces.current_reserve_strength) / (forces.active_force_target + forces.reserve_force_target)
    }
  });
});

// Get threat assessment
router.get('/threats', (req, res) => {
  const threats = defenseGameState.threatAssessment;
  res.json({
    threat_assessment: threats,
    response_posture: {
      aggressiveness_level: defenseKnobs.threat_response_aggressiveness,
      deterrence_emphasis: defenseKnobs.deterrence_emphasis,
      crisis_readiness: defenseKnobs.crisis_response_readiness,
      strategic_posture: defenseKnobs.strategic_posture_assertiveness
    },
    threat_analysis: {
      highest_threats: Object.entries(threats.threat_matrix)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([threat, level]) => ({ threat_type: threat, threat_level: level })),
      overall_threat_level: Object.values(threats.threat_matrix).reduce((sum, val) => sum + val, 0) / Object.keys(threats.threat_matrix).length,
      intelligence_confidence: Object.values(threats.intelligence_confidence_levels).reduce((sum, val) => sum + val, 0) / Object.keys(threats.intelligence_confidence_levels).length
    }
  });
});

// Get defense capabilities
router.get('/capabilities', (req, res) => {
  res.json({
    defense_capabilities: defenseGameState.defenseCapabilities,
    capability_summary: {
      air_defense_effectiveness: defenseGameState.defenseCapabilities.air_defense.system_readiness,
      naval_power_projection: defenseGameState.defenseCapabilities.naval_capabilities.power_projection_capacity,
      ground_force_readiness: defenseGameState.defenseCapabilities.ground_forces.unit_readiness,
      cyber_defense_strength: defenseGameState.defenseCapabilities.cyber_defense.network_security_level
    },
    modernization_status: {
      overall_modernization: (
        defenseGameState.defenseCapabilities.air_defense.modernization_level +
        defenseGameState.defenseCapabilities.naval_capabilities.power_projection_capacity +
        defenseGameState.defenseCapabilities.ground_forces.equipment_modernization +
        defenseGameState.defenseCapabilities.cyber_defense.resilience_rating
      ) / 4,
      technology_investment: defenseKnobs.technology_investment_priority,
      innovation_adoption: defenseKnobs.innovation_openness,
      modernization_pace: defenseKnobs.modernization_pace
    }
  });
});

// Get international cooperation status
router.get('/international', (req, res) => {
  res.json({
    international_cooperation: defenseGameState.internationalCooperation,
    cooperation_priorities: {
      alliance_commitment: defenseKnobs.alliance_commitment_level,
      peacekeeping_involvement: defenseKnobs.peacekeeping_commitment_level,
      diplomatic_engagement: defenseKnobs.diplomatic_engagement_priority,
      international_cooperation: defenseKnobs.international_cooperation_emphasis
    },
    engagement_metrics: {
      alliance_effectiveness: defenseGameState.internationalCooperation.alliance_participation.nato_engagement,
      peacekeeping_contribution: defenseGameState.internationalCooperation.peacekeeping_operations.personnel_committed,
      international_reputation: defenseGameState.internationalCooperation.peacekeeping_operations.international_reputation,
      diplomatic_reach: defenseGameState.internationalCooperation.defense_diplomacy.military_exchanges
    }
  });
});

// Simulate defense scenario
router.post('/simulate-scenario', (req, res) => {
  const { scenario_type, threat_level = 0.5, duration_days = 30 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const capabilities = defenseGameState.defenseCapabilities;
  const knobs = defenseKnobs;
  
  // Simulate defense response based on current capabilities and policies
  const response_effectiveness = {
    rapid_response: knobs.crisis_response_readiness * 0.4 + capabilities.ground_forces.rapid_deployment_capability * 0.3,
    sustained_operations: knobs.resource_allocation_efficiency * 0.3 + capabilities.ground_forces.unit_readiness * 0.4,
    multi_domain_coordination: knobs.civil_military_integration * 0.3 + capabilities.cyber_defense.network_security_level * 0.2,
    international_support: knobs.alliance_commitment_level * 0.5 + defenseGameState.internationalCooperation.alliance_participation.nato_engagement * 0.3
  };
  
  const overall_effectiveness = Object.values(response_effectiveness).reduce((sum, val) => sum + val, 0) / Object.keys(response_effectiveness).length;
  const resource_requirements = threat_level * duration_days * 0.01; // Simplified calculation
  
  res.json({
    scenario_analysis: {
      scenario_type,
      threat_level,
      duration_days,
      estimated_resource_cost: resource_requirements
    },
    response_assessment: {
      effectiveness_factors: response_effectiveness,
      overall_effectiveness,
      success_probability: Math.min(0.95, overall_effectiveness + (1 - threat_level) * 0.2),
      resource_adequacy: defenseGameState.defensePolicy.defense_spending_ratio > resource_requirements
    },
    capability_utilization: {
      air_defense_engagement: capabilities.air_defense.system_readiness,
      naval_support: capabilities.naval_capabilities.fleet_readiness,
      ground_operations: capabilities.ground_forces.unit_readiness,
      cyber_operations: capabilities.cyber_defense.threat_detection_capability
    },
    recommendations: {
      force_posture: knobs.strategic_posture_assertiveness > 0.7 ? 'aggressive' : knobs.strategic_posture_assertiveness < 0.3 ? 'defensive' : 'balanced',
      international_coordination: knobs.international_cooperation_emphasis > 0.6 ? 'high' : 'moderate',
      resource_mobilization: resource_requirements > defenseGameState.defensePolicy.defense_spending_ratio ? 'increase_spending' : 'current_adequate'
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = defenseKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'defense',
    description: 'AI-adjustable parameters for Defense Department system with enhanced input support',
    input_help: defenseKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: defenseKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = defenseKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applyDefenseKnobsToGameState();
  } catch (error) {
    console.error('Error applying Defense knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'defense',
    ...updateResult,
    message: 'Defense knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'defense',
    help: defenseKnobSystem.getKnobDescriptions(),
    current_values: defenseKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateDefenseStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Defense Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    defense_influence: {
      national_security_contribution: defenseGameState.defensePolicy.force_readiness_level,
      international_stability_role: defenseGameState.internationalCooperation.peacekeeping_operations.international_reputation,
      economic_impact: defenseGameState.defensePolicy.defense_spending_ratio,
      technological_advancement: defenseKnobs.technology_investment_priority
    },
    integration_points: {
      state_department_coordination: defenseKnobs.diplomatic_engagement_priority,
      treasury_budget_coordination: defenseKnobs.resource_allocation_efficiency,
      intelligence_cooperation: defenseGameState.threatAssessment.intelligence_confidence_levels.strategic_threats,
      homeland_security_integration: defenseKnobs.civil_military_integration
    },
    system_health: {
      overall_effectiveness: (
        defenseGameState.defensePolicy.force_readiness_level +
        defenseGameState.threatAssessment.threat_response_capabilities.rapid_response +
        defenseGameState.internationalCooperation.alliance_participation.nato_engagement
      ) / 3,
      knobs_applied: { ...defenseKnobs }
    }
  });
});

module.exports = router;
