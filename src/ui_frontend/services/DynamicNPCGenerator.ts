import { PlayerProfile } from './PlayerInteractionService';
import { GameMasterPersonality } from './ContentGenerator';

export interface NPCGenerationConfig {
  totalPopulation: number;
  locationDistribution: LocationPopulation[];
  typeDistribution: NPCTypeDistribution;
  personalityVariance: number;
  economicFactors: EconomicFactors;
  culturalFactors: CulturalFactors;
}

export interface LocationPopulation {
  systemId: string;
  systemName: string;
  planets: PlanetPopulation[];
  totalPopulation: number;
  economicLevel: number; // 1-10
  militaryPresence: number; // 1-10
  scientificLevel: number; // 1-10
  culturalDiversity: number; // 1-10
}

export interface PlanetPopulation {
  planetId: string;
  planetName: string;
  cities: CityPopulation[];
  totalPopulation: number;
  planetType: 'CORE_WORLD' | 'COLONY' | 'FRONTIER' | 'INDUSTRIAL' | 'RESEARCH' | 'MILITARY' | 'AGRICULTURAL';
  developmentLevel: number; // 1-10
  coordinates: { x: number; y: number; z: number };
}

export interface CityPopulation {
  cityId: string;
  cityName: string;
  population: number;
  cityType: 'CAPITAL' | 'INDUSTRIAL' | 'RESEARCH' | 'MILITARY' | 'TRADE' | 'RESIDENTIAL' | 'MINING' | 'AGRICULTURAL';
  specializations: string[];
  coordinates?: { x: number; y: number };
}

export interface NPCTypeDistribution {
  CITIZEN: number; // 85%
  PERSONALITY: number; // 5%
  CITY_LEADER: number; // 3%
  PLANET_LEADER: number; // 1%
  DIVISION_LEADER: number; // 2%
  BUSINESS_LEADER: number; // 2%
  SCIENTIST: number; // 1.5%
  ARTIST: number; // 0.5%
}

export interface EconomicFactors {
  tradeRoutes: TradeRoute[];
  economicCenters: string[]; // System IDs
  resourceDistribution: ResourceDistribution[];
}

export interface TradeRoute {
  fromSystem: string;
  toSystem: string;
  volume: number;
  primaryGoods: string[];
}

export interface ResourceDistribution {
  systemId: string;
  resources: { [resource: string]: number };
}

export interface CulturalFactors {
  languages: LanguageDistribution[];
  religions: ReligionDistribution[];
  culturalMovements: CulturalMovement[];
}

export interface LanguageDistribution {
  language: string;
  speakers: number;
  regions: string[]; // System IDs
}

export interface ReligionDistribution {
  religion: string;
  followers: number;
  regions: string[]; // System IDs
}

export interface CulturalMovement {
  name: string;
  description: string;
  popularity: number;
  regions: string[];
  startDate: Date;
}

export interface NPCTemplate {
  namePatterns: NamePattern[];
  personalityArchetypes: PersonalityArchetype[];
  backgroundTemplates: BackgroundTemplate[];
  achievementPools: AchievementPool[];
}

export interface NamePattern {
  culture: string;
  firstNames: string[];
  lastNames: string[];
  titles: string[];
  suffixes: string[];
}

export interface PersonalityArchetype {
  name: string;
  description: string;
  traits: {
    humor: [number, number]; // min, max range
    aggression: [number, number];
    cooperation: [number, number];
    ambition: [number, number];
    curiosity: [number, number];
  };
  commonProfessions: string[];
  typicalLocations: string[];
}

export interface BackgroundTemplate {
  profession: string;
  description: string;
  requiredTraits: { [trait: string]: number };
  commonLocations: string[];
  achievementCategories: string[];
  reputationWeights: {
    military: number;
    economic: number;
    diplomatic: number;
    scientific: number;
    cultural: number;
  };
}

export interface AchievementPool {
  category: 'MILITARY' | 'ECONOMIC' | 'DIPLOMATIC' | 'SCIENTIFIC' | 'CULTURAL' | 'EXPLORATION';
  achievements: AchievementTemplate[];
}

export interface AchievementTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  requirements: {
    minReputation?: number;
    requiredLocation?: string;
    requiredProfession?: string;
    requiredTraits?: { [trait: string]: number };
  };
  variables: string[]; // Variables to fill in templates
}

export class DynamicNPCGenerator {
  private config: NPCGenerationConfig;
  private templates: NPCTemplate;
  private generatedNPCs: Map<string, PlayerProfile>;
  private npcCounter: number;
  private personality: GameMasterPersonality;
  private lastGenerationTime: Date;
  private generationQueue: NPCGenerationRequest[];

  constructor(personality: GameMasterPersonality, config?: Partial<NPCGenerationConfig>) {
    this.personality = personality;
    this.generatedNPCs = new Map();
    this.npcCounter = 0;
    this.lastGenerationTime = new Date();
    this.generationQueue = [];
    
    this.config = this.createDefaultConfig(config);
    this.templates = this.createDefaultTemplates();
    
    // Start background generation
    this.startBackgroundGeneration();
  }

