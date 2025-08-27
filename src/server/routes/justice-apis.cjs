/**
 * Justice Department API - Legal framework, judicial operations, and law enforcement coordination
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const justiceKnobsData = {
  // Judicial System & Independence
  judicial_independence_emphasis: 0.8,             // AI can control judicial independence priority (0.0-1.0)
  court_modernization_priority: 0.7,              // AI can control court system modernization (0.0-1.0)
  judicial_efficiency_focus: 0.75,                // AI can control court efficiency improvements (0.0-1.0)
  case_management_optimization: 0.7,              // AI can control case processing optimization (0.0-1.0)
  
  // Law Enforcement & Public Safety
  law_enforcement_funding_level: 0.7,             // AI can control law enforcement funding (0.0-1.0)
  public_safety_priority: 0.8,                    // AI can control public safety emphasis (0.0-1.0)
  community_policing_emphasis: 0.6,               // AI can control community policing focus (0.0-1.0)
  law_enforcement_accountability: 0.75,           // AI can control police accountability measures (0.0-1.0)
  
  // Criminal Justice Reform
  criminal_justice_reform_pace: 0.5,              // AI can control reform implementation speed (0.0-1.0)
  rehabilitation_vs_punishment_balance: 0.6,      // AI can control rehabilitation focus (0.0-1.0)
  sentencing_reform_priority: 0.55,               // AI can control sentencing reform (0.0-1.0)
  prison_system_modernization: 0.6,               // AI can control prison system improvements (0.0-1.0)
  
  // Legal Access & Aid
  legal_aid_investment_level: 0.4,                // AI can control legal aid funding (0.0-1.0)
  access_to_justice_priority: 0.65,               // AI can control justice accessibility (0.0-1.0)
  public_defender_support: 0.5,                   // AI can control public defense funding (0.0-1.0)
  legal_services_expansion: 0.55,                 // AI can control legal services expansion (0.0-1.0)
  
  // Regulatory Enforcement
  regulatory_enforcement_aggressiveness: 0.7,     // AI can control regulatory enforcement (0.0-1.0)
  corporate_accountability_emphasis: 0.65,        // AI can control corporate enforcement (0.0-1.0)
  financial_crime_prosecution_priority: 0.8,     // AI can control financial crime focus (0.0-1.0)
  antitrust_enforcement_strength: 0.6,            // AI can control antitrust enforcement (0.0-1.0)
  
  // Civil Rights & Protection
  civil_rights_protection_priority: 0.8,          // AI can control civil rights protection (0.0-1.0)
  discrimination_enforcement: 0.75,               // AI can control discrimination enforcement (0.0-1.0)
  voting_rights_protection: 0.8,                  // AI can control voting rights enforcement (0.0-1.0)
  hate_crime_prosecution_priority: 0.85,          // AI can control hate crime prosecution (0.0-1.0)
  
  // Innovation & Modernization
  digital_transformation_pace: 0.6,               // AI can control digital transformation (0.0-1.0)
  technology_adoption_rate: 0.65,                 // AI can control technology adoption (0.0-1.0)
  data_analytics_integration: 0.7,                // AI can control data analytics use (0.0-1.0)
  cybersecurity_investment: 0.8,                  // AI can control cybersecurity focus (0.0-1.0)
  
  // Alternative Justice & Community Programs
  community_justice_emphasis: 0.6,                // AI can control community justice programs (0.0-1.0)
  alternative_dispute_resolution_promotion: 0.6,  // AI can control ADR promotion (0.0-1.0)
  restorative_justice_programs: 0.55,             // AI can control restorative justice (0.0-1.0)
  diversion_program_expansion: 0.6,               // AI can control diversion programs (0.0-1.0)
  
  // Transparency & Accountability
  transparency_and_accountability_level: 0.7,     // AI can control system transparency (0.0-1.0)
  public_reporting_frequency: 0.65,               // AI can control public reporting (0.0-1.0)
  oversight_mechanism_strength: 0.7,              // AI can control oversight mechanisms (0.0-1.0)
  whistleblower_protection_emphasis: 0.75,        // AI can control whistleblower protection (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const justiceKnobSystem = new EnhancedKnobSystem(justiceKnobsData);

// Backward compatibility - expose knobs directly
const justiceKnobs = justiceKnobSystem.knobs;

// Justice Department Game State
const justiceGameState = {
  // Legal Framework
  legalFramework: {
    constitutional_strength: 0.8,
    rule_of_law_index: 0.75,
    legal_system_type: 'common_law',
    judicial_independence: 0.8,
    legal_transparency: 0.7,
    access_to_justice: 0.65,
    legal_system_efficiency: 0.72,
    public_trust_in_justice: 0.68
  },
  
  // Court System
  courtSystem: {
    supreme_court: {
      justices: 9,
      case_backlog: 150,
      average_case_duration: 180, // days
      public_confidence: 0.7,
      decisions_per_year: 65
    },
    appellate_courts: {
      circuits: 13,
      judges: 179,
      case_backlog: 8500,
      average_case_duration: 365, // days
      reversal_rate: 0.12
    },
    district_courts: {
      districts: 94,
      judges: 677,
      case_backlog: 45000,
      average_case_duration: 275, // days
      case_clearance_rate: 0.98
    },
    specialized_courts: {
      bankruptcy_courts: 90,
      tax_courts: 19,
      immigration_courts: 68,
      veterans_courts: 450
    }
  },
  
  // Law Enforcement
  lawEnforcement: {
    federal_agencies: {
      fbi_agents: 13500,
      dea_agents: 4900,
      atf_agents: 2600,
      us_marshals: 3300,
      federal_prosecutors: 5500
    },
    enforcement_metrics: {
      federal_arrests_annual: 125000,
      conviction_rate: 0.93,
      case_clearance_rate: 0.87,
      investigation_success_rate: 0.82
    },
    public_safety: {
      violent_crime_rate: 0.004, // per capita
      property_crime_rate: 0.018, // per capita
      cybercrime_cases: 15000,
      organized_crime_prosecutions: 850
    }
  },
  
  // Criminal Justice System
  criminalJustice: {
    prison_system: {
      federal_inmates: 158000,
      prison_capacity_utilization: 0.88,
      recidivism_rate: 0.32,
      rehabilitation_program_participation: 0.65
    },
    sentencing: {
      average_sentence_length: 48, // months
      mandatory_minimum_cases: 12000,
      sentence_reduction_programs: 25,
      alternative_sentencing_rate: 0.15
    },
    reform_initiatives: {
      first_step_act_participants: 3000,
      drug_court_programs: 2800,
      mental_health_courts: 450,
      veterans_treatment_courts: 450
    }
  },
  
  // Legal Aid & Access
  legalAid: {
    public_defenders: {
      attorneys: 15000,
      caseload_per_attorney: 150,
      funding_per_case: 1200,
      case_outcome_success_rate: 0.78
    },
    legal_services: {
      legal_aid_organizations: 850,
      pro_bono_hours_annual: 4500000,
      clients_served_annually: 1800000,
      civil_legal_aid_funding: 465000000 // $465M
    },
    access_metrics: {
      representation_rate_criminal: 0.95,
      representation_rate_civil: 0.23,
      language_interpretation_availability: 0.85,
      rural_legal_services_coverage: 0.45
    }
  },
  
  // Civil Rights Enforcement
  civilRights: {
    enforcement_actions: {
      discrimination_cases_filed: 450,
      voting_rights_cases: 85,
      hate_crime_prosecutions: 320,
      police_misconduct_investigations: 180
    },
    protection_metrics: {
      civil_rights_violation_conviction_rate: 0.87,
      discrimination_complaint_resolution_time: 180, // days
      voting_rights_compliance_rate: 0.92,
      hate_crime_reporting_rate: 0.58
    }
  },
  
  // Regulatory Enforcement
  regulatoryEnforcement: {
    corporate_enforcement: {
      antitrust_cases_filed: 25,
      financial_crime_prosecutions: 1200,
      corporate_fraud_cases: 850,
      regulatory_violations_prosecuted: 2400
    },
    enforcement_outcomes: {
      corporate_fines_collected: 8500000000, // $8.5B
      compliance_improvement_rate: 0.78,
      repeat_violation_rate: 0.15,
      settlement_vs_trial_rate: 0.85
    }
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateJusticeStructuredOutputs() {
  const legal = justiceGameState.legalFramework;
  const courts = justiceGameState.courtSystem;
  const enforcement = justiceGameState.lawEnforcement;
  const criminal = justiceGameState.criminalJustice;
  const aid = justiceGameState.legalAid;
  const civilRights = justiceGameState.civilRights;
  const regulatory = justiceGameState.regulatoryEnforcement;
  
  return {
    legal_framework_status: {
      system_strength: {
        constitutional_strength: legal.constitutional_strength,
        rule_of_law_index: legal.rule_of_law_index,
        judicial_independence: legal.judicial_independence,
        legal_transparency: legal.legal_transparency
      },
      access_and_efficiency: {
        access_to_justice: legal.access_to_justice,
        system_efficiency: legal.legal_system_efficiency,
        public_trust: legal.public_trust_in_justice,
        transparency_level: justiceKnobs.transparency_and_accountability_level
      },
      judicial_priorities: {
        independence_emphasis: justiceKnobs.judicial_independence_emphasis,
        modernization_priority: justiceKnobs.court_modernization_priority,
        efficiency_focus: justiceKnobs.judicial_efficiency_focus,
        case_management_optimization: justiceKnobs.case_management_optimization
      }
    },
    
    court_system_performance: {
      supreme_court_metrics: courts.supreme_court,
      appellate_court_metrics: courts.appellate_courts,
      district_court_metrics: courts.district_courts,
      specialized_courts: courts.specialized_courts,
      overall_performance: {
        total_case_backlog: courts.supreme_court.case_backlog + courts.appellate_courts.case_backlog + courts.district_courts.case_backlog,
        average_processing_time: (courts.supreme_court.average_case_duration + courts.appellate_courts.average_case_duration + courts.district_courts.average_case_duration) / 3,
        system_efficiency: courts.district_courts.case_clearance_rate,
        public_confidence: courts.supreme_court.public_confidence
      }
    },
    
    law_enforcement_capabilities: {
      federal_agencies: enforcement.federal_agencies,
      enforcement_effectiveness: enforcement.enforcement_metrics,
      public_safety_metrics: enforcement.public_safety,
      enforcement_priorities: {
        funding_level: justiceKnobs.law_enforcement_funding_level,
        public_safety_priority: justiceKnobs.public_safety_priority,
        community_policing: justiceKnobs.community_policing_emphasis,
        accountability_emphasis: justiceKnobs.law_enforcement_accountability
      }
    },
    
    criminal_justice_system_status: {
      prison_system_metrics: criminal.prison_system,
      sentencing_patterns: criminal.sentencing,
      reform_programs: criminal.reform_initiatives,
      reform_priorities: {
        reform_pace: justiceKnobs.criminal_justice_reform_pace,
        rehabilitation_focus: justiceKnobs.rehabilitation_vs_punishment_balance,
        sentencing_reform: justiceKnobs.sentencing_reform_priority,
        prison_modernization: justiceKnobs.prison_system_modernization
      }
    },
    
    legal_aid_and_access: {
      public_defense: aid.public_defenders,
      legal_services: aid.legal_services,
      access_metrics: aid.access_metrics,
      access_priorities: {
        legal_aid_investment: justiceKnobs.legal_aid_investment_level,
        access_priority: justiceKnobs.access_to_justice_priority,
        public_defender_support: justiceKnobs.public_defender_support,
        services_expansion: justiceKnobs.legal_services_expansion
      }
    },
    
    civil_rights_protection: {
      enforcement_actions: civilRights.enforcement_actions,
      protection_effectiveness: civilRights.protection_metrics,
      civil_rights_priorities: {
        protection_priority: justiceKnobs.civil_rights_protection_priority,
        discrimination_enforcement: justiceKnobs.discrimination_enforcement,
        voting_rights_protection: justiceKnobs.voting_rights_protection,
        hate_crime_prosecution: justiceKnobs.hate_crime_prosecution_priority
      }
    },
    
    regulatory_enforcement_status: {
      corporate_enforcement: regulatory.corporate_enforcement,
      enforcement_outcomes: regulatory.enforcement_outcomes,
      enforcement_priorities: {
        regulatory_aggressiveness: justiceKnobs.regulatory_enforcement_aggressiveness,
        corporate_accountability: justiceKnobs.corporate_accountability_emphasis,
        financial_crime_priority: justiceKnobs.financial_crime_prosecution_priority,
        antitrust_strength: justiceKnobs.antitrust_enforcement_strength
      }
    },
    
    innovation_and_modernization: {
      digital_transformation: {
        transformation_pace: justiceKnobs.digital_transformation_pace,
        technology_adoption: justiceKnobs.technology_adoption_rate,
        data_analytics_integration: justiceKnobs.data_analytics_integration,
        cybersecurity_investment: justiceKnobs.cybersecurity_investment
      },
      alternative_justice: {
        community_justice_emphasis: justiceKnobs.community_justice_emphasis,
        adr_promotion: justiceKnobs.alternative_dispute_resolution_promotion,
        restorative_justice: justiceKnobs.restorative_justice_programs,
        diversion_programs: justiceKnobs.diversion_program_expansion
      }
    }
  };
}

// Apply knobs to game state
function applyJusticeKnobsToGameState() {
  const knobs = justiceKnobs;
  
  // Update legal framework based on knobs
  justiceGameState.legalFramework.judicial_independence = 
    0.6 + (knobs.judicial_independence_emphasis * 0.3);
  justiceGameState.legalFramework.legal_transparency = 
    0.5 + (knobs.transparency_and_accountability_level * 0.4);
  justiceGameState.legalFramework.access_to_justice = 
    0.4 + (knobs.access_to_justice_priority * 0.5);
  justiceGameState.legalFramework.legal_system_efficiency = 
    0.5 + (knobs.judicial_efficiency_focus * 0.4);
  justiceGameState.legalFramework.public_trust_in_justice = 
    0.4 + (knobs.transparency_and_accountability_level * 0.3) + (knobs.civil_rights_protection_priority * 0.2);
  
  // Update court system efficiency
  justiceGameState.courtSystem.supreme_court.average_case_duration = 
    Math.round(240 - (knobs.case_management_optimization * 80)); // 160-240 days
  justiceGameState.courtSystem.appellate_courts.average_case_duration = 
    Math.round(450 - (knobs.court_modernization_priority * 120)); // 330-450 days
  justiceGameState.courtSystem.district_courts.case_clearance_rate = 
    0.9 + (knobs.judicial_efficiency_focus * 0.08);
  justiceGameState.courtSystem.supreme_court.public_confidence = 
    0.5 + (knobs.judicial_independence_emphasis * 0.3);
  
  // Update law enforcement metrics
  justiceGameState.lawEnforcement.enforcement_metrics.conviction_rate = 
    0.85 + (knobs.law_enforcement_funding_level * 0.1);
  justiceGameState.lawEnforcement.enforcement_metrics.case_clearance_rate = 
    0.75 + (knobs.public_safety_priority * 0.15);
  justiceGameState.lawEnforcement.public_safety.violent_crime_rate = 
    Math.max(0.001, 0.006 - (knobs.law_enforcement_funding_level * 0.003));
  
  // Update criminal justice system
  justiceGameState.criminalJustice.prison_system.recidivism_rate = 
    0.45 - (knobs.rehabilitation_vs_punishment_balance * 0.2);
  justiceGameState.criminalJustice.prison_system.rehabilitation_program_participation = 
    0.4 + (knobs.rehabilitation_vs_punishment_balance * 0.4);
  justiceGameState.criminalJustice.sentencing.alternative_sentencing_rate = 
    0.05 + (knobs.criminal_justice_reform_pace * 0.2);
  
  // Update legal aid and access
  justiceGameState.legalAid.public_defenders.funding_per_case = 
    Math.round(800 + (knobs.legal_aid_investment_level * 800)); // $800-1600
  justiceGameState.legalAid.legal_services.civil_legal_aid_funding = 
    Math.round(300000000 + (knobs.public_defender_support * 400000000)); // $300-700M
  justiceGameState.legalAid.access_metrics.representation_rate_civil = 
    0.15 + (knobs.access_to_justice_priority * 0.2);
  
  // Update civil rights enforcement
  justiceGameState.civilRights.enforcement_actions.discrimination_cases_filed = 
    Math.round(300 + (knobs.discrimination_enforcement * 300));
  justiceGameState.civilRights.enforcement_actions.hate_crime_prosecutions = 
    Math.round(200 + (knobs.hate_crime_prosecution_priority * 240));
  justiceGameState.civilRights.protection_metrics.civil_rights_violation_conviction_rate = 
    0.75 + (knobs.civil_rights_protection_priority * 0.15);
  
  // Update regulatory enforcement
  justiceGameState.regulatoryEnforcement.corporate_enforcement.financial_crime_prosecutions = 
    Math.round(800 + (knobs.financial_crime_prosecution_priority * 800));
  justiceGameState.regulatoryEnforcement.corporate_enforcement.antitrust_cases_filed = 
    Math.round(15 + (knobs.antitrust_enforcement_strength * 20));
  justiceGameState.regulatoryEnforcement.enforcement_outcomes.corporate_fines_collected = 
    Math.round(5000000000 + (knobs.regulatory_enforcement_aggressiveness * 8000000000)); // $5-13B
  
  justiceGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyJusticeKnobsToGameState();

// ===== JUSTICE DEPARTMENT API ENDPOINTS =====

// Get legal framework status
router.get('/legal-framework', (req, res) => {
  res.json({
    legal_framework: justiceGameState.legalFramework,
    framework_priorities: {
      judicial_independence: justiceKnobs.judicial_independence_emphasis,
      transparency_level: justiceKnobs.transparency_and_accountability_level,
      access_priority: justiceKnobs.access_to_justice_priority,
      efficiency_focus: justiceKnobs.judicial_efficiency_focus
    },
    system_health: {
      rule_of_law_strength: justiceGameState.legalFramework.rule_of_law_index,
      public_trust_level: justiceGameState.legalFramework.public_trust_in_justice,
      system_efficiency: justiceGameState.legalFramework.legal_system_efficiency,
      transparency_rating: justiceGameState.legalFramework.legal_transparency
    }
  });
});

// Get court system status
router.get('/courts', (req, res) => {
  res.json({
    court_system: justiceGameState.courtSystem,
    performance_metrics: {
      total_backlog: justiceGameState.courtSystem.supreme_court.case_backlog + 
                    justiceGameState.courtSystem.appellate_courts.case_backlog + 
                    justiceGameState.courtSystem.district_courts.case_backlog,
      average_processing_time: (justiceGameState.courtSystem.supreme_court.average_case_duration + 
                               justiceGameState.courtSystem.appellate_courts.average_case_duration + 
                               justiceGameState.courtSystem.district_courts.average_case_duration) / 3,
      clearance_rate: justiceGameState.courtSystem.district_courts.case_clearance_rate,
      public_confidence: justiceGameState.courtSystem.supreme_court.public_confidence
    },
    modernization_priorities: {
      court_modernization: justiceKnobs.court_modernization_priority,
      case_management_optimization: justiceKnobs.case_management_optimization,
      digital_transformation: justiceKnobs.digital_transformation_pace,
      technology_adoption: justiceKnobs.technology_adoption_rate
    }
  });
});

// Get law enforcement status
router.get('/law-enforcement', (req, res) => {
  res.json({
    law_enforcement: justiceGameState.lawEnforcement,
    enforcement_priorities: {
      funding_level: justiceKnobs.law_enforcement_funding_level,
      public_safety_priority: justiceKnobs.public_safety_priority,
      community_policing: justiceKnobs.community_policing_emphasis,
      accountability_measures: justiceKnobs.law_enforcement_accountability
    },
    public_safety_metrics: {
      violent_crime_rate: justiceGameState.lawEnforcement.public_safety.violent_crime_rate,
      conviction_rate: justiceGameState.lawEnforcement.enforcement_metrics.conviction_rate,
      case_clearance_rate: justiceGameState.lawEnforcement.enforcement_metrics.case_clearance_rate,
      investigation_success: justiceGameState.lawEnforcement.enforcement_metrics.investigation_success_rate
    }
  });
});

// Get criminal justice system status
router.get('/criminal-justice', (req, res) => {
  res.json({
    criminal_justice_system: justiceGameState.criminalJustice,
    reform_priorities: {
      reform_pace: justiceKnobs.criminal_justice_reform_pace,
      rehabilitation_focus: justiceKnobs.rehabilitation_vs_punishment_balance,
      sentencing_reform: justiceKnobs.sentencing_reform_priority,
      prison_modernization: justiceKnobs.prison_system_modernization
    },
    effectiveness_metrics: {
      recidivism_rate: justiceGameState.criminalJustice.prison_system.recidivism_rate,
      rehabilitation_participation: justiceGameState.criminalJustice.prison_system.rehabilitation_program_participation,
      alternative_sentencing_rate: justiceGameState.criminalJustice.sentencing.alternative_sentencing_rate,
      capacity_utilization: justiceGameState.criminalJustice.prison_system.prison_capacity_utilization
    }
  });
});

// Get legal aid and access status
router.get('/legal-aid', (req, res) => {
  res.json({
    legal_aid_system: justiceGameState.legalAid,
    access_priorities: {
      legal_aid_investment: justiceKnobs.legal_aid_investment_level,
      access_priority: justiceKnobs.access_to_justice_priority,
      public_defender_support: justiceKnobs.public_defender_support,
      services_expansion: justiceKnobs.legal_services_expansion
    },
    access_metrics: {
      criminal_representation_rate: justiceGameState.legalAid.access_metrics.representation_rate_criminal,
      civil_representation_rate: justiceGameState.legalAid.access_metrics.representation_rate_civil,
      funding_per_case: justiceGameState.legalAid.public_defenders.funding_per_case,
      clients_served: justiceGameState.legalAid.legal_services.clients_served_annually
    }
  });
});

// Get civil rights enforcement status
router.get('/civil-rights', (req, res) => {
  res.json({
    civil_rights_enforcement: justiceGameState.civilRights,
    protection_priorities: {
      civil_rights_priority: justiceKnobs.civil_rights_protection_priority,
      discrimination_enforcement: justiceKnobs.discrimination_enforcement,
      voting_rights_protection: justiceKnobs.voting_rights_protection,
      hate_crime_prosecution: justiceKnobs.hate_crime_prosecution_priority
    },
    enforcement_effectiveness: {
      conviction_rate: justiceGameState.civilRights.protection_metrics.civil_rights_violation_conviction_rate,
      complaint_resolution_time: justiceGameState.civilRights.protection_metrics.discrimination_complaint_resolution_time,
      voting_rights_compliance: justiceGameState.civilRights.protection_metrics.voting_rights_compliance_rate,
      hate_crime_reporting: justiceGameState.civilRights.protection_metrics.hate_crime_reporting_rate
    }
  });
});

// Get regulatory enforcement status
router.get('/regulatory-enforcement', (req, res) => {
  res.json({
    regulatory_enforcement: justiceGameState.regulatoryEnforcement,
    enforcement_priorities: {
      regulatory_aggressiveness: justiceKnobs.regulatory_enforcement_aggressiveness,
      corporate_accountability: justiceKnobs.corporate_accountability_emphasis,
      financial_crime_priority: justiceKnobs.financial_crime_prosecution_priority,
      antitrust_strength: justiceKnobs.antitrust_enforcement_strength
    },
    enforcement_outcomes: {
      corporate_fines_collected: justiceGameState.regulatoryEnforcement.enforcement_outcomes.corporate_fines_collected,
      compliance_improvement: justiceGameState.regulatoryEnforcement.enforcement_outcomes.compliance_improvement_rate,
      repeat_violation_rate: justiceGameState.regulatoryEnforcement.enforcement_outcomes.repeat_violation_rate,
      settlement_rate: justiceGameState.regulatoryEnforcement.enforcement_outcomes.settlement_vs_trial_rate
    }
  });
});

// Simulate justice system scenario
router.post('/simulate-justice-scenario', (req, res) => {
  const { scenario_type, case_complexity = 0.5, public_interest_level = 0.5, urgency = 0.5 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = justiceKnobs;
  const legal = justiceGameState.legalFramework;
  
  // Simulate justice system response
  const response_factors = {
    system_efficiency: knobs.judicial_efficiency_focus * 0.25,
    resource_availability: knobs.law_enforcement_funding_level * 0.2,
    transparency_commitment: knobs.transparency_and_accountability_level * 0.15,
    civil_rights_protection: knobs.civil_rights_protection_priority * 0.15,
    modernization_advantage: knobs.digital_transformation_pace * 0.1,
    public_trust: legal.public_trust_in_justice * 0.15
  };
  
  const system_effectiveness = Object.values(response_factors).reduce((sum, factor) => sum + factor, 0);
  const processing_time = Math.round(90 + (case_complexity * 180) - (knobs.case_management_optimization * 60));
  const success_probability = Math.min(0.95, system_effectiveness + (1 - case_complexity) * 0.2);
  
  res.json({
    scenario_analysis: {
      scenario_type,
      case_complexity,
      public_interest_level,
      urgency_level: urgency,
      estimated_processing_time_days: processing_time
    },
    system_response: {
      effectiveness_factors: response_factors,
      overall_system_effectiveness: system_effectiveness,
      success_probability,
      resource_adequacy: knobs.law_enforcement_funding_level > 0.6
    },
    justice_approach: {
      enforcement_stance: knobs.regulatory_enforcement_aggressiveness > 0.7 ? 'aggressive' : knobs.regulatory_enforcement_aggressiveness < 0.3 ? 'lenient' : 'balanced',
      civil_rights_emphasis: knobs.civil_rights_protection_priority > 0.7 ? 'high_priority' : 'standard',
      transparency_level: knobs.transparency_and_accountability_level > 0.6 ? 'high_transparency' : 'standard_disclosure',
      reform_orientation: knobs.criminal_justice_reform_pace > 0.6 ? 'reform_focused' : 'traditional_approach'
    },
    expected_outcomes: {
      case_resolution_quality: system_effectiveness * 0.9,
      public_confidence_impact: (knobs.transparency_and_accountability_level + knobs.civil_rights_protection_priority) / 2,
      system_improvement: knobs.court_modernization_priority * 0.8,
      long_term_justice_impact: system_effectiveness * 0.85
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = justiceKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'justice',
    description: 'AI-adjustable parameters for Justice Department system with enhanced input support',
    input_help: justiceKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: justiceKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = justiceKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applyJusticeKnobsToGameState();
  } catch (error) {
    console.error('Error applying Justice Department knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'justice',
    ...updateResult,
    message: 'Justice Department knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'justice',
    help: justiceKnobSystem.getKnobDescriptions(),
    current_values: justiceKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateJusticeStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Justice Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    justice_influence: {
      rule_of_law_contribution: justiceGameState.legalFramework.rule_of_law_index,
      public_safety_impact: 1 - justiceGameState.lawEnforcement.public_safety.violent_crime_rate * 250, // normalized
      civil_rights_protection_strength: justiceGameState.civilRights.protection_metrics.civil_rights_violation_conviction_rate,
      regulatory_enforcement_effectiveness: justiceGameState.regulatoryEnforcement.enforcement_outcomes.compliance_improvement_rate
    },
    integration_points: {
      homeland_security_coordination: justiceKnobs.law_enforcement_funding_level,
      treasury_financial_crime_coordination: justiceKnobs.financial_crime_prosecution_priority,
      commerce_antitrust_coordination: justiceKnobs.antitrust_enforcement_strength,
      state_civil_rights_coordination: justiceKnobs.civil_rights_protection_priority
    },
    system_health: {
      overall_effectiveness: (
        justiceGameState.legalFramework.legal_system_efficiency +
        justiceGameState.lawEnforcement.enforcement_metrics.case_clearance_rate +
        justiceGameState.civilRights.protection_metrics.civil_rights_violation_conviction_rate
      ) / 3,
      knobs_applied: { ...justiceKnobs }
    }
  });
});

module.exports = router;
