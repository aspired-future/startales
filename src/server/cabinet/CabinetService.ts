/**
 * Cabinet Service
 * 
 * Core service for managing cabinet members, bureaucratic workflows,
 * decision support systems, and government automation.
 * Builds upon the Delegation & Authority Management System.
 */

import { db } from '../storage/db';
import { delegationService } from '../delegation/DelegationService';
import { 
  CabinetMember,
  CabinetMemberStatus,
  PersonalityProfile,
  CabinetPerformance,
  Assignment,
  BureaucraticProcess,
  ProcessInstance,
  DecisionSupportRequest,
  CabinetMeeting,
  CabinetSystemConfig,
  CabinetResponse,
  CabinetSummary,
  RecentActivity
} from './types';
import { 
  GovernmentRole,
  AuthorityDelegation,
  Decision,
  AuthorityCheckResult
} from '../delegation/types';

export class CabinetService {

  // ===== CABINET MEMBER MANAGEMENT =====

  async appointCabinetMember(memberData: Omit<CabinetMember, 'createdAt' | 'updatedAt' | 'delegatedAuthorities' | 'currentAssignments'>): Promise<CabinetResponse> {
    try {
      // Verify the role exists and is available
      const role = await this.getGovernmentRole(memberData.roleId);
      if (!role) {
        return { success: false, error: 'Government role not found' };
      }

      // Check if position is already filled
      const existingMember = await this.getCabinetMemberByRole(memberData.roleId);
      if (existingMember && existingMember.status === 'active') {
        return { success: false, error: 'Position is already filled' };
      }

      await db.query(`
        INSERT INTO cabinet_members (
          id, user_id, role_id, name, title, department, appointed_date,
          status, security_clearance, personality_profile, performance_metrics,
          communication_preferences, emergency_contact_info, biography,
          qualifications, previous_experience
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        memberData.id, memberData.userId, memberData.roleId, memberData.name,
        memberData.title, memberData.department, memberData.appointedDate,
        memberData.status, memberData.securityClearance,
        JSON.stringify(memberData.personalityProfile),
        JSON.stringify(memberData.performanceMetrics),
        JSON.stringify(memberData.communicationPreferences),
        JSON.stringify(memberData.emergencyContactInfo),
        memberData.biography, JSON.stringify(memberData.qualifications),
        JSON.stringify(memberData.previousExperience)
      ]);

      // Create default delegation for the cabinet member
      if (memberData.status === 'confirmed' || memberData.status === 'active') {
        await this.createDefaultDelegation(memberData.id, memberData.roleId);
      }

      await this.logActivity('appointment', `${memberData.name} appointed as ${memberData.title}`, 'medium', [memberData.id]);

      return { success: true, data: memberData };
    } catch (error) {
      console.error('Failed to appoint cabinet member:', error);
      return { success: false, error: 'Failed to appoint cabinet member' };
    }
  }

  async getCabinetMembers(status?: CabinetMemberStatus, department?: string): Promise<CabinetMember[]> {
    try {
      let query = 'SELECT * FROM cabinet_members WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      if (department) {
        query += ` AND department = $${++paramCount}`;
        params.push(department);
      }

      query += ' ORDER BY appointed_date DESC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapCabinetMember);
    } catch (error) {
      console.error('Failed to get cabinet members:', error);
      return [];
    }
  }

  async getCabinetMemberById(id: string): Promise<CabinetMember | null> {
    try {
      const result = await db.query('SELECT * FROM cabinet_members WHERE id = $1', [id]);
      return result.rows[0] ? this.mapCabinetMember(result.rows[0]) : null;
    } catch (error) {
      console.error('Failed to get cabinet member by ID:', error);
      return null;
    }
  }

  async getCabinetMemberByRole(roleId: string): Promise<CabinetMember | null> {
    try {
      const result = await db.query('SELECT * FROM cabinet_members WHERE role_id = $1 AND status IN ($2, $3)', 
        [roleId, 'active', 'confirmed']);
      return result.rows[0] ? this.mapCabinetMember(result.rows[0]) : null;
    } catch (error) {
      console.error('Failed to get cabinet member by role:', error);
      return null;
    }
  }

  async updateCabinetMember(id: string, updates: Partial<CabinetMember>): Promise<CabinetResponse> {
    try {
      const setClauses: string[] = [];
      const params: any[] = [];
      let paramCount = 0;

      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id' || key === 'createdAt') return;
        
        paramCount++;
        const dbKey = this.camelToSnake(key);
        
        if (typeof value === 'object' && value !== null) {
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
        UPDATE cabinet_members 
        SET ${setClauses.join(', ')}
        WHERE id = $${params.length}
      `, params);

      return { success: true };
    } catch (error) {
      console.error('Failed to update cabinet member:', error);
      return { success: false, error: 'Failed to update cabinet member' };
    }
  }

