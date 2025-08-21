/**
 * Commerce Department API - Trade policy, business regulation, and economic development
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const commerceKnobsData = {
  // Trade Policy & International Commerce
  trade_liberalization_level: 0.75,               // AI can control trade openness (0.0-1.0)
  international_trade_engagement: 0.8,            // AI can control international trade cooperation (0.0-1.0)
  export_promotion_aggressiveness: 0.7,           // AI can control export promotion intensity (0.0-1.0)
  foreign_investment_openness: 0.6,               // AI can control FDI openness (0.0-1.0)
  trade_agreement_negotiation_priority: 0.75,     // AI can control trade agreement focus (0.0-1.0)
  
  // Business Regulation & Environment
  business_regulation_strictness: 0.7,            // AI can control business regulation intensity (0.0-1.0)
  regulatory_compliance_enforcement: 0.65,        // AI can control compliance enforcement (0.0-1.0)
  business_licensing_streamlining: 0.7,           // AI can control licensing efficiency (0.0-1.0)
  regulatory_burden_reduction: 0.6,               // AI can control regulatory burden (0.0-1.0)
  business_environment_optimization: 0.75,        // AI can control business climate (0.0-1.0)
  
  // Small Business & Entrepreneurship Support
  small_business_support_emphasis: 0.65,          // AI can control SME support (0.0-1.0)
  entrepreneurship_promotion: 0.7,                // AI can control entrepreneurship programs (0.0-1.0)
  startup_ecosystem_development: 0.68,            // AI can control startup support (0.0-1.0)
  minority_business_support: 0.6,                 // AI can control minority business programs (0.0-1.0)
  rural_business_development: 0.55,               // AI can control rural business support (0.0-1.0)
  
  // Innovation & Technology
  innovation_promotion_level: 0.7,                // AI can control innovation promotion (0.0-1.0)
  digital_commerce_priority: 0.75,                // AI can control digital commerce focus (0.0-1.0)
  technology_transfer_facilitation: 0.65,         // AI can control tech transfer (0.0-1.0)
  research_commercialization_support: 0.7,        // AI can control R&D commercialization (0.0-1.0)
  intellectual_property_protection: 0.8,          // AI can control IP protection (0.0-1.0)
  
  // Competition & Antitrust
  antitrust_enforcement_intensity: 0.7,           // AI can control antitrust enforcement (0.0-1.0)
  market_competition_promotion: 0.75,             // AI can control competition promotion (0.0-1.0)
  monopoly_prevention_priority: 0.7,              // AI can control monopoly prevention (0.0-1.0)
  merger_review_strictness: 0.65,                 // AI can control merger oversight (0.0-1.0)
  consumer_protection_emphasis: 0.8,              // AI can control consumer protection (0.0-1.0)
  
  // Supply Chain & Manufacturing
  supply_chain_resilience_focus: 0.65,            // AI can control supply chain resilience (0.0-1.0)
  domestic_manufacturing_promotion: 0.6,          // AI can control domestic manufacturing (0.0-1.0)
  critical_supply_chain_security: 0.75,           // AI can control supply chain security (0.0-1.0)
  manufacturing_modernization_support: 0.7,       // AI can control manufacturing upgrades (0.0-1.0)
  industrial_base_strengthening: 0.65,            // AI can control industrial base (0.0-1.0)
  
  // Environmental & Sustainability
  environmental_business_standards: 0.7,          // AI can control environmental standards (0.0-1.0)
  sustainable_business_promotion: 0.68,           // AI can control sustainability promotion (0.0-1.0)
  green_technology_incentives: 0.65,              // AI can control green tech incentives (0.0-1.0)
  carbon_footprint_regulation: 0.6,               // AI can control carbon regulations (0.0-1.0)
  circular_economy_promotion: 0.55,               // AI can control circular economy (0.0-1.0)
  
  // Regional & Economic Development
  regional_development_investment: 0.03,           // AI can control regional development as % GDP (0.0-1.0)
  economic_zone_development: 0.6,                 // AI can control economic zones (0.0-1.0)
  infrastructure_business_support: 0.7,           // AI can control business infrastructure (0.0-1.0)
  workforce_development_coordination: 0.65,       // AI can control workforce programs (0.0-1.0)
  economic_diversification_priority: 0.7,         // AI can control economic diversification (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const commerceKnobSystem = new EnhancedKnobSystem(commerceKnobsData);

// Backward compatibility - expose knobs directly
const commerceKnobs = commerceKnobSystem.knobs;

// Commerce Department Game State
const commerceGameState = {
  // Trade Policy Framework
  tradePolicy: {
    trade_openness_index: 0.75,
    tariff_average_rate: 0.08, // 8% average tariff
    free_trade_agreements: 15,
    trade_balance: -50000000000, // $50B deficit
    export_promotion_effectiveness: 0.7,
    import_regulation_strictness: 0.6,
    trade_dispute_resolution_success: 0.78,
    international_market_access_score: 0.72
  },
  
  // Business Environment
  businessEnvironment: {
    ease_of_doing_business_rank: 25, // Global ranking
    business_registration_time: 7, // days
    regulatory_burden_index: 0.6,
    small_business_support_level: 0.65,
    entrepreneurship_index: 0.7,
    business_confidence: 0.68,
    regulatory_compliance_rate: 0.85,
    business_startup_rate: 0.12 // 12% annual rate
  },
  
  // Innovation & Technology
  innovationTechnology: {
    r_and_d_investment_percentage: 0.035, // 3.5% of GDP
    patent_applications_annual: 350000,
    technology_transfer_agreements: 1200,
    innovation_index_score: 0.78,
    digital_transformation_rate: 0.72,
    tech_startup_ecosystem_strength: 0.75,
    intellectual_property_protection_score: 0.8,
    commercialization_success_rate: 0.35
  },
  
  // Competition & Market Structure
  competitionMarkets: {
    market_concentration_index: 0.65,
    antitrust_cases_filed_annual: 45,
    merger_reviews_conducted: 280,
    monopoly_investigations: 25,
    consumer_protection_cases: 1200,
    market_competition_score: 0.72,
    consumer_choice_index: 0.78,
    price_competition_effectiveness: 0.7
  },
  
  // Manufacturing & Supply Chains
  manufacturingSupplyChain: {
    manufacturing_output_percentage: 0.18, // 18% of GDP
    supply_chain_resilience_score: 0.65,
    domestic_sourcing_percentage: 0.45,
    critical_materials_stockpile_adequacy: 0.7,
    manufacturing_employment: 12500000,
    industrial_capacity_utilization: 0.78,
    supply_chain_disruption_frequency: 0.15,
    manufacturing_productivity_growth: 0.025 // 2.5% annual
  },
  
  // Small Business & Entrepreneurship
  smallBusinessEntrepreneurship: {
    small_business_percentage: 0.995, // 99.5% of businesses
    small_business_employment_share: 0.47,
    sba_loans_approved_annual: 65000,
    minority_business_enterprises: 9500000,
    women_owned_businesses: 13000000,
    veteran_owned_businesses: 2500000,
    startup_survival_rate_5_year: 0.45,
    small_business_revenue_growth: 0.035 // 3.5% annual
  },
  
  // International Trade & Investment
  internationalTrade: {
    total_trade_volume: 4200000000000, // $4.2T
    export_value: 1650000000000, // $1.65T
    import_value: 2550000000000, // $2.55T
    foreign_direct_investment_inflow: 280000000000, // $280B
    foreign_direct_investment_outflow: 350000000000, // $350B
    trade_agreement_coverage: 0.65, // 65% of trade
    export_market_diversification: 0.72,
    trade_facilitation_score: 0.78
  },
  
  // Economic Development
  economicDevelopment: {
    regional_development_projects: 450,
    economic_zones_active: 85,
    business_incubators: 1200,
    economic_development_funding: 15000000000, // $15B
    job_creation_programs: 180,
    workforce_development_partnerships: 850,
    economic_diversification_index: 0.68,
    regional_economic_growth_variance: 0.25
  },
  
  // Environmental & Sustainability
  environmentalSustainability: {
    green_business_certifications: 45000,
    sustainable_supply_chain_adoption: 0.35,
    carbon_neutral_businesses: 12000,
    environmental_compliance_rate: 0.88,
    green_technology_investments: 85000000000, // $85B
    circular_economy_participation: 0.28,
    environmental_business_standards_score: 0.7,
    sustainability_reporting_rate: 0.65
  },
  
  lastUpdate: Date.now()
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateCommerceStructuredOutputs() {
  const trade = commerceGameState.tradePolicy;
  const business = commerceGameState.businessEnvironment;
  const innovation = commerceGameState.innovationTechnology;
  const competition = commerceGameState.competitionMarkets;
  const manufacturing = commerceGameState.manufacturingSupplyChain;
  const smallBiz = commerceGameState.smallBusinessEntrepreneurship;
  const international = commerceGameState.internationalTrade;
  const development = commerceGameState.economicDevelopment;
  const environmental = commerceGameState.environmentalSustainability;
  
  return {
    trade_policy_status: {
      trade_framework: {
        openness_index: trade.trade_openness_index,
        tariff_rate: trade.tariff_average_rate,
        trade_agreements: trade.free_trade_agreements,
        trade_balance: trade.trade_balance
      },
      trade_effectiveness: {
        export_promotion: trade.export_promotion_effectiveness,
        market_access_score: trade.international_market_access_score,
        dispute_resolution: trade.trade_dispute_resolution_success,
        import_regulation: trade.import_regulation_strictness
      },
      trade_priorities: {
        liberalization_level: commerceKnobs.trade_liberalization_level,
        international_engagement: commerceKnobs.international_trade_engagement,
        export_promotion: commerceKnobs.export_promotion_aggressiveness,
        foreign_investment_openness: commerceKnobs.foreign_investment_openness
      }
    },
    
    business_environment_status: {
      business_climate: {
        ease_of_business_rank: business.ease_of_doing_business_rank,
        registration_time: business.business_registration_time,
        regulatory_burden: business.regulatory_burden_index,
        business_confidence: business.business_confidence
      },
      regulatory_framework: {
        compliance_rate: business.regulatory_compliance_rate,
        startup_rate: business.business_startup_rate,
        support_level: business.small_business_support_level,
        entrepreneurship_index: business.entrepreneurship_index
      },
      regulatory_priorities: {
        regulation_strictness: commerceKnobs.business_regulation_strictness,
        compliance_enforcement: commerceKnobs.regulatory_compliance_enforcement,
        licensing_streamlining: commerceKnobs.business_licensing_streamlining,
        environment_optimization: commerceKnobs.business_environment_optimization
      }
    },
    
    innovation_technology_status: {
      innovation_metrics: {
        rd_investment_percentage: innovation.r_and_d_investment_percentage,
        patent_applications: innovation.patent_applications_annual,
        innovation_index: innovation.innovation_index_score,
        commercialization_rate: innovation.commercialization_success_rate
      },
      technology_advancement: {
        digital_transformation: innovation.digital_transformation_rate,
        tech_ecosystem_strength: innovation.tech_startup_ecosystem_strength,
        ip_protection_score: innovation.intellectual_property_protection_score,
        tech_transfer_agreements: innovation.technology_transfer_agreements
      },
      innovation_priorities: {
        innovation_promotion: commerceKnobs.innovation_promotion_level,
        digital_commerce_priority: commerceKnobs.digital_commerce_priority,
        tech_transfer_facilitation: commerceKnobs.technology_transfer_facilitation,
        ip_protection: commerceKnobs.intellectual_property_protection
      }
    },
    
    competition_market_status: {
      market_structure: {
        concentration_index: competition.market_concentration_index,
        competition_score: competition.market_competition_score,
        consumer_choice_index: competition.consumer_choice_index,
        price_competition: competition.price_competition_effectiveness
      },
      enforcement_actions: {
        antitrust_cases: competition.antitrust_cases_filed_annual,
        merger_reviews: competition.merger_reviews_conducted,
        monopoly_investigations: competition.monopoly_investigations,
        consumer_protection_cases: competition.consumer_protection_cases
      },
      competition_priorities: {
        antitrust_intensity: commerceKnobs.antitrust_enforcement_intensity,
        competition_promotion: commerceKnobs.market_competition_promotion,
        monopoly_prevention: commerceKnobs.monopoly_prevention_priority,
        consumer_protection: commerceKnobs.consumer_protection_emphasis
      }
    },
    
    manufacturing_supply_chain_status: {
      manufacturing_metrics: {
        output_percentage: manufacturing.manufacturing_output_percentage,
        employment: manufacturing.manufacturing_employment,
        capacity_utilization: manufacturing.industrial_capacity_utilization,
        productivity_growth: manufacturing.manufacturing_productivity_growth
      },
      supply_chain_resilience: {
        resilience_score: manufacturing.supply_chain_resilience_score,
        domestic_sourcing: manufacturing.domestic_sourcing_percentage,
        critical_materials_adequacy: manufacturing.critical_materials_stockpile_adequacy,
        disruption_frequency: manufacturing.supply_chain_disruption_frequency
      },
      manufacturing_priorities: {
        supply_chain_focus: commerceKnobs.supply_chain_resilience_focus,
        domestic_manufacturing: commerceKnobs.domestic_manufacturing_promotion,
        supply_chain_security: commerceKnobs.critical_supply_chain_security,
        manufacturing_modernization: commerceKnobs.manufacturing_modernization_support
      }
    },
    
    small_business_entrepreneurship_status: {
      small_business_metrics: {
        business_percentage: smallBiz.small_business_percentage,
        employment_share: smallBiz.small_business_employment_share,
        sba_loans_approved: smallBiz.sba_loans_approved_annual,
        revenue_growth: smallBiz.small_business_revenue_growth
      },
      diversity_metrics: {
        minority_businesses: smallBiz.minority_business_enterprises,
        women_owned_businesses: smallBiz.women_owned_businesses,
        veteran_owned_businesses: smallBiz.veteran_owned_businesses,
        startup_survival_rate: smallBiz.startup_survival_rate_5_year
      },
      small_business_priorities: {
        support_emphasis: commerceKnobs.small_business_support_emphasis,
        entrepreneurship_promotion: commerceKnobs.entrepreneurship_promotion,
        startup_ecosystem_development: commerceKnobs.startup_ecosystem_development,
        minority_business_support: commerceKnobs.minority_business_support
      }
    },
    
    international_trade_status: {
      trade_volumes: {
        total_trade: international.total_trade_volume,
        exports: international.export_value,
        imports: international.import_value,
        trade_balance: international.export_value - international.import_value
      },
      investment_flows: {
        fdi_inflow: international.foreign_direct_investment_inflow,
        fdi_outflow: international.foreign_direct_investment_outflow,
        trade_agreement_coverage: international.trade_agreement_coverage,
        market_diversification: international.export_market_diversification
      },
      trade_priorities: {
        liberalization_level: commerceKnobs.trade_liberalization_level,
        international_engagement: commerceKnobs.international_trade_engagement,
        export_promotion: commerceKnobs.export_promotion_aggressiveness,
        foreign_investment_openness: commerceKnobs.foreign_investment_openness
      }
    },
    
    economic_development_impact: {
      development_programs: {
        regional_projects: development.regional_development_projects,
        economic_zones: development.economic_zones_active,
        business_incubators: development.business_incubators,
        development_funding: development.economic_development_funding
      },
      development_effectiveness: {
        job_creation_programs: development.job_creation_programs,
        workforce_partnerships: development.workforce_development_partnerships,
        diversification_index: development.economic_diversification_index,
        regional_growth_variance: development.regional_economic_growth_variance
      },
      development_priorities: {
        regional_investment: commerceKnobs.regional_development_investment,
        economic_zone_development: commerceKnobs.economic_zone_development,
        infrastructure_support: commerceKnobs.infrastructure_business_support,
        economic_diversification: commerceKnobs.economic_diversification_priority
      }
    }
  };
}

// Apply knobs to game state
function applyCommerceKnobsToGameState() {
  const knobs = commerceKnobs;
  
  // Update trade policy based on knobs
  commerceGameState.tradePolicy.trade_openness_index = 
    0.5 + (knobs.trade_liberalization_level * 0.4);
  commerceGameState.tradePolicy.tariff_average_rate = 
    0.15 - (knobs.trade_liberalization_level * 0.1); // 5% to 15%
  commerceGameState.tradePolicy.export_promotion_effectiveness = 
    0.5 + (knobs.export_promotion_aggressiveness * 0.4);
  commerceGameState.tradePolicy.international_market_access_score = 
    0.5 + (knobs.international_trade_engagement * 0.4);
  
  // Update business environment
  commerceGameState.businessEnvironment.ease_of_doing_business_rank = 
    Math.round(50 - (knobs.business_environment_optimization * 30)); // Rank 20-50
  commerceGameState.businessEnvironment.business_registration_time = 
    Math.round(15 - (knobs.business_licensing_streamlining * 10)); // 5-15 days
  commerceGameState.businessEnvironment.regulatory_burden_index = 
    0.8 - (knobs.regulatory_burden_reduction * 0.4);
  commerceGameState.businessEnvironment.business_confidence = 
    0.5 + (knobs.business_environment_optimization * 0.3);
  commerceGameState.businessEnvironment.regulatory_compliance_rate = 
    0.75 + (knobs.regulatory_compliance_enforcement * 0.2);
  
  // Update innovation and technology
  commerceGameState.innovationTechnology.r_and_d_investment_percentage = 
    0.02 + (knobs.innovation_promotion_level * 0.025); // 2% to 4.5%
  commerceGameState.innovationTechnology.patent_applications_annual = 
    Math.round(250000 + (knobs.innovation_promotion_level * 200000));
  commerceGameState.innovationTechnology.digital_transformation_rate = 
    0.5 + (knobs.digital_commerce_priority * 0.4);
  commerceGameState.innovationTechnology.commercialization_success_rate = 
    0.2 + (knobs.research_commercialization_support * 0.3);
  
  // Update competition and markets
  commerceGameState.competitionMarkets.antitrust_cases_filed_annual = 
    Math.round(25 + (knobs.antitrust_enforcement_intensity * 40));
  commerceGameState.competitionMarkets.market_competition_score = 
    0.5 + (knobs.market_competition_promotion * 0.4);
  commerceGameState.competitionMarkets.consumer_choice_index = 
    0.6 + (knobs.consumer_protection_emphasis * 0.3);
  
  // Update manufacturing and supply chain
  commerceGameState.manufacturingSupplyChain.supply_chain_resilience_score = 
    0.4 + (knobs.supply_chain_resilience_focus * 0.4);
  commerceGameState.manufacturingSupplyChain.domestic_sourcing_percentage = 
    0.3 + (knobs.domestic_manufacturing_promotion * 0.3);
  commerceGameState.manufacturingSupplyChain.critical_materials_stockpile_adequacy = 
    0.5 + (knobs.critical_supply_chain_security * 0.4);
  commerceGameState.manufacturingSupplyChain.manufacturing_productivity_growth = 
    0.015 + (knobs.manufacturing_modernization_support * 0.02); // 1.5% to 3.5%
  
  // Update small business and entrepreneurship
  commerceGameState.smallBusinessEntrepreneurship.sba_loans_approved_annual = 
    Math.round(40000 + (knobs.small_business_support_emphasis * 50000));
  commerceGameState.smallBusinessEntrepreneurship.startup_survival_rate_5_year = 
    0.3 + (knobs.entrepreneurship_promotion * 0.3);
  commerceGameState.smallBusinessEntrepreneurship.small_business_revenue_growth = 
    0.02 + (knobs.small_business_support_emphasis * 0.03); // 2% to 5%
  
  // Update international trade
  commerceGameState.internationalTrade.foreign_direct_investment_inflow = 
    Math.round(200000000000 + (knobs.foreign_investment_openness * 200000000000)); // $200-400B
  commerceGameState.internationalTrade.export_market_diversification = 
    0.5 + (knobs.export_promotion_aggressiveness * 0.4);
  commerceGameState.internationalTrade.trade_facilitation_score = 
    0.6 + (knobs.international_trade_engagement * 0.3);
  
  // Update economic development
  commerceGameState.economicDevelopment.economic_development_funding = 
    Math.round(8000000000 + (knobs.regional_development_investment * 20000000000)); // $8-28B
  commerceGameState.economicDevelopment.economic_zones_active = 
    Math.round(50 + (knobs.economic_zone_development * 70));
  commerceGameState.economicDevelopment.economic_diversification_index = 
    0.5 + (knobs.economic_diversification_priority * 0.3);
  
  // Update environmental sustainability
  commerceGameState.environmentalSustainability.environmental_compliance_rate = 
    0.75 + (knobs.environmental_business_standards * 0.2);
  commerceGameState.environmentalSustainability.green_technology_investments = 
    Math.round(50000000000 + (knobs.green_technology_incentives * 80000000000)); // $50-130B
  commerceGameState.environmentalSustainability.sustainable_supply_chain_adoption = 
    0.2 + (knobs.sustainable_business_promotion * 0.4);
  
  commerceGameState.lastUpdate = Date.now();
}

// Initialize with current knob values
applyCommerceKnobsToGameState();

// ===== COMMERCE DEPARTMENT API ENDPOINTS =====

// Get trade policy status
router.get('/trade-policy', (req, res) => {
  res.json({
    trade_policy: commerceGameState.tradePolicy,
    trade_priorities: {
      liberalization_level: commerceKnobs.trade_liberalization_level,
      international_engagement: commerceKnobs.international_trade_engagement,
      export_promotion: commerceKnobs.export_promotion_aggressiveness,
      foreign_investment_openness: commerceKnobs.foreign_investment_openness
    },
    trade_effectiveness: {
      openness_index: commerceGameState.tradePolicy.trade_openness_index,
      export_promotion_effectiveness: commerceGameState.tradePolicy.export_promotion_effectiveness,
      market_access_score: commerceGameState.tradePolicy.international_market_access_score,
      dispute_resolution_success: commerceGameState.tradePolicy.trade_dispute_resolution_success
    }
  });
});

// Get business environment status
router.get('/business-environment', (req, res) => {
  res.json({
    business_environment: commerceGameState.businessEnvironment,
    regulatory_priorities: {
      regulation_strictness: commerceKnobs.business_regulation_strictness,
      compliance_enforcement: commerceKnobs.regulatory_compliance_enforcement,
      licensing_streamlining: commerceKnobs.business_licensing_streamlining,
      environment_optimization: commerceKnobs.business_environment_optimization
    },
    business_climate: {
      ease_of_business_rank: commerceGameState.businessEnvironment.ease_of_doing_business_rank,
      registration_time: commerceGameState.businessEnvironment.business_registration_time,
      regulatory_burden: commerceGameState.businessEnvironment.regulatory_burden_index,
      business_confidence: commerceGameState.businessEnvironment.business_confidence
    }
  });
});

// Get innovation and technology status
router.get('/innovation-technology', (req, res) => {
  res.json({
    innovation_technology: commerceGameState.innovationTechnology,
    innovation_priorities: {
      innovation_promotion: commerceKnobs.innovation_promotion_level,
      digital_commerce_priority: commerceKnobs.digital_commerce_priority,
      tech_transfer_facilitation: commerceKnobs.technology_transfer_facilitation,
      ip_protection: commerceKnobs.intellectual_property_protection
    },
    innovation_metrics: {
      rd_investment_percentage: commerceGameState.innovationTechnology.r_and_d_investment_percentage,
      patent_applications: commerceGameState.innovationTechnology.patent_applications_annual,
      innovation_index: commerceGameState.innovationTechnology.innovation_index_score,
      commercialization_rate: commerceGameState.innovationTechnology.commercialization_success_rate
    }
  });
});

// Get competition and market status
router.get('/competition-markets', (req, res) => {
  res.json({
    competition_markets: commerceGameState.competitionMarkets,
    competition_priorities: {
      antitrust_intensity: commerceKnobs.antitrust_enforcement_intensity,
      competition_promotion: commerceKnobs.market_competition_promotion,
      monopoly_prevention: commerceKnobs.monopoly_prevention_priority,
      consumer_protection: commerceKnobs.consumer_protection_emphasis
    },
    market_health: {
      concentration_index: commerceGameState.competitionMarkets.market_concentration_index,
      competition_score: commerceGameState.competitionMarkets.market_competition_score,
      consumer_choice_index: commerceGameState.competitionMarkets.consumer_choice_index,
      price_competition: commerceGameState.competitionMarkets.price_competition_effectiveness
    }
  });
});

// Get manufacturing and supply chain status
router.get('/manufacturing-supply-chain', (req, res) => {
  res.json({
    manufacturing_supply_chain: commerceGameState.manufacturingSupplyChain,
    manufacturing_priorities: {
      supply_chain_focus: commerceKnobs.supply_chain_resilience_focus,
      domestic_manufacturing: commerceKnobs.domestic_manufacturing_promotion,
      supply_chain_security: commerceKnobs.critical_supply_chain_security,
      manufacturing_modernization: commerceKnobs.manufacturing_modernization_support
    },
    manufacturing_health: {
      output_percentage: commerceGameState.manufacturingSupplyChain.manufacturing_output_percentage,
      capacity_utilization: commerceGameState.manufacturingSupplyChain.industrial_capacity_utilization,
      productivity_growth: commerceGameState.manufacturingSupplyChain.manufacturing_productivity_growth,
      supply_chain_resilience: commerceGameState.manufacturingSupplyChain.supply_chain_resilience_score
    }
  });
});

// Get small business and entrepreneurship status
router.get('/small-business', (req, res) => {
  res.json({
    small_business_entrepreneurship: commerceGameState.smallBusinessEntrepreneurship,
    small_business_priorities: {
      support_emphasis: commerceKnobs.small_business_support_emphasis,
      entrepreneurship_promotion: commerceKnobs.entrepreneurship_promotion,
      startup_ecosystem_development: commerceKnobs.startup_ecosystem_development,
      minority_business_support: commerceKnobs.minority_business_support
    },
    small_business_health: {
      business_percentage: commerceGameState.smallBusinessEntrepreneurship.small_business_percentage,
      employment_share: commerceGameState.smallBusinessEntrepreneurship.small_business_employment_share,
      sba_loans_approved: commerceGameState.smallBusinessEntrepreneurship.sba_loans_approved_annual,
      startup_survival_rate: commerceGameState.smallBusinessEntrepreneurship.startup_survival_rate_5_year
    }
  });
});

// Get international trade status
router.get('/international-trade', (req, res) => {
  res.json({
    international_trade: commerceGameState.internationalTrade,
    trade_priorities: {
      liberalization_level: commerceKnobs.trade_liberalization_level,
      international_engagement: commerceKnobs.international_trade_engagement,
      export_promotion: commerceKnobs.export_promotion_aggressiveness,
      foreign_investment_openness: commerceKnobs.foreign_investment_openness
    },
    trade_performance: {
      total_trade: commerceGameState.internationalTrade.total_trade_volume,
      trade_balance: commerceGameState.internationalTrade.export_value - commerceGameState.internationalTrade.import_value,
      fdi_net_flow: commerceGameState.internationalTrade.foreign_direct_investment_outflow - commerceGameState.internationalTrade.foreign_direct_investment_inflow,
      market_diversification: commerceGameState.internationalTrade.export_market_diversification
    }
  });
});

// Simulate commerce policy scenario
router.post('/simulate-commerce-scenario', (req, res) => {
  const { scenario_type, policy_intensity = 0.5, market_impact_scope = 0.5, implementation_timeline = 12 } = req.body;
  
  if (!scenario_type) {
    return res.status(400).json({
      success: false,
      error: 'scenario_type is required'
    });
  }
  
  const knobs = commerceKnobs;
  const business = commerceGameState.businessEnvironment;
  
  // Simulate commerce policy response
  const policy_factors = {
    regulatory_framework: knobs.business_regulation_strictness * 0.25,
    market_competition: knobs.market_competition_promotion * 0.2,
    innovation_support: knobs.innovation_promotion_level * 0.2,
    trade_openness: knobs.trade_liberalization_level * 0.15,
    small_business_support: knobs.small_business_support_emphasis * 0.1,
    environmental_standards: knobs.environmental_business_standards * 0.1
  };
  
  const policy_effectiveness = Object.values(policy_factors).reduce((sum, factor) => sum + factor, 0);
  const economic_impact = policy_intensity * policy_effectiveness * market_impact_scope;
  const implementation_complexity = 1 - (knobs.business_environment_optimization * 0.3);
  
  res.json({
    scenario_analysis: {
      scenario_type,
      policy_intensity,
      market_impact_scope,
      implementation_timeline_months: implementation_timeline,
      estimated_cost: Math.round(50000000 + (policy_intensity * market_impact_scope * 500000000))
    },
    policy_response: {
      effectiveness_factors: policy_factors,
      overall_policy_effectiveness: policy_effectiveness,
      economic_impact_potential: economic_impact,
      implementation_complexity
    },
    commerce_approach: {
      regulatory_stance: knobs.business_regulation_strictness > 0.7 ? 'strict_regulation' : knobs.business_regulation_strictness < 0.3 ? 'light_regulation' : 'balanced_regulation',
      competition_emphasis: knobs.antitrust_enforcement_intensity > 0.7 ? 'aggressive_antitrust' : 'standard_competition_policy',
      innovation_focus: knobs.innovation_promotion_level > 0.6 ? 'innovation_driven' : 'traditional_commerce',
      trade_orientation: knobs.trade_liberalization_level > 0.7 ? 'free_trade_focused' : 'protectionist_leaning'
    },
    expected_outcomes: {
      business_environment_improvement: policy_effectiveness * 0.8,
      economic_growth_contribution: economic_impact * 0.9,
      market_competitiveness: (knobs.market_competition_promotion + knobs.innovation_promotion_level) / 2,
      long_term_sustainability: policy_effectiveness * knobs.environmental_business_standards
    }
  });
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
createEnhancedKnobEndpoints(router, 'commerce', commerceKnobSystem, applyCommerceKnobsToGameState);

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateCommerceStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured Commerce Department data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  res.json({
    commerce_influence: {
      economic_growth_contribution: commerceGameState.businessEnvironment.business_confidence,
      trade_competitiveness: commerceGameState.tradePolicy.trade_openness_index,
      innovation_ecosystem_strength: commerceGameState.innovationTechnology.innovation_index_score,
      market_competition_health: commerceGameState.competitionMarkets.market_competition_score
    },
    integration_points: {
      treasury_trade_coordination: commerceKnobs.trade_liberalization_level,
      justice_antitrust_coordination: commerceKnobs.antitrust_enforcement_intensity,
      state_trade_policy_coordination: commerceKnobs.international_trade_engagement,
      interior_environmental_coordination: commerceKnobs.environmental_business_standards
    },
    system_health: {
      overall_effectiveness: (
        commerceGameState.businessEnvironment.business_confidence +
        commerceGameState.tradePolicy.trade_openness_index +
        commerceGameState.innovationTechnology.innovation_index_score
      ) / 3,
      knobs_applied: { ...commerceKnobs }
    }
  });
});

module.exports = router;
