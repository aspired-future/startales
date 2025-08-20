import { GameMasterPersonality } from './ContentGenerator';
import { GalacticRace, Civilization, StarSystem, Planet } from './GalacticCivilizationGenerator';

export interface CivilizationLore {
  id: string;
  name: string;
  foundingStory: string;
  historicalEras: HistoricalEra[];
  culturalNarrative: CulturalNarrative;
  technologicalJourney: TechnologicalJourney;
  militaryTradition: MilitaryTradition;
  economicPhilosophy: EconomicPhilosophy;
  socialStructure: SocialStructureDetails;
  religiousBeliefs: ReligiousSystem;
  politicalEvolution: PoliticalEvolution;
  territorialHistory: TerritorialHistory;
  notableIndividuals: NotableIndividual[];
  culturalArtifacts: CulturalArtifact[];
  currentChallenges: Challenge[];
  futureAspirations: string[];
  relationshipNarratives: { [civId: string]: RelationshipNarrative };
}

export interface HistoricalEra {
  id: string;
  name: string;
  startYear: number; // Years ago
  endYear: number;
  description: string;
  keyEvents: HistoricalEvent[];
  culturalChanges: string[];
  technologicalAdvances: string[];
  politicalShifts: string[];
  majorFigures: string[];
  artifacts: string[];
  impact: 'TRANSFORMATIVE' | 'SIGNIFICANT' | 'MODERATE' | 'MINOR';
}

export interface HistoricalEvent {
  id: string;
  name: string;
  year: number; // Years ago
  type: 'WAR' | 'DISCOVERY' | 'REVOLUTION' | 'DISASTER' | 'FIRST_CONTACT' | 'TECHNOLOGICAL_BREAKTHROUGH' | 'CULTURAL_SHIFT' | 'POLITICAL_CHANGE';
  description: string;
  participants: string[];
  consequences: string[];
  culturalImpact: string;
  technologicalImpact?: string;
  politicalImpact?: string;
  economicImpact?: string;
  significance: 'LEGENDARY' | 'HISTORIC' | 'MAJOR' | 'NOTABLE' | 'MINOR';
}

export interface CulturalNarrative {
  coreValues: CoreValue[];
  culturalMyths: CulturalMyth[];
  traditions: Tradition[];
  artisticMovements: ArtisticMovement[];
  philosophicalSchools: PhilosophicalSchool[];
  socialNorms: SocialNorm[];
  taboos: CulturalTaboo[];
  celebrations: CulturalCelebration[];
  comingOfAgeRituals: string[];
  deathRituals: string[];
}

export interface CoreValue {
  name: string;
  description: string;
  manifestations: string[];
  historicalOrigin: string;
  modernInterpretation: string;
  conflicts: string[]; // Values this conflicts with
}

export interface CulturalMyth {
  name: string;
  type: 'CREATION' | 'HEROIC' | 'CAUTIONARY' | 'ORIGIN' | 'PROPHETIC';
  summary: string;
  moralLesson: string;
  culturalSignificance: string;
  modernRelevance: string;
  variants: string[];
}

export interface Tradition {
  name: string;
  type: 'RELIGIOUS' | 'SECULAR' | 'MILITARY' | 'ACADEMIC' | 'ARTISTIC' | 'SOCIAL';
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL' | 'ANNUAL' | 'GENERATIONAL';
  participants: 'ALL' | 'ADULTS' | 'CHILDREN' | 'ELDERS' | 'SPECIFIC_CASTE' | 'GENDER_SPECIFIC';
  modernAdaptations: string[];
}

export interface TechnologicalJourney {
  technologicalPhilosophy: string;
  innovationCulture: string;
  researchPriorities: string[];
  technologicalMilestones: TechnologicalMilestone[];
  currentProjects: ResearchProject[];
  technologicalChallenges: string[];
  ethicalFramework: TechnologicalEthics;
  knowledgeSharing: 'OPEN' | 'RESTRICTED' | 'SECRETIVE' | 'SELECTIVE';
}

export interface TechnologicalMilestone {
  name: string;
  year: number; // Years ago
  description: string;
  inventor: string;
  impact: string;
  consequences: string[];
  modernLegacy: string;
}

export interface ResearchProject {
  name: string;
  field: string;
  description: string;
  progress: number; // 0-100%
  expectedCompletion: number; // Years from now
  leadResearcher: string;
  funding: 'GOVERNMENT' | 'PRIVATE' | 'MILITARY' | 'ACADEMIC' | 'INTERNATIONAL';
  secrecyLevel: 'PUBLIC' | 'CLASSIFIED' | 'TOP_SECRET';
}

export interface TechnologicalEthics {
  aiRights: 'FULL_RIGHTS' | 'LIMITED_RIGHTS' | 'NO_RIGHTS' | 'UNDEFINED';
  geneticModification: 'ENCOURAGED' | 'REGULATED' | 'FORBIDDEN' | 'UNRESTRICTED';
  weaponsDevelopment: 'PACIFIST' | 'DEFENSIVE_ONLY' | 'REGULATED' | 'UNRESTRICTED';
  environmentalProtection: 'PRIORITY' | 'BALANCED' | 'SECONDARY' | 'IGNORED';
  privacyRights: 'ABSOLUTE' | 'STRONG' | 'MODERATE' | 'MINIMAL';
}

