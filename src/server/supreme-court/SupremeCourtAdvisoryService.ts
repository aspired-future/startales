import { Pool } from 'pg';
import { nanoid } from 'nanoid';

export interface ConstitutionalReview {
  id: string;
  campaignId: number;
  reviewType: string;
  reviewTitle: string;
  subjectMatter: string;
  constitutionalProvisions: string[];
  legalPrecedents: string[];
  constitutionalAnalysis: string;
  legalReasoning: string;
  rightsImpactAssessment: string;
  recommendationSummary: string;
  detailedOpinion: string;
  constitutionalCompliance: 'compliant' | 'questionable' | 'non_compliant' | 'requires_modification';
  confidenceLevel: number;
  urgencyLevel: 'routine' | 'important' | 'urgent' | 'emergency';
  alternativeApproaches: any[];
  implementationGuidance?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'modified' | 'rejected';
  leaderResponse?: string;
  leaderDecision?: 'accept' | 'modify' | 'reject' | 'defer';
  leaderModifications?: string;
  createdAt: Date;
  reviewedAt?: Date;
  decidedAt?: Date;
  updatedAt: Date;
}

export interface SupremeCourtJustice {
  id: string;
  campaignId: number;
  justiceName: string;
  appointmentDate: Date;
  judicialPhilosophy: string;
  specialization: string[];
  tenureStatus: 'active' | 'senior' | 'retired' | 'deceased';
  appointmentAuthority: string;
  confirmationProcess: Record<string, any>;
  judicialRecord: Record<string, any>;
  notableOpinions: any[];
  recusalPatterns: any[];
  publicApprovalRating: number;
  legalScholarship: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalPrecedent {
  id: string;
  campaignId: number;
  caseName: string;
  caseCitation: string;
  decisionDate: Date;
  courtLevel: string;
  caseType: string;
  legalIssues: string[];
  constitutionalProvisions: string[];
  caseSummary: string;
  legalHolding: string;
  legalReasoning: string;
  dissentingOpinions?: string;
  concurringOpinions?: string;
  precedentialValue: 'binding' | 'persuasive' | 'distinguishable' | 'overruled';
  citedPrecedents: string[];
  citingCases: string[];
  impactAssessment?: string;
  overrulingCase?: string;
  currentStatus: 'active' | 'limited' | 'overruled' | 'superseded';
  createdAt: Date;
  updatedAt: Date;
}

export interface ConstitutionalInterpretation {
  id: string;
  campaignId: number;
  constitutionalProvision: string;
  interpretationType: string;
  interpretationSummary: string;
  detailedAnalysis: string;
  historicalContext?: string;
  comparativeAnalysis?: string;
  evolutionOverTime?: string;
  currentApplication: string;
  relatedPrecedents: string[];
  scholarlyConsensus: 'strong' | 'moderate' | 'weak' | 'disputed';
  practicalImplications: string;
  alternativeInterpretations: any[];
  confidenceLevel: number;
  lastReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JudicialOpinion {
  id: string;
  campaignId: number;
  opinionType: 'majority' | 'dissenting' | 'concurring' | 'advisory';
  caseId?: string;
  reviewId?: string;
  authoringJustice: string;
  joiningJustices: string[];
  opinionSummary: string;
  legalAnalysis: string;
  constitutionalReasoning: string;
  precedentDiscussion?: string;
  policyImplications?: string;
  futureGuidance?: string;
  scholarlyReception: 'positive' | 'mixed' | 'negative' | 'controversial';
  citationFrequency: number;
  influenceScore: number;
  opinionDate: Date;
  createdAt: Date;
}

export interface LeaderCourtInteraction {
  id: string;
  campaignId: number;
  interactionType: string;
  interactionSummary: string;
  constitutionalIssue?: string;
  courtPosition: string;
  leaderPosition: string;
  legalDiscussion: any[];
  constitutionalAnalysis?: string;
  agreementsReached: any[];
  disagreements: any[];
  compromiseSolutions: any[];
  interactionOutcome: string;
  constitutionalImplications?: string;
  precedentImpact?: string;
  publicDisclosure: boolean;
  interactionDate: Date;
  createdAt: Date;
}

export interface CourtAnalytics {
  id: string;
  campaignId: number;
  analyticsDate: Date;
  totalReviews: number;
  reviewsAccepted: number;
  reviewsRejected: number;
  leaderAcceptanceRate: number;
  constitutionalComplianceScore: number;
  judicialIndependenceScore: number;
  publicConfidenceInCourt: number;
  legalConsistencyScore: number;
  precedentStabilityScore: number;
  justicePerformance: Record<string, any>;
  caseTypeDistribution: Record<string, any>;
  constitutionalAreaActivity: Record<string, any>;
  createdAt: Date;
}

/**
 * Supreme Court Advisory Service
 * Provides comprehensive constitutional analysis and legal recommendations
 */
export class SupremeCourtAdvisoryService {
  constructor(private pool: Pool) {}

