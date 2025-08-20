import { Planet, Government, City, District, GovernmentLeader, GalacticRace } from './GalacticCivilizationGenerator';

export class PlanetarySystemGenerator {
  private races: Map<string, GalacticRace>;

  constructor(races: Map<string, GalacticRace>) {
    this.races = races;
  }

  generatePlanetAtmosphere(type: Planet['type']): string[] {
    const atmospheres: { [key: string]: string[][] } = {
      'TERRESTRIAL': [
        ['nitrogen', 'oxygen'],
        ['nitrogen', 'oxygen', 'argon'],
        ['carbon_dioxide', 'nitrogen'],
        ['methane', 'nitrogen'],
        ['hydrogen', 'helium']
      ],
      'GAS_GIANT': [
        ['hydrogen', 'helium'],
        ['hydrogen', 'helium', 'methane'],
        ['hydrogen', 'helium', 'ammonia'],
        ['hydrogen', 'helium', 'water_vapor']
      ],
      'ICE_WORLD': [
        ['carbon_dioxide', 'nitrogen'],
        ['methane', 'nitrogen'],
        ['water_vapor', 'nitrogen'],
        ['thin_atmosphere']
      ],
      'DESERT': [
        ['carbon_dioxide'],
        ['nitrogen', 'argon'],
        ['thin_atmosphere'],
        ['no_atmosphere']
      ],
      'OCEAN': [
        ['nitrogen', 'oxygen', 'water_vapor'],
        ['carbon_dioxide', 'water_vapor'],
        ['methane', 'water_vapor']
      ],
      'VOLCANIC': [
        ['sulfur_dioxide', 'carbon_dioxide'],
        ['carbon_dioxide', 'sulfur_compounds'],
        ['hydrogen_sulfide', 'carbon_dioxide']
      ],
      'ARTIFICIAL': [
        ['controlled_atmosphere'],
        ['nitrogen', 'oxygen'],
        ['custom_mix']
      ]
    };

    const options = atmospheres[type] || [['nitrogen', 'oxygen']];
    return this.randomChoice(options);
  }

  generatePlanetTemperature(position: number, starType: string, planetType: Planet['type']): number {
    // Base temperature based on orbital position and star type
    let baseTemp = 0;
    
    // Star type temperature modifier
    const starTempModifiers: { [key: string]: number } = {
      'O': 200, 'B': 150, 'A': 100, 'F': 50, 'G': 0, 'K': -50, 'M': -100,
      'BINARY': 25, 'NEUTRON': -200, 'WHITE_DWARF': -150, 'RED_GIANT': 100
    };
    
    baseTemp += starTempModifiers[starType] || 0;
    
    // Distance from star (orbital position)
    baseTemp -= (position - 1) * 30; // Each position out is ~30°C cooler
    
    // Planet type modifiers
    const typeTempModifiers: { [key: string]: number } = {
      'TERRESTRIAL': 0,
      'GAS_GIANT': -50,
      'ICE_WORLD': -100,
      'DESERT': 50,
      'OCEAN': -10,
      'VOLCANIC': 200,
      'ARTIFICIAL': 20
    };
    
    baseTemp += typeTempModifiers[planetType] || 0;
    
    // Add some randomness
    baseTemp += this.randomBetween(-20, 20);
    
    return Math.round(baseTemp);
  }

  generatePlanetGravity(size: Planet['size'], type: Planet['type']): number {
    let baseGravity = 1.0;
    
    // Size modifiers
    const sizeModifiers: { [key: string]: number } = {
      'TINY': 0.3,
      'SMALL': 0.6,
      'MEDIUM': 1.0,
      'LARGE': 1.5,
      'MASSIVE': 2.5
    };
    
    baseGravity *= sizeModifiers[size] || 1.0;
    
    // Type modifiers (density differences)
    const typeModifiers: { [key: string]: number } = {
      'TERRESTRIAL': 1.0,
      'GAS_GIANT': 0.8, // Lower density despite size
      'ICE_WORLD': 0.7,
      'DESERT': 0.9,
      'OCEAN': 0.95,
      'VOLCANIC': 1.2, // Dense metals
      'ARTIFICIAL': 1.0
    };
    
    baseGravity *= typeModifiers[type] || 1.0;
    
    // Add randomness
    baseGravity *= (0.8 + Math.random() * 0.4); // ±20% variation
    
    return Math.round(baseGravity * 100) / 100; // Round to 2 decimal places
  }

