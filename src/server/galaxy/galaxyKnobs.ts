/**
 * Enhanced Galaxy API Knobs
 * Advanced AI-driven knob system for Galaxy Map and Galaxy Data with simulation integration
 */

export interface GalaxyKnobsState {
  // === GALAXY GENERATION & PROCEDURAL CONTENT ===
  galaxy_size_scale: number;                    // Galaxy size scale and star system density (0.1-2.0)
  procedural_generation_complexity: number;     // Procedural generation complexity and detail level (0.1-1.0)
  star_system_diversity: number;                // Star system diversity and unique characteristics (0.1-1.0)
  stellar_classification_accuracy: number;      // Stellar classification accuracy and scientific detail (0.5-1.0)
  
  // === EXPLORATION & DISCOVERY ===
  exploration_reward_frequency: number;         // Exploration reward frequency and discovery incentives (0.1-1.0)
  unknown_region_mystery: number;               // Unknown region mystery and exploration intrigue (0.1-1.0)
  discovery_significance_weighting: number;     // Discovery significance weighting and importance scaling (0.1-1.0)
  xenoarchaeology_discovery_rate: number;       // Xenoarchaeology discovery rate and ancient artifacts (0.1-1.0)
  scientific_anomaly_frequency: number;         // Scientific anomaly frequency and research opportunities (0.1-1.0)
  
  // === NAVIGATION & TRAVEL ===
  faster_than_light_efficiency: number;         // Faster-than-light travel efficiency and speed (0.1-2.0)
  navigation_accuracy: number;                  // Navigation accuracy and route precision (0.5-1.0)
  space_hazard_frequency: number;               // Space hazard frequency and travel dangers (0.1-1.0)
  hyperspace_stability: number;                 // Hyperspace stability and jump reliability (0.3-1.0)
  
  // === PLANETARY SYSTEMS & HABITABILITY ===
  habitable_planet_frequency: number;           // Habitable planet frequency and colonization opportunities (0.1-1.0)
  planetary_resource_abundance: number;         // Planetary resource abundance and extraction potential (0.1-2.0)
  atmospheric_diversity: number;                // Atmospheric diversity and environmental variety (0.1-1.0)
  terraforming_potential: number;               // Terraforming potential and planetary modification (0.1-1.0)
  
  // === GALACTIC POLITICS & TERRITORIES ===
  territorial_boundary_clarity: number;         // Territorial boundary clarity and sovereignty definition (0.1-1.0)
  neutral_zone_stability: number;               // Neutral zone stability and diplomatic buffer areas (0.1-1.0)
  border_dispute_frequency: number;             // Border dispute frequency and territorial conflicts (0.1-1.0)
  diplomatic_complexity: number;                // Diplomatic complexity and inter-civilization relations (0.1-1.0)
  
  // === SPACE INFRASTRUCTURE & DEVELOPMENT ===
  space_station_development: number;            // Space station development and orbital infrastructure (0.1-1.0)
  trade_route_establishment: number;            // Trade route establishment and commercial pathways (0.1-1.0)
  communication_network_coverage: number;       // Communication network coverage and galactic connectivity (0.1-1.0)
  industrial_space_expansion: number;           // Industrial space expansion and manufacturing (0.1-1.0)
  
  // === SCIENTIFIC RESEARCH & TECHNOLOGY ===
  astrophysics_research_depth: number;          // Astrophysics research depth and cosmic understanding (0.1-1.0)
  quantum_mechanics_mastery: number;            // Quantum mechanics mastery and advanced physics (0.1-1.0)
  energy_technology_advancement: number;        // Energy technology advancement and power systems (0.1-1.0)
  propulsion_system_innovation: number;         // Propulsion system innovation and travel technology (0.1-1.0)
  
  // === ENVIRONMENTAL & COSMIC EVENTS ===
  cosmic_event_frequency: number;               // Cosmic event frequency and galactic phenomena (0.1-1.0)
  stellar_evolution_simulation: number;         // Stellar evolution simulation and star lifecycle (0.1-1.0)
  galactic_weather_patterns: number;            // Galactic weather patterns and space conditions (0.1-1.0)
  dark_matter_influence: number;                // Dark matter influence and mysterious forces (0.1-1.0)
  
