/**
 * Advanced Game Modes - Type Definitions
 * 
 * Defines comprehensive types for COOP, Achievement, Conquest, and Hero game modes
 * with unique objectives, mechanics, and victory conditions.
 */

// ===== CORE GAME MODE TYPES =====

export interface GameMode {
  id: string;
  name: string;
  type: GameModeType;
  description: string;
  playerCount: PlayerCountRange;
  duration: GameDuration;
  difficulty: DifficultyLevel;
  objectives: GameObjective[];
  victoryConditions: VictoryCondition[];
  mechanics: GameMechanic[];
  rewards: GameReward[];
  settings: GameModeSettings;
  metadata: GameModeMetadata;
}

export type GameModeType = 'COOP' | 'ACHIEVEMENT' | 'CONQUEST' | 'HERO';

export interface PlayerCountRange {
  min: number;
  max: number;
  recommended: number;
}

export interface GameDuration {
  estimated: number; // minutes
  minimum: number;
  maximum: number;
  flexible: boolean;
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME' | 'ADAPTIVE';

// ===== GAME OBJECTIVES =====

export interface GameObjective {
  id: string;
  name: string;
  description: string;
  type: ObjectiveType;
  category: ObjectiveCategory;
  priority: ObjectivePriority;
  requirements: ObjectiveRequirement[];
  rewards: ObjectiveReward[];
  timeLimit?: number; // minutes
  dependencies: string[]; // other objective IDs
  isOptional: boolean;
  isHidden: boolean;
  progressTracking: ProgressTracking;
}

export type ObjectiveType = 
  | 'SURVIVAL' | 'DEFENSE' | 'CONSTRUCTION' | 'RESEARCH' | 'DIPLOMACY'
  | 'ECONOMIC' | 'MILITARY' | 'EXPLORATION' | 'ACHIEVEMENT' | 'COLLECTION'
  | 'ELIMINATION' | 'TERRITORY' | 'RESCUE' | 'ESCORT' | 'PUZZLE';

export type ObjectiveCategory = 
  | 'PRIMARY' | 'SECONDARY' | 'BONUS' | 'HIDDEN' | 'DYNAMIC' | 'EMERGENCY';

export type ObjectivePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OPTIONAL';

export interface ObjectiveRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
  description: string;
}

export type RequirementType = 
  | 'POPULATION' | 'TECHNOLOGY' | 'RESOURCES' | 'BUILDINGS' | 'MILITARY'
  | 'TERRITORY' | 'ALLIANCES' | 'TRADE' | 'RESEARCH' | 'TIME' | 'SCORE';

export type ComparisonOperator = 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_EQUAL' | 'LESS_EQUAL';

export interface ObjectiveReward {
  type: RewardType;
  value: number;
  description: string;
  immediate: boolean;
}

export type RewardType = 
  | 'POINTS' | 'RESOURCES' | 'TECHNOLOGY' | 'UNITS' | 'BUILDINGS'
  | 'REPUTATION' | 'INFLUENCE' | 'SPECIAL_ABILITY' | 'UNLOCK';

export interface ProgressTracking {
  current: number;
  target: number;
  unit: string;
  percentage: number;
  milestones: ProgressMilestone[];
}

export interface ProgressMilestone {
  threshold: number;
  reward?: ObjectiveReward;
  notification: string;
}

// ===== VICTORY CONDITIONS =====

export interface VictoryCondition {
  id: string;
  name: string;
  description: string;
  type: VictoryType;
  requirements: VictoryRequirement[];
  timeLimit?: number;
  isShared: boolean; // for team victories
  priority: number; // for multiple victory conditions
}

export type VictoryType = 
  | 'ELIMINATION' | 'DOMINATION' | 'ECONOMIC' | 'TECHNOLOGICAL' | 'DIPLOMATIC'
  | 'CULTURAL' | 'SURVIVAL' | 'SCORE' | 'OBJECTIVE' | 'TIME' | 'COOPERATIVE';

export interface VictoryRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
  description: string;
  mustMaintain?: number; // minutes to maintain condition
}

// ===== GAME MECHANICS =====

export interface GameMechanic {
  id: string;
  name: string;
  description: string;
  type: MechanicType;
  category: MechanicCategory;
  effects: MechanicEffect[];
  triggers: MechanicTrigger[];
  duration?: number;
  cooldown?: number;
  isActive: boolean;
}

export type MechanicType = 
  | 'RESOURCE_MODIFIER' | 'UNIT_MODIFIER' | 'BUILDING_MODIFIER' | 'RESEARCH_MODIFIER'
  | 'DIPLOMATIC_MODIFIER' | 'EVENT_TRIGGER' | 'SPECIAL_ABILITY' | 'RESTRICTION'
  | 'BONUS' | 'PENALTY' | 'TRANSFORMATION' | 'SPAWNING';

export type MechanicCategory = 
  | 'ECONOMIC' | 'MILITARY' | 'TECHNOLOGICAL' | 'DIPLOMATIC' | 'SOCIAL'
  | 'ENVIRONMENTAL' | 'TEMPORAL' | 'SPECIAL' | 'COOPERATIVE' | 'COMPETITIVE';

export interface MechanicEffect {
  target: EffectTarget;
  modification: EffectModification;
  value: number;
  duration?: number;
  description: string;
}

export type EffectTarget = 
  | 'PLAYER' | 'TEAM' | 'CIVILIZATION' | 'UNITS' | 'BUILDINGS' | 'RESOURCES'
  | 'RESEARCH' | 'DIPLOMACY' | 'ENVIRONMENT' | 'ALL_PLAYERS' | 'ENEMIES';

export interface EffectModification {
  type: ModificationType;
  operation: ModificationOperation;
  scope: ModificationScope;
}