  calculateHabitability(atmosphere: string[], temperature: number, gravity: number): number {
    let habitability = 5; // Base habitability
    
    // Atmosphere scoring
    if (atmosphere.includes('oxygen') && atmosphere.includes('nitrogen')) {
      habitability += 3;
    } else if (atmosphere.includes('oxygen')) {
      habitability += 1;
    } else if (atmosphere.includes('carbon_dioxide') && !atmosphere.includes('toxic')) {
      habitability += 0;
    } else if (atmosphere.includes('no_atmosphere') || atmosphere.includes('toxic')) {
      habitability -= 4;
    }
    
    // Temperature scoring (optimal around 15°C)
    const tempDiff = Math.abs(temperature - 15);
    if (tempDiff < 10) habitability += 2;
    else if (tempDiff < 30) habitability += 1;
    else if (tempDiff < 50) habitability -= 1;
    else if (tempDiff < 100) habitability -= 3;
    else habitability -= 5;
    
    // Gravity scoring (optimal around 1.0G)
    const gravityDiff = Math.abs(gravity - 1.0);
    if (gravityDiff < 0.2) habitability += 1;
    else if (gravityDiff < 0.5) habitability += 0;
    else if (gravityDiff < 1.0) habitability -= 1;
    else habitability -= 3;
    
    return Math.max(1, Math.min(10, habitability));
  }

  generatePlanetPopulation(habitability: number, size: Planet['size']): number {
    let basePopulation = 0;
    
    // Size-based population capacity
    const sizeCapacities: { [key: string]: number } = {
      'TINY': 100000,
      'SMALL': 1000000,
      'MEDIUM': 10000000,
      'LARGE': 100000000,
      'MASSIVE': 1000000000
    };
    
    const maxPopulation = sizeCapacities[size] || 10000000;
    
    // Habitability affects actual population
    const habitabilityMultiplier = Math.pow(habitability / 10, 2); // Exponential relationship
    
    basePopulation = Math.floor(maxPopulation * habitabilityMultiplier * (0.1 + Math.random() * 0.9));
    
    // Some planets might be uninhabited
    if (habitability < 3 && Math.random() < 0.7) {
      basePopulation = 0;
    }
    
    return basePopulation;
  }

  async generatePlanetGovernments(planetId: string, population: number): Promise<Government[]> {
    if (population === 0) return [];
    
    const governments: Government[] = [];
    
    // Determine number of governments based on population and political complexity
    let govCount = 1;
    
    if (population > 100000000) govCount = this.randomBetween(2, 8); // Large planets can have many nations
    else if (population > 10000000) govCount = this.randomBetween(1, 4);
    else if (population > 1000000) govCount = this.randomBetween(1, 2);
    
    // Sometimes force single government for simplicity
    if (Math.random() < 0.3) govCount = 1;
    
    const remainingPopulation = population;
    const raceIds = Array.from(this.races.keys());
    
    for (let i = 0; i < govCount; i++) {
      const government = await this.generateSingleGovernment(
        planetId, 
        i, 
        Math.floor(remainingPopulation / govCount), 
        raceIds
      );
      governments.push(government);
    }
    
    return governments;
  }

