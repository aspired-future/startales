import { Pool } from 'pg';
import { nanoid } from 'nanoid';

export interface PolicyRecommendation {
  id: string;
  campaignId: number;
  recommendationType: string;
  recommendationTitle: string;
  recommendationSummary: string;
  detailedAnalysis: string;
  recommendedAction: string;
  economicRationale: string;
  riskAssessment: string;
  implementationTimeline?: string;
  confidenceLevel: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  supportingData: Record<string, any>;
  alternativeOptions: any[];
  internationalPrecedents: any[];
  status: 'pending' | 'reviewed' | 'accepted' | 'modified' | 'rejected';
  leaderResponse?: string;
  leaderDecision?: 'accept' | 'modify' | 'reject' | 'defer';
  implementationNotes?: string;
  createdAt: Date;
  reviewedAt?: Date;
  decidedAt?: Date;
}

export interface MonetaryPolicy {
  id: string;
  campaignId: number;
  policyRate: number;
  depositRate: number;
  lendingRate: number;
  inflationTarget: number;
  inflationTolerance: number;
  reserveRequirement: number;
  policyStance: 'accommodative' | 'neutral' | 'restrictive';
  forwardGuidance?: string;
  lastChangeDate: Date;
  lastChangeRationale?: string;
  nextReviewDate?: Date;
  decidedBy: string;
  recommendationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StabilityAssessment {
  id: string;
  campaignId: number;
  assessmentType: string;
  assessmentTitle: string;
  overallRating: 'stable' | 'watch' | 'concern' | 'critical';
  keyFindings: string;
  riskFactors: any[];
  stabilityIndicators: Record<string, any>;
  trendAnalysis: string;
  recommendations: string;
  monitoringPriorities: any[];
  internationalComparison: Record<string, any>;
  assessmentDate: Date;
  nextAssessmentDate?: Date;
  createdAt: Date;
}

export interface CrisisProtocol {
  id: string;
  campaignId: number;
  crisisType: string;
  protocolName: string;
  triggerConditions: Record<string, any>;
  responseSteps: any[];
  authorityLevels: Record<string, any>;
  coordinationRequirements: Record<string, any>;
  communicationStrategy: string;
  successCriteria: Record<string, any>;
  rollbackProcedures: any[];
  lastUpdated: Date;
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'review' | 'approved' | 'active' | 'deprecated';
}

export interface EconomicResearch {
  id: string;
  campaignId: number;
  researchType: string;
  researchTitle: string;
  executiveSummary: string;
  methodology: string;
  keyFindings: string;
  policyImplications: string;
  forecastData: Record<string, any>;
  confidenceIntervals: Record<string, any>;
  assumptions: any[];
  limitations?: string;
  publicationStatus: 'internal' | 'restricted' | 'public';
  researchDate: Date;
  publicationDate?: Date;
  createdAt: Date;
}

export interface LeaderInteraction {
  id: string;
  campaignId: number;
  interactionType: string;
  interactionSummary: string;
  leaderPosition: string;
  cbPosition?: string;
  discussionPoints: any[];
  agreementsReached: any[];
  disagreements: any[];
  followUpActions: any[];
  interactionOutcome: string;
  confidentialityLevel: 'public' | 'restricted' | 'internal' | 'classified';
  interactionDate: Date;
  createdAt: Date;
}

export interface IndependenceMetrics {
  id: string;
  campaignId: number;
  metricDate: Date;
  analyticalIndependenceScore: number;
  policyInfluenceScore: number;
  publicCredibilityScore: number;
  internationalReputationScore: number;
  recommendationsAccepted: number;
  recommendationsModified: number;
  recommendationsRejected: number;
  leaderOverrides: number;
  crisisResponses: number;
  publicStatements: number;
  marketConfidenceIndicator: number;
  independenceFactors: Record<string, any>;
  createdAt: Date;
}

/**
 * Central Bank Advisory Service
 * Provides comprehensive monetary policy recommendations and financial stability oversight
 */
export class CentralBankAdvisoryService {
  constructor(private pool: Pool) {}

  // ===== POLICY RECOMMENDATION MANAGEMENT =====

