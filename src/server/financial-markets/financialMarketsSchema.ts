import { Pool } from 'pg';

// Financial Markets System Types
export interface StockExchange {
  id: number;
  civilization_id: number;
  exchange_name: string;
  exchange_code: string;
  currency_code: string;
  market_cap: number;
  daily_volume: number;
  market_status: 'open' | 'closed' | 'pre_market' | 'after_hours';
  trading_hours: {
    open_time: string;
    close_time: string;
    timezone: string;
  };
  created_at: Date;
}

export interface ListedCompany {
  id: number;
  exchange_id: number;
  company_symbol: string;
  company_name: string;
  sector: string;
  subsector: string;
  market_cap: number;
  shares_outstanding: number;
  current_price: number;
  previous_close: number;
  daily_change_percent: number;
  pe_ratio?: number;
  dividend_yield?: number;
  beta: number;
  founded_year: number;
  headquarters_location: string;
  employee_count: number;
  annual_revenue: number;
  business_description: string;
  competitive_advantages: string[];
  recent_developments: string;
  created_at: Date;
}

export interface CorporateLeader {
  id: number;
  company_id: number;
  full_name: string;
  position: string;
  age: number;
  background: string;
  personality_traits: string[];
  leadership_style: string;
  education: string;
  career_highlights: string[];
  personal_interests: string[];
  communication_style: string;
  public_statements: string[];
  witter_handle?: string;
  contact_availability: 'high' | 'medium' | 'low';
  influence_level: number; // 1-10 scale
  created_at: Date;
}

export interface StockPriceHistory {
  id: number;
  company_id: number;
  trading_date: Date;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  adjusted_close?: number;
  created_at: Date;
}

export interface BondIssue {
  id: number;
  issuer_type: 'government' | 'corporate';
  issuer_id: number;
  bond_symbol: string;
  bond_name: string;
  currency_code: string;
  face_value: number;
  coupon_rate: number;
  maturity_date: Date;
  issue_date: Date;
  current_price: number;
  yield_to_maturity?: number;
  credit_rating?: string;
  total_issued: number;
  outstanding_amount: number;
  created_at: Date;
}

export interface BondPriceHistory {
  id: number;
  bond_id: number;
  trading_date: Date;
  price: number;
  yield: number;
  volume: number;
  bid_price?: number;
  ask_price?: number;
  spread?: number;
  created_at: Date;
}

export interface CreditRating {
  id: number;
  entity_type: 'government' | 'corporate';
  entity_id: number;
  rating_agency: string;
  rating: string;
  outlook: 'positive' | 'stable' | 'negative';
  rating_date: Date;
  previous_rating?: string;
  rating_rationale?: string;
  created_at: Date;
}

export interface MarketIndex {
  id: number;
  civilization_id: number;
  index_name: string;
  index_symbol: string;
  index_type: 'broad_market' | 'sector' | 'bond_index';
  base_value: number;
  current_value: number;
  daily_change_percent: number;
  market_cap_weighted: boolean;
  component_count: number;
  created_at: Date;
}

export interface MarketSentiment {
  id: number;
  civilization_id: number;
  sentiment_date: Date;
  overall_sentiment: number; // -1 to 1
  fear_greed_index: number; // 0 to 100
  volatility_index: number;
  economic_confidence: number;
  policy_uncertainty: number;
  geopolitical_risk: number;
  sentiment_drivers: {
    gdp_growth_impact: number;
    inflation_impact: number;
    interest_rate_impact: number;
    fiscal_policy_impact: number;
    political_stability_impact: number;
  };
  created_at: Date;
}

export interface MarketTransaction {
  id: number;
  civilization_id: number;
  transaction_type: 'stock_buy' | 'stock_sell' | 'bond_buy' | 'bond_sell';
  security_type: 'stock' | 'government_bond' | 'corporate_bond';
  security_id: number;
  quantity: number;
  price: number;
  total_value: number;
  currency_code: string;
  transaction_date: Date;
  counterparty_type?: string;
  commission: number;
  settlement_date?: Date;
}

export interface PortfolioHolding {
  id: number;
  civilization_id: number;
  portfolio_type: string;
  security_type: 'stock' | 'government_bond' | 'corporate_bond';
  security_id: number;
  quantity: number;
  average_cost: number;
  current_value: number;
  unrealized_gain_loss: number;
  currency_code: string;
  last_updated: Date;
}

export interface MarketEconomicFactors {
  id: number;
  civilization_id: number;
  factor_date: Date;
  gdp_growth_rate: number;
  inflation_rate: number;
  interest_rate: number;
  unemployment_rate: number;
  fiscal_balance_gdp: number;
  debt_to_gdp: number;
  currency_strength_index: number;
  trade_balance: number;
  created_at: Date;
}

