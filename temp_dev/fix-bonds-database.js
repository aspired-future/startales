/**
 * Quick fix for Government Bonds database tables
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://gtw:gtw@localhost:5432/gtw'
});

console.log('🔧 Fixing Government Bonds database tables...');

async function fixBondsDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('📊 Creating government_bonds table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_bonds (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL,
        bond_series VARCHAR(50) NOT NULL,
        bond_type VARCHAR(30) NOT NULL,
        issue_date DATE NOT NULL,
        maturity_date DATE NOT NULL,
        currency_code VARCHAR(10) NOT NULL,
        face_value DECIMAL(15,2) NOT NULL,
        coupon_rate DECIMAL(5,4) NOT NULL,
        issue_price DECIMAL(15,2) NOT NULL,
        total_issued BIGINT NOT NULL,
        total_outstanding BIGINT NOT NULL,
        callable BOOLEAN DEFAULT false,
        call_price DECIMAL(15,2),
        call_date DATE,
        credit_rating VARCHAR(10),
        purpose TEXT,
        collateral_type VARCHAR(50),
        tax_treatment VARCHAR(30),
        minimum_purchase DECIMAL(15,2) DEFAULT 1000.00,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    console.log('🔧 Creating government_bonds_knobs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_bonds_knobs (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL UNIQUE,
        knob_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📋 Inserting sample bond data...');
    const bondResult = await client.query(`
      INSERT INTO government_bonds (
        civilization_id, bond_series, bond_type, issue_date, maturity_date,
        currency_code, face_value, coupon_rate, issue_price, total_issued,
        total_outstanding, credit_rating, purpose, collateral_type, tax_treatment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      '1', // civilization_id
      'TREASURY-2025-A',
      'treasury',
      new Date(),
      new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years from now
      'USC',
      1000.00,
      0.0350,
      980.00,
      1000000,
      950000,
      'AA+',
      'General government operations and debt refinancing',
      'general_obligation',
      'taxable'
    ]);

    console.log('🎛️ Inserting default knob settings...');
    await client.query(`
      INSERT INTO government_bonds_knobs (civilization_id, knob_settings)
      VALUES ($1, $2)
      ON CONFLICT (civilization_id) 
      DO UPDATE SET knob_settings = $2, updated_at = CURRENT_TIMESTAMP
    `, ['1', JSON.stringify({
      bondIssuanceFrequency: { value: 50, min: 0, max: 100, description: "How frequently to issue new bonds" },
      maturityMix: { value: 50, min: 0, max: 100, description: "Balance between short-term vs long-term bonds" },
      currencyDiversification: { value: 30, min: 0, max: 100, description: "Percentage of bonds issued in foreign currencies" },
      callableFeatures: { value: 25, min: 0, max: 100, description: "Percentage of bonds with callable features" },
      greenBondRatio: { value: 15, min: 0, max: 100, description: "Percentage of green/ESG bonds in portfolio" },
      couponRateStrategy: { value: 50, min: 0, max: 100, description: "Aggressiveness of coupon rate setting" },
      auctionPricingModel: { value: 60, min: 0, max: 100, description: "Competitive vs non-competitive auction balance" },
      creditRatingTarget: { value: 75, min: 0, max: 100, description: "Target credit rating maintenance level" },
      yieldCurveOptimization: { value: 55, min: 0, max: 100, description: "Optimize for yield curve positioning" },
      marketTimingStrategy: { value: 40, min: 0, max: 100, description: "Market timing aggressiveness for issuance" },
      debtToGdpTarget: { value: 60, min: 0, max: 100, description: "Maximum acceptable debt-to-GDP ratio" },
      foreignCurrencyRisk: { value: 35, min: 0, max: 100, description: "Tolerance for foreign exchange risk" },
      interestRateHedging: { value: 45, min: 0, max: 100, description: "Level of interest rate risk hedging" },
      refinancingRisk: { value: 50, min: 0, max: 100, description: "Management of refinancing risk concentration" },
      liquidityBuffer: { value: 40, min: 0, max: 100, description: "Maintain cash reserves for debt service" },
      secondaryMarketSupport: { value: 30, min: 0, max: 100, description: "Active support of secondary bond trading" },
      buybackPrograms: { value: 20, min: 0, max: 100, description: "Frequency of bond buyback operations" },
      marketMakerIncentives: { value: 35, min: 0, max: 100, description: "Incentives for primary dealers and market makers" },
      transparencyLevel: { value: 70, min: 0, max: 100, description: "Level of market communication and transparency" },
      innovationAdoption: { value: 45, min: 0, max: 100, description: "Adoption of new bond structures and technologies" }
    })]);

    await client.query('COMMIT');
    console.log('✅ Government Bonds database tables fixed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error fixing database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixBondsDatabase();
