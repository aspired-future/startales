import { Router, Request, Response } from 'express';
import { getPool } from '../storage/db';
import { InteriorSecretaryService } from './InteriorSecretaryService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for Interior Department System
const interiorKnobsData = {
  // Natural Resources & Conservation
  conservation_priority: 0.8,             // Natural resource conservation and protection priority
  renewable_energy_development: 0.7,      // Renewable energy development and promotion
  fossil_fuel_extraction_regulation: 0.6, // Fossil fuel extraction regulation and oversight
  
  // Public Lands & National Parks
  public_land_protection: 0.8,            // Public land protection and preservation
  national_park_funding: 0.8,             // National park system funding and maintenance
  recreational_access_balance: 0.7,       // Recreation access vs conservation balance
  
  // Infrastructure Development
  infrastructure_investment_level: 0.7,   // Infrastructure development and investment level
  transportation_network_expansion: 0.6,  // Transportation network expansion and modernization
  utility_infrastructure_modernization: 0.7, // Utility infrastructure modernization and reliability
  
  // Environmental Protection & Regulation
  environmental_regulation_strictness: 0.8, // Environmental regulation strictness and enforcement
  pollution_control_measures: 0.8,        // Pollution control and remediation measures
  climate_change_adaptation: 0.7,         // Climate change adaptation and resilience planning
  
  // Water Resources Management
  water_resource_conservation: 0.8,       // Water resource conservation and management
  watershed_protection: 0.8,              // Watershed protection and restoration
  water_quality_standards: 0.9,           // Water quality standards and monitoring
  
  // Mining & Mineral Resources
  mining_regulation_strictness: 0.7,      // Mining operation regulation and oversight
  mineral_extraction_sustainability: 0.7, // Mineral extraction sustainability requirements
  mining_safety_standards: 0.9,           // Mining safety standards and enforcement
  
  // Wildlife & Ecosystem Management
  wildlife_protection_priority: 0.8,      // Wildlife protection and habitat conservation
  endangered_species_protection: 0.9,     // Endangered species protection and recovery
  ecosystem_restoration_investment: 0.7,  // Ecosystem restoration and rehabilitation investment
  
  // Indigenous Affairs & Tribal Relations
  tribal_sovereignty_respect: 0.8,        // Tribal sovereignty and self-determination respect
  indigenous_land_rights_protection: 0.8, // Indigenous land rights protection and recognition
  tribal_consultation_requirements: 0.8,  // Tribal consultation and engagement requirements
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Interior Department
const interiorKnobSystem = new EnhancedKnobSystem(interiorKnobsData);

// Apply interior department knobs to game state
function applyInteriorKnobsToGameState() {
  const knobs = interiorKnobSystem.knobs;
  
  // Apply natural resources settings
  const naturalResources = (knobs.conservation_priority + knobs.renewable_energy_development + 
    knobs.fossil_fuel_extraction_regulation) / 3;
  
  // Apply public lands settings
  const publicLands = (knobs.public_land_protection + knobs.national_park_funding + 
    knobs.recreational_access_balance) / 3;
  
  // Apply infrastructure settings
  const infrastructure = (knobs.infrastructure_investment_level + knobs.transportation_network_expansion + 
    knobs.utility_infrastructure_modernization) / 3;
  
  // Apply environmental protection settings
  const environmentalProtection = (knobs.environmental_regulation_strictness + knobs.pollution_control_measures + 
    knobs.climate_change_adaptation) / 3;
  
  // Apply water resources settings
  const waterResources = (knobs.water_resource_conservation + knobs.watershed_protection + 
    knobs.water_quality_standards) / 3;
  
  // Apply wildlife management settings
  const wildlifeManagement = (knobs.wildlife_protection_priority + knobs.endangered_species_protection + 
    knobs.ecosystem_restoration_investment) / 3;
  
  console.log('Applied interior department knobs to game state:', {
    naturalResources,
    publicLands,
    infrastructure,
    environmentalProtection,
    waterResources,
    wildlifeManagement
  });
}

const interiorService = new InteriorSecretaryService(getPool());

// ===== DASHBOARD & OVERVIEW =====

/**
 * GET /api/interior/dashboard
 * Get comprehensive Interior Department dashboard
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const civilizationId = req.query.civilization_id as string || 'civ_1';
    const campaignId = parseInt(req.query.campaign_id as string) || 1;

    const dashboard = await interiorService.getDashboard(civilizationId, campaignId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Interior dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Interior Department dashboard'
    });
  }
});

// ===== INFRASTRUCTURE PROJECTS =====

/**
 * GET /api/interior/projects
 * List infrastructure projects with optional filtering
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const civilizationId = req.query.civilization_id as string || 'civ_1';
    const campaignId = parseInt(req.query.campaign_id as string) || 1;
    
    const filters = {
      status: req.query.status as string,
      type: req.query.type as string,
      priority: req.query.priority as string
    };

    const projects = await interiorService.getInfrastructureProjects(civilizationId, campaignId, filters);
    
    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Get infrastructure projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get infrastructure projects'
    });
  }
});

/**
 * POST /api/interior/projects
 * Create new infrastructure project
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      category,
      description,
      location_id,
      priority = 'medium',
      estimated_cost,
      budget_source = 'federal',
      resource_requirements = {},
      planned_start_date,
      planned_completion_date,
      expected_benefits = {},
      affected_population = 0,
      project_manager,
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!name || !type || !category || !location_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, category, location_id'
      });
    }

    const project = await interiorService.createInfrastructureProject({
      name,
      type,
      category,
      description,
      location_id,
      status: 'planned',
      priority,
      estimated_cost: parseFloat(estimated_cost) || 0,
      budget_source,
      resource_requirements,
      planned_start_date: planned_start_date ? new Date(planned_start_date) : undefined,
      planned_completion_date: planned_completion_date ? new Date(planned_completion_date) : undefined,
      progress_percentage: 0,
      milestones: [],
      expected_benefits,
      actual_benefits: {},
      affected_population: parseInt(affected_population) || 0,
      economic_impact: {},
      project_manager,
      contractor_info: {},
      approval_chain: [],
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create infrastructure project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create infrastructure project'
    });
  }
});

/**
 * PUT /api/interior/projects/:id
 * Update infrastructure project
 */
router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert date strings to Date objects if present
    if (updates.planned_start_date) {
      updates.planned_start_date = new Date(updates.planned_start_date);
    }
    if (updates.actual_start_date) {
      updates.actual_start_date = new Date(updates.actual_start_date);
    }
    if (updates.planned_completion_date) {
      updates.planned_completion_date = new Date(updates.planned_completion_date);
    }
    if (updates.actual_completion_date) {
      updates.actual_completion_date = new Date(updates.actual_completion_date);
    }

    const project = await interiorService.updateInfrastructureProject(id, updates);
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update infrastructure project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update infrastructure project'
    });
  }
});

