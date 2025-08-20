/**
 * City Emergence Engine
 * 
 * Dynamically generates new cities as civilizations expand and develop.
 * Integrates with existing city systems and economic ecosystem.
 */

import { Pool } from 'pg';
import { CityEngine } from './CityEngine.js';
import { DynamicCityGenerator } from '../economic-ecosystem/DynamicCityGenerator.js';
import { City } from './types.js';

export interface EmergenceCondition {
  id: string;
  name: string;
  description: string;
  type: 'population_pressure' | 'economic_opportunity' | 'resource_discovery' | 'strategic_expansion' | 'trade_route' | 'technology_advancement';
  priority: number; // 1-10, higher = more likely to trigger emergence
  requirements: {
    populationThreshold?: number;
    economicGrowthRate?: number;
    resourceAbundance?: number;
    tradeVolume?: number;
    technologyLevel?: number;
    distanceFromNearestCity?: number;
    civilizationAge?: number; // months since civilization start
  };
  emergenceModifiers: {
    populationBonus?: number;
    economicBonus?: number;
    specializationBias?: string[]; // Preferred specializations for new city
    geographicPreference?: string[]; // Preferred terrain/climate
  };
}

export interface EmergenceLocation {
  coordinates: { x: number; y: number };
  suitabilityScore: number; // 0-100
  terrain: City['terrain'];
  climate: City['climate'];
  nearbyResources: string[];
  distanceToNearestCity: number;
  strategicValue: number; // 0-100
  emergenceReasons: string[];
}

export interface CivilizationExpansionState {
  civilizationId: number;
  currentCities: number;
  totalPopulation: number;
  economicOutput: number;
  expansionPressure: number; // 0-100
  availableTerritory: number;
  technologyLevel: number;
  lastExpansion: Date;
  expansionHistory: {
    cityId: string;
    foundedDate: Date;
    emergenceReason: string;
    initialPopulation: number;
  }[];
}

export class CityEmergenceEngine {
  private pool: Pool;
  private cityEngine: CityEngine;
  private cityGenerator: DynamicCityGenerator;
  private emergenceConditions: EmergenceCondition[];

  constructor(pool: Pool) {
    this.pool = pool;
    this.cityEngine = new CityEngine();
    this.cityGenerator = new DynamicCityGenerator(pool);
    this.emergenceConditions = this.initializeEmergenceConditions();
  }

