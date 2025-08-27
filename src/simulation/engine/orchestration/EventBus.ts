/**
 * EventBus - Advanced inter-system communication hub for StarTales orchestration
 * 
 * This class provides:
 * - Pub/sub messaging between systems
 * - Event routing and filtering
 * - Priority-based event processing
 * - Event persistence and replay
 * - Dead letter queue for failed events
 * - Performance monitoring and metrics
 */

import { EventEmitter } from 'events';
import { Pool } from 'pg';
import {
  GameEvent,
  ScheduledAction
} from './types';

export interface EventSubscription {
  id: string;
  systemId: string;
  eventTypes: string[];
  priority: number;
  filter?: (event: GameEvent) => boolean;
  handler: (event: GameEvent) => Promise<void>;
  retryAttempts: number;
  maxRetries: number;
  lastProcessed?: Date;
  totalProcessed: number;
  totalErrors: number;
}

export interface EventBusConfig {
  maxConcurrentEvents: number;
  eventRetentionMs: number;
  deadLetterRetentionMs: number;
  batchSize: number;
  processingIntervalMs: number;
  enablePersistence: boolean;
  enableMetrics: boolean;
}

export interface EventMetrics {
  totalEventsProcessed: number;
  totalEventsPublished: number;
  totalEventsFailed: number;
  averageProcessingTime: number;
  eventsByType: Map<string, number>;
  eventsByPriority: Map<string, number>;
  subscriptionMetrics: Map<string, {
    processed: number;
    errors: number;
    averageTime: number;
  }>;
  deadLetterQueueSize: number;
  queueDepth: number;
}

export interface DeadLetterEvent {
  id: string;
  originalEvent: GameEvent;
  subscriptionId: string;
  failureReason: string;
  failureCount: number;
  firstFailure: Date;
  lastFailure: Date;
}

export class EventBus extends EventEmitter {
  private config: EventBusConfig;
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventQueue: GameEvent[] = [];
  private deadLetterQueue: DeadLetterEvent[] = [];
  private processingEvents: Set<string> = new Set();
  private metrics: EventMetrics;
  private databasePool?: Pool;
  private isProcessing = false;
  private processingTimer?: NodeJS.Timeout;

  constructor(config: Partial<EventBusConfig> = {}, databasePool?: Pool) {
    super();
    
    this.config = {
      maxConcurrentEvents: config.maxConcurrentEvents || 20,
      eventRetentionMs: config.eventRetentionMs || 24 * 60 * 60 * 1000, // 24 hours
      deadLetterRetentionMs: config.deadLetterRetentionMs || 7 * 24 * 60 * 60 * 1000, // 7 days
      batchSize: config.batchSize || 10,
      processingIntervalMs: config.processingIntervalMs || 100, // 100ms
      enablePersistence: config.enablePersistence !== false,
      enableMetrics: config.enableMetrics !== false
    };

    this.databasePool = databasePool;
    
    this.metrics = {
      totalEventsProcessed: 0,
      totalEventsPublished: 0,
      totalEventsFailed: 0,
      averageProcessingTime: 0,
      eventsByType: new Map(),
      eventsByPriority: new Map(),
      subscriptionMetrics: new Map(),
      deadLetterQueueSize: 0,
      queueDepth: 0
    };

    this.startProcessing();
    this.startCleanupTimer();
    
    console.log('📡 EventBus initialized with config:', this.config);
  }