  private createDefaultConfig(override?: Partial<NPCGenerationConfig>): NPCGenerationConfig {
    const defaultConfig: NPCGenerationConfig = {
      totalPopulation: 50000, // Start with 50k NPCs
      locationDistribution: [
        {
          systemId: 'sol',
          systemName: 'Sol System',
          totalPopulation: 15000,
          economicLevel: 9,
          militaryPresence: 8,
          scientificLevel: 9,
          culturalDiversity: 10,
          planets: [
            {
              planetId: 'earth',
              planetName: 'Earth',
              totalPopulation: 8000,
              planetType: 'CORE_WORLD',
              developmentLevel: 10,
              coordinates: { x: 0, y: 0, z: 0 },
              cities: [
                { cityId: 'new_geneva', cityName: 'New Geneva', population: 2000, cityType: 'CAPITAL', specializations: ['Government', 'Diplomacy'] },
                { cityId: 'neo_tokyo', cityName: 'Neo Tokyo', population: 1500, cityType: 'INDUSTRIAL', specializations: ['Manufacturing', 'Technology'] },
                { cityId: 'new_york_orbital', cityName: 'New York Orbital', population: 1200, cityType: 'TRADE', specializations: ['Finance', 'Commerce'] },
                { cityId: 'london_underground', cityName: 'London Underground', population: 800, cityType: 'RESEARCH', specializations: ['Science', 'Education'] },
                { cityId: 'sydney_dome', cityName: 'Sydney Dome', population: 1000, cityType: 'RESIDENTIAL', specializations: ['Culture', 'Entertainment'] },
                { cityId: 'cairo_spaceport', cityName: 'Cairo Spaceport', population: 900, cityType: 'TRADE', specializations: ['Transportation', 'Logistics'] },
                { cityId: 'mumbai_vertical', cityName: 'Mumbai Vertical', population: 600, cityType: 'RESIDENTIAL', specializations: ['Housing', 'Services'] }
              ]
            },
            {
              planetId: 'mars',
              planetName: 'Mars',
              totalPopulation: 4500,
              planetType: 'COLONY',
              developmentLevel: 8,
              coordinates: { x: 1.5, y: 0, z: 0 },
              cities: [
                { cityId: 'new_olympia', cityName: 'New Olympia', population: 1800, cityType: 'CAPITAL', specializations: ['Government', 'Terraforming'] },
                { cityId: 'olympus_base', cityName: 'Olympus Base', population: 1200, cityType: 'INDUSTRIAL', specializations: ['Mining', 'Manufacturing'] },
                { cityId: 'valles_research', cityName: 'Valles Research', population: 800, cityType: 'RESEARCH', specializations: ['Terraforming', 'Biology'] },
                { cityId: 'polar_station', cityName: 'Polar Station', population: 700, cityType: 'MINING', specializations: ['Ice Mining', 'Water Processing'] }
              ]
            },
            {
              planetId: 'europa',
              planetName: 'Europa',
              totalPopulation: 2500,
              planetType: 'RESEARCH',
              developmentLevel: 7,
              coordinates: { x: 5.2, y: 0, z: 0 },
              cities: [
                { cityId: 'deep_station', cityName: 'Deep Station', population: 1200, cityType: 'RESEARCH', specializations: ['Marine Biology', 'Astrobiology'] },
                { cityId: 'ice_harbor', cityName: 'Ice Harbor', population: 800, cityType: 'INDUSTRIAL', specializations: ['Water Extraction', 'Life Support'] },
                { cityId: 'europa_observatory', cityName: 'Europa Observatory', population: 500, cityType: 'RESEARCH', specializations: ['Astronomy', 'Communications'] }
              ]
            }
          ]
        },
        {
          systemId: 'alpha_centauri',
          systemName: 'Alpha Centauri',
          totalPopulation: 12000,
          economicLevel: 7,
          militaryPresence: 9,
          scientificLevel: 6,
          culturalDiversity: 6,
          planets: [
            {
              planetId: 'proxima_b',
              planetName: 'Proxima b',
              totalPopulation: 8000,
              planetType: 'MILITARY',
              developmentLevel: 8,
              coordinates: { x: 4.2, y: 0.1, z: -0.3 },
              cities: [
                { cityId: 'fort_stellar', cityName: 'Fort Stellar', population: 3000, cityType: 'MILITARY', specializations: ['Fleet Command', 'Defense'] },
                { cityId: 'proxima_port', cityName: 'Proxima Port', population: 2500, cityType: 'TRADE', specializations: ['Logistics', 'Supply'] },
                { cityId: 'centauri_colony', cityName: 'Centauri Colony', population: 1500, cityType: 'RESIDENTIAL', specializations: ['Housing', 'Agriculture'] },
                { cityId: 'stellar_academy', cityName: 'Stellar Academy', population: 1000, cityType: 'RESEARCH', specializations: ['Military Training', 'Strategy'] }
              ]
            },
            {
              planetId: 'centauri_prime',
              planetName: 'Centauri Prime',
              totalPopulation: 4000,
              planetType: 'COLONY',
              developmentLevel: 6,
              coordinates: { x: 4.3, y: 0.2, z: -0.1 },
              cities: [
                { cityId: 'alpha_city', cityName: 'Alpha City', population: 2000, cityType: 'CAPITAL', specializations: ['Government', 'Administration'] },
                { cityId: 'mining_complex_7', cityName: 'Mining Complex 7', population: 1200, cityType: 'MINING', specializations: ['Rare Metals', 'Processing'] },
                { cityId: 'frontier_outpost', cityName: 'Frontier Outpost', population: 800, cityType: 'MILITARY', specializations: ['Border Security', 'Patrol'] }
              ]
            }
          ]
        },
        {
          systemId: 'vega',
          systemName: 'Vega System',
          totalPopulation: 8000,
          economicLevel: 6,
          militaryPresence: 4,
          scientificLevel: 10,
          culturalDiversity: 8,
          planets: [
            {
              planetId: 'vega_prime',
              planetName: 'Vega Prime',
              totalPopulation: 6000,
              planetType: 'RESEARCH',
              developmentLevel: 9,
              coordinates: { x: 25.3, y: 12.1, z: 8.7 },
              cities: [
                { cityId: 'research_complex_alpha', cityName: 'Research Complex Alpha', population: 2500, cityType: 'RESEARCH', specializations: ['Quantum Physics', 'Advanced Mathematics'] },
                { cityId: 'university_city', cityName: 'University City', population: 2000, cityType: 'RESEARCH', specializations: ['Education', 'Theory'] },
                { cityId: 'innovation_hub', cityName: 'Innovation Hub', population: 1000, cityType: 'RESEARCH', specializations: ['Applied Science', 'Technology'] },
                { cityId: 'vega_observatory', cityName: 'Vega Observatory', population: 500, cityType: 'RESEARCH', specializations: ['Astronomy', 'Deep Space'] }
              ]
            },
            {
              planetId: 'vega_secondary',
              planetName: 'Vega Secondary',
              totalPopulation: 2000,
              planetType: 'INDUSTRIAL',
              developmentLevel: 7,
              coordinates: { x: 25.8, y: 12.3, z: 8.9 },
              cities: [
                { cityId: 'manufacturing_district', cityName: 'Manufacturing District', population: 1200, cityType: 'INDUSTRIAL', specializations: ['Scientific Equipment', 'Precision Manufacturing'] },
                { cityId: 'support_station', cityName: 'Support Station', population: 800, cityType: 'RESIDENTIAL', specializations: ['Worker Housing', 'Services'] }
              ]
            }
          ]
        },
        {
          systemId: 'kepler',
          systemName: 'Kepler System',
          totalPopulation: 6000,
          economicLevel: 5,
          militaryPresence: 6,
          scientificLevel: 7,
          culturalDiversity: 7,
          planets: [
            {
              planetId: 'kepler_442b',
              planetName: 'Kepler-442b',
              totalPopulation: 4500,
              planetType: 'COLONY',
              developmentLevel: 6,
              coordinates: { x: 1200, y: 0, z: 0 },
              cities: [
                { cityId: 'new_geneva_kepler', cityName: 'New Geneva', population: 2000, cityType: 'CAPITAL', specializations: ['Colonial Administration', 'Development'] },
                { cityId: 'kepler_farms', cityName: 'Kepler Farms', population: 1500, cityType: 'AGRICULTURAL', specializations: ['Food Production', 'Hydroponics'] },
                { cityId: 'frontier_base', cityName: 'Frontier Base', population: 1000, cityType: 'MILITARY', specializations: ['Defense', 'Exploration'] }
              ]
            },
            {
              planetId: 'kepler_moon_1',
              planetName: 'Kepler Moon 1',
              totalPopulation: 1500,
              planetType: 'MINING',
              developmentLevel: 5,
              coordinates: { x: 1201, y: 0.5, z: 0 },
              cities: [
                { cityId: 'lunar_mining', cityName: 'Lunar Mining', population: 1000, cityType: 'MINING', specializations: ['Mineral Extraction', 'Processing'] },
                { cityId: 'orbital_dock', cityName: 'Orbital Dock', population: 500, cityType: 'TRADE', specializations: ['Shipping', 'Storage'] }
              ]
            }
          ]
        },
        {
          systemId: 'sirius',
          systemName: 'Sirius System',
          totalPopulation: 9000,
          economicLevel: 10,
          militaryPresence: 5,
          scientificLevel: 7,
          culturalDiversity: 9,
          planets: [
            {
              planetId: 'sirius_station',
              planetName: 'Sirius Station',
              totalPopulation: 7000,
              planetType: 'INDUSTRIAL',
              developmentLevel: 9,
              coordinates: { x: 8.6, y: -1.2, z: 5.1 },
              cities: [
                { cityId: 'trade_hub_central', cityName: 'Trade Hub Central', population: 3000, cityType: 'TRADE', specializations: ['Galactic Commerce', 'Banking'] },
                { cityId: 'manufacturing_ring', cityName: 'Manufacturing Ring', population: 2000, cityType: 'INDUSTRIAL', specializations: ['Starship Construction', 'Heavy Industry'] },
                { cityId: 'merchant_quarter', cityName: 'Merchant Quarter', population: 1500, cityType: 'TRADE', specializations: ['Retail', 'Services'] },
                { cityId: 'financial_district', cityName: 'Financial District', population: 500, cityType: 'TRADE', specializations: ['Banking', 'Investment'] }
              ]
            },
            {
              planetId: 'sirius_b_platform',
              planetName: 'Sirius B Platform',
              totalPopulation: 2000,
              planetType: 'RESEARCH',
              developmentLevel: 8,
              coordinates: { x: 8.8, y: -1.4, z: 5.3 },
              cities: [
                { cityId: 'stellar_observatory', cityName: 'Stellar Observatory', population: 1200, cityType: 'RESEARCH', specializations: ['Stellar Physics', 'Energy Research'] },
                { cityId: 'energy_lab', cityName: 'Energy Lab', population: 800, cityType: 'RESEARCH', specializations: ['Fusion Technology', 'Power Systems'] }
              ]
            }
          ]
        }
      ],
      typeDistribution: {
        CITIZEN: 0.85,
        PERSONALITY: 0.05,
        CITY_LEADER: 0.03,
        PLANET_LEADER: 0.01,
        DIVISION_LEADER: 0.02,
        BUSINESS_LEADER: 0.02,
        SCIENTIST: 0.015,
        ARTIST: 0.005
      },
      personalityVariance: 0.3,
      economicFactors: {
        tradeRoutes: [
          { fromSystem: 'sol', toSystem: 'alpha_centauri', volume: 1000, primaryGoods: ['Technology', 'Manufactured Goods'] },
          { fromSystem: 'alpha_centauri', toSystem: 'sol', volume: 800, primaryGoods: ['Raw Materials', 'Military Equipment'] },
          { fromSystem: 'sirius', toSystem: 'sol', volume: 1200, primaryGoods: ['Luxury Goods', 'Financial Services'] },
          { fromSystem: 'vega', toSystem: 'sol', volume: 600, primaryGoods: ['Scientific Equipment', 'Research Data'] },
          { fromSystem: 'kepler', toSystem: 'sirius', volume: 400, primaryGoods: ['Agricultural Products', 'Minerals'] }
        ],
        economicCenters: ['sol', 'sirius', 'alpha_centauri'],
        resourceDistribution: [
          { systemId: 'sol', resources: { 'technology': 10, 'culture': 10, 'education': 10 } },
          { systemId: 'alpha_centauri', resources: { 'military': 10, 'raw_materials': 8 } },
          { systemId: 'vega', resources: { 'science': 10, 'research': 10 } },
          { systemId: 'sirius', resources: { 'trade': 10, 'manufacturing': 9, 'finance': 10 } },
          { systemId: 'kepler', resources: { 'agriculture': 8, 'minerals': 7 } }
        ]
      },
      culturalFactors: {
        languages: [
          { language: 'Galactic Standard', speakers: 45000, regions: ['sol', 'alpha_centauri', 'vega', 'kepler', 'sirius'] },
          { language: 'Sol Dialect', speakers: 15000, regions: ['sol'] },
          { language: 'Centauri Military Code', speakers: 8000, regions: ['alpha_centauri'] },
          { language: 'Vegan Academic', speakers: 6000, regions: ['vega'] },
          { language: 'Trader Pidgin', speakers: 12000, regions: ['sirius', 'kepler'] }
        ],
        religions: [
          { religion: 'Cosmic Unity', followers: 20000, regions: ['sol', 'vega'] },
          { religion: 'Stellar Ascension', followers: 15000, regions: ['alpha_centauri', 'kepler'] },
          { religion: 'Trade Prosperity', followers: 8000, regions: ['sirius'] },
          { religion: 'Scientific Rationalism', followers: 7000, regions: ['vega', 'sol'] }
        ],
        culturalMovements: [
          { name: 'Neo-Terran Renaissance', description: 'Revival of Earth classical culture', popularity: 8000, regions: ['sol'], startDate: new Date('2024-01-01') },
          { name: 'Frontier Independence', description: 'Colonial self-determination movement', popularity: 6000, regions: ['kepler', 'alpha_centauri'], startDate: new Date('2024-02-15') },
          { name: 'Galactic Minimalism', description: 'Simplified living philosophy', popularity: 4000, regions: ['vega'], startDate: new Date('2024-03-01') }
        ]
      }
    };

    return { ...defaultConfig, ...override };
  }

