/**
 * Cabinet API Routes
 * 
 * REST API endpoints for the Cabinet & Bureaucracy Management System
 */

import { Router, Request, Response } from 'express';
import { cabinetService } from './CabinetService';
import { 
  CabinetMember,
  CabinetMemberStatus,
  Assignment,
  BureaucraticProcess,
  CabinetMeeting,
  DecisionSupportRequest
} from './types';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for Cabinet System
const cabinetKnobsData = {
  // Cabinet Leadership & Coordination
  cabinet_cohesion_level: 0.7,            // Cabinet unity and coordination effectiveness
  executive_decision_speed: 0.6,          // Executive decision-making speed and efficiency
  inter_department_collaboration: 0.7,    // Inter-departmental collaboration and communication
  
  // Bureaucratic Efficiency & Management
  bureaucratic_streamlining: 0.6,         // Bureaucratic process streamlining and efficiency
  administrative_oversight: 0.8,          // Administrative oversight and quality control
  policy_implementation_coordination: 0.7, // Policy implementation coordination across departments
  
  // Cabinet Meeting & Decision Processes
  cabinet_meeting_frequency: 0.7,         // Cabinet meeting frequency and regularity
  decision_making_transparency: 0.6,      // Decision-making process transparency
  stakeholder_consultation_level: 0.7,    // Stakeholder consultation and input gathering
  
  // Personnel Management & Appointments
  cabinet_appointment_standards: 0.8,     // Cabinet appointment quality and standards
  senior_staff_retention: 0.7,            // Senior staff retention and stability
  merit_based_promotions: 0.8,            // Merit-based promotion and advancement
  
  // Crisis Management & Emergency Response
  crisis_response_coordination: 0.8,      // Crisis response coordination and effectiveness
  emergency_decision_authority: 0.7,      // Emergency decision-making authority and speed
  inter_agency_crisis_communication: 0.8, // Inter-agency crisis communication and coordination
  
  // Policy Development & Analysis
  policy_research_investment: 0.7,        // Policy research and analysis investment
  evidence_based_decision_making: 0.8,    // Evidence-based decision-making emphasis
  long_term_strategic_planning: 0.6,      // Long-term strategic planning and vision
  
  // Public Communication & Messaging
  government_messaging_coordination: 0.7, // Government messaging coordination and consistency
  public_communication_transparency: 0.6, // Public communication transparency and openness
  media_relations_management: 0.6,        // Media relations and press management
  
  // Accountability & Ethics
  cabinet_ethics_enforcement: 0.9,        // Cabinet ethics enforcement and compliance
  conflict_of_interest_management: 0.8,   // Conflict of interest management and disclosure
  government_accountability_measures: 0.8, // Government accountability and oversight measures
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Cabinet
const cabinetKnobSystem = new EnhancedKnobSystem(cabinetKnobsData);

// Apply cabinet knobs to game state
function applyCabinetKnobsToGameState() {
  const knobs = cabinetKnobSystem.knobs;
  
  // Apply cabinet leadership settings
  const cabinetLeadership = (knobs.cabinet_cohesion_level + knobs.executive_decision_speed + 
    knobs.inter_department_collaboration) / 3;
  
  // Apply bureaucratic efficiency settings
  const bureaucraticEfficiency = (knobs.bureaucratic_streamlining + knobs.administrative_oversight + 
    knobs.policy_implementation_coordination) / 3;
  
  // Apply decision processes settings
  const decisionProcesses = (knobs.cabinet_meeting_frequency + knobs.decision_making_transparency + 
    knobs.stakeholder_consultation_level) / 3;
  
  // Apply personnel management settings
  const personnelManagement = (knobs.cabinet_appointment_standards + knobs.senior_staff_retention + 
    knobs.merit_based_promotions) / 3;
  
  // Apply crisis management settings
  const crisisManagement = (knobs.crisis_response_coordination + knobs.emergency_decision_authority + 
    knobs.inter_agency_crisis_communication) / 3;
  
  // Apply accountability settings
  const accountability = (knobs.cabinet_ethics_enforcement + knobs.conflict_of_interest_management + 
    knobs.government_accountability_measures) / 3;
  
  console.log('Applied cabinet knobs to game state:', {
    cabinetLeadership,
    bureaucraticEfficiency,
    decisionProcesses,
    personnelManagement,
    crisisManagement,
    accountability
  });
}

// ===== CABINET MEMBERS ENDPOINTS =====

// GET /api/cabinet/members - Get all cabinet members
router.get('/members', async (req: Request, res: Response) => {
  try {
    const { status, department } = req.query;
    
    const members = await cabinetService.getCabinetMembers(
      status as CabinetMemberStatus,
      department as string
    );
    
    res.json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Failed to get cabinet members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cabinet members'
    });
  }
});

