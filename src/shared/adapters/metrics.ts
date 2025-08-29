/**
 * Adapter Metrics Interface and Implementation
 * Provides hooks for capturing latency, token counts, and payload sizes
 */

import { AdapterError } from './base';

// Metrics Context
export interface MetricsContext {
  requestId: string;
  providerId: string;
  adapterType: 'llm' | 'stt' | 'tts' | 'image' | 'video' | 'embeddings';
  operation: string;
  model?: string;
  userId?: string;
  sessionId?: string;
  campaignId?: string;
  startTime?: number;
  metadata?: Record<string, any>;
}

// Metrics Data
export interface AdapterMetrics {
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  bytesIn?: number;
  bytesOut?: number;
  model?: string;
  cost?: {
    input?: number;
    output?: number;
    total?: number;
    currency?: string;
  };
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, any>;
}

// Metrics Sink Interface
export interface AdapterMetricsSink {
  /**
   * Called when a request starts
   */
  onRequestStart(context: MetricsContext): void | Promise<void>;
  
  /**
   * Called when a request completes successfully
   */
  onRequestEnd(context: MetricsContext, metrics: AdapterMetrics): void | Promise<void>;
  
  /**
   * Called when a request fails
   */
  onRequestError(context: MetricsContext, error: AdapterError): void | Promise<void>;
  
  /**
   * Called for streaming requests on each chunk
   */
  onStreamChunk?(context: MetricsContext, chunkMetrics: Partial<AdapterMetrics>): void | Promise<void>;
  
  /**
   * Called when a streaming request completes
   */
  onStreamEnd?(context: MetricsContext, finalMetrics: AdapterMetrics): void | Promise<void>;
}

// No-op Metrics Sink (Default)
export class NoOpMetricsSink implements AdapterMetricsSink {
  onRequestStart(context: MetricsContext): void {
    // No-op
  }
  
  onRequestEnd(context: MetricsContext, metrics: AdapterMetrics): void {
    // No-op
  }
  
  onRequestError(context: MetricsContext, error: AdapterError): void {
    // No-op
  }
  
  onStreamChunk?(context: MetricsContext, chunkMetrics: Partial<AdapterMetrics>): void {
    // No-op
  }
  
  onStreamEnd?(context: MetricsContext, finalMetrics: AdapterMetrics): void {
    // No-op
  }
}

// Console Metrics Sink (Development)
export class ConsoleMetricsSink implements AdapterMetricsSink {
  constructor(private logLevel: 'debug' | 'info' | 'warn' = 'info') {}
  
  onRequestStart(context: MetricsContext): void {
    if (this.logLevel === 'debug') {
      console.log(`🚀 [${context.providerId}] Starting ${context.operation}`, {
        requestId: context.requestId,
        model: context.model,
        adapterType: context.adapterType
      });
    }
  }
  
  onRequestEnd(context: MetricsContext, metrics: AdapterMetrics): void {
    console.log(`✅ [${context.providerId}] Completed ${context.operation}`, {
      requestId: context.requestId,
      latencyMs: metrics.latencyMs,
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      model: metrics.model,
      cost: metrics.cost?.total
    });
  }
  
  onRequestError(context: MetricsContext, error: AdapterError): void {
    console.error(`❌ [${context.providerId}] Failed ${context.operation}`, {
      requestId: context.requestId,
      error: error.code,
      message: error.message,
      provider: error.provider
    });
  }
  
  onStreamChunk?(context: MetricsContext, chunkMetrics: Partial<AdapterMetrics>): void {
    if (this.logLevel === 'debug') {
      console.log(`📦 [${context.providerId}] Stream chunk`, {
        requestId: context.requestId,
        tokens: chunkMetrics.outputTokens
      });
    }
  }
  
  onStreamEnd?(context: MetricsContext, finalMetrics: AdapterMetrics): void {
    console.log(`🏁 [${context.providerId}] Stream completed`, {
      requestId: context.requestId,
      totalLatencyMs: finalMetrics.latencyMs,
      totalTokens: finalMetrics.totalTokens
    });
  }
}

// Composite Metrics Sink (Multiple sinks)
export class CompositeMetricsSink implements AdapterMetricsSink {
  constructor(private sinks: AdapterMetricsSink[]) {}
  
  async onRequestStart(context: MetricsContext): Promise<void> {
    await Promise.all(
      this.sinks.map(sink => sink.onRequestStart(context))
    );
  }
  
  async onRequestEnd(context: MetricsContext, metrics: AdapterMetrics): Promise<void> {
    await Promise.all(
      this.sinks.map(sink => sink.onRequestEnd(context, metrics))
    );
  }
  
  async onRequestError(context: MetricsContext, error: AdapterError): Promise<void> {
    await Promise.all(
      this.sinks.map(sink => sink.onRequestError(context, error))
    );
  }
  
  async onStreamChunk?(context: MetricsContext, chunkMetrics: Partial<AdapterMetrics>): Promise<void> {
    await Promise.all(
      this.sinks
        .filter(sink => sink.onStreamChunk)
        .map(sink => sink.onStreamChunk!(context, chunkMetrics))
    );
  }
  
  async onStreamEnd?(context: MetricsContext, finalMetrics: AdapterMetrics): Promise<void> {
    await Promise.all(
      this.sinks
        .filter(sink => sink.onStreamEnd)
        .map(sink => sink.onStreamEnd!(context, finalMetrics))
    );
  }
}

// Metrics Timer Helper
export class MetricsTimer {
  private startTime: number;
  private endTime?: number;
  
  constructor() {
    this.startTime = Date.now();
  }
  
  /**
   * Get elapsed time in milliseconds
   */
  elapsed(): number {
    return (this.endTime || Date.now()) - this.startTime;
  }
  
