import { Pool } from 'pg';
import { nanoid } from 'nanoid';

export interface EnhancedPoliticalParty {
  id: string;
  campaignId: number;
  partyName: string;
  ideology: string;
  supportBase: number;
  witterHandle: string;
  partyBackstory?: string;
  foundingDate?: Date;
  keyHistoricalEvents: any[];
  currentLeadershipStructure: Record<string, any>;
  membershipDemographics: Record<string, any>;
  electoralHistory: any[];
  fundraisingData: Record<string, any>;
  mediaStrategy: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartyLeadership {
  id: string;
  campaignId: number;
  partyId: string;
  leadershipPosition: string;
  leaderName: string;
  appointmentDate: Date;
  leadershipStyle: string;
  approvalRating: number;
  specialization: string[];
  politicalBackground?: string;
  leadershipPriorities: string[];
  publicStatements: number;
  mediaAppearances: number;
  status: 'active' | 'interim' | 'resigned' | 'challenged';
  createdAt: Date;
  updatedAt: Date;
}

export interface PartyPolicyPosition {
  id: string;
  campaignId: number;
  partyId: string;
  policyArea: string;
  policyTopic: string;
  positionSummary: string;
  detailedPosition: string;
  positionStrength: 'core_principle' | 'strong_support' | 'moderate_support' | 'neutral' | 'moderate_opposition' | 'strong_opposition';
  flexibilityLevel: 'non_negotiable' | 'firm' | 'flexible' | 'very_flexible';
  publicMessaging?: string;
  supportingArguments: string[];
  policyEvolution: any[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface PartyWitterActivity {
  id: string;
  campaignId: number;
  partyId: string;
  accountType: string;
  accountHandle: string;
  postType: string;
  postContent: string;
  hashtags: string[];
  mentions: string[];
  engagementMetrics: Record<string, any>;
  responseToPostId?: number;
  politicalContext?: string;
  messagingStrategy?: string;
  postDate: Date;
  createdAt: Date;
}

export interface PartyElectoralPerformance {
  id: string;
  campaignId: number;
  partyId: string;
  electionType: string;
  electionDate: Date;
  voteShare: number;
  seatsWon: number;
  seatsContested: number;
  voterTurnoutImpact?: number;
  demographicPerformance: Record<string, any>;
  geographicPerformance: Record<string, any>;
  issuePerformance: Record<string, any>;
  campaignSpending: number;
  campaignStrategy?: string;
  electionOutcome: string;
  postElectionAnalysis?: string;
  createdAt: Date;
}

export interface PartyCoalition {
  id: string;
  campaignId: number;
  coalitionName: string;
  coalitionType: string;
  memberParties: string[];
  coalitionAgreement?: string;
  policyPriorities: string[];
  leadershipStructure: Record<string, any>;
  formationDate: Date;
  expectedDuration?: string;
  successMetrics: Record<string, any>;
  internalTensions: any[];
  publicApproval: number;
  status: 'forming' | 'active' | 'strained' | 'dissolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface PartyEvent {
  id: string;
  campaignId: number;
  partyId: string;
  eventType: string;
  eventTitle: string;
  eventDescription?: string;
  eventDate: Date;
  location?: string;
  expectedAttendance?: number;
  actualAttendance?: number;
  keySpeakers: string[];
  eventAgenda: any[];
  mediaCoverage: boolean;
  witterCoverage: boolean;
  eventOutcomes: Record<string, any>;
  publicReception: string;
  fundraisingTotal: number;
  createdAt: Date;
}

/**
 * Enhanced Political Party System Service
 * Provides comprehensive political party management with Witter integration
 */
export class PoliticalPartySystemService {
  constructor(private pool: Pool) {}

  // ===== ENHANCED PARTY MANAGEMENT =====

  /**
   * Get enhanced political parties with full profiles
   */
  async getEnhancedPoliticalParties(campaignId: number): Promise<EnhancedPoliticalParty[]> {
    const result = await this.pool.query(`
      SELECT * FROM political_parties 
      WHERE campaign_id = $1 
      ORDER BY support_base DESC
    `, [campaignId]);

    return result.rows.map(row => this.mapEnhancedPoliticalParty(row));
  }

  /**
   * Update party backstory and historical narrative
   */
  async updatePartyBackstory(
    partyId: string,
    backstory: string,
    historicalEvents?: any[]
  ): Promise<EnhancedPoliticalParty> {
    const result = await this.pool.query(`
      UPDATE political_parties 
      SET party_backstory = $1, 
          key_historical_events = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [backstory, JSON.stringify(historicalEvents || []), partyId]);

    if (result.rows.length === 0) {
      throw new Error(`Political party ${partyId} not found`);
    }

    return this.mapEnhancedPoliticalParty(result.rows[0]);
  }

  /**
   * Get party demographics and membership analysis
   */
  async getPartyDemographics(partyId: string): Promise<Record<string, any>> {
    const result = await this.pool.query(`
      SELECT membership_demographics, electoral_history, fundraising_data
      FROM political_parties 
      WHERE id = $1
    `, [partyId]);

    if (result.rows.length === 0) {
      throw new Error(`Political party ${partyId} not found`);
    }

    return {
      demographics: result.rows[0].membership_demographics,
      electoralHistory: result.rows[0].electoral_history,
      fundraising: result.rows[0].fundraising_data
    };
  }

  // ===== PARTY LEADERSHIP MANAGEMENT =====

  /**
   * Get party leadership
   */
  async getPartyLeadership(campaignId: number, partyId?: string): Promise<PartyLeadership[]> {
    let query = `
      SELECT * FROM party_leadership 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (partyId) {
      query += ` AND party_id = $2`;
      params.push(partyId);
    }

    query += ` ORDER BY appointment_date DESC`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapPartyLeadership(row));
  }

  /**
   * Create or update party leadership
   */
  async managePartyLeadership(leadershipData: {
    campaignId: number;
    partyId: string;
    leadershipPosition: string;
    leaderName: string;
    appointmentDate: Date;
    leadershipStyle: string;
    approvalRating?: number;
    specialization?: string[];
    politicalBackground?: string;
    leadershipPriorities?: string[];
  }): Promise<PartyLeadership> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_leadership (
        id, campaign_id, party_id, leadership_position, leader_name, appointment_date,
        leadership_style, approval_rating, specialization, political_background, leadership_priorities
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, leadershipData.campaignId, leadershipData.partyId, leadershipData.leadershipPosition,
      leadershipData.leaderName, leadershipData.appointmentDate, leadershipData.leadershipStyle,
      leadershipData.approvalRating || 50, JSON.stringify(leadershipData.specialization || []),
      leadershipData.politicalBackground, JSON.stringify(leadershipData.leadershipPriorities || [])
    ]);

    return this.mapPartyLeadership(result.rows[0]);
  }