export interface MilitaryTradition {
  militaryPhilosophy: string;
  combatDoctrine: 'DEFENSIVE' | 'OFFENSIVE' | 'BALANCED' | 'GUERRILLA' | 'TECHNOLOGICAL' | 'OVERWHELMING_FORCE';
  honorCode: string;
  militaryStructure: MilitaryStructure;
  eliteUnits: EliteUnit[];
  militaryHistory: MilitaryConflict[];
  veteranTreatment: string;
  civilianRelations: 'INTEGRATED' | 'SEPARATE' | 'REVERED' | 'FEARED' | 'NEUTRAL';
  recruitmentMethod: 'VOLUNTEER' | 'CONSCRIPTION' | 'HEREDITARY' | 'MERIT_BASED' | 'CASTE_BASED';
}

export interface MilitaryStructure {
  commandStructure: 'HIERARCHICAL' | 'DECENTRALIZED' | 'DEMOCRATIC' | 'TECHNOCRATIC';
  ranks: MilitaryRank[];
  specializations: string[];
  trainingDuration: number; // in years
  retirementAge: number;
}

export interface MilitaryRank {
  name: string;
  level: number;
  responsibilities: string[];
  requirements: string[];
  insignia: string;
}

export interface EliteUnit {
  name: string;
  specialization: string;
  size: number;
  selectionCriteria: string[];
  trainingDescription: string;
  notableOperations: string[];
  reputation: string;
}

export interface MilitaryConflict {
  name: string;
  year: number; // Years ago
  type: 'CIVIL_WAR' | 'EXTERNAL_WAR' | 'REBELLION' | 'BORDER_CONFLICT' | 'COLONIAL_WAR' | 'LIBERATION_WAR';
  opponents: string[];
  cause: string;
  outcome: 'VICTORY' | 'DEFEAT' | 'STALEMATE' | 'PYRRHIC_VICTORY';
  casualties: number;
  consequences: string[];
  lessonsLearned: string[];
  memorialization: string;
}

export interface EconomicPhilosophy {
  economicSystem: 'CAPITALIST' | 'SOCIALIST' | 'MIXED' | 'COMMAND' | 'GIFT' | 'POST_SCARCITY' | 'RESOURCE_BASED';
  tradePhilosophy: string;
  resourceManagement: string;
  wealthDistribution: 'EQUAL' | 'MERIT_BASED' | 'HIERARCHICAL' | 'RANDOM' | 'NEED_BASED';
  currencySystem: CurrencySystem;
  majorIndustries: Industry[];
  tradeRelations: { [civId: string]: TradeRelation };
  economicChallenges: string[];
  futureEconomicGoals: string[];
}

export interface CurrencySystem {
  type: 'PHYSICAL' | 'DIGITAL' | 'ENERGY_BASED' | 'TIME_BASED' | 'REPUTATION_BASED' | 'RESOURCE_BACKED';
  name: string;
  description: string;
  stability: 'STABLE' | 'VOLATILE' | 'HYPERINFLATION' | 'DEFLATIONARY';
  exchangeRates: { [civId: string]: number };
}

export interface Industry {
  name: string;
  type: 'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'QUATERNARY';
  description: string;
  employmentPercentage: number;
  technologicalLevel: number; // 1-10
  globalCompetitiveness: 'DOMINANT' | 'COMPETITIVE' | 'AVERAGE' | 'STRUGGLING';
  environmentalImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'DEVASTATING';
  futureProspects: string;
}

export interface TradeRelation {
  civilizationId: string;
  relationshipType: 'PARTNER' | 'COMPETITOR' | 'DEPENDENT' | 'DOMINANT' | 'NEUTRAL';
  tradeVolume: number;
  primaryExports: string[];
  primaryImports: string[];
  tradeBalance: number; // Positive = surplus, negative = deficit
  tradeAgreements: string[];
  disputes: string[];
}

export interface SocialStructureDetails {
  classSystem: ClassSystem;
  socialMobility: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  educationSystem: EducationSystem;
  familyStructure: FamilyStructure;
  genderRoles: GenderRoles;
  ageRespect: 'YOUTH_FOCUSED' | 'ELDER_REVERENCE' | 'BALANCED' | 'MERIT_BASED';
  socialSafetyNet: string;
  criminalJustice: CriminalJusticeSystem;
}

export interface ClassSystem {
  type: 'CLASSLESS' | 'CASTE' | 'MERIT_BASED' | 'WEALTH_BASED' | 'HEREDITARY' | 'PROFESSIONAL';
  classes: SocialClass[];
  mobilityMechanisms: string[];
  classConflicts: string[];
}

export interface SocialClass {
  name: string;
  percentage: number;
  description: string;
  privileges: string[];
  responsibilities: string[];
  typicalOccupations: string[];
  lifestyle: string;
}

export interface EducationSystem {
  philosophy: string;
  structure: 'CENTRALIZED' | 'DECENTRALIZED' | 'MIXED' | 'PRIVATE' | 'GUILD_BASED';
  accessibility: 'UNIVERSAL' | 'MERIT_BASED' | 'WEALTH_BASED' | 'CASTE_BASED';
  curriculum: string[];
  specializations: string[];
  higherEducation: string;
  researchFocus: string[];
}

export interface FamilyStructure {
  type: 'NUCLEAR' | 'EXTENDED' | 'COMMUNAL' | 'CLAN_BASED' | 'CHOSEN_FAMILY';
  averageSize: number;
  parentingStyle: string;
  elderCare: string;
  inheritance: 'EQUAL' | 'PRIMOGENITURE' | 'MERIT_BASED' | 'COMMUNAL';
  marriageCustoms: string[];
}

export interface GenderRoles {
  system: 'EGALITARIAN' | 'TRADITIONAL' | 'MATRIARCHAL' | 'PATRIARCHAL' | 'FLUID' | 'MULTIPLE_GENDERS';
  workplaceEquality: 'EQUAL' | 'MOSTLY_EQUAL' | 'SOME_DISPARITY' | 'SIGNIFICANT_DISPARITY';
  politicalParticipation: 'EQUAL' | 'MOSTLY_EQUAL' | 'LIMITED' | 'EXCLUDED';
  socialExpectations: string[];
}

