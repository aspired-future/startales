import { Pool } from 'pg';

/**
 * Planetary Government Service
 * Manages automated planetary-level governance systems
 */

export interface PlanetaryGovernment {
  id: number;
  planetId: string;
  civilizationId: string;
  governmentName: string;
  governmentType: 'autonomous' | 'federal' | 'colonial' | 'corporate';
  
  // Leadership
  planetaryGovernor: string;
  deputyGovernors: string[];
  governingCouncil: any[];
  
  // Government Structure
  autonomyLevel: number;
  reportingFrequency: string;
  
  // Budget & Economics
  planetaryBudget: number;
  taxCollectionRate: number;
  centralGovernmentFunding: number;
  economicSpecialization?: string;
  
  // Population & Demographics
  totalPopulation: number;
  populationGrowthRate: number;
  employmentRate: number;
  educationLevel: number;
  qualityOfLife: number;
  
  // Infrastructure
  infrastructureLevel: number;
  transportationNetwork: number;
  communicationNetwork: number;
  energyGrid: number;
  waterSystems: number;
  
  // Resources & Environment
  resourceReserves: { [key: string]: number };
  environmentalHealth: number;
  sustainabilityRating: number;
  
  // Policies & Governance
  currentPolicies: any[];
  policyPriorities: any[];
  approvalRating: number;
  
