import { Router } from 'express';
import { Pool } from 'pg';

export function createSovereignWealthFundRoutes(pool: Pool): Router {
  const router = Router();

  // Enhanced Knob System - 24 AI-controllable knobs per API
  const SWF_KNOBS = {
    // Investment Strategy Knobs (8)
    equity_allocation_target: { min: 0, max: 100, default: 40, unit: '%' },
    fixed_income_allocation: { min: 0, max: 100, default: 30, unit: '%' },
    infrastructure_allocation: { min: 0, max: 50, default: 20, unit: '%' },
    alternative_investments: { min: 0, max: 30, default: 10, unit: '%' },
    domestic_investment_bias: { min: 0, max: 100, default: 70, unit: '%' },
    foreign_investment_limit: { min: 0, max: 50, default: 30, unit: '%' },
    currency_hedging_ratio: { min: 0, max: 100, default: 50, unit: '%' },
    esg_investment_minimum: { min: 0, max: 100, default: 25, unit: '%' },

    // Risk Management Knobs (8)
    maximum_single_holding: { min: 1, max: 20, default: 5, unit: '%' },
    liquidity_reserve_ratio: { min: 5, max: 50, default: 15, unit: '%' },
    volatility_tolerance: { min: 1, max: 10, default: 6, unit: 'score' },
    credit_rating_minimum: { min: 1, max: 10, default: 6, unit: 'rating' },
    sector_concentration_limit: { min: 5, max: 40, default: 20, unit: '%' },
    geographic_diversification: { min: 2, max: 10, default: 5, unit: 'regions' },
    currency_exposure_limit: { min: 10, max: 80, default: 40, unit: '%' },
    leverage_ratio_maximum: { min: 0, max: 30, default: 10, unit: '%' },

    // Performance & Financing Knobs (8)
    target_annual_return: { min: 2, max: 15, default: 7, unit: '%' },
    benchmark_tracking_error: { min: 0.5, max: 5, default: 2, unit: '%' },
    rebalancing_frequency: { min: 1, max: 12, default: 4, unit: 'months' },
    tax_revenue_allocation: { min: 0, max: 50, default: 15, unit: '%' },
    resource_revenue_allocation: { min: 0, max: 80, default: 40, unit: '%' },
    central_bank_funding: { min: 0, max: 30, default: 10, unit: '%' },
    bond_issuance_funding: { min: 0, max: 40, default: 20, unit: '%' },
    withdrawal_rate_limit: { min: 0, max: 10, default: 3, unit: '%/year' }
  };

  // Dashboard - Overview of all funds
  router.get('/dashboard/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const [funds, totalAssets, performance, recentTransactions] = await Promise.all([
        // Get all funds for this civilization
        pool.query(`
          SELECT swf.*, 
                 COUNT(h.id) as holdings_count,
                 SUM(h.market_value) as current_market_value
          FROM sovereign_wealth_funds swf
          LEFT JOIN swf_holdings h ON swf.id = h.fund_id
          WHERE swf.civilization_id = $1
          GROUP BY swf.id
          ORDER BY swf.total_assets DESC
        `, [civilizationId]),

        // Total assets across all funds
        pool.query(`
          SELECT SUM(total_assets) as total_assets,
                 SUM(net_asset_value) as total_nav,
                 COUNT(*) as fund_count
          FROM sovereign_wealth_funds
          WHERE civilization_id = $1 AND status = 'active'
        `, [civilizationId]),

        // Recent performance
        pool.query(`
          SELECT p.*, swf.fund_name
          FROM swf_performance p
          JOIN sovereign_wealth_funds swf ON p.fund_id = swf.id
          WHERE swf.civilization_id = $1
          ORDER BY p.reporting_date DESC
          LIMIT 10
        `, [civilizationId]),

        // Recent transactions
        pool.query(`
          SELECT t.*, swf.fund_name
          FROM swf_transactions t
          JOIN sovereign_wealth_funds swf ON t.fund_id = swf.id
          WHERE swf.civilization_id = $1
          ORDER BY t.transaction_date DESC
          LIMIT 20
        `, [civilizationId])
      ]);

      res.json({
        success: true,
        data: {
          funds: funds.rows,
          totalAssets: totalAssets.rows[0],
          performance: performance.rows,
          recentTransactions: recentTransactions.rows,
          knobs: SWF_KNOBS
        }
      });
    } catch (error) {
      console.error('Error fetching SWF dashboard data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
    }
  });

  // Get specific fund details
  router.get('/fund/:fundId', async (req, res) => {
    try {
      const { fundId } = req.params;
      
      const [fund, holdings, strategies, performance, currencies] = await Promise.all([
        // Fund basic info
        pool.query(`
          SELECT * FROM sovereign_wealth_funds WHERE id = $1
        `, [fundId]),

        // Holdings breakdown
        pool.query(`
          SELECT h.*, 
                 CASE WHEN h.issuing_civilization_id = swf.civilization_id 
                      THEN 'Domestic' ELSE 'Foreign' END as investment_type
          FROM swf_holdings h
          JOIN sovereign_wealth_funds swf ON h.fund_id = swf.id
          WHERE h.fund_id = $1
          ORDER BY h.market_value DESC
        `, [fundId]),

        // Investment strategies
        pool.query(`
          SELECT * FROM swf_investment_strategies WHERE fund_id = $1
        `, [fundId]),

        // Performance history
        pool.query(`
          SELECT * FROM swf_performance 
          WHERE fund_id = $1 
          ORDER BY reporting_date DESC 
          LIMIT 12
        `, [fundId]),

        // Currency access
        pool.query(`
          SELECT * FROM swf_currency_access WHERE fund_id = $1
        `, [fundId])
      ]);

      if (fund.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Fund not found' });
      }

      res.json({
        success: true,
        data: {
          fund: fund.rows[0],
          holdings: holdings.rows,
          strategies: strategies.rows,
          performance: performance.rows,
          currencies: currencies.rows,
          knobs: SWF_KNOBS
        }
      });
    } catch (error) {
      console.error('Error fetching fund details:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch fund details' });
    }
  });

  // Get investment universe - available investments
  router.get('/investment-universe/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { asset_type, currency, domestic_only } = req.query;
      
      let query = `
        SELECT iu.*, c.name as issuing_civilization_name
        FROM swf_investment_universe iu
        JOIN civilizations c ON iu.issuing_civilization_id = c.id
        WHERE iu.is_active = true
      `;
      const params: any[] = [];
      let paramCount = 0;

      if (domestic_only === 'true') {
        query += ` AND iu.issuing_civilization_id = $${++paramCount}`;
        params.push(civilizationId);
      }

      if (asset_type) {
        query += ` AND iu.asset_type = $${++paramCount}`;
        params.push(asset_type);
      }

      if (currency) {
        query += ` AND iu.currency_code = $${++paramCount}`;
        params.push(currency);
      }

      query += ` ORDER BY iu.market_cap DESC NULLS LAST, iu.current_price DESC`;

      const investments = await pool.query(query, params);

      res.json({
        success: true,
        data: {
          investments: investments.rows,
          knobs: SWF_KNOBS
        }
      });
    } catch (error) {
      console.error('Error fetching investment universe:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch investment universe' });
    }
  });

  // Create new investment
  router.post('/invest', async (req, res) => {
    try {
      const {
        fund_id,
        asset_id,
        quantity,
        max_price,
        investment_thesis
      } = req.body;

      // Get asset details
      const asset = await pool.query(`
        SELECT * FROM swf_investment_universe WHERE id = $1
      `, [asset_id]);

      if (asset.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Asset not found' });
      }

      const assetData = asset.rows[0];
      const totalCost = quantity * assetData.current_price;

      // Check if fund has sufficient currency
      const currencyCheck = await pool.query(`
        SELECT available_amount FROM swf_currency_access 
        WHERE fund_id = $1 AND currency_code = $2
      `, [fund_id, assetData.currency_code]);

      if (currencyCheck.rows.length === 0 || currencyCheck.rows[0].available_amount < totalCost) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient currency balance' 
        });
      }

      // Create the investment
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Insert holding
        const holding = await client.query(`
          INSERT INTO swf_holdings (
            fund_id, holding_type, asset_name, asset_identifier,
            issuing_civilization_id, market_exchange, is_domestic,
            quantity, unit_cost, current_value, market_value,
            acquisition_date, currency_code, dividend_yield, coupon_rate,
            credit_rating, sector, industry, investment_thesis
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, CURRENT_TIMESTAMP,
            $11, $12, $13, $14, $15, $16, $17
          ) RETURNING id
        `, [
          fund_id, assetData.asset_type, assetData.asset_name, assetData.asset_symbol,
          assetData.issuing_civilization_id, assetData.market_exchange,
          assetData.issuing_civilization_id === req.body.civilization_id,
          quantity, assetData.current_price, totalCost,
          assetData.currency_code, assetData.dividend_yield, assetData.coupon_rate,
          assetData.credit_rating, assetData.sector, assetData.industry, investment_thesis
        ]);

        // Record transaction
        await client.query(`
          INSERT INTO swf_transactions (
            fund_id, transaction_type, asset_name, quantity, unit_price,
            total_amount, currency_code, transaction_date
          ) VALUES ($1, 'buy', $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        `, [fund_id, assetData.asset_name, quantity, assetData.current_price, totalCost, assetData.currency_code]);

        // Update currency balance
        await client.query(`
          UPDATE swf_currency_access 
          SET available_amount = available_amount - $1
          WHERE fund_id = $2 AND currency_code = $3
        `, [totalCost, fund_id, assetData.currency_code]);

        await client.query('COMMIT');

        res.json({
          success: true,
          data: {
            holding_id: holding.rows[0].id,
            total_cost: totalCost,
            message: 'Investment created successfully'
          }
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error creating investment:', error);
      res.status(500).json({ success: false, error: 'Failed to create investment' });
    }
  });

  // Update knob values
  router.post('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { knob_name, value, fund_id } = req.body;

      if (!SWF_KNOBS[knob_name]) {
        return res.status(400).json({ success: false, error: 'Invalid knob name' });
      }

      const knob = SWF_KNOBS[knob_name];
      if (value < knob.min || value > knob.max) {
        return res.status(400).json({ 
          success: false, 
          error: `Value must be between ${knob.min} and ${knob.max}` 
        });
      }

      // Store knob adjustment in database for AI learning
      await pool.query(`
        INSERT INTO sim_knob_adjustments (
          civilization_id, system_name, knob_name, old_value, new_value,
          adjustment_reason, adjusted_by, adjustment_timestamp
        ) VALUES ($1, 'sovereign_wealth_fund', $2, $3, $4, 'manual_adjustment', 'player', CURRENT_TIMESTAMP)
      `, [civilizationId, knob_name, knob.default, value]);

      res.json({
        success: true,
        data: {
          knob_name,
          old_value: knob.default,
          new_value: value,
          message: 'Knob updated successfully'
        }
      });
    } catch (error) {
      console.error('Error updating knob:', error);
      res.status(500).json({ success: false, error: 'Failed to update knob' });
    }
  });

  return router;
}