  /**
   * Stop the timer and return elapsed time
   */
  stop(): number {
    this.endTime = Date.now();
    return this.elapsed();
  }
  
  /**
   * Reset the timer
   */
  reset(): void {
    this.startTime = Date.now();
    this.endTime = undefined;
  }
}

// Token Estimation Utilities
export class TokenEstimator {
  // Rough token estimation for different providers
  private static readonly CHARS_PER_TOKEN: Record<string, number> = {
    openai: 4,      // GPT models average ~4 chars per token
    anthropic: 4,   // Claude models similar to GPT
    ollama: 4,      // Most models similar
    default: 4
  };
  
  /**
   * Estimate token count from text
   */
  static estimateTokens(text: string, provider = 'default'): number {
    const charsPerToken = this.CHARS_PER_TOKEN[provider] || this.CHARS_PER_TOKEN.default;
    return Math.ceil(text.length / charsPerToken);
  }
  
  /**
   * Estimate tokens for chat messages
   */
  static estimateChatTokens(messages: Array<{ role: string; content: string }>, provider = 'default'): number {
    let totalTokens = 0;
    
    for (const message of messages) {
      // Add tokens for role and content
      totalTokens += this.estimateTokens(`${message.role}: ${message.content}`, provider);
      // Add overhead for message formatting
      totalTokens += 4;
    }
    
    // Add overhead for chat formatting
    totalTokens += 3;
    
    return totalTokens;
  }
  
  /**
   * Estimate cost based on token count and pricing
   */
  static estimateCost(
    inputTokens: number,
    outputTokens: number,
    pricing: { inputPer1K?: number; outputPer1K?: number }
  ): number {
    let cost = 0;
    
    if (pricing.inputPer1K && inputTokens > 0) {
      cost += (inputTokens / 1000) * pricing.inputPer1K;
    }
    
    if (pricing.outputPer1K && outputTokens > 0) {
      cost += (outputTokens / 1000) * pricing.outputPer1K;
    }
    
    return cost;
  }
}

// Metrics Collection Helper
export class MetricsCollector {
  private timer: MetricsTimer;
  private context: MetricsContext;
  private sink: AdapterMetricsSink;
  private streamChunks: Partial<AdapterMetrics>[] = [];
  
  constructor(context: MetricsContext, sink: AdapterMetricsSink) {
    this.context = context;
    this.sink = sink;
    this.timer = new MetricsTimer();
  }
  
  /**
   * Start metrics collection
   */
  async start(): Promise<void> {
    this.context.startTime = Date.now();
    await this.sink.onRequestStart(this.context);
  }
  
  /**
   * Record successful completion
   */
  async end(metrics: Partial<AdapterMetrics>): Promise<void> {
    const finalMetrics: AdapterMetrics = {
      latencyMs: this.timer.stop(),
      ...metrics
    };
    
    // Calculate total tokens if not provided
    if (!finalMetrics.totalTokens && finalMetrics.inputTokens && finalMetrics.outputTokens) {
      finalMetrics.totalTokens = finalMetrics.inputTokens + finalMetrics.outputTokens;
    }
    
    await this.sink.onRequestEnd(this.context, finalMetrics);
  }
  
  /**
   * Record error
   */
  async error(error: AdapterError): Promise<void> {
    await this.sink.onRequestError(this.context, error);
  }
  
  /**
   * Record stream chunk
   */
  async streamChunk(chunkMetrics: Partial<AdapterMetrics>): Promise<void> {
    this.streamChunks.push(chunkMetrics);
    if (this.sink.onStreamChunk) {
      await this.sink.onStreamChunk(this.context, chunkMetrics);
    }
  }
  
  /**
   * Complete streaming
   */
  async streamEnd(finalMetrics?: Partial<AdapterMetrics>): Promise<void> {
    // Aggregate chunk metrics
    const aggregated = this.aggregateStreamMetrics();
    
    const final: AdapterMetrics = {
      latencyMs: this.timer.stop(),
      ...aggregated,
      ...finalMetrics
    };
    
    if (this.sink.onStreamEnd) {
      await this.sink.onStreamEnd(this.context, final);
    }
    
    await this.sink.onRequestEnd(this.context, final);
  }
  
  private aggregateStreamMetrics(): Partial<AdapterMetrics> {
    const aggregated: Partial<AdapterMetrics> = {
      inputTokens: 0,
      outputTokens: 0,
      bytesIn: 0,
      bytesOut: 0
    };
    
    for (const chunk of this.streamChunks) {
      if (chunk.inputTokens) aggregated.inputTokens! += chunk.inputTokens;
      if (chunk.outputTokens) aggregated.outputTokens! += chunk.outputTokens;
      if (chunk.bytesIn) aggregated.bytesIn! += chunk.bytesIn;
      if (chunk.bytesOut) aggregated.bytesOut! += chunk.bytesOut;
    }
    
    if (aggregated.inputTokens && aggregated.outputTokens) {
      aggregated.totalTokens = aggregated.inputTokens + aggregated.outputTokens;
    }
    
    return aggregated;
  }
}

// Default metrics sink instance
export const defaultMetricsSink = new NoOpMetricsSink();

// Utility functions
export function createMetricsContext(
  requestId: string,
  providerId: string,
  adapterType: MetricsContext['adapterType'],
  operation: string,
  options?: Partial<MetricsContext>
): MetricsContext {
  return {
    requestId,
    providerId,
    adapterType,
    operation,
    startTime: Date.now(),
    ...options
  };
}

export function createMetricsCollector(
  context: MetricsContext,
  sink: AdapterMetricsSink = defaultMetricsSink
): MetricsCollector {
  return new MetricsCollector(context, sink);
}
