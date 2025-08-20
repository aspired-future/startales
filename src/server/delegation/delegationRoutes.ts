/**
 * Delegation API Routes
 * 
 * REST API endpoints for the Delegation & Authority Management System
 */

import { Router, Request, Response } from 'express';
import { delegationService } from './DelegationService.js';
import { 
  GovernmentRole, 
  Permission, 
  AuthorityDelegation, 
  Decision,
  DecisionCategory,
  ApprovalStatus
} from './types.js';

const router = Router();

// ===== GOVERNMENT ROLES ENDPOINTS =====

// GET /api/delegation/roles - Get all government roles
router.get('/roles', async (req: Request, res: Response) => {
  try {
    const { department, active } = req.query;
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    
    const roles = await delegationService.getGovernmentRoles(
      department as string,
      isActive
    );
    
    res.json({
      success: true,
      data: roles,
      count: roles.length
    });
  } catch (error) {
    console.error('Failed to get government roles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve government roles'
    });
  }
});

// POST /api/delegation/roles - Create a new government role
router.post('/roles', async (req: Request, res: Response) => {
  try {
    const roleData: Omit<GovernmentRole, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `role_${Date.now()}`,
      name: req.body.name,
      title: req.body.title,
      department: req.body.department,
      description: req.body.description,
      baseAuthorityLevel: req.body.baseAuthorityLevel || 1,
      defaultPermissions: req.body.defaultPermissions || [],
      requiredClearanceLevel: req.body.requiredClearanceLevel || 1,
      canDelegate: req.body.canDelegate !== false,
      maxDelegationLevel: req.body.maxDelegationLevel || 3,
      successionOrder: req.body.successionOrder || 999,
      isActive: req.body.isActive !== false
    };

    const result = await delegationService.createGovernmentRole(roleData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create government role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create government role'
    });
  }
});

// PUT /api/delegation/roles/:id - Update a government role
router.put('/roles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const result = await delegationService.updateGovernmentRole(id, updates);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to update government role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update government role'
    });
  }
});

// ===== PERMISSIONS ENDPOINTS =====

// GET /api/delegation/permissions - Get all permissions
router.get('/permissions', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const permissions = await delegationService.getPermissions(category as DecisionCategory);
    
    res.json({
      success: true,
      data: permissions,
      count: permissions.length
    });
  } catch (error) {
    console.error('Failed to get permissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve permissions'
    });
  }
});

// POST /api/delegation/permissions - Create a new permission
router.post('/permissions', async (req: Request, res: Response) => {
  try {
    const permissionData: Omit<Permission, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `perm_${Date.now()}`,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      requiredAuthorityLevel: req.body.requiredAuthorityLevel || 1,
      scope: req.body.scope || [],
      conditions: req.body.conditions || [],
      isRevocable: req.body.isRevocable !== false
    };

    const result = await delegationService.createPermission(permissionData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create permission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create permission'
    });
  }
});

// ===== DELEGATIONS ENDPOINTS =====

// GET /api/delegation/delegations - Get delegations for a campaign
router.get('/delegations', async (req: Request, res: Response) => {
  try {
    const { campaignId, delegateeId, active } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }

    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    
    const delegations = await delegationService.getDelegations(
      parseInt(campaignId as string),
      delegateeId as string,
      isActive
    );
    
    res.json({
      success: true,
      data: delegations,
      count: delegations.length
    });
  } catch (error) {
    console.error('Failed to get delegations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve delegations'
    });
  }
});

// POST /api/delegation/delegations - Create a new delegation
router.post('/delegations', async (req: Request, res: Response) => {
  try {
    const delegationData: Omit<AuthorityDelegation, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `delegation_${Date.now()}`,
      delegatorId: req.body.delegatorId,
      delegateeId: req.body.delegateeId,
      roleId: req.body.roleId,
      campaignId: req.body.campaignId,
      scope: req.body.scope || 'limited',
      permissions: req.body.permissions || [],
      conditions: req.body.conditions || [],
      limitations: req.body.limitations || [],
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      isActive: req.body.isActive !== false,
      isRevocable: req.body.isRevocable !== false,
      revocationReason: req.body.revocationReason
    };

    const result = await delegationService.createDelegation(delegationData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create delegation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create delegation'
    });
  }
});

