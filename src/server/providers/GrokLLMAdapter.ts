/**
 * Real xAI Grok LLM Adapter for the Provider Adapter Framework
 * Uses xAI's API (OpenAI-compatible)
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

export class GrokLLMAdapter implements LLMAdapter {
  private config: Record<string, any>;
  private dependencies: AdapterDependencies;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Record<string, any>, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    
    // Get API key from config or environment
    this.apiKey = config.apiKey || process.env.XAI_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://api.x.ai/v1';
    
    if (!this.apiKey) {
      throw new Error('xAI API key is required for Grok');
    }
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'grok-beta',
        'grok-vision-beta'
      ],
      cost: {
        inputPer1K: 5.00, // grok-beta pricing (estimated)
        outputPer1K: 15.00,
        unit: 'tokens'
      },
      maxTokens: 4096,
      contextWindow: 131072, // Grok context window
      streaming: true,
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      notes: 'xAI Grok models - real-time knowledge, excellent for current events and humor in games'
    };
  }

  private convertMessages(messages: ChatMessage[]) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  async chat(options: LLMOptions): Promise<LLMResult> {
    const startTime = Date.now();
    
    try {
      const model = options.model || 'grok-beta';
      const messages = this.convertMessages(options.messages || []);
      
      // Use OpenAI-compatible API format
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
          stop: options.stop,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      
      const content = data.choices?.[0]?.message?.content || '';
      const usage = data.usage;
      
      // Record metrics if available
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestEnd(
          { requestId: this.dependencies.requestId || 'unknown' },
          {
            latencyMs: latency,
            inputTokens: usage?.prompt_tokens || 0,
            outputTokens: usage?.completion_tokens || 0,
            model: model
          }
        );
      }

      return {
        content,
        usage: usage ? {
          inputTokens: usage.prompt_tokens || 0,
          outputTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0
        } : undefined,
        model,
        finishReason: data.choices?.[0]?.finish_reason === 'stop' ? 'stop' : 'length',
        toolCalls: data.choices?.[0]?.message?.tool_calls
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
    const startTime = Date.now();
    
    try {
      const model = options.model || 'grok-beta';
      const messages = this.convertMessages(options.messages || []);
      
      // Use OpenAI-compatible streaming API
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
          stop: options.stop,
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                yield {
                  content: fullContent,
                  delta: '',
                  finishReason: 'stop'
                };
                return;
              }
              
              try {
                const data = JSON.parse(dataStr);
                const deltaText = data.choices?.[0]?.delta?.content || '';
                
                if (deltaText) {
                  fullContent += deltaText;
                  yield {
                    content: fullContent,
                    delta: deltaText
                  };
                }
                
                // Handle tool calls
                if (data.choices?.[0]?.delta?.tool_calls) {
                  yield {
                    content: fullContent,
                    delta: '',
                    toolCalls: data.choices[0].delta.tool_calls
                  };
                }
                
                // Handle usage info (usually in the last chunk)
                if (data.usage) {
                  yield {
                    content: fullContent,
                    delta: '',
                    usage: {
                      inputTokens: data.usage.prompt_tokens || 0,
                      outputTokens: data.usage.completion_tokens || 0,
                      totalTokens: data.usage.total_tokens || 0
                    }
                  };
                }
              } catch (parseError) {
                // Skip malformed JSON chunks
                continue;
              }
            }
          }
        }
        
      } finally {
        reader.releaseLock();
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
