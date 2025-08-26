import { GameMasterPersonality } from './ContentGenerator';

export interface GalacticRace {
  id: string;
  name: string;
  type: 'HUMANOID' | 'SILICON_BASED' | 'ENERGY_BEING' | 'HIVE_MIND' | 'MACHINE' | 'AQUATIC' | 'GASEOUS' | 'CRYSTALLINE' | 'SYNTHETIC' | 'HYBRID';
  origin: 'NATIVE' | 'ANCIENT' | 'EVOLVED' | 'CREATED' | 'MIGRANT' | 'UNKNOWN';
  physicalTraits: {
    averageHeight: number; // in meters
    averageLifespan: number; // in years
    bodyType: string;
    specialFeatures: string[];
    environmentalNeeds: string[];
  };
  mentalTraits: {
    intelligence: number; // 1-10
    emotionalRange: number; // 1-10
    psychicAbilities: boolean;
    collectiveMind: boolean;
    memoryType: 'INDIVIDUAL' | 'COLLECTIVE' | 'GENETIC' | 'DIGITAL';
  };
  culturalTraits: {
    socialStructure: 'INDIVIDUALISTIC' | 'COLLECTIVE' | 'HIERARCHICAL' | 'ANARCHIC' | 'TRIBAL' | 'CORPORATE';
    values: string[];
    taboos: string[];
    artForms: string[];
    philosophy: string;
  };
  technologicalLevel: {
    overall: number; // 1-10
    specializations: { [field: string]: number };
    uniqueTechnologies: string[];
  };
  biologicalNeeds: {
    atmosphere: string[];
    temperature: { min: number; max: number }; // in Celsius
    gravity: { min: number; max: number }; // in Earth G's
    radiation: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    diet: 'OMNIVORE' | 'HERBIVORE' | 'CARNIVORE' | 'ENERGY' | 'MINERAL' | 'SYNTHETIC';
  };
  namePatterns: {
    personalNames: string[];
    familyNames: string[];
    titles: string[];
    locationNames: string[];
    organizationNames: string[];
  };
  languageCharacteristics: {
    phonemes: string[];
    grammar: 'SIMPLE' | 'COMPLEX' | 'TONAL' | 'GESTURAL' | 'TELEPATHIC' | 'MATHEMATICAL';
    writingSystem: 'ALPHABETIC' | 'LOGOGRAPHIC' | 'SYLLABIC' | 'DIGITAL' | 'NONE';
  };
}

export interface StarSystem {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  starType: 'G' | 'K' | 'M' | 'F' | 'A' | 'B' | 'O' | 'BINARY' | 'NEUTRON' | 'WHITE_DWARF' | 'RED_GIANT';
  age: number; // in billions of years
  planets: Planet[];
  totalPopulation: number;
  dominantRaces: string[]; // Race IDs
  politicalStatus: 'UNIFIED' | 'CONTESTED' | 'NEUTRAL' | 'ISOLATED' | 'ABANDONED';
  economicLevel: number; // 1-10
  militaryPresence: number; // 1-10
  scientificLevel: number; // 1-10
  culturalDiversity: number; // 1-10
  tradeRoutes: string[]; // Connected system IDs
  resources: { [resource: string]: number };
  hazards: string[];
}

export interface Planet {
  id: string;
  name: string;
  type: 'TERRESTRIAL' | 'GAS_GIANT' | 'ICE_WORLD' | 'DESERT' | 'OCEAN' | 'VOLCANIC' | 'ARTIFICIAL' | 'ASTEROID_BELT' | 'MOON' | 'RING_WORLD';
  size: 'TINY' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'MASSIVE';
  atmosphere: string[];
  temperature: number; // average in Celsius
  gravity: number; // in Earth G's
  population: number;
  habitability: number; // 1-10 for different races
  governments: Government[];
  cities: City[];
  resources: { [resource: string]: number };
  biomes: string[];
  moons: Planet[]; // Recursive for moon systems
  orbitalPosition: number;
  dayLength: number; // in Earth hours
  yearLength: number; // in Earth days
}

export interface Government {
  id: string;
  name: string;
  type: 'DEMOCRACY' | 'REPUBLIC' | 'MONARCHY' | 'THEOCRACY' | 'CORPORATE' | 'MILITARY' | 'ANARCHIST' | 'HIVE_MIND' | 'AI_CONTROLLED' | 'TRIBAL';
  territory: string[]; // City/region IDs they control
  population: number;
  dominantRace: string; // Race ID
  minorityRaces: string[]; // Other race IDs
  ideology: string;
  relationshipsWith: { [govId: string]: number }; // -10 to 10 relationship scores
  militaryStrength: number; // 1-10
  economicPower: number; // 1-10
  technologicalLevel: number; // 1-10
  stability: number; // 1-10
  founded: Date;
  capital: string; // City ID
  leaders: GovernmentLeader[];
}

export interface GovernmentLeader {
  id: string;
  name: string;
  race: string;
  position: string;
  personality: {
    diplomacy: number; // 1-10
    aggression: number; // 1-10
    intelligence: number; // 1-10
    charisma: number; // 1-10
    ambition: number; // 1-10
  };
  background: string;
  age: number;
  termLength: number; // in years, -1 for life
}

export interface City {
  id: string;
  name: string;
  planetId: string;
  population: number;
  type: 'CAPITAL' | 'MEGACITY' | 'INDUSTRIAL' | 'RESEARCH' | 'MILITARY' | 'TRADE' | 'RESIDENTIAL' | 'MINING' | 'AGRICULTURAL' | 'SPACEPORT' | 'RESORT' | 'RELIGIOUS';
  governmentId: string; // Which government controls it
  dominantRace: string;
  raceDistribution: { [raceId: string]: number };
  specializations: string[];
  infrastructure: {
    spaceport: boolean;
    defenses: number; // 1-10
    industry: number; // 1-10
    research: number; // 1-10
    culture: number; // 1-10
  };
  coordinates?: { x: number; y: number };
  founded: Date;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'GOVERNMENT' | 'MILITARY' | 'CULTURAL' | 'EDUCATIONAL' | 'MEDICAL' | 'SPACEPORT' | 'SLUMS';
  population: number;
  dominantRace: string;
  specialFeatures: string[];
}

