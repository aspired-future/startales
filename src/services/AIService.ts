/**
 * AI Service
 * Provides AI functionality for various game systems
 */

import http from 'http';

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'ollama' | 'local';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  baseUrl?: string; // For Ollama and other custom endpoints
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIService {
  generateText(prompt: string, options?: Partial<AIServiceConfig>): Promise<AIResponse>;
  generateStructuredResponse<T>(prompt: string, schema: any, options?: Partial<AIServiceConfig>): Promise<T>;
  isAvailable(): boolean;
}

class MockAIService implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = { provider: 'local' }) {
    this.config = config;
  }

  async generateText(prompt: string, options?: Partial<AIServiceConfig>): Promise<AIResponse> {
    // Mock implementation for development
    console.log('MockAIService.generateText called with prompt:', prompt.substring(0, 100) + '...');
    
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate mock response based on prompt content
    let mockResponse = '';
    
    if (prompt.toLowerCase().includes('character')) {
      mockResponse = 'A dynamic character with unique personality traits and background story.';
    } else if (prompt.toLowerCase().includes('story')) {
      mockResponse = 'An engaging storyline that propels the narrative forward with interesting plot developments.';
    } else if (prompt.toLowerCase().includes('witter') || prompt.toLowerCase().includes('post')) {
      mockResponse = 'Breaking: Exciting developments in our civilization! Citizens are buzzing with anticipation. #CivUpdate #Progress';
    } else if (prompt.toLowerCase().includes('news')) {
      mockResponse = 'In a surprising turn of events, local officials announce new initiatives that promise to transform daily life for citizens across the region.';
    } else {
      mockResponse = 'This is a mock AI response generated for development purposes. The actual AI service would provide more contextual and relevant content.';
    }

    return {
      content: mockResponse,
      usage: {
        promptTokens: Math.floor(prompt.length / 4),
        completionTokens: Math.floor(mockResponse.length / 4),
        totalTokens: Math.floor((prompt.length + mockResponse.length) / 4)
      }
    };
  }

  async generateStructuredResponse<T>(prompt: string, schema: any, options?: Partial<AIServiceConfig>): Promise<T> {
    console.log('MockAIService.generateStructuredResponse called');
    
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate mock structured response
    const mockStructuredResponse = {
      success: true,
      data: {
        content: 'Mock structured response',
        metadata: {
          generated: new Date().toISOString(),
          model: 'mock-ai-v1'
        }
      }
    };

    return mockStructuredResponse as T;
  }

  isAvailable(): boolean {
    return true; // Mock service is always available
  }
}

class OllamaService implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    console.log('🦙 OllamaService constructor called with config:', JSON.stringify(config, null, 2));
    this.config = config;
  }

  async generateText(prompt: string, options?: Partial<AIServiceConfig>): Promise<AIResponse> {
    const mergedConfig = { ...this.config, ...options };
    const baseUrl = mergedConfig.baseUrl || 'http://localhost:11434';
    
    console.log('🦙 OllamaService.generateText called');
    console.log('📍 Base URL:', baseUrl);
    console.log('🔧 Model:', mergedConfig.model);
    console.log('📝 Prompt length:', prompt.length);
    
    try {
      const requestBody = {
        model: mergedConfig.model || 'llama3.2',
        stream: false,
        messages: [{ role: 'user', content: prompt }],
        options: {
          temperature: mergedConfig.temperature || 0.7,
          num_ctx: mergedConfig.maxTokens || 1000
        }
      };
      
      console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
      
      // Use Node.js http module instead of fetch to avoid tsx issues
      const url = new URL(`${baseUrl}/api/chat`);
      const postData = JSON.stringify(requestBody);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 11434,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const httpResponse = await new Promise((resolve, reject) => {
        const req = http.request(options, (httpRes) => {
          let data = '';
          httpRes.on('data', (chunk) => data += chunk);
          httpRes.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve({ 
                ok: httpRes.statusCode >= 200 && httpRes.statusCode < 300,
                status: httpRes.statusCode, 
                statusText: httpRes.statusMessage,
                json: () => Promise.resolve(jsonData)
              });
            } catch (parseError) {
              reject(new Error(`JSON parse error: ${parseError.message}`));
            }
          });
        });

        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.write(postData);
        req.end();
      });

      const response = httpResponse;

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.message?.content || '',
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
        }
      };
    } catch (error) {
      console.error('🚨 Ollama API error:', error);
      console.error('🌐 Attempted URL:', `${baseUrl}/api/chat`);
      console.error('📋 Error message:', error?.message || 'No message');
      console.error('🔍 Error code:', error?.code || 'No code');
      console.error('📊 Error stack:', error?.stack || 'No stack');
      console.error('🔧 Full error object:', JSON.stringify(error, null, 2));
      throw new Error(`Ollama connection failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async generateStructuredResponse<T>(prompt: string, schema: any, options?: Partial<AIServiceConfig>): Promise<T> {
    const structuredPrompt = `${prompt}\n\nPlease respond with valid JSON that matches this schema: ${JSON.stringify(schema)}`;
    const response = await this.generateText(structuredPrompt, options);
    
    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      console.error('Failed to parse structured response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  isAvailable(): boolean {
    return true; // Ollama doesn't require API keys
  }
}

class OpenAIService implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: Partial<AIServiceConfig>): Promise<AIResponse> {
    const mergedConfig = { ...this.config, ...options };
    
    if (!mergedConfig.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mergedConfig.apiKey}`
        },
        body: JSON.stringify({
          model: mergedConfig.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: mergedConfig.maxTokens || 1000,
          temperature: mergedConfig.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        }
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateStructuredResponse<T>(prompt: string, schema: any, options?: Partial<AIServiceConfig>): Promise<T> {
    const response = await this.generateText(prompt, options);
    
    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      console.error('Failed to parse structured response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
}

// Service factory
let aiServiceInstance: AIService | null = null;

export function getAIService(config?: AIServiceConfig): AIService {
  if (aiServiceInstance) {
    return aiServiceInstance;
  }

  // Try to get configuration from environment variables
  const envConfig: AIServiceConfig = {
    provider: (process.env.AI_PROVIDER as any) || 'ollama', // Default to Ollama
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
    model: 'llama3.2:1b', // Use the installed model
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    baseUrl: 'http://localhost:11434' // Force localhost for now
  };

  const finalConfig = { ...envConfig, ...config };

  // Create appropriate service based on provider
  switch (finalConfig.provider) {
    case 'ollama':
      console.log('🦙 Using Ollama AI service with model:', finalConfig.model);
      aiServiceInstance = new OllamaService(finalConfig);
      break;
    case 'openai':
      if (finalConfig.apiKey) {
        aiServiceInstance = new OpenAIService(finalConfig);
      } else {
        console.warn('OpenAI API key not found, falling back to mock service');
        aiServiceInstance = new MockAIService(finalConfig);
      }
      break;
    case 'anthropic':
      // TODO: Implement Anthropic service
      console.warn('Anthropic service not implemented, falling back to mock service');
      aiServiceInstance = new MockAIService(finalConfig);
      break;
    case 'local':
    default:
      aiServiceInstance = new MockAIService(finalConfig);
      break;
  }

  return aiServiceInstance;
}

// Reset service instance (useful for testing)
export function resetAIService(): void {
  aiServiceInstance = null;
}

// Export types and default instance
export { AIService, AIServiceConfig, AIResponse };
export default getAIService();
