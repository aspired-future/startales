/**
 * State Secretary Service
 * 
 * Business logic for the Secretary of State and State Department operations
 * Handles foreign relations, diplomatic communications, treaty management, and embassy operations
 */

import { Pool } from 'pg';
import { DiplomaticSynchronizationService } from './DiplomaticSynchronizationService.js';

// ===== INTERFACES =====

export interface DiplomaticRelation {
  id: string;
  civilizationId: string;
  targetCivilizationId: string;
  status: 'allied' | 'friendly' | 'neutral' | 'tense' | 'hostile' | 'war';
  trustLevel: number; // -100 to 100
  tradeLevel: number; // 0 to 100
  militaryCooperation: number; // 0 to 100
  culturalExchange: number; // 0 to 100
  lastContact: Date;
  relationshipHistory: RelationshipEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RelationshipEvent {
  date: Date;
  type: 'diplomatic_contact' | 'trade_agreement' | 'military_cooperation' | 'cultural_exchange' | 'incident' | 'treaty_signed';
  description: string;
  impact: {
    trustLevel?: number;
    tradeLevel?: number;
    militaryCooperation?: number;
    culturalExchange?: number;
  };
}

export interface Treaty {
  id: string;
  name: string;
  type: 'trade' | 'military' | 'cultural' | 'research' | 'non_aggression' | 'alliance' | 'peace' | 'environmental';
  status: 'draft' | 'negotiating' | 'signed' | 'ratified' | 'active' | 'suspended' | 'terminated';
  parties: string[]; // civilization IDs
  terms: Record<string, any>;
  economicProvisions: Record<string, any>;
  militaryProvisions: Record<string, any>;
  culturalProvisions: Record<string, any>;
  tradeProvisions: Record<string, any>;
  durationYears?: number;
  autoRenewal: boolean;
  negotiationStartDate?: Date;
  signedDate?: Date;
  ratifiedDate?: Date;
  effectiveDate?: Date;
  expirationDate?: Date;
  terminationDate?: Date;
  terminationReason?: string;
  negotiatedBy?: string;
  signedBy: Record<string, string>;
  ratifiedBy: Record<string, string>;
  amendments: TreatyAmendment[];
  complianceStatus: Record<string, any>;
  violationReports: TreatyViolation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TreatyAmendment {
  id: string;
  date: Date;
  description: string;
  changes: Record<string, any>;
  ratifiedBy: string[];
}

export interface TreatyViolation {
  id: string;
  date: Date;
  violatingParty: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  resolved: boolean;
  resolution?: string;
}

export interface Embassy {
  id: string;
  hostCivilizationId: string;
  guestCivilizationId: string;
  location: string;
  status: 'operational' | 'suspended' | 'closed' | 'under_construction';
  embassyType: 'full' | 'consulate' | 'trade_office' | 'cultural_center';
  staffCount: number;
  securityLevel: number; // 1-5
  diplomaticImmunity: boolean;
  consularServices: string[];
  tradeOffice: boolean;
  culturalCenter: boolean;
  intelligenceOperations: boolean;
  establishedDate?: Date;
  closedDate?: Date;
  ambassadorId?: string;
  deputyChiefId?: string;
  staffRoster: DiplomaticPersonnel[];
  securityIncidents: SecurityIncident[];
  diplomaticPouches: DiplomaticPouch[];
  budgetAllocation: number;
  operationalCosts: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiplomaticCommunication {
  id: string;
  senderCivilizationId: string;
  receiverCivilizationId: string;
  senderOfficialId?: string;
  receiverOfficialId?: string;
  communicationType: 'note' | 'demarche' | 'protest' | 'invitation' | 'proposal' | 'response' | 'notification';
  channel: 'official' | 'back_channel' | 'public' | 'multilateral';
  classification: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
  subject: string;
  content: string;
  attachments: CommunicationAttachment[];
  deliveryMethod: 'diplomatic_pouch' | 'secure_transmission' | 'courier' | 'public_statement';
  sentDate: Date;
  receivedDate?: Date;
  acknowledgedDate?: Date;
  responseRequired: boolean;
  responseDeadline?: Date;
  responseId?: string;
  urgency: 'routine' | 'normal' | 'urgent' | 'immediate';
  diplomaticProtocol: Record<string, any>;
  translationRequired: boolean;
  translatedContent: Record<string, string>;
  encryptionLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationAttachment {
  id: string;
  filename: string;
  type: string;
  size: number;
  classification: string;
  description?: string;
}

export interface TradeAgreement {
  id: string;
  name: string;
  type: 'bilateral' | 'multilateral' | 'preferential' | 'free_trade' | 'customs_union' | 'economic_partnership';
  status: 'negotiating' | 'signed' | 'ratified' | 'active' | 'suspended' | 'terminated';
  parties: string[];
  commodities: TradeCommodity[];
  tariffSchedules: Record<string, any>;
  quotas: Record<string, any>;
  tradeRoutes: TradeRoute[];
  paymentTerms: Record<string, any>;
  currencyProvisions: Record<string, any>;
  disputeResolution: Record<string, any>;
  intellectualProperty: Record<string, any>;
  environmentalStandards: Record<string, any>;
  laborStandards: Record<string, any>;
  volumeCommitments: Record<string, any>;
  priceMechanisms: Record<string, any>;
  forceMajeureClauses: Record<string, any>;
  negotiationStartDate?: Date;
  signedDate?: Date;
  effectiveDate?: Date;
  expirationDate?: Date;
  reviewDate?: Date;
  performanceMetrics: Record<string, any>;
  complianceReports: ComplianceReport[];
  tradeStatistics: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeCommodity {
  id: string;
  name: string;
  category: string;
  hsCode?: string;
  tariffRate: number;
  quota?: number;
  restrictions: string[];
}

export interface TradeRoute {
  id: string;
  origin: string;
  destination: string;
  transportMode: 'space' | 'hyperspace' | 'wormhole' | 'quantum_tunnel';
  distance: number;
  transitTime: number;
  capacity: number;
  securityRisk: number;
  operationalCosts: number;
}

export interface ComplianceReport {
  id: string;
  reportDate: Date;
  reportingParty: string;
  complianceLevel: number; // 0-100
  violations: string[];
  recommendations: string[];
}

export interface DiplomaticPersonnel {
  id: string;
  civilizationId: string;
  name: string;
  rank: string;
  position: string;
  assignmentLocation?: string;
  embassyId?: string;
  securityClearance: number;
  languages: string[];
  specializations: string[];
  diplomaticImmunity: boolean;
  status: 'active' | 'inactive' | 'retired' | 'reassigned';
  appointmentDate?: Date;
  tourEndDate?: Date;
  previousAssignments: Assignment[];
  performanceRatings: PerformanceRating[];
  commendations: Commendation[];
  disciplinaryActions: DisciplinaryAction[];
  contactInformation: Record<string, string>;
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  location: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  achievements: string[];
}

export interface PerformanceRating {
  period: string;
  rating: number;
  evaluator: string;
  comments: string;
}

export interface Commendation {
  date: Date;
  type: string;
  description: string;
  awardedBy: string;
}

export interface DisciplinaryAction {
  date: Date;
  type: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  resolved: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface SecurityIncident {
  id: string;
  date: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  resolution?: string;
}

export interface DiplomaticPouch {
  id: string;
  date: Date;
  destination: string;
  contents: string[];
  classification: string;
  courier: string;
  delivered: boolean;
}

export interface DiplomaticIncident {
  id: string;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'escalated';
  involvedCivilizations: string[];
  location?: string;
  embassyId?: string;
  incidentDate: Date;
  reportedDate: Date;
  resolvedDate?: Date;
  description: string;
  immediateActions: string[];
  investigationFindings: Record<string, any>;
  diplomaticConsequences: Record<string, any>;
  compensationRequired: Record<string, any>;
  apologiesIssued: string[];
  protocolViolations: string[];
  mediaCoverage: Record<string, any>;
  publicStatements: string[];
  followUpActions: string[];
  lessonsLearned?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiplomaticNegotiation {
  id: string;
  negotiationType: string;
  subject: string;
  status: 'initiated' | 'ongoing' | 'paused' | 'completed' | 'failed';
  parties: string[];
  mediators: string[];
  venue?: string;
  startDate?: Date;
  targetCompletionDate?: Date;
  actualCompletionDate?: Date;
  roundsCompleted: number;
  currentRound: number;
  negotiationPositions: Record<string, any>;
  concessionsMade: Record<string, any>;
  stickingPoints: string[];
  breakthroughMoments: string[];
  deadlockPeriods: string[];
  externalPressures: Record<string, any>;
  publicStatements: string[];
  mediaStrategy: Record<string, any>;
  confidentialityAgreements: Record<string, any>;
  preliminaryAgreements: string[];
  finalAgreementId?: string;
  negotiationNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== SERVICE CLASS =====

export class StateSecretaryService {
  private pool: Pool;
  private syncService: DiplomaticSynchronizationService;

  constructor(pool: Pool) {
    this.pool = pool;
    this.syncService = new DiplomaticSynchronizationService(pool, this);
  }

  // ===== DIPLOMATIC RELATIONS =====

  async getDiplomaticRelations(civilizationId: string): Promise<DiplomaticRelation[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM diplomatic_relations 
        WHERE civilization_id = $1 
        ORDER BY trust_level DESC, last_contact DESC
      `, [civilizationId]);

      return result.rows.map(this.mapDiplomaticRelation);
    } finally {
      client.release();
    }
  }

  async updateDiplomaticRelation(
    civilizationId: string,
    targetCivilizationId: string,
    updates: Partial<DiplomaticRelation>
  ): Promise<DiplomaticRelation> {
    const client = await this.pool.connect();
    try {
      // First, try to update existing relation
      const updateResult = await client.query(`
        UPDATE diplomatic_relations 
        SET 
          status = COALESCE($3, status),
          trust_level = COALESCE($4, trust_level),
          trade_level = COALESCE($5, trade_level),
          military_cooperation = COALESCE($6, military_cooperation),
          cultural_exchange = COALESCE($7, cultural_exchange),
          last_contact = COALESCE($8, last_contact),
          relationship_history = COALESCE($9, relationship_history),
          updated_at = CURRENT_TIMESTAMP
        WHERE civilization_id = $1 AND target_civilization_id = $2
        RETURNING *
      `, [
        civilizationId,
        targetCivilizationId,
        updates.status,
        updates.trustLevel,
        updates.tradeLevel,
        updates.militaryCooperation,
        updates.culturalExchange,
        updates.lastContact,
        updates.relationshipHistory ? JSON.stringify(updates.relationshipHistory) : null
      ]);

      if (updateResult.rows.length > 0) {
        return this.mapDiplomaticRelation(updateResult.rows[0]);
      }

      // If no existing relation, create new one
      const insertResult = await client.query(`
        INSERT INTO diplomatic_relations (
          id, civilization_id, target_civilization_id, status, trust_level,
          trade_level, military_cooperation, cultural_exchange, last_contact,
          relationship_history
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        `relation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        civilizationId,
        targetCivilizationId,
        updates.status || 'neutral',
        updates.trustLevel || 0,
        updates.tradeLevel || 0,
        updates.militaryCooperation || 0,
        updates.culturalExchange || 0,
        updates.lastContact || new Date(),
        JSON.stringify(updates.relationshipHistory || [])
      ]);

      return this.mapDiplomaticRelation(insertResult.rows[0]);
    } finally {
      client.release();
    }
  }

  async recordDiplomaticEvent(
    civilizationId: string,
    targetCivilizationId: string,
    event: RelationshipEvent
  ): Promise<void> {
    const relation = await this.getDiplomaticRelation(civilizationId, targetCivilizationId);
    if (!relation) return;

    const updatedHistory = [...relation.relationshipHistory, event];
    
    // Apply impact to relationship metrics
    const updates: Partial<DiplomaticRelation> = {
      relationshipHistory: updatedHistory,
      lastContact: new Date()
    };

    if (event.impact.trustLevel) {
      updates.trustLevel = Math.max(-100, Math.min(100, relation.trustLevel + event.impact.trustLevel));
    }
    if (event.impact.tradeLevel) {
      updates.tradeLevel = Math.max(0, Math.min(100, relation.tradeLevel + event.impact.tradeLevel));
    }
    if (event.impact.militaryCooperation) {
      updates.militaryCooperation = Math.max(0, Math.min(100, relation.militaryCooperation + event.impact.militaryCooperation));
    }
    if (event.impact.culturalExchange) {
      updates.culturalExchange = Math.max(0, Math.min(100, relation.culturalExchange + event.impact.culturalExchange));
    }

    await this.updateDiplomaticRelation(civilizationId, targetCivilizationId, updates);
  }

  private async getDiplomaticRelation(
    civilizationId: string,
    targetCivilizationId: string
  ): Promise<DiplomaticRelation | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM diplomatic_relations 
        WHERE civilization_id = $1 AND target_civilization_id = $2
      `, [civilizationId, targetCivilizationId]);

      return result.rows.length > 0 ? this.mapDiplomaticRelation(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  // ===== TREATIES =====

  async getTreaties(civilizationId?: string, status?: string): Promise<Treaty[]> {
    const client = await this.pool.connect();
    try {
      let query = 'SELECT * FROM treaties WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (civilizationId) {
        query += ` AND parties @> $${paramIndex}`;
        params.push(JSON.stringify([civilizationId]));
        paramIndex++;
      }

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, params);
      return result.rows.map(this.mapTreaty);
    } finally {
      client.release();
    }
  }

  async createTreaty(treatyData: Omit<Treaty, 'id' | 'createdAt' | 'updatedAt'>): Promise<Treaty> {
    const client = await this.pool.connect();
    try {
      const id = `treaty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO treaties (
          id, name, type, status, parties, terms, economic_provisions,
          military_provisions, cultural_provisions, trade_provisions,
          duration_years, auto_renewal, negotiation_start_date,
          negotiated_by, signed_by, ratified_by, amendments,
          compliance_status, violation_reports
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `, [
        id,
        treatyData.name,
        treatyData.type,
        treatyData.status,
        JSON.stringify(treatyData.parties),
        JSON.stringify(treatyData.terms),
        JSON.stringify(treatyData.economicProvisions),
        JSON.stringify(treatyData.militaryProvisions),
        JSON.stringify(treatyData.culturalProvisions),
        JSON.stringify(treatyData.tradeProvisions),
        treatyData.durationYears,
        treatyData.autoRenewal,
        treatyData.negotiationStartDate,
        treatyData.negotiatedBy,
        JSON.stringify(treatyData.signedBy),
        JSON.stringify(treatyData.ratifiedBy),
        JSON.stringify(treatyData.amendments),
        JSON.stringify(treatyData.complianceStatus),
        JSON.stringify(treatyData.violationReports)
      ]);

      return this.mapTreaty(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async updateTreatyStatus(treatyId: string, status: Treaty['status'], additionalData?: Partial<Treaty>): Promise<Treaty> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        UPDATE treaties 
        SET 
          status = $2,
          signed_date = COALESCE($3, signed_date),
          ratified_date = COALESCE($4, ratified_date),
          effective_date = COALESCE($5, effective_date),
          expiration_date = COALESCE($6, expiration_date),
          termination_date = COALESCE($7, termination_date),
          termination_reason = COALESCE($8, termination_reason),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [
        treatyId,
        status,
        additionalData?.signedDate,
        additionalData?.ratifiedDate,
        additionalData?.effectiveDate,
        additionalData?.expirationDate,
        additionalData?.terminationDate,
        additionalData?.terminationReason
      ]);

      if (result.rows.length === 0) {
        throw new Error(`Treaty ${treatyId} not found`);
      }

      return this.mapTreaty(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ===== EMBASSIES =====

  async getEmbassies(civilizationId?: string): Promise<Embassy[]> {
    const client = await this.pool.connect();
    try {
      let query = 'SELECT * FROM embassies WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (civilizationId) {
        query += ` AND (host_civilization_id = $${paramIndex} OR guest_civilization_id = $${paramIndex})`;
        params.push(civilizationId);
        paramIndex++;
      }

      query += ' ORDER BY established_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(this.mapEmbassy);
    } finally {
      client.release();
    }
  }

  async establishEmbassy(embassyData: Omit<Embassy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Embassy> {
    const client = await this.pool.connect();
    try {
      const id = `embassy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO embassies (
          id, host_civilization_id, guest_civilization_id, location,
          status, embassy_type, staff_count, security_level,
          diplomatic_immunity, consular_services, trade_office,
          cultural_center, intelligence_operations, established_date,
          ambassador_id, deputy_chief_id, staff_roster,
          security_incidents, diplomatic_pouches, budget_allocation,
          operational_costs
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *
      `, [
        id,
        embassyData.hostCivilizationId,
        embassyData.guestCivilizationId,
        embassyData.location,
        embassyData.status,
        embassyData.embassyType,
        embassyData.staffCount,
        embassyData.securityLevel,
        embassyData.diplomaticImmunity,
        JSON.stringify(embassyData.consularServices),
        embassyData.tradeOffice,
        embassyData.culturalCenter,
        embassyData.intelligenceOperations,
        embassyData.establishedDate,
        embassyData.ambassadorId,
        embassyData.deputyChiefId,
        JSON.stringify(embassyData.staffRoster),
        JSON.stringify(embassyData.securityIncidents),
        JSON.stringify(embassyData.diplomaticPouches),
        embassyData.budgetAllocation,
        JSON.stringify(embassyData.operationalCosts)
      ]);

      return this.mapEmbassy(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ===== SYNCHRONIZED DIPLOMATIC COMMUNICATIONS =====

  /**
   * Send a synchronized diplomatic message that creates consistent records for both civilizations
   */
  async sendSynchronizedDiplomaticMessage(
    senderCivId: string,
    receiverCivId: string,
    messageData: {
      messageType: 'treaty_proposal' | 'trade_offer' | 'alliance_request' | 'diplomatic_note' | 'protest' | 'invitation' | 'response';
      subject: string;
      content: string;
      proposedTerms?: Record<string, any>;
      requestedAction?: string;
      deadline?: Date;
      urgency?: 'routine' | 'normal' | 'urgent' | 'immediate';
      classification?: 'public' | 'diplomatic' | 'confidential' | 'secret';
      senderAnalysis: {
        interpretation: string;
        strategicAnalysis: string;
        recommendedResponse?: string;
        internalNotes: string;
        culturalContext: string;
        strategicImplications: string;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        riskFactors: string[];
        mitigation: string[];
      };
      attachments?: Array<{
        type: 'treaty_draft' | 'trade_agreement' | 'map' | 'technical_specs' | 'cultural_exchange' | 'other';
        filename: string;
        data: Record<string, any>;
        annotations?: string;
      }>;
    }
  ): Promise<{
    senderMessage: DiplomaticCommunication;
    receiverMessage: DiplomaticCommunication;
    messageId: string;
  }> {
    const result = await this.syncService.sendSynchronizedMessage(
      senderCivId,
      receiverCivId,
      {
        messageType: messageData.messageType,
        coreContent: {
          subject: messageData.subject,
          factualContent: messageData.content,
          proposedTerms: messageData.proposedTerms,
          requestedAction: messageData.requestedAction,
          deadline: messageData.deadline,
          urgency: messageData.urgency || 'normal',
          classification: messageData.classification || 'diplomatic'
        },
        senderPerspective: {
          interpretation: messageData.senderAnalysis.interpretation,
          analysis: messageData.senderAnalysis.strategicAnalysis,
          recommendedResponse: messageData.senderAnalysis.recommendedResponse,
          internalNotes: messageData.senderAnalysis.internalNotes,
          culturalContext: messageData.senderAnalysis.culturalContext,
          strategicImplications: messageData.senderAnalysis.strategicImplications,
          riskAssessment: {
            level: messageData.senderAnalysis.riskLevel,
            factors: messageData.senderAnalysis.riskFactors,
            mitigation: messageData.senderAnalysis.mitigation
          }
        },
        attachments: messageData.attachments?.map(att => ({
          type: att.type,
          filename: att.filename,
          coreData: att.data,
          senderAnnotations: att.annotations
        }))
      }
    );

    return {
      senderMessage: result.senderMessage,
      receiverMessage: result.receiverMessage,
      messageId: result.synchronizedMessage.id
    };
  }

  /**
   * Send a synchronized response to a previous diplomatic message
   */
  async sendSynchronizedResponse(
    respondingCivId: string,
    originalMessageId: string,
    responseData: {
      subject: string;
      content: string;
      proposedTerms?: Record<string, any>;
      requestedAction?: string;
      deadline?: Date;
      urgency?: 'routine' | 'normal' | 'urgent' | 'immediate';
      classification?: 'public' | 'diplomatic' | 'confidential' | 'secret';
      responderAnalysis: {
        interpretation: string;
        strategicAnalysis: string;
        recommendedResponse?: string;
        internalNotes: string;
        culturalContext: string;
        strategicImplications: string;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        riskFactors: string[];
        mitigation: string[];
      };
      attachments?: Array<{
        type: 'treaty_draft' | 'trade_agreement' | 'map' | 'technical_specs' | 'cultural_exchange' | 'other';
        filename: string;
        data: Record<string, any>;
        annotations?: string;
      }>;
    }
  ): Promise<{
    responderMessage: DiplomaticCommunication;
    originalSenderMessage: DiplomaticCommunication;
    responseId: string;
  }> {
    const result = await this.syncService.sendSynchronizedResponse(
      respondingCivId,
      originalMessageId,
      {
        coreContent: {
          subject: responseData.subject,
          factualContent: responseData.content,
          proposedTerms: responseData.proposedTerms,
          requestedAction: responseData.requestedAction,
          deadline: responseData.deadline,
          urgency: responseData.urgency || 'normal',
          classification: responseData.classification || 'diplomatic'
        },
        responderPerspective: {
          interpretation: responseData.responderAnalysis.interpretation,
          analysis: responseData.responderAnalysis.strategicAnalysis,
          recommendedResponse: responseData.responderAnalysis.recommendedResponse,
          internalNotes: responseData.responderAnalysis.internalNotes,
          culturalContext: responseData.responderAnalysis.culturalContext,
          strategicImplications: responseData.responderAnalysis.strategicImplications,
          riskAssessment: {
            level: responseData.responderAnalysis.riskLevel,
            factors: responseData.responderAnalysis.riskFactors,
            mitigation: responseData.responderAnalysis.mitigation
          }
        },
        attachments: responseData.attachments?.map(att => ({
          type: att.type,
          filename: att.filename,
          coreData: att.data,
          senderAnnotations: att.annotations
        }))
      }
    );

    return {
      responderMessage: result.responderMessage,
      originalSenderMessage: result.originalSenderMessage,
      responseId: result.synchronizedResponse.id
    };
  }

  // ===== DIPLOMATIC COMMUNICATIONS =====

  async sendDiplomaticCommunication(
    communicationData: Omit<DiplomaticCommunication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DiplomaticCommunication> {
    const client = await this.pool.connect();
    try {
      const id = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await client.query(`
        INSERT INTO diplomatic_communications (
          id, sender_civilization_id, receiver_civilization_id,
          sender_official_id, receiver_official_id, communication_type,
          channel, classification, subject, content, attachments,
          delivery_method, sent_date, response_required, response_deadline,
          urgency, diplomatic_protocol, translation_required,
          translated_content, encryption_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `, [
        id,
        communicationData.senderCivilizationId,
        communicationData.receiverCivilizationId,
        communicationData.senderOfficialId,
        communicationData.receiverOfficialId,
        communicationData.communicationType,
        communicationData.channel,
        communicationData.classification,
        communicationData.subject,
        communicationData.content,
        JSON.stringify(communicationData.attachments),
        communicationData.deliveryMethod,
        communicationData.sentDate,
        communicationData.responseRequired,
        communicationData.responseDeadline,
        communicationData.urgency,
        JSON.stringify(communicationData.diplomaticProtocol),
        communicationData.translationRequired,
        JSON.stringify(communicationData.translatedContent),
        communicationData.encryptionLevel
      ]);

      return this.mapDiplomaticCommunication(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getDiplomaticCommunications(
    civilizationId: string,
    filters?: {
      type?: string;
      classification?: string;
      urgency?: string;
      responseRequired?: boolean;
    }
  ): Promise<DiplomaticCommunication[]> {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT * FROM diplomatic_communications 
        WHERE sender_civilization_id = $1 OR receiver_civilization_id = $1
      `;
      const params: any[] = [civilizationId];
      let paramIndex = 2;

      if (filters?.type) {
        query += ` AND communication_type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }

      if (filters?.classification) {
        query += ` AND classification = $${paramIndex}`;
        params.push(filters.classification);
        paramIndex++;
      }

      if (filters?.urgency) {
        query += ` AND urgency = $${paramIndex}`;
        params.push(filters.urgency);
        paramIndex++;
      }

      if (filters?.responseRequired !== undefined) {
        query += ` AND response_required = $${paramIndex}`;
        params.push(filters.responseRequired);
        paramIndex++;
      }

      query += ' ORDER BY sent_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(this.mapDiplomaticCommunication);
    } finally {
      client.release();
    }
  }

  // ===== STATE DEPARTMENT DASHBOARD =====

  async getStateDepartmentDashboard(civilizationId: string): Promise<{
    diplomaticRelations: DiplomaticRelation[];
    activeTreaties: Treaty[];
    embassies: Embassy[];
    recentCommunications: DiplomaticCommunication[];
    pendingNegotiations: DiplomaticNegotiation[];
    diplomaticIncidents: DiplomaticIncident[];
    summary: {
      totalRelations: number;
      alliedNations: number;
      hostileRelations: number;
      activeTreaties: number;
      operationalEmbassies: number;
      pendingCommunications: number;
    };
  }> {
    const [
      relations,
      treaties,
      embassies,
      communications,
      negotiations,
      incidents
    ] = await Promise.all([
      this.getDiplomaticRelations(civilizationId),
      this.getTreaties(civilizationId, 'active'),
      this.getEmbassies(civilizationId),
      this.getDiplomaticCommunications(civilizationId, { responseRequired: true }),
      this.getDiplomaticNegotiations(civilizationId, 'ongoing'),
      this.getDiplomaticIncidents(civilizationId, 'reported')
    ]);

    return {
      diplomaticRelations: relations,
      activeTreaties: treaties,
      embassies: embassies,
      recentCommunications: communications.slice(0, 10),
      pendingNegotiations: negotiations,
      diplomaticIncidents: incidents,
      summary: {
        totalRelations: relations.length,
        alliedNations: relations.filter(r => r.status === 'allied' || r.status === 'friendly').length,
        hostileRelations: relations.filter(r => r.status === 'hostile' || r.status === 'war').length,
        activeTreaties: treaties.length,
        operationalEmbassies: embassies.filter(e => e.status === 'operational').length,
        pendingCommunications: communications.length
      }
    };
  }

  // ===== PLACEHOLDER METHODS (to be implemented) =====

  private async getDiplomaticNegotiations(civilizationId: string, status: string): Promise<DiplomaticNegotiation[]> {
    // Implementation placeholder
    return [];
  }

  private async getDiplomaticIncidents(civilizationId: string, status: string): Promise<DiplomaticIncident[]> {
    // Implementation placeholder
    return [];
  }

  // ===== MAPPING FUNCTIONS =====

  private mapDiplomaticRelation(row: any): DiplomaticRelation {
    return {
      id: row.id,
      civilizationId: row.civilization_id,
      targetCivilizationId: row.target_civilization_id,
      status: row.status,
      trustLevel: row.trust_level,
      tradeLevel: row.trade_level,
      militaryCooperation: row.military_cooperation,
      culturalExchange: row.cultural_exchange,
      lastContact: row.last_contact,
      relationshipHistory: row.relationship_history || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapTreaty(row: any): Treaty {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      parties: row.parties || [],
      terms: row.terms || {},
      economicProvisions: row.economic_provisions || {},
      militaryProvisions: row.military_provisions || {},
      culturalProvisions: row.cultural_provisions || {},
      tradeProvisions: row.trade_provisions || {},
      durationYears: row.duration_years,
      autoRenewal: row.auto_renewal,
      negotiationStartDate: row.negotiation_start_date,
      signedDate: row.signed_date,
      ratifiedDate: row.ratified_date,
      effectiveDate: row.effective_date,
      expirationDate: row.expiration_date,
      terminationDate: row.termination_date,
      terminationReason: row.termination_reason,
      negotiatedBy: row.negotiated_by,
      signedBy: row.signed_by || {},
      ratifiedBy: row.ratified_by || {},
      amendments: row.amendments || [],
      complianceStatus: row.compliance_status || {},
      violationReports: row.violation_reports || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapEmbassy(row: any): Embassy {
    return {
      id: row.id,
      hostCivilizationId: row.host_civilization_id,
      guestCivilizationId: row.guest_civilization_id,
      location: row.location,
      status: row.status,
      embassyType: row.embassy_type,
      staffCount: row.staff_count,
      securityLevel: row.security_level,
      diplomaticImmunity: row.diplomatic_immunity,
      consularServices: row.consular_services || [],
      tradeOffice: row.trade_office,
      culturalCenter: row.cultural_center,
      intelligenceOperations: row.intelligence_operations,
      establishedDate: row.established_date,
      closedDate: row.closed_date,
      ambassadorId: row.ambassador_id,
      deputyChiefId: row.deputy_chief_id,
      staffRoster: row.staff_roster || [],
      securityIncidents: row.security_incidents || [],
      diplomaticPouches: row.diplomatic_pouches || [],
      budgetAllocation: parseFloat(row.budget_allocation) || 0,
      operationalCosts: row.operational_costs || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapDiplomaticCommunication(row: any): DiplomaticCommunication {
    return {
      id: row.id,
      senderCivilizationId: row.sender_civilization_id,
      receiverCivilizationId: row.receiver_civilization_id,
      senderOfficialId: row.sender_official_id,
      receiverOfficialId: row.receiver_official_id,
      communicationType: row.communication_type,
      channel: row.channel,
      classification: row.classification,
      subject: row.subject,
      content: row.content,
      attachments: row.attachments || [],
      deliveryMethod: row.delivery_method,
      sentDate: row.sent_date,
      receivedDate: row.received_date,
      acknowledgedDate: row.acknowledged_date,
      responseRequired: row.response_required,
      responseDeadline: row.response_deadline,
      responseId: row.response_id,
      urgency: row.urgency,
      diplomaticProtocol: row.diplomatic_protocol || {},
      translationRequired: row.translation_required,
      translatedContent: row.translated_content || {},
      encryptionLevel: row.encryption_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export default StateSecretaryService;
