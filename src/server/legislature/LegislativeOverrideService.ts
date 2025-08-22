import { Pool } from 'pg';
import { nanoid } from 'nanoid';

/**
 * Legislative Override Service
 * Handles leader's ability to override legislative votes and decisions
 */

export interface LegislativeOverride {
  id: string;
  proposalId: string;
  campaignId: number;
  leaderCharacterId: string;
  originalVoteResult: 'passed' | 'failed' | 'tied';
  overrideDecision: 'approve' | 'veto' | 'modify';
  overrideReason: string;
  overrideJustification: string;
  politicalCost: number;
  publicApprovalImpact: number;
  partyRelationsImpact: Record<string, number>;
  constitutionalBasis: string;
  legalPrecedent?: string;
  modifications?: string;
  implementationNotes?: string;
  effectiveDate: Date;
  status: 'pending' | 'active' | 'challenged' | 'upheld' | 'reversed';
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
  proposalId: string;
  campaignId: number;
  leaderCharacterId: string;
  overrideDecision: 'approve' | 'veto' | 'modify';
  overrideReason: string;
  overrideJustification: string;
  constitutionalBasis: string;
  legalPrecedent?: string;
  modifications?: string;
  implementationNotes?: string;
}

export interface OverrideAnalysis {
  politicalFeasibility: number; // 0-100
  constitutionalValidity: number; // 0-100
  publicSupportEstimate: number; // 0-100
  partyReactionPrediction: Record<string, number>;
  politicalCostAssessment: number; // 0-100
  recommendedAction: 'proceed' | 'modify' | 'abandon';
  riskFactors: string[];
  supportingArguments: string[];
  potentialChallenges: string[];
  precedentAnalysis: string[];
}

export class LegislativeOverrideService {
  constructor(private pool: Pool) {}

