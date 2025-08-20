/**
 * Profession System API Routes
 * Sprint 6: Comprehensive profession and labor market APIs
 */

import { Router, Request, Response } from 'express';
import { ProfessionEngine } from './ProfessionEngine.js';
import { LaborMarketAnalytics } from './LaborMarketAnalytics.js';
import { CitizenEngine } from '../population/CitizenEngine.js';

const router = Router();

// Initialize engines
const professionEngine = new ProfessionEngine();
const laborMarketAnalytics = new LaborMarketAnalytics();
const citizenEngine = new CitizenEngine();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'profession-system',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Get all available professions
 */
router.get('/professions', (req: Request, res: Response) => {
  try {
    const professions = professionEngine.getAllProfessions();
    
    res.json({
      success: true,
      data: {
        professions,
        totalCount: professions.length,
        categories: [...new Set(professions.map(p => p.category))]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch professions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific profession details
 */
router.get('/professions/:professionId', (req: Request, res: Response) => {
  try {
    const { professionId } = req.params;
    const profession = professionEngine.getProfession(professionId);
    
    if (!profession) {
      return res.status(404).json({
        success: false,
        error: 'Profession not found'
      });
    }
    
    res.json({
      success: true,
      data: profession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profession',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get labor market analytics
 */
router.get('/labor-market', (req: Request, res: Response) => {
  try {
    const { cityId = 'default' } = req.query;
    const markets = professionEngine.getLaborMarketAnalytics(cityId as string);
    
    // Calculate summary statistics
    const totalEmployed = markets.reduce((sum, m) => sum + m.filledPositions, 0);
    const totalOpenPositions = markets.reduce((sum, m) => sum + m.openPositions, 0);
    const averageTimeToFill = markets.reduce((sum, m) => sum + m.timeToFill, 0) / markets.length;
    const averageTurnover = markets.reduce((sum, m) => sum + m.turnoverRate, 0) / markets.length;
    
    res.json({
      success: true,
      data: {
        markets,
        summary: {
          totalEmployed,
          totalOpenPositions,
          averageTimeToFill: Math.round(averageTimeToFill),
          averageTurnover: Math.round(averageTurnover * 100) / 100,
          marketHealth: totalOpenPositions / totalEmployed < 0.1 ? 'healthy' : 'tight'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch labor market data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get unemployment statistics
 */
router.get('/unemployment', (req: Request, res: Response) => {
  try {
    const { cityId = 'default' } = req.query;
    const stats = professionEngine.getUnemploymentStatistics(cityId as string);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unemployment statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get career progression data for a citizen
 */
router.get('/careers/:citizenId', (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    
    const employment = professionEngine.getEmployment(citizenId);
    const transitions = professionEngine.getCareerTransitions(citizenId);
    
    if (!employment) {
      const unemploymentRecord = professionEngine.getUnemploymentRecord(citizenId);
      return res.json({
        success: true,
        data: {
          status: 'unemployed',
          unemploymentRecord,
          careerTransitions: transitions
        }
      });
    }
    
    const profession = professionEngine.getProfession(employment.professionId);
    
    res.json({
      success: true,
      data: {
        status: 'employed',
        employment,
        profession,
        careerTransitions: transitions,
        nextPromotionEligible: employment.promotionEligible,
        careerLevel: profession?.careerLevels[employment.level - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch career data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Assign profession to a citizen
 */
router.post('/assign', (req: Request, res: Response) => {
  try {
    const { citizenId, preferredProfessions } = req.body;
    
    if (!citizenId) {
      return res.status(400).json({
        success: false,
        error: 'citizenId is required'
      });
    }
    
    // Get citizen data (would integrate with population system)
    const citizen = citizenEngine.getCitizen(citizenId);
    if (!citizen) {
      return res.status(404).json({
        success: false,
        error: 'Citizen not found'
      });
    }
    
    const employment = professionEngine.assignProfession(citizen, preferredProfessions);
    
    if (!employment) {
      return res.json({
        success: true,
        data: {
          status: 'unemployed',
          message: 'No suitable profession found for citizen'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        status: 'employed',
        employment,
        profession: professionEngine.getProfession(employment.professionId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to assign profession',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Process career advancement for all citizens
 */
router.post('/advance-careers', (req: Request, res: Response) => {
  try {
    const transitions = professionEngine.processCareerAdvancement();
    
    res.json({
      success: true,
      data: {
        transitionsProcessed: transitions.length,
        transitions: transitions.slice(0, 10), // Return first 10 for preview
        summary: {
          promotions: transitions.filter(t => t.transitionType === 'promotion').length,
          careerChanges: transitions.filter(t => t.transitionType === 'career_change').length,
          averageSalaryIncrease: transitions.reduce((sum, t) => sum + t.salaryChange, 0) / transitions.length || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process career advancement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get labor market forecast
 */
router.get('/forecast/:professionId', (req: Request, res: Response) => {
  try {
    const { professionId } = req.params;
    const { timeframe = 'annual' } = req.query;
    
    const profession = professionEngine.getProfession(professionId);
    if (!profession) {
      return res.status(404).json({
        success: false,
        error: 'Profession not found'
      });
    }
    
    const markets = professionEngine.getLaborMarketAnalytics('default');
    const currentMarket = markets.find(m => m.professionId === professionId);
    
    if (!currentMarket) {
      return res.status(404).json({
        success: false,
        error: 'Labor market data not found for profession'
      });
    }
    
    const forecast = laborMarketAnalytics.generateForecast(
      profession,
      currentMarket,
      timeframe as 'quarterly' | 'annual' | 'five_year'
    );
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate forecast',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get skills gap analysis
 */
router.get('/skills-gap/:professionId', (req: Request, res: Response) => {
  try {
    const { professionId } = req.params;
    
    const profession = professionEngine.getProfession(professionId);
    if (!profession) {
      return res.status(404).json({
        success: false,
        error: 'Profession not found'
      });
    }
    
    // Get employment records (would be from actual data in production)
    const employmentRecords: any[] = []; // Placeholder
    const skillsGaps = laborMarketAnalytics.analyzeSkillsGaps(profession, employmentRecords);
    
    res.json({
      success: true,
      data: {
        professionId,
        skillsGaps,
        summary: {
          totalGaps: skillsGaps.length,
          criticalGaps: skillsGaps.filter(gap => gap.gapSize > 3).length,
          totalTrainingCost: skillsGaps.reduce((sum, gap) => sum + gap.trainingCost, 0),
          averageTrainingTime: skillsGaps.reduce((sum, gap) => sum + gap.estimatedTrainingTime, 0) / skillsGaps.length || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze skills gaps',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get wage analysis for a profession
 */
router.get('/wages/:professionId', (req: Request, res: Response) => {
  try {
    const { professionId } = req.params;
    const { cityId = 'default' } = req.query;
    
    const profession = professionEngine.getProfession(professionId);
    if (!profession) {
      return res.status(404).json({
        success: false,
        error: 'Profession not found'
      });
    }
    
    // Get employment records (would be from actual data in production)
    const employmentRecords: any[] = []; // Placeholder
    const wageAnalysis = laborMarketAnalytics.analyzeWages(profession, employmentRecords, cityId as string);
    
    res.json({
      success: true,
      data: wageAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze wages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get career mobility analysis between professions
 */
router.get('/mobility/:fromProfessionId/:toProfessionId', (req: Request, res: Response) => {
  try {
    const { fromProfessionId, toProfessionId } = req.params;
    
    const fromProfession = professionEngine.getProfession(fromProfessionId);
    const toProfession = professionEngine.getProfession(toProfessionId);
    
    if (!fromProfession || !toProfession) {
      return res.status(404).json({
        success: false,
        error: 'One or both professions not found'
      });
    }
    
    const careerTransitions = professionEngine.getCareerTransitions();
    const mobilityAnalysis = laborMarketAnalytics.analyzeCareerMobility(
      fromProfession,
      toProfession,
      careerTransitions
    );
    
    res.json({
      success: true,
      data: mobilityAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze career mobility',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get profession statistics summary
 */
router.get('/statistics', (req: Request, res: Response) => {
  try {
    const professions = professionEngine.getAllProfessions();
    const markets = professionEngine.getLaborMarketAnalytics('default');
    const unemploymentStats = professionEngine.getUnemploymentStatistics('default');
    
    // Calculate category statistics
    const categoryStats = professions.reduce((acc, profession) => {
      const category = profession.category;
      if (!acc[category]) {
        acc[category] = {
          professionCount: 0,
          totalEmployed: 0,
          averageSalary: 0,
          demandLevel: 'moderate'
        };
      }
      
      acc[category].professionCount++;
      
      const market = markets.find(m => m.professionId === profession.id);
      if (market) {
        acc[category].totalEmployed += market.filledPositions;
        acc[category].averageSalary += market.averageSalary;
      }
      
      return acc;
    }, {} as any);
    
    // Calculate averages
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.averageSalary = Math.round(stats.averageSalary / stats.professionCount);
    });
    
    res.json({
      success: true,
      data: {
        totalProfessions: professions.length,
        totalEmployed: markets.reduce((sum, m) => sum + m.filledPositions, 0),
        totalOpenPositions: markets.reduce((sum, m) => sum + m.openPositions, 0),
        unemploymentRate: unemploymentStats.unemploymentRate,
        categoryStatistics: categoryStats,
        topGrowingProfessions: professions
          .filter(p => p.growthProjection === 'rapidly_growing')
          .slice(0, 5)
          .map(p => ({ id: p.id, name: p.name, category: p.category })),
        highDemandProfessions: professions
          .filter(p => p.demandLevel === 'very_high')
          .slice(0, 5)
          .map(p => ({ id: p.id, name: p.name, category: p.category }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
