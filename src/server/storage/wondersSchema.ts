import { Pool } from 'pg';

export interface WorldWonder {
  id: string;
  campaign_id: number;
  wonder_type: WonderType;
  wonder_name: string;
  construction_status: ConstructionStatus;
  construction_phase: ConstructionPhase;
  completion_percentage: number;
  total_cost: ResourceCost;
  invested_resources: ResourceCost;
  construction_time_remaining: number;
  strategic_benefits: WonderBenefits;
  tourism_attraction_level: number;
  cultural_significance: number;
  started_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WonderConstruction {
  id: string;
  wonder_id: string;
  campaign_step: number;
  phase: ConstructionPhase;
  resources_invested: ResourceCost;
  progress_made: number;
  construction_events: ConstructionEvent[];
  created_at: Date;
}

export interface ConstructionEvent {
  event_type: 'resource_investment' | 'phase_completion' | 'construction_pause' | 'construction_resume' | 'rush_construction';
  resources?: ResourceCost;
  efficiency_modifier?: number;
  timestamp: Date;
}

export interface ResourceCost {
  [resource: string]: number;
}

export interface WonderBenefits {
  culture_bonus?: number;
  tourism_bonus?: number;
  happiness_bonus?: number;
  trade_efficiency?: number;
  research_bonus?: number;
  defense_bonus?: number;
  population_capacity?: number;
  technology_bonus?: number;
  information_efficiency?: number;
  prestige_bonus?: number;
}

export enum WonderType {
  // Ancient Wonders
  PYRAMIDS = 'pyramids',
  TEMPLES = 'temples',
  COLOSSUS = 'colossus',
  
  // Engineering Marvels
  AQUEDUCTS = 'aqueducts',
  GREAT_WALL = 'great_wall',
  TRADE_ROADS = 'trade_roads',
  
  // Cultural Icons
  GREAT_LIBRARY = 'great_library',
  NATIONAL_THEATER = 'national_theater',
  
  // Modern Achievements
  SPACE_CENTER = 'space_center',
  DIGITAL_NETWORK = 'digital_network'
}

export enum WonderCategory {
  ANCIENT = 'ancient',
  ENGINEERING = 'engineering', 
  CULTURAL = 'cultural',
  MODERN = 'modern'
}

export enum ConstructionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ConstructionPhase {
  PLANNING = 'planning',
  FOUNDATION = 'foundation',
  STRUCTURE = 'structure',
  DETAILS = 'details',
  COMPLETION = 'completion'
}

export class WondersSchema {
  constructor(private pool: Pool) {}

