import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { personalitiesRouter } from '../../src/server/routes/personalities'

describe('GET /api/personalities', () => {
  it('returns presets', async () => {
    const app = express()
    app.use(cors())
    app.use('/api/personalities', personalitiesRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const res = await fetch(`http://127.0.0.1:${port}/api/personalities`)
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(Array.isArray(json.presets)).toBe(true)
    expect(json.presets.length).toBeGreaterThan(3)
    server.close()
  })
})