// ===== INFRASTRUCTURE ASSETS =====

/**
 * GET /api/interior/assets
 * List infrastructure assets with optional filtering
 */
router.get('/assets', async (req: Request, res: Response) => {
  try {
    const civilizationId = req.query.civilization_id as string || 'civ_1';
    const campaignId = parseInt(req.query.campaign_id as string) || 1;
    
    const filters = {
      category: req.query.category as string,
      status: req.query.status as string,
      location: req.query.location as string
    };

    const assets = await interiorService.getInfrastructureAssets(civilizationId, campaignId, filters);
    
    res.json({
      success: true,
      data: assets,
      count: assets.length
    });
  } catch (error) {
    console.error('Get infrastructure assets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get infrastructure assets'
    });
  }
});

/**
 * POST /api/interior/assets
 * Create new infrastructure asset
 */
router.post('/assets', async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      category,
      location_id,
      condition_rating = 1.0,
      operational_status = 'operational',
      design_capacity = 0,
      construction_cost = 0,
      annual_maintenance_cost = 0,
      replacement_value = 0,
      construction_date,
      expected_lifespan = 50,
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!name || !type || !category || !location_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, category, location_id'
      });
    }

    const asset = await interiorService.createInfrastructureAsset({
      name,
      type,
      category,
      location_id,
      condition_rating: parseFloat(condition_rating),
      operational_status,
      design_capacity: parseInt(design_capacity),
      current_utilization: 0,
      efficiency_rating: 1.0,
      construction_cost: parseFloat(construction_cost),
      annual_maintenance_cost: parseFloat(annual_maintenance_cost),
      replacement_value: parseFloat(replacement_value),
      service_level: {},
      performance_indicators: {},
      user_satisfaction: 0.5,
      connected_assets: [],
      critical_dependencies: [],
      construction_date: construction_date ? new Date(construction_date) : undefined,
      expected_lifespan: parseInt(expected_lifespan),
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.status(201).json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Create infrastructure asset error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create infrastructure asset'
    });
  }
});