// DELETE /api/delegation/delegations/:id - Revoke a delegation
router.delete('/delegations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, revokedBy } = req.body;
    
    if (!reason || !revokedBy) {
      return res.status(400).json({
        success: false,
        error: 'Reason and revokedBy are required'
      });
    }

    const result = await delegationService.revokeDelegation(id, reason, revokedBy);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to revoke delegation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke delegation'
    });
  }
});

// ===== AUTHORITY CHECKING ENDPOINTS =====

// POST /api/delegation/check-authority - Check if user has required authority
router.post('/check-authority', async (req: Request, res: Response) => {
  try {
    const { userId, requiredPermissions, campaignId } = req.body;
    
    if (!userId || !requiredPermissions || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'userId, requiredPermissions, and campaignId are required'
      });
    }

    const result = await delegationService.checkAuthority(
      userId,
      requiredPermissions,
      campaignId
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to check authority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check authority'
    });
  }
});

// ===== DECISIONS ENDPOINTS =====

// GET /api/delegation/decisions - Get decisions for a campaign
router.get('/decisions', async (req: Request, res: Response) => {
  try {
    const { campaignId, status, assignedToId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }
    
    const decisions = await delegationService.getDecisions(
      parseInt(campaignId as string),
      status as ApprovalStatus,
      assignedToId as string
    );
    
    res.json({
      success: true,
      data: decisions,
      count: decisions.length
    });
  } catch (error) {
    console.error('Failed to get decisions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve decisions'
    });
  }
});

