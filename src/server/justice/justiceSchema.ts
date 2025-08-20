/**
 * Justice Department Database Schema
 * 
 * Defines database tables and initialization for the Justice Department system,
 * including operations, judicial appointments, policies, oversight, and performance metrics.
 */

import { Pool } from 'pg';

/**
 * Initialize Justice Department database schema
 */
export async function initializeJusticeSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Justice Secretary operations and decisions
    await client.query(`
      CREATE TABLE IF NOT EXISTS justice_operations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        operation_type VARCHAR(50) NOT NULL, -- 'policy_implementation', 'appointment', 'oversight', 'reform'
        title VARCHAR(200) NOT NULL,
        description TEXT,
        target_entity VARCHAR(100), -- court_id, agency_id, etc.
        status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
        priority INTEGER DEFAULT 5, -- 1-10 scale
        budget_allocated DECIMAL(15,2) DEFAULT 0,
        expected_outcome TEXT,
        actual_outcome TEXT,
        effectiveness_score INTEGER, -- 0-100 scale
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        created_by VARCHAR(100) DEFAULT 'justice_secretary'
      )
    `);

    // Judicial appointments and nominations
    await client.query(`
      CREATE TABLE IF NOT EXISTS judicial_appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        court_id VARCHAR(100) NOT NULL,
        position_title VARCHAR(100) NOT NULL,
        nominee_name VARCHAR(100) NOT NULL,
        nominee_background TEXT,
        appointment_date TIMESTAMP,
        confirmation_status VARCHAR(20) DEFAULT 'nominated', -- 'nominated', 'confirmed', 'rejected', 'withdrawn'
        confirmation_vote_for INTEGER DEFAULT 0,
        confirmation_vote_against INTEGER DEFAULT 0,
        term_length INTEGER, -- in years, null for life tenure
        specialization TEXT[],
        philosophy VARCHAR(50), -- 'conservative', 'liberal', 'moderate', 'originalist', etc.
        approval_rating INTEGER DEFAULT 70, -- 0-100 scale
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP
      )
    `);

    // Justice policy implementations
    await client.query(`
      CREATE TABLE IF NOT EXISTS justice_policies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        policy_name VARCHAR(200) NOT NULL,
        policy_type VARCHAR(50) NOT NULL, -- 'criminal_justice', 'civil_rights', 'law_enforcement', 'court_reform'
        description TEXT,
        implementation_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'approved', 'implementing', 'active', 'suspended'
        target_agencies TEXT[], -- agencies affected by this policy
        budget_required DECIMAL(15,2) DEFAULT 0,
        expected_impact TEXT,
        success_metrics JSONB, -- key performance indicators
        actual_results JSONB, -- measured outcomes
        public_support INTEGER DEFAULT 50, -- 0-100 scale
        effectiveness_score INTEGER, -- 0-100 scale
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        implemented_at TIMESTAMP,
        last_reviewed TIMESTAMP
      )
    `);

    // Law enforcement agency oversight
    await client.query(`
      CREATE TABLE IF NOT EXISTS agency_oversight (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        agency_id VARCHAR(100) NOT NULL,
        oversight_type VARCHAR(50) NOT NULL, -- 'performance_review', 'investigation', 'audit', 'reform'
        title VARCHAR(200) NOT NULL,
        description TEXT,
        findings TEXT,
        recommendations TEXT[],
        corrective_actions TEXT[],
        status VARCHAR(20) DEFAULT 'initiated', -- 'initiated', 'investigating', 'completed', 'closed'
        severity VARCHAR(20) DEFAULT 'routine', -- 'routine', 'serious', 'critical'
        public_disclosure BOOLEAN DEFAULT false,
        budget_impact DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Justice system performance metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS justice_performance_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        metric_date DATE NOT NULL,
        overall_justice_health INTEGER NOT NULL, -- 0-100 scale
        crime_clearance_rate DECIMAL(5,2) NOT NULL,
        court_efficiency INTEGER NOT NULL, -- 0-100 scale
        public_trust INTEGER NOT NULL, -- 0-100 scale
        corruption_level INTEGER NOT NULL, -- 0-100 scale (lower is better)
        law_enforcement_effectiveness INTEGER NOT NULL, -- 0-100 scale
        case_backlog INTEGER NOT NULL,
        average_case_processing_days INTEGER NOT NULL,
        victim_satisfaction INTEGER DEFAULT 70, -- 0-100 scale
        community_safety_index INTEGER DEFAULT 75, -- 0-100 scale
        constitutional_compliance INTEGER DEFAULT 90, -- 0-100 scale
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Justice budget allocations
    await client.query(`
      CREATE TABLE IF NOT EXISTS justice_budget_allocations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        civilization_id UUID NOT NULL,
        fiscal_year INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL, -- 'law_enforcement', 'courts', 'corrections', 'victim_services', 'prevention'
        subcategory VARCHAR(100),
        allocated_amount DECIMAL(15,2) NOT NULL,
        spent_amount DECIMAL(15,2) DEFAULT 0,
        remaining_amount DECIMAL(15,2) NOT NULL,
        effectiveness_score INTEGER, -- 0-100 scale
        justification TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_justice_operations_civ_type 
      ON justice_operations(civilization_id, operation_type)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_judicial_appointments_civ_court 
      ON judicial_appointments(civilization_id, court_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_justice_policies_civ_status 
      ON justice_policies(civilization_id, implementation_status)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_agency_oversight_civ_agency 
      ON agency_oversight(civilization_id, agency_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_justice_performance_civ_date 
      ON justice_performance_metrics(civilization_id, metric_date)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_justice_budget_civ_year 
      ON justice_budget_allocations(civilization_id, fiscal_year)
    `);

    await client.query('COMMIT');
    console.log('Justice Department schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize Justice Department schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed initial Justice Department data
 */
export async function seedJusticeData(pool: Pool, civilizationId: string): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Seed initial justice operations
    const initialOperations = [
      {
        type: 'policy_implementation',
        title: 'Community Policing Initiative',
        description: 'Implement community-oriented policing strategies to improve police-community relations',
        priority: 8,
        budget: 5000000,
        expected_outcome: 'Improved community trust and reduced crime rates'
      },
      {
        type: 'reform',
        title: 'Court Efficiency Modernization',
        description: 'Modernize court systems with digital case management and streamlined processes',
        priority: 7,
        budget: 3000000,
        expected_outcome: 'Reduced case backlogs and faster processing times'
      },
      {
        type: 'oversight',
        title: 'Law Enforcement Accountability Review',
        description: 'Comprehensive review of law enforcement accountability measures and practices',
        priority: 9,
        budget: 1500000,
        expected_outcome: 'Enhanced accountability and public trust'
      }
    ];

    for (const operation of initialOperations) {
      await client.query(`
        INSERT INTO justice_operations (
          civilization_id, operation_type, title, description, priority, 
          budget_allocated, expected_outcome
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        civilizationId, operation.type, operation.title, operation.description,
        operation.priority, operation.budget, operation.expected_outcome
      ]);
    }

    // Seed initial justice policies
    const initialPolicies = [
      {
        name: 'Criminal Justice Reform Act',
        type: 'criminal_justice',
        description: 'Comprehensive reform of criminal justice system focusing on rehabilitation and reducing recidivism',
        budget: 10000000,
        impact: 'Reduced recidivism rates and improved rehabilitation outcomes',
        public_support: 65
      },
      {
        name: 'Digital Evidence Standards',
        type: 'law_enforcement',
        description: 'Establish standards for collection, preservation, and analysis of digital evidence',
        budget: 2000000,
        impact: 'Improved conviction rates for cybercrimes and digital evidence cases',
        public_support: 80
      },
      {
        name: 'Victim Rights Enhancement',
        type: 'civil_rights',
        description: 'Expand victim rights and support services throughout the justice process',
        budget: 5000000,
        impact: 'Improved victim satisfaction and participation in justice process',
        public_support: 85
      }
    ];

    for (const policy of initialPolicies) {
      await client.query(`
        INSERT INTO justice_policies (
          civilization_id, policy_name, policy_type, description, 
          budget_required, expected_impact, public_support
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        civilizationId, policy.name, policy.type, policy.description,
        policy.budget, policy.impact, policy.public_support
      ]);
    }

    // Seed initial performance metrics
    const currentDate = new Date().toISOString().split('T')[0];
    await client.query(`
      INSERT INTO justice_performance_metrics (
        civilization_id, metric_date, overall_justice_health, crime_clearance_rate,
        court_efficiency, public_trust, corruption_level, law_enforcement_effectiveness,
        case_backlog, average_case_processing_days
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      civilizationId, currentDate, 75, 68.5, 72, 65, 25, 70, 450, 120
    ]);

    // Seed initial budget allocations
    const currentYear = new Date().getFullYear();
    const budgetCategories = [
      { category: 'law_enforcement', amount: 50000000, effectiveness: 75 },
      { category: 'courts', amount: 30000000, effectiveness: 70 },
      { category: 'corrections', amount: 25000000, effectiveness: 65 },
      { category: 'victim_services', amount: 8000000, effectiveness: 80 },
      { category: 'prevention', amount: 12000000, effectiveness: 85 }
    ];

    for (const budget of budgetCategories) {
      await client.query(`
        INSERT INTO justice_budget_allocations (
          civilization_id, fiscal_year, category, allocated_amount, 
          remaining_amount, effectiveness_score
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        civilizationId, currentYear, budget.category, budget.amount,
        budget.amount, budget.effectiveness
      ]);
    }

    await client.query('COMMIT');
    console.log('Justice Department data seeded successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed Justice Department data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Type definitions for Justice Department data structures
export interface JusticeOperation {
  id: string;
  civilization_id: string;
  operation_type: 'policy_implementation' | 'appointment' | 'oversight' | 'reform';
  title: string;
  description?: string;
  target_entity?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: number; // 1-10
  budget_allocated: number;
  expected_outcome?: string;
  actual_outcome?: string;
  effectiveness_score?: number; // 0-100
  created_at: Date;
  completed_at?: Date;
  created_by: string;
}

export interface JudicialAppointment {
  id: string;
  civilization_id: string;
  court_id: string;
  position_title: string;
  nominee_name: string;
  nominee_background?: string;
  appointment_date?: Date;
  confirmation_status: 'nominated' | 'confirmed' | 'rejected' | 'withdrawn';
  confirmation_vote_for: number;
  confirmation_vote_against: number;
  term_length?: number; // years, null for life tenure
  specialization: string[];
  philosophy: string;
  approval_rating: number; // 0-100
  created_at: Date;
  confirmed_at?: Date;
}

export interface JusticePolicy {
  id: string;
  civilization_id: string;
  policy_name: string;
  policy_type: 'criminal_justice' | 'civil_rights' | 'law_enforcement' | 'court_reform';
  description?: string;
  implementation_status: 'draft' | 'approved' | 'implementing' | 'active' | 'suspended';
  target_agencies: string[];
  budget_required: number;
  expected_impact?: string;
  success_metrics?: Record<string, any>;
  actual_results?: Record<string, any>;
  public_support: number; // 0-100
  effectiveness_score?: number; // 0-100
  created_at: Date;
  implemented_at?: Date;
  last_reviewed?: Date;
}

export interface AgencyOversight {
  id: string;
  civilization_id: string;
  agency_id: string;
  oversight_type: 'performance_review' | 'investigation' | 'audit' | 'reform';
  title: string;
  description?: string;
  findings?: string;
  recommendations: string[];
  corrective_actions: string[];
  status: 'initiated' | 'investigating' | 'completed' | 'closed';
  severity: 'routine' | 'serious' | 'critical';
  public_disclosure: boolean;
  budget_impact: number;
  created_at: Date;
  completed_at?: Date;
}

export interface JusticePerformanceMetrics {
  id: string;
  civilization_id: string;
  metric_date: Date;
  overall_justice_health: number; // 0-100
  crime_clearance_rate: number;
  court_efficiency: number; // 0-100
  public_trust: number; // 0-100
  corruption_level: number; // 0-100 (lower is better)
  law_enforcement_effectiveness: number; // 0-100
  case_backlog: number;
  average_case_processing_days: number;
  victim_satisfaction: number; // 0-100
  community_safety_index: number; // 0-100
  constitutional_compliance: number; // 0-100
  created_at: Date;
}

export interface JusticeBudgetAllocation {
  id: string;
  civilization_id: string;
  fiscal_year: number;
  category: 'law_enforcement' | 'courts' | 'corrections' | 'victim_services' | 'prevention';
  subcategory?: string;
  allocated_amount: number;
  spent_amount: number;
  remaining_amount: number;
  effectiveness_score?: number; // 0-100
  justification?: string;
  created_at: Date;
  last_updated: Date;
}
