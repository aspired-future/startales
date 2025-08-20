# War Simulator Design - Startales Civilization Management

## Overview

The War Simulator is a comprehensive military combat system that determines the outcomes of battles and wars across the galaxy. It integrates with the Interactive Galaxy Map and civilization management systems to provide realistic, strategic military gameplay with time-based movement, diverse unit types, and complex battle resolution mechanics.

## Core Design Principles

### 1. **Time-Based Operations**
- Military unit movement takes realistic time based on distance and unit speed
- Battles and wars unfold over multiple simulation ticks (120-second intervals)
- Strategic planning requires anticipating enemy movements and timing
- Logistics and supply lines affect sustained operations

### 2. **Composition Over Numbers**
- Force composition is more important than raw unit count
- Rock-paper-scissors mechanics with complex unit interactions
- Combined arms tactics provide significant advantages
- Specialized units excel in specific scenarios

### 3. **Multi-Domain Warfare**
- Land, sea, air, space, and cyberspace operations
- Each domain has unique mechanics and unit types
- Cross-domain support and interference capabilities
- Integrated operations provide tactical advantages

### 4. **Technology & Experience Scaling**
- Unit effectiveness scales with technology level and experience
- Veteran units significantly outperform raw recruits
- Advanced technology can overcome numerical disadvantages
- Psychic powers add supernatural combat capabilities

## Unit Classification System

### Base Unit Categories

#### **Land Forces**
```typescript
interface LandUnit {
  // Infantry
  infantry: {
    lightInfantry: UnitStats;      // Fast, versatile, weak armor
    heavyInfantry: UnitStats;      // Slow, strong, heavy armor
    specialForces: UnitStats;      // Elite, stealth, high tech
    marines: UnitStats;            // Amphibious assault specialists
    psychicWarriors: UnitStats;    // Supernatural combat abilities
  };
  
  // Vehicles
  vehicles: {
    lightVehicles: UnitStats;      // Scouts, fast attack
    mainBattleTanks: UnitStats;    // Heavy armor, main guns
    artillery: UnitStats;          // Long-range fire support
    antiAir: UnitStats;            // Air defense systems
    engineers: UnitStats;          // Construction, repair, obstacles
  };
  
  // Support
  support: {
    logistics: UnitStats;          // Supply, fuel, ammunition
    medical: UnitStats;            // Casualty treatment, recovery
    command: UnitStats;            // Coordination, communications
    intelligence: UnitStats;       // Reconnaissance, surveillance
  };
}
```

#### **Naval Forces**
```typescript
interface NavalUnit {
  // Surface Ships
  surface: {
    destroyers: UnitStats;         // Fast, anti-submarine, escort
    cruisers: UnitStats;           // Balanced, multi-role
    battleships: UnitStats;        // Heavy guns, thick armor
    carriers: UnitStats;           // Air operations platform
    amphibiousAssault: UnitStats;  // Marine deployment
  };
  
  // Submarines
  submarines: {
    attackSubs: UnitStats;         // Anti-ship, stealth
    ballisticSubs: UnitStats;      // Strategic weapons platform
    specialOps: UnitStats;         // Covert operations
  };
  
  // Support
  support: {
    supplyShips: UnitStats;        // Logistics, refueling
    repairShips: UnitStats;        // Maintenance, recovery
    mineWarfare: UnitStats;        // Mine laying/sweeping
  };
}
```

#### **Air Forces**
```typescript
interface AirUnit {
  // Combat Aircraft
  fighters: {
    interceptors: UnitStats;       // Air superiority, fast
    multirole: UnitStats;          // Versatile, balanced
    attackAircraft: UnitStats;     // Ground attack specialists
    bombers: UnitStats;            // Strategic/tactical bombing
  };
  
  // Support Aircraft
  support: {
    transport: UnitStats;          // Troop/cargo movement
    tankers: UnitStats;            // Aerial refueling
    awacs: UnitStats;              // Airborne command/control
    reconnaissance: UnitStats;     // Intelligence gathering
  };
  
  // Rotorcraft
  rotorcraft: {
    attackHelicopters: UnitStats;  // Close air support
    transportHelicopters: UnitStats; // Troop movement
    utilityHelicopters: UnitStats; // Multi-purpose operations
  };
}
```

#### **Space Forces**
```typescript
interface SpaceUnit {
  // Combat Vessels
  combat: {
    fighters: UnitStats;           // Fast, agile, short-range
    corvettes: UnitStats;          // Small, fast, patrol
    frigates: UnitStats;           // Medium, escort, multi-role
    destroyers: UnitStats;         // Anti-ship, heavy weapons
    cruisers: UnitStats;           // Long-range, independent ops
    battleships: UnitStats;        // Heavy armor, massive guns
    carriers: UnitStats;           // Fighter operations
    dreadnoughts: UnitStats;       // Massive, strategic weapons
  };
  
  // Support Vessels
  support: {
    transports: UnitStats;         // Troop/cargo movement
    supply: UnitStats;             // Logistics, refueling
    repair: UnitStats;             // Maintenance, recovery
    construction: UnitStats;       // Base building, mining
  };
  
  // Specialized
  specialized: {
    stealth: UnitStats;            // Cloaked operations
    psychicShips: UnitStats;       // Supernatural capabilities
    planetKillers: UnitStats;      // Superweapons
  };
}
```

#### **Cyber Forces**
```typescript
interface CyberUnit {
  // Offensive Cyber
  offensive: {
    hackers: UnitStats;            // System infiltration
    virusDeployers: UnitStats;     // Malware operations
    dataThieves: UnitStats;        // Intelligence extraction
    systemDisruptors: UnitStats;   // Infrastructure attacks
  };
  
  // Defensive Cyber
  defensive: {
    firewalls: UnitStats;          // Perimeter defense
    antiVirus: UnitStats;          // Malware detection/removal
    securityAnalysts: UnitStats;   // Threat monitoring
    incidentResponse: UnitStats;   // Breach containment
  };
  
  // AI Systems
  ai: {
    autonomousDefense: UnitStats;  // Self-defending systems
    predictiveAnalysis: UnitStats; // Threat prediction
    adaptiveCounters: UnitStats;   // Dynamic response
  };
}
```

## Unit Statistics & Ratings

