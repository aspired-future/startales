/**
 * State Department API Routes
 * 
 * REST API endpoints for the Secretary of State and State Department operations
 * Handles foreign relations, diplomatic communications, treaty management, and embassy operations
 */

import { Router, Request, Response } from 'express';
import { getPool } from '../storage/db.js';
import { StateSecretaryService } from './StateSecretaryService.js';

const router = Router();

// Initialize service with database pool
const stateService = new StateSecretaryService(getPool());

// ===== DIPLOMATIC RELATIONS ENDPOINTS =====

/**
 * GET /api/state/relations
 * Get diplomatic relations for a civilization
 */
router.get('/relations', async (req: Request, res: Response) => {
  try {
    const { civilizationId } = req.query;

    if (!civilizationId) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID is required'
      });
    }

    const relations = await stateService.getDiplomaticRelations(civilizationId as string);

    res.json({
      success: true,
      data: relations,
      count: relations.length
    });
  } catch (error) {
    console.error('Failed to get diplomatic relations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve diplomatic relations'
    });
  }
});

/**
 * PUT /api/state/relations
 * Update diplomatic relation between two civilizations
 */
router.put('/relations', async (req: Request, res: Response) => {
  try {
    const { civilizationId, targetCivilizationId, updates } = req.body;

    if (!civilizationId || !targetCivilizationId || !updates) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID, target civilization ID, and updates are required'
      });
    }

    const relation = await stateService.updateDiplomaticRelation(
      civilizationId,
      targetCivilizationId,
      updates
    );

    res.json({
      success: true,
      data: relation
    });
  } catch (error) {
    console.error('Failed to update diplomatic relation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update diplomatic relation'
    });
  }
});

/**
 * POST /api/state/relations/event
 * Record a diplomatic event between civilizations
 */
router.post('/relations/event', async (req: Request, res: Response) => {
  try {
    const { civilizationId, targetCivilizationId, event } = req.body;

    if (!civilizationId || !targetCivilizationId || !event) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID, target civilization ID, and event are required'
      });
    }

    await stateService.recordDiplomaticEvent(civilizationId, targetCivilizationId, event);

    res.json({
      success: true,
      message: 'Diplomatic event recorded successfully'
    });
  } catch (error) {
    console.error('Failed to record diplomatic event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record diplomatic event'
    });
  }
});

// ===== TREATIES ENDPOINTS =====

/**
 * GET /api/state/treaties
 * Get treaties for a civilization
 */
router.get('/treaties', async (req: Request, res: Response) => {
  try {
    const { civilizationId, status } = req.query;

    const treaties = await stateService.getTreaties(
      civilizationId as string,
      status as string
    );

    res.json({
      success: true,
      data: treaties,
      count: treaties.length
    });
  } catch (error) {
    console.error('Failed to get treaties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve treaties'
    });
  }
});

/**
 * POST /api/state/treaties
 * Create a new treaty
 */
router.post('/treaties', async (req: Request, res: Response) => {
  try {
    const treatyData = req.body;

    if (!treatyData.name || !treatyData.type || !treatyData.parties) {
      return res.status(400).json({
        success: false,
        error: 'Treaty name, type, and parties are required'
      });
    }

    const treaty = await stateService.createTreaty(treatyData);

    res.status(201).json({
      success: true,
      data: treaty
    });
  } catch (error) {
    console.error('Failed to create treaty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create treaty'
    });
  }
});

/**
 * PUT /api/state/treaties/:id/status
 * Update treaty status
 */
router.put('/treaties/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, additionalData } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const treaty = await stateService.updateTreatyStatus(id, status, additionalData);

    res.json({
      success: true,
      data: treaty
    });
  } catch (error) {
    console.error('Failed to update treaty status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update treaty status'
    });
  }
});

// ===== EMBASSIES ENDPOINTS =====

/**
 * GET /api/state/embassies
 * Get embassies for a civilization
 */
router.get('/embassies', async (req: Request, res: Response) => {
  try {
    const { civilizationId } = req.query;

    const embassies = await stateService.getEmbassies(civilizationId as string);

    res.json({
      success: true,
      data: embassies,
      count: embassies.length
    });
  } catch (error) {
    console.error('Failed to get embassies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve embassies'
    });
  }
});

/**
 * POST /api/state/embassies
 * Establish a new embassy
 */