  private createDefaultTemplates(): NPCTemplate {
    return {
      namePatterns: [
        {
          culture: 'Terran',
          firstNames: ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Phoenix', 'Nova', 'Zara', 'Kai', 'Luna', 'Orion', 'Stella', 'Atlas', 'Iris', 'Juno', 'Vega'],
          lastNames: ['Stardust', 'Voidwalker', 'Starweaver', 'Nebula', 'Cosmos', 'Galaxy', 'Stellar', 'Quantum', 'Flux', 'Prism', 'Echo', 'Drift', 'Spark', 'Blaze', 'Storm', 'Wave', 'Frost', 'Dawn', 'Dusk', 'Horizon'],
          titles: ['Captain', 'Doctor', 'Professor', 'Engineer', 'Specialist', 'Coordinator', 'Director', 'Manager', 'Supervisor', 'Technician'],
          suffixes: ['Jr.', 'Sr.', 'III', 'PhD', 'MD', 'MSc', 'BSc', 'MA', 'BA']
        },
        {
          culture: 'Centauri',
          firstNames: ['Zephyr', 'Titan', 'Vortex', 'Cipher', 'Nexus', 'Vector', 'Matrix', 'Vertex', 'Apex', 'Zenith', 'Axiom', 'Praxis', 'Helix', 'Cortex', 'Reflex', 'Syntax', 'Logic', 'Binary', 'Quantum', 'Photon'],
          lastNames: ['Voidstrike', 'Starforge', 'Ironwill', 'Steelcore', 'Battleborn', 'Warhawk', 'Stormfront', 'Thunderbolt', 'Lightbringer', 'Shadowbane', 'Flameguard', 'Frostbite', 'Windshear', 'Earthshaker', 'Voidcrusher', 'Starbreaker', 'Doomhammer', 'Soulfire', 'Mindforge', 'Heartstone'],
          titles: ['Commander', 'General', 'Admiral', 'Colonel', 'Major', 'Lieutenant', 'Sergeant', 'Corporal', 'Private', 'Cadet'],
          suffixes: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Prime', 'Secondary', 'Tertiary']
        },
        {
          culture: 'Vegan',
          firstNames: ['Sage', 'Wisdom', 'Logic', 'Reason', 'Theory', 'Hypothesis', 'Axiom', 'Theorem', 'Proof', 'Analysis', 'Synthesis', 'Catalyst', 'Element', 'Compound', 'Molecule', 'Atom', 'Particle', 'Wave', 'Field', 'Force'],
          lastNames: ['Quantumsage', 'Mindweaver', 'Thoughtforge', 'Brainwave', 'Neuralnet', 'Synaptic', 'Cognitive', 'Cerebral', 'Intellect', 'Genius', 'Scholar', 'Academic', 'Researcher', 'Scientist', 'Philosopher', 'Theorist', 'Analyst', 'Synthesist', 'Logician', 'Rationalist'],
          titles: ['Dr.', 'Prof.', 'Researcher', 'Scientist', 'Analyst', 'Theorist', 'Scholar', 'Academic', 'Fellow', 'Associate'],
          suffixes: ['PhD', 'DSc', 'MSc', 'BSc', 'MA', 'BA', 'Fellow', 'Emeritus']
        },
        {
          culture: 'Sirian',
          firstNames: ['Trade', 'Commerce', 'Market', 'Profit', 'Wealth', 'Fortune', 'Success', 'Prosperity', 'Abundance', 'Luxury', 'Premium', 'Elite', 'Prime', 'Gold', 'Silver', 'Platinum', 'Diamond', 'Crystal', 'Jewel', 'Treasure'],
          lastNames: ['Goldstream', 'Silverflow', 'Creditline', 'Marketmaker', 'Dealbroker', 'Tradewind', 'Profiteer', 'Wealthbuilder', 'Fortuneseeker', 'Successdriver', 'Moneymaker', 'Cashflow', 'Assetmanager', 'Portfoliobuilder', 'Investmentguru', 'Financewiz', 'Economymaster', 'Businessmind', 'Entrepreneurial', 'Commercialist'],
          titles: ['CEO', 'CFO', 'COO', 'Director', 'Manager', 'Executive', 'President', 'Vice President', 'Chairman', 'Founder'],
          suffixes: ['Enterprises', 'Corporation', 'Industries', 'Holdings', 'Group', 'Syndicate', 'Consortium', 'Alliance', 'Union', 'Federation']
        },
        {
          culture: 'Keplerian',
          firstNames: ['Harvest', 'Growth', 'Bloom', 'Seed', 'Root', 'Branch', 'Leaf', 'Flower', 'Fruit', 'Grain', 'Field', 'Farm', 'Garden', 'Grove', 'Meadow', 'Valley', 'Hill', 'Stream', 'River', 'Lake'],
          lastNames: ['Earthtender', 'Cropmaster', 'Fieldworker', 'Harvesthand', 'Seedsower', 'Plantgrowth', 'Soilrich', 'Waterwise', 'Sunbright', 'Moonlight', 'Starshine', 'Dawnbreak', 'Duskfall', 'Seasonchange', 'Weatherwise', 'Naturelove', 'Earthbound', 'Skyward', 'Horizonseeker', 'Frontiersman'],
          titles: ['Farmer', 'Rancher', 'Agriculturalist', 'Botanist', 'Ecologist', 'Environmentalist', 'Conservationist', 'Naturalist', 'Biologist', 'Geneticist'],
          suffixes: ['Farms', 'Ranch', 'Agriculture', 'Botanics', 'Ecology', 'Environment', 'Conservation', 'Nature', 'Biology', 'Genetics']
        }
      ],
      personalityArchetypes: [
        {
          name: 'The Innovator',
          description: 'Creative, curious, and always pushing boundaries',
          traits: { humor: [0.6, 0.9], aggression: [0.1, 0.4], cooperation: [0.7, 0.9], ambition: [0.8, 1.0], curiosity: [0.9, 1.0] },
          commonProfessions: ['Scientist', 'Engineer', 'Researcher', 'Inventor', 'Designer'],
          typicalLocations: ['vega', 'sol']
        },
        {
          name: 'The Guardian',
          description: 'Protective, loyal, and duty-bound',
          traits: { humor: [0.2, 0.6], aggression: [0.6, 0.9], cooperation: [0.8, 1.0], ambition: [0.5, 0.8], curiosity: [0.3, 0.7] },
          commonProfessions: ['Military Officer', 'Security Chief', 'Police Officer', 'Bodyguard', 'Defender'],
          typicalLocations: ['alpha_centauri', 'kepler']
        },
        {
          name: 'The Entrepreneur',
          description: 'Ambitious, charismatic, and business-minded',
          traits: { humor: [0.5, 0.8], aggression: [0.4, 0.7], cooperation: [0.6, 0.8], ambition: [0.9, 1.0], curiosity: [0.7, 0.9] },
          commonProfessions: ['Business Owner', 'Trader', 'Merchant', 'Investor', 'Executive'],
          typicalLocations: ['sirius', 'sol']
        },
        {
          name: 'The Caretaker',
          description: 'Nurturing, empathetic, and community-focused',
          traits: { humor: [0.6, 0.9], aggression: [0.1, 0.3], cooperation: [0.9, 1.0], ambition: [0.3, 0.7], curiosity: [0.5, 0.8] },
          commonProfessions: ['Doctor', 'Teacher', 'Social Worker', 'Counselor', 'Nurse'],
          typicalLocations: ['sol', 'kepler']
        },
        {
          name: 'The Explorer',
          description: 'Adventurous, independent, and thrill-seeking',
          traits: { humor: [0.7, 1.0], aggression: [0.3, 0.6], cooperation: [0.4, 0.7], ambition: [0.6, 0.9], curiosity: [0.8, 1.0] },
          commonProfessions: ['Pilot', 'Scout', 'Explorer', 'Surveyor', 'Navigator'],
          typicalLocations: ['kepler', 'alpha_centauri']
        },
        {
          name: 'The Philosopher',
          description: 'Thoughtful, wise, and contemplative',
          traits: { humor: [0.4, 0.7], aggression: [0.1, 0.3], cooperation: [0.7, 0.9], ambition: [0.3, 0.6], curiosity: [0.8, 1.0] },
          commonProfessions: ['Philosopher', 'Writer', 'Historian', 'Theologian', 'Ethicist'],
          typicalLocations: ['vega', 'sol']
        },
        {
          name: 'The Artisan',
          description: 'Creative, skilled, and detail-oriented',
          traits: { humor: [0.5, 0.8], aggression: [0.2, 0.5], cooperation: [0.6, 0.8], ambition: [0.4, 0.7], curiosity: [0.7, 0.9] },
          commonProfessions: ['Artist', 'Craftsperson', 'Designer', 'Musician', 'Writer'],
          typicalLocations: ['sol', 'vega']
        },
        {
          name: 'The Survivor',
          description: 'Resilient, practical, and resourceful',
          traits: { humor: [0.3, 0.6], aggression: [0.5, 0.8], cooperation: [0.5, 0.7], ambition: [0.6, 0.9], curiosity: [0.4, 0.7] },
          commonProfessions: ['Miner', 'Farmer', 'Mechanic', 'Technician', 'Laborer'],
          typicalLocations: ['kepler', 'alpha_centauri']
        }
      ],
      backgroundTemplates: [
        {
          profession: 'Quantum Physicist',
          description: 'Studies the fundamental nature of reality at the quantum level',
          requiredTraits: { curiosity: 0.8, cooperation: 0.6 },
          commonLocations: ['vega', 'sol'],
          achievementCategories: ['SCIENTIFIC'],
          reputationWeights: { military: 0.1, economic: 0.3, diplomatic: 0.4, scientific: 1.0, cultural: 0.6 }
        },
        {
          profession: 'Starship Captain',
          description: 'Commands vessels in the depths of space',
          requiredTraits: { ambition: 0.7, cooperation: 0.8 },
          commonLocations: ['alpha_centauri', 'sirius'],
          achievementCategories: ['MILITARY', 'EXPLORATION'],
          reputationWeights: { military: 1.0, economic: 0.4, diplomatic: 0.6, scientific: 0.3, cultural: 0.5 }
        },
        {
          profession: 'Galactic Trader',
          description: 'Facilitates commerce across star systems',
          requiredTraits: { ambition: 0.8, curiosity: 0.6 },
          commonLocations: ['sirius', 'sol'],
          achievementCategories: ['ECONOMIC'],
          reputationWeights: { military: 0.2, economic: 1.0, diplomatic: 0.7, scientific: 0.3, cultural: 0.4 }
        },
        {
          profession: 'Colonial Administrator',
          description: 'Manages the development of new worlds',
          requiredTraits: { cooperation: 0.8, ambition: 0.6 },
          commonLocations: ['kepler', 'alpha_centauri'],
          achievementCategories: ['DIPLOMATIC', 'CULTURAL'],
          reputationWeights: { military: 0.4, economic: 0.6, diplomatic: 1.0, scientific: 0.4, cultural: 0.8 }
        },
        {
          profession: 'Xenobiologist',
          description: 'Studies life forms from other worlds',
          requiredTraits: { curiosity: 0.9, cooperation: 0.7 },
          commonLocations: ['vega', 'kepler'],
          achievementCategories: ['SCIENTIFIC', 'EXPLORATION'],
          reputationWeights: { military: 0.1, economic: 0.2, diplomatic: 0.5, scientific: 1.0, cultural: 0.7 }
        },
        {
          profession: 'Cultural Anthropologist',
          description: 'Studies the diverse cultures across the galaxy',
          requiredTraits: { curiosity: 0.8, cooperation: 0.9 },
          commonLocations: ['sol', 'vega'],
          achievementCategories: ['CULTURAL', 'DIPLOMATIC'],
          reputationWeights: { military: 0.1, economic: 0.3, diplomatic: 0.8, scientific: 0.6, cultural: 1.0 }
        },
        {
          profession: 'Terraforming Engineer',
          description: 'Transforms worlds to support human life',
          requiredTraits: { ambition: 0.7, curiosity: 0.8 },
          commonLocations: ['kepler', 'alpha_centauri'],
          achievementCategories: ['SCIENTIFIC', 'CULTURAL'],
          reputationWeights: { military: 0.3, economic: 0.5, diplomatic: 0.4, scientific: 0.9, cultural: 0.7 }
        },
        {
          profession: 'Diplomatic Attaché',
          description: 'Facilitates relations between different factions',
          requiredTraits: { cooperation: 0.9, humor: 0.6 },
          commonLocations: ['sol', 'sirius'],
          achievementCategories: ['DIPLOMATIC'],
          reputationWeights: { military: 0.3, economic: 0.5, diplomatic: 1.0, scientific: 0.4, cultural: 0.8 }
        }
      ],
      achievementPools: [
        {
          category: 'SCIENTIFIC',
          achievements: [
            {
              titleTemplate: 'Quantum {discovery} Pioneer',
              descriptionTemplate: 'Made groundbreaking discoveries in {field} research',
              rarity: 'RARE',
              requirements: { minReputation: 70, requiredProfession: 'Scientist' },
              variables: ['discovery', 'field']
            },
            {
              titleTemplate: '{theory} Theorist',
              descriptionTemplate: 'Developed the foundational {theory} theory',
              rarity: 'EPIC',
              requirements: { minReputation: 85 },
              variables: ['theory']
            },
            {
              titleTemplate: 'Research Excellence Award',
              descriptionTemplate: 'Recognized for outstanding contributions to {field}',
              rarity: 'UNCOMMON',
              requirements: { minReputation: 60 },
              variables: ['field']
            }
          ]
        },
        {
          category: 'MILITARY',
          achievements: [
            {
              titleTemplate: 'Hero of {battle}',
              descriptionTemplate: 'Led successful defense of {location} during the {battle}',
              rarity: 'EPIC',
              requirements: { minReputation: 80, requiredLocation: 'alpha_centauri' },
              variables: ['battle', 'location']
            },
            {
              titleTemplate: 'Distinguished Service Medal',
              descriptionTemplate: 'Awarded for exceptional service in {conflict}',
              rarity: 'RARE',
              requirements: { minReputation: 70 },
              variables: ['conflict']
            },
            {
              titleTemplate: 'Fleet Commander',
              descriptionTemplate: 'Successfully commanded {number} vessels in combat',
              rarity: 'UNCOMMON',
              requirements: { minReputation: 65 },
              variables: ['number']
            }
          ]
        },
        {
          category: 'ECONOMIC',
          achievements: [
            {
              titleTemplate: 'Trade Master',
              descriptionTemplate: 'Completed {number} successful trade routes',
              rarity: 'RARE',
              requirements: { minReputation: 75, requiredLocation: 'sirius' },
              variables: ['number']
            },
            {
              titleTemplate: '{resource} Monopolist',
              descriptionTemplate: 'Controlled the galactic {resource} market',
              rarity: 'EPIC',
              requirements: { minReputation: 85 },
              variables: ['resource']
            },
            {
              titleTemplate: 'Economic Innovator',
              descriptionTemplate: 'Pioneered new {innovation} trading methods',
              rarity: 'UNCOMMON',
              requirements: { minReputation: 60 },
              variables: ['innovation']
            }
          ]
        },
        {
          category: 'CULTURAL',
          achievements: [
            {
              titleTemplate: 'Cultural Ambassador',
              descriptionTemplate: 'Promoted {culture} culture across {systems} systems',
              rarity: 'RARE',
              requirements: { minReputation: 70 },
              variables: ['culture', 'systems']
            },
            {
              titleTemplate: '{movement} Founder',
              descriptionTemplate: 'Founded the influential {movement} movement',
              rarity: 'LEGENDARY',
              requirements: { minReputation: 90 },
              variables: ['movement']
            },
            {
              titleTemplate: 'Artistic Visionary',
              descriptionTemplate: 'Created the acclaimed {artwork} series',
              rarity: 'UNCOMMON',
              requirements: { minReputation: 55 },
              variables: ['artwork']
            }
          ]
        },
        {
          category: 'DIPLOMATIC',
          achievements: [
            {
              titleTemplate: 'Peace Broker',
              descriptionTemplate: 'Negotiated the {treaty} peace accords',
              rarity: 'EPIC',
              requirements: { minReputation: 85 },
              variables: ['treaty']
            },
            {
              titleTemplate: 'Galactic Mediator',
              descriptionTemplate: 'Resolved {number} inter-system disputes',
              rarity: 'RARE',
              requirements: { minReputation: 75 },
              variables: ['number']
            },
            {
              titleTemplate: 'Unity Advocate',
              descriptionTemplate: 'Promoted cooperation between {factions}',
              rarity: 'UNCOMMON',
              requirements: { minReputation: 65 },
              variables: ['factions']
            }
          ]
        },
        {
          category: 'EXPLORATION',
          achievements: [
            {
              titleTemplate: '{system} Explorer',
              descriptionTemplate: 'First to map the {system} system',
              rarity: 'LEGENDARY',
              requirements: { minReputation: 80 },
              variables: ['system']
            },
            {
              titleTemplate: 'Deep Space Pioneer',
              descriptionTemplate: 'Explored {number} uncharted systems',
              rarity: 'EPIC',
              requirements: { minReputation: 75 },
              variables: ['number']
            },
            {
              titleTemplate: 'Stellar Cartographer',
              descriptionTemplate: 'Mapped {regions} previously unknown regions',
              rarity: 'RARE',
              requirements: { minReputation: 70 },
              variables: ['regions']
            }
          ]
        }
      ]
    };
  }

