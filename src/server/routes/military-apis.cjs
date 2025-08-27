/**
 * Military Operations API - Military readiness, defense systems, and strategic operations
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const militaryKnobsData = {
  // Military Readiness & Preparedness
  overall_readiness_target: 0.7,          // AI can control target military readiness (0.0-1.0)
  personnel_readiness_focus: 0.75,        // AI can control personnel training focus (0.0-1.0)
  equipment_maintenance_priority: 0.65,   // AI can control equipment maintenance (0.0-1.0)
  logistics_efficiency: 0.7,              // AI can control supply chain efficiency (0.0-1.0)
  intelligence_gathering_intensity: 0.6,  // AI can control intelligence operations (0.0-1.0)
  
  // Strategic Operations
  defensive_posture: 0.6,                 // AI can control defensive vs offensive stance (0.0-1.0)
  force_projection_capability: 0.5,       // AI can control power projection (0.0-1.0)
  rapid_response_readiness: 0.7,          // AI can control quick deployment capability (0.0-1.0)
  strategic_reserve_allocation: 0.4,      // AI can control reserve force allocation (0.0-1.0)
  
  // Military Branches Coordination
  inter_branch_cooperation: 0.8,          // AI can control joint operations effectiveness (0.0-1.0)
  army_focus_priority: 0.7,               // AI can control army development priority (0.0-1.0)
  navy_focus_priority: 0.6,               // AI can control naval development priority (0.0-1.0)
  air_force_focus_priority: 0.8,          // AI can control air force priority (0.0-1.0)
  space_force_focus_priority: 0.5,        // AI can control space force priority (0.0-1.0)
  cyber_command_priority: 0.9,            // AI can control cyber warfare priority (0.0-1.0)
  
  // Resource Allocation
  military_budget_allocation: 0.6,        // AI can control military spending (0.0-1.0)
  research_development_funding: 0.5,      // AI can control R&D investment (0.0-1.0)
  personnel_recruitment_rate: 0.6,        // AI can control recruitment intensity (0.0-1.0)
  training_program_intensity: 0.7,        // AI can control training programs (0.0-1.0)
  
  // Threat Assessment & Response
  threat_assessment_sensitivity: 0.7,     // AI can control threat detection sensitivity (0.0-1.0)
  response_escalation_threshold: 0.6,     // AI can control when to escalate responses (0.0-1.0)
  diplomatic_military_balance: 0.5,       // AI can balance diplomacy vs military action (0.0-1.0)
  preemptive_action_tendency: 0.3,        // AI can control preemptive strike likelihood (0.0-1.0)
  
  // Technology & Innovation
  military_technology_adoption: 0.6,      // AI can control tech adoption rate (0.0-1.0)
  weapons_system_modernization: 0.5,      // AI can control weapons upgrades (0.0-1.0)
  communication_system_priority: 0.8,     // AI can control military communications (0.0-1.0)
  surveillance_capability_focus: 0.7,     // AI can control surveillance systems (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const militaryKnobSystem = new EnhancedKnobSystem(militaryKnobsData);

// Backward compatibility - expose knobs directly
const militaryKnobs = militaryKnobSystem.knobs;

// Military state tracking
const militaryGameState = {
  // Overall Military Status
  overallReadiness: 0.7,
  personnelReadiness: 0.75,
  equipmentReadiness: 0.65,
  logisticsReadiness: 0.7,
  intelligenceReadiness: 0.6,
  
  // Force Structure
  activePersonnel: 50000,
  reservePersonnel: 25000,
  civilianPersonnel: 15000,
  
  // Military Branches
  branches: {
    army: { personnel: 25000, readiness: 0.75, equipment_status: 0.7, training_level: 0.8 },
    navy: { personnel: 12000, readiness: 0.7, equipment_status: 0.65, training_level: 0.75 },
    air_force: { personnel: 8000, readiness: 0.8, equipment_status: 0.6, training_level: 0.85 },
    space_force: { personnel: 3000, readiness: 0.6, equipment_status: 0.5, training_level: 0.7 },
    cyber_command: { personnel: 2000, readiness: 0.9, equipment_status: 0.8, training_level: 0.9 }
  },
  
  // Operations
  activeOperations: 3,
  completedMissions: 127,
  ongoingTrainingExercises: 8,
  
  // Budget & Resources
  militaryBudget: 2500000000, // 2.5 billion credits
  budgetUtilization: 0.85,
  equipmentModernizationRate: 0.4,
  
  // Threat Assessment
  currentThreatLevel: 'moderate', // low, moderate, high, critical
  activeThreatCount: 2,
  intelligenceReports: 15,
  
  // Technology
  technologyLevel: 0.7,
  researchProjects: 12,
  weaponSystemsModernity: 0.6,
  communicationEfficiency: 0.8
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateMilitaryStructuredOutputs() {
  return {
    // High-level military metrics for AI decision-making
    military_metrics: {
      overall_readiness: militaryGameState.overallReadiness,
      personnel_strength: militaryGameState.activePersonnel + militaryGameState.reservePersonnel,
      equipment_status: militaryGameState.equipmentReadiness,
      logistics_capability: militaryGameState.logisticsReadiness,
      intelligence_effectiveness: militaryGameState.intelligenceReadiness,
      budget_efficiency: militaryGameState.budgetUtilization,
      technology_advancement: militaryGameState.technologyLevel,
      threat_response_capability: calculateThreatResponseCapability()
    },
    
    // Military analysis for AI strategic planning
    military_analysis: {
      force_structure_balance: analyzeForceBranchBalance(),
      readiness_assessment: analyzeReadinessLevels(),
      capability_gaps: identifyCapabilityGaps(),
      operational_efficiency: analyzeOperationalEfficiency(),
      strategic_positioning: analyzeStrategicPositioning()
    },
    
    // Military effectiveness assessment for AI feedback
    effectiveness_assessment: {
      combat_readiness: assessCombatReadiness(),
      defensive_capability: assessDefensiveCapability(),
      offensive_capability: assessOffensiveCapability(),
      support_systems_effectiveness: assessSupportSystems(),
      leadership_effectiveness: assessMilitaryLeadership()
    },
    
    // Military alerts and recommendations for AI attention
    ai_alerts: generateMilitaryAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      military_industrial_capacity: calculateMilitaryIndustrialCapacity(),
      defense_economic_impact: calculateDefenseEconomicImpact(),
      military_diplomatic_influence: calculateMilitaryDiplomaticInfluence(),
      security_infrastructure_needs: calculateSecurityInfrastructureNeeds(),
      military_technology_requirements: calculateMilitaryTechnologyRequirements(),
      personnel_development_data: calculatePersonnelDevelopmentData()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...militaryKnobs }
  };
}

/**
 * GET /api/military - Get overall military status
 */
