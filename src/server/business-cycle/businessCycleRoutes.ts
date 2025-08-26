/**
 * Business Cycle API Routes
 * Manages economic cycles, growth periods, and recession dynamics
 * Enhanced with 24 AI-controllable knobs for dynamic economic simulation
 */

import { Router } from 'express';
import { Pool } from 'pg';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

export interface BusinessCycleData {
  campaignId: string;
  civilizationId: string;
  currentPhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  cycleLength: number; // months
  gdpGrowthRate: number;
  unemploymentRate: number;
  inflationRate: number;
  consumerConfidence: number;
  businessInvestment: number;
  governmentSpending: number;
  tradeBalance: number;
  lastUpdated: Date;
}

export interface BusinessCycleMetrics {
  cycleHistory: BusinessCyclePhase[];
  averageCycleLength: number;
  volatilityIndex: number;
  recessionProbability: number;
  expansionStrength: number;
  economicIndicators: EconomicIndicator[];
}

export interface BusinessCyclePhase {
  phase: string;
  startDate: Date;
  endDate?: Date;
  duration: number;
  peakGDP: number;
  troughGDP: number;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface EconomicIndicator {
  name: string;
  value: number;
  trend: 'rising' | 'falling' | 'stable';
  significance: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

// Enhanced Knob System for Business Cycle Management
const businessCycleKnobs = new EnhancedKnobSystem('business_cycle', {
  // Cycle Dynamics (8 knobs)
  cycle_volatility: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'intensity',
    description: 'Controls the volatility and unpredictability of business cycles'
  },
  expansion_duration_modifier: {
    min: 0.3, max: 3.0, default: 1.0, unit: 'multiplier',
    description: 'Modifies the typical duration of economic expansion phases'
  },
  recession_severity_factor: {
    min: 0.1, max: 2.0, default: 1.0, unit: 'multiplier',
    description: 'Controls the severity of economic recessions and contractions'
  },
  recovery_speed: {
    min: 0.2, max: 2.5, default: 1.0, unit: 'multiplier',
    description: 'Determines how quickly the economy recovers from downturns'
  },
  peak_sustainability: {
    min: 0.1, max: 1.0, default: 0.6, unit: 'stability',
    description: 'How long economic peaks can be sustained before decline'
  },
  trough_resistance: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'resilience',
    description: 'Resistance to reaching economic troughs and depressions'
  },
  external_shock_sensitivity: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'sensitivity',
    description: 'Sensitivity to external economic shocks and global events'
  },
  cycle_predictability: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'predictability',
    description: 'How predictable business cycle patterns are to economists'
  },

  // Growth Factors (8 knobs)
  productivity_growth_rate: {
    min: 0.0, max: 0.1, default: 0.025, unit: 'annual_rate',
    description: 'Base productivity growth rate driving long-term expansion'
  },
  innovation_impact: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'multiplier',
    description: 'Impact of technological innovation on economic growth'
  },
  investment_efficiency: {
    min: 0.3, max: 1.5, default: 1.0, unit: 'efficiency',
    description: 'Efficiency of business and government investment spending'
  },
  consumer_spending_propensity: {
    min: 0.4, max: 1.2, default: 0.8, unit: 'propensity',
    description: 'Propensity of consumers to spend rather than save'
  },
  export_competitiveness: {
    min: 0.2, max: 1.8, default: 1.0, unit: 'competitiveness',
    description: 'International competitiveness of domestic exports'
  },
  labor_market_flexibility: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'flexibility',
    description: 'Flexibility of labor markets to adapt to economic changes'
  },
  capital_formation_rate: {
    min: 0.1, max: 0.4, default: 0.2, unit: 'rate',
    description: 'Rate of capital formation and infrastructure investment'
  },
  entrepreneurship_vitality: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'vitality',
    description: 'Vitality of entrepreneurship and new business formation'
  },

  // Recession Dynamics (8 knobs)
  recession_trigger_threshold: {
    min: 0.1, max: 0.8, default: 0.4, unit: 'threshold',
    description: 'Economic stress threshold that triggers recession conditions'
  },
  unemployment_sensitivity: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'sensitivity',
    description: 'Sensitivity of unemployment to economic downturns'
  },
  deflationary_pressure: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'pressure',
    description: 'Tendency toward deflation during economic contractions'
  },
  credit_market_tightening: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'tightening',
    description: 'Degree of credit market tightening during downturns'
  },
  business_failure_rate: {
    min: 0.0, max: 0.2, default: 0.05, unit: 'rate',
    description: 'Rate of business failures during recession periods'
  },
  consumer_confidence_volatility: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'volatility',
    description: 'Volatility of consumer confidence during economic stress'
  },
  government_intervention_speed: {
    min: 0.1, max: 2.0, default: 1.0, unit: 'speed',
    description: 'Speed of government intervention during economic crises'
  },
  recession_contagion_effect: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'contagion',
    description: 'Contagion effect spreading recession across economic sectors'
  }
});