  /**
   * Subscribe to events with filtering and priority
   */
  subscribe(
    systemId: string,
    eventTypes: string[],
    handler: (event: GameEvent) => Promise<void>,
    options: {
      priority?: number;
      filter?: (event: GameEvent) => boolean;
      maxRetries?: number;
    } = {}
  ): string {
    const subscriptionId = this.generateSubscriptionId();
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      systemId,
      eventTypes,
      priority: options.priority || 0,
      filter: options.filter,
      handler,
      retryAttempts: 0,
      maxRetries: options.maxRetries || 3,
      totalProcessed: 0,
      totalErrors: 0
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    // Initialize metrics for this subscription
    this.metrics.subscriptionMetrics.set(subscriptionId, {
      processed: 0,
      errors: 0,
      averageTime: 0
    });

    console.log(`📡 Subscription created: ${systemId} → [${eventTypes.join(', ')}] (priority: ${subscription.priority})`);
    this.emit('subscriptionCreated', subscription);
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    this.subscriptions.delete(subscriptionId);
    this.metrics.subscriptionMetrics.delete(subscriptionId);
    
    console.log(`📡 Subscription removed: ${subscription.systemId} (${subscriptionId})`);
    this.emit('subscriptionRemoved', subscriptionId);
    
    return true;
  }

  /**
   * Publish an event to the bus
   */
  async publish(event: GameEvent): Promise<void> {
    try {
      // Validate event
      if (!event.id || !event.type || !event.source) {
        throw new Error('Invalid event: missing required fields (id, type, source)');
      }

      // Add to queue
      this.eventQueue.push(event);
      this.metrics.totalEventsPublished++;
      this.metrics.queueDepth = this.eventQueue.length;
      
      // Update type metrics
      const typeCount = this.metrics.eventsByType.get(event.type) || 0;
      this.metrics.eventsByType.set(event.type, typeCount + 1);
      
      // Update priority metrics
      const priorityCount = this.metrics.eventsByPriority.get(event.priority) || 0;
      this.metrics.eventsByPriority.set(event.priority, priorityCount + 1);

      // Persist event if enabled
      if (this.config.enablePersistence && this.databasePool) {
        await this.persistEvent(event);
      }

      console.log(`📡 Event published: ${event.type} from ${event.source} (priority: ${event.priority})`);
      this.emit('eventPublished', event);
      
      // Trigger immediate processing if not already running
      if (!this.isProcessing) {
        this.processEvents();
      }
    } catch (error) {
      console.error('❌ Failed to publish event:', error);
      this.emit('publishError', event, error);
      throw error;
    }
  }