  private async generateSingleGovernment(planetId: string, index: number, population: number, availableRaces: string[]): Promise<Government> {
    const govTypes = ['DEMOCRACY', 'REPUBLIC', 'MONARCHY', 'THEOCRACY', 'CORPORATE', 'MILITARY', 'ANARCHIST', 'HIVE_MIND', 'AI_CONTROLLED', 'TRIBAL'];
    const ideologies = ['Progressive', 'Conservative', 'Libertarian', 'Authoritarian', 'Socialist', 'Capitalist', 'Nationalist', 'Globalist', 'Environmentalist', 'Technocratic'];
    
    const govType = this.randomChoice(govTypes) as Government['type'];
    const dominantRace = this.randomChoice(availableRaces);
    const minorityRaces = this.randomChoices(availableRaces.filter(r => r !== dominantRace), 0, 3);
    
    const govName = this.generateGovernmentName(govType, dominantRace, planetId);
    const govId = `${planetId}_gov_${index}`;
    
    // Generate leaders
    const leaders = await this.generateGovernmentLeaders(govType, dominantRace);
    
    // Generate stats
    const militaryStrength = this.randomBetween(1, 10);
    const economicPower = this.randomBetween(1, 10);
    const technologicalLevel = this.randomBetween(1, 10);
    const stability = this.randomBetween(3, 9);
    
    // Founded date (within last 1000 years)
    const founded = new Date(Date.now() - Math.random() * 1000 * 365 * 24 * 60 * 60 * 1000);
    
    return {
      id: govId,
      name: govName,
      type: govType,
      territory: [], // Will be populated when cities are generated
      population,
      dominantRace,
      minorityRaces,
      ideology: this.randomChoice(ideologies),
      relationshipsWith: {}, // Will be populated later
      militaryStrength,
      economicPower,
      technologicalLevel,
      stability,
      founded,
      capital: '', // Will be set when cities are generated
      leaders
    };
  }

  private generateGovernmentName(type: Government['type'], dominantRace: string, planetId: string): string {
    const race = this.races.get(dominantRace);
    const raceName = race?.name || 'Unknown';
    const planetName = planetId.split('_').slice(-1)[0];
    
    const typeNames: { [key: string]: string[] } = {
      'DEMOCRACY': ['Democratic Republic of', 'United Provinces of', 'Free States of'],
      'REPUBLIC': ['Republic of', 'Federal Republic of', 'Sovereign Republic of'],
      'MONARCHY': ['Kingdom of', 'Empire of', 'Royal Domain of'],
      'THEOCRACY': ['Sacred Order of', 'Divine Realm of', 'Holy Empire of'],
      'CORPORATE': ['Corporate State of', 'Trade Federation of', 'Commercial Union of'],
      'MILITARY': ['Military Junta of', 'Armed Forces of', 'Defense Council of'],
      'ANARCHIST': ['Free Territories of', 'Autonomous Zones of', 'Liberation Front of'],
      'HIVE_MIND': ['Collective of', 'Unity of', 'Hive of'],
      'AI_CONTROLLED': ['Synthetic Governance of', 'AI Administration of', 'Digital State of'],
      'TRIBAL': ['Tribal Confederation of', 'Clans of', 'Traditional Lands of']
    };
    
    const prefixes = typeNames[type] || ['Government of'];
    const prefix = this.randomChoice(prefixes);
    
    // Sometimes use race name, sometimes planet name
    const baseName = Math.random() < 0.6 ? raceName : planetName;
    
    return `${prefix} ${baseName}`;
  }

  private async generateGovernmentLeaders(type: Government['type'], dominantRace: string): Promise<GovernmentLeader[]> {
    const leaders: GovernmentLeader[] = [];
    const race = this.races.get(dominantRace);
    
    if (!race) return leaders;
    
    // Determine number and types of leaders based on government type
    const leadershipStructures: { [key: string]: string[] } = {
      'DEMOCRACY': ['President', 'Prime Minister', 'Speaker'],
      'REPUBLIC': ['Chancellor', 'Senator', 'Consul'],
      'MONARCHY': ['King', 'Queen', 'Prince', 'Duke'],
      'THEOCRACY': ['High Priest', 'Prophet', 'Cardinal', 'Oracle'],
      'CORPORATE': ['CEO', 'Chairman', 'Director', 'Executive'],
      'MILITARY': ['General', 'Admiral', 'Commander', 'Marshal'],
      'ANARCHIST': ['Coordinator', 'Representative', 'Delegate'],
      'HIVE_MIND': ['Queen', 'Overmind', 'Prime Node'],
      'AI_CONTROLLED': ['Core AI', 'Primary Node', 'System Administrator'],
      'TRIBAL': ['Chief', 'Elder', 'Shaman', 'War Leader']
    };
    
    const positions = leadershipStructures[type] || ['Leader'];
    const leaderCount = Math.min(positions.length, this.randomBetween(1, 4));
    
    for (let i = 0; i < leaderCount; i++) {
      const leader = this.generateSingleLeader(positions[i], race);
      leaders.push(leader);
    }
    
    return leaders;
  }