router.post('/embassies', async (req: Request, res: Response) => {
  try {
    const embassyData = req.body;

    if (!embassyData.hostCivilizationId || !embassyData.guestCivilizationId || !embassyData.location) {
      return res.status(400).json({
        success: false,
        error: 'Host civilization ID, guest civilization ID, and location are required'
      });
    }

    const embassy = await stateService.establishEmbassy(embassyData);

    res.status(201).json({
      success: true,
      data: embassy
    });
  } catch (error) {
    console.error('Failed to establish embassy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to establish embassy'
    });
  }
});

// ===== SYNCHRONIZED DIPLOMATIC COMMUNICATIONS ENDPOINTS =====

/**
 * POST /api/state/synchronized-message
 * Send a synchronized diplomatic message between civilizations
 */
router.post('/synchronized-message', async (req: Request, res: Response) => {
  try {
    const { 
      senderCivilizationId, 
      receiverCivilizationId, 
      messageType,
      subject,
      content,
      proposedTerms,
      requestedAction,
      deadline,
      urgency,
      classification,
      senderAnalysis,
      attachments
    } = req.body;

    if (!senderCivilizationId || !receiverCivilizationId || !messageType || !subject || !content || !senderAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'Sender civilization ID, receiver civilization ID, message type, subject, content, and sender analysis are required'
      });
    }

    const result = await stateService.sendSynchronizedDiplomaticMessage(
      senderCivilizationId,
      receiverCivilizationId,
      {
        messageType,
        subject,
        content,
        proposedTerms,
        requestedAction,
        deadline: deadline ? new Date(deadline) : undefined,
        urgency: urgency || 'normal',
        classification: classification || 'diplomatic',
        senderAnalysis,
        attachments
      }
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Synchronized diplomatic message sent successfully'
    });
  } catch (error) {
    console.error('Failed to send synchronized diplomatic message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send synchronized diplomatic message'
    });
  }
});

/**
 * POST /api/state/synchronized-response
 * Send a synchronized response to a diplomatic message
 */
router.post('/synchronized-response', async (req: Request, res: Response) => {
  try {
    const {
      respondingCivilizationId,
      originalMessageId,
      subject,
      content,
      proposedTerms,
      requestedAction,
      deadline,
      urgency,
      classification,
      responderAnalysis,
      attachments
    } = req.body;

    if (!respondingCivilizationId || !originalMessageId || !subject || !content || !responderAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'Responding civilization ID, original message ID, subject, content, and responder analysis are required'
      });
    }

    const result = await stateService.sendSynchronizedResponse(
      respondingCivilizationId,
      originalMessageId,
      {
        subject,
        content,
        proposedTerms,
        requestedAction,
        deadline: deadline ? new Date(deadline) : undefined,
        urgency: urgency || 'normal',
        classification: classification || 'diplomatic',
        responderAnalysis,
        attachments
      }
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Synchronized diplomatic response sent successfully'
    });
  } catch (error) {
    console.error('Failed to send synchronized diplomatic response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send synchronized diplomatic response'
    });
  }
});

// ===== DIPLOMATIC COMMUNICATIONS ENDPOINTS =====

/**
 * GET /api/state/communications
 * Get diplomatic communications for a civilization
 */
router.get('/communications', async (req: Request, res: Response) => {
  try {
    const { civilizationId, type, classification, urgency, responseRequired } = req.query;

    if (!civilizationId) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID is required'
      });
    }

    const filters: any = {};
    if (type) filters.type = type;
    if (classification) filters.classification = classification;
    if (urgency) filters.urgency = urgency;
    if (responseRequired !== undefined) filters.responseRequired = responseRequired === 'true';

    const communications = await stateService.getDiplomaticCommunications(
      civilizationId as string,
      filters
    );

    res.json({
      success: true,
      data: communications,
      count: communications.length
    });
  } catch (error) {
    console.error('Failed to get diplomatic communications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve diplomatic communications'
    });
  }
});

/**
 * POST /api/state/communications
 * Send a diplomatic communication
 */