  // Generate a batch of NPCs for a specific location
  async generateNPCBatch(locationId: string, count: number): Promise<PlayerProfile[]> {
    const location = this.findLocation(locationId);
    if (!location) {
      throw new Error(`Location ${locationId} not found`);
    }

    const npcs: PlayerProfile[] = [];
    
    for (let i = 0; i < count; i++) {
      const npc = await this.generateSingleNPC(location);
      npcs.push(npc);
      this.generatedNPCs.set(npc.id, npc);
    }

    return npcs;
  }

  private async generateSingleNPC(location: any): Promise<PlayerProfile> {
    // Determine NPC type based on location and distribution
    const npcType = this.selectNPCType(location);
    
    // Select personality archetype
    const archetype = this.selectPersonalityArchetype(location, npcType);
    
    // Generate name
    const name = this.generateName(location);
    
    // Generate personality traits
    const personalityTraits = this.generatePersonalityTraits(archetype);
    
    // Select profession
    const profession = this.selectProfession(archetype, location, npcType);
    
    // Generate reputation
    const reputation = this.generateReputation(profession, personalityTraits, location);
    
    // Generate achievements
    const achievements = await this.generateAchievements(profession, reputation, location);
    
    // Generate stats
    const stats = this.generateStats(npcType, reputation, location);
    
    // Generate faction (if applicable)
    const faction = this.generateFaction(npcType, location, profession);
    
    // Generate civilization
    const civilization = this.generateCivilization(location);

    const npcId = `npc_${this.npcCounter++}_${Date.now()}`;

    return {
      id: npcId,
      name,
      type: npcType as any,
      location: {
        currentSystem: location.system.systemName,
        currentPlanet: location.planet.planetName,
        currentCity: location.city?.cityName,
        coordinates: location.planet.coordinates
      },
      stats,
      achievements,
      faction,
      civilization,
      reputation,
      personalityTraits
    };
  }

