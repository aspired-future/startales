import { Pool } from 'pg';

export interface CommunicationsOperation {
  id: string;
  campaignId: number;
  operationType: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  operationData: any;
  targetAudiences: string[];
  mediaChannels: string[];
  expectedReach: number;
  plannedStartDate?: Date;
  actualStartDate?: Date;
  plannedCompletionDate?: Date;
  actualCompletionDate?: Date;
  successMetrics: any;
  actualOutcomes: any;
  publicResponse: any;
  mediaCoverageAnalysis: any;
  authorizedBy: string;
  approvalLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaStrategy {
  id: string;
  campaignId: number;
  strategyName: string;
  strategyType: string;
  description: string;
  objectives: any[];
  targetDemographics: any;
  keyMessages: string[];
  primaryChannels: string[];
  secondaryChannels: string[];
  channelPriorities: any;
  strategyDurationDays: number;
  startDate: Date;
  endDate: Date;
  allocatedBudget: number;
  spentBudget: number;
  targetReach: number;
  actualReach: number;
  engagementTarget: number;
  actualEngagement: number;
  sentimentTarget: number;
  actualSentiment: number;
  strategyManager: string;
  teamMembers: string[];
  externalPartners: string[];
  status: string;
  effectivenessScore: number;
  lessonsLearned?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PressConference {
  id: string;
  campaignId: number;
  conferenceTitle: string;
  conferenceType: string;
  description: string;
  mainTopics: string[];
  keySpeakers: string[];
  expectedAnnouncements: string[];
  scheduledDate: Date;
  durationMinutes: number;
  location: string;
  venueCapacity: number;
  accreditedJournalists: string[];
  mediaOutletsInvited: string[];
  specialGuests: string[];
  securityClearanceRequired: string;
  openingStatement?: string;
  preparedQa: any[];
  talkingPoints: string[];
  restrictedTopics: string[];
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualAttendees: number;
  questionsAsked: number;
  mediaCoverageCount: number;
  coverageSentiment: number;
  keyQuotes: string[];
  followUpRequired: boolean;
  status: string;
  organizedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicMessage {
  id: string;
  campaignId: number;
  messageTitle: string;
  messageType: string;
  messageContent: string;
  keyPoints: string[];
  callToAction?: string;
  supportingMaterials: any[];
  targetAudiences: string[];
  distributionChannels: string[];
  geographicTargeting: string[];
  demographicTargeting: any;
  scheduledRelease?: Date;
  actualRelease?: Date;
  messageUrgency: string;
  estimatedReach: number;
  actualReach: number;
  engagementCount: number;
  shareCount: number;
  sentimentScore: number;
  coordinatedWith: string[];
  relatedMessages: string[];
  translationRequired: boolean;
  translations: any;
  approvalStatus: string;
  approvedBy?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaRelationship {
  id: string;
  campaignId: number;
  outletName: string;
  outletType: string;
  outletDescription?: string;
  primaryAudience?: string;
  politicalLeaning?: string;
  credibilityRating: number;
  reachEstimate: number;
  relationshipStatus: string;
  accessLevel: string;
  primaryContacts: any[];
  keyJournalists: string[];
  editorialContacts: any[];
  lastInteractionDate?: Date;
  interactionFrequency: string;
  exclusiveInterviewsGranted: number;
  pressConferencesAttended: number;
  coverageSentimentAvg: number;
  positiveCoverageCount: number;
  negativeCoverageCount: number;
  neutralCoverageCount: number;
  partnershipAgreements: any[];
  contentSharingAgreements: boolean;
  advertisingPartnerships: boolean;
  relationshipManager: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropagandaCampaign {
  id: string;
  campaignId: number;
  campaignName: string;
  campaignType: string;
  description: string;
  primaryObjectives: string[];
  targetOutcomes: any;
  successCriteria: any;
  targetDemographics: any;
  geographicFocus: string[];
  psychographicProfiles: any;
  influenceNetworks: any;
  keyNarratives: string[];
  messagingThemes: string[];
  emotionalAppeals: string[];
  evidenceBase: any;
  primaryChannels: string[];
  channelAllocation: any;
  contentTypes: string[];
  frequencySchedule: any;
  campaignDurationDays: number;
  startDate: Date;
  endDate: Date;
  allocatedBudget: number;
  personnelAssigned: number;
  targetReach: number;
  actualReach: number;
  engagementTarget: number;
  actualEngagement: number;
  persuasionRate: number;
  opinionShiftMeasured: number;
  behavioralChangeIndicators: any;
  counterNarrativeEffectiveness: number;
  campaignManager: string;
  teamSize: number;
  externalContractors: string[];
  classificationLevel: string;
  ethicalReviewCompleted: boolean;
  legalComplianceVerified: boolean;
  status: string;
  effectivenessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InformationPolicy {
  id: string;
  campaignId: number;
  policyName: string;
  policyCategory: string;
  policyDescription: string;
  policyText: string;
  scopeOfApplication: string[];
  affectedEntities: string[];
  implementationGuidelines: any;
  complianceRequirements: any;
  enforcementMechanisms: any;
  violationPenalties: any;
  effectiveDate: Date;
  expirationDate?: Date;
  reviewFrequencyMonths: number;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  policyLevel: string;
  approvedBy: string;
  approvalDate: Date;
  status: string;
  complianceRate: number;
  violationCount: number;
  supersedesPolicyIds: string[];
  relatedPolicyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Communications Secretary Service - Manages media relations, public messaging, and information policy
 */
export class CommunicationsSecretaryService {
  constructor(private pool: Pool) {}

  // ===== COMMUNICATIONS OPERATIONS MANAGEMENT =====

  async createCommunicationsOperation(params: {
    campaignId: number;
    operationType: string;
    title: string;
    description: string;
    priority?: string;
    operationData?: any;
    targetAudiences?: string[];
    mediaChannels?: string[];
    expectedReach?: number;
    plannedStartDate?: Date;
    plannedCompletionDate?: Date;
    successMetrics?: any;
    authorizedBy: string;
    approvalLevel?: string;
  }): Promise<CommunicationsOperation> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO communications_operations (
          campaign_id, operation_type, title, description, priority,
          operation_data, target_audiences, media_channels, expected_reach,
          planned_start_date, planned_completion_date, success_metrics,
          authorized_by, approval_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        params.campaignId,
        params.operationType,
        params.title,
        params.description,
        params.priority || 'medium',
        JSON.stringify(params.operationData || {}),
        params.targetAudiences || [],
        params.mediaChannels || [],
        params.expectedReach || 0,
        params.plannedStartDate,
        params.plannedCompletionDate,
        JSON.stringify(params.successMetrics || {}),
        params.authorizedBy,
        params.approvalLevel || 'secretary'
      ]);

      return this.mapCommunicationsOperation(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getCommunicationsOperations(campaignId: number, filters?: {
    operationType?: string;
    status?: string;
    priority?: string;
    limit?: number;
  }): Promise<CommunicationsOperation[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM communications_operations WHERE campaign_id = $1';
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

      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapCommunicationsOperation(row));
    } finally {
      client.release();
    }
  }

  // ===== MEDIA STRATEGY MANAGEMENT =====

  async createMediaStrategy(params: {
    campaignId: number;
    strategyName: string;
    strategyType: string;
    description: string;
    objectives?: any[];
    targetDemographics?: any;
    keyMessages?: string[];
    primaryChannels?: string[];
    strategyDurationDays?: number;
    startDate: Date;
    endDate: Date;
    allocatedBudget?: number;
    strategyManager: string;
  }): Promise<MediaStrategy> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO media_strategies (
          campaign_id, strategy_name, strategy_type, description,
          objectives, target_demographics, key_messages, primary_channels,
          strategy_duration_days, start_date, end_date, allocated_budget,
          strategy_manager
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        params.campaignId,
        params.strategyName,
        params.strategyType,
        params.description,
        JSON.stringify(params.objectives || []),
        JSON.stringify(params.targetDemographics || {}),
        params.keyMessages || [],
        params.primaryChannels || [],
        params.strategyDurationDays || 30,
        params.startDate,
        params.endDate,
        params.allocatedBudget || 0,
        params.strategyManager
      ]);

      return this.mapMediaStrategy(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getMediaStrategies(campaignId: number, filters?: {
    strategyType?: string;
    status?: string;
  }): Promise<MediaStrategy[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM media_strategies WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.strategyType) {
        query += ` AND strategy_type = $${paramIndex}`;
        params.push(filters.strategyType);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      query += ' ORDER BY start_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapMediaStrategy(row));
    } finally {
      client.release();
    }
  }

  // ===== PRESS CONFERENCE MANAGEMENT =====

  async schedulePressConference(params: {
    campaignId: number;
    conferenceTitle: string;
    conferenceType: string;
    description: string;
    mainTopics?: string[];
    keySpeakers?: string[];
    scheduledDate: Date;
    durationMinutes?: number;
    location: string;
    venueCapacity?: number;
    organizedBy: string;
  }): Promise<PressConference> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO press_conferences (
          campaign_id, conference_title, conference_type, description,
          main_topics, key_speakers, scheduled_date, duration_minutes,
          location, venue_capacity, organized_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        params.campaignId,
        params.conferenceTitle,
        params.conferenceType,
        params.description,
        params.mainTopics || [],
        params.keySpeakers || [],
        params.scheduledDate,
        params.durationMinutes || 60,
        params.location,
        params.venueCapacity || 0,
        params.organizedBy
      ]);

      return this.mapPressConference(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getPressConferences(campaignId: number, filters?: {
    conferenceType?: string;
    status?: string;
    upcoming?: boolean;
  }): Promise<PressConference[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM press_conferences WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.conferenceType) {
        query += ` AND conference_type = $${paramIndex}`;
        params.push(filters.conferenceType);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.upcoming) {
        query += ` AND scheduled_date > NOW()`;
      }

      query += ' ORDER BY scheduled_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapPressConference(row));
    } finally {
      client.release();
    }
  }

  // ===== PUBLIC MESSAGING MANAGEMENT =====

  async createPublicMessage(params: {
    campaignId: number;
    messageTitle: string;
    messageType: string;
    messageContent: string;
    keyPoints?: string[];
    callToAction?: string;
    targetAudiences?: string[];
    distributionChannels?: string[];
    scheduledRelease?: Date;
    messageUrgency?: string;
    createdBy: string;
  }): Promise<PublicMessage> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO public_messages (
          campaign_id, message_title, message_type, message_content,
          key_points, call_to_action, target_audiences, distribution_channels,
          scheduled_release, message_urgency, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        params.campaignId,
        params.messageTitle,
        params.messageType,
        params.messageContent,
        params.keyPoints || [],
        params.callToAction,
        params.targetAudiences || [],
        params.distributionChannels || [],
        params.scheduledRelease,
        params.messageUrgency || 'normal',
        params.createdBy
      ]);

      return this.mapPublicMessage(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getPublicMessages(campaignId: number, filters?: {
    messageType?: string;
    approvalStatus?: string;
    urgency?: string;
  }): Promise<PublicMessage[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM public_messages WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.messageType) {
        query += ` AND message_type = $${paramIndex}`;
        params.push(filters.messageType);
        paramIndex++;
      }

      if (filters?.approvalStatus) {
        query += ` AND approval_status = $${paramIndex}`;
        params.push(filters.approvalStatus);
        paramIndex++;
      }

      if (filters?.urgency) {
        query += ` AND message_urgency = $${paramIndex}`;
        params.push(filters.urgency);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapPublicMessage(row));
    } finally {
      client.release();
    }
  }

