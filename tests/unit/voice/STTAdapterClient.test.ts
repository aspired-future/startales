/**
 * TC001-U3: STT adapter client merges partial hypotheses into stable final transcripts
 * 
 * Tests the Speech-to-Text adapter client to ensure proper handling of partial
 * and final transcripts, utterance assembly, and timing tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

interface STTMessage {
  type: 'stt-partial' | 'stt-final' | 'stt-error';
  seq: number;
  speakerId: string;
  startTs: number;
  endTs?: number;
  text: string;
  confidence?: number;
  sessionId: string;
  channelId: string;
}

interface Utterance {
  id: string;
  speakerId: string;
  text: string;
  startTs: number;
  endTs?: number;
  confidence?: number;
  isPartial: boolean;
  lastUpdated: number;
}

interface STTClientConfig {
  maxUtteranceAge: number; // ms
  confidenceThreshold: number;
  enableCorrections: boolean;
  languageCode: string;
}

interface STTMetrics {
  firstPartialLatency: number;
  finalLatency: number;
  messagesReceived: number;
  messagesOutOfOrder: number;
  correctionsApplied: number;
}

class STTAdapterClient {
  private config: STTClientConfig;
  private utterances: Map<string, Utterance>;
  private metrics: STTMetrics;
  private eventHandlers: {
    onPartial?: (utterance: Utterance) => void;
    onFinal?: (utterance: Utterance) => void;
    onError?: (error: string, seq: number) => void;
  };

  constructor(config: STTClientConfig) {
    this.config = config;
    this.utterances = new Map();
    this.metrics = {
      firstPartialLatency: 0,
      finalLatency: 0,
      messagesReceived: 0,
      messagesOutOfOrder: 0,
      correctionsApplied: 0,
    };
    this.eventHandlers = {};
  }

  /**
   * Process incoming STT message
   */
  processMessage(message: STTMessage): void {
    this.metrics.messagesReceived++;

    try {
      switch (message.type) {
        case 'stt-partial':
          this.handlePartialMessage(message);
          break;
        case 'stt-final':
          this.handleFinalMessage(message);
          break;
        case 'stt-error':
          this.handleErrorMessage(message);
          break;
        default:
          throw new Error(`Unknown message type: ${(message as any).type}`);
      }
    } catch (error) {
      console.error('Error processing STT message:', error);
      this.eventHandlers.onError?.(error instanceof Error ? error.message : String(error), message.seq);
    }
  }

  private handlePartialMessage(message: STTMessage): void {
    const utteranceId = this.getUtteranceId(message.speakerId, message.startTs);
    const existing = this.utterances.get(utteranceId);

    if (existing && existing.lastUpdated > message.startTs) {
      // Out of order message
      this.metrics.messagesOutOfOrder++;
      return;
    }

    const utterance: Utterance = {
      id: utteranceId,
      speakerId: message.speakerId,
      text: message.text,
      startTs: message.startTs,
      endTs: message.endTs,
      confidence: message.confidence,
      isPartial: true,
      lastUpdated: Date.now(),
    };

    // Track first partial latency
    if (!existing) {
      this.metrics.firstPartialLatency = Date.now() - message.startTs;
    }

    // Check for corrections
    if (existing && existing.text !== message.text && this.config.enableCorrections) {
      this.metrics.correctionsApplied++;
    }

    this.utterances.set(utteranceId, utterance);
    this.eventHandlers.onPartial?.(utterance);
  }

  private handleFinalMessage(message: STTMessage): void {
    const utteranceId = this.getUtteranceId(message.speakerId, message.startTs);
    const existing = this.utterances.get(utteranceId);

    // Track final latency
    this.metrics.finalLatency = Date.now() - message.startTs;

    const utterance: Utterance = {
      id: utteranceId,
      speakerId: message.speakerId,
      text: message.text,
      startTs: message.startTs,
      endTs: message.endTs || Date.now(),
      confidence: message.confidence,
      isPartial: false,
      lastUpdated: Date.now(),
    };

    // Apply confidence threshold
    if (message.confidence !== undefined && message.confidence < this.config.confidenceThreshold) {
      utterance.text = `[Low confidence: ${message.confidence.toFixed(2)}] ${utterance.text}`;
    }

    this.utterances.set(utteranceId, utterance);
    this.eventHandlers.onFinal?.(utterance);
  }

  private handleErrorMessage(message: STTMessage): void {
    this.eventHandlers.onError?.(message.text, message.seq);
  }

  private getUtteranceId(speakerId: string, startTs: number): string {
    return `${speakerId}-${startTs}`;
  }

  /**
   * Set event handlers
   */
  on(event: 'partial', handler: (utterance: Utterance) => void): void;
  on(event: 'final', handler: (utterance: Utterance) => void): void;
  on(event: 'error', handler: (error: string, seq: number) => void): void;
  on(event: string, handler: any): void {
    switch (event) {
      case 'partial':
        this.eventHandlers.onPartial = handler;
        break;
      case 'final':
        this.eventHandlers.onFinal = handler;
        break;
      case 'error':
        this.eventHandlers.onError = handler;
        break;
      default:
        throw new Error(`Unknown event: ${event}`);
    }
  }

  /**
   * Get all utterances for a speaker
   */
  getUtterances(speakerId?: string): Utterance[] {
    const utterances = Array.from(this.utterances.values());
    
    if (speakerId) {
      return utterances.filter(u => u.speakerId === speakerId);
    }
    
    return utterances.sort((a, b) => a.startTs - b.startTs);
  }

  /**
   * Get current metrics
   */
  getMetrics(): STTMetrics {
    return { ...this.metrics };
  }

  /**
   * Clean up old utterances
   */
  cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.config.maxUtteranceAge;

    for (const [id, utterance] of this.utterances.entries()) {
      if (utterance.lastUpdated < cutoff && !utterance.isPartial) {
        this.utterances.delete(id);
      }
    }
  }

  /**
   * Reset client state
   */
  reset(): void {
    this.utterances.clear();
    this.metrics = {
      firstPartialLatency: 0,
      finalLatency: 0,
      messagesReceived: 0,
      messagesOutOfOrder: 0,
      correctionsApplied: 0,
    };
  }

  /**
   * Get transcript for a time range
   */
  getTranscript(startTs: number, endTs: number, speakerId?: string): string {
    const utterances = this.getUtterances(speakerId)
      .filter(u => !u.isPartial)
      .filter(u => u.startTs >= startTs && (u.endTs || u.startTs) <= endTs)
      .sort((a, b) => a.startTs - b.startTs);

    return utterances.map(u => `[${u.speakerId}] ${u.text}`).join(' ');
  }
}