  /**
   * Create new policy recommendation
   */
  async createPolicyRecommendation(recommendationData: {
    campaignId: number;
    recommendationType: string;
    recommendationTitle: string;
    recommendationSummary: string;
    detailedAnalysis: string;
    recommendedAction: string;
    economicRationale: string;
    riskAssessment: string;
    implementationTimeline?: string;
    confidenceLevel: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    supportingData?: Record<string, any>;
    alternativeOptions?: any[];
    internationalPrecedents?: any[];
  }): Promise<PolicyRecommendation> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO cb_policy_recommendations (
        id, campaign_id, recommendation_type, recommendation_title, recommendation_summary,
        detailed_analysis, recommended_action, economic_rationale, risk_assessment,
        implementation_timeline, confidence_level, urgency_level, supporting_data,
        alternative_options, international_precedents
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      id, recommendationData.campaignId, recommendationData.recommendationType,
      recommendationData.recommendationTitle, recommendationData.recommendationSummary,
      recommendationData.detailedAnalysis, recommendationData.recommendedAction,
      recommendationData.economicRationale, recommendationData.riskAssessment,
      recommendationData.implementationTimeline, recommendationData.confidenceLevel,
      recommendationData.urgencyLevel, JSON.stringify(recommendationData.supportingData || {}),
      JSON.stringify(recommendationData.alternativeOptions || []),
      JSON.stringify(recommendationData.internationalPrecedents || [])
    ]);