  /**
   * Analyze the feasibility and consequences of a legislative override
   */
  async analyzeOverride(
    proposalId: string,
    campaignId: number,
    leaderCharacterId: string,
    overrideType: 'approve' | 'veto' | 'modify'
  ): Promise<OverrideAnalysis> {
    // Get proposal details
    const proposal = await this.getProposal(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Get latest vote results
    const latestVote = await this.getLatestVote(proposalId);
    if (!latestVote) {
      throw new Error('No vote found for this proposal');
    }

    // Get leader's political standing
    const leaderStanding = await this.getLeaderPoliticalStanding(leaderCharacterId, campaignId);
    
    // Get party compositions and relationships
    const partyData = await this.getPartyRelationships(campaignId);

    // Calculate political feasibility
    const politicalFeasibility = this.calculatePoliticalFeasibility(
      proposal, latestVote, leaderStanding, overrideType
    );

    // Calculate constitutional validity
    const constitutionalValidity = this.calculateConstitutionalValidity(
      proposal, overrideType, leaderStanding.governmentType
    );

    // Estimate public support
    const publicSupportEstimate = this.estimatePublicSupport(
      proposal, latestVote, overrideType, leaderStanding.approvalRating
    );

    // Predict party reactions
    const partyReactionPrediction = this.predictPartyReactions(
      proposal, latestVote, overrideType, partyData, leaderStanding
    );

    // Assess political cost
    const politicalCostAssessment = this.assessPoliticalCost(
      overrideType, politicalFeasibility, publicSupportEstimate, partyReactionPrediction
    );

    // Generate recommendations
    const recommendedAction = this.generateRecommendation(
      politicalFeasibility, constitutionalValidity, publicSupportEstimate, politicalCostAssessment
    );

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(
      proposal, overrideType, politicalFeasibility, constitutionalValidity, publicSupportEstimate
    );

    // Generate supporting arguments
    const supportingArguments = this.generateSupportingArguments(
      proposal, overrideType, leaderStanding
    );

    // Identify potential challenges
    const potentialChallenges = this.identifyPotentialChallenges(
      proposal, overrideType, partyData, constitutionalValidity
    );

    // Analyze precedents
    const precedentAnalysis = await this.analyzePrecedents(overrideType, proposal.policyCategory);

    return {
      politicalFeasibility,
      constitutionalValidity,
      publicSupportEstimate,
      partyReactionPrediction,
      politicalCostAssessment,
      recommendedAction,
      riskFactors,
      supportingArguments,
      potentialChallenges,
      precedentAnalysis
    };
  }

  /**
   * Execute a legislative override
   */
  async executeOverride(request: OverrideRequest): Promise<LegislativeOverride> {
    // Validate the override request
    await this.validateOverrideRequest(request);

    // Get the original vote result
    const latestVote = await this.getLatestVote(request.proposalId);
    if (!latestVote) {
      throw new Error('No vote found for this proposal');
    }

    // Perform override analysis to calculate impacts
    const analysis = await this.analyzeOverride(
      request.proposalId,
      request.campaignId,
      request.leaderCharacterId,
      request.overrideDecision
    );

    // Calculate specific impacts
    const politicalCost = analysis.politicalCostAssessment;
    const publicApprovalImpact = this.calculatePublicApprovalImpact(
      request.overrideDecision,
      analysis.publicSupportEstimate
    );
    const partyRelationsImpact = this.calculatePartyRelationsImpact(
      analysis.partyReactionPrediction
    );

    // Create the override record
    const override: LegislativeOverride = {
      id: nanoid(),
      proposalId: request.proposalId,
      campaignId: request.campaignId,
      leaderCharacterId: request.leaderCharacterId,
      originalVoteResult: latestVote.voteResult,
      overrideDecision: request.overrideDecision,
      overrideReason: request.overrideReason,
      overrideJustification: request.overrideJustification,
      politicalCost,
      publicApprovalImpact,
      partyRelationsImpact,
      constitutionalBasis: request.constitutionalBasis,
      legalPrecedent: request.legalPrecedent,
      modifications: request.modifications,
      implementationNotes: request.implementationNotes,
      effectiveDate: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store the override in database
    await this.storeOverride(override);

    // Update the proposal status based on override decision
    await this.updateProposalStatus(request.proposalId, request.overrideDecision, override.id);

    // Apply political consequences
    await this.applyPoliticalConsequences(override);

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
    limit: number = 20
  ): Promise<LegislativeOverride[]> {
    const query = `
      SELECT * FROM legislative_overrides 
      WHERE leader_character_id = $1 AND campaign_id = $2 
      ORDER BY created_at DESC 
      LIMIT $3
    `;

    const result = await this.pool.query(query, [leaderCharacterId, campaignId, limit]);
    return result.rows.map(this.mapOverrideFromDb);
  }

  /**
   * Get override by ID
   */
  async getOverrideById(overrideId: string): Promise<LegislativeOverride | null> {
    const query = 'SELECT * FROM legislative_overrides WHERE id = $1';
    const result = await this.pool.query(query, [overrideId]);
    
    if (result.rows.length === 0) return null;
    return this.mapOverrideFromDb(result.rows[0]);
  }

  /**
   * Challenge an override (for opposition parties or judicial review)
   */
  async challengeOverride(
    overrideId: string,
    challenger: string,
    challengeReason: string
  ): Promise<LegislativeOverride> {
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
      UPDATE legislative_overrides 
      SET status = 'challenged', challenge_details = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.pool.query(query, [JSON.stringify(challengeDetails), overrideId]);
    return this.mapOverrideFromDb(result.rows[0]);
  }

  /**
   * Resolve a challenged override
   */
  async resolveChallengedOverride(
    overrideId: string,
    resolution: 'upheld' | 'reversed',
    resolutionDetails: string
  ): Promise<LegislativeOverride> {
    const override = await this.getOverrideById(overrideId);
    if (!override) {
      throw new Error('Override not found');
    }

    if (override.status !== 'challenged') {
      throw new Error('Override is not currently challenged');
    }

    const updatedChallengeDetails = {
      ...override.challengeDetails!,
      resolution: resolutionDetails,
      resolutionDate: new Date()
    };

    const query = `
      UPDATE legislative_overrides 
      SET status = $1, challenge_details = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      resolution, 
      JSON.stringify(updatedChallengeDetails), 
      overrideId
    ]);

    // If override was reversed, revert the proposal status
    if (resolution === 'reversed') {
      await this.revertProposalStatus(override.proposalId, override.originalVoteResult);
    }

    return this.mapOverrideFromDb(result.rows[0]);
  }

  // Private helper methods

  private async validateOverrideRequest(request: OverrideRequest): Promise<void> {
    // Check if proposal exists
    const proposal = await this.getProposal(request.proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Check if proposal is in a state that can be overridden
    const validStatuses = ['passed', 'failed', 'leader_review'];
    if (!validStatuses.includes(proposal.status)) {
      throw new Error(`Cannot override proposal with status: ${proposal.status}`);
    }

    // Check if there's already an active override for this proposal
    const existingOverride = await this.getActiveOverrideForProposal(request.proposalId);
    if (existingOverride) {
      throw new Error('An active override already exists for this proposal');
    }

    // Validate override decision
    if (!['approve', 'veto', 'modify'].includes(request.overrideDecision)) {
      throw new Error('Invalid override decision');
    }

    // Ensure modification details are provided if decision is 'modify'
    if (request.overrideDecision === 'modify' && !request.modifications) {
      throw new Error('Modifications must be specified when override decision is modify');
    }
  }

  private async getProposal(proposalId: string): Promise<any> {
    const query = 'SELECT * FROM legislative_proposals WHERE id = $1';
    const result = await this.pool.query(query, [proposalId]);
    return result.rows[0] || null;
  }

  private async getLatestVote(proposalId: string): Promise<any> {
    const query = `
      SELECT * FROM legislative_votes 
      WHERE proposal_id = $1 
      ORDER BY vote_date DESC 
      LIMIT 1
    `;
    const result = await this.pool.query(query, [proposalId]);
    return result.rows[0] || null;
  }

  private async getLeaderPoliticalStanding(leaderCharacterId: string, campaignId: number): Promise<any> {
    // This would normally query leader stats, approval ratings, etc.
    // For now, return mock data
    return {
      approvalRating: 65,
      governmentType: 'democratic',
      partyAffiliation: 'majority',
      politicalCapital: 75,
      previousOverrides: 2
    };
  }

  private async getPartyRelationships(campaignId: number): Promise<any> {
    const query = 'SELECT * FROM political_parties WHERE campaign_id = $1';
    const result = await this.pool.query(query, [campaignId]);
    return result.rows;
  }

  private calculatePoliticalFeasibility(proposal: any, vote: any, standing: any, overrideType: string): number {
    let feasibility = standing.approvalRating;
    
    // Adjust based on override type
    if (overrideType === 'veto' && vote.voteResult === 'passed') {
      feasibility -= 15; // Vetoing popular legislation is harder
    } else if (overrideType === 'approve' && vote.voteResult === 'failed') {
      feasibility -= 10; // Approving rejected legislation has moderate difficulty
    }
    
    // Adjust based on political capital
    feasibility += (standing.politicalCapital - 50) * 0.3;
    
    // Adjust based on previous overrides (fatigue factor)
    feasibility -= standing.previousOverrides * 5;
    
    return Math.max(0, Math.min(100, feasibility));
  }

  private calculateConstitutionalValidity(proposal: any, overrideType: string, governmentType: string): number {
    let validity = 85; // Base constitutional validity
    
    // Adjust based on government type
    if (governmentType === 'democratic') {
      if (overrideType === 'veto') validity += 10; // Veto power is typically constitutional
      if (overrideType === 'approve') validity -= 5; // Overriding legislature is less constitutional
    }
    
    // Adjust based on proposal type
    if (proposal.proposalType === 'constitutional_amendment') {
      validity -= 20; // Much harder to override constitutional amendments
    }
    
    return Math.max(0, Math.min(100, validity));
  }

  private estimatePublicSupport(proposal: any, vote: any, overrideType: string, leaderApproval: number): number {
    let support = proposal.publicSupportEstimate || 50;
    
    // Adjust based on vote result vs override decision
    if (overrideType === 'approve' && vote.voteResult === 'failed') {
      support -= 15; // Public may not like overriding their representatives
    } else if (overrideType === 'veto' && vote.voteResult === 'passed') {
      support -= 20; // Public may strongly oppose vetoing passed legislation
    }
    
    // Adjust based on leader approval
    support += (leaderApproval - 50) * 0.2;
    
    return Math.max(0, Math.min(100, support));
  }

  private predictPartyReactions(proposal: any, vote: any, overrideType: string, parties: any[], standing: any): Record<string, number> {
    const reactions: Record<string, number> = {};
    
    parties.forEach(party => {
      let reaction = 0;
      
      // Base reaction based on party alignment with leader
      if (party.partyName === standing.partyAffiliation) {
        reaction += 20; // Same party generally supports
      } else {
        reaction -= 15; // Opposition parties generally oppose
      }
      
      // Adjust based on party's likely position on the proposal
      if (party.ideology === 'progressive' && proposal.policyCategory === 'social') {
        reaction += overrideType === 'approve' ? 15 : -15;
      } else if (party.ideology === 'conservative' && proposal.policyCategory === 'economic') {
        reaction += overrideType === 'approve' ? 15 : -15;
      }
      
      reactions[party.partyName] = Math.max(-50, Math.min(50, reaction));
    });
    
    return reactions;
  }

  private assessPoliticalCost(
    overrideType: string,
    feasibility: number,
    publicSupport: number,
    partyReactions: Record<string, number>
  ): number {
    let cost = 100 - feasibility; // Base cost is inverse of feasibility
    
    // Adjust based on public support
    cost += (50 - publicSupport) * 0.3;
    
    // Adjust based on average party reaction
    const avgReaction = Object.values(partyReactions).reduce((sum, r) => sum + r, 0) / Object.values(partyReactions).length;
    cost += Math.abs(avgReaction) * 0.2;
    
    // Override type specific costs
    if (overrideType === 'veto') cost += 5;
    if (overrideType === 'modify') cost += 10; // Modification is most complex
    
    return Math.max(0, Math.min(100, cost));
  }

  private generateRecommendation(
    feasibility: number,
    validity: number,
    publicSupport: number,
    cost: number
  ): 'proceed' | 'modify' | 'abandon' {
    const overallScore = (feasibility + validity + publicSupport - cost) / 4;
    
    if (overallScore > 60) return 'proceed';
    if (overallScore > 30) return 'modify';
    return 'abandon';
  }

  private identifyRiskFactors(
    proposal: any,
    overrideType: string,
    feasibility: number,
    validity: number,
    publicSupport: number
  ): string[] {
    const risks: string[] = [];
    
    if (feasibility < 40) risks.push('Low political feasibility - may face strong opposition');
    if (validity < 60) risks.push('Constitutional challenges likely');
    if (publicSupport < 35) risks.push('Significant public backlash expected');
    if (overrideType === 'modify') risks.push('Implementation complexity may cause delays');
    if (proposal.urgencyLevel === 'emergency') risks.push('Time pressure may limit thorough review');
    
    return risks;
  }

  private generateSupportingArguments(proposal: any, overrideType: string, standing: any): string[] {
    const supportingArgs: string[] = [];
    
    if (overrideType === 'approve') {
      supportingArgs.push('Executive leadership necessary for national priorities');
      supportingArgs.push('Legislative process may have overlooked critical factors');
    } else if (overrideType === 'veto') {
      supportingArgs.push('Constitutional duty to prevent harmful legislation');
      supportingArgs.push('Protecting long-term national interests');
    } else if (overrideType === 'modify') {
      supportingArgs.push('Collaborative approach balancing legislative intent with executive expertise');
      supportingArgs.push('Addressing implementation concerns while respecting democratic process');
    }
    
    if (standing.approvalRating > 60) {
      supportingArgs.push('Strong public mandate supports executive action');
    }
    
    return supportingArgs;
  }

  private identifyPotentialChallenges(
    proposal: any,
    overrideType: string,
    parties: any[],
    validity: number
  ): string[] {
    const challenges: string[] = [];
    
    if (validity < 70) {
      challenges.push('Judicial review and potential court challenges');
    }
    
    const oppositionParties = parties.filter(p => p.partyName !== 'majority');
    if (oppositionParties.length > 0) {
      challenges.push('Opposition party mobilization and public campaigns');
    }
    
    if (overrideType === 'veto') {
      challenges.push('Legislative attempts to override the veto');
    }
    
    challenges.push('Media scrutiny and public debate');
    challenges.push('Potential impact on future legislative cooperation');
    
    return challenges;
  }

  private async analyzePrecedents(overrideType: string, policyCategory: string): Promise<string[]> {
    // In a real implementation, this would query historical override data
    const precedents: string[] = [];
    
    precedents.push(`Historical ${overrideType} actions in ${policyCategory} policy typically result in...`);
    precedents.push('Similar overrides have faced constitutional challenges in 60% of cases');
    precedents.push('Average political cost for this type of override is moderate to high');
    
    return precedents;
  }

  private calculatePublicApprovalImpact(overrideDecision: string, publicSupport: number): number {
    let impact = 0;
    
    if (overrideDecision === 'approve' && publicSupport > 60) {
      impact = 5; // Positive impact for popular approvals
    } else if (overrideDecision === 'veto' && publicSupport < 40) {
      impact = 3; // Small positive impact for vetoing unpopular legislation
    } else if (overrideDecision === 'veto' && publicSupport > 60) {
      impact = -8; // Negative impact for vetoing popular legislation
    } else if (overrideDecision === 'approve' && publicSupport < 40) {
      impact = -5; // Negative impact for approving unpopular legislation
    }
    
    return impact;
  }

  private calculatePartyRelationsImpact(partyReactions: Record<string, number>): Record<string, number> {
    const impact: Record<string, number> = {};
    
    Object.entries(partyReactions).forEach(([party, reaction]) => {
      // Convert reaction to relationship impact
      impact[party] = reaction * 0.1; // Scale down the impact
    });
    
    return impact;
  }

  private async storeOverride(override: LegislativeOverride): Promise<void> {
    const query = `
      INSERT INTO legislative_overrides (
        id, proposal_id, campaign_id, leader_character_id, original_vote_result,
        override_decision, override_reason, override_justification, political_cost,
        public_approval_impact, party_relations_impact, constitutional_basis,
        legal_precedent, modifications, implementation_notes, effective_date,
        status, challenge_details, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `;

    await this.pool.query(query, [
      override.id,
      override.proposalId,
      override.campaignId,
      override.leaderCharacterId,
      override.originalVoteResult,
      override.overrideDecision,
      override.overrideReason,
      override.overrideJustification,
      override.politicalCost,
      override.publicApprovalImpact,
      JSON.stringify(override.partyRelationsImpact),
      override.constitutionalBasis,
      override.legalPrecedent,
      override.modifications,
      override.implementationNotes,
      override.effectiveDate,
      override.status,
      override.challengeDetails ? JSON.stringify(override.challengeDetails) : null,
      override.createdAt,
      override.updatedAt
    ]);
  }

  private async updateProposalStatus(proposalId: string, overrideDecision: string, overrideId: string): Promise<void> {
    let newStatus: string;
    let leaderDecision: string;
    
    switch (overrideDecision) {
      case 'approve':
        newStatus = 'approved';
        leaderDecision = 'approve';
        break;
      case 'veto':
        newStatus = 'vetoed';
        leaderDecision = 'veto';
        break;
      case 'modify':
        newStatus = 'approved';
        leaderDecision = 'modify';
        break;
      default:
        throw new Error('Invalid override decision');
    }

    const query = `
      UPDATE legislative_proposals 
      SET status = $1, leader_decision = $2, leader_response = $3, decided_at = NOW(), updated_at = NOW()
      WHERE id = $4
    `;

    await this.pool.query(query, [
      newStatus,
      leaderDecision,
      `Legislative override executed (ID: ${overrideId})`,
      proposalId
    ]);
  }

  private async applyPoliticalConsequences(override: LegislativeOverride): Promise<void> {
    // Apply approval rating changes
    if (override.publicApprovalImpact !== 0) {
      await this.updateLeaderApproval(
        override.leaderCharacterId,
        override.campaignId,
        override.publicApprovalImpact
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

  private async logOverrideAction(override: LegislativeOverride): Promise<void> {
    const query = `
      INSERT INTO leader_action_log (
        id, leader_character_id, campaign_id, action_type, action_description,
        target_id, political_cost, approval_impact, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    await this.pool.query(query, [
      nanoid(),
      override.leaderCharacterId,
      override.campaignId,
      'legislative_override',
      `${override.overrideDecision.toUpperCase()}: ${override.overrideReason}`,
      override.proposalId,
      override.politicalCost,
      override.publicApprovalImpact,
      override.createdAt
    ]);
  }

  private async getActiveOverrideForProposal(proposalId: string): Promise<LegislativeOverride | null> {
    const query = `
      SELECT * FROM legislative_overrides 
      WHERE proposal_id = $1 AND status IN ('active', 'challenged')
      LIMIT 1
    `;
    const result = await this.pool.query(query, [proposalId]);
    return result.rows.length > 0 ? this.mapOverrideFromDb(result.rows[0]) : null;
  }

  private async revertProposalStatus(proposalId: string, originalVoteResult: string): Promise<void> {
    const newStatus = originalVoteResult === 'passed' ? 'passed' : 'failed';
    
    const query = `
      UPDATE legislative_proposals 
      SET status = $1, leader_decision = NULL, leader_response = 'Override reversed by judicial review', updated_at = NOW()
      WHERE id = $2
    `;

    await this.pool.query(query, [newStatus, proposalId]);
  }

  private async updateLeaderApproval(leaderCharacterId: string, campaignId: number, change: number): Promise<void> {
    // This would update leader approval ratings in the appropriate table
    console.log(`Leader ${leaderCharacterId} approval changed by ${change} points`);
  }

  private async updatePartyRelationship(campaignId: number, partyName: string, leaderCharacterId: string, change: number): Promise<void> {
    // This would update party relationship scores
    console.log(`Relationship with ${partyName} changed by ${change} points`);
  }

  private async updatePoliticalCapital(leaderCharacterId: string, campaignId: number, change: number): Promise<void> {
    // This would update leader's political capital
    console.log(`Political capital changed by ${change} points`);
  }

  private mapOverrideFromDb(row: any): LegislativeOverride {
    return {
      id: row.id,
      proposalId: row.proposal_id,
      campaignId: row.campaign_id,
      leaderCharacterId: row.leader_character_id,
      originalVoteResult: row.original_vote_result,
      overrideDecision: row.override_decision,
      overrideReason: row.override_reason,
      overrideJustification: row.override_justification,
      politicalCost: row.political_cost,
      publicApprovalImpact: row.public_approval_impact,
      partyRelationsImpact: JSON.parse(row.party_relations_impact || '{}'),
      constitutionalBasis: row.constitutional_basis,
      legalPrecedent: row.legal_precedent,
      modifications: row.modifications,
      implementationNotes: row.implementation_notes,
      effectiveDate: new Date(row.effective_date),
      status: row.status,
      challengeDetails: row.challenge_details ? JSON.parse(row.challenge_details) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
