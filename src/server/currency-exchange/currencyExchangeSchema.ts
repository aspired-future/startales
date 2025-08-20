import { Pool } from 'pg';

// Currency Exchange System Types
export interface Currency {
  id: number;
  civilization_id: number;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  base_value: number;
  is_active: boolean;
  is_reserve_currency: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ExchangeRate {
  id: number;
  base_currency_id: number;
  quote_currency_id: number;
  exchange_rate: number;
  bid_rate: number;
  ask_rate: number;
  spread: number;
  last_updated: Date;
  daily_volume: number;
  volatility: number;
}

export interface CurrencyPolicy {
  id: number;
  currency_id: number;
  policy_type: 'floating' | 'fixed' | 'managed_float' | 'currency_board';
  target_currency_id?: number;
  target_rate?: number;
  intervention_bands?: {
    upper_threshold: number;
    lower_threshold: number;
    intervention_strength: number;
  };
  reserve_requirements?: number;
  capital_controls?: {
    inflow_restrictions: boolean;
    outflow_restrictions: boolean;
    investment_limits: number;
    repatriation_rules: string[];
  };
  effective_date: Date;
  created_by?: number;
  created_at: Date;
}

export interface CurrencyTransaction {
  id: number;
  transaction_type: 'trade' | 'investment' | 'intervention' | 'reserve_management' | 'government' | 'tourism';
  from_currency_id: number;
  to_currency_id: number;
  from_amount: number;
  to_amount: number;
  exchange_rate: number;
  transaction_fee: number;
  initiator_type: 'government' | 'central_bank' | 'corporation' | 'trade' | 'citizen' | 'tourist';
  initiator_id?: number;
  settlement_status: 'pending' | 'settled' | 'failed' | 'cancelled';
  created_at: Date;
  settled_at?: Date;
}

export interface CurrencyReserve {
  id: number;
  civilization_id: number;
  currency_id: number;
  reserve_amount: number;
  reserve_type: 'foreign_exchange' | 'gold' | 'special_drawing_rights' | 'cryptocurrency';
  last_updated: Date;
}

export interface CurrencyUnion {
  id: number;
  union_name: string;
  common_currency_id: number;
  created_at: Date;
  is_active: boolean;
}

export interface CurrencyUnionMember {
  id: number;
  union_id: number;
  civilization_id: number;
  joined_date: Date;
  is_active: boolean;
  voting_weight: number;
}

export interface ExchangeRateHistory {
  id: number;
  base_currency_id: number;
  quote_currency_id: number;
  exchange_rate: number;
  recorded_at: Date;
  daily_high?: number;
  daily_low?: number;
  daily_volume?: number;
  market_events?: {
    event_type: string;
    description: string;
    impact_magnitude: number;
  }[];
}

export interface CurrencyMarketData {
  id: number;
  currency_id: number;
  market_cap: number;
  circulating_supply: number;
  inflation_rate: number;
  interest_rate: number;
  gdp_correlation: number;
  trade_balance_impact: number;
  political_stability_score: number;
  economic_growth_rate: number;
  recorded_at: Date;
}

export interface CurrencyIntervention {
  id: number;
  currency_id: number;
  intervention_type: 'buy_support' | 'sell_pressure' | 'rate_announcement' | 'policy_change';
  target_rate?: number;
  intervention_amount: number;
  intervention_currency_id: number;
  success_rate: number;
  market_impact: number;
  executed_by: number; // Central bank director
  executed_at: Date;
  effectiveness_score?: number;
}

// Initialize Currency Exchange System Schema
export async function initializeCurrencyExchangeSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create currencies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currencies (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        currency_code VARCHAR(3) NOT NULL UNIQUE,
        currency_name VARCHAR(100) NOT NULL,
        currency_symbol VARCHAR(10) NOT NULL,
        base_value DECIMAL(15,6) NOT NULL DEFAULT 1.0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        is_reserve_currency BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exchange_rates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        id SERIAL PRIMARY KEY,
        base_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        quote_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        exchange_rate DECIMAL(15,8) NOT NULL,
        bid_rate DECIMAL(15,8) NOT NULL,
        ask_rate DECIMAL(15,8) NOT NULL,
        spread DECIMAL(8,6) NOT NULL DEFAULT 0.001,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        daily_volume DECIMAL(20,2) DEFAULT 0,
        volatility DECIMAL(8,6) DEFAULT 0,
        UNIQUE(base_currency_id, quote_currency_id)
      )
    `);

    // Create currency_policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_policies (
        id SERIAL PRIMARY KEY,
        currency_id INTEGER NOT NULL REFERENCES currencies(id),
        policy_type VARCHAR(50) NOT NULL CHECK (policy_type IN ('floating', 'fixed', 'managed_float', 'currency_board')),
        target_currency_id INTEGER REFERENCES currencies(id),
        target_rate DECIMAL(15,8),
        intervention_bands JSONB,
        reserve_requirements DECIMAL(8,4),
        capital_controls JSONB,
        effective_date TIMESTAMP NOT NULL,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create currency_transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_transactions (
        id SERIAL PRIMARY KEY,
        transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('trade', 'investment', 'intervention', 'reserve_management', 'government', 'tourism')),
        from_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        to_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        from_amount DECIMAL(20,2) NOT NULL,
        to_amount DECIMAL(20,2) NOT NULL,
        exchange_rate DECIMAL(15,8) NOT NULL,
        transaction_fee DECIMAL(10,2) DEFAULT 0,
        initiator_type VARCHAR(50) NOT NULL CHECK (initiator_type IN ('government', 'central_bank', 'corporation', 'trade', 'citizen', 'tourist')),
        initiator_id INTEGER,
        settlement_status VARCHAR(20) DEFAULT 'pending' CHECK (settlement_status IN ('pending', 'settled', 'failed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        settled_at TIMESTAMP
      )
    `);

    // Create currency_reserves table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_reserves (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        currency_id INTEGER NOT NULL REFERENCES currencies(id),
        reserve_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
        reserve_type VARCHAR(50) NOT NULL CHECK (reserve_type IN ('foreign_exchange', 'gold', 'special_drawing_rights', 'cryptocurrency')),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, currency_id, reserve_type)
      )
    `);

    // Create currency_unions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_unions (
        id SERIAL PRIMARY KEY,
        union_name VARCHAR(100) NOT NULL,
        common_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Create currency_union_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_union_members (
        id SERIAL PRIMARY KEY,
        union_id INTEGER NOT NULL REFERENCES currency_unions(id),
        civilization_id INTEGER NOT NULL,
        joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        voting_weight DECIMAL(5,4) DEFAULT 0.25,
        UNIQUE(union_id, civilization_id)
      )
    `);

    // Create exchange_rate_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_rate_history (
        id SERIAL PRIMARY KEY,
        base_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        quote_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        exchange_rate DECIMAL(15,8) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        daily_high DECIMAL(15,8),
        daily_low DECIMAL(15,8),
        daily_volume DECIMAL(20,2),
        market_events JSONB
      )
    `);

    // Create currency_market_data table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_market_data (
        id SERIAL PRIMARY KEY,
        currency_id INTEGER NOT NULL REFERENCES currencies(id),
        market_cap DECIMAL(25,2) DEFAULT 0,
        circulating_supply DECIMAL(25,2) DEFAULT 0,
        inflation_rate DECIMAL(8,6) DEFAULT 0,
        interest_rate DECIMAL(8,6) DEFAULT 0,
        gdp_correlation DECIMAL(8,6) DEFAULT 0,
        trade_balance_impact DECIMAL(8,6) DEFAULT 0,
        political_stability_score DECIMAL(5,2) DEFAULT 50,
        economic_growth_rate DECIMAL(8,6) DEFAULT 0,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create currency_interventions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS currency_interventions (
        id SERIAL PRIMARY KEY,
        currency_id INTEGER NOT NULL REFERENCES currencies(id),
        intervention_type VARCHAR(50) NOT NULL CHECK (intervention_type IN ('buy_support', 'sell_pressure', 'rate_announcement', 'policy_change')),
        target_rate DECIMAL(15,8),
        intervention_amount DECIMAL(20,2) NOT NULL,
        intervention_currency_id INTEGER NOT NULL REFERENCES currencies(id),
        success_rate DECIMAL(5,2) DEFAULT 0,
        market_impact DECIMAL(8,6) DEFAULT 0,
        executed_by INTEGER,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        effectiveness_score DECIMAL(5,2)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_currencies_civilization ON currencies(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(currency_code);
      CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active);
      
      CREATE INDEX IF NOT EXISTS idx_exchange_rates_base ON exchange_rates(base_currency_id);
      CREATE INDEX IF NOT EXISTS idx_exchange_rates_quote ON exchange_rates(quote_currency_id);
      CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated ON exchange_rates(last_updated);
      
      CREATE INDEX IF NOT EXISTS idx_currency_transactions_from ON currency_transactions(from_currency_id);
      CREATE INDEX IF NOT EXISTS idx_currency_transactions_to ON currency_transactions(to_currency_id);
      CREATE INDEX IF NOT EXISTS idx_currency_transactions_type ON currency_transactions(transaction_type);
      CREATE INDEX IF NOT EXISTS idx_currency_transactions_status ON currency_transactions(settlement_status);
      CREATE INDEX IF NOT EXISTS idx_currency_transactions_created ON currency_transactions(created_at);
      
      CREATE INDEX IF NOT EXISTS idx_currency_reserves_civ ON currency_reserves(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_currency_reserves_currency ON currency_reserves(currency_id);
      
      CREATE INDEX IF NOT EXISTS idx_exchange_rate_history_base ON exchange_rate_history(base_currency_id);
      CREATE INDEX IF NOT EXISTS idx_exchange_rate_history_quote ON exchange_rate_history(quote_currency_id);
      CREATE INDEX IF NOT EXISTS idx_exchange_rate_history_recorded ON exchange_rate_history(recorded_at);
      
      CREATE INDEX IF NOT EXISTS idx_currency_market_data_currency ON currency_market_data(currency_id);
      CREATE INDEX IF NOT EXISTS idx_currency_market_data_recorded ON currency_market_data(recorded_at);
      
      CREATE INDEX IF NOT EXISTS idx_currency_interventions_currency ON currency_interventions(currency_id);
      CREATE INDEX IF NOT EXISTS idx_currency_interventions_executed ON currency_interventions(executed_at);
    `);

    // Insert seed data for demonstration
    await insertCurrencyExchangeSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Currency Exchange System schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Currency Exchange System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertCurrencyExchangeSeedData(client: any): Promise<void> {
  // Insert sample currencies for different civilizations
  await client.query(`
    INSERT INTO currencies (civilization_id, currency_code, currency_name, currency_symbol, base_value, is_reserve_currency) VALUES
    (1, 'GCR', 'Galactic Credits', '₡', 1.00, true),
    (2, 'STD', 'Stellar Dollars', '$', 0.85, false),
    (3, 'QTC', 'Quantum Coins', 'Ψ', 1.25, false),
    (4, 'NEX', 'Nexus Units', '⧫', 0.92, false),
    (5, 'ZEN', 'Zenith Marks', '◊', 1.15, false)
    ON CONFLICT (currency_code) DO NOTHING
  `);

  // Insert initial exchange rates (all against Galactic Credits as base)
  await client.query(`
    INSERT INTO exchange_rates (base_currency_id, quote_currency_id, exchange_rate, bid_rate, ask_rate, spread, daily_volume, volatility) 
    SELECT 
      gcr.id as base_currency_id,
      other.id as quote_currency_id,
      (other.base_value / gcr.base_value) as exchange_rate,
      (other.base_value / gcr.base_value) * 0.999 as bid_rate,
      (other.base_value / gcr.base_value) * 1.001 as ask_rate,
      0.002 as spread,
      RANDOM() * 1000000 + 100000 as daily_volume,
      RANDOM() * 0.05 + 0.01 as volatility
    FROM currencies gcr
    CROSS JOIN currencies other
    WHERE gcr.currency_code = 'GCR' AND other.currency_code != 'GCR'
    ON CONFLICT (base_currency_id, quote_currency_id) DO NOTHING
  `);

  // Insert reverse exchange rates (other currencies against GCR)
  await client.query(`
    INSERT INTO exchange_rates (base_currency_id, quote_currency_id, exchange_rate, bid_rate, ask_rate, spread, daily_volume, volatility) 
    SELECT 
      other.id as base_currency_id,
      gcr.id as quote_currency_id,
      (gcr.base_value / other.base_value) as exchange_rate,
      (gcr.base_value / other.base_value) * 0.999 as bid_rate,
      (gcr.base_value / other.base_value) * 1.001 as ask_rate,
      0.002 as spread,
      RANDOM() * 800000 + 50000 as daily_volume,
      RANDOM() * 0.04 + 0.015 as volatility
    FROM currencies gcr
    CROSS JOIN currencies other
    WHERE gcr.currency_code = 'GCR' AND other.currency_code != 'GCR'
    ON CONFLICT (base_currency_id, quote_currency_id) DO NOTHING
  `);

  // Insert currency policies
  await client.query(`
    INSERT INTO currency_policies (currency_id, policy_type, intervention_bands, reserve_requirements, capital_controls, effective_date) 
    SELECT 
      c.id,
      CASE 
        WHEN c.currency_code = 'GCR' THEN 'floating'
        WHEN c.currency_code = 'STD' THEN 'managed_float'
        WHEN c.currency_code = 'QTC' THEN 'fixed'
        ELSE 'floating'
      END as policy_type,
      CASE 
        WHEN c.currency_code = 'STD' THEN '{"upper_threshold": 1.05, "lower_threshold": 0.95, "intervention_strength": 0.1}'::jsonb
        ELSE NULL
      END as intervention_bands,
      CASE 
        WHEN c.currency_code = 'QTC' THEN 0.15
        ELSE 0.05
      END as reserve_requirements,
      CASE 
        WHEN c.currency_code = 'QTC' THEN '{"inflow_restrictions": true, "outflow_restrictions": false, "investment_limits": 0.25, "repatriation_rules": ["quarterly_reporting", "central_bank_approval"]}'::jsonb
        ELSE '{"inflow_restrictions": false, "outflow_restrictions": false, "investment_limits": 1.0, "repatriation_rules": []}'::jsonb
      END as capital_controls,
      CURRENT_TIMESTAMP as effective_date
    FROM currencies c
  `);

  // Insert currency reserves for each civilization
  await client.query(`
    INSERT INTO currency_reserves (civilization_id, currency_id, reserve_amount, reserve_type) 
    SELECT 
      civ_id,
      c.id as currency_id,
      CASE 
        WHEN c.currency_code = 'GCR' THEN RANDOM() * 5000000 + 1000000
        ELSE RANDOM() * 2000000 + 500000
      END as reserve_amount,
      'foreign_exchange' as reserve_type
    FROM (VALUES (1), (2), (3), (4), (5)) AS civs(civ_id)
    CROSS JOIN currencies c
    WHERE c.civilization_id != civs.civ_id
    ON CONFLICT (civilization_id, currency_id, reserve_type) DO NOTHING
  `);

  // Insert sample currency market data
  await client.query(`
    INSERT INTO currency_market_data (currency_id, market_cap, circulating_supply, inflation_rate, interest_rate, gdp_correlation, trade_balance_impact, political_stability_score, economic_growth_rate) 
    SELECT 
      c.id,
      RANDOM() * 1000000000000 + 100000000000 as market_cap,
      RANDOM() * 500000000000 + 50000000000 as circulating_supply,
      RANDOM() * 0.08 + 0.01 as inflation_rate,
      RANDOM() * 0.06 + 0.005 as interest_rate,
      RANDOM() * 0.8 + 0.1 as gdp_correlation,
      RANDOM() * 0.4 - 0.2 as trade_balance_impact,
      RANDOM() * 40 + 30 as political_stability_score,
      RANDOM() * 0.08 + 0.01 as economic_growth_rate
    FROM currencies c
  `);

  // Insert sample currency transactions
  await client.query(`
    INSERT INTO currency_transactions (transaction_type, from_currency_id, to_currency_id, from_amount, to_amount, exchange_rate, transaction_fee, initiator_type, settlement_status, created_at) 
    SELECT 
      (ARRAY['trade', 'investment', 'government', 'tourism'])[floor(random() * 4 + 1)] as transaction_type,
      from_curr.id as from_currency_id,
      to_curr.id as to_currency_id,
      RANDOM() * 1000000 + 10000 as from_amount,
      (RANDOM() * 1000000 + 10000) * (to_curr.base_value / from_curr.base_value) as to_amount,
      to_curr.base_value / from_curr.base_value as exchange_rate,
      RANDOM() * 1000 + 10 as transaction_fee,
      (ARRAY['corporation', 'trade', 'citizen', 'tourist'])[floor(random() * 4 + 1)] as initiator_type,
      (ARRAY['settled', 'settled', 'settled', 'pending'])[floor(random() * 4 + 1)] as settlement_status,
      CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '30 days') as created_at
    FROM currencies from_curr
    CROSS JOIN currencies to_curr
    WHERE from_curr.id != to_curr.id
    LIMIT 50
  `);

  // Insert exchange rate history
  await client.query(`
    INSERT INTO exchange_rate_history (base_currency_id, quote_currency_id, exchange_rate, recorded_at, daily_high, daily_low, daily_volume, market_events) 
    SELECT 
      er.base_currency_id,
      er.quote_currency_id,
      er.exchange_rate * (1 + (RANDOM() - 0.5) * 0.1) as exchange_rate,
      CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '90 days') as recorded_at,
      er.exchange_rate * (1 + RANDOM() * 0.05) as daily_high,
      er.exchange_rate * (1 - RANDOM() * 0.05) as daily_low,
      RANDOM() * 2000000 + 100000 as daily_volume,
      CASE 
        WHEN RANDOM() > 0.8 THEN '[{"event_type": "economic_data", "description": "GDP growth announcement", "impact_magnitude": 0.02}]'::jsonb
        WHEN RANDOM() > 0.9 THEN '[{"event_type": "political_event", "description": "Election results", "impact_magnitude": 0.05}]'::jsonb
        ELSE NULL
      END as market_events
    FROM exchange_rates er
    CROSS JOIN generate_series(1, 10) -- Generate 10 historical records per currency pair
  `);

  console.log('✅ Currency Exchange System seed data inserted successfully');
}
