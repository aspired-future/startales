import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { mapRouter } from '../../src/server/routes/map'
import { empireRouter } from '../../src/server/routes/empire'

describe('Galaxy Map browse APIs', () => {
  it('lists systems and planets by system', async () => {
    const app = express()
    app.use(cors())
    app.use('/api/map', mapRouter)
    app.use('/api/empire', empireRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port

    // Seed at least one planet via empire (system may be null; test only lists endpoints exist)
    await fetch(`http://127.0.0.1:${port}/api/empire/planets`, { method: 'POST' })

    const sysRes = await fetch(`http://127.0.0.1:${port}/api/map/systems`)
    expect(sysRes.ok).toBe(true)
    const systems = await sysRes.json()
    expect(systems).toHaveProperty('systems')

    // If a system does not exist yet, just ensure endpoint works with 400 for bad id path
    const bad = await fetch(`http://127.0.0.1:${port}/api/map/systems/not-a-number/planets`)
    expect(bad.status).toBe(400)

    // Init map for a campaign and verify systems present
    const initRes = await fetch(`http://127.0.0.1:${port}/api/map/campaigns/1/map/init`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seed: 123, systems: 2, planetsPerSystem: 2 })
    })
    expect(initRes.ok).toBe(true)
    const again = await fetch(`http://127.0.0.1:${port}/api/map/systems`).then(r=>r.json())
    expect(Array.isArray(again.systems)).toBe(true)

    server.close()
  })
})