router.post('/communications', async (req: Request, res: Response) => {
  try {
    const communicationData = req.body;

    if (!communicationData.senderCivilizationId || 
        !communicationData.receiverCivilizationId || 
        !communicationData.subject || 
        !communicationData.content) {
      return res.status(400).json({
        success: false,
        error: 'Sender civilization ID, receiver civilization ID, subject, and content are required'
      });
    }

    // Set default values
    communicationData.sentDate = communicationData.sentDate || new Date();
    communicationData.communicationType = communicationData.communicationType || 'note';
    communicationData.channel = communicationData.channel || 'official';
    communicationData.classification = communicationData.classification || 'unclassified';
    communicationData.deliveryMethod = communicationData.deliveryMethod || 'diplomatic_pouch';
    communicationData.urgency = communicationData.urgency || 'normal';
    communicationData.responseRequired = communicationData.responseRequired || false;
    communicationData.translationRequired = communicationData.translationRequired || false;
    communicationData.encryptionLevel = communicationData.encryptionLevel || 1;
    communicationData.attachments = communicationData.attachments || [];
    communicationData.diplomaticProtocol = communicationData.diplomaticProtocol || {};
    communicationData.translatedContent = communicationData.translatedContent || {};

    const communication = await stateService.sendDiplomaticCommunication(communicationData);

    res.status(201).json({
      success: true,
      data: communication
    });
  } catch (error) {
    console.error('Failed to send diplomatic communication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send diplomatic communication'
    });
  }
});

// ===== STATE DEPARTMENT DASHBOARD =====

/**
 * GET /api/state/dashboard
 * Get comprehensive State Department dashboard data
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const { civilizationId } = req.query;

    if (!civilizationId) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID is required'
      });
    }

    const dashboard = await stateService.getStateDepartmentDashboard(civilizationId as string);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Failed to get State Department dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve State Department dashboard'
    });
  }
});

// ===== DIPLOMATIC ACTIONS ENDPOINTS =====

/**
 * POST /api/state/actions/initiate-contact
 * Initiate diplomatic contact with another civilization
 */
router.post('/actions/initiate-contact', async (req: Request, res: Response) => {
  try {
    const { civilizationId, targetCivilizationId, contactType, message } = req.body;

    if (!civilizationId || !targetCivilizationId || !contactType) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID, target civilization ID, and contact type are required'
      });
    }

    // Create synchronized diplomatic communication for initial contact
    const result = await stateService.sendSynchronizedDiplomaticMessage(
      civilizationId,
      targetCivilizationId,
      {
        messageType: 'diplomatic_note',
        subject: `Diplomatic Contact - ${contactType}`,
        content: message || `Greetings from ${civilizationId}. We seek to establish diplomatic relations.`,
        urgency: 'normal',
        classification: 'diplomatic',
        senderAnalysis: {
          interpretation: `We are initiating formal diplomatic contact with ${targetCivilizationId} to establish relations.`,
          strategicAnalysis: `Opening diplomatic channels could lead to beneficial trade, security, and cultural exchange opportunities.`,
          recommendedResponse: `Await their response and be prepared to discuss mutual interests and cooperation frameworks.`,
          internalNotes: `First contact initiative. Monitor their response for indicators of their diplomatic stance and potential cooperation areas.`,
          culturalContext: `Standard diplomatic protocol for inter-civilization contact. Formal but friendly approach.`,
          strategicImplications: `Successful contact could open new strategic partnerships and regional influence opportunities.`,
          riskLevel: 'low',
          riskFactors: ['Unknown diplomatic stance', 'Potential cultural misunderstandings'],
          mitigation: ['Careful protocol adherence', 'Cultural sensitivity training for diplomatic staff']
        }
      }
    );

    // Record diplomatic event
    await stateService.recordDiplomaticEvent(civilizationId, targetCivilizationId, {
      date: new Date(),
      type: 'diplomatic_contact',
      description: `Initiated diplomatic contact - ${contactType}`,
      impact: {
        trustLevel: 5 // Small positive impact for initiating contact
      }
    });

    res.json({
      success: true,
      data: {
        senderMessage: result.senderMessage,
        receiverMessage: result.receiverMessage,
        messageId: result.messageId,
        message: 'Diplomatic contact initiated successfully'
      }
    });
  } catch (error) {
    console.error('Failed to initiate diplomatic contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate diplomatic contact'
    });
  }
});

/**
 * POST /api/state/actions/propose-treaty
 * Propose a new treaty to another civilization
 */