describe('STTAdapterClient', () => {
  let client: STTAdapterClient;
  const defaultConfig: STTClientConfig = {
    maxUtteranceAge: 300000, // 5 minutes
    confidenceThreshold: 0.7,
    enableCorrections: true,
    languageCode: 'en-US',
  };

  beforeEach(() => {
    client = new STTAdapterClient(defaultConfig);
  });

  describe('Message Processing', () => {
    it('should handle partial messages correctly', () => {
      const onPartial = vi.fn();
      client.on('partial', onPartial);

      const message: STTMessage = {
        type: 'stt-partial',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 100,
        text: 'Hello',
        confidence: 0.8,
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message);

      expect(onPartial).toHaveBeenCalledWith(
        expect.objectContaining({
          speakerId: 'speaker1',
          text: 'Hello',
          isPartial: true,
          confidence: 0.8,
        })
      );

      const utterances = client.getUtterances();
      expect(utterances).toHaveLength(1);
      expect(utterances[0].isPartial).toBe(true);
    });

    it('should handle final messages correctly', () => {
      const onFinal = vi.fn();
      client.on('final', onFinal);

      const message: STTMessage = {
        type: 'stt-final',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 100,
        endTs: Date.now(),
        text: 'Hello world',
        confidence: 0.9,
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message);

      expect(onFinal).toHaveBeenCalledWith(
        expect.objectContaining({
          speakerId: 'speaker1',
          text: 'Hello world',
          isPartial: false,
          confidence: 0.9,
        })
      );

      const utterances = client.getUtterances();
      expect(utterances).toHaveLength(1);
      expect(utterances[0].isPartial).toBe(false);
    });

    it('should handle error messages correctly', () => {
      const onError = vi.fn();
      client.on('error', onError);

      const message: STTMessage = {
        type: 'stt-error',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now(),
        text: 'Recognition failed',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message);

      expect(onError).toHaveBeenCalledWith('Recognition failed', 1);
    });

    it('should update partial messages with corrections', () => {
      const onPartial = vi.fn();
      client.on('partial', onPartial);

      const startTs = Date.now() - 100;
      const message1: STTMessage = {
        type: 'stt-partial',
        seq: 1,
        speakerId: 'speaker1',
        startTs,
        text: 'Hello',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      const message2: STTMessage = {
        type: 'stt-partial',
        seq: 2,
        speakerId: 'speaker1',
        startTs,
        text: 'Hello world',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message1);
      client.processMessage(message2);

      expect(onPartial).toHaveBeenCalledTimes(2);
      
      const utterances = client.getUtterances();
      expect(utterances).toHaveLength(1);
      expect(utterances[0].text).toBe('Hello world');
      
      const metrics = client.getMetrics();
      expect(metrics.correctionsApplied).toBe(1);
    });

    it('should handle out-of-order messages', () => {
      const startTs = Date.now() - 100;
      const message1: STTMessage = {
        type: 'stt-partial',
        seq: 2,
        speakerId: 'speaker1',
        startTs: startTs + 50,
        text: 'Later message',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      const message2: STTMessage = {
        type: 'stt-partial',
        seq: 1,
        speakerId: 'speaker1',
        startTs,
        text: 'Earlier message',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message1);
      client.processMessage(message2); // Out of order

      const metrics = client.getMetrics();
      expect(metrics.messagesOutOfOrder).toBe(1);
    });
  });

  describe('Confidence Handling', () => {
    it('should apply confidence threshold to final messages', () => {
      const onFinal = vi.fn();
      client.on('final', onFinal);

      const lowConfidenceMessage: STTMessage = {
        type: 'stt-final',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 100,
        text: 'Uncertain text',
        confidence: 0.5, // Below threshold
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(lowConfidenceMessage);

      const utterances = client.getUtterances();
      expect(utterances[0].text).toContain('[Low confidence: 0.50]');
    });

    it('should not modify high confidence messages', () => {
      const onFinal = vi.fn();
      client.on('final', onFinal);

      const highConfidenceMessage: STTMessage = {
        type: 'stt-final',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 100,
        text: 'Clear text',
        confidence: 0.95, // Above threshold
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(highConfidenceMessage);

      const utterances = client.getUtterances();
      expect(utterances[0].text).toBe('Clear text');
    });
  });

  describe('Utterance Management', () => {
    it('should filter utterances by speaker', () => {
      const messages: STTMessage[] = [
        {
          type: 'stt-final',
          seq: 1,
          speakerId: 'speaker1',
          startTs: Date.now() - 200,
          text: 'Speaker 1 message',
          sessionId: 'session1',
          channelId: 'channel1',
        },
        {
          type: 'stt-final',
          seq: 2,
          speakerId: 'speaker2',
          startTs: Date.now() - 100,
          text: 'Speaker 2 message',
          sessionId: 'session1',
          channelId: 'channel1',
        },
      ];

      messages.forEach(msg => client.processMessage(msg));

      const speaker1Utterances = client.getUtterances('speaker1');
      const speaker2Utterances = client.getUtterances('speaker2');

      expect(speaker1Utterances).toHaveLength(1);
      expect(speaker2Utterances).toHaveLength(1);
      expect(speaker1Utterances[0].text).toBe('Speaker 1 message');
      expect(speaker2Utterances[0].text).toBe('Speaker 2 message');
    });

    it('should sort utterances by timestamp', () => {
      const now = Date.now();
      const messages: STTMessage[] = [
        {
          type: 'stt-final',
          seq: 1,
          speakerId: 'speaker1',
          startTs: now - 100,
          text: 'Second message',
          sessionId: 'session1',
          channelId: 'channel1',
        },
        {
          type: 'stt-final',
          seq: 2,
          speakerId: 'speaker1',
          startTs: now - 200,
          text: 'First message',
          sessionId: 'session1',
          channelId: 'channel1',
        },
      ];

      messages.forEach(msg => client.processMessage(msg));

      const utterances = client.getUtterances();
      expect(utterances[0].text).toBe('First message');
      expect(utterances[1].text).toBe('Second message');
    });

    it('should generate transcript for time range', () => {
      const now = Date.now();
      const messages: STTMessage[] = [
        {
          type: 'stt-final',
          seq: 1,
          speakerId: 'speaker1',
          startTs: now - 300,
          endTs: now - 250,
          text: 'Hello',
          sessionId: 'session1',
          channelId: 'channel1',
        },
        {
          type: 'stt-final',
          seq: 2,
          speakerId: 'speaker2',
          startTs: now - 200,
          endTs: now - 150,
          text: 'world',
          sessionId: 'session1',
          channelId: 'channel1',
        },
      ];

      messages.forEach(msg => client.processMessage(msg));

      const transcript = client.getTranscript(now - 350, now - 100);
      expect(transcript).toBe('[speaker1] Hello [speaker2] world');
    });
  });

  describe('Cleanup and Maintenance', () => {
    it('should clean up old utterances', () => {
      const oldMessage: STTMessage = {
        type: 'stt-final',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 400000, // 6.67 minutes ago
        text: 'Old message',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(oldMessage);
      expect(client.getUtterances()).toHaveLength(1);

      // Manually set lastUpdated to simulate old utterance
      const utterances = client.getUtterances();
      (utterances[0] as any).lastUpdated = Date.now() - 400000;

      client.cleanup();
      expect(client.getUtterances()).toHaveLength(0);
    });

    it('should not clean up partial utterances', () => {
      const partialMessage: STTMessage = {
        type: 'stt-partial',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now() - 400000,
        text: 'Partial message',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(partialMessage);
      client.cleanup();

      // Partial utterances should not be cleaned up
      expect(client.getUtterances()).toHaveLength(1);
    });

    it('should reset state correctly', () => {
      const message: STTMessage = {
        type: 'stt-final',
        seq: 1,
        speakerId: 'speaker1',
        startTs: Date.now(),
        text: 'Test message',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(message);
      expect(client.getUtterances()).toHaveLength(1);
      expect(client.getMetrics().messagesReceived).toBe(1);

      client.reset();
      expect(client.getUtterances()).toHaveLength(0);
      expect(client.getMetrics().messagesReceived).toBe(0);
    });
  });

  describe('Metrics Tracking', () => {
    it('should track message counts', () => {
      const messages: STTMessage[] = [
        {
          type: 'stt-partial',
          seq: 1,
          speakerId: 'speaker1',
          startTs: Date.now(),
          text: 'Partial',
          sessionId: 'session1',
          channelId: 'channel1',
        },
        {
          type: 'stt-final',
          seq: 2,
          speakerId: 'speaker1',
          startTs: Date.now(),
          text: 'Final',
          sessionId: 'session1',
          channelId: 'channel1',
        },
      ];

      messages.forEach(msg => client.processMessage(msg));

      const metrics = client.getMetrics();
      expect(metrics.messagesReceived).toBe(2);
    });

    it('should track latency metrics', () => {
      const startTs = Date.now() - 100;
      const partialMessage: STTMessage = {
        type: 'stt-partial',
        seq: 1,
        speakerId: 'speaker1',
        startTs,
        text: 'Partial',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      const finalMessage: STTMessage = {
        type: 'stt-final',
        seq: 2,
        speakerId: 'speaker1',
        startTs,
        text: 'Final',
        sessionId: 'session1',
        channelId: 'channel1',
      };

      client.processMessage(partialMessage);
      client.processMessage(finalMessage);

      const metrics = client.getMetrics();
      expect(metrics.firstPartialLatency).toBeGreaterThan(0);
      expect(metrics.finalLatency).toBeGreaterThan(0);
    });
  });
});