  // Status & Metadata
  establishmentDate: Date;
  lastElectionDate?: Date;
  nextElectionDate?: Date;
  governmentStatus: 'active' | 'transition' | 'crisis';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanetaryCity {
  id: number;
  planetaryGovernmentId: number;
  cityId: string;
  cityName: string;
  population: number;
  economicOutput: number;
  infrastructureRating: number;
  specialization?: string;
  cityManager?: string;
  managementBudget: number;
  developmentPriority: 'growth' | 'maintenance' | 'specialization' | 'balanced';
  lastInfrastructureUpgrade?: Date;
  nextPlannedProject?: string;
  resourceAllocation: { [key: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface GovernmentDecision {
  id: number;
  planetaryGovernmentId: number;
  decisionType: string;
  decisionTitle: string;
  decisionDescription?: string;
  decisionData: any;
  triggerEvent?: string;
  affectedCities: string[];
  budgetImpact: number;
  implementationStatus: 'pending' | 'implementing' | 'completed' | 'failed' | 'cancelled';
  implementationDate?: Date;
  successRating?: number;
  citizenApprovalChange: number;
  createdAt: Date;
}

export interface GovernmentMetrics {
  id: number;
  planetaryGovernmentId: number;
  metricDate: Date;
  
  // Economic Metrics
  gdpGrowthRate: number;
  unemploymentRate: number;
  inflationRate: number;
  budgetSurplusDeficit: number;
  
  // Social Metrics
  qualityOfLifeIndex: number;
  educationIndex: number;
  healthcareIndex: number;
  crimeRate: number;
  
  // Infrastructure Metrics
  infrastructureEfficiency: number;
  transportationUsage: number;
  energyEfficiency: number;
  
  // Environmental Metrics
  environmentalImpact: number;
  sustainabilityScore: number;
  resourceDepletionRate: number;
  
  // Political Metrics
  approvalRating: number;
  politicalStability: number;
  corruptionIndex: number;
  
  createdAt: Date;
}

export class PlanetaryGovernmentService {
  constructor(private pool: Pool) {}

  /**
   * Get planetary government by planet ID and civilization ID
   */
  async getPlanetaryGovernment(planetId: string, civilizationId: string): Promise<PlanetaryGovernment | null> {
    const result = await this.pool.query(
      `SELECT * FROM planetary_governments 
       WHERE planet_id = $1 AND civilization_id = $2`,
      [planetId, civilizationId]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return this.mapRowToPlanetaryGovernment(row);
  }

  /**
   * Get all planetary governments for a civilization
   */
  async getPlanetaryGovernmentsByCivilization(civilizationId: string): Promise<PlanetaryGovernment[]> {
    const result = await this.pool.query(
      `SELECT * FROM planetary_governments 
       WHERE civilization_id = $1 
       ORDER BY establishment_date ASC`,
      [civilizationId]
    );
    
    return result.rows.map(row => this.mapRowToPlanetaryGovernment(row));
  }

  /**
   * Create a new planetary government
   */
  async createPlanetaryGovernment(data: Partial<PlanetaryGovernment>): Promise<PlanetaryGovernment> {
    const result = await this.pool.query(`
      INSERT INTO planetary_governments (
        planet_id, civilization_id, government_name, government_type,
        planetary_governor, deputy_governors, governing_council,
        autonomy_level, reporting_frequency, planetary_budget, 
        tax_collection_rate, central_government_funding, economic_specialization,
        total_population, population_growth_rate, employment_rate, 
        education_level, quality_of_life, infrastructure_level,
        transportation_network, communication_network, energy_grid, water_systems,
        resource_reserves, environmental_health, sustainability_rating,
        current_policies, policy_priorities, approval_rating,
        establishment_date, government_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
      ) RETURNING *
    `, [
      data.planetId, data.civilizationId, data.governmentName, data.governmentType || 'autonomous',
      data.planetaryGovernor, JSON.stringify(data.deputyGovernors || []), 
      JSON.stringify(data.governingCouncil || []), data.autonomyLevel || 50,
      data.reportingFrequency || 'monthly', data.planetaryBudget || 0,
      data.taxCollectionRate || 15.00, data.centralGovernmentFunding || 0,
      data.economicSpecialization, data.totalPopulation || 0,
      data.populationGrowthRate || 0.02, data.employmentRate || 85.00,
      data.educationLevel || 60.00, data.qualityOfLife || 70.00,
      data.infrastructureLevel || 50.00, data.transportationNetwork || 40.00,
      data.communicationNetwork || 60.00, data.energyGrid || 55.00,
      data.waterSystems || 50.00, JSON.stringify(data.resourceReserves || {}),
      data.environmentalHealth || 75.00, data.sustainabilityRating || 60.00,
      JSON.stringify(data.currentPolicies || []), 
      JSON.stringify(data.policyPriorities || []), data.approvalRating || 65.00,
      data.establishmentDate || new Date(), data.governmentStatus || 'active'
    ]);

    return this.mapRowToPlanetaryGovernment(result.rows[0]);
  }

  /**
   * Update planetary government
   */
  async updatePlanetaryGovernment(id: number, data: Partial<PlanetaryGovernment>): Promise<PlanetaryGovernment | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt') {
        const dbField = this.camelToSnake(key);
        if (typeof value === 'object' && value !== null) {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (updateFields.length === 0) return null;

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.pool.query(`
      UPDATE planetary_governments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length === 0) return null;
    return this.mapRowToPlanetaryGovernment(result.rows[0]);
  }

  /**
   * Get cities managed by a planetary government
   */
  async getPlanetaryCities(planetaryGovernmentId: number): Promise<PlanetaryCity[]> {
    const result = await this.pool.query(
      `SELECT * FROM planetary_city_management 
       WHERE planetary_government_id = $1 
       ORDER BY population DESC`,
      [planetaryGovernmentId]
    );
    
    return result.rows.map(row => this.mapRowToPlanetaryCity(row));
  }

  /**
   * Add a city to planetary government management
   */
  async addCityToGovernment(planetaryGovernmentId: number, cityData: Partial<PlanetaryCity>): Promise<PlanetaryCity> {
    const result = await this.pool.query(`
      INSERT INTO planetary_city_management (
        planetary_government_id, city_id, city_name, population,
        economic_output, infrastructure_rating, specialization,
        city_manager, management_budget, development_priority,
        resource_allocation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      planetaryGovernmentId, cityData.cityId, cityData.cityName,
      cityData.population || 0, cityData.economicOutput || 0,
      cityData.infrastructureRating || 50.00, cityData.specialization,
      cityData.cityManager, cityData.managementBudget || 0,
      cityData.developmentPriority || 'balanced',
      JSON.stringify(cityData.resourceAllocation || {})
    ]);

    return this.mapRowToPlanetaryCity(result.rows[0]);
  }

  /**
   * Record a government decision
   */
  async recordDecision(decisionData: Partial<GovernmentDecision>): Promise<GovernmentDecision> {
    const result = await this.pool.query(`
      INSERT INTO planetary_government_decisions (
        planetary_government_id, decision_type, decision_title,
        decision_description, decision_data, trigger_event,
        affected_cities, budget_impact, implementation_status,
        citizen_approval_change
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      decisionData.planetaryGovernmentId, decisionData.decisionType,
      decisionData.decisionTitle, decisionData.decisionDescription,
      JSON.stringify(decisionData.decisionData || {}), decisionData.triggerEvent,
      decisionData.affectedCities || [], decisionData.budgetImpact || 0,
      decisionData.implementationStatus || 'pending',
      decisionData.citizenApprovalChange || 0
    ]);

    return this.mapRowToGovernmentDecision(result.rows[0]);
  }

  /**
   * Get recent decisions for a planetary government
   */
  async getRecentDecisions(planetaryGovernmentId: number, limit = 10): Promise<GovernmentDecision[]> {
    const result = await this.pool.query(`
      SELECT * FROM planetary_government_decisions 
      WHERE planetary_government_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [planetaryGovernmentId, limit]);

    return result.rows.map(row => this.mapRowToGovernmentDecision(row));
  }

  /**
   * Record performance metrics
   */
  async recordMetrics(metricsData: Partial<GovernmentMetrics>): Promise<GovernmentMetrics> {
    const result = await this.pool.query(`
      INSERT INTO planetary_government_metrics (
        planetary_government_id, metric_date, gdp_growth_rate,
        unemployment_rate, inflation_rate, budget_surplus_deficit,
        quality_of_life_index, education_index, healthcare_index,
        crime_rate, infrastructure_efficiency, transportation_usage,
        energy_efficiency, environmental_impact, sustainability_score,
        resource_depletion_rate, approval_rating, political_stability,
        corruption_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (planetary_government_id, metric_date) 
      DO UPDATE SET
        gdp_growth_rate = EXCLUDED.gdp_growth_rate,
        unemployment_rate = EXCLUDED.unemployment_rate,
        inflation_rate = EXCLUDED.inflation_rate,
        budget_surplus_deficit = EXCLUDED.budget_surplus_deficit,
        quality_of_life_index = EXCLUDED.quality_of_life_index,
        education_index = EXCLUDED.education_index,
        healthcare_index = EXCLUDED.healthcare_index,
        crime_rate = EXCLUDED.crime_rate,
        infrastructure_efficiency = EXCLUDED.infrastructure_efficiency,
        transportation_usage = EXCLUDED.transportation_usage,
        energy_efficiency = EXCLUDED.energy_efficiency,
        environmental_impact = EXCLUDED.environmental_impact,
        sustainability_score = EXCLUDED.sustainability_score,
        resource_depletion_rate = EXCLUDED.resource_depletion_rate,
        approval_rating = EXCLUDED.approval_rating,
        political_stability = EXCLUDED.political_stability,
        corruption_index = EXCLUDED.corruption_index
      RETURNING *
    `, [
      metricsData.planetaryGovernmentId, metricsData.metricDate || new Date(),
      metricsData.gdpGrowthRate || 0, metricsData.unemploymentRate || 0,
      metricsData.inflationRate || 0, metricsData.budgetSurplusDeficit || 0,
      metricsData.qualityOfLifeIndex || 0, metricsData.educationIndex || 0,
      metricsData.healthcareIndex || 0, metricsData.crimeRate || 0,
      metricsData.infrastructureEfficiency || 0, metricsData.transportationUsage || 0,
      metricsData.energyEfficiency || 0, metricsData.environmentalImpact || 0,
      metricsData.sustainabilityScore || 0, metricsData.resourceDepletionRate || 0,
      metricsData.approvalRating || 0, metricsData.politicalStability || 0,
      metricsData.corruptionIndex || 0
    ]);

    return this.mapRowToGovernmentMetrics(result.rows[0]);
  }

  /**
   * Get historical metrics for a planetary government
   */
  async getMetricsHistory(planetaryGovernmentId: number, days = 30): Promise<GovernmentMetrics[]> {
    const result = await this.pool.query(`
      SELECT * FROM planetary_government_metrics 
      WHERE planetary_government_id = $1 
        AND metric_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY metric_date DESC
    `, [planetaryGovernmentId]);

    return result.rows.map(row => this.mapRowToGovernmentMetrics(row));
  }

  /**
   * Calculate government dashboard data
   */
  async getDashboardData(planetaryGovernmentId: number): Promise<any> {
    const government = await this.pool.query(
      'SELECT * FROM planetary_governments WHERE id = $1',
      [planetaryGovernmentId]
    );

    if (government.rows.length === 0) {
      throw new Error('Planetary government not found');
    }

    const cities = await this.getPlanetaryCities(planetaryGovernmentId);
    const recentDecisions = await this.getRecentDecisions(planetaryGovernmentId, 5);
    const recentMetrics = await this.getMetricsHistory(planetaryGovernmentId, 7);

    const gov = this.mapRowToPlanetaryGovernment(government.rows[0]);

    return {
      government: gov,
      summary: {
        totalCities: cities.length,
        totalPopulation: cities.reduce((sum, city) => sum + city.population, 0),
        totalEconomicOutput: cities.reduce((sum, city) => sum + city.economicOutput, 0),
        averageInfrastructure: cities.length > 0 
          ? cities.reduce((sum, city) => sum + city.infrastructureRating, 0) / cities.length 
          : 0,
        budgetUtilization: gov.planetaryBudget > 0 
          ? ((gov.planetaryBudget - gov.centralGovernmentFunding) / gov.planetaryBudget) * 100 
          : 0
      },
      cities,
      recentDecisions,
      performanceTrend: recentMetrics.length > 0 ? recentMetrics[0] : null
    };
  }

  // Helper methods
  private mapRowToPlanetaryGovernment(row: any): PlanetaryGovernment {
    return {
      id: row.id,
      planetId: row.planet_id,
      civilizationId: row.civilization_id,
      governmentName: row.government_name,
      governmentType: row.government_type,
      planetaryGovernor: row.planetary_governor,
      deputyGovernors: row.deputy_governors || [],
      governingCouncil: row.governing_council || [],
      autonomyLevel: row.autonomy_level,
      reportingFrequency: row.reporting_frequency,
      planetaryBudget: parseFloat(row.planetary_budget),
      taxCollectionRate: parseFloat(row.tax_collection_rate),
      centralGovernmentFunding: parseFloat(row.central_government_funding),
      economicSpecialization: row.economic_specialization,
      totalPopulation: parseInt(row.total_population),
      populationGrowthRate: parseFloat(row.population_growth_rate),
      employmentRate: parseFloat(row.employment_rate),
      educationLevel: parseFloat(row.education_level),
      qualityOfLife: parseFloat(row.quality_of_life),
      infrastructureLevel: parseFloat(row.infrastructure_level),
      transportationNetwork: parseFloat(row.transportation_network),
      communicationNetwork: parseFloat(row.communication_network),
      energyGrid: parseFloat(row.energy_grid),
      waterSystems: parseFloat(row.water_systems),
      resourceReserves: row.resource_reserves || {},
      environmentalHealth: parseFloat(row.environmental_health),
      sustainabilityRating: parseFloat(row.sustainability_rating),
      currentPolicies: row.current_policies || [],
      policyPriorities: row.policy_priorities || [],
      approvalRating: parseFloat(row.approval_rating),
      establishmentDate: row.establishment_date,
      lastElectionDate: row.last_election_date,
      nextElectionDate: row.next_election_date,
      governmentStatus: row.government_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapRowToPlanetaryCity(row: any): PlanetaryCity {
    return {
      id: row.id,
      planetaryGovernmentId: row.planetary_government_id,
      cityId: row.city_id,
      cityName: row.city_name,
      population: row.population,
      economicOutput: parseFloat(row.economic_output),
      infrastructureRating: parseFloat(row.infrastructure_rating),
      specialization: row.specialization,
      cityManager: row.city_manager,
      managementBudget: parseFloat(row.management_budget),
      developmentPriority: row.development_priority,
      lastInfrastructureUpgrade: row.last_infrastructure_upgrade,
      nextPlannedProject: row.next_planned_project,
      resourceAllocation: row.resource_allocation || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapRowToGovernmentDecision(row: any): GovernmentDecision {
    return {
      id: row.id,
      planetaryGovernmentId: row.planetary_government_id,
      decisionType: row.decision_type,
      decisionTitle: row.decision_title,
      decisionDescription: row.decision_description,
      decisionData: row.decision_data || {},
      triggerEvent: row.trigger_event,
      affectedCities: row.affected_cities || [],
      budgetImpact: parseFloat(row.budget_impact),
      implementationStatus: row.implementation_status,
      implementationDate: row.implementation_date,
      successRating: row.success_rating ? parseFloat(row.success_rating) : undefined,
      citizenApprovalChange: parseFloat(row.citizen_approval_change),
      createdAt: row.created_at
    };
  }

  private mapRowToGovernmentMetrics(row: any): GovernmentMetrics {
    return {
      id: row.id,
      planetaryGovernmentId: row.planetary_government_id,
      metricDate: row.metric_date,
      gdpGrowthRate: parseFloat(row.gdp_growth_rate),
      unemploymentRate: parseFloat(row.unemployment_rate),
      inflationRate: parseFloat(row.inflation_rate),
      budgetSurplusDeficit: parseFloat(row.budget_surplus_deficit),
      qualityOfLifeIndex: parseFloat(row.quality_of_life_index),
      educationIndex: parseFloat(row.education_index),
      healthcareIndex: parseFloat(row.healthcare_index),
      crimeRate: parseFloat(row.crime_rate),
      infrastructureEfficiency: parseFloat(row.infrastructure_efficiency),
      transportationUsage: parseFloat(row.transportation_usage),
      energyEfficiency: parseFloat(row.energy_efficiency),
      environmentalImpact: parseFloat(row.environmental_impact),
      sustainabilityScore: parseFloat(row.sustainability_score),
      resourceDepletionRate: parseFloat(row.resource_depletion_rate),
      approvalRating: parseFloat(row.approval_rating),
      politicalStability: parseFloat(row.political_stability),
      corruptionIndex: parseFloat(row.corruption_index),
      createdAt: row.created_at
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
