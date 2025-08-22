/**
 * Government Bonds System Database Schema
 * Comprehensive bond issuance system supporting domestic and foreign currency bonds
 */

import { Pool } from 'pg';

export async function initializeGovernmentBondsSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Government Bond Issues - Main bond issuance records
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_bonds (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        bond_series VARCHAR(50) NOT NULL, -- 'Treasury-2025-A', 'Infrastructure-2025-B'
        bond_type VARCHAR(30) NOT NULL, -- 'treasury', 'infrastructure', 'war', 'development', 'green'
        issue_date DATE NOT NULL,
        maturity_date DATE NOT NULL,
        currency_code VARCHAR(10) NOT NULL, -- 'USD', 'EUR', 'GBP', etc.
        face_value DECIMAL(15,2) NOT NULL,
        coupon_rate DECIMAL(5,4) NOT NULL, -- Annual interest rate (e.g., 0.0350 = 3.5%)
        issue_price DECIMAL(15,2) NOT NULL, -- Price at issuance (may be below/above face value)
        total_issued BIGINT NOT NULL, -- Total number of bonds issued
        total_outstanding BIGINT NOT NULL, -- Current outstanding bonds
        callable BOOLEAN DEFAULT false, -- Can government call bonds early
        call_price DECIMAL(15,2), -- Price at which bonds can be called
        call_date DATE, -- Earliest call date
        credit_rating VARCHAR(10), -- 'AAA', 'AA+', 'BBB', etc.
        purpose TEXT, -- Description of what funds will be used for
        collateral_type VARCHAR(50), -- 'general_obligation', 'revenue', 'asset_backed'
        tax_treatment VARCHAR(30), -- 'taxable', 'tax_exempt', 'foreign_tax_credit'
        minimum_purchase DECIMAL(15,2) DEFAULT 1000.00,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Bond Holders - Track who owns bonds
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_holders (
        id SERIAL PRIMARY KEY,
        bond_id INTEGER NOT NULL REFERENCES government_bonds(id) ON DELETE CASCADE,
        holder_type VARCHAR(20) NOT NULL, -- 'government', 'bank', 'fund', 'individual', 'foreign_gov'
        holder_id TEXT, -- Reference to specific entity (civ_id, bank_id, etc.)
        holder_name VARCHAR(200) NOT NULL,
        quantity BIGINT NOT NULL,
        purchase_price DECIMAL(15,2) NOT NULL,
        purchase_date DATE NOT NULL,
        current_value DECIMAL(15,2) NOT NULL,
        accrued_interest DECIMAL(15,2) DEFAULT 0.00,
        last_interest_payment DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Bond Market Prices - Track secondary market trading
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_market_prices (
        id SERIAL PRIMARY KEY,
        bond_id INTEGER NOT NULL REFERENCES government_bonds(id) ON DELETE CASCADE,
        price_date DATE NOT NULL,
        bid_price DECIMAL(15,2) NOT NULL, -- Highest price buyers willing to pay
        ask_price DECIMAL(15,2) NOT NULL, -- Lowest price sellers willing to accept
        last_trade_price DECIMAL(15,2), -- Most recent transaction price
        volume_traded BIGINT DEFAULT 0, -- Number of bonds traded this day
        yield_to_maturity DECIMAL(7,4), -- Current yield based on market price
        credit_spread DECIMAL(7,4), -- Spread over risk-free rate
        duration DECIMAL(8,4), -- Price sensitivity to interest rate changes
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Interest Payments - Track coupon payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_interest_payments (
        id SERIAL PRIMARY KEY,
        bond_id INTEGER NOT NULL REFERENCES government_bonds(id) ON DELETE CASCADE,
        payment_date DATE NOT NULL,
        coupon_rate DECIMAL(5,4) NOT NULL,
        payment_per_bond DECIMAL(15,2) NOT NULL,
        total_payment DECIMAL(15,2) NOT NULL, -- Total paid across all outstanding bonds
        bonds_outstanding BIGINT NOT NULL, -- Bonds outstanding at payment date
        payment_status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'paid', 'defaulted', 'deferred'
        currency_code VARCHAR(10) NOT NULL,
        exchange_rate DECIMAL(10,6), -- If paid in foreign currency
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      )
    `);

    // Bond Auctions - Primary market issuance process
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_auctions (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        auction_type VARCHAR(20) NOT NULL, -- 'competitive', 'non_competitive', 'dutch'
        bond_series VARCHAR(50) NOT NULL,
        auction_date DATE NOT NULL,
        settlement_date DATE NOT NULL,
        bonds_offered BIGINT NOT NULL,
        minimum_bid_price DECIMAL(15,2),
        maximum_bid_price DECIMAL(15,2),
        bonds_sold BIGINT DEFAULT 0,
        average_price DECIMAL(15,2),
        highest_accepted_yield DECIMAL(7,4),
        lowest_accepted_yield DECIMAL(7,4),
        bid_to_cover_ratio DECIMAL(6,3), -- Total bids / bonds offered
        auction_status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'open', 'closed', 'settled'
        total_proceeds DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Auction Bids - Individual bids in auctions
    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_bids (
        id SERIAL PRIMARY KEY,
        auction_id INTEGER NOT NULL REFERENCES bond_auctions(id) ON DELETE CASCADE,
        bidder_type VARCHAR(20) NOT NULL, -- 'bank', 'fund', 'dealer', 'foreign_gov'
        bidder_id TEXT,
        bidder_name VARCHAR(200) NOT NULL,
        bid_type VARCHAR(20) NOT NULL, -- 'competitive', 'non_competitive'
        quantity_bid BIGINT NOT NULL,
        bid_price DECIMAL(15,2), -- NULL for non-competitive bids
        bid_yield DECIMAL(7,4), -- Alternative to price
        quantity_allocated BIGINT DEFAULT 0,
        allocation_price DECIMAL(15,2),
        bid_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'partial'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Debt Service Schedule - Track upcoming payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS debt_service_schedule (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        payment_date DATE NOT NULL,
        payment_type VARCHAR(20) NOT NULL, -- 'interest', 'principal', 'both'
        bond_series VARCHAR(50),
        currency_code VARCHAR(10) NOT NULL,
        scheduled_amount DECIMAL(15,2) NOT NULL,
        actual_amount DECIMAL(15,2),
        payment_status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'paid', 'overdue', 'defaulted'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      )
    `);

    // Credit Rating History - Track sovereign credit ratings
    await client.query(`
      CREATE TABLE IF NOT EXISTS credit_ratings (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        rating_agency VARCHAR(50) NOT NULL, -- 'Galactic_Rating_Agency', 'Stellar_Credit', etc.
        rating VARCHAR(10) NOT NULL, -- 'AAA', 'AA+', 'BBB-', etc.
        outlook VARCHAR(20), -- 'stable', 'positive', 'negative', 'developing'
        rating_date DATE NOT NULL,
        previous_rating VARCHAR(10),
        rating_rationale TEXT,
        factors_positive TEXT[],
        factors_negative TEXT[],
        is_current BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bond Covenants - Terms and conditions
    await client.query(`
      CREATE TABLE IF NOT EXISTS bond_covenants (
        id SERIAL PRIMARY KEY,
        bond_id INTEGER NOT NULL REFERENCES government_bonds(id) ON DELETE CASCADE,
        covenant_type VARCHAR(30) NOT NULL, -- 'debt_to_gdp', 'deficit_limit', 'asset_maintenance'
        description TEXT NOT NULL,
        threshold_value DECIMAL(15,2),
        current_value DECIMAL(15,2),
        compliance_status VARCHAR(20) DEFAULT 'compliant', -- 'compliant', 'warning', 'breach'
        last_checked DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Government Bonds Knobs - AI control settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_bonds_knobs (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id) UNIQUE,
        knob_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_bonds_civ 
      ON government_bonds(civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_bonds_active 
      ON government_bonds(civilization_id, is_active, maturity_date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_bonds_currency 
      ON government_bonds(currency_code, is_active);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bond_holders_bond 
      ON bond_holders(bond_id, is_active);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bond_holders_holder 
      ON bond_holders(holder_type, holder_id, is_active);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bond_market_prices_bond_date 
      ON bond_market_prices(bond_id, price_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bond_interest_payments_bond 
      ON bond_interest_payments(bond_id, payment_date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bond_auctions_civ_date 
      ON bond_auctions(civilization_id, auction_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_auction_bids_auction 
      ON auction_bids(auction_id, bid_status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_debt_service_civ_date 
      ON debt_service_schedule(civilization_id, payment_date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_credit_ratings_civ_current 
      ON credit_ratings(civilization_id, is_current, rating_date DESC);
    `);

    await client.query('COMMIT');
    console.log('✅ Government Bonds schema initialized successfully');

    // Insert seed data
    await insertGovernmentBondsSeedData(pool);

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert seed data for Government Bonds system
 */
async function insertGovernmentBondsSeedData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get civilizations for seed data
    const civResult = await client.query('SELECT id FROM civilizations LIMIT 5');
    
    for (const civ of civResult.rows) {
      const civId = civ.id;

      // Create sample government bonds for each civilization
      const bondTypes = [
        {
          series: 'TREASURY-2025-A',
          type: 'treasury',
          currency: 'USC', // Universal Standard Credits
          faceValue: 1000.00,
          couponRate: 0.0350,
          maturityYears: 10,
          purpose: 'General government operations and debt refinancing'
        },
        {
          series: 'INFRA-2025-B',
          type: 'infrastructure',
          currency: 'USC',
          faceValue: 5000.00,
          couponRate: 0.0425,
          maturityYears: 20,
          purpose: 'Interplanetary transportation infrastructure development'
        },
        {
          series: 'GREEN-2025-C',
          type: 'green',
          currency: 'USC',
          faceValue: 1000.00,
          couponRate: 0.0300,
          maturityYears: 15,
          purpose: 'Renewable energy and environmental protection projects'
        }
      ];

      for (const bond of bondTypes) {
        const issueDate = new Date();
        const maturityDate = new Date();
        maturityDate.setFullYear(issueDate.getFullYear() + bond.maturityYears);

        const bondResult = await client.query(`
          INSERT INTO government_bonds (
            civilization_id, bond_series, bond_type, issue_date, maturity_date,
            currency_code, face_value, coupon_rate, issue_price, total_issued,
            total_outstanding, credit_rating, purpose, collateral_type, tax_treatment
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id
        `, [
          civId,
          bond.series,
          bond.type,
          issueDate,
          maturityDate,
          bond.currency,
          bond.faceValue,
          bond.couponRate,
          bond.faceValue * 0.98, // Slight discount to face value
          1000000, // 1 million bonds issued
          950000,  // 950k outstanding
          'AA+',
          bond.purpose,
          'general_obligation',
          'taxable'
        ]);

        const bondId = bondResult.rows[0].id;

        // Create sample bond holders
        const holders = [
          {
            type: 'bank',
            name: 'Central Galactic Bank',
            quantity: 300000,
            percentage: 0.30
          },
          {
            type: 'fund',
            name: 'Stellar Pension Fund',
            quantity: 200000,
            percentage: 0.20
          },
          {
            type: 'foreign_gov',
            name: 'Allied Civilization Treasury',
            quantity: 150000,
            percentage: 0.15
          },
          {
            type: 'individual',
            name: 'Retail Investors',
            quantity: 300000,
            percentage: 0.30
          }
        ];

        for (const holder of holders) {
          await client.query(`
            INSERT INTO bond_holders (
              bond_id, holder_type, holder_name, quantity, purchase_price,
              purchase_date, current_value
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            bondId,
            holder.type,
            holder.name,
            holder.quantity,
            bond.faceValue * 0.98,
            issueDate,
            holder.quantity * bond.faceValue * 1.02 // Slight appreciation
          ]);
        }

        // Create recent market prices
        for (let i = 0; i < 30; i++) {
          const priceDate = new Date();
          priceDate.setDate(priceDate.getDate() - i);
          
          const basePrice = bond.faceValue * (0.95 + Math.random() * 0.10);
          
          await client.query(`
            INSERT INTO bond_market_prices (
              bond_id, price_date, bid_price, ask_price, last_trade_price,
              volume_traded, yield_to_maturity, credit_spread, duration
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
            bondId,
            priceDate,
            basePrice * 0.999,
            basePrice * 1.001,
            basePrice,
            Math.floor(Math.random() * 50000) + 10000,
            bond.couponRate + (Math.random() * 0.01 - 0.005),
            Math.random() * 0.002,
            bond.maturityYears * 0.8
          ]);
        }

        // Create upcoming interest payments
        for (let year = 0; year < bond.maturityYears; year++) {
          const paymentDate = new Date(issueDate);
          paymentDate.setFullYear(paymentDate.getFullYear() + year + 1);
          
          await client.query(`
            INSERT INTO bond_interest_payments (
              bond_id, payment_date, coupon_rate, payment_per_bond, total_payment,
              bonds_outstanding, currency_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            bondId,
            paymentDate,
            bond.couponRate,
            bond.faceValue * bond.couponRate,
            950000 * bond.faceValue * bond.couponRate,
            950000,
            bond.currency
          ]);
        }
      }

      // Create credit rating
      await client.query(`
        INSERT INTO credit_ratings (
          civilization_id, rating_agency, rating, outlook, rating_date,
          rating_rationale, factors_positive, factors_negative
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        civId,
        'Galactic Rating Agency',
        'AA+',
        'stable',
        new Date(),
        'Strong fiscal position with diversified economy and stable political system',
        ['Robust GDP growth', 'Low debt-to-GDP ratio', 'Strong institutions'],
        ['Regional tensions', 'Commodity price volatility']
      ]);

      // Create debt service schedule for next 12 months
      for (let month = 1; month <= 12; month++) {
        const paymentDate = new Date();
        paymentDate.setMonth(paymentDate.getMonth() + month);
        
        await client.query(`
          INSERT INTO debt_service_schedule (
            civilization_id, payment_date, payment_type, currency_code, scheduled_amount
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          civId,
          paymentDate,
          month % 6 === 0 ? 'both' : 'interest',
          'USC',
          month % 6 === 0 ? 45000000 : 35000000 // Higher for principal+interest
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('💰 Government Bonds seed data inserted successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Government Bonds seed data insertion failed:', error);
  } finally {
    client.release();
  }
}
