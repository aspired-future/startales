// Galaxy Map Game State
// Manages the procedurally generated galaxy data and real-time state

const galaxyMapGameState = {
  // Galaxy configuration
  config: {
    seed: 'startales-demo-2024',
    size: 'medium', // small, medium, large
    shape: 'spiral', // spiral, elliptical, irregular
    stellarDensity: 'normal', // sparse, normal, dense
    habitability: 'standard', // rare, standard, garden
    resourceRichness: 'balanced', // scarce, balanced, abundant
    civilizationCount: 8,
    ancientRuins: 'rare', // none, rare, common
    naturalHazards: 'standard' // safe, standard, dangerous
  },

  // Current view state
  viewState: {
    currentZoomLevel: 1, // 1=Galaxy, 2=Sector, 3=System, 4=Planet, 5=City, 6=District
    cameraPosition: { x: 0, y: 0, z: 1000 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    selectedObjects: [],
    visibleLayers: ['political', 'economic', 'military'],
    layerOpacity: {
      political: 1.0,
      economic: 0.8,
      military: 0.7,
      diplomatic: 0.6,
      resource: 0.5,
      environmental: 0.4
    }
  },

  // Galaxy structure
  galaxy: {
    name: 'Startales Galaxy',
    type: 'spiral',
    age: 13.8, // billion years
    diameter: 100000, // light years
    sectors: [],
    totalSystems: 0,
    totalPlanets: 0,
    totalCivilizations: 0
  },

  // Star systems data
  starSystems: [
    {
      id: 'sol-system',
      name: 'Sol System',
      position: { x: 0, y: 0, z: 0 },
      starType: 'G2V',
      starMass: 1.0,
      starLuminosity: 1.0,
      starTemperature: 5778,
      planets: [
        {
          id: 'earth',
          name: 'Earth',
          type: 'terrestrial',
          habitability: 1.0,
          population: 8500000000,
          owner: 'terran-federation',
          resources: ['water', 'minerals', 'biologicals'],
          cities: ['new-york', 'london', 'tokyo', 'sydney']
        },
        {
          id: 'mars',
          name: 'Mars',
          type: 'terrestrial',
          habitability: 0.3,
          population: 2500000,
          owner: 'terran-federation',
          resources: ['iron', 'silicon', 'water-ice'],
          cities: ['olympia', 'new-berlin']
        }
      ],
      tradeRoutes: ['sol-alpha-centauri', 'sol-vega'],
      militaryPresence: {
        fleets: 3,
        bases: 2,
        defenseRating: 8.5
      }
    },
    {
      id: 'alpha-centauri',
      name: 'Alpha Centauri',
      position: { x: 4.37, y: 0, z: 0 },
      starType: 'G2V',
      starMass: 1.1,
      starLuminosity: 1.5,
      starTemperature: 5790,
      planets: [
        {
          id: 'proxima-b',
          name: 'Proxima Centauri b',
          type: 'terrestrial',
          habitability: 0.8,
          population: 150000000,
          owner: 'centauri-republic',
          resources: ['rare-metals', 'crystals', 'energy'],
          cities: ['new-geneva', 'port-alpha']
        }
      ],
      tradeRoutes: ['sol-alpha-centauri', 'alpha-centauri-vega'],
      militaryPresence: {
        fleets: 2,
        bases: 1,
        defenseRating: 7.2
      }
    },
    {
      id: 'vega-system',
      name: 'Vega System',
      position: { x: 25, y: 7, z: 0 },
      starType: 'A0V',
      starMass: 2.1,
      starLuminosity: 40,
      starTemperature: 9602,
      planets: [
        {
          id: 'vega-prime',
          name: 'Vega Prime',
          type: 'gas-giant',
          habitability: 0.0,
          population: 0,
          owner: 'neutral',
          resources: ['hydrogen', 'helium', 'exotic-matter'],
          cities: [],
          moons: [
            {
              id: 'vega-station',
              name: 'Vega Station',
              type: 'space-station',
              population: 50000,
              owner: 'trade-consortium'
            }
          ]
        }
      ],
      tradeRoutes: ['sol-vega', 'alpha-centauri-vega'],
      militaryPresence: {
        fleets: 1,
        bases: 0,
        defenseRating: 3.1
      }
    },
    {
      id: 'kepler-442',
      name: 'Kepler-442',
      position: { x: -15, y: 12, z: 3 },
      starType: 'K2V',
      starMass: 0.61,
      starLuminosity: 0.4,
      starTemperature: 4402,
      planets: [
        {
          id: 'kepler-442b',
          name: 'Kepler-442b',
          type: 'super-earth',
          habitability: 0.9,
          population: 890000000,
          owner: 'vegan-confederation',
          resources: ['biologicals', 'rare-earth', 'quantum-crystals'],
          cities: ['harmony', 'green-valley', 'crystal-peak']
        }
      ],
      tradeRoutes: ['kepler-gliese'],
      militaryPresence: {
        fleets: 4,
        bases: 3,
        defenseRating: 9.1
      }
    },
    {
      id: 'gliese-667c',
      name: 'Gliese 667C',
      position: { x: -8, y: -18, z: -2 },
      starType: 'M1.5V',
      starMass: 0.31,
      starLuminosity: 0.014,
      starTemperature: 3700,
      planets: [
        {
          id: 'gliese-667cc',
          name: 'Gliese 667Cc',
          type: 'terrestrial',
          habitability: 0.85,
          population: 340000000,
          owner: 'zephyrian-empire',
          resources: ['heavy-metals', 'radioactives', 'dark-matter'],
          cities: ['obsidian-city', 'shadow-port']
        }
      ],
      tradeRoutes: ['kepler-gliese'],
      militaryPresence: {
        fleets: 5,
        bases: 2,
        defenseRating: 8.8
      }
    }
  ],

  // Civilizations
  civilizations: [
    {
      id: 'terran-federation',
      name: 'Terran Federation',
      color: '#4A90E2',
      homeworld: 'earth',
      government: 'democratic-federation',
      population: 11000000000,
      territory: ['sol-system'],
      diplomaticStatus: {
        'centauri-republic': 'allied',
        'vegan-confederation': 'friendly',
        'zephyrian-empire': 'neutral'
      },
      militaryStrength: 8.5,
      economicPower: 9.2,
      technologyLevel: 8.8
    },
    {
      id: 'centauri-republic',
      name: 'Centauri Republic',
      color: '#E74C3C',
      homeworld: 'proxima-b',
      government: 'republic',
      population: 150000000,
      territory: ['alpha-centauri'],
      diplomaticStatus: {
        'terran-federation': 'allied',
        'vegan-confederation': 'neutral',
        'zephyrian-empire': 'tense'
      },
      militaryStrength: 7.2,
      economicPower: 6.8,
      technologyLevel: 8.1
    },
    {
      id: 'vegan-confederation',
      name: 'Vegan Confederation',
      color: '#2ECC71',
      homeworld: 'kepler-442b',
      government: 'confederation',
      population: 890000000,
      territory: ['kepler-442'],
      diplomaticStatus: {
        'terran-federation': 'friendly',
        'centauri-republic': 'neutral',
        'zephyrian-empire': 'hostile'
      },
      militaryStrength: 9.1,
      economicPower: 7.5,
      technologyLevel: 9.3
    },
    {
      id: 'zephyrian-empire',
      name: 'Zephyrian Empire',
      color: '#9B59B6',
      homeworld: 'gliese-667cc',
      government: 'empire',
      population: 340000000,
      territory: ['gliese-667c'],
      diplomaticStatus: {
        'terran-federation': 'neutral',
        'centauri-republic': 'tense',
        'vegan-confederation': 'hostile'
      },
      militaryStrength: 8.8,
      economicPower: 6.2,
      technologyLevel: 8.9
    }
  ],

  // Trade routes
  tradeRoutes: [
    {
      id: 'sol-alpha-centauri',
      name: 'Sol-Centauri Trade Corridor',
      from: 'sol-system',
      to: 'alpha-centauri',
      volume: 850000,
      value: 2400000000,
      goods: ['manufactured-goods', 'technology', 'biologicals'],
      security: 'high',
      travelTime: 4.2 // years
    },
    {
      id: 'sol-vega',
      name: 'Sol-Vega Express',
      from: 'sol-system',
      to: 'vega-system',
      volume: 120000,
      value: 890000000,
      goods: ['luxury-goods', 'rare-materials'],
      security: 'medium',
      travelTime: 25.1
    },
    {
      id: 'alpha-centauri-vega',
      name: 'Centauri-Vega Link',
      from: 'alpha-centauri',
      to: 'vega-system',
      volume: 95000,
      value: 650000000,
      goods: ['energy-crystals', 'exotic-matter'],
      security: 'medium',
      travelTime: 21.8
    },
    {
      id: 'kepler-gliese',
      name: 'Outer Rim Circuit',
      from: 'kepler-442',
      to: 'gliese-667c',
      volume: 45000,
      value: 320000000,
      goods: ['biologicals', 'heavy-metals'],
      security: 'low',
      travelTime: 12.3
    }
  ],

  // Military fleets
  fleets: [
    {
      id: 'terran-1st-fleet',
      name: '1st Terran Fleet',
      owner: 'terran-federation',
      position: { x: 0, y: 0, z: 0 },
      currentSystem: 'sol-system',
      ships: 45,
      strength: 8.2,
      status: 'patrol',
      mission: 'System Defense'
    },
    {
      id: 'centauri-defense',
      name: 'Centauri Defense Force',
      owner: 'centauri-republic',
      position: { x: 4.37, y: 0, z: 0 },
      currentSystem: 'alpha-centauri',
      ships: 28,
      strength: 6.8,
      status: 'stationed',
      mission: 'Home Defense'
    },
    {
      id: 'vegan-expeditionary',
      name: 'Vegan Expeditionary Fleet',
      owner: 'vegan-confederation',
      position: { x: -12, y: 8, z: 1 },
      currentSystem: 'transit',
      ships: 52,
      strength: 9.1,
      status: 'moving',
      mission: 'Border Patrol'
    }
  ],

  // Points of interest
  pointsOfInterest: [
    {
      id: 'ancient-gate-1',
      name: 'Precursor Gateway',
      type: 'ancient-ruins',
      position: { x: 18, y: -12, z: 5 },
      discovered: true,
      explored: false,
      significance: 'high',
      description: 'Massive ring structure of unknown origin'
    },
    {
      id: 'nebula-serpentis',
      name: 'Serpentis Nebula',
      type: 'natural-hazard',
      position: { x: -25, y: 15, z: -8 },
      discovered: true,
      explored: true,
      significance: 'medium',
      description: 'Dense nebula affecting sensors and communications'
    },
    {
      id: 'derelict-station',
      name: 'Abandoned Mining Station',
      type: 'derelict',
      position: { x: 8, y: -5, z: 2 },
      discovered: true,
      explored: false,
      significance: 'low',
      description: 'Abandoned automated mining facility'
    },
    {
      id: 'quantum-anomaly-1',
      name: 'Quantum Distortion Field',
      type: 'anomaly',
      position: { x: -12, y: 20, z: -15 },
      discovered: false,
      explored: false,
      significance: 'high',
      description: 'Unexplained quantum phenomena affecting space-time'
    },
    {
      id: 'resource-asteroid-1',
      name: 'Platinum Rich Asteroid Field',
      type: 'resource-rich',
      position: { x: 30, y: -8, z: 12 },
      discovered: true,
      explored: true,
      significance: 'medium',
      description: 'Dense asteroid field with high concentrations of rare metals'
    },
    {
      id: 'ancient-library',
      name: 'Celestial Archive',
      type: 'ancient-ruins',
      position: { x: -5, y: -25, z: 8 },
      discovered: false,
      explored: false,
      significance: 'high',
      description: 'Ancient data repository containing lost knowledge'
    }
  ],

  // Real-time events
  activeEvents: [
    {
      id: 'trade-dispute-1',
      type: 'diplomatic',
      title: 'Trade Dispute: Sol-Centauri Route',
      description: 'Tariff disagreement affecting trade volume',
      startTime: Date.now() - 86400000, // 1 day ago
      duration: 604800000, // 1 week
      affectedSystems: ['sol-system', 'alpha-centauri'],
      impact: 'economic'
    },
    {
      id: 'pirate-activity-1',
      type: 'security',
      title: 'Pirate Raids: Outer Rim',
      description: 'Increased pirate activity near Gliese system',
      startTime: Date.now() - 172800000, // 2 days ago
      duration: 1209600000, // 2 weeks
      affectedSystems: ['gliese-667c'],
      impact: 'military'
    }
  ]
};

// Utility functions for galaxy map operations
const galaxyMapUtils = {
  // Get system by ID
  getSystem(systemId) {
    return galaxyMapGameState.starSystems.find(system => system.id === systemId);
  },

  // Get civilization by ID
  getCivilization(civId) {
    return galaxyMapGameState.civilizations.find(civ => civ.id === civId);
  },

  // Calculate distance between two systems
  calculateDistance(system1Id, system2Id) {
    const sys1 = this.getSystem(system1Id);
    const sys2 = this.getSystem(system2Id);
    if (!sys1 || !sys2) return null;
    
    const dx = sys1.position.x - sys2.position.x;
    const dy = sys1.position.y - sys2.position.y;
    const dz = sys1.position.z - sys2.position.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  // Get systems within range
  getSystemsInRange(centerSystemId, range) {
    const centerSystem = this.getSystem(centerSystemId);
    if (!centerSystem) return [];
    
    return galaxyMapGameState.starSystems.filter(system => {
      if (system.id === centerSystemId) return false;
      const distance = this.calculateDistance(centerSystemId, system.id);
      return distance !== null && distance <= range;
    });
  },

  // Get trade routes for a system
  getTradeRoutesForSystem(systemId) {
    return galaxyMapGameState.tradeRoutes.filter(route => 
      route.from === systemId || route.to === systemId
    );
  },

  // Get fleets in system
  getFleetsInSystem(systemId) {
    return galaxyMapGameState.fleets.filter(fleet => 
      fleet.currentSystem === systemId
    );
  },

  // Update view state
  updateViewState(updates) {
    Object.assign(galaxyMapGameState.viewState, updates);
  },

  // Generate galaxy statistics
  getGalaxyStatistics() {
    const totalPopulation = galaxyMapGameState.civilizations.reduce(
      (sum, civ) => sum + civ.population, 0
    );
    
    const totalSystems = galaxyMapGameState.starSystems.length;
    const totalPlanets = galaxyMapGameState.starSystems.reduce(
      (sum, system) => sum + system.planets.length, 0
    );
    
    const totalTradeValue = galaxyMapGameState.tradeRoutes.reduce(
      (sum, route) => sum + route.value, 0
    );

    return {
      totalPopulation,
      totalSystems,
      totalPlanets,
      totalCivilizations: galaxyMapGameState.civilizations.length,
      totalTradeValue,
      totalFleets: galaxyMapGameState.fleets.length,
      activeEvents: galaxyMapGameState.activeEvents.length
    };
  }
};

module.exports = {
  galaxyMapGameState,
  galaxyMapUtils
};