router.get('/', (req, res) => {
    try {
        const { include_branches, include_operations, include_budget } = req.query;
        
        let militaryData = {
            overallReadiness: militaryGameState.overallReadiness,
            personnelReadiness: militaryGameState.personnelReadiness,
            equipmentReadiness: militaryGameState.equipmentReadiness,
            logisticsReadiness: militaryGameState.logisticsReadiness,
            intelligenceReadiness: militaryGameState.intelligenceReadiness,
            totalPersonnel: militaryGameState.activePersonnel + militaryGameState.reservePersonnel,
            currentThreatLevel: militaryGameState.currentThreatLevel
        };
        
        if (include_branches === 'true') {
            militaryData.branches = militaryGameState.branches;
        }
        
        if (include_operations === 'true') {
            militaryData.operations = {
                active: militaryGameState.activeOperations,
                completed: militaryGameState.completedMissions,
                training: militaryGameState.ongoingTrainingExercises
            };
        }
        
        if (include_budget === 'true') {
            militaryData.budget = {
                total: militaryGameState.militaryBudget,
                utilization: militaryGameState.budgetUtilization,
                modernization_rate: militaryGameState.equipmentModernizationRate
            };
        }
        
        res.json({
            success: true,
            data: militaryData,
            readiness_target: militaryKnobs.overall_readiness_target,
            defensive_posture: militaryKnobs.defensive_posture
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get military status',
            details: error.message
        });
    }
});

/**
 * GET /api/military/branches - Get detailed branch information
 */
router.get('/branches', (req, res) => {
    try {
        const { branch } = req.query;
        
        if (branch && militaryGameState.branches[branch]) {
            res.json({
                success: true,
                data: {
                    branch: branch,
                    ...militaryGameState.branches[branch],
                    focus_priority: militaryKnobs[`${branch}_focus_priority`] || 0.5
                }
            });
        } else {
            res.json({
                success: true,
                data: {
                    branches: militaryGameState.branches,
                    inter_branch_cooperation: militaryKnobs.inter_branch_cooperation,
                    coordination_effectiveness: calculateBranchCoordination()
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get branch information',
            details: error.message
        });
    }
});

/**
 * GET /api/military/operations - Get military operations data
 */
router.get('/operations', (req, res) => {
    try {
        const { status, type } = req.query;
        
        const operationsData = {
            active_operations: militaryGameState.activeOperations,
            completed_missions: militaryGameState.completedMissions,
            training_exercises: militaryGameState.ongoingTrainingExercises,
            operation_types: ['defense', 'patrol', 'training', 'humanitarian', 'intelligence'],
            success_rate: 0.87,
            average_duration: 45, // days
            resource_efficiency: militaryKnobs.logistics_efficiency
        };
        
        res.json({
            success: true,
            data: operationsData,
            rapid_response_readiness: militaryKnobs.rapid_response_readiness,
            force_projection: militaryKnobs.force_projection_capability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get operations data',
            details: error.message
        });
    }
});

/**
 * GET /api/military/readiness - Get detailed readiness assessment
 */
router.get('/readiness', (req, res) => {
    try {
        const { component } = req.query;
        
        const readinessData = {
            overall: militaryGameState.overallReadiness,
            personnel: militaryGameState.personnelReadiness,
            equipment: militaryGameState.equipmentReadiness,
            logistics: militaryGameState.logisticsReadiness,
            intelligence: militaryGameState.intelligenceReadiness,
            readiness_factors: {
                training_level: calculateAverageTrainingLevel(),
                equipment_modernization: militaryGameState.equipmentModernizationRate,
                supply_chain_efficiency: militaryKnobs.logistics_efficiency,
                communication_systems: militaryKnobs.communication_system_priority
            }
        };
        
        if (component && readinessData[component] !== undefined) {
            res.json({
                success: true,
                data: {
                    component: component,
                    readiness_level: readinessData[component],
                    target_level: militaryKnobs.overall_readiness_target
                }
            });
        } else {
            res.json({
                success: true,
                data: readinessData,
                readiness_target: militaryKnobs.overall_readiness_target
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get readiness data',
            details: error.message
        });
    }
});

/**
 * GET /api/military/threats - Get threat assessment data
 */
router.get('/threats', (req, res) => {
    try {
        const { level, region } = req.query;
        
        const threatData = {
            current_threat_level: militaryGameState.currentThreatLevel,
            active_threats: militaryGameState.activeThreatCount,
            intelligence_reports: militaryGameState.intelligenceReports,
            threat_categories: ['cyber', 'conventional', 'space', 'economic', 'diplomatic'],
            assessment_confidence: militaryKnobs.intelligence_gathering_intensity,
            response_readiness: militaryKnobs.rapid_response_readiness,
            escalation_threshold: militaryKnobs.response_escalation_threshold
        };
        
        res.json({
            success: true,
            data: threatData,
            threat_sensitivity: militaryKnobs.threat_assessment_sensitivity,
            preemptive_tendency: militaryKnobs.preemptive_action_tendency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get threat data',
            details: error.message
        });
    }
});

/**
 * GET /api/military/budget - Get military budget and resource allocation
 */
router.get('/budget', (req, res) => {
    try {
        const { category, fiscal_year } = req.query;
        
        const budgetData = {
            total_budget: militaryGameState.militaryBudget,
            budget_utilization: militaryGameState.budgetUtilization,
            allocation_breakdown: {
                personnel: 0.45,
                equipment: 0.25,
                operations: 0.15,
                research_development: 0.10,
                infrastructure: 0.05
            },
            modernization_funding: militaryGameState.equipmentModernizationRate * militaryGameState.militaryBudget,
            efficiency_rating: calculateBudgetEfficiency()
        };
        
        res.json({
            success: true,
            data: budgetData,
            budget_allocation_control: militaryKnobs.military_budget_allocation,
            rd_funding_priority: militaryKnobs.research_development_funding
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get budget data',
            details: error.message
        });
    }
});

/**
 * GET /api/military/technology - Get military technology status
 */
router.get('/technology', (req, res) => {
    try {
        const { category, status } = req.query;
        
        const technologyData = {
            overall_tech_level: militaryGameState.technologyLevel,
            active_research_projects: militaryGameState.researchProjects,
            weapons_system_modernity: militaryGameState.weaponSystemsModernity,
            communication_efficiency: militaryGameState.communicationEfficiency,
            technology_categories: ['weapons', 'communication', 'surveillance', 'cyber', 'space', 'logistics'],
            adoption_rate: militaryKnobs.military_technology_adoption,
            modernization_priority: militaryKnobs.weapons_system_modernization
        };
        
        res.json({
            success: true,
            data: technologyData,
            tech_adoption_rate: militaryKnobs.military_technology_adoption,
            surveillance_focus: militaryKnobs.surveillance_capability_focus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get technology data',
            details: error.message
        });
    }
});

/**
 * POST /api/military/operations - Create or update military operation
 */
router.post('/operations', (req, res) => {
    try {
        const { operation_type, priority, duration, resources } = req.body;
        
        // Simulate operation creation
        militaryGameState.activeOperations++;
        
        const operationId = `OP-${Date.now()}`;
        const operation = {
            id: operationId,
            type: operation_type || 'patrol',
            priority: priority || 'medium',
            duration: duration || 30,
            resources_allocated: resources || 'standard',
            status: 'active',
            created_at: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: operation,
            message: 'Military operation created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create military operation',
            details: error.message
        });
    }
});

/**
 * POST /api/military/readiness/update - Update readiness levels
 */
router.post('/readiness/update', (req, res) => {
    try {
        const { component, target_level, priority } = req.body;
        
        if (component && militaryGameState[`${component}Readiness`] !== undefined) {
            const currentLevel = militaryGameState[`${component}Readiness`];
            const targetLevel = Math.max(0.0, Math.min(1.0, parseFloat(target_level) || currentLevel));
            
            // Apply readiness change (simplified)
            militaryGameState[`${component}Readiness`] = (currentLevel + targetLevel) / 2;
            
            res.json({
                success: true,
                data: {
                    component: component,
                    previous_level: currentLevel,
                    new_level: militaryGameState[`${component}Readiness`],
                    target_level: targetLevel
                },
                message: `${component} readiness updated successfully`
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid readiness component',
                valid_components: ['overall', 'personnel', 'equipment', 'logistics', 'intelligence']
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update readiness',
            details: error.message
        });
    }
});

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
    const knobData = militaryKnobSystem.getKnobsWithMetadata();
    res.json({
        ...knobData,
        system: 'military',
        description: 'AI-adjustable parameters for military system with enhanced input support',
        input_help: militaryKnobSystem.getKnobDescriptions()
    });
});

router.post('/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
        return res.status(400).json({
            success: false,
            error: 'Invalid knobs data. Expected object with knob values.',
            help: militaryKnobSystem.getKnobDescriptions().examples
        });
    }
    
    // Update knobs using enhanced system
    const updateResult = militaryKnobSystem.updateKnobs(knobs, source);
    
    res.json({
        success: updateResult.success,
        system: 'military',
        ...updateResult,
        message: 'Military knobs updated successfully using enhanced input processing'
    });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
    res.json({
        system: 'military',
        help: militaryKnobSystem.getKnobDescriptions(),
        current_values: militaryKnobSystem.getKnobsWithMetadata()
    });
});

module.exports = router;
