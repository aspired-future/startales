import { Pool } from 'pg';

// ===== INTERFACES =====

export interface InfrastructureProject {
  id: string;
  name: string;
  type: 'transportation' | 'utilities' | 'public_works' | 'development' | 'defense' | 'communications';
  category: string;
  description?: string;
  location_id: string;
  status: 'planned' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Budget & Resources
  estimated_cost: number;
  actual_cost?: number;
  budget_source: 'federal' | 'state' | 'local' | 'private' | 'mixed';
  resource_requirements: Record<string, any>;
  
  // Timeline
  planned_start_date?: Date;
  actual_start_date?: Date;
  planned_completion_date?: Date;
  actual_completion_date?: Date;
  
  // Progress
  progress_percentage: number;
  milestones: any[];
  current_phase?: string;
  
  // Impact
  expected_benefits: Record<string, any>;
  actual_benefits: Record<string, any>;
  affected_population: number;
  economic_impact: Record<string, any>;
  
  // Management
  project_manager?: string;
  contractor_info: Record<string, any>;
  approval_chain: any[];
  
  // Metadata
  campaign_id: number;
  civilization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: string;
  category: 'transportation' | 'utilities' | 'public_services' | 'defense' | 'communications' | 'energy';
  location_id: string;
  
  // Condition
  condition_rating: number; // 0-1
  operational_status: 'operational' | 'limited' | 'maintenance' | 'offline' | 'damaged' | 'destroyed';
  last_inspection?: Date;
  next_maintenance?: Date;
  
  // Capacity
  design_capacity: number;
  current_utilization: number;
  efficiency_rating: number; // 0-1
  
  // Financial
  construction_cost: number;
  annual_maintenance_cost: number;
  replacement_value: number;
  
  // Performance
  service_level: Record<string, any>;
  performance_indicators: Record<string, any>;
  user_satisfaction: number; // 0-1
  
  // Dependencies
  connected_assets: string[];
  critical_dependencies: string[];
  
