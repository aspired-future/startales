/**
 * Diplomatic Synchronization Service
 * 
 * Ensures consistent information flow between civilizations' State Departments
 * Handles bidirectional communication with civilization-specific perspectives
 */

import { Pool } from 'pg';
import { StateSecretaryService, DiplomaticCommunication } from './StateSecretaryService';

// ===== INTERFACES =====

export interface DiplomaticMessage {
  id: string;
  messageType: 'treaty_proposal' | 'trade_offer' | 'alliance_request' | 'diplomatic_note' | 'protest' | 'invitation' | 'response';
  senderCivilizationId: string;
  receiverCivilizationId: string;
  coreContent: CoreMessageContent;
  senderPerspective: CivilizationPerspective;
  receiverPerspective?: CivilizationPerspective;
  status: 'sent' | 'received' | 'acknowledged' | 'responded';
  timestamp: Date;
  responseDeadline?: Date;
  linkedMessageId?: string; // For responses
  attachments: MessageAttachment[];
}

export interface CoreMessageContent {
  subject: string;
  factualContent: string; // The objective facts that both sides see
  proposedTerms?: Record<string, any>;
  requestedAction?: string;
  deadline?: Date;
  urgency: 'routine' | 'normal' | 'urgent' | 'immediate';
  classification: 'public' | 'diplomatic' | 'confidential' | 'secret';
}

export interface CivilizationPerspective {
  civilizationId: string;
  interpretation: string; // How this civ interprets the message
  analysis: string; // Strategic analysis from this civ's viewpoint
  recommendedResponse?: string;
  internalNotes: string; // Private notes not shared with other civ
  culturalContext: string; // How this fits their cultural framework
  strategicImplications: string; // What this means for their strategy
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
}

export interface MessageAttachment {
  id: string;
  type: 'treaty_draft' | 'trade_agreement' | 'map' | 'technical_specs' | 'cultural_exchange' | 'other';
  filename: string;
  coreData: Record<string, any>; // The actual data both sides see
  senderAnnotations?: string; // Sender's notes on the attachment
  receiverAnnotations?: string; // Receiver's notes on the attachment
}

export interface DiplomaticExchange {
  id: string;
  participants: string[]; // civilization IDs
  topic: string;
  exchangeType: 'bilateral' | 'multilateral';
  messages: DiplomaticMessage[];
  currentStatus: 'active' | 'concluded' | 'suspended' | 'failed';
  startDate: Date;
  lastActivity: Date;
  conclusion?: {
    outcome: 'agreement' | 'disagreement' | 'deferred' | 'escalated';
    finalTerms?: Record<string, any>;
    nextSteps?: string[];
  };
}

// ===== SERVICE CLASS =====

export class DiplomaticSynchronizationService {
  private pool: Pool;
  private stateService: StateSecretaryService;

  constructor(pool: Pool, stateService: StateSecretaryService) {
    this.pool = pool;
    this.stateService = stateService;
  }

  // ===== SYNCHRONIZED COMMUNICATION =====

