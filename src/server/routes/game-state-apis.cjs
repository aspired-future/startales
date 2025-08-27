// Game State APIs - Central game state management and coordination
const { galaxyMapGameState } = require('../game-state/galaxy-map-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const gameStateKnobsData = {
  // Game Pacing & Time
  simulation_speed: 0.6,                  // AI can control game simulation speed (0.0-1.0)
  time_compression: 0.5,                  // AI can control time compression ratio (0.0-1.0)
  event_frequency: 0.7,                   // AI can control random event frequency (0.0-1.0)
  crisis_probability: 0.4,                // AI can control crisis occurrence rate (0.0-1.0)
  
  // Game Balance & Difficulty
  challenge_level: 0.6,                   // AI can adjust overall game difficulty (0.0-1.0)
  resource_scarcity: 0.5,                 // AI can control resource availability (0.0-1.0)
  competition_intensity: 0.6,             // AI can control AI opponent aggressiveness (0.0-1.0)
  random_factor_influence: 0.4,           // AI can control randomness impact (0.0-1.0)
  
  // Player Experience
  tutorial_assistance: 0.7,               // AI can provide tutorial help (0.0-1.0)
  hint_system_activity: 0.5,              // AI can control hint frequency (0.0-1.0)
  achievement_tracking: 0.8,              // AI can track and reward achievements (0.0-1.0)
  progress_feedback: 0.7,                 // AI can provide progress feedback (0.0-1.0)
  
  // System Integration
  cross_system_synchronization: 0.8,      // AI can control system sync frequency (0.0-1.0)
  data_consistency_checks: 0.9,           // AI can control data validation (0.0-1.0)
  performance_optimization: 0.7,          // AI can optimize performance (0.0-1.0)
  memory_management: 0.6,                 // AI can control memory usage (0.0-1.0)
  
  // Narrative & Story
  story_pacing: 0.6,                      // AI can control story progression speed (0.0-1.0)
  narrative_branching: 0.5,               // AI can control story branch complexity (0.0-1.0)
  character_story_integration: 0.7,       // AI can integrate character stories (0.0-1.0)
  plot_twist_frequency: 0.4,              // AI can control plot twist occurrence (0.0-1.0)
  
  // Multiplayer Coordination
  player_synchronization: 0.8,            // AI can control multiplayer sync (0.0-1.0)
  turn_management: 0.7,                   // AI can manage turn-based elements (0.0-1.0)
  conflict_resolution: 0.6,               // AI can resolve player conflicts (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const gameStateKnobSystem = new EnhancedKnobSystem(gameStateKnobsData);

// Backward compatibility - expose knobs directly
const gameStateKnobs = gameStateKnobSystem.knobs;

// Global game state tracking
const globalGameState = {
  gameId: `game_${Date.now()}`,
  startTime: Date.now(),
  currentTick: 0,
  gamePhase: 'early_game', // early_game, mid_game, late_game, end_game
  playerCount: 1,
  activeSystems: [],
  lastSaveTime: Date.now(),
  performanceMetrics: {
    avgTickTime: 0,
    memoryUsage: 0,
    systemLoad: 0
  }
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateGameStateStructuredOutputs() {
  return {
    // High-level game metrics for AI decision-making
    game_metrics: {
      game_id: globalGameState.gameId,
      game_duration: Date.now() - globalGameState.startTime,
      current_tick: globalGameState.currentTick,
      game_phase: globalGameState.gamePhase,
      player_count: globalGameState.playerCount,
      active_systems: globalGameState.activeSystems.length,
      simulation_health: calculateSimulationHealth(),
      game_progression: calculateGameProgression(),
      system_performance: calculateSystemPerformance()
    },
    
    // Game state analysis for AI strategic planning
    state_analysis: {
      system_synchronization: analyzeSystemSynchronization(),
      data_consistency: analyzeDataConsistency(),
      performance_bottlenecks: identifyPerformanceBottlenecks(),
      resource_utilization: analyzeResourceUtilization(),
      player_engagement: analyzePlayerEngagement()
    },
    
    // Game health assessment for AI feedback
    health_assessment: {
      system_stability: assessSystemStability(),
      data_integrity: assessDataIntegrity(),
      performance_efficiency: assessPerformanceEfficiency(),
      player_satisfaction: assessPlayerSatisfaction(),
      narrative_coherence: assessNarrativeCoherence()
    },
    
    // Game state alerts and recommendations for AI attention
    ai_alerts: generateGameStateAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      system_coordination_status: calculateSystemCoordination(),
      resource_allocation_data: calculateResourceAllocation(),
      performance_optimization_opportunities: identifyOptimizationOpportunities(),
      player_experience_metrics: calculatePlayerExperience(),
      narrative_integration_status: calculateNarrativeIntegration(),
      multiplayer_coordination_data: calculateMultiplayerCoordination()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...gameStateKnobs }
  };
}

function setupGameStateAPIs(app) {
  // Initialize galaxy map state
  console.log('Galaxy Map system initialized with', galaxyMapGameState.starSystems.length, 'star systems');
  globalGameState.activeSystems.push('galaxy_map');
  
  // Get comprehensive game state
  app.get('/api/game/state', (req, res) => {
    try {
      const { include_systems, include_performance } = req.query;
      
      let gameState = {
        ...globalGameState,
        timestamp: Date.now()
      };
      
      if (include_systems === 'true') {
        gameState.systems = {
          galaxy_map: galaxyMapGameState.starSystems.length > 0,
          // Add other system status checks here
        };
      }
      
      if (include_performance === 'true') {
        gameState.performance = globalGameState.performanceMetrics;
      }
      
      res.json({
        success: true,
        data: gameState
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get game state',
        details: error.message
      });
    }
  });
  
  // Update game state
  app.post('/api/game/state', (req, res) => {
    try {
      const { gamePhase, playerCount, performanceMetrics } = req.body;
      
      if (gamePhase) globalGameState.gamePhase = gamePhase;
      if (playerCount) globalGameState.playerCount = playerCount;
      if (performanceMetrics) {
        globalGameState.performanceMetrics = { ...globalGameState.performanceMetrics, ...performanceMetrics };
      }
      
      globalGameState.lastSaveTime = Date.now();
      
      res.json({
        success: true,
        data: globalGameState,
        message: 'Game state updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update game state',
        details: error.message
      });
    }
  });
  
  // Game tick management
  app.post('/api/game/tick', (req, res) => {
    try {
      const startTime = Date.now();
      
      // Increment tick counter
      globalGameState.currentTick++;
      
      // Apply game state knobs effects
      applyGameStateKnobsToGameState();
      
      // Calculate tick performance
      const tickTime = Date.now() - startTime;
      globalGameState.performanceMetrics.avgTickTime = 
        (globalGameState.performanceMetrics.avgTickTime * 0.9) + (tickTime * 0.1);
      
      res.json({
        success: true,
        data: {
          tick: globalGameState.currentTick,
          tickTime: tickTime,
          gamePhase: globalGameState.gamePhase
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to process game tick',
        details: error.message
      });
    }
  });
  
  // System registration
  app.post('/api/game/systems/register', (req, res) => {
    try {
      const { systemName, status } = req.body;
      
      if (!globalGameState.activeSystems.includes(systemName)) {
        globalGameState.activeSystems.push(systemName);
      }
      
      res.json({
        success: true,
        data: {
          registeredSystem: systemName,
          activeSystems: globalGameState.activeSystems
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to register system',
        details: error.message
      });
    }
  });
  
  // Get system status
  app.get('/api/game/systems/status', (req, res) => {
    try {
      const systemStatus = {
        activeSystems: globalGameState.activeSystems,
        systemCount: globalGameState.activeSystems.length,
        synchronizationLevel: gameStateKnobs.cross_system_synchronization,
        performanceOptimization: gameStateKnobs.performance_optimization,
        lastUpdate: Date.now()
      };
      
      res.json({
        success: true,
        data: systemStatus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get system status',
        details: error.message
      });
    }
  });

  // Helper functions for game state structured outputs (streamlined)
  function calculateSimulationHealth() {
    const performanceOpt = gameStateKnobs.performance_optimization;
    const systemSync = gameStateKnobs.cross_system_synchronization;
    const dataConsistency = gameStateKnobs.data_consistency_checks;
    return (performanceOpt + systemSync + dataConsistency) / 3;
  }

  function calculateGameProgression() {
    const gameDuration = Date.now() - globalGameState.startTime;
    const tickProgress = globalGameState.currentTick / 1000; // Normalize to 0-1 scale
    const phaseProgress = getPhaseProgress(globalGameState.gamePhase);
    return Math.min(1.0, (tickProgress + phaseProgress) / 2);
  }

  function getPhaseProgress(phase) {
    const phases = { early_game: 0.2, mid_game: 0.5, late_game: 0.8, end_game: 1.0 };
    return phases[phase] || 0.1;
  }

  function calculateSystemPerformance() {
    const avgTickTime = globalGameState.performanceMetrics.avgTickTime;
    const memoryUsage = globalGameState.performanceMetrics.memoryUsage;
    const systemLoad = globalGameState.performanceMetrics.systemLoad;
    
    // Lower values are better for performance
    const performanceScore = Math.max(0, 1 - ((avgTickTime / 1000) + (memoryUsage / 100) + (systemLoad / 100)) / 3);
    return performanceScore;
  }

  function analyzeSystemSynchronization() {
    const syncLevel = gameStateKnobs.cross_system_synchronization;
    const activeSystems = globalGameState.activeSystems.length;
    const syncEffectiveness = syncLevel * Math.min(1.0, activeSystems / 10); // Optimal at 10 systems
    return { sync_level: syncLevel, active_systems: activeSystems, effectiveness: syncEffectiveness };
  }

  function analyzeDataConsistency() {
    const consistencyChecks = gameStateKnobs.data_consistency_checks;
    const dataIntegrityScore = consistencyChecks * 0.9 + 0.1; // Base integrity
    return { consistency_level: consistencyChecks, integrity_score: dataIntegrityScore };
  }

  function identifyPerformanceBottlenecks() {
    const avgTickTime = globalGameState.performanceMetrics.avgTickTime;
    const memoryUsage = globalGameState.performanceMetrics.memoryUsage;
    const bottlenecks = [];
    
    if (avgTickTime > 100) bottlenecks.push('slow_tick_processing');
    if (memoryUsage > 80) bottlenecks.push('high_memory_usage');
    if (globalGameState.activeSystems.length > 15) bottlenecks.push('too_many_active_systems');
    
    return bottlenecks;
  }

  function analyzeResourceUtilization() {
    const memoryMgmt = gameStateKnobs.memory_management;
    const performanceOpt = gameStateKnobs.performance_optimization;
    const utilization = (memoryMgmt + performanceOpt) / 2;
    return { utilization_efficiency: utilization, memory_management: memoryMgmt, performance_optimization: performanceOpt };
  }

  function analyzePlayerEngagement() {
    const tutorialAssist = gameStateKnobs.tutorial_assistance;
    const hintActivity = gameStateKnobs.hint_system_activity;
    const progressFeedback = gameStateKnobs.progress_feedback;
    const achievementTracking = gameStateKnobs.achievement_tracking;
    const engagementScore = (tutorialAssist + hintActivity + progressFeedback + achievementTracking) / 4;
    return { engagement_score: engagementScore, tutorial_level: tutorialAssist, feedback_quality: progressFeedback };
  }

  function assessSystemStability() {
    const performanceScore = calculateSystemPerformance();
    const syncEffectiveness = analyzeSystemSynchronization().effectiveness;
    const stability = (performanceScore + syncEffectiveness) / 2;
    return { stability_score: stability, performance_component: performanceScore, sync_component: syncEffectiveness };
  }

  function assessDataIntegrity() {
    const consistencyChecks = gameStateKnobs.data_consistency_checks;
    const integrityScore = consistencyChecks * 0.95 + 0.05; // High baseline integrity
    return { integrity_score: integrityScore, consistency_enforcement: consistencyChecks };
  }

  function assessPerformanceEfficiency() {
    const performanceOpt = gameStateKnobs.performance_optimization;
    const memoryMgmt = gameStateKnobs.memory_management;
    const systemPerf = calculateSystemPerformance();
    const efficiency = (performanceOpt + memoryMgmt + systemPerf) / 3;
    return { efficiency_score: efficiency, optimization_level: performanceOpt, system_performance: systemPerf };
  }

  function assessPlayerSatisfaction() {
    const challengeLevel = gameStateKnobs.challenge_level;
    const tutorialAssist = gameStateKnobs.tutorial_assistance;
    const progressFeedback = gameStateKnobs.progress_feedback;
    
    // Balanced challenge and good support = high satisfaction
    const balancedChallenge = 1 - Math.abs(challengeLevel - 0.6); // Optimal around 0.6
    const supportQuality = (tutorialAssist + progressFeedback) / 2;
    const satisfaction = (balancedChallenge + supportQuality) / 2;
    
    return { satisfaction_score: satisfaction, challenge_balance: balancedChallenge, support_quality: supportQuality };
  }

  function assessNarrativeCoherence() {
    const storyPacing = gameStateKnobs.story_pacing;
    const narrativeBranching = gameStateKnobs.narrative_branching;
    const characterIntegration = gameStateKnobs.character_story_integration;
    const plotTwistFreq = gameStateKnobs.plot_twist_frequency;
    
    // Balanced narrative elements
    const coherence = (storyPacing + characterIntegration + (1 - Math.abs(narrativeBranching - 0.5)) + (1 - Math.abs(plotTwistFreq - 0.4))) / 4;
    return { coherence_score: coherence, story_pacing: storyPacing, character_integration: characterIntegration };
  }

  function generateGameStateAIAlerts() {
    const alerts = [];
    
    // Performance degradation alert
    const performanceScore = calculateSystemPerformance();
    if (performanceScore < 0.4) {
      alerts.push({ type: 'performance_degradation', severity: 'high', message: 'Game performance is below acceptable levels' });
    }
    
    // System overload alert
    if (globalGameState.activeSystems.length > 20) {
      alerts.push({ type: 'system_overload', severity: 'medium', message: 'Too many active systems may impact performance' });
    }
    
    // Data consistency alert
    const dataConsistency = gameStateKnobs.data_consistency_checks;
    if (dataConsistency < 0.7) {
      alerts.push({ type: 'data_consistency_risk', severity: 'medium', message: 'Low data consistency checks may cause issues' });
    }
    
    // Player engagement alert
    const engagement = analyzePlayerEngagement();
    if (engagement.engagement_score < 0.4) {
      alerts.push({ type: 'low_player_engagement', severity: 'high', message: 'Player engagement systems need attention' });
    }
    
    // Memory usage alert
    const memoryUsage = globalGameState.performanceMetrics.memoryUsage;
    if (memoryUsage > 85) {
      alerts.push({ type: 'high_memory_usage', severity: 'high', message: 'Memory usage is critically high' });
    }
    
    return alerts;
  }

  function calculateSystemCoordination() {
    const syncLevel = gameStateKnobs.cross_system_synchronization;
    const activeSystems = globalGameState.activeSystems.length;
    const coordinationEffectiveness = syncLevel * Math.min(1.0, 10 / Math.max(1, activeSystems)); // Better with fewer systems
    return { 
      coordination_level: syncLevel, 
      active_systems: activeSystems, 
      effectiveness: coordinationEffectiveness,
      optimal_system_count: 10
    };
  }

  function calculateResourceAllocation() {
    const memoryMgmt = gameStateKnobs.memory_management;
    const performanceOpt = gameStateKnobs.performance_optimization;
    const resourceScarcity = gameStateKnobs.resource_scarcity;
    
    const allocationEfficiency = (memoryMgmt + performanceOpt + (1 - resourceScarcity)) / 3;
    return {
      allocation_efficiency: allocationEfficiency,
      memory_allocation: memoryMgmt,
      performance_allocation: performanceOpt,
      resource_availability: 1 - resourceScarcity
    };
  }

  function identifyOptimizationOpportunities() {
    const opportunities = [];
    
    const performanceOpt = gameStateKnobs.performance_optimization;
    if (performanceOpt < 0.7) {
      opportunities.push({ type: 'performance_optimization', priority: 'high', potential_gain: 0.3 });
    }
    
    const memoryMgmt = gameStateKnobs.memory_management;
    if (memoryMgmt < 0.6) {
      opportunities.push({ type: 'memory_management', priority: 'medium', potential_gain: 0.2 });
    }
    
    const syncLevel = gameStateKnobs.cross_system_synchronization;
    if (syncLevel < 0.8 && globalGameState.activeSystems.length > 5) {
      opportunities.push({ type: 'system_synchronization', priority: 'high', potential_gain: 0.4 });
    }
    
    return opportunities;
  }

  function calculatePlayerExperience() {
    const tutorialAssist = gameStateKnobs.tutorial_assistance;
    const hintActivity = gameStateKnobs.hint_system_activity;
    const progressFeedback = gameStateKnobs.progress_feedback;
    const achievementTracking = gameStateKnobs.achievement_tracking;
    const challengeLevel = gameStateKnobs.challenge_level;
    
    const experienceQuality = (tutorialAssist + hintActivity + progressFeedback + achievementTracking) / 4;
    const challengeBalance = 1 - Math.abs(challengeLevel - 0.6); // Optimal challenge
    
    return {
      experience_quality: experienceQuality,
      challenge_balance: challengeBalance,
      tutorial_effectiveness: tutorialAssist,
      feedback_quality: progressFeedback,
      achievement_engagement: achievementTracking
    };
  }

  function calculateNarrativeIntegration() {
    const storyPacing = gameStateKnobs.story_pacing;
    const narrativeBranching = gameStateKnobs.narrative_branching;
    const characterIntegration = gameStateKnobs.character_story_integration;
    const plotTwistFreq = gameStateKnobs.plot_twist_frequency;
    
    const integrationStrength = (storyPacing + narrativeBranching + characterIntegration) / 3;
    const narrativeBalance = 1 - Math.abs(plotTwistFreq - 0.4); // Optimal twist frequency
    
    return {
      integration_strength: integrationStrength,
      narrative_balance: narrativeBalance,
      story_coherence: (integrationStrength + narrativeBalance) / 2,
      character_story_sync: characterIntegration
    };
  }

  function calculateMultiplayerCoordination() {
    const playerSync = gameStateKnobs.player_synchronization;
    const turnMgmt = gameStateKnobs.turn_management;
    const conflictResolution = gameStateKnobs.conflict_resolution;
    const playerCount = globalGameState.playerCount;
    
    const coordinationEffectiveness = (playerSync + turnMgmt + conflictResolution) / 3;
    const scalabilityFactor = Math.min(1.0, 10 / Math.max(1, playerCount)); // Better with fewer players
    
    return {
      coordination_effectiveness: coordinationEffectiveness,
      scalability_factor: scalabilityFactor,
      player_count: playerCount,
      sync_quality: playerSync,
      conflict_management: conflictResolution
    };
  }

  // Apply AI knobs to actual game state
  function applyGameStateKnobsToGameState() {
    // Apply simulation speed to tick processing
    const simulationSpeed = gameStateKnobs.simulation_speed;
    globalGameState.simulationSpeedMultiplier = simulationSpeed;
    
    // Apply time compression
    const timeCompression = gameStateKnobs.time_compression;
    globalGameState.timeCompressionRatio = timeCompression;
    
    // Apply event frequency to random events
    const eventFreq = gameStateKnobs.event_frequency;
    globalGameState.eventGenerationRate = eventFreq;
    
    // Apply challenge level to game difficulty
    const challengeLevel = gameStateKnobs.challenge_level;
    globalGameState.difficultyMultiplier = challengeLevel;
    
    // Apply performance optimization
    const performanceOpt = gameStateKnobs.performance_optimization;
    if (performanceOpt > 0.7) {
      // Enable performance optimizations
      globalGameState.performanceMode = 'optimized';
      globalGameState.updateFrequency = 'reduced';
    } else if (performanceOpt < 0.3) {
      globalGameState.performanceMode = 'detailed';
      globalGameState.updateFrequency = 'full';
    }
    
    // Apply memory management
    const memoryMgmt = gameStateKnobs.memory_management;
    if (memoryMgmt > 0.7) {
      globalGameState.memoryOptimization = 'aggressive';
    } else if (memoryMgmt < 0.3) {
      globalGameState.memoryOptimization = 'minimal';
    } else {
      globalGameState.memoryOptimization = 'balanced';
    }
    
    // Apply system synchronization
    const systemSync = gameStateKnobs.cross_system_synchronization;
    globalGameState.systemSyncFrequency = Math.floor(systemSync * 10) + 1; // 1-10 ticks
    
    // Apply player experience settings
    const tutorialAssist = gameStateKnobs.tutorial_assistance;
    globalGameState.tutorialMode = tutorialAssist > 0.6 ? 'active' : tutorialAssist > 0.3 ? 'minimal' : 'disabled';
    
    const hintActivity = gameStateKnobs.hint_system_activity;
    globalGameState.hintFrequency = Math.floor(hintActivity * 5) + 1; // 1-5 hints per session
    
    console.log('🎛️ Game State knobs applied:', {
      simulation_speed: gameStateKnobs.simulation_speed,
      performance_optimization: gameStateKnobs.performance_optimization,
      system_synchronization: gameStateKnobs.cross_system_synchronization,
      challenge_level: gameStateKnobs.challenge_level,
      tutorial_assistance: gameStateKnobs.tutorial_assistance
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/game/knobs', (req, res) => {
    const knobData = gameStateKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'game-state',
      description: 'AI-adjustable parameters for game state system with enhanced input support',
      input_help: gameStateKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/game/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: gameStateKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = gameStateKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyGameStateKnobsToGameState();
    } catch (error) {
      console.error('Error applying game state knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'game-state',
      ...updateResult,
      message: 'Game state knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/game/knobs/help', (req, res) => {
    res.json({
      system: 'game-state',
      help: gameStateKnobSystem.getKnobDescriptions(),
      current_values: gameStateKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/game/ai-data', (req, res) => {
    const structuredData = generateGameStateStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured game state data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/game/cross-system', (req, res) => {
    const outputs = generateGameStateStructuredOutputs();
    res.json({
      coordination_data: outputs.cross_system_data.system_coordination_status,
      resource_data: outputs.cross_system_data.resource_allocation_data,
      optimization_data: outputs.cross_system_data.performance_optimization_opportunities,
      experience_data: outputs.cross_system_data.player_experience_metrics,
      narrative_data: outputs.cross_system_data.narrative_integration_status,
      multiplayer_data: outputs.cross_system_data.multiplayer_coordination_data,
      game_summary: outputs.game_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupGameStateAPIs };
