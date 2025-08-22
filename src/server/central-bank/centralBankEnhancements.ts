import { Pool } from 'pg';

/**
 * Enhanced Central Bank System with Gold Reserves, Multi-Currency Support, and Quantitative Easing
 * This extends the existing Central Bank Advisory System with advanced monetary policy tools
 */

export async function initializeCentralBankEnhancements(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Central Bank Reserves Management
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_reserves (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        reserve_type VARCHAR(50) NOT NULL, -- 'gold', 'foreign_currency', 'special_drawing_rights', 'crypto'
        currency_code VARCHAR(10), -- NULL for gold, currency code for foreign reserves
        amount DECIMAL(20,2) NOT NULL CHECK (amount >= 0),
        market_value_local DECIMAL(20,2) NOT NULL, -- Value in local currency
        acquisition_cost DECIMAL(20,2) NOT NULL, -- Historical cost basis
        acquisition_date TIMESTAMP NOT NULL,
        storage_location VARCHAR(100), -- Physical location or institution
        quality_grade VARCHAR(20), -- For gold: 'fine_gold', 'gold_bars', etc.
        liquidity_rating VARCHAR(20) CHECK (liquidity_rating IN ('immediate', 'short_term', 'medium_term', 'long_term')),
        strategic_purpose VARCHAR(100), -- 'monetary_stability', 'crisis_buffer', 'diversification'
        last_valuation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_valuation_price DECIMAL(15,4), -- Price per unit at last valuation
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Multi-Currency Holdings and Exchange Rates
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_currency_holdings (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        currency_code VARCHAR(10) NOT NULL,
        currency_name VARCHAR(100) NOT NULL,
        issuing_civilization TEXT REFERENCES civilizations(id),
        amount DECIMAL(20,2) NOT NULL CHECK (amount >= 0),
        exchange_rate DECIMAL(15,6) NOT NULL, -- Rate to local currency
        target_allocation_percent DECIMAL(5,2), -- Target % of total reserves
        actual_allocation_percent DECIMAL(5,2), -- Current % of total reserves
        yield_rate DECIMAL(5,2), -- Interest earned on holdings
        credit_rating VARCHAR(10), -- Credit rating of issuing civilization
        last_rebalance_date TIMESTAMP,
        rebalance_threshold DECIMAL(5,2) DEFAULT 5.00, -- Trigger rebalancing at +/- this %
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, currency_code)
      )
    `);

    // Quantitative Easing Operations
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_quantitative_easing (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        program_name VARCHAR(200) NOT NULL,
        program_type VARCHAR(50) NOT NULL, -- 'government_bonds', 'corporate_bonds', 'mortgage_securities', 'asset_purchases'
        target_amount DECIMAL(20,2) NOT NULL,
        purchased_amount DECIMAL(20,2) DEFAULT 0,
        remaining_amount DECIMAL(20,2) NOT NULL,
        purchase_rate_monthly DECIMAL(20,2) NOT NULL, -- Monthly purchase target
        interest_rate_target DECIMAL(5,2), -- Target interest rate to achieve
        duration_months INTEGER NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed', 'terminated')),
        economic_justification TEXT NOT NULL,
        expected_outcomes JSONB NOT NULL DEFAULT '{}', -- Expected economic impacts
        actual_outcomes JSONB DEFAULT '{}', -- Measured results
        asset_composition JSONB NOT NULL DEFAULT '{}', -- Breakdown of assets purchased
        market_impact_assessment TEXT,
        exit_strategy TEXT, -- How to unwind the program
        leader_approval_required BOOLEAN DEFAULT true,
        leader_approval_date TIMESTAMP,
        leader_approval_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // QE Purchase Transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_qe_transactions (
        id SERIAL PRIMARY KEY,
        qe_program_id INTEGER NOT NULL REFERENCES cb_quantitative_easing(id),
        transaction_date TIMESTAMP NOT NULL,
        asset_type VARCHAR(50) NOT NULL, -- 'government_bond', 'corporate_bond', etc.
        asset_identifier VARCHAR(100), -- Bond ISIN, stock ticker, etc.
        quantity DECIMAL(20,2) NOT NULL,
        unit_price DECIMAL(15,4) NOT NULL,
        total_value DECIMAL(20,2) NOT NULL,
        yield_at_purchase DECIMAL(5,4),
        maturity_date TIMESTAMP,
        counterparty VARCHAR(200), -- Who sold the asset
        market_maker VARCHAR(200), -- Primary dealer or market maker
        settlement_date TIMESTAMP,
        transaction_fees DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Money Supply Management
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_money_supply (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        measurement_date TIMESTAMP NOT NULL,
        m0_currency_circulation DECIMAL(20,2) NOT NULL, -- Physical currency
        m1_narrow_money DECIMAL(20,2) NOT NULL, -- M0 + demand deposits
        m2_broad_money DECIMAL(20,2) NOT NULL, -- M1 + savings deposits
        m3_broadest_money DECIMAL(20,2), -- M2 + large time deposits (if applicable)
        monetary_base DECIMAL(20,2) NOT NULL, -- Currency + bank reserves
        bank_reserves DECIMAL(20,2) NOT NULL,
        excess_reserves DECIMAL(20,2) NOT NULL,
        required_reserves DECIMAL(20,2) NOT NULL,
        reserve_ratio DECIMAL(5,4) NOT NULL,
        money_multiplier DECIMAL(8,4) NOT NULL,
        velocity_of_money DECIMAL(8,4), -- GDP / Money Supply
        inflation_rate_annual DECIMAL(5,2),
        target_growth_rate DECIMAL(5,2), -- Target money supply growth
        actual_growth_rate DECIMAL(5,2), -- Actual growth vs previous period
        policy_tools_active JSONB DEFAULT '{}', -- Which tools are currently in use
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Interest Rate Corridor System
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_interest_rate_corridor (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        effective_date TIMESTAMP NOT NULL,
        policy_rate DECIMAL(5,4) NOT NULL, -- Main policy rate
        deposit_facility_rate DECIMAL(5,4) NOT NULL, -- Floor of the corridor
        marginal_lending_rate DECIMAL(5,4) NOT NULL, -- Ceiling of the corridor
        corridor_width DECIMAL(5,4) NOT NULL, -- Spread between ceiling and floor
        overnight_rate_target DECIMAL(5,4) NOT NULL,
        actual_overnight_rate DECIMAL(5,4), -- Market rate achieved
        rate_change_basis_points INTEGER DEFAULT 0, -- Change from previous setting
        decision_rationale TEXT NOT NULL,
        forward_guidance TEXT, -- Communication about future rate path
        market_expectations JSONB DEFAULT '{}', -- What markets expect
        international_comparison JSONB DEFAULT '{}', -- Rates in other civilizations
        next_review_date TIMESTAMP,
        created_by VARCHAR(100) NOT NULL, -- 'central_bank', 'leader_override', 'emergency_protocol'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reserve Requirements by Bank Type
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_reserve_requirements (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        bank_category VARCHAR(50) NOT NULL, -- 'commercial', 'investment', 'cooperative', 'foreign'
        deposit_type VARCHAR(50) NOT NULL, -- 'demand', 'savings', 'time', 'foreign_currency'
        reserve_ratio DECIMAL(5,4) NOT NULL CHECK (reserve_ratio >= 0 AND reserve_ratio <= 1),
        minimum_ratio DECIMAL(5,4) NOT NULL,
        maximum_ratio DECIMAL(5,4) NOT NULL,
        averaging_period_days INTEGER DEFAULT 14, -- Period over which reserves are averaged
        penalty_rate DECIMAL(5,4), -- Rate charged for reserve deficiencies
        remuneration_rate DECIMAL(5,4), -- Rate paid on required reserves
        effective_date TIMESTAMP NOT NULL,
        review_frequency_months INTEGER DEFAULT 6,
        next_review_date TIMESTAMP,
        policy_objective TEXT, -- Why this requirement exists
        exemption_threshold DECIMAL(15,2), -- Small banks may be exempt below this size
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, bank_category, deposit_type, effective_date)
      )
    `);

    // Central Bank Balance Sheet
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_balance_sheet (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        reporting_date TIMESTAMP NOT NULL,
        
        -- Assets
        gold_reserves DECIMAL(20,2) NOT NULL DEFAULT 0,
        foreign_currency_reserves DECIMAL(20,2) NOT NULL DEFAULT 0,
        government_securities DECIMAL(20,2) NOT NULL DEFAULT 0,
        corporate_securities DECIMAL(20,2) NOT NULL DEFAULT 0,
        loans_to_banks DECIMAL(20,2) NOT NULL DEFAULT 0,
        other_assets DECIMAL(20,2) NOT NULL DEFAULT 0,
        total_assets DECIMAL(20,2) NOT NULL,
        
        -- Liabilities
        currency_in_circulation DECIMAL(20,2) NOT NULL DEFAULT 0,
        bank_deposits DECIMAL(20,2) NOT NULL DEFAULT 0,
        government_deposits DECIMAL(20,2) NOT NULL DEFAULT 0,
        foreign_deposits DECIMAL(20,2) NOT NULL DEFAULT 0,
        other_liabilities DECIMAL(20,2) NOT NULL DEFAULT 0,
        capital_and_reserves DECIMAL(20,2) NOT NULL DEFAULT 0,
        total_liabilities DECIMAL(20,2) NOT NULL,
        
        -- Ratios and Metrics
        assets_to_gdp_ratio DECIMAL(5,4),
        gold_coverage_ratio DECIMAL(5,4), -- Gold reserves / Currency in circulation
        foreign_reserves_months_imports DECIMAL(5,2), -- Months of imports covered
        leverage_ratio DECIMAL(5,4), -- Total assets / Capital
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, reporting_date)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_reserves_civilization ON cb_reserves(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_cb_reserves_type ON cb_reserves(reserve_type);
      CREATE INDEX IF NOT EXISTS idx_cb_currency_holdings_civilization ON cb_currency_holdings(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_cb_qe_civilization ON cb_quantitative_easing(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_cb_qe_status ON cb_quantitative_easing(status);
      CREATE INDEX IF NOT EXISTS idx_cb_money_supply_civilization ON cb_money_supply(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_cb_money_supply_date ON cb_money_supply(measurement_date);
      CREATE INDEX IF NOT EXISTS idx_cb_balance_sheet_civilization ON cb_balance_sheet(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_cb_balance_sheet_date ON cb_balance_sheet(reporting_date);
    `);

    // Insert initial seed data
    await insertCentralBankEnhancementsSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Central Bank Enhancements schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Central Bank Enhancements schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert seed data for Central Bank Enhancements
 */
async function insertCentralBankEnhancementsSeedData(client: any): Promise<void> {
  // First, check what civilizations exist
  const civilizationsResult = await client.query('SELECT id FROM civilizations LIMIT 5');
  const existingCivs = civilizationsResult.rows.map(row => row.id);
  
  if (existingCivs.length === 0) {
    console.log('⚠️ No civilizations found, skipping Central Bank Enhancements seed data');
    return;
  }

  console.log(`📋 Found ${existingCivs.length} civilizations, inserting Central Bank data for: ${existingCivs.join(', ')}`);

  // Insert initial gold and currency reserves for existing civilizations
  for (let i = 0; i < Math.min(existingCivs.length, 3); i++) {
    const civId = existingCivs[i];
    const goldAmount = [8133.5, 3214.7, 2845.2][i];
    const goldValue = [450000000000, 178000000000, 157000000000][i];
    const goldCost = [380000000000, 165000000000, 148000000000][i];
    const location = ['Fort Knox Galactic', 'Alpha Centauri Reserve', 'Vega Prime Treasury'][i];

    await client.query(`
      INSERT INTO cb_reserves (civilization_id, reserve_type, currency_code, amount, market_value_local, acquisition_cost, acquisition_date, storage_location, quality_grade, liquidity_rating, strategic_purpose, last_valuation_price)
      VALUES ($1, 'gold', NULL, $2, $3, $4, '2020-01-01', $5, 'fine_gold', 'medium_term', 'monetary_stability', 55000)
      ON CONFLICT DO NOTHING
    `, [civId, goldAmount, goldValue, goldCost, location]);
  }

  // Insert currency holdings for existing civilizations
  for (let i = 0; i < Math.min(existingCivs.length, 3); i++) {
    const civId = existingCivs[i];
    const currencyCodes = ['TER', 'ALC', 'VEG'];
    const currencyNames = ['Terran Credit', 'Alpha Centauri Dollar', 'Vega Prime Yuan'];
    
    // Insert own currency (0 amount)
    await client.query(`
      INSERT INTO cb_currency_holdings (civilization_id, currency_code, currency_name, issuing_civilization, amount, exchange_rate, target_allocation_percent, actual_allocation_percent, yield_rate, credit_rating)
      VALUES ($1, $2, $3, $1, 0, 1.000000, 0.00, 0.00, 0.00, 'AAA')
      ON CONFLICT (civilization_id, currency_code) DO NOTHING
    `, [civId, currencyCodes[i], currencyNames[i]]);
    
    // Insert foreign currency holdings (if other civs exist)
    if (existingCivs.length > 1) {
      const otherCivs = existingCivs.filter((_, idx) => idx !== i);
      for (let j = 0; j < Math.min(otherCivs.length, 2); j++) {
        const otherCivId = otherCivs[j];
        const otherCurrencyIdx = existingCivs.indexOf(otherCivId);
        const amount = [125000000000, 95000000000, 75000000000][j] || 50000000000;
        
        await client.query(`
          INSERT INTO cb_currency_holdings (civilization_id, currency_code, currency_name, issuing_civilization, amount, exchange_rate, target_allocation_percent, actual_allocation_percent, yield_rate, credit_rating)
          VALUES ($1, $2, $3, $4, $5, 1.000000, 30.00, 25.00, 2.00, 'AA')
          ON CONFLICT (civilization_id, currency_code) DO NOTHING
        `, [civId, currencyCodes[otherCurrencyIdx], currencyNames[otherCurrencyIdx], otherCivId, amount]);
      }
    }
  }

  // Insert sample QE programs for existing civilizations
  const qePrograms = [
    {
      name: 'Economic Recovery Asset Purchase Program',
      type: 'government_bonds',
      target: 500000000000,
      rate: 25000000000,
      justification: 'Stimulate economic growth following galactic trade disruptions and support government financing during infrastructure expansion.'
    },
    {
      name: 'Financial Stability Support Program', 
      type: 'corporate_bonds',
      target: 200000000000,
      rate: 12000000000,
      justification: 'Support corporate financing markets and maintain credit flow to productive sectors during market volatility.'
    },
    {
      name: 'Green Transition Quantitative Easing',
      type: 'asset_purchases', 
      target: 150000000000,
      rate: 8000000000,
      justification: 'Support transition to sustainable energy systems and green infrastructure development.'
    }
  ];

  for (let i = 0; i < Math.min(existingCivs.length, qePrograms.length); i++) {
    const civId = existingCivs[i];
    const program = qePrograms[i];
    
    await client.query(`
      INSERT INTO cb_quantitative_easing (civilization_id, program_name, program_type, target_amount, purchase_rate_monthly, interest_rate_target, duration_months, start_date, end_date, economic_justification, expected_outcomes, asset_composition, exit_strategy, remaining_amount)
      VALUES ($1, $2, $3, $4, $5, 1.75, 20, '2024-06-01', '2026-01-31', $6, '{}', '{}', 'Market-based exit when conditions normalize', $4)
      ON CONFLICT DO NOTHING
    `, [civId, program.name, program.type, program.target, program.rate, program.justification]);
  }

  // Insert money supply data for existing civilizations
  const moneySupplyData = [
    { m0: 2500000000000, m1: 8500000000000, m2: 18500000000000, base: 3200000000000, reserves: 700000000000 },
    { m0: 1800000000000, m1: 6200000000000, m2: 13800000000000, base: 2300000000000, reserves: 500000000000 },
    { m0: 1200000000000, m1: 4100000000000, m2: 9200000000000, base: 1500000000000, reserves: 300000000000 }
  ];

  for (let i = 0; i < Math.min(existingCivs.length, moneySupplyData.length); i++) {
    const civId = existingCivs[i];
    const data = moneySupplyData[i];
    
    await client.query(`
      INSERT INTO cb_money_supply (civilization_id, measurement_date, m0_currency_circulation, m1_narrow_money, m2_broad_money, monetary_base, bank_reserves, excess_reserves, required_reserves, reserve_ratio, money_multiplier, velocity_of_money, inflation_rate_annual, target_growth_rate, actual_growth_rate)
      VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, 150000000000, 550000000000, 0.0650, 5.78, 1.45, 2.1, 3.5, 3.2)
      ON CONFLICT DO NOTHING
    `, [civId, data.m0, data.m1, data.m2, data.base, data.reserves]);
  }

  // Insert interest rate corridor settings for existing civilizations
  const interestRateData = [
    { policy: 2.5000, deposit: 1.7500, lending: 3.2500, rationale: 'Maintaining accommodative stance to support economic recovery while monitoring inflation pressures.' },
    { policy: 3.0000, deposit: 2.2500, lending: 3.7500, rationale: 'Neutral policy stance balancing growth support with inflation control in a stable economic environment.' },
    { policy: 1.7500, deposit: 1.0000, lending: 2.5000, rationale: 'Accommodative policy to support green transition investments and sustainable economic development.' }
  ];

  for (let i = 0; i < Math.min(existingCivs.length, interestRateData.length); i++) {
    const civId = existingCivs[i];
    const rates = interestRateData[i];
    const corridorWidth = rates.lending - rates.deposit;
    
    await client.query(`
      INSERT INTO cb_interest_rate_corridor (civilization_id, effective_date, policy_rate, deposit_facility_rate, marginal_lending_rate, corridor_width, overnight_rate_target, actual_overnight_rate, decision_rationale, forward_guidance, created_by)
      VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $2, $2, $6, 'Policy rates expected to remain stable with gradual adjustments based on economic conditions.', 'central_bank')
      ON CONFLICT DO NOTHING
    `, [civId, rates.policy, rates.deposit, rates.lending, corridorWidth, rates.rationale]);
  }

  console.log('✅ Central Bank Enhancements seed data inserted successfully');
}

// Export interfaces for TypeScript support
export interface CentralBankReserve {
  id: number;
  civilization_id: string;
  reserve_type: 'gold' | 'foreign_currency' | 'special_drawing_rights' | 'crypto';
  currency_code?: string;
  amount: number;
  market_value_local: number;
  acquisition_cost: number;
  acquisition_date: Date;
  storage_location: string;
  quality_grade?: string;
  liquidity_rating: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  strategic_purpose: string;
  last_valuation_date: Date;
  last_valuation_price?: number;
}

export interface QuantitativeEasingProgram {
  id: number;
  civilization_id: string;
  program_name: string;
  program_type: 'government_bonds' | 'corporate_bonds' | 'mortgage_securities' | 'asset_purchases';
  target_amount: number;
  purchased_amount: number;
  remaining_amount: number;
  purchase_rate_monthly: number;
  interest_rate_target?: number;
  duration_months: number;
  start_date: Date;
  end_date: Date;
  status: 'planned' | 'active' | 'paused' | 'completed' | 'terminated';
  economic_justification: string;
  expected_outcomes: any;
  actual_outcomes?: any;
  asset_composition: any;
  exit_strategy: string;
}

export interface MoneySupplyData {
  id: number;
  civilization_id: string;
  measurement_date: Date;
  m0_currency_circulation: number;
  m1_narrow_money: number;
  m2_broad_money: number;
  monetary_base: number;
  bank_reserves: number;
  excess_reserves: number;
  required_reserves: number;
  reserve_ratio: number;
  money_multiplier: number;
  velocity_of_money?: number;
  inflation_rate_annual?: number;
  target_growth_rate?: number;
  actual_growth_rate?: number;
}
