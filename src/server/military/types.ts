/**
 * Enhanced War Simulator System Types
 * 
 * Comprehensive military combat system with alliance warfare, sensor networks,
 * intelligence operations, and AI-driven morale mechanics.
 */

// ===== CORE MILITARY UNIT TYPES =====

export interface MilitaryUnit {
  id: string;
  name: string;
  type: UnitType;
  classification: UnitClassification;
  domain: CombatDomain;
  
  // Basic Properties
  size: number; // Number of personnel/vehicles
  maxSize: number;
  
  // Combat Statistics
  combatStats: CombatStats;
  
  // Morale System (AI-Driven)
  morale: MoraleSystem;
  
  // Technology & Equipment
  technology: TechnologyLevel;
  equipment: Equipment[];
  
  // Position & Movement
  location: UnitLocation;
  movement: MovementCapability;
  
  // Command & Control
  command: CommandStructure;
  
  // Experience & Training
  experience: ExperienceLevel;
  training: TrainingLevel;
  
  // Supply & Logistics
  supply: SupplyStatus;
  
  // Special Capabilities
  specialCapabilities: SpecialCapability[];
  
  // Status & Condition
  status: UnitStatus;
  condition: UnitCondition;
  
  // Alliance & Coalition
  allegiance: AllegianceInfo;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastCombat?: Date;
}

export type UnitType = 
  // Ground Forces
  | 'infantry' | 'mechanized-infantry' | 'armor' | 'artillery' | 'air-defense' | 'engineers' | 'special-forces'
  // Naval Forces  
  | 'destroyer' | 'cruiser' | 'battleship' | 'carrier' | 'submarine' | 'patrol-boat' | 'amphibious'
  // Air Forces
  | 'fighter' | 'bomber' | 'transport' | 'helicopter' | 'drone' | 'interceptor' | 'reconnaissance'
  // Space Forces
  | 'space-fighter' | 'space-cruiser' | 'space-carrier' | 'orbital-platform' | 'space-station' | 'deep-space-patrol'
  // Cyber Forces
  | 'cyber-warfare' | 'electronic-warfare' | 'signals-intelligence' | 'cyber-defense'
  // Support Forces
  | 'logistics' | 'medical' | 'command' | 'intelligence' | 'maintenance';

export type UnitClassification = 'light' | 'medium' | 'heavy' | 'super-heavy' | 'elite' | 'militia' | 'reserve' | 'veteran';

export type CombatDomain = 'land' | 'sea' | 'air' | 'space' | 'cyber' | 'multi-domain';

// ===== AI-DRIVEN MORALE SYSTEM =====

export interface MoraleSystem {
  // Current Morale State
  currentMorale: number; // 0-100
  baseMorale: number; // Unit's baseline morale
  
  // Morale Factors (AI-Analyzed)
  factors: MoraleFactors;
  
  // Morale History & Trends
  moraleHistory: MoraleHistoryEntry[];
  trends: MoraleTrends;
  
  // Effects on Combat
  combatEffects: MoraleCombatEffects;
  
  // Recovery & Restoration
  recovery: MoraleRecovery;
  
  // AI Analysis
  aiAnalysis: MoraleAIAnalysis;
}

export interface MoraleFactors {
  // Leadership & Command
  leadership: {
    commanderCompetence: number; // 0-1
    commanderCharisma: number; // 0-1
    commandStructureEfficiency: number; // 0-1
    trustInCommand: number; // 0-1
  };
  
  // Combat Experience
  combat: {
    recentVictories: number;
    recentDefeats: number;
    casualtyRate: number; // 0-1
    combatIntensity: number; // 0-1
    lastBattleOutcome: 'victory' | 'defeat' | 'stalemate' | 'retreat';
  };
  
  // Supply & Logistics
  supply: {
    foodQuality: number; // 0-1
    equipmentCondition: number; // 0-1
    medicalCare: number; // 0-1
    payStatus: number; // 0-1 (on time, delayed, etc.)
    comfortLevel: number; // 0-1
  };
  
  // Social & Psychological
  social: {
    unitCohesion: number; // 0-1
    homeSupport: number; // 0-1 (public support for war)
    causeBeliefStrength: number; // 0-1 (belief in mission)
    culturalFactors: number; // 0-1
    religiousFactors: number; // 0-1
  };
  
  // Environmental
  environment: {
    weatherConditions: number; // 0-1
    terrainFamiliarity: number; // 0-1
    deploymentDuration: number; // months
    restQuality: number; // 0-1
    communicationWithHome: number; // 0-1
  };
  
  // Strategic Situation
  strategic: {
    warProgress: number; // -1 to 1 (losing to winning)
    alliedSupport: number; // 0-1
    enemyStrength: number; // 0-1 (perceived)
    missionClarity: number; // 0-1
    expectedDuration: number; // months
  };
  
  // Technology & Equipment
  technology: {
    equipmentSuperiority: number; // -1 to 1 (inferior to superior)
    trainingAdequacy: number; // 0-1
    technologicalConfidence: number; // 0-1
    maintenanceQuality: number; // 0-1
  };
  
  // Psychological Warfare
  psychological: {
    enemyPropagandaEffect: number; // 0-1 (negative effect)
    ownPropagandaEffect: number; // 0-1 (positive effect)
    informationWarfare: number; // -1 to 1
    psychologicalOperations: number; // -1 to 1
  };
}

export interface MoraleHistoryEntry {
  timestamp: Date;
  morale: number;
  event: MoraleEvent;
  impact: number; // -100 to 100
  description: string;
  factors: Partial<MoraleFactors>;
}

export interface MoraleEvent {
  type: 'combat' | 'supply' | 'leadership' | 'strategic' | 'environmental' | 'social' | 'psychological';
  subtype: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  duration: 'instant' | 'short' | 'medium' | 'long' | 'permanent';
}

export interface MoraleTrends {
  shortTerm: number; // -1 to 1 (declining to improving)
  mediumTerm: number;
  longTerm: number;
  volatility: number; // 0-1 (stable to highly volatile)
  predictedMorale: number; // AI prediction for next period
  confidenceInterval: [number, number]; // prediction confidence
}

export interface MoraleCombatEffects {
  attackBonus: number; // -50 to 50 (percentage modifier)
  defenseBonus: number; // -50 to 50
  accuracyModifier: number; // -50 to 50
  retreatThreshold: number; // 0-100 (morale level at which unit retreats)
  surrenderThreshold: number; // 0-100 (morale level at which unit surrenders)
  berserkThreshold: number; // 90-100 (morale level for berserk attacks)
  coordinationEfficiency: number; // 0-1 (ability to coordinate with other units)
}

export interface MoraleRecovery {
  naturalRecoveryRate: number; // morale points per day
  restRecoveryRate: number; // bonus when resting
  victoryRecoveryBonus: number; // bonus after victories
  leadershipRecoveryBonus: number; // bonus from good leadership
  supplyRecoveryBonus: number; // bonus from good supplies
  medicalRecoveryBonus: number; // bonus from medical care
  
  // Recovery Activities
  availableActivities: MoraleRecoveryActivity[];
  activeActivities: string[]; // IDs of currently active activities
}

export interface MoraleRecoveryActivity {
  id: string;
  name: string;
  description: string;
  moraleBonus: number; // per day
  cost: number; // resource cost
  duration: number; // days
  requirements: string[];
  effects: Record<string, number>;
}

