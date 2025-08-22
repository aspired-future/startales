import { Pool } from 'pg';

/**
 * Initialize Government Types database schema
 */
export async function initializeGovernmentTypesSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Government Types table
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_types (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        ideology VARCHAR(50) NOT NULL,
        
        -- Core Characteristics
        power_structure VARCHAR(20) CHECK (power_structure IN ('centralized', 'distributed', 'mixed')),
        legitimacy_source VARCHAR(30) CHECK (legitimacy_source IN ('divine_right', 'popular_mandate', 'party_ideology', 'tradition', 'force')),
        succession_method VARCHAR(30) CHECK (succession_method IN ('hereditary', 'election', 'appointment', 'revolution', 'meritocracy')),
        
        -- Decision Making
        decision_speed INTEGER CHECK (decision_speed BETWEEN 1 AND 10),
        public_approval_required BOOLEAN DEFAULT FALSE,
        legislative_override BOOLEAN DEFAULT FALSE,
        
        -- Economic Control
        economic_control INTEGER CHECK (economic_control BETWEEN 0 AND 100),
        resource_allocation VARCHAR(20) CHECK (resource_allocation IN ('market', 'central_planning', 'mixed')),
        private_property_rights INTEGER CHECK (private_property_rights BETWEEN 0 AND 100),
        
        -- Social Control
        media_control INTEGER CHECK (media_control BETWEEN 0 AND 100),
        civil_liberties INTEGER CHECK (civil_liberties BETWEEN 0 AND 100),
        cultural_control INTEGER CHECK (cultural_control BETWEEN 0 AND 100),
        
        -- Stability Factors
        stability_factors JSONB NOT NULL DEFAULT '{}',
        
        -- Advantages and Disadvantages
        advantages JSONB NOT NULL DEFAULT '[]',
        disadvantages JSONB NOT NULL DEFAULT '[]',
        
        -- Transition Mechanics
        transition_from JSONB NOT NULL DEFAULT '[]',
        transition_to JSONB NOT NULL DEFAULT '[]',
        transition_requirements JSONB NOT NULL DEFAULT '{}',
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Civilization Governments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS civilization_governments (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        government_type_id VARCHAR(50) REFERENCES government_types(id),
        
        -- Current Status
        established_date TIMESTAMP NOT NULL DEFAULT NOW(),
        current_leader VARCHAR(100) NOT NULL,
        legitimacy INTEGER CHECK (legitimacy BETWEEN 0 AND 100) DEFAULT 50,
        stability INTEGER CHECK (stability BETWEEN 0 AND 100) DEFAULT 50,
        
        -- Government Specific Data
        government_data JSONB NOT NULL DEFAULT '{}',
        
        -- Performance Metrics
        decision_efficiency INTEGER CHECK (decision_efficiency BETWEEN 0 AND 100) DEFAULT 50,
        public_satisfaction INTEGER CHECK (public_satisfaction BETWEEN 0 AND 100) DEFAULT 50,
        economic_performance INTEGER CHECK (economic_performance BETWEEN 0 AND 100) DEFAULT 50,
        
        -- Transition History
        previous_governments JSONB NOT NULL DEFAULT '[]',
        
        -- Current Challenges
        challenges JSONB NOT NULL DEFAULT '[]',
        
        -- Metadata
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Government Transitions table (for tracking transition attempts and outcomes)
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_transitions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        from_government_type_id VARCHAR(50) REFERENCES government_types(id),
        to_government_type_id VARCHAR(50) REFERENCES government_types(id),
        
        -- Transition Details
        transition_method VARCHAR(20) CHECK (transition_method IN ('peaceful', 'revolution', 'coup', 'invasion', 'reform')),
        transition_reason TEXT NOT NULL,
        initiated_by VARCHAR(100),
        
        -- Requirements Check
        requirements_met JSONB NOT NULL DEFAULT '{}',
        success_probability INTEGER CHECK (success_probability BETWEEN 0 AND 100),
        
        -- Outcome
        status VARCHAR(20) CHECK (status IN ('planned', 'in_progress', 'successful', 'failed', 'cancelled')) DEFAULT 'planned',
        outcome_description TEXT,
        
        -- Impact
        stability_impact INTEGER CHECK (stability_impact BETWEEN -100 AND 100),
        legitimacy_impact INTEGER CHECK (legitimacy_impact BETWEEN -100 AND 100),
        economic_impact INTEGER CHECK (economic_impact BETWEEN -100 AND 100),
        
        -- Timing
        initiated_date TIMESTAMP DEFAULT NOW(),
        completed_date TIMESTAMP,
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Government Events table (for tracking significant government events)
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_events (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        government_id INTEGER REFERENCES civilization_governments(id),
        
        -- Event Details
        event_type VARCHAR(50) NOT NULL,
        event_title VARCHAR(200) NOT NULL,
        event_description TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Impact
        legitimacy_impact INTEGER CHECK (legitimacy_impact BETWEEN -100 AND 100) DEFAULT 0,
        stability_impact INTEGER CHECK (stability_impact BETWEEN -100 AND 100) DEFAULT 0,
        public_satisfaction_impact INTEGER CHECK (public_satisfaction_impact BETWEEN -100 AND 100) DEFAULT 0,
        
        -- Context
        triggered_by VARCHAR(100),
        related_events JSONB DEFAULT '[]',
        
        -- Metadata
        severity INTEGER CHECK (severity BETWEEN 1 AND 10) DEFAULT 5,
        public_visibility BOOLEAN DEFAULT TRUE,
        media_coverage BOOLEAN DEFAULT TRUE,
        
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_types_ideology 
      ON government_types(ideology);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_civilization_governments_campaign_civ 
      ON civilization_governments(campaign_id, civilization_id, established_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_transitions_campaign_civ 
      ON government_transitions(campaign_id, civilization_id, initiated_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_events_campaign_civ_date 
      ON government_events(campaign_id, civilization_id, event_date DESC);
    `);

    // Insert predefined government types
    await client.query(`
      INSERT INTO government_types (
        id, name, description, ideology, power_structure, legitimacy_source, succession_method,
        decision_speed, public_approval_required, legislative_override,
        economic_control, resource_allocation, private_property_rights,
        media_control, civil_liberties, cultural_control,
        stability_factors, advantages, disadvantages,
        transition_from, transition_to, transition_requirements
      ) VALUES 
      (
        'absolute_monarchy',
        'Absolute Monarchy',
        'A form of government where a single ruler holds supreme authority, typically inherited through bloodline. The monarch has absolute power over all aspects of governance.',
        'traditionalist',
        'centralized',
        'divine_right',
        'hereditary',
        9,
        false,
        false,
        70,
        'central_planning',
        60,
        80,
        30,
        90,
        '{"succession": 40, "legitimacy": 60, "institutionalStrength": 70, "popularSupport": 45}',
        '["Fast decision making", "Clear chain of command", "Long-term planning", "Cultural stability", "Strong national identity"]',
        '["Succession crises", "Lack of public input", "Potential for tyranny", "Limited adaptability", "Vulnerable to incompetent rulers"]',
        '["feudalism", "tribal_chiefdom", "military_dictatorship"]',
        '["constitutional_monarchy", "parliamentary_democracy", "military_dictatorship", "republic"]',
        '{"popularSupport": 20, "militarySupport": 60, "economicCrisis": true}'
      ),
      (
        'constitutional_monarchy',
        'Constitutional Monarchy',
        'A system where a monarch serves as head of state within the parameters of a constitution. Real power is exercised by elected officials.',
        'moderate_conservative',
        'mixed',
        'tradition',
        'hereditary',
        6,
        true,
        true,
        40,
        'mixed',
        80,
        30,
        75,
        60,
        '{"succession": 85, "legitimacy": 75, "institutionalStrength": 85, "popularSupport": 70}',
        '["Stable succession", "Democratic legitimacy", "Ceremonial continuity", "Balanced power", "High institutional trust"]',
        '["Expensive monarchy", "Potential constitutional crises", "Limited executive power", "Slow decision making"]',
        '["absolute_monarchy", "parliamentary_democracy"]',
        '["parliamentary_democracy", "republic", "absolute_monarchy"]',
        '{"popularSupport": 60, "economicCrisis": false}'
      ),
      (
        'parliamentary_democracy',
        'Parliamentary Democracy',
        'A democratic system where the executive branch derives its legitimacy from the legislature. The head of government is typically a prime minister.',
        'liberal_democratic',
        'distributed',
        'popular_mandate',
        'election',
        4,
        true,
        true,
        25,
        'market',
        90,
        15,
        90,
        30,
        '{"succession": 95, "legitimacy": 85, "institutionalStrength": 80, "popularSupport": 75}',
        '["Democratic legitimacy", "Peaceful transitions", "Public accountability", "Policy flexibility", "High civil liberties"]',
        '["Slow decision making", "Political instability", "Coalition governments", "Short-term focus", "Vulnerable to populism"]',
        '["constitutional_monarchy", "presidential_democracy", "authoritarian_regime"]',
        '["presidential_democracy", "constitutional_monarchy", "authoritarian_regime", "socialist_republic"]',
        '{"popularSupport": 70, "economicCrisis": false}'
      ),
      (
        'presidential_democracy',
        'Presidential Democracy',
        'A democratic system with a directly elected president who serves as both head of state and government, separate from the legislature.',
        'liberal_democratic',
        'mixed',
        'popular_mandate',
        'election',
        7,
        true,
        false,
        30,
        'market',
        85,
        20,
        85,
        35,
        '{"succession": 90, "legitimacy": 80, "institutionalStrength": 75, "popularSupport": 70}',
        '["Strong executive", "Clear accountability", "Stable government", "Direct mandate", "Separation of powers"]',
        '["Potential for gridlock", "Executive overreach", "Polarization", "Winner-take-all mentality"]',
        '["parliamentary_democracy", "military_dictatorship", "authoritarian_regime"]',
        '["parliamentary_democracy", "military_dictatorship", "authoritarian_regime", "socialist_republic"]',
        '{"popularSupport": 65, "militarySupport": 40}'
      ),
      (
        'socialist_republic',
        'Socialist Republic',
        'A state that is constitutionally dedicated to the construction of socialism. Features extensive state control of the economy and single-party rule.',
        'socialist',
        'centralized',
        'party_ideology',
        'appointment',
        8,
        false,
        false,
        85,
        'central_planning',
        20,
        70,
        40,
        80,
        '{"succession": 60, "legitimacy": 55, "institutionalStrength": 70, "popularSupport": 50}',
        '["Economic equality", "Rapid industrialization", "Strong social services", "Ideological unity", "Long-term planning"]',
        '["Limited political freedom", "Economic inefficiency", "Bureaucratic control", "Suppressed dissent", "Innovation constraints"]',
        '["parliamentary_democracy", "presidential_democracy", "communist_state", "authoritarian_regime"]',
        '["communist_state", "parliamentary_democracy", "authoritarian_regime", "military_dictatorship"]',
        '{"popularSupport": 40, "economicCrisis": true, "revolutionaryMovement": true}'
      ),
      (
        'communist_state',
        'Communist State',
        'A one-party state governed by a communist party, with the goal of achieving a classless, stateless society through centralized control.',
        'communist',
        'centralized',
        'party_ideology',
        'appointment',
        9,
        false,
        false,
        95,
        'central_planning',
        10,
        90,
        20,
        95,
        '{"succession": 50, "legitimacy": 45, "institutionalStrength": 75, "popularSupport": 40}',
        '["Complete economic control", "Rapid mobilization", "Ideological consistency", "Strong state capacity", "Social equality"]',
        '["No political opposition", "Economic stagnation", "Individual suppression", "Innovation deficit", "Succession instability"]',
        '["socialist_republic", "authoritarian_regime", "revolutionary_movement"]',
        '["socialist_republic", "authoritarian_regime", "parliamentary_democracy", "military_dictatorship"]',
        '{"popularSupport": 30, "economicCrisis": true, "externalPressure": true}'
      ),
      (
        'military_dictatorship',
        'Military Dictatorship',
        'A form of government where military leaders hold political power, often after seizing control through a coup or during times of crisis.',
        'authoritarian',
        'centralized',
        'force',
        'appointment',
        10,
        false,
        false,
        60,
        'mixed',
        50,
        85,
        25,
        70,
        '{"succession": 30, "legitimacy": 35, "institutionalStrength": 60, "popularSupport": 35}',
        '["Rapid decision making", "Strong security", "Crisis management", "Order and stability", "Military efficiency"]',
        '["Lack of legitimacy", "Human rights abuses", "Economic mismanagement", "International isolation", "Succession crises"]',
        '["parliamentary_democracy", "presidential_democracy", "failed_state", "civil_war"]',
        '["parliamentary_democracy", "presidential_democracy", "authoritarian_regime", "absolute_monarchy"]',
        '{"militarySupport": 80, "economicCrisis": true, "externalPressure": false}'
      ),
      (
        'authoritarian_regime',
        'Authoritarian Regime',
        'A system characterized by strong central power and limited political freedoms. May have elections but lacks genuine democratic competition.',
        'authoritarian',
        'centralized',
        'force',
        'appointment',
        8,
        false,
        false,
        65,
        'mixed',
        40,
        75,
        35,
        85,
        '{"succession": 40, "legitimacy": 40, "institutionalStrength": 65, "popularSupport": 40}',
        '["Political stability", "Economic development", "Strong state control", "Reduced crime", "National unity"]',
        '["Limited freedoms", "Corruption", "Lack of accountability", "Suppressed opposition", "International criticism"]',
        '["parliamentary_democracy", "presidential_democracy", "military_dictatorship", "communist_state"]',
        '["parliamentary_democracy", "military_dictatorship", "communist_state", "failed_state"]',
        '{"popularSupport": 35, "militarySupport": 50, "externalPressure": true}'
      ),
      (
        'technocracy',
        'Technocracy',
        'A system of government where decision-makers are selected based on their expertise and technical knowledge rather than political affiliation.',
        'technocratic',
        'mixed',
        'tradition',
        'meritocracy',
        7,
        false,
        true,
        45,
        'mixed',
        70,
        40,
        60,
        50,
        '{"succession": 70, "legitimacy": 65, "institutionalStrength": 80, "popularSupport": 55}',
        '["Evidence-based policy", "Expertise-driven decisions", "Efficient governance", "Innovation focus", "Reduced corruption"]',
        '["Limited democratic input", "Technocratic elitism", "Lack of political accountability", "Potential for groupthink"]',
        '["parliamentary_democracy", "authoritarian_regime", "failed_state"]',
        '["parliamentary_democracy", "authoritarian_regime", "socialist_republic"]',
        '{"popularSupport": 50, "economicCrisis": true, "externalPressure": false}'
      ),
      (
        'theocracy',
        'Theocracy',
        'A form of government in which religious leaders control political power, and religious law serves as the basis for civil law.',
        'religious',
        'centralized',
        'divine_right',
        'appointment',
        6,
        false,
        false,
        55,
        'mixed',
        30,
        90,
        20,
        95,
        '{"succession": 50, "legitimacy": 70, "institutionalStrength": 75, "popularSupport": 60}',
        '["Strong moral authority", "Cultural unity", "Clear value system", "Social cohesion", "Spiritual legitimacy"]',
        '["Religious oppression", "Limited scientific progress", "Minority persecution", "Inflexible governance", "International isolation"]',
        '["absolute_monarchy", "authoritarian_regime", "failed_state"]',
        '["authoritarian_regime", "constitutional_monarchy", "parliamentary_democracy"]',
        '{"popularSupport": 70, "economicCrisis": false, "externalPressure": true}'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Government Types schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Government Types schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
