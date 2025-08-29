/**
 * Real OpenAI LLM Adapter for the Provider Adapter Framework
 * Wraps the existing OpenAIProvider to work with the new interface
 */

import { 
  LLMAdapter, 
  ChatMessage, 
  LLMOptions, 
  LLMResult, 
  LLMDelta,
  AdapterCapability,
  AdapterDependencies
} from '../../shared/adapters/index';
import { OpenAIProvider } from '../llm/providers/openai';
import { ModelMessage, CompletionOptions } from '../llm/types';

export class OpenAILLMAdapter implements LLMAdapter {
  private provider: OpenAIProvider;
  private config: Record<string, any>;
  private dependencies: AdapterDependencies;

  constructor(config: Record<string, any>, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    
    // Initialize OpenAI provider with API key
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.provider = new OpenAIProvider(apiKey);
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'gpt-4o',
        'gpt-4o-mini', 
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'o1-preview',
        'o1-mini'
      ],
      cost: {
        inputPer1K: 2.50, // gpt-4o pricing
        outputPer1K: 10.00,
        unit: 'tokens'
      },
      maxTokens: 4096,
      contextWindow: 128000, // gpt-4o context window
      streaming: true,
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'],
      notes: 'Premium OpenAI models - highest quality, best for premium game sessions'
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
      model: options.model || 'gpt-4o-mini',
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
            model: completionOptions.model || 'gpt-4o-mini'
          }
        );
      }

      return {
        content: response.text,
        usage: response.usage ? {
          promptTokens: response.usage.promptTokens || 0,
          completionTokens: response.usage.completionTokens || 0,
          totalTokens: response.usage.totalTokens || 0
        } : undefined,
        model: completionOptions.model || 'gpt-4o-mini',
        finishReason: 'stop',
        toolCalls: response.toolCalls?.map(tc => ({
          id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'function' as const,
          function: {
            name: tc.name,
            arguments: typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments)
          }
        }))
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
