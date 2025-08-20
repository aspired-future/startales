/**
 * Delegation & Authority Management System Types
 * 
 * Comprehensive type definitions for hierarchical authority structure,
 * role-based permissions, delegation levels, and automated decision-making.
 */

// Core Authority Types
export type AuthorityLevel = 0 | 1 | 2 | 3 | 4 | 5; // 0 = No Authority, 5 = Full Authority
export type DelegationScope = 'full' | 'limited' | 'approval-required' | 'advisory-only' | 'emergency-only';
export type DecisionCategory = 'military' | 'diplomatic' | 'economic' | 'domestic' | 'scientific' | 'legal' | 'intelligence' | 'administrative';
export type DecisionImpact = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'timeout' | 'auto-approved';

// Government Roles
export interface GovernmentRole {
  id: string;
  name: string;
  title: string;
  department: string;
  description: string;
  baseAuthorityLevel: AuthorityLevel;
  defaultPermissions: Permission[];
  requiredClearanceLevel: number;
  canDelegate: boolean;
  maxDelegationLevel: AuthorityLevel;
  successionOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Permission System
export interface Permission {
  id: string;
  name: string;
  category: DecisionCategory;
  description: string;
  requiredAuthorityLevel: AuthorityLevel;
  scope: string[];
  conditions?: PermissionCondition[];
  isRevocable: boolean;
}

export interface PermissionCondition {
  type: 'budget-limit' | 'geographic-scope' | 'time-restriction' | 'crisis-level' | 'approval-required';
  parameters: Record<string, any>;
  description: string;
}

// Authority Delegation
export interface AuthorityDelegation {
  id: string;
  delegatorId: string;
  delegateeId: string;
  roleId: string;
  campaignId: number;
  scope: DelegationScope;
  permissions: string[]; // Permission IDs
  conditions: DelegationCondition[];
  limitations: DelegationLimitation[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  isRevocable: boolean;
  revocationReason?: string;
  createdAt: Date;
  updatedAt: Date;
  revokedAt?: Date;
}

export interface DelegationCondition {
  type: 'budget-threshold' | 'geographic-boundary' | 'time-window' | 'crisis-activation' | 'approval-chain';
  parameters: Record<string, any>;
  description: string;
  isActive: boolean;
}

export interface DelegationLimitation {
  type: 'spending-limit' | 'troop-movement-limit' | 'policy-scope' | 'geographic-restriction' | 'time-limit';
  value: number | string;
  unit: string;
  description: string;
}

// Decision Framework
export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  impact: DecisionImpact;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requiredAuthorityLevel: AuthorityLevel;
  requiredPermissions: string[];
  campaignId: number;
  tickId: number;
  initiatorId: string;
  assignedToId?: string;
  options: DecisionOption[];
  selectedOptionId?: string;
  approvalChain: ApprovalStep[];
  currentApprovalStep: number;
  status: ApprovalStatus;
  deadline: Date;
  escalationDate?: Date;
  autoApprovalRules?: AutoApprovalRule[];
  context: DecisionContext;
  auditTrail: DecisionAuditEntry[];
  createdAt: Date;
  updatedAt: Date;
  decidedAt?: Date;
  implementedAt?: Date;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  consequences: string[];
  risks: RiskAssessment[];
  benefits: string[];
  cost: number;
  timeToImplement: number; // in ticks
  requiredResources: Record<string, number>;
  confidence: number; // 0-1
}

export interface RiskAssessment {
  type: string;
  probability: number; // 0-1
  impact: DecisionImpact;
  description: string;
  mitigationStrategies: string[];
}

export interface DecisionContext {
  situationAnalysis: string;
  stakeholders: string[];
  constraints: string[];
  precedents: string[];
  advisorRecommendations: AdvisorRecommendation[];
  aiAnalysis?: string;
  urgencyFactors: string[];
}

export interface AdvisorRecommendation {
  advisorId: string;
  advisorRole: string;
  recommendedOptionId: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
}

// Approval Workflow
export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverId: string;
  approverRole: string;
  requiredAuthorityLevel: AuthorityLevel;
  isParallel: boolean;
  status: ApprovalStatus;
  decision?: 'approve' | 'reject' | 'escalate' | 'modify';
  comments?: string;
  timestamp?: Date;
  timeoutDuration: number; // minutes
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  condition: 'timeout' | 'rejection' | 'unavailable' | 'conflict-of-interest';
  action: 'escalate-to-superior' | 'delegate-to-deputy' | 'auto-approve' | 'auto-reject' | 'emergency-protocol';
  targetId?: string;
  parameters: Record<string, any>;
}