  private findLocation(locationId: string): any {
    for (const system of this.config.locationDistribution) {
      if (system.systemId === locationId) {
        // Return random planet/city in system
        const planet = system.planets[Math.floor(Math.random() * system.planets.length)];
        const city = planet.cities.length > 0 ? planet.cities[Math.floor(Math.random() * planet.cities.length)] : null;
        return { system, planet, city };
      }
      
      for (const planet of system.planets) {
        if (planet.planetId === locationId) {
          const city = planet.cities.length > 0 ? planet.cities[Math.floor(Math.random() * planet.cities.length)] : null;
          return { system, planet, city };
        }
        
        for (const city of planet.cities) {
          if (city.cityId === locationId) {
            return { system, planet, city };
          }
        }
      }
    }
    return null;
  }

  private selectNPCType(location: any): string {
    const { system, planet, city } = location;
    
    // Adjust type distribution based on location characteristics
    let typeWeights = { ...this.config.typeDistribution };
    
    // Military locations have more military leaders
    if (planet.planetType === 'MILITARY' || city?.cityType === 'MILITARY') {
      typeWeights.DIVISION_LEADER *= 3;
      typeWeights.CITIZEN *= 0.8;
    }
    
    // Research locations have more scientists and personalities
    if (planet.planetType === 'RESEARCH' || city?.cityType === 'RESEARCH') {
      typeWeights.SCIENTIST *= 4;
      typeWeights.PERSONALITY *= 2;
      typeWeights.CITIZEN *= 0.7;
    }
    
    // Trade locations have more business leaders
    if (city?.cityType === 'TRADE' || system.economicLevel > 8) {
      typeWeights.BUSINESS_LEADER *= 3;
      typeWeights.CITIZEN *= 0.8;
    }
    
    // Capital cities have more leaders
    if (city?.cityType === 'CAPITAL') {
      typeWeights.CITY_LEADER *= 5;
      typeWeights.PLANET_LEADER *= 3;
      typeWeights.CITIZEN *= 0.7;
    }

    return this.weightedRandomSelect(typeWeights);
  }