// ===== RESOURCE DEVELOPMENT =====

/**
 * GET /api/interior/resources
 * List resource development operations
 */
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const civilizationId = req.query.civilization_id as string || 'civ_1';
    const campaignId = parseInt(req.query.campaign_id as string) || 1;
    
    const filters = {
      type: req.query.type as string,
      status: req.query.status as string,
      resource_type: req.query.resource_type as string
    };

    const resources = await interiorService.getResourceDevelopments(civilizationId, campaignId, filters);
    
    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Get resource developments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resource developments'
    });
  }
});

/**
 * POST /api/interior/resources
 * Create new resource development operation
 */
router.post('/resources', async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      resource_type,
      location_id,
      estimated_reserves = 0,
      extraction_rate = 0,
      processing_capacity = 0,
      environmental_impact_score = 0.5,
      development_cost = 0,
      operational_cost = 0,
      revenue_per_unit = 0,
      compliance_status = 'pending',
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!name || !type || !resource_type || !location_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, resource_type, location_id'
      });
    }

    const resource = await interiorService.createResourceDevelopment({
      name,
      type,
      resource_type,
      location_id,
      status: 'surveying',
      estimated_reserves: parseFloat(estimated_reserves),
      extraction_rate: parseFloat(extraction_rate),
      processing_capacity: parseFloat(processing_capacity),
      current_output: 0,
      environmental_impact_score: parseFloat(environmental_impact_score),
      mitigation_measures: [],
      restoration_plan: {},
      development_cost: parseFloat(development_cost),
      operational_cost: parseFloat(operational_cost),
      revenue_per_unit: parseFloat(revenue_per_unit),
      permits: [],
      compliance_status,
      regulatory_requirements: [],
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Create resource development error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create resource development'
    });
  }
});

// ===== PUBLIC WORKS ORDERS =====

/**
 * GET /api/interior/work-orders
 * List public works orders
 */
router.get('/work-orders', async (req: Request, res: Response) => {
  try {
    const civilizationId = req.query.civilization_id as string || 'civ_1';
    const campaignId = parseInt(req.query.campaign_id as string) || 1;
    
    const filters = {
      status: req.query.status as string,
      priority: req.query.priority as string,
      type: req.query.type as string
    };

    const workOrders = await interiorService.getPublicWorksOrders(civilizationId, campaignId, filters);
    
    res.json({
      success: true,
      data: workOrders,
      count: workOrders.length
    });
  } catch (error) {
    console.error('Get public works orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get public works orders'
    });
  }
});

/**
 * POST /api/interior/work-orders
 * Create new public works order
 */
router.post('/work-orders', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      priority = 'medium',
      target_asset_id,
      target_project_id,
      location_id,
      labor_hours = 0,
      materials_needed = {},
      equipment_required = [],
      estimated_cost = 0,
      scheduled_date,
      requested_by,
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!title || !type || !location_id || !requested_by) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, type, location_id, requested_by'
      });
    }

    const workOrder = await interiorService.createPublicWorksOrder({
      title,
      description,
      type,
      priority,
      status: 'pending',
      target_asset_id,
      target_project_id,
      location_id,
      labor_hours: parseInt(labor_hours),
      materials_needed,
      equipment_required,
      estimated_cost: parseFloat(estimated_cost),
      requested_date: new Date(),
      scheduled_date: scheduled_date ? new Date(scheduled_date) : undefined,
      assigned_crew: [],
      work_completed: {},
      issues_encountered: [],
      quality_assessment: {},
      requested_by,
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.status(201).json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    console.error('Create public works order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create public works order'
    });
  }
});