export type ModificationType = 
  | 'PRODUCTION' | 'CONSUMPTION' | 'SPEED' | 'EFFICIENCY' | 'CAPACITY'
  | 'DAMAGE' | 'DEFENSE' | 'RANGE' | 'COST' | 'AVAILABILITY';

export type ModificationOperation = 'ADD' | 'MULTIPLY' | 'SET' | 'PERCENTAGE';

export type ModificationScope = 'GLOBAL' | 'LOCAL' | 'TEMPORARY' | 'PERMANENT';

export interface MechanicTrigger {
  event: TriggerEvent;
  condition?: TriggerCondition;
  probability?: number; // 0-1
  cooldown?: number;
}

export type TriggerEvent = 
  | 'GAME_START' | 'TURN_START' | 'TURN_END' | 'OBJECTIVE_COMPLETE'
  | 'UNIT_CREATED' | 'BUILDING_BUILT' | 'RESEARCH_COMPLETE' | 'COMBAT_WIN'
  | 'COMBAT_LOSS' | 'ALLIANCE_FORMED' | 'TRADE_ESTABLISHED' | 'RESOURCE_DEPLETED'
  | 'POPULATION_THRESHOLD' | 'TIME_ELAPSED' | 'PLAYER_ACTION' | 'RANDOM_EVENT';

export interface TriggerCondition {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

// ===== GAME REWARDS =====

export interface GameReward {
  id: string;
  name: string;
  description: string;
  type: GameRewardType;
  category: RewardCategory;
  value: RewardValue;
  requirements: RewardRequirement[];
  rarity: RewardRarity;
  isUnlockable: boolean;
  isTransferable: boolean;
}

export type GameRewardType = 
  | 'ACHIEVEMENT' | 'TITLE' | 'COSMETIC' | 'UNLOCK' | 'BONUS' | 'CURRENCY'
  | 'EXPERIENCE' | 'RANKING' | 'BADGE' | 'TROPHY' | 'SPECIAL_ITEM';

export type RewardCategory = 
  | 'PROGRESSION' | 'COSMETIC' | 'FUNCTIONAL' | 'SOCIAL' | 'COMPETITIVE'
  | 'COOPERATIVE' | 'ACHIEVEMENT' | 'SEASONAL' | 'SPECIAL' | 'LEGACY';

export interface RewardValue {
  amount: number;
  currency?: string;
  items?: RewardItem[];
  unlocks?: string[];
  bonuses?: RewardBonus[];
}

export interface RewardItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  rarity: RewardRarity;
}

export interface RewardBonus {
  type: string;
  value: number;
  duration?: number;
  description: string;
}

export interface RewardRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export type RewardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'UNIQUE';

// ===== SPECIFIC GAME MODE TYPES =====

// COOP Mode
export interface CoopGameMode extends GameMode {
  type: 'COOP';
  coopSettings: CoopSettings;
  sharedObjectives: GameObjective[];
  individualObjectives: GameObjective[];
  teamMechanics: TeamMechanic[];
  communicationTools: CommunicationTool[];
}

export interface CoopSettings {
  sharedResources: boolean;
  sharedTechnology: boolean;
  sharedVictory: boolean;
  allowFriendlyFire: boolean;
  reviveSystem: ReviveSystem;
  difficultyScaling: DifficultyScaling;
}

export interface ReviveSystem {
  enabled: boolean;
  reviveTime: number;
  reviveCost?: ResourceCost;
  maxRevives?: number;
  reviveLocations: ReviveLocation[];
}

export interface ReviveLocation {
  type: 'SPAWN' | 'TEAMMATE' | 'BUILDING' | 'CHECKPOINT';
  requirements?: string[];
}

export interface DifficultyScaling {
  scaleWithPlayers: boolean;
  baseMultiplier: number;
  perPlayerMultiplier: number;
  maxDifficulty: number;
}

export interface TeamMechanic {
  id: string;
  name: string;
  description: string;
  type: TeamMechanicType;
  requirements: TeamRequirement[];
  effects: MechanicEffect[];
  cooldown?: number;
}

export type TeamMechanicType = 
  | 'COMBINED_ABILITY' | 'RESOURCE_SHARING' | 'TECH_SHARING' | 'UNIT_COMBINATION'
  | 'BUILDING_COOPERATION' | 'RESEARCH_COLLABORATION' | 'DEFENSE_COORDINATION'
  | 'ATTACK_COORDINATION' | 'EMERGENCY_SUPPORT' | 'STRATEGIC_PLANNING';

export interface TeamRequirement {
  playersNeeded: number;
  proximityRequired?: number;
  resourcesRequired?: ResourceCost[];
  unitsRequired?: UnitRequirement[];
}

export interface CommunicationTool {
  type: CommunicationType;
  enabled: boolean;
  features: CommunicationFeature[];
}

export type CommunicationType = 'VOICE' | 'TEXT' | 'PING' | 'DRAWING' | 'PRESET_MESSAGES';

export interface CommunicationFeature {
  name: string;
  description: string;
  hotkey?: string;
  cooldown?: number;
}

// Achievement Mode
export interface AchievementGameMode extends GameMode {
  type: 'ACHIEVEMENT';
  achievementSettings: AchievementSettings;
  achievements: Achievement[];
  leaderboards: Leaderboard[];
  progressionSystem: ProgressionSystem;
}

export interface AchievementSettings {
  competitiveScoring: boolean;
  hiddenAchievements: boolean;
  progressSharing: boolean;
  timeBasedChallenges: boolean;
  difficultyMultipliers: Record<DifficultyLevel, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  difficulty: AchievementDifficulty;
  requirements: AchievementRequirement[];
  rewards: GameReward[];
  points: number;
  isHidden: boolean;
  isRepeatable: boolean;
  dependencies: string[];
  statistics: AchievementStatistics;
}

