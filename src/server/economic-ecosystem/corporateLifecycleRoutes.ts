/**
 * Corporate Lifecycle API Routes
 * 
 * RESTful API endpoints for the Corporate Lifecycle System
 */

import express from 'express';
import { Pool } from 'pg';
import { CorporateLifecycleEngine } from './CorporateLifecycleEngine';
import { CorporateLifecycleService, initializeCorporateLifecycleSchema } from './corporateLifecycleSchema';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Corporate Lifecycle System
const corporateLifecycleKnobsData = {
  // Corporate Formation & Startup
  startup_formation_ease: 0.7,               // Startup formation ease and regulatory simplification
  entrepreneurial_ecosystem_support: 0.8,    // Entrepreneurial ecosystem support and incubation
  venture_capital_accessibility: 0.7,        // Venture capital accessibility and funding availability
  
  // Corporate Growth & Scaling
  business_scaling_facilitation: 0.7,        // Business scaling facilitation and growth support
  market_expansion_assistance: 0.7,          // Market expansion assistance and geographic growth
  operational_efficiency_optimization: 0.8,  // Operational efficiency optimization and process improvement
  
  // Corporate Governance & Management
  corporate_governance_excellence: 0.8,      // Corporate governance excellence and leadership quality
  stakeholder_engagement_quality: 0.7,       // Stakeholder engagement quality and relationship management
  strategic_planning_sophistication: 0.8,    // Strategic planning sophistication and long-term vision
  
  // Innovation & Adaptation
  corporate_innovation_culture: 0.8,         // Corporate innovation culture and R&D investment
  technology_adoption_agility: 0.7,          // Technology adoption agility and digital transformation
  market_adaptation_responsiveness: 0.7,     // Market adaptation responsiveness and competitive agility
  
  // Financial Management & Sustainability
  financial_health_monitoring: 0.8,          // Financial health monitoring and fiscal responsibility
  capital_structure_optimization: 0.7,       // Capital structure optimization and funding strategy
  profitability_sustainability: 0.8,         // Profitability sustainability and long-term viability
  
  // Corporate Social Responsibility
  social_impact_commitment: 0.7,             // Social impact commitment and community engagement
  environmental_responsibility: 0.7,         // Environmental responsibility and sustainability practices
  ethical_business_conduct: 0.8,             // Ethical business conduct and integrity standards
  
  // Market Position & Competition
  competitive_advantage_development: 0.8,    // Competitive advantage development and differentiation
  market_leadership_pursuit: 0.7,            // Market leadership pursuit and industry influence
  brand_reputation_management: 0.8,          // Brand reputation management and public perception
  
  // Corporate Lifecycle Management
  lifecycle_transition_smoothness: 0.7,      // Lifecycle transition smoothness and change management
  corporate_restructuring_efficiency: 0.6,   // Corporate restructuring efficiency and organizational agility
  succession_planning_quality: 0.7,          // Succession planning quality and leadership continuity
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Corporate Lifecycle
const corporateLifecycleKnobSystem = new EnhancedKnobSystem(corporateLifecycleKnobsData);

// Apply corporate lifecycle knobs to game state
function applyCorporateLifecycleKnobsToGameState() {
  const knobs = corporateLifecycleKnobSystem.knobs;
  
  // Apply corporate formation settings
  const corporateFormation = (knobs.startup_formation_ease + knobs.entrepreneurial_ecosystem_support + 
    knobs.venture_capital_accessibility) / 3;
  
  // Apply growth and scaling settings
  const growthScaling = (knobs.business_scaling_facilitation + knobs.market_expansion_assistance + 
    knobs.operational_efficiency_optimization) / 3;
  
  // Apply governance settings
  const governance = (knobs.corporate_governance_excellence + knobs.stakeholder_engagement_quality + 
    knobs.strategic_planning_sophistication) / 3;
  
  // Apply innovation settings
  const innovation = (knobs.corporate_innovation_culture + knobs.technology_adoption_agility + 
    knobs.market_adaptation_responsiveness) / 3;
  
  // Apply financial management settings
  const financialManagement = (knobs.financial_health_monitoring + knobs.capital_structure_optimization + 
    knobs.profitability_sustainability) / 3;
  
  // Apply social responsibility settings
  const socialResponsibility = (knobs.social_impact_commitment + knobs.environmental_responsibility + 
    knobs.ethical_business_conduct) / 3;
  
  console.log('Applied corporate lifecycle knobs to game state:', {
    corporateFormation,
    growthScaling,
    governance,
    innovation,
    financialManagement,
    socialResponsibility
  });
}

let lifecycleEngine: CorporateLifecycleEngine;
let lifecycleService: CorporateLifecycleService;

export function initializeCorporateLifecycleService(pool: Pool): void {
  lifecycleEngine = new CorporateLifecycleEngine(pool);
  lifecycleService = new CorporateLifecycleService(pool);
  
  // Initialize schema
  initializeCorporateLifecycleSchema(pool).catch(error => {
    console.error('Failed to initialize Corporate Lifecycle schema:', error);
  });
}

export function getCorporateLifecycleEngine(): CorporateLifecycleEngine {
  if (!lifecycleEngine) {
    throw new Error('Corporate Lifecycle Engine not initialized');
  }
  return lifecycleEngine;
}

export function getCorporateLifecycleService(): CorporateLifecycleService {
  if (!lifecycleService) {
    throw new Error('Corporate Lifecycle Service not initialized');
  }
  return lifecycleService;
}

// Get corporate ecosystem overview
router.get('/ecosystem/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const ecosystem = await lifecycleEngine.assessCorporateEcosystem(civilizationId);
    const healthSummary = await lifecycleService.getCorporateHealthSummary(civilizationId);
    const metrics = await lifecycleService.getLifecycleMetrics(civilizationId, 6);
    
    res.json({
      ecosystem,
      healthSummary,
      recentMetrics: metrics.slice(0, 3),
      ecosystemHealth: healthSummary.averageHealth >= 70 ? 'healthy' : 
                     healthSummary.averageHealth >= 50 ? 'stable' : 'struggling',
      riskLevel: healthSummary.highRiskCount > healthSummary.totalCorporations * 0.2 ? 'high' : 
                 healthSummary.highRiskCount > healthSummary.totalCorporations * 0.1 ? 'medium' : 'low'
    });

  } catch (error) {
    console.error('Error assessing corporate ecosystem:', error);
    res.status(500).json({ error: 'Failed to assess corporate ecosystem' });
  }
});

