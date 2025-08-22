import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

/**
 * Enhanced Central Bank API Routes
 * Provides endpoints for gold reserves, multi-currency management, and quantitative easing
 * Includes 24 AI-controllable knobs for dynamic monetary policy adjustment
 */

// Enhanced Knob System - 24 AI-controllable knobs per API
const CENTRAL_BANK_ENHANCED_KNOBS = {
  // Gold Reserve Management Knobs (6)
  gold_reserve_target_ratio: { min: 5, max: 50, default: 15, unit: '%' },
  gold_acquisition_rate: { min: 0.1, max: 5, default: 1.5, unit: '%/month' },
  gold_price_volatility_buffer: { min: 5, max: 25, default: 12, unit: '%' },
  gold_storage_diversification: { min: 1, max: 10, default: 4, unit: 'locations' },
  gold_quality_standard: { min: 90, max: 99.99, default: 99.5, unit: '% purity' },
  gold_liquidity_reserve: { min: 10, max: 40, default: 20, unit: '%' },

  // Multi-Currency Management Knobs (6)
  foreign_currency_exposure_limit: { min: 10, max: 60, default: 35, unit: '%' },
  currency_diversification_target: { min: 3, max: 12, default: 6, unit: 'currencies' },
  exchange_rate_intervention_threshold: { min: 2, max: 15, default: 8, unit: '%' },
  currency_swap_utilization: { min: 0, max: 80, default: 25, unit: '%' },
  foreign_reserve_rebalancing_frequency: { min: 1, max: 12, default: 3, unit: 'months' },
  currency_hedging_ratio: { min: 0, max: 100, default: 60, unit: '%' },

  // Quantitative Easing Knobs (6)
  qe_bond_purchase_rate: { min: 0, max: 20, default: 5, unit: 'B/month' },
  qe_duration_target: { min: 6, max: 60, default: 24, unit: 'months' },
  qe_asset_class_diversification: { min: 1, max: 8, default: 4, unit: 'classes' },
  qe_yield_curve_targeting: { min: 0.5, max: 5, default: 2.5, unit: '%' },
  qe_market_impact_threshold: { min: 5, max: 30, default: 15, unit: '%' },
  qe_exit_strategy_trigger: { min: 2, max: 8, default: 4, unit: '% inflation' },

  // Money Supply & Interest Rate Knobs (6)
  money_supply_growth_target: { min: 2, max: 15, default: 6, unit: '%/year' },
  interest_rate_corridor_width: { min: 0.25, max: 2, default: 0.75, unit: '%' },
  reserve_requirement_ratio: { min: 5, max: 25, default: 12, unit: '%' },
  discount_window_penalty_rate: { min: 0.5, max: 3, default: 1.5, unit: '%' },
  monetary_base_expansion_limit: { min: 5, max: 40, default: 20, unit: '%/year' },
  inflation_targeting_tolerance: { min: 0.5, max: 3, default: 1.5, unit: '%' }
};