// AI Prompts for Business Cycle Analysis
export const BUSINESS_CYCLE_AI_PROMPTS = {
  CYCLE_ANALYSIS: `Analyze the current business cycle phase and economic indicators. Consider:
- Current phase characteristics and typical duration
- Leading indicators suggesting phase transitions
- Economic fundamentals and structural factors
- Policy implications and intervention opportunities
- Risk factors and potential external shocks
- Historical patterns and cycle comparisons
Provide analysis with confidence levels and recommendations.`,

  RECESSION_PREDICTION: `Assess recession probability and economic vulnerabilities. Evaluate:
- Leading recession indicators and warning signs
- Economic imbalances and structural weaknesses
- Credit conditions and financial market stress
- Consumer and business confidence trends
- Government fiscal position and policy space
- External economic risks and global conditions
Provide probability assessment and risk mitigation strategies.`,

  GROWTH_OPTIMIZATION: `Analyze growth potential and optimization strategies. Consider:
- Productivity drivers and innovation capacity
- Investment climate and capital formation
- Labor market dynamics and skills development
- Export competitiveness and trade opportunities
- Infrastructure needs and development priorities
- Regulatory environment and business climate
Provide growth enhancement recommendations with implementation priorities.`,

  POLICY_RESPONSE: `Evaluate policy responses to current economic conditions. Assess:
- Fiscal policy options and effectiveness
- Monetary policy coordination and transmission
- Structural reform opportunities
- Counter-cyclical policy measures
- International coordination needs
- Long-term sustainability considerations
Provide policy recommendations with timing and sequencing guidance.`
};

