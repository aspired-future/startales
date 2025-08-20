/**
 * Economic Tier Evolution Database Schema
 *
 * Database tables and initialization for the Economic Tier System
 */

import { Pool } from 'pg';

export async function initializeEconomicTierSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('📈 Initializing Economic Tier Evolution database schema...');

    // Main city economic profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS city_economic_profiles (
        city_id INTEGER PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        planet_id INTEGER NOT NULL,
        current_tier VARCHAR(20) NOT NULL CHECK (current_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        development_stage VARCHAR(20) NOT NULL CHECK (development_stage IN ('emerging', 'transitioning', 'established', 'mature', 'declining')),
        tier_progress INTEGER NOT NULL CHECK (tier_progress >= 0 AND tier_progress <= 100),
        economic_indicators JSONB NOT NULL,
        infrastructure JSONB NOT NULL,
        industry_composition JSONB NOT NULL,
        innovation_metrics JSONB NOT NULL,
        quality_of_life JSONB NOT NULL,
        tier_requirements JSONB NOT NULL,
        metadata JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Development constraints table
    await client.query(`
      CREATE TABLE IF NOT EXISTS development_constraints (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        constraint_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        impact_areas JSONB NOT NULL,
        estimated_cost_to_address DECIMAL(15,2),
        timeframe_to_resolve INTEGER, -- years
        probability_of_resolution INTEGER CHECK (probability_of_resolution >= 0 AND probability_of_resolution <= 100),
        mitigation_strategies JSONB,
        stakeholders_involved JSONB,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'addressing', 'resolved', 'abandoned')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Growth opportunities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS growth_opportunities (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        opportunity_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        potential_impact INTEGER CHECK (potential_impact >= 0 AND potential_impact <= 100),
        investment_required DECIMAL(15,2) NOT NULL,
        timeframe_years INTEGER NOT NULL,
        success_probability INTEGER CHECK (success_probability >= 0 AND success_probability <= 100),
        risk_factors JSONB,
        key_enablers JSONB,
        expected_outcomes JSONB,
        stakeholder_alignment INTEGER CHECK (stakeholder_alignment >= 0 AND stakeholder_alignment <= 100),
        status VARCHAR(20) DEFAULT 'identified' CHECK (status IN ('identified', 'evaluating', 'approved', 'implementing', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Development events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS development_events (
        id VARCHAR(255) PRIMARY KEY,
        city_id INTEGER NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        impact_magnitude INTEGER CHECK (impact_magnitude >= -100 AND impact_magnitude <= 100),
        affected_indicators JSONB,
        long_term_effects JSONB,
        lessons_learned TEXT,
        stakeholders_involved JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Development projections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS development_projections (
        id VARCHAR(255) PRIMARY KEY,
        city_id INTEGER NOT NULL,
        scenario_name VARCHAR(255) NOT NULL,
        probability INTEGER CHECK (probability >= 0 AND probability <= 100),
        timeframe_years INTEGER NOT NULL,
        projected_tier VARCHAR(20) NOT NULL CHECK (projected_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        key_assumptions JSONB,
        projected_indicators JSONB,
        critical_success_factors JSONB,
        major_risks JSONB,
        policy_recommendations JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Tier definitions table (reference data)
    await client.query(`
      CREATE TABLE IF NOT EXISTS tier_definitions (
        tier VARCHAR(20) PRIMARY KEY CHECK (tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        typical_characteristics JSONB NOT NULL,
        advancement_criteria JSONB NOT NULL,
        common_challenges JSONB,
        development_strategies JSONB,
        benchmark_cities JSONB,
        transition_pathways JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Development plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS development_plans (
        id VARCHAR(255) PRIMARY KEY,
        city_id INTEGER NOT NULL,
        target_tier VARCHAR(20) NOT NULL CHECK (target_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        planning_horizon_years INTEGER NOT NULL,
        strategic_objectives JSONB NOT NULL,
        implementation_phases JSONB NOT NULL,
        resource_mobilization JSONB NOT NULL,
        risk_management JSONB NOT NULL,
        monitoring_framework JSONB NOT NULL,
        stakeholder_engagement JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'implementing', 'completed', 'cancelled')),
        approval_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Policy impact assessments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS policy_impact_assessments (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        policy_changes JSONB NOT NULL,
        overall_impact_score INTEGER CHECK (overall_impact_score >= -100 AND overall_impact_score <= 100),
        affected_indicators JSONB,
        tier_advancement_probability INTEGER CHECK (tier_advancement_probability >= 0 AND tier_advancement_probability <= 100),
        cost_benefit_ratio DECIMAL(10,2),
        implementation_challenges JSONB,
        unintended_consequences JSONB,
        stakeholder_reactions JSONB,
        assessment_date DATE NOT NULL,
        analyst_id VARCHAR(255),
        confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Benchmark analyses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS benchmark_analyses (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        analysis_date DATE NOT NULL,
        peer_cities JSONB NOT NULL,
        relative_performance JSONB NOT NULL,
        best_practices JSONB,
        performance_gaps JSONB,
        competitive_advantages JSONB,
        improvement_priorities JSONB,
        methodology_version VARCHAR(50),
        confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Economic indicators history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_indicators_history (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        measurement_date DATE NOT NULL,
        gdp_per_capita DECIMAL(12,2),
        gdp_growth_rate DECIMAL(5,2),
        unemployment_rate DECIMAL(5,2),
        inflation_rate DECIMAL(5,2),
        productivity_index INTEGER CHECK (productivity_index >= 0 AND productivity_index <= 100),
        competitiveness_index INTEGER CHECK (competitiveness_index >= 0 AND competitiveness_index <= 100),
        economic_complexity_index INTEGER CHECK (economic_complexity_index >= 0 AND economic_complexity_index <= 100),
        innovation_index INTEGER CHECK (innovation_index >= 0 AND innovation_index <= 100),
        quality_of_life_index INTEGER CHECK (quality_of_life_index >= 0 AND quality_of_life_index <= 100),
        infrastructure_score INTEGER CHECK (infrastructure_score >= 0 AND infrastructure_score <= 100),
        tier_at_measurement VARCHAR(20) CHECK (tier_at_measurement IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        data_source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE,
        UNIQUE(city_id, measurement_date)
      )
    `);

    // Tier transition events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tier_transition_events (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        from_tier VARCHAR(20) NOT NULL CHECK (from_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        to_tier VARCHAR(20) NOT NULL CHECK (to_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        transition_date DATE NOT NULL,
        transition_duration_years DECIMAL(4,1),
        key_factors JSONB,
        catalyst_events JSONB,
        challenges_overcome JSONB,
        lessons_learned TEXT,
        sustainability_indicators JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES city_economic_profiles(city_id) ON DELETE CASCADE
      )
    `);

    // Create indexes for performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_city_economic_profiles_civilization ON city_economic_profiles(civilization_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_city_economic_profiles_planet ON city_economic_profiles(planet_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_city_economic_profiles_tier ON city_economic_profiles(current_tier)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_city_economic_profiles_stage ON city_economic_profiles(development_stage)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_constraints_city ON development_constraints(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_constraints_type ON development_constraints(constraint_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_constraints_severity ON development_constraints(severity)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_growth_opportunities_city ON growth_opportunities(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_growth_opportunities_type ON growth_opportunities(opportunity_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_growth_opportunities_status ON growth_opportunities(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_events_city ON development_events(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_events_date ON development_events(event_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_events_type ON development_events(event_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_projections_city ON development_projections(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_plans_city ON development_plans(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_development_plans_status ON development_plans(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_policy_assessments_city ON policy_impact_assessments(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_benchmark_analyses_city ON benchmark_analyses(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_benchmark_analyses_date ON benchmark_analyses(analysis_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_indicators_history_city ON economic_indicators_history(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_indicators_history_date ON economic_indicators_history(measurement_date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_tier_transitions_city ON tier_transition_events(city_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_tier_transitions_date ON tier_transition_events(transition_date)`);

    // Insert tier definitions
    await insertTierDefinitions(client);

    console.log('✅ Economic Tier Evolution database schema initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing Economic Tier Evolution schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertTierDefinitions(client: any): Promise<void> {
  console.log('📋 Inserting tier definitions...');

  const tierDefinitions = [
    {
      tier: 'developing',
      name: 'Developing Economy',
      description: 'Cities in early stages of economic development with basic infrastructure and primarily resource-based or low-skill manufacturing economies.',
      typical_characteristics: {
        gdp_per_capita_range: [5000, 25000],
        dominant_sectors: ['agriculture', 'mining', 'basic_manufacturing', 'informal_services'],
        infrastructure_level: 30,
        innovation_intensity: 15,
        quality_of_life: 45,
        economic_complexity: 25,
        sustainability_level: 35,
        typical_population_range: [50000, 2000000],
        governance_maturity: 40
      },
      advancement_criteria: {
        minimum_requirements: {
          gdp_per_capita: 20000,
          infrastructure_score: 60,
          education_attainment: 70,
          economic_diversification: 50,
          innovation_index: 30
        },
        weighted_scoring: {
          economic_indicators: 0.3,
          infrastructure: 0.25,
          innovation: 0.2,
          quality_of_life: 0.15,
          sustainability: 0.1
        },
        threshold_score: 65,
        sustained_performance_years: 3,
        qualitative_assessments: ['institutional_capacity', 'governance_quality', 'social_stability']
      },
      common_challenges: [
        'Limited infrastructure',
        'Low productivity',
        'Informal economy dominance',
        'Skills gaps',
        'Limited access to capital',
        'Weak institutions',
        'Environmental degradation',
        'Income inequality'
      ],
      development_strategies: [
        'Infrastructure investment',
        'Education and skills development',
        'Institutional strengthening',
        'Economic diversification',
        'Foreign investment attraction',
        'Technology adoption',
        'Environmental protection',
        'Social inclusion programs'
      ],
      benchmark_cities: ['Emerging City Alpha', 'Development Hub Beta', 'Growth Center Gamma'],
      transition_pathways: [
        {
          pathway_name: 'Infrastructure-Led Development',
          description: 'Focus on building core infrastructure to enable economic growth',
          typical_duration_years: 8,
          success_rate: 65,
          resource_intensity: 'very_high'
        },
        {
          pathway_name: 'Human Capital Development',
          description: 'Invest in education and skills to build competitive workforce',
          typical_duration_years: 12,
          success_rate: 70,
          resource_intensity: 'high'
        }
      ]
    },
    {
      tier: 'industrial',
      name: 'Industrial Economy',
      description: 'Cities with established manufacturing base, improved infrastructure, and growing service sectors.',
      typical_characteristics: {
        gdp_per_capita_range: [25000, 60000],
        dominant_sectors: ['manufacturing', 'construction', 'business_services', 'logistics'],
        infrastructure_level: 70,
        innovation_intensity: 45,
        quality_of_life: 65,
        economic_complexity: 55,
        sustainability_level: 50,
        typical_population_range: [200000, 5000000],
        governance_maturity: 65
      },
      advancement_criteria: {
        minimum_requirements: {
          gdp_per_capita: 50000,
          infrastructure_score: 80,
          innovation_index: 60,
          economic_complexity: 70,
          quality_of_life: 75
        },
        weighted_scoring: {
          innovation: 0.3,
          economic_complexity: 0.25,
          quality_of_life: 0.2,
          sustainability: 0.15,
          infrastructure: 0.1
        },
        threshold_score: 75,
        sustained_performance_years: 5,
        qualitative_assessments: ['innovation_ecosystem', 'environmental_management', 'social_cohesion']
      },
      common_challenges: [
        'Environmental pollution',
        'Economic transition pressures',
        'Skills mismatch',
        'Infrastructure bottlenecks',
        'Innovation gaps',
        'Income inequality',
        'Urban sprawl',
        'Resource constraints'
      ],
      development_strategies: [
        'Innovation ecosystem development',
        'Green technology adoption',
        'Service sector growth',
        'Smart city initiatives',
        'Circular economy implementation',
        'Higher education expansion',
        'Sustainable urban planning',
        'Digital transformation'
      ],
      benchmark_cities: ['Industrial Hub Alpha', 'Manufacturing Center Beta', 'Tech City Gamma'],
      transition_pathways: [
        {
          pathway_name: 'Innovation-Driven Growth',
          description: 'Build innovation capacity and high-tech industries',
          typical_duration_years: 10,
          success_rate: 55,
          resource_intensity: 'high'
        },
        {
          pathway_name: 'Sustainable Development',
          description: 'Focus on environmental sustainability and green economy',
          typical_duration_years: 15,
          success_rate: 60,
          resource_intensity: 'high'
        }
      ]
    },
    {
      tier: 'advanced',
      name: 'Advanced Economy',
      description: 'Cities with knowledge-based economies, high innovation capacity, and excellent quality of life.',
      typical_characteristics: {
        gdp_per_capita_range: [60000, 150000],
        dominant_sectors: ['knowledge_services', 'high_tech', 'creative_industries', 'finance'],
        infrastructure_level: 90,
        innovation_intensity: 80,
        quality_of_life: 85,
        economic_complexity: 85,
        sustainability_level: 75,
        typical_population_range: [500000, 10000000],
        governance_maturity: 85
      },
      advancement_criteria: {
        minimum_requirements: {
          gdp_per_capita: 120000,
          innovation_index: 90,
          sustainability_score: 85,
          quality_of_life: 90,
          economic_complexity: 90
        },
        weighted_scoring: {
          sustainability: 0.3,
          innovation: 0.25,
          quality_of_life: 0.2,
          economic_resilience: 0.15,
          global_connectivity: 0.1
        },
        threshold_score: 90,
        sustained_performance_years: 7,
        qualitative_assessments: ['post_scarcity_readiness', 'technological_leadership', 'social_harmony']
      },
      common_challenges: [
        'Technological disruption',
        'Aging population',
        'Global competition',
        'Environmental limits',
        'Social inequality',
        'Innovation sustainability',
        'Resource efficiency',
        'Geopolitical risks'
      ],
      development_strategies: [
        'Cutting-edge R&D investment',
        'Circular economy mastery',
        'Social innovation',
        'Global knowledge networks',
        'Sustainable consumption',
        'Advanced governance systems',
        'Space economy development',
        'Post-scarcity preparation'
      ],
      benchmark_cities: ['Innovation Capital Alpha', 'Sustainable Metropolis Beta', 'Knowledge Hub Gamma'],
      transition_pathways: [
        {
          pathway_name: 'Post-Scarcity Transition',
          description: 'Develop abundance-based economic systems',
          typical_duration_years: 20,
          success_rate: 30,
          resource_intensity: 'very_high'
        }
      ]
    },
    {
      tier: 'post_scarcity',
      name: 'Post-Scarcity Economy',
      description: 'Cities that have achieved abundance through advanced technology, sustainable systems, and optimal resource utilization.',
      typical_characteristics: {
        gdp_per_capita_range: [150000, 500000],
        dominant_sectors: ['advanced_research', 'space_industries', 'creative_economy', 'life_enhancement'],
        infrastructure_level: 98,
        innovation_intensity: 95,
        quality_of_life: 95,
        economic_complexity: 95,
        sustainability_level: 95,
        typical_population_range: [1000000, 50000000],
        governance_maturity: 95
      },
      advancement_criteria: {
        minimum_requirements: {},
        weighted_scoring: {},
        threshold_score: 95,
        sustained_performance_years: 10,
        qualitative_assessments: ['abundance_achievement', 'universal_wellbeing', 'technological_mastery']
      },
      common_challenges: [
        'Meaning and purpose',
        'Innovation motivation',
        'Resource complacency',
        'Social stagnation',
        'Technological risks',
        'Interplanetary coordination',
        'Cultural preservation',
        'Evolutionary adaptation'
      ],
      development_strategies: [
        'Consciousness expansion',
        'Interstellar exploration',
        'Reality enhancement',
        'Collective intelligence',
        'Transcendent technologies',
        'Universal flourishing',
        'Cosmic responsibility',
        'Evolutionary guidance'
      ],
      benchmark_cities: ['Utopia Prime', 'Abundance Central', 'Transcendence City'],
      transition_pathways: []
    }
  ];

  for (const tierDef of tierDefinitions) {
    try {
      await client.query(`
        INSERT INTO tier_definitions (
          tier, name, description, typical_characteristics, advancement_criteria,
          common_challenges, development_strategies, benchmark_cities, transition_pathways
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (tier) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          typical_characteristics = EXCLUDED.typical_characteristics,
          advancement_criteria = EXCLUDED.advancement_criteria,
          common_challenges = EXCLUDED.common_challenges,
          development_strategies = EXCLUDED.development_strategies,
          benchmark_cities = EXCLUDED.benchmark_cities,
          transition_pathways = EXCLUDED.transition_pathways,
          updated_at = CURRENT_TIMESTAMP
      `, [
        tierDef.tier,
        tierDef.name,
        tierDef.description,
        JSON.stringify(tierDef.typical_characteristics),
        JSON.stringify(tierDef.advancement_criteria),
        JSON.stringify(tierDef.common_challenges),
        JSON.stringify(tierDef.development_strategies),
        JSON.stringify(tierDef.benchmark_cities),
        JSON.stringify(tierDef.transition_pathways)
      ]);
    } catch (error) {
      console.error(`❌ Error inserting tier definition ${tierDef.tier}:`, error);
    }
  }

  console.log('✅ Tier definitions inserted successfully');
}