// Initialize routes with database pool
export function createCentralBankEnhancementsRoutes(pool: Pool) {
  
  // Dashboard - Overview of enhanced central bank operations
  router.get('/dashboard/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const [reserves, currencies, qeOperations, moneySupply, interestRates, balanceSheet] = await Promise.all([
        // Gold and other reserves
        pool.query(`
          SELECT reserve_type, SUM(quantity) as total_quantity, SUM(market_value_local) as total_value
          FROM cb_reserves 
          WHERE civilization_id = $1 
          GROUP BY reserve_type
        `, [civilizationId]),
        
        // Currency holdings
        pool.query(`
          SELECT currency_code, currency_name, total_holdings, exchange_rate, credit_rating
          FROM cb_currency_holdings 
          WHERE civilization_id = $1
          ORDER BY total_holdings DESC
        `, [civilizationId]),
        
        // QE operations
        pool.query(`
          SELECT operation_type, SUM(amount) as total_amount, AVG(target_yield) as avg_yield
          FROM cb_quantitative_easing 
          WHERE civilization_id = $1 AND status = 'active'
          GROUP BY operation_type
        `, [civilizationId]),
        
        // Money supply metrics
        pool.query(`
          SELECT * FROM cb_money_supply 
          WHERE civilization_id = $1 
          ORDER BY measurement_date DESC 
          LIMIT 1
        `, [civilizationId]),
        
        // Interest rate corridor
        pool.query(`
          SELECT * FROM cb_interest_rate_corridor 
          WHERE civilization_id = $1 
          ORDER BY effective_date DESC 
          LIMIT 1
        `, [civilizationId]),
        
        // Balance sheet summary
        pool.query(`
          SELECT asset_type, SUM(book_value) as total_value
          FROM cb_balance_sheet 
          WHERE civilization_id = $1
          GROUP BY asset_type
        `, [civilizationId])
      ]);

      res.json({
        success: true,
        data: {
          reserves: reserves.rows,
          currencies: currencies.rows,
          quantitativeEasing: qeOperations.rows,
          moneySupply: moneySupply.rows[0] || {},
          interestRates: interestRates.rows[0] || {},
          balanceSheet: balanceSheet.rows,
          knobs: CENTRAL_BANK_ENHANCED_KNOBS
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
    }
  });
  
  // Get all reserves for a civilization
  router.get('/reserves/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT 
          r.*,
          CASE 
            WHEN r.reserve_type = 'gold' THEN 'Gold Reserves'
            WHEN r.reserve_type = 'foreign_currency' THEN ch.currency_name
            ELSE INITCAP(REPLACE(r.reserve_type, '_', ' '))
          END as display_name,
          CASE 
            WHEN r.reserve_type = 'foreign_currency' THEN ch.credit_rating
            ELSE NULL
          END as credit_rating
        FROM cb_reserves r
        LEFT JOIN cb_currency_holdings ch ON r.civilization_id = ch.civilization_id 
          AND r.currency_code = ch.currency_code
        WHERE r.civilization_id = $1
        ORDER BY r.market_value_local DESC
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows,
        total_value: result.rows.reduce((sum, reserve) => sum + parseFloat(reserve.market_value_local), 0)
      });
    } catch (error) {
      console.error('Error fetching reserves:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch reserves' });
    }
  });

  // Get currency holdings and exchange rates
  router.get('/currencies/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT 
          ch.*,
          c.name as issuing_civilization_name,
          CASE 
            WHEN ch.actual_allocation_percent > ch.target_allocation_percent + ch.rebalance_threshold THEN 'overweight'
            WHEN ch.actual_allocation_percent < ch.target_allocation_percent - ch.rebalance_threshold THEN 'underweight'
            ELSE 'balanced'
          END as allocation_status
        FROM cb_currency_holdings ch
        LEFT JOIN civilizations c ON ch.issuing_civilization = c.id
        WHERE ch.civilization_id = $1
        ORDER BY ch.amount DESC
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching currency holdings:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch currency holdings' });
    }
  });

  // Get quantitative easing programs
  router.get('/quantitative-easing/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT 
          qe.*,
          ROUND((qe.purchased_amount / qe.target_amount) * 100, 2) as completion_percentage,
          CASE 
            WHEN qe.status = 'active' AND qe.end_date < CURRENT_DATE THEN 'overdue'
            WHEN qe.status = 'planned' AND qe.start_date <= CURRENT_DATE THEN 'ready_to_start'
            ELSE qe.status
          END as effective_status
        FROM cb_quantitative_easing qe
        WHERE qe.civilization_id = $1
        ORDER BY qe.start_date DESC
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching QE programs:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch QE programs' });
    }
  });

  // Get money supply data
  router.get('/money-supply/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { period = '12' } = req.query; // Default to 12 months
      
      const result = await pool.query(`
        SELECT 
          ms.*,
          LAG(ms.m2_broad_money) OVER (ORDER BY ms.measurement_date) as previous_m2,
          ROUND(
            ((ms.m2_broad_money - LAG(ms.m2_broad_money) OVER (ORDER BY ms.measurement_date)) 
             / LAG(ms.m2_broad_money) OVER (ORDER BY ms.measurement_date)) * 100, 2
          ) as m2_growth_rate
        FROM cb_money_supply ms
        WHERE ms.civilization_id = $1
          AND ms.measurement_date >= CURRENT_DATE - INTERVAL '${period} months'
        ORDER BY ms.measurement_date DESC
        LIMIT 50
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching money supply data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch money supply data' });
    }
  });

  // Get interest rate corridor
  router.get('/interest-rates/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT 
          irc.*,
          EXTRACT(DAYS FROM (CURRENT_DATE - irc.effective_date)) as days_since_change
        FROM cb_interest_rate_corridor irc
        WHERE irc.civilization_id = $1
        ORDER BY irc.effective_date DESC
        LIMIT 10
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching interest rates:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch interest rates' });
    }
  });

  // Get central bank balance sheet
  router.get('/balance-sheet/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT 
          bs.*,
          LAG(bs.total_assets) OVER (ORDER BY bs.reporting_date) as previous_total_assets,
          ROUND(
            ((bs.total_assets - LAG(bs.total_assets) OVER (ORDER BY bs.reporting_date)) 
             / LAG(bs.total_assets) OVER (ORDER BY bs.reporting_date)) * 100, 2
          ) as asset_growth_rate
        FROM cb_balance_sheet bs
        WHERE bs.civilization_id = $1
        ORDER BY bs.reporting_date DESC
        LIMIT 12
      `, [civilizationId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch balance sheet' });
    }
  });

  // Create new QE program
  router.post('/quantitative-easing/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const {
        program_name,
        program_type,
        target_amount,
        purchase_rate_monthly,
        interest_rate_target,
        duration_months,
        start_date,
        economic_justification,
        expected_outcomes,
        asset_composition,
        exit_strategy
      } = req.body;

      const end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + duration_months);

      const result = await pool.query(`
        INSERT INTO cb_quantitative_easing (
          civilization_id, program_name, program_type, target_amount, 
          purchase_rate_monthly, interest_rate_target, duration_months,
          start_date, end_date, economic_justification, expected_outcomes,
          asset_composition, exit_strategy, remaining_amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $4)
        RETURNING *
      `, [
        civilizationId, program_name, program_type, target_amount,
        purchase_rate_monthly, interest_rate_target, duration_months,
        start_date, end_date, economic_justification, 
        JSON.stringify(expected_outcomes), JSON.stringify(asset_composition),
        exit_strategy
      ]);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'QE program created successfully'
      });
    } catch (error) {
      console.error('Error creating QE program:', error);
      res.status(500).json({ success: false, error: 'Failed to create QE program' });
    }
  });

  // Update QE program status
  router.patch('/quantitative-easing/:programId/status', async (req, res) => {
    try {
      const { programId } = req.params;
      const { status, leader_approval_notes } = req.body;

      const updateFields = ['status = $2', 'updated_at = CURRENT_TIMESTAMP'];
      const values = [programId, status];

      if (status === 'active' && leader_approval_notes) {
        updateFields.push('leader_approval_date = CURRENT_TIMESTAMP');
        updateFields.push('leader_approval_notes = $3');
        values.push(leader_approval_notes);
      }

      const result = await pool.query(`
        UPDATE cb_quantitative_easing 
        SET ${updateFields.join(', ')}
        WHERE id = $1
        RETURNING *
      `, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'QE program not found' });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: `QE program status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating QE program status:', error);
      res.status(500).json({ success: false, error: 'Failed to update QE program status' });
    }
  });

  // Adjust interest rates
  router.post('/interest-rates/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const {
        policy_rate,
        deposit_facility_rate,
        marginal_lending_rate,
        decision_rationale,
        forward_guidance,
        created_by = 'central_bank'
      } = req.body;

      const corridor_width = marginal_lending_rate - deposit_facility_rate;
      const overnight_rate_target = policy_rate;

      const result = await pool.query(`
        INSERT INTO cb_interest_rate_corridor (
          civilization_id, effective_date, policy_rate, deposit_facility_rate,
          marginal_lending_rate, corridor_width, overnight_rate_target,
          decision_rationale, forward_guidance, created_by
        ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        civilizationId, policy_rate, deposit_facility_rate, marginal_lending_rate,
        corridor_width, overnight_rate_target, decision_rationale, forward_guidance, created_by
      ]);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Interest rates updated successfully'
      });
    } catch (error) {
      console.error('Error updating interest rates:', error);
      res.status(500).json({ success: false, error: 'Failed to update interest rates' });
    }
  });

  // Rebalance currency reserves
  router.post('/currencies/:civilizationId/rebalance', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { currency_code, new_target_allocation } = req.body;

      const result = await pool.query(`
        UPDATE cb_currency_holdings 
        SET 
          target_allocation_percent = $3,
          last_rebalance_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE civilization_id = $1 AND currency_code = $2
        RETURNING *
      `, [civilizationId, currency_code, new_target_allocation]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Currency holding not found' });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: `${currency_code} target allocation updated to ${new_target_allocation}%`
      });
    } catch (error) {
      console.error('Error rebalancing currency reserves:', error);
      res.status(500).json({ success: false, error: 'Failed to rebalance currency reserves' });
    }
  });

  // Get comprehensive central bank dashboard data
  router.get('/dashboard/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;

      // Get all key metrics in parallel
      const [reserves, currencies, qePrograms, moneySupply, interestRates, balanceSheet] = await Promise.all([
        pool.query(`
          SELECT reserve_type, SUM(market_value_local) as total_value
          FROM cb_reserves 
          WHERE civilization_id = $1 
          GROUP BY reserve_type
        `, [civilizationId]),
        
        pool.query(`
          SELECT COUNT(*) as currency_count, 
                 SUM(amount * exchange_rate) as total_foreign_reserves
          FROM cb_currency_holdings 
          WHERE civilization_id = $1 AND currency_code != (
            SELECT currency_code FROM cb_currency_holdings 
            WHERE civilization_id = $1 AND amount = 0 LIMIT 1
          )
        `, [civilizationId]),
        
        pool.query(`
          SELECT status, COUNT(*) as count, SUM(target_amount) as total_target
          FROM cb_quantitative_easing 
          WHERE civilization_id = $1 
          GROUP BY status
        `, [civilizationId]),
        
        pool.query(`
          SELECT * FROM cb_money_supply 
          WHERE civilization_id = $1 
          ORDER BY measurement_date DESC 
          LIMIT 1
        `, [civilizationId]),
        
        pool.query(`
          SELECT * FROM cb_interest_rate_corridor 
          WHERE civilization_id = $1 
          ORDER BY effective_date DESC 
          LIMIT 1
        `, [civilizationId]),
        
        pool.query(`
          SELECT * FROM cb_balance_sheet 
          WHERE civilization_id = $1 
          ORDER BY reporting_date DESC 
          LIMIT 1
        `, [civilizationId])
      ]);

      res.json({
        success: true,
        data: {
          reserves: reserves.rows,
          currencies: currencies.rows[0] || {},
          qe_programs: qePrograms.rows,
          money_supply: moneySupply.rows[0] || {},
          interest_rates: interestRates.rows[0] || {},
          balance_sheet: balanceSheet.rows[0] || {}
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
    }
  });

  // Update knob values - AI-controllable parameters
  router.post('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { knob_name, value, adjustment_reason } = req.body;

      if (!CENTRAL_BANK_ENHANCED_KNOBS[knob_name]) {
        return res.status(400).json({ success: false, error: 'Invalid knob name' });
      }

      const knob = CENTRAL_BANK_ENHANCED_KNOBS[knob_name];
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
        ) VALUES ($1, 'central_bank_enhanced', $2, $3, $4, $5, 'player', CURRENT_TIMESTAMP)
      `, [civilizationId, knob_name, knob.default, value, adjustment_reason || 'Manual adjustment']);

      res.json({
        success: true,
        data: {
          knob_name,
          old_value: knob.default,
          new_value: value,
          message: 'Central Bank Enhanced knob updated successfully'
        }
      });
    } catch (error) {
      console.error('Error updating knob:', error);
      res.status(500).json({ success: false, error: 'Failed to update knob' });
    }
  });

  return router;
}

export default createCentralBankEnhancementsRoutes;
