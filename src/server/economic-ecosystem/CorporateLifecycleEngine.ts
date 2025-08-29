/**
 * Corporate Lifecycle Engine
 * 
 * Manages the complete lifecycle of corporations including mergers, acquisitions,
 * bankruptcies, new market entrants, product evolution, and market dynamics.
 */

import { Pool } from 'pg';
import { ProceduralCorporationGenerator } from './ProceduralCorporationGenerator';

export interface LifecycleEvent {
  id: string;
  type: 'merger' | 'acquisition' | 'bankruptcy' | 'ipo' | 'spinoff' | 'product_launch' | 'market_entry' | 'market_exit' | 'leadership_change';
  corporation_id: number;
  target_corporation_id?: number;
  event_date: Date;
  description: string;
  financial_impact: number;
  market_impact: number;
  employee_impact: number;
  success_probability: number;
  completion_date?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  metadata: any;
}

export interface MergerAcquisition {
  id: number;
  acquirer_id: number;
  target_id: number;
  transaction_type: 'merger' | 'acquisition' | 'hostile_takeover';
  offer_price: number;
  offer_premium: number;
  synergy_value: number;
  integration_timeline: number; // months
  regulatory_approval_required: boolean;
  shareholder_approval_required: boolean;
  due_diligence_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  announcement_date: Date;
  expected_completion: Date;
  actual_completion?: Date;
  success_factors: string[];
  risk_factors: string[];
  post_merger_performance?: PostMergerMetrics;
  status: 'announced' | 'pending_approval' | 'approved' | 'completed' | 'failed' | 'cancelled';
}

export interface PostMergerMetrics {
  revenue_synergy_achieved: number;
  cost_synergy_achieved: number;
  employee_retention_rate: number;
  customer_retention_rate: number;
  market_share_change: number;
  integration_cost: number;
  cultural_integration_score: number;
}

export interface BankruptcyEvent {
  id: number;
  corporation_id: number;
  bankruptcy_type: 'chapter_7' | 'chapter_11' | 'voluntary_liquidation' | 'forced_liquidation';
  filing_date: Date;
  assets_value: number;
  liabilities_value: number;
  creditors_count: number;
  employee_count: number;
  restructuring_plan?: RestructuringPlan;
  liquidation_proceeds?: number;
  recovery_rate?: number; // percentage of debt recovered
  resolution_date?: Date;
  successor_corporation_id?: number;
  status: 'filed' | 'under_review' | 'approved' | 'rejected' | 'completed';
}

export interface RestructuringPlan {
  debt_reduction_percentage: number;
  asset_sales: AssetSale[];
  operational_changes: string[];
  employment_changes: number;
  new_management: boolean;
  timeline_months: number;
  creditor_approval_required: boolean;
}

export interface AssetSale {
  asset_type: string;
  asset_value: number;
  buyer_id?: number;
  sale_price?: number;
  completion_date?: Date;
}

export interface ProductEvolution {
  id: number;
  corporation_id: number;
  product_id: number;
  evolution_type: 'upgrade' | 'new_version' | 'discontinuation' | 'pivot' | 'expansion';
  development_cost: number;
  market_research_score: number;
  technology_readiness: number;
  competitive_advantage: number;
  launch_date: Date;
  market_reception: 'excellent' | 'good' | 'average' | 'poor' | 'failure';
  revenue_impact: number;
  market_share_impact: number;
  cannibalization_effect: number;
  lifecycle_stage: 'development' | 'testing' | 'launch' | 'growth' | 'maturity' | 'decline';
}

export interface MarketEntry {
  id: number;
  corporation_id: number;
  target_market_id: number;
  entry_strategy: 'organic_growth' | 'acquisition' | 'joint_venture' | 'licensing' | 'franchising';
  investment_required: number;
  expected_timeline: number; // months
  market_barriers: string[];
  competitive_response: string[];
  success_metrics: SuccessMetric[];
  entry_date: Date;
  performance_to_date?: MarketEntryPerformance;
  status: 'planning' | 'executing' | 'established' | 'struggling' | 'exiting';
}

export interface SuccessMetric {
  metric_name: string;
  target_value: number;
  current_value?: number;
  measurement_date?: Date;
}

