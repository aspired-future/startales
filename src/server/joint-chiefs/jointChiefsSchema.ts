import { Pool } from 'pg';

/**
 * Initialize Joint Chiefs of Staff & Service Chiefs database schema
 */
export async function initializeJointChiefsSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Joint Chiefs table - Senior military leadership
    await client.query(`
      CREATE TABLE IF NOT EXISTS joint_chiefs (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        position VARCHAR(100) NOT NULL, -- 'chairman', 'vice_chairman', 'service_chief'
        service_branch VARCHAR(50), -- 'army', 'navy', 'air_force', 'space_force', 'marines', null for chairman/vice
        name VARCHAR(200) NOT NULL,
        rank VARCHAR(50) NOT NULL,
        years_of_service INTEGER DEFAULT 0,
        specializations TEXT[], -- Areas of expertise
        background TEXT,
        appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'retired', 'reassigned'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Military Services table - Individual service branches
    await client.query(`
      CREATE TABLE IF NOT EXISTS military_services (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        service_name VARCHAR(100) NOT NULL, -- 'Army', 'Navy', 'Air Force', 'Space Force', 'Marines'
        service_code VARCHAR(10) NOT NULL, -- 'USA', 'USN', 'USAF', 'USSF', 'USMC'
        chief_id INTEGER REFERENCES joint_chiefs(id),
        personnel_count INTEGER DEFAULT 0,
        active_units INTEGER DEFAULT 0,
        budget_allocation DECIMAL(15,2) DEFAULT 0,
        readiness_level VARCHAR(20) DEFAULT 'moderate', -- 'low', 'moderate', 'high', 'critical'
        primary_mission TEXT,
        capabilities TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Strategic Plans table - Long-term military planning
    await client.query(`
      CREATE TABLE IF NOT EXISTS strategic_plans (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        plan_name VARCHAR(200) NOT NULL,
        plan_type VARCHAR(50) NOT NULL, -- 'defense', 'offensive', 'peacekeeping', 'training', 'joint_exercise'
        status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'under_review', 'approved', 'active', 'completed', 'cancelled'
        priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
        lead_service VARCHAR(50), -- Primary service responsible
        participating_services TEXT[], -- All services involved
        objectives TEXT[],
        timeline_months INTEGER,
        resource_requirements JSONB, -- Personnel, equipment, budget needs
        risk_assessment TEXT,
        approval_required_from TEXT[], -- 'defense_secretary', 'joint_chiefs_chairman', 'leader'
        approved_by TEXT[],
        created_by INTEGER REFERENCES joint_chiefs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Joint Operations table - Multi-service operations
    await client.query(`
      CREATE TABLE IF NOT EXISTS joint_operations (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        operation_name VARCHAR(200) NOT NULL,
        operation_type VARCHAR(50) NOT NULL, -- 'training', 'deployment', 'exercise', 'combat', 'humanitarian'
        status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'approved', 'active', 'completed', 'cancelled'
        commanding_service VARCHAR(50) NOT NULL,
        participating_services TEXT[],
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        location VARCHAR(200),
        objectives TEXT[],
        personnel_assigned INTEGER DEFAULT 0,
        units_involved TEXT[],
        success_metrics JSONB,
        after_action_report TEXT,
        lessons_learned TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Command Recommendations table - Strategic advice and recommendations
    await client.query(`
      CREATE TABLE IF NOT EXISTS command_recommendations (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
        recommending_officer INTEGER NOT NULL REFERENCES joint_chiefs(id),
        recommendation_type VARCHAR(50) NOT NULL, -- 'strategic', 'operational', 'personnel', 'budget', 'policy'
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        rationale TEXT,
        urgency VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
        target_audience TEXT[], -- 'defense_secretary', 'leader', 'joint_chiefs', 'service_chiefs'
        implementation_timeline VARCHAR(100),
        resource_impact TEXT,
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'implemented'
        response_from VARCHAR(100), -- Who responded
        response_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_joint_chiefs_civilization ON joint_chiefs(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_joint_chiefs_position ON joint_chiefs(position);
      CREATE INDEX IF NOT EXISTS idx_joint_chiefs_service ON joint_chiefs(service_branch);
      CREATE INDEX IF NOT EXISTS idx_military_services_civilization ON military_services(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_military_services_code ON military_services(service_code);
      CREATE INDEX IF NOT EXISTS idx_strategic_plans_civilization ON strategic_plans(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_strategic_plans_status ON strategic_plans(status);
      CREATE INDEX IF NOT EXISTS idx_joint_operations_civilization ON joint_operations(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_joint_operations_status ON joint_operations(status);
      CREATE INDEX IF NOT EXISTS idx_command_recommendations_civilization ON command_recommendations(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_command_recommendations_status ON command_recommendations(status);
    `);

    await client.query('COMMIT');
    console.log('Joint Chiefs of Staff schema initialized successfully');

    // Seed initial data
    await seedJointChiefsData(pool);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing Joint Chiefs schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed initial Joint Chiefs data
 */
async function seedJointChiefsData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    // Check if data already exists
    const existingData = await client.query('SELECT COUNT(*) FROM joint_chiefs');
    if (parseInt(existingData.rows[0].count) > 0) {
      console.log('Joint Chiefs data already exists, skipping seed');
      return;
    }

    // Get civilization IDs
    const civilizations = await client.query('SELECT id FROM civilizations LIMIT 3');
    
    for (const civ of civilizations.rows) {
      const civId = civ.id;

      // Create Joint Chiefs for each civilization
      const jointChiefs = [
        {
          position: 'chairman',
          service_branch: null,
          name: 'General Marcus Sterling',
          rank: 'General',
          years_of_service: 32,
          specializations: ['Strategic Planning', 'Joint Operations', 'Defense Policy'],
          background: 'Veteran of multiple interstellar conflicts with extensive experience in multi-service coordination and strategic planning.'
        },
        {
          position: 'vice_chairman',
          service_branch: null,
          name: 'Admiral Sarah Chen',
          rank: 'Admiral',
          years_of_service: 28,
          specializations: ['Naval Operations', 'Space Warfare', 'Intelligence'],
          background: 'Former fleet commander with expertise in space-based operations and interstellar naval strategy.'
        },
        {
          position: 'service_chief',
          service_branch: 'army',
          name: 'General Robert Hayes',
          rank: 'General',
          years_of_service: 30,
          specializations: ['Ground Operations', 'Logistics', 'Personnel Management'],
          background: 'Career infantry officer with extensive experience in planetary assault and occupation operations.'
        },
        {
          position: 'service_chief',
          service_branch: 'navy',
          name: 'Admiral Lisa Rodriguez',
          rank: 'Admiral',
          years_of_service: 26,
          specializations: ['Fleet Operations', 'Naval Aviation', 'Maritime Strategy'],
          background: 'Former carrier group commander specializing in deep space naval operations and carrier-based warfare.'
        },
        {
          position: 'service_chief',
          service_branch: 'air_force',
          name: 'General David Kim',
          rank: 'General',
          years_of_service: 24,
          specializations: ['Aerospace Operations', 'Strategic Bombing', 'Air Superiority'],
          background: 'Former fighter pilot and wing commander with expertise in atmospheric and space-based air operations.'
        },
        {
          position: 'service_chief',
          service_branch: 'space_force',
          name: 'General Maria Volkov',
          rank: 'General',
          years_of_service: 22,
          specializations: ['Space Operations', 'Satellite Warfare', 'Orbital Defense'],
          background: 'Pioneer in space-based military operations with extensive experience in orbital combat and space infrastructure protection.'
        },
        {
          position: 'service_chief',
          service_branch: 'marines',
          name: 'General James Thompson',
          rank: 'General',
          years_of_service: 29,
          specializations: ['Amphibious Operations', 'Rapid Deployment', 'Special Operations'],
          background: 'Former special operations commander with expertise in rapid planetary assault and expeditionary warfare.'
        }
      ];

      // Insert Joint Chiefs
      for (const chief of jointChiefs) {
        await client.query(`
          INSERT INTO joint_chiefs (
            civilization_id, position, service_branch, name, rank, 
            years_of_service, specializations, background
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          civId, chief.position, chief.service_branch, chief.name, chief.rank,
          chief.years_of_service, chief.specializations, chief.background
        ]);
      }

      // Create Military Services
      const services = [
        {
          service_name: 'Army',
          service_code: 'USA',
          personnel_count: 150000,
          active_units: 45,
          budget_allocation: 25000000000,
          readiness_level: 'high',
          primary_mission: 'Ground-based military operations, planetary assault, and occupation forces',
          capabilities: ['Infantry Operations', 'Armored Warfare', 'Artillery Support', 'Logistics', 'Engineering']
        },
        {
          service_name: 'Navy',
          service_code: 'USN',
          personnel_count: 120000,
          active_units: 35,
          budget_allocation: 30000000000,
          readiness_level: 'high',
          primary_mission: 'Space-based naval operations, fleet command, and interstellar transportation',
          capabilities: ['Fleet Operations', 'Carrier Aviation', 'Submarine Warfare', 'Naval Intelligence', 'Amphibious Support']
        },
        {
          service_name: 'Air Force',
          service_code: 'USAF',
          personnel_count: 100000,
          active_units: 40,
          budget_allocation: 22000000000,
          readiness_level: 'moderate',
          primary_mission: 'Atmospheric and near-space air operations, strategic bombing, and air superiority',
          capabilities: ['Fighter Operations', 'Strategic Bombing', 'Air Transport', 'Air Defense', 'Reconnaissance']
        },
        {
          service_name: 'Space Force',
          service_code: 'USSF',
          personnel_count: 50000,
          active_units: 25,
          budget_allocation: 18000000000,
          readiness_level: 'high',
          primary_mission: 'Space-based operations, satellite warfare, and orbital defense systems',
          capabilities: ['Satellite Operations', 'Space Surveillance', 'Orbital Defense', 'Space Launch', 'Electronic Warfare']
        },
        {
          service_name: 'Marines',
          service_code: 'USMC',
          personnel_count: 80000,
          active_units: 20,
          budget_allocation: 15000000000,
          readiness_level: 'high',
          primary_mission: 'Rapid deployment forces, amphibious operations, and expeditionary warfare',
          capabilities: ['Amphibious Assault', 'Rapid Deployment', 'Special Operations', 'Close Combat', 'Expeditionary Logistics']
        }
      ];

      // Get service chief IDs for linking
      const serviceChiefs = await client.query(`
        SELECT id, service_branch FROM joint_chiefs 
        WHERE civilization_id = $1 AND position = 'service_chief'
      `, [civId]);

      const chiefMap = new Map();
      serviceChiefs.rows.forEach(chief => {
        chiefMap.set(chief.service_branch, chief.id);
      });

      // Insert Military Services
      for (const service of services) {
        const chiefId = chiefMap.get(service.service_code.toLowerCase().replace('us', '').replace('af', 'air_force').replace('sf', 'space_force').replace('mc', 'marines').replace('a', 'army').replace('n', 'navy'));
        
        await client.query(`
          INSERT INTO military_services (
            civilization_id, service_name, service_code, chief_id,
            personnel_count, active_units, budget_allocation, readiness_level,
            primary_mission, capabilities
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          civId, service.service_name, service.service_code, chiefId,
          service.personnel_count, service.active_units, service.budget_allocation,
          service.readiness_level, service.primary_mission, service.capabilities
        ]);
      }

      // Create sample strategic plans
      const chairmanId = await client.query(`
        SELECT id FROM joint_chiefs 
        WHERE civilization_id = $1 AND position = 'chairman'
      `, [civId]);

      if (chairmanId.rows.length > 0) {
        const samplePlans = [
          {
            plan_name: 'Operation Stellar Shield',
            plan_type: 'defense',
            priority_level: 'high',
            lead_service: 'space_force',
            participating_services: ['space_force', 'navy', 'air_force'],
            objectives: [
              'Establish comprehensive orbital defense network',
              'Coordinate multi-service space operations',
              'Develop rapid response capabilities for space threats'
            ],
            timeline_months: 18,
            resource_requirements: {
              personnel: 15000,
              budget: 5000000000,
              equipment: ['Orbital Defense Platforms', 'Space Fighters', 'Command Centers']
            },
            risk_assessment: 'Medium risk due to technological complexity and inter-service coordination requirements'
          },
          {
            plan_name: 'Joint Readiness Enhancement',
            plan_type: 'training',
            priority_level: 'medium',
            lead_service: 'army',
            participating_services: ['army', 'navy', 'air_force', 'marines'],
            objectives: [
              'Improve inter-service coordination',
              'Standardize joint operation procedures',
              'Enhance rapid deployment capabilities'
            ],
            timeline_months: 12,
            resource_requirements: {
              personnel: 25000,
              budget: 2000000000,
              equipment: ['Training Simulators', 'Communication Systems', 'Transport Vehicles']
            },
            risk_assessment: 'Low risk with high potential for improved operational effectiveness'
          }
        ];

        for (const plan of samplePlans) {
          await client.query(`
            INSERT INTO strategic_plans (
              civilization_id, plan_name, plan_type, priority_level,
              lead_service, participating_services, objectives, timeline_months,
              resource_requirements, risk_assessment, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            civId, plan.plan_name, plan.plan_type, plan.priority_level,
            plan.lead_service, plan.participating_services, plan.objectives,
            plan.timeline_months, JSON.stringify(plan.resource_requirements),
            plan.risk_assessment, chairmanId.rows[0].id
          ]);
        }
      }
    }

    console.log('Joint Chiefs seed data inserted successfully');

  } catch (error) {
    console.error('Error seeding Joint Chiefs data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// TypeScript interfaces
export interface JointChief {
  id: number;
  civilization_id: number;
  position: 'chairman' | 'vice_chairman' | 'service_chief';
  service_branch?: string;
  name: string;
  rank: string;
  years_of_service: number;
  specializations: string[];
  background: string;
  appointment_date: Date;
  status: 'active' | 'retired' | 'reassigned';
  created_at: Date;
  updated_at: Date;
}

export interface MilitaryService {
  id: number;
  civilization_id: number;
  service_name: string;
  service_code: string;
  chief_id?: number;
  personnel_count: number;
  active_units: number;
  budget_allocation: number;
  readiness_level: 'low' | 'moderate' | 'high' | 'critical';
  primary_mission: string;
  capabilities: string[];
  created_at: Date;
  updated_at: Date;
}

export interface StrategicPlan {
  id: number;
  civilization_id: number;
  plan_name: string;
  plan_type: string;
  status: 'draft' | 'under_review' | 'approved' | 'active' | 'completed' | 'cancelled';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  lead_service?: string;
  participating_services: string[];
  objectives: string[];
  timeline_months?: number;
  resource_requirements: any;
  risk_assessment?: string;
  approval_required_from: string[];
  approved_by: string[];
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface JointOperation {
  id: number;
  civilization_id: number;
  operation_name: string;
  operation_type: string;
  status: 'planning' | 'approved' | 'active' | 'completed' | 'cancelled';
  commanding_service: string;
  participating_services: string[];
  start_date?: Date;
  end_date?: Date;
  location?: string;
  objectives: string[];
  personnel_assigned: number;
  units_involved: string[];
  success_metrics: any;
  after_action_report?: string;
  lessons_learned: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CommandRecommendation {
  id: number;
  civilization_id: number;
  recommending_officer: number;
  recommendation_type: string;
  title: string;
  description: string;
  rationale?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  target_audience: string[];
  implementation_timeline?: string;
  resource_impact?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  response_from?: string;
  response_notes?: string;
  created_at: Date;
  updated_at: Date;
}