export interface MoraleAIAnalysis {
  // AI-Generated Insights
  primaryMoraleDrivers: string[]; // Top factors affecting morale
  riskFactors: string[]; // Factors that could cause morale collapse
  recommendations: MoraleRecommendation[];
  
  // Predictive Analysis
  moraleProjection: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
    scenarios: MoraleScenario[];
  };
  
  // Comparative Analysis
  comparison: {
    similarUnits: number; // morale compared to similar units
    historicalAverage: number; // compared to historical data
    allianceAverage: number; // compared to alliance units
  };
  
  // Dynamic Factors
  emergingFactors: string[]; // New factors detected by AI
  factorWeights: Record<string, number>; // AI-determined importance weights
  
  // Last Analysis
  lastAnalyzed: Date;
  analysisVersion: string;
}

export interface MoraleRecommendation {
  id: string;
  type: 'immediate' | 'short-term' | 'long-term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  expectedImpact: number; // -100 to 100
  cost: number;
  timeToImplement: number; // days
  requirements: string[];
  risks: string[];
}

export interface MoraleScenario {
  name: string;
  probability: number; // 0-1
  projectedMorale: number;
  keyFactors: string[];
  description: string;
}

// ===== COMBAT STATISTICS =====

export interface CombatStats {
  // Offensive Capabilities
  attack: AttackCapabilities;
  
  // Defensive Capabilities
  defense: DefenseCapabilities;
  
  // Support Capabilities
  support: SupportCapabilities;
  
  // Effectiveness Modifiers
  effectiveness: EffectivenessModifiers;
}

export interface AttackCapabilities {
  // Direct Fire
  directFire: {
    range: number; // kilometers
    accuracy: number; // 0-1
    penetration: number; // armor penetration value
    rateOfFire: number; // rounds per minute
    ammunition: number; // current ammo count
    maxAmmunition: number;
  };
  
  // Indirect Fire
  indirectFire: {
    range: number;
    accuracy: number;
    areaEffect: number; // area of effect radius
    rateOfFire: number;
    ammunition: number;
    maxAmmunition: number;
  };
  
  // Special Weapons
  specialWeapons: SpecialWeapon[];
  
  // Psychic Capabilities (if applicable)
  psychicCapabilities: PsychicCapability[];
}

export interface DefenseCapabilities {
  // Armor & Protection
  armor: {
    frontArmor: number;
    sideArmor: number;
    rearArmor: number;
    topArmor: number;
    shielding: number; // energy shields
  };
  
  // Active Defenses
  activeDefenses: {
    pointDefense: number; // anti-missile/projectile
    electronicCountermeasures: number;
    stealthRating: number;
    camouflageRating: number;
  };
  
  // Passive Defenses
  passiveDefenses: {
    redundancy: number; // system redundancy
    damageControl: number; // repair capability
    survivability: number; // crew survival systems
  };
}

export interface SupportCapabilities {
  // Reconnaissance
  reconnaissance: {
    visualRange: number;
    electronicRange: number;
    stealthDetection: number;
    targetingSupport: number;
  };
  
  // Communication
  communication: {
    range: number;
    encryption: number;
    jamResistance: number;
    networkCapability: number;
  };
  
  // Logistics
  logistics: {
    carryCapacity: number;
    fuelCapacity: number;
    repairCapability: number;
    medicalCapability: number;
  };
}

export interface EffectivenessModifiers {
  // Terrain Effectiveness
  terrain: Record<TerrainType, number>; // 0-2 multiplier
  
  // Weather Effectiveness  
  weather: Record<WeatherType, number>; // 0-2 multiplier
  
  // Time of Day
  timeOfDay: Record<TimeOfDay, number>; // 0-2 multiplier
  
  // Unit Type Effectiveness (rock-paper-scissors)
  vsUnitTypes: Record<UnitType, number>; // 0-3 multiplier
  
  // Technology Era Effectiveness
  vsTechLevels: Record<TechnologyEra, number>; // 0-3 multiplier
}

export type TerrainType = 'plains' | 'forest' | 'mountains' | 'desert' | 'urban' | 'swamp' | 'arctic' | 'space' | 'underwater';
export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'storm' | 'extreme-heat' | 'extreme-cold';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

// ===== SPECIAL CAPABILITIES =====

export interface SpecialWeapon {
  id: string;
  name: string;
  type: 'kinetic' | 'energy' | 'explosive' | 'chemical' | 'biological' | 'nuclear' | 'psychic' | 'exotic';
  damage: number;
  range: number;
  accuracy: number;
  areaEffect: number;
  ammunition: number;
  maxAmmunition: number;
  cooldown: number; // seconds between uses
  specialEffects: WeaponEffect[];
}

export interface WeaponEffect {
  type: 'emp' | 'radiation' | 'fire' | 'poison' | 'stun' | 'fear' | 'confusion' | 'disable' | 'morale-damage';
  strength: number;
  duration: number; // seconds
  areaEffect: number;
}

export interface PsychicCapability {
  id: string;
  name: string;
  type: 'telepathy' | 'telekinesis' | 'precognition' | 'mind-control' | 'fear-projection' | 'battle-meditation';
  strength: number; // 0-100
  range: number;
  energyCost: number;
  cooldown: number;
  effects: PsychicEffect[];
}

export interface PsychicEffect {
  type: 'morale-boost' | 'morale-damage' | 'accuracy-boost' | 'confusion' | 'fear' | 'coordination-boost';
  strength: number;
  duration: number;
  targetType: 'self' | 'friendly' | 'enemy' | 'all';
  areaEffect: number;
}

export interface SpecialCapability {
  id: string;
  name: string;
  type: 'stealth' | 'cloaking' | 'phase-shift' | 'time-dilation' | 'shield-generation' | 'repair-nanites' | 'adaptive-armor';
  effectiveness: number; // 0-1
  energyCost: number;
  duration: number; // -1 for permanent
  cooldown: number;
  description: string;
}

// ===== TECHNOLOGY & EQUIPMENT =====

export interface TechnologyLevel {
  era: TechnologyEra;
  level: number; // 1-100 within era
  
  // Technology Categories
  weapons: number; // 1-100
  armor: number; // 1-100
  sensors: number; // 1-100
  communication: number; // 1-100
  mobility: number; // 1-100
  logistics: number; // 1-100
  
  // Advanced Technologies
  advancedTech: AdvancedTechnology[];
  
  // Upgrade Potential
  upgradePoints: number;
  maxUpgradePoints: number;
}

export type TechnologyEra = 
  | 'primitive'     // Stone age, medieval
  | 'industrial'    // Industrial revolution
  | 'modern'        // 20th century
  | 'advanced'      // Near future
  | 'space-age'     // Interstellar
  | 'transcendent'  // Post-singularity
  | 'godlike';      // Reality manipulation

export interface AdvancedTechnology {
  id: string;
  name: string;
  category: string;
  description: string;
  effects: TechnologyEffect[];
  requirements: string[];
  cost: number;
}

export interface TechnologyEffect {
  type: 'combat-bonus' | 'defense-bonus' | 'mobility-bonus' | 'sensor-bonus' | 'special-ability';
  value: number;
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  condition: number; // 0-1 (broken to perfect)
  effectiveness: number; // 0-1 (how well it works)
  maintenanceRequired: number; // 0-1 (maintenance needed)
  
  // Equipment Stats
  stats: EquipmentStats;
  
  // Technology Integration
  technologyLevel: number;
  upgradeLevel: number;
  maxUpgradeLevel: number;
}

export type EquipmentType = 
  | 'primary-weapon' | 'secondary-weapon' | 'armor' | 'shield' | 'sensor' | 'communication' 
  | 'mobility' | 'support' | 'medical' | 'repair' | 'ammunition' | 'fuel' | 'supplies';

export interface EquipmentStats {
  durability: number;
  reliability: number;
  performance: number;
  efficiency: number;
  
  // Specific stats based on equipment type
  specificStats: Record<string, number>;
}

// ===== POSITION & MOVEMENT =====

export interface UnitLocation {
  // Galactic Coordinates
  galaxy: string;
  system: string;
  planet?: string;
  
  // Local Coordinates
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  
  // Location Details
  terrain: TerrainType;
  elevation: number;
  cover: CoverType;
  concealment: number; // 0-1
  
  // Strategic Information
  strategicValue: number; // 0-1
  defensiveValue: number; // 0-1
  logisticalValue: number; // 0-1
}

export type CoverType = 'none' | 'light' | 'medium' | 'heavy' | 'fortified';

export interface MovementCapability {
  // Movement Stats
  maxSpeed: number; // km/h
  cruiseSpeed: number; // km/h
  acceleration: number; // km/h/s
  maneuverability: number; // 0-1
  
  // Movement Types
  movementTypes: MovementType[];
  
  // Range & Endurance
  range: number; // km without refueling
  endurance: number; // hours of operation
  fuelConsumption: number; // fuel per km
  
  // Current Movement
  currentSpeed: number;
  heading: number; // degrees
  destination?: UnitLocation;
  eta?: Date;
  
  // Movement Restrictions
  restrictions: MovementRestriction[];
}

export type MovementType = 
  | 'ground' | 'amphibious' | 'air' | 'space' | 'teleportation' | 'phase-shift' | 'warp-drive';

export interface MovementRestriction {
  type: 'terrain' | 'weather' | 'damage' | 'fuel' | 'orders' | 'enemy-presence';
  severity: 'minor' | 'moderate' | 'major' | 'complete';
  description: string;
  duration?: number; // minutes, undefined for permanent
}

// ===== COMMAND & CONTROL =====

export interface CommandStructure {
  // Command Hierarchy
  commander: Commander;
  subordinateUnits: string[]; // Unit IDs
  superiorUnit?: string; // Parent unit ID
  
  // Command Effectiveness
  commandEfficiency: number; // 0-1
  communicationQuality: number; // 0-1
  coordinationLevel: number; // 0-1
  
  // Command Capabilities
  commandRange: number; // km
  commandCapacity: number; // max units that can be commanded
  
  // Decision Making
  autonomyLevel: number; // 0-1 (how independently unit can act)
  initiativeRating: number; // 0-1 (likelihood to take initiative)
  
  // Alliance Integration
  allianceIntegration: AllianceIntegration;
}

export interface Commander {
  id: string;
  name: string;
  rank: MilitaryRank;
  
  // Leadership Qualities
  leadership: LeadershipQualities;
  
  // Experience & Skills
  experience: CommanderExperience;
  skills: CommanderSkills;
  
  // Personal Traits
  traits: CommanderTrait[];
  
  // Status
  status: CommanderStatus;
  morale: number; // 0-100
  fatigue: number; // 0-100
  
  // Background
  background: string;
  achievements: Achievement[];
}

export interface LeadershipQualities {
  charisma: number; // 0-100
  competence: number; // 0-100
  courage: number; // 0-100
  decisiveness: number; // 0-100
  inspiration: number; // 0-100
  tactical: number; // 0-100
  strategic: number; // 0-100
  logistics: number; // 0-100
}

export interface CommanderExperience {
  totalBattles: number;
  victories: number;
  defeats: number;
  draws: number;
  
  // Experience by Domain
  domainExperience: Record<CombatDomain, number>;
  
  // Experience by Unit Type
  unitTypeExperience: Record<UnitType, number>;
  
  // Experience by Terrain
  terrainExperience: Record<TerrainType, number>;
  
  // Years of Service
  yearsOfService: number;
  
  // Combat Intensity Experience
  lowIntensity: number;
  mediumIntensity: number;
  highIntensity: number;
}

export interface CommanderSkills {
  // Combat Skills
  tactics: number; // 0-100
  strategy: number; // 0-100
  logistics: number; // 0-100
  intelligence: number; // 0-100
  
  // Leadership Skills
  motivation: number; // 0-100
  discipline: number; // 0-100
  training: number; // 0-100
  
  // Technical Skills
  technology: number; // 0-100
  communication: number; // 0-100
  coordination: number; // 0-100
  
  // Special Skills
  specialSkills: SpecialSkill[];
}

export interface SpecialSkill {
  id: string;
  name: string;
  level: number; // 0-100
  description: string;
  effects: SkillEffect[];
}

export interface SkillEffect {
  type: 'unit-bonus' | 'morale-bonus' | 'tactical-bonus' | 'strategic-bonus';
  value: number;
  conditions: string[];
}

export interface CommanderTrait {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  effects: TraitEffect[];
}

export interface TraitEffect {
  type: 'morale' | 'combat' | 'logistics' | 'special';
  modifier: number;
  conditions: string[];
}

export type CommanderStatus = 'active' | 'wounded' | 'missing' | 'captured' | 'dead' | 'retired';

export type MilitaryRank = 
  | 'enlisted-1' | 'enlisted-2' | 'enlisted-3' | 'enlisted-4' | 'enlisted-5'
  | 'nco-1' | 'nco-2' | 'nco-3' | 'nco-4' | 'nco-5'
  | 'officer-1' | 'officer-2' | 'officer-3' | 'officer-4' | 'officer-5'
  | 'senior-1' | 'senior-2' | 'senior-3' | 'senior-4' | 'senior-5'
  | 'flag-1' | 'flag-2' | 'flag-3' | 'flag-4' | 'flag-5';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  date: Date;
  significance: 'minor' | 'moderate' | 'major' | 'legendary';
  effects: AchievementEffect[];
}

export interface AchievementEffect {
  type: 'reputation' | 'morale-bonus' | 'skill-bonus' | 'special-ability';
  value: number;
  permanent: boolean;
}

// ===== ALLIANCE & COALITION WARFARE =====

export interface AllianceIntegration {
  // Alliance Membership
  allianceId?: string;
  coalitionId?: string;
  
  // Integration Level
  integrationLevel: number; // 0-1 (independent to fully integrated)
  trustLevel: number; // 0-1
  
  // Command Integration
  jointCommand: boolean;
  commandAuthority: CommandAuthority;
  
  // Operational Integration
  sharedIntelligence: boolean;
  sharedLogistics: boolean;
  sharedCommunications: boolean;
  
  // Coordination Capabilities
  coordinationEfficiency: number; // 0-1
  languageBarriers: number; // 0-1 (none to severe)
  culturalCompatibility: number; // 0-1
  
  // Resource Sharing
  resourceSharing: ResourceSharingAgreement;
}

