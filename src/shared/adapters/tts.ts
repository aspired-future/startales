/**
 * TTS (Text-to-Speech) Adapter Interface and Types
 */

import { z } from 'zod';
import { BaseAdapter } from './base.js';

// TTS Types
export interface TTSInput {
  text: string;
  voiceId?: string;
  rate?: number;
  volume?: number;
  format?: 'wav' | 'mp3' | 'ogg' | 'flac';
  sampleRate?: number;
}

export interface TTSOptions {
  model?: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
  style?: string;
}

export interface TTSResult {
  audio: Buffer;
  format: 'wav' | 'mp3' | 'ogg' | 'flac';
  duration?: number;
  sampleRate?: number;
  channels?: number;
  timestamps?: Array<{
    start: number;
    end: number;
    text: string;
    phoneme?: string;
  }>;
  metadata?: {
    voiceId?: string;
    model?: string;
    speed?: number;
    pitch?: number;
  };
}

export interface TTSAudioChunk {
  audio: Buffer;
  done: boolean;
  timestamps?: Array<{
    start: number;
    end: number;
    text: string;
    phoneme?: string;
  }>;
}

// TTS Adapter Interface
export interface TTSAdapter extends BaseAdapter {
  synthesize(input: TTSInput, options?: TTSOptions): Promise<TTSResult>;
  streamSynthesize?(input: TTSInput, options?: TTSOptions): AsyncIterable<TTSAudioChunk>;
}

// Zod Schemas
export const TTSInputSchema = z.object({
  text: z.string().min(1),
  voiceId: z.string().optional(),
  rate: z.number().min(0.25).max(4.0).optional(),
  volume: z.number().min(0).max(1).optional(),
  format: z.enum(['wav', 'mp3', 'ogg', 'flac']).optional(),
  sampleRate: z.number().positive().optional()
});

export const TTSOptionsSchema = z.object({
  model: z.string().optional(),
  speed: z.number().min(0.25).max(4.0).optional(),
  pitch: z.number().min(-20).max(20).optional(),
  emotion: z.string().optional(),
  style: z.string().optional()
});

// Type Guards
export function isTTSAdapter(adapter: BaseAdapter): adapter is TTSAdapter {
  return 'synthesize' in adapter && typeof adapter.synthesize === 'function';
}

// Validation Functions
export function validateTTSInput(input: unknown): TTSInput {
  return TTSInputSchema.parse(input);
}

export function validateTTSOptions(options: unknown): TTSOptions {
  return TTSOptionsSchema.parse(options);
}
