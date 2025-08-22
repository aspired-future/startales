import { Pool } from 'pg';

export interface MediaOutlet {
  id: string;
  campaignId: number;
  outletName: string;
  outletType: string;
  ownershipStructure: string;
  primaryOwner?: string;
  governmentStake: number;
  credibilityRating: number;
  politicalBias: number;
  audienceReach: number;
  influenceScore: number;
  governmentLicenseStatus: string;
  licenseExpiryDate?: Date;
  complianceScore: number;
  governmentFunding: number;
  contentFocus: string[];
  targetDemographics: any;
  contentQualityScore: number;
  factCheckingStandards: string;
  status: string;
  employeesCount: number;
  journalistsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaPolicy {
  id: string;
  campaignId: number;
  policyName: string;
  policyType: string;
  description: string;
  legalAuthority?: string;
  enforcementMechanism?: string;
  appliesTo: string[];
  contentCategories: string[];
  geographicScope: string;
  controlIntensity: number;
  enforcementStrictness: number;
  penaltySeverity: string;
  implementationDate: Date;
  reviewDate?: Date;
  status: string;
  complianceRate: number;
  violationsCount: number;
  appealsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CensorshipLog {
  id: string;
  campaignId: number;
  outletId?: string;
  contentType: string;
  contentTitle?: string;
  contentSummary?: string;
  contentUrl?: string;
  actionType: string;
  censorshipReason: string;
  legalJustification?: string;
  decisionMaker?: string;
  decisionDate: Date;
  reviewStatus: string;
  sensitiveTopics: string[];
  affectedParties: string[];
  securityClassification: string;
  publicInterestScore: number;
  potentialHarmScore: number;
  democraticImpact: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropagandaCampaign {
  id: string;
  campaignId: number;
  campaignName: string;
  campaignType: string;
  description: string;
  primaryMessage: string;
  keyTalkingPoints: string[];
  targetAudience: string[];
  mediaChannels: string[];
  messagingStrategy?: string;
  contentThemes: string[];
  visualIdentity: any;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  spentBudget: number;
  targetReach: number;
  actualReach: number;
  engagementRate: number;
  messageRetention: number;
  publicApprovalChange: number;
  effectivenessScore: number;
  credibilityImpact: number;
  oppositionResponse?: string;
  internationalReaction?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PressConference {
  id: string;
  campaignId: number;
  title: string;
  description?: string;
  scheduledDate: Date;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  presenterType: 'leader_personal' | 'press_secretary' | 'cabinet_member' | 'spokesperson';
  presenterCharacterId?: string;
  presenterName: string;
  location: string;
  expectedAttendees: number;
  mediaOutletsInvited: string[];
  topics: string[];
  preparedStatements: string[];
  questionsAsked: number;
  questionsAnswered: number;
  hostileQuestions: number;
  followUpQuestions: number;
  mediaCoverageScore: number;
  publicReceptionScore: number;
  messageClarityScore: number;
  credibilityImpact: number;
  approvalRatingImpact: number;
  leaderPresenceBonus: number;
  authenticityScore: number;
  politicalRisk: number;
  journalistSatisfaction: number;
  transparencyPerception: number;
  accessQualityRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PressConferenceQuestion {
  id: string;
  pressConferenceId: string;
  questionNumber: number;
  journalistName: string;
  mediaOutlet: string;
  questionText: string;
  questionCategory?: 'policy' | 'personal' | 'scandal' | 'foreign_policy' | 'economy' | 'domestic' | 'follow_up' | 'hostile' | 'softball' | 'technical';
  answered: boolean;
  responseText?: string;
  responseQuality?: 'excellent' | 'good' | 'adequate' | 'poor' | 'evasive' | 'no_answer';
  responseDurationSeconds: number;
  questionDifficulty: number;
  publicInterestLevel: number;
  mediaFollowUpLikelihood: number;
  createdAt: Date;
}

export interface PressSecretary {
  id: string;
  campaignId: number;
  characterId: string;
  name: string;
  title: string;
  appointmentDate: Date;
  status: 'active' | 'resigned' | 'fired' | 'on_leave' | 'interim';
  communicationSkill: number;
  mediaRelationsSkill: number;
  crisisManagementSkill: number;
  policyKnowledge: number;
  charisma: number;
  pressConferencesHeld: number;
  averageApprovalRating: number;
  mediaRelationshipScore: number;
  controversyIncidents: number;
  successfulCrisisResponses: number;
  effectivenessVsLeader: number;
  credibilityVsLeader: number;
  mediaTrustVsLeader: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaControlKnobs {
  // Press Freedom and Control (1-6)
  pressFreedomLevel: number;
  censorshipIntensity: number;
  governmentMediaInfluence: number;
  propagandaEffectiveness: number;
  informationTransparency: number;
  journalistSafetyProtection: number;
  
  // Content and Editorial Control (7-12)
  editorialIndependence: number;
  contentDiversityPromotion: number;
  factCheckingEnforcement: number;
  misinformationCountermeasures: number;
  investigativeJournalismSupport: number;
  publicInterestPrioritization: number;
  
  // Regulatory and Legal Framework (13-18)
  licensingStrictness: number;
  ownershipConcentrationLimits: number;
  foreignMediaRestrictions: number;
  mediaFundingTransparency: number;
  regulatoryEnforcementConsistency: number;
  appealProcessFairness: number;
  
  // Crisis and Emergency Powers (19-24)
  emergencyBroadcastAuthority: number;
  crisisInformationControl: number;
  nationalSecurityExemptions: number;
  wartimeMediaRestrictions: number;
  publicSafetyOverrideAuthority: number;
  internationalMediaCoordination: number;
  // Press Conference Management (25-30)
  pressConferenceFrequency: number;
  leaderPersonalAppearanceRate: number;
  pressAccessLevel: number;
  questionScreeningIntensity: number;
  hostileQuestionManagement: number;
  messageCoordinationEffectiveness: number;
}

export interface MediaControlDashboard {
  overview: {
    totalOutlets: number;
    activeOutlets: number;
    governmentControlledOutlets: number;
    independentOutlets: number;
    averagePressFreedom: number;
    averageCredibility: number;
    totalAudienceReach: number;
    activePolicies: number;
    censorshipActions: number;
    propagandaCampaigns: number;
  };
  pressFreedomMetrics: {
    currentLevel: number;
    trend: string;
    internationalRanking: number;
    democraticImpact: number;
  };
  mediaLandscape: {
    outletsByType: Record<string, number>;
    outletsByOwnership: Record<string, number>;
    credibilityDistribution: Record<string, number>;
    politicalBiasSpectrum: Record<string, number>;
  };
  controlEffectiveness: {
    policyCompliance: number;
    censorshipSuccess: number;
    propagandaReach: number;
    publicTrustInMedia: number;
  };
}

export class MediaControlService {
  constructor(private pool: Pool) {}

  /**
   * Get comprehensive media control dashboard
   */
  async getDashboard(campaignId: number): Promise<MediaControlDashboard> {
    const client = await this.pool.connect();
    
    try {
      // Get outlet statistics
      const outletsStats = await client.query(`
        SELECT 
          COUNT(*) as total_outlets,
          COUNT(*) FILTER (WHERE status = 'active') as active_outlets,
          COUNT(*) FILTER (WHERE government_stake > 50) as government_controlled,
          COUNT(*) FILTER (WHERE government_stake <= 50) as independent,
          AVG(credibility_rating) as avg_credibility,
          SUM(audience_reach) as total_reach
        FROM media_outlets 
        WHERE campaign_id = $1
      `, [campaignId]);

      // Get policy statistics
      const policyStats = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'active') as active_policies,
          AVG(control_intensity) as avg_control_intensity
        FROM media_policies 
        WHERE campaign_id = $1
      `, [campaignId]);

      // Get censorship statistics
      const censorshipStats = await client.query(`
        SELECT 
          COUNT(*) as censorship_actions,
          AVG(democratic_impact) as avg_democratic_impact
        FROM censorship_logs 
        WHERE campaign_id = $1 
        AND decision_date >= CURRENT_DATE - INTERVAL '30 days'
      `, [campaignId]);

      // Get propaganda statistics
      const propagandaStats = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'active') as active_campaigns,
          AVG(effectiveness_score) as avg_effectiveness
        FROM propaganda_campaigns 
        WHERE campaign_id = $1
      `, [campaignId]);

      // Get outlet distribution
      const outletDistribution = await client.query(`
        SELECT 
          outlet_type,
          COUNT(*) as count
        FROM media_outlets 
        WHERE campaign_id = $1 AND status = 'active'
        GROUP BY outlet_type
      `, [campaignId]);

      const ownershipDistribution = await client.query(`
        SELECT 
          ownership_structure,
          COUNT(*) as count
        FROM media_outlets 
        WHERE campaign_id = $1 AND status = 'active'
        GROUP BY ownership_structure
      `, [campaignId]);

      // Get media control knobs for press freedom calculation
      const knobsResult = await client.query(`
        SELECT press_freedom_level, censorship_intensity, government_media_influence
        FROM media_control_knobs 
        WHERE campaign_id = $1
      `, [campaignId]);

      const knobs = knobsResult.rows[0] || {};
      const pressFreedomLevel = knobs.press_freedom_level || 0.75;
      const censorshipIntensity = knobs.censorship_intensity || 0.25;
      const governmentInfluence = knobs.government_media_influence || 0.30;

      // Calculate overall press freedom (0-100 scale)
      const overallPressFreedom = Math.round(
        (pressFreedomLevel * 0.5 + (1 - censorshipIntensity) * 0.3 + (1 - governmentInfluence) * 0.2) * 100
      );

      const stats = outletsStats.rows[0];
      const policies = policyStats.rows[0];
      const censorship = censorshipStats.rows[0];
      const propaganda = propagandaStats.rows[0];

      return {
        overview: {
          totalOutlets: parseInt(stats.total_outlets) || 0,
          activeOutlets: parseInt(stats.active_outlets) || 0,
          governmentControlledOutlets: parseInt(stats.government_controlled) || 0,
          independentOutlets: parseInt(stats.independent) || 0,
          averagePressFreedom: overallPressFreedom,
          averageCredibility: Math.round((parseFloat(stats.avg_credibility) || 0.75) * 100),
          totalAudienceReach: parseInt(stats.total_reach) || 0,
          activePolicies: parseInt(policies.active_policies) || 0,
          censorshipActions: parseInt(censorship.censorship_actions) || 0,
          propagandaCampaigns: parseInt(propaganda.active_campaigns) || 0
        },
        pressFreedomMetrics: {
          currentLevel: overallPressFreedom,
          trend: this.calculateTrend(overallPressFreedom),
          internationalRanking: this.calculateInternationalRanking(overallPressFreedom),
          democraticImpact: Math.round((parseFloat(censorship.avg_democratic_impact) || 0.5) * 100)
        },
        mediaLandscape: {
          outletsByType: this.formatDistribution(outletDistribution.rows),
          outletsByOwnership: this.formatDistribution(ownershipDistribution.rows),
          credibilityDistribution: this.calculateCredibilityDistribution(parseFloat(stats.avg_credibility) || 0.75),
          politicalBiasSpectrum: await this.calculateBiasSpectrum(campaignId)
        },
        controlEffectiveness: {
          policyCompliance: Math.round((parseFloat(policies.avg_control_intensity) || 0.5) * 100),
          censorshipSuccess: Math.round(((1 - (parseFloat(censorship.avg_democratic_impact) || 0.5)) * 100)),
          propagandaReach: Math.round((parseFloat(propaganda.avg_effectiveness) || 0.5) * 100),
          publicTrustInMedia: Math.round((pressFreedomLevel * 0.6 + (1 - censorshipIntensity) * 0.4) * 100)
        }
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get all media outlets for a campaign
   */
  async getMediaOutlets(campaignId: number): Promise<MediaOutlet[]> {
    const result = await this.pool.query(`
      SELECT 
        id, campaign_id, outlet_name, outlet_type, ownership_structure, primary_owner,
        government_stake, credibility_rating, political_bias, audience_reach, influence_score,
        government_license_status, license_expiry_date, compliance_score, government_funding,
        content_focus, target_demographics, content_quality_score, fact_checking_standards,
        status, employees_count, journalists_count, created_at, updated_at
      FROM media_outlets 
      WHERE campaign_id = $1 
      ORDER BY audience_reach DESC, influence_score DESC
    `, [campaignId]);

    return result.rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      outletName: row.outlet_name,
      outletType: row.outlet_type,
      ownershipStructure: row.ownership_structure,
      primaryOwner: row.primary_owner,
      governmentStake: parseFloat(row.government_stake),
      credibilityRating: parseFloat(row.credibility_rating),
      politicalBias: parseFloat(row.political_bias),
      audienceReach: row.audience_reach,
      influenceScore: parseFloat(row.influence_score),
      governmentLicenseStatus: row.government_license_status,
      licenseExpiryDate: row.license_expiry_date,
      complianceScore: parseFloat(row.compliance_score),
      governmentFunding: parseFloat(row.government_funding),
      contentFocus: row.content_focus,
      targetDemographics: row.target_demographics,
      contentQualityScore: parseFloat(row.content_quality_score),
      factCheckingStandards: row.fact_checking_standards,
      status: row.status,
      employeesCount: row.employees_count,
      journalistsCount: row.journalists_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Get media policies for a campaign
   */
  async getMediaPolicies(campaignId: number): Promise<MediaPolicy[]> {
    const result = await this.pool.query(`
      SELECT 
        id, campaign_id, policy_name, policy_type, description, legal_authority,
        enforcement_mechanism, applies_to, content_categories, geographic_scope,
        control_intensity, enforcement_strictness, penalty_severity,
        implementation_date, review_date, status, compliance_rate,
        violations_count, appeals_count, created_at, updated_at
      FROM media_policies 
      WHERE campaign_id = $1 
      ORDER BY implementation_date DESC
    `, [campaignId]);

    return result.rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      policyName: row.policy_name,
      policyType: row.policy_type,
      description: row.description,
      legalAuthority: row.legal_authority,
      enforcementMechanism: row.enforcement_mechanism,
      appliesTo: row.applies_to,
      contentCategories: row.content_categories,
      geographicScope: row.geographic_scope,
      controlIntensity: parseFloat(row.control_intensity),
      enforcementStrictness: parseFloat(row.enforcement_strictness),
      penaltySeverity: row.penalty_severity,
      implementationDate: row.implementation_date,
      reviewDate: row.review_date,
      status: row.status,
      complianceRate: parseFloat(row.compliance_rate),
      violationsCount: row.violations_count,
      appealsCount: row.appeals_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Get recent censorship actions
   */
  async getCensorshipLogs(campaignId: number, limit: number = 50): Promise<CensorshipLog[]> {
    const result = await this.pool.query(`
      SELECT 
        cl.*, mo.outlet_name
      FROM censorship_logs cl
      LEFT JOIN media_outlets mo ON cl.outlet_id = mo.id
      WHERE cl.campaign_id = $1 
      ORDER BY cl.decision_date DESC 
      LIMIT $2
    `, [campaignId, limit]);

    return result.rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      outletId: row.outlet_id,
      contentType: row.content_type,
      contentTitle: row.content_title,
      contentSummary: row.content_summary,
      contentUrl: row.content_url,
      actionType: row.action_type,
      censorshipReason: row.censorship_reason,
      legalJustification: row.legal_justification,
      decisionMaker: row.decision_maker,
      decisionDate: row.decision_date,
      reviewStatus: row.review_status,
      sensitiveTopics: row.sensitive_topics,
      affectedParties: row.affected_parties,
      securityClassification: row.security_classification,
      publicInterestScore: parseFloat(row.public_interest_score),
      potentialHarmScore: parseFloat(row.potential_harm_score),
      democraticImpact: parseFloat(row.democratic_impact),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Get propaganda campaigns
   */
  async getPropagandaCampaigns(campaignId: number): Promise<PropagandaCampaign[]> {
    const result = await this.pool.query(`
      SELECT * FROM propaganda_campaigns 
      WHERE campaign_id = $1 
      ORDER BY start_date DESC
    `, [campaignId]);

    return result.rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      campaignName: row.campaign_name,
      campaignType: row.campaign_type,
      description: row.description,
      primaryMessage: row.primary_message,
      keyTalkingPoints: row.key_talking_points,
      targetAudience: row.target_audience,
      mediaChannels: row.media_channels,
      messagingStrategy: row.messaging_strategy,
      contentThemes: row.content_themes,
      visualIdentity: row.visual_identity,
      startDate: row.start_date,
      endDate: row.end_date,
      totalBudget: parseFloat(row.total_budget),
      spentBudget: parseFloat(row.spent_budget),
      targetReach: row.target_reach,
      actualReach: row.actual_reach,
      engagementRate: parseFloat(row.engagement_rate),
      messageRetention: parseFloat(row.message_retention),
      publicApprovalChange: parseFloat(row.public_approval_change),
      effectivenessScore: parseFloat(row.effectiveness_score),
      credibilityImpact: parseFloat(row.credibility_impact),
      oppositionResponse: row.opposition_response,
      internationalReaction: row.international_reaction,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Get media control knobs for a campaign
   */
  async getMediaControlKnobs(campaignId: number): Promise<MediaControlKnobs> {
    const result = await this.pool.query(`
      SELECT * FROM media_control_knobs WHERE campaign_id = $1
    `, [campaignId]);

    const row = result.rows[0];
    if (!row) {
      // Return default values if no knobs exist
      return {
        pressFreedomLevel: 0.75,
        censorshipIntensity: 0.25,
        governmentMediaInfluence: 0.30,
        propagandaEffectiveness: 0.50,
        informationTransparency: 0.70,
        journalistSafetyProtection: 0.80,
        editorialIndependence: 0.65,
        contentDiversityPromotion: 0.60,
        factCheckingEnforcement: 0.70,
        misinformationCountermeasures: 0.55,
        investigativeJournalismSupport: 0.50,
        publicInterestPrioritization: 0.60,
        licensingStrictness: 0.40,
        ownershipConcentrationLimits: 0.50,
        foreignMediaRestrictions: 0.30,
        mediaFundingTransparency: 0.65,
        regulatoryEnforcementConsistency: 0.70,
        appealProcessFairness: 0.75,
        emergencyBroadcastAuthority: 0.60,
        crisisInformationControl: 0.45,
        nationalSecurityExemptions: 0.40,
        wartimeMediaRestrictions: 0.35,
        publicSafetyOverrideAuthority: 0.50,
        internationalMediaCoordination: 0.45
      };
    }

    return {
      pressFreedomLevel: parseFloat(row.press_freedom_level),
      censorshipIntensity: parseFloat(row.censorship_intensity),
      governmentMediaInfluence: parseFloat(row.government_media_influence),
      propagandaEffectiveness: parseFloat(row.propaganda_effectiveness),
      informationTransparency: parseFloat(row.information_transparency),
      journalistSafetyProtection: parseFloat(row.journalist_safety_protection),
      editorialIndependence: parseFloat(row.editorial_independence),
      contentDiversityPromotion: parseFloat(row.content_diversity_promotion),
      factCheckingEnforcement: parseFloat(row.fact_checking_enforcement),
      misinformationCountermeasures: parseFloat(row.misinformation_countermeasures),
      investigativeJournalismSupport: parseFloat(row.investigative_journalism_support),
      publicInterestPrioritization: parseFloat(row.public_interest_prioritization),
      licensingStrictness: parseFloat(row.licensing_strictness),
      ownershipConcentrationLimits: parseFloat(row.ownership_concentration_limits),
      foreignMediaRestrictions: parseFloat(row.foreign_media_restrictions),
      mediaFundingTransparency: parseFloat(row.media_funding_transparency),
      regulatoryEnforcementConsistency: parseFloat(row.regulatory_enforcement_consistency),
      appealProcessFairness: parseFloat(row.appeal_process_fairness),
      emergencyBroadcastAuthority: parseFloat(row.emergency_broadcast_authority),
      crisisInformationControl: parseFloat(row.crisis_information_control),
      nationalSecurityExemptions: parseFloat(row.national_security_exemptions),
      wartimeMediaRestrictions: parseFloat(row.wartime_media_restrictions),
      publicSafetyOverrideAuthority: parseFloat(row.public_safety_override_authority),
      internationalMediaCoordination: parseFloat(row.international_media_coordination),
      // Press Conference Management (25-30)
      pressConferenceFrequency: parseFloat(row.press_conference_frequency || '0.60'),
      leaderPersonalAppearanceRate: parseFloat(row.leader_personal_appearance_rate || '0.40'),
      pressAccessLevel: parseFloat(row.press_access_level || '0.70'),
      questionScreeningIntensity: parseFloat(row.question_screening_intensity || '0.30'),
      hostileQuestionManagement: parseFloat(row.hostile_question_management || '0.50'),
      messageCoordinationEffectiveness: parseFloat(row.message_coordination_effectiveness || '0.65')
    };
  }

  /**
   * Update media control knobs
   */
  async updateMediaControlKnobs(campaignId: number, knobs: Partial<MediaControlKnobs>): Promise<void> {
    const fields = Object.keys(knobs).map(key => 
      `${this.camelToSnake(key)} = $${Object.keys(knobs).indexOf(key) + 2}`
    ).join(', ');
    
    const values = [campaignId, ...Object.values(knobs), Date.now()];
    
    await this.pool.query(`
      UPDATE media_control_knobs 
      SET ${fields}, last_updated = $${values.length}, updated_at = NOW()
      WHERE campaign_id = $1
    `, values);
  }

  // Helper methods

  private formatDistribution(rows: any[]): Record<string, number> {
    const result: Record<string, number> = {};
    rows.forEach(row => {
      result[row.outlet_type || row.ownership_structure] = parseInt(row.count);
    });
    return result;
  }

  private calculateCredibilityDistribution(avgCredibility: number): Record<string, number> {
    // Simulate distribution based on average
    const high = Math.round(avgCredibility * 40);
    const medium = Math.round((1 - avgCredibility) * 35 + 25);
    const low = Math.round((1 - avgCredibility) * 25);
    
    return {
      'High (0.8-1.0)': high,
      'Medium (0.5-0.8)': medium,
      'Low (0.0-0.5)': low
    };
  }

  private async calculateBiasSpectrum(campaignId: number): Promise<Record<string, number>> {
    const result = await this.pool.query(`
      SELECT 
        CASE 
          WHEN political_bias < -0.5 THEN 'Far Left'
          WHEN political_bias < -0.2 THEN 'Left'
          WHEN political_bias < 0.2 THEN 'Center'
          WHEN political_bias < 0.5 THEN 'Right'
          ELSE 'Far Right'
        END as bias_category,
        COUNT(*) as count
      FROM media_outlets 
      WHERE campaign_id = $1 AND status = 'active'
      GROUP BY bias_category
    `, [campaignId]);

    return this.formatDistribution(result.rows);
  }

  private calculateTrend(currentLevel: number): string {
    // Simplified trend calculation - in real implementation, compare with historical data
    if (currentLevel >= 75) return 'improving';
    if (currentLevel >= 50) return 'stable';
    return 'declining';
  }

  private calculateInternationalRanking(pressFreedom: number): number {
    // Simulate international ranking based on press freedom score
    if (pressFreedom >= 90) return Math.floor(Math.random() * 10) + 1;
    if (pressFreedom >= 75) return Math.floor(Math.random() * 20) + 11;
    if (pressFreedom >= 50) return Math.floor(Math.random() * 50) + 31;
    return Math.floor(Math.random() * 130) + 81;
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Get press conferences for a campaign
   */
  async getPressConferences(campaignId: number, status?: string): Promise<PressConference[]> {
    const client = await this.pool.connect();
    
    try {
      let query = `
        SELECT * FROM press_conferences 
        WHERE campaign_id = $1
      `;
      const params: any[] = [campaignId];
      
      if (status) {
        query += ` AND status = $2`;
        params.push(status);
      }
      
      query += ` ORDER BY scheduled_date DESC`;
      
      const result = await client.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        campaignId: row.campaign_id,
        title: row.title,
        description: row.description,
        scheduledDate: new Date(row.scheduled_date),
        durationMinutes: row.duration_minutes,
        status: row.status,
        presenterType: row.presenter_type,
        presenterCharacterId: row.presenter_character_id,
        presenterName: row.presenter_name,
        location: row.location,
        expectedAttendees: row.expected_attendees,
        mediaOutletsInvited: row.media_outlets_invited || [],
        topics: row.topics || [],
        preparedStatements: row.prepared_statements || [],
        questionsAsked: row.questions_asked,
        questionsAnswered: row.questions_answered,
        hostileQuestions: row.hostile_questions,
        followUpQuestions: row.follow_up_questions,
        mediaCoverageScore: parseFloat(row.media_coverage_score),
        publicReceptionScore: parseFloat(row.public_reception_score),
        messageClarityScore: parseFloat(row.message_clarity_score),
        credibilityImpact: parseFloat(row.credibility_impact),
        approvalRatingImpact: parseFloat(row.approval_rating_impact),
        leaderPresenceBonus: parseFloat(row.leader_presence_bonus),
        authenticityScore: parseFloat(row.authenticity_score),
        politicalRisk: parseFloat(row.political_risk),
        journalistSatisfaction: parseFloat(row.journalist_satisfaction),
        transparencyPerception: parseFloat(row.transparency_perception),
        accessQualityRating: parseFloat(row.access_quality_rating),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get press conference questions
   */
  async getPressConferenceQuestions(pressConferenceId: string): Promise<PressConferenceQuestion[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM press_conference_questions 
        WHERE press_conference_id = $1
        ORDER BY question_number
      `, [pressConferenceId]);
      
      return result.rows.map(row => ({
        id: row.id,
        pressConferenceId: row.press_conference_id,
        questionNumber: row.question_number,
        journalistName: row.journalist_name,
        mediaOutlet: row.media_outlet,
        questionText: row.question_text,
        questionCategory: row.question_category,
        answered: row.answered,
        responseText: row.response_text,
        responseQuality: row.response_quality,
        responseDurationSeconds: row.response_duration_seconds,
        questionDifficulty: parseFloat(row.question_difficulty),
        publicInterestLevel: parseFloat(row.public_interest_level),
        mediaFollowUpLikelihood: parseFloat(row.media_follow_up_likelihood),
        createdAt: new Date(row.created_at)
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get press secretary information
   */
  async getPressSecretary(campaignId: number): Promise<PressSecretary | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM press_secretaries 
        WHERE campaign_id = $1 AND status = 'active'
        ORDER BY appointment_date DESC
        LIMIT 1
      `, [campaignId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        campaignId: row.campaign_id,
        characterId: row.character_id,
        name: row.name,
        title: row.title,
        appointmentDate: new Date(row.appointment_date),
        status: row.status,
        communicationSkill: parseFloat(row.communication_skill),
        mediaRelationsSkill: parseFloat(row.media_relations_skill),
        crisisManagementSkill: parseFloat(row.crisis_management_skill),
        policyKnowledge: parseFloat(row.policy_knowledge),
        charisma: parseFloat(row.charisma),
        pressConferencesHeld: row.press_conferences_held,
        averageApprovalRating: parseFloat(row.average_approval_rating),
        mediaRelationshipScore: parseFloat(row.media_relationship_score),
        controversyIncidents: row.controversy_incidents,
        successfulCrisisResponses: row.successful_crisis_responses,
        effectivenessVsLeader: parseFloat(row.effectiveness_vs_leader),
        credibilityVsLeader: parseFloat(row.credibility_vs_leader),
        mediaTrustVsLeader: parseFloat(row.media_trust_vs_leader),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } finally {
      client.release();
    }
  }

  /**
   * Schedule a new press conference
   */
  async schedulePressConference(campaignId: number, data: {
    title: string;
    description?: string;
    scheduledDate: Date;
    durationMinutes?: number;
    presenterType: 'leader_personal' | 'press_secretary' | 'cabinet_member' | 'spokesperson';
    presenterCharacterId?: string;
    presenterName: string;
    location?: string;
    expectedAttendees?: number;
    topics?: string[];
  }): Promise<PressConference> {
    const client = await this.pool.connect();
    
    try {
      // Calculate effectiveness based on presenter type
      let authenticityScore = 0.50;
      let politicalRisk = 0.30;
      let leaderPresenceBonus = 0.00;
      
      if (data.presenterType === 'leader_personal') {
        authenticityScore = 0.90;
        politicalRisk = 0.65;
        leaderPresenceBonus = 0.25;
      } else if (data.presenterType === 'press_secretary') {
        authenticityScore = 0.65;
        politicalRisk = 0.25;
        leaderPresenceBonus = 0.00;
      }
      
      const result = await client.query(`
        INSERT INTO press_conferences (
          campaign_id, title, description, scheduled_date, duration_minutes,
          presenter_type, presenter_character_id, presenter_name, location, expected_attendees,
          topics, authenticity_score, political_risk, leader_presence_bonus
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING *
      `, [
        campaignId,
        data.title,
        data.description || null,
        data.scheduledDate,
        data.durationMinutes || 60,
        data.presenterType,
        data.presenterCharacterId || null,
        data.presenterName,
        data.location || 'Presidential Press Room',
        data.expectedAttendees || 50,
        data.topics || [],
        authenticityScore,
        politicalRisk,
        leaderPresenceBonus
      ]);
      
      const row = result.rows[0];
      return {
        id: row.id,
        campaignId: row.campaign_id,
        title: row.title,
        description: row.description,
        scheduledDate: new Date(row.scheduled_date),
        durationMinutes: row.duration_minutes,
        status: row.status,
        presenterType: row.presenter_type,
        presenterCharacterId: row.presenter_character_id,
        presenterName: row.presenter_name,
        location: row.location,
        expectedAttendees: row.expected_attendees,
        mediaOutletsInvited: row.media_outlets_invited || [],
        topics: row.topics || [],
        preparedStatements: row.prepared_statements || [],
        questionsAsked: row.questions_asked,
        questionsAnswered: row.questions_answered,
        hostileQuestions: row.hostile_questions,
        followUpQuestions: row.follow_up_questions,
        mediaCoverageScore: parseFloat(row.media_coverage_score),
        publicReceptionScore: parseFloat(row.public_reception_score),
        messageClarityScore: parseFloat(row.message_clarity_score),
        credibilityImpact: parseFloat(row.credibility_impact),
        approvalRatingImpact: parseFloat(row.approval_rating_impact),
        leaderPresenceBonus: parseFloat(row.leader_presence_bonus),
        authenticityScore: parseFloat(row.authenticity_score),
        politicalRisk: parseFloat(row.political_risk),
        journalistSatisfaction: parseFloat(row.journalist_satisfaction),
        transparencyPerception: parseFloat(row.transparency_perception),
        accessQualityRating: parseFloat(row.access_quality_rating),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } finally {
      client.release();
    }
  }

  /**
   * Complete a press conference and calculate its impact
   */
  async completePressConference(pressConferenceId: string, data: {
    questionsAsked: number;
    questionsAnswered: number;
    hostileQuestions: number;
    followUpQuestions: number;
  }): Promise<PressConference> {
    const client = await this.pool.connect();
    
    try {
      // Get press conference details
      const conferenceResult = await client.query(`
        SELECT * FROM press_conferences WHERE id = $1
      `, [pressConferenceId]);
      
      if (conferenceResult.rows.length === 0) {
        throw new Error('Press conference not found');
      }
      
      const conference = conferenceResult.rows[0];
      
      // Calculate impact scores based on performance
      const answerRate = data.questionsAnswered / Math.max(data.questionsAsked, 1);
      const hostileRate = data.hostileQuestions / Math.max(data.questionsAsked, 1);
      
      let mediaCoverageScore = 0.50 + (answerRate * 0.30) - (hostileRate * 0.20);
      let publicReceptionScore = 0.50 + (answerRate * 0.25) - (hostileRate * 0.15);
      let messageClarityScore = 0.50 + (answerRate * 0.35);
      let journalistSatisfaction = 0.50 + (answerRate * 0.30) - (hostileRate * 0.25);
      
      // Apply leader presence bonus
      if (conference.presenter_type === 'leader_personal') {
        mediaCoverageScore += parseFloat(conference.leader_presence_bonus);
        publicReceptionScore += parseFloat(conference.leader_presence_bonus) * 0.8;
      }
      
      // Clamp values between 0 and 1
      mediaCoverageScore = Math.max(0, Math.min(1, mediaCoverageScore));
      publicReceptionScore = Math.max(0, Math.min(1, publicReceptionScore));
      messageClarityScore = Math.max(0, Math.min(1, messageClarityScore));
      journalistSatisfaction = Math.max(0, Math.min(1, journalistSatisfaction));
      
      // Calculate credibility and approval rating impacts
      const credibilityImpact = (mediaCoverageScore - 0.5) * 0.1; // -0.05 to +0.05
      const approvalRatingImpact = (publicReceptionScore - 0.5) * 0.15; // -0.075 to +0.075
      
      // Update press conference
      const result = await client.query(`
        UPDATE press_conferences SET
          status = 'completed',
          questions_asked = $2,
          questions_answered = $3,
          hostile_questions = $4,
          follow_up_questions = $5,
          media_coverage_score = $6,
          public_reception_score = $7,
          message_clarity_score = $8,
          credibility_impact = $9,
          approval_rating_impact = $10,
          journalist_satisfaction = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [
        pressConferenceId,
        data.questionsAsked,
        data.questionsAnswered,
        data.hostileQuestions,
        data.followUpQuestions,
        mediaCoverageScore,
        publicReceptionScore,
        messageClarityScore,
        credibilityImpact,
        approvalRatingImpact,
        journalistSatisfaction
      ]);
      
      const row = result.rows[0];
      return {
        id: row.id,
        campaignId: row.campaign_id,
        title: row.title,
        description: row.description,
        scheduledDate: new Date(row.scheduled_date),
        durationMinutes: row.duration_minutes,
        status: row.status,
        presenterType: row.presenter_type,
        presenterCharacterId: row.presenter_character_id,
        presenterName: row.presenter_name,
        location: row.location,
        expectedAttendees: row.expected_attendees,
        mediaOutletsInvited: row.media_outlets_invited || [],
        topics: row.topics || [],
        preparedStatements: row.prepared_statements || [],
        questionsAsked: row.questions_asked,
        questionsAnswered: row.questions_answered,
        hostileQuestions: row.hostile_questions,
        followUpQuestions: row.follow_up_questions,
        mediaCoverageScore: parseFloat(row.media_coverage_score),
        publicReceptionScore: parseFloat(row.public_reception_score),
        messageClarityScore: parseFloat(row.message_clarity_score),
        credibilityImpact: parseFloat(row.credibility_impact),
        approvalRatingImpact: parseFloat(row.approval_rating_impact),
        leaderPresenceBonus: parseFloat(row.leader_presence_bonus),
        authenticityScore: parseFloat(row.authenticity_score),
        politicalRisk: parseFloat(row.political_risk),
        journalistSatisfaction: parseFloat(row.journalist_satisfaction),
        transparencyPerception: parseFloat(row.transparency_perception),
        accessQualityRating: parseFloat(row.access_quality_rating),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } finally {
      client.release();
    }
  }
}
