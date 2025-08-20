import { Pool } from 'pg';

export async function initializeInflationSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    console.log('🏦 Initializing Inflation Tracking schema...');
    
    // Inflation metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inflation_metrics (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- CPI data (JSON)
        cpi_data JSONB NOT NULL DEFAULT '{}',
        
        -- PPI data (JSON)
        ppi_data JSONB NOT NULL DEFAULT '{}',
        
        -- Inflation expectations (JSON)
        expectations_data JSONB NOT NULL DEFAULT '{}',
        
        -- Monetary transmission data (JSON)
        transmission_data JSONB NOT NULL DEFAULT '{}',
        
        -- Sectoral inflation data (JSON)
        sectors_data JSONB NOT NULL DEFAULT '{}',
        
        -- Inflation drivers data (JSON)
        drivers_data JSONB NOT NULL DEFAULT '{}',
        
        -- Regional inflation data (JSON, optional)
        regional_data JSONB,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Inflation forecasts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inflation_forecasts (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        forecast_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Forecast periods (JSON)
        forecasts_data JSONB NOT NULL DEFAULT '{}',
        
        -- Confidence levels (JSON)
        confidence_data JSONB NOT NULL DEFAULT '{}',
        
        -- Scenarios (JSON)
        scenarios_data JSONB NOT NULL DEFAULT '{}',
        
        -- Risk factors (JSON)
        risks_data JSONB NOT NULL DEFAULT '{}',
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Price baskets table for CPI calculation
    await client.query(`
      CREATE TABLE IF NOT EXISTS price_baskets (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        
        -- Basket items (JSON array)
        items_data JSONB NOT NULL DEFAULT '[]',
        
        -- Basket metrics
        total_weight DECIMAL(5,2) NOT NULL DEFAULT 100.00,
        basket_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        base_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        index_value DECIMAL(10,2) NOT NULL DEFAULT 100.00,
        
        -- Basket metadata
        base_period DATE,
        is_active BOOLEAN DEFAULT true,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Resource prices table (enhanced for inflation tracking)
    await client.query(`
      CREATE TABLE IF NOT EXISTS resource_prices (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Consumer basket prices
        consumer_basket DECIMAL(10,2) DEFAULT 0.00,
        core_basket DECIMAL(10,2) DEFAULT 0.00,
        food_prices DECIMAL(10,2) DEFAULT 0.00,
        energy_prices DECIMAL(10,2) DEFAULT 0.00,
        housing_costs DECIMAL(10,2) DEFAULT 0.00,
        transport_costs DECIMAL(10,2) DEFAULT 0.00,
        healthcare_costs DECIMAL(10,2) DEFAULT 0.00,
        education_costs DECIMAL(10,2) DEFAULT 0.00,
        
        -- Producer prices
        producer_prices DECIMAL(10,2) DEFAULT 0.00,
        raw_materials DECIMAL(10,2) DEFAULT 0.00,
        intermediate_goods DECIMAL(10,2) DEFAULT 0.00,
        finished_goods DECIMAL(10,2) DEFAULT 0.00,
        service_costs DECIMAL(10,2) DEFAULT 0.00,
        
        -- Sectoral prices
        agriculture_prices DECIMAL(10,2) DEFAULT 0.00,
        manufacturing_prices DECIMAL(10,2) DEFAULT 0.00,
        service_prices DECIMAL(10,2) DEFAULT 0.00,
        tech_prices DECIMAL(10,2) DEFAULT 0.00,
        defense_costs DECIMAL(10,2) DEFAULT 0.00,
        infrastructure_costs DECIMAL(10,2) DEFAULT 0.00,
        
        -- Original resource prices (for backward compatibility)
        credits DECIMAL(10,2) DEFAULT 1.00,
        materials DECIMAL(10,2) DEFAULT 2.00,
        energy DECIMAL(10,2) DEFAULT 1.50,
        food DECIMAL(10,2) DEFAULT 1.20,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Monetary policy table (enhanced for inflation analysis)
    await client.query(`
      CREATE TABLE IF NOT EXISTS monetary_policy (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Policy rates
        base_rate DECIMAL(5,4) DEFAULT 0.0200, -- 2.00%
        discount_rate DECIMAL(5,4) DEFAULT 0.0250, -- 2.50%
        reserve_requirement DECIMAL(5,4) DEFAULT 0.1000, -- 10.00%
        
        -- Quantitative measures
        qe_scale DECIMAL(5,2) DEFAULT 0.00, -- -100 to +100
        money_supply_growth DECIMAL(5,2) DEFAULT 0.00,
        credit_growth DECIMAL(5,2) DEFAULT 0.00,
        
        -- Policy targets
        inflation_target DECIMAL(5,4) DEFAULT 0.0200, -- 2.00%
        employment_target DECIMAL(5,4),
        exchange_rate_target DECIMAL(10,4),
        
        -- Policy effectiveness
        credibility DECIMAL(3,2) DEFAULT 0.80, -- 0-1 scale
        transmission_effectiveness DECIMAL(3,2) DEFAULT 0.75,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Monetary policy history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS monetary_policy_history (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        policy_date TIMESTAMP WITH TIME ZONE NOT NULL,
        
        -- Policy change details
        change_type VARCHAR(50) NOT NULL, -- 'rate_change', 'qe_announcement', etc.
        old_value DECIMAL(10,4),
        new_value DECIMAL(10,4),
        change_magnitude DECIMAL(10,4),
        
        -- Policy rationale
        rationale TEXT,
        expected_impact JSONB,
        actual_impact JSONB,
        
        -- Market reaction
        immediate_market_reaction DECIMAL(5,2),
        currency_impact DECIMAL(5,2),
        bond_yield_impact DECIMAL(5,2),
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Economic indicators table
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_indicators (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        -- Core indicators
        gdp_growth DECIMAL(5,2) DEFAULT 0.00,
        unemployment_rate DECIMAL(5,2) DEFAULT 0.00,
        inflation_rate DECIMAL(5,2) DEFAULT 0.00,
        
        -- Advanced indicators
        core_inflation DECIMAL(5,2) DEFAULT 0.00,
        wage_growth DECIMAL(5,2) DEFAULT 0.00,
        productivity_growth DECIMAL(5,2) DEFAULT 0.00,
        
        -- Financial indicators
        interest_rate_spread DECIMAL(5,2) DEFAULT 0.00,
        credit_spread DECIMAL(5,2) DEFAULT 0.00,
        currency_strength DECIMAL(5,2) DEFAULT 0.00,
        
        -- Expectations
        inflation_expectations_1y DECIMAL(5,2) DEFAULT 0.00,
        inflation_expectations_5y DECIMAL(5,2) DEFAULT 0.00,
        consumer_confidence DECIMAL(5,2) DEFAULT 0.00,
        business_confidence DECIMAL(5,2) DEFAULT 0.00,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_inflation_metrics_civ_time 
      ON inflation_metrics(civilization_id, timestamp DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_inflation_forecasts_civ_date 
      ON inflation_forecasts(civilization_id, forecast_date DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resource_prices_civ_time 
      ON resource_prices(civilization_id, timestamp DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_monetary_policy_civ_time 
      ON monetary_policy(civilization_id, timestamp DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_economic_indicators_civ_time 
      ON economic_indicators(civilization_id, timestamp DESC)
    `);
    
    // Create default price baskets
    await client.query(`
      INSERT INTO price_baskets (id, name, description, items_data, base_period)
      VALUES 
        ('cpi_basket', 'Consumer Price Index Basket', 'Standard CPI basket for inflation measurement', 
         '[
           {"category": "Food", "item": "Basic Food Basket", "weight": 15.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Housing", "item": "Housing Costs", "weight": 30.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Transportation", "item": "Transport Costs", "weight": 15.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Healthcare", "item": "Medical Services", "weight": 10.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Education", "item": "Education Services", "weight": 8.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Recreation", "item": "Entertainment", "weight": 7.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Clothing", "item": "Apparel", "weight": 5.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Other", "item": "Miscellaneous", "weight": 10.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0}
         ]', 
         CURRENT_DATE),
        ('core_cpi_basket', 'Core CPI Basket', 'CPI excluding food and energy for core inflation', 
         '[
           {"category": "Housing", "item": "Housing Costs", "weight": 42.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Transportation", "item": "Transport Services", "weight": 18.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Healthcare", "item": "Medical Services", "weight": 15.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Education", "item": "Education Services", "weight": 12.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Recreation", "item": "Entertainment", "weight": 8.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0},
           {"category": "Other", "item": "Miscellaneous", "weight": 5.0, "basePrice": 100.0, "currentPrice": 100.0, "priceChange": 0.0}
         ]', 
         CURRENT_DATE)
      ON CONFLICT (id) DO NOTHING
    `);
    
    console.log('✅ Inflation Tracking schema initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing Inflation Tracking schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default { initializeInflationSchema };