router.post('/actions/propose-treaty', async (req: Request, res: Response) => {
  try {
    const { civilizationId, targetCivilizationId, treatyType, terms, message } = req.body;

    if (!civilizationId || !targetCivilizationId || !treatyType || !terms) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID, target civilization ID, treaty type, and terms are required'
      });
    }

    // Create draft treaty
    const treaty = await stateService.createTreaty({
      name: `${treatyType} Treaty between ${civilizationId} and ${targetCivilizationId}`,
      type: treatyType,
      status: 'draft',
      parties: [civilizationId, targetCivilizationId],
      terms: terms,
      economicProvisions: terms.economic || {},
      militaryProvisions: terms.military || {},
      culturalProvisions: terms.cultural || {},
      tradeProvisions: terms.trade || {},
      durationYears: terms.duration,
      autoRenewal: terms.autoRenewal || false,
      negotiationStartDate: new Date(),
      negotiatedBy: civilizationId,
      signedBy: {},
      ratifiedBy: {},
      amendments: [],
      complianceStatus: {},
      violationReports: []
    });

    // Send synchronized diplomatic communication about treaty proposal
    const communicationResult = await stateService.sendSynchronizedDiplomaticMessage(
      civilizationId,
      targetCivilizationId,
      {
        messageType: 'treaty_proposal',
        subject: `Treaty Proposal - ${treatyType}`,
        content: message || `We propose the following ${treatyType} treaty for your consideration.`,
        proposedTerms: terms,
        requestedAction: 'Review and respond to treaty proposal',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        urgency: 'normal',
        classification: 'confidential',
        senderAnalysis: {
          interpretation: `We are proposing a ${treatyType} treaty that we believe will be mutually beneficial.`,
          strategicAnalysis: `This treaty aligns with our strategic objectives and should provide significant advantages to both parties.`,
          recommendedResponse: `Monitor their response timeline and be prepared for counter-proposals or negotiation requests.`,
          internalNotes: `Treaty proposal sent. Key negotiation points identified. Prepare fallback positions for potential counter-offers.`,
          culturalContext: `Formal treaty proposal following standard diplomatic protocols. Professional and comprehensive approach.`,
          strategicImplications: `Successful treaty could significantly enhance our regional position and provide long-term strategic benefits.`,
          riskLevel: 'medium',
          riskFactors: ['Potential rejection', 'Counter-proposals may be unfavorable', 'Negotiation timeline pressure'],
          mitigation: ['Flexible negotiation stance', 'Alternative treaty partners identified', 'Clear minimum acceptable terms defined']
        },
        attachments: [
          {
            type: 'treaty_draft',
            filename: `${treatyType}_Treaty_Draft.pdf`,
            data: {
              treatyId: treaty.id,
              treatyType: treatyType,
              proposedTerms: terms,
              parties: [civilizationId, targetCivilizationId]
            },
            annotations: 'Comprehensive treaty draft with detailed terms and implementation timeline'
          }
        ]
      }
    );

    res.json({
      success: true,
      data: {
        treaty,
        senderMessage: communicationResult.senderMessage,
        receiverMessage: communicationResult.receiverMessage,
        messageId: communicationResult.messageId,
        message: 'Treaty proposal sent successfully'
      }
    });
  } catch (error) {
    console.error('Failed to propose treaty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to propose treaty'
    });
  }
});

/**
 * POST /api/state/actions/establish-embassy
 * Request to establish an embassy in another civilization's territory
 */
router.post('/actions/establish-embassy', async (req: Request, res: Response) => {
  try {
    const { civilizationId, hostCivilizationId, location, embassyType, staffCount, services } = req.body;

    if (!civilizationId || !hostCivilizationId || !location) {
      return res.status(400).json({
        success: false,
        error: 'Civilization ID, host civilization ID, and location are required'
      });
    }

    // Send diplomatic communication requesting embassy establishment
    const communication = await stateService.sendDiplomaticCommunication({
      senderCivilizationId: civilizationId,
      receiverCivilizationId: hostCivilizationId,
      communicationType: 'proposal',
      channel: 'official',
      classification: 'confidential',
      subject: 'Embassy Establishment Request',
      content: `We formally request permission to establish a ${embassyType || 'full'} embassy in ${location}. This embassy will facilitate diplomatic relations and provide consular services.`,
      attachments: [],
      deliveryMethod: 'diplomatic_pouch',
      sentDate: new Date(),
      responseRequired: true,
      responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      urgency: 'normal',
      diplomaticProtocol: {
        requestType: 'embassy_establishment',
        location,
        embassyType: embassyType || 'full',
        staffCount: staffCount || 20,
        services: services || ['consular', 'visa', 'trade']
      },
      translationRequired: false,
      translatedContent: {},
      encryptionLevel: 2
    });

    res.json({
      success: true,
      data: {
        communication,
        message: 'Embassy establishment request sent successfully'
      }
    });
  } catch (error) {
    console.error('Failed to request embassy establishment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to request embassy establishment'
    });
  }
});

export default router;