export interface CommandAuthority {
  level: 'none' | 'advisory' | 'coordination' | 'operational' | 'full';
  scope: string[]; // areas of authority
  limitations: string[]; // restrictions
  escalationProcedures: string[];
}

export interface ResourceSharingAgreement {
  // What can be shared
  ammunition: boolean;
  fuel: boolean;
  supplies: boolean;
  equipment: boolean;
  intelligence: boolean;
  
  // Sharing terms
  sharingRatio: number; // 0-1 (how much we share vs receive)
  priorityLevel: number; // 1-5 (priority in resource allocation)
  
  // Restrictions
  restrictions: string[];
  conditions: string[];
}

export interface AllegianceInfo {
  civilization: string;
  alliance?: string;
  coalition?: string;
  
  // Loyalty & Reliability
  loyalty: number; // 0-1
  reliability: number; // 0-1
  
  // Political Alignment
  politicalAlignment: string;
  ideologicalAlignment: string;
  
  // Relationship Status
  relationships: Record<string, RelationshipStatus>;
}

export interface RelationshipStatus {
  status: 'allied' | 'friendly' | 'neutral' | 'hostile' | 'enemy';
  trustLevel: number; // 0-1
  cooperationLevel: number; // 0-1
  lastInteraction: Date;
  history: RelationshipEvent[];
}

export interface RelationshipEvent {
  date: Date;
  type: 'cooperation' | 'conflict' | 'betrayal' | 'assistance' | 'trade' | 'diplomatic';
  impact: number; // -1 to 1
  description: string;
}

// ===== EXPERIENCE & TRAINING =====

export interface ExperienceLevel {
  // Overall Experience
  totalExperience: number;
  combatExperience: number;
  
  // Experience Categories
  battleExperience: BattleExperience;
  terrainExperience: Record<TerrainType, number>;
  enemyExperience: Record<string, number>; // experience vs specific enemies
  
  // Experience Effects
  experienceBonus: number; // 0-2 multiplier
  veteranStatus: VeteranStatus;
  
  // Learning & Adaptation
  learningRate: number; // 0-1
  adaptability: number; // 0-1
  
  // Experience Decay
  lastCombat: Date;
  experienceDecay: number; // rate of experience loss over time
}

export interface BattleExperience {
  totalBattles: number;
  victories: number;
  defeats: number;
  draws: number;
  retreats: number;
  
  // Battle Intensity
  lowIntensityBattles: number;
  mediumIntensityBattles: number;
  highIntensityBattles: number;
  
  // Battle Duration
  shortBattles: number; // < 1 hour
  mediumBattles: number; // 1-6 hours
  longBattles: number; // > 6 hours
  
  // Special Battle Types
  siegeBattles: number;
  ambushBattles: number;
  nightBattles: number;
  urbanBattles: number;
}

export type VeteranStatus = 'green' | 'regular' | 'seasoned' | 'veteran' | 'elite' | 'legendary';

export interface TrainingLevel {
  // Overall Training
  overallTraining: number; // 0-100
  
  // Training Categories
  basicTraining: number; // 0-100
  advancedTraining: number; // 0-100
  specializedTraining: number; // 0-100
  
  // Specific Training Areas
  combatTraining: number; // 0-100
  tacticalTraining: number; // 0-100
  technicalTraining: number; // 0-100
  survivalTraining: number; // 0-100
  
  // Training Specializations
  specializations: TrainingSpecialization[];
  
  // Training Status
  trainingStatus: TrainingStatus;
  lastTraining: Date;
  nextTraining?: Date;
  
  // Training Effects
  trainingBonus: number; // 0-1 multiplier
  skillRetention: number; // 0-1 (how well skills are retained)
}

export interface TrainingSpecialization {
  id: string;
  name: string;
  level: number; // 0-100
  description: string;
  effects: TrainingEffect[];
  requirements: string[];
}

export interface TrainingEffect {
  type: 'combat-bonus' | 'skill-bonus' | 'morale-bonus' | 'special-ability';
  value: number;
  conditions: string[];
}

export type TrainingStatus = 'untrained' | 'basic' | 'trained' | 'advanced' | 'expert' | 'master';

// ===== SUPPLY & LOGISTICS =====

export interface SupplyStatus {
  // Basic Supplies
  ammunition: SupplyLevel;
  fuel: SupplyLevel;
  food: SupplyLevel;
  water: SupplyLevel;
  medical: SupplyLevel;
  
  // Equipment Supplies
  spareParts: SupplyLevel;
  maintenance: SupplyLevel;
  
  // Supply Chain
  supplyChain: SupplyChain;
  
  // Supply Effects
  supplyEfficiency: number; // 0-1
  logisticalStrain: number; // 0-1
  
  // Resupply
  lastResupply: Date;
  nextResupply?: Date;
  resupplyPriority: number; // 1-5
}

export interface SupplyLevel {
  current: number;
  maximum: number;
  minimum: number; // minimum for operations
  critical: number; // critical shortage level
  
  consumption: number; // per day
  quality: number; // 0-1
  
  status: SupplyStatusType;
}

export type SupplyStatusType = 'abundant' | 'adequate' | 'low' | 'critical' | 'depleted';

export interface SupplyChain {
  // Supply Sources
  primarySource: SupplySource;
  backupSources: SupplySource[];
  
  // Supply Routes
  supplyRoutes: SupplyRoute[];
  
  // Supply Security
  routeSecurity: number; // 0-1
  supplyVulnerability: number; // 0-1
  
  // Logistics Efficiency
  transportEfficiency: number; // 0-1
  distributionEfficiency: number; // 0-1
}

export interface SupplySource {
  id: string;
  name: string;
  type: 'base' | 'depot' | 'factory' | 'captured' | 'allied' | 'local';
  location: UnitLocation;
  capacity: number;
  reliability: number; // 0-1
  security: number; // 0-1
  distance: number; // km
}

export interface SupplyRoute {
  id: string;
  from: string; // source ID
  to: string; // destination ID
  distance: number; // km
  travelTime: number; // hours
  security: number; // 0-1
  capacity: number; // supplies per trip
  frequency: number; // trips per day
  status: RouteStatus;
  threats: RouteThreat[];
}

export type RouteStatus = 'active' | 'disrupted' | 'blocked' | 'compromised' | 'destroyed';

export interface RouteThreat {
  type: 'enemy-forces' | 'terrain' | 'weather' | 'pirates' | 'sabotage';
  severity: number; // 0-1
  location: UnitLocation;
  description: string;
}

// ===== UNIT STATUS & CONDITION =====

export interface UnitStatus {
  operational: OperationalStatus;
  combat: CombatReadiness;
  mission: MissionStatus;
  
  // Status History
  statusHistory: StatusHistoryEntry[];
  
  // Status Effects
  activeEffects: StatusEffect[];
  
  // Alerts & Warnings
  alerts: UnitAlert[];
}

export type OperationalStatus = 
  | 'fully-operational' | 'operational' | 'limited' | 'non-operational' | 'destroyed';

export interface CombatReadiness {
  level: CombatReadinessLevel;
  percentage: number; // 0-100
  
  // Readiness Factors
  personnel: number; // 0-100
  equipment: number; // 0-100
  supplies: number; // 0-100
  training: number; // 0-100
  morale: number; // 0-100
  
