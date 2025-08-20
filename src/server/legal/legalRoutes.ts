/**
 * Legal System API Routes
 * 
 * REST API endpoints for the Legal & Justice Systems including courts,
 * crimes, corruption cases, law enforcement agencies, and legal analytics.
 */

import express from 'express';
import { LegalEngine } from './LegalEngine.js';
import { LegalAnalytics } from './LegalAnalytics.js';

const router = express.Router();
const legalEngine = new LegalEngine();
const legalAnalytics = new LegalAnalytics();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Legal & Justice Systems',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    components: {
      legalEngine: 'operational',
      legalAnalytics: 'operational',
      courts: legalEngine.getAllCourts().length,
      lawEnforcementAgencies: legalEngine.getAllLawEnforcementAgencies().length,
      activeCases: legalEngine.getAllLegalCases().filter(c => c.status !== 'closed').length,
      crimes: legalEngine.getAllCrimes().length,
      corruptionCases: legalEngine.getAllCorruptionCases().length
    }
  });
});

/**
 * Get all courts
 */
router.get('/courts', (req, res) => {
  try {
    const courts = legalEngine.getAllCourts();
    res.json({
      success: true,
      data: courts,
      count: courts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve courts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific court by ID
 */
router.get('/courts/:id', (req, res) => {
  try {
    const court = legalEngine.getCourt(req.params.id);
    if (!court) {
      return res.status(404).json({
        success: false,
        error: 'Court not found',
        courtId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: court,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve court',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new court
 */
router.post('/courts', (req, res) => {
  try {
    const { name, level, jurisdiction, judges, budget } = req.body;
    
    if (!name || !level || !jurisdiction || !judges || budget === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'level', 'jurisdiction', 'judges', 'budget']
      });
    }

    const court = legalEngine.createCourt({
      name,
      level,
      jurisdiction,
      judges,
      budget
    });

    res.status(201).json({
      success: true,
      data: court,
      message: 'Court created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create court',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all law enforcement agencies
 */
router.get('/agencies', (req, res) => {
  try {
    const agencies = legalEngine.getAllLawEnforcementAgencies();
    res.json({
      success: true,
      data: agencies,
      count: agencies.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve law enforcement agencies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific law enforcement agency by ID
 */
router.get('/agencies/:id', (req, res) => {
  try {
    const agency = legalEngine.getLawEnforcementAgency(req.params.id);
    if (!agency) {
      return res.status(404).json({
        success: false,
        error: 'Law enforcement agency not found',
        agencyId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: agency,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve law enforcement agency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new law enforcement agency
 */
router.post('/agencies', (req, res) => {
  try {
    const { name, type, jurisdiction, personnel, budget } = req.body;
    
    if (!name || !type || !jurisdiction || !personnel || budget === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'type', 'jurisdiction', 'personnel', 'budget']
      });
    }

    const agency = legalEngine.createLawEnforcementAgency({
      name,
      type,
      jurisdiction,
      personnel,
      budget
    });

    res.status(201).json({
      success: true,
      data: agency,
      message: 'Law enforcement agency created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create law enforcement agency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all legal cases
 */
router.get('/cases', (req, res) => {
  try {
    const { status, type, severity, limit } = req.query;
    let cases = legalEngine.getAllLegalCases();

    // Apply filters
    if (status) {
      cases = cases.filter(c => c.status === status);
    }
    if (type) {
      cases = cases.filter(c => c.type === type);
    }
    if (severity) {
      cases = cases.filter(c => c.severity === severity);
    }

    // Apply limit
    if (limit && !isNaN(Number(limit))) {
      cases = cases.slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: cases,
      count: cases.length,
      filters: { status, type, severity, limit },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve legal cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific legal case by ID
 */
router.get('/cases/:id', (req, res) => {
  try {
    const legalCase = legalEngine.getLegalCase(req.params.id);
    if (!legalCase) {
      return res.status(404).json({
        success: false,
        error: 'Legal case not found',
        caseId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: legalCase,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve legal case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * File new legal case
 */
router.post('/cases', (req, res) => {
  try {
    const { title, type, category, severity, plaintiff, defendant, courtId } = req.body;
    
    if (!title || !type || !category || !severity || !plaintiff || !defendant) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['title', 'type', 'category', 'severity', 'plaintiff', 'defendant']
      });
    }

    const legalCase = legalEngine.fileLegalCase({
      title,
      type,
      category,
      severity,
      plaintiff,
      defendant,
      courtId
    });

    res.status(201).json({
      success: true,
      data: legalCase,
      message: 'Legal case filed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to file legal case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Process legal case (advance through court system)
 */
router.post('/cases/:id/process', (req, res) => {
  try {
    const legalCase = legalEngine.processLegalCase(req.params.id);
    
    res.json({
      success: true,
      data: legalCase,
      message: `Case processed to ${legalCase.status} status`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process legal case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all crimes
 */
router.get('/crimes', (req, res) => {
  try {
    const { type, severity, status, limit } = req.query;
    let crimes = legalEngine.getAllCrimes();

    // Apply filters
    if (type) {
      crimes = crimes.filter(c => c.type === type);
    }
    if (severity) {
      crimes = crimes.filter(c => c.severity === severity);
    }
    if (status) {
      crimes = crimes.filter(c => c.investigation.status === status);
    }

    // Apply limit
    if (limit && !isNaN(Number(limit))) {
      crimes = crimes.slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: crimes,
      count: crimes.length,
      filters: { type, severity, status, limit },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve crimes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific crime by ID
 */
router.get('/crimes/:id', (req, res) => {
  try {
    const crime = legalEngine.getCrime(req.params.id);
    if (!crime) {
      return res.status(404).json({
        success: false,
        error: 'Crime not found',
        crimeId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: crime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve crime',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Report new crime
 */
router.post('/crimes', (req, res) => {
  try {
    const { type, category, location, description, perpetrator, victims, reportedBy, reportingDelay } = req.body;
    
    if (!type || !category || !location || !description || !perpetrator || !victims || !reportedBy) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['type', 'category', 'location', 'description', 'perpetrator', 'victims', 'reportedBy']
      });
    }

    const crime = legalEngine.reportCrime({
      type,
      category,
      location,
      description,
      perpetrator,
      victims,
      reportedBy,
      reportingDelay
    });

    res.status(201).json({
      success: true,
      data: crime,
      message: 'Crime reported successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to report crime',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all corruption cases
 */
router.get('/corruption', (req, res) => {
  try {
    const { type, level, status, limit } = req.query;
    let corruptionCases = legalEngine.getAllCorruptionCases();

    // Apply filters
    if (type) {
      corruptionCases = corruptionCases.filter(c => c.type === type);
    }
    if (level) {
      corruptionCases = corruptionCases.filter(c => c.level === level);
    }
    if (status) {
      corruptionCases = corruptionCases.filter(c => c.investigationStatus === status);
    }

    // Apply limit
    if (limit && !isNaN(Number(limit))) {
      corruptionCases = corruptionCases.slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: corruptionCases,
      count: corruptionCases.length,
      filters: { type, level, status, limit },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve corruption cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific corruption case by ID
 */
router.get('/corruption/:id', (req, res) => {
  try {
    const corruptionCase = legalEngine.getCorruptionCase(req.params.id);
    if (!corruptionCase) {
      return res.status(404).json({
        success: false,
        error: 'Corruption case not found',
        corruptionId: req.params.id
      });
    }
    
    res.json({
      success: true,
      data: corruptionCase,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve corruption case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Report new corruption case
 */
router.post('/corruption', (req, res) => {
  try {
    const { type, officialId, office, level, description, monetaryValue, detectionMethod, evidenceStrength } = req.body;
    
    if (!type || !officialId || !office || !level || !description || monetaryValue === undefined || !detectionMethod || evidenceStrength === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['type', 'officialId', 'office', 'level', 'description', 'monetaryValue', 'detectionMethod', 'evidenceStrength']
      });
    }

    const corruptionCase = legalEngine.reportCorruption({
      type,
      officialId,
      office,
      level,
      description,
      monetaryValue,
      detectionMethod,
      evidenceStrength
    });

    res.status(201).json({
      success: true,
      data: corruptionCase,
      message: 'Corruption case reported successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to report corruption case',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get legal system analytics
 */
router.get('/analytics', (req, res) => {
  try {
    const { jurisdiction = 'default' } = req.query;
    
    const legalCases = legalEngine.getAllLegalCases();
    const courts = legalEngine.getAllCourts();
    const crimes = legalEngine.getAllCrimes();
    const corruptionCases = legalEngine.getAllCorruptionCases();
    const lawEnforcementAgencies = legalEngine.getAllLawEnforcementAgencies();

    const analytics = legalAnalytics.generateComprehensiveAnalytics(
      jurisdiction as string,
      legalCases,
      courts,
      crimes,
      corruptionCases,
      lawEnforcementAgencies
    );

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate legal analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get legal system insights
 */
router.get('/insights', (req, res) => {
  try {
    const { jurisdiction = 'default' } = req.query;
    
    const legalCases = legalEngine.getAllLegalCases();
    const courts = legalEngine.getAllCourts();
    const crimes = legalEngine.getAllCrimes();
    const corruptionCases = legalEngine.getAllCorruptionCases();
    const lawEnforcementAgencies = legalEngine.getAllLawEnforcementAgencies();

    const analytics = legalAnalytics.generateComprehensiveAnalytics(
      jurisdiction as string,
      legalCases,
      courts,
      crimes,
      corruptionCases,
      lawEnforcementAgencies
    );

    const insights = legalAnalytics.generateInsights(analytics);
    const recommendations = legalAnalytics.generateRecommendations(analytics);

    res.json({
      success: true,
      data: {
        insights,
        recommendations,
        analytics: {
          justiceHealthScore: analytics.justiceHealth.overallScore,
          crimeRate: analytics.crimeStatistics.crimeRate,
          courtEfficiency: analytics.courtPerformance.clearanceRate,
          corruptionLevel: analytics.corruptionMetrics.reportedCases,
          publicTrust: analytics.lawEnforcement.performance.communityTrust
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate legal insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get legal events (system activity log)
 */
router.get('/events', (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const events = legalEngine.getLegalEvents(Number(limit));

    res.json({
      success: true,
      data: events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve legal events',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Simulate time step (advance legal system)
 */
router.post('/simulate', (req, res) => {
  try {
    legalEngine.simulateTimeStep();
    
    const summary = {
      courts: legalEngine.getAllCourts().length,
      activeCases: legalEngine.getAllLegalCases().filter(c => c.status !== 'closed').length,
      crimes: legalEngine.getAllCrimes().length,
      corruptionCases: legalEngine.getAllCorruptionCases().length,
      lawEnforcementAgencies: legalEngine.getAllLawEnforcementAgencies().length
    };

    res.json({
      success: true,
      message: 'Legal system time step simulated',
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to simulate legal system time step',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