    return this.mapPolicyRecommendation(result.rows[0]);
  }

  /**
   * Get policy recommendations with filtering
   */
  async getPolicyRecommendations(campaignId: number, filters: {
    recommendationType?: string;
    status?: string;
    urgencyLevel?: string;
    limit?: number;
  } = {}): Promise<PolicyRecommendation[]> {
    let query = `
      SELECT * FROM cb_policy_recommendations 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (filters.recommendationType) {
      query += ` AND recommendation_type = $${++paramCount}`;
      params.push(filters.recommendationType);
    }

    if (filters.status) {
      query += ` AND status = $${++paramCount}`;
      params.push(filters.status);
    }

    if (filters.urgencyLevel) {
      query += ` AND urgency_level = $${++paramCount}`;
      params.push(filters.urgencyLevel);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapPolicyRecommendation(row));
  }

  /**
   * Leader response to policy recommendation
   */
  async respondToPolicyRecommendation(
    recommendationId: string,
    leaderDecision: 'accept' | 'modify' | 'reject' | 'defer',
    leaderResponse: string,
    implementationNotes?: string
  ): Promise<PolicyRecommendation> {
    const result = await this.pool.query(`
      UPDATE cb_policy_recommendations 
      SET leader_decision = $1, leader_response = $2, implementation_notes = $3,
          status = CASE 
            WHEN $1 = 'accept' THEN 'accepted'
            WHEN $1 = 'modify' THEN 'modified'
            WHEN $1 = 'reject' THEN 'rejected'
            ELSE 'reviewed'
          END,
          decided_at = NOW(), reviewed_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [leaderDecision, leaderResponse, implementationNotes, recommendationId]);

    if (result.rows.length === 0) {
      throw new Error(`Policy recommendation ${recommendationId} not found`);
    }

    return this.mapPolicyRecommendation(result.rows[0]);
  }

  // ===== MONETARY POLICY MANAGEMENT =====

  /**
   * Get current monetary policy
   */
  async getCurrentMonetaryPolicy(campaignId: number): Promise<MonetaryPolicy | null> {
    const result = await this.pool.query(`
      SELECT * FROM cb_monetary_policy 
      WHERE campaign_id = $1 
      ORDER BY last_change_date DESC 
      LIMIT 1
    `, [campaignId]);

    return result.rows.length > 0 ? this.mapMonetaryPolicy(result.rows[0]) : null;
  }

  /**
   * Update monetary policy (leader decision)
   */
  async updateMonetaryPolicy(policyData: {
    campaignId: number;
    policyRate?: number;
    depositRate?: number;
    lendingRate?: number;
    inflationTarget?: number;
    inflationTolerance?: number;
    reserveRequirement?: number;
    policyStance?: 'accommodative' | 'neutral' | 'restrictive';
    forwardGuidance?: string;
    changeRationale: string;
    decidedBy: string;
    recommendationId?: string;
    nextReviewDate?: Date;
  }): Promise<MonetaryPolicy> {
    const currentPolicy = await this.getCurrentMonetaryPolicy(policyData.campaignId);
    
    if (!currentPolicy) {
      throw new Error('No current monetary policy found');
    }

    const result = await this.pool.query(`
      INSERT INTO cb_monetary_policy (
        campaign_id, policy_rate, deposit_rate, lending_rate, inflation_target,
        inflation_tolerance, reserve_requirement, policy_stance, forward_guidance,
        last_change_date, last_change_rationale, next_review_date, decided_by, recommendation_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11, $12, $13)
      RETURNING *
    `, [
      policyData.campaignId,
      policyData.policyRate ?? currentPolicy.policyRate,
      policyData.depositRate ?? currentPolicy.depositRate,
      policyData.lendingRate ?? currentPolicy.lendingRate,
      policyData.inflationTarget ?? currentPolicy.inflationTarget,
      policyData.inflationTolerance ?? currentPolicy.inflationTolerance,
      policyData.reserveRequirement ?? currentPolicy.reserveRequirement,
      policyData.policyStance ?? currentPolicy.policyStance,
      policyData.forwardGuidance ?? currentPolicy.forwardGuidance,
      policyData.changeRationale,
      policyData.nextReviewDate,
      policyData.decidedBy,
      policyData.recommendationId
    ]);

    return this.mapMonetaryPolicy(result.rows[0]);
  }

  // ===== FINANCIAL STABILITY MONITORING =====

  /**
   * Create financial stability assessment
   */
  async createStabilityAssessment(assessmentData: {
    campaignId: number;
    assessmentType: string;
    assessmentTitle: string;
    overallRating: 'stable' | 'watch' | 'concern' | 'critical';
    keyFindings: string;
    riskFactors?: any[];
    stabilityIndicators?: Record<string, any>;
    trendAnalysis: string;
    recommendations: string;
    monitoringPriorities?: any[];
    internationalComparison?: Record<string, any>;
    nextAssessmentDate?: Date;
  }): Promise<StabilityAssessment> {
    const result = await this.pool.query(`
      INSERT INTO cb_stability_assessments (
        campaign_id, assessment_type, assessment_title, overall_rating, key_findings,
        risk_factors, stability_indicators, trend_analysis, recommendations,
        monitoring_priorities, international_comparison, assessment_date, next_assessment_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12)
      RETURNING *
    `, [
      assessmentData.campaignId, assessmentData.assessmentType, assessmentData.assessmentTitle,
      assessmentData.overallRating, assessmentData.keyFindings,
      JSON.stringify(assessmentData.riskFactors || []),
      JSON.stringify(assessmentData.stabilityIndicators || {}),
      assessmentData.trendAnalysis, assessmentData.recommendations,
      JSON.stringify(assessmentData.monitoringPriorities || []),
      JSON.stringify(assessmentData.internationalComparison || {}),
      assessmentData.nextAssessmentDate
    ]);

    return this.mapStabilityAssessment(result.rows[0]);
  }

  /**
   * Get latest stability assessment
   */
  async getLatestStabilityAssessment(campaignId: number, assessmentType?: string): Promise<StabilityAssessment | null> {
    let query = `
      SELECT * FROM cb_stability_assessments 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (assessmentType) {
      query += ` AND assessment_type = $2`;
      params.push(assessmentType);
    }

    query += ` ORDER BY assessment_date DESC LIMIT 1`;

    const result = await this.pool.query(query, params);
    return result.rows.length > 0 ? this.mapStabilityAssessment(result.rows[0]) : null;
  }

  /**
   * Get stability indicators dashboard
   */
  async getStabilityIndicators(campaignId: number): Promise<Record<string, any>> {
    const assessments = await this.pool.query(`
      SELECT assessment_type, overall_rating, stability_indicators, assessment_date
      FROM cb_stability_assessments 
      WHERE campaign_id = $1 
      AND assessment_date >= NOW() - INTERVAL '30 days'
      ORDER BY assessment_date DESC
    `, [campaignId]);

    const indicators = {
      overallStability: 'stable',
      bankingHealth: 'stable',
      marketStability: 'stable',
      systemicRisk: 'low',
      lastUpdated: new Date(),
      trends: {},
      alerts: []
    };

    // Process recent assessments to build dashboard
    for (const assessment of assessments.rows) {
      if (assessment.overall_rating === 'critical' || assessment.overall_rating === 'concern') {
        indicators.alerts.push({
          type: assessment.assessment_type,
          rating: assessment.overall_rating,
          date: assessment.assessment_date
        });
      }

      // Update specific indicators
      if (assessment.assessment_type === 'banking_health') {
        indicators.bankingHealth = assessment.overall_rating;
      } else if (assessment.assessment_type === 'market_stability') {
        indicators.marketStability = assessment.overall_rating;
      }
    }

    return indicators;
  }

  // ===== CRISIS MANAGEMENT =====

  /**
   * Get crisis protocols
   */
  async getCrisisProtocols(campaignId: number, crisisType?: string): Promise<CrisisProtocol[]> {
    let query = `
      SELECT * FROM cb_crisis_protocols 
      WHERE campaign_id = $1 AND status = 'approved'
    `;
    const params: any[] = [campaignId];

    if (crisisType) {
      query += ` AND crisis_type = $2`;
      params.push(crisisType);
    }

    query += ` ORDER BY protocol_name`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapCrisisProtocol(row));
  }

  /**
   * Activate crisis protocol
   */
  async activateCrisisProtocol(
    protocolId: string,
    activationContext: Record<string, any>
  ): Promise<{ protocolId: string; activationId: string; responseSteps: any[] }> {
    const protocol = await this.pool.query(`
      SELECT * FROM cb_crisis_protocols WHERE id = $1
    `, [protocolId]);

    if (protocol.rows.length === 0) {
      throw new Error(`Crisis protocol ${protocolId} not found`);
    }

    const activationId = nanoid();
    const protocolData = this.mapCrisisProtocol(protocol.rows[0]);

    // Log protocol activation
    await this.pool.query(`
      INSERT INTO cb_leader_interactions (
        campaign_id, interaction_type, interaction_summary, leader_position,
        cb_position, discussion_points, interaction_outcome, interaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      protocolData.campaignId,
      'crisis_protocol_activation',
      `Crisis protocol "${protocolData.protocolName}" activated`,
      'Protocol activation approved',
      `Recommended activation due to: ${JSON.stringify(activationContext)}`,
      JSON.stringify([{ context: activationContext, protocol: protocolData.protocolName }]),
      'protocol_activated'
    ]);

    return {
      protocolId,
      activationId,
      responseSteps: protocolData.responseSteps
    };
  }

  // ===== ECONOMIC RESEARCH & ANALYSIS =====

  /**
   * Create economic research
   */
  async createEconomicResearch(researchData: {
    campaignId: number;
    researchType: string;
    researchTitle: string;
    executiveSummary: string;
    methodology: string;
    keyFindings: string;
    policyImplications: string;
    forecastData?: Record<string, any>;
    confidenceIntervals?: Record<string, any>;
    assumptions?: any[];
    limitations?: string;
    publicationStatus?: 'internal' | 'restricted' | 'public';
    publicationDate?: Date;
  }): Promise<EconomicResearch> {
    const result = await this.pool.query(`
      INSERT INTO cb_economic_research (
        campaign_id, research_type, research_title, executive_summary, methodology,
        key_findings, policy_implications, forecast_data, confidence_intervals,
        assumptions, limitations, publication_status, research_date, publication_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13)
      RETURNING *
    `, [
      researchData.campaignId, researchData.researchType, researchData.researchTitle,
      researchData.executiveSummary, researchData.methodology, researchData.keyFindings,
      researchData.policyImplications, JSON.stringify(researchData.forecastData || {}),
      JSON.stringify(researchData.confidenceIntervals || {}),
      JSON.stringify(researchData.assumptions || []), researchData.limitations,
      researchData.publicationStatus || 'internal', researchData.publicationDate
    ]);

    return this.mapEconomicResearch(result.rows[0]);
  }

  /**
   * Get economic forecasts
   */
  async getEconomicForecasts(campaignId: number, researchType?: string): Promise<EconomicResearch[]> {
    let query = `
      SELECT * FROM cb_economic_research 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (researchType) {
      query += ` AND research_type = $2`;
      params.push(researchType);
    }

    query += ` ORDER BY research_date DESC LIMIT 10`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapEconomicResearch(row));
  }

  // ===== INDEPENDENCE METRICS =====

  /**
   * Update independence metrics
   */
  async updateIndependenceMetrics(metricsData: {
    campaignId: number;
    analyticalIndependenceScore: number;
    policyInfluenceScore: number;
    publicCredibilityScore: number;
    internationalReputationScore: number;
    marketConfidenceIndicator: number;
    independenceFactors: Record<string, any>;
  }): Promise<IndependenceMetrics> {
    // Get current metrics to calculate changes
    const current = await this.pool.query(`
      SELECT * FROM cb_independence_metrics 
      WHERE campaign_id = $1 
      ORDER BY metric_date DESC 
      LIMIT 1
    `, [metricsData.campaignId]);

    const currentMetrics = current.rows.length > 0 ? current.rows[0] : {
      recommendations_accepted: 0,
      recommendations_modified: 0,
      recommendations_rejected: 0,
      leader_overrides: 0,
      crisis_responses: 0,
      public_statements: 0
    };

    const result = await this.pool.query(`
      INSERT INTO cb_independence_metrics (
        campaign_id, metric_date, analytical_independence_score, policy_influence_score,
        public_credibility_score, international_reputation_score, recommendations_accepted,
        recommendations_modified, recommendations_rejected, leader_overrides,
        crisis_responses, public_statements, market_confidence_indicator, independence_factors
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      metricsData.campaignId, metricsData.analyticalIndependenceScore,
      metricsData.policyInfluenceScore, metricsData.publicCredibilityScore,
      metricsData.internationalReputationScore, currentMetrics.recommendations_accepted,
      currentMetrics.recommendations_modified, currentMetrics.recommendations_rejected,
      currentMetrics.leader_overrides, currentMetrics.crisis_responses,
      currentMetrics.public_statements, metricsData.marketConfidenceIndicator,
      JSON.stringify(metricsData.independenceFactors)
    ]);

    return this.mapIndependenceMetrics(result.rows[0]);
  }

  /**
   * Get latest independence metrics
   */
  async getLatestIndependenceMetrics(campaignId: number): Promise<IndependenceMetrics | null> {
    const result = await this.pool.query(`
      SELECT * FROM cb_independence_metrics 
      WHERE campaign_id = $1 
      ORDER BY metric_date DESC 
      LIMIT 1
    `, [campaignId]);

    return result.rows.length > 0 ? this.mapIndependenceMetrics(result.rows[0]) : null;
  }

  // ===== ANALYTICS & REPORTING =====

  /**
   * Get Central Bank analytics dashboard
   */
  async getCentralBankAnalytics(campaignId: number): Promise<Record<string, any>> {
    const [
      currentPolicy,
      pendingRecommendations,
      stabilityAssessment,
      independenceMetrics,
      recentInteractions
    ] = await Promise.all([
      this.getCurrentMonetaryPolicy(campaignId),
      this.getPolicyRecommendations(campaignId, { status: 'pending', limit: 5 }),
      this.getLatestStabilityAssessment(campaignId),
      this.getLatestIndependenceMetrics(campaignId),
      this.pool.query(`
        SELECT interaction_type, interaction_outcome, interaction_date
        FROM cb_leader_interactions 
        WHERE campaign_id = $1 
        ORDER BY interaction_date DESC 
        LIMIT 10
      `, [campaignId])
    ]);

    return {
      monetaryPolicy: currentPolicy,
      pendingRecommendations: pendingRecommendations.length,
      stabilityRating: stabilityAssessment?.overallRating || 'stable',
      independenceScore: independenceMetrics?.analyticalIndependenceScore || 85,
      recentInteractions: recentInteractions.rows.length,
      policyEffectiveness: this.calculatePolicyEffectiveness(campaignId),
      marketConfidence: independenceMetrics?.marketConfidenceIndicator || 7.5,
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate policy effectiveness (simplified)
   */
  private async calculatePolicyEffectiveness(campaignId: number): Promise<number> {
    // This would integrate with inflation tracking and economic indicators
    // For now, return a calculated score based on recent policy decisions
    const recentDecisions = await this.pool.query(`
      SELECT leader_decision, confidence_level, urgency_level
      FROM cb_policy_recommendations 
      WHERE campaign_id = $1 
      AND decided_at >= NOW() - INTERVAL '90 days'
    `, [campaignId]);

    if (recentDecisions.rows.length === 0) return 75;

    const acceptanceRate = recentDecisions.rows.filter(r => r.leader_decision === 'accept').length / recentDecisions.rows.length;
    const avgConfidence = recentDecisions.rows.reduce((sum, r) => sum + r.confidence_level, 0) / recentDecisions.rows.length;

    return Math.round((acceptanceRate * 50) + (avgConfidence * 5));
  }

  // ===== MAPPING FUNCTIONS =====

  private mapPolicyRecommendation(row: any): PolicyRecommendation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      recommendationType: row.recommendation_type,
      recommendationTitle: row.recommendation_title,
      recommendationSummary: row.recommendation_summary,
      detailedAnalysis: row.detailed_analysis,
      recommendedAction: row.recommended_action,
      economicRationale: row.economic_rationale,
      riskAssessment: row.risk_assessment,
      implementationTimeline: row.implementation_timeline,
      confidenceLevel: row.confidence_level,
      urgencyLevel: row.urgency_level,
      supportingData: row.supporting_data,
      alternativeOptions: row.alternative_options,
      internationalPrecedents: row.international_precedents,
      status: row.status,
      leaderResponse: row.leader_response,
      leaderDecision: row.leader_decision,
      implementationNotes: row.implementation_notes,
      createdAt: new Date(row.created_at),
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
      decidedAt: row.decided_at ? new Date(row.decided_at) : undefined
    };
  }

  private mapMonetaryPolicy(row: any): MonetaryPolicy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      policyRate: parseFloat(row.policy_rate),
      depositRate: parseFloat(row.deposit_rate),
      lendingRate: parseFloat(row.lending_rate),
      inflationTarget: parseFloat(row.inflation_target),
      inflationTolerance: parseFloat(row.inflation_tolerance),
      reserveRequirement: parseFloat(row.reserve_requirement),
      policyStance: row.policy_stance,
      forwardGuidance: row.forward_guidance,
      lastChangeDate: new Date(row.last_change_date),
      lastChangeRationale: row.last_change_rationale,
      nextReviewDate: row.next_review_date ? new Date(row.next_review_date) : undefined,
      decidedBy: row.decided_by,
      recommendationId: row.recommendation_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapStabilityAssessment(row: any): StabilityAssessment {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      assessmentType: row.assessment_type,
      assessmentTitle: row.assessment_title,
      overallRating: row.overall_rating,
      keyFindings: row.key_findings,
      riskFactors: row.risk_factors,
      stabilityIndicators: row.stability_indicators,
      trendAnalysis: row.trend_analysis,
      recommendations: row.recommendations,
      monitoringPriorities: row.monitoring_priorities,
      internationalComparison: row.international_comparison,
      assessmentDate: new Date(row.assessment_date),
      nextAssessmentDate: row.next_assessment_date ? new Date(row.next_assessment_date) : undefined,
      createdAt: new Date(row.created_at)
    };
  }

  private mapCrisisProtocol(row: any): CrisisProtocol {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      crisisType: row.crisis_type,
      protocolName: row.protocol_name,
      triggerConditions: row.trigger_conditions,
      responseSteps: row.response_steps,
      authorityLevels: row.authority_levels,
      coordinationRequirements: row.coordination_requirements,
      communicationStrategy: row.communication_strategy,
      successCriteria: row.success_criteria,
      rollbackProcedures: row.rollback_procedures,
      lastUpdated: new Date(row.last_updated),
      createdBy: row.created_by,
      approvedBy: row.approved_by,
      status: row.status
    };
  }

  private mapEconomicResearch(row: any): EconomicResearch {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      researchType: row.research_type,
      researchTitle: row.research_title,
      executiveSummary: row.executive_summary,
      methodology: row.methodology,
      keyFindings: row.key_findings,
      policyImplications: row.policy_implications,
      forecastData: row.forecast_data,
      confidenceIntervals: row.confidence_intervals,
      assumptions: row.assumptions,
      limitations: row.limitations,
      publicationStatus: row.publication_status,
      researchDate: new Date(row.research_date),
      publicationDate: row.publication_date ? new Date(row.publication_date) : undefined,
      createdAt: new Date(row.created_at)
    };
  }

  private mapIndependenceMetrics(row: any): IndependenceMetrics {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      metricDate: new Date(row.metric_date),
      analyticalIndependenceScore: row.analytical_independence_score,
      policyInfluenceScore: row.policy_influence_score,
      publicCredibilityScore: row.public_credibility_score,
      internationalReputationScore: row.international_reputation_score,
      recommendationsAccepted: row.recommendations_accepted,
      recommendationsModified: row.recommendations_modified,
      recommendationsRejected: row.recommendations_rejected,
      leaderOverrides: row.leader_overrides,
      crisisResponses: row.crisis_responses,
      publicStatements: row.public_statements,
      marketConfidenceIndicator: parseFloat(row.market_confidence_indicator),
      independenceFactors: row.independence_factors,
      createdAt: new Date(row.created_at)
    };
  }
}
