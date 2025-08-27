/**
 * State Department API - Foreign policy, diplomatic relations, and international affairs
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const stateKnobsData = {
  // Diplomatic Engagement & Strategy
  diplomatic_engagement_level: 0.7,               // AI can control overall diplomatic engagement (0.0-1.0)
  foreign_policy_assertiveness: 0.6,              // AI can control foreign policy assertiveness (0.0-1.0)
  crisis_response_aggressiveness: 0.5,            // AI can control diplomatic crisis response (0.0-1.0)
  multilateral_cooperation_emphasis: 0.8,         // AI can control multilateral engagement (0.0-1.0)
  
  // Economic Diplomacy & Trade
  economic_diplomacy_priority: 0.7,               // AI can control trade diplomatic initiatives (0.0-1.0)
  trade_liberalization_stance: 0.8,               // AI can control trade openness stance (0.0-1.0)
  sanctions_policy_willingness: 0.4,              // AI can control economic sanctions usage (0.0-1.0)
  foreign_investment_openness: 0.7,               // AI can control foreign investment policy (0.0-1.0)
  
  // Soft Power & Cultural Diplomacy
  soft_power_investment: 0.6,                     // AI can control cultural diplomacy investment (0.0-1.0)
  cultural_exchange_emphasis: 0.6,                // AI can control cultural exchange programs (0.0-1.0)
  public_diplomacy_focus: 0.65,                   // AI can control public diplomacy efforts (0.0-1.0)
  media_engagement_strategy: 0.5,                 // AI can control international media engagement (0.0-1.0)
  
  // International Aid & Development
  international_aid_generosity: 0.007,            // AI can control foreign aid as % of GDP (0.0-1.0)
  development_assistance_focus: 0.6,              // AI can control development aid focus (0.0-1.0)
  humanitarian_response_priority: 0.8,            // AI can control humanitarian aid priority (0.0-1.0)
  capacity_building_investment: 0.5,              // AI can control capacity building programs (0.0-1.0)
  
  // Human Rights & Values
  human_rights_advocacy_level: 0.6,               // AI can control human rights advocacy (0.0-1.0)
  democracy_promotion_emphasis: 0.5,              // AI can control democracy promotion (0.0-1.0)
  rule_of_law_support: 0.7,                       // AI can control rule of law initiatives (0.0-1.0)
  civil_society_engagement: 0.6,                  // AI can control civil society programs (0.0-1.0)
  
  // Alliance & Partnership Management
  alliance_commitment_strength: 0.8,              // AI can control alliance commitment (0.0-1.0)
  bilateral_relationship_priority: 0.7,           // AI can control bilateral relations focus (0.0-1.0)
  regional_partnership_emphasis: 0.6,             // AI can control regional partnerships (0.0-1.0)
  international_organization_engagement: 0.75,    // AI can control IO participation (0.0-1.0)
  
  // Transparency & Communication
  diplomatic_transparency_level: 0.5,             // AI can control diplomatic transparency (0.0-1.0)
  public_communication_openness: 0.6,             // AI can control public communication (0.0-1.0)
  congressional_cooperation: 0.7,                 // AI can control legislative cooperation (0.0-1.0)
  press_engagement_frequency: 0.6,                // AI can control media engagement (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const stateKnobSystem = new EnhancedKnobSystem(stateKnobsData);

// Backward compatibility - expose knobs directly
const stateKnobs = stateKnobSystem.knobs;

// State Department Game State
const stateGameState = {
  // Foreign Policy Framework
  foreignPolicy: {
    diplomatic_strategy: 'multilateral_engagement',
    international_standing: 0.7,
    soft_power_index: 0.65,
    foreign_aid_commitment: 0.007, // 0.7% of GDP
    trade_openness_level: 0.8,
    human_rights_emphasis: 0.6,
    global_influence_rating: 0.75,
    diplomatic_effectiveness: 0.7
  },
  
  // Diplomatic Relations & Infrastructure
  diplomaticRelations: {
    embassies: 120,
    consulates: 200,
    diplomatic_staff: 8000,
    foreign_service_officers: 3000,
    cultural_centers: 45,
    trade_missions: 85,
    diplomatic_immunity_incidents: 2,
    successful_negotiations: 45
  },
  
  // International Agreements & Treaties
  internationalAgreements: {
    bilateral_treaties: 150,
    multilateral_agreements: 85,
    trade_agreements: 25,
    defense_partnerships: 40,
    environmental_accords: 15,
    human_rights_commitments: 20,
    pending_negotiations: 12,
    treaty_compliance_rate: 0.92
  },
  
  // Economic Diplomacy
  economicDiplomacy: {
    trade_volume_facilitated: 250000000000, // $250B
    foreign_direct_investment_attracted: 45000000000, // $45B
    economic_sanctions_active: 8,
    trade_disputes_resolved: 15,
    investment_agreements: 30,
    economic_partnerships: 55,
    trade_mission_success_rate: 0.78,
    sanctions_effectiveness: 0.65
  },
  
  // Soft Power & Cultural Diplomacy
  softPower: {
    cultural_exchange_participants: 25000,
    educational_scholarships: 5000,
    language_programs: 120,
    cultural_events_hosted: 300,
    international_media_reach: 150000000,
    public_opinion_favorability: 0.68,
    cultural_influence_index: 0.72,
    educational_partnerships: 200
  },
  
  // Crisis Management & Response
  crisisManagement: {
    active_crisis_situations: 3,
    diplomatic_interventions: 8,
    mediation_efforts: 12,
    humanitarian_responses: 15,
    evacuation_operations: 2,
    crisis_resolution_success_rate: 0.75,
    response_time_efficiency: 0.8,
    international_coordination_effectiveness: 0.7
  },
  
  // International Aid & Development
  internationalAid: {
    total_aid_disbursed: 35000000000, // $35B
    development_projects: 450,
    humanitarian_assistance: 180,
    capacity_building_programs: 120,
    recipient_countries: 85,
    aid_effectiveness_rating: 0.72,
    transparency_score: 0.68,
    local_partnership_rate: 0.8
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateStateStructuredOutputs() {
  const policy = stateGameState.foreignPolicy;
  const relations = stateGameState.diplomaticRelations;
  const agreements = stateGameState.internationalAgreements;
  const economic = stateGameState.economicDiplomacy;
  const softPower = stateGameState.softPower;
  const crisis = stateGameState.crisisManagement;
  const aid = stateGameState.internationalAid;
  
  return {
    foreign_policy_analysis: {
      strategic_approach: {
        diplomatic_strategy: policy.diplomatic_strategy,
        international_standing: policy.international_standing,
        global_influence: policy.global_influence_rating,
        diplomatic_effectiveness: policy.diplomatic_effectiveness
      },
      engagement_priorities: {
        diplomatic_engagement: stateKnobs.diplomatic_engagement_level,
        multilateral_cooperation: stateKnobs.multilateral_cooperation_emphasis,
        economic_diplomacy: stateKnobs.economic_diplomacy_priority,
        soft_power_focus: stateKnobs.soft_power_investment
      },
      policy_stance: {
        human_rights_advocacy: stateKnobs.human_rights_advocacy_level,
        trade_liberalization: stateKnobs.trade_liberalization_stance,
        alliance_commitment: stateKnobs.alliance_commitment_strength,
        crisis_responsiveness: stateKnobs.crisis_response_aggressiveness
      }
    },
    
    diplomatic_infrastructure_status: {
      global_presence: {
        embassies: relations.embassies,
        consulates: relations.consulates,
        cultural_centers: softPower.cultural_events_hosted,
        trade_missions: relations.trade_missions
      },
      personnel_capacity: {
        diplomatic_staff: relations.diplomatic_staff,
        foreign_service_officers: relations.foreign_service_officers,
        staff_effectiveness: relations.successful_negotiations / (relations.successful_negotiations + 10),
        professional_development: stateKnobs.capacity_building_investment
      },
      operational_effectiveness: {
        negotiation_success_rate: relations.successful_negotiations / (relations.successful_negotiations + 15),
        treaty_compliance: agreements.treaty_compliance_rate,
        crisis_response_efficiency: crisis.response_time_efficiency,
        public_diplomacy_reach: softPower.international_media_reach
      }
    },
    
    international_agreements_portfolio: {
      agreement_statistics: agreements,
      negotiation_effectiveness: {
        bilateral_success_rate: agreements.bilateral_treaties / (agreements.bilateral_treaties + agreements.pending_negotiations),
        multilateral_participation: stateKnobs.international_organization_engagement,
        treaty_compliance_strength: agreements.treaty_compliance_rate,
        negotiation_aggressiveness: stateKnobs.foreign_policy_assertiveness
      },
      strategic_priorities: {
        trade_agreement_focus: stateKnobs.economic_diplomacy_priority,
        defense_partnership_emphasis: stateKnobs.alliance_commitment_strength,
        environmental_commitment: stateKnobs.multilateral_cooperation_emphasis * 0.8,
        human_rights_integration: stateKnobs.human_rights_advocacy_level
      }
    },
    
    economic_diplomacy_performance: {
      trade_facilitation: {
        trade_volume_impact: economic.trade_volume_facilitated,
        fdi_attraction: economic.foreign_direct_investment_attracted,
        trade_mission_effectiveness: economic.trade_mission_success_rate,
        investment_agreement_success: economic.investment_agreements
      },
      sanctions_policy: {
        active_sanctions: economic.economic_sanctions_active,
        sanctions_effectiveness: economic.sanctions_effectiveness,
        sanctions_willingness: stateKnobs.sanctions_policy_willingness,
        diplomatic_balance: 1 - stateKnobs.sanctions_policy_willingness
      },
      economic_influence: {
        trade_liberalization_impact: stateKnobs.trade_liberalization_stance,
        foreign_investment_openness: stateKnobs.foreign_investment_openness,
        economic_partnership_strength: economic.economic_partnerships,
        trade_dispute_resolution: economic.trade_disputes_resolved
      }
    },
    
    soft_power_assessment: {
      cultural_diplomacy: {
        exchange_program_reach: softPower.cultural_exchange_participants,
        educational_impact: softPower.educational_scholarships,
        cultural_influence: softPower.cultural_influence_index,
        language_program_coverage: softPower.language_programs
      },
      public_diplomacy: {
        media_reach: softPower.international_media_reach,
        public_favorability: softPower.public_opinion_favorability,
        cultural_events_impact: softPower.cultural_events_hosted,
        educational_partnerships: softPower.educational_partnerships
      },
      soft_power_investment: {
        cultural_exchange_emphasis: stateKnobs.cultural_exchange_emphasis,
        public_diplomacy_focus: stateKnobs.public_diplomacy_focus,
        media_engagement_strategy: stateKnobs.media_engagement_strategy,
        capacity_building_commitment: stateKnobs.capacity_building_investment
      }
    },
    
    crisis_management_capabilities: {
      crisis_response: {
        active_situations: crisis.active_crisis_situations,
        intervention_capacity: crisis.diplomatic_interventions,
        mediation_effectiveness: crisis.mediation_efforts,
        resolution_success_rate: crisis.crisis_resolution_success_rate
      },
      response_capabilities: {
        crisis_aggressiveness: stateKnobs.crisis_response_aggressiveness,
        humanitarian_priority: stateKnobs.humanitarian_response_priority,
        international_coordination: crisis.international_coordination_effectiveness,
        response_efficiency: crisis.response_time_efficiency
      }
    },
    
    international_aid_impact: {
      aid_distribution: {
        total_disbursement: aid.total_aid_disbursed,
        development_projects: aid.development_projects,
        humanitarian_assistance: aid.humanitarian_assistance,
        recipient_coverage: aid.recipient_countries
      },
      aid_effectiveness: {
        program_effectiveness: aid.aid_effectiveness_rating,
        transparency_level: aid.transparency_score,
        local_partnership_rate: aid.local_partnership_rate,
        capacity_building_focus: aid.capacity_building_programs
      },
      aid_policy: {
        generosity_level: stateKnobs.international_aid_generosity,
        development_focus: stateKnobs.development_assistance_focus,
        humanitarian_priority: stateKnobs.humanitarian_response_priority,
        capacity_building_investment: stateKnobs.capacity_building_investment
      }
    }
  };
}

// Apply knobs to game state
function applyStateKnobsToGameState() {
  const knobs = stateKnobs;
  
  // Update foreign policy based on knobs
  stateGameState.foreignPolicy.international_standing = 
    0.4 + (knobs.diplomatic_engagement_level * 0.4) + (knobs.soft_power_investment * 0.2);
  stateGameState.foreignPolicy.soft_power_index = 
    0.3 + (knobs.soft_power_investment * 0.4) + (knobs.cultural_exchange_emphasis * 0.3);
  stateGameState.foreignPolicy.foreign_aid_commitment = 
    0.001 + (knobs.international_aid_generosity * 0.019); // 0.1% to 2% of GDP
  stateGameState.foreignPolicy.trade_openness_level = 
    0.3 + (knobs.trade_liberalization_stance * 0.6);
  stateGameState.foreignPolicy.human_rights_emphasis = 
    knobs.human_rights_advocacy_level;
  stateGameState.foreignPolicy.global_influence_rating = 
    0.4 + (knobs.diplomatic_engagement_level * 0.3) + (knobs.multilateral_cooperation_emphasis * 0.3);
  
  // Update diplomatic relations
  stateGameState.diplomaticRelations.successful_negotiations = 
    Math.round(30 + (knobs.diplomatic_engagement_level * 25) + (knobs.foreign_policy_assertiveness * 15));
  stateGameState.diplomaticRelations.cultural_centers = 
    Math.round(30 + (knobs.cultural_exchange_emphasis * 25));
  
  // Update international agreements
  stateGameState.internationalAgreements.treaty_compliance_rate = 
    0.8 + (knobs.alliance_commitment_strength * 0.15);
  stateGameState.internationalAgreements.pending_negotiations = 
    Math.round(8 + (knobs.diplomatic_engagement_level * 8));
  
  // Update economic diplomacy
  stateGameState.economicDiplomacy.trade_volume_facilitated = 
    200000000000 + (knobs.economic_diplomacy_priority * 100000000000);
  stateGameState.economicDiplomacy.foreign_direct_investment_attracted = 
    30000000000 + (knobs.foreign_investment_openness * 30000000000);
  stateGameState.economicDiplomacy.economic_sanctions_active = 
    Math.round(3 + (knobs.sanctions_policy_willingness * 10));
  stateGameState.economicDiplomacy.trade_mission_success_rate = 
    0.6 + (knobs.economic_diplomacy_priority * 0.3);
  
  // Update soft power metrics
  stateGameState.softPower.cultural_exchange_participants = 
    Math.round(15000 + (knobs.cultural_exchange_emphasis * 20000));
  stateGameState.softPower.educational_scholarships = 
    Math.round(3000 + (knobs.soft_power_investment * 4000));
  stateGameState.softPower.public_opinion_favorability = 
    0.4 + (knobs.soft_power_investment * 0.3) + (knobs.public_diplomacy_focus * 0.2);
  stateGameState.softPower.cultural_influence_index = 
    0.5 + (knobs.cultural_exchange_emphasis * 0.3);
  
  // Update crisis management
  stateGameState.crisisManagement.crisis_resolution_success_rate = 
    0.5 + (knobs.crisis_response_aggressiveness * 0.2) + (knobs.diplomatic_engagement_level * 0.2);
  stateGameState.crisisManagement.international_coordination_effectiveness = 
    0.4 + (knobs.multilateral_cooperation_emphasis * 0.4);
  
  // Update international aid
  stateGameState.internationalAid.total_aid_disbursed = 
    20000000000 + (knobs.international_aid_generosity * 50000000000);
  stateGameState.internationalAid.development_projects = 
    Math.round(300 + (knobs.development_assistance_focus * 200));
  stateGameState.internationalAid.humanitarian_assistance = 
    Math.round(120 + (knobs.humanitarian_response_priority * 100));
  stateGameState.internationalAid.aid_effectiveness_rating = 
    0.6 + (knobs.capacity_building_investment * 0.2);
  
  stateGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyStateKnobsToGameState();

// ===== STATE DEPARTMENT API ENDPOINTS =====

// Get foreign policy overview
router.get('/foreign-policy', (req, res) => {
  res.json({
    foreign_policy: stateGameState.foreignPolicy,
    policy_priorities: {
      diplomatic_engagement: stateKnobs.diplomatic_engagement_level,
      economic_diplomacy: stateKnobs.economic_diplomacy_priority,
      soft_power_investment: stateKnobs.soft_power_investment,
      human_rights_advocacy: stateKnobs.human_rights_advocacy_level
    },
    strategic_approach: {
      multilateral_emphasis: stateKnobs.multilateral_cooperation_emphasis,
      bilateral_focus: stateKnobs.bilateral_relationship_priority,
      alliance_commitment: stateKnobs.alliance_commitment_strength,
      crisis_responsiveness: stateKnobs.crisis_response_aggressiveness
    }
  });
});

// Get diplomatic relations and infrastructure
router.get('/diplomatic-relations', (req, res) => {
  res.json({
    diplomatic_infrastructure: stateGameState.diplomaticRelations,
    global_presence: {
      embassy_coverage: stateGameState.diplomaticRelations.embassies,
      consular_services: stateGameState.diplomaticRelations.consulates,
      cultural_outreach: stateGameState.diplomaticRelations.cultural_centers,
      trade_facilitation: stateGameState.diplomaticRelations.trade_missions
    },
    operational_metrics: {
      negotiation_success_rate: stateGameState.diplomaticRelations.successful_negotiations / (stateGameState.diplomaticRelations.successful_negotiations + 15),
      staff_effectiveness: stateGameState.diplomaticRelations.foreign_service_officers / stateGameState.diplomaticRelations.diplomatic_staff,
      diplomatic_incidents: stateGameState.diplomaticRelations.diplomatic_immunity_incidents,
      overall_effectiveness: stateGameState.foreignPolicy.diplomatic_effectiveness
    }
  });
});

// Get international agreements and treaties
router.get('/agreements', (req, res) => {
  res.json({
    international_agreements: stateGameState.internationalAgreements,
    agreement_analysis: {
      bilateral_strength: stateGameState.internationalAgreements.bilateral_treaties,
      multilateral_participation: stateGameState.internationalAgreements.multilateral_agreements,
      trade_integration: stateGameState.internationalAgreements.trade_agreements,
      security_partnerships: stateGameState.internationalAgreements.defense_partnerships
    },
    negotiation_metrics: {
      compliance_rate: stateGameState.internationalAgreements.treaty_compliance_rate,
      active_negotiations: stateGameState.internationalAgreements.pending_negotiations,
      negotiation_aggressiveness: stateKnobs.foreign_policy_assertiveness,
      multilateral_engagement: stateKnobs.multilateral_cooperation_emphasis
    }
  });
});

// Get economic diplomacy status
router.get('/economic-diplomacy', (req, res) => {
  res.json({
    economic_diplomacy: stateGameState.economicDiplomacy,
    trade_impact: {
      facilitated_trade_volume: stateGameState.economicDiplomacy.trade_volume_facilitated,
      fdi_attraction: stateGameState.economicDiplomacy.foreign_direct_investment_attracted,
      trade_mission_effectiveness: stateGameState.economicDiplomacy.trade_mission_success_rate,
      dispute_resolution_success: stateGameState.economicDiplomacy.trade_disputes_resolved
    },
    sanctions_policy: {
      active_sanctions: stateGameState.economicDiplomacy.economic_sanctions_active,
      sanctions_effectiveness: stateGameState.economicDiplomacy.sanctions_effectiveness,
      sanctions_willingness: stateKnobs.sanctions_policy_willingness,
      diplomatic_preference: 1 - stateKnobs.sanctions_policy_willingness
    },
    policy_stance: {
      trade_liberalization: stateKnobs.trade_liberalization_stance,
      foreign_investment_openness: stateKnobs.foreign_investment_openness,
      economic_diplomacy_priority: stateKnobs.economic_diplomacy_priority
    }
  });
});

// Get soft power and cultural diplomacy
router.get('/soft-power', (req, res) => {
  res.json({
    soft_power_metrics: stateGameState.softPower,
    cultural_diplomacy: {
      exchange_program_impact: stateGameState.softPower.cultural_exchange_participants,
      educational_influence: stateGameState.softPower.educational_scholarships,
      cultural_events_reach: stateGameState.softPower.cultural_events_hosted,
      language_program_coverage: stateGameState.softPower.language_programs
    },
    public_diplomacy: {
      media_reach: stateGameState.softPower.international_media_reach,
      public_favorability: stateGameState.softPower.public_opinion_favorability,
      cultural_influence: stateGameState.softPower.cultural_influence_index,
      educational_partnerships: stateGameState.softPower.educational_partnerships
    },
    investment_priorities: {
      cultural_exchange_emphasis: stateKnobs.cultural_exchange_emphasis,
      public_diplomacy_focus: stateKnobs.public_diplomacy_focus,
      media_engagement_strategy: stateKnobs.media_engagement_strategy,
      soft_power_investment: stateKnobs.soft_power_investment
    }
  });
});

// Get crisis management capabilities
router.get('/crisis-management', (req, res) => {
  res.json({
    crisis_management: stateGameState.crisisManagement,
    response_capabilities: {
      active_crisis_handling: stateGameState.crisisManagement.active_crisis_situations,
      intervention_capacity: stateGameState.crisisManagement.diplomatic_interventions,
      mediation_effectiveness: stateGameState.crisisManagement.mediation_efforts,
      humanitarian_response: stateGameState.crisisManagement.humanitarian_responses
    },
    effectiveness_metrics: {
      resolution_success_rate: stateGameState.crisisManagement.crisis_resolution_success_rate,
      response_time_efficiency: stateGameState.crisisManagement.response_time_efficiency,
      international_coordination: stateGameState.crisisManagement.international_coordination_effectiveness,
      evacuation_capability: stateGameState.crisisManagement.evacuation_operations
    },
    policy_approach: {
      crisis_aggressiveness: stateKnobs.crisis_response_aggressiveness,
      humanitarian_priority: stateKnobs.humanitarian_response_priority,
      multilateral_coordination: stateKnobs.multilateral_cooperation_emphasis
    }
  });
});

// Get international aid and development
router.get('/international-aid', (req, res) => {
  res.json({
    aid_programs: stateGameState.internationalAid,
    aid_distribution: {
      total_disbursement: stateGameState.internationalAid.total_aid_disbursed,
      development_focus: stateGameState.internationalAid.development_projects,
      humanitarian_assistance: stateGameState.internationalAid.humanitarian_assistance,
      capacity_building: stateGameState.internationalAid.capacity_building_programs
    },
    effectiveness_metrics: {
      aid_effectiveness: stateGameState.internationalAid.aid_effectiveness_rating,
      transparency_score: stateGameState.internationalAid.transparency_score,
      local_partnership_rate: stateGameState.internationalAid.local_partnership_rate,
      recipient_country_coverage: stateGameState.internationalAid.recipient_countries
    },
    policy_priorities: {
      aid_generosity: stateKnobs.international_aid_generosity,
      development_assistance_focus: stateKnobs.development_assistance_focus,
      humanitarian_response_priority: stateKnobs.humanitarian_response_priority,
      capacity_building_investment: stateKnobs.capacity_building_investment
    }
  });
});

// Simulate diplomatic scenario
router.post('/simulate-diplomacy', (req, res) => {
  const { scenario_type, countries_involved = [], complexity_level = 0.5, urgency = 0.5 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = stateKnobs;
  const policy = stateGameState.foreignPolicy;
  
  // Simulate diplomatic response based on current policies and capabilities
  const diplomatic_factors = {
    engagement_strength: knobs.diplomatic_engagement_level * 0.3,
    multilateral_coordination: knobs.multilateral_cooperation_emphasis * 0.25,
    crisis_responsiveness: knobs.crisis_response_aggressiveness * urgency * 0.2,
    soft_power_influence: knobs.soft_power_investment * 0.15,
    economic_leverage: knobs.economic_diplomacy_priority * 0.1
  };
  
  const success_probability = Object.values(diplomatic_factors).reduce((sum, factor) => sum + factor, 0) + 
    (policy.international_standing * 0.2) - (complexity_level * 0.15);
  
  const estimated_duration = Math.round(30 + (complexity_level * 60) - (knobs.crisis_response_aggressiveness * 20));
  
  res.json({
    scenario_analysis: {
      scenario_type,
      countries_involved,
      complexity_level,
      urgency_level: urgency,
      estimated_duration_days: estimated_duration
    },
    diplomatic_assessment: {
      success_factors: diplomatic_factors,
      overall_success_probability: Math.min(0.95, Math.max(0.05, success_probability)),
      international_standing_impact: policy.international_standing,
      soft_power_advantage: policy.soft_power_index
    },
    recommended_approach: {
      primary_strategy: knobs.multilateral_cooperation_emphasis > 0.6 ? 'multilateral' : knobs.bilateral_relationship_priority > 0.7 ? 'bilateral' : 'mixed',
      economic_tools_usage: knobs.economic_diplomacy_priority > 0.6 ? 'high' : 'moderate',
      soft_power_deployment: knobs.soft_power_investment > 0.6 ? 'extensive' : 'limited',
      crisis_response_level: knobs.crisis_response_aggressiveness > 0.7 ? 'aggressive' : knobs.crisis_response_aggressiveness < 0.3 ? 'cautious' : 'balanced'
    },
    resource_requirements: {
      diplomatic_personnel: Math.round(10 + (complexity_level * 20)),
      estimated_cost: Math.round(1000000 + (complexity_level * 5000000)),
      international_coordination_needed: knobs.multilateral_cooperation_emphasis > 0.5,
      media_engagement_required: knobs.public_communication_openness > 0.5
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = stateKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'state',
    description: 'AI-adjustable parameters for State Department system with enhanced input support',
    input_help: stateKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: stateKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = stateKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applyStateKnobsToGameState();
  } catch (error) {
    console.error('Error applying State Department knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'state',
    ...updateResult,
    message: 'State Department knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'state',
    help: stateKnobSystem.getKnobDescriptions(),
    current_values: stateKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateStateStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured State Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    state_influence: {
      international_standing_contribution: stateGameState.foreignPolicy.international_standing,
      economic_diplomacy_impact: stateGameState.economicDiplomacy.trade_volume_facilitated / 1000000000, // In billions
      soft_power_projection: stateGameState.foreignPolicy.soft_power_index,
      crisis_management_capability: stateGameState.crisisManagement.crisis_resolution_success_rate
    },
    integration_points: {
      defense_coordination: stateKnobs.alliance_commitment_strength,
      treasury_aid_coordination: stateKnobs.international_aid_generosity,
      commerce_trade_coordination: stateKnobs.economic_diplomacy_priority,
      justice_human_rights_coordination: stateKnobs.human_rights_advocacy_level
    },
    system_health: {
      overall_effectiveness: (
        stateGameState.foreignPolicy.diplomatic_effectiveness +
        stateGameState.crisisManagement.crisis_resolution_success_rate +
        stateGameState.internationalAid.aid_effectiveness_rating
      ) / 3,
      knobs_applied: { ...stateKnobs }
    }
  });
});

module.exports = router;
