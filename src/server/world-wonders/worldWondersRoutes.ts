/**
 * World Wonders & Household Economics API Routes
 * Manages world wonders construction, household economic dynamics, and cultural achievements
 * Enhanced with 24 AI-controllable knobs for dynamic civilization development
 */

import { Router } from 'express';
import { Pool } from 'pg';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

export interface WorldWonder {
  id: string;
  name: string;
  type: 'cultural' | 'economic' | 'military' | 'scientific' | 'religious' | 'natural';
  constructionCost: number;
  constructionTime: number; // months
  maintenanceCost: number;
  culturalImpact: number;
  economicImpact: number;
  prestigeValue: number;
  requirements: string[];
  effects: WonderEffect[];
  status: 'available' | 'under_construction' | 'completed' | 'destroyed';
  completionDate?: Date;
  location?: string;
}

export interface WonderEffect {
  type: 'economic' | 'cultural' | 'military' | 'scientific' | 'happiness';
  magnitude: number;
  duration: 'permanent' | 'temporary';
  scope: 'local' | 'regional' | 'global';
}

export interface HouseholdEconomics {
  campaignId: string;
  civilizationId: string;
  averageIncome: number;
  medianIncome: number;
  incomeDistribution: IncomeDistribution;
  householdSavingsRate: number;
  consumerSpending: ConsumerSpending;
  housingMarket: HousingMarket;
  debtLevels: DebtLevels;
  economicMobility: EconomicMobility;
  lastUpdated: Date;
}

export interface IncomeDistribution {
  giniCoefficient: number;
  quintileShares: number[]; // 5 quintiles
  top1Percent: number;
  top10Percent: number;
  povertyRate: number;
}

export interface ConsumerSpending {
  totalSpending: number;
  categories: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    education: number;
    entertainment: number;
    savings: number;
    other: number;
  };
  spendingConfidence: number;
}

export interface HousingMarket {
  averageHomePrice: number;
  homeOwnershipRate: number;
  rentToIncomeRatio: number;
  housingAffordabilityIndex: number;
  constructionActivity: number;
  mortgageRates: number;
}

export interface DebtLevels {
  totalHouseholdDebt: number;
  debtToIncomeRatio: number;
  mortgageDebt: number;
  consumerDebt: number;
  studentDebt: number;
  defaultRates: number;
}

export interface EconomicMobility {
  intergenerationalMobility: number;
  socialMobilityIndex: number;
  educationAccessIndex: number;
  entrepreneurshipRate: number;
  jobMarketFlexibility: number;
}