  private selectPersonalityArchetype(location: any, npcType: string): PersonalityArchetype {
    const { system } = location;
    
    // Filter archetypes by location preference
    const suitableArchetypes = this.templates.personalityArchetypes.filter(archetype => 
      archetype.typicalLocations.includes(system.systemId) || 
      archetype.typicalLocations.length === 0
    );
    
    if (suitableArchetypes.length === 0) {
      return this.templates.personalityArchetypes[0]; // Fallback
    }
    
    return suitableArchetypes[Math.floor(Math.random() * suitableArchetypes.length)];
  }

  private generateName(location: any): string {
    const { system } = location;
    
    // Select name pattern based on system culture
    let namePattern: NamePattern;
    
    switch (system.systemId) {
      case 'sol':
        namePattern = this.templates.namePatterns.find(p => p.culture === 'Terran')!;
        break;
      case 'alpha_centauri':
        namePattern = this.templates.namePatterns.find(p => p.culture === 'Centauri')!;
        break;
      case 'vega':
        namePattern = this.templates.namePatterns.find(p => p.culture === 'Vegan')!;
        break;
      case 'sirius':
        namePattern = this.templates.namePatterns.find(p => p.culture === 'Sirian')!;
        break;
      case 'kepler':
        namePattern = this.templates.namePatterns.find(p => p.culture === 'Keplerian')!;
        break;
      default:
        namePattern = this.templates.namePatterns[Math.floor(Math.random() * this.templates.namePatterns.length)];
    }
    
    const firstName = namePattern.firstNames[Math.floor(Math.random() * namePattern.firstNames.length)];
    const lastName = namePattern.lastNames[Math.floor(Math.random() * namePattern.lastNames.length)];
    
    // Sometimes add title or suffix
    let name = `${firstName} ${lastName}`;
    
    if (Math.random() < 0.3) {
      const title = namePattern.titles[Math.floor(Math.random() * namePattern.titles.length)];
      name = `${title} ${name}`;
    }
    
    if (Math.random() < 0.1) {
      const suffix = namePattern.suffixes[Math.floor(Math.random() * namePattern.suffixes.length)];
      name = `${name} ${suffix}`;
    }
    
    return name;
  }

  private generatePersonalityTraits(archetype: PersonalityArchetype): NonNullable<PlayerProfile['personalityTraits']> {
    const traits: NonNullable<PlayerProfile['personalityTraits']> = {
      humor: 0,
      aggression: 0,
      cooperation: 0,
      ambition: 0,
      curiosity: 0
    };
    
    // Generate traits within archetype ranges with some variance
    Object.keys(traits).forEach(trait => {
      const [min, max] = archetype.traits[trait as keyof typeof archetype.traits];
      const variance = this.config.personalityVariance;
      
      let value = min + Math.random() * (max - min);
      
      // Add some random variance
      value += (Math.random() - 0.5) * variance;
      
      // Clamp to 0-1 range
      traits[trait as keyof typeof traits] = Math.max(0, Math.min(1, value));
    });
    
    return traits;
  }

  private selectProfession(archetype: PersonalityArchetype, location: any, npcType: string): string {
    const { planet, city } = location;
    
    // Get profession suggestions from archetype
    let professions = [...archetype.commonProfessions];
    
    // Add location-specific professions
    if (city) {
      switch (city.cityType) {
        case 'RESEARCH':
          professions.push('Researcher', 'Scientist', 'Lab Technician', 'Data Analyst');
          break;
        case 'MILITARY':
          professions.push('Military Officer', 'Security Chief', 'Tactical Analyst', 'Weapons Specialist');
          break;
        case 'TRADE':
          professions.push('Trader', 'Merchant', 'Logistics Coordinator', 'Market Analyst');
          break;
        case 'INDUSTRIAL':
          professions.push('Engineer', 'Factory Manager', 'Quality Controller', 'Production Supervisor');
          break;
        case 'AGRICULTURAL':
          professions.push('Farmer', 'Agricultural Engineer', 'Food Scientist', 'Crop Specialist');
          break;
        case 'MINING':
          professions.push('Miner', 'Geological Surveyor', 'Mining Engineer', 'Resource Analyst');
          break;
      }
    }
    
    // Add planet-type specific professions
    switch (planet.planetType) {
      case 'CORE_WORLD':
        professions.push('Government Official', 'Cultural Ambassador', 'Media Producer', 'Urban Planner');
        break;
      case 'COLONY':
        professions.push('Colonial Administrator', 'Settlement Planner', 'Resource Manager', 'Pioneer');
        break;
      case 'FRONTIER':
        professions.push('Explorer', 'Scout', 'Frontier Guard', 'Survival Specialist');
        break;
      case 'RESEARCH':
        professions.push('Research Director', 'Lab Coordinator', 'Scientific Advisor', 'Innovation Manager');
        break;
    }
    
    // Filter by NPC type
    if (npcType === 'CITY_LEADER') {
      professions = ['Mayor', 'City Administrator', 'Urban Planner', 'Public Works Director'];
    } else if (npcType === 'PLANET_LEADER') {
      professions = ['Planetary Governor', 'Colonial Director', 'Regional Administrator'];
    } else if (npcType === 'DIVISION_LEADER') {
      professions = ['Military Commander', 'Fleet Admiral', 'Defense Coordinator', 'Strategic Planner'];
    } else if (npcType === 'BUSINESS_LEADER') {
      professions = ['CEO', 'Business Owner', 'Trade Director', 'Economic Advisor'];
    } else if (npcType === 'SCIENTIST') {
      professions = ['Research Scientist', 'Lab Director', 'Scientific Advisor', 'Innovation Specialist'];
    } else if (npcType === 'ARTIST') {
      professions = ['Artist', 'Musician', 'Writer', 'Cultural Creator', 'Entertainment Producer'];
    }
    
    return professions[Math.floor(Math.random() * professions.length)] || 'Citizen';
  }

  private generateReputation(profession: string, traits: NonNullable<PlayerProfile['personalityTraits']>, location: any): PlayerProfile['reputation'] {
    // Find background template for profession
    const background = this.templates.backgroundTemplates.find(bg => 
      bg.profession.toLowerCase().includes(profession.toLowerCase()) ||
      profession.toLowerCase().includes(bg.profession.toLowerCase())
    );
    
    const baseReputation = 30 + Math.random() * 40; // 30-70 base
    
    let reputationWeights = {
      military: 0.2,
      economic: 0.2,
      diplomatic: 0.2,
      scientific: 0.2,
      cultural: 0.2
    };
    
    if (background) {
      reputationWeights = background.reputationWeights;
    }
    
    // Adjust based on personality traits
    const traitBonus = (traits.ambition + traits.cooperation + traits.curiosity) / 3 * 20;
    
    // Adjust based on location prestige
    const locationBonus = (location.system.economicLevel + location.system.scientificLevel + location.system.culturalDiversity) / 3 * 5;
    
    const overall = Math.min(100, Math.max(0, baseReputation + traitBonus + locationBonus));
    
    const categories = {
      military: Math.min(100, Math.max(0, overall * reputationWeights.military + (Math.random() - 0.5) * 20)),
      economic: Math.min(100, Math.max(0, overall * reputationWeights.economic + (Math.random() - 0.5) * 20)),
      diplomatic: Math.min(100, Math.max(0, overall * reputationWeights.diplomatic + (Math.random() - 0.5) * 20)),
      scientific: Math.min(100, Math.max(0, overall * reputationWeights.scientific + (Math.random() - 0.5) * 20)),
      cultural: Math.min(100, Math.max(0, overall * reputationWeights.cultural + (Math.random() - 0.5) * 20))
    };
    
    return {
      overall: Math.round(overall),
      categories: {
        military: Math.round(categories.military),
        economic: Math.round(categories.economic),
        diplomatic: Math.round(categories.diplomatic),
        scientific: Math.round(categories.scientific),
        cultural: Math.round(categories.cultural)
      }
    };
  }