export function createBusinessCycleRoutes(pool: Pool) {
  const router = Router();

  // Core Business Cycle Endpoints
  
  // Get current business cycle status
  router.get('/status/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM business_cycles 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY last_updated DESC LIMIT 1
      `, [campaignId, civilizationId]);

      if (result.rows.length === 0) {
        // Initialize default business cycle
        const defaultCycle = await initializeBusinessCycle(pool, campaignId, civilizationId);
        return res.json(defaultCycle);
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching business cycle status:', error);
      res.status(500).json({ error: 'Failed to fetch business cycle status' });
    }
  });

  // Get business cycle metrics and analytics
  router.get('/metrics/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const metrics = await calculateBusinessCycleMetrics(pool, campaignId, civilizationId);
      res.json(metrics);
    } catch (error) {
      console.error('Error calculating business cycle metrics:', error);
      res.status(500).json({ error: 'Failed to calculate business cycle metrics' });
    }
  });

  // Update business cycle phase
  router.post('/update-phase/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { phase, gdpGrowthRate, unemploymentRate, inflationRate } = req.body;
      
      const result = await pool.query(`
        UPDATE business_cycles 
        SET current_phase = $3, gdp_growth_rate = $4, unemployment_rate = $5, 
            inflation_rate = $6, last_updated = NOW()
        WHERE campaign_id = $1 AND civilization_id = $2
        RETURNING *
      `, [campaignId, civilizationId, phase, gdpGrowthRate, unemploymentRate, inflationRate]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating business cycle phase:', error);
      res.status(500).json({ error: 'Failed to update business cycle phase' });
    }
  });

  // Simulate economic shock
  router.post('/simulate-shock/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { shockType, severity, duration } = req.body;
      
      const shockResult = await simulateEconomicShock(pool, campaignId, civilizationId, shockType, severity, duration);
      res.json(shockResult);
    } catch (error) {
      console.error('Error simulating economic shock:', error);
      res.status(500).json({ error: 'Failed to simulate economic shock' });
    }
  });

  // Get cycle history
  router.get('/history/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { limit = 10 } = req.query;
      
      const result = await pool.query(`
        SELECT * FROM business_cycle_history 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY start_date DESC LIMIT $3
      `, [campaignId, civilizationId, limit]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching business cycle history:', error);
      res.status(500).json({ error: 'Failed to fetch business cycle history' });
    }
  });

  // Enhanced Knob System Endpoints
  createEnhancedKnobEndpoints(router, 'business-cycle', businessCycleKnobs, () => {
    applyBusinessCycleKnobsToSimulation();
  });

  // AI Analysis Endpoints
  router.post('/ai-analysis/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;
      
      const prompt = BUSINESS_CYCLE_AI_PROMPTS[promptType as keyof typeof BUSINESS_CYCLE_AI_PROMPTS];
      if (!prompt) {
        return res.status(400).json({ error: 'Invalid prompt type' });
      }

      // Here you would integrate with your AI service
      // For now, return a structured response
      const analysis = await generateBusinessCycleAnalysis(prompt, parameters);
      
      res.json({
        promptType,
        analysis,
        parameters,
        timestamp: new Date(),
        confidence: 0.85
      });
    } catch (error) {
      console.error('Error generating business cycle AI analysis:', error);
      res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
  });

  return router;
}

// Helper Functions

async function initializeBusinessCycle(pool: Pool, campaignId: string, civilizationId: string): Promise<BusinessCycleData> {
  const defaultCycle: BusinessCycleData = {
    campaignId,
    civilizationId,
    currentPhase: 'expansion',
    cycleLength: 84, // 7 years average
    gdpGrowthRate: 0.025,
    unemploymentRate: 0.05,
    inflationRate: 0.02,
    consumerConfidence: 0.7,
    businessInvestment: 0.15,
    governmentSpending: 0.2,
    tradeBalance: 0.02,
    lastUpdated: new Date()
  };

  await pool.query(`
    INSERT INTO business_cycles (
      campaign_id, civilization_id, current_phase, cycle_length,
      gdp_growth_rate, unemployment_rate, inflation_rate, consumer_confidence,
      business_investment, government_spending, trade_balance, last_updated
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `, [
    campaignId, civilizationId, defaultCycle.currentPhase, defaultCycle.cycleLength,
    defaultCycle.gdpGrowthRate, defaultCycle.unemploymentRate, defaultCycle.inflationRate,
    defaultCycle.consumerConfidence, defaultCycle.businessInvestment, defaultCycle.governmentSpending,
    defaultCycle.tradeBalance, defaultCycle.lastUpdated
  ]);

  return defaultCycle;
}

async function calculateBusinessCycleMetrics(pool: Pool, campaignId: string, civilizationId: string): Promise<BusinessCycleMetrics> {
  // Implementation would calculate comprehensive metrics
  // This is a simplified version
  return {
    cycleHistory: [],
    averageCycleLength: 84,
    volatilityIndex: 0.3,
    recessionProbability: 0.15,
    expansionStrength: 0.7,
    economicIndicators: [
      { name: 'GDP Growth', value: 0.025, trend: 'rising', significance: 'high', lastUpdated: new Date() },
      { name: 'Unemployment', value: 0.05, trend: 'falling', significance: 'high', lastUpdated: new Date() },
      { name: 'Inflation', value: 0.02, trend: 'stable', significance: 'medium', lastUpdated: new Date() }
    ]
  };
}

async function simulateEconomicShock(pool: Pool, campaignId: string, civilizationId: string, shockType: string, severity: number, duration: number) {
  // Implementation would simulate various economic shocks
  return {
    shockType,
    severity,
    duration,
    estimatedImpact: {
      gdpImpact: -severity * 0.1,
      unemploymentIncrease: severity * 0.02,
      recoveryTime: duration * (1 + severity)
    },
    timestamp: new Date()
  };
}

async function generateBusinessCycleAnalysis(prompt: string, parameters: any) {
  // This would integrate with your AI service
  // For now, return a mock analysis
  return {
    summary: "Economic analysis based on current indicators and cycle position",
    keyFindings: [
      "Economy showing signs of late-cycle expansion",
      "Inflation pressures building gradually",
      "Labor market approaching full employment"
    ],
    recommendations: [
      "Monitor for overheating indicators",
      "Prepare counter-cyclical policy tools",
      "Maintain fiscal discipline"
    ],
    riskFactors: [
      "External trade tensions",
      "Asset price bubbles",
      "Demographic headwinds"
    ]
  };
}

function applyBusinessCycleKnobsToSimulation() {
  const knobValues = businessCycleKnobs.getAllKnobValues();
  
  // Apply knob values to simulation parameters
  console.log('🎛️ Business Cycle knobs applied to simulation:', {
    cycle_volatility: knobValues.cycle_volatility,
    expansion_duration: knobValues.expansion_duration_modifier,
    recession_severity: knobValues.recession_severity_factor,
    recovery_speed: knobValues.recovery_speed
  });
  
  // Here you would integrate with the actual simulation engine
  // to apply these knob values to the business cycle calculations
}