### Core Unit Stats
```typescript
interface UnitStats {
  // Basic Properties
  id: string;
  name: string;
  type: UnitType;
  domain: CombatDomain;
  
  // Combat Ratings (1-100 scale)
  attack: number;              // Offensive capability
  defense: number;             // Defensive capability
  mobility: number;            // Movement speed/agility
  range: number;               // Engagement distance
  accuracy: number;            // Hit probability
  
  // Advanced Ratings
  technology: number;          // Tech level (1-100)
  experience: number;          // Veteran status (1-100)
  morale: number;              // Fighting spirit (1-100)
  logistics: number;           // Supply requirements
  
  // Special Capabilities
  psychicPower: number;        // Supernatural abilities (0-100)
  stealthRating: number;       // Concealment ability (0-100)
  electronicWarfare: number;  // EW capabilities (0-100)
  
  // Operational Stats
  health: number;              // Current condition (0-100)
  maxHealth: number;           // Maximum health
  supply: number;              // Current supply level (0-100)
  fuel: number;                // Current fuel level (0-100)
  ammunition: number;          // Current ammo level (0-100)
  
  // Unit Composition
  personnel: number;           // Number of soldiers/crew
  equipment: EquipmentList;    // Weapons, vehicles, systems
  
  // Positioning
  location: GalacticCoordinates;
  deployment: DeploymentStatus;
  
  // Effectiveness Modifiers
  terrainBonus: TerrainModifier[];
  weatherEffects: WeatherModifier[];
  supportBonuses: SupportModifier[];
}
```

### Unit Effectiveness Matrix
```typescript
interface EffectivenessMatrix {
  // Rock-Paper-Scissors relationships
  strongAgainst: UnitType[];     // Units this type excels against
  weakAgainst: UnitType[];       // Units this type struggles against
  neutralAgainst: UnitType[];    // Balanced matchups
  
  // Terrain preferences
  preferredTerrain: TerrainType[];
  avoidedTerrain: TerrainType[];
  
  // Support synergies
  synergizesWith: UnitType[];    // Units that enhance this type
  supportsTypes: UnitType[];     // Units this type enhances
}
```

## Battle Resolution System

### Battle Phases

#### **1. Pre-Battle Phase**
```typescript
interface PreBattlePhase {
  // Intelligence Gathering
  reconnaissance: {
    enemyForceDetection: number;    // How much enemy force is known
    terrainAnalysis: TerrainData;   // Battlefield conditions
    weatherForecast: WeatherData;   // Environmental factors
  };
  
  // Force Positioning
  deployment: {
    formationSelection: Formation;   // Battle formation choice
    terrainAdvantage: number;       // Positioning bonus
    surpriseElement: number;        // Ambush/surprise factor
  };
  
  // Logistics Preparation
  supply: {
    ammunitionLevel: number;        // Available firepower
    fuelLevel: number;              // Mobility capacity
    medicalSupport: number;         // Casualty treatment
  };
}
```

#### **2. Opening Engagement**
```typescript
interface OpeningEngagement {
  // Initiative Determination
  initiative: {
    commandRating: number;          // Leadership quality
    communicationEfficiency: number; // Coordination ability
    unitReadiness: number;          // Preparation level
  };
  
  // First Strike
  firstStrike: {
    longRangeFirepower: number;     // Artillery, missiles
    airSuperiority: number;         // Air dominance
    electronicWarfare: number;      // EW effectiveness
  };
  
  // Psychological Impact
  morale: {
    initialMoraleState: number;     // Starting morale
    firstCasualtyImpact: number;    // Morale loss from casualties
    leadershipInfluence: number;    // Command morale bonus
  };
}
```

#### **3. Main Battle Phase**
```typescript
interface MainBattlePhase {
  // Combat Resolution Rounds
  rounds: BattleRound[];
  
  // Dynamic Factors
  adaptation: {
    tacticAdjustments: TacticChange[];
    reinforcements: ReinforcementWave[];
    casualtyReplacement: number;
  };
  
  // Environmental Changes
  conditions: {
    weatherShifts: WeatherChange[];
    terrainModification: TerrainChange[];
    timeOfDayEffects: TimeModifier[];
  };
}

interface BattleRound {
  roundNumber: number;
  duration: number; // In simulation ticks
  
  // Combat Calculations
  attackResults: AttackResult[];
  defenseResults: DefenseResult[];
  casualtyReports: CasualtyReport[];
  
  // Unit Status Updates
  unitConditions: UnitCondition[];
  moraleChanges: MoraleChange[];
  supplyConsumption: SupplyUsage[];
}
```

#### **4. Resolution Phase**
```typescript
interface ResolutionPhase {
  // Battle Outcome
  victor: CivilizationId;
  outcome: BattleOutcome; // Decisive, Marginal, Pyrrhic, Stalemate
  
  // Casualties & Losses
  casualties: {
    military: MilitaryCasualties;
    civilian: CivilianCasualties;
    infrastructure: InfrastructureDamage;
  };
  
  // Territory Changes
  territorialChanges: {
    capturedTerritory: Territory[];
    lostTerritory: Territory[];
    contestedZones: Territory[];
  };
  
  // Experience & Morale
  veteranStatus: {
    survivingUnits: ExperienceGain[];
    moraleAdjustments: MoraleChange[];
    reputationEffects: ReputationChange[];
  };
}
```

## Military Infrastructure

### Base Types & Capabilities

#### **Planetary Bases**
```typescript
interface PlanetaryBase {
  // Base Classification
  type: BaseType; // Fortress, Airbase, Naval, Spaceport, Command
  size: BaseSize; // Outpost, Base, Major Base, Fortress
  
  // Defensive Capabilities
  defenses: {
    shields: ShieldSystem[];        // Energy barriers
    pointDefense: PointDefenseSystem[]; // Anti-missile/fighter
    heavyWeapons: HeavyWeapon[];    // Orbital bombardment defense
    bunkers: BunkerSystem[];        // Hardened positions
  };
  
  // Operational Facilities
  facilities: {
    barracks: number;               // Personnel capacity
    hangars: number;                // Aircraft/spacecraft capacity
    repairBays: number;             // Maintenance capability
    supplyDepots: number;           // Logistics capacity
    commandCenters: number;         // C3I capability
  };
  
  // Production Capabilities
  production: {
    unitProduction: UnitProductionLine[];
    equipmentManufacturing: EquipmentLine[];
    researchFacilities: ResearchLab[];
    trainingCenters: TrainingFacility[];
  };
  
  // Garrison
  garrison: {
    assignedUnits: MilitaryUnit[];
    commandStructure: CommandHierarchy;
    readinessLevel: ReadinessStatus;
  };
}
```