  private generateSingleLeader(position: string, race: GalacticRace): GovernmentLeader {
    const name = this.generateLeaderName(race);
    const leaderId = `leader_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate personality stats
    const personality = {
      diplomacy: this.randomBetween(1, 10),
      aggression: this.randomBetween(1, 10),
      intelligence: this.randomBetween(3, 10),
      charisma: this.randomBetween(1, 10),
      ambition: this.randomBetween(1, 10)
    };
    
    // Generate background
    const backgrounds = [
      'Former military officer', 'Career politician', 'Business leader', 'Academic scholar',
      'Religious figure', 'Revolutionary leader', 'Diplomatic envoy', 'Technical expert',
      'Popular activist', 'Hereditary noble', 'Self-made entrepreneur', 'Veteran administrator'
    ];
    
    const background = this.randomChoice(backgrounds);
    
    // Generate age based on race lifespan
    const maxAge = race.physicalTraits.averageLifespan;
    const minLeaderAge = Math.max(20, maxAge * 0.2); // At least 20% of lifespan
    const maxLeaderAge = Math.min(maxAge * 0.9, maxAge - 10); // Not too old
    
    const age = this.randomBetween(minLeaderAge, maxLeaderAge);
    
    // Term length (-1 for life, otherwise years)
    let termLength = -1;
    if (position.includes('President') || position.includes('Prime Minister')) {
      termLength = this.randomBetween(4, 8);
    } else if (position.includes('Senator') || position.includes('Representative')) {
      termLength = this.randomBetween(2, 6);
    }
    
    return {
      id: leaderId,
      name,
      race: race.id,
      position,
      personality,
      background,
      age,
      termLength
    };
  }

  private generateLeaderName(race: GalacticRace): string {
    const firstName = this.randomChoice(race.namePatterns.personalNames);
    const lastName = this.randomChoice(race.namePatterns.familyNames);
    const title = Math.random() < 0.3 ? this.randomChoice(race.namePatterns.titles) + ' ' : '';
    
    return `${title}${firstName} ${lastName}`;
  }

  async generatePlanetCities(planetId: string, population: number, governments: Government[]): Promise<City[]> {
    if (population === 0) return [];
    
    const cities: City[] = [];
    
    // Determine number of cities based on population
    let cityCount = 1;
    if (population > 100000000) cityCount = this.randomBetween(8, 20);
    else if (population > 10000000) cityCount = this.randomBetween(4, 12);
    else if (population > 1000000) cityCount = this.randomBetween(2, 6);
    else if (population > 100000) cityCount = this.randomBetween(1, 3);
    
    const remainingPopulation = population;
    
    for (let i = 0; i < cityCount; i++) {
      const city = await this.generateSingleCity(planetId, i, remainingPopulation, governments);
      cities.push(city);
      
      // Set capital city for governments
      if (i === 0 && governments.length > 0) {
        governments[0].capital = city.id;
        governments[0].territory.push(city.id);
      }
    }
    
    // Distribute remaining cities among governments
    for (let i = 1; i < cities.length; i++) {
      const government = this.randomChoice(governments);
      government.territory.push(cities[i].id);
    }
    
    return cities;
  }

  private async generateSingleCity(planetId: string, index: number, totalPopulation: number, governments: Government[]): Promise<City> {
    const cityTypes = ['CAPITAL', 'MEGACITY', 'INDUSTRIAL', 'RESEARCH', 'MILITARY', 'TRADE', 'RESIDENTIAL', 'MINING', 'AGRICULTURAL', 'SPACEPORT', 'RESORT', 'RELIGIOUS'];
    
    let cityType = this.randomChoice(cityTypes) as City['type'];
    
    // First city is usually capital
    if (index === 0 && governments.length > 0) {
      cityType = 'CAPITAL';
    }
    
    // Generate city population (distributed unevenly)
    const populationWeights = [0.4, 0.2, 0.15, 0.1, 0.08, 0.05, 0.02]; // First city gets most population
    const weight = populationWeights[Math.min(index, populationWeights.length - 1)] || 0.01;
    const cityPopulation = Math.floor(totalPopulation * weight * (0.5 + Math.random()));
    
    // Generate city name
    const race = governments.length > 0 ? this.races.get(governments[0].dominantRace) : null;
    const cityName = this.generateCityName(race, cityType, planetId);
    const cityId = `${planetId}_${cityName.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Select controlling government
    const governmentId = governments.length > 0 ? governments[0].id : '';
    const dominantRace = governments.length > 0 ? governments[0].dominantRace : '';
    
    // Generate race distribution
    const raceDistribution: { [raceId: string]: number } = {};
    if (dominantRace) {
      raceDistribution[dominantRace] = Math.floor(cityPopulation * (0.6 + Math.random() * 0.3));
      
      // Add minority races
      const minorityRaces = governments[0].minorityRaces || [];
      let remainingPop = cityPopulation - raceDistribution[dominantRace];
      
      minorityRaces.forEach((raceId, i) => {
        const portion = remainingPop * (0.3 + Math.random() * 0.4) / (minorityRaces.length - i);
        raceDistribution[raceId] = Math.floor(portion);
        remainingPop -= raceDistribution[raceId];
      });
    }
    
    // Generate specializations based on city type
    const specializations = this.generateCitySpecializations(cityType);
    
    // Generate infrastructure
    const infrastructure = this.generateCityInfrastructure(cityType, cityPopulation);
    
    // Generate coordinates (random placement on planet surface)
    const coordinates = {
      x: Math.random() * 360 - 180, // Longitude
      y: Math.random() * 180 - 90   // Latitude
    };
    
    // Founded date
    const founded = new Date(Date.now() - Math.random() * 500 * 365 * 24 * 60 * 60 * 1000);
    
    // Generate districts
    const districts = this.generateCityDistricts(cityId, cityPopulation, dominantRace);
    
    return {
      id: cityId,
      name: cityName,
      planetId,
      population: cityPopulation,
      type: cityType,
      governmentId,
      dominantRace,
      raceDistribution,
      specializations,
      infrastructure,
      coordinates,
      founded,
      districts
    };
  }

  private generateCityName(race: GalacticRace | null, type: City['type'], planetId: string): string {
    if (race) {
      const baseName = this.randomChoice(race.namePatterns.locationNames);
      
      // Add type-specific suffixes
      const typeSuffixes: { [key: string]: string[] } = {
        'CAPITAL': ['Central', 'Prime', 'Major', 'Grand'],
        'INDUSTRIAL': ['Works', 'Mills', 'Forge', 'Factory'],
        'RESEARCH': ['Labs', 'Institute', 'Academy', 'Complex'],
        'MILITARY': ['Base', 'Fort', 'Garrison', 'Stronghold'],
        'TRADE': ['Port', 'Market', 'Exchange', 'Hub'],
        'SPACEPORT': ['Spaceport', 'Terminal', 'Gateway', 'Station'],
        'MINING': ['Mines', 'Quarry', 'Excavation', 'Pit'],
        'AGRICULTURAL': ['Fields', 'Farms', 'Harvest', 'Grove']
      };
      
      const suffixes = typeSuffixes[type];
      if (suffixes && Math.random() < 0.4) {
        return `${baseName} ${this.randomChoice(suffixes)}`;
      }
      
      return baseName;
    }
    
    // Fallback generic names
    const genericNames = ['New Haven', 'Starlight City', 'Harmony Station', 'Unity Point', 'Progress City', 'Liberty Town'];
    return this.randomChoice(genericNames);
  }

  private generateCitySpecializations(type: City['type']): string[] {
    const specializationMap: { [key: string]: string[] } = {
      'CAPITAL': ['Government', 'Administration', 'Diplomacy', 'Law'],
      'MEGACITY': ['Commerce', 'Finance', 'Culture', 'Entertainment'],
      'INDUSTRIAL': ['Manufacturing', 'Heavy Industry', 'Processing', 'Assembly'],
      'RESEARCH': ['Science', 'Technology', 'Innovation', 'Education'],
      'MILITARY': ['Defense', 'Training', 'Logistics', 'Intelligence'],
      'TRADE': ['Commerce', 'Banking', 'Import/Export', 'Logistics'],
      'RESIDENTIAL': ['Housing', 'Services', 'Community', 'Recreation'],
      'MINING': ['Resource Extraction', 'Processing', 'Geology', 'Heavy Equipment'],
      'AGRICULTURAL': ['Food Production', 'Farming', 'Livestock', 'Processing'],
      'SPACEPORT': ['Transportation', 'Cargo', 'Passenger Services', 'Maintenance'],
      'RESORT': ['Tourism', 'Entertainment', 'Hospitality', 'Recreation'],
      'RELIGIOUS': ['Worship', 'Pilgrimage', 'Spiritual Guidance', 'Ceremony']
    };
    
    const baseSpecs = specializationMap[type] || ['General'];
    return this.randomChoices(baseSpecs, 1, Math.min(baseSpecs.length, 3));
  }

  private generateCityInfrastructure(type: City['type'], population: number): City['infrastructure'] {
    const baseInfra = {
      spaceport: false,
      defenses: this.randomBetween(1, 5),
      industry: this.randomBetween(1, 5),
      research: this.randomBetween(1, 5),
      culture: this.randomBetween(1, 5)
    };
    
    // Population scaling
    const popScale = Math.min(10, Math.log10(population) - 3); // Scale from 1000 to 10B
    Object.keys(baseInfra).forEach(key => {
      if (key !== 'spaceport') {
        (baseInfra as any)[key] = Math.min(10, (baseInfra as any)[key] + Math.floor(popScale));
      }
    });
    
    // Type-specific bonuses
    switch (type) {
      case 'CAPITAL':
        baseInfra.defenses += 3;
        baseInfra.culture += 2;
        baseInfra.spaceport = true;
        break;
      case 'INDUSTRIAL':
        baseInfra.industry += 4;
        break;
      case 'RESEARCH':
        baseInfra.research += 4;
        break;
      case 'MILITARY':
        baseInfra.defenses += 5;
        break;
      case 'SPACEPORT':
        baseInfra.spaceport = true;
        baseInfra.industry += 2;
        break;
    }
    
    // Clamp values
    Object.keys(baseInfra).forEach(key => {
      if (key !== 'spaceport') {
        (baseInfra as any)[key] = Math.min(10, Math.max(1, (baseInfra as any)[key]));
      }
    });
    
    return baseInfra;
  }

  private generateCityDistricts(cityId: string, population: number, dominantRace: string): District[] {
    const districts: District[] = [];
    
    // Number of districts based on population
    let districtCount = 1;
    if (population > 10000000) districtCount = this.randomBetween(8, 15);
    else if (population > 1000000) districtCount = this.randomBetween(4, 8);
    else if (population > 100000) districtCount = this.randomBetween(2, 4);
    
    const districtTypes = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'GOVERNMENT', 'MILITARY', 'CULTURAL', 'EDUCATIONAL', 'MEDICAL', 'SPACEPORT', 'SLUMS'];
    
    for (let i = 0; i < districtCount; i++) {
      const districtType = this.randomChoice(districtTypes) as District['type'];
      const districtPopulation = Math.floor(population / districtCount * (0.5 + Math.random()));
      
      const district: District = {
        id: `${cityId}_district_${i}`,
        name: `${districtType.toLowerCase().replace('_', ' ')} District ${i + 1}`,
        type: districtType,
        population: districtPopulation,
        dominantRace,
        specialFeatures: this.generateDistrictFeatures(districtType)
      };
      
      districts.push(district);
    }
    
    return districts;
  }

