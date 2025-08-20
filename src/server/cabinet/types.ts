/**
 * Cabinet & Bureaucracy Management System Types
 * 
 * Comprehensive type definitions for cabinet operations, bureaucratic workflows,
 * decision support systems, and government automation.
 */

import { 
  GovernmentRole, 
  AuthorityDelegation, 
  Decision, 
  AuthorityLevel,
  DecisionCategory,
  DecisionImpact 
} from '../delegation/types.js';

// Cabinet Member Types
export interface CabinetMember {
  id: string;
  userId: string;
  roleId: string;
  name: string;
  title: string;
  department: string;
  appointedDate: Date;
  confirmedDate?: Date;
  status: CabinetMemberStatus;
  securityClearance: number;
  personalityProfile: PersonalityProfile;
  performanceMetrics: CabinetPerformance;
  delegatedAuthorities: AuthorityDelegation[];
  currentAssignments: Assignment[];
  communicationPreferences: CommunicationPreferences;
  emergencyContactInfo: EmergencyContact;
  biography: string;
  qualifications: string[];
  previousExperience: Experience[];
  createdAt: Date;
  updatedAt: Date;
}

export type CabinetMemberStatus = 'nominated' | 'confirmed' | 'active' | 'suspended' | 'resigned' | 'dismissed';

export interface PersonalityProfile {
  decisionMakingStyle: 'analytical' | 'intuitive' | 'collaborative' | 'decisive' | 'cautious';
  riskTolerance: number; // 0-1
  communicationStyle: 'formal' | 'casual' | 'direct' | 'diplomatic' | 'technical';
  workingHours: {
    preferredStart: string; // HH:MM
    preferredEnd: string; // HH:MM
    timezone: string;
    availability247: boolean;
  };
  stressResponse: 'calm' | 'focused' | 'aggressive' | 'withdrawn' | 'collaborative';
  loyaltyLevel: number; // 0-1
  competencyAreas: string[];
  weaknessAreas: string[];
}

export interface CabinetPerformance {
  overallRating: number; // 0-5
  decisionsHandled: number;
  averageResponseTime: number; // minutes
  successRate: number; // 0-1
  playerSatisfaction: number; // 0-1
  departmentEfficiency: number; // 0-1
  crisisManagement: number; // 0-1
  interDepartmentalCooperation: number; // 0-1
  publicApproval: number; // 0-1
  recentFeedback: PerformanceFeedback[];
  achievements: Achievement[];
  concerns: Concern[];
  lastReviewDate: Date;
}

export interface PerformanceFeedback {
  id: string;
  source: 'player' | 'peer' | 'subordinate' | 'public' | 'ai-analysis';
  rating: number; // 1-5
  category: string;
  comments: string;
  timestamp: Date;
  isAnonymous: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: DecisionImpact;
  dateAchieved: Date;
  recognitionLevel: 'internal' | 'public' | 'international';
}

export interface Concern {
  id: string;
  type: 'performance' | 'ethical' | 'security' | 'health' | 'loyalty';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedBy: string;
  reportedDate: Date;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
}

// Assignment and Task Management
export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
  assignedBy: string;
  assignedDate: Date;
  dueDate: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  deliverables: Deliverable[];
  progress: number; // 0-100
  notes: string;
  attachments: Attachment[];
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'report' | 'decision' | 'policy' | 'briefing' | 'analysis' | 'recommendation';
  status: 'pending' | 'draft' | 'review' | 'approved' | 'published';
  content?: string;
  metadata: Record<string, any>;
  reviewers: string[];
  approvers: string[];
  dueDate: Date;
  completedDate?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: Date;
  description?: string;
  securityClassification: 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
}

// Communication System
export interface CommunicationPreferences {
  preferredChannels: CommunicationChannel[];
  urgencyThresholds: {
    low: CommunicationChannel[];
    medium: CommunicationChannel[];
    high: CommunicationChannel[];
    critical: CommunicationChannel[];
  };
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    daysOfWeek: number[]; // 0-6, Sunday=0
  };
  emergencyContact: boolean;
  autoResponse: {
    enabled: boolean;
    message?: string;
    delayMinutes: number;
  };
}

export type CommunicationChannel = 'email' | 'sms' | 'voice-call' | 'video-call' | 'secure-message' | 'in-person' | 'ai-assistant';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address?: string;
  isAuthorizedForClassified: boolean;
}