// Get corporate health assessment
router.get('/health/:corporationId', async (req, res) => {
  try {
    const corporationId = parseInt(req.params.corporationId);
    
    if (isNaN(corporationId)) {
      return res.status(400).json({ error: 'Invalid corporation ID' });
    }

    const health = await lifecycleEngine.assessCorporateHealth(corporationId);
    
    res.json({
      health,
      riskLevel: health.bankruptcy_risk >= 70 ? 'high' : 
                 health.bankruptcy_risk >= 40 ? 'medium' : 'low',
      investmentGrade: health.overall_health >= 80 ? 'excellent' :
                      health.overall_health >= 60 ? 'good' :
                      health.overall_health >= 40 ? 'fair' : 'poor',
      recommendations: generateHealthRecommendations(health)
    });

  } catch (error) {
    console.error('Error assessing corporate health:', error);
    res.status(500).json({ error: 'Failed to assess corporate health' });
  }
});

// Execute merger or acquisition
router.post('/merger-acquisition', async (req, res) => {
  try {
    const { acquirerId, targetId, transactionType, offerPrice } = req.body;
    
    if (!acquirerId || !targetId || !transactionType || !offerPrice) {
      return res.status(400).json({ 
        error: 'Missing required fields: acquirerId, targetId, transactionType, offerPrice' 
      });
    }

    const validTypes = ['merger', 'acquisition', 'hostile_takeover'];
    if (!validTypes.includes(transactionType)) {
      return res.status(400).json({ 
        error: 'Invalid transaction type. Must be: merger, acquisition, or hostile_takeover' 
      });
    }

    const merger = await lifecycleEngine.executeMergerAcquisition(
      parseInt(acquirerId),
      parseInt(targetId),
      transactionType,
      parseFloat(offerPrice)
    );
    
    res.json({
      success: true,
      merger,
      message: `${transactionType} transaction initiated successfully`,
      estimatedCompletion: merger.expected_completion,
      successProbability: `${((merger.offer_premium + 50) / 2).toFixed(0)}%` // Simplified calculation
    });

  } catch (error) {
    console.error('Error executing merger/acquisition:', error);
    res.status(500).json({ error: 'Failed to execute merger/acquisition' });
  }
});