// Auto-Approval System
export interface AutoApprovalRule {
  id: string;
  name: string;
  description: string;
  conditions: AutoApprovalCondition[];
  actions: AutoApprovalAction[];
  isActive: boolean;
  priority: number;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface AutoApprovalCondition {
  type: 'budget-under' | 'routine-operation' | 'emergency-situation' | 'precedent-exists' | 'low-risk';
  parameters: Record<string, any>;
  operator: 'and' | 'or';
}

export interface AutoApprovalAction {
  type: 'approve' | 'reject' | 'escalate' | 'modify' | 'delay';
  parameters: Record<string, any>;
  notificationRequired: boolean;
}

// Emergency Powers
export interface EmergencyPowers {
  id: string;
  name: string;
  description: string;
  activationConditions: EmergencyCondition[];
  expandedAuthorities: Permission[];
  temporaryDelegations: AuthorityDelegation[];
  duration: number; // in ticks
  autoDeactivationRules: EmergencyDeactivationRule[];
  isActive: boolean;
  activatedBy?: string;
  activatedAt?: Date;
  deactivatedAt?: Date;
  usageHistory: EmergencyUsageRecord[];
}

export interface EmergencyCondition {
  type: 'threat-level' | 'economic-crisis' | 'natural-disaster' | 'military-attack' | 'civil-unrest';
  threshold: number;
  parameters: Record<string, any>;
}

export interface EmergencyDeactivationRule {
  condition: 'time-limit' | 'threat-resolved' | 'manual-deactivation' | 'legislative-override';
  parameters: Record<string, any>;
}

export interface EmergencyUsageRecord {
  activationDate: Date;
  deactivationDate?: Date;
  reason: string;
  activatedBy: string;
  decisionsUnderEmergency: string[];
  outcome: string;
  lessonsLearned?: string;
}

// Audit and Accountability
export interface DecisionAuditEntry {
  id: string;
  decisionId: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  previousValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthorityAudit {
  id: string;
  subjectId: string;
  subjectType: 'user' | 'role' | 'delegation';
  action: 'granted' | 'revoked' | 'modified' | 'used' | 'exceeded';
  authorityType: string;
  details: Record<string, any>;
  performedBy: string;
  timestamp: Date;
  campaignId: number;
  tickId?: number;
}

// Performance Metrics
export interface DelegationPerformance {
  delegationId: string;
  delegateeId: string;
  roleId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    decisionsHandled: number;
    averageDecisionTime: number; // minutes
    approvalRate: number; // 0-1
    escalationRate: number; // 0-1
    playerSatisfactionScore: number; // 0-1
    errorRate: number; // 0-1
    efficiencyScore: number; // 0-1
  };
  feedback: PerformanceFeedback[];
  recommendations: string[];
  calculatedAt: Date;
}

export interface PerformanceFeedback {
  decisionId: string;
  playerRating: number; // 1-5
  playerComments?: string;
  outcome: 'successful' | 'partially-successful' | 'failed' | 'reversed';
  timestamp: Date;
}

// System Configuration
export interface DelegationSystemConfig {
  id: string;
  campaignId: number;
  settings: {
    defaultApprovalTimeout: number; // minutes
    maxDelegationDepth: number;
    emergencyPowersEnabled: boolean;
    autoApprovalEnabled: boolean;
    auditRetentionPeriod: number; // days
    performanceReviewFrequency: number; // ticks
  };
  globalRules: GlobalDelegationRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalDelegationRule {
  id: string;
  name: string;
  description: string;
  type: 'authority-limit' | 'approval-requirement' | 'escalation-rule' | 'audit-requirement';
  conditions: Record<string, any>;
  actions: Record<string, any>;
  isActive: boolean;
  priority: number;
}

// API Response Types
export interface DelegationResponse {
  success: boolean;
  data?: any;
  error?: string;
  warnings?: string[];
  auditId?: string;
}

export interface AuthorityCheckResult {
  hasAuthority: boolean;
  authorityLevel: AuthorityLevel;
  missingPermissions: string[];
  limitations: DelegationLimitation[];
  requiresApproval: boolean;
  approvalChain?: ApprovalStep[];
  estimatedApprovalTime?: number;
}

export interface DelegationSummary {
  totalDelegations: number;
  activeDelegations: number;
  pendingApprovals: number;
  emergencyPowersActive: boolean;
  recentDecisions: Decision[];
  performanceMetrics: DelegationPerformance[];
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  };
}
