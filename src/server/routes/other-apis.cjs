// Multi-System Integration APIs - Cross-system coordination, visual assets, legal framework, and miscellaneous systems
const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const multiSystemKnobsData = {
  // Visual & Media Systems
  visual_content_generation: 0.7,        // AI can control visual content creation (0.0-1.0)
  media_quality_level: 0.6,              // AI can control media rendering quality (0.0-1.0)
  asset_caching_strategy: 0.8,           // AI can control asset caching efficiency (0.0-1.0)
  procedural_generation_intensity: 0.5,  // AI can control procedural content generation (0.0-1.0)
  
  // Legal & Regulatory Systems
  legal_framework_strictness: 0.6,       // AI can control legal system enforcement (0.0-1.0)
  regulatory_compliance_level: 0.7,      // AI can control regulatory oversight (0.0-1.0)
  judicial_independence: 0.8,            // AI can control court system independence (0.0-1.0)
  law_enforcement_efficiency: 0.6,       // AI can control law enforcement effectiveness (0.0-1.0)
  
  // Technology & Research Systems
  research_funding_allocation: 0.6,      // AI can control research investment (0.0-1.0)
  technology_adoption_rate: 0.5,         // AI can control tech adoption speed (0.0-1.0)
  innovation_encouragement: 0.7,         // AI can promote innovation (0.0-1.0)
  intellectual_property_protection: 0.6, // AI can control IP enforcement (0.0-1.0)
  
  // Cultural & Social Systems
  cultural_preservation: 0.7,            // AI can control cultural heritage protection (0.0-1.0)
  social_cohesion_promotion: 0.6,        // AI can promote social unity (0.0-1.0)
  diversity_inclusion_focus: 0.8,        // AI can control diversity initiatives (0.0-1.0)
  education_system_quality: 0.7,         // AI can control education effectiveness (0.0-1.0)
  
  // Infrastructure & Utilities
  infrastructure_maintenance: 0.6,       // AI can control infrastructure upkeep (0.0-1.0)
  utility_service_reliability: 0.8,      // AI can control utility system reliability (0.0-1.0)
  transportation_efficiency: 0.6,        // AI can optimize transportation systems (0.0-1.0)
  energy_grid_optimization: 0.7,         // AI can optimize energy distribution (0.0-1.0)
  
  // Environmental & Sustainability
  environmental_protection: 0.7,         // AI can control environmental policies (0.0-1.0)
  sustainability_initiatives: 0.6,       // AI can promote sustainability (0.0-1.0)
  resource_conservation: 0.5,            // AI can control resource conservation (0.0-1.0)
  pollution_control: 0.8,                // AI can control pollution management (0.0-1.0)
  
  // Emergency & Crisis Management
  emergency_response_readiness: 0.8,     // AI can control emergency preparedness (0.0-1.0)
  crisis_communication_efficiency: 0.7,  // AI can control crisis communications (0.0-1.0)
  disaster_recovery_speed: 0.6,          // AI can control recovery operations (0.0-1.0)
  public_safety_coordination: 0.8,       // AI can coordinate public safety (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const multiSystemKnobSystem = new EnhancedKnobSystem(multiSystemKnobsData);

// Backward compatibility - expose knobs directly
const multiSystemKnobs = multiSystemKnobSystem.knobs;

// Multi-system state tracking
const multiSystemState = {
  visualAssets: {
    totalAssets: 0,
    generatedContent: 0,
    cacheHitRate: 0.85,
    renderingQuality: 'medium'
  },
  legalSystem: {
    activeLaws: 0,
    courtCases: 0,
    complianceRate: 0.75,
    enforcementLevel: 'moderate'
  },
  technologySector: {
    activeProjects: 0,
    researchFunding: 0,
    adoptionRate: 0.6,
    innovationIndex: 0.7
  },
  culturalSystems: {
    culturalSites: 0,
    diversityIndex: 0.8,
    educationLevel: 0.7,
    socialCohesion: 0.6
  },
  infrastructure: {
    maintenanceLevel: 0.75,
    serviceReliability: 0.85,
    transportationEfficiency: 0.6,
    energyGridHealth: 0.8
  },
  environmental: {
    environmentalHealth: 0.7,
    sustainabilityScore: 0.6,
    resourceEfficiency: 0.5,
    pollutionLevel: 0.3
  },
  emergencyServices: {
    responseReadiness: 0.8,
    communicationEfficiency: 0.7,
    recoveryCapability: 0.6,
    publicSafetyLevel: 0.8
  }
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateMultiSystemStructuredOutputs() {
  return {
    // High-level multi-system metrics for AI decision-making
    system_metrics: {
      visual_system_health: calculateVisualSystemHealth(),
      legal_system_effectiveness: calculateLegalSystemEffectiveness(),
      technology_advancement: calculateTechnologyAdvancement(),
      cultural_vitality: calculateCulturalVitality(),
      infrastructure_quality: calculateInfrastructureQuality(),
      environmental_sustainability: calculateEnvironmentalSustainability(),
      emergency_preparedness: calculateEmergencyPreparedness()
    },
    
    // Multi-system analysis for AI strategic planning
    system_analysis: {
      cross_system_synergies: analyzeCrossSystemSynergies(),
      resource_allocation_efficiency: analyzeResourceAllocationEfficiency(),
      system_integration_level: analyzeSystemIntegrationLevel(),
      performance_bottlenecks: identifyMultiSystemBottlenecks(),
      optimization_opportunities: identifyMultiSystemOptimizations()
    },
    
    // System effectiveness assessment for AI feedback
    effectiveness_assessment: {
      visual_content_quality: assessVisualContentQuality(),
      legal_framework_strength: assessLegalFrameworkStrength(),
      technological_competitiveness: assessTechnologicalCompetitiveness(),
      cultural_resilience: assessCulturalResilience(),
      infrastructure_reliability: assessInfrastructureReliability(),
      environmental_health: assessEnvironmentalHealth(),
      crisis_management_capability: assessCrisisManagementCapability()
    },
    
    // Multi-system alerts and recommendations for AI attention
    ai_alerts: generateMultiSystemAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      visual_assets_availability: calculateVisualAssetsAvailability(),
      legal_compliance_requirements: calculateLegalComplianceRequirements(),
      technology_transfer_opportunities: calculateTechnologyTransferOpportunities(),
      cultural_exchange_potential: calculateCulturalExchangePotential(),
      infrastructure_capacity: calculateInfrastructureCapacity(),
      environmental_impact_data: calculateEnvironmentalImpactData(),
      emergency_coordination_status: calculateEmergencyCoordinationStatus()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...multiSystemKnobs }
  };
}

function setupOtherAPIs(app) {
  // Enhanced visual assets endpoint
  app.get('/api/visual/assets', (req, res) => {
    try {
      const { category, quality, format } = req.query;
      
      let assets = {
        totalAssets: multiSystemState.visualAssets.totalAssets,
        generatedContent: multiSystemState.visualAssets.generatedContent,
        cacheHitRate: multiSystemState.visualAssets.cacheHitRate,
        renderingQuality: multiSystemState.visualAssets.renderingQuality,
        availableCategories: ['characters', 'planets', 'ships', 'cities', 'landscapes'],
        supportedFormats: ['png', 'jpg', 'webp', 'svg', 'mp4', 'webm']
      };
      
      if (category) {
        assets.categoryAssets = Math.floor(Math.random() * 100) + 50;
      }
      
      res.json({
        success: true,
        data: assets,
        visualGenerationLevel: multiSystemKnobs.visual_content_generation,
        qualityLevel: multiSystemKnobs.media_quality_level
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get visual assets',
        details: error.message
      });
    }
  });

  // Enhanced legal system endpoint
  app.get('/api/legal/laws', (req, res) => {
    try {
      const { category, status, jurisdiction } = req.query;
      
      let legalData = {
        activeLaws: multiSystemState.legalSystem.activeLaws,
        courtCases: multiSystemState.legalSystem.courtCases,
        complianceRate: multiSystemState.legalSystem.complianceRate,
        enforcementLevel: multiSystemState.legalSystem.enforcementLevel,
        legalCategories: ['constitutional', 'civil', 'criminal', 'commercial', 'environmental', 'interplanetary'],
        jurisdictions: ['local', 'planetary', 'system', 'galactic']
      };
      
      res.json({
        success: true,
        data: legalData,
        legalStrictness: multiSystemKnobs.legal_framework_strictness,
        complianceLevel: multiSystemKnobs.regulatory_compliance_level
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get legal data',
        details: error.message
      });
    }
  });

  // Technology and research endpoint
  app.get('/api/technology/research', (req, res) => {
    try {
      const { field, status, priority } = req.query;
      
      let techData = {
        activeProjects: multiSystemState.technologySector.activeProjects,
        researchFunding: multiSystemState.technologySector.researchFunding,
        adoptionRate: multiSystemState.technologySector.adoptionRate,
        innovationIndex: multiSystemState.technologySector.innovationIndex,
        researchFields: ['energy', 'transportation', 'communication', 'medicine', 'agriculture', 'defense', 'space'],
        technologyLevels: ['experimental', 'prototype', 'testing', 'deployment', 'widespread']
      };
      
      res.json({
        success: true,
        data: techData,
        fundingAllocation: multiSystemKnobs.research_funding_allocation,
        adoptionRate: multiSystemKnobs.technology_adoption_rate,
        innovationLevel: multiSystemKnobs.innovation_encouragement
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get technology data',
        details: error.message
      });
    }
  });

  // Cultural systems endpoint
  app.get('/api/cultural/systems', (req, res) => {
    try {
      const { type, region, status } = req.query;
      
      let culturalData = {
        culturalSites: multiSystemState.culturalSystems.culturalSites,
        diversityIndex: multiSystemState.culturalSystems.diversityIndex,
        educationLevel: multiSystemState.culturalSystems.educationLevel,
        socialCohesion: multiSystemState.culturalSystems.socialCohesion,
        culturalTypes: ['historical', 'artistic', 'religious', 'educational', 'recreational'],
        preservationPrograms: ['heritage_sites', 'language_preservation', 'traditional_arts', 'cultural_exchange']
      };
      
      res.json({
        success: true,
        data: culturalData,
        preservationLevel: multiSystemKnobs.cultural_preservation,
        cohesionPromotion: multiSystemKnobs.social_cohesion_promotion,
        diversityFocus: multiSystemKnobs.diversity_inclusion_focus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get cultural data',
        details: error.message
      });
    }
  });

  // Infrastructure systems endpoint
  app.get('/api/infrastructure/status', (req, res) => {
    try {
      const { system, region, priority } = req.query;
      
      let infrastructureData = {
        maintenanceLevel: multiSystemState.infrastructure.maintenanceLevel,
        serviceReliability: multiSystemState.infrastructure.serviceReliability,
        transportationEfficiency: multiSystemState.infrastructure.transportationEfficiency,
        energyGridHealth: multiSystemState.infrastructure.energyGridHealth,
        infrastructureSystems: ['transportation', 'energy', 'water', 'waste', 'communications', 'healthcare'],
        maintenanceSchedule: ['routine', 'preventive', 'emergency', 'upgrade']
      };
      
      res.json({
        success: true,
        data: infrastructureData,
        maintenanceLevel: multiSystemKnobs.infrastructure_maintenance,
        serviceReliability: multiSystemKnobs.utility_service_reliability,
        transportationEfficiency: multiSystemKnobs.transportation_efficiency
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get infrastructure data',
        details: error.message
      });
    }
  });

  // Environmental systems endpoint
  app.get('/api/environmental/status', (req, res) => {
    try {
      const { metric, region, timeframe } = req.query;
      
      let environmentalData = {
        environmentalHealth: multiSystemState.environmental.environmentalHealth,
        sustainabilityScore: multiSystemState.environmental.sustainabilityScore,
        resourceEfficiency: multiSystemState.environmental.resourceEfficiency,
        pollutionLevel: multiSystemState.environmental.pollutionLevel,
        environmentalMetrics: ['air_quality', 'water_quality', 'soil_health', 'biodiversity', 'climate_stability'],
        sustainabilityPrograms: ['renewable_energy', 'waste_reduction', 'conservation', 'restoration']
      };
      
      res.json({
        success: true,
        data: environmentalData,
        protectionLevel: multiSystemKnobs.environmental_protection,
        sustainabilityFocus: multiSystemKnobs.sustainability_initiatives,
        pollutionControl: multiSystemKnobs.pollution_control
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get environmental data',
        details: error.message
      });
    }
  });

  // Emergency services endpoint
  app.get('/api/emergency/status', (req, res) => {
    try {
      const { service, region, alert_level } = req.query;
      
      let emergencyData = {
        responseReadiness: multiSystemState.emergencyServices.responseReadiness,
        communicationEfficiency: multiSystemState.emergencyServices.communicationEfficiency,
        recoveryCapability: multiSystemState.emergencyServices.recoveryCapability,
        publicSafetyLevel: multiSystemState.emergencyServices.publicSafetyLevel,
        emergencyServices: ['fire', 'medical', 'police', 'disaster_response', 'search_rescue'],
        alertLevels: ['green', 'yellow', 'orange', 'red', 'critical']
      };
      
      res.json({
        success: true,
        data: emergencyData,
        responseReadiness: multiSystemKnobs.emergency_response_readiness,
        communicationEfficiency: multiSystemKnobs.crisis_communication_efficiency,
        recoverySpeed: multiSystemKnobs.disaster_recovery_speed
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get emergency data',
        details: error.message
      });
    }
  });

  // Helper functions for multi-system structured outputs (streamlined)
  function calculateVisualSystemHealth() {
    const contentGeneration = multiSystemKnobs.visual_content_generation;
    const qualityLevel = multiSystemKnobs.media_quality_level;
    const cachingStrategy = multiSystemKnobs.asset_caching_strategy;
    const proceduralIntensity = multiSystemKnobs.procedural_generation_intensity;
    return (contentGeneration + qualityLevel + cachingStrategy + proceduralIntensity) / 4;
  }

  function calculateLegalSystemEffectiveness() {
    const frameworkStrictness = multiSystemKnobs.legal_framework_strictness;
    const complianceLevel = multiSystemKnobs.regulatory_compliance_level;
    const judicialIndependence = multiSystemKnobs.judicial_independence;
    const enforcementEfficiency = multiSystemKnobs.law_enforcement_efficiency;
    return (frameworkStrictness + complianceLevel + judicialIndependence + enforcementEfficiency) / 4;
  }

  function calculateTechnologyAdvancement() {
    const fundingAllocation = multiSystemKnobs.research_funding_allocation;
    const adoptionRate = multiSystemKnobs.technology_adoption_rate;
    const innovationEncouragement = multiSystemKnobs.innovation_encouragement;
    const ipProtection = multiSystemKnobs.intellectual_property_protection;
    return (fundingAllocation + adoptionRate + innovationEncouragement + ipProtection) / 4;
  }

  function calculateCulturalVitality() {
    const culturalPreservation = multiSystemKnobs.cultural_preservation;
    const socialCohesion = multiSystemKnobs.social_cohesion_promotion;
    const diversityFocus = multiSystemKnobs.diversity_inclusion_focus;
    const educationQuality = multiSystemKnobs.education_system_quality;
    return (culturalPreservation + socialCohesion + diversityFocus + educationQuality) / 4;
  }

  function calculateInfrastructureQuality() {
    const maintenance = multiSystemKnobs.infrastructure_maintenance;
    const serviceReliability = multiSystemKnobs.utility_service_reliability;
    const transportationEff = multiSystemKnobs.transportation_efficiency;
    const energyOptimization = multiSystemKnobs.energy_grid_optimization;
    return (maintenance + serviceReliability + transportationEff + energyOptimization) / 4;
  }

  function calculateEnvironmentalSustainability() {
    const envProtection = multiSystemKnobs.environmental_protection;
    const sustainabilityInit = multiSystemKnobs.sustainability_initiatives;
    const resourceConservation = multiSystemKnobs.resource_conservation;
    const pollutionControl = multiSystemKnobs.pollution_control;
    return (envProtection + sustainabilityInit + resourceConservation + pollutionControl) / 4;
  }

  function calculateEmergencyPreparedness() {
    const responseReadiness = multiSystemKnobs.emergency_response_readiness;
    const crisisComm = multiSystemKnobs.crisis_communication_efficiency;
    const recoverySpeed = multiSystemKnobs.disaster_recovery_speed;
    const publicSafety = multiSystemKnobs.public_safety_coordination;
    return (responseReadiness + crisisComm + recoverySpeed + publicSafety) / 4;
  }

  function analyzeCrossSystemSynergies() {
    const visualHealth = calculateVisualSystemHealth();
    const legalEffectiveness = calculateLegalSystemEffectiveness();
    const techAdvancement = calculateTechnologyAdvancement();
    const culturalVitality = calculateCulturalVitality();
    const infraQuality = calculateInfrastructureQuality();
    const envSustainability = calculateEnvironmentalSustainability();
    const emergencyPrep = calculateEmergencyPreparedness();
    
    const avgSystemHealth = (visualHealth + legalEffectiveness + techAdvancement + culturalVitality + infraQuality + envSustainability + emergencyPrep) / 7;
    const synergyStrength = avgSystemHealth * 0.9 + 0.1; // High synergy when all systems are healthy
    
    return { 
      synergy_strength: synergyStrength, 
      system_balance: 1 - Math.abs(avgSystemHealth - 0.7), // Optimal around 0.7
      cross_system_coordination: avgSystemHealth
    };
  }

  function analyzeResourceAllocationEfficiency() {
    const researchFunding = multiSystemKnobs.research_funding_allocation;
    const infraMaintenance = multiSystemKnobs.infrastructure_maintenance;
    const envProtection = multiSystemKnobs.environmental_protection;
    const emergencyReadiness = multiSystemKnobs.emergency_response_readiness;
    
    const allocationBalance = 1 - Math.abs((researchFunding + infraMaintenance + envProtection + emergencyReadiness) / 4 - 0.65);
    return { 
      allocation_efficiency: allocationBalance, 
      research_investment: researchFunding,
      infrastructure_investment: infraMaintenance,
      environmental_investment: envProtection,
      emergency_investment: emergencyReadiness
    };
  }

  function analyzeSystemIntegrationLevel() {
    const systemCount = 7; // Visual, Legal, Tech, Cultural, Infrastructure, Environmental, Emergency
    const avgKnobValue = Object.values(multiSystemKnobs).filter(v => typeof v === 'number').reduce((sum, val) => sum + val, 0) / 24;
    const integrationLevel = avgKnobValue * 0.9 + 0.1;
    
    return {
      integration_level: integrationLevel,
      system_count: systemCount,
      coordination_strength: avgKnobValue,
      integration_balance: 1 - Math.abs(avgKnobValue - 0.65) // Optimal around 0.65
    };
  }

  function identifyMultiSystemBottlenecks() {
    const bottlenecks = [];
    
    // Check each system for low performance
    if (calculateVisualSystemHealth() < 0.4) bottlenecks.push('visual_system_performance');
    if (calculateLegalSystemEffectiveness() < 0.4) bottlenecks.push('legal_system_effectiveness');
    if (calculateTechnologyAdvancement() < 0.4) bottlenecks.push('technology_advancement');
    if (calculateCulturalVitality() < 0.4) bottlenecks.push('cultural_vitality');
    if (calculateInfrastructureQuality() < 0.4) bottlenecks.push('infrastructure_quality');
    if (calculateEnvironmentalSustainability() < 0.4) bottlenecks.push('environmental_sustainability');
    if (calculateEmergencyPreparedness() < 0.4) bottlenecks.push('emergency_preparedness');
    
    // Check for resource allocation issues
    const resourceEff = analyzeResourceAllocationEfficiency();
    if (resourceEff.allocation_efficiency < 0.5) bottlenecks.push('resource_allocation_imbalance');
    
    return bottlenecks;
  }

  function identifyMultiSystemOptimizations() {
    const optimizations = [];
    
    // Visual system optimizations
    if (multiSystemKnobs.visual_content_generation < 0.6) {
      optimizations.push({ type: 'visual_content_boost', priority: 'medium', potential_gain: 0.2 });
    }
    
    // Legal system optimizations
    if (multiSystemKnobs.legal_framework_strictness < 0.5) {
      optimizations.push({ type: 'legal_framework_strengthening', priority: 'high', potential_gain: 0.3 });
    }
    
    // Technology optimizations
    if (multiSystemKnobs.research_funding_allocation < 0.6) {
      optimizations.push({ type: 'research_investment_increase', priority: 'high', potential_gain: 0.4 });
    }
    
    // Infrastructure optimizations
    if (multiSystemKnobs.infrastructure_maintenance < 0.6) {
      optimizations.push({ type: 'infrastructure_maintenance_boost', priority: 'high', potential_gain: 0.3 });
    }
    
    // Environmental optimizations
    if (multiSystemKnobs.environmental_protection < 0.7) {
      optimizations.push({ type: 'environmental_protection_enhancement', priority: 'medium', potential_gain: 0.25 });
    }
    
    return optimizations;
  }

  function assessVisualContentQuality() {
    const contentGeneration = multiSystemKnobs.visual_content_generation;
    const qualityLevel = multiSystemKnobs.media_quality_level;
    const proceduralIntensity = multiSystemKnobs.procedural_generation_intensity;
    const quality = (contentGeneration + qualityLevel + proceduralIntensity) / 3;
    return { quality_score: quality, content_generation: contentGeneration, media_quality: qualityLevel };
  }

  function assessLegalFrameworkStrength() {
    const strictness = multiSystemKnobs.legal_framework_strictness;
    const compliance = multiSystemKnobs.regulatory_compliance_level;
    const independence = multiSystemKnobs.judicial_independence;
    const enforcement = multiSystemKnobs.law_enforcement_efficiency;
    const strength = (strictness + compliance + independence + enforcement) / 4;
    return { framework_strength: strength, judicial_independence: independence, enforcement_capability: enforcement };
  }

  function assessTechnologicalCompetitiveness() {
    const funding = multiSystemKnobs.research_funding_allocation;
    const adoption = multiSystemKnobs.technology_adoption_rate;
    const innovation = multiSystemKnobs.innovation_encouragement;
    const competitiveness = (funding + adoption + innovation) / 3;
    return { competitiveness_score: competitiveness, innovation_level: innovation, adoption_speed: adoption };
  }

  function assessCulturalResilience() {
    const preservation = multiSystemKnobs.cultural_preservation;
    const cohesion = multiSystemKnobs.social_cohesion_promotion;
    const diversity = multiSystemKnobs.diversity_inclusion_focus;
    const education = multiSystemKnobs.education_system_quality;
    const resilience = (preservation + cohesion + diversity + education) / 4;
    return { resilience_score: resilience, cultural_preservation: preservation, social_cohesion: cohesion };
  }

  function assessInfrastructureReliability() {
    const maintenance = multiSystemKnobs.infrastructure_maintenance;
    const serviceReliability = multiSystemKnobs.utility_service_reliability;
    const transportation = multiSystemKnobs.transportation_efficiency;
    const energy = multiSystemKnobs.energy_grid_optimization;
    const reliability = (maintenance + serviceReliability + transportation + energy) / 4;
    return { reliability_score: reliability, service_reliability: serviceReliability, energy_efficiency: energy };
  }

  function assessEnvironmentalHealth() {
    const protection = multiSystemKnobs.environmental_protection;
    const sustainability = multiSystemKnobs.sustainability_initiatives;
    const conservation = multiSystemKnobs.resource_conservation;
    const pollution = multiSystemKnobs.pollution_control;
    const health = (protection + sustainability + conservation + pollution) / 4;
    return { health_score: health, protection_level: protection, sustainability_focus: sustainability };
  }

  function assessCrisisManagementCapability() {
    const readiness = multiSystemKnobs.emergency_response_readiness;
    const communication = multiSystemKnobs.crisis_communication_efficiency;
    const recovery = multiSystemKnobs.disaster_recovery_speed;
    const coordination = multiSystemKnobs.public_safety_coordination;
    const capability = (readiness + communication + recovery + coordination) / 4;
    return { capability_score: capability, response_readiness: readiness, recovery_speed: recovery };
  }

  function generateMultiSystemAIAlerts() {
    const alerts = [];
    
    // Visual system alerts
    const visualHealth = calculateVisualSystemHealth();
    if (visualHealth < 0.4) {
      alerts.push({ type: 'visual_system_degradation', severity: 'medium', message: 'Visual content generation systems need attention' });
    }
    
    // Legal system alerts
    const legalEffectiveness = calculateLegalSystemEffectiveness();
    if (legalEffectiveness < 0.4) {
      alerts.push({ type: 'legal_system_weakness', severity: 'high', message: 'Legal framework effectiveness is critically low' });
    }
    
    // Technology alerts
    const techAdvancement = calculateTechnologyAdvancement();
    if (techAdvancement < 0.4) {
      alerts.push({ type: 'technology_stagnation', severity: 'high', message: 'Technology advancement is falling behind' });
    }
    
    // Infrastructure alerts
    const infraQuality = calculateInfrastructureQuality();
    if (infraQuality < 0.4) {
      alerts.push({ type: 'infrastructure_deterioration', severity: 'high', message: 'Infrastructure systems require immediate attention' });
    }
    
    // Environmental alerts
    const envSustainability = calculateEnvironmentalSustainability();
    if (envSustainability < 0.4) {
      alerts.push({ type: 'environmental_crisis', severity: 'critical', message: 'Environmental sustainability is at critical levels' });
    }
    
    // Emergency preparedness alerts
    const emergencyPrep = calculateEmergencyPreparedness();
    if (emergencyPrep < 0.5) {
      alerts.push({ type: 'emergency_unpreparedness', severity: 'high', message: 'Emergency response systems are inadequately prepared' });
    }
    
    return alerts;
  }

  function calculateVisualAssetsAvailability() {
    const contentGeneration = multiSystemKnobs.visual_content_generation;
    const qualityLevel = multiSystemKnobs.media_quality_level;
    const cachingStrategy = multiSystemKnobs.asset_caching_strategy;
    const availability = (contentGeneration + qualityLevel + cachingStrategy) / 3;
    return { 
      availability_score: availability, 
      asset_generation_rate: contentGeneration,
      cache_efficiency: cachingStrategy,
      quality_level: qualityLevel
    };
  }

  function calculateLegalComplianceRequirements() {
    const strictness = multiSystemKnobs.legal_framework_strictness;
    const compliance = multiSystemKnobs.regulatory_compliance_level;
    const enforcement = multiSystemKnobs.law_enforcement_efficiency;
    const requirements = (strictness + compliance + enforcement) / 3;
    return {
      compliance_requirements: requirements,
      framework_strictness: strictness,
      enforcement_level: enforcement,
      regulatory_oversight: compliance
    };
  }

  function calculateTechnologyTransferOpportunities() {
    const funding = multiSystemKnobs.research_funding_allocation;
    const adoption = multiSystemKnobs.technology_adoption_rate;
    const innovation = multiSystemKnobs.innovation_encouragement;
    const ipProtection = multiSystemKnobs.intellectual_property_protection;
    const opportunities = (funding + adoption + innovation + ipProtection) / 4;
    return {
      transfer_opportunities: opportunities,
      research_capacity: funding,
      adoption_readiness: adoption,
      innovation_potential: innovation,
      ip_framework: ipProtection
    };
  }

  function calculateCulturalExchangePotential() {
    const preservation = multiSystemKnobs.cultural_preservation;
    const cohesion = multiSystemKnobs.social_cohesion_promotion;
    const diversity = multiSystemKnobs.diversity_inclusion_focus;
    const education = multiSystemKnobs.education_system_quality;
    const potential = (preservation + cohesion + diversity + education) / 4;
    return {
      exchange_potential: potential,
      cultural_openness: diversity,
      social_stability: cohesion,
      educational_foundation: education
    };
  }

  function calculateInfrastructureCapacity() {
    const maintenance = multiSystemKnobs.infrastructure_maintenance;
    const reliability = multiSystemKnobs.utility_service_reliability;
    const transportation = multiSystemKnobs.transportation_efficiency;
    const energy = multiSystemKnobs.energy_grid_optimization;
    const capacity = (maintenance + reliability + transportation + energy) / 4;
    return {
      infrastructure_capacity: capacity,
      maintenance_level: maintenance,
      service_reliability: reliability,
      transport_efficiency: transportation,
      energy_optimization: energy
    };
  }

  function calculateEnvironmentalImpactData() {
    const protection = multiSystemKnobs.environmental_protection;
    const sustainability = multiSystemKnobs.sustainability_initiatives;
    const conservation = multiSystemKnobs.resource_conservation;
    const pollution = multiSystemKnobs.pollution_control;
    const impact = (protection + sustainability + conservation + pollution) / 4;
    return {
      environmental_impact: 1 - impact, // Lower impact is better
      protection_level: protection,
      sustainability_score: sustainability,
      conservation_efforts: conservation,
      pollution_management: pollution
    };
  }

  function calculateEmergencyCoordinationStatus() {
    const readiness = multiSystemKnobs.emergency_response_readiness;
    const communication = multiSystemKnobs.crisis_communication_efficiency;
    const recovery = multiSystemKnobs.disaster_recovery_speed;
    const coordination = multiSystemKnobs.public_safety_coordination;
    const status = (readiness + communication + recovery + coordination) / 4;
    return {
      coordination_status: status,
      response_readiness: readiness,
      communication_efficiency: communication,
      recovery_capability: recovery,
      safety_coordination: coordination
    };
  }

  // Apply AI knobs to actual multi-system state
  function applyMultiSystemKnobsToGameState() {
    // Apply visual system knobs
    const visualGeneration = multiSystemKnobs.visual_content_generation;
    multiSystemState.visualAssets.generatedContent = Math.floor(visualGeneration * 1000);
    multiSystemState.visualAssets.renderingQuality = visualGeneration > 0.7 ? 'high' : visualGeneration > 0.4 ? 'medium' : 'low';
    
    // Apply legal system knobs
    const legalStrictness = multiSystemKnobs.legal_framework_strictness;
    multiSystemState.legalSystem.enforcementLevel = legalStrictness > 0.7 ? 'strict' : legalStrictness > 0.4 ? 'moderate' : 'lenient';
    multiSystemState.legalSystem.complianceRate = multiSystemKnobs.regulatory_compliance_level * 0.9 + 0.1;
    
    // Apply technology system knobs
    const researchFunding = multiSystemKnobs.research_funding_allocation;
    multiSystemState.technologySector.researchFunding = researchFunding * 1000000; // Scale to millions
    multiSystemState.technologySector.adoptionRate = multiSystemKnobs.technology_adoption_rate;
    multiSystemState.technologySector.innovationIndex = multiSystemKnobs.innovation_encouragement;
    
    // Apply cultural system knobs
    const culturalPreservation = multiSystemKnobs.cultural_preservation;
    multiSystemState.culturalSystems.diversityIndex = multiSystemKnobs.diversity_inclusion_focus;
    multiSystemState.culturalSystems.educationLevel = multiSystemKnobs.education_system_quality;
    multiSystemState.culturalSystems.socialCohesion = multiSystemKnobs.social_cohesion_promotion;
    
    // Apply infrastructure knobs
    const infraMaintenance = multiSystemKnobs.infrastructure_maintenance;
    multiSystemState.infrastructure.maintenanceLevel = infraMaintenance;
    multiSystemState.infrastructure.serviceReliability = multiSystemKnobs.utility_service_reliability;
    multiSystemState.infrastructure.transportationEfficiency = multiSystemKnobs.transportation_efficiency;
    multiSystemState.infrastructure.energyGridHealth = multiSystemKnobs.energy_grid_optimization;
    
    // Apply environmental knobs
    const envProtection = multiSystemKnobs.environmental_protection;
    multiSystemState.environmental.environmentalHealth = envProtection;
    multiSystemState.environmental.sustainabilityScore = multiSystemKnobs.sustainability_initiatives;
    multiSystemState.environmental.resourceEfficiency = multiSystemKnobs.resource_conservation;
    multiSystemState.environmental.pollutionLevel = 1 - multiSystemKnobs.pollution_control; // Inverse relationship
    
    // Apply emergency services knobs
    const emergencyReadiness = multiSystemKnobs.emergency_response_readiness;
    multiSystemState.emergencyServices.responseReadiness = emergencyReadiness;
    multiSystemState.emergencyServices.communicationEfficiency = multiSystemKnobs.crisis_communication_efficiency;
    multiSystemState.emergencyServices.recoveryCapability = multiSystemKnobs.disaster_recovery_speed;
    multiSystemState.emergencyServices.publicSafetyLevel = multiSystemKnobs.public_safety_coordination;
    
    console.log('🎛️ Multi-System knobs applied to game state:', {
      visual_generation: multiSystemKnobs.visual_content_generation,
      legal_strictness: multiSystemKnobs.legal_framework_strictness,
      research_funding: multiSystemKnobs.research_funding_allocation,
      cultural_preservation: multiSystemKnobs.cultural_preservation,
      infrastructure_maintenance: multiSystemKnobs.infrastructure_maintenance,
      environmental_protection: multiSystemKnobs.environmental_protection,
      emergency_readiness: multiSystemKnobs.emergency_response_readiness
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====

  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/multi-system/knobs', (req, res) => {
    const knobData = multiSystemKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'multi-system',
      description: 'AI-adjustable parameters for multi-system with enhanced input support',
      input_help: multiSystemKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/multi-system/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: multiSystemKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = multiSystemKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyMultiSystemKnobsToGameState();
    } catch (error) {
      console.error('Error applying multi-system knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'multi-system',
      ...updateResult,
      message: 'Multi-system knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/multi-system/knobs/help', (req, res) => {
    res.json({
      system: 'multi-system',
      help: multiSystemKnobSystem.getKnobDescriptions(),
      current_values: multiSystemKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/multi-system/ai-data', (req, res) => {
    const structuredData = generateMultiSystemStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured multi-system data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/multi-system/cross-system', (req, res) => {
    const outputs = generateMultiSystemStructuredOutputs();
    res.json({
      visual_data: outputs.cross_system_data.visual_assets_availability,
      legal_data: outputs.cross_system_data.legal_compliance_requirements,
      technology_data: outputs.cross_system_data.technology_transfer_opportunities,
      cultural_data: outputs.cross_system_data.cultural_exchange_potential,
      infrastructure_data: outputs.cross_system_data.infrastructure_capacity,
      environmental_data: outputs.cross_system_data.environmental_impact_data,
      emergency_data: outputs.cross_system_data.emergency_coordination_status,
      system_summary: outputs.system_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupOtherAPIs };
