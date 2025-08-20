import { Pool, PoolClient } from 'pg';

/**
 * Initialize Interior Department database schema
 * Manages infrastructure, public works, resource development, and domestic development
 */
export async function initializeInteriorSchema(pool: Pool): Promise<void> {
  const client: PoolClient = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Infrastructure Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS infrastructure_projects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        type VARCHAR(100) NOT NULL CHECK (type IN ('transportation', 'utilities', 'public_works', 'development', 'defense', 'communications')),
        category VARCHAR(100) NOT NULL,
        description TEXT,
        location_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'in_progress', 'completed', 'cancelled', 'suspended')),
        priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        
        -- Budget & Resources
        estimated_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
        actual_cost DECIMAL(15,2) DEFAULT 0,
        budget_source VARCHAR(100) NOT NULL DEFAULT 'federal' CHECK (budget_source IN ('federal', 'state', 'local', 'private', 'mixed')),
        resource_requirements JSONB DEFAULT '{}',
        
        -- Timeline
        planned_start_date TIMESTAMP,
        actual_start_date TIMESTAMP,
        planned_completion_date TIMESTAMP,
        actual_completion_date TIMESTAMP,
        
        -- Progress Tracking
        progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
        milestones JSONB DEFAULT '[]',
        current_phase VARCHAR(100),
        
        -- Impact & Benefits
        expected_benefits JSONB DEFAULT '{}',
        actual_benefits JSONB DEFAULT '{}',
        affected_population INTEGER DEFAULT 0,
        economic_impact JSONB DEFAULT '{}',
        
        -- Management
        project_manager VARCHAR(255),
        contractor_info JSONB DEFAULT '{}',
        approval_chain JSONB DEFAULT '[]',
        
        -- Metadata
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Infrastructure Assets Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS infrastructure_assets (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        type VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL CHECK (category IN ('transportation', 'utilities', 'public_services', 'defense', 'communications', 'energy')),
        location_id VARCHAR(255) NOT NULL,
        
        -- Asset Condition
        condition_rating DECIMAL(3,2) DEFAULT 1.00 CHECK (condition_rating >= 0 AND condition_rating <= 1),
        operational_status VARCHAR(50) DEFAULT 'operational' CHECK (operational_status IN ('operational', 'limited', 'maintenance', 'offline', 'damaged', 'destroyed')),
        last_inspection TIMESTAMP,
        next_maintenance TIMESTAMP,
        
        -- Capacity & Utilization
        design_capacity INTEGER DEFAULT 0,
        current_utilization INTEGER DEFAULT 0,
        efficiency_rating DECIMAL(3,2) DEFAULT 1.00 CHECK (efficiency_rating >= 0 AND efficiency_rating <= 1),
        
        -- Financial
        construction_cost DECIMAL(15,2) DEFAULT 0,
        annual_maintenance_cost DECIMAL(15,2) DEFAULT 0,
        replacement_value DECIMAL(15,2) DEFAULT 0,
        
        -- Performance Metrics
        service_level JSONB DEFAULT '{}',
        performance_indicators JSONB DEFAULT '{}',
        user_satisfaction DECIMAL(3,2) DEFAULT 0.5 CHECK (user_satisfaction >= 0 AND user_satisfaction <= 1),
        
        -- Dependencies
        connected_assets JSONB DEFAULT '[]',
        critical_dependencies JSONB DEFAULT '[]',
        
        -- Metadata
        construction_date TIMESTAMP,
        expected_lifespan INTEGER DEFAULT 50,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Resource Development Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resource_development (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        type VARCHAR(100) NOT NULL CHECK (type IN ('mining', 'extraction', 'processing', 'conservation', 'agriculture', 'energy')),
        resource_type VARCHAR(100) NOT NULL,
        location_id VARCHAR(255) NOT NULL,
        
        -- Development Status
        status VARCHAR(50) DEFAULT 'surveying' CHECK (status IN ('surveying', 'planning', 'developing', 'operational', 'depleted', 'suspended', 'decommissioned')),
        development_phase VARCHAR(100),
        
        -- Resource Information
        estimated_reserves DECIMAL(15,2) DEFAULT 0,
        extraction_rate DECIMAL(10,2) DEFAULT 0,
        processing_capacity DECIMAL(10,2) DEFAULT 0,
        current_output DECIMAL(10,2) DEFAULT 0,
        
        -- Environmental Impact
        environmental_impact_score DECIMAL(3,2) DEFAULT 0.5 CHECK (environmental_impact_score >= 0 AND environmental_impact_score <= 1),
        mitigation_measures JSONB DEFAULT '[]',
        restoration_plan JSONB DEFAULT '{}',
        
        -- Economics
        development_cost DECIMAL(15,2) DEFAULT 0,
        operational_cost DECIMAL(10,2) DEFAULT 0,
        revenue_per_unit DECIMAL(8,2) DEFAULT 0,
        
        -- Permits & Compliance
        permits JSONB DEFAULT '[]',
        compliance_status VARCHAR(50) DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'conditional', 'denied', 'expired')),
        regulatory_requirements JSONB DEFAULT '[]',
        
        -- Metadata
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Public Works Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public_works_orders (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        type VARCHAR(100) NOT NULL CHECK (type IN ('construction', 'maintenance', 'repair', 'upgrade', 'demolition', 'inspection')),
        priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical', 'emergency')),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')),
        
        -- Target Information
        target_asset_id VARCHAR(255),
        target_project_id VARCHAR(255),
        location_id VARCHAR(255) NOT NULL,
        
        -- Resource Requirements
        labor_hours INTEGER DEFAULT 0,
        materials_needed JSONB DEFAULT '{}',
        equipment_required JSONB DEFAULT '[]',
        estimated_cost DECIMAL(10,2) DEFAULT 0,
        actual_cost DECIMAL(10,2) DEFAULT 0,
        
        -- Scheduling
        requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        scheduled_date TIMESTAMP,
        completion_date TIMESTAMP,
        
        -- Assignment
        assigned_crew JSONB DEFAULT '[]',
        supervisor VARCHAR(255),
        contractor VARCHAR(255),
        
        -- Progress
        work_completed JSONB DEFAULT '{}',
        issues_encountered JSONB DEFAULT '[]',
        quality_assessment JSONB DEFAULT '{}',
        
        -- Metadata
        requested_by VARCHAR(255) NOT NULL,
        approved_by VARCHAR(255),
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Infrastructure Performance Metrics Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS infrastructure_performance_metrics (
        id VARCHAR(255) PRIMARY KEY,
        asset_id VARCHAR(255) NOT NULL,
        metric_type VARCHAR(100) NOT NULL,
        metric_name VARCHAR(200) NOT NULL,
        value DECIMAL(15,4) NOT NULL,
        unit VARCHAR(50),
        target_value DECIMAL(15,4),
        benchmark_value DECIMAL(15,4),
        measurement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        -- Context
        conditions JSONB DEFAULT '{}',
        notes TEXT,
        
        -- Metadata
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Infrastructure Maintenance Schedule Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS infrastructure_maintenance_schedule (
        id VARCHAR(255) PRIMARY KEY,
        asset_id VARCHAR(255) NOT NULL,
        maintenance_type VARCHAR(100) NOT NULL CHECK (maintenance_type IN ('routine', 'preventive', 'corrective', 'emergency', 'overhaul')),
        description TEXT,
        
        -- Scheduling
        scheduled_date TIMESTAMP NOT NULL,
        estimated_duration INTEGER NOT NULL DEFAULT 0, -- hours
        frequency_days INTEGER, -- for recurring maintenance
        
        -- Resources
        required_crew JSONB DEFAULT '[]',
        required_materials JSONB DEFAULT '{}',
        required_equipment JSONB DEFAULT '[]',
        estimated_cost DECIMAL(10,2) DEFAULT 0,
        
        -- Status
        status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue')),
        completion_date TIMESTAMP,
        actual_cost DECIMAL(10,2),
        
        -- Results
        work_performed JSONB DEFAULT '{}',
        condition_after DECIMAL(3,2),
        issues_found JSONB DEFAULT '[]',
        recommendations JSONB DEFAULT '[]',
        
        -- Metadata
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_projects_campaign 
      ON infrastructure_projects(campaign_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_projects_civilization 
      ON infrastructure_projects(civilization_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_projects_status 
      ON infrastructure_projects(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_projects_type 
      ON infrastructure_projects(type);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_projects_location 
      ON infrastructure_projects(location_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_campaign 
      ON infrastructure_assets(campaign_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_civilization 
      ON infrastructure_assets(civilization_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_category 
      ON infrastructure_assets(category);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_status 
      ON infrastructure_assets(operational_status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_location 
      ON infrastructure_assets(location_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resource_development_campaign 
      ON resource_development(campaign_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resource_development_civilization 
      ON resource_development(civilization_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resource_development_type 
      ON resource_development(type);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resource_development_status 
      ON resource_development(status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_public_works_orders_campaign 
      ON public_works_orders(campaign_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_public_works_orders_civilization 
      ON public_works_orders(civilization_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_public_works_orders_status 
      ON public_works_orders(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_public_works_orders_priority 
      ON public_works_orders(priority);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_public_works_orders_scheduled 
      ON public_works_orders(scheduled_date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_performance_asset 
      ON infrastructure_performance_metrics(asset_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_performance_date 
      ON infrastructure_performance_metrics(measurement_date);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_performance_type 
      ON infrastructure_performance_metrics(metric_type);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_maintenance_asset 
      ON infrastructure_maintenance_schedule(asset_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_maintenance_scheduled 
      ON infrastructure_maintenance_schedule(scheduled_date);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_infrastructure_maintenance_status 
      ON infrastructure_maintenance_schedule(status);
    `);

    await client.query('COMMIT');
    console.log('✅ Interior Department schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Interior Department schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
