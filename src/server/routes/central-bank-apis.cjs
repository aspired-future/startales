/**
 * Central Bank API - Monetary policy, financial stability, and currency management
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const centralBankKnobsData = {
  // Monetary Policy Stance & Tools
  monetary_policy_stance: 0.5,                    // AI can control policy stance: 0=accommodative, 1=restrictive (0.0-1.0)
  interest_rate_adjustment_aggressiveness: 0.6,   // AI can control rate adjustment speed (0.0-1.0)
  quantitative_easing_willingness: 0.6,           // AI can control unconventional policy tools (0.0-1.0)
  forward_guidance_commitment: 0.7,               // AI can control forward guidance strength (0.0-1.0)
  policy_communication_clarity: 0.75,             // AI can control policy communication (0.0-1.0)
  
  // Inflation Targeting & Price Stability
  inflation_targeting_strictness: 0.8,            // AI can control inflation targeting strictness (0.0-1.0)
  price_stability_priority: 0.85,                 // AI can control price stability focus (0.0-1.0)
  inflation_tolerance_range: 0.5,                 // AI can control inflation tolerance (0.0-1.0)
  deflation_prevention_emphasis: 0.7,             // AI can control deflation prevention (0.0-1.0)
  long_term_inflation_expectations_anchoring: 0.8, // AI can control expectations management (0.0-1.0)
  
  // Financial Stability & Systemic Risk
  financial_stability_priority: 0.85,             // AI can control financial stability priority (0.0-1.0)
  systemic_risk_monitoring_intensity: 0.8,        // AI can control systemic risk monitoring (0.0-1.0)
  macroprudential_activism: 0.73,                 // AI can control macroprudential policy (0.0-1.0)
  stress_testing_rigor: 0.85,                     // AI can control stress testing intensity (0.0-1.0)
  financial_crisis_preparedness: 0.88,            // AI can control crisis preparedness (0.0-1.0)
  
  // Banking Supervision & Regulation
  banking_supervision_intensity: 0.8,             // AI can control banking supervision (0.0-1.0)
  regulatory_enforcement_strictness: 0.75,        // AI can control regulatory enforcement (0.0-1.0)
  capital_adequacy_requirements: 0.8,             // AI can control capital requirements (0.0-1.0)
  liquidity_regulation_emphasis: 0.78,            // AI can control liquidity regulations (0.0-1.0)
  bank_resolution_framework_strength: 0.82,       // AI can control resolution frameworks (0.0-1.0)
  
  // Crisis Management & Emergency Response
  crisis_preparedness_investment: 0.88,           // AI can control crisis preparedness investment (0.0-1.0)
  emergency_lending_facility_readiness: 0.85,     // AI can control emergency lending (0.0-1.0)
  lender_of_last_resort_willingness: 0.8,         // AI can control lender of last resort (0.0-1.0)
  crisis_communication_effectiveness: 0.75,       // AI can control crisis communication (0.0-1.0)
  market_intervention_readiness: 0.7,             // AI can control market interventions (0.0-1.0)
  
  // Payment Systems & Financial Infrastructure
  payment_system_modernization: 0.75,             // AI can control payment system modernization (0.0-1.0)
  financial_infrastructure_investment: 0.7,       // AI can control infrastructure investment (0.0-1.0)
  payment_system_security_emphasis: 0.9,          // AI can control payment security (0.0-1.0)
  cross_border_payment_facilitation: 0.65,        // AI can control cross-border payments (0.0-1.0)
  payment_innovation_support: 0.6,                // AI can control payment innovation (0.0-1.0)
  
  // Digital Currency & Financial Innovation
  digital_currency_development_pace: 0.45,        // AI can control CBDC development (0.0-1.0)
  financial_innovation_openness: 0.7,             // AI can control financial innovation (0.0-1.0)
  fintech_regulatory_approach: 0.65,              // AI can control fintech regulation (0.0-1.0)
  cryptocurrency_regulatory_stance: 0.6,          // AI can control crypto regulation (0.0-1.0)
  blockchain_technology_adoption: 0.55,           // AI can control blockchain adoption (0.0-1.0)
  
  // International Cooperation & Coordination
  international_cooperation_level: 0.85,          // AI can control international cooperation (0.0-1.0)
  global_financial_stability_commitment: 0.8,     // AI can control global stability (0.0-1.0)
  currency_swap_agreement_willingness: 0.75,      // AI can control currency swaps (0.0-1.0)
  international_regulatory_harmonization: 0.7,    // AI can control regulatory harmonization (0.0-1.0)
  cross_border_supervision_cooperation: 0.78,     // AI can control cross-border supervision (0.0-1.0)
  
  // Transparency & Communication
  transparency_commitment: 0.8,                   // AI can control transparency level (0.0-1.0)
  public_communication_frequency: 0.75,           // AI can control communication frequency (0.0-1.0)
  market_guidance_clarity: 0.78,                  // AI can control market guidance (0.0-1.0)
  policy_decision_transparency: 0.82,             // AI can control decision transparency (0.0-1.0)
  research_publication_openness: 0.7,             // AI can control research publication (0.0-1.0)
  
  // Economic Research & Analysis
  economic_research_investment: 0.75,             // AI can control research investment (0.0-1.0)
  data_collection_comprehensiveness: 0.8,         // AI can control data collection (0.0-1.0)
  forecasting_model_sophistication: 0.78,         // AI can control forecasting models (0.0-1.0)
  policy_analysis_depth: 0.8,                     // AI can control policy analysis (0.0-1.0)
  external_research_collaboration: 0.65,          // AI can control research collaboration (0.0-1.0)
  
  // Operational Independence & Governance
  operational_independence_protection: 0.9,       // AI can control independence protection (0.0-1.0)
  political_pressure_resistance: 0.85,            // AI can control political resistance (0.0-1.0)
  governance_framework_strength: 0.88,            // AI can control governance strength (0.0-1.0)
  accountability_mechanism_robustness: 0.8,       // AI can control accountability mechanisms (0.0-1.0)
  decision_making_process_integrity: 0.9,         // AI can control decision integrity (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const centralBankKnobSystem = new EnhancedKnobSystem(centralBankKnobsData);

// Backward compatibility - expose knobs directly
const centralBankKnobs = centralBankKnobSystem.knobs;

// Central Bank Game State
const centralBankGameState = {
  // Monetary Policy
  monetaryPolicy: {
    federal_funds_rate: 0.0525, // 5.25%
    discount_rate: 0.0575, // 5.75%
    reserve_requirement_ratio: 0.10, // 10%
    money_supply_m1: 5400000000000, // $5.4T
    money_supply_m2: 21200000000000, // $21.2T
    quantitative_easing_balance: 8500000000000, // $8.5T
    inflation_target: 0.02, // 2%
    current_inflation_rate: 0.031, // 3.1%
    policy_transmission_effectiveness: 0.78,
    forward_guidance_credibility: 0.82
  },
  
  // Financial Stability
  financialStability: {
    systemic_risk_index: 0.35, // Lower is better
    bank_capital_adequacy_ratio: 0.145, // 14.5%
    stress_test_pass_rate: 0.92,
    financial_institution_health: 0.82,
    credit_growth_rate: 0.045, // 4.5%
    asset_bubble_risk_assessment: 0.28,
    financial_stability_index: 0.78,
    macroprudential_policy_effectiveness: 0.75
  },
  
  // Banking Supervision
  bankingSupervision: {
    supervised_institutions: 4800,
    examination_frequency_compliance: 0.94,
    regulatory_violations_identified: 450,
    enforcement_actions_taken: 185,
    capital_adequacy_compliance_rate: 0.96,
    liquidity_coverage_ratio_average: 1.35,
    leverage_ratio_compliance: 0.98,
    resolution_planning_completeness: 0.88
  },
  
  // Payment Systems
  paymentSystems: {
    fedwire_daily_volume: 4200000000000, // $4.2T daily
    ach_transactions_annual: 29000000000, // 29B transactions
    payment_system_availability: 0.9995, // 99.95%
    cross_border_payment_efficiency: 0.72,
    payment_fraud_rate: 0.0008, // 0.08%
    real_time_payment_adoption: 0.45,
    digital_payment_infrastructure_score: 0.78,
    payment_system_resilience_index: 0.85
  },
  
  // Crisis Management
  crisisManagement: {
    emergency_lending_facilities: 12,
    crisis_response_time_hours: 4.5,
    market_stabilization_tools: 8,
    international_swap_lines: 14,
    crisis_communication_effectiveness: 0.82,
    financial_market_intervention_capacity: 2500000000000, // $2.5T
    systemic_institution_resolution_readiness: 0.88,
    crisis_simulation_exercises_annual: 24
  },
  
  // Digital Currency & Innovation
  digitalCurrencyInnovation: {
    cbdc_research_projects: 8,
    digital_currency_pilot_programs: 3,
    fintech_regulatory_sandbox_participants: 45,
    blockchain_technology_pilots: 12,
    cryptocurrency_regulatory_framework_completeness: 0.65,
    digital_identity_infrastructure_development: 0.58,
    programmable_money_research_investment: 250000000, // $250M
    cross_border_cbdc_cooperation_agreements: 6
  },
  
  // International Cooperation
  internationalCooperation: {
    bilateral_central_bank_agreements: 85,
    multilateral_forum_participation: 25,
    currency_swap_agreements: 14,
    regulatory_information_sharing_agreements: 120,
    joint_supervision_arrangements: 35,
    international_crisis_coordination_protocols: 18,
    global_financial_stability_contributions: 1200000000, // $1.2B
    cross_border_resolution_cooperation_agreements: 28
  },
  
  // Research & Analysis
  researchAnalysis: {
    economic_research_staff: 450,
    research_publications_annual: 180,
    economic_forecasting_models: 25,
    data_collection_systems: 35,
    policy_analysis_reports_annual: 240,
    external_research_collaborations: 85,
    economic_database_maintenance_cost: 45000000, // $45M
    forecasting_accuracy_score: 0.78
  },
  
  // Transparency & Communication
  transparencyCommunication: {
    public_speeches_annual: 120,
    policy_statements_published: 48,
    congressional_testimonies: 24,
    press_conferences_annual: 16,
    research_papers_published: 180,
    public_data_releases: 450,
    communication_effectiveness_rating: 0.82,
    market_reaction_predictability: 0.75
  },
  
  // Operational Infrastructure
  operationalInfrastructure: {
    total_staff: 22000,
    annual_operating_budget: 6500000000, // $6.5B
    technology_infrastructure_investment: 850000000, // $850M
    cybersecurity_investment: 180000000, // $180M
    facility_maintenance_cost: 120000000, // $120M
    staff_training_investment: 85000000, // $85M
    operational_efficiency_score: 0.84,
    business_continuity_readiness: 0.92
  },
  
  // Independence & Governance
  independenceGovernance: {
    board_of_governors: 7,
    federal_reserve_banks: 12,
    fomc_meetings_annual: 8,
    governance_effectiveness_score: 0.88,
    political_independence_index: 0.92,
    accountability_mechanisms: 15,
    transparency_index: 0.85,
    decision_making_process_integrity: 0.9
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateCentralBankStructuredOutputs() {
  const monetary = centralBankGameState.monetaryPolicy;
  const stability = centralBankGameState.financialStability;
  const supervision = centralBankGameState.bankingSupervision;
  const payments = centralBankGameState.paymentSystems;
  const crisis = centralBankGameState.crisisManagement;
  const digital = centralBankGameState.digitalCurrencyInnovation;
  const international = centralBankGameState.internationalCooperation;
  const research = centralBankGameState.researchAnalysis;
  const transparency = centralBankGameState.transparencyCommunication;
  const operations = centralBankGameState.operationalInfrastructure;
  const governance = centralBankGameState.independenceGovernance;
  
  return {
    monetary_policy_status: {
      policy_instruments: {
        federal_funds_rate: monetary.federal_funds_rate,
        discount_rate: monetary.discount_rate,
        reserve_requirement_ratio: monetary.reserve_requirement_ratio,
        quantitative_easing_balance: monetary.quantitative_easing_balance
      },
      policy_effectiveness: {
        inflation_target: monetary.inflation_target,
        current_inflation_rate: monetary.current_inflation_rate,
        policy_transmission_effectiveness: monetary.policy_transmission_effectiveness,
        forward_guidance_credibility: monetary.forward_guidance_credibility
      },
      policy_priorities: {
        monetary_policy_stance: centralBankKnobs.monetary_policy_stance,
        inflation_targeting_strictness: centralBankKnobs.inflation_targeting_strictness,
        price_stability_priority: centralBankKnobs.price_stability_priority,
        quantitative_easing_willingness: centralBankKnobs.quantitative_easing_willingness
      }
    },
    
    financial_stability_status: {
      stability_metrics: {
        systemic_risk_index: stability.systemic_risk_index,
        bank_capital_adequacy_ratio: stability.bank_capital_adequacy_ratio,
        stress_test_pass_rate: stability.stress_test_pass_rate,
        financial_institution_health: stability.financial_institution_health
      },
      risk_assessment: {
        credit_growth_rate: stability.credit_growth_rate,
        asset_bubble_risk: stability.asset_bubble_risk_assessment,
        financial_stability_index: stability.financial_stability_index,
        macroprudential_effectiveness: stability.macroprudential_policy_effectiveness
      },
      stability_priorities: {
        financial_stability_priority: centralBankKnobs.financial_stability_priority,
        systemic_risk_monitoring: centralBankKnobs.systemic_risk_monitoring_intensity,
        macroprudential_activism: centralBankKnobs.macroprudential_activism,
        stress_testing_rigor: centralBankKnobs.stress_testing_rigor
      }
    },
    
    banking_supervision_status: {
      supervision_scope: {
        supervised_institutions: supervision.supervised_institutions,
        examination_frequency_compliance: supervision.examination_frequency_compliance,
        regulatory_violations_identified: supervision.regulatory_violations_identified,
        enforcement_actions_taken: supervision.enforcement_actions_taken
      },
      compliance_metrics: {
        capital_adequacy_compliance: supervision.capital_adequacy_compliance_rate,
        liquidity_coverage_ratio: supervision.liquidity_coverage_ratio_average,
        leverage_ratio_compliance: supervision.leverage_ratio_compliance,
        resolution_planning_completeness: supervision.resolution_planning_completeness
      },
      supervision_priorities: {
        supervision_intensity: centralBankKnobs.banking_supervision_intensity,
        regulatory_enforcement_strictness: centralBankKnobs.regulatory_enforcement_strictness,
        capital_adequacy_requirements: centralBankKnobs.capital_adequacy_requirements,
        liquidity_regulation_emphasis: centralBankKnobs.liquidity_regulation_emphasis
      }
    },
    
    payment_systems_status: {
      payment_infrastructure: {
        fedwire_daily_volume: payments.fedwire_daily_volume,
        ach_transactions_annual: payments.ach_transactions_annual,
        payment_system_availability: payments.payment_system_availability,
        cross_border_efficiency: payments.cross_border_payment_efficiency
      },
      payment_innovation: {
        payment_fraud_rate: payments.payment_fraud_rate,
        real_time_payment_adoption: payments.real_time_payment_adoption,
        digital_infrastructure_score: payments.digital_payment_infrastructure_score,
        system_resilience_index: payments.payment_system_resilience_index
      },
      payment_priorities: {
        payment_system_modernization: centralBankKnobs.payment_system_modernization,
        infrastructure_investment: centralBankKnobs.financial_infrastructure_investment,
        payment_security_emphasis: centralBankKnobs.payment_system_security_emphasis,
        payment_innovation_support: centralBankKnobs.payment_innovation_support
      }
    },
    
    crisis_management_status: {
      crisis_preparedness: {
        emergency_lending_facilities: crisis.emergency_lending_facilities,
        crisis_response_time: crisis.crisis_response_time_hours,
        market_stabilization_tools: crisis.market_stabilization_tools,
        international_swap_lines: crisis.international_swap_lines
      },
      crisis_capabilities: {
        communication_effectiveness: crisis.crisis_communication_effectiveness,
        market_intervention_capacity: crisis.financial_market_intervention_capacity,
        resolution_readiness: crisis.systemic_institution_resolution_readiness,
        crisis_exercises_annual: crisis.crisis_simulation_exercises_annual
      },
      crisis_priorities: {
        crisis_preparedness_investment: centralBankKnobs.crisis_preparedness_investment,
        emergency_lending_readiness: centralBankKnobs.emergency_lending_facility_readiness,
        lender_of_last_resort: centralBankKnobs.lender_of_last_resort_willingness,
        market_intervention_readiness: centralBankKnobs.market_intervention_readiness
      }
    },
    
    digital_currency_innovation_status: {
      digital_development: {
        cbdc_research_projects: digital.cbdc_research_projects,
        digital_currency_pilots: digital.digital_currency_pilot_programs,
        fintech_sandbox_participants: digital.fintech_regulatory_sandbox_participants,
        blockchain_pilots: digital.blockchain_technology_pilots
      },
      innovation_framework: {
        crypto_regulatory_completeness: digital.cryptocurrency_regulatory_framework_completeness,
        digital_identity_development: digital.digital_identity_infrastructure_development,
        programmable_money_investment: digital.programmable_money_research_investment,
        cbdc_cooperation_agreements: digital.cross_border_cbdc_cooperation_agreements
      },
      innovation_priorities: {
        digital_currency_development: centralBankKnobs.digital_currency_development_pace,
        financial_innovation_openness: centralBankKnobs.financial_innovation_openness,
        fintech_regulatory_approach: centralBankKnobs.fintech_regulatory_approach,
        blockchain_adoption: centralBankKnobs.blockchain_technology_adoption
      }
    },
    
    international_cooperation_status: {
      cooperation_framework: {
        bilateral_agreements: international.bilateral_central_bank_agreements,
        multilateral_participation: international.multilateral_forum_participation,
        currency_swap_agreements: international.currency_swap_agreements,
        information_sharing_agreements: international.regulatory_information_sharing_agreements
      },
      global_engagement: {
        joint_supervision_arrangements: international.joint_supervision_arrangements,
        crisis_coordination_protocols: international.international_crisis_coordination_protocols,
        stability_contributions: international.global_financial_stability_contributions,
        resolution_cooperation: international.cross_border_resolution_cooperation_agreements
      },
      cooperation_priorities: {
        international_cooperation_level: centralBankKnobs.international_cooperation_level,
        global_stability_commitment: centralBankKnobs.global_financial_stability_commitment,
        currency_swap_willingness: centralBankKnobs.currency_swap_agreement_willingness,
        regulatory_harmonization: centralBankKnobs.international_regulatory_harmonization
      }
    },
    
    transparency_communication_status: {
      communication_activities: {
        public_speeches_annual: transparency.public_speeches_annual,
        policy_statements_published: transparency.policy_statements_published,
        congressional_testimonies: transparency.congressional_testimonies,
        press_conferences_annual: transparency.press_conferences_annual
      },
      transparency_metrics: {
        research_papers_published: transparency.research_papers_published,
        public_data_releases: transparency.public_data_releases,
        communication_effectiveness: transparency.communication_effectiveness_rating,
        market_reaction_predictability: transparency.market_reaction_predictability
      },
      communication_priorities: {
        transparency_commitment: centralBankKnobs.transparency_commitment,
        communication_frequency: centralBankKnobs.public_communication_frequency,
        market_guidance_clarity: centralBankKnobs.market_guidance_clarity,
        decision_transparency: centralBankKnobs.policy_decision_transparency
      }
    }
  };
}

// Apply knobs to game state
function applyCentralBankKnobsToGameState() {
  const knobs = centralBankKnobs;
  
  // Update monetary policy based on knobs
  centralBankGameState.monetaryPolicy.federal_funds_rate = 
    0.01 + (knobs.monetary_policy_stance * 0.08); // 1% to 9%
  centralBankGameState.monetaryPolicy.policy_transmission_effectiveness = 
    0.6 + (knobs.policy_communication_clarity * 0.3);
  centralBankGameState.monetaryPolicy.forward_guidance_credibility = 
    0.65 + (knobs.forward_guidance_commitment * 0.25);
  
  // Update financial stability
  centralBankGameState.financialStability.systemic_risk_index = 
    0.5 - (knobs.systemic_risk_monitoring_intensity * 0.25); // Lower is better
  centralBankGameState.financialStability.bank_capital_adequacy_ratio = 
    0.12 + (knobs.capital_adequacy_requirements * 0.05); // 12% to 17%
  centralBankGameState.financialStability.stress_test_pass_rate = 
    0.85 + (knobs.stress_testing_rigor * 0.12);
  centralBankGameState.financialStability.macroprudential_policy_effectiveness = 
    0.6 + (knobs.macroprudential_activism * 0.3);
  
  // Update banking supervision
  centralBankGameState.bankingSupervision.examination_frequency_compliance = 
    0.88 + (knobs.banking_supervision_intensity * 0.1);
  centralBankGameState.bankingSupervision.enforcement_actions_taken = 
    Math.round(120 + (knobs.regulatory_enforcement_strictness * 130));
  centralBankGameState.bankingSupervision.capital_adequacy_compliance_rate = 
    0.92 + (knobs.capital_adequacy_requirements * 0.06);
  centralBankGameState.bankingSupervision.liquidity_coverage_ratio_average = 
    1.2 + (knobs.liquidity_regulation_emphasis * 0.3);
  
  // Update payment systems
  centralBankGameState.paymentSystems.payment_system_availability = 
    0.998 + (knobs.payment_system_modernization * 0.0015);
  centralBankGameState.paymentSystems.cross_border_payment_efficiency = 
    0.6 + (knobs.cross_border_payment_facilitation * 0.25);
  centralBankGameState.paymentSystems.real_time_payment_adoption = 
    0.3 + (knobs.payment_innovation_support * 0.4);
  centralBankGameState.paymentSystems.digital_payment_infrastructure_score = 
    0.65 + (knobs.financial_infrastructure_investment * 0.25);
  
  // Update crisis management
  centralBankGameState.crisisManagement.crisis_response_time_hours = 
    8 - (knobs.crisis_preparedness_investment * 5); // 3-8 hours
  centralBankGameState.crisisManagement.crisis_communication_effectiveness = 
    0.7 + (knobs.crisis_communication_effectiveness * 0.25);
  centralBankGameState.crisisManagement.financial_market_intervention_capacity = 
    Math.round(2000000000000 + (knobs.market_intervention_readiness * 1000000000000)); // $2-3T
  centralBankGameState.crisisManagement.systemic_institution_resolution_readiness = 
    0.75 + (knobs.bank_resolution_framework_strength * 0.2);
  
  // Update digital currency innovation
  centralBankGameState.digitalCurrencyInnovation.cbdc_research_projects = 
    Math.round(5 + (knobs.digital_currency_development_pace * 8));
  centralBankGameState.digitalCurrencyInnovation.fintech_regulatory_sandbox_participants = 
    Math.round(30 + (knobs.fintech_regulatory_approach * 40));
  centralBankGameState.digitalCurrencyInnovation.cryptocurrency_regulatory_framework_completeness = 
    0.4 + (knobs.cryptocurrency_regulatory_stance * 0.4);
  centralBankGameState.digitalCurrencyInnovation.blockchain_technology_pilots = 
    Math.round(8 + (knobs.blockchain_technology_adoption * 12));
  
  // Update international cooperation
  centralBankGameState.internationalCooperation.bilateral_central_bank_agreements = 
    Math.round(65 + (knobs.international_cooperation_level * 40));
  centralBankGameState.internationalCooperation.currency_swap_agreements = 
    Math.round(10 + (knobs.currency_swap_agreement_willingness * 8));
  centralBankGameState.internationalCooperation.global_financial_stability_contributions = 
    Math.round(800000000 + (knobs.global_financial_stability_commitment * 800000000)); // $0.8-1.6B
  centralBankGameState.internationalCooperation.cross_border_resolution_cooperation_agreements = 
    Math.round(20 + (knobs.cross_border_supervision_cooperation * 16));
  
  // Update research and analysis
  centralBankGameState.researchAnalysis.research_publications_annual = 
    Math.round(140 + (knobs.economic_research_investment * 80));
  centralBankGameState.researchAnalysis.economic_forecasting_models = 
    Math.round(18 + (knobs.forecasting_model_sophistication * 14));
  centralBankGameState.researchAnalysis.external_research_collaborations = 
    Math.round(60 + (knobs.external_research_collaboration * 50));
  centralBankGameState.researchAnalysis.forecasting_accuracy_score = 
    0.65 + (knobs.policy_analysis_depth * 0.25);
  
  // Update transparency and communication
  centralBankGameState.transparencyCommunication.public_speeches_annual = 
    Math.round(80 + (knobs.public_communication_frequency * 80));
  centralBankGameState.transparencyCommunication.research_papers_published = 
    Math.round(140 + (knobs.research_publication_openness * 80));
  centralBankGameState.transparencyCommunication.communication_effectiveness_rating = 
    0.7 + (knobs.transparency_commitment * 0.25);
  centralBankGameState.transparencyCommunication.market_reaction_predictability = 
    0.6 + (knobs.market_guidance_clarity * 0.25);
  
  // Update operational infrastructure
  centralBankGameState.operationalInfrastructure.technology_infrastructure_investment = 
    Math.round(650000000 + (knobs.payment_system_modernization * 400000000)); // $650M-1.05B
  centralBankGameState.operationalInfrastructure.cybersecurity_investment = 
    Math.round(140000000 + (knobs.payment_system_security_emphasis * 80000000)); // $140-220M
  centralBankGameState.operationalInfrastructure.operational_efficiency_score = 
    0.75 + (knobs.governance_framework_strength * 0.15);
  
  // Update independence and governance
  centralBankGameState.independenceGovernance.political_independence_index = 
    0.85 + (knobs.operational_independence_protection * 0.1);
  centralBankGameState.independenceGovernance.governance_effectiveness_score = 
    0.8 + (knobs.governance_framework_strength * 0.15);
  centralBankGameState.independenceGovernance.transparency_index = 
    0.75 + (knobs.transparency_commitment * 0.2);
  centralBankGameState.independenceGovernance.decision_making_process_integrity = 
    0.85 + (knobs.decision_making_process_integrity * 0.1);
  
  centralBankGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyCentralBankKnobsToGameState();

// ===== CENTRAL BANK API ENDPOINTS =====

// Get monetary policy status
router.get('/monetary-policy', (req, res) => {
  res.json({
    monetary_policy: centralBankGameState.monetaryPolicy,
    policy_priorities: {
      monetary_policy_stance: centralBankKnobs.monetary_policy_stance,
      inflation_targeting_strictness: centralBankKnobs.inflation_targeting_strictness,
      price_stability_priority: centralBankKnobs.price_stability_priority,
      quantitative_easing_willingness: centralBankKnobs.quantitative_easing_willingness
    },
    policy_effectiveness: {
      federal_funds_rate: centralBankGameState.monetaryPolicy.federal_funds_rate,
      inflation_gap: centralBankGameState.monetaryPolicy.current_inflation_rate - centralBankGameState.monetaryPolicy.inflation_target,
      policy_transmission: centralBankGameState.monetaryPolicy.policy_transmission_effectiveness,
      forward_guidance_credibility: centralBankGameState.monetaryPolicy.forward_guidance_credibility
    }
  });
});

// Get financial stability status
router.get('/financial-stability', (req, res) => {
  res.json({
    financial_stability: centralBankGameState.financialStability,
    stability_priorities: {
      financial_stability_priority: centralBankKnobs.financial_stability_priority,
      systemic_risk_monitoring: centralBankKnobs.systemic_risk_monitoring_intensity,
      macroprudential_activism: centralBankKnobs.macroprudential_activism,
      stress_testing_rigor: centralBankKnobs.stress_testing_rigor
    },
    stability_metrics: {
      systemic_risk_index: centralBankGameState.financialStability.systemic_risk_index,
      bank_capital_adequacy: centralBankGameState.financialStability.bank_capital_adequacy_ratio,
      stress_test_pass_rate: centralBankGameState.financialStability.stress_test_pass_rate,
      financial_stability_index: centralBankGameState.financialStability.financial_stability_index
    }
  });
});

// Get banking supervision status
router.get('/banking-supervision', (req, res) => {
  res.json({
    banking_supervision: centralBankGameState.bankingSupervision,
    supervision_priorities: {
      supervision_intensity: centralBankKnobs.banking_supervision_intensity,
      regulatory_enforcement: centralBankKnobs.regulatory_enforcement_strictness,
      capital_adequacy_requirements: centralBankKnobs.capital_adequacy_requirements,
      liquidity_regulation: centralBankKnobs.liquidity_regulation_emphasis
    },
    supervision_effectiveness: {
      supervised_institutions: centralBankGameState.bankingSupervision.supervised_institutions,
      examination_compliance: centralBankGameState.bankingSupervision.examination_frequency_compliance,
      enforcement_actions: centralBankGameState.bankingSupervision.enforcement_actions_taken,
      capital_compliance: centralBankGameState.bankingSupervision.capital_adequacy_compliance_rate
    }
  });
});

// Get payment systems status
router.get('/payment-systems', (req, res) => {
  res.json({
    payment_systems: centralBankGameState.paymentSystems,
    payment_priorities: {
      payment_modernization: centralBankKnobs.payment_system_modernization,
      infrastructure_investment: centralBankKnobs.financial_infrastructure_investment,
      payment_security: centralBankKnobs.payment_system_security_emphasis,
      innovation_support: centralBankKnobs.payment_innovation_support
    },
    payment_performance: {
      fedwire_daily_volume: centralBankGameState.paymentSystems.fedwire_daily_volume,
      system_availability: centralBankGameState.paymentSystems.payment_system_availability,
      cross_border_efficiency: centralBankGameState.paymentSystems.cross_border_payment_efficiency,
      digital_infrastructure_score: centralBankGameState.paymentSystems.digital_payment_infrastructure_score
    }
  });
});

// Get crisis management status
router.get('/crisis-management', (req, res) => {
  res.json({
    crisis_management: centralBankGameState.crisisManagement,
    crisis_priorities: {
      crisis_preparedness: centralBankKnobs.crisis_preparedness_investment,
      emergency_lending_readiness: centralBankKnobs.emergency_lending_facility_readiness,
      lender_of_last_resort: centralBankKnobs.lender_of_last_resort_willingness,
      market_intervention_readiness: centralBankKnobs.market_intervention_readiness
    },
    crisis_capabilities: {
      emergency_facilities: centralBankGameState.crisisManagement.emergency_lending_facilities,
      response_time: centralBankGameState.crisisManagement.crisis_response_time_hours,
      intervention_capacity: centralBankGameState.crisisManagement.financial_market_intervention_capacity,
      resolution_readiness: centralBankGameState.crisisManagement.systemic_institution_resolution_readiness
    }
  });
});

// Get digital currency innovation status
router.get('/digital-currency', (req, res) => {
  res.json({
    digital_currency_innovation: centralBankGameState.digitalCurrencyInnovation,
    innovation_priorities: {
      digital_currency_development: centralBankKnobs.digital_currency_development_pace,
      financial_innovation_openness: centralBankKnobs.financial_innovation_openness,
      fintech_regulatory_approach: centralBankKnobs.fintech_regulatory_approach,
      blockchain_adoption: centralBankKnobs.blockchain_technology_adoption
    },
    innovation_metrics: {
      cbdc_research_projects: centralBankGameState.digitalCurrencyInnovation.cbdc_research_projects,
      fintech_sandbox_participants: centralBankGameState.digitalCurrencyInnovation.fintech_regulatory_sandbox_participants,
      crypto_regulatory_completeness: centralBankGameState.digitalCurrencyInnovation.cryptocurrency_regulatory_framework_completeness,
      blockchain_pilots: centralBankGameState.digitalCurrencyInnovation.blockchain_technology_pilots
    }
  });
});

// Get international cooperation status
router.get('/international-cooperation', (req, res) => {
  res.json({
    international_cooperation: centralBankGameState.internationalCooperation,
    cooperation_priorities: {
      international_cooperation_level: centralBankKnobs.international_cooperation_level,
      global_stability_commitment: centralBankKnobs.global_financial_stability_commitment,
      currency_swap_willingness: centralBankKnobs.currency_swap_agreement_willingness,
      regulatory_harmonization: centralBankKnobs.international_regulatory_harmonization
    },
    cooperation_metrics: {
      bilateral_agreements: centralBankGameState.internationalCooperation.bilateral_central_bank_agreements,
      currency_swap_agreements: centralBankGameState.internationalCooperation.currency_swap_agreements,
      stability_contributions: centralBankGameState.internationalCooperation.global_financial_stability_contributions,
      resolution_cooperation: centralBankGameState.internationalCooperation.cross_border_resolution_cooperation_agreements
    }
  });
});

// Get transparency and communication status
router.get('/transparency-communication', (req, res) => {
  res.json({
    transparency_communication: centralBankGameState.transparencyCommunication,
    communication_priorities: {
      transparency_commitment: centralBankKnobs.transparency_commitment,
      communication_frequency: centralBankKnobs.public_communication_frequency,
      market_guidance_clarity: centralBankKnobs.market_guidance_clarity,
      decision_transparency: centralBankKnobs.policy_decision_transparency
    },
    communication_effectiveness: {
      public_speeches_annual: centralBankGameState.transparencyCommunication.public_speeches_annual,
      communication_effectiveness: centralBankGameState.transparencyCommunication.communication_effectiveness_rating,
      market_predictability: centralBankGameState.transparencyCommunication.market_reaction_predictability,
      research_publications: centralBankGameState.transparencyCommunication.research_papers_published
    }
  });
});

// Simulate monetary policy scenario
router.post('/simulate-monetary-scenario', (req, res) => {
  const { scenario_type, economic_shock_severity = 0.5, policy_response_urgency = 0.7, market_volatility = 0.6 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = centralBankKnobs;
  const monetary = centralBankGameState.monetaryPolicy;
  const stability = centralBankGameState.financialStability;
  
  // Simulate central bank response
  const response_factors = {
    policy_flexibility: (1 - knobs.monetary_policy_stance) * 0.25, // More accommodative = more flexible
    crisis_preparedness: knobs.crisis_preparedness_investment * 0.2,
    financial_stability_focus: knobs.financial_stability_priority * 0.15,
    communication_effectiveness: knobs.transparency_commitment * 0.15,
    international_cooperation: knobs.international_cooperation_level * 0.1,
    market_intervention_capacity: knobs.market_intervention_readiness * 0.1,
    institutional_credibility: monetary.forward_guidance_credibility * 0.05
  };
  
  const policy_response_effectiveness = Object.values(response_factors).reduce((sum, factor) => sum + factor, 0);
  const market_stabilization_success = Math.min(0.95, policy_response_effectiveness - (economic_shock_severity * 0.2) + (policy_response_urgency * 0.1));
  const policy_transmission_lag_days = Math.round(90 - (knobs.policy_communication_clarity * 30)); // 60-90 days
  
  res.json({
    scenario_analysis: {
      scenario_type,
      economic_shock_severity,
      policy_response_urgency,
      market_volatility,
      estimated_economic_impact: Math.round(economic_shock_severity * market_volatility * 500000000000) // Up to $500B
    },
    central_bank_response: {
      response_factors,
      overall_response_effectiveness: policy_response_effectiveness,
      market_stabilization_success,
      policy_transmission_lag_days
    },
    monetary_approach: {
      policy_stance: knobs.monetary_policy_stance > 0.7 ? 'restrictive' : knobs.monetary_policy_stance < 0.3 ? 'accommodative' : 'neutral',
      crisis_readiness: knobs.crisis_preparedness_investment > 0.8 ? 'highly_prepared' : 'moderately_prepared',
      communication_strategy: knobs.transparency_commitment > 0.7 ? 'highly_transparent' : 'standard_communication',
      international_coordination: knobs.international_cooperation_level > 0.7 ? 'multilateral_approach' : 'domestic_focus'
    },
    expected_outcomes: {
      financial_market_stability: market_stabilization_success * 0.9,
      economic_recovery_speed: policy_response_effectiveness * 0.8,
      inflation_control_effectiveness: knobs.inflation_targeting_strictness * 0.85,
      long_term_credibility_impact: (policy_response_effectiveness + knobs.transparency_commitment) / 2
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
createEnhancedKnobEndpoints(router, 'central-bank', centralBankKnobSystem, applyCentralBankKnobsToGameState);

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateCentralBankStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Central Bank data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    central_bank_influence: {
      monetary_policy_transmission: centralBankGameState.monetaryPolicy.policy_transmission_effectiveness,
      financial_stability_contribution: 1 - centralBankGameState.financialStability.systemic_risk_index, // inverted
      payment_system_efficiency: centralBankGameState.paymentSystems.digital_payment_infrastructure_score,
      crisis_management_readiness: centralBankGameState.crisisManagement.systemic_institution_resolution_readiness
    },
    integration_points: {
      treasury_fiscal_coordination: centralBankKnobs.inflation_targeting_strictness,
      commerce_financial_regulation_coordination: centralBankKnobs.banking_supervision_intensity,
      international_monetary_coordination: centralBankKnobs.international_cooperation_level,
      innovation_fintech_coordination: centralBankKnobs.financial_innovation_openness
    },
    system_health: {
      overall_effectiveness: (
        centralBankGameState.monetaryPolicy.policy_transmission_effectiveness +
        (1 - centralBankGameState.financialStability.systemic_risk_index) +
        centralBankGameState.independenceGovernance.governance_effectiveness_score
      ) / 3,
      knobs_applied: { ...centralBankKnobs }
    }
  });
});

module.exports = router;