  // === CIVILIZATION INTERACTION ===
  first_contact_protocols: number;              // First contact protocols and alien encounter handling (0.1-1.0)
  cultural_exchange_rate: number;               // Cultural exchange rate and civilization interaction (0.1-1.0)
  technology_sharing_openness: number;          // Technology sharing openness and knowledge transfer (0.1-1.0)
  galactic_council_influence: number;           // Galactic council influence and unified governance (0.1-1.0)
  
  // === ECONOMIC & RESOURCE MANAGEMENT ===
  interstellar_trade_volume: number;            // Interstellar trade volume and economic activity (0.1-2.0)
  resource_scarcity_pressure: number;           // Resource scarcity pressure and competition (0.1-1.0)
  mining_operation_efficiency: number;          // Mining operation efficiency and resource extraction (0.1-1.0)
  economic_interdependence: number;             // Economic interdependence between civilizations (0.1-1.0)
  
  // === MILITARY & SECURITY ===
  space_defense_readiness: number;              // Space defense readiness and military preparedness (0.1-1.0)
  fleet_deployment_strategy: number;            // Fleet deployment strategy and tactical positioning (0.1-1.0)
  weapons_technology_advancement: number;       // Weapons technology advancement and military innovation (0.1-1.0)
  peacekeeping_effectiveness: number;           // Peacekeeping effectiveness and conflict resolution (0.1-1.0)
  
  lastUpdated: number;
}

export const GALAXY_KNOBS_AI_PROMPTS = {
  galaxy_size_scale: "Adjust galaxy size and star system density based on exploration patterns and player engagement",
  procedural_generation_complexity: "Modify procedural generation complexity to balance performance with content richness",
  star_system_diversity: "Control star system diversity to maintain exploration interest and scientific discovery",
  stellar_classification_accuracy: "Adjust stellar classification detail for scientific accuracy vs gameplay accessibility",
  
  exploration_reward_frequency: "Balance exploration rewards to maintain motivation without trivializing discoveries",
  unknown_region_mystery: "Control mystery levels in unexplored regions to sustain exploration intrigue",
  discovery_significance_weighting: "Weight discovery importance to create meaningful exploration milestones",
  xenoarchaeology_discovery_rate: "Adjust ancient artifact discovery rate for historical depth and lore building",
  scientific_anomaly_frequency: "Control scientific anomaly frequency for research opportunities and wonder",
  
  faster_than_light_efficiency: "Adjust FTL travel speed to balance exploration pace with strategic positioning",
  navigation_accuracy: "Control navigation precision to balance convenience with exploration challenge",
  space_hazard_frequency: "Adjust space hazards to create travel tension without frustrating players",
  hyperspace_stability: "Control hyperspace reliability for travel predictability vs adventure",
  
  habitable_planet_frequency: "Balance habitable worlds to support expansion without trivializing colonization",
  planetary_resource_abundance: "Adjust resource availability to create meaningful economic decisions",
  atmospheric_diversity: "Control atmospheric variety for environmental storytelling and gameplay variety",
  terraforming_potential: "Adjust terraforming opportunities for long-term strategic planning",
  
  territorial_boundary_clarity: "Control territorial definition clarity for diplomatic and strategic gameplay",
  neutral_zone_stability: "Adjust neutral zone stability for diplomatic buffer zones and conflict management",
  border_dispute_frequency: "Balance territorial conflicts for political tension without constant warfare",
  diplomatic_complexity: "Control diplomatic system complexity for engaging but manageable relations",
  
  space_station_development: "Adjust space infrastructure development for strategic depth and visual appeal",
  trade_route_establishment: "Control trade route development for economic gameplay and strategic positioning",
  communication_network_coverage: "Adjust communication coverage for information flow and strategic coordination",
  industrial_space_expansion: "Control space-based industry for economic diversification and strategic options",
  
  astrophysics_research_depth: "Adjust scientific research depth for educational value and gameplay progression",
  quantum_mechanics_mastery: "Control advanced physics mastery for technology progression and wonder",
  energy_technology_advancement: "Adjust energy tech advancement for power system complexity and capability",
  propulsion_system_innovation: "Control propulsion innovation for travel technology progression and strategy",
  
  cosmic_event_frequency: "Balance cosmic events for spectacle and challenge without overwhelming players",
  stellar_evolution_simulation: "Adjust stellar lifecycle simulation for long-term strategic planning",
  galactic_weather_patterns: "Control space weather for environmental challenge and atmospheric storytelling",
  dark_matter_influence: "Adjust mysterious cosmic forces for wonder and advanced gameplay elements",
  
  first_contact_protocols: "Control alien encounter complexity for diplomatic depth and cultural storytelling",
  cultural_exchange_rate: "Adjust cultural interaction speed for civilization development and diversity",
  technology_sharing_openness: "Control tech sharing for strategic cooperation vs competitive advantage",
  galactic_council_influence: "Adjust unified governance influence for large-scale political gameplay",
  
  interstellar_trade_volume: "Balance trade activity for economic gameplay without overwhelming complexity",
  resource_scarcity_pressure: "Adjust resource competition for strategic tension and economic decision-making",
  mining_operation_efficiency: "Control resource extraction efficiency for economic balance and progression",
  economic_interdependence: "Adjust civilization economic connections for cooperative and competitive dynamics",
  
  space_defense_readiness: "Balance military preparedness for security without promoting constant conflict",
  fleet_deployment_strategy: "Control tactical positioning complexity for strategic military gameplay",
  weapons_technology_advancement: "Adjust military tech progression for balanced power dynamics",
  peacekeeping_effectiveness: "Control conflict resolution effectiveness for diplomatic gameplay options"
};