// ===== SPECIALIZED ACTIONS =====

/**
 * POST /api/interior/actions/approve-project
 * Approve infrastructure project for implementation
 */
router.post('/actions/approve-project', async (req: Request, res: Response) => {
  try {
    const { project_id, approved_by, conditions = [] } = req.body;

    if (!project_id || !approved_by) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: project_id, approved_by'
      });
    }

    const project = await interiorService.updateInfrastructureProject(project_id, {
      status: 'approved',
      approval_chain: [
        {
          approved_by,
          approved_at: new Date(),
          conditions
        }
      ]
    });

    res.json({
      success: true,
      message: 'Infrastructure project approved successfully',
      data: project
    });
  } catch (error) {
    console.error('Approve project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve infrastructure project'
    });
  }
});

/**
 * POST /api/interior/actions/schedule-maintenance
 * Schedule maintenance for infrastructure asset
 */
router.post('/actions/schedule-maintenance', async (req: Request, res: Response) => {
  try {
    const {
      asset_id,
      maintenance_type = 'routine',
      scheduled_date,
      description,
      estimated_cost = 0,
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!asset_id || !scheduled_date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: asset_id, scheduled_date'
      });
    }

    // Create a maintenance work order
    const maintenanceOrder = await interiorService.createPublicWorksOrder({
      title: `${maintenance_type} maintenance`,
      description: description || `Scheduled ${maintenance_type} maintenance`,
      type: 'maintenance',
      priority: maintenance_type === 'emergency' ? 'critical' : 'medium',
      status: 'pending',
      target_asset_id: asset_id,
      location_id: 'asset_location', // Would need to be looked up from asset
      labor_hours: 8, // Default estimate
      materials_needed: {},
      equipment_required: [],
      estimated_cost: parseFloat(estimated_cost),
      requested_date: new Date(),
      scheduled_date: new Date(scheduled_date),
      assigned_crew: [],
      work_completed: {},
      issues_encountered: [],
      quality_assessment: {},
      requested_by: 'interior_secretary',
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.json({
      success: true,
      message: 'Maintenance scheduled successfully',
      data: maintenanceOrder
    });
  } catch (error) {
    console.error('Schedule maintenance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule maintenance'
    });
  }
});

/**
 * POST /api/interior/actions/emergency-response
 * Initiate emergency infrastructure response
 */
router.post('/actions/emergency-response', async (req: Request, res: Response) => {
  try {
    const {
      incident_type,
      location_id,
      affected_assets = [],
      response_priority = 'critical',
      description,
      civilization_id = 'civ_1',
      campaign_id = 1
    } = req.body;

    if (!incident_type || !location_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: incident_type, location_id'
      });
    }

    // Create emergency response work order
    const emergencyOrder = await interiorService.createPublicWorksOrder({
      title: `Emergency Response: ${incident_type}`,
      description: description || `Emergency response for ${incident_type} incident`,
      type: 'repair',
      priority: 'emergency',
      status: 'approved', // Emergency orders are auto-approved
      location_id,
      labor_hours: 24, // Emergency response estimate
      materials_needed: { emergency_supplies: true },
      equipment_required: ['emergency_equipment'],
      estimated_cost: 50000, // Emergency response budget
      requested_date: new Date(),
      scheduled_date: new Date(), // Immediate
      assigned_crew: ['emergency_response_team'],
      work_completed: {},
      issues_encountered: [],
      quality_assessment: {},
      requested_by: 'interior_secretary_emergency',
      approved_by: 'interior_secretary',
      campaign_id: parseInt(campaign_id),
      civilization_id
    });

    res.json({
      success: true,
      message: 'Emergency response initiated successfully',
      data: {
        emergency_order: emergencyOrder,
        affected_assets,
        response_time: 'immediate'
      }
    });
  } catch (error) {
    console.error('Emergency response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate emergency response'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'interior', interiorKnobSystem, applyInteriorKnobsToGameState);

export default router;
