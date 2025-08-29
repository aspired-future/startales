import { Pool } from 'pg';
import { CityMarket } from './economicEcosystemSchema';

export class DynamicCityGenerator {
  constructor(private pool: Pool) {}

  // City Name Generation Patterns
  private cityNamePatterns = {
    prefixes: {
      technology: ['Neo', 'Quantum', 'Digital', 'Cyber', 'Smart', 'Advanced', 'Future', 'Tech', 'Data', 'AI'],
      industrial: ['Industrial', 'Manufacturing', 'Production', 'Factory', 'Steel', 'Heavy', 'Forge', 'Mill', 'Works', 'Plant'],
      financial: ['Financial', 'Banking', 'Capital', 'Investment', 'Trade', 'Commerce', 'Market', 'Exchange', 'Credit', 'Wealth'],
      research: ['Research', 'Science', 'Innovation', 'Discovery', 'Laboratory', 'Academic', 'Institute', 'Study', 'Experimental', 'Pioneer'],
      military: ['Defense', 'Military', 'Strategic', 'Security', 'Guardian', 'Fortress', 'Shield', 'Sentinel', 'Bastion', 'Outpost'],
      mining: ['Mining', 'Extraction', 'Resource', 'Mineral', 'Ore', 'Crystal', 'Quarry', 'Excavation', 'Harvest', 'Drilling'],
      agricultural: ['Agricultural', 'Farming', 'Harvest', 'Crop', 'Garden', 'Grove', 'Field', 'Pastoral', 'Rural', 'Green'],
      energy: ['Energy', 'Power', 'Fusion', 'Solar', 'Grid', 'Reactor', 'Generator', 'Electric', 'Plasma', 'Atomic'],
      transport: ['Transport', 'Logistics', 'Shipping', 'Cargo', 'Fleet', 'Port', 'Hub', 'Terminal', 'Junction', 'Gateway'],
      residential: ['New', 'Greater', 'Central', 'Metropolitan', 'Urban', 'City', 'Town', 'Settlement', 'Colony', 'Haven']
    },
    
    descriptors: {
      geographic: ['Valley', 'Heights', 'Ridge', 'Plains', 'Bay', 'Harbor', 'Mesa', 'Canyon', 'Delta', 'Plateau', 'Basin', 'Crater', 'Dome', 'Spire'],
      directional: ['North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower', 'Inner', 'Outer', 'Prime'],
      quality: ['Prime', 'Major', 'Grand', 'Great', 'Supreme', 'Elite', 'Superior', 'Advanced', 'Premium', 'Ultimate'],
      numeric: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'One', 'Two', 'Three', 'First', 'Second', 'Third']
    },