export const DEFAULT_GALAXY_KNOBS: GalaxyKnobsState = {
  // Galaxy Generation & Procedural Content
  galaxy_size_scale: 0.8,
  procedural_generation_complexity: 0.8,
  star_system_diversity: 0.8,
  stellar_classification_accuracy: 0.9,
  
  // Exploration & Discovery
  exploration_reward_frequency: 0.7,
  unknown_region_mystery: 0.8,
  discovery_significance_weighting: 0.7,
  xenoarchaeology_discovery_rate: 0.6,
  scientific_anomaly_frequency: 0.6,
  
  // Navigation & Travel
  faster_than_light_efficiency: 0.8,
  navigation_accuracy: 0.9,
  space_hazard_frequency: 0.6,
  hyperspace_stability: 0.8,
  
  // Planetary Systems & Habitability
  habitable_planet_frequency: 0.7,
  planetary_resource_abundance: 0.7,
  atmospheric_diversity: 0.8,
  terraforming_potential: 0.6,
  
  // Galactic Politics & Territories
  territorial_boundary_clarity: 0.8,
  neutral_zone_stability: 0.7,
  border_dispute_frequency: 0.5,
  diplomatic_complexity: 0.7,
  
  // Space Infrastructure & Development
  space_station_development: 0.7,
  trade_route_establishment: 0.8,
  communication_network_coverage: 0.8,
  industrial_space_expansion: 0.6,
  
  // Scientific Research & Technology
  astrophysics_research_depth: 0.7,
  quantum_mechanics_mastery: 0.6,
  energy_technology_advancement: 0.7,
  propulsion_system_innovation: 0.7,
  
  // Environmental & Cosmic Events
  cosmic_event_frequency: 0.5,
  stellar_evolution_simulation: 0.7,
  galactic_weather_patterns: 0.6,
  dark_matter_influence: 0.5,
  
  // Civilization Interaction
  first_contact_protocols: 0.7,
  cultural_exchange_rate: 0.6,
  technology_sharing_openness: 0.6,
  galactic_council_influence: 0.5,
  
  // Economic & Resource Management
  interstellar_trade_volume: 0.8,
  resource_scarcity_pressure: 0.6,
  mining_operation_efficiency: 0.7,
  economic_interdependence: 0.7,
  
  // Military & Security
  space_defense_readiness: 0.7,
  fleet_deployment_strategy: 0.7,
  weapons_technology_advancement: 0.6,
  peacekeeping_effectiveness: 0.7,
  
  lastUpdated: Date.now()
};