  // Time to Ready
  timeToFullReadiness: number; // hours
  
  // Readiness Constraints
  constraints: ReadinessConstraint[];
}

export type CombatReadinessLevel = 'not-ready' | 'limited' | 'ready' | 'high-ready' | 'immediate';

export interface ReadinessConstraint {
  type: 'personnel' | 'equipment' | 'supplies' | 'training' | 'maintenance' | 'orders';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  timeToResolve?: number; // hours
}

export interface MissionStatus {
  currentMission?: Mission;
  missionHistory: Mission[];
  
  // Mission Readiness
  missionReadiness: number; // 0-1
  missionCapability: string[];
  
  // Orders & Directives
  currentOrders: Order[];
  standingOrders: Order[];
}

export interface Mission {
  id: string;
  name: string;
  type: MissionType;
  objective: string;
  priority: number; // 1-5
  
  // Mission Details
  startTime: Date;
  endTime?: Date;
  duration?: number; // hours
  
  // Mission Parameters
  parameters: MissionParameters;
  
  // Mission Status
  status: MissionStatusType;
  progress: number; // 0-100
  
  // Mission Results
  results?: MissionResults;
}

export type MissionType = 
  | 'attack' | 'defend' | 'patrol' | 'reconnaissance' | 'escort' | 'transport' | 'support'
  | 'siege' | 'raid' | 'ambush' | 'search-destroy' | 'peacekeeping' | 'humanitarian';

export interface MissionParameters {
  targetLocation?: UnitLocation;
  targetUnits?: string[];
  supportingUnits?: string[];
  
  // Rules of Engagement
  rulesOfEngagement: RulesOfEngagement;
  
  // Mission Constraints
  constraints: MissionConstraint[];
  
  // Success Criteria
  successCriteria: SuccessCriterion[];
}

export interface RulesOfEngagement {
  engagementLevel: 'defensive' | 'limited' | 'standard' | 'aggressive' | 'unrestricted';
  targetPriorities: string[];
  restrictions: string[];
  escalationProcedures: string[];
}

export interface MissionConstraint {
  type: 'time' | 'resources' | 'casualties' | 'collateral' | 'political' | 'operational';
  description: string;
  severity: 'advisory' | 'important' | 'critical' | 'absolute';
}

export interface SuccessCriterion {
  id: string;
  description: string;
  type: 'primary' | 'secondary' | 'bonus';
  measurable: boolean;
  target?: number;
  achieved: boolean;
}

export type MissionStatusType = 'planned' | 'active' | 'completed' | 'failed' | 'aborted' | 'suspended';

export interface MissionResults {
  success: boolean;
  completionPercentage: number;
  
  // Casualties & Losses
  casualties: CasualtyReport;
  equipmentLosses: EquipmentLoss[];
  
  // Achievements
  objectivesAchieved: string[];
  bonusObjectives: string[];
  
  // Performance Metrics
  efficiency: number; // 0-1
  timeEfficiency: number; // 0-1
  resourceEfficiency: number; // 0-1
  
  // Lessons Learned
  lessonsLearned: string[];
  recommendations: string[];
}

export interface Order {
  id: string;
  type: OrderType;
  priority: number; // 1-5
  issuer: string;
  recipient: string;
  
  // Order Content
  content: string;
  parameters: Record<string, any>;
  
  // Order Status
  status: OrderStatus;
  issuedAt: Date;
  acknowledgedAt?: Date;
  completedAt?: Date;
  
  // Order Constraints
  timeConstraints?: TimeConstraint;
  conditions?: string[];
}

export type OrderType = 
  | 'move' | 'attack' | 'defend' | 'patrol' | 'support' | 'resupply' | 'regroup' | 'retreat' | 'hold';

export type OrderStatus = 'issued' | 'acknowledged' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

export interface TimeConstraint {
  deadline?: Date;
  duration?: number; // hours
  startTime?: Date;
  endTime?: Date;
}

export interface StatusHistoryEntry {
  timestamp: Date;
  previousStatus: string;
  newStatus: string;
  reason: string;
  changedBy: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'neutral';
  source: string;
  
  // Effect Details
  effects: EffectModifier[];
  
  // Duration
  startTime: Date;
  duration?: number; // seconds, undefined for permanent
  endTime?: Date;
  
  // Stacking
  stackable: boolean;
  maxStacks: number;
  currentStacks: number;
}

export interface EffectModifier {
  attribute: string;
  type: 'additive' | 'multiplicative' | 'override';
  value: number;
}

export interface UnitAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  
  // Alert Details
  source: string;
  category: string;
  
  // Alert Status
  acknowledged: boolean;
  resolved: boolean;
  
  // Actions Required
  actionsRequired: string[];
  recommendedActions: string[];
}

export type AlertType = 
  | 'combat' | 'supply' | 'equipment' | 'personnel' | 'mission' | 'intelligence' | 'system';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

// ===== UNIT CONDITION =====

export interface UnitCondition {
  // Overall Condition
  overallCondition: number; // 0-100
  
  // Condition Categories
  personnel: PersonnelCondition;
  equipment: EquipmentCondition;
  infrastructure: InfrastructureCondition;
  
  // Damage Assessment
  damage: DamageAssessment;
  
  // Repair & Maintenance
  maintenance: MaintenanceStatus;
  
  // Environmental Effects
  environmental: EnvironmentalEffects;
}

export interface PersonnelCondition {
  // Personnel Numbers
  currentStrength: number;
  authorizedStrength: number;
  effectiveStrength: number; // accounting for wounded, etc.
  
  // Personnel Status
  healthy: number;
  wounded: number;
  sick: number;
  missing: number;
  
  // Personnel Readiness
  restLevel: number; // 0-100
  fatigueLevel: number; // 0-100
  stressLevel: number; // 0-100
  
  // Medical Status
  medicalReadiness: number; // 0-100
  medicalSupport: number; // 0-100
}

export interface EquipmentCondition {
  // Equipment Status
  operational: number; // percentage operational
  damaged: number; // percentage damaged
  destroyed: number; // percentage destroyed
  
  // Equipment Categories
  weapons: number; // 0-100 condition
  vehicles: number; // 0-100 condition
  communications: number; // 0-100 condition
  sensors: number; // 0-100 condition
  
  // Maintenance Needs
  maintenanceRequired: number; // 0-100
  repairRequired: number; // 0-100
  replacementRequired: number; // 0-100
}

export interface InfrastructureCondition {
  // Facility Condition
  facilities: number; // 0-100
  fortifications: number; // 0-100
  logistics: number; // 0-100
  
  // Infrastructure Damage
  structuralDamage: number; // 0-100
  systemDamage: number; // 0-100
  
  // Infrastructure Capability
  operationalCapability: number; // 0-100
  defensiveCapability: number; // 0-100
  logisticalCapability: number; // 0-100
}

export interface DamageAssessment {
  // Damage Categories
  battleDamage: BattleDamage;
  environmentalDamage: EnvironmentalDamage;
  wearDamage: WearDamage;
  
  // Damage History
  damageHistory: DamageEvent[];
  
  // Damage Trends
  damageRate: number; // damage per day
  repairRate: number; // repair per day
  netDamageRate: number; // net change per day
}

