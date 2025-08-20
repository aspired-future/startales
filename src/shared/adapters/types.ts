/**
 * Shared types and interfaces for Provider Adapter Framework
 * Defines contracts for all provider types and common structures
 */

// Base provider interface
export interface BaseProvider {
  readonly name: string;
  readonly type: ProviderType;
  healthCheck(): Promise<HealthCheckResult>;
}

// Provider types
export type ProviderType = 'llm' | 'stt' | 'tts' | 'image' | 'video' | 'embedding';

// Health check result
export interface HealthCheckResult {
  healthy: boolean;
  latency: number;
  error?: string;
  metadata?: Record<string, any>;
}

// Usage tracking
export interface UsageInfo {
  tokens?: number;
  requests?: number;
  characters?: number;
  duration?: number;
  [key: string]: any;
}

// Base request/response interfaces
export interface BaseRequest {
  options?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface BaseResponse {
  provider: string;
  usage: UsageInfo;
  metadata?: Record<string, any>;
}

// LLM Provider interfaces
export interface LLMProvider extends BaseProvider {
  type: 'llm';
  generateText(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
  streamText(prompt: string, options?: LLMOptions): AsyncIterable<LLMStreamChunk>;
}

export interface LLMOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  functions?: LLMFunction[];
  tools?: LLMTool[];
  systemPrompt?: string;
  conversationHistory?: LLMMessage[];
  seed?: number;
  [key: string]: any;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string | null;
  name?: string;
  functionCall?: LLMFunctionCall;
  toolCalls?: LLMToolCall[];
}

export interface LLMFunction {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface LLMTool {
  type: 'function';
  function: LLMFunction;
}

export interface LLMFunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface LLMToolCall {
  id: string;
  type: 'function';
  function: LLMFunctionCall;
}

export interface LLMResponse extends BaseResponse {
  text: string | null;
  functionCall?: LLMFunctionCall;
  toolCalls?: LLMToolCall[];
  finishReason?: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter';
  logprobs?: any;
}

export interface LLMStreamChunk {
  text: string;
  done: boolean;
  functionCall?: Partial<LLMFunctionCall>;
  toolCalls?: Partial<LLMToolCall>[];
  finishReason?: string;
}

// STT Provider interfaces
export interface STTProvider extends BaseProvider {
  type: 'stt';
  transcribe(audio: Buffer, options?: STTOptions): Promise<STTResponse>;
  streamTranscribe(audioStream: AsyncIterable<Buffer>, options?: STTOptions): AsyncIterable<STTStreamChunk>;
}

export interface STTOptions {
  language?: string;
  model?: string;
  temperature?: number;
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  timestampGranularities?: ('word' | 'segment')[];
  enableDiarization?: boolean;
  maxSpeakers?: number;
  [key: string]: any;
}

export interface STTResponse extends BaseResponse {
  text: string;
  language?: string;
  confidence?: number;
  segments?: STTSegment[];
  words?: STTWord[];
  speakers?: STTSpeaker[];
}

export interface STTSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  confidence?: number;
  speaker?: string;
}

export interface STTWord {
  word: string;
  start: number;
  end: number;
  confidence?: number;
  speaker?: string;
}

export interface STTSpeaker {
  id: string;
  name?: string;
  confidence?: number;
}

export interface STTStreamChunk {
  text: string;
  partial: boolean;
  confidence?: number;
  timestamp?: number;
  speaker?: string;
}

// TTS Provider interfaces
export interface TTSProvider extends BaseProvider {
  type: 'tts';
  synthesize(text: string, options?: TTSOptions): Promise<TTSResponse>;
  streamSynthesize(text: string, options?: TTSOptions): AsyncIterable<TTSStreamChunk>;
}

export interface TTSOptions {
  voice?: string;
  model?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac';
  sampleRate?: number;
  enableTimestamps?: boolean;
  ssml?: boolean;
  [key: string]: any;
}

export interface TTSResponse extends BaseResponse {
  audio: Buffer;
  format: string;
  duration?: number;
  timestamps?: TTSTimestamp[];
}

export interface TTSStreamChunk {
  audio: Buffer;
  done: boolean;
  timestamp?: number;
}

export interface TTSTimestamp {
  text: string;
  start: number;
  end: number;
}

// Image Provider interfaces
export interface ImageProvider extends BaseProvider {
  type: 'image';
  generateImage(prompt: string, options?: ImageOptions): Promise<ImageResponse>;
  createVariation?(image: Buffer, options?: ImageVariationOptions): Promise<ImageResponse>;
  editImage?(image: Buffer, prompt: string, options?: ImageEditOptions): Promise<ImageResponse>;
}

export interface ImageOptions {
  size?: string;
  count?: number;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  responseFormat?: 'url' | 'b64_json';
  width?: number;
  height?: number;
  steps?: number;
  cfgScale?: number;
  seed?: number;
  negativePrompt?: string;
  [key: string]: any;
}

export interface ImageVariationOptions {
  count?: number;
  size?: string;
  responseFormat?: 'url' | 'b64_json';
  [key: string]: any;
}

export interface ImageEditOptions extends ImageVariationOptions {
  mask?: Buffer;
  [key: string]: any;
}

export interface ImageResponse extends BaseResponse {
  images: ImageResult[];
}

export interface ImageResult {
  url?: string;
  data?: string; // base64 encoded
  prompt?: string; // revised prompt
  seed?: number;
  width?: number;
  height?: number;
}

// Video Provider interfaces (future)
export interface VideoProvider extends BaseProvider {
  type: 'video';
  generateVideo(prompt: string, options?: VideoOptions): Promise<VideoResponse>;
}

export interface VideoOptions {
  duration?: number;
  fps?: number;
  resolution?: string;
  style?: string;
  [key: string]: any;
}

export interface VideoResponse extends BaseResponse {
  videos: VideoResult[];
}

export interface VideoResult {
  url?: string;
  data?: string;
  duration?: number;
  fps?: number;
  resolution?: string;
}

// Embedding Provider interfaces
export interface EmbeddingProvider extends BaseProvider {
  type: 'embedding';
  embed(text: string | string[], options?: EmbeddingOptions): Promise<EmbeddingResponse>;
}

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
  encodingFormat?: 'float' | 'base64';
  [key: string]: any;
}

