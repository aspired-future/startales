/**
 * Delegation Service
 * 
 * Core service for managing hierarchical authority structure,
 * role-based permissions, delegation levels, and automated decision-making.
 */

import { db } from '../storage/db.js';
import { 
  GovernmentRole, 
  Permission, 
  AuthorityDelegation, 
  Decision, 
  EmergencyPowers,
  AuthorityAudit,
  DelegationPerformance,
  AutoApprovalRule,
  DelegationSystemConfig,
  AuthorityLevel,
  DelegationScope,
  DecisionCategory,
  DecisionImpact,
  ApprovalStatus,
  AuthorityCheckResult,
  DelegationResponse,
  DelegationSummary
} from './types.js';

export class DelegationService {
  
  // ===== GOVERNMENT ROLES MANAGEMENT =====
  
  async createGovernmentRole(role: Omit<GovernmentRole, 'createdAt' | 'updatedAt'>): Promise<DelegationResponse> {
    try {
      await db.query(`
        INSERT INTO government_roles (
          id, name, title, department, description, base_authority_level,
          default_permissions, required_clearance_level, can_delegate,
          max_delegation_level, succession_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        role.id, role.name, role.title, role.department, role.description,
        role.baseAuthorityLevel, JSON.stringify(role.defaultPermissions),
        role.requiredClearanceLevel, role.canDelegate, role.maxDelegationLevel,
        role.successionOrder, role.isActive
      ]);

      await this.auditAction('role', role.id, 'granted', 'government-role', {
        role: role.name,
        department: role.department,
        authorityLevel: role.baseAuthorityLevel
      }, 'system', 0);

      return { success: true, data: role };
    } catch (error) {
      console.error('Failed to create government role:', error);
      return { success: false, error: 'Failed to create government role' };
    }
  }

  async getGovernmentRoles(department?: string, isActive?: boolean): Promise<GovernmentRole[]> {
    try {
      let query = 'SELECT * FROM government_roles WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (department) {
        query += ` AND department = $${++paramCount}`;
        params.push(department);
      }

      if (isActive !== undefined) {
        query += ` AND is_active = $${++paramCount}`;
        params.push(isActive);
      }

      query += ' ORDER BY succession_order, name';

      const result = await db.query(query, params);
      return result.rows.map(this.mapGovernmentRole);
    } catch (error) {
      console.error('Failed to get government roles:', error);
      return [];
    }
  }

  async updateGovernmentRole(id: string, updates: Partial<GovernmentRole>): Promise<DelegationResponse> {
    try {
      const setClauses: string[] = [];
      const params: any[] = [];
      let paramCount = 0;

      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id' || key === 'createdAt') return;
        
        paramCount++;
        const dbKey = this.camelToSnake(key);
        
        if (key === 'defaultPermissions') {
          setClauses.push(`${dbKey} = $${paramCount}`);
          params.push(JSON.stringify(value));
        } else {
          setClauses.push(`${dbKey} = $${paramCount}`);
          params.push(value);
        }
      });

      if (setClauses.length === 0) {
        return { success: false, error: 'No valid updates provided' };
      }

      setClauses.push(`updated_at = now()`);
      params.push(id);

      await db.query(`
        UPDATE government_roles 
        SET ${setClauses.join(', ')}
        WHERE id = $${params.length}
      `, params);

      await this.auditAction('role', id, 'modified', 'government-role', updates, 'system', 0);

      return { success: true };
    } catch (error) {
      console.error('Failed to update government role:', error);
      return { success: false, error: 'Failed to update government role' };
    }
  }

  // ===== PERMISSIONS MANAGEMENT =====

  async createPermission(permission: Omit<Permission, 'createdAt' | 'updatedAt'>): Promise<DelegationResponse> {
    try {
      await db.query(`
        INSERT INTO permissions (
          id, name, category, description, required_authority_level,
          scope, conditions, is_revocable
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        permission.id, permission.name, permission.category, permission.description,
        permission.requiredAuthorityLevel, JSON.stringify(permission.scope),
        JSON.stringify(permission.conditions || []), permission.isRevocable
      ]);

      return { success: true, data: permission };
    } catch (error) {
      console.error('Failed to create permission:', error);
      return { success: false, error: 'Failed to create permission' };
    }
  }