export interface MarketEntryPerformance {
  market_share_achieved: number;
  revenue_generated: number;
  customer_acquisition: number;
  brand_recognition: number;
  competitive_position: number;
  roi: number;
}

export interface CorporateHealth {
  corporation_id: number;
  financial_health: number; // 0-100
  operational_health: number; // 0-100
  market_health: number; // 0-100
  leadership_health: number; // 0-100
  overall_health: number; // 0-100
  bankruptcy_risk: number; // 0-100
  acquisition_attractiveness: number; // 0-100
  growth_potential: number; // 0-100
  innovation_index: number; // 0-100
  last_assessment: Date;
}

export class CorporateLifecycleEngine {
  private pool: Pool;
  private corporationGenerator: ProceduralCorporationGenerator;

  constructor(pool: Pool) {
    this.pool = pool;
    this.corporationGenerator = new ProceduralCorporationGenerator(pool);
  }

  /**
   * Assess the health of all corporations and identify lifecycle opportunities
   */
  async assessCorporateEcosystem(civilizationId: number): Promise<{
    healthyCompanies: number;
    strugglingCompanies: number;
    bankruptcyRisk: number[];
    mergerOpportunities: number;
    acquisitionTargets: number[];
    marketEntryOpportunities: number;
  }> {
    const client = await this.pool.connect();
    
    try {
      // Get all corporations for the civilization
      const corporationsQuery = `
        SELECT c.*, cm.market_cap, cm.current_price, cm.annual_revenue, cm.employee_count
        FROM corporations c
        LEFT JOIN corporate_markets cm ON c.id = cm.corporation_id
        WHERE c.civilization_id = $1 AND c.status = 'active'
      `;
      
      const corporations = await client.query(corporationsQuery, [civilizationId]);
      
      let healthyCompanies = 0;
      let strugglingCompanies = 0;
      const bankruptcyRisk: number[] = [];
      const acquisitionTargets: number[] = [];
      
      for (const corp of corporations.rows) {
        const health = await this.assessCorporateHealth(corp.id);
        
        if (health.overall_health >= 70) {
          healthyCompanies++;
        } else if (health.overall_health < 40) {
          strugglingCompanies++;
          if (health.bankruptcy_risk > 60) {
            bankruptcyRisk.push(corp.id);
          }
        }
        
        if (health.acquisition_attractiveness > 70) {
          acquisitionTargets.push(corp.id);
        }
      }

      // Calculate merger opportunities (companies that would benefit from combining)
      const mergerOpportunities = await this.identifyMergerOpportunities(civilizationId);
      
      // Calculate market entry opportunities
      const marketEntryOpportunities = await this.identifyMarketEntryOpportunities(civilizationId);

      return {
        healthyCompanies,
        strugglingCompanies,
        bankruptcyRisk,
        mergerOpportunities: mergerOpportunities.length,
        acquisitionTargets,
        marketEntryOpportunities
      };

    } finally {
      client.release();
    }
  }

  /**
   * Assess the health of a specific corporation
   */
  async assessCorporateHealth(corporationId: number): Promise<CorporateHealth> {
    const client = await this.pool.connect();
    
    try {
      // Get corporation financial data
      const corpQuery = `
        SELECT c.*, cm.market_cap, cm.current_price, cm.annual_revenue, 
               cm.employee_count, cm.pe_ratio, cm.dividend_yield
        FROM corporations c
        LEFT JOIN corporate_markets cm ON c.id = cm.corporation_id
        WHERE c.id = $1
      `;
      
      const corpResult = await client.query(corpQuery, [corporationId]);
      const corp = corpResult.rows[0];
      
      if (!corp) {
        throw new Error(`Corporation ${corporationId} not found`);
      }

      // Calculate financial health (revenue, profitability, debt ratios)
      const financialHealth = this.calculateFinancialHealth(corp);
      
      // Calculate operational health (efficiency, productivity, market position)
      const operationalHealth = this.calculateOperationalHealth(corp);
      
      // Calculate market health (market share, competitive position, growth)
      const marketHealth = this.calculateMarketHealth(corp);
      
      // Calculate leadership health (stability, performance, vision)
      const leadershipHealth = this.calculateLeadershipHealth(corp);
      
      // Overall health is weighted average
      const overallHealth = (
        financialHealth * 0.35 +
        operationalHealth * 0.25 +
        marketHealth * 0.25 +
        leadershipHealth * 0.15
      );

      // Calculate bankruptcy risk
      const bankruptcyRisk = this.calculateBankruptcyRisk(financialHealth, operationalHealth, marketHealth);
      
      // Calculate acquisition attractiveness
      const acquisitionAttractiveness = this.calculateAcquisitionAttractiveness(corp, overallHealth);
      
      // Calculate growth potential
      const growthPotential = this.calculateGrowthPotential(corp, marketHealth);
      
      // Calculate innovation index
      const innovationIndex = this.calculateInnovationIndex(corp);

      const health: CorporateHealth = {
        corporation_id: corporationId,
        financial_health: financialHealth,
        operational_health: operationalHealth,
        market_health: marketHealth,
        leadership_health: leadershipHealth,
        overall_health: overallHealth,
        bankruptcy_risk: bankruptcyRisk,
        acquisition_attractiveness: acquisitionAttractiveness,
        growth_potential: growthPotential,
        innovation_index: innovationIndex,
        last_assessment: new Date()
      };

      // Store the health assessment
      await this.storeCorporateHealth(health);
      
      return health;

    } finally {
      client.release();
    }
  }