  async dismissCabinetMember(id: string, reason: string, dismissedBy: string): Promise<CabinetResponse> {
    try {
      const member = await this.getCabinetMemberById(id);
      if (!member) {
        return { success: false, error: 'Cabinet member not found' };
      }

      // Update status to dismissed
      await db.query(`
        UPDATE cabinet_members 
        SET status = 'dismissed', updated_at = now()
        WHERE id = $1
      `, [id]);

      // Revoke all delegations
      await this.revokeMemberDelegations(id, reason, dismissedBy);

      // Cancel active assignments
      await this.cancelMemberAssignments(id, reason);

      await this.logActivity('dismissal', `${member.name} dismissed from ${member.title}`, 'high', [id]);

      return { success: true };
    } catch (error) {
      console.error('Failed to dismiss cabinet member:', error);
      return { success: false, error: 'Failed to dismiss cabinet member' };
    }
  }

  // ===== DELEGATION INTEGRATION =====

  async createDefaultDelegation(memberId: string, roleId: string): Promise<void> {
    try {
      const role = await this.getGovernmentRole(roleId);
      if (!role) return;

      const delegationData: Omit<AuthorityDelegation, 'createdAt' | 'updatedAt'> = {
        id: `delegation_${memberId}_${Date.now()}`,
        delegatorId: 'system', // System-created delegation
        delegateeId: memberId,
        roleId: roleId,
        campaignId: 1, // Default campaign
        scope: 'limited', // Start with limited scope
        permissions: role.defaultPermissions.map(p => p.id || p),
        conditions: [],
        limitations: [
          {
            type: 'spending-limit',
            value: 1000000, // 1M credits default
            unit: 'credits',
            description: 'Default spending limit for new cabinet members'
          }
        ],
        startDate: new Date(),
        endDate: undefined, // No end date for cabinet positions
        isActive: true,
        isRevocable: true,
        revocationReason: undefined
      };

      await delegationService.createDelegation(delegationData);
    } catch (error) {
      console.error('Failed to create default delegation:', error);
    }
  }

  async revokeMemberDelegations(memberId: string, reason: string, revokedBy: string): Promise<void> {
    try {
      const delegations = await delegationService.getDelegations(1, memberId, true);
      
      for (const delegation of delegations) {
        await delegationService.revokeDelegation(delegation.id, reason, revokedBy);
      }
    } catch (error) {
      console.error('Failed to revoke member delegations:', error);
    }
  }

  async checkMemberAuthority(memberId: string, requiredPermissions: string[], campaignId: number): Promise<AuthorityCheckResult> {
    try {
      return await delegationService.checkAuthority(memberId, requiredPermissions, campaignId);
    } catch (error) {
      console.error('Failed to check member authority:', error);
      return {
        hasAuthority: false,
        authorityLevel: 0,
        missingPermissions: requiredPermissions,
        limitations: [],
        requiresApproval: true
      };
    }
  }

  // ===== ASSIGNMENT MANAGEMENT =====

