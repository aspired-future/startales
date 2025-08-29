/**
 * Real Ollama LLM Adapter for the Provider Adapter Framework
 * Wraps the existing OllamaProvider to work with the new interface
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
import { OllamaProvider } from '../llm/providers/ollama';
import { ModelMessage, CompletionOptions } from '../llm/types';

export class OllamaLLMAdapter implements LLMAdapter {
  private provider: OllamaProvider;
  private config: Record<string, any>;
  private dependencies: AdapterDependencies;

  constructor(config: Record<string, any>, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    
    // Initialize Ollama provider with config
    const baseUrl = config.baseUrl || config.host || 'http://localhost:11434';
    this.provider = new OllamaProvider(baseUrl);
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'llama3.1:8b', 
        'llama3.1:70b', 
        'llama3:8b', 
        'llama3:70b',
        'codellama:7b',
        'codellama:13b',
        'mistral:7b',
        'mixtral:8x7b',
        'phi3:mini',
        'phi3:medium',
        'qwen2.5:7b',
        'qwen2.5:14b'
      ],
      cost: {
        inputPer1K: 0,
        outputPer1K: 0,
        unit: 'tokens'
      },
      maxTokens: 4096,
      contextWindow: 8192, // Varies by model
      streaming: true,
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      notes: 'Local/AWS Ollama - free after setup, excellent for game sessions'
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
      model: options.model || 'llama3.1:8b',
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
            model: completionOptions.model || 'llama3.1:8b'
          }
        );
      }

      return {
        text: response.text,
        usage: response.usage ? {
          promptTokens: response.usage.promptTokens || 0,
          completionTokens: response.usage.completionTokens || 0,
          totalTokens: response.usage.totalTokens || 0
        } : undefined,
        model: completionOptions.model || 'llama3.1:8b',
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
        text: result.text,
        done: true,
        tokens: result.usage ? {
          input: result.usage.promptTokens,
          output: result.usage.completionTokens
        } : undefined,
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
            text: fullContent,
            done: false
          };
        } else if (chunk.type === 'tool_call' && chunk.toolCall) {
          yield {
            text: fullContent,
            done: false,
            toolCalls: [chunk.toolCall as any]
          };
        } else if (chunk.type === 'usage' && chunk.usage) {
          yield {
            text: fullContent,
            done: false,
            tokens: {
              input: chunk.usage.promptTokens || 0,
              output: chunk.usage.completionTokens || 0
            }
          };
        } else if (chunk.type === 'end') {
          yield {
            text: fullContent,
            done: true,
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