// GET /api/cabinet/members/:id - Get specific cabinet member
router.get('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const member = await cabinetService.getCabinetMemberById(id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Cabinet member not found'
      });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Failed to get cabinet member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cabinet member'
    });
  }
});

// POST /api/cabinet/members - Appoint a new cabinet member
router.post('/members', async (req: Request, res: Response) => {
  try {
    const memberData: Omit<CabinetMember, 'createdAt' | 'updatedAt' | 'delegatedAuthorities' | 'currentAssignments'> = {
      id: req.body.id || `member_${Date.now()}`,
      userId: req.body.userId,
      roleId: req.body.roleId,
      name: req.body.name,
      title: req.body.title,
      department: req.body.department,
      appointedDate: req.body.appointedDate ? new Date(req.body.appointedDate) : new Date(),
      confirmedDate: req.body.confirmedDate ? new Date(req.body.confirmedDate) : undefined,
      status: req.body.status || 'nominated',
      securityClearance: req.body.securityClearance || 1,
      personalityProfile: req.body.personalityProfile || {
        decisionMakingStyle: 'analytical',
        riskTolerance: 0.5,
        communicationStyle: 'formal',
        workingHours: {
          preferredStart: '09:00',
          preferredEnd: '17:00',
          timezone: 'UTC',
          availability247: false
        },
        stressResponse: 'calm',
        loyaltyLevel: 0.8,
        competencyAreas: [],
        weaknessAreas: []
      },
      performanceMetrics: req.body.performanceMetrics || {
        overallRating: 3.0,
        decisionsHandled: 0,
        averageResponseTime: 0,
        successRate: 0,
        playerSatisfaction: 0,
        departmentEfficiency: 0,
        crisisManagement: 0,
        interDepartmentalCooperation: 0,
        publicApproval: 0,
        recentFeedback: [],
        achievements: [],
        concerns: [],
        lastReviewDate: new Date()
      },
      communicationPreferences: req.body.communicationPreferences || {
        preferredChannels: ['email', 'secure-message'],
        urgencyThresholds: {
          low: ['email'],
          medium: ['email', 'secure-message'],
          high: ['secure-message', 'voice-call'],
          critical: ['voice-call', 'in-person']
        },
        workingHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'UTC',
          daysOfWeek: [1, 2, 3, 4, 5]
        },
        emergencyContact: true,
        autoResponse: {
          enabled: false,
          delayMinutes: 30
        }
      },
      emergencyContactInfo: req.body.emergencyContactInfo || {
        name: '',
        relationship: '',
        phoneNumber: '',
        email: '',
        isAuthorizedForClassified: false
      },
      biography: req.body.biography || '',
      qualifications: req.body.qualifications || [],
      previousExperience: req.body.previousExperience || []
    };

    const result = await cabinetService.appointCabinetMember(memberData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to appoint cabinet member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to appoint cabinet member'
    });
  }
});

// PUT /api/cabinet/members/:id - Update cabinet member
router.put('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const result = await cabinetService.updateCabinetMember(id, updates);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to update cabinet member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cabinet member'
    });
  }
});

// DELETE /api/cabinet/members/:id - Dismiss cabinet member
router.delete('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, dismissedBy } = req.body;
    
    if (!reason || !dismissedBy) {
      return res.status(400).json({
        success: false,
        error: 'Reason and dismissedBy are required'
      });
    }

    const result = await cabinetService.dismissCabinetMember(id, reason, dismissedBy);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to dismiss cabinet member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to dismiss cabinet member'
    });
  }
});