  /**
   * Execute a merger or acquisition
   */
  async executeMergerAcquisition(
    acquirerId: number,
    targetId: number,
    transactionType: 'merger' | 'acquisition' | 'hostile_takeover',
    offerPrice: number
  ): Promise<MergerAcquisition> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get both companies
      const acquirerQuery = `SELECT * FROM corporate_markets WHERE corporation_id = $1`;
      const targetQuery = `SELECT * FROM corporate_markets WHERE corporation_id = $1`;
      
      const acquirer = (await client.query(acquirerQuery, [acquirerId])).rows[0];
      const target = (await client.query(targetQuery, [targetId])).rows[0];
      
      if (!acquirer || !target) {
        throw new Error('One or both corporations not found');
      }

      // Calculate offer premium
      const offerPremium = ((offerPrice - target.market_cap) / target.market_cap) * 100;
      
      // Calculate synergy value
      const synergyValue = this.calculateSynergyValue(acquirer, target);
      
      // Create merger/acquisition record
      const maQuery = `
        INSERT INTO merger_acquisitions (
          acquirer_id, target_id, transaction_type, offer_price, offer_premium,
          synergy_value, integration_timeline, announcement_date, expected_completion,
          status, success_factors, risk_factors
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW() + INTERVAL '6 months', 'announced', $8, $9)
        RETURNING *
      `;

      const successFactors = this.identifySuccessFactors(acquirer, target, transactionType);
      const riskFactors = this.identifyRiskFactors(acquirer, target, transactionType);
      
      const maResult = await client.query(maQuery, [
        acquirerId, targetId, transactionType, offerPrice, offerPremium,
        synergyValue, 6, JSON.stringify(successFactors), JSON.stringify(riskFactors)
      ]);

      const merger = maResult.rows[0];

      // Update target company status
      await client.query(
        `UPDATE corporations SET status = 'acquisition_pending' WHERE id = $1`,
        [targetId]
      );

      // Create lifecycle event
      await this.createLifecycleEvent({
        type: transactionType,
        corporation_id: acquirerId,
        target_corporation_id: targetId,
        description: `${transactionType} announced: ${acquirer.company_name} to acquire ${target.company_name} for $${(offerPrice / 1000000000).toFixed(1)}B`,
        financial_impact: offerPrice,
        market_impact: synergyValue,
        employee_impact: target.employee_count,
        success_probability: this.calculateTransactionSuccessProbability(acquirer, target, offerPremium),
        status: 'planned'
      });

      await client.query('COMMIT');
      return merger;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Process a corporate bankruptcy
   */
  async processBankruptcy(
    corporationId: number,
    bankruptcyType: 'chapter_7' | 'chapter_11' | 'voluntary_liquidation' | 'forced_liquidation'
  ): Promise<BankruptcyEvent> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get corporation data
      const corpQuery = `
        SELECT c.*, cm.market_cap, cm.annual_revenue, cm.employee_count
        FROM corporations c
        LEFT JOIN corporate_markets cm ON c.id = cm.corporation_id
        WHERE c.id = $1
      `;
      
      const corp = (await client.query(corpQuery, [corporationId])).rows[0];
      
