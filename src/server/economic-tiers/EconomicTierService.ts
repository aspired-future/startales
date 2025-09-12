/**
 * Economic Tier Service
 * 
 * Database operations and business logic for the Economic Tier Evolution system
 */

import { Pool } from 'pg';
import { 
  CityEconomicProfile, 
  EconomicTier, 
  DevelopmentConstraint, 
  GrowthOpportunity,
  DevelopmentEvent,
  DevelopmentProjection,
  TierDefinition,
  DevelopmentPlan,
  PolicyImpactAssessment,
  BenchmarkAnalysis
} from './economicTierInterfaces';

export class EconomicTierService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private safeJsonParse(value: any, defaultValue: any = {}): any {
    if (typeof value === 'object' && value !== null) {
      return value; // Already an object
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn('Failed to parse JSON:', value, error);
        return defaultValue;
      }
    }
    return defaultValue;
  }

  // City Economic Profile CRUD operations
  async createCityProfile(profile: CityEconomicProfile): Promise<number> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(`
        INSERT INTO city_economic_profiles (
          city_id, civilization_id, planet_id, current_tier, development_stage,
          tier_progress, economic_indicators, infrastructure, industry_composition,
          innovation_metrics, quality_of_life, tier_requirements, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING city_id
      `, [
        profile.city_id,
        profile.civilization_id,
        profile.planet_id,
        profile.current_tier,
        profile.development_stage,
        profile.tier_progress,
        JSON.stringify(profile.economic_indicators),
        JSON.stringify(profile.infrastructure),
        JSON.stringify(profile.industry_composition),
        JSON.stringify(profile.innovation_metrics),
        JSON.stringify(profile.quality_of_life),
        JSON.stringify(profile.tier_requirements),
        JSON.stringify(profile.metadata)
      ]);

      // Insert development constraints
      for (const constraint of profile.development_constraints) {
        await client.query(`
          INSERT INTO development_constraints (
            city_id, constraint_type, description, severity, impact_areas,
            estimated_cost_to_address, timeframe_to_resolve, probability_of_resolution,
            mitigation_strategies, stakeholders_involved
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          profile.city_id,
          constraint.constraint_type,
          constraint.description,
          constraint.severity,
          JSON.stringify(constraint.impact_areas),
          constraint.estimated_cost_to_address,
          constraint.timeframe_to_resolve,
          constraint.probability_of_resolution,
          JSON.stringify(constraint.mitigation_strategies),
          JSON.stringify(constraint.stakeholders_involved)
        ]);
      }

      // Insert growth opportunities
      for (const opportunity of profile.growth_opportunities) {
        await client.query(`
          INSERT INTO growth_opportunities (
            city_id, opportunity_type, title, description, potential_impact,
            investment_required, timeframe_years, success_probability, risk_factors,
            key_enablers, expected_outcomes, stakeholder_alignment
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          profile.city_id,
          opportunity.opportunity_type,
          opportunity.title,
          opportunity.description,
          opportunity.potential_impact,
          opportunity.investment_required,
          opportunity.timeframe_years,
          opportunity.success_probability,
          JSON.stringify(opportunity.risk_factors),
          JSON.stringify(opportunity.key_enablers),
          JSON.stringify(opportunity.expected_outcomes),
          opportunity.stakeholder_alignment
        ]);
      }

      // Insert development events
      for (const event of profile.development_history) {
        await client.query(`
          INSERT INTO development_events (
            id, city_id, event_type, title, description, event_date,
            impact_magnitude, affected_indicators, long_term_effects,
            lessons_learned, stakeholders_involved
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          event.event_id,
          profile.city_id,
          event.event_type,
          event.title,
          event.description,
          event.date,
          event.impact_magnitude,
          JSON.stringify(event.affected_indicators),
          JSON.stringify(event.long_term_effects),
          event.lessons_learned.join('; '),
          JSON.stringify(event.stakeholders_involved)
        ]);
      }

      // Insert development projections
      for (const projection of profile.projections) {
        await client.query(`
          INSERT INTO development_projections (
            id, city_id, scenario_name, probability, timeframe_years,
            projected_tier, key_assumptions, projected_indicators,
            critical_success_factors, major_risks, policy_recommendations
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          projection.projection_id,
          profile.city_id,
          projection.scenario_name,
          projection.probability,
          projection.timeframe_years,
          projection.projected_tier,
          JSON.stringify(projection.key_assumptions),
          JSON.stringify(projection.projected_indicators),
          JSON.stringify(projection.critical_success_factors),
          JSON.stringify(projection.major_risks),
          JSON.stringify(projection.policy_recommendations)
        ]);
      }

      await client.query('COMMIT');
      console.log(`✅ Created economic profile for city: ${profile.city_id}`);
      return result.rows[0].city_id;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating city economic profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCityProfile(cityId: number): Promise<CityEconomicProfile | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM city_economic_profiles WHERE city_id = $1
      `, [cityId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      // Get development constraints
      const constraintsResult = await client.query(`
        SELECT * FROM development_constraints WHERE city_id = $1 AND status = 'active'
      `, [cityId]);

      // Get growth opportunities
      const opportunitiesResult = await client.query(`
        SELECT * FROM growth_opportunities WHERE city_id = $1 AND status IN ('identified', 'evaluating', 'approved')
      `, [cityId]);

      // Get development events
      const eventsResult = await client.query(`
        SELECT * FROM development_events WHERE city_id = $1 ORDER BY event_date DESC
      `, [cityId]);

      // Get development projections
      const projectionsResult = await client.query(`
        SELECT * FROM development_projections WHERE city_id = $1 ORDER BY probability DESC
      `, [cityId]);

      const profile: CityEconomicProfile = {
        city_id: row.city_id,
        civilization_id: row.civilization_id,
        planet_id: row.planet_id,
        current_tier: row.current_tier,
        development_stage: row.development_stage,
        tier_progress: row.tier_progress,
        economic_indicators: JSON.parse(row.economic_indicators),
        infrastructure: JSON.parse(row.infrastructure),
        industry_composition: JSON.parse(row.industry_composition),
        innovation_metrics: JSON.parse(row.innovation_metrics),
        quality_of_life: JSON.parse(row.quality_of_life),
        development_constraints: constraintsResult.rows.map(c => ({
          constraint_type: c.constraint_type,
          description: c.description,
          severity: c.severity,
          impact_areas: JSON.parse(c.impact_areas),
          estimated_cost_to_address: parseFloat(c.estimated_cost_to_address || '0'),
          timeframe_to_resolve: c.timeframe_to_resolve,
          probability_of_resolution: c.probability_of_resolution,
          mitigation_strategies: JSON.parse(c.mitigation_strategies || '[]'),
          stakeholders_involved: JSON.parse(c.stakeholders_involved || '[]')
        })),
        growth_opportunities: opportunitiesResult.rows.map(o => ({
          opportunity_type: o.opportunity_type,
          title: o.title,
          description: o.description,
          potential_impact: o.potential_impact,
          investment_required: parseFloat(o.investment_required),
          timeframe_years: o.timeframe_years,
          success_probability: o.success_probability,
          risk_factors: JSON.parse(o.risk_factors || '[]'),
          key_enablers: JSON.parse(o.key_enablers || '[]'),
          expected_outcomes: JSON.parse(o.expected_outcomes || '[]'),
          stakeholder_alignment: o.stakeholder_alignment
        })),
        tier_requirements: JSON.parse(row.tier_requirements),
        development_history: eventsResult.rows.map(e => ({
          event_id: e.id,
          event_type: e.event_type,
          title: e.title,
          description: e.description,
          date: e.event_date,
          impact_magnitude: e.impact_magnitude,
          affected_indicators: JSON.parse(e.affected_indicators || '[]'),
          long_term_effects: JSON.parse(e.long_term_effects || '[]'),
          lessons_learned: e.lessons_learned ? e.lessons_learned.split('; ') : [],
          stakeholders_involved: JSON.parse(e.stakeholders_involved || '[]')
        })),
        projections: projectionsResult.rows.map(p => ({
          projection_id: p.id,
          scenario_name: p.scenario_name,
          probability: p.probability,
          timeframe_years: p.timeframe_years,
          projected_tier: p.projected_tier,
          key_assumptions: JSON.parse(p.key_assumptions || '[]'),
          projected_indicators: JSON.parse(p.projected_indicators || '{}'),
          critical_success_factors: JSON.parse(p.critical_success_factors || '[]'),
          major_risks: JSON.parse(p.major_risks || '[]'),
          policy_recommendations: JSON.parse(p.policy_recommendations || '[]')
        })),
        metadata: JSON.parse(row.metadata)
      };

      return profile;

    } catch (error) {
      console.error('❌ Error getting city economic profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCityProfile(cityId: number, updates: Partial<CityEconomicProfile>): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'city_id' || key === 'development_constraints' || key === 'growth_opportunities' || 
            key === 'development_history' || key === 'projections') {
          continue; // Skip these fields for main table update
        }
        
        if (typeof value === 'object' && value !== null) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }

      if (updateFields.length > 0) {
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(cityId);

        const query = `
          UPDATE city_economic_profiles 
          SET ${updateFields.join(', ')}
          WHERE city_id = $${paramIndex}
        `;

        await client.query(query, values);
      }

      await client.query('COMMIT');
      console.log(`✅ Updated economic profile for city: ${cityId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating city economic profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCitiesByTier(tier: EconomicTier, civilizationId?: number, limit: number = 50): Promise<CityEconomicProfile[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM city_economic_profiles 
        WHERE current_tier = $1
      `;
      const params = [tier];

      if (civilizationId) {
        query += ` AND civilization_id = $2`;
        params.push(civilizationId);
      }

      query += ` ORDER BY tier_progress DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await client.query(query, params);

      const profiles: CityEconomicProfile[] = [];
      for (const row of result.rows) {
        const profile = await this.getCityProfile(row.city_id);
        if (profile) {
          profiles.push(profile);
        }
      }

      return profiles;

    } catch (error) {
      console.error('❌ Error getting cities by tier:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getTierDefinitions(): Promise<TierDefinition[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM tier_definitions ORDER BY 
        CASE tier 
          WHEN 'developing' THEN 1 
          WHEN 'industrial' THEN 2 
          WHEN 'advanced' THEN 3 
          WHEN 'post_scarcity' THEN 4 
        END
      `);

      return result.rows.map(row => ({
        tier: row.tier,
        name: row.name,
        description: row.description,
        typical_characteristics: this.safeJsonParse(row.typical_characteristics),
        advancement_criteria: this.safeJsonParse(row.advancement_criteria),
        common_challenges: this.safeJsonParse(row.common_challenges, []),
        development_strategies: this.safeJsonParse(row.development_strategies, []),
        benchmark_cities: this.safeJsonParse(row.benchmark_cities, []),
        transition_pathways: this.safeJsonParse(row.transition_pathways, [])
      }));

    } catch (error) {
      console.error('❌ Error getting tier definitions:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async recordEconomicIndicators(cityId: number, indicators: any): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO economic_indicators_history (
          city_id, measurement_date, gdp_per_capita, gdp_growth_rate, unemployment_rate,
          inflation_rate, productivity_index, competitiveness_index, economic_complexity_index,
          innovation_index, quality_of_life_index, infrastructure_score, tier_at_measurement,
          data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (city_id, measurement_date) 
        DO UPDATE SET
          gdp_per_capita = EXCLUDED.gdp_per_capita,
          gdp_growth_rate = EXCLUDED.gdp_growth_rate,
          unemployment_rate = EXCLUDED.unemployment_rate,
          inflation_rate = EXCLUDED.inflation_rate,
          productivity_index = EXCLUDED.productivity_index,
          competitiveness_index = EXCLUDED.competitiveness_index,
          economic_complexity_index = EXCLUDED.economic_complexity_index,
          innovation_index = EXCLUDED.innovation_index,
          quality_of_life_index = EXCLUDED.quality_of_life_index,
          infrastructure_score = EXCLUDED.infrastructure_score,
          tier_at_measurement = EXCLUDED.tier_at_measurement,
          data_source = EXCLUDED.data_source
      `, [
        cityId,
        new Date(),
        indicators.gdp_per_capita,
        indicators.gdp_growth_rate,
        indicators.unemployment_rate,
        indicators.inflation_rate,
        indicators.productivity_index,
        indicators.competitiveness_index,
        indicators.economic_complexity_index,
        indicators.innovation_index || 0,
        indicators.quality_of_life_index || 0,
        indicators.infrastructure_score || 0,
        indicators.current_tier,
        'system_calculation'
      ]);

    } catch (error) {
      console.error('❌ Error recording economic indicators:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getEconomicIndicatorsHistory(cityId: number, days: number = 365): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM economic_indicators_history 
        WHERE city_id = $1 
        AND measurement_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY measurement_date DESC
      `, [cityId]);

      return result.rows.map(row => ({
        measurement_date: row.measurement_date,
        gdp_per_capita: parseFloat(row.gdp_per_capita || '0'),
        gdp_growth_rate: parseFloat(row.gdp_growth_rate || '0'),
        unemployment_rate: parseFloat(row.unemployment_rate || '0'),
        inflation_rate: parseFloat(row.inflation_rate || '0'),
        productivity_index: row.productivity_index,
        competitiveness_index: row.competitiveness_index,
        economic_complexity_index: row.economic_complexity_index,
        innovation_index: row.innovation_index,
        quality_of_life_index: row.quality_of_life_index,
        infrastructure_score: row.infrastructure_score,
        tier_at_measurement: row.tier_at_measurement
      }));

    } catch (error) {
      console.error('❌ Error getting economic indicators history:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async recordTierTransition(
    cityId: number, 
    fromTier: EconomicTier, 
    toTier: EconomicTier, 
    transitionData: any
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO tier_transition_events (
          city_id, from_tier, to_tier, transition_date, transition_duration_years,
          key_factors, catalyst_events, challenges_overcome, lessons_learned,
          sustainability_indicators
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        cityId,
        fromTier,
        toTier,
        new Date(),
        transitionData.duration_years || 0,
        JSON.stringify(transitionData.key_factors || []),
        JSON.stringify(transitionData.catalyst_events || []),
        JSON.stringify(transitionData.challenges_overcome || []),
        transitionData.lessons_learned || '',
        JSON.stringify(transitionData.sustainability_indicators || {})
      ]);

      console.log(`✅ Recorded tier transition for city ${cityId}: ${fromTier} → ${toTier}`);

    } catch (error) {
      console.error('❌ Error recording tier transition:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getTierTransitionHistory(cityId: number): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM tier_transition_events 
        WHERE city_id = $1 
        ORDER BY transition_date DESC
      `, [cityId]);

      return result.rows.map(row => ({
        from_tier: row.from_tier,
        to_tier: row.to_tier,
        transition_date: row.transition_date,
        transition_duration_years: parseFloat(row.transition_duration_years || '0'),
        key_factors: JSON.parse(row.key_factors || '[]'),
        catalyst_events: JSON.parse(row.catalyst_events || '[]'),
        challenges_overcome: JSON.parse(row.challenges_overcome || '[]'),
        lessons_learned: row.lessons_learned,
        sustainability_indicators: JSON.parse(row.sustainability_indicators || '{}')
      }));

    } catch (error) {
      console.error('❌ Error getting tier transition history:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCivilizationTierStatistics(civilizationId: number): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          current_tier,
          COUNT(*) as city_count,
          AVG(tier_progress) as avg_progress,
          AVG((economic_indicators->>'gdp_per_capita')::numeric) as avg_gdp_per_capita,
          AVG((infrastructure->>'overall_score')::numeric) as avg_infrastructure_score,
          AVG((innovation_metrics->>'innovation_index')::numeric) as avg_innovation_index,
          AVG((quality_of_life->>'overall_index')::numeric) as avg_quality_of_life
        FROM city_economic_profiles 
        WHERE civilization_id = $1
        GROUP BY current_tier
        ORDER BY 
          CASE current_tier 
            WHEN 'developing' THEN 1 
            WHEN 'industrial' THEN 2 
            WHEN 'advanced' THEN 3 
            WHEN 'post_scarcity' THEN 4 
          END
      `, [civilizationId]);

      const totalCities = await client.query(`
        SELECT COUNT(*) as total FROM city_economic_profiles WHERE civilization_id = $1
      `, [civilizationId]);

      return {
        civilization_id: civilizationId,
        total_cities: parseInt(totalCities.rows[0].total),
        tier_distribution: result.rows.map(row => ({
          tier: row.current_tier,
          city_count: parseInt(row.city_count),
          percentage: (parseInt(row.city_count) / parseInt(totalCities.rows[0].total)) * 100,
          avg_progress: Math.round(parseFloat(row.avg_progress || '0')),
          avg_gdp_per_capita: Math.round(parseFloat(row.avg_gdp_per_capita || '0')),
          avg_infrastructure_score: Math.round(parseFloat(row.avg_infrastructure_score || '0')),
          avg_innovation_index: Math.round(parseFloat(row.avg_innovation_index || '0')),
          avg_quality_of_life: Math.round(parseFloat(row.avg_quality_of_life || '0'))
        }))
      };

    } catch (error) {
      console.error('❌ Error getting civilization tier statistics:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createDevelopmentPlan(plan: DevelopmentPlan): Promise<string> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO development_plans (
          id, city_id, target_tier, planning_horizon_years, strategic_objectives,
          implementation_phases, resource_mobilization, risk_management,
          monitoring_framework, stakeholder_engagement, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        plan.plan_id,
        plan.city_id,
        plan.target_tier,
        plan.planning_horizon_years,
        JSON.stringify(plan.strategic_objectives),
        JSON.stringify(plan.implementation_phases),
        JSON.stringify(plan.resource_mobilization),
        JSON.stringify(plan.risk_management),
        JSON.stringify(plan.monitoring_framework),
        JSON.stringify(plan.stakeholder_engagement),
        'draft'
      ]);

      console.log(`✅ Created development plan: ${plan.plan_id}`);
      return result.rows[0].id;

    } catch (error) {
      console.error('❌ Error creating development plan:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getDevelopmentPlans(cityId: number): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM development_plans 
        WHERE city_id = $1 
        ORDER BY created_at DESC
      `, [cityId]);

      return result.rows.map(row => ({
        plan_id: row.id,
        target_tier: row.target_tier,
        planning_horizon_years: row.planning_horizon_years,
        strategic_objectives: JSON.parse(row.strategic_objectives),
        implementation_phases: JSON.parse(row.implementation_phases),
        resource_mobilization: JSON.parse(row.resource_mobilization),
        risk_management: JSON.parse(row.risk_management),
        monitoring_framework: JSON.parse(row.monitoring_framework),
        stakeholder_engagement: JSON.parse(row.stakeholder_engagement),
        status: row.status,
        approval_date: row.approval_date,
        created_at: row.created_at
      }));

    } catch (error) {
      console.error('❌ Error getting development plans:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
