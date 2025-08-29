/**
 * Small Business Service
 * 
 * Database operations and business logic for the Small Business Ecosystem
 */

import { Pool } from 'pg';
import { SmallBusiness, DistributionNetwork, BusinessAnalytics } from './smallBusinessInterfaces';

export class SmallBusinessService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Small Business CRUD operations
  async createBusiness(business: SmallBusiness): Promise<string> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert main business record
      const businessResult = await client.query(`
        INSERT INTO small_businesses (
          id, name, business_type, category, subcategory, civilization_id, planet_id, city_id,
          location, owner, financial_info, operations, market_presence, business_health,
          growth_metrics, compliance, lifecycle, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
      `, [
        business.id,
        business.name,
        business.business_type,
        business.category,
        business.subcategory,
        business.civilization_id,
        business.planet_id,
        business.city_id,
        JSON.stringify(business.location),
        JSON.stringify(business.owner),
        JSON.stringify(business.financial_info),
        JSON.stringify(business.operations),
        JSON.stringify(business.market_presence),
        JSON.stringify(business.business_health),
        JSON.stringify(business.growth_metrics),
        JSON.stringify(business.compliance),
        JSON.stringify(business.lifecycle),
        JSON.stringify(business.metadata)
      ]);

      // Insert employees
      for (const employee of business.employees) {
        await client.query(`
          INSERT INTO business_employees (
            id, business_id, character_id, name, position, employment_type,
            hourly_wage, hours_per_week, skill_level, productivity, job_satisfaction,
            tenure_months, benefits_package
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          employee.id,
          business.id,
          employee.character_id,
          employee.name,
          employee.position,
          employee.employment_type,
          employee.hourly_wage,
          employee.hours_per_week,
          employee.skill_level,
          employee.productivity,
          employee.job_satisfaction,
          employee.tenure_months,
          JSON.stringify(employee.benefits_package)
        ]);
      }

      // Insert products/services
      for (const product of business.products_services) {
        await client.query(`
          INSERT INTO business_products_services (
            id, business_id, name, type, category, description, price,
            cost_to_produce, profit_margin, popularity_score, quality_rating,
            seasonal_demand, customizable, delivery_options, warranty_period, certifications
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
          product.id,
          business.id,
          product.name,
          product.type,
          product.category,
          product.description,
          product.price,
          product.cost_to_produce,
          product.profit_margin,
          product.popularity_score,
          product.quality_rating,
          product.seasonal_demand,
          product.customizable,
          JSON.stringify(product.delivery_options),
          product.warranty_period,
          JSON.stringify(product.certifications)
        ]);
      }

      // Insert supplier relationships
      for (const supplier of business.suppliers) {
        await client.query(`
          INSERT INTO supplier_relationships (
            business_id, supplier_id, supplier_name, supplier_type, products_services,
            relationship_strength, payment_terms, delivery_reliability, quality_consistency,
            price_competitiveness, contract_end_date, exclusive_agreement
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          business.id,
          supplier.supplier_id,
          supplier.supplier_name,
          supplier.supplier_type,
          JSON.stringify(supplier.products_services),
          supplier.relationship_strength,
          supplier.payment_terms,
          supplier.delivery_reliability,
          supplier.quality_consistency,
          supplier.price_competitiveness,
          supplier.contract_end_date,
          supplier.exclusive_agreement
        ]);
      }

      await client.query('COMMIT');
      console.log(`✅ Created small business: ${business.name}`);
      return businessResult.rows[0].id;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating small business:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getBusiness(businessId: string): Promise<SmallBusiness | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM small_businesses WHERE id = $1
      `, [businessId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      
      // Get employees
      const employeesResult = await client.query(`
        SELECT * FROM business_employees WHERE business_id = $1
      `, [businessId]);

      // Get products/services
      const productsResult = await client.query(`
        SELECT * FROM business_products_services WHERE business_id = $1
      `, [businessId]);

      // Get suppliers
      const suppliersResult = await client.query(`
        SELECT * FROM supplier_relationships WHERE business_id = $1
      `, [businessId]);

      const business: SmallBusiness = {
        id: row.id,
        name: row.name,
        business_type: row.business_type,
        category: row.category,
        subcategory: row.subcategory,
        civilization_id: row.civilization_id,
        planet_id: row.planet_id,
        city_id: row.city_id,
        location: JSON.parse(row.location),
        owner: JSON.parse(row.owner),
        employees: employeesResult.rows.map(emp => ({
          id: emp.id,
          character_id: emp.character_id,
          name: emp.name,
          position: emp.position,
          employment_type: emp.employment_type,
          hourly_wage: parseFloat(emp.hourly_wage),
          hours_per_week: emp.hours_per_week,
          skill_level: emp.skill_level,
          productivity: emp.productivity,
          job_satisfaction: emp.job_satisfaction,
          tenure_months: emp.tenure_months,
          benefits_package: JSON.parse(emp.benefits_package || '[]')
        })),
        financial_info: JSON.parse(row.financial_info),
        operations: JSON.parse(row.operations),
        products_services: productsResult.rows.map(prod => ({
          id: prod.id,
          name: prod.name,
          type: prod.type,
          category: prod.category,
          description: prod.description,
          price: parseFloat(prod.price),
          cost_to_produce: parseFloat(prod.cost_to_produce),
          profit_margin: parseFloat(prod.profit_margin),
          popularity_score: prod.popularity_score,
          quality_rating: prod.quality_rating,
          seasonal_demand: prod.seasonal_demand,
          customizable: prod.customizable,
          delivery_options: JSON.parse(prod.delivery_options || '[]'),
          warranty_period: prod.warranty_period,
          certifications: JSON.parse(prod.certifications || '[]')
        })),
        suppliers: suppliersResult.rows.map(sup => ({
          supplier_id: sup.supplier_id,
          supplier_name: sup.supplier_name,
          supplier_type: sup.supplier_type,
          products_services: JSON.parse(sup.products_services),
          relationship_strength: sup.relationship_strength,
          payment_terms: sup.payment_terms,
          delivery_reliability: sup.delivery_reliability,
          quality_consistency: sup.quality_consistency,
          price_competitiveness: sup.price_competitiveness,
          contract_end_date: sup.contract_end_date,
          exclusive_agreement: sup.exclusive_agreement
        })),
        customers: JSON.parse(row.financial_info).customers || {},
        market_presence: JSON.parse(row.market_presence),
        business_health: JSON.parse(row.business_health),
        growth_metrics: JSON.parse(row.growth_metrics),
        compliance: JSON.parse(row.compliance),
        lifecycle: JSON.parse(row.lifecycle),
        metadata: JSON.parse(row.metadata)
      };

      return business;

    } catch (error) {
      console.error('❌ Error getting small business:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getBusinessesByCity(cityId: number, limit: number = 50): Promise<SmallBusiness[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM small_businesses 
        WHERE city_id = $1 
        ORDER BY (business_health->>'overall_score')::int DESC
        LIMIT $2
      `, [cityId, limit]);

      const businesses: SmallBusiness[] = [];
      for (const row of result.rows) {
        const business = await this.getBusiness(row.id);
        if (business) {
          businesses.push(business);
        }
      }

      return businesses;

    } catch (error) {
      console.error('❌ Error getting businesses by city:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getBusinessesByCategory(category: string, civilizationId?: number, limit: number = 50): Promise<SmallBusiness[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM small_businesses 
        WHERE category = $1
      `;
      const params = [category];

      if (civilizationId) {
        query += ` AND civilization_id = $2`;
        params.push(civilizationId);
      }

      query += ` ORDER BY (business_health->>'overall_score')::int DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await client.query(query, params);

      const businesses: SmallBusiness[] = [];
      for (const row of result.rows) {
        const business = await this.getBusiness(row.id);
        if (business) {
          businesses.push(business);
        }
      }

      return businesses;

    } catch (error) {
      console.error('❌ Error getting businesses by category:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateBusiness(businessId: string, updates: Partial<SmallBusiness>): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'id' || key === 'employees' || key === 'products_services' || key === 'suppliers') {
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
        // Update last_updated
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(businessId);

        const query = `
          UPDATE small_businesses 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
        `;

        await client.query(query, values);
      }

      await client.query('COMMIT');
      console.log(`✅ Updated small business: ${businessId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating small business:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteBusiness(businessId: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Delete business (cascade will handle related records)
      await client.query(`DELETE FROM small_businesses WHERE id = $1`, [businessId]);

      await client.query('COMMIT');
      console.log(`✅ Deleted small business: ${businessId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error deleting small business:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Distribution Network operations
  async createDistributionNetwork(network: DistributionNetwork): Promise<string> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const networkResult = await client.query(`
        INSERT INTO distribution_networks (
          id, name, network_type, coverage_area, logistics, performance_metrics,
          cost_structure, technology_integration, sustainability
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        network.id,
        network.name,
        network.network_type,
        JSON.stringify(network.coverage_area),
        JSON.stringify(network.logistics),
        JSON.stringify(network.performance_metrics),
        JSON.stringify(network.cost_structure),
        JSON.stringify(network.technology_integration),
        JSON.stringify(network.sustainability)
      ]);

      // Insert participants
      for (const participant of network.participants) {
        await client.query(`
          INSERT INTO network_participants (
            network_id, business_id, business_name, role, participation_level,
            contribution_score, reliability_rating, joined_date, benefits_received, obligations
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          network.id,
          participant.business_id,
          participant.business_name,
          participant.role,
          participant.participation_level,
          participant.contribution_score,
          participant.reliability_rating,
          participant.joined_date,
          JSON.stringify(participant.benefits_received),
          JSON.stringify(participant.obligations)
        ]);
      }

      await client.query('COMMIT');
      console.log(`✅ Created distribution network: ${network.name}`);
      return networkResult.rows[0].id;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating distribution network:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getDistributionNetwork(networkId: string): Promise<DistributionNetwork | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM distribution_networks WHERE id = $1
      `, [networkId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      
      // Get participants
      const participantsResult = await client.query(`
        SELECT * FROM network_participants WHERE network_id = $1
      `, [networkId]);

      const network: DistributionNetwork = {
        id: row.id,
        name: row.name,
        network_type: row.network_type,
        coverage_area: JSON.parse(row.coverage_area),
        participants: participantsResult.rows.map(p => ({
          business_id: p.business_id,
          business_name: p.business_name,
          role: p.role,
          participation_level: p.participation_level,
          contribution_score: p.contribution_score,
          reliability_rating: p.reliability_rating,
          joined_date: p.joined_date,
          benefits_received: JSON.parse(p.benefits_received || '[]'),
          obligations: JSON.parse(p.obligations || '[]')
        })),
        logistics: JSON.parse(row.logistics),
        performance_metrics: JSON.parse(row.performance_metrics),
        cost_structure: JSON.parse(row.cost_structure),
        technology_integration: JSON.parse(row.technology_integration),
        sustainability: JSON.parse(row.sustainability)
      };

      return network;

    } catch (error) {
      console.error('❌ Error getting distribution network:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Business Analytics operations
  async recordBusinessAnalytics(analytics: BusinessAnalytics): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO business_analytics (
          business_id, analysis_date, performance_indicators, market_analysis,
          financial_analysis, operational_analysis, competitive_analysis,
          risk_analysis, recommendations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (business_id, analysis_date) 
        DO UPDATE SET
          performance_indicators = EXCLUDED.performance_indicators,
          market_analysis = EXCLUDED.market_analysis,
          financial_analysis = EXCLUDED.financial_analysis,
          operational_analysis = EXCLUDED.operational_analysis,
          competitive_analysis = EXCLUDED.competitive_analysis,
          risk_analysis = EXCLUDED.risk_analysis,
          recommendations = EXCLUDED.recommendations
      `, [
        analytics.business_id,
        analytics.analysis_date,
        JSON.stringify(analytics.performance_indicators),
        JSON.stringify(analytics.market_analysis),
        JSON.stringify(analytics.financial_analysis),
        JSON.stringify(analytics.operational_analysis),
        JSON.stringify(analytics.competitive_analysis),
        JSON.stringify(analytics.risk_analysis),
        JSON.stringify(analytics.recommendations)
      ]);

    } catch (error) {
      console.error('❌ Error recording business analytics:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getBusinessAnalytics(businessId: string, days: number = 30): Promise<BusinessAnalytics[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM business_analytics 
        WHERE business_id = $1 
        AND analysis_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY analysis_date DESC
      `, [businessId]);

      return result.rows.map(row => ({
        business_id: row.business_id,
        analysis_date: row.analysis_date,
        performance_indicators: JSON.parse(row.performance_indicators),
        market_analysis: JSON.parse(row.market_analysis),
        financial_analysis: JSON.parse(row.financial_analysis),
        operational_analysis: JSON.parse(row.operational_analysis),
        competitive_analysis: JSON.parse(row.competitive_analysis),
        risk_analysis: JSON.parse(row.risk_analysis),
        recommendations: JSON.parse(row.recommendations)
      }));

    } catch (error) {
      console.error('❌ Error getting business analytics:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Market data operations
  async getMarketTrends(civilizationId: number, industryCategory?: string): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM market_trends 
        WHERE civilization_id = $1
      `;
      const params = [civilizationId];

      if (industryCategory) {
        query += ` AND industry_category = $2`;
        params.push(industryCategory);
      }

      query += ` ORDER BY start_date DESC LIMIT 20`;

      const result = await client.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('❌ Error getting market trends:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getBusinessStatistics(civilizationId: number): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_businesses,
          COUNT(CASE WHEN category = 'retail' THEN 1 END) as retail_count,
          COUNT(CASE WHEN category = 'food_service' THEN 1 END) as food_service_count,
          COUNT(CASE WHEN category = 'professional_services' THEN 1 END) as professional_services_count,
          COUNT(CASE WHEN category = 'manufacturing' THEN 1 END) as manufacturing_count,
          COUNT(CASE WHEN category = 'technology' THEN 1 END) as technology_count,
          AVG((business_health->>'overall_score')::int) as avg_business_health,
          AVG((financial_info->>'monthly_revenue')::numeric) as avg_monthly_revenue,
          COUNT(CASE WHEN (lifecycle->>'current_stage') = 'startup' THEN 1 END) as startup_count,
          COUNT(CASE WHEN (lifecycle->>'current_stage') = 'growth' THEN 1 END) as growth_count,
          COUNT(CASE WHEN (lifecycle->>'current_stage') = 'maturity' THEN 1 END) as maturity_count
        FROM small_businesses 
        WHERE civilization_id = $1
      `, [civilizationId]);

      return result.rows[0];

    } catch (error) {
      console.error('❌ Error getting business statistics:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
