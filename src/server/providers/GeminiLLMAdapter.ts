/**
 * Real Google Gemini LLM Adapter for the Provider Adapter Framework
 * Uses Google's Generative AI SDK
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

export class GeminiLLMAdapter implements LLMAdapter {
  private config: Record<string, any>;
  private dependencies: AdapterDependencies;
  private apiKey: string;

  constructor(config: Record<string, any>, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    
    // Get API key from config or environment
    this.apiKey = config.apiKey || process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google API key is required for Gemini');
    }
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro',
        'gemini-pro-vision'
      ],
      cost: {
        inputPer1K: 1.25, // gemini-1.5-pro pricing
        outputPer1K: 5.00,
        unit: 'tokens'
      },
      maxTokens: 8192,
      contextWindow: 1000000, // Gemini 1.5 Pro context window
      streaming: true,
      languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'bn', 'te', 'mr'],
      notes: 'Google Gemini models - excellent multimodal capabilities, great for visual game elements'
    };
  }

  private convertMessages(messages: ChatMessage[]) {
    return messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));
  }

  async chat(options: LLMOptions): Promise<LLMResult> {
    const startTime = Date.now();
    
    try {
      const model = options.model || 'gemini-1.5-flash';
      const messages = this.convertMessages(options.messages || []);
      
      // Use fetch to call Gemini API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2048,
            stopSequences: options.stop
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const usage = data.usageMetadata;
      
      // Record metrics if available
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestEnd(
          { requestId: this.dependencies.requestId || 'unknown' },
          {
            latencyMs: latency,
            inputTokens: usage?.promptTokenCount || 0,
            outputTokens: usage?.candidatesTokenCount || 0,
            model: model
          }
        );
      }

      return {
        content,
        usage: usage ? {
          inputTokens: usage.promptTokenCount || 0,
          outputTokens: usage.candidatesTokenCount || 0,
          totalTokens: usage.totalTokenCount || 0
        } : undefined,
        model,
        finishReason: data.candidates?.[0]?.finishReason === 'STOP' ? 'stop' : 'length'
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
      const model = options.model || 'gemini-1.5-flash';
      const messages = this.convertMessages(options.messages || []);
      
      // Use fetch to call Gemini streaming API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2048,
            stopSequences: options.stop
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
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
              try {
                const data = JSON.parse(line.slice(6));
                const deltaText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                
                if (deltaText) {
                  fullContent += deltaText;
                  yield {
                    content: fullContent,
                    delta: deltaText
                  };
                }
                
                // Handle usage info
                if (data.usageMetadata) {
                  yield {
                    content: fullContent,
                    delta: '',
                    usage: {
                      inputTokens: data.usageMetadata.promptTokenCount || 0,
                      outputTokens: data.usageMetadata.candidatesTokenCount || 0,
                      totalTokens: data.usageMetadata.totalTokenCount || 0
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
        
        yield {
          content: fullContent,
          delta: '',
          finishReason: 'stop'
        };
        
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
