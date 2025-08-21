/**
 * Demographics API Routes
 * 
 * REST API endpoints for the Demographics & Lifecycle Systems
 */

import express from 'express';
import { DemographicsEngine } from './DemographicsEngine.js';
import { DemographicsAnalytics } from './DemographicsAnalytics.js';
import {
  CasualtyType,
  CasualtyCause,
  PlunderType,
  TransitionType,
  CasualtyRecord,
  InjuryType,
  InjurySeverity,
  CasualtyOutcome
} from './types.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();
const demographicsEngine = new DemographicsEngine();
const demographicsAnalytics = new DemographicsAnalytics();

// Enhanced AI Knobs for Demographics System
const demographicsKnobsData = {
  // Population Health & Mortality
  baseline_mortality_rate: 0.3,         // Baseline population mortality rate
  disease_outbreak_frequency: 0.2,      // Disease outbreak frequency and severity
  healthcare_system_effectiveness: 0.8, // Healthcare system effectiveness and coverage
  
  // Life Expectancy & Aging
  life_expectancy_improvement_rate: 0.6, // Life expectancy improvement rate
  aging_population_support: 0.7,        // Aging population care and support systems
  geriatric_healthcare_quality: 0.8,    // Geriatric and elderly healthcare quality
  
  // Birth Rates & Fertility
  fertility_rate_factors: 0.6,          // Fertility rate influencing factors
  family_planning_accessibility: 0.8,   // Family planning services accessibility
  reproductive_health_programs: 0.8,    // Reproductive health program quality
  
  // Child & Youth Demographics
  child_mortality_prevention: 0.9,      // Child mortality prevention programs
  youth_development_programs: 0.7,      // Youth development and education programs
  pediatric_healthcare_quality: 0.9,    // Pediatric healthcare quality and access
  
  // Population Distribution & Mobility
  urban_rural_migration_patterns: 0.5,  // Urban-rural migration pattern influence
  internal_mobility_freedom: 0.8,       // Internal population mobility freedom
  regional_development_balance: 0.6,     // Regional development balance and equity
  
  // Social Demographics
  gender_equality_level: 0.8,           // Gender equality and representation level
  social_mobility_opportunities: 0.6,   // Social mobility and opportunity access
  minority_integration_support: 0.7,    // Minority group integration and support
  
  // Economic Demographics
  employment_demographic_patterns: 0.7, // Employment patterns across demographics
  income_inequality_management: 0.6,    // Income inequality management and reduction
  poverty_reduction_effectiveness: 0.7, // Poverty reduction program effectiveness
  
  // Education & Human Development
  education_access_universality: 0.9,   // Universal education access and quality
  literacy_improvement_programs: 0.8,   // Literacy and basic education programs
  skill_development_opportunities: 0.7, // Skill development and training opportunities
  
  // Cultural & Ethnic Demographics
  cultural_diversity_preservation: 0.8, // Cultural diversity preservation and support
  ethnic_harmony_promotion: 0.8,        // Ethnic harmony and integration promotion
  indigenous_population_support: 0.7,   // Indigenous population rights and support
  
  // Demographic Data & Analytics
  census_accuracy_and_frequency: 0.9,   // Census data accuracy and collection frequency
  demographic_research_investment: 0.7, // Demographic research and analysis investment
  population_forecasting_capability: 0.8, // Population forecasting and planning capability
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Demographics
const demographicsKnobSystem = new EnhancedKnobSystem(demographicsKnobsData);

// Apply demographics knobs to game state
function applyDemographicsKnobsToGameState() {
  const knobs = demographicsKnobSystem.knobs;
  
  // Apply population health settings
  const populationHealth = (knobs.baseline_mortality_rate + knobs.disease_outbreak_frequency + 
    knobs.healthcare_system_effectiveness) / 3;
  
  // Apply life expectancy settings
  const lifeExpectancy = (knobs.life_expectancy_improvement_rate + knobs.aging_population_support + 
    knobs.geriatric_healthcare_quality) / 3;
  
  // Apply birth rate settings
  const birthRates = (knobs.fertility_rate_factors + knobs.family_planning_accessibility + 
    knobs.reproductive_health_programs) / 3;
  
  // Apply child and youth settings
  const childYouthDemographics = (knobs.child_mortality_prevention + knobs.youth_development_programs + 
    knobs.pediatric_healthcare_quality) / 3;
  
  // Apply social demographics settings
  const socialDemographics = (knobs.gender_equality_level + knobs.social_mobility_opportunities + 
    knobs.minority_integration_support) / 3;
  
  // Apply demographic analytics settings
  const demographicAnalytics = (knobs.census_accuracy_and_frequency + knobs.demographic_research_investment + 
    knobs.population_forecasting_capability) / 3;
  
  console.log('Applied demographics knobs to game state:', {
    populationHealth,
    lifeExpectancy,
    birthRates,
    childYouthDemographics,
    socialDemographics,
    demographicAnalytics
  });
}

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'demographics',
    timestamp: new Date().toISOString(),
    population: demographicsEngine.getCurrentPopulation(),
    casualtyEvents: demographicsEngine.getCasualtyEvents().length,
    plunderEvents: demographicsEngine.getPlunderEvents().length
  });
});

