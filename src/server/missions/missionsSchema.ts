/**
 * Database schema for Missions system
 */

import { Pool } from 'pg';

export async function initializeMissionsSchema(pool: Pool): Promise<void> {
  try {
    console.log('🎯 Initializing Missions schema...');

    // Create missions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS missions (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN (
          'exploration', 'diplomatic', 'military', 'economic', 
          'research', 'espionage', 'humanitarian', 'cultural'
        )),
        priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        status VARCHAR(20) NOT NULL CHECK (status IN (
          'available', 'active', 'completed', 'failed', 'cancelled', 'on_hold'
        )),
        difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
        
        -- Story Integration
        story_arc VARCHAR(255) NOT NULL,
        game_master_generated BOOLEAN DEFAULT false,
        story_context JSONB DEFAULT '{}',
        narrative_impact VARCHAR(20) CHECK (narrative_impact IN ('minor', 'moderate', 'major', 'pivotal')),
        
        -- Mission Details
        objectives JSONB DEFAULT '[]',
        rewards JSONB DEFAULT '[]',
        risks JSONB DEFAULT '[]',
        requirements JSONB DEFAULT '[]',
        
        -- Timing
        time_limit INTEGER, -- in game days
        estimated_duration INTEGER NOT NULL, -- in game days
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE,
        
        -- Progress
        progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        current_phase VARCHAR(100) DEFAULT 'available',
        assigned_characters JSONB DEFAULT '[]',
        assigned_fleets JSONB DEFAULT '[]',
        assigned_resources JSONB DEFAULT '{}',
        
        -- AI Integration
        ai_analysis JSONB,
        success_probability INTEGER DEFAULT 50 CHECK (success_probability BETWEEN 0 AND 100),
        game_master_notes TEXT DEFAULT ''
      );
    `);

    // Create mission templates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mission_templates (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN (
          'exploration', 'diplomatic', 'military', 'economic', 
          'research', 'espionage', 'humanitarian', 'cultural'
        )),
        difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
        template JSONB NOT NULL,
        story_triggers JSONB DEFAULT '[]',
        game_master_prompts JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create mission history table for tracking changes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mission_history (
        id SERIAL PRIMARY KEY,
        mission_id VARCHAR(255) NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        details JSONB DEFAULT '{}',
        performed_by VARCHAR(255),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_campaign_civ 
      ON missions(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_status 
      ON missions(status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_type 
      ON missions(type);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_priority 
      ON missions(priority);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_game_master 
      ON missions(game_master_generated);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_story_arc 
      ON missions(story_arc);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_missions_expires_at 
      ON missions(expires_at) WHERE expires_at IS NOT NULL;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_templates_type 
      ON mission_templates(type);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_history_mission 
      ON mission_history(mission_id);
    `);

    // Insert default mission templates
    await insertDefaultMissionTemplates(pool);

    console.log('✅ Missions schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Missions schema:', error);
    throw error;
  }
}

