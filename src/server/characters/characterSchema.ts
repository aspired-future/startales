/**
 * Character Database Schema
 */

import { Pool } from 'pg';

export async function initializeCharacterSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('🎭 Initializing Character System database schema...');

    // Main characters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id VARCHAR(255) PRIMARY KEY,
        name JSONB NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        civilization_id INTEGER NOT NULL,
        planet_id INTEGER NOT NULL,
        city_id INTEGER,
        location JSONB NOT NULL,
        demographics JSONB NOT NULL,
        appearance JSONB NOT NULL,
        personality JSONB NOT NULL,
        attributes JSONB NOT NULL,
        profession JSONB NOT NULL,
        background JSONB NOT NULL,
        skills JSONB NOT NULL,
        social_media JSONB NOT NULL,
        opinions JSONB NOT NULL,
        status JSONB NOT NULL,
        ai_behavior JSONB NOT NULL,
        lifecycle JSONB NOT NULL,
        game_integration JSONB NOT NULL,
        metadata JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Character relationships table
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_relationships (
        id SERIAL PRIMARY KEY,
        character_id VARCHAR(255) NOT NULL,
        related_character_id VARCHAR(255) NOT NULL,
        relationship_type VARCHAR(100) NOT NULL,
        relationship_category VARCHAR(50) NOT NULL,
        strength INTEGER NOT NULL CHECK (strength >= -100 AND strength <= 100),
        history TEXT,
        current_status VARCHAR(100),
        last_interaction TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Character templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_templates (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        rarity VARCHAR(50) NOT NULL,
        base_attributes JSONB NOT NULL,
        profession_pool JSONB NOT NULL,
        skill_sets JSONB NOT NULL,
        personality_traits JSONB NOT NULL,
        emergence_conditions JSONB NOT NULL,
        story_importance INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_characters_civilization ON characters(civilization_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_characters_category ON characters(category)`);

    console.log('✅ Character System database schema initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing Character System schema:', error);
    throw error;
  } finally {
    client.release();
  }
}