  async createAssignment(assignmentData: Omit<Assignment, 'id'>): Promise<CabinetResponse> {
    try {
      const assignmentId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.query(`
        INSERT INTO cabinet_assignments (
          id, title, description, category, priority, status, assigned_by,
          assigned_to, assigned_date, due_date, estimated_hours, dependencies,
          deliverables, progress, notes, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        assignmentId, assignmentData.title, assignmentData.description,
        assignmentData.category, assignmentData.priority, assignmentData.status,
        assignmentData.assignedBy, assignmentData.assignedDate, assignmentData.dueDate,
        assignmentData.estimatedHours, JSON.stringify(assignmentData.dependencies),
        JSON.stringify(assignmentData.deliverables), assignmentData.progress,
        assignmentData.notes, JSON.stringify(assignmentData.attachments)
      ]);

      return { success: true, data: { id: assignmentId, ...assignmentData } };
    } catch (error) {
      console.error('Failed to create assignment:', error);
      return { success: false, error: 'Failed to create assignment' };
    }
  }

  async getAssignments(memberId?: string, status?: string): Promise<Assignment[]> {
    try {
      let query = 'SELECT * FROM cabinet_assignments WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (memberId) {
        query += ` AND assigned_to = $${++paramCount}`;
        params.push(memberId);
      }

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      query += ' ORDER BY due_date ASC, priority DESC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapAssignment);
    } catch (error) {
      console.error('Failed to get assignments:', error);
      return [];
    }
  }

  async cancelMemberAssignments(memberId: string, reason: string): Promise<void> {
    try {
      await db.query(`
        UPDATE cabinet_assignments 
        SET status = 'cancelled', notes = $1, updated_at = now()
        WHERE assigned_to = $2 AND status IN ('assigned', 'in-progress')
      `, [reason, memberId]);
    } catch (error) {
      console.error('Failed to cancel member assignments:', error);
    }
  }

  // ===== BUREAUCRATIC PROCESS MANAGEMENT =====

  async createBureaucraticProcess(processData: Omit<BureaucraticProcess, 'createdAt' | 'updatedAt'>): Promise<CabinetResponse> {
    try {
      await db.query(`
        INSERT INTO bureaucratic_processes (
          id, name, description, department, category, steps, required_approvals,
          estimated_duration, priority, status, version, effective_date,
          expiration_date, created_by, approved_by, related_policies,
          compliance_requirements, performance_metrics
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        processData.id, processData.name, processData.description,
        processData.department, processData.category, JSON.stringify(processData.steps),
        JSON.stringify(processData.requiredApprovals), processData.estimatedDuration,
        processData.priority, processData.status, processData.version,
        processData.effectiveDate, processData.expirationDate, processData.createdBy,
        JSON.stringify(processData.approvedBy), JSON.stringify(processData.relatedPolicies),
        JSON.stringify(processData.complianceRequirements),
        JSON.stringify(processData.performanceMetrics)
      ]);

      return { success: true, data: processData };
    } catch (error) {
      console.error('Failed to create bureaucratic process:', error);
      return { success: false, error: 'Failed to create bureaucratic process' };
    }
  }