    suffixes: {
      city: ['City', 'Town', 'Settlement', 'Colony', 'Metropolis', 'District', 'Center', 'Complex', 'Base', 'Station'],
      geographic: ['Valley', 'Heights', 'Ridge', 'Plains', 'Bay', 'Harbor', 'Mesa', 'Canyon', 'Delta', 'Plateau'],
      functional: ['Hub', 'Center', 'Complex', 'District', 'Zone', 'Sector', 'Quarter', 'Park', 'Plaza', 'Square']
    }
  };

  // Civilization-specific naming themes
  private civilizationThemes = {
    1: { // Terran Republic
      cultural: ['Geneva', 'Silicon', 'Manhattan', 'Oxford', 'Cambridge', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Stockholm'],
      historical: ['Washington', 'Lincoln', 'Roosevelt', 'Churchill', 'Kennedy', 'Tesla', 'Einstein', 'Newton', 'Darwin', 'Galileo'],
      aspirational: ['Liberty', 'Freedom', 'Unity', 'Progress', 'Harmony', 'Prosperity', 'Victory', 'Glory', 'Honor', 'Justice']
    },
    2: { // Alpha Centauri
      stellar: ['Centauri', 'Proxima', 'Alpha', 'Binary', 'Stellar', 'Cosmic', 'Nebula', 'Pulsar', 'Quasar', 'Galaxy'],
      exploration: ['Pioneer', 'Explorer', 'Frontier', 'Discovery', 'Venture', 'Quest', 'Journey', 'Expedition', 'Scout', 'Pathfinder'],
      unity: ['Alliance', 'Union', 'Federation', 'Coalition', 'Consortium', 'League', 'Assembly', 'Council', 'Congress', 'Senate']
    },
    3: { // Vega Prime
      excellence: ['Prime', 'Supreme', 'Elite', 'Superior', 'Premium', 'Apex', 'Peak', 'Summit', 'Crown', 'Pinnacle'],
      power: ['Dominion', 'Empire', 'Sovereignty', 'Authority', 'Command', 'Control', 'Mastery', 'Rule', 'Reign', 'Dynasty'],
      achievement: ['Victory', 'Triumph', 'Success', 'Achievement', 'Accomplishment', 'Excellence', 'Distinction', 'Merit', 'Honor', 'Glory']
    },
    4: { // Sirius Federation
      commerce: ['Trade', 'Commerce', 'Market', 'Exchange', 'Banking', 'Finance', 'Investment', 'Capital', 'Wealth', 'Prosperity'],
      cooperation: ['Federation', 'Alliance', 'Partnership', 'Cooperation', 'Collaboration', 'Syndicate', 'Consortium', 'Network', 'Guild', 'Association'],
      stability: ['Stability', 'Security', 'Reliability', 'Trust', 'Assurance', 'Confidence', 'Certainty', 'Foundation', 'Anchor', 'Bedrock']
    },
    5: { // Proxima Alliance
      frontier: ['Frontier', 'Outpost', 'Border', 'Edge', 'Limit', 'Boundary', 'Perimeter', 'Margin', 'Threshold', 'Gateway'],
      resilience: ['Endurance', 'Persistence', 'Resilience', 'Fortitude', 'Strength', 'Courage', 'Determination', 'Resolve', 'Tenacity', 'Grit'],
      hope: ['Hope', 'Dawn', 'Rising', 'Emergence', 'Ascent', 'Growth', 'Progress', 'Advance', 'Forward', 'Future']
    }
  };

  // Industry specialization patterns
  private industrySpecializations = {
    technology: {
      primary: ['Quantum Computing', 'Artificial Intelligence', 'Neural Interfaces', 'Robotics', 'Nanotechnology'],
      secondary: ['Software Development', 'Data Analytics', 'Cybersecurity', 'Cloud Computing', 'Blockchain'],
      infrastructure: ['Data Centers', 'Research Labs', 'Innovation Hubs', 'Tech Incubators', 'Development Centers']
    },
    healthcare: {
      primary: ['Biotechnology', 'Genetic Engineering', 'Regenerative Medicine', 'Pharmaceutical Research', 'Medical Devices'],
      secondary: ['Clinical Research', 'Diagnostic Services', 'Therapeutic Development', 'Health Analytics', 'Telemedicine'],
      infrastructure: ['Medical Centers', 'Research Hospitals', 'Biotech Labs', 'Clinical Facilities', 'Health Networks']
    },
    energy: {
      primary: ['Fusion Power', 'Solar Energy', 'Quantum Batteries', 'Antimatter Research', 'Grid Management'],
      secondary: ['Energy Storage', 'Power Distribution', 'Renewable Systems', 'Efficiency Optimization', 'Smart Grids'],
      infrastructure: ['Power Plants', 'Energy Storage', 'Distribution Networks', 'Research Reactors', 'Grid Control']
    },
    manufacturing: {
      primary: ['Advanced Materials', 'Precision Engineering', 'Automated Production', 'Quality Systems', 'Supply Chain'],
      secondary: ['Robotics Integration', 'Process Optimization', 'Lean Manufacturing', 'Additive Manufacturing', 'Assembly Systems'],
      infrastructure: ['Production Facilities', 'Assembly Lines', 'Quality Labs', 'Logistics Centers', 'Maintenance Hubs']
    },
    financial: {
      primary: ['Interstellar Banking', 'Investment Services', 'Currency Exchange', 'Risk Management', 'Asset Management'],
      secondary: ['Insurance Services', 'Credit Systems', 'Payment Processing', 'Financial Analytics', 'Regulatory Compliance'],
      infrastructure: ['Banking Centers', 'Trading Floors', 'Data Centers', 'Security Operations', 'Customer Service']
    },
    defense: {
      primary: ['Weapons Systems', 'Aerospace Technology', 'Cybersecurity', 'Intelligence Systems', 'Strategic Planning'],
      secondary: ['Military Equipment', 'Communication Systems', 'Surveillance Technology', 'Logistics Support', 'Training Systems'],
      infrastructure: ['Defense Facilities', 'Research Centers', 'Testing Ranges', 'Command Centers', 'Security Operations']
    },
    materials: {
      primary: ['Space Mining', 'Resource Extraction', 'Material Processing', 'Rare Elements', 'Composite Materials'],
      secondary: ['Refining Operations', 'Quality Control', 'Supply Chain', 'Environmental Management', 'Safety Systems'],
      infrastructure: ['Mining Operations', 'Processing Plants', 'Storage Facilities', 'Transportation Networks', 'Research Labs']
    },
    transportation: {
      primary: ['Interstellar Shipping', 'Logistics Networks', 'Fleet Management', 'Route Optimization', 'Cargo Systems'],
      secondary: ['Maintenance Services', 'Fuel Systems', 'Navigation Technology', 'Safety Systems', 'Regulatory Compliance'],
      infrastructure: ['Spaceports', 'Logistics Hubs', 'Maintenance Facilities', 'Fuel Depots', 'Control Centers']
    },
    research: {
      primary: ['Fundamental Research', 'Applied Sciences', 'Innovation Development', 'Technology Transfer', 'Academic Programs'],
      secondary: ['Collaborative Research', 'Patent Development', 'Prototype Testing', 'Knowledge Management', 'Education Services'],
      infrastructure: ['Universities', 'Research Institutes', 'Innovation Centers', 'Testing Facilities', 'Academic Networks']
    }
  };

  // Generate city name based on specialization and civilization
  generateCityName(civilizationId: number, specialization: string): string {
    const themes = this.civilizationThemes[civilizationId as keyof typeof this.civilizationThemes] || this.civilizationThemes[1];
    const prefixes = this.cityNamePatterns.prefixes[specialization as keyof typeof this.cityNamePatterns.prefixes] || this.cityNamePatterns.prefixes.residential;
    
    // 40% chance of using civilization-specific theme
    if (Math.random() < 0.4) {
      const themeKeys = Object.keys(themes);
      const selectedTheme = themes[themeKeys[Math.floor(Math.random() * themeKeys.length)] as keyof typeof themes];
      const themeName = selectedTheme[Math.floor(Math.random() * selectedTheme.length)];
      
      // 60% chance of adding descriptor/suffix
      if (Math.random() < 0.6) {
        const descriptors = this.cityNamePatterns.descriptors.geographic;
        const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
        return `${themeName} ${descriptor}`;
      }
      return themeName;
    }
    
    // Use specialization-based naming
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // 70% chance of adding descriptor
    if (Math.random() < 0.7) {
      const descriptorTypes = Object.keys(this.cityNamePatterns.descriptors);
      const descriptorType = descriptorTypes[Math.floor(Math.random() * descriptorTypes.length)];
      const descriptors = this.cityNamePatterns.descriptors[descriptorType as keyof typeof this.cityNamePatterns.descriptors];
      const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
      
      // 50% chance of prefix + descriptor vs descriptor + suffix
      if (Math.random() < 0.5) {
        return `${prefix} ${descriptor}`;
      } else {
        const suffixes = this.cityNamePatterns.suffixes.city;
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${descriptor} ${suffix}`;
      }
    }
    
    // Just prefix + suffix
    const suffixes = this.cityNamePatterns.suffixes.city;
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
  }

  // Generate realistic population based on economic tier and specialization
  generatePopulation(economicTier: string, specialization: string): number {
    const basePopulations = {
      developing: { min: 500000, max: 2000000 },
      industrial: { min: 1500000, max: 8000000 },
      advanced: { min: 3000000, max: 15000000 },
      post_scarcity: { min: 8000000, max: 25000000 }
    };

    const specializationMultipliers = {
      technology: 1.3,      // Tech hubs attract more people
      financial: 1.2,       // Financial centers are dense
      research: 0.8,        // Research cities are smaller but elite
      manufacturing: 1.1,   // Industrial cities are large
      defense: 0.9,         // Military bases are controlled size
      materials: 0.7,       // Mining operations are smaller
      energy: 0.8,          // Power generation cities are specialized
      transportation: 1.0,  // Logistics hubs are average
      healthcare: 1.1       // Medical centers attract population
    };

    const base = basePopulations[economicTier as keyof typeof basePopulations];
    const multiplier = specializationMultipliers[specialization as keyof typeof specializationMultipliers] || 1.0;
    
    const min = Math.floor(base.min * multiplier);
    const max = Math.floor(base.max * multiplier);
    
    // Use log-normal distribution for more realistic population spread
    const random1 = Math.random();
    const random2 = Math.random();
    const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);
    
    // Convert to 0-1 range and apply to min-max
    const normalizedRandom = Math.max(0, Math.min(1, (normalRandom + 3) / 6)); // Clamp to reasonable range
    
    return Math.floor(min + (max - min) * normalizedRandom);
  }

  // Generate GDP per capita based on tier, specialization, and civilization
  generateGdpPerCapita(economicTier: string, specialization: string, civilizationId: number): number {
    const baseGdp = {
      developing: { min: 25000, max: 50000 },
      industrial: { min: 45000, max: 85000 },
      advanced: { min: 80000, max: 150000 },
      post_scarcity: { min: 140000, max: 250000 }
    };

    const specializationMultipliers = {
      technology: 1.8,      // Tech pays very well
      financial: 1.6,       // Finance is lucrative
      research: 1.4,        // Research is well-compensated
      healthcare: 1.3,      // Healthcare is valuable
      energy: 1.2,          // Energy sector is profitable
      defense: 1.1,         // Defense has good pay
      manufacturing: 1.0,   // Manufacturing is baseline
      transportation: 0.9,  // Logistics is competitive
      materials: 0.8        // Mining is lower-wage
    };

    const civilizationMultipliers = {
      1: 1.1,  // Terran Republic - established economy
      2: 1.0,  // Alpha Centauri - balanced
      3: 1.2,  // Vega Prime - wealthy civilization
      4: 1.15, // Sirius Federation - financial focus
      5: 0.85  // Proxima Alliance - developing economy
    };

    const base = baseGdp[economicTier as keyof typeof baseGdp];
    const specMultiplier = specializationMultipliers[specialization as keyof typeof specializationMultipliers] || 1.0;
    const civMultiplier = civilizationMultipliers[civilizationId as keyof typeof civilizationMultipliers] || 1.0;
    
    const min = Math.floor(base.min * specMultiplier * civMultiplier);
    const max = Math.floor(base.max * specMultiplier * civMultiplier);
    
    return Math.floor(min + Math.random() * (max - min));
  }

  // Generate infrastructure level based on tier and specialization
  generateInfrastructureLevel(economicTier: string, specialization: string): number {
    const baseLevels = {
      developing: { min: 3, max: 6 },
      industrial: { min: 5, max: 8 },
      advanced: { min: 7, max: 9 },
      post_scarcity: { min: 9, max: 10 }
    };

    const specializationBonus = {
      technology: 1,        // Tech cities have better infrastructure
      research: 1,          // Research needs good infrastructure
      financial: 1,         // Finance requires connectivity
      energy: 0,            // Energy cities are functional
      healthcare: 0,        // Medical cities are well-built
      defense: 0,           // Military bases are secure
      manufacturing: -1,    // Industrial cities prioritize production
      transportation: 0,    // Logistics hubs are well-connected
      materials: -1         // Mining operations are utilitarian
    };

    const base = baseLevels[economicTier as keyof typeof baseLevels];
    const bonus = specializationBonus[specialization as keyof typeof specializationBonus] || 0;
    
    const level = Math.floor(base.min + Math.random() * (base.max - base.min + 1)) + bonus;
    
    return Math.max(1, Math.min(10, level));
  }

  // Generate key industries for a city
  generateKeyIndustries(specialization: string): string[] {
    const industries = this.industrySpecializations[specialization as keyof typeof this.industrySpecializations];
    
    if (!industries) {
      return ['General Commerce', 'Services', 'Light Manufacturing'];
    }

    // Always include 1-2 primary industries
    const primaryCount = Math.floor(Math.random() * 2) + 1;
    const selectedPrimary = industries.primary
      .sort(() => Math.random() - 0.5)
      .slice(0, primaryCount);

    // Include 1-3 secondary industries
    const secondaryCount = Math.floor(Math.random() * 3) + 1;
    const selectedSecondary = industries.secondary
      .sort(() => Math.random() - 0.5)
      .slice(0, secondaryCount);

    return [...selectedPrimary, ...selectedSecondary];
  }

  // Generate a single city
  async generateCity(
    civilizationId: number,
    planetId: number,
    specialization: string,
    economicTier?: string
  ): Promise<CityMarket> {
    // Determine economic tier if not specified
    if (!economicTier) {
      const tierWeights = {
        developing: 0.15,
        industrial: 0.35,
        advanced: 0.40,
        post_scarcity: 0.10
      };
      
      const random = Math.random();
      let cumulative = 0;
      
      for (const [tier, weight] of Object.entries(tierWeights)) {
        cumulative += weight;
        if (random <= cumulative) {
          economicTier = tier;
          break;
        }
      }
      
      economicTier = economicTier || 'industrial';
    }

    const cityName = this.generateCityName(civilizationId, specialization);
    const population = this.generatePopulation(economicTier, specialization);
    const gdpPerCapita = this.generateGdpPerCapita(economicTier, specialization, civilizationId);
    const infrastructureLevel = this.generateInfrastructureLevel(economicTier, specialization);

    // Generate unique city_id (this would normally be coordinated with a planet/city system)
    const cityId = Math.floor(Math.random() * 1000000) + 1000;

    return {
      id: 0, // Will be set by database
      city_id: cityId,
      planet_id: planetId,
      civilization_id: civilizationId,
      city_name: cityName,
      population: population,
      economic_tier: economicTier as 'developing' | 'industrial' | 'advanced' | 'post_scarcity',
      gdp_per_capita: gdpPerCapita,
      infrastructure_level: infrastructureLevel,
      created_at: new Date()
    };
  }

  // Generate cities for a civilization
  async generateCivilizationCities(
    civilizationId: number,
    planetId: number,
    cityCount?: number
  ): Promise<CityMarket[]> {
    const defaultCityCounts = {
      1: 8,  // Terran Republic - established, many cities
      2: 6,  // Alpha Centauri - moderate development
      3: 7,  // Vega Prime - wealthy, well-developed
      4: 5,  // Sirius Federation - focused development
      5: 4   // Proxima Alliance - frontier, fewer cities
    };

    const targetCount = cityCount || defaultCityCounts[civilizationId as keyof typeof defaultCityCounts] || 5;
    
    // Define specialization distribution
    const specializations = [
      'technology', 'manufacturing', 'financial', 'research', 
      'energy', 'healthcare', 'transportation', 'materials', 'defense'
    ];

    const cities: CityMarket[] = [];

    for (let i = 0; i < targetCount; i++) {
      // Ensure variety in specializations
      const specialization = specializations[i % specializations.length];
      
      // Bias economic tiers based on civilization development
      let economicTier: string | undefined;
      
      if (civilizationId === 3) { // Vega Prime - more advanced cities
        economicTier = Math.random() < 0.6 ? 'advanced' : (Math.random() < 0.8 ? 'industrial' : 'post_scarcity');
      } else if (civilizationId === 5) { // Proxima Alliance - more developing cities
        economicTier = Math.random() < 0.4 ? 'developing' : 'industrial';
      }

      const city = await this.generateCity(civilizationId, planetId, specialization, economicTier);
      cities.push(city);
    }

    return cities;
  }

  // Insert generated cities into database
  async insertCities(cities: CityMarket[]): Promise<number[]> {
    const client = await this.pool.connect();
    const insertedIds: number[] = [];

    try {
      await client.query('BEGIN');

      for (const city of cities) {
        const query = `
          INSERT INTO city_markets (
            city_id, planet_id, civilization_id, city_name, population,
            economic_tier, gdp_per_capita, infrastructure_level
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `;

        const result = await client.query(query, [
          city.city_id,
          city.planet_id,
          city.civilization_id,
          city.city_name,
          city.population,
          city.economic_tier,
          city.gdp_per_capita,
          city.infrastructure_level
        ]);

        insertedIds.push(result.rows[0].id);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return insertedIds;
  }

  // Generate complete city ecosystem for all civilizations
  async generateCompleteEcosystem(): Promise<{
    cities_created: number;
    civilizations_populated: number[];
    cities_by_civilization: { [key: number]: number };
    economic_tiers: { [key: string]: number };
  }> {
    const civilizations = [1, 2, 3, 4, 5];
    const planets = [1, 2, 3, 4, 5]; // Assuming one planet per civilization for now
    
    let totalCities = 0;
    const citiesByCivilization: { [key: number]: number } = {};
    const economicTiers: { [key: string]: number } = {
      developing: 0,
      industrial: 0,
      advanced: 0,
      post_scarcity: 0
    };

    for (let i = 0; i < civilizations.length; i++) {
      const civilizationId = civilizations[i];
      const planetId = planets[i];

      try {
        const cities = await this.generateCivilizationCities(civilizationId, planetId);
        const insertedIds = await this.insertCities(cities);

        totalCities += cities.length;
        citiesByCivilization[civilizationId] = cities.length;

        // Count economic tiers
        cities.forEach(city => {
          economicTiers[city.economic_tier]++;
        });

        console.log(`✅ Generated ${cities.length} cities for civilization ${civilizationId}`);
      } catch (error) {
        console.error(`❌ Failed to generate cities for civilization ${civilizationId}:`, error);
      }
    }

    return {
      cities_created: totalCities,
      civilizations_populated: civilizations,
      cities_by_civilization: citiesByCivilization,
      economic_tiers: economicTiers
    };
  }

  // City evolution - upgrade economic tier
  async evolveCityEconomicTier(cityId: number): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      // Get current city data
      const cityQuery = 'SELECT * FROM city_markets WHERE id = $1';
      const cityResult = await client.query(cityQuery, [cityId]);
      
      if (cityResult.rows.length === 0) {
        return false;
      }

      const city = cityResult.rows[0];
      const currentTier = city.economic_tier;

      // Define evolution path
      const evolutionPath = {
        developing: 'industrial',
        industrial: 'advanced',
        advanced: 'post_scarcity',
        post_scarcity: 'post_scarcity' // Already at max
      };

      const nextTier = evolutionPath[currentTier as keyof typeof evolutionPath];
      
      if (nextTier === currentTier) {
        return false; // Already at maximum tier
      }

      // Calculate new metrics for evolved tier
      const newGdpPerCapita = this.generateGdpPerCapita(nextTier, 'technology', city.civilization_id);
      const newInfrastructureLevel = this.generateInfrastructureLevel(nextTier, 'technology');

      // Update city
      const updateQuery = `
        UPDATE city_markets 
        SET economic_tier = $1, gdp_per_capita = $2, infrastructure_level = $3
        WHERE id = $4
      `;

      await client.query(updateQuery, [nextTier, newGdpPerCapita, newInfrastructureLevel, cityId]);
      
      console.log(`🏙️ City ${city.city_name} evolved from ${currentTier} to ${nextTier}`);
      return true;
    } catch (error) {
      console.error('Error evolving city economic tier:', error);
      return false;
    } finally {
      client.release();
    }
  }

  // Clear all existing cities (for regeneration)
  async clearAllCities(): Promise<void> {
    const query = 'DELETE FROM city_markets';
    await this.pool.query(query);
    console.log('🗑️ Cleared all existing city markets');
  }
}

// Service instance
let dynamicCityGenerator: DynamicCityGenerator | null = null;

export function getDynamicCityGenerator(): DynamicCityGenerator {
  if (!dynamicCityGenerator) {
    throw new Error('DynamicCityGenerator not initialized. Call initializeDynamicCityGenerator first.');
  }
  return dynamicCityGenerator;
}

export function initializeDynamicCityGenerator(pool: Pool): void {
  dynamicCityGenerator = new DynamicCityGenerator(pool);
}