#### **Orbital Installations**
```typescript
interface OrbitalInstallation {
  // Installation Type
  type: OrbitalType; // Defense Platform, Shipyard, Supply Depot, Command Station
  
  // Orbital Mechanics
  orbit: {
    altitude: number;               // Distance from planet
    inclination: number;            // Orbital plane angle
    period: number;                 // Orbital period
    position: OrbitalPosition;      // Current location
  };
  
  // Combat Systems
  weapons: {
    spaceWeapons: SpaceWeapon[];    // Ship-to-ship combat
    planetaryBombardment: BombardmentWeapon[]; // Surface attack
    pointDefense: DefenseSystem[];  // Anti-missile/fighter
  };
  
  // Support Systems
  support: {
    dockingBays: number;            // Ship capacity
    repairFacilities: number;       // Maintenance capability
    fuelDepots: number;             // Refueling capacity
    supplyStorage: number;          // Logistics capacity
  };
}
```

### Fleet Organization

#### **Fleet Composition**
```typescript
interface Fleet {
  // Fleet Identity
  id: string;
  name: string;
  designation: string;
  homeBase: BaseId;
  
  // Command Structure
  command: {
    admiral: CommanderProfile;
    flagshipId: UnitId;
    commandRating: number;
    experienceLevel: number;
  };
  
  // Fleet Composition
  battleGroups: BattleGroup[];
  supportGroups: SupportGroup[];
  
  // Operational Status
  status: {
    readiness: ReadinessLevel;
    supply: SupplyStatus;
    morale: MoraleLevel;
    location: GalacticCoordinates;
    mission: MissionType;
  };
  
  // Fleet Capabilities
  capabilities: {
    combatPower: number;            // Overall fighting strength
    mobility: number;               // Movement speed
    range: number;                  // Operational range
    logistics: number;              // Self-sufficiency
    specialOperations: SpecialOp[]; // Unique capabilities
  };
}

interface BattleGroup {
  type: BattleGroupType; // Assault, Defense, Reconnaissance, Strike
  ships: SpaceUnit[];
  formation: FleetFormation;
  role: TacticalRole;
}
```

## Combat Mechanics

### Battle Calculation Engine

#### **Combat Resolution Formula**
```typescript
interface CombatCalculation {
  // Base Combat Power
  attackerPower = calculateBasePower(attackingUnits);
  defenderPower = calculateBasePower(defendingUnits);
  
  // Technology Modifiers
  techAdvantage = calculateTechAdvantage(attacker.tech, defender.tech);
  
  // Experience Modifiers
  experienceBonus = calculateExperienceBonus(units);
  
  // Composition Bonuses
  compositionBonus = calculateCompositionBonus(unitMix);
  
  // Terrain & Environmental
  terrainModifier = calculateTerrainEffects(battlefield);
  weatherModifier = calculateWeatherEffects(conditions);
  
  // Morale & Leadership
  moraleModifier = calculateMoraleEffects(units);
  leadershipBonus = calculateLeadershipBonus(commanders);
  
  // Psychic & Special Powers
  psychicModifier = calculatePsychicEffects(psychicUnits);
  specialAbilities = calculateSpecialAbilities(units);
  
  // Final Combat Strength
  finalAttackerStrength = attackerPower * 
    (1 + techAdvantage + experienceBonus + compositionBonus + 
     terrainModifier + weatherModifier + moraleModifier + 
     leadershipBonus + psychicModifier + specialAbilities);
     
  finalDefenderStrength = defenderPower * 
    (defensive bonuses and modifiers);
}
```

#### **Casualty Calculation**
```typescript
interface CasualtyCalculation {
  // Base Casualty Rate
  baseCasualties = calculateBaseCasualties(combatRatio);
  
  // Unit Type Modifiers
  unitTypeModifiers = calculateUnitTypeEffects(unitTypes);
  
  // Technology Protection
  techProtection = calculateTechProtection(defensiveTech);
  
  // Medical & Recovery
  medicalSupport = calculateMedicalEffects(medicalUnits);
  
  // Morale Effects on Casualties
  moraleProtection = calculateMoraleProtection(unitMorale);
  
  // Final Casualties
  militaryCasualties = baseCasualties * unitTypeModifiers * 
    (1 - techProtection) * (1 - medicalSupport) * 
    (1 - moraleProtection);
    
  civilianCasualties = calculateCivilianCasualties(
    battleLocation, weaponTypes, collateralDamage
  );
  
  infrastructureDamage = calculateInfrastructureDamage(
    battleIntensity, weaponTypes, targetedDestruction
  );
}
```

### Damage & Destruction Systems

#### **Infrastructure Damage**
```typescript
interface InfrastructureDamage {
  // Civilian Infrastructure
  civilian: {
    residentialDestruction: number;  // Housing damage %
    commercialDestruction: number;   // Business damage %
    industrialDestruction: number;   // Factory damage %
    transportDestruction: number;    // Road/rail damage %
    utilityDestruction: number;      // Power/water damage %
  };
  
  // Military Infrastructure
  military: {
    baseDestruction: number;         // Military base damage %
    fortificationDestruction: number; // Defense damage %
    equipmentLoss: number;           // Equipment destroyed %
    facilityDestruction: number;     // Facility damage %
  };
  
  // Strategic Infrastructure
  strategic: {
    spaceportDestruction: number;    // Space facility damage %
    communicationDestruction: number; // Comms damage %
    governmentDestruction: number;   // Gov building damage %
    researchDestruction: number;     // R&D facility damage %
  };
  
  // Recovery Requirements
  recovery: {
    repairTime: number;              // Time to rebuild (ticks)
    repairCost: number;              // Resources required
    specialistRequirements: number;  // Expert personnel needed
    priorityLevel: RepairPriority;   // Reconstruction priority
  };
}
```

#### **Unit Loss & Damage**
```typescript
interface UnitDamage {
  // Personnel Losses
  personnel: {
    killed: number;                  // Permanent losses
    wounded: number;                 // Recoverable casualties
    missing: number;                 // Unknown status
    captured: number;                // Prisoners of war
  };
  
  // Equipment Losses
  equipment: {
    destroyed: EquipmentLoss[];      // Irreparable equipment
    damaged: EquipmentDamage[];      // Repairable equipment
    captured: EquipmentCapture[];    // Enemy-seized equipment
    abandoned: EquipmentAbandon[];   // Left behind equipment
  };
  
  // Unit Effectiveness
  effectiveness: {
    combatEffectiveness: number;     // Reduced capability %
    moraleImpact: number;            // Morale reduction
    experienceLoss: number;          // Veteran status loss
    reorganizationTime: number;      // Recovery time needed
  };
}
```

## Movement & Logistics

### Unit Movement System

