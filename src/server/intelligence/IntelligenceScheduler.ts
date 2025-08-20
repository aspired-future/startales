/**
 * Intelligence Scheduler
 * Manages periodic generation of intelligence reports based on schedules and triggers
 */

import { EventEmitter } from 'events';
import { intelligenceEngine } from './IntelligenceEngine.js';
import {
  IntelligenceSchedule,
  IntelligenceReport,
  IntelligenceReportType,
  ScheduleFrequency,
  ScheduleStatus,
  Priority,
  ClassificationLevel,
  IntelligenceTrigger,
  TriggerType,
  TriggerCondition,
  ScheduleConfig,
  GenerateReportRequest
} from './types.js';

interface SchedulerConfig {
  maxConcurrentSchedules: number;
  defaultCheckInterval: number; // milliseconds
  enableEventTriggers: boolean;
  maxReportsPerHour: number;
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

export class IntelligenceScheduler extends EventEmitter {
  private config: SchedulerConfig;
  private schedules: Map<string, IntelligenceSchedule>;
  private timers: Map<string, NodeJS.Timeout>;
  private reportQueue: Map<string, GenerateReportRequest>;
  private isRunning: boolean;
  private lastReportCounts: Map<number, number>; // campaignId -> hourly count

  constructor(config?: Partial<SchedulerConfig>) {
    super();
    
    this.config = {
      maxConcurrentSchedules: 50,
      defaultCheckInterval: 60000, // 1 minute
      enableEventTriggers: true,
      maxReportsPerHour: 10,
      retryAttempts: 3,
      retryDelay: 30000, // 30 seconds
      ...config
    };

    this.schedules = new Map();
    this.timers = new Map();
    this.reportQueue = new Map();
    this.isRunning = false;
    this.lastReportCounts = new Map();

    // Reset hourly counters every hour
    setInterval(() => {
      this.lastReportCounts.clear();
    }, 3600000); // 1 hour
  }

  // ===== SCHEDULER MANAGEMENT =====

  /**
   * Start the intelligence scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Intelligence scheduler is already running');
      return;
    }

    this.isRunning = true;
    this.scheduleAllReports();
    this.emit('schedulerStarted');
    
    console.log('Intelligence scheduler started');
  }

  /**
   * Stop the intelligence scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('Intelligence scheduler is not running');
      return;
    }

    this.isRunning = false;
    
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    this.emit('schedulerStopped');
    console.log('Intelligence scheduler stopped');
  }

  /**
   * Add a new intelligence schedule
   */
  async addSchedule(schedule: Omit<IntelligenceSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const scheduleId = `schedule_${schedule.campaignId}_${schedule.reportType}_${Date.now()}`;
    
    const fullSchedule: IntelligenceSchedule = {
      id: scheduleId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...schedule
    };

    // Validate schedule
    if (!this.validateSchedule(fullSchedule)) {
      throw new Error('Invalid schedule configuration');
    }

    // Check concurrent limit
    if (this.schedules.size >= this.config.maxConcurrentSchedules) {
      throw new Error('Maximum concurrent schedules limit reached');
    }

    this.schedules.set(scheduleId, fullSchedule);
    
    // Schedule the report if scheduler is running
    if (this.isRunning && fullSchedule.enabled) {
      this.scheduleReport(fullSchedule);
    }

    this.emit('scheduleAdded', { scheduleId, schedule: fullSchedule });
    
    return scheduleId;
  }

  /**
   * Update an existing schedule
   */
  async updateSchedule(scheduleId: string, updates: Partial<IntelligenceSchedule>): Promise<void> {
    const existingSchedule = this.schedules.get(scheduleId);
    if (!existingSchedule) {
      throw new Error(`Schedule ${scheduleId} not found`);
    }

    const updatedSchedule: IntelligenceSchedule = {
      ...existingSchedule,
      ...updates,
      updatedAt: new Date()
    };

    // Validate updated schedule
    if (!this.validateSchedule(updatedSchedule)) {
      throw new Error('Invalid schedule configuration');
    }

    this.schedules.set(scheduleId, updatedSchedule);

    // Reschedule if running
    if (this.isRunning) {
      this.clearScheduleTimer(scheduleId);
      if (updatedSchedule.enabled) {
        this.scheduleReport(updatedSchedule);
      }
    }

    this.emit('scheduleUpdated', { scheduleId, schedule: updatedSchedule });
  }

