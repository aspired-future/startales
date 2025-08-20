/**
 * Provider Adapter Framework - Main Export
 * Exports all adapter interfaces, types, and utilities
 */

// Base types and utilities
export * from './base.js';

// Error normalization and utilities
export * from './errors.js';

// Metrics interfaces and utilities
export * from './metrics.js';

// LLM adapter
export * from './llm.js';

// STT adapter
export * from './stt.js';

// TTS adapter
export * from './tts.js';

// Image generation adapter
export * from './image.js';

// Video generation adapter (feature flagged)
export * from './video.js';

// Embeddings adapter
export * from './embeddings.js';

// Re-export commonly used types for convenience
export type {
  BaseAdapter,
  AdapterCapability,
  AdapterErrorCode
} from './base.js';

export type {
  LLMAdapter,
  ChatMessage,
  LLMOptions,
  LLMResult,
  LLMDelta
} from './llm.js';

export type {
  STTAdapter,
  AudioInput,
  STTOptions,
  STTResult,
  STTDelta
} from './stt.js';

export type {
  TTSAdapter,
  TTSInput,
  TTSOptions,
  TTSResult,
  TTSAudioChunk
} from './tts.js';

export type {
  ImageGenAdapter,
  ImageGenInput,
  ImageGenOptions,
  ImageResult,
  ImageStatus
} from './image.js';

export type {
  VideoGenAdapter,
  VideoGenInput,
  VideoGenOptions,
  VideoResult,
  VideoStatus
} from './video.js';

export type {
  EmbeddingsAdapter,
  EmbeddingsOptions,
  EmbeddingsResult
} from './embeddings.js';

// Adapter type union
export type AnyAdapter = 
  | LLMAdapter 
  | STTAdapter 
  | TTSAdapter 
  | ImageGenAdapter 
  | VideoGenAdapter 
  | EmbeddingsAdapter;

// Adapter type enum
export enum AdapterType {
  LLM = 'llm',
  STT = 'stt',
  TTS = 'tts',
  IMAGE = 'image',
  VIDEO = 'video',
  EMBEDDINGS = 'embeddings'
}

// Utility function to get adapter type
export function getAdapterType(adapter: BaseAdapter): AdapterType | null {
  if (isLLMAdapter(adapter)) return AdapterType.LLM;
  if (isSTTAdapter(adapter)) return AdapterType.STT;
  if (isTTSAdapter(adapter)) return AdapterType.TTS;
  if (isImageGenAdapter(adapter)) return AdapterType.IMAGE;
  if (isVideoGenAdapter(adapter)) return AdapterType.VIDEO;
  if (isEmbeddingsAdapter(adapter)) return AdapterType.EMBEDDINGS;
  return null;
}
