/**
 * Government Bonds API Routes
 * RESTful endpoints for government bond operations
 */

import { Router } from 'express';
import { Pool } from 'pg';
import { GovernmentBondsService, BondIssuanceRequest } from './GovernmentBondsService.js';

export function createGovernmentBondsRoutes(pool: Pool): Router {
  const router = Router();
  const bondsService = new GovernmentBondsService(pool);

  /**
   * GET /api/government-bonds/dashboard/:civilizationId
   * Get comprehensive bonds dashboard data
   */
  router.get('/dashboard/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;

      // Get all data in parallel
      const [
        bonds,
        debtSummary,
        auctions,
        creditRating
      ] = await Promise.all([
        bondsService.getBondsByCivilization(civilizationId),
        bondsService.getDebtServiceSummary(civilizationId),
        bondsService.getBondAuctions(civilizationId, 5),
        bondsService.getCreditRating(civilizationId)
      ]);

      // Get market prices for active bonds
      const bondsWithPrices = await Promise.all(
        bonds.map(async (bond) => {
          const prices = await bondsService.getBondMarketPrices(bond.id, 7);
          const latestPrice = prices.length > 0 ? prices[0] : null;
          
          return {
            ...bond,
            currentPrice: latestPrice?.lastTradePrice || bond.faceValue,
            yield: latestPrice?.yieldToMaturity || bond.couponRate,
            priceChange: latestPrice && prices.length > 1 ? 
              ((latestPrice.lastTradePrice || 0) - (prices[1].lastTradePrice || 0)) : 0
          };
        })
      );

      res.json({
        success: true,
        data: {
          bonds: bondsWithPrices,
          debtSummary,
          recentAuctions: auctions,
          creditRating,
          marketSummary: {
            totalBonds: bonds.length,
            totalOutstanding: bonds.reduce((sum, bond) => sum + bond.totalOutstanding, 0),
            averageCoupon: bonds.reduce((sum, bond) => sum + bond.couponRate, 0) / bonds.length,
            averageMaturity: bonds.reduce((sum, bond) => {
              const years = (new Date(bond.maturityDate).getFullYear() - new Date().getFullYear());
              return sum + years;
            }, 0) / bonds.length
          }
        }
      });
    } catch (error) {
      console.error('Error fetching bonds dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bonds dashboard data'
      });
    }
  });

  /**
   * GET /api/government-bonds/:civilizationId
   * Get all bonds for a civilization
   */
  router.get('/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const bonds = await bondsService.getBondsByCivilization(civilizationId);
      
      res.json({
        success: true,
        data: bonds
      });
    } catch (error) {
      console.error('Error fetching bonds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bonds'
      });
    }
  });

  /**
   * POST /api/government-bonds/issue
   * Issue new government bonds
   */
  router.post('/issue', async (req, res) => {
    try {
      const request: BondIssuanceRequest = req.body;
      
      // Validate required fields
      if (!request.civilizationId || !request.bondType || !request.faceValue || 
          !request.couponRate || !request.maturityYears || !request.totalAmount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields for bond issuance'
        });
      }

      const bondId = await bondsService.issueBonds(request);
      
      res.json({
        success: true,
        data: {
          bondId,
          message: 'Bonds issued successfully'
        }
      });
    } catch (error) {
      console.error('Error issuing bonds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to issue bonds'
      });
    }
  });

  /**
   * GET /api/government-bonds/bond/:bondId/details
   * Get detailed information about a specific bond
   */
  router.get('/bond/:bondId/details', async (req, res) => {
    try {
      const bondId = parseInt(req.params.bondId);
      
      // Get bond details, holders, and recent prices
      const [
        bonds,
        holders,
        prices
      ] = await Promise.all([
        bondsService.getBondsByCivilization(''), // Will filter by bondId in query
        bondsService.getBondHolders(bondId),
        bondsService.getBondMarketPrices(bondId, 30)
      ]);

      // Get the specific bond (need to modify service to get by ID)
      const client = await pool.connect();
      try {
        const bondResult = await client.query(`
          SELECT * FROM government_bonds WHERE id = $1
        `, [bondId]);
        
        if (bondResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Bond not found'
          });
        }

        const bond = bondResult.rows[0];
        
        res.json({
          success: true,
          data: {
            bond: {
              id: bond.id,
              civilizationId: bond.civilization_id,
              bondSeries: bond.bond_series,
              bondType: bond.bond_type,
              issueDate: bond.issue_date,
              maturityDate: bond.maturity_date,
              currencyCode: bond.currency_code,
              faceValue: parseFloat(bond.face_value),
              couponRate: parseFloat(bond.coupon_rate),
              totalOutstanding: parseInt(bond.total_outstanding),
              creditRating: bond.credit_rating,
              purpose: bond.purpose
            },
            holders,
            priceHistory: prices,
            analytics: {
              holderDistribution: holders.reduce((acc, holder) => {
                acc[holder.holderType] = (acc[holder.holderType] || 0) + holder.quantity;
                return acc;
              }, {} as { [key: string]: number }),
              averagePrice: prices.length > 0 ? 
                prices.reduce((sum, p) => sum + (p.lastTradePrice || 0), 0) / prices.length : 0,
              volatility: prices.length > 1 ? 
                Math.sqrt(prices.reduce((sum, p, i) => {
                  if (i === 0) return 0;
                  const change = ((p.lastTradePrice || 0) - (prices[i-1].lastTradePrice || 0));
                  return sum + change * change;
                }, 0) / (prices.length - 1)) : 0
            }
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching bond details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bond details'
      });
    }
  });

  /**
   * GET /api/government-bonds/debt-service/:civilizationId
   * Get debt service summary and schedule
   */
  router.get('/debt-service/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const debtSummary = await bondsService.getDebtServiceSummary(civilizationId);
      
      // Get upcoming debt service schedule
      const client = await pool.connect();
      try {
        const scheduleResult = await client.query(`
          SELECT 
            payment_date, payment_type, bond_series, currency_code,
            scheduled_amount, payment_status
          FROM debt_service_schedule 
          WHERE civilization_id = $1 
            AND payment_date >= CURRENT_DATE
          ORDER BY payment_date
          LIMIT 12
        `, [civilizationId]);

        res.json({
          success: true,
          data: {
            summary: debtSummary,
            upcomingPayments: scheduleResult.rows.map(row => ({
              paymentDate: row.payment_date,
              paymentType: row.payment_type,
              bondSeries: row.bond_series,
              currencyCode: row.currency_code,
              scheduledAmount: parseFloat(row.scheduled_amount),
              paymentStatus: row.payment_status
            }))
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching debt service:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch debt service data'
      });
    }
  });

  /**
   * GET /api/government-bonds/auctions/:civilizationId
   * Get bond auction history and upcoming auctions
   */
  router.get('/auctions/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const auctions = await bondsService.getBondAuctions(civilizationId, limit);
      
      res.json({
        success: true,
        data: auctions
      });
    } catch (error) {
      console.error('Error fetching auctions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch auction data'
      });
    }
  });

  /**
   * GET /api/government-bonds/market-data/:bondId
   * Get market data and pricing for a specific bond
   */
  router.get('/market-data/:bondId', async (req, res) => {
    try {
      const bondId = parseInt(req.params.bondId);
      const days = parseInt(req.query.days as string) || 30;
      
      const prices = await bondsService.getBondMarketPrices(bondId, days);
      
      res.json({
        success: true,
        data: {
          prices,
          analytics: {
            currentPrice: prices.length > 0 ? prices[0].lastTradePrice : null,
            priceChange: prices.length > 1 ? 
              (prices[0].lastTradePrice || 0) - (prices[1].lastTradePrice || 0) : 0,
            averageVolume: prices.reduce((sum, p) => sum + p.volumeTraded, 0) / prices.length,
            currentYield: prices.length > 0 ? prices[0].yieldToMaturity : null
          }
        }
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market data'
      });
    }
  });

  /**
   * POST /api/government-bonds/market-data/:bondId
   * Update market data for a bond (for simulation purposes)
   */
  router.post('/market-data/:bondId', async (req, res) => {
    try {
      const bondId = parseInt(req.params.bondId);
      const { bidPrice, askPrice, lastTradePrice, volume } = req.body;
      
      await bondsService.updateBondMarketPrice(bondId, bidPrice, askPrice, lastTradePrice, volume);
      
      res.json({
        success: true,
        message: 'Market data updated successfully'
      });
    } catch (error) {
      console.error('Error updating market data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update market data'
      });
    }
  });

  /**
   * GET /api/government-bonds/credit-rating/:civilizationId
   * Get current credit rating and history
   */
  router.get('/credit-rating/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const client = await pool.connect();
      try {
        // Get current rating
        const currentResult = await client.query(`
          SELECT rating_agency, rating, outlook, rating_date, rating_rationale,
                 factors_positive, factors_negative
          FROM credit_ratings 
          WHERE civilization_id = $1 AND is_current = true
          ORDER BY rating_date DESC
          LIMIT 1
        `, [civilizationId]);

        // Get rating history
        const historyResult = await client.query(`
          SELECT rating_agency, rating, outlook, rating_date, previous_rating
          FROM credit_ratings 
          WHERE civilization_id = $1
          ORDER BY rating_date DESC
          LIMIT 10
        `, [civilizationId]);

        res.json({
          success: true,
          data: {
            current: currentResult.rows[0] || null,
            history: historyResult.rows
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching credit rating:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch credit rating'
      });
    }
  });

  /**
   * Government Bonds Enhanced Knobs System
   * 20 AI-powered control knobs for sophisticated bond management
   */

  /**
   * GET /api/government-bonds/knobs/:civilizationId
   * Get all Government Bonds knob settings
   */
  router.get('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const client = await pool.connect();
      
      try {
        // Get existing knob settings or create defaults
        let result = await client.query(`
          SELECT knob_settings FROM government_bonds_knobs 
          WHERE civilization_id = $1
        `, [civilizationId]);

        let knobSettings;
        if (result.rows.length === 0) {
          // Create default knob settings
          knobSettings = getDefaultBondKnobSettings();
          await client.query(`
            INSERT INTO government_bonds_knobs (civilization_id, knob_settings, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (civilization_id) 
            DO UPDATE SET knob_settings = $2, updated_at = CURRENT_TIMESTAMP
          `, [civilizationId, JSON.stringify(knobSettings)]);
        } else {
          knobSettings = result.rows[0].knob_settings;
        }

        res.json({
          success: true,
          data: {
            knobs: knobSettings,
            lastUpdated: new Date().toISOString()
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching bond knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bond knob settings'
      });
    }
  });

  /**
   * POST /api/government-bonds/knobs/:civilizationId
   * Update Government Bonds knob settings
   */
  router.post('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { knobs } = req.body;
      
      if (!knobs) {
        return res.status(400).json({
          success: false,
          error: 'Knob settings are required'
        });
      }

      const client = await pool.connect();
      
      try {
        await client.query(`
          INSERT INTO government_bonds_knobs (civilization_id, knob_settings, updated_at)
          VALUES ($1, $2, CURRENT_TIMESTAMP)
          ON CONFLICT (civilization_id) 
          DO UPDATE SET knob_settings = $2, updated_at = CURRENT_TIMESTAMP
        `, [civilizationId, JSON.stringify(knobs)]);

        // Trigger AI simulation update
        await notifySimulationEngine('government-bonds', civilizationId, knobs);

        res.json({
          success: true,
          message: 'Bond knob settings updated successfully'
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error updating bond knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update bond knob settings'
      });
    }
  });

  /**
   * POST /api/government-bonds/simulate/:civilizationId
   * Run AI simulation with current knob settings
   */
  router.post('/simulate/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { scenario } = req.body;
      
      const client = await pool.connect();
      
      try {
        // Get current knob settings
        const result = await client.query(`
          SELECT knob_settings FROM government_bonds_knobs 
          WHERE civilization_id = $1
        `, [civilizationId]);

        const knobSettings = result.rows.length > 0 ? 
          result.rows[0].knob_settings : getDefaultBondKnobSettings();

        // Run simulation
        const simulationResult = await runBondSimulation(civilizationId, knobSettings, scenario);

        res.json({
          success: true,
          data: simulationResult
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error running bond simulation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to run bond simulation'
      });
    }
  });

  return router;
}

