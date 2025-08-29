/**
 * Image Generation Adapter Interface and Types
 */

import { z } from 'zod';
import { BaseAdapter } from './base';

// Image Generation Types
export interface ImageGenInput {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  style?: Record<string, any>;
  seed?: number;
  steps?: number;
  guidance?: number;
  scheduler?: string;
}

export interface ImageGenOptions {
  model?: string;
  quality?: 'standard' | 'hd';
  responseFormat?: 'url' | 'b64_json';
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  user?: string;
}

export interface ImageResult {
  id: string;
  images: Buffer[];
  seed?: number;
  metadata?: {
    prompt?: string;
    negativePrompt?: string;
    model?: string;
    steps?: number;
    guidance?: number;
    scheduler?: string;
    width?: number;
    height?: number;
  };
  revisedPrompt?: string;
}

export interface ImageStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: ImageResult;
  error?: string;
  estimatedTime?: number;
}

// Image Generation Adapter Interface
export interface ImageGenAdapter extends BaseAdapter {
  generate(input: ImageGenInput, options?: ImageGenOptions): Promise<ImageResult>;
  getStatus?(id: string): Promise<ImageStatus>;
}

// Zod Schemas
export const ImageGenInputSchema = z.object({
  prompt: z.string().min(1),
  negativePrompt: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  style: z.record(z.any()).optional(),
  seed: z.number().int().optional(),
  steps: z.number().positive().optional(),
  guidance: z.number().positive().optional(),
  scheduler: z.string().optional()
});

export const ImageGenOptionsSchema = z.object({
  model: z.string().optional(),
  quality: z.enum(['standard', 'hd']).optional(),
  responseFormat: z.enum(['url', 'b64_json']).optional(),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional(),
  user: z.string().optional()
});

// Type Guards
export function isImageGenAdapter(adapter: BaseAdapter): adapter is ImageGenAdapter {
  return 'generate' in adapter && typeof adapter.generate === 'function';
}

// Validation Functions
export function validateImageGenInput(input: unknown): ImageGenInput {
  return ImageGenInputSchema.parse(input);
}

export function validateImageGenOptions(options: unknown): ImageGenOptions {
  return ImageGenOptionsSchema.parse(options);
}
