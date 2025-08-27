/**
 * AI Service (JavaScript version)
 * Provides AI functionality for various game systems
 */

class MockAIService {
  constructor(config = { provider: 'local' }) {
    this.config = config;
  }

  async generateText(prompt, options = {}) {
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

  async generateStructuredResponse(prompt, schema, options = {}) {
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

    return mockStructuredResponse;
  }

  isAvailable() {
    return true; // Mock service is always available
  }
}

class OpenAIService {
  constructor(config) {
    this.config = config;
  }

  async generateText(prompt, options = {}) {
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

  async generateStructuredResponse(prompt, schema, options = {}) {
    const response = await this.generateText(prompt, options);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse structured response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  isAvailable() {
    return !!this.config.apiKey;
  }
}

// Service factory
let aiServiceInstance = null;

export function getAIService(config = {}) {
  if (aiServiceInstance) {
    return aiServiceInstance;
  }

  // Try to get configuration from environment variables
  const envConfig = {
    provider: process.env.AI_PROVIDER || 'local',
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7')
  };

  const finalConfig = { ...envConfig, ...config };

  // Create appropriate service based on provider
  switch (finalConfig.provider) {
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
export function resetAIService() {
  aiServiceInstance = null;
}

// Export default instance
export default getAIService();

