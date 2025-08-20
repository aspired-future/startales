import express from 'express';
import { getPool } from '../storage/db.js';
import { CommunicationsSecretaryService } from './CommunicationsSecretaryService.js';

const router = express.Router();

// Initialize service
const getCommunicationsService = () => new CommunicationsSecretaryService(getPool());

// ===== COMMUNICATIONS OPERATIONS MANAGEMENT =====

/**
 * POST /api/communications/operations - Create communications operation
 */
router.post('/operations', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const {
      campaignId,
      operationType,
      title,
      description,
      priority,
      operationData,
      targetAudiences,
      mediaChannels,
      expectedReach,
      plannedStartDate,
      plannedCompletionDate,
      successMetrics,
      authorizedBy,
      approvalLevel
    } = req.body;

    if (!campaignId || !operationType || !title || !description || !authorizedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'operationType', 'title', 'description', 'authorizedBy']
      });
    }

    const operation = await service.createCommunicationsOperation({
      campaignId: Number(campaignId),
      operationType,
      title,
      description,
      priority,
      operationData,
      targetAudiences,
      mediaChannels,
      expectedReach: expectedReach ? Number(expectedReach) : undefined,
      plannedStartDate: plannedStartDate ? new Date(plannedStartDate) : undefined,
      plannedCompletionDate: plannedCompletionDate ? new Date(plannedCompletionDate) : undefined,
      successMetrics,
      authorizedBy,
      approvalLevel
    });

    res.json({
      success: true,
      operation,
      message: `Communications operation "${title}" created successfully`
    });
  } catch (error) {
    console.error('Error creating communications operation:', error);
    res.status(500).json({
      error: 'Failed to create communications operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/operations - List communications operations
 */
router.get('/operations', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId, operationType, status, priority, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const operations = await service.getCommunicationsOperations(Number(campaignId), {
      operationType: operationType as string,
      status: status as string,
      priority: priority as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      operations,
      count: operations.length
    });
  } catch (error) {
    console.error('Error fetching communications operations:', error);
    res.status(500).json({
      error: 'Failed to fetch communications operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== MEDIA STRATEGY MANAGEMENT =====

/**
 * POST /api/communications/strategies - Create media strategy
 */
router.post('/strategies', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const {
      campaignId,
      strategyName,
      strategyType,
      description,
      objectives,
      targetDemographics,
      keyMessages,
      primaryChannels,
      strategyDurationDays,
      startDate,
      endDate,
      allocatedBudget,
      strategyManager
    } = req.body;

    if (!campaignId || !strategyName || !strategyType || !description || !startDate || !endDate || !strategyManager) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'strategyName', 'strategyType', 'description', 'startDate', 'endDate', 'strategyManager']
      });
    }

    const strategy = await service.createMediaStrategy({
      campaignId: Number(campaignId),
      strategyName,
      strategyType,
      description,
      objectives,
      targetDemographics,
      keyMessages,
      primaryChannels,
      strategyDurationDays: strategyDurationDays ? Number(strategyDurationDays) : undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      allocatedBudget: allocatedBudget ? Number(allocatedBudget) : undefined,
      strategyManager
    });

    res.json({
      success: true,
      strategy,
      message: `Media strategy "${strategyName}" created successfully`
    });
  } catch (error) {
    console.error('Error creating media strategy:', error);
    res.status(500).json({
      error: 'Failed to create media strategy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/strategies - List media strategies
 */
router.get('/strategies', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId, strategyType, status } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const strategies = await service.getMediaStrategies(Number(campaignId), {
      strategyType: strategyType as string,
      status: status as string
    });

    res.json({
      success: true,
      strategies,
      count: strategies.length
    });
  } catch (error) {
    console.error('Error fetching media strategies:', error);
    res.status(500).json({
      error: 'Failed to fetch media strategies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PRESS CONFERENCE MANAGEMENT =====

/**
 * POST /api/communications/press-conferences - Schedule press conference
 */
router.post('/press-conferences', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const {
      campaignId,
      conferenceTitle,
      conferenceType,
      description,
      mainTopics,
      keySpeakers,
      scheduledDate,
      durationMinutes,
      location,
      venueCapacity,
      organizedBy
    } = req.body;

    if (!campaignId || !conferenceTitle || !conferenceType || !description || !scheduledDate || !location || !organizedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'conferenceTitle', 'conferenceType', 'description', 'scheduledDate', 'location', 'organizedBy']
      });
    }

    const conference = await service.schedulePressConference({
      campaignId: Number(campaignId),
      conferenceTitle,
      conferenceType,
      description,
      mainTopics,
      keySpeakers,
      scheduledDate: new Date(scheduledDate),
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      location,
      venueCapacity: venueCapacity ? Number(venueCapacity) : undefined,
      organizedBy
    });

    res.json({
      success: true,
      conference,
      message: `Press conference "${conferenceTitle}" scheduled successfully`
    });
  } catch (error) {
    console.error('Error scheduling press conference:', error);
    res.status(500).json({
      error: 'Failed to schedule press conference',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/press-conferences - List press conferences
 */
router.get('/press-conferences', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId, conferenceType, status, upcoming } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const conferences = await service.getPressConferences(Number(campaignId), {
      conferenceType: conferenceType as string,
      status: status as string,
      upcoming: upcoming === 'true'
    });

    res.json({
      success: true,
      conferences,
      count: conferences.length
    });
  } catch (error) {
    console.error('Error fetching press conferences:', error);
    res.status(500).json({
      error: 'Failed to fetch press conferences',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PUBLIC MESSAGING MANAGEMENT =====

/**
 * POST /api/communications/messages - Create public message
 */
router.post('/messages', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const {
      campaignId,
      messageTitle,
      messageType,
      messageContent,
      keyPoints,
      callToAction,
      targetAudiences,
      distributionChannels,
      scheduledRelease,
      messageUrgency,
      createdBy
    } = req.body;

    if (!campaignId || !messageTitle || !messageType || !messageContent || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'messageTitle', 'messageType', 'messageContent', 'createdBy']
      });
    }

    const message = await service.createPublicMessage({
      campaignId: Number(campaignId),
      messageTitle,
      messageType,
      messageContent,
      keyPoints,
      callToAction,
      targetAudiences,
      distributionChannels,
      scheduledRelease: scheduledRelease ? new Date(scheduledRelease) : undefined,
      messageUrgency,
      createdBy
    });

    res.json({
      success: true,
      message,
      messageResponse: `Public message "${messageTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating public message:', error);
    res.status(500).json({
      error: 'Failed to create public message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/messages - List public messages
 */
router.get('/messages', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId, messageType, approvalStatus, urgency } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const messages = await service.getPublicMessages(Number(campaignId), {
      messageType: messageType as string,
      approvalStatus: approvalStatus as string,
      urgency: urgency as string
    });

    res.json({
      success: true,
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching public messages:', error);
    res.status(500).json({
      error: 'Failed to fetch public messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/communications/messages/:id/approve - Approve public message
 */
router.post('/messages/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({
        error: 'Missing required field: approvedBy'
      });
    }

    // This would update the message approval status
    res.json({
      success: true,
      message: 'Message approved successfully',
      messageId: id,
      approvedBy
    });
  } catch (error) {
    console.error('Error approving message:', error);
    res.status(500).json({
      error: 'Failed to approve message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== MEDIA RELATIONSHIPS MANAGEMENT =====

/**
 * POST /api/communications/media-outlets - Register media outlet
 */
router.post('/media-outlets', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const {
      campaignId,
      outletName,
      outletType,
      outletDescription,
      primaryAudience,
      politicalLeaning,
      credibilityRating,
      reachEstimate,
      relationshipManager
    } = req.body;

    if (!campaignId || !outletName || !outletType || !relationshipManager) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'outletName', 'outletType', 'relationshipManager']
      });
    }

    const outlet = await service.registerMediaOutlet({
      campaignId: Number(campaignId),
      outletName,
      outletType,
      outletDescription,
      primaryAudience,
      politicalLeaning,
      credibilityRating: credibilityRating ? Number(credibilityRating) : undefined,
      reachEstimate: reachEstimate ? Number(reachEstimate) : undefined,
      relationshipManager
    });

    res.json({
      success: true,
      outlet,
      message: `Media outlet "${outletName}" registered successfully`
    });
  } catch (error) {
    console.error('Error registering media outlet:', error);
    res.status(500).json({
      error: 'Failed to register media outlet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/media-outlets - List media outlets
 */
router.get('/media-outlets', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId, outletType, relationshipStatus, accessLevel } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const outlets = await service.getMediaRelationships(Number(campaignId), {
      outletType: outletType as string,
      relationshipStatus: relationshipStatus as string,
      accessLevel: accessLevel as string
    });

    res.json({
      success: true,
      outlets,
      count: outlets.length
    });
  } catch (error) {
    console.error('Error fetching media outlets:', error);
    res.status(500).json({
      error: 'Failed to fetch media outlets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== LEADER COMMUNICATIONS INTEGRATION =====

/**
 * GET /api/communications/leader-integration - Leader communications integration
 */
router.get('/leader-integration', async (req, res) => {
  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Integration with existing leader communications system
    const leaderCommunications = {
      recentBriefings: [
        {
          id: 'brief-001',
          title: 'Economic Policy Update',
          date: new Date().toISOString(),
          type: 'policy_briefing',
          status: 'completed',
          mediaPresence: true
        },
        {
          id: 'brief-002',
          title: 'Defense Readiness Report',
          date: new Date(Date.now() - 86400000).toISOString(),
          type: 'security_briefing',
          status: 'completed',
          mediaPresence: false
        }
      ],
      upcomingSpeeches: [
        {
          id: 'speech-001',
          title: 'State of the Nation Address',
          scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          venue: 'Parliament Hall',
          expectedAudience: 50000000,
          mediaStrategy: 'full_coverage'
        }
      ],
      communicationMetrics: {
        publicApprovalRating: 67.5,
        mediaFavorability: 58.2,
        messageReach: 12500000,
        engagementRate: 4.8
      }
    };

    res.json({
      success: true,
      leaderCommunications,
      integrationStatus: 'active',
      message: 'Leader communications integration data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching leader communications integration:', error);
    res.status(500).json({
      error: 'Failed to fetch leader communications integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/communications/coordinate-leader-message - Coordinate leader message across platforms
 */
router.post('/coordinate-leader-message', async (req, res) => {
  try {
    const {
      campaignId,
      messageTitle,
      messageContent,
      targetPlatforms,
      scheduledRelease,
      priority,
      approvalLevel
    } = req.body;

    if (!campaignId || !messageTitle || !messageContent || !targetPlatforms) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'messageTitle', 'messageContent', 'targetPlatforms']
      });
    }

    // Coordinate message across multiple platforms
    const coordination = {
      messageId: `coord-${Date.now()}`,
      platforms: targetPlatforms,
      status: 'coordinated',
      estimatedReach: targetPlatforms.length * 1000000,
      scheduledFor: scheduledRelease || new Date().toISOString(),
      crossPlatformStrategy: {
        news: targetPlatforms.includes('news') ? 'Press release distribution' : null,
        witter: targetPlatforms.includes('witter') ? 'Official account posting' : null,
        television: targetPlatforms.includes('television') ? 'Broadcast coordination' : null,
        radio: targetPlatforms.includes('radio') ? 'Radio interview scheduling' : null
      }
    };

    res.json({
      success: true,
      coordination,
      message: `Leader message "${messageTitle}" coordinated across ${targetPlatforms.length} platforms`
    });
  } catch (error) {
    console.error('Error coordinating leader message:', error);
    res.status(500).json({
      error: 'Failed to coordinate leader message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== NEWS AND WITTER INTEGRATION =====

/**
 * GET /api/communications/news-integration - News system integration
 */
router.get('/news-integration', async (req, res) => {
  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Integration with existing news system
    const newsIntegration = {
      activeNewsOutlets: 15,
      governmentPressReleases: 8,
      mediaCoverageToday: 23,
      sentimentAnalysis: {
        positive: 45,
        neutral: 35,
        negative: 20
      },
      topStories: [
        {
          headline: 'Government Announces New Infrastructure Investment',
          outlet: 'National News Network',
          sentiment: 'positive',
          reach: 2500000
        },
        {
          headline: 'Economic Policy Changes Take Effect',
          outlet: 'Business Daily',
          sentiment: 'neutral',
          reach: 1800000
        }
      ],
      integrationCapabilities: [
        'Press release distribution',
        'News outlet coordination',
        'Story priority influence',
        'Coverage sentiment monitoring'
      ]
    };

    res.json({
      success: true,
      newsIntegration,
      message: 'News system integration data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching news integration:', error);
    res.status(500).json({
      error: 'Failed to fetch news integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/witter-integration - Witter platform integration
 */
router.get('/witter-integration', async (req, res) => {
  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Integration with existing Witter platform
    const witterIntegration = {
      officialAccounts: [
        { handle: '@GovernmentOfficial', followers: 5200000, verified: true },
        { handle: '@LeaderOfficial', followers: 8900000, verified: true },
        { handle: '@PressSecretary', followers: 2100000, verified: true }
      ],
      todayMetrics: {
        postsPublished: 12,
        totalEngagement: 450000,
        reach: 12500000,
        mentions: 8900,
        sentiment: 62.5
      },
      trendingTopics: [
        '#EconomicPolicy',
        '#InfrastructureInvestment',
        '#GovernmentUpdate'
      ],
      integrationCapabilities: [
        'Official account coordination',
        'Trending topic influence',
        'Crisis communication rapid response',
        'Public sentiment monitoring',
        'Counter-narrative deployment'
      ]
    };

    res.json({
      success: true,
      witterIntegration,
      message: 'Witter platform integration data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching Witter integration:', error);
    res.status(500).json({
      error: 'Failed to fetch Witter integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS AND REPORTING =====

/**
 * GET /api/communications/analytics - Communications analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getCommunicationsAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching communications analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch communications analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/communications/dashboard - Communications Secretary dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getCommunicationsService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const [analytics, recentOperations, activeStrategies, upcomingConferences, pendingMessages] = await Promise.all([
      service.getCommunicationsAnalytics(Number(campaignId)),
      service.getCommunicationsOperations(Number(campaignId), { limit: 5 }),
      service.getMediaStrategies(Number(campaignId), { status: 'active' }),
      service.getPressConferences(Number(campaignId), { upcoming: true }),
      service.getPublicMessages(Number(campaignId), { approvalStatus: 'review' })
    ]);

    const dashboard = {
      overview: analytics,
      recentActivity: recentOperations,
      activeStrategies: activeStrategies.slice(0, 5),
      upcomingEvents: upcomingConferences.slice(0, 5),
      pendingApprovals: pendingMessages.slice(0, 5),
      alerts: [
        ...(analytics.pendingMessages > 10 ? [{
          type: 'warning',
          message: 'High number of pending message approvals',
          action: 'Review pending messages'
        }] : []),
        ...(analytics.scheduledPressConferences === 0 ? [{
          type: 'info',
          message: 'No upcoming press conferences scheduled',
          action: 'Schedule press briefings'
        }] : [])
      ],
      integrationStatus: {
        leaderCommunications: 'active',
        newsSystem: 'active',
        witterPlatform: 'active',
        mediaOutlets: 'active'
      }
    };

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching communications dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch communications dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