export interface Experience {
  organization: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  relevantSkills: string[];
}

// Bureaucratic Workflow Types
export interface BureaucraticProcess {
  id: string;
  name: string;
  description: string;
  department: string;
  category: DecisionCategory;
  steps: ProcessStep[];
  requiredApprovals: ApprovalRequirement[];
  estimatedDuration: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'suspended' | 'deprecated';
  version: string;
  effectiveDate: Date;
  expirationDate?: Date;
  createdBy: string;
  approvedBy: string[];
  relatedPolicies: string[];
  complianceRequirements: ComplianceRequirement[];
  performanceMetrics: ProcessMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'review' | 'notification';
  assignedRole: string;
  estimatedDuration: number; // minutes
  requiredInputs: ProcessInput[];
  expectedOutputs: ProcessOutput[];
  conditions: ProcessCondition[];
  escalationRules: EscalationRule[];
  isParallel: boolean;
  dependencies: string[];
}

export interface ProcessInput {
  name: string;
  type: 'text' | 'number' | 'date' | 'file' | 'selection' | 'boolean';
  required: boolean;
  validation: ValidationRule[];
  description: string;
  defaultValue?: any;
}

export interface ProcessOutput {
  name: string;
  type: 'document' | 'decision' | 'notification' | 'data' | 'approval';
  description: string;
  recipients: string[];
  format: string;
  template?: string;
}

export interface ProcessCondition {
  type: 'if' | 'unless' | 'while' | 'until';
  expression: string;
  action: 'proceed' | 'skip' | 'repeat' | 'escalate' | 'abort';
  parameters: Record<string, any>;
}

export interface ValidationRule {
  type: 'required' | 'min-length' | 'max-length' | 'pattern' | 'range' | 'custom';
  parameters: Record<string, any>;
  errorMessage: string;
}

export interface ApprovalRequirement {
  stepId: string;
  approverRole: string;
  approverLevel: AuthorityLevel;
  isRequired: boolean;
  timeoutMinutes: number;
  escalationAction: 'auto-approve' | 'escalate' | 'reject' | 'delegate';
}

export interface ComplianceRequirement {
  regulation: string;
  description: string;
  mandatorySteps: string[];
  auditRequirements: string[];
  reportingRequirements: ReportingRequirement[];
}

export interface ReportingRequirement {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'on-demand';
  recipients: string[];
  format: string;
  template: string;
  dueDate: string; // cron expression or relative date
}

export interface EscalationRule {
  condition: 'timeout' | 'rejection' | 'error' | 'exception' | 'manual';
  action: 'escalate-to-superior' | 'delegate-to-peer' | 'auto-approve' | 'abort-process';
  targetRole?: string;
  notificationMessage: string;
  timeoutMinutes: number;
}

// Process Execution and Tracking
export interface ProcessInstance {
  id: string;
  processId: string;
  initiatedBy: string;
  initiatedDate: Date;
  currentStep: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'critical';
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  stepHistory: StepExecution[];
  estimatedCompletion: Date;
  actualCompletion?: Date;
  assignedPersonnel: string[];
  notes: string;
  attachments: Attachment[];
  auditTrail: ProcessAuditEntry[];
}

export interface StepExecution {
  stepId: string;
  assignedTo: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  duration: number; // minutes
  notes: string;
  errors: ProcessError[];
}

export interface ProcessError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: Date;
  context: Record<string, any>;
  resolution?: string;
}

export interface ProcessAuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ProcessMetrics {
  totalExecutions: number;
  averageDuration: number; // minutes
  successRate: number; // 0-1
  averageStepDuration: Record<string, number>;
  bottleneckSteps: string[];
  errorRate: number; // 0-1
  userSatisfaction: number; // 0-1
  costPerExecution: number;
  lastUpdated: Date;
}

// Decision Support System Types
export interface DecisionSupportRequest {
  id: string;
  requesterId: string;
  title: string;
  description: string;
  category: DecisionCategory;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  context: DecisionContext;
  options: DecisionOption[];
  constraints: DecisionConstraint[];
  stakeholders: Stakeholder[];
  timeline: DecisionTimeline;
  requiredAnalysis: AnalysisType[];
  budgetImpact: BudgetImpact;
  riskAssessment: RiskAssessment;
  recommendations: Recommendation[];
  status: 'draft' | 'analysis' | 'review' | 'decision' | 'implementation' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  decidedAt?: Date;
  implementedAt?: Date;
}

