/**
 * Science Department API - Research coordination, scientific policy, and innovation management
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const scienceKnobsData = {
  // Research Funding & Investment
  research_funding_priority: 0.8,                 // AI can control R&D funding priority (0.0-1.0)
  federal_research_investment: 0.75,              // AI can control federal R&D investment (0.0-1.0)
  basic_research_emphasis: 0.7,                   // AI can control basic vs applied research (0.0-1.0)
  applied_research_priority: 0.65,                // AI can control applied research focus (0.0-1.0)
  research_portfolio_diversification: 0.7,        // AI can control research portfolio diversity (0.0-1.0)
  
  // Emerging Technologies & Innovation
  emerging_technology_investment: 0.7,            // AI can control emerging tech investment (0.0-1.0)
  disruptive_technology_support: 0.65,            // AI can control disruptive tech support (0.0-1.0)
  artificial_intelligence_research: 0.8,          // AI can control AI research priority (0.0-1.0)
  quantum_computing_investment: 0.75,             // AI can control quantum computing focus (0.0-1.0)
  biotechnology_research_priority: 0.7,           // AI can control biotech research (0.0-1.0)
  
  // Technology Transfer & Commercialization
  technology_transfer_emphasis: 0.65,             // AI can control tech transfer focus (0.0-1.0)
  commercialization_support: 0.6,                 // AI can control commercialization programs (0.0-1.0)
  industry_research_partnerships: 0.7,            // AI can control industry partnerships (0.0-1.0)
  startup_research_collaboration: 0.65,           // AI can control startup collaboration (0.0-1.0)
  intellectual_property_strategy: 0.7,            // AI can control IP strategy (0.0-1.0)
  
  // Research Infrastructure & Facilities
  research_infrastructure_modernization: 0.65,    // AI can control infrastructure modernization (0.0-1.0)
  national_laboratory_investment: 0.75,           // AI can control national lab funding (0.0-1.0)
  research_facility_expansion: 0.6,               // AI can control facility expansion (0.0-1.0)
  supercomputing_infrastructure: 0.8,             // AI can control supercomputing investment (0.0-1.0)
  scientific_instrumentation: 0.7,                // AI can control scientific instruments (0.0-1.0)
  
  // STEM Education & Workforce
  stem_education_priority: 0.7,                   // AI can control STEM education focus (0.0-1.0)
  research_workforce_development: 0.68,           // AI can control research workforce (0.0-1.0)
  graduate_student_support: 0.65,                 // AI can control graduate student funding (0.0-1.0)
  postdoc_researcher_support: 0.6,                // AI can control postdoc support (0.0-1.0)
  diversity_in_science_priority: 0.7,             // AI can control diversity programs (0.0-1.0)
  
  // International Collaboration & Competition
  international_collaboration_openness: 0.75,     // AI can control international collaboration (0.0-1.0)
  global_research_partnerships: 0.7,              // AI can control global partnerships (0.0-1.0)
  scientific_diplomacy_emphasis: 0.65,            // AI can control scientific diplomacy (0.0-1.0)
  research_security_balance: 0.6,                 // AI can control research security vs openness (0.0-1.0)
  international_talent_attraction: 0.7,           // AI can control international talent (0.0-1.0)
  
  // Interdisciplinary & Convergent Research
  interdisciplinary_research_support: 0.72,       // AI can control interdisciplinary research (0.0-1.0)
  convergent_research_programs: 0.68,             // AI can control convergent research (0.0-1.0)
  cross_sector_collaboration: 0.65,               // AI can control cross-sector collaboration (0.0-1.0)
  systems_science_approach: 0.6,                  // AI can control systems science (0.0-1.0)
  transdisciplinary_initiatives: 0.62,            // AI can control transdisciplinary work (0.0-1.0)
  
  // Open Science & Data Sharing
  open_science_commitment: 0.68,                  // AI can control open science initiatives (0.0-1.0)
  data_sharing_requirements: 0.65,                // AI can control data sharing policies (0.0-1.0)
  open_access_publishing: 0.7,                    // AI can control open access requirements (0.0-1.0)
  research_reproducibility_standards: 0.75,       // AI can control reproducibility standards (0.0-1.0)
  scientific_transparency: 0.72,                  // AI can control scientific transparency (0.0-1.0)
  
  // Science Policy & Evidence-Based Decision Making
  science_policy_integration: 0.72,               // AI can control science-policy integration (0.0-1.0)
  evidence_based_policymaking: 0.7,               // AI can control evidence-based policy (0.0-1.0)
  scientific_advisory_capacity: 0.68,             // AI can control scientific advisory roles (0.0-1.0)
  policy_relevant_research: 0.65,                 // AI can control policy-relevant research (0.0-1.0)
  regulatory_science_support: 0.6,                // AI can control regulatory science (0.0-1.0)
  
  // Public Engagement & Science Communication
  public_science_engagement: 0.62,                // AI can control public engagement (0.0-1.0)
  science_communication_investment: 0.58,         // AI can control science communication (0.0-1.0)
  citizen_science_programs: 0.55,                 // AI can control citizen science (0.0-1.0)
  science_museum_support: 0.5,                    // AI can control science museum funding (0.0-1.0)
  public_understanding_of_science: 0.6,           // AI can control public understanding (0.0-1.0)
  
  // Research Ethics & Integrity
  research_ethics_standards: 0.92,                // AI can control research ethics standards (0.0-1.0)
  research_integrity_enforcement: 0.88,           // AI can control integrity enforcement (0.0-1.0)
  responsible_innovation_practices: 0.8,          // AI can control responsible innovation (0.0-1.0)
  dual_use_research_oversight: 0.85,              // AI can control dual-use research oversight (0.0-1.0)
  research_misconduct_prevention: 0.9,            // AI can control misconduct prevention (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const scienceKnobSystem = new EnhancedKnobSystem(scienceKnobsData);

// Backward compatibility - expose knobs directly
const scienceKnobs = scienceKnobSystem.knobs;

// Science Department Game State
const scienceGameState = {
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
    research_infrastructure_age_average: 15, // years
    facility_utilization_rate: 0.78,
    infrastructure_modernization_backlog: 45000000000 // $45B
  },
  
  // Research Workforce
  researchWorkforce: {
    total_researchers: 1400000,
    phd_scientists_engineers: 850000,
    postdoctoral_researchers: 65000,
    graduate_students_research: 420000,
    research_technicians: 280000,
    international_researchers: 180000,
    women_in_research_percentage: 0.38,
    underrepresented_minorities_percentage: 0.22
  },
  
  // Research Output & Innovation
  researchOutput: {
    scientific_publications_annual: 425000,
    patents_filed_annual: 285000,
    citations_per_paper_average: 12.5,
    h_index_national_average: 45,
    technology_transfer_agreements: 8500,
    startup_companies_from_research: 1200,
    research_commercialization_rate: 0.08,
    innovation_index_global_rank: 3
  },
  
  // Emerging Technologies
  emergingTechnologies: {
    ai_research_projects: 2800,
    quantum_computing_investments: 15000000000, // $15B
    biotechnology_research_funding: 45000000000, // $45B
    nanotechnology_programs: 1500,
    clean_energy_research_investment: 25000000000, // $25B
    space_technology_development: 18000000000, // $18B
    advanced_materials_research: 8000000000, // $8B
    robotics_automation_research: 12000000000 // $12B
  },
  
  // International Collaboration
  internationalCollaboration: {
    international_research_agreements: 450,
    foreign_researcher_exchanges: 25000,
    joint_research_projects: 1800,
    international_facility_partnerships: 85,
    global_research_funding_share: 0.28,
    scientific_diplomacy_initiatives: 120,
    international_student_researchers: 95000,
    cross_border_research_collaborations: 3200
  },
  
  // Technology Transfer & Commercialization
  technologyTransfer: {
    tech_transfer_offices: 280,
    invention_disclosures_annual: 18000,
    patent_applications_filed: 12000,
    licensing_agreements_signed: 4500,
    startup_companies_launched: 850,
    industry_sponsored_research: 85000000000, // $85B
    research_commercialization_revenue: 8500000000, // $8.5B
    public_private_partnerships: 1200
  },
  
  // STEM Education & Training
  stemEducation: {
    stem_graduates_annual: 485000,
    phd_degrees_awarded: 55000,
    postdoc_positions_funded: 42000,
    research_training_programs: 850,
    stem_teacher_training_programs: 450,
    undergraduate_research_participants: 180000,
    diversity_fellowship_programs: 120,
    international_exchange_programs: 85
  },
  
  // Open Science & Data
  openScience: {
    open_access_publications_percentage: 0.45,
    data_repositories_maintained: 1200,
    research_data_shared_percentage: 0.38,
    reproducible_research_studies_percentage: 0.52,
    preprint_submissions_annual: 125000,
    open_source_software_projects: 8500,
    citizen_science_projects: 450,
    public_research_databases: 280
  },
  
  // Research Ethics & Integrity
  researchEthics: {
    institutional_review_boards: 3500,
    research_integrity_cases_investigated: 450,
    ethics_training_completion_rate: 0.92,
    responsible_conduct_training_programs: 1200,
    research_misconduct_findings: 85,
    dual_use_research_reviews: 180,
    ethics_compliance_audits: 850,
    integrity_education_programs: 650
  },
  
  // Science Policy & Advisory
  sciencePolicy: {
    science_advisory_committees: 180,
    policy_relevant_research_projects: 2400,
    evidence_based_policy_initiatives: 320,
    regulatory_science_studies: 450,
    congressional_science_briefings: 180,
    federal_science_coordination_meetings: 120,
    interagency_research_programs: 85,
    science_policy_fellowships: 250
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateScienceStructuredOutputs() {
  const funding = scienceGameState.researchFunding;
  const infrastructure = scienceGameState.scientificInfrastructure;
  const workforce = scienceGameState.researchWorkforce;
  const output = scienceGameState.researchOutput;
  const emerging = scienceGameState.emergingTechnologies;
  const international = scienceGameState.internationalCollaboration;
  const transfer = scienceGameState.technologyTransfer;
  const education = scienceGameState.stemEducation;
  const openScience = scienceGameState.openScience;
  const ethics = scienceGameState.researchEthics;
  const policy = scienceGameState.sciencePolicy;
  
  return {
    research_funding_status: {
      funding_portfolio: {
        total_rd_spending: funding.total_rd_spending,
        federal_rd_budget: funding.federal_rd_budget,
        private_rd_investment: funding.private_rd_investment,
        rd_spending_gdp_percentage: funding.rd_spending_gdp_percentage
      },
      funding_allocation: {
        basic_research_funding: funding.basic_research_funding,
        applied_research_funding: funding.applied_research_funding,
        development_funding: funding.development_funding,
        international_collaboration_funding: funding.international_collaboration_funding
      },
      funding_priorities: {
        research_funding_priority: scienceKnobs.research_funding_priority,
        federal_research_investment: scienceKnobs.federal_research_investment,
        basic_research_emphasis: scienceKnobs.basic_research_emphasis,
        applied_research_priority: scienceKnobs.applied_research_priority
      }
    },
    
    scientific_infrastructure_status: {
      infrastructure_capacity: {
        national_laboratories: infrastructure.national_laboratories,
        research_universities: infrastructure.research_universities,
        major_research_facilities: infrastructure.major_research_facilities,
        supercomputing_centers: infrastructure.supercomputing_centers
      },
      infrastructure_condition: {
        scientific_instruments_value: infrastructure.scientific_instruments_value,
        average_facility_age: infrastructure.research_infrastructure_age_average,
        utilization_rate: infrastructure.facility_utilization_rate,
        modernization_backlog: infrastructure.infrastructure_modernization_backlog
      },
      infrastructure_priorities: {
        infrastructure_modernization: scienceKnobs.research_infrastructure_modernization,
        national_laboratory_investment: scienceKnobs.national_laboratory_investment,
        facility_expansion: scienceKnobs.research_facility_expansion,
        supercomputing_infrastructure: scienceKnobs.supercomputing_infrastructure
      }
    },
    
    research_workforce_status: {
      workforce_composition: {
        total_researchers: workforce.total_researchers,
        phd_scientists_engineers: workforce.phd_scientists_engineers,
        postdoctoral_researchers: workforce.postdoctoral_researchers,
        graduate_students_research: workforce.graduate_students_research
      },
      workforce_diversity: {
        international_researchers: workforce.international_researchers,
        women_in_research_percentage: workforce.women_in_research_percentage,
        underrepresented_minorities_percentage: workforce.underrepresented_minorities_percentage,
        research_technicians: workforce.research_technicians
      },
      workforce_priorities: {
        workforce_development: scienceKnobs.research_workforce_development,
        graduate_student_support: scienceKnobs.graduate_student_support,
        postdoc_support: scienceKnobs.postdoc_researcher_support,
        diversity_priority: scienceKnobs.diversity_in_science_priority
      }
    },
    
    research_output_status: {
      scientific_productivity: {
        publications_annual: output.scientific_publications_annual,
        patents_filed_annual: output.patents_filed_annual,
        citations_per_paper: output.citations_per_paper_average,
        h_index_national: output.h_index_national_average
      },
      innovation_metrics: {
        tech_transfer_agreements: output.technology_transfer_agreements,
        startup_companies: output.startup_companies_from_research,
        commercialization_rate: output.research_commercialization_rate,
        innovation_global_rank: output.innovation_index_global_rank
      },
      output_priorities: {
        research_portfolio_diversification: scienceKnobs.research_portfolio_diversification,
        technology_transfer_emphasis: scienceKnobs.technology_transfer_emphasis,
        commercialization_support: scienceKnobs.commercialization_support,
        industry_partnerships: scienceKnobs.industry_research_partnerships
      }
    },
    
    emerging_technologies_status: {
      technology_investments: {
        ai_research_projects: emerging.ai_research_projects,
        quantum_computing_investments: emerging.quantum_computing_investments,
        biotechnology_research_funding: emerging.biotechnology_research_funding,
        clean_energy_research_investment: emerging.clean_energy_research_investment
      },
      advanced_research_areas: {
        nanotechnology_programs: emerging.nanotechnology_programs,
        space_technology_development: emerging.space_technology_development,
        advanced_materials_research: emerging.advanced_materials_research,
        robotics_automation_research: emerging.robotics_automation_research
      },
      emerging_tech_priorities: {
        emerging_technology_investment: scienceKnobs.emerging_technology_investment,
        disruptive_technology_support: scienceKnobs.disruptive_technology_support,
        ai_research_priority: scienceKnobs.artificial_intelligence_research,
        quantum_computing_investment: scienceKnobs.quantum_computing_investment
      }
    },
    
    international_collaboration_status: {
      collaboration_metrics: {
        international_agreements: international.international_research_agreements,
        foreign_researcher_exchanges: international.foreign_researcher_exchanges,
        joint_research_projects: international.joint_research_projects,
        facility_partnerships: international.international_facility_partnerships
      },
      global_engagement: {
        global_funding_share: international.global_research_funding_share,
        scientific_diplomacy_initiatives: international.scientific_diplomacy_initiatives,
        international_students: international.international_student_researchers,
        cross_border_collaborations: international.cross_border_research_collaborations
      },
      collaboration_priorities: {
        international_collaboration_openness: scienceKnobs.international_collaboration_openness,
        global_research_partnerships: scienceKnobs.global_research_partnerships,
        scientific_diplomacy: scienceKnobs.scientific_diplomacy_emphasis,
        international_talent_attraction: scienceKnobs.international_talent_attraction
      }
    },
    
    technology_transfer_status: {
      transfer_infrastructure: {
        tech_transfer_offices: transfer.tech_transfer_offices,
        invention_disclosures: transfer.invention_disclosures_annual,
        patent_applications: transfer.patent_applications_filed,
        licensing_agreements: transfer.licensing_agreements_signed
      },
      commercialization_outcomes: {
        startup_companies_launched: transfer.startup_companies_launched,
        industry_sponsored_research: transfer.industry_sponsored_research,
        commercialization_revenue: transfer.research_commercialization_revenue,
        public_private_partnerships: transfer.public_private_partnerships
      },
      transfer_priorities: {
        technology_transfer_emphasis: scienceKnobs.technology_transfer_emphasis,
        commercialization_support: scienceKnobs.commercialization_support,
        industry_partnerships: scienceKnobs.industry_research_partnerships,
        ip_strategy: scienceKnobs.intellectual_property_strategy
      }
    },
    
    stem_education_status: {
      education_output: {
        stem_graduates_annual: education.stem_graduates_annual,
        phd_degrees_awarded: education.phd_degrees_awarded,
        postdoc_positions_funded: education.postdoc_positions_funded,
        undergraduate_research_participants: education.undergraduate_research_participants
      },
      training_programs: {
        research_training_programs: education.research_training_programs,
        stem_teacher_training: education.stem_teacher_training_programs,
        diversity_fellowships: education.diversity_fellowship_programs,
        international_exchanges: education.international_exchange_programs
      },
      education_priorities: {
        stem_education_priority: scienceKnobs.stem_education_priority,
        workforce_development: scienceKnobs.research_workforce_development,
        diversity_priority: scienceKnobs.diversity_in_science_priority,
        graduate_support: scienceKnobs.graduate_student_support
      }
    },
    
    open_science_status: {
      openness_metrics: {
        open_access_percentage: openScience.open_access_publications_percentage,
        data_repositories: openScience.data_repositories_maintained,
        data_shared_percentage: openScience.research_data_shared_percentage,
        reproducible_studies_percentage: openScience.reproducible_research_studies_percentage
      },
      open_science_infrastructure: {
        preprint_submissions: openScience.preprint_submissions_annual,
        open_source_projects: openScience.open_source_software_projects,
        citizen_science_projects: openScience.citizen_science_projects,
        public_databases: openScience.public_research_databases
      },
      openness_priorities: {
        open_science_commitment: scienceKnobs.open_science_commitment,
        data_sharing_requirements: scienceKnobs.data_sharing_requirements,
        open_access_publishing: scienceKnobs.open_access_publishing,
        scientific_transparency: scienceKnobs.scientific_transparency
      }
    }
  };
}

// Apply knobs to game state
function applyScienceKnobsToGameState() {
  const knobs = scienceKnobs;
  
  // Update research funding based on knobs
  scienceGameState.researchFunding.federal_rd_budget = 
    Math.round(150000000000 + (knobs.federal_research_investment * 100000000000)); // $150-250B
  scienceGameState.researchFunding.rd_spending_gdp_percentage = 
    0.025 + (knobs.research_funding_priority * 0.015); // 2.5% to 4.0%
  scienceGameState.researchFunding.basic_research_funding = 
    Math.round(70000000000 + (knobs.basic_research_emphasis * 60000000000)); // $70-130B
  scienceGameState.researchFunding.applied_research_funding = 
    Math.round(120000000000 + (knobs.applied_research_priority * 80000000000)); // $120-200B
  
  // Update scientific infrastructure
  scienceGameState.scientificInfrastructure.facility_utilization_rate = 
    0.65 + (knobs.research_infrastructure_modernization * 0.25);
  scienceGameState.scientificInfrastructure.research_infrastructure_age_average = 
    20 - (knobs.research_infrastructure_modernization * 8); // 12-20 years
  scienceGameState.scientificInfrastructure.supercomputing_centers = 
    Math.round(35 + (knobs.supercomputing_infrastructure * 20));
  scienceGameState.scientificInfrastructure.scientific_instruments_value = 
    Math.round(140000000000 + (knobs.scientific_instrumentation * 80000000000)); // $140-220B
  
  // Update research workforce
  scienceGameState.researchWorkforce.total_researchers = 
    Math.round(1200000 + (knobs.research_workforce_development * 400000));
  scienceGameState.researchWorkforce.postdoctoral_researchers = 
    Math.round(50000 + (knobs.postdoc_researcher_support * 30000));
  scienceGameState.researchWorkforce.women_in_research_percentage = 
    0.3 + (knobs.diversity_in_science_priority * 0.2);
  scienceGameState.researchWorkforce.underrepresented_minorities_percentage = 
    0.15 + (knobs.diversity_in_science_priority * 0.15);
  
  // Update research output
  scienceGameState.researchOutput.scientific_publications_annual = 
    Math.round(350000 + (knobs.research_funding_priority * 150000));
  scienceGameState.researchOutput.patents_filed_annual = 
    Math.round(220000 + (knobs.technology_transfer_emphasis * 130000));
  scienceGameState.researchOutput.research_commercialization_rate = 
    0.05 + (knobs.commercialization_support * 0.06);
  scienceGameState.researchOutput.startup_companies_from_research = 
    Math.round(800 + (knobs.startup_research_collaboration * 800));
  
  // Update emerging technologies
  scienceGameState.emergingTechnologies.ai_research_projects = 
    Math.round(2000 + (knobs.artificial_intelligence_research * 1600));
  scienceGameState.emergingTechnologies.quantum_computing_investments = 
    Math.round(10000000000 + (knobs.quantum_computing_investment * 15000000000)); // $10-25B
  scienceGameState.emergingTechnologies.biotechnology_research_funding = 
    Math.round(35000000000 + (knobs.biotechnology_research_priority * 25000000000)); // $35-60B
  scienceGameState.emergingTechnologies.clean_energy_research_investment = 
    Math.round(18000000000 + (knobs.emerging_technology_investment * 20000000000)); // $18-38B
  
  // Update international collaboration
  scienceGameState.internationalCollaboration.international_research_agreements = 
    Math.round(350 + (knobs.international_collaboration_openness * 200));
  scienceGameState.internationalCollaboration.foreign_researcher_exchanges = 
    Math.round(18000 + (knobs.international_talent_attraction * 14000));
  scienceGameState.internationalCollaboration.joint_research_projects = 
    Math.round(1400 + (knobs.global_research_partnerships * 800));
  scienceGameState.internationalCollaboration.scientific_diplomacy_initiatives = 
    Math.round(80 + (knobs.scientific_diplomacy_emphasis * 80));
  
  // Update technology transfer
  scienceGameState.technologyTransfer.invention_disclosures_annual = 
    Math.round(14000 + (knobs.technology_transfer_emphasis * 8000));
  scienceGameState.technologyTransfer.licensing_agreements_signed = 
    Math.round(3500 + (knobs.commercialization_support * 2000));
  scienceGameState.technologyTransfer.industry_sponsored_research = 
    Math.round(65000000000 + (knobs.industry_research_partnerships * 40000000000)); // $65-105B
  scienceGameState.technologyTransfer.public_private_partnerships = 
    Math.round(900 + (knobs.cross_sector_collaboration * 600));
  
  // Update STEM education
  scienceGameState.stemEducation.stem_graduates_annual = 
    Math.round(400000 + (knobs.stem_education_priority * 170000));
  scienceGameState.stemEducation.phd_degrees_awarded = 
    Math.round(45000 + (knobs.graduate_student_support * 20000));
  scienceGameState.stemEducation.undergraduate_research_participants = 
    Math.round(140000 + (knobs.stem_education_priority * 80000));
  scienceGameState.stemEducation.diversity_fellowship_programs = 
    Math.round(80 + (knobs.diversity_in_science_priority * 80));
  
  // Update open science
  scienceGameState.openScience.open_access_publications_percentage = 
    0.3 + (knobs.open_access_publishing * 0.4);
  scienceGameState.openScience.research_data_shared_percentage = 
    0.25 + (knobs.data_sharing_requirements * 0.35);
  scienceGameState.openScience.reproducible_research_studies_percentage = 
    0.4 + (knobs.research_reproducibility_standards * 0.3);
  scienceGameState.openScience.citizen_science_projects = 
    Math.round(300 + (knobs.citizen_science_programs * 300));
  
  // Update research ethics
  scienceGameState.researchEthics.ethics_training_completion_rate = 
    0.85 + (knobs.research_ethics_standards * 0.1);
  scienceGameState.researchEthics.research_misconduct_findings = 
    Math.round(120 - (knobs.research_misconduct_prevention * 50)); // 70-120
  scienceGameState.researchEthics.dual_use_research_reviews = 
    Math.round(120 + (knobs.dual_use_research_oversight * 120));
  
  // Update science policy
  scienceGameState.sciencePolicy.policy_relevant_research_projects = 
    Math.round(1800 + (knobs.policy_relevant_research * 1200));
  scienceGameState.sciencePolicy.evidence_based_policy_initiatives = 
    Math.round(240 + (knobs.evidence_based_policymaking * 160));
  scienceGameState.sciencePolicy.science_advisory_committees = 
    Math.round(140 + (knobs.scientific_advisory_capacity * 80));
  
  scienceGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyScienceKnobsToGameState();

// ===== SCIENCE DEPARTMENT API ENDPOINTS =====

// Get research funding status
router.get('/research-funding', (req, res) => {
  res.json({
    research_funding: scienceGameState.researchFunding,
    funding_priorities: {
      research_funding_priority: scienceKnobs.research_funding_priority,
      federal_research_investment: scienceKnobs.federal_research_investment,
      basic_research_emphasis: scienceKnobs.basic_research_emphasis,
      applied_research_priority: scienceKnobs.applied_research_priority
    },
    funding_metrics: {
      total_rd_spending: scienceGameState.researchFunding.total_rd_spending,
      federal_rd_budget: scienceGameState.researchFunding.federal_rd_budget,
      rd_spending_gdp_percentage: scienceGameState.researchFunding.rd_spending_gdp_percentage,
      basic_research_share: scienceGameState.researchFunding.basic_research_funding / scienceGameState.researchFunding.federal_rd_budget
    }
  });
});

// Get scientific infrastructure status
router.get('/infrastructure', (req, res) => {
  res.json({
    scientific_infrastructure: scienceGameState.scientificInfrastructure,
    infrastructure_priorities: {
      infrastructure_modernization: scienceKnobs.research_infrastructure_modernization,
      national_laboratory_investment: scienceKnobs.national_laboratory_investment,
      facility_expansion: scienceKnobs.research_facility_expansion,
      supercomputing_infrastructure: scienceKnobs.supercomputing_infrastructure
    },
    infrastructure_health: {
      facility_utilization_rate: scienceGameState.scientificInfrastructure.facility_utilization_rate,
      average_facility_age: scienceGameState.scientificInfrastructure.research_infrastructure_age_average,
      modernization_backlog: scienceGameState.scientificInfrastructure.infrastructure_modernization_backlog,
      instruments_value: scienceGameState.scientificInfrastructure.scientific_instruments_value
    }
  });
});

// Get research workforce status
router.get('/workforce', (req, res) => {
  res.json({
    research_workforce: scienceGameState.researchWorkforce,
    workforce_priorities: {
      workforce_development: scienceKnobs.research_workforce_development,
      graduate_student_support: scienceKnobs.graduate_student_support,
      postdoc_support: scienceKnobs.postdoc_researcher_support,
      diversity_priority: scienceKnobs.diversity_in_science_priority
    },
    workforce_metrics: {
      total_researchers: scienceGameState.researchWorkforce.total_researchers,
      women_in_research: scienceGameState.researchWorkforce.women_in_research_percentage,
      underrepresented_minorities: scienceGameState.researchWorkforce.underrepresented_minorities_percentage,
      international_researchers: scienceGameState.researchWorkforce.international_researchers
    }
  });
});

// Get research output status
router.get('/research-output', (req, res) => {
  res.json({
    research_output: scienceGameState.researchOutput,
    output_priorities: {
      research_portfolio_diversification: scienceKnobs.research_portfolio_diversification,
      technology_transfer_emphasis: scienceKnobs.technology_transfer_emphasis,
      commercialization_support: scienceKnobs.commercialization_support,
      industry_partnerships: scienceKnobs.industry_research_partnerships
    },
    productivity_metrics: {
      publications_annual: scienceGameState.researchOutput.scientific_publications_annual,
      patents_filed: scienceGameState.researchOutput.patents_filed_annual,
      commercialization_rate: scienceGameState.researchOutput.research_commercialization_rate,
      innovation_global_rank: scienceGameState.researchOutput.innovation_index_global_rank
    }
  });
});

// Get emerging technologies status
router.get('/emerging-technologies', (req, res) => {
  res.json({
    emerging_technologies: scienceGameState.emergingTechnologies,
    emerging_tech_priorities: {
      emerging_technology_investment: scienceKnobs.emerging_technology_investment,
      disruptive_technology_support: scienceKnobs.disruptive_technology_support,
      ai_research_priority: scienceKnobs.artificial_intelligence_research,
      quantum_computing_investment: scienceKnobs.quantum_computing_investment
    },
    technology_investments: {
      ai_research_projects: scienceGameState.emergingTechnologies.ai_research_projects,
      quantum_computing_investments: scienceGameState.emergingTechnologies.quantum_computing_investments,
      biotechnology_funding: scienceGameState.emergingTechnologies.biotechnology_research_funding,
      clean_energy_investment: scienceGameState.emergingTechnologies.clean_energy_research_investment
    }
  });
});

// Get international collaboration status
router.get('/international-collaboration', (req, res) => {
  res.json({
    international_collaboration: scienceGameState.internationalCollaboration,
    collaboration_priorities: {
      international_collaboration_openness: scienceKnobs.international_collaboration_openness,
      global_research_partnerships: scienceKnobs.global_research_partnerships,
      scientific_diplomacy: scienceKnobs.scientific_diplomacy_emphasis,
      international_talent_attraction: scienceKnobs.international_talent_attraction
    },
    collaboration_metrics: {
      international_agreements: scienceGameState.internationalCollaboration.international_research_agreements,
      joint_research_projects: scienceGameState.internationalCollaboration.joint_research_projects,
      foreign_researcher_exchanges: scienceGameState.internationalCollaboration.foreign_researcher_exchanges,
      global_funding_share: scienceGameState.internationalCollaboration.global_research_funding_share
    }
  });
});

// Get technology transfer status
router.get('/technology-transfer', (req, res) => {
  res.json({
    technology_transfer: scienceGameState.technologyTransfer,
    transfer_priorities: {
      technology_transfer_emphasis: scienceKnobs.technology_transfer_emphasis,
      commercialization_support: scienceKnobs.commercialization_support,
      industry_partnerships: scienceKnobs.industry_research_partnerships,
      ip_strategy: scienceKnobs.intellectual_property_strategy
    },
    transfer_metrics: {
      invention_disclosures: scienceGameState.technologyTransfer.invention_disclosures_annual,
      licensing_agreements: scienceGameState.technologyTransfer.licensing_agreements_signed,
      startup_companies: scienceGameState.technologyTransfer.startup_companies_launched,
      commercialization_revenue: scienceGameState.technologyTransfer.research_commercialization_revenue
    }
  });
});

// Get STEM education status
router.get('/stem-education', (req, res) => {
  res.json({
    stem_education: scienceGameState.stemEducation,
    education_priorities: {
      stem_education_priority: scienceKnobs.stem_education_priority,
      workforce_development: scienceKnobs.research_workforce_development,
      diversity_priority: scienceKnobs.diversity_in_science_priority,
      graduate_support: scienceKnobs.graduate_student_support
    },
    education_metrics: {
      stem_graduates_annual: scienceGameState.stemEducation.stem_graduates_annual,
      phd_degrees_awarded: scienceGameState.stemEducation.phd_degrees_awarded,
      undergraduate_research_participants: scienceGameState.stemEducation.undergraduate_research_participants,
      diversity_fellowships: scienceGameState.stemEducation.diversity_fellowship_programs
    }
  });
});

// Get open science status
router.get('/open-science', (req, res) => {
  res.json({
    open_science: scienceGameState.openScience,
    openness_priorities: {
      open_science_commitment: scienceKnobs.open_science_commitment,
      data_sharing_requirements: scienceKnobs.data_sharing_requirements,
      open_access_publishing: scienceKnobs.open_access_publishing,
      scientific_transparency: scienceKnobs.scientific_transparency
    },
    openness_metrics: {
      open_access_percentage: scienceGameState.openScience.open_access_publications_percentage,
      data_shared_percentage: scienceGameState.openScience.research_data_shared_percentage,
      reproducible_studies_percentage: scienceGameState.openScience.reproducible_research_studies_percentage,
      citizen_science_projects: scienceGameState.openScience.citizen_science_projects
    }
  });
});

// Simulate science policy scenario
router.post('/simulate-science-scenario', (req, res) => {
  const { scenario_type, research_complexity = 0.5, innovation_potential = 0.7, timeline_years = 5 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = scienceKnobs;
  const funding = scienceGameState.researchFunding;
  const workforce = scienceGameState.researchWorkforce;
  
  // Simulate science system response
  const research_factors = {
    funding_adequacy: (funding.rd_spending_gdp_percentage / 0.04) * 0.3,
    workforce_capacity: (workforce.total_researchers / 1600000) * 0.25,
    infrastructure_readiness: knobs.research_infrastructure_modernization * 0.2,
    international_collaboration: knobs.international_collaboration_openness * 0.15,
    innovation_support: knobs.emerging_technology_investment * 0.1
  };
  
  const research_capability = Object.values(research_factors).reduce((sum, factor) => sum + factor, 0);
  const success_probability = Math.min(0.95, research_capability + (innovation_potential * 0.2) - (research_complexity * 0.15));
  const estimated_timeline = Math.round(timeline_years * (1 + research_complexity - (research_capability * 0.5)));
  
  res.json({
    scenario_analysis: {
      scenario_type,
      research_complexity,
      innovation_potential,
      timeline_years,
      estimated_cost: Math.round(500000000 + (research_complexity * innovation_potential * 5000000000))
    },
    research_system_response: {
      research_factors,
      overall_research_capability: research_capability,
      success_probability,
      estimated_timeline_years: estimated_timeline
    },
    science_approach: {
      funding_strategy: knobs.research_funding_priority > 0.7 ? 'high_investment' : knobs.research_funding_priority < 0.3 ? 'constrained_funding' : 'balanced_investment',
      research_focus: knobs.basic_research_emphasis > 0.6 ? 'basic_research_focused' : 'applied_research_focused',
      collaboration_stance: knobs.international_collaboration_openness > 0.7 ? 'globally_collaborative' : 'domestically_focused',
      innovation_orientation: knobs.emerging_technology_investment > 0.6 ? 'cutting_edge_focused' : 'traditional_research'
    },
    expected_outcomes: {
      scientific_advancement_potential: success_probability * 0.9,
      technology_transfer_likelihood: knobs.technology_transfer_emphasis * success_probability,
      workforce_development_impact: knobs.stem_education_priority * 0.8,
      international_competitiveness: (research_capability + knobs.international_collaboration_openness) / 2
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
createEnhancedKnobEndpoints(router, 'science', scienceKnobSystem, applyScienceKnobsToGameState);

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateScienceStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Science Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    science_influence: {
      research_innovation_capacity: scienceGameState.researchOutput.innovation_index_global_rank / 10, // normalized
      technology_transfer_strength: scienceGameState.technologyTransfer.research_commercialization_revenue / 10000000000, // normalized to 0-1
      stem_workforce_contribution: scienceGameState.stemEducation.stem_graduates_annual / 600000, // normalized
      international_research_leadership: scienceGameState.internationalCollaboration.global_research_funding_share
    },
    integration_points: {
      defense_research_coordination: scienceKnobs.emerging_technology_investment,
      health_biomedical_coordination: scienceKnobs.biotechnology_research_priority,
      commerce_innovation_coordination: scienceKnobs.technology_transfer_emphasis,
      education_stem_coordination: scienceKnobs.stem_education_priority
    },
    system_health: {
      overall_effectiveness: (
        (scienceGameState.researchFunding.rd_spending_gdp_percentage / 0.04) +
        (scienceGameState.researchOutput.research_commercialization_rate / 0.15) +
        (scienceGameState.researchWorkforce.total_researchers / 1600000)
      ) / 3,
      knobs_applied: { ...scienceKnobs }
    }
  });
});

module.exports = router;
