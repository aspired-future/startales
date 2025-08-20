/**
 * LLM Adapter Interface and Types
 */

import { z } from 'zod';
import { BaseAdapter } from './base.js';

// Common Message Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

// LLM Types
export interface LLMOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: ToolDefinition[];
  stop?: string | string[];
  presencePenalty?: number;
  frequencyPenalty?: number;
  topP?: number;
  seed?: number;
}

export interface LLMResult {
  text: string;
  model: string;
  tokens?: {
    input: number;
    output: number;
  };
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  toolCalls?: ToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMDelta {
  text: string;
  done: boolean;
  tokens?: {
    input?: number;
    output?: number;
  };
  toolCalls?: Partial<ToolCall>[];
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

// LLM Adapter Interface
export interface LLMAdapter extends BaseAdapter {
  chat(options: LLMOptions): Promise<LLMResult>;
  chatStream?(options: LLMOptions): AsyncIterable<LLMDelta>;
}

// Zod Schemas
export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string(),
  name: z.string().optional(),
  tool_calls: z.array(z.object({
    id: z.string(),
    type: z.literal('function'),
    function: z.object({
      name: z.string(),
      arguments: z.string()
    })
  })).optional(),
  tool_call_id: z.string().optional()
});

export const LLMOptionsSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().optional(),
  tools: z.array(z.object({
    type: z.literal('function'),
    function: z.object({
      name: z.string(),
      description: z.string(),
      parameters: z.record(z.any())
    })
  })).optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  seed: z.number().int().optional()
});

// Type Guards
export function isLLMAdapter(adapter: BaseAdapter): adapter is LLMAdapter {
  return 'chat' in adapter && typeof adapter.chat === 'function';
}

// Validation Functions
export function validateLLMOptions(options: unknown): LLMOptions {
  return LLMOptionsSchema.parse(options);
}