export interface EmbeddingResponse extends BaseResponse {
  embeddings: EmbeddingResult[];
}

export interface EmbeddingResult {
  embedding: number[];
  index: number;
  object: 'embedding';
}

// Provider Registry interfaces
export interface ProviderRegistryConfig {
  providers: Record<ProviderType, Record<string, any>>;
  failover?: Record<ProviderType, string[]>;
  loadBalancing?: Record<ProviderType, LoadBalancingConfig>;
  healthCheck?: HealthCheckConfig;
  metrics?: MetricsConfig;
}

export interface LoadBalancingConfig {
  providers: (string | { name: string; weight: number })[];
  strategy: 'round-robin' | 'weighted' | 'least-latency' | 'least-errors';
}

export interface HealthCheckConfig {
  interval: number;
  timeout: number;
  retries: number;
  failureThreshold: number;
}

export interface MetricsConfig {
  enabled: boolean;
  retention: number;
  aggregationInterval: number;
}

// Provider statistics
export interface ProviderStats {
  requests: number;
  successes: number;
  failures: number;
  averageLatency: number;
  latencyPercentiles: {
    p50: number;
    p95: number;
    p99: number;
  };
  errorTypes: Record<string, number>;
  lastRequest?: Date;
  lastSuccess?: Date;
  lastFailure?: Date;
}

// Error types
export class ProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public type: ProviderErrorType,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export type ProviderErrorType = 
  | 'authentication'
  | 'rate_limit'
  | 'quota_exceeded'
  | 'invalid_request'
  | 'server_error'
  | 'network_error'
  | 'timeout'
  | 'content_filter'
  | 'unknown';

// Configuration validation
export interface ProviderConfigSchema {
  type: ProviderType;
  required: string[];
  optional: string[];
  validation: Record<string, (value: any) => boolean>;
}

// Provider factory interface
export interface ProviderFactory {
  create(type: ProviderType, name: string, config: any): BaseProvider;
  getConfigSchema(type: ProviderType, name: string): ProviderConfigSchema;
  validateConfig(type: ProviderType, name: string, config: any): boolean;
}

// Adapter execution result
export interface AdapterExecutionResult<T = any> extends BaseResponse {
  result: T;
  executionTime: number;
  retries: number;
  failoverUsed: boolean;
  originalProvider?: string;
}

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors: ProviderErrorType[];
}

// Circuit breaker configuration
export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
  minimumRequests: number;
}

// Provider middleware interface
export interface ProviderMiddleware {
  name: string;
  beforeRequest?(request: any): Promise<any>;
  afterResponse?(response: any): Promise<any>;
  onError?(error: Error): Promise<Error>;
}

// Caching interfaces
export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  keyGenerator: (request: any) => string;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// Rate limiting interfaces
export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

export interface RateLimitState {
  requests: number;
  resetTime: number;
  remaining: number;
}

// Monitoring and observability
export interface ProviderMetrics {
  provider: string;
  type: ProviderType;
  timestamp: Date;
  latency: number;
  success: boolean;
  error?: ProviderErrorType;
  usage: UsageInfo;
  metadata?: Record<string, any>;
}

export interface ProviderEvent {
  type: 'request' | 'response' | 'error' | 'health_check' | 'failover' | 'circuit_breaker';
  provider: string;
  timestamp: Date;
  data: any;
}

// Type guards
export function isLLMProvider(provider: BaseProvider): provider is LLMProvider {
  return provider.type === 'llm';
}

export function isSTTProvider(provider: BaseProvider): provider is STTProvider {
  return provider.type === 'stt';
}

export function isTTSProvider(provider: BaseProvider): provider is TTSProvider {
  return provider.type === 'tts';
}

export function isImageProvider(provider: BaseProvider): provider is ImageProvider {
  return provider.type === 'image';
}

export function isVideoProvider(provider: BaseProvider): provider is VideoProvider {
  return provider.type === 'video';
}

export function isEmbeddingProvider(provider: BaseProvider): provider is EmbeddingProvider {
  return provider.type === 'embedding';
}

// Utility types
export type ProviderMap = {
  llm: LLMProvider;
  stt: STTProvider;
  tts: TTSProvider;
  image: ImageProvider;
  video: VideoProvider;
  embedding: EmbeddingProvider;
};

export type ProviderOptions<T extends ProviderType> = 
  T extends 'llm' ? LLMOptions :
  T extends 'stt' ? STTOptions :
  T extends 'tts' ? TTSOptions :
  T extends 'image' ? ImageOptions :
  T extends 'video' ? VideoOptions :
  T extends 'embedding' ? EmbeddingOptions :
  never;

export type ProviderResponse<T extends ProviderType> = 
  T extends 'llm' ? LLMResponse :
  T extends 'stt' ? STTResponse :
  T extends 'tts' ? TTSResponse :
  T extends 'image' ? ImageResponse :
  T extends 'video' ? VideoResponse :
  T extends 'embedding' ? EmbeddingResponse :
  never;