// Enhanced Knob System for World Wonders & Household Economics
const worldWondersKnobs = new EnhancedKnobSystem('world_wonders', {
  // Wonder Construction (8 knobs)
  construction_speed_modifier: {
    min: 0.2, max: 3.0, default: 1.0, unit: 'multiplier',
    description: 'Modifies the speed of world wonder construction projects'
  },
  construction_cost_efficiency: {
    min: 0.5, max: 2.0, default: 1.0, unit: 'efficiency',
    description: 'Efficiency of resource utilization in wonder construction'
  },
  wonder_availability_rate: {
    min: 0.1, max: 1.0, default: 0.6, unit: 'rate',
    description: 'Rate at which new world wonders become available for construction'
  },
  cultural_wonder_preference: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'preference',
    description: 'Civilization preference for cultural vs economic wonders'
  },
  maintenance_cost_factor: {
    min: 0.3, max: 2.0, default: 1.0, unit: 'multiplier',
    description: 'Multiplier for ongoing wonder maintenance costs'
  },
  wonder_synergy_bonus: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'bonus',
    description: 'Bonus effects when multiple wonders work together'
  },
  natural_wonder_discovery_rate: {
    min: 0.0, max: 0.1, default: 0.02, unit: 'rate',
    description: 'Rate of discovering natural wonders through exploration'
  },
  wonder_prestige_multiplier: {
    min: 0.5, max: 3.0, default: 1.5, unit: 'multiplier',
    description: 'Multiplier for prestige gained from completed wonders'
  },

  // Household Income & Distribution (8 knobs)
  income_growth_rate: {
    min: -0.05, max: 0.15, default: 0.03, unit: 'annual_rate',
    description: 'Base rate of household income growth'
  },
  income_inequality_tendency: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'tendency',
    description: 'Tendency toward income inequality (higher = more unequal)'
  },
  social_mobility_factor: {
    min: 0.1, max: 1.0, default: 0.6, unit: 'mobility',
    description: 'Factor determining ease of social and economic mobility'
  },
  education_access_quality: {
    min: 0.2, max: 1.0, default: 0.7, unit: 'quality',
    description: 'Quality and accessibility of education affecting income potential'
  },
  entrepreneurship_support: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'support',
    description: 'Level of support for entrepreneurship and small business creation'
  },
  minimum_wage_effectiveness: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'effectiveness',
    description: 'Effectiveness of minimum wage policies in reducing poverty'
  },
  wealth_redistribution_efficiency: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'efficiency',
    description: 'Efficiency of wealth redistribution mechanisms'
  },
  job_market_dynamism: {
    min: 0.2, max: 1.0, default: 0.7, unit: 'dynamism',
    description: 'Dynamism and flexibility of the job market'
  },

  // Consumer Behavior & Spending (8 knobs)
  consumer_confidence_volatility: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'volatility',
    description: 'Volatility of consumer confidence and spending patterns'
  },
  savings_propensity: {
    min: 0.05, max: 0.4, default: 0.15, unit: 'propensity',
    description: 'Household propensity to save rather than spend'
  },
  housing_market_speculation: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'speculation',
    description: 'Level of speculative activity in housing markets'
  },
  consumer_debt_tolerance: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'tolerance',
    description: 'Household tolerance for taking on consumer debt'
  },
  luxury_spending_sensitivity: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'sensitivity',
    description: 'Sensitivity of luxury spending to economic conditions'
  },
  essential_spending_stability: {
    min: 0.5, max: 1.0, default: 0.8, unit: 'stability',
    description: 'Stability of spending on essential goods and services'
  },
  credit_access_ease: {
    min: 0.1, max: 1.0, default: 0.6, unit: 'access',
    description: 'Ease of access to credit for household purchases'
  },
  financial_literacy_level: {
    min: 0.2, max: 1.0, default: 0.5, unit: 'literacy',
    description: 'Average financial literacy level affecting spending decisions'
  }
});

// AI Prompts for World Wonders & Household Economics Analysis
export const WORLD_WONDERS_AI_PROMPTS = {
  WONDER_STRATEGY: `Analyze optimal world wonder construction strategy. Consider:
- Available resources and construction capacity
- Strategic value of different wonder types
- Cultural vs economic vs military priorities
- Synergies between existing and planned wonders
- Maintenance cost sustainability
- Prestige and diplomatic benefits
- Long-term civilization development goals
Provide prioritized wonder recommendations with justification.`,

  HOUSEHOLD_ECONOMICS_ANALYSIS: `Evaluate household economic health and trends. Assess:
- Income distribution and inequality trends
- Consumer spending patterns and sustainability
- Housing market conditions and affordability
- Debt levels and financial stability risks
- Economic mobility and opportunity access
- Social cohesion and stability implications
- Policy intervention opportunities
Provide analysis with recommendations for economic policy.`,

  CULTURAL_DEVELOPMENT: `Analyze cultural development through wonders and economics. Evaluate:
- Cultural wonder impact on civilization identity
- Household spending on cultural activities
- Education and cultural access patterns
- Tourism and cultural exchange benefits
- Preservation of cultural heritage
- Innovation and artistic expression support
- Cultural soft power and international influence
Provide cultural development strategy recommendations.`,

  ECONOMIC_INEQUALITY: `Assess economic inequality and social stability. Consider:
- Income and wealth distribution patterns
- Access to opportunities and social mobility
- Housing affordability and geographic segregation
- Education and skill development disparities
- Healthcare and social service access
- Political and social tension indicators
- Policy tools for inequality reduction
Provide inequality analysis with intervention strategies.`
};