  /**
   * Remove a schedule
   */
  async removeSchedule(scheduleId: string): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      throw new Error(`Schedule ${scheduleId} not found`);
    }

    this.schedules.delete(scheduleId);
    this.clearScheduleTimer(scheduleId);

    this.emit('scheduleRemoved', { scheduleId, schedule });
  }

  /**
   * Get all schedules for a campaign
   */
  getSchedulesForCampaign(campaignId: number): IntelligenceSchedule[] {
    return Array.from(this.schedules.values()).filter(
      schedule => schedule.campaignId === campaignId
    );
  }

  /**
   * Get schedule by ID
   */
  getSchedule(scheduleId: string): IntelligenceSchedule | undefined {
    return this.schedules.get(scheduleId);
  }

  /**
   * Get all schedules
   */
  getAllSchedules(): IntelligenceSchedule[] {
    return Array.from(this.schedules.values());
  }

  // ===== REPORT SCHEDULING =====

  /**
   * Schedule all enabled reports
   */
  private scheduleAllReports(): void {
    this.schedules.forEach(schedule => {
      if (schedule.enabled && schedule.status === 'active') {
        this.scheduleReport(schedule);
      }
    });
  }

  /**
   * Schedule a specific report
   */
  private scheduleReport(schedule: IntelligenceSchedule): void {
    const delay = this.calculateScheduleDelay(schedule);
    
    if (delay <= 0) {
      // Generate immediately
      this.generateScheduledReport(schedule);
    } else {
      // Schedule for later
      const timer = setTimeout(() => {
        this.generateScheduledReport(schedule);
      }, delay);

      this.timers.set(schedule.id, timer);
    }
  }

  /**
   * Calculate delay until next report generation
   */
  private calculateScheduleDelay(schedule: IntelligenceSchedule): number {
    const now = Date.now();
    const nextGeneration = schedule.nextGeneration.getTime();
    
    return Math.max(0, nextGeneration - now);
  }

  /**
   * Generate a scheduled report
   */
  private async generateScheduledReport(schedule: IntelligenceSchedule): Promise<void> {
    try {
      // Check rate limits
      if (!this.checkRateLimit(schedule.campaignId)) {
        console.warn(`Rate limit exceeded for campaign ${schedule.campaignId}`);
        this.rescheduleReport(schedule, 3600000); // Retry in 1 hour
        return;
      }

      // Update schedule status
      await this.updateScheduleStatus(schedule.id, 'active');

      // Create report request
      const reportRequest: GenerateReportRequest = {
        campaignId: schedule.campaignId,
        reportType: schedule.reportType,
        classification: schedule.config.classification,
        priority: schedule.priority,
        includeSections: schedule.config.includeSections,
        excludeSources: schedule.config.excludeSources,
        customPrompts: schedule.config.customPrompts
      };

      // Generate the report
      const response = await intelligenceEngine.generateReport(reportRequest);

      if (response.success && response.report) {
        // Update schedule with last generation time
        await this.updateScheduleLastGeneration(schedule.id, new Date());
        
        // Increment rate limit counter
        this.incrementReportCount(schedule.campaignId);

        // Schedule next report
        this.scheduleNextReport(schedule);

        this.emit('reportGenerated', {
          scheduleId: schedule.id,
          report: response.report,
          schedule
        });

        console.log(`Generated scheduled ${schedule.reportType} report for campaign ${schedule.campaignId}`);

      } else {
        console.error(`Failed to generate scheduled report: ${response.error}`);
        await this.handleScheduleError(schedule, response.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error generating scheduled report:', error);
      await this.handleScheduleError(schedule, error.message);
    }
  }

  /**
   * Schedule the next report for a given schedule
   */
  private scheduleNextReport(schedule: IntelligenceSchedule): void {
    const nextGeneration = this.calculateNextGeneration(schedule);
    
    // Update schedule with next generation time
    this.updateSchedule(schedule.id, { nextGeneration });
    
    // Schedule the next report
    this.scheduleReport({ ...schedule, nextGeneration });
  }

  /**
   * Calculate next generation time based on frequency
   */
  private calculateNextGeneration(schedule: IntelligenceSchedule): Date {
    const now = new Date();
    
    switch (schedule.frequency) {
      case 'every_tick':
        return new Date(now.getTime() + 120000); // 2 minutes (120s per tick)
      
      case 'every_2_ticks':
        return new Date(now.getTime() + 240000); // 4 minutes
      
      case 'every_5_ticks':
        return new Date(now.getTime() + 600000); // 10 minutes
      
      case 'every_10_ticks':
        return new Date(now.getTime() + 1200000); // 20 minutes
      
      case 'daily':
        return new Date(now.getTime() + 86400000); // 24 hours
      
      case 'weekly':
        return new Date(now.getTime() + 604800000); // 7 days
      
      case 'monthly':
        return new Date(now.getTime() + 2592000000); // 30 days
      
      case 'on_demand':
      case 'event_triggered':
        return new Date(now.getTime() + 86400000); // Default to daily check
      
      default:
        return new Date(now.getTime() + 3600000); // Default to 1 hour
    }
  }

  // ===== EVENT TRIGGERS =====

  /**
   * Trigger reports based on events
   */
  async triggerEventBasedReports(
    campaignId: number,
    eventType: string,
    eventData: any
  ): Promise<void> {
    if (!this.config.enableEventTriggers) {
      return;
    }

    const eventSchedules = this.getEventTriggeredSchedules(campaignId, eventType);
    
    for (const schedule of eventSchedules) {
      if (this.evaluateTriggerCondition(schedule, eventType, eventData)) {
        await this.generateScheduledReport(schedule);
      }
    }
  }

  /**
   * Get schedules that are event-triggered for a specific event type
   */
  private getEventTriggeredSchedules(campaignId: number, eventType: string): IntelligenceSchedule[] {
    return Array.from(this.schedules.values()).filter(schedule => 
      schedule.campaignId === campaignId &&
      schedule.enabled &&
      schedule.frequency === 'event_triggered' &&
      schedule.config.triggers?.some(trigger => 
        trigger.type === 'significant_event' && 
        trigger.condition.eventType === eventType
      )
    );
  }

  /**
   * Evaluate if a trigger condition is met
   */
  private evaluateTriggerCondition(
    schedule: IntelligenceSchedule,
    eventType: string,
    eventData: any
  ): boolean {
    if (!schedule.config.triggers) {
      return false;
    }

    return schedule.config.triggers.some(trigger => {
      switch (trigger.type) {
        case 'significant_event':
          return trigger.condition.eventType === eventType;
        
        case 'threat_level_change':
          return this.evaluateThreatLevelTrigger(trigger.condition, eventData);
        
        case 'data_threshold':
          return this.evaluateDataThresholdTrigger(trigger.condition, eventData);
        
        default:
          return false;
      }
    });
  }

  private evaluateThreatLevelTrigger(condition: TriggerCondition, eventData: any): boolean {
    if (!condition.metric || !condition.operator || condition.value === undefined) {
      return false;
    }

    const value = eventData[condition.metric];
    if (typeof value !== 'number') {
      return false;
    }

    switch (condition.operator) {
      case 'gt': return value > condition.value;
      case 'gte': return value >= condition.value;
      case 'lt': return value < condition.value;
      case 'lte': return value <= condition.value;
      case 'eq': return value === condition.value;
      default: return false;
    }
  }

  private evaluateDataThresholdTrigger(condition: TriggerCondition, eventData: any): boolean {
    return this.evaluateThreatLevelTrigger(condition, eventData);
  }

  // ===== UTILITY METHODS =====

  /**
   * Validate schedule configuration
   */
  private validateSchedule(schedule: IntelligenceSchedule): boolean {
    // Basic validation
    if (!schedule.campaignId || !schedule.reportType || !schedule.frequency) {
      return false;
    }

    // Validate frequency
    const validFrequencies: ScheduleFrequency[] = [
      'every_tick', 'every_2_ticks', 'every_5_ticks', 'every_10_ticks',
      'daily', 'weekly', 'monthly', 'on_demand', 'event_triggered'
    ];
    
    if (!validFrequencies.includes(schedule.frequency)) {
      return false;
    }

    // Validate triggers for event-triggered schedules
    if (schedule.frequency === 'event_triggered') {
      if (!schedule.config.triggers || schedule.config.triggers.length === 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check rate limits for a campaign
   */
  private checkRateLimit(campaignId: number): boolean {
    const currentCount = this.lastReportCounts.get(campaignId) || 0;
    return currentCount < this.config.maxReportsPerHour;
  }

  /**
   * Increment report count for rate limiting
   */
  private incrementReportCount(campaignId: number): void {
    const currentCount = this.lastReportCounts.get(campaignId) || 0;
    this.lastReportCounts.set(campaignId, currentCount + 1);
  }

  /**
   * Update schedule status
   */
  private async updateScheduleStatus(scheduleId: string, status: ScheduleStatus): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.status = status;
      schedule.updatedAt = new Date();
      this.schedules.set(scheduleId, schedule);
    }
  }

  /**
   * Update schedule last generation time
   */
  private async updateScheduleLastGeneration(scheduleId: string, lastGeneration: Date): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.lastGeneration = lastGeneration;
      schedule.updatedAt = new Date();
      this.schedules.set(scheduleId, schedule);
    }
  }

  /**
   * Handle schedule errors
   */
  private async handleScheduleError(schedule: IntelligenceSchedule, error: string): Promise<void> {
    console.error(`Schedule ${schedule.id} error: ${error}`);
    
    // Update schedule status
    await this.updateScheduleStatus(schedule.id, 'error');
    
    // Emit error event
    this.emit('scheduleError', {
      scheduleId: schedule.id,
      schedule,
      error
    });

    // Retry logic
    if (schedule.priority === 'critical' || schedule.priority === 'urgent') {
      this.rescheduleReport(schedule, this.config.retryDelay);
    }
  }

  /**
   * Reschedule a report after a delay
   */
  private rescheduleReport(schedule: IntelligenceSchedule, delay: number): void {
    const timer = setTimeout(() => {
      this.generateScheduledReport(schedule);
    }, delay);

    this.timers.set(`retry_${schedule.id}`, timer);
  }

  /**
   * Clear timer for a schedule
   */
  private clearScheduleTimer(scheduleId: string): void {
    const timer = this.timers.get(scheduleId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(scheduleId);
    }

    // Also clear retry timers
    const retryTimer = this.timers.get(`retry_${scheduleId}`);
    if (retryTimer) {
      clearTimeout(retryTimer);
      this.timers.delete(`retry_${scheduleId}`);
    }
  }

  // ===== PREDEFINED SCHEDULE TEMPLATES =====

  /**
   * Create standard intelligence schedules for a campaign
   */
  async createStandardSchedules(campaignId: number): Promise<string[]> {
    const scheduleIds: string[] = [];

    // Daily domestic intelligence
    const domesticScheduleId = await this.addSchedule({
      campaignId,
      reportType: 'domestic_intelligence',
      frequency: 'daily',
      priority: 'high',
      nextGeneration: new Date(Date.now() + 86400000), // 24 hours
      enabled: true,
      status: 'active',
      config: {
        classification: 'confidential',
        distributionList: ['leadership', 'domestic_affairs'],
        includeSections: ['situation_overview', 'threat_analysis', 'resource_analysis'],
        minConfidence: 'moderate'
      },
      createdBy: 'system'
    });
    scheduleIds.push(domesticScheduleId);

    // Weekly foreign intelligence
    const foreignScheduleId = await this.addSchedule({
      campaignId,
      reportType: 'foreign_intelligence',
      frequency: 'weekly',
      priority: 'high',
      nextGeneration: new Date(Date.now() + 604800000), // 7 days
      enabled: true,
      status: 'active',
      config: {
        classification: 'secret',
        distributionList: ['leadership', 'foreign_affairs', 'military'],
        includeSections: ['situation_overview', 'threat_analysis', 'capability_assessment'],
        minConfidence: 'moderate'
      },
      createdBy: 'system'
    });
    scheduleIds.push(foreignScheduleId);

    // Strategic assessment every 10 ticks
    const strategicScheduleId = await this.addSchedule({
      campaignId,
      reportType: 'strategic_assessment',
      frequency: 'every_10_ticks',
      priority: 'medium',
      nextGeneration: new Date(Date.now() + 1200000), // 20 minutes
      enabled: true,
      status: 'active',
      config: {
        classification: 'secret',
        distributionList: ['leadership'],
        includeSections: ['situation_overview', 'threat_analysis', 'opportunity_assessment', 'predictive_analysis'],
        minConfidence: 'high'
      },
      createdBy: 'system'
    });
    scheduleIds.push(strategicScheduleId);

    // Threat analysis triggered by significant events
    const threatScheduleId = await this.addSchedule({
      campaignId,
      reportType: 'threat_analysis',
      frequency: 'event_triggered',
      priority: 'urgent',
      nextGeneration: new Date(Date.now() + 3600000), // 1 hour default
      enabled: true,
      status: 'active',
      config: {
        classification: 'secret',
        distributionList: ['leadership', 'security', 'military'],
        includeSections: ['threat_analysis', 'predictive_analysis'],
        triggers: [
          {
            id: 'threat_level_trigger',
            type: 'threat_level_change',
            condition: {
              metric: 'threatLevel',
              operator: 'gte',
              value: 4 // High threat level
            },
            description: 'Trigger when threat level reaches high or critical'
          },
          {
            id: 'significant_event_trigger',
            type: 'significant_event',
            condition: {
              eventType: 'security_incident',
              eventSeverity: 'high'
            },
            description: 'Trigger on high-severity security incidents'
          }
        ],
        minConfidence: 'high'
      },
      createdBy: 'system'
    });
    scheduleIds.push(threatScheduleId);

    this.emit('standardSchedulesCreated', { campaignId, scheduleIds });

    return scheduleIds;
  }

  /**
   * Get scheduler status and metrics
   */
  getSchedulerStatus() {
    const schedulesByStatus = Array.from(this.schedules.values()).reduce((acc, schedule) => {
      acc[schedule.status] = (acc[schedule.status] || 0) + 1;
      return acc;
    }, {} as Record<ScheduleStatus, number>);

    const schedulesByFrequency = Array.from(this.schedules.values()).reduce((acc, schedule) => {
      acc[schedule.frequency] = (acc[schedule.frequency] || 0) + 1;
      return acc;
    }, {} as Record<ScheduleFrequency, number>);

    return {
      isRunning: this.isRunning,
      totalSchedules: this.schedules.size,
      activeTimers: this.timers.size,
      queuedReports: this.reportQueue.size,
      schedulesByStatus,
      schedulesByFrequency,
      config: this.config
    };
  }

  /**
   * Clear all schedules and timers
   */
  clearAll(): void {
    this.stop();
    this.schedules.clear();
    this.reportQueue.clear();
    this.lastReportCounts.clear();
  }
}

// Export singleton instance
export const intelligenceScheduler = new IntelligenceScheduler();
