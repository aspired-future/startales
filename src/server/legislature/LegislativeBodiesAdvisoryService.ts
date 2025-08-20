import { Pool } from 'pg';
import { nanoid } from 'nanoid';

export interface LegislativeProposal {
  id: string;
  campaignId: number;
  proposalType: string;
  proposalTitle: string;
  proposalSummary: string;
  fullText: string;
  policyCategory: string;
  sponsorParty: string;
  coSponsors: string[];
  committeeAssignment?: string;
  constitutionalAnalysis?: string;
  impactAssessment: string;
  fiscalImpact: Record<string, any>;
  implementationTimeline?: string;
  publicSupportEstimate?: number;
  status: string;
  urgencyLevel: 'routine' | 'important' | 'urgent' | 'emergency';
  leaderPosition?: 'support' | 'neutral' | 'oppose' | 'undecided';
  leaderResponse?: string;
  leaderDecision?: 'approve' | 'modify' | 'veto' | 'defer';
  leaderModifications?: string;
  createdAt: Date;
  updatedAt: Date;
  votedAt?: Date;
  decidedAt?: Date;
}

export interface PoliticalParty {
  id: string;
  campaignId: number;
  partyName: string;
  partyAbbreviation: string;
  ideology: string;
  partyDescription: string;
  foundingPrinciples: string[];
  policyPositions: Record<string, any>;
  leadership: Record<string, any>;
  memberCount: number;
  approvalRating: number;
  electoralStrength: number;
  coalitionPartners: string[];
  oppositionParties: string[];
  recentPositions: any[];
  witterHandle?: string;
  publicStatements: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegislativeVote {
  id: string;
  proposalId: string;
  campaignId: number;
  voteType: string;
  voteDate: Date;
  totalVotes: number;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  partyBreakdown: Record<string, any>;
  voteResult: 'passed' | 'failed' | 'tied';
  requiredMajority: string;
  voteDetails: Record<string, any>;
  createdAt: Date;
}

export interface LegislativeCommittee {
  id: string;
  campaignId: number;
  committeeName: string;
  committeeType: string;
  jurisdiction: string;
  chairParty: string;
  rankingMemberParty?: string;
  memberComposition: Record<string, any>;
  activeProposals: number;
  meetingsHeld: number;
  reportsIssued: number;
  committeeAuthority: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegislativeSession {
  id: string;
  campaignId: number;
  sessionType: string;
  sessionTitle: string;
  sessionDescription?: string;
  scheduledDate: Date;
  durationMinutes?: number;
  agendaItems: any[];
  attendees: Record<string, any>;
  sessionOutcomes: Record<string, any>;
  proposalsDiscussed: string[];
  votesConducted: string[];
  status: string;
  sessionNotes?: string;
  publicAccess: boolean;
  mediaCoverage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderLegislativeInteraction {
  id: string;
  campaignId: number;
  interactionType: string;
  interactionSummary: string;
  proposalId?: string;
  leaderPosition: string;
  legislativeResponse?: string;
  discussionPoints: any[];
  agreementsReached: any[];
  disagreements: any[];
  compromiseSolutions: any[];
  interactionOutcome: string;
  publicDisclosure: boolean;
  interactionDate: Date;
  createdAt: Date;
}

export interface LegislativeAnalytics {
  id: string;
  campaignId: number;
  analyticsDate: Date;
  totalProposals: number;
  proposalsPassed: number;
  proposalsVetoed: number;
  leaderApprovalRate: number;
  legislativeProductivityScore: number;
  bipartisanCooperationScore: number;
  publicConfidenceInLegislature: number;
  partyPerformance: Record<string, any>;
  policyAreaActivity: Record<string, any>;
  createdAt: Date;
}

/**
 * Legislative Bodies Advisory Service
 * Provides comprehensive legislative oversight, law proposals, and democratic input
 */
export class LegislativeBodiesAdvisoryService {
  constructor(private pool: Pool) {}

  // ===== LEGISLATIVE PROPOSAL MANAGEMENT =====

  /**
   * Create new legislative proposal
   */
  async createLegislativeProposal(proposalData: {
    campaignId: number;
    proposalType: string;
    proposalTitle: string;
    proposalSummary: string;
    fullText: string;
    policyCategory: string;
    sponsorParty: string;
    coSponsors?: string[];
    committeeAssignment?: string;
    constitutionalAnalysis?: string;
    impactAssessment: string;
    fiscalImpact?: Record<string, any>;
    implementationTimeline?: string;
    publicSupportEstimate?: number;
    urgencyLevel: 'routine' | 'important' | 'urgent' | 'emergency';
  }): Promise<LegislativeProposal> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO legislative_proposals (
        id, campaign_id, proposal_type, proposal_title, proposal_summary, full_text,
        policy_category, sponsor_party, co_sponsors, committee_assignment,
        constitutional_analysis, impact_assessment, fiscal_impact,
        implementation_timeline, public_support_estimate, urgency_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      id, proposalData.campaignId, proposalData.proposalType, proposalData.proposalTitle,
      proposalData.proposalSummary, proposalData.fullText, proposalData.policyCategory,
      proposalData.sponsorParty, JSON.stringify(proposalData.coSponsors || []),
      proposalData.committeeAssignment, proposalData.constitutionalAnalysis,
      proposalData.impactAssessment, JSON.stringify(proposalData.fiscalImpact || {}),
      proposalData.implementationTimeline, proposalData.publicSupportEstimate,
      proposalData.urgencyLevel
    ]);

    return this.mapLegislativeProposal(result.rows[0]);
  }