export interface DecisionContext {
  background: string;
  currentSituation: string;
  problemStatement: string;
  objectives: string[];
  successCriteria: string[];
  assumptions: string[];
  externalFactors: ExternalFactor[];
  historicalPrecedents: HistoricalPrecedent[];
  relatedDecisions: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  cost: number;
  timeToImplement: number; // days
  resourceRequirements: ResourceRequirement[];
  risks: Risk[];
  benefits: Benefit[];
  feasibility: number; // 0-1
  confidence: number; // 0-1
  supportLevel: number; // 0-1
}

export interface DecisionConstraint {
  type: 'budget' | 'time' | 'legal' | 'political' | 'technical' | 'resource' | 'ethical';
  description: string;
  severity: 'soft' | 'hard' | 'absolute';
  impact: string;
  workarounds: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department?: string;
  influence: number; // 0-1
  interest: number; // 0-1
  position: 'supporter' | 'neutral' | 'opponent' | 'unknown';
  concerns: string[];
  requirements: string[];
  communicationNeeds: string[];
}

export interface DecisionTimeline {
  requestDate: Date;
  analysisDeadline: Date;
  decisionDeadline: Date;
  implementationStart: Date;
  implementationEnd: Date;
  reviewDate: Date;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  description: string;
  dueDate: Date;
  dependencies: string[];
  deliverables: string[];
  responsible: string;
}

export type AnalysisType = 'cost-benefit' | 'risk-assessment' | 'stakeholder-analysis' | 'feasibility-study' | 'impact-analysis' | 'scenario-modeling' | 'precedent-research';

export interface BudgetImpact {
  initialCost: number;
  ongoingCosts: number;
  potentialSavings: number;
  roi: number;
  paybackPeriod: number; // months
  budgetSource: string;
  approvalRequired: boolean;
  fiscalYearImpact: FiscalYearImpact[];
}

export interface FiscalYearImpact {
  year: number;
  revenue: number;
  expenses: number;
  netImpact: number;
  confidence: number; // 0-1
}

export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: Risk[];
  mitigationStrategies: MitigationStrategy[];
  contingencyPlans: ContingencyPlan[];
  monitoringPlan: MonitoringPlan;
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'strategic' | 'compliance' | 'reputational' | 'technical';
  probability: number; // 0-1
  impact: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  triggers: string[];
  indicators: string[];
}

export interface MitigationStrategy {
  riskId: string;
  strategy: string;
  description: string;
  cost: number;
  effectiveness: number; // 0-1
  timeToImplement: number; // days
  responsible: string;
  status: 'proposed' | 'approved' | 'implemented' | 'monitoring';
}

export interface ContingencyPlan {
  trigger: string;
  description: string;
  actions: string[];
  resources: ResourceRequirement[];
  timeline: number; // hours
  responsible: string;
  communicationPlan: string;
}

export interface MonitoringPlan {
  frequency: string;
  metrics: string[];
  thresholds: Record<string, number>;
  responsible: string;
  reportingSchedule: string;
  escalationProcedure: string;
}

export interface Recommendation {
  id: string;
  recommendedOption: string;
  rationale: string;
  confidence: number; // 0-1
  source: 'ai-analysis' | 'expert-opinion' | 'data-analysis' | 'precedent' | 'stakeholder-input';
  supportingEvidence: string[];
  conditions: string[];
  alternatives: string[];
  implementationNotes: string;
  reviewDate: Date;
}

export interface ExternalFactor {
  name: string;
  description: string;
  type: 'economic' | 'political' | 'social' | 'technological' | 'environmental' | 'legal';
  impact: 'positive' | 'negative' | 'neutral' | 'mixed';
  controllability: 'high' | 'medium' | 'low' | 'none';
  timeframe: string;
  probability: number; // 0-1
}

export interface HistoricalPrecedent {
  title: string;
  description: string;
  date: Date;
  outcome: string;
  lessons: string[];
  applicability: number; // 0-1
  source: string;
}

export interface ResourceRequirement {
  type: 'personnel' | 'equipment' | 'facility' | 'technology' | 'material' | 'service';
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  availability: 'available' | 'limited' | 'unavailable' | 'unknown';
  source: string;
  timeline: string;
}

export interface Benefit {
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'strategic' | 'social' | 'environmental';
  quantifiable: boolean;
  value?: number;
  timeframe: string;
  confidence: number; // 0-1
  beneficiaries: string[];
}