  async getBureaucraticProcesses(department?: string, status?: string): Promise<BureaucraticProcess[]> {
    try {
      let query = 'SELECT * FROM bureaucratic_processes WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (department) {
        query += ` AND department = $${++paramCount}`;
        params.push(department);
      }

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      query += ' ORDER BY priority DESC, name ASC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapBureaucraticProcess);
    } catch (error) {
      console.error('Failed to get bureaucratic processes:', error);
      return [];
    }
  }

  // ===== CABINET MEETINGS =====

  async scheduleCabinetMeeting(meetingData: Omit<CabinetMeeting, 'createdAt' | 'updatedAt'>): Promise<CabinetResponse> {
    try {
      await db.query(`
        INSERT INTO cabinet_meetings (
          id, title, type, scheduled_date, duration, location, chairperson,
          attendees, agenda, status, security_classification, recording_allowed,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        meetingData.id, meetingData.title, meetingData.type, meetingData.scheduledDate,
        meetingData.duration, meetingData.location, meetingData.chairperson,
        JSON.stringify(meetingData.attendees), JSON.stringify(meetingData.agenda),
        meetingData.status, meetingData.securityClassification,
        meetingData.recordingAllowed, meetingData.createdBy
      ]);

      await this.logActivity('meeting', `Cabinet meeting scheduled: ${meetingData.title}`, 'medium', 
        meetingData.attendees.map(a => a.memberId));

      return { success: true, data: meetingData };
    } catch (error) {
      console.error('Failed to schedule cabinet meeting:', error);
      return { success: false, error: 'Failed to schedule cabinet meeting' };
    }
  }

  async getCabinetMeetings(status?: string, type?: string): Promise<CabinetMeeting[]> {
    try {
      let query = 'SELECT * FROM cabinet_meetings WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      if (type) {
        query += ` AND type = $${++paramCount}`;
        params.push(type);
      }

      query += ' ORDER BY scheduled_date DESC';

      const result = await db.query(query, params);
      return result.rows.map(this.mapCabinetMeeting);
    } catch (error) {
      console.error('Failed to get cabinet meetings:', error);
      return [];
    }
  }

  // ===== DECISION SUPPORT =====

  async createDecisionSupportRequest(requestData: Omit<DecisionSupportRequest, 'createdAt' | 'updatedAt'>): Promise<CabinetResponse> {
    try {
      await db.query(`
        INSERT INTO decision_support_requests (
          id, requester_id, title, description, category, urgency, context,
          options, constraints, stakeholders, timeline, required_analysis,
          budget_impact, risk_assessment, recommendations, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        requestData.id, requestData.requesterId, requestData.title,
        requestData.description, requestData.category, requestData.urgency,
        JSON.stringify(requestData.context), JSON.stringify(requestData.options),
        JSON.stringify(requestData.constraints), JSON.stringify(requestData.stakeholders),
        JSON.stringify(requestData.timeline), JSON.stringify(requestData.requiredAnalysis),
        JSON.stringify(requestData.budgetImpact), JSON.stringify(requestData.riskAssessment),
        JSON.stringify(requestData.recommendations), requestData.status
      ]);

      return { success: true, data: requestData };
    } catch (error) {
      console.error('Failed to create decision support request:', error);
      return { success: false, error: 'Failed to create decision support request' };
    }
  }

  // ===== SYSTEM SUMMARY =====

  async getCabinetSummary(): Promise<CabinetSummary> {
    try {
      const [membersResult, processesResult, meetingsResult, assignmentsResult] = await Promise.all([
        db.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = $1) as active, COUNT(*) FILTER (WHERE status = $2) as pending FROM cabinet_members', ['active', 'nominated']),
        db.query('SELECT COUNT(*) as active FROM bureaucratic_processes WHERE status = $1', ['active']),
        db.query('SELECT COUNT(*) as upcoming FROM cabinet_meetings WHERE status = $1 AND scheduled_date > now()', ['scheduled']),
        db.query('SELECT COUNT(*) as overdue FROM cabinet_assignments WHERE status IN ($1, $2) AND due_date < now()', ['assigned', 'in-progress'])
      ]);

      const recentActivity = await this.getRecentActivity(10);

      return {
        totalMembers: parseInt(membersResult.rows[0]?.total || '0'),
        activeMembers: parseInt(membersResult.rows[0]?.active || '0'),
        pendingNominations: parseInt(membersResult.rows[0]?.pending || '0'),
        activeProcesses: parseInt(processesResult.rows[0]?.active || '0'),
        pendingDecisions: 0, // Would be calculated from decision support requests
        upcomingMeetings: parseInt(meetingsResult.rows[0]?.upcoming || '0'),
        overdueTasks: parseInt(assignmentsResult.rows[0]?.overdue || '0'),
        systemHealth: {
          status: 'healthy',
          issues: [],
          recommendations: [],
          lastHealthCheck: new Date()
        },
        performanceMetrics: {
          averageResponseTime: 0,
          decisionThroughput: 0,
          processEfficiency: 0,
          memberSatisfaction: 0
        },
        recentActivity: recentActivity
      };
    } catch (error) {
      console.error('Failed to get cabinet summary:', error);
      return {
        totalMembers: 0,
        activeMembers: 0,
        pendingNominations: 0,
        activeProcesses: 0,
        pendingDecisions: 0,
        upcomingMeetings: 0,
        overdueTasks: 0,
        systemHealth: {
          status: 'critical',
          issues: ['Failed to retrieve system status'],
          recommendations: ['Check database connectivity'],
          lastHealthCheck: new Date()
        },
        performanceMetrics: {
          averageResponseTime: 0,
          decisionThroughput: 0,
          processEfficiency: 0,
          memberSatisfaction: 0
        },
        recentActivity: []
      };
    }
  }

  // ===== HELPER METHODS =====

  private async getGovernmentRole(roleId: string): Promise<GovernmentRole | null> {
    try {
      const result = await db.query('SELECT * FROM government_roles WHERE id = $1', [roleId]);
      return result.rows[0] ? {
        id: result.rows[0].id,
        name: result.rows[0].name,
        title: result.rows[0].title,
        department: result.rows[0].department,
        description: result.rows[0].description,
        baseAuthorityLevel: result.rows[0].base_authority_level,
        defaultPermissions: JSON.parse(result.rows[0].default_permissions || '[]'),
        requiredClearanceLevel: result.rows[0].required_clearance_level,
        canDelegate: result.rows[0].can_delegate,
        maxDelegationLevel: result.rows[0].max_delegation_level,
        successionOrder: result.rows[0].succession_order,
        isActive: result.rows[0].is_active,
        createdAt: new Date(result.rows[0].created_at),
        updatedAt: new Date(result.rows[0].updated_at)
      } : null;
    } catch (error) {
      console.error('Failed to get government role:', error);
      return null;
    }
  }

  private async logActivity(type: string, title: string, impact: string, participants: string[]): Promise<void> {
    try {
      await db.query(`
        INSERT INTO cabinet_activity_log (
          id, type, title, description, timestamp, participants, impact, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type, title, title, new Date(), JSON.stringify(participants), impact, 'completed'
      ]);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  private async getRecentActivity(limit: number): Promise<RecentActivity[]> {
    try {
      const result = await db.query(`
        SELECT * FROM cabinet_activity_log 
        ORDER BY timestamp DESC 
        LIMIT $1
      `, [limit]);

      return result.rows.map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        timestamp: new Date(row.timestamp),
        participants: JSON.parse(row.participants || '[]'),
        impact: row.impact,
        status: row.status
      }));
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return [];
    }
  }

  private mapCabinetMember(row: any): CabinetMember {
    return {
      id: row.id,
      userId: row.user_id,
      roleId: row.role_id,
      name: row.name,
      title: row.title,
      department: row.department,
      appointedDate: new Date(row.appointed_date),
      confirmedDate: row.confirmed_date ? new Date(row.confirmed_date) : undefined,
      status: row.status,
      securityClearance: row.security_clearance,
      personalityProfile: JSON.parse(row.personality_profile || '{}'),
      performanceMetrics: JSON.parse(row.performance_metrics || '{}'),
      delegatedAuthorities: [], // Would be loaded separately
      currentAssignments: [], // Would be loaded separately
      communicationPreferences: JSON.parse(row.communication_preferences || '{}'),
      emergencyContactInfo: JSON.parse(row.emergency_contact_info || '{}'),
      biography: row.biography,
      qualifications: JSON.parse(row.qualifications || '[]'),
      previousExperience: JSON.parse(row.previous_experience || '[]'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapAssignment(row: any): Assignment {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      assignedBy: row.assigned_by,
      assignedDate: new Date(row.assigned_date),
      dueDate: new Date(row.due_date),
      completedDate: row.completed_date ? new Date(row.completed_date) : undefined,
      estimatedHours: row.estimated_hours,
      actualHours: row.actual_hours,
      dependencies: JSON.parse(row.dependencies || '[]'),
      deliverables: JSON.parse(row.deliverables || '[]'),
      progress: row.progress,
      notes: row.notes,
      attachments: JSON.parse(row.attachments || '[]')
    };
  }

  private mapBureaucraticProcess(row: any): BureaucraticProcess {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      department: row.department,
      category: row.category,
      steps: JSON.parse(row.steps || '[]'),
      requiredApprovals: JSON.parse(row.required_approvals || '[]'),
      estimatedDuration: row.estimated_duration,
      priority: row.priority,
      status: row.status,
      version: row.version,
      effectiveDate: new Date(row.effective_date),
      expirationDate: row.expiration_date ? new Date(row.expiration_date) : undefined,
      createdBy: row.created_by,
      approvedBy: JSON.parse(row.approved_by || '[]'),
      relatedPolicies: JSON.parse(row.related_policies || '[]'),
      complianceRequirements: JSON.parse(row.compliance_requirements || '[]'),
      performanceMetrics: JSON.parse(row.performance_metrics || '{}'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapCabinetMeeting(row: any): CabinetMeeting {
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      scheduledDate: new Date(row.scheduled_date),
      duration: row.duration,
      location: row.location,
      chairperson: row.chairperson,
      attendees: JSON.parse(row.attendees || '[]'),
      agenda: JSON.parse(row.agenda || '[]'),
      minutes: JSON.parse(row.minutes || '{}'),
      decisions: JSON.parse(row.decisions || '[]'),
      actionItems: JSON.parse(row.action_items || '[]'),
      status: row.status,
      securityClassification: row.security_classification,
      recordingAllowed: row.recording_allowed,
      createdBy: row.created_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export const cabinetService = new CabinetService();