  private initializeEmergenceConditions(): EmergenceCondition[] {
    return [
      {
        id: 'population_overflow',
        name: 'Population Overflow',
        description: 'Existing cities are overcrowded, driving migration to new settlements',
        type: 'population_pressure',
        priority: 8,
        requirements: {
          populationThreshold: 500000, // Cities over 500k trigger overflow
          distanceFromNearestCity: 50 // At least 50km from existing city
        },
        emergenceModifiers: {
          populationBonus: 0.7, // New city starts with 70% of typical population
          specializationBias: ['residential', 'manufacturing', 'agriculture'],
          geographicPreference: ['plains', 'coastal', 'river']
        }
      },
      {
        id: 'economic_boom',
        name: 'Economic Boom',
        description: 'Strong economic growth creates opportunities for new commercial centers',
        type: 'economic_opportunity',
        priority: 7,
        requirements: {
          economicGrowthRate: 0.08, // 8% annual growth
          civilizationAge: 24 // At least 2 years old
        },
        emergenceModifiers: {
          economicBonus: 1.5,
          specializationBias: ['financial', 'technology', 'trade'],
          geographicPreference: ['coastal', 'river', 'strategic_crossroads']
        }
      },
      {
        id: 'resource_discovery',
        name: 'Resource Discovery',
        description: 'Discovery of valuable resources drives establishment of extraction settlements',
        type: 'resource_discovery',
        priority: 9,
        requirements: {
          resourceAbundance: 80, // High resource abundance in area
          distanceFromNearestCity: 30
        },
        emergenceModifiers: {
          populationBonus: 0.4, // Smaller initial population
          specializationBias: ['mining', 'energy', 'materials'],
          geographicPreference: ['mountains', 'desert', 'arctic']
        }
      },
      {
        id: 'trade_hub_opportunity',
        name: 'Trade Hub Opportunity',
        description: 'Strategic location for trade routes creates commercial opportunities',
        type: 'trade_route',
        priority: 6,
        requirements: {
          tradeVolume: 1000000, // High trade volume in civilization
          distanceFromNearestCity: 75
        },
        emergenceModifiers: {
          economicBonus: 1.3,
          specializationBias: ['trade', 'logistics', 'financial'],
          geographicPreference: ['coastal', 'strategic_crossroads', 'river']
        }
      },
      {
        id: 'technological_advancement',
        name: 'Technological Advancement',
        description: 'Breakthrough technologies require specialized research facilities',
        type: 'technology_advancement',
        priority: 5,
        requirements: {
          technologyLevel: 75, // High tech level
          civilizationAge: 36 // At least 3 years old
        },
        emergenceModifiers: {
          populationBonus: 0.6,
          economicBonus: 1.2,
          specializationBias: ['technology', 'research', 'healthcare'],
          geographicPreference: ['temperate', 'mediterranean']
        }
      },
      {
        id: 'strategic_expansion',
        name: 'Strategic Expansion',
        description: 'Military or political needs drive establishment of strategic outposts',
        type: 'strategic_expansion',
        priority: 4,
        requirements: {
          civilizationAge: 18, // At least 1.5 years old
          distanceFromNearestCity: 100 // Far from existing cities
        },
        emergenceModifiers: {
          populationBonus: 0.3, // Small outpost initially
          specializationBias: ['defense', 'logistics', 'communications'],
          geographicPreference: ['mountains', 'coastal', 'strategic_crossroads']
        }
      }
    ];
  }

  /**
   * Analyze civilization expansion state and determine if new cities should emerge
   */
  async analyzeCivilizationExpansion(civilizationId: number): Promise<CivilizationExpansionState> {
    const client = await this.pool.connect();
    
    try {
      // Get current civilization data
      const civilizationQuery = `
        SELECT 
          COUNT(cm.id) as city_count,
          COALESCE(SUM(cm.population), 0) as total_population,
          COALESCE(SUM(cm.gdp), 0) as total_gdp,
          AVG(cm.economic_tier) as avg_tech_level
        FROM city_markets cm 
        WHERE cm.civilization_id = $1
      `;
      
      const civilizationResult = await client.query(civilizationQuery, [civilizationId]);
      const civData = civilizationResult.rows[0];

      // Calculate expansion pressure based on multiple factors
      const expansionPressure = this.calculateExpansionPressure({
        cityCount: parseInt(civData.city_count),
        totalPopulation: parseInt(civData.total_population),
        economicOutput: parseFloat(civData.total_gdp),
        avgTechLevel: parseFloat(civData.avg_tech_level) || 1
      });

      // Get expansion history
      const historyQuery = `
        SELECT city_name, founded_date, initial_population, emergence_reason
        FROM city_emergence_history 
        WHERE civilization_id = $1 
        ORDER BY founded_date DESC 
        LIMIT 10
      `;
      
      const historyResult = await client.query(historyQuery, [civilizationId]);
      const expansionHistory = historyResult.rows.map(row => ({
        cityId: row.city_name,
        foundedDate: row.founded_date,
        emergenceReason: row.emergence_reason,
        initialPopulation: row.initial_population
      }));

      const lastExpansion = expansionHistory.length > 0 ? 
        new Date(expansionHistory[0].foundedDate) : 
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago default

      return {
        civilizationId,
        currentCities: parseInt(civData.city_count),
        totalPopulation: parseInt(civData.total_population),
        economicOutput: parseFloat(civData.total_gdp),
        expansionPressure,
        availableTerritory: this.calculateAvailableTerritory(civilizationId),
        technologyLevel: parseFloat(civData.avg_tech_level) || 1,
        lastExpansion,
        expansionHistory
      };

    } finally {
      client.release();
    }
  }