export interface BattleDamage {
  totalDamage: number; // 0-100
  recentDamage: number; // damage in last 24 hours
  
  // Damage by Source
  kineticDamage: number;
  energyDamage: number;
  explosiveDamage: number;
  specialDamage: number;
  
  // Damage by System
  weaponsDamage: number;
  armorDamage: number;
  mobilityDamage: number;
  sensorsDamage: number;
  communicationsDamage: number;
}

export interface EnvironmentalDamage {
  weatherDamage: number;
  corrosionDamage: number;
  radiationDamage: number;
  temperatureDamage: number;
}

export interface WearDamage {
  mechanicalWear: number;
  fatigueWear: number;
  ageingWear: number;
  usageWear: number;
}

export interface DamageEvent {
  timestamp: Date;
  type: 'battle' | 'environmental' | 'wear' | 'accident' | 'sabotage';
  severity: number; // 0-100
  location: string;
  description: string;
  repaired: boolean;
  repairTime?: Date;
}

export interface MaintenanceStatus {
  // Maintenance Schedule
  lastMaintenance: Date;
  nextMaintenance: Date;
  maintenanceOverdue: boolean;
  
  // Maintenance Types
  routineMaintenance: MaintenanceLevel;
  preventiveMaintenance: MaintenanceLevel;
  correctiveMaintenance: MaintenanceLevel;
  
  // Maintenance Capability
  maintenanceCapability: number; // 0-100
  maintenanceEfficiency: number; // 0-100
  
  // Maintenance Resources
  maintenancePersonnel: number;
  maintenanceSupplies: number; // 0-100
  maintenanceEquipment: number; // 0-100
}

export interface MaintenanceLevel {
  required: number; // 0-100
  completed: number; // 0-100
  efficiency: number; // 0-100
  backlog: number; // hours of maintenance needed
}

export interface EnvironmentalEffects {
  // Current Environment
  temperature: number; // celsius
  humidity: number; // 0-100
  pressure: number; // atmospheres
  radiation: number; // 0-100
  
  // Environmental Stress
  environmentalStress: number; // 0-100
  adaptationLevel: number; // 0-100
  
  // Environmental Protection
  environmentalProtection: number; // 0-100
  lifeSupportEfficiency: number; // 0-100
  
  // Environmental Hazards
  hazards: EnvironmentalHazard[];
}

export interface EnvironmentalHazard {
  type: 'radiation' | 'toxic' | 'extreme-temperature' | 'low-oxygen' | 'high-pressure' | 'corrosive';
  severity: number; // 0-100
  exposure: number; // 0-100
  protection: number; // 0-100
  effects: HazardEffect[];
}

export interface HazardEffect {
  type: 'health' | 'equipment' | 'performance' | 'morale';
  severity: number; // 0-100
  duration: number; // hours
  cumulative: boolean;
}

// ===== CASUALTY REPORTING =====

export interface CasualtyReport {
  // Personnel Casualties
  killed: number;
  wounded: number;
  missing: number;
  captured: number;
  
  // Casualty Categories
  combat: number;
  nonCombat: number;
  
  // Casualty by Type
  officer: number;
  enlisted: number;
  specialist: number;
  
  // Equipment Losses
  equipmentDestroyed: EquipmentLoss[];
  equipmentDamaged: EquipmentLoss[];
  
  // Casualty Details
  casualties: CasualtyEntry[];
}

export interface EquipmentLoss {
  equipmentType: EquipmentType;
  quantity: number;
  value: number;
  cause: string;
  recoverable: boolean;
}

export interface CasualtyEntry {
  id: string;
  name: string;
  rank: MilitaryRank;
  status: CasualtyStatus;
  cause: string;
  date: Date;
  location: UnitLocation;
  
  // Medical Information
  injuries?: InjuryReport[];
  medicalStatus?: MedicalStatus;
  treatmentRequired?: string;
  
  // Recovery Information
  expectedRecovery?: Date;
  returnToDuty?: Date;
}

export type CasualtyStatus = 'killed' | 'wounded' | 'missing' | 'captured' | 'sick' | 'injured';

export interface InjuryReport {
  type: 'physical' | 'psychological' | 'radiation' | 'chemical' | 'biological';
  severity: 'minor' | 'moderate' | 'serious' | 'critical' | 'fatal';
  bodyPart?: string;
  description: string;
  treatment: string;
  prognosis: string;
}

export interface MedicalStatus {
  condition: 'stable' | 'critical' | 'improving' | 'deteriorating';
  treatmentLocation: string;
  medicalPersonnel: string;
  medications: string[];
  procedures: string[];
  
  // Recovery Projection
  recoveryTime: number; // days
  returnToDutyTime: number; // days
  permanentDisability: boolean;
  disabilityRating?: number; // 0-100
}

// ===== BATTLE SYSTEM TYPES =====

export interface BattleState {
  id: string;
  attackers: MilitaryUnit[];
  defenders: MilitaryUnit[];
  conditions: BattleConditions;
  currentPhase: BattlePhase;
  startTime: Date;
  duration: number; // minutes elapsed
  
  // Battle Tracking
  casualties: Record<string, CasualtyReport>; // unit ID -> casualties
  moraleDamage: Record<string, number>; // unit ID -> morale damage
  equipmentDamage: Record<string, EquipmentDamage>; // unit ID -> equipment damage
  
  // Tactical State
  tacticalSituation: TacticalSituation;
  initiativeHolder: 'attacker' | 'defender';
  
  // Environmental Changes
  environmentalChanges: EnvironmentalChange[];
}

export interface BattleConditions {
  terrain: TerrainType;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  visibility: number; // 0-1
  temperature: number;
  duration: number; // expected battle duration in hours
  
  // Strategic Context
  strategicImportance: number; // 0-1
  civilianPresence: boolean;
  infrastructureValue: number; // 0-1
  
  // Special Conditions
  specialConditions: SpecialBattleCondition[];
}

export interface SpecialBattleCondition {
  type: 'orbital-bombardment' | 'psychic-storm' | 'temporal-anomaly' | 'radiation' | 'gravity-well';
  severity: number; // 0-1
  effects: BattleEffect[];
  duration: number; // minutes
}

export interface BattleEffect {
  target: 'all' | 'attackers' | 'defenders' | 'specific-units';
  attribute: string;
  modifier: number;
  type: 'additive' | 'multiplicative';
}

export type BattlePhase = 
  | 'pre-battle' | 'opening' | 'main-engagement' | 'climax' | 'resolution' | 'post-battle';

export interface BattleResult {
  outcome: 'attacker-victory' | 'defender-victory' | 'stalemate' | 'mutual-destruction';
  decisiveness: number; // 0-1 (how decisive the victory was)
  duration: number; // actual battle duration in hours
  
  // Casualties
  attackerCasualties: CasualtyReport;
  defenderCasualties: CasualtyReport;
  
  // Battle Analysis
  keyFactors: string[];
  turningPoints: BattleTurningPoint[];
  
  // Post-Battle Status
  territoryControl: TerritoryControl;
  strategicImpact: StrategicImpact;
  
  // Lessons Learned
  tacticalLessons: string[];
  strategicLessons: string[];
  
  // Battle Statistics
  statistics: BattleStatistics;
}