export function createWorldWondersRoutes(pool: Pool) {
  const router = Router();

  // World Wonders Endpoints
  
  // Get available wonders for civilization
  router.get('/wonders/available/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT w.*, cw.status, cw.construction_progress, cw.completion_date
        FROM world_wonders w
        LEFT JOIN civilization_wonders cw ON w.id = cw.wonder_id 
          AND cw.campaign_id = $1 AND cw.civilization_id = $2
        WHERE w.is_active = true
        ORDER BY w.type, w.name
      `, [campaignId, civilizationId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching available wonders:', error);
      res.status(500).json({ error: 'Failed to fetch available wonders' });
    }
  });

  // Start wonder construction
  router.post('/wonders/construct/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { wonderId, location } = req.body;
      
      const result = await pool.query(`
        INSERT INTO civilization_wonders (
          campaign_id, civilization_id, wonder_id, status, 
          construction_progress, location, started_at
        ) VALUES ($1, $2, $3, 'under_construction', 0, $4, NOW())
        RETURNING *
      `, [campaignId, civilizationId, wonderId, location]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error starting wonder construction:', error);
      res.status(500).json({ error: 'Failed to start wonder construction' });
    }
  });

  // Get civilization's wonders
  router.get('/wonders/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT w.*, cw.status, cw.construction_progress, cw.completion_date, cw.location
        FROM world_wonders w
        JOIN civilization_wonders cw ON w.id = cw.wonder_id
        WHERE cw.campaign_id = $1 AND cw.civilization_id = $2
        ORDER BY cw.started_at DESC
      `, [campaignId, civilizationId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching civilization wonders:', error);
      res.status(500).json({ error: 'Failed to fetch civilization wonders' });
    }
  });

  // Household Economics Endpoints
  
  // Get household economics data
  router.get('/household-economics/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM household_economics 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY last_updated DESC LIMIT 1
      `, [campaignId, civilizationId]);

      if (result.rows.length === 0) {
        const defaultEconomics = await initializeHouseholdEconomics(pool, campaignId, civilizationId);
        return res.json(defaultEconomics);
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching household economics:', error);
      res.status(500).json({ error: 'Failed to fetch household economics data' });
    }
  });

  // Update household economics
  router.post('/household-economics/update/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const economicsData = req.body;
      
      const result = await pool.query(`
        UPDATE household_economics 
        SET average_income = $3, median_income = $4, gini_coefficient = $5,
            savings_rate = $6, consumer_spending = $7, last_updated = NOW()
        WHERE campaign_id = $1 AND civilization_id = $2
        RETURNING *
      `, [
        campaignId, civilizationId, economicsData.averageIncome, 
        economicsData.medianIncome, economicsData.giniCoefficient,
        economicsData.savingsRate, JSON.stringify(economicsData.consumerSpending)
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating household economics:', error);
      res.status(500).json({ error: 'Failed to update household economics' });
    }
  });

  // Get economic mobility metrics
  router.get('/economic-mobility/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const mobility = await calculateEconomicMobility(pool, campaignId, civilizationId);
      res.json(mobility);
    } catch (error) {
      console.error('Error calculating economic mobility:', error);
      res.status(500).json({ error: 'Failed to calculate economic mobility' });
    }
  });

  // Get housing market data
  router.get('/housing-market/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM housing_market_data 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY last_updated DESC LIMIT 1
      `, [campaignId, civilizationId]);

      res.json(result.rows[0] || {});
    } catch (error) {
      console.error('Error fetching housing market data:', error);
      res.status(500).json({ error: 'Failed to fetch housing market data' });
    }
  });

  // Enhanced Knob System Endpoints
  createEnhancedKnobEndpoints(router, 'world-wonders', worldWondersKnobs, () => {
    applyWorldWondersKnobsToSimulation();
  });

  // AI Analysis Endpoints
  router.post('/ai-analysis/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;
      
      const prompt = WORLD_WONDERS_AI_PROMPTS[promptType as keyof typeof WORLD_WONDERS_AI_PROMPTS];
      if (!prompt) {
        return res.status(400).json({ error: 'Invalid prompt type' });
      }

      const analysis = await generateWorldWondersAnalysis(prompt, parameters);
      
      res.json({
        promptType,
        analysis,
        parameters,
        timestamp: new Date(),
        confidence: 0.85
      });
    } catch (error) {
      console.error('Error generating world wonders AI analysis:', error);
      res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
  });

  return router;
}

