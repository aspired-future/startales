/** Minimal Ollama LLM provider using /api/chat */
export class OllamaProvider {
    constructor(baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
        this.name = 'ollama';
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    async complete(messages, options) {
        const model = options?.model || 'llama3';
        const resp = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                stream: false,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                options: {
                    temperature: options?.temperature,
                    num_ctx: options?.maxTokens,
                },
            }),
        });
        if (!resp.ok)
            throw new Error(`ollama_chat_failed: ${resp.status}`);
        const json = await resp.json();
        const text = json?.message?.content ?? '';
        return { text, raw: json };
    }
    async *completeStream(messages, options) {
        const model = options?.model || 'llama3';
        const resp = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                stream: true,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                options: {
                    temperature: options?.temperature,
                    num_ctx: options?.maxTokens,
                },
            }),
        });
        if (!resp.ok || !resp.body)
            throw new Error(`ollama_stream_failed: ${resp.status}`);
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value);
            // Ollama streams JSON lines per chunk
            for (const line of chunk.split('\n')) {
                if (!line.trim())
                    continue;
                try {
                    const evt = JSON.parse(line);
                    if (evt?.message?.content)
                        yield { type: 'text', deltaText: evt.message.content };
                    if (evt?.done)
                        yield { type: 'end' };
                }
                catch {
                    // ignore parse errors on partial lines
                }
            }
        }
    }
}
