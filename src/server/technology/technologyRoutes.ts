/**
 * Technology & Cyber Warfare Systems - API Routes
 * Sprint 16: REST API endpoints for technology acquisition and cyber warfare
 */

import { Router } from 'express';
import { TechnologyEngine } from './TechnologyEngine.js';
import { TechnologyAnalytics } from './TechnologyAnalytics.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = Router();
const technologyEngine = new TechnologyEngine();
const technologyAnalytics = new TechnologyAnalytics();

// Enhanced AI Knobs for Technology System
const technologyKnobsData = {
  // Research & Development Investment
  research_investment_level: 0.6,       // Overall R&D investment level
  basic_research_priority: 0.5,         // Priority on basic vs applied research
  private_sector_collaboration: 0.7,    // Collaboration with private sector
  
  // Innovation Focus Areas
  ai_research_priority: 0.8,            // Artificial intelligence research priority
  biotechnology_priority: 0.6,          // Biotechnology research priority
  space_technology_priority: 0.5,       // Space technology research priority
  quantum_computing_priority: 0.4,      // Quantum computing research priority
  renewable_energy_priority: 0.7,       // Renewable energy research priority
  
  // Technology Transfer & Commercialization
  technology_transfer_rate: 0.6,        // Rate of tech transfer from research to application
  startup_ecosystem_support: 0.6,       // Support for technology startups
  intellectual_property_protection: 0.8, // IP protection strength
  
  // International Cooperation
  international_research_cooperation: 0.4, // Level of international research collaboration
  technology_sharing_openness: 0.3,     // Openness to technology sharing
  foreign_researcher_attraction: 0.6,   // Programs to attract foreign researchers
  
  // Education & Workforce
  education_technology_integration: 0.5, // Integration of technology in education
  stem_education_priority: 0.8,         // STEM education priority
  researcher_training_programs: 0.7,    // Researcher training and development
  
  // Ethics & Oversight
  technology_ethics_oversight: 0.5,     // Level of ethical oversight for emerging tech
  safety_testing_rigor: 0.8,           // Rigor of safety testing for new technologies
  public_engagement_in_tech: 0.4,      // Public engagement in technology decisions
  
  // Infrastructure & Resources
  research_infrastructure_investment: 0.6, // Investment in research infrastructure
  data_sharing_platforms: 0.5,         // Development of data sharing platforms
  computing_resources_allocation: 0.7,  // Allocation of computing resources for research
  
  // Strategic Technology Areas
  defense_technology_priority: 0.6,     // Defense technology research priority
  healthcare_technology_priority: 0.8,  // Healthcare technology research priority
  environmental_technology_priority: 0.7, // Environmental technology research priority
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Technology
const technologyKnobSystem = new EnhancedKnobSystem(technologyKnobsData);

// Apply technology knobs to game state
function applyTechnologyKnobsToGameState() {
  const knobs = technologyKnobSystem.knobs;
  
  // Apply research investment settings
  const researchInvestmentImpact = knobs.research_investment_level * knobs.private_sector_collaboration;
  
  // Apply innovation focus areas
  const innovationFocusImpact = (knobs.ai_research_priority + knobs.biotechnology_priority + 
    knobs.space_technology_priority + knobs.quantum_computing_priority + knobs.renewable_energy_priority) / 5;
  
  // Apply technology transfer settings
  const transferEffectiveness = knobs.technology_transfer_rate * knobs.startup_ecosystem_support;
  
  // Apply international cooperation settings
  const internationalCooperation = knobs.international_research_cooperation * knobs.foreign_researcher_attraction;
  
  // Apply education and workforce settings
  const educationImpact = knobs.education_technology_integration * knobs.stem_education_priority;
  
  // Apply ethics and oversight settings
  const ethicsOversight = knobs.technology_ethics_oversight * knobs.safety_testing_rigor;
  
  console.log('Applied technology knobs to game state:', {
    researchInvestmentImpact,
    innovationFocusImpact,
    transferEffectiveness,
    internationalCooperation,
    educationImpact,
    ethicsOversight
  });
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Technology & Cyber Warfare Systems',
    version: '1.0.0'
  });
});

// Technology Management Endpoints