export type AchievementCategory = 
  | 'COMBAT' | 'ECONOMIC' | 'TECHNOLOGICAL' | 'DIPLOMATIC' | 'EXPLORATION'
  | 'CONSTRUCTION' | 'SURVIVAL' | 'SOCIAL' | 'SPECIAL' | 'SEASONAL';

export type AchievementDifficulty = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface AchievementRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
  timeLimit?: number;
  mustMaintain?: boolean;
}

export interface AchievementStatistics {
  completionRate: number;
  averageTime: number;
  firstCompletedBy?: string;
  totalCompletions: number;
  rarity: RewardRarity;
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  type: LeaderboardType;
  metric: LeaderboardMetric;
  timeframe: LeaderboardTimeframe;
  entries: LeaderboardEntry[];
  rewards: LeaderboardReward[];
}

export type LeaderboardType = 'GLOBAL' | 'FRIENDS' | 'GUILD' | 'REGIONAL' | 'SEASONAL';

export interface LeaderboardMetric {
  name: string;
  unit: string;
  higherIsBetter: boolean;
  precision: number;
}

export type LeaderboardTimeframe = 'ALL_TIME' | 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'SEASONAL';

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  timestamp: Date;
  additionalData?: Record<string, any>;
}

export interface LeaderboardReward {
  rankRange: [number, number]; // [min, max] inclusive
  rewards: GameReward[];
  title?: string;
}

export interface ProgressionSystem {
  levels: ProgressionLevel[];
  experience: ExperienceSystem;
  unlocks: ProgressionUnlock[];
  prestige: PrestigeSystem;
}

export interface ProgressionLevel {
  level: number;
  experienceRequired: number;
  rewards: GameReward[];
  unlocks: string[];
  title?: string;
}

export interface ExperienceSystem {
  sources: ExperienceSource[];
  multipliers: ExperienceMultiplier[];
  bonusEvents: ExperienceBonusEvent[];
}

export interface ExperienceSource {
  action: string;
  baseExperience: number;
  scalingFactor?: number;
  maxPerGame?: number;
}

export interface ExperienceMultiplier {
  condition: string;
  multiplier: number;
  duration?: number;
}