// Process bankruptcy
router.post('/bankruptcy', async (req, res) => {
  try {
    const { corporationId, bankruptcyType } = req.body;
    
    if (!corporationId || !bankruptcyType) {
      return res.status(400).json({ 
        error: 'Missing required fields: corporationId, bankruptcyType' 
      });
    }

    const validTypes = ['chapter_7', 'chapter_11', 'voluntary_liquidation', 'forced_liquidation'];
    if (!validTypes.includes(bankruptcyType)) {
      return res.status(400).json({ 
        error: 'Invalid bankruptcy type. Must be: chapter_7, chapter_11, voluntary_liquidation, or forced_liquidation' 
      });
    }

    const bankruptcy = await lifecycleEngine.processBankruptcy(
      parseInt(corporationId),
      bankruptcyType
    );
    
    res.json({
      success: true,
      bankruptcy,
      message: `Bankruptcy filing processed successfully`,
      recoveryProspects: bankruptcyType === 'chapter_11' ? 'possible' : 'unlikely',
      estimatedResolution: '6-18 months'
    });

  } catch (error) {
    console.error('Error processing bankruptcy:', error);
    res.status(500).json({ error: 'Failed to process bankruptcy' });
  }
});

// Launch product evolution
router.post('/product-evolution', async (req, res) => {
  try {
    const { corporationId, productId, evolutionType, developmentCost } = req.body;
    
    if (!corporationId || !productId || !evolutionType || developmentCost === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: corporationId, productId, evolutionType, developmentCost' 
      });
    }

    const validTypes = ['upgrade', 'new_version', 'discontinuation', 'pivot', 'expansion'];
    if (!validTypes.includes(evolutionType)) {
      return res.status(400).json({ 
        error: 'Invalid evolution type. Must be: upgrade, new_version, discontinuation, pivot, or expansion' 
      });
    }

    const evolution = await lifecycleEngine.evolveProduct(
      parseInt(corporationId),
      parseInt(productId),
      evolutionType,
      parseFloat(developmentCost)
    );
    
    res.json({
      success: true,
      evolution,
      message: `Product ${evolutionType} initiated successfully`,
      expectedLaunch: evolution.launch_date,
      developmentTimeline: `${Math.floor(parseFloat(developmentCost) / 1000000) + 3} months`
    });

  } catch (error) {
    console.error('Error launching product evolution:', error);
    res.status(500).json({ error: 'Failed to launch product evolution' });
  }
});

// Generate market entrants
router.post('/market-entrants/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const { count = 1 } = req.body;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    if (count < 1 || count > 10) {
      return res.status(400).json({ error: 'Count must be between 1 and 10' });
    }

    const newCompanies = await lifecycleEngine.generateMarketEntrants(civilizationId, count);
    
    res.json({
      success: true,
      newCompanies,
      count: newCompanies.length,
      message: `${newCompanies.length} new market entrant(s) generated successfully`
    });

  } catch (error) {
    console.error('Error generating market entrants:', error);
    res.status(500).json({ error: 'Failed to generate market entrants' });
  }
});