  // ===== CONSTITUTIONAL REVIEW MANAGEMENT =====

  /**
   * Create constitutional review
   */
  async createConstitutionalReview(reviewData: {
    campaignId: number;
    reviewType: string;
    reviewTitle: string;
    subjectMatter: string;
    constitutionalProvisions: string[];
    legalPrecedents: string[];
    constitutionalAnalysis: string;
    legalReasoning: string;
    rightsImpactAssessment: string;
    recommendationSummary: string;
    detailedOpinion: string;
    constitutionalCompliance: 'compliant' | 'questionable' | 'non_compliant' | 'requires_modification';
    confidenceLevel: number;
    urgencyLevel: 'routine' | 'important' | 'urgent' | 'emergency';
    alternativeApproaches?: any[];
    implementationGuidance?: string;
  }): Promise<ConstitutionalReview> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO constitutional_reviews (
        id, campaign_id, review_type, review_title, subject_matter, constitutional_provisions,
        legal_precedents, constitutional_analysis, legal_reasoning, rights_impact_assessment,
        recommendation_summary, detailed_opinion, constitutional_compliance, confidence_level,
        urgency_level, alternative_approaches, implementation_guidance
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      id, reviewData.campaignId, reviewData.reviewType, reviewData.reviewTitle,
      reviewData.subjectMatter, JSON.stringify(reviewData.constitutionalProvisions),
      JSON.stringify(reviewData.legalPrecedents), reviewData.constitutionalAnalysis,
      reviewData.legalReasoning, reviewData.rightsImpactAssessment,
      reviewData.recommendationSummary, reviewData.detailedOpinion,
      reviewData.constitutionalCompliance, reviewData.confidenceLevel,
      reviewData.urgencyLevel, JSON.stringify(reviewData.alternativeApproaches || []),
      reviewData.implementationGuidance
    ]);

    return this.mapConstitutionalReview(result.rows[0]);
  }

  /**
   * Get constitutional reviews with filtering
   */
  async getConstitutionalReviews(campaignId: number, filters: {
    reviewType?: string;
    constitutionalCompliance?: string;
    status?: string;
    urgencyLevel?: string;
    limit?: number;
  } = {}): Promise<ConstitutionalReview[]> {
    let query = `
      SELECT * FROM constitutional_reviews 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (filters.reviewType) {
      query += ` AND review_type = $${++paramCount}`;
      params.push(filters.reviewType);
    }

    if (filters.constitutionalCompliance) {
      query += ` AND constitutional_compliance = $${++paramCount}`;
      params.push(filters.constitutionalCompliance);
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
    return result.rows.map(row => this.mapConstitutionalReview(row));
  }

  /**
   * Leader response to constitutional review
   */
  async respondToConstitutionalReview(
    reviewId: string,
    leaderDecision: 'accept' | 'modify' | 'reject' | 'defer',
    leaderResponse: string,
    leaderModifications?: string
  ): Promise<ConstitutionalReview> {
    const result = await this.pool.query(`
      UPDATE constitutional_reviews 
      SET leader_decision = $1, leader_response = $2, leader_modifications = $3,
          status = CASE 
            WHEN $1 = 'accept' THEN 'accepted'
            WHEN $1 = 'modify' THEN 'modified'
            WHEN $1 = 'reject' THEN 'rejected'
            ELSE 'reviewed'
          END,
          decided_at = NOW(), reviewed_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [leaderDecision, leaderResponse, leaderModifications, reviewId]);

