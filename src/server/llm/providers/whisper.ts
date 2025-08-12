import { STTProvider, STTStreamEvent } from '../types'

// Minimal Whisper-compatible STT adapter stub.
// Replace internals to stream to whisper.cpp server or local process.
export class WhisperSTTProvider implements STTProvider {
  readonly name = 'whisper'

  async *transcribeStream(audioStream: AsyncIterable<Uint8Array>, _options?: { language?: string; diarize?: boolean; sampleRate?: number }): AsyncIterable<STTStreamEvent> {
    // Placeholder: echo back fake partials/finals by chunk size
    let bufferLen = 0
    for await (const chunk of audioStream) {
      bufferLen += chunk.byteLength
      yield { type: 'partial', segment: { startMs: 0, endMs: 0, text: '[…]', confidence: 0.0 } }
      if (bufferLen > 8192) {
        yield { type: 'final', segment: { startMs: 0, endMs: 0, text: '[transcript]', confidence: 0.5 } }
        bufferLen = 0
      }
    }
  }
}


