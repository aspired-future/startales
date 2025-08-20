/**
 * Corporate Lifecycle Database Schema
 * 
 * Database tables and initialization for the Corporate Lifecycle System
 */

import { Pool } from 'pg';

export interface CorporateLifecycleEvent {
  id: number;
  type: string;
  corporation_id: number;
  target_corporation_id?: number;
  event_date: Date;
  description: string;
  financial_impact: number;
  market_impact: number;
  employee_impact: number;
  success_probability: number;
  completion_date?: Date;
  status: string;
  metadata: any;
  created_at: Date;
}

export interface MergerAcquisitionRecord {
  id: number;
  acquirer_id: number;
  target_id: number;
  transaction_type: string;
  offer_price: number;
  offer_premium: number;
  synergy_value: number;
  integration_timeline: number;
  regulatory_approval_required: boolean;
  shareholder_approval_required: boolean;
  due_diligence_status: string;
  announcement_date: Date;
  expected_completion: Date;
  actual_completion?: Date;
  success_factors: string[];
  risk_factors: string[];
  post_merger_performance?: any;
  status: string;
  created_at: Date;
}

export interface BankruptcyRecord {
  id: number;
  corporation_id: number;
  bankruptcy_type: string;
  filing_date: Date;
  assets_value: number;
  liabilities_value: number;
  creditors_count: number;
  employee_count: number;
  restructuring_plan?: any;
  liquidation_proceeds?: number;
  recovery_rate?: number;
  resolution_date?: Date;
  successor_corporation_id?: number;
  status: string;
  created_at: Date;
}

export interface ProductEvolutionRecord {
  id: number;
  corporation_id: number;
  product_id: number;
  evolution_type: string;
  development_cost: number;
  market_research_score: number;
  technology_readiness: number;
  competitive_advantage: number;
  launch_date: Date;
  market_reception?: string;
  revenue_impact?: number;
  market_share_impact?: number;
  cannibalization_effect?: number;
  lifecycle_stage: string;
  created_at: Date;
}

export interface MarketEntryRecord {
  id: number;
  corporation_id: number;
  target_market_id: number;
  entry_strategy: string;
  investment_required: number;
  expected_timeline: number;
  market_barriers: string[];
  competitive_response: string[];
  success_metrics: any;
  entry_date: Date;
  performance_to_date?: any;
  status: string;
  created_at: Date;
}

export interface CorporateHealthRecord {
  id: number;
  corporation_id: number;
  financial_health: number;
  operational_health: number;
  market_health: number;
  leadership_health: number;
  overall_health: number;
  bankruptcy_risk: number;
  acquisition_attractiveness: number;
  growth_potential: number;
  innovation_index: number;
  assessment_date: Date;
  created_at: Date;
}

/**
 * Initialize Corporate Lifecycle database schema
 */
export async function initializeCorporateLifecycleSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Corporate Lifecycle Events - tracks all major corporate events
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_lifecycle_events (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL CHECK (type IN (
          'merger', 'acquisition', 'bankruptcy', 'ipo', 'spinoff', 
          'product_launch', 'market_entry', 'market_exit', 'leadership_change'
        )),
        corporation_id INTEGER NOT NULL,
        target_corporation_id INTEGER,
        event_date TIMESTAMP NOT NULL DEFAULT NOW(),
        description TEXT NOT NULL,
        financial_impact DECIMAL(20,2) NOT NULL DEFAULT 0,
        market_impact DECIMAL(10,2) NOT NULL DEFAULT 0,
        employee_impact INTEGER NOT NULL DEFAULT 0,
        success_probability DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        completion_date TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN (
          'planned', 'in_progress', 'completed', 'failed', 'cancelled'
        )),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Merger & Acquisition Records
    await client.query(`
      CREATE TABLE IF NOT EXISTS merger_acquisitions (
        id SERIAL PRIMARY KEY,
        acquirer_id INTEGER NOT NULL,
        target_id INTEGER NOT NULL,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
          'merger', 'acquisition', 'hostile_takeover'
        )),
        offer_price DECIMAL(20,2) NOT NULL,
        offer_premium DECIMAL(10,2) NOT NULL DEFAULT 0,
        synergy_value DECIMAL(20,2) NOT NULL DEFAULT 0,
        integration_timeline INTEGER NOT NULL DEFAULT 12,
        regulatory_approval_required BOOLEAN NOT NULL DEFAULT true,
        shareholder_approval_required BOOLEAN NOT NULL DEFAULT true,
        due_diligence_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (due_diligence_status IN (
          'pending', 'in_progress', 'completed', 'failed'
        )),
        announcement_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expected_completion TIMESTAMP NOT NULL,
        actual_completion TIMESTAMP,
        success_factors JSONB DEFAULT '[]',
        risk_factors JSONB DEFAULT '[]',
        post_merger_performance JSONB DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'announced' CHECK (status IN (
          'announced', 'pending_approval', 'approved', 'completed', 'failed', 'cancelled'
        )),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Bankruptcy Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS bankruptcy_events (
        id SERIAL PRIMARY KEY,
        corporation_id INTEGER NOT NULL,
        bankruptcy_type VARCHAR(30) NOT NULL CHECK (bankruptcy_type IN (
          'chapter_7', 'chapter_11', 'voluntary_liquidation', 'forced_liquidation'
        )),
        filing_date TIMESTAMP NOT NULL DEFAULT NOW(),
        assets_value DECIMAL(20,2) NOT NULL DEFAULT 0,
        liabilities_value DECIMAL(20,2) NOT NULL DEFAULT 0,
        creditors_count INTEGER NOT NULL DEFAULT 0,
        employee_count INTEGER NOT NULL DEFAULT 0,
        restructuring_plan JSONB DEFAULT '{}',
        liquidation_proceeds DECIMAL(20,2),
        recovery_rate DECIMAL(5,2),
        resolution_date TIMESTAMP,
        successor_corporation_id INTEGER,
        status VARCHAR(20) NOT NULL DEFAULT 'filed' CHECK (status IN (
          'filed', 'under_review', 'approved', 'rejected', 'completed'
        )),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Product Evolution Records
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_evolutions (
        id SERIAL PRIMARY KEY,
        corporation_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        evolution_type VARCHAR(20) NOT NULL CHECK (evolution_type IN (
          'upgrade', 'new_version', 'discontinuation', 'pivot', 'expansion'
        )),
        development_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
        market_research_score DECIMAL(5,2) NOT NULL DEFAULT 0,
        technology_readiness DECIMAL(5,2) NOT NULL DEFAULT 0,
        competitive_advantage DECIMAL(5,2) NOT NULL DEFAULT 0,
        launch_date TIMESTAMP NOT NULL,
        market_reception VARCHAR(20) CHECK (market_reception IN (
          'excellent', 'good', 'average', 'poor', 'failure'
        )),
        revenue_impact DECIMAL(15,2),
        market_share_impact DECIMAL(5,2),
        cannibalization_effect DECIMAL(5,2),
        lifecycle_stage VARCHAR(20) NOT NULL DEFAULT 'development' CHECK (lifecycle_stage IN (
          'development', 'testing', 'launch', 'growth', 'maturity', 'decline'
        )),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Market Entry Records
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_entries (
        id SERIAL PRIMARY KEY,
        corporation_id INTEGER NOT NULL,
        target_market_id INTEGER NOT NULL,
        entry_strategy VARCHAR(20) NOT NULL CHECK (entry_strategy IN (
          'organic_growth', 'acquisition', 'joint_venture', 'licensing', 'franchising'
        )),
        investment_required DECIMAL(15,2) NOT NULL DEFAULT 0,
        expected_timeline INTEGER NOT NULL DEFAULT 12,
        market_barriers JSONB DEFAULT '[]',
        competitive_response JSONB DEFAULT '[]',
        success_metrics JSONB DEFAULT '[]',
        entry_date TIMESTAMP NOT NULL DEFAULT NOW(),
        performance_to_date JSONB DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN (
          'planning', 'executing', 'established', 'struggling', 'exiting'
        )),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Corporate Health Assessments
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_health_assessments (
        id SERIAL PRIMARY KEY,
        corporation_id INTEGER NOT NULL UNIQUE,
        financial_health DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        operational_health DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        market_health DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        leadership_health DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        overall_health DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        bankruptcy_risk DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        acquisition_attractiveness DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        growth_potential DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        innovation_index DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        assessment_date TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Corporate Lifecycle Metrics - aggregated statistics
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_lifecycle_metrics (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        reporting_period DATE NOT NULL,
        total_corporations INTEGER NOT NULL DEFAULT 0,
        new_entrants INTEGER NOT NULL DEFAULT 0,
        bankruptcies INTEGER NOT NULL DEFAULT 0,
        mergers_acquisitions INTEGER NOT NULL DEFAULT 0,
        product_launches INTEGER NOT NULL DEFAULT 0,
        market_entries INTEGER NOT NULL DEFAULT 0,
        average_health_score DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        innovation_index DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        market_concentration DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(civilization_id, reporting_period)
      );
    `);

    // Corporate Relationships - tracks relationships between corporations
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_relationships (
        id SERIAL PRIMARY KEY,
        corporation_a_id INTEGER NOT NULL,
        corporation_b_id INTEGER NOT NULL,
        relationship_type VARCHAR(30) NOT NULL CHECK (relationship_type IN (
          'competitor', 'supplier', 'customer', 'partner', 'subsidiary', 
          'parent', 'joint_venture', 'strategic_alliance'
        )),
        relationship_strength DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        established_date TIMESTAMP NOT NULL DEFAULT NOW(),
        relationship_value DECIMAL(15,2) DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(corporation_a_id, corporation_b_id, relationship_type)
      );
    `);

    // Corporate Innovation Pipeline
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_innovation_pipeline (
        id SERIAL PRIMARY KEY,
        corporation_id INTEGER NOT NULL,
        innovation_type VARCHAR(30) NOT NULL CHECK (innovation_type IN (
          'product_development', 'process_improvement', 'technology_advancement',
          'business_model_innovation', 'market_expansion', 'sustainability_initiative'
        )),
        project_name VARCHAR(255) NOT NULL,
        description TEXT,
        investment_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
        expected_roi DECIMAL(10,2) NOT NULL DEFAULT 0,
        risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
        timeline_months INTEGER NOT NULL DEFAULT 12,
        current_stage VARCHAR(20) NOT NULL DEFAULT 'concept' CHECK (current_stage IN (
          'concept', 'research', 'development', 'testing', 'pilot', 'launch', 'scaling'
        )),
        success_probability DECIMAL(5,2) NOT NULL DEFAULT 50.0,
        market_potential DECIMAL(15,2) DEFAULT 0,
        competitive_advantage DECIMAL(5,2) DEFAULT 0,
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expected_completion TIMESTAMP,
        actual_completion TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
          'active', 'paused', 'cancelled', 'completed', 'failed'
        )),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_lifecycle_events_corporation 
      ON corporate_lifecycle_events(corporation_id);
      
      CREATE INDEX IF NOT EXISTS idx_lifecycle_events_type_date 
      ON corporate_lifecycle_events(type, event_date DESC);
      
      CREATE INDEX IF NOT EXISTS idx_merger_acquisitions_acquirer 
      ON merger_acquisitions(acquirer_id);
      
      CREATE INDEX IF NOT EXISTS idx_merger_acquisitions_target 
      ON merger_acquisitions(target_id);
      
      CREATE INDEX IF NOT EXISTS idx_merger_acquisitions_status 
      ON merger_acquisitions(status);
      
      CREATE INDEX IF NOT EXISTS idx_bankruptcy_events_corporation 
      ON bankruptcy_events(corporation_id);
      
      CREATE INDEX IF NOT EXISTS idx_bankruptcy_events_date 
      ON bankruptcy_events(filing_date DESC);
      
      CREATE INDEX IF NOT EXISTS idx_product_evolutions_corporation 
      ON product_evolutions(corporation_id);
      
      CREATE INDEX IF NOT EXISTS idx_product_evolutions_stage 
      ON product_evolutions(lifecycle_stage);
      
      CREATE INDEX IF NOT EXISTS idx_market_entries_corporation 
      ON market_entries(corporation_id);
      
      CREATE INDEX IF NOT EXISTS idx_market_entries_status 
      ON market_entries(status);
      
      CREATE INDEX IF NOT EXISTS idx_corporate_health_overall 
      ON corporate_health_assessments(overall_health DESC);
      
      CREATE INDEX IF NOT EXISTS idx_corporate_health_bankruptcy_risk 
      ON corporate_health_assessments(bankruptcy_risk DESC);
      
      CREATE INDEX IF NOT EXISTS idx_lifecycle_metrics_civilization 
      ON corporate_lifecycle_metrics(civilization_id, reporting_period DESC);
      
      CREATE INDEX IF NOT EXISTS idx_corporate_relationships_corp_a 
      ON corporate_relationships(corporation_a_id);
      
      CREATE INDEX IF NOT EXISTS idx_corporate_relationships_corp_b 
      ON corporate_relationships(corporation_b_id);
      
      CREATE INDEX IF NOT EXISTS idx_corporate_relationships_type 
      ON corporate_relationships(relationship_type);
      
      CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_corporation 
      ON corporate_innovation_pipeline(corporation_id);
      
      CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_stage 
      ON corporate_innovation_pipeline(current_stage);
      
      CREATE INDEX IF NOT EXISTS idx_innovation_pipeline_status 
      ON corporate_innovation_pipeline(status);
    `);

    await client.query('COMMIT');
    console.log('✅ Corporate Lifecycle schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Corporate Lifecycle schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Corporate Lifecycle Service - business logic layer
 */
export class CorporateLifecycleService {
  constructor(private pool: Pool) {}

  async getLifecycleEvents(
    corporationId?: number, 
    eventType?: string, 
    limit: number = 20
  ): Promise<CorporateLifecycleEvent[]> {
    let query = `
      SELECT * FROM corporate_lifecycle_events 
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (corporationId) {
      query += ` AND corporation_id = $${paramIndex++}`;
      params.push(corporationId);
    }

    if (eventType) {
      query += ` AND type = $${paramIndex++}`;
      params.push(eventType);
    }

    query += ` ORDER BY event_date DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getMergerAcquisitions(
    status?: string, 
    limit: number = 10
  ): Promise<MergerAcquisitionRecord[]> {
    let query = `
      SELECT ma.*, 
             ca.company_name as acquirer_name,
             ct.company_name as target_name
      FROM merger_acquisitions ma
      LEFT JOIN corporations ca ON ma.acquirer_id = ca.id
      LEFT JOIN corporations ct ON ma.target_id = ct.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND ma.status = $${paramIndex++}`;
      params.push(status);
    }

    query += ` ORDER BY ma.announcement_date DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getBankruptcyEvents(limit: number = 10): Promise<BankruptcyRecord[]> {
    const query = `
      SELECT be.*, c.company_name
      FROM bankruptcy_events be
      LEFT JOIN corporations c ON be.corporation_id = c.id
      ORDER BY be.filing_date DESC 
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    return result.rows;
  }

  async getProductEvolutions(
    corporationId?: number, 
    stage?: string, 
    limit: number = 10
  ): Promise<ProductEvolutionRecord[]> {
    let query = `
      SELECT pe.*, c.company_name
      FROM product_evolutions pe
      LEFT JOIN corporations c ON pe.corporation_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (corporationId) {
      query += ` AND pe.corporation_id = $${paramIndex++}`;
      params.push(corporationId);
    }

    if (stage) {
      query += ` AND pe.lifecycle_stage = $${paramIndex++}`;
      params.push(stage);
    }

    query += ` ORDER BY pe.launch_date DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getCorporateHealthSummary(civilizationId: number): Promise<{
    totalCorporations: number;
    averageHealth: number;
    highRiskCount: number;
    acquisitionTargets: number;
    innovationLeaders: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total_corporations,
        AVG(cha.overall_health) as average_health,
        COUNT(CASE WHEN cha.bankruptcy_risk > 70 THEN 1 END) as high_risk_count,
        COUNT(CASE WHEN cha.acquisition_attractiveness > 70 THEN 1 END) as acquisition_targets,
        COUNT(CASE WHEN cha.innovation_index > 80 THEN 1 END) as innovation_leaders
      FROM corporate_health_assessments cha
      JOIN corporations c ON cha.corporation_id = c.id
      WHERE c.civilization_id = $1 AND c.status = 'active'
    `;

    const result = await this.pool.query(query, [civilizationId]);
    const row = result.rows[0];

    return {
      totalCorporations: parseInt(row.total_corporations),
      averageHealth: parseFloat(row.average_health) || 0,
      highRiskCount: parseInt(row.high_risk_count),
      acquisitionTargets: parseInt(row.acquisition_targets),
      innovationLeaders: parseInt(row.innovation_leaders)
    };
  }

  async getLifecycleMetrics(civilizationId: number, months: number = 12): Promise<any[]> {
    const query = `
      SELECT * FROM corporate_lifecycle_metrics 
      WHERE civilization_id = $1 
        AND reporting_period >= NOW() - INTERVAL '${months} months'
      ORDER BY reporting_period DESC
    `;

    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async updateLifecycleMetrics(civilizationId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Calculate current metrics
      const metricsQuery = `
        SELECT 
          COUNT(DISTINCT c.id) as total_corporations,
          COUNT(DISTINCT CASE WHEN c.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN c.id END) as new_entrants,
          COUNT(DISTINCT CASE WHEN be.filing_date >= CURRENT_DATE - INTERVAL '30 days' THEN be.corporation_id END) as bankruptcies,
          COUNT(DISTINCT CASE WHEN ma.announcement_date >= CURRENT_DATE - INTERVAL '30 days' THEN ma.id END) as mergers_acquisitions,
          COUNT(DISTINCT CASE WHEN pe.launch_date >= CURRENT_DATE - INTERVAL '30 days' THEN pe.id END) as product_launches,
          COUNT(DISTINCT CASE WHEN me.entry_date >= CURRENT_DATE - INTERVAL '30 days' THEN me.id END) as market_entries,
          AVG(cha.overall_health) as average_health_score,
          AVG(cha.innovation_index) as innovation_index
        FROM corporations c
        LEFT JOIN bankruptcy_events be ON c.id = be.corporation_id
        LEFT JOIN merger_acquisitions ma ON c.id = ma.acquirer_id OR c.id = ma.target_id
        LEFT JOIN product_evolutions pe ON c.id = pe.corporation_id
        LEFT JOIN market_entries me ON c.id = me.corporation_id
        LEFT JOIN corporate_health_assessments cha ON c.id = cha.corporation_id
        WHERE c.civilization_id = $1
      `;

      const metricsResult = await client.query(metricsQuery, [civilizationId]);
      const metrics = metricsResult.rows[0];

      // Insert or update metrics
      const insertQuery = `
        INSERT INTO corporate_lifecycle_metrics (
          civilization_id, reporting_period, total_corporations, new_entrants,
          bankruptcies, mergers_acquisitions, product_launches, market_entries,
          average_health_score, innovation_index
        ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (civilization_id, reporting_period) DO UPDATE SET
          total_corporations = EXCLUDED.total_corporations,
          new_entrants = EXCLUDED.new_entrants,
          bankruptcies = EXCLUDED.bankruptcies,
          mergers_acquisitions = EXCLUDED.mergers_acquisitions,
          product_launches = EXCLUDED.product_launches,
          market_entries = EXCLUDED.market_entries,
          average_health_score = EXCLUDED.average_health_score,
          innovation_index = EXCLUDED.innovation_index
      `;

      await client.query(insertQuery, [
        civilizationId,
        parseInt(metrics.total_corporations) || 0,
        parseInt(metrics.new_entrants) || 0,
        parseInt(metrics.bankruptcies) || 0,
        parseInt(metrics.mergers_acquisitions) || 0,
        parseInt(metrics.product_launches) || 0,
        parseInt(metrics.market_entries) || 0,
        parseFloat(metrics.average_health_score) || 50,
        parseFloat(metrics.innovation_index) || 50
      ]);

    } finally {
      client.release();
    }
  }
}