export interface CriminalJusticeSystem {
  philosophy: 'REHABILITATIVE' | 'PUNITIVE' | 'RESTORATIVE' | 'PREVENTIVE';
  lawEnforcement: string;
  courtSystem: string;
  punishments: string[];
  criminalRights: string[];
  recidivismRate: number; // percentage
}

export interface ReligiousSystem {
  type: 'MONOTHEISTIC' | 'POLYTHEISTIC' | 'PANTHEISTIC' | 'ATHEISTIC' | 'SPIRITUAL' | 'ANCESTOR_WORSHIP' | 'NATURE_WORSHIP';
  dominantReligion?: Religion;
  religiousDiversity: Religion[];
  secularism: 'THEOCRATIC' | 'RELIGIOUS_INFLUENCE' | 'SEPARATED' | 'SECULAR' | 'ANTI_RELIGIOUS';
  religiousFreedom: 'FULL' | 'LIMITED' | 'RESTRICTED' | 'NONE';
  religiousConflicts: string[];
}

export interface Religion {
  name: string;
  type: 'MONOTHEISTIC' | 'POLYTHEISTIC' | 'PANTHEISTIC' | 'SPIRITUAL' | 'PHILOSOPHICAL';
  adherents: number; // percentage of population
  coreBeliefs: string[];
  practices: string[];
  clergy: string;
  holyTexts: string[];
  places_of_worship: string;
  afterlifeBeliefs: string;
  moralCode: string[];
}

export interface PoliticalEvolution {
  governmentHistory: GovernmentPeriod[];
  politicalPhilosophy: string;
  currentChallenges: PoliticalChallenge[];
  reformMovements: ReformMovement[];
  politicalParties: PoliticalParty[];
  electionSystem?: ElectionSystem;
  politicalRights: string[];
  civilLiberties: string[];
}

export interface GovernmentPeriod {
  name: string;
  type: 'DEMOCRACY' | 'REPUBLIC' | 'MONARCHY' | 'THEOCRACY' | 'CORPORATE' | 'MILITARY' | 'ANARCHIST' | 'HIVE_MIND' | 'AI_CONTROLLED' | 'TRIBAL';
  startYear: number; // Years ago
  endYear?: number; // undefined if current
  description: string;
  keyLeaders: string[];
  majorPolicies: string[];
  achievements: string[];
  failures: string[];
  endReason?: string;
}

export interface PoliticalChallenge {
  name: string;
  type: 'CORRUPTION' | 'INEQUALITY' | 'SEPARATISM' | 'EXTERNAL_PRESSURE' | 'ECONOMIC' | 'ENVIRONMENTAL' | 'TECHNOLOGICAL';
  description: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  affectedRegions: string[];
  proposedSolutions: string[];
  publicOpinion: number; // -100 to 100
}

export interface ReformMovement {
  name: string;
  goals: string[];
  methods: 'PEACEFUL' | 'CIVIL_DISOBEDIENCE' | 'POLITICAL' | 'REVOLUTIONARY';
  support: number; // percentage of population
  leadership: string;
  opposition: string[];
  progress: 'NASCENT' | 'GROWING' | 'MAINSTREAM' | 'SUCCESSFUL' | 'FAILED';
}

export interface PoliticalParty {
  name: string;
  ideology: string;
  support: number; // percentage
  leadership: string;
  keyPolicies: string[];
  voterBase: string;
  history: string;
  allies: string[];
  opponents: string[];
}

export interface ElectionSystem {
  type: 'DIRECT_DEMOCRACY' | 'REPRESENTATIVE' | 'PARLIAMENTARY' | 'PRESIDENTIAL' | 'MIXED';
  frequency: number; // years between elections
  eligibility: string;
  votingMethod: string;
  campaignRules: string[];
  recentResults: ElectionResult[];
}

export interface ElectionResult {
  year: number; // years ago
  winner: string;
  margin: number; // percentage
  turnout: number; // percentage
  keyIssues: string[];
  surprises: string[];
}

export interface TerritorialHistory {
  originalTerritory: TerritorialClaim[];
  expansionHistory: TerritorialExpansion[];
  currentTerritory: TerritorialClaim[];
  territorialDisputes: TerritorialDispute[];
  colonialHistory?: ColonialHistory;
  territorialGoals: string[];
}

export interface TerritorialClaim {
  systemId: string;
  planetIds: string[];
  claimType: 'SOVEREIGN' | 'COLONIAL' | 'PROTECTORATE' | 'OCCUPIED' | 'DISPUTED';
  claimDate: number; // years ago
  population: number;
  strategicValue: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  resources: string[];
}

export interface TerritorialExpansion {
  name: string;
  year: number; // years ago
  method: 'CONQUEST' | 'COLONIZATION' | 'PURCHASE' | 'TREATY' | 'INHERITANCE' | 'DISCOVERY';
  territory: string[];
  cost: string; // human, economic, political
  benefits: string[];
  consequences: string[];
}

