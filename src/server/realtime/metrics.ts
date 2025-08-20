/**
 * Metrics Collection
 * Task 3, Subtask 3.16: Admin and observability endpoints
 */

import { RealtimeConfig } from './config.js'

export interface MetricValue {
  count: number
  lastUpdated: number
}

export interface Metrics {
  connections_established: number
  connections_closed: number
  connections_rejected_auth: number
  connections_rejected_limit: number
  connections_idle_timeout: number
  connection_errors: number
  messages_processed: number
  messages_sent: number
  messages_invalid: number
  messages_rate_limited: number
  heartbeat_pings: number
  heartbeat_pongs: number
  channels_created: number
  channels_destroyed: number
  [key: string]: number
}

export class MetricsCollector {
  private metrics = new Map<string, MetricValue>()

  constructor(private config: RealtimeConfig) {}

  /**
   * Increment a metric counter
   */
  increment(metric: string, value: number = 1): void {
    if (!this.config.enableMetrics) return

    const current = this.metrics.get(metric) || { count: 0, lastUpdated: 0 }
    current.count += value
    current.lastUpdated = Date.now()
    this.metrics.set(metric, current)
  }

  /**
   * Set a metric to a specific value
   */
  set(metric: string, value: number): void {
    if (!this.config.enableMetrics) return

    this.metrics.set(metric, {
      count: value,
      lastUpdated: Date.now()
    })
  }

  /**
   * Get current metric value
   */
  get(metric: string): number {
    const value = this.metrics.get(metric)
    return value ? value.count : 0
  }

  /**
   * Get all metrics
   */
  getMetrics(): Metrics {
    const result: Metrics = {
      connections_established: 0,
      connections_closed: 0,
      connections_rejected_auth: 0,
      connections_rejected_limit: 0,
      connections_idle_timeout: 0,
      connection_errors: 0,
      messages_processed: 0,
      messages_sent: 0,
      messages_invalid: 0,
      messages_rate_limited: 0,
      heartbeat_pings: 0,
      heartbeat_pongs: 0,
      channels_created: 0,
      channels_destroyed: 0
    }

    for (const [key, value] of this.metrics) {
      result[key] = value.count
    }

    return result
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear()
  }

  /**
   * Get metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const lines: string[] = []
    
    for (const [key, value] of this.metrics) {
      lines.push(`# TYPE realtime_${key} counter`)
      lines.push(`realtime_${key} ${value.count}`)
    }

    return lines.join('\n')
  }
}
