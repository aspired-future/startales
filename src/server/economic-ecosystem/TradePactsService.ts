import { Pool } from 'pg';
import { 
  TradePact, 
  TradePactNegotiation, 
  TradePactTerms, 
  EconomicBenefits, 
  TradePactObligations,
  DisputeResolution,
  NegotiationIssue,
  NegotiatorPosition
} from './economicEcosystemSchema';

export class TradePactsService {
  constructor(private pool: Pool) {}

  // Trade Pact Management
  async getTradePacts(
    civilizationId?: number, 
    status?: string, 
    pactType?: string
  ): Promise<TradePact[]> {
    let query = 'SELECT * FROM trade_pacts WHERE 1=1';
    const params = [];

    if (civilizationId) {
      query += ` AND (lead_negotiator_civilization = $${params.length + 1} OR member_civilizations @> $${params.length + 2})`;
      params.push(civilizationId, JSON.stringify([civilizationId]));
    }

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (pactType) {
      query += ` AND pact_type = $${params.length + 1}`;
      params.push(pactType);
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getTradePactDetails(pactId: number): Promise<TradePact | null> {
    const query = 'SELECT * FROM trade_pacts WHERE id = $1';
    const result = await this.pool.query(query, [pactId]);
    return result.rows[0] || null;
  }

  async createTradePact(pactData: Omit<TradePact, 'id' | 'created_at'>): Promise<TradePact> {
    const query = `
      INSERT INTO trade_pacts (
        pact_name, pact_type, member_civilizations, lead_negotiator_civilization,
        status, negotiation_start_date, ratification_date, effective_date, expiry_date,
        terms_and_conditions, economic_benefits, obligations, dispute_resolution
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      pactData.pact_name,
      pactData.pact_type,
      JSON.stringify(pactData.member_civilizations),
      pactData.lead_negotiator_civilization,
      pactData.status,
      pactData.negotiation_start_date,
      pactData.ratification_date,
      pactData.effective_date,
      pactData.expiry_date,
      JSON.stringify(pactData.terms_and_conditions),
      JSON.stringify(pactData.economic_benefits),
      JSON.stringify(pactData.obligations),
      JSON.stringify(pactData.dispute_resolution)
    ]);

    return result.rows[0];
  }

  async updateTradePactStatus(
    pactId: number, 
    status: string, 
    ratificationDate?: Date, 
    effectiveDate?: Date
  ): Promise<void> {
    const query = `
      UPDATE trade_pacts 
      SET status = $1, ratification_date = $2, effective_date = $3
      WHERE id = $4
    `;

    await this.pool.query(query, [status, ratificationDate, effectiveDate, pactId]);
  }

  // Trade Pact Generation and Templates
  async generateTradePactTemplate(
    pactType: string, 
    memberCivilizations: number[], 
    leadNegotiator: number
  ): Promise<Omit<TradePact, 'id' | 'created_at'>> {
    const pactName = this.generatePactName(pactType, memberCivilizations);
    const termsAndConditions = this.generatePactTerms(pactType, memberCivilizations);
    const economicBenefits = this.calculateEconomicBenefits(pactType, memberCivilizations);
    const obligations = this.generatePactObligations(pactType, memberCivilizations);
    const disputeResolution = this.generateDisputeResolution(pactType);

    return {
      pact_name: pactName,
      pact_type: pactType as any,
      member_civilizations: memberCivilizations,
      lead_negotiator_civilization: leadNegotiator,
      status: 'negotiating',
      negotiation_start_date: new Date(),
      terms_and_conditions: termsAndConditions,
      economic_benefits: economicBenefits,
      obligations: obligations,
      dispute_resolution: disputeResolution
    };
  }

  private generatePactName(pactType: string, memberCivilizations: number[]): string {
    const civilizationNames = {
      1: 'Terran Republic',
      2: 'Alpha Centauri',
      3: 'Vega Prime',
      4: 'Sirius Federation',
      5: 'Proxima Alliance'
    };

    const typeNames = {
      free_trade: 'Free Trade Agreement',
      customs_union: 'Customs Union',
      economic_partnership: 'Economic Partnership Agreement',
      strategic_alliance: 'Strategic Alliance',
      bilateral_investment: 'Bilateral Investment Treaty',
      technology_sharing: 'Technology Sharing Agreement'
    };

    if (memberCivilizations.length === 2) {
      const civ1 = civilizationNames[memberCivilizations[0] as keyof typeof civilizationNames];
      const civ2 = civilizationNames[memberCivilizations[1] as keyof typeof civilizationNames];
      return `${civ1}-${civ2} ${typeNames[pactType as keyof typeof typeNames]}`;
    } else {
      const year = new Date().getFullYear();
      return `${typeNames[pactType as keyof typeof typeNames]} ${year}`;
    }
  }

  private generatePactTerms(pactType: string, memberCivilizations: number[]): TradePactTerms {
    const baseTerms: TradePactTerms = {
      tariff_reductions: [],
      market_access_provisions: [],
      investment_protections: [],
      intellectual_property_rules: [],
      labor_mobility: [],
      environmental_standards: [],
      dispute_mechanisms: ['arbitration', 'mediation']
    };

    switch (pactType) {
      case 'free_trade':
        baseTerms.tariff_reductions = [
          {
            product_category: 'Consumer Electronics',
            current_tariff: 0.15,
            target_tariff: 0.0,
            reduction_timeline: 60,
            exceptions: ['Military Electronics']
          },
          {
            product_category: 'Software',
            current_tariff: 0.08,
            target_tariff: 0.0,
            reduction_timeline: 36,
            exceptions: ['Defense Software']
          }
        ];
        baseTerms.market_access_provisions = [
          {
            sector: 'Financial Services',
            access_level: 'full',
            quotas: 0,
            licensing_requirements: ['Standard Banking License'],
            local_content_requirements: 0
          }
        ];
        break;

      case 'customs_union':
        baseTerms.tariff_reductions = [
          {
            product_category: 'All Products',
            current_tariff: 0.12,
            target_tariff: 0.0,
            reduction_timeline: 48,
            exceptions: ['Strategic Materials', 'Defense Equipment']
          }
        ];
        break;

      case 'technology_sharing':
        baseTerms.intellectual_property_rules = [
          {
            ip_type: 'patents',
            protection_level: 'enhanced',
            enforcement_mechanisms: ['Joint Patent Office', 'Technology Transfer Board'],
            technology_transfer_rules: ['Reciprocal Licensing', 'Joint Research Programs']
          }
        ];
        break;
    }

    return baseTerms;
  }

  private calculateEconomicBenefits(pactType: string, memberCivilizations: number[]): EconomicBenefits {
    const baseMultipliers = {
      free_trade: { trade: 0.25, gdp: 0.08, investment: 0.15 },
      customs_union: { trade: 0.35, gdp: 0.12, investment: 0.20 },
      economic_partnership: { trade: 0.30, gdp: 0.10, investment: 0.18 },
      strategic_alliance: { trade: 0.20, gdp: 0.06, investment: 0.25 },
      bilateral_investment: { trade: 0.15, gdp: 0.05, investment: 0.35 },
      technology_sharing: { trade: 0.18, gdp: 0.15, investment: 0.30 }
    };

    const multipliers = baseMultipliers[pactType as keyof typeof baseMultipliers] || baseMultipliers.free_trade;
    const memberCount = memberCivilizations.length;
    const networkEffect = Math.log(memberCount) / Math.log(2); // Logarithmic network effect

    return {
      estimated_trade_increase: multipliers.trade * networkEffect,
      gdp_impact: multipliers.gdp * networkEffect,
      employment_impact: Math.floor(50000 * multipliers.gdp * networkEffect),
      investment_flows: multipliers.investment * networkEffect,
      cost_savings: 0.05 * multipliers.trade,
      market_expansion: [
        {
          sector: 'Technology',
          market_size_increase: multipliers.trade * 1.2,
          new_opportunities: ['Cross-border R&D', 'Joint Ventures'],
          competitive_advantages: ['Larger Market Access', 'Economies of Scale']
        },
        {
          sector: 'Manufacturing',
          market_size_increase: multipliers.trade * 0.8,
          new_opportunities: ['Supply Chain Integration', 'Production Sharing'],
          competitive_advantages: ['Cost Reduction', 'Specialization']
        }
      ]
    };
  }

  private generatePactObligations(pactType: string, memberCivilizations: number[]): TradePactObligations {
    return {
      regulatory_harmonization: [
        {
          regulation_area: 'Trade Standards',
          harmonization_level: 'partial',
          implementation_timeline: 24,
          compliance_cost: 50000000
        }
      ],
      compliance_requirements: [
        {
          requirement_type: 'Tariff Implementation',
          compliance_deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          monitoring_frequency: 'quarterly',
          penalties_for_non_compliance: ['Trade Suspension', 'Financial Penalties']
        }
      ],
      reporting_obligations: [
        {
          report_type: 'Trade Statistics',
          reporting_frequency: 'quarterly',
          data_requirements: ['Import/Export Values', 'Tariff Collections', 'Trade Volumes'],
          submission_deadline: '30 days after quarter end'
        }
      ],
      financial_contributions: [
        {
          contribution_type: 'administrative_costs',
          amount: 1000000,
          payment_frequency: 'annual',
          calculation_method: 'Equal share among members'
        }
      ],
      policy_constraints: [
        {
          policy_area: 'Trade Policy',
          constraint_type: 'notification_requirement',
          description: 'Must notify other members 90 days before implementing new trade measures',
          exceptions: ['Emergency Measures', 'National Security']
        }
      ]
    };
  }

  private generateDisputeResolution(pactType: string): DisputeResolution {
    return {
      mechanism_type: 'arbitration',
      governing_body: 'Trade Pact Arbitration Panel',
      resolution_timeline: 180,
      appeal_process: true,
      enforcement_mechanisms: ['Trade Sanctions', 'Compensation Requirements', 'Compliance Monitoring']
    };
  }

  // Negotiation Management
  async startNegotiation(
    pactId: number, 
    participatingCivilizations: number[]
  ): Promise<TradePactNegotiation> {
    const query = `
      INSERT INTO trade_pact_negotiations (
        pact_id, negotiation_round, participating_civilizations,
        negotiation_status, current_issues, proposed_terms, negotiator_positions, deadlines
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const initialIssues = this.generateInitialNegotiationIssues();
    const negotiatorPositions = this.generateNegotiatorPositions(participatingCivilizations);
    const deadlines = this.generateNegotiationDeadlines();

    const result = await this.pool.query(query, [
      pactId,
      1,
      JSON.stringify(participatingCivilizations),
      'active',
      JSON.stringify(initialIssues),
      JSON.stringify({}),
      JSON.stringify(negotiatorPositions),
      JSON.stringify(deadlines)
    ]);

    return result.rows[0];
  }

  private generateInitialNegotiationIssues(): NegotiationIssue[] {
    return [
      {
        issue_type: 'Tariff Reduction Timeline',
        description: 'Disagreement on the timeline for tariff reductions',
        priority: 'high',
        status: 'unresolved',
        positions: {}
      },
      {
        issue_type: 'Market Access Provisions',
        description: 'Scope of market access for financial services',
        priority: 'medium',
        status: 'under_discussion',
        positions: {}
      },
      {
        issue_type: 'Dispute Resolution Mechanism',
        description: 'Choice between arbitration and judicial resolution',
        priority: 'medium',
        status: 'unresolved',
        positions: {}
      }
    ];
  }

  private generateNegotiatorPositions(civilizations: number[]): NegotiatorPosition[] {
    const negotiatorNames = [
      'Ambassador Sarah Chen', 'Trade Minister Marcus Rodriguez', 'Economic Advisor Elena Vasquez',
      'Commerce Secretary David Kim', 'Deputy Minister Lisa Thompson'
    ];

    const negotiationStyles = ['cooperative', 'competitive', 'accommodating', 'compromising'] as const;

    return civilizations.map((civId, index) => ({
      civilization_id: civId,
      negotiator_name: negotiatorNames[index % negotiatorNames.length],
      position_title: 'Chief Trade Negotiator',
      negotiation_style: negotiationStyles[index % negotiationStyles.length],
      key_priorities: ['Market Access', 'Tariff Reduction', 'Investment Protection'],
      red_lines: ['National Security Exemptions', 'Strategic Industry Protection']
    }));
  }

  private generateNegotiationDeadlines(): any[] {
    const now = new Date();
    return [
      {
        milestone: 'Initial Terms Agreement',
        deadline_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'upcoming',
        consequences: ['Negotiation Extension', 'Stakeholder Review']
      },
      {
        milestone: 'Final Agreement',
        deadline_date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
        status: 'upcoming',
        consequences: ['Ratification Process', 'Implementation Planning']
      }
    ];
  }

  // Economic Impact Analysis
  async calculateTradePactImpact(
    pactId: number, 
    civilizationId: number
  ): Promise<{
    trade_impact: number;
    gdp_impact: number;
    employment_impact: number;
    sector_impacts: { sector: string; impact: number }[];
  }> {
    const pact = await this.getTradePactDetails(pactId);
    if (!pact) {
      throw new Error(`Trade pact ${pactId} not found`);
    }

    const benefits = pact.economic_benefits as EconomicBenefits;
    const isMember = pact.member_civilizations.includes(civilizationId);

    if (!isMember) {
      return {
        trade_impact: 0,
        gdp_impact: 0,
        employment_impact: 0,
        sector_impacts: []
      };
    }

    // Calculate civilization-specific impacts
    const tradeImpact = benefits.estimated_trade_increase * 0.8; // 80% of estimated benefit
    const gdpImpact = benefits.gdp_impact * 0.9; // 90% of estimated benefit
    const employmentImpact = benefits.employment_impact * 0.85; // 85% of estimated benefit

    const sectorImpacts = benefits.market_expansion.map(expansion => ({
      sector: expansion.sector,
      impact: expansion.market_size_increase * 0.75
    }));

    return {
      trade_impact: tradeImpact,
      gdp_impact: gdpImpact,
      employment_impact: employmentImpact,
      sector_impacts: sectorImpacts
    };
  }

  // Compliance Monitoring
  async recordCompliance(
    pactId: number,
    civilizationId: number,
    complianceData: {
      overall_score: number;
      tariff_compliance: number;
      market_access_compliance: number;
      regulatory_compliance: number;
      reporting_compliance: number;
      violations?: any[];
    }
  ): Promise<void> {
    const query = `
      INSERT INTO trade_pact_compliance (
        pact_id, civilization_id, compliance_period,
        overall_compliance_score, tariff_compliance, market_access_compliance,
        regulatory_compliance, reporting_compliance, violations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (pact_id, civilization_id, compliance_period)
      DO UPDATE SET
        overall_compliance_score = EXCLUDED.overall_compliance_score,
        tariff_compliance = EXCLUDED.tariff_compliance,
        market_access_compliance = EXCLUDED.market_access_compliance,
        regulatory_compliance = EXCLUDED.regulatory_compliance,
        reporting_compliance = EXCLUDED.reporting_compliance,
        violations = EXCLUDED.violations
    `;

    const currentPeriod = new Date();
    currentPeriod.setDate(1); // First day of current month

    await this.pool.query(query, [
      pactId,
      civilizationId,
      currentPeriod,
      complianceData.overall_score,
      complianceData.tariff_compliance,
      complianceData.market_access_compliance,
      complianceData.regulatory_compliance,
      complianceData.reporting_compliance,
      JSON.stringify(complianceData.violations || [])
    ]);
  }

  async getComplianceReport(pactId: number, period?: Date): Promise<any[]> {
    let query = 'SELECT * FROM trade_pact_compliance WHERE pact_id = $1';
    const params = [pactId];

    if (period) {
      query += ' AND compliance_period = $2';
      params.push(period);
    }

    query += ' ORDER BY compliance_period DESC, civilization_id';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Dispute Management
  async fileDispute(disputeData: {
    pact_id: number;
    complainant_civilization: number;
    respondent_civilization: number;
    dispute_type: string;
    dispute_description: string;
    economic_impact?: number;
  }): Promise<any> {
    const query = `
      INSERT INTO trade_pact_disputes (
        pact_id, complainant_civilization, respondent_civilization,
        dispute_type, dispute_description, filing_date, economic_impact
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      disputeData.pact_id,
      disputeData.complainant_civilization,
      disputeData.respondent_civilization,
      disputeData.dispute_type,
      disputeData.dispute_description,
      new Date(),
      disputeData.economic_impact || 0
    ]);

    return result.rows[0];
  }

  async getDisputes(pactId?: number, civilizationId?: number, status?: string): Promise<any[]> {
    let query = 'SELECT * FROM trade_pact_disputes WHERE 1=1';
    const params = [];

    if (pactId) {
      query += ` AND pact_id = $${params.length + 1}`;
      params.push(pactId);
    }

    if (civilizationId) {
      query += ` AND (complainant_civilization = $${params.length + 1} OR respondent_civilization = $${params.length + 2})`;
      params.push(civilizationId, civilizationId);
    }

    if (status) {
      query += ` AND dispute_status = $${params.length + 1}`;
      params.push(status);
    }

    query += ' ORDER BY filing_date DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Analytics and Reporting
  async getTradePactAnalytics(civilizationId: number): Promise<{
    active_pacts: number;
    total_trade_increase: number;
    gdp_impact: number;
    compliance_average: number;
    active_disputes: number;
  }> {
    // Get active pacts
    const activePactsQuery = `
      SELECT COUNT(*) as count 
      FROM trade_pacts 
      WHERE status = 'active' AND member_civilizations @> $1
    `;
    const activePactsResult = await this.pool.query(activePactsQuery, [JSON.stringify([civilizationId])]);

    // Calculate total economic impact
    const pactsQuery = `
      SELECT economic_benefits 
      FROM trade_pacts 
      WHERE status = 'active' AND member_civilizations @> $1
    `;
    const pactsResult = await this.pool.query(pactsQuery, [JSON.stringify([civilizationId])]);

    let totalTradeIncrease = 0;
    let totalGdpImpact = 0;

    pactsResult.rows.forEach(row => {
      const benefits = row.economic_benefits as EconomicBenefits;
      totalTradeIncrease += benefits.estimated_trade_increase;
      totalGdpImpact += benefits.gdp_impact;
    });

    // Get compliance average
    const complianceQuery = `
      SELECT AVG(overall_compliance_score) as avg_compliance
      FROM trade_pact_compliance
      WHERE civilization_id = $1 AND compliance_period >= $2
    `;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const complianceResult = await this.pool.query(complianceQuery, [civilizationId, threeMonthsAgo]);

    // Get active disputes
    const disputesQuery = `
      SELECT COUNT(*) as count
      FROM trade_pact_disputes
      WHERE (complainant_civilization = $1 OR respondent_civilization = $1)
        AND dispute_status IN ('filed', 'under_review', 'mediation', 'arbitration')
    `;
    const disputesResult = await this.pool.query(disputesQuery, [civilizationId]);

    return {
      active_pacts: parseInt(activePactsResult.rows[0].count),
      total_trade_increase: totalTradeIncrease,
      gdp_impact: totalGdpImpact,
      compliance_average: parseFloat(complianceResult.rows[0].avg_compliance) || 0,
      active_disputes: parseInt(disputesResult.rows[0].count)
    };
  }
}

// Service instance
let tradePactsService: TradePactsService | null = null;

export function getTradePactsService(): TradePactsService {
  if (!tradePactsService) {
    throw new Error('TradePactsService not initialized. Call initializeTradePactsService first.');
  }
  return tradePactsService;
}

export function initializeTradePactsService(pool: Pool): void {
  tradePactsService = new TradePactsService(pool);
}
