import { Pool } from 'pg';

/**
 * Planetary Government Database Schema
 * Creates tables for automated planetary-level governance systems
 */

export async function initializePlanetaryGovernmentSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌍 Creating Planetary Government tables...');

    // Main planetary governments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS planetary_governments (
        id SERIAL PRIMARY KEY,
        planet_id TEXT NOT NULL,
        civilization_id TEXT NOT NULL,
        government_name VARCHAR(100) NOT NULL,
        government_type VARCHAR(50) NOT NULL DEFAULT 'autonomous',
        
        -- Leadership
        planetary_governor VARCHAR(100) NOT NULL,
        deputy_governors JSONB DEFAULT '[]'::jsonb,
        governing_council JSONB DEFAULT '[]'::jsonb,
        
        -- Government Structure
        autonomy_level INTEGER DEFAULT 50 CHECK (autonomy_level >= 0 AND autonomy_level <= 100),
        reporting_frequency VARCHAR(20) DEFAULT 'monthly',
        
        -- Budget & Economics
        planetary_budget DECIMAL(15,2) DEFAULT 0,
        tax_collection_rate DECIMAL(5,2) DEFAULT 15.00,
        central_government_funding DECIMAL(15,2) DEFAULT 0,
        economic_specialization VARCHAR(50),
        
        -- Population & Demographics
        total_population BIGINT DEFAULT 0,
        population_growth_rate DECIMAL(5,4) DEFAULT 0.0200,
        employment_rate DECIMAL(5,2) DEFAULT 85.00,
        education_level DECIMAL(5,2) DEFAULT 60.00,
        quality_of_life DECIMAL(5,2) DEFAULT 70.00,
        
        -- Infrastructure
        infrastructure_level DECIMAL(5,2) DEFAULT 50.00,
        transportation_network DECIMAL(5,2) DEFAULT 40.00,
        communication_network DECIMAL(5,2) DEFAULT 60.00,
        energy_grid DECIMAL(5,2) DEFAULT 55.00,
        water_systems DECIMAL(5,2) DEFAULT 50.00,
        
        -- Resources & Environment
        resource_reserves JSONB DEFAULT '{}'::jsonb,
        environmental_health DECIMAL(5,2) DEFAULT 75.00,
        sustainability_rating DECIMAL(5,2) DEFAULT 60.00,
        
        -- Policies & Governance
        current_policies JSONB DEFAULT '[]'::jsonb,
        policy_priorities JSONB DEFAULT '[]'::jsonb,
        approval_rating DECIMAL(5,2) DEFAULT 65.00,
        
        -- Status & Metadata
        establishment_date DATE DEFAULT CURRENT_DATE,
        last_election_date DATE,
        next_election_date DATE,
        government_status VARCHAR(20) DEFAULT 'active',
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE(planet_id, civilization_id),
        CHECK (government_type IN ('autonomous', 'federal', 'colonial', 'corporate')),
        CHECK (government_status IN ('active', 'transition', 'crisis'))
      )
    `);

    // Planetary city management coordination table
    await client.query(`
      CREATE TABLE IF NOT EXISTS planetary_city_management (
        id SERIAL PRIMARY KEY,
        planetary_government_id INTEGER REFERENCES planetary_governments(id) ON DELETE CASCADE,
        city_id TEXT NOT NULL,
        city_name VARCHAR(100) NOT NULL,
        
        -- City Status
        population INTEGER DEFAULT 0,
        economic_output DECIMAL(15,2) DEFAULT 0,
        infrastructure_rating DECIMAL(5,2) DEFAULT 50.00,
        specialization VARCHAR(50),
        
        -- Management
        city_manager VARCHAR(100),
        management_budget DECIMAL(15,2) DEFAULT 0,
        development_priority VARCHAR(20) DEFAULT 'balanced',
        
        -- Automated Decisions
        last_infrastructure_upgrade DATE,
        next_planned_project VARCHAR(200),
        resource_allocation JSONB DEFAULT '{}'::jsonb,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE(planetary_government_id, city_id),
        CHECK (development_priority IN ('growth', 'maintenance', 'specialization', 'balanced'))
      )
    `);

    // Planetary government AI knobs configuration
    await client.query(`
      CREATE TABLE IF NOT EXISTS planetary_government_knobs (
        id SERIAL PRIMARY KEY,
        planetary_government_id INTEGER REFERENCES planetary_governments(id) ON DELETE CASCADE UNIQUE,
        knob_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Planetary government decisions log
    await client.query(`
      CREATE TABLE IF NOT EXISTS planetary_government_decisions (
        id SERIAL PRIMARY KEY,
        planetary_government_id INTEGER REFERENCES planetary_governments(id) ON DELETE CASCADE,
        decision_type VARCHAR(50) NOT NULL,
        decision_title VARCHAR(200) NOT NULL,
        decision_description TEXT,
        decision_data JSONB DEFAULT '{}'::jsonb,
        
        -- Decision Context
        trigger_event VARCHAR(100),
        affected_cities TEXT[],
        budget_impact DECIMAL(15,2) DEFAULT 0,
        
        -- Decision Outcome
        implementation_status VARCHAR(20) DEFAULT 'pending',
        implementation_date TIMESTAMP,
        success_rating DECIMAL(3,2), -- 0-10 scale
        citizen_approval_change DECIMAL(5,2) DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        CHECK (implementation_status IN ('pending', 'implementing', 'completed', 'failed', 'cancelled'))
      )
    `);

    // Planetary government performance metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS planetary_government_metrics (
        id SERIAL PRIMARY KEY,
        planetary_government_id INTEGER REFERENCES planetary_governments(id) ON DELETE CASCADE,
        metric_date DATE NOT NULL,
        
        -- Economic Metrics
        gdp_growth_rate DECIMAL(5,2) DEFAULT 0,
        unemployment_rate DECIMAL(5,2) DEFAULT 0,
        inflation_rate DECIMAL(5,2) DEFAULT 0,
        budget_surplus_deficit DECIMAL(15,2) DEFAULT 0,
        
        -- Social Metrics
        quality_of_life_index DECIMAL(5,2) DEFAULT 0,
        education_index DECIMAL(5,2) DEFAULT 0,
        healthcare_index DECIMAL(5,2) DEFAULT 0,
        crime_rate DECIMAL(5,2) DEFAULT 0,
        
        -- Infrastructure Metrics
        infrastructure_efficiency DECIMAL(5,2) DEFAULT 0,
        transportation_usage DECIMAL(5,2) DEFAULT 0,
        energy_efficiency DECIMAL(5,2) DEFAULT 0,
        
        -- Environmental Metrics
        environmental_impact DECIMAL(5,2) DEFAULT 0,
        sustainability_score DECIMAL(5,2) DEFAULT 0,
        resource_depletion_rate DECIMAL(5,2) DEFAULT 0,
        
        -- Political Metrics
        approval_rating DECIMAL(5,2) DEFAULT 0,
        political_stability DECIMAL(5,2) DEFAULT 0,
        corruption_index DECIMAL(5,2) DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE(planetary_government_id, metric_date)
      )
    `);

    console.log('🌍 Creating indexes for Planetary Government tables...');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_governments_planet_id 
      ON planetary_governments(planet_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_governments_civilization_id 
      ON planetary_governments(civilization_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_governments_status 
      ON planetary_governments(government_status)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_city_management_gov_id 
      ON planetary_city_management(planetary_government_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_decisions_gov_id_date 
      ON planetary_government_decisions(planetary_government_id, created_at)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_planetary_metrics_gov_id_date 
      ON planetary_government_metrics(planetary_government_id, metric_date)
    `);

    await client.query('COMMIT');
    console.log('✅ Planetary Government schema created successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to create Planetary Government schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert sample planetary government data for testing
 */
export async function insertPlanetaryGovernmentSeedData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌍 Inserting Planetary Government seed data...');

    // Sample planetary government for Earth
    const earthGovResult = await client.query(`
      INSERT INTO planetary_governments (
        planet_id, civilization_id, government_name, government_type,
        planetary_governor, autonomy_level, total_population, 
        economic_specialization, planetary_budget, tax_collection_rate,
        infrastructure_level, environmental_health, approval_rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (planet_id, civilization_id) DO NOTHING
      RETURNING id
    `, [
      'earth', '1', 'Terran Planetary Administration', 'federal',
      'Governor Sarah Chen', 75, 8500000000, 'industrial',
      2500000000000, 18.50, 85.00, 78.00, 72.00
    ]);

    if (earthGovResult.rows.length > 0) {
      const earthGovId = earthGovResult.rows[0].id;

      // Add AI knobs for Earth government
      await client.query(`
        INSERT INTO planetary_government_knobs (planetary_government_id, knob_settings)
        VALUES ($1, $2)
        ON CONFLICT (planetary_government_id) DO NOTHING
      `, [earthGovId, JSON.stringify({
        budgetAllocation: { value: 65, min: 0, max: 100, description: "How aggressively to allocate budget vs save reserves" },
        taxationPolicy: { value: 55, min: 0, max: 100, description: "Balance between high revenue vs economic growth" },
        tradeOpenness: { value: 80, min: 0, max: 100, description: "How open to interplanetary trade and commerce" },
        economicDiversification: { value: 70, min: 0, max: 100, description: "Focus on specialization vs diversified economy" },
        infrastructureInvestment: { value: 75, min: 0, max: 100, description: "Priority level for infrastructure projects" },
        resourceExploitation: { value: 45, min: 0, max: 100, description: "Balance between extraction and conservation" },
        businessRegulation: { value: 60, min: 0, max: 100, description: "Level of business oversight and regulation" },
        innovationIncentives: { value: 85, min: 0, max: 100, description: "Investment in research and technological advancement" },
        immigrationPolicy: { value: 50, min: 0, max: 100, description: "Openness to population from other planets" },
        educationInvestment: { value: 80, min: 0, max: 100, description: "Priority for educational system development" },
        healthcareInvestment: { value: 75, min: 0, max: 100, description: "Healthcare system funding and accessibility" },
        housingPolicy: { value: 65, min: 0, max: 100, description: "Balance between affordable housing and market freedom" },
        socialServices: { value: 70, min: 0, max: 100, description: "Level of social safety net and welfare programs" },
        culturalPreservation: { value: 60, min: 0, max: 100, description: "Investment in local culture vs civilization integration" },
        autonomyAssertion: { value: 75, min: 0, max: 100, description: "How much independence to seek from central government" },
        bureaucracyEfficiency: { value: 55, min: 0, max: 100, description: "Focus on streamlined vs thorough administration" },
        transparencyLevel: { value: 70, min: 0, max: 100, description: "Government openness and public information sharing" },
        participatoryGovernance: { value: 65, min: 0, max: 100, description: "Level of citizen involvement in decision making" },
        interCityCoordination: { value: 80, min: 0, max: 100, description: "Coordination between cities vs local autonomy" },
        emergencyPreparedness: { value: 60, min: 0, max: 100, description: "Investment in crisis response and resilience" },
        environmentalProtection: { value: 70, min: 0, max: 100, description: "Balance between development and conservation" },
        sustainabilityFocus: { value: 75, min: 0, max: 100, description: "Long-term sustainability vs short-term growth" },
        planetaryPlanning: { value: 85, min: 0, max: 100, description: "Coordinated development vs organic growth" },
        energyPolicy: { value: 80, min: 0, max: 100, description: "Renewable energy investment vs traditional sources" },
        transportationDevelopment: { value: 75, min: 0, max: 100, description: "Investment in planetary transportation networks" }
      })]);

      // Add sample cities under Earth government
      await client.query(`
        INSERT INTO planetary_city_management (
          planetary_government_id, city_id, city_name, population, 
          economic_output, specialization, city_manager, management_budget
        ) VALUES 
        ($1, 'new-york', 'New York', 8400000, 850000000000, 'financial', 'Mayor John Smith', 45000000000),
        ($1, 'london', 'London', 9000000, 780000000000, 'financial', 'Mayor Emma Thompson', 42000000000),
        ($1, 'tokyo', 'Tokyo', 14000000, 920000000000, 'technology', 'Mayor Hiroshi Tanaka', 55000000000),
        ($1, 'shanghai', 'Shanghai', 26000000, 680000000000, 'industrial', 'Mayor Li Wei', 38000000000)
        ON CONFLICT (planetary_government_id, city_id) DO NOTHING
      `, [earthGovId]);
    }

    // Sample planetary government for Mars
    const marsGovResult = await client.query(`
      INSERT INTO planetary_governments (
        planet_id, civilization_id, government_name, government_type,
        planetary_governor, autonomy_level, total_population, 
        economic_specialization, planetary_budget, tax_collection_rate,
        infrastructure_level, environmental_health, approval_rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (planet_id, civilization_id) DO NOTHING
      RETURNING id
    `, [
      'mars', '1', 'Mars Colonial Government', 'colonial',
      'Administrator Robert Kim', 45, 2500000, 'mining',
      85000000000, 12.00, 35.00, 45.00, 68.00
    ]);

    if (marsGovResult.rows.length > 0) {
      const marsGovId = marsGovResult.rows[0].id;

      // Add AI knobs for Mars government (different settings reflecting colonial status)
      await client.query(`
        INSERT INTO planetary_government_knobs (planetary_government_id, knob_settings)
        VALUES ($1, $2)
        ON CONFLICT (planetary_government_id) DO NOTHING
      `, [marsGovId, JSON.stringify({
        budgetAllocation: { value: 80, min: 0, max: 100, description: "How aggressively to allocate budget vs save reserves" },
        taxationPolicy: { value: 35, min: 0, max: 100, description: "Balance between high revenue vs economic growth" },
        tradeOpenness: { value: 90, min: 0, max: 100, description: "How open to interplanetary trade and commerce" },
        economicDiversification: { value: 30, min: 0, max: 100, description: "Focus on specialization vs diversified economy" },
        infrastructureInvestment: { value: 95, min: 0, max: 100, description: "Priority level for infrastructure projects" },
        resourceExploitation: { value: 85, min: 0, max: 100, description: "Balance between extraction and conservation" },
        businessRegulation: { value: 40, min: 0, max: 100, description: "Level of business oversight and regulation" },
        innovationIncentives: { value: 70, min: 0, max: 100, description: "Investment in research and technological advancement" },
        immigrationPolicy: { value: 85, min: 0, max: 100, description: "Openness to population from other planets" },
        educationInvestment: { value: 60, min: 0, max: 100, description: "Priority for educational system development" },
        healthcareInvestment: { value: 65, min: 0, max: 100, description: "Healthcare system funding and accessibility" },
        housingPolicy: { value: 75, min: 0, max: 100, description: "Balance between affordable housing and market freedom" },
        socialServices: { value: 50, min: 0, max: 100, description: "Level of social safety net and welfare programs" },
        culturalPreservation: { value: 40, min: 0, max: 100, description: "Investment in local culture vs civilization integration" },
        autonomyAssertion: { value: 45, min: 0, max: 100, description: "How much independence to seek from central government" },
        bureaucracyEfficiency: { value: 70, min: 0, max: 100, description: "Focus on streamlined vs thorough administration" },
        transparencyLevel: { value: 80, min: 0, max: 100, description: "Government openness and public information sharing" },
        participatoryGovernance: { value: 75, min: 0, max: 100, description: "Level of citizen involvement in decision making" },
        interCityCoordination: { value: 90, min: 0, max: 100, description: "Coordination between cities vs local autonomy" },
        emergencyPreparedness: { value: 85, min: 0, max: 100, description: "Investment in crisis response and resilience" },
        environmentalProtection: { value: 40, min: 0, max: 100, description: "Balance between development and conservation" },
        sustainabilityFocus: { value: 65, min: 0, max: 100, description: "Long-term sustainability vs short-term growth" },
        planetaryPlanning: { value: 95, min: 0, max: 100, description: "Coordinated development vs organic growth" },
        energyPolicy: { value: 60, min: 0, max: 100, description: "Renewable energy investment vs traditional sources" },
        transportationDevelopment: { value: 85, min: 0, max: 100, description: "Investment in planetary transportation networks" }
      })]);

      // Add sample cities under Mars government
      await client.query(`
        INSERT INTO planetary_city_management (
          planetary_government_id, city_id, city_name, population, 
          economic_output, specialization, city_manager, management_budget
        ) VALUES 
        ($1, 'olympia', 'Olympia', 850000, 45000000000, 'mining', 'Administrator Sarah Johnson', 3200000000),
        ($1, 'new-berlin', 'New Berlin', 650000, 32000000000, 'research', 'Director Klaus Weber', 2800000000)
        ON CONFLICT (planetary_government_id, city_id) DO NOTHING
      `, [marsGovId]);
    }

    await client.query('COMMIT');
    console.log('✅ Planetary Government seed data inserted successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to insert Planetary Government seed data:', error);
    throw error;
  } finally {
    client.release();
  }
}