export interface Civilization {
  id: string;
  name: string;
  race: string; // Primary race ID
  type: 'EMPIRE' | 'FEDERATION' | 'REPUBLIC' | 'KINGDOM' | 'CORPORATE_STATE' | 'THEOCRACY' | 'HIVE_COLLECTIVE' | 'MACHINE_INTELLIGENCE' | 'NOMADIC_FLEET' | 'CITY_STATE';
  territory: string[]; // System IDs they control
  population: number;
  capital: { systemId: string; planetId: string; cityId: string };
  founded: Date;
  government: CivilizationGovernment;
  military: MilitaryForce;
  economy: Economy;
  technology: TechnologyLevel;
  culture: CulturalProfile;
  diplomacy: { [civId: string]: DiplomaticRelation };
  history: HistoricalEvent[];
}

export interface CivilizationGovernment {
  type: 'CENTRALIZED' | 'FEDERAL' | 'CONFEDERATE' | 'AUTONOMOUS_REGIONS';
  stability: number; // 1-10
  corruption: number; // 1-10
  efficiency: number; // 1-10
  legitimacy: number; // 1-10
  leaders: CivilizationLeader[];
}

export interface CivilizationLeader {
  id: string;
  name: string;
  race: string;
  position: string;
  authority: number; // 1-10
  popularity: number; // 1-10
  competence: number; // 1-10
}

export interface MilitaryForce {
  totalStrength: number; // 1-10
  fleetSize: number;
  groundForces: number;
  specializations: string[];
  doctrine: 'DEFENSIVE' | 'OFFENSIVE' | 'BALANCED' | 'GUERRILLA' | 'TECHNOLOGICAL' | 'OVERWHELMING_FORCE';
  veterancy: number; // 1-10
}

export interface Economy {
  gdp: number; // Relative economic output
  tradeBalance: number; // -10 to 10
  primaryIndustries: string[];
  tradePartners: string[]; // Civilization IDs
  currency: string;
  economicSystem: 'CAPITALIST' | 'SOCIALIST' | 'MIXED' | 'COMMAND' | 'GIFT' | 'POST_SCARCITY';
}

export interface TechnologyLevel {
  overall: number; // 1-10
  categories: {
    physics: number;
    chemistry: number;
    biology: number;
    engineering: number;
    computing: number;
    materials: number;
    energy: number;
    space: number;
    weapons: number;
    medicine: number;
  };
  uniqueTechnologies: string[];
  researchFocus: string[];
}

export interface CulturalProfile {
  values: string[];
  artForms: string[];
  philosophy: string;
  religion: string[];
  languages: string[];
  traditions: string[];
  socialNorms: string[];
}

export interface DiplomaticRelation {
  status: 'ALLIED' | 'FRIENDLY' | 'NEUTRAL' | 'TENSE' | 'HOSTILE' | 'WAR';
  trustLevel: number; // -10 to 10
  tradeLevel: number; // 0-10
  militaryCooperation: number; // 0-10
  culturalExchange: number; // 0-10
  treaties: string[];
  lastContact: Date;
}

export interface HistoricalEvent {
  id: string;
  date: Date;
  type: 'FOUNDING' | 'WAR' | 'PEACE' | 'DISCOVERY' | 'DISASTER' | 'EXPANSION' | 'REVOLUTION' | 'FIRST_CONTACT' | 'TECHNOLOGICAL_BREAKTHROUGH';
  description: string;
  participants: string[]; // Civilization IDs
  impact: number; // -10 to 10
}

export interface GalaxyGenerationConfig {
  totalSystems: number;
  galaxyRadius: number; // in light years
  raceCount: { min: number; max: number };
  civilizationCount: { min: number; max: number };
  averageSystemPopulation: number;
  technologySpread: number; // How varied tech levels are
  politicalComplexity: number; // How many governments per planet
  culturalDiversity: number; // How varied cultures are
  conflictLevel: number; // How much warfare/tension
  tradeNetworkDensity: number; // How connected trade is
}

export class GalacticCivilizationGenerator {
  private personality: GameMasterPersonality;
  private config: GalaxyGenerationConfig;
  private races: Map<string, GalacticRace>;
  private systems: Map<string, StarSystem>;
  private civilizations: Map<string, Civilization>;
  private governments: Map<string, Government>;
  private cities: Map<string, City>;
  private generationSeed: number;

  constructor(personality: GameMasterPersonality, config?: Partial<GalaxyGenerationConfig>) {
    this.personality = personality;
    this.generationSeed = Date.now();
    this.races = new Map();
    this.systems = new Map();
    this.civilizations = new Map();
    this.governments = new Map();
    this.cities = new Map();
    
    this.config = {
      totalSystems: 500,
      galaxyRadius: 50000, // 50,000 light years
      raceCount: { min: 50, max: 200 },
      civilizationCount: { min: 200, max: 1000 },
      averageSystemPopulation: 100000,
      technologySpread: 0.7,
      politicalComplexity: 0.6,
      culturalDiversity: 0.8,
      conflictLevel: 0.4,
      tradeNetworkDensity: 0.3,
      ...config
    };

    this.initializeGeneration();
  }

  private async initializeGeneration() {
    console.log('🌌 Initializing Galactic Civilization Generation...');
    
    // Generate races first
    await this.generateRaces();
    
    // Generate star systems
    await this.generateStarSystems();
    
    // Generate civilizations
    await this.generateCivilizations();
    
    // Establish diplomatic relations
    await this.establishDiplomacy();
    
    // Generate trade networks
    await this.generateTradeNetworks();
    
    // Generate historical events
    await this.generateHistory();
    
    console.log(`🎉 Galaxy Generation Complete!`);
    console.log(`📊 Generated: ${this.races.size} races, ${this.systems.size} systems, ${this.civilizations.size} civilizations`);
  }

  private async generateRaces() {
    const raceCount = this.randomBetween(this.config.raceCount.min, this.config.raceCount.max);
    console.log(`🧬 Generating ${raceCount} unique races...`);

    for (let i = 0; i < raceCount; i++) {
      const race = await this.generateSingleRace();
      this.races.set(race.id, race);
      
      // Generate species image
      this.generateSpeciesImage(race);
    }
  }

