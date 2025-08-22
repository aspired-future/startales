import { Pool } from 'pg';
import { nanoid } from 'nanoid';

/**
 * Institutional Override Service
 * Handles leader's ability to override decisions from Legislature, Central Bank, and Supreme Court
 */

export interface InstitutionalOverride {
  id: string;
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  targetDecisionId: string;
  targetDecisionTitle: string;
  campaignId: number;
  leaderCharacterId: string;
  originalDecision: string;
  originalReasoning?: string;
  overrideDecision: 'approve' | 'reject' | 'modify' | 'suspend';
  overrideReason: string;
  overrideJustification: string;
  constitutionalBasis: string;
  legalPrecedent?: string;
  modifications?: string;
  implementationNotes?: string;
  
  // Political Consequences
  politicalCost: number;
  publicApprovalImpact: number;
  institutionalTrustImpact: number;
  partyRelationsImpact: Record<string, number>;
  
  // Constitutional & Legal
  constitutionalityScore: number;
  separationOfPowersImpact: number;
  judicialIndependenceImpact?: number;
  monetaryAuthorityImpact?: number;
  
  // Status & Timeline
  effectiveDate: Date;
  expirationDate?: Date;
  status: 'pending' | 'active' | 'challenged' | 'upheld' | 'reversed' | 'expired';
  challengeDetails?: {
    challenger: string;
    challengeReason: string;
    challengeDate: Date;
    resolution?: string;
    resolutionDate?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface OverrideRequest {
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  targetDecisionId: string;
  campaignId: number;
  leaderCharacterId: string;
  overrideDecision: 'approve' | 'reject' | 'modify' | 'suspend';
  overrideReason: string;
  overrideJustification: string;
  constitutionalBasis: string;
  legalPrecedent?: string;
  modifications?: string;
  implementationNotes?: string;
  temporaryDuration?: number; // For temporary suspensions (days)
}

export interface InstitutionalOverrideAnalysis {
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  politicalFeasibility: number; // 0-100
  constitutionalValidity: number; // 0-100
  publicSupportEstimate: number; // 0-100
  institutionalTrustImpact: number; // -100 to 100
  separationOfPowersRisk: number; // 0-100
  politicalCostAssessment: number; // 0-100
  recommendedAction: 'proceed' | 'modify' | 'abandon' | 'delay';
  riskFactors: string[];
  supportingArguments: string[];
  potentialChallenges: string[];
  institutionalSpecificRisks: string[];
  precedentAnalysis: string[];
}

export interface InstitutionalDecision {
  id: string;
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  title: string;
  description: string;
  decisionType: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented' | 'overridden';
  canBeOverridden: boolean;
  urgencyLevel: 'routine' | 'important' | 'urgent' | 'emergency';
  publicSupport: number;
  institutionalReasoning: string;
  createdAt: Date;
}

export class InstitutionalOverrideService {
  constructor(private pool: Pool) {}

  /**
   * Analyze the feasibility and consequences of an institutional override
   */
  async analyzeOverride(
    institutionType: 'legislature' | 'central_bank' | 'supreme_court',
    targetDecisionId: string,
    campaignId: number,
    leaderCharacterId: string,
    overrideType: 'approve' | 'reject' | 'modify' | 'suspend'
  ): Promise<InstitutionalOverrideAnalysis> {
    // Get decision details
    const decision = await this.getInstitutionalDecision(institutionType, targetDecisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    // Get leader's political standing
    const leaderStanding = await this.getLeaderPoliticalStanding(leaderCharacterId, campaignId);
    
    // Get institutional trust levels
    const institutionalTrust = await this.getInstitutionalTrust(campaignId, institutionType);

    // Calculate analysis based on institution type
    const analysis = await this.performInstitutionSpecificAnalysis(
      institutionType, decision, overrideType, leaderStanding, institutionalTrust
    );

    return analysis;
  }

  /**
   * Execute an institutional override
   */
  async executeOverride(request: OverrideRequest): Promise<InstitutionalOverride> {
    // Validate the override request
    await this.validateOverrideRequest(request);

    // Get the original decision
    const decision = await this.getInstitutionalDecision(request.institutionType, request.targetDecisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    // Perform override analysis to calculate impacts
    const analysis = await this.analyzeOverride(
      request.institutionType,
      request.targetDecisionId,
      request.campaignId,
      request.leaderCharacterId,
      request.overrideDecision
    );

    // Calculate specific impacts
    const politicalCost = analysis.politicalCostAssessment;
    const publicApprovalImpact = this.calculatePublicApprovalImpact(
      request.overrideDecision,
      analysis.publicSupportEstimate,
      request.institutionType
    );
    const institutionalTrustImpact = analysis.institutionalTrustImpact;
    const partyRelationsImpact = await this.calculatePartyRelationsImpact(
      request.campaignId, request.institutionType, request.overrideDecision
    );

    // Create the override record
    const override: InstitutionalOverride = {
      id: nanoid(),
      institutionType: request.institutionType,
      targetDecisionId: request.targetDecisionId,
      targetDecisionTitle: decision.title,
      campaignId: request.campaignId,
      leaderCharacterId: request.leaderCharacterId,
      originalDecision: decision.status,
      originalReasoning: decision.institutionalReasoning,
      overrideDecision: request.overrideDecision,
      overrideReason: request.overrideReason,
      overrideJustification: request.overrideJustification,
      constitutionalBasis: request.constitutionalBasis,
      legalPrecedent: request.legalPrecedent,
      modifications: request.modifications,
      implementationNotes: request.implementationNotes,
      
      politicalCost,
      publicApprovalImpact,
      institutionalTrustImpact,
      partyRelationsImpact,
      
      constitutionalityScore: analysis.constitutionalValidity,
      separationOfPowersImpact: analysis.separationOfPowersRisk,
      judicialIndependenceImpact: request.institutionType === 'supreme_court' ? analysis.separationOfPowersRisk * 1.5 : undefined,
      monetaryAuthorityImpact: request.institutionType === 'central_bank' ? analysis.separationOfPowersRisk * 1.2 : undefined,
      
      effectiveDate: new Date(),
      expirationDate: request.temporaryDuration ? new Date(Date.now() + request.temporaryDuration * 24 * 60 * 60 * 1000) : undefined,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store the override in database
    await this.storeOverride(override);

    // Update the original decision status
    await this.updateDecisionStatus(request.institutionType, request.targetDecisionId, 'overridden', override.id);

    // Apply political and institutional consequences
    await this.applyOverrideConsequences(override);

    // Log the override action
    await this.logOverrideAction(override);

    return override;
  }

  /**
   * Get all overrides by leader
   */
  async getOverridesByLeader(
    leaderCharacterId: string,
    campaignId: number,
    institutionType?: 'legislature' | 'central_bank' | 'supreme_court',
    limit: number = 20
  ): Promise<InstitutionalOverride[]> {
    let query = `
      SELECT * FROM institutional_overrides 
      WHERE leader_character_id = $1 AND campaign_id = $2
    `;
    const params = [leaderCharacterId, campaignId];

    if (institutionType) {
      query += ' AND institution_type = $3';
      params.push(institutionType);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows.map(this.mapOverrideFromDb);
  }

  /**
   * Get eligible decisions for override by institution
   */
  async getEligibleDecisions(
    institutionType: 'legislature' | 'central_bank' | 'supreme_court',
    campaignId: number
  ): Promise<InstitutionalDecision[]> {
    // This would query the appropriate institution's decision tables
    switch (institutionType) {
      case 'legislature':
        return this.getEligibleLegislativeDecisions(campaignId);
      case 'central_bank':
        return this.getEligibleCentralBankDecisions(campaignId);
      case 'supreme_court':
        return this.getEligibleSupremeCourtDecisions(campaignId);
      default:
        throw new Error('Invalid institution type');
    }
  }

  /**
   * Challenge an institutional override
   */
  async challengeOverride(
    overrideId: string,
    challenger: string,
    challengeReason: string
  ): Promise<InstitutionalOverride> {
    const override = await this.getOverrideById(overrideId);
    if (!override) {
      throw new Error('Override not found');
    }

    if (override.status !== 'active') {
      throw new Error('Can only challenge active overrides');
    }

    const challengeDetails = {
      challenger,
      challengeReason,
      challengeDate: new Date()
    };

    const query = `
      UPDATE institutional_overrides 
      SET status = 'challenged', challenge_details = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.pool.query(query, [JSON.stringify(challengeDetails), overrideId]);
    return this.mapOverrideFromDb(result.rows[0]);
  }

  /**
   * Get override statistics for a campaign
   */
  async getOverrideStatistics(
    campaignId: number,
    timeframe: string = '30d'
  ): Promise<any> {
    const startDate = this.calculateStartDate(timeframe);

    const query = `
      SELECT 
        institution_type,
        COUNT(*) as total_overrides,
        COUNT(CASE WHEN override_decision = 'approve' THEN 1 END) as approvals,
        COUNT(CASE WHEN override_decision = 'reject' THEN 1 END) as rejections,
        COUNT(CASE WHEN override_decision = 'modify' THEN 1 END) as modifications,
        COUNT(CASE WHEN override_decision = 'suspend' THEN 1 END) as suspensions,
        COUNT(CASE WHEN status = 'challenged' THEN 1 END) as challenged,
        COUNT(CASE WHEN status = 'reversed' THEN 1 END) as reversed,
        AVG(political_cost) as avg_political_cost,
        AVG(public_approval_impact) as avg_approval_impact,
        AVG(institutional_trust_impact) as avg_trust_impact,
        AVG(separation_of_powers_impact) as avg_separation_impact
      FROM institutional_overrides 
      WHERE campaign_id = $1 AND created_at >= $2
      GROUP BY institution_type
    `;

    const result = await this.pool.query(query, [campaignId, startDate]);
    return result.rows;
  }

  // Private helper methods

  private async performInstitutionSpecificAnalysis(
    institutionType: string,
    decision: InstitutionalDecision,
    overrideType: string,
    leaderStanding: any,
    institutionalTrust: any
  ): Promise<InstitutionalOverrideAnalysis> {
    const baseAnalysis = this.calculateBaseAnalysis(decision, overrideType, leaderStanding);
    
    switch (institutionType) {
      case 'legislature':
        return this.analyzeLegislativeOverride(baseAnalysis, decision, overrideType, leaderStanding, institutionalTrust);
      case 'central_bank':
        return this.analyzeCentralBankOverride(baseAnalysis, decision, overrideType, leaderStanding, institutionalTrust);
      case 'supreme_court':
        return this.analyzeSupremeCourtOverride(baseAnalysis, decision, overrideType, leaderStanding, institutionalTrust);
      default:
        throw new Error('Invalid institution type');
    }
  }

  private analyzeLegislativeOverride(
    baseAnalysis: any,
    decision: InstitutionalDecision,
    overrideType: string,
    leaderStanding: any,
    institutionalTrust: any
  ): InstitutionalOverrideAnalysis {
    return {
      institutionType: 'legislature',
      politicalFeasibility: baseAnalysis.feasibility + (leaderStanding.partyControl === 'majority' ? 15 : -10),
      constitutionalValidity: 85, // Legislative overrides are generally constitutional
      publicSupportEstimate: decision.publicSupport + (overrideType === 'approve' ? 10 : -15),
      institutionalTrustImpact: -5, // Moderate impact on legislative trust
      separationOfPowersRisk: 25, // Moderate separation of powers concern
      politicalCostAssessment: baseAnalysis.cost,
      recommendedAction: baseAnalysis.feasibility > 60 ? 'proceed' : 'modify',
      riskFactors: [
        'Opposition party mobilization',
        'Public perception of executive overreach',
        'Future legislative cooperation challenges'
      ],
      supportingArguments: [
        'Executive leadership mandate',
        'National interest priorities',
        'Democratic accountability maintained'
      ],
      potentialChallenges: [
        'Legislative pushback and reduced cooperation',
        'Opposition party campaigns against executive power',
        'Media scrutiny of democratic processes'
      ],
      institutionalSpecificRisks: [
        'Reduced legislative independence perception',
        'Potential for retaliatory legislative actions',
        'Impact on future bipartisan cooperation'
      ],
      precedentAnalysis: [
        'Historical legislative overrides show mixed outcomes',
        'Success depends on public support and party unity',
        'Precedent for executive-legislative balance'
      ]
    };
  }

  private analyzeCentralBankOverride(
    baseAnalysis: any,
    decision: InstitutionalDecision,
    overrideType: string,
    leaderStanding: any,
    institutionalTrust: any
  ): InstitutionalOverrideAnalysis {
    return {
      institutionType: 'central_bank',
      politicalFeasibility: baseAnalysis.feasibility - 15, // Central bank independence is valued
      constitutionalValidity: 65, // More constitutionally questionable
      publicSupportEstimate: decision.publicSupport - 10, // Public values central bank independence
      institutionalTrustImpact: -15, // Higher impact on institutional trust
      separationOfPowersRisk: 45, // Higher separation of powers concern
      politicalCostAssessment: baseAnalysis.cost + 20, // Higher political cost
      recommendedAction: baseAnalysis.feasibility > 70 ? 'proceed' : 'abandon',
      riskFactors: [
        'Market instability and investor confidence loss',
        'International economic credibility damage',
        'Monetary policy effectiveness reduction',
        'Inflation control complications'
      ],
      supportingArguments: [
        'Executive economic leadership responsibility',
        'National economic emergency powers',
        'Democratic accountability for economic outcomes'
      ],
      potentialChallenges: [
        'Financial market volatility and capital flight',
        'International monetary authority criticism',
        'Economic expert community opposition',
        'Long-term monetary policy credibility damage'
      ],
      institutionalSpecificRisks: [
        'Central bank independence undermined',
        'Monetary policy politicization',
        'International financial community trust loss',
        'Currency stability and exchange rate impacts'
      ],
      precedentAnalysis: [
        'Historical central bank overrides often lead to economic instability',
        'Market confidence crucial for monetary policy effectiveness',
        'International best practices favor central bank independence'
      ]
    };
  }

  private analyzeSupremeCourtOverride(
    baseAnalysis: any,
    decision: InstitutionalDecision,
    overrideType: string,
    leaderStanding: any,
    institutionalTrust: any
  ): InstitutionalOverrideAnalysis {
    return {
      institutionType: 'supreme_court',
      politicalFeasibility: baseAnalysis.feasibility - 25, // Judicial independence highly valued
      constitutionalValidity: 35, // Highly constitutionally questionable
      publicSupportEstimate: decision.publicSupport - 20, // Public strongly values judicial independence
      institutionalTrustImpact: -25, // Severe impact on institutional trust
      separationOfPowersRisk: 75, // Severe separation of powers concern
      politicalCostAssessment: baseAnalysis.cost + 35, // Very high political cost
      recommendedAction: 'abandon', // Almost never recommended
      riskFactors: [
        'Constitutional crisis and rule of law breakdown',
        'Judicial system credibility destruction',
        'International democratic reputation damage',
        'Legal system instability and uncertainty'
      ],
      supportingArguments: [
        'Emergency executive powers in national crisis',
        'Democratic mandate for constitutional interpretation',
        'National security override authority'
      ],
      potentialChallenges: [
        'Constitutional crisis and institutional breakdown',
        'Mass judicial and legal profession opposition',
        'International democratic community isolation',
        'Long-term rule of law and legal system damage'
      ],
      institutionalSpecificRisks: [
        'Judicial independence completely undermined',
        'Rule of law and constitutional order breakdown',
        'Legal system politicization and credibility loss',
        'International legal and diplomatic consequences'
      ],
      precedentAnalysis: [
        'Historical judicial overrides lead to constitutional crises',
        'Judicial independence fundamental to democratic systems',
        'International precedents show severe consequences'
      ]
    };
  }

  private calculateBaseAnalysis(decision: InstitutionalDecision, overrideType: string, leaderStanding: any): any {
    const baseFeasibility = leaderStanding.approvalRating;
    const baseCost = 100 - baseFeasibility;
    
    return {
      feasibility: baseFeasibility,
      cost: baseCost
    };
  }

  private async getInstitutionalDecision(
    institutionType: string,
    decisionId: string
  ): Promise<InstitutionalDecision | null> {
    // This would query the appropriate table based on institution type
    // For now, return mock data
    return {
      id: decisionId,
      institutionType: institutionType as any,
      title: `${institutionType} Decision ${decisionId}`,
      description: `Sample decision from ${institutionType}`,
      decisionType: 'policy',
      status: 'approved',
      canBeOverridden: true,
      urgencyLevel: 'important',
      publicSupport: 65,
      institutionalReasoning: `Institutional reasoning for ${institutionType} decision`,
      createdAt: new Date()
    };
  }

  private async getLeaderPoliticalStanding(leaderCharacterId: string, campaignId: number): Promise<any> {
    // Mock data for now
    return {
      approvalRating: 65,
      partyControl: 'majority',
      politicalCapital: 75,
      previousOverrides: 3
    };
  }

  private async getInstitutionalTrust(campaignId: number, institutionType: string): Promise<any> {
    // Mock data for now
    return {
      publicTrust: 70,
      expertTrust: 80,
      internationalTrust: 75
    };
  }

  private async getEligibleLegislativeDecisions(campaignId: number): Promise<InstitutionalDecision[]> {
    // Query legislative proposals that can be overridden
    const query = `
      SELECT id, proposal_title as title, proposal_summary as description, 
             status, urgency_level, public_support_estimate as public_support,
             created_at
      FROM legislative_proposals 
      WHERE campaign_id = $1 AND status IN ('passed', 'failed', 'leader_review')
      ORDER BY created_at DESC LIMIT 20
    `;
    
    const result = await this.pool.query(query, [campaignId]);
    return result.rows.map(row => ({
      id: row.id,
      institutionType: 'legislature' as const,
      title: row.title,
      description: row.description,
      decisionType: 'legislation',
      status: row.status,
      canBeOverridden: true,
      urgencyLevel: row.urgency_level,
      publicSupport: row.public_support || 50,
      institutionalReasoning: 'Legislative vote outcome',
      createdAt: new Date(row.created_at)
    }));
  }

  private async getEligibleCentralBankDecisions(campaignId: number): Promise<InstitutionalDecision[]> {
    // Mock central bank decisions - in real implementation would query CB tables
    return [
      {
        id: 'cb-1',
        institutionType: 'central_bank',
        title: 'Interest Rate Adjustment',
        description: 'Raise interest rates by 0.5% to combat inflation',
        decisionType: 'monetary_policy',
        status: 'approved',
        canBeOverridden: true,
        urgencyLevel: 'important',
        publicSupport: 45,
        institutionalReasoning: 'Inflation control measures necessary',
        createdAt: new Date()
      }
    ];
  }

  private async getEligibleSupremeCourtDecisions(campaignId: number): Promise<InstitutionalDecision[]> {
    // Mock supreme court decisions - in real implementation would query SC tables
    return [
      {
        id: 'sc-1',
        institutionType: 'supreme_court',
        title: 'Constitutional Review Case #2024-15',
        description: 'Ruling on executive emergency powers legislation',
        decisionType: 'constitutional_review',
        status: 'approved',
        canBeOverridden: true,
        urgencyLevel: 'urgent',
        publicSupport: 55,
        institutionalReasoning: 'Constitutional interpretation and precedent',
        createdAt: new Date()
      }
    ];
  }

  private calculatePublicApprovalImpact(
    overrideDecision: string,
    publicSupport: number,
    institutionType: string
  ): number {
    let baseImpact = 0;
    
    // Institution-specific impacts
    const institutionMultiplier = {
      'legislature': 1.0,
      'central_bank': 1.3,
      'supreme_court': 1.8
    };
    
    if (overrideDecision === 'approve' && publicSupport > 60) {
      baseImpact = 3;
    } else if (overrideDecision === 'reject' && publicSupport < 40) {
      baseImpact = 2;
    } else if (overrideDecision === 'reject' && publicSupport > 60) {
      baseImpact = -8;
    } else if (overrideDecision === 'approve' && publicSupport < 40) {
      baseImpact = -6;
    }
    
    return Math.round(baseImpact * (institutionMultiplier as any)[institutionType]);
  }

  private async calculatePartyRelationsImpact(
    campaignId: number,
    institutionType: string,
    overrideDecision: string
  ): Promise<Record<string, number>> {
    // Mock party impact calculation
    return {
      'Progressive Alliance': institutionType === 'supreme_court' ? -10 : -5,
      'Conservative Coalition': institutionType === 'central_bank' ? -8 : -3,
      'Centrist Party': -2
    };
  }

  private calculateStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private async validateOverrideRequest(request: OverrideRequest): Promise<void> {
    // Validate institution type
    if (!['legislature', 'central_bank', 'supreme_court'].includes(request.institutionType)) {
      throw new Error('Invalid institution type');
    }

    // Validate override decision
    if (!['approve', 'reject', 'modify', 'suspend'].includes(request.overrideDecision)) {
      throw new Error('Invalid override decision');
    }

    // Check if decision exists and can be overridden
    const decision = await this.getInstitutionalDecision(request.institutionType, request.targetDecisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    if (!decision.canBeOverridden) {
      throw new Error('Decision cannot be overridden');
    }

    // Check for existing active override
    const existingOverride = await this.getActiveOverrideForDecision(
      request.institutionType, 
      request.targetDecisionId
    );
    if (existingOverride) {
      throw new Error('An active override already exists for this decision');
    }
  }

  private async getActiveOverrideForDecision(
    institutionType: string,
    decisionId: string
  ): Promise<InstitutionalOverride | null> {
    const query = `
      SELECT * FROM institutional_overrides 
      WHERE institution_type = $1 AND target_decision_id = $2 AND status IN ('active', 'challenged')
      LIMIT 1
    `;
    const result = await this.pool.query(query, [institutionType, decisionId]);
    return result.rows.length > 0 ? this.mapOverrideFromDb(result.rows[0]) : null;
  }

  private async getOverrideById(overrideId: string): Promise<InstitutionalOverride | null> {
    const query = 'SELECT * FROM institutional_overrides WHERE id = $1';
    const result = await this.pool.query(query, [overrideId]);
    return result.rows.length > 0 ? this.mapOverrideFromDb(result.rows[0]) : null;
  }

  private async storeOverride(override: InstitutionalOverride): Promise<void> {
    const query = `
      INSERT INTO institutional_overrides (
        id, institution_type, target_decision_id, target_decision_title, campaign_id,
        leader_character_id, original_decision, original_reasoning, override_decision,
        override_reason, override_justification, constitutional_basis, legal_precedent,
        modifications, implementation_notes, political_cost, public_approval_impact,
        institutional_trust_impact, party_relations_impact, constitutionality_score,
        separation_of_powers_impact, judicial_independence_impact, monetary_authority_impact,
        effective_date, expiration_date, status, challenge_details, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
    `;

    await this.pool.query(query, [
      override.id, override.institutionType, override.targetDecisionId, override.targetDecisionTitle,
      override.campaignId, override.leaderCharacterId, override.originalDecision, override.originalReasoning,
      override.overrideDecision, override.overrideReason, override.overrideJustification,
      override.constitutionalBasis, override.legalPrecedent, override.modifications,
      override.implementationNotes, override.politicalCost, override.publicApprovalImpact,
      override.institutionalTrustImpact, JSON.stringify(override.partyRelationsImpact),
      override.constitutionalityScore, override.separationOfPowersImpact,
      override.judicialIndependenceImpact, override.monetaryAuthorityImpact,
      override.effectiveDate, override.expirationDate, override.status,
      override.challengeDetails ? JSON.stringify(override.challengeDetails) : null,
      override.createdAt, override.updatedAt
    ]);
  }

  private async updateDecisionStatus(
    institutionType: string,
    decisionId: string,
    status: string,
    overrideId: string
  ): Promise<void> {
    // Update the original decision status in the appropriate table
    switch (institutionType) {
      case 'legislature':
        await this.pool.query(
          'UPDATE legislative_proposals SET status = $1, leader_response = $2 WHERE id = $3',
          [status, `Overridden by leader (Override ID: ${overrideId})`, decisionId]
        );
        break;
      // Add cases for central_bank and supreme_court when their tables are available
    }
  }

  private async applyOverrideConsequences(override: InstitutionalOverride): Promise<void> {
    // Apply approval rating changes
    if (override.publicApprovalImpact !== 0) {
      await this.updateLeaderApproval(
        override.leaderCharacterId,
        override.campaignId,
        override.publicApprovalImpact
      );
    }

    // Apply institutional trust changes
    if (override.institutionalTrustImpact !== 0) {
      await this.updateInstitutionalTrust(
        override.campaignId,
        override.institutionType,
        override.institutionalTrustImpact
      );
    }

    // Apply party relationship changes
    for (const [party, impact] of Object.entries(override.partyRelationsImpact)) {
      if (impact !== 0) {
        await this.updatePartyRelationship(
          override.campaignId,
          party,
          override.leaderCharacterId,
          impact
        );
      }
    }

    // Record political capital expenditure
    await this.updatePoliticalCapital(
      override.leaderCharacterId,
      override.campaignId,
      -override.politicalCost
    );
  }

  private async logOverrideAction(override: InstitutionalOverride): Promise<void> {
    const query = `
      INSERT INTO leader_action_log (
        id, leader_character_id, campaign_id, action_type, action_description,
        target_id, political_cost, approval_impact, additional_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    await this.pool.query(query, [
      nanoid(),
      override.leaderCharacterId,
      override.campaignId,
      'institutional_override',
      `${override.overrideDecision.toUpperCase()} ${override.institutionType} decision: ${override.overrideReason}`,
      override.targetDecisionId,
      override.politicalCost,
      override.publicApprovalImpact,
      JSON.stringify({
        institutionType: override.institutionType,
        separationOfPowersImpact: override.separationOfPowersImpact,
        institutionalTrustImpact: override.institutionalTrustImpact
      }),
      override.createdAt
    ]);
  }

  private async updateLeaderApproval(leaderCharacterId: string, campaignId: number, change: number): Promise<void> {
    console.log(`Leader ${leaderCharacterId} approval changed by ${change} points`);
  }

  private async updateInstitutionalTrust(campaignId: number, institutionType: string, change: number): Promise<void> {
    console.log(`${institutionType} trust changed by ${change} points`);
  }

  private async updatePartyRelationship(campaignId: number, partyName: string, leaderCharacterId: string, change: number): Promise<void> {
    console.log(`Relationship with ${partyName} changed by ${change} points`);
  }

  private async updatePoliticalCapital(leaderCharacterId: string, campaignId: number, change: number): Promise<void> {
    console.log(`Political capital changed by ${change} points`);
  }

  private mapOverrideFromDb(row: any): InstitutionalOverride {
    return {
      id: row.id,
      institutionType: row.institution_type,
      targetDecisionId: row.target_decision_id,
      targetDecisionTitle: row.target_decision_title,
      campaignId: row.campaign_id,
      leaderCharacterId: row.leader_character_id,
      originalDecision: row.original_decision,
      originalReasoning: row.original_reasoning,
      overrideDecision: row.override_decision,
      overrideReason: row.override_reason,
      overrideJustification: row.override_justification,
      constitutionalBasis: row.constitutional_basis,
      legalPrecedent: row.legal_precedent,
      modifications: row.modifications,
      implementationNotes: row.implementation_notes,
      politicalCost: row.political_cost,
      publicApprovalImpact: row.public_approval_impact,
      institutionalTrustImpact: row.institutional_trust_impact,
      partyRelationsImpact: JSON.parse(row.party_relations_impact || '{}'),
      constitutionalityScore: row.constitutionality_score,
      separationOfPowersImpact: row.separation_of_powers_impact,
      judicialIndependenceImpact: row.judicial_independence_impact,
      monetaryAuthorityImpact: row.monetary_authority_impact,
      effectiveDate: new Date(row.effective_date),
      expirationDate: row.expiration_date ? new Date(row.expiration_date) : undefined,
      status: row.status,
      challengeDetails: row.challenge_details ? JSON.parse(row.challenge_details) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
