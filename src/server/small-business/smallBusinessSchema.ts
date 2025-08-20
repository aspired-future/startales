/**
 * Small Business Ecosystem Database Schema
 *
 * Database tables and initialization for the Small Business System
 */

import { Pool } from 'pg';

export async function initializeSmallBusinessSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('🏪 Initializing Small Business Ecosystem database schema...');

    // Main small businesses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS small_businesses (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        business_type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        civilization_id INTEGER NOT NULL,
        planet_id INTEGER NOT NULL,
        city_id INTEGER NOT NULL,
        location JSONB NOT NULL,
        owner JSONB NOT NULL,
        financial_info JSONB NOT NULL,
        operations JSONB NOT NULL,
        market_presence JSONB NOT NULL,
        business_health JSONB NOT NULL,
        growth_metrics JSONB NOT NULL,
        compliance JSONB NOT NULL,
        lifecycle JSONB NOT NULL,
        metadata JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Business employees table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_employees (
        id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        character_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        position VARCHAR(100) NOT NULL,
        employment_type VARCHAR(50) NOT NULL,
        hourly_wage DECIMAL(10,2) NOT NULL,
        hours_per_week INTEGER NOT NULL,
        skill_level INTEGER NOT NULL CHECK (skill_level >= 0 AND skill_level <= 100),
        productivity INTEGER NOT NULL CHECK (productivity >= 0 AND productivity <= 100),
        job_satisfaction INTEGER NOT NULL CHECK (job_satisfaction >= 0 AND job_satisfaction <= 100),
        tenure_months INTEGER NOT NULL,
        benefits_package JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Products and services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_products_services (
        id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('product', 'service')),
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        cost_to_produce DECIMAL(10,2) NOT NULL,
        profit_margin DECIMAL(5,2) NOT NULL,
        popularity_score INTEGER NOT NULL CHECK (popularity_score >= 0 AND popularity_score <= 100),
        quality_rating INTEGER NOT NULL CHECK (quality_rating >= 0 AND quality_rating <= 100),
        seasonal_demand BOOLEAN DEFAULT FALSE,
        customizable BOOLEAN DEFAULT FALSE,
        delivery_options JSONB,
        warranty_period INTEGER,
        certifications JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Supplier relationships table
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier_relationships (
        id SERIAL PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        supplier_id VARCHAR(255) NOT NULL,
        supplier_name VARCHAR(255) NOT NULL,
        supplier_type VARCHAR(50) NOT NULL,
        products_services JSONB NOT NULL,
        relationship_strength INTEGER NOT NULL CHECK (relationship_strength >= 0 AND relationship_strength <= 100),
        payment_terms VARCHAR(100),
        delivery_reliability INTEGER NOT NULL CHECK (delivery_reliability >= 0 AND delivery_reliability <= 100),
        quality_consistency INTEGER NOT NULL CHECK (quality_consistency >= 0 AND quality_consistency <= 100),
        price_competitiveness INTEGER NOT NULL CHECK (price_competitiveness >= 0 AND price_competitiveness <= 100),
        contract_end_date DATE,
        exclusive_agreement BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Distribution networks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS distribution_networks (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        network_type VARCHAR(50) NOT NULL,
        coverage_area JSONB NOT NULL,
        logistics JSONB NOT NULL,
        performance_metrics JSONB NOT NULL,
        cost_structure JSONB NOT NULL,
        technology_integration JSONB NOT NULL,
        sustainability JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Network participants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS network_participants (
        id SERIAL PRIMARY KEY,
        network_id VARCHAR(255) NOT NULL,
        business_id VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        participation_level VARCHAR(20) NOT NULL,
        contribution_score INTEGER NOT NULL CHECK (contribution_score >= 0 AND contribution_score <= 100),
        reliability_rating INTEGER NOT NULL CHECK (reliability_rating >= 0 AND reliability_rating <= 100),
        joined_date DATE NOT NULL,
        benefits_received JSONB,
        obligations JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (network_id) REFERENCES distribution_networks(id) ON DELETE CASCADE,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Business analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_analytics (
        id SERIAL PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        analysis_date DATE NOT NULL,
        performance_indicators JSONB NOT NULL,
        market_analysis JSONB NOT NULL,
        financial_analysis JSONB NOT NULL,
        operational_analysis JSONB NOT NULL,
        competitive_analysis JSONB NOT NULL,
        risk_analysis JSONB NOT NULL,
        recommendations JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE,
        UNIQUE(business_id, analysis_date)
      )
    `);

    // Business transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_transactions (
        id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        counterparty VARCHAR(255),
        description TEXT,
        category VARCHAR(100),
        payment_method VARCHAR(50),
        transaction_date TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL,
        reference_number VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Business loans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_loans (
        id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        lender VARCHAR(255) NOT NULL,
        principal_amount DECIMAL(12,2) NOT NULL,
        remaining_balance DECIMAL(12,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        monthly_payment DECIMAL(10,2) NOT NULL,
        term_months INTEGER NOT NULL,
        remaining_months INTEGER NOT NULL,
        loan_type VARCHAR(50) NOT NULL,
        collateral TEXT,
        origination_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Business events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_events (
        id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        event_category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL,
        impact_level VARCHAR(20) NOT NULL,
        financial_impact DECIMAL(12,2),
        operational_impact TEXT,
        market_impact TEXT,
        stakeholders_affected JSONB,
        resolution_status VARCHAR(20),
        lessons_learned TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES small_businesses(id) ON DELETE CASCADE
      )
    `);

    // Market trends table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_trends (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        planet_id INTEGER,
        city_id INTEGER,
        industry_category VARCHAR(100) NOT NULL,
        trend_type VARCHAR(50) NOT NULL,
        trend_name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        impact_level VARCHAR(20) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        affected_businesses INTEGER DEFAULT 0,
        market_impact_percentage DECIMAL(5,2),
        confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
        data_sources JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_small_businesses_civilization ON small_businesses(civilization_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_small_businesses_planet ON small_businesses(planet_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_small_businesses_city ON small_businesses(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_small_businesses_category ON small_businesses(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_small_businesses_type ON small_businesses(business_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_employees_business ON business_employees(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_employees_character ON business_employees(character_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_services_business ON business_products_services(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_services_category ON business_products_services(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_relationships_business ON supplier_relationships(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_relationships_supplier ON supplier_relationships(supplier_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_network_participants_network ON network_participants(network_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_network_participants_business ON network_participants(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_analytics_business ON business_analytics(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_analytics_date ON business_analytics(analysis_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_transactions_business ON business_transactions(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_transactions_date ON business_transactions(transaction_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_loans_business ON business_loans(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_events_business ON business_events(business_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_events_date ON business_events(event_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_market_trends_civilization ON market_trends(civilization_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_market_trends_industry ON market_trends(industry_category)`);

    // Insert sample business categories and templates
    await insertBusinessTemplates(client);

    console.log('✅ Small Business Ecosystem database schema initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing Small Business Ecosystem schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertBusinessTemplates(client: any): Promise<void> {
  console.log('📋 Inserting business templates and market data...');

  // Insert sample market trends
  const marketTrends = [
    {
      civilization_id: 1,
      industry_category: 'retail',
      trend_type: 'consumer_behavior',
      trend_name: 'Digital Payment Adoption',
      description: 'Increasing consumer preference for contactless and digital payment methods',
      impact_level: 'high',
      start_date: '2024-01-01',
      market_impact_percentage: 15.5,
      confidence_score: 85
    },
    {
      civilization_id: 1,
      industry_category: 'food_service',
      trend_type: 'operational',
      trend_name: 'Sustainable Packaging',
      description: 'Growing demand for eco-friendly packaging solutions in food service',
      impact_level: 'medium',
      start_date: '2024-02-01',
      market_impact_percentage: 8.2,
      confidence_score: 78
    },
    {
      civilization_id: 1,
      industry_category: 'professional_services',
      trend_type: 'technology',
      trend_name: 'Remote Service Delivery',
      description: 'Shift towards virtual consultations and remote professional services',
      impact_level: 'high',
      start_date: '2024-01-15',
      market_impact_percentage: 22.1,
      confidence_score: 92
    },
    {
      civilization_id: 1,
      industry_category: 'manufacturing',
      trend_type: 'supply_chain',
      trend_name: 'Local Sourcing Priority',
      description: 'Businesses prioritizing local suppliers to reduce supply chain risks',
      impact_level: 'medium',
      start_date: '2024-03-01',
      market_impact_percentage: 12.7,
      confidence_score: 81
    },
    {
      civilization_id: 1,
      industry_category: 'technology',
      trend_type: 'innovation',
      trend_name: 'AI Integration',
      description: 'Small businesses adopting AI tools for customer service and operations',
      impact_level: 'high',
      start_date: '2024-02-15',
      market_impact_percentage: 18.9,
      confidence_score: 89
    }
  ];

  for (const trend of marketTrends) {
    try {
      await client.query(`
        INSERT INTO market_trends (
          civilization_id, industry_category, trend_type, trend_name, description,
          impact_level, start_date, market_impact_percentage, confidence_score, data_sources
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT DO NOTHING
      `, [
        trend.civilization_id,
        trend.industry_category,
        trend.trend_type,
        trend.trend_name,
        trend.description,
        trend.impact_level,
        trend.start_date,
        trend.market_impact_percentage,
        trend.confidence_score,
        JSON.stringify(['market_research', 'business_surveys', 'economic_indicators'])
      ]);
    } catch (error) {
      console.error(`❌ Error inserting market trend ${trend.trend_name}:`, error);
    }
  }

  console.log('✅ Business templates and market data inserted successfully');
}
