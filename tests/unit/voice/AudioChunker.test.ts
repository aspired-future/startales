/**
 * TC001-U2: Audio chunker frames at configured size (e.g., 20 ms or 100 ms) and encodes PCM/Opus correctly
 * 
 * Tests the audio chunking system to ensure proper frame sizing, PCM encoding,
 * and optional Opus encoding with configurable parameters.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

interface AudioChunkerConfig {
  sampleRate: number;
  frameDurationMs: number;
  encoding: 'PCM16' | 'Opus';
  maxBufferedFrames: number;
}

interface AudioFrame {
  data: Int16Array | Uint8Array;
  timestamp: number;
  sequence: number;
  encoding: 'PCM16' | 'Opus';
  sampleRate: number;
  channels: number;
}

// Mock Opus encoder
vi.mock('opus-encoder', () => ({
  OpusEncoder: vi.fn().mockImplementation(() => ({
    encode: vi.fn((pcmData: Int16Array) => {
      // Mock Opus encoding - return compressed data (simplified)
      const compressed = new Uint8Array(Math.floor(pcmData.length / 4));
      for (let i = 0; i < compressed.length; i++) {
        compressed[i] = (pcmData[i * 4] >> 8) & 0xFF;
      }
      return compressed;
    }),
    destroy: vi.fn(),
  })),
}));

class AudioChunker {
  private config: AudioChunkerConfig;
  private frameSize: number;
  private buffer: Float32Array;
  private bufferIndex: number;
  private sequence: number;
  private opusEncoder?: any;

  constructor(config: AudioChunkerConfig) {
    this.config = config;
    this.frameSize = Math.floor((config.sampleRate * config.frameDurationMs) / 1000);
    this.buffer = new Float32Array(this.frameSize);
    this.bufferIndex = 0;
    this.sequence = 0;

    if (config.encoding === 'Opus') {
      // Initialize Opus encoder (mocked in tests)
      const { OpusEncoder } = require('opus-encoder');
      this.opusEncoder = new OpusEncoder(config.sampleRate, 1); // mono
    }
  }

  /**
   * Add audio samples to the chunker
   * @param samples Float32Array of audio samples [-1, 1]
   * @param timestamp Timestamp of the first sample
   * @returns Array of complete frames ready for transmission
   */
  addSamples(samples: Float32Array, timestamp: number): AudioFrame[] {
    const frames: AudioFrame[] = [];
    let sampleIndex = 0;

    while (sampleIndex < samples.length) {
      // Fill the current buffer
      const samplesNeeded = this.frameSize - this.bufferIndex;
      const samplesAvailable = samples.length - sampleIndex;
      const samplesToCopy = Math.min(samplesNeeded, samplesAvailable);

      for (let i = 0; i < samplesToCopy; i++) {
        this.buffer[this.bufferIndex + i] = samples[sampleIndex + i];
      }

      this.bufferIndex += samplesToCopy;
      sampleIndex += samplesToCopy;

      // If buffer is full, create a frame
      if (this.bufferIndex === this.frameSize) {
        const frame = this.createFrame(this.buffer, timestamp);
        frames.push(frame);

        // Reset buffer for next frame
        this.bufferIndex = 0;
        this.sequence++;
        
        // Update timestamp for next frame
        timestamp += this.config.frameDurationMs;
      }
    }

    return frames;
  }

  private createFrame(samples: Float32Array, timestamp: number): AudioFrame {
    if (this.config.encoding === 'PCM16') {
      // Convert Float32 to Int16 PCM
      const pcmData = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        // Clamp to [-1, 1] and convert to 16-bit
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        pcmData[i] = Math.round(clamped * 32767);
      }

      return {
        data: pcmData,
        timestamp,
        sequence: this.sequence,
        encoding: 'PCM16',
        sampleRate: this.config.sampleRate,
        channels: 1,
      };
    } else if (this.config.encoding === 'Opus') {
      // Convert Float32 to Int16 for Opus encoder
      const pcmData = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        pcmData[i] = Math.round(clamped * 32767);
      }

      // Encode with Opus
      const opusData = this.opusEncoder.encode(pcmData);

      return {
        data: opusData,
        timestamp,
        sequence: this.sequence,
        encoding: 'Opus',
        sampleRate: this.config.sampleRate,
        channels: 1,
      };
    }

    throw new Error(`Unsupported encoding: ${this.config.encoding}`);
  }

  /**
   * Get any remaining partial frame (for cleanup)
   */
  flush(): AudioFrame | null {
    if (this.bufferIndex > 0) {
      // Pad with zeros and create final frame
      const paddedBuffer = new Float32Array(this.frameSize);
      paddedBuffer.set(this.buffer.subarray(0, this.bufferIndex));
      
      const frame = this.createFrame(paddedBuffer, Date.now());
      this.bufferIndex = 0;
      this.sequence++;
      
      return frame;
    }
    return null;
  }

  /**
   * Reset the chunker state
   */
  reset(): void {
    this.bufferIndex = 0;
    this.sequence = 0;
    this.buffer.fill(0);
  }

  /**
   * Get current buffer status
   */
  getBufferStatus(): { filled: number; capacity: number; percentage: number } {
    return {
      filled: this.bufferIndex,
      capacity: this.frameSize,
      percentage: (this.bufferIndex / this.frameSize) * 100,
    };
  }
}

