import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { TradeEngine, TradeResource } from '../trade/tradeEngine.js';
import { TradeStorage } from '../trade/tradeStorage.js';
import { getTradePactsService } from '../economic-ecosystem/TradePactsService.js';

export interface CommerceOperation {
  id: string;
  campaignId: number;
  operationType: 'tariff_adjustment' | 'trade_agreement' | 'business_license' | 'market_analysis' | 'economic_development';
  title: string;
  description: string;
  status: 'active' | 'completed' | 'suspended' | 'cancelled';
  parameters: Record<string, any>;
  results: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TradePolicy {
  id: string;
  campaignId: number;
  policyType: 'tariff' | 'quota' | 'embargo' | 'preference' | 'subsidy';
  targetResource?: string;
  targetPartner?: string;
  targetRoute?: string;
  policyValue: number;
  effectiveDate: Date;
  expirationDate?: Date;
  justification: string;
  economicImpact: Record<string, any>;
  status: 'active' | 'expired' | 'suspended' | 'repealed';
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessRegistration {
  id: string;
  campaignId: number;
  businessName: string;
  businessType: 'corporation' | 'partnership' | 'sole_proprietorship' | 'cooperative' | 'state_enterprise';
  industrySector: string;
  registrationDate: Date;
  licenseStatus: 'active' | 'suspended' | 'revoked' | 'expired' | 'pending';
  complianceScore: number;
  annualRevenue: number;
  employeeCount: number;
  regulatoryFlags: string[];
  contactInfo: Record<string, any>;
  businessAddress?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketIntelligence {
  id: string;
  campaignId: number;
  intelligenceType: 'price_analysis' | 'demand_forecast' | 'competitor_analysis' | 'trade_flow_analysis' | 'market_opportunity';
  targetMarket: string;
  dataPoints: Record<string, any>;
  analysisResults: Record<string, any>;
  confidenceLevel: number;
  collectionDate: Date;
  analystNotes?: string;
  actionableInsights: any[];
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  sourceReliability: 'low' | 'medium' | 'high' | 'verified';
  createdAt: Date;
  updatedAt: Date;
}

export interface EconomicDevelopmentProject {
  id: string;
  campaignId: number;
  projectName: string;
  projectType: 'investment_promotion' | 'export_development' | 'industrial_development' | 'infrastructure' | 'innovation_hub';
  targetSector?: string;
  budgetAllocated: number;
  budgetSpent: number;
  expectedOutcomes: Record<string, any>;
  actualOutcomes: Record<string, any>;
  status: 'planning' | 'approved' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  startDate: Date;
  targetCompletion: Date;
  actualCompletion?: Date;
  projectManager?: string;
  stakeholders: any[];
  riskAssessment: Record<string, any>;
  successMetrics: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeAgreement {
  id: string;
  campaignId: number;
  agreementName: string;
  agreementType: 'bilateral' | 'multilateral' | 'preferential' | 'free_trade' | 'customs_union';
  parties: string[];
  terms: Record<string, any>;
  tradeBenefits: Record<string, any>;
  status: 'negotiating' | 'signed' | 'ratified' | 'active' | 'suspended' | 'terminated';
  effectiveDate?: Date;
  expirationDate?: Date;
  negotiator?: string;
  economicImpact: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Commerce Secretary Service - Manages economic policy, business regulation, and market oversight
 */
export class CommerceSecretaryService {
  constructor(private pool: Pool) {}

  // ===== TRADE POLICY MANAGEMENT =====

  /**
   * Create a new trade policy
   */
  async createTradePolicy(
    campaignId: number,
    policyData: Omit<TradePolicy, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TradePolicy> {
    const id = nanoid();
    const now = new Date();

    const result = await this.pool.query(`
      INSERT INTO trade_policies (
        id, campaign_id, policy_type, target_resource, target_partner, target_route,
        policy_value, effective_date, expiration_date, justification, economic_impact,
        status, created_by, approved_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      id, campaignId, policyData.policyType, policyData.targetResource,
      policyData.targetPartner, policyData.targetRoute, policyData.policyValue,
      policyData.effectiveDate, policyData.expirationDate, policyData.justification,
      JSON.stringify(policyData.economicImpact), policyData.status,
      policyData.createdBy, policyData.approvedBy
    ]);

    return this.mapTradePolicy(result.rows[0]);
  }

  /**
   * Get trade policies for a campaign
   */
  async getTradePolicies(
    campaignId: number,
    filters?: {
      policyType?: string;
      status?: string;
      targetResource?: string;
    }
  ): Promise<TradePolicy[]> {
    let query = 'SELECT * FROM trade_policies WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (filters?.policyType) {
      query += ` AND policy_type = $${paramIndex}`;
      params.push(filters.policyType);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.targetResource) {
      query += ` AND target_resource = $${paramIndex}`;
      params.push(filters.targetResource);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapTradePolicy(row));
  }

  /**
   * Update trade policy status
   */
  async updateTradePolicyStatus(
    policyId: string,
    status: TradePolicy['status'],
    approvedBy?: string
  ): Promise<TradePolicy> {
    const result = await this.pool.query(`
      UPDATE trade_policies 
      SET status = $1, approved_by = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, approvedBy, policyId]);

    if (result.rows.length === 0) {
      throw new Error(`Trade policy ${policyId} not found`);
    }

    return this.mapTradePolicy(result.rows[0]);
  }

  // ===== BUSINESS REGISTRY MANAGEMENT =====

  /**
   * Register a new business
   */
  async registerBusiness(
    campaignId: number,
    businessData: Omit<BusinessRegistration, 'id' | 'registrationDate' | 'createdAt' | 'updatedAt'>
  ): Promise<BusinessRegistration> {
    const id = nanoid();
    const now = new Date();

    const result = await this.pool.query(`
      INSERT INTO business_registry (
        id, campaign_id, business_name, business_type, industry_sector,
        license_status, compliance_score, annual_revenue, employee_count,
        regulatory_flags, contact_info, business_address, tax_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      id, campaignId, businessData.businessName, businessData.businessType,
      businessData.industrySector, businessData.licenseStatus, businessData.complianceScore,
      businessData.annualRevenue, businessData.employeeCount,
      JSON.stringify(businessData.regulatoryFlags), JSON.stringify(businessData.contactInfo),
      businessData.businessAddress, businessData.taxId
    ]);

    return this.mapBusinessRegistration(result.rows[0]);
  }

  /**
   * Get registered businesses
   */
  async getBusinesses(
    campaignId: number,
    filters?: {
      businessType?: string;
      industrySector?: string;
      licenseStatus?: string;
      minComplianceScore?: number;
    }
  ): Promise<BusinessRegistration[]> {
    let query = 'SELECT * FROM business_registry WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (filters?.businessType) {
      query += ` AND business_type = $${paramIndex}`;
      params.push(filters.businessType);
      paramIndex++;
    }

    if (filters?.industrySector) {
      query += ` AND industry_sector = $${paramIndex}`;
      params.push(filters.industrySector);
      paramIndex++;
    }

    if (filters?.licenseStatus) {
      query += ` AND license_status = $${paramIndex}`;
      params.push(filters.licenseStatus);
      paramIndex++;
    }

    if (filters?.minComplianceScore !== undefined) {
      query += ` AND compliance_score >= $${paramIndex}`;
      params.push(filters.minComplianceScore);
      paramIndex++;
    }

    query += ' ORDER BY registration_date DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapBusinessRegistration(row));
  }

  /**
   * Update business license status
   */
  async updateBusinessLicense(
    businessId: string,
    licenseStatus: BusinessRegistration['licenseStatus'],
    reason?: string
  ): Promise<BusinessRegistration> {
    const result = await this.pool.query(`
      UPDATE business_registry 
      SET license_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [licenseStatus, businessId]);

    if (result.rows.length === 0) {
      throw new Error(`Business ${businessId} not found`);
    }

    // Log the license change as a regulatory flag if it's a suspension or revocation
    if (licenseStatus === 'suspended' || licenseStatus === 'revoked') {
      await this.addRegulatoryFlag(businessId, {
        type: 'license_action',
        action: licenseStatus,
        reason: reason || 'Administrative action',
        date: new Date().toISOString()
      });
    }

    return this.mapBusinessRegistration(result.rows[0]);
  }

  /**
   * Add regulatory flag to business
   */
  async addRegulatoryFlag(businessId: string, flag: any): Promise<void> {
    await this.pool.query(`
      UPDATE business_registry 
      SET regulatory_flags = regulatory_flags || $1::jsonb,
          updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify([flag]), businessId]);
  }

  // ===== MARKET INTELLIGENCE =====

  /**
   * Collect market intelligence
   */
  async collectMarketIntelligence(
    campaignId: number,
    intelligenceData: Omit<MarketIntelligence, 'id' | 'collectionDate' | 'createdAt' | 'updatedAt'>
  ): Promise<MarketIntelligence> {
    const id = nanoid();
    const now = new Date();

    const result = await this.pool.query(`
      INSERT INTO market_intelligence (
        id, campaign_id, intelligence_type, target_market, data_points,
        analysis_results, confidence_level, analyst_notes, actionable_insights,
        classification, source_reliability
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, campaignId, intelligenceData.intelligenceType, intelligenceData.targetMarket,
      JSON.stringify(intelligenceData.dataPoints), JSON.stringify(intelligenceData.analysisResults),
      intelligenceData.confidenceLevel, intelligenceData.analystNotes,
      JSON.stringify(intelligenceData.actionableInsights), intelligenceData.classification,
      intelligenceData.sourceReliability
    ]);

    return this.mapMarketIntelligence(result.rows[0]);
  }

  /**
   * Get market intelligence reports
   */
  async getMarketIntelligence(
    campaignId: number,
    filters?: {
      intelligenceType?: string;
      targetMarket?: string;
      minConfidenceLevel?: number;
      classification?: string;
    }
  ): Promise<MarketIntelligence[]> {
    let query = 'SELECT * FROM market_intelligence WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (filters?.intelligenceType) {
      query += ` AND intelligence_type = $${paramIndex}`;
      params.push(filters.intelligenceType);
      paramIndex++;
    }

    if (filters?.targetMarket) {
      query += ` AND target_market = $${paramIndex}`;
      params.push(filters.targetMarket);
      paramIndex++;
    }

    if (filters?.minConfidenceLevel !== undefined) {
      query += ` AND confidence_level >= $${paramIndex}`;
      params.push(filters.minConfidenceLevel);
      paramIndex++;
    }

    if (filters?.classification) {
      query += ` AND classification = $${paramIndex}`;
      params.push(filters.classification);
      paramIndex++;
    }

    query += ' ORDER BY collection_date DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapMarketIntelligence(row));
  }

  /**
   * Analyze current trade data for market intelligence
   */
  async analyzeTradeData(campaignId: number): Promise<MarketIntelligence> {
    // Get current trade data from the trade system
    const [prices, contracts, routes] = await Promise.all([
      TradeStorage.getPrices(),
      TradeStorage.getContracts(campaignId),
      TradeStorage.getRoutes(campaignId)
    ]);

    const analytics = TradeEngine.calculateTradeAnalytics(prices, contracts, routes);

    // Create market intelligence report
    const analysisResults = {
      totalTradeVolume: analytics.totalTradeVolume,
      averagePrices: analytics.averagePrices,
      priceIndices: analytics.priceIndices,
      tradeBalance: analytics.tradeBalance,
      topTradingPartners: analytics.topTradingPartners,
      marketTrends: this.identifyMarketTrends(prices),
      tradingOpportunities: this.identifyTradingOpportunities(prices, contracts)
    };

    const actionableInsights = this.generateActionableInsights(analysisResults);

    return await this.collectMarketIntelligence(campaignId, {
      intelligenceType: 'trade_flow_analysis',
      targetMarket: 'domestic',
      dataPoints: { prices, contractCount: contracts.length, routeCount: routes.length },
      analysisResults,
      confidenceLevel: 0.85,
      analystNotes: 'Automated analysis of current trade data',
      actionableInsights,
      classification: 'internal',
      sourceReliability: 'high'
    });
  }

  // ===== ECONOMIC DEVELOPMENT PROJECTS =====

  /**
   * Create economic development project
   */
  async createEconomicDevelopmentProject(
    campaignId: number,
    projectData: Omit<EconomicDevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EconomicDevelopmentProject> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO economic_development_projects (
        id, campaign_id, project_name, project_type, target_sector,
        budget_allocated, budget_spent, expected_outcomes, actual_outcomes,
        status, start_date, target_completion, actual_completion,
        project_manager, stakeholders, risk_assessment, success_metrics
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      id, campaignId, projectData.projectName, projectData.projectType,
      projectData.targetSector, projectData.budgetAllocated, projectData.budgetSpent,
      JSON.stringify(projectData.expectedOutcomes), JSON.stringify(projectData.actualOutcomes),
      projectData.status, projectData.startDate, projectData.targetCompletion,
      projectData.actualCompletion, projectData.projectManager,
      JSON.stringify(projectData.stakeholders), JSON.stringify(projectData.riskAssessment),
      JSON.stringify(projectData.successMetrics)
    ]);

    return this.mapEconomicDevelopmentProject(result.rows[0]);
  }

  /**
   * Get economic development projects
   */
  async getEconomicDevelopmentProjects(
    campaignId: number,
    filters?: {
      projectType?: string;
      status?: string;
      targetSector?: string;
    }
  ): Promise<EconomicDevelopmentProject[]> {
    let query = 'SELECT * FROM economic_development_projects WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (filters?.projectType) {
      query += ` AND project_type = $${paramIndex}`;
      params.push(filters.projectType);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.targetSector) {
      query += ` AND target_sector = $${paramIndex}`;
      params.push(filters.targetSector);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapEconomicDevelopmentProject(row));
  }

  // ===== TRADE PACT INTEGRATION =====

  /**
   * Initiate trade pact negotiation
   */
  async initiateTradePactNegotiation(
    campaignId: number,
    pactType: string,
    memberCivilizations: number[],
    leadNegotiator: number
  ): Promise<any> {
    const tradePactsService = getTradePactsService();
    
    // Generate trade pact template
    const pactTemplate = await tradePactsService.generateTradePactTemplate(
      pactType, 
      memberCivilizations, 
      leadNegotiator
    );

    // Create the trade pact
    const pact = await tradePactsService.createTradePact(pactTemplate);

    // Start negotiation process
    const negotiation = await tradePactsService.startNegotiation(pact.id, memberCivilizations);

    // Create a commerce operation to track this
    const operation = await this.createOperation(campaignId, {
      operationType: 'trade_agreement',
      title: `Trade Pact Negotiation: ${pact.pact_name}`,
      description: `Negotiating ${pactType} agreement with ${memberCivilizations.length} civilizations`,
      status: 'active',
      parameters: {
        pact_id: pact.id,
        negotiation_id: negotiation.id,
        pact_type: pactType,
        member_civilizations: memberCivilizations
      },
      results: {},
      priority: 'high'
    });

    return {
      pact,
      negotiation,
      commerce_operation: operation
    };
  }

  /**
   * Monitor trade pact compliance for civilization
   */
  async monitorTradePactCompliance(campaignId: number, civilizationId: number): Promise<any> {
    const tradePactsService = getTradePactsService();
    
    // Get active trade pacts for this civilization
    const activePacts = await tradePactsService.getTradePacts(civilizationId, 'active');
    
    const complianceReports = [];
    
    for (const pact of activePacts) {
      // Get compliance report for this pact
      const compliance = await tradePactsService.getComplianceReport(pact.id);
      
      // Calculate overall compliance for this civilization
      const civCompliance = compliance.filter(c => c.civilization_id === civilizationId);
      
      if (civCompliance.length > 0) {
        const latestCompliance = civCompliance[0];
        complianceReports.push({
          pact_name: pact.pact_name,
          pact_type: pact.pact_type,
          overall_score: latestCompliance.overall_compliance_score,
          tariff_compliance: latestCompliance.tariff_compliance,
          market_access_compliance: latestCompliance.market_access_compliance,
          violations: latestCompliance.violations || []
        });
      }
    }

    // Create market intelligence report
    const intelligenceData = {
      intelligenceType: 'trade_flow_analysis' as const,
      targetMarket: 'international',
      dataPoints: {
        active_pacts: activePacts.length,
        compliance_reports: complianceReports.length
      },
      analysisResults: {
        compliance_summary: complianceReports,
        average_compliance: complianceReports.reduce((sum, report) => sum + report.overall_score, 0) / complianceReports.length || 0,
        high_risk_pacts: complianceReports.filter(r => r.overall_score < 7.0),
        violations_count: complianceReports.reduce((sum, report) => sum + report.violations.length, 0)
      },
      confidenceLevel: 0.9,
      analystNotes: 'Automated trade pact compliance monitoring',
      actionableInsights: this.generateComplianceInsights(complianceReports),
      classification: 'internal' as const,
      sourceReliability: 'high' as const
    };

    return await this.collectMarketIntelligence(campaignId, intelligenceData);
  }

  /**
   * Analyze trade pact economic impact
   */
  async analyzeTradePactImpact(
    campaignId: number, 
    civilizationId: number, 
    pactId?: number
  ): Promise<MarketIntelligence> {
    const tradePactsService = getTradePactsService();
    
    let impactAnalysis;
    let pacts;

    if (pactId) {
      // Analyze specific pact
      impactAnalysis = await tradePactsService.calculateTradePactImpact(pactId, civilizationId);
      pacts = [await tradePactsService.getTradePactDetails(pactId)];
    } else {
      // Analyze all active pacts
      pacts = await tradePactsService.getTradePacts(civilizationId, 'active');
      
      // Calculate cumulative impact
      const impacts = await Promise.all(
        pacts.map(pact => tradePactsService.calculateTradePactImpact(pact.id, civilizationId))
      );

      impactAnalysis = {
        trade_impact: impacts.reduce((sum, impact) => sum + impact.trade_impact, 0),
        gdp_impact: impacts.reduce((sum, impact) => sum + impact.gdp_impact, 0),
        employment_impact: impacts.reduce((sum, impact) => sum + impact.employment_impact, 0),
        sector_impacts: this.consolidateSectorImpacts(impacts.map(i => i.sector_impacts).flat())
      };
    }

    // Create comprehensive analysis
    const analysisResults = {
      economic_impact: impactAnalysis,
      pact_summary: pacts.map(pact => ({
        name: pact.pact_name,
        type: pact.pact_type,
        status: pact.status,
        member_count: pact.member_civilizations.length
      })),
      recommendations: this.generateTradePactRecommendations(impactAnalysis, pacts)
    };

    return await this.collectMarketIntelligence(campaignId, {
      intelligenceType: 'trade_flow_analysis',
      targetMarket: 'international',
      dataPoints: {
        analyzed_pacts: pacts.length,
        total_trade_impact: impactAnalysis.trade_impact,
        total_gdp_impact: impactAnalysis.gdp_impact
      },
      analysisResults,
      confidenceLevel: 0.85,
      analystNotes: `Economic impact analysis of ${pacts.length} trade pact(s)`,
      actionableInsights: this.generateEconomicInsights(impactAnalysis),
      classification: 'internal',
      sourceReliability: 'high'
    });
  }

  /**
   * Get trade pact dashboard for Commerce Secretary
   */
  async getTradePactDashboard(campaignId: number, civilizationId: number): Promise<{
    active_pacts: number;
    negotiating_pacts: number;
    compliance_average: number;
    economic_benefits: {
      trade_increase: number;
      gdp_impact: number;
      employment_impact: number;
    };
    recent_disputes: number;
    upcoming_deadlines: any[];
  }> {
    const tradePactsService = getTradePactsService();
    
    // Get analytics from trade pacts service
    const analytics = await tradePactsService.getTradePactAnalytics(civilizationId);
    
    // Get negotiating pacts
    const negotiatingPacts = await tradePactsService.getTradePacts(civilizationId, 'negotiating');
    
    // Get recent disputes
    const recentDisputes = await tradePactsService.getDisputes(undefined, civilizationId, undefined);
    const activeDisputes = recentDisputes.filter(d => 
      ['filed', 'under_review', 'mediation', 'arbitration'].includes(d.dispute_status)
    );

    return {
      active_pacts: analytics.active_pacts,
      negotiating_pacts: negotiatingPacts.length,
      compliance_average: analytics.compliance_average,
      economic_benefits: {
        trade_increase: analytics.total_trade_increase,
        gdp_impact: analytics.gdp_impact,
        employment_impact: 0 // Would be calculated from pact impacts
      },
      recent_disputes: activeDisputes.length,
      upcoming_deadlines: [] // Would be extracted from negotiation deadlines
    };
  }

  // ===== COMMERCE OPERATIONS =====

  /**
   * Create a commerce operation
   */
  async createOperation(
    campaignId: number,
    operationData: Omit<CommerceOperation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CommerceOperation> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO commerce_operations (
        id, campaign_id, operation_type, title, description, status,
        parameters, results, priority, assigned_to
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      id, campaignId, operationData.operationType, operationData.title,
      operationData.description, operationData.status,
      JSON.stringify(operationData.parameters), JSON.stringify(operationData.results),
      operationData.priority, operationData.assignedTo
    ]);

    return this.mapCommerceOperation(result.rows[0]);
  }

  /**
   * Get commerce operations
   */
  async getOperations(
    campaignId: number,
    filters?: {
      operationType?: string;
      status?: string;
      priority?: string;
    }
  ): Promise<CommerceOperation[]> {
    let query = 'SELECT * FROM commerce_operations WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (filters?.operationType) {
      query += ` AND operation_type = $${paramIndex}`;
      params.push(filters.operationType);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapCommerceOperation(row));
  }

