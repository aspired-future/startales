import { CompletionOptions, CompletionResponse, LLMProvider, ModelMessage, StreamChunk, EmbeddingResult } from '../types'

/** Anthropic LLM provider */
export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic'
  readonly supportsTools = true
  readonly supportsStreaming = true
  readonly supportsEmbedding = false

  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string, baseUrl = 'https://api.anthropic.com') {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || ''
    this.baseUrl = baseUrl.replace(/\/$/, '')
    
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required')
    }
  }

  async complete(messages: ModelMessage[], options?: CompletionOptions): Promise<CompletionResponse> {
    const model = options?.model || 'claude-3-haiku-20240307'
    
    const requestBody: any = {
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: options?.maxTokens || 1000,
    }

    if (options?.temperature !== undefined) {
      requestBody.temperature = options.temperature
    }

    if (options?.tools && options.tools.length > 0) {
      requestBody.tools = options.tools
    }

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Anthropic API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    
    return {
      content: data.content?.[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      finishReason: data.stop_reason || 'stop',
      toolCalls: data.content?.filter((c: any) => c.type === 'tool_use') || []
    }
  }

  async *stream(messages: ModelMessage[], options?: CompletionOptions): AsyncGenerator<StreamChunk> {
    const model = options?.model || 'claude-3-haiku-20240307'
    
    const requestBody: any = {
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: options?.maxTokens || 1000,
      stream: true,
    }

    if (options?.temperature !== undefined) {
      requestBody.temperature = options.temperature
    }

    if (options?.tools && options.tools.length > 0) {
      requestBody.tools = options.tools
    }

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Anthropic API error: ${response.status} ${errorText}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                yield {
                  content: parsed.delta.text,
                  finishReason: null
                }
              } else if (parsed.type === 'message_stop') {
                yield {
                  content: '',
                  finishReason: 'stop'
                }
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async embed(texts: string[], options?: { model?: string }): Promise<EmbeddingResult> {
    throw new Error('Anthropic does not support embeddings')
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      })
      return response.ok || response.status === 400 // 400 might be expected for minimal request
    } catch {
      return false
    }
  }
}
