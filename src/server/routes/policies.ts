import express from 'express';
import { PolicyEngine } from '../policies/policyEngine.js';
import { PolicyStorage } from '../policies/policyStorage.js';
import { resumeCampaign } from '../persistence/eventSourcing.js';

const router = express.Router();

// Initialize policy tables on first load
PolicyStorage.initializePolicyTables().catch(console.error);

/**
 * POST /api/policies - Create a new policy from free-form text
 */
router.post('/', async (req, res) => {
  try {
    const { campaignId, rawText, requireApproval } = req.body;
    
    if (!campaignId || !rawText) {
      return res.status(400).json({
        error: 'Campaign ID and policy text are required'
      });
    }
    
    // Parse the policy text
    const parseResult = await PolicyEngine.parsePolicy(
      rawText, 
      Number(campaignId),
      { requireApproval }
    );
    
    if (!parseResult.success || !parseResult.policy) {
      return res.status(400).json({
        error: 'Failed to parse policy',
        message: parseResult.error,
        warnings: parseResult.warnings
      });
    }
    
    // Save the policy
    const policyId = await PolicyStorage.savePolicy({
      ...parseResult.policy,
      campaignId: Number(campaignId),
      status: 'draft'
    });
    
    res.json({
      success: true,
      policyId,
      policy: {
        id: policyId,
        ...parseResult.policy,
        campaignId: Number(campaignId),
        status: 'draft'
      },
      warnings: parseResult.warnings,
      message: `Policy "${parseResult.policy.title}" created successfully`
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({
      error: 'Failed to create policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/policies - Get policies for a campaign
 */
router.get('/', async (req, res) => {
  try {
    const { campaignId, status } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    const policies = await PolicyStorage.getPoliciesForCampaign(
      Number(campaignId),
      status as string
    );
    
    const stats = await PolicyStorage.getPolicyStats(Number(campaignId));
    
    res.json({
      success: true,
      policies,
      stats,
      count: policies.length
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({
      error: 'Failed to fetch policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/policies/active - Get active policies and their modifiers
 */
router.get('/active', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    const activePolicies = await PolicyStorage.getPoliciesForCampaign(
      Number(campaignId),
      'active'
    );
    
    const activeModifiers = await PolicyStorage.getActivePolicyModifiers(
      Number(campaignId)
    );
    
    res.json({
      success: true,
      policies: activePolicies,
      modifiers: activeModifiers,
      count: activePolicies.length
    });
  } catch (error) {
    console.error('Error fetching active policies:', error);
    res.status(500).json({
      error: 'Failed to fetch active policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/policies/activate - Activate a policy
 */
router.post('/activate', async (req, res) => {
  try {
    const { policyId } = req.body;
    
    if (!policyId) {
      return res.status(400).json({
        error: 'Policy ID is required'
      });
    }
    
    // Get the policy to check if it exists
    const policy = await PolicyStorage.getPolicyById(policyId);
    
    if (!policy) {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }
    
    if (policy.status === 'active') {
      return res.status(400).json({
        error: 'Policy is already active'
      });
    }
    
    // Update policy status
    await PolicyStorage.updatePolicyStatus(
      policyId, 
      'active', 
      new Date()
    );
    
    // Get updated policy
    const updatedPolicy = await PolicyStorage.getPolicyById(policyId);
    
    res.json({
      success: true,
      policy: updatedPolicy,
      message: `Policy "${policy.title}" activated successfully`
    });
  } catch (error) {
    console.error('Error activating policy:', error);
    res.status(500).json({
      error: 'Failed to activate policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/policies/:id - Get specific policy by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const policy = await PolicyStorage.getPolicyById(id);
    
    if (!policy) {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }
    
    // Get impact summary
    const impactSummary = PolicyEngine.getPolicyImpactSummary(policy);
    
    res.json({
      success: true,
      policy,
      impactSummary
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({
      error: 'Failed to fetch policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/policies/:id/status - Update policy status
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['draft', 'pending_approval', 'active', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required (draft, pending_approval, active, rejected, expired)'
      });
    }
    
    const policy = await PolicyStorage.getPolicyById(id);
    
    if (!policy) {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }
    
    await PolicyStorage.updatePolicyStatus(
      id, 
      status,
      status === 'active' ? new Date() : undefined
    );
    
    const updatedPolicy = await PolicyStorage.getPolicyById(id);
    
    res.json({
      success: true,
      policy: updatedPolicy,
      message: `Policy status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating policy status:', error);
    res.status(500).json({
      error: 'Failed to update policy status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/policies/:id - Delete a policy
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const policy = await PolicyStorage.getPolicyById(id);
    
    if (!policy) {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }
    
    await PolicyStorage.deletePolicy(id);
    
    res.json({
      success: true,
      message: `Policy "${policy.title}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({
      error: 'Failed to delete policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