  /**
   * Calculate expansion pressure based on civilization metrics
   */
  private calculateExpansionPressure(data: {
    cityCount: number;
    totalPopulation: number;
    economicOutput: number;
    avgTechLevel: number;
  }): number {
    let pressure = 0;

    // Population pressure (0-40 points)
    const avgCityPopulation = data.totalPopulation / Math.max(data.cityCount, 1);
    if (avgCityPopulation > 400000) pressure += 40;
    else if (avgCityPopulation > 250000) pressure += 25;
    else if (avgCityPopulation > 150000) pressure += 15;

    // Economic pressure (0-30 points)
    const gdpPerCapita = data.economicOutput / Math.max(data.totalPopulation, 1);
    if (gdpPerCapita > 60000) pressure += 30;
    else if (gdpPerCapita > 45000) pressure += 20;
    else if (gdpPerCapita > 30000) pressure += 10;

    // Technology pressure (0-20 points)
    if (data.avgTechLevel >= 4) pressure += 20;
    else if (data.avgTechLevel >= 3) pressure += 15;
    else if (data.avgTechLevel >= 2) pressure += 10;

    // City count pressure (0-10 points)
    if (data.cityCount < 3) pressure += 10;
    else if (data.cityCount < 6) pressure += 5;

    return Math.min(pressure, 100);
  }

  /**
   * Calculate available territory for expansion
   */
  private calculateAvailableTerritory(civilizationId: number): number {
    // Simplified calculation - in reality this would consider:
    // - Geographic constraints
    // - Existing city territories
    // - Resource distribution
    // - Political boundaries
    return Math.random() * 1000 + 500; // 500-1500 arbitrary units
  }

  /**
   * Evaluate potential emergence locations
   */
  async evaluateEmergenceLocations(
    civilizationId: number, 
    condition: EmergenceCondition
  ): Promise<EmergenceLocation[]> {
    const client = await this.pool.connect();
    
    try {
      // Get existing cities to calculate distances
      const existingCitiesQuery = `
        SELECT city_name, coordinates_x, coordinates_y 
        FROM city_markets 
        WHERE civilization_id = $1
      `;
      
      const existingCities = await client.query(existingCitiesQuery, [civilizationId]);
      
      const locations: EmergenceLocation[] = [];
      
      // Generate potential locations (simplified - would use more sophisticated algorithms)
      for (let i = 0; i < 10; i++) {
        const coordinates = this.generateRandomCoordinates();
        const terrain = this.selectTerrain(condition.emergenceModifiers.geographicPreference);
        const climate = this.selectClimate(terrain);
        
        const distanceToNearest = this.calculateMinDistance(coordinates, existingCities.rows);
        
        // Skip if too close to existing cities
        if (condition.requirements.distanceFromNearestCity && 
            distanceToNearest < condition.requirements.distanceFromNearestCity) {
          continue;
        }

        const suitabilityScore = this.calculateLocationSuitability(
          coordinates, terrain, climate, condition, distanceToNearest
        );

        locations.push({
          coordinates,
          suitabilityScore,
          terrain,
          climate,
          nearbyResources: this.generateNearbyResources(terrain, climate),
          distanceToNearestCity: distanceToNearest,
          strategicValue: this.calculateStrategicValue(coordinates, terrain, climate),
          emergenceReasons: [condition.description]
        });
      }

      // Sort by suitability score and return top locations
      return locations
        .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
        .slice(0, 3);

    } finally {
      client.release();
    }
  }

