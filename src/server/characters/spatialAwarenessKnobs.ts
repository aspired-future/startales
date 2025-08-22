/**
 * Spatial Awareness API Knobs for Character AI Systems
 * Enhanced knobs for galactic map cognizance, military intelligence, trade logistics, and sensor systems
 */

export interface SpatialAwarenessKnobsState {
  // === GALACTIC MAP AWARENESS ===
  galactic_map_detail_level: number;              // Level of detail characters perceive in galactic map (0.1-1.0)
  distance_calculation_accuracy: number;          // Accuracy of distance calculations between systems (0.5-1.0)
  planetary_terrain_awareness: number;            // Understanding of planetary surface conditions (0.1-1.0)
  stellar_navigation_proficiency: number;         // Skill in stellar navigation and route planning (0.1-1.0)
  
  // === MILITARY INTELLIGENCE & AWARENESS ===
  fleet_movement_tracking: number;                // Ability to track friendly and enemy fleet movements (0.1-1.0)
  military_unit_positioning: number;              // Awareness of military unit positions and deployments (0.1-1.0)
  strategic_location_assessment: number;          // Evaluation of strategic importance of locations (0.1-1.0)
  tactical_terrain_analysis: number;              // Analysis of terrain for tactical advantages (0.1-1.0)
  intelligence_network_coverage: number;          // Coverage and effectiveness of intelligence networks (0.1-1.0)
  enemy_fleet_detection_range: number;            // Range at which enemy fleets can be detected (0.1-2.0)
  friendly_fleet_coordination: number;            // Coordination efficiency with friendly forces (0.1-1.0)
  military_logistics_awareness: number;           // Understanding of supply lines and logistics (0.1-1.0)
  
  // === TRADE & ECONOMIC SPATIAL AWARENESS ===
  trade_route_optimization: number;               // Efficiency in planning optimal trade routes (0.1-1.0)
  resource_deposit_knowledge: number;             // Knowledge of resource locations and quantities (0.1-1.0)
  market_demand_spatial_analysis: number;         // Understanding of demand patterns across space (0.1-1.0)
  corporate_presence_mapping: number;             // Awareness of corporate facilities and influence (0.1-1.0)
  supply_chain_visibility: number;                // Visibility into supply chain networks (0.1-1.0)
  transport_cost_calculation: number;             // Accuracy in calculating transport costs (0.1-1.0)
  trade_security_assessment: number;              // Assessment of trade route security risks (0.1-1.0)
  economic_zone_analysis: number;                 // Analysis of economic zones and opportunities (0.1-1.0)
  
  // === SENSOR SYSTEMS & DETECTION ===
  sensor_range_efficiency: number;                // Effectiveness of sensor systems across distances (0.1-2.0)
  long_range_scanning_capability: number;         // Capability for long-range system scanning (0.1-1.0)
  stealth_detection_sensitivity: number;          // Ability to detect stealthed or hidden objects (0.1-1.0)
  sensor_data_processing_speed: number;           // Speed of processing sensor information (0.1-1.0)
  multi_spectrum_analysis: number;                // Analysis across multiple sensor spectrums (0.1-1.0)
  gravitational_anomaly_detection: number;        // Detection of gravitational disturbances (0.1-1.0)
  hyperspace_signature_tracking: number;          // Tracking of hyperspace jump signatures (0.1-1.0)
  communication_interception: number;             // Ability to intercept enemy communications (0.1-1.0)
  
  // === CHARACTER ROLE SPECIALIZATIONS ===
  military_commander_spatial_iq: number;          // Military commanders' spatial intelligence (0.1-1.0)
  intelligence_officer_network_reach: number;     // Intelligence officers' information network reach (0.1-1.0)
  trade_executive_market_vision: number;          // Trade executives' market spatial understanding (0.1-1.0)
  explorer_pathfinding_skill: number;             // Explorers' ability to find optimal paths (0.1-1.0)
  diplomat_territorial_understanding: number;     // Diplomats' understanding of territorial dynamics (0.1-1.0)
  scientist_anomaly_detection: number;            // Scientists' ability to detect spatial anomalies (0.1-1.0)
  