  private async generateAchievements(profession: string, reputation: PlayerProfile['reputation'], location: any): Promise<PlayerProfile['achievements']> {
    const achievements: PlayerProfile['achievements'] = [];
    
    // Determine number of achievements based on reputation
    const achievementCount = Math.floor(reputation.overall / 25) + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < achievementCount; i++) {
      // Select achievement category based on reputation strengths
      const categories = Object.entries(reputation.categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category.toUpperCase());
      
      const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      const achievementPool = this.templates.achievementPools.find(pool => 
        pool.category === selectedCategory
      );
      
      if (achievementPool) {
        const template = achievementPool.achievements[Math.floor(Math.random() * achievementPool.achievements.length)];
        
        // Check if NPC meets requirements
        if (template.requirements.minReputation && reputation.overall < template.requirements.minReputation) {
          continue;
        }
        
        if (template.requirements.requiredLocation && !location.system.systemId.includes(template.requirements.requiredLocation)) {
          continue;
        }
        
        if (template.requirements.requiredProfession && !profession.toLowerCase().includes(template.requirements.requiredProfession.toLowerCase())) {
          continue;
        }
        
        // Generate achievement
        const achievement = this.fillAchievementTemplate(template, profession, location);
        achievements.push(achievement);
      }
    }
    