describe('AudioChunker', () => {
  describe('PCM16 Encoding', () => {
    let chunker: AudioChunker;
    const pcmConfig: AudioChunkerConfig = {
      sampleRate: 16000,
      frameDurationMs: 20,
      encoding: 'PCM16',
      maxBufferedFrames: 10,
    };

    beforeEach(() => {
      chunker = new AudioChunker(pcmConfig);
    });

    it('should calculate correct frame size for different durations', () => {
      const config20ms = { ...pcmConfig, frameDurationMs: 20 };
      const config40ms = { ...pcmConfig, frameDurationMs: 40 };
      const config100ms = { ...pcmConfig, frameDurationMs: 100 };

      const chunker20 = new AudioChunker(config20ms);
      const chunker40 = new AudioChunker(config40ms);
      const chunker100 = new AudioChunker(config100ms);

      // 16kHz * 20ms = 320 samples
      expect(chunker20.getBufferStatus().capacity).toBe(320);
      // 16kHz * 40ms = 640 samples
      expect(chunker40.getBufferStatus().capacity).toBe(640);
      // 16kHz * 100ms = 1600 samples
      expect(chunker100.getBufferStatus().capacity).toBe(1600);
    });

    it('should create frames when buffer is full', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const samples = generateTestSamples(frameSize);
      const timestamp = Date.now();

      const frames = chunker.addSamples(samples, timestamp);

      expect(frames).toHaveLength(1);
      expect(frames[0].data).toBeInstanceOf(Int16Array);
      expect(frames[0].data.length).toBe(frameSize);
      expect(frames[0].timestamp).toBe(timestamp);
      expect(frames[0].sequence).toBe(0);
      expect(frames[0].encoding).toBe('PCM16');
    });

    it('should handle partial frames correctly', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const partialSamples = generateTestSamples(Math.floor(frameSize / 2));
      
      // First partial frame - should not produce output
      let frames = chunker.addSamples(partialSamples, Date.now());
      expect(frames).toHaveLength(0);
      expect(chunker.getBufferStatus().percentage).toBeCloseTo(50, 1);

      // Second partial frame - should complete the frame
      frames = chunker.addSamples(partialSamples, Date.now());
      expect(frames).toHaveLength(1);
      expect(chunker.getBufferStatus().percentage).toBe(0);
    });

    it('should handle multiple frames in one call', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const samples = generateTestSamples(frameSize * 2.5); // 2.5 frames worth
      const timestamp = Date.now();

      const frames = chunker.addSamples(samples, timestamp);

      expect(frames).toHaveLength(2); // Should produce 2 complete frames
      expect(frames[0].sequence).toBe(0);
      expect(frames[1].sequence).toBe(1);
      expect(frames[1].timestamp).toBe(timestamp + pcmConfig.frameDurationMs);
      
      // Should have 0.5 frame remaining in buffer
      expect(chunker.getBufferStatus().percentage).toBeCloseTo(50, 1);
    });

    it('should convert Float32 to Int16 correctly', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const samples = new Float32Array(frameSize);
      
      // Test specific values
      samples[0] = 1.0;    // Max positive
      samples[1] = -1.0;   // Max negative
      samples[2] = 0.0;    // Zero
      samples[3] = 0.5;    // Half scale
      samples[4] = -0.5;   // Negative half scale

      const frames = chunker.addSamples(samples, Date.now());
      const pcmData = frames[0].data as Int16Array;

      expect(pcmData[0]).toBe(32767);   // Max positive 16-bit
      expect(pcmData[1]).toBe(-32767);  // Max negative 16-bit
      expect(pcmData[2]).toBe(0);       // Zero
      expect(pcmData[3]).toBeCloseTo(16383, 1);  // Half scale positive
      expect(pcmData[4]).toBeCloseTo(-16383, 1); // Half scale negative
    });

    it('should clamp out-of-range values', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const samples = new Float32Array(frameSize);
      
      samples[0] = 2.0;    // Above range
      samples[1] = -2.0;   // Below range

      const frames = chunker.addSamples(samples, Date.now());
      const pcmData = frames[0].data as Int16Array;

      expect(pcmData[0]).toBe(32767);   // Clamped to max
      expect(pcmData[1]).toBe(-32767);  // Clamped to min
    });

    it('should flush partial frames', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const partialSamples = generateTestSamples(Math.floor(frameSize / 3));
      
      chunker.addSamples(partialSamples, Date.now());
      expect(chunker.getBufferStatus().percentage).toBeGreaterThan(0);

      const flushedFrame = chunker.flush();
      expect(flushedFrame).not.toBeNull();
      expect(flushedFrame!.data.length).toBe(frameSize);
      expect(chunker.getBufferStatus().percentage).toBe(0);
    });

    it('should reset state correctly', () => {
      const frameSize = Math.floor((pcmConfig.sampleRate * pcmConfig.frameDurationMs) / 1000);
      const samples = generateTestSamples(Math.floor(frameSize / 2));
      
      chunker.addSamples(samples, Date.now());
      expect(chunker.getBufferStatus().percentage).toBeGreaterThan(0);

      chunker.reset();
      expect(chunker.getBufferStatus().percentage).toBe(0);
      
      // Next frame should have sequence 0
      const fullSamples = generateTestSamples(frameSize);
      const frames = chunker.addSamples(fullSamples, Date.now());
      expect(frames[0].sequence).toBe(0);
    });
  });

  describe('Opus Encoding', () => {
    let chunker: AudioChunker;
    const opusConfig: AudioChunkerConfig = {
      sampleRate: 16000,
      frameDurationMs: 20,
      encoding: 'Opus',
      maxBufferedFrames: 10,
    };

    beforeEach(() => {
      chunker = new AudioChunker(opusConfig);
    });

    it('should create Opus-encoded frames', () => {
      const frameSize = Math.floor((opusConfig.sampleRate * opusConfig.frameDurationMs) / 1000);
      const samples = generateTestSamples(frameSize);

      const frames = chunker.addSamples(samples, Date.now());

      expect(frames).toHaveLength(1);
      expect(frames[0].data).toBeInstanceOf(Uint8Array);
      expect(frames[0].encoding).toBe('Opus');
      expect(frames[0].data.length).toBeLessThan(frameSize * 2); // Compressed
    });

    it('should handle Opus encoding errors gracefully', () => {
      // Mock encoder to throw error
      const mockEncoder = {
        encode: vi.fn().mockImplementation(() => {
          throw new Error('Opus encoding failed');
        }),
      };
      
      // Replace the encoder
      (chunker as any).opusEncoder = mockEncoder;

      const frameSize = Math.floor((opusConfig.sampleRate * opusConfig.frameDurationMs) / 1000);
      const samples = generateTestSamples(frameSize);

      expect(() => {
        chunker.addSamples(samples, Date.now());
      }).toThrow('Opus encoding failed');
    });
  });

  describe('Edge Cases', () => {
    let chunker: AudioChunker;

    beforeEach(() => {
      chunker = new AudioChunker({
        sampleRate: 16000,
        frameDurationMs: 20,
        encoding: 'PCM16',
        maxBufferedFrames: 10,
      });
    });

    it('should handle empty input', () => {
      const frames = chunker.addSamples(new Float32Array(0), Date.now());
      expect(frames).toHaveLength(0);
    });

    it('should handle very small inputs', () => {
      const frames = chunker.addSamples(new Float32Array(1), Date.now());
      expect(frames).toHaveLength(0);
      expect(chunker.getBufferStatus().filled).toBe(1);
    });

    it('should maintain sequence numbers across multiple calls', () => {
      const frameSize = Math.floor((16000 * 20) / 1000);
      const samples = generateTestSamples(frameSize);

      const frames1 = chunker.addSamples(samples, Date.now());
      const frames2 = chunker.addSamples(samples, Date.now());
      const frames3 = chunker.addSamples(samples, Date.now());

      expect(frames1[0].sequence).toBe(0);
      expect(frames2[0].sequence).toBe(1);
      expect(frames3[0].sequence).toBe(2);
    });
  });
});

/**
 * Generate test audio samples (sine wave)
 */
function generateTestSamples(length: number, frequency = 440, amplitude = 0.5): Float32Array {
  const samples = new Float32Array(length);
  const sampleRate = 16000;
  
  for (let i = 0; i < length; i++) {
    samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
  }
  
  return samples;
}