export interface BattleTurningPoint {
  timestamp: Date;
  phase: BattlePhase;
  event: string;
  impact: number; // -1 to 1
  description: string;
  unitsInvolved: string[];
}

export interface TerritoryControl {
  controlledBy: 'attacker' | 'defender' | 'contested' | 'neutral';
  controlStrength: number; // 0-1
  strategicValue: number; // 0-1
  resourceValue: number; // 0-1
}

export interface StrategicImpact {
  warEffort: number; // -1 to 1 impact on overall war
  allianceRelations: Record<string, number>; // alliance ID -> impact
  publicOpinion: number; // -1 to 1
  economicImpact: number; // -1 to 1
  technologicalGains: string[]; // captured technologies
}

export interface BattleStatistics {
  totalShots: number;
  shotsHit: number;
  accuracy: number; // 0-1
  damageDealt: Record<string, number>; // unit ID -> damage dealt
  damageTaken: Record<string, number>; // unit ID -> damage taken
  timeInCombat: Record<string, number>; // unit ID -> minutes in combat
  retreatAttempts: number;
  surrenderAttempts: number;
}

export interface TacticalSituation {
  frontlinePositions: Record<string, Position>; // unit ID -> position
  flanking: FlankingStatus;
  encirclement: EncirclementStatus;
  highGround: HighGroundStatus;
  coverUtilization: Record<string, number>; // unit ID -> cover effectiveness
  
  // Tactical Advantages
  tacticalAdvantages: TacticalAdvantage[];
  
  // Movement and Positioning
  movementRestrictions: MovementRestriction[];
  escapeRoutes: EscapeRoute[];
}

export interface Position {
  x: number;
  y: number;
  z: number;
  facing: number; // degrees
  elevation: number;
  cover: CoverType;
}

export interface FlankingStatus {
  attackerFlanking: boolean;
  defenderFlanking: boolean;
  flankingAdvantage: number; // -1 to 1
}

export interface EncirclementStatus {
  encircled: string[]; // unit IDs that are encircled
  encircling: string[]; // unit IDs doing the encircling
  escapeRoutes: number; // number of escape routes available
}

export interface HighGroundStatus {
  controlledBy: 'attacker' | 'defender' | 'contested';
  advantage: number; // 0-1
  strategicValue: number; // 0-1
}

export interface TacticalAdvantage {
  type: 'flanking' | 'high-ground' | 'superior-numbers' | 'technology' | 'surprise' | 'morale';
  holder: 'attacker' | 'defender';
  strength: number; // 0-1
  description: string;
}

export interface EscapeRoute {
  id: string;
  from: Position;
  to: Position;
  difficulty: number; // 0-1
  capacity: number; // units that can use simultaneously
  timeRequired: number; // minutes
  risks: string[];
}

export interface EnvironmentalChange {
  timestamp: Date;
  type: 'weather' | 'time-of-day' | 'terrain' | 'special-event';
  description: string;
  effects: BattleEffect[];
  duration: number; // minutes
}

export interface EquipmentDamage {
  weapons: number; // 0-1 (0 = destroyed, 1 = perfect)
  armor: number;
  mobility: number;
  sensors: number;
  communications: number;
  
  // Specific Damage
  criticalSystems: SystemDamage[];
  repairability: number; // 0-1
  repairTime: number; // hours
}

export interface SystemDamage {
  system: string;
  damage: number; // 0-1
  functional: boolean;
  repairPriority: number; // 1-5
}

// ===== PREDICTION & ANALYSIS TYPES =====

export interface BattlePrediction {
  predictedOutcome: 'attacker-victory' | 'defender-victory' | 'stalemate';
  confidence: number; // 0-1
  expectedDuration: number; // hours
  expectedCasualties: {
    attacker: number; // percentage
    defender: number; // percentage
  };
  keyFactors: string[];
  scenarios: BattleScenario[];
}

export interface BattleScenario {
  name: string;
  probability: number; // 0-1
  outcome: string;
  description: string;
  keyEvents: string[];
}

export interface TacticalRecommendation {
  id: string;
  type: 'offensive' | 'defensive' | 'maneuver' | 'support';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expectedBenefit: number; // 0-1
  riskLevel: number; // 0-1
  resourceRequirement: number; // 0-1
  timeToExecute: number; // minutes
  conditions: string[];
}

export interface MoraleProjection {
  nextWeek: number;
  nextMonth: number;
  confidence: number;
  scenarios: MoraleScenario[];
  
  // Projection Factors
  trendImpact: number;
  seasonalImpact: number;
  eventImpact: number;
  
  // Risk Assessment
  collapseRisk: number; // 0-1 probability of morale collapse
  recoveryPotential: number; // 0-1 potential for recovery
}

// ===== ALLIANCE & COALITION TYPES =====

export interface AllianceCommandStructure {
  supremeCommander: string; // unit ID
  liaisons: AllianceLiaison[];
  commandProtocols: CommandProtocol[];
  communicationChannels: CommunicationChannel[];
  
  // Command Efficiency
  commandDelay: number; // minutes for orders to propagate
  coordinationEfficiency: number; // 0-1
  
  // Decision Making
  decisionMakingProcess: DecisionMakingProcess;
  escalationProcedures: EscalationProcedure[];
}

export interface AllianceLiaison {
  allianceId: string;
  officerId: string;
  rank: MilitaryRank;
  authority: CommandAuthority;
  communicationCapability: number; // 0-1
  trustLevel: number; // 0-1
}

export interface CommandProtocol {
  id: string;
  name: string;
  description: string;
  applicableScenarios: string[];
  commandChain: string[];
  timeConstraints: TimeConstraint[];
}

export interface CommunicationChannel {
  id: string;
  type: 'radio' | 'quantum' | 'telepathic' | 'courier' | 'digital';
  security: number; // 0-1
  reliability: number; // 0-1
  range: number; // km
  bandwidth: number; // messages per minute
  participants: string[]; // alliance IDs
}

export interface DecisionMakingProcess {
  type: 'consensus' | 'majority' | 'supreme-commander' | 'rotating-command';
  timeLimit: number; // minutes
  quorumRequirement: number; // 0-1
  vetoRights: string[]; // alliance IDs with veto power
}

export interface EscalationProcedure {
  trigger: string;
  escalationLevel: number; // 1-5
  authorizedActions: string[];
  notificationRequirements: string[];
  timeConstraints: TimeConstraint[];
}

export interface AlliancePerformanceMetrics {
  overallEffectiveness: number; // 0-1
  coordinationScore: number; // 0-1
  communicationScore: number; // 0-1
  trustScore: number; // 0-1
  
  // Individual Alliance Performance
  allianceScores: Record<string, AllianceScore>;
  
  // Performance Issues
  coordinationFailures: CoordinationFailure[];
  communicationBreakdowns: CommunicationBreakdown[];
}

export interface AllianceScore {
  allianceId: string;
  effectiveness: number; // 0-1
  reliability: number; // 0-1
  contribution: number; // 0-1
  casualties: number; // percentage
  objectives: number; // objectives completed
}

export interface CoordinationFailure {
  timestamp: Date;
  type: 'timing' | 'positioning' | 'communication' | 'authority';
  severity: number; // 0-1
  unitsAffected: string[];
  impact: string;
  resolution: string;
}