  async getPermissions(category?: DecisionCategory): Promise<Permission[]> {
    try {
      let query = 'SELECT * FROM permissions WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $1';
        params.push(category);
      }

      query += ' ORDER BY category, required_authority_level, name';

      const result = await db.query(query, params);
      return result.rows.map(this.mapPermission);
    } catch (error) {
      console.error('Failed to get permissions:', error);
      return [];
    }
  }

  // ===== AUTHORITY DELEGATION =====

  async createDelegation(delegation: Omit<AuthorityDelegation, 'createdAt' | 'updatedAt'>): Promise<DelegationResponse> {
    try {
      // Validate delegation authority
      const canDelegate = await this.checkDelegationAuthority(delegation.delegatorId, delegation.roleId);
      if (!canDelegate.hasAuthority) {
        return { 
          success: false, 
          error: 'Insufficient authority to create delegation',
          warnings: canDelegate.missingPermissions 
        };
      }

      await db.query(`
        INSERT INTO authority_delegations (
          id, delegator_id, delegatee_id, role_id, campaign_id, scope,
          permissions, conditions, limitations, start_date, end_date,
          is_active, is_revocable
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        delegation.id, delegation.delegatorId, delegation.delegateeId,
        delegation.roleId, delegation.campaignId, delegation.scope,
        JSON.stringify(delegation.permissions), JSON.stringify(delegation.conditions),
        JSON.stringify(delegation.limitations), delegation.startDate,
        delegation.endDate, delegation.isActive, delegation.isRevocable
      ]);

      await this.auditAction('delegation', delegation.id, 'granted', 'authority-delegation', {
        delegator: delegation.delegatorId,
        delegatee: delegation.delegateeId,
        role: delegation.roleId,
        scope: delegation.scope
      }, delegation.delegatorId, delegation.campaignId);

      return { success: true, data: delegation };
    } catch (error) {
      console.error('Failed to create delegation:', error);
      return { success: false, error: 'Failed to create delegation' };
    }
  }

  async getDelegations(campaignId: number, delegateeId?: string, isActive?: boolean): Promise<AuthorityDelegation[]> {
    try {
      let query = 'SELECT * FROM authority_delegations WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramCount = 1;

      if (delegateeId) {
        query += ` AND delegatee_id = $${++paramCount}`;
        params.push(delegateeId);
      }

      if (isActive !== undefined) {
        query += ` AND is_active = $${++paramCount}`;
        params.push(isActive);
      }

      query += ' ORDER BY start_date DESC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapDelegation);
    } catch (error) {
      console.error('Failed to get delegations:', error);
      return [];
    }
  }

  async revokeDelegation(delegationId: string, reason: string, revokedBy: string): Promise<DelegationResponse> {
    try {
      await db.query(`
        UPDATE authority_delegations 
        SET is_active = false, revocation_reason = $1, revoked_at = now(), updated_at = now()
        WHERE id = $2 AND is_revocable = true
      `, [reason, delegationId]);

      await this.auditAction('delegation', delegationId, 'revoked', 'authority-delegation', {
        reason: reason
      }, revokedBy, 0);

      return { success: true };
    } catch (error) {
      console.error('Failed to revoke delegation:', error);
      return { success: false, error: 'Failed to revoke delegation' };
    }
  }

  // ===== AUTHORITY CHECKING =====

  async checkAuthority(userId: string, requiredPermissions: string[], campaignId: number): Promise<AuthorityCheckResult> {
    try {
      // Get user's active delegations
      const delegations = await this.getDelegations(campaignId, userId, true);
      
      // Get all permissions from delegations
      const userPermissions = new Set<string>();
      let maxAuthorityLevel: AuthorityLevel = 0;
      const limitations: any[] = [];

      for (const delegation of delegations) {
        // Check if delegation is currently valid
        if (delegation.endDate && new Date() > delegation.endDate) continue;
        
        // Add permissions from this delegation
        delegation.permissions.forEach(permId => userPermissions.add(permId));
        
        // Track highest authority level
        const role = await this.getGovernmentRoleById(delegation.roleId);
        if (role && role.baseAuthorityLevel > maxAuthorityLevel) {
          maxAuthorityLevel = role.baseAuthorityLevel;
        }

        // Collect limitations
        limitations.push(...delegation.limitations);
      }

      // Check if user has all required permissions
      const missingPermissions = requiredPermissions.filter(perm => !userPermissions.has(perm));
      const hasAuthority = missingPermissions.length === 0;

      // Determine if approval is required based on delegation scope
      const requiresApproval = delegations.some(d => 
        d.scope === 'approval-required' && 
        requiredPermissions.some(perm => d.permissions.includes(perm))
      );

      return {
        hasAuthority,
        authorityLevel: maxAuthorityLevel,
        missingPermissions,
        limitations,
        requiresApproval
      };
    } catch (error) {
      console.error('Failed to check authority:', error);
      return {
        hasAuthority: false,
        authorityLevel: 0,
        missingPermissions: requiredPermissions,
        limitations: [],
        requiresApproval: true
      };
    }
  }

  async checkDelegationAuthority(delegatorId: string, roleId: string): Promise<AuthorityCheckResult> {
    try {
      const role = await this.getGovernmentRoleById(roleId);
      if (!role) {
        return {
          hasAuthority: false,
          authorityLevel: 0,
          missingPermissions: ['role-not-found'],
          limitations: [],
          requiresApproval: false
        };
      }

      // For now, assume system can delegate (this would be expanded with proper user role checking)
      return {
        hasAuthority: role.canDelegate,
        authorityLevel: role.maxDelegationLevel,
        missingPermissions: [],
        limitations: [],
        requiresApproval: false
      };
    } catch (error) {
      console.error('Failed to check delegation authority:', error);
      return {
        hasAuthority: false,
        authorityLevel: 0,
        missingPermissions: ['check-failed'],
        limitations: [],
        requiresApproval: false
      };
    }
  }

  // ===== DECISION MANAGEMENT =====

  async createDecision(decision: Omit<Decision, 'createdAt' | 'updatedAt' | 'auditTrail'>): Promise<DelegationResponse> {
    try {
      await db.query(`
        INSERT INTO decisions (
          id, title, description, category, impact, urgency,
          required_authority_level, required_permissions, campaign_id,
          tick_id, initiator_id, assigned_to_id, options, approval_chain,
          status, deadline, context, auto_approval_rules
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        decision.id, decision.title, decision.description, decision.category,
        decision.impact, decision.urgency, decision.requiredAuthorityLevel,
        JSON.stringify(decision.requiredPermissions), decision.campaignId,
        decision.tickId, decision.initiatorId, decision.assignedToId,
        JSON.stringify(decision.options), JSON.stringify(decision.approvalChain),
        decision.status, decision.deadline, JSON.stringify(decision.context),
        JSON.stringify(decision.autoApprovalRules || [])
      ]);

      await this.auditAction('decision', decision.id, 'granted', 'decision-creation', {
        title: decision.title,
        category: decision.category,
        impact: decision.impact
      }, decision.initiatorId, decision.campaignId);

      return { success: true, data: decision };
    } catch (error) {
      console.error('Failed to create decision:', error);
      return { success: false, error: 'Failed to create decision' };
    }
  }

  async getDecisions(campaignId: number, status?: ApprovalStatus, assignedToId?: string): Promise<Decision[]> {
    try {
      let query = 'SELECT * FROM decisions WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramCount = 1;

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      if (assignedToId) {
        query += ` AND assigned_to_id = $${++paramCount}`;
        params.push(assignedToId);
      }

      query += ' ORDER BY deadline ASC, urgency DESC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapDecision);
    } catch (error) {
      console.error('Failed to get decisions:', error);
      return [];
    }
  }

  // ===== AUDIT LOGGING =====

  async auditAction(
    subjectType: 'user' | 'role' | 'delegation' | 'decision',
    subjectId: string,
    action: 'granted' | 'revoked' | 'modified' | 'used' | 'exceeded',
    authorityType: string,
    details: Record<string, any>,
    performedBy: string,
    campaignId: number,
    tickId?: number
  ): Promise<void> {
    try {
      await db.query(`
        INSERT INTO authority_audit (
          id, subject_id, subject_type, action, authority_type,
          details, performed_by, campaign_id, tick_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subjectId, subjectType, action, authorityType,
        JSON.stringify(details), performedBy, campaignId, tickId
      ]);
    } catch (error) {
      console.error('Failed to create audit entry:', error);
    }
  }

  // ===== SYSTEM SUMMARY =====

  async getDelegationSummary(campaignId: number): Promise<DelegationSummary> {
    try {
      const [delegationsResult, decisionsResult, emergencyResult] = await Promise.all([
        db.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_active = true) as active FROM authority_delegations WHERE campaign_id = $1', [campaignId]),
        db.query('SELECT COUNT(*) as pending FROM decisions WHERE campaign_id = $1 AND status = $2', [campaignId, 'pending']),
        db.query('SELECT COUNT(*) as active FROM emergency_powers WHERE is_active = true', [])
      ]);

      const recentDecisions = await this.getDecisions(campaignId);

      return {
        totalDelegations: parseInt(delegationsResult.rows[0]?.total || '0'),
        activeDelegations: parseInt(delegationsResult.rows[0]?.active || '0'),
        pendingApprovals: parseInt(decisionsResult.rows[0]?.pending || '0'),
        emergencyPowersActive: parseInt(emergencyResult.rows[0]?.active || '0') > 0,
        recentDecisions: recentDecisions.slice(0, 10),
        performanceMetrics: [], // Would be populated with actual performance data
        systemHealth: {
          status: 'healthy',
          issues: [],
          recommendations: []
        }
      };
    } catch (error) {
      console.error('Failed to get delegation summary:', error);
      return {
        totalDelegations: 0,
        activeDelegations: 0,
        pendingApprovals: 0,
        emergencyPowersActive: false,
        recentDecisions: [],
        performanceMetrics: [],
        systemHealth: {
          status: 'critical',
          issues: ['Failed to retrieve system status'],
          recommendations: ['Check database connectivity']
        }
      };
    }
  }

  // ===== HELPER METHODS =====

  private async getGovernmentRoleById(id: string): Promise<GovernmentRole | null> {
    try {
      const result = await db.query('SELECT * FROM government_roles WHERE id = $1', [id]);
      return result.rows[0] ? this.mapGovernmentRole(result.rows[0]) : null;
    } catch (error) {
      console.error('Failed to get government role by ID:', error);
      return null;
    }
  }

  private mapGovernmentRole(row: any): GovernmentRole {
    return {
      id: row.id,
      name: row.name,
      title: row.title,
      department: row.department,
      description: row.description,
      baseAuthorityLevel: row.base_authority_level,
      defaultPermissions: JSON.parse(row.default_permissions || '[]'),
      requiredClearanceLevel: row.required_clearance_level,
      canDelegate: row.can_delegate,
      maxDelegationLevel: row.max_delegation_level,
      successionOrder: row.succession_order,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapPermission(row: any): Permission {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      requiredAuthorityLevel: row.required_authority_level,
      scope: JSON.parse(row.scope || '[]'),
      conditions: JSON.parse(row.conditions || '[]'),
      isRevocable: row.is_revocable
    };
  }

  private mapDelegation(row: any): AuthorityDelegation {
    return {
      id: row.id,
      delegatorId: row.delegator_id,
      delegateeId: row.delegatee_id,
      roleId: row.role_id,
      campaignId: row.campaign_id,
      scope: row.scope,
      permissions: JSON.parse(row.permissions || '[]'),
      conditions: JSON.parse(row.conditions || '[]'),
      limitations: JSON.parse(row.limitations || '[]'),
      startDate: new Date(row.start_date),
      endDate: row.end_date ? new Date(row.end_date) : undefined,
      isActive: row.is_active,
      isRevocable: row.is_revocable,
      revocationReason: row.revocation_reason,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      revokedAt: row.revoked_at ? new Date(row.revoked_at) : undefined
    };
  }

  private mapDecision(row: any): Decision {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      impact: row.impact,
      urgency: row.urgency,
      requiredAuthorityLevel: row.required_authority_level,
      requiredPermissions: JSON.parse(row.required_permissions || '[]'),
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      initiatorId: row.initiator_id,
      assignedToId: row.assigned_to_id,
      options: JSON.parse(row.options || '[]'),
      selectedOptionId: row.selected_option_id,
      approvalChain: JSON.parse(row.approval_chain || '[]'),
      currentApprovalStep: row.current_approval_step,
      status: row.status,
      deadline: new Date(row.deadline),
      escalationDate: row.escalation_date ? new Date(row.escalation_date) : undefined,
      autoApprovalRules: JSON.parse(row.auto_approval_rules || '[]'),
      context: JSON.parse(row.context || '{}'),
      auditTrail: JSON.parse(row.audit_trail || '[]'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      decidedAt: row.decided_at ? new Date(row.decided_at) : undefined,
      implementedAt: row.implemented_at ? new Date(row.implemented_at) : undefined
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export const delegationService = new DelegationService();