  /**
   * Trigger city emergence based on conditions
   */
  async triggerCityEmergence(
    civilizationId: number,
    condition: EmergenceCondition,
    location: EmergenceLocation
  ): Promise<string | null> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Generate city using existing DynamicCityGenerator
      const cityData = await this.cityGenerator.generateCity(
        civilizationId,
        location.terrain === 'coastal' ? 'coastal' : 
        location.terrain === 'mountains' ? 'mining' :
        condition.emergenceModifiers.specializationBias?.[0] || 'residential'
      );

      // Calculate initial population based on condition
      const basePopulation = 50000; // Default starting population
      const initialPopulation = Math.floor(
        basePopulation * (condition.emergenceModifiers.populationBonus || 1.0)
      );

      // Insert the new city into city_markets
      const insertCityQuery = `
        INSERT INTO city_markets (
          civilization_id, city_name, specialization, economic_tier,
          population, gdp, coordinates_x, coordinates_y,
          infrastructure_level, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING id
      `;

      const cityResult = await client.query(insertCityQuery, [
        civilizationId,
        cityData.name,
        cityData.specialization,
        cityData.economicTier,
        initialPopulation,
        initialPopulation * 35000, // $35k GDP per capita
        location.coordinates.x,
        location.coordinates.y,
        cityData.infrastructureLevel
      ]);

      const cityId = cityResult.rows[0].id;

      // Record emergence in history
      const historyQuery = `
        INSERT INTO city_emergence_history (
          civilization_id, city_name, city_id, emergence_condition_id,
          emergence_reason, founded_date, initial_population,
          location_x, location_y, terrain, climate
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10)
      `;

      await client.query(historyQuery, [
        civilizationId,
        cityData.name,
        cityId,
        condition.id,
        condition.description,
        initialPopulation,
        location.coordinates.x,
        location.coordinates.y,
        location.terrain,
        location.climate
      ]);

      await client.query('COMMIT');

      console.log(`🌱 New city emerged: ${cityData.name} (${condition.name})`);
      return cityData.name;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error triggering city emergence:', error);
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * Main emergence evaluation process
   */
  async evaluateEmergence(civilizationId: number): Promise<string[]> {
    const expansionState = await this.analyzeCivilizationExpansion(civilizationId);
    const newCities: string[] = [];

    // Check if expansion pressure is high enough
    if (expansionState.expansionPressure < 30) {
      return newCities; // Not enough pressure for expansion
    }

    // Check time since last expansion (prevent too frequent expansions)
    const monthsSinceLastExpansion = 
      (Date.now() - expansionState.lastExpansion.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsSinceLastExpansion < 6) {
      return newCities; // Too soon since last expansion
    }

    // Evaluate each emergence condition
    for (const condition of this.emergenceConditions) {
      if (this.checkConditionRequirements(condition, expansionState)) {
        // Calculate emergence probability based on condition priority and expansion pressure
        const emergenceProbability = 
          (condition.priority / 10) * (expansionState.expansionPressure / 100) * 0.3; // 30% max chance

        if (Math.random() < emergenceProbability) {
          const locations = await this.evaluateEmergenceLocations(civilizationId, condition);
          
          if (locations.length > 0) {
            const bestLocation = locations[0];
            const newCityName = await this.triggerCityEmergence(
              civilizationId, condition, bestLocation
            );
            
            if (newCityName) {
              newCities.push(newCityName);
              // Only allow one new city per evaluation to prevent over-expansion
              break;
            }
          }
        }
      }
    }

    return newCities;
  }

  /**
   * Check if condition requirements are met
   */
  private checkConditionRequirements(
    condition: EmergenceCondition, 
    state: CivilizationExpansionState
  ): boolean {
    const req = condition.requirements;
    
    if (req.populationThreshold && state.totalPopulation < req.populationThreshold) return false;
    if (req.economicGrowthRate && state.economicOutput / state.totalPopulation < req.economicGrowthRate * 30000) return false;
    if (req.technologyLevel && state.technologyLevel < req.technologyLevel) return false;
    if (req.civilizationAge) {
      // Simplified age check - would need actual civilization start date
      const estimatedAge = state.expansionHistory.length * 6; // Rough estimate
      if (estimatedAge < req.civilizationAge) return false;
    }
    
    return true;
  }