  private async generateSingleRace(): Promise<GalacticRace> {
    const raceTypes = ['HUMANOID', 'SILICON_BASED', 'ENERGY_BEING', 'HIVE_MIND', 'MACHINE', 'AQUATIC', 'GASEOUS', 'CRYSTALLINE', 'SYNTHETIC', 'HYBRID'];
    const origins = ['NATIVE', 'ANCIENT', 'EVOLVED', 'CREATED', 'MIGRANT', 'UNKNOWN'];
    const socialStructures = ['INDIVIDUALISTIC', 'COLLECTIVE', 'HIERARCHICAL', 'ANARCHIC', 'TRIBAL', 'CORPORATE'];
    
    const type = this.randomChoice(raceTypes) as GalacticRace['type'];
    const origin = this.randomChoice(origins) as GalacticRace['origin'];
    
    // Generate race name
    const raceNamePrefixes = ['Zeph', 'Keth', 'Vorth', 'Xen', 'Quin', 'Mor', 'Lith', 'Nex', 'Vor', 'Kel', 'Zar', 'Thex', 'Grim', 'Flux', 'Void', 'Star', 'Nova', 'Cosmic', 'Quantum', 'Plasma'];
    const raceNameSuffixes = ['ari', 'oni', 'ians', 'ites', 'ans', 'oids', 'lings', 'ers', 'kin', 'folk', 'born', 'spawn', 'kind', 'race', 'people', 'beings', 'forms', 'entities', 'collective', 'unity'];
    
    const raceName = this.randomChoice(raceNamePrefixes) + this.randomChoice(raceNameSuffixes);
    const raceId = raceName.toLowerCase().replace(/\s+/g, '_');

    // Generate physical traits based on type
    const physicalTraits = this.generatePhysicalTraits(type);
    const mentalTraits = this.generateMentalTraits(type);
    const culturalTraits = this.generateCulturalTraits(type, socialStructures);
    const technologicalLevel = this.generateTechnologicalLevel(type, mentalTraits);
    const biologicalNeeds = this.generateBiologicalNeeds(type);
    const namePatterns = this.generateNamePatterns(raceName, type);
    const languageCharacteristics = this.generateLanguageCharacteristics(type, mentalTraits);

    return {
      id: raceId,
      name: raceName,
      type,
      origin,
      physicalTraits,
      mentalTraits,
      culturalTraits,
      technologicalLevel,
      biologicalNeeds,
      namePatterns,
      languageCharacteristics
    };
  }

  private generatePhysicalTraits(type: GalacticRace['type']): GalacticRace['physicalTraits'] {
    const baseTraits = {
      averageHeight: 1.8,
      averageLifespan: 80,
      bodyType: 'bipedal',
      specialFeatures: [],
      environmentalNeeds: ['oxygen', 'moderate_temperature']
    };

    switch (type) {
      case 'HUMANOID':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(1.2, 2.5),
          averageLifespan: this.randomBetween(60, 150),
          specialFeatures: this.randomChoices(['enhanced_strength', 'improved_reflexes', 'natural_armor', 'regeneration', 'enhanced_senses'], 0, 3)
        };
      
      case 'SILICON_BASED':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(0.8, 3.0),
          averageLifespan: this.randomBetween(200, 1000),
          bodyType: 'crystalline',
          specialFeatures: ['silicon_metabolism', 'heat_resistance', 'electrical_conductivity'],
          environmentalNeeds: ['high_temperature', 'mineral_rich_environment']
        };
      