    return achievements;
  }

  private fillAchievementTemplate(template: AchievementTemplate, profession: string, location: any): PlayerProfile['achievements'][0] {
    let title = template.titleTemplate;
    let description = template.descriptionTemplate;
    
    // Fill in template variables
    template.variables.forEach(variable => {
      let value = '';
      
      switch (variable) {
        case 'discovery':
          value = ['Entanglement', 'Superposition', 'Tunneling', 'Coherence'][Math.floor(Math.random() * 4)];
          break;
        case 'field':
          value = ['quantum mechanics', 'theoretical physics', 'applied science', 'advanced mathematics'][Math.floor(Math.random() * 4)];
          break;
        case 'theory':
          value = ['Unified Field', 'Quantum Gravity', 'Dimensional', 'Temporal'][Math.floor(Math.random() * 4)];
          break;
        case 'battle':
          value = ['Proxima Defense', 'Kepler Liberation', 'Vega Incident', 'Sirius Blockade'][Math.floor(Math.random() * 4)];
          break;
        case 'location':
          value = location.planet.planetName;
          break;
        case 'number':
          value = (Math.floor(Math.random() * 50) + 10).toString();
          break;
        case 'resource':
          value = ['Quantum Crystals', 'Rare Metals', 'Energy Cells', 'Data Storage'][Math.floor(Math.random() * 4)];
          break;
        case 'innovation':
          value = ['algorithmic', 'quantum-enhanced', 'AI-assisted', 'blockchain-based'][Math.floor(Math.random() * 4)];
          break;
        case 'culture':
          value = location.system.systemName.split(' ')[0];
          break;
        case 'systems':
          value = (Math.floor(Math.random() * 10) + 3).toString();
          break;
        case 'movement':
          value = ['Neo-Humanist', 'Galactic Unity', 'Stellar Renaissance', 'Cosmic Harmony'][Math.floor(Math.random() * 4)];
          break;
        case 'artwork':
          value = ['Stellar Visions', 'Cosmic Dreams', 'Galactic Harmony', 'Universal Truth'][Math.floor(Math.random() * 4)];
          break;
        case 'treaty':
          value = ['Centauri-Sol', 'Vega Accords', 'Sirius Compact', 'Kepler Agreement'][Math.floor(Math.random() * 4)];
          break;
        case 'factions':
          value = 'multiple galactic factions';
          break;
        case 'system':
          value = ['Tau Ceti', 'Wolf 359', 'Barnard\'s Star', 'Ross 128'][Math.floor(Math.random() * 4)];
          break;
        case 'regions':
          value = (Math.floor(Math.random() * 5) + 2).toString();
          break;
        case 'conflict':
          value = ['Border Disputes', 'Trade Wars', 'Resource Conflicts', 'Territorial Expansion'][Math.floor(Math.random() * 4)];
          break;
      }
      
      title = title.replace(`{${variable}}`, value);
      description = description.replace(`{${variable}}`, value);
    });
    
    return {
      id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category: template.rarity === 'LEGENDARY' ? 'CULTURAL' : 'SCIENTIFIC',
      rarity: template.rarity,
      dateEarned: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
      publiclyVisible: Math.random() > 0.1 // 90% visible
    };
  }

  private generateStats(npcType: string, reputation: PlayerProfile['reputation'], location: any): PlayerProfile['stats'] {
    // Base follower count based on type and reputation
    let baseFollowers = 0;
    
    switch (npcType) {
      case 'PERSONALITY':
        baseFollowers = 10000 + Math.random() * 90000; // 10k-100k
        break;
      case 'PLANET_LEADER':
        baseFollowers = 5000 + Math.random() * 45000; // 5k-50k
        break;
      case 'DIVISION_LEADER':
        baseFollowers = 3000 + Math.random() * 27000; // 3k-30k
        break;
      case 'CITY_LEADER':
        baseFollowers = 1000 + Math.random() * 19000; // 1k-20k
        break;
      case 'BUSINESS_LEADER':
        baseFollowers = 2000 + Math.random() * 18000; // 2k-20k
        break;
      case 'SCIENTIST':
        baseFollowers = 500 + Math.random() * 9500; // 500-10k
        break;
      case 'ARTIST':
        baseFollowers = 1000 + Math.random() * 49000; // 1k-50k (can be very popular)
        break;
      default: // CITIZEN
        baseFollowers = 10 + Math.random() * 2990; // 10-3k
    }
    
    // Adjust based on reputation
    const reputationMultiplier = reputation.overall / 100;
    const followerCount = Math.floor(baseFollowers * reputationMultiplier);
    
    // Following count (usually much lower than followers)
    const followingCount = Math.floor(followerCount * (0.05 + Math.random() * 0.15)); // 5-20% of followers
    
    // Witt count based on how active they are
    const activityLevel = Math.random();
    const wittCount = Math.floor(followerCount * 0.1 * activityLevel + Math.random() * 1000);
    
    // Join date (random in past 2 years)
    const joinDate = new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
    
    // Last active (random in past week, with higher reputation being more recently active)
    const maxInactiveTime = (100 - reputation.overall) / 100 * 7 * 24 * 60 * 60 * 1000; // Up to 7 days
    const lastActive = new Date(Date.now() - Math.random() * maxInactiveTime);
    
    return {
      followerCount,
      followingCount,
      wittCount,
      joinDate,
      lastActive
    };
  }

  private generateFaction(npcType: string, location: any, profession: string): PlayerProfile['faction'] | undefined {
    // Only certain types have factions
    if (!['DIVISION_LEADER', 'CITY_LEADER', 'PLANET_LEADER', 'BUSINESS_LEADER'].includes(npcType)) {
      if (Math.random() > 0.3) return undefined; // 70% chance of no faction for others
    }
    
    const { system, planet, city } = location;
    
    // Generate faction based on location and type
    let factionName = '';
    let rank = '';
    let role = '';
    
    switch (npcType) {
      case 'DIVISION_LEADER':
        factionName = `${system.systemName} Defense Force`;
        rank = ['Commander', 'Colonel', 'General', 'Admiral'][Math.floor(Math.random() * 4)];
        role = ['Fleet Operations', 'Strategic Planning', 'Defense Coordination', 'Military Intelligence'][Math.floor(Math.random() * 4)];
        break;
        
      case 'CITY_LEADER':
        factionName = `${city?.cityName || planet.planetName} Administration`;
        rank = ['Mayor', 'Administrator', 'Director', 'Coordinator'][Math.floor(Math.random() * 4)];
        role = ['City Governance', 'Urban Planning', 'Public Services', 'Infrastructure'][Math.floor(Math.random() * 4)];
        break;
        
      case 'PLANET_LEADER':
        factionName = `${planet.planetName} Colonial Government`;
        rank = ['Governor', 'Director', 'Administrator', 'Commissioner'][Math.floor(Math.random() * 4)];
        role = ['Planetary Governance', 'Colonial Development', 'Resource Management', 'Inter-system Relations'][Math.floor(Math.random() * 4)];
        break;
        
      case 'BUSINESS_LEADER':
        factionName = `${system.systemName} Commerce Guild`;
        rank = ['CEO', 'Director', 'Executive', 'Chairman'][Math.floor(Math.random() * 4)];
        role = ['Trade Operations', 'Market Development', 'Economic Planning', 'Business Strategy'][Math.floor(Math.random() * 4)];
        break;
        
      default:
        // Random civilian factions
        const civilianFactions = [
          'Citizens Alliance', 'Workers Union', 'Cultural Society', 'Scientific Consortium',
          'Trade Association', 'Educational Foundation', 'Environmental Group', 'Community Council'
        ];
        factionName = `${system.systemName} ${civilianFactions[Math.floor(Math.random() * civilianFactions.length)]}`;
        rank = ['Member', 'Associate', 'Coordinator', 'Representative'][Math.floor(Math.random() * 4)];
        role = ['Community Outreach', 'Program Coordination', 'Member Services', 'Public Relations'][Math.floor(Math.random() * 4)];
    }
    
    return {
      id: factionName.toLowerCase().replace(/\s+/g, '_'),
      name: factionName,
      rank,
      role
    };
  }

  private generateCivilization(location: any): PlayerProfile['civilization'] | undefined {
    const { system } = location;
    
    // Generate civilization based on system
    const civilizations = {
      'sol': { name: 'Terran Federation', type: 'Democratic Republic', level: 10 },
      'alpha_centauri': { name: 'Centauri Military Alliance', type: 'Military Confederation', level: 8 },
      'vega': { name: 'Vegan Scientific Collective', type: 'Technocratic Meritocracy', level: 9 },
      'sirius': { name: 'Sirian Trade Consortium', type: 'Corporate Oligarchy', level: 9 },
      'kepler': { name: 'Kepler Colonial Union', type: 'Colonial Democracy', level: 6 }
    };
    
    const civ = civilizations[system.systemId as keyof typeof civilizations];
    if (!civ) return undefined;
    
    return {
      id: civ.name.toLowerCase().replace(/\s+/g, '_'),
      name: civ.name,
      type: civ.type,
      level: civ.level
    };
  }

  private weightedRandomSelect(weights: { [key: string]: number }): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [key, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return key;
      }
    }
    
    return Object.keys(weights)[0]; // Fallback
  }

  // Background generation process
  private startBackgroundGeneration() {
    // Generate initial population
    this.generateInitialPopulation();
    
    // Set up periodic generation
    setInterval(() => {
      this.processGenerationQueue();
    }, 5000); // Process every 5 seconds
    
    // Set up periodic new NPC spawning
    setInterval(() => {
      this.spawnNewNPCs();
    }, 60000); // Spawn new NPCs every minute
  }

  private async generateInitialPopulation() {
    console.log('Generating initial NPC population...');
    
    for (const system of this.config.locationDistribution) {
      const systemPopulation = Math.floor(system.totalPopulation * 0.1); // Start with 10% of target
      
      for (const planet of system.planets) {
        const planetRatio = planet.totalPopulation / system.totalPopulation;
        const planetNPCCount = Math.floor(systemPopulation * planetRatio);
        
        // Queue generation for this planet
        this.generationQueue.push({
          locationId: planet.planetId,
          count: planetNPCCount,
          priority: system.economicLevel + planet.developmentLevel
        });
      }
    }
    
    console.log(`Queued generation of ${this.generationQueue.length} NPC batches`);
  }

  private async processGenerationQueue() {
    if (this.generationQueue.length === 0) return;
    
    // Sort by priority (higher first)
    this.generationQueue.sort((a, b) => b.priority - a.priority);
    
    // Process highest priority batch
    const batch = this.generationQueue.shift()!;
    
    try {
      const batchSize = Math.min(batch.count, 50); // Generate max 50 at a time
      const npcs = await this.generateNPCBatch(batch.locationId, batchSize);
      
      console.log(`Generated ${npcs.length} NPCs for ${batch.locationId}`);
      
      // If there are more to generate, add back to queue
      if (batch.count > batchSize) {
        this.generationQueue.push({
          ...batch,
          count: batch.count - batchSize
        });
      }
      
    } catch (error) {
      console.error(`Failed to generate NPCs for ${batch.locationId}:`, error);
    }
  }

  private async spawnNewNPCs() {
    // Randomly spawn new NPCs to simulate population growth and movement
    const spawnChance = 0.1; // 10% chance per minute
    
    if (Math.random() < spawnChance) {
      const randomSystem = this.config.locationDistribution[Math.floor(Math.random() * this.config.locationDistribution.length)];
      const randomPlanet = randomSystem.planets[Math.floor(Math.random() * randomSystem.planets.length)];
      
      const spawnCount = Math.floor(Math.random() * 5) + 1; // 1-5 new NPCs
      
      this.generationQueue.push({
        locationId: randomPlanet.planetId,
        count: spawnCount,
        priority: 1 // Low priority for new spawns
      });
      
      console.log(`Spawning ${spawnCount} new NPCs in ${randomPlanet.planetName}`);
    }
  }

  // Public API methods
  getAllNPCs(): PlayerProfile[] {
    return Array.from(this.generatedNPCs.values());
  }

  getNPCsByLocation(systemId?: string, planetId?: string, cityId?: string): PlayerProfile[] {
    return this.getAllNPCs().filter(npc => {
      if (systemId && !npc.location.currentSystem.toLowerCase().includes(systemId.toLowerCase())) {
        return false;
      }
      if (planetId && !npc.location.currentPlanet.toLowerCase().includes(planetId.toLowerCase())) {
        return false;
      }
      if (cityId && !npc.location.currentCity?.toLowerCase().includes(cityId.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  getNPCsByType(type: string): PlayerProfile[] {
    return this.getAllNPCs().filter(npc => npc.type === type);
  }

  getPopulationStats(): any {
    const npcs = this.getAllNPCs();
    
    return {
      totalGenerated: npcs.length,
      targetPopulation: this.config.totalPopulation,
      completionPercentage: (npcs.length / this.config.totalPopulation) * 100,
      typeDistribution: this.getTypeDistribution(npcs),
      locationDistribution: this.getLocationDistribution(npcs),
      queuedGeneration: this.generationQueue.length
    };
  }

  private getTypeDistribution(npcs: PlayerProfile[]): { [type: string]: number } {
    const distribution: { [type: string]: number } = {};
    npcs.forEach(npc => {
      distribution[npc.type] = (distribution[npc.type] || 0) + 1;
    });
    return distribution;
  }

  private getLocationDistribution(npcs: PlayerProfile[]): { [location: string]: number } {
    const distribution: { [location: string]: number } = {};
    npcs.forEach(npc => {
      const key = `${npc.location.currentSystem}/${npc.location.currentPlanet}`;
      distribution[key] = (distribution[key] || 0) + 1;
    });
    return distribution;
  }

  // Force generation of specific NPCs
  async forceGenerateNPCs(locationId: string, count: number): Promise<PlayerProfile[]> {
    return await this.generateNPCBatch(locationId, count);
  }

  // Get NPC by ID
  getNPCById(npcId: string): PlayerProfile | null {
    return this.generatedNPCs.get(npcId) || null;
  }

  // Update NPC (for dynamic changes)
  updateNPC(npcId: string, updates: Partial<PlayerProfile>): boolean {
    const npc = this.generatedNPCs.get(npcId);
    if (!npc) return false;
    
    const updatedNPC = { ...npc, ...updates };
    this.generatedNPCs.set(npcId, updatedNPC);
    return true;
  }

  // Remove NPC (for lifecycle management)
  removeNPC(npcId: string): boolean {
    return this.generatedNPCs.delete(npcId);
  }
}

interface NPCGenerationRequest {
  locationId: string;
  count: number;
  priority: number;
}

export default DynamicNPCGenerator;
