/**
 * City Emergence Database Schema
 * 
 * Database tables and initialization for the City Emergence System
 */

import { Pool } from 'pg';

export interface CityEmergenceHistory {
  id: number;
  civilization_id: number;
  city_name: string;
  city_id: string;
  emergence_condition_id: string;
  emergence_reason: string;
  founded_date: Date;
  initial_population: number;
  location_x: number;
  location_y: number;
  terrain: string;
  climate: string;
  success_metrics?: any;
  created_at: Date;
}

export interface EmergenceConditionConfig {
  id: number;
  condition_id: string;
  civilization_id: number;
  is_enabled: boolean;
  priority_modifier: number;
  custom_requirements?: any;
  last_triggered?: Date;
  trigger_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CivilizationExpansionMetrics {
  id: number;
  civilization_id: number;
  evaluation_date: Date;
  current_cities: number;
  total_population: number;
  economic_output: number;
  expansion_pressure: number;
  available_territory: number;
  technology_level: number;
  months_since_last_expansion: number;
  expansion_readiness_score: number;
  recommended_action: string;
  created_at: Date;
}

/**
 * Initialize City Emergence database schema
 */
export async function initializeCityEmergenceSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // City Emergence History - tracks all city emergences
    await client.query(`
      CREATE TABLE IF NOT EXISTS city_emergence_history (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        city_name VARCHAR(255) NOT NULL,
        city_id VARCHAR(255) NOT NULL,
        emergence_condition_id VARCHAR(100) NOT NULL,
        emergence_reason TEXT NOT NULL,
        founded_date TIMESTAMP NOT NULL DEFAULT NOW(),
        initial_population INTEGER NOT NULL DEFAULT 0,
        location_x DECIMAL(10,2) NOT NULL,
        location_y DECIMAL(10,2) NOT NULL,
        terrain VARCHAR(50) NOT NULL,
        climate VARCHAR(50) NOT NULL,
        success_metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Emergence Condition Configuration - per-civilization settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS emergence_condition_config (
        id SERIAL PRIMARY KEY,
        condition_id VARCHAR(100) NOT NULL,
        civilization_id INTEGER NOT NULL,
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        priority_modifier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
        custom_requirements JSONB DEFAULT '{}',
        last_triggered TIMESTAMP,
        trigger_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(condition_id, civilization_id)
      );
    `);