  private generateDistrictFeatures(type: District['type']): string[] {
    const featureMap: { [key: string]: string[] } = {
      'RESIDENTIAL': ['Parks', 'Schools', 'Shopping Centers', 'Community Centers'],
      'COMMERCIAL': ['Markets', 'Banks', 'Offices', 'Retail Stores'],
      'INDUSTRIAL': ['Factories', 'Warehouses', 'Power Plants', 'Processing Facilities'],
      'GOVERNMENT': ['Administrative Buildings', 'Courts', 'Police Stations', 'City Hall'],
      'MILITARY': ['Barracks', 'Training Grounds', 'Armories', 'Command Centers'],
      'CULTURAL': ['Museums', 'Theaters', 'Art Galleries', 'Concert Halls'],
      'EDUCATIONAL': ['Universities', 'Research Labs', 'Libraries', 'Training Centers'],
      'MEDICAL': ['Hospitals', 'Clinics', 'Medical Research', 'Emergency Services'],
      'SPACEPORT': ['Landing Pads', 'Cargo Terminals', 'Passenger Terminals', 'Maintenance Bays'],
      'SLUMS': ['Overcrowded Housing', 'Black Markets', 'Underground Economy', 'Gang Territory']
    };
    
    const features = featureMap[type] || ['General Buildings'];
    return this.randomChoices(features, 1, 3);
  }