  // Helper methods
  private generateRandomCoordinates(): { x: number; y: number } {
    return {
      x: Math.random() * 2000 - 1000, // -1000 to 1000
      y: Math.random() * 2000 - 1000
    };
  }

  private selectTerrain(preferences?: string[]): City['terrain'] {
    const terrains: City['terrain'][] = ['plains', 'hills', 'mountains', 'coastal', 'river', 'desert'];
    
    if (preferences && preferences.length > 0) {
      const validPreferences = preferences.filter(p => terrains.includes(p as City['terrain']));
      if (validPreferences.length > 0) {
        return validPreferences[Math.floor(Math.random() * validPreferences.length)] as City['terrain'];
      }
    }
    
    return terrains[Math.floor(Math.random() * terrains.length)];
  }

  private selectClimate(terrain: City['terrain']): City['climate'] {
    const climateMap: Record<City['terrain'], City['climate'][]> = {
      plains: ['temperate', 'mediterranean'],
      hills: ['temperate', 'mediterranean'],
      mountains: ['temperate', 'arctic'],
      coastal: ['temperate', 'mediterranean', 'tropical'],
      river: ['temperate', 'tropical'],
      desert: ['arid']
    };
    
    const options = climateMap[terrain] || ['temperate'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private calculateMinDistance(
    coordinates: { x: number; y: number }, 
    existingCities: any[]
  ): number {
    if (existingCities.length === 0) return 1000; // Large distance if no cities
    
    return Math.min(...existingCities.map(city => {
      const dx = coordinates.x - city.coordinates_x;
      const dy = coordinates.y - city.coordinates_y;
      return Math.sqrt(dx * dx + dy * dy);
    }));
  }

  private calculateLocationSuitability(
    coordinates: { x: number; y: number },
    terrain: City['terrain'],
    climate: City['climate'],
    condition: EmergenceCondition,
    distanceToNearest: number
  ): number {
    let score = 50; // Base score
    
    // Distance bonus (not too close, not too far)
    if (distanceToNearest > 50 && distanceToNearest < 200) score += 20;
    else if (distanceToNearest > 200) score += 10;
    
    // Terrain preference bonus
    if (condition.emergenceModifiers.geographicPreference?.includes(terrain)) {
      score += 15;
    }
    
    // Climate suitability
    if (climate === 'temperate' || climate === 'mediterranean') score += 10;
    
    // Random variation
    score += Math.random() * 20 - 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private generateNearbyResources(terrain: City['terrain'], climate: City['climate']): string[] {
    const resourceMap: Record<string, string[]> = {
      mountains: ['minerals', 'metals', 'stone', 'crystals'],
      coastal: ['fish', 'salt', 'shipping', 'tourism'],
      river: ['water', 'fertile_soil', 'transportation'],
      desert: ['solar_energy', 'rare_minerals', 'oil'],
      plains: ['agriculture', 'livestock', 'wind_energy'],
      hills: ['timber', 'minerals', 'agriculture']
    };
    
    const resources = resourceMap[terrain] || ['basic_materials'];
    return resources.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private calculateStrategicValue(
    coordinates: { x: number; y: number },
    terrain: City['terrain'],
    climate: City['climate']
  ): number {
    let value = 50; // Base value
    
    // Terrain strategic value
    if (terrain === 'coastal') value += 20;
    else if (terrain === 'mountains') value += 15;
    else if (terrain === 'river') value += 10;
    
    // Climate strategic value
    if (climate === 'temperate') value += 10;
    else if (climate === 'mediterranean') value += 5;
    
    return Math.max(0, Math.min(100, value));
  }
}