async function insertDefaultMissionTemplates(pool: Pool): Promise<void> {
  const templates = [
    {
      id: 'exploration_unknown_system',
      name: 'Explore Unknown System',
      type: 'exploration',
      difficulty: 2,
      template: {
        title: 'Explore the {systemName} System',
        description: 'Our long-range sensors have detected an unexplored star system. Send a fleet to investigate and catalog any planets, resources, or anomalies.',
        estimatedDuration: 15,
        objectives: [
          {
            id: 'scan_system',
            description: 'Perform detailed scans of all celestial bodies',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'catalog_resources',
            description: 'Identify and catalog available resources',
            type: 'secondary',
            status: 'pending',
            progress: 0
          }
        ],
        rewards: [
          {
            type: 'territory',
            description: 'Potential new system to colonize'
          },
          {
            type: 'resources',
            description: 'Discovery of new resource deposits'
          }
        ],
        risks: [
          {
            type: 'military',
            severity: 'low',
            probability: 20,
            description: 'Possible hostile alien presence'
          }
        ]
      },
      storyTriggers: ['expansion_phase', 'resource_shortage'],
      gameMasterPrompts: [
        'Generate unique system characteristics',
        'Create potential alien encounters',
        'Design resource distribution'
      ]
    },
    {
      id: 'diplomatic_first_contact',
      name: 'First Contact Protocol',
      type: 'diplomatic',
      difficulty: 3,
      template: {
        title: 'Establish Contact with {alienSpecies}',
        description: 'We have encountered a new alien civilization. Establish diplomatic relations and assess their intentions.',
        estimatedDuration: 30,
        objectives: [
          {
            id: 'establish_communication',
            description: 'Establish communication protocols',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'assess_intentions',
            description: 'Determine alien civilization intentions',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'cultural_exchange',
            description: 'Initiate cultural exchange programs',
            type: 'secondary',
            status: 'pending',
            progress: 0
          }
        ],
        rewards: [
          {
            type: 'reputation',
            description: 'Improved galactic standing'
          },
          {
            type: 'technology',
            description: 'Potential technology exchange'
          }
        ],
        risks: [
          {
            type: 'diplomatic',
            severity: 'medium',
            probability: 30,
            description: 'Misunderstanding could lead to conflict'
          }
        ]
      },
      storyTriggers: ['alien_encounter', 'expansion_contact'],
      gameMasterPrompts: [
        'Design alien civilization characteristics',
        'Create communication challenges',
        'Develop cultural differences'
      ]
    },
    {
      id: 'military_border_defense',
      name: 'Border Defense Operation',
      type: 'military',
      difficulty: 4,
      template: {
        title: 'Defend {borderSystem} from {enemyFaction}',
        description: 'Enemy forces are threatening our border systems. Deploy military assets to defend our territory.',
        estimatedDuration: 20,
        objectives: [
          {
            id: 'deploy_defenses',
            description: 'Deploy defensive fleets to border systems',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'repel_invasion',
            description: 'Repel enemy invasion forces',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'secure_border',
            description: 'Establish permanent border security',
            type: 'secondary',
            status: 'pending',
            progress: 0
          }
        ],
        rewards: [
          {
            type: 'territory',
            description: 'Secured border systems'
          },
          {
            type: 'reputation',
            description: 'Military reputation boost'
          }
        ],
        risks: [
          {
            type: 'military',
            severity: 'high',
            probability: 60,
            description: 'Significant fleet losses possible'
          }
        ]
      },
      storyTriggers: ['border_conflict', 'enemy_expansion'],
      gameMasterPrompts: [
        'Design enemy force composition',
        'Create tactical challenges',
        'Develop strategic consequences'
      ]
    },
    {
      id: 'research_ancient_artifact',
      name: 'Ancient Artifact Research',
      type: 'research',
      difficulty: 3,
      template: {
        title: 'Study the {artifactName}',
        description: 'An ancient artifact of unknown origin has been discovered. Research its properties and potential applications.',
        estimatedDuration: 45,
        objectives: [
          {
            id: 'initial_analysis',
            description: 'Perform initial scientific analysis',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'decode_technology',
            description: 'Attempt to decode alien technology',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'practical_application',
            description: 'Develop practical applications',
            type: 'secondary',
            status: 'pending',
            progress: 0
          }
        ],
        rewards: [
          {
            type: 'technology',
            description: 'Revolutionary new technology'
          },
          {
            type: 'special',
            description: 'Unique artifact abilities'
          }
        ],
        risks: [
          {
            type: 'technological',
            severity: 'medium',
            probability: 25,
            description: 'Artifact could be dangerous or unstable'
          }
        ]
      },
      storyTriggers: ['artifact_discovery', 'technology_gap'],
      gameMasterPrompts: [
        'Design artifact properties',
        'Create research challenges',
        'Develop technology implications'
      ]
    },
    {
      id: 'economic_trade_route',
      name: 'Establish Trade Route',
      type: 'economic',
      difficulty: 2,
      template: {
        title: 'Establish Trade Route to {destination}',
        description: 'Negotiate and establish a profitable trade route with a distant civilization or system.',
        estimatedDuration: 25,
        objectives: [
          {
            id: 'negotiate_terms',
            description: 'Negotiate favorable trade terms',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'secure_route',
            description: 'Ensure trade route security',
            type: 'primary',
            status: 'pending',
            progress: 0
          },
          {
            id: 'establish_infrastructure',
            description: 'Build necessary trade infrastructure',
            type: 'secondary',
            status: 'pending',
            progress: 0
          }
        ],
        rewards: [
          {
            type: 'resources',
            description: 'Steady income from trade'
          },
          {
            type: 'reputation',
            description: 'Improved economic standing'
          }
        ],
        risks: [
          {
            type: 'economic',
            severity: 'low',
            probability: 15,
            description: 'Market fluctuations could affect profitability'
          }
        ]
      },
      storyTriggers: ['economic_expansion', 'resource_needs'],
      gameMasterPrompts: [
        'Design trade opportunities',
        'Create market dynamics',
        'Develop economic consequences'
      ]
    }
  ];

  for (const template of templates) {
    await pool.query(`
      INSERT INTO mission_templates (
        id, name, type, difficulty, template, story_triggers, game_master_prompts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO NOTHING
    `, [
      template.id,
      template.name,
      template.type,
      template.difficulty,
      JSON.stringify(template.template),
      JSON.stringify(template.storyTriggers),
      JSON.stringify(template.gameMasterPrompts)
    ]);
  }

  console.log('✅ Default mission templates inserted');
}

export default initializeMissionsSchema;