  generatePlanetResources(type: Planet['type'], size: Planet['size']): { [resource: string]: number } {
    const resources: { [resource: string]: number } = {};
    
    // Size affects resource abundance
    const sizeMultipliers: { [key: string]: number } = {
      'TINY': 0.3, 'SMALL': 0.6, 'MEDIUM': 1.0, 'LARGE': 1.5, 'MASSIVE': 2.0
    };
    const sizeMultiplier = sizeMultipliers[size] || 1.0;
    
    // Type-specific resources
    const typeResources: { [key: string]: string[] } = {
      'TERRESTRIAL': ['iron', 'copper', 'aluminum', 'rare_metals', 'uranium', 'water', 'organic_compounds'],
      'GAS_GIANT': ['hydrogen', 'helium', 'methane', 'ammonia', 'rare_gases'],
      'ICE_WORLD': ['water', 'methane', 'ammonia', 'frozen_gases'],
      'DESERT': ['silicon', 'rare_metals', 'crystals', 'minerals'],
      'OCEAN': ['water', 'organic_compounds', 'salt', 'marine_resources'],
      'VOLCANIC': ['sulfur', 'rare_metals', 'geothermal_energy', 'volcanic_glass'],
      'ARTIFICIAL': ['advanced_materials', 'energy_cells', 'synthetic_compounds']
    };
    
    const availableResources = typeResources[type] || ['common_minerals'];
    
    availableResources.forEach(resource => {
      const baseAmount = this.randomBetween(1, 10);
      resources[resource] = Math.floor(baseAmount * sizeMultiplier);
    });
    
    return resources;
  }

