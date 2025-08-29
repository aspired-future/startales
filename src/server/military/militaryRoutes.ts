/**
 * Military & War Simulator API Routes
 * 
 * Comprehensive military combat system with alliance warfare, sensor networks,
 * intelligence operations, and AI-driven morale mechanics.
 */

import { Router } from 'express';
import { warSimulatorService } from './WarSimulatorService';
import { db } from '../storage/db';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for Military System
const militaryKnobsData = {
  // Military Doctrine & Strategy
  offensive_doctrine_emphasis: 0.6,     // Offensive vs defensive military doctrine
  combined_arms_coordination: 0.8,      // Combined arms warfare coordination
  asymmetric_warfare_capability: 0.5,   // Asymmetric and guerrilla warfare capability
  
  // Force Structure & Organization
  professional_military_ratio: 0.7,     // Professional vs conscript military ratio
  special_forces_investment: 0.6,       // Special operations forces investment
  reserve_force_integration: 0.5,       // Reserve and militia integration level
  
  // Technology & Equipment
  military_technology_priority: 0.8,    // Military technology development priority
  equipment_modernization_rate: 0.7,    // Equipment modernization and upgrade rate
  indigenous_defense_production: 0.6,   // Indigenous defense manufacturing capability
  
  // Intelligence & Reconnaissance
  intelligence_gathering_capability: 0.8, // Intelligence collection and analysis capability
  surveillance_network_coverage: 0.7,   // Surveillance and monitoring network coverage
  cyber_warfare_capability: 0.6,        // Cyber warfare and electronic warfare capability
  
  // Logistics & Support
  logistics_efficiency: 0.8,            // Military logistics and supply chain efficiency
  maintenance_capability: 0.7,          // Equipment maintenance and repair capability
  medical_support_quality: 0.8,         // Military medical and casualty care quality
  
  // Training & Readiness
  training_intensity: 0.7,              // Military training intensity and frequency
  joint_operations_training: 0.6,       // Joint and coalition operations training
  simulation_training_usage: 0.5,       // Advanced simulation and VR training usage
  
  // Command & Control
  command_structure_efficiency: 0.8,    // Command and control structure efficiency
  decision_making_speed: 0.7,           // Military decision-making speed and agility
  communication_security: 0.9,          // Military communication security and encryption
  
  // Morale & Personnel
  military_morale_support: 0.8,         // Military morale and welfare programs
  veteran_support_quality: 0.7,         // Veteran care and support quality
  recruitment_standards: 0.6,           // Military recruitment standards and selectivity
  
  // International Cooperation
  alliance_integration_level: 0.6,      // Military alliance integration and cooperation
  peacekeeping_participation: 0.5,      // International peacekeeping participation
  military_diplomacy_engagement: 0.7,   // Military diplomacy and defense cooperation
  
  // Defense Economics
  defense_spending_efficiency: 0.7,     // Defense spending efficiency and value
  defense_industrial_base: 0.6,         // Defense industrial base strength
  military_export_capability: 0.4,      // Military equipment export capability
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Military
const militaryKnobSystem = new EnhancedKnobSystem(militaryKnobsData);

// Apply military knobs to game state
function applyMilitaryKnobsToGameState() {
  const knobs = militaryKnobSystem.knobs;
  
  // Apply military doctrine settings
  const militaryDoctrine = (knobs.offensive_doctrine_emphasis + knobs.combined_arms_coordination + 
    knobs.asymmetric_warfare_capability) / 3;
  
  // Apply force structure settings
  const forceStructure = (knobs.professional_military_ratio + knobs.special_forces_investment + 
    knobs.reserve_force_integration) / 3;
  
  // Apply technology and equipment settings
  const militaryTechnology = (knobs.military_technology_priority + knobs.equipment_modernization_rate + 
    knobs.indigenous_defense_production) / 3;
  
  // Apply intelligence capabilities
  const intelligenceCapability = (knobs.intelligence_gathering_capability + knobs.surveillance_network_coverage + 
    knobs.cyber_warfare_capability) / 3;
  
  // Apply logistics and support settings
  const logisticsSupport = (knobs.logistics_efficiency + knobs.maintenance_capability + 
    knobs.medical_support_quality) / 3;
  
  // Apply command and control settings
  const commandControl = (knobs.command_structure_efficiency + knobs.decision_making_speed + 
    knobs.communication_security) / 3;
  
  console.log('Applied military knobs to game state:', {
    militaryDoctrine,
    forceStructure,
    militaryTechnology,
    intelligenceCapability,
    logisticsSupport,
    commandControl
  });
}

// ===== MILITARY UNIT MANAGEMENT =====

// Get all military units
router.get('/units', async (req, res) => {
  try {
    const { campaign_id, civilization_id, type, domain, status } = req.query;
    
    let query = 'SELECT * FROM military_units WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (civilization_id) {
      query += ` AND civilization_id = $${++paramCount}`;
      params.push(civilization_id);
    }
    
    if (type) {
      query += ` AND type = $${++paramCount}`;
      params.push(type);
    }
    
    if (domain) {
      query += ` AND domain = $${++paramCount}`;
      params.push(domain);
    }
    
    if (status) {
      query += ` AND status->>'operational' = $${++paramCount}`;
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      units: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get military units:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military units'
    });
  }
});

