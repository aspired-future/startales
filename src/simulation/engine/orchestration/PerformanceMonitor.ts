/**
 * PerformanceMonitor - Advanced monitoring and alerting system for StarTales orchestration
 * 
 * This class provides:
 * - Real-time performance metrics collection
 * - Threshold-based alerting system
 * - Historical performance analysis
 * - System health scoring
 * - Automated performance recommendations
 * - Resource usage tracking and prediction
 */

import { EventEmitter } from 'events';
import { Pool } from 'pg';
import {
  PerformanceMetrics,
  SystemHealth,
  ExecutionMetrics
} from './types';

export interface PerformanceThreshold {
  metric: string;
  warningThreshold: number;
  criticalThreshold: number;
  unit: string;
  description: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  systemId?: string;
}

export interface PerformanceReport {
  timestamp: Date;
  overallHealthScore: number;
  systemHealthScores: Map<string, number>;
  performanceMetrics: PerformanceMetrics;
  activeAlerts: Alert[];
  trends: {
    tickTimesTrend: 'improving' | 'stable' | 'degrading';
    memoryUsageTrend: 'improving' | 'stable' | 'degrading';
    errorRateTrend: 'improving' | 'stable' | 'degrading';
  };
  recommendations: string[];
  resourcePredictions: {
    memoryUsageIn1Hour: number;
    expectedBottlenecks: string[];
  };
}

export interface MonitoringConfig {
  metricsCollectionIntervalMs: number;
  alertingEnabled: boolean;
  historicalDataRetentionMs: number;
  performanceReportIntervalMs: number;
  enablePredictiveAnalysis: boolean;
  enableAutoRemediation: boolean;
}

interface MetricHistory {
  timestamp: Date;
  value: number;
  metadata?: any;
}

export class PerformanceMonitor extends EventEmitter {
  private config: MonitoringConfig;
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private metricHistory: Map<string, MetricHistory[]> = new Map();
  private databasePool?: Pool;
  private monitoringTimer?: NodeJS.Timeout;
  private reportTimer?: NodeJS.Timeout;
  private isMonitoring = false;

  constructor(config: Partial<MonitoringConfig> = {}, databasePool?: Pool) {
    super();
    
    this.config = {
      metricsCollectionIntervalMs: config.metricsCollectionIntervalMs || 5000, // 5 seconds
      alertingEnabled: config.alertingEnabled !== false,
      historicalDataRetentionMs: config.historicalDataRetentionMs || 24 * 60 * 60 * 1000, // 24 hours
      performanceReportIntervalMs: config.performanceReportIntervalMs || 300000, // 5 minutes
      enablePredictiveAnalysis: config.enablePredictiveAnalysis !== false,
      enableAutoRemediation: config.enableAutoRemediation || false
    };

    this.databasePool = databasePool;
    
    this.initializeDefaultThresholds();
    
    console.log('📊 PerformanceMonitor initialized with config:', this.config);
  }