      if (!corp) {
        throw new Error(`Corporation ${corporationId} not found`);
      }

      // Estimate assets and liabilities
      const assetsValue = corp.market_cap * 0.6; // Simplified calculation
      const liabilitiesValue = corp.market_cap * 1.2; // Assuming over-leveraged
      
      // Create bankruptcy record
      const bankruptcyQuery = `
        INSERT INTO bankruptcy_events (
          corporation_id, bankruptcy_type, filing_date, assets_value,
          liabilities_value, employee_count, status
        ) VALUES ($1, $2, NOW(), $3, $4, $5, 'filed')
        RETURNING *
      `;

      const bankruptcyResult = await client.query(bankruptcyQuery, [
        corporationId, bankruptcyType, assetsValue, liabilitiesValue, corp.employee_count
      ]);

      const bankruptcy = bankruptcyResult.rows[0];

      // Update corporation status
      await client.query(
        `UPDATE corporations SET status = 'bankruptcy' WHERE id = $1`,
        [corporationId]
      );

      // Create lifecycle event
      await this.createLifecycleEvent({
        type: 'bankruptcy',
        corporation_id: corporationId,
        description: `${corp.company_name} filed for ${bankruptcyType} bankruptcy`,
        financial_impact: -assetsValue,
        market_impact: -50,
        employee_impact: -corp.employee_count,
        success_probability: bankruptcyType === 'chapter_11' ? 30 : 5, // Chapter 11 has better survival odds
        status: 'in_progress'
      });

      await client.query('COMMIT');
      return bankruptcy;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Launch a new product or evolve existing products
   */
  async evolveProduct(
    corporationId: number,
    productId: number,
    evolutionType: 'upgrade' | 'new_version' | 'discontinuation' | 'pivot' | 'expansion',
    developmentCost: number
  ): Promise<ProductEvolution> {
    const client = await this.pool.connect();
    
    try {
      // Market research and technology assessment
      const marketResearchScore = Math.random() * 100;
      const technologyReadiness = Math.random() * 100;
      const competitiveAdvantage = Math.random() * 100;
      
      // Calculate launch date (based on development complexity)
      const developmentTime = Math.floor(developmentCost / 1000000) + 3; // months
      const launchDate = new Date();
      launchDate.setMonth(launchDate.getMonth() + developmentTime);

      // Create product evolution record
      const evolutionQuery = `
        INSERT INTO product_evolutions (
          corporation_id, product_id, evolution_type, development_cost,
          market_research_score, technology_readiness, competitive_advantage,
          launch_date, lifecycle_stage
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'development')
        RETURNING *
      `;

      const evolutionResult = await client.query(evolutionQuery, [
        corporationId, productId, evolutionType, developmentCost,
        marketResearchScore, technologyReadiness, competitiveAdvantage, launchDate
      ]);

      const evolution = evolutionResult.rows[0];

      // Create lifecycle event
      await this.createLifecycleEvent({
        type: 'product_launch',
        corporation_id: corporationId,
        description: `New ${evolutionType} product development initiated with $${(developmentCost / 1000000).toFixed(1)}M investment`,
        financial_impact: -developmentCost,
        market_impact: competitiveAdvantage,
        employee_impact: Math.floor(developmentCost / 100000), // Rough estimate of jobs created
        success_probability: (marketResearchScore + technologyReadiness + competitiveAdvantage) / 3,
        status: 'in_progress'
      });

      return evolution;

    } finally {
      client.release();
    }
  }

  /**
   * Generate new market entrants
   */
  async generateMarketEntrants(civilizationId: number, count: number = 1): Promise<string[]> {
    const newCompanies: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // Generate a new corporation
        const sectors = ['technology', 'healthcare', 'energy', 'manufacturing', 'financial', 'defense'];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const sizeCategory = Math.random() < 0.7 ? 'startup' : 'small'; // Most new entrants are small
        
        const generated = await this.corporationGenerator.generateCorporation(1, sector, sizeCategory);
        
        // Insert into database (simplified - would need proper integration)
        const client = await this.pool.connect();
        try {
          const insertQuery = `
            INSERT INTO corporations (civilization_id, company_name, sector, status, founded_date)
            VALUES ($1, $2, $3, 'active', NOW())
            RETURNING id, company_name
          `;
          
          const result = await client.query(insertQuery, [
            civilizationId, generated.company.company_name, sector
          ]);
          
          const newCorp = result.rows[0];
          newCompanies.push(newCorp.company_name);

          // Create lifecycle event
          await this.createLifecycleEvent({
            type: 'market_entry',
            corporation_id: newCorp.id,
            description: `${newCorp.company_name} entered the ${sector} market as a new ${sizeCategory} company`,
            financial_impact: generated.company.market_cap,
            market_impact: 10,
            employee_impact: generated.company.employee_count,
            success_probability: sizeCategory === 'startup' ? 20 : 40, // Startups have lower success rates
            status: 'completed'
          });

        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error generating market entrant:', error);
      }
    }
    