#### **Movement Mechanics**
```typescript
interface MovementSystem {
  // Movement Planning
  planning: {
    routeCalculation: RouteCalculator;
    timeEstimation: TimeEstimator;
    logisticsPlanning: LogisticsPlanner;
    riskAssessment: RiskAnalyzer;
  };
  
  // Movement Execution
  execution: {
    movementOrders: MovementOrder[];
    progressTracking: MovementProgress[];
    obstacleHandling: ObstacleResolver;
    emergencyProcedures: EmergencyProtocol[];
  };
  
  // Movement Types
  types: {
    strategic: StrategicMovement;    // Long-distance repositioning
    tactical: TacticalMovement;      // Battlefield maneuvering
    administrative: AdminMovement;   // Routine repositioning
    emergency: EmergencyMovement;    // Crisis response
  };
}

interface MovementOrder {
  unitId: string;
  origin: GalacticCoordinates;
  destination: GalacticCoordinates;
  route: MovementRoute;
  speed: MovementSpeed;
  priority: MovementPriority;
  
  // Timing
  startTime: SimulationTick;
  estimatedArrival: SimulationTick;
  actualArrival?: SimulationTick;
  
  // Logistics
  fuelRequirement: number;
  supplyRequirement: number;
  supportNeeded: SupportType[];
  
  // Security
  escortRequirement: EscortLevel;
  stealthLevel: StealthLevel;
  communicationProtocol: CommProtocol;
}
```

#### **Movement Speed Factors**
```typescript
interface MovementSpeedFactors {
  // Unit Characteristics
  baseSpeed: number;               // Inherent unit speed
  loadFactor: number;              // Equipment/supply weight
  maintenanceState: number;        // Mechanical condition
  
  // Environmental Factors
  terrainDifficulty: number;       // Terrain movement cost
  weatherConditions: number;       // Weather impact
  gravitationalEffects: number;    // Planetary gravity
  
  // Operational Factors
  formationSize: number;           // Group movement penalty
  logisticalSupport: number;       // Supply line efficiency
  commandEfficiency: number;       // Leadership coordination
  
  // Threat Environment
  enemyPresence: number;           // Threat level impact
  stealthRequirement: number;      // Concealment speed penalty
  electronicWarfare: number;       // EW interference
}
```

### Supply & Logistics

#### **Supply Chain Management**
```typescript
interface SupplyChain {
  // Supply Sources
  sources: {
    productionFacilities: ProductionFacility[];
    stockpiles: Stockpile[];
    alliedSuppliers: AlliedSupplier[];
    capturedSupplies: CapturedSupply[];
  };
  
  // Distribution Network
  distribution: {
    supplyDepots: SupplyDepot[];
    transportUnits: TransportUnit[];
    supplyRoutes: SupplyRoute[];
    distributionHubs: DistributionHub[];
  };
  
  // Supply Types
  supplies: {
    ammunition: AmmunitionSupply;
    fuel: FuelSupply;
    food: FoodSupply;
    medicalSupplies: MedicalSupply;
    spareParts: SparePartsSupply;
    specialEquipment: SpecialEquipment;
  };
  
  // Supply Metrics
  metrics: {
    supplyEfficiency: number;        // Delivery effectiveness
    wasteRate: number;               // Supply loss percentage
    deliveryTime: number;            // Average delivery time
    stockLevels: StockLevel[];       // Current inventory
  };
}
```

## Command & Control

### Command Structure

#### **Military Hierarchy**
```typescript
interface MilitaryHierarchy {
  // Command Levels
  strategicCommand: {
    supremeCommander: CommanderProfile;
    generalStaff: StaffOfficer[];
    strategicPlanning: PlanningDivision;
    intelligence: IntelligenceDivision;
  };
  
  operationalCommand: {
    theaterCommanders: TheaterCommander[];
    operationalStaff: OperationalStaff[];
    logisticsCommand: LogisticsCommand;
    communicationsCommand: CommunicationsCommand;
  };
  
  tacticalCommand: {
    fieldCommanders: FieldCommander[];
    unitCommanders: UnitCommander[];
    specialistOfficers: SpecialistOfficer[];
  };
  
  // Command Effectiveness
  effectiveness: {
    commandRating: number;           // Overall command quality
    communicationEfficiency: number; // Information flow
    decisionSpeed: number;           // Response time
    coordinationLevel: number;       // Multi-unit cooperation
  };
}
```

#### **Commander Profiles**
```typescript
interface CommanderProfile {
  // Personal Information
  id: string;
  name: string;
  rank: MilitaryRank;
  species: SpeciesType;
  
  // Experience & Skills
  experience: {
    totalYears: number;
    combatExperience: number;
    commandExperience: number;
    specializations: Specialization[];
  };
  
  // Abilities
  abilities: {
    tactical: number;                // Battlefield tactics (1-100)
    strategic: number;               // Long-term planning (1-100)
    logistics: number;               // Supply management (1-100)
    leadership: number;              // Morale/inspiration (1-100)
    intelligence: number;            // Analysis/assessment (1-100)
    innovation: number;              // Adaptive thinking (1-100)
  };
  
  // Special Traits
  traits: {
    psychicAbilities: PsychicPower[];
    technologicalAptitude: TechAptitude[];
    culturalBackground: CulturalTrait[];
    personalityTraits: PersonalityTrait[];
  };
  
  // Command History
  history: {
    previousCommands: CommandAssignment[];
    battleHistory: BattleRecord[];
    achievements: Achievement[];
    failures: Failure[];
  };
}
```

## Technology Integration

### Military Technology Trees

#### **Conventional Weapons**
```typescript
interface ConventionalWeapons {
  // Kinetic Weapons
  kinetic: {
    projectileWeapons: TechNode[];   // Bullets, shells, railguns
    missileWeapons: TechNode[];      // Guided munitions
    artilleryWeapons: TechNode[];    // Heavy bombardment
  };
  
  // Energy Weapons
  energy: {
    laserWeapons: TechNode[];        // Directed energy
    plasmaWeapons: TechNode[];       // Superheated matter
    particleBeams: TechNode[];       // Subatomic weapons
  };
  
  // Explosive Weapons
  explosive: {
    conventionalExplosives: TechNode[]; // Chemical explosives
    nuclearWeapons: TechNode[];      // Fission/fusion weapons
    antimatterWeapons: TechNode[];   // Exotic matter weapons
  };
}
```

#### **Defensive Technologies**
```typescript
interface DefensiveTechnologies {
  // Armor Systems
  armor: {
    materialArmor: TechNode[];       // Advanced materials
    reactiveArmor: TechNode[];       // Active protection
    adaptiveArmor: TechNode[];       // Self-repairing systems
  };
  
  // Shield Systems
  shields: {
    energyShields: TechNode[];       // Force field protection
    magneticShields: TechNode[];     // Magnetic deflection
    phaseShields: TechNode[];        // Dimensional protection
  };
  
  // Countermeasures
  countermeasures: {
    electronicCountermeasures: TechNode[]; // EW defense
    stealthTechnology: TechNode[];   // Concealment systems
    decoyTechnology: TechNode[];     // Deception systems
  };
}
```