// POST /api/cabinet/members/:id/check-authority - Check member authority
router.post('/members/:id/check-authority', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { requiredPermissions, campaignId } = req.body;
    
    if (!requiredPermissions || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'requiredPermissions and campaignId are required'
      });
    }

    const result = await cabinetService.checkMemberAuthority(
      id,
      requiredPermissions,
      campaignId
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to check member authority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check member authority'
    });
  }
});

// ===== ASSIGNMENTS ENDPOINTS =====

// GET /api/cabinet/assignments - Get assignments
router.get('/assignments', async (req: Request, res: Response) => {
  try {
    const { memberId, status } = req.query;
    
    const assignments = await cabinetService.getAssignments(
      memberId as string,
      status as string
    );
    
    res.json({
      success: true,
      data: assignments,
      count: assignments.length
    });
  } catch (error) {
    console.error('Failed to get assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve assignments'
    });
  }
});

// POST /api/cabinet/assignments - Create new assignment
router.post('/assignments', async (req: Request, res: Response) => {
  try {
    const assignmentData: Omit<Assignment, 'id'> = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority || 'medium',
      status: req.body.status || 'assigned',
      assignedBy: req.body.assignedBy,
      assignedDate: req.body.assignedDate ? new Date(req.body.assignedDate) : new Date(),
      dueDate: new Date(req.body.dueDate),
      completedDate: req.body.completedDate ? new Date(req.body.completedDate) : undefined,
      estimatedHours: req.body.estimatedHours || 0,
      actualHours: req.body.actualHours,
      dependencies: req.body.dependencies || [],
      deliverables: req.body.deliverables || [],
      progress: req.body.progress || 0,
      notes: req.body.notes || '',
      attachments: req.body.attachments || []
    };

    const result = await cabinetService.createAssignment(assignmentData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment'
    });
  }
});

// ===== BUREAUCRATIC PROCESSES ENDPOINTS =====

// GET /api/cabinet/processes - Get bureaucratic processes
router.get('/processes', async (req: Request, res: Response) => {
  try {
    const { department, status } = req.query;
    
    const processes = await cabinetService.getBureaucraticProcesses(
      department as string,
      status as string
    );
    
    res.json({
      success: true,
      data: processes,
      count: processes.length
    });
  } catch (error) {
    console.error('Failed to get bureaucratic processes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve bureaucratic processes'
    });
  }
});

// POST /api/cabinet/processes - Create new bureaucratic process
router.post('/processes', async (req: Request, res: Response) => {
  try {
    const processData: Omit<BureaucraticProcess, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `process_${Date.now()}`,
      name: req.body.name,
      description: req.body.description,
      department: req.body.department,
      category: req.body.category,
      steps: req.body.steps || [],
      requiredApprovals: req.body.requiredApprovals || [],
      estimatedDuration: req.body.estimatedDuration || 0,
      priority: req.body.priority || 'medium',
      status: req.body.status || 'draft',
      version: req.body.version || '1.0',
      effectiveDate: req.body.effectiveDate ? new Date(req.body.effectiveDate) : new Date(),
      expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : undefined,
      createdBy: req.body.createdBy,
      approvedBy: req.body.approvedBy || [],
      relatedPolicies: req.body.relatedPolicies || [],
      complianceRequirements: req.body.complianceRequirements || [],
      performanceMetrics: req.body.performanceMetrics || {
        totalExecutions: 0,
        averageDuration: 0,
        successRate: 0,
        averageStepDuration: {},
        bottleneckSteps: [],
        errorRate: 0,
        userSatisfaction: 0,
        costPerExecution: 0,
        lastUpdated: new Date()
      }
    };

    const result = await cabinetService.createBureaucraticProcess(processData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create bureaucratic process:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bureaucratic process'
    });
  }
});

// ===== CABINET MEETINGS ENDPOINTS =====

// GET /api/cabinet/meetings - Get cabinet meetings
router.get('/meetings', async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    
    const meetings = await cabinetService.getCabinetMeetings(
      status as string,
      type as string
    );
    
    res.json({
      success: true,
      data: meetings,
      count: meetings.length
    });
  } catch (error) {
    console.error('Failed to get cabinet meetings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cabinet meetings'
    });
  }
});

