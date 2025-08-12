// Minimal TTS adapter stub; replace with Coqui XTTS or system TTS.
export class XTTSProvider {
    constructor() {
        this.name = 'xtts';
    }
    async synthesize(text, _options) {
        // Placeholder: return silence buffer
        const sampleRate = 16000;
        const seconds = Math.max(0.5, Math.min(text.length / 20, 3));
        const samples = Math.floor(sampleRate * seconds);
        const audio = new Uint8Array(samples * 2); // 16-bit PCM silence
        return { audio, sampleRate, mimeType: 'audio/wav' };
    }
}