  async initializeTables(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // World Wonders main table
      await client.query(`
        CREATE TABLE IF NOT EXISTS world_wonders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          wonder_type VARCHAR(50) NOT NULL,
          wonder_name VARCHAR(200) NOT NULL,
          construction_status VARCHAR(20) NOT NULL DEFAULT 'not_started',
          construction_phase VARCHAR(20) NOT NULL DEFAULT 'planning',
          completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          total_cost JSONB NOT NULL,
          invested_resources JSONB NOT NULL DEFAULT '{}',
          construction_time_remaining INTEGER NOT NULL DEFAULT 0,
          strategic_benefits JSONB NOT NULL DEFAULT '{}',
          tourism_attraction_level INTEGER NOT NULL DEFAULT 0,
          cultural_significance INTEGER NOT NULL DEFAULT 0,
          started_at TIMESTAMP,
          completed_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          CONSTRAINT valid_completion_percentage 
            CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
          CONSTRAINT valid_construction_status 
            CHECK (construction_status IN ('not_started', 'in_progress', 'paused', 'completed', 'cancelled')),
          CONSTRAINT valid_construction_phase 
            CHECK (construction_phase IN ('planning', 'foundation', 'structure', 'details', 'completion'))
        );
      `);

      // Wonder Construction Progress tracking
      await client.query(`
        CREATE TABLE IF NOT EXISTS wonder_construction_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          wonder_id UUID NOT NULL REFERENCES world_wonders(id) ON DELETE CASCADE,
          campaign_step INTEGER NOT NULL,
          phase VARCHAR(20) NOT NULL,
          resources_invested JSONB NOT NULL DEFAULT '{}',
          progress_made DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          construction_events JSONB NOT NULL DEFAULT '[]',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(wonder_id, campaign_step)
        );
      `);

      // Wonder Benefits Templates (static data)
      await client.query(`
        CREATE TABLE IF NOT EXISTS wonder_templates (
          wonder_type VARCHAR(50) PRIMARY KEY,
          wonder_category VARCHAR(20) NOT NULL,
          display_name VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          base_cost JSONB NOT NULL,
          construction_time_steps INTEGER NOT NULL,
          strategic_benefits JSONB NOT NULL,
          tourism_base_value INTEGER NOT NULL DEFAULT 0,
          cultural_base_value INTEGER NOT NULL DEFAULT 0,
          unlock_requirements JSONB NOT NULL DEFAULT '{}',
          
          CONSTRAINT valid_wonder_category 
            CHECK (wonder_category IN ('ancient', 'engineering', 'cultural', 'modern'))
        );
      `);

      // Indexes for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_world_wonders_campaign 
          ON world_wonders(campaign_id);
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_world_wonders_status 
          ON world_wonders(construction_status);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_wonder_progress_wonder 
          ON wonder_construction_progress(wonder_id);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_wonder_progress_step 
          ON wonder_construction_progress(campaign_step);
      `);

      // Update trigger for world_wonders
      await client.query(`
        CREATE OR REPLACE FUNCTION update_wonder_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_wonder_updated_at ON world_wonders;
        CREATE TRIGGER trigger_update_wonder_updated_at
          BEFORE UPDATE ON world_wonders
          FOR EACH ROW
          EXECUTE FUNCTION update_wonder_updated_at();
      `);

      await client.query('COMMIT');
      console.log('✅ World Wonders database schema initialized');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to initialize World Wonders schema:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async seedWonderTemplates(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const wonderTemplates = [
        // Ancient Wonders
        {
          wonder_type: 'pyramids',
          wonder_category: 'ancient',
          display_name: 'Great Pyramids',
          description: 'Massive stone monuments that inspire awe and attract tourists from across the galaxy.',
          base_cost: { stone: 5000, labor: 3000, gold: 1000 },
          construction_time_steps: 15,
          strategic_benefits: { culture_bonus: 25, tourism_bonus: 40, prestige_bonus: 30 },
          tourism_base_value: 40,
          cultural_base_value: 25
        },
        {
          wonder_type: 'temples',
          wonder_category: 'ancient', 
          display_name: 'Sacred Temples',
          description: 'Magnificent religious complexes that boost happiness and cultural stability.',
          base_cost: { stone: 3000, gold: 2000, crystals: 500 },
          construction_time_steps: 12,
          strategic_benefits: { happiness_bonus: 30, culture_bonus: 20, tourism_bonus: 15 },
          tourism_base_value: 15,
          cultural_base_value: 20
        },
        {
          wonder_type: 'colossus',
          wonder_category: 'ancient',
          display_name: 'Colossus of Trade',
          description: 'Towering statue overlooking the spaceport, symbolizing economic prosperity.',
          base_cost: { metal: 4000, gold: 3000, energy: 1500 },
          construction_time_steps: 18,
          strategic_benefits: { trade_efficiency: 35, tourism_bonus: 25, prestige_bonus: 20 },
          tourism_base_value: 25,
          cultural_base_value: 15
        },
        
        // Engineering Marvels
        {
          wonder_type: 'aqueducts',
          wonder_category: 'engineering',
          display_name: 'Planetary Aqueduct System',
          description: 'Advanced water distribution network supporting massive population growth.',
          base_cost: { metal: 6000, concrete: 4000, technology: 2000 },
          construction_time_steps: 20,
          strategic_benefits: { population_capacity: 50, happiness_bonus: 15, tourism_bonus: 10 },
          tourism_base_value: 10,
          cultural_base_value: 10
        },
        {
          wonder_type: 'great_wall',
          wonder_category: 'engineering',
          display_name: 'Planetary Defense Grid',
          description: 'Massive defensive installation protecting the civilization from external threats.',
          base_cost: { metal: 8000, technology: 3000, energy: 2500 },
          construction_time_steps: 25,
          strategic_benefits: { defense_bonus: 60, tourism_bonus: 20, prestige_bonus: 25 },
          tourism_base_value: 20,
          cultural_base_value: 15
        },
        {
          wonder_type: 'trade_roads',
          wonder_category: 'engineering',
          display_name: 'Galactic Trade Network',
          description: 'Sophisticated transportation infrastructure connecting all major trade routes.',
          base_cost: { metal: 5000, technology: 4000, energy: 3000 },
          construction_time_steps: 22,
          strategic_benefits: { trade_efficiency: 45, tourism_bonus: 15 },
          tourism_base_value: 15,
          cultural_base_value: 5
        },
        
        // Cultural Icons
        {
          wonder_type: 'great_library',
          wonder_category: 'cultural',
          display_name: 'Universal Knowledge Archive',
          description: 'Vast repository of galactic knowledge advancing research and education.',
          base_cost: { technology: 6000, crystals: 3000, gold: 2000 },
          construction_time_steps: 18,
          strategic_benefits: { research_bonus: 50, culture_bonus: 30, tourism_bonus: 20 },
          tourism_base_value: 20,
          cultural_base_value: 30
        },
        {
          wonder_type: 'national_theater',
          wonder_category: 'cultural',
          display_name: 'Grand Cultural Center',
          description: 'Spectacular entertainment complex showcasing the finest arts and performances.',
          base_cost: { gold: 4000, crystals: 2000, labor: 3000 },
          construction_time_steps: 14,
          strategic_benefits: { culture_bonus: 40, happiness_bonus: 25, tourism_bonus: 35 },
          tourism_base_value: 35,
          cultural_base_value: 40
        },
        
        // Modern Achievements  
        {
          wonder_type: 'space_center',
          wonder_category: 'modern',
          display_name: 'Galactic Space Center',
          description: 'Advanced spaceport and research facility pushing the boundaries of technology.',
          base_cost: { technology: 10000, metal: 6000, energy: 5000, crystals: 3000 },
          construction_time_steps: 30,
          strategic_benefits: { technology_bonus: 60, research_bonus: 40, prestige_bonus: 50, tourism_bonus: 30 },
          tourism_base_value: 30,
          cultural_base_value: 20
        },
        {
          wonder_type: 'digital_network',
          wonder_category: 'modern',
          display_name: 'Quantum Information Grid',
          description: 'Planetary-scale quantum network revolutionizing communication and computation.',
          base_cost: { technology: 8000, energy: 6000, crystals: 4000 },
          construction_time_steps: 25,
          strategic_benefits: { information_efficiency: 70, technology_bonus: 30, trade_efficiency: 20 },
          tourism_base_value: 15,
          cultural_base_value: 10
        }
      ];

      for (const template of wonderTemplates) {
        await client.query(`
          INSERT INTO wonder_templates (
            wonder_type, wonder_category, display_name, description, 
            base_cost, construction_time_steps, strategic_benefits,
            tourism_base_value, cultural_base_value
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (wonder_type) DO UPDATE SET
            wonder_category = EXCLUDED.wonder_category,
            display_name = EXCLUDED.display_name,
            description = EXCLUDED.description,
            base_cost = EXCLUDED.base_cost,
            construction_time_steps = EXCLUDED.construction_time_steps,
            strategic_benefits = EXCLUDED.strategic_benefits,
            tourism_base_value = EXCLUDED.tourism_base_value,
            cultural_base_value = EXCLUDED.cultural_base_value
        `, [
          template.wonder_type,
          template.wonder_category,
          template.display_name,
          template.description,
          JSON.stringify(template.base_cost),
          template.construction_time_steps,
          JSON.stringify(template.strategic_benefits),
          template.tourism_base_value,
          template.cultural_base_value
        ]);
      }

      await client.query('COMMIT');
      console.log('✅ World Wonders templates seeded successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to seed wonder templates:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