  /**
   * Start performance monitoring
   */
  start(): void {
    if (this.isMonitoring) {
      console.log('⚠️ Performance monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    
    // Start metrics collection
    this.monitoringTimer = setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsCollectionIntervalMs);
    
    // Start performance reporting
    this.reportTimer = setInterval(() => {
      this.generatePerformanceReport();
    }, this.config.performanceReportIntervalMs);
    
    console.log('📊 Performance monitoring started');
    this.emit('monitoringStarted');
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
    
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }
    
    console.log('📊 Performance monitoring stopped');
    this.emit('monitoringStopped');
  }

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: PerformanceMetrics, systemHealth?: Map<string, SystemHealth>): void {
    const timestamp = new Date();
    
    // Record individual metrics
    this.recordMetric('averageTickTime', metrics.averageTickTime, timestamp);
    this.recordMetric('maxTickTime', metrics.maxTickTime, timestamp);
    this.recordMetric('minTickTime', metrics.minTickTime, timestamp);
    this.recordMetric('memoryUsage', metrics.memoryUsage, timestamp);
    this.recordMetric('cpuUsage', metrics.cpuUsage, timestamp);
    this.recordMetric('cacheSize', metrics.cacheSize, timestamp);
    
    // Calculate derived metrics
    const overallCacheHitRate = this.calculateOverallCacheHitRate(metrics.cacheHitRates);
    this.recordMetric('overallCacheHitRate', overallCacheHitRate, timestamp);
    
    const overallSuccessRate = this.calculateOverallSuccessRate(metrics.systemSuccessRates);
    this.recordMetric('overallSuccessRate', overallSuccessRate, timestamp);
    
    // Record system-specific metrics
    if (systemHealth) {
      for (const [systemId, health] of systemHealth) {
        this.recordMetric(`${systemId}_successRate`, health.successRate, timestamp, { systemId });
        this.recordMetric(`${systemId}_executionTime`, health.averageExecutionTime, timestamp, { systemId });
      }
    }
    
    // Check thresholds and generate alerts
    if (this.config.alertingEnabled) {
      this.checkThresholds(metrics, systemHealth);
    }
    
    // Persist metrics if database available
    if (this.databasePool) {
      this.persistMetrics(metrics, timestamp);
    }
  }

  /**
   * Add or update performance threshold
   */
  setThreshold(threshold: PerformanceThreshold): void {
    this.thresholds.set(threshold.metric, threshold);
    console.log(`📊 Threshold set: ${threshold.metric} (warning: ${threshold.warningThreshold}, critical: ${threshold.criticalThreshold})`);
    this.emit('thresholdUpdated', threshold);
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter(alert => !alert.resolvedAt);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.acknowledged = true;
    console.log(`✅ Alert acknowledged: ${alert.message}`);
    this.emit('alertAcknowledged', alert);
    
    return true;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.resolvedAt = new Date();
    console.log(`✅ Alert resolved: ${alert.message}`);
    this.emit('alertResolved', alert);
    
    return true;
  }

  /**
   * Get performance report
   */
  async generatePerformanceReport(): Promise<PerformanceReport> {
    const timestamp = new Date();
    
    // Calculate overall health score
    const overallHealthScore = this.calculateOverallHealthScore();
    
    // Calculate system health scores
    const systemHealthScores = this.calculateSystemHealthScores();
    
    // Get current metrics
    const performanceMetrics = this.getCurrentMetrics();
    
    // Get active alerts
    const activeAlerts = this.getActiveAlerts();
    
    // Analyze trends
    const trends = this.analyzeTrends();
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    // Generate predictions
    const resourcePredictions = this.generateResourcePredictions();
    
    const report: PerformanceReport = {
      timestamp,
      overallHealthScore,
      systemHealthScores,
      performanceMetrics,
      activeAlerts,
      trends,
      recommendations,
      resourcePredictions
    };
    
    console.log(`📊 Performance report generated (health: ${overallHealthScore.toFixed(1)}%, alerts: ${activeAlerts.length})`);
    this.emit('performanceReport', report);
    
    return report;
  }

  /**
   * Get metric history for analysis
   */
  getMetricHistory(metric: string, timeRangeMs: number = 3600000): MetricHistory[] {
    const history = this.metricHistory.get(metric) || [];
    const cutoffTime = Date.now() - timeRangeMs;
    
    return history.filter(entry => entry.timestamp.getTime() > cutoffTime);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    monitoring: boolean;
    totalMetrics: number;
    activeAlerts: number;
    overallHealth: number;
    topIssues: string[];
  } {
    const activeAlerts = this.getActiveAlerts();
    const overallHealth = this.calculateOverallHealthScore();
    
    // Identify top issues
    const topIssues = activeAlerts
      .filter(alert => alert.severity === 'critical')
      .map(alert => alert.message)
      .slice(0, 3);
    
    return {
      monitoring: this.isMonitoring,
      totalMetrics: this.metricHistory.size,
      activeAlerts: activeAlerts.length,
      overallHealth,
      topIssues
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private initializeDefaultThresholds(): void {
    const defaultThresholds: PerformanceThreshold[] = [
      {
        metric: 'averageTickTime',
        warningThreshold: 30000, // 30 seconds
        criticalThreshold: 60000, // 60 seconds
        unit: 'ms',
        description: 'Average tick execution time',
        enabled: true
      },
      {
        metric: 'maxTickTime',
        warningThreshold: 45000, // 45 seconds
        criticalThreshold: 90000, // 90 seconds
        unit: 'ms',
        description: 'Maximum tick execution time',
        enabled: true
      },
      {
        metric: 'memoryUsage',
        warningThreshold: 800 * 1024 * 1024, // 800MB
        criticalThreshold: 1024 * 1024 * 1024, // 1GB
        unit: 'bytes',
        description: 'Memory usage',
        enabled: true
      },
      {
        metric: 'cpuUsage',
        warningThreshold: 70, // 70%
        criticalThreshold: 90, // 90%
        unit: '%',
        description: 'CPU usage percentage',
        enabled: true
      },
      {
        metric: 'overallSuccessRate',
        warningThreshold: 0.9, // 90%
        criticalThreshold: 0.8, // 80%
        unit: 'ratio',
        description: 'Overall system success rate',
        enabled: true
      },
      {
        metric: 'overallCacheHitRate',
        warningThreshold: 0.7, // 70%
        criticalThreshold: 0.5, // 50%
        unit: 'ratio',
        description: 'Overall cache hit rate',
        enabled: true
      }
    ];

    for (const threshold of defaultThresholds) {
      this.setThreshold(threshold);
    }
  }

  private collectMetrics(): void {
    // This would collect metrics from various system components
    // For now, we'll simulate some metrics
    const timestamp = new Date();
    
    // Simulate system metrics
    const memoryUsage = process.memoryUsage().heapUsed;
    const cpuUsage = Math.random() * 30 + 10; // 10-40% CPU
    
    this.recordMetric('memoryUsage', memoryUsage, timestamp);
    this.recordMetric('cpuUsage', cpuUsage, timestamp);
    
    // Check thresholds for collected metrics
    if (this.config.alertingEnabled) {
      this.checkMetricThreshold('memoryUsage', memoryUsage);
      this.checkMetricThreshold('cpuUsage', cpuUsage);
    }
  }

  private recordMetric(metric: string, value: number, timestamp: Date, metadata?: any): void {
    if (!this.metricHistory.has(metric)) {
      this.metricHistory.set(metric, []);
    }

    const history = this.metricHistory.get(metric)!;
    history.push({ timestamp, value, metadata });

    // Keep only recent history
    const cutoffTime = Date.now() - this.config.historicalDataRetentionMs;
    const filteredHistory = history.filter(entry => entry.timestamp.getTime() > cutoffTime);
    this.metricHistory.set(metric, filteredHistory);
  }

  private checkThresholds(metrics: PerformanceMetrics, systemHealth?: Map<string, SystemHealth>): void {
    // Check main performance metrics
    this.checkMetricThreshold('averageTickTime', metrics.averageTickTime);
    this.checkMetricThreshold('maxTickTime', metrics.maxTickTime);
    this.checkMetricThreshold('memoryUsage', metrics.memoryUsage);
    this.checkMetricThreshold('cpuUsage', metrics.cpuUsage);
    
    const overallSuccessRate = this.calculateOverallSuccessRate(metrics.systemSuccessRates);
    this.checkMetricThreshold('overallSuccessRate', overallSuccessRate);
    
    const overallCacheHitRate = this.calculateOverallCacheHitRate(metrics.cacheHitRates);
    this.checkMetricThreshold('overallCacheHitRate', overallCacheHitRate);
    
    // Check system-specific thresholds
    if (systemHealth) {
      for (const [systemId, health] of systemHealth) {
        if (health.successRate < 0.8) {
          this.createAlert(
            'critical',
            `${systemId}_successRate`,
            health.successRate,
            0.8,
            `System ${systemId} has low success rate: ${(health.successRate * 100).toFixed(1)}%`,
            systemId
          );
        }
      }
    }
  }

  private checkMetricThreshold(metric: string, value: number): void {
    const threshold = this.thresholds.get(metric);
    if (!threshold || !threshold.enabled) {
      return;
    }

    // Check critical threshold
    if (value >= threshold.criticalThreshold) {
      this.createAlert(
        'critical',
        metric,
        value,
        threshold.criticalThreshold,
        `${threshold.description} is critical: ${this.formatValue(value, threshold.unit)} >= ${this.formatValue(threshold.criticalThreshold, threshold.unit)}`
      );
    }
    // Check warning threshold
    else if (value >= threshold.warningThreshold) {
      this.createAlert(
        'warning',
        metric,
        value,
        threshold.warningThreshold,
        `${threshold.description} is elevated: ${this.formatValue(value, threshold.unit)} >= ${this.formatValue(threshold.warningThreshold, threshold.unit)}`
      );
    }
    // Resolve existing alerts if value is back to normal
    else {
      this.resolveMetricAlerts(metric);
    }
  }

  private createAlert(
    severity: 'info' | 'warning' | 'critical',
    metric: string,
    currentValue: number,
    threshold: number,
    message: string,
    systemId?: string
  ): void {
    const alertId = `${metric}_${severity}_${Date.now()}`;
    
    // Check if similar alert already exists
    const existingAlert = Array.from(this.activeAlerts.values()).find(
      alert => alert.metric === metric && alert.severity === severity && !alert.resolvedAt
    );
    
    if (existingAlert) {
      // Update existing alert
      existingAlert.currentValue = currentValue;
      existingAlert.timestamp = new Date();
      return;
    }

    const alert: Alert = {
      id: alertId,
      severity,
      metric,
      currentValue,
      threshold,
      message,
      timestamp: new Date(),
      acknowledged: false,
      systemId
    };

    this.activeAlerts.set(alertId, alert);
    
    console.log(`🚨 ${severity.toUpperCase()} Alert: ${message}`);
    this.emit('alertCreated', alert);
    
    // Auto-remediation if enabled
    if (this.config.enableAutoRemediation) {
      this.attemptAutoRemediation(alert);
    }
  }

  private resolveMetricAlerts(metric: string): void {
    for (const [alertId, alert] of this.activeAlerts) {
      if (alert.metric === metric && !alert.resolvedAt) {
        this.resolveAlert(alertId);
      }
    }
  }

  private calculateOverallHealthScore(): number {
    let totalScore = 0;
    let scoreCount = 0;

    // Factor in active alerts
    const activeAlerts = this.getActiveAlerts();
    let alertPenalty = 0;
    
    for (const alert of activeAlerts) {
      switch (alert.severity) {
        case 'critical': alertPenalty += 20; break;
        case 'warning': alertPenalty += 10; break;
        case 'info': alertPenalty += 5; break;
      }
    }

    // Base score from recent metrics
    const recentMetrics = this.getRecentMetricAverages();
    
    // Success rate score (0-30 points)
    if (recentMetrics.overallSuccessRate !== undefined) {
      totalScore += recentMetrics.overallSuccessRate * 30;
      scoreCount++;
    }
    
    // Performance score (0-30 points)
    if (recentMetrics.averageTickTime !== undefined) {
      const performanceScore = Math.max(0, 30 - (recentMetrics.averageTickTime / 1000)); // Penalty for slow ticks
      totalScore += performanceScore;
      scoreCount++;
    }
    
    // Cache efficiency score (0-20 points)
    if (recentMetrics.overallCacheHitRate !== undefined) {
      totalScore += recentMetrics.overallCacheHitRate * 20;
      scoreCount++;
    }
    
    // Resource usage score (0-20 points)
    if (recentMetrics.memoryUsage !== undefined) {
      const memoryScore = Math.max(0, 20 - (recentMetrics.memoryUsage / (1024 * 1024 * 1024)) * 20); // Penalty for high memory
      totalScore += memoryScore;
      scoreCount++;
    }

    const baseScore = scoreCount > 0 ? totalScore / scoreCount : 50;
    const finalScore = Math.max(0, Math.min(100, baseScore - alertPenalty));
    
    return finalScore;
  }

  private calculateSystemHealthScores(): Map<string, number> {
    const scores = new Map<string, number>();
    
    // This would calculate individual system health scores
    // For now, return empty map
    
    return scores;
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const recentAverages = this.getRecentMetricAverages();
    
    return {
      averageTickTime: recentAverages.averageTickTime || 0,
      maxTickTime: recentAverages.maxTickTime || 0,
      minTickTime: recentAverages.minTickTime || 0,
      systemExecutionTimes: new Map(),
      aptExecutionTimes: new Map(),
      memoryUsage: recentAverages.memoryUsage || 0,
      cpuUsage: recentAverages.cpuUsage || 0,
      systemSuccessRates: new Map(),
      aptSuccessRates: new Map(),
      cacheHitRates: new Map(),
      cacheSize: recentAverages.cacheSize || 0
    };
  }

  private analyzeTrends(): {
    tickTimesTrend: 'improving' | 'stable' | 'degrading';
    memoryUsageTrend: 'improving' | 'stable' | 'degrading';
    errorRateTrend: 'improving' | 'stable' | 'degrading';
  } {
    const tickTimeTrend = this.calculateTrend('averageTickTime');
    const memoryTrend = this.calculateTrend('memoryUsage');
    const errorRateTrend = this.calculateTrend('overallSuccessRate', true); // Inverted for error rate
    
    return {
      tickTimesTrend: tickTimeTrend,
      memoryUsageTrend: memoryTrend,
      errorRateTrend: errorRateTrend
    };
  }

  private calculateTrend(metric: string, inverted: boolean = false): 'improving' | 'stable' | 'degrading' {
    const history = this.getMetricHistory(metric, 1800000); // Last 30 minutes
    
    if (history.length < 10) {
      return 'stable';
    }
    
    const recent = history.slice(-5);
    const older = history.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, h) => sum + h.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.value, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    const threshold = 0.1; // 10% change threshold
    
    if (inverted) {
      if (change > threshold) return 'degrading';
      if (change < -threshold) return 'improving';
    } else {
      if (change > threshold) return 'degrading';
      if (change < -threshold) return 'improving';
    }
    
    return 'stable';
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const activeAlerts = this.getActiveAlerts();
    
    // Generate recommendations based on active alerts
    for (const alert of activeAlerts) {
      switch (alert.metric) {
        case 'averageTickTime':
          recommendations.push('Consider optimizing system execution or increasing parallel processing');
          break;
        case 'memoryUsage':
          recommendations.push('Review memory usage patterns and consider increasing cache cleanup frequency');
          break;
        case 'overallSuccessRate':
          recommendations.push('Investigate system failures and consider adjusting retry policies');
          break;
        case 'overallCacheHitRate':
          recommendations.push('Review cache configuration and consider increasing cache size or TTL');
          break;
      }
    }
    
    // Generate proactive recommendations
    const trends = this.analyzeTrends();
    
    if (trends.tickTimesTrend === 'degrading') {
      recommendations.push('Tick execution times are increasing - monitor system load and consider scaling');
    }
    
    if (trends.memoryUsageTrend === 'degrading') {
      recommendations.push('Memory usage is trending upward - check for memory leaks or increase cleanup frequency');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  private generateResourcePredictions(): {
    memoryUsageIn1Hour: number;
    expectedBottlenecks: string[];
  } {
    const memoryHistory = this.getMetricHistory('memoryUsage', 3600000); // Last hour
    const bottlenecks: string[] = [];
    
    let predictedMemory = 0;
    
    if (memoryHistory.length >= 5) {
      // Simple linear prediction
      const recent = memoryHistory.slice(-5);
      const trend = (recent[recent.length - 1].value - recent[0].value) / recent.length;
      predictedMemory = recent[recent.length - 1].value + (trend * 12); // 12 * 5min intervals = 1 hour
    }
    
    // Identify potential bottlenecks
    const recentAverages = this.getRecentMetricAverages();
    
    if (recentAverages.averageTickTime && recentAverages.averageTickTime > 20000) {
      bottlenecks.push('Tick execution time approaching limits');
    }
    
    if (predictedMemory > 800 * 1024 * 1024) {
      bottlenecks.push('Memory usage may exceed warning threshold');
    }
    
    if (recentAverages.overallCacheHitRate && recentAverages.overallCacheHitRate < 0.6) {
      bottlenecks.push('Cache efficiency may impact performance');
    }
    
    return {
      memoryUsageIn1Hour: predictedMemory,
      expectedBottlenecks: bottlenecks
    };
  }

  private getRecentMetricAverages(): Record<string, number> {
    const averages: Record<string, number> = {};
    const timeWindow = 300000; // 5 minutes
    
    for (const [metric, history] of this.metricHistory) {
      const recentHistory = history.filter(h => 
        Date.now() - h.timestamp.getTime() < timeWindow
      );
      
      if (recentHistory.length > 0) {
        averages[metric] = recentHistory.reduce((sum, h) => sum + h.value, 0) / recentHistory.length;
      }
    }
    
    return averages;
  }

  private calculateOverallSuccessRate(systemSuccessRates: Map<string, number>): number {
    if (systemSuccessRates.size === 0) return 1.0;
    
    let totalRate = 0;
    for (const rate of systemSuccessRates.values()) {
      totalRate += rate;
    }
    
    return totalRate / systemSuccessRates.size;
  }

  private calculateOverallCacheHitRate(cacheHitRates: Map<string, number>): number {
    if (cacheHitRates.size === 0) return 1.0;
    
    let totalRate = 0;
    for (const rate of cacheHitRates.values()) {
      totalRate += rate;
    }
    
    return totalRate / cacheHitRates.size;
  }

  private formatValue(value: number, unit: string): string {
    switch (unit) {
      case 'ms':
        return `${value.toFixed(0)}ms`;
      case 'bytes':
        return `${(value / 1024 / 1024).toFixed(1)}MB`;
      case '%':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toString();
    }
  }

  private attemptAutoRemediation(alert: Alert): void {
    console.log(`🔧 Attempting auto-remediation for: ${alert.message}`);
    
    // This would implement specific remediation strategies
    // For now, just log the attempt
    
    this.emit('autoRemediationAttempted', alert);
  }

  private async persistMetrics(metrics: PerformanceMetrics, timestamp: Date): Promise<void> {
    if (!this.databasePool) return;

    try {
      await this.databasePool.query(`
        INSERT INTO performance_metrics (
          timestamp, average_tick_time, max_tick_time, min_tick_time,
          memory_usage, cpu_usage, cache_size, metrics_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        timestamp,
        metrics.averageTickTime,
        metrics.maxTickTime,
        metrics.minTickTime,
        metrics.memoryUsage,
        metrics.cpuUsage,
        metrics.cacheSize,
        JSON.stringify(metrics)
      ]);
    } catch (error) {
      console.error('❌ Failed to persist performance metrics:', error);
    }
  }
}
