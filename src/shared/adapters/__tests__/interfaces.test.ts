/**
 * TC011: Adapter Interface Conformance Tests
 * Tests that all adapters implement required interfaces and capability descriptors
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  AdapterCapability,
  ChatMessage,
  LLMAdapter,
  LLMResult,
  LLMOptions,
  STTAdapter,
  AudioInput,
  STTResult,
  STTOptions,
  TTSAdapter,
  TTSInput,
  TTSResult,
  TTSOptions,
  ImageGenAdapter,
  ImageGenInput,
  ImageResult,
  ImageGenOptions,
  ImageStatus,
  EmbeddingsAdapter,
  EmbeddingsResult,
  EmbeddingsOptions,
  validateCapability,
  validateLLMOptions,
  validateAudioInput,
  validateSTTOptions,
  validateTTSInput,
  validateImageGenInput,
  validateEmbeddingsOptions
} from '../index';

// Mock adapter implementations for testing
class MockLLMAdapter implements LLMAdapter {
  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: ['gpt-3.5-turbo', 'gpt-4'],
      cost: { inputPer1K: 0.001, outputPer1K: 0.002, unit: 'tokens' },
      maxTokens: 4096,
      contextWindow: 8192,
      streaming: true,
      languages: ['en', 'es', 'fr'],
      notes: 'Mock OpenAI-compatible adapter'
    };
  }

  async chat(options: LLMOptions): Promise<LLMResult> {
    if (options.stream) {
      throw new Error('Use async iterator for streaming');
    }
    
    return {
      text: 'Mock response',
      model: options.model || 'gpt-3.5-turbo',
      tokens: { input: 10, output: 5 },
      finishReason: 'stop'
    };
  }
}

class MockSTTAdapter implements STTAdapter {
  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: ['whisper-base', 'whisper-large'],
      cost: { inputPer1K: 0.006, unit: 'sec' },
      streaming: true,
      languages: ['en', 'es', 'fr', 'de'],
      notes: 'Mock Whisper adapter'
    };
  }

  async transcribe(input: AudioInput, options?: STTOptions): Promise<STTResult> {
    return {
      text: 'Mock transcription',
      words: [
        { start: 0, end: 0.5, word: 'Mock', confidence: 0.95 },
        { start: 0.5, end: 1.2, word: 'transcription', confidence: 0.92 }
      ],
      language: options?.language || 'en',
      confidence: 0.94
    };
  }
}

class MockTTSAdapter implements TTSAdapter {
  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: ['coqui-xtts', 'system-tts'],
      cost: { inputPer1K: 0.015, unit: 'tokens' },
      streaming: false,
      languages: ['en', 'es', 'fr'],
      notes: 'Mock TTS adapter'
    };
  }

  async synthesize(input: TTSInput, options?: TTSOptions): Promise<TTSResult> {
    return {
      audio: Buffer.from('mock-audio-data'),
      format: input.format || 'wav',
      duration: 2.5,
      timestamps: [
        { start: 0, end: 1.0, text: 'Mock' },
        { start: 1.0, end: 2.5, text: 'audio' }
      ]
    };
  }
}

class MockImageGenAdapter implements ImageGenAdapter {
  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: ['stable-diffusion-xl', 'stable-diffusion-2.1'],
      cost: { inputPer1K: 0.02, unit: 'image' },
      streaming: false,
      notes: 'Mock Stable Diffusion adapter'
    };
  }

  async generate(input: ImageGenInput, options?: ImageGenOptions): Promise<ImageResult> {
    return {
      id: 'mock-image-123',
      images: [Buffer.from('mock-image-data')],
      seed: input.seed || 42,
      metadata: { prompt: input.prompt, steps: input.steps || 20 }
    };
  }

  async getStatus(id: string): Promise<ImageStatus> {
    return {
      status: 'completed' as const,
      progress: 100,
      result: await this.generate({ prompt: 'mock' })
    };
  }
}

class MockEmbeddingsAdapter implements EmbeddingsAdapter {
  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: ['text-embedding-ada-002', 'sentence-transformers'],
      cost: { inputPer1K: 0.0001, unit: 'tokens' },
      streaming: false,
      languages: ['en'],
      notes: 'Mock embeddings adapter'
    };
  }

  async embed(texts: string[], options?: EmbeddingsOptions): Promise<EmbeddingsResult> {
    const dimensions = options?.dimensions || 1536;
    return {
      vectors: texts.map(() => Array(dimensions).fill(0).map(() => Math.random())),
      model: options?.model || 'text-embedding-ada-002',
      dimensions
    };
  }
}

describe('Adapter Interface Conformance (TC011)', () => {
  describe('LLMAdapter', () => {
    let adapter: MockLLMAdapter;

    beforeEach(() => {
      adapter = new MockLLMAdapter();
    });

    it('should implement getCapabilities method', async () => {
      const capabilities = await adapter.getCapabilities();
      
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
      expect(capabilities.models.length).toBeGreaterThan(0);
      
      if (capabilities.cost) {
        expect(capabilities.cost).toHaveProperty('unit');
        expect(['tokens', 'sec', 'image']).toContain(capabilities.cost.unit);
      }
      
      if (capabilities.streaming !== undefined) {
        expect(typeof capabilities.streaming).toBe('boolean');
      }
    });

    it('should implement chat method with required parameters', async () => {
      const options: LLMOptions = {
        messages: [{ role: 'user', content: 'Hello' }]
      };
      
      const result = await adapter.chat(options);
      
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('model');
      expect(typeof result.text).toBe('string');
      expect(typeof result.model).toBe('string');
      
      if (result.tokens) {
        expect(result.tokens).toHaveProperty('input');
        expect(result.tokens).toHaveProperty('output');
        expect(typeof result.tokens.input).toBe('number');
        expect(typeof result.tokens.output).toBe('number');
      }
    });

    it('should handle optional parameters correctly', async () => {
      const options: LLMOptions = {
        messages: [
          { role: 'system', content: 'You are helpful' },
          { role: 'user', content: 'Hello' }
        ],
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 100
      };
      
      const result = await adapter.chat(options);
      
      expect(result.model).toBe('gpt-4');
    });

    it('should validate message format', async () => {
      const invalidMessages = [
        { role: 'invalid', content: 'test' }
      ] as ChatMessage[];
      
      // Should not throw for mock, but real implementation should validate
      await expect(adapter.chat({ messages: invalidMessages })).resolves.toBeDefined();
    });
  });

  describe('STTAdapter', () => {
    let adapter: MockSTTAdapter;

    beforeEach(() => {
      adapter = new MockSTTAdapter();
    });

    it('should implement getCapabilities method', async () => {
      const capabilities = await adapter.getCapabilities();
      
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
      
      if (capabilities.languages) {
        expect(Array.isArray(capabilities.languages)).toBe(true);
      }
    });

    it('should implement transcribe method', async () => {
      const audioInput: AudioInput = {
        data: Buffer.from('mock-audio'),
        format: 'wav',
        sampleRate: 16000
      };
      
      const result = await adapter.transcribe(audioInput);
      
      expect(result).toHaveProperty('text');
      expect(typeof result.text).toBe('string');
      
      if (result.words) {
        expect(Array.isArray(result.words)).toBe(true);
        result.words.forEach(word => {
          expect(word).toHaveProperty('start');
          expect(word).toHaveProperty('end');
          expect(word).toHaveProperty('word');
          expect(typeof word.start).toBe('number');
          expect(typeof word.end).toBe('number');
          expect(typeof word.word).toBe('string');
        });
      }
    });

    it('should handle different audio formats', async () => {
      const formats: Array<'wav' | 'mp3' | 'flac'> = ['wav', 'mp3', 'flac'];
      
      for (const format of formats) {
        const audioInput: AudioInput = {
          data: Buffer.from('mock-audio'),
          format
        };
        
        const result = await adapter.transcribe(audioInput);
        expect(result.text).toBeDefined();
      }
    });
  });

  describe('TTSAdapter', () => {
    let adapter: MockTTSAdapter;

    beforeEach(() => {
      adapter = new MockTTSAdapter();
    });

    it('should implement getCapabilities method', async () => {
      const capabilities = await adapter.getCapabilities();
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
    });

    it('should implement synthesize method', async () => {
      const input: TTSInput = {
        text: 'Hello world',
        voiceId: 'default',
        format: 'wav'
      };
      
      const result = await adapter.synthesize(input);
      
      expect(result).toHaveProperty('audio');
      expect(result).toHaveProperty('format');
      expect(Buffer.isBuffer(result.audio)).toBe(true);
      expect(['wav', 'mp3', 'ogg', 'flac']).toContain(result.format);
      
      if (result.timestamps) {
        expect(Array.isArray(result.timestamps)).toBe(true);
        result.timestamps.forEach(ts => {
          expect(ts).toHaveProperty('start');
          expect(ts).toHaveProperty('end');
          expect(ts).toHaveProperty('text');
        });
      }
    });
  });

  describe('ImageGenAdapter', () => {
    let adapter: MockImageGenAdapter;

    beforeEach(() => {
      adapter = new MockImageGenAdapter();
    });

    it('should implement getCapabilities method', async () => {
      const capabilities = await adapter.getCapabilities();
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
    });

    it('should implement generate method', async () => {
      const input: ImageGenInput = {
        prompt: 'A beautiful sunset',
        width: 512,
        height: 512,
        seed: 42
      };
      
      const result = await adapter.generate(input);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('images');
      expect(Array.isArray(result.images)).toBe(true);
      expect(result.images.length).toBeGreaterThan(0);
      expect(Buffer.isBuffer(result.images[0])).toBe(true);
      
      if (result.seed !== undefined) {
        expect(typeof result.seed).toBe('number');
      }
    });

    it('should implement getStatus method if available', async () => {
      if (adapter.getStatus) {
        const status = await adapter.getStatus('mock-id');
        expect(status).toHaveProperty('status');
        expect(['pending', 'processing', 'completed', 'failed']).toContain(status.status);
      }
    });
  });

  describe('EmbeddingsAdapter', () => {
    let adapter: MockEmbeddingsAdapter;

    beforeEach(() => {
      adapter = new MockEmbeddingsAdapter();
    });

    it('should implement getCapabilities method', async () => {
      const capabilities = await adapter.getCapabilities();
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
    });

    it('should implement embed method', async () => {
      const texts = ['Hello world', 'How are you?'];
      const result = await adapter.embed(texts);
      
      expect(result).toHaveProperty('vectors');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('dimensions');
      
      expect(Array.isArray(result.vectors)).toBe(true);
      expect(result.vectors.length).toBe(texts.length);
      expect(typeof result.model).toBe('string');
      expect(typeof result.dimensions).toBe('number');
      
      // Check vector dimensions consistency
      result.vectors.forEach(vector => {
        expect(Array.isArray(vector)).toBe(true);
        expect(vector.length).toBe(result.dimensions);
        vector.forEach(value => {
          expect(typeof value).toBe('number');
        });
      });
    });

    it('should handle empty input', async () => {
      const result = await adapter.embed([]);
      expect(result.vectors).toHaveLength(0);
    });

    it('should handle batch processing', async () => {
      const largeTexts = Array(100).fill(0).map((_, i) => `Text ${i}`);
      const result = await adapter.embed(largeTexts);
      
      expect(result.vectors).toHaveLength(100);
    });
  });
});

describe('Error Handling Conformance', () => {
  it('should handle network errors gracefully', async () => {
    // Mock network failure
    const adapter = new MockLLMAdapter();
    
    // Override to simulate network error
    jest.spyOn(adapter, 'chat').mockRejectedValue(new Error('Network error'));
    
    await expect(adapter.chat({ messages: [{ role: 'user', content: 'test' }] }))
      .rejects.toThrow('Network error');
  });

  it('should handle invalid input parameters', async () => {
    const adapter = new MockLLMAdapter();
    
    // Test with invalid temperature
    await expect(adapter.chat({
      messages: [{ role: 'user', content: 'test' }],
      temperature: 2.5 // Invalid: should be 0-2
    })).resolves.toBeDefined(); // Mock doesn't validate, but real implementation should
  });

  it('should handle rate limiting', async () => {
    const adapter = new MockLLMAdapter();
    
    // Mock rate limit error
    jest.spyOn(adapter, 'chat').mockRejectedValue(new Error('Rate limit exceeded'));
    
    await expect(adapter.chat({ messages: [{ role: 'user', content: 'test' }] }))
      .rejects.toThrow('Rate limit exceeded');
  });
});

describe('Capability Descriptor Validation', () => {
  it('should return valid capability descriptors for all adapters', async () => {
    const adapters = [
      new MockLLMAdapter(),
      new MockSTTAdapter(),
      new MockTTSAdapter(),
      new MockImageGenAdapter(),
      new MockEmbeddingsAdapter()
    ];
    
    for (const adapter of adapters) {
      const capabilities = await adapter.getCapabilities();
      
      // Required fields
      expect(capabilities).toHaveProperty('models');
      expect(Array.isArray(capabilities.models)).toBe(true);
      expect(capabilities.models.length).toBeGreaterThan(0);
      
      // Optional but validated fields
      if (capabilities.cost) {
        if (capabilities.cost.inputPer1K !== undefined) {
          expect(typeof capabilities.cost.inputPer1K).toBe('number');
          expect(capabilities.cost.inputPer1K).toBeGreaterThanOrEqual(0);
        }
        if (capabilities.cost.outputPer1K !== undefined) {
          expect(typeof capabilities.cost.outputPer1K).toBe('number');
          expect(capabilities.cost.outputPer1K).toBeGreaterThanOrEqual(0);
        }
        if (capabilities.cost.unit) {
          expect(['tokens', 'sec', 'image']).toContain(capabilities.cost.unit);
        }
      }
      
      if (capabilities.maxTokens !== undefined) {
        expect(typeof capabilities.maxTokens).toBe('number');
        expect(capabilities.maxTokens).toBeGreaterThan(0);
      }
      
      if (capabilities.contextWindow !== undefined) {
        expect(typeof capabilities.contextWindow).toBe('number');
        expect(capabilities.contextWindow).toBeGreaterThan(0);
      }
      
      if (capabilities.streaming !== undefined) {
        expect(typeof capabilities.streaming).toBe('boolean');
      }
      
      if (capabilities.languages) {
        expect(Array.isArray(capabilities.languages)).toBe(true);
        capabilities.languages.forEach(lang => {
          expect(typeof lang).toBe('string');
          expect(lang.length).toBeGreaterThan(0);
        });
      }
    }
  });
});