  /**
   * Get legislative proposals with filtering
   */
  async getLegislativeProposals(campaignId: number, filters: {
    proposalType?: string;
    policyCategory?: string;
    status?: string;
    urgencyLevel?: string;
    sponsorParty?: string;
    limit?: number;
  } = {}): Promise<LegislativeProposal[]> {
    let query = `
      SELECT * FROM legislative_proposals 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (filters.proposalType) {
      query += ` AND proposal_type = $${++paramCount}`;
      params.push(filters.proposalType);
    }

    if (filters.policyCategory) {
      query += ` AND policy_category = $${++paramCount}`;
      params.push(filters.policyCategory);
    }

    if (filters.status) {
      query += ` AND status = $${++paramCount}`;
      params.push(filters.status);
    }

    if (filters.urgencyLevel) {
      query += ` AND urgency_level = $${++paramCount}`;
      params.push(filters.urgencyLevel);
    }

    if (filters.sponsorParty) {
      query += ` AND sponsor_party = $${++paramCount}`;
      params.push(filters.sponsorParty);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapLegislativeProposal(row));
  }

  /**
   * Leader response to legislative proposal
   */
  async respondToLegislativeProposal(
    proposalId: string,
    leaderDecision: 'approve' | 'modify' | 'veto' | 'defer',
    leaderResponse: string,
    leaderModifications?: string
  ): Promise<LegislativeProposal> {
    const result = await this.pool.query(`
      UPDATE legislative_proposals 
      SET leader_decision = $1, leader_response = $2, leader_modifications = $3,
          status = CASE 
            WHEN $1 = 'approve' THEN 'approved'
            WHEN $1 = 'modify' THEN 'approved'
            WHEN $1 = 'veto' THEN 'vetoed'
            ELSE 'leader_review'
          END,
          decided_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [leaderDecision, leaderResponse, leaderModifications, proposalId]);

    if (result.rows.length === 0) {
      throw new Error(`Legislative proposal ${proposalId} not found`);
    }

    return this.mapLegislativeProposal(result.rows[0]);
  }

  // ===== POLITICAL PARTY MANAGEMENT =====

  /**
   * Get political parties
   */
  async getPoliticalParties(campaignId: number, ideology?: string): Promise<PoliticalParty[]> {
    let query = `
      SELECT * FROM political_parties 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (ideology) {
      query += ` AND ideology = $2`;
      params.push(ideology);
    }

    query += ` ORDER BY electoral_strength DESC`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapPoliticalParty(row));
  }

  /**
   * Get party by ID
   */
  async getPoliticalPartyById(partyId: string): Promise<PoliticalParty | null> {
    const result = await this.pool.query(`
      SELECT * FROM political_parties WHERE id = $1
    `, [partyId]);

    return result.rows.length > 0 ? this.mapPoliticalParty(result.rows[0]) : null;
  }

  /**
   * Update party position on issue
   */
  async updatePartyPosition(
    partyId: string,
    issue: string,
    position: string,
    statement: string
  ): Promise<PoliticalParty> {
    const result = await this.pool.query(`
      UPDATE political_parties 
      SET recent_positions = recent_positions || $1::jsonb,
          public_statements = public_statements + 1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [
      JSON.stringify([{
        issue,
        position,
        statement,
        date: new Date().toISOString()
      }]),
      partyId
    ]);