#### **Psychic Military Applications**
```typescript
interface PsychicMilitary {
  // Combat Psychics
  combat: {
    telekinesis: {
      projectileDeflection: PsychicAbility;
      forceBarriers: PsychicAbility;
      weaponManipulation: PsychicAbility;
    };
    
    telepathy: {
      mindControl: PsychicAbility;
      fearProjection: PsychicAbility;
      communicationJamming: PsychicAbility;
    };
    
    precognition: {
      dangerSense: PsychicAbility;
      tacticPrediction: PsychicAbility;
      ambushDetection: PsychicAbility;
    };
  };
  
  // Support Psychics
  support: {
    healing: {
      acceleratedHealing: PsychicAbility;
      traumaRecovery: PsychicAbility;
      moraleRestoration: PsychicAbility;
    };
    
    enhancement: {
      strengthBoost: PsychicAbility;
      speedBoost: PsychicAbility;
      accuracyBoost: PsychicAbility;
    };
    
    intelligence: {
      remoteViewing: PsychicAbility;
      thoughtReading: PsychicAbility;
      memoryExtraction: PsychicAbility;
    };
  };
}
```

## Alliance & Coalition Warfare

### Joint Military Operations

#### **Alliance Military Integration**
```typescript
interface AllianceMilitary {
  // Alliance Structure
  alliance: {
    allianceId: string;
    memberCivilizations: CivilizationId[];
    militaryPact: MilitaryPact;
    commandStructure: AllianceCommandStructure;
    sharedIntelligence: SharedIntelligence;
  };
  
  // Joint Operations
  jointOperations: {
    combinedFleets: CombinedFleet[];
    jointBases: JointBase[];
    sharedDefenses: SharedDefense[];
    coordinatedAttacks: CoordinatedAttack[];
  };
  
  // Command Integration
  command: {
    supremeAlliedCommander: CommanderProfile;
    nationalCommanders: NationalCommander[];
    liaisonOfficers: LiaisonOfficer[];
    communicationProtocols: CommProtocol[];
  };
  
  // Resource Sharing
  resourceSharing: {
    sharedSupplies: SharedSupply[];
    jointProduction: JointProduction[];
    technologySharing: TechSharing[];
    intelligenceSharing: IntelSharing[];
  };
}
```

#### **Joint Attack Operations**
```typescript
interface JointAttack {
  // Operation Planning
  planning: {
    operationId: string;
    participatingCivs: CivilizationId[];
    targetObjectives: Objective[];
    coordinationPlan: CoordinationPlan;
    timingSchedule: OperationSchedule;
  };
  
  // Force Coordination
  forces: {
    primaryAttacker: CivilizationId;
    supportingForces: SupportingForce[];
    reserveForces: ReserveForce[];
    specialistUnits: SpecialistUnit[];
  };
  
  // Tactical Coordination
  tactics: {
    simultaneousAssaults: SimultaneousAssault[];
    diversionaryAttacks: DiversionaryAttack[];
    supportingFire: SupportingFire[];
    combinedArmsOperations: CombinedArmsOp[];
  };
  
  // Command & Control
  commandControl: {
    jointCommandPost: CommandPost;
    communicationNetworks: CommNetwork[];
    coordinationProtocols: CoordProtocol[];
    contingencyPlans: ContingencyPlan[];
  };
}
```

#### **Joint Defense Systems**
```typescript
interface JointDefense {
  // Defensive Alliances
  defensivePacts: {
    mutualDefenseTreaty: DefenseTreaty;
    automaticResponse: AutoResponse;
    escalationLadder: EscalationLevel[];
    responseTimeCommitments: ResponseTime[];
  };
  
  // Shared Defense Infrastructure
  sharedDefenses: {
    integratedShields: IntegratedShield[];
    jointEarlyWarning: EarlyWarningSystem;
    sharedSensorNetworks: SensorNetwork[];
    coordinatedPointDefense: PointDefenseGrid;
  };
  
  // Rapid Response Forces
  rapidResponse: {
    quickReactionForces: QuickReactionForce[];
    emergencyDeployment: EmergencyDeployment[];
    reinforcementSchedules: ReinforcementSchedule[];
    evacuationProtocols: EvacuationProtocol[];
  };
  
  // Defense Coordination
  coordination: {
    threatAssessment: ThreatAssessment;
    responseCoordination: ResponseCoordination;
    resourceAllocation: ResourceAllocation;
    damageAssessment: DamageAssessment;
  };
}
```

## Sensor Systems & Intelligence

### Sensor Technology Framework

#### **Sensor Classifications**
```typescript
interface SensorSystems {
  // Passive Sensors
  passive: {
    opticalSensors: OpticalSensor[];      // Visual/infrared detection
    radioSensors: RadioSensor[];          // Communications intercept
    gravitationalSensors: GravSensor[];   // Mass detection
    thermalSensors: ThermalSensor[];      // Heat signature detection
  };
  
  // Active Sensors
  active: {
    radarSensors: RadarSensor[];          // Radio detection and ranging
    lidarSensors: LidarSensor[];          // Light detection and ranging
    sonarSensors: SonarSensor[];          // Sound navigation and ranging
    quantumSensors: QuantumSensor[];      // Quantum field detection
  };
  
  // Exotic Sensors
  exotic: {
    psychicSensors: PsychicSensor[];      // Psychic presence detection
    dimensionalSensors: DimSensor[];      // Interdimensional monitoring
    temporalSensors: TempSensor[];        // Time distortion detection
    subspaceSensors: SubspaceSensor[];    // FTL communication detection
  };
  
  // Specialized Sensors
  specialized: {
    biologicalSensors: BioSensor[];       // Life form detection
    chemicalSensors: ChemSensor[];        // Chemical composition analysis
    energySensors: EnergySensor[];        // Energy signature detection
    weaponSensors: WeaponSensor[];        // Weapon system identification
  };
}
```

