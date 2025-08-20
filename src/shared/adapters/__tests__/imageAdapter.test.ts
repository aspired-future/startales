/**
 * Unit tests for Image Generation Adapter implementations (TC013)
 * Tests DALL-E, Midjourney, and local image generation providers
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OpenAIImageProvider } from '../providers/openaiImage';
import { StableDiffusionProvider } from '../providers/stableDiffusion';
import { ImageProvider, ImageRequest, ImageResponse } from '../types';

// Mock HTTP client
const mockHttpClient = {
  post: vi.fn(),
  get: vi.fn(),
  upload: vi.fn()
};

vi.mock('../utils/httpClient', () => ({
  createHttpClient: () => mockHttpClient
}));

describe('Image Generation Adapters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OpenAI DALL-E Provider (TC013)', () => {
    let provider: OpenAIImageProvider;

    beforeEach(() => {
      provider = new OpenAIImageProvider({
        apiKey: 'test-api-key',
        model: 'dall-e-3',
        baseURL: 'https://api.openai.com/v1'
      });
    });

    it('should generate images with proper request format', async () => {
      const mockResponse = {
        data: [{
          url: 'https://example.com/generated-image.png',
          revised_prompt: 'Enhanced prompt description'
        }]
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateImage('A beautiful landscape', {
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/images/generations', {
        model: 'dall-e-3',
        prompt: 'A beautiful landscape',
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
        n: 1
      });

      expect(result).toEqual({
        images: [{
          url: 'https://example.com/generated-image.png',
          prompt: 'Enhanced prompt description'
        }],
        provider: 'openai-image',
        usage: { requests: 1 }
      });
    });

    it('should generate multiple images', async () => {
      const mockResponse = {
        data: [
          { url: 'https://example.com/image1.png' },
          { url: 'https://example.com/image2.png' }
        ]
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateImage('Test prompt', {
        count: 2,
        size: '512x512'
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/images/generations', {
        model: 'dall-e-3',
        prompt: 'Test prompt',
        size: '512x512',
        n: 2
      });

      expect(result.images).toHaveLength(2);
    });

    it('should handle image variations', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const mockResponse = {
        data: [{
          url: 'https://example.com/variation.png'
        }]
      };

      mockHttpClient.upload.mockResolvedValue({ data: mockResponse });

      const result = await provider.createVariation(mockImageBuffer, {
        count: 1,
        size: '1024x1024'
      });

      expect(mockHttpClient.upload).toHaveBeenCalledWith('/images/variations', {
        image: mockImageBuffer,
        n: 1,
        size: '1024x1024'
      });

      expect(result).toEqual({
        images: [{
          url: 'https://example.com/variation.png'
        }],
        provider: 'openai-image',
        usage: { requests: 1 }
      });
    });

    it('should handle image editing', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const mockMaskBuffer = Buffer.from('fake-mask-data');
      const mockResponse = {
        data: [{
          url: 'https://example.com/edited.png'
        }]
      };

      mockHttpClient.upload.mockResolvedValue({ data: mockResponse });

      const result = await provider.editImage(
        mockImageBuffer,
        'Add a sunset in the background',
        {
          mask: mockMaskBuffer,
          size: '1024x1024'
        }
      );

      expect(mockHttpClient.upload).toHaveBeenCalledWith('/images/edits', {
        image: mockImageBuffer,
        mask: mockMaskBuffer,
        prompt: 'Add a sunset in the background',
        n: 1,
        size: '1024x1024'
      });

      expect(result.images).toHaveLength(1);
    });

    it('should handle API errors', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Content policy violation'));

      await expect(provider.generateImage('Inappropriate content'))
        .rejects.toThrow('Content policy violation');
    });
  });

  describe('Stable Diffusion Provider (TC013)', () => {
    let provider: StableDiffusionProvider;

    beforeEach(() => {
      provider = new StableDiffusionProvider({
        baseURL: 'http://localhost:7860',
        model: 'stable-diffusion-xl-base-1.0'
      });
    });

    it('should generate images with Stable Diffusion format', async () => {
      const mockResponse = {
        images: ['base64-encoded-image-data'],
        parameters: {
          prompt: 'A beautiful landscape',
          steps: 20,
          cfg_scale: 7.5
        },
        info: '{"seed": 12345}'
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.generateImage('A beautiful landscape', {
        width: 1024,
        height: 1024,
        steps: 20,
        cfgScale: 7.5,
        seed: 12345
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/sdapi/v1/txt2img', {
        prompt: 'A beautiful landscape',
        width: 1024,
        height: 1024,
        steps: 20,
        cfg_scale: 7.5,
        seed: 12345,
        batch_size: 1
      });

      expect(result).toEqual({
        images: [{
          data: 'base64-encoded-image-data',
          seed: 12345
        }],
        provider: 'stable-diffusion',
        usage: { requests: 1 }
      });
    });

    it('should handle img2img generation', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const mockResponse = {
        images: ['base64-result'],
        parameters: {
          prompt: 'Transform this image',
          denoising_strength: 0.7
        }
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      const result = await provider.img2img(
        mockImageBuffer,
        'Transform this image',
        {
          denoisingStrength: 0.7,
          steps: 15
        }
      );

      expect(mockHttpClient.post).toHaveBeenCalledWith('/sdapi/v1/img2img', {
        init_images: [mockImageBuffer.toString('base64')],
        prompt: 'Transform this image',
        denoising_strength: 0.7,
        steps: 15,
        batch_size: 1
      });

      expect(result.images).toHaveLength(1);
    });

    it('should get available models', async () => {
      const mockResponse = [
        { title: 'stable-diffusion-xl-base-1.0', model_name: 'sdxl_base' },
        { title: 'stable-diffusion-v1-5', model_name: 'sd15' }
      ];

      mockHttpClient.get.mockResolvedValue({ data: mockResponse });

      const models = await provider.getAvailableModels();

      expect(models).toEqual([
        { name: 'stable-diffusion-xl-base-1.0', id: 'sdxl_base' },
        { name: 'stable-diffusion-v1-5', id: 'sd15' }
      ]);
    });

    it('should switch models', async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      await provider.switchModel('stable-diffusion-v1-5');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/sdapi/v1/options', {
        sd_model_checkpoint: 'stable-diffusion-v1-5'
      });
    });

    it('should handle progress tracking', async () => {
      const mockProgressResponse = {
        progress: 0.5,
        eta_relative: 30.5,
        state: {
          job_count: 1,
          job_no: 0,
          sampling_step: 10,
          sampling_steps: 20
        }
      };

      mockHttpClient.get.mockResolvedValue({ data: mockProgressResponse });

      const progress = await provider.getProgress();

      expect(progress).toEqual({
        progress: 0.5,
        eta: 30.5,
        step: 10,
        totalSteps: 20,
        status: 'generating'
      });
    });
  });

  describe('Provider Interface Compliance (TC013)', () => {
    const providers: ImageProvider[] = [
      new OpenAIImageProvider({ apiKey: 'test', model: 'dall-e-3' }),
      new StableDiffusionProvider({ model: 'stable-diffusion-xl-base-1.0' })
    ];

    providers.forEach(provider => {
      describe(`${provider.name} Interface Compliance`, () => {
        it('should implement required properties', () => {
          expect(provider).toHaveProperty('name');
          expect(provider).toHaveProperty('type', 'image');
          expect(typeof provider.name).toBe('string');
        });

        it('should implement required methods', () => {
          expect(typeof provider.generateImage).toBe('function');
          expect(typeof provider.healthCheck).toBe('function');
        });

        it('should return proper response format from generateImage', async () => {
          // Mock the HTTP client for this test
          mockHttpClient.post.mockResolvedValue({
            data: provider.name === 'openai-image'
              ? { data: [{ url: 'https://example.com/test.png' }] }
              : { images: ['base64-data'], info: '{}' }
          });

          const result = await provider.generateImage('test prompt');
          
          expect(result).toHaveProperty('images');
          expect(result).toHaveProperty('provider');
          expect(result).toHaveProperty('usage');
          expect(Array.isArray(result.images)).toBe(true);
          expect(result.images.length).toBeGreaterThan(0);
        });

        it('should perform health checks', async () => {
          mockHttpClient.get.mockResolvedValue({ status: 200 });

          const health = await provider.healthCheck();

          expect(health).toHaveProperty('healthy');
          expect(health).toHaveProperty('latency');
          expect(typeof health.healthy).toBe('boolean');
          expect(typeof health.latency).toBe('number');
        });
      });
    });
  });

  describe('Image Processing Utilities (TC013)', () => {
    it('should validate image dimensions', () => {
      const validSizes = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'];
      const invalidSizes = ['100x100', '2048x2048', '512x1024'];

      validSizes.forEach(size => {
        expect(() => provider.validateImageSize(size)).not.toThrow();
      });

      invalidSizes.forEach(size => {
        expect(() => provider.validateImageSize(size)).toThrow();
      });
    });

    it('should convert between image formats', async () => {
      const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const buffer = Buffer.from(base64Data, 'base64');

      const convertedBase64 = provider.bufferToBase64(buffer);
      expect(convertedBase64).toBe(base64Data);

      const convertedBuffer = provider.base64ToBuffer(base64Data);
      expect(convertedBuffer).toEqual(buffer);
    });

    it('should generate image metadata', () => {
      const metadata = provider.generateMetadata({
        prompt: 'A test image',
        model: 'dall-e-3',
        size: '1024x1024',
        seed: 12345
      });

      expect(metadata).toEqual({
        prompt: 'A test image',
        model: 'dall-e-3',
        dimensions: { width: 1024, height: 1024 },
        seed: 12345,
        generatedAt: expect.any(Date),
        provider: expect.any(String)
      });
    });
  });

  describe('Caching and Optimization (TC013)', () => {
    it('should cache generated images', async () => {
      const provider = new OpenAIImageProvider({ 
        apiKey: 'test', 
        model: 'dall-e-3',
        enableCache: true 
      });

      const mockResponse = {
        data: [{ url: 'https://example.com/cached.png' }]
      };

      mockHttpClient.post.mockResolvedValue({ data: mockResponse });

      // First request
      const result1 = await provider.generateImage('Cached prompt');
      
      // Second request with same prompt should use cache
      const result2 = await provider.generateImage('Cached prompt');

      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should handle cache misses', async () => {
      const provider = new OpenAIImageProvider({ 
        apiKey: 'test', 
        model: 'dall-e-3',
        enableCache: true 
      });

      mockHttpClient.post
        .mockResolvedValueOnce({ data: { data: [{ url: 'image1.png' }] } })
        .mockResolvedValueOnce({ data: { data: [{ url: 'image2.png' }] } });

      const result1 = await provider.generateImage('Prompt 1');
      const result2 = await provider.generateImage('Prompt 2');

      expect(mockHttpClient.post).toHaveBeenCalledTimes(2);
      expect(result1.images[0].url).toBe('image1.png');
      expect(result2.images[0].url).toBe('image2.png');
    });

    it('should respect cache TTL', async () => {
      const provider = new OpenAIImageProvider({ 
        apiKey: 'test', 
        model: 'dall-e-3',
        enableCache: true,
        cacheTTL: 100 // 100ms
      });

      mockHttpClient.post.mockResolvedValue({ 
        data: { data: [{ url: 'https://example.com/ttl.png' }] } 
      });

      await provider.generateImage('TTL test');
      
      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      
      await provider.generateImage('TTL test');

      expect(mockHttpClient.post).toHaveBeenCalledTimes(2);
    });
  });
});
