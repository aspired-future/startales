import { Router } from 'express'
import express from 'express'
import { getSTTProvider, getTTSProvider } from '../llm/factory.js'
import { wsHub } from '../ws/hub.js'

export const audioRouter = Router()

// Raw audio endpoint for STT (simple non-streaming wrapper)
audioRouter.post(
  '/stt',
  express.raw({ type: ['audio/*', 'application/octet-stream'], limit: '25mb' }),
  async (req, res) => {
    try {
      const providerName = (req.query.provider as string) || 'whisper'
      const language = (req.query.language as string) || undefined
      const sampleRate = req.query.sampleRate ? Number(req.query.sampleRate) : undefined
      const stt = getSTTProvider(providerName)
      const body = new Uint8Array(req.body as Buffer)
      async function* oneChunk() {
        yield body
      }
      const segments: { startMs: number; endMs: number; text: string; confidence?: number }[] = []
      for await (const ev of stt.transcribeStream(oneChunk(), { language, sampleRate })) {
        if (ev.type === 'final' && ev.segment) {
          segments.push({
            startMs: ev.segment.startMs,
            endMs: ev.segment.endMs,
            text: ev.segment.text,
            confidence: ev.segment.confidence,
          })
          const campaignId = (req.query.campaignId as string) || 'default'
          wsHub.broadcast(campaignId, { type: 'caption', text: ev.segment.text })
        }
      }
      const text = segments.map(s => s.text).join(' ').trim()
      res.json({ provider: providerName, text, segments })
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'stt_failed' })
    }
  }
)

// TTS: synthesize text
audioRouter.post('/tts', express.json(), async (req, res) => {
  try {
    const { text, voice, rate, volume, provider = 'xtts' } = req.body || {}
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text_required' })
    }
    const tts = getTTSProvider(provider)
    const { audio, sampleRate, mimeType } = await tts.synthesize(text, { voice, rate, volume })
    res.json({ provider, sampleRate, mimeType, dataBase64: Buffer.from(audio).toString('base64') })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'tts_failed' })
  }
})


