/**
 * Database Schema for Sim Engine Systems
 * Tables for telemetry, learning patterns, and knob adjustments
 */

import { Pool } from 'pg';

export async function initializeSimEngineSchema(pool: Pool): Promise<void> {
  console.log('🤖 Initializing Sim Engine database schema...');

  try {
    // Create knob_adjustments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS knob_adjustments (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        api_name VARCHAR(255) NOT NULL,
        knob_name VARCHAR(255) NOT NULL,
        old_value DECIMAL(10,2) NOT NULL,
        new_value DECIMAL(10,2) NOT NULL,
        reason TEXT,
        confidence DECIMAL(3,2) DEFAULT 0.5,
        expected_impact TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create telemetry_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        api_name VARCHAR(255) NOT NULL,
        knob_name VARCHAR(255),
        value DECIMAL(10,4),
        metadata JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create game_outcomes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_outcomes (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        outcome_type VARCHAR(100) NOT NULL,
        value DECIMAL(10,4) NOT NULL,
        related_knobs JSONB,
        metadata JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create learning_patterns table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_patterns (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        pattern_type VARCHAR(100) NOT NULL,
        api_name VARCHAR(255) NOT NULL,
        knob_name VARCHAR(255),
        pattern JSONB NOT NULL,
        confidence DECIMAL(3,2) DEFAULT 0.5,
        success_rate DECIMAL(3,2) DEFAULT 0.5,
        sample_size INTEGER DEFAULT 1,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create optimization_suggestions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS optimization_suggestions (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        api_name VARCHAR(255) NOT NULL,
        knob_name VARCHAR(255) NOT NULL,
        current_value DECIMAL(10,2) NOT NULL,
        suggested_value DECIMAL(10,2) NOT NULL,
        reason TEXT,
        expected_improvement DECIMAL(3,2),
        confidence DECIMAL(3,2) DEFAULT 0.5,
        based_on_patterns JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        applied_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create performance_metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        api_name VARCHAR(255) NOT NULL,
        knob_name VARCHAR(255) NOT NULL,
        effectiveness DECIMAL(3,2) NOT NULL,
        stability_impact DECIMAL(3,2) DEFAULT 0,
        economic_impact DECIMAL(3,2) DEFAULT 0,
        social_impact DECIMAL(3,2) DEFAULT 0,
        sample_size INTEGER DEFAULT 1,
        confidence_level DECIMAL(3,2) DEFAULT 0.5,
        measurement_period_hours INTEGER DEFAULT 24,
        measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        UNIQUE (civilization_id, api_name, knob_name, measured_at)
      )
    `);

    // Create simulation_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS simulation_sessions (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        player_id VARCHAR(255),
        session_status VARCHAR(50) DEFAULT 'active',
        game_state JSONB,
        knob_states JSONB,
        performance_summary JSONB,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ended_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes (individual statements to avoid syntax issues)
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_knob_adjustments_civ_api ON knob_adjustments (civilization_id, api_name)',
      'CREATE INDEX IF NOT EXISTS idx_knob_adjustments_timestamp ON knob_adjustments (timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_knob_adjustments_knob ON knob_adjustments (api_name, knob_name)',
      'CREATE INDEX IF NOT EXISTS idx_telemetry_events_civ ON telemetry_events (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_telemetry_events_type ON telemetry_events (event_type)',
      'CREATE INDEX IF NOT EXISTS idx_telemetry_events_timestamp ON telemetry_events (timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_telemetry_events_api ON telemetry_events (api_name, knob_name)',
      'CREATE INDEX IF NOT EXISTS idx_game_outcomes_civ ON game_outcomes (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_game_outcomes_type ON game_outcomes (outcome_type)',
      'CREATE INDEX IF NOT EXISTS idx_game_outcomes_timestamp ON game_outcomes (timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_game_outcomes_knobs ON game_outcomes USING GIN (related_knobs)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_civ ON learning_patterns (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_type ON learning_patterns (pattern_type)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_api ON learning_patterns (api_name, knob_name)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_confidence ON learning_patterns (confidence)',
      'CREATE INDEX IF NOT EXISTS idx_learning_patterns_success ON learning_patterns (success_rate)',
      'CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_civ ON optimization_suggestions (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_api ON optimization_suggestions (api_name, knob_name)',
      'CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_status ON optimization_suggestions (status)',
      'CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_created ON optimization_suggestions (created_at)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_civ ON performance_metrics (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_api ON performance_metrics (api_name, knob_name)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_effectiveness ON performance_metrics (effectiveness)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_measured ON performance_metrics (measured_at)',
      'CREATE INDEX IF NOT EXISTS idx_simulation_sessions_campaign ON simulation_sessions (campaign_id)',
      'CREATE INDEX IF NOT EXISTS idx_simulation_sessions_civ ON simulation_sessions (civilization_id)',
      'CREATE INDEX IF NOT EXISTS idx_simulation_sessions_player ON simulation_sessions (player_id)',
      'CREATE INDEX IF NOT EXISTS idx_simulation_sessions_status ON simulation_sessions (session_status)',
      'CREATE INDEX IF NOT EXISTS idx_simulation_sessions_activity ON simulation_sessions (last_activity)'
    ];

    for (const indexQuery of indexes) {
      try {
        await pool.query(indexQuery);
      } catch (error) {
        console.log(`Note: Index creation skipped (${error.message})`);
      }
    }

    // Insert initial seed data for testing
    await insertSimEngineTestData(pool);

    console.log('✅ Sim Engine database schema initialized successfully');

  } catch (error) {
    console.error('❌ Sim Engine schema initialization failed:', error);
    throw error;
  }
}

/**
 * Insert test data for sim engine systems
 */
async function insertSimEngineTestData(pool: Pool): Promise<void> {
  try {
    // Insert sample simulation session
    await pool.query(`
      INSERT INTO simulation_sessions (
        id, campaign_id, civilization_id, player_id, 
        game_state, knob_states, performance_summary
      ) VALUES (
        'sim_session_test_001',
        '1',
        '1',
        'player_001',
        '{"phase": "early_game", "turn": 45, "year": 2157}',
        '{"government-types.legitimacyDecayRate": 5, "government-contracts.competitiveBiddingRate": 85}',
        '{"averageEffectiveness": 0.75, "totalAdjustments": 12, "successfulOptimizations": 8}'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    // Insert sample knob adjustment
    await pool.query(`
      INSERT INTO knob_adjustments (
        civilization_id, api_name, knob_name, old_value, new_value,
        reason, confidence, expected_impact
      ) VALUES (
        '1',
        'government-types',
        'legitimacyDecayRate',
        10.0,
        5.0,
        'Reducing legitimacy decay due to stability concerns',
        0.85,
        'Should improve government stability over time'
      )
      ON CONFLICT DO NOTHING
    `);

    // Insert sample telemetry event
    await pool.query(`
      INSERT INTO telemetry_events (
        id, civilization_id, event_type, api_name, knob_name,
        value, metadata
      ) VALUES (
        'telemetry_test_001',
        '1',
        'knob_adjustment',
        'government-types',
        'legitimacyDecayRate',
        5.0,
        '{"adjustment_type": "auto", "trigger": "stability_analysis", "previous_effectiveness": 0.65}'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    // Insert sample game outcome
    await pool.query(`
      INSERT INTO game_outcomes (
        civilization_id, outcome_type, value, related_knobs, metadata
      ) VALUES (
        '1',
        'stability_change',
        0.15,
        '["government-types.legitimacyDecayRate", "government-types.stabilityVolatility"]',
        '{"trigger_event": "policy_change", "duration_hours": 2, "impact_strength": "moderate"}'
      )
    `);

    // Insert sample learning pattern
    await pool.query(`
      INSERT INTO learning_patterns (
        id, civilization_id, pattern_type, api_name, knob_name,
        pattern, confidence, success_rate, sample_size
      ) VALUES (
        'pattern_test_001',
        '1',
        'successful_sequence',
        'government-types',
        'legitimacyDecayRate',
        '{"adjustment": {"oldValue": 10, "newValue": 5, "delta": -5}, "context": {"gamePhase": "early", "stabilityScore": 68}}',
        0.85,
        0.78,
        5
      )
      ON CONFLICT (id) DO NOTHING
    `);

    // Insert sample optimization suggestion
    await pool.query(`
      INSERT INTO optimization_suggestions (
        civilization_id, api_name, knob_name, current_value, suggested_value,
        reason, expected_improvement, confidence, based_on_patterns
      ) VALUES (
        '1',
        'government-contracts',
        'competitiveBiddingRate',
        70.0,
        85.0,
        'Historical data shows higher competitive bidding rates improve contract performance',
        0.12,
        0.78,
        '["pattern_test_001", "correlation_analysis_002"]'
      )
    `);

    // Insert sample performance metrics
    await pool.query(`
      INSERT INTO performance_metrics (
        civilization_id, api_name, knob_name, effectiveness,
        stability_impact, economic_impact, social_impact,
        sample_size, confidence_level, measurement_period_hours
      ) VALUES (
        '1',
        'government-types',
        'legitimacyDecayRate',
        0.78,
        0.15,
        0.08,
        0.12,
        8,
        0.82,
        24
      )
      ON CONFLICT (civilization_id, api_name, knob_name, measured_at) DO NOTHING
    `);

    console.log('📋 Sim Engine test data inserted successfully');

  } catch (error) {
    console.error('Error inserting sim engine test data:', error);
    // Don't throw - test data insertion is not critical
  }
}

/**
 * Clean up old telemetry data (for maintenance)
 */
export async function cleanupOldTelemetryData(pool: Pool, daysToKeep: number = 30): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Clean up old telemetry events
    const telemetryResult = await pool.query(`
      DELETE FROM telemetry_events 
      WHERE created_at < $1
    `, [cutoffDate]);

    // Clean up old game outcomes
    const outcomesResult = await pool.query(`
      DELETE FROM game_outcomes 
      WHERE created_at < $1
    `, [cutoffDate]);

    // Clean up old performance metrics (keep more recent ones)
    const metricsResult = await pool.query(`
      DELETE FROM performance_metrics 
      WHERE created_at < $1
    `, [new Date(cutoffDate.getTime() - (7 * 24 * 60 * 60 * 1000))]); // Keep 7 extra days

    console.log(`🧹 Cleaned up old telemetry data: ${telemetryResult.rowCount} events, ${outcomesResult.rowCount} outcomes, ${metricsResult.rowCount} metrics`);

  } catch (error) {
    console.error('Error cleaning up old telemetry data:', error);
    throw error;
  }
}

/**
 * Get telemetry statistics
 */
export async function getTelemetryStats(pool: Pool): Promise<any> {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM knob_adjustments) as total_adjustments,
        (SELECT COUNT(*) FROM telemetry_events) as total_events,
        (SELECT COUNT(*) FROM game_outcomes) as total_outcomes,
        (SELECT COUNT(*) FROM learning_patterns) as total_patterns,
        (SELECT COUNT(*) FROM optimization_suggestions WHERE status = 'pending') as pending_suggestions,
        (SELECT COUNT(*) FROM performance_metrics) as total_metrics,
        (SELECT COUNT(*) FROM simulation_sessions WHERE session_status = 'active') as active_sessions
    `);

    return stats.rows[0];

  } catch (error) {
    console.error('Error getting telemetry stats:', error);
    return {
      total_adjustments: 0,
      total_events: 0,
      total_outcomes: 0,
      total_patterns: 0,
      pending_suggestions: 0,
      total_metrics: 0,
      active_sessions: 0
    };
  }
}

export default {
  initializeSimEngineSchema,
  cleanupOldTelemetryData,
  getTelemetryStats
};
