/**
 * Telemetry System for Knob Effectiveness Tracking
 * Monitors and analyzes the performance of AI-driven knob adjustments
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { KnobAdjustment, PerformanceMetrics } from './SimEngineOrchestrator';

export interface TelemetryEvent {
  id: string;
  civilizationId: string;
  eventType: 'knob_adjustment' | 'performance_sample' | 'outcome_measurement' | 'effectiveness_calculation';
  apiName: string;
  knobName?: string;
  value?: number;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface EffectivenessReport {
  civilizationId: string;
  apiName: string;
  knobName: string;
  adjustmentCount: number;
  averageEffectiveness: number;
  stabilityImpact: number;
  economicImpact: number;
  socialImpact: number;
  confidenceLevel: number;
  lastUpdated: Date;
  recommendations: string[];
}

export interface GameOutcome {
  civilizationId: string;
  outcomeType: 'stability_change' | 'economic_growth' | 'social_satisfaction' | 'crisis_resolution' | 'contract_completion';
  value: number;
  relatedKnobs: string[];
  timestamp: Date;
}

export class TelemetrySystem extends EventEmitter {
  private pool: Pool;
  private telemetryBuffer: TelemetryEvent[] = [];
  private outcomeBuffer: GameOutcome[] = [];
  private flushInterval: NodeJS.Timeout;
  private analysisInterval: NodeJS.Timeout;
  private effectivenessCache: Map<string, EffectivenessReport> = new Map();

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.startBufferFlush();
    this.startPeriodicAnalysis();
    console.log('📊 Telemetry System initialized');
  }

  /**
   * Record a knob adjustment event
   */
  recordKnobAdjustment(civilizationId: string, adjustment: KnobAdjustment): void {
    const event: TelemetryEvent = {
      id: this.generateEventId(),
      civilizationId,
      eventType: 'knob_adjustment',
      apiName: adjustment.apiName,
      knobName: adjustment.knobName,
      value: adjustment.newValue,
      metadata: {
        oldValue: adjustment.oldValue,
        reason: adjustment.reason,
        confidence: adjustment.confidence,
        expectedImpact: adjustment.expectedImpact
      },
      timestamp: new Date()
    };

    this.telemetryBuffer.push(event);
    console.log(`📊 Recorded knob adjustment: ${adjustment.apiName}.${adjustment.knobName} = ${adjustment.newValue}`);
  }

  /**
   * Record a game outcome that may be related to knob adjustments
   */
  recordGameOutcome(outcome: GameOutcome): void {
    this.outcomeBuffer.push(outcome);
    
    const event: TelemetryEvent = {
      id: this.generateEventId(),
      civilizationId: outcome.civilizationId,
      eventType: 'outcome_measurement',
      apiName: 'game_outcomes',
      metadata: {
        outcomeType: outcome.outcomeType,
        value: outcome.value,
        relatedKnobs: outcome.relatedKnobs
      },
      timestamp: outcome.timestamp
    };

    this.telemetryBuffer.push(event);
    console.log(`📊 Recorded game outcome: ${outcome.outcomeType} = ${outcome.value} for ${outcome.civilizationId}`);
  }

  /**
   * Record performance sample for a specific knob
   */
  recordPerformanceSample(
    civilizationId: string,
    apiName: string,
    knobName: string,
    effectiveness: number,
    impacts: { stability: number; economic: number; social: number }
  ): void {
    const event: TelemetryEvent = {
      id: this.generateEventId(),
      civilizationId,
      eventType: 'performance_sample',
      apiName,
      knobName,
      value: effectiveness,
      metadata: {
        stabilityImpact: impacts.stability,
        economicImpact: impacts.economic,
        socialImpact: impacts.social,
        sampleTime: new Date().toISOString()
      },
      timestamp: new Date()
    };

    this.telemetryBuffer.push(event);
  }

  /**
   * Calculate effectiveness for a specific knob based on historical data
   */
  async calculateKnobEffectiveness(
    civilizationId: string,
    apiName: string,
    knobName: string,
    timeWindowHours: number = 24
  ): Promise<EffectivenessReport> {
    const cacheKey = `${civilizationId}-${apiName}-${knobName}`;
    
    try {
      // Get knob adjustments in time window
      const adjustments = await this.getKnobAdjustments(civilizationId, apiName, knobName, timeWindowHours);
      
      // Get related outcomes in time window
      const outcomes = await this.getRelatedOutcomes(civilizationId, apiName, knobName, timeWindowHours);
      
      // Calculate effectiveness metrics
      const effectiveness = this.calculateEffectivenessScore(adjustments, outcomes);
      const impacts = this.calculateImpactScores(adjustments, outcomes);
      const confidence = this.calculateConfidenceLevel(adjustments.length, outcomes.length);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(effectiveness, impacts, adjustments);

      const report: EffectivenessReport = {
        civilizationId,
        apiName,
        knobName,
        adjustmentCount: adjustments.length,
        averageEffectiveness: effectiveness,
        stabilityImpact: impacts.stability,
        economicImpact: impacts.economic,
        socialImpact: impacts.social,
        confidenceLevel: confidence,
        lastUpdated: new Date(),
        recommendations
      };

      // Cache the report
      this.effectivenessCache.set(cacheKey, report);
      
      // Record the calculation event
      const event: TelemetryEvent = {
        id: this.generateEventId(),
        civilizationId,
        eventType: 'effectiveness_calculation',
        apiName,
        knobName,
        value: effectiveness,
        metadata: {
          adjustmentCount: adjustments.length,
          outcomeCount: outcomes.length,
          confidence: confidence,
          impacts
        },
        timestamp: new Date()
      };

      this.telemetryBuffer.push(event);
      
      return report;

    } catch (error) {
      console.error(`Error calculating effectiveness for ${cacheKey}:`, error);
      throw error;
    }
  }

  /**
   * Get knob adjustments from database
   */
  private async getKnobAdjustments(
    civilizationId: string,
    apiName: string,
    knobName: string,
    timeWindowHours: number
  ): Promise<any[]> {
    try {
      const result = await this.pool.query(`
        SELECT * FROM knob_adjustments 
        WHERE civilization_id = $1 
          AND api_name = $2 
          AND knob_name = $3 
          AND timestamp > NOW() - INTERVAL '${timeWindowHours} hours'
        ORDER BY timestamp DESC
      `, [civilizationId, apiName, knobName]);
      
      return result.rows;
    } catch (error) {
      // Table might not exist yet
      console.log('Note: knob_adjustments table not found, using empty data');
      return [];
    }
  }

  /**
   * Get related game outcomes from database
   */
  private async getRelatedOutcomes(
    civilizationId: string,
    apiName: string,
    knobName: string,
    timeWindowHours: number
  ): Promise<any[]> {
    try {
      const result = await this.pool.query(`
        SELECT * FROM game_outcomes 
        WHERE civilization_id = $1 
          AND related_knobs @> $2
          AND timestamp > NOW() - INTERVAL '${timeWindowHours} hours'
        ORDER BY timestamp DESC
      `, [civilizationId, JSON.stringify([`${apiName}.${knobName}`])]);
      
      return result.rows;
    } catch (error) {
      // Table might not exist yet
      console.log('Note: game_outcomes table not found, using empty data');
      return [];
    }
  }

  /**
   * Calculate effectiveness score based on adjustments and outcomes
   */
  private calculateEffectivenessScore(adjustments: any[], outcomes: any[]): number {
    if (adjustments.length === 0) return 0.5; // Neutral if no data
    
    // Mock calculation - in reality this would be much more sophisticated
    let totalEffectiveness = 0;
    let count = 0;

    for (const adjustment of adjustments) {
      // Find outcomes that occurred after this adjustment
      const relatedOutcomes = outcomes.filter(outcome => 
        new Date(outcome.timestamp) > new Date(adjustment.timestamp)
      );

      if (relatedOutcomes.length > 0) {
        // Calculate effectiveness based on positive outcomes
        const positiveOutcomes = relatedOutcomes.filter(o => o.value > 0).length;
        const effectiveness = positiveOutcomes / relatedOutcomes.length;
        totalEffectiveness += effectiveness;
        count++;
      }
    }

    return count > 0 ? totalEffectiveness / count : 0.5;
  }

  /**
   * Calculate impact scores on different aspects
   */
  private calculateImpactScores(adjustments: any[], outcomes: any[]): {
    stability: number;
    economic: number;
    social: number;
  } {
    // Mock calculation - would be more sophisticated in reality
    const stabilityOutcomes = outcomes.filter(o => o.outcome_type === 'stability_change');
    const economicOutcomes = outcomes.filter(o => o.outcome_type === 'economic_growth');
    const socialOutcomes = outcomes.filter(o => o.outcome_type === 'social_satisfaction');

    return {
      stability: this.averageOutcomeValue(stabilityOutcomes),
      economic: this.averageOutcomeValue(economicOutcomes),
      social: this.averageOutcomeValue(socialOutcomes)
    };
  }

  /**
   * Calculate average outcome value
   */
  private averageOutcomeValue(outcomes: any[]): number {
    if (outcomes.length === 0) return 0;
    const sum = outcomes.reduce((acc, outcome) => acc + (outcome.value || 0), 0);
    return sum / outcomes.length;
  }

  /**
   * Calculate confidence level based on sample size
   */
  private calculateConfidenceLevel(adjustmentCount: number, outcomeCount: number): number {
    const totalSamples = adjustmentCount + outcomeCount;
    
    if (totalSamples < 5) return 0.2;
    if (totalSamples < 10) return 0.4;
    if (totalSamples < 20) return 0.6;
    if (totalSamples < 50) return 0.8;
    return 0.9;
  }

  /**
   * Generate recommendations based on effectiveness analysis
   */
  private generateRecommendations(
    effectiveness: number,
    impacts: { stability: number; economic: number; social: number },
    adjustments: any[]
  ): string[] {
    const recommendations: string[] = [];

    if (effectiveness < 0.3) {
      recommendations.push('Low effectiveness detected - consider reducing adjustment frequency');
    } else if (effectiveness > 0.8) {
      recommendations.push('High effectiveness - current strategy is working well');
    }

    if (impacts.stability < -0.2) {
      recommendations.push('Negative stability impact - review stability-related knobs');
    }

    if (impacts.economic < -0.2) {
      recommendations.push('Negative economic impact - review economic policy knobs');
    }

    if (impacts.social < -0.2) {
      recommendations.push('Negative social impact - review social policy knobs');
    }

    if (adjustments.length > 10) {
      recommendations.push('High adjustment frequency - consider more stable settings');
    }

    return recommendations;
  }

  /**
   * Get effectiveness report from cache or calculate new one
   */
  async getEffectivenessReport(
    civilizationId: string,
    apiName: string,
    knobName: string,
    forceRecalculate: boolean = false
  ): Promise<EffectivenessReport> {
    const cacheKey = `${civilizationId}-${apiName}-${knobName}`;
    
    if (!forceRecalculate && this.effectivenessCache.has(cacheKey)) {
      const cached = this.effectivenessCache.get(cacheKey)!;
      
      // Check if cache is still fresh (within 1 hour)
      const cacheAge = Date.now() - cached.lastUpdated.getTime();
      if (cacheAge < 3600000) { // 1 hour
        return cached;
      }
    }

    return await this.calculateKnobEffectiveness(civilizationId, apiName, knobName);
  }

  /**
   * Get all effectiveness reports for a civilization
   */
  async getAllEffectivenessReports(civilizationId: string): Promise<EffectivenessReport[]> {
    const reports: EffectivenessReport[] = [];
    
    // Get all unique knobs for this civilization from cache
    for (const [key, report] of this.effectivenessCache) {
      if (report.civilizationId === civilizationId) {
        reports.push(report);
      }
    }

    return reports;
  }

  /**
   * Start periodic buffer flush to database
   */
  private startBufferFlush(): void {
    this.flushInterval = setInterval(async () => {
      await this.flushBuffers();
    }, 30000); // Flush every 30 seconds (was 10 seconds)

    console.log('📊 Telemetry buffer flush started (30s intervals)');
  }

  /**
   * Start periodic effectiveness analysis
   */
  private startPeriodicAnalysis(): void {
    this.analysisInterval = setInterval(async () => {
      await this.runPeriodicAnalysis();
    }, 600000); // Analyze every 10 minutes (was 5 minutes)

    console.log('📊 Periodic effectiveness analysis started (10min intervals)');
  }

  /**
   * Flush telemetry buffers to database
   */
  private async flushBuffers(): Promise<void> {
    if (this.telemetryBuffer.length === 0 && this.outcomeBuffer.length === 0) return;

    try {
      // Flush telemetry events
      if (this.telemetryBuffer.length > 0) {
        await this.flushTelemetryEvents();
      }

      // Flush game outcomes
      if (this.outcomeBuffer.length > 0) {
        await this.flushGameOutcomes();
      }

    } catch (error) {
      console.error('Error flushing telemetry buffers:', error);
    }
  }

  /**
   * Flush telemetry events to database
   */
  private async flushTelemetryEvents(): Promise<void> {
    const events = [...this.telemetryBuffer];
    this.telemetryBuffer = [];

    try {
      for (const event of events) {
        await this.pool.query(`
          INSERT INTO telemetry_events (
            id, civilization_id, event_type, api_name, knob_name, 
            value, metadata, timestamp
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          event.id,
          event.civilizationId,
          event.eventType,
          event.apiName,
          event.knobName,
          event.value,
          JSON.stringify(event.metadata),
          event.timestamp
        ]);
      }

      console.log(`📊 Flushed ${events.length} telemetry events to database`);
    } catch (error) {
      // Table might not exist yet
      console.log('Note: telemetry_events table not found (will be created later)');
    }
  }

  /**
   * Flush game outcomes to database
   */
  private async flushGameOutcomes(): Promise<void> {
    const outcomes = [...this.outcomeBuffer];
    this.outcomeBuffer = [];

    try {
      for (const outcome of outcomes) {
        await this.pool.query(`
          INSERT INTO game_outcomes (
            civilization_id, outcome_type, value, related_knobs, timestamp
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          outcome.civilizationId,
          outcome.outcomeType,
          outcome.value,
          JSON.stringify(outcome.relatedKnobs),
          outcome.timestamp
        ]);
      }

      console.log(`📊 Flushed ${outcomes.length} game outcomes to database`);
    } catch (error) {
      // Table might not exist yet
      console.log('Note: game_outcomes table not found (will be created later)');
    }
  }

  /**
   * Run periodic analysis on all active civilizations
   */
  private async runPeriodicAnalysis(): Promise<void> {
    console.log('📊 Running periodic effectiveness analysis...');
    
    try {
      // Get all unique civilizations from recent telemetry
      const civilizations = new Set<string>();
      
      // Add from cache
      for (const report of this.effectivenessCache.values()) {
        civilizations.add(report.civilizationId);
      }

      // Analyze each civilization
      for (const civilizationId of civilizations) {
        await this.analyzeCivilizationEffectiveness(civilizationId);
      }

    } catch (error) {
      console.error('Error in periodic analysis:', error);
    }
  }

  /**
   * Analyze effectiveness for all knobs of a civilization
   */
  private async analyzeCivilizationEffectiveness(civilizationId: string): Promise<void> {
    try {
      // Get all knobs that have been adjusted recently
      const knobsToAnalyze = await this.getRecentlyAdjustedKnobs(civilizationId);
      
      for (const { apiName, knobName } of knobsToAnalyze) {
        await this.calculateKnobEffectiveness(civilizationId, apiName, knobName);
      }

      console.log(`📊 Analyzed ${knobsToAnalyze.length} knobs for civilization ${civilizationId}`);
    } catch (error) {
      console.error(`Error analyzing civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Get recently adjusted knobs for a civilization
   */
  private async getRecentlyAdjustedKnobs(civilizationId: string): Promise<Array<{apiName: string, knobName: string}>> {
    try {
      const result = await this.pool.query(`
        SELECT DISTINCT api_name, knob_name 
        FROM knob_adjustments 
        WHERE civilization_id = $1 
          AND timestamp > NOW() - INTERVAL '24 hours'
      `, [civilizationId]);
      
      return result.rows.map(row => ({
        apiName: row.api_name,
        knobName: row.knob_name
      }));
    } catch (error) {
      // Table might not exist yet
      return [];
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get telemetry statistics
   */
  getStats(): any {
    return {
      telemetryBufferSize: this.telemetryBuffer.length,
      outcomeBufferSize: this.outcomeBuffer.length,
      cachedReports: this.effectivenessCache.size,
      timestamp: new Date()
    };
  }

  /**
   * Shutdown telemetry system
   */
  shutdown(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }

    // Final flush
    this.flushBuffers();
    
    console.log('📊 Telemetry System shutdown complete');
  }
}

export default TelemetrySystem;
