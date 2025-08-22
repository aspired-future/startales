import { Pool } from 'pg';

/**
 * Sovereign Wealth Fund System Database Schema
 * Manages government investment funds with multiple financing sources and investment strategies
 */

export async function initializeSovereignWealthFundSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Sovereign Wealth Funds - Main fund entities
    await client.query(`
      CREATE TABLE IF NOT EXISTS sovereign_wealth_funds (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        fund_name VARCHAR(200) NOT NULL,
        fund_type VARCHAR(50) NOT NULL, -- 'stabilization', 'development', 'pension', 'strategic', 'heritage'
        establishment_date TIMESTAMP NOT NULL,
        legal_structure VARCHAR(100), -- 'government_entity', 'corporation', 'trust', 'special_purpose_vehicle'
        governance_model VARCHAR(100), -- 'direct_government', 'independent_board', 'hybrid'
        mandate TEXT NOT NULL, -- Fund's investment mandate and objectives
        target_size DECIMAL(20,2), -- Target fund size if applicable
        current_aum DECIMAL(20,2) NOT NULL DEFAULT 0, -- Assets Under Management
        inception_value DECIMAL(20,2) NOT NULL DEFAULT 0,
        performance_benchmark VARCHAR(100), -- What the fund benchmarks against
        risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'balanced')),
        investment_horizon VARCHAR(20) CHECK (investment_horizon IN ('short_term', 'medium_term', 'long_term', 'perpetual')),
        transparency_level VARCHAR(20) CHECK (transparency_level IN ('high', 'medium', 'low', 'classified')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'liquidating', 'closed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, fund_name)
      )
    `);

    // Fund Financing Sources - How funds are capitalized
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_financing_sources (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        source_type VARCHAR(50) NOT NULL, -- 'tax_revenue', 'resource_extraction', 'central_bank_transfer', 'bond_issuance', 'privatization', 'budget_surplus'
        source_name VARCHAR(200) NOT NULL,
        contribution_amount DECIMAL(20,2) NOT NULL,
        contribution_date TIMESTAMP NOT NULL,
        contribution_frequency VARCHAR(20), -- 'one_time', 'monthly', 'quarterly', 'annual', 'irregular'
        automatic_transfer BOOLEAN DEFAULT false, -- Whether transfers happen automatically
        transfer_percentage DECIMAL(5,2), -- Percentage of source revenue to transfer
        minimum_transfer DECIMAL(15,2), -- Minimum transfer amount per period
        maximum_transfer DECIMAL(15,2), -- Maximum transfer amount per period
        conditions TEXT, -- Conditions under which transfers occur
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Investment Strategies - How funds invest their capital
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_investment_strategies (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        strategy_name VARCHAR(200) NOT NULL,
        asset_class VARCHAR(50) NOT NULL, -- 'equities', 'fixed_income', 'real_estate', 'infrastructure', 'commodities', 'alternatives', 'cash'
        geographic_focus VARCHAR(100), -- 'domestic', 'regional', 'global', 'developed_markets', 'emerging_markets'
        sector_focus VARCHAR(100), -- Specific sectors if applicable
        target_allocation_percent DECIMAL(5,2) NOT NULL CHECK (target_allocation_percent >= 0 AND target_allocation_percent <= 100),
        current_allocation_percent DECIMAL(5,2) DEFAULT 0,
        minimum_allocation DECIMAL(5,2) DEFAULT 0,
        maximum_allocation DECIMAL(5,2) DEFAULT 100,
        investment_approach VARCHAR(50), -- 'passive', 'active', 'hybrid', 'direct_investment'
        expected_return DECIMAL(5,2), -- Expected annual return percentage
        risk_level VARCHAR(20) CHECK (risk_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
        liquidity_requirement VARCHAR(20) CHECK (liquidity_requirement IN ('immediate', 'short_term', 'medium_term', 'long_term', 'illiquid')),
        esg_criteria BOOLEAN DEFAULT false, -- Environmental, Social, Governance criteria
        strategic_importance BOOLEAN DEFAULT false, -- Strategic vs. financial investment
        rebalancing_frequency VARCHAR(20) DEFAULT 'quarterly',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fund Holdings - Specific investments
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_holdings (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        strategy_id INTEGER REFERENCES swf_investment_strategies(id),
        holding_type VARCHAR(50) NOT NULL, -- 'equity', 'bond', 'index_fund', 'government_bond', 'corporate_bond', 'real_estate', 'infrastructure', 'commodity', 'cash', 'other'
        asset_name VARCHAR(200) NOT NULL,
        asset_identifier VARCHAR(100), -- Ticker, ISIN, or other identifier
        
        -- Investment Location & Market
        issuing_civilization_id TEXT REFERENCES civilizations(id), -- Which civilization issued this asset
        market_exchange VARCHAR(100), -- Which exchange/market it's traded on
        is_domestic BOOLEAN DEFAULT true, -- Whether it's a domestic or foreign investment
        
        -- Quantity and Valuation
        quantity DECIMAL(20,4) NOT NULL,
        unit_cost DECIMAL(15,4) NOT NULL,
        current_value DECIMAL(20,2) NOT NULL,
        market_value DECIMAL(20,2) NOT NULL,
        unrealized_gain_loss DECIMAL(20,2) DEFAULT 0,
        
        -- Dates
        acquisition_date TIMESTAMP NOT NULL,
        last_valuation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        maturity_date TIMESTAMP, -- For bonds and other time-limited assets
        
        -- Currency and Exchange
        currency_code VARCHAR(10) NOT NULL DEFAULT 'USD',
        exchange_rate DECIMAL(10,6) DEFAULT 1.0,
        currency_hedged BOOLEAN DEFAULT false, -- Whether currency risk is hedged
        
        -- Asset-Specific Details
        dividend_yield DECIMAL(5,4), -- For equity holdings
        coupon_rate DECIMAL(5,4), -- For bond holdings
        credit_rating VARCHAR(10), -- For bonds
        index_composition JSONB, -- For index funds - what they track
        
        -- Classification
        sector VARCHAR(100),
        industry VARCHAR(100),
        company_size VARCHAR(20), -- 'large_cap', 'mid_cap', 'small_cap', 'micro_cap'
        country VARCHAR(100),
        region VARCHAR(100),
        
        -- Risk and ESG
        liquidity_score INTEGER CHECK (liquidity_score BETWEEN 1 AND 10),
        volatility_score INTEGER CHECK (volatility_score BETWEEN 1 AND 10),
        esg_score INTEGER CHECK (esg_score BETWEEN 1 AND 100),
        strategic_holding BOOLEAN DEFAULT false,
        
        -- Investment Rationale
        investment_thesis TEXT, -- Why this investment was made
        target_weight DECIMAL(5,2), -- Target weight in portfolio
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Performance Tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_performance (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        reporting_date TIMESTAMP NOT NULL,
        total_assets DECIMAL(20,2) NOT NULL,
        total_liabilities DECIMAL(20,2) DEFAULT 0,
        net_asset_value DECIMAL(20,2) NOT NULL,
        period_return DECIMAL(8,4), -- Return for the period (percentage)
        annualized_return DECIMAL(8,4), -- Annualized return since inception
        benchmark_return DECIMAL(8,4), -- Benchmark return for comparison
        excess_return DECIMAL(8,4), -- Return vs benchmark
        volatility DECIMAL(8,4), -- Standard deviation of returns
        sharpe_ratio DECIMAL(8,4), -- Risk-adjusted return measure
        max_drawdown DECIMAL(8,4), -- Maximum peak-to-trough decline
        total_contributions DECIMAL(20,2) NOT NULL DEFAULT 0,
        total_withdrawals DECIMAL(20,2) NOT NULL DEFAULT 0,
        management_fees DECIMAL(15,2) DEFAULT 0,
        performance_fees DECIMAL(15,2) DEFAULT 0,
        operating_expenses DECIMAL(15,2) DEFAULT 0,
        currency_impact DECIMAL(8,4), -- Impact of currency movements
        asset_allocation JSONB NOT NULL DEFAULT '{}', -- Current allocation by asset class
        geographic_allocation JSONB DEFAULT '{}', -- Allocation by geography
        sector_allocation JSONB DEFAULT '{}', -- Allocation by sector
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(fund_id, reporting_date)
      )
    `);

    // Fund Transactions - All inflows and outflows
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_transactions (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        transaction_date TIMESTAMP NOT NULL,
        transaction_type VARCHAR(50) NOT NULL, -- 'contribution', 'withdrawal', 'investment', 'divestment', 'dividend', 'interest', 'fee', 'rebalancing'
        amount DECIMAL(20,2) NOT NULL,
        currency_code VARCHAR(10) NOT NULL DEFAULT 'USD',
        exchange_rate DECIMAL(10,6) DEFAULT 1.0,
        amount_local_currency DECIMAL(20,2) NOT NULL,
        counterparty VARCHAR(200), -- Who the transaction was with
        description TEXT,
        reference_id VARCHAR(100), -- External reference
        holding_id INTEGER REFERENCES swf_holdings(id), -- If related to specific holding
        financing_source_id INTEGER REFERENCES swf_financing_sources(id), -- If from specific source
        settlement_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fund Governance and Oversight
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_governance (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        governance_type VARCHAR(50) NOT NULL, -- 'board_meeting', 'investment_committee', 'risk_committee', 'audit', 'compliance_review'
        meeting_date TIMESTAMP NOT NULL,
        participants JSONB NOT NULL DEFAULT '[]', -- List of participants
        agenda_items JSONB NOT NULL DEFAULT '[]',
        decisions_made JSONB NOT NULL DEFAULT '[]',
        action_items JSONB NOT NULL DEFAULT '[]',
        risk_assessments JSONB DEFAULT '{}',
        compliance_status VARCHAR(20) DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'minor_issues', 'major_issues', 'non_compliant')),
        next_review_date TIMESTAMP,
        meeting_minutes TEXT,
        confidentiality_level VARCHAR(20) DEFAULT 'internal' CHECK (confidentiality_level IN ('public', 'internal', 'restricted', 'classified')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Risk Management
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_risk_metrics (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        measurement_date TIMESTAMP NOT NULL,
        var_95 DECIMAL(15,2), -- Value at Risk (95% confidence)
        var_99 DECIMAL(15,2), -- Value at Risk (99% confidence)
        expected_shortfall DECIMAL(15,2), -- Expected loss beyond VaR
        beta DECIMAL(6,4), -- Market beta
        correlation_to_market DECIMAL(6,4), -- Correlation with market benchmark
        concentration_risk DECIMAL(8,4), -- Largest position as % of fund
        liquidity_risk DECIMAL(8,4), -- Percentage of illiquid assets
        currency_risk DECIMAL(8,4), -- Foreign exchange exposure
        credit_risk DECIMAL(8,4), -- Credit exposure risk
        operational_risk_score INTEGER CHECK (operational_risk_score BETWEEN 1 AND 10),
        political_risk_score INTEGER CHECK (political_risk_score BETWEEN 1 AND 10),
        esg_risk_score INTEGER CHECK (esg_risk_score BETWEEN 1 AND 100),
        stress_test_results JSONB DEFAULT '{}', -- Results of various stress tests
        risk_limits JSONB DEFAULT '{}', -- Current risk limits and utilization
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(fund_id, measurement_date)
      )
    `);

    // Investment Universe - Available investment opportunities
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_investment_universe (
        id SERIAL PRIMARY KEY,
        issuing_civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        asset_type VARCHAR(50) NOT NULL, -- 'government_bond', 'corporate_bond', 'equity', 'index_fund', 'etf', 'reit'
        asset_name VARCHAR(200) NOT NULL,
        asset_symbol VARCHAR(50) NOT NULL,
        market_exchange VARCHAR(100) NOT NULL,
        
        -- Asset Details
        currency_code VARCHAR(10) NOT NULL,
        market_cap DECIMAL(20,2), -- For equities
        outstanding_amount DECIMAL(20,2), -- For bonds
        
        -- Pricing and Yield
        current_price DECIMAL(15,4) NOT NULL,
        price_change_24h DECIMAL(8,4) DEFAULT 0,
        dividend_yield DECIMAL(5,4), -- For equities
        coupon_rate DECIMAL(5,4), -- For bonds
        yield_to_maturity DECIMAL(5,4), -- For bonds
        
        -- Classification
        sector VARCHAR(100),
        industry VARCHAR(100),
        company_size VARCHAR(20), -- 'large_cap', 'mid_cap', 'small_cap'
        credit_rating VARCHAR(10), -- For bonds
        
        -- Dates
        issue_date TIMESTAMP,
        maturity_date TIMESTAMP, -- For bonds
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Investment Metrics
        liquidity_rating INTEGER CHECK (liquidity_rating BETWEEN 1 AND 10),
        volatility_30d DECIMAL(8,4), -- 30-day volatility
        volume_24h DECIMAL(20,2), -- Trading volume
        
        -- Access Requirements
        minimum_investment DECIMAL(15,2) DEFAULT 0,
        requires_currency VARCHAR(10), -- Which currency is needed to invest
        foreign_ownership_allowed BOOLEAN DEFAULT true,
        regulatory_restrictions TEXT,
        
        -- ESG and Strategic
        esg_score INTEGER CHECK (esg_score BETWEEN 1 AND 100),
        strategic_sector BOOLEAN DEFAULT false, -- Whether it's in a strategic sector
        
        -- Index Fund Specific
        index_composition JSONB, -- What the index tracks
        expense_ratio DECIMAL(5,4), -- For funds
        
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(issuing_civilization_id, asset_symbol, market_exchange)
      )
    `);

    // Currency Holdings for Investment - Track what currencies the fund has access to
    await client.query(`
      CREATE TABLE IF NOT EXISTS swf_currency_access (
        id SERIAL PRIMARY KEY,
        fund_id INTEGER NOT NULL REFERENCES sovereign_wealth_funds(id) ON DELETE CASCADE,
        currency_code VARCHAR(10) NOT NULL,
        currency_name VARCHAR(100) NOT NULL,
        issuing_civilization_id TEXT REFERENCES civilizations(id),
        
        -- Holdings
        available_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
        reserved_amount DECIMAL(20,2) NOT NULL DEFAULT 0, -- Reserved for pending investments
        total_amount DECIMAL(20,2) GENERATED ALWAYS AS (available_amount + reserved_amount) STORED,
        
        -- Exchange Rates
        exchange_rate_to_base DECIMAL(10,6) NOT NULL DEFAULT 1.0, -- Rate to fund's base currency
        last_rate_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Access Method
        access_method VARCHAR(50) NOT NULL, -- 'central_bank_swap', 'forex_market', 'direct_holding', 'trade_surplus'
        acquisition_cost DECIMAL(20,2), -- Cost to acquire this currency
        
        -- Limits and Restrictions
        maximum_exposure DECIMAL(20,2), -- Maximum allowed holding
        minimum_reserve DECIMAL(20,2) DEFAULT 0, -- Minimum to keep in reserve
        
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(fund_id, currency_code)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_swf_civilization ON sovereign_wealth_funds(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_swf_type ON sovereign_wealth_funds(fund_type);
      CREATE INDEX IF NOT EXISTS idx_swf_status ON sovereign_wealth_funds(status);
      CREATE INDEX IF NOT EXISTS idx_swf_financing_fund ON swf_financing_sources(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_financing_type ON swf_financing_sources(source_type);
      CREATE INDEX IF NOT EXISTS idx_swf_strategies_fund ON swf_investment_strategies(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_strategies_asset_class ON swf_investment_strategies(asset_class);
      CREATE INDEX IF NOT EXISTS idx_swf_holdings_fund ON swf_holdings(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_holdings_type ON swf_holdings(holding_type);
      CREATE INDEX IF NOT EXISTS idx_swf_holdings_civilization ON swf_holdings(issuing_civilization_id);
      CREATE INDEX IF NOT EXISTS idx_swf_performance_fund ON swf_performance(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_performance_date ON swf_performance(reporting_date);
      CREATE INDEX IF NOT EXISTS idx_swf_transactions_fund ON swf_transactions(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_transactions_date ON swf_transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_swf_transactions_type ON swf_transactions(transaction_type);
      CREATE INDEX IF NOT EXISTS idx_swf_investment_universe_civ ON swf_investment_universe(issuing_civilization_id);
      CREATE INDEX IF NOT EXISTS idx_swf_investment_universe_type ON swf_investment_universe(asset_type);
      CREATE INDEX IF NOT EXISTS idx_swf_investment_universe_currency ON swf_investment_universe(currency_code);
      CREATE INDEX IF NOT EXISTS idx_swf_currency_access_fund ON swf_currency_access(fund_id);
      CREATE INDEX IF NOT EXISTS idx_swf_currency_access_currency ON swf_currency_access(currency_code);
    `);

    // Insert seed data
    await insertSovereignWealthFundSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Sovereign Wealth Fund schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Sovereign Wealth Fund schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert seed data for Sovereign Wealth Fund system
 */
async function insertSovereignWealthFundSeedData(client: any): Promise<void> {
  // First, check what civilizations exist
  const civilizationsResult = await client.query('SELECT id FROM civilizations LIMIT 5');
  const existingCivs = civilizationsResult.rows.map(row => row.id);
  
  if (existingCivs.length === 0) {
    console.log('⚠️ No civilizations found, skipping Sovereign Wealth Fund seed data');
    return;
  }

  console.log(`📋 Found ${existingCivs.length} civilizations, inserting Sovereign Wealth Fund data for: ${existingCivs.join(', ')}`);

  // Fund templates for different types
  const fundTemplates = [
    {
      name: 'Strategic Development Fund',
      type: 'development',
      mandate: 'Invest in long-term economic development projects, infrastructure, and strategic industries to diversify the economy and create sustainable growth.',
      target_size: 500000000000,
      risk_tolerance: 'moderate',
      horizon: 'long_term'
    },
    {
      name: 'Resource Stabilization Fund',
      type: 'stabilization', 
      mandate: 'Stabilize government revenues during commodity price volatility and provide counter-cyclical fiscal support during economic downturns.',
      target_size: 200000000000,
      risk_tolerance: 'conservative',
      horizon: 'medium_term'
    },
    {
      name: 'Future Generations Fund',
      type: 'heritage',
      mandate: 'Preserve wealth for future generations by investing resource revenues in a diversified portfolio of global assets.',
      target_size: 1000000000000,
      risk_tolerance: 'balanced',
      horizon: 'perpetual'
    }
  ];

  // Insert funds for existing civilizations
  for (let i = 0; i < Math.min(existingCivs.length, fundTemplates.length); i++) {
    const civId = existingCivs[i];
    const template = fundTemplates[i];
    
    // Insert main fund
    const fundResult = await client.query(`
      INSERT INTO sovereign_wealth_funds (
        civilization_id, fund_name, fund_type, establishment_date, legal_structure, 
        governance_model, mandate, target_size, current_aum, inception_value,
        performance_benchmark, risk_tolerance, investment_horizon, transparency_level
      ) VALUES (
        $1, $2, $3, '2020-01-01', 'government_entity', 'independent_board',
        $4, $5, $6, $6, 'global_equity_index', $7, $8, 'medium'
      ) RETURNING id
      ON CONFLICT (civilization_id, fund_name) DO NOTHING
    `, [
      civId, template.name, template.type, template.mandate, template.target_size,
      template.target_size * 0.3, template.risk_tolerance, template.horizon
    ]);

    if (fundResult.rows.length === 0) continue; // Skip if conflict
    const fundId = fundResult.rows[0].id;

    // Insert financing sources
    const financingSources = [
      { type: 'resource_extraction', name: 'Mining Revenue Share', amount: 50000000000, frequency: 'quarterly', percentage: 25.0 },
      { type: 'budget_surplus', name: 'Annual Budget Surplus', amount: 30000000000, frequency: 'annual', percentage: 50.0 },
      { type: 'central_bank_transfer', name: 'Central Bank Reserves', amount: 75000000000, frequency: 'one_time', percentage: null }
    ];

    for (const source of financingSources) {
      await client.query(`
        INSERT INTO swf_financing_sources (
          fund_id, source_type, source_name, contribution_amount, contribution_date,
          contribution_frequency, automatic_transfer, transfer_percentage
        ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, true, $6)
      `, [fundId, source.type, source.name, source.amount, source.frequency, source.percentage]);
    }

    // Insert investment strategies
    const strategies = [
      { name: 'Global Equities', asset_class: 'equities', target: 40.0, expected_return: 7.5, risk: 'medium' },
      { name: 'Fixed Income', asset_class: 'fixed_income', target: 30.0, expected_return: 4.0, risk: 'low' },
      { name: 'Infrastructure', asset_class: 'infrastructure', target: 20.0, expected_return: 6.5, risk: 'medium' },
      { name: 'Cash & Equivalents', asset_class: 'cash', target: 10.0, expected_return: 2.0, risk: 'very_low' }
    ];

    for (const strategy of strategies) {
      await client.query(`
        INSERT INTO swf_investment_strategies (
          fund_id, strategy_name, asset_class, geographic_focus, target_allocation_percent,
          current_allocation_percent, investment_approach, expected_return, risk_level,
          liquidity_requirement, esg_criteria
        ) VALUES ($1, $2, $3, 'global', $4, $4, 'active', $5, $6, 'medium_term', true)
      `, [fundId, strategy.name, strategy.asset_class, strategy.target, strategy.expected_return, strategy.risk]);
    }

    // Insert initial performance record
    await client.query(`
      INSERT INTO swf_performance (
        fund_id, reporting_date, total_assets, net_asset_value, period_return,
        annualized_return, benchmark_return, excess_return, volatility, sharpe_ratio,
        total_contributions, asset_allocation
      ) VALUES (
        $1, CURRENT_DATE, $2, $2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, $2,
        '{"equities": 40.0, "fixed_income": 30.0, "infrastructure": 20.0, "cash": 10.0}'
      )
    `, [fundId, template.target_size * 0.3]);

    // Insert currency access for this fund
    const currencyCodes = ['TER', 'ALC', 'VEG'];
    const currencyNames = ['Terran Credit', 'Alpha Centauri Dollar', 'Vega Prime Yuan'];
    
    for (let j = 0; j < Math.min(existingCivs.length, currencyCodes.length); j++) {
      const isOwnCurrency = j === i;
      const amount = isOwnCurrency ? template.target_size * 0.5 : template.target_size * 0.1;
      
      await client.query(`
        INSERT INTO swf_currency_access (
          fund_id, currency_code, currency_name, issuing_civilization_id,
          available_amount, exchange_rate_to_base, access_method, maximum_exposure
        ) VALUES ($1, $2, $3, $4, $5, 1.0, $6, $7)
        ON CONFLICT (fund_id, currency_code) DO NOTHING
      `, [
        fundId, currencyCodes[j], currencyNames[j], existingCivs[j],
        amount, isOwnCurrency ? 'direct_holding' : 'central_bank_swap',
        template.target_size * (isOwnCurrency ? 0.8 : 0.2)
      ]);
    }
  }

  // Insert sample investment universe for all civilizations
  const investmentOpportunities = [
    // Government Bonds
    { type: 'government_bond', name: 'Treasury Bond 10Y', symbol: 'GOVT10Y', price: 1000, coupon: 3.5, rating: 'AAA' },
    { type: 'government_bond', name: 'Infrastructure Bond 5Y', symbol: 'INFRA5Y', price: 1000, coupon: 4.2, rating: 'AA+' },
    
    // Corporate Bonds
    { type: 'corporate_bond', name: 'Galactic Industries Bond', symbol: 'GALIN7Y', price: 1000, coupon: 5.1, rating: 'A' },
    { type: 'corporate_bond', name: 'Space Mining Corp Bond', symbol: 'SPMIN5Y', price: 1000, coupon: 6.8, rating: 'BBB+' },
    
    // Equities
    { type: 'equity', name: 'Galactic Shipping Ltd', symbol: 'GSHIP', price: 125.50, dividend: 2.8, sector: 'Transportation' },
    { type: 'equity', name: 'Quantum Computing Corp', symbol: 'QCOMP', price: 89.25, dividend: 1.2, sector: 'Technology' },
    { type: 'equity', name: 'Stellar Energy Inc', symbol: 'STLEN', price: 67.80, dividend: 4.1, sector: 'Energy' },
    
    // Index Funds
    { type: 'index_fund', name: 'Galactic Market Index Fund', symbol: 'GMIF', price: 250.00, expense: 0.15, composition: '{"large_cap": 70, "mid_cap": 20, "small_cap": 10}' },
    { type: 'index_fund', name: 'Sector Diversified Fund', symbol: 'SECDF', price: 180.75, expense: 0.25, composition: '{"tech": 25, "energy": 20, "finance": 15, "industrial": 15, "healthcare": 10, "other": 15}' }
  ];

  for (let i = 0; i < existingCivs.length; i++) {
    const civId = existingCivs[i];
    const currencyCode = ['TER', 'ALC', 'VEG'][i] || 'TER';
    
    for (const investment of investmentOpportunities) {
      await client.query(`
        INSERT INTO swf_investment_universe (
          issuing_civilization_id, asset_type, asset_name, asset_symbol, market_exchange,
          currency_code, current_price, dividend_yield, coupon_rate, credit_rating,
          sector, liquidity_rating, volatility_30d, volume_24h, minimum_investment,
          requires_currency, foreign_ownership_allowed, index_composition, expense_ratio
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 8, 0.15, 1000000, 1000, $6, true, $12, $13
        )
        ON CONFLICT (issuing_civilization_id, asset_symbol, market_exchange) DO NOTHING
      `, [
        civId, investment.type, investment.name, 
        investment.symbol + '_' + currencyCode, // Make symbols unique per civilization
        civId + '_Exchange',
        currencyCode, investment.price, investment.dividend || null, investment.coupon || null,
        investment.rating || null, investment.sector || null,
        investment.composition || null, investment.expense || null
      ]);
    }
  }

  console.log('✅ Sovereign Wealth Fund seed data inserted successfully');
}

// Export interfaces for TypeScript support
export interface SovereignWealthFund {
  id: number;
  civilization_id: string;
  fund_name: string;
  fund_type: 'stabilization' | 'development' | 'pension' | 'strategic' | 'heritage';
  establishment_date: Date;
  legal_structure: string;
  governance_model: string;
  mandate: string;
  target_size?: number;
  current_aum: number;
  inception_value: number;
  performance_benchmark: string;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | 'balanced';
  investment_horizon: 'short_term' | 'medium_term' | 'long_term' | 'perpetual';
  transparency_level: 'high' | 'medium' | 'low' | 'classified';
  status: 'active' | 'suspended' | 'liquidating' | 'closed';
}

export interface FinancingSource {
  id: number;
  fund_id: number;
  source_type: string;
  source_name: string;
  contribution_amount: number;
  contribution_date: Date;
  contribution_frequency: string;
  automatic_transfer: boolean;
  transfer_percentage?: number;
  minimum_transfer?: number;
  maximum_transfer?: number;
  conditions?: string;
  status: 'active' | 'suspended' | 'terminated';
}

export interface InvestmentStrategy {
  id: number;
  fund_id: number;
  strategy_name: string;
  asset_class: string;
  geographic_focus?: string;
  sector_focus?: string;
  target_allocation_percent: number;
  current_allocation_percent: number;
  minimum_allocation: number;
  maximum_allocation: number;
  investment_approach: string;
  expected_return?: number;
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  liquidity_requirement: 'immediate' | 'short_term' | 'medium_term' | 'long_term' | 'illiquid';
  esg_criteria: boolean;
  strategic_importance: boolean;
  rebalancing_frequency: string;
}