    if (result.rows.length === 0) {
      throw new Error(`Political party ${partyId} not found`);
    }

    return this.mapPoliticalParty(result.rows[0]);
  }

  // ===== VOTING SYSTEM =====

  /**
   * Conduct legislative vote
   */
  async conductLegislativeVote(voteData: {
    proposalId: string;
    campaignId: number;
    voteType: string;
    requiredMajority: string;
    partyVotes: Record<string, { for: number; against: number; abstain: number }>;
  }): Promise<LegislativeVote> {
    const id = nanoid();

    // Calculate totals
    const totalVotes = Object.values(voteData.partyVotes).reduce(
      (sum, party) => sum + party.for + party.against + party.abstain, 0
    );
    const votesFor = Object.values(voteData.partyVotes).reduce(
      (sum, party) => sum + party.for, 0
    );
    const votesAgainst = Object.values(voteData.partyVotes).reduce(
      (sum, party) => sum + party.against, 0
    );
    const abstentions = Object.values(voteData.partyVotes).reduce(
      (sum, party) => sum + party.abstain, 0
    );

    // Determine result based on required majority
    let voteResult: 'passed' | 'failed' | 'tied';
    const majorityThreshold = this.calculateMajorityThreshold(totalVotes, voteData.requiredMajority);
    
    if (votesFor >= majorityThreshold) {
      voteResult = 'passed';
    } else if (votesFor === votesAgainst) {
      voteResult = 'tied';
    } else {
      voteResult = 'failed';
    }

    const result = await this.pool.query(`
      INSERT INTO legislative_votes (
        id, proposal_id, campaign_id, vote_type, vote_date, total_votes,
        votes_for, votes_against, abstentions, party_breakdown, vote_result,
        required_majority, vote_details
      ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      id, voteData.proposalId, voteData.campaignId, voteData.voteType,
      totalVotes, votesFor, votesAgainst, abstentions,
      JSON.stringify(voteData.partyVotes), voteResult, voteData.requiredMajority,
      JSON.stringify({ majorityThreshold, participationRate: (totalVotes / 185) * 100 })
    ]);

    // Update proposal status based on vote result
    await this.pool.query(`
      UPDATE legislative_proposals 
      SET status = $1, voted_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `, [voteResult === 'passed' ? 'passed' : 'failed', voteData.proposalId]);

    return this.mapLegislativeVote(result.rows[0]);
  }

  /**
   * Get voting history for proposal
   */
  async getVotingHistory(proposalId: string): Promise<LegislativeVote[]> {
    const result = await this.pool.query(`
      SELECT * FROM legislative_votes 
      WHERE proposal_id = $1 
      ORDER BY vote_date DESC
    `, [proposalId]);

    return result.rows.map(row => this.mapLegislativeVote(row));
  }

  // ===== COMMITTEE SYSTEM =====

  /**
   * Get legislative committees
   */
  async getLegislativeCommittees(campaignId: number, committeeType?: string): Promise<LegislativeCommittee[]> {
    let query = `
      SELECT * FROM legislative_committees 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (committeeType) {
      query += ` AND committee_type = $2`;
      params.push(committeeType);
    }

    query += ` ORDER BY committee_name`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapLegislativeCommittee(row));
  }

  /**
   * Assign proposal to committee
   */
  async assignProposalToCommittee(proposalId: string, committeeName: string): Promise<void> {
    await this.pool.query(`
      UPDATE legislative_proposals 
      SET committee_assignment = $1, 
          status = CASE WHEN status = 'drafted' THEN 'committee_review' ELSE status END,
          updated_at = NOW()
      WHERE id = $2
    `, [committeeName, proposalId]);

    // Update committee active proposals count
    await this.pool.query(`
      UPDATE legislative_committees 
      SET active_proposals = active_proposals + 1, updated_at = NOW()
      WHERE committee_name = $1
    `, [committeeName]);
  }

  // ===== SESSION MANAGEMENT =====

  /**
   * Schedule legislative session
   */
  async scheduleLegislativeSession(sessionData: {
    campaignId: number;
    sessionType: string;
    sessionTitle: string;
    sessionDescription?: string;
    scheduledDate: Date;
    durationMinutes?: number;
    agendaItems: any[];
    publicAccess?: boolean;
    mediaCoverage?: boolean;
  }): Promise<LegislativeSession> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO legislative_sessions (
        id, campaign_id, session_type, session_title, session_description,
        scheduled_date, duration_minutes, agenda_items, public_access, media_coverage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      id, sessionData.campaignId, sessionData.sessionType, sessionData.sessionTitle,
      sessionData.sessionDescription, sessionData.scheduledDate, sessionData.durationMinutes,
      JSON.stringify(sessionData.agendaItems), sessionData.publicAccess ?? true,
      sessionData.mediaCoverage ?? false
    ]);

    return this.mapLegislativeSession(result.rows[0]);
  }

  /**
   * Get upcoming legislative sessions
   */
  async getUpcomingSessions(campaignId: number, limit: number = 10): Promise<LegislativeSession[]> {
    const result = await this.pool.query(`
      SELECT * FROM legislative_sessions 
      WHERE campaign_id = $1 
      AND scheduled_date >= NOW() 
      AND status IN ('scheduled', 'in_progress')
      ORDER BY scheduled_date ASC 
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => this.mapLegislativeSession(row));
  }

  // ===== LEADER INTERACTION MANAGEMENT =====

  /**
   * Record leader-legislative interaction
   */
  async recordLeaderInteraction(interactionData: {
    campaignId: number;
    interactionType: string;
    interactionSummary: string;
    proposalId?: string;
    leaderPosition: string;
    legislativeResponse?: string;
    discussionPoints?: any[];
    agreementsReached?: any[];
    disagreements?: any[];
    compromiseSolutions?: any[];
    interactionOutcome: string;
    publicDisclosure?: boolean;
  }): Promise<LeaderLegislativeInteraction> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO leader_legislative_interactions (
        id, campaign_id, interaction_type, interaction_summary, proposal_id,
        leader_position, legislative_response, discussion_points, agreements_reached,
        disagreements, compromise_solutions, interaction_outcome, public_disclosure,
        interaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `, [
      id, interactionData.campaignId, interactionData.interactionType,
      interactionData.interactionSummary, interactionData.proposalId,
      interactionData.leaderPosition, interactionData.legislativeResponse,
      JSON.stringify(interactionData.discussionPoints || []),
      JSON.stringify(interactionData.agreementsReached || []),
      JSON.stringify(interactionData.disagreements || []),
      JSON.stringify(interactionData.compromiseSolutions || []),
      interactionData.interactionOutcome, interactionData.publicDisclosure ?? false
    ]);

    return this.mapLeaderLegislativeInteraction(result.rows[0]);
  }

  /**
   * Get recent leader interactions
   */
  async getRecentLeaderInteractions(campaignId: number, limit: number = 10): Promise<LeaderLegislativeInteraction[]> {
    const result = await this.pool.query(`
      SELECT * FROM leader_legislative_interactions 
      WHERE campaign_id = $1 
      ORDER BY interaction_date DESC 
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => this.mapLeaderLegislativeInteraction(row));
  }

  // ===== ANALYTICS & REPORTING =====

  /**
   * Update legislative analytics
   */
  async updateLegislativeAnalytics(campaignId: number): Promise<LegislativeAnalytics> {
    // Calculate current statistics
    const [proposalStats, partyStats, policyStats] = await Promise.all([
      this.pool.query(`
        SELECT 
          COUNT(*) as total_proposals,
          COUNT(*) FILTER (WHERE status = 'approved') as proposals_passed,
          COUNT(*) FILTER (WHERE status = 'vetoed') as proposals_vetoed,
          AVG(CASE WHEN leader_decision = 'approve' THEN 100 ELSE 0 END) as leader_approval_rate
        FROM legislative_proposals 
        WHERE campaign_id = $1
      `, [campaignId]),
      
      this.pool.query(`
        SELECT 
          sponsor_party,
          COUNT(*) as proposals_sponsored,
          AVG(CASE WHEN status = 'approved' THEN 100 ELSE 0 END) as success_rate
        FROM legislative_proposals 
        WHERE campaign_id = $1 
        GROUP BY sponsor_party
      `, [campaignId]),
      
      this.pool.query(`
        SELECT 
          policy_category,
          COUNT(*) as proposal_count
        FROM legislative_proposals 
        WHERE campaign_id = $1 
        GROUP BY policy_category
      `, [campaignId])
    ]);

    const stats = proposalStats.rows[0];
    const partyPerformance = partyStats.rows.reduce((acc, row) => {
      acc[row.sponsor_party] = {
        proposals_sponsored: parseInt(row.proposals_sponsored),
        success_rate: parseFloat(row.success_rate) || 0
      };
      return acc;
    }, {});

    const policyAreaActivity = policyStats.rows.reduce((acc, row) => {
      acc[row.policy_category] = parseInt(row.proposal_count);
      return acc;
    }, {});

    const result = await this.pool.query(`
      INSERT INTO legislative_analytics (
        campaign_id, analytics_date, total_proposals, proposals_passed, proposals_vetoed,
        leader_approval_rate, legislative_productivity_score, bipartisan_cooperation_score,
        public_confidence_in_legislature, party_performance, policy_area_activity
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      campaignId,
      parseInt(stats.total_proposals) || 0,
      parseInt(stats.proposals_passed) || 0,
      parseInt(stats.proposals_vetoed) || 0,
      parseFloat(stats.leader_approval_rate) || 0,
      75, // Default productivity score
      68, // Default cooperation score
      62.5, // Default public confidence
      JSON.stringify(partyPerformance),
      JSON.stringify(policyAreaActivity)
    ]);

    return this.mapLegislativeAnalytics(result.rows[0]);
  }

  /**
   * Get latest legislative analytics
   */
  async getLatestLegislativeAnalytics(campaignId: number): Promise<LegislativeAnalytics | null> {
    const result = await this.pool.query(`
      SELECT * FROM legislative_analytics 
      WHERE campaign_id = $1 
      ORDER BY analytics_date DESC 
      LIMIT 1
    `, [campaignId]);

    return result.rows.length > 0 ? this.mapLegislativeAnalytics(result.rows[0]) : null;
  }

  /**
   * Get legislative dashboard data
   */
  async getLegislativeDashboard(campaignId: number): Promise<Record<string, any>> {
    const [
      pendingProposals,
      parties,
      committees,
      upcomingSessions,
      recentInteractions,
      analytics
    ] = await Promise.all([
      this.getLegislativeProposals(campaignId, { status: 'leader_review', limit: 10 }),
      this.getPoliticalParties(campaignId),
      this.getLegislativeCommittees(campaignId),
      this.getUpcomingSessions(campaignId, 5),
      this.getRecentLeaderInteractions(campaignId, 5),
      this.getLatestLegislativeAnalytics(campaignId)
    ]);

    return {
      pendingProposals: pendingProposals.length,
      totalParties: parties.length,
      activeCommittees: committees.length,
      upcomingSessions: upcomingSessions.length,
      recentInteractions: recentInteractions.length,
      leaderApprovalRate: analytics?.leaderApprovalRate || 0,
      legislativeProductivity: analytics?.legislativeProductivityScore || 75,
      bipartisanCooperation: analytics?.bipartisanCooperationScore || 68,
      publicConfidence: analytics?.publicConfidenceInLegislature || 62.5,
      partyBreakdown: parties.map(p => ({
        name: p.partyName,
        abbreviation: p.partyAbbreviation,
        ideology: p.ideology,
        strength: p.electoralStrength,
        approval: p.approvalRating
      })),
      lastUpdated: new Date()
    };
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Calculate majority threshold based on requirement type
   */
  private calculateMajorityThreshold(totalVotes: number, requiredMajority: string): number {
    switch (requiredMajority) {
      case 'simple':
        return Math.floor(totalVotes / 2) + 1;
      case 'absolute':
        return Math.floor(totalVotes * 0.5) + 1;
      case 'two_thirds':
        return Math.ceil(totalVotes * (2/3));
      case 'three_quarters':
        return Math.ceil(totalVotes * 0.75);
      default:
        return Math.floor(totalVotes / 2) + 1;
    }
  }

  // ===== MAPPING FUNCTIONS =====

  private mapLegislativeProposal(row: any): LegislativeProposal {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      proposalType: row.proposal_type,
      proposalTitle: row.proposal_title,
      proposalSummary: row.proposal_summary,
      fullText: row.full_text,
      policyCategory: row.policy_category,
      sponsorParty: row.sponsor_party,
      coSponsors: row.co_sponsors,
      committeeAssignment: row.committee_assignment,
      constitutionalAnalysis: row.constitutional_analysis,
      impactAssessment: row.impact_assessment,
      fiscalImpact: row.fiscal_impact,
      implementationTimeline: row.implementation_timeline,
      publicSupportEstimate: row.public_support_estimate,
      status: row.status,
      urgencyLevel: row.urgency_level,
      leaderPosition: row.leader_position,
      leaderResponse: row.leader_response,
      leaderDecision: row.leader_decision,
      leaderModifications: row.leader_modifications,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      votedAt: row.voted_at ? new Date(row.voted_at) : undefined,
      decidedAt: row.decided_at ? new Date(row.decided_at) : undefined
    };
  }

  private mapPoliticalParty(row: any): PoliticalParty {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyName: row.party_name,
      partyAbbreviation: row.party_abbreviation,
      ideology: row.ideology,
      partyDescription: row.party_description,
      foundingPrinciples: row.founding_principles,
      policyPositions: row.policy_positions,
      leadership: row.leadership,
      memberCount: row.member_count,
      approvalRating: parseFloat(row.approval_rating),
      electoralStrength: parseFloat(row.electoral_strength),
      coalitionPartners: row.coalition_partners,
      oppositionParties: row.opposition_parties,
      recentPositions: row.recent_positions,
      witterHandle: row.witter_handle,
      publicStatements: row.public_statements,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapLegislativeVote(row: any): LegislativeVote {
    return {
      id: row.id,
      proposalId: row.proposal_id,
      campaignId: row.campaign_id,
      voteType: row.vote_type,
      voteDate: new Date(row.vote_date),
      totalVotes: row.total_votes,
      votesFor: row.votes_for,
      votesAgainst: row.votes_against,
      abstentions: row.abstentions,
      partyBreakdown: row.party_breakdown,
      voteResult: row.vote_result,
      requiredMajority: row.required_majority,
      voteDetails: row.vote_details,
      createdAt: new Date(row.created_at)
    };
  }

  private mapLegislativeCommittee(row: any): LegislativeCommittee {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      committeeName: row.committee_name,
      committeeType: row.committee_type,
      jurisdiction: row.jurisdiction,
      chairParty: row.chair_party,
      rankingMemberParty: row.ranking_member_party,
      memberComposition: row.member_composition,
      activeProposals: row.active_proposals,
      meetingsHeld: row.meetings_held,
      reportsIssued: row.reports_issued,
      committeeAuthority: row.committee_authority,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapLegislativeSession(row: any): LegislativeSession {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      sessionType: row.session_type,
      sessionTitle: row.session_title,
      sessionDescription: row.session_description,
      scheduledDate: new Date(row.scheduled_date),
      durationMinutes: row.duration_minutes,
      agendaItems: row.agenda_items,
      attendees: row.attendees,
      sessionOutcomes: row.session_outcomes,
      proposalsDiscussed: row.proposals_discussed,
      votesConducted: row.votes_conducted,
      status: row.status,
      sessionNotes: row.session_notes,
      publicAccess: row.public_access,
      mediaCoverage: row.media_coverage,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapLeaderLegislativeInteraction(row: any): LeaderLegislativeInteraction {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      interactionType: row.interaction_type,
      interactionSummary: row.interaction_summary,
      proposalId: row.proposal_id,
      leaderPosition: row.leader_position,
      legislativeResponse: row.legislative_response,
      discussionPoints: row.discussion_points,
      agreementsReached: row.agreements_reached,
      disagreements: row.disagreements,
      compromiseSolutions: row.compromise_solutions,
      interactionOutcome: row.interaction_outcome,
      publicDisclosure: row.public_disclosure,
      interactionDate: new Date(row.interaction_date),
      createdAt: new Date(row.created_at)
    };
  }

  private mapLegislativeAnalytics(row: any): LegislativeAnalytics {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      analyticsDate: new Date(row.analytics_date),
      totalProposals: row.total_proposals,
      proposalsPassed: row.proposals_passed,
      proposalsVetoed: row.proposals_vetoed,
      leaderApprovalRate: parseFloat(row.leader_approval_rate),
      legislativeProductivityScore: row.legislative_productivity_score,
      bipartisanCooperationScore: row.bipartisan_cooperation_score,
      publicConfidenceInLegislature: parseFloat(row.public_confidence_in_legislature),
      partyPerformance: row.party_performance,
      policyAreaActivity: row.policy_area_activity,
      createdAt: new Date(row.created_at)
    };
  }
}