// Get specific military unit
router.get('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM military_units WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Military unit not found'
      });
    }
    
    res.json({
      success: true,
      unit: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to get military unit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military unit'
    });
  }
});

// Create military unit
router.post('/units', async (req, res) => {
  try {
    const {
      name,
      type,
      classification,
      domain,
      size,
      maxSize,
      combatStats,
      morale,
      technology,
      equipment,
      location,
      movement,
      command,
      experience,
      training,
      supply,
      specialCapabilities,
      status,
      condition,
      allegiance,
      campaignId,
      civilizationId
    } = req.body;
    
    const id = `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await db.query(`
      INSERT INTO military_units (
        id, name, type, classification, domain, size, max_size,
        combat_stats, morale, technology, equipment, location, movement,
        command, experience, training, supply, special_capabilities,
        status, condition, allegiance, campaign_id, civilization_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *
    `, [
      id, name, type, classification, domain, size || 0, maxSize || 0,
      JSON.stringify(combatStats || {}),
      JSON.stringify(morale || {}),
      JSON.stringify(technology || {}),
      JSON.stringify(equipment || []),
      JSON.stringify(location || {}),
      JSON.stringify(movement || {}),
      JSON.stringify(command || {}),
      JSON.stringify(experience || {}),
      JSON.stringify(training || {}),
      JSON.stringify(supply || {}),
      JSON.stringify(specialCapabilities || []),
      JSON.stringify(status || {}),
      JSON.stringify(condition || {}),
      JSON.stringify(allegiance || {}),
      campaignId,
      civilizationId
    ]);
    
    res.status(201).json({
      success: true,
      unit: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to create military unit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create military unit'
    });
  }
});

// Update military unit
router.put('/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const setClause = [];
    const params = [id];
    let paramCount = 1;
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        paramCount++;
        if (typeof value === 'object') {
          setClause.push(`${key} = $${paramCount}`);
          params.push(JSON.stringify(value));
        } else {
          setClause.push(`${key} = $${paramCount}`);
          params.push(value);
        }
      }
    });
    
    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid updates provided'
      });
    }
    
    setClause.push(`updated_at = NOW()`);
    
    const result = await db.query(`
      UPDATE military_units 
      SET ${setClause.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Military unit not found'
      });
    }
    
    res.json({
      success: true,
      unit: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to update military unit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update military unit'
    });
  }
});

// ===== MORALE ANALYSIS =====

// Analyze unit morale
router.post('/units/:id/analyze-morale', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get unit data
    const unitResult = await db.query(
      'SELECT * FROM military_units WHERE id = $1',
      [id]
    );
    
    if (unitResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Military unit not found'
      });
    }
    
    const unit = unitResult.rows[0];
    
    // Perform AI-driven morale analysis
    const analysis = await warSimulatorService.analyzeUnitMorale(unit);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Failed to analyze unit morale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze unit morale'
    });
  }
});

