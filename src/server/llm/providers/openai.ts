import { CompletionOptions, CompletionResponse, LLMProvider, ModelMessage, StreamChunk, EmbeddingResult } from '../types'

/** OpenAI LLM provider with embedding support */
export class OpenAIProvider implements LLMProvider {
  readonly name = 'openai'
  readonly supportsTools = true
  readonly supportsStreaming = true
  readonly supportsEmbedding = true

  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
    this.baseUrl = baseUrl.replace(/\/$/, '')
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required')
    }
  }

  async complete(messages: ModelMessage[], options?: CompletionOptions): Promise<CompletionResponse> {
    const model = options?.model || 'gpt-3.5-turbo'
    
    const requestBody: any = {
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: false,
    }

    if (options?.temperature !== undefined) requestBody.temperature = options.temperature
    if (options?.maxTokens !== undefined) requestBody.max_tokens = options.maxTokens
    if (options?.topP !== undefined) requestBody.top_p = options.topP
    if (options?.stop !== undefined) requestBody.stop = options.stop

    const resp = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!resp.ok) {
      const errorText = await resp.text()
      throw new Error(`openai_chat_failed: ${resp.status} - ${errorText}`)
    }

    const json = await resp.json() as any
    const text = json?.choices?.[0]?.message?.content ?? ''
    
    const usage = json.usage ? {
      promptTokens: json.usage.prompt_tokens,
      completionTokens: json.usage.completion_tokens,
      totalTokens: json.usage.total_tokens,
    } : undefined

    return { text, usage, raw: json }
  }

  async *completeStream(messages: ModelMessage[], options?: CompletionOptions): AsyncIterable<StreamChunk> {
    const model = options?.model || 'gpt-3.5-turbo'
    
    const requestBody: any = {
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }

    if (options?.temperature !== undefined) requestBody.temperature = options.temperature
    if (options?.maxTokens !== undefined) requestBody.max_tokens = options.maxTokens
    if (options?.topP !== undefined) requestBody.top_p = options.topP
    if (options?.stop !== undefined) requestBody.stop = options.stop

    const resp = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!resp.ok || !resp.body) {
      const errorText = await resp.text()
      throw new Error(`openai_stream_failed: ${resp.status} - ${errorText}`)
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      
      for (const line of chunk.split('\n')) {
        if (!line.trim()) continue
        if (!line.startsWith('data: ')) continue
        
        const dataStr = line.slice(6)
        if (dataStr === '[DONE]') {
          yield { type: 'end' }
          return
        }

        try {
          const data = JSON.parse(dataStr)
          const delta = data?.choices?.[0]?.delta
          
          if (delta?.content) {
            yield { type: 'text', deltaText: delta.content }
          }
          
          if (data?.choices?.[0]?.finish_reason) {
            if (data.usage) {
              yield {
                type: 'usage',
                usage: {
                  promptTokens: data.usage.prompt_tokens,
                  completionTokens: data.usage.completion_tokens,
                  totalTokens: data.usage.total_tokens,
                }
              }
            }
          }
        } catch {
          // ignore parse errors on partial lines
        }
      }
    }
  }

  async embed(texts: string[], options?: { model?: string }): Promise<EmbeddingResult> {
    const model = options?.model || 'text-embedding-3-small'
    
    const resp = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: texts,
        encoding_format: 'float',
      }),
    })

    if (!resp.ok) {
      const errorText = await resp.text()
      throw new Error(`openai_embed_failed: ${resp.status} - ${errorText}`)
    }

    const json = await resp.json() as any
    
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('openai_embed_invalid_response: missing data array')
    }

    // Sort by index to ensure correct order
    const sortedData = json.data.sort((a: any, b: any) => a.index - b.index)
    const vectors = sortedData.map((item: any) => item.embedding)
    
    if (vectors.length === 0) {
      throw new Error('No embeddings generated')
    }

    const dim = vectors[0].length
    
    // Verify all vectors have the same dimension
    if (!vectors.every((v: number[]) => v.length === dim)) {
      throw new Error('Inconsistent embedding dimensions')
    }

    return { vectors, dim }
  }
}