  // Metadata
  construction_date?: Date;
  expected_lifespan: number;
  campaign_id: number;
  civilization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResourceDevelopment {
  id: string;
  name: string;
  type: 'mining' | 'extraction' | 'processing' | 'conservation' | 'agriculture' | 'energy';
  resource_type: string;
  location_id: string;
  
  // Status
  status: 'surveying' | 'planning' | 'developing' | 'operational' | 'depleted' | 'suspended' | 'decommissioned';
  development_phase?: string;
  
  // Resource Info
  estimated_reserves: number;
  extraction_rate: number;
  processing_capacity: number;
  current_output: number;
  
  // Environmental
  environmental_impact_score: number; // 0-1
  mitigation_measures: any[];
  restoration_plan: Record<string, any>;
  
  // Economics
  development_cost: number;
  operational_cost: number;
  revenue_per_unit: number;
  
  // Compliance
  permits: any[];
  compliance_status: 'pending' | 'approved' | 'conditional' | 'denied' | 'expired';
  regulatory_requirements: any[];
  
  // Metadata
  campaign_id: number;
  civilization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicWorksOrder {
  id: string;
  title: string;
  description?: string;
  type: 'construction' | 'maintenance' | 'repair' | 'upgrade' | 'demolition' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  
  // Target
  target_asset_id?: string;
  target_project_id?: string;
  location_id: string;
  
  // Resources
  labor_hours: number;
  materials_needed: Record<string, any>;
  equipment_required: any[];
  estimated_cost: number;
  actual_cost?: number;
  
  // Scheduling
  requested_date: Date;
  scheduled_date?: Date;
  completion_date?: Date;
  
  // Assignment
  assigned_crew: any[];
  supervisor?: string;
  contractor?: string;
  
  // Progress
  work_completed: Record<string, any>;
  issues_encountered: any[];
  quality_assessment: Record<string, any>;
  
  // Metadata
  requested_by: string;
  approved_by?: string;
  campaign_id: number;
  civilization_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface InteriorDashboard {
  // Overview
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_budget: number;
  spent_budget: number;
  
  // Infrastructure Health
  infrastructure_condition_avg: number;
  assets_needing_maintenance: number;
  critical_infrastructure_issues: number;
  
  // Resource Development
  active_resource_operations: number;
  total_resource_output: number;
  environmental_compliance_rate: number;
  
  // Public Works
  pending_work_orders: number;
  in_progress_work_orders: number;
  overdue_work_orders: number;
  
  // Performance Metrics
  citizen_satisfaction: number;
  infrastructure_utilization: number;
  maintenance_efficiency: number;
  
  // Recent Activity
  recent_projects: InfrastructureProject[];
  urgent_maintenance: any[];
  upcoming_milestones: any[];
}

// ===== SERVICE CLASS =====

export class InteriorSecretaryService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // ===== INFRASTRUCTURE PROJECT MANAGEMENT =====

  async createInfrastructureProject(project: Omit<InfrastructureProject, 'id' | 'created_at' | 'updated_at'>): Promise<InfrastructureProject> {
    const client = await this.pool.connect();
    try {
      const id = `infra_proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO infrastructure_projects (
          id, name, type, category, description, location_id, status, priority,
          estimated_cost, actual_cost, budget_source, resource_requirements,
          planned_start_date, actual_start_date, planned_completion_date, actual_completion_date,
          progress_percentage, milestones, current_phase,
          expected_benefits, actual_benefits, affected_population, economic_impact,
          project_manager, contractor_info, approval_chain,
          campaign_id, civilization_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28
        ) RETURNING *
      `, [
        id, project.name, project.type, project.category, project.description, project.location_id,
        project.status, project.priority, project.estimated_cost, project.actual_cost,
        project.budget_source, JSON.stringify(project.resource_requirements),
        project.planned_start_date, project.actual_start_date, project.planned_completion_date, project.actual_completion_date,
        project.progress_percentage, JSON.stringify(project.milestones), project.current_phase,
        JSON.stringify(project.expected_benefits), JSON.stringify(project.actual_benefits),
        project.affected_population, JSON.stringify(project.economic_impact),
        project.project_manager, JSON.stringify(project.contractor_info), JSON.stringify(project.approval_chain),
        project.campaign_id, project.civilization_id
      ]);

      return this.mapProjectRow(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getInfrastructureProjects(civilizationId: string, campaignId: number, filters?: {
    status?: string;
    type?: string;
    priority?: string;
  }): Promise<InfrastructureProject[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM infrastructure_projects 
        WHERE civilization_id = $1 AND campaign_id = $2
      `;
      const params: any[] = [civilizationId, campaignId];
      let paramIndex = 3;

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }
      if (filters?.type) {
        query += ` AND type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }
      if (filters?.priority) {
        query += ` AND priority = $${paramIndex}`;
        params.push(filters.priority);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapProjectRow(row));
    } finally {
      client.release();
    }
  }

  async updateInfrastructureProject(id: string, updates: Partial<InfrastructureProject>): Promise<InfrastructureProject> {
    const client = await this.pool.connect();
    try {
      const setClause: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at' && value !== undefined) {
          if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
            setClause.push(`${key} = $${paramIndex}`);
            params.push(JSON.stringify(value));
          } else {
            setClause.push(`${key} = $${paramIndex}`);
            params.push(value);
          }
          paramIndex++;
        }
      });

      setClause.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(id);