  /**
   * Send a diplomatic message that automatically creates consistent records for both civilizations
   */
  async sendSynchronizedMessage(
    senderCivId: string,
    receiverCivId: string,
    messageData: {
      messageType: DiplomaticMessage['messageType'];
      coreContent: CoreMessageContent;
      senderPerspective: Omit<CivilizationPerspective, 'civilizationId'>;
      attachments?: Omit<MessageAttachment, 'id'>[];
    }
  ): Promise<{
    senderMessage: DiplomaticCommunication;
    receiverMessage: DiplomaticCommunication;
    synchronizedMessage: DiplomaticMessage;
  }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create the synchronized message record
      const messageId = `sync_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const synchronizedMessage: DiplomaticMessage = {
        id: messageId,
        messageType: messageData.messageType,
        senderCivilizationId: senderCivId,
        receiverCivilizationId: receiverCivId,
        coreContent: messageData.coreContent,
        senderPerspective: {
          ...messageData.senderPerspective,
          civilizationId: senderCivId
        },
        status: 'sent',
        timestamp: new Date(),
        responseDeadline: messageData.coreContent.deadline,
        attachments: (messageData.attachments || []).map(att => ({
          ...att,
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }))
      };

      // Store synchronized message
      await this.storeSynchronizedMessage(synchronizedMessage);

      // Generate receiver's perspective using AI analysis
      const receiverPerspective = await this.generateReceiverPerspective(
        receiverCivId,
        senderCivId,
        synchronizedMessage
      );

      synchronizedMessage.receiverPerspective = receiverPerspective;
      await this.updateSynchronizedMessage(synchronizedMessage);

      // Create sender's diplomatic communication record
      const senderMessage = await this.stateService.sendDiplomaticCommunication({
        senderCivilizationId: senderCivId,
        receiverCivilizationId: receiverCivId,
        communicationType: this.mapMessageTypeToCommunicationType(messageData.messageType),
        channel: 'official',
        classification: messageData.coreContent.classification,
        subject: `[SENT] ${messageData.coreContent.subject}`,
        content: this.formatMessageForSender(synchronizedMessage),
        attachments: synchronizedMessage.attachments.map(att => ({
          id: att.id,
          filename: att.filename,
          type: att.type,
          size: JSON.stringify(att.coreData).length,
          classification: messageData.coreContent.classification,
          description: att.senderAnnotations || `${att.type} attachment`
        })),
        deliveryMethod: 'diplomatic_pouch',
        sentDate: new Date(),
        responseRequired: messageData.coreContent.requestedAction ? true : false,
        responseDeadline: messageData.coreContent.deadline,
        urgency: messageData.coreContent.urgency,
        diplomaticProtocol: {
          synchronizedMessageId: messageId,
          messageType: messageData.messageType,
          senderPerspective: synchronizedMessage.senderPerspective
        },
        translationRequired: false,
        translatedContent: {},
        encryptionLevel: this.getEncryptionLevel(messageData.coreContent.classification)
      });

      // Create receiver's diplomatic communication record
      const receiverMessage = await this.stateService.sendDiplomaticCommunication({
        senderCivilizationId: senderCivId,
        receiverCivilizationId: receiverCivId,
        communicationType: this.mapMessageTypeToCommunicationType(messageData.messageType),
        channel: 'official',
        classification: messageData.coreContent.classification,
        subject: `[RECEIVED] ${messageData.coreContent.subject}`,
        content: this.formatMessageForReceiver(synchronizedMessage),
        attachments: synchronizedMessage.attachments.map(att => ({
          id: att.id,
          filename: att.filename,
          type: att.type,
          size: JSON.stringify(att.coreData).length,
          classification: messageData.coreContent.classification,
          description: att.receiverAnnotations || `${att.type} attachment`
        })),
        deliveryMethod: 'diplomatic_pouch',
        sentDate: new Date(),
        receivedDate: new Date(),
        responseRequired: messageData.coreContent.requestedAction ? true : false,
        responseDeadline: messageData.coreContent.deadline,
        urgency: messageData.coreContent.urgency,
        diplomaticProtocol: {
          synchronizedMessageId: messageId,
          messageType: messageData.messageType,
          receiverPerspective: receiverPerspective
        },
        translationRequired: false,
        translatedContent: {},
        encryptionLevel: this.getEncryptionLevel(messageData.coreContent.classification)
      });

      await client.query('COMMIT');

      return {
        senderMessage,
        receiverMessage,
        synchronizedMessage
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Send a response to a synchronized message
   */
  async sendSynchronizedResponse(
    respondingCivId: string,
    originalMessageId: string,
    responseData: {
      coreContent: CoreMessageContent;
      responderPerspective: Omit<CivilizationPerspective, 'civilizationId'>;
      attachments?: Omit<MessageAttachment, 'id'>[];
    }
  ): Promise<{
    responderMessage: DiplomaticCommunication;
    originalSenderMessage: DiplomaticCommunication;
    synchronizedResponse: DiplomaticMessage;
  }> {
    // Get the original message
    const originalMessage = await this.getSynchronizedMessage(originalMessageId);
    if (!originalMessage) {
      throw new Error(`Original message ${originalMessageId} not found`);
    }

    const originalSenderCivId = originalMessage.senderCivilizationId;
    
    return await this.sendSynchronizedMessage(
      respondingCivId,
      originalSenderCivId,
      {
        messageType: 'response',
        coreContent: {
          ...responseData.coreContent,
          subject: `Re: ${originalMessage.coreContent.subject}`
        },
        senderPerspective: responseData.responderPerspective,
        attachments: responseData.attachments
      }
    );
  }

  // ===== PERSPECTIVE GENERATION =====

  /**
   * Generate civilization-specific perspective using AI analysis
   */
  private async generateReceiverPerspective(
    receiverCivId: string,
    senderCivId: string,
    message: DiplomaticMessage
  ): Promise<CivilizationPerspective> {
    // Get civilization characteristics for context
    const receiverProfile = await this.getCivilizationProfile(receiverCivId);
    const senderProfile = await this.getCivilizationProfile(senderCivId);
    const relationship = await this.stateService.getDiplomaticRelations(receiverCivId);
    const currentRelation = relationship.find(r => r.targetCivilizationId === senderCivId);

    // AI prompt for generating perspective
    const perspectivePrompt = `
Analyze this diplomatic message from the perspective of ${receiverProfile.name}:

SENDER: ${senderProfile.name}
RECEIVER: ${receiverProfile.name}
CURRENT RELATIONSHIP: ${currentRelation?.status || 'neutral'} (Trust: ${currentRelation?.trustLevel || 0})

MESSAGE TYPE: ${message.messageType}
SUBJECT: ${message.coreContent.subject}
CONTENT: ${message.coreContent.factualContent}
PROPOSED TERMS: ${JSON.stringify(message.coreContent.proposedTerms || {})}

SENDER'S PERSPECTIVE:
- Interpretation: ${message.senderPerspective.interpretation}
- Analysis: ${message.senderPerspective.analysis}

RECEIVER CIVILIZATION PROFILE:
- Culture: ${receiverProfile.culture}
- Government Type: ${receiverProfile.governmentType}
- Economic System: ${receiverProfile.economicSystem}
- Strategic Priorities: ${receiverProfile.strategicPriorities.join(', ')}
- Historical Relations: ${receiverProfile.historicalContext}

Generate a comprehensive perspective analysis for ${receiverProfile.name} that includes:
1. How they interpret this message given their cultural and political context
2. Strategic analysis from their viewpoint
3. Recommended response options
4. Internal notes for their leadership
5. Cultural context and implications
6. Strategic implications for their civilization
7. Risk assessment with specific factors and mitigation strategies

Ensure the perspective is authentic to their civilization's characteristics and current relationship status.
`;

    // This would call an AI service in a real implementation
    // For now, we'll generate a structured response based on the relationship and civilization profiles
    const perspective: CivilizationPerspective = {
      civilizationId: receiverCivId,
      interpretation: this.generateInterpretation(receiverProfile, senderProfile, message, currentRelation),
      analysis: this.generateAnalysis(receiverProfile, senderProfile, message, currentRelation),
      recommendedResponse: this.generateRecommendedResponse(receiverProfile, message, currentRelation),
      internalNotes: this.generateInternalNotes(receiverProfile, senderProfile, message, currentRelation),
      culturalContext: this.generateCulturalContext(receiverProfile, message),
      strategicImplications: this.generateStrategicImplications(receiverProfile, message, currentRelation),
      riskAssessment: this.generateRiskAssessment(receiverProfile, senderProfile, message, currentRelation)
    };

    return perspective;
  }

  // ===== MESSAGE FORMATTING =====

  private formatMessageForSender(message: DiplomaticMessage): string {
    return `
DIPLOMATIC COMMUNICATION - SENT

TO: ${message.receiverCivilizationId}
SUBJECT: ${message.coreContent.subject}
CLASSIFICATION: ${message.coreContent.classification.toUpperCase()}
URGENCY: ${message.coreContent.urgency.toUpperCase()}

CORE MESSAGE:
${message.coreContent.factualContent}

${message.coreContent.proposedTerms ? `
PROPOSED TERMS:
${JSON.stringify(message.coreContent.proposedTerms, null, 2)}
` : ''}

${message.coreContent.requestedAction ? `
REQUESTED ACTION: ${message.coreContent.requestedAction}
` : ''}

${message.coreContent.deadline ? `
DEADLINE: ${message.coreContent.deadline.toISOString()}
` : ''}

OUR PERSPECTIVE:
Interpretation: ${message.senderPerspective.interpretation}

Strategic Analysis: ${message.senderPerspective.analysis}

${message.senderPerspective.recommendedResponse ? `
Recommended Follow-up: ${message.senderPerspective.recommendedResponse}
` : ''}

Cultural Context: ${message.senderPerspective.culturalContext}

Strategic Implications: ${message.senderPerspective.strategicImplications}

Risk Assessment: ${message.senderPerspective.riskAssessment.level.toUpperCase()}
Factors: ${message.senderPerspective.riskAssessment.factors.join(', ')}
Mitigation: ${message.senderPerspective.riskAssessment.mitigation.join(', ')}

INTERNAL NOTES:
${message.senderPerspective.internalNotes}

${message.attachments.length > 0 ? `
ATTACHMENTS:
${message.attachments.map(att => `- ${att.filename} (${att.type})`).join('\n')}
` : ''}

---
Message ID: ${message.id}
Synchronized Communication System
    `;
  }

  private formatMessageForReceiver(message: DiplomaticMessage): string {
    const receiverPerspective = message.receiverPerspective!;
    
    return `
DIPLOMATIC COMMUNICATION - RECEIVED

FROM: ${message.senderCivilizationId}
SUBJECT: ${message.coreContent.subject}
CLASSIFICATION: ${message.coreContent.classification.toUpperCase()}
URGENCY: ${message.coreContent.urgency.toUpperCase()}

CORE MESSAGE:
${message.coreContent.factualContent}

${message.coreContent.proposedTerms ? `
PROPOSED TERMS:
${JSON.stringify(message.coreContent.proposedTerms, null, 2)}
` : ''}

${message.coreContent.requestedAction ? `
REQUESTED ACTION: ${message.coreContent.requestedAction}
` : ''}

${message.coreContent.deadline ? `
RESPONSE DEADLINE: ${message.coreContent.deadline.toISOString()}
` : ''}

OUR ANALYSIS:
Interpretation: ${receiverPerspective.interpretation}

Strategic Assessment: ${receiverPerspective.analysis}

Recommended Response: ${receiverPerspective.recommendedResponse}

Cultural Context: ${receiverPerspective.culturalContext}

Strategic Implications: ${receiverPerspective.strategicImplications}

Risk Assessment: ${receiverPerspective.riskAssessment.level.toUpperCase()}
Risk Factors: ${receiverPerspective.riskAssessment.factors.join(', ')}
Mitigation Strategies: ${receiverPerspective.riskAssessment.mitigation.join(', ')}

CONFIDENTIAL INTERNAL NOTES:
${receiverPerspective.internalNotes}

${message.attachments.length > 0 ? `
ATTACHMENTS:
${message.attachments.map(att => `- ${att.filename} (${att.type})`).join('\n')}
` : ''}

---
Message ID: ${message.id}
Synchronized Communication System
    `;
  }

  // ===== DATABASE OPERATIONS =====

  private async storeSynchronizedMessage(message: DiplomaticMessage): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO synchronized_diplomatic_messages (
          id, message_type, sender_civilization_id, receiver_civilization_id,
          core_content, sender_perspective, receiver_perspective, status,
          timestamp, response_deadline, linked_message_id, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        message.id,
        message.messageType,
        message.senderCivilizationId,
        message.receiverCivilizationId,
        JSON.stringify(message.coreContent),
        JSON.stringify(message.senderPerspective),
        message.receiverPerspective ? JSON.stringify(message.receiverPerspective) : null,
        message.status,
        message.timestamp,
        message.responseDeadline,
        message.linkedMessageId,
        JSON.stringify(message.attachments)
      ]);
    } finally {
      client.release();
    }
  }

  private async updateSynchronizedMessage(message: DiplomaticMessage): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        UPDATE synchronized_diplomatic_messages 
        SET 
          receiver_perspective = $2,
          status = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [
        message.id,
        JSON.stringify(message.receiverPerspective),
        message.status
      ]);
    } finally {
      client.release();
    }
  }

  private async getSynchronizedMessage(messageId: string): Promise<DiplomaticMessage | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM synchronized_diplomatic_messages WHERE id = $1
      `, [messageId]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        id: row.id,
        messageType: row.message_type,
        senderCivilizationId: row.sender_civilization_id,
        receiverCivilizationId: row.receiver_civilization_id,
        coreContent: row.core_content,
        senderPerspective: row.sender_perspective,
        receiverPerspective: row.receiver_perspective,
        status: row.status,
        timestamp: row.timestamp,
        responseDeadline: row.response_deadline,
        linkedMessageId: row.linked_message_id,
        attachments: row.attachments || []
      };
    } finally {
      client.release();
    }
  }

  // ===== HELPER METHODS =====

  private mapMessageTypeToCommunicationType(messageType: DiplomaticMessage['messageType']): string {
    const mapping = {
      'treaty_proposal': 'proposal',
      'trade_offer': 'proposal',
      'alliance_request': 'proposal',
      'diplomatic_note': 'note',
      'protest': 'protest',
      'invitation': 'invitation',
      'response': 'response'
    };
    return mapping[messageType] || 'note';
  }

  private getEncryptionLevel(classification: string): number {
    const levels = {
      'public': 1,
      'diplomatic': 2,
      'confidential': 3,
      'secret': 4
    };
    return levels[classification] || 2;
  }

  // ===== PLACEHOLDER METHODS FOR AI GENERATION =====
  // These would be replaced with actual AI service calls

  private async getCivilizationProfile(civId: string): Promise<any> {
    // Placeholder - would fetch from civilization database
    return {
      name: civId,
      culture: 'Advanced',
      governmentType: 'Democratic',
      economicSystem: 'Mixed',
      strategicPriorities: ['Security', 'Trade', 'Technology'],
      historicalContext: 'Peaceful expansion focused'
    };
  }

  private generateInterpretation(receiverProfile: any, senderProfile: any, message: DiplomaticMessage, relation: any): string {
    const trustLevel = relation?.trustLevel || 0;
    const messageType = message.messageType;
    
    if (trustLevel > 50) {
      return `This ${messageType} from ${senderProfile.name} appears to be a genuine diplomatic overture. Given our positive relationship, we should consider this proposal seriously.`;
    } else if (trustLevel < -20) {
      return `This ${messageType} from ${senderProfile.name} should be viewed with significant skepticism. Their past actions suggest potential ulterior motives.`;
    } else {
      return `This ${messageType} from ${senderProfile.name} requires careful analysis. We should proceed cautiously while remaining open to legitimate cooperation.`;
    }
  }

  private generateAnalysis(receiverProfile: any, senderProfile: any, message: DiplomaticMessage, relation: any): string {
    return `Strategic analysis indicates this ${message.messageType} aligns with ${senderProfile.name}'s known objectives. The proposed terms should be evaluated against our current strategic priorities and long-term goals.`;
  }

  private generateRecommendedResponse(receiverProfile: any, message: DiplomaticMessage, relation: any): string {
    if (message.coreContent.requestedAction) {
      return `Recommend formal response within diplomatic protocols. Consider counter-proposals that align with our strategic interests.`;
    }
    return `Acknowledge receipt and request additional time for internal consultation before providing substantive response.`;
  }

  private generateInternalNotes(receiverProfile: any, senderProfile: any, message: DiplomaticMessage, relation: any): string {
    return `Internal assessment: Monitor for consistency with ${senderProfile.name}'s previous diplomatic positions. Consult with relevant department heads before formulating response.`;
  }

  private generateCulturalContext(receiverProfile: any, message: DiplomaticMessage): string {
    return `This type of ${message.messageType} is consistent with standard diplomatic protocols. The formal tone and structured approach align with expected inter-civilization communication norms.`;
  }

  private generateStrategicImplications(receiverProfile: any, message: DiplomaticMessage, relation: any): string {
    return `Accepting this proposal could strengthen our position in the region while potentially creating new obligations. Rejection might strain relations but preserve strategic flexibility.`;
  }

  private generateRiskAssessment(receiverProfile: any, senderProfile: any, message: DiplomaticMessage, relation: any): any {
    const trustLevel = relation?.trustLevel || 0;
    
    if (trustLevel > 50) {
      return {
        level: 'low' as const,
        factors: ['Established trust', 'Clear terms', 'Mutual benefit'],
        mitigation: ['Standard verification procedures', 'Phased implementation']
      };
    } else if (trustLevel < -20) {
      return {
        level: 'high' as const,
        factors: ['Low trust relationship', 'Potential hidden agenda', 'Historical tensions'],
        mitigation: ['Enhanced verification', 'Limited initial commitment', 'Exit clauses']
      };
    } else {
      return {
        level: 'medium' as const,
        factors: ['Neutral relationship', 'Standard diplomatic risks', 'Unknown long-term intentions'],
        mitigation: ['Careful review', 'Consultation with allies', 'Gradual engagement']
      };
    }
  }
}

export default DiplomaticSynchronizationService;
