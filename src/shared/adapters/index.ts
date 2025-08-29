/**
 * Provider Adapter Framework - Main Export
 * Exports all adapter interfaces, types, and utilities
 */

// Base types and utilities
export * from './base';

// Error normalization and utilities
export * from './errors';

// Metrics interfaces and utilities
export * from './metrics';

// LLM adapter
export * from './llm';

// STT adapter
export * from './stt';

// TTS adapter
export * from './tts';

// Image generation adapter
export * from './image';

// Video generation adapter (feature flagged)
export * from './video';

// Embeddings adapter
export * from './embeddings';

// Re-export commonly used types for convenience
export type {
  BaseAdapter,
  AdapterCapability,
  AdapterErrorCode
} from './base';

export type {
  LLMAdapter,
  ChatMessage,
  LLMOptions,
  LLMResult,
  LLMDelta
} from './llm';

export type {
  STTAdapter,
  AudioInput,
  STTOptions,
  STTResult,
  STTDelta
} from './stt';

export type {
  TTSAdapter,
  TTSInput,
  TTSOptions,
  TTSResult,
  TTSAudioChunk
} from './tts';

export type {
  ImageGenAdapter,
  ImageGenInput,
  ImageGenOptions,
  ImageResult,
  ImageStatus
} from './image';

export type {
  VideoGenAdapter,
  VideoGenInput,
  VideoGenOptions,
  VideoResult,
  VideoStatus
} from './video';

export type {
  EmbeddingsAdapter,
  EmbeddingsOptions,
  EmbeddingsResult
} from './embeddings';

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
