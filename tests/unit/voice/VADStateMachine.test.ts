/**
 * TC001-U1: VAD state machine transitions (silence→speech→silence) with synthetic PCM frames
 * 
 * Tests the Voice Activity Detection state machine to ensure proper transitions
 * between silence and speech states with configurable aggressiveness and hangover time.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock webrtcvad-wasm since it's not available in test environment
vi.mock('webrtcvad-wasm', () => ({
  default: {
    create: vi.fn(() => ({
      processFrame: vi.fn(),
      destroy: vi.fn(),
    })),
  },
}));

interface VADState {
  isSpeaking: boolean;
  speechStartTime?: number;
  speechEndTime?: number;
  hangoverRemaining: number;
  preRollBuffer: Float32Array[];
}

interface VADConfig {
  aggressiveness: 0 | 1 | 2 | 3;
  preRollMs: number;
  hangoverMs: number;
  sampleRate: number;
  frameDurationMs: number;
}

// This will be implemented in the actual VAD module
class VADController {
  private state: VADState;
  private config: VADConfig;
  private frameSize: number;

  constructor(config: VADConfig) {
    this.config = config;
    this.frameSize = (config.sampleRate * config.frameDurationMs) / 1000;
    this.state = {
      isSpeaking: false,
      hangoverRemaining: 0,
      preRollBuffer: [],
    };
  }

  processFrame(frame: Int16Array, timestamp: number): VADState {
    // Mock implementation for testing
    // Real implementation will use webrtcvad-wasm
    const energy = this.calculateEnergy(frame);
    const isVoiced = energy > 0.01; // Simple energy threshold for testing

    if (isVoiced && !this.state.isSpeaking) {
      // Start of speech
      this.state.isSpeaking = true;
      this.state.speechStartTime = timestamp;
      this.state.hangoverRemaining = 0;
    } else if (!isVoiced && this.state.isSpeaking) {
      // Potential end of speech - start hangover
      if (this.state.hangoverRemaining <= 0) {
        this.state.hangoverRemaining = this.config.hangoverMs;
      } else {
        this.state.hangoverRemaining -= this.config.frameDurationMs;
        if (this.state.hangoverRemaining <= 0) {
          this.state.isSpeaking = false;
          this.state.speechEndTime = timestamp;
        }
      }
    } else if (isVoiced && this.state.isSpeaking) {
      // Continue speech - reset hangover
      this.state.hangoverRemaining = 0;
    }

    return { ...this.state };
  }

  private calculateEnergy(frame: Int16Array): number {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      const sample = frame[i] / 32768; // Normalize to [-1, 1]
      sum += sample * sample;
    }
    return Math.sqrt(sum / frame.length);
  }

  getState(): VADState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      isSpeaking: false,
      hangoverRemaining: 0,
      preRollBuffer: [],
    };
  }
}

describe('VADController', () => {
  let vadController: VADController;
  const defaultConfig: VADConfig = {
    aggressiveness: 2,
    preRollMs: 200,
    hangoverMs: 300,
    sampleRate: 16000,
    frameDurationMs: 20,
  };

  beforeEach(() => {
    vadController = new VADController(defaultConfig);
  });

  describe('State Transitions', () => {
    it('should start in silence state', () => {
      const state = vadController.getState();
      expect(state.isSpeaking).toBe(false);
      expect(state.speechStartTime).toBeUndefined();
      expect(state.hangoverRemaining).toBe(0);
    });

    it('should transition from silence to speech on voiced frame', () => {
      // Create a synthetic voiced frame (sine wave)
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5); // 440Hz at 50% amplitude
      
      const timestamp = Date.now();
      const state = vadController.processFrame(voicedFrame, timestamp);
      
      expect(state.isSpeaking).toBe(true);
      expect(state.speechStartTime).toBe(timestamp);
      expect(state.hangoverRemaining).toBe(0);
    });

    it('should maintain speech state during continuous voiced frames', () => {
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5);
      
      // Start speech
      let timestamp = Date.now();
      vadController.processFrame(voicedFrame, timestamp);
      
      // Continue with more voiced frames
      timestamp += defaultConfig.frameDurationMs;
      const state = vadController.processFrame(voicedFrame, timestamp);
      
      expect(state.isSpeaking).toBe(true);
      expect(state.hangoverRemaining).toBe(0);
    });

    it('should use hangover time before transitioning to silence', () => {
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5);
      const silentFrame = new Int16Array(frameSize); // All zeros
      
      // Start speech
      let timestamp = Date.now();
      vadController.processFrame(voicedFrame, timestamp);
      
      // Send silent frame - should start hangover
      timestamp += defaultConfig.frameDurationMs;
      let state = vadController.processFrame(silentFrame, timestamp);
      
      expect(state.isSpeaking).toBe(true); // Still speaking due to hangover
      expect(state.hangoverRemaining).toBe(defaultConfig.hangoverMs - defaultConfig.frameDurationMs);
      
      // Continue with silent frames until hangover expires
      const hangoverFrames = Math.ceil(defaultConfig.hangoverMs / defaultConfig.frameDurationMs);
      for (let i = 1; i < hangoverFrames; i++) {
        timestamp += defaultConfig.frameDurationMs;
        state = vadController.processFrame(silentFrame, timestamp);
      }
      
      expect(state.isSpeaking).toBe(false); // Should transition to silence
      expect(state.speechEndTime).toBe(timestamp);
    });

    it('should reset hangover if speech resumes during hangover period', () => {
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5);
      const silentFrame = new Int16Array(frameSize);
      
      // Start speech
      let timestamp = Date.now();
      vadController.processFrame(voicedFrame, timestamp);
      
      // Send silent frame to start hangover
      timestamp += defaultConfig.frameDurationMs;
      vadController.processFrame(silentFrame, timestamp);
      
      // Resume speech during hangover
      timestamp += defaultConfig.frameDurationMs;
      const state = vadController.processFrame(voicedFrame, timestamp);
      
      expect(state.isSpeaking).toBe(true);
      expect(state.hangoverRemaining).toBe(0); // Hangover should be reset
    });
  });

  describe('Configuration', () => {
    it('should respect different hangover times', () => {
      const shortHangoverConfig: VADConfig = {
        ...defaultConfig,
        hangoverMs: 100,
      };
      const vadWithShortHangover = new VADController(shortHangoverConfig);
      
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5);
      const silentFrame = new Int16Array(frameSize);
      
      // Start speech
      let timestamp = Date.now();
      vadWithShortHangover.processFrame(voicedFrame, timestamp);
      
      // Send silent frames
      timestamp += defaultConfig.frameDurationMs;
      vadWithShortHangover.processFrame(silentFrame, timestamp);
      
      // Should transition to silence faster with shorter hangover
      const hangoverFrames = Math.ceil(shortHangoverConfig.hangoverMs / defaultConfig.frameDurationMs);
      for (let i = 1; i < hangoverFrames; i++) {
        timestamp += defaultConfig.frameDurationMs;
        vadWithShortHangover.processFrame(silentFrame, timestamp);
      }
      
      const state = vadWithShortHangover.getState();
      expect(state.isSpeaking).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty frames gracefully', () => {
      const emptyFrame = new Int16Array(0);
      const timestamp = Date.now();
      
      expect(() => {
        vadController.processFrame(emptyFrame, timestamp);
      }).not.toThrow();
    });

    it('should handle very quiet frames as silence', () => {
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const quietFrame = generateSineWave(frameSize, 440, 0.001); // Very quiet
      
      const timestamp = Date.now();
      const state = vadController.processFrame(quietFrame, timestamp);
      
      expect(state.isSpeaking).toBe(false);
    });

    it('should reset state correctly', () => {
      const frameSize = (defaultConfig.sampleRate * defaultConfig.frameDurationMs) / 1000;
      const voicedFrame = generateSineWave(frameSize, 440, 0.5);
      
      // Start speech
      vadController.processFrame(voicedFrame, Date.now());
      expect(vadController.getState().isSpeaking).toBe(true);
      
      // Reset
      vadController.reset();
      const state = vadController.getState();
      
      expect(state.isSpeaking).toBe(false);
      expect(state.speechStartTime).toBeUndefined();
      expect(state.hangoverRemaining).toBe(0);
    });
  });
});

/**
 * Generate a synthetic sine wave for testing
 */
function generateSineWave(length: number, frequency: number, amplitude: number): Int16Array {
  const frame = new Int16Array(length);
  const sampleRate = 16000;
  
  for (let i = 0; i < length; i++) {
    const sample = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
    frame[i] = Math.round(sample * 32767); // Convert to 16-bit PCM
  }
  
  return frame;
}
