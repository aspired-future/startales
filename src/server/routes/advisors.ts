import express from 'express';
import { AdvisorSystem } from '../advisors/advisorSystem';
import { resumeCampaign } from '../persistence/eventSourcing';

const router = express.Router();

/**
 * GET /api/advisors - List all available advisors
 */
router.get('/', async (req, res) => {
  try {
    const advisors = AdvisorSystem.getAdvisors();
    
    res.json({
      success: true,
      advisors,
      count: advisors.length
    });
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({
      error: 'Failed to fetch advisors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/advisors/:domain/query - Query an advisor for information
 */
router.post('/:domain/query', async (req, res) => {
  try {
    const { domain } = req.params;
    const { question, campaignId } = req.body;
    
    if (!question || !campaignId) {
      return res.status(400).json({
        error: 'Question and campaign ID are required'
      });
    }
    
    // Get current campaign state for context
    const campaignState = await resumeCampaign(Number(campaignId));
    
    // Query the advisor
    const response = await AdvisorSystem.queryAdvisor(
      { domain, question },
      campaignState
    );
    
    if (!response.success) {
      return res.status(400).json({
        error: 'Advisor query failed',
        message: response.error
      });
    }
    
    res.json({
      success: true,
      advisor: response.advisor,
      response: response.response,
      confidence: response.confidence,
      sources: response.sources,
      followUpQuestions: response.followUpQuestions,
      campaignStep: campaignState.step
    });
  } catch (error) {
    console.error('Error querying advisor:', error);
    res.status(500).json({
      error: 'Failed to query advisor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/advisors/:domain/propose - Ask advisor to propose a policy
 */
router.post('/:domain/propose', async (req, res) => {
  try {
    const { domain } = req.params;
    const { campaignId, situation, goals } = req.body;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    // Get current campaign state for context
    const campaignState = await resumeCampaign(Number(campaignId));
    
    // Get policy proposal from advisor
    const proposal = await AdvisorSystem.proposePolicy(
      domain,
      { situation, goals },
      campaignState
    );
    
    if (!proposal.success) {
      return res.status(400).json({
        error: 'Policy proposal failed',
        message: proposal.error
      });
    }
    
    res.json({
      success: true,
      advisor: proposal.advisor,
      proposal: proposal.proposal,
      campaignStep: campaignState.step,
      message: `Policy proposal from ${proposal.advisor.name}`
    });
  } catch (error) {
    console.error('Error getting policy proposal:', error);
    res.status(500).json({
      error: 'Failed to get policy proposal',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/advisors/:domain - Get specific advisor information
 */
router.get('/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    const advisor = AdvisorSystem.getAdvisor(domain);
    
    if (!advisor) {
      return res.status(404).json({
        error: 'Advisor not found',
        message: `No advisor found for domain: ${domain}`
      });
    }
    
    res.json({
      success: true,
      advisor
    });
  } catch (error) {
    console.error('Error fetching advisor:', error);
    res.status(500).json({
      error: 'Failed to fetch advisor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