// POST /api/cabinet/meetings - Schedule new cabinet meeting
router.post('/meetings', async (req: Request, res: Response) => {
  try {
    const meetingData: Omit<CabinetMeeting, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `meeting_${Date.now()}`,
      title: req.body.title,
      type: req.body.type || 'regular',
      scheduledDate: new Date(req.body.scheduledDate),
      duration: req.body.duration || 60,
      location: req.body.location,
      chairperson: req.body.chairperson,
      attendees: req.body.attendees || [],
      agenda: req.body.agenda || [],
      minutes: req.body.minutes || {},
      decisions: req.body.decisions || [],
      actionItems: req.body.actionItems || [],
      status: req.body.status || 'scheduled',
      securityClassification: req.body.securityClassification || 'internal',
      recordingAllowed: req.body.recordingAllowed || false,
      createdBy: req.body.createdBy
    };

    const result = await cabinetService.scheduleCabinetMeeting(meetingData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to schedule cabinet meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule cabinet meeting'
    });
  }
});

// ===== DECISION SUPPORT ENDPOINTS =====

// POST /api/cabinet/decision-support - Create decision support request
router.post('/decision-support', async (req: Request, res: Response) => {
  try {
    const requestData: Omit<DecisionSupportRequest, 'createdAt' | 'updatedAt'> = {
      id: req.body.id || `decision_${Date.now()}`,
      requesterId: req.body.requesterId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      urgency: req.body.urgency || 'medium',
      context: req.body.context || {},
      options: req.body.options || [],
      constraints: req.body.constraints || [],
      stakeholders: req.body.stakeholders || [],
      timeline: req.body.timeline || {},
      requiredAnalysis: req.body.requiredAnalysis || [],
      budgetImpact: req.body.budgetImpact || {},
      riskAssessment: req.body.riskAssessment || {},
      recommendations: req.body.recommendations || [],
      status: req.body.status || 'draft',
      decidedAt: req.body.decidedAt ? new Date(req.body.decidedAt) : undefined,
      implementedAt: req.body.implementedAt ? new Date(req.body.implementedAt) : undefined
    };

    const result = await cabinetService.createDecisionSupportRequest(requestData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Failed to create decision support request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create decision support request'
    });
  }
});

// ===== SYSTEM SUMMARY ENDPOINT =====

// GET /api/cabinet/summary - Get cabinet system summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const summary = await cabinetService.getCabinetSummary();
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Failed to get cabinet summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cabinet summary'
    });
  }
});

// ===== INITIALIZATION ENDPOINT =====