  generatePlanetBiomes(type: Planet['type'], temperature: number): string[] {
    const biomes: string[] = [];
    
    // Temperature-based biomes
    if (temperature < -50) {
      biomes.push('frozen_wasteland', 'ice_caps', 'permafrost');
    } else if (temperature < 0) {
      biomes.push('tundra', 'taiga', 'alpine');
    } else if (temperature < 20) {
      biomes.push('temperate_forest', 'grassland', 'deciduous_forest');
    } else if (temperature < 40) {
      biomes.push('tropical_forest', 'savanna', 'wetlands');
    } else {
      biomes.push('desert', 'arid_scrubland', 'volcanic_plains');
    }
    
    // Type-specific biomes
    const typeBiomes: { [key: string]: string[] } = {
      'OCEAN': ['deep_ocean', 'coral_reefs', 'abyssal_plains', 'hydrothermal_vents'],
      'VOLCANIC': ['lava_fields', 'volcanic_mountains', 'geysers', 'sulfur_springs'],
      'ICE_WORLD': ['ice_sheets', 'frozen_seas', 'ice_caves', 'glacial_valleys'],
      'DESERT': ['sand_dunes', 'rocky_outcrops', 'salt_flats', 'canyons'],
      'GAS_GIANT': ['atmospheric_layers', 'storm_systems', 'cloud_formations'],
      'ARTIFICIAL': ['constructed_environments', 'managed_ecosystems', 'urban_zones']
    };
    
    if (typeBiomes[type]) {
      biomes.push(...this.randomChoices(typeBiomes[type], 1, 3));
    }
    
    return biomes;
  }

