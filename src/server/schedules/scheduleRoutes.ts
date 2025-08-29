/**
 * Schedule Management API Routes
 * 
 * REST API endpoints for Schedule & Time Management System
 * including appointments, meetings, events, and automated scheduling.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Schedule Management System
const scheduleKnobsData = {
  // Scheduling Efficiency & Optimization
  scheduling_algorithm_sophistication: 0.8, // Scheduling algorithm sophistication and optimization
  conflict_resolution_automation: 0.8,     // Conflict resolution automation and overlap handling
  time_slot_optimization: 0.8,             // Time slot optimization and efficiency maximization
  
  // Meeting & Event Management
  meeting_preparation_automation: 0.7,     // Meeting preparation automation and agenda generation
  event_coordination_complexity: 0.8,      // Event coordination complexity and multi-party scheduling
  recurring_event_intelligence: 0.7,       // Recurring event intelligence and pattern recognition
  
  // Calendar Integration & Synchronization
  cross_platform_synchronization: 0.9,    // Cross-platform synchronization and universal compatibility
  real_time_update_reliability: 0.9,       // Real-time update reliability and instant synchronization
  calendar_sharing_granularity: 0.8,       // Calendar sharing granularity and privacy control
  
  // Notification & Reminder Systems
  notification_timing_intelligence: 0.8,   // Notification timing intelligence and optimal alerting
  reminder_customization_depth: 0.7,       // Reminder customization depth and personalization
  escalation_protocol_sophistication: 0.7, // Escalation protocol sophistication and urgency handling
  
  // Resource & Room Management
  resource_allocation_optimization: 0.8,   // Resource allocation optimization and availability tracking
  room_booking_intelligence: 0.8,          // Room booking intelligence and space utilization
  equipment_scheduling_coordination: 0.7,  // Equipment scheduling coordination and asset management
  
  // Time Zone & Global Coordination
  time_zone_handling_accuracy: 0.9,        // Time zone handling accuracy and global coordination
  international_scheduling_facilitation: 0.8, // International scheduling facilitation and cultural awareness
  daylight_saving_adaptation: 0.9,         // Daylight saving adaptation and automatic adjustments
  
  // Workflow & Process Integration
  workflow_scheduling_integration: 0.8,    // Workflow scheduling integration and process automation
  deadline_management_intelligence: 0.8,   // Deadline management intelligence and priority scheduling
  project_timeline_coordination: 0.8,      // Project timeline coordination and milestone tracking
  
  // Analytics & Performance Optimization
  scheduling_pattern_analysis: 0.7,        // Scheduling pattern analysis and behavior insights
  meeting_effectiveness_tracking: 0.7,     // Meeting effectiveness tracking and productivity metrics
  time_utilization_optimization: 0.8,      // Time utilization optimization and efficiency improvement
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Schedules
const scheduleKnobSystem = new EnhancedKnobSystem(scheduleKnobsData);

// Apply schedule knobs to game state
function applyScheduleKnobsToGameState() {
  const knobs = scheduleKnobSystem.knobs;
  
  // Apply scheduling efficiency settings
  const schedulingEfficiency = (knobs.scheduling_algorithm_sophistication + knobs.conflict_resolution_automation + 
    knobs.time_slot_optimization) / 3;
  
  // Apply meeting management settings
  const meetingManagement = (knobs.meeting_preparation_automation + knobs.event_coordination_complexity + 
    knobs.recurring_event_intelligence) / 3;
  
  // Apply calendar integration settings
  const calendarIntegration = (knobs.cross_platform_synchronization + knobs.real_time_update_reliability + 
    knobs.calendar_sharing_granularity) / 3;
  
  // Apply notification systems settings
  const notificationSystems = (knobs.notification_timing_intelligence + knobs.reminder_customization_depth + 
    knobs.escalation_protocol_sophistication) / 3;
  
  // Apply resource management settings
  const resourceManagement = (knobs.resource_allocation_optimization + knobs.room_booking_intelligence + 
    knobs.equipment_scheduling_coordination) / 3;
  
  // Apply workflow integration settings
  const workflowIntegration = (knobs.workflow_scheduling_integration + knobs.deadline_management_intelligence + 
    knobs.project_timeline_coordination) / 3;
  
  console.log('Applied schedule knobs to game state:', {
    schedulingEfficiency,
    meetingManagement,
    calendarIntegration,
    notificationSystems,
    resourceManagement,
    workflowIntegration
  });
}

// ===== SCHEDULE MANAGEMENT =====

/**
 * GET /api/schedules - Get schedules
 */
