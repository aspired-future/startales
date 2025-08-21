/**
 * Supreme Court API - Judicial review, constitutional interpretation, and court operations
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const supremeCourtKnobsData = {
  // Constitutional Interpretation
  constitutional_originalism_weight: 0.65,    // AI can control originalist interpretation weight (0.0-1.0)
  precedent_adherence_strictness: 0.82,       // AI can control adherence to legal precedent (0.0-1.0)
  living_constitution_openness: 0.35,         // AI can control living constitution approach (0.0-1.0)
  doctrinal_consistency_emphasis: 0.8,        // AI can control doctrinal consistency priority (0.0-1.0)
  
  // Judicial Independence & Politics
  political_independence_priority: 0.85,      // AI can control political independence focus (0.0-1.0)
  public_opinion_consideration: 0.25,         // AI can control public opinion influence (0.0-1.0)
  inter_branch_deference_level: 0.5,          // AI can control deference to other branches (0.0-1.0)
  judicial_restraint_emphasis: 0.72,          // AI can control judicial restraint vs activism (0.0-1.0)
  
  // Case Management & Operations
  case_selection_rigor: 0.75,                 // AI can control certiorari grant standards (0.0-1.0)
  decision_timeliness_priority: 0.75,         // AI can control decision-making speed (0.0-1.0)
  oral_argument_thoroughness: 0.8,            // AI can control oral argument depth (0.0-1.0)
  opinion_writing_detail: 0.85,               // AI can control opinion comprehensiveness (0.0-1.0)
  
  // Transparency & Public Access
  transparency_commitment: 0.7,               // AI can control court transparency (0.0-1.0)
  media_engagement_level: 0.4,                // AI can control media interaction (0.0-1.0)
  public_education_priority: 0.6,             // AI can control public education efforts (0.0-1.0)
  accessibility_focus: 0.65,                  // AI can control public accessibility (0.0-1.0)
  
  // Legal Analysis & Research
  legal_research_depth: 0.9,                  // AI can control research thoroughness (0.0-1.0)
  comparative_law_consideration: 0.4,         // AI can control international law consideration (0.0-1.0)
  historical_analysis_weight: 0.7,            // AI can control historical legal analysis (0.0-1.0)
  empirical_evidence_openness: 0.6,           // AI can control empirical data consideration (0.0-1.0)
  
  // Administrative Efficiency
  administrative_efficiency_focus: 0.8,       // AI can control administrative operations (0.0-1.0)
  technology_adoption_rate: 0.6,              // AI can control court technology integration (0.0-1.0)
  staff_training_investment: 0.75,            // AI can control staff development (0.0-1.0)
  resource_allocation_optimization: 0.8,      // AI can control resource management (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const supremeCourtKnobSystem = new EnhancedKnobSystem(supremeCourtKnobsData);

// Backward compatibility - expose knobs directly
const supremeCourtKnobs = supremeCourtKnobSystem.knobs;

// Supreme Court Game State
const supremeCourtGameState = {
  // Court Composition
  courtComposition: {
    total_justices: 9,
    chief_justice: 1,
    associate_justices: 8,
    conservative_justices: 6,
    liberal_justices: 3,
    ideological_balance_index: 0.67, // Higher = more conservative
    judicial_experience_average: 18.5, // years
    confirmation_process_duration: 85, // days average
    public_approval_rating: 0.58
  },
  
  // Case Management
  caseManagement: {
    cases_filed_annually: 7500,
    cert_petitions_granted: 65,
    cert_grant_rate: 0.0087, // ~0.87%
    cases_decided_with_opinion: 58,
    unanimous_decisions: 18,
    split_decisions_5_4: 15,
    split_decisions_6_3: 12,
    case_backlog: 125,
    average_case_duration: 185 // days from cert to decision
  },
  
  // Constitutional Interpretation Metrics
  constitutionalInterpretation: {
    originalist_approach_frequency: 0.65,
    living_constitution_approach_frequency: 0.35,
    precedent_adherence_rate: 0.82,
    constitutional_doctrine_consistency: 0.78,
    landmark_decisions_impact: 0.85,
    constitutional_crisis_resolution: 0.88,
    judicial_restraint_index: 0.72,
    judicial_activism_index: 0.28
  },
  
  // Areas of Law Performance
  areasOfLaw: {
    constitutional_law_expertise: 0.95,
    civil_rights_focus: 0.85,
    criminal_justice_attention: 0.8,
    economic_regulation_understanding: 0.75,
    federalism_clarity: 0.8,
    separation_of_powers_enforcement: 0.85,
    individual_rights_protection: 0.82,
    interstate_commerce_regulation: 0.78
  },
  
  // Public Impact
  publicImpact: {
    public_confidence_level: 0.58,
    democratic_legitimacy_index: 0.75,
    institutional_integrity_rating: 0.8,
    legal_system_stability_contribution: 0.85,
    constitutional_education_impact: 0.65,
    civic_engagement_influence: 0.6,
    rule_of_law_strengthening: 0.88,
    justice_accessibility_improvement: 0.55
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateSupremeCourtStructuredOutputs() {
  const composition = supremeCourtGameState.courtComposition;
  const caseManagement = supremeCourtGameState.caseManagement;
  const interpretation = supremeCourtGameState.constitutionalInterpretation;
  const publicImpact = supremeCourtGameState.publicImpact;
  
  return {
    judicial_decision_analysis: {
      decision_metrics: {
        total_cases_decided: caseManagement.cases_decided_with_opinion,
        unanimous_decision_rate: caseManagement.unanimous_decisions / caseManagement.cases_decided_with_opinion,
        split_decision_rate: (caseManagement.split_decisions_5_4 + caseManagement.split_decisions_6_3) / caseManagement.cases_decided_with_opinion,
        cert_grant_selectivity: caseManagement.cert_grant_rate,
        case_processing_efficiency: 185 / caseManagement.average_case_duration,
        backlog_management: Math.max(0, 1 - (caseManagement.case_backlog / 200))
      },
      interpretation_approach: {
        originalist_tendency: interpretation.originalist_approach_frequency,
        living_constitution_tendency: interpretation.living_constitution_approach_frequency,
        precedent_respect: interpretation.precedent_adherence_rate,
        doctrinal_consistency: interpretation.constitutional_doctrine_consistency,
        judicial_philosophy_balance: interpretation.judicial_restraint_index
      },
      constitutional_impact: {
        landmark_decision_influence: interpretation.landmark_decisions_impact,
        crisis_resolution_capability: interpretation.constitutional_crisis_resolution,
        constitutional_clarity_contribution: interpretation.constitutional_doctrine_consistency,
        legal_precedent_strength: interpretation.precedent_adherence_rate
      }
    },
    
    constitutional_law_status: {
      interpretation_framework: {
        originalism_weight: supremeCourtKnobs.constitutional_originalism_weight,
        precedent_adherence: supremeCourtKnobs.precedent_adherence_strictness,
        living_constitution_openness: supremeCourtKnobs.living_constitution_openness,
        doctrinal_consistency: supremeCourtKnobs.doctrinal_consistency_emphasis
      },
      legal_doctrine_health: {
        consistency_index: interpretation.constitutional_doctrine_consistency,
        precedent_stability: interpretation.precedent_adherence_rate,
        constitutional_clarity: (interpretation.constitutional_doctrine_consistency + interpretation.precedent_adherence_rate) / 2,
        jurisprudential_coherence: interpretation.landmark_decisions_impact
      },
      areas_of_law_strength: supremeCourtGameState.areasOfLaw
    },
    
    court_operations_report: {
      efficiency_metrics: {
        case_processing_speed: caseManagement.average_case_duration,
        cert_petition_management: caseManagement.cert_grant_rate,
        decision_output_rate: caseManagement.cases_decided_with_opinion / 365,
        backlog_control: caseManagement.case_backlog,
        administrative_effectiveness: supremeCourtKnobs.administrative_efficiency_focus
      },
      quality_indicators: {
        opinion_thoroughness: supremeCourtKnobs.opinion_writing_detail,
        legal_research_depth: supremeCourtKnobs.legal_research_depth,
        oral_argument_quality: supremeCourtKnobs.oral_argument_thoroughness,
        decision_timeliness: supremeCourtKnobs.decision_timeliness_priority
      },
      transparency_measures: {
        public_access_level: supremeCourtKnobs.transparency_commitment,
        media_engagement: supremeCourtKnobs.media_engagement_level,
        educational_outreach: supremeCourtKnobs.public_education_priority,
        accessibility_efforts: supremeCourtKnobs.accessibility_focus
      }
    },
    
    judicial_independence_assessment: {
      independence_metrics: {
        political_independence_strength: supremeCourtKnobs.political_independence_priority,
        public_opinion_resistance: 1 - supremeCourtKnobs.public_opinion_consideration,
        inter_branch_autonomy: 1 - supremeCourtKnobs.inter_branch_deference_level,
        institutional_integrity: publicImpact.institutional_integrity_rating
      },
      legitimacy_indicators: {
        public_confidence: publicImpact.public_confidence_level,
        democratic_legitimacy: publicImpact.democratic_legitimacy_index,
        rule_of_law_contribution: publicImpact.rule_of_law_strengthening,
        constitutional_authority: composition.public_approval_rating
      }
    },
    
    public_confidence_metrics: {
      confidence_levels: {
        overall_approval: publicImpact.public_confidence_level,
        institutional_trust: publicImpact.institutional_integrity_rating,
        democratic_legitimacy: publicImpact.democratic_legitimacy_index,
        justice_accessibility: publicImpact.justice_accessibility_improvement
      },
      civic_impact: {
        constitutional_education: publicImpact.constitutional_education_impact,
        civic_engagement_influence: publicImpact.civic_engagement_influence,
        legal_system_stability: publicImpact.legal_system_stability_contribution,
        rule_of_law_strengthening: publicImpact.rule_of_law_strengthening
      }
    }
  };
}

// Apply knobs to game state
function applySupremeCourtKnobsToGameState() {
  const knobs = supremeCourtKnobs;
  
  // Update constitutional interpretation based on knobs
  supremeCourtGameState.constitutionalInterpretation.originalist_approach_frequency = 
    knobs.constitutional_originalism_weight;
  supremeCourtGameState.constitutionalInterpretation.living_constitution_approach_frequency = 
    knobs.living_constitution_openness;
  supremeCourtGameState.constitutionalInterpretation.precedent_adherence_rate = 
    knobs.precedent_adherence_strictness;
  supremeCourtGameState.constitutionalInterpretation.constitutional_doctrine_consistency = 
    knobs.doctrinal_consistency_emphasis;
  supremeCourtGameState.constitutionalInterpretation.judicial_restraint_index = 
    knobs.judicial_restraint_emphasis;
  supremeCourtGameState.constitutionalInterpretation.judicial_activism_index = 
    1 - knobs.judicial_restraint_emphasis;
  
  // Update case management efficiency
  supremeCourtGameState.caseManagement.cert_grant_rate = 
    0.005 + (knobs.case_selection_rigor * 0.01); // 0.5% to 1.5%
  supremeCourtGameState.caseManagement.average_case_duration = 
    Math.round(250 - (knobs.decision_timeliness_priority * 100)); // 150-250 days
  
  // Update public impact metrics
  supremeCourtGameState.publicImpact.public_confidence_level = 
    0.3 + (knobs.transparency_commitment * 0.4) + (knobs.political_independence_priority * 0.3);
  supremeCourtGameState.publicImpact.institutional_integrity_rating = 
    0.5 + (knobs.political_independence_priority * 0.3) + (knobs.doctrinal_consistency_emphasis * 0.2);
  supremeCourtGameState.publicImpact.justice_accessibility_improvement = 
    0.3 + (knobs.accessibility_focus * 0.4) + (knobs.transparency_commitment * 0.3);
  
  supremeCourtGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applySupremeCourtKnobsToGameState();

// ===== SUPREME COURT API ENDPOINTS =====

// Get court composition and justices
router.get('/composition', (req, res) => {
  res.json({
    composition: supremeCourtGameState.courtComposition,
    ideological_balance: {
      conservative_lean: supremeCourtGameState.courtComposition.ideological_balance_index,
      liberal_lean: 1 - supremeCourtGameState.courtComposition.ideological_balance_index,
      moderate_influence: Math.abs(0.5 - supremeCourtGameState.courtComposition.ideological_balance_index)
    },
    experience_metrics: {
      average_years: supremeCourtGameState.courtComposition.judicial_experience_average,
      confirmation_efficiency: 120 - supremeCourtGameState.courtComposition.confirmation_process_duration
    }
  });
});

// Get case management statistics
router.get('/cases', (req, res) => {
  const cases = supremeCourtGameState.caseManagement;
  res.json({
    case_statistics: cases,
    efficiency_metrics: {
      selectivity_index: cases.cert_grant_rate,
      processing_speed: 365 / cases.average_case_duration,
      decision_quality: cases.unanimous_decisions / cases.cases_decided_with_opinion,
      workload_management: Math.max(0, 1 - (cases.case_backlog / 200))
    },
    decision_patterns: {
      unanimous_rate: cases.unanimous_decisions / cases.cases_decided_with_opinion,
      narrow_split_rate: cases.split_decisions_5_4 / cases.cases_decided_with_opinion,
      moderate_split_rate: cases.split_decisions_6_3 / cases.cases_decided_with_opinion
    }
  });
});

// Get constitutional interpretation analysis
router.get('/constitutional-interpretation', (req, res) => {
  const interpretation = supremeCourtGameState.constitutionalInterpretation;
  res.json({
    interpretation_approach: interpretation,
    judicial_philosophy: {
      originalist_tendency: interpretation.originalist_approach_frequency,
      living_constitution_tendency: interpretation.living_constitution_approach_frequency,
      restraint_vs_activism: {
        restraint_index: interpretation.judicial_restraint_index,
        activism_index: interpretation.judicial_activism_index
      }
    },
    precedent_analysis: {
      adherence_strength: interpretation.precedent_adherence_rate,
      doctrinal_consistency: interpretation.constitutional_doctrine_consistency,
      landmark_impact: interpretation.landmark_decisions_impact
    }
  });
});

// Get areas of law expertise
router.get('/legal-areas', (req, res) => {
  res.json({
    areas_of_law: supremeCourtGameState.areasOfLaw,
    expertise_summary: {
      strongest_areas: Object.entries(supremeCourtGameState.areasOfLaw)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([area, score]) => ({ area, expertise_level: score })),
      development_areas: Object.entries(supremeCourtGameState.areasOfLaw)
        .sort(([,a], [,b]) => a - b)
        .slice(0, 2)
        .map(([area, score]) => ({ area, expertise_level: score }))
    }
  });
});

// Get public impact and confidence metrics
router.get('/public-impact', (req, res) => {
  res.json({
    public_impact: supremeCourtGameState.publicImpact,
    confidence_analysis: {
      overall_trust: supremeCourtGameState.publicImpact.public_confidence_level,
      legitimacy_strength: supremeCourtGameState.publicImpact.democratic_legitimacy_index,
      institutional_health: supremeCourtGameState.publicImpact.institutional_integrity_rating
    },
    civic_contributions: {
      rule_of_law: supremeCourtGameState.publicImpact.rule_of_law_strengthening,
      constitutional_education: supremeCourtGameState.publicImpact.constitutional_education_impact,
      civic_engagement: supremeCourtGameState.publicImpact.civic_engagement_influence
    }
  });
});

// Simulate court decision on a case
router.post('/simulate-decision', (req, res) => {
  const { case_type, constitutional_issue, complexity_level = 0.5 } = req.body;
  
  if (!case_type || !constitutional_issue) {
    return res.status(400).json({
      success: false,
      error: 'case_type and constitutional_issue are required'
    });
  }
  
  const interpretation = supremeCourtGameState.constitutionalInterpretation;
  const knobs = supremeCourtKnobs;
  
  // Simulate decision based on court's current approach
  const decision_factors = {
    originalist_influence: knobs.constitutional_originalism_weight * 0.4,
    precedent_weight: knobs.precedent_adherence_strictness * 0.3,
    living_constitution_factor: knobs.living_constitution_openness * 0.2,
    political_independence: knobs.political_independence_priority * 0.1
  };
  
  const decision_likelihood = Object.values(decision_factors).reduce((sum, factor) => sum + factor, 0);
  const processing_time = Math.round(150 + (complexity_level * 100) - (knobs.decision_timeliness_priority * 50));
  
  res.json({
    case_analysis: {
      case_type,
      constitutional_issue,
      complexity_level,
      estimated_processing_time_days: processing_time
    },
    decision_prediction: {
      likelihood_factors: decision_factors,
      predicted_approach: decision_likelihood > 0.6 ? 'conservative' : decision_likelihood < 0.4 ? 'liberal' : 'moderate',
      confidence_level: Math.min(0.9, knobs.legal_research_depth * knobs.doctrinal_consistency_emphasis),
      precedent_reliance_expected: knobs.precedent_adherence_strictness > 0.7
    },
    process_expectations: {
      oral_argument_depth: knobs.oral_argument_thoroughness,
      opinion_detail_level: knobs.opinion_writing_detail,
      research_thoroughness: knobs.legal_research_depth,
      transparency_level: knobs.transparency_commitment
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = supremeCourtKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'supreme-court',
    description: 'AI-adjustable parameters for Supreme Court system with enhanced input support',
    input_help: supremeCourtKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: supremeCourtKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = supremeCourtKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applySupremeCourtKnobsToGameState();
  } catch (error) {
    console.error('Error applying Supreme Court knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'supreme-court',
    ...updateResult,
    message: 'Supreme Court knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'supreme-court',
    help: supremeCourtKnobSystem.getKnobDescriptions(),
    current_values: supremeCourtKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateSupremeCourtStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Supreme Court data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    supreme_court_influence: {
      constitutional_law_impact: supremeCourtGameState.constitutionalInterpretation.constitutional_doctrine_consistency,
      rule_of_law_contribution: supremeCourtGameState.publicImpact.rule_of_law_strengthening,
      democratic_legitimacy_support: supremeCourtGameState.publicImpact.democratic_legitimacy_index,
      inter_branch_relations: 1 - supremeCourtKnobs.inter_branch_deference_level
    },
    integration_points: {
      legislative_interaction: supremeCourtKnobs.inter_branch_deference_level,
      executive_oversight: supremeCourtKnobs.political_independence_priority,
      public_opinion_sensitivity: supremeCourtKnobs.public_opinion_consideration,
      constitutional_education_role: supremeCourtGameState.publicImpact.constitutional_education_impact
    },
    system_health: {
      overall_effectiveness: (
        supremeCourtGameState.publicImpact.institutional_integrity_rating +
        supremeCourtGameState.constitutionalInterpretation.constitutional_doctrine_consistency +
        supremeCourtGameState.publicImpact.rule_of_law_strengthening
      ) / 3,
      knobs_applied: { ...supremeCourtKnobs }
    }
  });
});

module.exports = router;