export interface TerritorialDispute {
  name: string;
  disputedTerritory: string[];
  disputants: string[];
  claimBasis: string[];
  currentStatus: 'ACTIVE' | 'FROZEN' | 'NEGOTIATING' | 'RESOLVED';
  internationalPosition: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface ColonialHistory {
  colonialPeriod: {
    startYear: number;
    endYear?: number;
    colonizer: string;
    colonialSystem: string;
    resistance: string[];
    independence: string;
  };
  postColonialChallenges: string[];
  decolonizationProcess: string;
  currentRelationshipWithFormerColonizer: string;
}

export interface NotableIndividual {
  id: string;
  name: string;
  titles: string[];
  birthYear: number; // years ago
  deathYear?: number; // years ago, undefined if alive
  race: string;
  profession: string;
  achievements: string[];
  personality: IndividualPersonality;
  background: IndividualBackground;
  motivations: string[];
  relationships: { [individualId: string]: RelationshipType };
  currentStatus: 'ALIVE' | 'DECEASED' | 'MISSING' | 'RETIRED' | 'EXILED';
  publicReputation: number; // -100 to 100
  historicalSignificance: 'LEGENDARY' | 'HISTORIC' | 'NOTABLE' | 'MINOR';
  personalQuirks: string[];
  fears: string[];
  ambitions: string[];
  secrets: string[];
}

export interface IndividualPersonality {
  traits: PersonalityTrait[];
  values: string[];
  flaws: string[];
  strengths: string[];
  communicationStyle: 'DIRECT' | 'DIPLOMATIC' | 'AGGRESSIVE' | 'PASSIVE' | 'MANIPULATIVE' | 'INSPIRING';
  decisionMaking: 'ANALYTICAL' | 'INTUITIVE' | 'COLLABORATIVE' | 'AUTHORITARIAN' | 'IMPULSIVE';
  stressResponse: 'CALM' | 'AGGRESSIVE' | 'WITHDRAWN' | 'HYPERACTIVE' | 'STRATEGIC';
  socialPreference: 'EXTROVERTED' | 'INTROVERTED' | 'AMBIVERT' | 'SELECTIVE';
}

export interface PersonalityTrait {
  name: string;
  strength: number; // 1-10
  description: string;
  manifestations: string[];
}

export interface IndividualBackground {
  birthPlace: string;
  socialClass: string;
  education: string[];
  earlyLife: string;
  careerPath: string[];
  majorEvents: string[];
  formativeExperiences: string[];
  mentors: string[];
  rivals: string[];
  family: FamilyBackground;
}

export interface FamilyBackground {
  parents: string[];
  siblings: string[];
  spouse?: string;
  children: string[];
  familyStatus: string;
  familyInfluence: 'SUPPORTIVE' | 'NEUTRAL' | 'OBSTRUCTIVE' | 'ABSENT';
  familyReputation: string;
}

export interface RelationshipType {
  type: 'ALLY' | 'RIVAL' | 'MENTOR' | 'STUDENT' | 'FRIEND' | 'ENEMY' | 'NEUTRAL' | 'ROMANTIC' | 'FAMILY';
  strength: number; // 1-10
  history: string;
  currentStatus: string;
}

export interface CulturalArtifact {
  name: string;
  type: 'LITERATURE' | 'ART' | 'MUSIC' | 'ARCHITECTURE' | 'TECHNOLOGY' | 'PHILOSOPHY' | 'SCIENCE';
  creator: string;
  creationYear: number; // years ago
  description: string;
  culturalSignificance: string;
  influence: string[];
  currentLocation: string;
  condition: 'PRISTINE' | 'GOOD' | 'DETERIORATING' | 'FRAGMENTS' | 'LOST';
  accessibility: 'PUBLIC' | 'RESTRICTED' | 'PRIVATE' | 'CLASSIFIED';
}

export interface Challenge {
  name: string;
  type: 'ENVIRONMENTAL' | 'ECONOMIC' | 'POLITICAL' | 'SOCIAL' | 'TECHNOLOGICAL' | 'MILITARY' | 'CULTURAL';
  description: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'EXISTENTIAL';
  timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  affectedPopulation: number; // percentage
  proposedSolutions: string[];
  resourceRequirements: string[];
  politicalWill: number; // 1-10
  publicAwareness: number; // 1-10
}

export interface RelationshipNarrative {
  civilizationId: string;
  relationshipType: 'ALLIED' | 'FRIENDLY' | 'NEUTRAL' | 'TENSE' | 'HOSTILE' | 'WAR';
  historicalContext: string;
  keyEvents: string[];
  currentIssues: string[];
  futureProspects: string;
  publicOpinion: number; // -100 to 100
  diplomaticHistory: DiplomaticEvent[];
  tradeHistory: string;
  culturalExchange: string;
  militaryHistory: string;
}

export interface DiplomaticEvent {
  name: string;
  year: number; // years ago
  type: 'TREATY' | 'ALLIANCE' | 'TRADE_AGREEMENT' | 'CONFLICT' | 'NEGOTIATION' | 'SUMMIT';
  description: string;
  outcome: string;
  impact: string;
}

export interface ArtisticMovement {
  name: string;
  period: { start: number; end?: number }; // years ago
  description: string;
  keyFigures: string[];
  characteristics: string[];
  influence: string;
  examples: string[];
}

export interface PhilosophicalSchool {
  name: string;
  founder: string;
  foundingYear: number; // years ago
  coreBeliefs: string[];
  influence: string;
  modernRelevance: string;
  keyTexts: string[];
  followers: number; // percentage of population
}

export interface SocialNorm {
  name: string;
  description: string;
  enforcement: 'LEGAL' | 'SOCIAL' | 'RELIGIOUS' | 'TRADITIONAL';
  violations: string[];
  consequences: string[];
  evolution: string;
}

export interface CulturalTaboo {
  name: string;
  description: string;
  origin: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'ABSOLUTE';
  consequences: string[];
  exceptions: string[];
  modernRelevance: string;
}

export interface CulturalCelebration {
  name: string;
  type: 'RELIGIOUS' | 'SECULAR' | 'HISTORICAL' | 'SEASONAL' | 'PERSONAL';
  frequency: 'ANNUAL' | 'SEASONAL' | 'MONTHLY' | 'IRREGULAR';
  duration: string;
  activities: string[];
  significance: string;
  participation: number; // percentage of population
  evolution: string;
}

export class CivilizationLoreGenerator {
  private personality: GameMasterPersonality;
  private civilizationLore: Map<string, CivilizationLore>;