// ===== LIFESPAN MANAGEMENT =====
router.get('/lifespan', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    res.json({
      success: true,
      data: {
        totalProfiles: profiles.length,
        profiles: profiles.slice(0, 50), // Limit for performance
        summary: {
          averageAge: profiles.reduce((sum, p) => sum + p.currentAge, 0) / Math.max(1, profiles.length),
          averageLifeExpectancy: profiles.reduce((sum, p) => sum + p.lifeExpectancy, 0) / Math.max(1, profiles.length),
          averageMortalityRisk: profiles.reduce((sum, p) => sum + p.mortalityRisk, 0) / Math.max(1, profiles.length),
          lifeStageDistribution: profiles.reduce((acc, p) => {
            acc[p.lifeStage] = (acc[p.lifeStage] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve lifespan data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/lifespan/create', (req, res) => {
  try {
    const { citizenId, birthDate } = req.body;
    
    if (!citizenId || !birthDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: citizenId, birthDate'
      });
    }

    const profile = demographicsEngine.createLifespanProfile(citizenId, new Date(birthDate));
    
    res.json({
      success: true,
      data: profile,
      message: 'Lifespan profile created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create lifespan profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/lifespan/:citizenId', (req, res) => {
  try {
    const { citizenId } = req.params;
    const profile = demographicsEngine.getLifespanProfile(citizenId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Lifespan profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve lifespan profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/lifespan/:citizenId/update', (req, res) => {
  try {
    const { citizenId } = req.params;
    const updatedProfile = demographicsEngine.updateLifespanProfile(citizenId);
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        error: 'Lifespan profile not found'
      });
    }

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Lifespan profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update lifespan profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/lifespan/:citizenId/death', (req, res) => {
  try {
    const { citizenId } = req.params;
    const { cause } = req.body;
    
    if (!cause) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: cause'
      });
    }

    demographicsEngine.recordDeath(citizenId, cause);
    
    res.json({
      success: true,
      message: 'Death recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record death',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== CASUALTY MANAGEMENT =====
router.get('/casualties', (req, res) => {
  try {
    const casualtyEvents = demographicsEngine.getCasualtyEvents();
    const totalCasualties = casualtyEvents.reduce((sum, event) => sum + event.casualties.length, 0);
    
    res.json({
      success: true,
      data: {
        totalEvents: casualtyEvents.length,
        totalCasualties,
        events: casualtyEvents.slice(-20), // Last 20 events
        summary: {
          byType: casualtyEvents.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + event.casualties.length;
            return acc;
          }, {} as Record<CasualtyType, number>),
          byCause: casualtyEvents.reduce((acc, event) => {
            acc[event.cause] = (acc[event.cause] || 0) + event.casualties.length;
            return acc;
          }, {} as Record<CasualtyCause, number>),
          averageResponseTime: casualtyEvents.reduce((sum, event) => sum + event.responseTime, 0) / Math.max(1, casualtyEvents.length)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve casualty data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/casualties/record', (req, res) => {
  try {
    const { type, cause, location, casualties } = req.body;
    
    if (!type || !cause || !location || !casualties) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, cause, location, casualties'
      });
    }

    // Validate casualty records
    const validatedCasualties: CasualtyRecord[] = casualties.map((casualty: any) => ({
      citizenId: casualty.citizenId,
      outcome: casualty.outcome as CasualtyOutcome,
      injuryType: casualty.injuryType as InjuryType,
      severity: casualty.severity as InjurySeverity,
      treatmentRequired: casualty.treatmentRequired || false,
      recoveryTime: casualty.recoveryTime || 0,
      permanentDisability: casualty.permanentDisability || false,
      economicLoss: casualty.economicLoss || 0
    }));

    const casualtyEvent = demographicsEngine.recordCasualtyEvent(
      type as CasualtyType,
      cause as CasualtyCause,
      location,
      validatedCasualties
    );
    
    res.json({
      success: true,
      data: casualtyEvent,
      message: 'Casualty event recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record casualty event',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PLUNDER MANAGEMENT =====
router.get('/plunder', (req, res) => {
  try {
    const plunderEvents = demographicsEngine.getPlunderEvents();
    const totalValue = plunderEvents.reduce((sum, event) => sum + event.totalValue, 0);
    
    res.json({
      success: true,
      data: {
        totalEvents: plunderEvents.length,
        totalValue,
        events: plunderEvents.slice(-20), // Last 20 events
        summary: {
          byType: plunderEvents.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + event.totalValue;
            return acc;
          }, {} as Record<PlunderType, number>),
          averageValue: totalValue / Math.max(1, plunderEvents.length),
          topSources: plunderEvents.reduce((acc, event) => {
            acc[event.source] = (acc[event.source] || 0) + event.totalValue;
            return acc;
          }, {} as Record<string, number>)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plunder data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/plunder/record', (req, res) => {
  try {
    const { type, source, target, totalValue } = req.body;
    
    if (!type || !source || !target || totalValue === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, source, target, totalValue'
      });
    }

    const plunderEvent = demographicsEngine.recordPlunderEvent(
      type as PlunderType,
      source,
      target,
      totalValue
    );
    
    res.json({
      success: true,
      data: plunderEvent,
      message: 'Plunder event recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record plunder event',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== DEMOGRAPHIC TRANSITIONS =====
router.get('/transitions', (req, res) => {
  try {
    const transitions = demographicsEngine.getDemographicTransitions();
    
    res.json({
      success: true,
      data: {
        totalTransitions: transitions.length,
        transitions: transitions.slice(-10), // Last 10 transitions
        summary: {
          byType: transitions.reduce((acc, transition) => {
            acc[transition.type] = (acc[transition.type] || 0) + 1;
            return acc;
          }, {} as Record<TransitionType, number>),
          totalAffectedPopulation: transitions.reduce((sum, transition) => sum + transition.affectedPopulation, 0),
          activeTransitions: transitions.filter(t => !t.endDate).length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demographic transitions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/transitions/initiate', (req, res) => {
  try {
    const { type, cause, affectedPopulation } = req.body;
    
    if (!type || !cause || affectedPopulation === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, cause, affectedPopulation'
      });
    }

    const transition = demographicsEngine.initiateDemographicTransition(
      type as TransitionType,
      cause,
      affectedPopulation
    );
    
    res.json({
      success: true,
      data: transition,
      message: 'Demographic transition initiated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate demographic transition',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS =====
router.get('/analytics', (req, res) => {
  try {
    const analytics = demographicsEngine.generateDemographicsAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate demographics analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/population-growth', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    const populationGrowth = demographicsAnalytics.analyzePopulationGrowth(profiles, []);
    
    res.json({
      success: true,
      data: populationGrowth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze population growth',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/mortality', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    const casualtyEvents = demographicsEngine.getCasualtyEvents();
    const mortalityAnalysis = demographicsAnalytics.analyzeMortality(profiles, casualtyEvents);
    
    res.json({
      success: true,
      data: mortalityAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze mortality',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/casualties', (req, res) => {
  try {
    const casualtyEvents = demographicsEngine.getCasualtyEvents();
    const casualtyAnalysis = demographicsAnalytics.analyzeCasualties(casualtyEvents);
    
    res.json({
      success: true,
      data: casualtyAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze casualties',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/plunder', (req, res) => {
  try {
    const plunderEvents = demographicsEngine.getPlunderEvents();
    const plunderAnalysis = demographicsAnalytics.analyzePlunder(plunderEvents);
    
    res.json({
      success: true,
      data: plunderAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze plunder',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/projections', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    const transitions = demographicsEngine.getDemographicTransitions();
    const projections = demographicsAnalytics.generateDemographicProjections(profiles, transitions);
    
    res.json({
      success: true,
      data: projections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate demographic projections',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/health', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    const healthMetrics = demographicsAnalytics.calculateHealthMetrics(profiles);
    
    res.json({
      success: true,
      data: healthMetrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate health metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/analytics/recommendations', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    const casualtyEvents = demographicsEngine.getCasualtyEvents();
    const plunderEvents = demographicsEngine.getPlunderEvents();
    const recommendations = demographicsAnalytics.generateRecommendations(profiles, casualtyEvents, plunderEvents);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SIMULATION ENDPOINTS =====
router.post('/simulate/aging', (req, res) => {
  try {
    const profiles = demographicsEngine.getAllLifespanProfiles();
    let deathCount = 0;
    
    // Process aging for all profiles
    profiles.forEach(profile => {
      demographicsEngine.updateLifespanProfile(profile.citizenId);
      if (demographicsEngine.processNaturalDeath(profile.citizenId)) {
        deathCount++;
      }
    });
    
    res.json({
      success: true,
      data: {
        processedProfiles: profiles.length,
        naturalDeaths: deathCount,
        remainingPopulation: demographicsEngine.getCurrentPopulation()
      },
      message: 'Aging simulation completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to simulate aging',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/simulate/populate', (req, res) => {
  try {
    const { count = 1000 } = req.body;
    const createdProfiles = [];
    
    for (let i = 0; i < count; i++) {
      const citizenId = `citizen_${Date.now()}_${i}`;
      const birthDate = new Date(Date.now() - Math.random() * 80 * 365 * 24 * 60 * 60 * 1000); // Random age up to 80
      const profile = demographicsEngine.createLifespanProfile(citizenId, birthDate);
      createdProfiles.push(profile);
    }
    
    res.json({
      success: true,
      data: {
        createdProfiles: createdProfiles.length,
        totalPopulation: demographicsEngine.getCurrentPopulation(),
        sampleProfiles: createdProfiles.slice(0, 5)
      },
      message: 'Population simulation completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to simulate population',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'demographics', demographicsKnobSystem, applyDemographicsKnobsToGameState);

export default router;