// Get morale history
router.get('/units/:id/morale-history', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    
    const result = await db.query(`
      SELECT * FROM morale_events 
      WHERE unit_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [id, limit]);
    
    res.json({
      success: true,
      events: result.rows
    });
  } catch (error) {
    console.error('Failed to get morale history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get morale history'
    });
  }
});

// ===== BATTLE SIMULATION =====

// Simulate battle
router.post('/battles/simulate', async (req, res) => {
  try {
    const { attackerUnitIds, defenderUnitIds, battleConditions } = req.body;
    
    // Get attacker units
    const attackerResult = await db.query(
      'SELECT * FROM military_units WHERE id = ANY($1)',
      [attackerUnitIds]
    );
    
    // Get defender units
    const defenderResult = await db.query(
      'SELECT * FROM military_units WHERE id = ANY($1)',
      [defenderUnitIds]
    );
    
    if (attackerResult.rows.length === 0 || defenderResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid unit IDs provided'
      });
    }
    
    // Simulate the battle
    const battleResult = await warSimulatorService.simulateBattle(
      attackerResult.rows,
      defenderResult.rows,
      battleConditions
    );
    
    res.json({
      success: true,
      battle: battleResult
    });
  } catch (error) {
    console.error('Failed to simulate battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simulate battle'
    });
  }
});

// Get battle history
router.get('/battles', async (req, res) => {
  try {
    const { campaign_id, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM battle_history WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      battles: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get battle history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get battle history'
    });
  }
});

// Get specific battle
router.get('/battles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM battle_history WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Battle not found'
      });
    }
    
    res.json({
      success: true,
      battle: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to get battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get battle'
    });
  }
});

// ===== ALLIANCE WARFARE =====

// Coordinate alliance attack
router.post('/alliance/coordinate-attack', async (req, res) => {
  try {
    const { allianceForces, targetUnitIds, coordinationLevel } = req.body;
    
    // Get target units
    const targetResult = await db.query(
      'SELECT * FROM military_units WHERE id = ANY($1)',
      [targetUnitIds]
    );
    
    if (targetResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid target unit IDs provided'
      });
    }
    
    // Coordinate the alliance attack
    const result = await warSimulatorService.coordinateAllianceAttack(
      allianceForces,
      targetResult.rows,
      coordinationLevel || 0.7
    );
    
    res.json({
      success: true,
      operation: result
    });
  } catch (error) {
    console.error('Failed to coordinate alliance attack:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to coordinate alliance attack'
    });
  }
});

// Get alliance military coordination history
router.get('/alliance/coordination', async (req, res) => {
  try {
    const { campaign_id, alliance_id, status } = req.query;
    
    let query = 'SELECT * FROM alliance_military_coordination WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (alliance_id) {
      query += ` AND (primary_alliance = $${++paramCount} OR participating_alliances @> $${++paramCount})`;
      params.push(alliance_id, JSON.stringify([alliance_id]));
      paramCount++;
    }
    
    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      operations: result.rows
    });
  } catch (error) {
    console.error('Failed to get alliance coordination history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get alliance coordination history'
    });
  }
});

// ===== SENSOR NETWORKS =====

// Deploy sensor network
router.post('/sensors/deploy', async (req, res) => {
  try {
    const { unitIds, coverage, duration } = req.body;
    
    // Get units for sensor deployment
    const unitsResult = await db.query(
      'SELECT * FROM military_units WHERE id = ANY($1)',
      [unitIds]
    );
    
    if (unitsResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid unit IDs provided'
      });
    }
    
    // Deploy sensor network
    const deployment = await warSimulatorService.deploySensorNetwork(
      unitsResult.rows,
      coverage,
      duration || 24 // default 24 hours
    );
    
    res.json({
      success: true,
      deployment
    });
  } catch (error) {
    console.error('Failed to deploy sensor network:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deploy sensor network'
    });
  }
});

// Get sensor networks
router.get('/sensors/networks', async (req, res) => {
  try {
    const { campaign_id, owner_civilization, operational } = req.query;
    
    let query = 'SELECT * FROM sensor_networks WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (owner_civilization) {
      query += ` AND owner_civilization = $${++paramCount}`;
      params.push(owner_civilization);
    }
    
    if (operational !== undefined) {
      query += ` AND operational = $${++paramCount}`;
      params.push(operational === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      networks: result.rows
    });
  } catch (error) {
    console.error('Failed to get sensor networks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sensor networks'
    });
  }
});

// ===== INTELLIGENCE OPERATIONS =====

// Conduct intelligence operation
router.post('/intelligence/operations', async (req, res) => {
  try {
    const { operationType, target, assetIds } = req.body;
    
    // Get asset units
    const assetsResult = await db.query(
      'SELECT * FROM military_units WHERE id = ANY($1)',
      [assetIds]
    );
    
    if (assetsResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid asset unit IDs provided'
      });
    }
    
    // Conduct intelligence operation
    const result = await warSimulatorService.conductIntelligenceOperation(
      operationType,
      target,
      assetsResult.rows
    );
    
    res.json({
      success: true,
      operation: result
    });
  } catch (error) {
    console.error('Failed to conduct intelligence operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to conduct intelligence operation'
    });
  }
});

// Get intelligence operations
router.get('/intelligence/operations', async (req, res) => {
  try {
    const { campaign_id, civilization_id, operation_type, status, classification } = req.query;
    
    let query = 'SELECT * FROM intelligence_operations WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (civilization_id) {
      query += ` AND civilization_id = $${++paramCount}`;
      params.push(civilization_id);
    }
    
    if (operation_type) {
      query += ` AND operation_type = $${++paramCount}`;
      params.push(operation_type);
    }
    
    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }
    
    if (classification) {
      query += ` AND classification = $${++paramCount}`;
      params.push(classification);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      operations: result.rows
    });
  } catch (error) {
    console.error('Failed to get intelligence operations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get intelligence operations'
    });
  }
});

// ===== MILITARY COMMANDERS =====

// Get military commanders
router.get('/commanders', async (req, res) => {
  try {
    const { campaign_id, civilization_id, status } = req.query;
    
    let query = 'SELECT * FROM military_commanders WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (civilization_id) {
      query += ` AND civilization_id = $${++paramCount}`;
      params.push(civilization_id);
    }
    
    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      commanders: result.rows
    });
  } catch (error) {
    console.error('Failed to get military commanders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military commanders'
    });
  }
});

// ===== MILITARY INFRASTRUCTURE =====

// Get military infrastructure
router.get('/infrastructure', async (req, res) => {
  try {
    const { campaign_id, owner_civilization, type, operational_status } = req.query;
    
    let query = 'SELECT * FROM military_infrastructure WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaign_id) {
      query += ` AND campaign_id = $${++paramCount}`;
      params.push(campaign_id);
    }
    
    if (owner_civilization) {
      query += ` AND owner_civilization = $${++paramCount}`;
      params.push(owner_civilization);
    }
    
    if (type) {
      query += ` AND type = $${++paramCount}`;
      params.push(type);
    }
    
    if (operational_status) {
      query += ` AND operational_status = $${++paramCount}`;
      params.push(operational_status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      infrastructure: result.rows
    });
  } catch (error) {
    console.error('Failed to get military infrastructure:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military infrastructure'
    });
  }
});

// ===== SYSTEM STATUS =====

// Get military system overview
router.get('/overview', async (req, res) => {
  try {
    const { campaign_id } = req.query;
    
    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }
    
    // Get counts and statistics
    const [
      unitsResult,
      battlesResult,
      operationsResult,
      networksResult,
      commandersResult,
      infrastructureResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count, domain FROM military_units WHERE campaign_id = $1 GROUP BY domain', [campaign_id]),
      db.query('SELECT COUNT(*) as count, outcome FROM battle_history WHERE campaign_id = $1 GROUP BY outcome', [campaign_id]),
      db.query('SELECT COUNT(*) as count, status FROM intelligence_operations WHERE campaign_id = $1 GROUP BY status', [campaign_id]),
      db.query('SELECT COUNT(*) as count, operational FROM sensor_networks WHERE campaign_id = $1 GROUP BY operational', [campaign_id]),
      db.query('SELECT COUNT(*) as count, status FROM military_commanders WHERE campaign_id = $1 GROUP BY status', [campaign_id]),
      db.query('SELECT COUNT(*) as count, type FROM military_infrastructure WHERE campaign_id = $1 GROUP BY type', [campaign_id])
    ]);
    
    res.json({
      success: true,
      overview: {
        units: unitsResult.rows,
        battles: battlesResult.rows,
        operations: operationsResult.rows,
        networks: networksResult.rows,
        commanders: commandersResult.rows,
        infrastructure: infrastructureResult.rows
      }
    });
  } catch (error) {
    console.error('Failed to get military overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military overview'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'military', militaryKnobSystem, applyMilitaryKnobsToGameState);

export default router;