  constructor(personality: GameMasterPersonality) {
    this.personality = personality;
    this.civilizationLore = new Map();
  }

  async generateCivilizationLore(civilization: Civilization, race: GalacticRace, territory: StarSystem[]): Promise<CivilizationLore> {
    console.log(`📚 Generating comprehensive lore for ${civilization.name}...`);

    const lore: CivilizationLore = {
      id: civilization.id,
      name: civilization.name,
      foundingStory: await this.generateFoundingStory(civilization, race),
      historicalEras: await this.generateHistoricalEras(civilization, race),
      culturalNarrative: await this.generateCulturalNarrative(civilization, race),
      technologicalJourney: await this.generateTechnologicalJourney(civilization, race),
      militaryTradition: await this.generateMilitaryTradition(civilization, race),
      economicPhilosophy: await this.generateEconomicPhilosophy(civilization, race),
      socialStructure: await this.generateSocialStructure(civilization, race),
      religiousBeliefs: await this.generateReligiousSystem(civilization, race),
      politicalEvolution: await this.generatePoliticalEvolution(civilization, race),
      territorialHistory: await this.generateTerritorialHistory(civilization, territory),
      notableIndividuals: await this.generateNotableIndividuals(civilization, race, 20),
      culturalArtifacts: await this.generateCulturalArtifacts(civilization, race),
      currentChallenges: await this.generateCurrentChallenges(civilization, race),
      futureAspirations: await this.generateFutureAspirations(civilization, race),
      relationshipNarratives: {}
    };

    this.civilizationLore.set(civilization.id, lore);
    return lore;
  }

  private async generateFoundingStory(civilization: Civilization, race: GalacticRace): Promise<string> {
    const foundingTypes = [
      'EXODUS', 'REVOLUTION', 'UNIFICATION', 'DISCOVERY', 'SURVIVAL', 'ENLIGHTENMENT', 'CONQUEST', 'LIBERATION'
    ];
    
    const foundingType = this.randomChoice(foundingTypes);
    
    const templates = {
      'EXODUS': `The ${civilization.name} was born from the Great Exodus of ${this.randomBetween(500, 2000)} years ago, when the ${race.name} fled their dying homeworld of ${this.generatePlanetName()}. Led by the visionary ${this.generateLeaderName(race)}, they journeyed across the void in generation ships, carrying with them the sacred ${this.generateArtifactName()} that would become the foundation of their new society.`,
      
      'REVOLUTION': `Born in the fires of revolution ${this.randomBetween(300, 1500)} years ago, the ${civilization.name} emerged when the ${race.name} overthrew the tyrannical ${this.generateOppressorName()} regime. The revolutionary leader ${this.generateLeaderName(race)} united the scattered resistance cells under the banner of ${this.generateIdeology()}, establishing a new order based on ${race.culturalTraits.values.slice(0, 2).join(' and ')}.`,
      
      'UNIFICATION': `The ${civilization.name} was forged through the Great Unification ${this.randomBetween(400, 1800)} years ago, when ${this.generateLeaderName(race)} successfully united the warring ${race.name} clans under a single banner. The legendary Treaty of ${this.generateLocationName()} ended centuries of conflict and established the principles of ${this.generateGovernmentPrinciple()} that still guide the civilization today.`,
      
      'DISCOVERY': `The ${civilization.name} traces its origins to the Discovery of ${this.generateDiscoveryName()} ${this.randomBetween(600, 2500)} years ago. When the ${race.name} explorer ${this.generateLeaderName(race)} uncovered this ancient ${this.generateArtifactType()}, it revolutionized their understanding of ${this.generateKnowledgeArea()} and sparked the cultural renaissance that would transform scattered tribes into a unified civilization.`,
      
      'SURVIVAL': `Forged in the crucible of the Great ${this.generateDisasterName()} ${this.randomBetween(800, 3000)} years ago, the ${civilization.name} emerged when the surviving ${race.name} communities banded together for mutual survival. Under the leadership of ${this.generateLeaderName(race)}, they developed the ${this.generateSurvivalTechnology()} that not only ensured their survival but became the cornerstone of their technological advancement.`,
      
      'ENLIGHTENMENT': `The ${civilization.name} was born during the Age of Enlightenment ${this.randomBetween(400, 1200)} years ago, when the philosopher-leader ${this.generateLeaderName(race)} introduced the revolutionary concept of ${this.generatePhilosophicalConcept()}. This intellectual awakening transformed ${race.name} society from primitive tribalism into a sophisticated civilization dedicated to ${race.culturalTraits.philosophy} and the pursuit of ${this.generatePursuitGoal()}.`,
      
      'CONQUEST': `The ${civilization.name} rose to power through the Great Conquest ${this.randomBetween(500, 2000)} years ago, when the military genius ${this.generateLeaderName(race)} united the ${race.name} under a single banner and expanded their territory across ${this.randomBetween(5, 20)} star systems. What began as military expansion evolved into a sophisticated empire that balanced conquest with ${this.generateBalancingPrinciple()}.`,
      
      'LIBERATION': `The ${civilization.name} was established following the Liberation Wars ${this.randomBetween(300, 1000)} years ago, when the ${race.name} threw off the yoke of their ${this.generateOppressorRace()} overlords. The freedom fighter ${this.generateLeaderName(race)} led a guerrilla campaign that lasted ${this.randomBetween(10, 50)} years, ultimately establishing a new society based on the hard-won principles of ${this.generateLiberationPrinciple()}.`
    };

    return templates[foundingType as keyof typeof templates];
  }

