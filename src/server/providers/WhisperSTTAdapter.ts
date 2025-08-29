/**
 * Real Whisper STT Adapter for the Provider Adapter Framework
 * Supports both local Whisper and AWS-hosted Whisper endpoints
 */

import { 
  STTAdapter, 
  STTOptions, 
  STTResult, 
  STTStreamEvent,
  AdapterCapability,
  AdapterDependencies,
  AdapterError,
  AdapterErrorCode
} from '../../shared/adapters/index';
import { createTimer } from '../../shared/adapters/metrics';

interface WhisperConfig {
  endpoint?: string; // For AWS-hosted Whisper
  model?: string;
  language?: string;
  temperature?: number;
  apiKey?: string; // For OpenAI Whisper API fallback
}

export class WhisperSTTAdapter implements STTAdapter {
  private config: WhisperConfig;
  private dependencies: AdapterDependencies;
  private isLocal: boolean;

  constructor(config: WhisperConfig, dependencies: AdapterDependencies) {
    this.config = config;
    this.dependencies = dependencies;
    this.isLocal = !config.endpoint || config.endpoint.includes('localhost') || config.endpoint.includes('127.0.0.1');
  }

  async getCapabilities(): Promise<AdapterCapability> {
    return {
      models: [
        'whisper-large-v3',
        'whisper-large-v2', 
        'whisper-medium',
        'whisper-base',
        'whisper-tiny'
      ],
      cost: this.isLocal ? {
        inputPer1K: 0,
        outputPer1K: 0,
        unit: 'minutes'
      } : {
        inputPer1K: 0.006, // $0.006 per minute for OpenAI API
        outputPer1K: 0,
        unit: 'minutes'
      },
      maxTokens: 448, // Whisper max tokens per segment
      contextWindow: 30000, // 30 seconds max audio length per request
      streaming: true,
      languages: [
        'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi',
        'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'he', 'th', 'vi', 'id', 'ms'
      ],
      notes: this.isLocal ? 
        'Local Whisper - free after setup, requires GPU for optimal performance' :
        'AWS-hosted Whisper - pay per minute of audio processed'
    };
  }

  async transcribe(options: STTOptions): Promise<STTResult> {
    const timer = createTimer();
    
    try {
      if (!options.audioData) {
        throw new AdapterError(
          AdapterErrorCode.INVALID_REQUEST,
          'Audio data is required for transcription'
        );
      }

      let result: STTResult;

      if (this.isLocal || this.config.endpoint) {
        result = await this.transcribeLocal(options);
      } else if (this.config.apiKey) {
        result = await this.transcribeOpenAI(options);
      } else {
        throw new AdapterError(
          AdapterErrorCode.CONFIGURATION_ERROR,
          'No valid endpoint or API key configured for Whisper'
        );
      }

      // Record metrics
      if (this.dependencies.metricsSink) {
        const duration = timer();
        this.dependencies.metricsSink.onRequestEnd(
          { requestId: this.dependencies.requestId || 'unknown' },
          {
            latencyMs: duration,
            inputTokens: Math.ceil((options.audioData.length / 1024) / 60), // Approximate minutes
            outputTokens: result.text.length,
            model: options.model || 'whisper-large-v3'
          }
        );
      }

      return result;
    } catch (error) {
      if (this.dependencies.metricsSink) {
        this.dependencies.metricsSink.onRequestError(
          { requestId: this.dependencies.requestId || 'unknown' },
          error as Error
        );
      }
      throw error;
    }
  }

  private async transcribeLocal(options: STTOptions): Promise<STTResult> {
    const endpoint = this.config.endpoint || 'http://localhost:8000';
    
    // Create form data for audio upload
    const formData = new FormData();
    const audioBlob = new Blob([options.audioData], { type: options.format || 'audio/wav' });
    formData.append('file', audioBlob, 'audio.' + (options.format || 'wav'));
    
    if (options.model) formData.append('model', options.model);
    if (options.language) formData.append('language', options.language);
    if (this.config.temperature) formData.append('temperature', this.config.temperature.toString());

    const response = await fetch(`${endpoint}/v1/audio/transcriptions`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AdapterError(
        AdapterErrorCode.API_ERROR,
        `Whisper API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    
    return {
      text: data.text || '',
      confidence: data.confidence || 0.9,
      language: data.language || options.language || 'en',
      segments: data.segments?.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
        confidence: seg.confidence || 0.9
      })) || [],
      duration: data.duration || 0
    };
  }

  private async transcribeOpenAI(options: STTOptions): Promise<STTResult> {
    const formData = new FormData();
    const audioBlob = new Blob([options.audioData], { type: options.format || 'audio/wav' });
    formData.append('file', audioBlob, 'audio.' + (options.format || 'wav'));
    formData.append('model', options.model || 'whisper-1');
    
    if (options.language) formData.append('language', options.language);
    if (this.config.temperature) formData.append('temperature', this.config.temperature.toString());
    formData.append('response_format', 'verbose_json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AdapterError(
        AdapterErrorCode.API_ERROR,
        `OpenAI Whisper API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    
    return {
      text: data.text || '',
      confidence: 0.9, // OpenAI doesn't provide confidence scores
      language: data.language || options.language || 'en',
      segments: data.segments?.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
        confidence: 0.9
      })) || [],
      duration: data.duration || 0
    };
  }

  async *streamTranscribe(options: STTOptions): AsyncIterable<STTStreamEvent> {
    // For now, fall back to batch transcription
    // Real streaming would require WebSocket connection to Whisper service
    try {
      yield { type: 'start' };
      
      const result = await this.transcribe(options);
      
      // Simulate streaming by yielding segments
      if (result.segments && result.segments.length > 0) {
        for (const segment of result.segments) {
          yield {
            type: 'partial',
            text: segment.text,
            confidence: segment.confidence,
            startTime: segment.start,
            endTime: segment.end
          };
        }
      } else {
        yield {
          type: 'partial',
          text: result.text,
          confidence: result.confidence
        };
      }
      
      yield {
        type: 'final',
        text: result.text,
        confidence: result.confidence,
        language: result.language,
        duration: result.duration
      };
      
      yield { type: 'end' };
    } catch (error) {
      yield {
        type: 'error',
        error: error as Error
      };
    }
  }
}
