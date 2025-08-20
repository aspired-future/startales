/**
 * Embeddings Adapter Interface and Types
 */

import { z } from 'zod';
import { BaseAdapter } from './base.js';

// Embeddings Types
export interface EmbeddingsOptions {
  model?: string;
  dimensions?: number;
  encodingFormat?: 'float' | 'base64';
  user?: string;
}

export interface EmbeddingsResult {
  vectors: number[][];
  model: string;
  dimensions: number;
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}

// Embeddings Adapter Interface
export interface EmbeddingsAdapter extends BaseAdapter {
  embed(texts: string[], options?: EmbeddingsOptions): Promise<EmbeddingsResult>;
}

// Zod Schemas
export const EmbeddingsOptionsSchema = z.object({
  model: z.string().optional(),
  dimensions: z.number().positive().optional(),
  encodingFormat: z.enum(['float', 'base64']).optional(),
  user: z.string().optional()
});

export const EmbeddingsResultSchema = z.object({
  vectors: z.array(z.array(z.number())),
  model: z.string(),
  dimensions: z.number().positive(),
  usage: z.object({
    promptTokens: z.number().nonnegative(),
    totalTokens: z.number().nonnegative()
  }).optional()
});

// Type Guards
export function isEmbeddingsAdapter(adapter: BaseAdapter): adapter is EmbeddingsAdapter {
  return 'embed' in adapter && typeof adapter.embed === 'function';
}

// Validation Functions
export function validateEmbeddingsOptions(options: unknown): EmbeddingsOptions {
  return EmbeddingsOptionsSchema.parse(options);
}

export function validateEmbeddingsResult(result: unknown): EmbeddingsResult {
  return EmbeddingsResultSchema.parse(result);
}

// Utility Functions
export function validateVectorDimensions(vectors: number[][], expectedDimensions: number): boolean {
  return vectors.every(vector => vector.length === expectedDimensions);
}

export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude === 0 ? vector : vector.map(val => val / magnitude);
}

export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}