      case 'ENERGY_BEING':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(0.5, 5.0),
          averageLifespan: this.randomBetween(500, 10000),
          bodyType: 'energy_form',
          specialFeatures: ['phase_shifting', 'energy_manipulation', 'electromagnetic_senses'],
          environmentalNeeds: ['electromagnetic_fields', 'energy_sources']
        };
      
      case 'HIVE_MIND':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(0.3, 1.5),
          averageLifespan: this.randomBetween(5, 50), // Individual units
          bodyType: 'insectoid',
          specialFeatures: ['collective_consciousness', 'specialized_castes', 'rapid_reproduction'],
          environmentalNeeds: ['high_humidity', 'complex_social_structure']
        };
      
      case 'MACHINE':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(1.0, 4.0),
          averageLifespan: this.randomBetween(100, 10000),
          bodyType: 'mechanical',
          specialFeatures: ['modular_design', 'self_repair', 'data_processing', 'radiation_immunity'],
          environmentalNeeds: ['power_sources', 'maintenance_facilities']
        };
      
      case 'AQUATIC':
        return {
          ...baseTraits,
          averageHeight: this.randomBetween(1.0, 8.0),
          averageLifespan: this.randomBetween(80, 300),
          bodyType: 'aquatic',
          specialFeatures: ['gills', 'pressure_adaptation', 'echolocation', 'bioluminescence'],
          environmentalNeeds: ['aquatic_environment', 'high_pressure']
        };
      
      default:
        return baseTraits;
    }
  }

  private generateMentalTraits(type: GalacticRace['type']): GalacticRace['mentalTraits'] {
    const base = {
      intelligence: this.randomBetween(3, 9),
      emotionalRange: this.randomBetween(2, 8),
      psychicAbilities: Math.random() < 0.2,
      collectiveMind: false,
      memoryType: 'INDIVIDUAL' as const
    };

    switch (type) {
      case 'HIVE_MIND':
        return {
          ...base,
          intelligence: this.randomBetween(6, 10),
          collectiveMind: true,
          memoryType: 'COLLECTIVE',
          psychicAbilities: true
        };
      
      case 'MACHINE':
        return {
          ...base,
          intelligence: this.randomBetween(7, 10),
          emotionalRange: this.randomBetween(1, 4),
          memoryType: 'DIGITAL',
          psychicAbilities: false
        };
      
      case 'ENERGY_BEING':
        return {
          ...base,
          intelligence: this.randomBetween(8, 10),
          psychicAbilities: true,
          emotionalRange: this.randomBetween(6, 10)
        };
      
      default:
        return base;
    }
  }

  private generateCulturalTraits(type: GalacticRace['type'], socialStructures: string[]): GalacticRace['culturalTraits'] {
    const values = ['honor', 'knowledge', 'harmony', 'progress', 'tradition', 'freedom', 'order', 'survival', 'beauty', 'power'];
    const taboos = ['violence', 'dishonesty', 'waste', 'isolation', 'change', 'weakness', 'chaos', 'ignorance'];
    const artForms = ['music', 'sculpture', 'painting', 'dance', 'literature', 'architecture', 'holography', 'bioart'];
    const philosophies = ['rationalism', 'spiritualism', 'materialism', 'collectivism', 'individualism', 'nihilism', 'optimism', 'pragmatism'];

    let socialStructure = this.randomChoice(socialStructures) as GalacticRace['culturalTraits']['socialStructure'];
    
    // Adjust based on type
    if (type === 'HIVE_MIND') socialStructure = 'COLLECTIVE';
    if (type === 'MACHINE') socialStructure = this.randomChoice(['HIERARCHICAL', 'CORPORATE']);

    return {
      socialStructure,
      values: this.randomChoices(values, 2, 5),
      taboos: this.randomChoices(taboos, 1, 3),
      artForms: this.randomChoices(artForms, 1, 4),
      philosophy: this.randomChoice(philosophies)
    };
  }

  private generateTechnologicalLevel(type: GalacticRace['type'], mentalTraits: GalacticRace['mentalTraits']): GalacticRace['technologicalLevel'] {
    let baseLevel = Math.floor(mentalTraits.intelligence * 0.8) + this.randomBetween(-2, 2);
    baseLevel = Math.max(1, Math.min(10, baseLevel));

    const specializations: { [field: string]: number } = {};
    const fields = ['physics', 'biology', 'engineering', 'computing', 'materials', 'energy', 'space', 'weapons', 'medicine', 'psionics'];
    
    fields.forEach(field => {
      let level = baseLevel + this.randomBetween(-3, 3);
      level = Math.max(1, Math.min(10, level));
      specializations[field] = level;
    });

    // Type-specific adjustments
    switch (type) {
      case 'MACHINE':
        specializations.computing += 2;
        specializations.engineering += 2;
        break;
      case 'ENERGY_BEING':
        specializations.energy += 3;
        specializations.psionics += 2;
        break;
      case 'SILICON_BASED':
        specializations.materials += 2;
        specializations.engineering += 1;
        break;
    }

    // Clamp all values
    Object.keys(specializations).forEach(field => {
      specializations[field] = Math.max(1, Math.min(10, specializations[field]));
    });

    const uniqueTechnologies = this.generateUniqueTechnologies(type, specializations);

    return {
      overall: baseLevel,
      specializations,
      uniqueTechnologies
    };
  }

  private generateUniqueTechnologies(type: GalacticRace['type'], specializations: { [field: string]: number }): string[] {
    const technologies: string[] = [];
    
    // High-level specializations get unique tech
    Object.entries(specializations).forEach(([field, level]) => {
      if (level >= 8) {
        switch (field) {
          case 'physics':
            technologies.push(this.randomChoice(['quantum_tunneling', 'gravity_manipulation', 'time_dilation_fields', 'dimensional_folding']));
            break;
          case 'biology':
            technologies.push(this.randomChoice(['genetic_perfection', 'biological_computers', 'living_ships', 'symbiotic_enhancement']));
            break;
          case 'computing':
            technologies.push(this.randomChoice(['quantum_ai', 'consciousness_transfer', 'reality_simulation', 'predictive_algorithms']));
            break;
          case 'energy':
            technologies.push(this.randomChoice(['zero_point_energy', 'stellar_engineering', 'antimatter_mastery', 'fusion_perfection']));
            break;
        }
      }
    });

    // Type-specific unique technologies
    switch (type) {
      case 'HIVE_MIND':
        technologies.push('collective_intelligence_amplification', 'bio_communication_networks');
        break;
      case 'MACHINE':
        technologies.push('self_replicating_systems', 'digital_consciousness');
        break;
      case 'ENERGY_BEING':
        technologies.push('energy_form_manipulation', 'electromagnetic_mastery');
        break;
    }

    return technologies;
  }

  private generateBiologicalNeeds(type: GalacticRace['type']): GalacticRace['biologicalNeeds'] {
    const base = {
      atmosphere: ['oxygen', 'nitrogen'],
      temperature: { min: -10, max: 40 },
      gravity: { min: 0.5, max: 2.0 },
      radiation: 'LOW' as const,
      diet: 'OMNIVORE' as const
    };

    switch (type) {
      case 'SILICON_BASED':
        return {
          atmosphere: ['carbon_dioxide', 'sulfur_compounds'],
          temperature: { min: 200, max: 800 },
          gravity: { min: 0.8, max: 3.0 },
          radiation: 'HIGH',
          diet: 'MINERAL'
        };
      
      case 'ENERGY_BEING':
        return {
          atmosphere: ['any', 'vacuum_tolerant'],
          temperature: { min: -273, max: 1000 },
          gravity: { min: 0, max: 10 },
          radiation: 'EXTREME',
          diet: 'ENERGY'
        };
      
      case 'MACHINE':
        return {
          atmosphere: ['any', 'vacuum_capable'],
          temperature: { min: -200, max: 500 },
          gravity: { min: 0, max: 5 },
          radiation: 'MODERATE',
          diet: 'SYNTHETIC'
        };
      
      case 'AQUATIC':
        return {
          ...base,
          atmosphere: ['water', 'high_humidity'],
          temperature: { min: 0, max: 30 },
          gravity: { min: 0.3, max: 1.5 },
          diet: this.randomChoice(['CARNIVORE', 'OMNIVORE'])
        };
      
      default:
        return {
          ...base,
          temperature: { 
            min: base.temperature.min + this.randomBetween(-20, 20), 
            max: base.temperature.max + this.randomBetween(-10, 30) 
          },
          gravity: { 
            min: Math.max(0.1, base.gravity.min + this.randomBetween(-0.3, 0)), 
            max: base.gravity.max + this.randomBetween(0, 2) 
          },
          diet: this.randomChoice(['OMNIVORE', 'HERBIVORE', 'CARNIVORE'])
        };
    }
  }

  private generateNamePatterns(raceName: string, type: GalacticRace['type']): GalacticRace['namePatterns'] {
    // Generate phoneme patterns based on race name
    const basePhonemes = this.extractPhonemes(raceName);
    
    const personalNames = this.generateNames(basePhonemes, 20, 'personal');
    const familyNames = this.generateNames(basePhonemes, 15, 'family');
    const titles = this.generateTitles(type);
    const locationNames = this.generateNames(basePhonemes, 25, 'location');
    const organizationNames = this.generateNames(basePhonemes, 15, 'organization');

    return {
      personalNames,
      familyNames,
      titles,
      locationNames,
      organizationNames
    };
  }

  private extractPhonemes(name: string): string[] {
    const consonants = name.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    const vowels = name.match(/[aeiou]/gi) || [];
    
    // Add some variety
    const extraConsonants = ['th', 'sh', 'ch', 'ph', 'gh', 'kh', 'zh'];
    const extraVowels = ['ae', 'ou', 'ei', 'ai', 'oo'];
    
    return [
      ...consonants,
      ...vowels,
      ...this.randomChoices(extraConsonants, 0, 3),
      ...this.randomChoices(extraVowels, 0, 2)
    ];
  }

  private generateNames(phonemes: string[], count: number, type: 'personal' | 'family' | 'location' | 'organization'): string[] {
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let name = '';
      const syllableCount = this.randomBetween(2, 4);
      
      for (let j = 0; j < syllableCount; j++) {
        const consonant = this.randomChoice(phonemes.filter(p => !'aeiou'.includes(p.toLowerCase())));
        const vowel = this.randomChoice(phonemes.filter(p => 'aeiou'.includes(p.toLowerCase())));
        name += consonant + vowel;
      }
      
      // Capitalize appropriately
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      
      // Add type-specific suffixes
      if (type === 'location') {
        const suffixes = ['ia', 'heim', 'stad', 'polis', 'grad', 'burg', 'haven', 'port'];
        if (Math.random() < 0.3) {
          name += this.randomChoice(suffixes);
        }
      } else if (type === 'organization') {
        const prefixes = ['United', 'Free', 'Imperial', 'Sacred', 'Ancient'];
        const suffixes = ['Collective', 'Union', 'Alliance', 'Federation', 'Empire', 'Republic'];
        if (Math.random() < 0.4) {
          name = this.randomChoice(prefixes) + ' ' + name;
        }
        if (Math.random() < 0.3) {
          name += ' ' + this.randomChoice(suffixes);
        }
      }
      
      names.push(name);
    }
    
    return names;
  }

  private generateTitles(type: GalacticRace['type']): string[] {
    const baseTitles = ['Leader', 'Elder', 'Guide', 'Master', 'Chief', 'Prime', 'High', 'Grand'];
    
    switch (type) {
      case 'HIVE_MIND':
        return ['Queen', 'Overmind', 'Nexus', 'Prime Node', 'Collective Voice', 'Hive Speaker'];
      case 'MACHINE':
        return ['Prime Unit', 'Core Processor', 'System Administrator', 'Network Node', 'Data Master', 'Logic Prime'];
      case 'ENERGY_BEING':
        return ['Radiance', 'Luminous One', 'Energy Master', 'Plasma Lord', 'Stellar Voice', 'Cosmic Entity'];
      default:
        return baseTitles.concat(['Commander', 'Admiral', 'General', 'Ambassador', 'Councilor', 'Minister']);
    }
  }

  private generateLanguageCharacteristics(type: GalacticRace['type'], mentalTraits: GalacticRace['mentalTraits']): GalacticRace['languageCharacteristics'] {
    const phonemes = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z'];
    
    let grammar: GalacticRace['languageCharacteristics']['grammar'] = 'SIMPLE';
    let writingSystem: GalacticRace['languageCharacteristics']['writingSystem'] = 'ALPHABETIC';

    if (mentalTraits.intelligence >= 7) grammar = 'COMPLEX';
    if (mentalTraits.psychicAbilities) grammar = 'TELEPATHIC';
    if (type === 'MACHINE') {
      grammar = 'MATHEMATICAL';
      writingSystem = 'DIGITAL';
    }
    if (type === 'ENERGY_BEING') {
      grammar = 'TELEPATHIC';
      writingSystem = 'NONE';
    }

    return {
      phonemes: this.randomChoices(phonemes, 15, 25),
      grammar,
      writingSystem
    };
  }

  private async generateStarSystems() {
    console.log(`🌟 Generating ${this.config.totalSystems} star systems...`);
    
    for (let i = 0; i < this.config.totalSystems; i++) {
      const system = await this.generateSingleSystem();
      this.systems.set(system.id, system);
    }
  }

  private async generateSingleSystem(): Promise<StarSystem> {
    const starTypes = ['G', 'K', 'M', 'F', 'A', 'B', 'O', 'BINARY', 'NEUTRON', 'WHITE_DWARF', 'RED_GIANT'];
    const starType = this.randomChoice(starTypes) as StarSystem['starType'];
    
    // Generate system name
    const systemName = this.generateSystemName();
    const systemId = systemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Generate coordinates in 3D space
    const coordinates = this.generateSystemCoordinates();
    
    // Generate planets based on star type
    const planets = await this.generatePlanetsForSystem(starType, systemId);
    
    // Calculate total population
    const totalPopulation = planets.reduce((sum, planet) => sum + planet.population, 0);
    
    // Determine dominant races (up to 3)
    const dominantRaces = this.selectDominantRaces(Math.min(3, this.races.size));
    
    // Generate system characteristics
    const age = this.generateSystemAge(starType);
    const politicalStatus = this.randomChoice(['UNIFIED', 'CONTESTED', 'NEUTRAL', 'ISOLATED', 'ABANDONED']) as StarSystem['politicalStatus'];
    
    const economicLevel = this.randomBetween(1, 10);
    const militaryPresence = this.randomBetween(1, 10);
    const scientificLevel = this.randomBetween(1, 10);
    const culturalDiversity = this.randomBetween(1, 10);
    
    // Generate resources
    const resources = this.generateSystemResources(starType, planets);
    
    // Generate hazards
    const hazards = this.generateSystemHazards(starType, age);

    return {
      id: systemId,
      name: systemName,
      coordinates,
      starType,
      age,
      planets,
      totalPopulation,
      dominantRaces,
      politicalStatus,
      economicLevel,
      militaryPresence,
      scientificLevel,
      culturalDiversity,
      tradeRoutes: [], // Will be populated later
      resources,
      hazards
    };
  }

  private generateSystemName(): string {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
    const names = ['Centauri', 'Draconis', 'Lyrae', 'Cygni', 'Aquilae', 'Orionis', 'Ursae', 'Leonis', 'Virginis', 'Scorpii', 'Sagittarii', 'Capricorni', 'Aquarii', 'Piscium', 'Arietis', 'Tauri', 'Geminorum', 'Cancri'];
    const numbers = ['1', '2', '3', '4', '5', '7', '9', '11', '13', '17', '19', '23'];
    const designations = ['A', 'B', 'C', 'Prime', 'Major', 'Minor', 'Central', 'Outer'];
    
    const nameType = Math.random();
    
    if (nameType < 0.3) {
      // Greek letter + constellation name
      return this.randomChoice(prefixes) + ' ' + this.randomChoice(names);
    } else if (nameType < 0.6) {
      // Catalog number
      return 'HD ' + this.randomBetween(100000, 999999);
    } else if (nameType < 0.8) {
      // Named system
      const uniqueNames = ['Kepler', 'Gliese', 'Wolf', 'Ross', 'Lacaille', 'Groombridge', 'Piazzi', 'Lalande', 'Struve', 'Hevelius'];
      return this.randomChoice(uniqueNames) + ' ' + this.randomChoice(numbers) + this.randomChoice(designations);
    } else {
      // Exotic names
      const exoticNames = ['Voidstar', 'Nexus Prime', 'Quantum Gate', 'Stellar Forge', 'Cosmic Beacon', 'Infinity Point', 'Dimensional Rift', 'Temporal Anchor'];
      return this.randomChoice(exoticNames);
    }
  }

  private generateSystemCoordinates(): { x: number; y: number; z: number } {
    // Generate coordinates in a galaxy-like distribution
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * this.config.galaxyRadius;
    const height = (Math.random() - 0.5) * this.config.galaxyRadius * 0.1; // Thin disk
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: height
    };
  }

  private async generatePlanetsForSystem(starType: StarSystem['starType'], systemId: string): Promise<Planet[]> {
    const planets: Planet[] = [];
    
    // Determine number of planets based on star type
    let planetCount: number;
    switch (starType) {
      case 'G': planetCount = this.randomBetween(3, 12); break;
      case 'K': planetCount = this.randomBetween(2, 8); break;
      case 'M': planetCount = this.randomBetween(1, 6); break;
      case 'F': planetCount = this.randomBetween(4, 15); break;
      case 'A': planetCount = this.randomBetween(2, 10); break;
      case 'B': planetCount = this.randomBetween(1, 5); break;
      case 'O': planetCount = this.randomBetween(0, 3); break;
      case 'BINARY': planetCount = this.randomBetween(1, 8); break;
      case 'NEUTRON': planetCount = this.randomBetween(0, 2); break;
      case 'WHITE_DWARF': planetCount = this.randomBetween(0, 4); break;
      case 'RED_GIANT': planetCount = this.randomBetween(1, 6); break;
      default: planetCount = this.randomBetween(2, 8);
    }
    
    for (let i = 0; i < planetCount; i++) {
      const planet = await this.generateSinglePlanet(systemId, i + 1, starType);
      planets.push(planet);
    }
    
    return planets;
  }

  private async generateSinglePlanet(systemId: string, orbitalPosition: number, starType: StarSystem['starType']): Promise<Planet> {
    const planetTypes = ['TERRESTRIAL', 'GAS_GIANT', 'ICE_WORLD', 'DESERT', 'OCEAN', 'VOLCANIC', 'ARTIFICIAL', 'ASTEROID_BELT', 'MOON'];
    const sizes = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'MASSIVE'];
    
    const planetType = this.randomChoice(planetTypes) as Planet['type'];
    const size = this.randomChoice(sizes) as Planet['size'];
    
    // Generate planet name
    const planetName = this.generatePlanetName(systemId, orbitalPosition, planetType);
    const planetId = `${systemId}_${planetName.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Generate physical characteristics
    const atmosphere = this.generatePlanetAtmosphere(planetType);
    const temperature = this.generatePlanetTemperature(orbitalPosition, starType, planetType);
    const gravity = this.generatePlanetGravity(size, planetType);
    
    // Generate population and habitability
    const habitability = this.calculateHabitability(atmosphere, temperature, gravity);
    const population = this.generatePlanetPopulation(habitability, size);
    
    // Generate governments
    const governments = await this.generatePlanetGovernments(planetId, population);
    
    // Generate cities
    const cities = await this.generatePlanetCities(planetId, population, governments);
    
    // Generate resources and biomes
    const resources = this.generatePlanetResources(planetType, size);
    const biomes = this.generatePlanetBiomes(planetType, temperature);
    
    // Generate moons
    const moons = await this.generateMoons(planetId, size, planetType);
    
    // Generate orbital characteristics
    const dayLength = this.generateDayLength(size, planetType);
    const yearLength = this.generateYearLength(orbitalPosition);

    return {
      id: planetId,
      name: planetName,
      type: planetType,
      size,
      atmosphere,
      temperature,
      gravity,
      population,
      habitability,
      governments,
      cities,
      resources,
      biomes,
      moons,
      orbitalPosition,
      dayLength,
      yearLength
    };
  }

  private generatePlanetName(systemId: string, position: number, type: Planet['type']): string {
    const systemName = systemId.replace(/_/g, ' ');
    
    // Sometimes use the system name + designation
    if (Math.random() < 0.6) {
      const designations = ['Prime', 'Alpha', 'Beta', 'Gamma', 'Major', 'Minor', 'Central'];
      if (position === 1) return systemName + ' ' + this.randomChoice(designations);
      return systemName + ' ' + this.romanNumeral(position);
    }
    
    // Sometimes use descriptive names based on type
    const typeNames = {
      'TERRESTRIAL': ['Terra', 'Gaia', 'Eden', 'Haven', 'Sanctuary'],
      'GAS_GIANT': ['Titan', 'Colossus', 'Behemoth', 'Leviathan', 'Storm'],
      'ICE_WORLD': ['Frost', 'Glacier', 'Tundra', 'Permafrost', 'Crystal'],
      'DESERT': ['Dune', 'Sahara', 'Wasteland', 'Arid', 'Scorched'],
      'OCEAN': ['Aqua', 'Oceanus', 'Tidal', 'Depths', 'Marina'],
      'VOLCANIC': ['Inferno', 'Forge', 'Magma', 'Ember', 'Crucible'],
      'ARTIFICIAL': ['Construct', 'Synthesis', 'Artifact', 'Creation', 'Genesis']
    };
    
    const names = typeNames[type] || ['World', 'Planet', 'Sphere', 'Orb', 'Globe'];
    return this.randomChoice(names) + ' ' + this.romanNumeral(position);
  }

  private romanNumeral(num: number): string {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i];
        num -= values[i];
      }
    }
    return result;
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

  private selectDominantRaces(count: number): string[] {
    const raceIds = Array.from(this.races.keys());
    return this.randomChoices(raceIds, 1, count);
  }

  private generateSystemAge(starType: StarSystem['starType']): number {
    switch (starType) {
      case 'O':
      case 'B': return this.randomBetween(1, 100) / 1000; // Very young, massive stars
      case 'A': return this.randomBetween(100, 1000) / 1000;
      case 'F': return this.randomBetween(1, 5);
      case 'G': return this.randomBetween(1, 10);
      case 'K': return this.randomBetween(5, 15);
      case 'M': return this.randomBetween(10, 50);
      case 'WHITE_DWARF': return this.randomBetween(5, 13);
      case 'NEUTRON': return this.randomBetween(1, 13);
      case 'RED_GIANT': return this.randomBetween(8, 13);
      default: return this.randomBetween(1, 10);
    }
  }

  private generateSystemResources(starType: StarSystem['starType'], planets: Planet[]): { [resource: string]: number } {
    const resources: { [resource: string]: number } = {};
    
    // Base resources from star type
    const baseResources = ['hydrogen', 'helium', 'metals', 'rare_elements'];
    baseResources.forEach(resource => {
      resources[resource] = this.randomBetween(1, 10);
    });
    
    // Add resources from planets
    planets.forEach(planet => {
      Object.entries(planet.resources || {}).forEach(([resource, amount]) => {
        resources[resource] = (resources[resource] || 0) + amount;
      });
    });
    
    return resources;
  }

  private generateSystemHazards(starType: StarSystem['starType'], age: number): string[] {
    const hazards: string[] = [];
    
    // Star-type specific hazards
    switch (starType) {
      case 'O':
      case 'B':
        hazards.push('extreme_radiation', 'stellar_winds');
        break;
      case 'NEUTRON':
        hazards.push('intense_gravity', 'gamma_radiation', 'magnetic_fields');
        break;
      case 'RED_GIANT':
        hazards.push('stellar_expansion', 'solar_flares');
        break;
      case 'BINARY':
        hazards.push('gravitational_instability', 'tidal_forces');
        break;
    }
    
    // Age-related hazards
    if (age < 1) hazards.push('stellar_formation_debris');
    if (age > 10) hazards.push('stellar_aging_effects');
    
    // Random hazards
    const possibleHazards = ['asteroid_fields', 'cosmic_storms', 'dark_matter_anomalies', 'quantum_fluctuations', 'temporal_distortions'];
    hazards.push(...this.randomChoices(possibleHazards, 0, 2));
    
    return hazards;
  }

  // Additional methods would continue here...
  // This is a substantial system that would need many more methods to be complete
  
  // Public API methods
  getAllRaces(): GalacticRace[] {
    return Array.from(this.races.values());
  }

  getAllSystems(): StarSystem[] {
    return Array.from(this.systems.values());
  }

  getAllCivilizations(): Civilization[] {
    return Array.from(this.civilizations.values());
  }

  getRaceById(raceId: string): GalacticRace | null {
    return this.races.get(raceId) || null;
  }

  getSystemById(systemId: string): StarSystem | null {
    return this.systems.get(systemId) || null;
  }

  getCivilizationById(civId: string): Civilization | null {
    return this.civilizations.get(civId) || null;
  }

  getSystemsByRace(raceId: string): StarSystem[] {
    return Array.from(this.systems.values()).filter(system => 
      system.dominantRaces.includes(raceId)
    );
  }

  getNearbySystemsTo(systemId: string, maxDistance: number): StarSystem[] {
    const targetSystem = this.systems.get(systemId);
    if (!targetSystem) return [];

    return Array.from(this.systems.values()).filter(system => {
      if (system.id === systemId) return false;
      const distance = this.calculateDistance(targetSystem.coordinates, system.coordinates);
      return distance <= maxDistance;
    });
  }

  private calculateDistance(pos1: { x: number; y: number; z: number }, pos2: { x: number; y: number; z: number }): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  getGalaxyStats(): any {
    return {
      totalRaces: this.races.size,
      totalSystems: this.systems.size,
      totalCivilizations: this.civilizations.size,
      totalPopulation: Array.from(this.systems.values()).reduce((sum, system) => sum + system.totalPopulation, 0),
      averageTechLevel: Array.from(this.races.values()).reduce((sum, race) => sum + race.technologicalLevel.overall, 0) / this.races.size,
      galaxyRadius: this.config.galaxyRadius,
      generationSeed: this.generationSeed
    };
  }

  // Placeholder methods for the remaining generation steps
  private async generateCivilizations() {
    console.log('🏛️ Generating civilizations...');
    
    const civilizationCount = this.randomBetween(3, 8);
    const availableRaces = Array.from(this.races.values());
    const availableSystems = Array.from(this.systems.values());
    
    for (let i = 0; i < civilizationCount && i < availableRaces.length; i++) {
      const race = availableRaces[i];
      const homeSystem = availableSystems[i % availableSystems.length];
      const homeworld = homeSystem.planets[0]; // Use first planet as homeworld
      
      const civilization: Civilization = {
        id: `civ_${race.id}`,
        name: `${race.name} ${this.randomChoice(['Empire', 'Republic', 'Federation', 'Alliance', 'Collective', 'Union'])}`,
        race: race.id,
        type: this.randomChoice(['EMPIRE', 'REPUBLIC', 'FEDERATION', 'THEOCRACY', 'CORPORATE', 'HIVE_MIND']),
        homeworld: homeworld?.id || `planet_${homeSystem.id}_1`,
        territory: [homeSystem.id],
        population: this.randomBetween(1000000000, 50000000000),
        government: this.generateCivilizationGovernment(),
        culture: {
          values: race.culturalTraits.values.slice(0, 3),
          artForms: race.culturalTraits.artForms.slice(0, 2),
          philosophy: race.culturalTraits.philosophy
        },
        technology: {
          level: this.randomBetween(5, 9),
          specializations: race.technologicalLevel.specializations,
          uniqueTech: race.technologicalLevel.uniqueTechnologies.slice(0, 2)
        },
        military: {
          strength: this.randomBetween(3, 8),
          doctrine: this.randomChoice(['Defensive', 'Aggressive', 'Balanced', 'Technological', 'Guerrilla']),
          specialUnits: []
        },
        economy: {
          strength: this.randomBetween(4, 9),
          focus: this.randomChoice(['Industrial', 'Trade', 'Research', 'Agriculture', 'Mining', 'Services']),
          tradePartners: []
        },
        diplomacy: {
          relations: new Map(),
          treaties: [],
          reputation: this.randomBetween(-5, 5)
        },
        history: []
      };
      
      this.civilizations.set(civilization.id, civilization);
      
      // Generate civilization logo
      this.generateCivilizationLogo(civilization, race);
    }
    
    console.log(`✅ Generated ${this.civilizations.size} civilizations`);
  }

  private async establishDiplomacy() {
    console.log('🤝 Establishing diplomatic relations...');
    // Implementation would go here
  }

  private async generateTradeNetworks() {
    console.log('💰 Generating trade networks...');
    // Implementation would go here
  }

  private async generateHistory() {
    console.log('📚 Generating historical events...');
    // Implementation would go here
  }

  // Placeholder methods for planet generation
  private generatePlanetAtmosphere(type: Planet['type']): string[] {
    // Implementation would go here
    return ['nitrogen', 'oxygen'];
  }

  private generatePlanetTemperature(position: number, starType: StarSystem['starType'], planetType: Planet['type']): number {
    // Implementation would go here
    return 15;
  }

  private generatePlanetGravity(size: Planet['size'], type: Planet['type']): number {
    // Implementation would go here
    return 1.0;
  }

  private calculateHabitability(atmosphere: string[], temperature: number, gravity: number): number {
    // Implementation would go here
    return 5;
  }

  private generatePlanetPopulation(habitability: number, size: Planet['size']): number {
    // Implementation would go here
    return this.randomBetween(1000, 1000000);
  }

  private async generatePlanetGovernments(planetId: string, population: number): Promise<Government[]> {
    // Implementation would go here
    return [];
  }

  private async generatePlanetCities(planetId: string, population: number, governments: Government[]): Promise<City[]> {
    // Implementation would go here
    return [];
  }

  private generatePlanetResources(type: Planet['type'], size: Planet['size']): { [resource: string]: number } {
    // Implementation would go here
    return {};
  }

  private generatePlanetBiomes(type: Planet['type'], temperature: number): string[] {
    // Implementation would go here
    return ['temperate'];
  }

  private async generateMoons(planetId: string, size: Planet['size'], type: Planet['type']): Promise<Planet[]> {
    // Implementation would go here
    return [];
  }

  private generateDayLength(size: Planet['size'], type: Planet['type']): number {
    // Implementation would go here
    return 24;
  }

  private generateYearLength(orbitalPosition: number): number {
    // Implementation would go here
    return 365;
  }

  /**
   * Generate image for a species/race
   */
  private async generateSpeciesImage(race: GalacticRace): Promise<void> {
    try {
      // Dynamic import to avoid circular dependencies and ensure it works in browser context
      if (typeof window === 'undefined') {
        // Server-side: use the visual integration
        const { getSpeciesVisualIntegration } = await import('../../server/visual-systems/SpeciesVisualIntegration.js');
        const speciesVisual = getSpeciesVisualIntegration();
        
        speciesVisual.queueSpeciesImageGeneration({
          id: race.id,
          name: race.name,
          type: race.type,
          origin: race.origin,
          physicalTraits: race.physicalTraits,
          mentalTraits: race.mentalTraits,
          culturalTraits: race.culturalTraits,
          technologicalLevel: race.technologicalLevel,
          biologicalNeeds: race.biologicalNeeds
        }, 'medium');
      } else {
        // Client-side: queue for later processing or use a different approach
        console.log(`🧬 Species ${race.name} created - image generation queued for server processing`);
      }
    } catch (error) {
      console.warn(`Failed to queue species image generation for ${race.name}:`, error);
    }
  }

  /**
   * Generate government structure for a civilization
   */
  private generateCivilizationGovernment(): CivilizationGovernment {
    const governmentTypes = ['Democracy', 'Empire', 'Republic', 'Federation', 'Theocracy', 'Corporate State', 'Military Junta', 'Collective'];
    const leaderTitles = ['President', 'Emperor', 'Chancellor', 'Prime Minister', 'High Priest', 'CEO', 'General', 'Collective Mind'];
    
    const govType = this.randomChoice(governmentTypes);
    const leaderTitle = this.randomChoice(leaderTitles);
    
    return {
      type: govType,
      leader: {
        title: leaderTitle,
        name: `${leaderTitle} ${this.generateRandomName()}`,
        tenure: this.randomBetween(1, 20)
      },
      structure: {
        branches: this.randomBetween(2, 4),
        decisionMaking: this.randomChoice(['Centralized', 'Distributed', 'Consensus', 'Hierarchical']),
        representation: this.randomChoice(['Direct', 'Representative', 'Appointed', 'Hereditary'])
      },
      policies: {
        economicPolicy: this.randomChoice(['Free Market', 'Planned Economy', 'Mixed Economy', 'Resource Sharing']),
        socialPolicy: this.randomChoice(['Liberal', 'Conservative', 'Progressive', 'Traditional']),
        militaryPolicy: this.randomChoice(['Pacifist', 'Defensive', 'Aggressive', 'Expansionist'])
      }
    };
  }

  /**
   * Generate logo for a civilization
   */
  private async generateCivilizationLogo(civilization: Civilization, race: GalacticRace): Promise<void> {
    try {
      // Dynamic import to avoid circular dependencies and ensure it works in browser context
      if (typeof window === 'undefined') {
        // Server-side: use the logo integration
        const { getLogoVisualIntegration } = await import('../../server/visual-systems/LogoVisualIntegration.js');
        const logoVisual = getLogoVisualIntegration();
        
        await logoVisual.onCivilizationCreated({
          id: civilization.id,
          name: civilization.name,
          type: civilization.type,
          race: race.name,
          values: civilization.culture.values,
          government: civilization.government.type,
          culture: civilization.culture,
          technology: civilization.technology,
          homeworld: civilization.homeworld,
          philosophy: civilization.culture.philosophy
        });
      } else {
        // Client-side: queue for later processing
        console.log(`🏛️ Civilization ${civilization.name} created - logo generation queued for server processing`);
      }
    } catch (error) {
      console.warn(`Failed to generate logo for civilization ${civilization.name}:`, error);
    }
  }

  /**
   * Generate a random name
   */
  private generateRandomName(): string {
    const prefixes = ['Astra', 'Zara', 'Keth', 'Vex', 'Nyx', 'Orion', 'Luna', 'Sol', 'Nova', 'Void'];
    const suffixes = ['ion', 'ara', 'eth', 'ius', 'eon', 'ath', 'iel', 'oss', 'ynn', 'ux'];
    
    return this.randomChoice(prefixes) + this.randomChoice(suffixes);
  }
}

export default GalacticCivilizationGenerator;