      const result = await client.query(`
        UPDATE infrastructure_projects 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, params);

      if (result.rows.length === 0) {
        throw new Error(`Infrastructure project ${id} not found`);
      }

      return this.mapProjectRow(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ===== INFRASTRUCTURE ASSET MANAGEMENT =====

  async createInfrastructureAsset(asset: Omit<InfrastructureAsset, 'id' | 'created_at' | 'updated_at'>): Promise<InfrastructureAsset> {
    const client = await this.pool.connect();
    try {
      const id = `infra_asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO infrastructure_assets (
          id, name, type, category, location_id,
          condition_rating, operational_status, last_inspection, next_maintenance,
          design_capacity, current_utilization, efficiency_rating,
          construction_cost, annual_maintenance_cost, replacement_value,
          service_level, performance_indicators, user_satisfaction,
          connected_assets, critical_dependencies,
          construction_date, expected_lifespan, campaign_id, civilization_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        ) RETURNING *
      `, [
        id, asset.name, asset.type, asset.category, asset.location_id,
        asset.condition_rating, asset.operational_status, asset.last_inspection, asset.next_maintenance,
        asset.design_capacity, asset.current_utilization, asset.efficiency_rating,
        asset.construction_cost, asset.annual_maintenance_cost, asset.replacement_value,
        JSON.stringify(asset.service_level), JSON.stringify(asset.performance_indicators), asset.user_satisfaction,
        JSON.stringify(asset.connected_assets), JSON.stringify(asset.critical_dependencies),
        asset.construction_date, asset.expected_lifespan, asset.campaign_id, asset.civilization_id
      ]);

      return this.mapAssetRow(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getInfrastructureAssets(civilizationId: string, campaignId: number, filters?: {
    category?: string;
    status?: string;
    location?: string;
  }): Promise<InfrastructureAsset[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM infrastructure_assets 
        WHERE civilization_id = $1 AND campaign_id = $2
      `;
      const params: any[] = [civilizationId, campaignId];
      let paramIndex = 3;

      if (filters?.category) {
        query += ` AND category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }
      if (filters?.status) {
        query += ` AND operational_status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }
      if (filters?.location) {
        query += ` AND location_id = $${paramIndex}`;
        params.push(filters.location);
        paramIndex++;
      }

      query += ` ORDER BY name ASC`;

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapAssetRow(row));
    } finally {
      client.release();
    }
  }

  // ===== RESOURCE DEVELOPMENT MANAGEMENT =====

  async createResourceDevelopment(resource: Omit<ResourceDevelopment, 'id' | 'created_at' | 'updated_at'>): Promise<ResourceDevelopment> {
    const client = await this.pool.connect();
    try {
      const id = `resource_dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO resource_development (
          id, name, type, resource_type, location_id, status, development_phase,
          estimated_reserves, extraction_rate, processing_capacity, current_output,
          environmental_impact_score, mitigation_measures, restoration_plan,
          development_cost, operational_cost, revenue_per_unit,
          permits, compliance_status, regulatory_requirements,
          campaign_id, civilization_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        ) RETURNING *
      `, [
        id, resource.name, resource.type, resource.resource_type, resource.location_id,
        resource.status, resource.development_phase,
        resource.estimated_reserves, resource.extraction_rate, resource.processing_capacity, resource.current_output,
        resource.environmental_impact_score, JSON.stringify(resource.mitigation_measures), JSON.stringify(resource.restoration_plan),
        resource.development_cost, resource.operational_cost, resource.revenue_per_unit,
        JSON.stringify(resource.permits), resource.compliance_status, JSON.stringify(resource.regulatory_requirements),
        resource.campaign_id, resource.civilization_id
      ]);

      return this.mapResourceRow(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getResourceDevelopments(civilizationId: string, campaignId: number, filters?: {
    type?: string;
    status?: string;
    resource_type?: string;
  }): Promise<ResourceDevelopment[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM resource_development 
        WHERE civilization_id = $1 AND campaign_id = $2
      `;
      const params: any[] = [civilizationId, campaignId];
      let paramIndex = 3;

      if (filters?.type) {
        query += ` AND type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }
      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }
      if (filters?.resource_type) {
        query += ` AND resource_type = $${paramIndex}`;
        params.push(filters.resource_type);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapResourceRow(row));
    } finally {
      client.release();
    }
  }

  // ===== PUBLIC WORKS MANAGEMENT =====

  async createPublicWorksOrder(order: Omit<PublicWorksOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PublicWorksOrder> {
    const client = await this.pool.connect();
    try {
      const id = `work_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO public_works_orders (
          id, title, description, type, priority, status,
          target_asset_id, target_project_id, location_id,
          labor_hours, materials_needed, equipment_required, estimated_cost, actual_cost,
          requested_date, scheduled_date, completion_date,
          assigned_crew, supervisor, contractor,
          work_completed, issues_encountered, quality_assessment,
          requested_by, approved_by, campaign_id, civilization_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
        ) RETURNING *
      `, [
        id, order.title, order.description, order.type, order.priority, order.status,
        order.target_asset_id, order.target_project_id, order.location_id,
        order.labor_hours, JSON.stringify(order.materials_needed), JSON.stringify(order.equipment_required),
        order.estimated_cost, order.actual_cost,
        order.requested_date, order.scheduled_date, order.completion_date,
        JSON.stringify(order.assigned_crew), order.supervisor, order.contractor,
        JSON.stringify(order.work_completed), JSON.stringify(order.issues_encountered), JSON.stringify(order.quality_assessment),
        order.requested_by, order.approved_by, order.campaign_id, order.civilization_id
      ]);

      return this.mapWorkOrderRow(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getPublicWorksOrders(civilizationId: string, campaignId: number, filters?: {
    status?: string;
    priority?: string;
    type?: string;
  }): Promise<PublicWorksOrder[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM public_works_orders 
        WHERE civilization_id = $1 AND campaign_id = $2
      `;
      const params: any[] = [civilizationId, campaignId];
      let paramIndex = 3;

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }
      if (filters?.priority) {
        query += ` AND priority = $${paramIndex}`;
        params.push(filters.priority);
        paramIndex++;
      }
      if (filters?.type) {
        query += ` AND type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }

      query += ` ORDER BY priority DESC, requested_date DESC`;

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapWorkOrderRow(row));
    } finally {
      client.release();
    }
  }

  // ===== DASHBOARD & ANALYTICS =====

  async getDashboard(civilizationId: string, campaignId: number): Promise<InteriorDashboard> {
    const client = await this.pool.connect();
    try {
      // Get project statistics
      const projectStats = await client.query(`
        SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN status IN ('approved', 'in_progress') THEN 1 END) as active_projects,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
          COALESCE(SUM(estimated_cost), 0) as total_budget,
          COALESCE(SUM(actual_cost), 0) as spent_budget
        FROM infrastructure_projects 
        WHERE civilization_id = $1 AND campaign_id = $2
      `, [civilizationId, campaignId]);

      // Get infrastructure health
      const infraHealth = await client.query(`
        SELECT 
          COALESCE(AVG(condition_rating), 0) as infrastructure_condition_avg,
          COUNT(CASE WHEN next_maintenance < CURRENT_TIMESTAMP THEN 1 END) as assets_needing_maintenance,
          COUNT(CASE WHEN condition_rating < 0.3 OR operational_status IN ('damaged', 'offline') THEN 1 END) as critical_infrastructure_issues
        FROM infrastructure_assets 
        WHERE civilization_id = $1 AND campaign_id = $2
      `, [civilizationId, campaignId]);

      // Get resource development stats
      const resourceStats = await client.query(`
        SELECT 
          COUNT(CASE WHEN status = 'operational' THEN 1 END) as active_resource_operations,
          COALESCE(SUM(current_output), 0) as total_resource_output,
          COALESCE(AVG(CASE WHEN compliance_status = 'approved' THEN 1.0 ELSE 0.0 END), 0) as environmental_compliance_rate
        FROM resource_development 
        WHERE civilization_id = $1 AND campaign_id = $2
      `, [civilizationId, campaignId]);

      // Get work order stats
      const workOrderStats = await client.query(`
        SELECT 
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_work_orders,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_work_orders,
          COUNT(CASE WHEN status = 'pending' AND scheduled_date < CURRENT_TIMESTAMP THEN 1 END) as overdue_work_orders
        FROM public_works_orders 
        WHERE civilization_id = $1 AND campaign_id = $2
      `, [civilizationId, campaignId]);

      // Get recent projects
      const recentProjects = await client.query(`
        SELECT * FROM infrastructure_projects 
        WHERE civilization_id = $1 AND campaign_id = $2
        ORDER BY created_at DESC 
        LIMIT 5
      `, [civilizationId, campaignId]);

      const stats = projectStats.rows[0];
      const health = infraHealth.rows[0];
      const resources = resourceStats.rows[0];
      const workOrders = workOrderStats.rows[0];

      return {
        // Overview
        total_projects: parseInt(stats.total_projects) || 0,
        active_projects: parseInt(stats.active_projects) || 0,
        completed_projects: parseInt(stats.completed_projects) || 0,
        total_budget: parseFloat(stats.total_budget) || 0,
        spent_budget: parseFloat(stats.spent_budget) || 0,
        
        // Infrastructure Health
        infrastructure_condition_avg: parseFloat(health.infrastructure_condition_avg) || 0,
        assets_needing_maintenance: parseInt(health.assets_needing_maintenance) || 0,
        critical_infrastructure_issues: parseInt(health.critical_infrastructure_issues) || 0,
        
        // Resource Development
        active_resource_operations: parseInt(resources.active_resource_operations) || 0,
        total_resource_output: parseFloat(resources.total_resource_output) || 0,
        environmental_compliance_rate: parseFloat(resources.environmental_compliance_rate) || 0,
        
        // Public Works
        pending_work_orders: parseInt(workOrders.pending_work_orders) || 0,
        in_progress_work_orders: parseInt(workOrders.in_progress_work_orders) || 0,
        overdue_work_orders: parseInt(workOrders.overdue_work_orders) || 0,
        
        // Performance Metrics (calculated)
        citizen_satisfaction: 0.75, // Placeholder - would be calculated from various factors
        infrastructure_utilization: 0.68, // Placeholder - would be calculated from asset utilization
        maintenance_efficiency: 0.82, // Placeholder - would be calculated from maintenance completion rates
        
        // Recent Activity
        recent_projects: recentProjects.rows.map(row => this.mapProjectRow(row)),
        urgent_maintenance: [], // Placeholder - would be populated with urgent maintenance items
        upcoming_milestones: [] // Placeholder - would be populated with upcoming project milestones
      };
    } finally {
      client.release();
    }
  }

  // ===== HELPER METHODS =====

  private mapProjectRow(row: any): InfrastructureProject {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      description: row.description,
      location_id: row.location_id,
      status: row.status,
      priority: row.priority,
      estimated_cost: parseFloat(row.estimated_cost) || 0,
      actual_cost: row.actual_cost ? parseFloat(row.actual_cost) : undefined,
      budget_source: row.budget_source,
      resource_requirements: row.resource_requirements || {},
      planned_start_date: row.planned_start_date,
      actual_start_date: row.actual_start_date,
      planned_completion_date: row.planned_completion_date,
      actual_completion_date: row.actual_completion_date,
      progress_percentage: parseInt(row.progress_percentage) || 0,
      milestones: row.milestones || [],
      current_phase: row.current_phase,
      expected_benefits: row.expected_benefits || {},
      actual_benefits: row.actual_benefits || {},
      affected_population: parseInt(row.affected_population) || 0,
      economic_impact: row.economic_impact || {},
      project_manager: row.project_manager,
      contractor_info: row.contractor_info || {},
      approval_chain: row.approval_chain || [],
      campaign_id: parseInt(row.campaign_id),
      civilization_id: row.civilization_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapAssetRow(row: any): InfrastructureAsset {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      location_id: row.location_id,
      condition_rating: parseFloat(row.condition_rating) || 0,
      operational_status: row.operational_status,
      last_inspection: row.last_inspection,
      next_maintenance: row.next_maintenance,
      design_capacity: parseInt(row.design_capacity) || 0,
      current_utilization: parseInt(row.current_utilization) || 0,
      efficiency_rating: parseFloat(row.efficiency_rating) || 0,
      construction_cost: parseFloat(row.construction_cost) || 0,
      annual_maintenance_cost: parseFloat(row.annual_maintenance_cost) || 0,
      replacement_value: parseFloat(row.replacement_value) || 0,
      service_level: row.service_level || {},
      performance_indicators: row.performance_indicators || {},
      user_satisfaction: parseFloat(row.user_satisfaction) || 0,
      connected_assets: row.connected_assets || [],
      critical_dependencies: row.critical_dependencies || [],
      construction_date: row.construction_date,
      expected_lifespan: parseInt(row.expected_lifespan) || 50,
      campaign_id: parseInt(row.campaign_id),
      civilization_id: row.civilization_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapResourceRow(row: any): ResourceDevelopment {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      resource_type: row.resource_type,
      location_id: row.location_id,
      status: row.status,
      development_phase: row.development_phase,
      estimated_reserves: parseFloat(row.estimated_reserves) || 0,
      extraction_rate: parseFloat(row.extraction_rate) || 0,
      processing_capacity: parseFloat(row.processing_capacity) || 0,
      current_output: parseFloat(row.current_output) || 0,
      environmental_impact_score: parseFloat(row.environmental_impact_score) || 0,
      mitigation_measures: row.mitigation_measures || [],
      restoration_plan: row.restoration_plan || {},
      development_cost: parseFloat(row.development_cost) || 0,
      operational_cost: parseFloat(row.operational_cost) || 0,
      revenue_per_unit: parseFloat(row.revenue_per_unit) || 0,
      permits: row.permits || [],
      compliance_status: row.compliance_status,
      regulatory_requirements: row.regulatory_requirements || [],
      campaign_id: parseInt(row.campaign_id),
      civilization_id: row.civilization_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapWorkOrderRow(row: any): PublicWorksOrder {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      priority: row.priority,
      status: row.status,
      target_asset_id: row.target_asset_id,
      target_project_id: row.target_project_id,
      location_id: row.location_id,
      labor_hours: parseInt(row.labor_hours) || 0,
      materials_needed: row.materials_needed || {},
      equipment_required: row.equipment_required || [],
      estimated_cost: parseFloat(row.estimated_cost) || 0,
      actual_cost: row.actual_cost ? parseFloat(row.actual_cost) : undefined,
      requested_date: row.requested_date,
      scheduled_date: row.scheduled_date,
      completion_date: row.completion_date,
      assigned_crew: row.assigned_crew || [],
      supervisor: row.supervisor,
      contractor: row.contractor,
      work_completed: row.work_completed || {},
      issues_encountered: row.issues_encountered || [],
      quality_assessment: row.quality_assessment || {},
      requested_by: row.requested_by,
      approved_by: row.approved_by,
      campaign_id: parseInt(row.campaign_id),
      civilization_id: row.civilization_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}
