export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface ModelMessage {
  role: Role;
  content: string;
  /** Optional tool name if role === 'tool' */
  name?: string;
}

export interface JsonSchema {
  $schema?: string;
  $id?: string;
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  items?: unknown;
  enum?: unknown[];
  anyOf?: unknown[];
  allOf?: unknown[];
  oneOf?: unknown[];
  description?: string;
}

export interface ToolDefinition {
  name: string;
  description?: string;
  inputSchema: JsonSchema;
}

export interface ToolCall {
  name: string;
  arguments: unknown;
}

export interface CompletionUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  costUsd?: number; // 0 for local (e.g., Ollama)
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
  seed?: number;
  model?: string; // provider-specific model id
  tools?: ToolDefinition[];
  toolChoice?: 'auto' | 'none' | { name: string };
  /** Provider-specific extra options */
  extra?: Record<string, unknown>;
}

export interface CompletionResponse {
  text: string;
  toolCalls?: ToolCall[];
  usage?: CompletionUsage;
  /** Raw provider payload for diagnostics */
  raw?: unknown;
}

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'usage' | 'end';
  deltaText?: string;
  toolCall?: ToolCall;
  usage?: CompletionUsage;
}

export interface EmbeddingResult {
  vectors: number[][]; // float32 normalized to number
  dim: number;
}

export interface LLMProvider {
  /** Unique provider name, e.g., 'openai', 'anthropic', 'gemini', 'grok', 'ollama' */
  readonly name: string;
  /** Return a single-shot completion */
  complete(messages: ModelMessage[], options?: CompletionOptions): Promise<CompletionResponse>;
  /** Async iterator streaming chunks until 'end' */
  completeStream?(messages: ModelMessage[], options?: CompletionOptions): AsyncIterable<StreamChunk>;
  /** Generate embeddings for an array of texts */
  embed?(texts: string[], options?: { model?: string }): Promise<EmbeddingResult>;
  /** Capabilities */
  supportsTools?: boolean;
  supportsStreaming?: boolean;
  supportsEmbedding?: boolean;
}