#### **Sensor Platform Types**
```typescript
interface SensorPlatforms {
  // Planetary Installations
  planetary: {
    earlyWarningStations: EarlyWarningStation[];
    deepSpaceObservatories: Observatory[];
    atmosphericSensors: AtmoSensor[];
    seismicNetworks: SeismicNetwork[];
    communicationInterceptors: CommInterceptor[];
  };
  
  // Orbital Platforms
  orbital: {
    surveillanceSatellites: SurveillanceSat[];
    earlyWarningSatellites: EarlyWarningSat[];
    communicationsSatellites: CommSat[];
    reconnaissancePlatforms: ReconPlatform[];
  };
  
  // Mobile Platforms
  mobile: {
    reconnaissanceShips: ReconShip[];
    sensorDrones: SensorDrone[];
    stealthProbes: StealthProbe[];
    deepSpaceMonitors: DeepSpaceMonitor[];
  };
  
  // Integrated Systems
  integrated: {
    fleetSensorArrays: FleetSensorArray[];
    baseSensorNetworks: BaseSensorNetwork[];
    planetaryDefenseGrids: DefenseGrid[];
    allianceSensorNets: AllianceSensorNet[];
  };
}
```

### Intelligence Gathering & Analysis

#### **Intelligence Collection**
```typescript
interface IntelligenceCollection {
  // Signal Intelligence (SIGINT)
  sigint: {
    communicationsIntercept: CommIntercept[];
    electronicSignatures: ElectronicSig[];
    dataTrafficAnalysis: DataTrafficAnalysis[];
    encryptionBreaking: EncryptionBreaking[];
  };
  
  // Imagery Intelligence (IMINT)
  imint: {
    opticalReconnaissance: OpticalRecon[];
    thermalImaging: ThermalImaging[];
    radarImaging: RadarImaging[];
    multispectralAnalysis: MultiSpectralAnalysis[];
  };
  
  // Human Intelligence (HUMINT)
  humint: {
    agentNetworks: AgentNetwork[];
    diplomaticIntelligence: DiplomaticIntel[];
    defectorDebriefing: DefectorDebrief[];
    culturalIntelligence: CulturalIntel[];
  };
  
  // Technical Intelligence (TECHINT)
  techint: {
    technologyAssessment: TechAssessment[];
    weaponSystemAnalysis: WeaponAnalysis[];
    industrialCapability: IndustrialCapability[];
    scientificProgress: ScientificProgress[];
  };
}
```

#### **Sensor Range & Detection**
```typescript
interface SensorCapabilities {
  // Detection Ranges
  ranges: {
    shortRange: number;        // Tactical detection (1-10 light-minutes)
    mediumRange: number;       // System-wide detection (1-10 light-hours)
    longRange: number;         // Intersystem detection (1-10 light-years)
    extremeRange: number;      // Deep space detection (10+ light-years)
  };
  
  // Detection Accuracy
  accuracy: {
    positionAccuracy: number;  // Location precision
    velocityAccuracy: number;  // Movement tracking precision
    identificationAccuracy: number; // Unit type identification
    compositionAccuracy: number; // Force composition analysis
  };
  
  // Detection Probability
  probability: {
    baseDetectionChance: number;
    stealthPenalty: number;
    rangePenalty: number;
    environmentalPenalty: number;
    technologyBonus: number;
  };
  
  // Sensor Limitations
  limitations: {
    interferenceEffects: InterferenceEffect[];
    blindSpots: BlindSpot[];
    maintenanceRequirements: MaintenanceReq[];
    powerConsumption: PowerConsumption[];
  };
}
```

### Patrol & Reconnaissance Operations

#### **Patrol Systems**
```typescript
interface PatrolOperations {
  // Patrol Types
  patrolTypes: {
    routinePatrol: RoutinePatrol;      // Regular security sweeps
    combatPatrol: CombatPatrol;        // Armed reconnaissance
    stealthPatrol: StealthPatrol;      // Covert surveillance
    earlyWarningPatrol: EarlyWarningPatrol; // Advance detection
  };
  
  // Patrol Planning
  planning: {
    patrolRoutes: PatrolRoute[];
    patrolSchedules: PatrolSchedule[];
    patrolObjectives: PatrolObjective[];
    contingencyProcedures: ContingencyProcedure[];
  };
  
  // Patrol Execution
  execution: {
    patrolAssignments: PatrolAssignment[];
    routeOptimization: RouteOptimization;
    communicationProtocols: CommProtocol[];
    reportingProcedures: ReportingProcedure[];
  };
  
  // Patrol Effectiveness
  effectiveness: {
    coverageArea: CoverageArea;
    detectionProbability: DetectionProbability;
    responseTime: ResponseTime;
    patrolEfficiency: PatrolEfficiency;
  };
}
```

#### **Reconnaissance Missions**
```typescript
interface ReconnaissanceMissions {
  // Mission Types
  missionTypes: {
    areaReconnaissance: AreaRecon;     // General area survey
    routeReconnaissance: RouteRecon;   // Specific path survey
    targetReconnaissance: TargetRecon; // Specific objective analysis
    forceReconnaissance: ForceRecon;   // Enemy force assessment
  };
  
  // Mission Planning
  planning: {
    missionObjectives: MissionObjective[];
    reconRoutes: ReconRoute[];
    timeWindows: TimeWindow[];
    riskAssessment: RiskAssessment;
  };
  
  // Intelligence Requirements
  requirements: {
    priorityIntelligence: PriorityIntel[];
    secondaryObjectives: SecondaryObjective[];
    informationGaps: InformationGap[];
    collectionPlan: CollectionPlan;
  };
  
  // Mission Execution
  execution: {
    reconTeams: ReconTeam[];
    equipmentLoadout: EquipmentLoadout[];
    communicationPlan: CommunicationPlan;
    extractionPlan: ExtractionPlan;
  };
}
```

### Early Warning Systems

#### **Threat Detection Networks**
```typescript
interface EarlyWarningSystem {
  // Detection Grid
  detectionGrid: {
    sensorStations: SensorStation[];
    coverageZones: CoverageZone[];
    overlappingFields: OverlappingField[];
    blindSpotMitigation: BlindSpotMitigation[];
  };
  
  // Alert Systems
  alertSystems: {
    threatClassification: ThreatClassification;
    alertLevels: AlertLevel[];
    escalationProcedures: EscalationProcedure[];
    responseProtocols: ResponseProtocol[];
  };
  
  // Communication Networks
  communications: {
    instantAlerts: InstantAlert[];
    secureChannels: SecureChannel[];
    redundantSystems: RedundantSystem[];
    emergencyBroadcasts: EmergencyBroadcast[];
  };
  
  // Response Coordination
  responseCoordination: {
    automaticResponses: AutomaticResponse[];
    manualOverrides: ManualOverride[];
    coordinationCenters: CoordinationCenter[];
    decisionSupport: DecisionSupport[];
  };
}
```

### Visibility & Information Sharing