export interface ExperienceBonusEvent {
  name: string;
  multiplier: number;
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface ProgressionUnlock {
  level: number;
  type: UnlockType;
  item: string;
  description: string;
}

export type UnlockType = 'GAME_MODE' | 'CIVILIZATION' | 'UNIT' | 'BUILDING' | 'TECHNOLOGY' | 'COSMETIC';

export interface PrestigeSystem {
  enabled: boolean;
  maxLevel: number;
  prestigeRewards: PrestigeReward[];
  prestigeBonuses: PrestigeBonus[];
}

export interface PrestigeReward {
  prestigeLevel: number;
  rewards: GameReward[];
  permanentBonuses: PrestigeBonus[];
}

export interface PrestigeBonus {
  type: string;
  value: number;
  description: string;
  isPermanent: boolean;
}

// Conquest Mode
export interface ConquestGameMode extends GameMode {
  type: 'CONQUEST';
  conquestSettings: ConquestSettings;
  territories: Territory[];
  factions: Faction[];
  campaignMap: CampaignMap;
  diplomacySystem: DiplomacySystem;
}

export interface ConquestSettings {
  mapSize: MapSize;
  territoryCount: number;
  startingTerritories: number;
  victoryThreshold: number; // percentage of map to control
  allowAlliances: boolean;
  allowTrade: boolean;
  fogOfWar: boolean;
  turnTimeLimit?: number;
}

export type MapSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'HUGE' | 'CUSTOM';

export interface Territory {
  id: string;
  name: string;
  type: TerritoryType;
  position: MapPosition;
  resources: TerritoryResource[];
  defenseValue: number;
  population: number;
  buildings: TerritoryBuilding[];
  controlledBy?: string; // player/faction ID
  adjacentTerritories: string[];
  specialFeatures: TerritoryFeature[];
}

export type TerritoryType = 'CAPITAL' | 'CITY' | 'FORTRESS' | 'RESOURCE' | 'STRATEGIC' | 'NEUTRAL';

export interface MapPosition {
  x: number;
  y: number;
  region?: string;
}

export interface TerritoryResource {
  type: string;
  amount: number;
  regeneration: number;
  isRenewable: boolean;
}

export interface TerritoryBuilding {
  type: string;
  level: number;
  effects: BuildingEffect[];
  constructionTime: number;
  cost: ResourceCost[];
}

export interface BuildingEffect {
  type: EffectTarget;
  modification: EffectModification;
  value: number;
  scope: 'TERRITORY' | 'REGION' | 'GLOBAL';
}

export interface TerritoryFeature {
  type: FeatureType;
  name: string;
  effects: MechanicEffect[];
  description: string;
}

export type FeatureType = 
  | 'NATURAL_WONDER' | 'STRATEGIC_RESOURCE' | 'DEFENSIVE_POSITION'
  | 'TRADE_HUB' | 'RESEARCH_SITE' | 'CULTURAL_SITE' | 'HAZARD';

export interface Faction {
  id: string;
  name: string;
  description: string;
  color: string;
  leader: FactionLeader;
  bonuses: FactionBonus[];
  uniqueUnits: UniqueUnit[];
  uniqueBuildings: UniqueBuilding[];
  startingTechnologies: string[];
  diplomaticTraits: DiplomaticTrait[];
}

export interface FactionLeader {
  name: string;
  portrait: string;
  personality: LeaderPersonality;
  abilities: LeaderAbility[];
  diplomaticModifiers: DiplomaticModifier[];
}

export interface LeaderPersonality {
  aggression: number; // 0-100
  expansion: number;
  diplomacy: number;
  economy: number;
  military: number;
  culture: number;
}

export interface LeaderAbility {
  name: string;
  description: string;
  type: AbilityType;
  effects: MechanicEffect[];
  cooldown?: number;
  cost?: ResourceCost[];
}

export type AbilityType = 'PASSIVE' | 'ACTIVE' | 'TRIGGERED' | 'AURA' | 'ULTIMATE';

export interface FactionBonus {
  name: string;
  description: string;
  effects: MechanicEffect[];
  conditions?: BonusCondition[];
}

export interface BonusCondition {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface UniqueUnit {
  id: string;
  name: string;
  description: string;
  replaces?: string; // base unit it replaces
  stats: UnitStats;
  abilities: UnitAbility[];
  cost: ResourceCost[];
}

export interface UnitStats {
  health: number;
  attack: number;
  defense: number;
  movement: number;
  range?: number;
  upkeep: ResourceCost[];
}

export interface UnitAbility {
  name: string;
  description: string;
  type: UnitAbilityType;
  effects: MechanicEffect[];
  cooldown?: number;
  cost?: ResourceCost[];
}

export type UnitAbilityType = 'COMBAT' | 'MOVEMENT' | 'UTILITY' | 'SPECIAL' | 'PASSIVE';

export interface UniqueBuilding {
  id: string;
  name: string;
  description: string;
  replaces?: string; // base building it replaces
  effects: BuildingEffect[];
  cost: ResourceCost[];
  requirements: BuildingRequirement[];
}

export interface BuildingRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface DiplomaticTrait {
  name: string;
  description: string;
  effects: DiplomaticEffect[];
  conditions?: DiplomaticCondition[];
}

export interface DiplomaticEffect {
  target: DiplomaticTarget;
  modification: DiplomaticModification;
  value: number;
}

export type DiplomaticTarget = 'ALL_PLAYERS' | 'ALLIES' | 'ENEMIES' | 'NEUTRAL' | 'SPECIFIC_FACTION';

export interface DiplomaticModification {
  type: DiplomaticModificationType;
  operation: ModificationOperation;
}

export type DiplomaticModificationType = 
  | 'TRUST' | 'TRADE_EFFICIENCY' | 'ALLIANCE_COST' | 'WAR_WEARINESS'
  | 'NEGOTIATION_BONUS' | 'TRIBUTE_EFFICIENCY' | 'SPY_EFFECTIVENESS';

export interface DiplomaticCondition {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface DiplomaticModifier {
  target: string; // faction ID or 'ALL'
  type: DiplomaticModificationType;
  value: number;
  reason: string;
}

export interface CampaignMap {
  id: string;
  name: string;
  description: string;
  size: MapSize;
  territories: Territory[];
  connections: MapConnection[];
  regions: MapRegion[];
  specialRules: MapRule[];
}

export interface MapConnection {
  from: string; // territory ID
  to: string; // territory ID
  type: ConnectionType;
  cost: number; // movement cost
  requirements?: ConnectionRequirement[];
}

export type ConnectionType = 'LAND' | 'SEA' | 'AIR' | 'TUNNEL' | 'BRIDGE' | 'PORTAL';

export interface ConnectionRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface MapRegion {
  id: string;
  name: string;
  territories: string[];
  bonuses: RegionBonus[];
  specialRules: RegionRule[];
}

export interface RegionBonus {
  name: string;
  description: string;
  requirements: RegionRequirement[];
  effects: MechanicEffect[];
}

export interface RegionRequirement {
  type: 'CONTROL_PERCENTAGE' | 'CONTROL_COUNT' | 'BUILDING_COUNT' | 'UNIT_COUNT';
  value: number;
  operator: ComparisonOperator;
}

export interface RegionRule {
  name: string;
  description: string;
  effects: MechanicEffect[];
  conditions?: RuleCondition[];
}

export interface RuleCondition {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface MapRule {
  name: string;
  description: string;
  effects: MechanicEffect[];
  scope: 'GLOBAL' | 'REGIONAL' | 'TERRITORIAL';
  conditions?: RuleCondition[];
}

export interface DiplomacySystem {
  enabled: boolean;
  options: DiplomaticOption[];
  relationships: DiplomaticRelationship[];
  treaties: Treaty[];
  espionage: EspionageSystem;
}

export interface DiplomaticOption {
  type: DiplomaticActionType;
  name: string;
  description: string;
  requirements: DiplomaticRequirement[];
  effects: DiplomaticEffect[];
  cost?: ResourceCost[];
  duration?: number;
}

export type DiplomaticActionType = 
  | 'DECLARE_WAR' | 'MAKE_PEACE' | 'FORM_ALLIANCE' | 'BREAK_ALLIANCE'
  | 'TRADE_AGREEMENT' | 'NON_AGGRESSION_PACT' | 'TRIBUTE_DEMAND'
  | 'TECHNOLOGY_TRADE' | 'TERRITORY_TRADE' | 'JOINT_OPERATION';

export interface DiplomaticRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface DiplomaticRelationship {
  player1: string;
  player2: string;
  status: RelationshipStatus;
  trustLevel: number; // -100 to 100
  tradeLevel: number; // 0-100
  militaryAccess: boolean;
  sharedVision: boolean;
  history: DiplomaticEvent[];
}

export type RelationshipStatus = 'WAR' | 'HOSTILE' | 'NEUTRAL' | 'FRIENDLY' | 'ALLIED';

export interface DiplomaticEvent {
  type: DiplomaticActionType;
  timestamp: Date;
  description: string;
  trustChange: number;
}

export interface Treaty {
  id: string;
  name: string;
  type: TreatyType;
  participants: string[]; // player IDs
  terms: TreatyTerm[];
  duration: number; // turns, -1 for permanent
  signedDate: Date;
  isActive: boolean;
}

export type TreatyType = 
  | 'PEACE' | 'ALLIANCE' | 'TRADE' | 'NON_AGGRESSION' | 'MUTUAL_DEFENSE'
  | 'TECHNOLOGY_SHARING' | 'RESOURCE_SHARING' | 'JOINT_VICTORY';

export interface TreatyTerm {
  type: TreatyTermType;
  description: string;
  effects: MechanicEffect[];
  penalties: TreatyPenalty[];
}

export type TreatyTermType = 
  | 'CEASE_HOSTILITIES' | 'TRADE_BONUS' | 'MILITARY_ACCESS' | 'SHARED_VISION'
  | 'RESOURCE_TRIBUTE' | 'TECHNOLOGY_SHARING' | 'JOINT_RESEARCH'
  | 'MUTUAL_DEFENSE' | 'TERRITORY_GUARANTEE' | 'VICTORY_SHARING';

export interface TreatyPenalty {
  condition: string;
  effects: MechanicEffect[];
  description: string;
}

export interface EspionageSystem {
  enabled: boolean;
  spyUnits: SpyUnit[];
  missions: EspionageMission[];
  counterIntelligence: CounterIntelligence;
}

export interface SpyUnit {
  id: string;
  name: string;
  stats: SpyStats;
  abilities: SpyAbility[];
  cost: ResourceCost[];
  upkeep: ResourceCost[];
}

export interface SpyStats {
  stealth: number;
  infiltration: number;
  sabotage: number;
  intelligence: number;
  survival: number;
}

export interface SpyAbility {
  name: string;
  description: string;
  type: SpyAbilityType;
  successChance: number;
  cost?: ResourceCost[];
  cooldown?: number;
}

export type SpyAbilityType = 
  | 'RECONNAISSANCE' | 'SABOTAGE' | 'ASSASSINATION' | 'THEFT' | 'PROPAGANDA'
  | 'COUNTER_SPY' | 'INFILTRATION' | 'INFORMATION_GATHERING';

export interface EspionageMission {
  id: string;
  name: string;
  description: string;
  type: SpyAbilityType;
  target: EspionageTarget;
  requirements: EspionageRequirement[];
  successEffects: MechanicEffect[];
  failureEffects: MechanicEffect[];
  duration: number;
  cost: ResourceCost[];
}

export interface EspionageTarget {
  type: 'PLAYER' | 'TERRITORY' | 'BUILDING' | 'UNIT' | 'TECHNOLOGY';
  id: string;
}

export interface EspionageRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface CounterIntelligence {
  defenseLevel: number;
  detectionChance: number;
  counterMeasures: CounterMeasure[];
}

export interface CounterMeasure {
  name: string;
  description: string;
  effects: MechanicEffect[];
  cost: ResourceCost[];
}

// Hero Mode
export interface HeroGameMode extends GameMode {
  type: 'HERO';
  heroSettings: HeroSettings;
  heroes: Hero[];
  villains: Villain[];
  partySystem: PartySystem;
  questSystem: QuestSystem;
}

export interface HeroSettings {
  maxPartySize: number;
  heroRespawn: boolean;
  permaDeath: boolean;
  levelingSystem: HeroLevelingSystem;
  equipmentSystem: EquipmentSystem;
  skillTrees: SkillTree[];
}

export interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  level: number;
  experience: number;
  stats: HeroStats;
  skills: HeroSkill[];
  equipment: Equipment[];
  inventory: InventoryItem[];
  backstory: string;
  portrait: string;
  voiceLines: VoiceLine[];
}

export interface HeroClass {
  id: string;
  name: string;
  description: string;
  primaryAttribute: HeroAttribute;
  baseStats: HeroStats;
  skillTrees: string[]; // skill tree IDs
  startingEquipment: Equipment[];
  classAbilities: ClassAbility[];
}

export type HeroAttribute = 'STRENGTH' | 'AGILITY' | 'INTELLIGENCE' | 'WISDOM' | 'CHARISMA' | 'CONSTITUTION';

export interface HeroStats {
  health: number;
  mana: number;
  strength: number;
  agility: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  constitution: number;
  armor: number;
  magicResistance: number;
  speed: number;
  criticalChance: number;
  criticalDamage: number;
}

export interface HeroSkill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  level: number;
  maxLevel: number;
  effects: SkillEffect[];
  requirements: SkillRequirement[];
  cost: SkillCost;
}

export type SkillType = 
  | 'ACTIVE' | 'PASSIVE' | 'TOGGLE' | 'CHANNELED' | 'ULTIMATE'
  | 'COMBAT' | 'UTILITY' | 'SOCIAL' | 'CRAFTING' | 'MAGIC';

export interface SkillEffect {
  type: SkillEffectType;
  value: number;
  duration?: number;
  target: SkillTarget;
  scaling?: SkillScaling;
}

export type SkillEffectType = 
  | 'DAMAGE' | 'HEALING' | 'BUFF' | 'DEBUFF' | 'SUMMON' | 'TELEPORT'
  | 'SHIELD' | 'STEALTH' | 'STUN' | 'SLOW' | 'HASTE' | 'CHARM';

export type SkillTarget = 'SELF' | 'ALLY' | 'ENEMY' | 'ALL_ALLIES' | 'ALL_ENEMIES' | 'AREA' | 'TARGET';

export interface SkillScaling {
  attribute: HeroAttribute;
  ratio: number;
  bonusPerLevel?: number;
}

export interface SkillRequirement {
  type: 'LEVEL' | 'ATTRIBUTE' | 'SKILL' | 'EQUIPMENT' | 'QUEST';
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface SkillCost {
  mana?: number;
  health?: number;
  resources?: ResourceCost[];
  cooldown: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  slot: EquipmentSlot;
  rarity: RewardRarity;
  level: number;
  stats: EquipmentStats;
  effects: EquipmentEffect[];
  requirements: EquipmentRequirement[];
  durability: EquipmentDurability;
  enchantments: Enchantment[];
}

export type EquipmentType = 
  | 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE' | 'TOOL' | 'ARTIFACT';

export type EquipmentSlot = 
  | 'MAIN_HAND' | 'OFF_HAND' | 'HEAD' | 'CHEST' | 'LEGS' | 'FEET'
  | 'HANDS' | 'NECK' | 'RING' | 'TRINKET' | 'BACK' | 'WAIST';

export interface EquipmentStats {
  attack?: number;
  defense?: number;
  health?: number;
  mana?: number;
  strength?: number;
  agility?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  constitution?: number;
  criticalChance?: number;
  criticalDamage?: number;
  speed?: number;
  magicResistance?: number;
}

export interface EquipmentEffect {
  type: EffectType;
  value: number;
  duration?: number;
  trigger?: EffectTrigger;
  description: string;
}

export type EffectType = 
  | 'STAT_BONUS' | 'DAMAGE_BONUS' | 'RESISTANCE' | 'REGENERATION'
  | 'SKILL_ENHANCEMENT' | 'PROC_EFFECT' | 'AURA' | 'SPECIAL_ABILITY';

export interface EffectTrigger {
  event: TriggerEvent;
  chance: number;
  cooldown?: number;
}

export interface EquipmentRequirement {
  type: 'LEVEL' | 'ATTRIBUTE' | 'CLASS' | 'SKILL' | 'QUEST';
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface EquipmentDurability {
  current: number;
  maximum: number;
  repairCost?: ResourceCost[];
  breakEffects?: MechanicEffect[];
}

export interface Enchantment {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  effects: EquipmentEffect[];
  cost: EnchantmentCost;
}

export interface EnchantmentCost {
  resources: ResourceCost[];
  reagents: EnchantmentReagent[];
  skillRequired?: string;
  levelRequired?: number;
}

export interface EnchantmentReagent {
  id: string;
  name: string;
  quantity: number;
  rarity: RewardRarity;
}

export interface InventoryItem {
  equipment?: Equipment;
  quantity: number;
  isEquipped: boolean;
  customProperties?: Record<string, any>;
}

export interface VoiceLine {
  trigger: VoiceLineTrigger;
  text: string;
  audioFile?: string;
  probability: number;
}

export type VoiceLineTrigger = 
  | 'SPAWN' | 'DEATH' | 'LEVEL_UP' | 'SKILL_USE' | 'COMBAT_START'
  | 'COMBAT_WIN' | 'COMBAT_LOSS' | 'ITEM_FOUND' | 'QUEST_COMPLETE'
  | 'INTERACTION' | 'IDLE' | 'MOVEMENT' | 'CRITICAL_HIT';

export interface ClassAbility {
  name: string;
  description: string;
  type: AbilityType;
  effects: MechanicEffect[];
  levelRequired: number;
}

export interface Villain {
  id: string;
  name: string;
  title: string;
  description: string;
  level: number;
  stats: HeroStats;
  abilities: VillainAbility[];
  phases: VillainPhase[];
  loot: VillainLoot[];
  backstory: string;
  portrait: string;
  voiceLines: VoiceLine[];
}

export interface VillainAbility {
  name: string;
  description: string;
  type: VillainAbilityType;
  effects: SkillEffect[];
  cooldown: number;
  phases: number[]; // which phases this ability is available
  priority: number;
}

export type VillainAbilityType = 
  | 'BASIC_ATTACK' | 'SPECIAL_ATTACK' | 'ULTIMATE' | 'DEFENSIVE'
  | 'SUMMON' | 'ENVIRONMENTAL' | 'PHASE_TRANSITION' | 'ENRAGE';

export interface VillainPhase {
  phase: number;
  healthThreshold: number; // percentage
  newAbilities: string[]; // ability IDs
  removedAbilities: string[];
  statModifiers: StatModifier[];
  environmentChanges: EnvironmentChange[];
  description: string;
}

export interface StatModifier {
  stat: keyof HeroStats;
  operation: ModificationOperation;
  value: number;
}

export interface EnvironmentChange {
  type: EnvironmentChangeType;
  description: string;
  effects: MechanicEffect[];
  duration?: number;
}

export type EnvironmentChangeType = 
  | 'TERRAIN_CHANGE' | 'WEATHER_CHANGE' | 'HAZARD_SPAWN' | 'BUFF_ZONE'
  | 'DEBUFF_ZONE' | 'TELEPORTER' | 'BARRIER' | 'TRAP';

export interface VillainLoot {
  item: Equipment;
  dropChance: number;
  conditions?: LootCondition[];
}

export interface LootCondition {
  type: 'DIFFICULTY' | 'PARTY_SIZE' | 'TIME_LIMIT' | 'NO_DEATHS' | 'PERFECT_SCORE';
  value?: number;
  operator?: ComparisonOperator;
}

export interface PartySystem {
  maxSize: number;
  roles: PartyRole[];
  bonuses: PartyBonus[];
  formations: PartyFormation[];
  communication: PartyCommunication;
}

export interface PartyRole {
  name: string;
  description: string;
  recommendedClasses: string[];
  bonuses: RoleBonus[];
  responsibilities: string[];
}

export interface RoleBonus {
  type: string;
  value: number;
  conditions?: BonusCondition[];
}

export interface PartyBonus {
  name: string;
  description: string;
  requirements: PartyRequirement[];
  effects: MechanicEffect[];
}

export interface PartyRequirement {
  type: 'PARTY_SIZE' | 'ROLE_DIVERSITY' | 'LEVEL_RANGE' | 'CLASS_SYNERGY';
  value: number;
  operator: ComparisonOperator;
}

export interface PartyFormation {
  name: string;
  description: string;
  positions: FormationPosition[];
  bonuses: FormationBonus[];
}

export interface FormationPosition {
  role: string;
  x: number;
  y: number;
  bonuses: PositionBonus[];
}

export interface PositionBonus {
  type: string;
  value: number;
  description: string;
}

export interface FormationBonus {
  name: string;
  description: string;
  effects: MechanicEffect[];
  requirements?: FormationRequirement[];
}

export interface FormationRequirement {
  type: 'POSITION_FILLED' | 'ROLE_PRESENT' | 'MINIMUM_LEVEL';
  value: number;
  operator: ComparisonOperator;
}

export interface PartyCommunication {
  voiceChat: boolean;
  textChat: boolean;
  quickCommands: QuickCommand[];
  markers: CommunicationMarker[];
}

export interface QuickCommand {
  command: string;
  description: string;
  hotkey?: string;
  category: CommandCategory;
}

export type CommandCategory = 'COMBAT' | 'MOVEMENT' | 'STRATEGY' | 'SOCIAL' | 'UTILITY';

export interface CommunicationMarker {
  type: MarkerType;
  name: string;
  description: string;
  icon: string;
  duration?: number;
}

export type MarkerType = 
  | 'ATTACK' | 'DEFEND' | 'MOVE' | 'RETREAT' | 'DANGER' | 'LOOT'
  | 'OBJECTIVE' | 'WAYPOINT' | 'ENEMY' | 'ALLY' | 'NEUTRAL';

export interface QuestSystem {
  mainQuests: Quest[];
  sideQuests: Quest[];
  dailyQuests: Quest[];
  questChains: QuestChain[];
  questGivers: QuestGiver[];
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  level: number;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  prerequisites: QuestPrerequisite[];
  timeLimit?: number;
  isRepeatable: boolean;
  isShared: boolean; // party quest
  giver?: string; // quest giver ID
}

export type QuestType = 'MAIN' | 'SIDE' | 'DAILY' | 'WEEKLY' | 'SEASONAL' | 'CHAIN' | 'HIDDEN';

export type QuestCategory = 
  | 'COMBAT' | 'EXPLORATION' | 'COLLECTION' | 'DELIVERY' | 'ESCORT'
  | 'PUZZLE' | 'SOCIAL' | 'CRAFTING' | 'SURVIVAL' | 'INVESTIGATION';

export type QuestDifficulty = 'TRIVIAL' | 'EASY' | 'NORMAL' | 'HARD' | 'EPIC' | 'LEGENDARY';

export interface QuestObjective {
  id: string;
  description: string;
  type: QuestObjectiveType;
  target: string;
  currentProgress: number;
  requiredProgress: number;
  isOptional: boolean;
  isHidden: boolean;
  rewards?: QuestReward[];
}

export type QuestObjectiveType = 
  | 'KILL' | 'COLLECT' | 'DELIVER' | 'ESCORT' | 'REACH' | 'SURVIVE'
  | 'INTERACT' | 'CRAFT' | 'DISCOVER' | 'SOLVE' | 'PROTECT';

export interface QuestReward {
  type: QuestRewardType;
  value: number;
  item?: Equipment;
  description: string;
}

export type QuestRewardType = 
  | 'EXPERIENCE' | 'GOLD' | 'ITEM' | 'SKILL_POINT' | 'REPUTATION'
  | 'UNLOCK' | 'TITLE' | 'ACHIEVEMENT' | 'ACCESS';

export interface QuestPrerequisite {
  type: 'LEVEL' | 'QUEST' | 'ITEM' | 'SKILL' | 'REPUTATION' | 'CLASS';
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface QuestChain {
  id: string;
  name: string;
  description: string;
  quests: string[]; // quest IDs in order
  chainRewards: QuestReward[];
  isLinear: boolean;
}

export interface QuestGiver {
  id: string;
  name: string;
  description: string;
  location: string;
  quests: string[]; // available quest IDs
  dialogue: QuestDialogue[];
  portrait: string;
}

export interface QuestDialogue {
  trigger: DialogueTrigger;
  text: string;
  options?: DialogueOption[];
}

export type DialogueTrigger = 
  | 'FIRST_MEETING' | 'QUEST_AVAILABLE' | 'QUEST_IN_PROGRESS'
  | 'QUEST_COMPLETE' | 'NO_QUESTS' | 'RANDOM';

export interface DialogueOption {
  text: string;
  response: string;
  requirements?: DialogueRequirement[];
  effects?: DialogueEffect[];
}

export interface DialogueRequirement {
  type: RequirementType;
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface DialogueEffect {
  type: 'REPUTATION' | 'ITEM' | 'QUEST' | 'UNLOCK' | 'STAT';
  target: string;
  value: number;
  description: string;
}

export interface HeroLevelingSystem {
  maxLevel: number;
  experienceTable: number[]; // experience required for each level
  statGrowth: StatGrowth[];
  skillPointsPerLevel: number;
  attributePointsPerLevel: number;
}

export interface StatGrowth {
  stat: keyof HeroStats;
  baseGrowth: number;
  classModifier: Record<string, number>; // class ID -> modifier
}

export interface EquipmentSystem {
  slots: EquipmentSlot[];
  rarityColors: Record<RewardRarity, string>;
  durabilitySystem: boolean;
  enchantmentSystem: boolean;
  upgradeSystem: UpgradeSystem;
}

export interface UpgradeSystem {
  enabled: boolean;
  maxUpgradeLevel: number;
  upgradeCosts: UpgradeCost[];
  upgradeEffects: UpgradeEffect[];
}

export interface UpgradeCost {
  level: number;
  resources: ResourceCost[];
  reagents?: EnchantmentReagent[];
}

export interface UpgradeEffect {
  level: number;
  statMultiplier: number;
  newEffects?: EquipmentEffect[];
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  class: string; // hero class ID
  nodes: SkillNode[];
  connections: SkillConnection[];
}

export interface SkillNode {
  id: string;
  skill: HeroSkill;
  position: NodePosition;
  tier: number;
  maxRank: number;
  requirements: SkillNodeRequirement[];
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface SkillNodeRequirement {
  type: 'LEVEL' | 'SKILL_POINTS' | 'PREREQUISITE_SKILL' | 'ATTRIBUTE';
  target: string;
  value: number;
  operator: ComparisonOperator;
}

export interface SkillConnection {
  from: string; // skill node ID
  to: string; // skill node ID
  type: ConnectionType;
}

// ===== SHARED UTILITY TYPES =====

export interface ResourceCost {
  resource: string;
  amount: number;
}

export interface UnitRequirement {
  type: string;
  count: number;
  level?: number;
}

export interface GameModeSettings {
  difficulty: DifficultyLevel;
  timeLimit?: number;
  playerLimit?: number;
  customRules: CustomRule[];
  modifiers: GameModifier[];
}

export interface CustomRule {
  name: string;
  description: string;
  effects: MechanicEffect[];
  enabled: boolean;
}

export interface GameModifier {
  type: ModifierType;
  value: number;
  description: string;
  scope: ModifierScope;
}

export type ModifierType = 
  | 'RESOURCE_GENERATION' | 'UNIT_PRODUCTION' | 'RESEARCH_SPEED'
  | 'BUILDING_SPEED' | 'MOVEMENT_SPEED' | 'COMBAT_DAMAGE'
  | 'EXPERIENCE_GAIN' | 'SCORE_MULTIPLIER';

export type ModifierScope = 'GLOBAL' | 'PLAYER' | 'TEAM' | 'ENEMY';

export interface GameModeMetadata {
  version: string;
  author: string;
  createdDate: Date;
  lastModified: Date;
  tags: string[];
  popularity: number;
  rating: number;
  playCount: number;
  isOfficial: boolean;
  isRanked: boolean;
}

// ===== GAME SESSION TYPES =====

export interface GameSession {
  id: string;
  gameMode: GameMode;
  players: SessionPlayer[];
  status: SessionStatus;
  startTime: Date;
  endTime?: Date;
  currentTurn: number;
  maxTurns?: number;
  settings: SessionSettings;
  state: SessionState;
  events: SessionEvent[];
  statistics: SessionStatistics;
}

export type SessionStatus = 'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface SessionPlayer {
  playerId: string;
  playerName: string;
  faction?: Faction;
  hero?: Hero;
  team?: number;
  status: PlayerStatus;
  score: number;
  statistics: PlayerStatistics;
}

export type PlayerStatus = 'CONNECTED' | 'DISCONNECTED' | 'ELIMINATED' | 'VICTORIOUS' | 'SPECTATING';

export interface SessionSettings {
  gameMode: GameModeType;
  difficulty: DifficultyLevel;
  timeLimit?: number;
  turnTimeLimit?: number;
  allowSpectators: boolean;
  allowReconnection: boolean;
  pauseOnDisconnect: boolean;
  customRules: CustomRule[];
}

export interface SessionState {
  currentPhase: GamePhase;
  turnOrder: string[]; // player IDs
  activePlayer?: string;
  timeRemaining?: number;
  objectives: ObjectiveProgress[];
  globalModifiers: GameModifier[];
  environmentState: EnvironmentState;
}

export type GamePhase = 'SETUP' | 'MAIN_GAME' | 'ENDGAME' | 'VICTORY' | 'CLEANUP';

export interface ObjectiveProgress {
  objectiveId: string;
  playerId?: string; // null for shared objectives
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface EnvironmentState {
  weather?: WeatherCondition;
  timeOfDay?: TimeOfDay;
  season?: Season;
  specialConditions: EnvironmentCondition[];
}

export interface WeatherCondition {
  type: WeatherType;
  intensity: number;
  duration: number;
  effects: MechanicEffect[];
}

export type WeatherType = 'CLEAR' | 'RAIN' | 'STORM' | 'SNOW' | 'FOG' | 'EXTREME';

export type TimeOfDay = 'DAWN' | 'MORNING' | 'NOON' | 'AFTERNOON' | 'DUSK' | 'NIGHT';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

export interface EnvironmentCondition {
  type: EnvironmentChangeType;
  description: string;
  effects: MechanicEffect[];
  duration?: number;
  affectedAreas?: string[];
}

export interface SessionEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  playerId?: string;
  description: string;
  data: Record<string, any>;
}

export type EventType = 
  | 'GAME_START' | 'GAME_END' | 'PLAYER_JOIN' | 'PLAYER_LEAVE'
  | 'TURN_START' | 'TURN_END' | 'OBJECTIVE_COMPLETE' | 'VICTORY'
  | 'DEFEAT' | 'ALLIANCE_FORMED' | 'WAR_DECLARED' | 'TRADE_MADE'
  | 'BUILDING_BUILT' | 'UNIT_CREATED' | 'RESEARCH_COMPLETE'
  | 'HERO_LEVEL_UP' | 'ITEM_FOUND' | 'QUEST_COMPLETE' | 'ACHIEVEMENT_EARNED';

export interface SessionStatistics {
  totalPlayTime: number;
  totalTurns: number;
  averageTurnTime: number;
  objectivesCompleted: number;
  eventsTriggered: number;
  playersEliminated: number;
  winner?: string; // player ID
  victoryType?: VictoryType;
  finalScores: Record<string, number>; // player ID -> score
}

export interface PlayerStatistics {
  playTime: number;
  turnsPlayed: number;
  averageTurnTime: number;
  objectivesCompleted: number;
  unitsCreated: number;
  buildingsBuilt: number;
  resourcesGathered: Record<string, number>;
  combatWins: number;
  combatLosses: number;
  diplomacyActions: number;
  tradeDeals: number;
  researchCompleted: number;
  heroLevels?: number;
  questsCompleted?: number;
  achievementsEarned?: number;
  finalScore: number;
  finalRank: number;
}