  // ===== MEDIA RELATIONSHIPS MANAGEMENT =====

  async registerMediaOutlet(params: {
    campaignId: number;
    outletName: string;
    outletType: string;
    outletDescription?: string;
    primaryAudience?: string;
    politicalLeaning?: string;
    credibilityRating?: number;
    reachEstimate?: number;
    relationshipManager: string;
  }): Promise<MediaRelationship> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO media_relationships (
          campaign_id, outlet_name, outlet_type, outlet_description,
          primary_audience, political_leaning, credibility_rating,
          reach_estimate, relationship_manager
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        params.campaignId,
        params.outletName,
        params.outletType,
        params.outletDescription,
        params.primaryAudience,
        params.politicalLeaning,
        params.credibilityRating || 5,
        params.reachEstimate || 0,
        params.relationshipManager
      ]);

      return this.mapMediaRelationship(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getMediaRelationships(campaignId: number, filters?: {
    outletType?: string;
    relationshipStatus?: string;
    accessLevel?: string;
  }): Promise<MediaRelationship[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM media_relationships WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.outletType) {
        query += ` AND outlet_type = $${paramIndex}`;
        params.push(filters.outletType);
        paramIndex++;
      }

      if (filters?.relationshipStatus) {
        query += ` AND relationship_status = $${paramIndex}`;
        params.push(filters.relationshipStatus);
        paramIndex++;
      }

      if (filters?.accessLevel) {
        query += ` AND access_level = $${paramIndex}`;
        params.push(filters.accessLevel);
        paramIndex++;
      }

      query += ' ORDER BY outlet_name';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapMediaRelationship(row));
    } finally {
      client.release();
    }
  }

  // ===== ANALYTICS AND REPORTING =====

  async getCommunicationsAnalytics(campaignId: number): Promise<{
    totalMediaBudget: number;
    activeOperations: number;
    completedOperations: number;
    activeStrategies: number;
    scheduledPressConferences: number;
    pendingMessages: number;
    mediaOutlets: number;
    budgetUtilization: number;
    mediaEffectivenessScore: number;
    publicSentimentImprovement: number;
    messagePenetrationRate: number;
  }> {
    const client = await this.pool.connect();
    
    try {
      const [budgetResult, operationsResult, strategiesResult, conferencesResult, messagesResult, outletsResult] = await Promise.all([
        client.query(`
          SELECT 
            COALESCE(SUM(total_allocated), 0) as total_budget,
            COALESCE(SUM(total_spent), 0) as total_spent,
            COALESCE(AVG(media_effectiveness_score), 0) as avg_effectiveness,
            COALESCE(AVG(public_sentiment_improvement), 0) as avg_sentiment,
            COALESCE(AVG(message_penetration_rate), 0) as avg_penetration
          FROM communications_budget_allocations 
          WHERE campaign_id = $1
        `, [campaignId]),
        
        client.query(`
          SELECT 
            COUNT(*) FILTER (WHERE status IN ('in_progress', 'planned')) as active_operations,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_operations
          FROM communications_operations 
          WHERE campaign_id = $1
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as active_strategies
          FROM media_strategies 
          WHERE campaign_id = $1 AND status IN ('active', 'approved')
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as scheduled_conferences
          FROM press_conferences 
          WHERE campaign_id = $1 AND status IN ('scheduled', 'confirmed') AND scheduled_date > NOW()
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as pending_messages
          FROM public_messages 
          WHERE campaign_id = $1 AND approval_status IN ('draft', 'review')
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as media_outlets
          FROM media_relationships 
          WHERE campaign_id = $1
        `, [campaignId])
      ]);

      const budget = budgetResult.rows[0];
      const operations = operationsResult.rows[0];
      const strategies = strategiesResult.rows[0];
      const conferences = conferencesResult.rows[0];
      const messages = messagesResult.rows[0];
      const outlets = outletsResult.rows[0];

      return {
        totalMediaBudget: parseFloat(budget.total_budget) || 0,
        activeOperations: parseInt(operations.active_operations) || 0,
        completedOperations: parseInt(operations.completed_operations) || 0,
        activeStrategies: parseInt(strategies.active_strategies) || 0,
        scheduledPressConferences: parseInt(conferences.scheduled_conferences) || 0,
        pendingMessages: parseInt(messages.pending_messages) || 0,
        mediaOutlets: parseInt(outlets.media_outlets) || 0,
        budgetUtilization: budget.total_budget > 0 ? (parseFloat(budget.total_spent) / parseFloat(budget.total_budget)) * 100 : 0,
        mediaEffectivenessScore: parseFloat(budget.avg_effectiveness) || 0,
        publicSentimentImprovement: parseFloat(budget.avg_sentiment) || 0,
        messagePenetrationRate: parseFloat(budget.avg_penetration) || 0
      };
    } finally {
      client.release();
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private mapCommunicationsOperation(row: any): CommunicationsOperation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      operationType: row.operation_type,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      operationData: row.operation_data,
      targetAudiences: row.target_audiences,
      mediaChannels: row.media_channels,
      expectedReach: row.expected_reach,
      plannedStartDate: row.planned_start_date,
      actualStartDate: row.actual_start_date,
      plannedCompletionDate: row.planned_completion_date,
      actualCompletionDate: row.actual_completion_date,
      successMetrics: row.success_metrics,
      actualOutcomes: row.actual_outcomes,
      publicResponse: row.public_response,
      mediaCoverageAnalysis: row.media_coverage_analysis,
      authorizedBy: row.authorized_by,
      approvalLevel: row.approval_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapMediaStrategy(row: any): MediaStrategy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      strategyName: row.strategy_name,
      strategyType: row.strategy_type,
      description: row.description,
      objectives: row.objectives,
      targetDemographics: row.target_demographics,
      keyMessages: row.key_messages,
      primaryChannels: row.primary_channels,
      secondaryChannels: row.secondary_channels,
      channelPriorities: row.channel_priorities,
      strategyDurationDays: row.strategy_duration_days,
      startDate: row.start_date,
      endDate: row.end_date,
      allocatedBudget: parseFloat(row.allocated_budget),
      spentBudget: parseFloat(row.spent_budget),
      targetReach: row.target_reach,
      actualReach: row.actual_reach,
      engagementTarget: parseFloat(row.engagement_target),
      actualEngagement: parseFloat(row.actual_engagement),
      sentimentTarget: parseFloat(row.sentiment_target),
      actualSentiment: parseFloat(row.actual_sentiment),
      strategyManager: row.strategy_manager,
      teamMembers: row.team_members,
      externalPartners: row.external_partners,
      status: row.status,
      effectivenessScore: parseFloat(row.effectiveness_score),
      lessonsLearned: row.lessons_learned,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapPressConference(row: any): PressConference {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      conferenceTitle: row.conference_title,
      conferenceType: row.conference_type,
      description: row.description,
      mainTopics: row.main_topics,
      keySpeakers: row.key_speakers,
      expectedAnnouncements: row.expected_announcements,
      scheduledDate: row.scheduled_date,
      durationMinutes: row.duration_minutes,
      location: row.location,
      venueCapacity: row.venue_capacity,
      accreditedJournalists: row.accredited_journalists,
      mediaOutletsInvited: row.media_outlets_invited,
      specialGuests: row.special_guests,
      securityClearanceRequired: row.security_clearance_required,
      openingStatement: row.opening_statement,
      preparedQa: row.prepared_qa,
      talkingPoints: row.talking_points,
      restrictedTopics: row.restricted_topics,
      actualStartTime: row.actual_start_time,
      actualEndTime: row.actual_end_time,
      actualAttendees: row.actual_attendees,
      questionsAsked: row.questions_asked,
      mediaCoverageCount: row.media_coverage_count,
      coverageSentiment: parseFloat(row.coverage_sentiment),
      keyQuotes: row.key_quotes,
      followUpRequired: row.follow_up_required,
      status: row.status,
      organizedBy: row.organized_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapPublicMessage(row: any): PublicMessage {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      messageTitle: row.message_title,
      messageType: row.message_type,
      messageContent: row.message_content,
      keyPoints: row.key_points,
      callToAction: row.call_to_action,
      supportingMaterials: row.supporting_materials,
      targetAudiences: row.target_audiences,
      distributionChannels: row.distribution_channels,
      geographicTargeting: row.geographic_targeting,
      demographicTargeting: row.demographic_targeting,
      scheduledRelease: row.scheduled_release,
      actualRelease: row.actual_release,
      messageUrgency: row.message_urgency,
      estimatedReach: row.estimated_reach,
      actualReach: row.actual_reach,
      engagementCount: row.engagement_count,
      shareCount: row.share_count,
      sentimentScore: parseFloat(row.sentiment_score),
      coordinatedWith: row.coordinated_with,
      relatedMessages: row.related_messages,
      translationRequired: row.translation_required,
      translations: row.translations,
      approvalStatus: row.approval_status,
      approvedBy: row.approved_by,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapMediaRelationship(row: any): MediaRelationship {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      outletName: row.outlet_name,
      outletType: row.outlet_type,
      outletDescription: row.outlet_description,
      primaryAudience: row.primary_audience,
      politicalLeaning: row.political_leaning,
      credibilityRating: row.credibility_rating,
      reachEstimate: row.reach_estimate,
      relationshipStatus: row.relationship_status,
      accessLevel: row.access_level,
      primaryContacts: row.primary_contacts,
      keyJournalists: row.key_journalists,
      editorialContacts: row.editorial_contacts,
      lastInteractionDate: row.last_interaction_date,
      interactionFrequency: row.interaction_frequency,
      exclusiveInterviewsGranted: row.exclusive_interviews_granted,
      pressConferencesAttended: row.press_conferences_attended,
      coverageSentimentAvg: parseFloat(row.coverage_sentiment_avg),
      positiveCoverageCount: row.positive_coverage_count,
      negativeCoverageCount: row.negative_coverage_count,
      neutralCoverageCount: row.neutral_coverage_count,
      partnershipAgreements: row.partnership_agreements,
      contentSharingAgreements: row.content_sharing_agreements,
      advertisingPartnerships: row.advertising_partnerships,
      relationshipManager: row.relationship_manager,
      lastReviewDate: row.last_review_date,
      nextReviewDate: row.next_review_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