  // ===== POLICY POSITION MANAGEMENT =====

  /**
   * Get party policy positions
   */
  async getPartyPolicyPositions(
    campaignId: number,
    partyId?: string,
    policyArea?: string
  ): Promise<PartyPolicyPosition[]> {
    let query = `
      SELECT * FROM party_policy_positions 
      WHERE campaign_id = $1
    `;
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (partyId) {
      query += ` AND party_id = $${++paramCount}`;
      params.push(partyId);
    }

    if (policyArea) {
      query += ` AND policy_area = $${++paramCount}`;
      params.push(policyArea);
    }

    query += ` ORDER BY policy_area, policy_topic`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapPartyPolicyPosition(row));
  }

  /**
   * Create detailed policy position
   */
  async createPolicyPosition(positionData: {
    campaignId: number;
    partyId: string;
    policyArea: string;
    policyTopic: string;
    positionSummary: string;
    detailedPosition: string;
    positionStrength: 'core_principle' | 'strong_support' | 'moderate_support' | 'neutral' | 'moderate_opposition' | 'strong_opposition';
    flexibilityLevel: 'non_negotiable' | 'firm' | 'flexible' | 'very_flexible';
    publicMessaging?: string;
    supportingArguments?: string[];
  }): Promise<PartyPolicyPosition> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_policy_positions (
        id, campaign_id, party_id, policy_area, policy_topic, position_summary,
        detailed_position, position_strength, flexibility_level, public_messaging, supporting_arguments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, positionData.campaignId, positionData.partyId, positionData.policyArea,
      positionData.policyTopic, positionData.positionSummary, positionData.detailedPosition,
      positionData.positionStrength, positionData.flexibilityLevel, positionData.publicMessaging,
      JSON.stringify(positionData.supportingArguments || [])
    ]);

    return this.mapPartyPolicyPosition(result.rows[0]);
  }

  /**
   * Update policy position with evolution tracking
   */
  async updatePolicyPosition(
    positionId: string,
    updates: Partial<PartyPolicyPosition>,
    evolutionReason?: string
  ): Promise<PartyPolicyPosition> {
    // Get current position for evolution tracking
    const currentResult = await this.pool.query(`
      SELECT * FROM party_policy_positions WHERE id = $1
    `, [positionId]);

    if (currentResult.rows.length === 0) {
      throw new Error(`Policy position ${positionId} not found`);
    }

    const current = currentResult.rows[0];
    const evolution = {
      date: new Date().toISOString(),
      previousPosition: current.position_summary,
      newPosition: updates.positionSummary || current.position_summary,
      reason: evolutionReason || 'Position update',
      previousStrength: current.position_strength,
      newStrength: updates.positionStrength || current.position_strength
    };

    const updatedEvolution = [...current.policy_evolution, evolution];

    const result = await this.pool.query(`
      UPDATE party_policy_positions 
      SET position_summary = COALESCE($1, position_summary),
          detailed_position = COALESCE($2, detailed_position),
          position_strength = COALESCE($3, position_strength),
          flexibility_level = COALESCE($4, flexibility_level),
          public_messaging = COALESCE($5, public_messaging),
          policy_evolution = $6,
          last_updated = NOW()
      WHERE id = $7
      RETURNING *
    `, [
      updates.positionSummary, updates.detailedPosition, updates.positionStrength,
      updates.flexibilityLevel, updates.publicMessaging, JSON.stringify(updatedEvolution),
      positionId
    ]);

    return this.mapPartyPolicyPosition(result.rows[0]);
  }

  /**
   * Compare policy positions across parties
   */
  async comparePolicyPositions(
    campaignId: number,
    policyArea: string,
    policyTopic: string
  ): Promise<Record<string, any>> {
    const result = await this.pool.query(`
      SELECT 
        pp.party_id,
        p.party_name,
        pp.position_summary,
        pp.position_strength,
        pp.flexibility_level,
        pp.public_messaging
      FROM party_policy_positions pp
      JOIN political_parties p ON pp.party_id = p.id
      WHERE pp.campaign_id = $1 
      AND pp.policy_area = $2 
      AND pp.policy_topic = $3
      ORDER BY p.support_base DESC
    `, [campaignId, policyArea, policyTopic]);

    return {
      policyArea,
      policyTopic,
      partyPositions: result.rows,
      comparisonDate: new Date().toISOString()
    };
  }

  // ===== WITTER INTEGRATION =====

  /**
   * Create party Witter post
   */
  async createPartyWitterPost(postData: {
    campaignId: number;
    partyId: string;
    accountType: string;
    accountHandle: string;
    postType: string;
    postContent: string;
    hashtags?: string[];
    mentions?: string[];
    politicalContext?: string;
    messagingStrategy?: string;
  }): Promise<PartyWitterActivity> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_witter_activity (
        id, campaign_id, party_id, account_type, account_handle, post_type,
        post_content, hashtags, mentions, political_context, messaging_strategy, post_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `, [
      id, postData.campaignId, postData.partyId, postData.accountType,
      postData.accountHandle, postData.postType, postData.postContent,
      JSON.stringify(postData.hashtags || []), JSON.stringify(postData.mentions || []),
      postData.politicalContext, postData.messagingStrategy
    ]);

    return this.mapPartyWitterActivity(result.rows[0]);
  }

  /**
   * Get recent political Witter activity
   */
  async getRecentPoliticalWitterActivity(
    campaignId: number,
    limit: number = 20
  ): Promise<PartyWitterActivity[]> {
    const result = await this.pool.query(`
      SELECT pwa.*, p.party_name, p.witter_handle as party_handle
      FROM party_witter_activity pwa
      JOIN political_parties p ON pwa.party_id = p.id
      WHERE pwa.campaign_id = $1
      ORDER BY pwa.post_date DESC
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => this.mapPartyWitterActivity(row));
  }

  /**
   * Create rapid response to political events
   */
  async createRapidResponse(
    campaignId: number,
    partyId: string,
    eventDescription: string,
    responseContent: string,
    hashtags?: string[]
  ): Promise<PartyWitterActivity> {
    return this.createPartyWitterPost({
      campaignId,
      partyId,
      accountType: 'rapid_response',
      accountHandle: `@${partyId}_rapid`,
      postType: 'event_response',
      postContent: responseContent,
      hashtags,
      politicalContext: eventDescription,
      messagingStrategy: 'rapid_response'
    });
  }

  // ===== ELECTORAL PERFORMANCE =====

  /**
   * Record electoral performance
   */
  async recordElectoralPerformance(performanceData: {
    campaignId: number;
    partyId: string;
    electionType: string;
    electionDate: Date;
    voteShare: number;
    seatsWon: number;
    seatsContested: number;
    voterTurnoutImpact?: number;
    demographicPerformance?: Record<string, any>;
    geographicPerformance?: Record<string, any>;
    issuePerformance?: Record<string, any>;
    campaignSpending?: number;
    campaignStrategy?: string;
    electionOutcome: string;
    postElectionAnalysis?: string;
  }): Promise<PartyElectoralPerformance> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_electoral_performance (
        id, campaign_id, party_id, election_type, election_date, vote_share,
        seats_won, seats_contested, voter_turnout_impact, demographic_performance,
        geographic_performance, issue_performance, campaign_spending, campaign_strategy,
        election_outcome, post_election_analysis
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      id, performanceData.campaignId, performanceData.partyId, performanceData.electionType,
      performanceData.electionDate, performanceData.voteShare, performanceData.seatsWon,
      performanceData.seatsContested, performanceData.voterTurnoutImpact,
      JSON.stringify(performanceData.demographicPerformance || {}),
      JSON.stringify(performanceData.geographicPerformance || {}),
      JSON.stringify(performanceData.issuePerformance || {}),
      performanceData.campaignSpending || 0, performanceData.campaignStrategy,
      performanceData.electionOutcome, performanceData.postElectionAnalysis
    ]);

    return this.mapPartyElectoralPerformance(result.rows[0]);
  }

  /**
   * Get electoral trends and analysis
   */
  async getElectoralTrends(campaignId: number, partyId?: string): Promise<Record<string, any>> {
    let query = `
      SELECT 
        party_id,
        p.party_name,
        AVG(vote_share) as avg_vote_share,
        MAX(vote_share) as peak_vote_share,
        MIN(vote_share) as lowest_vote_share,
        SUM(seats_won) as total_seats_won,
        COUNT(*) as elections_participated,
        array_agg(election_outcome) as outcomes
      FROM party_electoral_performance pep
      JOIN political_parties p ON pep.party_id = p.id
      WHERE pep.campaign_id = $1
    `;
    const params: any[] = [campaignId];

    if (partyId) {
      query += ` AND pep.party_id = $2`;
      params.push(partyId);
    }

    query += ` GROUP BY party_id, p.party_name ORDER BY avg_vote_share DESC`;

    const result = await this.pool.query(query, params);

    return {
      electoralTrends: result.rows,
      analysisDate: new Date().toISOString(),
      totalElections: result.rows.length > 0 ? result.rows[0].elections_participated : 0
    };
  }

  // ===== COALITION MANAGEMENT =====

  /**
   * Create political coalition
   */
  async createCoalition(coalitionData: {
    campaignId: number;
    coalitionName: string;
    coalitionType: string;
    memberParties: string[];
    coalitionAgreement?: string;
    policyPriorities?: string[];
    leadershipStructure?: Record<string, any>;
    expectedDuration?: string;
  }): Promise<PartyCoalition> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_coalitions (
        id, campaign_id, coalition_name, coalition_type, member_parties,
        coalition_agreement, policy_priorities, leadership_structure,
        formation_date, expected_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
      RETURNING *
    `, [
      id, coalitionData.campaignId, coalitionData.coalitionName, coalitionData.coalitionType,
      JSON.stringify(coalitionData.memberParties), coalitionData.coalitionAgreement,
      JSON.stringify(coalitionData.policyPriorities || []),
      JSON.stringify(coalitionData.leadershipStructure || {}), coalitionData.expectedDuration
    ]);

    return this.mapPartyCoalition(result.rows[0]);
  }

  /**
   * Get active coalitions
   */
  async getActiveCoalitions(campaignId: number): Promise<PartyCoalition[]> {
    const result = await this.pool.query(`
      SELECT * FROM party_coalitions 
      WHERE campaign_id = $1 AND status IN ('forming', 'active')
      ORDER BY formation_date DESC
    `, [campaignId]);

    return result.rows.map(row => this.mapPartyCoalition(row));
  }

  /**
   * Update coalition status
   */
  async updateCoalitionStatus(
    coalitionId: string,
    status: 'forming' | 'active' | 'strained' | 'dissolved',
    statusReason?: string
  ): Promise<PartyCoalition> {
    const result = await this.pool.query(`
      UPDATE party_coalitions 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, coalitionId]);

    if (result.rows.length === 0) {
      throw new Error(`Coalition ${coalitionId} not found`);
    }

    return this.mapPartyCoalition(result.rows[0]);
  }

  // ===== PARTY EVENTS =====

  /**
   * Create party event
   */
  async createPartyEvent(eventData: {
    campaignId: number;
    partyId: string;
    eventType: string;
    eventTitle: string;
    eventDescription?: string;
    eventDate: Date;
    location?: string;
    expectedAttendance?: number;
    keySpeakers?: string[];
    eventAgenda?: any[];
    mediaCoverage?: boolean;
    witterCoverage?: boolean;
  }): Promise<PartyEvent> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO party_events (
        id, campaign_id, party_id, event_type, event_title, event_description,
        event_date, location, expected_attendance, key_speakers, event_agenda,
        media_coverage, witter_coverage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      id, eventData.campaignId, eventData.partyId, eventData.eventType,
      eventData.eventTitle, eventData.eventDescription, eventData.eventDate,
      eventData.location, eventData.expectedAttendance,
      JSON.stringify(eventData.keySpeakers || []), JSON.stringify(eventData.eventAgenda || []),
      eventData.mediaCoverage ?? false, eventData.witterCoverage ?? true
    ]);

    return this.mapPartyEvent(result.rows[0]);
  }

  /**
   * Get upcoming party events
   */
  async getUpcomingPartyEvents(campaignId: number, limit: number = 10): Promise<PartyEvent[]> {
    const result = await this.pool.query(`
      SELECT pe.*, p.party_name
      FROM party_events pe
      JOIN political_parties p ON pe.party_id = p.id
      WHERE pe.campaign_id = $1 AND pe.event_date > NOW()
      ORDER BY pe.event_date ASC
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => this.mapPartyEvent(row));
  }

  // ===== ANALYTICS & DASHBOARD =====

  /**
   * Get comprehensive political party dashboard
   */
  async getPoliticalPartyDashboard(campaignId: number): Promise<Record<string, any>> {
    const [
      parties,
      recentActivity,
      coalitions,
      upcomingEvents,
      electoralTrends
    ] = await Promise.all([
      this.getEnhancedPoliticalParties(campaignId),
      this.getRecentPoliticalWitterActivity(campaignId, 10),
      this.getActiveCoalitions(campaignId),
      this.getUpcomingPartyEvents(campaignId, 5),
      this.getElectoralTrends(campaignId)
    ]);

    return {
      totalParties: parties.length,
      activeCoalitions: coalitions.length,
      recentWitterPosts: recentActivity.length,
      upcomingEvents: upcomingEvents.length,
      partyBreakdown: parties.map(p => ({
        name: p.partyName,
        support: p.supportBase,
        ideology: p.ideology,
        handle: p.witterHandle
      })),
      coalitionSummary: coalitions.map(c => ({
        name: c.coalitionName,
        type: c.coalitionType,
        members: c.memberParties.length,
        approval: c.publicApproval
      })),
      electoralOverview: electoralTrends,
      lastUpdated: new Date()
    };
  }

  // ===== MAPPING FUNCTIONS =====

  private mapEnhancedPoliticalParty(row: any): EnhancedPoliticalParty {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyName: row.party_name,
      ideology: row.ideology,
      supportBase: parseFloat(row.support_base),
      witterHandle: row.witter_handle,
      partyBackstory: row.party_backstory,
      foundingDate: row.founding_date ? new Date(row.founding_date) : undefined,
      keyHistoricalEvents: row.key_historical_events || [],
      currentLeadershipStructure: row.current_leadership_structure || {},
      membershipDemographics: row.membership_demographics || {},
      electoralHistory: row.electoral_history || [],
      fundraisingData: row.fundraising_data || {},
      mediaStrategy: row.media_strategy || {},
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapPartyLeadership(row: any): PartyLeadership {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyId: row.party_id,
      leadershipPosition: row.leadership_position,
      leaderName: row.leader_name,
      appointmentDate: new Date(row.appointment_date),
      leadershipStyle: row.leadership_style,
      approvalRating: parseFloat(row.approval_rating),
      specialization: row.specialization,
      politicalBackground: row.political_background,
      leadershipPriorities: row.leadership_priorities,
      publicStatements: row.public_statements,
      mediaAppearances: row.media_appearances,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapPartyPolicyPosition(row: any): PartyPolicyPosition {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyId: row.party_id,
      policyArea: row.policy_area,
      policyTopic: row.policy_topic,
      positionSummary: row.position_summary,
      detailedPosition: row.detailed_position,
      positionStrength: row.position_strength,
      flexibilityLevel: row.flexibility_level,
      publicMessaging: row.public_messaging,
      supportingArguments: row.supporting_arguments,
      policyEvolution: row.policy_evolution,
      lastUpdated: new Date(row.last_updated),
      createdAt: new Date(row.created_at)
    };
  }

  private mapPartyWitterActivity(row: any): PartyWitterActivity {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyId: row.party_id,
      accountType: row.account_type,
      accountHandle: row.account_handle,
      postType: row.post_type,
      postContent: row.post_content,
      hashtags: row.hashtags,
      mentions: row.mentions,
      engagementMetrics: row.engagement_metrics,
      responseToPostId: row.response_to_post_id,
      politicalContext: row.political_context,
      messagingStrategy: row.messaging_strategy,
      postDate: new Date(row.post_date),
      createdAt: new Date(row.created_at)
    };
  }

  private mapPartyElectoralPerformance(row: any): PartyElectoralPerformance {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyId: row.party_id,
      electionType: row.election_type,
      electionDate: new Date(row.election_date),
      voteShare: parseFloat(row.vote_share),
      seatsWon: row.seats_won,
      seatsContested: row.seats_contested,
      voterTurnoutImpact: row.voter_turnout_impact ? parseFloat(row.voter_turnout_impact) : undefined,
      demographicPerformance: row.demographic_performance,
      geographicPerformance: row.geographic_performance,
      issuePerformance: row.issue_performance,
      campaignSpending: parseInt(row.campaign_spending),
      campaignStrategy: row.campaign_strategy,
      electionOutcome: row.election_outcome,
      postElectionAnalysis: row.post_election_analysis,
      createdAt: new Date(row.created_at)
    };
  }

  private mapPartyCoalition(row: any): PartyCoalition {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      coalitionName: row.coalition_name,
      coalitionType: row.coalition_type,
      memberParties: row.member_parties,
      coalitionAgreement: row.coalition_agreement,
      policyPriorities: row.policy_priorities,
      leadershipStructure: row.leadership_structure,
      formationDate: new Date(row.formation_date),
      expectedDuration: row.expected_duration,
      successMetrics: row.success_metrics,
      internalTensions: row.internal_tensions,
      publicApproval: parseFloat(row.public_approval),
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapPartyEvent(row: any): PartyEvent {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      partyId: row.party_id,
      eventType: row.event_type,
      eventTitle: row.event_title,
      eventDescription: row.event_description,
      eventDate: new Date(row.event_date),
      location: row.location,
      expectedAttendance: row.expected_attendance,
      actualAttendance: row.actual_attendance,
      keySpeakers: row.key_speakers,
      eventAgenda: row.event_agenda,
      mediaCoverage: row.media_coverage,
      witterCoverage: row.witter_coverage,
      eventOutcomes: row.event_outcomes,
      publicReception: row.public_reception,
      fundraisingTotal: parseInt(row.fundraising_total),
      createdAt: new Date(row.created_at)
    };
  }
}