  /**
   * Get Commerce Department analytics
   */
  async getDepartmentAnalytics(campaignId: number): Promise<{
    totalOperations: number;
    activeOperations: number;
    completedOperations: number;
    totalBusinesses: number;
    activeBusinesses: number;
    totalTradePolicies: number;
    activeTradePolicies: number;
    totalIntelligenceReports: number;
    totalDevelopmentProjects: number;
    activeDevelopmentProjects: number;
    budgetUtilization: number;
  }> {
    const [operations, businesses, policies, intelligence, projects] = await Promise.all([
      this.pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'active\') as active, COUNT(*) FILTER (WHERE status = \'completed\') as completed FROM commerce_operations WHERE campaign_id = $1', [campaignId]),
      this.pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE license_status = \'active\') as active FROM business_registry WHERE campaign_id = $1', [campaignId]),
      this.pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'active\') as active FROM trade_policies WHERE campaign_id = $1', [campaignId]),
      this.pool.query('SELECT COUNT(*) as total FROM market_intelligence WHERE campaign_id = $1', [campaignId]),
      this.pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status IN (\'active\', \'approved\')) as active FROM economic_development_projects WHERE campaign_id = $1', [campaignId])
    ]);

    return {
      totalOperations: parseInt(operations.rows[0].total),
      activeOperations: parseInt(operations.rows[0].active),
      completedOperations: parseInt(operations.rows[0].completed),
      totalBusinesses: parseInt(businesses.rows[0].total),
      activeBusinesses: parseInt(businesses.rows[0].active),
      totalTradePolicies: parseInt(policies.rows[0].total),
      activeTradePolicies: parseInt(policies.rows[0].active),
      totalIntelligenceReports: parseInt(intelligence.rows[0].total),
      totalDevelopmentProjects: parseInt(projects.rows[0].total),
      activeDevelopmentProjects: parseInt(projects.rows[0].active),
      budgetUtilization: 0.75 // Placeholder - would be calculated from actual budget data
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private mapCommerceOperation(row: any): CommerceOperation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      operationType: row.operation_type,
      title: row.title,
      description: row.description,
      status: row.status,
      parameters: row.parameters,
      results: row.results,
      priority: row.priority,
      assignedTo: row.assigned_to,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined
    };
  }

  private mapTradePolicy(row: any): TradePolicy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      policyType: row.policy_type,
      targetResource: row.target_resource,
      targetPartner: row.target_partner,
      targetRoute: row.target_route,
      policyValue: row.policy_value,
      effectiveDate: new Date(row.effective_date),
      expirationDate: row.expiration_date ? new Date(row.expiration_date) : undefined,
      justification: row.justification,
      economicImpact: row.economic_impact,
      status: row.status,
      createdBy: row.created_by,
      approvedBy: row.approved_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapBusinessRegistration(row: any): BusinessRegistration {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      businessName: row.business_name,
      businessType: row.business_type,
      industrySector: row.industry_sector,
      registrationDate: new Date(row.registration_date),
      licenseStatus: row.license_status,
      complianceScore: row.compliance_score,
      annualRevenue: row.annual_revenue,
      employeeCount: row.employee_count,
      regulatoryFlags: row.regulatory_flags,
      contactInfo: row.contact_info,
      businessAddress: row.business_address,
      taxId: row.tax_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapMarketIntelligence(row: any): MarketIntelligence {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      intelligenceType: row.intelligence_type,
      targetMarket: row.target_market,
      dataPoints: row.data_points,
      analysisResults: row.analysis_results,
      confidenceLevel: row.confidence_level,
      collectionDate: new Date(row.collection_date),
      analystNotes: row.analyst_notes,
      actionableInsights: row.actionable_insights,
      classification: row.classification,
      sourceReliability: row.source_reliability,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapEconomicDevelopmentProject(row: any): EconomicDevelopmentProject {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      projectName: row.project_name,
      projectType: row.project_type,
      targetSector: row.target_sector,
      budgetAllocated: row.budget_allocated,
      budgetSpent: row.budget_spent,
      expectedOutcomes: row.expected_outcomes,
      actualOutcomes: row.actual_outcomes,
      status: row.status,
      startDate: new Date(row.start_date),
      targetCompletion: new Date(row.target_completion),
      actualCompletion: row.actual_completion ? new Date(row.actual_completion) : undefined,
      projectManager: row.project_manager,
      stakeholders: row.stakeholders,
      riskAssessment: row.risk_assessment,
      successMetrics: row.success_metrics,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private identifyMarketTrends(prices: Record<string, any>): any[] {
    const trends = [];
    
    for (const [resourceId, priceData] of Object.entries(prices)) {
      if (priceData.trend === 'rising' && priceData.priceHistory.length > 1) {
        const recentGrowth = priceData.priceHistory.slice(-3);
        const avgGrowth = recentGrowth.reduce((sum: number, point: any, index: number) => {
          if (index === 0) return 0;
          return sum + ((point.price - recentGrowth[index - 1].price) / recentGrowth[index - 1].price);
        }, 0) / (recentGrowth.length - 1);

        if (avgGrowth > 0.1) {
          trends.push({
            type: 'price_surge',
            resource: resourceId,
            growth_rate: avgGrowth,
            confidence: 0.8
          });
        }
      }
    }

    return trends;
  }

  private identifyTradingOpportunities(prices: Record<string, any>, contracts: any[]): any[] {
    const opportunities = [];
    
    // Look for resources with high demand but low supply
    for (const [resourceId, priceData] of Object.entries(prices)) {
      if (priceData.demand > priceData.supply * 1.5) {
        opportunities.push({
          type: 'supply_shortage',
          resource: resourceId,
          demand_supply_ratio: priceData.demand / priceData.supply,
          recommended_action: 'increase_imports'
        });
      }
    }

    return opportunities;
  }

  private generateActionableInsights(analysisResults: any): any[] {
    const insights = [];

    // Trade balance insights
    if (analysisResults.tradeBalance < -1000000) {
      insights.push({
        type: 'trade_deficit',
        severity: 'high',
        recommendation: 'Consider implementing export promotion policies or import restrictions',
        impact: 'economic_stability'
      });
    }

    // Price volatility insights
    if (analysisResults.priceIndices.overallIndex > 1.2) {
      insights.push({
        type: 'price_inflation',
        severity: 'medium',
        recommendation: 'Monitor supply chains and consider price stabilization measures',
        impact: 'consumer_prices'
      });
    }

    return insights;
  }

  private generateComplianceInsights(complianceReports: any[]): any[] {
    const insights = [];

    // Overall compliance analysis
    const avgCompliance = complianceReports.reduce((sum, report) => sum + report.overall_score, 0) / complianceReports.length || 0;
    
    if (avgCompliance < 7.0) {
      insights.push({
        type: 'compliance_risk',
        severity: 'high',
        recommendation: 'Immediate attention required for trade pact compliance. Review obligations and implement corrective measures.',
        impact: 'international_relations'
      });
    }

    // Specific compliance issues
    const lowTariffCompliance = complianceReports.filter(r => r.tariff_compliance < 8.0);
    if (lowTariffCompliance.length > 0) {
      insights.push({
        type: 'tariff_compliance',
        severity: 'medium',
        recommendation: 'Review tariff implementation schedules and ensure proper customs procedures.',
        impact: 'trade_relations'
      });
    }

    // Violations analysis
    const totalViolations = complianceReports.reduce((sum, report) => sum + report.violations.length, 0);
    if (totalViolations > 0) {
      insights.push({
        type: 'trade_violations',
        severity: 'high',
        recommendation: `Address ${totalViolations} trade pact violations to avoid disputes and penalties.`,
        impact: 'legal_compliance'
      });
    }

    return insights;
  }

  private consolidateSectorImpacts(sectorImpacts: any[]): any[] {
    const consolidated = new Map();
    
    sectorImpacts.forEach(impact => {
      if (consolidated.has(impact.sector)) {
        consolidated.get(impact.sector).impact += impact.impact;
      } else {
        consolidated.set(impact.sector, { ...impact });
      }
    });

    return Array.from(consolidated.values());
  }

  private generateTradePactRecommendations(impactAnalysis: any, pacts: any[]): any[] {
    const recommendations = [];

    // Trade impact recommendations
    if (impactAnalysis.trade_impact > 0.2) {
      recommendations.push({
        type: 'trade_expansion',
        priority: 'high',
        action: 'Leverage high trade impact by promoting exports in benefiting sectors',
        expected_benefit: 'Increased export revenue and market share'
      });
    }

    // GDP impact recommendations
    if (impactAnalysis.gdp_impact > 0.1) {
      recommendations.push({
        type: 'economic_growth',
        priority: 'medium',
        action: 'Invest in infrastructure and education to maximize GDP benefits',
        expected_benefit: 'Sustained economic growth and competitiveness'
      });
    }

    // Sector-specific recommendations
    const highImpactSectors = impactAnalysis.sector_impacts.filter((s: any) => s.impact > 0.15);
    if (highImpactSectors.length > 0) {
      recommendations.push({
        type: 'sector_development',
        priority: 'medium',
        action: `Focus development efforts on high-impact sectors: ${highImpactSectors.map((s: any) => s.sector).join(', ')}`,
        expected_benefit: 'Maximized economic benefits from trade agreements'
      });
    }

    return recommendations;
  }

  private generateEconomicInsights(impactAnalysis: any): any[] {
    const insights = [];

    // Positive trade impact
    if (impactAnalysis.trade_impact > 0.15) {
      insights.push({
        type: 'trade_opportunity',
        severity: 'low',
        recommendation: 'Capitalize on positive trade impact by expanding market presence',
        impact: 'economic_growth'
      });
    }

    // Employment impact
    if (impactAnalysis.employment_impact > 10000) {
      insights.push({
        type: 'employment_boost',
        severity: 'low',
        recommendation: 'Prepare workforce development programs to support job growth',
        impact: 'social_welfare'
      });
    }

    // Negative impacts
    if (impactAnalysis.trade_impact < -0.05) {
      insights.push({
        type: 'trade_disruption',
        severity: 'medium',
        recommendation: 'Implement support measures for affected industries',
        impact: 'economic_stability'
      });
    }

    return insights;
  }
}