  async generateMoons(planetId: string, size: Planet['size'], type: Planet['type']): Promise<Planet[]> {
    const moons: Planet[] = [];
    
    // Determine number of moons
    let moonCount = 0;
    
    switch (size) {
      case 'MASSIVE':
        moonCount = this.randomBetween(2, 8);
        break;
      case 'LARGE':
        moonCount = this.randomBetween(1, 4);
        break;
      case 'MEDIUM':
        moonCount = this.randomBetween(0, 2);
        break;
      case 'SMALL':
        moonCount = this.randomBetween(0, 1);
        break;
      case 'TINY':
        moonCount = 0;
        break;
    }
    
    // Gas giants often have many moons
    if (type === 'GAS_GIANT') {
      moonCount = Math.max(moonCount, this.randomBetween(3, 12));
    }
    
    for (let i = 0; i < moonCount; i++) {
      const moon = await this.generateSingleMoon(planetId, i + 1);
      moons.push(moon);
    }
    
    return moons;
  }

  private async generateSingleMoon(planetId: string, moonNumber: number): Promise<Planet> {
    const moonTypes = ['MOON', 'ICE_WORLD', 'VOLCANIC', 'ASTEROID_BELT'];
    const moonSizes = ['TINY', 'SMALL', 'MEDIUM'];
    
    const moonType = this.randomChoice(moonTypes) as Planet['type'];
    const moonSize = this.randomChoice(moonSizes) as Planet['size'];
    
    const moonName = `${planetId.split('_').slice(-1)[0]} ${this.romanNumeral(moonNumber)}`;
    const moonId = `${planetId}_moon_${moonNumber}`;
    
    // Moons are generally colder and have thin atmospheres
    const atmosphere = moonType === 'ICE_WORLD' ? ['thin_atmosphere'] : ['no_atmosphere'];
    const temperature = this.randomBetween(-100, -20);
    const gravity = this.generatePlanetGravity(moonSize, moonType) * 0.5; // Moons have lower gravity
    
    const habitability = this.calculateHabitability(atmosphere, temperature, gravity);
    const population = this.generatePlanetPopulation(habitability, moonSize);
    
    const governments = await this.generatePlanetGovernments(moonId, population);
    const cities = await this.generatePlanetCities(moonId, population, governments);
    const resources = this.generatePlanetResources(moonType, moonSize);
    const biomes = this.generatePlanetBiomes(moonType, temperature);
    
    return {
      id: moonId,
      name: moonName,
      type: moonType,
      size: moonSize,
      atmosphere,
      temperature,
      gravity,
      population,
      habitability,
      governments,
      cities,
      resources,
      biomes,
      moons: [], // Moons don't have sub-moons
      orbitalPosition: moonNumber,
      dayLength: this.generateDayLength(moonSize, moonType),
      yearLength: this.randomBetween(7, 30) // Orbital period around parent planet
    };
  }

  generateDayLength(size: Planet['size'], type: Planet['type']): number {
    let baseLength = 24; // Earth hours
    
    // Size affects rotation
    const sizeModifiers: { [key: string]: number } = {
      'TINY': 0.5, 'SMALL': 0.8, 'MEDIUM': 1.0, 'LARGE': 1.3, 'MASSIVE': 1.8
    };
    
    baseLength *= sizeModifiers[size] || 1.0;
    
    // Type affects rotation
    if (type === 'GAS_GIANT') baseLength *= 0.4; // Gas giants rotate faster
    if (type === 'ICE_WORLD') baseLength *= 1.2; // Ice worlds rotate slower
    
    // Add randomness
    baseLength *= (0.5 + Math.random()); // 50% to 150% variation
    
    return Math.round(baseLength * 10) / 10; // Round to 1 decimal
  }

  generateYearLength(orbitalPosition: number): number {
    // Rough approximation based on Kepler's laws
    const baseYear = 365; // Earth days
    const yearLength = baseYear * Math.pow(orbitalPosition, 1.5);
    
    // Add some randomness
    return Math.round(yearLength * (0.8 + Math.random() * 0.4));
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
}

export default PlanetarySystemGenerator;