  private async generateHistoricalEras(civilization: Civilization, race: GalacticRace): Promise<HistoricalEra[]> {
    const eras: HistoricalEra[] = [];
    const eraCount = this.randomBetween(4, 8);
    let currentYear = this.randomBetween(3000, 5000); // Civilization age

    for (let i = 0; i < eraCount; i++) {
      const eraDuration = this.randomBetween(200, 800);
      const era = await this.generateSingleEra(civilization, race, currentYear, currentYear - eraDuration, i);
      eras.push(era);
      currentYear -= eraDuration;
    }

    return eras.reverse(); // Chronological order
  }

  private async generateSingleEra(civilization: Civilization, race: GalacticRace, startYear: number, endYear: number, eraIndex: number): Promise<HistoricalEra> {
    const eraTypes = [
      'FOUNDING', 'EXPANSION', 'GOLDEN_AGE', 'CRISIS', 'RENAISSANCE', 'DECLINE', 'REFORMATION', 'MODERN'
    ];
    
    const eraType = eraIndex === 0 ? 'FOUNDING' : this.randomChoice(eraTypes);
    
    const eraNames = {
      'FOUNDING': ['Foundation Era', 'Age of Origins', 'Genesis Period', 'First Era'],
      'EXPANSION': ['Age of Expansion', 'Colonial Period', 'Great Expansion', 'Outward Era'],
      'GOLDEN_AGE': ['Golden Age', 'Classical Period', 'Age of Prosperity', 'Great Flowering'],
      'CRISIS': ['Time of Troubles', 'Crisis Era', 'Dark Period', 'Age of Strife'],
      'RENAISSANCE': ['Renaissance', 'Age of Renewal', 'Cultural Revival', 'New Dawn'],
      'DECLINE': ['Decline Period', 'Twilight Era', 'Age of Decay', 'Fading Years'],
      'REFORMATION': ['Reformation Era', 'Age of Change', 'Revolutionary Period', 'Transformation'],
      'MODERN': ['Modern Era', 'Contemporary Period', 'Current Age', 'New Millennium']
    };

    const name = this.randomChoice(eraNames[eraType as keyof typeof eraNames]);
    const keyEvents = await this.generateEraEvents(civilization, race, eraType, 3, 6);

    return {
      id: `era_${eraIndex}`,
      name,
      startYear,
      endYear,
      description: await this.generateEraDescription(eraType, civilization, race),
      keyEvents,
      culturalChanges: await this.generateCulturalChanges(eraType, race),
      technologicalAdvances: await this.generateTechnologicalAdvances(eraType, race),
      politicalShifts: await this.generatePoliticalShifts(eraType, civilization),
      majorFigures: await this.generateMajorFigures(eraType, race, 2, 4),
      artifacts: await this.generateEraArtifacts(eraType, race),
      impact: this.determineEraImpact(eraType)
    };
  }

  private async generateNotableIndividuals(civilization: Civilization, race: GalacticRace, count: number): Promise<NotableIndividual[]> {
    const individuals: NotableIndividual[] = [];
    
    const professions = [
      'Political Leader', 'Military Commander', 'Scientist', 'Philosopher', 'Artist', 'Explorer',
      'Religious Leader', 'Inventor', 'Diplomat', 'Revolutionary', 'Scholar', 'Merchant',
      'Architect', 'Healer', 'Engineer', 'Spy', 'Judge', 'Teacher'
    ];

    for (let i = 0; i < count; i++) {
      const individual = await this.generateSingleIndividual(civilization, race, this.randomChoice(professions));
      individuals.push(individual);
    }

    return individuals;
  }