  // === TEMPORAL & PREDICTIVE AWARENESS ===
  travel_time_estimation: number;                 // Accuracy in estimating travel times (0.1-1.0)
  fleet_arrival_prediction: number;               // Prediction of fleet arrival times (0.1-1.0)
  resource_depletion_forecasting: number;         // Forecasting of resource depletion timelines (0.1-1.0)
  market_trend_spatial_correlation: number;       // Correlation of market trends with spatial factors (0.1-1.0)
  territorial_expansion_modeling: number;         // Modeling of territorial expansion patterns (0.1-1.0)
  conflict_escalation_prediction: number;         // Prediction of conflict escalation based on positions (0.1-1.0)
  
  // === ENVIRONMENTAL & HAZARD AWARENESS ===
  space_hazard_recognition: number;               // Recognition of space hazards and dangers (0.1-1.0)
  stellar_phenomenon_awareness: number;           // Awareness of stellar phenomena effects (0.1-1.0)
  nebula_navigation_expertise: number;            // Expertise in navigating nebulae and obstacles (0.1-1.0)
  asteroid_field_pathfinding: number;             // Pathfinding through asteroid fields (0.1-1.0)
  radiation_zone_avoidance: number;               // Avoidance of dangerous radiation zones (0.1-1.0)
  gravitational_well_navigation: number;          // Navigation around gravitational wells (0.1-1.0)
  
  lastUpdated: number;
}

export const SPATIAL_AWARENESS_AI_PROMPTS = {
  galactic_map_detail_level: "Adjust the level of detail characters perceive in galactic maps for optimal decision-making",
  distance_calculation_accuracy: "Control accuracy of distance calculations to balance realism with gameplay",
  planetary_terrain_awareness: "Modify character understanding of planetary conditions for strategic planning",
  stellar_navigation_proficiency: "Adjust navigation skills to balance challenge with accessibility",
  
  fleet_movement_tracking: "Control ability to track fleet movements for strategic military gameplay",
  military_unit_positioning: "Adjust awareness of military positions for tactical depth",
  strategic_location_assessment: "Modify strategic location evaluation for military decision-making",
  tactical_terrain_analysis: "Control terrain analysis capabilities for tactical combat",
  intelligence_network_coverage: "Adjust intelligence network effectiveness for information warfare",
  enemy_fleet_detection_range: "Control enemy detection range for balanced military encounters",
  friendly_fleet_coordination: "Modify coordination efficiency for military cooperation",
  military_logistics_awareness: "Adjust logistics understanding for supply chain strategy",
  
  trade_route_optimization: "Control trade route planning efficiency for economic gameplay",
  resource_deposit_knowledge: "Adjust knowledge of resource locations for exploration incentives",
  market_demand_spatial_analysis: "Modify spatial market analysis for trade strategy",
  corporate_presence_mapping: "Control corporate awareness for business competition",
  supply_chain_visibility: "Adjust supply chain transparency for logistics management",
  transport_cost_calculation: "Control transport cost accuracy for economic decision-making",
  trade_security_assessment: "Modify security risk assessment for trade route planning",
  economic_zone_analysis: "Adjust economic zone understanding for market expansion",
  
  sensor_range_efficiency: "Control sensor effectiveness across distances for detection gameplay",
  long_range_scanning_capability: "Adjust long-range scanning for exploration and surveillance",
  stealth_detection_sensitivity: "Modify stealth detection for balanced stealth mechanics",
  sensor_data_processing_speed: "Control processing speed for real-time tactical decisions",
  multi_spectrum_analysis: "Adjust multi-spectrum capabilities for detailed analysis",
  gravitational_anomaly_detection: "Control anomaly detection for scientific discovery",
  hyperspace_signature_tracking: "Modify hyperspace tracking for fleet movement detection",
  communication_interception: "Adjust communication interception for intelligence gathering",
  
  military_commander_spatial_iq: "Control military commanders' spatial intelligence for strategic depth",
  intelligence_officer_network_reach: "Adjust intelligence officers' network reach for information access",
  trade_executive_market_vision: "Modify trade executives' market understanding for business strategy",
  explorer_pathfinding_skill: "Control explorers' pathfinding abilities for navigation challenges",
  diplomat_territorial_understanding: "Adjust diplomats' territorial awareness for negotiation depth",
  scientist_anomaly_detection: "Modify scientists' anomaly detection for research gameplay",
  
  travel_time_estimation: "Control travel time estimation accuracy for planning and logistics",
  fleet_arrival_prediction: "Adjust fleet arrival prediction for tactical timing",
  resource_depletion_forecasting: "Modify resource forecasting for long-term planning",
  market_trend_spatial_correlation: "Control spatial market correlation for trade strategy",
  territorial_expansion_modeling: "Adjust expansion modeling for strategic planning",
  conflict_escalation_prediction: "Modify conflict prediction for diplomatic intervention",
  
  space_hazard_recognition: "Control hazard recognition for safe navigation",
  stellar_phenomenon_awareness: "Adjust stellar awareness for environmental challenges",
  nebula_navigation_expertise: "Modify nebula navigation for exploration difficulty",
  asteroid_field_pathfinding: "Control asteroid navigation for piloting challenges",
  radiation_zone_avoidance: "Adjust radiation avoidance for safety considerations",
  gravitational_well_navigation: "Modify gravitational navigation for physics-based challenges"
};