// Get all technologies
router.get('/technologies', (req, res) => {
  try {
    const technologies = technologyEngine.getTechnologies();
    res.json({
      success: true,
      data: technologies,
      count: technologies.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve technologies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new technology
router.post('/technologies', (req, res) => {
  try {
    const {
      name, category, level, description, complexity,
      researchCost, implementationCost, maintenanceCost,
      prerequisites, economicBonus, militaryBonus, researchBonus,
      acquisitionMethod, sourceId, securityLevel, vulnerabilityScore
    } = req.body;

    if (!name || !category || !level || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'category', 'level', 'description']
      });
    }

    const technology = technologyEngine.createTechnology({
      name, category, level, description,
      complexity: complexity || Math.floor(Math.random() * 10) + 1,
      researchCost: researchCost || Math.floor(Math.random() * 1000000) + 100000,
      implementationCost: implementationCost || Math.floor(Math.random() * 500000) + 50000,
      maintenanceCost: maintenanceCost || Math.floor(Math.random() * 100000) + 10000,
      prerequisites, economicBonus, militaryBonus, researchBonus,
      acquisitionMethod, sourceId, securityLevel, vulnerabilityScore
    });

    res.status(201).json({
      success: true,
      data: technology,
      message: 'Technology created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create technology',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Civilization Management Endpoints

// Get all civilizations
router.get('/civilizations', (req, res) => {
  try {
    const civilizations = technologyEngine.getCivilizations();
    res.json({
      success: true,
      data: civilizations,
      count: civilizations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve civilizations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new civilization
router.post('/civilizations', (req, res) => {
  try {
    const {
      name, techLevel, researchCapacity, innovationRate, technologyAdoption,
      strengths, weaknesses, cyberDefense, counterIntelligence, informationSecurity
    } = req.body;

    if (!name || !techLevel) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'techLevel']
      });
    }

    const civilization = technologyEngine.createCivilization({
      name, techLevel, researchCapacity, innovationRate, technologyAdoption,
      strengths, weaknesses, cyberDefense, counterIntelligence, informationSecurity
    });

    res.status(201).json({
      success: true,
      data: civilization,
      message: 'Civilization created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create civilization',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Research Project Endpoints

// Get all research projects
router.get('/research', (req, res) => {
  try {
    const projects = technologyEngine.getResearchProjects();
    res.json({
      success: true,
      data: projects,
      count: projects.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve research projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start new research project
router.post('/research', (req, res) => {
  try {
    const {
      civilizationId, name, targetTechnology, category, budget,
      researchers, estimatedDuration, securityClearance, collaborators
    } = req.body;

    if (!civilizationId || !name || !targetTechnology || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'name', 'targetTechnology', 'category']
      });
    }

    const project = technologyEngine.startResearchProject({
      civilizationId, name, targetTechnology, category,
      budget: budget || Math.floor(Math.random() * 1000000) + 100000,
      researchers: researchers || Math.floor(Math.random() * 50) + 10,
      estimatedDuration: estimatedDuration || Math.floor(Math.random() * 365) + 90,
      securityClearance, collaborators
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Research project started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start research project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cyber Operations Endpoints

// Get all cyber operations
router.get('/cyber-operations', (req, res) => {
  try {
    const operations = technologyEngine.getCyberOperations();
    res.json({
      success: true,
      data: operations,
      count: operations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cyber operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Launch new cyber operation
router.post('/cyber-operations', (req, res) => {
  try {
    const {
      operatorId, targetId, name, type, primaryObjective,
      secondaryObjectives, targetTechnologies, duration, budget, personnel
    } = req.body;

    if (!operatorId || !targetId || !name || !type || !primaryObjective) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['operatorId', 'targetId', 'name', 'type', 'primaryObjective']
      });
    }

    const operation = technologyEngine.launchCyberOperation({
      operatorId, targetId, name, type, primaryObjective,
      secondaryObjectives, targetTechnologies,
      duration: duration || Math.floor(Math.random() * 90) + 7,
      budget: budget || Math.floor(Math.random() * 500000) + 50000,
      personnel: personnel || Math.floor(Math.random() * 10) + 2
    });

    res.status(201).json({
      success: true,
      data: operation,
      message: 'Cyber operation launched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to launch cyber operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute cyber operation
router.post('/cyber-operations/:id/execute', (req, res) => {
  try {
    const { id } = req.params;
    
    const outcome = technologyEngine.executeCyberOperation(id);
    
    res.json({
      success: true,
      data: outcome,
      message: 'Cyber operation executed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute cyber operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Technology Transfer Endpoints

// Get all technology transfers
router.get('/transfers', (req, res) => {
  try {
    const transfers = technologyEngine.getTechnologyTransfers();
    res.json({
      success: true,
      data: transfers,
      count: transfers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve technology transfers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create technology transfer
router.post('/transfers', (req, res) => {
  try {
    const {
      sourceId, recipientId, technologyId, transferMethod,
      cost, restrictions, duration, royalties
    } = req.body;

    if (!sourceId || !recipientId || !technologyId || !transferMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['sourceId', 'recipientId', 'technologyId', 'transferMethod']
      });
    }

    const transfer = technologyEngine.transferTechnology({
      sourceId, recipientId, technologyId, transferMethod,
      cost, restrictions, duration, royalties
    });

    res.status(201).json({
      success: true,
      data: transfer,
      message: 'Technology transfer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create technology transfer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reverse Engineering Endpoints

// Get all reverse engineering projects
router.get('/reverse-engineering', (req, res) => {
  try {
    const projects = technologyEngine.getReverseEngineeringProjects();
    res.json({
      success: true,
      data: projects,
      count: projects.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve reverse engineering projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start reverse engineering project
router.post('/reverse-engineering', (req, res) => {
  try {
    const { civilizationId, targetTechnologyId, budget, researchers, samples } = req.body;

    if (!civilizationId || !targetTechnologyId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'targetTechnologyId']
      });
    }

    const project = technologyEngine.startReverseEngineering({
      civilizationId, targetTechnologyId,
      budget: budget || Math.floor(Math.random() * 500000) + 100000,
      researchers: researchers || Math.floor(Math.random() * 20) + 5,
      samples: samples || []
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Reverse engineering project started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start reverse engineering project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Intelligence Data Endpoints

// Get all intelligence data
router.get('/intelligence', (req, res) => {
  try {
    const intelligence = technologyEngine.getIntelligenceData();
    res.json({
      success: true,
      data: intelligence,
      count: intelligence.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve intelligence data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Analytics Endpoints

// Get comprehensive technology analytics
router.get('/analytics', (req, res) => {
  try {
    const { civilizationId } = req.query;
    const analytics = technologyEngine.generateTechnologyAnalytics(civilizationId as string);
    
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate technology analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get technology portfolio analysis
router.get('/analytics/portfolio', (req, res) => {
  try {
    const technologies = technologyEngine.getTechnologies();
    const analysis = technologyAnalytics.analyzeTechnologyPortfolio(technologies);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze technology portfolio',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get research performance analysis
router.get('/analytics/research', (req, res) => {
  try {
    const projects = technologyEngine.getResearchProjects();
    const analysis = technologyAnalytics.analyzeResearchPerformance(projects);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze research performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cyber warfare analysis
router.get('/analytics/cyber', (req, res) => {
  try {
    const operations = technologyEngine.getCyberOperations();
    const analysis = technologyAnalytics.analyzeCyberWarfare(operations);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze cyber warfare',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get technology transfer analysis
router.get('/analytics/transfers', (req, res) => {
  try {
    const transfers = technologyEngine.getTechnologyTransfers();
    const analysis = technologyAnalytics.analyzeTechnologyTransfer(transfers);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze technology transfers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get reverse engineering analysis
router.get('/analytics/reverse-engineering', (req, res) => {
  try {
    const projects = technologyEngine.getReverseEngineeringProjects();
    const analysis = technologyAnalytics.analyzeReverseEngineering(projects);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze reverse engineering',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get technology forecast
router.get('/analytics/forecast', (req, res) => {
  try {
    const { timeHorizon = 5 } = req.query;
    const technologies = technologyEngine.getTechnologies();
    const projects = technologyEngine.getResearchProjects();
    
    const forecast = technologyAnalytics.generateTechnologyForecast(
      technologies, 
      projects, 
      parseInt(timeHorizon as string)
    );
    
    res.json({
      success: true,
      data: forecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate technology forecast',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get competitive analysis
router.get('/analytics/competitive', (req, res) => {
  try {
    const { ownCivId, competitorCivId } = req.query;
    
    if (!ownCivId || !competitorCivId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters',
        required: ['ownCivId', 'competitorCivId']
      });
    }

    const civilizations = technologyEngine.getCivilizations();
    const ownCiv = civilizations.find(c => c.civilizationId === ownCivId);
    const competitorCiv = civilizations.find(c => c.civilizationId === competitorCivId);
    
    if (!ownCiv || !competitorCiv) {
      return res.status(404).json({
        success: false,
        error: 'Civilization not found'
      });
    }

    const analysis = technologyAnalytics.generateCompetitiveAnalysis(
      ownCiv.technologies,
      competitorCiv.technologies,
      civilizations
    );
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate competitive analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get security analysis
router.get('/analytics/security', (req, res) => {
  try {
    const technologies = technologyEngine.getTechnologies();
    const operations = technologyEngine.getCyberOperations();
    const civilizations = technologyEngine.getCivilizations();
    
    const analysis = technologyAnalytics.analyzeSecurityPosture(
      technologies,
      operations,
      civilizations
    );
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze security posture',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recommendations
router.get('/recommendations/:civilizationId', (req, res) => {
  try {
    const { civilizationId } = req.params;
    const recommendations = technologyEngine.generateRecommendations(civilizationId);
    
    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Utility Endpoints

// Get technology categories
router.get('/categories', (req, res) => {
  const categories = [
    'Military', 'Industrial', 'Medical', 'Agricultural', 'Transportation',
    'Communication', 'Energy', 'Computing', 'Materials', 'Space',
    'Biotechnology', 'Nanotechnology', 'Quantum', 'AI', 'Robotics'
  ];
  
  res.json({
    success: true,
    data: categories,
    count: categories.length
  });
});

// Get technology levels
router.get('/levels', (req, res) => {
  const levels = ['Primitive', 'Basic', 'Intermediate', 'Advanced', 'Cutting-Edge', 'Experimental'];
  
  res.json({
    success: true,
    data: levels,
    count: levels.length
  });
});

// Get acquisition methods
router.get('/acquisition-methods', (req, res) => {
  const methods = [
    'Conquest', 'Espionage', 'Trade', 'Research', 'Reverse Engineering',
    'Cyber Theft', 'Defection', 'Purchase', 'Alliance', 'Discovery'
  ];
  
  res.json({
    success: true,
    data: methods,
    count: methods.length
  });
});

// Get cyber operation types
router.get('/cyber-operation-types', (req, res) => {
  const types = [
    'Data Theft', 'Technology Theft', 'Sabotage', 'Surveillance',
    'Disruption', 'Propaganda', 'Infrastructure Attack', 'Economic Warfare'
  ];
  
  res.json({
    success: true,
    data: types,
    count: types.length
  });
});

// Dynamic Tech Tree Endpoints

// Generate new tech tree
router.post('/tech-tree/generate', (req, res) => {
  try {
    const { startingEra = 'Digital', gameType = 'rapid' } = req.body;
    technologyEngine.generateNewTechTree(startingEra, gameType);
    
    res.json({
      success: true,
      message: 'New tech tree generated successfully',
      startingEra,
      gameType,
      technologies: technologyEngine.getTechnologies().length,
      psychicPowers: technologyEngine.getPsychicPowers().length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get visible technologies for a civilization
router.get('/tech-tree/:civilizationId/visible', (req, res) => {
  try {
    const { civilizationId } = req.params;
    const visibleTechs = technologyEngine.getVisibleTechnologies(civilizationId);
    
    res.json({
      success: true,
      civilizationId,
      visibleTechnologies: visibleTechs,
      count: visibleTechs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Psychic Powers Endpoints

// Get all psychic powers
router.get('/psychic-powers', (req, res) => {
  try {
    const powers = technologyEngine.getPsychicPowers();
    res.json({
      success: true,
      psychicPowers: powers,
      count: powers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Innovation System Endpoints

// Trigger corporate innovation
router.post('/innovation/corporate', (req, res) => {
  try {
    const { civilizationId, corporationId, researchBudget, targetCategory, competitivePressure } = req.body;
    
    if (!civilizationId || !corporationId || !researchBudget || competitivePressure === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: civilizationId, corporationId, researchBudget, competitivePressure'
      });
    }

    const innovationEvent = technologyEngine.triggerCorporateInnovation({
      civilizationId,
      corporationId,
      researchBudget,
      targetCategory,
      competitivePressure
    });

    res.json({
      success: true,
      message: 'Corporate innovation triggered successfully',
      innovationEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute innovation event
router.post('/innovation/execute/:eventId', (req, res) => {
  try {
    const { eventId } = req.params;
    const outcome = technologyEngine.executeInnovationEvent(eventId);
    
    res.json({
      success: true,
      message: 'Innovation event executed successfully',
      eventId,
      outcome
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all innovation events
router.get('/innovation/events', (req, res) => {
  try {
    const events = technologyEngine.getInnovationEvents();
    res.json({
      success: true,
      innovationEvents: events,
      count: events.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Game Setup Endpoints

// Setup civilization tech tree
router.post('/setup/civilization/:civilizationId', (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { startingEra, startingTechnologies, psychicAbilities, gameSetupSeed } = req.body;
    
    if (!startingEra) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: startingEra'
      });
    }

    technologyEngine.setupCivilizationTechTree({
      civilizationId,
      startingEra,
      startingTechnologies,
      psychicAbilities,
      gameSetupSeed
    });

    res.json({
      success: true,
      message: 'Civilization tech tree setup completed',
      civilizationId,
      startingEra,
      startingTechnologies: startingTechnologies?.length || 0,
      psychicAbilities: psychicAbilities?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'technology', technologyKnobSystem, applyTechnologyKnobsToGameState);

export default router;