// POST /api/cabinet/initialize - Initialize default cabinet structure
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Campaign ID is required'
      });
    }

    // Create default cabinet members for all government roles
    const defaultMembers = [
      {
        id: 'member-secretary-defense',
        userId: 'ai-secretary-defense',
        roleId: 'secretary-defense',
        name: 'General Sarah Mitchell',
        title: 'Secretary of Defense',
        department: 'Defense',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 5,
        biography: 'Veteran military strategist with 25 years of service and expertise in galactic defense operations.'
      },
      {
        id: 'member-secretary-state',
        userId: 'ai-secretary-state',
        roleId: 'secretary-state',
        name: 'Ambassador Elena Rodriguez',
        title: 'Secretary of State',
        department: 'State',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 5,
        biography: 'Experienced diplomat with extensive background in interstellar relations and trade negotiations.'
      },
      {
        id: 'member-secretary-treasury',
        userId: 'ai-secretary-treasury',
        roleId: 'secretary-treasury',
        name: 'Dr. Marcus Chen',
        title: 'Secretary of Treasury',
        department: 'Treasury',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 4,
        biography: 'Renowned economist specializing in galactic trade and fiscal policy management.'
      },
      {
        id: 'member-secretary-interior',
        userId: 'ai-secretary-interior',
        roleId: 'secretary-interior',
        name: 'Dr. Amara Okafor',
        title: 'Secretary of Interior',
        department: 'Interior',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 3,
        biography: 'Environmental scientist and urban planner with expertise in planetary development and resource management.'
      },
      {
        id: 'member-secretary-science',
        userId: 'ai-secretary-science',
        roleId: 'secretary-science',
        name: 'Dr. Yuki Tanaka',
        title: 'Secretary of Science',
        department: 'Science',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 4,
        biography: 'Leading researcher in advanced technologies and interstellar exploration with multiple breakthrough discoveries.'
      },
      {
        id: 'member-attorney-general',
        userId: 'ai-attorney-general',
        roleId: 'attorney-general',
        name: 'Justice Patricia Williams',
        title: 'Attorney General',
        department: 'Justice',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 5,
        biography: 'Former Supreme Court Justice with extensive experience in constitutional law and interstellar legal frameworks.'
      },
      {
        id: 'member-intelligence-director',
        userId: 'ai-intelligence-director',
        roleId: 'intelligence-director',
        name: 'Director James Harrison',
        title: 'Director of Intelligence',
        department: 'Intelligence',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 5,
        biography: 'Career intelligence officer with deep expertise in threat analysis and strategic intelligence operations.'
      },
      {
        id: 'member-chief-of-staff',
        userId: 'ai-chief-of-staff',
        roleId: 'chief-of-staff',
        name: 'Alexandra Thompson',
        title: 'Chief of Staff',
        department: 'Administration',
        status: 'active' as CabinetMemberStatus,
        securityClearance: 4,
        biography: 'Experienced government administrator with proven track record in executive coordination and policy implementation.'
      }
    ];

    // Create cabinet members
    const memberResults = await Promise.all(
      defaultMembers.map(member => {
        const memberData: Omit<CabinetMember, 'createdAt' | 'updatedAt' | 'delegatedAuthorities' | 'currentAssignments'> = {
          ...member,
          appointedDate: new Date(),
          personalityProfile: {
            decisionMakingStyle: 'analytical',
            riskTolerance: 0.6,
            communicationStyle: 'formal',
            workingHours: {
              preferredStart: '08:00',
              preferredEnd: '18:00',
              timezone: 'UTC',
              availability247: true
            },
            stressResponse: 'focused',
            loyaltyLevel: 0.9,
            competencyAreas: [member.department.toLowerCase()],
            weaknessAreas: []
          },
          performanceMetrics: {
            overallRating: 4.0,
            decisionsHandled: 0,
            averageResponseTime: 15,
            successRate: 0.85,
            playerSatisfaction: 0.8,
            departmentEfficiency: 0.8,
            crisisManagement: 0.75,
            interDepartmentalCooperation: 0.8,
            publicApproval: 0.7,
            recentFeedback: [],
            achievements: [],
            concerns: [],
            lastReviewDate: new Date()
          },
          communicationPreferences: {
            preferredChannels: ['secure-message', 'voice-call'],
            urgencyThresholds: {
              low: ['email'],
              medium: ['secure-message'],
              high: ['voice-call'],
              critical: ['voice-call', 'in-person']
            },
            workingHours: {
              start: '08:00',
              end: '18:00',
              timezone: 'UTC',
              daysOfWeek: [1, 2, 3, 4, 5, 6, 7]
            },
            emergencyContact: true,
            autoResponse: {
              enabled: true,
              message: `This is an automated response. I will review your message and respond within my standard response time.`,
              delayMinutes: 15
            }
          },
          emergencyContactInfo: {
            name: 'Emergency Operations Center',
            relationship: 'Official',
            phoneNumber: '+1-555-EMERGENCY',
            email: 'emergency@government.gov',
            isAuthorizedForClassified: true
          },
          qualifications: [`${member.department} Leadership`, 'Government Service', 'Strategic Planning'],
          previousExperience: [
            {
              organization: 'Previous Government Service',
              position: `Deputy ${member.title}`,
              startDate: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), // 5 years ago
              endDate: new Date(),
              description: `Served as deputy in ${member.department} department`,
              achievements: ['Successful policy implementation', 'Crisis management'],
              relevantSkills: [member.department.toLowerCase(), 'leadership', 'policy-making']
            }
          ]
        };
        return cabinetService.appointCabinetMember(memberData);
      })
    );

    const successfulMembers = memberResults.filter(r => r.success).length;

    res.json({
      success: true,
      data: {
        membersCreated: successfulMembers,
        totalMembers: defaultMembers.length,
        campaignId: campaignId
      },
      message: `Initialized ${successfulMembers} cabinet members for campaign ${campaignId}`
    });

  } catch (error) {
    console.error('Failed to initialize cabinet system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize cabinet system'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'cabinet', cabinetKnobSystem, applyCabinetKnobsToGameState);

export default router;