// Initialize Financial Markets Schema
export async function initializeFinancialMarketsSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create stock_exchanges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_exchanges (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        exchange_name VARCHAR(100) NOT NULL,
        exchange_code VARCHAR(10) NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        market_cap DECIMAL(20,2) DEFAULT 0,
        daily_volume DECIMAL(20,2) DEFAULT 0,
        market_status VARCHAR(20) DEFAULT 'open' CHECK (market_status IN ('open', 'closed', 'pre_market', 'after_hours')),
        trading_hours JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, exchange_code)
      )
    `);

    // Create listed_companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS listed_companies (
        id SERIAL PRIMARY KEY,
        exchange_id INTEGER REFERENCES stock_exchanges(id),
        company_symbol VARCHAR(10) NOT NULL,
        company_name VARCHAR(200) NOT NULL,
        sector VARCHAR(50) NOT NULL,
        subsector VARCHAR(50) NOT NULL,
        market_cap DECIMAL(20,2) DEFAULT 0,
        shares_outstanding BIGINT DEFAULT 0,
        current_price DECIMAL(12,4) DEFAULT 0,
        previous_close DECIMAL(12,4) DEFAULT 0,
        daily_change_percent DECIMAL(8,4) DEFAULT 0,
        pe_ratio DECIMAL(8,2),
        dividend_yield DECIMAL(6,4),
        beta DECIMAL(6,4) DEFAULT 1.0,
        founded_year INTEGER,
        headquarters_location VARCHAR(200),
        employee_count INTEGER DEFAULT 0,
        annual_revenue DECIMAL(20,2) DEFAULT 0,
        business_description TEXT,
        competitive_advantages JSONB,
        recent_developments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(exchange_id, company_symbol)
      )
    `);

    // Create corporate_leaders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_leaders (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES listed_companies(id),
        full_name VARCHAR(200) NOT NULL,
        position VARCHAR(100) NOT NULL,
        age INTEGER,
        background TEXT,
        personality_traits JSONB,
        leadership_style VARCHAR(100),
        education TEXT,
        career_highlights JSONB,
        personal_interests JSONB,
        communication_style VARCHAR(100),
        public_statements JSONB,
        witter_handle VARCHAR(50),
        contact_availability VARCHAR(20) DEFAULT 'medium' CHECK (contact_availability IN ('high', 'medium', 'low')),
        influence_level INTEGER DEFAULT 5 CHECK (influence_level >= 1 AND influence_level <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create stock_price_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_price_history (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES listed_companies(id),
        trading_date DATE NOT NULL,
        open_price DECIMAL(12,4) NOT NULL,
        high_price DECIMAL(12,4) NOT NULL,
        low_price DECIMAL(12,4) NOT NULL,
        close_price DECIMAL(12,4) NOT NULL,
        volume BIGINT DEFAULT 0,
        adjusted_close DECIMAL(12,4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(company_id, trading_date)
      )
    `);

    // Create bond_issues table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_issues (
        id SERIAL PRIMARY KEY,
        issuer_type VARCHAR(20) NOT NULL CHECK (issuer_type IN ('government', 'corporate')),
        issuer_id INTEGER NOT NULL,
        bond_symbol VARCHAR(20) NOT NULL,
        bond_name VARCHAR(200) NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        face_value DECIMAL(15,2) NOT NULL,
        coupon_rate DECIMAL(8,6) NOT NULL,
        maturity_date DATE NOT NULL,
        issue_date DATE NOT NULL,
        current_price DECIMAL(12,4) DEFAULT 100,
        yield_to_maturity DECIMAL(8,6),
        credit_rating VARCHAR(10),
        total_issued DECIMAL(20,2) NOT NULL,
        outstanding_amount DECIMAL(20,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(issuer_type, issuer_id, bond_symbol)
      )
    `);

    // Create bond_price_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_price_history (
        id SERIAL PRIMARY KEY,
        bond_id INTEGER REFERENCES bond_issues(id),
        trading_date DATE NOT NULL,
        price DECIMAL(12,4) NOT NULL,
        yield DECIMAL(8,6) NOT NULL,
        volume DECIMAL(15,2) DEFAULT 0,
        bid_price DECIMAL(12,4),
        ask_price DECIMAL(12,4),
        spread DECIMAL(8,4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(bond_id, trading_date)
      )
    `);

    // Create credit_ratings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS credit_ratings (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('government', 'corporate')),
        entity_id INTEGER NOT NULL,
        rating_agency VARCHAR(50) NOT NULL,
        rating VARCHAR(10) NOT NULL,
        outlook VARCHAR(20) DEFAULT 'stable' CHECK (outlook IN ('positive', 'stable', 'negative')),
        rating_date DATE NOT NULL,
        previous_rating VARCHAR(10),
        rating_rationale TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create market_indices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_indices (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        index_name VARCHAR(100) NOT NULL,
        index_symbol VARCHAR(20) NOT NULL,
        index_type VARCHAR(50) NOT NULL CHECK (index_type IN ('broad_market', 'sector', 'bond_index')),
        base_value DECIMAL(12,4) DEFAULT 1000,
        current_value DECIMAL(12,4) DEFAULT 1000,
        daily_change_percent DECIMAL(8,4) DEFAULT 0,
        market_cap_weighted BOOLEAN DEFAULT true,
        component_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, index_symbol)
      )
    `);

    // Create index_components table
    await client.query(`
      CREATE TABLE IF NOT EXISTS index_components (
        id SERIAL PRIMARY KEY,
        index_id INTEGER REFERENCES market_indices(id),
        component_type VARCHAR(20) NOT NULL CHECK (component_type IN ('stock', 'bond')),
        component_id INTEGER NOT NULL,
        weight DECIMAL(8,6) NOT NULL,
        shares_or_amount DECIMAL(20,2) NOT NULL,
        added_date DATE DEFAULT CURRENT_DATE,
        UNIQUE(index_id, component_type, component_id)
      )
    `);

    // Create market_sentiment table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_sentiment (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        sentiment_date DATE NOT NULL,
        overall_sentiment DECIMAL(4,2) NOT NULL CHECK (overall_sentiment >= -1 AND overall_sentiment <= 1),
        fear_greed_index DECIMAL(5,2) NOT NULL CHECK (fear_greed_index >= 0 AND fear_greed_index <= 100),
        volatility_index DECIMAL(8,4) NOT NULL,
        economic_confidence DECIMAL(4,2) NOT NULL,
        policy_uncertainty DECIMAL(4,2) NOT NULL,
        geopolitical_risk DECIMAL(4,2) NOT NULL,
        sentiment_drivers JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, sentiment_date)
      )
    `);

    // Create market_transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_transactions (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('stock_buy', 'stock_sell', 'bond_buy', 'bond_sell')),
        security_type VARCHAR(20) NOT NULL CHECK (security_type IN ('stock', 'government_bond', 'corporate_bond')),
        security_id INTEGER NOT NULL,
        quantity DECIMAL(20,2) NOT NULL,
        price DECIMAL(12,4) NOT NULL,
        total_value DECIMAL(20,2) NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        counterparty_type VARCHAR(50),
        commission DECIMAL(10,2) DEFAULT 0,
        settlement_date DATE
      )
    `);

    // Create portfolio_holdings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        portfolio_type VARCHAR(50) DEFAULT 'government_reserves',
        security_type VARCHAR(20) NOT NULL CHECK (security_type IN ('stock', 'government_bond', 'corporate_bond')),
        security_id INTEGER NOT NULL,
        quantity DECIMAL(20,2) NOT NULL,
        average_cost DECIMAL(12,4) NOT NULL,
        current_value DECIMAL(20,2) NOT NULL,
        unrealized_gain_loss DECIMAL(20,2) DEFAULT 0,
        currency_code VARCHAR(10) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, portfolio_type, security_type, security_id)
      )
    `);

    // Create market_economic_factors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_economic_factors (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        factor_date DATE NOT NULL,
        gdp_growth_rate DECIMAL(8,6) NOT NULL,
        inflation_rate DECIMAL(8,6) NOT NULL,
        interest_rate DECIMAL(8,6) NOT NULL,
        unemployment_rate DECIMAL(8,6) NOT NULL,
        fiscal_balance_gdp DECIMAL(8,6) NOT NULL,
        debt_to_gdp DECIMAL(8,6) NOT NULL,
        currency_strength_index DECIMAL(8,4) NOT NULL,
        trade_balance DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, factor_date)
      )
    `);

    // Create market_policy_impact table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_policy_impact (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        policy_type VARCHAR(50) NOT NULL,
        policy_description TEXT NOT NULL,
        announcement_date TIMESTAMP NOT NULL,
        market_reaction_stocks DECIMAL(8,4),
        market_reaction_bonds DECIMAL(8,4),
        market_reaction_currency DECIMAL(8,4),
        sentiment_impact DECIMAL(4,2),
        volatility_impact DECIMAL(8,4),
        sector_impacts JSONB,
        duration_days INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_stock_exchanges_civ ON stock_exchanges(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_listed_companies_exchange ON listed_companies(exchange_id);
      CREATE INDEX IF NOT EXISTS idx_listed_companies_symbol ON listed_companies(company_symbol);
      CREATE INDEX IF NOT EXISTS idx_listed_companies_sector ON listed_companies(sector);
      CREATE INDEX IF NOT EXISTS idx_corporate_leaders_company ON corporate_leaders(company_id);
      CREATE INDEX IF NOT EXISTS idx_corporate_leaders_position ON corporate_leaders(position);
      CREATE INDEX IF NOT EXISTS idx_stock_price_history_company ON stock_price_history(company_id);
      CREATE INDEX IF NOT EXISTS idx_stock_price_history_date ON stock_price_history(trading_date);
      
      CREATE INDEX IF NOT EXISTS idx_bond_issues_issuer ON bond_issues(issuer_type, issuer_id);
      CREATE INDEX IF NOT EXISTS idx_bond_issues_symbol ON bond_issues(bond_symbol);
      CREATE INDEX IF NOT EXISTS idx_bond_price_history_bond ON bond_price_history(bond_id);
      CREATE INDEX IF NOT EXISTS idx_bond_price_history_date ON bond_price_history(trading_date);
      
      CREATE INDEX IF NOT EXISTS idx_credit_ratings_entity ON credit_ratings(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_market_indices_civ ON market_indices(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_market_sentiment_civ ON market_sentiment(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_market_sentiment_date ON market_sentiment(sentiment_date);
      
      CREATE INDEX IF NOT EXISTS idx_market_transactions_civ ON market_transactions(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_market_transactions_date ON market_transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_civ ON portfolio_holdings(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_market_economic_factors_civ ON market_economic_factors(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_market_economic_factors_date ON market_economic_factors(factor_date);
    `);

    // Insert seed data for demonstration
    await insertFinancialMarketsSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Financial Markets System schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Financial Markets System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertCompaniesData(client: any): Promise<void> {
  // Insert companies with detailed information
  await client.query(`
    INSERT INTO listed_companies (
      exchange_id, company_symbol, company_name, sector, subsector, market_cap, shares_outstanding, 
      current_price, previous_close, daily_change_percent, pe_ratio, dividend_yield, beta,
      founded_year, headquarters_location, employee_count, annual_revenue, business_description,
      competitive_advantages, recent_developments
    ) VALUES 
    -- Technology Sector
    (1, 'QCOM', 'QuantumCore Technologies', 'Technology', 'Quantum Computing', 850000000000, 3200000000, 265.63, 258.40, 2.80, 35.2, 0.008, 1.45,
     2387, 'Neo Silicon Valley, Terra Prime', 125000, 425000000000, 
     'Leading quantum computing and neural interface technology company developing next-generation quantum processors and brain-computer interfaces.',
     '["Proprietary quantum error correction", "Advanced neural interface patents", "Exclusive military contracts"]',
     'Recently announced breakthrough in room-temperature quantum computing and secured $50B government contract.'),
    
    (1, 'NGEN', 'NeuralGen Corporation', 'Technology', 'Artificial Intelligence', 720000000000, 2800000000, 257.14, 251.85, 2.10, 42.8, 0.005, 1.65,
     2391, 'New Tokyo District, Terra Prime', 98000, 385000000000,
     'Premier AI and machine learning company specializing in autonomous systems and predictive analytics.',
     '["Advanced AGI research", "Proprietary neural architectures", "Real-time learning algorithms"]',
     'Launched first commercially viable AGI assistant and established AI ethics board.'),
    
    (1, 'DIGI', 'DigitalVerse Platforms', 'Technology', 'Digital Products', 450000000000, 1800000000, 250.00, 245.30, 1.92, 32.5, 0.015, 1.35,
     2389, 'Digital Hub District, Terra Prime', 62000, 185000000000,
     'Leading digital products company creating immersive virtual worlds, digital assets, and blockchain-based entertainment platforms.',
     '["Proprietary metaverse engine", "Digital asset marketplace", "Cross-platform compatibility"]',
     'Launched revolutionary haptic feedback system and secured partnerships with major entertainment studios.'),
    
    (1, 'TLIC', 'TechLicense Global', 'Technology', 'Technology Licensing', 320000000000, 1200000000, 266.67, 261.45, 2.00, 28.8, 0.025, 1.20,
     2392, 'Innovation Park, Terra Prime', 35000, 145000000000,
     'Global technology licensing company managing patent portfolios and intellectual property for breakthrough innovations.',
     '["Extensive patent portfolio", "AI-powered IP analysis", "Global licensing network"]',
     'Completed largest tech licensing deal in history and expanded into quantum computing patents.'),
    
    (1, 'RDEV', 'Research & Development Nexus', 'Technology', 'R&D Ecosystems', 380000000000, 1500000000, 253.33, 248.90, 1.78, 45.2, 0.010, 1.55,
     2390, 'Science City, Terra Prime', 48000, 165000000000,
     'Advanced R&D ecosystem company providing collaborative research platforms, innovation labs, and technology incubation services.',
     '["Multi-disciplinary research facilities", "AI-assisted discovery platforms", "Global innovation network"]',
     'Opened new quantum research facility and announced breakthrough in materials science collaboration platform.'),
    
    -- Healthcare & Biotechnology
    (1, 'LIFE', 'LifeExtend Biotech', 'Healthcare', 'Biotechnology', 650000000000, 2100000000, 309.52, 302.15, 2.44, 28.9, 0.012, 1.25,
     2385, 'Geneva Medical District, Terra Prime', 75000, 295000000000,
     'Revolutionary biotechnology company focused on life extension, genetic therapy, and regenerative medicine.',
     '["Proprietary gene editing technology", "Anti-aging compound patents", "Regenerative organ printing"]',
     'FDA approved first commercial anti-aging treatment and opened new regenerative medicine facility.'),
    
    -- Energy Sector
    (1, 'FUSE', 'Fusion Dynamics Corp', 'Energy', 'Nuclear Fusion', 580000000000, 2400000000, 241.67, 236.80, 2.06, 19.8, 0.035, 1.15,
     2388, 'Energy Valley, Terra Prime', 45000, 275000000000,
     'Clean fusion energy company operating commercial fusion reactors for planetary and space-based power.',
     '["Commercial fusion reactors", "Helium-3 mining technology", "Compact reactor designs"]',
     'Completed construction of largest fusion plant and announced lunar Helium-3 mining operation.'),
    
    -- Transportation & Space
    (2, 'WARP', 'WarpDrive Logistics', 'Transportation', 'Space Transportation', 680000000000, 2600000000, 261.54, 255.20, 2.48, 24.8, 0.018, 1.55,
     2390, 'Centauri Spaceport, Alpha Centauri Prime', 72000, 315000000000,
     'Leading interstellar transportation company operating the largest fleet of warp-capable vessels.',
     '["Fastest warp drive technology", "Largest interstellar fleet", "Advanced navigation systems"]',
     'Achieved new speed record for commercial warp travel and opened direct route to Kepler system.'),
    
    -- Materials & Mining
    (2, 'MINE', 'AstroCorp Mining', 'Materials', 'Space Mining', 590000000000, 2300000000, 256.52, 251.85, 1.85, 18.9, 0.032, 1.75,
     2386, 'Asteroid Belt Station, Alpha Centauri', 55000, 285000000000,
     'Premier asteroid and planetary mining corporation extracting rare minerals and energy resources.',
     '["Automated mining fleets", "Rare element extraction", "Zero-G processing facilities"]',
     'Discovered largest platinum asteroid in known space and developed zero-impact mining techniques.'),
    
    -- Consumer & Retail
    (2, 'OMNI', 'OmniMart Galactic', 'Consumer Discretionary', 'Retail', 450000000000, 2100000000, 214.29, 209.75, 2.16, 21.5, 0.028, 0.95,
     2383, 'Commerce Central, Alpha Centauri Prime', 180000, 195000000000,
     'Largest interplanetary retail chain providing consumer goods and services across multiple star systems.',
     '["Interplanetary supply chain", "Instant delivery systems", "Cultural adaptation expertise"]',
     'Opened 500th location and launched same-day delivery service to remote colonies.'),
    
    -- Industrial & Manufacturing
    (3, 'ROBO', 'RoboTech Manufacturing', 'Industrials', 'Robotics', 720000000000, 2500000000, 288.00, 282.40, 1.98, 26.3, 0.022, 1.35,
     2389, 'Industrial Complex Alpha, Vega Prime', 95000, 340000000000,
     'Advanced robotics and automation company producing industrial robots and automated manufacturing systems.',
     '["Adaptive AI robotics", "Self-repairing systems", "Modular manufacturing"]',
     'Launched new generation of self-programming industrial robots and achieved full sector automation.'),
    
    -- Financial Services
    (1, 'GALBANK', 'Galactic Banking Corp', 'Financial Services', 'Banking', 520000000000, 2200000000, 236.36, 232.10, 1.84, 14.2, 0.048, 0.85,
     2375, 'Financial District, Terra Prime', 85000, 245000000000,
     'Premier interplanetary banking institution providing financial services across multiple star systems.',
     '["Quantum-encrypted transactions", "Multi-currency expertise", "Interplanetary banking network"]',
     'Launched quantum-secured cryptocurrency and expanded banking services to three new star systems.')
  ON CONFLICT (exchange_id, company_symbol) DO NOTHING`);

  // Insert corporate leaders with personalities and backstories
  await client.query(`
    INSERT INTO corporate_leaders (
      company_id, full_name, position, age, background, personality_traits, leadership_style,
      education, career_highlights, personal_interests, communication_style, public_statements,
      witter_handle, contact_availability, influence_level
    ) VALUES 
    -- QuantumCore Technologies Leaders
    (1, 'Dr. Elena Vasquez', 'Chief Executive Officer', 52, 
     'Former quantum physicist at CERN who pioneered commercial quantum computing applications. Led three successful tech startups before founding QuantumCore.',
     '["Visionary", "Analytical", "Risk-taking", "Inspiring"]', 'Transformational',
     'PhD in Quantum Physics from MIT, MBA from Stanford Graduate School of Business',
     '["First commercial quantum computer", "Quantum internet breakthrough", "Neural interface patents", "$100B company valuation"]',
     '["Quantum mechanics", "Classical music", "Mountain climbing", "Chess"]', 'Direct and technical',
     '["The future is quantum - everything else is just classical computing", "We are not just building computers, we are building the future of human consciousness"]',
     '@ElenaQ_CEO', 'high', 9),
    
    (1, 'Marcus Chen', 'Chief Technology Officer', 45,
     'Brilliant engineer who developed the first stable room-temperature quantum processor. Former lead researcher at Google Quantum AI.',
     '["Perfectionist", "Innovative", "Collaborative", "Detail-oriented"]', 'Technical Leadership',
     'PhD in Electrical Engineering from Caltech, MS in Computer Science from Carnegie Mellon',
     '["Room-temperature quantum breakthrough", "50+ quantum patents", "Quantum error correction algorithms"]',
     '["Robotics", "3D printing", "Sci-fi novels", "Cooking"]', 'Methodical and precise',
     '["Every quantum bit we stabilize brings us closer to solving humanitys greatest challenges"]',
     '@MarcusQuantum', 'medium', 8),
    
    -- NeuralGen Corporation Leaders  
    (2, 'Sarah Kim-Nakamura', 'Chief Executive Officer', 48,
     'AI ethics pioneer and former head of AI research at DeepMind. Advocate for responsible AI development and human-AI collaboration.',
     '["Ethical", "Strategic", "Empathetic", "Forward-thinking"]', 'Servant Leadership',
     'PhD in Cognitive Science from Oxford, MS in Computer Science from Stanford',
     '["First ethical AGI framework", "AI rights legislation", "Human-AI collaboration protocols"]',
     '["Philosophy", "Meditation", "Digital art", "Social justice"]', 'Thoughtful and inclusive',
     '["AI should amplify human potential, not replace human judgment", "The future belongs to those who can work with AI, not against it"]',
     '@SarahAI_Ethics', 'high', 9),
    
    -- LifeExtend Biotech Leaders
    (3, 'Dr. James Morrison', 'Chief Executive Officer', 58,
     'Renowned geneticist who developed the first successful anti-aging gene therapy. Former director of the National Institute on Aging.',
     '["Determined", "Compassionate", "Scientific", "Patient"]', 'Research-Driven',
     'MD/PhD from Harvard Medical School, Post-doc in Genetics at Cambridge',
     '["Anti-aging breakthrough", "Regenerative medicine patents", "Life extension clinical trials"]',
     '["Longevity research", "Sailing", "Wine collecting", "Medical history"]', 'Measured and authoritative',
     '["Death is not inevitable - it is a problem to be solved", "We are not just extending life, we are extending healthy, productive life"]',
     '@DrMorrison_Life', 'medium', 8),
    
    -- Fusion Dynamics Corp Leaders
    (4, 'Admiral Rebecca Torres', 'Chief Executive Officer', 55,
     'Former Space Force Admiral who oversaw the first military fusion reactor deployment. Expert in large-scale energy infrastructure.',
     '["Disciplined", "Strategic", "Results-oriented", "Decisive"]', 'Military Command',
     'BS in Nuclear Engineering from Naval Academy, MS in Energy Systems from MIT',
     '["First space-based fusion reactor", "Military energy independence", "Fusion safety protocols"]',
     '["Military history", "Strategy games", "Fitness", "Astronomy"]', 'Direct and commanding',
     '["Fusion energy is not just clean power - it is energy independence for all humanity"]',
     '@AdmiralTorres_Fusion', 'low', 7),
    
    -- WarpDrive Logistics Leaders
    (5, 'Captain Yuki Tanaka', 'Chief Executive Officer', 44,
     'Former interstellar cargo pilot who built the first commercial warp drive. Holds the record for fastest civilian warp journey.',
     '["Adventurous", "Pragmatic", "Charismatic", "Bold"]', 'Entrepreneurial',
     'BS in Aerospace Engineering from Tokyo Tech, Commercial Pilot License',
     '["First commercial warp drive", "Interstellar speed records", "Warp safety standards"]',
     '["Space exploration", "Extreme sports", "Vintage aircraft", "Cultural exchange"]', 'Energetic and inspiring',
     '["The galaxy is not vast - it is just waiting for the right transportation network"]',
     '@CaptainYuki_Warp', 'high', 8),
    
    -- DigitalVerse Platforms Leaders
    (6, 'Alex Rivera-Chen', 'Chief Executive Officer', 39,
     'Digital native and former lead architect of the first fully immersive metaverse. Pioneer in haptic feedback technology and virtual asset economics.',
     '["Creative", "Tech-savvy", "User-focused", "Innovative"]', 'Design Thinking',
     'MS in Computer Graphics from Carnegie Mellon, BS in Interactive Media from NYU',
     '["First immersive metaverse", "Haptic feedback breakthrough", "Digital asset marketplace", "Cross-platform standards"]',
     '["VR gaming", "Digital art", "Electronic music", "Virtual world design"]', 'Enthusiastic and visionary',
     '["The future is not just digital - it is experiential", "We are not building games, we are building new realities"]',
     '@AlexRivera_Digital', 'high', 8),
    
    -- TechLicense Global Leaders
    (7, 'Dr. Patricia Okafor', 'Chief Executive Officer', 51,
     'Former patent attorney and technology transfer expert who revolutionized intellectual property licensing. Built the largest tech patent portfolio in history.',
     '["Strategic", "Detail-oriented", "Negotiator", "Analytical"]', 'Collaborative',
     'JD from Harvard Law School, PhD in Electrical Engineering from Stanford',
     '["Largest patent portfolio", "AI-powered IP analysis", "Quantum computing licensing", "Global licensing standards"]',
     '["Patent law", "Technology history", "Chess", "International relations"]', 'Precise and diplomatic',
     '["Innovation without protection is just expensive research", "Patents are not barriers - they are bridges to collaboration"]',
     '@DrOkafor_Patents', 'medium', 9),
    
    -- Research & Development Nexus Leaders
    (8, 'Dr. Raj Patel', 'Chief Executive Officer', 46,
     'Former director of Bell Labs who created the first AI-assisted research platform. Expert in collaborative innovation and technology incubation.',
     '["Collaborative", "Systematic", "Curious", "Mentor"]', 'Research Leadership',
     'PhD in Materials Science from MIT, Post-doc in Innovation Studies from Cambridge',
     '["AI-assisted discovery platform", "Multi-disciplinary research facilities", "Innovation incubation", "Breakthrough materials"]',
     '["Scientific research", "Mentoring", "Classical Indian music", "Sustainable technology"]', 'Thoughtful and encouraging',
     '["The best discoveries happen at the intersection of disciplines", "We do not just fund research - we orchestrate innovation"]',
     '@DrPatel_RnD', 'high', 8)
  `);
}

async function insertFinancialMarketsSeedData(client: any): Promise<void> {
  // Insert stock exchanges for each civilization (with ON CONFLICT to prevent duplicates)
  await client.query(`
    INSERT INTO stock_exchanges (civilization_id, exchange_name, exchange_code, currency_code, market_cap, daily_volume, trading_hours) 
    VALUES 
    (1, 'Terran Stock Exchange', 'TSE', 'TER', 2500000000000, 45000000000, '{"open_time": "09:00", "close_time": "16:00", "timezone": "UTC"}'),
    (2, 'Alpha Centauri Exchange', 'ACE', 'ALC', 1800000000000, 32000000000, '{"open_time": "08:30", "close_time": "15:30", "timezone": "UTC"}'),
    (3, 'Vega Prime Markets', 'VPM', 'VEG', 2100000000000, 38000000000, '{"open_time": "09:30", "close_time": "16:30", "timezone": "UTC"}'),
    (4, 'Sirius Financial Center', 'SFC', 'SIR', 1950000000000, 35000000000, '{"open_time": "09:00", "close_time": "16:00", "timezone": "UTC"}'),
    (5, 'Proxima Exchange', 'PEX', 'PRX', 1650000000000, 28000000000, '{"open_time": "08:00", "close_time": "15:00", "timezone": "UTC"}')
    ON CONFLICT (civilization_id, exchange_code) DO NOTHING
  `);

  // Insert major companies with detailed information and realistic sectors
  await insertCompaniesData(client);

  // Insert government bonds for each civilization
  await client.query(`
    INSERT INTO bond_issues (issuer_type, issuer_id, bond_symbol, bond_name, currency_code, face_value, coupon_rate, maturity_date, issue_date, current_price, yield_to_maturity, credit_rating, total_issued, outstanding_amount) 
    VALUES 
    -- 10-year government bonds
    ('government', 1, 'TER10Y', 'Terran Republic 10-Year Bond', 'TER', 1000, 0.035, '2034-01-15', '2024-01-15', 98.50, 0.0375, 'AAA', 500000000000, 485000000000),
    ('government', 2, 'ALC10Y', 'Alpha Centauri 10-Year Bond', 'ALC', 1000, 0.042, '2034-02-01', '2024-02-01', 96.25, 0.0455, 'AA+', 350000000000, 340000000000),
    ('government', 3, 'VEG10Y', 'Vega Prime 10-Year Bond', 'VEG', 1000, 0.038, '2034-03-15', '2024-03-15', 97.80, 0.0405, 'AA', 400000000000, 385000000000),
    ('government', 4, 'SIR10Y', 'Sirius Federation 10-Year Bond', 'SIR', 1000, 0.040, '2034-04-01', '2024-04-01', 97.15, 0.0425, 'AA', 375000000000, 365000000000),
    ('government', 5, 'PRX10Y', 'Proxima Alliance 10-Year Bond', 'PRX', 1000, 0.045, '2034-05-01', '2024-05-01', 95.50, 0.0485, 'AA-', 300000000000, 290000000000),
    
    -- 5-year government bonds
    ('government', 1, 'TER5Y', 'Terran Republic 5-Year Bond', 'TER', 1000, 0.028, '2029-01-15', '2024-01-15', 99.20, 0.0295, 'AAA', 300000000000, 295000000000),
    ('government', 2, 'ALC5Y', 'Alpha Centauri 5-Year Bond', 'ALC', 1000, 0.035, '2029-02-01', '2024-02-01', 98.75, 0.0365, 'AA+', 250000000000, 245000000000),
    ('government', 3, 'VEG5Y', 'Vega Prime 5-Year Bond', 'VEG', 1000, 0.032, '2029-03-15', '2024-03-15', 98.90, 0.0335, 'AA', 275000000000, 270000000000),
    
    -- Corporate bonds
    ('corporate', 1, 'TTECH5Y', 'Terran Technologies 5-Year Bond', 'TER', 1000, 0.045, '2029-06-01', '2024-06-01', 97.50, 0.0485, 'A+', 25000000000, 24500000000),
    ('corporate', 4, 'TDEF7Y', 'Terran Defense 7-Year Bond', 'TER', 1000, 0.052, '2031-07-15', '2024-07-15', 96.80, 0.0565, 'A', 18000000000, 17800000000),
    ('corporate', 7, 'ACSP6Y', 'Alpha Spacelines 6-Year Bond', 'ALC', 1000, 0.055, '2030-08-01', '2024-08-01', 95.25, 0.0595, 'A-', 15000000000, 14800000000)
  ON CONFLICT (issuer_type, issuer_id, bond_symbol) DO NOTHING`);

  // Insert market indices
  await client.query(`
    INSERT INTO market_indices (civilization_id, index_name, index_symbol, index_type, base_value, current_value, daily_change_percent, market_cap_weighted, component_count) 
    VALUES 
    (1, 'Terran Composite Index', 'TCI', 'broad_market', 1000, 1245.67, 0.85, true, 50),
    (1, 'Terran Technology Index', 'TTI', 'sector', 1000, 1456.23, 1.25, true, 15),
    (1, 'Terran Bond Index', 'TBI', 'bond_index', 1000, 1032.45, -0.15, true, 25),
    (2, 'Alpha Centauri Index', 'ACI', 'broad_market', 1000, 1189.34, 0.45, true, 35),
    (3, 'Vega Prime Index', 'VPI', 'broad_market', 1000, 1298.78, 1.12, true, 40),
    (4, 'Sirius Market Index', 'SMI', 'broad_market', 1000, 1167.89, -0.25, true, 30),
    (5, 'Proxima Composite', 'PCI', 'broad_market', 1000, 1134.56, 0.78, true, 25)
  ON CONFLICT (civilization_id, index_symbol) DO NOTHING`);

  // Insert market sentiment data
  await client.query(`
    INSERT INTO market_sentiment (civilization_id, sentiment_date, overall_sentiment, fear_greed_index, volatility_index, economic_confidence, policy_uncertainty, geopolitical_risk, sentiment_drivers) 
    VALUES 
    (1, CURRENT_DATE, 0.25, 62.5, 18.5, 0.35, 0.15, 0.10, '{"gdp_growth_impact": 0.3, "inflation_impact": -0.1, "interest_rate_impact": -0.05, "fiscal_policy_impact": 0.15, "political_stability_impact": 0.05}'),
    (2, CURRENT_DATE, 0.15, 57.8, 22.3, 0.28, 0.22, 0.15, '{"gdp_growth_impact": 0.2, "inflation_impact": -0.15, "interest_rate_impact": -0.08, "fiscal_policy_impact": 0.12, "political_stability_impact": 0.06}'),
    (3, CURRENT_DATE, 0.35, 68.2, 16.8, 0.42, 0.12, 0.08, '{"gdp_growth_impact": 0.4, "inflation_impact": -0.05, "interest_rate_impact": -0.02, "fiscal_policy_impact": 0.18, "political_stability_impact": 0.08}'),
    (4, CURRENT_DATE, 0.05, 52.3, 25.1, 0.18, 0.28, 0.20, '{"gdp_growth_impact": 0.1, "inflation_impact": -0.2, "interest_rate_impact": -0.12, "fiscal_policy_impact": 0.08, "political_stability_impact": 0.02}'),
    (5, CURRENT_DATE, 0.20, 59.7, 20.5, 0.32, 0.18, 0.12, '{"gdp_growth_impact": 0.25, "inflation_impact": -0.12, "interest_rate_impact": -0.06, "fiscal_policy_impact": 0.14, "political_stability_impact": 0.04}')
  ON CONFLICT (civilization_id, sentiment_date) DO NOTHING`);

  // Insert economic factors
  await client.query(`
    INSERT INTO market_economic_factors (civilization_id, factor_date, gdp_growth_rate, inflation_rate, interest_rate, unemployment_rate, fiscal_balance_gdp, debt_to_gdp, currency_strength_index, trade_balance) 
    VALUES 
    (1, CURRENT_DATE, 0.032, 0.025, 0.035, 0.045, -0.025, 0.65, 105.2, 25000000000),
    (2, CURRENT_DATE, 0.028, 0.031, 0.042, 0.052, -0.035, 0.72, 98.7, -8000000000),
    (3, CURRENT_DATE, 0.038, 0.022, 0.038, 0.041, -0.018, 0.58, 108.5, 18000000000),
    (4, CURRENT_DATE, 0.025, 0.035, 0.045, 0.058, -0.042, 0.78, 95.3, -12000000000),
    (5, CURRENT_DATE, 0.030, 0.028, 0.040, 0.048, -0.028, 0.68, 102.1, 5000000000)
  `);

  // Insert sample portfolio holdings (government reserves)
  await client.query(`
    INSERT INTO portfolio_holdings (civilization_id, portfolio_type, security_type, security_id, quantity, average_cost, current_value, unrealized_gain_loss, currency_code) 
    VALUES 
    -- Terran government holdings
    (1, 'government_reserves', 'stock', 1, 50000000, 165.00, 9000000000, 750000000, 'TER'),
    (1, 'government_reserves', 'government_bond', 2, 15000000000, 100.00, 14437500000, -562500000, 'ALC'),
    (1, 'government_reserves', 'corporate_bond', 9, 2000000000, 100.00, 1950000000, -50000000, 'TER'),
    
    -- Alpha Centauri government holdings
    (2, 'government_reserves', 'stock', 6, 30000000, 145.00, 4500000000, 150000000, 'ALC'),
    (2, 'government_reserves', 'government_bond', 1, 8000000000, 100.00, 7880000000, -120000000, 'TER'),
    (2, 'government_reserves', 'government_bond', 3, 12000000000, 100.00, 11736000000, -264000000, 'VEG'),
    
    -- Vega Prime government holdings
    (3, 'government_reserves', 'stock', 10, 25000000, 190.00, 5113750000, 363750000, 'VEG'),
    (3, 'government_reserves', 'government_bond', 4, 10000000000, 100.00, 9715000000, -285000000, 'SIR'),
    (3, 'government_reserves', 'stock', 1, 20000000, 170.00, 3600000000, 200000000, 'TER')
  `);

  // Insert sample market transactions
  await client.query(`
    INSERT INTO market_transactions (civilization_id, transaction_type, security_type, security_id, quantity, price, total_value, currency_code, counterparty_type, commission) 
    VALUES 
    (1, 'stock_buy', 'stock', 1, 10000000, 175.50, 1755000000, 'TER', 'institutional', 875000),
    (1, 'bond_buy', 'government_bond', 2, 5000000000, 96.25, 4812500000, 'ALC', 'government', 2406250),
    (2, 'stock_sell', 'stock', 6, 5000000, 148.75, 743750000, 'ALC', 'retail', 371875),
    (3, 'bond_buy', 'corporate_bond', 9, 1000000000, 97.50, 975000000, 'TER', 'institutional', 487500),
    (4, 'stock_buy', 'stock', 14, 8000000, 161.76, 1294080000, 'SIR', 'institutional', 647040),
    (5, 'bond_sell', 'government_bond', 5, 2000000000, 95.50, 1910000000, 'PRX', 'government', 955000)
  `);

  console.log('✅ Financial Markets System seed data inserted successfully');
}