export interface CommunicationBreakdown {
  timestamp: Date;
  channel: string;
  duration: number; // minutes
  affectedAlliances: string[];
  impact: string;
  cause: string;
}

// ===== SENSOR & INTELLIGENCE TYPES =====

export interface SensorCoverage {
  area: GeographicArea;
  depth: number; // detection range in km
  resolution: number; // 0-1 (detail level)
  
  // Coverage Types
  visual: boolean;
  electronic: boolean;
  thermal: boolean;
  gravitational: boolean;
  psychic: boolean;
  
  // Coverage Priorities
  priorities: CoveragePriority[];
}

export interface GeographicArea {
  center: Position;
  radius: number; // km
  shape: 'circle' | 'rectangle' | 'polygon' | 'line';
  coordinates?: Position[]; // for complex shapes
}

export interface CoveragePriority {
  area: GeographicArea;
  priority: number; // 1-5
  sensorTypes: SensorType[];
  requirements: string[];
}

export type SensorType = 
  | 'visual' | 'infrared' | 'radar' | 'lidar' | 'sonar' | 'gravitational' 
  | 'quantum' | 'psychic' | 'electromagnetic' | 'seismic';

export interface DeployedSensor {
  id: string;
  type: SensorType;
  position: Position;
  range: number; // km
  accuracy: number; // 0-1
  reliability: number; // 0-1
  
  // Sensor Status
  operational: boolean;
  batteryLevel: number; // 0-1
  maintenanceRequired: boolean;
  
  // Detection Capabilities
  detectionThresholds: DetectionThreshold[];
  
  // Vulnerabilities
  vulnerabilities: SensorVulnerability[];
  
  // Network Integration
  networkId: string;
  communicationLinks: string[]; // connected sensor IDs
}

export interface DetectionThreshold {
  targetType: UnitType;
  minimumSize: number;
  detectionRange: number; // km
  accuracy: number; // 0-1
  falsePositiveRate: number; // 0-1
}

export interface DetectionCapability {
  overallCoverage: number; // 0-1
  redundancy: number; // 0-1
  
  // Detection by Type
  groundDetection: number; // 0-1
  airDetection: number; // 0-1
  spaceDetection: number; // 0-1
  stealthDetection: number; // 0-1
  
  // Detection Ranges
  shortRange: number; // km
  mediumRange: number; // km
  longRange: number; // km
  
  // Detection Quality
  trackingAccuracy: number; // 0-1
  identificationAccuracy: number; // 0-1
  
  // Response Times
  detectionDelay: number; // seconds
  trackingDelay: number; // seconds
  reportingDelay: number; // seconds
}

export interface SensorVulnerability {
  type: 'jamming' | 'physical-attack' | 'cyber-attack' | 'environmental' | 'power-failure';
  severity: number; // 0-1
  probability: number; // 0-1
  mitigation: string[];
  impact: string;
}

export interface MaintenanceRequirement {
  sensorId: string;
  type: 'routine' | 'repair' | 'replacement' | 'upgrade';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // hours
  requiredResources: string[];
  skillsRequired: string[];
}

// ===== INTELLIGENCE OPERATION TYPES =====

export type IntelligenceOperationType = 
  | 'reconnaissance' | 'surveillance' | 'infiltration' | 'sabotage' 
  | 'counter-intelligence' | 'signals-intelligence' | 'human-intelligence';

export interface IntelligenceTarget {
  type: 'unit' | 'facility' | 'communication' | 'leadership' | 'technology';
  id: string;
  location: Position;
  priority: number; // 1-5
  difficulty: number; // 0-1
  
  // Target Details
  securityLevel: number; // 0-1
  defenses: TargetDefense[];
  intelligence: string[]; // types of intelligence available
  
  // Access Requirements
  accessMethods: AccessMethod[];
  timeWindows: TimeWindow[];
}

export interface TargetDefense {
  type: 'physical' | 'electronic' | 'personnel' | 'procedural' | 'psychic';
  strength: number; // 0-1
  coverage: number; // 0-1
  alertLevel: number; // 0-1
  responseTime: number; // minutes
}

export interface AccessMethod {
  method: 'infiltration' | 'hacking' | 'social-engineering' | 'bribery' | 'coercion' | 'technical';
  difficulty: number; // 0-1
  riskLevel: number; // 0-1
  timeRequired: number; // hours
  resourcesRequired: string[];
  skillsRequired: string[];
}

export interface TimeWindow {
  start: Date;
  end: Date;
  difficulty: number; // 0-1
  riskLevel: number; // 0-1
  description: string;
}

export interface CollectedIntelligence {
  type: IntelligenceType;
  quality: number; // 0-1
  reliability: number; // 0-1
  timeliness: number; // 0-1
  
  // Intelligence Content
  content: IntelligenceContent;
  
  // Source Information
  source: IntelligenceSource;
  collectionMethod: string;
  
  // Analysis
  analysis: IntelligenceAnalysis;
  
  // Security
  classification: 'unclassified' | 'confidential' | 'secret' | 'top-secret';
  compartments: string[];
  
  // Metadata
  collectedAt: Date;
  expiresAt?: Date;
  confidence: number; // 0-1
}

export type IntelligenceType = 
  | 'order-of-battle' | 'capabilities' | 'intentions' | 'communications' 
  | 'technology' | 'logistics' | 'morale' | 'leadership' | 'plans';

export interface IntelligenceContent {
  summary: string;
  details: Record<string, any>;
  
  // Specific Intelligence Types
  unitInformation?: UnitIntelligence[];
  communicationIntelligence?: CommunicationIntelligence[];
  technicalIntelligence?: TechnicalIntelligence[];
  humanIntelligence?: HumanIntelligence[];
}

export interface UnitIntelligence {
  unitId: string;
  unitType: UnitType;
  size: number;
  location: Position;
  status: string;
  capabilities: string[];
  weaknesses: string[];
  morale: number; // 0-100
  equipment: string[];
  leadership: string[];
}

export interface CommunicationIntelligence {
  frequency: number;
  encryption: string;
  participants: string[];
  content: string;
  timestamp: Date;
  priority: string;
  classification: string;
}

export interface TechnicalIntelligence {
  technology: string;
  capabilities: string[];
  limitations: string[];
  countermeasures: string[];
  acquisitionMethod: string;
  technicalSpecs: Record<string, any>;
}

export interface HumanIntelligence {
  source: string;
  reliability: number; // 0-1
  information: string;
  context: string;
  corroboration: string[];
  risks: string[];
}

export interface IntelligenceSource {
  type: 'human' | 'signals' | 'imagery' | 'technical' | 'open-source';
  id: string;
  reliability: number; // 0-1
  access: number; // 0-1
  motivation: string;
  risks: string[];
}

export interface IntelligenceAnalysis {
  keyFindings: string[];
  implications: string[];
  recommendations: string[];
  
  // Confidence Assessment
  confidenceFactors: ConfidenceFactor[];
  overallConfidence: number; // 0-1
  
  // Corroboration
  corroboratingSources: string[];
  contradictingSources: string[];
  
  // Follow-up Requirements
  additionalCollection: string[];
  verificationNeeded: string[];
  
  // Analyst Information
  analyst: string;
  analysisDate: Date;
  reviewedBy?: string[];
}

export interface ConfidenceFactor {
  factor: string;
  impact: number; // -1 to 1
  description: string;
}