    // Civilization Expansion Metrics - tracks expansion readiness
    await client.query(`
      CREATE TABLE IF NOT EXISTS civilization_expansion_metrics (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        evaluation_date TIMESTAMP NOT NULL DEFAULT NOW(),
        current_cities INTEGER NOT NULL DEFAULT 0,
        total_population BIGINT NOT NULL DEFAULT 0,
        economic_output DECIMAL(20,2) NOT NULL DEFAULT 0,
        expansion_pressure DECIMAL(5,2) NOT NULL DEFAULT 0,
        available_territory DECIMAL(10,2) NOT NULL DEFAULT 0,
        technology_level DECIMAL(5,2) NOT NULL DEFAULT 1.0,
        months_since_last_expansion INTEGER NOT NULL DEFAULT 0,
        expansion_readiness_score DECIMAL(5,2) NOT NULL DEFAULT 0,
        recommended_action TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Potential Emergence Locations - scouted locations for future cities
    await client.query(`
      CREATE TABLE IF NOT EXISTS potential_emergence_locations (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        location_x DECIMAL(10,2) NOT NULL,
        location_y DECIMAL(10,2) NOT NULL,
        terrain VARCHAR(50) NOT NULL,
        climate VARCHAR(50) NOT NULL,
        suitability_score DECIMAL(5,2) NOT NULL,
        strategic_value DECIMAL(5,2) NOT NULL,
        nearby_resources JSONB DEFAULT '[]',
        distance_to_nearest_city DECIMAL(10,2) NOT NULL,
        emergence_reasons JSONB DEFAULT '[]',
        scouted_date TIMESTAMP NOT NULL DEFAULT NOW(),
        is_reserved BOOLEAN NOT NULL DEFAULT false,
        reserved_for_condition VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // City Development Triggers - events that can trigger city emergence
    await client.query(`
      CREATE TABLE IF NOT EXISTS city_development_triggers (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        trigger_type VARCHAR(100) NOT NULL,
        trigger_description TEXT NOT NULL,
        trigger_data JSONB NOT NULL DEFAULT '{}',
        priority INTEGER NOT NULL DEFAULT 5,
        is_active BOOLEAN NOT NULL DEFAULT true,
        conditions_met BOOLEAN NOT NULL DEFAULT false,
        last_evaluated TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        triggered_at TIMESTAMP,
        resulting_city_id VARCHAR(255)
      );
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_city_emergence_civilization 
      ON city_emergence_history(civilization_id);
      
      CREATE INDEX IF NOT EXISTS idx_city_emergence_date 
      ON city_emergence_history(founded_date DESC);
      
      CREATE INDEX IF NOT EXISTS idx_emergence_condition_config_civ 
      ON emergence_condition_config(civilization_id);
      
      CREATE INDEX IF NOT EXISTS idx_expansion_metrics_civ_date 
      ON civilization_expansion_metrics(civilization_id, evaluation_date DESC);
      
      CREATE INDEX IF NOT EXISTS idx_potential_locations_civ 
      ON potential_emergence_locations(civilization_id);
      
      CREATE INDEX IF NOT EXISTS idx_potential_locations_suitability 
      ON potential_emergence_locations(suitability_score DESC);
      
      CREATE INDEX IF NOT EXISTS idx_development_triggers_civ 
      ON city_development_triggers(civilization_id);
      
      CREATE INDEX IF NOT EXISTS idx_development_triggers_active 
      ON city_development_triggers(is_active, conditions_met);
    `);

    // Insert default emergence conditions for all civilizations
    await client.query(`
      INSERT INTO emergence_condition_config (condition_id, civilization_id, is_enabled, priority_modifier)
      SELECT condition_id, civilization_id, true, 1.00
      FROM (VALUES 
        ('population_overflow'),
        ('economic_boom'),
        ('resource_discovery'),
        ('trade_hub_opportunity'),
        ('technological_advancement'),
        ('strategic_expansion')
      ) AS conditions(condition_id)
      CROSS JOIN (
        SELECT DISTINCT civilization_id 
        FROM city_markets 
        WHERE civilization_id IS NOT NULL
        UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      ) AS civs(civilization_id)
      ON CONFLICT (condition_id, civilization_id) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ City Emergence schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ City Emergence schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * City Emergence Service - business logic layer
 */
export class CityEmergenceService {
  constructor(private pool: Pool) {}

  async getEmergenceHistory(civilizationId: number, limit: number = 10): Promise<CityEmergenceHistory[]> {
    const query = `
      SELECT * FROM city_emergence_history 
      WHERE civilization_id = $1 
      ORDER BY founded_date DESC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [civilizationId, limit]);
    return result.rows;
  }

  async getExpansionMetrics(civilizationId: number): Promise<CivilizationExpansionMetrics | null> {
    const query = `
      SELECT * FROM civilization_expansion_metrics 
      WHERE civilization_id = $1 
      ORDER BY evaluation_date DESC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows[0] || null;
  }

  async updateEmergenceCondition(
    civilizationId: number,
    conditionId: string,
    updates: {
      isEnabled?: boolean;
      priorityModifier?: number;
      customRequirements?: any;
    }
  ): Promise<EmergenceConditionConfig | null> {
    const client = await this.pool.connect();
    
    try {
      const updateFields = [];
      const values = [civilizationId, conditionId];
      let paramIndex = 3;

      if (updates.isEnabled !== undefined) {
        updateFields.push(`is_enabled = $${paramIndex++}`);
        values.push(updates.isEnabled);
      }
      
      if (updates.priorityModifier !== undefined) {
        updateFields.push(`priority_modifier = $${paramIndex++}`);
        values.push(updates.priorityModifier);
      }
      
      if (updates.customRequirements !== undefined) {
        updateFields.push(`custom_requirements = $${paramIndex++}`);
        values.push(JSON.stringify(updates.customRequirements));
      }

      if (updateFields.length === 0) return null;

      updateFields.push(`updated_at = NOW()`);

      const query = `
        UPDATE emergence_condition_config 
        SET ${updateFields.join(', ')}
        WHERE civilization_id = $1 AND condition_id = $2
        RETURNING *
      `;

      const result = await client.query(query, values);
      return result.rows[0] || null;

    } finally {
      client.release();
    }
  }

  async getPotentialLocations(civilizationId: number, limit: number = 5): Promise<any[]> {
    const query = `
      SELECT * FROM potential_emergence_locations 
      WHERE civilization_id = $1 AND NOT is_reserved
      ORDER BY suitability_score DESC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [civilizationId, limit]);
    return result.rows;
  }

  async recordExpansionMetrics(metrics: Omit<CivilizationExpansionMetrics, 'id' | 'created_at'>): Promise<void> {
    const query = `
      INSERT INTO civilization_expansion_metrics (
        civilization_id, evaluation_date, current_cities, total_population,
        economic_output, expansion_pressure, available_territory, technology_level,
        months_since_last_expansion, expansion_readiness_score, recommended_action
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await this.pool.query(query, [
      metrics.civilization_id,
      metrics.evaluation_date,
      metrics.current_cities,
      metrics.total_population,
      metrics.economic_output,
      metrics.expansion_pressure,
      metrics.available_territory,
      metrics.technology_level,
      metrics.months_since_last_expansion,
      metrics.expansion_readiness_score,
      metrics.recommended_action
    ]);
  }
}
