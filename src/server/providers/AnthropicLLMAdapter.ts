/**
 * Real Anthropic LLM Adapter for the Provider Adapter Framework
 * Wraps the existing AnthropicProvider to work with the new interface
 */

import { 
  LLMAdapter, 
  ChatMessage, 
  LLMOptions, 
  LLMResult, 
  LLMDelta,
  AdapterCapability,
  AdapterDependencies
} from '../../shared/adapters/index.js';
import { AnthropicProvider } from '../llm/providers/anthropic.js';
import { ModelMessage, CompletionOptions } from '../llm/types.js';

export class AnthropicLLMAdapter implements LLMAdapter {
  private provider: AnthropicProvider;
  private config: Record<string, any>;
  private dependencies: AdapterDependencies;

  constructor(config: Record<string, any>, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    
    // Initialize Anthropic provider with API key
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }
    this.provider = new AnthropicProvider(apiKey);
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ],
      cost: {
        inputPer1K: 3.00, // claude-3-5-sonnet pricing
        outputPer1K: 15.00,
        unit: 'tokens'
      },
      maxTokens: 4096,
      contextWindow: 200000, // Claude 3.5 context window
      streaming: true,
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'],
      notes: 'Premium Anthropic Claude models - excellent reasoning, best for complex game narratives'
    };
  }

  private convertMessages(messages: ChatMessage[]): ModelMessage[] {
    return messages.map(msg => ({
      role: msg.role as any,
      content: msg.content
    }));
  }

  private convertOptions(options: LLMOptions): CompletionOptions {
    return {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      model: options.model || 'claude-3-5-haiku-20241022',
      tools: options.tools,
      stop: options.stop
    };
  }

  async chat(options: LLMOptions): Promise<LLMResult> {
    const startTime = Date.now();
    
    try {
      const messages = this.convertMessages(options.messages || []);
      const completionOptions = this.convertOptions(options);
      
      const response = await this.provider.complete(messages, completionOptions);
      const latency = Date.now() - startTime;
      
      // Record metrics if available
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestEnd(
          { requestId: this.dependencies.requestId || 'unknown' },
          {
            latencyMs: latency,
            inputTokens: response.usage?.promptTokens || 0,
            outputTokens: response.usage?.completionTokens || 0,
            model: completionOptions.model || 'claude-3-5-haiku-20241022'
          }
        );
      }

      return {
        content: response.text,
        usage: response.usage ? {
          inputTokens: response.usage.promptTokens || 0,
          outputTokens: response.usage.completionTokens || 0,
          totalTokens: response.usage.totalTokens || 0
        } : undefined,
        model: completionOptions.model || 'claude-3-5-haiku-20241022',
        finishReason: 'stop',
        toolCalls: response.toolCalls
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestError(
          { requestId: this.dependencies.requestId || 'unknown' },
          error as Error
        );
      }
      
      throw error;
    }
  }

  async *chatStream(options: LLMOptions): AsyncIterable<LLMDelta> {
    const messages = this.convertMessages(options.messages || []);
    const completionOptions = this.convertOptions(options);
    
    if (!this.provider.completeStream) {
      // Fallback to non-streaming
      const result = await this.chat(options);
      yield {
        content: result.content,
        delta: result.content,
        usage: result.usage,
        finishReason: result.finishReason,
        toolCalls: result.toolCalls
      };
      return;
    }

    let fullContent = '';
    
    try {
      for await (const chunk of this.provider.completeStream(messages, completionOptions)) {
        if (chunk.type === 'text' && chunk.deltaText) {
          fullContent += chunk.deltaText;
          yield {
            content: fullContent,
            delta: chunk.deltaText
          };
        } else if (chunk.type === 'tool_call' && chunk.toolCall) {
          yield {
            content: fullContent,
            delta: '',
            toolCalls: [chunk.toolCall]
          };
        } else if (chunk.type === 'usage' && chunk.usage) {
          yield {
            content: fullContent,
            delta: '',
            usage: {
              inputTokens: chunk.usage.promptTokens || 0,
              outputTokens: chunk.usage.completionTokens || 0,
              totalTokens: chunk.usage.totalTokens || 0
            }
          };
        } else if (chunk.type === 'end') {
          yield {
            content: fullContent,
            delta: '',
            finishReason: 'stop'
          };
        }
      }
    } catch (error) {
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestError(
          { requestId: this.dependencies.requestId || 'unknown' },
          error as Error
        );
      }
      throw error;
    }
  }
}
