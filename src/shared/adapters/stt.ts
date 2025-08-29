/**
 * STT (Speech-to-Text) Adapter Interface and Types
 */

import { z } from 'zod';
import { BaseAdapter } from './base';

// STT Types
export interface AudioInput {
  data: Buffer;
  format: 'wav' | 'mp3' | 'flac' | 'ogg' | 'm4a';
  sampleRate?: number;
  channels?: number;
  duration?: number;
}

export interface STTOptions {
  language?: string;
  model?: string;
  temperature?: number;
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  timestampGranularities?: ('word' | 'segment')[];
}

export interface STTResult {
  text: string;
  words?: Array<{
    start: number;
    end: number;
    word: string;
    confidence?: number;
  }>;
  segments?: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    tokens?: number[];
    temperature?: number;
    avgLogprob?: number;
    compressionRatio?: number;
    noSpeechProb?: number;
  }>;
  language?: string;
  confidence?: number;
  duration?: number;
}

export interface STTDelta {
  text: string;
  done: boolean;
  words?: Array<{
    start: number;
    end: number;
    word: string;
    confidence?: number;
  }>;
  language?: string;
}

// STT Adapter Interface
export interface STTAdapter extends BaseAdapter {
  transcribe(input: AudioInput, options?: STTOptions): Promise<STTResult>;
  streamTranscribe?(inputStream: AsyncIterable<Buffer>, options?: STTOptions): AsyncIterable<STTDelta>;
}

// Zod Schemas
export const AudioInputSchema = z.object({
  data: z.instanceof(Buffer),
  format: z.enum(['wav', 'mp3', 'flac', 'ogg', 'm4a']),
  sampleRate: z.number().positive().optional(),
  channels: z.number().positive().optional(),
  duration: z.number().positive().optional()
});

export const STTOptionsSchema = z.object({
  language: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  prompt: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'verbose_json', 'vtt']).optional(),
  timestampGranularities: z.array(z.enum(['word', 'segment'])).optional()
});

// Type Guards
export function isSTTAdapter(adapter: BaseAdapter): adapter is STTAdapter {
  return 'transcribe' in adapter && typeof adapter.transcribe === 'function';
}

// Validation Functions
export function validateAudioInput(input: unknown): AudioInput {
  return AudioInputSchema.parse(input);
}

export function validateSTTOptions(options: unknown): STTOptions {
  return STTOptionsSchema.parse(options);
}