/**
 * Default Government Bonds knob settings
 */
function getDefaultBondKnobSettings() {
  return {
    // Issuance Strategy Knobs (1-5)
    bondIssuanceFrequency: { value: 50, min: 0, max: 100, description: "How frequently to issue new bonds" },
    maturityMix: { value: 50, min: 0, max: 100, description: "Balance between short-term vs long-term bonds" },
    currencyDiversification: { value: 30, min: 0, max: 100, description: "Percentage of bonds issued in foreign currencies" },
    callableFeatures: { value: 25, min: 0, max: 100, description: "Percentage of bonds with callable features" },
    greenBondRatio: { value: 15, min: 0, max: 100, description: "Percentage of green/ESG bonds in portfolio" },

    // Pricing & Yield Knobs (6-10)
    couponRateStrategy: { value: 50, min: 0, max: 100, description: "Aggressiveness of coupon rate setting" },
    auctionPricingModel: { value: 60, min: 0, max: 100, description: "Competitive vs non-competitive auction balance" },
    creditRatingTarget: { value: 75, min: 0, max: 100, description: "Target credit rating maintenance level" },
    yieldCurveOptimization: { value: 55, min: 0, max: 100, description: "Optimize for yield curve positioning" },
    marketTimingStrategy: { value: 40, min: 0, max: 100, description: "Market timing aggressiveness for issuance" },

    // Risk Management Knobs (11-15)
    debtToGdpTarget: { value: 60, min: 0, max: 100, description: "Maximum acceptable debt-to-GDP ratio" },
    foreignCurrencyRisk: { value: 35, min: 0, max: 100, description: "Tolerance for foreign exchange risk" },
    interestRateHedging: { value: 45, min: 0, max: 100, description: "Level of interest rate risk hedging" },
    refinancingRisk: { value: 50, min: 0, max: 100, description: "Management of refinancing risk concentration" },
    liquidityBuffer: { value: 40, min: 0, max: 100, description: "Maintain cash reserves for debt service" },

    // Market Operations Knobs (16-20)
    secondaryMarketSupport: { value: 30, min: 0, max: 100, description: "Active support of secondary bond trading" },
    buybackPrograms: { value: 20, min: 0, max: 100, description: "Frequency of bond buyback operations" },
    marketMakerIncentives: { value: 35, min: 0, max: 100, description: "Incentives for primary dealers and market makers" },
    transparencyLevel: { value: 70, min: 0, max: 100, description: "Level of market communication and transparency" },
    innovationAdoption: { value: 45, min: 0, max: 100, description: "Adoption of new bond structures and technologies" }
  };
}