// Helper Functions

async function initializeHouseholdEconomics(pool: Pool, campaignId: string, civilizationId: string): Promise<HouseholdEconomics> {
  const defaultEconomics: HouseholdEconomics = {
    campaignId,
    civilizationId,
    averageIncome: 45000,
    medianIncome: 38000,
    incomeDistribution: {
      giniCoefficient: 0.35,
      quintileShares: [0.08, 0.14, 0.18, 0.24, 0.36],
      top1Percent: 0.12,
      top10Percent: 0.28,
      povertyRate: 0.12
    },
    householdSavingsRate: 0.15,
    consumerSpending: {
      totalSpending: 38250,
      categories: {
        housing: 0.28,
        food: 0.15,
        transportation: 0.12,
        healthcare: 0.08,
        education: 0.06,
        entertainment: 0.05,
        savings: 0.15,
        other: 0.11
      },
      spendingConfidence: 0.7
    },
    housingMarket: {
      averageHomePrice: 285000,
      homeOwnershipRate: 0.65,
      rentToIncomeRatio: 0.25,
      housingAffordabilityIndex: 0.6,
      constructionActivity: 0.4,
      mortgageRates: 0.045
    },
    debtLevels: {
      totalHouseholdDebt: 95000,
      debtToIncomeRatio: 2.1,
      mortgageDebt: 65000,
      consumerDebt: 18000,
      studentDebt: 12000,
      defaultRates: 0.03
    },
    economicMobility: {
      intergenerationalMobility: 0.6,
      socialMobilityIndex: 0.65,
      educationAccessIndex: 0.8,
      entrepreneurshipRate: 0.08,
      jobMarketFlexibility: 0.7
    },
    lastUpdated: new Date()
  };

  await pool.query(`
    INSERT INTO household_economics (
      campaign_id, civilization_id, average_income, median_income, gini_coefficient,
      savings_rate, consumer_spending, housing_data, debt_data, mobility_data, last_updated
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `, [
    campaignId, civilizationId, defaultEconomics.averageIncome, defaultEconomics.medianIncome,
    defaultEconomics.incomeDistribution.giniCoefficient, defaultEconomics.householdSavingsRate,
    JSON.stringify(defaultEconomics.consumerSpending), JSON.stringify(defaultEconomics.housingMarket),
    JSON.stringify(defaultEconomics.debtLevels), JSON.stringify(defaultEconomics.economicMobility),
    defaultEconomics.lastUpdated
  ]);

  return defaultEconomics;
}

async function calculateEconomicMobility(pool: Pool, campaignId: string, civilizationId: string): Promise<EconomicMobility> {
  // Implementation would calculate comprehensive mobility metrics
  return {
    intergenerationalMobility: 0.6,
    socialMobilityIndex: 0.65,
    educationAccessIndex: 0.8,
    entrepreneurshipRate: 0.08,
    jobMarketFlexibility: 0.7
  };
}

async function generateWorldWondersAnalysis(prompt: string, parameters: any) {
  // This would integrate with your AI service
  return {
    summary: "World wonders and household economics analysis",
    keyFindings: [
      "Cultural wonders provide long-term civilization benefits",
      "Household income inequality affects social stability",
      "Housing market conditions impact consumer spending"
    ],
    recommendations: [
      "Prioritize cultural wonders for long-term prestige",
      "Implement policies to improve income distribution",
      "Monitor housing affordability trends"
    ],
    riskFactors: [
      "High construction costs may strain resources",
      "Income inequality could lead to social unrest",
      "Housing bubble risks in speculation markets"
    ]
  };
}

function applyWorldWondersKnobsToSimulation() {
  const knobValues = worldWondersKnobs.getAllKnobValues();
  
  console.log('🎛️ World Wonders knobs applied to simulation:', {
    construction_speed: knobValues.construction_speed_modifier,
    wonder_availability: knobValues.wonder_availability_rate,
    income_growth: knobValues.income_growth_rate,
    social_mobility: knobValues.social_mobility_factor
  });
}