  /**
   * Publish multiple events in batch
   */
  async publishBatch(events: GameEvent[]): Promise<void> {
    console.log(`📡 Publishing batch of ${events.length} events`);
    
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Get current event bus metrics
   */
  getMetrics(): EventMetrics {
    this.metrics.queueDepth = this.eventQueue.length;
    this.metrics.deadLetterQueueSize = this.deadLetterQueue.length;
    return { ...this.metrics };
  }

  /**
   * Get subscription information
   */
  getSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Get dead letter queue events
   */
  getDeadLetterQueue(): DeadLetterEvent[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Retry a dead letter event
   */
  async retryDeadLetterEvent(deadLetterId: string): Promise<boolean> {
    const deadLetterIndex = this.deadLetterQueue.findIndex(dl => dl.id === deadLetterId);
    if (deadLetterIndex === -1) {
      return false;
    }

    const deadLetter = this.deadLetterQueue[deadLetterIndex];
    const subscription = this.subscriptions.get(deadLetter.subscriptionId);
    
    if (!subscription) {
      console.warn(`⚠️ Cannot retry dead letter event: subscription ${deadLetter.subscriptionId} not found`);
      return false;
    }

    try {
      // Reset retry attempts for the subscription
      subscription.retryAttempts = 0;
      
      // Re-queue the original event
      this.eventQueue.unshift(deadLetter.originalEvent);
      
      // Remove from dead letter queue
      this.deadLetterQueue.splice(deadLetterIndex, 1);
      
      console.log(`🔄 Retrying dead letter event: ${deadLetter.originalEvent.type} (${deadLetterId})`);
      this.emit('deadLetterRetried', deadLetter);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to retry dead letter event:', error);
      return false;
    }
  }

  /**
   * Clear all events from dead letter queue
   */
  clearDeadLetterQueue(): number {
    const count = this.deadLetterQueue.length;
    this.deadLetterQueue.length = 0;
    
    console.log(`🗑️ Cleared ${count} events from dead letter queue`);
    this.emit('deadLetterQueueCleared', count);
    
    return count;
  }

  /**
   * Get events by type from history (if persistence enabled)
   */
  async getEventHistory(
    eventType?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<GameEvent[]> {
    if (!this.config.enablePersistence || !this.databasePool) {
      console.warn('⚠️ Event persistence not enabled');
      return [];
    }

    try {
      let query = `
        SELECT event_data 
        FROM event_bus_events 
        WHERE created_at > NOW() - INTERVAL '${this.config.eventRetentionMs} milliseconds'
      `;
      
      const params: any[] = [];
      
      if (eventType) {
        query += ` AND event_data->>'type' = $${params.length + 1}`;
        params.push(eventType);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await this.databasePool.query(query, params);
      
      return result.rows.map(row => row.event_data);
    } catch (error) {
      console.error('❌ Failed to get event history:', error);
      return [];
    }
  }

  /**
   * Shutdown the event bus gracefully
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down EventBus...');
    
    this.isProcessing = false;
    
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
    }

    // Process remaining events
    if (this.eventQueue.length > 0) {
      console.log(`📡 Processing ${this.eventQueue.length} remaining events...`);
      await this.processEvents();
    }

    console.log('✅ EventBus shutdown complete');
    this.emit('shutdown');
  }

  // ============================================================================
  // PRIVATE PROCESSING METHODS
  // ============================================================================

  private startProcessing(): void {
    const processLoop = () => {
      if (this.isProcessing) return;
      
      this.processEvents().finally(() => {
        if (this.eventQueue.length > 0) {
          // Schedule next processing cycle
          this.processingTimer = setTimeout(processLoop, this.config.processingIntervalMs);
        }
      });
    };

    // Start the processing loop
    processLoop();
  }

  private async processEvents(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process events in batches
      const batchSize = Math.min(this.config.batchSize, this.eventQueue.length);
      const batch = this.eventQueue.splice(0, batchSize);
      
      console.log(`📡 Processing batch of ${batch.length} events`);

      // Sort by priority (higher priority first)
      batch.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      });

      // Process events concurrently with limit
      const processingPromises: Promise<void>[] = [];
      
      for (const event of batch) {
        if (this.processingEvents.size >= this.config.maxConcurrentEvents) {
          // Wait for some events to complete
          await Promise.race(processingPromises);
        }

        const promise = this.processEvent(event);
        processingPromises.push(promise);
      }

      // Wait for all events in batch to complete
      await Promise.allSettled(processingPromises);
      
      this.metrics.queueDepth = this.eventQueue.length;
    } catch (error) {
      console.error('❌ Error in event processing loop:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processEvent(event: GameEvent): Promise<void> {
    const eventId = event.id;
    this.processingEvents.add(eventId);

    try {
      // Find matching subscriptions
      const matchingSubscriptions = this.findMatchingSubscriptions(event);
      
      if (matchingSubscriptions.length === 0) {
        console.log(`📡 No subscribers for event: ${event.type}`);
        return;
      }

      // Sort subscriptions by priority
      matchingSubscriptions.sort((a, b) => b.priority - a.priority);

      // Process subscriptions concurrently
      const subscriptionPromises = matchingSubscriptions.map(subscription => 
        this.processSubscription(event, subscription)
      );

      await Promise.allSettled(subscriptionPromises);
      
      this.metrics.totalEventsProcessed++;
      
      // Mark event as processed
      if (this.config.enablePersistence && this.databasePool) {
        await this.markEventProcessed(event);
      }

      console.log(`✅ Event processed: ${event.type} (${matchingSubscriptions.length} subscribers)`);
      this.emit('eventProcessed', event, matchingSubscriptions.length);
      
    } catch (error) {
      console.error(`❌ Failed to process event ${event.type}:`, error);
      this.metrics.totalEventsFailed++;
      this.emit('eventProcessingError', event, error);
    } finally {
      this.processingEvents.delete(eventId);
    }
  }

  private async processSubscription(event: GameEvent, subscription: EventSubscription): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Execute subscription handler
      await subscription.handler(event);
      
      // Update subscription metrics
      subscription.totalProcessed++;
      subscription.lastProcessed = new Date();
      subscription.retryAttempts = 0; // Reset on success
      
      const executionTime = performance.now() - startTime;
      this.updateSubscriptionMetrics(subscription.id, executionTime, true);
      
      console.log(`✅ Subscription processed: ${subscription.systemId} → ${event.type} (${executionTime.toFixed(2)}ms)`);
      
    } catch (error) {
      const executionTime = performance.now() - startTime;
      subscription.totalErrors++;
      subscription.retryAttempts++;
      
      this.updateSubscriptionMetrics(subscription.id, executionTime, false);
      
      console.error(`❌ Subscription failed: ${subscription.systemId} → ${event.type}:`, error);
      
      // Check if we should retry or move to dead letter queue
      if (subscription.retryAttempts >= subscription.maxRetries) {
        await this.moveToDeadLetterQueue(event, subscription, error.message);
      } else {
        // Re-queue for retry
        console.log(`🔄 Retrying subscription: ${subscription.systemId} (attempt ${subscription.retryAttempts}/${subscription.maxRetries})`);
        setTimeout(() => {
          this.eventQueue.unshift(event);
        }, 1000 * subscription.retryAttempts); // Exponential backoff
      }
    }
  }

  private findMatchingSubscriptions(event: GameEvent): EventSubscription[] {
    const matching: EventSubscription[] = [];
    
    for (const subscription of this.subscriptions.values()) {
      // Check if event type matches
      if (!subscription.eventTypes.includes(event.type) && !subscription.eventTypes.includes('*')) {
        continue;
      }
      
      // Apply custom filter if provided
      if (subscription.filter && !subscription.filter(event)) {
        continue;
      }
      
      matching.push(subscription);
    }
    
    return matching;
  }

  private async moveToDeadLetterQueue(
    event: GameEvent,
    subscription: EventSubscription,
    failureReason: string
  ): Promise<void> {
    const deadLetterId = this.generateDeadLetterId();
    
    const deadLetterEvent: DeadLetterEvent = {
      id: deadLetterId,
      originalEvent: event,
      subscriptionId: subscription.id,
      failureReason,
      failureCount: subscription.retryAttempts,
      firstFailure: new Date(),
      lastFailure: new Date()
    };

    this.deadLetterQueue.push(deadLetterEvent);
    
    console.log(`💀 Moved to dead letter queue: ${event.type} → ${subscription.systemId} (${failureReason})`);
    this.emit('deadLetterEvent', deadLetterEvent);
    
    // Persist dead letter event if enabled
    if (this.config.enablePersistence && this.databasePool) {
      await this.persistDeadLetterEvent(deadLetterEvent);
    }
  }

  private updateSubscriptionMetrics(subscriptionId: string, executionTime: number, success: boolean): void {
    const metrics = this.metrics.subscriptionMetrics.get(subscriptionId);
    if (!metrics) return;

    if (success) {
      metrics.processed++;
      // Update average execution time
      metrics.averageTime = (metrics.averageTime * (metrics.processed - 1) + executionTime) / metrics.processed;
    } else {
      metrics.errors++;
    }

    // Update overall average processing time
    const totalProcessed = this.metrics.totalEventsProcessed + 1;
    this.metrics.averageProcessingTime = 
      (this.metrics.averageProcessingTime * (totalProcessed - 1) + executionTime) / totalProcessed;
  }

  private async persistEvent(event: GameEvent): Promise<void> {
    if (!this.databasePool) return;

    try {
      await this.databasePool.query(`
        INSERT INTO event_bus_events (event_id, event_data, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (event_id) DO NOTHING
      `, [event.id, JSON.stringify(event)]);
    } catch (error) {
      console.error('❌ Failed to persist event:', error);
    }
  }

  private async markEventProcessed(event: GameEvent): Promise<void> {
    if (!this.databasePool) return;

    try {
      await this.databasePool.query(`
        UPDATE event_bus_events 
        SET processed_at = NOW() 
        WHERE event_id = $1
      `, [event.id]);
    } catch (error) {
      console.error('❌ Failed to mark event as processed:', error);
    }
  }

  private async persistDeadLetterEvent(deadLetter: DeadLetterEvent): Promise<void> {
    if (!this.databasePool) return;

    try {
      await this.databasePool.query(`
        INSERT INTO event_bus_dead_letters (
          dead_letter_id, subscription_id, event_data, 
          failure_reason, failure_count, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        deadLetter.id,
        deadLetter.subscriptionId,
        JSON.stringify(deadLetter.originalEvent),
        deadLetter.failureReason,
        deadLetter.failureCount
      ]);
    } catch (error) {
      console.error('❌ Failed to persist dead letter event:', error);
    }
  }

  private startCleanupTimer(): void {
    // Clean up old events and dead letters every hour
    setInterval(() => {
      this.cleanupOldEvents();
    }, 60 * 60 * 1000);
  }

  private async cleanupOldEvents(): Promise<void> {
    console.log('🧹 Cleaning up old events...');
    
    // Clean up old dead letter events
    const cutoffTime = Date.now() - this.config.deadLetterRetentionMs;
    const initialDeadLetterCount = this.deadLetterQueue.length;
    
    this.deadLetterQueue = this.deadLetterQueue.filter(dl => 
      dl.firstFailure.getTime() > cutoffTime
    );
    
    const cleanedDeadLetters = initialDeadLetterCount - this.deadLetterQueue.length;
    
    if (cleanedDeadLetters > 0) {
      console.log(`🗑️ Cleaned up ${cleanedDeadLetters} old dead letter events`);
    }

    // Clean up database records if persistence enabled
    if (this.config.enablePersistence && this.databasePool) {
      try {
        const eventResult = await this.databasePool.query(`
          DELETE FROM event_bus_events 
          WHERE created_at < NOW() - INTERVAL '${this.config.eventRetentionMs} milliseconds'
        `);
        
        const deadLetterResult = await this.databasePool.query(`
          DELETE FROM event_bus_dead_letters 
          WHERE created_at < NOW() - INTERVAL '${this.config.deadLetterRetentionMs} milliseconds'
        `);
        
        if (eventResult.rowCount > 0 || deadLetterResult.rowCount > 0) {
          console.log(`🗑️ Cleaned up ${eventResult.rowCount} old events and ${deadLetterResult.rowCount} old dead letters from database`);
        }
      } catch (error) {
        console.error('❌ Failed to cleanup database events:', error);
      }
    }
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDeadLetterId(): string {
    return `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Utility function to create event bus with database tables
 */
export async function createEventBusWithTables(
  databasePool: Pool,
  config?: Partial<EventBusConfig>
): Promise<EventBus> {
  // Create required database tables
  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS event_bus_events (
      event_id VARCHAR(255) PRIMARY KEY,
      event_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      processed_at TIMESTAMP WITH TIME ZONE
    );
    
    CREATE INDEX IF NOT EXISTS idx_event_bus_events_type 
    ON event_bus_events USING GIN ((event_data->>'type'));
    
    CREATE INDEX IF NOT EXISTS idx_event_bus_events_created_at 
    ON event_bus_events (created_at);
  `);

  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS event_bus_dead_letters (
      dead_letter_id VARCHAR(255) PRIMARY KEY,
      subscription_id VARCHAR(255) NOT NULL,
      event_data JSONB NOT NULL,
      failure_reason TEXT NOT NULL,
      failure_count INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_event_bus_dead_letters_created_at 
    ON event_bus_dead_letters (created_at);
  `);

  return new EventBus(config, databasePool);
}