// Get lifecycle events
router.get('/events', async (req, res) => {
  try {
    const corporationId = req.query.corporationId ? parseInt(req.query.corporationId as string) : undefined;
    const eventType = req.query.eventType as string;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const events = await lifecycleService.getLifecycleEvents(corporationId, eventType, limit);
    
    res.json({
      events,
      totalEvents: events.length,
      filters: {
        corporationId: corporationId || 'all',
        eventType: eventType || 'all',
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching lifecycle events:', error);
    res.status(500).json({ error: 'Failed to fetch lifecycle events' });
  }
});

// Get merger & acquisition activity
router.get('/mergers-acquisitions', async (req, res) => {
  try {
    const status = req.query.status as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const mergers = await lifecycleService.getMergerAcquisitions(status, limit);
    
    // Calculate summary statistics
    const totalValue = mergers.reduce((sum, m) => sum + parseFloat(m.offer_price), 0);
    const avgPremium = mergers.length > 0 ? 
      mergers.reduce((sum, m) => sum + parseFloat(m.offer_premium), 0) / mergers.length : 0;
    
    res.json({
      mergers,
      summary: {
        totalTransactions: mergers.length,
        totalValue: totalValue,
        averagePremium: avgPremium,
        successRate: mergers.filter(m => m.status === 'completed').length / Math.max(mergers.length, 1) * 100
      }
    });

  } catch (error) {
    console.error('Error fetching M&A activity:', error);
    res.status(500).json({ error: 'Failed to fetch M&A activity' });
  }
});

// Get bankruptcy events
router.get('/bankruptcies', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const bankruptcies = await lifecycleService.getBankruptcyEvents(limit);
    
    // Calculate summary statistics
    const totalAssets = bankruptcies.reduce((sum, b) => sum + parseFloat(b.assets_value), 0);
    const totalLiabilities = bankruptcies.reduce((sum, b) => sum + parseFloat(b.liabilities_value), 0);
    const totalEmployees = bankruptcies.reduce((sum, b) => sum + parseInt(b.employee_count), 0);
    
    res.json({
      bankruptcies,
      summary: {
        totalBankruptcies: bankruptcies.length,
        totalAssetsAtRisk: totalAssets,
        totalLiabilities: totalLiabilities,
        employeesAffected: totalEmployees,
        averageRecoveryRate: bankruptcies.length > 0 ? 
          bankruptcies.filter(b => b.recovery_rate).reduce((sum, b) => sum + parseFloat(b.recovery_rate), 0) / 
          bankruptcies.filter(b => b.recovery_rate).length : 0
      }
    });

  } catch (error) {
    console.error('Error fetching bankruptcy events:', error);
    res.status(500).json({ error: 'Failed to fetch bankruptcy events' });
  }
});

// Get product evolution activity
router.get('/product-evolutions', async (req, res) => {
  try {
    const corporationId = req.query.corporationId ? parseInt(req.query.corporationId as string) : undefined;
    const stage = req.query.stage as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const evolutions = await lifecycleService.getProductEvolutions(corporationId, stage, limit);
    
    // Calculate summary statistics
    const totalInvestment = evolutions.reduce((sum, e) => sum + parseFloat(e.development_cost), 0);
    const avgSuccessScore = evolutions.length > 0 ?
      evolutions.reduce((sum, e) => sum + parseFloat(e.competitive_advantage), 0) / evolutions.length : 0;
    
    res.json({
      evolutions,
      summary: {
        totalProjects: evolutions.length,
        totalInvestment: totalInvestment,
        averageSuccessScore: avgSuccessScore,
        stageDistribution: evolutions.reduce((acc, e) => {
          acc[e.lifecycle_stage] = (acc[e.lifecycle_stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Error fetching product evolutions:', error);
    res.status(500).json({ error: 'Failed to fetch product evolutions' });
  }
});

// Update lifecycle metrics
router.post('/metrics/:civilizationId/update', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    await lifecycleService.updateLifecycleMetrics(civilizationId);
    const updatedMetrics = await lifecycleService.getLifecycleMetrics(civilizationId, 1);
    
    res.json({
      success: true,
      message: 'Lifecycle metrics updated successfully',
      latestMetrics: updatedMetrics[0] || null
    });

  } catch (error) {
    console.error('Error updating lifecycle metrics:', error);
    res.status(500).json({ error: 'Failed to update lifecycle metrics' });
  }
});

// Get lifecycle analytics
router.get('/analytics/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const months = parseInt(req.query.months as string) || 12;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const metrics = await lifecycleService.getLifecycleMetrics(civilizationId, months);
    const healthSummary = await lifecycleService.getCorporateHealthSummary(civilizationId);
    const ecosystem = await lifecycleEngine.assessCorporateEcosystem(civilizationId);
    
    // Calculate trends
    const trends = calculateTrends(metrics);
    
    res.json({
      currentState: {
        ...healthSummary,
        ...ecosystem
      },
      historicalMetrics: metrics,
      trends,
      insights: generateInsights(healthSummary, ecosystem, trends),
      recommendations: generateEcosystemRecommendations(healthSummary, ecosystem)
    });

  } catch (error) {
    console.error('Error fetching lifecycle analytics:', error);
    res.status(500).json({ error: 'Failed to fetch lifecycle analytics' });
  }
});

// Helper functions
function generateHealthRecommendations(health: any): string[] {
  const recommendations = [];
  
  if (health.financial_health < 50) {
    recommendations.push('Improve financial management and reduce debt');
  }
  
  if (health.operational_health < 50) {
    recommendations.push('Optimize operations and improve efficiency');
  }
  
  if (health.market_health < 50) {
    recommendations.push('Strengthen market position and competitive advantages');
  }
  
  if (health.innovation_index < 50) {
    recommendations.push('Increase R&D investment and innovation initiatives');
  }
  
  if (health.bankruptcy_risk > 70) {
    recommendations.push('Urgent: Consider restructuring or strategic alternatives');
  }
  
  return recommendations;
}

function calculateTrends(metrics: any[]): any {
  if (metrics.length < 2) return {};
  
  const latest = metrics[0];
  const previous = metrics[1];
  
  return {
    corporationGrowth: ((latest.total_corporations - previous.total_corporations) / previous.total_corporations) * 100,
    healthTrend: latest.average_health_score - previous.average_health_score,
    innovationTrend: latest.innovation_index - previous.innovation_index,
    bankruptcyTrend: latest.bankruptcies - previous.bankruptcies,
    maActivity: latest.mergers_acquisitions - previous.mergers_acquisitions
  };
}

function generateInsights(healthSummary: any, ecosystem: any, trends: any): string[] {
  const insights = [];
  
  if (healthSummary.averageHealth > 70) {
    insights.push('Corporate ecosystem is healthy with strong fundamentals');
  } else if (healthSummary.averageHealth < 40) {
    insights.push('Corporate ecosystem shows signs of stress');
  }
  
  if (ecosystem.bankruptcyRisk.length > 0) {
    insights.push(`${ecosystem.bankruptcyRisk.length} companies at high bankruptcy risk`);
  }
  
  if (ecosystem.acquisitionTargets.length > 5) {
    insights.push('High M&A activity expected with many attractive targets');
  }
  
  if (trends.innovationTrend > 5) {
    insights.push('Innovation levels are increasing across the ecosystem');
  }
  
  return insights;
}

function generateEcosystemRecommendations(healthSummary: any, ecosystem: any): string[] {
  const recommendations = [];
  
  if (ecosystem.strugglingCompanies > ecosystem.healthyCompanies) {
    recommendations.push('Consider market intervention to support struggling companies');
  }
  
  if (healthSummary.innovationLeaders < healthSummary.totalCorporations * 0.1) {
    recommendations.push('Incentivize innovation through R&D tax credits or grants');
  }
  
  if (ecosystem.mergerOpportunities > 0) {
    recommendations.push('Monitor merger opportunities for market concentration');
  }
  
  return recommendations;
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'corporate-lifecycle', corporateLifecycleKnobSystem, applyCorporateLifecycleKnobsToGameState);

export default router;