    if (result.rows.length === 0) {
      throw new Error(`Constitutional review ${reviewId} not found`);
    }

    return this.mapConstitutionalReview(result.rows[0]);
  }

  // ===== SUPREME COURT JUSTICE MANAGEMENT =====

  /**
   * Get Supreme Court justices
   */
  async getSupremeCourtJustices(campaignId: number, tenureStatus?: string): Promise<SupremeCourtJustice[]> {
    let query = `
      SELECT * FROM supreme_court_justices 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (tenureStatus) {
      query += ` AND tenure_status = $2`;
      params.push(tenureStatus);
    }

    query += ` ORDER BY appointment_date ASC`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapSupremeCourtJustice(row));
  }

  /**
   * Get justice by ID
   */
  async getJusticeById(justiceId: string): Promise<SupremeCourtJustice | null> {
    const result = await this.pool.query(`
      SELECT * FROM supreme_court_justices WHERE id = $1
    `, [justiceId]);

    return result.rows.length > 0 ? this.mapSupremeCourtJustice(result.rows[0]) : null;
  }

  // ===== LEGAL PRECEDENT MANAGEMENT =====

  /**
   * Get legal precedents
   */
  async getLegalPrecedents(campaignId: number, filters: {
    caseType?: string;
    courtLevel?: string;
    currentStatus?: string;
    limit?: number;
  } = {}): Promise<LegalPrecedent[]> {
    let query = `
      SELECT * FROM legal_precedents 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (filters.caseType) {
      query += ` AND case_type = $${++paramCount}`;
      params.push(filters.caseType);
    }

    if (filters.courtLevel) {
      query += ` AND court_level = $${++paramCount}`;
      params.push(filters.courtLevel);
    }

    if (filters.currentStatus) {
      query += ` AND current_status = $${++paramCount}`;
      params.push(filters.currentStatus);
    }

    query += ` ORDER BY decision_date DESC`;

    if (filters.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapLegalPrecedent(row));
  }

  /**
   * Search legal precedents by constitutional provision
   */
  async searchPrecedentsByProvision(
    campaignId: number,
    constitutionalProvision: string
  ): Promise<LegalPrecedent[]> {
    const result = await this.pool.query(`
      SELECT * FROM legal_precedents 
      WHERE campaign_id = $1 
      AND constitutional_provisions @> $2
      AND current_status = 'active'
      ORDER BY decision_date DESC
    `, [campaignId, JSON.stringify([constitutionalProvision])]);

    return result.rows.map(row => this.mapLegalPrecedent(row));
  }

  // ===== CONSTITUTIONAL INTERPRETATION =====

  /**
   * Get constitutional interpretations
   */
  async getConstitutionalInterpretations(
    campaignId: number,
    constitutionalProvision?: string
  ): Promise<ConstitutionalInterpretation[]> {
    let query = `
      SELECT * FROM constitutional_interpretations 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (constitutionalProvision) {
      query += ` AND constitutional_provision ILIKE $2`;
      params.push(`%${constitutionalProvision}%`);
    }

    query += ` ORDER BY last_review_date DESC`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapConstitutionalInterpretation(row));
  }

  /**
   * Create constitutional interpretation
   */
  async createConstitutionalInterpretation(interpretationData: {
    campaignId: number;
    constitutionalProvision: string;
    interpretationType: string;
    interpretationSummary: string;
    detailedAnalysis: string;
    historicalContext?: string;
    comparativeAnalysis?: string;
    evolutionOverTime?: string;
    currentApplication: string;
    relatedPrecedents?: string[];
    scholarlyConsensus: 'strong' | 'moderate' | 'weak' | 'disputed';
    practicalImplications: string;
    alternativeInterpretations?: any[];
    confidenceLevel: number;
  }): Promise<ConstitutionalInterpretation> {
    const result = await this.pool.query(`
      INSERT INTO constitutional_interpretations (
        campaign_id, constitutional_provision, interpretation_type, interpretation_summary,
        detailed_analysis, historical_context, comparative_analysis, evolution_over_time,
        current_application, related_precedents, scholarly_consensus, practical_implications,
        alternative_interpretations, confidence_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      interpretationData.campaignId, interpretationData.constitutionalProvision,
      interpretationData.interpretationType, interpretationData.interpretationSummary,
      interpretationData.detailedAnalysis, interpretationData.historicalContext,
      interpretationData.comparativeAnalysis, interpretationData.evolutionOverTime,
      interpretationData.currentApplication, JSON.stringify(interpretationData.relatedPrecedents || []),
      interpretationData.scholarlyConsensus, interpretationData.practicalImplications,
      JSON.stringify(interpretationData.alternativeInterpretations || []),
      interpretationData.confidenceLevel
    ]);

    return this.mapConstitutionalInterpretation(result.rows[0]);
  }

  // ===== JUDICIAL OPINION MANAGEMENT =====

  /**
   * Create judicial opinion
   */
  async createJudicialOpinion(opinionData: {
    campaignId: number;
    opinionType: 'majority' | 'dissenting' | 'concurring' | 'advisory';
    caseId?: string;
    reviewId?: string;
    authoringJustice: string;
    joiningJustices?: string[];
    opinionSummary: string;
    legalAnalysis: string;
    constitutionalReasoning: string;
    precedentDiscussion?: string;
    policyImplications?: string;
    futureGuidance?: string;
    scholarlyReception?: 'positive' | 'mixed' | 'negative' | 'controversial';
  }): Promise<JudicialOpinion> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO judicial_opinions (
        id, campaign_id, opinion_type, case_id, review_id, authoring_justice,
        joining_justices, opinion_summary, legal_analysis, constitutional_reasoning,
        precedent_discussion, policy_implications, future_guidance, scholarly_reception,
        opinion_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING *
    `, [
      id, opinionData.campaignId, opinionData.opinionType, opinionData.caseId,
      opinionData.reviewId, opinionData.authoringJustice,
      JSON.stringify(opinionData.joiningJustices || []), opinionData.opinionSummary,
      opinionData.legalAnalysis, opinionData.constitutionalReasoning,
      opinionData.precedentDiscussion, opinionData.policyImplications,
      opinionData.futureGuidance, opinionData.scholarlyReception || 'mixed'
    ]);

    return this.mapJudicialOpinion(result.rows[0]);
  }

  /**
   * Get judicial opinions
   */
  async getJudicialOpinions(campaignId: number, filters: {
    opinionType?: string;
    authoringJustice?: string;
    limit?: number;
  } = {}): Promise<JudicialOpinion[]> {
    let query = `
      SELECT * FROM judicial_opinions 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (filters.opinionType) {
      query += ` AND opinion_type = $${++paramCount}`;
      params.push(filters.opinionType);
    }

    if (filters.authoringJustice) {
      query += ` AND authoring_justice = $${++paramCount}`;
      params.push(filters.authoringJustice);
    }

    query += ` ORDER BY opinion_date DESC`;

    if (filters.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapJudicialOpinion(row));
  }

  // ===== LEADER INTERACTION MANAGEMENT =====

  /**
   * Record leader-court interaction
   */
  async recordLeaderCourtInteraction(interactionData: {
    campaignId: number;
    interactionType: string;
    interactionSummary: string;
    constitutionalIssue?: string;
    courtPosition: string;
    leaderPosition: string;
    legalDiscussion?: any[];
    constitutionalAnalysis?: string;
    agreementsReached?: any[];
    disagreements?: any[];
    compromiseSolutions?: any[];
    interactionOutcome: string;
    constitutionalImplications?: string;
    precedentImpact?: string;
    publicDisclosure?: boolean;
  }): Promise<LeaderCourtInteraction> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO leader_court_interactions (
        id, campaign_id, interaction_type, interaction_summary, constitutional_issue,
        court_position, leader_position, legal_discussion, constitutional_analysis,
        agreements_reached, disagreements, compromise_solutions, interaction_outcome,
        constitutional_implications, precedent_impact, public_disclosure, interaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
      RETURNING *
    `, [
      id, interactionData.campaignId, interactionData.interactionType,
      interactionData.interactionSummary, interactionData.constitutionalIssue,
      interactionData.courtPosition, interactionData.leaderPosition,
      JSON.stringify(interactionData.legalDiscussion || []),
      interactionData.constitutionalAnalysis,
      JSON.stringify(interactionData.agreementsReached || []),
      JSON.stringify(interactionData.disagreements || []),
      JSON.stringify(interactionData.compromiseSolutions || []),
      interactionData.interactionOutcome, interactionData.constitutionalImplications,
      interactionData.precedentImpact, interactionData.publicDisclosure ?? false
    ]);

    return this.mapLeaderCourtInteraction(result.rows[0]);
  }

  /**
   * Get recent leader-court interactions
   */
  async getRecentLeaderCourtInteractions(campaignId: number, limit: number = 10): Promise<LeaderCourtInteraction[]> {
    const result = await this.pool.query(`
      SELECT * FROM leader_court_interactions 
      WHERE campaign_id = $1 
      ORDER BY interaction_date DESC 
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => this.mapLeaderCourtInteraction(row));
  }

  // ===== ANALYTICS & REPORTING =====

  /**
   * Update court analytics
   */
  async updateCourtAnalytics(campaignId: number): Promise<CourtAnalytics> {
    // Calculate current statistics
    const [reviewStats, justiceStats, caseStats] = await Promise.all([
      this.pool.query(`
        SELECT 
          COUNT(*) as total_reviews,
          COUNT(*) FILTER (WHERE status = 'accepted') as reviews_accepted,
          COUNT(*) FILTER (WHERE status = 'rejected') as reviews_rejected,
          AVG(CASE WHEN leader_decision = 'accept' THEN 100 ELSE 0 END) as leader_acceptance_rate
        FROM constitutional_reviews 
        WHERE campaign_id = $1
      `, [campaignId]),
      
      this.pool.query(`
        SELECT 
          justice_name,
          judicial_record,
          public_approval_rating
        FROM supreme_court_justices 
        WHERE campaign_id = $1 AND tenure_status = 'active'
      `, [campaignId]),
      
      this.pool.query(`
        SELECT 
          case_type,
          COUNT(*) as case_count
        FROM legal_precedents 
        WHERE campaign_id = $1 
        GROUP BY case_type
      `, [campaignId])
    ]);

    const stats = reviewStats.rows[0];
    const justicePerformance = justiceStats.rows.reduce((acc, row) => {
      acc[row.justice_name] = {
        ...row.judicial_record,
        approval_rating: parseFloat(row.public_approval_rating) || 0
      };
      return acc;
    }, {});

    const caseTypeDistribution = caseStats.rows.reduce((acc, row) => {
      acc[row.case_type] = parseInt(row.case_count);
      return acc;
    }, {});

    const result = await this.pool.query(`
      INSERT INTO court_analytics (
        campaign_id, analytics_date, total_reviews, reviews_accepted, reviews_rejected,
        leader_acceptance_rate, constitutional_compliance_score, judicial_independence_score,
        public_confidence_in_court, legal_consistency_score, precedent_stability_score,
        justice_performance, case_type_distribution, constitutional_area_activity
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      campaignId,
      parseInt(stats.total_reviews) || 0,
      parseInt(stats.reviews_accepted) || 0,
      parseInt(stats.reviews_rejected) || 0,
      parseFloat(stats.leader_acceptance_rate) || 0,
      88, // Constitutional compliance score
      82, // Judicial independence score
      74.5, // Public confidence
      85, // Legal consistency score
      91, // Precedent stability score
      JSON.stringify(justicePerformance),
      JSON.stringify(caseTypeDistribution),
      JSON.stringify({
        commerce_clause: 1,
        privacy_rights: 1,
        environmental_protection: 1,
        emergency_powers: 1,
        digital_rights: 1
      })
    ]);

    return this.mapCourtAnalytics(result.rows[0]);
  }

  /**
   * Get latest court analytics
   */
  async getLatestCourtAnalytics(campaignId: number): Promise<CourtAnalytics | null> {
    const result = await this.pool.query(`
      SELECT * FROM court_analytics 
      WHERE campaign_id = $1 
      ORDER BY analytics_date DESC 
      LIMIT 1
    `, [campaignId]);

    return result.rows.length > 0 ? this.mapCourtAnalytics(result.rows[0]) : null;
  }

  /**
   * Get Supreme Court dashboard
   */
  async getSupremeCourtDashboard(campaignId: number): Promise<Record<string, any>> {
    const [
      pendingReviews,
      justices,
      recentPrecedents,
      recentInteractions,
      analytics
    ] = await Promise.all([
      this.getConstitutionalReviews(campaignId, { status: 'pending', limit: 10 }),
      this.getSupremeCourtJustices(campaignId, 'active'),
      this.getLegalPrecedents(campaignId, { limit: 5 }),
      this.getRecentLeaderCourtInteractions(campaignId, 5),
      this.getLatestCourtAnalytics(campaignId)
    ]);

    return {
      pendingReviews: pendingReviews.length,
      activeJustices: justices.length,
      recentPrecedents: recentPrecedents.length,
      recentInteractions: recentInteractions.length,
      leaderAcceptanceRate: analytics?.leaderAcceptanceRate || 0,
      constitutionalCompliance: analytics?.constitutionalComplianceScore || 88,
      judicialIndependence: analytics?.judicialIndependenceScore || 82,
      publicConfidence: analytics?.publicConfidenceInCourt || 74.5,
      legalConsistency: analytics?.legalConsistencyScore || 85,
      precedentStability: analytics?.precedentStabilityScore || 91,
      justiceBreakdown: justices.map(j => ({
        name: j.justiceName,
        philosophy: j.judicialPhilosophy,
        specialization: j.specialization,
        approval: j.publicApprovalRating,
        tenure: Math.floor((Date.now() - j.appointmentDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      })),
      lastUpdated: new Date()
    };
  }

  // ===== MAPPING FUNCTIONS =====

  private mapConstitutionalReview(row: any): ConstitutionalReview {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      reviewType: row.review_type,
      reviewTitle: row.review_title,
      subjectMatter: row.subject_matter,
      constitutionalProvisions: row.constitutional_provisions,
      legalPrecedents: row.legal_precedents,
      constitutionalAnalysis: row.constitutional_analysis,
      legalReasoning: row.legal_reasoning,
      rightsImpactAssessment: row.rights_impact_assessment,
      recommendationSummary: row.recommendation_summary,
      detailedOpinion: row.detailed_opinion,
      constitutionalCompliance: row.constitutional_compliance,
      confidenceLevel: row.confidence_level,
      urgencyLevel: row.urgency_level,
      alternativeApproaches: row.alternative_approaches,
      implementationGuidance: row.implementation_guidance,
      status: row.status,
      leaderResponse: row.leader_response,
      leaderDecision: row.leader_decision,
      leaderModifications: row.leader_modifications,
      createdAt: new Date(row.created_at),
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
      decidedAt: row.decided_at ? new Date(row.decided_at) : undefined,
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapSupremeCourtJustice(row: any): SupremeCourtJustice {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      justiceName: row.justice_name,
      appointmentDate: new Date(row.appointment_date),
      judicialPhilosophy: row.judicial_philosophy,
      specialization: row.specialization,
      tenureStatus: row.tenure_status,
      appointmentAuthority: row.appointment_authority,
      confirmationProcess: row.confirmation_process,
      judicialRecord: row.judicial_record,
      notableOpinions: row.notable_opinions,
      recusalPatterns: row.recusal_patterns,
      publicApprovalRating: parseFloat(row.public_approval_rating),
      legalScholarship: row.legal_scholarship,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapLegalPrecedent(row: any): LegalPrecedent {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      caseName: row.case_name,
      caseCitation: row.case_citation,
      decisionDate: new Date(row.decision_date),
      courtLevel: row.court_level,
      caseType: row.case_type,
      legalIssues: row.legal_issues,
      constitutionalProvisions: row.constitutional_provisions,
      caseSummary: row.case_summary,
      legalHolding: row.legal_holding,
      legalReasoning: row.legal_reasoning,
      dissentingOpinions: row.dissenting_opinions,
      concurringOpinions: row.concurring_opinions,
      precedentialValue: row.precedential_value,
      citedPrecedents: row.cited_precedents,
      citingCases: row.citing_cases,
      impactAssessment: row.impact_assessment,
      overrulingCase: row.overruling_case,
      currentStatus: row.current_status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapConstitutionalInterpretation(row: any): ConstitutionalInterpretation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      constitutionalProvision: row.constitutional_provision,
      interpretationType: row.interpretation_type,
      interpretationSummary: row.interpretation_summary,
      detailedAnalysis: row.detailed_analysis,
      historicalContext: row.historical_context,
      comparativeAnalysis: row.comparative_analysis,
      evolutionOverTime: row.evolution_over_time,
      currentApplication: row.current_application,
      relatedPrecedents: row.related_precedents,
      scholarlyConsensus: row.scholarly_consensus,
      practicalImplications: row.practical_implications,
      alternativeInterpretations: row.alternative_interpretations,
      confidenceLevel: row.confidence_level,
      lastReviewDate: new Date(row.last_review_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapJudicialOpinion(row: any): JudicialOpinion {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      opinionType: row.opinion_type,
      caseId: row.case_id,
      reviewId: row.review_id,
      authoringJustice: row.authoring_justice,
      joiningJustices: row.joining_justices,
      opinionSummary: row.opinion_summary,
      legalAnalysis: row.legal_analysis,
      constitutionalReasoning: row.constitutional_reasoning,
      precedentDiscussion: row.precedent_discussion,
      policyImplications: row.policy_implications,
      futureGuidance: row.future_guidance,
      scholarlyReception: row.scholarly_reception,
      citationFrequency: row.citation_frequency,
      influenceScore: row.influence_score,
      opinionDate: new Date(row.opinion_date),
      createdAt: new Date(row.created_at)
    };
  }

  private mapLeaderCourtInteraction(row: any): LeaderCourtInteraction {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      interactionType: row.interaction_type,
      interactionSummary: row.interaction_summary,
      constitutionalIssue: row.constitutional_issue,
      courtPosition: row.court_position,
      leaderPosition: row.leader_position,
      legalDiscussion: row.legal_discussion,
      constitutionalAnalysis: row.constitutional_analysis,
      agreementsReached: row.agreements_reached,
      disagreements: row.disagreements,
      compromiseSolutions: row.compromise_solutions,
      interactionOutcome: row.interaction_outcome,
      constitutionalImplications: row.constitutional_implications,
      precedentImpact: row.precedent_impact,
      publicDisclosure: row.public_disclosure,
      interactionDate: new Date(row.interaction_date),
      createdAt: new Date(row.created_at)
    };
  }

  private mapCourtAnalytics(row: any): CourtAnalytics {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      analyticsDate: new Date(row.analytics_date),
      totalReviews: row.total_reviews,
      reviewsAccepted: row.reviews_accepted,
      reviewsRejected: row.reviews_rejected,
      leaderAcceptanceRate: parseFloat(row.leader_acceptance_rate),
      constitutionalComplianceScore: row.constitutional_compliance_score,
      judicialIndependenceScore: row.judicial_independence_score,
      publicConfidenceInCourt: parseFloat(row.public_confidence_in_court),
      legalConsistencyScore: row.legal_consistency_score,
      precedentStabilityScore: row.precedent_stability_score,
      justicePerformance: row.justice_performance,
      caseTypeDistribution: row.case_type_distribution,
      constitutionalAreaActivity: row.constitutional_area_activity,
      createdAt: new Date(row.created_at)
    };
  }
}
