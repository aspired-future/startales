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

const router = express.Router();
const demographicsEngine = new DemographicsEngine();
const demographicsAnalytics = new DemographicsAnalytics();

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

export default router;