#### **Unit Visibility Rules**
```typescript
interface VisibilityRules {
  // Alliance Visibility
  alliance: {
    alwaysVisible: boolean;        // Alliance units always visible
    realTimeUpdates: boolean;      // Live position updates
    detailedInformation: boolean;  // Full unit statistics
    operationalPlanning: boolean;  // Access to movement plans
  };
  
  // Neutral Civilization Visibility
  neutral: {
    diplomaticVisibility: DiplomaticVisibility;
    tradeRouteVisibility: TradeRouteVisibility;
    publicInformation: PublicInformation;
    limitedIntelligence: LimitedIntelligence;
  };
  
  // Enemy Visibility
  enemy: {
    sensorBasedDetection: SensorDetection;
    intelligenceReports: IntelligenceReport[];
    lastKnownPositions: LastKnownPosition[];
    estimatedCapabilities: EstimatedCapability[];
  };
  
  // Proximity Detection
  proximity: {
    detectionRange: DetectionRange;
    identificationRange: IdentificationRange;
    analysisRange: AnalysisRange;
    trackingDuration: TrackingDuration;
  };
}
```

#### **Information Sharing Protocols**
```typescript
interface InformationSharing {
  // Alliance Intelligence Sharing
  allianceSharing: {
    automaticSharing: AutomaticSharing[];
    requestBasedSharing: RequestBasedSharing[];
    classifiedInformation: ClassifiedInfo[];
    intelligenceFusion: IntelligenceFusion;
  };
  
  // Diplomatic Information Exchange
  diplomaticExchange: {
    formalReports: FormalReport[];
    informalChannels: InformalChannel[];
    culturalExchange: CulturalExchange[];
    scientificCooperation: ScientificCoop[];
  };
  
  // Public Information
  publicInfo: {
    mediaReports: MediaReport[];
    officialStatements: OfficialStatement[];
    tradeInformation: TradeInformation[];
    culturalBroadcasts: CulturalBroadcast[];
  };
  
  // Covert Intelligence
  covertIntel: {
    espionageNetworks: EspionageNetwork[];
    doubleAgents: DoubleAgent[];
    signalInterception: SignalInterception[];
    codeBreaking: CodeBreaking[];
  };
}
```

## Integration with Galaxy Map

### Strategic Movement Interface

#### **Galaxy Map Military Layer**
```typescript
interface MilitaryMapLayer {
  // Unit Visualization
  units: {
    ownUnits: MilitaryUnit[];           // Player's units (always visible)
    allianceUnits: AllianceUnit[];      // Alliance partner units (always visible)
    friendlyUnits: MilitaryUnit[];      // Friendly non-alliance units
    neutralUnits: MilitaryUnit[];       // Non-aligned forces (proximity-based)
    enemyUnits: MilitaryUnit[];         // Known enemy positions (sensor-based)
    unknownContacts: UnknownContact[];  // Unidentified signatures
    suspectedUnits: SuspectedUnit[];    // Estimated enemy positions
  };
  
  // Alliance Integration
  alliance: {
    allianceMembers: AllianceMember[];
    jointOperations: JointOperation[];
    sharedBases: SharedBase[];
    combinedFleets: CombinedFleet[];
    coordinatedPatrols: CoordinatedPatrol[];
  };
  
  // Sensor Coverage
  sensors: {
    sensorStations: SensorStation[];
    sensorCoverage: SensorCoverageZone[];
    detectionRanges: DetectionRange[];
    blindSpots: BlindSpot[];
    sensorNetworks: SensorNetwork[];
    earlyWarningGrid: EarlyWarningGrid[];
  };
  
  // Intelligence Layers
  intelligence: {
    knownEnemyPositions: KnownPosition[];
    estimatedEnemyStrength: EstimatedStrength[];
    threatAssessments: ThreatAssessment[];
    intelligenceReports: IntelligenceReport[];
    reconnaissanceData: ReconData[];
  };
  
  // Movement Visualization
  movement: {
    activeMovements: MovementOrder[];
    plannedMovements: PlannedMovement[];
    movementRoutes: MovementRoute[];
    patrolRoutes: PatrolRoute[];
    chokePoints: ChokePoint[];
    supplyLines: SupplyLine[];
  };
  
  // Combat Zones
  combat: {
    activeBattles: ActiveBattle[];
    recentBattles: RecentBattle[];
    threatZones: ThreatZone[];
    safeZones: SafeZone[];
    contestedAreas: ContestedArea[];
    noFlyZones: NoFlyZone[];
  };
  
  // Strategic Features
  strategic: {
    militaryBases: MilitaryBase[];
    jointBases: JointBase[];
    supplyDepots: SupplyDepot[];
    defensiveLines: DefensiveLine[];
    strategicResources: StrategicResource[];
    communicationNodes: CommunicationNode[];
  };
}
```

#### **Command Interface Integration**
```typescript
interface CommandInterface {
  // Unit Selection
  selection: {
    selectedUnits: MilitaryUnit[];
    allianceUnits: AllianceUnit[];      // Can view but not directly command
    selectionTools: SelectionTool[];
    groupSelection: GroupSelection[];
    filterOptions: FilterOption[];
    visibilityFilters: VisibilityFilter[];
  };
  
  // Command Issuance
  commands: {
    movementCommands: MovementCommand[];
    combatCommands: CombatCommand[];
    logisticsCommands: LogisticsCommand[];
    specialCommands: SpecialCommand[];
    allianceCoordination: AllianceCoordination[];
    patrolCommands: PatrolCommand[];
    reconnaissanceOrders: ReconOrder[];
  };
  
  // Alliance Coordination
  allianceInterface: {
    jointOperationPlanning: JointOpPlanning;
    allianceChat: AllianceChat;
    resourceRequests: ResourceRequest[];
    coordinationRequests: CoordinationRequest[];
    sharedIntelligence: SharedIntelligence;
  };
  
  // Sensor Management
  sensorInterface: {
    sensorNetworkStatus: SensorNetworkStatus;
    detectionAlerts: DetectionAlert[];
    sensorConfiguration: SensorConfiguration;
    blindSpotAnalysis: BlindSpotAnalysis;
    coverageOptimization: CoverageOptimization;
  };
  
  // Information Display
  information: {
    unitDetails: UnitDetailPanel;
    allianceStatus: AllianceStatus;
    battleReports: BattleReport[];
    intelligenceReports: IntelligenceReport[];
    sensorReports: SensorReport[];
    threatAssessments: ThreatAssessment[];
    logisticsStatus: LogisticsStatus;
  };
  
  // Planning Tools
  planning: {
    routePlanner: RoutePlanner;
    battlePlanner: BattlePlanner;
    logisticsPlanner: LogisticsPlanner;
    scenarioAnalyzer: ScenarioAnalyzer;
    jointOperationPlanner: JointOpPlanner;
    patrolPlanner: PatrolPlanner;
    sensorDeploymentPlanner: SensorDeploymentPlanner;
  };
}
```