/**
 * Apply galaxy knobs to simulation state
 */
export function applyGalaxyKnobsToSimulation(knobs: GalaxyKnobsState, simulationState: any): any {
  const galaxyState = {
    ...simulationState,
    galaxy: {
      ...simulationState.galaxy,
      
      // Apply generation settings
      generation: {
        sizeScale: knobs.galaxy_size_scale,
        complexity: knobs.procedural_generation_complexity,
        diversity: knobs.star_system_diversity,
        stellarAccuracy: knobs.stellar_classification_accuracy
      },
      
      // Apply exploration settings
      exploration: {
        rewardFrequency: knobs.exploration_reward_frequency,
        mysteryLevel: knobs.unknown_region_mystery,
        discoveryWeighting: knobs.discovery_significance_weighting,
        xenoarchaeologyRate: knobs.xenoarchaeology_discovery_rate,
        anomalyFrequency: knobs.scientific_anomaly_frequency
      },
      
      // Apply navigation settings
      navigation: {
        ftlEfficiency: knobs.faster_than_light_efficiency,
        accuracy: knobs.navigation_accuracy,
        hazardFrequency: knobs.space_hazard_frequency,
        hyperspaceStability: knobs.hyperspace_stability
      },
      
      // Apply planetary settings
      planets: {
        habitableFrequency: knobs.habitable_planet_frequency,
        resourceAbundance: knobs.planetary_resource_abundance,
        atmosphericDiversity: knobs.atmospheric_diversity,
        terraformingPotential: knobs.terraforming_potential
      },
      
      // Apply political settings
      politics: {
        boundaryClarity: knobs.territorial_boundary_clarity,
        neutralZoneStability: knobs.neutral_zone_stability,
        disputeFrequency: knobs.border_dispute_frequency,
        diplomaticComplexity: knobs.diplomatic_complexity
      },
      
      // Apply infrastructure settings
      infrastructure: {
        stationDevelopment: knobs.space_station_development,
        tradeRoutes: knobs.trade_route_establishment,
        communicationCoverage: knobs.communication_network_coverage,
        industrialExpansion: knobs.industrial_space_expansion
      },
      
      // Apply research settings
      research: {
        astrophysicsDepth: knobs.astrophysics_research_depth,
        quantumMastery: knobs.quantum_mechanics_mastery,
        energyTech: knobs.energy_technology_advancement,
        propulsionInnovation: knobs.propulsion_system_innovation
      },
      
      // Apply environmental settings
      environment: {
        cosmicEventFrequency: knobs.cosmic_event_frequency,
        stellarEvolution: knobs.stellar_evolution_simulation,
        weatherPatterns: knobs.galactic_weather_patterns,
        darkMatterInfluence: knobs.dark_matter_influence
      },
      
      // Apply interaction settings
      interaction: {
        firstContactProtocols: knobs.first_contact_protocols,
        culturalExchange: knobs.cultural_exchange_rate,
        technologySharing: knobs.technology_sharing_openness,
        councilInfluence: knobs.galactic_council_influence
      },
      
      // Apply economic settings
      economy: {
        tradeVolume: knobs.interstellar_trade_volume,
        resourceScarcity: knobs.resource_scarcity_pressure,
        miningEfficiency: knobs.mining_operation_efficiency,
        interdependence: knobs.economic_interdependence
      },
      
      // Apply military settings
      military: {
        defenseReadiness: knobs.space_defense_readiness,
        fleetStrategy: knobs.fleet_deployment_strategy,
        weaponsTech: knobs.weapons_technology_advancement,
        peacekeeping: knobs.peacekeeping_effectiveness
      }
    }
  };
  
  return galaxyState;
}
