import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { outcomeRouter } from '../../src/server/routes/outcome'

describe('POST /api/outcome/preview', () => {
  it('computes bands and totals', async () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/outcome', outcomeRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const res = await fetch(`http://127.0.0.1:${port}/api/outcome/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dc: 12, attribute: 3, skill: 2, modifiers: 1, momentum: 2, attempts: 4 })
    })
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(json.totalModifier).toBeTypeOf('number')
    expect(json.chance).toHaveProperty('success')
    server.close()
  })

  it('computes TTC preview', async () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/outcome', outcomeRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const res = await fetch(`http://127.0.0.1:${port}/api/outcome/ttc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseTimeSec: 60, difficultyFactor: 1.2, skillRank: 3, expertiseRank: 1, toolQuality: 1, situational: 0.9 })
    })
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(json.ttcSec).toBeGreaterThan(0)
    server.close()
  })

  it('computes classic success chance', async () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/outcome', outcomeRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const res = await fetch(`http://127.0.0.1:${port}/api/outcome/classic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dc: 12, attribute: 3, skill: 2, modifiers: 1 })
    })
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(json.successChance).toBeGreaterThan(0)
    expect(json.successChance).toBeLessThanOrEqual(1)
    server.close()
  })
})


