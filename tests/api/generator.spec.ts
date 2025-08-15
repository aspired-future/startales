import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { generatorRouter } from '../../src/server/routes/generator'

describe('GET /api/generator/planet', () => {
  it('returns a generated planet with civ personality', async () => {
    const app = express()
    app.use(cors())
    app.use('/api/generator', generatorRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const res = await fetch(`http://127.0.0.1:${port}/api/generator/planet`)
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(json).toHaveProperty('name')
    expect(json).toHaveProperty('biome')
    expect(json).toHaveProperty('civilization')
    expect(json.civilization).toHaveProperty('name')
    server.close()
  })
})