/**
 * Notify simulation engine of knob changes
 */
async function notifySimulationEngine(system: string, civilizationId: string, knobs: any): Promise<void> {
  try {
    // This would integrate with the actual simulation engine
    console.log(`🔧 Bond knobs updated for civilization ${civilizationId}:`, Object.keys(knobs).length, 'knobs');
    
    // Store telemetry data
    const telemetryData = {
      system: 'government-bonds',
      civilization_id: civilizationId,
      action: 'knob_update',
      parameters: knobs,
      timestamp: new Date().toISOString()
    };
    
    // This would be sent to the simulation engine via WebSocket or direct call
    // await simulationEngine.updateKnobs('government-bonds', civilizationId, knobs);
  } catch (error) {
    console.error('Error notifying simulation engine:', error);
  }
}

/**
 * Run bond simulation with given parameters
 */
async function runBondSimulation(civilizationId: string, knobs: any, scenario?: string): Promise<any> {
  // Simulate bond market outcomes based on knob settings
  const baseYield = 0.035;
  const marketVolatility = (100 - knobs.marketTimingStrategy.value) / 1000;
  const creditSpread = (100 - knobs.creditRatingTarget.value) / 2000;
  
  const simulatedYield = baseYield + creditSpread + (Math.random() * marketVolatility);
  const demandMultiplier = knobs.transparencyLevel.value / 50;
  const auctionSuccess = Math.min(95, 60 + (knobs.auctionPricingModel.value / 2));
  
  return {
    projectedYield: simulatedYield,
    estimatedDemand: demandMultiplier,
    auctionSuccessRate: auctionSuccess,
    creditRatingImpact: knobs.creditRatingTarget.value > 70 ? 'positive' : 'neutral',
    marketReception: knobs.transparencyLevel.value > 60 ? 'favorable' : 'mixed',
    recommendations: generateBondRecommendations(knobs),
    scenario: scenario || 'baseline',
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate AI recommendations based on knob settings
 */
function generateBondRecommendations(knobs: any): string[] {
  const recommendations = [];
  
  if (knobs.debtToGdpTarget.value > 80) {
    recommendations.push("Consider reducing debt issuance to maintain fiscal sustainability");
  }
  
  if (knobs.foreignCurrencyRisk.value > 60) {
    recommendations.push("High foreign currency exposure - consider hedging strategies");
  }
  
  if (knobs.greenBondRatio.value < 20) {
    recommendations.push("Increase green bond issuance to meet ESG investor demand");
  }
  
  if (knobs.transparencyLevel.value > 80) {
    recommendations.push("Excellent transparency - maintain regular market communication");
  }
  
  if (knobs.liquidityBuffer.value < 30) {
    recommendations.push("Consider increasing cash reserves for debt service security");
  }
  
  return recommendations;
}