export const DEFAULT_SPATIAL_AWARENESS_KNOBS: SpatialAwarenessKnobsState = {
  // Galactic Map Awareness
  galactic_map_detail_level: 0.8,
  distance_calculation_accuracy: 0.9,
  planetary_terrain_awareness: 0.7,
  stellar_navigation_proficiency: 0.8,
  
  // Military Intelligence & Awareness
  fleet_movement_tracking: 0.7,
  military_unit_positioning: 0.8,
  strategic_location_assessment: 0.8,
  tactical_terrain_analysis: 0.7,
  intelligence_network_coverage: 0.6,
  enemy_fleet_detection_range: 0.7,
  friendly_fleet_coordination: 0.8,
  military_logistics_awareness: 0.7,
  
  // Trade & Economic Spatial Awareness
  trade_route_optimization: 0.8,
  resource_deposit_knowledge: 0.7,
  market_demand_spatial_analysis: 0.7,
  corporate_presence_mapping: 0.6,
  supply_chain_visibility: 0.7,
  transport_cost_calculation: 0.9,
  trade_security_assessment: 0.7,
  economic_zone_analysis: 0.7,
  
  // Sensor Systems & Detection
  sensor_range_efficiency: 0.8,
  long_range_scanning_capability: 0.7,
  stealth_detection_sensitivity: 0.6,
  sensor_data_processing_speed: 0.8,
  multi_spectrum_analysis: 0.7,
  gravitational_anomaly_detection: 0.6,
  hyperspace_signature_tracking: 0.7,
  communication_interception: 0.5,
  
  // Character Role Specializations
  military_commander_spatial_iq: 0.9,
  intelligence_officer_network_reach: 0.8,
  trade_executive_market_vision: 0.8,
  explorer_pathfinding_skill: 0.9,
  diplomat_territorial_understanding: 0.7,
  scientist_anomaly_detection: 0.8,
  
  // Temporal & Predictive Awareness
  travel_time_estimation: 0.8,
  fleet_arrival_prediction: 0.7,
  resource_depletion_forecasting: 0.7,
  market_trend_spatial_correlation: 0.6,
  territorial_expansion_modeling: 0.7,
  conflict_escalation_prediction: 0.6,
  
  // Environmental & Hazard Awareness
  space_hazard_recognition: 0.8,
  stellar_phenomenon_awareness: 0.7,
  nebula_navigation_expertise: 0.6,
  asteroid_field_pathfinding: 0.7,
  radiation_zone_avoidance: 0.8,
  gravitational_well_navigation: 0.7,
  
  lastUpdated: Date.now()
};

