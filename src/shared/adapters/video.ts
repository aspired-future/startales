/**
 * Video Generation Adapter Interface and Types (Feature Flagged)
 */

import { z } from 'zod';
import { BaseAdapter, AdapterError, AdapterErrorCode } from './base';

// Video Generation Types
export interface VideoGenInput {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  seed?: number;
  style?: Record<string, any>;
}

export interface VideoGenOptions {
  model?: string;
  quality?: 'standard' | 'hd' | '4k';
  format?: 'mp4' | 'webm' | 'avi';
}

export interface VideoResult {
  id: string;
  video: Buffer;
  thumbnail?: Buffer;
  duration?: number;
  fps?: number;
  metadata?: {
    prompt?: string;
    model?: string;
    width?: number;
    height?: number;
    duration?: number;
    fps?: number;
  };
}

export interface VideoStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: VideoResult;
  error?: string;
  estimatedTime?: number;
}

// Video Generation Adapter Interface (Feature Flagged)
export interface VideoGenAdapter extends BaseAdapter {
  generate(input: VideoGenInput, options?: VideoGenOptions): Promise<VideoResult>;
  getStatus?(id: string): Promise<VideoStatus>;
}

// Feature Flag Check
export function isVideoGenerationEnabled(): boolean {
  return process.env.FEATURE_VIDEO_GENERATION === 'true' || 
         process.env.VIDEO_GEN_ENABLED === 'true';
}

// Placeholder Video Adapter (Used when feature is disabled)
export class PlaceholderVideoAdapter implements VideoGenAdapter {
  async getCapabilities() {
    return {
      models: ['placeholder'],
      notes: 'Video generation is disabled by feature flag'
    };
  }

  async generate(input: VideoGenInput, options?: VideoGenOptions): Promise<VideoResult> {
    throw new AdapterError(
      AdapterErrorCode.UNAVAILABLE,
      'Video generation is disabled by feature flag. Set FEATURE_VIDEO_GENERATION=true to enable.',
      'placeholder-video'
    );
  }

  async getStatus(id: string): Promise<VideoStatus> {
    throw new AdapterError(
      AdapterErrorCode.UNAVAILABLE,
      'Video generation is disabled by feature flag. Set FEATURE_VIDEO_GENERATION=true to enable.',
      'placeholder-video'
    );
  }
}

// Zod Schemas
export const VideoGenInputSchema = z.object({
  prompt: z.string().min(1),
  negativePrompt: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  fps: z.number().positive().optional(),
  seed: z.number().int().optional(),
  style: z.record(z.any()).optional()
});

export const VideoGenOptionsSchema = z.object({
  model: z.string().optional(),
  quality: z.enum(['standard', 'hd', '4k']).optional(),
  format: z.enum(['mp4', 'webm', 'avi']).optional()
});

// Type Guards
export function isVideoGenAdapter(adapter: BaseAdapter): adapter is VideoGenAdapter {
  return 'generate' in adapter && typeof adapter.generate === 'function';
}

// Validation Functions
export function validateVideoGenInput(input: unknown): VideoGenInput {
  return VideoGenInputSchema.parse(input);
}

export function validateVideoGenOptions(options: unknown): VideoGenOptions {
  return VideoGenOptionsSchema.parse(options);
}