## War Outcomes & Consequences

### Victory Conditions

#### **Battle Victory Types**
```typescript
enum BattleOutcome {
  DECISIVE_VICTORY = "decisive_victory",     // Complete enemy defeat
  MARGINAL_VICTORY = "marginal_victory",     // Clear but costly win
  PYRRHIC_VICTORY = "pyrrhic_victory",       // Victory at terrible cost
  STALEMATE = "stalemate",                   // No clear winner
  TACTICAL_WITHDRAWAL = "tactical_withdrawal", // Organized retreat
  DEFEAT = "defeat"                          // Clear loss
}

interface VictoryConditions {
  // Military Objectives
  military: {
    enemyForceDestruction: number;    // % of enemy force eliminated
    territoryControl: number;         // % of battlefield controlled
    strategicObjectives: ObjectiveStatus[]; // Key targets secured
  };
  
  // Political Objectives
  political: {
    governmentCapture: boolean;       // Leadership eliminated/captured
    populationControl: number;        // Civilian area control
    symbolicVictories: SymbolicWin[]; // Morale/propaganda wins
  };
  
  // Economic Objectives
  economic: {
    resourceCapture: ResourceCapture[]; // Strategic materials seized
    infrastructureControl: number;    // Economic assets controlled
    tradeRouteControl: number;        // Commerce disruption
  };
}
```

### War Consequences

#### **Immediate Effects**
```typescript
interface ImmediateWarEffects {
  // Military Consequences
  military: {
    unitLosses: UnitLoss[];
    equipmentDestruction: EquipmentLoss[];
    baseDestruction: BaseDestruction[];
    veteranPromotion: VeteranPromotion[];
  };
  
  // Civilian Impact
  civilian: {
    casualties: CivilianCasualty[];
    refugeeMovement: RefugeeFlow[];
    infrastructureDamage: InfrastructureDamage[];
    economicDisruption: EconomicDisruption[];
  };
  
  // Political Changes
  political: {
    territoryChanges: TerritoryChange[];
    governmentChanges: GovernmentChange[];
    allianceShifts: AllianceShift[];
    diplomaticConsequences: DiplomaticConsequence[];
  };
  
  // Economic Impact
  economic: {
    warCosts: WarCost[];
    resourceLosses: ResourceLoss[];
    tradeDisruption: TradeDisruption[];
    reconstructionNeeds: ReconstructionNeed[];
  };
}
```

#### **Long-Term Effects**
```typescript
interface LongTermWarEffects {
  // Societal Changes
  society: {
    populationTrauma: TraumaEffect[];
    culturalShifts: CulturalChange[];
    technologicalAdvancement: TechAdvancement[];
    socialCohesion: CohesionChange[];
  };
  
  // Military Evolution
  military: {
    doctrineChanges: DoctrineEvolution[];
    technologyDevelopment: MilitaryTech[];
    organizationalReform: OrganizationalChange[];
    veteranIntegration: VeteranIntegration[];
  };
  
  // Political Transformation
  political: {
    governmentReform: GovernmentReform[];
    constitutionalChanges: ConstitutionalChange[];
    leadershipChanges: LeadershipChange[];
    institutionalEvolution: InstitutionalChange[];
  };
  
  // Economic Reconstruction
  economic: {
    reconstructionPrograms: ReconstructionProgram[];
    economicReform: EconomicReform[];
    tradeRelationships: TradeRelationshipChange[];
    resourceReallocation: ResourceReallocation[];
  };
}
```

## Implementation Considerations

### Performance Optimization

#### **Simulation Efficiency**
```typescript
interface SimulationOptimization {
  // Battle Resolution
  battleResolution: {
    abstractedCombat: boolean;        // Simplified calculations for large battles
    detailedCombat: boolean;          // Full simulation for important battles
    hybridResolution: boolean;        // Mixed approach based on significance
  };
  
  // Movement Calculation
  movement: {
    pathfindingOptimization: PathfindingAlgorithm;
    movementBatching: MovementBatch[];
    predictiveCalculation: PredictiveMovement;
  };
  
  // Data Management
  data: {
    unitDataCaching: CacheStrategy;
    battleHistoryCompression: CompressionAlgorithm;
    realTimeUpdates: UpdateStrategy;
  };
}
```

### Integration Points

#### **System Integration**
```typescript
interface SystemIntegration {
  // Civilization Management
  civilization: {
    populationEffects: PopulationIntegration;
    economicEffects: EconomicIntegration;
    politicalEffects: PoliticalIntegration;
    technologicalEffects: TechnologicalIntegration;
  };
  
  // Galaxy Map
  galaxyMap: {
    visualRepresentation: MapVisualization;
    interactiveElements: MapInteraction;
    realTimeUpdates: MapUpdates;
  };
  
  // AI Systems
  ai: {
    strategicAI: StrategicAI;
    tacticalAI: TacticalAI;
    logisticsAI: LogisticsAI;
    diplomaticAI: DiplomaticAI;
  };
  
  // Player Interface
  interface: {
    commandInterface: CommandUI;
    informationDisplay: InformationUI;
    planningTools: PlanningUI;
    reportingSystems: ReportingUI;
  };
}
```

## Conclusion

The War Simulator provides a comprehensive, realistic military combat system that integrates seamlessly with the galaxy map and civilization management systems. It emphasizes strategic thinking, combined arms tactics, and the complex interplay of technology, experience, and leadership in determining battle outcomes.

The system supports everything from small skirmishes to galaxy-spanning wars, with appropriate levels of detail and abstraction to maintain both realism and performance. The integration with psychic powers, advanced technology, and multi-domain warfare creates a rich, engaging military experience that enhances the overall civilization management gameplay.

Key features include:
- Time-based movement and combat resolution
- Complex unit interactions and combined arms tactics
- Comprehensive damage and casualty systems
- Integrated command and control structures
- Technology and psychic power integration
- **Alliance warfare and joint operations**
- **Comprehensive sensor systems and intelligence gathering**
- **Multi-layered visibility and information sharing**
- **Patrol and reconnaissance operations**
- **Early warning and threat detection networks**
- Seamless galaxy map integration
- Realistic logistics and supply systems
- Long-term consequences and societal effects

This design provides the foundation for implementing a sophisticated war simulation system that enhances strategic gameplay while maintaining the futuristic, multi-domain nature of galactic civilization management. The addition of alliance warfare, sensor networks, and intelligence systems creates a rich, interconnected military ecosystem where information, cooperation, and strategic awareness are as important as raw military power.
