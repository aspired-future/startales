import express from 'express';
import InflationTrackingService from './InflationTrackingService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();
const inflationService = new InflationTrackingService();

// Enhanced AI Knobs for Economics/Inflation System
const economicsKnobsData = {
  // Monetary Policy
  interest_rate_sensitivity: 0.7,       // Interest rate policy sensitivity
  money_supply_control: 0.6,            // Money supply growth control
  inflation_targeting_strictness: 0.8,  // Inflation targeting adherence
  
  // Fiscal Policy
  government_spending_multiplier: 0.6,  // Government spending economic impact
  tax_policy_effectiveness: 0.7,        // Tax policy economic effectiveness
  deficit_tolerance: 0.4,               // Budget deficit tolerance level
  
  // Price Controls & Regulation
  price_control_enforcement: 0.3,       // Price control mechanism strength
  market_intervention_readiness: 0.5,   // Market intervention willingness
  competition_policy_strength: 0.8,     // Competition and antitrust enforcement
  
  // Labor Market
  wage_growth_management: 0.6,          // Wage growth policy influence
  employment_priority: 0.8,             // Employment vs inflation priority
  labor_market_flexibility: 0.7,        // Labor market regulatory flexibility
  
  // Supply Chain & Trade
  supply_chain_resilience: 0.7,         // Supply chain stability measures
  trade_policy_openness: 0.6,           // International trade openness
  strategic_reserve_management: 0.8,    // Strategic commodity reserve management
  
  // Financial Stability
  banking_regulation_strictness: 0.8,   // Banking sector regulation strength
  credit_market_oversight: 0.7,         // Credit market monitoring intensity
  systemic_risk_prevention: 0.9,        // Systemic financial risk prevention
  
  // Economic Measurement
  inflation_measurement_accuracy: 0.9,  // CPI and inflation measurement precision
  economic_data_transparency: 0.8,      // Economic statistics transparency
  forecasting_model_sophistication: 0.7, // Economic forecasting capability
  
  // Crisis Response
  economic_crisis_preparedness: 0.8,    // Economic crisis response readiness
  emergency_policy_flexibility: 0.7,    // Emergency policy implementation speed
  international_coordination: 0.6,      // International economic policy coordination
  
  // Innovation & Growth
  productivity_enhancement_focus: 0.7,  // Productivity growth policy focus
  innovation_investment_level: 0.6,     // Innovation and R&D investment
  infrastructure_development_priority: 0.8, // Infrastructure investment priority
  
  // Social & Environmental
  inequality_reduction_priority: 0.6,   // Income inequality reduction focus
  environmental_cost_integration: 0.5,  // Environmental costs in economic policy
  social_safety_net_strength: 0.7,      // Social safety net robustness
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Economics
const economicsKnobSystem = new EnhancedKnobSystem(economicsKnobsData);

// Apply economics knobs to game state
function applyEconomicsKnobsToGameState() {
  const knobs = economicsKnobSystem.knobs;
  
  // Apply monetary policy settings
  const monetaryPolicyEffectiveness = (knobs.interest_rate_sensitivity + knobs.money_supply_control + 
    knobs.inflation_targeting_strictness) / 3;
  
  // Apply fiscal policy settings
  const fiscalPolicyImpact = (knobs.government_spending_multiplier + knobs.tax_policy_effectiveness + 
    (1 - knobs.deficit_tolerance)) / 3;
  
  // Apply market regulation settings
  const marketRegulation = (knobs.price_control_enforcement + knobs.market_intervention_readiness + 
    knobs.competition_policy_strength) / 3;
  
  // Apply labor market settings
  const laborMarketHealth = (knobs.wage_growth_management + knobs.employment_priority + 
    knobs.labor_market_flexibility) / 3;
  
  // Apply financial stability settings
  const financialStability = (knobs.banking_regulation_strictness + knobs.credit_market_oversight + 
    knobs.systemic_risk_prevention) / 3;
  
  // Apply crisis response settings
  const crisisResilience = (knobs.economic_crisis_preparedness + knobs.emergency_policy_flexibility + 
    knobs.international_coordination) / 3;
  
  console.log('Applied economics knobs to game state:', {
    monetaryPolicyEffectiveness,
    fiscalPolicyImpact,
    marketRegulation,
    laborMarketHealth,
    financialStability,
    crisisResilience
  });
}

/**
 * Get current inflation metrics for a civilization
 */
router.get('/metrics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const metrics = await inflationService.calculateInflationMetrics(civilizationId);
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting inflation metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inflation metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate inflation forecast for a civilization
 */
router.get('/forecast/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const forecast = await inflationService.generateInflationForecast(civilizationId);
    
    res.json({
      success: true,
      data: forecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating inflation forecast:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate inflation forecast',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Analyze monetary policy impact on inflation
 */
router.post('/policy-impact/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const policyChange = req.body;
    
    const impact = await inflationService.analyzeMonetaryPolicyImpact(civilizationId, policyChange);
    
    res.json({
      success: true,
      data: impact,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing policy impact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze policy impact',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create a new price basket for CPI calculation
 */
router.post('/price-basket', async (req, res) => {
  try {
    const { name, description, items } = req.body;
    
    if (!name || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Name and items array are required'
      });
    }
    
    const basket = await inflationService.createPriceBasket(name, description, items);
    
    res.json({
      success: true,
      data: basket,
      message: 'Price basket created successfully'
    });
  } catch (error) {
    console.error('Error creating price basket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create price basket',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update price basket with new prices
 */
router.put('/price-basket/:basketId', async (req, res) => {
  try {
    const { basketId } = req.params;
    const { prices } = req.body;
    
    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Prices object is required'
      });
    }
    
    const updatedBasket = await inflationService.updatePriceBasket(basketId, prices);
    
    res.json({
      success: true,
      data: updatedBasket,
      message: 'Price basket updated successfully'
    });
  } catch (error) {
    console.error('Error updating price basket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update price basket',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get inflation dashboard data
 */
router.get('/dashboard/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    
    // Get comprehensive inflation data for dashboard
    const [metrics, forecast] = await Promise.all([
      inflationService.calculateInflationMetrics(civilizationId),
      inflationService.generateInflationForecast(civilizationId)
    ]);
    
    const dashboard = {
      currentInflation: {
        headline: metrics.cpi.overall,
        core: metrics.cpi.core,
        food: metrics.cpi.food,
        energy: metrics.cpi.energy,
        lastUpdated: metrics.timestamp
      },
      
      forecast: {
        shortTerm: forecast.forecasts.threeMonth,
        mediumTerm: forecast.forecasts.oneYear,
        longTerm: forecast.forecasts.fiveYear,
        confidence: forecast.confidence.oneYear
      },
      
      drivers: {
        demandPull: metrics.drivers.demandPull,
        costPush: metrics.drivers.costPush,
        monetary: metrics.drivers.monetaryExpansion,
        expectations: metrics.drivers.expectations
      },
      
      sectors: {
        agriculture: metrics.sectors.agriculture,
        manufacturing: metrics.sectors.manufacturing,
        services: metrics.sectors.services,
        technology: metrics.sectors.technology
      },
      
      monetaryTransmission: {
        interestRatePass: metrics.transmission.interestRatePass,
        creditGrowth: metrics.transmission.creditGrowth,
        moneySupplyGrowth: metrics.transmission.moneySupplyGrowth
      },
      
      risks: {
        upside: forecast.risks.upside,
        downside: forecast.risks.downside
      }
    };
    
    res.json({
      success: true,
      data: dashboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting inflation dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inflation dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get inflation trends and historical data
 */
router.get('/trends/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { period = '12' } = req.query; // Default to 12 months
    
    // This would fetch historical inflation data
    // For now, return mock trend data
    const trends = {
      period: parseInt(period as string),
      data: [
        { month: '2024-01', headline: 2.1, core: 1.8, food: 3.2, energy: 4.1 },
        { month: '2024-02', headline: 2.3, core: 1.9, food: 3.5, energy: 3.8 },
        { month: '2024-03', headline: 2.0, core: 1.7, food: 2.9, energy: 3.2 },
        { month: '2024-04', headline: 1.8, core: 1.6, food: 2.4, energy: 2.8 },
        { month: '2024-05', headline: 2.2, core: 1.8, food: 3.1, energy: 3.6 },
        { month: '2024-06', headline: 2.4, core: 2.0, food: 3.4, energy: 4.2 }
      ],
      
      averages: {
        headline: 2.1,
        core: 1.8,
        food: 3.1,
        energy: 3.6
      },
      
      volatility: {
        headline: 0.2,
        core: 0.1,
        food: 0.4,
        energy: 0.5
      }
    };
    
    res.json({
      success: true,
      data: trends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting inflation trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inflation trends',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get Central Bank inflation analysis for advisory recommendations
 */
router.get('/central-bank-analysis/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    
    const metrics = await inflationService.calculateInflationMetrics(civilizationId);
    const forecast = await inflationService.generateInflationForecast(civilizationId);
    
    // Generate Central Bank style analysis and recommendations
    const analysis = {
      currentAssessment: {
        headline: metrics.cpi.overall,
        core: metrics.cpi.core,
        target: 2.0, // Typical inflation target
        deviation: metrics.cpi.core - 2.0,
        assessment: metrics.cpi.core > 2.5 ? 'above_target' : 
                   metrics.cpi.core < 1.5 ? 'below_target' : 'on_target'
      },
      
      outlook: {
        shortTerm: forecast.forecasts.threeMonth,
        mediumTerm: forecast.forecasts.oneYear,
        risks: forecast.risks,
        confidence: forecast.confidence.oneYear
      },
      
      recommendations: {
        policy: metrics.cpi.core > 2.5 ? 'tighten' : 
                metrics.cpi.core < 1.5 ? 'ease' : 'maintain',
        rationale: generatePolicyRationale(metrics, forecast),
        urgency: metrics.cpi.core > 3.0 || metrics.cpi.core < 1.0 ? 'high' : 'moderate',
        
        suggestedActions: generatePolicyActions(metrics, forecast)
      },
      
      transmission: {
        effectiveness: metrics.transmission.interestRatePass,
        channels: ['Interest rate channel', 'Credit channel', 'Exchange rate channel', 'Expectations channel'],
        lags: {
          immediate: '0-3 months',
          peak: '12-18 months',
          full: '18-24 months'
        }
      }
    };
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting central bank analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get central bank analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
function generatePolicyRationale(metrics: any, forecast: any): string {
  const coreInflation = metrics.cpi.core;
  const target = 2.0;
  
  if (coreInflation > target + 0.5) {
    return `Core inflation at ${coreInflation.toFixed(1)}% is significantly above the ${target}% target. Monetary tightening recommended to anchor inflation expectations and prevent wage-price spiral.`;
  } else if (coreInflation < target - 0.5) {
    return `Core inflation at ${coreInflation.toFixed(1)}% is below the ${target}% target. Monetary easing may be warranted to support price stability and economic growth.`;
  } else {
    return `Core inflation at ${coreInflation.toFixed(1)}% is near the ${target}% target. Current monetary stance appears appropriate, continue monitoring economic conditions.`;
  }
}

function generatePolicyActions(metrics: any, forecast: any): string[] {
  const coreInflation = metrics.cpi.core;
  const target = 2.0;
  
  if (coreInflation > target + 0.5) {
    return [
      'Consider raising policy interest rates by 25-50 basis points',
      'Communicate commitment to price stability',
      'Monitor wage growth and inflation expectations closely',
      'Prepare for potential additional tightening if needed'
    ];
  } else if (coreInflation < target - 0.5) {
    return [
      'Consider lowering policy interest rates by 25-50 basis points',
      'Provide forward guidance on accommodative stance',
      'Monitor deflationary risks and economic growth',
      'Consider quantitative easing if rates approach zero bound'
    ];
  } else {
    return [
      'Maintain current policy stance',
      'Continue data-dependent approach',
      'Monitor inflation expectations and wage growth',
      'Prepare for policy adjustment if conditions change'
    ];
  }
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'economics', economicsKnobSystem, applyEconomicsKnobsToGameState);

export default router;
