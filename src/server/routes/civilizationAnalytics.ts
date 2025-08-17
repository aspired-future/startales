/**
 * Civilization Analytics API Routes
 * Task 45: Economic inequality visualization and social mobility tracking
 */

import { Router } from 'express';
import { civilizationMetrics } from '../analytics/civilizationMetrics.js';

const router = Router();

/**
 * GET /api/civilization-analytics/:campaignId
 * Get comprehensive civilization analytics for a campaign
 */
router.get('/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    // Store in history for trend analysis
    await civilizationMetrics.storeAnalyticsHistory(analytics);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting civilization analytics:', error);
    res.status(500).json({ 
      error: 'Failed to calculate civilization analytics',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/economic
 * Get economic metrics only
 */
router.get('/:campaignId/economic', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        economic: analytics.economic
      }
    });
  } catch (error) {
    console.error('Error getting economic metrics:', error);
    res.status(500).json({ 
      error: 'Failed to calculate economic metrics',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/social-mobility
 * Get social mobility metrics only
 */
router.get('/:campaignId/social-mobility', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        socialMobility: analytics.socialMobility
      }
    });
  } catch (error) {
    console.error('Error getting social mobility metrics:', error);
    res.status(500).json({ 
      error: 'Failed to calculate social mobility metrics',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/demographics
 * Get population demographics
 */
router.get('/:campaignId/demographics', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        demographics: analytics.demographics
      }
    });
  } catch (error) {
    console.error('Error getting demographics:', error);
    res.status(500).json({ 
      error: 'Failed to calculate demographics',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/trends
 * Get historical trends
 */
router.get('/:campaignId/trends', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        trends: analytics.trends
      }
    });
  } catch (error) {
    console.error('Error getting trends:', error);
    res.status(500).json({ 
      error: 'Failed to calculate trends',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/recommendations
 * Get policy recommendations
 */
router.get('/:campaignId/recommendations', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        recommendations: analytics.recommendations,
        metrics: {
          economicHealth: analytics.economic.economicHealth,
          giniCoefficient: analytics.economic.giniCoefficient,
          socialMobilityIndex: analytics.economic.socialMobilityIndex
        }
      }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
});

/**
 * GET /api/civilization-analytics/:campaignId/inequality
 * Get detailed inequality analysis
 */
router.get('/:campaignId/inequality', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const analytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    res.json({
      success: true,
      data: {
        campaignId,
        timestamp: analytics.timestamp,
        inequality: {
          giniCoefficient: analytics.economic.giniCoefficient,
          incomeDistribution: analytics.economic.incomeDistribution,
          povertyRate: analytics.economic.povertyRate,
          middleClassRate: analytics.economic.middleClassRate,
          wealthRate: analytics.economic.wealthRate,
          averageIncome: analytics.economic.averageIncome
        },
        interpretation: {
          inequalityLevel: analytics.economic.giniCoefficient > 0.45 ? 'High' : 
                          analytics.economic.giniCoefficient > 0.35 ? 'Moderate' : 'Low',
          economicHealth: analytics.economic.economicHealth > 70 ? 'Good' :
                         analytics.economic.economicHealth > 50 ? 'Fair' : 'Poor'
        }
      }
    });
  } catch (error) {
    console.error('Error getting inequality analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze inequality',
      details: error.message 
    });
  }
});

/**
 * POST /api/civilization-analytics/:campaignId/simulate-policy
 * Simulate the impact of a policy on civilization metrics
 */
router.post('/:campaignId/simulate-policy', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const { policyType, intensity } = req.body;
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    if (!policyType || typeof intensity !== 'number') {
      return res.status(400).json({ error: 'Policy type and intensity are required' });
    }

    // Get current analytics
    const currentAnalytics = await civilizationMetrics.calculateCivilizationMetrics(campaignId);
    
    // Simulate policy impact (simplified)
    const simulatedAnalytics = { ...currentAnalytics };
    
    switch (policyType) {
      case 'education_investment':
        simulatedAnalytics.socialMobility.educationImpact += intensity * 10;
        simulatedAnalytics.socialMobility.upwardMobility += intensity * 5;
        simulatedAnalytics.economic.economicHealth += intensity * 3;
        break;
        
      case 'wealth_redistribution':
        simulatedAnalytics.economic.giniCoefficient -= intensity * 0.05;
        simulatedAnalytics.economic.povertyRate -= intensity * 5;
        simulatedAnalytics.economic.economicHealth += intensity * 5;
        break;
        
      case 'job_creation':
        simulatedAnalytics.demographics.employmentRate += intensity * 5;
        simulatedAnalytics.economic.economicHealth += intensity * 4;
        simulatedAnalytics.economic.averageIncome += intensity * 2000;
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown policy type' });
    }

    // Ensure values stay within realistic bounds
    simulatedAnalytics.economic.giniCoefficient = Math.max(0.1, Math.min(0.8, simulatedAnalytics.economic.giniCoefficient));
    simulatedAnalytics.economic.economicHealth = Math.max(0, Math.min(100, simulatedAnalytics.economic.economicHealth));
    simulatedAnalytics.socialMobility.upwardMobility = Math.max(0, Math.min(100, simulatedAnalytics.socialMobility.upwardMobility));
    
    res.json({
      success: true,
      data: {
        campaignId,
        policyType,
        intensity,
        current: {
          economicHealth: currentAnalytics.economic.economicHealth,
          giniCoefficient: currentAnalytics.economic.giniCoefficient,
          upwardMobility: currentAnalytics.socialMobility.upwardMobility
        },
        simulated: {
          economicHealth: simulatedAnalytics.economic.economicHealth,
          giniCoefficient: simulatedAnalytics.economic.giniCoefficient,
          upwardMobility: simulatedAnalytics.socialMobility.upwardMobility
        },
        impact: {
          economicHealthChange: simulatedAnalytics.economic.economicHealth - currentAnalytics.economic.economicHealth,
          inequalityChange: simulatedAnalytics.economic.giniCoefficient - currentAnalytics.economic.giniCoefficient,
          mobilityChange: simulatedAnalytics.socialMobility.upwardMobility - currentAnalytics.socialMobility.upwardMobility
        }
      }
    });
  } catch (error) {
    console.error('Error simulating policy impact:', error);
    res.status(500).json({ 
      error: 'Failed to simulate policy impact',
      details: error.message 
    });
  }
});

export default router;