/**
 * Apply spatial awareness knobs to character AI state
 */
export function applySpatialAwarenessKnobsToCharacterAI(knobs: SpatialAwarenessKnobsState, characterState: any): any {
  const enhancedCharacterState = {
    ...characterState,
    spatialAwareness: {
      ...characterState.spatialAwareness,
      
      // Apply galactic map awareness
      mapAwareness: {
        detailLevel: knobs.galactic_map_detail_level,
        distanceAccuracy: knobs.distance_calculation_accuracy,
        terrainAwareness: knobs.planetary_terrain_awareness,
        navigationSkill: knobs.stellar_navigation_proficiency
      },
      
      // Apply military intelligence
      militaryIntelligence: {
        fleetTracking: knobs.fleet_movement_tracking,
        unitPositioning: knobs.military_unit_positioning,
        strategicAssessment: knobs.strategic_location_assessment,
        tacticalAnalysis: knobs.tactical_terrain_analysis,
        networkCoverage: knobs.intelligence_network_coverage,
        detectionRange: knobs.enemy_fleet_detection_range,
        coordination: knobs.friendly_fleet_coordination,
        logisticsAwareness: knobs.military_logistics_awareness
      },
      
      // Apply trade and economic awareness
      tradeIntelligence: {
        routeOptimization: knobs.trade_route_optimization,
        resourceKnowledge: knobs.resource_deposit_knowledge,
        marketAnalysis: knobs.market_demand_spatial_analysis,
        corporateMapping: knobs.corporate_presence_mapping,
        supplyChainVisibility: knobs.supply_chain_visibility,
        costCalculation: knobs.transport_cost_calculation,
        securityAssessment: knobs.trade_security_assessment,
        economicAnalysis: knobs.economic_zone_analysis
      },
      
      // Apply sensor systems
      sensorCapabilities: {
        rangeEfficiency: knobs.sensor_range_efficiency,
        longRangeScanning: knobs.long_range_scanning_capability,
        stealthDetection: knobs.stealth_detection_sensitivity,
        processingSpeed: knobs.sensor_data_processing_speed,
        multiSpectrum: knobs.multi_spectrum_analysis,
        anomalyDetection: knobs.gravitational_anomaly_detection,
        hyperspaceTracking: knobs.hyperspace_signature_tracking,
        commInterception: knobs.communication_interception
      },
      
      // Apply role specializations
      roleSpecializations: {
        militaryCommanderIQ: knobs.military_commander_spatial_iq,
        intelligenceNetworkReach: knobs.intelligence_officer_network_reach,
        tradeMarketVision: knobs.trade_executive_market_vision,
        explorerPathfinding: knobs.explorer_pathfinding_skill,
        diplomatTerritorial: knobs.diplomat_territorial_understanding,
        scientistAnomalyDetection: knobs.scientist_anomaly_detection
      },
      
      // Apply temporal and predictive awareness
      predictiveCapabilities: {
        travelTimeEstimation: knobs.travel_time_estimation,
        fleetArrivalPrediction: knobs.fleet_arrival_prediction,
        resourceForecasting: knobs.resource_depletion_forecasting,
        marketTrendCorrelation: knobs.market_trend_spatial_correlation,
        expansionModeling: knobs.territorial_expansion_modeling,
        conflictPrediction: knobs.conflict_escalation_prediction
      },
      
      // Apply environmental awareness
      environmentalAwareness: {
        hazardRecognition: knobs.space_hazard_recognition,
        stellarPhenomena: knobs.stellar_phenomenon_awareness,
        nebulaNavigation: knobs.nebula_navigation_expertise,
        asteroidPathfinding: knobs.asteroid_field_pathfinding,
        radiationAvoidance: knobs.radiation_zone_avoidance,
        gravitationalNavigation: knobs.gravitational_well_navigation
      }
    }
  };
  
  return enhancedCharacterState;
}
