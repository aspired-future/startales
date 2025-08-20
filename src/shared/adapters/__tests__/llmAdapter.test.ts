/**
 * Unit tests for LLM Adapter implementations (TC012)
 * Tests OpenAI, Anthropic, and local LLM providers
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OpenAILLMProvider } from '../providers/openai';
import { AnthropicLLMProvider } from '../providers/anthropic';
import { OllamaLLMProvider } from '../providers/ollama';
import { LLMProvider, LLMRequest, LLMResponse } from '../types';

// Mock HTTP client
const mockHttpClient = {
  post: vi.fn(),
  get: vi.fn(),
  stream: vi.fn()
};

vi.mock('../utils/httpClient', () => ({
  createHttpClient: () => mockHttpClient
}));

describe('LLM Adapters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OpenAI LLM Provider (TC012)', () => {
    let provider: OpenAILLMProvider;

    beforeEach(() => {
      provider = new OpenAILLMProvider({
        apiKey: 'test-api-key',
        model: 'gpt-4',
        baseURL: 'https://api.openai.com/v1'
      });
    });

    it('should generate text with proper request format', async () => {
      const mockResponse = {
        choices: [{
          message: { content: 'Generated response' }
        }],
        usage: { total_tokens: 150 }
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateText('Test prompt', {
        maxTokens: 100,
        temperature: 0.7
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/chat/completions', {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Test prompt' }],
        max_tokens: 100,
        temperature: 0.7
      });

      expect(result).toEqual({
        text: 'Generated response',
        usage: { tokens: 150 },
        provider: 'openai'
      });
    });

    it('should handle streaming responses', async () => {
      const mockStreamData = [
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
        'data: [DONE]\n\n'
      ];

      mockHttpClient.stream.mockImplementation(async function* () {
        for (const chunk of mockStreamData) {
          yield chunk;
        }
      });

      const stream = provider.streamText('Test prompt');
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        { text: 'Hello', done: false },
        { text: ' world', done: false },
        { text: '', done: true }
      ]);
    });

    it('should handle function calling', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: null,
            function_call: {
              name: 'get_weather',
              arguments: '{"location": "San Francisco"}'
            }
          }
        }],
        usage: { total_tokens: 120 }
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateText('What\'s the weather?', {
        functions: [{
          name: 'get_weather',
          description: 'Get weather for a location',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string' }
            }
          }
        }]
      });

      expect(result).toEqual({
        text: null,
        functionCall: {
          name: 'get_weather',
          arguments: { location: 'San Francisco' }
        },
        usage: { tokens: 120 },
        provider: 'openai'
      });
    });

    it('should handle API errors gracefully', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('API rate limit exceeded'));

      await expect(provider.generateText('Test prompt'))
        .rejects.toThrow('API rate limit exceeded');
    });

    it('should perform health checks', async () => {
      mockHttpClient.get.mockResolvedValue({ 
        data: { object: 'list', data: [] },
        status: 200 
      });

      const health = await provider.healthCheck();

      expect(health.healthy).toBe(true);
      expect(health.latency).toBeGreaterThan(0);
    });
  });

  describe('Anthropic LLM Provider (TC012)', () => {
    let provider: AnthropicLLMProvider;

    beforeEach(() => {
      provider = new AnthropicLLMProvider({
        apiKey: 'test-api-key',
        model: 'claude-3-sonnet-20240229',
        baseURL: 'https://api.anthropic.com'
      });
    });

    it('should generate text with Anthropic format', async () => {
      const mockResponse = {
        content: [{ text: 'Claude response' }],
        usage: { input_tokens: 50, output_tokens: 100 }
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateText('Test prompt', {
        maxTokens: 200,
        temperature: 0.5
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/v1/messages', {
        model: 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: 'Test prompt' }],
        max_tokens: 200,
        temperature: 0.5
      });

      expect(result).toEqual({
        text: 'Claude response',
        usage: { tokens: 150 }, // input + output tokens
        provider: 'anthropic'
      });
    });

    it('should handle streaming with Anthropic format', async () => {
      const mockStreamData = [
        'data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\n',
        'data: {"type":"content_block_delta","delta":{"text":" Claude"}}\n\n',
        'data: {"type":"message_stop"}\n\n'
      ];

      mockHttpClient.stream.mockImplementation(async function* () {
        for (const chunk of mockStreamData) {
          yield chunk;
        }
      });

      const stream = provider.streamText('Test prompt');
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        { text: 'Hello', done: false },
        { text: ' Claude', done: false },
        { text: '', done: true }
      ]);
    });

    it('should handle tool use', async () => {
      const mockResponse = {
        content: [{
          type: 'tool_use',
          id: 'tool_123',
          name: 'search_web',
          input: { query: 'latest news' }
        }],
        usage: { input_tokens: 60, output_tokens: 80 }
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateText('Search for news', {
        tools: [{
          name: 'search_web',
          description: 'Search the web',
          input_schema: {
            type: 'object',
            properties: {
              query: { type: 'string' }
            }
          }
        }]
      });

      expect(result).toEqual({
        text: null,
        toolUse: {
          id: 'tool_123',
          name: 'search_web',
          input: { query: 'latest news' }
        },
        usage: { tokens: 140 },
        provider: 'anthropic'
      });
    });
  });

  describe('Ollama LLM Provider (TC012)', () => {
    let provider: OllamaLLMProvider;

    beforeEach(() => {
      provider = new OllamaLLMProvider({
        baseURL: 'http://localhost:11434',
        model: 'llama3.1:8b'
      });
    });

    it('should generate text with Ollama format', async () => {
      const mockResponse = {
        response: 'Ollama response',
        done: true,
        context: [1, 2, 3],
        total_duration: 1000000000,
        prompt_eval_count: 50,
        eval_count: 100
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateText('Test prompt', {
        temperature: 0.8,
        top_p: 0.9
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/generate', {
        model: 'llama3.1:8b',
        prompt: 'Test prompt',
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9
        }
      });

      expect(result).toEqual({
        text: 'Ollama response',
        usage: { tokens: 150 }, // prompt_eval_count + eval_count
        provider: 'ollama',
        context: [1, 2, 3]
      });
    });

    it('should handle streaming responses', async () => {
      const mockStreamData = [
        '{"response":"Hello","done":false}\n',
        '{"response":" Ollama","done":false}\n',
        '{"response":"","done":true}\n'
      ];

      mockHttpClient.stream.mockImplementation(async function* () {
        for (const chunk of mockStreamData) {
          yield chunk;
        }
      });

      const stream = provider.streamText('Test prompt');
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        { text: 'Hello', done: false },
        { text: ' Ollama', done: false },
        { text: '', done: true }
      ]);
    });

    it('should check if model is available', async () => {
      mockHttpClient.get.mockResolvedValue({
        data: {
          models: [
            { name: 'llama3.1:8b', size: 4661224676 },
            { name: 'codellama:7b', size: 3825819519 }
          ]
        }
      });

      const isAvailable = await provider.isModelAvailable('llama3.1:8b');
      expect(isAvailable).toBe(true);

      const isNotAvailable = await provider.isModelAvailable('nonexistent:model');
      expect(isNotAvailable).toBe(false);
    });

    it('should pull model if not available', async () => {
      mockHttpClient.post.mockResolvedValue({ data: { status: 'success' } });

      await provider.pullModel('llama3.1:8b');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/pull', {
        name: 'llama3.1:8b'
      });
    });
  });

  describe('Provider Interface Compliance (TC012)', () => {
    const providers: LLMProvider[] = [
      new OpenAILLMProvider({ apiKey: 'test', model: 'gpt-4' }),
      new AnthropicLLMProvider({ apiKey: 'test', model: 'claude-3-sonnet' }),
      new OllamaLLMProvider({ model: 'llama3.1:8b' })
    ];

    providers.forEach(provider => {
      describe(`${provider.name} Interface Compliance`, () => {
        it('should implement required properties', () => {
          expect(provider).toHaveProperty('name');
          expect(provider).toHaveProperty('type', 'llm');
          expect(typeof provider.name).toBe('string');
        });

        it('should implement required methods', () => {
          expect(typeof provider.generateText).toBe('function');
          expect(typeof provider.streamText).toBe('function');
          expect(typeof provider.healthCheck).toBe('function');
        });

        it('should return proper response format from generateText', async () => {
          // Mock the HTTP client for this test
          mockHttpClient.post.mockResolvedValue({
            data: provider.name === 'openai' 
              ? { choices: [{ message: { content: 'test' } }], usage: { total_tokens: 10 } }
              : provider.name === 'anthropic'
              ? { content: [{ text: 'test' }], usage: { input_tokens: 5, output_tokens: 5 } }
              : { response: 'test', done: true, prompt_eval_count: 5, eval_count: 5 }
          });

          const result = await provider.generateText('test');
          
          expect(result).toHaveProperty('text');
          expect(result).toHaveProperty('usage');
          expect(result).toHaveProperty('provider');
          expect(typeof result.text).toBe('string');
          expect(typeof result.usage.tokens).toBe('number');
        });
      });
    });
  });
});