    return newCompanies;
  }

  // Helper methods for calculations
  private calculateFinancialHealth(corp: any): number {
    let score = 50; // Base score
    
    // Revenue growth (simplified)
    if (corp.annual_revenue > 1000000000) score += 20; // $1B+ revenue
    else if (corp.annual_revenue > 100000000) score += 10; // $100M+ revenue
    
    // P/E ratio health
    if (corp.pe_ratio > 0 && corp.pe_ratio < 25) score += 15; // Healthy P/E
    else if (corp.pe_ratio > 50) score -= 10; // Overvalued
    
    // Dividend yield
    if (corp.dividend_yield > 0) score += 10; // Paying dividends is good
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateOperationalHealth(corp: any): number {
    let score = 50; // Base score
    
    // Employee efficiency (revenue per employee)
    const revenuePerEmployee = corp.annual_revenue / Math.max(corp.employee_count, 1);
    if (revenuePerEmployee > 500000) score += 20; // $500k+ per employee
    else if (revenuePerEmployee > 200000) score += 10; // $200k+ per employee
    
    // Company age (stability)
    const age = 2400 - corp.founded_year;
    if (age > 20) score += 15; // Established company
    else if (age < 5) score += 5; // Young but potentially innovative
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateMarketHealth(corp: any): number {
    let score = 50; // Base score
    
    // Market cap relative to sector (simplified)
    if (corp.market_cap > 100000000000) score += 25; // $100B+ market cap
    else if (corp.market_cap > 10000000000) score += 15; // $10B+ market cap
    else if (corp.market_cap > 1000000000) score += 5; // $1B+ market cap
    
    // Sector-specific bonuses
    if (corp.sector === 'technology') score += 10; // Tech premium
    else if (corp.sector === 'healthcare') score += 5; // Healthcare stability
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateLeadershipHealth(corp: any): number {
    // Simplified leadership assessment
    return 50 + Math.random() * 30; // 50-80 range
  }

  private calculateBankruptcyRisk(financial: number, operational: number, market: number): number {
    const avgHealth = (financial + operational + market) / 3;
    return Math.max(0, 100 - avgHealth);
  }

  private calculateAcquisitionAttractiveness(corp: any, overallHealth: number): number {
    let attractiveness = overallHealth * 0.6; // Base on health
    
    // Add sector attractiveness
    if (corp.sector === 'technology') attractiveness += 20;
    else if (corp.sector === 'healthcare') attractiveness += 15;
    
    // Add size attractiveness (not too big, not too small)
    if (corp.market_cap > 1000000000 && corp.market_cap < 50000000000) {
      attractiveness += 15; // Sweet spot for acquisitions
    }
    
    return Math.max(0, Math.min(100, attractiveness));
  }

  private calculateGrowthPotential(corp: any, marketHealth: number): number {
    let potential = marketHealth * 0.7; // Base on market position
    
    // Young companies have higher growth potential
    const age = 2400 - corp.founded_year;
    if (age < 10) potential += 20;
    else if (age < 20) potential += 10;
    
    // Tech and healthcare have higher growth potential
    if (corp.sector === 'technology' || corp.sector === 'healthcare') {
      potential += 15;
    }
    
    return Math.max(0, Math.min(100, potential));
  }

  private calculateInnovationIndex(corp: any): number {
    let innovation = 50; // Base score
    
    // Sector innovation bonus
    if (corp.sector === 'technology') innovation += 30;
    else if (corp.sector === 'healthcare') innovation += 20;
    else if (corp.sector === 'energy') innovation += 15;
    
    // Size factor (smaller companies often more innovative)
    if (corp.employee_count < 1000) innovation += 15;
    else if (corp.employee_count > 50000) innovation -= 10;
    
    return Math.max(0, Math.min(100, innovation));
  }

  private calculateSynergyValue(acquirer: any, target: any): number {
    // Simplified synergy calculation
    const revenueSynergy = (acquirer.annual_revenue + target.annual_revenue) * 0.05; // 5% revenue synergy
    const costSynergy = (acquirer.employee_count + target.employee_count) * 50000 * 0.1; // 10% cost synergy
    return revenueSynergy + costSynergy;
  }

  private identifySuccessFactors(acquirer: any, target: any, type: string): string[] {
    const factors = [];
    
    if (acquirer.sector === target.sector) {
      factors.push('Same industry expertise');
    }
    
    if (acquirer.market_cap > target.market_cap * 3) {
      factors.push('Strong financial position');
    }
    
    if (type === 'acquisition') {
      factors.push('Clear integration path');
    }
    
    return factors;
  }

  private identifyRiskFactors(acquirer: any, target: any, type: string): string[] {
    const factors = [];
    
    if (acquirer.sector !== target.sector) {
      factors.push('Cross-industry integration challenges');
    }
    
    if (type === 'hostile_takeover') {
      factors.push('Management resistance');
      factors.push('Cultural integration difficulties');
    }
    
    if (target.employee_count > acquirer.employee_count) {
      factors.push('Large workforce integration');
    }
    
    return factors;
  }

  private calculateTransactionSuccessProbability(acquirer: any, target: any, premium: number): number {
    let probability = 70; // Base probability
    
    // Premium impact
    if (premium > 50) probability -= 20; // High premium reduces success
    else if (premium > 30) probability -= 10;
    else if (premium < 10) probability -= 15; // Too low premium also risky
    
    // Sector compatibility
    if (acquirer.sector === target.sector) probability += 15;
    
    // Size compatibility
    const sizeRatio = acquirer.market_cap / target.market_cap;
    if (sizeRatio > 2 && sizeRatio < 10) probability += 10; // Good size ratio
    
    return Math.max(10, Math.min(90, probability));
  }

  private async identifyMergerOpportunities(civilizationId: number): Promise<any[]> {
    // Simplified - would implement complex matching algorithm
    return [];
  }

  private async identifyMarketEntryOpportunities(civilizationId: number): Promise<number> {
    // Simplified - would analyze market gaps and opportunities
    return Math.floor(Math.random() * 5) + 1;
  }

  private async storeCorporateHealth(health: CorporateHealth): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO corporate_health_assessments (
          corporation_id, financial_health, operational_health, market_health,
          leadership_health, overall_health, bankruptcy_risk, acquisition_attractiveness,
          growth_potential, innovation_index, assessment_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        ON CONFLICT (corporation_id) DO UPDATE SET
          financial_health = EXCLUDED.financial_health,
          operational_health = EXCLUDED.operational_health,
          market_health = EXCLUDED.market_health,
          leadership_health = EXCLUDED.leadership_health,
          overall_health = EXCLUDED.overall_health,
          bankruptcy_risk = EXCLUDED.bankruptcy_risk,
          acquisition_attractiveness = EXCLUDED.acquisition_attractiveness,
          growth_potential = EXCLUDED.growth_potential,
          innovation_index = EXCLUDED.innovation_index,
          assessment_date = NOW()
      `;
      
      await client.query(query, [
        health.corporation_id, health.financial_health, health.operational_health,
        health.market_health, health.leadership_health, health.overall_health,
        health.bankruptcy_risk, health.acquisition_attractiveness,
        health.growth_potential, health.innovation_index
      ]);
    } finally {
      client.release();
    }
  }

  private async createLifecycleEvent(event: Omit<LifecycleEvent, 'id' | 'event_date'>): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO corporate_lifecycle_events (
          type, corporation_id, target_corporation_id, description,
          financial_impact, market_impact, employee_impact, success_probability,
          status, metadata, event_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      `;
      
      await client.query(query, [
        event.type, event.corporation_id, event.target_corporation_id,
        event.description, event.financial_impact, event.market_impact,
        event.employee_impact, event.success_probability, event.status,
        JSON.stringify(event.metadata || {})
      ]);
    } finally {
      client.release();
    }
  }
}