// POST /api/delegation/decisions - Create a new decision
router.post('/decisions', async (req: Request, res: Response) => {
  try {
    const decisionData: Omit<Decision, 'createdAt' | 'updatedAt' | 'auditTrail'> = {
      id: req.body.id || `decision_${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      impact: req.body.impact || 'medium',
      urgency: req.body.urgency || 'medium',
      requiredAuthorityLevel: req.body.requiredAuthorityLevel || 1,
      requiredPermissions: req.body.requiredPermissions || [],
      campaignId: req.body.campaignId,
      tickId: req.body.tickId || 0,
      initiatorId: req.body.initiatorId,
      assignedToId: req.body.assignedToId,
      options: req.body.options || [],
      selectedOptionId: req.body.selectedOptionId,
      approvalChain: req.body.approvalChain || [],
      currentApprovalStep: req.body.currentApprovalStep || 0,
      status: req.body.status || 'pending',
      deadline: new Date(req.body.deadline),
      escalationDate: req.body.escalationDate ? new Date(req.body.escalationDate) : undefined,
      autoApprovalRules: req.body.autoApprovalRules || [],
      context: req.body.context || {}
    };

    const result = await delegationService.createDecision(decisionData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create decision:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create decision'
    });
  }
});

// ===== SYSTEM SUMMARY ENDPOINT =====

// GET /api/delegation/summary - Get delegation system summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }
    
    const summary = await delegationService.getDelegationSummary(
      parseInt(campaignId as string)
    );
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Failed to get delegation summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve delegation summary'
    });
  }
});

// ===== INITIALIZATION ENDPOINT =====

// POST /api/delegation/initialize - Initialize default roles and permissions for a campaign
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }

    // Create default government roles
    const defaultRoles = [
      {
        id: 'secretary-defense',
        name: 'Secretary of Defense',
        title: 'Secretary of Defense',
        department: 'Defense',
        description: 'Responsible for military operations, troop movements, and defense policy',
        baseAuthorityLevel: 4,
        defaultPermissions: ['military-operations', 'troop-movement', 'defense-policy'],
        requiredClearanceLevel: 5,
        canDelegate: true,
        maxDelegationLevel: 3,
        successionOrder: 1,
        isActive: true
      },
      {
        id: 'secretary-state',
        name: 'Secretary of State',
        title: 'Secretary of State',
        department: 'State',
        description: 'Responsible for diplomatic relations and foreign policy',
        baseAuthorityLevel: 4,
        defaultPermissions: ['diplomatic-relations', 'trade-negotiations', 'foreign-policy'],
        requiredClearanceLevel: 5,
        canDelegate: true,
        maxDelegationLevel: 3,
        successionOrder: 2,
        isActive: true
      },
      {
        id: 'secretary-treasury',
        name: 'Secretary of Treasury',
        title: 'Secretary of Treasury',
        department: 'Treasury',
        description: 'Responsible for economic policy and financial management',
        baseAuthorityLevel: 4,
        defaultPermissions: ['economic-policy', 'budget-management', 'financial-operations'],
        requiredClearanceLevel: 4,
        canDelegate: true,
        maxDelegationLevel: 3,
        successionOrder: 3,
        isActive: true
      },
      {
        id: 'secretary-interior',
        name: 'Secretary of Interior',
        title: 'Secretary of Interior',
        department: 'Interior',
        description: 'Responsible for domestic policy and resource management',
        baseAuthorityLevel: 3,
        defaultPermissions: ['domestic-policy', 'resource-management', 'infrastructure'],
        requiredClearanceLevel: 3,
        canDelegate: true,
        maxDelegationLevel: 2,
        successionOrder: 4,
        isActive: true
      },
      {
        id: 'secretary-science',
        name: 'Secretary of Science',
        title: 'Secretary of Science',
        department: 'Science',
        description: 'Responsible for research and technology development',
        baseAuthorityLevel: 3,
        defaultPermissions: ['research-funding', 'technology-development', 'scientific-policy'],
        requiredClearanceLevel: 4,
        canDelegate: true,
        maxDelegationLevel: 2,
        successionOrder: 5,
        isActive: true
      },
      {
        id: 'attorney-general',
        name: 'Attorney General',
        title: 'Attorney General',
        department: 'Justice',
        description: 'Responsible for legal system and law enforcement',
        baseAuthorityLevel: 4,
        defaultPermissions: ['legal-system', 'law-enforcement', 'justice-administration'],
        requiredClearanceLevel: 5,
        canDelegate: true,
        maxDelegationLevel: 3,
        successionOrder: 6,
        isActive: true
      },
      {
        id: 'intelligence-director',
        name: 'Intelligence Director',
        title: 'Director of Intelligence',
        department: 'Intelligence',
        description: 'Responsible for intelligence operations and security',
        baseAuthorityLevel: 4,
        defaultPermissions: ['intelligence-operations', 'security-briefings', 'threat-assessment'],
        requiredClearanceLevel: 5,
        canDelegate: true,
        maxDelegationLevel: 3,
        successionOrder: 7,
        isActive: true
      },
      {
        id: 'chief-of-staff',
        name: 'Chief of Staff',
        title: 'Chief of Staff',
        department: 'Administration',
        description: 'Responsible for administrative coordination and information flow',
        baseAuthorityLevel: 3,
        defaultPermissions: ['administrative-coordination', 'meeting-scheduling', 'information-flow'],
        requiredClearanceLevel: 4,
        canDelegate: true,
        maxDelegationLevel: 2,
        successionOrder: 8,
        isActive: true
      }
    ];

    // Create roles
    const roleResults = await Promise.all(
      defaultRoles.map(role => delegationService.createGovernmentRole(role))
    );

    const successfulRoles = roleResults.filter(r => r.success).length;

    res.json({
      success: true,
      data: {
        rolesCreated: successfulRoles,
        totalRoles: defaultRoles.length,
        campaignId: campaignId
      },
      message: `Initialized ${successfulRoles} government roles for campaign ${campaignId}`
    });

  } catch (error) {
    console.error('Failed to initialize delegation system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize delegation system'
    });
  }
});

export default router;
