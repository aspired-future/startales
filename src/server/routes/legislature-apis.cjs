/**
 * Legislature API - Legislative process, lawmaking, and congressional operations
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const legislatureKnobsData = {
  // Bipartisan Cooperation & Political Process
  bipartisan_cooperation_emphasis: 0.6,           // AI can control bipartisan cooperation promotion (0.0-1.0)
  political_polarization_management: 0.55,        // AI can control polarization reduction efforts (0.0-1.0)
  compromise_facilitation_priority: 0.65,         // AI can control compromise facilitation (0.0-1.0)
  cross_party_dialogue_investment: 0.6,           // AI can control cross-party dialogue (0.0-1.0)
  coalition_building_emphasis: 0.58,              // AI can control coalition building (0.0-1.0)
  
  // Legislative Efficiency & Productivity
  legislative_efficiency_priority: 0.7,           // AI can control legislative efficiency (0.0-1.0)
  bill_processing_speed_optimization: 0.65,       // AI can control bill processing speed (0.0-1.0)
  committee_productivity_focus: 0.7,              // AI can control committee productivity (0.0-1.0)
  legislative_calendar_optimization: 0.68,        // AI can control calendar efficiency (0.0-1.0)
  procedural_streamlining: 0.6,                   // AI can control procedural efficiency (0.0-1.0)
  
  // Committee System & Structure
  committee_system_strengthening: 0.7,            // AI can control committee system effectiveness (0.0-1.0)
  committee_specialization_depth: 0.75,           // AI can control committee specialization (0.0-1.0)
  subcommittee_autonomy_level: 0.65,              // AI can control subcommittee autonomy (0.0-1.0)
  committee_staff_investment: 0.68,               // AI can control committee staffing (0.0-1.0)
  expert_testimony_utilization: 0.72,             // AI can control expert testimony use (0.0-1.0)
  
  // Oversight & Accountability
  oversight_intensity: 0.75,                      // AI can control executive oversight intensity (0.0-1.0)
  investigative_capacity_investment: 0.7,         // AI can control investigative capacity (0.0-1.0)
  accountability_mechanism_strength: 0.78,        // AI can control accountability mechanisms (0.0-1.0)
  whistleblower_protection_emphasis: 0.72,        // AI can control whistleblower protection (0.0-1.0)
  government_transparency_enforcement: 0.75,      // AI can control transparency enforcement (0.0-1.0)
  
  // Public Engagement & Transparency
  public_engagement_investment: 0.65,             // AI can control public engagement (0.0-1.0)
  transparency_commitment: 0.75,                  // AI can control legislative transparency (0.0-1.0)
  citizen_participation_facilitation: 0.6,        // AI can control citizen participation (0.0-1.0)
  public_hearing_accessibility: 0.68,             // AI can control hearing accessibility (0.0-1.0)
  legislative_communication_clarity: 0.62,        // AI can control communication clarity (0.0-1.0)
  
  // Innovation & Modernization
  legislative_innovation_adoption: 0.55,          // AI can control innovation adoption (0.0-1.0)
  technology_integration_pace: 0.6,               // AI can control technology integration (0.0-1.0)
  digital_democracy_initiatives: 0.52,            // AI can control digital democracy (0.0-1.0)
  data_driven_policymaking: 0.58,                 // AI can control data-driven policy (0.0-1.0)
  legislative_analytics_investment: 0.55,         // AI can control analytics investment (0.0-1.0)
  
  // Institutional Reform & Governance
  institutional_reform_willingness: 0.45,         // AI can control institutional reform (0.0-1.0)
  rules_modernization_priority: 0.5,              // AI can control rules modernization (0.0-1.0)
  governance_structure_optimization: 0.48,        // AI can control governance optimization (0.0-1.0)
  ethics_enforcement_strictness: 0.8,             // AI can control ethics enforcement (0.0-1.0)
  conflict_of_interest_management: 0.78,          // AI can control conflict management (0.0-1.0)
  
  // Constitutional & Legal Framework
  constitutional_adherence_strictness: 0.85,      // AI can control constitutional adherence (0.0-1.0)
  legal_precedent_respect: 0.82,                  // AI can control legal precedent respect (0.0-1.0)
  constitutional_interpretation_approach: 0.75,   // AI can control interpretation approach (0.0-1.0)
  separation_of_powers_maintenance: 0.88,         // AI can control separation of powers (0.0-1.0)
  checks_and_balances_enforcement: 0.85,          // AI can control checks and balances (0.0-1.0)
  
  // Inter-branch Relations
  executive_branch_cooperation: 0.5,              // AI can control executive cooperation (0.0-1.0)
  judicial_deference_level: 0.75,                 // AI can control judicial deference (0.0-1.0)
  inter_branch_communication: 0.65,               // AI can control inter-branch communication (0.0-1.0)
  constitutional_crisis_management: 0.8,          // AI can control crisis management (0.0-1.0)
  power_balance_maintenance: 0.82,                // AI can control power balance (0.0-1.0)
  
  // Crisis Response & Emergency Powers
  crisis_response_agility: 0.65,                  // AI can control crisis response agility (0.0-1.0)
  emergency_legislation_speed: 0.7,               // AI can control emergency legislation (0.0-1.0)
  national_security_responsiveness: 0.75,         // AI can control security responsiveness (0.0-1.0)
  disaster_response_coordination: 0.68,           // AI can control disaster response (0.0-1.0)
  wartime_powers_management: 0.8,                 // AI can control wartime powers (0.0-1.0)
  
  // Legislative Research & Analysis
  policy_research_investment: 0.7,                // AI can control policy research (0.0-1.0)
  legislative_analysis_depth: 0.72,               // AI can control analysis depth (0.0-1.0)
  evidence_based_lawmaking: 0.68,                 // AI can control evidence-based policy (0.0-1.0)
  external_expertise_utilization: 0.65,           // AI can control external expertise (0.0-1.0)
  policy_impact_assessment_rigor: 0.7,            // AI can control impact assessment (0.0-1.0)
  
  // Representation & Constituency Services
  constituent_service_priority: 0.75,             // AI can control constituent services (0.0-1.0)
  district_representation_balance: 0.7,           // AI can control district representation (0.0-1.0)
  minority_voice_protection: 0.72,                // AI can control minority voice protection (0.0-1.0)
  regional_interest_balance: 0.68,                // AI can control regional interest balance (0.0-1.0)
  special_interest_resistance: 0.65,              // AI can control special interest resistance (0.0-1.0)
  
  // International & Federal Relations
  international_treaty_oversight: 0.78,           // AI can control treaty oversight (0.0-1.0)
  federal_state_coordination: 0.7,                // AI can control federal-state coordination (0.0-1.0)
  interstate_commerce_regulation: 0.72,           // AI can control interstate commerce (0.0-1.0)
  foreign_policy_input_level: 0.65,               // AI can control foreign policy input (0.0-1.0)
  trade_agreement_scrutiny: 0.75,                 // AI can control trade agreement oversight (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const legislatureKnobSystem = new EnhancedKnobSystem(legislatureKnobsData);

// Backward compatibility - expose knobs directly
const legislatureKnobs = legislatureKnobSystem.knobs;

// Legislature Game State
const legislatureGameState = {
  // Congressional Composition
  congressionalComposition: {
    house_seats: 435,
    senate_seats: 100,
    house_majority_party_seats: 222,
    senate_majority_party_seats: 51,
    house_minority_party_seats: 213,
    senate_minority_party_seats: 49,
    political_polarization_index: 0.78, // Higher = more polarized
    bipartisan_cooperation_level: 0.32,
    committee_effectiveness: 0.68,
    leadership_approval_rating: 0.45
  },
  
  // Legislative Process
  legislativeProcess: {
    bills_introduced_annually: 8500,
    bills_passed_house: 285,
    bills_passed_senate: 165,
    bills_enacted_into_law: 145,
    legislative_success_rate: 0.017, // 1.7%
    average_bill_processing_time: 180, // days
    committee_markup_sessions: 1200,
    floor_votes_conducted: 850,
    amendment_success_rate: 0.25,
    filibuster_usage_frequency: 0.15
  },
  
  // Committee System
  committeeSystem: {
    house_committees: 20,
    senate_committees: 16,
    joint_committees: 4,
    subcommittees_total: 104,
    committee_hearings_annual: 2400,
    witness_testimonies_annual: 8500,
    committee_reports_published: 450,
    markup_sessions_annual: 1200,
    committee_staff_total: 2800,
    committee_budget_total: 180000000 // $180M
  },
  
  // Oversight Activities
  oversightActivities: {
    oversight_hearings_annual: 650,
    investigative_reports_published: 85,
    subpoenas_issued: 120,
    contempt_citations: 8,
    inspector_general_reports_reviewed: 450,
    government_accountability_office_requests: 320,
    executive_branch_document_requests: 1200,
    whistleblower_complaints_processed: 180
  },
  
  // Public Engagement
  publicEngagement: {
    public_hearings_annual: 450,
    town_halls_conducted: 1800,
    constituent_meetings: 25000,
    public_comments_received: 180000,
    legislative_website_visits: 45000000,
    social_media_engagement_rate: 0.12,
    civic_education_programs: 85,
    public_satisfaction_with_congress: 0.28
  },
  
  // Legislative Innovation
  legislativeInnovation: {
    digital_voting_systems: 2,
    online_public_comment_platforms: 8,
    ai_assisted_bill_analysis_tools: 5,
    virtual_hearing_capabilities: 12,
    blockchain_voting_pilots: 1,
    data_analytics_platforms: 6,
    automated_transcription_systems: 15,
    digital_archive_accessibility: 0.78
  },
  
  // Ethics & Accountability
  ethicsAccountability: {
    ethics_violations_investigated: 25,
    financial_disclosure_compliance_rate: 0.96,
    lobbying_contact_reports_filed: 45000,
    ethics_training_completion_rate: 0.94,
    conflict_of_interest_recusals: 180,
    ethics_committee_investigations: 12,
    disciplinary_actions_taken: 8,
    transparency_score: 0.72
  },
  
  // Inter-branch Relations
  interBranchRelations: {
    executive_meetings_annual: 240,
    judicial_consultations: 45,
    constitutional_challenges_filed: 25,
    veto_overrides_attempted: 8,
    veto_overrides_successful: 2,
    supreme_court_deference_rate: 0.75,
    executive_privilege_disputes: 6,
    separation_of_powers_conflicts: 12
  },
  
  // Crisis Response
  crisisResponse: {
    emergency_sessions_called: 4,
    crisis_legislation_passed: 12,
    disaster_relief_bills: 8,
    national_security_briefings: 120,
    emergency_powers_authorizations: 3,
    wartime_legislation_enacted: 0,
    pandemic_response_measures: 15,
    crisis_response_time_hours: 18
  },
  
  // Research & Analysis
  researchAnalysis: {
    congressional_research_service_staff: 600,
    policy_analysis_reports_annual: 1200,
    legislative_impact_assessments: 450,
    economic_analysis_studies: 180,
    legal_precedent_research_requests: 850,
    external_expert_consultations: 2400,
    think_tank_collaborations: 85,
    academic_research_partnerships: 120
  },
  
  // Representation & Services
  representationServices: {
    constituent_service_cases_annual: 1200000,
    casework_resolution_rate: 0.78,
    district_office_visits: 450000,
    federal_agency_interventions: 85000,
    immigration_case_assistance: 120000,
    veterans_affairs_cases: 180000,
    social_security_cases: 250000,
    medicare_medicaid_cases: 95000
  },
  
  // International & Federal Relations
  internationalFederalRelations: {
    treaty_ratifications_considered: 8,
    international_agreements_reviewed: 45,
    foreign_policy_hearings: 120,
    trade_agreement_oversight_sessions: 25,
    diplomatic_briefings_received: 180,
    international_parliamentary_exchanges: 35,
    federal_state_coordination_meetings: 240,
    interstate_compact_approvals: 12
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateLegislatureStructuredOutputs() {
  const composition = legislatureGameState.congressionalComposition;
  const process = legislatureGameState.legislativeProcess;
  const committees = legislatureGameState.committeeSystem;
  const oversight = legislatureGameState.oversightActivities;
  const engagement = legislatureGameState.publicEngagement;
  const innovation = legislatureGameState.legislativeInnovation;
  const ethics = legislatureGameState.ethicsAccountability;
  const interBranch = legislatureGameState.interBranchRelations;
  const crisis = legislatureGameState.crisisResponse;
  const research = legislatureGameState.researchAnalysis;
  const representation = legislatureGameState.representationServices;
  const international = legislatureGameState.internationalFederalRelations;
  
  return {
    congressional_composition_status: {
      chamber_composition: {
        house_seats: composition.house_seats,
        senate_seats: composition.senate_seats,
        house_majority_seats: composition.house_majority_party_seats,
        senate_majority_seats: composition.senate_majority_party_seats
      },
      political_dynamics: {
        political_polarization_index: composition.political_polarization_index,
        bipartisan_cooperation_level: composition.bipartisan_cooperation_level,
        committee_effectiveness: composition.committee_effectiveness,
        leadership_approval_rating: composition.leadership_approval_rating
      },
      cooperation_priorities: {
        bipartisan_cooperation_emphasis: legislatureKnobs.bipartisan_cooperation_emphasis,
        polarization_management: legislatureKnobs.political_polarization_management,
        compromise_facilitation: legislatureKnobs.compromise_facilitation_priority,
        coalition_building: legislatureKnobs.coalition_building_emphasis
      }
    },
    
    legislative_process_status: {
      legislative_productivity: {
        bills_introduced_annually: process.bills_introduced_annually,
        bills_enacted_into_law: process.bills_enacted_into_law,
        legislative_success_rate: process.legislative_success_rate,
        average_processing_time: process.average_bill_processing_time
      },
      process_efficiency: {
        committee_markup_sessions: process.committee_markup_sessions,
        floor_votes_conducted: process.floor_votes_conducted,
        amendment_success_rate: process.amendment_success_rate,
        filibuster_usage_frequency: process.filibuster_usage_frequency
      },
      efficiency_priorities: {
        legislative_efficiency_priority: legislatureKnobs.legislative_efficiency_priority,
        bill_processing_optimization: legislatureKnobs.bill_processing_speed_optimization,
        committee_productivity_focus: legislatureKnobs.committee_productivity_focus,
        procedural_streamlining: legislatureKnobs.procedural_streamlining
      }
    },
    
    committee_system_status: {
      committee_structure: {
        house_committees: committees.house_committees,
        senate_committees: committees.senate_committees,
        joint_committees: committees.joint_committees,
        subcommittees_total: committees.subcommittees_total
      },
      committee_activity: {
        committee_hearings_annual: committees.committee_hearings_annual,
        witness_testimonies_annual: committees.witness_testimonies_annual,
        committee_reports_published: committees.committee_reports_published,
        committee_staff_total: committees.committee_staff_total
      },
      committee_priorities: {
        committee_system_strengthening: legislatureKnobs.committee_system_strengthening,
        committee_specialization_depth: legislatureKnobs.committee_specialization_depth,
        committee_staff_investment: legislatureKnobs.committee_staff_investment,
        expert_testimony_utilization: legislatureKnobs.expert_testimony_utilization
      }
    },
    
    oversight_activities_status: {
      oversight_scope: {
        oversight_hearings_annual: oversight.oversight_hearings_annual,
        investigative_reports_published: oversight.investigative_reports_published,
        subpoenas_issued: oversight.subpoenas_issued,
        contempt_citations: oversight.contempt_citations
      },
      accountability_mechanisms: {
        inspector_general_reports_reviewed: oversight.inspector_general_reports_reviewed,
        gao_requests: oversight.government_accountability_office_requests,
        document_requests: oversight.executive_branch_document_requests,
        whistleblower_complaints: oversight.whistleblower_complaints_processed
      },
      oversight_priorities: {
        oversight_intensity: legislatureKnobs.oversight_intensity,
        investigative_capacity_investment: legislatureKnobs.investigative_capacity_investment,
        accountability_mechanism_strength: legislatureKnobs.accountability_mechanism_strength,
        transparency_enforcement: legislatureKnobs.government_transparency_enforcement
      }
    },
    
    public_engagement_status: {
      engagement_activities: {
        public_hearings_annual: engagement.public_hearings_annual,
        town_halls_conducted: engagement.town_halls_conducted,
        constituent_meetings: engagement.constituent_meetings,
        public_comments_received: engagement.public_comments_received
      },
      digital_engagement: {
        website_visits: engagement.legislative_website_visits,
        social_media_engagement: engagement.social_media_engagement_rate,
        civic_education_programs: engagement.civic_education_programs,
        public_satisfaction: engagement.public_satisfaction_with_congress
      },
      engagement_priorities: {
        public_engagement_investment: legislatureKnobs.public_engagement_investment,
        transparency_commitment: legislatureKnobs.transparency_commitment,
        citizen_participation_facilitation: legislatureKnobs.citizen_participation_facilitation,
        communication_clarity: legislatureKnobs.legislative_communication_clarity
      }
    },
    
    legislative_innovation_status: {
      technology_adoption: {
        digital_voting_systems: innovation.digital_voting_systems,
        online_comment_platforms: innovation.online_public_comment_platforms,
        ai_analysis_tools: innovation.ai_assisted_bill_analysis_tools,
        virtual_hearing_capabilities: innovation.virtual_hearing_capabilities
      },
      innovation_initiatives: {
        blockchain_voting_pilots: innovation.blockchain_voting_pilots,
        data_analytics_platforms: innovation.data_analytics_platforms,
        automated_transcription: innovation.automated_transcription_systems,
        digital_archive_accessibility: innovation.digital_archive_accessibility
      },
      innovation_priorities: {
        innovation_adoption: legislatureKnobs.legislative_innovation_adoption,
        technology_integration_pace: legislatureKnobs.technology_integration_pace,
        digital_democracy_initiatives: legislatureKnobs.digital_democracy_initiatives,
        data_driven_policymaking: legislatureKnobs.data_driven_policymaking
      }
    },
    
    ethics_accountability_status: {
      ethics_enforcement: {
        ethics_violations_investigated: ethics.ethics_violations_investigated,
        financial_disclosure_compliance: ethics.financial_disclosure_compliance_rate,
        lobbying_reports_filed: ethics.lobbying_contact_reports_filed,
        ethics_training_completion: ethics.ethics_training_completion_rate
      },
      accountability_measures: {
        conflict_recusals: ethics.conflict_of_interest_recusals,
        ethics_investigations: ethics.ethics_committee_investigations,
        disciplinary_actions: ethics.disciplinary_actions_taken,
        transparency_score: ethics.transparency_score
      },
      ethics_priorities: {
        ethics_enforcement_strictness: legislatureKnobs.ethics_enforcement_strictness,
        conflict_management: legislatureKnobs.conflict_of_interest_management,
        transparency_commitment: legislatureKnobs.transparency_commitment,
        institutional_reform_willingness: legislatureKnobs.institutional_reform_willingness
      }
    },
    
    inter_branch_relations_status: {
      executive_relations: {
        executive_meetings_annual: interBranch.executive_meetings_annual,
        constitutional_challenges: interBranch.constitutional_challenges_filed,
        veto_overrides_attempted: interBranch.veto_overrides_attempted,
        executive_privilege_disputes: interBranch.executive_privilege_disputes
      },
      judicial_relations: {
        judicial_consultations: interBranch.judicial_consultations,
        supreme_court_deference_rate: interBranch.supreme_court_deference_rate,
        separation_of_powers_conflicts: interBranch.separation_of_powers_conflicts,
        veto_override_success_rate: interBranch.veto_overrides_successful / Math.max(1, interBranch.veto_overrides_attempted)
      },
      inter_branch_priorities: {
        executive_cooperation: legislatureKnobs.executive_branch_cooperation,
        judicial_deference: legislatureKnobs.judicial_deference_level,
        constitutional_adherence: legislatureKnobs.constitutional_adherence_strictness,
        power_balance_maintenance: legislatureKnobs.power_balance_maintenance
      }
    },
    
    crisis_response_status: {
      crisis_capabilities: {
        emergency_sessions_called: crisis.emergency_sessions_called,
        crisis_legislation_passed: crisis.crisis_legislation_passed,
        disaster_relief_bills: crisis.disaster_relief_bills,
        emergency_powers_authorizations: crisis.emergency_powers_authorizations
      },
      response_effectiveness: {
        national_security_briefings: crisis.national_security_briefings,
        pandemic_response_measures: crisis.pandemic_response_measures,
        crisis_response_time_hours: crisis.crisis_response_time_hours,
        wartime_legislation_enacted: crisis.wartime_legislation_enacted
      },
      crisis_priorities: {
        crisis_response_agility: legislatureKnobs.crisis_response_agility,
        emergency_legislation_speed: legislatureKnobs.emergency_legislation_speed,
        national_security_responsiveness: legislatureKnobs.national_security_responsiveness,
        disaster_response_coordination: legislatureKnobs.disaster_response_coordination
      }
    }
  };
}

// Apply knobs to game state
function applyLegislatureKnobsToGameState() {
  const knobs = legislatureKnobs;
  
  // Update congressional composition based on knobs
  legislatureGameState.congressionalComposition.bipartisan_cooperation_level = 
    0.2 + (knobs.bipartisan_cooperation_emphasis * 0.4);
  legislatureGameState.congressionalComposition.political_polarization_index = 
    0.9 - (knobs.political_polarization_management * 0.4); // Lower is better
  legislatureGameState.congressionalComposition.committee_effectiveness = 
    0.5 + (knobs.committee_system_strengthening * 0.4);
  legislatureGameState.congressionalComposition.leadership_approval_rating = 
    0.3 + (knobs.bipartisan_cooperation_emphasis * 0.3);
  
  // Update legislative process
  legislatureGameState.legislativeProcess.legislative_success_rate = 
    0.01 + (knobs.legislative_efficiency_priority * 0.02); // 1% to 3%
  legislatureGameState.legislativeProcess.average_bill_processing_time = 
    240 - (knobs.bill_processing_speed_optimization * 120); // 120-240 days
  legislatureGameState.legislativeProcess.bills_enacted_into_law = 
    Math.round(100 + (knobs.legislative_efficiency_priority * 100));
  legislatureGameState.legislativeProcess.amendment_success_rate = 
    0.15 + (knobs.compromise_facilitation_priority * 0.2);
  
  // Update committee system
  legislatureGameState.committeeSystem.committee_hearings_annual = 
    Math.round(2000 + (knobs.committee_productivity_focus * 800));
  legislatureGameState.committeeSystem.witness_testimonies_annual = 
    Math.round(7000 + (knobs.expert_testimony_utilization * 3000));
  legislatureGameState.committeeSystem.committee_reports_published = 
    Math.round(350 + (knobs.committee_specialization_depth * 200));
  legislatureGameState.committeeSystem.committee_staff_total = 
    Math.round(2400 + (knobs.committee_staff_investment * 800));
  
  // Update oversight activities
  legislatureGameState.oversightActivities.oversight_hearings_annual = 
    Math.round(500 + (knobs.oversight_intensity * 300));
  legislatureGameState.oversightActivities.investigative_reports_published = 
    Math.round(60 + (knobs.investigative_capacity_investment * 50));
  legislatureGameState.oversightActivities.subpoenas_issued = 
    Math.round(80 + (knobs.accountability_mechanism_strength * 80));
  legislatureGameState.oversightActivities.whistleblower_complaints_processed = 
    Math.round(140 + (knobs.whistleblower_protection_emphasis * 80));
  
  // Update public engagement
  legislatureGameState.publicEngagement.public_hearings_annual = 
    Math.round(350 + (knobs.public_engagement_investment * 200));
  legislatureGameState.publicEngagement.town_halls_conducted = 
    Math.round(1400 + (knobs.citizen_participation_facilitation * 800));
  legislatureGameState.publicEngagement.public_satisfaction_with_congress = 
    0.2 + (knobs.transparency_commitment * 0.2) + (knobs.bipartisan_cooperation_emphasis * 0.15);
  legislatureGameState.publicEngagement.social_media_engagement_rate = 
    0.08 + (knobs.legislative_communication_clarity * 0.08);
  
  // Update legislative innovation
  legislatureGameState.legislativeInnovation.ai_assisted_bill_analysis_tools = 
    Math.round(3 + (knobs.legislative_innovation_adoption * 7));
  legislatureGameState.legislativeInnovation.online_public_comment_platforms = 
    Math.round(5 + (knobs.digital_democracy_initiatives * 8));
  legislatureGameState.legislativeInnovation.data_analytics_platforms = 
    Math.round(4 + (knobs.data_driven_policymaking * 8));
  legislatureGameState.legislativeInnovation.digital_archive_accessibility = 
    0.6 + (knobs.technology_integration_pace * 0.3);
  
  // Update ethics and accountability
  legislatureGameState.ethicsAccountability.financial_disclosure_compliance_rate = 
    0.92 + (knobs.ethics_enforcement_strictness * 0.06);
  legislatureGameState.ethicsAccountability.ethics_training_completion_rate = 
    0.9 + (knobs.ethics_enforcement_strictness * 0.08);
  legislatureGameState.ethicsAccountability.transparency_score = 
    0.6 + (knobs.transparency_commitment * 0.25);
  legislatureGameState.ethicsAccountability.disciplinary_actions_taken = 
    Math.round(5 + (knobs.ethics_enforcement_strictness * 8));
  
  // Update inter-branch relations
  legislatureGameState.interBranchRelations.executive_meetings_annual = 
    Math.round(180 + (knobs.executive_branch_cooperation * 120));
  legislatureGameState.interBranchRelations.supreme_court_deference_rate = 
    0.6 + (knobs.judicial_deference_level * 0.3);
  legislatureGameState.interBranchRelations.constitutional_challenges_filed = 
    Math.round(35 - (knobs.constitutional_adherence_strictness * 15)); // Fewer challenges with higher adherence
  legislatureGameState.interBranchRelations.separation_of_powers_conflicts = 
    Math.round(20 - (knobs.power_balance_maintenance * 12)); // Fewer conflicts with better balance
  
  // Update crisis response
  legislatureGameState.crisisResponse.crisis_response_time_hours = 
    36 - (knobs.crisis_response_agility * 24); // 12-36 hours
  legislatureGameState.crisisResponse.crisis_legislation_passed = 
    Math.round(8 + (knobs.emergency_legislation_speed * 8));
  legislatureGameState.crisisResponse.national_security_briefings = 
    Math.round(90 + (knobs.national_security_responsiveness * 60));
  legislatureGameState.crisisResponse.disaster_relief_bills = 
    Math.round(6 + (knobs.disaster_response_coordination * 6));
  
  // Update research and analysis
  legislatureGameState.researchAnalysis.policy_analysis_reports_annual = 
    Math.round(1000 + (knobs.policy_research_investment * 400));
  legislatureGameState.researchAnalysis.legislative_impact_assessments = 
    Math.round(350 + (knobs.policy_impact_assessment_rigor * 200));
  legislatureGameState.researchAnalysis.external_expert_consultations = 
    Math.round(2000 + (knobs.external_expertise_utilization * 800));
  legislatureGameState.researchAnalysis.evidence_based_policy_score = 
    0.6 + (knobs.evidence_based_lawmaking * 0.3);
  
  // Update representation and services
  legislatureGameState.representationServices.casework_resolution_rate = 
    0.7 + (knobs.constituent_service_priority * 0.15);
  legislatureGameState.representationServices.constituent_service_cases_annual = 
    Math.round(1000000 + (knobs.constituent_service_priority * 400000));
  legislatureGameState.representationServices.federal_agency_interventions = 
    Math.round(70000 + (knobs.constituent_service_priority * 30000));
  
  // Update international and federal relations
  legislatureGameState.internationalFederalRelations.foreign_policy_hearings = 
    Math.round(100 + (knobs.foreign_policy_input_level * 40));
  legislatureGameState.internationalFederalRelations.trade_agreement_oversight_sessions = 
    Math.round(20 + (knobs.trade_agreement_scrutiny * 15));
  legislatureGameState.internationalFederalRelations.treaty_ratifications_considered = 
    Math.round(6 + (knobs.international_treaty_oversight * 6));
  legislatureGameState.internationalFederalRelations.federal_state_coordination_meetings = 
    Math.round(200 + (knobs.federal_state_coordination * 80));
  
  legislatureGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyLegislatureKnobsToGameState();

// ===== LEGISLATURE API ENDPOINTS =====

// Get congressional composition status
router.get('/composition', (req, res) => {
  res.json({
    congressional_composition: legislatureGameState.congressionalComposition,
    cooperation_priorities: {
      bipartisan_cooperation_emphasis: legislatureKnobs.bipartisan_cooperation_emphasis,
      polarization_management: legislatureKnobs.political_polarization_management,
      compromise_facilitation: legislatureKnobs.compromise_facilitation_priority,
      coalition_building: legislatureKnobs.coalition_building_emphasis
    },
    political_dynamics: {
      polarization_index: legislatureGameState.congressionalComposition.political_polarization_index,
      cooperation_level: legislatureGameState.congressionalComposition.bipartisan_cooperation_level,
      committee_effectiveness: legislatureGameState.congressionalComposition.committee_effectiveness,
      leadership_approval: legislatureGameState.congressionalComposition.leadership_approval_rating
    }
  });
});

// Get legislative process status
router.get('/process', (req, res) => {
  res.json({
    legislative_process: legislatureGameState.legislativeProcess,
    efficiency_priorities: {
      legislative_efficiency_priority: legislatureKnobs.legislative_efficiency_priority,
      bill_processing_optimization: legislatureKnobs.bill_processing_speed_optimization,
      committee_productivity_focus: legislatureKnobs.committee_productivity_focus,
      procedural_streamlining: legislatureKnobs.procedural_streamlining
    },
    productivity_metrics: {
      bills_introduced: legislatureGameState.legislativeProcess.bills_introduced_annually,
      bills_enacted: legislatureGameState.legislativeProcess.bills_enacted_into_law,
      success_rate: legislatureGameState.legislativeProcess.legislative_success_rate,
      processing_time: legislatureGameState.legislativeProcess.average_bill_processing_time
    }
  });
});

// Get committee system status
router.get('/committees', (req, res) => {
  res.json({
    committee_system: legislatureGameState.committeeSystem,
    committee_priorities: {
      committee_system_strengthening: legislatureKnobs.committee_system_strengthening,
      committee_specialization_depth: legislatureKnobs.committee_specialization_depth,
      committee_staff_investment: legislatureKnobs.committee_staff_investment,
      expert_testimony_utilization: legislatureKnobs.expert_testimony_utilization
    },
    committee_performance: {
      total_committees: legislatureGameState.committeeSystem.house_committees + legislatureGameState.committeeSystem.senate_committees,
      hearings_annual: legislatureGameState.committeeSystem.committee_hearings_annual,
      witness_testimonies: legislatureGameState.committeeSystem.witness_testimonies_annual,
      reports_published: legislatureGameState.committeeSystem.committee_reports_published
    }
  });
});

// Get oversight activities status
router.get('/oversight', (req, res) => {
  res.json({
    oversight_activities: legislatureGameState.oversightActivities,
    oversight_priorities: {
      oversight_intensity: legislatureKnobs.oversight_intensity,
      investigative_capacity_investment: legislatureKnobs.investigative_capacity_investment,
      accountability_mechanism_strength: legislatureKnobs.accountability_mechanism_strength,
      transparency_enforcement: legislatureKnobs.government_transparency_enforcement
    },
    oversight_effectiveness: {
      oversight_hearings: legislatureGameState.oversightActivities.oversight_hearings_annual,
      investigative_reports: legislatureGameState.oversightActivities.investigative_reports_published,
      subpoenas_issued: legislatureGameState.oversightActivities.subpoenas_issued,
      whistleblower_complaints: legislatureGameState.oversightActivities.whistleblower_complaints_processed
    }
  });
});

// Get public engagement status
router.get('/public-engagement', (req, res) => {
  res.json({
    public_engagement: legislatureGameState.publicEngagement,
    engagement_priorities: {
      public_engagement_investment: legislatureKnobs.public_engagement_investment,
      transparency_commitment: legislatureKnobs.transparency_commitment,
      citizen_participation_facilitation: legislatureKnobs.citizen_participation_facilitation,
      communication_clarity: legislatureKnobs.legislative_communication_clarity
    },
    engagement_metrics: {
      public_hearings: legislatureGameState.publicEngagement.public_hearings_annual,
      town_halls: legislatureGameState.publicEngagement.town_halls_conducted,
      public_satisfaction: legislatureGameState.publicEngagement.public_satisfaction_with_congress,
      social_media_engagement: legislatureGameState.publicEngagement.social_media_engagement_rate
    }
  });
});

// Get legislative innovation status
router.get('/innovation', (req, res) => {
  res.json({
    legislative_innovation: legislatureGameState.legislativeInnovation,
    innovation_priorities: {
      innovation_adoption: legislatureKnobs.legislative_innovation_adoption,
      technology_integration_pace: legislatureKnobs.technology_integration_pace,
      digital_democracy_initiatives: legislatureKnobs.digital_democracy_initiatives,
      data_driven_policymaking: legislatureKnobs.data_driven_policymaking
    },
    innovation_metrics: {
      digital_voting_systems: legislatureGameState.legislativeInnovation.digital_voting_systems,
      ai_analysis_tools: legislatureGameState.legislativeInnovation.ai_assisted_bill_analysis_tools,
      online_platforms: legislatureGameState.legislativeInnovation.online_public_comment_platforms,
      digital_accessibility: legislatureGameState.legislativeInnovation.digital_archive_accessibility
    }
  });
});

// Get ethics and accountability status
router.get('/ethics', (req, res) => {
  res.json({
    ethics_accountability: legislatureGameState.ethicsAccountability,
    ethics_priorities: {
      ethics_enforcement_strictness: legislatureKnobs.ethics_enforcement_strictness,
      conflict_management: legislatureKnobs.conflict_of_interest_management,
      transparency_commitment: legislatureKnobs.transparency_commitment,
      institutional_reform_willingness: legislatureKnobs.institutional_reform_willingness
    },
    ethics_metrics: {
      ethics_violations_investigated: legislatureGameState.ethicsAccountability.ethics_violations_investigated,
      financial_disclosure_compliance: legislatureGameState.ethicsAccountability.financial_disclosure_compliance_rate,
      transparency_score: legislatureGameState.ethicsAccountability.transparency_score,
      disciplinary_actions: legislatureGameState.ethicsAccountability.disciplinary_actions_taken
    }
  });
});

// Get inter-branch relations status
router.get('/inter-branch-relations', (req, res) => {
  res.json({
    inter_branch_relations: legislatureGameState.interBranchRelations,
    inter_branch_priorities: {
      executive_cooperation: legislatureKnobs.executive_branch_cooperation,
      judicial_deference: legislatureKnobs.judicial_deference_level,
      constitutional_adherence: legislatureKnobs.constitutional_adherence_strictness,
      power_balance_maintenance: legislatureKnobs.power_balance_maintenance
    },
    relations_metrics: {
      executive_meetings: legislatureGameState.interBranchRelations.executive_meetings_annual,
      constitutional_challenges: legislatureGameState.interBranchRelations.constitutional_challenges_filed,
      veto_override_attempts: legislatureGameState.interBranchRelations.veto_overrides_attempted,
      separation_conflicts: legislatureGameState.interBranchRelations.separation_of_powers_conflicts
    }
  });
});

// Get crisis response status
router.get('/crisis-response', (req, res) => {
  res.json({
    crisis_response: legislatureGameState.crisisResponse,
    crisis_priorities: {
      crisis_response_agility: legislatureKnobs.crisis_response_agility,
      emergency_legislation_speed: legislatureKnobs.emergency_legislation_speed,
      national_security_responsiveness: legislatureKnobs.national_security_responsiveness,
      disaster_response_coordination: legislatureKnobs.disaster_response_coordination
    },
    crisis_capabilities: {
      emergency_sessions: legislatureGameState.crisisResponse.emergency_sessions_called,
      crisis_legislation: legislatureGameState.crisisResponse.crisis_legislation_passed,
      response_time_hours: legislatureGameState.crisisResponse.crisis_response_time_hours,
      security_briefings: legislatureGameState.crisisResponse.national_security_briefings
    }
  });
});

// Simulate legislative scenario
router.post('/simulate-legislative-scenario', (req, res) => {
  const { scenario_type, bill_complexity = 0.5, political_sensitivity = 0.6, urgency_level = 0.5 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = legislatureKnobs;
  const composition = legislatureGameState.congressionalComposition;
  const process = legislatureGameState.legislativeProcess;
  
  // Simulate legislative response
  const legislative_factors = {
    bipartisan_cooperation: knobs.bipartisan_cooperation_emphasis * 0.25,
    legislative_efficiency: knobs.legislative_efficiency_priority * 0.2,
    committee_effectiveness: composition.committee_effectiveness * 0.15,
    crisis_response_capability: knobs.crisis_response_agility * 0.15,
    public_engagement: knobs.public_engagement_investment * 0.1,
    constitutional_adherence: knobs.constitutional_adherence_strictness * 0.1,
    institutional_stability: (1 - composition.political_polarization_index) * 0.05
  };
  
  const legislative_capability = Object.values(legislative_factors).reduce((sum, factor) => sum + factor, 0);
  const passage_probability = Math.min(0.95, legislative_capability - (bill_complexity * 0.2) - (political_sensitivity * 0.15) + (urgency_level * 0.1));
  const estimated_timeline_days = Math.round(365 - (knobs.legislative_efficiency_priority * 180) + (bill_complexity * 180)); // 185-545 days
  
  res.json({
    scenario_analysis: {
      scenario_type,
      bill_complexity,
      political_sensitivity,
      urgency_level,
      estimated_cost: Math.round(bill_complexity * political_sensitivity * 10000000000) // Up to $10B
    },
    legislative_response: {
      legislative_factors,
      overall_legislative_capability: legislative_capability,
      passage_probability,
      estimated_timeline_days
    },
    legislative_approach: {
      cooperation_strategy: knobs.bipartisan_cooperation_emphasis > 0.7 ? 'bipartisan_focused' : knobs.bipartisan_cooperation_emphasis < 0.3 ? 'partisan_approach' : 'mixed_strategy',
      process_efficiency: knobs.legislative_efficiency_priority > 0.7 ? 'streamlined_process' : 'standard_process',
      oversight_emphasis: knobs.oversight_intensity > 0.7 ? 'intensive_oversight' : 'standard_oversight',
      public_engagement: knobs.public_engagement_investment > 0.6 ? 'high_public_involvement' : 'limited_public_input'
    },
    expected_outcomes: {
      legislative_success_likelihood: passage_probability * 0.9,
      public_support_potential: knobs.public_engagement_investment * 0.8,
      institutional_impact: legislative_capability * 0.85,
      long_term_governance_effect: (legislative_capability + knobs.constitutional_adherence_strictness) / 2
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
createEnhancedKnobEndpoints(router, 'legislature', legislatureKnobSystem, applyLegislatureKnobsToGameState);

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateLegislatureStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Legislature data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    legislature_influence: {
      legislative_effectiveness: legislatureGameState.legislativeProcess.legislative_success_rate * 50, // normalized
      oversight_strength: legislatureGameState.oversightActivities.oversight_hearings_annual / 1000, // normalized
      public_representation_quality: legislatureGameState.publicEngagement.public_satisfaction_with_congress,
      institutional_stability: 1 - legislatureGameState.congressionalComposition.political_polarization_index // inverted
    },
    integration_points: {
      executive_cooperation_level: legislatureKnobs.executive_branch_cooperation,
      judicial_deference_coordination: legislatureKnobs.judicial_deference_level,
      treasury_budget_coordination: legislatureKnobs.oversight_intensity,
      defense_oversight_coordination: legislatureKnobs.national_security_responsiveness
    },
    system_health: {
      overall_effectiveness: (
        (legislatureGameState.legislativeProcess.legislative_success_rate * 50) +
        legislatureGameState.publicEngagement.public_satisfaction_with_congress +
        (1 - legislatureGameState.congressionalComposition.political_polarization_index)
      ) / 3,
      knobs_applied: { ...legislatureKnobs }
    }
  });
});

module.exports = router;