  private async generateSingleIndividual(civilization: Civilization, race: GalacticRace, profession: string): Promise<NotableIndividual> {
    const name = this.generateCharacterName(race);
    const birthYear = this.randomBetween(10, 500); // Years ago
    const isAlive = birthYear < race.physicalTraits.averageLifespan && Math.random() > 0.3;
    
    const personality = await this.generateIndividualPersonality(race);
    const background = await this.generateIndividualBackground(civilization, race, profession);
    
    return {
      id: `individual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      titles: await this.generateTitles(profession, race),
      birthYear,
      deathYear: isAlive ? undefined : this.randomBetween(1, birthYear - 20),
      race: race.id,
      profession,
      achievements: await this.generateAchievements(profession, race),
      personality,
      background,
      motivations: await this.generateMotivations(personality, profession),
      relationships: {},
      currentStatus: isAlive ? 'ALIVE' : 'DECEASED',
      publicReputation: this.randomBetween(-50, 100),
      historicalSignificance: this.determineHistoricalSignificance(profession, birthYear),
      personalQuirks: await this.generatePersonalQuirks(race),
      fears: await this.generateFears(personality),
      ambitions: await this.generateAmbitions(personality, profession),
      secrets: await this.generateSecrets(profession, personality)
    };
  }

  private async generateIndividualPersonality(race: GalacticRace): Promise<IndividualPersonality> {
    const traits = await this.generatePersonalityTraits(race);
    
    return {
      traits,
      values: this.randomChoices(race.culturalTraits.values, 2, 4),
      flaws: await this.generatePersonalityFlaws(),
      strengths: await this.generatePersonalityStrengths(),
      communicationStyle: this.randomChoice(['DIRECT', 'DIPLOMATIC', 'AGGRESSIVE', 'PASSIVE', 'MANIPULATIVE', 'INSPIRING']),
      decisionMaking: this.randomChoice(['ANALYTICAL', 'INTUITIVE', 'COLLABORATIVE', 'AUTHORITARIAN', 'IMPULSIVE']),
      stressResponse: this.randomChoice(['CALM', 'AGGRESSIVE', 'WITHDRAWN', 'HYPERACTIVE', 'STRATEGIC']),
      socialPreference: this.randomChoice(['EXTROVERTED', 'INTROVERTED', 'AMBIVERT', 'SELECTIVE'])
    };
  }

  // Utility methods for name generation
  private generateLeaderName(race: GalacticRace): string {
    const firstName = this.randomChoice(race.namePatterns.personalNames);
    const title = this.randomChoice(race.namePatterns.titles);
    return `${title} ${firstName}`;
  }

  private generateCharacterName(race: GalacticRace): string {
    const firstName = this.randomChoice(race.namePatterns.personalNames);
    const lastName = this.randomChoice(race.namePatterns.familyNames);
    return `${firstName} ${lastName}`;
  }

  private generatePlanetName(): string {
    const prefixes = ['Keth', 'Zar', 'Vel', 'Mor', 'Lux', 'Nex', 'Vor', 'Quin'];
    const suffixes = ['aris', 'heim', 'thar', 'dor', 'lex', 'mar', 'ton', 'ius'];
    return this.randomChoice(prefixes) + this.randomChoice(suffixes);
  }

  private generateLocationName(): string {
    const adjectives = ['Ancient', 'Sacred', 'Golden', 'Crystal', 'Eternal', 'Mystic', 'Noble', 'Grand'];
    const nouns = ['Halls', 'Spires', 'Gardens', 'Citadel', 'Temple', 'Academy', 'Palace', 'Sanctuary'];
    return `${this.randomChoice(adjectives)} ${this.randomChoice(nouns)}`;
  }

  // Additional utility methods would continue here...
  // This is a comprehensive system that would need many more methods to be complete

  // Public API methods
  getCivilizationLore(civilizationId: string): CivilizationLore | null {
    return this.civilizationLore.get(civilizationId) || null;
  }

  getAllCivilizationLore(): CivilizationLore[] {
    return Array.from(this.civilizationLore.values());
  }

  getNotableIndividual(individualId: string): NotableIndividual | null {
    for (const lore of this.civilizationLore.values()) {
      const individual = lore.notableIndividuals.find(ind => ind.id === individualId);
      if (individual) return individual;
    }
    return null;
  }

  // Utility methods
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomChoices<T>(array: T[], min: number, max: number): T[] {
    const count = this.randomBetween(min, max);
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Placeholder methods for complex generation - would need full implementation
  private async generateEraDescription(eraType: string, civilization: Civilization, race: GalacticRace): Promise<string> {
    return `A significant period in ${civilization.name} history characterized by ${eraType.toLowerCase().replace('_', ' ')}.`;
  }

  private async generateCulturalChanges(eraType: string, race: GalacticRace): Promise<string[]> {
    return [`Cultural shift toward ${race.culturalTraits.values[0]}`, `Evolution of ${race.culturalTraits.artForms[0]} traditions`];
  }

  private async generateTechnologicalAdvances(eraType: string, race: GalacticRace): Promise<string[]> {
    return [`Advancement in ${Object.keys(race.technologicalLevel.specializations)[0]}`, `Development of ${race.technologicalLevel.uniqueTechnologies[0] || 'new technologies'}`];
  }

  private async generatePoliticalShifts(eraType: string, civilization: Civilization): Promise<string[]> {
    return [`Shift toward ${civilization.government.type.toLowerCase().replace('_', ' ')} governance`, 'Constitutional reforms'];
  }

  private async generateMajorFigures(eraType: string, race: GalacticRace, min: number, max: number): Promise<string[]> {
    const count = this.randomBetween(min, max);
    const figures: string[] = [];
    for (let i = 0; i < count; i++) {
      figures.push(this.generateLeaderName(race));
    }
    return figures;
  }

  private async generateEraArtifacts(eraType: string, race: GalacticRace): Promise<string[]> {
    return [`The ${this.generateArtifactName()}`, `Ancient ${race.culturalTraits.artForms[0]} masterpiece`];
  }

  private determineEraImpact(eraType: string): HistoricalEra['impact'] {
    const impacts = { 'FOUNDING': 'TRANSFORMATIVE', 'GOLDEN_AGE': 'TRANSFORMATIVE', 'CRISIS': 'SIGNIFICANT', 'RENAISSANCE': 'SIGNIFICANT' };
    return (impacts as any)[eraType] || 'MODERATE';
  }

  private generateArtifactName(): string {
    const adjectives = ['Sacred', 'Ancient', 'Eternal', 'Mystic', 'Golden', 'Crystal'];
    const nouns = ['Codex', 'Relic', 'Crown', 'Scepter', 'Orb', 'Tome', 'Blade', 'Shield'];
    return `${this.randomChoice(adjectives)} ${this.randomChoice(nouns)}`;
  }

  private generateOppressorName(): string {
    const prefixes = ['Dark', 'Iron', 'Shadow', 'Crimson', 'Void', 'Tyrant'];
    const suffixes = ['Empire', 'Dominion', 'Hegemony', 'Regime', 'Order', 'Syndicate'];
    return `${this.randomChoice(prefixes)} ${this.randomChoice(suffixes)}`;
  }

  private generateIdeology(): string {
    const ideologies = ['Unity', 'Freedom', 'Progress', 'Harmony', 'Justice', 'Enlightenment', 'Liberation', 'Equality'];
    return this.randomChoice(ideologies);
  }

  private generateGovernmentPrinciple(): string {
    const principles = ['democratic representation', 'meritocratic leadership', 'collective decision-making', 'constitutional monarchy', 'technocratic governance'];
    return this.randomChoice(principles);
  }

  private generateDiscoveryName(): string {
    const discoveries = ['the Quantum Resonance', 'the Cosmic Codex', 'the Stellar Archives', 'the Void Crystals', 'the Time Fragments'];
    return this.randomChoice(discoveries);
  }

  private generateArtifactType(): string {
    const types = ['repository', 'device', 'structure', 'manuscript', 'technology', 'phenomenon'];
    return this.randomChoice(types);
  }

  private generateKnowledgeArea(): string {
    const areas = ['quantum mechanics', 'consciousness', 'spacetime', 'energy manipulation', 'biological enhancement', 'dimensional theory'];
    return this.randomChoice(areas);
  }

  private generateDisasterName(): string {
    const disasters = ['Stellar Collapse', 'Quantum Storm', 'Plague Years', 'Void Incursion', 'Temporal Rift', 'Solar Flare Crisis'];
    return this.randomChoice(disasters);
  }

  private generateSurvivalTechnology(): string {
    const technologies = ['bio-domes', 'quantum shields', 'stellar engines', 'consciousness transfer', 'dimensional gates', 'time dilation fields'];
    return this.randomChoice(technologies);
  }

  private generatePhilosophicalConcept(): string {
    const concepts = ['Universal Consciousness', 'Quantum Ethics', 'Stellar Harmony', 'Dimensional Balance', 'Cosmic Unity', 'Temporal Wisdom'];
    return this.randomChoice(concepts);
  }

  private generatePursuitGoal(): string {
    const goals = ['universal knowledge', 'cosmic harmony', 'technological transcendence', 'spiritual enlightenment', 'galactic unity'];
    return this.randomChoice(goals);
  }

  private generateBalancingPrinciple(): string {
    const principles = ['cultural preservation', 'technological advancement', 'diplomatic integration', 'economic cooperation', 'scientific exchange'];
    return this.randomChoice(principles);
  }

  private generateOppressorRace(): string {
    const races = ['Hegemonic', 'Imperial', 'Dominion', 'Overlord', 'Tyrannical', 'Supremacist'];
    return `${this.randomChoice(races)} forces`;
  }

  private generateLiberationPrinciple(): string {
    const principles = ['self-determination', 'collective freedom', 'democratic governance', 'cultural autonomy', 'economic independence'];
    return this.randomChoice(principles);
  }

  // More placeholder methods would continue...
  private async generateEraEvents(civilization: Civilization, race: GalacticRace, eraType: string, min: number, max: number): Promise<HistoricalEvent[]> {
    // Placeholder implementation
    return [];
  }

  private async generateCulturalNarrative(civilization: Civilization, race: GalacticRace): Promise<CulturalNarrative> {
    // Placeholder implementation
    return {} as CulturalNarrative;
  }

  private async generateTechnologicalJourney(civilization: Civilization, race: GalacticRace): Promise<TechnologicalJourney> {
    // Placeholder implementation
    return {} as TechnologicalJourney;
  }

  private async generateMilitaryTradition(civilization: Civilization, race: GalacticRace): Promise<MilitaryTradition> {
    // Placeholder implementation
    return {} as MilitaryTradition;
  }

  private async generateEconomicPhilosophy(civilization: Civilization, race: GalacticRace): Promise<EconomicPhilosophy> {
    // Placeholder implementation
    return {} as EconomicPhilosophy;
  }

  private async generateSocialStructure(civilization: Civilization, race: GalacticRace): Promise<SocialStructureDetails> {
    // Placeholder implementation
    return {} as SocialStructureDetails;
  }

  private async generateReligiousSystem(civilization: Civilization, race: GalacticRace): Promise<ReligiousSystem> {
    // Placeholder implementation
    return {} as ReligiousSystem;
  }

  private async generatePoliticalEvolution(civilization: Civilization, race: GalacticRace): Promise<PoliticalEvolution> {
    // Placeholder implementation
    return {} as PoliticalEvolution;
  }

  private async generateTerritorialHistory(civilization: Civilization, territory: StarSystem[]): Promise<TerritorialHistory> {
    // Placeholder implementation
    return {} as TerritorialHistory;
  }

  private async generateCulturalArtifacts(civilization: Civilization, race: GalacticRace): Promise<CulturalArtifact[]> {
    // Placeholder implementation
    return [];
  }

  private async generateCurrentChallenges(civilization: Civilization, race: GalacticRace): Promise<Challenge[]> {
    // Placeholder implementation
    return [];
  }

  private async generateFutureAspirations(civilization: Civilization, race: GalacticRace): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateIndividualBackground(civilization: Civilization, race: GalacticRace, profession: string): Promise<IndividualBackground> {
    // Placeholder implementation
    return {} as IndividualBackground;
  }

  private async generateTitles(profession: string, race: GalacticRace): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateAchievements(profession: string, race: GalacticRace): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateMotivations(personality: IndividualPersonality, profession: string): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private determineHistoricalSignificance(profession: string, birthYear: number): NotableIndividual['historicalSignificance'] {
    // Placeholder implementation
    return 'NOTABLE';
  }

  private async generatePersonalQuirks(race: GalacticRace): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateFears(personality: IndividualPersonality): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateAmbitions(personality: IndividualPersonality, profession: string): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generateSecrets(profession: string, personality: IndividualPersonality): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generatePersonalityTraits(race: GalacticRace): Promise<PersonalityTrait[]> {
    // Placeholder implementation
    return [];
  }

  private async generatePersonalityFlaws(): Promise<string[]> {
    // Placeholder implementation
    return [];
  }

  private async generatePersonalityStrengths(): Promise<string[]> {
    // Placeholder implementation
    return [];
  }
}

export default CivilizationLoreGenerator;
