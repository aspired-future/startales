import { Pool } from 'pg';

/**
 * Initialize Intelligence Directors System database schema
 */
export async function initializeIntelligenceSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Intelligence Directors table - Senior intelligence leadership
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_directors (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        director_type VARCHAR(50) NOT NULL, -- 'foreign', 'domestic', 'coordination'
        name VARCHAR(200) NOT NULL,
        title VARCHAR(100) NOT NULL,
        security_clearance VARCHAR(20) DEFAULT 'top_secret', -- 'secret', 'top_secret', 'cosmic'
        years_of_service INTEGER DEFAULT 0,
        specializations TEXT[], -- Areas of expertise
        background TEXT,
        appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'retired', 'reassigned'
        constitutional_authority BOOLEAN DEFAULT true, -- Whether position is constitutionally permitted
        oversight_committee VARCHAR(100), -- Congressional/judicial oversight body
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Intelligence Agencies table - Individual intelligence agencies
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_agencies (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        agency_name VARCHAR(100) NOT NULL,
        agency_code VARCHAR(10) NOT NULL, -- 'CIA', 'FBI', 'NSA', 'DIA', etc.
        director_id INTEGER REFERENCES intelligence_directors(id),
        agency_type VARCHAR(50) NOT NULL, -- 'foreign', 'domestic', 'military', 'technical'
        primary_mission TEXT,
        capabilities TEXT[],
        personnel_count INTEGER DEFAULT 0,
        budget_allocation DECIMAL(15,2) DEFAULT 0,
        operational_status VARCHAR(20) DEFAULT 'active', -- 'active', 'limited', 'suspended'
        classification_level VARCHAR(20) DEFAULT 'classified',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Intelligence Operations table - Intelligence operations and activities
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_operations (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        operation_name VARCHAR(200) NOT NULL,
        operation_type VARCHAR(50) NOT NULL, -- 'surveillance', 'counterintelligence', 'covert', 'analysis'
        classification_level VARCHAR(20) DEFAULT 'classified', -- 'unclassified', 'classified', 'secret', 'top_secret'
        status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'approved', 'active', 'completed', 'cancelled', 'compromised'
        lead_agency INTEGER REFERENCES intelligence_agencies(id),
        participating_agencies INTEGER[],
        target_type VARCHAR(50), -- 'foreign_government', 'terrorist_organization', 'criminal_network', 'economic_espionage'
        target_description TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        objectives TEXT[],
        resources_required JSONB,
        risk_assessment TEXT,
        legal_authorization TEXT, -- Court orders, executive authorization
        oversight_notifications TEXT[], -- Who has been notified
        success_metrics JSONB,
        operational_report TEXT,
        lessons_learned TEXT[],
        created_by INTEGER REFERENCES intelligence_directors(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Threat Assessments table - Intelligence threat analysis
    await client.query(`
      CREATE TABLE IF NOT EXISTS threat_assessments (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        threat_name VARCHAR(200) NOT NULL,
        threat_type VARCHAR(50) NOT NULL, -- 'foreign_military', 'terrorism', 'cyber', 'economic', 'internal'
        threat_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical', 'imminent'
        classification_level VARCHAR(20) DEFAULT 'classified',
        source_agencies INTEGER[],
        threat_description TEXT NOT NULL,
        indicators TEXT[],
        potential_impact TEXT,
        likelihood_assessment VARCHAR(20), -- 'unlikely', 'possible', 'likely', 'highly_likely', 'certain'
        recommended_actions TEXT[],
        mitigation_strategies TEXT[],
        intelligence_gaps TEXT[],
        confidence_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        last_updated_by INTEGER REFERENCES intelligence_directors(id),
        briefed_to TEXT[], -- Who has been briefed on this threat
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Intelligence Reports table - Intelligence reports and briefings
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_reports (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        report_title VARCHAR(200) NOT NULL,
        report_type VARCHAR(50) NOT NULL, -- 'daily_brief', 'threat_assessment', 'situation_report', 'analysis'
        classification_level VARCHAR(20) DEFAULT 'classified',
        author_agency INTEGER REFERENCES intelligence_agencies(id),
        author_director INTEGER REFERENCES intelligence_directors(id),
        report_content TEXT NOT NULL,
        key_findings TEXT[],
        recommendations TEXT[],
        sources_methods TEXT, -- How intelligence was gathered (classified)
        distribution_list TEXT[], -- Who receives this report
        related_operations INTEGER[], -- Related operation IDs
        related_threats INTEGER[], -- Related threat assessment IDs
        confidence_assessment JSONB, -- Confidence levels for different findings
        follow_up_required BOOLEAN DEFAULT false,
        follow_up_actions TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Intelligence Oversight table - Oversight and accountability
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_oversight (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        oversight_type VARCHAR(50) NOT NULL, -- 'congressional', 'judicial', 'executive', 'inspector_general'
        oversight_body VARCHAR(100) NOT NULL, -- Name of oversight committee/court
        review_subject VARCHAR(100) NOT NULL, -- What is being reviewed
        review_type VARCHAR(50), -- 'routine', 'complaint', 'audit', 'investigation'
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'suspended'
        findings TEXT,
        recommendations TEXT[],
        corrective_actions TEXT[],
        compliance_status VARCHAR(20), -- 'compliant', 'non_compliant', 'under_review'
        related_operations INTEGER[], -- Operations under review
        related_agencies INTEGER[], -- Agencies under review
        classification_level VARCHAR(20) DEFAULT 'classified',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_intelligence_directors_civilization ON intelligence_directors(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_directors_type ON intelligence_directors(director_type);
      CREATE INDEX IF NOT EXISTS idx_intelligence_agencies_civilization ON intelligence_agencies(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_agencies_code ON intelligence_agencies(agency_code);
      CREATE INDEX IF NOT EXISTS idx_intelligence_operations_civilization ON intelligence_operations(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_operations_status ON intelligence_operations(status);
      CREATE INDEX IF NOT EXISTS idx_threat_assessments_civilization ON threat_assessments(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_threat_assessments_level ON threat_assessments(threat_level);
      CREATE INDEX IF NOT EXISTS idx_intelligence_reports_civilization ON intelligence_reports(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_reports_type ON intelligence_reports(report_type);
      CREATE INDEX IF NOT EXISTS idx_intelligence_oversight_civilization ON intelligence_oversight(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_oversight_status ON intelligence_oversight(status);
    `);

    await client.query('COMMIT');
    console.log('Intelligence Directors System schema initialized successfully');

    // Seed initial data
    await seedIntelligenceData(pool);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing Intelligence schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed initial Intelligence data
 */
async function seedIntelligenceData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    // Check if data already exists
    const existingData = await client.query('SELECT COUNT(*) FROM intelligence_directors');
    if (parseInt(existingData.rows[0].count) > 0) {
      console.log('Intelligence data already exists, skipping seed');
      return;
    }

    // Get civilization IDs
    const civilizations = await client.query('SELECT id FROM civilizations LIMIT 3');
    
    for (const civ of civilizations.rows) {
      const civId = civ.id;

      // Create Intelligence Directors for each civilization
      const intelligenceDirectors = [
        {
          director_type: 'foreign',
          name: 'Director Elena Vasquez',
          title: 'Director of Foreign Intelligence',
          security_clearance: 'cosmic',
          years_of_service: 25,
          specializations: ['Foreign Intelligence', 'Counterintelligence', 'Strategic Analysis'],
          background: 'Former field operative with extensive experience in hostile territory intelligence gathering and foreign government analysis.',
          constitutional_authority: true,
          oversight_committee: 'Senate Intelligence Committee'
        },
        {
          director_type: 'domestic',
          name: 'Director Michael Chen',
          title: 'Director of Domestic Intelligence',
          security_clearance: 'top_secret',
          years_of_service: 22,
          specializations: ['Counterterrorism', 'Cybersecurity', 'Internal Security'],
          background: 'Career law enforcement officer with expertise in domestic counterterrorism and cybersecurity threats.',
          constitutional_authority: true,
          oversight_committee: 'House Intelligence Committee'
        },
        {
          director_type: 'coordination',
          name: 'Director Sarah Kim',
          title: 'Director of Intelligence Coordination',
          security_clearance: 'top_secret',
          years_of_service: 20,
          specializations: ['Inter-Agency Coordination', 'Intelligence Analysis', 'Information Sharing'],
          background: 'Former analyst with extensive experience in coordinating intelligence across multiple agencies and departments.',
          constitutional_authority: true,
          oversight_committee: 'Joint Intelligence Committee'
        }
      ];

      // Insert Intelligence Directors
      for (const director of intelligenceDirectors) {
        await client.query(`
          INSERT INTO intelligence_directors (
            civilization_id, director_type, name, title, security_clearance,
            years_of_service, specializations, background, constitutional_authority, oversight_committee
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          civId, director.director_type, director.name, director.title, director.security_clearance,
          director.years_of_service, director.specializations, director.background,
          director.constitutional_authority, director.oversight_committee
        ]);
      }

      // Create Intelligence Agencies
      const agencies = [
        {
          agency_name: 'Central Intelligence Agency',
          agency_code: 'CIA',
          agency_type: 'foreign',
          primary_mission: 'Foreign intelligence collection, analysis, and covert operations',
          capabilities: ['Human Intelligence', 'Signals Intelligence', 'Covert Operations', 'Analysis', 'Counterintelligence'],
          personnel_count: 21000,
          budget_allocation: 15000000000,
          operational_status: 'active',
          classification_level: 'top_secret'
        },
        {
          agency_name: 'Federal Bureau of Investigation',
          agency_code: 'FBI',
          agency_type: 'domestic',
          primary_mission: 'Domestic counterterrorism, counterintelligence, and criminal investigation',
          capabilities: ['Counterterrorism', 'Counterintelligence', 'Criminal Investigation', 'Cyber Security', 'Surveillance'],
          personnel_count: 35000,
          budget_allocation: 9500000000,
          operational_status: 'active',
          classification_level: 'secret'
        },
        {
          agency_name: 'National Security Agency',
          agency_code: 'NSA',
          agency_type: 'technical',
          primary_mission: 'Signals intelligence, cybersecurity, and information assurance',
          capabilities: ['Signals Intelligence', 'Cyber Operations', 'Cryptography', 'Information Security', 'Technical Analysis'],
          personnel_count: 32000,
          budget_allocation: 10800000000,
          operational_status: 'active',
          classification_level: 'top_secret'
        },
        {
          agency_name: 'Defense Intelligence Agency',
          agency_code: 'DIA',
          agency_type: 'military',
          primary_mission: 'Military intelligence for defense planning and operations',
          capabilities: ['Military Intelligence', 'Strategic Analysis', 'Threat Assessment', 'Defense Support', 'Foreign Military Analysis'],
          personnel_count: 16500,
          budget_allocation: 4200000000,
          operational_status: 'active',
          classification_level: 'secret'
        },
        {
          agency_name: 'Intelligence Coordination Office',
          agency_code: 'ICO',
          agency_type: 'coordination',
          primary_mission: 'Inter-agency intelligence coordination and information sharing',
          capabilities: ['Intelligence Coordination', 'Information Sharing', 'Analysis Integration', 'Threat Fusion', 'Policy Coordination'],
          personnel_count: 5000,
          budget_allocation: 1200000000,
          operational_status: 'active',
          classification_level: 'secret'
        }
      ];

      // Get director IDs for linking
      const directors = await client.query(`
        SELECT id, director_type FROM intelligence_directors 
        WHERE civilization_id = $1
      `, [civId]);

      const directorMap = new Map();
      directors.rows.forEach(director => {
        directorMap.set(director.director_type, director.id);
      });

      // Insert Intelligence Agencies
      for (const agency of agencies) {
        let directorId = null;
        if (agency.agency_type === 'foreign') {
          directorId = directorMap.get('foreign');
        } else if (agency.agency_type === 'domestic') {
          directorId = directorMap.get('domestic');
        } else if (agency.agency_type === 'coordination') {
          directorId = directorMap.get('coordination');
        }
        
        await client.query(`
          INSERT INTO intelligence_agencies (
            civilization_id, agency_name, agency_code, director_id, agency_type,
            primary_mission, capabilities, personnel_count, budget_allocation,
            operational_status, classification_level
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          civId, agency.agency_name, agency.agency_code, directorId, agency.agency_type,
          agency.primary_mission, agency.capabilities, agency.personnel_count,
          agency.budget_allocation, agency.operational_status, agency.classification_level
        ]);
      }

      // Create sample threat assessments
      const foreignDirectorId = directorMap.get('foreign');
      const domesticDirectorId = directorMap.get('domestic');

      if (foreignDirectorId && domesticDirectorId) {
        const sampleThreats = [
          {
            threat_name: 'Operation Shadow Network',
            threat_type: 'foreign_military',
            threat_level: 'high',
            classification_level: 'top_secret',
            source_agencies: [1, 3], // CIA and NSA
            threat_description: 'Sophisticated foreign intelligence operation targeting critical infrastructure and government communications',
            indicators: [
              'Increased cyber reconnaissance activity',
              'Unusual diplomatic communications patterns',
              'Suspicious personnel movements near sensitive facilities'
            ],
            potential_impact: 'Compromise of classified information and disruption of critical government operations',
            likelihood_assessment: 'likely',
            recommended_actions: [
              'Enhance cybersecurity protocols',
              'Increase counterintelligence surveillance',
              'Brief senior leadership on threat indicators'
            ],
            mitigation_strategies: [
              'Deploy additional cyber defense measures',
              'Coordinate with allied intelligence services',
              'Implement enhanced security clearance reviews'
            ],
            intelligence_gaps: [
              'Specific operational timeline',
              'Full extent of infiltration',
              'Identity of key operatives'
            ],
            confidence_level: 'high',
            last_updated_by: foreignDirectorId,
            briefed_to: ['Defense Secretary', 'Leader', 'National Security Advisor']
          },
          {
            threat_name: 'Domestic Extremist Cell Alpha',
            threat_type: 'terrorism',
            threat_level: 'medium',
            classification_level: 'secret',
            source_agencies: [2], // FBI
            threat_description: 'Domestic extremist group planning potential attacks on government facilities',
            indicators: [
              'Increased online recruitment activity',
              'Suspicious weapons purchases',
              'Surveillance of government buildings'
            ],
            potential_impact: 'Potential loss of life and damage to government facilities',
            likelihood_assessment: 'possible',
            recommended_actions: [
              'Increase surveillance of known associates',
              'Coordinate with local law enforcement',
              'Monitor financial transactions'
            ],
            mitigation_strategies: [
              'Enhanced security at potential targets',
              'Community outreach programs',
              'Disruption of recruitment networks'
            ],
            intelligence_gaps: [
              'Specific attack timeline',
              'Target selection criteria',
              'Funding sources'
            ],
            confidence_level: 'medium',
            last_updated_by: domesticDirectorId,
            briefed_to: ['Justice Secretary', 'Leader', 'Homeland Security']
          }
        ];

        for (const threat of sampleThreats) {
          await client.query(`
            INSERT INTO threat_assessments (
              civilization_id, threat_name, threat_type, threat_level, classification_level,
              source_agencies, threat_description, indicators, potential_impact,
              likelihood_assessment, recommended_actions, mitigation_strategies,
              intelligence_gaps, confidence_level, last_updated_by, briefed_to
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          `, [
            civId, threat.threat_name, threat.threat_type, threat.threat_level,
            threat.classification_level, threat.source_agencies, threat.threat_description,
            threat.indicators, threat.potential_impact, threat.likelihood_assessment,
            threat.recommended_actions, threat.mitigation_strategies, threat.intelligence_gaps,
            threat.confidence_level, threat.last_updated_by, threat.briefed_to
          ]);
        }

        // Create sample intelligence operations
        const sampleOperations = [
          {
            operation_name: 'Operation Nightwatch',
            operation_type: 'surveillance',
            classification_level: 'top_secret',
            status: 'active',
            lead_agency: 1, // CIA
            participating_agencies: [1, 3], // CIA and NSA
            target_type: 'foreign_government',
            target_description: 'Foreign embassy communications monitoring',
            objectives: [
              'Monitor diplomatic communications',
              'Identify intelligence operatives',
              'Assess foreign policy intentions'
            ],
            resources_required: {
              personnel: 25,
              budget: 5000000,
              equipment: ['Surveillance Systems', 'Communication Intercept', 'Analysis Software']
            },
            risk_assessment: 'Medium risk of diplomatic incident if discovered',
            legal_authorization: 'Executive Order 12333, FISA Court Authorization',
            oversight_notifications: ['Senate Intelligence Committee', 'FISA Court'],
            success_metrics: {
              communications_intercepted: 0,
              intelligence_reports_generated: 0,
              threat_assessments_updated: 0
            },
            created_by: foreignDirectorId
          },
          {
            operation_name: 'Operation Digital Shield',
            operation_type: 'counterintelligence',
            classification_level: 'secret',
            status: 'planning',
            lead_agency: 2, // FBI
            participating_agencies: [2, 3], // FBI and NSA
            target_type: 'cyber',
            target_description: 'Counter-cyber espionage operation',
            objectives: [
              'Identify cyber infiltration attempts',
              'Neutralize malicious cyber activities',
              'Protect critical infrastructure'
            ],
            resources_required: {
              personnel: 40,
              budget: 8000000,
              equipment: ['Cyber Defense Systems', 'Forensic Tools', 'Monitoring Software']
            },
            risk_assessment: 'Low risk with proper operational security',
            legal_authorization: 'Department of Justice Authorization',
            oversight_notifications: ['House Intelligence Committee'],
            success_metrics: {
              threats_neutralized: 0,
              systems_protected: 0,
              intelligence_gathered: 0
            },
            created_by: domesticDirectorId
          }
        ];

        for (const operation of sampleOperations) {
          await client.query(`
            INSERT INTO intelligence_operations (
              civilization_id, operation_name, operation_type, classification_level,
              status, lead_agency, participating_agencies, target_type, target_description,
              objectives, resources_required, risk_assessment, legal_authorization,
              oversight_notifications, success_metrics, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          `, [
            civId, operation.operation_name, operation.operation_type, operation.classification_level,
            operation.status, operation.lead_agency, operation.participating_agencies,
            operation.target_type, operation.target_description, operation.objectives,
            JSON.stringify(operation.resources_required), operation.risk_assessment,
            operation.legal_authorization, operation.oversight_notifications,
            JSON.stringify(operation.success_metrics), operation.created_by
          ]);
        }
      }
    }

    console.log('Intelligence seed data inserted successfully');

  } catch (error) {
    console.error('Error seeding Intelligence data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// TypeScript interfaces
export interface IntelligenceDirector {
  id: number;
  civilization_id: number;
  director_type: 'foreign' | 'domestic' | 'coordination';
  name: string;
  title: string;
  security_clearance: 'secret' | 'top_secret' | 'cosmic';
  years_of_service: number;
  specializations: string[];
  background: string;
  appointment_date: Date;
  status: 'active' | 'retired' | 'reassigned';
  constitutional_authority: boolean;
  oversight_committee: string;
  created_at: Date;
  updated_at: Date;
}

export interface IntelligenceAgency {
  id: number;
  civilization_id: number;
  agency_name: string;
  agency_code: string;
  director_id?: number;
  agency_type: 'foreign' | 'domestic' | 'military' | 'technical' | 'coordination';
  primary_mission: string;
  capabilities: string[];
  personnel_count: number;
  budget_allocation: number;
  operational_status: 'active' | 'limited' | 'suspended';
  classification_level: string;
  created_at: Date;
  updated_at: Date;
}

export interface IntelligenceOperation {
  id: number;
  civilization_id: number;
  operation_name: string;
  operation_type: string;
  classification_level: string;
  status: 'planning' | 'approved' | 'active' | 'completed' | 'cancelled' | 'compromised';
  lead_agency: number;
  participating_agencies: number[];
  target_type?: string;
  target_description?: string;
  start_date?: Date;
  end_date?: Date;
  objectives: string[];
  resources_required: any;
  risk_assessment?: string;
  legal_authorization?: string;
  oversight_notifications: string[];
  success_metrics: any;
  operational_report?: string;
  lessons_learned: string[];
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ThreatAssessment {
  id: number;
  civilization_id: number;
  threat_name: string;
  threat_type: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical' | 'imminent';
  classification_level: string;
  source_agencies: number[];
  threat_description: string;
  indicators: string[];
  potential_impact?: string;
  likelihood_assessment: 'unlikely' | 'possible' | 'likely' | 'highly_likely' | 'certain';
  recommended_actions: string[];
  mitigation_strategies: string[];
  intelligence_gaps: string[];
  confidence_level: 'low' | 'medium' | 'high';
  last_updated_by: number;
  briefed_to: string[];
  created_at: Date;
  updated_at: Date;
}

export interface IntelligenceReport {
  id: number;
  civilization_id: number;
  report_title: string;
  report_type: string;
  classification_level: string;
  author_agency?: number;
  author_director?: number;
  report_content: string;
  key_findings: string[];
  recommendations: string[];
  sources_methods?: string;
  distribution_list: string[];
  related_operations: number[];
  related_threats: number[];
  confidence_assessment: any;
  follow_up_required: boolean;
  follow_up_actions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface IntelligenceOversight {
  id: number;
  civilization_id: number;
  oversight_type: string;
  oversight_body: string;
  review_subject: string;
  review_type?: string;
  status: 'active' | 'completed' | 'suspended';
  findings?: string;
  recommendations: string[];
  corrective_actions: string[];
  compliance_status?: 'compliant' | 'non_compliant' | 'under_review';
  related_operations: number[];
  related_agencies: number[];
  classification_level: string;
  created_at: Date;
  updated_at: Date;
}