router.get('/', async (req, res) => {
  try {
    const { 
      userId, 
      campaignId,
      startDate, 
      endDate, 
      eventType,
      limit = 50,
      offset = 0
    } = req.query;

    if (!userId && !campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: userId or campaignId'
      });
    }

    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Mock schedule data
    const schedules = Array.from({ length: Math.min(Number(limit), 30) }, (_, i) => ({
      id: `schedule_${i + Number(offset) + 1}`,
      title: `Event ${i + 1}`,
      description: `Scheduled event ${i + 1} description`,
      eventType: eventType || ['meeting', 'appointment', 'deadline', 'reminder'][Math.floor(Math.random() * 4)],
      startTime: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
      endTime: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()) + 3600000), // +1 hour
      allDay: Math.random() > 0.8,
      
      participants: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: `participant_${j + 1}`,
        name: `Participant ${j + 1}`,
        role: ['organizer', 'required', 'optional'][Math.floor(Math.random() * 3)],
        status: ['accepted', 'pending', 'declined'][Math.floor(Math.random() * 3)]
      })),

      location: {
        type: Math.random() > 0.5 ? 'physical' : 'virtual',
        address: Math.random() > 0.5 ? 'Conference Room A' : 'Virtual Meeting Room',
        coordinates: Math.random() > 0.5 ? {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        } : null
      },

      recurrence: Math.random() > 0.7 ? {
        pattern: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)],
        interval: Math.floor(Math.random() * 3) + 1,
        endDate: new Date(end.getTime() + 90 * 24 * 60 * 60 * 1000) // +90 days
      } : null,

      reminders: [
        {
          id: `reminder_${i + 1}_1`,
          type: 'notification',
          timing: 15, // minutes before
          sent: false
        },
        {
          id: `reminder_${i + 1}_2`,
          type: 'email',
          timing: 60, // minutes before
          sent: false
        }
      ],

      metadata: {
        campaignId: campaignId ? Number(campaignId) : null,
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        category: ['work', 'personal', 'campaign', 'system'][Math.floor(Math.random() * 4)],
        tags: [`tag_${Math.floor(Math.random() * 5) + 1}`],
        createdBy: userId || `user_${Math.floor(Math.random() * 10) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30),
        lastModified: new Date(Date.now() - Math.random() * 86400000 * 7)
      }
    }));

    res.json({
      success: true,
      data: schedules,
      count: schedules.length,
      dateRange: { startDate: start, endDate: end },
      pagination: {
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({
      error: 'Failed to fetch schedules',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/schedules/:scheduleId - Get specific schedule
 */
router.get('/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { includeHistory = false } = req.query;

    const schedule = {
      id: scheduleId,
      title: `Schedule ${scheduleId}`,
      description: `Detailed information for schedule ${scheduleId}`,
      eventType: 'meeting',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1 hour
      allDay: false,
      
      participants: [
        {
          id: 'participant_1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'organizer',
          status: 'accepted',
          joinedAt: new Date()
        },
        {
          id: 'participant_2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'required',
          status: 'pending',
          invitedAt: new Date()
        }
      ],

      agenda: [
        {
          id: 'agenda_1',
          title: 'Opening remarks',
          duration: 10, // minutes
          presenter: 'participant_1'
        },
        {
          id: 'agenda_2',
          title: 'Main discussion',
          duration: 30,
          presenter: 'participant_2'
        },
        {
          id: 'agenda_3',
          title: 'Action items',
          duration: 15,
          presenter: 'participant_1'
        }
      ],

      resources: [
        {
          id: 'resource_1',
          type: 'room',
          name: 'Conference Room A',
          booked: true,
          capacity: 10
        },
        {
          id: 'resource_2',
          type: 'equipment',
          name: 'Projector',
          booked: true,
          available: true
        }
      ],

      attachments: [
        {
          id: 'attachment_1',
          name: 'Meeting Agenda.pdf',
          size: 245760, // bytes
          uploadedBy: 'participant_1',
          uploadedAt: new Date(Date.now() - 86400000)
        }
      ],

      history: includeHistory === 'true' ? [
        {
          id: 'history_1',
          action: 'created',
          performedBy: 'participant_1',
          timestamp: new Date(Date.now() - 86400000 * 7),
          details: 'Schedule created'
        },
        {
          id: 'history_2',
          action: 'participant_added',
          performedBy: 'participant_1',
          timestamp: new Date(Date.now() - 86400000 * 6),
          details: 'Added Jane Smith as required participant'
        }
      ] : undefined,

      status: 'scheduled',
      visibility: 'private',
      timeZone: 'UTC',
      
      metadata: {
        priority: 'high',
        category: 'work',
        tags: ['important', 'quarterly'],
        createdBy: 'participant_1',
        createdAt: new Date(Date.now() - 86400000 * 7),
        lastModified: new Date(Date.now() - 86400000)
      }
    };

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({
      error: 'Failed to fetch schedule',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/schedules - Create new schedule
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      startTime,
      endTime,
      allDay = false,
      participants,
      location,
      recurrence,
      reminders,
      createdBy,
      campaignId
    } = req.body;

    if (!title || !startTime || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'startTime', 'createdBy']
      });
    }

    const newSchedule = {
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: description || '',
      eventType: eventType || 'appointment',
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : new Date(new Date(startTime).getTime() + 3600000),
      allDay,
      
      participants: participants || [{
        id: createdBy,
        name: 'Organizer',
        role: 'organizer',
        status: 'accepted'
      }],

      location: location || {
        type: 'virtual',
        address: 'Virtual Meeting Room'
      },

      recurrence: recurrence || null,
      
      reminders: reminders || [
        {
          id: `reminder_${Date.now()}_1`,
          type: 'notification',
          timing: 15,
          sent: false
        }
      ],

      status: 'scheduled',
      visibility: 'private',
      timeZone: 'UTC',

      metadata: {
        campaignId: campaignId ? Number(campaignId) : null,
        priority: 'medium',
        category: 'work',
        tags: [],
        createdBy,
        createdAt: new Date(),
        lastModified: new Date()
      }
    };

    res.status(201).json({
      success: true,
      data: newSchedule
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({
      error: 'Failed to create schedule',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SCHEDULE OPERATIONS =====

/**
 * PUT /api/schedules/:scheduleId - Update schedule
 */
router.put('/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;

    const updatedSchedule = {
      id: scheduleId,
      ...updateData,
      metadata: {
        ...updateData.metadata,
        lastModified: new Date(),
        modifiedBy: updateData.modifiedBy || 'system'
      }
    };

    res.json({
      success: true,
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      error: 'Failed to update schedule',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/schedules/:scheduleId - Delete schedule
 */
router.delete('/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { deletedBy, reason } = req.body;

    const deletionResult = {
      id: scheduleId,
      deleted: true,
      deletedBy: deletedBy || 'system',
      deletedAt: new Date(),
      reason: reason || 'User requested deletion'
    };

    res.json({
      success: true,
      data: deletionResult
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({
      error: 'Failed to delete schedule',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== AVAILABILITY & CONFLICTS =====

/**
 * GET /api/schedules/availability - Check availability
 */
router.get('/availability', async (req, res) => {
  try {
    const { 
      participantIds, 
      startTime, 
      endTime, 
      duration = 60 
    } = req.query;

    if (!participantIds || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['participantIds', 'startTime', 'endTime']
      });
    }

    const participants = (participantIds as string).split(',');
    const availability = {
      timeRange: {
        startTime: new Date(startTime as string),
        endTime: new Date(endTime as string),
        duration: Number(duration)
      },
      participants: participants.map(id => ({
        id,
        available: Math.random() > 0.3, // 70% availability
        conflicts: Math.random() > 0.7 ? [{
          id: `conflict_${id}`,
          title: 'Existing Meeting',
          startTime: new Date(startTime as string),
          endTime: new Date(new Date(startTime as string).getTime() + 1800000) // 30 min
        }] : [],
        suggestedTimes: Array.from({ length: 3 }, (_, i) => ({
          startTime: new Date(new Date(startTime as string).getTime() + (i + 1) * 3600000),
          endTime: new Date(new Date(startTime as string).getTime() + (i + 1) * 3600000 + Number(duration) * 60000)
        }))
      })),
      overallAvailability: Math.random() > 0.5,
      bestSuggestedTime: {
        startTime: new Date(new Date(startTime as string).getTime() + 3600000),
        endTime: new Date(new Date(startTime as string).getTime() + 3600000 + Number(duration) * 60000),
        confidence: Math.random()
      }
    };

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      error: 'Failed to check availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'schedules', scheduleKnobSystem, applyScheduleKnobsToGameState);

export default router;