// Cabinet Meeting and Coordination Types
export interface CabinetMeeting {
  id: string;
  title: string;
  type: 'regular' | 'emergency' | 'special' | 'crisis';
  scheduledDate: Date;
  duration: number; // minutes
  location: string;
  chairperson: string;
  attendees: MeetingAttendee[];
  agenda: AgendaItem[];
  minutes: MeetingMinutes;
  decisions: MeetingDecision[];
  actionItems: ActionItem[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
  securityClassification: 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
  recordingAllowed: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingAttendee {
  memberId: string;
  role: string;
  status: 'required' | 'optional' | 'observer';
  attendance: 'present' | 'absent' | 'late' | 'early-departure';
  proxy?: string;
  notes?: string;
}

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description: string;
  presenter: string;
  estimatedDuration: number; // minutes
  type: 'presentation' | 'discussion' | 'decision' | 'information' | 'update';
  materials: Attachment[];
  relatedDecisions: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'deferred';
  notes?: string;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  recorder: string;
  startTime: Date;
  endTime: Date;
  attendanceRecord: Record<string, string>;
  discussionSummary: DiscussionSummary[];
  keyPoints: string[];
  decisions: string[];
  actionItems: string[];
  nextMeetingDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  distributionList: string[];
}

export interface DiscussionSummary {
  agendaItemId: string;
  summary: string;
  keyPoints: string[];
  concerns: string[];
  recommendations: string[];
  duration: number; // minutes
}

export interface MeetingDecision {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  votingMethod: 'consensus' | 'majority' | 'unanimous' | 'executive';
  votes: Vote[];
  outcome: 'approved' | 'rejected' | 'deferred' | 'amended';
  implementationDate?: Date;
  responsible?: string;
  conditions?: string[];
}

export interface Vote {
  memberId: string;
  vote: 'yes' | 'no' | 'abstain' | 'absent';
  comments?: string;
  timestamp: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
  dependencies: string[];
  deliverables: string[];
  progress: number; // 0-100
  updates: ActionItemUpdate[];
}

export interface ActionItemUpdate {
  date: Date;
  progress: number;
  notes: string;
  updatedBy: string;
  attachments: Attachment[];
}

// System Integration Types
export interface CabinetSystemConfig {
  id: string;
  campaignId: number;
  settings: {
    autoMeetingScheduling: boolean;
    meetingFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    emergencyMeetingThreshold: number; // minutes
    decisionTimeoutDefault: number; // hours
    performanceReviewFrequency: number; // days
    auditRetentionPeriod: number; // days
  };
  workflowSettings: {
    autoApprovalEnabled: boolean;
    parallelProcessingEnabled: boolean;
    escalationTimeoutDefault: number; // minutes
    notificationSettings: NotificationSettings;
  };
  securitySettings: {
    classificationLevels: string[];
    accessControlEnabled: boolean;
    auditLoggingLevel: 'basic' | 'detailed' | 'comprehensive';
    encryptionRequired: boolean;
  };
  integrationSettings: {
    voiceCommandsEnabled: boolean;
    aiAssistantEnabled: boolean;
    realTimeUpdatesEnabled: boolean;
    externalSystemsEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  channels: CommunicationChannel[];
  urgencyMapping: Record<string, CommunicationChannel[]>;
  quietHours: {
    start: string;
    end: string;
    timezone: string;
  };
  batchNotifications: boolean;
  maxFrequency: number; // per hour
}

// API Response Types
export interface CabinetResponse {
  success: boolean;
  data?: any;
  error?: string;
  warnings?: string[];
  metadata?: {
    timestamp: Date;
    requestId: string;
    processingTime: number;
    cacheHit?: boolean;
  };
}

export interface CabinetSummary {
  totalMembers: number;
  activeMembers: number;
  pendingNominations: number;
  activeProcesses: number;
  pendingDecisions: number;
  upcomingMeetings: number;
  overdueTasks: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
    lastHealthCheck: Date;
  };
  performanceMetrics: {
    averageResponseTime: number;
    decisionThroughput: number;
    processEfficiency: number;
    memberSatisfaction: number;
  };
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'appointment' | 'decision' | 'meeting' | 'process' | 'emergency';
  title: string;
  description: string;
  timestamp: Date;
  participants: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
  status: string;
}
